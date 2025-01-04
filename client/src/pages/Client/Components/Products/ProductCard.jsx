import Rating from '@mui/material/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { TruncateText } from '../Utils/truncate';

// AddToCartButton Component
function AddToCartButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 px-4 text-white bg-blue-600 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
      {label}
    </button>
  );
}

// ProductCard Component
function ProductCard({ data }) {
  const navigate = useNavigate();

  // Calculate average rating from reviews
  const calculateAverageRating = (reviews = []) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating(data.reviews || []);

  // Handle adding to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    navigate(`/client-product/${data._id}`);
  };

  // Navigate to product details page
  const handleNavigateToProductDetails = () => {
    navigate(`/client-product/${data._id}`);
  };

  return (
    <div
      onClick={handleNavigateToProductDetails}
      className="col-span-1 cursor-pointer border-[1px] border-slate-200 bg-slate-50 p-2 transition-transform duration-300 hover:scale-105 text-center text-small rounded-lg hover:shadow-sm"
    >
      <div className="relative flex flex-col items-center w-full gap-1">
        <div className="aspect-square overflow-hidden relative w-full rounded-sm">
          {data.images && data.images.length > 0 ? (
            <img
              src={`http://localhost:5000${data.images[0]}`}
              className="w-full h-full object-contain"
              alt={data.name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>
        <div className="mt-1 font-semibold text-md">
          {TruncateText(data.name, 25)}
        </div>
        <div className="text-xs text-gray-600 mb-1">
          {TruncateText(data.categoryDescription, 40)}
        </div>
        <div className="text-sm text-gray-600 mb-1">
          <Rating value={averageRating} readOnly size="small" />
        </div>
        <div className="text-xs text-gray-500 mb-1">
          {data.reviews?.length || 0} review
          {data.reviews?.length !== 1 ? 's' : ''}
        </div>
        <div className="text-md font-semibold mb-1">
          {data.isDiscount ? (
            <div className="flex flex-col items-center">
              <span className="text-gray-500 line-through">
                Rs.{data.basePrice.toFixed(2)}
              </span>
              <span className="text-red-500">
                Rs.{data.discountPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <span>Rs.{data.basePrice.toFixed(2)}</span>
          )}
        </div>
        <div
          className={`text-xs ${
            data.quantity > 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {data.quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </div>
        <div className="mt-1 w-full">
          <AddToCartButton label="Add to Cart" onClick={handleAddToCart} />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
