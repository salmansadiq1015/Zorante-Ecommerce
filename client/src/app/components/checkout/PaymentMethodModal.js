"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegCreditCard } from "react-icons/fa6";
import { FaCcPaypal } from "react-icons/fa6";
import CheckoutElement from "./CheckoutElement";
import PaypalCheckout from "./PaypalCheckout";

export default function PaymentMethodModal({
  isOpen,
  onClose,
  product,
  shippingFee,
}) {
  console.log("product", product);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [payment, setpayment] = useState(false);

  useEffect(() => {
    product.paymentMethod = paymentMethod;
  }, [paymentMethod, product]);
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-200/70">
      <div className="relative w-full max-w-lg max-h-[95vh] min-h-[14rem] mt-[4rem]  overflow-y-auto paymentmethod shidden border-2 border-red-800 rounded-md bg-white py-6 px-7 shadow-lg">
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">
              Select Payment Method
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-300 transition-colors cursor-pointer"
            >
              <IoClose size={20} className="text-gray-600" />
            </button>
          </div>
          {/* Select Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
            <button
              className="w-full flex items-center justify-center py-3   bg-sky-600 hover:bg-sky-700 text-white cursor-pointer transition-all duration-300 "
              style={{
                clipPath:
                  "polygon(8.98% 0%, 86.4% 0%, 100% 0%, 100% 62.29%, 91.08% 100%, 9.8% 100%, 0% 100%, 0% 36.23%)",
              }}
              onClick={() => {
                setPaymentMethod("Credit Card");
                setpayment(true);
              }}
            >
              <FaRegCreditCard size={20} className="mr-2" />
              Checkout with Card
            </button>
            <button
              className="w-full flex items-center justify-center  py-3 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white cursor-pointer "
              style={{
                clipPath:
                  "polygon(8.98% 0%, 86.4% 0%, 100% 0%, 100% 62.29%, 91.08% 100%, 9.8% 100%, 0% 100%, 0% 36.23%)",
              }}
              onClick={() => {
                setPaymentMethod("Paypal");
                setpayment(true);
              }}
            >
              <FaCcPaypal size={20} className="mr-2" />
              Checkout with Paypal
            </button>
          </div>
        </div>
      </div>
      {/* Credit Card */}
      {payment && (
        <div className="fixed top-[3rem] left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[99999] bg-gray-300/80 overflow-y-auto shidden">
          {paymentMethod === "Credit Card" ? (
            <CheckoutElement
              setpayment={setpayment}
              carts={product}
              shippingFee={shippingFee}
            />
          ) : (
            <PaypalCheckout
              setpayment={setpayment}
              carts={product}
              shippingFee={shippingFee}
            />
          )}
        </div>
      )}
    </div>
  );
}
