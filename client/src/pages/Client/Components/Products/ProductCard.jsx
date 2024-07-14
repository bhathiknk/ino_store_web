import React from 'react';
import { TruncateText } from '../Utils/truncate'; 
import Rating from '@mui/material/Rating';

const ProductCard = ({ data }) => {

  return (
    <div className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-small">
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
        <div className="mt-4 font-semibold">
          {TruncateText(data.name)}
        </div>
        {/* Ratings */}
        <div className="text-md text-gray-600">
          <Rating value={3.6}/>
        </div>
        {/* Reviews */}
        <div className="text-sm text-gray-500">
               {data.reviews.length} reviews
        </div>
        {/* Price */}
        <div className="text-lg font-semibold">
          ${data.price}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
