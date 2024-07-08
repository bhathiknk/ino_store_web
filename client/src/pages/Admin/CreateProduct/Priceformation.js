import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const PriceInformation = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
        <div className="flex items-center">
          <FaArrowLeft className="mr-2 text-gray-700" />
          <Link to="/create-product" className="text-gray-700">Back to Basic Information</Link>
        </div>
        </div>
        <div className="flex items-center">
          <button className="text-gray-700 border border-gray-300 rounded px-4 py-2 mr-4">Cancel</button>
          <button className="bg-blue-500 text-white rounded px-4 py-2">Next</button>
        </div>
      </div>

      <div className="flex flex-grow flex-wrap">

      <div className="w-full lg:w-1/4 p-6">
          <div className="bg-white shadow-md rounded-lg p-6 h-full">
            <form>
              <ul>
                <li className="mb-4">
                  <Link to="#">Basic Information</Link>
                </li>
                <li className="mb-4">
                  <Link to="#" className="text-blue-500 font-bold">Price Information</Link>
                </li>
                <li className="mb-4">
                  <Link to="#">Shipping</Link>
                </li>
                <li>
                  <Link to="#">Publishing</Link>
                </li>
              </ul>
            </form>
          </div>
        </div>

        <div className="w-full lg:w-3/4 p-6">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="w-full lg:w-2/3 bg-white shadow-md rounded-lg p-6 mb-6 lg:mb-0 lg:mr-6">
              <h2 className="text-lg font-bold mb-6">Sale Information</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Price</label>
                  <input type="text" className="w-full mt-2 p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Compare-at price</label>
                  <input type="text" className="w-full mt-2 p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Cost per item</label>
                  <input type="text" className="w-full mt-2 p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Profit</label>
                  <input type="text" className="w-full mt-2 p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Margin</label>
                  <input type="text" className="w-full mt-2 p-2 border rounded" />
                </div>
              </form>
            </div>
            <div className="w-full lg:w-1/3 bg-white shadow-md rounded-lg p-6 flex-grow">
              <h2 className="text-lg font-bold mb-6">Inventory</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Quantity</label>
                  <input type="number" className="w-full mt-2 p-2 border rounded" />
                </div>
                <div className="mb-4 flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="block text-gray-700">Stop selling when out of stock</label>
                </div>
                <div className="mb-4 flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="block text-gray-700">Barcode/ SKU</label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceInformation;
