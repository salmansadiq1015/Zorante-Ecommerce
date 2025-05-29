import { format } from "date-fns";
import React from "react";

function customTimeDifference(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minute${
      Math.floor(diffInSeconds / 60) === 1 ? "" : "s"
    } ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hour${
      Math.floor(diffInSeconds / 3600) === 1 ? "" : "s"
    } ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} day${
      Math.floor(diffInSeconds / 86400) === 1 ? "" : "s"
    } ago`;

  // Format date for older times
  return format(date, "MMM dd, yyyy");
}

export default function DateFormat({ createdAt }) {
  if (!createdAt) {
    return (
      <span className="text-gray-600 text-[12px] dark:text-gray-300">
        Unknown
      </span>
    );
  }

  const date = new Date(createdAt);

  if (isNaN(date)) {
    return (
      <span className="text-gray-600 text-[12px] dark:text-gray-300">
        Invalid Date
      </span>
    );
  }

  return (
    <span className="text-gray-600 text-[12px] dark:text-gray-300">
      {customTimeDifference(date)}
    </span>
  );
}
