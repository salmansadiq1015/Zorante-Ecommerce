"use client";
import Loader from "@/app/utils/Loader";
import axios from "axios";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
const MainLayout = dynamic(
  () => import("./../../../components/layout/MainLayout"),
  {
    ssr: false,
  }
);
const Breadcrumb = dynamic(() => import("./../../../utils/Breadcrumb"), {
  ssr: false,
});
const PrivacyModal = dynamic(
  () => import("./../../../components/PrivacyPolicy/PolicyModal"),
  {
    ssr: false,
  }
);

export default function Privacy() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [addPrivacy, setAddPrivacy] = useState(false);
  const [privacyId, setPrivacyId] = useState("");
  const [privacyDetail, setPrivacyDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const isInitialRender = useRef(true);

  console.log("privacyDetail:", privacyDetail);

  // Page URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);

  // ------------Privacy Detail---------->
  const fetchPrivacy = async () => {
    if (isInitialRender.current) {
      setLoading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/privacy/fetch/privacy`
      );
      if (data) {
        setPrivacyDetail(data.privacy);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      if (isInitialRender.current) {
        setLoading(false);
        isInitialRender.current = false;
      }
    }
  };

  useEffect(() => {
    fetchPrivacy();
  }, []);

  //   -----------Handle Submit--------------
  const handleStatusConfirmation = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, delete it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
        Swal.fire("Delete!", "Privacy has been deleted.", "success");
      }
    });
  };
  const handleDelete = async (privacyId) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/privacy/update/privacy/${privacyId}`,
        { description: "" }
      );
      if (data) {
        toast.success("Privacy deleted successfully!");
        fetchPrivacy();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <MainLayout
      title="Privacy Policy - Ayoob Admin"
      description="Ayoob Admin Panel is an intuitive and powerful admin interface for managing your e-commerce store. Track orders, manage products, and oversee inventory with ease. Built with MERN stack."
    >
      <div className="relative p-1 sm:p-2 px-1 sm:px-6 h-[100%] w-full pb-4 scroll-smooth">
        <div className="flex flex-col pb-2 h-full">
          <Breadcrumb path={currentUrl} />
          <div className="flex flex-col gap-4 mt-4  w-full h-full">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-2xl font-sans font-semibold text-black">
                Terms & Policy
              </h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setPrivacyId(privacyDetail._id);
                    setAddPrivacy(true);
                  }}
                  className="flex text-[15px] w-[8rem] items-center justify-center text-white bg-slate-400 hover:bg-slate-500  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03]"
                >
                  EDIT
                </button>
                <button
                  onClick={() => handleStatusConfirmation(privacyDetail._id)}
                  className={`flex text-[15px] w-[8rem] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800   py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03]`}
                >
                  DELETE
                </button>
              </div>
            </div>
            {/*  */}
            <div className="relative overflow-hidden w-full h-[85%] py-3 sm:py-4 bg-white rounded-md shadow px-3 sm:px-4 mt-4 overflow-y-auto shidden">
              {loading ? (
                <Loader />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: privacyDetail?.description,
                  }}
                  className="whitespace-pre-wrap break-words px-2 py-2"
                ></div>
              )}
            </div>
          </div>
        </div>
        {/* -------------Handle Product Modal------------ */}
        {addPrivacy && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <PrivacyModal
              setAddPrivacy={setAddPrivacy}
              privacyId={privacyId}
              setPrivacyId={setPrivacyId}
              getPrivacy={fetchPrivacy}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
