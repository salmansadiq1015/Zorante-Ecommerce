import React from "react";
import { format } from "date-fns";
import Image from "next/image";

const OrderSlip = ({ orderDetail }) => {
  const subtotal = orderDetail?.products?.reduce((acc, product) => {
    const price = product?.product?.price || 0;
    const quantity = product?.quantity || 0;
    return acc + price * quantity;
  }, 0);

  return (
    <div id="slip-content" className="p-4 bg-gray-100 relative">
      {/* Header */}
      <div className="mb-3 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Order Slip</h1>
        <p className="text-sm text-gray-600">Order ID: #{orderDetail?._id}</p>
        <p className="text-sm text-gray-600">
          Date: {format(new Date(), "MMM dd, yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-8 gap-3">
        {/* Buyer Details */}
        <div className="col-span-2 mb-2 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">
            Buyer Details
          </h2>
          <p className="text-sm text-gray-600">
            <strong>Name:</strong> {orderDetail?.user?.name || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {orderDetail?.user?.email || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Contact:</strong> {orderDetail?.user?.number || "N/A"}
          </p>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Delivery Address:
            </h3>
            <p className="text-sm text-gray-600">
              {orderDetail?.user?.addressDetails?.address || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              {orderDetail?.user?.addressDetails?.city},{" "}
              {orderDetail?.user?.addressDetails?.state},{" "}
              {orderDetail?.user?.addressDetails?.country}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Pincode:</strong>{" "}
              {orderDetail?.user?.addressDetails?.pincode || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Tracking Number:</strong>{" "}
              {orderDetail?.trackingId || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Shipping Carrier:</strong>{" "}
              {orderDetail?.shippingCarrier || "N/A"}
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className=" col-span-4 mb-2 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            Products
          </h2>
          <div className="w-full sm:w-[90%] flex flex-col gap-3 min-w-[25rem] ">
            {/* Header */}
            <div className="w-full flex items-center justify-between ">
              <div className="w-full">
                <strong className="text-[15px] font-medium text-black">
                  Product
                </strong>
              </div>
              <div className="flex items-center justify-between w-full">
                <strong className="text-[15px] font-medium text-black">
                  QTY
                </strong>
                <strong className="text-[15px] font-medium text-black">
                  Price
                </strong>
                <strong className="text-[15px] font-medium text-black">
                  Size
                </strong>
                <strong className="text-[15px] font-medium text-black">
                  Color
                </strong>
              </div>
            </div>
            {/* Body */}
            {orderDetail?.products?.map((product) => (
              <div
                key={product._id}
                className="w-full flex items-center  justify-between gap-2 "
              >
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-1">
                  <div className="w-[3rem] h-[3rem] rounded-full">
                    <div className="w-[2.9rem] h-[2.9rem] relative rounded-md overflow-hidden flex items-center justify-center">
                      <Image
                        src={product?.product?.thumbnails[0]}
                        layout="fill"
                        alt={"Avatar"}
                        className="w-full h-full "
                      />
                    </div>
                  </div>
                  <p className="text-[13px] sm:text-[14px] text-start text-gray-700 font-medium">
                    {"Designer Silk Saree "}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[13px] sm:text-[14px] font-normal text-gray-600 ">
                    {product?.quantity}
                  </span>
                  <span className="text-[13px] sm:text-[14px] font-normal text-gray-600">
                    ${product?.product?.price}
                  </span>
                  {/* Sizes */}
                  <div className="text-[13px] sm:text-[14px] font-normal text-gray-600">
                    {product?.sizes?.length > 1 ? (
                      <details className="group">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                          Sizes
                        </summary>
                        <ul className="mt-1 pl-4 text-gray-500 group-open:block">
                          {product.sizes.map((size, index) => (
                            <li key={index} className="list-disc">
                              {size}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <span className="text-red-500 text-[13px]">
                        {product.sizes[0]} N/A
                      </span>
                    )}
                  </div>

                  {/* Colors */}
                  <div className="text-[13px] sm:text-[14px] font-normal text-gray-600">
                    {product.colors.length > 1 ? (
                      <details className="group">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                          Colors
                        </summary>
                        <div className="flex items-center flex-row gap-2 pl-4 group-open:block">
                          {product.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border mt-1 border-gray-300"
                              style={{ backgroundColor: color }}
                              title={color}
                            ></div>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <div
                        className="w-5 h-5  text-red-500 text-[13px]"
                        style={{
                          backgroundColor: product.colors[0]
                            ? product.colors[0]
                            : "#fff",
                        }}
                        title={product.colors[0]}
                      >
                        N/A
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* HR Line */}
            <hr className="w-full h-[2px] bg-gray-500 " />
            <div className="flex flex-col gap-2">
              {/* <div className="flex items-center justify-between">
                <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700">
                  Discount Coupon
                </strong>
                <span className="text-[13px] text-gray-600 font-normal">
                  29%
                </span>
              </div> */}
              {/*  */}
              <div className="flex items-center justify-between">
                <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700">
                  Shipping Charges
                </strong>
                <span className="text-[13px] text-gray-600 font-normal">
                  ${orderDetail?.shippingFee}
                </span>
              </div>

              {/*  */}
              <div className="flex items-center justify-between">
                <strong className="text-[13px] sm:text-[14px] font-medium text-gray-700">
                  Totol Price
                </strong>
                <span className="text-[13px] text-gray-600 font-normal">
                  ${orderDetail?.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Order Summary */}
        <div className=" col-span-2 mb-2 p-4   bg-white rounded shadow">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            Order Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping Charges</span>
              <span>${orderDetail?.shippingFee}</span>
            </div>
            {/* <div className="flex justify-between text-sm text-gray-600">
              <span>Discount</span>
              <span>${orderDetail?.discount}</span>
            </div> */}
            <hr className="w-full h-[2px] bg-gray-500 my-2" />
            <div className="flex justify-between text-sm text-gray-800 font-semibold">
              <span>Total</span>
              <span>${orderDetail?.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Thank you for shopping with us!</p>
        <p>If you have any questions, contact support@ayoob.com</p>
      </div>
    </div>
  );
};

export default OrderSlip;
