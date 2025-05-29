"use client";
import MainLayout from "@/app/components/Layout/Layout";
import { useAuth } from "@/app/content/authContent";
import { Style } from "@/app/utils/CommonStyle";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { MdOutlinePayments } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import PaymentMethodModal from "@/app/components/checkout/PaymentMethodModal";
import toast from "react-hot-toast";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { useRouter } from "next/navigation";

const paymentMethods = [
  {
    id: 1,
    image: "/checkout1.png",
  },
  {
    id: 2,
    image: "/checkout2.png",
  },
  {
    id: 3,
    image: "/checkout3.png",
  },
  {
    id: 4,
    image: "/checkout4.png",
  },
  {
    id: 5,
    image: "/checkout5.png",
  },
];

// const carts = {
//   user: "6751997892669289c3e2f4ad",
//   products: [
//     {
//       product: "677788a8f14cad4ebe669947",
//       quantity: 2,
//       price: 1300,
//       colors: ["#000000", "#FFFFFF"],
//       sizes: ["M", "L"],
//     },
//     {
//       product: "67780226425c66b0a52f9127",
//       quantity: 1,
//       price: 5999,
//       colors: ["#FFFFFF", "#0000FF"],
//       sizes: ["XL", "L"],
//     },
//   ],
//   totalAmount: "12278",
//   shippingFee: "500",
//   shippingAddress: {
//     address: "123 Street, ABC Avenue",
//     city: "New York",
//     state: "NY",
//     postalCode: "10001",
//     country: "USA",
//   },
//   paymentMethod: "Credit Card",
// };

