import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBars, FaTimes, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
    images: []
  });

  const basicRef = useRef(null);
  const priceRef = useRef(null);
  const shippingRef = useRef(null);

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
      images: []
    });
    setImages([]);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
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
      productData.append('discountPrice', formData.discountPrice);
      productData.append('isDiscount', formData.isDiscount);
      productData.append('isFreeShipping', formData.isFreeShipping);
      productData.append('shippingCost', formData.shippingCost);

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
      toast.error('Product added failed', {
        onClose: () => {
          handleClearInputs();
          setPopupVisible(false);
          navigate('/dashboard'); // Redirect to dashboard after success
        }
      });
    }
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

    if (basicRefCurrent) observer.observe(basicRefCurrent);
    if (priceRefCurrent) observer.observe(priceRefCurrent);
    if (shippingRefCurrent) observer.observe(shippingRefCurrent);

    return () => {
      if (basicRefCurrent) observer.unobserve(basicRefCurrent);
      if (priceRefCurrent) observer.unobserve(priceRefCurrent);
      if (shippingRefCurrent) observer.unobserve(shippingRefCurrent);
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
          <div className="flex-grow p-6 lg:p-12 ">
            <div id="basic" ref={basicRef} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="mb-4">
                <label htmlFor="title" className="block font-semibold mb-2">Product Title</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange}
                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"/>
              </div>
              <div className="mb-4">
                <label htmlFor="categoryDescription" className="block font-semibold mb-2">Category Description</label>
                <input type="text" id="categoryDescription" name="categoryDescription"
                       value={formData.categoryDescription} onClick={() => setPopupVisible(true)} readOnly
                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"/>
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block font-semibold mb-2">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"></textarea>
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Images</label>
                <input type="file" multiple onChange={handleImageUpload}
                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"/>
                <div className="mt-2 flex flex-wrap">
                  {images.map((image, index) => (
                      <div key={index} className="relative mr-2 mb-2">
                        <img src={URL.createObjectURL(image)} alt={`Upload ${index}`}
                             className="h-20 w-20 object-cover rounded-lg"/>
                        <button onClick={() => handleRemoveImage(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                          <FaTrashAlt/>
                        </button>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="price" ref={priceRef} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Price Details</h2>
              <div className="mb-4">
                <label htmlFor="basePrice" className="block font-semibold mb-2">Base Price</label>
                <input type="text" id="basePrice" name="basePrice" value={formData.basePrice}
                       onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="mb-4 flex items-center">
                <input type="checkbox" id="isDiscount" name="isDiscount" checked={isDiscount} onChange={(e) => setIsDiscount(e.target.checked)} className="mr-2" />
                <label htmlFor="isDiscount" className="font-semibold">Apply Discount</label>
              </div>
              {isDiscount && (
                  <div className="mb-4">
                    <label htmlFor="discountPrice" className="block font-semibold mb-2">Discount Price</label>
                    <input type="text" id="discountPrice" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
                  </div>
              )}
            </div>

            <div id="shipping" ref={shippingRef} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
              <div className="mb-4 flex items-center">
                <input type="checkbox" id="isFreeShipping" name="isFreeShipping" checked={isFreeShipping} onChange={(e) => setIsFreeShipping(e.target.checked)} className="mr-2" />
                <label htmlFor="isFreeShipping" className="font-semibold">Free Shipping</label>
              </div>
              {!isFreeShipping && (
                  <div className="mb-4">
                    <label htmlFor="shippingCost" className="block font-semibold mb-2">Shipping Cost</label>
                    <input type="text" id="shippingCost" name="shippingCost" value={formData.shippingCost} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
                  </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={handleNextClick } className="bg-blue-500 text-white px-4 py-2 rounded-lg">Next</button>
            </div>
          </div>
        </div>

        {/* Success Toast Notification */}
        <ToastContainer />

        {confirmationPopupVisible    && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-lg font-semibold mb-4">Save Product</h2>
                <p>Do you want to save the product with the following details?</p>
                <div className="mt-4">
                  <h3 className="font-semibold">Basic Information</h3>
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Category:</strong> {formData.categoryDescription}</p>
                  <p><strong>Description:</strong> {formData.description}</p>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Price Details</h3>
                  <p><strong>Base Price:</strong> {formData.basePrice}</p>
                  {isDiscount && <p><strong>Discount Price:</strong> {formData.discountPrice}</p>}
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Shipping Information</h3>
                  <p><strong>Free Shipping:</strong> {formData.isFreeShipping ? 'Yes' : 'No'}</p>
                  {!isFreeShipping && <p><strong>Shipping Cost:</strong> {formData.shippingCost}</p>}
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Images</h3>
                  <div className="flex flex-wrap">
                    {images.map((image, index) => (
                        <img key={index} src={URL.createObjectURL(image)} alt={`Upload ${index}`} className="h-20 w-20 object-cover rounded-lg mr-2 mb-2" />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={handleSaveProduct} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Save</button>
                  <button onClick={handleClosePopup} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </div>
            </div>
        )}

        {/* Category Popup */}
        {popupVisible && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-1/2">
                <h2 className="text-lg font-semibold mb-4">Select a Category</h2>
                <ul className="divide-y divide-gray-300">
                  {categories.map((category) => (
                      <li key={category._id} className="py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleCategoryClick(category)}>
                        <p className="text-blue-500 font-semibold">{category.name}</p>
                      </li>
                  ))}
                </ul>
                <button onClick={handleClosePopup} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none">Close</button>
              </div>
            </div>
        )}

        {/* Individual Description Popup */}
        {individualPopupVisible  && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-1/2">
                <h2 className="text-lg font-semibold mb-4">Select a Description</h2>
                <ul className="divide-y divide-gray-300">
                  {individualDescriptions.map((description, index) => (
                      <li key={index} className="py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleDescriptionClick(description)}>
                        <p className="text-blue-500 font-semibold">{description}</p>
                      </li>
                  ))}
                </ul>
                <button onClick={() => setIndividualPopupVisible(false)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none">Close</button>
              </div>
            </div>
        )}


      </div>
  );
};

export default CreateProduct;
