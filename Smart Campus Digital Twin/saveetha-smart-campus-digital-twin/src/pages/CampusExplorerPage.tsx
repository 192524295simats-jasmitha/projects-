import React, { useEffect, useRef, useState } from 'react';
import {
  Car,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  Zap,
} from 'lucide-react';
import { BuildingInspectorPanel } from '../components/BuildingInspectorPanel';
import { CampusCanvas, type CameraPresetCommand } from '../components/three/CampusCanvas';
import type { BuildingId, CampusBuilding, CampusState, PageId } from '../types/campus';

interface CampusExplorerPageProps {
  campusState: CampusState;
  initialBuildingId: BuildingId | null;
  onNavigate: (page: PageId, buildingId?: BuildingId) => void;
  onToggleParkingSlot: (slotId: string) => void;
}

const DEFAULT_PERSPECTIVE: { position: [number, number, number]; target: [number, number, number] } = {
  position: [0, 44, 86],
  target: [2, 2, 4],
};

const AERIAL_TOPDOWN: { position: [number, number, number]; target: [number, number, number] } = {
  position: [0, 108, 12],
  target: [2, 0, -2],
};

const PARKING_FOCUS: { position: [number, number, number]; target: [number, number, number] } = {
  position: [0, 26, 70],
  target: [0, 1, 42],
};

