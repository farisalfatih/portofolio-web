import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Download } from 'lucide-react'
import { api } from '../../lib/api'
import profileImage from '../../assets/images/profile.png'

export function Contact() {
  const [data, setData] = useState(null)
  const [heroData, setHeroData] = useState(null)

  useEffect(() => {
    api.getContact().then((res) => setData(res.data)).catch(() => {})
    api.getHero().then((res) => setHeroData(res.data)).catch(() => {})
  }, [])

  const email = data?.email || 'farisalfatih777@gmail.com'
  const phone = data?.phone || '+62 81357700860'
  const location = data?.location || 'Gresik, Indonesia'
  const whatsappUrl = data?.whatsapp_url || 'https://wa.me/6281357700860'
  const mapsUrl = data?.maps_url || '#'
  const cvUrl = heroData?.cv_url || '#'
  const githubUrl = heroData?.github_url || '#'
  const linkedinUrl = heroData?.linkedin_url || '#'
  const instagramUrl = heroData?.instagram_url || '#'

  const contactInfo = [
    { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    { icon: Phone, label: 'Phone', value: phone, href: whatsappUrl },
    { icon: MapPin, label: 'Location', value: location, href: mapsUrl },
  ]

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: githubUrl, color: 'hover:bg-gray-700' },
    { icon: Linkedin, label: 'LinkedIn', href: linkedinUrl, color: 'hover:bg-blue-600' },
    { icon: Instagram, label: 'Instagram', href: instagramUrl, color: 'hover:bg-pink-600' },
  ]

  return (
    <section id="contact" className="py-16 md:py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            Hubungi <span className="text-cyan-500">Saya</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Punya project menarik atau ingin berkolaborasi? Silakan cek info kontak saya di bawah!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl mb-6">Info Kontak</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{info.label}</p>
                      <a href={info.href} className="text-gray-900 dark:text-white hover:text-cyan-500 transition-colors">
                        {info.value}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl mb-6">Sosial Media</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className={`w-14 h-14 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 ${social.color}`}
                  >
                    <social.icon size={24} />
                  </motion.a>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Download size={20} />
                Download CV
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center rounded-xl"
          >
            <div className="w-full max-w-sm overflow-hidden rounded-xl">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
