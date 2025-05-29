import {
  ShoppingBag,
  Truck,
  ArrowLeftRight,
  Megaphone,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

export default function PromoBannerPage() {
  return (
    <div className=" bg-gray-50 flex flex-col">
      <div className="bg-red-50/80 border-b border-red-100 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex  overflow-x-auto shidden items-start justify-between text-red-700 text-xs sm:text-sm">
            {/* Mobile App */}
            <Link
              href="#download-app"
              className="flex items-center min-w-fit gap-1.5 py-2 px-2 hover:bg-red-100/50 transition-colors duration-200 group"
            >
              <Smartphone
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>Get our Mobile App</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-red-200/70"></div>

            {/* Insider */}
            <Link
              href="/top-sale"
              className="flex items-center min-w-fit gap-1.5 py-2 px-2 hover:bg-red-100/50 transition-colors duration-200 group"
            >
              <Megaphone
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>FASHIONINSIDER</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-red-200/70"></div>

            {/* Subscribe */}
            <Link
              href="#subscribe"
              className="flex items-center min-w-fit gap-1.5 py-2 px-2 hover:bg-red-100/50 transition-colors duration-200 group"
            >
              <ShoppingBag
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>Subscribe & Save</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-red-200/70"></div>

            {/* Free Shipping */}
            <Link
              href="#shipping"
              className="flex items-center min-w-fit gap-1.5 py-2 px-2 hover:bg-red-100/50 transition-colors duration-200 group"
            >
              <Truck
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>Free Shipping</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-red-200/70"></div>

            {/* Free Returns */}
            <Link
              href="/refund-policy"
              className="flex items-center min-w-fit gap-1.5 py-2 px-2 hover:bg-red-100/50 transition-colors duration-200 group"
            >
              <ArrowLeftRight
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span className="flex flex-col">
                <span>Free Returns</span>
                {/* <span className="text-[10px] text-red-500">
                  *US & Canada only
                </span> */}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
