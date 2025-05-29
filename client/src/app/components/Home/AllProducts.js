"use client";
import { useAuth } from "@/app/content/authContent";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "../ProductCard";
import { Style } from "@/app/utils/CommonStyle";
import { FaArrowRight } from "react-icons/fa6";
import Pagination from "@/app/utils/Pagination";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AllProducts() {
  const { products, isFetching, search } = useAuth();
  const [visibleProducts, setVisibleProducts] = useState(12);
  const observerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const router = useRouter();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // ------------------------Pegination---------------------->
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // -------------------------Filter Products------------------->

  useEffect(() => {
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
    // if (selectedCategories.length > 0) {
    //   filtered = filtered.filter(
    //     (product) =>
    //       product?.category?.name &&
    //       selectedCategories.some(
    //         (category) =>
    //           category.toLowerCase() === product.category.name.toLowerCase()
    //       )
    //   );
    // }

    setFilteredProducts(filtered);
  }, [search, products]);

  // Function to load more products
  const loadMoreProducts = useCallback(() => {
    if (
      isFetchingRef.current ||
      !products?.length ||
      visibleProducts >= products.length
    )
      return;
    isFetchingRef.current = true;

    setTimeout(() => {
      setVisibleProducts((prev) => prev + 8);
      isFetchingRef.current = false;
    }, 500);
  }, [products, visibleProducts]);

  useEffect(() => {
    if (!products?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [products, loadMoreProducts]);

  return (
    <div className="py-5 bg-transparent text-black z-10 w-full min-h-[80vh] flex flex-col gap-5">
      <div className="flex items-center justify-between gap-6">
        <h1
          className={`${Style.h1} text-start text-black flex items-center gap-2 min-w-fit`}
        >
          Just for you
        </h1>
        <button
          onClick={() => router.push("/products")}
          className=" text-black font-medium text-[17px] cursor-pointer flex items-center gap-1"
        >
          View All{" "}
          <span className="p-1 rounded-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 cursor-pointer">
            <FaArrowRight size={17} className="text-white" />
          </span>
        </button>
      </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 sm:px-0">
          {isFetching
            ? Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full min-w-[320px] h-[300px] bg-gray-600 animate-pulse rounded-lg"
                ></div>
              )) // ?.slice(0, visibleProducts)
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

      {/* {!isFetching && visibleProducts < products.length && (
        <div
          ref={observerRef}
          className="h-[550px] flex justify-center items-center mt-4"
        >
          <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="w-[230px] min-w-[280px] h-[300px] bg-gray-600 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
