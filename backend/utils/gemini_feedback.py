import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
GENAI_API_KEY = os.getenv("GENAI_API_KEY")

# Configure the API
genai.configure(api_key=GENAI_API_KEY)

def generate_resume_feedback(resume_text, user_type="job_seeker", job_input=None, input_type="full_description"):
    """
    Generate feedback on a resume for either job seekers or recruiters.
    
    Args:
        resume_text (str): The text content of the resume
        user_type (str): Either "job_seeker" or "recruiter"
        job_input (str, optional): Job description text or keywords (required for recruiters)
        input_type (str): Either "full_description" or "keywords"
    
    Returns:
        str: Feedback on the resume
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    if user_type.lower() == "job_seeker":
        prompt = f"""
        As a career coach, provide detailed feedback on this resume to help the job seeker.
        
        Focus on:
        1. Overall presentation and formatting
        2. Impact of achievements (use of metrics and results)
        3. Relevance of skills and experiences highlighted
        4. Use of action verbs and strong language
        5. ATS optimization suggestions
        6. Areas for improvement
        
        Resume:
        {resume_text}
        """
    
    elif user_type.lower() == "recruiter":
        if not job_input:
            return "Error: Job information is required for recruiter analysis."
        
        if input_type.lower() == "full_description":
            prompt = f"""
            As a hiring manager, evaluate this candidate's resume against the job description.
            
            Job Description:
            {job_input}
            
            Resume:
            {resume_text}
            
            Provide analysis on:
            1. Overall match percentage for this role
            2. Key qualifications that align with requirements
            3. Missing skills or experience gaps
            4. Potential interview questions to explore strengths/weaknesses
            5. Recommendation (Strong match, Potential match, Not recommended)
            """
        elif input_type.lower() == "keywords":
            keywords = job_input.split(',')
            keywords_formatted = "\n".join([f"- {keyword.strip()}" for keyword in keywords])
            
            prompt = f"""
            As a hiring manager, evaluate this candidate's resume against these key job requirements/keywords:
            
            Job Keywords:
            {keywords_formatted}
            
            Resume:
            {resume_text}
            
            Provide analysis on:
            1. Keyword match score (percentage of keywords found in resume)
            2. Which keywords were found and their context in the resume
            3. Important keywords missing from the resume
            4. Suggestions for how the candidate could better demonstrate these skills/qualifications
            5. Recommendation (Strong match, Potential match, Not recommended)
            """
    
    else:
        return "Error: user_type must be either 'job_seeker' or 'recruiter'"
    
    response = model.generate_content(prompt)
    return response.text

def get_multiline_input(prompt_text):
    """Get multiline input from the user"""
    print(f"{prompt_text} (Type 'DONE' on a new line when finished):")
    lines = []
    while True:
        line = input()
        if line == "DONE":
            break
        lines.append(line)
    return "\n".join(lines)

def main():
    """Interactive CLI for the resume feedback tool"""
    print("Resume Feedback Tool")
    print("====================")
    
    user_type = input("Are you a job seeker or recruiter? ").lower()
    
    if user_type not in ["job_seeker", "recruiter"]:
        print("Invalid user type. Please enter 'job_seeker' or 'recruiter'.")
        return
    
    input_method = input("Would you like to [1] upload a file or [2] type your resume? (Enter 1 or 2): ")
    
    resume_text = ""
    
    if input_method == "1":
        resume_path = input("Enter the path to your resume text file: ")
        try:
            with open(resume_path, 'r') as file:
                resume_text = file.read()
        except FileNotFoundError:
            print(f"File not found: {resume_path}")
            return
    elif input_method == "2":
        resume_text = get_multiline_input("Please type your resume")
    else:
        print("Invalid choice. Please restart the program.")
        return
    
    # Check if resume was provided
    if not resume_text.strip():
        print("Error: Resume text is empty.")
        return
    
    job_input = None
    input_type = "full_description"
    
    if user_type == "recruiter":
        job_input_type = input("Would you like to use [1] a full job description or [2] job keywords? (Enter 1 or 2): ")
        
        if job_input_type == "1":
            input_type = "full_description"
            jd_input_method = input("Would you like to [1] upload a job description file or [2] type the job description? (Enter 1 or 2): ")
            
            if jd_input_method == "1":
                jd_path = input("Enter the path to the job description text file: ")
                try:
                    with open(jd_path, 'r') as file:
                        job_input = file.read()
                except FileNotFoundError:
                    print(f"File not found: {jd_path}")
                    return
            elif jd_input_method == "2":
                job_input = get_multiline_input("Please type the job description")
            else:
                print("Invalid choice. Please restart the program.")
                return
        elif job_input_type == "2":
            input_type = "keywords"
            job_input = input("Enter job keywords (comma-separated): ")
        else:
            print("Invalid choice. Please restart the program.")
            return
        
        # Check if job input was provided
        if not job_input.strip():
            print("Error: Job information is empty.")
            return
    
    print("\nGenerating feedback... This may take a moment.\n")
    feedback = generate_resume_feedback(resume_text, user_type, job_input, input_type)
    print("Feedback:")
    print("=========")
    print(feedback)

if __name__ == "__main__":
    main()