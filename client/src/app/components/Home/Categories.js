"use client";
import { Style } from "@/app/utils/CommonStyle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function Categories({ categoriesData, isLoading }) {
  const [products, setProducts] = useState(categoriesData || []);
  const observer = useRef();
  const router = useRouter();

  useEffect(() => {
    setProducts(categoriesData);
  }, [categoriesData]);

  // Hide Product & Move to End
  const hideProduct = (index) => {
    setProducts((prev) => {
      const updated = [...prev];
      const hiddenItem = updated.splice(index, 1)[0];
      return [...updated, hiddenItem];
    });
  };

  // Infinite Scroll
  const lastItemRef = (node) => {
    if (isLoading || !node) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMoreProducts();
      }
    });
    observer.current.observe(node);
  };

  // Simulated API Fetch (Load More)
  const loadMoreProducts = () => {
    setTimeout(() => {
      setProducts((prev) => [...prev, ...categoriesData]);
    }, 1000);
  };

  //  Filter By Category
  const handleCategoryClick = (category) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="w-full py-2 mt-[14rem] sm:mt-5 z-10 flex flex-col gap-4 relative">
      <h1 className={`${Style.h1} text-start`}>Explore Popular Categories</h1>
      <div className="w-full flex items-center gap-5 overflow-y-auto shidden">
        <div className="flex gap-5 whitespace-nowrap animate-marquee group1 hover:animate-none">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <div className="min-w-fit animate-pulse" key={index}>
                  <div className="w-26 h-26 bg-gray-500/80 rounded-full animate-pulse "></div>
                </div>
              ))
            : products &&
              products?.map((category, index) => (
                <div
                  ref={index === products.length - 1 ? lastItemRef : null}
                  key={index}
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex flex-col items-center justify-center  min-w-fit gap-2 cursor-pointer group"
                >
                  <Image
                    src={category.image}
                    alt="Category Image"
                    width={80}
                    height={80}
                    className="rounded-full object-fill h-[80px] shadow1 w-[80px]  group-hover:border-2 group-hover:border-red-500 transition-all duration-300"
                  />
                  <p className="text-sm font-medium">{category.name}</p>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
