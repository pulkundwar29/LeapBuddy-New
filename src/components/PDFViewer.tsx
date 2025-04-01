"use client";
import React, { useState } from "react";

type PDF = {
  id: number;
  pdfName: string;
  pdfUrl: string;
};

type Props = {
  pdfList: PDF[];
};

const PDFViewer = ({ pdfList }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the currently displayed PDF

  const handleNext = () => {
    if (currentIndex < pdfList.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const currentPDF = pdfList[currentIndex];

  return (
    <div className="flex flex-col h-full">
      {/* PDF Title */}
      <div className="p-4 bg-gray-200 text-center text-lg font-semibold">
        {currentPDF?.pdfName || "Untitled PDF"}
      </div>
      
      {/* PDF Viewer */}
      <div className="flex-1">
        <iframe
          src={`https://docs.google.com/gview?url=${currentPDF?.pdfUrl}&embedded=true`}
          className="w-full h-full"
          frameBorder="0"
        ></iframe>
      </div>
      
      {/* Navigation Controls */}
      <div className="p-4 bg-gray-200 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          style={{
            background: currentIndex === 0 
              ? "#d1d5db" 
              : "linear-gradient(to right, #4b5563, #374151, #1f2937)"
          }}
          className={`px-4 py-1.5 text-base rounded shadow-md transition-all duration-200 ${
            currentIndex === 0 
              ? "cursor-not-allowed text-gray-600" 
              : "text-white hover:opacity-90"
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === pdfList.length - 1}
          style={{
            background: currentIndex === pdfList.length - 1 
              ? "#d1d5db" 
              : "linear-gradient(to right, #4b5563, #374151, #1f2937)"
          }}
          className={`px-4 py-1.5 text-base rounded shadow-md transition-all duration-200 ${
            currentIndex === pdfList.length - 1
              ? "cursor-not-allowed text-gray-600"
              : "text-white hover:opacity-90"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
