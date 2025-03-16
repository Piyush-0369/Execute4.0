import torch
import pickle
import json
import os
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from model.model import NeuralNet
from utils.nltk_utils import preprocess_text
from utils.gemini_feedback import generate_resume_feedback
from sklearn.feature_extraction.text import TfidfVectorizer
import PyPDF2
import io

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load vectorizer
with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

# Load categories from dataset
with open("data/resume_data.json", "r") as f:
    resume_data = json.load(f)
    categories = sorted(set(resume["category"] for resume in resume_data["resumes"]))

# Model parameters
input_size = len(vectorizer.get_feature_names_out())
hidden_size = 32
output_size = len(categories)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load trained model
model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(torch.load("resume_model.pth"))
model.eval()

# Function to extract text from PDF
def extract_text_from_pdf(file: UploadFile):
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.file.read()))
    text = "\n".join(page.extract_text() for page in pdf_reader.pages if page.extract_text())
    return text

# Function to classify resumes
def classify_resume(resume_text):
    processed_text = preprocess_text(resume_text)
    processed_text = " ".join(processed_text)
    vectorized_text = vectorizer.transform([processed_text]).toarray()
    input_tensor = torch.tensor(vectorized_text, dtype=torch.float32).to(device)
    
    with torch.no_grad():
        output = model(input_tensor)
        _, predicted = torch.max(output, dim=1)
    
    return categories[predicted.item()]

@app.post("/analyze_resume/")
async def analyze_resume(
    resume: UploadFile = File(...), 
    user_type: str = Form("job_seeker"), 
    job_input: str = Form(None), 
    input_type: str = Form("full_description")
):
    if resume.filename.endswith(".pdf"):
        resume_text = extract_text_from_pdf(resume)
    else:
        resume_text = (await resume.read()).decode("utf-8")

    predicted_category = classify_resume(resume_text)
    feedback = generate_resume_feedback(resume_text, user_type, job_input, input_type)

    # Convert feedback into a structured array
    formatted_feedback = [
        {"type": "issue" if "**Issue:**" in line else "recommendation" if "**Recommendation:**" in line else "general",
         "content": line.strip().replace("**Issue:**", "").replace("**Recommendation:**", "")}
        for line in feedback.split("\n") if line.strip()
    ]
    
    return {
        "predicted_category": f"🎯 Job Category: {predicted_category}",
        "resume_feedback": formatted_feedback  # Now it's an array
    }