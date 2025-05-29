import React, { FC } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";

const Ratings = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <AiFillStar
          key={i}
          size={20}
          className="mr-2 cursor-pointer"
          color="#f6b100"
        />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <BsStarHalf
          key={i}
          size={20}
          className="mr-2 cursor-pointer"
          color="#f6b100"
        />
      );
    } else {
      stars.push(
        <AiOutlineStar
          key={i}
          size={20}
          className="mr-2 cursor-pointer"
          color="#f6b100"
        />
      );
    }
  }
  return <div className="flex mt-1 800px:mt-0 ">{stars}</div>;
};

export default Ratings;
