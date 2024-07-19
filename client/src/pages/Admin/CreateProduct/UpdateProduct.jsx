import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';

const UpdateProduct = () => {
    const { id } = useParams(); // Get the product ID from URL params
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [isDiscount, setIsDiscount] = useState(false);
    const [isFreeShipping, setIsFreeShipping] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        categoryDescription: '',
        description: '',
        basePrice: '',
        discountPrice: '',
        isDiscount: false,
        isFreeShipping: false,
        shippingCost: '',
        quantity: '',
        images: []
    });

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) {
                console.error('Product ID is undefined');
                return;
            }

            try {
                console.log(`Fetching data for product ID: ${id}`);
                const response = await axios.get(`http://localhost:5000/api/products/products/${id}`);
                const data = response.data;
                setFormData({
                    name: data.name,
                    categoryDescription: data.categoryDescription,
                    description: data.description,
                    basePrice: data.basePrice,
                    discountPrice: data.discountPrice,
                    isDiscount: data.isDiscount,
                    isFreeShipping: data.isFreeShipping,
                    shippingCost: data.shippingCost,
                    quantity: data.quantity,
                    images: data.images
                });
                setImages(data.images);
                setIsDiscount(data.isDiscount);
                setIsFreeShipping(data.isFreeShipping);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchProductData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files); // Save File objects directly
    };

    const handleUpdateProduct = async () => {
        try {
            await axios.put(`http://localhost:5000/api/products/products/${id}`, formData);
            toast.success('Product updated successfully!');
            navigate('/dashboard'); // Redirect after successful update
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        }
    };

    const handleDeleteImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-300">
            <div className="flex flex-grow mt-3">
                <div className="flex-grow p-6 lg:p-12">
                    <div id="basic" className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Product Title</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Product Category</label>
                            <input
                                type="text"
                                name="categoryDescription"
                                value={formData.categoryDescription}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Product Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Product Images</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="w-full"
                            />
                            <div className="mt-2 flex flex-wrap">
                                {images.map((image, index) => (
                                    <div key={index} className="relative m-2">
                                        {/* Check if the image is a File object or URL */}
                                        <img
                                            src={`http://localhost:5000${image}`}
                                            alt={`preview ${index}`}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(index)}
                                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div id="price" className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-lg font-semibold mb-4">Price Details</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Base Price</label>
                            <input
                                type="number"
                                name="basePrice"
                                value={formData.basePrice}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Discounted Price</label>
                            <input
                                type="number"
                                name="discountPrice"
                                value={formData.discountPrice}
                                onChange={handleInputChange}
                                disabled={!isDiscount}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                name="isDiscount"
                                checked={isDiscount}
                                onChange={() => setIsDiscount(!isDiscount)}
                                className="mr-2"
                            />
                            <label>Apply Discount</label>
                        </div>
                    </div>

                    <div id="shipping" className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Shipping Cost</label>
                            <input
                                type="number"
                                name="shippingCost"
                                value={formData.shippingCost}
                                onChange={handleInputChange}
                                disabled={isFreeShipping}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                name="isFreeShipping"
                                checked={isFreeShipping}
                                onChange={() => setIsFreeShipping(!isFreeShipping)}
                                className="mr-2"
                            />
                            <label>Free Shipping</label>
                        </div>
                    </div>

                    <div id="stock" className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <h2 className="text-lg font-bold mb-4">Stock Information</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="quantity">Quantity</label>
                            <input
                                className="w-full p-2 border rounded-lg"
                                id="quantity"
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mb-6">
                        <button
                            onClick={handleUpdateProduct}
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Update Product
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-gray-500 text-white py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default UpdateProduct;
