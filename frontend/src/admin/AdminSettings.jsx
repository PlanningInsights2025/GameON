import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AdminSettings() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert('Profile update functionality - connect to your API');
    // TODO: Implement profile update API call
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password update functionality - connect to your API');
    // TODO: Implement password change API call
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow-md">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'password'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setActiveTab('site')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'site'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Site Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Role</label>
                  <input
                    type="text"
                    value={user?.role || 'admin'}
                    disabled
                    className="w-full border px-4 py-3 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    minLength="6"
                    required
                  />
                  <p className="text-sm text-gray-600 mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    minLength="6"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {activeTab === 'site' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">Site Configuration</h2>
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="font-semibold text-lg mb-2">Store Information</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between"><span>Store Name:</span><span className="font-medium">GameON</span></div>
                    <div className="flex justify-between"><span>Domain:</span><span className="font-medium">localhost:3000</span></div>
                    <div className="flex justify-between"><span>API URL:</span><span className="font-medium">localhost:5000</span></div>
                  </div>
                </div>

                <div className="border-b pb-6">
                  <h3 className="font-semibold text-lg mb-2">Email Configuration</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between"><span>SMTP Service:</span><span className="font-medium text-green-600">✓ Gmail Configured</span></div>
                    <div className="flex justify-between"><span>Sender Email:</span><span className="font-medium">Configured in backend .env</span></div>
                  </div>
                </div>

                <div className="border-b pb-6">
                  <h3 className="font-semibold text-lg mb-2">Database</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between"><span>Database:</span><span className="font-medium text-green-600">✓ MongoDB Connected</span></div>
                    <div className="flex justify-between"><span>Database Name:</span><span className="font-medium">gameon</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">System Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Email OTP Verification</span>
                      <span className="text-green-600 font-semibold">✓ Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">JWT Authentication</span>
                      <span className="text-green-600 font-semibold">✓ Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Role-Based Access Control</span>
                      <span className="text-green-600 font-semibold">✓ Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Wishlist Feature</span>
                      <span className="text-green-600 font-semibold">✓ Active</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Advanced configuration options are managed through environment variables in the backend .env file.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
