'use client';

import React from 'react';
import CartContextProvider from '../Hooks/UseCartHook';

function CartProvider({ children }) {
  return <CartContextProvider>{children}</CartContextProvider>;
}

export default CartProvider;
