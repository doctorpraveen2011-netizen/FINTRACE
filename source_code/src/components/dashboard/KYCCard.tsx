import React from 'react';
import { UserCheck, CheckCircle2, ArrowRight, ShieldCheck, User } from 'lucide-react';

interface KYCCardProps {
  score?: number;
  onViewDetails?: () => void;
}

export const KYCCard: React.FC<KYCCardProps> = ({ score = 94.7, onViewDetails }) => {
  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full min-h-0 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <h3 className="text-xs font-bold text-slate-900 tracking-tight truncate">
            KYC Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Verified Registry</span>
        </div>
      </div>

      {/* Main Content: Circular Progress Ring & Real Verification Checklist */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 flex-1 min-h-0 px-0.5 min-w-0">
        {/* Left: Circular Donut Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-16 h-16 sm:w-18 sm:h-18 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={25}
              stroke="#E2E8F0"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r={25}
              stroke="#10B981"
              strokeWidth="5"
              strokeDasharray={2 * Math.PI * 25}
              strokeDashoffset={2 * Math.PI * 25 - (score / 100) * 2 * Math.PI * 25}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[7px] sm:text-[8px] font-semibold text-slate-500 uppercase tracking-wider">
              KYC SCORE
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
              {score}%
            </span>
          </div>
        </div>

        {/* Right: Verification Checklist */}
        <div className="flex flex-col gap-1 text-[9px] sm:text-[10px] font-semibold text-slate-700 min-w-0 flex-1 pl-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">Identity Verified (Aadhaar Linked)</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">Document Verified (PAN Validated)</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">Address Verified (Geotag Match)</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="text-slate-900 font-bold truncate">Related Accounts: 2 Found</span>
          </div>
        </div>
      </div>

      {/* Bottom Link */}
      <div className="flex items-center justify-between pt-1 shrink-0 text-xs">
        <span className="text-[9.5px] font-mono text-slate-400">
          CKYC: <strong className="text-slate-700">IN-CKYC-88192</strong>
        </span>
        <button
          onClick={onViewDetails}
          className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>View KYC Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
