"use client";
import React, { useState } from "react";
import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/content/authContent";
import { authUri } from "@/app/utils/ServerURI";
import toast from "react-hot-toast";
import axios from "axios";

const Footer = () => {
  const { auth } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${authUri}/subscription`, {
        email,
      });
      if (data) {
        setIsLoading(false);
        setEmail("");
        toast.success(
          "Thank you for subscribing!. We will send you a confirmation email."
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className=" bg-slate-100 border-t border-gray-200 ">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#c6080a] to-[#ac0205] flex items-center justify-center">
                <span className="text-white font-bold font-serif text-xl ">
                  Z
                </span>
              </div>
              <span className="ml-2 text-2xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#c6080a] to-[#ac0205]">
                Zorante
              </span>
            </div>
            <p className=" text-gray-800 text-sm mb-4">
              Your one-stop online marketplace for the latest fashion,
              electronics, home essentials, and more—secure shopping with fast
              delivery.
            </p>
            <div className="flex space-x-3">
              <Link
                href="#"
                className="dark:  text-gray-800 hover:text-red-600 transition-colors duration-200"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className=" text-gray-800 hover:text-red-600 transition-colors duration-200"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className=" text-gray-800 hover:text-red-600 transition-colors duration-200"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                href="#"
                className=" text-gray-800 hover:text-red-600 transition-colors duration-200"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                className=" text-gray-800 hover:text-red-600 transition-colors duration-200"
              >
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-black font-medium text-[17px] mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="top-sale"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  Top Sale
                </Link>
              </li>

              {/* <li>
                <a
                  href="blogs"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  Blog
                </a>
              </li> */}

              <li>
                <Link
                  href="/popular"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  Popular Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-black font-medium text-[17px] mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={
                    auth?.user
                      ? `/profile/${auth?.user?._id}?tab=chat`
                      : "/authentication"
                  }
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  Escrow & Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/account-security"
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  Account Security
                </Link>
              </li>
              <li>
                <Link
                  href={`/contact`}
                  className=" text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-black font-medium text-[17px] mb-4">
              Download Our App
            </h3>
            <div className="flex flex-col gap-4">
              <Link
                href="https://play.google.com/store/apps/details?id=com.solutionshub.app"
                className="text-white hover:text-gray-100 transition-colors duration-200 text-sm bg-black rounded-md px-4 py-3 flex  items-center gap-1 max-w-fit"
              >
                <Image
                  src="/playstore.svg"
                  alt="Google Play"
                  width={70}
                  height={70}
                  className="h-11 w-auto  rounded px-2"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] text-gray-100">
                    Android App on
                  </span>
                  <h3 className="text-white font-semibold text-[18px]">
                    Google Play
                  </h3>
                </div>
              </Link>
              <Link
                href="https://apps.apple.com/in/app/solutions-hub/id1605778691"
                className="text-white hover:text-gray-100 transition-colors duration-200 text-sm bg-black rounded-md px-4 py-3 flex items-center gap-1 max-w-fit"
              >
                <Image
                  src="/appstore.svg"
                  alt="Apple Store"
                  width={70}
                  height={70}
                  className="h-11 w-auto  rounded px-2"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] text-gray-100">
                    Download on the
                  </span>
                  <h3 className="text-white font-semibold text-[18px]">
                    App Store
                  </h3>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className=" text-gray-800 text-sm">
                © 2025 Zorante. All rights reserved.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <h3 className="text-black font-medium text-[17px]">
                    Newsletter
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get the latest updates and exclusive offers straight to your
                    inbox.
                  </p>
                </div>

                <form className="flex" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2 rounded-l bg-white border border-gray-400 focus:border-red-500  text-sm focus:outline-none focus:ring-2 focus:ring-red-600 min-w-[200px]"
                  />
                  <button
                    type={"submit"}
                    className="px-4 py-2 rounded-r bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors duration-200 flex items-center gap-1"
                  >
                    Subscribe{" "}
                    {isLoading && (
                      <Loader2 className="animate-spin text-white" size={18} />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center flex-col justify-center  space-x-4 gap-4">
            <div className="flex items-center justify-center gap-3">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                alt="Visa"
                width={80}
                height={50}
                className="h-8 bg-white rounded px-2"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                width={80}
                height={50}
                className="h-8 bg-white rounded px-2"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                width={80}
                height={50}
                className="h-8 bg-white rounded px-2"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg"
                alt="Bitcoin"
                width={50}
                height={50}
                className="h-8 bg-white rounded px-2"
              />
            </div>
            <div className="dark:bg-[#1E293B] w-fit bg-slate-300/80 px-3 py-1 rounded flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#06B6D4] mr-1"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
              <span className="text-xs dark:text-white text-black">
                Secure Escrow Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
