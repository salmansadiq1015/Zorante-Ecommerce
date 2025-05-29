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
          size={16}
          className="cursor-pointer"
          color="#c6080a"
        />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <BsStarHalf
          key={i}
          size={14}
          className="cursor-pointer"
          color="#c6080a"
        />
      );
    } else {
      stars.push(
        <AiOutlineStar
          key={i}
          size={16}
          className="cursor-pointer"
          color="#c6080a"
        />
      );
    }
  }
  return <div className="flex ">{stars}</div>;
};

export default Ratings;
