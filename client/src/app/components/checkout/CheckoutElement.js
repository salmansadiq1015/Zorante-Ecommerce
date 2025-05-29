"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoCloseOutline } from "react-icons/io5";
import CheckOutForm from "./CheckoutForm";

export default function CheckoutElement({ carts, setpayment, shippingFee }) {
  const [publicKey, setPublickey] = useState("");
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [open, setOpen] = useState(false);

  console.log("publicKey:", publicKey);
  console.log("stripePromise:", stripePromise);
  console.log("clientSecret:", clientSecret);

  // Get Stripe Public Key
  const getPublicKey = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/payment/stripe/publishableKey`
      );
      setPublickey(data.publishableKey);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPublicKey();
  }, []);

  useEffect(() => {
    setStripePromise(loadStripe(publicKey));
    const initializeStripe = async () => {
      if (carts) {
        const amount = Math.round(carts.totalAmount);
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/payment`,
            { amount }
          );
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error("Error fetching the client secret:", error);
        }
      }
    };

    initializeStripe();
  }, [carts, publicKey]);

  useEffect(() => {
    if (stripePromise && clientSecret && carts) {
      setOpen(true);
    }
  }, [stripePromise, clientSecret, carts]);

  return (
    <div>
      {open && (
        <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-[999] flex items-center justify-center overflow-y-auto ">
          <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow px-2 py-3 mt-[4rem]">
            <div className="w-full flex justify-end">
              <IoCloseOutline
                size={40}
                className="text-black cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  setpayment(false);
                }}
              />
            </div>
            <div className="w-full h-full overflow-y-auto ">
              {stripePromise && clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        fontWeightNormal: "500",
                        borderRadius: "2px",
                        colorPrimary: "#f360a6",
                        tabIconSelectedColor: "#fff",
                        gridRowSpacing: "16px",
                      },
                      rules: {
                        ".Tab, .Input, .Block, .CheckboxInput, .CodeInput": {
                          boxShadow: "0px 3px 10px rgba(18, 42, 66, 0.08)",
                        },
                        ".Block": {
                          borderColor: "transparent",
                        },
                        ".BlockDivider": {
                          backgroundColor: "#ebebeb",
                        },
                        ".Tab, .Tab:hover, .Tab:focus": {
                          border: "0",
                        },
                        ".Tab--selected, .Tab--selected:hover": {
                          backgroundColor: "#f360a6",
                          color: "#fff",
                        },
                      },
                    },
                  }}
                >
                  <CheckOutForm
                    setOpen={setOpen}
                    carts={carts}
                    setpayment={setpayment}
                    shippingFee={shippingFee}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
