import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import { FaSpinner } from "react-icons/fa";
import { RiCoupon4Line } from "react-icons/ri";

const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function HandleCardModal({
  setIsShow,
  cardId,
  setCardId,
  cardInfo,
  fetchCard,
  setCardInfo,
}) {
  const [name, setName] = useState(cardInfo?.name);
  const [card_number, setCard_number] = useState(cardInfo?.card_number);
  const [cvv, setCvv] = useState(cardInfo?.cvv);
  const [expiry_date, setExpiry_date] = useState(
    formatDateForInput(cardInfo?.expiry_date)
  );
  const [zip_code, setZip_code] = useState(cardInfo?.zip_code);
  const [isLoading, setIsloading] = useState(false);

  //   Handle Card
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !card_number || !cvv || !expiry_date || !zip_code) {
      toast.error("Please fill out all required fields.");
      return;
    }
    setIsloading(true);
    const cardData = {
      name,
      card_number,
      cvv,
      expiry_date,
      zip_code,
    };
    try {
      if (cardId) {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/card/update/${cardId}`,
          { ...cardData }
        );

        if (data) {
          toast.success(data?.message || "Card info updated successfully");
        }
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/card/add`,
          { ...cardData }
        );
        if (data) {
          toast.success(data?.message || "Card info added successfully");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      fetchCard();
      setIsShow(false);
      setIsloading(false);
      setCardId("");
      setCardInfo({});
    }
  };

  return (
    <div className="w-[42rem] bg-white rounded-md overflow-hidden shadow min-h-[15rem] max-h-[99%] flex flex-col">
      <div className="flex items-center justify-between bg-customRed px-4 py-2 sm:py-4 ">
        <h3 className="text-lg font-medium text-white flex items-center gap-1">
          {cardId ? "Edit Card" : "Add New Card"}{" "}
          <RiCoupon4Line className="h-5 w-5" />
        </h3>
        <span
          onClick={() => {
            setCardId("");
            setIsShow(false);
            setCardInfo({});
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Name on Card<span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                value={name}
                minLength={6}
                onChange={(e) => setName(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="Name on Card"
                required
              />
            </div>
            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Card Number<span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                value={card_number}
                minLength={16}
                onChange={(e) => setCard_number(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="Card Number"
                required
              />
            </div>
            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date<span className="text-red-700">*</span>
              </label>
              <input
                type="date"
                value={expiry_date}
                onChange={(e) => setExpiry_date(e.target.value)}
                className={`${Style.input} w-full`}
                required
              />
            </div>
            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                CVV<span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                value={cvv}
                min={3}
                onChange={(e) => setCvv(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="CVV"
                required
              />
            </div>

            {/*  */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Zip Code<span className="text-red-700">*</span>
              </label>
              <input
                type="number"
                value={zip_code}
                onChange={(e) => setZip_code(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="Zip Code"
                required
              />
            </div>
            {/*  */}
          </div>
          <div className="flex items-center justify-end w-full pb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setCardId("");
                  setIsShow(false);
                  setCardInfo({});
                }}
                type="button"
                className="w-[6rem] py-[.3rem] text-[14px] rounded-sm border-2 border-customRed text-red-700 hover:bg-gray-100 hover:shadow-md hover:scale-[1.03] transition-all duration-300 "
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="w-[6rem] py-[.4rem] text-[14px] flex items-center justify-center rounded-sm bg-customRed hover:bg-red-700 hover:shadow-md hover:scale-[1.03] transition-all duration-300 text-white"
              >
                {isLoading ? (
                  <span>
                    <FaSpinner className="h-5 w-5 text-white animate-spin" />
                  </span>
                ) : (
                  <span>{cardId ? "Save" : "SUBMIT"}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
