"use client";
import { format } from "date-fns";
import Image from "next/image";
import { Check, MapPin, Package, Truck } from "lucide-react";

const OrderSlip = ({ orderDetail, generatePDF }) => {
  const subtotal = orderDetail?.products?.reduce((acc, product) => {
    const price = product?.product?.price || 0;
    const quantity = product?.quantity || 0;
    return acc + price * quantity;
  }, 0);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // Get order status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="bg-white p-0 m-0 mt-4">
      <div
        id="slip-content"
        className="max-w-[1000px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      >
        {/* Header with logo and branding */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Order Receipt
              </h1>
              <p className="text-red-100 mt-1">Thank you for your purchase!</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-semibold">AYOOB</div>
              <div className="text-red-100 text-sm">Premium Fashion</div>
            </div>
          </div>
        </div>

        {/* Order information bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Order ID
                </div>
                <div className="font-mono text-sm font-medium">
                  #{orderDetail?._id?.slice(-8)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Date Placed
                </div>
                <div className="text-sm font-medium">
                  {orderDetail?.createdAt
                    ? format(new Date(orderDetail.createdAt), "MMM dd, yyyy")
                    : format(new Date(), "MMM dd, yyyy")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Payment Method
                </div>
                <div className="text-sm font-medium">
                  {orderDetail?.paymentMethod || "Credit Card"}
                </div>
              </div>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  orderDetail?.orderStatus
                )}`}
              >
                {orderDetail?.orderStatus || "Processing"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 p-6">
          {/* Customer Information */}
          <div className="md:col-span-1">
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-sm font-semibold text-gray-800">
                    Shipping Address
                  </h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {orderDetail?.user?.name || "N/A"}
                  </p>
                  <p>{orderDetail?.user?.addressDetails?.address || "N/A"}</p>
                  <p>
                    {orderDetail?.user?.addressDetails?.city}
                    {orderDetail?.user?.addressDetails?.state &&
                      `, ${orderDetail?.user?.addressDetails?.state}`}
                  </p>
                  <p>
                    {orderDetail?.user?.addressDetails?.country}{" "}
                    {orderDetail?.user?.addressDetails?.pincode}
                  </p>
                  <p className="pt-1">{orderDetail?.user?.number || "N/A"}</p>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <Truck className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-sm font-semibold text-gray-800">
                    Shipping Information
                  </h3>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Carrier:</span>
                    <span className="font-medium text-gray-900">
                      {orderDetail?.shippingCarrier || "Standard Shipping"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tracking ID:</span>
                    <span className="font-mono font-medium text-gray-900">
                      {orderDetail?.trackingId || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Delivery:</span>
                    <span className="font-medium text-gray-900">
                      {orderDetail?.estimatedDelivery ||
                        format(
                          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                          "MMM dd, yyyy"
                        )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <Package className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-sm font-semibold text-gray-800">
                    Order Summary
                  </h3>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{formatCurrency(orderDetail?.shippingFee || 0)}</span>
                  </div>
                  {orderDetail?.discount && (
                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(orderDetail?.discount || 0)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-lg text-red-700">
                      {formatCurrency(orderDetail?.totalAmount || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-800">
                  Order Items
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {orderDetail?.products?.map((product, index) => (
                  <div key={product._id || index} className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        <div className="relative w-full h-full">
                          <Image
                            src={
                              product?.product?.thumbnails?.[0] ||
                              "/placeholder.svg?height=64&width=64"
                            }
                            layout="fill"
                            objectFit="fill"
                            alt={product?.product?.name || "Product image"}
                          />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {product?.product?.name || "Designer Silk Saree"}
                            </h4>
                            <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2">
                              {product?.sizes?.[0] && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                                  Size: {product.sizes[0]}
                                </span>
                              )}
                              {product?.colors?.[0] && (
                                <span className="inline-flex items-center">
                                  <span className="mr-1">Color:</span>
                                  <span
                                    className="inline-block w-3 h-3 rounded-full border border-gray-300"
                                    style={{
                                      backgroundColor: product.colors[0],
                                    }}
                                  ></span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(product?.product?.price || 0)}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Qty: {product?.quantity || 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Order Timeline
              </h3>
              <div className="space-y-4">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order Placed
                    </p>
                    <p className="text-xs text-gray-500">
                      {orderDetail?.createdAt
                        ? format(
                            new Date(orderDetail.createdAt),
                            "MMM dd, yyyy • h:mm a"
                          )
                        : format(new Date(), "MMM dd, yyyy • h:mm a")}
                    </p>
                  </div>
                </div>

                {orderDetail?.orderStatus !== "Cancelled" && (
                  <>
                    <div className="relative pl-8">
                      <div
                        className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center
                        ${
                          orderDetail?.orderStatus === "Processing" ||
                          orderDetail?.orderStatus === "Shipped" ||
                          orderDetail?.orderStatus === "Delivered"
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {orderDetail?.orderStatus === "Processing" ||
                        orderDetail?.orderStatus === "Shipped" ||
                        orderDetail?.orderStatus === "Delivered" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            orderDetail?.orderStatus === "Processing" ||
                            orderDetail?.orderStatus === "Shipped" ||
                            orderDetail?.orderStatus === "Delivered"
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          Processing
                        </p>
                        {orderDetail?.orderStatus === "Processing" ||
                        orderDetail?.orderStatus === "Shipped" ||
                        orderDetail?.orderStatus === "Delivered" ? (
                          <p className="text-xs text-gray-500">
                            {format(new Date(), "MMM dd, yyyy • h:mm a")}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">Pending</p>
                        )}
                      </div>
                    </div>

                    <div className="relative pl-8">
                      <div
                        className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center
                        ${
                          orderDetail?.orderStatus === "Shipped" ||
                          orderDetail?.orderStatus === "Delivered"
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {orderDetail?.orderStatus === "Shipped" ||
                        orderDetail?.orderStatus === "Delivered" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            orderDetail?.orderStatus === "Shipped" ||
                            orderDetail?.orderStatus === "Delivered"
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          Shipped
                        </p>
                        {orderDetail?.orderStatus === "Shipped" ||
                        orderDetail?.orderStatus === "Delivered" ? (
                          <p className="text-xs text-gray-500">
                            {format(new Date(), "MMM dd, yyyy • h:mm a")}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">Pending</p>
                        )}
                      </div>
                    </div>

                    <div className="relative pl-8">
                      <div
                        className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center
                        ${
                          orderDetail?.orderStatus === "Delivered"
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {orderDetail?.orderStatus === "Delivered" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            orderDetail?.orderStatus === "Delivered"
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          Delivered
                        </p>
                        {orderDetail?.orderStatus === "Delivered" ? (
                          <p className="text-xs text-gray-500">
                            {format(new Date(), "MMM dd, yyyy • h:mm a")}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">Pending</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {orderDetail?.orderStatus === "Cancelled" && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600">
                        Order Cancelled
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(), "MMM dd, yyyy • h:mm a")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-3 mt-4 flex items-center justify-center w-full">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-xs text-gray-500">
                Questions about your order? Contact us at{" "}
                <span className="text-red-600">support@ayoob.com</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Return policy: Items can be returned within 30 days of delivery
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className=""></div>
            <div>
              <button
                onClick={generatePDF}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Receipt
              </button>
            </div>
          </div>
        </div>

        {/* QR Code and Barcode */}
        {/* <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-100 border border-gray-200 flex items-center justify-center mb-2">
            <div className="text-xs text-gray-400">QR Code</div>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {orderDetail?._id || "ORDER-12345-67890"}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default OrderSlip;
