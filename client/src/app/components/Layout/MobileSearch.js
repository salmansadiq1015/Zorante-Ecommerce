"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function MobileProductSearch({ isShow }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchTerm.trim().length > 2) {
        setLoading(true);
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/search/${searchTerm}`
          );
          setSearchResults(data.products || []);
          setShowResults(true);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
    setShowResults(false);
    setSearchTerm("");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };

  if (!isShow) return null;

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim().length > 2 && setShowResults(true)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 mt-0 w-full bg-white shadow-lg max-h-80 overflow-y-auto border border-gray-200">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse flex justify-center">
                <div className="h-4 w-4 bg-red-500 rounded-full mr-1"></div>
                <div className="h-4 w-4 bg-red-500 rounded-full mr-1 animation-delay-200"></div>
                <div className="h-4 w-4 bg-red-500 rounded-full animation-delay-400"></div>
              </div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center"
                >
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={
                        product?.thumbnails[0] ||
                        "/placeholder.svg?height=48&width=48"
                      }
                      alt={product?.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {product?.name}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {product?.description}
                    </p>
                    <p className="text-sm font-semibold text-red-600">
                      ${product?.price?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>No products found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
