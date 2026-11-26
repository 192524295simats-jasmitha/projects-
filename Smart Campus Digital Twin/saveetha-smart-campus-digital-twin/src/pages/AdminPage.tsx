import React, { useState } from 'react';
import { Building2, Plus, RotateCcw, Shield, Trash2, Users } from 'lucide-react';
import type {
  BuildingId,
  CampusBuilding,
  CampusState,
  CampusUser,
  DepartmentCode,
  MaintenanceStatusType,
  PageId,
  UserRole,
} from '../types/campus';

interface AdminPageProps {
  campusState: CampusState;
  onUpdateBuilding: (id: BuildingId, patch: Partial<CampusBuilding>) => void;
  onAddUser: (user: Omit<CampusUser, 'id' | 'lastActive'>) => void;
  onUpdateUser: (id: string, patch: Partial<CampusUser>) => void;
  onDeleteUser: (id: string) => void;
  onResetAllData: () => void;
  onNavigate: (page: PageId, buildingId?: BuildingId) => void;
}

const USER_ROLES: UserRole[] = ['Student', 'Faculty', 'Maintenance Staff', 'Admin'];
const DEPARTMENTS: DepartmentCode[] = ['CSE', 'ECE', 'EEE', 'SAIL', 'Admin'];

export const AdminPage: React.FC<AdminPageProps> = ({
  campusState,
  onUpdateBuilding,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onResetAllData,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'buildings' | 'users'>('overview');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('Faculty');
  const [userDept, setUserDept] = useState<DepartmentCode>('CSE');
  const [designationOrRoll, setDesignationOrRoll] = useState('');
  const [phone, setPhone] = useState('+91 98400 00000');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;
    onAddUser({
      name: userName.trim(),
      email: userEmail.trim().toLowerCase(),
      role: userRole,
      department: userDept,
      designationOrRoll: designationOrRoll.trim() || `${userRole} · ${userDept}`,
      phone: phone.trim() || '+91 98400 00000',
      status: 'Active',
      password: 'password123',
    });
    setUserName('');
    setUserEmail('');
    setDesignationOrRoll('');
    showToast('Campus user account added successfully.');
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Digital Twin Administration Console
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Manage campus buildings, role-based &amp; department-scoped users, and simulated telemetry store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {toast && (
            <span className="rounded-lg border border-emerald-500/40 bg-emerald-950/70 px-3 py-1.5 text-xs text-emerald-300">
              {toast}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              onResetAllData();
              showToast('Simulated digital twin data restored to defaults.');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#09152d] px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-rose-500/50 hover:text-rose-300 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Simulated Data</span>
          </button>
        </div>
      </div>

      {/* Admin Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-800/90 bg-[#09152d] p-1.5 w-fit">
        {[
          { id: 'overview', label: 'Module Hub' },
          { id: 'buildings', label: 'Building Parameters' },
          { id: 'users', label: 'User & Access Management' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-cyan-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Resource & Room Registry',
              desc: `${campusState.resources.length} classrooms, labs, and seminar spaces tracked.`,
              page: 'resources' as PageId,
              cta: 'Manage Resources',
            },
            {
              title: 'Lab & Test-Slot Bookings',
              desc: `${campusState.bookings.filter((b) => b.status === 'Confirmed').length} confirmed bookings with capacity validation.`,
              page: 'bookings' as PageId,
              cta: 'Open Bookings Console',
            },
            {
              title: 'Facility & Maintenance Queue',
              desc: `${campusState.maintenance.length} work orders across Electrical, Plumbing, AC, IT & Civil.`,
              page: 'maintenance' as PageId,
              cta: 'Manage Work Orders',
            },
            {
              title: 'Energy & Solar Telemetry',
              desc: `Tariff calibrated at ₹${campusState.tariffInrPerKwh}/kWh across 5 campus blocks.`,
              page: 'energy' as PageId,
              cta: 'Open Energy Monitor',
            },
            {
              title: 'Smart Parking Operations',
              desc: `${campusState.parking.filter((p) => !p.occupied).length} of ${campusState.parking.length} bays currently free.`,
              page: 'parking' as PageId,
              cta: 'Manage Parking',
            },
            {
              title: 'Executive Analytics & CSV',
              desc: 'Export structured digital twin metrics and SLA reports.',
              page: 'reports' as PageId,
              cta: 'Open Reports',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#09152d] p-5"
            >
              <div>
                <h3 className="font-display text-base font-semibold text-white">{card.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{card.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(card.page)}
                className="mt-4 w-fit rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
              >
                {card.cta} →
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'buildings' && (
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="h-4 w-4 text-cyan-400" />
            <h3 className="font-display text-base font-semibold text-white">
              Edit Building Operational Parameters
            </h3>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 pr-3 font-medium">Building</th>
                  <th className="py-2.5 px-3 font-medium">Occupancy %</th>
                  <th className="py-2.5 px-3 font-medium">Open Rooms</th>
                  <th className="py-2.5 px-3 font-medium">Energy (kWh/d)</th>
                  <th className="py-2.5 pl-3 font-medium">Maintenance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {campusState.buildings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 pr-3 font-semibold text-white">
                      {b.name}
                      <span className="ml-2 font-mono text-[11px] text-cyan-400">
                        ({b.department})
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={b.occupancyPercent}
                        onChange={(e) => {
                          onUpdateBuilding(b.id, {
                            occupancyPercent: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                          });
                          showToast(`Updated ${b.shortName}`);
                        }}
                        className="w-20 rounded border border-slate-700 bg-[#0c1a36] px-2 py-1 font-mono text-white"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min={0}
                        max={b.totalRooms}
                        value={b.availableRooms}
                        onChange={(e) => {
                          onUpdateBuilding(b.id, {
                            availableRooms: Math.min(
                              b.totalRooms,
                              Math.max(0, Number(e.target.value) || 0)
                            ),
                          });
                          showToast(`Updated ${b.shortName}`);
                        }}
                        className="w-20 rounded border border-slate-700 bg-[#0c1a36] px-2 py-1 font-mono text-white"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min={100}
                        step={50}
                        value={b.energyConsumptionKwh}
                        onChange={(e) => {
                          onUpdateBuilding(b.id, {
                            energyConsumptionKwh: Math.max(100, Number(e.target.value) || 100),
                          });
                          showToast(`Updated ${b.shortName}`);
                        }}
                        className="w-24 rounded border border-slate-700 bg-[#0c1a36] px-2 py-1 font-mono text-white"
                      />
                    </td>
                    <td className="py-3 pl-3">
                      <select
                        value={b.maintenanceStatus}
                        onChange={(e) => {
                          onUpdateBuilding(b.id, {
                            maintenanceStatus: e.target.value as MaintenanceStatusType,
                          });
                          showToast(`Status updated for ${b.shortName}`);
                        }}
                        className="rounded border border-slate-700 bg-[#0c1a36] px-2.5 py-1 text-slate-200"
                      >
                        <option value="Operational">Operational</option>
                        <option value="Scheduled Inspection">Scheduled Inspection</option>
                        <option value="Attention Required">Attention Required</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 lg:col-span-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield className="h-4 w-4 text-cyan-400" />
              <h3 className="font-display text-base font-semibold text-white">Add Campus User</h3>
            </div>
            <form onSubmit={handleCreateUser} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-300">Full Name</label>
                <input
                  required
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Dr. Kavitha S."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300">Institutional Email</label>
                <input
                  required
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="kavitha.cse@saveetha.edu"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300">Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  >
                    {USER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300">Department</label>
                  <select
                    value={userDept}
                    onChange={(e) => setUserDept(e.target.value as DepartmentCode)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300">Roll / Emp ID</label>
                  <input
                    type="text"
                    value={designationOrRoll}
                    onChange={(e) => setDesignationOrRoll(e.target.value)}
                    placeholder="EMP-CSE-112"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                New accounts are provisioned with default sign-in password <span className="font-mono text-cyan-300">password123</span>.
              </p>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                <Plus className="h-4 w-4" />
                <span>Add Campus User</span>
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 lg:col-span-8">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="h-4 w-4 text-cyan-400" />
              <h3 className="font-display text-base font-semibold text-white">
                Registered Campus Accounts ({campusState.users.length})
              </h3>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 pr-3 font-medium">User &amp; ID</th>
                    <th className="py-2.5 px-3 font-medium">Role</th>
                    <th className="py-2.5 px-3 font-medium">Department</th>
                    <th className="py-2.5 px-3 font-medium">Status</th>
                    <th className="py-2.5 pl-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {campusState.users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#0d1d3d]">
                      <td className="py-3 pr-3">
                        <div className="font-semibold text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {u.email} · {u.designationOrRoll}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          aria-label={`Role for ${u.name}`}
                          value={u.role}
                          onChange={(e) => {
                            onUpdateUser(u.id, { role: e.target.value as UserRole });
                            showToast(`Updated role for ${u.name}`);
                          }}
                          className="rounded border border-slate-700 bg-[#0c1a36] px-2 py-1 text-[11px] text-cyan-300"
                        >
                          {USER_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          aria-label={`Department for ${u.name}`}
                          value={u.department}
                          onChange={(e) => {
                            onUpdateUser(u.id, { department: e.target.value as DepartmentCode });
                            showToast(`Updated department for ${u.name}`);
                          }}
                          className="rounded border border-slate-700 bg-[#0c1a36] px-2 py-1 text-[11px] text-slate-200"
                        >
                          {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateUser(u.id, {
                              status: u.status === 'Active' ? 'Inactive' : 'Active',
                            })
                          }
                          className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                            u.status === 'Active'
                              ? 'bg-emerald-950/70 text-emerald-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {u.status}
                        </button>
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          type="button"
                          onClick={() => onDeleteUser(u.id)}
                          aria-label={`Remove ${u.name}`}
                          className="rounded border border-slate-700 p-1 text-rose-400 hover:bg-rose-950/50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
