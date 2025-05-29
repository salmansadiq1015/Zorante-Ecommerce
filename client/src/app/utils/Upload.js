import axios from "axios";
import toast from "react-hot-toast";

export const uploadImage = async (image, setAvatar, setLoading) => {
  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/upload/file`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setAvatar(data.files[0]);
  } catch (error) {
    console.error(error);
    toast.error("Failed to upload file");
  } finally {
    setLoading(false);
  }
};
