import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Patient } from '../types';

interface RecoveryForecastProps {
  activePatient: Patient;
  currentVigor: number;
}

export const RecoveryForecast: React.FC<RecoveryForecastProps> = ({
  activePatient,
  currentVigor,
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'chart-only'>('both');

  const circumference = 2 * Math.PI * 40; // 251.2
  const offset = circumference - (currentVigor / 100) * circumference;

  // Build chronological chart data from careNotes history + current live session
  const { chartData, vigorDelta, minVigor } = useMemo(() => {
    const notes = activePatient.careNotes || [];

    // Map historical notes
    const historicalPoints = notes.map((cn) => ({
      date: cn.date,
      vigor: cn.vigorAtTime ?? activePatient.baseVigor,
      note: cn.note,
      author: cn.author,
      isCurrent: false,
    }));

    // If no notes exist, create an initial intake point
    if (historicalPoints.length === 0) {
      historicalPoints.push({
        date: 'Intake',
        vigor: activePatient.baseVigor,
        note: 'Clinical admission and initial pathology scan.',
        author: 'Dr. Leafy Intake',
        isCurrent: false,
      });
    }

    // Append current live state point
    const points = [
      ...historicalPoints,
      {
        date: 'Today',
        vigor: currentVigor,
        note: 'Live session with completed recovery tasks.',
        author: 'Current Regimen',
        isCurrent: true,
      },
    ];

    const firstVigor = points[0]?.vigor ?? activePatient.baseVigor;
    const delta = currentVigor - firstVigor;

    const lowest = Math.min(...points.map((p) => p.vigor));
    const domainMin = Math.max(20, Math.floor((lowest - 10) / 10) * 10);

    return { chartData: points, vigorDelta: delta, minVigor: domainMin };
  }, [activePatient.careNotes, activePatient.baseVigor, currentVigor]);

  return (
    <section className="bg-white/95 backdrop-blur-md rounded-xl border border-primary/15 p-5 custom-tier-1-shadow space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl text-[#144226] font-bold">Recovery Forecast</h3>
          <p className="text-[11px] text-[#414942]">
            Longitudinal vigor analytics mapped across clinical care milestones
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs text-[#376847] bg-[#e8f0e9] px-2.5 py-0.5 rounded-full font-semibold border border-[#144226]/10">
            {activePatient.prognosisText}
          </span>
          <button
            onClick={() => setViewMode(viewMode === 'both' ? 'chart-only' : 'both')}
            className="p-1 rounded text-[#414942] hover:text-[#144226] hover:bg-[#EDF4F7] transition-colors"
            title="Toggle compact or detailed trajectory chart"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {viewMode === 'both' ? 'show_chart' : 'donut_large'}
            </span>
          </button>
        </div>
      </div>

      {/* Top Gauge & Prognosis Overview */}
      {viewMode === 'both' && (
        <div className="flex flex-col sm:flex-row items-center gap-5 p-3.5 bg-[#f7faf8] rounded-xl border border-[#E8ECE9]">
          {/* Radial Progress Ring SVG */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#E2ECE5"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="url(#recovery-gradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="recovery-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#348a56" />
                  <stop offset="100%" stopColor="#144226" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl text-[#144226] font-bold transition-all duration-300">
                {currentVigor}%
              </span>
              <span className="text-[10px] text-[#414942] -mt-1 font-medium">Vigor Index</span>
            </div>
          </div>

          <div className="space-y-1.5 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="text-sm text-[#161d1a] font-bold">
                {activePatient.prognosisSummary}
              </div>
              {vigorDelta !== 0 && (
                <span
                  className={`text-[11px] px-2 py-0.2 rounded-full font-bold flex items-center gap-0.5 ${
                    vigorDelta > 0
                      ? 'bg-[#EAF4EE] text-[#3B8356] border border-[#3B8356]/20'
                      : 'bg-[#FAF0E6] text-[#D97746] border border-[#D97746]/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {vigorDelta > 0 ? 'trending_up' : 'trending_down'}
                  </span>
                  <span>{vigorDelta > 0 ? `+${vigorDelta}%` : `${vigorDelta}%`}</span>
                </span>
              )}
            </div>
            <p
              className="text-xs text-[#414942] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: activePatient.prognosisDetail }}
            />
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#376847] pt-0.5 font-medium">
              <span className="material-symbols-outlined text-[15px]">calendar_month</span>
              <span>{activePatient.checkinText}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recharts Vigor Score Over Time Line Graph */}
      <div className="space-y-2 pt-1 border-t border-[#E8ECE9]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3B8356] animate-pulse"></span>
            <span className="text-xs font-bold text-[#144226]">
              Vigor Recovery Trajectory (Recharts)
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#414942]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-[#144226] inline-block"></span>
              <span>Vigor Trend</span>
            </span>
            <span className="flex items-center gap-1 text-[#3B8356]">
              <span className="w-2.5 h-0.5 border-t border-dashed border-[#3B8356] inline-block"></span>
              <span>90% Baseline</span>
            </span>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="w-full h-48 bg-[#f7faf8] rounded-xl p-2 border border-[#E8ECE9]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="vigorGradientArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B8356" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B8356" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECE9" vertical={false} />

              <XAxis
                dataKey="date"
                stroke="#717971"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#E8ECE9' }}
              />

              <YAxis
                domain={[minVigor, 100]}
                stroke="#717971"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}%`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-[#144226]/15 shadow-xl max-w-xs text-xs space-y-1">
                        <div className="flex items-center justify-between gap-3 border-b border-[#E8ECE9] pb-1">
                          <span className="font-bold text-[#144226]">{data.date}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#EAF4EE] text-[#144226] font-extrabold text-[11px] border border-[#144226]/10">
                            {data.vigor}% Vigor
                          </span>
                        </div>
                        <p className="text-[11px] text-[#414942] leading-tight italic">
                          "{data.note}"
                        </p>
                        <span className="text-[9px] text-[#717971] block pt-0.5">
                          Logged by: {data.author}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* 90% Stable Health Reference Line */}
              <ReferenceLine
                y={90}
                stroke="#3B8356"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{
                  value: '90% Healthy',
                  position: 'insideTopRight',
                  fill: '#3B8356',
                  fontSize: 9,
                  fontWeight: 600,
                }}
              />

              {/* Area Under Curve */}
              <Area
                type="monotone"
                dataKey="vigor"
                stroke="none"
                fill="url(#vigorGradientArea)"
              />

              {/* Recovery Vigor Line */}
              <Line
                type="monotone"
                dataKey="vigor"
                stroke="#144226"
                strokeWidth={2.5}
                dot={{
                  r: 3.5,
                  fill: '#3B8356',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: '#144226',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Timeline History Strip */}
        <div className="flex items-center justify-between text-[10px] text-[#414942] px-1 pt-0.5">
          <span>Intake: {chartData[0]?.date} ({chartData[0]?.vigor}%)</span>
          <span className="text-[#144226] font-semibold">
            {chartData.length} Clinical Data Points
          </span>
          <span className="text-[#3B8356] font-bold">
            Current: {currentVigor}%
          </span>
        </div>
      </div>
    </section>
  );
};
