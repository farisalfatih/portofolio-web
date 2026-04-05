import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export function Blog() {
  const articles = [
    {
      id: 1,
      title: 'Membangun ETL Pipeline dengan Python dan PostgreSQL',
      description: 'Panduan lengkap untuk membuat data pipeline yang efisien menggunakan Python, Pandas, dan PostgreSQL untuk data engineering.',
      date: '15 Maret 2026',
      readTime: '8 min',
      category: 'Data Engineering',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    },
    {
      id: 2,
      title: 'React Performance Optimization Tips',
      description: 'Tips dan trik untuk mengoptimalkan performa aplikasi React Anda, dari lazy loading hingga memoization.',
      date: '8 Maret 2026',
      readTime: '6 min',
      category: 'Web Development',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    },
    {
      id: 3,
      title: 'Docker untuk Data Engineers: Getting Started',
      description: 'Mulai menggunakan Docker untuk containerize aplikasi data engineering dan memudahkan deployment.',
      date: '1 Maret 2026',
      readTime: '10 min',
      category: 'DevOps',
      thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80',
    },
  ];

  return (
    <section id="blog" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4">
            Blog & <span className="text-cyan-500">Artikel</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Berbagi insights tentang web development dan data engineering
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-cyan-500 text-white text-xs rounded-full font-medium">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl mb-3 group-hover:text-cyan-500 transition-colors duration-300">
                  {article.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {article.description}
                </p>

                <div className="flex items-center gap-2 text-cyan-500 font-medium group-hover:gap-4 transition-all duration-300">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-500 hover:text-white transition-all duration-300">
            Lihat Semua Artikel
          </button>
        </motion.div>
      </div>
    </section>
  );
}
