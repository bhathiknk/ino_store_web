import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { RiLoginCircleFill } from "react-icons/ri";
import { TruncateText } from '../Utils/truncate';
import inoWebLogo from '../../Images/NavBar/inoweb-w-sh.png'

import {
  FaShoppingCart, FaUser, FaBars, FaTshirt, FaPaintBrush, FaGem, FaHome,
  FaUtensils, FaHeart, FaGamepad, FaPencilAlt, FaGift, FaUserCog,
} from "react-icons/fa";
import {
  ChevronDownIcon, UserCircleIcon, Cog6ToothIcon, InboxArrowDownIcon,
  LifebuoyIcon, PowerIcon
} from "@heroicons/react/24/solid";
import Container from "./Container";

const categories = [
  { name: "Traditional Handicrafts", icon: <FaPaintBrush />, description: TruncateText("Masks, Puppets, Batik Art, Lacquerware", 30) },
  { name: "Textiles & Apparel", icon: <FaTshirt />, description: TruncateText("Sarongs, Handloom Fabrics, Traditional Clothing, Hand-painted Apparel", 30) },
  { name: "Jewelry & Accessories", icon: <FaGem />, description: TruncateText("Gemstone Jewelry, Beaded Jewelry, Handcrafted Bags, Natural Fiber Hats", 30) },
  { name: "Home Decor", icon: <FaHome />, description: TruncateText("Wooden Carvings, Handmade Cushions, Woven Rugs, Wall Hangings", 30) },
  { name: "Kitchen & Dining", icon: <FaUtensils />, description: TruncateText("Handmade Utensils, Pottery, Coconut Shell Bowls, Table Linens", 30) },
  { name: "Beauty & Personal Care", icon: <FaHeart />, description: TruncateText("Natural Soaps, Herbal Oils, Skincare Products, Hair Accessories", 30) },
  { name: "Toys & Games", icon: <FaGamepad />, description: TruncateText("Handmade Dolls, Wooden Toys, Traditional Games, Educational Toys", 30) },
  { name: "Stationery", icon: <FaPencilAlt />, description: TruncateText("Handmade Paper, Notebooks, Greeting Cards, Calligraphy Supplies", 30) },
  { name: "Gifts & Souvenirs", icon: <FaGift />, description: TruncateText("Personalized Gifts, Souvenir Magnets, Keychains, Handmade Cards", 30) },
  { name: "Art & Collectibles", icon: <FaPaintBrush />, description: TruncateText("Paintings, Sculptures, Photography, Limited Edition Prints", 30) },
];

const profileMenuItems = [
  { label: "My Profile", icon: UserCircleIcon, path: "/profile" },
  { label: "Edit Profile", icon: Cog6ToothIcon, path: "/edit-profile" },
  { label: "Inbox", icon: InboxArrowDownIcon, path: "/inbox" },
  { label: "Help", icon: LifebuoyIcon, path: "/help" },
  { label: "Sign Out", icon: PowerIcon, path: "/sign-out" },
];

export default function ClientNavBar() {
  // State to manage dropdown visibility
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  
  // Refs to access dropdown elements for click detection
  const userDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Effect to handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user dropdown if click is outside
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      // Close category dropdown if click is outside
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    };

    // Add event listener for mousedown
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup event listener on component unmount
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle functions for dropdowns
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
    setCategoryDropdownOpen(false);
  };

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
    setUserDropdownOpen(false);
  };

  return (
    <div className="sticky top-0 w-full bg-white z-30 shadow-sm">
      <div className="py-4 border-b-[1px] border-gray-200">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Link to="/" className="text-xl font-bold text-gray-800">
              <img src={inoWebLogo} alt="E-Com Innovation Web Logo" className="h-8 w-auto md:h-10 md:w-auto" />
            </Link>
            <div className="hidden md:flex items-center w-full md:w-auto">
              <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
                <div className="grid place-items-center h-full w-12 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                  type="text"
                  id="search"
                  placeholder="Search something.." />
              </div>
            </div>
            <div className="flex items-center gap-8 md:gap-12 relative">
              <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900">
                <FaHome className="mr-2" />
                Home
              </Link>
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={toggleCategoryDropdown}
                  className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <FaBars className="mr-2" />
                  Categories
                </button>
                {categoryDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-20">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={`/${category.name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        {category.icon}
                        <div className="ml-2">
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900">
                <FaUser className="mr-2" />
                Username
              </Link>
              <Link to="/client-login" className="flex items-center text-gray-700 hover:text-gray-900">
                <RiLoginCircleFill className="mr-2" />
                Login
              </Link>
              <Link to="/cart" className="flex items-center text-gray-700 hover:text-gray-900">
                <FaShoppingCart className="mr-2" />
                Cart
              </Link>

              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <FaUserCog className="mr-2" />
                  User Menu
                  <ChevronDownIcon
                    strokeWidth={2}
                    className={`h-4 w-4 ml-2 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                    {profileMenuItems.map(({ label, icon, path }, key) => (
                      <Link
                        key={label}
                        to={path}
                        className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md ${key === profileMenuItems.length - 1 ? "text-red-500" : ""}`}
                      >
                        {React.createElement(icon, {
                          className: `h-4 w-4 mr-2 ${key === profileMenuItems.length - 1 ? "text-red-500" : ""}`,
                          strokeWidth: 2,
                        })}
                        <span className={`font-normal ${key === profileMenuItems.length - 1 ? "text-red-500" : ""}`}>
                          {label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
