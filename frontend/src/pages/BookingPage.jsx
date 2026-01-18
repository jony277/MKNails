import { Link } from 'react-router-dom'
import { useState } from 'react'

const BookingPage = () => {
  const [activeTab, setActiveTab] = useState('form')

  // **IMPORTANT: Replace this with your actual Square booking URL**
  // Get it from: Square Dashboard > Appointments > Online Booking > Copy URL
  const SQUARE_BOOKING_URL = 'https://square.site/book/your-salon-url' // <- UPDATE THIS

  const services = [
    { id: 1, name: 'Manicure', price: 25, duration: '30 min', icon: '💅' },
    { id: 2, name: 'Gel Polish', price: 35, duration: '45 min', icon: '✨' },
    { id: 3, name: 'Acrylic Nails', price: 50, duration: '60 min', icon: '🎀' },
    { id: 4, name: 'Pedicure', price: 30, duration: '45 min', icon: '👣' },
    { id: 5, name: 'Nail Art', price: 45, duration: '60 min', icon: '🎨' },
    { id: 6, name: 'Gel Removal', price: 15, duration: '20 min', icon: '✋' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-3xl">💅</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">MK Nails</h1>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded-full border border-pink-500/50 text-pink-400 hover:bg-pink-500/20 transition-colors"
          >
            Back
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Book Your Appointment</h1>
          <p className="text-xl text-gray-300">Choose your service and select a time that works for you</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'form'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-800/40 text-gray-300 hover:bg-slate-800/60'
            }`}
          >
            📋 Quick Booking
          </button>
          <button
            onClick={() => setActiveTab('square')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'square'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-800/40 text-gray-300 hover:bg-slate-800/60'
            }`}
          >
            💳 Online Booking & Payment (Square)
          </button>
        </div>

        {/* Form Tab */}
        {activeTab === 'form' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Services */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-6">Select a Service</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="p-6 rounded-xl border-2 border-purple-500/30 bg-slate-800/40 hover:border-purple-400/60 hover:bg-slate-800/60 cursor-pointer transition-all"
                  >
                    <div className="text-4xl mb-3">{service.icon}</div>
                    <h4 className="text-lg font-semibold mb-2">{service.name}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{service.duration}</span>
                      <span className="text-xl font-bold text-pink-400">${service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gradient-to-br from-slate-800/80 to-purple-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 shadow-2xl">
                <h3 className="text-xl font-bold mb-4">ℹ️ Booking Info</h3>
                <div className="space-y-4 text-sm text-gray-300">
                  <div>
                    <p className="font-semibold text-pink-400 mb-1">Hours</p>
                    <p>Monday-Friday: 10am - 7pm</p>
                    <p>Saturday-Sunday: 10am - 6pm</p>
                  </div>
                  <div>
                    <p className="font-semibold text-pink-400 mb-1">Location</p>
                    <p>19800 S Dixie Hwy Suite 9</p>
                    <p>Cutler Bay, FL 33015</p>
                  </div>
                  <div>
                    <p className="font-semibold text-pink-400 mb-1">Contact</p>
                    <p>(954) XXX-XXXX</p>
                  </div>
                  <div className="pt-4 border-t border-purple-500/20">
                    <p className="text-xs text-gray-400">💳 Payments accepted: Cash, Card, Online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Square Tab */}
        {activeTab === 'square' && (
          <div className="bg-slate-800/40 rounded-2xl border border-purple-500/30 p-8 min-h-[600px]">
            <h3 className="text-2xl font-bold mb-6">Online Booking & Payment</h3>
            <p className="text-gray-300 mb-6">Book your appointment and pay securely below. You'll receive a confirmation email immediately.</p>

            {SQUARE_BOOKING_URL === 'https://square.site/book/your-salon-url' ? (
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-6 text-center">
                <p className="text-yellow-200 font-semibold">⚠️ Configuration Needed</p>
                <p className="text-yellow-100 text-sm mt-2">Square booking URL not yet configured. Contact MK Nails to set up online payments.</p>
                <div className="mt-4">
                  <a
                    href="mailto:mknails@email.com?subject=Enable Online Booking"
                    className="inline-block px-6 py-2 bg-yellow-500 text-yellow-900 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                  >
                    Email MK Nails
                  </a>
                </div>
              </div>
            ) : (
              <iframe
                src={SQUARE_BOOKING_URL}
                style={{
                  width: '100%',
                  height: '600px',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                }}
                title="MK Nails - Online Booking"
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500 text-sm">
          <p>© 2024 MK Nails. Elegance Perfected.</p>
        </div>
      </footer>
    </div>
  )
}

export default BookingPage
