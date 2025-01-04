import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import cbanner1 from '../../Images/ClientBanner/inowebbanner1.png';
import cbanner2 from '../../Images/ClientBanner/inowebbanner2.png';

const banners = [
  {
    src: cbanner1,
    alt: 'Banner 1',
    title: 'Year End Season Offer!',
    subtitle: 'Enjoy discounts on selected Items',
    highlight: 'UP TO 50% OFF AND MORE BENEFITS',
  },
  {
    src: cbanner2,
    alt: 'Banner 2',
    title: 'New Year Sale!',
    subtitle: 'Great deals on new arrivals',
    highlight: 'LIMITED TIME ONLY',
  },
  {
    src: cbanner1,
    alt: 'Banner 3',
    title: 'Summer Collection!',
    subtitle: 'Fresh styles for summer',
    highlight: 'CHECK OUT THE LATEST TRENDS',
  },
  {
    src: cbanner2,
    alt: 'Banner 4',
    title: 'Holiday Specials!',
    subtitle: 'Exclusive offers for the holidays',
    highlight: 'EXTRA DISCOUNTS ON SELECT ITEMS',
  },
];

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Auto-swap every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + banners.length) % banners.length,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-80 mb-12 rounded-lg overflow-hidden">
      {/* Slider Images */}
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Banner Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-8 py-12 bg-black bg-opacity-20">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          {banners[currentIndex].title}
        </h1>
        <p className="text-sm md:text-lg mb-2">
          {banners[currentIndex].subtitle}
        </p>
        <p className="text-xl md:text-3xl font-bold text-yellow-400">
          {banners[currentIndex].highlight}
        </p>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full  hover:bg-blue-600 duration-700"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-blue-600 duration-700"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
}
