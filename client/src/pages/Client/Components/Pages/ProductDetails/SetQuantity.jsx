"use client";

/*This file under Maintance*/

import React from 'react';

const btnstyle = "border-[1.2px] border-slate-300 px-2 rounded cursor-pointer";

const SetQuantity = ({
  cartProduct,
  cartCounter,
  handelQuentityIncrease,
  handelQuentityDecrease,
}) => {
  return (
    <div className="flex gap-8 items-center">
      {cartCounter ? null : <div className="font-semibold">Quantity:</div>}
      <div className="flex gap-4 items-center text-base">
        <div onClick={handelQuentityDecrease} className={btnstyle}>-</div>
        <div>{cartProduct.quantity}</div>
        <div onClick={handelQuentityIncrease} className={btnstyle}>+</div>
      </div>
    </div>
  );
};

export default SetQuantity;
