"use client";
import MainLayout from "@/app/components/Layout/Layout";
import SupportSection from "@/app/components/Profile/SupportSection";
import React from "react";

export default function Contact() {
  return (
    <MainLayout title="Zorante - Contact Us">
      <div className="flex flex-col gap-4 min-h-screen w-fit z-10 relative py-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Contact Us
        </h1>
        <SupportSection />
      </div>
    </MainLayout>
  );
}
