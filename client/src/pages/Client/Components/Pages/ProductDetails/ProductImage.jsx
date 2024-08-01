import React from "react";
import PropTypes from "prop-types";

const ProductImage = ({ product, selectedImage, handleImageSelect }) => {
  return (
    <div className="grid grid-cols-6 gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      {/* Image list */}
      <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px] rounded-md">
        {product.images.map((imageObj, index) => (
          <div
            key={index}
            onClick={() => handleImageSelect(imageObj.image)}
            className="relative w-4/5 aspect-square rounded border-blue-700"
          >
            <img
              src={imageObj.image}
              alt={`Product image ${index}`}
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </div>
      {/* Large selected image */}
      <div className="col-span-5 relative aspect-square">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected Product"
            className="object-contain w-full h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]"
          />
        )}
      </div>
    </div>
  );
};

ProductImage.propTypes = {
  product: PropTypes.shape({
    images: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string.isRequired,
        colorCode: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
  }).isRequired,
  selectedImage: PropTypes.string,
  handleImageSelect: PropTypes.func.isRequired,
};

export default ProductImage;
