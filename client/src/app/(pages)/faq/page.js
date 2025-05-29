"use client";
import FAQData from "@/app/components/FaqData";
import MainLayout from "@/app/components/Layout/Layout";
import React from "react";

export default function Faqs() {
  return (
    <MainLayout title={"Zorante - FAQ's"}>
      <div className="w-full min-h-[70vh] py-4 px-4">
        <FAQData />
      </div>
    </MainLayout>
  );
}
