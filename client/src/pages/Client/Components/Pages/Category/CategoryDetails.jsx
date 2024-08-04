import React from 'react';
import ProductCard from '../../Products/ProductCard';

const products = [
  {
    id: '1',
    name: 'Sample Product',
    categoryDescription: 'Description of the product',
    images: ['/Assets/robot.png'],
    reviews: [{ rating: 4 }, { rating: 5 }],
    basePrice: 20,
    discountPrice: 15,
    isDiscount: true,
    discount: '25%',
    inStock: true,
  },
  // More products
];

export default function CategoryDetails() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-600 text-white text-center py-8 rounded-lg shadow-xl mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Discover Our Categories</h1>
        <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-6">
          Explore our diverse range of products and find what suits you best. From unique gifts to everyday essentials, our categories are crafted for your convenience.
        </p>
        <a
          href="#products"
          className="inline-block px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition ease-in-out duration-300"
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sub-Categories */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-3">Sub-Categories</h2>
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
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300"
            />

            {/* Filters */}
            <div className="flex space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300">
                <option>Sort by</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300">
                <option>Category</option>
                <option>Mask</option>
                <option>Cloths </option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
