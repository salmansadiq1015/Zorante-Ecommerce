import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import { Separator } from "@radix-ui/react-separator";

export default function PaypalCheckout({ setpayment, carts, shippingFee }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Mock Data (Replace with actual data from state/store)

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/paypal/payment`,
        {
          ...carts,
          shippingFee: shippingFee,
        }
      );

      if (response.data.success) {
        const approvalUrl = response.data.approvalUrl;
        window.location.href = approvalUrl;
        setpayment(false);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong during payment."
      );
      console.error("Payment Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" relative w-full max-w-lg max-h-[95vh] min-h-[14rem] mt-[4rem]  overflow-y-auto paymentmethod shidden border-2 border-red-800 rounded-md bg-white  shadow-lg">
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between py-2 px-3 bg-red-700">
          <h2 className="text-xl font-semibold text-white">
            Checkout with Paypal
          </h2>
          <button
            onClick={() => {
              setpayment(false);
            }}
            className="rounded-full p-1 hover:bg-gray-300/40 transition-colors cursor-pointer"
          >
            <IoClose size={20} className="text-gray-100" />
          </button>
        </div>
        <div className="py-3 px-7">
          <div className="order-summary">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <ul className="flex flex-col gap-3">
              {carts.products.map((product, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-[.7rem] h-[.7rem] rounded-full bg-red-700"></span>
                  {product?.title} x {product?.quantity} = $
                  {product?.price * product?.quantity}
                </li>
              ))}
              <div className="flex items-center gap-2">
                <span className="w-[.7rem] h-[.7rem] rounded-full bg-red-700"></span>
                <li>
                  Shipping Fee: <strong>${shippingFee}</strong>
                </li>
              </div>
              <Separator className="h-px bg-gray-200 my-2" />
              <li className=" w-full flex justify-end">
                <strong>Total: ${carts.totalAmount || 0}</strong>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-5 justify-end w-full mt-6">
            <button
              onClick={() => setpayment(false)}
              className="border-2 rounded-md hover:shadow-md border-gray-600 h-[2.6rem] px-5"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-md hover:shadow-md cursor-pointer flex items-center justify-center gap-2  !h-[2.6rem]  px-5 py-1"
            >
              Pay with PayPal{" "}
              {loading && <ImSpinner2 className="h-5 w-5 animate-spin" />}
            </button>
          </div>
        </div>
      </div>

      {/* Order Summary */}

      {/* Payment Button */}

      {/* Error Message */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
