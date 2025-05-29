"use client";
import ChatLoader from "@/app/components/Loaders/ChatLoader";
import MessageLoader from "@/app/components/Loaders/MessageLoader";
import NotChat from "@/app/utils/NotChat";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AiFillLike, AiOutlineDelete, AiTwotoneCamera } from "react-icons/ai";
import { BiSolidPlusCircle } from "react-icons/bi";
import { BsEmojiSunglasses, BsThreeDotsVertical } from "react-icons/bs";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import {
  MdOutlineClosedCaptionDisabled,
  MdOutlineSlowMotionVideo,
} from "react-icons/md";
import { TbFileDownload } from "react-icons/tb";
import { PiImageDuotone } from "react-icons/pi";
import { CgFileDocument } from "react-icons/cg";
import EmojiPicker from "emoji-picker-react";
import { IoDocumentTextOutline, IoSend } from "react-icons/io5";
import { ImSpinner9 } from "react-icons/im";
import { IoIosImages } from "react-icons/io";
import { LuFileAudio } from "react-icons/lu";
import { useAuth } from "@/app/context/authContext";
import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import Search from "@/app/components/chat/Search";
import { IoClose } from "react-icons/io5";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { fileType } from "@/app/utils/CommonFunction";
import { format } from "date-fns";
import { RiDoorClosedLine } from "react-icons/ri";
import Swal from "sweetalert2";

import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

