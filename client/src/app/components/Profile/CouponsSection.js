import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CouponsSection() {
  const [coupons, setCoupons] = useState([]);
  const router = useRouter();
  const fetchAllCoupons = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/coupon/active`
      );
      if (data) {
        setCoupons(data?.coupons);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert(`Coupon code copied to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const getDefaultCouponDescription = (productIds) => {
    if (!productIds || productIds?.length === 0)
      return "Exclusive discounts on your purchase!";

    const categoryDescriptions = {
      clothing: "Fashion deals you can't resist!",
      beauty: "Pamper yourself with beauty discounts.",
      kitchen: "Upgrade your kitchen with special savings.",
      electronics: "Get the best deals on gadgets!",
      accessories: "Stylish accessories at unbeatable prices.",
      default: "Save more on your favorite products!",
    };

    // Extract product categories from names
    const categoryKeywords = {
      clothing: ["jacket", "Shalwar Kameez"],
      beauty: ["makeup", "brush", "beauty"],
      kitchen: ["plates", "dinnerware", "bowl", "tray"],
      accessories: ["bag", "crossbody"],
    };

    for (const product of productIds) {
      for (const [category, keywords] of Object?.entries(categoryKeywords)) {
        if (
          keywords?.some((keyword) =>
            product?.name?.toLowerCase()?.includes(keyword)
          )
        ) {
          return categoryDescriptions[category];
        }
      }
    }

    return categoryDescriptions?.default;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupons</CardTitle>
        <CardDescription>
          Available discount coupons for your purchases
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {coupons?.map((coupon) => (
            <div
              key={coupon?.id}
              className={`border rounded-lg overflow-hidden ${
                coupon?.isUsed ? "opacity-60" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="bg-[#C6080A] text-white p-6 flex flex-col items-center justify-center md:w-1/4">
                  <p className="text-xl font-bold">
                    {coupon?.discountPercentage}%
                  </p>
                  <div className="h-px w-full bg-white/30 my-2"></div>
                  <p className="text-sm text-center">
                    Min. purchase: €{coupon?.minPurchase}
                  </p>
                </div>
                <div className="p-6 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">
                      {coupon?.description ||
                        getDefaultCouponDescription(coupon?.productIds)}
                    </h3>
                    <div className="flex items-center mt-2">
                      <p className="text-sm text-gray-500 mr-2">
                        Code:{" "}
                        <span className="font-mono font-bold">
                          {coupon?.code?.slice(0, 4)}****
                          {coupon?.code.slice(-4)}
                        </span>
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-[#C6080A] cursor-pointer"
                        onClick={() => copyToClipboard(coupon?.code)}
                        disabled={!coupon?.isActive}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Expires: {format(new Date(coupon?.endDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div>
                    {coupon.isUsed ? (
                      <Badge variant="outline" className="text-gray-500">
                        Used
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-[#C6080A] hover:bg-[#a50709] cursor-pointer"
                        onClick={() => router.push("/products")}
                      >
                        Use Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/*  */}
          {coupons?.length === 0 && (
            <div className="w-full min-h-[40vh] flex items-center justify-center flex-col gap-2">
              <Image
                src="/coupon.png"
                alt="No Coupons"
                width={200}
                height={200}
                className="object-contain animate-pulse"
              />
              <p className="text-center text-gray-500 text-sm">
                No discount coupons available at the moment.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
