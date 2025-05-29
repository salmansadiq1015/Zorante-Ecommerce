"use client";

import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-200 border border-red-900/50 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: [0, -5, 0, 5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                <AlertTriangle
                  size={80}
                  className="text-red-500"
                  strokeWidth={1.5}
                />
              </motion.div>

              <motion.h1
                className="text-3xl font-bold text-black mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Oops! Something went wrong
              </motion.h1>

              <motion.p
                className="text-gray-600 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                We encountered an error while processing your request. Please
                try again or contact support if the problem persists.
              </motion.p>

              <motion.div
                className="w-full space-y-4 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-gray-300/50 border border-red-900/20 rounded-lg p-4 text-left">
                  <h3 className="text-sm font-medium text-red-400 mb-2">
                    Error Details
                  </h3>
                  <p className="text-xs font-mono text-gray-500 break-all">
                    Error Code: 500 | Server responded with an internal error.
                    Transaction could not be completed.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="w-full grid grid-cols-2 gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="border-gray-700 cursor-pointer text-gray-600 hover:bg-gray-800 hover:text-white"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Try Again
                </Button>

                <Link href="/" passHref>
                  <Button className="bg-gradient-to-r cursor-pointer from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border-none">
                    <ArrowLeft size={16} className="mr-2" />
                    Go Back
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="h-1 w-full bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500"
              initial={{ width: "0%" }}
              animate={{ width: "30%" }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link href="/contact" className="text-blue-400 hover:underline">
              Contact Support
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
