import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [currentImageIndices, setCurrentImageIndices] = useState({});

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:5000/api/products/my-products',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const initialIndices = {};
        response.data.forEach((product) => {
          initialIndices[product._id] = 0;
        });

        setProducts(response.data);
        setCurrentImageIndices(initialIndices);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  // Navigate to the next image
  const nextImage = (productId) => {
    setCurrentImageIndices((prevState) => ({
      ...prevState,
      [productId]:
        (prevState[productId] + 1) %
        products.find((product) => product._id === productId).images.length,
    }));
  };

  // Navigate to the previous image
  const prevImage = (productId) => {
    setCurrentImageIndices((prevState) => ({
      ...prevState,
      [productId]:
        prevState[productId] === 0
          ? products.find((product) => product._id === productId).images
              .length - 1
          : prevState[productId] - 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Your Product</h1>
          <Link
            to="/Admin/create-product"
            className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          >
            + Create New Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 text-xl">
            No products available. Please add some products.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
              >
                <Link
                  to={`/Admin/product/${product._id}`}
                  className="block relative h-60"
                >
                  <img
                    src={`http://localhost:5000${product.images[currentImageIndices[product._id]]}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {product.images.length > 1 && (
                  <div className="flex justify-between items-center px-4 py-2 bg-gray-200">
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      onClick={(e) => {
                        e.preventDefault();
                        prevImage(product._id);
                      }}
                    >
                      &lt; Prev
                    </button>
                    <span className="text-gray-700 text-sm">
                      {currentImageIndices[product._id] + 1} /{' '}
                      {product.images.length}
                    </span>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      onClick={(e) => {
                        e.preventDefault();
                        nextImage(product._id);
                      }}
                    >
                      Next &gt;
                    </button>
                  </div>
                )}

                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 truncate">
                    {product.name}
                  </h2>

                  {product.isDiscount ? (
                    <p className="mt-2">
                      <span className="text-red-500 line-through">
                        USD {product.basePrice}
                      </span>{' '}
                      <span className="text-green-500 font-bold">
                        Discounted: USD {product.discountPrice}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2 text-green-500 font-bold">
                      USD {product.basePrice}
                    </p>
                  )}

                  <p
                    className={`mt-3 text-sm font-medium ${
                      product.quantity > 0 ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
