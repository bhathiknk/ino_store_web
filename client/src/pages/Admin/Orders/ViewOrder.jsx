import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import Modal from 'react-modal'; // Ensure you have react-modal installed
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client'; // Import Socket.IO client

const ViewOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrder, setFilteredOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState({});
    const [selectedTab, setSelectedTab] = useState('Processing');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch orders from the server
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get('http://localhost:5000/api/orders/seller', config);
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchOrders();

        // Set up WebSocket connection
        const socket = io('http://localhost:5000'); // Connect to backend WebSocket server

        // Listen for orderCreated event
        socket.on('orderCreated', (data) => {
            toast.info(data.message, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Optionally update orders in real-time
            setOrders((prevOrders) => [...prevOrders, ...data.orders]);
        });

        return () => {
            socket.disconnect(); // Cleanup WebSocket connection on component unmount
        };
    }, []);

    const statusOptions = ['Processing', 'Packed', 'Shipped'];

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.put(
                'http://localhost:5000/api/orders/update-status',
                { orderId, status: newStatus },
                config
            );

            // Update the local state with the new status
            setOrders(
                orders.map((order) =>
                    order._id === orderId ? { ...order, orderStatus: newStatus } : order
                )
            );

            // Show success toast message
            toast.success('Order status updated successfully!', {});
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

    const filteredOrders = orders.filter((order) => order.orderStatus === selectedTab);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-4">
            <ToastContainer />
            <div className="container mx-auto p-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <button
                        onClick={() => navigate('/Admin/ProductPage')}
                        className="flex items-center text-blue-500"
                    >
                        <svg
                            className="w-6 h-6 mr-1"
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
                            ></path>
                        </svg>
                        Back to Dashboard
                    </button>
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search by Order ID"
                            className="border p-2 rounded"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={handleSearch}
                            className="ml-2 bg-blue-500 text-white p-2 rounded"
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mb-6">
                    {statusOptions.map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedTab(status)}
                            className={`px-4 py-2 rounded ${
                                selectedTab === status
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-blue-500'
                            } border`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <ul className="space-y-4">
                    {filteredOrders.map((order) => (
                        <li
                            key={order._id}
                            className="bg-white shadow-lg rounded-lg p-4 md:p-6"
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                Order ID: <span className="text-indigo-600">{order._id}</span>
                            </h3>
                            <p className="mb-2">Total Amount: LKR {order.totalAmount}</p>
                            <p className="mb-2">Payment Method: {order.paymentMethod}</p>
                            <p className="mb-4">Status: {order.orderStatus}</p>
                            <div className="flex flex-col space-y-2">
                                <select
                                    value={
                                        selectedStatuses[order._id] || order.orderStatus
                                    }
                                    onChange={(e) =>
                                        handleDropdownChange(order._id, e.target.value)
                                    }
                                    className="p-2 border rounded"
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
                                            selectedStatuses[order._id] ||
                                            order.orderStatus
                                        )
                                    }
                                    className="bg-blue-500 text-white p-2 rounded"
                                >
                                    Update Status
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Order Details Modal"
            >
                {filteredOrder && (
                    <div>
                        <h2>Order ID: {filteredOrder._id}</h2>
                        <p>Total Amount: {filteredOrder.totalAmount}</p>
                        <p>Payment Method: {filteredOrder.paymentMethod}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ViewOrder;
