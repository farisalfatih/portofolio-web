import { motion } from 'motion/react'
import { Github, Linkedin, Instagram, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-2xl font-bold font-mono text-cyan-500">{'<Faris />'}</span>
            <p className="text-gray-400 text-sm mt-1">Web Developer & Data Engineer</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            {[
              { icon: Github, href: 'https://github.com/farisalfatih' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/mohammad-faris-al-fatih-b523a2297/' },
              { icon: Instagram, href: 'https://instagram.com/farisalfatih777' },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-cyan-500 flex items-center justify-center transition-colors duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
            © {currentYear} Mohammad Faris Al Fatih. Dibuat dengan <Heart size={14} className="text-red-500 fill-red-500" /> menggunakan React & Tailwind.
          </p>
        </div>
      </div>
    </footer>
  )
}