export default function Checkout() {
  const { auth, oneClickBuyProduct, setOneClickBuyProduct } = useAuth();
  const [shippingFee, setShippingFee] = useState(0);
  const [cart, setCart] = useState({
    user: "",
    products: [],
    totalAmount: "",
    shippingFee: shippingFee,
    shippingAddress: {
      address: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
    },
    paymentMethod: "Credit Card",
  });
  const [voucherCode, setVoucherCode] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  // 🔹 Update Quantity
  const updateQuantity = (id, change) => {
    if (!oneClickBuyProduct) return;
    if (oneClickBuyProduct._id !== id) return;

    const updatedQuantity = Math.max(1, oneClickBuyProduct.quantity + change);

    setOneClickBuyProduct({
      ...oneClickBuyProduct,
      quantity: updatedQuantity,
    });
  };
  // 🔹 Get Total Price
  const getTotal = () => {
    if (!oneClickBuyProduct) return 0;
    return (oneClickBuyProduct.price * oneClickBuyProduct.quantity).toFixed(2);
  };

  // Apply Voucher
  const applyVoucher = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!voucherCode) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/coupon/apply/order`,
        {
          code: voucherCode,
          cartItems: cart.products.map((item) => ({
            productId: item.product,
            price: item.price,
            quantity: item.quantity,
          })),
          cartTotal: cart.totalAmount,
        }
      );
      if (data) {
        setDiscount(data.discount);
        toast.success("Voucher applied successfully.");
        setVoucherCode("");
        setIsDisabled(true);
      } else {
        toast.error(response?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Add Shipping Fee
  const getShippingFee = async () => {
    if (!auth?.user) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/shipping/${auth?.user?.addressDetails?.country}`
      );
      if (data) {
        setCart((prev) => ({
          ...prev,
          shippingFee: data?.shipping?.fee ?? 0,
        }));
        setShippingFee(data?.shipping?.fee ?? 0);
      }
    } catch (error) {
      console.error("Error getting shipping fee:", error);
    }
  };

  useEffect(() => {
    getShippingFee();
  }, [auth?.user]);

  // Cart
  useEffect(() => {
    if (!auth?.user || !oneClickBuyProduct) return;

    const productTotal = oneClickBuyProduct.price * oneClickBuyProduct.quantity;
    const totalAmount = (productTotal - discount + shippingFee).toFixed(2);

    setCart({
      user: auth?.user?._id,
      products: [oneClickBuyProduct],
      totalAmount,
      shippingFee,
      shippingAddress: {
        address: auth?.user?.addressDetails?.address || "",
        country: auth?.user?.addressDetails?.country || "",
        state: auth?.user?.addressDetails?.state || "",
        city: auth?.user?.addressDetails?.city || "",
        postalCode: auth?.user?.addressDetails?.pincode || "",
      },
      paymentMethod: "Credit Card",
    });
  }, [oneClickBuyProduct, auth?.user, discount, shippingFee]);

  // Handle Verification
  const handelVerification = () => {
    if (
      !auth?.user?.name ||
      !auth?.user?.email ||
      !auth?.user?.number ||
      !auth?.user?.addressDetails?.address ||
      !auth?.user?.addressDetails?.country ||
      !auth?.user?.addressDetails?.state ||
      !auth?.user?.addressDetails?.city ||
      !auth?.user?.addressDetails?.pincode
    ) {
      toast.error("Please complete shipping information");
      return;
    }
    setShowPayment(true);
  };

  return (
    <MainLayout title="Zorante - Checkout">
      <div className="bg-transparent min-h-screen w-full z-10 relative px-4 sm:px-8 py-5 sm:py-6 overflow-hidden">
        <div className="grid grid-cols-5 gap-5 sm:gap-[2rem] w-full">
          {/* Left */}
          <div className="col-span-5 sm:col-span-3 flex flex-col gap-4  w-full">
            <h1 className={`${Style.h1}`}>Checkout</h1>
            <Separator />
            {/* Personal Information */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center justify-between gap-6">
                <p className="text-[17px] sm:text-lg font-medium text-gray-900 flex items-center gap-2">
                  <MdOutlineLocationOn size={25} color="red" />
                  Shipping Information
                </p>
                <span
                  onClick={() =>
                    router.push(
                      auth.user
                        ? `profile/${auth.user._id}?tab=profile`
                        : `/authentication`
                    )
                  }
                  className="p-1 rounded-full bg-red-100 flex items-center justify-center cursor-pointer"
                >
                  <BiSolidEdit className="h-5 w-5 text-red-500 hover:text-red-700 transition-all duration-300" />
                </span>
              </div>
              <form className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="w-full h-[2.8rem] ">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={auth?.user?.name || ""}
                      required
                      readOnly
                      className=" w-full h-full px-5  py-2  text-[15px] text-gray-900 bg-transparent border border-gray-400 rounded-sm outline-none"
                    />
                  </div>
                  <div className="w-full h-[2.8rem] ">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={auth?.user?.email || ""}
                      readOnly
                      required
                      className=" w-full h-full px-5 py-2 text-[15px] text-gray-900 bg-transparent  border border-gray-400 outline-none rounded-sm "
                    />
                  </div>
                </div>

                <div className="w-full h-[2.8rem] inputBox-clip">
                  <input
                    type="text"
                    placeholder="Enter your shipping address"
                    value={auth?.user?.addressDetails?.address || ""}
                    readOnly
                    required
                    className=" w-full h-full px-5 py-2 text-[15px] text-gray-900 bg-transparent  border border-gray-400 outline-none rounded-sm "
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="w-full h-[2.8rem] ">
                    <input
                      type="text"
                      placeholder="Country"
                      value={auth?.user?.addressDetails?.country || ""}
                      readOnly
                      required
                      className=" w-full h-full px-5 py-2 text-[15px] text-gray-900 bg-transparent  border border-gray-400 outline-none rounded-sm "
                    />
                  </div>
                  <div className="w-full h-[2.8rem] ">
                    {/* State Dropdown */}
                    <input
                      type="text"
                      placeholder="State"
                      value={auth?.user?.addressDetails?.state || ""}
                      readOnly
                      required
                      className=" w-full h-full px-5 py-2 text-[15px] text-gray-900 bg-transparent  border border-gray-400 outline-none rounded-sm "
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="w-full h-[2.8rem] ">
                    <input
                      type="text"
                      placeholder="City"
                      value={auth?.user?.addressDetails?.city || ""}
                      readOnly
                      required
                      className=" w-full h-full px-5 py-2 text-[15px] text-gray-900 bg-transparent  border border-gray-400 outline-none rounded-sm "
                    />
                  </div>
                  <div className="w-full h-[2.8rem] ">
                    {/* State Dropdown */}
                    <div className="flex items-center gap-1 w-full px-[1px]">
                      <input
                        type="number"
                        placeholder="Phone Number"
                        value={auth?.user?.number || ""}
                        readOnly
                        className="w-full h-[2.8rem] pl-2 pr-3 py-2 text-[15px] text-gray-900 bg-transparent  border border-gray-400 outline-none rounded-sm "
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-2 border-red-500 accent-red-600 "
                  />
                  <span className="text-sm text-gray-500">
                    Same as shipping address
                  </span>
                </div>
              </form>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {paymentMethods?.map((peymentMethod, i) => (
                <Image
                  src={`${peymentMethod?.image}`}
                  key={i}
                  alt="checkout"
                  width={80}
                  height={50}
                  className="object-contain cursor-pointer"
                />
              ))}
            </div>
          </div>
          {/* Right */}
          <div className="col-span-5 sm:col-span-2 z-[20] w-full py-[2rem] bg-transparent pb-[4rem] px-[1.5rem] rounded-lg relative cart max-h-fit min-h-[20rem] flex flex-col gap-3">
            <div className="glow-effect"></div>

            <h3 className="text-xl font-semibold mb-4 z-10">Your Cart</h3>

            {oneClickBuyProduct ? (
              <div
                key={oneClickBuyProduct._id}
                className="flex items-center justify-between w-full py-4 border-b border-gray-700  gap-2 sm:gap-4"
              >
                <div className=" flex items-center flex-row gap-2 sm:gap-3">
                  <div className=" bg-gray-300/50 relative  rounded-lg">
                    <Image
                      src={oneClickBuyProduct?.image}
                      alt={oneClickBuyProduct?.title}
                      width={40}
                      height={40}
                      className=" text-8 w-[6rem] h-[4rem]  rounded-lg object-fill"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className=" text-[15px] sm:text-[17px] font-medium truncate w-[9rem] sm:w-[15rem]">
                      {oneClickBuyProduct?.title}
                    </span>
                    <div
                      className="flex items-center max-w-[9rem] min-w-[9rem]  border-2 border-red-500 rounded-sm"
                      style={{ padding: "0rem" }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(oneClickBuyProduct._id, -1)
                        }
                        className="px-3 py-1 rounded-md text-gray-900 text-xl w-full h-full flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className=" text-[14px] sm:text-[16px] font-medium bg-red-500 w-full h-[2.4rem] flex items-center justify-center px-2 ">
                        {oneClickBuyProduct?.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(oneClickBuyProduct._id, 1)
                        }
                        className=" px-3 py-1 rounded-md text-gray-900 text-xl w-full h-full flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <span className=" text-[15px] sm:text-lg ">
                  €
                  {(
                    oneClickBuyProduct.price * oneClickBuyProduct?.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ) : (
              <p className="text-center text-gray-400">Your cart is empty.</p>
            )}

            <div className="py-2 w-full">
              <Separator className="h-px w-full bg-gray-500" />
            </div>
            <div className="flex justify-between z-10">
              <span className="text-red-600 uppercase">Subtotal:</span>
              <span>€{getTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600 uppercase">G.S.T:</span>
              <span>€{(getTotal() * 0.01).toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-red-600 uppercase">Delivery:</span>
              <span>€{shippingFee || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600 uppercase">Discount:</span>
              <span>€{discount}</span>
            </div>
            <form
              onSubmit={applyVoucher}
              className="w-full flex flex-col gap-3 z-10"
            >
              <div className="w-full h-[2.6rem] bg-white border border-gray-400 rounded-sm">
                <input
                  type="text"
                  placeholder="Enter voucher code"
                  value={voucherCode}
                  required
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="w-full h-full text-black px-6 bg-transparent outline-none border-none"
                />
              </div>
              <button
                className={`w-full h-[2.8rem] flex items-center rounded justify-center gap-2  transition-all duration-300 text-white py-2 mt-2 ${
                  isDisabled
                    ? "cursor-not-allowed bg-red-400"
                    : "cursor-pointer bg-red-600 hover:bg-red-700"
                }  `}
                // style={{
                //   clipPath:
                //     "polygon(4.98% 0%, 86.4% 0%, 100% 0%, 100% 70.29%, 95.08% 100%, 9.8% 100%, 0% 100%, 0% 30.23%)",
                // }}
                disabled={isDisabled}
              >
                Apply Voucher{" "}
                {loading && (
                  <FiLoader className="h-5 w-5 animate-spin text-white" />
                )}
              </button>
            </form>
            <div className="py-2 w-full">
              <Separator className="h-px w-full bg-gray-500" />
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span className="text-red-600 uppercase">Total:</span>
              <span>€{cart?.totalAmount}</span>
            </div>
            <div className="py-2 w-full">
              <Separator className="h-px w-full bg-gray-500" />
            </div>
            <div className="flex items-center justify-center w-full z-10">
              {!auth?.user ? (
                <button
                  className={`px-8 text-white mt-4 bg-red-600 hover:bg-red-700 transition-all duration-300 cursor-pointer py-2  font-medium disabled:opacity-50`}
                  style={{
                    clipPath:
                      " polygon(6.71% 0%, 86.4% 0%, 100% 0%, 100% 66.1%, 94.08% 100%, 9.8% 100%, 0% 100%, 0% 42.16%)",
                  }}
                  onClick={() => router.push("/authentication")}
                >
                  Login
                </button>
              ) : (
                <button
                  className={`px-8 text-white mt-4 rounded bg-red-600 hover:bg-red-700 transition-all duration-300 ${
                    oneClickBuyProduct.length === 0
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } py-2  font-medium disabled:opacity-50`}
                  disabled={
                    oneClickBuyProduct?.length === 0 ||
                    loading ||
                    !auth?.user?.name ||
                    !auth?.user?.email ||
                    !auth?.user?.number ||
                    !auth?.user?.addressDetails?.address ||
                    !auth?.user?.addressDetails?.country ||
                    !auth?.user?.addressDetails?.state ||
                    !auth?.user?.addressDetails?.city ||
                    !auth?.user?.addressDetails?.pincode
                  }
                  // style={{
                  //   clipPath:
                  //     " polygon(6.71% 0%, 86.4% 0%, 100% 0%, 100% 66.1%, 94.08% 100%, 9.8% 100%, 0% 100%, 0% 42.16%)",
                  // }}
                  onClick={() => handelVerification()}
                >
                  Checkout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* -----------------Payment Method--------------- */}
        {showPayment && (
          <PaymentMethodModal
            isOpen={showPayment}
            onClose={() => setShowPayment(false)}
            product={cart}
            shippingFee={shippingFee}
          />
        )}
      </div>
    </MainLayout>
  );
}
