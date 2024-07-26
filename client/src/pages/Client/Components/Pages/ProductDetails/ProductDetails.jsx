import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../ClientProducts';
import { Rating } from '@mui/material';
import ClientNabBar from '../../Nav/ClientNabBar';
import ClientFooter from '../../Footer/ClientFooter';
import AddToCartButton from './AddToCartButton';
import SetQuantity from './SetQuantity';
import ProductImage from './ProductImage'; // Import the ProductImage component
import { useCart } from '../Cart/CartContext'; // Import the Cart context

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [selectedImage, setSelectedImage] = useState(''); // State for selected image
  const { id } = useParams(); // Get product ID from URL
  const product = products.find((p) => p.id === id); // Find product by ID
  const { dispatch } = useCart(); // Use the Cart context
  const navigate = useNavigate(); // Use navigate to redirect

  // Set the initial selected image when the product changes
  useEffect(() => {
    if (product && product.images.length > 0) {
      setSelectedImage(product.images[0].image);
    }
  }, [product]);

  if (!product) {
    return <div>Product not found</div>; // Show a message if the product is not found
  }

  // Calculate the average rating from the reviews
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  const HorizontalLine = () => {
    return <hr className="w-[30%] my-2"></hr>;
  };

  const averageRating = calculateAverageRating(product.reviews); // Calculate the average rating

  // Increase the quantity
  const handleQuantityIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Decrease the quantity
  const handleQuantityDecrease = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // Handle image selection
  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  // Handle adding the product to the cart
  const handleAddToCart = () => {
    const productToCart = {
      id: product.id,
      title: product.name,
      price: product.price,
      category: product.category,
      quantity: quantity,
      image: selectedImage,
    };
    dispatch({ type: 'ADD_TO_CART', payload: productToCart });
    navigate('/client-cart');
  };

  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <ClientNabBar />
        <main className="flex-grow py-6 md:py-8 lg:py-12">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Use the ProductImage component to display product images */}
              <ProductImage
                product={product}
                selectedImage={selectedImage}
                handleImageSelect={handleImageSelect}
              />
              <div className="flex flex-col gap-1 text-slate-500 text-sm">
                <h2 className="text-3xl font-medium text-slate-700">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Rating value={averageRating} readOnly />
                  <div>{product.reviews.length} reviews</div>
                </div>
                <HorizontalLine />
                <div className="text-justify">{product.description}</div>
                <HorizontalLine />
                <div>
                  <span className="font-semibold font-nunito">
                    CATEGORY: {product.category}
                  </span>
                </div>
                <div>
                  <span className="font-semibold font-nunito">
                    BRAND: {product.brand}
                  </span>
                </div>
                <div className={product.inStock ? 'text-green-400' : 'text-red-400'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
                <HorizontalLine />
                <div>
                  <span className="font-semibold font-kanit">Discount: {product.discount}</span>
                </div>
                <HorizontalLine />
                <div>
                  <span className="font-semibold font-kanit">Price: ${product.price}</span>
                </div>
                <HorizontalLine />
                {/* Render SetQuantity component */}
                <SetQuantity
                  cartProduct={{ quantity }}
                  cartCounter={quantity}
                  handelQuentityIncrease={handleQuantityIncrease}
                  handelQuentityDecrease={handleQuantityDecrease}
                />
                <HorizontalLine />
                <div className="max-w-[300px]">
                  {/* Render AddToCartButton component */}
                  <AddToCartButton label="Add to cart" onClick={handleAddToCart} />
                </div>
              </div>
            </div>
          </div>
        </main>
        <ClientFooter />
      </div>
    </div>
  );
};

export default ProductDetails;
