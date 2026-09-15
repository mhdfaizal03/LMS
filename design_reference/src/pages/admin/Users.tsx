import { useState } from 'react'
import { Search, Filter, MoreHorizontal, Plus, UserCheck, UserX, Trash2, Edit } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

const users = [
  { id: 1, name: 'Alex Johnson', email: 'alex@student.edu', role: 'student', status: 'active', courses: 4, joined: 'Aug 12, 2024', lastActive: '2h ago' },
  { id: 2, name: 'Priya Sharma', email: 'priya@student.edu', role: 'student', status: 'active', courses: 7, joined: 'Jun 3, 2024', lastActive: 'Yesterday' },
  { id: 3, name: 'Dr. Marcus Reid', email: 'marcus@learnflow.co', role: 'instructor', status: 'active', courses: 5, joined: 'Jan 20, 2023', lastActive: '1h ago' },
  { id: 4, name: 'Sarah Kim', email: 'sarah.kim@learnflow.co', role: 'instructor', status: 'active', courses: 3, joined: 'Mar 8, 2023', lastActive: '3h ago' },
  { id: 5, name: 'Carlos Mendez', email: 'carlos@student.edu', role: 'student', status: 'inactive', courses: 2, joined: 'Sep 1, 2024', lastActive: '2 weeks ago' },
  { id: 6, name: 'Emily Chen', email: 'emily@student.edu', role: 'student', status: 'active', courses: 5, joined: 'Jul 15, 2024', lastActive: 'Today' },
  { id: 7, name: 'James Okafor', email: 'james@student.edu', role: 'student', status: 'active', courses: 3, joined: 'May 22, 2024', lastActive: '5h ago' },
  { id: 8, name: 'Prof. Lin Zhang', email: 'lin@learnflow.co', role: 'instructor', status: 'active', courses: 4, joined: 'Nov 5, 2022', lastActive: 'Yesterday' },
  { id: 9, name: 'Sarah Chen', email: 'sarah@learnflow.co', role: 'admin', status: 'active', courses: 0, joined: 'Jan 1, 2022', lastActive: '30m ago' },
]

const roleColors: Record<string, 'default' | 'success' | 'warning' | 'info' | 'muted' | 'error'> = {
  admin: 'error', instructor: 'info', student: 'muted'
}

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteModal, setDeleteModal] = useState<number | null>(null)
  const [openMenu, setOpenMenu] = useState<number | null>(null)

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">All Users</h2>
          <p className="text-sm text-slate-500">{users.length} total users</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Invite User</Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 flex-1 min-w-40">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="h-9 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Courses</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Active</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><Badge variant={roleColors[user.role]}>{user.role}</Badge></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className={`text-xs font-medium ${user.status === 'active' ? 'text-emerald-700' : 'text-slate-500'}`}>{user.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">{user.courses}</td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs">{user.joined}</td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs">{user.lastActive}</td>
                  <td className="px-4 py-3.5">
                    <div className="relative">
                      <button onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenu === user.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                          <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left">
                            <Edit className="w-3.5 h-3.5" /> Edit user
                          </button>
                          <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left">
                            {user.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <hr className="my-1 border-slate-100" />
                          <button onClick={() => { setDeleteModal(user.id); setOpenMenu(null) }} className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 text-left">
                            <Trash2 className="w-3.5 h-3.5" /> Delete user
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing {filtered.length} of {users.length} users</p>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-7 h-7 rounded-md text-xs font-medium ${p === 1 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <Modal open={deleteModal !== null} onClose={() => setDeleteModal(null)} title="Delete User" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">Are you sure you want to delete this user? This action cannot be undone and will remove all their data, enrollments, and progress.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => setDeleteModal(null)}>Delete User</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
