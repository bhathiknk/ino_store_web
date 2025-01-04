// src/pages/Client/Components/Nav/ClientNavBar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiLoginCircleFill } from 'react-icons/ri';
import {
  FaShoppingCart,
  FaUser,
  FaUserCog,
  FaBars,
  FaTshirt,
  FaPaintBrush,
  FaGem,
  FaHome,
  FaUtensils,
  FaHeart,
  FaGamepad,
  FaPencilAlt,
  FaGift,
} from 'react-icons/fa';
import {
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  PowerIcon,
} from '@heroicons/react/24/solid';

import Container from './Container';
import inoWebLogo from '../../Images/NavBar/inoweb.png';

// Helper function to truncate text
const truncateText = (text, maxLength) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

// Define the profile menu items with labels, icons, and paths
const profileMenuItems = [
  { label: 'My Profile', icon: UserCircleIcon, path: '/client-user-profile' },
  {
    label: 'Edit Profile',
    icon: Cog6ToothIcon,
    path: '/client-user-profile-edit',
  },
  { label: 'Orders', icon: ShoppingBagIcon, path: '/client-user-orders' },
  {
    label: 'Terms & Conditions',
    icon: DocumentTextIcon,
    path: '/client-terms-and-conditions',
  },
  { label: 'Logout', icon: PowerIcon, path: '/sign-out', action: 'logout' },
];

// Mapping of category names to icons
const categoryIcons = {
  'Textiles & Apparel': FaTshirt,
  'Traditional Handicrafts': FaPaintBrush,
  'Jewelry & Accessories': FaGem,
  'Home Decor': FaHome,
  'Kitchen & Dining': FaUtensils,
  'Beauty & Personal Care': FaHeart,
  'Toys & Games': FaGamepad,
  Stationery: FaPencilAlt,
  'Gift and Souvenirs': FaGift,
  'Art and Collectibles': FaPaintBrush,
};

export default function ClientNavBar() {
  const navigate = useNavigate();
  // State variables
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage

  // Removed 'userToken' to fix 'no-unused-vars' warning
  useEffect(() => {
    // You can use userToken here if needed
  }, []); // Empty dependency array means this effect runs once after initial render

  const logout = () => {
    localStorage.removeItem('user'); // Clear user data on logout
    localStorage.removeItem('userToken'); // Clear user token
    navigate('/client-login'); // Redirect to login page
  };

  // Refs for dropdowns
  const userDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Effect to handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Effect to fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/categories/get',
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Toggle user dropdown visibility
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
    setCategoryDropdownOpen(false);
  };

  // Toggle category dropdown visibility
  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
    setUserDropdownOpen(false);
  };

  return (
    <div className="sticky top-0 w-full bg-gray-100 z-30 shadow-sm">
      {/* Navbar */}
      <div className="py-4 border-b-[1px] border-gray-200">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            {/* Logo and Home Link */}
            <Link
              to="/"
              className="text-xl font-bold text-gray-800 flex items-center"
            >
              <img
                src={inoWebLogo}
                alt="E-Com Innovation Web Logo"
                className="h-12 w-auto object-contain md:h-12" // Fixed height and auto width
              />
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center w-full lg:w-2/3 mr-4">
              <div className="relative flex items-center w-full h-12 rounded-full border border-gray-300 bg-gray-100 overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
                <div className="grid place-items-center h-full w-12 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  className="peer h-full w-full outline-none text-sm text-gray-950 bg-gray-100 pl-4 pr-2"
                  type="text"
                  id="search"
                  placeholder="Search here..."
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-8 md:gap-12 relative">
              <Link
                to="/"
                className="flex items-center text-gray-700 hover:text-gray-900 transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                <FaHome className="mr-2" />
                Home
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={toggleCategoryDropdown}
                  className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-105"
                >
                  <FaBars className="mr-2" />
                  Categories
                </button>
                {categoryDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-20">
                    {categories.map((category) => {
                      // Get the icon for the category, default to FaHome if not found
                      const Icon = categoryIcons[category.name] || FaHome;
                      return (
                        <Link
                          key={category._id} // Assuming categories have _id
                          to={`/client-category/${encodeURIComponent(
                            category.name,
                          )}`} // Link to category details page with category ID
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <div className="mr-2">
                            <Icon /> {/* Display the corresponding icon */}
                          </div>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-gray-500">
                              {truncateText(category.description, 26)}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* User Links */}
              {!user ? (
                // Show Login Button if the user is not logged in
                <Link
                  to="/client-login"
                  className="flex items-center text-gray-700 hover:text-gray-900 transition-transform duration-300 ease-in-out transform hover:scale-105"
                >
                  <RiLoginCircleFill className="mr-2" />
                  <span>Login</span>
                </Link>
              ) : (
                <>
                  {/* Display the logged user's name */}
                  <Link
                    to="/client-user-profile"
                    className="flex items-center text-gray-700 hover:text-gray-900 hover:underline underline-offset-4 transition-transform duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaUser className="mr-2" />@{user.name}
                  </Link>

                  <Link
                    to="/client-cart"
                    className="flex items-center text-gray-700 hover:text-gray-900 transition-transform duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaShoppingCart className="mr-2" />
                    <span>Cart</span>
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={toggleUserDropdown}
                      className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-105"
                    >
                      <FaUserCog className="mr-2" />
                      <span>User</span>
                      <ChevronDownIcon
                        strokeWidth={2}
                        className={`h-4 w-4 ml-2 transition-transform ${
                          userDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                        {profileMenuItems.map(
                          ({ label, icon, path, action }, index) => (
                            <button
                              key={index}
                              onClick={action === 'logout' ? logout : undefined}
                              className={`flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                                action === 'logout' ? 'text-red-500' : ''
                              }`}
                            >
                              {React.createElement(icon, {
                                className: `h-4 w-4 mr-2 ${
                                  action === 'logout'
                                    ? 'text-red-500 hover:text-blue-500 transition duration-300 ease-in-out'
                                    : ''
                                }`,
                                strokeWidth: 2,
                              })}
                              {action === 'logout' ? (
                                <span className="font-normal text-red-500 hover:text-blue-500 transition duration-300 ease-in-out">
                                  {label}
                                </span>
                              ) : (
                                <Link
                                  to={path}
                                  className="w-full text-gray-700"
                                >
                                  {label}
                                </Link>
                              )}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
