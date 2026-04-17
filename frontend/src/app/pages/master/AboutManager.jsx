import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'
import { PageHeader, Card, FormField, Textarea, SaveButton, Alert, Spinner } from './components'

export function AboutManager() {
  const [form, setForm] = useState({ bio_paragraph1: '', bio_paragraph2: '', bio_paragraph3: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [alert, setAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    api.getAbout()
      .then((res) => { if (res.data) setForm(res.data) })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAlert({ type: '', message: '' })
    try {
      await api.updateAbout(form)
      setAlert({ type: 'success', message: 'Teks "Tentang Saya" berhasil disimpan!' })
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
      <PageHeader title="Tentang Saya" description="Edit teks biografi di bagian About." />
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <form onSubmit={handleSubmit}>
        <Card className="space-y-5">
          <FormField label="Paragraf 1" hint="Perkenalan diri">
            <Textarea rows={4} value={form.bio_paragraph1} onChange={set('bio_paragraph1')} placeholder="Halo! Saya ..." />
          </FormField>
          <FormField label="Paragraf 2" hint="Background & keahlian">
            <Textarea rows={4} value={form.bio_paragraph2} onChange={set('bio_paragraph2')} placeholder="Dengan latar belakang ..." />
          </FormField>
          <FormField label="Paragraf 3" hint="Filosofi & motivasi">
            <Textarea rows={4} value={form.bio_paragraph3} onChange={set('bio_paragraph3')} placeholder="Saya senang bekerja ..." />
          </FormField>
          <div className="flex justify-end pt-2">
            <SaveButton loading={loading} />
          </div>
        </Card>
      </form>
    </div>
  )
}
