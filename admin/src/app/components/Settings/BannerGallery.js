import Image from "next/image";
import { PlusCircle, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";

export default function BannerGallery({ bannerData, fetchBanners }) {
  // ------Delete Banner------>
  const handleDeleteConfirmation = (bannerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(bannerId);
        Swal.fire("Deleted!", "Banner has been deleted.", "success");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/banners/delete/banner/${id}`
      );
      if (data) {
        fetchBanners();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="relative bg-white rounded-md shadow p-3 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {bannerData.map((banner) => (
          <div
            key={banner._id}
            className="relative w-full h-[13rem] overflow-hidden rounded-lg  hover:shadow-md border-2 border-red-300  transition-transform duration-300 hover:scale-105 group"
          >
            <Image
              src={banner.image}
              alt={`Banner-${banner._id}`}
              layout="fill"
              // sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-full hover:scale-110 transition-all duration-500 ease-in-out"
              unoptimized
              onError={(e) =>
                console.error("Failed to load image:", banner.image)
              }
            />

            <button
              onClick={() => handleDeleteConfirmation(banner._id)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Delete banner ${banner.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
