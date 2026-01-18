import { Link } from 'react-router-dom'

const ReviewsPage = () => {
  const reviews = [
    { name: 'Sarah M.', stars: 5, text: 'Amazing service! MK is so professional and talented. My nails look perfect!', date: '2 weeks ago' },
    { name: 'Jessica L.', stars: 5, text: 'Best nail salon in town. The attention to detail is incredible. Highly recommend!', date: '1 month ago' },
    { name: 'Maria R.', stars: 5, text: 'Absolutely love my nails! Will definitely be back for my next appointment.', date: '3 weeks ago' },
    { name: 'Amanda K.', stars: 5, text: 'Professional, clean, and beautiful work. MK really knows her craft!', date: '1 month ago' },
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
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-4">Customer Reviews</h1>
        <p className="text-xl text-gray-300 mb-12">See what our happy clients say about us</p>

        <div className="space-y-6">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-2xl border border-purple-500/30 p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-lg font-bold">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-lg">{review.name}</p>
                  <p className="text-sm text-gray-400">{review.date}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(review.stars)].map((_, i) => (
                  <span key={i} className="text-xl text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-gray-200">{review.text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ReviewsPage
