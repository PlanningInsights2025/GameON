import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sportService } from '../services/api';

export default function SportsPage() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    sportService.list().then(data => {
      setSports(data);
      setLoading(false);
    });
  }, []);

  const filteredSports = sports.filter(sport =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">Olympic Sports</h1>
          <p className="text-gray-600 text-lg">Explore equipment by official Olympic sport categories</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sports..."
              className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Sports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSports.map(sport => {
            const sportImages = {
              'Gymnastics': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop',
              'Athletics': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&h=300&fit=crop',
              'Aquatics': 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=500&h=300&fit=crop',
              'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=300&fit=crop',
              'Football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&h=300&fit=crop',
              'Volleyball': 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500&h=300&fit=crop',
              'Tennis': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500&h=300&fit=crop',
              'Cycling': 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=500&h=300&fit=crop',
              'Badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&h=300&fit=crop',
              'Table Tennis': 'https://images.unsplash.com/photo-1611916656173-875e4277bea6?w=500&h=300&fit=crop',
              'Combat Sports': 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=500&h=300&fit=crop',
              'Weightlifting': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&h=300&fit=crop',
              'Hockey': 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=500&h=300&fit=crop',
              'Skateboarding': 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=500&h=300&fit=crop',
              'Sport Climbing': 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=500&h=300&fit=crop',
              'Archery': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=500&h=300&fit=crop'
            };
            return (
              <Link 
                key={sport._id} 
                to={`/sports/${sport._id}/disciplines`} 
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-500"
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={sportImages[sport.name] || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop'}
                    alt={sport.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition">{sport.name}</h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    View disciplines 
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredSports.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No sports found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
