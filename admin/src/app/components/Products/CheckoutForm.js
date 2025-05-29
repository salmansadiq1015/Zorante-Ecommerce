import { FiLoader } from "react-icons/fi";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Style } from "@/app/utils/CommonStyle";

const CheckOutForm = ({ setOpen, carts, setpayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const createOrder = async (cart, payment_info) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/stripe/create-order`,
        { ...cart, payment_info }
      );
      if (data) {
        console.log(data);
        toast.success("Order successfully!");
        setOpen(false);
        setpayment(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);
      createOrder(carts, paymentIntent);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <div className="flex items-center justify-end pr-[1rem]">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className={`${Style.button2} flex items-center justify-center  !h-[2.6rem] !w-[7rem] mt-8`}
        >
          {isLoading ? (
            <FiLoader className="h-5 w-5 animate-spin text-white" />
          ) : (
            "Pay now"
          )}
        </button>
      </div>
      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className="text-red-500 pt-2">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckOutForm;
