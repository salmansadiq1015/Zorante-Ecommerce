import React from "react";

export default function OrderUserLoader() {
  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="w-full min-h-[15rem] p-3 rounded-md shadow-md shadow-gray-300 drop-shadow-md bg-white animate-pulse"
            >
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="w-full h-[80%] flex items-center justify-center">
                <div className="w-full h-full bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
