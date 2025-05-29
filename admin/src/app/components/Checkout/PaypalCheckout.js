import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PaypalCheckout({ setpayment }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Mock Data (Replace with actual data from state/store)
  const carts = {
    user: "6751997892669289c3e2f4ad",
    products: [
      {
        product: "675321f898a3f20a1bca6f7b",
        quantity: 2,
        price: 5999,
        colors: ["#000000", "#FFFFFF"],
        sizes: ["M", "L"],
      },
      {
        product: "675322b71a864f380512f283",
        quantity: 2,
        price: 140,
        colors: ["#FFFFFF", "#0000FF"],
        sizes: ["XL", "L"],
      },
    ],
    totalAmount: "12328",
    shippingFee: "50",
    shippingAddress: {
      address: "123 Street, ABC Avenue",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
    },
    paymentMethod: "PayPal",
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/paypal/payment`,
        {
          ...carts,
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
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* Order Summary */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        <ul>
          {carts.products.map((product, index) => (
            <li key={index}>
              {product.name} x {product.quantity} = $
              {product.price * product.quantity}
            </li>
          ))}
          <li>Shipping Fee: ${carts.shippingFee}</li>
          <li>
            <strong>Total: ${carts.totalAmount}</strong>
          </li>
        </ul>
      </div>

      {/* Payment Button */}
      <div className="flex items-center gap-5">
        <button onClick={() => setpayment(false)}>Cancel</button>
        <button onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Pay with PayPal"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
