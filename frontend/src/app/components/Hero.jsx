import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Github, Linkedin, Instagram, ChevronDown } from 'lucide-react'
import { api } from '../../lib/api'
import staticProfileImage from '../../assets/images/profile.png'

export function Hero({ onScrollToPortfolio, onScrollToContact }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.getHero().then((res) => setData(res.data)).catch(() => {})
  }, [])

  const name = data?.name || 'Mohammad Faris Al Fatih'
  const tagline = data?.tagline || 'Web Developer & Aspiring Data Engineer'
  const quote = data?.quote || '"Membangun web, memahami data"'
  const githubUrl = data?.github_url || 'https://github.com/farisalfatih'
  const linkedinUrl = data?.linkedin_url || 'https://www.linkedin.com/in/mohammad-faris-al-fatih-b523a2297/'
  const instagramUrl = data?.instagram_url || 'https://instagram.com/farisalfatih777'
  const cvUrl = data?.cv_url || '#'
  // Gunakan foto dari Cloudinary jika ada, fallback ke gambar statis
  const profileImage = data?.profile_image_url || staticProfileImage

  const socialLinks = [
    { icon: Github, href: githubUrl, label: 'GitHub' },
    { icon: Linkedin, href: linkedinUrl, label: 'LinkedIn' },
    { icon: Instagram, href: instagramUrl, label: 'Instagram' },
  ]

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-20 pt-24 md:pt-20">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left order-2 md:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-cyan-500/10 rounded-full mb-6"
            >
              <span className="text-cyan-500 font-mono text-sm">👋 Welcome to my portfolio</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              {name}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl lg:text-3xl mb-4 text-cyan-500"
            >
              {tagline}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 font-mono"
            >
              {quote}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start mb-8"
            >
              <button
                onClick={onScrollToPortfolio}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Lihat Portofolio
              </button>
              {cvUrl && cvUrl !== '#' && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-500 hover:text-white transition-all duration-300"
                >
                  Download CV
                </a>
              )}
              <button
                onClick={onScrollToContact}
                className="px-8 py-3 border-2 border-gray-600 text-gray-400 rounded-lg hover:border-cyan-500 hover:text-cyan-500 transition-all duration-300"
              >
                Hubungi Saya
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4 justify-center md:justify-start"
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-cyan-500 hover:text-white transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <link.icon size={20} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Profile image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center order-1 md:order-2"
          >
            <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-50" />
              <img
                src={profileImage}
                alt={name}
                className="relative w-full max-w-md rounded-2xl shadow-2xl object-cover"
              />
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500 rounded-lg opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500 rounded-full opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="text-cyan-500" size={32} />
      </motion.div>
    </section>
  )
}
