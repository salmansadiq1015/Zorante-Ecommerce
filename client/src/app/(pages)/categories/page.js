"use client";
import MainLayout from "@/app/components/Layout/Layout";
import { Style } from "@/app/utils/CommonStyle";
import { categoryUri } from "@/app/utils/ServerURI";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Categories() {
  const [categoriesData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  //  Filter By Category
  const handleCategoryClick = (category) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <MainLayout title="Zorante - Categories">
      <div className="relative w-full py-2 mt-5 z-10 flex flex-col gap-4 px-4 sm:px-[3rem] min-h-[100vh]">
        <h1 className={`${Style.h1} text-start`}>Explore Popular Categories</h1>
        <div className="w-full flex items-center gap-5 overflow-y-auto shidden">
          <div className="flex flex-wrap gap-5 w">
            {isLoading
              ? Array.from({ length: 15 }).map((_, index) => (
                  <div className="min-w-fit animate-pulse" key={index}>
                    <div className="w-26 h-26 bg-gray-500/80 rounded-full animate-pulse "></div>
                  </div>
                ))
              : categoriesData &&
                categoriesData?.map((category, index) => (
                  <div
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
    </MainLayout>
  );
}
