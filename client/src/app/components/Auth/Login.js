"use client";
import { useAuth } from "@/app/content/authContent";
import { Style } from "@/app/utils/CommonStyle";
import { authUri } from "@/app/utils/ServerURI";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsGithub } from "react-icons/bs";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { LuEye, LuEyeOff, LuLoaderCircle } from "react-icons/lu";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function Login({ setActive }) {
  const { auth, setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: sessionData } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${authUri}/login`, {
        email,
        password,
      });

      console.log(data);

      if (data) {
        setAuth({ ...auth, user: data.user, token: data.token });
        localStorage.setItem("@ayoob", JSON.stringify({ user: data.user }));
        Cookies.set("@ayoob", data.token, {
          expires: 1,
          secure: window?.location?.protocol === "https:",
          sameSite: "Strict",
          path: "/",
        });
        router.push("/");
        toast.success("Login successfully!");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------Login with social media accounts----------------------
  const handleSocialAuth = async () => {
    if (!sessionData) return;

    try {
      const { data } = await axios.post(`${authUri}/socialAuth`, {
        email: sessionData.user.email,
        name: sessionData.user.name,
        avatar: sessionData.user.image,
      });

      if (data) {
        setAuth({ ...auth, user: data.user, token: data.token });
        localStorage.setItem("@ayoob", JSON.stringify({ user: data.user }));
        Cookies.set("@ayoob", data.token, {
          expires: 1,
          secure: window?.location?.protocol === "https:",
          sameSite: "Strict",
          path: "/",
        });
        router.push("/");
        toast.success(data.message || "Login Successfully!");
        // setTimeout(() => {
        //   setAuthShow(false);
        // }, 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Social login failed.");
    }
  };

  useEffect(() => {
    if (sessionData && !localStorage.getItem("@ayoob")) {
      handleSocialAuth();
    }
    // eslint-disable-next-line
  }, [sessionData]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative z-10 p-0 sm:p-4">
      <div className="w-full max-w-xl flex flex-col gap-4 bg-gray-50 border border-gray-300 rounded-sm p-4 ">
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <span className={`${Style.span1} text-center font-medium`}>
            Sign In
          </span>
          <h3 className={`${Style.h1} text-center`}>Welcome Back</h3>
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

          <div className=" w-full h-[2.8rem] relative">
            <span
              className="absolute top-[.7rem] right-3 text-gray-800 text-[14px] cursor-pointer "
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <LuEyeOff size={24} color="black" />
              ) : (
                <LuEye size={24} color="black" />
              )}
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className=" w-full h-full px-5  py-2  text-[15px] text-gray-900 bg-transparent border border-gray-400 rounded-sm focus:border-red-600  outline-none"
            />
          </div>

          <div className="col-span-2 w-full flex items-center justify-between flex-wrap gap-4">
            <div className="  flex items-center gap-2">
              <span className="text-gray-900 text-[14px]">
                Don&apos;t have an account?
              </span>
              <button
                type="button"
                onClick={() => setActive("register")}
                className="text-red-500 cursor-pointer hover:text-red-600 transition-all duration-300 underline underline-offset-3 "
              >
                Register
              </button>
            </div>
            <button
              type="button"
              onClick={() => setActive("resetPassword")}
              className="text-red-500 cursor-pointer hover:text-red-600 transition-all duration-300 underline underline-offset-3 "
            >
              Forgot Password?
            </button>
          </div>
          <div className="col-span-2 flex items-center justify-center w-full">
            <button
              className={`min-w-fit  rounded px-14 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white py-[.7rem] mt-2  flex items-center justify-center gap-2 ${
                loading ? "animate-pulse cursor-not-allowed" : "cursor-pointer"
              } `}
              // style={{
              //   clipPath:
              //     "polygon(7.56% 0%, 86.4% 0%, 100% 0%, 100% 66.93%, 93.88% 100%, 9.8% 100%, 0% 100%, 0% 43.07%)",
              // }}
              disabled={loading}
            >
              Login{" "}
              {loading && (
                <LuLoaderCircle
                  className="animate-spin text-white "
                  size={18}
                />
              )}
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center w-full flex-col gap-4 py-6">
          <span className="text-gray-900 text-[16px] font-medium text-center">
            Or Sign in with
          </span>
          <Separator className="h-px w-full bg-gray-300" />
          <div className="flex items-center justify-center gap-4 sm:gap-8 mt-3">
            <span
              onClick={() => signIn("google")}
              style={{
                clipPath:
                  " polygon(70.71% 100%, 100% 70.71%, 100% 29.29%, 70.71% 0%, 29.29% 0%, 0% 29.29%, 0% 70.71%, 29.29% 100%)",
              }}
              className="w-[4rem] h-[4rem] flex items-center justify-center bg-red-400 hover:bg-red-700 transition-all duration-300 cursor-pointer"
            >
              <FaGoogle size={25} color="white" />
            </span>
            <span
              onClick={() => signIn("facebook")}
              style={{
                clipPath:
                  " polygon(70.71% 100%, 100% 70.71%, 100% 29.29%, 70.71% 0%, 29.29% 0%, 0% 29.29%, 0% 70.71%, 29.29% 100%)",
              }}
              className="w-[4rem] h-[4rem] flex items-center justify-center bg-red-400 hover:bg-red-700 transition-all duration-300 cursor-pointer"
            >
              <FaFacebookF size={25} color="white" />
            </span>
            <span
              onClick={() => signIn("github")}
              style={{
                clipPath:
                  " polygon(70.71% 100%, 100% 70.71%, 100% 29.29%, 70.71% 0%, 29.29% 0%, 0% 29.29%, 0% 70.71%, 29.29% 100%)",
              }}
              className="w-[4rem] h-[4rem] flex items-center  justify-center bg-red-400 hover:bg-red-700 transition-all duration-300 cursor-pointer"
            >
              <BsGithub size={25} color="white" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
