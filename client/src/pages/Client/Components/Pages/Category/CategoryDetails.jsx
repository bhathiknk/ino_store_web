import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook to get URL parameters
import ProductCard from '../../Products/ProductCard';

export default function CategoryDetails() {
  const { categoryName } = useParams(); // Get the categoryName from URL parameters
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decode the category name
  const decodedCategoryName = decodeURIComponent(categoryName);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Use the decoded category name for the API request
        const response = await fetch(
          `http://localhost:5000/api/products/products/category/${decodedCategoryName}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProducts(data); // Adjust based on your API response format
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [decodedCategoryName]); // Fetch products whenever the decodedCategoryName changes

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-600">Error: {error}</p>
      </div>
    );

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-600 text-white text-center py-16 px-8 rounded-lg shadow-lg mb-12">
        <h1 className="text-4xl font-extrabold mb-4">{decodedCategoryName}</h1>
        <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-6">
          Explore our collection of {decodedCategoryName} products, carefully
          curated to meet your needs.
        </p>
        <a
          href="#products"
          className="inline-block px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
        >
          Explore Now
        </a>
      </div>

      {/* Divider */}
      <div className="bg-gray-100 py-6 mb-8">
        <div className="container mx-auto px-4">
          <div className="h-1 bg-gradient-to-r from-blue-300 to-indigo-200 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-gray-100">
        {/* Sub-Categories */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-3">
            Sub-Categories
          </h2>
          <ul className="space-y-4">
            {/* Example sub-categories */}
            <li className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-shadow duration-300 shadow-sm hover:shadow-md cursor-pointer">
              <span className="text-lg font-medium">Sub-Category 1</span>
            </li>
            <li className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-shadow duration-300 shadow-sm hover:shadow-md cursor-pointer">
              <span className="text-lg font-medium">Sub-Category 2</span>
            </li>
            {/* More sub-categories */}
          </ul>
        </div>

        {/* Products List */}
        <div className="md:col-span-3">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search products..."
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />

            {/* Filters */}
            <div className="flex space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
                <option>Sort by</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
                <option>Category</option>
                <option>Mask</option>
                <option>Clothes</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          {products.length === 0 ? (
            <p className="text-center text-lg font-semibold text-gray-600">
              No products available in this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
