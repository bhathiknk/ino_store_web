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
};