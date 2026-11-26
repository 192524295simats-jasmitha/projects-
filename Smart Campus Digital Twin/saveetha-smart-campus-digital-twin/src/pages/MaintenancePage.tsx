import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clock, Edit3, Lock, Plus, Search, Trash2, Wrench, X } from 'lucide-react';
import type {
  BuildingId,
  CampusState,
  CampusUser,
  DepartmentCode,
  FacilityCategory,
  MaintenanceRequest,
  WorkOrderPriority,
  WorkOrderStatus,
} from '../types/campus';

interface MaintenancePageProps {
  campusState: CampusState;
  currentUser: CampusUser | null;
  initialBuildingId: BuildingId | null;
  onAddMaintenance: (order: Omit<MaintenanceRequest, 'id' | 'createdAt'>) => void;
  onUpdateMaintenance: (id: string, patch: Partial<MaintenanceRequest>) => void;
  onDeleteMaintenance: (id: string) => void;
}

const CATEGORIES: FacilityCategory[] = [
  'Electrical',
  'Plumbing',
  'AC',
  'Furniture',
  'IT/Network',
  'Cleanliness',
  'Other',
];

const DEPARTMENTS: DepartmentCode[] = ['CSE', 'ECE', 'EEE', 'SAIL', 'Admin'];

export const MaintenancePage: React.FC<MaintenancePageProps> = ({
  campusState,
  currentUser,
  initialBuildingId,
  onAddMaintenance,
  onUpdateMaintenance,
  onDeleteMaintenance,
}) => {
  const [statusTab, setStatusTab] = useState<'All' | WorkOrderStatus>('All');
  const [buildingFilter, setBuildingFilter] = useState<'All' | BuildingId>(
    initialBuildingId || 'All'
  );
  const [deptFilter, setDeptFilter] = useState<'All' | DepartmentCode>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | FacilityCategory>('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MaintenanceRequest | null>(null);

  const canModifyOrder = (wo: MaintenanceRequest) => {
    if (!currentUser) return false;
    if (currentUser.role === 'Admin') return true;
    if (currentUser.role === 'Maintenance Staff' || currentUser.role === 'Faculty') {
      return wo.department === currentUser.department;
    }
    return false;
  };

  const canDeleteOrder = currentUser?.role === 'Admin';

  const [formState, setFormState] = useState<{
    title: string;
    buildingId: BuildingId;
    category: FacilityCategory;
    priority: WorkOrderPriority;
    status: WorkOrderStatus;
    assignedStaff: string;
    reportedBy: string;
    locationDetail: string;
    estimatedHours: number;
  }>({
    title: '',
    buildingId: 'main-engineering',
    category: 'Electrical',
    priority: 'Medium',
    status: 'Pending',
    assignedStaff: 'S. Murugan (Electrical)',
    reportedBy: currentUser?.name || 'Campus Operations',
    locationDetail: '',
    estimatedHours: 2,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campusState.maintenance.filter((wo) => {
      if (statusTab !== 'All' && wo.status !== statusTab) return false;
      if (buildingFilter !== 'All' && wo.buildingId !== buildingFilter) return false;
      if (deptFilter !== 'All' && wo.department !== deptFilter) return false;
      if (categoryFilter !== 'All' && wo.category !== categoryFilter) return false;
      if (
        q &&
        !wo.title.toLowerCase().includes(q) &&
        !wo.id.toLowerCase().includes(q) &&
        !wo.assignedStaff.toLowerCase().includes(q) &&
        !wo.department.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [campusState.maintenance, statusTab, buildingFilter, deptFilter, categoryFilter, search]);

  const counts = useMemo(
    () => ({
      pending: campusState.maintenance.filter((m) => m.status === 'Pending').length,
      inProgress: campusState.maintenance.filter((m) => m.status === 'In Progress').length,
      completed: campusState.maintenance.filter((m) => m.status === 'Completed').length,
    }),
    [campusState.maintenance]
  );

  const openCreate = () => {
    const defaultBuilding =
      buildingFilter !== 'All'
        ? buildingFilter
        : campusState.buildings.find((b) => b.department === currentUser?.department)?.id ||
          'main-engineering';

    setEditing(null);
    setFormState({
      title: '',
      buildingId: defaultBuilding,
      category: 'Electrical',
      priority: 'Medium',
      status: 'Pending',
      assignedStaff: 'Auto-Assigned Dept Technician',
      reportedBy: currentUser?.name || 'Campus User',
      locationDetail: 'Floor 2 Corridor',
      estimatedHours: 2,
    });
    setModalOpen(true);
  };

  const openEdit = (wo: MaintenanceRequest) => {
    setEditing(wo);
    setFormState({
      title: wo.title,
      buildingId: wo.buildingId,
      category: wo.category,
      priority: wo.priority,
      status: wo.status,
      assignedStaff: wo.assignedStaff,
      reportedBy: wo.reportedBy,
      locationDetail: wo.locationDetail,
      estimatedHours: wo.estimatedHours,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) return;
    const building =
      campusState.buildings.find((b) => b.id === formState.buildingId) || campusState.buildings[0];
    if (editing) {
      onUpdateMaintenance(editing.id, {
        ...formState,
        buildingName: building.name,
        department: building.department,
      });
    } else {
      onAddMaintenance({
        ...formState,
        buildingName: building.name,
        department: building.department,
        reportedBy: formState.reportedBy || currentUser?.name || 'Campus User',
        reportedByUserId: currentUser?.id,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Maintenance Reporting &amp; Work Orders
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {currentUser && (currentUser.role === 'Maintenance Staff' || currentUser.role === 'Faculty')
              ? `Department access active (${currentUser.department}): you can update tickets in ${currentUser.department} Block and report issues campus-wide.`
              : 'Report Electrical, Plumbing, AC, Furniture, IT/Network, Cleanliness, or Other issues across all campus blocks.'}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Report Maintenance Issue</span>
        </button>
      </div>

      {/* Status Summary Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setStatusTab('Pending')}
          className={`rounded-xl border p-4 text-left transition-colors ${
            statusTab === 'Pending'
              ? 'border-amber-400/60 bg-[#0d1f42]'
              : 'border-slate-800/90 bg-[#09152d]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span>Pending</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {counts.pending}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusTab('In Progress')}
          className={`rounded-xl border p-4 text-left transition-colors ${
            statusTab === 'In Progress'
              ? 'border-cyan-400/60 bg-[#0d1f42]'
              : 'border-slate-800/90 bg-[#09152d]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-cyan-300">
            <span>In Progress</span>
            <Wrench className="h-4 w-4" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {counts.inProgress}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusTab('Completed')}
          className={`rounded-xl border p-4 text-left transition-colors ${
            statusTab === 'Completed'
              ? 'border-emerald-400/60 bg-[#0d1f42]'
              : 'border-slate-800/90 bg-[#09152d]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>Completed</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {counts.completed}
          </div>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
        <div className="flex items-center gap-1 rounded-lg bg-[#0c1a36] p-1">
          {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusTab(tab)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                statusTab === tab
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex min-w-[200px] flex-1 items-center rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket ID, issue, or technician..."
            className="ml-2 w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <select
          aria-label="Filter by department"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value as 'All' | DepartmentCode)}
          className="rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d} Block
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as 'All' | FacilityCategory)}
          className="rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by building"
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value as 'All' | BuildingId)}
          className="rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="All">All Buildings</option>
          {campusState.buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.shortName}
            </option>
          ))}
        </select>
      </div>

      {/* Work Order Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-[#09152d]">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            No maintenance work orders match your current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0b1935] text-slate-400">
                  <th className="px-4 py-3 font-medium">Work Order</th>
                  <th className="px-4 py-3 font-medium">Dept / Location</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Technician</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((wo) => {
                  const editable = canModifyOrder(wo);
                  return (
                    <tr key={wo.id} className="hover:bg-[#0d1d3d]">
                      <td className="px-4 py-3">
                        <div className="font-mono text-[11px] text-cyan-400">{wo.id}</div>
                        <div className="font-semibold text-white">{wo.title}</div>
                        <div className="text-[11px] text-slate-400">
                          {wo.createdAt} · Reported by {wo.reportedBy}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div>
                          <span className="font-mono text-cyan-300">{wo.department}</span> ·{' '}
                          {wo.buildingName}
                        </div>
                        <div className="text-[11px] text-slate-400">{wo.locationDetail}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{wo.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`text-xs font-medium ${
                            wo.priority === 'Critical' || wo.priority === 'High'
                              ? 'text-rose-400'
                              : wo.priority === 'Medium'
                                ? 'text-amber-300'
                                : 'text-slate-300'
                          }`}
                        >
                          {wo.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{wo.assignedStaff}</td>
                      <td className="px-4 py-3">
                        {editable ? (
                          <select
                            aria-label={`Change status for ${wo.id}`}
                            value={wo.status}
                            onChange={(e) =>
                              onUpdateMaintenance(wo.id, {
                                status: e.target.value as WorkOrderStatus,
                              })
                            }
                            className={`rounded border px-2 py-1 text-[11px] font-medium bg-[#0c1a36] ${
                              wo.status === 'Completed'
                                ? 'border-emerald-500/40 text-emerald-300'
                                : wo.status === 'In Progress'
                                  ? 'border-cyan-500/40 text-cyan-300'
                                  : 'border-amber-500/40 text-amber-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block rounded border px-2 py-1 text-[11px] font-medium ${
                              wo.status === 'Completed'
                                ? 'border-emerald-500/30 text-emerald-300'
                                : wo.status === 'In Progress'
                                  ? 'border-cyan-500/30 text-cyan-300'
                                  : 'border-amber-500/30 text-amber-300'
                            }`}
                          >
                            {wo.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {editable ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEdit(wo)}
                              aria-label={`Edit ${wo.id}`}
                              className="rounded border border-slate-700 p-1 text-slate-300 hover:text-white"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            {canDeleteOrder && (
                              <button
                                type="button"
                                onClick={() => onDeleteMaintenance(wo.id)}
                                aria-label={`Delete ${wo.id}`}
                                className="rounded border border-slate-700 p-1 text-rose-400 hover:bg-rose-950/50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                            <Lock className="h-3 w-3" />
                            <span>{wo.department} Dept</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-[#081329] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display text-lg font-semibold text-white">
                {editing ? `Edit Work Order ${editing.id}` : 'Report Campus Maintenance Issue'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300">Issue Title</label>
                <input
                  required
                  type="text"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="e.g. Lab projector cable or AC cooling fault"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300">Building / Block</label>
                  <select
                    value={formState.buildingId}
                    onChange={(e) =>
                      setFormState({ ...formState, buildingId: e.target.value as BuildingId })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  >
                    {campusState.buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300">Issue Category</label>
                  <select
                    value={formState.category}
                    onChange={(e) =>
                      setFormState({ ...formState, category: e.target.value as FacilityCategory })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-300">Priority</label>
                  <select
                    value={formState.priority}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        priority: e.target.value as WorkOrderPriority,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300">Status</label>
                  <select
                    disabled={!editing}
                    value={formState.status}
                    onChange={(e) =>
                      setFormState({ ...formState, status: e.target.value as WorkOrderStatus })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white disabled:opacity-60"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300">Est. Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={formState.estimatedHours}
                    onChange={(e) =>
                      setFormState({ ...formState, estimatedHours: Number(e.target.value) || 1 })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300">Assigned Staff</label>
                  <input
                    type="text"
                    value={formState.assignedStaff}
                    onChange={(e) => setFormState({ ...formState, assignedStaff: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300">Room / Location Detail</label>
                  <input
                    type="text"
                    value={formState.locationDetail}
                    onChange={(e) => setFormState({ ...formState, locationDetail: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  {editing ? 'Save Changes' : 'Submit Work Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
