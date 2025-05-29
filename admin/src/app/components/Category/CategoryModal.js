"use client";
import { Style } from "@/app/utils/CommonStyle";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { IoCameraOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

export default function CategoryModal({
  closeModal,
  setShowaddCategory,
  categoryId,
  setCategoryId,
  setFilteredData,
  fetchCategories,
}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isloading, setIsloading] = useState(false);

  // Handle Media Upload
  const handleMediaUpload = (e) => {
    const files = e.target.files[0];
    setImage(files);
  };

  // ----------Category Detail-------->
  const categoryInfo = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/categories/category/detail/${categoryId}`
      );
      if (data) {
        setName(data.category.name);
        setImage(data.category.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    categoryInfo();
    // eslint-disable-next-line
  }, [categoryId]);

  //   -----------Handle Create--------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    // Validate input fields
    if (!name || !image) {
      toast.error("Please fill out all required fields.");
      return;
    }

    // Create a new FormData object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", image);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/categories/create/category`,
        formData
      );
      // console.log("Add category response:", data);
      if (data) {
        toast.success("Category added successfully!");
        setShowaddCategory(false);
        setFilteredData((prev) => [...prev, data.category]);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    } finally {
      setIsloading(false);
      fetchCategories();
    }
  };

  // ------------handle Edit------------->
  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!name || !image) {
      toast.error("Please fill out all required fields.");
      return;
    }
    setIsloading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("file", image);
    }

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/categories/update/category/${categoryId}`,
        formData
      );
      if (res) {
        setShowaddCategory(false);
        setCategoryId("");
      }
    } catch (error) {
      console.log("Error updating category:", error);
    } finally {
      fetchCategories();
      setIsloading(false);
    }
  };

  return (
    <div
      ref={closeModal}
      className="w-[27rem] bg-white rounded-md overflow-hidden shadow min-h-[15rem] max-h-[99%] flex flex-col"
    >
      <div className="flex items-center justify-between bg-customRed px-4 py-2 sm:py-4 ">
        <h3 className="text-lg font-medium text-white">
          {categoryId ? "Edit Category" : "Add New Category"}
        </h3>
        <span
          onClick={() => {
            setCategoryId("");
            setShowaddCategory(false);
          }}
          className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white "
        >
          <CgClose className="text-[18px]" />
        </span>
      </div>
      <div className="w-full h-[98%] overflow-y-auto ">
        <form
          onSubmit={categoryId ? handleEditCategory : handleSubmit}
          className="flex flex-col gap-4 px-4 py-2 mt-4 h-full w-full"
        >
          {/* Left */}
          <div className="flex flex-col gap-4">
            {/* --------------Add Media -------------------*/}
            <div className="border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center rounded-md">
              <label className="cursor-pointer flex flex-col items-center">
                <span>
                  <IoCameraOutline className="text-[35px] text-red-700 hover:text-red-700" />
                </span>
                <span className="text-red-700 px-4 py-[.3rem] text-[13px] font-normal rounded-sm text-sm border-2 border-red-700  hover:bg-red-700 hover:text-white transition-all duration-300 hover:shadow-md">
                  Add Media
                </span>
                <input
                  type="file"
                  multiple={false}
                  accept="image/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
              </label>
            </div>
            {image && (
              <div className="flex mt-4 gap-2 flex-wrap">
                <div className="relative w-[3.9rem] h-[3.2rem] bg-gray-200 flex items-center justify-center rounded-md ">
                  <div className="w-[3.5rem] h-[2.8rem] relative rounded-md overflow-hidden flex items-center justify-center">
                    <Image
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      layout="fill"
                      alt={"Thumnail"}
                      className="w-full h-full"
                    />
                  </div>

                  <button
                    onClick={() => setImage("")}
                    className="absolute top-[-.4rem] right-[-.4rem] z-10 bg-red-600 text-white text-xs rounded-full cursor-pointer"
                  >
                    <IoIosClose className="text-[20px]" />
                  </button>
                </div>
              </div>
            )}
            {/* --------Name---------- */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Category Name<span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="Enter category name"
              />
            </div>

            {/*  */}
          </div>

          <div className="flex items-center justify-end w-full pb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setCategoryId("");
                  setShowaddCategory(false);
                }}
                className="w-[6rem] py-[.3rem] text-[14px] rounded-sm border-2 border-customRed text-red-700 hover:bg-gray-100 hover:shadow-md hover:scale-[1.03] transition-all duration-300 "
              >
                CANCEL
              </button>
              <button className="w-[6rem] py-[.4rem] text-[14px] rounded-sm flex items-center justify-center bg-customRed hover:bg-red-700 hover:shadow-md hover:scale-[1.03] transition-all duration-300 text-white">
                {isloading ? (
                  <span>
                    <FaSpinner className="h-5 w-5 text-white animate-spin" />
                  </span>
                ) : (
                  <span>{categoryId ? "Save" : "SUBMIT"}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
