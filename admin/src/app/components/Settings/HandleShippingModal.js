import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaSpinner } from "react-icons/fa";
import countries from "world-countries";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import Select from "react-select";
import toast from "react-hot-toast";
import axios from "axios";

export default function HandleShippingModal({
  shippingId,
  setShippingId,
  setShow,
  selectedShipping,
  setSelectedShipping,
  fetchShipping,
}) {
  const [country, setCountry] = useState("");
  const [fee, setFee] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sort countries alphabetically
  const sortedCountries = countries.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  useEffect(() => {
    if (shippingId && selectedShipping) {
      setCountry(selectedShipping.country);
      setFee(selectedShipping.fee);
    }
  }, [shippingId, selectedShipping]);

  //   -----------Handle Submit--------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (shippingId) {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/shipping/update/${shippingId}`,
          { country, fee }
        );
        if (data) {
          toast.success("Shipping updated successfully!");
          setCountry("");
          setFee("");
        }
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/shipping/add`,
          { country, fee }
        );
        if (data) {
          toast.success("Shipping added successfully!");
          setCountry("");
          setFee("");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      fetchShipping();
      setIsLoading(false);
      setShippingId("");
      setShow(false);
      setSelectedShipping({});
    }
  };

  const countryOptions = sortedCountries.map((country) => ({
    value: country.name.common,
    label: (
      <div className="flex items-center gap-1">
        <span className={`fi fi-${country.cca2.toLowerCase()}`}></span>
        {country.name.common}
      </div>
    ),
  }));

  return (
    <div className="w-[28rem] bg-white rounded-md overflow-hidden shadow min-h-[15rem] max-h-[99%] flex flex-col">
      <div className="flex items-center justify-between bg-customRed px-4 py-2 sm:py-4">
        <h3 className="text-lg font-medium text-white">
          {shippingId ? "Edit Shipping Fee" : "Add Shipping Fee"}
        </h3>
        <span
          onClick={() => setShow(false)}
          className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white"
        >
          <CgClose className="text-[18px]" />
        </span>
      </div>
      <div className="w-full h-[98%] overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 px-4 py-2 mt-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country<span className="text-red-700">*</span>
            </label>
            <Select
              options={countryOptions}
              value={countryOptions.find((option) => option.value === country)}
              onChange={(selected) => setCountry(selected.value)}
              className="w-full outline-red-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Shipping Fee<span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="border rounded px-2 py-2 w-full outline-red-600"
              placeholder="Enter shipping fee "
              required
            />
          </div>
          <div className="flex items-center justify-end gap-2 w-full pb-3">
            <button
              type="button"
              onClick={() => {
                setShow(false);
                setShippingId("");
              }}
              className="w-[6rem] py-[.3rem] text-[14px] rounded-sm border-2 border-customRed text-red-700 hover:bg-gray-100 hover:shadow-md transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-[6rem] py-[.4rem] text-[14px] flex items-center justify-center rounded-sm bg-customRed hover:bg-red-700 hover:shadow-md transition-all duration-300 text-white"
            >
              {isLoading ? (
                <FaSpinner className="h-5 w-5 animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
