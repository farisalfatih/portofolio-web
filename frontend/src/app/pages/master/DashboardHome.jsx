import { useEffect, useState } from 'react'
import { User, Zap, FolderKanban, FileText, ExternalLink } from 'lucide-react'
import { api } from '../../../lib/api'
import { useAuth } from '../../../context/AuthContext'

export function DashboardHome() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ projects: 0, skills: 0, blogs: 0 })

  useEffect(() => {
    Promise.all([api.getProjects(), api.getSkills(), api.getBlogPostsAll()])
      .then(([proj, skills, blogs]) => {
        setStats({
          projects: proj.data.length,
          skills: skills.data.reduce((acc, cat) => acc + cat.skills.length, 0),
          blogs: blogs.data.length,
        })
      })
      .catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Proyek', value: stats.projects, icon: FolderKanban, color: 'from-cyan-500 to-blue-500' },
    { label: 'Total Skill', value: stats.skills, icon: Zap, color: 'from-purple-500 to-pink-500' },
    { label: 'Total Artikel Blog', value: stats.blogs, icon: FileText, color: 'from-orange-500 to-red-500' },
  ]

  const quickLinks = [
    { label: 'Edit Hero & Profil', to: '/master/hero' },
    { label: 'Kelola Proyek', to: '/master/projects' },
    { label: 'Kelola Keahlian', to: '/master/skills' },
    { label: 'Edit Kontak', to: '/master/contact' },
    { label: 'Tulis Blog', to: '/master/blog' },
  ]

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Selamat datang, <span className="text-cyan-400">{user?.username}</span> 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Kelola konten portfolio kamu dari sini.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <card.icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <ExternalLink size={16} className="text-cyan-400" />
          Akses Cepat
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickLinks.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="flex items-center justify-center text-center px-3 py-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-cyan-500/50 rounded-lg text-sm text-gray-300 hover:text-cyan-400 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
        <p className="text-sm text-cyan-300">
          💡 <strong>Tips:</strong> Semua perubahan yang kamu buat akan langsung tampil di halaman portfolio publik.
          Kunjungi <a href="/" target="_blank" className="underline hover:text-white">portfolio kamu</a> untuk melihat hasilnya.
        </p>
      </div>
    </div>
  )
}
