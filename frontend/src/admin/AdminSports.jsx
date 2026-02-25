import { useState, useEffect } from 'react';
import { sportService } from '../services/api';

export default function AdminSports() {
  const [sports, setSports] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const load = () => sportService.list().then(setSports);

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await sportService.update(editId, { name });
      setEditId(null);
    } else {
      await sportService.create({ name });
    }
    setName('');
    load();
  };

  const handleEdit = (s) => {
    setName(s.name);
    setEditId(s._id);
  };

  const handleDelete = async (id) => {
    await sportService.delete(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sports</h1>
        <p className="text-gray-600 mt-1">Manage sport categories</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Sport' : 'Add New Sport'}</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Sport name (e.g. Basketball)" className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition">
            {editId ? 'Update' : 'Add Sport'}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setName(''); }} className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold transition">Cancel</button>}
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">All Sports ({sports.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Sport Name</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sports.map(s => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{s.name}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => handleEdit(s)} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                    <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
