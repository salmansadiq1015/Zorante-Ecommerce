import React from "react";
import countries from "world-countries";
import "flag-icons/css/flag-icons.min.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function Shipping({
  shippingData,
  setSelectedShipping,
  setShippingId,
  setShow,
  handleDeleteConfirmation,
}) {
  // Create a mapping of country names to their codes
  const countryNameToCode = countries.reduce((acc, country) => {
    acc[country.name.common.toLowerCase()] = country.cca2.toLowerCase();
    return acc;
  }, {});

  return (
    <div className="relative bg-white rounded-md p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 3xl:grid-cols-8 gap-4">
        {shippingData?.map((shipping) => {
          // Get country code from the mapping
          const countryCode =
            countryNameToCode[shipping?.country?.toLowerCase()] || null;

          return (
            <div
              key={shipping._id}
              className="relative flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-lg hover:border-customRed hover:scale-105 transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedShipping(shipping)}
            >
              {/* Country Flag */}
              {countryCode ? (
                <span className={`fi fi-${countryCode} text-3xl`}></span>
              ) : (
                <span className="text-gray-400 text-xl">🌐</span>
              )}

              {/* Country Name */}
              <span className="text-sm font-medium text-gray-700">
                {shipping?.country}
              </span>

              {/* Shipping Fee */}
              <span className="text-lg font-bold text-gray-900">
                €{shipping?.fee}
              </span>

              {/* Hover Actions (Edit & Delete) */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg transition-opacity duration-300">
                <button
                  className="flex items-center justify-center w-8 h-8 bg-white text-blue-600 rounded-full hover:bg-blue-100 shadow"
                  onClick={() => {
                    setShippingId(shipping._id);
                    setShow(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="flex items-center justify-center w-8 h-8 bg-white text-red-600 rounded-full hover:bg-red-100 shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConfirmation(shipping._id);
                  }}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
