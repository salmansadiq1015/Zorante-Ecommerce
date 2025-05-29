"use client";
import CouponModal from "@/app/components/Coupon/CouponModal";
import MainLayout from "@/app/components/layout/MainLayout";
import Loader from "@/app/utils/Loader";
import axios from "axios";
import { format } from "date-fns";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { FaCheckDouble } from "react-icons/fa";
import { ImSpinner4 } from "react-icons/im";
import { IoSearch } from "react-icons/io5";
import { MdDelete, MdModeEditOutline, MdNotInterested } from "react-icons/md";
import Swal from "sweetalert2";
const Breadcrumb = dynamic(() => import("./../../../utils/Breadcrumb"), {
  ssr: false,
});

export default function Coupon() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [couponData, setCouponData] = useState([]);
  const [filterCoupon, setFilterCoupon] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(0);
  const [isactiveCoupon, setInactiveCoupon] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const isInitialRender = useRef(true);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponId, setCouponId] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [isLoad, setIsLoad] = useState(false);

  console.log("couponData:", couponData);

  // ------Current Page URL-----
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);

  // <---------Fetch All Coupons-------->
  const fetchCoupons = async () => {
    if (isInitialRender.current) {
      setIsloading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/coupon/all`
      );
      if (data) {
        setCouponData(data.coupons);
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
    fetchCoupons();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFilterCoupon(couponData);
  }, [couponData]);

  useEffect(() => {
    const activeCount = couponData.filter((coupon) => coupon.isActive).length;
    const isactiveCount = couponData.filter(
      (coupon) => !coupon.isActive
    ).length;

    setActiveCoupon(activeCount);
    setInactiveCoupon(isactiveCount);
  }, [couponData]);

  // -------------Handle filtering by tabs and search---------------
  const filterData = (search = searchQuery, statusFilter = activeTab) => {
    let filtered = couponData;

    if (statusFilter === "All" && !search) {
      setFilterCoupon(couponData);
      return;
    }

    if (statusFilter === "Active") {
      filtered = filtered.filter((coupon) => coupon.isActive === true);
    } else if (statusFilter === "Inactive") {
      filtered = filtered.filter((coupon) => coupon.isActive === false);
    }

    if (search) {
      const lowercasedSearch = search.toLowerCase();
      filtered = filtered.filter((coupon) => {
        const {
          code = "",
          discountPercentage = "",
          maxDiscount = "",
          minPurchase = "",
        } = coupon;

        return (
          code?.toString()?.toLowerCase().includes(lowercasedSearch) ||
          discountPercentage
            ?.toString()
            ?.toLowerCase()
            .includes(lowercasedSearch) ||
          maxDiscount?.toString()?.toLowerCase().includes(lowercasedSearch) ||
          minPurchase?.toString()?.toLowerCase().includes(lowercasedSearch)
        );
      });
    }

    setFilterCoupon(filtered);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    filterData(searchQuery, tab);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    filterData(value, activeTab);
  };

  // ----------------Pegination----------->
  const totalPages = Math.ceil(filterCoupon.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Get the current page data
  const paginatedData = filterCoupon.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // -----------Delete All Products------------
  const handleDeleteConfirmation = (id) => {
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
        handleDelete(id);
        Swal.fire("Deleted!", "Coupon has been deleted.", "success");
      }
    });
  };

  const handleDelete = async (couponId) => {
    setIsLoad(true);
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/coupon/delete/${couponId}`
      );
      if (data) {
        setFilterCoupon((prev) =>
          prev.filter((coupon) => coupon._id !== couponId)
        );
        toast.success("Coupon deleted successfully!");
        fetchCoupons();
      }
    } catch (error) {
      console.log("Error deleting coupon:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoad(false);
    }
  };

  // -------------Handle Update Status----------->

  const handleStatusConfirmation = (id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${status === true ? "enabled" : "disabled"} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatus(id, status);
        Swal.fire("Update!", "Coupon status has been updated.", "success");
      }
    });
  };
  const handleStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/coupon/status/${id}`,
        { status }
      );
      if (data) {
        fetchCoupons();
        toast.success("Coupon status updated!");
      }
    } catch (error) {
      console.log("Error update coupon status:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "code",
        minSize: 70,
        maxSize: 140,
        size: 90,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Code</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const code = row.original.code;

          return <div className={`text-[13px] font-medium `}>{code}</div>;
        },
      },
      //   Products
      {
        accessorKey: "productIds",
        minSize: 70,
        maxSize: 250,
        size: 150,
        grow: true,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Products</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const products = row.original?.productIds;
          const product = products[0]?.name;

          return (
            <div className="cursor-pointer text-[12px] flex items-center justify-start text-black w-full h-full">
              <select
                value={product}
                className="w-full h-[2rem] rounded-md outline-none border border-gray-700 cursor-pointer p-1"
              >
                <option value="">Products</option>
                {products?.map((product, i) => (
                  <option value={product?.name} key={i}>
                    {product?.name}
                  </option>
                ))}
              </select>
            </div>
          );
        },
      },
      //   discountPercentage
      {
        accessorKey: "discountPercentage",
        minSize: 70,
        maxSize: 140,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">DISCOUNT PERCENTAGE</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const discountPercentage = row.original.discountPercentage;

          return (
            <div
              className={`text-[13px] flex items-center justify-center w-full `}
            >
              {discountPercentage}%
            </div>
          );
        },
      },
      //   Discount
      {
        accessorKey: "maxDiscount",
        minSize: 70,
        maxSize: 140,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">MAX DISCOUNT</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const maxDiscount = row.original.maxDiscount;

          return (
            <div
              className={`text-[13px] flex items-center justify-center w-full `}
            >
              ${maxDiscount}
            </div>
          );
        },
      },
      //   Min Purchase
      {
        accessorKey: "minPurchase",
        minSize: 70,
        maxSize: 140,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">MIN PURCHASE</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const minPurchase = row.original.minPurchase;

          return (
            <div
              className={`text-[13px] flex items-center justify-center w-full `}
            >
              ${minPurchase}
            </div>
          );
        },
      },
      //   startDate
      {
        accessorKey: "startDate",
        minSize: 70,
        maxSize: 140,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">START DATE</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const startDate = row.original.startDate;

          return (
            <div
              className={`text-[13px] flex items-center justify-center w-full `}
            >
              {format(startDate, "yyyy-MM-dd")}
            </div>
          );
        },
      },
      {
        accessorKey: "endDate",
        minSize: 70,
        maxSize: 140,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">END DATE</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const endDate = row.original.endDate;

          return (
            <div
              className={`text-[13px] flex items-center justify-center w-full `}
            >
              {format(endDate, "yyyy-MM-dd")}
            </div>
          );
        },
      },

      //
      {
        accessorKey: "status",
        minSize: 100,
        maxSize: 140,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">STATUS</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const status = row.original.isActive;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {status === true ? (
                <button
                  onClick={() =>
                    handleStatusConfirmation(row.original._id, false)
                  }
                  className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-green-600 bg-green-200 hover:bg-green-300 text-green-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]"
                >
                  Active
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleStatusConfirmation(row.original._id, true)
                  }
                  className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-red-600 bg-red-200 hover:bg-red-300 text-red-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]"
                >
                  Inactive
                </button>
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
        accessorKey: "Actions",
        minSize: 100,
        maxSize: 140,
        size: 100,
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
            <div className="flex items-center justify-center gap-2 cursor-pointer text-[12px] text-black w-full h-full">
              <span
                onClick={() => {
                  setCouponId(row.original._id);
                  setShowCoupon(true);
                }}
                className="p-1 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-300 hover:scale-[1.03]"
              >
                <MdModeEditOutline className="text-[16px] text-white" />
              </span>

              <span
                onClick={() => {
                  handleDeleteConfirmation(row.original._id);
                  setCouponId(row.original._id);
                }}
                className="p-1 bg-red-200 hover:bg-red-300   rounded-full transition-all duration-300 hover:scale-[1.03]"
              >
                {isLoad && couponId === row.original._id ? (
                  <ImSpinner4 className="text-[16px] text-white animate-spin" />
                ) : (
                  <MdDelete className="text-[16px] text-red-500 hover:text-red-600" />
                )}
              </span>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line
    [couponData, currentUrl, filterCoupon, activeTab, paginatedData]
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
    // state: { isLoading: isLoading },

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
    <MainLayout title="Coupons - Ayoob Admin">
      <div className="p-1 sm:p-2 h-[100%] w-full pb-4  scroll-smooth">
        <div className="flex flex-col gap-3 pb-2 ">
          <Breadcrumb path={currentUrl} />
          <div className="w-full px-4 rounded-md bg-white flex items-center gap-4">
            <button
              className={`border-b-[3px] py-3 text-[14px] px-2 font-medium cursor-pointer ${
                activeTab === "All"
                  ? " border-red-600 text-red-600"
                  : "text-gray-700 hover:text-gray-800 border-white"
              }`}
              onClick={() => handleTabClick("All")}
            >
              All ({couponData.length || 0})
            </button>
            <button
              className={`border-b-[3px] py-3 text-[14px] px-2 font-medium cursor-pointer ${
                activeTab === "Active"
                  ? "border-b-[3px] border-red-600 text-red-600"
                  : "text-gray-700 hover:text-gray-800 border-white"
              }`}
              onClick={() => handleTabClick("Active")}
            >
              Active ({activeCoupon})
            </button>
            <button
              className={` border-b-[3px] py-3 text-[14px] px-2 font-medium cursor-pointer ${
                activeTab === "Inactive"
                  ? "border-b-[3px] border-red-600 text-red-600"
                  : "text-gray-700 hover:text-gray-800 border-white"
              }`}
              onClick={() => handleTabClick("Inactive")}
            >
              Inactive ({isactiveCoupon})
            </button>
          </div>
          {/* Actions */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-sans font-semibold text-black">
              Coupons
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCoupon(true)}
                className={`flex text-[14px] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] px-4`}
              >
                ADD NEW COUPON
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-[93%]  relative overflow-hidden overflow-x-auto  py-3 sm:py-4 bg-white rounded-md shadow  px-2 sm:px-4 mt-4  ">
          {/* ------Search & Pegination--------- */}
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
          {/* -----------Table Data------------- */}
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
        {/* -------------Handle Coupon Modal------------ */}
        {showCoupon && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <CouponModal
              setShowCoupon={setShowCoupon}
              couponId={couponId}
              setCouponId={setCouponId}
              fetchCoupons={fetchCoupons}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
