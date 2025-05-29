"use client";
import axios from "axios";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
import { LuChevronsLeft } from "react-icons/lu";
import { BiLoaderCircle } from "react-icons/bi";
import Notfound from "@/app/utils/Notfound";

export default function Search({ friends, getAllChats }) {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [filterFriends, setFilterFriends] = useState([]);
  const closeSearch = useRef(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  // Function to filter friends
  const searchFriend = (value) => {
    const filteredData = friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(value.toLowerCase()) ||
        friend.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilterFriends(filteredData);
  };

  useEffect(() => {
    if (search) {
      searchFriend(search);
    } else {
      setFilterFriends(friends);
    }
    // eslint-disable-next-line
  }, [search, friends]);

  // Close Search
  useEffect(() => {
    const handleClickOutsite = (event) => {
      if (closeSearch.current && !closeSearch.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsite);
    return () => document.removeEventListener("mousedown", handleClickOutsite);
  }, []);

  // Create Chat
  const createChat = async (userId) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/chat/create`,
        { userId: userId }
      );
      if (data) {
        getAllChats();
        setShow(false);
        toast.success("Chat created!");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="relative w-full px-2 transition-all duration-300">
      {/* Search input to show search panel */}
      <div
        className="relative w-full h-[2.2rem] px-2 flex items-center gap-1 text-gray-600  rounded-[2rem] border text-[14px] border-red-600 cursor-pointer"
        onClick={() => setShow(true)}
      >
        <IoSearch className="h-5 w-5 text-red-600" /> Search Messenger
      </div>

      {/* Search panel */}
      <div
        ref={closeSearch}
        className={`absolute top-0 w-full z-[99] px-2 py-2 transition-all duration-300 bg-gray-50 min-h-[20rem] max-h-[25rem]  ${
          show ? "left-0" : "left-[-50rem]"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            onClick={() => setShow(false)}
            className="p-1 bg-gray-100/60 rounded-full hover:bg-gray-200/70 "
          >
            <LuChevronsLeft className="h-5 w-5" />
          </span>

          {/* Search input field */}
          <div className="w-full relative">
            <IoSearch className="h-5 w-5 text-orange-600 absolute top-2 left-2" />
            <input
              type="search"
              value={search}
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[2.3rem] px-2 pl-8 flex items-center outline-none gap-1 text-gray-700  rounded-[2rem] border text-[14px] border-orange-600 cursor-pointer"
              placeholder="Search user by name or email..."
            />
          </div>
        </div>

        {/* Friends list */}
        <div className="w-full flex flex-col gap-3 mt-2">
          {filterFriends.length > 0 ? (
            filterFriends.map((friend) => (
              <div
                className="px-2 py-1 cursor-pointer flex items-center gap-1 bg-gray-100 hover:bg-red-100  rounded-md hover:shadow-md border border-gray-200 "
                key={friend._id}
                onClick={() => {
                  createChat(friend._id);
                  setUserId(friend._id);
                }}
              >
                <div className="relative w-[2.5rem] h-[2.5rem] rounded-full">
                  <Image
                    src={friend?.avatar ? friend?.avatar : "/profile.png"}
                    alt={`${friend.name}`}
                    layout="fill"
                    className="w-10 h-10 rounded-full inline-block mr-2"
                  />
                </div>
                <span className="text-gray-900 ">{friend.name}</span>
                {loading && friend._id === userId && (
                  <span className="ml-4">
                    <BiLoaderCircle className="h-5 w-5 animate-spin" />
                  </span>
                )}
              </div>
            ))
          ) : (
            <Notfound />
          )}
        </div>
      </div>
    </div>
  );
}
