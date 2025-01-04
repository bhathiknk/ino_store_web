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
        const token = localStorage.getItem('userToken'); // Use the correct key
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
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100">
      <div className="flex flex-col min-h-screen">
        <ClientNavBar />
        <main className="flex-grow">
          <ToastContainer />

          <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              My Orders
            </h1>

            {orders.length === 0 ? (
              <div className="text-center text-gray-600">
                <p>You have no orders yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white shadow-lg rounded-lg p-6"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                      Order ID: {order._id}
                    </h3>
                    <p className="text-gray-800 mb-2">
                      <span className="font-semibold">Total Amount:</span> LKR{' '}
                      {order.totalAmount}
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
                    <h4 className="text-lg font-medium mb-2">Products:</h4>
                    <ul className="space-y-2">
                      {order.products.map((item) => (
                        <li
                          key={item.product._id}
                          className="flex items-center space-x-4"
                        >
                          {item.product.images &&
                            item.product.images.length > 0 && (
                              <img
                                src={`http://localhost:5000${item.product.images[0]}`}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded-lg shadow-md"
                              />
                            )}
                          <div>
                            <p className="text-gray-800 font-semibold">
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
