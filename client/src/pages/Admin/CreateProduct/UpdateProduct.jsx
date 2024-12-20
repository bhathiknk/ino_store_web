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
}