"use client";
import ContactsDashboard from "@/app/components/contact/ContactData";
import MainLayout from "@/app/components/layout/MainLayout";
import Breadcrumb from "@/app/utils/Breadcrumb";
import React, { useEffect, useState } from "react";

export default function Contact() {
  const [currentUrl, setCurrentUrl] = useState("");

  // ------Current Page URL-----
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);
  return (
    <MainLayout title="Contact - Ayoob Admin">
      <div className="p-1 sm:p-2 h-[100%] w-full pb-4  scroll-smooth">
        <div className="flex flex-col gap-4">
          <Breadcrumb path={currentUrl} />
          <ContactsDashboard />
        </div>
      </div>
    </MainLayout>
  );
}
