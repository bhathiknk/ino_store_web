'use client';

import React from 'react';
import CartContextProvider from '../Hooks/UseCartHook';

const CartProvider = ({ children }) => {
  return (
    <CartContextProvider>
      {children}
    </CartContextProvider>
  );
};

export default CartProvider;
