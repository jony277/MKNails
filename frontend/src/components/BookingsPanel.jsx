import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import client from '../api/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function BookingsPanel() {
  const { theme } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [filters, allBookings]);

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

  const parseBookingDate = (dateStr) => {
    try {
      if (!dateStr) return null;
      // Handle ISO format or YYYY-MM-DD format
      if (dateStr.includes('T')) {
        return new Date(dateStr).toISOString().split('T')[0];
      }
      return dateStr;
    } catch {
      return null;
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

      const res = await client.get('/api/admin/bookings', {
        'Authorization': `Bearer ${token}`
      });

      setAllBookings(res.data || []);
      setError('');
    } catch (err) {
      console.error('Bookings fetch error:', err);
      setError('Failed to load bookings: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allBookings];

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(b => b.status === filters.status);
    }

    // Filter by date from
    if (filters.dateFrom) {
      filtered = filtered.filter(b => {
        const bookingDate = parseBookingDate(b.booking_date);
        return bookingDate && bookingDate >= filters.dateFrom;
      });
    }

    // Filter by date to
    if (filters.dateTo) {
      filtered = filtered.filter(b => {
        const bookingDate = parseBookingDate(b.booking_date);
        return bookingDate && bookingDate <= filters.dateTo;
      });
    }

    setBookings(filtered);
  };

  const handleRefresh = () => {
    fetchBookings();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      dateFrom: '',
      dateTo: '',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-3">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bookings</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white rounded-lg font-medium transition flex items-center gap-2"
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
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
          {(filters.status !== 'all' || filters.dateFrom || filters.dateTo) && (
            <button
              onClick={clearFilters}
              className="text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
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
                <td colSpan="6" className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
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
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block ${
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
        Showing {bookings.length} of {allBookings.length} bookings
      </div>
    </div>
  );
}

export default BookingsPanel;
