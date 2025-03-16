"use client";
import React, { useState } from "react";
import axios from "axios";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
        const response = await axios.post("http://127.0.0.1:8000/analyze_resume/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const { predicted_category, resume_feedback } = response.data;

        // Ensure `resume_feedback` is an array before mapping
        if (!Array.isArray(resume_feedback)) {
            console.error("Invalid feedback format:", resume_feedback);
            return;
        }

        setMessages([
            { type: "bot", content: `🎯 **Predicted Category:** ${predicted_category}` },
            ...resume_feedback.map((item, index) => ({
                type: "bot",
                content: item.type === "issue" ? `⚠️ **Issue:** ${item.content}` :
                         item.type === "recommendation" ? `💡 **Recommendation:** ${item.content}` :
                         `✅ ${item.content}`,
                key: index
            }))
        ]);
    } catch (error) {
        console.error("Error analyzing resume:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">AI Resume Screening</h2>

      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Upload Resume
      </button>

      <div className="mt-6 space-y-3 bg-white p-4 rounded-lg shadow">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-lg ${msg.type === "bot" ? "bg-gray-900 text-white text-left" : "bg-blue-500 text-white text-right"}`}>
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}