export default function Chat() {
  const { auth } = useAuth();
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const closeUploads = useRef(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("text");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageLoad, setMessageLoad] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const closeDetail = useRef(null);
  const [chatLoad, setChatLoad] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const closeEmoji = useRef(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const initialChatLoad = useRef(true);
  const initialMessagesLoad = useRef(true);
  const [loading, setLoading] = useState(false);

  // Add Emojis
  const onEmojiClick = (event) => {
    console.log("Emoji1", event);

    setMessage((prevContent) => prevContent + event.emoji);
  };

  // Socket.io
  useEffect(() => {
    socketId.on("typing", (data) => {
      setIsTyping(true);
    });

    socketId.on("stopTyping", (data) => {
      setIsTyping(false);
    });

    // Cleanup on component unmount
    return () => {
      socketId.off("typing");
      socketId.off("stopTyping");
    };
  }, [socketId]);

  //---------- Fetch Chat Users--------->
  const fetchChats = async () => {
    if (initialChatLoad.current) {
      setChatLoad(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/chat/fetch/${auth?.user?._id}`
      );
      if (data) {
        setChats(data.results);
      }
    } catch (error) {
      console.error(
        "Error fetching chats:",
        error?.response?.data?.message || error
      );
    } finally {
      if (initialChatLoad.current) {
        setChatLoad(false);
        initialChatLoad.current = false;
      }
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [auth.user]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/allUsers`
      );
      if (data) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  // Fetch Messages
  const fetchMessages = async (e) => {
    if (!selectedChat) {
      return;
    }

    if (initialMessagesLoad.current) {
      setMessageLoad(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/all/${selectedChat._id}`
      );
      setChatMessages(data.messages);

      socketId.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      if (initialMessagesLoad.current) {
        setMessageLoad(false);
        initialMessagesLoad.current = false;
      }
    }
  };

  useEffect(() => {
    fetchMessages();

    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    const handleFetchMessages = (data) => {
      fetchMessages();
    };

    socketId.on("fetchMessages", handleFetchMessages);

    return () => {
      socketId.off("fetchMessages", handleFetchMessages);
    };
    // eslint-disable-next-line
  }, [selectedChat]);

  // Get Chat from Local Storage
  useEffect(() => {
    const localChat = localStorage.getItem("ecomm_chat");
    if (localChat) {
      setSelectedChat(JSON.parse(localChat));
    }
  }, []);

  //Auto Close Chatbar on Lange Devices
  useEffect(() => {
    const handleResize = () => {
      if (window?.innerWidth >= 880) {
        setShow(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close Upload Files
  useEffect(() => {
    const handleClose = (event) => {
      if (
        closeUploads.current &&
        !closeUploads.current.contains(event.target)
      ) {
        setIsShow(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  // Close Emoji
  useEffect(() => {
    const handleCloseEmoji = (event) => {
      if (closeEmoji.current && !closeEmoji.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleCloseEmoji);

    return () => document.removeEventListener("mousedown", handleCloseEmoji);
  }, []);

  // Close 3Dot Detail
  useEffect(() => {
    const handleClose = (event) => {
      if (closeDetail.current && !closeDetail.current.contains(event.target)) {
        setShowDetail(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  // Handle Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/send`,
        {
          content: message || "👍",
          contentType: type,
          chatId: selectedChat._id,
        }
      );

      if (data) {
        fetchMessages();
        socketId.emit("NewMessageAdded", {
          content: message || "👍",
          contentType: type,
          chatId: selectedChat._id,
          messageId: data._id,
        });
        setMessage("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  // Send Like
  const handleSendLike = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/send`,
        {
          content: "👍",
          contentType: "like",
          chatId: selectedChat._id,
        }
      );

      if (data) {
        fetchMessages();
        socketId.emit("NewMessageAdded", {
          content: "👍",
          contentType: "like",
          chatId: selectedChat._id,
          messageId: data._id,
        });
        setMessage("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // ---------UpLoad File Data---------->
  const handleSendfiles = async (content, mediaType) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/send`,
        {
          content: content,
          contentType: mediaType,
          chatId: selectedChat._id,
        }
      );

      if (data) {
        fetchMessages();
        socketId.emit("NewMessageAdded", {
          content: content,
          contentType: mediaType,
          chatId: selectedChat._id,
          messageId: data._id,
        });
        setMessage("");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //<------------------ Handle Typing----------->

  const typingHandler = (e) => {
    setMessage(e.target.value);

    // Typing Indicator login
    if (!typing) {
      setTyping(true);
      socketId.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLenght = 1500;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLenght && typing) {
        socketId.emit("stopTyping", selectedChat._id);
        setTyping(false);
      }
    }, timerLenght);
  };

  //<---------------- Delete Chat --------------->

  const handleDeleteConfirmation = (chatId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this post!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteChat(chatId);
        Swal.fire("Deleted!", "Your chat has been deleted.", "success");
      }
    });
  };
  const deleteChat = async (id) => {
    try {
      const data = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/chat/delete/${id}`
      );
      if (data) {
        fetchChats();
        setChats((prevChats) => prevChats.filter((chat) => chat._id !== id));
        localStorage.removeItem("ecomm_chat");
        setSelectedChat(null);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // AutoScroll
  useEffect(() => {
    const messageContainer = document.getElementById("message-Container");

    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  return (
    <div
      title="Chats - Ayoob Admin"
      className="relative w-full h-[100vh] overflow-x-hidden bg-white text-black "
    >
      <div className="relative w-full h-[100%] grid grid-cols-11">
        {/* ---------Sidebar----- */}
        <div
          className={`${
            !show
              ? "hidden custom-md:flex flex-col gap-1 col-span-3 border-r   p-1"
              : `w-[21rem] h-full absolute top-0 ${
                  show ? "left-0" : "left-[-50rem]"
                } z-10 bg-white transition-all duration-300`
          }`}
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between mb-3 px-2 py-1">
            <h3
              className={` text-lg sm:text-xl font-serif font-semibold ${Style.text_gradient} `}
            >
              Ayoob Chats
            </h3>
            <span className="p-1 cursor-pointer rounded-full bg-gray-200/70 hover:bg-gray-300/70 transition-all duration-300">
              <IoClose
                className="h-4 w-4 text-black"
                onClick={() => redirect("/dashboard")}
              />
            </span>

            {show && (
              <span
                onClick={() => setShow(false)}
                className="p-1 bg-gray-100/60 rounded-full hover:bg-gray-200/70 "
              >
                <FiChevronsLeft className="h-5 w-5" />
              </span>
            )}
          </div>
          {/* Search */}
          <div className="w-full">
            <Search friends={users} getAllChats={fetchChats} />
          </div>
          <hr className="h-[1px] w-full my-2 bg-gray-200 " />
          {/* -----Chat Buttons----- */}
          <div className="flex flex-col w-full">
            {/*-----Chat Users---- */}
            <div className="flex flex-col w-full h-full px-2  overflow-y-scroll max-h-[calc(100vh-40vh)] 2xl:max-h-[calc(100vh-34vh)] 3xl:max-h-[calc(100vh-28vh)] pb-5 shidden">
              {chatLoad ? (
                <ChatLoader />
              ) : (
                <div className="flex flex-col gap-2 w-full h-full">
                  {chats?.map((chat, i) => (
                    <div
                      key={chat?._id}
                      onClick={() => {
                        setSelectedChat(chat);
                        localStorage.setItem(
                          "ecomm_chat",
                          JSON.stringify(chat)
                        );
                        setShow(false);
                      }}
                      className="px-2 py-[.4rem] cursor-pointer overflow-hidden flex items-center justify-between gap-1 bg-gray-100 hover:bg-red-50  rounded-md hover:shadow-md border border-gray-200 "
                    >
                      <div className="flex items-center gap-[3px]">
                        <div className="relative w-[2.5rem] h-[2.5rem] rounded-full ring-1 ring-red-700">
                          <Image
                            src={
                              chat?.users[1]?._id === auth.user?._id
                                ? chat?.users[0]?.avatar || "/profile.png"
                                : chat?.users[1]?.avatar || "/profile.png"
                            }
                            alt={
                              chat?.users[1]?._id === auth.user?._id
                                ? `${chat?.users[0]?.name}`
                                : `${chat?.users[1]?.name}`
                            }
                            layout="fill"
                            className="rounded-full"
                          />

                          <span
                            className={`absolute bottom-0 right-[.15rem] w-[.5rem] h-[.5rem] rounded-full ${
                              chat?.users[1]?._id === auth.user?._id
                                ? chat?.users[0]?.isOnline
                                  ? "bg-green-500"
                                  : "bg-red-500"
                                : chat?.users[1]?.isOnline
                                ? "bg-green-500"
                                : "bg-red-500"
                            } ring-1 ring-gray-100  z-10`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-semibold text-[14px] ">
                            {chat?.users[1]?._id === auth.user?._id
                              ? `${chat?.users[0]?.name} `
                              : `${chat?.users[1]?.name} `}
                          </span>
                          <span className="text-gray-600 text-[12px]  truncate max-w-[10rem]">
                            {chat?.latestMessage?.contentType === "text" ? (
                              chat?.latestMessage?.content
                            ) : chat?.latestMessage?.contentType === "Image" ? (
                              <span className="flex items-center gap-1">
                                <IoIosImages className="h-4 w-4" /> Image
                              </span>
                            ) : chat?.latestMessage?.contentType === "Video" ? (
                              <span className="flex items-center gap-1">
                                <MdOutlineSlowMotionVideo className="h-4 w-4" />{" "}
                                Video
                              </span>
                            ) : chat?.latestMessage?.contentType === "Audio" ? (
                              <span className="flex items-center gap-1">
                                <LuFileAudio className="h-4 w-4" /> Audio
                              </span>
                            ) : chat?.latestMessage?.contentType === "like" ? (
                              "👍"
                            ) : chat?.latestMessage?.contentType === "File" ? (
                              <span className="flex items-center gap-1">
                                <IoDocumentTextOutline className="h-4 w-4" />{" "}
                                Document file
                              </span>
                            ) : (
                              ""
                            )}
                          </span>
                        </div>
                      </div>
                      {chat?.latestMessage && (
                        <span className="text-[12px] text-gray-600 ">
                          {format(
                            new Date(chat?.latestMessage?.createdAt),
                            "hh:mm a"
                          )}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/*-------- Message------ */}
        {selectedChat ? (
          <div className="relative col-span-11  custom-md:col-span-8 h-full bg-red-700 ">
            {!show && (
              <div className="flex custom-md:hidden absolute top-3 left-[2px] z-10">
                <span
                  onClick={() => setShow(true)}
                  className="p-[2px] bg-gray-100/60 rounded-full hover:bg-gray-200/70 "
                >
                  <FiChevronsRight className="h-5 w-5" />
                </span>
              </div>
            )}
            <div className="w-full h-[100%] bg-white flex flex-col">
              {/* Header Section */}
              <div className="h-[3.2rem] flex items-center justify-between bg-gradient-to-r from-red-700 via-red-500 to-yellow-500 px-2 py-2">
                {/* UserInfo */}
                <div className="flex items-center gap- ml-[1.5rem] 1 sm:ml-0 ">
                  <div className="relative w-[2.6rem] h-[2.6rem] rounded-full overflow-hidden">
                    <Image
                      src={
                        selectedChat?.users[1]?._id === auth.user?._id
                          ? selectedChat?.users[0]?.avatar || "/profile.png"
                          : selectedChat?.users[1]?.avatar || "/profile.png"
                      }
                      alt={`User`}
                      layout="fill"
                      className="rounded-full ring-2 ring-green-200 "
                    />
                  </div>
                  <div className="flex flex-col leading-tight ml-1 ">
                    <span className="text-[17px] font-medium text-gray-50">
                      {selectedChat?.users[1]?._id === auth.user?._id
                        ? `${selectedChat?.users[0]?.name} `
                        : `${selectedChat?.users[1]?.name}`}
                    </span>
                    {isTyping && (
                      <span className="text-white text-[13px]">
                        Typing
                        <span className="dot-1 font-bold text-[18px]">.</span>
                        <span className="dot-2 font-bold text-[18px]">.</span>
                        <span className="dot-3 font-bold text-[18px]">.</span>
                      </span>
                    )}
                  </div>
                </div>
                {/* Call Info */}
                <div className=" relative flex items-center gap-4">
                  {/* ---- Setting Info---- */}
                  <span
                    className="relative p-1 bg-gray-100/80 rounded-full hover:bg-gray-200/70 "
                    onClick={() => setShowDetail(!showDetail)}
                  >
                    <BsThreeDotsVertical className="h-5 w-5 text-red-600 hover:text-red-700 cursor-pointer" />
                  </span>
                  {showDetail && (
                    <div
                      ref={closeDetail}
                      className="absolute top-[2rem] right-[1.5rem] w-[14rem] flex flex-col gap-2 rounded-md bg-gray-50 border border-gray-300  py-3 px-3 z-10"
                    >
                      <div
                        onClick={() => {
                          localStorage.removeItem("ecomm_chat");
                          setSelectedChat(null);
                          setShowDetail(false);
                        }}
                        className="flex items-center gap-1 rounded-sm hover:text-red-600 border py-1 px-2 cursor-pointer hover:border-red-500 transition-all duration-300"
                      >
                        <span>
                          <MdOutlineClosedCaptionDisabled className="h-5 w-5 " />
                        </span>
                        <span className="text-[15px] font-medium">
                          Close Conversation
                        </span>
                      </div>

                      {/*  */}
                      <div
                        onClick={() =>
                          handleDeleteConfirmation(selectedChat._id)
                        }
                        className="flex items-center gap-1 rounded-sm hover:text-red-600 border py-1 px-2 cursor-pointer hover:border-red-500 transition-all duration-300"
                      >
                        <span>
                          <AiOutlineDelete className="h-5 w-5 " />
                        </span>
                        <span className="text-[15px] font-medium">Delete</span>
                      </div>
                      {/*  */}
                      <div
                        onClick={() => redirect("/dashboard")}
                        className="flex items-center gap-1 rounded-sm hover:text-red-600 border py-1 px-2 cursor-pointer hover:border-red-500 transition-all duration-300"
                      >
                        <span>
                          <RiDoorClosedLine className="h-5 w-5 " />
                        </span>
                        <span className="text-[15px] font-medium">
                          Close Tab
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Section shidden */}

              <div
                id="message-Container"
                className="flex-grow overflow-y-auto h-[calc(100vh-6.7rem)] flex flex-col gap-3 bg-white  px-2 py-2"
              >
                {messageLoad ? (
                  <MessageLoader />
                ) : (
                  <>
                    {chatMessages?.map((message) => (
                      <div
                        className={`flex items-start gap-1 max-w-[80%] sm:max-w-[50%] ${
                          message?.sender?._id === auth?.user?._id
                            ? "ml-auto flex-row-reverse"
                            : "mr-auto flex-row"
                        }`}
                        key={message._id}
                      >
                        <div className="w-[2.5rem] h-[2.5rem]">
                          <div className="relative w-[2.2rem] h-[2.2rem] rounded-full overflow-hidden">
                            <Image
                              src={
                                message?.sender?.avatar
                                  ? message?.sender?.avatar
                                  : "/profile.png"
                              }
                              alt={`Avatar`}
                              layout="fill"
                              className="rounded-full"
                            />
                          </div>
                        </div>
                        {message.contentType === "text" ? (
                          <div
                            className={`  rounded-lg text-[14px] px-3 py-2 mt-4 ${
                              message?.sender?._id === auth?.user?._id
                                ? "bg-red-500 text-white rounded-tr-none"
                                : "bg-gray-200 text-black  rounded-tl-none"
                            }`}
                          >
                            <p>{message?.content}</p>
                          </div>
                        ) : message.contentType === "like" ? (
                          <div className="text-4xl">{message?.content}</div>
                        ) : message.contentType === "Image" ? (
                          <a
                            href={message?.content}
                            download
                            target="_blank"
                            className="relative mt-4  w-[12rem] h-[11rem] overflow-hidden cursor-pointer rounded-lg shadow-lg"
                          >
                            <Image
                              src={message?.content}
                              alt="Sent image"
                              layout="fill"
                              className="rounded-lg"
                            />
                          </a>
                        ) : message.contentType === "Video" ? (
                          <div className="relative mt-4 border  w-[14rem] h-fit overflow-hidden rounded-lg shadow-lg">
                            <video controls className="w-full h-fit rounded-lg">
                              <source src={message?.content} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : message.contentType === "Audio" ? (
                          <div className="flex items-center mt-4 w-[14rem] h-[3rem] p-1  rounded-lg">
                            <audio
                              controls
                              className="w-full h-full bg-transparent rounded-lg"
                            >
                              <source
                                src={message?.content}
                                type="audio/mpeg"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        ) : (
                          <div className="mt-4">
                            <a
                              href={message?.content}
                              download
                              target="_blank"
                              className="flex items-center gap-2 py-[.5rem] px-2 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-lg shadow-md"
                            >
                              <TbFileDownload className="h-5 w-5 text-white" />
                              <span className=" text-[14px]">
                                Download File
                              </span>
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Send Message Section */}
              <div className=" relative min-h-[3.4rem] max-h-[3.5rem] h-[2.4rem] flex items-center gap-4 bg-gray-100  px-2 py-2 ">
                <div className="relative">
                  <span
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Open more options"
                    onClick={() => setIsShow(!isShow)}
                  >
                    <BiSolidPlusCircle
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Open more options"
                      className=" w-5 h-5 sm:h-6 sm:w-6 text-red-500 cursor-pointer"
                    />
                  </span>
                  {isShow && (
                    <div
                      ref={closeUploads}
                      className="absolute top-[-11.5rem] right-[-14rem] w-[14rem] flex flex-col gap-2 rounded-md bg-gray-50  border border-gray-300  py-3 px-3 z-10"
                    >
                      <label
                        htmlFor="images"
                        className="flex items-center gap-1 rounded-sm hover:text-red-600 border py-1 px-2 cursor-pointer hover:border-red-500 transition-all duration-300"
                      >
                        <span>
                          <PiImageDuotone className="h-5 w-5 " />
                        </span>
                        <span className="text-[15px] font-medium">
                          Upload Images
                        </span>

                        <input
                          type="file"
                          id="images"
                          accept="image/*"
                          onChange={(e) => {
                            fileType(
                              e.target.files[0],
                              handleSendfiles,
                              setLoading,
                              setIsShow
                            );
                          }}
                          className="hidden"
                        />
                      </label>
                      {/*  */}
                      {/* <label
                        htmlFor="audio"
                        className="flex items-center gap-1 rounded-sm hover:text-red-600 border py-1 px-2 cursor-pointer hover:border-red-500 transition-all duration-300"
                      >
                        <span>
                          <MdOutlineAudiotrack className="h-5 w-5 " />
                        </span>
                        <span className="text-[15px] font-medium">
                          Upload Audio
                        </span>
                        <input
                          type="file"
                          id="audio"
                          accept="audio/*"
                          onChange={(e) => {
                            fileType(
                              e.target.files[0],
                              handleSendfiles,
                              setLoading,
                              setIsShow
                            );
                          }}
                          className="hidden"
                        />
                      </label> */}
                      {/*  */}
                      <label
                        htmlFor="videos"
                        className="flex items-center gap-1 rounded-sm hover:text-red-600 border py-1 px-2 cursor-pointer hover:border-red-500 transition-all duration-300"
                      >
                        <span>
                          <AiTwotoneCamera className="h-5 w-5 " />
                        </span>
                        <span className="text-[15px] font-medium">
                          Upload Videos
                        </span>
                        <input
                          type="file"
                          id="videos"
                          accept="video/*"
                          onChange={(e) => {
                            fileType(
                              e.target.files[0],
                              handleSendfiles,
                              setLoading,
                              setIsShow
                            );
                          }}
                          className="hidden"
                        />
                      </label>
                      {/*  */}
                      <label
                        htmlFor="doucments"
                        className="flex items-center gap-1 rounded-sm hover:text-red-600 border py-1 px-2 cursor-pointer hover:border-red-500 transition-all duration-300"
                      >
                        <span>
                          <CgFileDocument className="h-5 w-5 " />
                        </span>
                        <span className="text-[15px] font-medium">
                          Upload Files
                        </span>
                        <input
                          type="file"
                          id="doucments"
                          accept=".pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt, .zip"
                          onChange={(e) => {
                            fileType(
                              e.target.files[0],
                              handleSendfiles,
                              setLoading,
                              setIsShow
                            );
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <span
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Select Emoji"
                    onClick={() => setShowEmoji(!showEmoji)}
                  >
                    <BsEmojiSunglasses className=" w-5 h-5  text-red-500 cursor-pointer" />
                  </span>
                  {showEmoji && (
                    <div
                      ref={closeEmoji}
                      className="absolute top-[-21rem] right-[-18rem]  flex flex-col gap-2 rounded-md bg-gray-50  border border-gray-300 py-1 px-1 z-20"
                    >
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                  )}
                </div>
                <div className="w-full h-full ">
                  <form
                    onSubmit={handleSendMessage}
                    className="w-full h-full rounded-lg flex items-center gap-2"
                  >
                    <input
                      type="text"
                      autoFocus
                      disabled={loading}
                      value={message}
                      onChange={typingHandler}
                      placeholder="Type your message here..."
                      className="w-full h-full px-4 rounded-[2rem] border outline-none focus:border-red-500"
                    />
                    {message.length > 0 ? (
                      <button
                        type="submit"
                        className=""
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Press enter to send"
                      >
                        <IoSend
                          className={`h-6 w-6 text-red-600 cursor-pointer`}
                        />
                      </button>
                    ) : (
                      <>
                        {loading ? (
                          <span className="">
                            <ImSpinner9 className="h-6 w-6 animate-spin text-red-500" />
                          </span>
                        ) : (
                          <span
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Send a like"
                            onClick={() => {
                              handleSendLike();
                            }}
                          >
                            <AiFillLike
                              className={`h-6 w-6 text-red-600 cursor-pointer`}
                            />
                          </span>
                        )}
                      </>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NotChat setShow={setShow} show={show} />
        )}
      </div>
    </div>
  );
}
