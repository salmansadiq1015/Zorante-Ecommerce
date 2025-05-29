"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function HeaderFilter({ categoriesData, isLoading }) {
  const [active, setActive] = useState("");
  const router = useRouter();

  useEffect(() => {
    setActive(categoriesData[0]?.name);
  }, [categoriesData]);

  const handleCategoryClick = (category) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };
  return (
    <div className={`w-full h-full pt-4 pb-2 bg-transparent  z-10 `}>
      <div className="flex items-center gap-4 sm:gap-5 overflow-x-auto overflow-y-hidden shidden">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div className="min-w-fit animate-pulse" key={index}>
                <div className="w-26 h-8 bg-gray-500/80 rounded-md animate-pulse"></div>
              </div>
            ))
          : categoriesData &&
            categoriesData?.map((category, index) => (
              <div className="min-w-fit" key={index}>
                <p
                  className={`text-[16px] min-w-fit capitalize sm:text-lg font-medium px-1 py-1 transition-all duration-300 cursor-pointer ${
                    active === category
                      ? "border-b-2 border-yellow-500 text-yellow-500"
                      : "border-b-2 border-transparent text-black"
                  }`}
                  onClick={() => {
                    setActive(category);
                    handleCategoryClick(category.name);
                  }}
                >
                  {category?.name}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}
