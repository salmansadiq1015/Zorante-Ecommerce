import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  Title,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  Title,
  CategoryScale,
  LinearScale
);

const TrafficChart = () => {
  const data = {
    labels: [
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
    ],
    datasets: [
      {
        label: "Store Visits",
        data: [
          300, 2400, 600, 2600, 4400, 1000, 2500, 2700, 5500, 900, 3100, 2900,
          2800, 2900, 6000,
        ],
        fill: true,
        borderColor: "#BD0206",
        backgroundColor: "rgba(255, 79, 90, 0.2)",
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.6)",
        titleColor: "white",
        bodyColor: "white",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#888",
        },
        grid: {
          color: "rgba(0,0,0,0.1)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#888",
        },
        grid: {
          color: "rgba(0,0,0,0.1)",
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 6,
        hitRadius: 10,
        hoverRadius: 8,
      },
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[16px] font-medium text-gray-800 ">Traffic</h3>
        <a
          href="#"
          className="text-sm text-gray-600 hover:text-red-600 hover:underline"
        >
          More →
        </a>
      </div>

      <div className=" grid grid-cols-2 gap-2 mt-3">
        <div className="bg-gray-50  p-3 shadow rounded-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <strong className="text-[14px] font-medium text-black">
              Store Visists:{" "}
            </strong>{" "}
            <span className="text-[13px] text-gray-600">8950</span>
          </div>
          <span style={{ color: "green" }}>+22%</span>
        </div>
        <div className="bg-gray-50  p-3 shadow rounded-lg flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <strong className="text-[14px] font-medium text-black">
              Visitors:
            </strong>
            <span className="text-[13px] text-gray-600">1520</span>
          </div>
          <span style={{ color: "red" }}>-24%</span>
        </div>
      </div>
      <div className=" w-full h-[18rem] mt-4">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TrafficChart;
