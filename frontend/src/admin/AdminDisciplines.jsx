import { useState, useEffect } from 'react';
import { disciplineService, sportService } from '../services/api';

export default function AdminDisciplines() {
  const [disciplines, setDisciplines] = useState([]);
  const [sports, setSports] = useState([]);
  const [name, setName] = useState('');
  const [sportId, setSportId] = useState('');
  const [editId, setEditId] = useState(null);

  const load = () => disciplineService.list().then(setDisciplines);

  useEffect(() => {
    load();
    sportService.list().then(setSports);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await disciplineService.update(editId, { name, sport: sportId });
      setEditId(null);
    } else {
      await disciplineService.create({ name, sport: sportId });
    }
    setName('');
    setSportId('');
    load();
  };

  const handleEdit = (d) => {
    setName(d.name);
    setSportId(d.sport._id);
    setEditId(d._id);
  };

  const handleDelete = async (id) => {
    await disciplineService.delete(id);
    load();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Manage Disciplines</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Discipline name"
            className="flex-1 border px-4 py-2 rounded"
            required
          />
          <select value={sportId} onChange={e => setSportId(e.target.value)} className="border px-4 py-2 rounded" required>
            <option value="">Select Sport</option>
            {sports.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {editId ? 'Update' : 'Add'}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setName(''); setSportId(''); }} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>}
        </form>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Sport</th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disciplines.map(d => (
              <tr key={d._id} className="border-b">
                <td className="py-2">{d.name}</td>
                <td className="py-2">{d.sport?.name}</td>
                <td className="text-right py-2">
                  <button onClick={() => handleEdit(d)} className="text-blue-600 hover:underline mr-4">Edit</button>
                  <button onClick={() => handleDelete(d._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
