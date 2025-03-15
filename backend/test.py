import torch
import pickle
import json
from model import NeuralNet
from nltk_utils import preprocess_text
from sklearn.feature_extraction.text import TfidfVectorizer

with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("data/resume_data.json", "r") as f:
    resume_data = json.load(f)
    categories = sorted(set(resume["category"] for resume in resume_data["resumes"]))


input_size = len(vectorizer.get_feature_names_out())
hidden_size = 32
output_size = len(categories)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(torch.load("resume_model.pth"))
model.eval()

def classify_resume(resume_text):
    processed_text = preprocess_text(resume_text)
    processed_text = " ".join(processed_text)  
    vectorized_text = vectorizer.transform([processed_text]).toarray()
    input_tensor = torch.tensor(vectorized_text, dtype=torch.float32).to(device)
    
    with torch.no_grad():
        output = model(input_tensor)
        _, predicted = torch.max(output, dim=1)
    
    return categories[predicted.item()]

if __name__ == "__main__":
    test_resume = '''Work Experience

Senior Associate Attorney

Smith & Associates Law Firm, New York, NYJanuary 2020 – Present

Represent clients in corporate legal matters, including mergers, acquisitions, and compliance issues.

Draft and review contracts, ensuring clarity, legality, and protection of clients' interests.

Provide legal advice to corporations on regulatory compliance, employment law, and risk management.

Conduct legal research and prepare detailed reports to support litigation and negotiations.

Mentor junior associates and oversee case strategies.
'''
    predicted_category = classify_resume(test_resume)
    print(f"Predicted Category: {predicted_category}")
