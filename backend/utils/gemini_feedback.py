import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
GENAI_API_KEY = os.getenv("GENAI_API_KEY")

# Configure the API
genai.configure(api_key=GENAI_API_KEY)

def truncate_text(text, max_words=500):
    """Truncate text to a maximum number of words without cutting off mid-sentence."""
    words = text.split()
    if len(words) > max_words:
        return " ".join(words[:max_words]) + "..."
    return text

def generate_resume_feedback(resume_text, user_type="job_seeker", job_input=None, input_type="full_description"):
    """
    Generate AI-powered resume feedback for job seekers or recruiters.
    
    Args:
        resume_text (str): The resume content.
        user_type (str): Either "job_seeker" or "recruiter".
        job_input (str, optional): Job description or keywords (required for recruiters).
        input_type (str): "full_description" or "keywords".
    
    Returns:
        dict: Structured AI feedback.
    """
    model = genai.GenerativeModel("gemini-2.0-flash")

    if user_type.lower() == "job_seeker":
        prompt = f"""
        As a career coach, analyze this resume and provide structured feedback.
        
        Focus on:
        - Formatting and readability
        - Strength of achievements (metrics, results)
        - Relevance of skills and experience
        - Action-oriented language
        - ATS (Applicant Tracking System) optimization
        - Areas for improvement
        
        Resume:
        {resume_text}
        
        Provide the feedback in **short bullet points** without exceeding 500 words.
        """

    elif user_type.lower() == "recruiter":
        if not job_input:
            return {"error": "Job information is required for recruiter analysis."}

        if input_type.lower() == "full_description":
            prompt = f"""
            As a hiring manager, compare this resume against the job description.
            
            Job Description:
            {job_input}
            
            Resume:
            {resume_text}
            
            Provide analysis on:
            - Match percentage for the role
            - Key qualifications that align with job requirements
            - Missing skills or experience gaps
            - Potential interview questions
            - Recommendation (Strong match, Potential match, Not recommended)
            
            Keep the response under 500 words.
            """
        elif input_type.lower() == "keywords":
            keywords = "\n".join([f"- {kw.strip()}" for kw in job_input.split(",")])

            prompt = f"""
            As a hiring manager, analyze this resume based on the following keywords:
            
            Job Keywords:
            {keywords}
            
            Resume:
            {resume_text}
            
            Provide:
            - Keyword match percentage
            - Identified keywords with context
            - Important missing keywords
            - Suggestions for improvement
            - Recommendation (Strong match, Potential match, Not recommended)
            
            Keep the response concise and under 500 words.
            only provide the feedback in **short bullet points**.and only result
            """

    else:
        return {"error": "Invalid user_type. Choose either 'job_seeker' or 'recruiter'."}

    response = model.generate_content(prompt)

    # Process and limit the response to 500 words
    feedback_text = truncate_text(response.text, 500)

    # Convert feedback into a structured array for easy frontend display
    feedback_list = [
        {"type": "issue" if "⚠️" in line else "recommendation" if "💡" in line else "general",
         "content": line.strip()}
        for line in feedback_text.split("\n") if line.strip()
    ]

    return {"resume_feedback": feedback_list}
