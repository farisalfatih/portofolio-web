import { useEffect, useState, useRef } from 'react'
import { User, Zap, FolderKanban, FileText, ExternalLink, Image, Globe, CheckCircle, Upload, Loader2, XCircle } from 'lucide-react'
import { api } from '../../../lib/api'
import { useAuth } from '../../../context/AuthContext'

async function uploadFile(file, path, oldUrl = '') {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('portfolio_token')}`,
      'x-old-url': oldUrl,
    },
    body: fd,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Upload gagal')
  return data
}

function FaviconCard({ heroData, onSaved }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(heroData?.favicon_url || '')
  const [msg, setMsg]             = useState({ type: '', text: '' })
  const inputRef = useRef()

  useEffect(() => { setPreview(heroData?.favicon_url || '') }, [heroData])

  const handleFile = async (file) => {
    const ok = ['image/png','image/jpeg','image/webp','image/x-icon','image/vnd.microsoft.icon']
    if (!ok.includes(file.type)) return setMsg({ type:'error', text:'Gunakan PNG atau ICO.' })
    if (file.size > 2*1024*1024) return setMsg({ type:'error', text:'Ukuran maksimal 2MB.' })
    setMsg({ type:'', text:'' })
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const r = await uploadFile(file, '/api/upload/image', heroData?.favicon_url || '')
      await api.updateHero({ ...(heroData || {}), favicon_url: r.url })
      onSaved(r.url)
      setPreview(r.url)
      setMsg({ type:'success', text:'Favicon berhasil! Refresh browser untuk melihat.' })
    } catch (err) {
      setMsg({ type:'error', text: err.message })
      setPreview(heroData?.favicon_url || '')
    } finally { setUploading(false) }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Globe size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Favicon / Icon Tab</h3>
          <p className="text-xs text-gray-500">Icon yang muncul di tab browser</p>
        </div>
      </div>

      {msg.text && (
        <div className={`flex items-center gap-2 p-2.5 rounded-lg text-xs mb-3 ${msg.type==='success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {msg.type==='success' ? <CheckCircle size={12}/> : <XCircle size={12}/>} {msg.text}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {preview ? <img src={preview} alt="favicon" className="w-full h-full object-contain p-1"/> : <Globe size={24} className="text-gray-600"/>}
        </div>
        <div className="flex-1">
          <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-xs hover:border-purple-500 hover:text-purple-400 transition-colors disabled:opacity-60 w-full justify-center">
            {uploading ? <Loader2 size={13} className="animate-spin"/> : <Upload size={13}/>}
            {uploading ? 'Mengupload...' : 'Upload Favicon'}
          </button>
          <p className="text-xs text-gray-600 mt-1.5 text-center">PNG/ICO — ideal 512×512px</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/png,image/x-icon,image/webp" className="hidden"
        onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
    </div>
  )
}

