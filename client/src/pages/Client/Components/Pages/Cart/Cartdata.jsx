import React from 'react';
import { useCart } from '../Cart/CartContext';
import ClientNabBar from '../../Nav/ClientNabBar';
import ClientFooter from '../../Footer/ClientFooter';

const Cart = () => {
  const { cart, dispatch } = useCart();

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

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
    if (item.quantity > 1) { // Ensure quantity does not go below 1
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { ...item, quantity: item.quantity - 1 } });
    }
  };

  // Rounded decimal places in subtotal
  const roundToTwoDecimalPlaces = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ClientNabBar />
      <main className="flex-grow py-6 md:py-8 lg:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <header className="text-3xl font-bold text-center mt-8 text-gray-800">
            Shopping Cart
          </header>
          <div className="grid grid-cols-5 text-sm gap-4 pb-2 items-center mt-8 mx-8 bg-white p-4 rounded shadow-md">
            {/* Table headers */}
            <div className="col-span-2 justify-self-start font-semibold text-gray-600">Product</div>
            <div className="justify-self-center font-semibold text-gray-600">Price</div>
            <div className="justify-self-center font-semibold text-gray-600">Quantity</div>
            <div className="justify-self-center font-semibold text-gray-600">Total</div>
            
            {/* Render cart items */}
            {cart.map((item, index) => (
              <React.Fragment key={index}>
                {/* Product details */}
                <div className="col-span-2 justify-self-start flex items-center">
                  <img
                    src={`http://localhost:5000${item.image}`} // Ensure URL is correct
                    alt={item.title}
                    className="w-16 h-16 mr-4 rounded border"
                  />
                  <div className="flex flex-col">
                    <span className="text-gray-800">{item.title}</span>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="mt-2 py-1 px-2 w-20 text-xs rounded bg-red-700 text-white hover:text-white hover:bg-gray-900 transition duration-300 ease-in-out"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {/* Product price */}
                <div className="justify-self-center text-gray-800">Rs.{item.price}</div>
                {/* Quantity controls */}
                <div className="justify-self-center flex items-center space-x-2 text-gray-800">
                  <button
                    onClick={() => handleQuantityDecrease(item)}
                    className="px-3 py-1 bg-gray-300 rounded-l text-gray-800 hover:bg-gray-400 transition duration-300 ease-in-out"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b border-gray-300">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityIncrease(item)}
                    className="px-3 py-1 bg-gray-300 rounded-r text-gray-800 hover:bg-gray-400 transition duration-300 ease-in-out"
                  >
                    +
                  </button>
                </div>
                {/* Total price for the item */}
                <div className="justify-self-center text-gray-800">Rs.{roundToTwoDecimalPlaces(item.price * item.quantity).toFixed(2)}</div>
              </React.Fragment>
            ))}
          </div>
          
          {/* Cart summary and actions */}
          <div className="border-t-[1.5px] border-gray-200 py-4 flex flex-col md:flex-row justify-between items-center gap-4 mt-4 mx-8">
            {/* Clear Cart button */}
            <button
              onClick={handleClearCart}
              className="
                rounded-md 
                bg-red-500
                text-white
                w-[120px] /* Fixed width */
                border-none
                hover:bg-red-600
                transition
                duration-500
                ease-in-out
                py-2"
            >
              Clear Cart
            </button>
            {/* Subtotal and Checkout button */}
            <div className="text-lg font-semibold text-gray-800 flex flex-col gap-2 items-center md:items-start">
              <div>
                <span>Sub Total: </span>
                <span>Rs. {calculateTotal().toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600">Taxes and shipping will be calculated at checkout</div>
              <button
                className="
                  rounded-md 
                  bg-slate-700
                  text-white
                  w-[318px] /* Fixed width */
                  border-none
                  hover:bg-slate-900
                  transition
                  duration-500
                  ease-in-out
                  py-2"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </main>
      <ClientFooter />
    </div>
  );
};

export default Cart;
