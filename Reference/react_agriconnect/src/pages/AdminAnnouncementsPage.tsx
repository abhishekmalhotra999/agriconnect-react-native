import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import adminClient from '../api/adminClient'
import { getApiErrorMessage } from '../api/client'

type Announcement = {
  id: string
  title: string
  message: string
  link?: string | null
  audience: string
  createdAt: string
  recipientCount: number
  readCount: number
}

type AdminProfile = {
  id: number
  name: string
  email: string
}

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'All Users' },
  { value: 'customers', label: 'Customers' },
  { value: 'farmers', label: 'Farmers' },
  { value: 'technicians', label: 'Technicians' },
]

export default function AdminAnnouncementsPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [admin, setAdmin] = useState<AdminProfile | null>(() => {
    const raw = localStorage.getItem('agri_admin_profile')
    return raw ? (JSON.parse(raw) as AdminProfile) : null
  })
  const [loadingFeed, setLoadingFeed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [authenticating, setAuthenticating] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [audience, setAudience] = useState('all')

  const loadFeed = useCallback(async () => {
    setLoadingFeed(true)
    setError('')
    try {
      const res = await adminClient.get<{ announcements: Announcement[] }>('/admin/notifications?page=1')
      setAnnouncements(Array.isArray(res.data?.announcements) ? res.data.announcements : [])
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to load announcements')
      if (/not authenticated|forbidden|auth/i.test(msg)) {
        localStorage.removeItem('agri_admin_token')
        localStorage.removeItem('agri_admin_profile')
        setAdmin(null)
        setAnnouncements([])
        setError('Admin session expired. Please log in again.')
      } else {
        setError(msg)
      }
    } finally {
      setLoadingFeed(false)
    }
  }, [])

  useEffect(() => {
    const existingToken = localStorage.getItem('agri_admin_token')
    if (admin && existingToken) {
      void loadFeed()
    }
  }, [admin, loadFeed])

  const unreadTotal = useMemo(
    () => announcements.reduce((sum, item) => sum + Math.max(0, Number(item.recipientCount || 0) - Number(item.readCount || 0)), 0),
    [announcements],
  )

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthenticating(true)
    setError('')
    setSuccess('')

    try {
      const res = await adminClient.post<{ token: string; admin: AdminProfile; errors?: string[] }>('/admin/login', {
        email,
        password,
      })

      if (!res.data?.token || !res.data?.admin) {
        throw new Error('Invalid admin login response')
      }

      localStorage.setItem('agri_admin_token', res.data.token)
      localStorage.setItem('agri_admin_profile', JSON.stringify(res.data.admin))
      setAdmin(res.data.admin)
      setPassword('')
      setSuccess('Logged in as admin successfully.')
      await loadFeed()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Admin login failed'))
    } finally {
      setAuthenticating(false)
    }
  }

  async function handlePublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await adminClient.post<{ recipientCount: number }>('/admin/notifications', {
        title,
        message,
        link: link.trim() || null,
        audience,
      })

      setSuccess(`Announcement published to ${res.data?.recipientCount || 0} recipients.`)
      setTitle('')
      setMessage('')
      setLink('')
      await loadFeed()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to publish announcement'))
    } finally {
      setSubmitting(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('agri_admin_token')
    localStorage.removeItem('agri_admin_profile')
    setAdmin(null)
    setAnnouncements([])
    setSuccess('Signed out from admin panel.')
  }

  return (
    <div className="container py-4" style={{ maxWidth: 980 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1">Admin Announcements</h2>
          <p className="text-muted mb-0 small">Create in-app notifications for mobile app users.</p>
        </div>
        <Link to="/" className="btn btn-outline-secondary btn-sm">Back to App</Link>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {success ? <div className="alert alert-success">{success}</div> : null}

      {!admin ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Admin Login</h5>
            <form className="row g-3" onSubmit={handleLogin}>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 d-flex justify-content-end">
                <button className="btn btn-primary" disabled={authenticating}>
                  {authenticating ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-muted">Logged in as</div>
                <div className="fw-semibold">{admin.name} ({admin.email})</div>
              </div>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Sign Out</button>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <h5 className="mb-3">Publish Announcement</h5>
              <form className="row g-3" onSubmit={handlePublish}>
                <div className="col-md-8">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Audience</label>
                  <select
                    className="form-select"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  >
                    {AUDIENCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1200}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Optional Deep Link</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. /services or /marketplace/123"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    maxLength={255}
                  />
                </div>
                <div className="col-12 d-flex justify-content-end">
                  <button className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Publishing...' : 'Publish Announcement'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Recent Broadcasts</h5>
                <div className="small text-muted">Unread deliveries: {unreadTotal}</div>
              </div>

              {loadingFeed ? (
                <div className="text-muted">Loading announcements...</div>
              ) : announcements.length === 0 ? (
                <div className="text-muted">No broadcasts yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Audience</th>
                        <th>Recipients</th>
                        <th>Read</th>
                        <th>Sent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {announcements.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="fw-semibold">{item.title}</div>
                            <div className="small text-muted">{item.message}</div>
                          </td>
                          <td className="text-capitalize">{item.audience || 'all'}</td>
                          <td>{item.recipientCount}</td>
                          <td>{item.readCount}</td>
                          <td>{new Date(item.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
