"use client";

import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/content/authContent";

export default function SuccessPage() {
  const { auth } = useAuth();
  const [count, setCount] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/profile/${auth?.user?._id}?tab=orders`);
          return 0;
        }
        localStorage.removeItem("oneClickBuyProduct");

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="relative">
          {/* Animated particles */}
          <div className="absolute inset-0 -z-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-500 rounded-full"
                initial={{
                  x: "50%",
                  y: "50%",
                  opacity: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-100 border border-blue-900/50 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="relative mb-6"
                >
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                  <CheckCircle
                    size={80}
                    className="text-green-500"
                    strokeWidth={1.5}
                  />
                  <motion.div
                    className="absolute top-0 right-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Sparkles size={24} className="text-yellow-400" />
                  </motion.div>
                </motion.div>

                <motion.h1
                  className="text-3xl font-bold text-black mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Success!
                </motion.h1>

                <motion.p
                  className="text-gray-400 mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Your order has been completed successfully. We&apos;ve
                  processed your request and everything is good to go.
                </motion.p>

                <motion.div
                  className="w-full space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href={`/profile/${auth?.user?._id}?tab=orders`}
                    passHref
                  >
                    <Button className="w-full bg-gradient-to-r h-[2.8rem] cursor-pointer from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border-none">
                      <ArrowLeft size={16} className="mr-2" />
                      Return to Dashboard
                    </Button>
                  </Link>

                  <p className="text-sm text-gray-500">
                    Redirecting in {count} seconds...
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="h-1 w-full bg-gray-200 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 10 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
