import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const [gotoPage, setGotoPage] = useState("");

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap flex-col-reverse sm:flex-row mt-4 text-white">
      <div className="flex items-center justify-center gap-2">
        {/* Prev Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={` ${
            currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
          } p-2 text-red-500 bg-red-100  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 hover:text-white transition-all duration-300`}
          style={{
            clipPath:
              " polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => {
          if (
            index === 0 ||
            index === totalPages - 1 ||
            Math.abs(currentPage - index - 1) <= 1
          ) {
            return (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                  currentPage === index + 1
                    ? "bg-red-600 text-white"
                    : "text-gray-800 "
                }`}
              >
                {index + 1}
              </button>
            );
          } else if (index === 1 || index === totalPages - 2) {
            return (
              <span key={index} className="px-2 text-gray-700">
                ...
              </span>
            );
          }
          return null;
        })}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"
          } p-2 text-red-500 bg-red-100 cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 hover:text-white transition-all duration-300`}
          style={{
            clipPath:
              " polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Go to Page */}
      <div className="flex items-center gap-2 text-red-500 text-[15px]">
        <span>Go to</span>
        <input
          type="number"
          className="w-16 text-[14px] text-center bg-transparent py-1 px-1 border border-red-500 text-black outline-none"
          value={gotoPage}
          placeholder="Page No."
          onChange={(e) => setGotoPage(e.target.value)}
          onBlur={() => handlePageChange(parseInt(gotoPage))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && gotoPage) {
              handlePageChange(parseInt(gotoPage));
            }
          }}
        />
        <span>Page</span>
      </div>
    </div>
  );
};

export default Pagination;
