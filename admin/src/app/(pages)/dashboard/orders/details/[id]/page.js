"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TbShoppingCartCopy } from "react-icons/tb";
import { AiOutlineSync } from "react-icons/ai";
import { BiPackage } from "react-icons/bi";
import { FaSpinner, FaTruck } from "react-icons/fa";
import { MdOutlineDoneAll } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { FaUndo } from "react-icons/fa";
import axios from "axios";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import OrderDetailLoader from "@/app/components/Loaders/OrderDetailLoader";
import OrderSlip from "@/app/components/Loaders/OrderSlip";
import { CgClose } from "react-icons/cg";
import { HiDownload } from "react-icons/hi";
import { ImSpinner9 } from "react-icons/im";
import { Style } from "@/app/utils/CommonStyle";
import { uploadImage } from "@/app/utils/CommonFunction";
const MainLayout = dynamic(
  () => import("./../../../../../components/layout/MainLayout"),
  {
    ssr: false,
  }
);
const Breadcrumb = dynamic(() => import("./../../../../../utils/Breadcrumb"), {
  ssr: false,
});

const statusMapping = [
  {
    status: "Pending",
    icon: TbShoppingCartCopy,
    color: "green",
    label: "Order Placed",
  },
  {
    status: "Processing",
    icon: AiOutlineSync,
    color: "sky",
    label: "Processing",
  },
  { status: "Packing", icon: BiPackage, color: "purple", label: "Packing" },
  { status: "Shipped", icon: FaTruck, color: "teal", label: "Shipped" },
  {
    status: "Delivered",
    icon: MdOutlineDoneAll,
    color: "green",
    label: "Order Delivered",
  },
  {
    status: "Cancelled",
    icon: MdCancel,
    color: "red",
    label: "Order Cancelled",
  },
  {
    status: "Returned",
    icon: FaUndo,
    color: "orange",
    label: "Order Returned",
  },
];

