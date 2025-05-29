"use client";
import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // check token
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");

    if (data) {
      const parseData = JSON.parse(data);
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: parseData?.user,
        token: parseData?.token,
      }));
    }
  }, []);

  // // Refresh token on every page load
  const refreshToken = async () => {
    if (!auth.token) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/refresh`
      );
      console.log("data.accessToken:", data.accessToken);
      if (data.accessToken) {
        setAuth((prevAuth) => {
          const updatedAuth = {
            ...prevAuth,
            token: data.accessToken,
          };

          localStorage.setItem("auth", JSON.stringify(updatedAuth));

          return updatedAuth;
        });
      }
    } catch (error) {
      console.log("Error refreshing token:", error);
      if (error.response?.status === 404) {
        setAuth({ user: null, token: "" });
        localStorage.removeItem("auth");
      }
    }
  };

  useEffect(() => {
    refreshToken();

    // eslint-disable-next-line
  }, []);

  // // Get user info on every page load
  const getUserInfo = async () => {
    if (!auth.token) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/userinfo`
      );
      if (data) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          user: data.user,
        }));
      }
    } catch (error) {
      console.log("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    getUserInfo();

    // eslint-disable-next-line
  }, []);

  // Check token expiry
  useEffect(() => {
    const checkTokenExpiry = () => {
      const data = localStorage.getItem("auth");
      if (data) {
        const { token } = JSON.parse(data);
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const isExpired = decodedToken.exp * 1000 < Date.now();
        if (isExpired) {
          setAuth({ user: null, token: "" });
          localStorage.removeItem("auth");
        }
      }
    };
    checkTokenExpiry();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        refreshToken,
        getUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
