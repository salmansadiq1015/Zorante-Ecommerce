"use client";
import MainLayout from "@/app/components/Layout/Layout";
import ProductCard from "@/app/components/ProductCard";
import { Style } from "@/app/utils/CommonStyle";
import { productsURI } from "@/app/utils/ServerURI";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Popular() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${productsURI}/trending/products`);
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
    <MainLayout title="Zorante - Popular Products">
      <div className="py-5 bg-transparent text-black z-10 w-full min-h-[50vh] flex flex-col gap-5 relative px-4 sm:px-[3rem] ">
        <h1
          className={`${Style.h1} text-start text-black flex items-center gap-2 min-w-fit`}
        >
          <TrendingUp className="h-6 sm:h-7 w-6 sm:w-7 text-green-500" />
          Top Trending Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-3">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="w-[230px] min-w-[280px] h-[280px] bg-gray-600 animate-pulse rounded-lg"
                ></div>
              ))
            : products?.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  sale={false}
                  tranding={true}
                  isDesc={false}
                />
              ))}
        </div>
      </div>
    </MainLayout>
  );
}
