"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdModeEditOutline, MdNotInterested } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import axios from "axios";
import NotificationDetail from "@/app/components/Notification/NotificationDetail";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loader from "@/app/utils/Loader";
const MainLayout = dynamic(
  () => import("./../../../components/layout/MainLayout"),
  {
    ssr: false,
  }
);
const Breadcrumb = dynamic(() => import("./../../../utils/Breadcrumb"), {
  ssr: false,
});
const NotificationModal = dynamic(
  () => import("./../../../components/Notification/NotificationModal"),
  {
    ssr: false,
  }
);

export default function Notifications() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationData, setNotificationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedNotificationId, setSelectedNotificationId] = useState([]);
  const [show, setShow] = useState(false);
  const [notificationId, setNotificationId] = useState("");
  const closeMenu = useRef(null);
  const [addNotification, setAddNotification] = useState(false);
  const initialNotificationLoad = useRef(true);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  console.log("Notification Id", selectedNotificationId);

  // Fetch Page Link
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);

  // Get all notifications

  const fetchNotifications = async () => {
    if (initialNotificationLoad.current) {
      setLoading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/all/admin`
      );
      setNotificationData(data.notifications);
    } catch (error) {
      console.log(error);
    } finally {
      if (initialNotificationLoad.current) {
        setLoading(false);
        initialNotificationLoad.current = false;
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFilteredData(notificationData);
  }, [notificationData]);

  // -----------Mark All as Read----------------
  const markAllAsRead = async () => {
    if (!selectedNotificationId.length) {
      return toast.error("Please select a notification to mark as read");
    }
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/mark/all/read`,
        { nitificationIds: selectedNotificationId }
      );
      if (data) {
        fetchNotifications();
        setSelectedNotificationId([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to mark all as read");
    }
  };

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

  // -----------Delete All Notifications------------
  const handleDeleteConfirmation = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAllNotifications();
        Swal.fire("Deleted!", "Notifications has been deleted.", "success");
      }
    });
  };

  const deleteAllNotifications = async () => {
    if (!selectedNotificationId.length) {
      return toast.error("Please select at least one notification to delete.");
    }

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/delete/many`,
        { notificationIds: selectedNotificationId }
      );

      if (data) {
        fetchNotifications();
        toast.success("All selected notifications deleted successfully.");
        setSelectedNotificationId([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete notifications. Please try again later.");
    }
  };

  // -----------Delete Single Notification------------
  const handleDeleteSingleConfirmation = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSingleNotifications(id);
        Swal.fire("Deleted!", "Notification has been deleted.", "success");
      }
    });
  };

  const deleteSingleNotifications = async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/delete/${id}`
      );
      fetchNotifications();
      toast.success("Notification deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete notification. Please try again later");
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    let filtered = notificationData;
    if (!value) {
      setFilteredData(notificationData);
      return;
    }

    if (value) {
      const lowercasedSearch = value.toLowerCase();
      filtered = filtered.filter((category) => {
        const { name = "" } = category;

        return name.toLowerCase().includes(lowercasedSearch);
      });
    }

    setFilteredData(filtered);
  };

  // Handle selecting all notifications
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedNotificationId(notificationData?.map((notify) => notify?._id));
    } else {
      setSelectedNotificationId([]);
    }
  };

  // Handle selecting a single notification
  const handleSelectSingle = (id, checked) => {
    if (checked) {
      setSelectedNotificationId((prev) => [...prev, id]);
    } else {
      setSelectedNotificationId((prev) =>
        prev.filter((notifyId) => notifyId !== id)
      );
    }
  };

  // Close Menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeMenu.current && !closeMenu.current.contains(event.target)) {
        setNotificationId("");
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <MainLayout title="Notifications - Ayoob Admin">
      <div className="p-1 sm:p-2 px-1 sm:px-6 h-[100%] w-full pb-4 scroll-smooth">
        <div className="flex flex-col pb-2 h-full">
          <Breadcrumb path={currentUrl} />
          <div className="flex flex-col gap-4 mt-4  w-full h-full">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-2xl font-sans font-semibold text-black">
                Notifications
              </h1>
              <div className="flex items-center gap-3 sm:gap-4 justify-end w-full sm:w-fit ">
                <button
                  onClick={() => markAllAsRead()}
                  className=" hidden sm:flex text-[12px] sm:text-[14px] py-2 px-2 sm:px-4 text-gray-600 hover:text-gray-800 border-b-2 hover:border-2 hover:rounded-md hover:shadow-md hover:scale-[1.03] border-gray-600 transition-all duration-300 "
                >
                  Mark all as read
                </button>
                <button
                  onClick={() => handleDeleteConfirmation()}
                  className="text-[12px] sm:text-[14px] py-2 px-2 sm:px-4 text-gray-600 hover:text-gray-800 border-b-2  hover:border-2 hover:rounded-md hover:shadow-md hover:scale-[1.03] border-gray-600 transition-all duration-300 "
                >
                  Delete All
                </button>
                <button
                  onClick={() => setAddNotification(true)}
                  className={`flex text-[12px] sm:text-[14px] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] px-2 sm:px-4`}
                >
                  CREATE NOTIFICATION
                </button>
              </div>
            </div>
            {/*  */}
            <div className=" relative overflow-hidden w-full h-[86%] py-3 sm:py-4 bg-white rounded-md shadow  px-2 sm:px-4 mt-4  overflow-y-auto shidden ">
              <div className="flex flex-col gap-4 w-full h-full">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-red-600 cursor-pointer"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={
                        selectedNotificationId.length ===
                        notificationData.length
                      }
                    />
                    <span className="text-[16px] font-medium text-gray-900">
                      Select All
                    </span>
                  </div>
                  <button
                    onClick={() => markAllAsRead()}
                    className="flex sm:hidden  text-[12px] sm:text-[14px] py-2 px-2 sm:px-4 text-gray-600 hover:text-red-600  border-b-2 border-gray-600 hover:border-red-600  hover:scale-[1.03]  transition-all duration-300 "
                  >
                    Mark all as read
                  </button>
                </div>
                {/* Data */}
                {!loading ? (
                  <div className="flex flex-col gap-4 w-full h-full ">
                    {notificationData &&
                      notificationData?.map((notify) => (
                        <div
                          className="w-full flex items-start gap-4"
                          key={notify?._id}
                        >
                          <input
                            type="checkbox"
                            className="h-5 w-5 accent-red-600 cursor-pointer"
                            onChange={(e) =>
                              handleSelectSingle(notify._id, e.target.checked)
                            }
                            checked={selectedNotificationId?.includes(
                              notify._id
                            )}
                          />
                          <div className=" relative flex items-start  gap-2 rounded-lg border border-gray-300 hover:shadow-md cursor-pointer bg-gray-50 hover:100 p-3 w-full ">
                            <div
                              onClick={() => {
                                setSelectedNotification(notify);
                                setShowNotification(true);
                              }}
                              className="w-[3.2rem] h-[3.2rem] rounded-full"
                            >
                              <div className="w-[3rem] h-[3rem] relative rounded-full overflow-hidden flex items-center justify-center">
                                <Image
                                  src={notify?.user?.avatar || "/profile.png"}
                                  layout="fill"
                                  alt={"Avatar"}
                                  className="w-full h-full "
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                              <div className="w-full relative flex items-center justify-between">
                                <h3
                                  onClick={() => {
                                    setSelectedNotification(notify);
                                    setShowNotification(true);
                                  }}
                                  className="text-[15px] text-gray-900 font-medium w-full"
                                >
                                  {notify?.user?.name}
                                </h3>
                                <span
                                  onClick={() => {
                                    setNotificationId(notify._id);
                                    setShow(!show);
                                  }}
                                  className="bg-gray-100 hover:bg-red-200 p-1 rounded-full hover:shadow-md text-black hover:text-red-600 transition-all duration-200 cursor-pointer"
                                >
                                  <BsThreeDotsVertical className="text-[20px]" />
                                </span>
                                {show && notify?._id === notificationId && (
                                  <div
                                    ref={closeMenu}
                                    className="absolute top-6 right-6 w-[11rem] border bg-gray-50 border-gray-200 z-20 px-2 py-2 rounded-sm flex flex-col gap-2 "
                                  >
                                    {/* <button
                                    onClick={() => {
                                      setNotificationId(notify?._id);
                                      setAddNotification(true);
                                    }}
                                    className="w-full text-[13px] text-gray-600 flex items-center gap-1 bg-gray-100 hover:bg-yellow-100 transition-all duration-200 rounded-sm p-1"
                                  >
                                    <span className="p-1 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-300 hover:scale-[1.03]">
                                      <MdModeEditOutline className="text-[16px] text-white" />
                                    </span>
                                    <div className="flex flex-col items-start w-full ">
                                      <span className="text-[13px] text-gray-800 font-medium">
                                        Edit
                                      </span>
                                      <span className="text-gray-500 text-[12px]">
                                        Edit notification
                                      </span>
                                    </div>
                                  </button> */}
                                    {/* <button className="w-full text-[13px] text-gray-600 flex items-center gap-1 bg-gray-100 hover:bg-sky-100 transition-all duration-200 rounded-sm p-1">
                                    <span className="p-1 bg-sky-200 hover:bg-sky-300 rounded-full transition-all duration-300 hover:scale-[1.03]">
                                      <MdNotInterested className="text-[16px] text-sky-500 hover:text-sky-600" />
                                    </span>
                                    <div className="flex flex-col items-start w-full ">
                                      <span className="text-[13px] text-gray-800 font-medium">
                                        Archived
                                      </span>
                                      <span className="text-gray-500 text-[12px]">
                                        Archived notification
                                      </span>
                                    </div>
                                  </button> */}
                                    <button
                                      onClick={() =>
                                        markSingleNotificationAsRead(notify._id)
                                      }
                                      className="w-full text-[13px] text-gray-600 flex items-center gap-1 bg-gray-100 hover:bg-sky-100 transition-all duration-200 rounded-sm p-1"
                                    >
                                      <span className="p-1 bg-sky-200 hover:bg-sky-300 rounded-full transition-all duration-300 hover:scale-[1.03]">
                                        <MdOutlineMarkUnreadChatAlt className="text-[16px] text-sky-500 hover:text-sky-600" />
                                      </span>
                                      <div className="flex flex-col items-start w-full ">
                                        <span className="text-[13px] text-gray-800 font-medium">
                                          Read
                                        </span>
                                        <span className="text-gray-500 text-[12px]">
                                          Mark as Read
                                        </span>
                                      </div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDeleteSingleConfirmation(
                                          notify._id
                                        );
                                      }}
                                      className="w-full text-[13px] text-gray-600 flex items-center gap-1 bg-gray-100 hover:bg-red-100 transition-all duration-200 rounded-sm p-1"
                                    >
                                      <span className="p-1 bg-red-200 hover:bg-red-300   rounded-full transition-all duration-300 hover:scale-[1.03]">
                                        <MdDelete className="text-[16px] text-red-500 hover:text-red-600" />
                                      </span>
                                      <div className="flex flex-col items-start w-full ">
                                        <span className="text-[13px] text-gray-800 font-medium">
                                          Delete
                                        </span>
                                        <span className="text-gray-500 text-[12px]">
                                          Delete notification
                                        </span>
                                      </div>
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p
                                onClick={() => {
                                  setSelectedNotification(notify);
                                  setShowNotification(true);
                                }}
                                className="text-[13px] text-gray-500 text-justify"
                              >
                                {notify?.subject}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <Loader />
                )}
              </div>
            </div>
            {/*  */}
          </div>
        </div>

        {/* -------------Handle Notification Modal------------ */}
        {addNotification && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <NotificationModal
              closeModal={closeMenu}
              setAddNotification={setAddNotification}
              notificationId={notificationId}
              setNotificationId={setNotificationId}
            />
          </div>
        )}
        {/* Notification Detail */}
        {showNotification && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <div className="w-[35rem]">
              <NotificationDetail
                setShowNotification={setShowNotification}
                selectedNotification={selectedNotification}
                setSelectedNotification={setSelectedNotification}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
