"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const RevenueByCategory = () => {
  const [revenue1Data, setRevenue1Data] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("revenueData:", revenue1Data);

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/revenue/category`
        );
        setRevenue1Data(data.revenueData); // Set the fetched revenue data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // If revenue1Data is empty or loading, return a loading state or empty content
  if (loading) {
    return <div>Loading...</div>;
  }

  // Prepare data for the chart from the fetched revenueData
  const labels = revenue1Data.map((item) => item._id); // Category names
  const data = revenue1Data.map((item) => item.totalRevenue); // Corresponding revenue values

  // Dynamically generate random colors for each category
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const backgroundColors = revenue1Data.map(() => generateRandomColor()); // Generate random colors

  const chartData = {
    labels: labels, // Category names as labels
    datasets: [
      {
        data: data, // Revenue data
        backgroundColor: backgroundColors, // Generated random colors for the chart
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            return `${tooltipItem.label}: €${value.toFixed(2)}`;
          },
        },
        backgroundColor: "rgba(0,0,0,0.6)",
        titleColor: "white",
        bodyColor: "white",
      },
      customCanvasBackgroundColor: {
        id: "customCanvasBackgroundColor",
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          const centerX = chart.chartArea.width / 2 + chart.chartArea.left;
          const centerY = chart.chartArea.height / 2 + chart.chartArea.top;

          // Set the font and text color for the center label
          ctx.save();
          ctx.font = "20px Arial";
          ctx.fillStyle = "#000";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Draw total revenue percentage in the center
          const totalRevenue = data.reduce((acc, val) => acc + val, 0);
          ctx.fillText(
            `${((totalRevenue / totalRevenue) * 100).toFixed(1)}%`,
            centerX,
            centerY - 10
          );
          ctx.fillText("Total Revenue", centerX, centerY + 15);

          // Restore the canvas state to not affect the chart's other drawing operations
          ctx.restore();
        },
      },
    },
    cutout: "60%",
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    legend: {
      display: false,
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full">
      <h3 className="text-lg font-medium text-gray-700 mb-4">
        Revenue by Category
      </h3>
      <div className="relative w-full h-[16rem] flex items-center justify-center">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="mt-4 w-full flex items-center justify-center ">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full ">
          {revenue1Data.map((category, index) => (
            <li key={category._id} className="text-sm flex items-center gap-4">
              <div className="flex items-center gap-1 w-[5rem]">
                <span
                  className="w-[.5rem] h-[.5rem] rounded-full"
                  style={{
                    background: backgroundColors[index], // Use the corresponding color for each category
                  }}
                ></span>
                <span className="font-normal text-[12px] text-gray-600">
                  {category._id}:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 text-[13px] font-medium">
                  €{category.totalRevenue.toFixed(2)} |
                </span>
                <span className="text-gray-600 text-[11px]">
                  {(
                    (category.totalRevenue /
                      data.reduce((acc, val) => acc + val, 0)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RevenueByCategory;
