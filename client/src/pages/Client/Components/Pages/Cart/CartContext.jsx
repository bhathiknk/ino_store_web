// CartContext.js
import React, { createContext, useReducer, useContext } from 'react';


// Create a context for the cart
const CartContext = createContext();

// Define a reducer to handle cart actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Add new item or update quantity if item already in cart
      const existingItemIndex = state.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const newState = [...state];
        newState[existingItemIndex] = {
          ...newState[existingItemIndex],
          quantity: newState[existingItemIndex].quantity + action.payload.quantity,
        };
        return newState;
      }
      return [...state, action.payload];

    case 'UPDATE_CART_ITEM':
      // Update quantity for a specific item
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

    case 'REMOVE_FROM_CART':
      // Remove a specific item from the cart
      return state.filter(item => item.id !== action.payload.id);

    case 'CLEAR_CART':
      // Clear the entire cart
      return [];

    default:
      return state;
  }
};

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the cart context
export const useCart = () => useContext(CartContext);
