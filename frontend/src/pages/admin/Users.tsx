import { useState, useEffect } from 'react'
import { Search, Plus, Trash2, Edit, Loader2, UserCheck, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { adminApi } from '../../api'
import { User } from '../../types'

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  // Add User Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getUsers({
        search: search.trim() || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
      })
      setUsers(data || [])
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadUsers, 200)
    return () => clearTimeout(timer)
  }, [search, roleFilter])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) {
      setError('Please fill all required fields.')
      return
    }
    try {
      setCreating(true)
      const newUser = await adminApi.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: role,
        status: 'active',
      })
      setUsers(prev => [newUser, ...prev])
      setShowAddModal(false)
      setName('')
      setEmail('')
      setPassword('')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create user.')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await adminApi.deleteUser(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) {
      console.error('Delete user error:', err)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-display font-700 text-slate-900">User Management</h2>
          <p className="text-sm text-slate-500">{users.length} live platform accounts registered</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap gap-3">
        <div className="flex items-center gap-2 h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email address..."
            className="bg-transparent text-xs text-slate-900 outline-none flex-1 placeholder:text-slate-400"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="h-10 border border-slate-200 rounded-lg px-3 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="superadmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Fetching users from database...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{u.name}</p>
                        <p className="text-slate-500 text-xs">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant={
                          u.role === 'admin' || u.role === 'superadmin'
                            ? 'default'
                            : u.role === 'instructor'
                            ? 'warning'
                            : 'muted'
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={u.status === 'active' ? 'success' : 'danger'}>{u.status || 'active'}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(u.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-slate-500 text-xs">
            No users found. Try searching or create a new user.
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Register New Platform User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Johnathan Davis"
              className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. user@domain.com"
              className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Temporary Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">User Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="flex gap-2 pt-3">
            <Button type="submit" disabled={creating} className="flex-1">
              {creating ? 'Creating in Database...' : 'Create Account'}
            </Button>
            <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
