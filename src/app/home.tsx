"use client";

import { useState, useEffect } from "react";

export default function ResumeUploadInterface() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [response, setResponse] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze_resume/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponse(data);
      setUploadSuccess(true);
      
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
    setIsUploading(false);
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-black">
      <div className="bg-blue-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white"></div>
          </div>
          <div className="flex gap-6">
            <button className="font-medium">Home</button>
            <button className="font-medium">Category</button>
            <button className="font-medium">Settings</button>
          </div>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-full">
          Are you a recruiter?
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center pt-10">
        <h1 className="text-3xl font-bold mb-32">Welcome</h1>
        <div className="bg-gray-50 bg-opacity-80 w-full max-w-lg rounded-full px-6 py-4 flex items-center justify-between">
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          <span className="text-gray-500">
            {file ? file.name : "Upload your resume"}
          </span>
          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`px-4 py-2 rounded-md ${file ? 'bg-black text-white' : 'bg-gray-400 text-gray-200'}`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        {uploadSuccess && (
          <div className="mt-4 text-green-600 font-medium">
            Resume uploaded successfully!
          </div>
        )}
        {response && (
          <div className="mt-4 p-4 bg-white shadow rounded text-black">
            <h2 className="text-xl font-semibold">Results:</h2>
            <p><strong>Predicted Category:</strong> {response.predicted_category}</p>
            <p><strong>Feedback:</strong> {response.resume_feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}
