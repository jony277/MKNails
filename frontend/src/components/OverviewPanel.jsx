import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import client from '../api/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function OverviewPanel() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalServices: 0,
    totalCustomers: 0,
    avgPerBooking: 0,
    bookings: [],
    topServices: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null); // 'bookings', 'services', or null

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      let dateObj;
      if (typeof dateStr === 'string' && dateStr.includes('T')) {
        dateObj = new Date(dateStr);
      } else {
        dateObj = new Date(dateStr + 'T00:00:00Z');
      }
      
      if (isNaN(dateObj.getTime())) return dateStr;
      
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token. Please log in.');
        return;
      }

      const res = await client.get('/api/admin/dashboard', {
        'Authorization': `Bearer ${token}`
      });
      const data = res.data || {};

      setStats({
        totalBookings: data.totalBookings || 0,
        totalRevenue: data.totalRevenue || 0,
        totalServices: data.totalServices || 0,
        totalCustomers: data.totalCustomers || 0,
        avgPerBooking: data.avgBooking || 0,
        bookings: data.recentBookings || [],
        topServices: data.topServices || [],
      });
      setError('');
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-3">Loading dashboard...</p>
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Overview</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid - Clickable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {/* Total Bookings */}
        <div
          onClick={() => setSelectedDetail('bookings')}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border border-blue-200 dark:border-blue-700 rounded-lg hover:shadow-lg hover:scale-105 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300 mt-2">{stats.totalBookings}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Click for details</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 border border-green-200 dark:border-green-700 rounded-lg hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300 mt-2">${parseFloat(stats.totalRevenue).toFixed(0)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">All time</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        {/* Total Services */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border border-purple-200 dark:border-purple-700 rounded-lg hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">Services</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-300 mt-2">{stats.totalServices}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active</p>
            </div>
            <div className="text-4xl">✨</div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900 dark:to-rose-800 border border-pink-200 dark:border-pink-700 rounded-lg hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">Customers</p>
              <p className="text-3xl font-bold text-pink-600 dark:text-pink-300 mt-2">{stats.totalCustomers}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Unique</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        {/* Avg per Booking */}
        <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900 dark:to-amber-800 border border-orange-200 dark:border-orange-700 rounded-lg hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">Avg/Booking</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-300 mt-2">${parseFloat(stats.avgPerBooking).toFixed(2)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Revenue</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Services */}
        <div
          onClick={() => setSelectedDetail('services')}
          className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:cursor-pointer hover:scale-102 transition"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="text-xl mr-2">⭐</span> Top Services
            <span className="ml-auto text-xs bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 px-2 py-1 rounded">Click for more</span>
          </h3>
          {stats.topServices.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.topServices.slice(0, 3).map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg border border-purple-100 dark:border-purple-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{s.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{s.bookings} bookings</p>
                  </div>
                  <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                    ${s.revenue.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div
          onClick={() => setSelectedDetail('bookings')}
          className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:cursor-pointer hover:scale-102 transition"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="text-xl mr-2">📋</span> Recent Bookings
            <span className="ml-auto text-xs bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 px-2 py-1 rounded">Click for more</span>
          </h3>
          {stats.bookings.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm">No bookings yet</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {stats.bookings.slice(0, 5).map((b, i) => (
                <div key={i} className="flex justify-between items-start pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{b.service_name || 'Service'}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{formatDate(b.booking_date)} at {formatTime(b.start_time)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                      ${parseFloat(b.price || 0).toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                      b.status === 'confirmed' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200' 
                        : b.status === 'completed'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modals */}
      {selectedDetail === 'bookings' && (
        <DetailModal
          title="All Bookings"
          onClose={() => setSelectedDetail(null)}
          type="bookings"
          items={stats.bookings}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}

      {selectedDetail === 'services' && (
        <DetailModal
          title="All Top Services"
          onClose={() => setSelectedDetail(null)}
          type="services"
          items={stats.topServices}
        />
      )}
    </div>
  );
}

// Detail Modal Component
function DetailModal({ title, onClose, type, items, formatDate, formatTime }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {type === 'bookings' && (
            <div className="space-y-4">
              {items.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No bookings</p>
              ) : (
                items.map((b, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{b.service_name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(b.booking_date)} at {formatTime(b.start_time)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                          : b.status === 'completed'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{b.customer_name || 'N/A'}</span>
                      <span className="font-semibold text-pink-600 dark:text-pink-400">${parseFloat(b.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {type === 'services' && (
            <div className="space-y-4">
              {items.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No services</p>
              ) : (
                items.map((s, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{s.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{s.bookings} bookings</p>
                      </div>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">${s.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OverviewPanel;
