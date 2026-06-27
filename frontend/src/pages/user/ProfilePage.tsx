import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateUser } from '../../store/slices/authSlice';
import { usersApi } from '../../services/api';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const [info, setInfo] = useState({
    name:       user?.name       ?? '',
    email:      user?.email      ?? '',
    phone:      user?.phone      ?? '',
    department: user?.department ?? '',
  });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [infoMsg, setInfoMsg] = useState('');
  const [infoErr, setInfoErr] = useState('');
  const [pwMsg,   setPwMsg]   = useState('');
  const [pwErr,   setPwErr]   = useState('');
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPw,   setSavingPw]   = useState(false);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInfo((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPw((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMsg(''); setInfoErr('');
    setSavingInfo(true);
    try {
      if (!user) return;
      const res = await usersApi.update(user.id, {
        name: info.name, phone: info.phone, department: info.department,
      });
      dispatch(updateUser(res.data.user ?? res.data));
      setInfoMsg('Profile updated successfully!');
    } catch (err: any) {
      setInfoErr(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(''); setPwErr('');
    if (pw.next !== pw.confirm) { setPwErr('Passwords do not match'); return; }
    if (pw.next.length < 6)    { setPwErr('New password must be at least 6 characters'); return; }
    setSavingPw(true);
    try {
      if (!user) return;
      await usersApi.update(user.id, { currentPassword: pw.current, newPassword: pw.next });
      setPw({ current: '', next: '', confirm: '' });
      setPwMsg('Password changed successfully!');
    } catch (err: any) {
      setPwErr(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPw(false);
    }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? '?';

  return (
    <AppLayout title="Profile">
      <div className="max-w-4xl mx-auto">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your account information.</p>
        </div>

        {/* Avatar card */}
        <div className="glass-card p-5 flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-avatar-gradient flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <span className={`badge text-xs mt-1 ${
              user?.role === 'admin'
                ? 'bg-primary/15 text-primary-300 border border-primary/20'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
            }`}>{user?.role === 'admin' ? 'Administrator' : 'Employee'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal info */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-gray-100 mb-5">Personal Information</h2>
            {infoMsg && <div className="alert-success mb-4">{infoMsg}</div>}
            {infoErr && <div className="alert-error mb-4">{infoErr}</div>}

            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input name="name" type="text" className="input" value={info.name} onChange={handleInfoChange} />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input name="email" type="email" className="input opacity-60 cursor-not-allowed" value={info.email} disabled />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input name="phone" type="text" className="input" placeholder="+1-555-0100" value={info.phone} onChange={handleInfoChange} />
              </div>
              <div>
                <label className="form-label">Department</label>
                <input name="department" type="text" className="input" placeholder="Engineering" value={info.department} onChange={handleInfoChange} />
              </div>
              <button type="submit" disabled={savingInfo} className="btn btn-primary w-full justify-center">
                {savingInfo ? <><div className="spinner" />Saving…</> : '✓ Save Changes'}
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-gray-100 mb-5">Change Password</h2>
            {pwMsg && <div className="alert-success mb-4">{pwMsg}</div>}
            {pwErr && <div className="alert-error mb-4">{pwErr}</div>}

            <form onSubmit={handleChangePw} className="space-y-4">
              <div>
                <label className="form-label">Current Password</label>
                <input name="current" type="password" className="input" placeholder="••••••••"
                  value={pw.current} onChange={handlePwChange} required />
              </div>
              <div>
                <label className="form-label">New Password</label>
                <input name="next" type="password" className="input" placeholder="Min. 6 characters"
                  value={pw.next} onChange={handlePwChange} required />
              </div>
              <div>
                <label className="form-label">Confirm New Password</label>
                <input name="confirm" type="password" className="input" placeholder="Repeat password"
                  value={pw.confirm} onChange={handlePwChange} required />
              </div>
              <button type="submit" disabled={savingPw} className="btn btn-secondary w-full justify-center">
                {savingPw ? <><div className="spinner" />Changing…</> : '🔒 Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
