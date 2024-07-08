import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const CreateProduct = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <FaArrowLeft className="mr-2 text-gray-700" />
          <Link to="/" className="text-gray-700">Back to product listing</Link>
        </div>
        <div className="flex items-center">
          <button className="text-gray-700 border border-gray-300 rounded px-4 py-2 mr-4">Cancel</button>
          <Link to="/price-information" className="bg-blue-500 text-white rounded px-4 py-2">Next</Link>
        </div>
      </div>

      <div className="flex flex-grow flex-wrap">
        <div className="w-full lg:w-1/4 p-6">
          <div className="bg-white shadow-md rounded-lg p-6 h-full">
            <form>
              <ul>
                <li className="mb-4">
                  <Link to="#" className="text-blue-500 font-bold">Basic Information</Link>
                </li>
                <li className="mb-4">
                  <Link to="#">Price Information</Link>
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
              <h2 className="text-lg font-bold mb-6">Basic Information</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Product title</label>
                  <input type="text" className="w-full mt-2 p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Product category</label>
                  <input type="text" className="w-full mt-2 p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Vendor</label>
                  <input type="text" className="w-full mt-2 p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Tags</label>
                  <input type="text" className="w-full mt-2 p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea className="w-full mt-2 p-2 border rounded" rows="5"></textarea>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Media</h3>
                  <div className="flex flex-wrap">
                    <img src="image1.jpg" alt="Media 1" className="h-24 w-24 mr-2 border" />
                    <img src="image2.jpg" alt="Media 2" className="h-24 w-24 mr-2 border" />
                    <img src="image3.jpg" alt="Media 3" className="h-24 w-24 mr-2 border" />
                    <div className="h-24 w-24 border flex items-center justify-center text-gray-500">+</div>
                  </div>
                </div>
              </form>
            </div>
            <div className="w-full lg:w-1/3 bg-white shadow-md rounded-lg p-6 flex-grow">
              <h2 className="text-lg font-bold mb-6">Product Status</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Status</label>
                  <select className="w-full mt-2 p-2 border rounded">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Sale channels and Apps</label>
                  <div className="flex items-center mb-2">
                    <input type="checkbox" className="mr-2" />
                    <span>Select all</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <input type="checkbox" className="mr-2" />
                    <span>Online Store</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Buy Button</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
