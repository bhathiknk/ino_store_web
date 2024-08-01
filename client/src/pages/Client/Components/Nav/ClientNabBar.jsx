import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart, FaUser, FaBars, FaTshirt, FaPaintBrush, FaGem, FaHome,
  FaUtensils, FaHeart, FaGamepad, FaPencilAlt, FaGift
} from "react-icons/fa";
import {
  ChevronDownIcon, UserCircleIcon, Cog6ToothIcon, InboxArrowDownIcon,
  LifebuoyIcon, PowerIcon
} from "@heroicons/react/24/solid";
import Container from "./Container";

const categories = [
  { name: "Textiles & Apparel", icon: <FaTshirt />, description: "Clothing and fabric items" },
  { name: "Traditional Handicrafts", icon: <FaPaintBrush />, description: "Artisanal handmade products" },
  { name: "Jewelry & Accessories", icon: <FaGem />, description: "Fashionable jewelry and accessories" },
  { name: "Home Decor", icon: <FaHome />, description: "Decorative items for your home" },
  { name: "Kitchen & Dining", icon: <FaUtensils />, description: "Kitchenware and dining essentials" },
  { name: "Beauty & Personal Care", icon: <FaHeart />, description: "Beauty products and personal care" },
  { name: "Toys & Games", icon: <FaGamepad />, description: "Fun toys and games for all ages" },
  { name: "Stationery", icon: <FaPencilAlt />, description: "Stationery and office supplies" },
  { name: "Gifts & Souvenirs", icon: <FaGift />, description: "Gifts and keepsakes" },
  { name: "Art & Collectibles", icon: <FaPaintBrush />, description: "Artwork and collectibles" },
];

const profileMenuItems = [
  { label: "My Profile", icon: UserCircleIcon, path: "/profile" },
  { label: "Edit Profile", icon: Cog6ToothIcon, path: "/edit-profile" },
  { label: "Inbox", icon: InboxArrowDownIcon, path: "/inbox" },
  { label: "Help", icon: LifebuoyIcon, path: "/help" },
  { label: "Sign Out", icon: PowerIcon, path: "/sign-out" },
];

export default function ClientNavBar() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

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
              E-Com-Innovation-Web-Logo
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
              <div className="relative">
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
              <Link to="/cart" className="flex items-center text-gray-700 hover:text-gray-900">
                <FaShoppingCart className="mr-2" />
                Cart
              </Link>
              <Link to="/client-login" className="flex items-center text-gray-700 hover:text-gray-900">
                <FaUser className="mr-2" />
                Username
              </Link>
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <FaUser className="mr-2" />
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
