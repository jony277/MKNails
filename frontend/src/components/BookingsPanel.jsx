import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITEAPIURL || 'http://localhost:5000';

export default function BookingsPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Bookings</h2>
        <button onClick={fetchBookings} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-gray-500">No bookings yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
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
              {bookings.map((booking, idx) => (
                <tr key={booking.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-800">{new Date(booking.booking_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-800">{booking.start_time} - {booking.end_time}</td>
                  <td className="px-4 py-3 text-gray-800">{booking.first_name}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{booking.service_name}</td>
                  <td className="px-4 py-3 text-gray-800 font-semibold text-green-600">${booking.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Total: {bookings.length} bookings
      </div>
    </div>
  );
}
