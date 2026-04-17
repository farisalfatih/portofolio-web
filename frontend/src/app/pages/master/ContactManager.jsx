import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'
import { PageHeader, Card, FormField, Input, SaveButton, Alert, Spinner } from './components'

export function ContactManager() {
  const [form, setForm] = useState({ email: '', phone: '', location: '', whatsapp_url: '', maps_url: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [alert, setAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    api.getContact()
      .then((res) => { if (res.data) setForm(res.data) })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAlert({ type: '', message: '' })
    try {
      await api.updateContact(form)
      setAlert({ type: 'success', message: 'Info kontak berhasil disimpan!' })
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
      <PageHeader title="Info Kontak" description="Edit informasi kontak yang tampil di halaman portfolio." />
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <form onSubmit={handleSubmit}>
        <Card className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <FormField label="Email">
              <Input type="email" value={form.email} onChange={set('email')} placeholder="kamu@email.com" />
            </FormField>
            <FormField label="Nomor Telepon">
              <Input value={form.phone} onChange={set('phone')} placeholder="+62 8xxx xxx xxx" />
            </FormField>
          </div>

          <FormField label="Lokasi">
            <Input value={form.location} onChange={set('location')} placeholder="Kota, Indonesia" />
          </FormField>

          <div className="border-t border-gray-800 pt-5">
            <p className="text-sm font-semibold text-gray-300 mb-4">Link Tambahan</p>
            <div className="grid md:grid-cols-2 gap-5">
              <FormField label="WhatsApp URL" hint="Format: https://wa.me/628xxx">
                <Input value={form.whatsapp_url} onChange={set('whatsapp_url')} placeholder="https://wa.me/628xxx" />
              </FormField>
              <FormField label="Google Maps URL" hint="Link ke lokasi kamu di Google Maps">
                <Input value={form.maps_url} onChange={set('maps_url')} placeholder="https://maps.google.com/..." />
              </FormField>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <SaveButton loading={loading} />
          </div>
        </Card>
      </form>
    </div>
  )
}