export default function OrderDetail({ params }) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [orderDetail, setOrderDetail] = useState([]);
  const isOrderDetailLoad = useRef(true);
  const [isLoading, setIsloading] = useState(false);
  const slipRef = useRef();
  const [showSlipDetail, setShowSlipDetail] = useState(false);
  const [loadDownload, setLoadDownload] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  console.log("image:", image);

  console.log("orderDetail:", orderDetail);

  //   Get Page URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);

  // <---------Fetch Order Detail---------->
  const fetchOrderDetail = async () => {
    if (isOrderDetailLoad.current) {
      setIsloading(true);
    }
    const { id } = await params;
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/detail/${id}`
      );
      if (data) {
        setOrderDetail(data.order);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (isOrderDetailLoad.current) {
        setIsloading(false);
        isOrderDetailLoad.current = false;
      }
    }
  };

  useEffect(() => {
    fetchOrderDetail();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (orderDetail) {
      setTrackingId(orderDetail.trackingId);
      setShippingCarrier(orderDetail.shippingCarrier);
    }
  }, [orderDetail]);

  const generatePDF = () => {
    const slipContent = slipRef.current;
    setLoadDownload(true);

    if (slipContent) {
      html2canvas(slipContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");

          const pdf = new jsPDF("p", "mm", "a4");
          const pageWidth = pdf.internal.pageSize.getWidth();
          const imgWidth = pageWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            imgWidth,
            Math.min(imgHeight, 297)
          );
          pdf.save(`Order_Slip_${orderDetail?.user?.name || "Customer"}.pdf`);
          setLoadDownload(false);
        })
        .catch((error) => {
          console.error("Error generating PDF:", error);
          setLoadDownload(false);
        });
    } else {
      console.error("Slip content not found!");
      setLoadDownload(false);
    }
  };

  // -----------------handle Delete --------------->
  const handleDeleteConfirmation = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(orderId);
        Swal.fire("Deleted!", "Order has been deleted.", "success");
      }
    });
  };

  const handleDelete = async (orderId) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/delete/order/${orderId}`
      );
      if (data) {
        toast.success("Order deleted successfully!");
        redirect("/dashboard/orders");
      }
    } catch (error) {
      console.log("Error deleting order:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };
  // Update Order
  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/update/status/${orderDetail._id}`,
        {
          trackingId: trackingId,
          shippingCarrier: shippingCarrier,
        }
      );
      if (data) {
        toast.success("Order updated successfully!");
        fetchOrderDetail();
      }
    } catch (error) {
      console.log("Error updating order:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Upload Image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = await uploadImage(file, setImage, setUploading);
      console.log("imageURL:", imageURL);
      setImage(imageURL);
    }
  };

  // Add Comment to Order
  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/comment/${orderDetail._id}`,
        {
          comment,
          image,
        }
      );
      if (data) {
        toast.success("Comment Added Successfully");
        setComment("");
        setImage("");
        fetchOrderDetail();
      }
    } catch (error) {
      console.log("Error adding comment:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };
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
                <button
                  onClick={() => handleDeleteConfirmation(orderDetail._id)}
                  className="text-[13px] sm:text-[15px] py-[.3rem] px-4 hover:border-2 hover:rounded-md hover:shadow-md hover:scale-[1.03] text-gray-600 hover:text-gray-800 border-b-2 border-gray-600 transition-all duration-300 "
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowSlipDetail(true)}
                  className={`flex text-[13px] sm:text-[15px] w-[8rem] sm:w-[9rem] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800   py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03]`}
                >
                  Generate Slip
                </button>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden w-full h-[95%] py-3 sm:py-4 bg-transparent px-2 sm:px-4 overflow-y-auto shidden">
            {!isLoading ? (
              <div className="grid grid-cols-5 gap-4">
                {/* 1 */}
                <div className="flex flex-col col-span-5 sm:col-span-3 gap-4 ">
                  <div className="w-full h-full p-4 min-w-[20rem]   rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-customRed">
                    <div className="w-full sm:w-[90%] flex flex-col gap-3 min-w-[25rem] ">
                      {/* Header */}
                      <div className="w-full flex items-center justify-between ">
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
                          <strong className="text-[15px] font-medium text-black">
                            Size
                          </strong>
                          <strong className="text-[15px] font-medium text-black">
                            Color
                          </strong>
                        </div>
                      </div>
                      {/* Body */}
                      {orderDetail?.products?.map((product) => (
                        <div
                          key={product._id}
                          className="w-full flex items-center  justify-between gap-2 "
                        >
                          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-1">
                            <div className="w-[3rem] h-[3rem] rounded-full">
                              <div className="w-[2.9rem] h-[2.9rem] relative rounded-md overflow-hidden flex items-center justify-center">
                                <Image
                                  src={
                                    product?.product?.thumbnails[0] ||
                                    "/placeholder.svg"
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
                              {product?.quantity}
                            </span>
                            <span className="text-[13px] sm:text-[14px] font-normal text-gray-600">
                              €{product?.product?.price}
                            </span>
                            {/* Sizes */}
                            <div className="text-[13px] sm:text-[14px] font-normal text-gray-600">
                              {product?.sizes?.length > 0 ? (
                                <details className="group">
                                  <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                                    Sizes
                                  </summary>
                                  <ul className="mt-1 pl-4 text-gray-500 group-open:block">
                                    {product.sizes.map((size, index) => (
                                      <li key={index} className="list-disc">
                                        {size}
                                      </li>
                                    ))}
                                  </ul>
                                </details>
                              ) : (
                                <span className="text-red-500 text-[13px]">
                                  {product.sizes[0]} N/A
                                </span>
                              )}
                            </div>

                            {/* Colors */}
                            <div className="text-[13px] sm:text-[14px] font-normal text-gray-600">
                              {product.colors.length > 0 ? (
                                <details className="group">
                                  <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                                    Colors
                                  </summary>
                                  <div className="flex items-center flex-row gap-2 pl-4 group-open:block">
                                    {product.colors.map((color, index) => (
                                      <div
                                        key={index}
                                        className="w-4 h-4 rounded-full border mt-1 border-gray-300"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                      ></div>
                                    ))}
                                  </div>
                                </details>
                              ) : (
                                <div
                                  className="w-5 h-5  text-red-500 text-[13px]"
                                  style={{ backgroundColor: product.colors[0] }}
                                  title={product.colors[0]}
                                >
                                  N/A
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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
                            €{orderDetail?.shippingFee}
                          </span>
                        </div>
                        {/*  */}
                        <div className="flex items-center justify-between">
                          <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700">
                            Totol Price
                          </strong>
                          <span className="text-[13px] text-gray-600 font-normal">
                            €{orderDetail?.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ------Address Detail-------------- */}
                  <div className="w-full h-full p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-blue-500">
                    <div className="w-full h-full flex flex-col gap-4">
                      <h3 className="text-[15px] font-medium text-black">
                        Buyer Details
                      </h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-4">
                          <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                            Buyer Name
                          </strong>
                          <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                            {orderDetail?.user?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start gap-4">
                          <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                            Buyer Email
                          </strong>
                          <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                            {orderDetail?.user?.email || "N/A"}
                          </span>
                        </div>

                        <div className="flex items-start gap-4">
                          <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                            Contact Number
                          </strong>
                          <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                            {orderDetail?.user?.number || "N/A"}
                          </span>
                        </div>

                        {/* Delivery Address Dropdown */}
                        <details className="group">
                          <summary className="text-[14px] font-medium text-gray-800 hover:text-gray-900 cursor-pointer">
                            Delivery Address
                          </summary>
                          <div className="mt-3 pl-5 border-l-2 border-gray-200 flex flex-col gap-3">
                            <div className="flex items-start gap-4">
                              <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                                City
                              </strong>
                              <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                                {orderDetail?.user?.addressDetails?.city ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="flex items-start gap-4">
                              <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                                State
                              </strong>
                              <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                                {orderDetail?.user?.addressDetails?.state ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="flex items-start gap-4">
                              <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                                Country
                              </strong>
                              <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                                {orderDetail?.user?.addressDetails?.country ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="flex items-start gap-4">
                              <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                                Pincode
                              </strong>
                              <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                                {orderDetail?.user?.addressDetails?.pincode ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="flex items-start gap-4">
                              <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                                Address
                              </strong>
                              <span className="text-[12px] sm:text-[13px] text-gray-600 font-normal">
                                {orderDetail?.user?.addressDetails?.address ||
                                  "N/A"}
                              </span>
                            </div>
                          </div>
                        </details>
                      </div>
                      {/* Shipping */}
                      <h3 className="text-[15px] font-medium text-black">
                        Shipping Details
                      </h3>
                      <form
                        onSubmit={handleOrder}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
                      >
                        <div className="inputBox">
                          <input
                            type="text"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            className={`${Style.input} w-full `}
                            placeholder="Enter Tracking ID"
                          />
                          <span>Tracking ID</span>
                        </div>
                        <div className="inputBox">
                          <input
                            type="text"
                            value={shippingCarrier}
                            onChange={(e) => setShippingCarrier(e.target.value)}
                            className={`${Style.input} w-full `}
                            placeholder="Enter Shipping Carrier"
                          />
                          <span>Shipping Carrier</span>
                        </div>
                        <div className="w-full flex items-center justify-end col-span-2">
                          <button
                            disabled={loading}
                            className="w-[6rem] py-[.4rem] text-[14px] flex items-center justify-center rounded-sm bg-customRed hover:bg-red-700 hover:shadow-md hover:scale-[1.03] transition-all duration-300 text-white"
                          >
                            {loading ? (
                              <span>
                                <FaSpinner className="h-5 w-5 text-white animate-spin" />
                              </span>
                            ) : (
                              <span>Save</span>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                    {/*  */}
                  </div>

                  {/*  */}
                </div>
                {/* 2 */}
                <div className="flex flex-col col-span-5 sm:col-span-2 gap-4">
                  <div className="w-full h-full p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-green-500">
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
                            {orderDetail?.createdAt
                              ? format(
                                  new Date(orderDetail?.createdAt),
                                  "MMM dd, yyyy"
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start gap-4">
                          <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                            Payment Method
                          </strong>
                          <span
                            className={`text-[12px] sm:text-[13px] font-normal ${
                              orderDetail?.paymentMethod === "Credit Card"
                                ? "text-blue-500"
                                : orderDetail?.paymentMethod === "PayPal"
                                ? "text-indigo-500"
                                : orderDetail?.paymentMethod === "Bank Transfer"
                                ? "text-green-500"
                                : "text-gray-600"
                            }`}
                          >
                            {orderDetail?.paymentMethod || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start gap-4">
                          <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                            Payment Status
                          </strong>
                          <span
                            className={`text-[12px] sm:text-[13px] font-normal ${
                              orderDetail?.paymentStatus === "Completed"
                                ? "text-green-500"
                                : orderDetail?.paymentStatus === "Pending"
                                ? "text-yellow-500"
                                : orderDetail?.paymentStatus === "Failed"
                                ? "text-red-500"
                                : orderDetail?.paymentStatus === "Refunded"
                                ? "text-blue-500"
                                : "text-gray-500"
                            }`}
                          >
                            {orderDetail?.paymentStatus || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start gap-4">
                          <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700 w-[9rem]">
                            Order Status
                          </strong>
                          <span
                            className={`text-[12px] sm:text-[13px] font-normal ${
                              orderDetail?.orderStatus === "Pending"
                                ? "text-yellow-500"
                                : orderDetail?.orderStatus === "Processing"
                                ? "text-blue-500"
                                : orderDetail?.orderStatus === "Shipped"
                                ? "text-purple-500"
                                : orderDetail?.orderStatus === "Delivered"
                                ? "text-green-500"
                                : orderDetail?.orderStatus === "Cancelled"
                                ? "text-red-500"
                                : orderDetail?.orderStatus === "Returned"
                                ? "text-orange-500"
                                : "text-gray-600"
                            }`}
                          >
                            {orderDetail?.orderStatus || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*-------------- Order History -----------*/}
                  <div className="w-full h-full p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-purple-500">
                    <div className="w-full h-full flex flex-col gap-4">
                      <h3 className="text-[15px] font-medium text-black">
                        Order Status History
                      </h3>
                      <div className="flex flex-col gap-3">
                        {statusMapping.map(
                          ({ status, icon: Icon, color, label }, index) => {
                            const isActive =
                              orderDetail?.orderStatus === status;

                            return (
                              <div
                                key={index}
                                className="flex items-center gap-4"
                              >
                                <span
                                  className={`p-2 ${
                                    isActive ? `bg-green-600` : "bg-gray-400"
                                  } text-white rounded-full`}
                                >
                                  <Icon className={`text-[24px]`} />
                                </span>
                                <div className="flex flex-col">
                                  <span
                                    className={`text-[12px] sm:text-[13px] font-normal ${
                                      isActive
                                        ? `text-${color}-500`
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {label}
                                  </span>
                                  <span
                                    className={`text-[11px] ${
                                      isActive
                                        ? `text-${color}-500`
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {orderDetail?.updatedAt
                                      ? format(
                                          new Date(orderDetail?.createdAt),
                                          "MMM dd, yyyy"
                                        )
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Comment Section */}
                  <div className="w-full h-full p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="w-full h-full flex flex-col gap-4">
                      <h3 className="text-[15px] font-medium text-black">
                        Comments
                      </h3>

                      {/* Add Comment Form */}
                      <form
                        onSubmit={handleAddComment}
                        className="flex flex-col gap-3 border-b pb-4 mb-2"
                      >
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          placeholder="Add a comment..."
                          rows={3}
                        />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="relative">
                            <input
                              type="file"
                              id="image-upload"
                              onChange={handleImageUpload}
                              className="hidden"
                              accept="image/*"
                            />
                            <label
                              htmlFor="image-upload"
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer transition-all duration-300"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Attach Image
                            </label>
                            {uploading && (
                              <span className="ml-2 text-sm text-gray-500">
                                Uploading...
                              </span>
                            )}
                          </div>

                          {image && (
                            <div className="relative group">
                              <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-300">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  width={64}
                                  height={64}
                                  alt="Comment attachment"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => setImage("")}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={!comment.trim() && !image}
                            className="ml-auto px-4 py-2 bg-customRed hover:bg-red-700 text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add Comment
                          </button>
                        </div>
                      </form>

                      {/* Comments List */}
                      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                        {orderDetail?.comments &&
                        orderDetail?.comments?.length > 0 ? (
                          orderDetail?.comments?.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-col gap-2 border-b border-gray-100 pb-3"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                  <Image
                                    src={
                                      item?.user?.avatar || "/placeholder.svg"
                                    }
                                    width={40}
                                    height={40}
                                    alt="Comment attachment"
                                    className="object-fill w-full h-full"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-800">
                                      {item.user?.name || "Admin"}
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                      {item?.createdAt
                                        ? format(
                                            new Date(item?.createdAt),
                                            "MMM dd, yyyy • h:mm a"
                                          )
                                        : "N/A"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {item?.question}
                                  </p>

                                  {item?.image && (
                                    <div className="mt-2">
                                      <div className="relative group cursor-pointer overflow-hidden w-fit">
                                        <div className="w-full max-w-[200px] h-auto rounded-md overflow-hidden border border-gray-200">
                                          <Image
                                            src={
                                              item.image || "/placeholder.svg"
                                            }
                                            width={200}
                                            height={150}
                                            alt="Comment attachment"
                                            className="object-cover w-full h-full"
                                          />
                                        </div>
                                        <a
                                          href={item?.image}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="absolute z-20 inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
                                        >
                                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            View
                                          </span>
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 mb-2 text-gray-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              />
                            </svg>
                            <p className="text-sm">No comments yet</p>
                            <p className="text-xs mt-1">
                              Be the first to add a comment
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/*  */}
                </div>
                {/* Comments Section */}
              </div>
            ) : (
              <OrderDetailLoader />
            )}
          </div>
        </div>
        {/* Full Width Comment Section for Mobile */}
        {/* <div className="w-full mt-4 p-4 rounded-lg bg-white shadow-md hover:shadow-md transition-all duration-300 sm:hidden">
          <div className="w-full h-full flex flex-col gap-4">
            <h3 className="text-[15px] font-medium text-black flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-customRed"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              Order Comments
            </h3>

            <form
              onSubmit={handleAddComment}
              className="flex flex-col gap-3 border-b pb-4 mb-2"
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Add a comment..."
                rows={3}
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative">
                  <input
                    type="file"
                    id="mobile-image-upload"
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <label
                    htmlFor="mobile-image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer transition-all duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Attach Image
                  </label>
                  {uploading && (
                    <span className="ml-2 text-sm text-gray-500">
                      Uploading...
                    </span>
                  )}
                </div>

                {image && (
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-300">
                      <Image
                        src={image || "/placeholder.svg"}
                        width={64}
                        height={64}
                        alt="Comment attachment"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!comment.trim() && !image}
                  className="ml-auto px-4 py-2 bg-customRed hover:bg-red-700 text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Comment
                </button>
              </div>
            </form>
            <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
              {orderDetail?.comments && orderDetail.comments.length > 0 ? (
                orderDetail?.comments?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 border-b border-gray-100 pb-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        {item.user?.name?.charAt(0) || "A"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-800">
                            {item?.user?.name || "Admin"}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {item?.createdAt
                              ? format(
                                  new Date(item?.createdAt),
                                  "MMM dd, yyyy • h:mm a"
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {item?.question}
                        </p>

                        {item?.image && (
                          <div className="mt-2">
                            <div className="relative group cursor-pointer">
                              <div className="w-full max-w-[200px] h-auto rounded-md overflow-hidden border border-gray-200">
                                <Image
                                  src={item?.image || "/placeholder.svg"}
                                  width={200}
                                  height={150}
                                  alt="Comment attachment"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                  View
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-2 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p className="text-sm">No comments yet</p>
                  <p className="text-xs mt-1">Be the first to add a comment</p>
                </div>
              )}
            </div>
          </div>
        </div> */}
        {/* -------------------Slip Detail---------- */}
        {showSlipDetail && (
          <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-white/80">
            <div className="w-[90%] overflow-y-auto max-h-[99%] relative shidden">
              <span
                onClick={() => {
                  setShowSlipDetail(false);
                }}
                className="p-1 absolute top-2 right-2 cursor-pointer rounded-full bg-black/20 hover:bg-black/40 text-white "
              >
                <CgClose className="text-[18px]" />
              </span>
              <div ref={slipRef} className="w-full h-full">
                <OrderSlip
                  orderDetail={orderDetail}
                  generatePDF={generatePDF}
                />
              </div>
              {/* <div className="flex items-center justify-between bg-customRed px-4 py-2 sm:py-4 ">
                <h3 className="text-lg font-medium text-white">Order Detail</h3>
                <div className="flex items-center gap-6">
                  <button
                    onClick={generatePDF}
                    className={`flex items-center justify-center text-[13px] sm:text-[15px] w-[7rem]    text-white bg-sky-600 hover:bg-sky-700   py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03]`}
                  >
                    {loadDownload ? (
                      <ImSpinner9 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <span className="flex items-center gap-1 text-[13px] sm:text-[15px] text-white">
                        {" "}
                        Save Slip{" "}
                        <HiDownload className="text-[17px] text-white" />
                      </span>
                    )}
                  </button>
                  <span
                    onClick={() => {
                      setShowSlipDetail(false);
                    }}
                    className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white "
                  >
                    <CgClose className="text-[18px]" />
                  </span>
                </div>
              </div>
              <div ref={slipRef} className="w-full h-full">
                <OrderSlip
                  orderDetail={orderDetail}
                  generatePDF={generatePDF}
                />
              </div> */}
            </div>
          </div>
        )}
        {/* Image Preview Modal */}
        {/* {image && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={() => setImage("")}
          >
            <div className="relative max-w-3xl max-h-[80vh] overflow-hidden rounded-lg">
              <Image
                src={image || "/placeholder.svg"}
                width={800}
                height={600}
                alt="Comment attachment preview"
                className="object-contain max-h-[80vh]"
              />
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setImage("");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )} */}
      </div>
    </MainLayout>
  );
}
