import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBars, FaTimes, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [isDiscount, setIsDiscount] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [confirmationPopupVisible, setConfirmationPopupVisible] = useState(false);
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
    images: []
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
      alert("You can only upload up to 5 images.");
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
    }
    setActiveSection(section);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      images: []
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
      productData.append('isFreeShipping', formData.isFreeShipping); // Add this line
      if (!formData.isFreeShipping) {
        productData.append('shippingCost', formData.shippingCost);
      }
      productData.append('quantity', formData.quantity);

      // Retrieve the JWT token from local storage
      const token = localStorage.getItem('token');

      // Replace with your API endpoint
      const response = await axios.post('http://localhost:5000/api/products/add', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
      });

      if (response.status === 201) {
        toast.success('Product added successfully', {
          onClose: () => {
            handleClearInputs();
            setPopupVisible(false);
            navigate('/dashboard'); // Redirect to dashboard after success
          }
        });
      }
    } catch (error) {
      toast.error('Product addition failed', {
        onClose: () => {
          handleClearInputs();
          setPopupVisible(false);
          navigate('/dashboard'); // Redirect to dashboard after failure
        }
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
    const observer = new IntersectionObserver(observerCallback, observerOptions);

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
      <div className="flex flex-col min-h-screen bg-gray-300">
        {/* Navigation Bar */}
        {!popupVisible && (
            <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between z-50">
              <div className="flex items-center mb-4 lg:mb-0">
                <FaArrowLeft className="mr-2 text-gray-700" />
                <Link to="/dashboard" className="text-gray-700">Back to product listing</Link>
              </div>
              <div className="lg:hidden self-end">
                <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
                  {isOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>
              <div className={`flex-grow lg:flex lg:items-center lg:justify-end lg:ml-4 ${isOpen ? '' : 'hidden lg:flex'}`}>
                <button className={`px-4 py-2 lg:mx-2 focus:outline-none ${activeSection === 'basic' ? 'text-blue-500' : 'text-gray-700'}`} onClick={() => handleNavClick('basic')}>Basic Information</button>
                <button className={`px-4 py-2 lg:mx-2 focus:outline-none ${activeSection === 'price' ? 'text-blue-500' : 'text-gray-700'}`} onClick={() => handleNavClick('price')}>Price Details</button>
                <button className={`px-4 py-2 lg:mx-2 focus:outline-none ${activeSection === 'shipping' ? 'text-blue-500' : 'text-gray-700'}`} onClick={() => handleNavClick('shipping')}>Shipping Information</button>
              </div>
            </div>
        )}

        {/* Content */}
        <div className="flex flex-grow mt-20">
          {/* Main Content */}
          <div className="flex-grow container mx-auto p-4">
            {/* Basic Information Section */}
            <section id="basic" ref={basicRef} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Product Title</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category Description</label>
                <input type="text" id="categoryDescription" name="categoryDescription" value={formData.categoryDescription} onChange={handleInputChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" readOnly onClick={() => setPopupVisible(true)} />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Product Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows="4" className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="images" className="block text-sm font-medium text-gray-700">Product Images (up to 5)</label>
                <input type="file" id="images" name="images" onChange={handleImageUpload} multiple className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <div className="mt-2 flex flex-wrap">
                  {images.map((image, index) => (
                      <div key={index} className="relative m-2">
                        <img src={URL.createObjectURL(image)} alt="" className="w-20 h-20 object-cover rounded-md"/>
                        <button type="button" onClick={() => handleRemoveImage(index)}
                                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full">
                          <FaTrashAlt/>
                        </button>
                      </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Price Details Section */}
            <section id="price" ref={priceRef} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold mb-4">Price Details</h2>
              <div className="mb-4">
                <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">Base Price ($)</label>
                <input type="number" id="basePrice" name="basePrice" value={formData.basePrice} onChange={handleInputChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div className="mb-4 flex items-center">
                <input type="checkbox" id="isDiscount" name="isDiscount" checked={isDiscount} onChange={() => setIsDiscount(!isDiscount)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="isDiscount" className="ml-2 block text-sm font-medium text-gray-700">Apply Discount</label>
              </div>
              {isDiscount && (
                  <div className="mb-4">
                    <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">Discount Price ($)</label>
                    <input type="number" id="discountPrice" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
              )}
            </section>

            {/* Shipping Information Section */}
            <section id="shipping" ref={shippingRef} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="mb-4 flex items-center">
                <input type="checkbox" id="isFreeShipping" name="isFreeShipping" checked={isFreeShipping} onChange={handleFreeShippingChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="isFreeShipping" className="ml-2 block text-sm font-medium text-gray-700">Free Shipping</label>
              </div>
              {!isFreeShipping && (
                  <div className="mb-4">
                    <label htmlFor="shippingCost" className="block text-sm font-medium text-gray-700">Shipping Cost ($)</label>
                    <input type="number" id="shippingCost" name="shippingCost" value={formData.shippingCost} onChange={handleInputChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
              )}
            </section>

            {/* Stock Information Section */}
            <section id="stock" ref={stockRef} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold mb-4">Stock Information</h2>
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </section>
            <button
                type="button"
                onClick={handleNextClick}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md focus:outline-none hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </div>

        {/* Popup for Category Description */}
        {popupVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-md shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Category Descriptions</h2>
                {categories.map((category, index) => (
                    <div key={index} className="mb-2">
                      <button
                          type="button"
                          onClick={() => handleCategoryClick(category)}
                          className="w-full text-left py-2 px-4 border rounded-md shadow-sm hover:bg-gray-100"
                      >
                        {category.name}
                      </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => setPopupVisible(false)}
                    className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-md focus:outline-none hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
        )}

        {/* Popup for Individual Category Descriptions */}
        {individualPopupVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-md shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Select Description</h2>
                {individualDescriptions.map((description, index) => (
                    <div key={index} className="mb-2">
                      <button
                          type="button"
                          onClick={() => handleDescriptionClick(description)}
                          className="w-full text-left py-2 px-4 border rounded-md shadow-sm hover:bg-gray-100"
                      >
                        {description}
                      </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => setIndividualPopupVisible(false)}
                    className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-md focus:outline-none hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
        )}

        {/* Confirmation Popup */}
        {confirmationPopupVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-md shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Confirm Save</h2>
                <div className="mb-4">
                  <p><strong>Product Title:</strong> {formData.title}</p>
                  <p><strong>Category Description:</strong> {formData.categoryDescription}</p>
                  <p><strong>Product Description:</strong> {formData.description}</p>
                  <p><strong>Base Price:</strong> ${formData.basePrice}</p>
                  {isDiscount && <p><strong>Discount Price:</strong> ${formData.discountPrice}</p>}
                  <p><strong>Free Shipping:</strong> {isFreeShipping ? 'Yes' : 'No'}</p>
                  {!isFreeShipping && <p><strong>Shipping Cost:</strong> ${formData.shippingCost}</p>}
                  <p><strong>Quantity:</strong> {formData.quantity}</p>
                  <div>
                    <strong>Images:</strong>
                    <div className="mt-2 flex flex-wrap">
                      {images.map((image, index) => (
                          <img
                              key={index}
                              src={URL.createObjectURL(image)}
                              alt={`Product ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-md m-1"
                          />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                      type="button"
                      onClick={handleSaveProduct}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md focus:outline-none hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                      type="button"
                      onClick={() => setConfirmationPopupVisible(false)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md focus:outline-none hover:bg-red-600"
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
};

export default CreateProduct;
