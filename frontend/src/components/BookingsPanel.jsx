import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function BookingsPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr + 'T00:00:00Z');
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
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
      return timeStr.slice(0, 5);
    } catch {
      return timeStr;
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('adminToken');
      console.log('Fetching bookings with token:', !!token);
      
      if (!token) {
        setError('No authentication token. Please log in.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/admin/bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('Bookings data received:', data);
      
      // Handle both array and object responses
      const bookingsList = Array.isArray(data) ? data : (data.data || data.bookings || []);
      setBookings(bookingsList);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to load bookings: ${err.message}`);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-700';
    const statusLower = status.toLowerCase();
    if (statusLower === 'confirmed') return 'bg-emerald-100 text-emerald-700';
    if (statusLower === 'completed') return 'bg-blue-100 text-blue-700';
    if (statusLower === 'pending') return 'bg-amber-100 text-amber-700';
    if (statusLower === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Bookings</h2>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 text-sm font-medium transition shadow-md"
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
          <p className="text-gray-500 mt-3">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
          <p className="text-gray-500">No bookings yet</p>
          <p className="text-xs text-gray-400 mt-2">Bookings will appear here when customers book services</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Time</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Service</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr key={idx} className="border-b hover:bg-purple-50 transition">
                  <td className="px-4 py-3 text-gray-700">{formatDate(b.booking_date)}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{formatTime(b.start_time)}</td>
                  <td className="px-4 py-3 text-gray-700">{b.first_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-700">{b.service_name || 'N/A'}</td>
                  <td className="px-4 py-3 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                    ${parseFloat(b.price || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(b.status)}`}>
                      {b.status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-sm text-gray-500 mt-4">Total: <span className="font-semibold">{bookings.length}</span> bookings</p>
    </div>
  );
}

export default BookingsPanel;
