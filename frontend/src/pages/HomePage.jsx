import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sportService, productService, bannerService } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [sports, setSports] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sportsData, productsData, bannersData] = await Promise.all([
          sportService.list(),
          productService.list({}), // Fetch ALL products without filters
          bannerService.getActive().catch(() => []) // Fetch active banners (public endpoint)
        ]);
        setSports(sportsData);
        setProducts(productsData);
        setBanners(bannersData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Auto-slide banner effect
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Top Banner Carousel */}
      <div className="relative h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {banners.length > 0 ? (
          <>
            <div className="absolute inset-0 flex transition-transform duration-1000 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {banners.map((banner, index) => (
                <div key={banner._id || index} className="min-w-full h-full relative group">
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
                    <div className="max-w-7xl mx-auto px-8 w-full">
                      <div className="max-w-2xl space-y-6 animate-fade-in">
                        <h1 className="text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">{banner.title}</h1>
                        {banner.link && (
                          <Link 
                            to={banner.link} 
                            className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-2xl hover:shadow-blue-600/50 transform hover:scale-105 group"
                          >
                            <span>Explore Now</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slide Indicators */}
            {banners.length > 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-md px-4 py-3 rounded-full">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Fallback banner when no banners are configured */
          <div className="min-w-full h-full relative group">
            <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=600&fit=crop" alt="Sports Equipment" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-8">
                <div className="max-w-2xl space-y-6">
                  <h1 className="text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">Premium Sports Collection</h1>
                  <p className="text-2xl text-gray-100 font-medium">Professional Equipment for Champions</p>
                  <Link to="/products" className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-2xl transform hover:scale-105 group">
                    <span>Shop Now</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Category Icons */}
      <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Shop by Sport</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {[
              { name: 'Cycling', img: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=150&h=150&fit=crop' },
              { name: 'Running', img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=150&h=150&fit=crop' },
              { name: 'Swimming', img: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=150&h=150&fit=crop' },
              { name: 'Gym', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop' },
              { name: 'Football', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&h=150&fit=crop' },
              { name: 'Basketball', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150&h=150&fit=crop' },
              { name: 'Tennis', img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=150&h=150&fit=crop' },
              { name: 'Hiking', img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=150&h=150&fit=crop' }
            ].map(cat => {
              // Find sport ID by name
              const sport = sports.find(s => s.name.toLowerCase().includes(cat.name.toLowerCase()));
              const sportId = sport?._id || '';
              
              return (
                <Link 
                  key={cat.name} 
                  to={sportId ? `/products?sport=${sportId}` : '/products'}
                  className="text-center group"
                >
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110 blur-lg"></div>
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-gray-200 group-hover:border-blue-500 transition-all duration-300 shadow-md group-hover:shadow-xl transform group-hover:scale-105">
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition">{cat.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* All Products Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Featured Collection</h2>
              <p className="text-lg text-gray-600 mt-3">Discover our complete range of professional sports equipment</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 group">
              <span>View All</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">No products available</h3>
              <p className="mt-2 text-gray-600">Check back later for new products!</p>
            </div>
          )}
        </div>
      </div>

      {/* Promotional Banner - Shows first promotional banner or fallback */}
      {banners.length > 0 && banners[0] ? (
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 text-center text-white">
            <h2 className="text-5xl md:text-6xl font-black mb-6 drop-shadow-lg">{banners[0].title}</h2>
            {banners[0].link && (
              <Link to={banners[0].link} className="inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105 group">
                <span>Shop Now</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 text-center text-white space-y-6">
            <h2 className="text-5xl md:text-6xl font-black drop-shadow-lg">Winter Sports Sale</h2>
            <p className="text-2xl font-medium text-blue-50 max-w-2xl mx-auto">Up to 50% off on selected winter equipment</p>
            <Link to="/products" className="inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105 group">
              <span>Shop Sale</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
