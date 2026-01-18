import { useState, useEffect } from 'react';
import client from '../api/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function OverviewPanel() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalServices: 0,
    totalCustomers: 0,
    avgPerBooking: 0,
    bookings: [],
    topServices: [],
    revenueByDay: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
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

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      // Call the dashboard endpoint we added in server.js
      const res = await client.get('/api/admin/dashboard');
      const data = res.data || {};

      // For now we keep revenueByDay empty (can compute later from bookings)
      setStats({
        totalBookings: data.totalBookings || 0,
        totalRevenue: data.totalRevenue || 0,
        totalServices: data.totalServices || 0,
        totalCustomers: data.totalCustomers || 0,
        avgPerBooking: data.avgBooking || 0,
        bookings: data.recentBookings || [],
        topServices: data.topServices || [],
        revenueByDay: {}, // compute later if you want charts
      });
      setError('');
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  const maxRevenue = Math.max(...Object.values(stats.revenueByDay), 1);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalBookings}
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">
            ${stats.totalRevenue}
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm mb-1">Services</p>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalServices}
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm mb-1">Customers</p>
          <p className="text-3xl font-bold text-purple-600">
            {stats.totalCustomers}
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm mb-1">Avg/Booking</p>
          <p className="text-3xl font-bold text-orange-600">
            ${stats.avgPerBooking}
          </p>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Revenue by Day
        </h3>
        {Object.keys(stats.revenueByDay).length === 0 ? (
          <p className="text-gray-500 text-sm">No revenue data yet</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(stats.revenueByDay)
              .sort(([, a], [, b]) => b - a)
              .map(([day, revenue]) => (
                <div key={day}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800">{day}</span>
                    <span className="font-bold text-green-600">
                      ${revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-green-600 h-2 rounded"
                      style={{
                        width: `${(revenue / maxRevenue) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Services */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top Services
          </h3>
          {stats.topServices.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.topServices.map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between p-3 bg-gray-50 rounded"
                >
                  <p className="font-medium text-gray-800">{s.name}</p>
                  <p className="font-bold text-green-600">
                    ${s.revenue.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Bookings
          </h3>
          {stats.bookings.length === 0 ? (
            <p className="text-gray-500 text-sm">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {stats.bookings.map((b, i) => (
                <div
                  key={i}
                  className="flex justify-between pb-3 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {b.service_name || 'Service'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(b.booking_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ${parseFloat(b.price || 0).toFixed(2)}
                    </p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OverviewPanel;
