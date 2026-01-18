import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingsPanel from '../components/BookingsPanel';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const token = localStorage.getItem('adminToken');
  const user = localStorage.getItem('adminUser')
    ? JSON.parse(localStorage.getItem('adminUser'))
    : null;

  useEffect(() => {
    if (!token) {
      navigate('/admin-login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-xl font-bold text-gray-800">MK Nails Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-500">
              {user.fullName} ({user.role})
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Services
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {activeTab === 'overview' && (
          <div className="rounded-lg bg-white shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome, {user?.fullName}!</h2>
            <p className="text-gray-600 mb-6">
              Use the tabs above to manage your salon bookings and services.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-sm font-medium text-blue-700 mb-2">Coming Soon</p>
                <h3 className="text-2xl font-bold text-blue-900">Bookings</h3>
                <p className="text-sm text-blue-600 mt-2">View and manage all appointments</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-sm font-medium text-green-700 mb-2">Coming Soon</p>
                <h3 className="text-2xl font-bold text-green-900">Services</h3>
                <p className="text-sm text-green-600 mt-2">Add, edit, or remove services</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <p className="text-sm font-medium text-purple-700 mb-2">Coming Soon</p>
                <h3 className="text-2xl font-bold text-purple-900">Analytics</h3>
                <p className="text-sm text-purple-600 mt-2">Revenue and customer insights</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <BookingsPanel />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Services Manager</h2>
            <p className="text-gray-600">Coming next... services CRUD interface</p>
          </div>
        )}
      </main>
    </div>
  );
}
