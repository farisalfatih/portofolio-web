import { useState, useEffect, useRef } from 'react'
import { api } from '../../../lib/api'
import { uploadToCloudinary, validateImage, validateCV } from '../../../lib/cloudinary'
import { PageHeader, Card, FormField, Input, SaveButton, Alert, Spinner } from './components'
import { Upload, Link2, FileText, Image, Loader2, CheckCircle } from 'lucide-react'

// ── Komponen Upload Foto Profil ──────────────────────────────────────────────
function ProfileImageUpload({ currentUrl, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState(currentUrl || '')
  const [alert, setAlert] = useState({ type: '', message: '' })
  const inputRef = useRef()

  // Sinkronkan preview jika currentUrl berubah dari luar
  useEffect(() => { setPreview(currentUrl || '') }, [currentUrl])

  const handleFile = async (file) => {
    setAlert({ type: '', message: '' })
    try {
      validateImage(file)
      setPreview(URL.createObjectURL(file))
      setUploading(true)
      setProgress(0)
      const { url } = await uploadToCloudinary(file, 'image', setProgress)
      onUploadSuccess(url)
      setPreview(url)
      setAlert({ type: 'success', message: 'Foto profil berhasil diupload!' })
    } catch (err) {
      setAlert({ type: 'error', message: err.message })
      setPreview(currentUrl || '')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      {alert.message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-3 ${
          alert.type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {alert.type === 'success' ? <CheckCircle size={14} /> : null}
          <span>{alert.message}</span>
        </div>
      )}

      <div className="flex items-center gap-6">
        {/* Preview */}
        <div className="flex-shrink-0">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-700 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center">
              <Image size={28} className="text-gray-600" />
            </div>
          )}
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex-1 border-2 border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-cyan-500/60 transition-colors cursor-pointer"
          onClick={() => !uploading && inputRef.current?.click()}
        >
          {uploading ? (
            <div className="space-y-2">
              <Loader2 size={24} className="animate-spin text-cyan-500 mx-auto" />
              <p className="text-sm text-gray-400">Mengupload... {progress}%</p>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Upload size={20} className="text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">
                <span className="text-cyan-400 font-medium">Klik atau drag & drop</span> foto profil
              </p>
              <p className="text-xs text-gray-600 mt-1">JPG, PNG, WebP — Maks. 5MB</p>
            </>
          )}
        </div>
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

// ── Komponen Upload CV ────────────────────────────────────────────────────────
function CVUpload({ currentUrl, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [alert, setAlert] = useState({ type: '', message: '' })
  const inputRef = useRef()

  const handleFile = async (file) => {
    setAlert({ type: '', message: '' })
    try {
      validateCV(file)
      setUploading(true)
      setProgress(0)
      const { url } = await uploadToCloudinary(file, 'raw', setProgress)
      onUploadSuccess(url)
      setAlert({ type: 'success', message: 'CV berhasil diupload! URL sudah otomatis terisi.' })
    } catch (err) {
      setAlert({ type: 'error', message: err.message })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-2">
      {alert.message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
          alert.type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {alert.type === 'success' ? <CheckCircle size={14} /> : null}
          <span>{alert.message}</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-sm hover:border-cyan-500 hover:text-cyan-400 transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {progress}%
            </>
          ) : (
            <>
              <FileText size={14} />
              Upload CV (PDF)
            </>
          )}
        </button>

        {currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
          >
            <Link2 size={12} />
            Lihat CV
          </a>
        )}
      </div>

      {uploading && (
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
      />
    </div>
  )
}

// ── Komponen Utama HeroManager ────────────────────────────────────────────────
export function HeroManager() {
  const [form, setForm] = useState({
    name: '', tagline: '', quote: '',
    github_url: '', linkedin_url: '', instagram_url: '',
    cv_url: '', profile_image_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [alert, setAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    api.getHero()
      .then((res) => { if (res.data) setForm({ ...form, ...res.data }) })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAlert({ type: '', message: '' })
    try {
      await api.updateHero(form)
      setAlert({ type: 'success', message: 'Data hero berhasil disimpan!' })
    } catch (err) {
      setAlert({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  if (fetching) return <div className="p-8"><Spinner /></div>

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Hero & Profil" description="Edit informasi utama yang tampil di bagian atas portfolio." />
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">

          {/* Foto Profil */}
          <Card>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Image size={16} className="text-cyan-400" />
              Foto Profil
            </h3>
            <ProfileImageUpload
              currentUrl={form.profile_image_url}
              onUploadSuccess={(url) => setForm((f) => ({ ...f, profile_image_url: url }))}
            />
            <p className="text-xs text-gray-600 mt-3">
              URL: <span className="text-gray-500 break-all">{form.profile_image_url || '(belum ada)'}</span>
            </p>
          </Card>

          {/* Info Dasar */}
          <Card className="space-y-5">
            <FormField label="Nama Lengkap">
              <Input value={form.name} onChange={set('name')} placeholder="Mohammad Faris Al Fatih" required />
            </FormField>
            <FormField label="Tagline / Jabatan">
              <Input value={form.tagline} onChange={set('tagline')} placeholder="Web Developer & Aspiring Data Engineer" />
            </FormField>
            <FormField label="Quote / Motto" hint="Teks kecil di bawah tagline">
              <Input value={form.quote} onChange={set('quote')} placeholder='"Membangun web, memahami data"' />
            </FormField>
          </Card>

          {/* Link & CV */}
          <Card>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Link2 size={16} className="text-cyan-400" />
              Link & CV
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="GitHub URL">
                <Input value={form.github_url} onChange={set('github_url')} placeholder="https://github.com/username" />
              </FormField>
              <FormField label="LinkedIn URL">
                <Input value={form.linkedin_url} onChange={set('linkedin_url')} placeholder="https://linkedin.com/in/username" />
              </FormField>
              <FormField label="Instagram URL">
                <Input value={form.instagram_url} onChange={set('instagram_url')} placeholder="https://instagram.com/username" />
              </FormField>
              <FormField label="URL Download CV" hint="Upload CV PDF atau paste URL manual">
                <CVUpload
                  currentUrl={form.cv_url}
                  onUploadSuccess={(url) => setForm((f) => ({ ...f, cv_url: url }))}
                />
                <Input
                  value={form.cv_url}
                  onChange={set('cv_url')}
                  placeholder="https://res.cloudinary.com/... atau /assets/file/cv.pdf"
                  className="mt-2"
                />
              </FormField>
            </div>
          </Card>

          <div className="flex justify-end">
            <SaveButton loading={loading} />
          </div>
        </div>
      </form>
    </div>
  )
}
