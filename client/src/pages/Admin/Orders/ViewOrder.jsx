import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import Modal from 'react-modal'; // You need to install react-modal package

const ViewOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrder, setFilteredOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-blue-500"
                    >
                        <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
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
                        className="bg-blue-500 text-white ml-2 p-2 rounded"
                    >
                        Search
                    </button>
                </div>
            </div>
            <ul className="space-y-6">
                {orders.map(order => (
                    <li key={order._id} className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-2">Order ID: <span className="text-indigo-600">{order._id}</span></h3>
                        <p className="mb-2">Buyer: <span className="text-gray-700">{order.buyer.name}</span> ({order.buyer.email})</p>
                        <p className="mb-2">Total Amount: <span className="text-green-600">${order.totalAmount}</span></p>
                        <p className="mb-2">Payment Method: <span className="text-gray-700">{order.paymentMethod}</span></p>
                        <p className="mb-4">Paid At: <span className="text-gray-700">{new Date(order.paidAt).toLocaleString()}</span></p>
                        <h4 className="text-lg font-medium mb-3">Products:</h4>
                        <ul className="space-y-4">
                            {order.products.map(item => (
                                <li key={item.product._id} className="flex items-center space-x-4">
                                    {item.product.images && item.product.images.length > 0 && (
                                        <img
                                            src={`http://localhost:5000${item.product.images[0]}`}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                                        />
                                    )}
                                    <div>
                                        <p className="text-gray-800 font-semibold">{item.product.name}</p>
                                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            {filteredOrder && (
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Order Details"
                    className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-75"
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-2">Order ID: <span className="text-indigo-600">{filteredOrder._id}</span></h3>
                        <p className="mb-2">Buyer: <span className="text-gray-700">{filteredOrder.buyer.name}</span> ({filteredOrder.buyer.email})</p>
                        <p className="mb-2">Total Amount: <span className="text-green-600">${filteredOrder.totalAmount}</span></p>
                        <p className="mb-2">Payment Method: <span className="text-gray-700">{filteredOrder.paymentMethod}</span></p>
                        <p className="mb-4">Paid At: <span className="text-gray-700">{new Date(filteredOrder.paidAt).toLocaleString()}</span></p>
                        <h4 className="text-lg font-medium mb-3">Products:</h4>
                        <ul className="space-y-4">
                            {filteredOrder.products.map(item => (
                                <li key={item.product._id} className="flex items-center space-x-4">
                                    {item.product.images && item.product.images.length > 0 && (
                                        <img
                                            src={`http://localhost:5000${item.product.images[0]}`}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                                        />
                                    )}
                                    <div>
                                        <p className="text-gray-800 font-semibold">{item.product.name}</p>
                                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={closeModal}
                            className="mt-4 bg-red-500 text-white p-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ViewOrder;
