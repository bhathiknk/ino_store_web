import React from "react";
import { TruncateText } from "../Utils/truncate";
import Rating from "@mui/material/Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";



const AddToCartButton = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 px-4  text-white bg-blue-600 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
      {label}
    </button>
  );
};



const ProductCard = ({ data }) => {
  const navigate = useNavigate();

  // Calculate average rating
  const calculateAverageRating = (reviews = []) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Compute average rating with default empty array
  const averageRating = calculateAverageRating(data.reviews || []);

  // Handle adding product to cart
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation to the product details page
    // Example logic: Dispatch action to add the product to the cart
    // You need to implement cart context or state management for handling this
    console.log('Add to cart:', data);
  };

  return (
    <div
      onClick={() => navigate(`/client-product/${data.id}`)}
      className="col-span-1 cursor-pointer border-[1px] border-slate-200 bg-slate-50 p-2 transition-transform duration-300 hover:scale-105 text-center text-small rounded-lg hover:shadow-sm"
    >
      <div className="flex flex-col items-center w-full gap-1">
        {/* Image */}
        <div className="aspect-square overflow-hidden relative w-full rounded-sm">
          <img
            src={data.images[0]} // Adjusted to reflect the new structure
            className="w-full h-full object-contain"
            alt={data.name}
          />
        </div>
        {/* Name */}
        <div className="mt-1 font-semibold text-md">{TruncateText(data.name, 25)}</div>
        {/* Category Description */}
        <div className="text-xs text-gray-600 mb-1">{TruncateText(data.categoryDescription, 40)}</div>
        {/* Ratings */}
        <div className="text-sm text-gray-600 mb-1">
          <Rating value={averageRating} readOnly size="small" />
        </div>
        {/* Reviews */}
        <div className="text-xs text-gray-500 mb-1">
          {data.reviews?.length || 0} review{data.reviews?.length !== 1 ? "s" : ""}
        </div>
        {/* Price */}
        <div className="text-md font-semibold mb-1">
          ${data.discountPrice ? data.discountPrice.toFixed(2) : data.basePrice.toFixed(2)}
          {data.isDiscount && (
            <span className="text-red-500 ml-1 text-xs">
              {data.discount} OFF
            </span>
          )}
        </div>
        {/* Stock Status */}
        <div className={`text-xs ${data.inStock ? "text-green-600" : "text-red-600"}`}>
          {data.inStock ? "In Stock" : "Out of Stock"}
        </div>
        {/* Add to Cart Button */}
        <div className="mt-1 w-full">
          <AddToCartButton 
            label="Add to Cart"
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
