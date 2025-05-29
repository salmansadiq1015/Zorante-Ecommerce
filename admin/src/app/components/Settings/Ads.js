"use client";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Ads({ adsData }) {
  const [status, setStatus] = useState(adsData?.status || false);

  // Handle Update Status
  const handleUpdateStatus = async () => {
    setStatus((prev) => !prev);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/ads/update/status/${adsData._id}`,
        { status }
      );
      if (data) {
        toast.success("Ads updated successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  if (!adsData || !adsData.videoURL) {
    return <p>No video data available.</p>;
  }

  return (
    <div className="p-4 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl shadow-xl shadow-gray-200 drop-shadow-md rounded-lg bg-white overflow-hidden p-2 border">
        <div className="relative ">
          {/* Video Player */}
          <video
            src={adsData.videoURL}
            className="w-full max-h-[22rem] min-h-[18rem] object-contain rounded-lg"
            controls
            preload="metadata"
            autoPlay
            type="video/mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Video Ad</h2>
          {/* Update Status */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-700 font-medium">
              Status: {status ? "Active" : "Inactive"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={status}
                onChange={handleUpdateStatus}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer 
                peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"
              ></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
