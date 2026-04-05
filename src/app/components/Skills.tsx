import { motion } from 'motion/react';

export function Skills() {
  const skillCategories = [
    {
      category: 'Frontend Development',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS'],
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      category: 'Backend & Data',
      skills: ['Python', 'Node.js', 'SQL', 'PostgreSQL'],
      color: 'from-blue-400 to-blue-600',
    },
    {
      category: 'Tools & DevOps',
      skills: ['Git', 'Docker', 'Linux', 'VS Code'],
      color: 'from-purple-400 to-purple-600',
    },
    {
      category: 'Data Engineering',
      skills: ['Pandas', 'Data Analysis', 'ETL Pipeline', 'Database Design'],
      color: 'from-orange-400 to-orange-600',
    },
  ];

  return (
    <section id="skills" className="py-16 md:py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            Keahlian & <span className="text-cyan-500">Teknologi</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Teknologi dan tools yang saya gunakan dalam pengembangan web dan data engineering
          </p>
        </motion.div>

        {/* Skill Categories */}
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-1 h-8 bg-gradient-to-b ${category.color} rounded-full`} />
                <h3 className="text-xl">{category.category}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-cyan-500 hover:text-white transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Tech Stack Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Dan terus belajar teknologi baru untuk mengembangkan skill 🚀
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['APIs', 'RESTful', 'Responsive Design', 'Agile', 'Problem Solving'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="px-5 py-2 border-2 border-cyan-500 text-cyan-500 rounded-full text-sm font-medium"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}