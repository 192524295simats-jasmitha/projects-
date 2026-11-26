import React, { useState } from 'react';
import { LogIn, UserPlus, X } from 'lucide-react';
import type { CampusUser, DepartmentCode, UserRole } from '../types/campus';

interface AuthModalProps {
  open: boolean;
  users: CampusUser[];
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  onRegister: (payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department: DepartmentCode;
    designationOrRoll: string;
    phone: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  onQuickSwitch: (userId: string) => void;
}

const ROLES: UserRole[] = ['Student', 'Faculty', 'Maintenance Staff', 'Admin'];
const DEPARTMENTS: DepartmentCode[] = ['CSE', 'ECE', 'EEE', 'SAIL', 'Admin'];

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  users,
  onClose,
  onLogin,
  onRegister,
  onQuickSwitch,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Student');
  const [department, setDepartment] = useState<DepartmentCode>('CSE');
  const [designationOrRoll, setDesignationOrRoll] = useState('');
  const [phone, setPhone] = useState('+91 98400 00000');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await onLogin(email, password);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || 'Unable to sign in.');
      return;
    }
    onClose();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await onRegister({
      name,
      email,
      password,
      role,
      department,
      designationOrRoll: designationOrRoll || `${role} · ${department}`,
      phone,
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || 'Unable to register.');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-[#081329] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              Saveetha Campus Access &amp; Identity
            </h3>
            <p className="text-xs text-slate-400">
              Sign in, register a new account, or switch roles to test department-scoped access.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="rounded-lg p-1 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Switch */}
        <div className="mt-4 flex gap-1 rounded-lg bg-[#0c1a36] p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
              mode === 'login' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-300'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
              mode === 'register' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-300'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Register Account</span>
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-rose-500/40 bg-rose-950/60 px-3 py-2 text-xs text-rose-200">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <div className="mt-4 space-y-5">
            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-300">Institutional Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya.cse@saveetha.edu"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-cyan-500 py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Quick Role Switcher */}
            <div className="border-t border-slate-800 pt-4">
              <div className="text-[11px] font-semibold text-slate-400">
                Quick Demo Account Switch (Default password: password123)
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {users.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      onQuickSwitch(u.id);
                      onClose();
                    }}
                    className="flex flex-col rounded-lg border border-slate-800 bg-[#0c1a36] p-2.5 text-left hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span className="truncate">{u.name}</span>
                      <span className="ml-2 shrink-0 text-[10px] font-mono text-cyan-300">
                        {u.department}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      {u.role} · {u.email}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-medium text-slate-300">Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Karthik Subramanian"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300">Institutional Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="karthik@saveetha.edu"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-medium text-slate-300">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-300">Assigned Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as DepartmentCode)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-medium text-slate-300">Roll No / Employee ID</label>
                <input
                  type="text"
                  value={designationOrRoll}
                  onChange={(e) => setDesignationOrRoll(e.target.value)}
                  placeholder="e.g. 212221040099"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300">Password</label>
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-cyan-500 py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              {submitting ? 'Creating Account...' : 'Create Account & Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
