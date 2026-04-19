import { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { Navbar }    from './components/Navbar'
import { Hero }      from './components/Hero'
import { About }     from './components/About'
import { Skills }    from './components/Skills'
import { Portfolio } from './components/Portfolio'
import { Contact }   from './components/Contact'
import { Footer }    from './components/Footer'
import { MasterLayout } from './pages/master/MasterLayout'
import { LoginPage }    from './pages/master/LoginPage'

function MainSite() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const portfolioRef = useRef(null)
  const contactRef   = useRef(null)

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(p => !p)} />
      <main>
        <Hero
          onScrollToPortfolio={() => portfolioRef.current?.scrollIntoView({ behavior: 'smooth' })}
          onScrollToContact={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}
        />
        <About />
        <Skills />
        <div ref={portfolioRef}><Portfolio /></div>
        <div ref={contactRef}><Contact /></div>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"              element={<MainSite />} />
        <Route path="/master/login"  element={<LoginPage />} />
        <Route path="/master/*"      element={<MasterLayout />} />
      </Routes>
    </AuthProvider>
  )
}
