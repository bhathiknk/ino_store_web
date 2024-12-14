import React, { useEffect, useState } from 'react';
import { useCart } from '../Cart/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const CheckoutForm = () => {
    const { cart } = useCart(); // Access cart items from CartContext
    const [addressDetails, setAddressDetails] = useState({
        address: '',
        province: '',
        zip: '',
        mobile: '',
    });

    const [error, setError] = useState(null);

    // Fetch address details on component mount
    useEffect(() => {
        const fetchAddressDetails = async () => {
            try {
                const token = localStorage.getItem('userToken'); // Get token from localStorage
                const response = await axios.get('http://localhost:5000/api/address/user', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                    },
                });

                if (response.data && response.data.length > 0) {
                    const address = response.data[0]; // Assume the first address for now
                    setAddressDetails({
                        address: address.address,
                        province: address.province,
                        zip: address.zipcode,
                        mobile: address.contactNumber,
                    });
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch address details');
                toast.error('Failed to fetch address details'); // Show error toast
            }
        };

        fetchAddressDetails();
    }, []);

    // Calculate total price for cart items
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity) + (item.shippingCost || 0), 0).toFixed(2);
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
                        {/* Address Details */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
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
                        </div>

                        {/* Cart Items */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cart Items</h2>
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
                            <hr className="my-4" />
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold text-gray-800">Total:</p>
                                <p className="text-lg font-bold text-gray-800">
                                    Rs. {calculateTotal()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Confirm Order Button */}
                    <div className="mt-8 text-center">
                        <button
                            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300"
                            onClick={() => toast.success('Order placed successfully!')}
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutForm;
