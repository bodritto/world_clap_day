'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  email: string
  name: string | null
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  const [clapperCount, setClapperCount] = useState<number | null>(null)
  const [fixedCount, setFixedCount] = useState<number | null>(null)
  const [newCount, setNewCount] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/clappers')
      if (res.ok) {
        const data = await res.json()
        setClapperCount(data.count)
        setFixedCount(data.fixedCount ?? data.count)
        setNewCount(String(data.count))
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me')
        const data = await res.json()
        if (!data.user) {
          router.replace('/admin/login')
          return
        }
        setUser(data.user)
        setLoading(false)
        fetchCount()
      } catch {
        router.replace('/admin/login')
      }
    }
    checkAuth()
  }, [router, fetchCount])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  async function handleSave() {
    const parsed = parseInt(newCount, 10)
    if (isNaN(parsed) || parsed < 0) {
      setSaveMsg({ type: 'err', text: 'Enter a valid non-negative number' })
      return
    }

    setSaving(true)
    setSaveMsg(null)

    try {
      const res = await fetch('/api/admin/clappers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: parsed }),
      })

      if (!res.ok) {
        const data = await res.json()
        setSaveMsg({ type: 'err', text: data.error || 'Save failed' })
        return
      }

      const data = await res.json()
      setClapperCount(data.count)
      setFixedCount(data.fixedCount ?? data.count)
      setNewCount(String(data.count))
      setSaveMsg({ type: 'ok', text: 'Saved!' })
      setTimeout(() => setSaveMsg(null), 3000)
    } catch {
      setSaveMsg({ type: 'err', text: 'Network error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-gray-900">WCD Admin</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Clapper Count Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Clapper Count</h2>
          <p className="text-sm text-gray-500 mb-6">
            This number is displayed on the homepage as the supporter count.
          </p>

          {clapperCount !== null ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-500">Current (live):</span>
                  <span className="text-3xl font-bold tabular-nums text-gray-900">
                    {clapperCount.toLocaleString()}
                  </span>
                </div>
                {fixedCount !== null && fixedCount !== clapperCount && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-500">Fixed (manual baseline):</span>
                    <span className="text-lg tabular-nums text-gray-600">
                      {fixedCount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="newCount" className="block text-sm font-medium text-gray-700 mb-1">
                  New value
                </label>
                <div className="flex gap-2">
                  <input
                    id="newCount"
                    type="number"
                    min={0}
                    value={newCount}
                    onChange={(e) => setNewCount(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tabular-nums"
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>

              {saveMsg && (
                <p
                  className={`text-sm px-3 py-2 rounded-lg ${
                    saveMsg.type === 'ok'
                      ? 'text-green-700 bg-green-50'
                      : 'text-red-600 bg-red-50'
                  }`}
                >
                  {saveMsg.text}
                </p>
              )}
            </div>
          ) : (
            <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
          )}
        </div>
      </main>
    </div>
  )
}
