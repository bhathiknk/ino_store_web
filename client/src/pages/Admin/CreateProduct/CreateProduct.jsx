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
            navigate('/Admin/ProductPage'); // Redirect to dashboard after success
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
};