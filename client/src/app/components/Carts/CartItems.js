"use client";
import { useAuth } from "@/app/content/authContent";
import { Style } from "@/app/utils/CommonStyle";
import { Separator } from "@radix-ui/react-separator";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function CartItems({ products }) {
  console.log("selectedProduct:", products);
  const { selectedProduct, setSelectedProduct } = useAuth();
  const router = useRouter();

  // 🔹 Update Quantity
  const updateQuantity = (id, change) => {
    setSelectedProduct((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return updatedCart;
    });
  };

  // 🔹 Delete Product from Cart
  const deleteItem = (id) => {
    setSelectedProduct((prevCart) => {
      const updatedCart = prevCart?.filter((item) => item._id !== id);

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Product removed from cart");

      return updatedCart;
    });
  };

  // 🔹 Get Total Price
  const getTotal = () => {
    return selectedProduct
      ?.reduce((acc, item) => acc + item.price * item.quantity, 0)
      ?.toFixed(2);
  };

  return (
    <div className="w-full z-10 min-h-screen">
      <h2 className={`${Style.h1}`}>Your Cart</h2>
      <div className="w-full sm:w-[50%] py-4 pb-6">
        <Separator />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🛍️ Cart Items */}
        <div className="lg:col-span-2 space-y-2">
          <div className="border-b border-red-600 pb-4 mb-4 hidden sm:block">
            <div className="grid grid-cols-6 text-red-500 text-sm uppercase">
              <div className="col-span-2 text-[16px] sm:text-[18px] font-medium">
                Product
              </div>
              <div className="text-[16px] sm:text-[18px] font-medium">
                Quantity
              </div>
              <div className="text-[16px] sm:text-[18px] font-medium">
                Price
              </div>
              <div className="text-[16px] sm:text-[18px] font-medium">
                Total
              </div>
            </div>
          </div>
          {products?.length > 0 ? (
            products?.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-5 sm:grid-cols-6 items-center py-4 border-b border-gray-700  gap-2 sm:gap-4"
              >
                <div
                  onClick={() => router.push(`/products/${item._id}`)}
                  className="col-span-2 flex items-center flex-col sm:flex-row gap-2 sm:gap-3"
                >
                  <div className="w-[6rem]">
                    <div
                      className=" bg-gray-300/50 relative w-[5rem] h-[3rem] sm:h-[3.5rem] rounded-md overflow-hidden "
                      style={{
                        width: "5rem !important",
                      }}
                    >
                      <Image
                        src={item?.image}
                        alt={item?.title}
                        width={70}
                        height={50}
                        className=" text-9 w-[5rem] sm:w-[5rem] h-[3rem] sm:h-[3.5rem]  object-fill"
                      />
                    </div>
                  </div>
                  <span className=" text-[15px] sm:text-[17px] w-[8rem] sm:w-full font-medium truncate">
                    {item?.title}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 flex flex-col gap-3 w-full ">
                  <div
                    className=" flex items-center w-full border-2 border-red-500 rounded-sm"
                    style={{ padding: "0rem" }}
                  >
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="px-3 py-1 rounded-md text-gray-900 text-xl w-full h-full flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className=" text-[14px] sm:text-[16px] font-medium bg-red-500 w-full h-[2.4rem] flex items-center justify-center px-2 ">
                      {item?.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className=" px-3 py-1 rounded-md text-gray-900 text-xl w-full h-full flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className=" block sm:hidden text-[15px] sm:text-lg text-center text-gray-900">
                    €{(item?.price * item?.quantity)?.toFixed(2)}
                  </span>
                </div>
                <span className=" hidden sm:block text-[15px] sm:text-lg text-gray-900">
                  €{item?.price?.toFixed(2)}
                </span>
                <span className=" hidden sm:block text-[15px] sm:text-lg  text-gray-900">
                  €{(item?.price * item?.quantity)?.toFixed(2)}
                </span>
                <div className="w-full flex items-center justify-end px-4">
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">Your cart is empty.</p>
          )}
          {/* {cart.lenght > 0 && ( */}
          <div className="flex w-full flex-col ">
            <div className=" py-4">
              <Separator />
            </div>
            <div className="flex items-center justify-between text-xl font-medium">
              <span className="text-gray-600">Total:</span>
              <span className="text-black font-medium">
                €{parseFloat(getTotal()).toFixed(2)}
              </span>
            </div>
            <div className=" py-4">
              <Separator />
            </div>
          </div>
          {/* )} */}
        </div>

        {/* 📋 Order Summary */}

        <div className="py-[2rem] z-10 pb-[4rem] px-[1.5rem] rounded-sm relative cart max-h-fit min-h-[20rem] flex flex-col gap-3 border border-gray-300 bg-white/80 ">
          <div
            className="glow-effect"
            style={{
              width: "400px",
              height: "400px",
              left: "1rem",
            }}
          ></div>

          <h3 className="text-xl font-semibold mb-4 z-10">Order Summary</h3>
          <div className="flex justify-between z-10">
            <span className="text-red-600 uppercase">Subtotal:</span>
            <span>€{getTotal()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600 uppercase">G.S.T:</span>
            <span>€0.00</span>
            {/* {(getTotal() * 0.1).toFixed(2)} */}
          </div>
          <div className="flex justify-between">
            <span className="text-red-600 uppercase">Delivery:</span>
            <span>€0.00</span>
          </div>
          {/* <div className="w-full flex flex-col gap-3 z-10">
            <div
              className="w-full h-[2.6rem] bg-white"
              style={{
                clipPath:
                  "polygon(49.8% 1.23%, 7.48% 0%, 0% 35.29%, 0% 100%, 93.35% 100%, 100% 65.36%, 100% 0%)",
              }}
            >
              <input
                type="text"
                placeholder="Enter voucher code"
                // value={voucherCode}
                // onChange={(e) => setVoucherCode(e.target.value)}
                className="w-full h-full text-black px-6 bg-transparent outline-none border-none"
              />
            </div>
            <button
              className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 text-white py-2 mt-2 cursor-pointer "
              style={{
                clipPath:
                  "polygon(4.98% 0%, 86.4% 0%, 100% 0%, 100% 70.29%, 95.08% 100%, 9.8% 100%, 0% 100%, 0% 30.23%)",
              }}
            >
              Apply Voucher
            </button>
          </div> */}
          <div className="py-2 w-full">
            <Separator className="h-px w-full bg-gray-500" />
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>€{(parseFloat(getTotal()) + 10).toFixed(2)}</span>
          </div>
          <div className="py-2 w-full">
            <Separator className="h-px w-full bg-gray-500" />
          </div>
          <div className="flex items-center justify-center w-full z-10">
            <button
              className={`px-8 text-white mt-4 bg-red-600 rounded hover:bg-red-700 transition-all duration-300 ${
                selectedProduct?.length === 0
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } py-2  font-medium disabled:opacity-50`}
              disabled={selectedProduct?.length === 0}
              // style={{
              //   clipPath:
              //     " polygon(6.71% 0%, 86.4% 0%, 100% 0%, 100% 66.1%, 94.08% 100%, 9.8% 100%, 0% 100%, 0% 42.16%)",
              // }}
              onClick={() => router.push("/checkout")}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
