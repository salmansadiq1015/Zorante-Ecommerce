"use client";
import MainLayout from "@/app/components/Layout/Layout";
import { useAuth } from "@/app/content/authContent";
import { authUri } from "@/app/utils/ServerURI";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RiLogoutCircleRFill } from "react-icons/ri";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Gift,
  Globe,
  Heart,
  History,
  Mail,
  MessageSquare,
  Package,
  Percent,
  RefreshCw,
  ShoppingBag,
  Star,
  User,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import UpdateProfileModal from "@/app/components/Profile/UpdateProfile";
import LoadingSkelton from "@/app/components/Profile/LoadingSkelton";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
import RegionSelector from "@/app/components/Profile/RegionSelector";
import LanguageSelector from "@/app/components/Profile/LanguageSelector";
import CurrencySelector from "@/app/components/Profile/CurrencySelector";
import OrdersHistory from "@/app/components/Profile/OrdersHistory";
import FavoritesSection from "@/app/components/Profile/FavoritesSection";
import RecentlyViewedSection from "@/app/components/Profile/RecentlyViewedSection";
import CouponsSection from "@/app/components/Profile/CouponsSection";
import ReferEarnSection from "@/app/components/Profile/ReferEarnSection";
import AffiliateSection from "@/app/components/Profile/AffiliateSection";
import SupportSection from "@/app/components/Profile/SupportSection";
import ChatSection from "@/app/components/Profile/ChatSection";
import NotificationSection from "@/app/components/Profile/NotificationSection";

