import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import { FaSpinner } from "react-icons/fa";
import Select from "react-select";
import { RiCoupon4Line } from "react-icons/ri";

export default function CouponModal({
  setShowCoupon,
  couponId,
  setCouponId,
  fetchCoupons,
}) {
  const [productData, setProductData] = useState([]);
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const [minPurchase, setMinPurchase] = useState(0);
  const [productIds, setProductIds] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsloading] = useState(false);

  // Fetch Products
  const getProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/coupon`
      );
      if (data) {
        const products = data.products;
        setProductData(products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, []);

  //   Fetch Coupon
  const getCouponInfo = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/coupon/detail/${couponId}`
      );
      if (data) {
        const coupon = data.coupon;
        console.log("coupon:", coupon);
        setCode(coupon.code);
        setDiscountPercentage(coupon.discountPercentage);
        setMaxDiscount(coupon.maxDiscount);
        setMinPurchase(coupon.minPurchase);
        setProductIds(
          coupon.productIds.map((product) => ({
            value: product._id,
            label: product.name,
          }))
        );
        const formatDateForInput = (date) => {
          const d = new Date(date);
          const year = d.getFullYear();
          const month = (d.getMonth() + 1).toString().padStart(2, "0");
          const day = d.getDate().toString().padStart(2, "0");
          return `${year}-${month}-${day}`;
        };
        setStartDate(formatDateForInput(coupon.startDate));
        setEndDate(formatDateForInput(coupon.endDate));
      }
      endDate;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCouponInfo();
    // eslint-disable-next-line
  }, [couponId]);

  //   Handle Coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !startDate || !endDate || !productIds) {
      toast.error("Please fill out all required fields.");
      return;
    }
    setIsloading(true);
    const couponData = {
      code,
      productIds: productIds.map((product) => product.value),
      discountPercentage,
      maxDiscount,
      minPurchase,
      startDate,
      endDate,
    };
    try {
      if (couponId) {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/coupon/update/${couponId}`,
          { ...couponData }
        );

        if (data) {
          toast.success(data?.message || "Coupon info updated successfully");
        }
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/coupon/create`,
          { ...couponData }
        );
        if (data) {
          toast.success(data?.message || "Coupon added successfully");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      fetchCoupons();
      setShowCoupon(false);
      setIsloading(false);
      setCouponId("");
    }
  };

  //   Product Opctions
  const productOptions =
    productData &&
    productData?.map((product) => ({
      value: product._id,
      label: product.name,
    }));

  return (
    <div className="w-[42rem] bg-white rounded-md overflow-hidden shadow min-h-[15rem] max-h-[99%] flex flex-col">
      <div className="flex items-center justify-between bg-customRed px-4 py-2 sm:py-4 ">
        <h3 className="text-lg font-medium text-white flex items-center gap-1">
          {couponId ? "Edit Coupon" : "Add New Coupon"}{" "}
          <RiCoupon4Line className="h-5 w-5" />
        </h3>
        <span
          onClick={() => {
            setCouponId("");
            setShowCoupon(false);
          }}
          className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white "
        >
          <CgClose className="text-[18px]" />
        </span>
      </div>
      <div className="w-full h-[98%] overflow-y-auto ">
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col gap-4 px-4 py-2 mt-4 h-full w-full "
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Coupon Code<span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                value={code}
                minLength={6}
                onChange={(e) => setCode(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="Enter coupon code"
                required
              />
            </div>
            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Discount Percentage<span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="Discount Percentahe"
                required
              />
            </div>
            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Max Discount<span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="Max Discount"
                required
              />
            </div>
            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Min Purchase<span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="Min Purchase"
                required
              />
            </div>
            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Products<span className="text-red-700">*</span>
              </label>
              <Select
                options={productOptions}
                value={productIds}
                onChange={setProductIds}
                isMulti
                placeholder="Select Products"
              />
            </div>
            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Start Date<span className="text-red-700">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`${Style.input} w-full`}
                required
              />
            </div>
            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                End Date<span className="text-red-700">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`${Style.input} w-full`}
                required
              />
            </div>
            {/*  */}
          </div>
          <div className="flex items-center justify-end w-full pb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setCouponId("");
                  setShowCoupon(false);
                }}
                className="w-[6rem] py-[.3rem] text-[14px] rounded-sm border-2 border-customRed text-red-700 hover:bg-gray-100 hover:shadow-md hover:scale-[1.03] transition-all duration-300 "
              >
                CANCEL
              </button>
              <button className="w-[6rem] py-[.4rem] text-[14px] flex items-center justify-center rounded-sm bg-customRed hover:bg-red-700 hover:shadow-md hover:scale-[1.03] transition-all duration-300 text-white">
                {isLoading ? (
                  <span>
                    <FaSpinner className="h-5 w-5 text-white animate-spin" />
                  </span>
                ) : (
                  <span>{couponId ? "Save" : "SUBMIT"}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
