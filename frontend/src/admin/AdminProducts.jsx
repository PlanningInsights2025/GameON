import { useState, useEffect } from 'react';
import { productService, sportService, disciplineService } from '../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [sports, setSports] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '', sport: '', discipline: '', brand: '', description: '', rating: 4.0 });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await productService.list({});
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    sportService.list().then(setSports);
    disciplineService.list().then(setDisciplines);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await productService.update(editId, form);
        setEditId(null);
      } else {
        await productService.create(form);
      }
      setForm({ name: '', price: '', stock: '', sport: '', discipline: '', brand: '', description: '', rating: 4.0 });
      load();
    } catch (error) {
      alert('Error saving product');
    }
  };

  const handleEdit = (p) => {
    setForm({ 
      name: p.name, 
      price: p.price, 
      stock: p.stock, 
      sport: p.sport._id, 
      discipline: p.discipline._id, 
      brand: p.brand || '', 
      description: p.description || '',
      rating: p.rating || 4.0
    });
    setEditId(p._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await productService.delete(id);
      load();
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sport?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-bold text-gray-900">{products.length}</span>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Tennis Racket" className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
              <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Nike" className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stock *</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sport *</label>
              <select value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value, discipline: '' })} className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Sport</option>
                {sports.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Discipline *</label>
              <select value={form.discipline} onChange={e => setForm({ ...form, discipline: e.target.value })} className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={!form.sport}>
                <option value="">Select Discipline</option>
                {disciplines.filter(d => d.sport._id === form.sport).map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition">
              {editId ? 'Update Product' : 'Add Product'}
            </button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', price: '', stock: '', sport: '', discipline: '', brand: '', description: '', rating: 4.0 }); }} className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold transition">Cancel</button>}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">All Products</h2>
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Sport</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{p.name}</div>
                      {p.brand && <div className="text-sm text-gray-500">{p.brand}</div>}
                    </td>
                    <td className="px-6 py-4 font-bold">₹{p.price?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${p.stock > 20 ? 'bg-green-100 text-green-800' : p.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{p.sport?.name}</td>
                    <td className="px-6 py-4 text-sm">⭐ {p.rating || 4.0}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">No products found</div>
          )}
        </div>
      </div>
    </div>
  );
}
