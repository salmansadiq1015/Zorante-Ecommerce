import React from "react";

export default function OrderDetailLoader() {
  return (
    <div className="grid grid-cols-5 gap-4 w-full h-full">
      {/* 1 */}
      <div className="flex flex-col col-span-5 sm:col-span-3 gap-4">
        {/* Product Skeleton */}
        <div className="w-full h-full p-4 min-w-[20rem] rounded-lg bg-gray-200 animate-pulse">
          <div className="w-full sm:w-[90%] flex flex-col gap-3 min-w-[25rem]">
            {/* Header Skeleton */}
            <div className="w-full flex items-center justify-between">
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              <div className="flex items-center justify-between w-1/2">
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
            {/* Body Skeleton */}
            <div className="w-full flex items-center justify-between gap-2">
              <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-1">
                <div className="w-[3rem] h-[3rem] rounded-full bg-gray-300"></div>
                <div className="w-[70%] h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="w-12 h-4 bg-gray-300 rounded"></div>
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
            {/* HR Line Skeleton */}
            <hr className="w-full h-[2px] bg-gray-300" />
            {/* Discount, Shipping, Total Skeleton */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Address Detail Skeleton */}
        <div className="w-full h-full p-4 rounded-lg bg-gray-200 animate-pulse">
          <div className="w-full h-full flex flex-col gap-4">
            <h3 className="w-1/3 h-4 bg-gray-300 rounded"></h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-4">
                <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
              <details className="group">
                <summary className="w-1/3 h-4 bg-gray-300 rounded"></summary>
                <div className="mt-3 pl-5 border-l-2 border-gray-300 flex flex-col gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* 2 */}
      <div className="flex flex-col col-span-5 sm:col-span-2 gap-4">
        {/* General Info Skeleton */}
        <div className="w-full h-full p-4 rounded-lg bg-gray-200 animate-pulse">
          <div className="w-full h-full flex flex-col gap-4">
            <h3 className="w-1/3 h-4 bg-gray-300 rounded"></h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-4">
                <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status History Skeleton */}
        <div className="w-full h-full p-4 rounded-lg bg-gray-200 animate-pulse">
          <div className="w-full h-full flex flex-col gap-4">
            <h3 className="w-1/3 h-4 bg-gray-300 rounded"></h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
