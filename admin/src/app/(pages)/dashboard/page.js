"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import RevenueCharts from "@/app/components/dashboard/RevenueChart";
import RevenueByDevice from "@/app/components/dashboard/RevenueByDevice";
import TrafficChart from "@/app/components/dashboard/TrafficChart";
import dynamic from "next/dynamic";
import axios from "axios";
import OrderUserAnalytics from "@/app/components/dashboard/OrderUserAnalytics";
import TopCards from "@/app/components/Loaders/Dashboard/TopCards";
import OrderUserLoader from "@/app/components/Loaders/Dashboard/OrderUserLoader";
import {
  MdTrendingUp,
  MdShoppingCart,
  MdPerson,
  MdBarChart,
} from "react-icons/md";
import { useRouter } from "next/navigation";
const MainLayout = dynamic(
  () => import("./../../components/layout/MainLayout"),
  {
    ssr: false,
  }
);
const Breadcrumb = dynamic(() => import("./../../utils/Breadcrumb"), {
  ssr: false,
});

// Register the required modules
ChartJS.register(
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [revenue, setRevenue] = useState("0");
  const [orders, setOrders] = useState(0);
  const [revenuePercentage, setRevenuePercentage] = useState("");
  const [ordersPercentage, setOrderPercentage] = useState("");
  const [ordersAnalytics, setOrderAnalytics] = useState(null);
  const [usersAnalytics, setUsersAnalytics] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [userDifference, setUserDifference] = useState(0);
  const [cardLoading, setCardLoading] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [conversionRate, setConversionRate] = useState(0);
  const router = useRouter();

  // Current Path
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);

  // -----------------Order Data----------->
  const orderData = async () => {
    setCardLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/total/revenue`
      );
      console.log("data:", data);
      if (data) {
        setRevenue(data.allTime.totalRevenue);
        setOrders(data.allTime.totalOrders);
        setRevenuePercentage(data.percentageChange.revenue);
        setOrderPercentage(data.percentageChange.orders);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    } finally {
      setCardLoading(false);
    }
  };

  // --------Order Analytics--------
  const orderAnalytics = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/analytics/orders`
      );
      if (data) {
        setOrderAnalytics(data.order.last12Months);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  // -----------User Analytics---------
  const userAnalytics = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/analytics/users`
      );
      if (data) {
        setUsersAnalytics(data.users.last12Months);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // -----------Conversion Rate----------
  const conversionRateData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/conversion/rate`
      );
      if (data) {
        setConversionRate(data.conversionRate);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // User Count
  const fetchUserCount = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/users/count`
      );
      console.log("userCount:", data);
      if (data) {
        setUserCount(data.count);
        setUserDifference(data.percentageChange);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    orderData();
    orderAnalytics();
    userAnalytics();
    fetchUserCount();
    conversionRateData();
  }, []);

  const formatCount = (count) => {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1)}M`;
    } else if (count >= 1_000) {
      return `${(count / 1_000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const data = [
    {
      title: "Revenue",
      value: `€${revenue.toLocaleString()}`,
      percentage: revenuePercentage,
      color: revenuePercentage?.startsWith("+")
        ? "text-green-500"
        : "text-red-500",
      chartColor: revenuePercentage?.startsWith("+") ? "#22c55e" : "#ef4444",
      chartData: [10, 30, 20, 50, 40, 60, 50],
      bgColor: "from-green-100 to-green-200",
      icon: MdTrendingUp,
      iconColor: "text-green-500",
      link: "/dashboard/orders",
    },
    {
      title: "Orders",
      value: orders,
      percentage: ordersPercentage,
      color: ordersPercentage?.startsWith("+")
        ? "text-green-500"
        : "text-red-500",
      chartColor: ordersPercentage?.startsWith("+") ? "#22c55e" : "#ef4444",
      chartData: [50, 40, 30, 20, 40, 30, 10],
      bgColor: "from-blue-100 to-blue-200",
      icon: MdShoppingCart,
      iconColor: "text-blue-500",
      link: "/dashboard/orders",
    },
    {
      title: "Users",
      value: formatCount(userCount),
      percentage: userDifference,
      color:
        userDifference && userDifference?.startsWith("+")
          ? "text-green-500"
          : "text-red-500",
      chartColor:
        userDifference && userDifference?.startsWith("+")
          ? "#22c55e"
          : "#ef4444",
      chartData: [20, 40, 30, 50, 70, 60, 80],
      bgColor: "from-purple-100 to-purple-200",
      icon: MdPerson,
      iconColor: "text-purple-500",
      link: "/dashboard/users",
    },
    {
      title: "Conversion",
      value: conversionRate,
      percentage: "+1.9%",
      chartData: [30, 20, 40, 60, 50, 70, 60],
      color: "text-orange-500",
      chartColor: "#f97316",
      bgColor: "from-orange-100 to-orange-200",
      icon: MdBarChart,
      iconColor: "text-orange-500",
      link: "#",
    },
  ];

  const renderChart = (chartColor, chartData) => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        data: chartData,
        borderColor: chartColor,
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  });

  return (
    <MainLayout
      title="Admin Dashboard - Manage Your E-commerce Store"
      description="The Admin Dashboard provides an overview of your e-commerce store. Easily manage products, track orders, and monitor sales with our intuitive interface."
      keywords="admin dashboard, eCommerce dashboard, manage products, track orders, sales management, admin interface, eCommerce analytics, product inventory, order tracking, store management"
    >
      <div className="p-4 sm:p-4 h-[100%] w-full pb-4">
        <div className="flex flex-col gap-4 w-full h-full">
          <Breadcrumb path={currentUrl} />
          {/* -----------1st------- */}
          {!cardLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.map((item, index) => (
                <div
                  key={index}
                  className={`w-full bg-gradient-to-r ${
                    item.bgColor || "from-indigo-100 to-indigo-200"
                  } 
                  flex flex-col items-start gap-4 p-4 border border-gray-200 rounded-lg shadow-lg 
                  hover:shadow-xl hover:-translate-y-1 transform transition-transform duration-300 
                  cursor-pointer`}
                  onClick={() => item.link && router.push(item.link)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md">
                      <item.icon
                        className={`${
                          item.iconColor || "text-indigo-500"
                        } w-6 h-6`}
                      />
                    </div>
                    <div>
                      <label className="text-[17px]  sm:text-lg font-semibold text-gray-700">
                        {item?.title}
                      </label>
                      <span className="block text-lg sm:text-2xl font-bold text-black">
                        {item?.value}
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span
                      className={`text-sm font-medium ${
                        item?.color || "text-gray-600"
                      }`}
                    >
                      {item?.percentage}
                    </span>
                    <div className="w-24 sm:w-32 h-16">
                      <Line
                        data={renderChart(item.chartColor, item.chartData)}
                        options={{
                          plugins: {
                            legend: { display: false },
                          },
                          scales: {
                            x: { display: false },
                            y: { display: false },
                          },
                          elements: {
                            line: { tension: 0.4 },
                            point: { radius: 0 },
                          },
                          maintainAspectRatio: false,
                          responsive: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <TopCards />
          )}
          {/* ------------Users & Orders---------- */}
          {!isloading ? (
            <OrderUserAnalytics
              ordersAnalytics={ordersAnalytics}
              usersAnalytics={usersAnalytics}
            />
          ) : (
            <OrderUserLoader />
          )}
          {/*------------2nd----------  */}
          <RevenueCharts />
          {/* -----------3rd------------ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RevenueByDevice />
            <TrafficChart />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
