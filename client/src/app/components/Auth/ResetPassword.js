"use client";

import { Style } from "@/app/utils/CommonStyle";
import { authUri } from "@/app/utils/ServerURI";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LuLoaderCircle } from "react-icons/lu";

export default function ResetPassword({ setActive }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${authUri}/reset/password`, {
        email,
      });

      console.log(data);

      if (data) {
        // router.push(`/update-password`);
        toast.success("Reset password link sended to your provided email ");
        setEmail("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative z-10 p-0 sm:p-4">
      <div className="w-full max-w-xl flex flex-col gap-4 bg-gray-50 border border-gray-300 rounded-sm p-4 ">
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <span className={`${Style.span1} text-center font-medium`}>
            Forgot Password
          </span>
          <h3 className={`${Style.h1} text-center`}>
            Email your email address
          </h3>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full gap-4 sm:gap-5"
        >
          {/*  */}
          <div className=" w-full h-[2.8rem]">
            <input
              type="email"
              placeholder="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className=" w-full h-full px-5  py-2  text-[15px] text-gray-900 bg-transparent border border-gray-400 rounded-sm focus:border-red-600  outline-none"
            />
          </div>

          <div className="col-span-2 w-full flex items-center justify-between flex-wrap gap-4">
            <div className="  flex items-center gap-2">
              <span className="text-gray-900 text-[14px]">Back to Login?</span>
              <button
                type="button"
                onClick={() => router.push("/authentication")}
                className="text-red-500 cursor-pointer hover:text-red-600 transition-all duration-300 underline underline-offset-3 "
              >
                Login
              </button>
            </div>
          </div>
          <div className="col-span-2 flex items-center justify-center w-full">
            <button
              className={`min-w-fit rounded px-14 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white py-[.7rem] mt-2  flex items-center justify-center gap-2 ${
                loading ? "animate-pulse cursor-not-allowed" : "cursor-pointer"
              } `}
              // style={{
              //   clipPath:
              //     "polygon(7.56% 0%, 86.4% 0%, 100% 0%, 100% 66.93%, 93.88% 100%, 9.8% 100%, 0% 100%, 0% 43.07%)",
              // }}
              disabled={loading}
            >
              Confirm email
              {loading && (
                <LuLoaderCircle
                  className="animate-spin text-white "
                  size={18}
                />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
