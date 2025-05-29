"use client";
import CartItems from "@/app/components/Carts/CartItems";
import MainLayout from "../../components/Layout/Layout";
import React from "react";
import { useAuth } from "@/app/content/authContent";
import { Separator } from "@/components/ui/separator";
import SalesProducts from "@/app/components/Home/SalesProducts";

export default function Cart() {
  const { selectedProduct } = useAuth();

  return (
    <MainLayout title="Zorante - Cart">
      <div className="bg-transparent min-h-screen w-full z-10 relative px-4 sm:px-8 py-5 sm:py-6 overflow-hidden">
        <CartItems products={selectedProduct} />
        <Separator />
        <SalesProducts />
      </div>
    </MainLayout>
  );
}
