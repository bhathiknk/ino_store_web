import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaBars, FaTimes, FaTrashAlt } from 'react-icons/fa';

const CreateProduct = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [isDiscount, setIsDiscount] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
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
    setPopupVisible(true);
  };

  const handleClearInputs = () => {
    setPopupVisible(false);
    setFormData({
      title: '',
      category: '',
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


  return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Navigation Bar */}
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
          <div className={`flex-col ${isOpen ? 'flex' : 'hidden'} lg:flex lg:flex-row items-start lg:items-center lg:justify-between p-4 lg:p-0`}>
            <ul className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 w-full lg:w-auto">
              <li>
                <button onClick={() => handleNavClick('basic')} className={`${activeSection === 'basic' ? 'text-blue-500 font-bold' : 'text-gray-700'}`}>
                  Basic Information
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('price')} className={`${activeSection === 'price' ? 'text-blue-500 font-bold' : 'text-gray-700'}`}>
                  Price Information
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('shipping')} className={`${activeSection === 'shipping' ? 'text-blue-500 font-bold' : 'text-gray-700'}`}>
                  Shipping
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-grow items-center justify-center p-6 mt-16 lg:mt-20">
          <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg p-6 relative">
            <div ref={basicRef} id="basic">
              <h2 className="text-lg font-bold mb-6">Basic Information</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Product title</label>
                  <input
                      type="text"
                      name="title"
                      className="w-full mt-2 p-2 border rounded"
                      value={formData.title}
                      onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Product category</label>
                  <select
                      name="category"
                      className="w-full mt-2 p-2 border rounded"
                      value={formData.category}
                      onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                    <option value="category3">Category 3</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                      name="description"
                      className="w-full mt-2 p-2 border rounded"
                      rows="5"
                      value={formData.description}
                      onChange={handleInputChange}
                  ></textarea>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Media</h3>
                  <label className="block text-gray-700 mb-2">Upload products</label>
                  <div className="flex flex-wrap">
                    {images.map((image, index) => (
                        <div key={index} className="relative h-24 w-24 mr-2 mb-2 border">
                          <img
                              src={URL.createObjectURL(image)}
                              alt={`Media ${index + 1}`}
                              className="h-full w-full object-cover"
                          />
                          <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <FaTrashAlt size={12}/>
                          </button>
                        </div>
                    ))}
                    {images.length < 5 && (
                        <label
                            className="h-24 w-24 border flex items-center justify-center text-gray-500 cursor-pointer">
                          +
                          <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                          />
                        </label>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <hr className="my-6"/>
            <div ref={priceRef} id="price">
              <h3 className="text-lg font-bold mb-6">Price Details</h3>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Base Price</label>
                  <input
                      type="number"
                      name="basePrice"
                      className="w-full mt-2 p-2 border rounded"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    <input
                        type="checkbox"
                        className="mr-2"
                        checked={isDiscount}
                        onChange={() => {
                          setIsDiscount(!isDiscount);
                          setFormData({...formData, isDiscount: !isDiscount});
                        }}
                    />
                    Apply Discount
                  </label>
                </div>
                {isDiscount && (
                    <div className="mb-4">
                      <label className="block text-gray-700">Discount Price</label>
                      <input
                          type="number"
                          name="discountPrice"
                          className="w-full mt-2 p-2 border rounded"
                          value={formData.discountPrice}
                          onChange={handleInputChange}
                      />
                    </div>
                )}
              </form>
            </div>
            <hr className="my-6"/>
            <div ref={shippingRef} id="shipping">
              <h3 className="text-lg font-bold mb-6">Shipping Information</h3>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    <input
                        type="checkbox"
                        className="mr-2"
                        checked={isFreeShipping}
                        onChange={() => {
                          setIsFreeShipping(!isFreeShipping);
                          setFormData({...formData, isFreeShipping: !isFreeShipping});
                        }}
                    />
                    Free Shipping
                  </label>
                </div>
                {!isFreeShipping && (
                    <div className="mb-4">
                      <label className="block text-gray-700">Shipping Cost</label>
                      <input
                          type="number"
                          name="shippingCost"
                          className="w-full mt-2 p-2 border rounded"
                          value={formData.shippingCost}
                          onChange={handleInputChange}
                      />
                    </div>
                )}
              </form>
            </div>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
                onClick={handleClearInputs}
            >
              Clear Inputs
            </button>

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-6 mx-4 hover:bg-blue-600 focus:outline-none"
                onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        </div>

        {popupVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 lg:w-1/2">
              <h2 className="text-lg font-bold mb-4">Review Product Information</h2>
                <div className="mb-4">
                  <h3 className="font-bold">Basic Information</h3>
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Category:</strong> {formData.category}</p>
                  <p><strong>Description:</strong> {formData.description}</p>
                  <h3 className="font-bold mt-4">Media</h3>
                  <div className="flex flex-wrap">
                    {formData.images.map((image, index) => (
                        <div key={index} className="relative h-24 w-24 mr-2 mb-2 border">
                          <img
                              src={URL.createObjectURL(image)}
                              alt={`Media ${index + 1}`}
                              className="h-full w-full object-cover"
                          />
                        </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="font-bold">Price Information</h3>
                  <p><strong>Base Price:</strong> {formData.basePrice}</p>
                  {formData.isDiscount && (
                      <p><strong>Discount Price:</strong> {formData.discountPrice}</p>
                  )}
                </div>
                <div className="mb-4">
                  <h3 className="font-bold">Shipping Information</h3>
                  <p><strong>Free Shipping:</strong> {formData.isFreeShipping ? 'Yes' : 'No'}</p>
                  {!formData.isFreeShipping && (
                      <p><strong>Shipping Cost:</strong> {formData.shippingCost}</p>
                  )}
                </div>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
                    onClick={handleClosePopup}
                >
                  Close
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 mx-4 rounded hover:bg-red-600 focus:outline-none"
                    onClick={handleClosePopup}
                >
                  Save
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default CreateProduct;
