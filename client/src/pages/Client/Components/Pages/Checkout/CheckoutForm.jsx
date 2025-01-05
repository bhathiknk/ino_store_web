import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MapPinIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '../Cart/CartContext';

function CheckoutForm() {
  const { cart, dispatch } = useCart();
  const [addressDetails, setAddressDetails] = useState({
    address: '',
    province: '',
    zipcode: '',
    contactNumber: '',
  });
  const [orderTotal, setOrderTotal] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To track loading state
  const navigate = useNavigate();

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
          }
        );

        if (response.data && response.data.length > 0) {
          const address = response.data[0];
          setAddressDetails({
            address: address.address || '',
            province: address.province || '',
            zipcode: address.zipcode || '',
            contactNumber: address.contactNumber || '',
          });
        } else {
          toast.error('No address found. Please add an address.');
        }
      } catch (err) {
        console.error('Fetch Address Error:', err);
        toast.error('Failed to fetch address details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddressDetails();
  }, []);

  // Calculate total price for cart items
  useEffect(() => {
    const total = cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity + (item.shippingCost || 0),
      0
    );
    setOrderTotal(total.toFixed(2));
  }, [cart]);

  // Handle order creation after successful PayPal payment
  const handleOrderCreation = async (paymentId, payerId) => {
    try {
      // Validate shipping details before sending
      const { address, province, zipcode, contactNumber } = addressDetails;
      if (!address || !province || !zipcode || !contactNumber) {
        throw new Error('Incomplete shipping details.');
      }

      const token = localStorage.getItem('userToken');
      const orderData = {
        products: cart.map((item) => ({
          product: item.id, // Ensure this matches your backend's expected field
          quantity: item.quantity,
        })),
        paymentMethod: 'PayPal',
        shippingDetails: {
          address,
          province,
          zipcode,
          contactNumber,
        },
        paymentId,
        payerId,
      };

      console.log('Order Data to be sent:', orderData); // Debugging

      const response = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        toast.success('Order saved successfully!');
        dispatch({ type: 'CLEAR_CART' });
        setShowSuccessModal(true);
      } else {
        throw new Error('Unexpected backend response');
      }
    } catch (err) {
      console.error('Order Creation Error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(`Order saving failed: ${err.response.data.message}`);
      } else {
        toast.error('Payment successful, but order saving failed.');
      }
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Loading address details...</div>
      </div>
    );
  }

  // Optional: Disable PayPal buttons if address details are incomplete
  const isShippingDetailsComplete =
    addressDetails.address &&
    addressDetails.province &&
    addressDetails.zipcode &&
    addressDetails.contactNumber;

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="container mx-auto px-12 py-20 max-w-7xl">
        <h1 className="text-5xl font-bold text-gray-900 text-center mb-16">
          Checkout Page
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* PayPal Button Section */}
          <div className="bg-white p-12 rounded-xl shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8 flex items-center space-x-4">
              <ShoppingCartIcon className="h-10 w-10 text-blue-500" />
              <span>Pay with PayPal</span>
            </h2>
            <PayPalScriptProvider
              options={{
                'client-id':
                  'ASywn340iQU7BjJuemulqqNRrsHxtm6MeYmXF9yyX2lmrGveAg5ITybweaNa3WbgCHCHb5j6yDCU2dIK',
                currency: 'USD',
              }}
            >
              <PayPalButtons
                data-testid="paypal-button"
                disabled={!isShippingDetailsComplete || cart.length === 0}
                style={{ layout: 'vertical' }}
                createOrder={(data, actions) => {
                  const formattedOrderTotal = parseFloat(orderTotal).toFixed(2);
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
                      details.payer.payer_id
                    );
                  } catch (err) {
                    console.error('Payment or Order Saving Error:', err);
                    toast.error('Payment processing failed. Please try again.');
                  }
                }}
                onError={(err) => {
                  console.error('PayPal Error:', err);
                  toast.error('Payment error. Please try again.');
                }}
              />
            </PayPalScriptProvider>
            {!isShippingDetailsComplete && (
              <div className="mt-4 text-red-500">
                Please ensure all shipping details are complete before
                proceeding.
              </div>
            )}
          </div>

          {/* Cart Items and Address Section */}
          <div className="bg-white p-12 rounded-xl shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              Shipping Address
            </h2>
            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <MapPinIcon className="h-8 w-8 text-blue-500" />
                <p className="text-xl text-gray-800">
                  <strong>Address:</strong> {addressDetails.address || 'N/A'}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
                <p className="text-xl text-gray-800">
                  <strong>Province:</strong> {addressDetails.province || 'N/A'}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-blue-500">📮</span>
                <p className="text-xl text-gray-800">
                  <strong>ZIP Code:</strong> {addressDetails.zipcode || 'N/A'}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <PhoneIcon className="h-8 w-8 text-blue-500" />
                <p className="text-xl text-gray-800">
                  <strong>Mobile Number:</strong>{' '}
                  {addressDetails.contactNumber || 'N/A'}
                </p>
              </div>
            </div>

            <hr className="my-12" />

            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              Cart Items
            </h2>
            {cart.length === 0 ? (
              <p className="text-lg text-gray-600">Your cart is empty.</p>
            ) : (
              <ul className="space-y-8">
                {cart.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-xl text-gray-900 font-medium">
                        {item.title}
                      </p>
                      <p className="text-lg text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xl text-gray-900">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-between items-center mt-12">
              <p className="text-2xl font-semibold text-gray-900">Total:</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {orderTotal}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-12 rounded-lg shadow-xl text-center max-w-lg w-full relative">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Order Successful!
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Your payment was successful and the order has been saved.
            </p>
            <button
              onClick={handleModalClose}
              className="px-8 py-4 bg-blue-500 text-white text-xl rounded-lg hover:bg-blue-600 transition duration-300"
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
