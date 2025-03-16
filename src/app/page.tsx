"use client";

import { useState, useEffect } from "react";

export default function ResumeScreening() {
  const [resume, setResume] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (event) => {
    setResume(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resume) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze_resume/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
    setLoading(false);
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">AI Resume Screening</h1>
      <input type="file" onChange={handleFileChange} className="mb-4 text-black" />
      <button 
        onClick={handleUpload} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload Resume"}
      </button>
      {response && (
        <div className="mt-4 p-4 bg-white shadow rounded text-black">
          <h2 className="text-xl font-semibold">Results:</h2>
          <p><strong>Predicted Category:</strong> {response.predicted_category}</p>
          <p><strong>Feedback:</strong> {response.resume_feedback}</p>
        </div>
      )}
    </div>
  );
}
