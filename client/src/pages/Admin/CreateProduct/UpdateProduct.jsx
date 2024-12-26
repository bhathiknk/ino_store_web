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


}