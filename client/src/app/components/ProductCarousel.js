"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Ratings from "../utils/Ratings";
import { Diamond, Eye, Flame } from "lucide-react";
import { FaCartPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../content/authContent";
import toast from "react-hot-toast";

export default function ProductCarousel({ products }) {
  const router = useRouter();
  const { setSelectedProduct } = useAuth();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    document.querySelector(".custom-prev").addEventListener("click", () => {
      document.querySelector(".swiper-button-prev").click();
    });
    document.querySelector(".custom-next").addEventListener("click", () => {
      document.querySelector(".swiper-button-next").click();
    });
  }, []);

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    if (!product || !product._id) return;

    setSelectedProduct((prevProducts) => {
      let updatedProducts = [...prevProducts];

      const existingProductIndex = updatedProducts.findIndex(
        (p) => p.product === product._id
      );

      if (existingProductIndex !== -1) {
        let existingProduct = { ...updatedProducts[existingProductIndex] };

        if (!existingProduct.colors.includes(selectedColor)) {
          existingProduct.colors = [...existingProduct.colors, selectedColor];
        }

        if (!existingProduct.sizes.includes(selectedSize)) {
          existingProduct.sizes = [...existingProduct.sizes, selectedSize];
        }

        existingProduct.quantity += quantity;

        updatedProducts[existingProductIndex] = existingProduct;
      } else {
        updatedProducts.push({
          product: product._id,
          quantity,
          price: product.price,
          colors: [selectedColor],
          sizes: [selectedSize],
          image: product.thumbnails[0],
          title: product.name,
          _id: product._id,
        });
      }

      // Save the updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedProducts));

      toast.success("Product added to cart");

      return updatedProducts;
    });
  };
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 1 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
        1380: { slidesPerView: 5 },
      }}
      navigation={{
        nextEl: ".custom-next",
        prevEl: ".custom-prev",
      }}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className="w-full"
    >
      {products &&
        products?.map((product) => (
          <SwiperSlide
            key={product?._id}
            className="group bg-white min-w-[14rem] backdrop-blur-sm  border   overflow-hidden transition-all duration-300 hover:shadow-[#9333EA]/20 hover:shadow-2xl dark:hover:border-[#9333EA]/50 hover:border-[#9333EA]/50 hover:-translate-y-1"
          >
            <div className="relative ">
              <Image
                src={product?.thumbnails[0]}
                alt={product?.name}
                width={200}
                height={250}
                className="w-full h-[250px] object-fill"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]   to-transparent"></div>

              {/* Tags */}
              <div className="absolute top-3 right-0 px-3 flex items-center justify-between w-full">
                <div className="bg-red-600/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center text-white">
                  <Diamond size={12} className="mr-1" />
                  {product?.sale?.discountPercentage}%
                </div>

                <div className="bg-[#06B6D4]/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center text-white">
                  <Flame size={12} className="mr-1 text-white" />
                  Sale
                </div>
              </div>

              {/* Quick view button (appears on hover) */}
              <div
                onClick={() => router.push(`/products/${product?._id}`)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-[0] group-hover:opacity-[1] transition-opacity duration-300 flex items-center justify-center"
              >
                <button className="px-4 py-2 cursor-pointer bg-white/20 backdrop-blur-md rounded-lg text-white font-medium border border-white/30 hover:bg-white/30 transition-colors duration-200 flex items-center">
                  <Eye size={16} className="mr-2" />
                  Quick View
                </button>
              </div>
            </div>

            <div className="p-3">
              <div
                onClick={() => router.push(`/products/${product?._id}`)}
                className="flex justify-between items-start mb-3"
              >
                <h3 className="text-lg font-semibold capitalize line-clamp-1">
                  {product?.name}
                </h3>
              </div>

              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold  text-black">
                    €{product?.price?.toFixed(2)}
                  </div>
                  <div className="text-sm  text-gray-600 line-through">
                    €{product?.estimatedPrice}
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-[1.8rem] h-[1.8rem] cursor-pointer flex items-center justify-center rounded-full  bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white hover:opacity-90 transition-opacity duration-200 "
                >
                  <FaCartPlus size={16} className=" text-white" />
                </button>
              </div>
              <Ratings rating={product?.ratings} />
            </div>
          </SwiperSlide>
        ))}
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
    </Swiper>
  );
}
