import React, { useState } from 'react';
import Link from "next/link";


const RecruiterInterface: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{ query: string; results: string } | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSummarize = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      setSearchResults({
        query: searchQuery,
        results: `Summary for "${searchQuery}" query`,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-blue-200 p-4 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-6">
          <div className="w-6 h-6 rounded-full bg-white"></div>
        </div>

        <div className="flex gap-8">
          <button className="font-medium focus:outline-none">Home</button>
          <button className="font-medium focus:outline-none">Category</button>
          <button className="font-medium focus:outline-none">Settings</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center pb-32">
        <h1 className="text-3xl font-bold mb-24">Hello Recruiter</h1>

        {/* Search Bar */}
        <div className="bg-gray-50 bg-opacity-80 w-full max-w-lg rounded-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Upload Icon */}
            <div className="w-6 h-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>

            {/* Search Input */}
            <input
              type="text"
              className="bg-transparent flex-1 outline-none text-gray-600 placeholder-gray-500"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Summarize Button */}
          <button
            onClick={handleSummarize}
            disabled={isSearching || !searchQuery.trim()}
            className={`px-4 py-2 rounded-md text-sm ${
              isSearching || !searchQuery.trim() ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-800 text-white'
            }`}
          >
            {isSearching ? 'Searching...' : 'Summarize'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-lg">
            <h3 className="font-bold">Search Results</h3>
            <p>{searchResults.results}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterInterface;
