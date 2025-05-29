"use client";
import axios from "axios";
import Crousel from "./components/Home/Crousel";
import HeaderFilter from "./components/Home/HeaderFilter";
import MainLayout from "./components/Layout/Layout";
import { categoryUri, productsURI } from "./utils/ServerURI";
import { useEffect, useState } from "react";
import { Style } from "./utils/CommonStyle";
import Categories from "./components/Home/Categories";
import SalesProducts from "./components/Home/SalesProducts";
import TrendingProducts from "./components/Home/TrendingProducts";
import AllProducts from "./components/Home/AllProducts";
import DecorativeSeparator from "./components/Home/DecorativeSeparator";
import SectionSeparator from "./components/Home/SectionSeparator";

export default function Home() {
  const [categoriesData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  //   Fetch All Categoryes
  const categories = async () => {
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${productsURI}/trending/products`);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categories();
    fetchProducts();
  }, []);
  return (
    <MainLayout>
      <div
        className={`w-full ${Style.container} min-h-screen bg-white text-black flex flex-col gap-4 z-[10] pb-6 `}
      >
        <HeaderFilter categoriesData={categoriesData} isLoading={isLoading} />
        <Crousel products={products} loading={loading} />
        {/* <SectionSeparator title="Categories" icon="tag" /> */}
        <Categories categoriesData={categoriesData} isLoading={isLoading} />
        {/* <SectionSeparator
          title="Sales Products"
          icon="sparkles"
          subtitle="Grab them before they're gone!"
        /> */}
        <SalesProducts />
        {/* <SectionSeparator title="Trending Products" icon="bag" /> */}
        <TrendingProducts products={products} loading={loading} />
        {/* <SectionSeparator
          title="All Products"
          icon="layers"
          variant="withBorder"
        /> */}
        <AllProducts />
      </div>
    </MainLayout>
  );
}
