"use client";
import React, { use, useEffect, useMemo, useRef, useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import Breadcrumb from "@/app/utils/Breadcrumb";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Loader from "@/app/utils/Loader";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import Image from "next/image";
import axios from "axios";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { format, set } from "date-fns";
import HandleCardModal from "@/app/components/card/HandleCardModal";
import Swal from "sweetalert2";

export default function Cards() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [cardsData, setCardData] = useState([]);
  const [filterCards, setFilterCards] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [cardId, setCardId] = useState("");
  const isInitialRender = useRef(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [searchQuery, setSearchQuery] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [cardInfo, setCardInfo] = useState({});

  console.log("cardsData:", cardsData);

  // ------Current Page URL-----
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);

  //   All Cards
  const fetchCards = async () => {
    if (isInitialRender.current) {
      setIsloading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/card/all`
      );
      if (data) {
        setCardData(data.cards);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (isInitialRender.current) {
        setIsloading(false);
        isInitialRender.current = false;
      }
    }
  };

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFilterCards(cardsData);
  }, [cardsData]);

  //   Search
  // -------------Handle filtering by tabs and search---------------
  const filterData = (search = searchQuery) => {
    let filtered = cardsData;

    if (search) {
      const lowercasedSearch = search.toLowerCase();
      filtered = filtered.filter((card) => {
        const { name = "", card_number = "", cvv = "", zip_code = "" } = card;

        return (
          name?.toString()?.toLowerCase().includes(lowercasedSearch) ||
          card_number?.toString()?.toLowerCase().includes(lowercasedSearch) ||
          cvv?.toString()?.toLowerCase().includes(lowercasedSearch) ||
          zip_code?.toString()?.toLowerCase().includes(lowercasedSearch)
        );
      });
    }

    setFilterCards(filtered);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    filterData(value);
  };

  const handleDeleteConfirmation = (id) => {
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
        handleDelete(id);
        Swal.fire("Deleted!", "Card information has been deleted.", "success");
      }
    });
  };

  const handleDelete = async (cardId) => {
    setIsloading(true);
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/card/delete/${cardId}`
      );
      if (data) {
        setCardData((prev) => prev.filter((card) => card._id !== cardId));
        toast.success("Card deleted successfully!");
        fetchCards();
      }
    } catch (error) {
      console.log("Error deleting card:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    } finally {
      setIsloading(false);
    }
  };

  // ----------------Pegination----------->
  const totalPages = Math.ceil(filterCards.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Get the current page data
  const paginatedData = filterCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //   --------------------Table Data-------------
  const columns = useMemo(
    () => [
      {
        accessorKey: "user",
        minSize: 50,
        maxSize: 120,
        size: 60,
        grow: false,
        Header: ({ column }) => (
          <div className="flex flex-col gap-[2px]">
            <span className="ml-1 cursor-pointer">USER</span>
          </div>
        ),
        Cell: ({ cell, row }) => {
          const profileImage = row.original?.user?.avatar;
          const userName = row.original?.user?.name || row.original?.name;

          return (
            <div className="cursor-pointer text-[12px] text-black w-full h-full">
              <div className="w-[2.2rem] h-[2.2rem] relative rounded-full bg-sky-600 overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    width={50}
                    height={50}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <h3 className="text-[18px] font-medium text-white uppercase">
                    {userName?.slice(0, 1) || "U"}
                  </h3>
                )}
              </div>
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original?.user?.name?.toString().toLowerCase() || "";
          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "name",
        minSize: 70,
        maxSize: 140,
        size: 160,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">NAME</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const name = row.original?.name;

          return (
            <div className={`text-[13px] font-medium truncate `}>{name}</div>
          );
        },
      },
      {
        accessorKey: "email",
        minSize: 70,
        maxSize: 170,
        size: 200,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">EMAIL</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const email = row.original?.user?.email;

          return (
            <div className={`text-[13px] font-medium truncate `}>{email}</div>
          );
        },
      },
      {
        accessorKey: "card_number",
        minSize: 70,
        maxSize: 140,
        size: 140,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">CARD NUMBER</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const number = row.original?.card_number;

          return <div className={`text-[13px] font-medium `}>{number}</div>;
        },
      },
      {
        accessorKey: "cvv",
        minSize: 50,
        maxSize: 100,
        size: 60,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">CVV</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const cvv = row.original?.cvv;

          return <div className={`text-[13px] font-medium `}>{cvv}</div>;
        },
      },
      {
        accessorKey: "expiry_date",
        minSize: 70,
        maxSize: 140,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">EXPIRY DATE</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const expiry_date = row.original?.expiry_date;

          return (
            <div className={`text-[13px] font-medium `}>
              {format(expiry_date, "yyyy-MM-dd")}
            </div>
          );
        },
      },
      {
        accessorKey: "zip_code",
        minSize: 70,
        maxSize: 100,
        size: 80,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">ZIP CODE</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const zip_code = row.original?.zip_code;

          return <div className={`text-[13px] font-medium `}>{zip_code}</div>;
        },
      },
      {
        accessorKey: "Actions",
        minSize: 100,
        maxSize: 140,
        size: 130,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">ACTIONS</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const status = row.original.status;
          const [userStatus, setUserStatus] = useState(status);

          const handleUpdate = async (value) => {
            setUserStatus(value);
            alert(value);
            try {
              const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/update/role/${row.original._id}`,
                { status: value }
              );
              if (data) {
                fetchUsers();
              }
            } catch (error) {
              console.log(error);
              toast.error(error.response?.data?.message);
            }
          };
          return (
            <div className="flex items-center justify-center gap-2 cursor-pointer text-[12px] text-black w-full h-full">
              <span
                onClick={() => {
                  setCardInfo(row.original);
                  setCardId(row.original._id);
                  setIsShow(true);
                }}
                className="p-1 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-300 hover:scale-[1.03]"
              >
                <MdModeEditOutline className="text-[16px] text-white" />
              </span>

              <span
                onClick={() => handleDeleteConfirmation(row.original._id)}
                className="p-1 bg-red-200 hover:bg-red-300   rounded-full transition-all duration-300 hover:scale-[1.03]"
              >
                <MdDelete className="text-[16px] text-red-500 hover:text-red-600" />
              </span>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line
    [filterCards, cardsData, paginatedData, searchQuery]
  );

  const table = useMaterialReactTable({
    columns,
    data: paginatedData,
    getRowId: (row) => row._id,
    enableStickyHeader: true,
    enableStickyFooter: false,
    columnFilterDisplayMode: "popover",
    muiTableContainerProps: {
      sx: (theme) => ({
        minHeight: {
          xs: "330px",
          sm: "350px",
          md: "330px",
          lg: "400px",
          xl: "500px",
        },
        maxHeight: {
          xs: "350px",
          sm: "380px",
          md: "400px",
          lg: "500px",
          xl: "800px",
        },
      }),
    },
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    enableGlobalFilter: true,
    enableRowNumbers: true,
    enableColumnResizing: true,
    enableTopToolbar: true,
    enableBottomToolbar: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    // enableEditing: true,
    // state: { isLoading: isLoading },

    enablePagination: false,
    initialState: {
      pagination: { pageSize: 20 },
      pageSize: 20,
      density: "compact",
    },

    muiTableHeadCellProps: {
      style: {
        fontWeight: "600",
        fontSize: "12px",
        backgroundColor: "#c6080a",
        color: "#fff",
        padding: ".7rem 0.3rem",
      },
    },
  });

  return (
    <MainLayout title="Cards - Ayoob Admin">
      <div className="p-1 sm:p-2 h-[100%] w-full pb-4  scroll-smooth">
        <div className="flex flex-col gap-3 pb-2 ">
          <Breadcrumb path={currentUrl} />

          {/* Actions */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-sans font-semibold text-black">
              Cards
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsShow(true)}
                className={`flex text-[14px] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800  py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] px-4`}
              >
                ADD NEW CARD
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-[93%]  relative overflow-hidden overflow-x-auto  py-3 sm:py-4 bg-white rounded-md shadow  px-2 sm:px-4 mt-4  ">
          {/* ------Search & Pegination--------- */}
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
            {/* Pegination */}
            <div className="flex items-center gap-3 justify-end sm:justify-normal w-full sm:w-fit">
              <span>
                {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <CiCircleChevLeft
                  onClick={() => handlePageChange("prev")}
                  className={`text-[27px] text-green-500 hover:text-green-600 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                />
                <CiCircleChevRight
                  onClick={() => handlePageChange("next")}
                  className={`text-[27px] text-green-500 hover:text-green-600 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                />
              </div>
            </div>
          </div>
          {/* -----------Table Data------------- */}
          <div className="overflow-x-auto w-full scroll-smooth shidden h-[90%] overflow-y-auto mt-3 pb-4 ">
            {isLoading ? (
              <div className="flex items-center justify-center w-full h-screen px-4 py-4">
                <Loader />
              </div>
            ) : (
              <div className="w-full min-h-[20vh] relative">
                <div className="h-full overflow-y-scroll shidden relative">
                  <MaterialReactTable table={table} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* -------------Handle Card Modal------------ */}
        {isShow && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <HandleCardModal
              setIsShow={setIsShow}
              cardId={cardId}
              setCardId={setCardId}
              cardInfo={cardInfo}
              fetchCard={fetchCards}
              setCardInfo={setCardInfo}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
