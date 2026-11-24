import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Circle, ArrowRight, Zap, Lock } from 'lucide-react';

interface AutomatedResponseCardProps {
  onViewRequest?: () => void;
}

export const AutomatedResponseCard: React.FC<AutomatedResponseCardProps> = ({ onViewRequest }) => {
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch('/api/automated-response/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account: 'AC78456',
          officer: 'Investigator Sharma',
          statutory_section: 'Section 102 CrPC'
        })
      });
      if (res.ok) {
        setApproved(true);
      }
    } catch {}
    setLoading(false);
    setApproved(true);
  };

  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full min-h-0 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
            Automated Response Management
          </h3>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SOAR Active</span>
        </div>
      </div>

      {/* Main Content Split: Left Step Tracker, Right Awaiting Shield Card */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-2 items-center py-0.5">
        {/* Left: Step Audit Tracker (col-span-7) */}
        <div className="col-span-7 flex flex-col gap-1.5 text-[10.5px] font-semibold text-slate-700 min-w-0">
          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">Alert Generated</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono font-bold shrink-0">18:45</span>
          </div>

          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">Investigator Notified</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono font-bold shrink-0">18:46</span>
          </div>

          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">Review in Progress</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono font-bold shrink-0">18:47</span>
          </div>

          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              {approved ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              )}
              <span className={approved ? "text-emerald-700 font-bold truncate" : "text-slate-400 truncate"}>
                {approved ? "Section 102 Executed" : "Action Pending Approval"}
              </span>
            </div>
            {approved && <span className="text-[9px] text-emerald-600 font-mono font-bold shrink-0">NOW</span>}
          </div>
        </div>

        {/* Right: Green Shield & One-Click Live Approval Box (col-span-5) */}
        <div className="col-span-5 flex flex-col items-center justify-between text-center p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 h-full">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-0.5 shadow-2xs shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-[10px] font-black text-slate-800 leading-tight mb-1 truncate w-full">
            {approved ? "Account Frozen" : "Awaiting Approval"}
          </div>

          {approved ? (
            <div className="w-full py-1.5 px-2 bg-emerald-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-2xs">
              <CheckCircle2 className="w-3 h-3" />
              <span>Frozen ✓</span>
            </div>
          ) : (
            <button
              onClick={handleApprove}
              disabled={loading}
              className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs shrink-0"
              title="Click to execute Section 102 CrPC Emergency Debit Freeze"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>{loading ? "Freezing..." : "Execute Freeze"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Link to Full SOAR Playbook */}
      <div className="flex items-center justify-between pt-1 shrink-0 text-xs">
        <span className="text-[10px] text-slate-500 font-mono">
          Target: <strong className="text-red-600">AC78456 (₹12.5L)</strong>
        </span>
        <button
          onClick={onViewRequest}
          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>View Request</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
