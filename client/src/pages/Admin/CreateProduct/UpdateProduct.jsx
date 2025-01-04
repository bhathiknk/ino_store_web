import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { FaArrowLeft, FaTrashAlt } from 'react-icons/fa';

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
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
        const response = await axios.get(
          `http://localhost:5000/api/products/products/${id}`
        );
        const { data } = response;
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
          images: [], // Images handled separately
        });
        setImages(data.images);
        setIsDiscount(data.isDiscount);
        setIsFreeShipping(data.isFreeShipping);
      } catch (error) {
        console.error('Error fetching product data:', error);
        toast.error('Failed to fetch product data', {
          position: 'top-right',
          autoClose: 3000,
        });
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
    if (files.length + images.length + newImages.length > 5) {
      toast.warning('You can only upload up to 5 images.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    setNewImages([...newImages, ...files]);
  };

  const handleDeleteImage = (index, type) => {
    if (type === 'existing') {
      const imageToRemove = images[index];
      setRemovedImages([...removedImages, imageToRemove]);
      setImages(images.filter((_, i) => i !== index));
    } else if (type === 'new') {
      setNewImages(newImages.filter((_, i) => i !== index));
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  const token = localStorage.getItem('token');

  const handleUpdateProduct = async () => {
    // Basic validation
    if (
      !formData.name ||
      !formData.categoryDescription ||
      !formData.description ||
      !formData.basePrice ||
      (!isFreeShipping && !formData.shippingCost) ||
      !formData.quantity
    ) {
      toast.warning('Please fill in all required fields.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

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

    // Add existing images
    (images || []).forEach((image) => {
      if (typeof image === 'string') {
        updatedFormData.append('existingImages', image);
      }
    });

    // Add newly uploaded images
    newImages.forEach((image) => {
      if (typeof image === 'object') {
        updatedFormData.append('images', image);
      }
    });

    // Track removed images
    removedImages.forEach((image) => {
      if (typeof image === 'string') {
        updatedFormData.append('removedImages', image);
      }
    });

    try {
      await axios.put(
        `http://localhost:5000/api/products/products/update/${id}`,
        updatedFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Product updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        onClose: () => navigate('/Admin/ProductPage'),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/categories/get'
        );
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    const descriptions = category.description.split(', ');
    setIndividualDescriptions(descriptions);
    setPopupVisible(false);
    setIndividualPopupVisible(true);
  };

  const handleDescriptionClick = (description) => {
    setFormData({ ...formData, categoryDescription: description });
    setIndividualPopupVisible(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      {/* Navigation Bar */}
      {!popupVisible && (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-50">
          <div className="container mx-auto flex items-center">
            <Link
              to="/Admin/ProductPage"
              className="flex items-center text-gray-700 hover:underline"
            >
              <FaArrowLeft className="mr-2" />
              Back to Product Listing
            </Link>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className="flex-grow mt-16 p-6 lg:p-12">
        <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Update Product
          </h2>

          {/* Basic Information */}
          <div id="basic" className="mb-8">
            <h3 className="text-2xl font-medium text-gray-700 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Product Title */}
              <div>
                <label className="block text-gray-600 mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product title"
                />
              </div>

              {/* Product Category */}
              <div>
                <label className="block text-gray-600 mb-2">
                  Product Category
                </label>
                <input
                  type="text"
                  name="categoryDescription"
                  value={formData.categoryDescription}
                  onClick={() => setPopupVisible(true)}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select category description"
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-gray-600 mb-2">
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter product description"
                />
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-gray-600 mb-2">
                  Product Images (up to 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="mt-4 flex flex-wrap">
                  {/* Existing Images */}
                  {images.map((image, index) => (
                    <div key={index} className="relative m-2">
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`Existing Product ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-md shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index, 'existing')}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                        title="Remove Image"
                      >
                        <FaTrashAlt size={12} />
                      </button>
                    </div>
                  ))}

                  {/* New Images */}
                  {newImages.map((image, index) => (
                    <div key={index} className="relative m-2">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New Product ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-md shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index, 'new')}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                        title="Remove Image"
                      >
                        <FaTrashAlt size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div id="price" className="mb-8">
            <h3 className="text-2xl font-medium text-gray-700 mb-4">
              Price Details
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Base Price */}
              <div>
                <label className="block text-gray-600 mb-2">
                  Base Price ($)
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter base price"
                />
              </div>

              {/* Apply Discount */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDiscount"
                  checked={isDiscount}
                  onChange={() => setIsDiscount(!isDiscount)}
                  className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-gray-700 font-medium">
                  Apply Discount
                </label>
              </div>

              {/* Discount Price */}
              {isDiscount && (
                <div>
                  <label className="block text-gray-600 mb-2">
                    Discounted Price ($)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter discount price"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          <div id="shipping" className="mb-8">
            <h3 className="text-2xl font-medium text-gray-700 mb-4">
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Free Shipping */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFreeShipping"
                  checked={isFreeShipping}
                  onChange={() => setIsFreeShipping(!isFreeShipping)}
                  className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-gray-700 font-medium">
                  Free Shipping
                </label>
              </div>

              {/* Shipping Cost */}
              {!isFreeShipping && (
                <div>
                  <label className="block text-gray-600 mb-2">
                    Shipping Cost ($)
                  </label>
                  <input
                    type="number"
                    name="shippingCost"
                    value={formData.shippingCost}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter shipping cost"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Quantity */}
          <div id="quantity" className="mb-8">
            <h3 className="text-2xl font-medium text-gray-700 mb-4">
              Product Quantity
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Quantity */}
              <div>
                <label className="block text-gray-600 mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quantity"
                />
              </div>
            </div>
          </div>

          {/* Update Button */}
          <button
            type="button"
            onClick={handleUpdateProduct}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none"
          >
            Update Product
          </button>
        </div>
      </div>

      {/* Category Selection Popup */}
      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Select Product Category
            </h2>
            <div className="grid grid-cols-1 gap-4 max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-blue-50 transition"
                  onClick={() => handleCategoryClick(category)}
                >
                  <h3 className="font-semibold">{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-700 transition duration-300 focus:outline-none"
              onClick={handleClosePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Individual Description Selection Popup */}
      {individualPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Select Category Description
            </h2>
            <div className="grid grid-cols-1 gap-4 max-h-64 overflow-y-auto">
              {individualDescriptions.map((desc) => (
                <div
                  key={desc}
                  className="p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-blue-50 transition"
                  onClick={() => handleDescriptionClick(desc)}
                >
                  <p>{desc}</p>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-700 transition duration-300 focus:outline-none"
              onClick={() => setIndividualPopupVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default UpdateProduct;
