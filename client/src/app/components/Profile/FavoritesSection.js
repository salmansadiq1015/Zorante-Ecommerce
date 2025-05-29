import React, { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import axios from "axios";
import { productsURI } from "@/app/utils/ServerURI";
import ProductCard from "../ProductCard";

export default function FavoritesSection() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      console.log("favorites", favorites);

      try {
        let products = await Promise.all(
          favorites.map(async (fav) => {
            const { data } = await axios.get(
              `${productsURI}/product/detail/${fav}`
            );
            return data.product;
          })
        );

        setFavorites(products);
        // Do something with the products (e.g., update state)
      } catch (error) {
        console.error("Error fetching favorite products:", error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorites</CardTitle>
        <CardDescription>
          Products you&apos;ve saved to your wishlist
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites?.map((item) => (
            <ProductCard
              key={item._id}
              product={item}
              sale={true}
              tranding={true}
              isDesc={true}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
