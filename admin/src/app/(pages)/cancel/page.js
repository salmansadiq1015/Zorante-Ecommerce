import React from "react";

export default function Cancel() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-red-100">
      <div className="p-10 bg-white rounded-lg shadow-lg text-center animate-fade-in flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-700">
          Your payment was not processed. Please try again.
        </p>
        <button
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
          // onClick={() => (window.location.href = "/")}
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
}
