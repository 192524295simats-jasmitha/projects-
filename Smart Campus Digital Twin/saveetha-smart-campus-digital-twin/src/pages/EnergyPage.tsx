import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { IndianRupee, Leaf, Sun, Zap } from 'lucide-react';
import type { CampusState, TimeframeFilter } from '../types/campus';

interface EnergyPageProps {
  campusState: CampusState;
}

export const EnergyPage: React.FC<EnergyPageProps> = ({ campusState }) => {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('daily');

  const summary = useMemo(() => {
    const totalDailyKwh = campusState.buildings.reduce((s, b) => s + b.energyConsumptionKwh, 0);
    const totalSolarKwh = campusState.buildings.reduce((s, b) => s + b.solarOffsetKwh, 0);
    const netGridKwh = totalDailyKwh - totalSolarKwh;
    const estMonthlyCostInr = Math.round(netGridKwh * 30 * campusState.tariffInrPerKwh);
    const solarSharePct = Math.round((totalSolarKwh / totalDailyKwh) * 100);

    return {
      totalDailyKwh,
      totalSolarKwh,
      netGridKwh,
      estMonthlyCostInr,
      solarSharePct,
    };
  }, [campusState]);

  const series = campusState.energySeries[timeframe];
  const buildingBars = campusState.buildings.map((b) => ({
    name: b.shortName,
    gridKwh: b.energyConsumptionKwh - b.solarOffsetKwh,
    solarKwh: b.solarOffsetKwh,
  }));

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Campus Energy Monitoring &amp; Solar Telemetry
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Simulated electricity consumption, building-level draw, estimated utility costs, and efficiency ratings.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#09152d] p-1">
          {(['daily', 'weekly', 'monthly'] as TimeframeFilter[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
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

      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Daily Campus Consumption</span>
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            {summary.totalDailyKwh.toLocaleString()} kWh
          </div>
          <div className="mt-1 text-xs text-slate-400">All 5 modeled campus blocks</div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rooftop Solar Generation</span>
            <Sun className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-emerald-300 tabular-nums">
            {summary.totalSolarKwh.toLocaleString()} kWh
          </div>
          <div className="mt-1 text-xs text-emerald-400 font-mono">
            {summary.solarSharePct}% renewable offset
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Est. Monthly Utility Cost</span>
            <IndianRupee className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
            ₹{(summary.estMonthlyCostInr / 100000).toFixed(2)}L
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            At ₹{campusState.tariffInrPerKwh}/kWh net tariff
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Campus Efficiency Index</span>
            <Leaf className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-cyan-300 tabular-nums">
            Grade A
          </div>
          <div className="mt-1 text-xs text-slate-400">Chiller &amp; LED scheduling active</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 lg:col-span-7">
          <h3 className="font-display text-base font-semibold text-white">
            Consumption Trend ({timeframe})
          </h3>
          <p className="text-xs text-slate-400">Grid electricity draw vs solar photovoltaic offset</p>
          <div className="mt-4 h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
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
                <Line
                  type="monotone"
                  dataKey="consumptionKwh"
                  name="Total Draw (kWh)"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="solarKwh"
                  name="Solar Offset (kWh)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5 lg:col-span-5">
          <h3 className="font-display text-base font-semibold text-white">
            Building-Wise Energy Split
          </h3>
          <p className="text-xs text-slate-400">Daily net grid load vs rooftop solar contribution</p>
          <div className="mt-4 h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingBars} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
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
                <Bar dataKey="gridKwh" name="Net Grid (kWh)" stackId="a" fill="#0284c7" />
                <Bar
                  dataKey="solarKwh"
                  name="Solar (kWh)"
                  stackId="a"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Building Energy Efficiency Table */}
      <div className="rounded-xl border border-slate-800/90 bg-[#09152d] p-5">
        <h3 className="font-display text-base font-semibold text-white">
          Building Energy &amp; Cost Breakdown (Simulated)
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 pr-3 font-medium">Building</th>
                <th className="py-2.5 px-3 font-medium text-right">Daily Draw</th>
                <th className="py-2.5 px-3 font-medium text-right">Solar Offset</th>
                <th className="py-2.5 px-3 font-medium text-right">Est. Monthly Cost</th>
                <th className="py-2.5 pl-3 font-medium">Efficiency Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {campusState.buildings.map((b) => {
                const net = b.energyConsumptionKwh - b.solarOffsetKwh;
                const monthlyCost = Math.round(net * 30 * campusState.tariffInrPerKwh);
                return (
                  <tr key={b.id} className="hover:bg-[#0d1d3d]">
                    <td className="py-3 pr-3 font-medium text-white">{b.name}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-200">
                      {b.energyConsumptionKwh.toLocaleString()} kWh
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-400">
                      -{b.solarOffsetKwh.toLocaleString()} kWh
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-200">
                      ₹{monthlyCost.toLocaleString()}
                    </td>
                    <td className="py-3 pl-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${
                          b.efficiencyRating === 'A+'
                            ? 'bg-emerald-950/70 text-emerald-300'
                            : b.efficiencyRating === 'A'
                              ? 'bg-cyan-950/70 text-cyan-300'
                              : 'bg-amber-950/70 text-amber-300'
                        }`}
                      >
                        Rating {b.efficiencyRating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
