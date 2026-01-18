import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import client from '../api/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function BookingsPanel() {
  const { theme } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      // Handle ISO string like "2026-01-23T05:00:00.000Z" or date string "2026-01-23"
      let dateObj;
      if (typeof dateStr === 'string' && dateStr.includes('T')) {
        // ISO string - parse and extract just the date part
        dateObj = new Date(dateStr);
      } else {
        // Date string "2026-01-23" - parse as UTC
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

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token');
        return;
      }

      // Build query params
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
      }

      const res = await client.get(`/api/admin/bookings?${params}`, {
        'Authorization': `Bearer ${token}`
      });

      setBookings(res.data || []);
      setError('');
    } catch (err) {
      console.error('Bookings fetch error:', err);
      setError('Failed to load bookings: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBookings();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-3">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bookings</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          <span>🔄</span> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Table Wrapper with proper scrollbar handling */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Time</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Service</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {formatDate(booking.booking_date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {formatTime(booking.start_time)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {booking.customer_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {booking.service_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-pink-600 dark:text-pink-400 font-semibold">
                    ${parseFloat(booking.price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                          : booking.status === 'completed'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : booking.status === 'pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Total: {bookings.length} bookings
      </div>
    </div>
  );
}

export default BookingsPanel;
