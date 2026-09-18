import { useState } from 'react'
import { Search, Plus, MoreHorizontal, UserX, Trash2, Edit, Download, Shield, UserCheck } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

const users = [
  { id: 1, name: 'Alex Johnson',    email: 'alex@student.edu',           role: 'student',    status: 'active',   courses: 4, joined: 'Aug 12, 2024', lastActive: '2 hrs ago' },
  { id: 2, name: 'Priya Sharma',    email: 'priya@student.edu',          role: 'student',    status: 'active',   courses: 7, joined: 'Jun 3, 2024',  lastActive: 'Yesterday' },
  { id: 3, name: 'Dr. Marcus Reid', email: 'marcus@learnflow.co',        role: 'instructor', status: 'active',   courses: 5, joined: 'Jan 20, 2023', lastActive: '1 hr ago' },
  { id: 4, name: 'Sarah Kim',       email: 'sarah.kim@learnflow.co',     role: 'instructor', status: 'active',   courses: 3, joined: 'Mar 8, 2023',  lastActive: '3 hrs ago' },
  { id: 5, name: 'Carlos Mendez',   email: 'carlos@student.edu',         role: 'student',    status: 'inactive', courses: 2, joined: 'Sep 1, 2024',  lastActive: '2 wks ago' },
  { id: 6, name: 'Emily Chen',      email: 'emily@student.edu',          role: 'student',    status: 'active',   courses: 5, joined: 'Jul 15, 2024', lastActive: 'Today' },
  { id: 7, name: 'James Okafor',    email: 'james@student.edu',          role: 'student',    status: 'active',   courses: 3, joined: 'May 22, 2024', lastActive: '5 hrs ago' },
  { id: 8, name: 'Prof. Lin Zhang', email: 'lin@learnflow.co',           role: 'instructor', status: 'active',   courses: 4, joined: 'Nov 5, 2022',  lastActive: 'Yesterday' },
  { id: 9, name: 'Sarah Chen',      email: 'sarah@learnflow.co',         role: 'admin',      status: 'active',   courses: 0, joined: 'Jan 1, 2022',  lastActive: '20 min ago' },
  { id: 10, name: 'Sofia Martinez', email: 'sofia@student.edu',          role: 'student',    status: 'active',   courses: 2, joined: 'Aug 30, 2024', lastActive: '1 day ago' },
]

const roleVariant: Record<string, any> = { admin: 'error', instructor: 'info', student: 'muted' }

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [selected, setSelected] = useState<number[]>([])

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (roleFilter === 'all' || u.role === roleFilter) &&
      (statusFilter === 'all' || u.status === statusFilter)
    )
  })

  const allSelected = filtered.length > 0 && filtered.every(u => selected.includes(u.id))
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(u => u.id))
  const toggleOne = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

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
          <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>Invite User</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3">
        <div className="flex items-center h-9 gap-2 px-3 bg-slate-50 border border-slate-200 rounded-lg flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500 font-medium">{selected.length} selected</span>
            <Button size="sm" variant="danger" icon={<Trash2 className="w-3.5 h-3.5" />}>Delete selected</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Courses</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Active</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(user => (
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
                  <td className="px-4 py-3.5"><Badge variant={roleVariant[user.role]}>{user.role}</Badge></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className={`text-xs font-semibold ${user.status === 'active' ? 'text-emerald-700' : 'text-slate-400'}`}>{user.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium text-slate-700">{user.courses}</span>
                    <span className="text-xs text-slate-400 ml-1">enrolled</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{user.joined}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{user.lastActive}</td>
                  <td className="px-4 py-3.5">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                        className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenu === user.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20">
                            <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"><Edit className="w-3.5 h-3.5 text-slate-400" /> Edit profile</button>
                            <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"><Shield className="w-3.5 h-3.5 text-slate-400" /> Change role</button>
                            <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5">
                              {user.status === 'active' ? <UserX className="w-3.5 h-3.5 text-slate-400" /> : <UserCheck className="w-3.5 h-3.5 text-slate-400" />}
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <hr className="my-1 border-slate-100" />
                            <button onClick={() => { setDeleteId(user.id); setOpenMenu(null) }} className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5"><Trash2 className="w-3.5 h-3.5" /> Delete user</button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-16 text-slate-400 text-sm">No users match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of <span className="font-semibold text-slate-700">{users.length}</span> users</p>
          <div className="flex items-center gap-1">
            <button className="h-7 px-3 text-xs rounded-md text-slate-500 hover:bg-slate-100 border border-slate-200 disabled:opacity-40" disabled>Prev</button>
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-7 h-7 rounded-md text-xs font-semibold ${p === 1 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{p}</button>
            ))}
            <button className="h-7 px-3 text-xs rounded-md text-slate-500 hover:bg-slate-100 border border-slate-200">Next</button>
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete User" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">This will permanently delete the user and remove all their enrollments, progress, and data. <strong className="text-slate-900">This cannot be undone.</strong></p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => setDeleteId(null)}>Delete User</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
