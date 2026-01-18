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
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getDaysUntilAppointment = (dateStr) => {
    try {
      let dateObj;
      if (typeof dateStr === 'string' && dateStr.includes('T')) {
        dateObj = new Date(dateStr);
      } else {
        dateObj = new Date(dateStr + 'T00:00:00Z');
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateObj.setHours(0, 0, 0, 0);
      
      const diff = dateObj.getTime() - today.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days;
    } catch {
      return null;
    }
  };

  const getDateColor = (dateStr) => {
    const days = getDaysUntilAppointment(dateStr);
    if (days === null) return 'gray';
    if (days < 0) return 'gray'; // past
    if (days === 0) return 'red'; // today
    if (days <= 3) return 'orange'; // within 3 days
    if (days <= 7) return 'yellow'; // within a week
    return 'green'; // more than a week
  };

  const getDateColorClass = (color) => {
    const colorMap = {
      red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700',
      yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
      green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700',
      gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600',
    };
    return colorMap[color] || colorMap.gray;
  };

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

      {/* Stats Grid - All Clickable Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {/* Total Bookings */}
        <div
          onClick={() => setSelectedDetail('bookings')}
          className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border border-blue-200 dark:border-blue-700 rounded-lg hover:shadow-lg hover:scale-105 transition cursor-pointer active:scale-95"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium">Total Bookings</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300 mt-2">{stats.totalBookings}</p>
            </div>
            <div className="text-3xl sm:text-4xl">📅</div>
          </div>
        </div>

        {/* Total Revenue */}
        <div
          onClick={() => setSelectedDetail('bookings')}
          className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 border border-green-200 dark:border-green-700 rounded-lg hover:shadow-lg hover:scale-105 transition cursor-pointer active:scale-95"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium">Total Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-300 mt-2">${parseFloat(stats.totalRevenue).toFixed(0)}</p>
            </div>
            <div className="text-3xl sm:text-4xl">💰</div>
          </div>
        </div>

        {/* Total Services */}
        <div
          onClick={() => setSelectedDetail('services')}
          className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border border-purple-200 dark:border-purple-700 rounded-lg hover:shadow-lg hover:scale-105 transition cursor-pointer active:scale-95"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium">Services</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-300 mt-2">{stats.totalServices}</p>
            </div>
            <div className="text-3xl sm:text-4xl">✨</div>
          </div>
        </div>

        {/* Total Customers */}
        <div
          onClick={() => setSelectedDetail('bookings')}
          className="p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900 dark:to-rose-800 border border-pink-200 dark:border-pink-700 rounded-lg hover:shadow-lg hover:scale-105 transition cursor-pointer active:scale-95"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium">Customers</p>
              <p className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-pink-300 mt-2">{stats.totalCustomers}</p>
            </div>
            <div className="text-3xl sm:text-4xl">👥</div>
          </div>
        </div>

        {/* Avg per Booking */}
        <div
          onClick={() => setSelectedDetail('bookings')}
          className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900 dark:to-amber-800 border border-orange-200 dark:border-orange-700 rounded-lg hover:shadow-lg hover:scale-105 transition cursor-pointer active:scale-95"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium">Avg/Booking</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-300 mt-2">${parseFloat(stats.avgPerBooking).toFixed(2)}</p>
            </div>
            <div className="text-3xl sm:text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Two column layout - Mobile optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Top Services */}
        <div
          onClick={() => setSelectedDetail('services')}
          className="p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:cursor-pointer transition"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="text-xl mr-2">⭐</span> Top Services
          </h3>
          {stats.topServices.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.topServices.slice(0, 3).map((s, i) => (
                <div 
                  key={i} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDetail('serviceDetail');
                  }}
                  className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg border border-purple-100 dark:border-purple-700 hover:shadow-md cursor-pointer transition"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{s.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{s.bookings} bookings</p>
                    </div>
                    <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 whitespace-nowrap">
                      ${s.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div
          onClick={() => setSelectedDetail('bookings')}
          className="p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:cursor-pointer transition"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="text-xl mr-2">📋</span> Recent Bookings
          </h3>
          {stats.bookings.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm">No bookings yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {stats.bookings.slice(0, 5).map((b, i) => {
                const color = getDateColor(b.booking_date);
                return (
                  <div 
                    key={i} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBooking(b);
                    }}
                    className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition hover:shadow-md ${
                      getDateColorClass(color)
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate">{b.customer_name || 'N/A'}</p>
                        <p className="text-xs sm:text-sm opacity-75">{b.service_name || 'Service'}</p>
                      </div>
                      <div className="text-right sm:text-left">
                        <p className="font-bold text-sm sm:text-base">${parseFloat(b.price || 0).toFixed(2)}</p>
                        <p className="text-xs opacity-75">{formatDate(b.booking_date)} @ {formatTime(b.start_time)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
          getDateColor={getDateColor}
          getDateColorClass={getDateColorClass}
          onSelectBooking={setSelectedBooking}
        />
      )}

      {selectedDetail === 'services' && (
        <DetailModal
          title="All Services"
          onClose={() => setSelectedDetail(null)}
          type="services"
          items={stats.topServices}
          bookings={stats.bookings}
          formatDate={formatDate}
          formatTime={formatTime}
          getDateColor={getDateColor}
          getDateColorClass={getDateColorClass}
        />
      )}

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          formatDate={formatDate}
          formatTime={formatTime}
          getDateColor={getDateColor}
          getDateColorClass={getDateColorClass}
        />
      )}
    </div>
  );
}

