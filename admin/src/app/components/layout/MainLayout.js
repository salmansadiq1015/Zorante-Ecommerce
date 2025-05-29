"use client";
import React, { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import Header from "./Header";
import Sidebar from "./Sidebar";
import AdminProtected from "@/app/hooks/adminProtected";
import { Helmet } from "react-helmet";

export default function MainLayout({
  children,
  title,
  description,
  keywords,
  author,
}) {
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(false);

  return (
    <AdminProtected>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <div className="relative w-full h-screen overflow-hidden flex flex-col text-black ">
        <div className=" w-full flex-1 gap-0 flex h-screen  fixed top-0 left-0 z-[999] overflow-hidden">
          {!show && (
            <div className=" flex sm:hidden  absolute top-5 left-2 z-[9999]">
              <IoMenu
                onClick={() => setShow(true)}
                size={25}
                className="hover:text-blue-500 transition-all duration-150"
              />
            </div>
          )}
          <div
            className={`hidden sm:flex  transition-all duration-200  ${
              hide ? "w-[5rem]" : "w-[15rem]"
            }`}
          >
            <Sidebar hide={hide} setHide={setHide} />
          </div>
          {show && (
            <div className=" absolute top-0 left-0 flex  bg-white sm:hidden z-[999] w-[13rem] pt-[0rem]">
              <div className="absolute top-2 right-2 z-[999] transition-all duration-300 hover:text-red-600">
                <IoClose
                  onClick={() => setShow(false)}
                  size={25}
                  className=""
                />
              </div>
              <Sidebar />
            </div>
          )}
          <div className="flex flex-col w-full h-screen overflow-hidden">
            <Header />
            <div className="flex-[1.8] bg-gray-100 w-full h-[calc(100vh-3.8rem)]  overflow-y-auto shidden  ">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}

MainLayout.defaultProps = {
  title: "Ayoob Admin - E-commerce Admin Panel | Manage Products & Orders",
  description:
    "Ayoob Admin Panel is an intuitive and powerful admin interface for managing your e-commerce store. Track orders, manage products, and oversee inventory with ease. Built with MERN stack.",
  keywords:
    "E-commerce admin panel, MERN stack, Ayoob Admin, product management, order management, inventory control, online store dashboard, eCommerce backend, admin dashboard, e-commerce store management, admin interface",
  author: "Salman Sadiq",
};
