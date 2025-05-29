import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AffiliateSection() {
  const [stats] = useState({
    balance: "€1,250.00",
    totalEarned: "€3,750.00",
    clicks: 1250,
    conversions: 75,
    conversionRate: "6%",
    pendingPayment: "€500.00",
  });

  const [recentEarnings] = useState([
    {
      id: 1,
      product: "Premium Leather Jacket",
      date: "Mar 20, 2025",
      commission: "€25.00",
      status: "Approved",
    },
    {
      id: 2,
      product: "Wireless Headphones",
      date: "Mar 18, 2025",
      commission: "€15.00",
      status: "Approved",
    },
    {
      id: 3,
      product: "Smart Fitness Watch",
      date: "Mar 15, 2025",
      commission: "€12.50",
      status: "Pending",
    },
    {
      id: 4,
      product: "Designer Sunglasses",
      date: "Mar 12, 2025",
      commission: "€20.00",
      status: "Approved",
    },
    {
      id: 5,
      product: "Organic Cotton T-Shirt",
      date: "Mar 10, 2025",
      commission: "€5.00",
      status: "Pending",
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Program</CardTitle>
        <CardDescription>
          Track your affiliate performance and earnings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold text-[#C6080A]">
                {stats.balance}
              </p>
              <Button
                size="sm"
                className="mt-2 bg-[#C6080A] hover:bg-[#a50709]"
              >
                Withdraw
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Earned</p>
              <p className="text-2xl font-bold">{stats.totalEarned}</p>
              <p className="text-xs text-gray-500 mt-2">Lifetime earnings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Pending Payment</p>
              <p className="text-2xl font-bold">{stats.pendingPayment}</p>
              <p className="text-xs text-gray-500 mt-2">
                Processing period: 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-2xl font-bold">{stats.clicks}</p>
              <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Conversions</p>
              <p className="text-2xl font-bold">{stats.conversions}</p>
              <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold">{stats.conversionRate}</p>
              <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Your Affiliate Links</h3>
          <div className="space-y-3">
            {[
              { name: "Homepage", url: "https://example.com?ref=SALMAN25" },
              {
                name: "Premium Collection",
                url: "https://example.com/premium?ref=SALMAN25",
              },
              {
                name: "New Arrivals",
                url: "https://example.com/new?ref=SALMAN25",
              },
            ].map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1 mr-4">
                  <p className="font-medium">{link.name}</p>
                  <p className="text-xs text-gray-500 truncate">{link.url}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(link.url)}
                >
                  Copy Link
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Recent Earnings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-right py-3 px-4 font-medium">
                    Commission
                  </th>
                  <th className="text-right py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEarnings.map((earning) => (
                  <tr key={earning.id} className="border-b">
                    <td className="py-3 px-4">{earning.product}</td>
                    <td className="py-3 px-4 text-gray-500">{earning.date}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      {earning.commission}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge
                        variant={
                          earning.status === "Approved" ? "default" : "outline"
                        }
                        className={
                          earning.status === "Approved"
                            ? "bg-green-500"
                            : "text-amber-500"
                        }
                      >
                        {earning.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
