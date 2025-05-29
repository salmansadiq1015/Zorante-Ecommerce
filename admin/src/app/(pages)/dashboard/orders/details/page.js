"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TbShoppingCartCopy } from "react-icons/tb";
import { AiOutlineSync } from "react-icons/ai";
import { BiPackage } from "react-icons/bi";
import { FaTruck } from "react-icons/fa";
import { MdOutlineDoneAll } from "react-icons/md";
const MainLayout = dynamic(
  () => import("./../../../../components/layout/MainLayout"),
  {
    ssr: false,
  }
);
const Breadcrumb = dynamic(() => import("./../../../../utils/Breadcrumb"), {
  ssr: false,
});

const order = {
  _id: "order001",
  name: "Luxury Leather Wallet",
  thumbnails:
    "https://socialface.s3.eu-north-1.amazonaws.com/1732368311327_c4.jpg",
  quantity: 2,
  price: 49.99,
  profit: 15,
  status: "Completed",
  createdAt: "2024-11-20T10:25:00Z",
};

export default function OrderDetail() {
  const [currentUrl, setCurrentUrl] = useState("");

  //   Get Page URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);
  return (
    <MainLayout title="Orders Detail - Ayoob Admin">
      <div className="p-1 sm:p-2 px-1 sm:px-6 h-[100%] w-full pb-4 scroll-smooth">
        <div className="flex flex-col pb-2 gap-4 h-full">
          <Breadcrumb path={currentUrl} />
          <div className="flex flex-col gap-4   w-full">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-2xl font-sans font-semibold text-black">
                Order Detail
              </h1>
              <div className="flex items-center justify-end gap-4 w-full sm:w-fit">
                <button className="text-[13px] sm:text-[15px] py-[.3rem] px-4 hover:border-2 hover:rounded-md hover:shadow-md hover:scale-[1.03] text-gray-600 hover:text-gray-800 border-b-2 border-gray-600 transition-all duration-300 ">
                  Delete
                </button>
                <button
                  className={`flex text-[13px] sm:text-[15px] w-[8rem] sm:w-[9rem] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800   py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03]`}
                >
                  Generate Slip
                </button>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden w-full h-[95%] py-3 sm:py-4 bg-transparent px-3 sm:px-4 overflow-y-auto shidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="w-full h-full p-4  rounded-lg bg-white shadow hover:shadow-md transition-all duration-300 cursor-pointer ">
                  <div className="w-full sm:w-[90%] flex flex-col gap-3 ">
                    {/* Header */}
                    <div className="w-full flex items-center justify-between">
                      <div className="w-full">
                        <strong className="text-[15px] font-medium text-black">
                          Product
                        </strong>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <strong className="text-[15px] font-medium text-black">
                          QTY
                        </strong>
                        <strong className="text-[15px] font-medium text-black">
                          Price
                        </strong>
                      </div>
                    </div>
                    {/* Body */}
                    <div className="w-full flex items-center justify-between gap-2">
                      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-1">
                        <div className="w-[3rem] h-[3rem] rounded-full">
                          <div className="w-[2.9rem] h-[2.9rem] relative rounded-md overflow-hidden flex items-center justify-center">
                            <Image
                              src={
                                "https://socialface.s3.eu-north-1.amazonaws.com/1732368311332_cloth1.webp"
                              }
                              layout="fill"
                              alt={"Avatar"}
                              className="w-full h-full "
                            />
                          </div>
                        </div>
                        <p className="text-[13px] sm:text-[14px] text-start text-gray-700 font-medium">
                          {"Designer Silk Saree "}
                        </p>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[13px] sm:text-[14px] font-normal text-gray-600 ">
                          1
                        </span>
                        <span className="text-[13px] sm:text-[14px] font-normal text-gray-600">
                          €145
                        </span>
                      </div>
                    </div>
                    {/* HR Line */}
                    <hr className="w-full h-[2px] bg-gray-500 " />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700">
                          Discount Coupon
                        </strong>
                        <span className="text-[13px] text-gray-600 font-normal">
                          29%
                        </span>
                      </div>
                      {/*  */}
                      <div className="flex items-center justify-between">
                        <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700">
                          Shipping Charges
                        </strong>
                        <span className="text-[13px] text-gray-600 font-normal">
                          €11
                        </span>
                      </div>
                      {/*  */}
                      <div className="flex items-center justify-between">
                        <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700">
                          Totol Price
                        </strong>
                        <span className="text-[13px] text-gray-600 font-normal">
                          $135
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full p-4  rounded-lg bg-white shadow hover:shadow-md transition-all duration-300 cursor-pointer ">
                  <div className="w-full h-full flex flex-col gap-4">
                    <h3 className="text-[15px] font-medium text-black">
                      Buyer Detail
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-4">
                        <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                          Buyer Name
                        </strong>
                        <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                          M Salman
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                          Delivery Address
                        </strong>
                        <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                          005232 Fridley MN 667579 US
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                          Contact Number
                        </strong>
                        <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                          0023452331861
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-full h-full p-4  rounded-lg bg-white shadow hover:shadow-md transition-all duration-300 cursor-pointer ">
                  <div className="w-full h-full flex flex-col gap-4">
                    <h3 className="text-[15px] font-medium text-black">
                      General Information
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-4">
                        <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                          Order Date
                        </strong>
                        <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                          25-11-2024
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                          Shipping Option
                        </strong>
                        <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                          Cash on delivery
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                          Order Status
                        </strong>
                        <span
                          className={`text-[12px] sm:text-[13px] ${
                            order.status === "Completed"
                              ? "text-green-500"
                              : "text-red-500"
                          } font-normal`}
                        >
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full p-4  rounded-lg bg-white shadow hover:shadow-md transition-all duration-300 cursor-pointer ">
                  <div className="w-full h-full flex flex-col gap-4">
                    <h3 className="text-[15px] font-medium text-black">
                      Order Status History
                    </h3>
                    <div className="flex flex-col gap-3">
                      {/* Pending */}
                      <div className="flex items-center gap-4">
                        <span
                          className={`p-2 ${
                            order.status === "Pending"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }  text-white rounded-full`}
                        >
                          <TbShoppingCartCopy className="text-[24px]" />
                        </span>
                        <div className="flex flex-col">
                          <span
                            className={`text-[12px] sm:text-[13px] ${
                              order.status === "Pending"
                                ? "text-green-500"
                                : "text-gray-700"
                            }   font-normal`}
                          >
                            Order Placed
                          </span>
                          <span
                            className={`text-[11px] ${
                              order.status === "Pending"
                                ? "text-green-500"
                                : "text-gray-500"
                            }  `}
                          >
                            10:12 AM, 25-11-2024
                          </span>
                        </div>
                      </div>
                      {/* Processing */}
                      <div className="flex items-center gap-4">
                        <span
                          className={`p-2 ${
                            order.status === "Processing"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }  text-white rounded-full`}
                        >
                          <AiOutlineSync className="text-[24px]" />
                        </span>
                        <div className="flex flex-col">
                          <span
                            className={`text-[12px] sm:text-[13px] ${
                              order.status === "Processing"
                                ? "text-green-500"
                                : "text-gray-700"
                            }   font-normal`}
                          >
                            Processing
                          </span>
                          <span
                            className={`text-[11px] ${
                              order.status === "Processing"
                                ? "text-green-500"
                                : "text-gray-500"
                            }  `}
                          >
                            10:12 AM, 26-11-2024
                          </span>
                        </div>
                      </div>
                      {/* Packing */}
                      <div className="flex items-center gap-4">
                        <span
                          className={`p-2 ${
                            order.status === "Packing"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }  text-white rounded-full`}
                        >
                          <BiPackage className="text-[24px]" />
                        </span>
                        <div className="flex flex-col">
                          <span
                            className={`text-[12px] sm:text-[13px] ${
                              order.status === "Packing"
                                ? "text-green-500"
                                : "text-gray-700"
                            }   font-normal`}
                          >
                            Packing
                          </span>
                          <span
                            className={`text-[11px] ${
                              order.status === "Packing"
                                ? "text-green-500"
                                : "text-gray-500"
                            }  `}
                          >
                            10:12 AM, 27-11-2024
                          </span>
                        </div>
                      </div>
                      {/* Shipped  */}
                      <div className="flex items-center gap-4">
                        <span
                          className={`p-2 ${
                            order.status === "Shipped"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }  text-white rounded-full`}
                        >
                          <FaTruck className="text-[24px]" />
                        </span>
                        <div className="flex flex-col">
                          <span
                            className={`text-[12px] sm:text-[13px] ${
                              order.status === "Shipped"
                                ? "text-green-500"
                                : "text-gray-700"
                            }   font-normal`}
                          >
                            Shipped
                          </span>
                          <span
                            className={`text-[11px] ${
                              order.status === "Shipped"
                                ? "text-green-500"
                                : "text-gray-500"
                            }  `}
                          >
                            10:12 AM, 28-11-2024
                          </span>
                        </div>
                      </div>
                      {/* Ordered Delivered */}
                      <div className="flex items-center gap-4">
                        <span
                          className={`p-2 ${
                            order.status === "Completed"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }  text-white rounded-full`}
                        >
                          <MdOutlineDoneAll className="text-[24px]" />
                        </span>
                        <div className="flex flex-col">
                          <span
                            className={`text-[12px] sm:text-[13px] ${
                              order.status === "Completed"
                                ? "text-green-500"
                                : "text-gray-700"
                            }   font-normal`}
                          >
                            Ordered Delivered
                          </span>
                          <span
                            className={`text-[11px] ${
                              order.status === "Completed"
                                ? "text-green-500"
                                : "text-gray-500"
                            }  `}
                          >
                            10:12 AM, 29-11-2024
                          </span>
                        </div>
                      </div>
                      {/*  */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
