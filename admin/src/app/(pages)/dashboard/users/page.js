"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Loader from "@/app/utils/Loader";
import dynamic from "next/dynamic";
import { IoClose, IoSearch } from "react-icons/io5";
import { CiCircleChevLeft } from "react-icons/ci";
import { CiCircleChevRight } from "react-icons/ci";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { format } from "date-fns";
import Image from "next/image";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdNotInterested } from "react-icons/md";
import { Style } from "@/app/utils/CommonStyle";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaCheckDouble } from "react-icons/fa";
import { useAuth } from "@/app/context/authContext";
const MainLayout = dynamic(
  () => import("./../../../components/layout/MainLayout"),
  {
    ssr: false,
  }
);
const Breadcrumb = dynamic(() => import("./../../../utils/Breadcrumb"), {
  ssr: false,
});
const UserModal = dynamic(
  () => import("./../../../components/Users/UserModal"),
  {
    ssr: false,
  }
);

export default function Users() {
  const { auth } = useAuth();
  const [currentUrl, setCurrentUrl] = useState("");
  const [userData, setUserData] = useState([]);
  const [filterUser, setFilterUsers] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeUsers, setActiveUsers] = useState(0);
  const [blockUsers, setBlockUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [showAddUser, setShowaddUser] = useState(false);
  const closeModal = useRef(null);
  const [userId, setUserId] = useState("");
  const isInitialRender = useRef(true);

  const fetchUsers = async () => {
    if (isInitialRender.current) {
      setIsloading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/allUsers`
      );
      if (data) {
        setUserData(data.users);
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
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setFilterUsers(userData);
  }, [userData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);

  // Get User Length(Active & Blocked)
  useEffect(() => {
    const activeCount = userData.filter((user) => user.status).length;
    const blockedCount = userData.filter((user) => !user.status).length;

    setActiveUsers(activeCount);
    setBlockUsers(blockedCount);
  }, [userData]);

  // Handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
    filterData(value, activeTab);
  };

  // -------------Handle filtering by tabs and search---------------
  const filterData = (search = searchQuery, statusFilter = activeTab) => {
    let filtered = userData;

    if (statusFilter === "All" && !search) {
      setFilterUsers(userData);
      return;
    }

    if (statusFilter === "Active") {
      filtered = filtered.filter((user) => user.status === true);
    } else if (statusFilter === "Blocked") {
      filtered = filtered.filter((user) => user.status === false);
    }

    if (search) {
      const lowercasedSearch = search.toLowerCase();
      filtered = filtered.filter((user) => {
        const {
          name = "",
          email = "",
          addressDetails: {
            address = "",
            city = "",
            state = "",
            country = "",
          } = {},
        } = user;

        return (
          name.toLowerCase().includes(lowercasedSearch) ||
          email.toLowerCase().includes(lowercasedSearch) ||
          address.toLowerCase().includes(lowercasedSearch) ||
          city.toLowerCase().includes(lowercasedSearch) ||
          state.toLowerCase().includes(lowercasedSearch) ||
          country.toLowerCase().includes(lowercasedSearch)
        );
      });
    }

    setFilterUsers(filtered);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    filterData(searchQuery, tab);
  };

  // ----------------Pegination----------->
  const totalPages = Math.ceil(filterUser.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Get the current page data
  const paginatedData = filterUser.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ------Delete User------>
  const handleDeleteConfirmation = (userId) => {
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
        handleDelete(userId);
        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/delete/user/${id}`
      );
      if (data) {
        fetchUsers();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  // -----------Delete All Notifications------------
  const handleDeleteConfirmationUsers = () => {
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
        deleteAllUsers();
        Swal.fire("Deleted!", "Users has been deleted.", "success");
      }
    });
  };

  const deleteAllUsers = async () => {
    if (!rowSelection) {
      return toast.error("Please select at least one user to delete.");
    }

    const productIdsArray = Object.keys(rowSelection);

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/delete/multiple`,
        { userIds: productIdsArray }
      );

      if (data) {
        fetchUsers();
        toast.success("All selected users deleted successfully.");
        setRowSelection({});
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete users. Please try again later.");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "avatar",
        minSize: 50,
        maxSize: 120,
        size: 60,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">AVATAR</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const avatar = cell.getValue();

          return (
            <div className="cursor-pointer text-[12px] text-black w-full h-full">
              <div className=" w-[2rem] h-[2rem] relative rounded-full bg-sky-600 overflow-hidden flex items-center justify-center">
                {avatar ? (
                  <Image
                    src={avatar ? avatar : "/profile.png"}
                    layout="fill"
                    alt={"Avatar"}
                    className="w-full h-full"
                  />
                ) : (
                  <h3 className="text-[18px] font-medium text-white uppercase">
                    {row.original?.name?.slice(0, 1)}
                  </h3>
                )}
              </div>
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "name",
        minSize: 100,
        maxSize: 200,
        size: 150,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">USER NAME</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const name = cell.getValue();

          return (
            <div className="cursor-pointer text-[12px] flex items-center justify-start text-black w-full h-full">
              {name}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "email",
        minSize: 100,
        maxSize: 250,
        size: 220,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">USER EMAIL</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const email = cell.getValue();

          return (
            <div className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {email}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "bankDetails.accountHolder",
        minSize: 100,
        maxSize: 250,
        size: 150,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">ACCOUNT Holder</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const accountHolder = cell.getValue();

          return (
            <div className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {accountHolder ? accountHolder : ""}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "bankDetails.accountNumber",
        minSize: 100,
        maxSize: 250,
        size: 130,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">BANK ACCOUNT</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const accountNumber = cell.getValue();

          return (
            <div className=" flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {accountNumber ? accountNumber : ""}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "bankDetails.ifscCode",
        minSize: 80,
        maxSize: 120,
        size: 80,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">IFSC Code</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const ifscCode = cell.getValue();

          return (
            <div className=" flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {ifscCode ? ifscCode : ""}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "number",
        minSize: 100,
        maxSize: 160,
        size: 130,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">CONTACT NUMBER</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const number = cell.getValue();

          return (
            <div className=" flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {number}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "addressDetails.address",
        minSize: 100,
        maxSize: 160,
        size: 160,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">LOCATION</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const LOCATION = cell.getValue();

          return (
            <div className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {LOCATION}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "addressDetails.pincode",
        minSize: 60,
        maxSize: 120,
        size: 80,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">PINCODE</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const pincode = cell.getValue();

          return (
            <div className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {pincode}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "addressDetails.city",
        minSize: 60,
        maxSize: 120,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">CITY</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const city = cell.getValue();

          return (
            <div className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {city}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "addressDetails.state",
        minSize: 60,
        maxSize: 120,
        size: 110,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">STATE</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const state = cell.getValue();

          return (
            <div className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {state}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "addressDetails.country",
        minSize: 60,
        maxSize: 120,
        size: 110,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">COUNTRY</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const country = cell.getValue();

          return (
            <div className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full">
              {country}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },

      {
        accessorKey: "status",
        minSize: 80,
        maxSize: 140,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">STATUS</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const status = row.original.status;
          const [userStatus, setUserStatus] = useState(status);
          const [show, setShow] = useState(false);

          const handleUpdate = async (value) => {
            setUserStatus(value);
            try {
              const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/update/role/${row.original._id}`,
                { status: value }
              );
              if (data) {
                fetchUsers();
                setShow(false);
              }
            } catch (error) {
              console.log(error);
              toast.error(error.response?.data?.message);
            }
          };

          return (
            <div className="w-full h-full">
              {!show ? (
                <div
                  onDoubleClick={() => setShow(true)}
                  className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full"
                >
                  {status === true ? (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-green-600 bg-green-200 hover:bg-green-300 text-green-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Active
                    </button>
                  ) : (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-red-600 bg-red-200 hover:bg-red-300 text-red-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Blocked
                    </button>
                  )}
                </div>
              ) : (
                <select
                  value={userStatus}
                  onChange={(e) => handleUpdate(e.target.value)}
                  onBlur={() => setShow(false)}
                  className="w-full border rounded-md p-1 text-black text-[14px]"
                >
                  <option value="true">Active</option>
                  <option value="false">Blocked</option>
                </select>
              )}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      ...(auth.user?.role === "superadmin"
        ? [
            {
              accessorKey: "role",
              minSize: 70,
              maxSize: 140,
              size: 120,
              grow: false,
              Header: ({ column }) => {
                return (
                  <div className=" flex flex-col gap-[2px]">
                    <span className="ml-1 cursor-pointer">Role</span>
                  </div>
                );
              },
              Cell: ({ cell, row }) => {
                const role = cell.getValue();
                const [userRole, setUserRole] = useState(role);
                const [show, setShow] = useState(false);

                const handleUpdate = async (value) => {
                  setUserRole(value);
                  try {
                    const { data } = await axios.put(
                      `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/update/role/${row.original._id}`,
                      { role: value }
                    );
                    if (data) {
                      fetchUsers();
                      setShow(false);
                    }
                  } catch (error) {
                    console.log(error);
                    toast.error(error.response?.data?.message);
                  }
                };

                return (
                  <div className="w-full h-full">
                    {!show ? (
                      <div
                        onDoubleClick={() => setShow(true)}
                        className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full"
                      >
                        {role === "admin" ? (
                          <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-sky-600 bg-sky-200 hover:bg-sky-300 text-sky-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                            Admin
                          </button>
                        ) : role === "superadmin" ? (
                          <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-pink-600 bg-pink-200 hover:bg-pink-300 text-pink-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                            Super Admin
                          </button>
                        ) : role === "agent" ? (
                          <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-lime-600 bg-lime-200 hover:bg-lime-300 text-lime-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                            Agent
                          </button>
                        ) : (
                          <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-green-600 bg-green-200 hover:bg-green-300 text-green-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                            User
                          </button>
                        )}
                      </div>
                    ) : (
                      <select
                        value={userRole}
                        onChange={(e) => handleUpdate(e.target.value)}
                        onBlur={() => setShow(false)}
                        className="w-full border rounded-md p-1 text-black text-[14px]"
                      >
                        <option value="admin"> Admin</option>
                        <option value="superadmin">Super Admin</option>
                        <option value="agent">Agent</option>
                        <option value="user">User</option>
                      </select>
                    )}
                  </div>
                );
              },
              filterFn: (row, columnId, filterValue) => {
                const cellValue =
                  row.original[columnId]?.toString().toLowerCase() || "";

                return cellValue.includes(filterValue.toLowerCase());
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
                        setShowaddUser(true);
                        setUserId(row.original._id);
                      }}
                      className="p-1 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-all duration-300 hover:scale-[1.03]"
                    >
                      <MdModeEditOutline className="text-[16px] text-white" />
                    </span>
                    <span
                      onClick={() => handleUpdate(!status)}
                      className={`p-1  ${
                        userStatus
                          ? "bg-sky-200 hover:bg-sky-300"
                          : "bg-green-200 hover:bg-green-300"
                      }  rounded-full transition-all duration-300 hover:scale-[1.03] cursor-pointer`}
                    >
                      {userStatus ? (
                        <MdNotInterested className="text-[16px] text-sky-500 hover:text-sky-600" />
                      ) : (
                        <FaCheckDouble className="text-[14px] text-green-600 hover:text-green-700" />
                      )}
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
          ]
        : []),
    ],
    // eslint-disable-next-line
    [userData, currentUrl, filterUser, activeTab, paginatedData]
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

  // Close Modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeModal.current && !closeModal.current.contains(event.target)) {
        setUserId("");
        setShowaddUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <MainLayout
      title="User Profile - Manage Your Account and Orders"
      description="View and update your personal information, track orders, and manage account settings from your user profile page."
      keywords="user profile, manage account, order history, update profile, track orders, e-commerce user page, account settings, user dashboard"
    >
      <div className="relative p-1 sm:p-2 h-[100%] w-full pb-4 flex flex-col ">
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
                All ({userData.length})
              </button>
              <button
                className={`border-b-[3px] py-3 text-[14px] px-2 font-medium cursor-pointer ${
                  activeTab === "Active"
                    ? "border-b-[3px] border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("Active")}
              >
                Active ({activeUsers})
              </button>
              <button
                className={` border-b-[3px] py-3 text-[14px] px-2 font-medium cursor-pointer ${
                  activeTab === "Blocked"
                    ? "border-b-[3px] border-red-600 text-red-600"
                    : "text-gray-700 hover:text-gray-800 border-white"
                }`}
                onClick={() => handleTabClick("Blocked")}
              >
                Blocked ({blockUsers})
              </button>
            </div>
            {/* Actions */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-2xl font-sans font-semibold text-black">
                Users
              </h1>
              {auth.user?.role === "superadmin" && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleDeleteConfirmationUsers()}
                    className="text-[14px] py-2 px-4 hover:border-2 hover:rounded-md hover:shadow-md hover:scale-[1.03] text-gray-600 hover:text-gray-800 border-b-2 border-gray-600 transition-all duration-300 "
                  >
                    Delete All
                  </button>
                  <button
                    onClick={() => setShowaddUser(true)}
                    className={`flex text-[14px] items-center justify-center text-white bg-[#c6080a] hover:bg-red-800   py-2 rounded-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] px-4`}
                  >
                    ADD NEW USER
                  </button>
                </div>
              )}
            </div>
          </div>
          {/*  */}

          <div className=" relative overflow-hidden w-full h-[93%] py-3 sm:py-4 bg-white rounded-md shadow  px-2 sm:px-4 mt-4  ">
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

            <div className=" flex overflow-x-auto w-full h-[90%] overflow-y-auto mt-3 pb-4 ">
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
        </div>
        {/* -------------Handle User Modal------------ */}
        {showAddUser && (
          <div className="fixed top-0 left-0 p-2 sm:p-4 w-full h-full flex items-center justify-center z-[9999999] bg-gray-300/80 overflow-y-auto shidden">
            <UserModal
              closeModal={closeModal}
              setShowaddUser={setShowaddUser}
              userId={userId}
              setUserId={setUserId}
              fetchUsers={fetchUsers}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
