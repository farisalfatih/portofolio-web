import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Download } from 'lucide-react'
import { api } from '../../lib/api'
import staticProfile from '../../assets/images/profile.png'

export function Contact() {
  const [contact, setContact] = useState(null)
  const [hero, setHero]       = useState(null)

  useEffect(() => {
    api.getContact().then(r => setContact(r.data)).catch(() => {})
    api.getHero().then(r => setHero(r.data)).catch(() => {})
  }, [])

  const email       = contact?.email        || 'farisalfatih777@gmail.com'
  const phone       = contact?.phone        || '+62 81357700860'
  const location    = contact?.location     || 'Gresik, Indonesia'
  const waUrl       = contact?.whatsapp_url || 'https://wa.me/6281357700860'
  const mapsUrl     = contact?.maps_url     || '#'
  const cvUrl       = hero?.cv_url          || ''
  const githubUrl   = hero?.github_url      || '#'
  const linkedinUrl = hero?.linkedin_url    || '#'
  const instaUrl    = hero?.instagram_url   || '#'
  const profileImg  = hero?.profile_image_url || staticProfile

  const contacts = [
    { icon: Mail,   label: 'Email',    value: email,    href: `mailto:${email}` },
    { icon: Phone,  label: 'WhatsApp', value: phone,    href: waUrl },
    { icon: MapPin, label: 'Lokasi',   value: location, href: mapsUrl },
  ]
  const socials = [
    { icon: Github,    label: 'GitHub',    href: githubUrl,   color: 'hover:bg-gray-700' },
    { icon: Linkedin,  label: 'LinkedIn',  href: linkedinUrl, color: 'hover:bg-blue-600' },
    { icon: Instagram, label: 'Instagram', href: instaUrl,    color: 'hover:bg-pink-600' },
  ]

  return (
    <section id="contact" className="py-16 md:py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.6 }} className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            Hubungi <span className="text-cyan-500">Saya</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Punya project menarik atau ingin berkolaborasi? Silakan hubungi saya!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Info kontak */}
          <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }} transition={{ duration:0.6 }} className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Info Kontak</h3>
              <div className="space-y-4">
                {contacts.map((c, i) => (
                  <motion.div key={c.label}
                    initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
                    viewport={{ once:true }} transition={{ delay: i*0.1 }}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <c.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
                      <a href={c.href} target="_blank" rel="noopener noreferrer"
                        className="text-gray-900 dark:text-white hover:text-cyan-500 transition-colors">
                        {c.value}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">Sosial Media</h3>
              <div className="flex gap-4">
                {socials.map((s, i) => (
                  <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity:0, scale:0.5 }} whileInView={{ opacity:1, scale:1 }}
                    viewport={{ once:true }} transition={{ delay: i*0.1 }}
                    whileHover={{ scale:1.1, y:-5 }}
                    className={`w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center text-white transition-all duration-300 ${s.color}`}>
                    <s.icon size={24} />
                  </motion.a>
                ))}
              </div>
            </div>

            {cvUrl && (
              <motion.a href={cvUrl} target="_blank" rel="noopener noreferrer" download
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                <Download size={20} /> Download CV
              </motion.a>
            )}
          </motion.div>

          {/* Foto profil */}
          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }} transition={{ duration:0.6 }}
            className="flex items-center justify-center">
            <div className="w-full max-w-sm overflow-hidden rounded-xl">
              <img src={profileImg} alt="Profile"
                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
