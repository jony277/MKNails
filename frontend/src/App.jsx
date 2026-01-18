import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function HomePage() {
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookingStep, setBookingStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const services = [
    { id: 1, name: 'Manicure', price: 25, duration: '30 min', icon: '💅' },
    { id: 2, name: 'Gel Polish', price: 35, duration: '45 min', icon: '✨' },
    { id: 3, name: 'Acrylic Nails', price: 50, duration: '60 min', icon: '🎀' },
    { id: 4, name: 'Pedicure', price: 30, duration: '45 min', icon: '👣' },
    { id: 5, name: 'Nail Art', price: 45, duration: '60 min', icon: '🎨' },
    { id: 6, name: 'Gel Removal', price: 15, duration: '20 min', icon: '✋' },
  ]

  const timeSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM']

  const convertTo24Hour = (time12) => {
    const [time, period] = time12.split(' ')
    let [hours, minutes] = time.split(':')
    hours = parseInt(hours)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return `${String(hours).padStart(2, '0')}:${minutes}:00`
  }

  const handleBook = async () => {
    if (selectedService && selectedDate && selectedTime) {
      setIsLoading(true)
      try {
        const time24 = convertTo24Hour(selectedTime)

        console.log('🚀 Sending booking to backend:', { 
          service_id: selectedService.id, 
          booking_date: selectedDate, 
          start_time: time24 
        })
        
        const response = await fetch('http://localhost:5000/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: selectedService.id,
            booking_date: selectedDate,
            start_time: time24,
            customer_name: 'Walk-in Guest',
            customer_phone: '(000) 000-0000',
            special_requests: 'None',
          }),
        })

        const data = await response.json()

        if (response.ok) {
          alert(`✅ Booking Confirmed!\n\nService: ${selectedService.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\n\nBooking ID: ${data.id}\n\nYou'll receive an SMS confirmation shortly!`)
          setSelectedService(null)
          setSelectedDate('')
          setSelectedTime('')
          setBookingStep(1)
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
          <div className="flex items-center gap-3">
            <span className="text-3xl">✨</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">MK Nails</h1>
          </div>
          <p className="text-sm text-gray-400 hidden sm:block">Atlantis, Florida</p>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Your Perfect Nails
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Await You</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Elegant. Professional. Timeless.</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Services Grid */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2">Services</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service)
                    setBookingStep(1)
                  }}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedService?.id === service.id
                      ? 'border-pink-400 bg-gradient-to-br from-pink-500/20 to-purple-500/20 shadow-2xl shadow-pink-500/20'
                      : 'border-purple-500/30 bg-slate-800/40 hover:border-purple-400/60 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-purple-500/10'
                  }`}
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
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-br from-slate-800/80 to-purple-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Book Appointment</h3>

              {!selectedService ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">← Select a service</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Service Summary */}
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg p-4">
                    <p className="text-xs opacity-90 mb-1">Selected Service</p>
                    <p className="text-xl font-bold">{selectedService.name}</p>
                    <p className="text-sm opacity-90 mt-2">${selectedService.price}</p>
                  </div>

                  {/* Date Input */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-purple-400/30 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-white text-sm"
                    />
                  </div>

                  {/* Time Grid */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Time</label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 text-sm font-medium rounded-lg transition-all ${
                            selectedTime === time
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                              : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Confirmation */}
                  {selectedDate && selectedTime && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                      <p className="text-xs text-emerald-300">✓ Ready to book</p>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={handleBook}
                    disabled={!selectedDate || !selectedTime || isLoading}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      selectedDate && selectedTime && !isLoading
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-2xl hover:shadow-pink-500/50 text-white cursor-pointer'
                        : 'bg-slate-700/50 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? 'Processing...' : selectedDate && selectedTime ? 'Confirm Booking' : 'Select date & time'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">Confirmation via SMS</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-3 text-pink-400">MK Nails</h4>
              <p className="text-gray-400 text-sm">Premium nail care in Atlantis</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-pink-400">Hours</h4>
              <p className="text-gray-400 text-sm">Mon-Fri: 10am-7pm</p>
              <p className="text-gray-400 text-sm">Sat-Sun: 10am-6pm</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-pink-400">Contact</h4>
              <p className="text-gray-400 text-sm">(954) XXX-XXXX</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-pink-400">Follow</h4>
              <p className="text-gray-400 text-sm">Instagram • Facebook</p>
            </div>
          </div>
          <div className="border-t border-purple-500/20 pt-8 text-center text-gray-500 text-sm">
            <p>© 2024 MK Nails. Elegance Perfected.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
