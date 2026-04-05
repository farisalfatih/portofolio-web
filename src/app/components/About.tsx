import { motion } from 'motion/react';
import { Code2, Database, Sparkles } from 'lucide-react';

export function About() {
  const highlights = [
    {
      icon: Code2,
      title: 'Web Development',
      description: 'Membangun aplikasi web modern dan responsif dengan teknologi terkini',
    },
    {
      icon: Database,
      title: 'Data Engineering',
      description: 'Memproses dan menganalisis data untuk menghasilkan insights yang berharga',
    },
    {
      icon: Sparkles,
      title: 'Data-Driven Apps',
      description: 'Mengintegrasikan data dan visualisasi untuk aplikasi yang powerful',
    },
  ];

  return (
    <section id="about" className="py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            Tentang <span className="text-cyan-500">Saya</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Halo! Saya <span className="text-cyan-500 font-semibold">Mohammad Faris Al Fatih</span>, 
              seorang web developer yang passionate dalam membangun aplikasi web yang tidak hanya cantik, 
              tetapi juga powerful dan data-driven.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Dengan latar belakang di web development, saya terus mengembangkan keahlian saya 
              di bidang data engineering. Saya percaya bahwa kombinasi kemampuan development dan 
              pemahaman data adalah kunci untuk membangun aplikasi modern yang efektif.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Saya senang bekerja dengan teknologi terbaru dan selalu mencari cara untuk 
              mengoptimalkan performa aplikasi serta memberikan pengalaman terbaik bagi pengguna.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <item.icon className="text-white" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}