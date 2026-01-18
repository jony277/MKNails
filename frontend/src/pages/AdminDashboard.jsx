import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import OverviewPanel from '../components/OverviewPanel';
import BookingsPanel from '../components/BookingsPanel';
import ServicesPanel from '../components/ServicesPanel';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  // Parse adminUser from localStorage
  const getUserName = () => {
    try {
      const userStr = localStorage.getItem('adminUser');
      if (!userStr) return 'Admin';
      const user = JSON.parse(userStr);
      return user.fullName || user.full_name || user.name || 'Admin';
    } catch (e) {
      return 'Admin';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MK Nails Admin</h1>
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => toggleTheme('light')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  theme === 'light'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                title="Light Mode"
              >
                ☀️
              </button>
              <button
                onClick={() => toggleTheme('dark')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  theme === 'dark'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                title="Dark Mode"
              >
                🌙
              </button>
            </div>

            <span className="text-sm text-gray-600 dark:text-gray-400">Welcome, {getUserName()}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === 'overview'
                  ? 'border-pink-600 text-pink-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === 'bookings'
                  ? 'border-pink-600 text-pink-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === 'services'
                  ? 'border-pink-600 text-pink-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Services
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewPanel />}
        {activeTab === 'bookings' && <BookingsPanel />}
        {activeTab === 'services' && <ServicesPanel />}
      </div>
    </div>
  );
}