function OGImageCard({ heroData, onSaved }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(heroData?.og_image_url || '')
  const [msg, setMsg]             = useState({ type: '', text: '' })
  const inputRef = useRef()

  useEffect(() => { setPreview(heroData?.og_image_url || '') }, [heroData])

  const handleFile = async (file) => {
    const ok = ['image/jpeg','image/png','image/webp']
    if (!ok.includes(file.type)) return setMsg({ type:'error', text:'Gunakan JPG atau PNG.' })
    if (file.size > 5*1024*1024) return setMsg({ type:'error', text:'Ukuran maksimal 5MB.' })
    setMsg({ type:'', text:'' })
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const r = await uploadFile(file, '/api/upload/image', heroData?.og_image_url || '')
      await api.updateHero({ ...(heroData || {}), og_image_url: r.url })
      onSaved(r.url)
      setPreview(r.url)
      setMsg({ type:'success', text:'OG Image berhasil! Preview WhatsApp akan pakai gambar ini.' })
    } catch (err) {
      setMsg({ type:'error', text: err.message })
      setPreview(heroData?.og_image_url || '')
    } finally { setUploading(false) }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
          <Image size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Preview WhatsApp / OG Image</h3>
          <p className="text-xs text-gray-500">Gambar saat link dibagikan ke WA, LinkedIn, FB</p>
        </div>
      </div>

      {msg.text && (
        <div className={`flex items-center gap-2 p-2.5 rounded-lg text-xs mb-3 ${msg.type==='success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {msg.type==='success' ? <CheckCircle size={12}/> : <XCircle size={12}/>} {msg.text}
        </div>
      )}

      <div className="mb-3 rounded-lg overflow-hidden bg-gray-800 border border-gray-700 aspect-[1200/630] flex items-center justify-center">
        {preview
          ? <img src={preview} alt="OG" className="w-full h-full object-cover"/>
          : <div className="text-center p-4"><Image size={32} className="text-gray-600 mx-auto mb-2"/><p className="text-xs text-gray-500">Belum ada gambar</p><p className="text-xs text-gray-600">Ideal: 1200×630px</p></div>
        }
      </div>

      <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-xs hover:border-green-500 hover:text-green-400 transition-colors disabled:opacity-60 w-full justify-center">
        {uploading ? <Loader2 size={13} className="animate-spin"/> : <Upload size={13}/>}
        {uploading ? 'Mengupload...' : 'Upload OG Image (1200×630px)'}
      </button>
      <p className="text-xs text-gray-600 mt-1.5 text-center">JPG/PNG — Maks. 5MB</p>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
    </div>
  )
}

export function DashboardHome() {
  const { user } = useAuth()
  const [stats, setStats]       = useState({ projects:0, skills:0, blogs:0 })
  const [heroData, setHeroData] = useState(null)

  useEffect(() => {
    Promise.all([api.getProjects(), api.getSkills(), api.getBlogPostsAll(), api.getHero()])
      .then(([proj, skills, blogs, hero]) => {
        setStats({
          projects: proj.data?.length || 0,
          skills: skills.data?.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0) || 0,
          blogs: blogs.data?.length || 0,
        })
        setHeroData(hero.data)
      })
      .catch(() => {})
  }, [])

  const statCards = [
    { label:'Total Proyek',       value:stats.projects, icon:FolderKanban, color:'from-cyan-500 to-blue-500' },
    { label:'Total Skill',        value:stats.skills,   icon:Zap,          color:'from-purple-500 to-pink-500' },
    { label:'Total Artikel Blog', value:stats.blogs,    icon:FileText,     color:'from-orange-500 to-red-500' },
  ]

  const quickLinks = [
    { label:'Hero & Profil',   to:'/master/hero' },
    { label:'Tentang Saya',    to:'/master/about' },
    { label:'Kelola Proyek',   to:'/master/projects' },
    { label:'Kelola Keahlian', to:'/master/skills' },
    { label:'Edit Kontak',     to:'/master/contact' },
    { label:'Tulis Blog',      to:'/master/blog' },
    { label:'Pengaturan',      to:'/master/settings' },
  ]

  const checks = [
    { label:'Foto Profil',   done:!!heroData?.profile_image_url },
    { label:'CV / Resume',   done:!!heroData?.cv_url },
    { label:'Favicon',       done:!!heroData?.favicon_url },
    { label:'OG Image (WA)', done:!!heroData?.og_image_url },
    { label:'Link GitHub',   done:!!heroData?.github_url },
    { label:'Link LinkedIn', done:!!heroData?.linkedin_url },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Selamat datang, <span className="text-cyan-400">{user?.username}</span> 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Kelola konten portfolio kamu dari sini.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <card.icon size={22} className="text-white"/>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Kelengkapan */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-3 text-sm">Kelengkapan Portfolio</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {checks.map(c => (
            <div key={c.label} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${c.done ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-gray-800 border border-gray-700 text-gray-500'}`}>
              {c.done
                ? <CheckCircle size={13} className="flex-shrink-0"/>
                : <div className="w-3 h-3 rounded-full border border-gray-600 flex-shrink-0"/>
              }
              {c.label}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">{checks.filter(c=>c.done).length}/{checks.length} item lengkap</p>
      </div>

      {/* SEO & Branding */}
      <div>
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Globe size={16} className="text-cyan-400"/> SEO & Branding
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <FaviconCard heroData={heroData} onSaved={url => setHeroData(d => ({...d, favicon_url:url}))}/>
          <OGImageCard heroData={heroData} onSaved={url => setHeroData(d => ({...d, og_image_url:url}))}/>
        </div>

        {/* Simulasi preview WA */}
        <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-3">Simulasi Preview WhatsApp</h3>
          <div className="bg-[#111b21] rounded-xl p-3 max-w-sm">
            <div className="bg-[#202c33] rounded-lg overflow-hidden">
              <div className="aspect-[1200/630] bg-gray-800 flex items-center justify-center overflow-hidden">
                {heroData?.og_image_url
                  ? <img src={heroData.og_image_url} alt="OG" className="w-full h-full object-cover"/>
                  : <p className="text-xs text-gray-500 text-center p-4">Upload OG Image untuk lihat preview</p>
                }
              </div>
              <div className="p-3 border-t border-gray-700">
                <p className="text-white text-xs font-semibold">
                  {heroData?.name || 'Faris Al Fatih'} | Web Developer & Data Engineer
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Halo! Saya Faris — Web Developer & Aspiring Data Engineer dari Gresik.
                </p>
                <p className="text-gray-600 text-xs mt-1 uppercase tracking-wide">farisalfatih.my.id</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <ExternalLink size={16} className="text-cyan-400"/> Akses Cepat
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map(link => (
            <a key={link.to} href={link.to}
              className="flex items-center justify-center text-center px-3 py-3 bg-gray-800 border border-gray-700 hover:border-cyan-500/50 rounded-lg text-sm text-gray-300 hover:text-cyan-400 transition-all duration-200">
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
        <p className="text-sm text-cyan-300">
          💡 <strong>Tips:</strong> Semua perubahan langsung tampil di portfolio publik.{' '}
          <a href="/" target="_blank" className="underline hover:text-white">Lihat portfolio kamu →</a>
        </p>
      </div>

    </div>
  )
}
