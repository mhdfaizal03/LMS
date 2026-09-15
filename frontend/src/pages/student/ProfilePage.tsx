import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { authApi } from '../../api';
import { User, Lock, Save, ShieldCheck, Mail, Phone } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useNotification();

  const [name, setName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [expertise, setExpertise] = useState<string>(user?.expertise || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);

  // Password change
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await updateUserProfile({ name, phone, bio, expertise });
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to update profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    try {
      await authApi.changePassword({ old_password: oldPassword, new_password: newPassword });
      showToast('Password changed successfully!', 'success');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to change password', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Account & Profile Settings</h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Manage your personal details, biography, contact information, and security preferences.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Profile Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              {user?.name.charAt(0)}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.name}</h3>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              <span className="badge badge-primary" style={{ marginTop: '4px' }}>{user?.role}</span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {user?.role === 'instructor' && (
              <div className="form-group">
                <label className="form-label">Professional Expertise</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Python, FastAPI, Microservices, React"
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Bio / Overview</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Share a brief overview of your background and learning goals..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" disabled={isUpdatingProfile} className="btn btn-primary">
                <Save size={16} /> {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Change Account Password
          </h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                required
                className="form-input"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="form-input"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" disabled={isChangingPassword} className="btn btn-secondary">
                <Lock size={16} /> {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
