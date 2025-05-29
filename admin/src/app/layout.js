"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import SocketHandler from "./context/SocketHandler";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} w-full min-h-screen bg-white  text-black`}
      >
        <AuthProvider>
          <main className="overflow-x-hidden">{children}</main>
          <Toaster />
          <SocketHandler />
          <Tooltip
            id="my-tooltip"
            place="bottom"
            effect="solid"
            className="!bg-gradient-to-r !from-red-500 !via-red-500 !to-yellow-500 !text-white !text-[11px] !py-1 !px-2"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
