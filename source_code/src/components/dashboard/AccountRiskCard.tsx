import React, { useState } from 'react';
import { PieChart as PieChartIcon, ArrowRight, Filter } from 'lucide-react';

interface AccountRiskCardProps {
  onViewTiers?: () => void;
}

export const AccountRiskCard: React.FC<AccountRiskCardProps> = ({ onViewTiers }) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers = [
    { id: 'critical', name: 'Critical', pct: '2.1%', count: '25.2K', color: 'bg-red-500', stroke: '#EF4444' },
    { id: 'high', name: 'High', pct: '3.2%', count: '38.4K', color: 'bg-orange-500', stroke: '#F97316' },
    { id: 'medium', name: 'Medium', pct: '32.0%', count: '384K', color: 'bg-blue-500', stroke: '#3B82F6' },
    { id: 'low', name: 'Low', pct: '62.7%', count: '752K', color: 'bg-emerald-500', stroke: '#10B981' },
  ];

  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full min-h-0 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <PieChartIcon className="w-4 h-4 text-blue-600 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
            Account Risk Classification
          </h3>
        </div>
      </div>

      {/* Donut Chart and Interactive Tier Breakdown */}
      <div className="flex items-center justify-around gap-2 flex-1 min-h-0 px-0.5 min-w-0">
        {/* Left: Donut Chart with 1.2M Total */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-16 h-16 sm:w-18 sm:h-18 transform -rotate-90">
            {/* Low (Green) 62.7% */}
            <circle
              cx="36"
              cy="36"
              r="26"
              stroke="#10B981"
              strokeWidth="8"
              strokeDasharray="163"
              strokeDashoffset="60"
              fill="transparent"
            />
            {/* Medium (Blue) 32% */}
            <circle
              cx="36"
              cy="36"
              r="26"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeDasharray="163"
              strokeDashoffset="111"
              fill="transparent"
            />
            {/* High (Orange) 3.2% */}
            <circle
              cx="36"
              cy="36"
              r="26"
              stroke="#F97316"
              strokeWidth="8"
              strokeDasharray="163"
              strokeDashoffset="158"
              fill="transparent"
            />
            {/* Critical (Red) 2.1% */}
            <circle
              cx="36"
              cy="36"
              r="26"
              stroke="#EF4444"
              strokeWidth="8"
              strokeDasharray="163"
              strokeDashoffset="160"
              fill="transparent"
            />
          </svg>

          <div className="absolute text-center">
            <div className="text-sm font-black text-slate-900 leading-tight">
              1.2M
            </div>
            <div className="text-[7.5px] font-bold text-slate-400 uppercase tracking-wider">
              Total
            </div>
          </div>
        </div>

        {/* Right: Legend Breakdown with Interactive Click */}
        <div className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 min-w-0 pr-1 flex-1">
          {tiers.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTier(selectedTier === t.id ? null : t.id)}
              className={`flex items-center justify-between gap-2 px-1 py-0.5 rounded cursor-pointer transition-colors ${
                selectedTier === t.id ? 'bg-blue-50 font-bold' : 'hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5 min-w-0 truncate">
                <span className={`w-2 h-2 rounded-full ${t.color} shrink-0`}></span>
                <span className="truncate text-[11px] text-slate-800">{t.name}</span>
              </span>
              <span className="text-slate-500 font-mono text-[10px] font-bold shrink-0">{t.pct} ({t.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Link */}
      <div className="flex items-center justify-between pt-1 shrink-0 text-xs">
        <span className="text-[9.5px] text-slate-400 font-medium">
          {selectedTier ? `Selected: ${selectedTier.toUpperCase()}` : 'Live Basel III / AML Filter'}
        </span>
        <button
          onClick={onViewTiers}
          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>View Tiers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
