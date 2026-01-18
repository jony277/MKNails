import { Link } from 'react-router-dom'

const GalleryPage = () => {
  // Placeholder gallery images - replace with real images
  const galleryImages = [
    { url: 'https://via.placeholder.com/300x300?text=Gel+Nails', title: 'Gel Manicure' },
    { url: 'https://via.placeholder.com/300x300?text=Nail+Art', title: 'Custom Nail Art' },
    { url: 'https://via.placeholder.com/300x300?text=Acrylic', title: 'Acrylic Set' },
    { url: 'https://via.placeholder.com/300x300?text=French', title: 'French Tips' },
    { url: 'https://via.placeholder.com/300x300?text=Pedicure', title: 'Pedicure' },
    { url: 'https://via.placeholder.com/300x300?text=Design', title: 'Intricate Design' },
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

      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-4">Gallery</h1>
        <p className="text-xl text-gray-300 mb-12">Explore our latest nail designs and creations</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-400/60 transition-all group">
              <div className="relative overflow-hidden h-64 bg-slate-800">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="p-4 bg-slate-800/60 backdrop-blur-sm">
                <h3 className="font-semibold text-pink-400">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default GalleryPage
