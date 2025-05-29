"use client";

import { useState, useEffect, useRef, useMemo, use, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
  Check,
  Clock,
  Diamond,
  Package,
  ShieldCheck,
  RefreshCw,
  Leaf,
  Settings,
  Feather,
  ArrowLeft,
} from "lucide-react";

const defaultHighlights = [
  { text: "High-quality materials for durability", icon: ShieldCheck },
  { text: "Ergonomic design for comfort", icon: Feather },
  { text: "Lightweight and portable", icon: Package },
  { text: "Easy to clean and maintain", icon: RefreshCw },
  { text: "Compatible with most standard accessories", icon: Settings },
  { text: "Eco-friendly and sustainable manufacturing", icon: Leaf },
  { text: "Sleek and modern aesthetics", icon: Star },
  { text: "Reliable performance with long lifespan", icon: Check },
];

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/app/components/Layout/Layout";
import axios from "axios";
import ProductCarousel from "@/app/components/ProductCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/app/content/authContent";
import toast from "react-hot-toast";
import ShareData from "@/app/utils/Share";

export default function ProductDetail() {
  const { setSelectedProduct, setOneClickBuyProduct } = useAuth();
  const { id: productId } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("White");
  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const productRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window?.location?.origin);
    }
  }, []);

  // console.log("product", product);

  // Product data
  const fetchProductDetail = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/product/detail/${productId}`
      );
      setProduct(data.product);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

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

  // One Click Buy Now
  const handleOneClickBuy = async (product) => {
    const productData = {
      product: product._id,
      quantity,
      price: product.price,
      colors: [selectedColor],
      sizes: [selectedSize],
      image: product.thumbnails[0],
      title: product.name,
      _id: product._id,
    };

    localStorage.setItem("oneClickBuyProduct", JSON.stringify(productData));
    setOneClickBuyProduct(productData);
    router.push("/oneclick/checkout");
  };

  // Calculate average rating
  const averageRating =
    product?.reviews?.reduce((acc, review) => acc + review.rating, 0) /
    product?.reviews?.length;

  // Calculate rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0];
  product?.reviews?.forEach((review) => {
    const ratingIndex = Math.floor(review.rating) - 1;
    if (ratingIndex >= 0 && ratingIndex < 5) {
      ratingDistribution[ratingIndex]++;
    }
  });

  // Calculate sale end time
  const saleEndDate = useMemo(() => {
    return product?.sale?.isActive ? new Date(product?.sale?.saleExpiry) : null;
  }, [product?.sale?.isActive, product?.sale?.saleExpiry]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!saleEndDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const difference = saleEndDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [saleEndDate]);

  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  // Handle image navigation
  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === product?.thumbnails?.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? product?.thumbnails?.length - 1 : prev - 1
    );
  };

  // Handle image zoom
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  // Handle sticky add to cart bar
  useEffect(() => {
    const handleScroll = () => {
      if (!productRef.current) return;

      const productPosition = productRef.current.getBoundingClientRect().top;
      const productHeight = productRef.current.offsetHeight;
      const scrollPosition = window.scrollY;

      if (scrollPosition > productPosition + productHeight / 2) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch related products
  const fetchRelatedProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/category/${product?.category?._id}`
      );
      setRelatedProducts(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatedProducts();
    // eslint-disable-next-line
  }, [product?.category?._id]);

  const handleFavorite = (productId) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(productId)) {
      favorites = favorites.filter((id) => id !== productId);
    } else {
      favorites.push(productId);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(product._id)) {
      setIsWishlisted(true);
    }
  }, [product]);

  // Add product to recent View Products
  useEffect(() => {
    if (!product?._id) return;

    const now = Date.now();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const viewDate = new Date().toISOString();

    // Get existing recent products from localStorage
    let recentProducts =
      JSON.parse(localStorage.getItem("recentProducts")) || [];

    // Filter out expired products (older than 3 days)
    recentProducts = recentProducts.filter(
      (item) => now - item.timestamp < threeDaysInMs
    );

    // Check if product already exists
    const existingIndex = recentProducts.findIndex(
      (item) => item.id === product._id
    );

    if (existingIndex === -1) {
      // Add new product if it's not a duplicate
      recentProducts.push({ id: product._id, timestamp: now, viewDate });
    } else {
      // Update the timestamp and viewDate if it already exists
      recentProducts[existingIndex].timestamp = now;
      recentProducts[existingIndex].viewDate = viewDate;
    }

    // Update localStorage
    localStorage.setItem("recentProducts", JSON.stringify(recentProducts));
  }, [product]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Image skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="flex space-x-2">
                <Skeleton className="h-24 w-24 rounded" />
                <Skeleton className="h-24 w-24 rounded" />
                <Skeleton className="h-24 w-24 rounded" />
              </div>
            </div>

            {/* Product info skeleton */}
            <div className="space-y-6">
              <div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>

              <div>
                <Skeleton className="h-10 w-32 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>

              <Skeleton className="h-px w-full" />

              <div className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-24 mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-6 w-24 mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <Skeleton className="h-12 w-12 rounded-md" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-6 w-24 mb-3" />
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-40" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Skeleton className="h-14 flex-1 rounded-xl" />
                <Skeleton className="h-14 flex-1 rounded-xl" />
                <Skeleton className="h-14 w-14 rounded-xl" />
                <Skeleton className="h-14 w-14 rounded-xl" />
              </div>
            </div>
          </div>

          <Skeleton className="h-14 w-full max-w-md mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // If product data is empty after loading
  if (!loading && (!product || Object.keys(product).length === 0)) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout title="Product Detail - Zorante">
      <div className="bg-white min-h-screen relative z-10 px-4 sm:px-[2rem] md:px-[3rem] ">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-gray-500">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              {product?.category?.name && (
                <ChevronRight className="h-4 w-4 mx-2" />
              )}
              {product?.category?.name && (
                <Link
                  href="/categories"
                  className="hover:text-primary transition-colors"
                >
                  {product?.category?.name}
                </Link>
              )}
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-red-600 font-medium truncate">
                {product?.name?.slice(0, 40)}...
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-7xl" ref={productRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/*---------------------------
          Left  Product Images
            --------------------------*/}
            <motion.div
              className="space-y-4 "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="relative aspect-square overflow-hidden rounded border bg-background"
                ref={imageRef}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div
                    className={`relative w-full h-full  transition-transform duration-200 ${
                      isZoomed ? "scale-150" : "scale-100"
                    }`}
                    style={
                      isZoomed
                        ? {
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          }
                        : undefined
                    }
                  >
                    <Image
                      src={
                        (product?.thumbnails &&
                          product?.thumbnails[activeImageIndex]) ||
                        "/placeholder.svg"
                      }
                      alt={product?.name || "Product"}
                      fill
                      className="object-fill"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                    <span className="sr-only">Previous image</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                    <span className="sr-only">Next image</span>
                  </Button>
                </div>
                {product?.estimatedPrice &&
                  product?.estimatedPrice > product?.price && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-red-600/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center text-white">
                        <Diamond size={12} className="mr-1" />
                        {product?.estimatedPrice > product?.price
                          ? `${(
                              (1 - product?.price / product?.estimatedPrice) *
                              100
                            ).toFixed(0)}% OFF`
                          : ""}
                      </div>
                    </div>
                  )}
                {product?.trending && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#06B6D4]/80 hover:bg-[#06B6D4] text-white font-semibold px-3 py-1.5 text-sm rounded-full">
                      Trending
                    </Badge>
                  </div>
                )}
                {isZoomed && (
                  <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                    Hover to zoom
                  </div>
                )}
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide shidden">
                {product?.thumbnails?.map((thumbnail, index) => (
                  <button
                    key={index}
                    className={`relative h-24 w-24 min-w-24 cursor-pointer rounded border-2 overflow-hidden transition-all ${
                      activeImageIndex === index
                        ? "border-red-500  shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={thumbnail || "/placeholder.svg"}
                      alt={`${product?.name} thumbnail ${index + 1}`}
                      fill
                      className="object-fill "
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* -------------------Product Info---------------------- */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    href={`/category/${product?.category?.name.toLowerCase()}`}
                  >
                    <Badge
                      variant="outline"
                      className="text-xs font-normal hover:bg-gray-50"
                    >
                      {product?.category?.name}
                    </Badge>
                  </Link>
                  {product?.trending && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs"
                    >
                      Trending
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {product?.name}
                </h1>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(averageRating)
                            ? "fill-red-600 text-red-500"
                            : i < averageRating
                            ? "fill-red-500 text-red-400 opacity-50"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {averageRating ? averageRating?.toFixed(1) : 0.0}
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <Link
                      href="#reviews"
                      className="text-sm text-primary hover:underline"
                    >
                      {product?.reviews?.length} reviews
                    </Link>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      {product?.purchased}
                    </span>{" "}
                    sold
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    €{product?.price?.toLocaleString()}
                  </span>
                  {product?.estimatedPrice > product?.price && (
                    <span className="text text-gray-500 line-through">
                      €{product?.estimatedPrice?.toLocaleString()}
                    </span>
                  )}
                </div>

                {product?.sale?.isActive && saleEndDate && (
                  <div className="mt-3 bg-red-100 rounded p-3 border border-red-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-red-600 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>Sale ends in:</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-white rounded-md p-2 text-center shadow-sm">
                        <div className="text-xl font-bold text-gray-900">
                          {timeLeft?.days}
                        </div>
                        <div className="text-xs text-gray-500">Days</div>
                      </div>
                      <div className="bg-white rounded-md p-2 text-center shadow-sm">
                        <div className="text-xl font-bold text-gray-900">
                          {timeLeft?.hours}
                        </div>
                        <div className="text-xs text-gray-500">Hours</div>
                      </div>
                      <div className="bg-white rounded-md p-2 text-center shadow-sm">
                        <div className="text-xl font-bold text-gray-900">
                          {timeLeft?.minutes}
                        </div>
                        <div className="text-xs text-gray-500">Mins</div>
                      </div>
                      <div className="bg-white rounded-md p-2 text-center shadow-sm">
                        <div className="text-xl font-bold text-gray-900">
                          {timeLeft?.seconds}
                        </div>
                        <div className="text-xs text-gray-500">Secs</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    Shipping: {"€" + product?.shipping?.toLocaleString()} ·
                    Delivery in 3-5 business days
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-gray-500">
                    In stock: {product?.quantity} available
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                {product?.colors?.length > 0 && (
                  <div className="space-y-3">
                    <div className="font-medium text-gray-900">Color</div>
                    <div className="flex flex-wrap gap-3">
                      {product?.colors?.map((color) => (
                        <TooltipProvider key={color._id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className={`h-10 w-10 rounded-full border-2 transition-all ${
                                  selectedColor === color?.name
                                    ? "border-primary ring-4 ring-primary/20"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                style={{
                                  backgroundColor: color?.code,
                                  boxShadow:
                                    color.name === "White"
                                      ? "inset 0 0 0 1px rgba(0,0,0,0.1)"
                                      : undefined,
                                }}
                                onClick={() => setSelectedColor(color?.name)}
                                aria-label={`Select ${color?.name} color`}
                              >
                                {selectedColor === color?.name && (
                                  <Check
                                    className={`h-6 w-6 mx-auto ${
                                      color?.name === "White"
                                        ? "text-gray-800"
                                        : "text-white"
                                    }`}
                                  />
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{color?.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                )}

                {product?.sizes?.length > 0 && (
                  <div className="space-y-3">
                    <div className="font-medium text-gray-900">Size</div>
                    <div className="flex flex-wrap gap-3">
                      {product?.sizes?.map((size) => (
                        <button
                          key={size}
                          className={`h-12 min-w-12 rounded-md border-2 px-4 font-medium transition-all ${
                            selectedSize === size
                              ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <Link
                      href="#"
                      className="text-sm text-primary hover:underline inline-flex items-center"
                    >
                      Size guide
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="font-medium text-gray-900">Quantity</div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-12 rounded-r-none cursor-pointer border-gray-300 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <div className="flex h-11 w-16 items-center justify-center border-y border-red-500 text-white bg-red-600 text font-medium">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-12 rounded-l-none cursor-pointer border-gray-300 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300"
                      onClick={increaseQuantity}
                      disabled={quantity >= product?.quantity}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  className="sm:flex-1 h-12 cursor-pointer rounded text-base font-semibold bg-transparent hover:bg-primary/90 overflow-visible"
                  size="lg"
                  style={{
                    backgroundColor: "var(--primary)",
                    // clipPath:
                    //   "polygon(12% 0, 100% 0, 100% 73%, 90% 100%, 0 100%, 0 25%)",
                  }}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  className="sm:flex-1 h-12 text-base font-semibold rounded cursor-pointer bg-cyan-600 text-white hover:bg-cyan-700 overflow-visible"
                  size="lg"
                  style={{
                    backgroundColor: "rgb(8, 145, 178)",
                    // clipPath:
                    //   "polygon(12% 0, 100% 0, 100% 73%, 90% 100%, 0 100%, 0 25%)",
                    // willChange: "clip-path",
                  }}
                  onClick={() => {
                    handleOneClickBuy(product);
                    setShowStickyBar(false);
                  }}
                >
                  Buy Now
                </Button>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-12 w-12 rounded-xl border-red-200 cursor-pointer ${
                      isWishlisted
                        ? "bg-red-100 text-primary border-primary/20"
                        : "hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      setIsWishlisted(!isWishlisted);
                      handleFavorite(product._id);
                    }}
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isWishlisted ? "fill-primary text-primary" : ""
                      }`}
                    />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShow(true)}
                    className="h-12 w-12 rounded-xl border-sky-200 cursor-pointer hover:bg-sky-100 hover:text-sky-900"
                  >
                    <Share2 className="h-6 w-6" />
                    <span className="sr-only">Share product</span>
                  </Button>
                </div>
              </div>

              <div className="mt-6 bg-gray-100 rounded-xl p-4 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">
                  ✨ Product Highlights
                </h3>
                <ul className="space-y-3">
                  {(product?.features?.length > 0
                    ? product.features.map((feature) => ({
                        text: feature,
                        icon: Check,
                      }))
                    : defaultHighlights
                  ).map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-sm text-gray-700"
                    >
                      <item.icon className="h-5 w-5 text-primary shrink-0" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Product Details and Reviews */}
          <Tabs defaultValue="details" className="w-full mt-12">
            <TabsList className="w-full max-w-fit grid grid-cols-3 overflow-y-auto  shidden h-14 rounded bg-red-100 border border-red-200 p-1">
              <TabsTrigger
                value="details"
                className="rounded cursor-pointer px-4 min-w-fit  data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded cursor-pointer px-4 min-w-fit mx-6 sm:mx-0 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300"
              >
                Reviews ({product?.reviews?.length})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded cursor-pointer px-4 min-w-fit mx-6 sm:mx-0 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6 animate-fadeIn">
              <Card className="p-6 rounded-xl border-gray-200 shadow-sm">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Description
                    </h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      {product?.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Product Information
                    </h3>
                    <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="bg-gray-200 p-3 rounded">
                        <dt className="text-sm font-medium text-gray-500">
                          Category
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-gray-900">
                          {product?.category?.name}
                        </dd>
                      </div>
                      <div className="bg-gray-200 p-3 rounded">
                        <dt className="text-sm font-medium text-gray-500">
                          Available Colors
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-gray-900">
                          {product?.colors?.map((c) => c.name).join(", ")}
                        </dd>
                      </div>
                      <div className="bg-gray-200 p-3 rounded">
                        <dt className="text-sm font-medium text-gray-500">
                          Available Sizes
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-gray-900">
                          {product?.sizes?.join(", ")}
                        </dd>
                      </div>
                      <div className="bg-gray-200 p-3 rounded">
                        <dt className="text-sm font-medium text-gray-500">
                          Shipping Fee
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-gray-900">
                          €{product?.shipping?.toLocaleString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* -------------------Product Reviews---------------------- */}

            <TabsContent
              value="reviews"
              className="mt-6 animate-fadeIn"
              id="reviews"
            >
              <Card className="p-6 rounded-xl border-gray-200 shadow-sm">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Customer Reviews
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        See what our customers are saying
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                      <div className="text-center sm:text-left">
                        <div className="text-4xl font-bold text-gray-900">
                          {averageRating ? averageRating?.toFixed(1) : "0.0"}
                        </div>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(averageRating)
                                  ? "fill-red-600 text-red-500"
                                  : i < averageRating
                                  ? "fill-red-400 text-red-400 opacity-50"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Based on {product?.reviews?.length} reviews
                        </div>
                      </div>

                      <div className="w-full sm:w-auto sm:flex-1 max-w-xs space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = ratingDistribution[rating - 1];
                          const percentage =
                            product?.reviews?.length > 0
                              ? (count / product?.reviews?.length) * 100
                              : 0;

                          return (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-1 w-12">
                                <span className="text-sm font-medium text-gray-700">
                                  {rating}
                                </span>
                                <Star className="h-4 w-4 fill-red-600 text-red-600" />
                              </div>
                              <Progress
                                value={percentage}
                                className="h-2 flex-1"
                              />
                              <div className="text-sm text-gray-500 w-10 text-right">
                                {count}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {product?.reviews?.length > 0 && (
                    <div
                      className=" w-full  overflow-y-auto shidden p-1 border border-red-200 rounded-2xl"
                      style={{
                        maxHeight: "30rem",
                        overflowY: "auto",
                        borderRadius: "1rem",
                      }}
                    >
                      <div className="space-y-6 w-full ">
                        {product?.reviews?.map((review) => (
                          <motion.div
                            key={review._id}
                            className="space-y-3 bg-gray-100 p-4 rounded-xl border border-gray-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex sm:items-center sm:justify-between flex-col-reverse sm:flex-row gap-3">
                              <div className="flex items-center">
                                {review?.user ? (
                                  <>
                                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-200">
                                      <Image
                                        src={
                                          review?.user?.avatar ||
                                          "/placeholder.svg"
                                        }
                                        alt={review?.user?.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <p className="text-sm font-medium text-gray-900">
                                        {review?.user?.name}
                                      </p>
                                      <div className="flex items-center mt-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                              i < Math.floor(review?.rating)
                                                ? "fill-red-600 text-red-500"
                                                : i < review?.rating
                                                ? "fill-red-500 text-red-500 opacity-50"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                        <span className="ml-2 text-xs text-gray-500">
                                          {new Date(
                                            review?.createdAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-sm font-medium text-gray-600">
                                        A
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <p className="text-sm font-medium text-gray-900">
                                        Anonymous
                                      </p>
                                      <div className="flex items-center mt-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                              i < Math.floor(review?.rating)
                                                ? "fill-red-600 text-red-500"
                                                : i < review?.rating
                                                ? "fill-red-500 text-red-500 opacity-50"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                        <span className="ml-2 text-xs text-gray-500">
                                          {new Date(
                                            review?.createdAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                Verified Purchase
                              </Badge>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {review?.comment}
                            </p>
                            {review?.commentReplies &&
                              review?.commentReplies?.length > 0 && (
                                <div className="ml-12 mt-4 rounded bg-white p-4 border border-gray-100">
                                  <p className="text-xs font-medium text-gray-900">
                                    Seller Response
                                  </p>
                                  {review?.commentReplies?.map(
                                    (reply, index) => (
                                      <div
                                        key={reply?._id}
                                        className="relative py-2 w-full overflow-hidden "
                                      >
                                        <div className="flex items-center gap-2 w-full">
                                          <Image
                                            src={
                                              reply?.user?.avatar ||
                                              "/placeholder.svg"
                                            }
                                            alt={reply?.user?.name}
                                            width={50}
                                            height={50}
                                            className="object-contain rounded-full border border-gray-200 shadow-sm w-12 h-12"
                                          />
                                          <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium text-gray-900">
                                              {reply?.user?.name}
                                            </p>
                                            <span className=" text-xs text-gray-500">
                                              {new Date(
                                                reply?.createdAt
                                              ).toLocaleDateString()}
                                            </span>
                                          </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                          {reply?.comment}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {product?.reviews?.length > 0 && (
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        Load More Reviews
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
            {/* -------------------Product Shipping---------------------- */}
            <TabsContent value="shipping" className="mt-6 animate-fadeIn">
              <Card className="p-6 rounded-xl border-gray-200 shadow-sm">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Shipping Information
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex gap-4 p-4 bg-gray-50 rounded border border-gray-100">
                        <Truck className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Standard Shipping
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Delivery within 3-5 business days
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            €{product?.shipping?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4 bg-gray-50 rounded border border-gray-100">
                        <Truck className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Express Shipping
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Delivery within 1-2 business days
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            €{(product?.shipping * 2).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Return Policy
                    </h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      We accept returns within 30 days of delivery. Items must
                      be in their original condition with tags attached. Please
                      note that shipping costs are non-refundable, and the
                      customer is responsible for return shipping fees.
                    </p>
                    <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-100">
                      <h4 className="font-medium text-gray-900">
                        How to Return
                      </h4>
                      <ol className="mt-2 space-y-2 text-sm text-gray-600 list-decimal list-inside">
                        <li>
                          Contact our customer service team to initiate a return
                        </li>
                        <li>
                          Pack the item securely in its original packaging
                        </li>
                        <li>Ship the item back to our return address</li>
                        <li>
                          Once received and inspected, we&apos;ll process your
                          refund
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/*-------------------Related Products---------------------- */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                You May Also Like
              </h2>
              <div className="w-full">
                <ProductCarousel products={relatedProducts} />
              </div>
            </div>
          )}
        </div>

        {/* Sticky Add to Cart Bar (Mobile) */}
        <AnimatePresence>
          {showStickyBar && (
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 shadow"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text font-bold text-gray-900">
                    €{product?.price?.toLocaleString()}
                  </div>
                  {product.estimatedPrice > product.price && (
                    <div className="text-sm text-gray-500 line-through">
                      €{product?.estimatedPrice?.toLocaleString()}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Modal */}
        {show && (
          <div className="fixed top-0 left-0 w-full h-full bg-white/70 dark:bg-gray-950/70 z-50 flex items-center justify-center">
            <ShareData
              title={product?.name}
              url={`${currentUrl}/products/${product?._id}`}
              setShowShare={setShow}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
