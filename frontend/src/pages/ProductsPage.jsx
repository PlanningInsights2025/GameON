import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { productService, sportService, disciplineService } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [sports, setSports] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevant');
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    sport: searchParams.get('sport') || '',
    discipline: searchParams.get('discipline') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    q: searchParams.get('q') || ''
  });

  useEffect(() => {
    sportService.list().then(setSports);
    disciplineService.list().then(setDisciplines);
  }, []);

  // Update filters when URL search params change
  useEffect(() => {
    setFilters({
      sport: searchParams.get('sport') || '',
      discipline: searchParams.get('discipline') || '',
      brand: searchParams.get('brand') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      q: searchParams.get('q') || ''
    });
  }, [searchParams]);

  useEffect(() => {
    const queryFilters = {};
    if (filters.sport) queryFilters.sport = filters.sport;
    if (filters.discipline) queryFilters.discipline = filters.discipline;
    if (filters.brand) queryFilters.brand = filters.brand;
    if (filters.minPrice) queryFilters.minPrice = filters.minPrice;
    if (filters.maxPrice) queryFilters.maxPrice = filters.maxPrice;
    if (filters.q) queryFilters.q = filters.q;

    productService.list(queryFilters).then(data => {
      let sorted = [...data];
      if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
      if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
      if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(sorted);
      setLoading(false);
    });
  }, [filters, sortBy]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) params.set(k, newFilters[k]);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ sport: '', discipline: '', brand: '', minPrice: '', maxPrice: '', q: '' });
    setSearchParams({});
  };

  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-gray-600 mt-1">{products.length} products found</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="relevant">Most Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-72 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Search</label>
                <input
                  type="text"
                  value={filters.q}
                  onChange={(e) => handleFilterChange('q', e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              {/* Sport Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Sport</label>
                <select
                  value={filters.sport}
                  onChange={(e) => handleFilterChange('sport', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">All Sports</option>
                  {sports.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Discipline Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Discipline</label>
                <select
                  value={filters.discipline}
                  onChange={(e) => handleFilterChange('discipline', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">All Disciplines</option>
                  {disciplines
                    .filter(d => !filters.sport || d.sport._id === filters.sport)
                    .map(d => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                </select>
              </div>

              {/* Brand Filter */}
              {uniqueBrands.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">All Brands</option>
                    {uniqueBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              )}
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg mb-4">No products found</p>
                <button onClick={clearFilters} className="text-blue-600 hover:underline">
                  Clear filters and try again
                </button>
              </div>
            ) : (
              <div className={`grid ${showFilters ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-6`}>
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
