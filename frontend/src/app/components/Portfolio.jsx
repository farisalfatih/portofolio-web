import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { ExternalLink, Github, Database, Globe, Layers } from 'lucide-react'
import { api } from '../../lib/api'

const typeIcons = { web: Globe, data: Database, fullstack: Layers }

export function Portfolio() {
  const [filter, setFilter] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProjects().then((res) => { setProjects(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.type === filter)

  const filterButtons = [
    { label: 'Semua', value: 'all' },
    { label: 'Web', value: 'web' },
    { label: 'Data', value: 'data' },
    { label: 'Fullstack', value: 'fullstack' },
  ]

  return (
    <section id="portfolio" className="py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            Portofolio & <span className="text-cyan-500">Proyek</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full mb-8" />
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-8">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === btn.value
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, index) => {
              const Icon = typeIcons[project.type] || Globe
              const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : []
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="h-32 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center relative overflow-hidden">
                    <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.5 }}>
                      <Icon size={48} className="text-white" />
                    </motion.div>
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-mono">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl mb-3 group-hover:text-cyan-500 transition-colors duration-300">{project.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {techStack.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors duration-300">
                          <Github size={18} /><span className="text-sm">Code</span>
                        </a>
                      )}
                      {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors duration-300">
                          <ExternalLink size={18} /><span className="text-sm">Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
