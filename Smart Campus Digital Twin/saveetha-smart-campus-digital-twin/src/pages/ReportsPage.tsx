import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Download, FileSpreadsheet } from 'lucide-react';
import type { CampusState } from '../types/campus';

interface ReportsPageProps {
  campusState: CampusState;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ campusState }) => {
  const buildingComparison = campusState.buildings.map((b) => ({
    name: b.shortName,
    occupancy: b.occupancyPercent,
    energyKwh: Math.round(b.energyConsumptionKwh / 50), // scaled for dual bar view
    openRooms: b.availableRooms,
  }));

  const exportCsvReport = () => {
    const headers = [
      'Building ID',
      'Building Name',
      'Category',
      'Estimated Floors',
      'Total Rooms',
      'Available Rooms',
      'Occupancy %',
      'Daily Energy (kWh)',
      'Solar Offset (kWh)',
      'Efficiency Rating',
      'Maintenance Status',
    ];
    const rows = campusState.buildings.map((b) => [
      b.id,
      `"${b.name}"`,
      `"${b.category}"`,
      b.floors,
      b.totalRooms,
      b.availableRooms,
      b.occupancyPercent,
      b.energyConsumptionKwh,
      b.solarOffsetKwh,
      b.efficiencyRating,
      `"${b.maintenanceStatus}"`,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `saveetha-campus-digital-twin-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const completedTickets = campusState.maintenance.filter((m) => m.status === 'Completed').length;
  const resolutionRate = Math.round(
    (completedTickets / Math.max(1, campusState.maintenance.length)) * 100
  );
  const parkingUtilization = Math.round(
    (campusState.parking.filter((p) => p.occupied).length /
      Math.max(1, campusState.parking.length)) *
      100
  );

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Campus Reports &amp; Operational Analytics
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Cross-campus utilization benchmarks, sustainability metrics, and downloadable CSV audit reports.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsvReport}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download CSV Report</span>
        </button>
      </div>

      {/* Key Operational Benchmarks */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5">
          <div className="text-xs text-slate-400">Work Order Resolution Rate</div>
          <div className="mt-2 font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {resolutionRate}%
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {completedTickets} of {campusState.maintenance.length} tickets closed
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5">
          <div className="text-xs text-slate-400">Parking Lot Utilization</div>
          <div className="mt-2 font-mono text-2xl font-bold text-cyan-300 tabular-nums">
            {parkingUtilization}%
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Across 48 monitored bays in 3 zones
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5">
          <div className="text-xs text-slate-400">Resource Booking Utilization</div>
          <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {Math.round(
              (campusState.resources.filter((r) => r.status !== 'Available').length /
                Math.max(1, campusState.resources.length)) *
                100
            )}
            %
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Active labs, lecture halls &amp; equipment
          </div>
        </div>
      </div>

      {/* Comparative Analytics Chart */}
      <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
          <h3 className="font-display text-base font-semibold text-white">
            Building Occupancy vs Open Room Capacity
          </h3>
        </div>
        <div className="mt-4 h-[310px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={buildingComparison} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
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
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="occupancy" name="Occupancy (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="openRooms" name="Open Rooms" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
