import React, { useState, useEffect } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddressContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    id: '',
    address: '',
    province: '',
    zip: '',
    mobile: '',
  });
  const navigate = useNavigate();

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Cancel edit mode
  const handleCancelClick = () => {
    setIsEditing(false);
  };

  // Navigate to the checkout page
  const handleCheckoutClick = () => {
    navigate('/checkout', { state: { address: addressDetails } });
  };

  // Fetch address details on component mount
  useEffect(() => {
    const fetchAddressDetails = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get(
          'http://localhost:5000/api/address/user',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data && response.data.length > 0) {
          const address = response.data[0];
          setAddressDetails({
            id: address._id,
            address: address.address,
            province: address.province,
            zip: address.zipcode,
            mobile: address.contactNumber,
          });
        }
      } catch (err) {
        toast.error('Failed to fetch address details');
      }
    };

    fetchAddressDetails();
  }, []);

  // Handle address update
  const handleSaveClick = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.put(
        `http://localhost:5000/api/address/update/${addressDetails.id}`,
        {
          address: addressDetails.address,
          province: addressDetails.province,
          zipcode: addressDetails.zip,
          contactNumber: addressDetails.mobile,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        setIsEditing(false);
        setAddressDetails({
          id: response.data._id,
          address: response.data.address,
          province: response.data.province,
          zip: response.data.zipcode,
          mobile: response.data.contactNumber,
        });
        toast.success('Address updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update address');
    }
  };

  return (
    <div className="px-20 mx-auto max-w-5xl mt-20 mb-10">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <form>
        <div className="space-y-6">
          {!isEditing && (
            <div className="border-b border-gray-900/10 pb-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Shipping Details
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Check your shipping details below!
              </p>

              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Address
                  </label>
                  <p className="mt-2 py-1.5 px-2 bg-gray-100 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                    {addressDetails.address || 'N/A'}
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Province
                  </label>
                  <p className="mt-2 py-1.5 px-2 bg-gray-100 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                    {addressDetails.province || 'N/A'}
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    ZIP Code
                  </label>
                  <p className="mt-2 py-1.5 px-2 bg-gray-100 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                    {addressDetails.zip || 'N/A'}
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Mobile Number
                  </label>
                  <p className="mt-2 py-1.5 px-2 bg-gray-100 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                    {addressDetails.mobile || 'N/A'}
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
                  <button
                    type="button"
                    onClick={handleCheckoutClick}
                    className="rounded-md bg-green-500 text-white py-2 px-6 hover:bg-green-600 shadow-md transition duration-300 ease-in-out flex items-center space-x-2"
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Checkout</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="border-b border-gray-900/10 pb-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Edit Address
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Make sure your shipping details are accurate.
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
                    placeholder="Enter your address"
                    value={addressDetails.address}
                    onChange={(e) =>
                      setAddressDetails({
                        ...addressDetails,
                        address: e.target.value,
                      })
                    }
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
                    placeholder="Enter your province"
                    value={addressDetails.province}
                    onChange={(e) =>
                      setAddressDetails({
                        ...addressDetails,
                        province: e.target.value,
                      })
                    }
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
                    placeholder="Enter your ZIP code"
                    value={addressDetails.zip}
                    onChange={(e) =>
                      setAddressDetails({
                        ...addressDetails,
                        zip: e.target.value,
                      })
                    }
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
                    placeholder="Enter your mobile number"
                    value={addressDetails.mobile}
                    onChange={(e) =>
                      setAddressDetails({
                        ...addressDetails,
                        mobile: e.target.value,
                      })
                    }
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
                    onClick={handleSaveClick}
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
