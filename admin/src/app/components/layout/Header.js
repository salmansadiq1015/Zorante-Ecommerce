"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import Image from "next/image";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { useAuth } from "@/app/context/authContext";
import { redirect } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { MdArrowRightAlt } from "react-icons/md";

export default function Header() {
  const { auth, setAuth } = useAuth();
  const user = auth.user;
  const [open, setOpen] = useState(false);
  const [notificationData, setNotificationData] = useState(false);
  const [show, setShow] = useState(false);
  const headerNotification = useRef(null);

  // Close Menu to click any where
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerNotification.current &&
        !headerNotification.current.contains(event.target)
      ) {
        setOpen(false);
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handle Logout
  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    redirect("/");
  };

  // Get all notifications

  const fetchNotifications = async () => {
    if (!auth.user) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/header/admin/${auth.user._id}`
      );
      setNotificationData(data.notifications);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // eslint-disable-next-line
  }, [auth]);

  // ----------Mark Single Notification as Read----
  const markSingleNotificationAsRead = async (id) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/read/${id}`
      );
      fetchNotifications();
    } catch (error) {
      console.log(error);
      toast.error("Failed to mark as read");
    }
  };

  return (
    <div className="w-full h-[3.8rem] bg-white border-b text-black">
      <div className="w-full h-full flex items-center justify-between px-2 sm:px-6 py-2">
        <div className=""></div>
        {/* end */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            {/* --------Notifications------ */}
            <div className="relative">
              <div
                className="relative cursor-pointer m-2 bg-gray-100 hover:bg-gray-200 transition-all duration-200 rounded-full hover:shadow p-1"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <FaRegBell className="text-xl container text-black " />
                {notificationData?.length > 0 ? (
                  <div className="absolute -top-[0.4rem] -right-2 bg-red-600 rounded-full w-[18px] h-[18px] text-[12px] text-white flex items-center justify-center">
                    <span className="text-[12px]">
                      {notificationData?.length}
                    </span>
                  </div>
                ) : (
                  <div className="absolute top-0 right-[1px] bg-red-600 rounded-full w-[7px] h-[7px] text-[12px] text-white flex items-center justify-center">
                    {/* Optionally display an empty notification dot */}
                  </div>
                )}
              </div>
              {open && (
                <div
                  ref={headerNotification}
                  className="shadow-xl  bg-gray-100 absolute z-[999] top-[2.5rem] sm:top-[2rem] right-[-15rem] sm:right-[1.6rem] rounded-md overflow-hidden"
                >
                  <h5 className="text-[20px] text-center font-medium text-white bg-red-600  p-3 font-Poppins">
                    Notifications
                  </h5>
                  <div className=" w-[300px] sm:w-[350px] min-h-[40vh] max-h-[60vh] flex flex-col gap-1   overflow-y-auto   ">
                    {notificationData &&
                      notificationData?.map((item, index) => (
                        <div
                          key={index}
                          className=" bg-[#00000013] hover:bg-gray-300 transition-all duration-200 font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#fff]"
                        >
                          <div className="w-full flex items-center justify-between p-2">
                            <p className="text-black ">{item?.subject}</p>
                            <p
                              className="text-sky-500 hover:text-sky-600 text-[14px] transition-all duration-200  cursor-pointer"
                              onClick={() =>
                                markSingleNotificationAsRead(item?._id)
                              }
                            >
                              Mark as read
                            </p>
                          </div>
                          <div
                            onClick={() => redirect(item?.redirectLink)}
                            key={item?._id}
                            className="cursor-pointer"
                          >
                            <p className="p-2 text-gray-700  text-[14px]">
                              {item?.context}
                            </p>
                            <span className="p-2 text-gray-700  text-[12px] ">
                              {format(new Date(item?.createdAt), "dd-MMM-yyyy")}
                            </span>
                          </div>
                        </div>
                      ))}

                    {notificationData.length === 0 && (
                      <div className="w-full h-[30vh] text-black  flex items-center justify-center flex-col gap-2">
                        <span className="text-[19px]">🤯</span>
                        Notifications not available!.
                      </div>
                    )}
                  </div>
                  <div className="w-full  cursor-pointer bg-white    px-2 flex  items-center justify-end">
                    <button
                      className={`text-[14px] flex items-center gap-1 py-2 cursor-pointer text-red-500 hover:text-red-600 disabled:cursor-not-allowed  ${
                        notificationData.length === 0 && "cursor-not-allowed"
                      }`}
                      onClick={() => redirect("/dashboard/notifications")}
                    >
                      See All <MdArrowRightAlt className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* ----------Profile Image-------- */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className=" w-[2.2rem] sm:w-[2.6rem] h-[2.2rem] sm:h-[2.6rem] cursor-pointer relative rounded-full bg-sky-600 overflow-hidden flex items-center justify-center text-white border-2 border-orange-600">
                {user?.avatar ? (
                  <Image
                    src={user?.avatar ? user?.avatar : "/profile.png"}
                    layout="fill"
                    alt={"Avatar"}
                    className="w-full h-full"
                  />
                ) : (
                  <h3 className="text-[20px] font-medium uppercase">
                    {user?.name ? user?.name?.slice(0, 1) : ""}
                  </h3>
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="text-[13px] sm:text-[14px] font-medium text-gray-900">
                  {user?.name ? user?.name : ""}
                </h3>
                <span className=" text-[11px] sm:text-[12px] font-normal text-gray-600">
                  {user?.email ? user?.email : ""}
                </span>
              </div>
              <span
                onClick={() => setShow(!show)}
                className="p-1 rounded-full cursor-pointer hover:bg-gray-200 bg-gray-50 hover:shadow-md text-black hover:text-red-600 transition-all duration-200"
              >
                {show ? (
                  <FaAngleUp className="text-[18px] sm:text-[20px]" />
                ) : (
                  <FaAngleDown className="text-[18px] sm:text-[20px]" />
                )}
              </span>
            </div>
            {/* Model */}
            {show && (
              <div
                ref={headerNotification}
                className="absolute w-[14rem] top-[2.6rem] right-[1.3rem] z-[999] py-2 px-1 rounded-md rounded-tr-none shadow-sm bg-white border"
              >
                <ul className="flex flex-col gap-2 w-full transition-all duration-200">
                  <span
                    onClick={handleLogout}
                    className="font-medium text-[16px]  w-full hover:bg-red-200 hover:text-red-600 hover:shadow-md rounded-sm transition-all duration-200 cursor-pointer py-[.3rem] px-2"
                  >
                    Logout
                  </span>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
