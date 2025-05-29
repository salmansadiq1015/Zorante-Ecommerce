"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineMenuFold } from "react-icons/ai";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { LuLayoutDashboard } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { LuWarehouse } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa6";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { BsChatRightText } from "react-icons/bs";
import { RiCoupon4Line } from "react-icons/ri";
import { useAuth } from "@/app/context/authContext";
import { FaRegQuestionCircle } from "react-icons/fa";
import { LuContact } from "react-icons/lu";

const rolePermissions = {
  admin: [
    "dashboard",
    "users",
    "products",
    "coupon",
    "card",
    "categories",
    "orders",
    "chat",
    "notifications",
    "faq",
    "privacy",
    "settings",
    "contact",
  ],
  superadmin: [
    "dashboard",
    "users",
    "products",
    "coupon",
    "card",
    "categories",
    "orders",
    "chat",
    "notifications",
    "faq",
    "privacy",
    "settings",
    "contact",
  ],
  agent: ["orders"],
};

export default function Sidebar({ hide, setHide }) {
  const { auth } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState("");

  useEffect(() => {
    const pathArray = window.location.pathname.split("/");
    const fileIdFromPath = pathArray[2];
    setActive(fileIdFromPath ? fileIdFromPath : "dashboard");

    // exlint-disable-next-line
  }, [setActive]);

  const allowedRoutes = rolePermissions[auth?.user.role] || [];

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LuLayoutDashboard,
      path: "/dashboard",
    },
    { id: "users", label: "Users", icon: FiUsers, path: "/dashboard/users" },
    {
      id: "products",
      label: "Products",
      icon: LuWarehouse,
      path: "/dashboard/products",
    },
    {
      id: "coupon",
      label: "Coupon",
      icon: RiCoupon4Line,
      path: "/dashboard/coupon",
    },
    {
      id: "card",
      label: "Card",
      icon: FaRegCreditCard,
      path: "/dashboard/cards",
    },
    {
      id: "categories",
      label: "Categories",
      icon: AiOutlineProduct,
      path: "/dashboard/categories",
    },
    {
      id: "orders",
      label: "Orders",
      icon: BsBoxSeam,
      path: "/dashboard/orders",
    },
    {
      id: "chat",
      label: "Chat",
      icon: BsChatRightText,
      path: "/dashboard/chat",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: MdOutlineNotificationsActive,
      path: "/dashboard/notifications",
    },
    {
      id: "faq",
      label: "FAQ",
      icon: FaRegQuestionCircle,
      path: "/dashboard/faq",
    },
    {
      id: "contact",
      label: "Contact",
      icon: LuContact,
      path: "/dashboard/contact",
    },
    {
      id: "privacy",
      label: "Term & Privacy",
      icon: MdOutlinePrivacyTip,
      path: "/dashboard/privacy",
    },
    {
      id: "settings",
      label: "Settings",
      icon: IoSettingsOutline,
      path: "/dashboard/settings",
    },
  ];

  return (
    <div className="w-full h-screen py-2 border-r border-gray-200 bg-white text-black">
      <div className="flex items-center justify-center w-full relative px-4 py-2 ">
        {hide ? (
          <div className="">
            <h1 className="text-center text-lg mt-[1rem] font-serif font-semibold text-[#c6080a]">
              Zorante
            </h1>
          </div>
        ) : (
          <h1 className=" text-center text-3xl font-serif font-semibold text-[#c6080a]">
            Zorante
          </h1>
        )}
        <div className=" absolute top-1 right-1 z-30 hidden sm:flex items-center justify-end pr-1 ">
          {hide ? (
            <AiOutlineMenuUnfold
              onClick={() => setHide(!hide)}
              className="text-[20px] cursor-pointer hover:text-red-600 transition-all duration-300"
            />
          ) : (
            <AiOutlineMenuFold
              onClick={() => setHide(!hide)}
              className="text-[20px] cursor-pointer hover:text-red-600 transition-all duration-300"
            />
          )}
        </div>
      </div>
      {/* border-2 border-red-600  */}
      <div className="relative w-full h-[calc(100vh-10.5vh)] sm:h-[calc(100vh-7.5vh)] overflow-y-auto scroll-smooth py-3 pb-[2rem] shidden">
        <div className="flex flex-col gap-3 px-3">
          {menuItems
            .filter((item) => allowedRoutes.includes(item.id))
            .map((item) => (
              <React.Fragment key={item.id}>
                <div
                  className={` relative h-[2.4rem] rounded-md cursor-pointer hover:shadow-md   shadow-gray-300 ${
                    active === item.id ? "bg-[#c6080a]" : "bg-white"
                  }  filter hover:drop-shadow-md  overflow-hidden transition-all duration-300`}
                  onClick={() => router.push(item.path)}
                >
                  <div
                    className={`relative w-full h-full flex items-center ${
                      active === item.id ? "bg-[#c6080a]" : "bg-white"
                    } px-2 z-30 bg-transparent hover:bg-[#c6080a] hover:text-white transition-all duration-300`}
                  >
                    {hide ? (
                      <item.icon
                        className="h-5 w-5 cursor-pointer ml-2"
                        style={{ color: active === item.id ? "#fff" : "" }}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <item.icon
                          className="h-5 w-5 cursor-pointer ml-2"
                          style={{ color: active === item.id ? "#fff" : "" }}
                        />
                        <span
                          className="text-[14px] font-[400]"
                          style={{ color: active === item.id ? "#fff" : "" }}
                        >
                          {item.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {(item.id === "dashboard" || item.id === "privacy") && (
                  <hr className="w-full h-[1px] bg-gray-400" />
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
