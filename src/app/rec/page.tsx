"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const RecruiterInterface: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<
    { resume_feedback: { type: string; content: string }[] } | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>("recruiter"); // Default to recruiter

  // Automatically set user type to "recruiter" when on this page
  useEffect(() => {
    setUserType("recruiter");
    console.log("✅ UserType set to Recruiter for Gemini AI feedback");
  }, []);

  // Handle text input for job keywords
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle resume file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle AI-based resume analysis
  const handleAnalyzeResume = async () => {
    if (!file) {
      setErrorMessage("❌ Please upload a resume before searching.");
      return;
    }

    setIsUploading(true);
    setSearchResults(null);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("user_type", userType); // Ensures user_type is always recruiter
    formData.append("mode", "ai"); // Explicitly set AI mode

    if (searchQuery.trim()) {
      formData.append("job_input", searchQuery);
      formData.append("input_type", "keywords");
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze_resume/", {
        method: "POST",
        body: formData,
      });

      const textResponse = await response.text(); // Read response as text first
      console.log("Raw API Response:", textResponse); // Debugging

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = JSON.parse(textResponse); // Ensure JSON is properly parsed
      if (!data || data.error) {
        setErrorMessage(`❌ AI Error: ${data?.error || "Unknown error"}`);
      } else {
        setSearchResults(data);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      setErrorMessage(`❌ API request failed: ${error.message}`);
    }

    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col text-black rounded-3xl p-8">
      {/* Navigation Bar */}
      <nav className="bg-blue-200 p-4 flex items-center justify-between rounded-t-3xl">
        <div className="flex items-center">
         
        
          
          <div className="flex gap-8">
            <button className="font-medium focus:outline-none">Home</button>
            <button className="font-medium focus:outline-none">Category</button>
            <button className="font-medium focus:outline-none">Settings</button>
          </div>
        </div>
        <Link href="/" className="bg-black text-white px-4 py-2 rounded-full">
          Back to Job Seeker
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center pb-32">
        <h1 className="text-3xl font-bold mb-8">Hello Recruiter</h1>

        {/* Upload & Search Section */}
        <div className="bg-white shadow-md w-full max-w-lg rounded-t-3xl p-6 flex flex-col items-center space-y-4">
          {/* Resume Upload */}
          <div className="bg-gray-200 p-6 w-full rounded-t-3xl flex flex-col items-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full text-sm"
            />
            {/* Display selected file */}
            {file && (
              <p className="text-sm text-gray-700">
                📄 Selected: {file.name}
              </p>
            )}
          </div>

          {/* Search Keywords Input */}
          <input
            type="text"
            className="w-full p-2 border border-gray-400 rounded-md"
            placeholder="Enter job-related keywords (Optional)"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {/* Search Button */}
          <button
            onClick={handleAnalyzeResume}
            className="bg-gray-800 text-white px-4 py-2 rounded-md w-full"
            disabled={isUploading}
          >
            {isUploading ? "Processing..." : "Find Candidates"}
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="mt-4 text-red-600 bg-white p-3 rounded-md shadow-md">
            {errorMessage}
          </p>
        )}

        {/* AI Feedback Results */}
        {searchResults && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-lg font-bold">🔍 Results:</h2>

            <h3 className="mt-2 font-semibold">💡 AI Feedback:</h3>
            <ul className="list-disc pl-5 text-gray-700">
              {searchResults.resume_feedback.map((item, index) => (
                <li key={index} className="mb-1">
                  <span className="font-bold text-green-700">{item.type}: </span>
                  {item.content}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterInterface;