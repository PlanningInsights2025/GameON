import { useState, useEffect } from 'react';
import { bannerService } from '../services/api';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    link: '',
    order: 0,
    isActive: true
  });

  const fetchBanners = async () => {
    try {
      const data = await bannerService.list();
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      alert('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBanner) {
        await bannerService.update(editingBanner._id, formData);
        alert('Banner updated successfully!');
      } else {
        await bannerService.create(formData);
        alert('Banner created successfully!');
      }
      
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Failed to save banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      link: banner.link,
      order: banner.order,
      isActive: banner.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const banner = banners.find(b => b._id === id);
    const confirmMessage = banner 
      ? `Are you sure you want to delete "${banner.title}"?\n\nThis action cannot be undone.`
      : 'Are you sure you want to delete this banner?';
    
    if (!window.confirm(confirmMessage)) return;

    try {
      await bannerService.delete(id);
      alert('✓ Banner deleted successfully!');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('❌ Failed to delete banner. Please try again.');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await bannerService.toggleStatus(id);
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner status:', error);
      alert('Failed to update banner status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      imageUrl: '',
      link: '',
      order: 0,
      isActive: true
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-xl">Loading...</div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Homepage Banners</h1>
          <p className="text-gray-600 mt-1">
            {banners.length} total banner{banners.length !== 1 ? 's' : ''} • {banners.filter(b => b.isActive).length} active
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? 'Cancel' : 'Add Banner'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingBanner ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/banner.jpg"
                required
              />
              {formData.imageUrl && (
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="mt-3 h-32 object-cover rounded-lg"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image'}
                />
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">Link (Optional)</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="/products?sport=basketball"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="w-5 h-5"
              />
              <label htmlFor="isActive" className="font-medium">Active (visible on homepage)</label>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {editingBanner ? 'Update Banner' : 'Create Banner'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {banners.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg mb-2">No banners yet</p>
          <p className="text-gray-400 text-sm">Create your first banner to display on the homepage carousel</p>
        </div>
      ) : (
        <>
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Banner Management Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Use the <strong>Delete</strong> button to permanently remove unwanted banners</li>
                <li>Active banners appear in the homepage carousel automatically</li>
                <li>Use <strong>Hide</strong> to temporarily remove a banner without deleting it</li>
                <li>Order determines the sequence in which banners appear</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-4">
          {banners.map(banner => (
            <div key={banner._id} className="bg-white p-4 rounded-lg shadow-md flex gap-4 items-center">
              <img 
                src={banner.imageUrl} 
                alt={banner.title} 
                className="w-40 h-24 object-cover rounded-lg"
                onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found'}
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{banner.title}</h3>
                <p className="text-sm text-gray-600">Order: {banner.order}</p>
                {banner.link && <p className="text-sm text-blue-600 truncate">Link: {banner.link}</p>}
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleToggleStatus(banner._id)}
                  className={`px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    banner.isActive 
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                  }`}
                  title={banner.isActive ? 'Hide from homepage' : 'Show on homepage'}
                >
                  {banner.isActive ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      Hide
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Show
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleEdit(banner)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                  title="Edit banner details"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 group"
                  title="Delete banner permanently"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
