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

    return (
        <div className="flex flex-col md:flex-row p-5 bg-gray-200 min-h-screen">
            <div className="flex flex-col w-full md:w-1/2 md:mr-4">
                <div className="w-full mb-2">
                    {product.images && product.images.length > 0 && (
                        <div className="w-full h-72 md:h-96 bg-white border border-gray-300 rounded-lg">
                            <Slider {...settingsMain}>
                                {product.images.map((image, index) => (
                                    <div key={index} className="h-72 md:h-96">
                                        <img
                                            src={`http://localhost:5000${image}`}
                                            alt={product.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col items-center">
                    {product.images && product.images.length > 0 && (
                        <div className="w-full md:w-2/3 bg-black rounded-lg mb-4">
                            <Slider {...settingsThumbs}>
                                {product.images.map((image, index) => (
                                    <div key={index} className="p-1">
                                        <img
                                            src={`http://localhost:5000${image}`}
                                            alt={product.name}
                                            className="object-cover w-full h-16 md:h-24 rounded-lg"
                                            style={{ width: '4rem', height: '4rem' }} // Ensuring square size
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    )}
                    <div className="flex justify-around w-full mt-4">
                        <button onClick={handleUpdateClick} className="bg-blue-500 text-white py-2 px-4 rounded">
                            Update Product
                        </button>
                        <button onClick={handleDeleteClick} className="bg-red-500 text-white py-2 px-4 rounded">
                            Delete Product
                        </button>
                    </div>
                </div>
            </div> 
        </div>
    );       
};