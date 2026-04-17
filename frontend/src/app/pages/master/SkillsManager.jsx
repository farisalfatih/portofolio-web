import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, X, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { api } from '../../../lib/api'
import { PageHeader, Alert, Spinner, ConfirmModal, Badge, Input, SaveButton } from './components'

const COLOR_OPTIONS = [
  { from: 'from-cyan-400', to: 'to-cyan-600', label: 'Cyan' },
  { from: 'from-blue-400', to: 'to-blue-600', label: 'Blue' },
  { from: 'from-purple-400', to: 'to-purple-600', label: 'Purple' },
  { from: 'from-orange-400', to: 'to-orange-600', label: 'Orange' },
  { from: 'from-green-400', to: 'to-green-600', label: 'Green' },
  { from: 'from-pink-400', to: 'to-pink-600', label: 'Pink' },
]

export function SkillsManager() {
  const [categories, setCategories] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null, name: '' })
  const [expandedCat, setExpandedCat] = useState(null)

  // Forms
  const [newCat, setNewCat] = useState({ name: '', color_from: 'from-cyan-400', color_to: 'to-cyan-600' })
  const [editCat, setEditCat] = useState(null)
  const [newSkill, setNewSkill] = useState({})
  const [editSkill, setEditSkill] = useState(null)

  const load = () => {
    setLoading(true)
    api.getSkillsRaw()
      .then((res) => { setCategories(res.categories); setSkills(res.skills) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const showAlert = (type, message) => setAlert({ type, message })

  const addCategory = async (e) => {
    e.preventDefault()
    try {
      await api.createCategory(newCat)
      setNewCat({ name: '', color_from: 'from-cyan-400', color_to: 'to-cyan-600' })
      showAlert('success', 'Kategori ditambahkan!')
      load()
    } catch (err) { showAlert('error', err.message) }
  }

  const saveEditCat = async () => {
    try {
      await api.updateCategory(editCat.id, editCat)
      setEditCat(null)
      showAlert('success', 'Kategori diperbarui!')
      load()
    } catch (err) { showAlert('error', err.message) }
  }

  const addSkill = async (categoryId) => {
    const name = newSkill[categoryId]?.trim()
    if (!name) return
    try {
      await api.createSkill({ category_id: categoryId, name })
      setNewSkill({ ...newSkill, [categoryId]: '' })
      showAlert('success', 'Skill ditambahkan!')
      load()
    } catch (err) { showAlert('error', err.message) }
  }

  const saveEditSkill = async () => {
    try {
      await api.updateSkill(editSkill.id, editSkill)
      setEditSkill(null)
      showAlert('success', 'Skill diperbarui!')
      load()
    } catch (err) { showAlert('error', err.message) }
  }

  const handleDelete = async () => {
    const { type, id } = deleteModal
    try {
      if (type === 'category') await api.deleteCategory(id)
      else await api.deleteSkill(id)
      showAlert('success', `${type === 'category' ? 'Kategori' : 'Skill'} dihapus.`)
      load()
    } catch (err) { showAlert('error', err.message) }
    setDeleteModal({ open: false, type: '', id: null, name: '' })
  }

  if (loading) return <div className="p-8"><Spinner /></div>

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Kelola Keahlian" description="Tambah, edit, atau hapus kategori dan skill." />
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {/* Add category form */}
      <form onSubmit={addCategory} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <p className="text-sm font-semibold text-gray-300 mb-3">Tambah Kategori Baru</p>
        <div className="flex flex-wrap gap-3">
          <Input
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            placeholder="Nama kategori..."
            required
            className="flex-1 min-w-40"
          />
          <select
            value={`${newCat.color_from}|${newCat.color_to}`}
            onChange={(e) => {
              const [from, to] = e.target.value.split('|')
              setNewCat({ ...newCat, color_from: from, color_to: to })
            }}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500"
          >
            {COLOR_OPTIONS.map((c) => (
              <option key={c.label} value={`${c.from}|${c.to}`}>{c.label}</option>
            ))}
          </select>
          <button type="submit" className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </form>

      {/* Categories list */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catSkills = skills.filter((s) => s.category_id === cat.id)
          const isExpanded = expandedCat === cat.id

          return (
            <div key={cat.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {/* Category header */}
              <div className="flex items-center gap-3 p-4">
                <div className={`w-1 h-8 bg-gradient-to-b ${cat.color_from} ${cat.color_to} rounded-full flex-shrink-0`} />

                {editCat?.id === cat.id ? (
                  <div className="flex flex-1 items-center gap-2 flex-wrap">
                    <Input
                      value={editCat.name}
                      onChange={(e) => setEditCat({ ...editCat, name: e.target.value })}
                      className="flex-1 min-w-32"
                    />
                    <select
                      value={`${editCat.color_from}|${editCat.color_to}`}
                      onChange={(e) => {
                        const [from, to] = e.target.value.split('|')
                        setEditCat({ ...editCat, color_from: from, color_to: to })
                      }}
                      className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
                    >
                      {COLOR_OPTIONS.map((c) => (
                        <option key={c.label} value={`${c.from}|${c.to}`}>{c.label}</option>
                      ))}
                    </select>
                    <button onClick={saveEditCat} className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg"><Check size={16} /></button>
                    <button onClick={() => setEditCat(null)} className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg"><X size={16} /></button>
                  </div>
                ) : (
                  <>
                    <span className="text-white font-medium flex-1">{cat.name}</span>
                    <Badge color="cyan">{catSkills.length} skill</Badge>
                    <button onClick={() => setEditCat({ ...cat })} className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-800 rounded-lg transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteModal({ open: true, type: 'category', id: cat.id, name: cat.name })} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    <button onClick={() => setExpandedCat(isExpanded ? null : cat.id)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </>
                )}
              </div>

              {/* Skills list */}
              {isExpanded && (
                <div className="border-t border-gray-800 p-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {catSkills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-1 bg-gray-800 rounded-lg px-2 py-1 group">
                        {editSkill?.id === skill.id ? (
                          <>
                            <input
                              value={editSkill.name}
                              onChange={(e) => setEditSkill({ ...editSkill, name: e.target.value })}
                              className="bg-transparent text-white text-sm outline-none w-24"
                              onKeyDown={(e) => { if (e.key === 'Enter') saveEditSkill(); if (e.key === 'Escape') setEditSkill(null) }}
                              autoFocus
                            />
                            <button onClick={saveEditSkill} className="text-green-400"><Check size={12} /></button>
                            <button onClick={() => setEditSkill(null)} className="text-gray-400"><X size={12} /></button>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-300 text-sm">{skill.name}</span>
                            <button onClick={() => setEditSkill({ ...skill })} className="text-gray-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all ml-1"><Pencil size={11} /></button>
                            <button onClick={() => setDeleteModal({ open: true, type: 'skill', id: skill.id, name: skill.name })} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><X size={11} /></button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add skill */}
                  <div className="flex gap-2">
                    <Input
                      value={newSkill[cat.id] || ''}
                      onChange={(e) => setNewSkill({ ...newSkill, [cat.id]: e.target.value })}
                      placeholder="Tambah skill baru..."
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(cat.id) } }}
                      className="flex-1"
                    />
                    <button
                      onClick={() => addSkill(cat.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-cyan-500 text-white rounded-lg text-sm transition-colors"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">Belum ada kategori. Tambahkan yang pertama!</div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        title={`Hapus ${deleteModal.type === 'category' ? 'Kategori' : 'Skill'}?`}
        message={`"${deleteModal.name}" akan dihapus permanen.${deleteModal.type === 'category' ? ' Semua skill di kategori ini juga akan terhapus.' : ''}`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, type: '', id: null, name: '' })}
      />
    </div>
  )
}
