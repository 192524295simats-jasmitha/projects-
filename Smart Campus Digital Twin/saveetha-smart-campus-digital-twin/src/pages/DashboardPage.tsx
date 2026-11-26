import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  Building2,
  CalendarCheck,
  Car,
  CheckSquare,
  FlaskConical,
  School,
  Wrench,
  Zap,
} from 'lucide-react';
import type { BuildingId, CampusState, CampusUser, PageId, TimeframeFilter } from '../types/campus';

interface DashboardPageProps {
  campusState: CampusState;
  currentUser: CampusUser | null;
  onNavigate: (page: PageId, buildingId?: BuildingId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  campusState,
  currentUser,
  onNavigate,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('daily');

  const kpis = useMemo(() => {
    const totalBuildings = campusState.buildings.length;
    const totalClassrooms = campusState.buildings.reduce((s, b) => s + b.classrooms, 0);
    const availableClassrooms = campusState.buildings.reduce((s, b) => s + b.availableClassrooms, 0);
    const activeLaboratories = campusState.buildings.reduce((s, b) => s + b.activeLaboratories, 0);
    const totalLaboratories = campusState.buildings.reduce((s, b) => s + b.laboratories, 0);
    const freeParking = campusState.parking.filter((p) => !p.occupied).length;
    const totalParking = campusState.parking.length;
    const openMaintenance = campusState.maintenance.filter((m) => m.status !== 'Completed').length;
    const totalEnergy = campusState.buildings.reduce((s, b) => s + b.energyConsumptionKwh, 0);
    const avgOccupancy = Math.round(
      campusState.buildings.reduce((s, b) => s + b.occupancyPercent, 0) / totalBuildings
    );

    return {
      totalBuildings,
      totalClassrooms,
      availableClassrooms,
      activeLaboratories,
      totalLaboratories,
      freeParking,
      totalParking,
      openMaintenance,
      totalEnergy,
      avgOccupancy,
    };
  }, [campusState]);

  const myBookings = useMemo(() => {
    if (!currentUser) return [];
    return campusState.bookings.filter(
      (b) => b.userId === currentUser.id && b.status === 'Confirmed'
    );
  }, [campusState.bookings, currentUser]);

  const deptBuilding = useMemo(() => {
    if (!currentUser) return null;
    return campusState.buildings.find((b) => b.department === currentUser.department) || null;
  }, [campusState.buildings, currentUser]);

  const deptMaintenance = useMemo(() => {
    if (!currentUser) return campusState.maintenance;
    if (currentUser.role === 'Admin' || currentUser.role === 'Student') {
      return campusState.maintenance;
    }
    return campusState.maintenance.filter((m) => m.department === currentUser.department);
  }, [campusState.maintenance, currentUser]);

  const seriesData = campusState.energySeries[timeframe];
  const buildingChartData = campusState.buildings.map((b) => ({
    name: b.shortName,
    occupancy: b.occupancyPercent,
    energy: b.energyConsumptionKwh,
    availableRooms: b.availableRooms,
  }));

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 lg:p-8">
      {/* Personalized Role & Department Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cyan-500/25 bg-[#091733] p-5">
        <div>
          <div className="text-xs font-medium text-cyan-400">
            {currentUser
              ? `${currentUser.role} Workspace · ${currentUser.department} Department`
              : 'Campus Operations Overview'}
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            {currentUser ? `Welcome back, ${currentUser.name}` : 'Campus Digital Twin Operations'}
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            {currentUser?.role === 'Student' &&
              `You have ${myBookings.length} active lab/test-slot booking(s). Explore open labs or report campus issues below.`}
            {currentUser?.role === 'Faculty' &&
              `Department-scoped view for ${currentUser.department} Block (${deptBuilding?.availableFacultyRooms ?? 0} faculty rooms open · ${deptMaintenance.filter((m) => m.status !== 'Completed').length} active dept tickets).`}
            {currentUser?.role === 'Maintenance Staff' &&
              `Assigned Maintenance Queue for ${currentUser.department} Block: ${deptMaintenance.filter((m) => m.status !== 'Completed').length} open work order(s).`}
            {(!currentUser || currentUser.role === 'Admin') &&
              'Full campus-wide digital twin telemetry across CSE, ECE, EEE, SAIL, and Admin blocks.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser?.role !== 'Maintenance Staff' && (
            <button
              type="button"
              onClick={() => onNavigate('bookings')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Book Lab Slot</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('maintenance', deptBuilding?.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#0d1c3a] px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-cyan-500/40"
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>
              {currentUser?.role === 'Maintenance Staff' ? 'Open My Dept Queue' : 'Report Issue'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('explorer', deptBuilding?.id)}
            className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
          >
            3D {deptBuilding ? deptBuilding.shortName : 'Campus'}
          </button>
        </div>
      </div>

      {/* Role-Specific Personalized Cards */}
      {currentUser && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display text-sm font-semibold text-white">
                {currentUser.role === 'Student'
                  ? 'My Active Lab & Test-Slot Bookings'
                  : `${currentUser.department} Department Resources & Faculty Rooms`}
              </h3>
              <button
                type="button"
                onClick={() =>
                  onNavigate(currentUser.role === 'Student' ? 'bookings' : 'resources')
                }
                className="text-xs text-cyan-400 hover:underline"
              >
                Manage →
              </button>
            </div>
            {currentUser.role === 'Student' ? (
              myBookings.length === 0 ? (
                <p className="mt-3 text-xs text-slate-400">
                  No active lab bookings yet. Click &ldquo;Book Lab Slot&rdquo; to reserve a seat.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {myBookings.slice(0, 3).map((bk) => (
                    <div
                      key={bk.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{bk.resourceName}</div>
                        <div className="text-[11px] text-slate-400">
                          {bk.date} · {bk.timeSlot} · {bk.seatsBooked} seat(s)
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-400">{bk.status}</span>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="mt-3 space-y-2">
                {campusState.resources
                  .filter(
                    (r) =>
                      currentUser.role === 'Admin' || r.department === currentUser.department
                  )
                  .slice(0, 3)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{r.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {r.department} · {r.floor} · Cap {r.capacity}
                        </div>
                      </div>
                      <span className="text-[11px] text-cyan-300">{r.status}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display text-sm font-semibold text-white">
                {currentUser.role === 'Maintenance Staff' || currentUser.role === 'Faculty'
                  ? `${currentUser.department} Department Maintenance Feed`
                  : 'Campus Maintenance Feed'}
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('maintenance')}
                className="text-xs text-cyan-400 hover:underline"
              >
                View All →
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {deptMaintenance.slice(0, 3).map((wo) => (
                <div
                  key={wo.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0c1a36] px-3 py-2 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="truncate font-semibold text-white">
                      {wo.id} · {wo.title}
                    </div>
                    <div className="truncate text-[11px] text-slate-400">
                      {wo.department} · {wo.category} · {wo.assignedStaff}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-medium ${
                      wo.status === 'Completed'
                        ? 'bg-emerald-950/70 text-emerald-300'
                        : wo.status === 'In Progress'
                          ? 'bg-cyan-950/70 text-cyan-300'
                          : 'bg-amber-950/70 text-amber-300'
                    }`}
                  >
                    {wo.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeframe Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <h3 className="font-display text-lg font-semibold text-white">
          Campus Telemetry &amp; Utilization Metrics
        </h3>
        <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#09152d] p-1">
          {(['daily', 'weekly', 'monthly'] as TimeframeFilter[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Campus KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Buildings</span>
            <Building2 className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {kpis.totalBuildings}
          </div>
          <div className="mt-1 text-xs text-slate-400">CSE · ECE · EEE · SAIL · Admin</div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Classrooms</span>
            <School className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {kpis.totalClassrooms}
          </div>
          <div className="mt-1 text-xs text-slate-400">Simulated teaching capacity</div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Available Classrooms</span>
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-emerald-300 tabular-nums">
            {kpis.availableClassrooms}
          </div>
          <div className="mt-1 text-xs text-slate-400">Ready for immediate booking</div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Laboratories</span>
            <FlaskConical className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {kpis.activeLaboratories}{' '}
            <span className="text-sm font-normal text-slate-400">/ {kpis.totalLaboratories}</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">CSE · ECE · EEE · SAIL Labs</div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Parking Availability</span>
            <Car className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {kpis.freeParking}{' '}
            <span className="text-sm font-normal text-slate-400">/ {kpis.totalParking} Free</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">3 monitored surface zones</div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Maintenance Requests</span>
            <Wrench className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-amber-300 tabular-nums">
            {kpis.openMaintenance} Open
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {campusState.maintenance.length} total work orders tracked
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Energy Consumption</span>
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-cyan-300 tabular-nums">
            {kpis.totalEnergy.toLocaleString()} kWh
          </div>
          <div className="mt-1 text-xs text-slate-400">Simulated daily campus draw</div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Campus Occupancy</span>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {kpis.avgOccupancy}%
          </div>
          <div className="mt-1 text-xs text-slate-400">Weighted utilization across blocks</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 lg:col-span-7">
          <div>
            <h3 className="font-display text-base font-semibold text-white">
              Energy Draw &amp; Solar Offset ({timeframe})
            </h3>
            <p className="text-xs text-slate-400">
              Simulated campus electricity consumption vs rooftop photovoltaic generation (kWh)
            </p>
          </div>
          <div className="mt-4 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seriesData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="solarFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071124',
                    borderColor: '#1e3a5f',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f1f5f9',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="consumptionKwh"
                  name="Grid Load (kWh)"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#energyFill)"
                />
                <Area
                  type="monotone"
                  dataKey="solarKwh"
                  name="Solar Offset (kWh)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#solarFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 lg:col-span-5">
          <div>
            <h3 className="font-display text-base font-semibold text-white">
              Building Utilization Comparison
            </h3>
            <p className="text-xs text-slate-400">
              Current simulated space utilization (%) per Saveetha block
            </p>
          </div>
          <div className="mt-4 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingChartData} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071124',
                    borderColor: '#1e3a5f',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f1f5f9',
                  }}
                />
                <Bar dataKey="occupancy" name="Utilization (%)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
