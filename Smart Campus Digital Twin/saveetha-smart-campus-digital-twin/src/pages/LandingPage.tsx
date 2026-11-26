import React, { useState } from 'react';
import {
  ArrowRight,
  Box,
  Building2,
  Car,
  Compass,
  Layers,
  Wrench,
  Zap,
} from 'lucide-react';
import { CampusCanvas, type CameraPresetCommand } from '../components/three/CampusCanvas';
import type { BuildingId, CampusState, PageId } from '../types/campus';

interface LandingPageProps {
  campusState: CampusState;
  onNavigate: (page: PageId, buildingId?: BuildingId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ campusState, onNavigate }) => {
  const [selectedId, setSelectedId] = useState<BuildingId | null>('main-engineering');
  const [hoveredId, setHoveredId] = useState<BuildingId | null>(null);
  const [cameraCmd, setCameraCmd] = useState<CameraPresetCommand | null>(null);

  const totalClassrooms = campusState.buildings.reduce((s, b) => s + b.classrooms, 0);
  const availableClassrooms = campusState.buildings.reduce((s, b) => s + b.availableClassrooms, 0);
  const activeLabs = campusState.buildings.reduce((s, b) => s + b.activeLaboratories, 0);
  const totalEnergy = campusState.buildings.reduce((s, b) => s + b.energyConsumptionKwh, 0);
  const freeParking = campusState.parking.filter((p) => !p.occupied).length;
  const openMaintenance = campusState.maintenance.filter((m) => m.status !== 'Completed').length;

  const focusBuildingPreview = (id: BuildingId) => {
    setSelectedId(id);
    const b = campusState.buildings.find((item) => item.id === id);
    if (b) {
      setCameraCmd({
        id: Date.now(),
        position: b.cameraPosition,
        target: b.cameraTarget,
      });
    }
  };

  return (
    <div className="min-h-full bg-[#060d1f] text-slate-100">
      {/* Hero Section with Large Interactive 3D Campus Preview */}
      <section className="mx-auto max-w-[1440px] px-5 pt-6 pb-8 lg:px-8 lg:pt-8">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* Left Editorial Summary */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#09152d] p-6 lg:col-span-5 lg:p-8">
            <div>
              <p className="text-xs font-medium text-cyan-400">
                Saveetha Engineering College · Smart Campus Initiative
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl [text-wrap:balance]">
                Interactive 3D Digital Twin for Campus Operations
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Explore a conceptual 3D spatial twin of the Saveetha Engineering College campus—featuring the signature circular lattice engineering complex, Health Sciences tower, Academic rotunda, R&amp;D labs, and live smart parking infrastructure.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('explorer')}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition-colors whitespace-nowrap"
                >
                  <Box className="h-4 w-4" />
                  <span>Explore 3D Campus</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0d1c3a] px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-cyan-500/40 hover:text-white transition-colors whitespace-nowrap"
                >
                  <span>Operations Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('bookings')}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20 transition-colors whitespace-nowrap"
                >
                  <span>Book Lab Slot</span>
                </button>
              </div>
            </div>

            {/* Quick Interactive Focus Selectors */}
            <div className="mt-8 border-t border-slate-800/80 pt-5">
              <div className="text-xs font-semibold text-slate-400">
                Preview Campus Landmark in 3D
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {campusState.buildings.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => focusBuildingPreview(b.id)}
                    className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      selectedId === b.id
                        ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-300'
                        : 'border-slate-800 bg-[#0d1c3a] text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {b.shortName}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                {campusState.conceptualNotice}
              </p>
            </div>
          </div>

          {/* Right Live Interactive 3D Viewport */}
          <div className="relative h-[420px] overflow-hidden rounded-xl border border-cyan-500/25 bg-[#081329] lg:col-span-7 lg:h-auto lg:min-h-[480px]">
            <CampusCanvas
              buildings={campusState.buildings}
              parking={campusState.parking}
              selectedBuildingId={selectedId}
              hoveredBuildingId={hoveredId}
              showEnergyOverlay={false}
              showParkingOverlay={false}
              autoRotate
              cameraCommand={cameraCmd}
              onSelectBuilding={(id) => focusBuildingPreview(id)}
              onFocusBuilding={(id) => onNavigate('explorer', id)}
              onHoverBuilding={setHoveredId}
            />

            {/* Minimal Non-Obstructive Overlay Action */}
            <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
              <div className="pointer-events-auto rounded-lg border border-slate-700/80 bg-[#071124]/92 px-3 py-1.5 text-xs text-slate-300">
                Drag to orbit · Scroll to zoom · Click building to focus
              </div>
              <button
                type="button"
                onClick={() => onNavigate('explorer', selectedId || undefined)}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-[#071124]/95 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors whitespace-nowrap"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Open Fullscreen 3D</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column KPI Strip */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => onNavigate('buildings')}
            className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 text-left hover:border-cyan-500/35 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Major Campus Blocks</span>
              <Building2 className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
              {campusState.buildings.length} Blocks
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono tabular-nums">
              {availableClassrooms} / {totalClassrooms} Classrooms Open
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('resources')}
            className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 text-left hover:border-cyan-500/35 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Laboratories</span>
              <Layers className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
              {activeLabs} Active
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Computing · Robotics · Clinical Labs
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('energy')}
            className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 text-left hover:border-cyan-500/35 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Simulated Energy Load</span>
              <Zap className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-cyan-300 tabular-nums">
              {totalEnergy.toLocaleString()} kWh
            </div>
            <div className="mt-1 text-xs text-emerald-400">
              Rooftop Solar Generation Integrated
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('parking')}
            className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 text-left hover:border-cyan-500/35 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Smart Parking &amp; Ops</span>
              <Car className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
              {freeParking} / {campusState.parking.length} Free
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <Wrench className="h-3.5 w-3.5 text-amber-400" />
              <span>{openMaintenance} Active Work Orders</span>
            </div>
          </button>
        </div>
      </section>

      {/* Campus Architecture Showcase Section */}
      <section className="mx-auto max-w-[1440px] px-5 pb-12 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-white">
              Modeled Saveetha Campus Structures
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Select any structure to launch the 3D Explorer directly at that building.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('buildings')}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View All Building Specs →
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campusState.buildings.map((building) => (
            <div
              key={building.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#09152d] p-5 hover:border-cyan-500/35 transition-colors"
            >
              <div>
                <div className="text-xs text-cyan-400">{building.category}</div>
                <h4 className="mt-1 font-display text-base font-semibold text-white">
                  {building.name}
                </h4>
                <div className="mt-1 text-xs text-slate-400 font-mono">
                  ~{building.floors} Floors · {building.totalRooms} Rooms · {building.occupancyPercent}% Occupancy
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-300">
                  {building.architecturalNotes}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-800/70 pt-3">
                <span className="text-xs font-mono text-slate-400">
                  {building.energyConsumptionKwh.toLocaleString()} kWh/day
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('explorer', building.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  <span>Inspect in 3D</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
