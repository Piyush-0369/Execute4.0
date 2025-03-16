"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const ResumeUploadInterface = () => {
  const [isClient, setIsClient] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [response, setResponse] = useState<any>(null);

  // Ensure rendering only happens on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  // Prevent hydration mismatch by rendering only after mounting
  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col text-black">
      {/* Header */}
      <div className="bg-blue-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-blue"></div>
          </div>
          <div className="flex gap-6">
            <button className="font-medium">Home</button>
            <button className="font-medium">Category</button>
            <button className="font-medium">Settings</button>
          </div>
        </div>
        <Link href="/rec" className="bg-black text-white px-4 py-2 rounded-full">
          Are you a Recruiter?
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center pt-10">
        <h1 className="text-3xl font-bold mb-10">Welcome</h1>

        {/* File Upload */}
        <div className="bg-white bg-opacity-80 w-full max-w-lg rounded-full px-6 py-4 flex items-center justify-between">
          <label htmlFor="file-upload" className="cursor-pointer">
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
          </label>

          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`px-4 py-2 rounded-md ${
              file ? "bg-black text-gray-100" : "bg-gray-400 text-gray-200"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* Success Message */}
        {uploadSuccess && (
          <div className="mt-4 text-green-600 font-medium">
            Resume uploaded successfully!
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="mt-6 p-6 bg-white shadow rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Results:</h2>

            {/* Feedback Section */}
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold text-gray-800">Feedback:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {Array.isArray(response.resume_feedback) ? (
                  response.resume_feedback.map((item: any, index: number) => (
                    <li key={index} className="flex items-start">
                      {item.type === "issue" ? (
                        <span className="mr-2 text-red-600">⚠️</span>
                      ) : item.type === "recommendation" ? (
                        <span className="mr-2 text-green-600">💡</span>
                      ) : (
                        <span className="mr-2 text-blue-600">✅</span>
                      )}
                      <span>{item.content}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-red-500">Invalid feedback format received.</p>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadInterface;
