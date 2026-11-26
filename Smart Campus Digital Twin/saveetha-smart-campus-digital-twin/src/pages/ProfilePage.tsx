import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, KeyRound, Shield, User } from 'lucide-react';
import type { CampusNotification, CampusUser, DepartmentCode } from '../types/campus';

interface ProfilePageProps {
  currentUser: CampusUser | null;
  notifications: CampusNotification[];
  onOpenAuth: () => void;
  onUpdateProfile: (
    id: string,
    patch: Partial<CampusUser> & { password?: string }
  ) => Promise<{ ok: boolean; error?: string }>;
  onMarkNotificationRead: (id: string) => void;
}

const DEPARTMENTS: DepartmentCode[] = ['CSE', 'ECE', 'EEE', 'SAIL', 'Admin'];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  notifications,
  onOpenAuth,
  onUpdateProfile,
  onMarkNotificationRead,
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [designationOrRoll, setDesignationOrRoll] = useState(
    currentUser?.designationOrRoll || ''
  );
  const [department, setDepartment] = useState<DepartmentCode>(currentUser?.department || 'CSE');
  const [newPassword, setNewPassword] = useState('');
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
      setDesignationOrRoll(currentUser.designationOrRoll);
      setDepartment(currentUser.department);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-2xl p-8 text-center">
        <div className="rounded-xl border border-slate-800 bg-[#09152d] p-8">
          <User className="mx-auto h-10 w-10 text-cyan-400" />
          <h2 className="mt-3 font-display text-xl font-bold text-white">Sign In Required</h2>
          <p className="mt-2 text-xs text-slate-400">
            Sign in or register an account to manage your profile, department permissions, and notifications.
          </p>
          <button
            type="button"
            onClick={onOpenAuth}
            className="mt-5 rounded-lg bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile(currentUser.id, {
      name: name.trim(),
      phone: phone.trim(),
      designationOrRoll: designationOrRoll.trim(),
      department,
      ...(newPassword.trim().length >= 6 ? { password: newPassword.trim() } : {}),
    });
    setNewPassword('');
    setSavedMsg('Profile details saved.');
    setTimeout(() => setSavedMsg(null), 2600);
  };

  const permissionsSummary =
    currentUser.role === 'Admin'
      ? [
          'Full campus-wide access across CSE, ECE, EEE, SAIL, and Admin blocks',
          'Create, edit, and delete campus buildings, resources, bookings, and users',
          'Manage smart parking, energy tariffs, and export executive CSV reports',
        ]
      : currentUser.role === 'Faculty'
        ? [
            `Department-scoped management restricted to ${currentUser.department} Block`,
            'Approve and manage classroom/lab bookings within assigned department',
            'Report campus maintenance issues and monitor department occupancy',
          ]
        : currentUser.role === 'Maintenance Staff'
          ? [
              `Department-scoped work order access for ${currentUser.department} Block`,
              'Update maintenance ticket status (Pending, In Progress, Completed)',
              'Inspect 3D building locations and facility utility loads',
            ]
          : [
              'Explore 3D campus buildings and live classroom/lab availability',
              'Book open lab/test slots with real-time seat capacity validation',
              'Manage personal bookings and report facility maintenance issues',
            ];

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            User Profile &amp; Access Scope
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Manage personal details, credentials, and review role-based campus permissions.
          </p>
        </div>
        {savedMsg && (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/70 px-3 py-1.5 text-xs text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{savedMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Profile Form */}
        <form
          onSubmit={handleSave}
          className="space-y-4 rounded-xl border border-slate-800/90 bg-[#09152d] p-6 text-xs lg:col-span-7"
        >
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/15 font-display text-lg font-bold text-cyan-300">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="font-display text-base font-semibold text-white">
                {currentUser.name}
              </div>
              <div className="text-xs text-slate-400">
                {currentUser.role} · {currentUser.department} Department · {currentUser.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-medium text-slate-300">Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300">Roll No / Employee ID</label>
              <input
                type="text"
                value={designationOrRoll}
                onChange={(e) => setDesignationOrRoll(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300">Assigned Department</label>
              <select
                value={department}
                disabled={currentUser.role === 'Faculty' || currentUser.role === 'Maintenance Staff'}
                onChange={(e) => setDepartment(e.target.value as DepartmentCode)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white disabled:opacity-60"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <label className="flex items-center gap-1.5 font-medium text-slate-300">
              <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
              <span>Update Password (Optional, min 6 characters)</span>
            </label>
            <input
              type="password"
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>

        {/* Permissions & Personal Notifications */}
        <div className="space-y-5 lg:col-span-5">
          <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>Role-Based &amp; Department Permissions</span>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              {permissionsSummary.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Bell className="h-4 w-4 text-cyan-400" />
              <span>Recent Role Notifications ({notifications.length})</span>
            </div>
            <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400">No notifications for your role yet.</p>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => onMarkNotificationRead(n.id)}
                    className={`w-full rounded-lg border p-2.5 text-left text-xs transition-colors ${
                      n.read
                        ? 'border-slate-800/70 bg-[#0c1a36]/60 text-slate-400'
                        : 'border-cyan-500/35 bg-[#0c1f40] text-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>{n.title}</span>
                      <span className="font-mono text-[10px] text-slate-400">{n.createdAt}</span>
                    </div>
                    <p className="mt-0.5 text-[11px]">{n.message}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
