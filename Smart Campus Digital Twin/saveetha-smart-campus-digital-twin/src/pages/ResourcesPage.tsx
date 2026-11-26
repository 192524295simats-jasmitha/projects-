import React, { useMemo, useState } from 'react';
import { CalendarPlus, Edit3, Plus, Search, Trash2, X } from 'lucide-react';
import type {
  BuildingId,
  CampusResource,
  CampusState,
  CampusUser,
  DepartmentCode,
  PageId,
  ResourceBookingStatus,
  ResourceType,
} from '../types/campus';

interface ResourcesPageProps {
  campusState: CampusState;
  currentUser: CampusUser | null;
  onAddResource: (resource: Omit<CampusResource, 'id' | 'lastUpdated'>) => void;
  onUpdateResource: (id: string, patch: Partial<CampusResource>) => void;
  onDeleteResource: (id: string) => void;
  onNavigate: (page: PageId, buildingId?: BuildingId) => void;
}

const RESOURCE_TYPES: ResourceType[] = [
  'Classroom',
  'Laboratory',
  'Projector',
  'Computer',
  'Seminar Hall',
];

const BOOKING_STATUSES: ResourceBookingStatus[] = [
  'Available',
  'In Use',
  'Reserved',
  'Maintenance',
];

export const ResourcesPage: React.FC<ResourcesPageProps> = ({
  campusState,
  currentUser,
  onAddResource,
  onUpdateResource,
  onDeleteResource,
  onNavigate,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | ResourceType>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ResourceBookingStatus>('All');
  const [buildingFilter, setBuildingFilter] = useState<'All' | BuildingId>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CampusResource | null>(null);

  const canManageGlobal = currentUser?.role === 'Admin';
  const isFaculty = currentUser?.role === 'Faculty';

  const canEditResource = (dept: DepartmentCode) => {
    if (canManageGlobal) return true;
    if (isFaculty && currentUser?.department === dept) return true;
    return false;
  };

  const [formState, setFormState] = useState<{
    name: string;
    type: ResourceType;
    buildingId: BuildingId;
    floor: string;
    capacity: number;
    status: ResourceBookingStatus;
    allocatedTo: string;
    equipmentSummary: string;
  }>({
    name: '',
    type: 'Classroom',
    buildingId: 'main-engineering',
    floor: 'Floor 2',
    capacity: 60,
    status: 'Available',
    allocatedTo: 'Unassigned',
    equipmentSummary: '',
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campusState.resources.filter((r) => {
      if (typeFilter !== 'All' && r.type !== typeFilter) return false;
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (buildingFilter !== 'All' && r.buildingId !== buildingFilter) return false;
      if (
        q &&
        !r.name.toLowerCase().includes(q) &&
        !r.department.toLowerCase().includes(q) &&
        !r.equipmentSummary.toLowerCase().includes(q) &&
        !r.allocatedTo.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [campusState.resources, search, typeFilter, statusFilter, buildingFilter]);

  const openAddModal = () => {
    const defaultBuilding =
      (isFaculty &&
        campusState.buildings.find((b) => b.department === currentUser?.department)) ||
      campusState.buildings[0];

    setEditing(null);
    setFormState({
      name: '',
      type: 'Classroom',
      buildingId: defaultBuilding.id,
      floor: 'Floor 1',
      capacity: 60,
      status: 'Available',
      allocatedTo: 'Unassigned',
      equipmentSummary: '4K Projector · Smart Podium',
    });
    setModalOpen(true);
  };

  const openEditModal = (res: CampusResource) => {
    setEditing(res);
    setFormState({
      name: res.name,
      type: res.type,
      buildingId: res.buildingId,
      floor: res.floor,
      capacity: res.capacity,
      status: res.status,
      allocatedTo: res.allocatedTo,
      equipmentSummary: res.equipmentSummary,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return;
    const b =
      campusState.buildings.find((item) => item.id === formState.buildingId) ||
      campusState.buildings[0];

    if (editing) {
      onUpdateResource(editing.id, {
        ...formState,
        buildingName: b.name,
        department: b.department,
      });
    } else {
      onAddResource({
        ...formState,
        buildingName: b.name,
        department: b.department,
      });
    }
    setModalOpen(false);
  };

  const counts = useMemo(() => {
    return {
      total: campusState.resources.length,
      available: campusState.resources.filter((r) => r.status === 'Available').length,
      inUse: campusState.resources.filter((r) => r.status === 'In Use').length,
      reserved: campusState.resources.filter((r) => r.status === 'Reserved').length,
    };
  }, [campusState.resources]);

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Campus Resource Management
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {isFaculty
              ? `Department access active: you may manage resources inside ${currentUser?.department} Block.`
              : currentUser?.role === 'Student'
                ? 'Browse campus rooms and labs, or launch Lab & Slot Bookings to reserve a test slot.'
                : 'Track classrooms, laboratories, projectors, workstation clusters, and allocation status.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('bookings')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>Book Lab Slot</span>
          </button>
          {(canManageGlobal || isFaculty) && (
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>Add Resource</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="text-xs text-slate-400">Tracked Assets</div>
          <div className="mt-1 font-mono text-2xl font-bold text-white tabular-nums">
            {counts.total}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="text-xs text-slate-400">Available Now</div>
          <div className="mt-1 font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {counts.available}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="text-xs text-slate-400">In Active Use</div>
          <div className="mt-1 font-mono text-2xl font-bold text-cyan-300 tabular-nums">
            {counts.inUse}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="text-xs text-slate-400">Reserved</div>
          <div className="mt-1 font-mono text-2xl font-bold text-amber-300 tabular-nums">
            {counts.reserved}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
        <div className="flex min-w-[220px] flex-1 items-center rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by room name, department, equipment..."
            className="ml-2 w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <select
          aria-label="Filter by resource type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as 'All' | ResourceType)}
          className="rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="All">All Types</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by building"
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value as 'All' | BuildingId)}
          className="rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="All">All Blocks</option>
          {campusState.buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.shortName} ({b.department})
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by booking status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All' | ResourceBookingStatus)}
          className="rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Resource Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-[#09152d]">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-slate-300">No resources match the active filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setTypeFilter('All');
                setStatusFilter('All');
                setBuildingFilter('All');
              }}
              className="mt-3 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-cyan-300 hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0b1935] text-slate-400">
                  <th className="px-4 py-3 font-medium">Resource Name</th>
                  <th className="px-4 py-3 font-medium">Dept / Type</th>
                  <th className="px-4 py-3 font-medium">Building &amp; Floor</th>
                  <th className="px-4 py-3 font-medium text-right">Capacity</th>
                  <th className="px-4 py-3 font-medium">Allocation</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((res) => {
                  const editable = canEditResource(res.department);
                  return (
                    <tr key={res.id} className="hover:bg-[#0d1d3d] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{res.name}</div>
                        <div className="mt-0.5 text-[11px] text-slate-400">{res.equipmentSummary}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                        <span className="font-mono text-cyan-300">{res.department}</span> · {res.type}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div>{res.buildingName}</div>
                        <div className="text-[11px] text-slate-400">{res.floor}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-200">
                        {res.capacity}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{res.allocatedTo}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${
                            res.status === 'Available'
                              ? 'bg-emerald-950/70 text-emerald-300'
                              : res.status === 'In Use'
                                ? 'bg-cyan-950/70 text-cyan-300'
                                : res.status === 'Reserved'
                                  ? 'bg-amber-950/70 text-amber-300'
                                  : 'bg-rose-950/70 text-rose-300'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {(res.type === 'Laboratory' || res.type === 'Seminar Hall') && (
                            <button
                              type="button"
                              onClick={() => onNavigate('bookings')}
                              className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-300 hover:bg-cyan-500/20"
                            >
                              Book Slot
                            </button>
                          )}
                          {editable ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateResource(res.id, {
                                    status: res.status === 'Available' ? 'Reserved' : 'Available',
                                    allocatedTo:
                                      res.status === 'Available' ? 'Dept. Booking' : 'Unassigned',
                                  })
                                }
                                className="rounded border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-cyan-500/40"
                              >
                                {res.status === 'Available' ? 'Reserve' : 'Release'}
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(res)}
                                aria-label={`Edit ${res.name}`}
                                className="rounded border border-slate-700 p-1 text-slate-300 hover:text-white"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              {canManageGlobal && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteResource(res.id)}
                                  aria-label={`Delete ${res.name}`}
                                  className="rounded border border-slate-700 p-1 text-rose-400 hover:bg-rose-950/50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-500">
                              {isFaculty ? `${res.department} Only` : 'View Only'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Resource Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-[#081329] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display text-lg font-semibold text-white">
                {editing ? 'Edit Campus Resource' : 'Add Campus Resource'}
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
                <label className="block font-medium text-slate-300">Resource Name</label>
                <input
                  required
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Smart Lecture Hall CSE-105"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300">Resource Type</label>
                  <select
                    value={formState.type}
                    onChange={(e) =>
                      setFormState({ ...formState, type: e.target.value as ResourceType })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {RESOURCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300">Building</label>
                  <select
                    disabled={isFaculty}
                    value={formState.buildingId}
                    onChange={(e) =>
                      setFormState({ ...formState, buildingId: e.target.value as BuildingId })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white disabled:opacity-60"
                  >
                    {campusState.buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-300">Floor</label>
                  <input
                    type="text"
                    value={formState.floor}
                    onChange={(e) => setFormState({ ...formState, floor: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={formState.capacity}
                    onChange={(e) =>
                      setFormState({ ...formState, capacity: Number(e.target.value) || 1 })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300">Status</label>
                  <select
                    value={formState.status}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        status: e.target.value as ResourceBookingStatus,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300">Allocated Department / User</label>
                <input
                  type="text"
                  value={formState.allocatedTo}
                  onChange={(e) => setFormState({ ...formState, allocatedTo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300">Equipment Summary</label>
                <input
                  type="text"
                  value={formState.equipmentSummary}
                  onChange={(e) =>
                    setFormState({ ...formState, equipmentSummary: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0c1a36] px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  {editing ? 'Save Changes' : 'Create Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