export const CampusExplorerPage: React.FC<CampusExplorerPageProps> = ({
  campusState,
  initialBuildingId,
  onNavigate,
  onToggleParkingSlot,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<BuildingId | null>(initialBuildingId);
  const [hoveredId, setHoveredId] = useState<BuildingId | null>(null);
  const [cameraMode, setCameraMode] = useState<'perspective' | 'aerial' | 'parking'>('perspective');
  const [autoRotate, setAutoRotate] = useState(false);
  const [showEnergyOverlay, setShowEnergyOverlay] = useState(false);
  const [showParkingOverlay, setShowParkingOverlay] = useState(true);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraCmd, setCameraCmd] = useState<CameraPresetCommand | null>(null);
  const [parkingToast, setParkingToast] = useState<string | null>(null);

  useEffect(() => {
    if (initialBuildingId) {
      setSelectedId(initialBuildingId);
      const b = campusState.buildings.find((item) => item.id === initialBuildingId);
      if (b) {
        setCameraCmd({
          id: Date.now(),
          position: b.cameraPosition,
          target: b.cameraTarget,
        });
      }
    }
  }, [initialBuildingId, campusState.buildings]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const selectedBuilding: CampusBuilding | null =
    campusState.buildings.find((b) => b.id === selectedId) || null;

  const issueCameraCommand = (
    position: [number, number, number],
    target: [number, number, number]
  ) => {
    setCameraCmd({ id: Date.now() + Math.random(), position, target });
  };

  const handleResetCamera = () => {
    setCameraMode('perspective');
    setAutoRotate(false);
    issueCameraCommand(DEFAULT_PERSPECTIVE.position, DEFAULT_PERSPECTIVE.target);
  };

  const handleAerialView = () => {
    setCameraMode('aerial');
    setAutoRotate(false);
    issueCameraCommand(AERIAL_TOPDOWN.position, AERIAL_TOPDOWN.target);
  };

  const handleParkingView = () => {
    setCameraMode('parking');
    setShowParkingOverlay(true);
    setAutoRotate(false);
    issueCameraCommand(PARKING_FOCUS.position, PARKING_FOCUS.target);
  };

  const handleFocusBuilding = (id: BuildingId) => {
    setSelectedId(id);
    const b = campusState.buildings.find((item) => item.id === id);
    if (b) {
      setAutoRotate(false);
      issueCameraCommand(b.cameraPosition, b.cameraTarget);
    }
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleParkingClick = (slotId: string) => {
    const slot = campusState.parking.find((p) => p.id === slotId);
    onToggleParkingSlot(slotId);
    if (slot) {
      setParkingToast(
        `Parking Bay ${slot.code} (${slot.zone}) marked ${slot.occupied ? 'Available' : 'Occupied'}`
      );
      setTimeout(() => setParkingToast(null), 2600);
    }
  };

  const freeSlots = campusState.parking.filter((p) => !p.occupied).length;

  return (
    <div ref={containerRef} className="relative flex h-full w-full overflow-hidden bg-[#081329]">
      {/* Unobstructed 3D Viewport */}
      <div className="relative flex-1 overflow-hidden">
        <CampusCanvas
          buildings={campusState.buildings}
          parking={campusState.parking}
          selectedBuildingId={selectedId}
          hoveredBuildingId={hoveredId}
          showEnergyOverlay={showEnergyOverlay}
          showParkingOverlay={showParkingOverlay}
          autoRotate={autoRotate}
          cameraCommand={cameraCmd}
          onSelectBuilding={(id) => setSelectedId(id)}
          onFocusBuilding={handleFocusBuilding}
          onHoverBuilding={setHoveredId}
          onSelectParkingSlot={handleParkingClick}
          onClearSelection={() => setSelectedId(null)}
        />

        {/* Minimal Top-Left Context Bar */}
        <div className="pointer-events-none absolute left-4 top-4 right-4 flex flex-wrap items-center justify-between gap-2">
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-700/80 bg-[#071124]/92 px-3 py-1.5">
            <span className="text-xs font-semibold text-white">Saveetha Campus 3D</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-300 font-mono tabular-nums">
              {freeSlots}/{campusState.parking.length} Parking Free
            </span>
          </div>

          {parkingToast && (
            <div className="pointer-events-auto rounded-lg border border-cyan-500/40 bg-[#071124]/95 px-3 py-1.5 text-xs font-medium text-cyan-200 shadow-lg">
              {parkingToast}
            </div>
          )}
        </div>

        {/* Collapsible Unified Bottom Control Dock */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex flex-col items-center px-3">
          <button
            type="button"
            onClick={() => setHudCollapsed((c) => !c)}
            className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 rounded-md border border-slate-700/80 bg-[#071124]/95 px-3 py-1 text-[11px] font-medium text-slate-300 hover:border-cyan-500/40 hover:text-white transition-colors"
          >
            {hudCollapsed ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Show Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                <span>Hide Controls</span>
              </>
            )}
          </button>

          {!hudCollapsed && (
            <div className="pointer-events-auto flex max-w-[94vw] flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-[#071124]/95 px-3.5 py-2.5 shadow-2xl">
              {/* Camera Presets */}
              <div className="flex items-center gap-1 rounded-lg bg-[#0d1c3a] p-1">
                <button
                  type="button"
                  onClick={handleResetCamera}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    cameraMode === 'perspective'
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Perspective</span>
                </button>
                <button
                  type="button"
                  onClick={handleAerialView}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    cameraMode === 'aerial'
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Aerial Top-Down</span>
                </button>
                <button
                  type="button"
                  onClick={handleParkingView}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    cameraMode === 'parking'
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Car className="h-3.5 w-3.5" />
                  <span>Parking Lot</span>
                </button>
              </div>

              <div className="hidden h-5 w-px bg-slate-700/80 sm:block" />

              {/* Building Jump Dropdown */}
              <select
                aria-label="Focus Campus Building"
                value={selectedId || ''}
                onChange={(e) => {
                  const val = e.target.value as BuildingId;
                  if (val) handleFocusBuilding(val);
                }}
                className="rounded-lg border border-slate-700 bg-[#0d1c3a] px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="">Jump to Building...</option>
                {campusState.buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              {/* Layer Overlays & Camera Utilities */}
              <button
                type="button"
                onClick={() => setShowEnergyOverlay((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  showEnergyOverlay
                    ? 'border-amber-400/50 bg-amber-500/15 text-amber-300'
                    : 'border-slate-700 bg-[#0d1c3a] text-slate-300 hover:text-white'
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Energy Overlay</span>
              </button>

              <button
                type="button"
                onClick={() => setShowParkingOverlay((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  showParkingOverlay
                    ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
                    : 'border-slate-700 bg-[#0d1c3a] text-slate-300 hover:text-white'
                }`}
              >
                <Car className="h-3.5 w-3.5" />
                <span>Parking Status</span>
              </button>

              <button
                type="button"
                onClick={() => setAutoRotate((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  autoRotate
                    ? 'border-cyan-400/60 bg-cyan-500/15 text-cyan-300'
                    : 'border-slate-700 bg-[#0d1c3a] text-slate-300 hover:text-white'
                }`}
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Orbit</span>
              </button>

              <button
                type="button"
                onClick={handleResetCamera}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#0d1c3a] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-cyan-500/40 hover:text-white transition-colors whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Camera</span>
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#0d1c3a] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-cyan-500/40 hover:text-white transition-colors whitespace-nowrap"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>Exit</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Building Details Side Drawer (appears when a building is clicked) */}
      {selectedBuilding && (
        <BuildingInspectorPanel
          building={selectedBuilding}
          onClose={() => setSelectedId(null)}
          onZoomToBuilding={(b) => handleFocusBuilding(b.id)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
