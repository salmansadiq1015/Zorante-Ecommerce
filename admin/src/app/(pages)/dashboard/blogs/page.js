"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { TiEye } from "react-icons/ti";
import { MdShare } from "react-icons/md";
import { blogs } from "@/app/components/DummyData/DummyData";
import axios from "axios";

const MainLayout = dynamic(
  () => import("./../../../components/layout/MainLayout"),
  {
    ssr: false,
  }
);
const Breadcrumb = dynamic(() => import("./../../../utils/Breadcrumb"), {
  ssr: false,
});
const BlogModal = dynamic(() => import("../../../components/Blog/BlogModal"), {
  ssr: false,
});

export default function Blogs() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [blogsData, setBlogsData] = useState(blogs || []);
  const [filterBlogs, setFilterBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedBlogIds, setSelectedBlogIds] = useState([]);
  const [show, setShow] = useState(false);
  const [blogId, setBlogId] = useState("");
  const closeMenu = useRef(null);
  const [publishBlogs, setPublishBlogs] = useState(0);
  const [draftBlogs, setDraftBlogs] = useState(0);
  const [addBlog, setAddBlog] = useState(false);

  // Fetch Link (URL)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
  }, []);

  // Get Blogs Length(Publish & Draft)
  useEffect(() => {
    const publishCount = blogsData.filter(
      (blog) => blog.status === "Published"
    ).length;
    const draftCount = blogsData.filter(
      (blog) => blog.status === "Draft"
    ).length;

    setPublishBlogs(publishCount);
    setDraftBlogs(draftCount);
  }, [blogsData]);

  // useEffect(() => {
  //   setFilterBlogs(blogsData);
  // }, [blogsData]);

  const filterData = (statusFilter = activeTab) => {
    let filtered = blogsData;

    if (statusFilter === "All") {
      setFilterBlogs(blogsData);
      return;
    }

    if (statusFilter === "Draft") {
      filtered = filtered.filter((blog) => blog.status === "Draft");
    } else if (statusFilter === "Published") {
      filtered = filtered.filter((blog) => blog.status === "Published");
    }

    setFilterBlogs(filtered);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    filterData(tab);
  };

  // Handle selecting all Blogs
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBlogIds(filterBlogs.map((blog) => blog._id));
    } else {
      setSelectedBlogIds([]);
    }
  };

  // Handle selecting a single Blogs
  const handleSelectSingle = (id, checked) => {
    if (checked) {
      setSelectedBlogIds((prev) => [...prev, id]);
    } else {
      setSelectedBlogIds((prev) => prev.filter((blogId) => blogId !== id));
    }
  };
  // Close Menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeMenu.current && !closeMenu.current.contains(event.target)) {
        setBlogId("");
        setShow(false);
        setAddBlog(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch all blogs function
  const fetchAllBlogs = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/blogs/all`
      );
      console.log("res", data);

      if (data?.blogs) {
        setFilterBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return (
    <MainLayout title="Blogs - Ayoob Admin">
      <div className="relative p-1 sm:p-2 h-[100%] w-full pb-4 ">
        <div className="flex flex-col pb-2 ">
          <Breadcrumb path={currentUrl} />
          <div className="flex flex-col gap-5 mt-4">
            {/* Tabs */}
            <div className="w-full px-4 rounded-md bg-white flex items-center gap-4">
              <button
                className={`border-b-[3px] py-3 text-[14px] px-2 font-medium cursor-pointer ${
                  activeTab === "All"
                    ? " border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("All")}
              >
                All Blogs ({blogsData.length})
              </button>
              <button
                className={`border-b-[3px] py-3 text-[14px] px-2 font-medium cursor-pointer ${
                  activeTab === "Published"
                    ? "border-b-[3px] border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("Published")}
              >
                Publishs ({publishBlogs})
              </button>
              <button
                className={`border-b-[3px] py-3 text-[14px] px-2 font-medium cursor-pointer ${
                  activeTab === "Draft"
                    ? "border-b-[3px] border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("Draft")}
              >
                Drafts ({draftBlogs})
              </button>
            </div>
            {/* Title & Action */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-2xl font-sans font-semibold text-black">
                Blogs
              </h1>
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-fit justify-end">
                <button className="flex text-[12px] font-medium sm:text-[14px] w-[6rem] sm:w-[8rem] items-center justify-center text-white bg-gray-400 hover:bg-gray-500  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03]">
                  PUBLISH
                </button>
                <button className="flex text-[12px] font-medium sm:text-[14px] w-[6rem] sm:w-[8rem] items-center justify-center text-white bg-gray-400 hover:bg-gray-500  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03]">
                  DELETE All
                </button>

                <button
                  onClick={() => setAddBlog(true)}
                  className={`flex text-[12px] font-medium sm:text-[14px] w-[6rem] sm:w-[8rem] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800   py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03]`}
                >
                  CREATE NEW
                </button>
              </div>
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
                    checked={selectedBlogIds.length === filterBlogs.length}
                  />
                  <span className="text-[16px] font-medium text-gray-900">
                    Select All
                  </span>
                </div>
                <button className="flex sm:hidden  text-[12px] sm:text-[14px] py-2 px-2 sm:px-4 text-gray-600 hover:text-red-600  border-b-2 border-gray-600 hover:border-red-600  hover:scale-[1.03]  transition-all duration-300 ">
                  Mark all as read
                </button>
              </div>
              {/* Data */}
              <div className="flex flex-col gap-4 w-full h-full ">
                {filterBlogs?.map((blog) => (
                  <div className="w-full flex items-start gap-4" key={blog._id}>
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-red-600 cursor-pointer"
                      onChange={(e) =>
                        handleSelectSingle(blog._id, e.target.checked)
                      }
                      checked={selectedBlogIds.includes(blog._id)}
                    />
                    <div className=" relative flex sm:items-start flex-col  sm:flex-row  gap-2 rounded-lg border border-gray-300 hover:shadow-md cursor-pointer bg-gray-50 hover:100 p-3 w-full ">
                      <div className="w-full sm:w-[9rem] h-[9rem] sm:h-[8rem] rounded-full">
                        <div className=" w-full sm:w-[8.9rem] h-[8.9rem] sm:h-[7.9rem] relative rounded-md overflow-hidden flex items-center justify-center">
                          <Image
                            src={blog?.thumnail}
                            layout="fill"
                            fill
                            alt={"Avatar"}
                            className="w-full h-full "
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <div className="w-full relative flex items-center justify-between">
                          <h3 className="text-[13px] sm:text-[15px] text-gray-900 font-semibold sm:font-medium w-full">
                            {blog?.title}
                          </h3>
                          <span
                            onClick={() => {
                              setBlogId(blog._id);
                              setShow(!show);
                            }}
                            className="bg-gray-100 hover:bg-red-200 p-1 rounded-full hover:shadow-md text-black hover:text-red-600 transition-all duration-200 cursor-pointer"
                          >
                            <BsThreeDotsVertical className="text-[20px]" />
                          </span>
                          {show && blog._id === blogId && (
                            <div
                              ref={closeMenu}
                              className="absolute top-6 right-6 w-[11rem] border bg-gray-50 border-gray-200 z-20 px-2 py-2 rounded-sm flex flex-col gap-2 "
                            >
                              <button className="w-full text-[13px] text-gray-600 flex items-center gap-1 bg-gray-100 hover:bg-purple-100 transition-all duration-200 rounded-sm p-1">
                                <span className="p-1 cursor-pointer bg-purple-200 hover:bg-purple-300 rounded-full transition-all duration-300 hover:scale-[1.03]">
                                  <TiEye className="text-[16px] text-purple-500 hover:text-purple-600" />
                                </span>
                                <div className="flex flex-col items-start w-full ">
                                  <span className="text-[13px] text-gray-800 font-medium">
                                    See
                                  </span>
                                  <span className="text-gray-500 text-[12px]">
                                    See blog detail
                                  </span>
                                </div>
                              </button>
                              <button
                                onClick={() => {
                                  setAddBlog(true);
                                  setBlogId(blog._id);
                                }}
                                className="w-full cursor-pointer text-[13px] text-gray-600 flex items-center gap-1 bg-gray-100 hover:bg-yellow-100 transition-all duration-200 rounded-sm p-1"
                              >
                                <span className="p-1 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-300 hover:scale-[1.03]">
                                  <MdModeEditOutline className="text-[16px] text-white" />
                                </span>
                                <div className="flex flex-col items-start w-full ">
                                  <span className="text-[13px] text-gray-800 font-medium">
                                    Edit
                                  </span>
                                  <span className="text-gray-500 text-[12px]">
                                    Edit Blog
                                  </span>
                                </div>
                              </button>

                              <button className="w-full cursor-pointer text-[13px] text-gray-600 flex items-center gap-1 bg-gray-100 hover:bg-red-100 transition-all duration-200 rounded-sm p-1">
                                <span className="p-1 bg-red-200 hover:bg-red-300   rounded-full transition-all duration-300 hover:scale-[1.03]">
                                  <MdShare className="text-[16px] text-red-500 hover:text-red-600" />
                                </span>
                                <div className="flex flex-col items-start w-full ">
                                  <span className="text-[13px] text-gray-800 font-medium">
                                    Share
                                  </span>
                                  <span className="text-gray-500 text-[12px]">
                                    Click to share blog
                                  </span>
                                </div>
                              </button>
                              <button className="w-full cursor-pointer text-[13px] text-gray-600 flex items-center gap-1 bg-gray-100 hover:bg-sky-100 transition-all duration-200 rounded-sm p-1">
                                <span className="p-1 bg-sky-200 hover:bg-sky-300   rounded-full transition-all duration-300 hover:scale-[1.03]">
                                  <MdDelete className="text-[16px] text-sky-500 hover:text-sky-600" />
                                </span>
                                <div className="flex flex-col items-start w-full ">
                                  <span className="text-[13px] text-gray-800 font-medium">
                                    Delete
                                  </span>
                                  <span className="text-gray-500 text-[12px]">
                                    Delete blog
                                  </span>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-[12px] sm:text-[13px] text-gray-500 text-justify">
                          {blog?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/*  */}
        </div>

        {/* -------------Handle Blog Modal------------ */}
        {addBlog && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <BlogModal
              closeModal={closeMenu}
              setAddBlog={setAddBlog}
              blogId={blogId}
              setBlogId={setBlogId}
              setFilterBlogs={setFilterBlogs}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
