'use client'
// app/user/new-membership/page.tsx
import { useState } from 'react'

export default function NewMembershipPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    dateOfBirth: '', address: '', idType: 'National ID',
    idNumber: '', membershipType: 'STANDARD',
  })
  const [loading, setLoading] = useState(false)
  const [toast,   setToast]   = useState('')

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res  = await fetch('/api/members/application', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setLoading(false)
    setToast(data.success ? 'Application submitted! Staff will review shortly.' : (data.error || 'Failed.'))
    setTimeout(() => setToast(''), 4000)
  }

  const steps = [
    'Complete and submit this application form online or in person.',
    'Staff review your details and verify your ID document.',
    'Account is created and your membership card is prepared.',
    'You\'ll receive an email confirmation within 2 business days.',
    'Collect your card at the front desk to activate borrowing.',
  ]
  const benefits = ['Borrow up to 5 books at once','21-day loan period per book','Access to digital resources','Reserve books in advance','Interlibrary loan requests']

  return (
    <div className="max-w-4xl space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-teal-700 text-white px-4 py-3 rounded-xl shadow-lg text-sm">{toast}</div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Membership Application</h1>
        <p className="text-gray-500 text-sm mt-0.5">Fill in your details — staff will review and create your account</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="flex gap-2 p-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-xs mb-5">
              🛡 Membership is staff-approved to ensure proper verification and controlled access to library resources.
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name *</label>
                  <input className="input" placeholder="First name" required value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input className="input" placeholder="Last name" required value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="label">Email Address *</label>
                <input type="email" className="input" placeholder="your@email.com" required value={form.email} onChange={e => set('email', e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div>
                  <label className="label">Date of Birth *</label>
                  <input type="date" className="input" required value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="label">Address</label>
                <textarea className="input h-16 resize-none" placeholder="Street, City, Postcode…" value={form.address} onChange={e => set('address', e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">ID Type</label>
                  <select className="input" value={form.idType} onChange={e => set('idType', e.target.value)}>
                    {['National ID','Passport','Driver\'s License','Student ID'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">ID Number *</label>
                  <input className="input" placeholder="ID number" required value={form.idNumber} onChange={e => set('idNumber', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="label">Membership Type</label>
                <select className="input" value={form.membershipType} onChange={e => set('membershipType', e.target.value)}>
                  {[['STANDARD','Standard (Free)'],['STUDENT','Student'],['FACULTY','Faculty / Educator'],['PREMIUM','Premium']].map(([v,l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 justify-center">
                {loading ? 'Submitting…' : '👤 Submit Application'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Approval process</h3>
            <ol className="space-y-2">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center shrink-0 text-[10px]">{i+1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Membership benefits</h3>
            <ul className="space-y-1.5">
              {benefits.map(b => (
                <li key={b} className="flex gap-2 text-xs text-gray-600">
                  <span className="text-teal-500">✓</span>{b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

