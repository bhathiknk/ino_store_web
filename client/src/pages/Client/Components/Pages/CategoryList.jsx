// src/pages/Client/Components/CategoryList.jsx

import React from 'react';
import {
  FaTshirt,
  FaHandHoldingHeart,
  FaGem,
  FaHome,
  FaUtensils,
  FaSpa,
  FaGamepad,
  FaPenFancy,
  FaGift,
  FaPaintBrush,
} from 'react-icons/fa';

const categories = [
  { name: 'Textiles & Apparel', icon: <FaTshirt /> },
  { name: 'Traditional Handicrafts', icon: <FaHandHoldingHeart /> },
  { name: 'Jewelry & Accessories', icon: <FaGem /> },
  { name: 'Home Decor', icon: <FaHome /> },
  { name: 'Kitchen & Dining', icon: <FaUtensils /> },
  { name: 'Beauty & Personal Care', icon: <FaSpa /> },
  { name: 'Toys & Games', icon: <FaGamepad /> },
  { name: 'Stationery', icon: <FaPenFancy /> },
  { name: 'Gift and Souvenirs', icon: <FaGift /> },
  { name: 'Art and Collectibles', icon: <FaPaintBrush /> },
];

function CategoryList() {
  return (
    <div className="w-64 p-4">
      <ul>
        {categories.map((category, index) => (
          <li
            key={index}
            className="flex items-center py-2 px-4 text-gray-700 hover:text-blue-600 cursor-pointer"
          >
            <span className="mr-2 text-lg">{category.icon}</span>
            <span className="text-md">{category.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
