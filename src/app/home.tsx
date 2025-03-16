import React, { useState } from 'react';

const ResumeUploadInterface = () => {
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0]);
    }
  };;

  const handleUpload = () => {
    if (!fileName) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Reset success message after a delay
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col">
      {/* Navigation bar */}
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
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center pt-10">
        <h1 className="text-3xl font-bold mb-32">Welcome</h1>
        
        <div className="bg-gray-50 bg-opacity-80 w-full max-w-lg rounded-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            
            <label htmlFor="file-add" className="cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </label>
            <input
              id="file-add"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            
            <span className="text-gray-500">
              {fileName ? fileName : "Upload your resume"}
            </span>
          </div>
          
          <button 
            onClick={handleUpload}
            disabled={!fileName || isUploading}
            className={`px-4 py-2 rounded-md ${
              fileName ? 'bg-black text-white' : 'bg-gray-400 text-gray-200'
            }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        
        {uploadSuccess && (
          <div className="mt-4 text-green-600 font-medium">
            Resume uploaded successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadInterface;
function setFileSelected(arg0: File) {
    throw new Error('Function not implemented.');
}

