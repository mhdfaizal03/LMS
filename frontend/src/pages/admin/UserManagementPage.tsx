import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { User, UserRole, UserStatus } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  UserCheck, Search, PlusCircle, Edit, Trash2, Shield, UserX, CheckCircle
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { showToast } = useNotification();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  // Form states
  const [formName, setFormName] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formPassword, setFormPassword] = useState<string>('');
  const [formRole, setFormRole] = useState<UserRole>('student');
  const [formStatus, setFormStatus] = useState<UserStatus>('active');

  const loadUsers = () => {
    setLoading(true);
    adminApi.getUsers({
      search: search || undefined,
      role: roleFilter || undefined,
    })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createUser({
        name: formName,
        email: formEmail,
        password: formPassword,
        role: formRole,
      });
      showToast('User created successfully', 'success');
      setShowCreateModal(false);
      setFormName('');
      setFormEmail('');
      setFormPassword('');
      loadUsers();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to create user', 'error');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await adminApi.updateUser(editingUser.id, {
        name: formName,
        role: formRole,
        status: formStatus,
      });
      showToast('User updated successfully', 'success');
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      await adminApi.deleteUser(deleteUserId);
      showToast('User account deleted', 'info');
      setDeleteUserId(null);
      loadUsers();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to delete user', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>User Directory & Roles</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Manage platform permissions, active statuses, roles, and administrative invitations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormName('');
            setFormEmail('');
            setFormPassword('');
            setFormRole('student');
            setShowCreateModal(true);
          }}
          className="btn btn-primary"
        >
          <PlusCircle size={18} /> Add User
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '14px' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or email..."
            style={{ paddingLeft: '42px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="instructor">Instructors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner message="Loading user directory..." />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered On</th>
                <th>Last Login</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setFormName(u.name);
                          setFormRole(u.role);
                          setFormStatus(u.status);
                        }}
                        className="btn-icon"
                        title="Edit User"
                      >
                        <Edit size={16} color="var(--primary)" />
                      </button>
                      <button
                        onClick={() => setDeleteUserId(u.id)}
                        className="btn-icon"
                        style={{ color: 'var(--danger)' }}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Platform User"
      >
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Temporary Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-input"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Assigned Role</label>
            <select
              className="form-select"
              value={formRole}
              onChange={(e) => setFormRole(e.target.value as UserRole)}
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal
          isOpen={true}
          onClose={() => setEditingUser(null)}
          title={`Edit User: ${editingUser.name}`}
        >
          <form onSubmit={handleUpdateUser}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as UserRole)}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Account Status</label>
              <select
                className="form-select"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as UserStatus)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setEditingUser(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteUserId !== null}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user account? All their enrollments, progress, and submissions will also be deleted."
        confirmText="Delete Account"
        isDestructive={true}
      />
    </div>
  );
};
