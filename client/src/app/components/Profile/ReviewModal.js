"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FiLoader } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddReviewModal({ setShow, productId, setProductId }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // Add Review in Order
  const handleReview = async (e) => {
    e.preventDefault();
    if (review === "" || rating === 0) {
      toast.error("Please write a review.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/review/${productId}`,
        {
          review: review,
          rating: rating,
        }
      );
      if (data) {
        toast.success("Review submitted successfully.");
        setRating(0);
        setProductId("");
        setShow(false);
      } else {
        toast.error(response?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-200/70">
      <div className="relative w-full max-w-lg max-h-[95vh] mt-[4rem] overflow-y-auto shidden rounded-sm border border-red-800 bg-gray-50 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">Add Review</h2>
          <button
            onClick={() => {
              setShow(false);
              setRating(0);
              setProductId("");
            }}
            className="rounded-full p-1 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X size={20} className="text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleReview}>
          <div className="mb-4">
            <Label
              htmlFor="rating"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Rating
            </Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={`${
                      (hoveredRating ? hoveredRating >= star : rating >= star)
                        ? "fill-red-600 text-red-600"
                        : "text-red-500"
                    } transition-colors cursor-pointer`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <Label
              htmlFor="review"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Review
            </Label>

            <Textarea
              id="review"
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="bg-white border-gray-700 text-black placeholder-gray-500 min-h-[100px] w-full"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShow(false);
                setRating(0);
                setProductId("");
              }}
              className="border-gray-700 text-gray-600 cursor-pointer hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`bg-red-600 hover:bg-red-700 cursor-pointer text-white ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
              disabled={loading || review === ""}
            >
              Submit Review{" "}
              {loading && (
                <FiLoader className="h-5 w-5 animate-spin text-white" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
