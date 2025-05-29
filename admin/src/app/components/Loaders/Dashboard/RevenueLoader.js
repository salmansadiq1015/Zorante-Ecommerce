import React from "react";

export default function RevenueLoader() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4">
        {/* Bar Chart Skeleton */}
        <div className="col-span-3 sm:col-span-2 bg-white shadow-md rounded-lg p-4 animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/5"></div>
          </div>

          {/* Month Navigation Skeleton */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          </div>

          <div className="h-60 bg-gray-200 rounded"></div>
        </div>

        {/* Data Table Skeleton */}
        <div className="col-span-3 sm:col-span-1 bg-white shadow-md rounded-lg p-4 max-h-[25rem] overflow-y-auto animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>

          <div className="space-y-2">
            {/* Table Header */}
            <div className="flex">
              <div className="h-4 bg-gray-300 rounded w-1/2 mr-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>

            {/* Table Rows */}
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
