// src/pages/Client/Components/Pages/Checkout/CheckoutForm.jsx

import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../Cart/CartContext';

function CheckoutForm() {
  const { cart, dispatch } = useCart();
  const [addressDetails, setAddressDetails] = useState({
    address: '',
    province: '',
    zip: '',
    mobile: '',
  });
  const [orderTotal, setOrderTotal] = useState(0);
  // Removed 'isLoading' to fix 'no-unused-vars' warning
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success popup state
  const navigate = useNavigate(); // React Router navigate hook

  // Fetch address details on component mount
  useEffect(() => {
    const fetchAddressDetails = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get(
          'http://localhost:5000/api/address/user',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data && response.data.length > 0) {
          const address = response.data[0];
          setAddressDetails({
            address: address.address,
            province: address.province,
            zip: address.zipcode,
            mobile: address.contactNumber,
          });
        }
      } catch (err) {
        toast.error('Failed to fetch address details');
      }
    };

    fetchAddressDetails();
  }, []);

  // Calculate total price for cart items
  useEffect(() => {
    const total = cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity + (item.shippingCost || 0),
      0,
    );
    setOrderTotal(total.toFixed(2));
  }, [cart]);

  // Handle order creation after successful PayPal payment
  const handleOrderCreation = async (paymentId, payerId) => {
    try {
      const token = localStorage.getItem('userToken');
      const orderData = {
        products: cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        paymentMethod: 'PayPal',
        shippingDetails: {
          address: addressDetails.address,
          province: addressDetails.province,
          zipcode: addressDetails.zip,
          contactNumber: addressDetails.mobile,
        },
        paymentId,
        payerId,
      };

      const response = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 201) {
        toast.success('Order saved successfully!');
        dispatch({ type: 'CLEAR_CART' }); // Clear the cart
        setShowSuccessModal(true); // Show success modal
      } else {
        throw new Error('Unexpected backend response');
      }
    } catch (err) {
      console.error('Order Creation Error:', err);
      toast.error('Payment successful, but order saving failed.');
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <main className="flex-grow py-6 md:py-8 lg:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <header className="text-3xl font-bold text-center mt-8 text-gray-800">
            Checkout
          </header>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PayPal Button on the left */}
            <div className="flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-md">
              <PayPalScriptProvider
                options={{
                  'client-id':
                    'ASywn340iQU7BjJuemulqqNRrsHxtm6MeYmXF9yyX2lmrGveAg5ITybweaNa3WbgCHCHb5j6yDCU2dIK',
                  currency: 'USD',
                }}
              >
                <PayPalButtons
                  createOrder={(data, actions) => {
                    const formattedOrderTotal =
                      parseFloat(orderTotal).toFixed(2);
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: formattedOrderTotal,
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const details = await actions.order.capture();
                      await handleOrderCreation(
                        details.id,
                        details.payer.payer_id,
                      );
                    } catch (err) {
                      console.error('Payment or Order Saving Error:', err);
                      toast.error(
                        'Payment processing failed. Please try again.',
                      );
                    }
                  }}
                  onError={(err) => {
                    console.error('PayPal Error:', err);
                    toast.error('Payment error. Please try again.');
                  }}
                />
              </PayPalScriptProvider>
            </div>

            {/* Cart items and Shipping Address on the right */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Shipping Address
              </h2>
              <p className="text-gray-600">
                <strong>Address:</strong> {addressDetails.address || 'N/A'}
              </p>
              <p className="text-gray-600">
                <strong>Province:</strong> {addressDetails.province || 'N/A'}
              </p>
              <p className="text-gray-600">
                <strong>ZIP Code:</strong> {addressDetails.zip || 'N/A'}
              </p>
              <p className="text-gray-600">
                <strong>Mobile Number:</strong> {addressDetails.mobile || 'N/A'}
              </p>
              <hr className="my-4" />
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Cart Items
              </h2>
              <ul className="space-y-4">
                {cart.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-800 font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-gray-800">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-semibold text-gray-800">Total:</p>
                <p className="text-lg font-bold text-gray-800">
                  Rs. {orderTotal}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
          style={{
            pointerEvents: 'auto',
            zIndex: 10000, // Very high z-index to stay above PayPal iframe
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Order Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment was successful and the order has been saved.
            </p>
            <button
              onClick={handleModalClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutForm;
