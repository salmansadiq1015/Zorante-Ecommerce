"use client";

import { Style } from "@/app/utils/CommonStyle";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { IoCameraOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";

import axios from "axios";

export default function BlogModal({
  closeModal,
  setAddBlog,
  blogId,
  setBlogId,
  setFilterBlogs,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const editor = useRef(null);

  const [isloading, setIsloading] = useState(false);

  // Handle Media Upload
  const handleMediaUpload = (e) => {
    const files = e.target.files[0];
    setThumbnail(files);
  };

  //   -----------Handle Submit--------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !thumbnail) {
      toast.error("Please fill all the required fields.");
      return;
    }
    // Prepare the data from the states
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("published", published ? "true" : "false");
    formData.append("file", thumbnail);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/blogs/create/blog`,
        formData
      );
      if (data.success) {
        console.log("Blog created successfully:", data.success);
        setFilterBlogs((prev) => [...prev, data.blog]);
        setAddBlog(false);
      }
    } catch (error) {
      console.error("Error creating blog:", error.response || error.message);
    }
  };

  // Editor configuration
  const config = {
    readonly: false,
    contentCss: "body { color: red; }",
    height: 450,
    width: 1000,
    color: "#111",
    placeholder: "Write description here...",
  };
  return (
    <div
      //   ref={closeModal}
      className="w-[40rem] bg-white rounded-md overflow-hidden shadow min-h-[15rem] max-h-[99%] flex flex-col"
    >
      <div className="flex items-center justify-between bg-customRed px-4 py-2 sm:py-4 ">
        <h3 className="text-lg font-medium text-white">
          {blogId ? "Edit Blog" : "Add New Blog"}
        </h3>
        <span
          onClick={() => {
            setBlogId("");
            setAddBlog(false);
          }}
          className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white "
        >
          <CgClose className="text-[18px]" />
        </span>
      </div>
      <div className="w-full h-[98%] overflow-y-auto ">
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col gap-4 px-4 py-2 mt-4 h-full w-full "
        >
          {/* Left */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            {thumbnail && (
              <div className="flex mt-4 gap-2 flex-wrap">
                <div className="relative w-[3.9rem] h-[3.2rem] bg-gray-200 flex items-center justify-center rounded-md ">
                  <div className="w-[3.5rem] h-[2.8rem] relative rounded-md overflow-hidden flex items-center justify-center">
                    <Image
                      src={URL.createObjectURL(thumbnail)}
                      layout="fill"
                      alt={"thumbnail"}
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
            <div className="flex flex-col gap-4">
              {/* --------Name---------- */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700">
                  title<span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`${Style.input} w-full`}
                  placeholder="Enter title"
                  required
                />
              </div>
              {/* Published */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Published
                </label>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-700 peer-focus:ring-2 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-100 peer-checked:after:translate-x-8 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {published ? "Published" : "Unpublished"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            {/*  */}
          </div>
          {/* Description */}
          <JoditEditor
            ref={editor}
            value={description}
            config={config}
            color="#fff"
            tabIndex={1}
            onBlur={(newContent) => setDescription(newContent)}
          />

          <div className="flex items-center justify-end w-full pb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setBlogId("");
                  setAddBlog(false);
                }}
                className="w-[6rem] py-[.3rem] text-[14px] rounded-sm border-2 border-customRed text-red-700 hover:bg-gray-100 hover:shadow-md hover:scale-[1.03] transition-all duration-300 "
              >
                CANCEL
              </button>
              <button className="w-[6rem] py-[.4rem] text-[14px] rounded-sm bg-customRed hover:bg-red-700 hover:shadow-md hover:scale-[1.03] transition-all duration-300 text-white">
                {blogId ? "Save" : "SUBMIT"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
