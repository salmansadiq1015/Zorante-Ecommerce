"use client";

import { Search, Home, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 border border-blue-900/50 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative mb-8 w-full h-40 flex items-center justify-center"
              >
                {/* Animated 404 text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <motion.div
                      className="text-[120px] font-bold text-gray-800/20 absolute -top-[60px] -left-[20px] select-none"
                      initial={{ y: 0 }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      404
                    </motion.div>
                    <motion.div
                      className="text-[120px] font-bold text-blue-500/10 absolute -top-[50px] -left-[10px] select-none"
                      initial={{ y: 0 }}
                      animate={{ y: [0, -15, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.5,
                      }}
                    >
                      404
                    </motion.div>
                  </div>
                </div>

                {/* Foreground content */}
                <div className="relative z-10 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-500 mb-2"
                  >
                    404
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="h-1 w-20 bg-gradient-to-r from-blue-500 to-red-500 rounded-full mb-2"
                  />
                </div>
              </motion.div>

              <motion.h1
                className="text-3xl font-bold text-white mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Page Not Found
              </motion.h1>

              <motion.p
                className="text-gray-400 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </motion.p>

              <motion.div
                className="w-full space-y-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative">
                  <Input
                    placeholder="Search for products, pages, etc."
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 pl-10 pr-4 py-6"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/" passHref>
                    <Button className="w-full bg-gradient-to-r h-[2.8rem] cursor-pointer from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border-none">
                      <Home size={16} className="mr-2" />
                      Back to Home
                    </Button>
                  </Link>

                  <Link href="/products" passHref>
                    <Button
                      variant="outline"
                      className="w-full border-gray-700 h-[2.8rem] text-gray-500 cursor-pointer hover:bg-gray-800 hover:text-white"
                    >
                      Browse Products
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="h-1 w-full bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-red-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <h3 className="text-gray-400 font-medium mb-4">Popular Pages</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {["Products", "Categories", "Account", "Orders", "Support"].map(
              (item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="px-3 py-1 bg-gray-800/50 hover:bg-gray-800 text-sm text-gray-400 hover:text-white rounded-full transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
