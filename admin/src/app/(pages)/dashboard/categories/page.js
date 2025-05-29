"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/app/utils/Loader";
import { ImSpinner4 } from "react-icons/im";

import { IoSearch } from "react-icons/io5";
import { MdDelete, MdModeEditOutline, MdNotInterested } from "react-icons/md";
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
const CategoryModal = dynamic(
  () => import("./../../../components/Category/CategoryModal"),
  {
    ssr: false,
  }
);

export default function Categories() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAddCategory, setShowaddCategory] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const closeModal = useRef(null);
  const isInitialRender = useRef(true);
  const [isLoad, setIsLoad] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);

  // Fetch Page Link
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);
    let filtered = categoryData;
    if (!value) {
      setFilteredData(categoryData);
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

  // Close Modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeModal.current && !closeModal.current.contains(event.target)) {
        setCategoryId("");
        setShowaddCategory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selecting a single Category
  const handleSelectSingle = (id, checked) => {
    if (checked) {
      setSelectedCategoryId((prev) => [...prev, id]);
    } else {
      setSelectedCategoryId((prev) =>
        prev.filter((notifyId) => notifyId !== id)
      );
    }
  };

  // -------------Fetch all categories function--------->
  const fetchAllCategories = async () => {
    if (isInitialRender.current) {
      setIsloading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/categories/all/categories`
      );
      if (data?.categories) {
        setCategoryData(data.categories);
        setFilteredData(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      if (isInitialRender.current) {
        setIsloading(false);
        isInitialRender.current = false;
      }
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Function to delete category
  const handleDeleteConfirmation = (categoryId) => {
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
        deleteCategory(categoryId);
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      }
    });
  };
  const deleteCategory = async (categoryId) => {
    setIsLoad(true);
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/categories/delete/category/${categoryId}`
      );
      if (data) {
        toast.success("Category deleted successfully!");
        setFilteredData((prev) =>
          prev.filter((category) => category._id !== categoryId)
        );
      }
    } catch (error) {
      console.log("Error deleting category:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoad(false);
    }
  };

  // -----------Delete All Notifications------------
  const handleDeleteConfirmationCategories = () => {
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
        deleteAllOrders();
        Swal.fire("Deleted!", "Categories has been deleted.", "success");
      }
    });
  };

  const deleteAllOrders = async () => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/categories/delete/multiple`,
        { categoryIds: selectedCategoryId }
      );

      if (data) {
        fetchAllCategories();
        toast.success("All selected categories deleted successfully.");
        setSelectedCategoryId([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete categories. Please try again later.");
    }
  };
  return (
    <MainLayout title="Categories - Ayoob Admin">
      <div className="relative p-1 sm:p-2 px-1 sm:px-6 h-[100%] w-full pb-4 scroll-smooth">
        <div className="flex flex-col pb-2 h-full">
          <Breadcrumb path={currentUrl} />
          <div className="flex flex-col gap-4 mt-4  w-full h-full">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-2xl font-sans font-semibold text-black">
                Categories
              </h1>
              <div className="flex items-center gap-4 sm:w-fit w-full justify-end">
                <button
                  onClick={handleDeleteConfirmationCategories}
                  className="text-[14px] py-2 px-4 hover:border-2 hover:rounded-md hover:shadow-md hover:scale-[1.03] text-gray-600 hover:text-gray-800 border-b-2 border-gray-600 transition-all duration-300 "
                >
                  Delete All
                </button>
                <button
                  onClick={() => setShowaddCategory(true)}
                  className={`flex text-[14px] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] px-4`}
                >
                  ADD NEW CATEGORY
                </button>
              </div>
            </div>
            {/*  */}
            <div className=" relative overflow-hidden w-full h-[93%] py-3 sm:py-4 bg-white rounded-md shadow  px-2 sm:px-4 mt-4 overflow-y-auto shidden ">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="relative">
                  <span className="absolute top-2 left-[.4rem] z-10">
                    <IoSearch className="text-[18px] text-gray-500" />
                  </span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search"
                    className="w-[17rem] h-[2.2rem] rounded-md border border-gray-400 focus:border-red-600 outline-none px-2 pl-[1.8rem] text-[12px]"
                  />
                </div>
              </div>
              {isLoading ? (
                <div className="w-full col-span-5">
                  <Loader />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-3 sm:gap-4 mt-4">
                  {filteredData?.map((category) => (
                    <div
                      key={category?._id}
                      className=" relative  flex flex-col items-center justify-center p-4 rounded-md bg-gradient-to-tr from-red-50 to-grey-500 shadow hover:bg-red-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    >
                      <div className="absolute top-2 left-2 z-20">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-red-600 cursor-pointer "
                          onChange={(e) =>
                            handleSelectSingle(category._id, e.target.checked)
                          }
                          checked={Boolean(
                            selectedCategoryId?.includes(category._id)
                          )}
                        />
                      </div>

                      {/* <div className="absolute top-2 right-1 z-10 flex flex-col gap-2">
                       
                      </div> */}
                      <div className="w-[5.4rem] h-[5.4rem] relative rounded-full overflow-hidden flex items-center justify-center">
                        <Image
                          src={category?.image}
                          layout="fill"
                          alt={"Avatar"}
                          className="w-full h-full"
                        />
                      </div>
                      <h3 className="text-[16px] text-gray-800 font-medium">
                        {category?.name}
                      </h3>

                      {/* Hover Actions (Edit & Delete) */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg transition-opacity duration-300">
                        <span
                          onClick={() => {
                            setCategoryId(category?._id);
                            setShowaddCategory(true);
                          }}
                          className="p-1 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-300 hover:scale-[1.03]"
                        >
                          <MdModeEditOutline className="text-[14px] text-white" />
                        </span>
                        {/* <span className="p-1 bg-sky-200 hover:bg-sky-300 rounded-full transition-all duration-300 hover:scale-[1.03]">
                          <MdNotInterested className="text-[14px] text-sky-500 hover:text-sky-600" />
                        </span> */}
                        <span
                          onClick={() => {
                            handleDeleteConfirmation(category?._id);
                            setCategoryId(category?._id);
                          }}
                          className={`p-1 bg-red-200 hover:bg-red-300   rounded-full transition-all duration-300 hover:scale-[1.03]  ${
                            isLoading && "cursor-not-allowed"
                          }`}
                        >
                          {isLoad && categoryId === category?._id ? (
                            <ImSpinner4 className="text-[14px] text-red-600 animate-spin" />
                          ) : (
                            <MdDelete className="text-[14px] text-red-500 hover:text-red-600" />
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/*  */}
          </div>
        </div>

        {/* -------------Handle Category Modal------------ */}
        {showAddCategory && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <CategoryModal
              closeModal={closeModal}
              setShowaddCategory={setShowaddCategory}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              setFilteredData={setFilteredData}
              fetchCategories={fetchAllCategories}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
