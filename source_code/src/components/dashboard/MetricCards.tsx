import React from 'react';
import { RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface MetricCardsProps {
  metrics: {
    total_transactions_monitored: string;
    transactions_growth_pct: string;
    suspicious_activities_detected: number;
    suspicious_growth_pct: string;
    critical_accounts: number;
    critical_growth_pct: string;
    resolved_cases: number;
    resolved_growth_pct: string;
  };
  onDrilldown?: (module: string) => void;
  compact?: boolean;
}

const sparklineDataBlue = [
  { v: 40 }, { v: 45 }, { v: 42 }, { v: 50 }, { v: 48 }, { v: 62 }, { v: 58 }, { v: 75 }
];
const sparklineDataRed = [
  { v: 20 }, { v: 25 }, { v: 22 }, { v: 38 }, { v: 42 }, { v: 40 }, { v: 55 }, { v: 70 }
];
const sparklineDataOrange = [
  { v: 15 }, { v: 18 }, { v: 25 }, { v: 22 }, { v: 28 }, { v: 32 }, { v: 30 }, { v: 37 }
];
const sparklineDataGreen = [
  { v: 100 }, { v: 110 }, { v: 105 }, { v: 125 }, { v: 130 }, { v: 145 }, { v: 150 }, { v: 168 }
];

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, onDrilldown, compact = true }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 xl:gap-3">
      {/* 1. Total Transactions Monitored */}
      <div 
        onClick={() => onDrilldown && onDrilldown('live-transactions')}
        className="bg-white rounded-xl py-2 px-3.5 2xl:py-2.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between h-full min-h-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-2xs shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 leading-tight truncate">
              Total Transactions
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none mt-1 truncate">
              {metrics.total_transactions_monitored || "2.8M"}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <span>↑</span>
              <span>{metrics.transactions_growth_pct || "12.5%"}</span>
            </div>
          </div>
        </div>
        <div className="w-16 sm:w-20 h-8 sm:h-9 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineDataBlue}>
              <Line type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Suspicious Activities Detected */}
      <div 
        onClick={() => onDrilldown && onDrilldown('pre-attack')}
        className="bg-white rounded-xl py-2 px-3.5 2xl:py-2.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between h-full min-h-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-2xs shrink-0">
            <span className="text-lg font-black leading-none">!</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 leading-tight truncate">
              Suspicious Activities
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none mt-1 truncate">
              {(metrics.suspicious_activities_detected || 1248).toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-red-500 mt-1">
              <span>↑</span>
              <span>{metrics.suspicious_growth_pct || "28.7%"}</span>
            </div>
          </div>
        </div>
        <div className="w-16 sm:w-20 h-8 sm:h-9 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineDataRed}>
              <Line type="monotone" dataKey="v" stroke="#EF4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Critical Accounts */}
      <div 
        onClick={() => onDrilldown && onDrilldown('mule-detection')}
        className="bg-white rounded-xl py-2 px-3.5 2xl:py-2.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between h-full min-h-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-2xs shrink-0">
            <ShieldAlert className="w-5 h-5 fill-current" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 leading-tight truncate">
              Critical Accounts
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none mt-1 truncate">
              {metrics.critical_accounts || 37}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-1">
              <span>↑</span>
              <span>{metrics.critical_growth_pct || "5.7%"}</span>
            </div>
          </div>
        </div>
        <div className="w-16 sm:w-20 h-8 sm:h-9 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineDataOrange}>
              <Line type="monotone" dataKey="v" stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Resolved Cases */}
      <div 
        onClick={() => onDrilldown && onDrilldown('investigations')}
        className="bg-white rounded-xl py-2 px-3.5 2xl:py-2.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between h-full min-h-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-2xs shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 leading-tight truncate">
              Resolved Cases
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none mt-1 truncate">
              {metrics.resolved_cases || 892}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <span>↑</span>
              <span>{metrics.resolved_growth_pct || "18.2%"}</span>
            </div>
          </div>
        </div>
        <div className="w-16 sm:w-20 h-8 sm:h-9 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineDataGreen}>
              <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
