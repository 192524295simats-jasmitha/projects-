import React from 'react';
import {
  Building2,
  CalendarPlus,
  CheckCircle2,
  ExternalLink,
  Focus,
  Layers,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import type { CampusBuilding, PageId } from '../types/campus';

interface BuildingInspectorPanelProps {
  building: CampusBuilding;
  onClose: () => void;
  onZoomToBuilding: (building: CampusBuilding) => void;
  onNavigate: (page: PageId, buildingId?: CampusBuilding['id']) => void;
}

export const BuildingInspectorPanel: React.FC<BuildingInspectorPanelProps> = ({
  building,
  onClose,
  onZoomToBuilding,
  onNavigate,
}) => {
  const statusTone =
    building.maintenanceStatus === 'Operational'
      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/60'
      : building.maintenanceStatus === 'Scheduled Inspection'
        ? 'text-amber-300 border-amber-500/30 bg-amber-950/60'
        : 'text-rose-300 border-rose-500/30 bg-rose-950/60';

  return (
    <aside
      aria-label="Selected Building Inspector"
      className="flex h-full w-full max-w-[390px] flex-col border-l border-cyan-500/20 bg-[#081329]/95 text-slate-100 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800/90 px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-cyan-400">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {building.department} Dept · {building.category}
            </span>
          </div>
          <h2 className="mt-1 font-display text-lg font-semibold leading-snug text-white">
            {building.name}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            ~{building.floors} Floors · Total Cap {building.totalCapacity.toLocaleString()} · Rating{' '}
            {building.efficiencyRating}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close building panel"
          className="rounded-lg border border-slate-700/80 p-1.5 text-slate-400 hover:border-cyan-500/40 hover:text-white transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
        {/* Status & Zoom */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${statusTone}`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>{building.maintenanceStatus}</span>
          </span>
          <button
            type="button"
            onClick={() => onZoomToBuilding(building)}
            className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/35 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 transition-colors whitespace-nowrap"
          >
            <Focus className="h-3.5 w-3.5" />
            <span>Zoom Camera</span>
          </button>
        </div>

        {/* Facility Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-800 bg-[#0d1c3a] p-3">
            <div className="text-[11px] text-slate-400">Utilization</div>
            <div className="mt-1 font-mono text-xl font-semibold text-white tabular-nums">
              {building.occupancyPercent}%
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{ width: `${building.occupancyPercent}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#0d1c3a] p-3">
            <div className="text-[11px] text-slate-400">Daily Energy Load</div>
            <div className="mt-1 flex items-baseline gap-1 font-mono text-xl font-semibold text-cyan-300 tabular-nums">
              <span>{building.energyConsumptionKwh.toLocaleString()}</span>
              <span className="text-xs font-normal text-slate-400">kWh</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <Zap className="h-3 w-3 shrink-0" />
              <span>-{building.solarOffsetKwh} kWh solar</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#0d1c3a] p-3">
            <div className="text-[11px] text-slate-400">Classrooms Open</div>
            <div className="mt-1 font-mono text-lg font-semibold text-white tabular-nums">
              {building.availableClassrooms}{' '}
              <span className="text-xs font-normal text-slate-400">/ {building.classrooms}</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#0d1c3a] p-3">
            <div className="text-[11px] text-slate-400">Active Labs</div>
            <div className="mt-1 font-mono text-lg font-semibold text-white tabular-nums">
              {building.activeLaboratories}{' '}
              <span className="text-xs font-normal text-slate-400">/ {building.laboratories}</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#0d1c3a] p-3">
            <div className="text-[11px] text-slate-400">Faculty Rooms Open</div>
            <div className="mt-1 font-mono text-lg font-semibold text-white tabular-nums">
              {building.availableFacultyRooms}{' '}
              <span className="text-xs font-normal text-slate-400">/ {building.facultyRooms}</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#0d1c3a] p-3">
            <div className="text-[11px] text-slate-400">Total Rooms Free</div>
            <div className="mt-1 font-mono text-lg font-semibold text-emerald-300 tabular-nums">
              {building.availableRooms}{' '}
              <span className="text-xs font-normal text-slate-400">/ {building.totalRooms}</span>
            </div>
          </div>
        </div>

        {/* Architectural Summary */}
        <div>
          <h3 className="text-xs font-semibold text-slate-300">Architectural Notes</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
            {building.architecturalNotes}
          </p>
        </div>

        {/* Available Facilities */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>Key Facilities</span>
          </div>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
            {building.facilities.map((fac) => (
              <li
                key={fac}
                className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 last:border-none"
              >
                <span>{fac}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Available Resources */}
        <div>
          <h3 className="text-xs font-semibold text-slate-300">Available Resources</h3>
          <div className="mt-2 grid grid-cols-1 gap-1.5">
            {building.availableResources.map((res) => (
              <div
                key={res}
                className="rounded-md border border-slate-800 bg-[#0d1c3a]/70 px-3 py-2 text-xs text-slate-200 font-mono"
              >
                {res}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="space-y-2 border-t border-slate-800/90 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('bookings')}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors whitespace-nowrap"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            <span>Book Lab Slot</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('maintenance', building.id)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-[#0d1c3a] px-3 py-2 text-xs font-medium text-slate-200 hover:border-cyan-500/40 hover:text-white transition-colors whitespace-nowrap"
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Report Issue</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('buildings', building.id)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-[#0a162e] px-3 py-1.5 text-xs font-medium text-cyan-300 hover:border-cyan-500/40 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Full Building Profile</span>
        </button>
      </div>
    </aside>
  );
};
