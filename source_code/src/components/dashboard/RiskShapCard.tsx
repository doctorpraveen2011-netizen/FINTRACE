import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldAlert, BarChart2, CheckCircle2, TrendingUp } from 'lucide-react';

interface RiskShapCardProps {
  score?: number;
  onViewExplanation?: () => void;
}

export const RiskShapCard: React.FC<RiskShapCardProps> = ({ score = 91.3, onViewExplanation }) => {
  const [activeTab, setActiveTab] = useState<'Prediction' | 'SHAP Summary' | 'Feature Impact' | 'Risk Factors'>('Prediction');

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full min-h-0 min-w-0">
      {/* Header */}
      <div className="shrink-0">
        <div className="flex items-center gap-1.5 mb-1 min-w-0">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
            AI Risk Intelligence & SHAP Explainability
          </h3>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 border-b border-slate-100 pb-1 mb-1.5 overflow-x-auto no-scrollbar">
          {(['Prediction', 'SHAP Summary', 'Feature Impact', 'Risk Factors'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`transition-colors whitespace-nowrap pb-0.5 ${
                activeTab === tab
                  ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                  : 'hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Split Depending on Selected Tab */}
      <div className="flex-1 min-h-0 flex items-center justify-between gap-2">
        {activeTab === 'Prediction' && (
          <div className="grid grid-cols-12 gap-2 w-full items-center">
            {/* Left Donut Gauge */}
            <div className="col-span-4 flex flex-col items-center justify-center text-center">
              <div className="relative flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r={radius} stroke="#FEE2E2" strokeWidth="5" fill="transparent" />
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke="#EF4444"
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-sm font-black text-slate-900 leading-none">{score}%</div>
                </div>
              </div>
              <div className="text-[10px] font-bold text-red-600 mt-0.5">High Risk</div>
            </div>

            {/* Middle Key Factors */}
            <div className="col-span-4 flex flex-col justify-center text-[10px]">
              <div className="font-bold text-slate-800 mb-0.5">Key Factors:</div>
              <div className="space-y-1 text-slate-600 font-medium">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                  <span className="truncate">Multiple Beneficiaries</span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                  <span className="truncate">Rapid Fund Movement</span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                  <span className="truncate">Unusual Location</span>
                </div>
              </div>
            </div>

            {/* Right Feature Impact Bars */}
            <div className="col-span-4 flex flex-col justify-center text-[9px] space-y-1">
              <div className="font-bold text-slate-800 text-[9.5px]">Feature Impact</div>
              <div>
                <div className="flex justify-between text-slate-600 font-medium leading-none">
                  <span>Transactions</span>
                  <span className="font-bold text-slate-800">85%</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-600 font-medium leading-none">
                  <span>Location</span>
                  <span className="font-bold text-slate-800">68%</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-600 font-medium leading-none">
                  <span>KYC Match</span>
                  <span className="font-bold text-slate-800">45%</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SHAP Summary' && (
          <div className="w-full space-y-1 text-[10px]">
            <div className="flex justify-between text-slate-500 font-mono text-[9px] border-b pb-0.5">
              <span>FEATURE VARIABLE</span>
              <span>SHAP CONTRIBUTION</span>
            </div>
            <div className="flex justify-between items-center text-slate-800 font-semibold">
              <span className="text-red-600 font-mono">V14 (Velocity Spike)</span>
              <span className="font-mono text-red-600 font-black">+0.428 (Risk)</span>
            </div>
            <div className="flex justify-between items-center text-slate-800 font-semibold">
              <span className="text-red-600 font-mono">V4 (Amount Ratio)</span>
              <span className="font-mono text-red-600 font-black">+0.312 (Risk)</span>
            </div>
            <div className="flex justify-between items-center text-slate-800 font-semibold">
              <span className="text-emerald-600 font-mono">V12 (Account Age)</span>
              <span className="font-mono text-emerald-600 font-black">-0.145 (Safe)</span>
            </div>
          </div>
        )}

        {activeTab === 'Feature Impact' && (
          <div className="w-full space-y-1.5 text-[10px]">
            {[
              { label: 'Outflow Velocity Burst', val: 92, color: 'bg-red-500' },
              { label: 'New Device IP Hopping', val: 78, color: 'bg-blue-600' },
              { label: 'Beneficiary Smurfing Count', val: 65, color: 'bg-amber-500' },
              { label: 'Geospatial Travel Velocity', val: 54, color: 'bg-indigo-500' },
            ].map((f, i) => (
              <div key={i}>
                <div className="flex justify-between text-slate-700 font-semibold text-[9.5px]">
                  <span>{f.label}</span>
                  <span className="font-mono font-bold">{f.val}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                  <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Risk Factors' && (
          <div className="w-full space-y-1 text-[10px] text-slate-700 font-semibold">
            <div className="p-1.5 rounded-lg bg-red-50 border border-red-200/60 flex items-center justify-between">
              <span className="truncate">Multiple Rapid Intermediaries</span>
              <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-mono font-bold text-[9px]">CRITICAL</span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-between">
              <span className="truncate">Cross-District ATM Outflows</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-mono font-bold text-[9px]">HIGH</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Link */}
      <div className="flex justify-end pt-1 shrink-0">
        <button
          onClick={onViewExplanation}
          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>View Explanation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
