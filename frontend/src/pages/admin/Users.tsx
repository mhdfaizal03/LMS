import { useState, useEffect } from 'react'
import {
  Search, Plus, Trash2, Edit, Loader2, UserCheck, ShieldCheck,
  Mail, Lock, User as UserIcon, Check, X, Ban, Clock, Filter, AlertCircle, Sparkles
} from 'lucide-react'
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
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all')
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  // Add User Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [bio, setBio] = useState('')
  const [expertise, setExpertise] = useState('')
  const [phone, setPhone] = useState('')
  const [creating, setCreating] = useState(false)
  const [addError, setAddError] = useState('')

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState('student')
  const [editStatus, setEditStatus] = useState('active')
  const [editBio, setEditBio] = useState('')
  const [editExpertise, setEditExpertise] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [updating, setUpdating] = useState(false)
  const [editError, setEditError] = useState('')

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getUsers({
        search: search.trim() || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status_filter: statusFilter !== 'all' ? statusFilter : undefined,
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
  }, [search, roleFilter, statusFilter])

  // Count pending instructor applications
  const pendingInstructors = users.filter(u => u.role === 'instructor' && u.status === 'pending')
  const displayedUsers = activeTab === 'pending' ? pendingInstructors : users

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError('')
    if (!name || !email || !password) {
      setAddError('Please fill all required fields.')
      return
    }
    try {
      setCreating(true)
      const newUser = await adminApi.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: role,
        bio: bio.trim() || undefined,
        expertise: expertise.trim() || undefined,
        phone: phone.trim() || undefined,
        status: 'active',
      })
      setUsers(prev => [newUser, ...prev])
      setShowAddModal(false)
      setName('')
      setEmail('')
      setPassword('')
      setBio('')
      setExpertise('')
      setPhone('')
    } catch (err: any) {
      setAddError(err.response?.data?.detail || 'Failed to create user.')
    } finally {
      setCreating(false)
    }
  }

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    setEditName(user.name || '')
    setEditEmail(user.email || '')
    setEditRole(user.role || 'student')
    setEditStatus(user.status || 'active')
    setEditBio(user.bio || '')
    setEditExpertise(user.expertise || '')
    setEditPhone(user.phone || '')
    setEditPassword('')
    setEditError('')
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      setUpdating(true)
      setEditError('')
      const payload: any = {
        name: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        role: editRole,
        status: editStatus,
        bio: editBio.trim() || null,
        expertise: editExpertise.trim() || null,
        phone: editPhone.trim() || null,
      }
      if (editPassword) {
        payload.password = editPassword
      }
      const updated = await adminApi.updateUser(editingUser.id, payload)
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)))
      setEditingUser(null)
    } catch (err: any) {
      setEditError(err.response?.data?.detail || 'Failed to update user.')
    } finally {
      setUpdating(false)
    }
  }

  // 1-Click Approve Instructor
  const handleApprove = async (userId: number) => {
    try {
      setActionLoadingId(userId)
      const updated = await adminApi.approveInstructor(userId)
      setUsers(prev => prev.map(u => (u.id === userId ? updated : u)))
    } catch (err) {
      console.error('Approve error:', err)
      alert('Failed to approve instructor.')
    } finally {
      setActionLoadingId(null)
    }
  }

  // 1-Click Reject Instructor
  const handleReject = async (userId: number) => {
    if (!window.confirm('Reject this instructor application?')) return
    try {
      setActionLoadingId(userId)
      const updated = await adminApi.rejectInstructor(userId)
      setUsers(prev => prev.map(u => (u.id === userId ? updated : u)))
    } catch (err) {
      console.error('Reject error:', err)
      alert('Failed to reject instructor.')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Toggle Suspend / Active status
  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active'
    const confirmText = nextStatus === 'suspended'
      ? `Suspend access for ${user.name}? They will be blocked from logging in.`
      : `Re-activate access for ${user.name}?`
    if (!window.confirm(confirmText)) return

    try {
      setActionLoadingId(user.id)
      const updated = await adminApi.changeUserStatus(user.id, nextStatus)
      setUsers(prev => prev.map(u => (u.id === user.id ? updated : u)))
    } catch (err) {
      console.error('Toggle status error:', err)
      alert('Failed to change user status.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return
    try {
      setActionLoadingId(userId)
      await adminApi.deleteUser(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) {
      console.error('Delete user error:', err)
      alert('Failed to delete user.')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-700 text-slate-900">User & Instructor Management</h2>
          <p className="text-xs text-slate-500">{users.length} live platform accounts registered</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Add New User
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>All Platform Users</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
            {users.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pending'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Instructor Applications</span>
          {pendingInstructors.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold animate-pulse">
              {pendingInstructors.length} New
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap gap-3">
        <div className="flex items-center gap-2 h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or expertise..."
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

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-10 border border-slate-200 rounded-lg px-3 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending Review</option>
          <option value="suspended">Suspended / Blocked</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Fetching users from database...</p>
          </div>
        ) : displayedUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Applicant / User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Expertise & Bio</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Registered</th>
                  <th className="px-5 py-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedUsers.map(u => {
                  const isActionLoading = actionLoadingId === u.id
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} size="sm" />
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{u.name}</p>
                            <p className="text-slate-500 text-xs">{u.email}</p>
                            {u.phone && <p className="text-slate-400 text-[11px]">{u.phone}</p>}
                          </div>
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
                      <td className="px-5 py-3.5 max-w-xs">
                        <p className="font-medium text-slate-800 truncate">{u.expertise || 'General Curriculum'}</p>
                        <p className="text-slate-400 text-[11px] truncate max-w-xs">{u.bio || 'No bio provided'}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={
                            u.status === 'active'
                              ? 'success'
                              : u.status === 'pending'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {u.status === 'pending' ? 'Pending Review' : u.status || 'active'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                        {new Date(u.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click Approve for Pending Instructors */}
                          {u.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                disabled={isActionLoading}
                                onClick={() => handleApprove(u.id)}
                                title="Approve Instructor Application"
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                disabled={isActionLoading}
                                onClick={() => handleReject(u.id)}
                                title="Reject Application"
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1 border border-rose-200 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {/* Suspend / Unsuspend Toggle */}
                          {u.status !== 'pending' && u.role !== 'superadmin' && (
                            <button
                              type="button"
                              disabled={isActionLoading}
                              onClick={() => handleToggleStatus(u)}
                              title={u.status === 'active' ? 'Suspend Account' : 'Re-activate Account'}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                u.status === 'active'
                                  ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              {u.status === 'active' ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                          )}

                          {/* Edit Details */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            title="Edit Full Profile & Roles"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Account */}
                          {u.role !== 'superadmin' && (
                            <button
                              type="button"
                              disabled={isActionLoading}
                              onClick={() => handleDeleteUser(u.id)}
                              title="Delete Account"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <p className="font-semibold text-slate-700">No matching accounts found.</p>
            <p>Try clearing filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal open={Boolean(editingUser)} onClose={() => setEditingUser(null)} title={`Edit Account: ${editingUser.name}`}>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {editError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value)}
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrator</option>
                  {editingUser.role === 'superadmin' && <option value="superadmin">Super Admin</option>}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending Review</option>
                  <option value="suspended">Suspended / Blocked</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Teaching Expertise</label>
              <input
                type="text"
                value={editExpertise}
                onChange={e => setEditExpertise(e.target.value)}
                placeholder="e.g. Full-Stack, React, Python, Machine Learning"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Bio / Application Notes</label>
              <textarea
                rows={3}
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                placeholder="Instructor background and verified qualifications..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Reset Password (Optional)</label>
              <input
                type="password"
                value={editPassword}
                onChange={e => setEditPassword(e.target.value)}
                placeholder="Leave blank to keep existing password"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <Button type="submit" disabled={updating} className="flex-1">
                {updating ? 'Saving in Database...' : 'Save Changes'}
              </Button>
              <Button variant="ghost" type="button" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add User Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Register New Platform User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          {addError && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">{addError}</div>}

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

          <div className="grid grid-cols-2 gap-3">
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
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-100">
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
