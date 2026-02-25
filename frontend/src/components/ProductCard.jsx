import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  // Generate consistent image based on product ID
  const productImages = [
    'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1593073862407-a3ce22748763?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1543051932-6ef9fecfbc80?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526402095832-90f7e3c13b8c?w=400&h=400&fit=crop'
  ];

  // Get image based on product ID hash
  const getImageIndex = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % productImages.length;
  };

  const imageUrl = product.images?.[0] || productImages[getImageIndex(product._id || product.id)];
  const subCategory = product.sport?.name || 'General';
  const rating = product.rating || (3.5 + Math.random() * 1.5); // Generate rating between 3.5-5

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000); // Reset after 2 seconds
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product._id || product.id)) {
      removeFromWishlist(product._id || product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isWishlisted = isInWishlist(product._id || product.id);

  return (
    <Link 
      to={`/products/${product._id || product.id}`}
      className="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 overflow-hidden group relative"
    >
      {/* Product Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Stock Badges */}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg backdrop-blur-sm">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
            Out of Stock
          </div>
        )}
        
        {/* Discount Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
          23% OFF
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* SubCategory */}
        <p className="text-xs text-blue-600 font-bold mb-2 uppercase tracking-wider flex items-center gap-1">
          <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
          {subCategory}
        </p>

        {/* Product Name */}
        <h3 className="font-black text-base mb-3 line-clamp-2 min-h-[3rem] text-gray-900 group-hover:text-blue-600 transition">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(rating)
                    ? 'text-yellow-400 fill-current'
                    : star - 0.5 <= rating
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={star - 0.5 <= rating && star > Math.floor(rating) ? 'url(#half)' : 'currentColor'}
              >
                {star - 0.5 <= rating && star > Math.floor(rating) && (
                  <defs>
                    <linearGradient id="half">
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="#D1D5DB" />
                    </linearGradient>
                  </defs>
                )}
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-1 font-semibold">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4 py-3 border-t border-b border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400 line-through font-medium">
              ₹{Math.round(product.price * 1.3).toLocaleString()}
            </span>
            <span className="text-xs text-green-600 font-bold ml-auto">
              Save ₹{Math.round(product.price * 0.3).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`flex-shrink-0 p-3 rounded-xl font-semibold text-sm transition-all duration-300 border-2 transform hover:scale-105 ${
              isWishlisted
                ? 'bg-gradient-to-r from-red-500 to-pink-600 border-red-500 text-white shadow-lg shadow-red-500/50'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <svg 
              className={`w-5 h-5 ${isWishlisted ? 'fill-current animate-pulse' : ''}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor" 
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isAddedToCart
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/50'
                : 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 active:scale-95 shadow-blue-500/50'
            }`}
          >
            {product.stock === 0 ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
                Out of Stock
              </span>
            ) : isAddedToCart ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Added to Cart
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </span>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}