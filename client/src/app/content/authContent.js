"use client";
import { useState, useEffect, useContext, createContext, useMemo } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { authUri, productsURI } from "../utils/ServerURI";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [activationToken, setActivationToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const router = useRouter();
  const [oneClickBuyProduct, setOneClickBuyProduct] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "price_asc",
  });

  //   Token Check
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("@ayoob");
    const token = Cookies.get("@ayoob");

    if (data) {
      const parseData = JSON.parse(data);
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: parseData?.user,
        token: token,
      }));
    }
  }, []);

  //   Check Expiry token

  // Fetch All Products
  // http://localhost:8000/api/v1/products/all/products?page=1&category=68105c2d2c66a6b42f0ea53e&minPrice=1&maxPrice=2000&sortBy=price_asc
  const fetchProducts = async () => {
    const { data } = await axios.get(`${productsURI}/all/products`);
    return data.products;
  };

  const { data: products, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // const fetchProducts = async ({
  //   page = 1,
  //   category,
  //   minPrice,
  //   maxPrice,
  //   sortBy,
  // }) => {
  //   const { data } = await axios.get(`${productsURI}/all/products`, {
  //     params: { page, category, minPrice, maxPrice, sortBy },
  //   });

  //   return data.products;
  // };

  // // Usage inside useQuery:
  // const { data: products, isFetching } = useQuery({
  //   queryKey: ["products", filters], // filters = { page, category, etc. }
  //   queryFn: () => fetchProducts(filters),
  //   staleTime: 5 * 60 * 1000,
  //   refetchOnWindowFocus: false,
  // });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setSelectedProduct(JSON.parse(savedCart));
    }
  }, []);

  // Get One Click Buy Product
  useEffect(() => {
    const savedProduct = localStorage.getItem("oneClickBuyProduct");
    if (savedProduct) {
      setOneClickBuyProduct(JSON.parse(savedProduct));
    }
  }, []);

  // Update UserInfo
  const updateUserInfo = async () => {
    try {
      const { data } = await axios.get(
        `${authUri}/userDetail/${auth?.user?._id}`
      );
      setAuth({ ...auth, user: data.user });
      localStorage.setItem("@ayoob", JSON.stringify({ user: data.user }));
    } catch (error) {
      console.log(error);
    }
  };

  // Update Refresh Token

  const refreshToken = async () => {
    if (!auth?.token) return;
    try {
      const { data } = await axios.get(
        `${authUri}/refresh`,
        {},
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );

      Cookies.set("@ayoob", data.accessToken, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
        path: "/",
      });
      setAuth((prevAuth) => ({ ...prevAuth, token: data.accessToken }));
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  useEffect(() => {
    if (auth?.user?._id) {
      updateUserInfo();
      refreshToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user?._id]);

  // Remove Expired Token

  useEffect(() => {
    const checkTokenExpiry = () => {
      try {
        const token = Cookies.get("@ayoob");
        if (!token) {
          setAuth({ user: null, token: "" });
          localStorage.removeItem("@ayoob");
          Cookies.remove("@ayoob");
          return;
        }

        const parts = token.split(".");
        if (parts.length !== 3) throw new Error("Invalid token format");

        const decodedPayload = atob(parts[1]);
        const decodedToken = JSON.parse(decodedPayload);

        // Check token expiry
        if (decodedToken.exp * 1000 < Date.now()) {
          router.push("/authentication");
          setAuth({ user: null, token: "" });
          localStorage.removeItem("@ayoob");
          Cookies.remove("@ayoob");
        }
      } catch (error) {
        console.error("Error decoding token:", error.message);
        setAuth({ user: null, token: "" });
        localStorage.removeItem("auth");
        Cookies.remove("@ayoob");
      }
    };

    checkTokenExpiry();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        showAuth,
        setShowAuth,
        activationToken,
        setActivationToken,
        isLoading,
        setIsLoading,
        search,
        setSearch,
        products: products || [],
        isFetching,
        selectedProduct,
        setSelectedProduct,
        oneClickBuyProduct,
        setOneClickBuyProduct,
        filters,
        setFilters,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
