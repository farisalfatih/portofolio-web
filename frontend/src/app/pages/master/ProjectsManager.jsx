import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, X, Database, Globe, Layers, Star } from 'lucide-react'
import { api } from '../../../lib/api'
import { PageHeader, Alert, Spinner, ConfirmModal, Badge, Card, FormField, Input, Textarea, SaveButton } from './components'

const TYPE_OPTIONS = [
  { value: 'web', label: 'Web Development', icon: Globe },
  { value: 'data', label: 'Data Engineering', icon: Database },
  { value: 'fullstack', label: 'Fullstack', icon: Layers },
]

const emptyForm = { name: '', type: 'web', description: '', tech_stack: '', category: '', github_url: '', demo_url: '', is_featured: false, sort_order: 0 }

export function ProjectsManager() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' })
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.getProjects().then((res) => setProjects(res.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const showAlert = (type, message) => setAlert({ type, message })

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true) }
  const openEdit = (p) => {
    setForm({ ...p, tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : '' })
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
        tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
        sort_order: Number(form.sort_order) || 0,
      }
      if (editId) {
        await api.updateProject(editId, payload)
        showAlert('success', 'Proyek berhasil diperbarui!')
      } else {
        await api.createProject(payload)
        showAlert('success', 'Proyek berhasil ditambahkan!')
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
      await api.deleteProject(deleteModal.id)
      showAlert('success', 'Proyek dihapus.')
      load()
    } catch (err) { showAlert('error', err.message) }
    setDeleteModal({ open: false, id: null, name: '' })
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const typeColors = { web: 'cyan', data: 'orange', fullstack: 'green' }

  if (loading) return <div className="p-8"><Spinner /></div>

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Kelola Proyek" description="Tambah dan edit proyek di portfolio kamu." />
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
        >
          <Plus size={16} /> Tambah Proyek
        </button>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-white font-bold text-lg">{editId ? 'Edit Proyek' : 'Tambah Proyek Baru'}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField label="Nama Proyek *">
                  <Input value={form.name} onChange={set('name')} placeholder="E-Commerce Dashboard" required />
                </FormField>
                <FormField label="Tipe">
                  <select value={form.type} onChange={set('type')} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500">
                    {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </FormField>
              </div>

              <FormField label="Deskripsi">
                <Textarea rows={3} value={form.description} onChange={set('description')} placeholder="Deskripsi singkat tentang proyek ini..." />
              </FormField>

              <FormField label="Tech Stack" hint="Pisahkan dengan koma: React, Node.js, PostgreSQL">
                <Input value={form.tech_stack} onChange={set('tech_stack')} placeholder="React, Node.js, PostgreSQL" />
              </FormField>

              <FormField label="Kategori (label tampil di card)">
                <Input value={form.category} onChange={set('category')} placeholder="Fullstack / Web Development / Data Engineering" />
              </FormField>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField label="GitHub URL">
                  <Input value={form.github_url} onChange={set('github_url')} placeholder="https://github.com/..." />
                </FormField>
                <FormField label="Demo URL">
                  <Input value={form.demo_url} onChange={set('demo_url')} placeholder="https://..." />
                </FormField>
              </div>

              <div className="flex items-center gap-6">
                <FormField label="Urutan Tampil">
                  <Input type="number" value={form.sort_order} onChange={set('sort_order')} className="w-24" />
                </FormField>
                <label className="flex items-center gap-2 cursor-pointer mt-5">
                  <input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} className="w-4 h-4 accent-cyan-500" />
                  <span className="text-sm text-gray-300">Featured project</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeForm} className="px-4 py-2.5 text-sm text-gray-400 bg-gray-800 rounded-lg hover:text-white transition-colors">Batal</button>
                <SaveButton loading={saving} label={editId ? 'Simpan Perubahan' : 'Tambah Proyek'} />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Card key={p.id} className="flex flex-col gap-3 hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-white font-semibold truncate">{p.name}</h3>
                  {p.is_featured && <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge color={typeColors[p.type] || 'gray'}>{p.type}</Badge>
                  {p.category && <Badge color="gray">{p.category}</Badge>}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-gray-800 rounded-lg transition-colors"><Pencil size={15} /></button>
                <button onClick={() => setDeleteModal({ open: true, id: p.id, name: p.name })} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{p.description}</p>

            {p.tech_stack?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {p.tech_stack.slice(0, 4).map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded font-mono">{t}</span>
                ))}
                {p.tech_stack.length > 4 && <span className="text-gray-600 text-xs">+{p.tech_stack.length - 4}</span>}
              </div>
            )}
          </Card>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-500">
          <p>Belum ada proyek. Klik "Tambah Proyek" untuk mulai.</p>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Hapus Proyek?"
        message={`Proyek "${deleteModal.name}" akan dihapus permanen.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, name: '' })}
      />
    </div>
  )
}
