"use client";
import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineAttachEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { BiLoaderCircle } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";

export default function Login({ setActive }) {
  const { auth, setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // Redirect if the user is already logged in
  useEffect(() => {
    if (auth?.token) {
      router.push("/dashboard");
    }

    // eslint-disable-next-line
  }, [auth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/login`,
        { email, password, rememberMe }
      );
      if (data) {
        router.push("/dashboard");
        setAuth({ ...auth, user: data?.user, token: data?.token });
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success(data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error?.response?.data?.message);
      if (
        error?.response?.data?.message === "User not found. Please login again."
      ) {
        setAuth({ user: null, token: "" });
        localStorage.removeItem("auth");
        router.push("/login");
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-4 px-4 bg-white">
      <div className="w-[30rem] py-4 px-2 sm:px-4 bg-gray-100 shadow-md  rounded-md">
        <form onSubmit={handleLogin} className="">
          <div className="flex items-center justify-center text-black flex-col gap-2 w-full">
            {/* <Image src="/Ayboo.png" alt="Ayoob" width={70} height={70} /> */}

            <h2 className=" text-2xl sm:text-3xl font-semibold text-center text-black">
              Welcome to <span className="tgradient">Zorante</span>
            </h2>
            <div className="flex flex-col gap-4 w-full mt-4 ">
              <div className="relative w-full">
                <MdOutlineAttachEmail className="absolute top-[.7rem] left-2 h-5 w-5  z-10  " />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${Style.input} text-black pl-8`}
                />
              </div>

              <div className="relative w-full">
                <span
                  className="absolute top-[.5rem] right-2   z-10  cursor-pointer "
                  onClick={() => setShow(!show)}
                >
                  {!show ? (
                    <IoMdEyeOff className="h-6 w-6 text-black" />
                  ) : (
                    <IoEye className="h-6 w-6 text-black" />
                  )}
                </span>

                <TbPasswordUser className="absolute top-[.7rem] left-2 h-5 w-5 z-10 " />

                <input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  minLength={8}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${Style.input} text-black pl-8`}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[14px] text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 border rounded-sm bg-white  accent-red-600 cursor-pointer relative  "
                  />
                  Remember me
                </span>

                {/* <span
                  onClick={() => setActive("resetPassword")}
                  className="text-[14px] text-red-600 hover:text-red-700 cursor-pointer"
                >
                  Forgot Password
                </span> */}
              </div>
              {/* Button */}
              <div className="flex items-center justify-center w-full py-4 px-2 sm:px-[2rem]">
                <button type="submit" className={`${Style.button1}`}>
                  {loading ? (
                    <BiLoaderCircle className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
