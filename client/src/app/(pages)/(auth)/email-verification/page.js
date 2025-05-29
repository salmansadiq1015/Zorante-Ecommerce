"use client";
import MainLayout from "@/app/components/Layout/Layout";
import { useAuth } from "@/app/content/authContent";
import { Style } from "@/app/utils/CommonStyle";
import { authUri } from "@/app/utils/ServerURI";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

import { LuLoaderCircle } from "react-icons/lu";

export default function Verification() {
  const { activationToken, setActivationToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [invalidError, setInvalidError] = useState(false);
  const router = useRouter();

  const [varifyNumber, setVarifyNumber] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  // Varification

  const handleInputChange = (index, value) => {
    setInvalidError(false);
    const newVarifyNumber = { ...varifyNumber, [index]: value };
    setVarifyNumber(newVarifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  //   Handle Varifiation
  const varificationHandler = async () => {
    const verificationNumber = Object.values(varifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${authUri}/email/verification`, {
        activation_code: verificationNumber,
        activation_token: activationToken,
      });
      if (data) {
        console.log(data);
        toast.success(data?.message);
        router.push("/authentication");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setActivationToken("");
    }
  };

  return (
    <MainLayout title="Zorante - Email Verification">
      <div className="w-full min-h-screen flex items-center justify-center relative z-10 p-0 sm:p-4">
        <div className="w-full max-w-2xl flex flex-col gap-4 bg-gray-50 border border-gray-300 rounded-sm p-4 ">
          <div className="flex flex-col gap-3 items-center justify-center w-full">
            <span className={`${Style.span1} text-center`}>Verification</span>
            <h3 className={`${Style.h1} text-center`}> Verify Your Account</h3>
          </div>
          <div className="mt-2 w-full flex flex-col gap-4">
            <br />
            <div className=" m-auto flex items-center justify-center gap-5">
              {Object.keys(varifyNumber).map((key, index) => (
                <input
                  type="number"
                  key={key}
                  ref={inputRefs[index]}
                  className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-md flex items-center  justify-center text-[18px]  font-Poppins outline-none text-center ${
                    invalidError ? " shake border-red-600" : "border-gray-800"
                  }`}
                  maxLength={1}
                  value={varifyNumber[key]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              ))}
            </div>
            <br />

            <div className="flex items-center justify-center w-full">
              <button
                className={`min-w-fit rounded px-10 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white py-[.7rem] mt-2  flex items-center justify-center gap-2 ${
                  loading
                    ? "animate-pulse cursor-not-allowed"
                    : "cursor-pointer"
                } `}
                // style={{
                //   clipPath:
                //     "polygon(7.56% 0%, 86.4% 0%, 100% 0%, 100% 66.93%, 93.88% 100%, 9.8% 100%, 0% 100%, 0% 43.07%)",
                // }}
                disabled={loading}
                onClick={varificationHandler}
              >
                Verify OTP
                {loading && (
                  <LuLoaderCircle
                    className="animate-spin text-white "
                    size={18}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
