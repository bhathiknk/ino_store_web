import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [currentImageIndices, setCurrentImageIndices] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/products/my-products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const initialIndices = {};
                response.data.forEach(product => {
                    initialIndices[product._id] = 0;
                });
                setProducts(response.data);
                setCurrentImageIndices(initialIndices);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };

        fetchProducts();
    }, []);

    const nextImage = (productId) => {
        setCurrentImageIndices(prevState => ({
            ...prevState,
            [productId]: (prevState[productId] + 1) % products.find(product => product._id === productId).images.length
        }));
    };

    const prevImage = (productId) => {
        setCurrentImageIndices(prevState => ({
            ...prevState,
            [productId]: prevState[productId] === 0 ? products.find(product => product._id === productId).images.length - 1 : prevState[productId] - 1
        }));
    };

    return (
        <div className="min-h-screen p-4 bg-gray-100">
            <Navbar />

            <div className="flex justify-between items-center mt-6 mb-4">
                <div className="text-lg">Products</div>
                <Link to="/create-product" className="bg-blue-500 text-white py-2 px-4 rounded">
                    + Create New Product
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                {products.length === 0 ? (
                    <div className="text-center text-gray-500">No products available. Please add some products.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <div key={product._id} className="bg-gray-100 border p-1 rounded-lg flex flex-col items-center">
                                <div className="mb-3 relative group">
                                    <div className="w-full relative">
                                        {product.images && product.images.length > 0 && (
                                            <div className="relative w-full">
                                                <img
                                                    src={`http://localhost:5000${product.images[currentImageIndices[product._id]]}`}
                                                    alt={product.name}
                                                    className="h-40 w-full object-cover rounded-lg shadow-md cursor-pointer"
                                                />
                                            </div>
                                        )}
                                        {product.images.length > 1 && (
                                            <div className="mt-2 flex items-center justify-center">
                                                <button
                                                    className="bg-black bg-opacity-40 text-black px-2 py-1 rounded-l-md mr-2"
                                                    onClick={() => prevImage(product._id)}
                                                >
                                                    &lt;
                                                </button>
                                                <div className="text-black px-2 py-1">
                                                    {currentImageIndices[product._id] + 1} / {product.images.length}
                                                </div>
                                                <button
                                                    className="bg-black bg-opacity-40 text-black px-2 py-1 rounded-r-md ml-2"
                                                    onClick={() => nextImage(product._id)}
                                                >
                                                    &gt;
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-center mb-2">
                                    <div className="font-bold">{product.name}</div>
                                    <div className="text-green-500">LKR{product.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
