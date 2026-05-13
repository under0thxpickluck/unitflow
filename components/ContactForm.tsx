'use client'
import { useState } from 'react'

interface FormState {
  name: string; company: string; country: string; email: string
  ebayUsername: string; desiredParts: string; quantity: string; message: string
}

const INITIAL: FormState = { name: '', company: '', country: '', email: '', ebayUsername: '', desiredParts: '', quantity: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { setStatus('success'); setForm(INITIAL) }
    else {
      const data = await res.json().catch(() => ({}))
      setStatus('error')
      setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
    }
  }

  const inputClass = 'w-full bg-bg-primary border border-white/10 text-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-white/30 placeholder-gray-700'
  const labelClass = 'block text-xs text-gray-500 mb-1'

  if (status === 'success') {
    return (
      <div className="bg-green-950 border border-green-800 rounded p-8 text-center">
        <p className="text-green-400 font-medium mb-2">Message sent successfully.</p>
        <p className="text-gray-400 text-sm">We will respond to your inquiry within 1-2 business days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className={labelClass}>Name *</label><input required value={form.name} onChange={set('name')} placeholder="Your name" className={inputClass} /></div>
        <div><label className={labelClass}>Company</label><input value={form.company} onChange={set('company')} placeholder="Company name" className={inputClass} /></div>
        <div><label className={labelClass}>Country *</label><input required value={form.country} onChange={set('country')} placeholder="e.g. United States" className={inputClass} /></div>
        <div><label className={labelClass}>Email *</label><input required type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" className={inputClass} /></div>
        <div><label className={labelClass}>eBay Username</label><input value={form.ebayUsername} onChange={set('ebayUsername')} placeholder="Optional" className={inputClass} /></div>
        <div><label className={labelClass}>Quantity *</label><input required value={form.quantity} onChange={set('quantity')} placeholder="e.g. 50 units" className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Desired Parts *</label><input required value={form.desiredParts} onChange={set('desiredParts')} placeholder="e.g. Intel Core i5-3470 x50" className={inputClass} /></div>
      <div><label className={labelClass}>Message *</label><textarea required rows={4} value={form.message} onChange={set('message')} placeholder="Tell us about your requirements..." className={inputClass} /></div>
      {status === 'error' && <p className="text-red-400 text-sm">{errorMsg}</p>}
      <button type="submit" disabled={status === 'loading'}
        className="w-full bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50 font-medium py-3 rounded transition-colors">
        {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
      </button>
      <p className="text-gray-600 text-xs text-center">All purchases are completed securely through eBay.</p>
    </form>
  )
}
