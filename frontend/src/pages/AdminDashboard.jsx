import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, completed
  const [stats, setStats] = useState({ total: 0, today: 0, revenue: 0 })

  useEffect(() => {
    // Check if authenticated
    const isAuthenticated = localStorage.getItem('adminToken')
    if (!isAuthenticated) {
      navigate('/admin-login')
      return
    }

    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings')
      const data = await response.json()
      if (response.ok) {
        setBookings(data)
        calculateStats(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (bookingsData) => {
    const today = new Date().toISOString().split('T')[0]
    const todayBookings = bookingsData.filter(b => b.booking_date === today)
    const totalRevenue = bookingsData.reduce((sum, b) => sum + (b.amount || 0), 0)

    setStats({
      total: bookingsData.length,
      today: todayBookings.length,
      revenue: totalRevenue,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin-login')
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    if (filter === 'pending') return !booking.completed
    if (filter === 'completed') return booking.completed
    return true
  })

  const services = {
    1: { name: 'Manicure', price: 25 },
    2: { name: 'Gel Polish', price: 35 },
    3: { name: 'Acrylic Nails', price: 50 },
    4: { name: 'Pedicure', price: 30 },
    5: { name: 'Nail Art', price: 45 },
    6: { name: 'Gel Removal', price: 15 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-3xl">💅</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">MK Nails Admin</h1>
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Bookings</p>
                <p className="text-4xl font-bold text-pink-400">{stats.total}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Today's Appointments</p>
                <p className="text-4xl font-bold text-purple-400">{stats.today}</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Revenue (Bookings)</p>
                <p className="text-4xl font-bold text-emerald-400">${stats.revenue.toFixed(2)}</p>
              </div>
              <div className="text-4xl">💳</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-800/40 text-gray-300 hover:bg-slate-800/60'
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'pending'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-800/40 text-gray-300 hover:bg-slate-800/60'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-800/40 text-gray-300 hover:bg-slate-800/60'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Bookings Table */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-purple-500/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20 bg-slate-900/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-pink-400">Phone</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-purple-500/10 hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300">{booking.booking_date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white">{booking.customer_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {services[booking.service_id]?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{booking.start_time}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-pink-400">
                        ${services[booking.service_id]?.price || 0}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.completed
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}
                        >
                          {booking.completed ? '✅ Completed' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{booking.customer_phone}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-purple-500/30 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-pink-400">Next Steps</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>✅ Booking system: LIVE and accepting appointments</li>
            <li>💳 Square payments: Ready to integrate (see SQUARE_INTEGRATION_GUIDE.md)</li>
            <li>📱 SMS confirmations: Already sending to customers</li>
            <li>📧 Email notifications: Ready to add</li>
            <li>📈 Analytics: Dashboard showing all metrics</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>© 2024 MK Nails Admin Dashboard. Elegance Perfected.</p>
        </div>
      </footer>
    </div>
  )
}

export default AdminDashboard