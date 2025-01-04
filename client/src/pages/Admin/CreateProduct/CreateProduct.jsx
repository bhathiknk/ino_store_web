import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBars, FaTimes, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

function CreateProduct() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [isDiscount, setIsDiscount] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [confirmationPopupVisible, setConfirmationPopupVisible] =
    useState(false);
  const [categories, setCategories] = useState([]);
  const [individualDescriptions, setIndividualDescriptions] = useState([]);
  const [individualPopupVisible, setIndividualPopupVisible] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
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

  const basicRef = useRef(null);
  const priceRef = useRef(null);
  const shippingRef = useRef(null);
  const stockRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 5) {
      alert('You can only upload up to 5 images.');
      return;
    }
    setImages([...images, ...files]);
    setFormData({ ...formData, images: [...images, ...files] });
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setFormData({ ...formData, images: newImages });
  };

  const handleNavClick = (section) => {
    if (section === 'basic' && basicRef.current) {
      basicRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'price' && priceRef.current) {
      priceRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'shipping' && shippingRef.current) {
      shippingRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'stock' && stockRef.current) {
      stockRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(section);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNextClick = () => {
    setConfirmationPopupVisible(true); // Show the product save confirmation popup
  };

  const handleClearInputs = () => {
    setPopupVisible(false);
    setFormData({
      title: '',
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
    setImages([]);
  };

  const handleSaveProduct = async () => {
    try {
      const productData = new FormData();
      formData.images.forEach((image) => {
        productData.append('images', image);
      });
      productData.append('title', formData.title);
      productData.append('categoryDescription', formData.categoryDescription);
      productData.append('description', formData.description);
      productData.append('basePrice', formData.basePrice);

      if (isDiscount) {
        productData.append('discountPrice', formData.discountPrice);
      }
      productData.append('isDiscount', isDiscount);
      productData.append('isFreeShipping', formData.isFreeShipping);

      if (!formData.isFreeShipping) {
        productData.append('shippingCost', formData.shippingCost);
      }
      productData.append('quantity', formData.quantity);

      // Retrieve the JWT token from local storage
      const token = localStorage.getItem('token');

      // Replace with your API endpoint
      const response = await axios.post(
        'http://localhost:5000/api/products/add',
        productData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success('Product added successfully', {
          onClose: () => {
            handleClearInputs();
            setPopupVisible(false);
            navigate('/Admin/ProductPage'); // Redirect after success
          },
        });
      }
    } catch (error) {
      toast.error('Product addition failed', {
        onClose: () => {
          handleClearInputs();
          setPopupVisible(false);
          navigate('/dashboard'); // Redirect after failure
        },
      });
    }
  };

  const handleFreeShippingChange = () => {
    setIsFreeShipping(!isFreeShipping);
    setFormData({ ...formData, isFreeShipping: !isFreeShipping });
  };

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const basicRefCurrent = basicRef.current;
    const priceRefCurrent = priceRef.current;
    const shippingRefCurrent = shippingRef.current;
    const stockRefCurrent = stockRef.current;

    if (basicRefCurrent) observer.observe(basicRefCurrent);
    if (priceRefCurrent) observer.observe(priceRefCurrent);
    if (shippingRefCurrent) observer.observe(shippingRefCurrent);
    if (stockRefCurrent) observer.observe(stockRefCurrent);

    return () => {
      if (basicRefCurrent) observer.unobserve(basicRefCurrent);
      if (priceRefCurrent) observer.unobserve(priceRefCurrent);
      if (shippingRefCurrent) observer.unobserve(shippingRefCurrent);
      if (stockRefCurrent) observer.unobserve(stockRefCurrent);
    };
  }, []);

  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/categories/get'
        );
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
          <div className="container mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex items-center mb-4 lg:mb-0">
              <FaArrowLeft className="mr-2 text-gray-700" />
              <Link
                to="/Admin/ProductPage"
                className="text-gray-700 font-semibold"
              >
                Back to Product Listing
              </Link>
            </div>
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 focus:outline-none"
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
            <div
              className={`flex-grow lg:flex lg:items-center lg:justify-end lg:ml-4 ${
                isOpen ? 'block' : 'hidden lg:flex'
              }`}
            >
              <button
                className={`px-4 py-2 lg:mx-2 font-medium focus:outline-none ${
                  activeSection === 'basic'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-500'
                }`}
                onClick={() => handleNavClick('basic')}
              >
                Basic Information
              </button>
              <button
                className={`px-4 py-2 lg:mx-2 font-medium focus:outline-none ${
                  activeSection === 'price'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-500'
                }`}
                onClick={() => handleNavClick('price')}
              >
                Price Details
              </button>
              <button
                className={`px-4 py-2 lg:mx-2 font-medium focus:outline-none ${
                  activeSection === 'shipping'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-500'
                }`}
                onClick={() => handleNavClick('shipping')}
              >
                Shipping Information
              </button>
              <button
                className={`px-4 py-2 lg:mx-2 font-medium focus:outline-none ${
                  activeSection === 'stock'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-500'
                }`}
                onClick={() => handleNavClick('stock')}
              >
                Stock Information
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Content */}
      <div className="flex-grow mt-24">
        {/* Main Content */}
        <div className="container mx-auto p-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Basic Information Section */}
            <section id="basic" ref={basicRef} className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Basic Information
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product title"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="categoryDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category Description
                </label>
                <input
                  type="text"
                  id="categoryDescription"
                  name="categoryDescription"
                  value={formData.categoryDescription}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                  onClick={() => setPopupVisible(true)}
                  placeholder="Select category description"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Images (up to 5)
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageUpload}
                  multiple
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="mt-4 flex flex-wrap">
                  {images.map((image, index) => (
                    <div key={index} className="relative m-2">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Product ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-md shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                        title="Remove Image"
                      >
                        <FaTrashAlt size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Price Details Section */}
            <section id="price" ref={priceRef} className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Price Details
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="basePrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Base Price ($)
                </label>
                <input
                  type="number"
                  id="basePrice"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter base price"
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isDiscount"
                  name="isDiscount"
                  checked={isDiscount}
                  onChange={() => setIsDiscount(!isDiscount)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isDiscount"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Apply Discount
                </label>
              </div>
              {isDiscount && (
                <div className="mb-4">
                  <label
                    htmlFor="discountPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discount Price ($)
                  </label>
                  <input
                    type="number"
                    id="discountPrice"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter discount price"
                  />
                </div>
              )}
            </section>

            {/* Shipping Information Section */}
            <section id="shipping" ref={shippingRef} className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Shipping Information
              </h2>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isFreeShipping"
                  name="isFreeShipping"
                  checked={isFreeShipping}
                  onChange={handleFreeShippingChange}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isFreeShipping"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Free Shipping
                </label>
              </div>
              {!isFreeShipping && (
                <div className="mb-4">
                  <label
                    htmlFor="shippingCost"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Shipping Cost ($)
                  </label>
                  <input
                    type="number"
                    id="shippingCost"
                    name="shippingCost"
                    value={formData.shippingCost}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter shipping cost"
                  />
                </div>
              )}
            </section>

            {/* Stock Information Section */}
            <section id="stock" ref={stockRef} className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Stock Information
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quantity"
                />
              </div>
            </section>

            <button
              type="button"
              onClick={handleNextClick}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Popup for Category Description */}
      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Select Category
            </h2>
            <div className="max-h-64 overflow-y-auto">
              {categories.map((category, index) => (
                <div key={index} className="mb-3">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    className="w-full text-left py-2 px-4 border border-gray-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {category.name}
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPopupVisible(false)}
              className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-700 transition duration-300 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup for Individual Category Descriptions */}
      {individualPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Select Description
            </h2>
            <div className="max-h-64 overflow-y-auto">
              {individualDescriptions.map((description, index) => (
                <div key={index} className="mb-3">
                  <button
                    type="button"
                    onClick={() => handleDescriptionClick(description)}
                    className="w-full text-left py-2 px-4 border border-gray-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {description}
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndividualPopupVisible(false)}
              className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-700 transition duration-300 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {confirmationPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Confirm Save
            </h2>
            <div className="max-h-96 overflow-y-auto mb-4">
              <p className="mb-2">
                <strong>Product Title:</strong> {formData.title}
              </p>
              <p className="mb-2">
                <strong>Category Description:</strong>{' '}
                {formData.categoryDescription}
              </p>
              <p className="mb-2">
                <strong>Product Description:</strong> {formData.description}
              </p>
              <p className="mb-2">
                <strong>Base Price:</strong> ${formData.basePrice}
              </p>
              {isDiscount && (
                <p className="mb-2">
                  <strong>Discount Price:</strong> ${formData.discountPrice}
                </p>
              )}
              <p className="mb-2">
                <strong>Free Shipping:</strong> {isFreeShipping ? 'Yes' : 'No'}
              </p>
              {!isFreeShipping && (
                <p className="mb-2">
                  <strong>Shipping Cost:</strong> ${formData.shippingCost}
                </p>
              )}
              <p className="mb-2">
                <strong>Quantity:</strong> {formData.quantity}
              </p>
              <div>
                <strong>Images:</strong>
                <div className="mt-2 flex flex-wrap">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-md m-1 shadow-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleSaveProduct}
                className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setConfirmationPopupVisible(false)}
                className="w-1/2 bg-red-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-700 transition duration-300 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default CreateProduct;
