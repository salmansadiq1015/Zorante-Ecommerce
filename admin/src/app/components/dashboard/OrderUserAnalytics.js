import React from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { BarChart, Bar, Label } from "recharts";
export default function OrderUserAnalytics({
  ordersAnalytics,
  usersAnalytics,
}) {
  // ---------Order Analytics--------->

  const analyticsData = [];
  ordersAnalytics &&
    ordersAnalytics?.forEach((item) => {
      analyticsData.push({ name: item?.month, count: item?.count });
    });

  // ---------------Users Analytics--------->

  const userAnalyticsData = [];
  usersAnalytics &&
    usersAnalytics?.map((item) => {
      const formattedDate = new Date(item?.month).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      userAnalyticsData.push({ name: formattedDate, uv: item?.count });
    });

  const minValue = 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="w-full min-h-[10rem] p-3 rounded-md shadow-md shadow-gray-300 drop-shadow-md bg-white">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Orders</h2>
        <div className="w-full  h-[100%] flex items-center justify-center ">
          <div className="w-full h-[100%] flex items-center justify-center">
            <ResponsiveContainer
              width="100%"
              height="90%"
              className="min-h-[15rem]"
            >
              <ComposedChart
                data={analyticsData}
                width={600}
                height={300}
                margin={{
                  top: 0,
                  right: 0,
                  bottom: 5,
                  left: 0,
                }}
              >
                <CartesianGrid stroke={"#FF0000"} />
                <XAxis
                  dataKey="name"
                  label={{
                    value: "Month",
                    position: "insideBottomRight",
                    offset: 0,
                  }}
                  scale="band"
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#FF0000"
                  fill={"#FF0000"}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="w-full min-h-[10rem] p-3 rounded-md shadow-md shadow-gray-300 drop-shadow-md bg-white">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Users</h2>
        <div className="w-full h-[90%] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="93%">
            <BarChart width={600} height={450} data={userAnalyticsData}>
              <XAxis dataKey={"name"} interval="preserveStartEnd">
                <Label offset={0} position="insideBottom" />
              </XAxis>
              <Tooltip />
              <YAxis domain={[minValue, "auto"]} />
              <Bar dataKey="uv" fill={"#047857"}>
                <Label dataKey="uv" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
