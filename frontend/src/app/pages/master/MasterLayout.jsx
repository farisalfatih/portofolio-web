import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard, User, Zap, FolderKanban, Phone,
  FileText, LogOut, Menu, X, ChevronRight, Settings
} from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { DashboardHome } from './DashboardHome'
import { HeroManager } from './HeroManager'
import { AboutManager } from './AboutManager'
import { SkillsManager } from './SkillsManager'
import { ProjectsManager } from './ProjectsManager'
import { ContactManager } from './ContactManager'
import { BlogManager } from './BlogManager'
import { AccountSettings } from './AccountSettings'

const navItems = [
  { to: '/master', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/master/hero', label: 'Hero & Profil', icon: User },
  { to: '/master/about', label: 'Tentang Saya', icon: User },
  { to: '/master/skills', label: 'Keahlian', icon: Zap },
  { to: '/master/projects', label: 'Proyek', icon: FolderKanban },
  { to: '/master/contact', label: 'Kontak', icon: Phone },
  { to: '/master/blog', label: 'Blog', icon: FileText },
  { to: '/master/settings', label: 'Pengaturan', icon: Settings },
]

export function MasterLayout() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) navigate('/master/login')
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/master/login" replace />

  const handleLogout = () => {
    logout()
    navigate('/master/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar overlay on mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold font-mono text-cyan-500">{'<Master />'}</span>
              <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={18} />
            Keluar
          </button>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200 mt-1"
          >
            <ChevronRight size={18} className="rotate-180" />
            Lihat Portfolio
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="text-white font-semibold">Admin Panel</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="hero" element={<HeroManager />} />
            <Route path="about" element={<AboutManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="contact" element={<ContactManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="settings" element={<AccountSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
