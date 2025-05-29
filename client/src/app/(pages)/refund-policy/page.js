"use client";
import MainLayout from "@/app/components/Layout/Layout";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeftRight,
  Clock,
  Package,
  CreditCard,
  CheckCircle,
} from "lucide-react";

export default function RefundPolicy() {
  return (
    <MainLayout title="Refund Policy - Zorante">
      <div className="min-h-screen bg-gray-50 z-10 relative">
        <div className="container mx-auto py-12 px-4 md:px-6">
          {/* Last Updated */}
          <div className="mb-8 text-right">
            <p className="text-gray-500">Last Updated: April 14, 2025</p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <AlertCircle className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Introduction</h2>
                  <p className="text-gray-700 mb-4">
                    At Zorante store, we want you to be completely satisfied
                    with your purchase. If you&apos;re not entirely happy with
                    your order, we&apos;re here to help. This refund policy
                    outlines our guidelines for returns, exchanges, and refunds.
                  </p>
                  <p className="text-gray-700">
                    Please read this policy carefully before making a purchase.
                    By placing an order with us, you agree to the terms of this
                    refund policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Eligibility */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <CheckCircle className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Return Eligibility</h2>
                  <p className="text-gray-700 mb-4">
                    To be eligible for a return, please make sure that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                    <li>The item was purchased within the last 30 days</li>
                    <li>The item is in its original packaging</li>
                    <li>
                      The item is unused, unworn, and in the same condition that
                      you received it
                    </li>
                    <li>You have the receipt or proof of purchase</li>
                  </ul>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-yellow-800">
                      <span className="font-bold">Please Note:</span> Certain
                      items are non-returnable for hygiene reasons, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-yellow-800 mt-2">
                      <li>Intimate apparel</li>
                      <li>Personal care products</li>
                      <li>Earrings and body jewelry</li>
                      <li>Opened beauty products</li>
                    </ul>
                  </div>
                  <p className="text-gray-700">
                    Sale items may be final sale and not eligible for return, as
                    specified at the time of purchase.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <ArrowLeftRight className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Return Process</h2>
                  <p className="text-gray-700 mb-4">
                    To initiate a return, please follow these steps:
                  </p>
                  <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-4">
                    <li>
                      <span className="font-medium">
                        Contact Customer Service:
                      </span>{" "}
                      Email us at returns@zorantestore.com or call us at +1
                      (555) 123-4567 to request a return authorization.
                    </li>
                    <li>
                      <span className="font-medium">
                        Receive Return Authorization:
                      </span>{" "}
                      Once your return request is approved, we will provide you
                      with a Return Merchandise Authorization (RMA) number and
                      return instructions.
                    </li>
                    <li>
                      <span className="font-medium">Package Your Return:</span>{" "}
                      Pack the item securely in its original packaging along
                      with all accessories, manuals, and free gifts that came
                      with it.
                    </li>
                    <li>
                      <span className="font-medium">Include Return Form:</span>{" "}
                      Include the return form with your RMA number inside the
                      package.
                    </li>
                    <li>
                      <span className="font-medium">Ship Your Return:</span>{" "}
                      Send your return to the address provided in the return
                      instructions. We recommend using a trackable shipping
                      method.
                    </li>
                  </ol>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <p className="text-blue-800">
                      <span className="font-bold">Tip:</span> Take photos of the
                      item before shipping it back to us, in case the package
                      gets damaged during transit.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Process */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <CreditCard className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Refund Process</h2>
                  <p className="text-gray-700 mb-4">
                    Once we receive and inspect your return, we will notify you
                    about the status of your refund:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                    <li>
                      <span className="font-medium">Approved Refunds:</span> If
                      your return is approved, we will initiate a refund to your
                      original payment method. The time it takes for the refund
                      to appear in your account depends on your payment
                      provider&apos;s processing time, typically 5-10 business
                      days.
                    </li>
                    <li>
                      <span className="font-medium">Store Credit:</span> In some
                      cases, we may offer store credit instead of a refund to
                      your original payment method.
                    </li>
                    <li>
                      <span className="font-medium">Rejected Returns:</span> If
                      your return doesn&apos;t meet our eligibility criteria, we
                      may reject it and send the item back to you.
                    </li>
                  </ul>
                  <p className="text-gray-700 mb-4">
                    Refunds include the price of the product and any applicable
                    taxes. Shipping costs are non-refundable unless the return
                    is due to our error (e.g., you received an incorrect or
                    defective item).
                  </p>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <p className="text-green-800">
                      <span className="font-bold">Good to Know:</span> You can
                      check the status of your refund by logging into your
                      account or contacting our customer service team.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchanges */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Package className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Exchanges</h2>
                  <p className="text-gray-700 mb-4">
                    If you&apos;d like to exchange an item for a different size,
                    color, or product, please follow these steps:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                    <li>Initiate a return using the process described above</li>
                    <li>Place a new order for the item you want instead</li>
                  </ol>
                  <p className="text-gray-700">
                    This approach ensures you get the item you want as quickly
                    as possible, rather than waiting for the exchange process to
                    complete. If you have any questions about exchanges, please
                    contact our customer service team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Late or Missing Refunds */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Clock className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    Late or Missing Refunds
                  </h2>
                  <p className="text-gray-700 mb-4">
                    If you haven&apos;t received your refund within the expected
                    timeframe:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                    <li>
                      Check your bank account or credit card statement again
                    </li>
                    <li>
                      Contact your bank or credit card company, as it may take
                      some time for the refund to be officially posted
                    </li>
                    <li>
                      Contact our customer service team if the above steps
                      don&apos;t resolve the issue
                    </li>
                  </ol>
                  <p className="text-gray-700">
                    If you&apos;ve done all of this and still haven&apos;t
                    received your refund, please contact us at
                    refunds@zorantestore.com with your order number and refund
                    details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Damaged or Defective Items */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-3">
                Damaged or Defective Items
              </h2>
              <p className="text-gray-700 mb-4">
                If you receive a damaged or defective item, please contact us
                immediately at support@zorantestore.com with photos of the
                damaged item and packaging. We&apos;ll work with you to resolve
                the issue promptly, either by sending a replacement or issuing a
                full refund including shipping costs.
              </p>
              <p className="text-gray-700">
                For items damaged during shipping, we may need you to provide
                additional information to help us file a claim with the shipping
                carrier.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-3">
                Questions About Our Refund Policy?
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about returns, exchanges, or refunds,
                please contact our customer service team:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">
                  Zorante E-commerce Customer Service
                </p>
                <p>Email: support@zorantestore.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Hours: Monday-Friday, 9am-6pm EST</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      )
    </MainLayout>
  );
}
