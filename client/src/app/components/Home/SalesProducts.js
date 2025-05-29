"use client";
import { productsURI } from "@/app/utils/ServerURI";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Timer from "./Timer";
import { Style } from "@/app/utils/CommonStyle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCarousel from "../ProductCarousel";

export default function SalesProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(products);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${productsURI}/sales/products`);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="flex flex-col gap-4 z-10 py-4">
      <div
        className="w-full h-full py-4 px-2 sm:px-4 shadow1 bg-red-100 min-h-[15rem] flex flex-col gap-4 border-2 border-red-500 "
        style={{ borderRadius: "1rem" }}
      >
        <h1 className={`${Style.h1} text-start text-black`}>
          Top Trending Sale
        </h1>
        <div className="w-full min-h-[10vh] flex items-center justify-center ">
          <Timer />
        </div>
        {/* Products */}
        <div className="w-full py-4">
          {isLoading ? (
            // Skeleton Loader
            <div className="w-full flex gap-4 overflow-hidden">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full min-w-[320px] h-[250px] bg-gray-600 animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          ) : (
            <ProductCarousel products={products} />
          )}
        </div>
      </div>
    </div>
  );
}
