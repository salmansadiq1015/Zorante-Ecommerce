"use client";
import { categoryUri } from "@/app/utils/ServerURI";
import axios from "axios";
import React, { useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function FilterProducts({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedCategories,
  setSelectedCategories,
  clearFilters,
  selectedFiltersCount,
}) {
  const [categoriesData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState([minPrice || 0, maxPrice || 5000]);

  const handleChange = (newValues) => {
    setValues(newValues);
    setMinPrice(newValues[0]);
    setMaxPrice(newValues[1]);
  };

  console.log("categoriesData", categoriesData);

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  //   Fetch All Categoryes
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${categoryUri}/all/categories`);
      const categoriesData = data.categories;
      setCategoryData(categoriesData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="w-full">
      {" "}
      <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-black flex items-center gap-1">
          <span className="text-[14px] font-medium bg-red-600 shadow-md rounded-full w-6 h-6 flex items-center justify-center text-white">
            {selectedFiltersCount}
          </span>
          Selected Filters
        </h3>

        <button
          onClick={clearFilters}
          className="flex items-center text-red-500 hover:text-red-600 text-[16px] font-medium hover:underline transform transition-all duration-300 cursor-pointer"
        >
          Reset <span className="text-red-500 block md:hidden">/Close</span>
        </button>
      </div>
      {/*  */}
      <div className="w-full px-3 sm:px-4 py-3 h-full flex flex-col gap-4">
        {/* Filter by Price */}
        <div className="flex flex-col gap-3">
          <div className="p-5 bg-white  shadow-lg rounded-xl border border-gray-200 ">
            <h3 className="text-lg font-semibold text-gray-900 ">
              Price Range
            </h3>

            {/* Min & Max Price Display */}
            <div className="flex justify-between text-sm font-medium text-gray-600  mt-3">
              <span className="px-2 py-1 bg-gray-100  rounded-md shadow-sm">
                ${values[0]}
              </span>
              <span className="px-2 py-1 bg-gray-100  rounded-md shadow-sm">
                ${values[1]}
              </span>
            </div>

            {/* Range Slider */}
            <div className="relative mt-4">
              <RangeSlider
                min={0}
                max={5000}
                step={5}
                value={values}
                onInput={handleChange}
                className="custom-slider"
              />
            </div>
          </div>
        </div>
        {/* Filter By Category */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-medium text-black">Categories</h3>
          <hr className="border-gray-200 w-full" />
          <div className="flex flex-col gap-2">
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <div className="min-w-fit animate-pulse" key={index}>
                    <div className="w-26 h-8 bg-gray-500/80 rounded-md animate-pulse"></div>
                  </div>
                ))
              : categoriesData.map((category) => (
                  <label
                    key={category._id}
                    className="flex items-center gap-2 text-black"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryChange(category.name)}
                      className="w-4 h-4 cursor-pointer accent-red-600"
                    />
                    {category?.name}
                  </label>
                ))}
          </div>
        </div>

        {/* --------------- */}
      </div>
    </div>
  );
}
