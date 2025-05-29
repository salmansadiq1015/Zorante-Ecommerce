import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiCircleChevLeft } from "react-icons/ci";
import { CiCircleChevRight } from "react-icons/ci";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function RevenueDetailModal() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Function to calculate the start and end date for a given month
  const getStartAndEndOfMonth = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  // Set initial dates for current month
  useEffect(() => {
    const currentDate = new Date();
    const { startDate, endDate } = getStartAndEndOfMonth(currentDate);
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  // Fetch Revenue Data based on start and end date
  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/all/analytics/revenue`
        );
        setRevenueData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // Handlers for "Next" and "Previous" buttons
  const handlePrevMonth = () => {
    const currentStartDate = new Date(startDate);
    currentStartDate.setMonth(currentStartDate.getMonth() - 1);
    const { startDate: newStartDate, endDate: newEndDate } =
      getStartAndEndOfMonth(currentStartDate);
    console.log("Previous Month", newStartDate, newEndDate);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleNextMonth = () => {
    const currentStartDate = new Date(startDate);
    currentStartDate.setMonth(currentStartDate.getMonth() + 1);

    const { startDate: newStartDate, endDate: newEndDate } =
      getStartAndEndOfMonth(currentStartDate);

    console.log("Next Month", newStartDate, newEndDate);

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Data for bar chart (dynamically populated)
  const barChartData = {
    labels: revenueData?.map((entry) => `Day ${entry.day}`),
    datasets: [
      {
        label: "Revenue",
        data: revenueData?.map((entry) => entry.totalRevenue),
        backgroundColor: "#ef4444",
        borderRadius: 10,
        barThickness: 8,
      },
    ],
  };

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
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
          callback: function (value) {
            return `$${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="col-span-3 sm:col-span-2 bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Revenue Analytics
            </h2>
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2 text-left">Day</th>
                  <th className="border-b p-2 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenueData?.map((entry, index) => (
                  <tr key={index}>
                    <td className="border-b p-2">Day {entry.day}</td>
                    <td className="border-b p-2">${entry.totalRevenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
