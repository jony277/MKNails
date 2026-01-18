import { Link } from 'react-router-dom'

const ServicesPage = () => {
  const services = [
    {
      name: 'Manicure',
      price: 25,
      duration: '30 min',
      description: 'Professional manicure with polish application',
      icon: '💅',
    },
    {
      name: 'Gel Polish',
      price: 35,
      duration: '45 min',
      description: 'Long-lasting gel polish that shines for weeks',
      icon: '✨',
    },
    {
      name: 'Acrylic Nails',
      price: 50,
      duration: '60 min',
      description: 'Beautiful acrylic extensions with custom designs',
      icon: '🎀',
    },
    {
      name: 'Pedicure',
      price: 30,
      duration: '45 min',
      description: 'Relaxing foot spa and polish service',
      icon: '👣',
    },
    {
      name: 'Nail Art',
      price: 45,
      duration: '60 min',
      description: 'Custom designs and creative nail art',
      icon: '🎨',
    },
    {
      name: 'Gel Removal',
      price: 15,
      duration: '20 min',
      description: 'Safe and gentle gel polish removal',
      icon: '✋',
    },
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
        <h1 className="text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-gray-300 mb-12">Discover our full range of professional nail care services</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.name} className="bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-2xl border border-purple-500/30 p-8 hover:border-pink-400/60 transition-all">
              <div className="text-6xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
              <p className="text-gray-300 mb-4">{service.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-purple-500/20">
                <span className="text-sm text-gray-400">{service.duration}</span>
                <span className="text-2xl font-bold text-pink-400">${service.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/booking"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/50 transition-all"
          >
            Book Now
          </Link>
        </div>
      </main>
    </div>
  )
}

export default ServicesPage
