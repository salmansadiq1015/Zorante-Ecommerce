"use client";

import React, { useEffect, useState, Suspense } from "react";
import MainLayout from "@/app/components/Layout/Layout";
import { useAuth } from "@/app/content/authContent";
import FilterProducts from "@/app/components/Product/FilterProducts";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Pagination from "@/app/utils/Pagination";
import ProductCard from "@/app/components/ProductCard";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaSliders } from "react-icons/fa6";

const sortingOptions = [
  {
    label: "Price: Low to High",
    value: "lowToHigh",
    icon: <FaSortAmountDown />,
  },
  { label: "Price: High to Low", value: "highToLow", icon: <FaSortAmountUp /> },
  { label: "Alphabetical (A-Z)", value: "az", icon: <FaSortAlphaDown /> },
  { label: "Alphabetical (Z-A)", value: "za", icon: <FaSortAlphaUp /> },
];

export default function Products() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const { products, isFetching, search } = useAuth();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 40;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const [sortOption, setSortOption] = useState("");
  const selectedFiltersCount =
    (selectedCategories.length > 0 ? selectedCategories.length : 0) +
    (search ? 1 : 0) +
    (minPrice !== "" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0);

  console.log("selectedCategory:", selectedCategory);

  // Apply filters
  useEffect(() => {
    setFilteredProducts(products);

    let filtered = products;

    // Search Filter
    if (search?.trim()) {
      const lowerSearch = search.toLowerCase().trim();

      filtered = filtered.filter((product) => {
        const nameMatch = product?.name?.toLowerCase().includes(lowerSearch);
        const categoryMatch = product?.category?.name
          ?.toLowerCase()
          .includes(lowerSearch);
        const priceMatch = product?.price?.toString() === lowerSearch;

        return nameMatch || categoryMatch || priceMatch;
      });
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product?.category?.name &&
          selectedCategories.some(
            (category) =>
              category.toLowerCase() === product.category.name.toLowerCase()
          )
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) =>
        product?.category?.name
          .toLowerCase()
          .includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by price range
    if (minPrice !== "" || maxPrice !== "") {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;

      filtered = filtered.filter((product) => {
        const price = Number(product.price);
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    if (sortOption === "lowToHigh") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortOption === "az") {
      filtered = [...filtered].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    } else if (sortOption === "za") {
      filtered = [...filtered].sort((a, b) =>
        b.name.toLowerCase().localeCompare(a.name.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [
    products,
    search,
    selectedCategories,
    minPrice,
    maxPrice,
    sortOption,
    selectedCategory,
  ]);

  // ------------------------Pegination---------------------->

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Clear filters
  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategories([]);
    setSortOption("");
    setSortOption(false);
    setOpenFilter(false);
  };

  return (
    <MainLayout title="Zorante - Products">
      <div className=" relative bg-transparent text-black h-screen  z-10 overflow-hidden">
        <div className="grid grid-cols-4 z-10">
          {/* Filters */}
          <div className=" hidden md:block col-span-1  sm:border-r sm:border-gray-200 w-full h-screen overflow-y-auto shidden ">
            <FilterProducts
              maxPrice={maxPrice}
              minPrice={minPrice}
              setMaxPrice={setMaxPrice}
              setMinPrice={setMinPrice}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              clearFilters={clearFilters}
              selectedFiltersCount={selectedFiltersCount}
            />
          </div>
          {/* Mobile View */}
          {openFilter && (
            <div className=" flex md:hidden absolute top-0 left-0 z-20 bg-white w-full h-screen overflow-y-auto shidden ">
              <FilterProducts
                maxPrice={maxPrice}
                minPrice={minPrice}
                setMaxPrice={setMaxPrice}
                setMinPrice={setMinPrice}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                clearFilters={clearFilters}
                selectedFiltersCount={selectedFiltersCount}
              />
            </div>
          )}
          {/* Products */}
          <div className=" col-span-4 md:col-span-3 w-full h-screen overflow-y-auto flex flex-col gap-4">
            <div className="w-full flex items-center justify-between gap-5 py-3 px-4 border-b border-gray-200">
              <div className="" onClick={() => setOpenFilter(!openFilter)}>
                <FaSliders className="text-gray-600 hover:text-gray-900 transition-all duration-300 cursor-pointer block md:hidden" />
              </div>

              <div className="relative w-full sm:w-auto max-w-[10rem]">
                <button
                  onClick={() => setOpenSort(!openSort)}
                  className="px-4 py-2 w-full sm:w-auto rounded-lg cursor-pointer text-sm font-medium bg-gray-200 hover:bg-gray-300  transition-all flex items-center justify-between"
                >
                  <Filter size={16} className="mr-2 text-gray-600 " />
                  Sort By
                  {openSort ? (
                    <ChevronUp size={16} className="ml-2" />
                  ) : (
                    <ChevronDown size={16} className="ml-2" />
                  )}
                </button>

                {openSort && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-12 right-0 w-56 bg-white  shadow-lg rounded-lg z-20"
                  >
                    <ul className="flex flex-col divide-y divide-gray-100 ">
                      {sortingOptions.map((option) => (
                        <li
                          key={option.value}
                          className="flex items-center gap-2 p-3 cursor-pointer text-gray-700  hover:bg-gray-100  transition-all"
                          onClick={() => {
                            setSortOption(option.value);
                            setOpenSort(false);
                          }}
                        >
                          {option.icon}
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
            {/* ---------------Products----------------- */}
            <div className="flex flex-col gap-5 px-4 py-4">
              {currentProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center mt-10"
                >
                  <Image
                    src="/9960436.jpg"
                    alt="No products found"
                    width={200}
                    height={200}
                    className="w-64 h-64"
                  />
                  <h3 className="text-lg font-semibold mt-4 text-gray-600">
                    No products found!
                  </h3>
                  <p className="text-gray-500">Try adjusting your filters.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
                  {isFetching
                    ? Array.from({ length: 12 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-full min-w-[320px] h-[300px] bg-gray-600 animate-pulse rounded-lg"
                        ></div>
                      ))
                    : currentProducts?.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          sale={true}
                          tranding={true}
                          isDesc={true}
                        />
                      ))}
                </div>
              )}

              {/* Pegination */}
              {currentProducts.length > 0 && (
                <div className="flex items-center justify-center w-full">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
