import React, { useState } from "react";
import { CreditCard, Gift, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReferEarnSection() {
  const [referralCode] = useState("SALMAN25");
  const [referralLink] = useState("https://example.com/ref/SALMAN25");
  const [referralStats] = useState({
    invited: 12,
    joined: 5,
    earned: "€50",
  });

  const copyToClipboard = (text, type) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(`${type} copied to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refer & Earn</CardTitle>
        <CardDescription>Invite friends and earn rewards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-[#C6080A] to-[#ff4b4e] rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Invite Friends & Earn €10</h3>
          <p className="mb-4">
            For every friend who signs up and makes a purchase, you&apos;ll
            receive €10 credit and they&apos;ll get 20% off their first order!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 p-4 rounded-lg text-center">
              <Gift className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Share your referral code</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg text-center">
              <User className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Friend signs up & shops</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Both of you get rewarded</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Your Referral Code</h3>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-3 border rounded-lg font-mono text-lg font-bold text-center">
                {referralCode}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(referralCode, "Referral code")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </Button>
            </div>

            <h3 className="text-lg font-medium mt-6 mb-4">Referral Link</h3>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-3 border rounded-lg text-sm truncate">
                {referralLink}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(referralLink, "Referral link")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </Button>
            </div>

            <div className="flex items-center justify-between mt-6">
              <Button className="bg-[#C6080A] hover:bg-[#a50709]">
                <Mail className="mr-2 h-4 w-4" />
                Share via Email
              </Button>
              <Button variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                Share on Facebook
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Your Referral Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-[#C6080A]">
                  {referralStats.invited}
                </p>
                <p className="text-sm text-gray-500 mt-1">Friends Invited</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-[#C6080A]">
                  {referralStats.joined}
                </p>
                <p className="text-sm text-gray-500 mt-1">Friends Joined</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-[#C6080A]">
                  {referralStats.earned}
                </p>
                <p className="text-sm text-gray-500 mt-1">Rewards Earned</p>
              </div>
            </div>

            <h3 className="text-lg font-medium mt-6 mb-4">Recent Referrals</h3>
            <div className="space-y-3">
              {[
                {
                  name: "John Doe",
                  date: "Mar 15, 2025",
                  status: "Joined",
                  reward: "€10",
                },
                {
                  name: "Jane Smith",
                  date: "Mar 10, 2025",
                  status: "Joined",
                  reward: "€10",
                },
                {
                  name: "Mike Johnson",
                  date: "Mar 5, 2025",
                  status: "Pending",
                  reward: "€0",
                },
              ].map((referral, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{referral.name}</p>
                    <p className="text-xs text-gray-500">{referral.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        referral.status === "Joined" ? "default" : "outline"
                      }
                      className={
                        referral.status === "Joined" ? "bg-green-500" : ""
                      }
                    >
                      {referral.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      {referral.reward}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
