import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { FaArrowLeft, FaTrashAlt } from 'react-icons/fa';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [newImages, setNewImages] = useState([]); // For tracking newly added images
    const [removedImages, setRemovedImages] = useState([]); // For tracking removed images
    const [isDiscount, setIsDiscount] = useState(false);
    const [isFreeShipping, setIsFreeShipping] = useState(false);
    const [categories, setCategories] = useState([]);
    const [individualDescriptions, setIndividualDescriptions] = useState([]);
    const [individualPopupVisible, setIndividualPopupVisible] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
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
        images: [],
    });

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) {
                console.error('Product ID is undefined');
                return;
            }

            try {
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
        setNewImages([...newImages, ...files]); // Add new images
    };

    const handleDeleteImage = (index) => {
        const imageToRemove = images[index];
        setRemovedImages([...removedImages, imageToRemove]); // Track removed images
        setImages(images.filter((_, i) => i !== index)); // Remove image from display
    };

    const handleClosePopup = () => {
        setPopupVisible(false);
    };

     // Retrieve the JWT token from local storage
     const token = localStorage.getItem('token');

     const handleUpdateProduct = async () => {
         const updatedFormData = new FormData();
         updatedFormData.append('name', formData.name);
         updatedFormData.append('categoryDescription', formData.categoryDescription);
         updatedFormData.append('description', formData.description);
         updatedFormData.append('basePrice', formData.basePrice);
         updatedFormData.append('discountPrice', formData.discountPrice);
         updatedFormData.append('isDiscount', isDiscount);
         updatedFormData.append('isFreeShipping', isFreeShipping);
         updatedFormData.append('shippingCost', formData.shippingCost);
         updatedFormData.append('quantity', formData.quantity);
 
         (formData.images || []).forEach((image) => {
             if (typeof image === 'string') {
                 updatedFormData.append('existingImages', image);
             }
         });

         newImages.forEach((image) => {
            if (typeof image === 'object') {
                updatedFormData.append('images', image);
            }
        });

        removedImages.forEach((image) => {
            if (typeof image === 'string') {
                updatedFormData.append('removedImages', image);
            }
        });

        try {
            await axios.put(`http://localhost:5000/api/products/products/update/${id}`, updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Product updated successfully!');
            navigate('/Admin/ProductPage');
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        }
    
         
    };
    useEffect(() => {
        // Fetch categories from backend when component mounts
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories/get');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        const descriptions = category.description.split(', ');
        setIndividualDescriptions(descriptions);
        setPopupVisible(false); // Close the main category popup
        setIndividualPopupVisible(true); // Open the individual description popup
    };

    const handleDescriptionClick = (description) => {
        setFormData({ ...formData, categoryDescription: description });
        setIndividualPopupVisible(false); // Close the individual description popup
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">

            {/* Navigation Bar */}
            {!popupVisible && (
                <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex items-center justify-between z-50">
                    <div className="flex items-center">
                        <FaArrowLeft className="mr-2 text-gray-700" />
                        <Link to="/Admin/ProductPage" className="text-gray-700 hover:underline">Back to product listing</Link>
                    </div>
                </div>
            )}

            <div className="flex flex-grow mt-16 p-6 lg:p-12 bg-gray-100">
                <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Product</h2>

                    <div id="basic" className="mb-6">
                        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Product Title</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Product Category</label>
                            <input
                                type="text"
                                name="categoryDescription"
                                value={formData.categoryDescription}
                                onClick={() => setPopupVisible(true)}
                                readOnly
                                className="w-full p-3 border border-gray-300 rounded-md cursor-pointer focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Product Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Product Images</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <div className="mt-4 flex flex-wrap">
                                {images.concat(newImages).map((image, index) => (
                                    <div key={index} className="relative m-2">
                                        <img
                                            src={typeof image === 'string' ? `http://localhost:5000${image}` : URL.createObjectURL(image)}
                                            alt={`preview ${index}`}
                                            className="w-24 h-24 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(index)}
                                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full focus:outline-none"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div id="price" className="mb-6">
                        <h3 className="text-xl font-semibold mb-4">Price Details</h3>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Base Price</label>
                            <input
                                type="number"
                                name="basePrice"
                                value={formData.basePrice}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Discounted Price</label>
                            <input
                                type="number"
                                name="discountPrice"
                                value={formData.discountPrice}
                                onChange={handleInputChange}
                                disabled={!isDiscount}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                name="isDiscount"
                                checked={isDiscount}
                                onChange={() => setIsDiscount(!isDiscount)}
                                className="mr-2 focus:ring focus:ring-blue-300"
                            />
                            <label className="font-medium">Apply Discount</label>
                        </div>
                    </div>

                    <div id="shipping" className="mb-6">
                        <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Shipping Cost</label>
                            <input
                                type="number"
                                name="shippingCost"
                                value={formData.shippingCost}
                                onChange={handleInputChange}
                                disabled={isFreeShipping}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                name="isFreeShipping"
                                checked={isFreeShipping}
                                onChange={() => setIsFreeShipping(!isFreeShipping)}
                                className="mr-2 focus:ring focus:ring-blue-300"
                            />
                            <label className="font-medium">Free Shipping</label>
                        </div>
                    </div>

                    <div id="quantity" className="mb-6">
                        <h3 className="text-xl font-semibold mb-4">Product Quantity</h3>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                            />
                        </div>
                    </div>
                     {/* Category Selection Popup */}
                     {popupVisible && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-3xl">
                                <h2 className="text-lg font-semibold mb-4">Select Product Category</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {categories.map((category) => (
                                        <div
                                            key={category.name}
                                            className="p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition"
                                            onClick={() => handleCategoryClick(category)}
                                        >
                                            <h3 className="font-semibold">{category.name}</h3>
                                            <p>{category.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md focus:outline-none"
                                    onClick={handleClosePopup}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );    
                
};