// Detail Modal Component
function DetailModal({ 
  title, 
  onClose, 
  type, 
  items, 
  bookings,
  formatDate, 
  formatTime,
  getDateColor,
  getDateColorClass,
  onSelectBooking 
}) {
  const [expandedService, setExpandedService] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl sm:text-3xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          {type === 'bookings' && (
            <div className="space-y-4">
              {items.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No bookings</p>
              ) : (
                items.map((b, i) => {
                  const color = getDateColor(b.booking_date);
                  return (
                    <div
                      key={i}
                      onClick={() => onSelectBooking(b)}
                      className={`p-4 sm:p-5 rounded-lg border-2 cursor-pointer transition hover:shadow-lg ${getDateColorClass(
                        color
                      )}`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">{b.customer_name || 'N/A'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{b.service_name || 'Service'}</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {formatDate(b.booking_date)} at {formatTime(b.start_time)}
                          </p>
                        </div>
                        <div className="text-right sm:text-left">
                          <p className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">${parseFloat(b.price).toFixed(2)}</p>
                          <span
                            className={`text-xs sm:text-sm px-3 py-1 rounded-full inline-block mt-2 ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                                : b.status === 'completed'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                      </div>
                      {b.notes && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                          <span className="font-semibold">Notes:</span> {b.notes}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {type === 'services' && (
            <div className="space-y-4">
              {items.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No services</p>
              ) : (
                items.map((s, i) => {
                  const serviceBookings = bookings.filter(b => b.service_name === s.name);
                  return (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                      <button
                        onClick={() => setExpandedService(expandedService === i ? null : i)}
                        className="w-full p-4 sm:p-5 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">{s.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total bookings: {s.bookings} | Revenue: ${s.revenue.toFixed(2)}</p>
                        </div>
                        <span className={`text-lg transition ${expandedService === i ? 'rotate-180' : ''}`}>▼</span>
                      </button>
                      
                      {expandedService === i && (
                        <div className="border-t border-gray-200 dark:border-gray-600 p-4 sm:p-5 bg-white dark:bg-gray-800 space-y-3">
                          {serviceBookings.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">No bookings for this service</p>
                          ) : (
                            serviceBookings.map((b, idx) => {
                              const color = getDateColor(b.booking_date);
                              return (
                                <div 
                                  key={idx} 
                                  className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition hover:shadow-md ${getDateColorClass(
                                    color
                                  )}`}
                                >
                                  <div className="flex justify-between items-start gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-900 dark:text-white truncate">{b.customer_name}</p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">{formatDate(b.booking_date)} @ {formatTime(b.start_time)}</p>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white whitespace-nowrap">${parseFloat(b.price).toFixed(2)}</p>
                                  </div>
                                  {b.notes && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-700 rounded">📝 {b.notes}</p>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Individual Booking Detail Modal
function BookingDetailModal({ 
  booking, 
  onClose, 
  formatDate, 
  formatTime,
  getDateColor,
  getDateColorClass 
}) {
  const color = getDateColor(booking.booking_date);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl sm:text-3xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Customer Info */}
          <div className={`p-4 sm:p-5 rounded-lg border-2 ${getDateColorClass(color)}`}>
            <h3 className="font-bold text-lg mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs opacity-75 mb-1">Full Name</p>
                <p className="font-semibold text-base">{booking.customer_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs opacity-75 mb-1">Phone</p>
                <p className="font-semibold text-base">{booking.customer_phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs opacity-75 mb-1">Email</p>
                <p className="font-semibold text-base break-all">{booking.customer_email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="p-4 sm:p-5 rounded-lg bg-purple-50 dark:bg-purple-900 border-2 border-purple-200 dark:border-purple-700">
            <h3 className="font-bold text-lg mb-3">Service Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs opacity-75 mb-1">Service Name</p>
                <p className="font-semibold text-base">{booking.service_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs opacity-75 mb-1">Estimated Time</p>
                <p className="font-semibold text-base">{booking.service_duration || 'N/A'} mins</p>
              </div>
              <div>
                <p className="text-xs opacity-75 mb-1">Price</p>
                <p className="font-semibold text-base text-pink-600 dark:text-pink-400">${parseFloat(booking.price).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs opacity-75 mb-1">Status</p>
                <span
                  className={`text-xs px-3 py-1 rounded-full inline-block ${
                    booking.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                      : booking.status === 'completed'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="p-4 sm:p-5 rounded-lg bg-blue-50 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700">
            <h3 className="font-bold text-lg mb-3">Appointment Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs opacity-75 mb-1">Date</p>
                <p className="font-semibold text-base">{formatDate(booking.booking_date)}</p>
              </div>
              <div>
                <p className="text-xs opacity-75 mb-1">Time</p>
                <p className="font-semibold text-base">{formatTime(booking.start_time)}</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {booking.notes && (
            <div className="p-4 sm:p-5 rounded-lg bg-yellow-50 dark:bg-yellow-900 border-2 border-yellow-200 dark:border-yellow-700">
              <h3 className="font-bold text-lg mb-3">📝 Additional Notes</h3>
              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-800 text-white rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default OverviewPanel;
