import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  Check,
  File,
  ImageIcon,
  Info,
  Mic,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { format, formatDistanceToNow } from "date-fns";
import { TbFileDownload } from "react-icons/tb";

import { fileType } from "@/app/utils/UploadChatFile";
import Image from "next/image";
import MessageLoader from "../Skeltons/MessageLoader";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

export default function ChatSection({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageLoad, setMessageLoad] = useState(false);
  const initialMessagesLoad = useRef(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [selectedQuickQuestion, setSelectedQuickQuestion] = useState(null);

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

  const defaultMessage = {
    _id: "fake-id-1",
    content: `Hello ${user?.name}! Welcome to our support chat. How can I help you today?`,
    contentType: "text",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    sender: {
      _id: "67f8b7adfd43f87ee1498a9c",
      name: "Admin",
      email: "support@ayoob.com",
      avatar: "https://example.com/default-avatar.jpg",
      isOnline: true,
    },
    chat: {
      _id: "chat-id-1",
      chatName: "Support Chat",
      users: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    __v: 0,
  };

  const quickQuestions = [
    "How do I track my order?",
    "I need help with a return",
    "When will my order be delivered?",
    "I have a question about my payment",
    "Can I change my shipping address?",
  ];

  const adminInfo = {
    name: "Support Agent",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastSeen: "Just now",
  };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  useEffect(() => {
    if (selectedQuickQuestion) {
      handleSendMessage(null, selectedQuickQuestion);
      setSelectedQuickQuestion(null);
    }
  }, [selectedQuickQuestion]);

  // ------------------------------Fetch Chat------------------------->

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/chat/fetch/${user?._id}`
      );
      if (data) {
        setSelectedChat(data?.results[0]);
        fetchMessages(data?.results[0]?._id);
      }
    } catch (error) {
      console.error(
        "Error fetching chats:",
        error?.response?.data?.message || error
      );
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [user]);

  // ------------------------------Fetch Chat Messages------------------------->

  const fetchMessages = async (chatId) => {
    if (!chatId) {
      toast.error("Please select a chat to view messages");
      return;
    }

    if (initialMessagesLoad.current) {
      setMessageLoad(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/all/${chatId}`
      );
      setMessages([defaultMessage, ...data.messages]);
      console.log("Messages", data.messages);

      socketId.emit("join chat", chatId);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e, quickQuestion = null) => {
    if (e) e.preventDefault();
    setLoading(true);

    const messageContent = quickQuestion || newMessage.trim();
    if (!messageContent) return;

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/send`,
      {
        content: messageContent,
        contentType: "text",
        chatId: selectedChat._id,
      }
    );

    if (data) {
      socketId.emit("NewMessageAdded", {
        content: messageContent,
        contentType: "text",
        chatId: selectedChat._id,
        messageId: data._id,
      });
      setMessages((prev) => [...prev, data.message]);
      // fetchMessages();
      setNewMessage("");
    }

    // setIsTyping(true);

    // Simulate admin typing and response
    // setTimeout(() => {
    //   const adminResponse = generateAdminResponse(messageContent);
    //   setIsTyping(false);
    //   setMessages((prev) => [
    //     ...prev,
    //     {
    //       id: prev.length + 1,
    //       content: adminResponse,
    //       sender: "admin",
    //       timestamp: new Date().toISOString(),
    //       read: false,
    //     },
    //   ]);
    // }, 1500 + Math.random() * 1500);
  };

  // Fetch Realtime Chat Messages
  useEffect(() => {
    const handleFetchMessages = (data) => {
      fetchMessages(data.chatId);
    };

    socketId.on("fetchMessages", handleFetchMessages);

    return () => {
      socketId.off("fetchMessages", handleFetchMessages);
    };
    // eslint-disable-next-line
  }, [socketId]);

  // -------------------Handle Upload Files--------------->

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
        socketId.emit("NewMessageAdded", {
          content: content,
          contentType: mediaType,
          chatId: selectedChat._id,
          messageId: data._id,
        });
        setNewMessage("");
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
    setNewMessage(e.target.value);

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

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };


  const generateAdminResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("track") ||
      lowerMessage.includes("where is my order")
    ) {
      return "You can track your order by going to the Orders History section and clicking on 'View Details' for the specific order. You'll find tracking information there once your order has been shipped.";
    } else if (
      lowerMessage.includes("return") ||
      lowerMessage.includes("refund")
    ) {
      return "We accept returns within 30 days of delivery. Items must be in original condition with tags attached. To initiate a return, go to your order details and click the 'Return' button.";
    } else if (
      lowerMessage.includes("deliver") ||
      lowerMessage.includes("when") ||
      lowerMessage.includes("shipping")
    ) {
      return "Standard delivery typically takes 3-5 business days. If you've selected express shipping, you should receive your order within 1-2 business days. You can check the estimated delivery date in your order details.";
    } else if (
      lowerMessage.includes("payment") ||
      lowerMessage.includes("charge") ||
      lowerMessage.includes("card")
    ) {
      return "If you have questions about your payment, please provide your order number and I'll check the status for you. We only charge your card when the order ships.";
    } else if (
      lowerMessage.includes("address") ||
      lowerMessage.includes("change")
    ) {
      return "You can change your shipping address if your order hasn't been processed yet. Go to your order details and click on 'Edit' next to the shipping address. If your order has already been processed, please contact us immediately.";
    } else {
      return "Thank you for your message. Our team will review your inquiry and get back to you as soon as possible. Is there anything else I can help you with?";
    }
  };

  
  // Group messages by date
  const groupedMessages = messages
    ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    ?.reduce((groups, message) => {
      const date = formatMessageDate(message?.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date]?.push(message);
      return groups;
    }, {});

  // AutoScroll
  useEffect(() => {
    const messageContainer = document.getElementById("message-Container");

    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <Card className="flex flex-col h-[660px] sm:h-[817px]">
      {/* Chat Header */}
      <CardHeader className="border-b px-4 py-2 sm:py-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-green-500 rounded-full">
            <AvatarImage
              src={
                selectedChat?.users[1]?._id === user?._id
                  ? selectedChat?.users[0]?.avatar || "/profile.png"
                  : selectedChat?.users[1]?.avatar || "/profile.png"
              }
              alt={
                selectedChat?.users[1]?._id === user?._id
                  ? selectedChat?.users[0]?.name
                  : selectedChat?.users[1]?.name
              }
              className="rounded-full"
            />
            <AvatarFallback className="bg-[#C6080A] text-white">
              SC
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">
              {/* {selectedChat?.users[1]?.name } */}
              Support
            </CardTitle>
            <CardDescription className="text-xs flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
              {selectedChat?.users[1]?.isOnline
                ? "Online"
                : selectedChat?.updatedAt
                ? formatDistanceToNow(new Date(selectedChat?.updatedAt), {
                    addSuffix: true,
                  })
                : "Just now"}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Call</TooltipContent>
            </Tooltip>
          </TooltipProvider> */}

          {/* <TooltipProvider className="">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Video Call</TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
          {/* 
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>
          </TooltipProvider> */}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Info</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      {/* Quick Questions */}
      <div className="px-4 py-1 sm:py-2 border-b -mt-3">
        <p className="text-xs text-gray-500 mb-2">Quick Questions:</p>
        <div className="flex overflow-x-auto shidden gap-2">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs rounded-full bg-gray-50 hover:bg-gray-100"
              onClick={() => setSelectedQuickQuestion(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea
        id="message-Container"
        className="flex-1 p-4 max-h-[385px]  sm:max-h-[530px]"
      >
        {messageLoad ? (
          <MessageLoader />
        ) : (
          Object?.entries(groupedMessages)?.map(([date, dateMessages]) => (
            <div key={date}>
              <div className="flex justify-center my-4">
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {date}
                </span>
              </div>
              {dateMessages?.map((message) => (
                <div
                  key={message._id}
                  className={`flex mb-4 ${
                    message?.sender?._id === user?._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message?.sender?._id !== user?._id && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage
                        src={message?.sender?.avatar}
                        alt={message?.sender?.name}
                        className="rounded-full"
                      />
                      <AvatarFallback className="bg-[#C6080A] text-white text-xs rounded-full">
                        {message?.sender?.name
                          ?.split(" ")
                          ?.map((n) => n[0])
                          ?.join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message?.sender?._id === user?._id
                        ? "bg-[#C6080A] text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {message?.contentType === "text" ? (
                      <p className="text-sm">{message?.content}</p>
                    ) : message?.contentType === "like" ? (
                      <div className="text-4xl">{message?.content}</div>
                    ) : message?.contentType === "Image" ? (
                      <a
                        href={message?.content}
                        download
                        target="_blank"
                        className="relative mt-4 w-[11rem] h-[14rem] overflow-hidden cursor-pointer rounded-lg shadow-lg"
                      >
                        <Image
                          src={
                            message?.content ||
                            "/placeholder.svg?height=140&width=140"
                          }
                          alt="Sent image"
                          width={140}
                          height={140}
                          className="rounded-md w-[11rem] h-[10rem] object-fill overflow-hidden cursor-pointer"
                        />
                      </a>
                    ) : message?.contentType === "Video" ? (
                      <div className="relative mt-4 border  w-[15rem] h-fit max-h-[10rem] overflow-hidden rounded-lg shadow-lg">
                        <video controls className="w-full h-fit rounded-lg">
                          <source src={message?.content} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : message?.contentType === "Audio" ? (
                      <div className="flex items-center mt-4 w-[14rem] h-[3rem] p-1  rounded-lg">
                        <audio
                          controls
                          className="w-full h-full bg-transparent rounded-lg"
                        >
                          <source src={message?.content} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <a
                          href={message?.content}
                          download
                          target="_blank"
                          className="flex items-center gap-2 py-[.5rem] px-2 bg-gradient-to-r from-sky-500 to-sky-400 text-white rounded-md shadow-md"
                        >
                          <TbFileDownload className="h-5 w-5 text-white" />
                          <span className=" text-[14px]">Download File</span>
                        </a>
                      </div>
                    )}

                    <div
                      className={`flex items-center justify-end mt-1 space-x-1 ${
                        message?.sender?._id === user?._id
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="text-[10px]">
                        {message?.createdAt
                          ? formatDistanceToNow(new Date(message?.createdAt), {
                              addSuffix: true,
                            })
                          : "Just now"}
                      </span>
                      {selectedChat?.users[1]?._id === user?._id && (
                        <span>
                          {message?.read ? (
                            <Check className="h-3 w-3 text-blue-400" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  {message?.sender?._id === user?._id && (
                    <Avatar className="h-8 w-8 ml-2 mt-1 rounded-full">
                      <AvatarImage
                        src={
                          user?.avatar || "/placeholder.svg?height=32&width=32"
                        }
                        alt={user?.name}
                        className="rounded-full"
                      />
                      <AvatarFallback className="text-xs bg-blue-500 text-white">
                        {user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex mb-4 justify-start">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={adminInfo.avatar} alt={adminInfo.name} />
              <AvatarFallback className="bg-[#C6080A] text-white text-xs">
                SA
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Chat Input */}
      <CardFooter className="border-t px-3 py-2">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center w-full space-x-2"
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 flex-shrink-0"
              >
                <Smile className="h-5 w-5 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" side="top">
              <div className="grid grid-cols-7 gap-2 p-2">
                {[
                  "😊",
                  "😂",
                  "❤️",
                  "👍",
                  "🙏",
                  "🔥",
                  "😍",
                  "😎",
                  "🤔",
                  "😢",
                  "😡",
                  "🎉",
                  "👋",
                  "🤝",
                  "👏",
                  "🙌",
                  "🤷‍♂️",
                  "🤦‍♀️",
                  "💯",
                  "🚀",
                  "✅",
                ].map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => setNewMessage((prev) => prev + emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 flex-shrink-0 cursor-pointer"
              >
                <Paperclip className="h-5 w-5 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" side="top">
              <div
                className={`flex flex-col space-y-1 ${
                  loading && "cursor-not-allowed opacity-70"
                } `}
              >
                <label
                  htmlFor="images"
                  variant="ghost"
                  className="justify-start flex items-center gap-2 cursor-pointer py-[.4rem] px-3 rounded-md hover:bg-gray-100 border"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  <span>Image</span>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    onChange={(e) => {
                      fileType(e.target.files[0], handleSendfiles, setLoading);
                    }}
                    className="hidden"
                  />
                </label>
                <label
                  htmlFor="doucments"
                  variant="ghost"
                  className="justify-start flex items-center gap-2 cursor-pointer py-[.4rem] px-3 rounded-md hover:bg-gray-100 border"
                >
                  <File className="mr-2 h-4 w-4" />
                  <span>Document</span>
                  <input
                    type="file"
                    id="doucments"
                    accept=".pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt, .zip"
                    onChange={(e) => {
                      fileType(e.target.files[0], handleSendfiles, setLoading);
                    }}
                    className="hidden"
                  />
                </label>
                {/* <label
                  htmlFor="audio"
                  variant="ghost"
                  className="justify-start flex items-center gap-2 cursor-pointer py-[.4rem] px-3 rounded-md hover:bg-gray-100 border"
                >
                  <Mic className="mr-2 h-4 w-4" />
                  <span>Audio</span>
                </label> */}
                <label
                  htmlFor="videos"
                  variant="ghost"
                  className="justify-start flex items-center gap-2 cursor-pointer py-[.4rem] px-3 rounded-md hover:bg-gray-100 border"
                >
                  <Video className="mr-2 h-4 w-4" />
                  <span>Video</span>
                  <input
                    type="file"
                    id="videos"
                    accept="video/*"
                    onChange={(e) => {
                      fileType(e.target.files[0], handleSendfiles, setLoading);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </PopoverContent>
          </Popover>

          <Input
            value={newMessage}
            onChange={typingHandler}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-gray-300 focus-visible:ring-[#C6080A]"
          />

          <Button
            type="submit"
            size="icon"
            className="rounded-full h-9 w-9 bg-[#C6080A] hover:bg-[#a50709] flex-shrink-0"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
