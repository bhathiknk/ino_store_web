import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';

function ViewOrder() {
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrder, setFilteredOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [selectedTab, setSelectedTab] = useState('Processing');
  const navigate = useNavigate();

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

  const statusOptions = ['Processing', 'Packed', 'Shipped'];

  const handleStatusChange = async (orderId, newStatus) => {
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

  const handleDropdownChange = (orderId, newStatus) => {
    setSelectedStatuses({
      ...selectedStatuses,
      [orderId]: newStatus,
    });
  };

  const handleSearch = () => {
    const order = orders.find((order) => order._id === searchTerm);
    if (order) {
      setFilteredOrder(order);
      setIsModalOpen(true);
    } else {
      setFilteredOrder(null);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchTerm('');
  };

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
              onClick={handleSearch}
              className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-bold"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
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
                    Total Amount: LKR {order.totalAmount}
                  </p>
                  <p className="mb-4 text-lg">
                    Payment Method: {order.paymentMethod}
                  </p>
                  <p className="mb-6 text-lg">Status: {order.orderStatus}</p>
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
                      onClick={() =>
                        handleStatusChange(
                          order._id,
                          selectedStatuses[order._id] || order.orderStatus
                        )
                      }
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Order Details Modal"
        className="bg-white p-10 rounded-lg shadow-xl max-w-md mx-auto"
      >
        {filteredOrder && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Order ID: {filteredOrder._id}
            </h2>
            <p className="mb-4 text-lg">
              Total Amount: {filteredOrder.totalAmount}
            </p>
            <p className="mb-6 text-lg">
              Payment Method: {filteredOrder.paymentMethod}
            </p>
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-bold"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ViewOrder;
