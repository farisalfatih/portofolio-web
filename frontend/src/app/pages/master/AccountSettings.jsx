import { useState, useRef, useEffect } from 'react'
import { api } from '../../../lib/api'
import { useAuth } from '../../../context/AuthContext'
import { PageHeader, Card, SaveButton, Alert } from './components'
import { Eye, EyeOff, Shield, Camera, Loader2 } from 'lucide-react'

function AvatarUpload({ currentUrl, username, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(currentUrl || '')
  const [msg, setMsg]             = useState('')
  const inputRef = useRef()

  useEffect(() => { setPreview(currentUrl || '') }, [currentUrl])

  const handleFile = async (file) => {
    const ok = ['image/jpeg','image/png','image/webp','image/gif']
    if (!ok.includes(file.type))  return setMsg('Format tidak didukung.')
    if (file.size > 5*1024*1024) return setMsg('Ukuran maksimal 5MB.')

    setMsg('')
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const r = await api.uploadImage(file, currentUrl || '')
      onUploadSuccess(r.url)
      setPreview(r.url)
      setMsg('✓ Foto profil diperbarui!')
    } catch (err) {
      setMsg(err.message)
      setPreview(currentUrl || '')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-5">
      <div className="relative flex-shrink-0">
        {preview ? (
          <img src={preview} alt="Profile"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-700" />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
            {username?.[0]?.toUpperCase()}
          </div>
        )}
        <button type="button" onClick={() => !uploading && inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-7 h-7 bg-cyan-500 rounded-lg flex items-center justify-center hover:bg-cyan-400 transition-colors shadow-lg">
          {uploading ? <Loader2 size={12} className="animate-spin text-white"/> : <Camera size={12} className="text-white"/>}
        </button>
      </div>
      <div className="flex-1 min-w-0">
        {msg && <p className={`text-xs mb-1 ${msg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}
        <p className="text-xs text-gray-500">Klik ikon kamera untuk ganti foto profil</p>
        <p className="text-xs text-gray-600">JPG, PNG, WebP — Maks. 5MB</p>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden" onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
    </div>
  )
}

export function AccountSettings() {
  const { user } = useAuth()
  const [form, setForm]                       = useState({ currentPassword:'', newPassword:'', confirmPassword:'' })
  const [show, setShow]                       = useState({ current:false, new:false, confirm:false })
  const [loading, setLoading]                 = useState(false)
  const [alert, setAlert]                     = useState({ type:'', message:'' })
  const [profileImageUrl, setProfileImageUrl] = useState('')

  useEffect(() => {
    api.getHero()
      .then(r => { if (r.data?.profile_image_url) setProfileImageUrl(r.data.profile_image_url) })
      .catch(() => {})
  }, [])

  const handleAvatarUpload = async (url) => {
    setProfileImageUrl(url)
    try {
      const heroRes = await api.getHero()
      await api.updateHero({ ...(heroRes.data || {}), profile_image_url: url })
    } catch (err) {
      console.error('Gagal simpan foto:', err)
    }
  }

  const toggle = key => setShow({ ...show, [key]: !show[key] })
  const set    = key => e => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setAlert({ type:'', message:'' })
    if (form.newPassword !== form.confirmPassword)
      return setAlert({ type:'error', message:'Password baru dan konfirmasi tidak cocok.' })
    if (form.newPassword.length < 6)
      return setAlert({ type:'error', message:'Password minimal 6 karakter.' })
    setLoading(true)
    try {
      await api.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      setAlert({ type:'success', message:'Password berhasil diubah!' })
      setForm({ currentPassword:'', newPassword:'', confirmPassword:'' })
    } catch (err) {
      setAlert({ type:'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  const PasswordInput = ({ value, onChange, placeholder, showKey }) => (
    <div className="relative">
      <input type={show[showKey] ? 'text' : 'password'} value={value} onChange={onChange}
        placeholder={placeholder} required
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-600 text-sm" />
      <button type="button" onClick={() => toggle(showKey)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
        {show[showKey] ? <EyeOff size={16}/> : <Eye size={16}/>}
      </button>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <PageHeader title="Pengaturan Akun" description="Kelola foto profil dan keamanan akun admin." />
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type:'', message:'' })} />

      <Card className="mb-6">
        <AvatarUpload currentUrl={profileImageUrl} username={user?.username} onUploadSuccess={handleAvatarUpload} />
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-white font-semibold text-lg">{user?.username}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <div className="flex items-center gap-1 mt-1">
            <Shield size={12} className="text-cyan-400"/>
            <span className="text-xs text-cyan-400">Administrator</span>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <Shield size={16} className="text-cyan-400"/> Ganti Password
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password Saat Ini</label>
              <PasswordInput value={form.currentPassword} onChange={set('currentPassword')} placeholder="Password lama" showKey="current"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password Baru <span className="text-gray-500 font-normal">(min. 6 karakter)</span></label>
              <PasswordInput value={form.newPassword} onChange={set('newPassword')} placeholder="Password baru" showKey="new"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Konfirmasi Password Baru</label>
              <PasswordInput value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Ulangi password baru" showKey="confirm"/>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <SaveButton loading={loading} label="Ganti Password"/>
          </div>
        </Card>
      </form>
    </div>
  )
}
