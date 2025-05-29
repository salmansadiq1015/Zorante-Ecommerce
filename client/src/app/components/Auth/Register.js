"use client";
import { useAuth } from "@/app/content/authContent";
import { Style } from "@/app/utils/CommonStyle";
import { getCountries } from "@/app/utils/CountryData";
import { authUri } from "@/app/utils/ServerURI";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsGithub } from "react-icons/bs";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { LuEye, LuEyeOff, LuLoaderCircle } from "react-icons/lu";
import { MdAddPhotoAlternate } from "react-icons/md";
import { signIn, useSession } from "next-auth/react";

export default function Register({ setActive }) {
  const { setActivationToken, setAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [number, setNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [phoneCode, setPhoneCode] = useState("+1");
  const router = useRouter();
  const { data: sessionData } = useSession();

  useEffect(() => {
    setCountries(getCountries());
  }, []);

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("file", avatar);
      formData.append("number", number);
      const { data } = await axios.post(`${authUri}/register`, formData);

      if (data) {
        setActivationToken(data.activationToken);
        router.push("/email-verification");

        toast.success("Please check your email to activate your account");
        setName("");
        setEmail("");
        setPassword("");
        setAvatar(null);
        setNumber("");
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
          secure: true,
          sameSite: "Strict",
          path: "/",
        });
        router.push("/");
        toast.success(data.message || "Login Successfully!");
        setTimeout(() => {
          setAuthShow(false);
        }, 1000);
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
      <div className="w-full max-w-2xl flex flex-col gap-4 bg-gray-50 border border-gray-300 rounded-sm p-4 ">
        <div className="flex flex-col gap-3 items-center justify-center w-full">
          <span className={`${Style.span1} text-center`}>Sign Up</span>
          <h3 className={`${Style.h1} text-center`}>Join Us Today</h3>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
        >
          <div className="col-span-2 py-2 relative w-fit">
            <label
              htmlFor="avatar"
              className="relative rounded-full w-[4rem] h-[4rem] overflow-hidden cursor-pointer"
            >
              <Image
                src={avatar ? URL.createObjectURL(avatar) : "/profile.png"}
                alt="avatar"
                width={64}
                height={64}
                className="object-fill rounded-full w-[4rem] h-[4rem]  border-2 border-red-500"
              />
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <span className="absolute bottom-0 cursor-pointer right-0 z-10  text-[14px] bg-gray-300/70 backdrop-blur-sm p-1 rounded-full">
                <MdAddPhotoAlternate size={18} className="text-red-700" />
              </span>
            </label>
          </div>
          <div className=" w-full h-[2.8rem]">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className=" w-full h-full px-5  py-2  text-[15px] text-gray-900 bg-transparent border border-gray-400 rounded-sm focus:border-red-600 outline-none"
            />
          </div>

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
          <div className="w-full h-[2.8rem]">
            {/* State Dropdown */}
            <div className="flex items-center gap-1 w-full px-[1px] border border-gray-400 rounded-sm focus:border-red-600 ">
              <select
                value={phoneCode || "+1"}
                onChange={(e) => setPhoneCode(e.target.value)}
                className="bg-white text-black h-[2.5rem] border-none outline-none max-w-[4rem] px-1 "
                style={{
                  clipPath:
                    "polygon(100% 50%, 100% 97.00%, 0% 97.00%, 0% 43%, 34.96% 0%, 100% 0%)",
                }}
              >
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.phoneCode}>
                    {country.phoneCode}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Phone Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full h-[2.8rem] pl-2 pr-3 py-2 text-[15px] text-gray-900 bg-transparent border-none  outline-none"
                required
              />
            </div>
          </div>
          {/*  */}
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
          <div className=" relative w-full h-[2.8rem]">
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
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className=" w-full h-full px-5  py-2  text-[15px] text-gray-900 bg-transparent border border-gray-400 rounded-sm focus:border-red-600  outline-none"
            />
          </div>
          <div className=" col-span-2 flex items-center gap-2">
            <span className="text-gray-900 text-[14px]">
              Already have an account?
            </span>
            <button
              type="button"
              onClick={() => setActive("login")}
              className="text-red-500 cursor-pointer hover:text-red-600 transition-all duration-300 underline underline-offset-3 "
            >
              Login
            </button>
          </div>
          <div className="col-span-2 flex items-center justify-center w-full">
            <button
              className={`min-w-fit rounded px-10 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white py-[.7rem] mt-2  flex items-center justify-center gap-2 ${
                loading ? "animate-pulse cursor-not-allowed" : "cursor-pointer"
              } `}
              // style={{
              //   clipPath:
              //     "polygon(7.56% 0%, 86.4% 0%, 100% 0%, 100% 66.93%, 93.88% 100%, 9.8% 100%, 0% 100%, 0% 43.07%)",
              // }}
              disabled={loading}
            >
              Register with us{" "}
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
            Or Sign up with
          </span>
          <Separator className="h-px w-full bg-gray-300" />
          <div className="flex items-center justify-center gap-4 sm:gap-8 mt-3">
            <span
              onClick={() => signIn("google")}
              style={{
                clipPath:
                  " polygon(70.71% 100%, 100% 70.71%, 100% 29.29%, 70.71% 0%, 29.29% 0%, 0% 29.29%, 0% 70.71%, 29.29% 100%)",
              }}
              className="w-[4rem] h-[4rem] flex items-center justify-center bg-red-600/70 hover:bg-red-700/70 transition-all duration-300 cursor-pointer"
            >
              <FaGoogle size={25} color="white" />
            </span>
            <span
              onClick={() => signIn("facebook")}
              style={{
                clipPath:
                  " polygon(70.71% 100%, 100% 70.71%, 100% 29.29%, 70.71% 0%, 29.29% 0%, 0% 29.29%, 0% 70.71%, 29.29% 100%)",
              }}
              className="w-[4rem] h-[4rem] flex items-center justify-center bg-red-600/70 hover:bg-red-700/70 transition-all duration-300 cursor-pointer"
            >
              <FaFacebookF size={25} color="white" />
            </span>
            <span
              onClick={() => signIn("github")}
              style={{
                clipPath:
                  " polygon(70.71% 100%, 100% 70.71%, 100% 29.29%, 70.71% 0%, 29.29% 0%, 0% 29.29%, 0% 70.71%, 29.29% 100%)",
              }}
              className="w-[4rem] h-[4rem] rounded flex items-center justify-center bg-red-600/70 hover:bg-red-700/70 transition-all duration-300 cursor-pointer"
            >
              <BsGithub size={25} color="white" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
