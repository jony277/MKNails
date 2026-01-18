import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const BookingPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to homepage where booking is now integrated
    const timer = setTimeout(() => {
      navigate('/')
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-3xl">💅</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">MK Nails</h1>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🔄</div>
          <h1 className="text-4xl font-bold mb-4">Redirecting to Booking...</h1>
          <p className="text-xl text-gray-300 mb-8">The booking experience has been unified into a better, more seamless flow.</p>
          <Link
            to="/"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all"
          >
            Go to Booking Now
          </Link>
        </div>
      </main>
    </div>
  )
}

export default BookingPage