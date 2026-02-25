import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

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

  const getImageIndex = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % productImages.length;
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-6">
            <svg 
              className="w-24 h-24 text-gray-400 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-8 text-lg">Save your favorite items for later!</p>
          <Link 
            to="/products" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Wishlist</h1>
          <p className="text-gray-600 text-lg">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(product => {
            const imageUrl = product.images?.[0] || productImages[getImageIndex(product._id)];
            
            return (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Product Image */}
                <Link to={`/products/${product._id}`}>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Only {product.stock} left
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-4">
                  <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">
                    {product.sport?.name || 'General'}
                  </p>
                  
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-bold text-base mb-2 line-clamp-2 text-gray-800 hover:text-blue-600 transition">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{Math.round(product.price * 1.3).toLocaleString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                        product.stock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                      }`}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="flex-shrink-0 p-2.5 rounded-lg font-semibold text-sm transition-all border-2 bg-red-500 border-red-500 text-white hover:bg-red-600"
                      title="Remove from wishlist"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
