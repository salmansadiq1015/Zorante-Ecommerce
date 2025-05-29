import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { productsURI } from "@/app/utils/ServerURI";
import axios from "axios";
import Image from "next/image";
import { useAuth } from "@/app/content/authContent";
import toast from "react-hot-toast";

export default function RecentlyViewedSection() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { setSelectedProduct } = useAuth();
  const [quantity, setQuantity] = useState(1);

  console.log("recentProducts", recentlyViewed);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      let recentProducts =
        JSON.parse(localStorage.getItem("recentProducts")) || [];

      try {
        let products = await Promise.all(
          recentProducts.map(async (recent) => {
            const { data } = await axios.get(
              `${productsURI}/product/detail/${recent.id}`
            );
            return data.product;
          })
        );

        setRecentlyViewed(products);
      } catch (error) {
        console.error("Error fetching favorite products:", error);
      }
    };

    fetchRecentlyViewed();
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

        existingProduct.quantity += quantity;

        updatedProducts[existingProductIndex] = existingProduct;
      } else {
        updatedProducts.push({
          product: product._id,
          quantity,
          price: product.price,
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
    <Card>
      <CardHeader>
        <CardTitle>Recently Viewed</CardTitle>
        <CardDescription>Products you&apos;ve viewed recently</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentlyViewed?.map((item) => (
            <div
              key={item?._id}
              className="flex items-start space-x-4 p-4 border rounded-lg"
            >
              <div className="h-20 w-20 flex-shrink-0">
                <Image
                  src={item?.thumbnails[0] || "/placeholder.svg"}
                  alt={item?.name}
                  width={200}
                  height={200}
                  className="h-full w-full object-fill rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{item?.name}</h3>
                <div className="flex items-center gap-1">
                  <div className="text-xl font-bold  text-black">
                    €{item?.price?.toFixed(2)}
                  </div>
                  <div className="text-sm  text-gray-600 line-through">
                    €{item?.estimatedPrice}
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Clock className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">
                    Viewed {item?.viewedAt}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs cursor-pointer"
                >
                  View
                </Button>
                <Button
                  size="sm"
                  className="text-xs bg-[#C6080A] hover:bg-[#a50709] cursor-pointer"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
