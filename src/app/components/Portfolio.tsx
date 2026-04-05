import { motion } from 'motion/react';
import { ExternalLink, Github, Database, Globe, Layers } from 'lucide-react';
import { useState } from 'react';

export function Portfolio() {
  const [filter, setFilter] = useState<'all' | 'web' | 'data' | 'fullstack'>('all');

  const projects = [
    {
      id: 1,
      name: 'E-Commerce Dashboard',
      type: 'fullstack' as const,
      description: 'Dashboard analytics untuk platform e-commerce dengan real-time data visualization dan reporting system',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      category: 'Fullstack',
      icon: Layers,
    },
    {
      id: 2,
      name: 'Data Pipeline ETL',
      type: 'data' as const,
      description: 'Pipeline ETL untuk mengumpulkan, membersihkan, dan mentransformasi data dari multiple sources ke data warehouse',
      techStack: ['Python', 'PostgreSQL', 'Apache Airflow', 'Docker'],
      category: 'Data Engineering',
      icon: Database,
    },
    {
      id: 3,
      name: 'Portfolio Website',
      type: 'web' as const,
      description: 'Website portfolio interaktif dengan dark mode, animasi smooth, dan design responsif',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Motion'],
      category: 'Web Development',
      icon: Globe,
    },
    {
      id: 4,
      name: 'Sales Analytics Dashboard',
      type: 'data' as const,
      description: 'Dashboard interaktif untuk visualisasi data penjualan dengan berbagai chart dan filtering options',
      techStack: ['Python', 'Pandas', 'Plotly', 'SQL'],
      category: 'Data Engineering',
      icon: Database,
    },
    {
      id: 5,
      name: 'Task Management App',
      type: 'fullstack' as const,
      description: 'Aplikasi manajemen tugas dengan fitur kolaborasi tim, real-time updates, dan notification system',
      techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      category: 'Fullstack',
      icon: Layers,
    },
    {
      id: 6,
      name: 'Weather Forecast App',
      type: 'web' as const,
      description: 'Aplikasi cuaca dengan data real-time dari API, menampilkan forecast 7 hari dan kondisi cuaca detail',
      techStack: ['React', 'TypeScript', 'Weather API', 'Tailwind'],
      category: 'Web Development',
      icon: Globe,
    },
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.type === filter);

  const filterButtons = [
    { label: 'Semua', value: 'all' as const },
    { label: 'Web', value: 'web' as const },
    { label: 'Data', value: 'data' as const },
    { label: 'Fullstack', value: 'fullstack' as const },
  ];

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
          
          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-8">
            {filterButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => setFilter(button.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === button.value
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Project header with icon */}
              <div className="h-32 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center relative overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <project.icon size={48} className="text-white" />
                </motion.div>
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-mono">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project content */}
              <div className="p-6">
                <h3 className="text-xl mb-3 group-hover:text-cyan-500 transition-colors duration-300">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href="https://github.com/farisalfatih"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors duration-300"
                  >
                    <Github size={18} />
                    <span className="text-sm">Code</span>
                  </a>
                  <a
                    href="https://github.com/farisalfatih"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors duration-300"
                  >
                    <ExternalLink size={18} />
                    <span className="text-sm">Demo</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ingin melihat lebih banyak project?
          </p>
          <a
            href="https://github.com/farisalfatih"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Github size={20} />
            Kunjungi GitHub Saya
          </a>
        </motion.div>
      </div>
    </section>
  );
}