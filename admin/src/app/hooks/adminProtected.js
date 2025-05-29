import React from "react";
import { useAuth } from "../context/authContext";
import Spinner from "../utils/Spinner";

export default function AdminProtected({ children }) {
  const { auth } = useAuth();

  if (
    !auth?.token &&
    (auth?.user?.role !== "admin" ||
      auth?.user?.role !== "agent" ||
      auth?.user?.role !== "superadmin")
  ) {
    return <Spinner />;
  }

  return <>{children}</>;
}
