import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import Modal from 'react-modal';
import Navbar from "../Navbar"; // Make sure you have react-modal installed
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

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
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get('http://localhost:5000/api/orders/seller', config);
                console.log(response.data); // Check if image URLs are present
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchOrders();
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

            await axios.put('http://localhost:5000/api/orders/update-status',
                { orderId, status: newStatus },
                config
            );

            // Update the local state with the new status
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, orderStatus: newStatus } : order
            ));

            // Show success toast message
            toast.success('Order status updated successfully!', {
            });

        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    const handleDropdownChange = (orderId, newStatus) => {
        setSelectedStatuses({
            ...selectedStatuses,
            [orderId]: newStatus
        });
    };

    const handleSearch = () => {
        const order = orders.find(order => order._id === searchTerm);
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

    const filteredOrders = orders.filter(order => order.orderStatus === selectedTab);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-4">
            <Navbar />
            <ToastContainer />
            <div className="container mx-auto p-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                        <button
                            onClick={() => navigate('/Admin/ProductPage')}
                            className="flex items-center text-blue-500"
                        >
                            <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                            Back to Dashboard
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row items-center">
                        <input
                            type="text"
                            placeholder="Search by Order ID"
                            className="border p-2 rounded mb-2 md:mb-0 md:mr-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 text-white p-2 rounded"
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mb-6">
                    {statusOptions.map(status => (
                        <button
                            key={status}
                            onClick={() => setSelectedTab(status)}
                            className={`px-4 py-2 rounded ${selectedTab === status ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <ul className="space-y-4">
                    {filteredOrders.map(order => (
                        <li key={order._id} className="bg-white shadow-lg rounded-lg p-4 md:p-6">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-2/3 pr-0 md:pr-4 mb-4 md:mb-0">
                                    <h3 className="text-xl font-semibold mb-2">Order ID: <span
                                        className="text-indigo-600">{order._id}</span></h3>
                                    <p className="mb-2">Buyer: <span
                                        className="text-gray-700">{order.buyer.name}</span> ({order.buyer.email})</p>
                                    <p className="mb-2">Total Amount: <span
                                        className="text-green-600">LKR{order.totalAmount}</span></p>
                                    <p className="mb-2">Payment Method: <span
                                        className="text-gray-700">{order.paymentMethod}</span></p>
                                    <p className="mb-4">Paid At: <span
                                        className="text-gray-700">{new Date(order.paidAt).toLocaleString()}</span></p>
                                    <h4 className="text-lg font-medium mb-3">Products:</h4>
                                    <ul className="space-y-4">
                                        {order.products.map(item => (
                                            <li key={item.product._id} className="flex items-center space-x-4">
                                                {item.product.images && item.product.images.length > 0 && (
                                                    <img
                                                        src={`http://localhost:5000${item.product.images[0]}`}
                                                        alt={item.product.name}
                                                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shadow-md"
                                                    />
                                                )}
                                                <div>
                                                    <p className="text-gray-800 font-semibold">{item.product.name}</p>
                                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="w-full md:w-2/3 pl-0 md:pl-4">
                                    <h4 className="text-xl font-medium mb-3">Shipping Details:</h4>
                                    <p className="mb-2"><span className="font-semibold">Address:</span> <span
                                        className="text-gray-700">{order.shippingDetails.address}</span></p>
                                    <p className="mb-2"><span className="font-semibold">Province:</span> <span
                                        className="text-gray-700">{order.shippingDetails.province}</span></p>
                                    <p className="mb-2"><span className="font-semibold">Zipcode:</span> <span
                                        className="text-gray-700">{order.shippingDetails.zipcode}</span></p>
                                    <p className="mb-2"><span className="font-semibold">Contact Number:</span> <span
                                        className="text-gray-700">{order.shippingDetails.contactNumber}</span>
                                    </p>
                                </div>

                                <div className="w-full md:w-1/3 pl-0 md:pl-4 flex flex-col">
                                    <div className="mb-4">
                                        <h4 className="text-xl font-medium mb-3">Order Status:</h4>
                                        <div className="flex flex-col space-y-4">
                                            <select
                                                value={selectedStatuses[order._id] || order.orderStatus}
                                                onChange={(e) => handleDropdownChange(order._id, e.target.value)}
                                                className="p-2 border rounded"
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => handleStatusChange(order._id, selectedStatuses[order._id] || order.orderStatus)}
                                                className="bg-blue-500 text-white p-2 rounded"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Order Details Modal">
                {filteredOrder && (
                    <div>
                        <h2>Order ID: {filteredOrder._id}</h2>
                        <p>Buyer: {filteredOrder.buyer.name} ({filteredOrder.buyer.email})</p>
                        <p>Total Amount: {filteredOrder.totalAmount}</p>
                        <p>Payment Method: {filteredOrder.paymentMethod}</p>
                        <p>Paid At: {filteredOrder.paidAt}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ViewOrder;
