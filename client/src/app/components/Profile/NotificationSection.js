import { useAuth } from "@/app/content/authContent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Badge, Bell, Check, CheckCheck, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function NotificationSection({ user }) {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Handle Notifications
  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/all/user/${user._id}`
      );
      console.log("datanotifications", data);
      if (data) {
        setNotifications(data.notifications.reverse());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [user]);

  // Mark Notification as Read
  const markNotificationAsRead = async (id) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notification/read/${id}`
      );
      if (data) {
        fetchNotifications();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Update notification count based on unread notifications
    const unreadCount = notifications.filter(
      (notification) => notification.status === "unread"
    ).length;
    // setNotificationCount(unreadCount)
  }, [notifications]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const markAsRead = (id) => {
    markNotificationAsRead(id);
    setNotifications(
      notifications.map((notification) =>
        notification._id === id
          ? { ...notification, status: "read" }
          : notification
      )
    );
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (notification.status === "unread") {
      markAsRead(notification._id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <div className="h-9 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-5 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="h-16 w-full bg-gray-200 rounded-md animate-pulse mt-2"></div>
                <div className="flex justify-between items-center mt-3">
                  <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Stay updated with important information and alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedNotification ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNotification(null)}
                className="flex items-center gap-1"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back to notifications
              </Button>
              <div className="text-sm text-gray-500">
                {formatDate(selectedNotification.createdAt)}
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-4">
                {selectedNotification.subject}
              </h3>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: selectedNotification.context,
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="flex items-center gap-1 cursor-pointer"
                disabled={!notifications.some((n) => n.status === "unread")}
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button> */}
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-500">
                  No notifications
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  You&apos;re all caught up!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      notification.status === "unread"
                        ? "border-l-4 border-l-[#C6080A]"
                        : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-medium ${
                          notification.status === "unread"
                            ? "text-[#C6080A]"
                            : ""
                        }`}
                      >
                        {notification.subject}
                      </h3>
                      {notification.status === "unread" && (
                        <Badge className="text-[#C6080A] ">New</Badge>
                      )}
                    </div>

                    <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {notification.context.replace(/<[^>]*>/g, "")}
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>

                      {notification.status === "unread" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs flex items-center gap-1 text-[#C6080A] hover:text-[#a50709]"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                        >
                          <Check className="h-3 w-3" />
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
