import React, { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Box, Car, Zap } from 'lucide-react';
import type { BuildingId, CampusState, PageId, ParkingZone } from '../types/campus';

interface ParkingPageProps {
  campusState: CampusState;
  onToggleSlot: (slotId: string) => void;
  onSimulateTraffic: (action: 'entry' | 'exit') => void;
  onNavigate: (page: PageId, buildingId?: BuildingId) => void;
}

const ZONES: Array<'All' | ParkingZone> = [
  'All',
  'Zone A · Faculty',
  'Zone B · Student',
  'Zone C · Visitor & EV',
];

export const ParkingPage: React.FC<ParkingPageProps> = ({
  campusState,
  onToggleSlot,
  onSimulateTraffic,
  onNavigate,
}) => {
  const [zoneFilter, setZoneFilter] = useState<'All' | ParkingZone>('All');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(campusState.parking[0]?.id || null);

  const stats = useMemo(() => {
    const total = campusState.parking.length;
    const occupied = campusState.parking.filter((p) => p.occupied).length;
    const available = total - occupied;
    const evAvailable = campusState.parking.filter((p) => p.evCharger && !p.occupied).length;
    return { total, occupied, available, evAvailable };
  }, [campusState.parking]);

  const visibleSlots = useMemo(() => {
    if (zoneFilter === 'All') return campusState.parking;
    return campusState.parking.filter((p) => p.zone === zoneFilter);
  }, [campusState.parking, zoneFilter]);

  const selectedSlot = campusState.parking.find((p) => p.id === selectedSlotId) || null;

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Smart Campus Parking Management
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Live bay status synchronized directly with the 3D foreground parking lot in front of the Main Engineering Block.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSimulateTraffic('entry')}
            disabled={stats.available === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 disabled:opacity-40 transition-colors"
          >
            <ArrowDownLeft className="h-3.5 w-3.5" />
            <span>Simulate Vehicle Entry</span>
          </button>
          <button
            type="button"
            onClick={() => onSimulateTraffic('exit')}
            disabled={stats.occupied === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40 transition-colors"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Simulate Vehicle Exit</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('explorer')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            <Box className="h-3.5 w-3.5" />
            <span>View in 3D</span>
          </button>
        </div>
      </div>

      {/* Capacity Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="text-xs text-slate-400">Total Parking Capacity</div>
          <div className="mt-1 font-mono text-2xl font-bold text-white tabular-nums">
            {stats.total} Bays
          </div>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-[#09152d] p-4">
          <div className="text-xs text-emerald-300">Available Spaces</div>
          <div className="mt-1 font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {stats.available} Free
          </div>
        </div>
        <div className="rounded-xl border border-rose-500/30 bg-[#09152d] p-4">
          <div className="text-xs text-rose-300">Occupied Spaces</div>
          <div className="mt-1 font-mono text-2xl font-bold text-rose-400 tabular-nums">
            {stats.occupied} Parked
          </div>
        </div>
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="text-xs text-slate-400">EV Charging Bays Open</div>
          <div className="mt-1 font-mono text-2xl font-bold text-cyan-300 tabular-nums">
            {stats.evAvailable} / 6
          </div>
        </div>
      </div>

      {/* Zone Tabs & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/90 bg-[#09152d] p-3">
        <div className="flex flex-wrap items-center gap-1">
          {ZONES.map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => setZoneFilter(z)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                zoneFilter === z
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {z}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 px-2 text-xs">
          <span className="inline-flex items-center gap-1.5 text-emerald-300 font-medium">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            <span>Available</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-rose-300 font-medium">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
            <span>Occupied</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-cyan-300 font-medium">
            <Zap className="h-3.5 w-3.5" />
            <span>EV Bay</span>
          </span>
        </div>
      </div>

      {/* Interactive Parking Grid + Slot Inspector */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 lg:col-span-8">
          <div className="mb-3 text-xs text-slate-400">
            Click any bay below to toggle vehicle occupancy (updates 3D parking lot immediately).
          </div>
          <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8">
            {visibleSlots.map((slot) => {
              const isSelected = slot.id === selectedSlotId;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => {
                    setSelectedSlotId(slot.id);
                    onToggleSlot(slot.id);
                  }}
                  className={`flex flex-col items-center justify-between rounded-lg border p-2.5 text-center transition-colors ${
                    slot.occupied
                      ? 'border-rose-500/45 bg-rose-950/45 text-rose-200 hover:bg-rose-950/70'
                      : 'border-emerald-500/45 bg-emerald-950/40 text-emerald-200 hover:bg-emerald-950/70'
                  } ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}
                >
                  <div className="flex w-full items-center justify-between text-[10px] font-mono font-semibold">
                    <span>{slot.code}</span>
                    {slot.evCharger && <Zap className="h-3 w-3 text-cyan-300" />}
                  </div>
                  <Car className="my-1.5 h-4 w-4" />
                  <span className="text-[10px] font-medium">
                    {slot.occupied ? 'Occupied' : 'Available'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Bay Detail */}
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 lg:col-span-4">
          <h3 className="font-display text-base font-semibold text-white border-b border-slate-800 pb-3">
            Parking Bay Inspector
          </h3>
          {selectedSlot ? (
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bay Code</span>
                <span className="font-mono text-base font-bold text-white">{selectedSlot.code}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Zone</span>
                <span className="text-slate-200">{selectedSlot.zone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current State</span>
                <span
                  className={`font-semibold ${
                    selectedSlot.occupied ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {selectedSlot.occupied ? 'Occupied' : 'Available'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">EV Charger</span>
                <span className="text-cyan-300">
                  {selectedSlot.evCharger ? 'AC Type-2 Installed' : 'Standard Bay'}
                </span>
              </div>
              {selectedSlot.occupied && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Vehicle Type</span>
                    <span className="text-slate-200">{selectedSlot.vehicleType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Plate (Simulated)</span>
                    <span className="font-mono text-slate-200">{selectedSlot.vehiclePlate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Check-In Time</span>
                    <span className="font-mono text-slate-200">{selectedSlot.entryTime}</span>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => onToggleSlot(selectedSlot.id)}
                className="mt-4 w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                {selectedSlot.occupied ? 'Mark Bay Available (Exit)' : 'Park Vehicle Here (Entry)'}
              </button>
            </div>
          ) : (
            <p className="mt-4 text-xs text-slate-400">Select any parking slot to inspect details.</p>
          )}
        </div>
      </div>
    </div>
  );
};
