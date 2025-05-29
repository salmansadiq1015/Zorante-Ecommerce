"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import { bannersUri } from "@/app/utils/ServerURI";
import axios from "axios";
import Link from "next/link";
import {
  ChevronRight,
  Star,
  Heart,
  ShoppingCart,
  TrendingUp,
  Percent,
  Eye,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Crousel({ products, loading }) {
  const [bannerData, setBannerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("products:", products);

  // Fetch Banner Data
  const fetchBannerData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${bannersUri}/list`);
      setBannerData(data.banners);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  useEffect(() => {
    document.querySelector(".custom-prev").addEventListener("click", () => {
      document.querySelector(".swiper-button-prev").click();
    });
    document.querySelector(".custom-next").addEventListener("click", () => {
      document.querySelector(".swiper-button-next").click();
    });
  }, []);

  return (
    <div className="w-full max-h-[350px] pb-4 mt-2 px-0 z-[10] relative">
      {isLoading ? (
        <div className="animate-pulse flex justify-center items-center bg-gray-300/70 h-[220px] sm:h-[400px] rounded-lg p-6">
          <div className=" bg-gray-500/70 rounded-lg animate-pulse w-full h-full"></div>
        </div>
      ) : (
        <div className="w-full relative grid grid-cols-4 gap-4">
          <div className=" col-span-4 sm:col-span-3 w-full relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              className="w-full"
            >
              {bannerData.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <div className="relative flex flex-col  md:flex-row bg-green-900 text-white overflow-hidden items-center justify-between rounded-lg">
                    <Image
                      src={banner.image}
                      alt="Banner Image"
                      width={1000}
                      height={350}
                      className=" w-full h-[220px] sm:h-[350px] object-fill"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Buttons */}
            <button
              className="custom-prev absolute top-1/2 left-4 -translate-y-1/2 bg-red-100 hover:bg-red-200 text-red-600 w-[2rem] h-[2.2rem] flex items-center justify-center shadow-md transition-all duration-300 z-10 cursor-pointer"
              style={{
                clipPath:
                  " polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            >
              ❮
            </button>
            <button
              className="custom-next absolute top-1/2 right-4 -translate-y-1/2 bg-red-100 hover:bg-red-200 w-[2rem] h-[2.2rem] text-red-600  flex items-center justify-center shadow-md transition-all duration-300 z-10 cursor-pointer"
              style={{
                clipPath:
                  " polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            >
              ❯
            </button>
          </div>
          <div className="col-span-4 sm:col-span-1">
            <TrendingProducts products={products} loading={loading} />
          </div>
        </div>
      )}
    </div>
  );
}

const ProductSkeleton = () => {
  return (
    <div className="bg-white p-2 animate-pulse">
      {/* Image placeholder */}
      <div className="bg-gray-300 aspect-square rounded-sm mb-2"></div>

      {/* Category placeholder */}
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>

      {/* Title placeholder */}
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

      {/* Rating placeholder */}
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-gray-200"></div>
        ))}
      </div>

      {/* Price placeholder */}
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>

      {/* Shipping placeholder */}
      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
};

const GridProductSkeleton = () => {
  return (
    <div className="bg-white p-1 animate-pulse">
      {/* Image placeholder */}
      <div className="bg-gray-300 aspect-square rounded-sm mb-1"></div>
      {/* Price placeholder */}
      <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto mt-1"></div>
    </div>
  );
};

const TrendingProducts = ({ products, loading }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Calculate discounted price
  const getDiscountedPrice = (price, discountPercentage) => {
    return price - (price * discountPercentage) / 100;
  };

  // Format price with Euro symbol
  const formatPrice = (price) => {
    return `€${price.toFixed(2)}`;
  };

  // Get trending status text and color
  const getTrendingStatus = (product) => {
    if (!product) return { text: "New", color: "text-blue-500" };

    const purchaseRate = (product.purchased / product.quantity) * 100;

    if (purchaseRate > 50) return { text: "Hot 🔥", color: "text-red-600" };
    if (purchaseRate > 30) return { text: "Popular", color: "text-orange-500" };
    if (product.trending) return { text: "Trending", color: "text-purple-600" };
    return { text: "New", color: "text-blue-500" };
  };

  // Render star ratings
  const renderRatings = (rating) => {
    if (!rating && rating !== 0) return null;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={12}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star size={12} className="text-gray-300" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={12} className="text-gray-300" />
        ))}
        <span className="ml-1 text-xs text-gray-600">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-700 to-red-600">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-white" />
          <h2 className="text-lg font-semibold text-white">Top Trends</h2>
        </div>
        <Link
          href="/products"
          className="flex items-center text-white text-sm hover:underline"
        >
          View All
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* Products Grid - New Design */}
      <div className="bg-red-50/50 p-1 max-h-[300px] overflow-y-auto">
        {loading ? (
          // Show grid skeletons while loading
          <div className="grid grid-cols-2 gap-1">
            {[...Array(6)].map((_, index) => (
              <GridProductSkeleton key={index} />
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          // No products state
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="text-red-700 mb-2">
              <ShoppingCart size={32} />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              No trending products found
            </p>
            <Link
              href="/products"
              className="text-xs text-red-700 flex items-center hover:underline"
            >
              Browse all products <ArrowRight size={12} className="ml-1" />
            </Link>
          </div>
        ) : (
          // Render products in a grid
          <div className="grid grid-cols-3 sm:grid-cols-2 gap-1">
            {products.slice(0, 6).map((product) => {
              if (!product) return null;

              const discountedPrice = product.sale?.isActive
                ? getDiscountedPrice(
                    product.price,
                    product.sale.discountPercentage
                  )
                : product.price;
              const trendingStatus = getTrendingStatus(product);
              const isHovered = hoveredProduct === product._id;

              return (
                <motion.div
                  key={product._id}
                  className="relative bg-white border overflow-hidden group"
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.thumbnails?.[0] || "/placeholder.svg"}
                      alt={product.name || "Product image"}
                      fill
                      className={`object-cover transition-transform duration-300 ${
                        isHovered ? "scale-110" : "scale-100"
                      }`}
                    />

                    {/* Trending tag */}
                    <div
                      className={`absolute top-1 left-1 ${trendingStatus.color} text-[9px] font-medium px-1 py-0.5`}
                    >
                      ↗ {trendingStatus.text}
                    </div>

                    {/* Sale badge */}
                    {product.sale?.isActive && (
                      <div className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-medium px-1 py-0.5 rounded-sm">
                        {product.sale.discountPercentage}%
                      </div>
                    )}

                    {/* Overlay with quick action on hover */}
                    <Link
                      className={`absolute cursor-pointer inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                      href={`/products/${product._id}`}
                    >
                      <button className="bg-white rounded-full p-1.5 hover:bg-red-50 transition-colors">
                        <Eye size={14} className="text-red-700" />
                      </button>
                    </Link>
                  </div>

                  {/* Product Price */}
                  <div className="p-1 text-center">
                    <span className="font-bold text-xs text-red-700">
                      {formatPrice(discountedPrice)}
                    </span>
                    {product.sale?.isActive && (
                      <span className="text-[9px] text-gray-500 line-through ml-1">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
