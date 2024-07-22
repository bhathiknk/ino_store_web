import React from "react";
import { TruncateText } from "../Utils/truncate";
import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ data }) => {
  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Compute average rating
  const averageRating = calculateAverageRating(data.reviews);
  //user cliicked on product navigate to product detail page
  const navigate = useNavigate();

  return (
    //onclick event for when user click on the product it will navigate to product detils page
    <div
      onClick={() => navigate(`/product/${data.id}`)}
      className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-small"
    >
      <div className="flex flex-col items-center w-full gap-1">
        {/* Image */}
        <div className="aspect-square overflow-hidden relative w-full rounded-sm">
          <img
            src={data.images[0].image}
            className="w-full h-full object-contain"
            alt={data.name}
          />
        </div>
        {/* Name */}
        <div className="mt-4 font-semibold">{TruncateText(data.name)}</div>
        {/* Ratings defaulyt value :value={3.6} */}
        <div className="text-md text-gray-600">
          <Rating value={averageRating} />
        </div>
        {/* Reviews */}
        <div className="text-sm text-gray-500">
          {data.reviews.length} reviews
        </div>
        {/* Price */}
        <div className="text-lg font-semibold">${data.price}</div>
      </div>
    </div>
  );
};

export default ProductCard;
