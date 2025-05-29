import React from "react";

export default function Success() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-green-100">
      <div className="p-10 bg-white rounded-lg shadow-lg text-center animate-fade-in flex items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-700">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <button
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
          //   onClick={() => (window.location.href = "/")}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}
