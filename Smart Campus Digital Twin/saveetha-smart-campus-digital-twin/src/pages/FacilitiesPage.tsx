import React, { useMemo, useState } from 'react';
import { Droplets, Monitor, Plus, Sparkles, UserCheck, Wind, Zap } from 'lucide-react';
import type {
  BuildingId,
  CampusState,
  CampusUser,
  FacilityCategory,
  MaintenanceRequest,
  PageId,
  WorkOrderPriority,
  WorkOrderStatus,
} from '../types/campus';

interface FacilitiesPageProps {
  campusState: CampusState;
  currentUser: CampusUser | null;
  onAddMaintenance: (order: Omit<MaintenanceRequest, 'id' | 'createdAt'>) => void;
  onUpdateMaintenance: (id: string, patch: Partial<MaintenanceRequest>) => void;
  onNavigate: (page: PageId, buildingId?: BuildingId) => void;
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

const STAFF_POOL = [
  'S. Murugan (Electrical)',
  'V. Prakash (Plumbing)',
  'R. Karthikeyan (HVAC Lead)',
  'K. Vignesh (EEE Maintenance)',
  'M. Selvam (Civil & Furniture)',
  'A. Nandhakumar (IT & Network)',
  'Sanitation Team B',
];

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({
  campusState,
  currentUser,
  onAddMaintenance,
  onUpdateMaintenance,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | FacilityCategory>('All');
  const [showCreate, setShowCreate] = useState(false);

  const [title, setTitle] = useState('');
  const [buildingId, setBuildingId] = useState<BuildingId>('main-engineering');
  const [category, setCategory] = useState<FacilityCategory>('Electrical');
  const [priority, setPriority] = useState<WorkOrderPriority>('Medium');
  const [assignedStaff, setAssignedStaff] = useState(STAFF_POOL[0]);
  const [locationDetail, setLocationDetail] = useState('');

  const canModifyTicket = (req: MaintenanceRequest) => {
    if (!currentUser) return false;
    if (currentUser.role === 'Admin') return true;
    if (currentUser.role === 'Maintenance Staff' || currentUser.role === 'Faculty') {
      return req.department === currentUser.department;
    }
    return false;
  };

  const filteredRequests = useMemo(() => {
    if (selectedCategory === 'All') return campusState.maintenance;
    return campusState.maintenance.filter((m) => m.category === selectedCategory);
  }, [campusState.maintenance, selectedCategory]);

  const totalWaterLiters = campusState.buildings.reduce((s, b) => s + b.waterUsageLiters, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const building =
      campusState.buildings.find((b) => b.id === buildingId) || campusState.buildings[0];
    onAddMaintenance({
      title: title.trim(),
      buildingId: building.id,
      buildingName: building.name,
      department: building.department,
      category,
      priority,
      status: 'Pending',
      assignedStaff,
      reportedBy: currentUser?.name || 'Facility Desk',
      reportedByUserId: currentUser?.id,
      locationDetail: locationDetail.trim() || 'Ground Corridor',
      estimatedHours: 2,
    });
    setTitle('');
    setLocationDetail('');
    setShowCreate(false);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Facility Operations &amp; Utilities
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {currentUser && (currentUser.role === 'Maintenance Staff' || currentUser.role === 'Faculty')
              ? `Department scope active: modify assignments & statuses for ${currentUser.department} Block, or report issues campus-wide.`
              : 'Coordinate electrical, plumbing, AC, furniture, IT/network, and cleanliness operations.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('maintenance')}
            className="rounded-lg border border-slate-700 bg-[#09152d] px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-cyan-500/40"
          >
            Full Work Order Board
          </button>
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Report Facility Issue</span>
          </button>
        </div>
      </div>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setSelectedCategory('Electrical')}
          className={`rounded-xl border p-4 text-left transition-colors ${
            selectedCategory === 'Electrical'
              ? 'border-cyan-500/60 bg-[#0d1f42]'
              : 'border-slate-800/90 bg-[#09152d] hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Electrical Grid</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 font-mono text-xl font-bold text-white tabular-nums">
            {campusState.maintenance.filter((m) => m.category === 'Electrical').length} Tickets
          </div>
          <div className="mt-1 text-[11px] text-slate-400">HT feeders · Lighting</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('Plumbing')}
          className={`rounded-xl border p-4 text-left transition-colors ${
            selectedCategory === 'Plumbing'
              ? 'border-cyan-500/60 bg-[#0d1f42]'
              : 'border-slate-800/90 bg-[#09152d] hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Water &amp; Plumbing</span>
            <Droplets className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 font-mono text-xl font-bold text-white tabular-nums">
            {(totalWaterLiters / 1000).toFixed(1)} kL/day
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {campusState.maintenance.filter((m) => m.category === 'Plumbing').length} Plumbing Tickets
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('AC')}
          className={`rounded-xl border p-4 text-left transition-colors ${
            selectedCategory === 'AC'
              ? 'border-cyan-500/60 bg-[#0d1f42]'
              : 'border-slate-800/90 bg-[#09152d] hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AC &amp; Chillers</span>
            <Wind className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono text-xl font-bold text-white tabular-nums">
            {campusState.maintenance.filter((m) => m.category === 'AC').length} Tickets
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Lab cooling loops</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('IT/Network')}
          className={`rounded-xl border p-4 text-left transition-colors ${
            selectedCategory === 'IT/Network'
              ? 'border-cyan-500/60 bg-[#0d1f42]'
              : 'border-slate-800/90 bg-[#09152d] hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>IT / Network &amp; Ops</span>
            <Monitor className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-xl font-bold text-cyan-300 tabular-nums">
            {campusState.maintenance.filter((m) => m.category === 'IT/Network').length} IT ·{' '}
            {campusState.maintenance.length} Total
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Switches · Cleanliness · Furniture</div>
        </button>
      </div>

      {/* Category Selector Strip */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-800/90 bg-[#09152d] p-2">
        {(['All', ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:bg-[#0c1a36] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Inline Quick Create Form */}
      {showCreate && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-cyan-500/35 bg-[#09152d] p-5 space-y-4 text-xs"
        >
          <div className="font-display text-base font-semibold text-white">
            Report New Campus Facility Issue
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue description (e.g., Floor 3 AC thermostat fault)"
              className="rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none md:col-span-2"
            />
            <input
              type="text"
              value={locationDetail}
              onChange={(e) => setLocationDetail(e.target.value)}
              placeholder="Room / Wing location"
              className="rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <select
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value as BuildingId)}
              className="rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              {campusState.buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FacilityCategory)}
              className="rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as WorkOrderPriority)}
              className="rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Priority</option>
            </select>
            <select
              value={assignedStaff}
              onChange={(e) => setAssignedStaff(e.target.value)}
              className="rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              {STAFF_POOL.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Submit Request
            </button>
          </div>
        </form>
      )}

      {/* Facility Request Assignment Table */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 lg:col-span-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <h3 className="font-display text-base font-semibold text-white">
                Facility Complaints &amp; Staff Assignment ({selectedCategory})
              </h3>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              {filteredRequests.length} ticket(s)
            </span>
          </div>
          <div className="mt-3 overflow-x-auto">
            {filteredRequests.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                No facility requests in category {selectedCategory}.
              </p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 pr-3 font-medium">Ticket / Issue</th>
                    <th className="py-2.5 px-3 font-medium">Category</th>
                    <th className="py-2.5 px-3 font-medium">Assigned Staff</th>
                    <th className="py-2.5 pl-3 font-medium">Workflow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRequests.map((req) => {
                    const editable = canModifyTicket(req);
                    return (
                      <tr key={req.id} className="hover:bg-[#0d1d3d]">
                        <td className="py-3 pr-3">
                          <div className="font-semibold text-white">
                            <span className="font-mono text-cyan-400 mr-1.5">{req.id}</span>
                            {req.title}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-400">
                            {req.department} · {req.buildingName} · {req.locationDetail}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                          {req.category}
                        </td>
                        <td className="py-3 px-3">
                          {editable ? (
                            <select
                              aria-label={`Assign staff for ${req.id}`}
                              value={req.assignedStaff}
                              onChange={(e) =>
                                onUpdateMaintenance(req.id, { assignedStaff: e.target.value })
                              }
                              className="rounded border border-slate-700 bg-[#0c1a36] px-2 py-1 text-[11px] text-slate-200"
                            >
                              {!STAFF_POOL.includes(req.assignedStaff) && (
                                <option value={req.assignedStaff}>{req.assignedStaff}</option>
                              )}
                              {STAFF_POOL.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[11px] text-slate-400">{req.assignedStaff}</span>
                          )}
                        </td>
                        <td className="py-3 pl-3">
                          {editable ? (
                            <select
                              aria-label={`Update status for ${req.id}`}
                              value={req.status}
                              onChange={(e) =>
                                onUpdateMaintenance(req.id, {
                                  status: e.target.value as WorkOrderStatus,
                                })
                              }
                              className="rounded border border-slate-700 bg-[#0c1a36] px-2 py-1 text-[11px] text-cyan-300"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          ) : (
                            <span className="inline-block rounded border border-slate-800 bg-[#0c1a36] px-2 py-1 text-[11px] text-slate-400">
                              {req.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Building Water & Utility Load Breakdown */}
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 lg:col-span-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <UserCheck className="h-4 w-4 text-cyan-400" />
            <h3 className="font-display text-base font-semibold text-white">
              Building Water &amp; Readiness
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {campusState.buildings.map((b) => (
              <div
                key={b.id}
                className="rounded-lg border border-slate-800 bg-[#0c1a36] p-3 text-xs"
              >
                <div className="flex items-center justify-between font-medium text-white">
                  <span>{b.shortName}</span>
                  <span className="font-mono text-sky-300 tabular-nums">
                    {(b.waterUsageLiters / 1000).toFixed(1)} kL/day
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Status: {b.maintenanceStatus}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('explorer', b.id)}
                    className="text-cyan-400 hover:underline"
                  >
                    3D View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
