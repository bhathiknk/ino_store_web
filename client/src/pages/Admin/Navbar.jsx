import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from './Assets/user-icon.jpg';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (token) {
          const response = await axios.get(
            'http://localhost:5000/api/admin/details',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setAdminName(response.data.name);
        }
      } catch (error) {
        console.error('Failed to fetch admin details', error);
      }
    };

    fetchAdminName();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close the mobile menu after navigating
  };

  const isActive = (path) =>
    location.pathname === path ? 'text-blue-500' : 'text-gray-700';

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold text-gray-700">INO store</span>
          <span className="text-S font-bold text-gray-500">for sellers</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => handleNavigation('/Admin/ProductPage')}
            className={`flex items-center ${isActive('/Admin/ProductPage')} hover:text-blue-500`}
          >
            <i className="fas fa-box" /> Products
          </button>
          <button
            onClick={() => handleNavigation('/Admin/SalesSummary')}
            className={`flex items-center ${isActive('/Admin/SalesSummary')} hover:text-blue-500`}
          >
            <i className="fas fa-shopping-cart" /> Sales
          </button>
          <button
            onClick={() => handleNavigation('/Admin/orders')}
            className={`flex items-center ${isActive('/Admin/orders')} hover:text-blue-500`}
          >
            <i className="fas fa-receipt" /> Orders
          </button>
        </nav>
        <div className="flex items-center space-x-4">
          <i className="fas fa-cog text-gray-700" />
          <i className="fas fa-bell text-gray-700" />
          {adminName && (
            <span className="text-gray-700 font-bold">welcome {adminName}</span>
          )}
          <img src={logo} alt="User Avatar" className="h-8 w-8 rounded-full" />
        </div>
        <button
          className="md:hidden flex items-center text-gray-700 hover:text-blue-500"
          onClick={toggleMenu}
        >
          <i className="fas fa-bars" />
          <span className="ml-2">Menu</span>
        </button>
      </div>
      {isOpen && (
        <nav className="md:hidden bg-white shadow-md p-4">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleNavigation('/Admin/ProductPage')}
              className={`flex items-center ${isActive('/Admin/ProductPage')} hover:text-blue-500`}
            >
              <i className="fas fa-box" /> Products
            </button>
            <button
              onClick={() => handleNavigation('/Admin/SalesSummary')}
              className={`flex items-center ${isActive('/Admin/SalesSummary')} hover:text-blue-500`}
            >
              <i className="fas fa-shopping-cart" /> Sales
            </button>
            <button
              onClick={() => handleNavigation('/Admin/orders')}
              className={`flex items-center ${isActive('/Admin/orders')} hover:text-blue-500`}
            >
              <i className="fas fa-receipt" /> Orders
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
