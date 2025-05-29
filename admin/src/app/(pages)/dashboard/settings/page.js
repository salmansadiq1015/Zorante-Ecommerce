"use client";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import dynamic from "next/dynamic";
import axios from "axios";
import Loader from "@/app/utils/Loader";
import Image from "next/image";
import toast from "react-hot-toast";
import HandleBannerModal from "@/app/components/Settings/HandleBannerModal";
import Shipping from "@/app/components/Settings/Shipping";
import HandleShippingModal from "@/app/components/Settings/HandleShippingModal";
import Swal from "sweetalert2";
import Ads from "@/app/components/Settings/Ads";
import { Loader2 } from "lucide-react";

const MainLayout = dynamic(
  () => import("./../../../components/layout/MainLayout"),
  {
    ssr: false,
  }
);
const Breadcrumb = dynamic(() => import("./../../../utils/Breadcrumb"), {
  ssr: false,
});
const SettingModal = dynamic(
  () => import("./../../../components/Settings/SettingModal"),
  {
    ssr: false,
  }
);
const BannerGallery = dynamic(
  () => import("./../../../components/Settings/BannerGallery"),
  {
    ssr: false,
  }
);

export default function Settings() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [settingId, setSettingId] = useState("");
  const [addSetting, setAddSetting] = useState(false);
  const [type, setType] = useState("");
  const [selectedTab, setSelectedtab] = useState("Account");
  const [isLoading, setIsLoading] = useState(false);
  const [bannerData, setBannerData] = useState([]);
  const isInitialRender = useRef(true);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerId, setBannerId] = useState("");
  const [accountDetail, setAccountDetail] = useState({});
  const [showFullAccount, setShowFullAccount] = useState(false);
  const [show, setShow] = useState(false);
  const [shippingId, setShippingId] = useState("");
  const [shippingData, setShippingData] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState({});
  const [adsData, setAdsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleAccountVisibility = () => {
    setShowFullAccount((prev) => !prev);
  };

  console.log("accountDetail:", accountDetail);

  // Page URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);

  const fetchAccountDetail = async () => {
    if (isInitialRender.current) {
      setIsLoading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/account/account-setting`
      );
      if (data) {
        setAccountDetail(data?.account[0]);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      if (isInitialRender.current) {
        setIsLoading(false);
        isInitialRender.current = false;
      }
    }
  };

  useEffect(() => {
    fetchAccountDetail();
  }, []);

  // ------------All Banners---------->
  const fetchBanners = async () => {
    if (isInitialRender.current) {
      setIsLoading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/banners/list`
      );
      if (data) {
        setBannerData(data?.banners);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      if (isInitialRender.current) {
        setIsLoading(false);
        isInitialRender.current = false;
      }
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ------------All Shipping---------->
  const fetchShipping = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/shipping/getAll`
      );
      console.log("Shipping Data:", data);
      if (data) {
        setShippingData(data?.shippings);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchShipping();
  }, []);

  // Handle Delete Shipping
  const handleDeleteConfirmation = (shippingId) => {
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
        handleDeleteShipping(shippingId);
        Swal.fire("Deleted!", "Shipping has been deleted.", "success");
      }
    });
  };

  const handleDeleteShipping = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/shipping/delete/${id}`
      );
      if (data) {
        fetchShipping();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // ------------All Ads---------->
  const fetchAds = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/ads/admin`
      );
      if (data) {
        setAdsData(data?.video);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Update Ads
  const handleUpdateAds = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/ads/update/${adsData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data) {
        fetchAds();
        toast.success("Ads updated successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "File type not supported, please upload mp4 video."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      title="Setting - Manage Your Account and Banners"
      description="View and update your account , address & banner information, track orders, and manage account settings from your user profile page."
      keywords="add setting, banner setting, order history, update profile, track orders, e-commerce user page, account settings, user dashboard"
    >
      <div className="p-1 sm:p-2 px-1 sm:px-6 h-[100%] w-full pb-4 scroll-smooth">
        <div className="flex flex-col pb-2 h-full">
          <Breadcrumb path={currentUrl} />
          <div className="flex h-[2.5rem] items-center mt-4 w-fit border-2 border-red-600 rounded-sm">
            <button
              className={`w-[6.5rem] h-full py-[.3rem]  text-[14px] font-normal ${
                selectedTab === "Account"
                  ? "bg-red-600 text-white"
                  : "text-red-600 bg-white"
              }`}
              onClick={() => setSelectedtab("Account")}
            >
              Account
            </button>
            <button
              className={`w-[6.5rem] h-full py-[.3rem] text-[14px] font-normal border-l-2 border-red-600 ${
                selectedTab === "Banner"
                  ? "bg-red-600 text-white"
                  : "text-red-600 bg-white"
              }`}
              onClick={() => setSelectedtab("Banner")}
            >
              Banner
            </button>
            <button
              className={`w-[6.5rem] h-full py-[.3rem] text-[14px] font-normal border-l-2 border-red-600 ${
                selectedTab === "ads"
                  ? "bg-red-600 text-white"
                  : "text-red-600 bg-white"
              }`}
              onClick={() => setSelectedtab("ads")}
            >
              Ads
            </button>

            <button
              className={`w-[6.5rem] h-full py-[.3rem] text-[14px] font-normal border-l-2 border-red-600 ${
                selectedTab === "Shipping"
                  ? "bg-red-600 text-white"
                  : "text-red-600 bg-white"
              }`}
              onClick={() => setSelectedtab("Shipping")}
            >
              Shipping
            </button>
          </div>
          <div className="flex flex-col gap-4 mt-4  w-full h-full">
            {/*  */}
            {selectedTab === "Account" ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h1 className="text-2xl font-sans font-semibold text-black">
                    Settings
                  </h1>
                </div>
                <div className="relative overflow-hidden w-full  py-3 sm:py-4 bg-white rounded-md shadow px-3 sm:px-4  overflow-y-auto shidden">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-md font-semibold text-gray-900">
                      Setup / Edit Bank Account
                    </h3>
                    <div className="flex items-center flex-wrap gap-4 ">
                      <div className="flex flex-col gap-3 p-4 rounded-md bg-red-100">
                        <span className="text-[14px] text-gray-600 flex items-center gap-2">
                          Setup / Edit Bank Account{" "}
                          <AiOutlineExclamationCircle className="text-gray-500 hover:text-gray-700 cursor-pointer text-[17px]" />
                        </span>
                        <span
                          className="text-[14px] text-gray-600 cursor-pointer"
                          onClick={toggleAccountVisibility}
                        >
                          {accountDetail?.accountNumber
                            ? showFullAccount
                              ? accountDetail.accountNumber
                              : "**** **** **** " +
                                accountDetail.accountNumber.slice(-4)
                            : "Not Set"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setType("account");
                          setAddSetting("true");
                          setSettingId(accountDetail._id);
                        }}
                        className={`flex text-[15px] w-[9rem] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03]`}
                      >
                        EDIT ACCOUNT
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden w-full  py-3 sm:py-4 bg-white rounded-md shadow px-3 sm:px-4  overflow-y-auto shidden">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-md font-semibold text-gray-900">
                      Setup / Edit Pick-Up Location
                    </h3>
                    <div className="flex items-center flex-wrap gap-4 ">
                      <div className="flex flex-col gap-3 p-4 rounded-md bg-red-100">
                        <span className="text-[14px] text-gray-600 flex items-center gap-2">
                          Setup / Edit Pick-Up Location{" "}
                          <AiOutlineExclamationCircle className="text-gray-500 hover:text-gray-700 cursor-pointer text-[17px]" />
                        </span>
                        <span className="text-[14px] text-gray-600">
                          {accountDetail?.pickUpLocation
                            ? accountDetail?.pickUpLocation
                            : "Not Set"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setType("address");
                          setAddSetting("true");
                          setSettingId(accountDetail._id);
                        }}
                        className={`flex text-[15px] w-[9rem] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03]`}
                      >
                        EDIT ACCOUNT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedTab === "Banner" ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h1 className="text-2xl font-sans font-semibold text-black">
                    Banner Settings
                  </h1>
                  <div className="flex items-center gap-4 w-full sm:w-fit justify-end">
                    <button
                      onClick={() => setShowBanner(true)}
                      className={`flex text-[14px] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] px-4`}
                    >
                      ADD NEW BANNER
                    </button>
                  </div>
                </div>
                <div className="w-full h-full">
                  <div className="">
                    <BannerGallery
                      bannerData={bannerData}
                      fetchBanners={fetchBanners}
                    />
                  </div>
                </div>
              </div>
            ) : selectedTab === "ads" ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h1 className="text-2xl font-sans font-semibold text-black">
                    Ads Settings
                  </h1>
                  <div className="flex items-center gap-4 w-full sm:w-fit justify-end">
                    <label
                      id="update-ads"
                      className={`flex text-[14px] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] px-4`}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <span>UPDATE ADS</span>
                      )}
                      <input
                        type="file"
                        accept="/video/*"
                        hidden
                        id="update-ads"
                        onChange={(e) => handleUpdateAds(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
                <div className="w-full h-full">
                  <div className="">
                    <Ads adsData={adsData} fetchAds={fetchAds} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h1 className="text-2xl font-sans font-semibold text-black">
                    Shipping Fee Settings
                  </h1>
                  <div className="flex items-center gap-4 w-full sm:w-fit justify-end">
                    <button
                      onClick={() => setShow(true)}
                      className={`flex text-[14px] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] px-4`}
                    >
                      ADD SHIPPING
                    </button>
                  </div>
                </div>
                <div className="w-full h-full">
                  <Shipping
                    shippingData={shippingData}
                    setSelectedShipping={setSelectedShipping}
                    setShippingId={setShippingId}
                    setShow={setShow}
                    handleDeleteConfirmation={handleDeleteConfirmation}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* -------------Handle Setting Modal------------ */}
        {addSetting && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <SettingModal
              setAddSetting={setAddSetting}
              settingId={settingId}
              setSettingId={setSettingId}
              type={type}
              accountDetail={accountDetail}
              fetchAccountDetail={fetchAccountDetail}
            />
          </div>
        )}
        {/* ----------------Handel Banner Modal---------------- */}
        {showBanner && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <HandleBannerModal
              setShowBanner={setShowBanner}
              bannerId={bannerId}
              setBannerId={setBannerId}
              setBannerData={setBannerData}
            />
          </div>
        )}
        {/* -------------Handle Shipping Modal------------ */}
        {show && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <HandleShippingModal
              setShow={setShow}
              shippingId={shippingId}
              setShippingId={setShippingId}
              fetchShipping={fetchShipping}
              selectedShipping={selectedShipping}
              setSelectedShipping={setSelectedShipping}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
