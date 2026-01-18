import { Link } from 'react-router-dom'
import { useState } from 'react'

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
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
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-300 mb-12">Get in touch with us for any questions or special requests</p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-2xl border border-purple-500/30 p-8">
              <h3 className="text-2xl font-bold mb-2">📍 Location</h3>
              <p className="text-gray-300">19800 S Dixie Hwy Suite 9</p>
              <p className="text-gray-300">Cutler Bay, FL 33015</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-2xl border border-purple-500/30 p-8">
              <h3 className="text-2xl font-bold mb-2">📞 Phone</h3>
              <p className="text-gray-300">(954) XXX-XXXX</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-2xl border border-purple-500/30 p-8">
              <h3 className="text-2xl font-bold mb-2">🕐 Hours</h3>
              <div className="text-gray-300 space-y-1">
                <p>Mon-Fri: 10am - 7pm</p>
                <p>Sat-Sun: 10am - 6pm</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-2xl border border-purple-500/30 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-purple-400/30 focus:border-pink-400 focus:outline-none text-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-purple-400/30 focus:border-pink-400 focus:outline-none text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-purple-400/30 focus:border-pink-400 focus:outline-none text-white resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/50 transition-all"
              >
                Send Message
              </button>
            </form>
            {submitted && (
              <div className="mt-4 p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-200">
                ✓ Message sent! We'll get back to you soon.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ContactPage
