import React from 'react';
import { AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PreAttackCardProps {
  data?: {
    time_series?: Array<{ time: string; normal: number; suspicious: number; high_risk: number }>;
    early_warning?: {
      title: string;
      fraud_probability_pct: number;
      potential_exposure_inr: string;
      target_account?: string;
    };
  };
  onViewDetails?: () => void;
}

export const PreAttackCard: React.FC<PreAttackCardProps> = ({ data, onViewDetails }) => {
  const timeSeries = data?.time_series || [
    { time: "18:00", normal: 22, suspicious: 45, high_risk: 12 },
    { time: "18:05", normal: 28, suspicious: 50, high_risk: 18 },
    { time: "18:10", normal: 25, suspicious: 42, high_risk: 35 },
    { time: "18:15", normal: 30, suspicious: 55, high_risk: 48 },
    { time: "18:20", normal: 38, suspicious: 60, high_risk: 68 }
  ];

  const warning = data?.early_warning || {
    title: "Unusual transaction pattern detected!",
    fraud_probability_pct: 92.4,
    potential_exposure_inr: "12,50,000"
  };

  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full min-h-0 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Activity className="w-4 h-4 text-blue-600 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
            Pre-Attack Transaction Detection
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live</span>
        </div>
      </div>

      {/* Main Content Split: Chart on Left, Early Warning on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 flex-1 min-h-0 items-stretch">
        {/* Left: Multi-line Chart */}
        <div className="lg:col-span-7 flex flex-col justify-between min-h-0 h-full">
          <div className="flex items-center justify-center gap-3 text-[9.5px] font-bold text-slate-500 mb-0.5 shrink-0">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Suspicious
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> High Risk
            </span>
          </div>

          <div className="flex-1 min-h-0 relative w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries} margin={{ top: 2, right: 6, left: -26, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 9.5, fill: '#64748b', fontWeight: 'bold' }} tickLine={false} />
                <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tick={{ fontSize: 9.5, fill: '#64748b', fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '10.5px', padding: '3px 6px' }}
                />
                <Line type="monotone" dataKey="normal" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="suspicious" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="high_risk" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 2.5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Early Warning Card */}
        <div className="lg:col-span-5 bg-red-50/70 border border-red-100/90 rounded-xl p-2 sm:p-2.5 flex flex-col justify-between min-h-0 h-full">
          <div>
            <div className="flex items-center gap-1 text-red-600 font-bold text-xs mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5 fill-red-100 shrink-0" />
              <span>Early Warning</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-800 leading-snug line-clamp-2">
              {warning.title}
            </p>

            <div className="mt-1">
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Fraud Probability
              </div>
              <div className="text-xl sm:text-2xl font-black text-red-600 leading-none mt-0.5">
                {warning.fraud_probability_pct}%
              </div>
              <div className="w-full h-1.5 bg-red-100 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-500" 
                  style={{ width: `${warning.fraud_probability_pct}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-1">
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Potential Exposure
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900 leading-none mt-0.5">
                ₹{warning.potential_exposure_inr}
              </div>
            </div>
          </div>

          <button 
            onClick={onViewDetails}
            className="flex items-center justify-end gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors mt-1 shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
