import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product details', error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const handleUpdateClick = () => {
        navigate(`/Admin/update-product/${id}`);
    };

    const handleDeleteClick = async () => {
        const token = localStorage.getItem('token'); // Adjust this according to how you store your token
        try {
            await axios.delete(`http://localhost:5000/api/products/products/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Product deleted successfully');
            navigate('/Admin/ProductPage');
        } catch (error) {
            console.error('Error deleting product', error);
            alert('Failed to delete product');
        }
    };

    const stockStatus = product.quantity > 0 ? 'In Stock' : 'Out of Stock';

    const settingsMain = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: nav2,
        ref: (slider) => setNav1(slider),
    };

    const settingsThumbs = {
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: nav1,
        focusOnSelect: true,
        vertical: false,
        centerMode: true,
        ref: (slider) => setNav2(slider),
    };
};