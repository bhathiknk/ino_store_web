// src/pages/Client/Components/Pages/User/Orders.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientNavBar from '../../Nav/ClientNabBar';
import ClientFooter from '../../Footer/ClientFooter';
import 'tailwindcss/tailwind.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          'http://localhost:5000/api/orders/user',
          config
        );
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-3xl font-bold text-blue-600 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-red-500 text-center text-xl bg-white p-6 rounded-lg shadow-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <div className="flex flex-col min-h-screen">
        <ClientNavBar />
        <main className="flex-grow">
          <ToastContainer />

          <div className="container mx-auto px-6 py-12">
            <h1 className="text-5xl font-bold text-center text-gray-900 mb-12">
              My Orders
            </h1>

            {orders.length === 0 ? (
              <div className="text-center text-gray-600 text-lg bg-white p-6 rounded-lg shadow-lg">
                <p>You have no orders yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white shadow-xl rounded-lg p-8 hover:shadow-2xl transition-transform transform hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                      Order ID: {order._id}
                    </h3>
                    <p className="text-gray-800 mb-2">
                      <span className="font-semibold">Total Amount:</span> USD{' '}
                      {order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-gray-800 mb-2">
                      <span className="font-semibold">Payment Method:</span>{' '}
                      {order.paymentMethod}
                    </p>
                    <p className="text-gray-800 mb-2">
                      <span className="font-semibold">Order Status:</span>{' '}
                      {order.orderStatus}
                    </p>
                    <p className="text-gray-800 mb-4">
                      <span className="font-semibold">Placed On:</span>{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Products:
                    </h4>
                    <ul className="space-y-4">
                      {order.products.map((item) => (
                        <li
                          key={item.product._id}
                          className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm"
                        >
                          {item.product.images &&
                            item.product.images.length > 0 && (
                              <img
                                src={`http://localhost:5000${item.product.images[0]}`}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded-lg shadow-md mr-4"
                              />
                            )}
                          <div>
                            <p className="text-gray-800 font-semibold text-lg">
                              {item.product.name}
                            </p>
                            <p className="text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <ClientFooter />
      </div>
    </div>
  );
}
