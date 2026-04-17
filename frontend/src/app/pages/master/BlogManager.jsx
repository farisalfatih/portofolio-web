import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, X, Eye, EyeOff } from 'lucide-react'
import { api } from '../../../lib/api'
import { PageHeader, Alert, Spinner, ConfirmModal, Badge, Card, FormField, Input, Textarea, SaveButton } from './components'

const emptyForm = { title: '', excerpt: '', content: '', cover_image: '', tags: '', is_published: false }

export function BlogManager() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' })
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.getBlogPostsAll().then((res) => setPosts(res.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const showAlert = (type, message) => setAlert({ type, message })

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true) }
  const openEdit = (p) => {
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : '' })
    setEditId(p.id)
    setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditId(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }
      if (editId) {
        await api.updateBlogPost(editId, payload)
        showAlert('success', 'Artikel berhasil diperbarui!')
      } else {
        await api.createBlogPost(payload)
        showAlert('success', 'Artikel berhasil ditambahkan!')
      }
      closeForm()
      load()
    } catch (err) {
      showAlert('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.deleteBlogPost(deleteModal.id)
      showAlert('success', 'Artikel dihapus.')
      load()
    } catch (err) { showAlert('error', err.message) }
    setDeleteModal({ open: false, id: null, name: '' })
  }

  const togglePublish = async (post) => {
    try {
      const tags = Array.isArray(post.tags) ? post.tags : []
      await api.updateBlogPost(post.id, { ...post, tags, is_published: !post.is_published })
      showAlert('success', post.is_published ? 'Artikel dijadikan draft.' : 'Artikel dipublikasikan!')
      load()
    } catch (err) { showAlert('error', err.message) }
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

  if (loading) return <div className="p-8"><Spinner /></div>

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Kelola Blog" description="Tulis dan kelola artikel blog kamu." />
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
        >
          <Plus size={16} /> Tulis Artikel
        </button>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-white font-bold text-lg">{editId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FormField label="Judul Artikel *">
                <Input value={form.title} onChange={set('title')} placeholder="Judul artikel yang menarik..." required />
              </FormField>

              <FormField label="Excerpt / Ringkasan" hint="Teks pendek yang muncul di daftar artikel">
                <Textarea rows={2} value={form.excerpt} onChange={set('excerpt')} placeholder="Ringkasan singkat..." />
              </FormField>

              <FormField label="Konten Artikel">
                <Textarea rows={10} value={form.content} onChange={set('content')} placeholder="Tulis konten artikel di sini..." />
              </FormField>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField label="URL Cover Image" hint="Link gambar sampul artikel">
                  <Input value={form.cover_image} onChange={set('cover_image')} placeholder="https://..." />
                </FormField>
                <FormField label="Tags" hint="Pisahkan dengan koma">
                  <Input value={form.tags} onChange={set('tags')} placeholder="React, Node.js, Tutorial" />
                </FormField>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={set('is_published')} className="w-4 h-4 accent-cyan-500" />
                <span className="text-sm text-gray-300">Publikasikan sekarang</span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeForm} className="px-4 py-2.5 text-sm text-gray-400 bg-gray-800 rounded-lg hover:text-white transition-colors">Batal</button>
                <SaveButton loading={saving} label={editId ? 'Simpan Perubahan' : 'Simpan Artikel'} />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex items-start gap-4 hover:border-gray-700 transition-colors">
            {post.cover_image && (
              <img src={post.cover_image} alt={post.title} className="w-20 h-14 object-cover rounded-lg flex-shrink-0 bg-gray-800" onError={(e) => { e.target.style.display = 'none' }} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white font-semibold truncate">{post.title}</h3>
                    <Badge color={post.is_published ? 'green' : 'gray'}>{post.is_published ? 'Published' : 'Draft'}</Badge>
                  </div>
                  <p className="text-gray-400 text-xs mb-2 line-clamp-1">{post.excerpt}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-600 text-xs">{formatDate(post.published_at || post.created_at)}</span>
                    {Array.isArray(post.tags) && post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-cyan-400 font-mono">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => togglePublish(post)}
                    title={post.is_published ? 'Jadikan draft' : 'Publikasikan'}
                    className={`p-1.5 rounded-lg transition-colors ${post.is_published ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-400 hover:text-green-400 hover:bg-gray-800'}`}
                  >
                    {post.is_published ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => openEdit(post)} className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-gray-800 rounded-lg transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteModal({ open: true, id: post.id, name: post.title })} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p>Belum ada artikel. Klik "Tulis Artikel" untuk mulai.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Hapus Artikel?"
        message={`Artikel "${deleteModal.name}" akan dihapus permanen.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, name: '' })}
      />
    </div>
  )
}
