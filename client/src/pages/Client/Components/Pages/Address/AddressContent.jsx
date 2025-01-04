import React, { useState, useEffect } from 'react';
import {
  PencilIcon,
  CheckIcon,
  MapPinIcon,
  PhoneIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
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
          }
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
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
        toast.success('Address updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update address');
    }
  };

  return (
    <div className="px-8 md:px-24 mx-auto max-w-7xl mt-20 mb-20 bg-gray-50 rounded-xl shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <form className="p-10">
        <div className="space-y-8">
          {!isEditing && (
            <div className="border border-gray-300 rounded-lg p-10 bg-white shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900">
                Shipping Details
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Check your shipping details below!
              </p>

              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-4">
                  <MapPinIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">Address</p>
                    <p className="text-lg text-gray-600">
                      {addressDetails.address || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Province
                    </p>
                    <p className="text-lg text-gray-600">
                      {addressDetails.province || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-blue-500 text-2xl">📮</span>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      ZIP Code
                    </p>
                    <p className="text-lg text-gray-600">
                      {addressDetails.zip || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <PhoneIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Mobile Number
                    </p>
                    <p className="text-lg text-gray-600">
                      {addressDetails.mobile || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-10">
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="rounded-lg bg-blue-600 text-white py-3 px-6 flex items-center text-lg font-medium hover:bg-blue-700 shadow-lg transition duration-300"
                >
                  <PencilIcon className="h-6 w-6 mr-3" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="rounded-lg bg-green-600 text-white py-3 px-6 flex items-center text-lg font-medium hover:bg-green-700 shadow-lg transition duration-300"
                >
                  <CheckIcon className="h-6 w-6 mr-3" />
                  Checkout
                </button>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="border border-gray-300 rounded-lg p-10 bg-white shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900">Edit Address</h2>
              <p className="mt-2 text-lg text-gray-600">
                Make sure your shipping details are accurate.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <label className="block text-lg font-medium text-gray-900">
                    Address
                  </label>
                  <input
                    type="text"
                    value={addressDetails.address}
                    onChange={(e) =>
                      setAddressDetails({
                        ...addressDetails,
                        address: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-lg border-gray-300 shadow-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900">
                    Province
                  </label>
                  <input
                    type="text"
                    value={addressDetails.province}
                    onChange={(e) =>
                      setAddressDetails({
                        ...addressDetails,
                        province: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-lg border-gray-300 shadow-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={addressDetails.zip}
                    onChange={(e) =>
                      setAddressDetails({
                        ...addressDetails,
                        zip: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-lg border-gray-300 shadow-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={addressDetails.mobile}
                    onChange={(e) =>
                      setAddressDetails({
                        ...addressDetails,
                        mobile: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-lg border-gray-300 shadow-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-10 space-x-6">
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="rounded-lg bg-gray-400 text-gray-900 py-3 px-6 hover:bg-gray-500 text-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSaveClick}
                  className="rounded-lg bg-blue-600 text-white py-3 px-6 hover:bg-blue-700 text-lg font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
