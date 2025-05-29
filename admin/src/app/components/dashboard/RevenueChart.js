import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import RevenueDetailModal from "./RevenueDetailModal";
import { IoClose } from "react-icons/io5";
import RevenueLoader from "../Loaders/Dashboard/RevenueLoader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function RevenueCharts() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [month, setMonth] = useState(new Date());

  // Function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Update start and end date based on month
  useEffect(() => {
    const fdom = new Date(month.getFullYear(), month.getMonth(), 1);
    const ldom = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    setStartDate(formatDate(fdom));
    setEndDate(formatDate(ldom));
  }, [month]);

  // Fetch revenue data based on start and end date
  useEffect(() => {
    const fetchRevenueData = async () => {
      if (!startDate || !endDate) return;

      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/analytics/revenue/${startDate}/${endDate}`
        );
        setRevenueData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [startDate, endDate]);

  // Navigate to previous month
  const goToPrevMonth = () => {
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Data for bar chart
  const barChartData = {
    labels: revenueData.map((entry) => `Day ${entry.day}`),
    datasets: [
      {
        label: "Revenue",
        data: revenueData.map((entry) => entry.totalRevenue),
        backgroundColor: "#ef4444",
        borderRadius: 10,
        barThickness: 8,
      },
    ],
  };

  // Options for bar chart
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 }, color: "#6b7280" },
      },
      y: {
        grid: { drawBorder: false, color: "#f3f4f6" },
        ticks: {
          font: { size: 12 },
          color: "#6b7280",
          callback: (value) => `€${value}`,
        },
      },
    },
  };

  return (
    <div className="w-full relative">
      {!loading ? (
        <div className="grid grid-cols-3 gap-4">
          {/* Bar Chart */}
          <div className="col-span-3 sm:col-span-2 bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-700">Dashboard</h2>
              <span
                onClick={() => setShowDetail(true)}
                className="text-sm text-gray-600 hover:text-red-600 hover:underline cursor-pointer"
              >
                Advanced Report →
              </span>
            </div>

            {/* Monthly Navigation */}
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={goToPrevMonth}
                className="border-none rounded-full p-1 shadow bg-red-500 hover:bg-red-600 transition-all duration-200 cursor-pointer flex items-center justify-center"
              >
                <FaAngleLeft className="h-5 w-5 text-white" />
              </button>

              <div className="mx-2 text-sm text-gray-700">
                {startDate} - {endDate}
              </div>

              <button
                onClick={goToNextMonth}
                className="border-none rounded-full p-1 shadow bg-red-500 hover:bg-red-600 transition-all duration-200 cursor-pointer flex items-center justify-center"
              >
                <FaAngleRight className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="h-60">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* Data Table */}
          <div className="col-span-3 sm:col-span-1 bg-white shadow-md rounded-lg p-4 max-h-[25rem] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Revenue Data
            </h3>
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2 text-left">Day</th>
                  <th className="border-b p-2 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((entry, index) => (
                  <tr key={index}>
                    <td className="border-b p-2">Day {entry.day}</td>
                    <td className="border-b p-2">€{entry.totalRevenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <RevenueLoader />
      )}

      {/* Revenue Detail Modal */}
      {showDetail && (
        <div className="fixed top-0 left-0 z-[99999999] w-full h-full flex items-center justify-center bg-black/60 p-0 sm:p-4">
          <div className="w-full p-2 sm:p-3 bg-gray-200 rounded-none sm:rounded-lg shadow-md max-h-[100%] overflow-y-auto">
            <div className="flex items-center justify-end w-full pb-4">
              <span
                className="p-1 bg-gray-300/80 hover:bg-gray-400/70 rounded-full"
                onClick={() => setShowDetail(false)}
              >
                <IoClose className="h-5 w-5 text-black cursor-pointer" />
              </span>
            </div>
            <RevenueDetailModal />
          </div>
        </div>
      )}
    </div>
  );
}
