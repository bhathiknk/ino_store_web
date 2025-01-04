import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-bold text-blue-600">
        Loading...
      </div>
    );
  }

  const handleUpdateClick = () => {
    navigate(`/Admin/update-product/${id}`);
  };

  const handleDeleteClick = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `http://localhost:5000/api/products/products/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Product deleted successfully');
      navigate('/Admin/ProductPage');
    } catch (error) {
      console.error('Error deleting product', error);
      alert('Failed to delete product');
    }
  };

  const stockStatus = product.quantity > 0 ? 'In Stock' : 'Out of Stock';

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left Section: Product Images Slider */}
          <div className="w-full md:w-1/2">
            {product.images && product.images.length > 0 && (
              <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
                <Slider {...sliderSettings}>
                  {product.images.map((image, index) => (
                    <div key={index}>
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={product.name}
                        className="w-full h-96 object-contain"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-around mt-8">
              <button
                onClick={handleUpdateClick}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 text-lg"
              >
                Update Product
              </button>
              <button
                onClick={handleDeleteClick}
                className="bg-red-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-red-700 transition duration-300 text-lg"
              >
                Delete Product
              </button>
            </div>
          </div>

          {/* Right Section: Product Details */}
          <div className="w-full md:w-1/2 bg-gray-50 rounded-lg shadow-md p-10">
            <h1 className="text-4xl font-bold text-blue-800 mb-8">
              {product.name}
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              <strong>Description:</strong> {product.description}
            </p>
            <p className="text-lg text-gray-700 mb-6">
              <strong>Category:</strong> {product.categoryDescription}
            </p>

            {product.isDiscount ? (
              <p className="text-2xl font-bold text-red-500 mb-6">
                <span className="line-through text-gray-500">
                  LKR {product.basePrice}
                </span>{' '}
                Discounted Price:{' '}
                <span className="text-green-600">
                  LKR {product.discountPrice}
                </span>
              </p>
            ) : (
              <p className="text-2xl font-bold text-green-600 mb-6">
                LKR {product.basePrice}
              </p>
            )}

            <p className="text-lg text-gray-700 mb-6">
              {product.isFreeShipping ? (
                <strong className="text-green-500">Free Shipping</strong>
              ) : (
                <span>
                  <strong>Shipping Cost:</strong> LKR {product.shippingCost}
                </span>
              )}
            </p>

            <p className="text-lg text-gray-700 mb-6">
              <strong>Quantity:</strong> {product.quantity}
            </p>
            <p
              className={`text-2xl font-bold ${
                stockStatus === 'In Stock' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {stockStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
