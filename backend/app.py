from fastapi import FastAPI
from test import classify_resume
from utils.gemini_feedback import generate_resume_feedback

app = FastAPI()

@app.post("/analyze_resume/")
def analyze_resume(resume_text: str):
    category = classify_resume(resume_text)
    feedback = generate_resume_feedback(resume_text)
    return {"predicted_category": category, "resume_feedback": feedback}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
