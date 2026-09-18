import React, { useState, useEffect } from 'react'
import {
  Search, Plus, MoreHorizontal, UserX, Trash2, Edit, Download, Shield, UserCheck, Loader2, Ban, Check, X, Clock, AlertCircle
} from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import { TableSkeleton } from '../../components/ui/Skeletons'
import { adminApi } from '../../api'
import { User } from '../../types'

const roleVariant: Record<string, any> = { admin: 'error', superadmin: 'error', instructor: 'info', student: 'muted' }

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all')
  
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [selected, setSelected] = useState<number[]>([])

  // Add User Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [creating, setCreating] = useState(false)
  const [addError, setAddError] = useState('')

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState('student')
  const [editStatus, setEditStatus] = useState('active')
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

  const pendingInstructors = users.filter(u => u.role === 'instructor' && u.status === 'pending')
  const filtered = activeTab === 'pending' ? pendingInstructors : users

  const allSelected = filtered.length > 0 && filtered.every(u => selected.includes(u.id))
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(u => u.id))
  const toggleOne = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError('')
    if (!name || !email || !password) return setAddError('Please fill all required fields.')
    try {
      setCreating(true)
      const newUser = await adminApi.createUser({
        name: name.trim(), email: email.trim().toLowerCase(), password, role, status: 'active',
      })
      setUsers(prev => [newUser, ...prev])
      setShowAddModal(false)
      setName(''); setEmail(''); setPassword('')
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
    setEditPassword('')
    setEditError('')
    setOpenMenu(null)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      setUpdating(true)
      setEditError('')
      const payload: any = { name: editName.trim(), email: editEmail.trim().toLowerCase(), role: editRole, status: editStatus }
      if (editPassword) payload.password = editPassword
      const updated = await adminApi.updateUser(editingUser.id, payload)
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)))
      setEditingUser(null)
    } catch (err: any) {
      setEditError(err.response?.data?.detail || 'Failed to update user.')
    } finally {
      setUpdating(false)
    }
  }

  const handleApprove = async (userId: number) => {
    try {
      setActionLoadingId(userId)
      const updated = await adminApi.approveInstructor(userId)
      setUsers(prev => prev.map(u => (u.id === userId ? updated : u)))
    } catch (err) { alert('Failed to approve instructor.') } finally { setActionLoadingId(null) }
  }

  const handleReject = async (userId: number) => {
    if (!window.confirm('Reject this application?')) return
    try {
      setActionLoadingId(userId)
      const updated = await adminApi.rejectInstructor(userId)
      setUsers(prev => prev.map(u => (u.id === userId ? updated : u)))
    } catch (err) { alert('Failed to reject instructor.') } finally { setActionLoadingId(null) }
  }

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active'
    try {
      setActionLoadingId(user.id)
      const updated = await adminApi.changeUserStatus(user.id, nextStatus)
      setUsers(prev => prev.map(u => (u.id === user.id ? updated : u)))
    } catch (err) { alert('Failed to change status.') } finally { setActionLoadingId(null); setOpenMenu(null) }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return
    try {
      setIsDeleting(true)
      await adminApi.deleteUser(deletingUser.id)
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id))
      setDeletingUser(null)
    } catch (err) {} finally { setIsDeleting(false) }
  }

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">{users.length.toLocaleString()} total users across all roles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
          <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowAddModal(true)}>Invite User</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          All Users
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Pending Applications
          {pendingInstructors.length > 0 && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">{pendingInstructors.length}</span>}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 shadow-sm">
        <div className="flex items-center h-9 gap-2 px-3 bg-slate-50 border border-slate-200 rounded-lg flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <option value="all">All roles</option><option value="admin">Admin</option><option value="instructor">Instructor</option><option value="student">Student</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <option value="all">All status</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option><option value="suspended">Suspended</option>
        </select>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500 font-medium">{selected.length} selected</span>
            <Button size="sm" variant="danger" icon={<Trash2 className="w-3.5 h-3.5" />}>Delete selected</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow">
        {loading ? (
          <TableSkeleton rows={7} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 w-10">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(user => {
                  const isActionLoading = actionLoadingId === user.id
                  return (
                    <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${selected.includes(user.id) ? 'bg-blue-50/60' : ''}`}>
                      <td className="px-5 py-3.5">
                        <input type="checkbox" checked={selected.includes(user.id)} onChange={() => toggleOne(user.id)} className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="sm" />
                          <div>
                            <p className="font-semibold text-slate-900 leading-none">{user.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><Badge variant={roleVariant[user.role] || 'muted'}>{user.role}</Badge></td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : user.status === 'pending' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                          <span className={`text-xs font-semibold ${user.status === 'active' ? 'text-emerald-700' : user.status === 'pending' ? 'text-amber-600' : 'text-slate-400'}`}>{user.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">{new Date(user.created_at || Date.now()).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5">
                        {user.status === 'pending' ? (
                          <div className="flex items-center gap-1">
                            <button disabled={isActionLoading} onClick={() => handleApprove(user.id)} className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100"><Check className="w-4 h-4" /></button>
                            <button disabled={isActionLoading} onClick={() => handleReject(user.id)} className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <div className="relative">
                            <button onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)} className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors">
                              {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
                            </button>
                            {openMenu === user.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20">
                                  <button onClick={() => handleOpenEdit(user)} className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"><Edit className="w-3.5 h-3.5 text-slate-400" /> Edit profile</button>
                                  {user.role !== 'superadmin' && (
                                    <>
                                      <button onClick={() => handleToggleStatus(user)} className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5">
                                        {user.status === 'active' ? <UserX className="w-3.5 h-3.5 text-slate-400" /> : <UserCheck className="w-3.5 h-3.5 text-slate-400" />}
                                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                                      </button>
                                      <hr className="my-1 border-slate-100" />
                                      <button onClick={() => { setDeletingUser(user); setOpenMenu(null) }} className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5"><Trash2 className="w-3.5 h-3.5" /> Delete user</button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <div className="border-t border-slate-100">
                        <EmptyState 
                          icon={UserX}
                          title="No users found"
                          description="We couldn't find any users matching your current filters."
                          actionLabel="Clear Filters"
                          onAction={() => {
                            setSearch('')
                            setRoleFilter('all')
                            setStatusFilter('all')
                            setActiveTab('all')
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination placeholder */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of <span className="font-semibold text-slate-700">{users.length}</span> users</p>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal open={Boolean(editingUser)} onClose={() => setEditingUser(null)} title={`Edit ${editingUser.name}`}>
          <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
            {editError && <div className="p-3 text-xs bg-red-50 text-red-700 rounded-lg">{editError}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-bold block mb-1">Name</label><input required value={editName} onChange={e => setEditName(e.target.value)} className="w-full h-10 border rounded-lg px-3 text-sm" /></div>
              <div><label className="text-xs font-bold block mb-1">Email</label><input required type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full h-10 border rounded-lg px-3 text-sm" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">Role</label>
                <select value={editRole} onChange={e => setEditRole(e.target.value)} className="w-full h-10 border rounded-lg px-3 text-sm"><option value="student">Student</option><option value="instructor">Instructor</option><option value="admin">Admin</option></select>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Status</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="w-full h-10 border rounded-lg px-3 text-sm"><option value="active">Active</option><option value="suspended">Suspended</option></select>
              </div>
            </div>
            <div><label className="text-xs font-bold block mb-1">New Password (optional)</label><input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} className="w-full h-10 border rounded-lg px-3 text-sm" /></div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" type="button" onClick={() => setEditingUser(null)}>Cancel</Button>
              <Button type="submit" disabled={updating}>{updating ? 'Saving...' : 'Save'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add User Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Invite User">
        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
          {addError && <div className="p-3 text-xs bg-red-50 text-red-700 rounded-lg">{addError}</div>}
          <div><label className="text-xs font-bold block mb-1">Name</label><input required value={name} onChange={e => setName(e.target.value)} className="w-full h-10 border rounded-lg px-3 text-sm" /></div>
          <div><label className="text-xs font-bold block mb-1">Email</label><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-10 border rounded-lg px-3 text-sm" /></div>
          <div><label className="text-xs font-bold block mb-1">Password</label><input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-10 border rounded-lg px-3 text-sm" /></div>
          <div>
            <label className="text-xs font-bold block mb-1">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full h-10 border rounded-lg px-3 text-sm"><option value="student">Student</option><option value="instructor">Instructor</option><option value="admin">Admin</option></select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirm */}
      {deletingUser && (
        <ConfirmDialog
          isOpen={!!deletingUser} onClose={() => setDeletingUser(null)} onConfirm={handleDeleteConfirm}
          title="Delete User"
          message={`Are you sure you want to permanently delete ${deletingUser.name}?`}
          confirmText="Delete" isDestructive isLoading={isDeleting}
        />
      )}
    </div>
  )
}
