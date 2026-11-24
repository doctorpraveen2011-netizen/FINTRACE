import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface MuleCardProps {
  detectedCount?: number;
  metrics?: {
    rapid_transactions_pct: number;
    multiple_senders_pct: number;
    unusual_pattern_pct: number;
    linked_accounts_pct: number;
  };
  onViewAnalysis?: () => void;
}

export const MuleCard: React.FC<MuleCardProps> = ({
  detectedCount = 86,
  metrics = {
    rapid_transactions_pct: 73,
    multiple_senders_pct: 62,
    unusual_pattern_pct: 58,
    linked_accounts_pct: 47
  },
  onViewAnalysis
}) => {
  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full min-h-0 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
            Mule Account Detection
          </h3>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold shrink-0">
          High Risk • Active
        </div>
      </div>

      {/* Main Content: Left Red Icon & Detected Count, Right 4 Stats */}
      <div className="flex items-center justify-between gap-2 flex-1 min-h-0">
        {/* Left: Red Silhouette Icon & Number */}
        <div className="flex flex-col items-center justify-center text-center pl-1 shrink-0">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-0.5 shadow-2xs">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.2.5 2.3 1.3 3.1-3.6 1.4-6.1 4.7-6.3 8.7h19c-.2-4-2.7-7.3-6.3-8.7.8-.8 1.3-1.9 1.3-3.1C16.5 4 14.5 2 12 2zm0 13c-2.8 0-5 2.2-5 5h10c0-2.8-2.2-5-5-5z"/>
            </svg>
          </div>
          <div className="text-[9.5px] font-bold text-slate-700 leading-tight">
            Mule Accounts<br />Detected
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 font-mono">
            {detectedCount}
          </div>
        </div>

        {/* Right: Bullet Percentages */}
        <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-700 pr-1 min-w-0 flex-1 justify-center pl-2">
          <div className="flex items-center justify-between gap-1.5">
            <span className="flex items-center gap-1 min-w-0 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
              <span className="truncate">Rapid Transactions</span>
            </span>
            <span className="font-extrabold text-slate-900 font-mono shrink-0">{metrics.rapid_transactions_pct}%</span>
          </div>

          <div className="flex items-center justify-between gap-1.5">
            <span className="flex items-center gap-1 min-w-0 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
              <span className="truncate">Multiple Senders</span>
            </span>
            <span className="font-extrabold text-slate-900 font-mono shrink-0">{metrics.multiple_senders_pct}%</span>
          </div>

          <div className="flex items-center justify-between gap-1.5">
            <span className="flex items-center gap-1 min-w-0 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
              <span className="truncate">Unusual Pattern</span>
            </span>
            <span className="font-extrabold text-slate-900 font-mono shrink-0">{metrics.unusual_pattern_pct}%</span>
          </div>

          <div className="flex items-center justify-between gap-1.5">
            <span className="flex items-center gap-1 min-w-0 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
              <span className="truncate">Linked Accounts</span>
            </span>
            <span className="font-extrabold text-slate-900 font-mono shrink-0">{metrics.linked_accounts_pct}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Link */}
      <div className="flex items-center justify-between pt-1 shrink-0 text-xs">
        <span className="text-[9.5px] font-mono text-slate-400">
          Top Hub: <strong className="text-red-600">AC78456</strong>
        </span>
        <button
          onClick={onViewAnalysis}
          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>View Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
