'use client';

import React from 'react';

function AddToCartButton({
  label,
  disabled,
  outline,
  small,
  icon: Icon,
  custom,
  onClick,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`disabled:opacity-70
             disabled:cursor-not-allowed 
             rounded-md 
             hover:opacity-80
             transition 0.8s
             w-full
             border-slate-700
             flex items-center
             justify-center
             duration-700
             gap-2 
             ${outline ? 'bg-white' : 'bg-slate-700'}
             ${outline ? 'text-slate-700' : 'text-white'}
             ${small ? 'text-sm font-light' : 'text-md  font-semibold'}
             ${small ? 'py-1 px-2 border-[ 1px]' : 'py-3 px-4 border-2  '}
             ${custom || ''}`}
    >
      {Icon && <Icon size={20} />}
      {label}
    </button>
  );
}

export default AddToCartButton;
