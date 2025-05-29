"use client";
import Loader from "@/app/utils/Loader";
import dynamic from "next/dynamic";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { MdDelete, MdModeEditOutline, MdNotInterested } from "react-icons/md";
import { format } from "date-fns";
import { TiEye } from "react-icons/ti";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import { ImSpinner4 } from "react-icons/im";
import { useAuth } from "@/app/context/authContext";
import HandleOrderModal from "@/app/components/order/HandleOrderModal";
const MainLayout = dynamic(
  () => import("./../../../components/layout/MainLayout"),
  {
    ssr: false,
  }
);
const Breadcrumb = dynamic(() => import("./../../../utils/Breadcrumb"), {
  ssr: false,
});

export default function Orders() {
  const { auth } = useAuth();
  const [currentUrl, setCurrentUrl] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [filterOrders, setFilterOrders] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingOrder, setPendingOrder] = useState(0);
  const [processingOrder, setProcessingOrder] = useState(0);
  const [shippedorder, setShippedorder] = useState(0);
  const [deliveredorder, setDeliveredorder] = useState(0);
  const [cancelledOrder, setCancelledOrder] = useState(0);
  const [refundOrder, setRefundOrder] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const router = useRouter();
  const isInitialRender = useRef(true);
  const [isLoad, setIsLoad] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isShow, setIsShow] = useState(false);

  console.log("Orders:", orderData);

  // Current URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);

  // <---------Fetch All Orders-------->
  const fetchOrders = async () => {
    if (isInitialRender.current) {
      setIsloading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/all/orders`
      );
      if (data) {
        setOrderData(data.orders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (isInitialRender.current) {
        setIsloading(false);
        isInitialRender.current = false;
      }
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFilterOrders(orderData);
  }, [orderData]);

  // Get Product Length(Enable & Disable)
  useEffect(() => {
    const pendingCount = orderData.filter(
      (order) => order.orderStatus === "Pending"
    ).length;
    const processingCount = orderData.filter(
      (order) => order.orderStatus === "Processing"
    ).length;
    const shippedCount = orderData.filter(
      (order) => order.orderStatus === "Shipped"
    ).length;
    const deliveredCount = orderData.filter(
      (order) => order.orderStatus === "Delivered"
    ).length;
    const cancelCount = orderData.filter(
      (order) => order.orderStatus === "Cancelled"
    ).length;
    const returnCount = orderData.filter(
      (order) => order.orderStatus === "Returned"
    ).length;

    setPendingOrder(pendingCount);
    setProcessingOrder(processingCount);
    setShippedorder(shippedCount);
    setDeliveredorder(deliveredCount);
    setCancelledOrder(cancelCount);
    setRefundOrder(returnCount);
  }, [orderData]);

  //----------- Handle search--------->
  const handleSearch = (value) => {
    setSearchQuery(value);
    filterData(value, activeTab);
  };

  // -------------Handle filtering by tabs and search---------------
  const filterData = (search = searchQuery, statusFilter = activeTab) => {
    let filtered = orderData;

    if (statusFilter === "All" && !search) {
      setFilterOrders(orderData);
      return;
    }

    if (statusFilter === "Pending") {
      filtered = filtered.filter((order) => order.orderStatus === "Pending");
    } else if (statusFilter === "Processing") {
      filtered = filtered.filter((order) => order.orderStatus === "Processing");
    } else if (statusFilter === "Shipped") {
      filtered = filtered.filter((order) => order.orderStatus === "Shipped");
    } else if (statusFilter === "Delivered") {
      filtered = filtered.filter((order) => order.orderStatus === "Delivered");
    } else if (statusFilter === "Cancelled") {
      filtered = filtered.filter((order) => order.orderStatus === "Cancelled");
    } else if (statusFilter === "Returned") {
      filtered = filtered.filter((order) => order.orderStatus === "Returned");
    }

    if (search) {
      const lowercasedSearch = search.toLowerCase();
      filtered = filtered.filter((order) => {
        const {
          products = [],
          shippingFee = "",
          totalAmount = "",
          orderStatus = "",
          paymentMethod = "",
          paymentStatus = "",
          createdAt = "",
        } = order;

        const productNames = products
          .map((product) => product.product?.name || "")
          .join(" ")
          .toLowerCase();

        return (
          productNames.includes(lowercasedSearch) ||
          shippingFee.toString().toLowerCase().includes(lowercasedSearch) ||
          totalAmount.toString().toLowerCase().includes(lowercasedSearch) ||
          orderStatus.toLowerCase().includes(lowercasedSearch) ||
          paymentMethod.toLowerCase().includes(lowercasedSearch) ||
          paymentStatus.toLowerCase().includes(lowercasedSearch) ||
          createdAt.toLowerCase().includes(lowercasedSearch)
        );
      });
    }

    setFilterOrders(filtered);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    filterData(searchQuery, tab);
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
    setIsLoad(true);
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/delete/order/${orderId}`
      );
      if (data) {
        setFilterOrders((prev) =>
          prev.filter((order) => order._id !== orderId)
        );
        toast.success("Order deleted successfully!");
      }
    } catch (error) {
      console.log("Error deleting order:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoad(false);
    }
  };

  // <------------Handle Update Status (Payment/Order)--------------->
  const handleUpdateStatus = async (orderId, paymentStatus, orderStatus) => {
    console.log(orderId, paymentStatus, orderStatus);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/update/status/${orderId}`,
        {
          paymentStatus: paymentStatus,
          orderStatus: orderStatus,
        }
      );
      if (data) {
        const updateOrder = data.orders;
        setFilterOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, ...updateOrder } : order
          )
        );
        fetchOrders();
        toast.success(
          `${
            paymentStatus ? "Payment status updated" : "Order status updated"
          } successfully!`
        );
      }
    } catch (error) {
      console.log("Error deleting order:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };
  // ----------------Pegination----------->
  const totalPages = Math.ceil(filterOrders.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Get the current page data
  const paginatedData = filterOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // -----------Delete All Order------------
  const handleDeleteConfirmationOrder = () => {
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
        deleteAllOrders();
        Swal.fire("Deleted!", "Orders has been deleted.", "success");
      }
    });
  };

  const deleteAllOrders = async () => {
    if (!rowSelection) {
      return toast.error("Please select at least one order to delete.");
    }

    const productIdsArray = Object.keys(rowSelection);

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/delete/multiple`,
        { orderIds: productIdsArray }
      );

      if (data) {
        fetchOrders();
        toast.success("All selected orders deleted successfully.");
        setRowSelection({});
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete orders. Please try again later.");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "products",
        minSize: 100,
        maxSize: 320,
        size: 240,
        grow: true,
        Header: ({ column }) => {
          return (
            <div className="flex flex-col w-full items-center justify-center gap-[2px]">
              <span className="ml-1 cursor-pointer">PRODUCTS</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const products = row.original?.products || [];
          const [isExpanded, setIsExpanded] = React.useState(false);

          const firstProduct = products[0];
          const remainingProducts = products.slice(1);

          const toggleExpanded = () => setIsExpanded(!isExpanded);

          return (
            <div
              onClick={() =>
                router.push(`/dashboard/orders/details/${row.original._id}`)
              }
              className="cursor-pointer text-[12px] text-black w-full h-full"
            >
              <div className="flex flex-col gap-2">
                {/* First Product */}
                {firstProduct && (
                  <div className="flex items-center gap-2">
                    <div className="w-[3.3rem] h-[2.1rem] relative rounded-md overflow-hidden flex items-center justify-center">
                      <Image
                        src={
                          firstProduct?.product?.thumbnails?.[0] ||
                          "/default-thumbnail.jpg"
                        }
                        layout="fill"
                        alt={"Product Thumbnail"}
                        className="w-[3.5rem] h-[2.3rem]"
                      />
                    </div>
                    <span className="text-[12px] hover:text-sky-600 truncate">
                      {firstProduct?.product?.name || "Unnamed Product"}
                    </span>
                  </div>
                )}

                {/* Dropdown for Remaining Products */}
                {remainingProducts.length > 0 && (
                  <div>
                    <button
                      onClick={toggleExpanded}
                      className="text-blue-600 underline text-[12px] mt-1"
                    >
                      {isExpanded
                        ? "View Less"
                        : `View ${remainingProducts.length} More`}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 flex flex-col gap-2">
                        {remainingProducts.map((product, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-[3.3rem] h-[2.1rem] relative rounded-md overflow-hidden flex items-center justify-center">
                              <Image
                                src={
                                  product?.product?.thumbnails?.[0] ||
                                  "/default-thumbnail.jpg"
                                }
                                layout="fill"
                                alt={"Product Thumbnail"}
                                className="w-[3.5rem] h-[2.3rem]"
                              />
                            </div>
                            <span className="text-[12px] truncate">
                              {product?.product?.name || "Unnamed Product"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const products = row.original.products || [];
          const productNames = products
            .map((product) => product?.product?.name?.toLowerCase() || "")
            .join(" ");
          return productNames.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "quantity",
        minSize: 60,
        maxSize: 110,
        size: 70,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">QTY</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const quantity = row.original.products[0].quantity;

          return (
            <div className="cursor-pointer text-[12px] flex items-center justify-start pl-3 text-black w-full h-full">
              {quantity}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        minSize: 60,
        maxSize: 110,
        size: 100,
        grow: true,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">DATE</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const createdAt = row.original.createdAt;

          return (
            <div className="cursor-pointer text-[12px] flex items-center justify-start text-black w-full h-full">
              {format(new Date(createdAt), "MMM, dd, yyyy")}
            </div>
          );
        },
      },
      {
        accessorKey: "shippingFee",
        minSize: 70,
        maxSize: 140,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">SHIPPING FEE</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const shippingFee = row.original.shippingFee;

          return (
            <div className="cursor-pointer text-[12px] flex items-center justify-start text-black w-full h-full">
              €{shippingFee}
            </div>
          );
        },
      },
      {
        accessorKey: "totalAmount",
        minSize: 70,
        maxSize: 140,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">TOTAL AMOUNT</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const price = row.original.totalAmount;

          return (
            <div className="cursor-pointer text-[12px] flex items-center justify-start text-black w-full h-full">
              €{price}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "trackingId",
        minSize: 70,
        maxSize: 140,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer uppercase truncate">
                TRACKING ID
              </span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const trackingId = row.original.trackingId;

          return (
            <div className="cursor-pointer text-[12px] flex items-center justify-start text-black w-full h-full">
              {trackingId}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "shippingCarrier",
        minSize: 70,
        maxSize: 140,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer uppercase truncate">
                SHIPPING CARRIER
              </span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const shippingCarrier = row.original.shippingCarrier;

          return (
            <div className="cursor-pointer text-[12px] flex items-center justify-start text-black w-full h-full">
              {shippingCarrier}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "paymentMethod",
        minSize: 70,
        maxSize: 140,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className="flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">PAYMENT METHOD</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const paymentMethod = row.original.paymentMethod;

          const getMethodStyles = (method) => {
            const methodStyles = {
              "Credit Card": " text-purple-600",
              PayPal: "text-sky-600",
              "Bank Transfer": "text-teal-600",
            };

            return (
              methodStyles[method] ||
              "border-gray-600 bg-gray-200 text-gray-900"
            );
          };

          return (
            <div className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              <button
                className={`py-[.35rem] px-4 rounded-[2rem] cursor-pointer transition-all duration-300 hover:scale-[1.03] ${getMethodStyles(
                  paymentMethod
                )}`}
              >
                {paymentMethod}
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: "orderStatus",
        minSize: 100,
        maxSize: 140,
        size: 130,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className="flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">ORDER STATUS</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const orderStatus = row.original.orderStatus;
          const [orderStat, setOrderStat] = useState(orderStatus);
          const [showUpdate, setShowUpdate] = useState(false);
          const status = [
            "Pending",
            "Processing",
            "Packing",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Returned",
          ];

          const getStatusStyles = (status) => {
            const statusStyles = {
              Pending:
                "border-orange-600 bg-orange-200 hover:bg-orange-300 text-orange-900",
              Processing:
                "border-blue-600 bg-blue-200 hover:bg-blue-300 text-blue-900",
              Shipped:
                "border-yellow-600 bg-yellow-200 hover:bg-yellow-300 text-yellow-900",
              Delivered:
                "border-green-600 bg-green-200 hover:bg-green-300 text-green-900",
              Cancelled:
                "border-pink-600 bg-pink-200 hover:bg-pink-300 text-pink-900",
              Returned:
                "border-red-600 bg-red-200 hover:bg-red-300 text-red-900",
            };

            return (
              statusStyles[status] ||
              "border-gray-600 bg-gray-200 text-gray-900"
            );
          };

          const updateStatus = (id, status) => {
            setOrderStat(status);
            handleUpdateStatus(id, "", status);
            setShowUpdate(false);
          };

          return (
            <div className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {!showUpdate ? (
                <button
                  className={`py-[.35rem] px-4 rounded-[2rem] border-2 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03] ${getStatusStyles(
                    orderStatus
                  )}`}
                  onDoubleClick={() => setShowUpdate(true)}
                >
                  {orderStatus}
                </button>
              ) : (
                <select
                  value={orderStat}
                  onChange={(e) =>
                    updateStatus(row.original._id, e.target.value)
                  }
                  onBlur={() => setShowUpdate(false)}
                  className="w-full h-[2.2rem] rounded-md border-2 border-gray-700 active:border-red-600 cursor-pointer p-1"
                >
                  <option value="">Select Status</option>
                  {status?.map((stat) => (
                    <option value={stat} key={stat}>
                      {stat}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "paymentStatus",
        minSize: 100,
        maxSize: 140,
        size: 130,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className="flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">PAYMENT STATUS</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const paymentStatus = row.original.paymentStatus;
          const [paymentStat, setPaymentStat] = useState(paymentStatus);
          const [showUpdate, setShowUpdate] = useState(false);
          const status = ["Pending", "Completed", "Failed", "Refunded"];

          const updateStatus = (id, status) => {
            setPaymentStat(status);
            handleUpdateStatus(id, status, "");
            setShowUpdate(false);
          };

          const getStatusButton = (status) => {
            const statusStyles = {
              Pending:
                "border-orange-600 bg-orange-200 hover:bg-orange-300 text-orange-900",
              Completed:
                "border-green-600 bg-green-200 hover:bg-green-300 text-green-900",
              Failed: "border-red-600 bg-red-200 hover:bg-red-300 text-red-900",
              Refunded:
                "border-blue-600 bg-blue-200 hover:bg-blue-300 text-blue-900",
            };

            return (
              <button
                className={`py-[.35rem] px-4 rounded-[2rem] border-2 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03] ${
                  statusStyles[status] ||
                  "border-gray-600 bg-gray-200 text-gray-900"
                }`}
              >
                {status}
              </button>
            );
          };

          return (
            <div className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {!showUpdate ? (
                <div
                  onDoubleClick={() => setShowUpdate(true)}
                  className="w-full "
                >
                  {getStatusButton(paymentStatus)}
                </div>
              ) : (
                <select
                  value={paymentStat}
                  onChange={(e) =>
                    updateStatus(row.original._id, e.target.value)
                  }
                  onBlur={() => setShowUpdate(false)}
                  className="w-full h-[2.2rem] rounded-md border-2 border-gray-700 active:border-red-600 cursor-pointer p-1"
                >
                  <option value="">Select Status</option>
                  {status?.map((stat) => (
                    <option value={stat} key={stat}>
                      {stat}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      ...(auth?.user?.role === "admin" || auth?.user?.role === "superadmin"
        ? [
            {
              accessorKey: "Actions",
              minSize: 100,
              maxSize: 140,
              size: 140,
              grow: false,
              Header: ({ column }) => {
                return (
                  <div className=" flex flex-col gap-[2px]">
                    <span className="ml-1 cursor-pointer">ACTIONS</span>
                  </div>
                );
              },
              Cell: ({ cell, row }) => {
                return (
                  <div className="flex items-center gap-2 cursor-pointer text-[12px] text-black w-full h-full">
                    <span
                      onClick={() =>
                        router.push(
                          `/dashboard/orders/details/${row.original._id}`
                        )
                      }
                      className="p-1 bg-purple-200 hover:bg-purple-300 rounded-full transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                    >
                      <TiEye className="text-[16px] text-purple-500 hover:text-purple-600" />
                    </span>
                    {/* <span className="p-1 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-300 hover:scale-[1.03] cursor-pointer">
                <MdModeEditOutline className="text-[16px] text-white" />
              </span> */}
                    {/* <span className="p-1 bg-sky-200 hover:bg-sky-300 rounded-full transition-all duration-300 hover:scale-[1.03] cursor-pointer">
                <MdNotInterested className="text-[16px] text-sky-500 hover:text-sky-600" />
              </span> */}
                    <span
                      onClick={() => {
                        setOrderId(row.original._id);
                        handleDeleteConfirmation(row.original._id);
                      }}
                      className="p-1 bg-red-200 hover:bg-red-300   rounded-full transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                    >
                      {isLoad && orderId === row.original._id ? (
                        <ImSpinner4 className="text-[16px] text-white animate-spin" />
                      ) : (
                        <MdDelete className="text-[16px] text-red-500 hover:text-red-600" />
                      )}
                    </span>
                  </div>
                );
              },
            },
          ]
        : []),
    ],
    // eslint-disable-next-line
    [orderData, currentUrl, filterOrders, activeTab, paginatedData]
  );

  const table = useMaterialReactTable({
    columns,
    data: paginatedData,
    getRowId: (row) => row._id,
    enableStickyHeader: true,
    enableStickyFooter: false,
    columnFilterDisplayMode: "popover",
    muiTableContainerProps: {
      sx: (theme) => ({
        minHeight: {
          xs: "330px",
          sm: "350px",
          md: "330px",
          lg: "400px",
          xl: "500px",
        },
        maxHeight: {
          xs: "350px",
          sm: "380px",
          md: "400px",
          lg: "500px",
          xl: "800px",
        },
      }),
    },

    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    enableGlobalFilter: true,
    enableRowNumbers: true,
    enableColumnResizing: true,
    enableTopToolbar: true,
    enableBottomToolbar: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    // enableEditing: true,

    enablePagination: false,
    initialState: {
      pagination: { pageSize: 20 },
      pageSize: 20,
      density: "compact",
    },

    muiTableHeadCellProps: {
      style: {
        fontWeight: "600",
        fontSize: "12px",
        backgroundColor: "#c6080a",
        color: "#fff",
        padding: ".7rem 0.3rem",
      },
    },
  });

  return (
    <MainLayout title="Orders - Ayoob Admin">
      <div className="p-1 sm:p-2 h-[100%] w-full pb-4  scroll-smooth ">
        <div className="flex flex-col pb-2 ">
          <Breadcrumb path={currentUrl} />
          <div className="flex flex-col gap-5 mt-4">
            {/* Tabs */}
            <div className="w-full overflow-x-scroll scroll-smooth shidden px-4 rounded-md bg-white flex items-center gap-4">
              <button
                className={`border-b-[3px] flex items-center gap-1 py-3 text-[14px] px-2 font-medium cursor-pointer ${
                  activeTab === "All"
                    ? " border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("All")}
              >
                All <span>({orderData.length})</span>
              </button>
              <button
                className={` border-b-[3px] flex items-center gap-1 py-3 text-[13px] px-2 font-medium cursor-pointer ${
                  activeTab === "Pending"
                    ? "border-b-[3px] border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("Pending")}
              >
                Pending <span>({pendingOrder})</span>
              </button>
              <button
                className={` border-b-[3px] flex items-center gap-1 py-3 text-[13px] px-2 font-medium cursor-pointer ${
                  activeTab === "Processing"
                    ? "border-b-[3px] border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("Processing")}
              >
                Processing <span>({processingOrder})</span>
              </button>
              <button
                className={` border-b-[3px] flex items-center gap-1 py-3 text-[13px] px-2 font-medium cursor-pointer ${
                  activeTab === "Shipped"
                    ? "border-b-[3px] border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("Shipped")}
              >
                Shipped <span>({shippedorder})</span>
              </button>
              <button
                className={`border-b-[3px] flex items-center gap-1 py-3 text-[13px] px-2 font-medium cursor-pointer ${
                  activeTab === "Delivered"
                    ? "border-b-[3px] border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("Delivered")}
              >
                Delivered <span>({deliveredorder})</span>
              </button>

              <button
                className={` border-b-[3px] flex items-center gap-1 py-3 text-[13px] px-2 font-medium cursor-pointer ${
                  activeTab === "Cancelled"
                    ? "border-b-[3px] border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("Cancelled")}
              >
                Cancelled <span>({cancelledOrder})</span>
              </button>
              <button
                className={` border-b-[3px] flex items-center gap-1 py-3 text-[13px] px-2 font-medium cursor-pointer ${
                  activeTab === "Returned"
                    ? "border-b-[3px] border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("Returned")}
              >
                Returned <span>({refundOrder})</span>
              </button>
            </div>
            {/* Actions */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-2xl font-sans font-semibold text-black">
                Latest Orders
              </h1>
              {auth?.user?.role === "admin" ||
                (auth?.user?.role === "superadmin" && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleDeleteConfirmationOrder()}
                      className="text-[14px] py-2 px-4 hover:border-2 hover:rounded-md hover:shadow-md hover:scale-[1.03] text-gray-600 hover:text-gray-800 border-b-2 border-gray-600 transition-all duration-300 "
                    >
                      Delete All
                    </button>
                    <button
                      onClick={() => setIsShow(true)}
                      className={`flex text-[14px] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800   py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] px-4`}
                    >
                      ADD NEW ORDER
                    </button>
                  </div>
                ))}
            </div>
          </div>
          {/*  */}

          <div className=" relative overflow-hidden w-full h-[93%] py-3 sm:py-4 bg-white rounded-md shadow  px-2 sm:px-4 mt-4  ">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="relative">
                <span className="absolute top-2 left-[.4rem] z-10">
                  <IoSearch className="text-[18px] text-gray-500" />
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search"
                  className="w-[17rem] h-[2.2rem] rounded-md border border-gray-400 focus:border-red-600 outline-none px-2 pl-[1.8rem] text-[12px]"
                />
              </div>
              {/* Pegination */}
              <div className="flex items-center gap-3 justify-end sm:justify-normal w-full sm:w-fit">
                <span>
                  {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <CiCircleChevLeft
                    onClick={() => handlePageChange("prev")}
                    className={`text-[27px] text-green-500 hover:text-green-600 ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  />
                  <CiCircleChevRight
                    onClick={() => handlePageChange("next")}
                    className={`text-[27px] text-green-500 hover:text-green-600 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto w-full scroll-smooth shidden h-[90%] overflow-y-auto mt-3 pb-4 ">
              {isLoading ? (
                <div className="flex items-center justify-center w-full h-screen px-4 py-4">
                  <Loader />
                </div>
              ) : (
                <div className="w-full min-h-[20vh] relative">
                  <div className="h-full overflow-y-scroll shidden relative">
                    <MaterialReactTable table={table} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --------------Modal--------------- */}
        {isShow && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <div className=" w-full sm:w-[80%]  rounded-md shadow-lg p-4 relative">
              <HandleOrderModal
                setIsShow={setIsShow}
                fetchOrders={fetchOrders}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
