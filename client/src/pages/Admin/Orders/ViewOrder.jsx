import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';

function ViewOrder() {
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('Processing');
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const navigate = useNavigate();

  const statusOptions = ['Processing', 'Packed', 'Shipped'];

  // Fetch Orders and Notifications
  useEffect(() => {
    const fetchOrdersAndNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const ordersResponse = await axios.get(
          'http://localhost:5000/api/orders/seller',
          config
        );
        setOrders(ordersResponse.data);

        const notificationsResponse = await axios.get(
          'http://localhost:5000/api/notifications',
          config
        );
        setNotifications(notificationsResponse.data);

        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchOrdersAndNotifications();

    const socket = io('http://localhost:5000');

    socket.on('orderCreated', (data) => {
      toast.info(data.message, {
        position: 'top-right',
        autoClose: 5000,
      });

      setNotifications((prev) => [
        ...prev,
        { _id: Date.now(), message: data.message, timestamp: new Date() },
      ]);
      setOrders((prevOrders) => [...prevOrders, ...data.orders]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle Dropdown Status Change
  const handleDropdownChange = (orderId, newStatus) => {
    setSelectedStatuses((prevStatuses) => ({
      ...prevStatuses,
      [orderId]: newStatus,
    }));
  };

  // Handle Status Update
  const handleStatusChange = async (orderId) => {
    const newStatus = selectedStatuses[orderId];
    if (!newStatus) {
      toast.error('Please select a new status before updating.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.put(
        'http://localhost:5000/api/orders/update-status',
        { orderId, status: newStatus },
        config
      );

      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      toast.success('Order status updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  // Filter Orders by Selected Tab
  const filteredOrders = orders.filter(
    (order) => order.orderStatus === selectedTab
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-bold text-blue-600">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-4 text-xl">
        Error: {error}
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen p-8">
      <ToastContainer />
      <div className="container mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/Admin/ProductPage')}
            className="flex items-center text-blue-600 font-bold text-lg"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search by Order ID"
              className="border p-4 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() =>
                toast.info(`Searching for order ID: ${searchTerm}`, {
                  position: 'top-right',
                })
              }
              className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-bold"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Notifications Section */}
          <div className="bg-gray-200 shadow-md rounded-xl p-8 w-full md:w-1/3">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              Notifications
            </h2>
            <ul className="space-y-6">
              {notifications.map((notification) => (
                <li key={notification._id} className="border-b pb-4">
                  <p className="text-lg">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Orders Section */}
          <div className="bg-gray-50 shadow-md rounded-xl p-8 w-full md:w-2/3">
            <div className="flex justify-center space-x-4 mb-8">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedTab(status)}
                  className={`px-6 py-3 rounded-lg text-lg font-bold ${
                    selectedTab === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 border'
                  } hover:bg-blue-700 hover:text-white transition duration-300`}
                >
                  {status}
                </button>
              ))}
            </div>

            <ul className="space-y-8">
              {filteredOrders.map((order) => (
                <li
                  key={order._id}
                  className="bg-white p-8 rounded-xl shadow-md"
                >
                  <h3 className="text-2xl font-semibold mb-4">
                    Order ID:{' '}
                    <span className="text-indigo-600">{order._id}</span>
                  </h3>
                  <p className="mb-4 text-lg">
                    Total Amount: USD {order.totalAmount}
                  </p>
                  <p className="mb-4 text-lg">
                    Payment Method: {order.paymentMethod}
                  </p>
                  <p className="mb-6 text-lg">Status: {order.orderStatus}</p>

                  {/* Shipping Address Section */}
                  <div className="bg-gray-100 p-6 rounded-lg shadow-inner mb-4">
                    <h4 className="text-lg font-bold mb-4">
                      Shipping Address:
                    </h4>
                    <p className="text-gray-800">
                      <strong>Address:</strong> {order.shippingDetails?.address}
                    </p>
                    <p className="text-gray-800">
                      <strong>Province:</strong>{' '}
                      {order.shippingDetails?.province}
                    </p>
                    <p className="text-gray-800">
                      <strong>ZIP Code:</strong>{' '}
                      {order.shippingDetails?.zipcode}
                    </p>
                    <p className="text-gray-800">
                      <strong>Contact Number:</strong>{' '}
                      {order.shippingDetails?.contactNumber}
                    </p>
                  </div>

                  {/* Product Section */}
                  <div className="bg-gray-100 p-6 rounded-lg shadow-inner mb-4">
                    <h4 className="text-lg font-bold mb-4">Products:</h4>
                    <ul>
                      {order.products.map((product) => (
                        <li
                          key={product.product._id}
                          className="flex items-center mb-4"
                        >
                          <img
                            src={`http://localhost:5000${product.product.images[0]}`}
                            alt={product.product.name}
                            className="w-16 h-16 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <p className="font-semibold">
                              {product.product.name}
                            </p>
                            <p>Quantity: {product.quantity}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dropdown for Status Change */}
                  <div className="flex items-center gap-6">
                    <select
                      value={selectedStatuses[order._id] || order.orderStatus}
                      onChange={(e) =>
                        handleDropdownChange(order._id, e.target.value)
                      }
                      className="p-4 border rounded-lg text-lg"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleStatusChange(order._id)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-bold"
                    >
                      Update Status
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewOrder;
