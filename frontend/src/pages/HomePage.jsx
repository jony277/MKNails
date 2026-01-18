import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [showFullBooking, setShowFullBooking] = useState(false)

  const services = [
    { id: 1, name: 'Manicure', price: 25, duration: '30 min', icon: '💅' },
    { id: 2, name: 'Gel Polish', price: 35, duration: '45 min', icon: '✨' },
    { id: 3, name: 'Acrylic Nails', price: 50, duration: '60 min', icon: '🎀' },
    { id: 4, name: 'Pedicure', price: 30, duration: '45 min', icon: '👣' },
    { id: 5, name: 'Nail Art', price: 45, duration: '60 min', icon: '🎨' },
    { id: 6, name: 'Gel Removal', price: 15, duration: '20 min', icon: '✋' },
  ]

  const timeSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM']

  const convertTo24Hour = (time12) => {
    const [time, period] = time12.split(' ')
    let [hours, minutes] = time.split(':')
    hours = parseInt(hours)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return `${String(hours).padStart(2, '0')}:${minutes}:00`
  }

  const handleBook = async () => {
    if (selectedService && selectedDate && selectedTime && customerName && customerPhone) {
      setIsLoading(true)
      try {
        const time24 = convertTo24Hour(selectedTime)
        const response = await fetch('http://localhost:5000/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: selectedService.id,
            booking_date: selectedDate,
            start_time: time24,
            customer_name: customerName,
            customer_phone: customerPhone,
            special_requests: '',
          }),
        })

        const data = await response.json()
        if (response.ok) {
          setBookingSuccess(true)
          setTimeout(() => {
            setSelectedService(null)
            setSelectedDate('')
            setSelectedTime('')
            setCustomerName('')
            setCustomerPhone('')
            setBookingSuccess(false)
            setShowFullBooking(false)
          }, 3000)
        } else {
          alert(`❌ Booking Failed\n\n${data.error || 'Please try again'}`)
        }
      } catch (error) {
        console.error('Booking error:', error)
        alert(`❌ Error: ${error.message}\n\nMake sure the backend server is running on port 5000`)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-3xl">💅</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">MK Nails</h1>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-gray-300 hover:text-pink-400 transition-colors text-sm font-medium">Services</a>
            <Link to="#gallery" className="text-gray-300 hover:text-pink-400 transition-colors text-sm font-medium">Gallery</Link>
            <a href="#reviews" className="text-gray-300 hover:text-pink-400 transition-colors text-sm font-medium">Reviews</a>
            <Link to="/contact" className="text-gray-300 hover:text-pink-400 transition-colors text-sm font-medium">Contact</Link>
          </div>

          <button
            onClick={() => setShowFullBooking(true)}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all"
          >
            Book Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          {/* Sparkles */}
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="sparkle-icon"
                style={{
                  width: '24px',
                  height: '24px',
                  animation: 'sparkleFloat 3.2s ease-in-out infinite',
                  animationDelay: `${i * 0.4}s`,
                  opacity: 0.8,
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2l1.4 4.1L17.5 7.5 13.9 10 15 14.5 12 12.5 9 14.5 10.1 10 6.5 7.5 10.6 6.1 12 2z"
                    fill="white"
                    stroke="#fbb6ce"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            ))}
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Hola Bonita
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Welcome to Your Moment of Self-Care</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">Premium nail care in Atlantis. You deserve to feel beautiful, inside and out.</p>

          <button
            onClick={() => setShowFullBooking(true)}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105"
          >
            Let's Get Started
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div id="services" className="mb-8">
          <h3 className="text-3xl font-bold mb-2">Services</h3>
          <div className="h-1 w-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setSelectedService(service)
                setShowFullBooking(true)
              }}
              className="group relative p-6 rounded-xl border-2 border-purple-500/30 bg-slate-800/40 hover:border-pink-400/60 hover:bg-slate-800/60 transition-all duration-300"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{service.icon}</div>
              <h4 className="text-lg font-semibold mb-2 text-left">{service.name}</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{service.duration}</span>
                <span className="text-xl font-bold text-pink-400">${service.price}</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Reviews Section */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-2">Customer Reviews</h3>
          <div className="h-1 w-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah M.', rating: 5, text: 'Best nail salon in Atlantis! The service is impeccable.' },
            { name: 'Jessica L.', rating: 5, text: 'MK Nails is amazing! Always leaves me looking beautiful.' },
            { name: 'Maria G.', rating: 5, text: 'Professional, friendly, and affordable. Highly recommend!' },
          ].map((review, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4">"{review.text}"</p>
              <p className="text-pink-400 font-semibold">{review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      {showFullBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 p-6 border-b border-purple-500/20 flex items-center justify-between bg-slate-900/95 backdrop-blur">
              <h3 className="text-2xl font-bold">Book Your Appointment</h3>
              <button
                onClick={() => {
                  setShowFullBooking(false)
                  setSelectedService(null)
                  setSelectedDate('')
                  setSelectedTime('')
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {bookingSuccess ? (
                <div className="py-12 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h4 className="text-2xl font-bold text-emerald-400 mb-2">Booking Confirmed!</h4>
                  <p className="text-gray-300">We've received your booking and you'll get an SMS confirmation shortly.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-4">Select a Service</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedService?.id === service.id
                              ? 'border-pink-400 bg-gradient-to-br from-pink-500/20 to-purple-500/20 shadow-lg shadow-pink-500/20'
                              : 'border-purple-500/30 bg-slate-800/40 hover:border-purple-400/60'
                          }`}
                        >
                          <div className="text-2xl mb-2">{service.icon}</div>
                          <div className="text-left">
                            <p className="font-semibold text-sm">{service.name}</p>
                            <p className="text-xs text-gray-400">${service.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedService && (
                    <>
                      {/* Customer Info */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Full Name</label>
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Your name"
                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-400/30 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="(954) 000-0000"
                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-400/30 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-white"
                          />
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Date</label>
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-400/30 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Time</label>
                          <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-400/30 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-white"
                          >
                            <option value="">Choose a time</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Summary */}
                      {selectedDate && selectedTime && (
                        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Service</p>
                              <p className="font-bold text-pink-400">{selectedService.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Price</p>
                              <p className="font-bold text-pink-400">${selectedService.price}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Date</p>
                              <p className="font-bold">{selectedDate}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Time</p>
                              <p className="font-bold">{selectedTime}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <button
                        onClick={handleBook}
                        disabled={!customerName || !customerPhone || !selectedDate || !selectedTime || isLoading}
                        className={`w-full py-3 rounded-lg font-semibold transition-all ${
                          customerName && customerPhone && selectedDate && selectedTime && !isLoading
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-2xl hover:shadow-pink-500/50 text-white cursor-pointer'
                            : 'bg-slate-700/50 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isLoading ? 'Processing...' : 'Confirm Booking'}
                      </button>

                      <p className="text-xs text-gray-400 text-center">📱 You'll receive an SMS confirmation</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-3 text-pink-400">MK Nails</h4>
              <p className="text-gray-400 text-sm">Premium nail care in Atlantis, Florida</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-pink-400">Hours</h4>
              <p className="text-gray-400 text-sm">Mon-Fri: 10am-7pm</p>
              <p className="text-gray-400 text-sm">Sat-Sun: 10am-6pm</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-pink-400">Location</h4>
              <p className="text-gray-400 text-sm">19800 S Dixie Hwy Suite 9</p>
              <p className="text-gray-400 text-sm">Cutler Bay, FL 33015</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-pink-400">Contact</h4>
              <p className="text-gray-400 text-sm">(954) XXX-XXXX</p>
              <p className="text-gray-400 text-sm">Instagram • Facebook</p>
            </div>
          </div>
          <div className="border-t border-purple-500/20 pt-8 text-center text-gray-500 text-sm">
            <p>© 2024 MK Nails. Elegance Perfected.</p>
          </div>
        </div>
      </footer>

      {/* Sparkle Animation */}
      <style>{`
        @keyframes sparkleFloat {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.65;
          }
          25% {
            transform: translateY(-3px) scale(1.05);
            opacity: 1;
          }
          50% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          75% {
            transform: translateY(3px) scale(0.98);
            opacity: 0.6;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}

export default HomePage