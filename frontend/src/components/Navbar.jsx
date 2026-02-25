import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { sportService, disciplineService } from '../services/api';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [sports, setSports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSport, setHoveredSport] = useState(null);
  const [sportDisciplines, setSportDisciplines] = useState({});
  const accountMenuTimeoutRef = useRef(null);

  useEffect(() => {
    sportService.list().then(setSports);
  }, []);

  useEffect(() => {
    if (hoveredSport && !sportDisciplines[hoveredSport]) {
      disciplineService.list({ sport: hoveredSport }).then(disciplines => {
        setSportDisciplines(prev => ({ ...prev, [hoveredSport]: disciplines }));
      });
    }
  }, [hoveredSport]);

  const sportCategories = {
    'Team Sports': ['Basketball', 'Volleyball', 'Football', 'Hockey', 'Cricket'],
    'Racket Sports': ['Tennis', 'Table Tennis', 'Badminton'],
    'Combat Sports': ['Combat Sports'],
    'Individual Sports': ['Gymnastics', 'Athletics', 'Aquatics', 'Cycling', 'Weightlifting'],
    'Adventure Sports': ['Skateboarding', 'Sport Climbing', 'Archery']
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openAccountMenu = () => {
    if (accountMenuTimeoutRef.current) {
      clearTimeout(accountMenuTimeoutRef.current);
      accountMenuTimeoutRef.current = null;
    }
    setShowAccountMenu(true);
  };

  const closeAccountMenuWithDelay = () => {
    if (accountMenuTimeoutRef.current) {
      clearTimeout(accountMenuTimeoutRef.current);
    }
    accountMenuTimeoutRef.current = setTimeout(() => {
      setShowAccountMenu(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (accountMenuTimeoutRef.current) {
        clearTimeout(accountMenuTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-purple-700 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide">🏆 Official Sports Equipment Store</span>
            <span className="hidden md:inline-block text-blue-100">|</span>
            <span className="hidden md:inline-block text-blue-100 text-xs">Fast Shipping • Authentic Products</span>
          </div>
          <div className="flex gap-4 items-center">
            {user && <span className="text-blue-50 font-medium">Welcome, {user.name}</span>}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
                <span className="text-white font-bold text-xl">GO</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-gray-900 tracking-tighter leading-none">GameON</span>
                <span className="text-[10px] text-blue-600 font-semibold tracking-wider uppercase">Sports Pro</span>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, sports, equipment..."
                  className="w-full px-5 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none text-sm transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-gray-300"
                />
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex gap-5 items-center flex-shrink-0">
              {user ? (
                <div className="relative"
                  onMouseEnter={openAccountMenu}
                  onMouseLeave={closeAccountMenuWithDelay}
                >
                  <button className="flex flex-col items-center gap-1 hover:text-blue-600 transition group">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-medium">Account</span>
                  </button>
                  {showAccountMenu && (
                    <div className="absolute right-0 top-full pt-2 w-52"
                      onMouseEnter={openAccountMenu}
                      onMouseLeave={closeAccountMenuWithDelay}
                    >
                      <div className="bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link to="/orders" className="block px-4 py-2.5 text-sm hover:bg-blue-50 transition">My Orders</Link>
                      <Link to="/address" className="block px-4 py-2.5 text-sm hover:bg-blue-50 transition">Address</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition text-red-600">Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex flex-col items-center gap-1 hover:text-blue-600 transition group">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs font-medium">Sign In</span>
                </Link>
              )}

            <Link to="/wishlist" className="flex flex-col items-center gap-1 hover:text-blue-600 relative transition group">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs font-medium">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-md">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/support" className="flex flex-col items-center gap-1 hover:text-blue-600 transition group">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs font-medium">Support</span>
            </Link>
            
            <Link to="/cart" className="flex flex-col items-center gap-1 hover:text-blue-600 relative transition group">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs font-medium">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-md">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      </div>

      {/* Categories Menu */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            {/* All Sports Mega Menu */}
            <div className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <Link to="/sports" className="flex items-center gap-2 px-4 py-3.5 font-medium text-sm hover:text-blue-600 hover:bg-blue-50 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                ALL SPORTS
              </Link>

              {/* Mega Menu Dropdown */}
              {showMegaMenu && (
                <div className="absolute left-0 top-full w-screen max-w-5xl bg-white shadow-2xl border-t-2 border-blue-600 z-50 rounded-b-xl">
                  <div className="grid grid-cols-5 gap-1 p-6">
                    {Object.entries(sportCategories).map(([category, sportNames]) => (
                      <div key={category} className="p-4">
                        <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider border-b border-gray-200 pb-2">{category}</h3>
                        <ul className="space-y-2.5">
                          {sports.filter(s => sportNames.includes(s.name)).map(sport => {
                            const isHovered = hoveredSport === sport._id;
                            const disciplines = sportDisciplines[sport._id] || [];
                            return (
                              <li key={sport._id}
                                onMouseEnter={() => setHoveredSport(sport._id)}
                                onMouseLeave={() => setHoveredSport(null)}
                              >
                                <Link
                                  to={`/products?sport=${sport._id}`}
                                  className="text-sm text-gray-700 hover:text-blue-600 transition block py-0.5 font-medium"
                                  onClick={() => setShowMegaMenu(false)}
                                >
                                  {sport.name}
                                </Link>
                                {isHovered && disciplines.length > 0 && (
                                  <ul className="ml-3 mt-1.5 space-y-1.5 border-l-2 border-blue-200 pl-3">
                                    {disciplines.map(discipline => (
                                      <li key={discipline._id}>
                                        <Link
                                          to={`/products?discipline=${discipline._id}`}
                                          className="text-xs text-gray-600 hover:text-blue-600 transition block"
                                          onClick={() => setShowMegaMenu(false)}
                                        >
                                          {discipline.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/products" className="px-4 py-3.5 font-medium text-sm hover:text-blue-600 hover:bg-blue-50 transition">All Products</Link>
            <Link to="/products?new=true" className="px-4 py-3.5 font-medium text-sm hover:text-blue-600 hover:bg-blue-50 transition">New Arrivals</Link>
            <Link to="/products?sale=true" className="px-4 py-3.5 font-medium text-sm hover:text-blue-600 hover:bg-blue-50 transition">Clearance</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