export default function Profile() {
  const { auth, setAuth } = useAuth();
  const { id: userId } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  const tab = useSearchParams().get("tab");

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  // Get User Details
  const getUserDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${authUri}/userDetail/${userId}`);
      setUserDetails(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const joinDate = formatDate(userDetails?.createdAt);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      localStorage.removeItem("@ayoob");
      Cookies.remove("@ayoob");

      setAuth({ user: null, token: "" });

      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return <LoadingSkelton />;
  }
  return (
    <MainLayout title="Zorante - Account Settings">
      <div className="min-h-screen bg-gray-50/30 relative z-10 ">
        <main className="container mx-auto py-8 px-2 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Profile Summary */}
            <Card className="md:col-span-4">
              <CardContent className="px-4 sm:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-[#C6080A]">
                    <AvatarImage
                      src={
                        userDetails?.avatar ||
                        "/placeholder.svg?height=96&width=96"
                      }
                      alt={userDetails?.name}
                    />
                    <AvatarFallback className="text-2xl bg-[#C6080A] text-white">
                      {userDetails?.name
                        ?.split(" ")
                        ?.map((n) => n[0])
                        ?.join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {userDetails?.name}
                        </h2>
                        <p className="text-gray-500">{userDetails?.email}</p>
                        <p className="text-gray-500">{userDetails?.number}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              userDetails?.isOnline ? "default" : "outline"
                            }
                            className={
                              userDetails?.isOnline ? "bg-green-500" : ""
                            }
                          >
                            {userDetails?.isOnline ? "Online" : "Offline"}
                          </Badge>
                          <Badge className="bg-[#C6080A]">
                            {userDetails?.role?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          className="bg-[#C6080A] hover:bg-[#a50709] cursor-pointer"
                          onClick={() => setIsUpdateModalOpen(true)}
                        >
                          Update Profile
                        </Button>
                        <Button
                          className="bg-[#C6080A] hover:bg-[#a50709] flex items-center gap-1 cursor-pointer"
                          onClick={() => handleLogout()}
                        >
                          Logout
                          <RiLogoutCircleRFill className="h-5 w-5 text-white" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-[#C6080A]" />
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-medium">{joinDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-[#C6080A]" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">
                            {userDetails?.addressDetails?.city},{" "}
                            {userDetails?.addressDetails?.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-[#C6080A]" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Payment Method
                          </p>
                          <p className="font-medium">Bank Account</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="flex flex-col">
                    {[
                      {
                        icon: <User className="h-5 w-5" />,
                        label: "Profile Information",
                        value: "profile",
                      },
                      {
                        icon: <ShoppingBag className="h-5 w-5" />,
                        label: "Orders History",
                        value: "orders",
                      },
                      {
                        icon: <Heart className="h-5 w-5" />,
                        label: "Favorites",
                        value: "favorites",
                      },
                      {
                        icon: <History className="h-5 w-5" />,
                        label: "Recently Viewed",
                        value: "recently-viewed",
                      },
                      {
                        icon: <Bell className="h-5 w-5" />,
                        label: "Notifications",
                        value: "notifications",
                        // badge: notificationCount,
                      },
                      {
                        icon: <Percent className="h-5 w-5" />,
                        label: "Coupons",
                        value: "coupons",
                      },
                      {
                        icon: <Gift className="h-5 w-5" />,
                        label: "Refer & Earn",
                        value: "refer",
                      },
                      {
                        icon: <Users className="h-5 w-5" />,
                        label: "Affiliated Program",
                        value: "affiliate",
                      },
                      {
                        icon: <MessageSquare className="h-5 w-5" />,
                        label: "Chat with Support",
                        // badge: 3,
                        value: "chat",
                      },
                      {
                        icon: <Mail className="h-5 w-5" />,
                        label: "Support",
                        value: "support",
                      },
                    ].map((item, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="justify-start h-12 px-4 rounded-none relative cursor-pointer"
                        onClick={() => {
                          item.value && setActiveTab(item.value);
                        }}
                      >
                        <div className="flex items-center w-full">
                          <span className="mr-3 text-[#C6080A]">
                            {item.icon}
                          </span>
                          {item.label}
                          {item.badge && (
                            <Badge className="ml-auto bg-[#C6080A]">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </div>
                      </Button>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Region</h3>
                    <RegionSelector
                      defaultRegion={userDetails?.addressDetails?.country}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Language</h3>
                    <LanguageSelector defaultLanguage="English" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Currency</h3>
                    <CurrencySelector defaultCurrency="EUR" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="profile" className={"cursor-pointer"}>
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="orders" className={"cursor-pointer"}>
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className={"cursor-pointer"}>
                    Favorites
                  </TabsTrigger>
                  <TabsTrigger value="chat" className={"cursor-pointer"}>
                    Chat
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="space-y-6">
                  <OrdersHistory userId={userId} />
                </TabsContent>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Your personal and contact information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Full Name
                          </h3>
                          <p className="font-medium">{userDetails?.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Email
                          </h3>
                          <p className="font-medium">{userDetails?.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Phone
                          </h3>
                          <p className="font-medium">{userDetails?.number}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Role
                          </h3>
                          <p className="font-medium capitalize">
                            {userDetails?.role}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-3">
                          Address Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              Address
                            </h3>
                            <p className="font-medium">
                              {userDetails?.addressDetails?.address}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              City
                            </h3>
                            <p className="font-medium">
                              {userDetails?.addressDetails?.city}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              State
                            </h3>
                            <p className="font-medium">
                              {userDetails?.addressDetails?.state}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              Country
                            </h3>
                            <p className="font-medium">
                              {userDetails?.addressDetails?.country}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              Postal Code
                            </h3>
                            <p className="font-medium">
                              {userDetails?.addressDetails?.pincode}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-3">
                          Bank Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              Account Holder
                            </h3>
                            <p className="font-medium">
                              {userDetails?.bankDetails?.accountHolder}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              Account Number
                            </h3>
                            <p className="font-medium">
                              ••••••
                              {userDetails?.bankDetails?.accountNumber?.slice(
                                -4
                              )}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              IFSC Code
                            </h3>
                            <p className="font-medium">
                              {userDetails?.bankDetails?.ifscCode}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              CVV
                            </h3>
                            <p className="font-medium">
                              {userDetails?.bankDetails?.cvv}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              Expiry Date
                            </h3>
                            <p className="font-medium">
                              {formatDate(userDetails?.bankDetails?.expiryDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="favorites">
                  <FavoritesSection />
                </TabsContent>

                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Your recent actions and updates
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {[
                          {
                            icon: <RefreshCw className="h-5 w-5" />,
                            title: "Profile Updated",
                            description: "You updated your profile information",
                            date: "2 days ago",
                          },
                          {
                            icon: <ShoppingBag className="h-5 w-5" />,
                            title: "Order Placed",
                            description: "You placed an order #ORD-7895",
                            date: "1 week ago",
                          },
                          {
                            icon: <Star className="h-5 w-5" />,
                            title: "Review Submitted",
                            description: "You left a review for Product XYZ",
                            date: "2 weeks ago",
                          },
                          {
                            icon: <Heart className="h-5 w-5" />,
                            title: "Item Added to Favorites",
                            description:
                              "You added Product ABC to your favorites",
                            date: "3 weeks ago",
                          },
                          {
                            icon: <Package className="h-5 w-5" />,
                            title: "Order Delivered",
                            description: "Your order #ORD-6543 was delivered",
                            date: "1 month ago",
                          },
                        ].map((activity, index) => (
                          <div key={index} className="flex">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                              <span className="text-[#C6080A]">
                                {activity?.icon}
                              </span>
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {activity?.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {activity?.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                {activity?.date}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recently-viewed">
                  <RecentlyViewedSection />
                </TabsContent>

                <TabsContent value="coupons">
                  <CouponsSection />
                </TabsContent>

                <TabsContent value="refer">
                  <ReferEarnSection />
                </TabsContent>

                <TabsContent value="affiliate">
                  <AffiliateSection />
                </TabsContent>

                <TabsContent value="chat">
                  <ChatSection user={userDetails} />
                </TabsContent>

                <TabsContent value="support">
                  <SupportSection />
                </TabsContent>
                <TabsContent value="notifications">
                  <NotificationSection user={userDetails} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>

        {/* Update Profile Modal */}
        <UpdateProfileModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          user={userDetails}
          getUserDetails={getUserDetails}
        />
      </div>
    </MainLayout>
  );
}
