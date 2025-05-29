"use client";
import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import Select from "react-select";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

export default function HandleOrderModal({ setIsShow, fetchOrders }) {
  const [productsData, setProductsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [orderDetail, setOrderDetail] = useState({
    user: "",
    products: [],
    shippingFee: 10,
    shippingAddress: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    paymentMethod: "Credit Card",
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(false);

  // Fetch All Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/all/admin/products`
      );
      setProductsData(data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch All Users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/allUsers`
      );
      setUsersData(data.users || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  // User Options for Select
  const userOptions = usersData.map((user) => ({
    value: user._id,
    label: (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full relative overflow-hidden">
          <Image
            src={user.avatar || "/profile.png"}
            layout="fill"
            alt={user.name}
          />
        </div>
        {user.name}
      </div>
    ),
  }));

  // Product Options for Select
  const productOptions = productsData.map((product) => ({
    value: product._id,
    label: (
      <div className="flex items-center gap-2">
        <div className="w-9 h-6 rounded-md relative overflow-hidden">
          <Image
            src={product.thumbnails?.[0] || "/placeholder.png"}
            layout="fill"
            alt={product.name}
          />
        </div>
        <div>
          <span className="text-sm">{product.name}</span> <br />
          <span className="text-sm text-gray-500">${product.price}</span>
        </div>
      </div>
    ),
  }));

  // Handle Add Product
  const handleAddProduct = (selectedProducts) => {
    const updatedProducts = selectedProducts.map((product) => ({
      product: product.value,
      quantity: 1,
      price: productsData.find((p) => p._id === product.value)?.price || 0,
      colors: productsData.find((p) => p._id === product.value)?.colors || [],
      sizes: productsData.find((p) => p._id === product.value)?.sizes || [],
      selectedColor: "",
      selectedSize: "",
    }));
    setOrderDetail((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  // Update Product Details (Quantity, Color, Size)
  const updateProductDetail = (index, field, value) => {
    const updatedProducts = [...orderDetail.products];
    updatedProducts[index][field] = value;

    const totalAmount = updatedProducts
      .reduce((sum, prod) => sum + prod.quantity * prod.price, 0)
      .toFixed(2);

    setOrderDetail((prev) => ({
      ...prev,
      products: updatedProducts,
      totalAmount,
    }));
  };

  // Update Shipping Address based on selected user
  const updateShippingAddress = (userId) => {
    const selectedUser = usersData.find((user) => user._id === userId);
    if (selectedUser) {
      setOrderDetail((prev) => ({
        ...prev,
        shippingAddress: {
          address: selectedUser.addressDetails?.address || "",
          city: selectedUser.addressDetails?.city || "",
          state: selectedUser.addressDetails?.state || "",
          postalCode: selectedUser.addressDetails?.pincode || "",
          country: selectedUser.addressDetails?.country || "",
        },
      }));
    }
  };

  // Handle Submit Order
  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      console.log("orderDetail:", orderDetail);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/admin/create-order`,
        orderDetail
      );
      if (response.data) {
        fetchOrders();
        toast.success("Order created successfully!");
        setIsShow(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-md overflow-hidden min-h-[70vh] max-h-[99vh] flex flex-col">
      <div className="flex items-center justify-between bg-customRed px-4 py-2 sm:py-4">
        <h3 className="text-lg font-medium text-white">Add Order</h3>
        <span
          onClick={() => setIsShow(false)}
          className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white"
        >
          <CgClose className="text-[18px]" />
        </span>
      </div>
      <div className="w-full max-h-[99%] overflow-y-auto ">
        <form
          className="w-full p-4 flex  flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitOrder();
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User <span className="text-red-500">*</span>
              </label>
              <Select
                options={userOptions}
                onChange={(selectedUser) => {
                  setOrderDetail((prev) => ({
                    ...prev,
                    user: selectedUser?.value || "",
                  }));
                  updateShippingAddress(selectedUser?.value);
                }}
                placeholder="Select User"
              />
            </div>

            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Products <span className="text-red-500">*</span>
              </label>
              <Select
                options={productOptions}
                isMulti
                onChange={handleAddProduct}
                placeholder="Select Products"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {orderDetail.products.map((product, index) => (
              <div
                key={product.product}
                className="border rounded-lg px-2 sm:px-4 py-2 transition-shadow duration-300 bg-gradient-to-br from-gray-50 to-gray-100"
              >
                {/* Product Name */}
                <h4 className="text-lg font-bold text-gray-700 truncate">
                  {productsData.find((p) => p._id === product.product)?.name}
                </h4>

                {/* Quantity Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-600">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 hover:shadow-lg transition duration-300"
                      onClick={() =>
                        updateProductDetail(
                          index,
                          "quantity",
                          Math.max(product.quantity - 1, 1)
                        )
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={product.quantity}
                      readOnly
                      className="w-14 text-center border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 hover:shadow-lg transition duration-300"
                      onClick={() =>
                        updateProductDetail(
                          index,
                          "quantity",
                          product.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Color Selector */}
                  {product.colors?.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Color
                      </label>
                      <Select
                        options={product.colors.map((color) => ({
                          value: color.code,
                          label: (
                            <div className="flex items-center gap-2">
                              <div
                                style={{
                                  backgroundColor: color.code,
                                  width: "15px",
                                  height: "15px",
                                  borderRadius: "50%",
                                }}
                              />
                              <span>{color.name}</span>
                            </div>
                          ),
                        }))}
                        onChange={(selected) =>
                          updateProductDetail(
                            index,
                            "selectedColor",
                            selected.value
                          )
                        }
                        placeholder="Select Color"
                        className="border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* Size Selector */}
                  {product.sizes?.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Size
                      </label>
                      <Select
                        options={product.sizes.map((size) => ({
                          value: size,
                          label: size,
                        }))}
                        onChange={(selected) =>
                          updateProductDetail(
                            index,
                            "selectedSize",
                            selected.value
                          )
                        }
                        placeholder="Select Size"
                        className="border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shipping Address */}
            <div className="border rounded-lg px-2 sm:px-4 py-2 transition-shadow duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="flex items-center gap-2 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Shipping Address:
                </label>
                <span>{orderDetail.shippingAddress?.address}</span>
              </div>
              <div className="flex items-center gap-2 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  City:
                </label>
                <span>{orderDetail.shippingAddress.city}</span>
              </div>
              <div className="flex items-center gap-2 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  State:
                </label>
                <span>{orderDetail.shippingAddress.state}</span>
              </div>
              <div className="flex items-center gap-2 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code:
                </label>
                <span>{orderDetail.shippingAddress.postalCode}</span>
              </div>
              <div className="flex items-center gap-2 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Country:
                </label>
                <span>{orderDetail.shippingAddress.country}</span>
              </div>
            </div>{" "}
            {/*  */}
            <div className="border rounded-lg px-2 sm:px-4 py-2 transition-shadow duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="flex items-center gap-2 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Subtotal:
                </label>
                <span className="text-black">
                  ${parseFloat(orderDetail.totalAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Shipping:
                </label>
                <span className="text-black">
                  ${parseFloat(orderDetail.shippingFee).toFixed(2)}
                </span>
              </div>
              <hr className="w-full h-[2px] bg-gray-500 my-2" />
              <div className="flex items-center gap-2 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Total Amount:
                </label>
                <span className="text-black">
                  $
                  {(
                    parseFloat(orderDetail.totalAmount) +
                    parseFloat(orderDetail.shippingFee)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end w-full pb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsShow(false);
                }}
                className="w-[6rem] py-[.3rem] text-[14px] rounded-sm border-2 border-customRed text-red-700 hover:bg-gray-100 hover:shadow-md hover:scale-[1.03] transition-all duration-300 "
              >
                CANCEL
              </button>
              <button className="w-[6rem] py-[.4rem] text-[14px] flex items-center justify-center rounded-sm bg-customRed hover:bg-red-700 hover:shadow-md hover:scale-[1.03] transition-all duration-300 text-white">
                {loading ? (
                  <span>
                    <FaSpinner className="h-5 w-5 text-white animate-spin" />
                  </span>
                ) : (
                  <span>{"Create"}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
