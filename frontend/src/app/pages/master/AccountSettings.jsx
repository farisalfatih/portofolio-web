import { useState, useRef, useEffect } from 'react'
import { api } from '../../../lib/api'
import { uploadToCloudinary, validateImage } from '../../../lib/cloudinary'
import { useAuth } from '../../../context/AuthContext'
import { PageHeader, Card, FormField, Input, SaveButton, Alert } from './components'
import { Eye, EyeOff, Shield, Camera, Loader2, Image } from 'lucide-react'

// ── Komponen Avatar Upload ────────────────────────────────────────────────────
function AvatarUpload({ currentUrl, username, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState(currentUrl || '')
  const [uploadAlert, setUploadAlert] = useState({ type: '', message: '' })
  const inputRef = useRef()

  useEffect(() => { setPreview(currentUrl || '') }, [currentUrl])

  const handleFile = async (file) => {
    setUploadAlert({ type: '', message: '' })
    try {
      validateImage(file)
      setPreview(URL.createObjectURL(file))
      setUploading(true)
      setProgress(0)
      const { url } = await uploadToCloudinary(file, 'image', setProgress)
      onUploadSuccess(url)
      setUploadAlert({ type: 'success', message: 'Foto profil berhasil diupdate!' })
    } catch (err) {
      setUploadAlert({ type: 'error', message: err.message })
      setPreview(currentUrl || '')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="flex items-center gap-5">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-700"
          />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
            {username?.[0]?.toUpperCase()}
          </div>
        )}
        {/* Tombol kamera overlay */}
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-7 h-7 bg-cyan-500 rounded-lg flex items-center justify-center hover:bg-cyan-400 transition-colors shadow-lg"
          title="Ganti foto profil"
        >
          {uploading ? <Loader2 size={12} className="animate-spin text-white" /> : <Camera size={12} className="text-white" />}
        </button>
      </div>

      {/* Info & status */}
      <div className="flex-1 min-w-0">
        {uploadAlert.message && (
          <p className={`text-xs mb-1 ${uploadAlert.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {uploadAlert.message}
          </p>
        )}
        {uploading && (
          <div className="mb-2">
            <div className="w-full bg-gray-800 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Mengupload... {progress}%</p>
          </div>
        )}
        <p className="text-xs text-gray-500">
          Klik ikon kamera untuk ganti foto profil
        </p>
        <p className="text-xs text-gray-600">JPG, PNG, WebP — Maks. 5MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
      />
    </div>
  )
}

// ── Komponen Utama AccountSettings ───────────────────────────────────────────
export function AccountSettings() {
  const { user } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [show, setShow] = useState({ current: false, new: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ type: '', message: '' })

  // Ambil profile_image_url dari hero data
  const [profileImageUrl, setProfileImageUrl] = useState('')
  useEffect(() => {
    api.getHero()
      .then((res) => { if (res.data?.profile_image_url) setProfileImageUrl(res.data.profile_image_url) })
      .catch(() => {})
  }, [])

  const handleProfileImageUpload = async (url) => {
    setProfileImageUrl(url)
    // Simpan url ke hero data
    try {
      const heroRes = await api.getHero()
      const heroData = heroRes.data || {}
      await api.updateHero({ ...heroData, profile_image_url: url })
    } catch (err) {
      console.error('Gagal menyimpan foto profil:', err)
    }
  }

  const toggle = (key) => setShow({ ...show, [key]: !show[key] })
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAlert({ type: '', message: '' })
    if (form.newPassword !== form.confirmPassword) {
      setAlert({ type: 'error', message: 'Password baru dan konfirmasi tidak cocok.' })
      return
    }
    if (form.newPassword.length < 6) {
      setAlert({ type: 'error', message: 'Password baru minimal 6 karakter.' })
      return
    }
    setLoading(true)
    try {
      await api.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      setAlert({ type: 'success', message: 'Password berhasil diubah!' })
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setAlert({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  const PasswordInput = ({ value, onChange, placeholder, showKey }) => (
    <div className="relative">
      <input
        type={show[showKey] ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-600 text-sm"
      />
      <button
        type="button"
        onClick={() => toggle(showKey)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
      >
        {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <PageHeader title="Pengaturan Akun" description="Kelola foto profil dan keamanan akun admin kamu." />
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {/* Profile info + photo upload */}
      <Card className="mb-6">
        <AvatarUpload
          currentUrl={profileImageUrl}
          username={user?.username}
          onUploadSuccess={handleProfileImageUpload}
        />
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-white font-semibold text-lg">{user?.username}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <div className="flex items-center gap-1 mt-1">
            <Shield size={12} className="text-cyan-400" />
            <span className="text-xs text-cyan-400">Administrator</span>
          </div>
        </div>
      </Card>

      {/* Change password */}
      <form onSubmit={handleSubmit}>
        <Card>
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <Shield size={16} className="text-cyan-400" />
            Ganti Password
          </h3>
          <div className="space-y-4">
            <FormField label="Password Saat Ini">
              <PasswordInput value={form.currentPassword} onChange={set('currentPassword')} placeholder="Password lama" showKey="current" />
            </FormField>
            <FormField label="Password Baru" hint="Minimal 6 karakter">
              <PasswordInput value={form.newPassword} onChange={set('newPassword')} placeholder="Password baru" showKey="new" />
            </FormField>
            <FormField label="Konfirmasi Password Baru">
              <PasswordInput value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Ulangi password baru" showKey="confirm" />
            </FormField>
          </div>
          <div className="flex justify-end mt-5">
            <SaveButton loading={loading} label="Ganti Password" />
          </div>
        </Card>
      </form>
    </div>
  )
}
