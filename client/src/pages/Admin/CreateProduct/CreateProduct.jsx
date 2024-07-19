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
          <div className="flex-grow p-6 lg:p-12 ">
            <div id="basic" ref={basicRef} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="mb-4">
                <label className="block mb-2">Product Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                       className="w-full p-2 border border-gray-300 rounded-md"/>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Product Category</label>
                <input type="text" name="categoryDescription" value={formData.categoryDescription}
                       onClick={() => setPopupVisible(true)} readOnly
                       className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"/>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Product Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"></textarea>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Product Images</label>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="w-full"/>
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
            </div>

            <div id="price" ref={priceRef} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Price Details</h2>
              <div className="mb-4">
                <label className="block mb-2">Base Price</label>
                <input type="number" name="basePrice" value={formData.basePrice} onChange={handleInputChange}
                       className="w-full p-2 border border-gray-300 rounded-md"/>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Discounted Price</label>
                <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange}
                       disabled={!isDiscount} className="w-full p-2 border border-gray-300 rounded-md"/>
              </div>
              <div className="flex items-center mb-4">
                <input type="checkbox" name="isDiscount" checked={isDiscount}
                       onChange={() => setIsDiscount(!isDiscount)} className="mr-2"/>
                <label>Apply Discount</label>
              </div>
            </div>

            <div id="shipping" ref={shippingRef} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
              <div className="mb-4">
                <label className="block mb-2">Shipping Cost</label>
                <input type="number" name="shippingCost" value={formData.shippingCost} onChange={handleInputChange}
                       disabled={isFreeShipping} className="w-full p-2 border border-gray-300 rounded-md"/>
              </div>
              <div className="flex items-center mb-4">
                <input type="checkbox" name="isFreeShipping" checked={formData.isFreeShipping}
                       onChange={handleFreeShippingChange} className="mr-2"/>
                <label>Free Shipping</label>
              </div>
            </div>

            <div ref={stockRef} id="stock" className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-lg font-bold mb-4">Stock Information</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="quantity">Quantity</label>
                  <input className="w-full p-2 border rounded-lg" id="quantity" name="quantity" type="number"
                         value={formData.quantity} onChange={handleInputChange}/>
                </div>

              </form>
            </div>

            <button className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none"
                    onClick={handleNextClick}>Next
            </button>
          </div>
        </div>

        {/* Category Selection Popup */}
        {popupVisible && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-3xl">
                <h2 className="text-lg font-semibold mb-4">Select Product Category</h2>
                <div className="grid grid-cols-2 gap-4">
                  {categories.map((category) => (
                      <div key={category.name} className="p-4 border border-gray-300 rounded-md cursor-pointer"
                           onClick={() => handleCategoryClick(category)}>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p>{category.description}</p>
                      </div>
                  ))}
                </div>
                <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md focus:outline-none"
                        onClick={handleClosePopup}>Close
                </button>
              </div>
            </div>
        )}

        {/* Individual Description Selection Popup */}
        {individualPopupVisible && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-3xl">
                <h2 className="text-lg font-semibold mb-4">Select Category Description</h2>
                <div className="grid grid-cols-2 gap-4">
                  {individualDescriptions.map((description) => (
                      <div key={description} className="p-4 border border-gray-300 rounded-md cursor-pointer" onClick={() => handleDescriptionClick(description)}>
                        <p>{description}</p>
                      </div>
                  ))}
                </div>
                <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md focus:outline-none" onClick={() => setIndividualPopupVisible(false)}>Close</button>
              </div>
            </div>
        )}

        {/* Confirmation Popup */}
        {confirmationPopupVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg max-h-[100vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Save Product</h2>
                <p>Do you want to save the product with the following details?</p>
                <div className="mt-4">
                  <h3 className="font-semibold">Basic Information</h3>
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Category:</strong> {formData.categoryDescription}</p>
                  <div className="overflow-y-auto max-h-32"> {/* Add scrolling to description if needed */}
                    <p><strong>Description:</strong> {formData.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Price Details</h3>
                  <p><strong>Base Price:</strong> {formData.basePrice}</p>
                  {isDiscount && <p><strong>Discount Price:</strong> {formData.discountPrice}</p>}
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Shipping Information</h3>
                  <p><strong>Free Shipping:</strong> {formData.isFreeShipping ? 'Yes' : 'No'}</p>
                  {!formData.isFreeShipping && <p><strong>Shipping Cost:</strong> {formData.shippingCost}</p>}
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Availability Information</h3>
                  <li><strong>Quantity:</strong> {formData.quantity}</li>

                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Images</h3>
                  <div className="flex flex-wrap">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index}`}
                            className="h-20 w-20 object-cover rounded-lg mr-2 mb-2"
                        />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={handleSaveProduct} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
                    Save
                  </button>
                  <button onClick={handleClosePopup} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        )}


        {/* Toast Notification */}
        <ToastContainer/>
      </div>
  );
};

export default CreateProduct;





