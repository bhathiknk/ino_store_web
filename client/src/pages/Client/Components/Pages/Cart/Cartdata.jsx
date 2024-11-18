import React from 'react';
import { useCart } from '../Cart/CartContext';
import ClientNavBar from '../../Nav/ClientNabBar';
import ClientFooter from '../../Footer/ClientFooter';
import { FaCcMastercard } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import {  FaXmark } from 'react-icons/fa6';
import { MdDelete } from "react-icons/md";

const Cart = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  // Calculate the total price of the cart, including shipping costs
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity) + (item.shippingCost || 0), 0);
  };

  // Calculate the subtotal (excluding shipping costs)
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Calculate the total shipping cost
  const calculateShippingCost = () => {
    return cart.reduce((total, item) => total + (item.shippingCost || 0), 0);
  };

  // Determine if any item has a shipping cost
  const hasShippingCost = cart.some(item => item.shippingCost && item.shippingCost > 0);

  // Handle clearing the entire cart
  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Handle removing a specific item from the cart
  const handleRemoveItem = (item) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item });
  };

  // Handle increasing the quantity of a specific item
  const handleQuantityIncrease = (item) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { ...item, quantity: item.quantity + 1 } });
  };

  // Handle decreasing the quantity of a specific item
  const handleQuantityDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { ...item, quantity: item.quantity - 1 } });
    }
  };

  // Round to two decimal places for display
  const roundToTwoDecimalPlaces = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };
   
   // Horizontal Line
  const HorizontalLine = () => {
    return <hr className="w-[200%] border-gray-300 " />; 
  };
  // Handle checkout button click Navigate to the client-address page
  const handleCheckoutBtn = () => {
    navigate('/client-address'); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <ClientNavBar />
      <main className="flex-grow py-6 md:py-8 lg:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Header */}
          <header className="text-3xl font-bold text-center mt-8 text-gray-800">
            Shopping Cart
          </header>

          {/* Cart Items Table */}
          <div className="grid grid-cols-6 text-sm gap-4 pb-2 items-center mt-8 mx-8 bg-white p-4 rounded shadow-md">
            {/* Table headers */}
            <div className="col-span-2 justify-self-start font-bold text-gray-600">
              Product
            </div>
            <div className="justify-self-center font-bold text-gray-600">
              Price
            </div>
            <div className="justify-self-center font-bold text-gray-600">
              Quantity
            </div>
            <div className="justify-self-center font-bold text-gray-600">
              Shipping Cost
            </div>
            <div className="justify-self-center font-bold text-gray-600">
              Total
            </div>

            {/* Render cart items */}
            {cart.map((item, index) => (
              <React.Fragment key={index}>
                {/* Product details */}
                <div className="col-span-2 justify-self-start flex items-center">
                  <img
                    src={`http://localhost:5000${item.image}`} // Item image pass to the cart
                    alt={item.title}
                    className="w-16 h-16 mr-4 rounded border"
                  />
                  <div className="flex flex-col">
                    <span className="text-gray-800">{item.title}</span>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="mt-2 py-2 px-2 w-20 text-xs rounded bg-red-700 text-white hover:text-white hover:bg-gray-900 transition duration-300 ease-in-out flex items-center justify-center"
                    >
                      <FaXmark className="text-sm mr-1" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                {/* Product price */}
                <div className="justify-self-center text-gray-800 font-sm">
                  Rs.{roundToTwoDecimalPlaces(item.price).toFixed(2)}
                </div>
                {/* Quantity controls */}
                <div className="justify-self-center flex items-center space-x-2 text-gray-800">
                  <button
                    onClick={() => handleQuantityDecrease(item)}
                    className="px-3 py-1 bg-gray-300 rounded-l text-gray-800 hover:bg-gray-400 transition duration-300 ease-in-out"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b border-gray-300">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityIncrease(item)}
                    className="px-3 py-1 bg-gray-300 rounded-r text-gray-800 hover:bg-gray-400 transition duration-300 ease-in-out"
                  >
                    +
                  </button>
                </div>
                {/* Shipping cost */}
                <div className="justify-self-center text-gray-800 font-kanit">
                  {item.shippingCost > 0
                    ? `Rs. ${roundToTwoDecimalPlaces(item.shippingCost).toFixed(
                        2
                      )}`
                    : "Rs. 0.00"}
                </div>
                {/* Total price for the item */}
                <div className="justify-self-center text-gray-800 font-kanit">
                  Rs.
                  {roundToTwoDecimalPlaces(
                    item.price * item.quantity + (item.shippingCost || 0)
                  ).toFixed(2)}
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Cart Summary and Actions */}
          <div className="border-t-[1.5px] border-gray-200 py-4 flex flex-col md:flex-row justify-between items-center gap-4 mt-4 mx-8">
            {/* Clear Cart Button */}
            <button
              onClick={handleClearCart}
              className="ml-5 flex items-center justify-center rounded-md bg-red-500 text-white w-[120px] border-none hover:bg-red-600 transition duration-500 ease-in-out py-3 "
            >
              <MdDelete className="text-base mr-2" />
              Clear Cart
            </button>

            {/* Order Summary */}
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
              <div className="text-lg font-semibold text-gray-800 mb-8 mt-2 bg-black text-white rounded-md py-1 shadow-md text-center">
                Order Summary
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="mt-6 mb-6">
                    <td className="text-gray-600 text-base">Sub Total:</td>
                    <td className="text-center font-kanit text-base">
                      Rs. {calculateSubtotal().toFixed(2)}
                    </td>
                  </tr>
                  <HorizontalLine />
                  <tr className="mt-6 mb-6">
                    <td className="text-gray-600 text-base">Shipping Cost:</td>
                    <td className="text-center font-kanit text-base ">
                      {hasShippingCost
                        ? `Rs. ${roundToTwoDecimalPlaces(
                            calculateShippingCost()
                          ).toFixed(2)}`
                        : "Rs. 0.00"}
                    </td>
                  </tr>
                  <HorizontalLine />
                  <tr className="mt-6 mb-6">
                    <td
                      className="text-gray-600 col-span-2 text-center"
                      colSpan="2"
                    >
                      {/*aditional*/}
                    </td>
                  </tr>

                  <tr className="mt-6 mb-6">
                    <td className="text-gray-600 font-bold text-lg">Total:</td>
                    <td className="text-center font-kanit font-bold text-lg">
                      Rs. {roundToTwoDecimalPlaces(calculateTotal()).toFixed(2)}
                    </td>
                  </tr>
                  <HorizontalLine />
                </tbody>
              </table>
              <button
                onClick={handleCheckoutBtn}
                className="rounded-md bg-slate-700 text-white w-full border-none hover:bg-slate-900 transition duration-500 ease-in-out py-2 mt-4 flex items-center justify-center hover:shadow-md transition-500"
              >
                <FaCcMastercard className="mr-3 text-xl" /> Checkout
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <ClientFooter />
    </div>
  );
};

export default Cart;
