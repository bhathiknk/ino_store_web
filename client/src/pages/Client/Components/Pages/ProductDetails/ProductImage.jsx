import React from 'react';

const ProductImage = ({ product, selectedImage, handleImageSelect }) => {
  // Ensure product.images is defined and is an array of strings
  if (!Array.isArray(product.images)) {
    return <div className='font-normal py-5 px-5  max-w-full '>No images available</div>;
  }

  // Handle when no images are available
  if (product.images.length === 0) {
    return <div className='font-normal py-5 px-5  max-w-full '>No images available</div>;
  }

  // Default image to show if no image is selected
  const defaultImage = product.images[0]; // Show the first image by default

  return (
    <div className="grid grid-cols-6 gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      {/* Thumbnail images list */}
      <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px] rounded-md border-gray-300">
        {product.images.map((image, index) => (
          <div
            key={index}
            onClick={() => handleImageSelect(image)}
            className="relative w-full aspect-square rounded border hover:border-blue-900 transition duration-300"
          >
            <img
              src={`http://localhost:5000${image}`}
              alt={`Product image ${index}`}
              className="object-cover w-full h-full rounded border border-gray-300"
            />
          </div>
        ))}
      </div>
      {/* Large selected image */}
      <div className="col-span-5 relative aspect-square">
        <img
          src={`http://localhost:5000${selectedImage || defaultImage}`} // Use selectedImage if available, otherwise use defaultImage
          alt="Product"
          className="object-cover w-full h-full max-h-[500px] min-h-[300px] sm:min-h-[400px] rounded border border-gray-300"
        />
      </div>
    </div>
  );
};

export default ProductImage;
