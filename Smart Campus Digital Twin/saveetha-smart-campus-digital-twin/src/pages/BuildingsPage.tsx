import React, { useState } from 'react';
import { ArrowRight, Box, Building2, CheckCircle2, Layers, Zap } from 'lucide-react';
import type { BuildingId, CampusState, PageId } from '../types/campus';

interface BuildingsPageProps {
  campusState: CampusState;
  initialBuildingId: BuildingId | null;
  onNavigate: (page: PageId, buildingId?: BuildingId) => void;
}

export const BuildingsPage: React.FC<BuildingsPageProps> = ({
  campusState,
  initialBuildingId,
  onNavigate,
}) => {
  const [selectedId, setSelectedId] = useState<BuildingId>(
    initialBuildingId || campusState.buildings[0].id
  );

  const active =
    campusState.buildings.find((b) => b.id === selectedId) || campusState.buildings[0];

  const buildingResources = campusState.resources.filter((r) => r.buildingId === active.id);
  const buildingMaintenance = campusState.maintenance.filter((m) => m.buildingId === active.id);

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Saveetha Campus Building Directory
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Facility capacity, classrooms, laboratories, faculty rooms, availability, and utilization across CSE, ECE, EEE, SAIL, and Admin blocks.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('explorer', active.id)}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors whitespace-nowrap"
        >
          <Box className="h-4 w-4" />
          <span>Inspect {active.shortName} in 3D</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-4">
          {campusState.buildings.map((b) => {
            const isActive = b.id === active.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedId(b.id)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  isActive
                    ? 'border-cyan-500/60 bg-[#0d1f42]'
                    : 'border-slate-800/90 bg-[#09152d] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-cyan-400">
                    {b.department} Dept · {b.category}
                  </span>
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    ~{b.floors}F
                  </span>
                </div>
                <div className="mt-1 font-display text-base font-semibold text-white">
                  {b.name}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300 tabular-nums">
                  <span>{b.occupancyPercent}% Util.</span>
                  <span className="text-slate-600">·</span>
                  <span>{b.availableClassrooms}/{b.classrooms} Class</span>
                  <span className="text-slate-600">·</span>
                  <span>{b.activeLaboratories}/{b.laboratories} Labs</span>
                  <span className="text-slate-600">·</span>
                  <span>{b.availableFacultyRooms}/{b.facultyRooms} Faculty</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-6 rounded-xl border border-slate-800/90 bg-[#09152d] p-6 lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-400">
                <Building2 className="h-4 w-4" />
                <span>
                  {active.department} Department · {active.category}
                </span>
              </div>
              <h3 className="mt-1 font-display text-2xl font-bold text-white">{active.name}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                {active.architecturalNotes}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('explorer', active.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors whitespace-nowrap"
            >
              <span>Locate in 3D</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-lg border border-slate-800 bg-[#0c1a36] p-3">
              <div className="text-[11px] text-slate-400">Classrooms</div>
              <div className="mt-1 font-mono text-lg font-bold text-white tabular-nums">
                {active.availableClassrooms}/{active.classrooms}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0c1a36] p-3">
              <div className="text-[11px] text-slate-400">Laboratories</div>
              <div className="mt-1 font-mono text-lg font-bold text-white tabular-nums">
                {active.activeLaboratories}/{active.laboratories}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0c1a36] p-3">
              <div className="text-[11px] text-slate-400">Faculty Rooms</div>
              <div className="mt-1 font-mono text-lg font-bold text-white tabular-nums">
                {active.availableFacultyRooms}/{active.facultyRooms}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0c1a36] p-3">
              <div className="text-[11px] text-slate-400">Seat Capacity</div>
              <div className="mt-1 font-mono text-lg font-bold text-white tabular-nums">
                {active.totalCapacity.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0c1a36] p-3">
              <div className="text-[11px] text-slate-400">Utilization</div>
              <div className="mt-1 font-mono text-lg font-bold text-cyan-300 tabular-nums">
                {active.occupancyPercent}%
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0c1a36] p-3">
              <div className="text-[11px] text-slate-400">Daily Energy</div>
              <div className="mt-1 font-mono text-lg font-bold text-white tabular-nums">
                {active.energyConsumptionKwh.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Building Facilities</span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                {active.facilities.map((fac) => (
                  <li key={fac} className="flex items-center gap-2 rounded-md border border-slate-800/70 bg-[#0c1a36] px-3 py-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span>Available Resources &amp; Sustainability</span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                {active.availableResources.map((res) => (
                  <li key={res} className="rounded-md border border-slate-800/70 bg-[#0c1a36] px-3 py-2 font-mono">
                    {res}
                  </li>
                ))}
                <li className="rounded-md border border-emerald-500/25 bg-emerald-950/30 px-3 py-2 font-mono text-emerald-300">
                  Solar Offset: {active.solarOffsetKwh} kWh/day · Efficiency {active.efficiencyRating}
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-slate-800 pt-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-[#0c1a36] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  Tracked Rooms &amp; Labs ({buildingResources.length})
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('bookings')}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Book Lab Slot →
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0c1a36] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  Maintenance Work Orders ({buildingMaintenance.length})
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('maintenance', active.id)}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  View Tickets →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
