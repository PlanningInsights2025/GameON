import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sportService, disciplineService } from '../services/api';

export default function DisciplinesPage() {
  const { sportId } = useParams();
  const [sport, setSport] = useState(null);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sportService.get(sportId),
      disciplineService.list(sportId)
    ]).then(([sportData, discData]) => {
      setSport(sportData);
      setDisciplines(discData);
      setLoading(false);
    });
  }, [sportId]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/sports" className="hover:text-blue-600">All Sports</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{sport.name}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3">{sport.name}</h1>
          <p className="text-gray-600 text-lg">Choose a discipline to explore equipment and gear</p>
        </div>

        {/* Disciplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {disciplines.map((disc, idx) => {
            const colors = [
              'from-blue-500 to-cyan-500',
              'from-purple-500 to-pink-500',
              'from-orange-500 to-red-500',
              'from-green-500 to-teal-500',
              'from-indigo-500 to-blue-500',
              'from-pink-500 to-rose-500'
            ];
            return (
              <Link 
                key={disc._id} 
                to={`/products?discipline=${disc._id}`} 
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-500"
              >
                <div className={`h-48 bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition"></div>
                  <div className="text-center z-10">
                    <svg className="w-20 h-20 text-white mx-auto mb-2 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <p className="text-white font-semibold text-sm">{sport?.name || ''}</p>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">{disc.name}</h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    Shop equipment 
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {disciplines.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-lg">No disciplines found for this sport</p>
          </div>
        )}
      </div>
    </div>
  );
}
