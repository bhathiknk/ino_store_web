import React, { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { FaCheck, FaXmark,FaPencil,FaEdit, FaCartShopping     } from "react-icons/fa6";

export default function AddressContent() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="px-20 mx-auto max-w-5xl mt-20 mb-10">
      <form>
        <div className="space-y-6">
          {/* Display Mode */}
          {!isEditing && (
            <div className="border-b border-gray-900/10 pb-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Shipping Details
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Check Your Shipping Details!
              </p>

              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Address
                  </label>
                  <p className="mt-2 py-1.5 px-2 bg-gray-100 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                    no2, abc Road, Colombo Sri Lanka
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Province
                  </label>
                  <p className="mt-2 py-1.5 px-2 bg-gray-100 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                    Western Province
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    ZIP Code
                  </label>
                  <p className="mt-2 py-1.5 px-2 bg-gray-100 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                    12345
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Mobile Number
                  </label>
                  <p className="mt-2 py-1.5 px-2 bg-gray-100 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                    +94 112 567666
                  </p>
                </div>

                <div className="sm:col-span-6 flex justify-between mt-4">
                  <button 
                    type="button" 
                    onClick={handleEditClick}
                    className="rounded-md bg-blue-500 text-white py-2 px-6 hover:bg-blue-600 shadow-md transition duration-300 ease-in-out flex items-center space-x-2"
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span>Edit</span>
                  </button>
                  <button className="rounded-md bg-green-500 text-white py-2 px-6 hover:bg-green-600 shadow-md transition duration-300 ease-in-out flex items-center space-x-2">
                    <FaCartShopping className="h-5 w-5" />
                    <span>Checkout</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <div className="border-b border-gray-900/10 pb-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Edit Address
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Check Your Shipping Details Correctly!
              </p>

              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter Your Address"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Province
                  </label>
                  <input
                    type="text"
                    name="province"
                    id="province"
                    placeholder="Enter Your Province"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    id="zip"
                    placeholder="Enter Your ZIP Code"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    id="mobile"
                    placeholder="Enter Your Mobile Number"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="col-span-full flex justify-end mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="rounded-md bg-gray-300 text-gray-700 py-2 px-4 shadow-md hover:bg-gray-400 transition duration-300 ease-in-out flex items-center space-x-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-500 text-white py-2 px-4 shadow-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center space-x-2"
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
//test