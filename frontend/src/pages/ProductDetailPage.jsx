import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService, reviewService } from '../services/api';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useContext(AuthContext);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Related products state
  const [relatedProducts, setRelatedProducts] = useState([]);

  const resolveProductById = useCallback((payload, productId) => {
    if (!payload) return null;

    if (!Array.isArray(payload)) {
      return payload?._id === productId ? payload : payload;
    }

    return payload.find((item) => item?._id === productId) || null;
  }, []);

  const loadReviews = useCallback(async (productId) => {
    try {
      const data = await reviewService.list(productId);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
    }
  }, []);

  const loadProductDetails = useCallback(async () => {
    setIsLoading(true);
    setPageError('');

    try {
      const data = await productService.get(id);
      const selectedProduct = resolveProductById(data, id);

      if (!selectedProduct?._id) {
        throw new Error('Product not found');
      }

      setProduct(selectedProduct);
      setQty(1);
      await loadReviews(selectedProduct._id);
    } catch (error) {
      console.error('Failed to load product:', error);
      setProduct(null);
      setPageError(error?.response?.data?.message || 'Unable to load product details right now.');
    } finally {
      setIsLoading(false);
    }
  }, [id, loadReviews, resolveProductById]);

  useEffect(() => {
    loadProductDetails();
  }, [loadProductDetails]);

  // Load related products when product changes
  useEffect(() => {
    if (product) {
      loadRelatedProducts();
    }
  }, [product]);

  const loadRelatedProducts = useCallback(async () => {
    try {
      // Fetch products from the same sport or discipline
      const filters = {};
      if (product.sport?._id) {
        filters.sport = product.sport._id;
      }
      if (product.discipline?._id) {
        filters.discipline = product.discipline._id;
      }

      const data = await productService.list(filters);
      // Filter out the current product and limit to 4 related products
      const related = data.filter(p => p._id !== product._id).slice(0, 4);
      setRelatedProducts(related);
    } catch (error) {
      console.error('Failed to load related products:', error);
      setRelatedProducts([]);
    }
  }, [product]);

  const averageRating = useMemo(() => (
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0
  ), [reviews]);

  const userHasReviewed = useMemo(
    () => reviews.some((review) => review.user?._id === user?.id),
    [reviews, user?.id]
  );

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!user) {
      setReviewError('Please login to submit a review');
      return;
    }

    try {
      if (editingReview) {
        await reviewService.update(editingReview._id, {
          rating: reviewRating,
          comment: reviewComment,
        });
        setReviewSuccess('Review updated successfully!');
        setEditingReview(null);
      } else {
        await reviewService.create({
          product: id,
          rating: reviewRating,
          comment: reviewComment,
        });
        setReviewSuccess('Review submitted successfully!');
      }
      
      setReviewRating(5);
      setReviewComment('');
      setShowReviewForm(false);
      loadReviews(id);
      
      setTimeout(() => setReviewSuccess(''), 3000);
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewComment(review.comment);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewService.delete(reviewId);
      setReviewSuccess('Review deleted successfully!');
      loadReviews();
      setTimeout(() => setReviewSuccess(''), 3000);
    } catch (error) {
      setReviewError('Failed to delete review');
    }
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setReviewRating(5);
    setReviewComment('');
    setShowReviewForm(false);
  };

  const isWishlisted = product && isInWishlist(product._id);
  const SPORTS_EQUIPMENT_IMAGE_POOL = [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?auto=format&fit=crop&w=1200&q=80',
  ];

  const SPORT_IMAGE_MAP = {
    basketball: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    ],
    gymnastics: [
      'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    ],
  };

  const buildFallbackImage = (seed) => {
    const key = String(seed || 'sports-equipment');
    const hash = [...key].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return SPORTS_EQUIPMENT_IMAGE_POOL[hash % SPORTS_EQUIPMENT_IMAGE_POOL.length];
  };

  const getCuratedProductImages = () => {
    const productName = (product?.name || '').toLowerCase();
    const sportName = (product?.sport?.name || '').toLowerCase();

    if (productName.includes('balance beam')) {
      return SPORT_IMAGE_MAP.gymnastics;
    }

    if (SPORT_IMAGE_MAP[sportName]) {
      return SPORT_IMAGE_MAP[sportName];
    }

    return [];
  };

  const getFallbackImages = () => {
    const sportName = (product?.sport?.name || '').toLowerCase();
    if (SPORT_IMAGE_MAP[sportName]) {
      return SPORT_IMAGE_MAP[sportName];
    }
    return SPORTS_EQUIPMENT_IMAGE_POOL.slice(0, 4);
  };

  const handleImageError = (event, seed = 'gameon-product') => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = buildFallbackImage(seed);
  };

  const galleryImages = useMemo(() => {
    const curatedImages = getCuratedProductImages();
    if (curatedImages.length > 0) {
      return curatedImages;
    }

    const productImages = Array.isArray(product?.images)
      ? product.images.filter(Boolean)
      : [];

    if (productImages.length >= 4) {
      return productImages;
    }

    const fallbacks = getFallbackImages();
    const merged = [...productImages];

    for (const image of fallbacks) {
      if (merged.length >= 4) break;
      if (!merged.includes(image)) merged.push(image);
    }

    return merged;
  }, [product]);

  useEffect(() => {
    if (galleryImages.length === 0) {
      setSelectedImage('');
      return;
    }

    if (!selectedImage || !galleryImages.includes(selectedImage)) {
      setSelectedImage(galleryImages[0]);
    }
  }, [galleryImages, selectedImage]);

  useEffect(() => {
    if (galleryImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => {
        const currentIndex = galleryImages.indexOf(prev);
        const nextIndex = currentIndex >= 0
          ? (currentIndex + 1) % galleryImages.length
          : 0;
        return galleryImages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [galleryImages]);

  const displayRating = Number(product?.rating || averageRating || 0).toFixed(1);
  const mrp = Math.round((product?.price || 0) * 1.2);

  if (isLoading) return <div className="text-center py-20">Loading product details...</div>;

  if (pageError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white border border-red-200 text-red-700 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Unable to load product</h2>
          <p>{pageError || 'The product could not be found.'}</p>
          <Link to="/products" className="inline-block mt-4 text-blue-600 font-semibold hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/sports" className="hover:text-blue-600">Sports</Link>
          <span>/</span>
          <Link to={`/sports/${product.sport?._id}/disciplines`} className="hover:text-blue-600">{product.sport?.name}</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square bg-white border overflow-hidden ${image === selectedImage ? 'border-blue-600' : 'border-gray-200'}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, `${product._id}-gallery-${index}`)}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="aspect-square bg-white border border-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p>No image available</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-200 p-6 sticky top-24">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{product.brand || 'GameON'}</p>
              <h1 className="text-3xl font-bold text-gray-900 leading-snug">{product.name}</h1>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-4 h-4 ${star <= Math.round(displayRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-700">{displayRating} | {reviews.length} reviews</span>
              </div>

              <div className="mt-4 flex items-end gap-2">
                <p className="text-4xl font-bold text-gray-900">₹ {product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mb-1">MRP <span className="line-through">₹{mrp.toLocaleString()}</span></p>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Colour options</p>
                <div className="flex gap-2">
                  {galleryImages.slice(0, 4).map((image, index) => (
                    <button
                      key={`thumb-${image}-${index}`}
                      onClick={() => setSelectedImage(image)}
                      className={`w-12 h-12 border-2 rounded overflow-hidden ${image === selectedImage ? 'border-blue-600' : 'border-gray-200'}`}
                    >
                      <img
                        src={image}
                        alt={`Option ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, `${product._id}-thumb-${index}`)}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`py-3 px-4 font-semibold transition ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : added
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-700 text-white hover:bg-blue-800'
                  }`}
                >
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleWishlist}
                  className={`py-3 px-4 border font-semibold transition ${
                    isWishlisted ? 'border-red-500 text-red-600 bg-red-50' : 'border-gray-300 text-gray-700 hover:border-blue-700'
                  }`}
                >
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700">Qty</label>
                <div className="flex items-center border border-gray-300">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1 hover:bg-gray-100">-</button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={qty}
                    onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                    className="w-14 text-center border-x border-gray-300 py-1"
                  />
                  <button onClick={() => setQty(Math.min(product.stock || 1, qty + 1))} className="px-3 py-1 hover:bg-gray-100">+</button>
                </div>
                <Link to="/cart" className="text-sm text-blue-700 font-semibold hover:underline">View cart</Link>
              </div>

              <div className="mt-6 border-t pt-4 space-y-2 text-sm">
                <p><span className="font-semibold">Product ID:</span> #{product._id.slice(-8).toUpperCase()}</p>
                <p>
                  <span className="font-semibold">Availability:</span>{' '}
                  <span className={product.stock > 0 ? 'text-green-700' : 'text-red-600'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </p>
                <p><span className="font-semibold">Payment:</span> Pay on delivery available</p>
                <p><span className="font-semibold">Category:</span> {product.sport?.name}{product.discipline?.name ? ` / ${product.discipline.name}` : ''}</p>
              </div>

              <div className="mt-5 p-4 bg-gray-50 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-1">Product Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description || 'High-quality sports equipment designed for durability and everyday performance.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">Customer Reviews</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-6 h-6 ${
                        star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xl font-semibold">{averageRating}</span>
                </div>
                <span className="text-gray-600">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
              </div>
            </div>
            
            {user && !userHasReviewed && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Success/Error Messages */}
          {reviewSuccess && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
              {reviewSuccess}
            </div>
          )}
          {reviewError && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
              {reviewError}
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-blue-200">
              <h3 className="text-xl font-bold mb-4">
                {editingReview ? 'Edit Your Review' : 'Write a Review'}
              </h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 ${
                            star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-400 transition`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Your Review</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    rows="4"
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your experience with this product..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    {editingReview ? 'Update Review' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p className="text-lg">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-lg">{review.user?.name || 'Anonymous'}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${
                                star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    
                    {user?.id === review.user?._id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Related Products</h2>
                <p className="text-gray-600 mt-1">You might also like these items</p>
              </div>
              <Link 
                to={`/products?${product.discipline?._id ? `discipline=${product.discipline._id}` : `sport=${product.sport?._id}`}`}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 hover:underline"
              >
                View All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/products/${relatedProduct._id}`}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    {relatedProduct.images?.[0] ? (
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => handleImageError(e, `${relatedProduct._id}-related`)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Stock Badge */}
                    {relatedProduct.stock === 0 ? (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                        Out of Stock
                      </div>
                    ) : relatedProduct.stock < 10 && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                        Only {relatedProduct.stock} left
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isInWishlist(relatedProduct._id)) {
                          removeFromWishlist(relatedProduct._id);
                        } else {
                          addToWishlist(relatedProduct);
                        }
                      }}
                      className="absolute top-3 left-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <svg 
                        className={`w-5 h-5 ${isInWishlist(relatedProduct._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                        fill={isInWishlist(relatedProduct._id) ? 'currentColor' : 'none'}
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                        {relatedProduct.sport?.name}
                      </span>
                      {relatedProduct.discipline && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-purple-600 font-semibold">
                            {relatedProduct.discipline.name}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedProduct.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (relatedProduct.rating || 4)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({relatedProduct.rating?.toFixed(1) || '4.0'})
                      </span>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{relatedProduct.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(relatedProduct);
                        }}
                        disabled={relatedProduct.stock === 0}
                        className={`p-2 rounded-lg font-bold transition-all ${
                          relatedProduct.stock === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
