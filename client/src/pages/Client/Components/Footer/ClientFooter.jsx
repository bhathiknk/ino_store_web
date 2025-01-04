import React from 'react';
import { Link } from 'react-router-dom'; // Use Link from react-router-dom
import { MdFacebook } from 'react-icons/md';
import { AiFillTwitterCircle, AiFillInstagram } from 'react-icons/ai';
import FooterList from './FooterList';
import Container from '../Nav/Container';

export default function ClientFooter() {
  return (
    <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
          <FooterList>
            <h3 className="text-base font-bold mb-2">Categories</h3>
            {/* Updated Links */}
            <Link to="/category/Textiles & Apparel" className="hover:underline">
              Textiles & Apparel
            </Link>
            <Link
              to="/category/Traditional-Handicrafts"
              className="hover:underline"
            >
              Traditional Handicrafts
            </Link>
            <Link to="/category/category3" className="hover:underline">
              Jewelry & Accessories
            </Link>
            <Link to="/category/category4" className="hover:underline">
              Home Decor
            </Link>
            <Link to="/category/category5" className="hover:underline">
              Kitchen & Dining
            </Link>
            <Link to="/category/category6" className="hover:underline">
              Beauty & Personal Care
            </Link>
            <Link to="/category/category6" className="hover:underline">
              Toys & Games
            </Link>
            <Link to="/category/category6" className="hover:underline">
              Stationery{' '}
            </Link>
            <Link to="/category/category6" className="hover:underline">
              Gifts & Souvenirs
            </Link>
            <Link to="/category/category6" className="hover:underline">
              Art & Collectibles
            </Link>
          </FooterList>

          <FooterList>
            <h3 className="text-base font-bold mb-2">Customer Service</h3>
            <Link to="/contact" className="hover:underline">
              Contact Us
            </Link>
          </FooterList>

          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-base font-bold mb-2">About Us</h3>
            <p className="mb-2">
              Welcome to InoWeb, your one-stop destination for authentic Sri
              Lankan handcrafted products. We take pride in connecting you with
              local artisans who create timeless pieces inspired by tradition,
              culture, and heritage. At InoWeb, we believe in promoting
              sustainable craftsmanship while empowering communities by bringing
              their creations to a global audience. Our curated collection
              showcases the beauty of handmade artistry, ensuring each product
              tells a unique story of Sri Lanka&apos;s rich cultural roots.
            </p>
            <p>&copy; 2024 E-Com-Innovation. All rights reserved.</p>
          </div>

          <FooterList>
            <h3 className="text-base font-bold mb-2">Follow Us</h3>
            <div className="flex gap-2">
              <Link to="#" className="hover:opacity-75">
                <MdFacebook size={24} />
              </Link>
              <Link to="#" className="hover:opacity-75">
                <AiFillInstagram size={24} />
              </Link>
              <Link to="#" className="hover:opacity-75">
                <AiFillTwitterCircle size={24} />
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer>
  );
}
