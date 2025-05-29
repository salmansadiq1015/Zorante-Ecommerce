import React from "react";

export default function TopCards() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="w-full bg-white animate-pulse flex overflow-hidden items-center justify-between gap-4 p-3 sm:p-4 border rounded-lg shadow-md shadow-gray-300"
            >
              <div className="flex flex-col gap-2">
                <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                <div className="h-6 w-2/3 bg-gray-300 rounded"></div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="h-4 w-1/4 bg-gray-300 rounded self-end"></div>
                <div className="w-[6rem] sm:w-[8rem] h-[3rem] sm:h-[4rem] bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
