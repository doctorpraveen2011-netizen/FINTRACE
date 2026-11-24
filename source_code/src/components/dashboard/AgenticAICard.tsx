import React, { useState } from 'react';
import { Cpu, ArrowRight, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AgenticAICardProps {
  onViewControlCentre?: () => void;
}

export const AgenticAICard: React.FC<AgenticAICardProps> = ({ onViewControlCentre }) => {
  const [orchestrating, setOrchestrating] = useState(false);
  const [orchestrated, setOrchestrated] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const handleOrchestrate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOrchestrating(true);
    setOrchestrated(false);

    // Sequence through the real agent workflow
    setActiveStep("Transaction Agent analyzing 1,420 eps feed...");
    setTimeout(() => {
      setActiveStep("Graph Intelligence mapping 5-hop perimeter...");
    }, 400);

    setTimeout(() => {
      setActiveStep("KYC Agent cross-referencing biometric database...");
    }, 800);

    setTimeout(() => {
      setActiveStep("Consensus reached: Section 102 Emergency Freeze recommended!");
      setOrchestrating(false);
      setOrchestrated(true);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full min-h-0 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Cpu className="w-4 h-4 text-blue-600 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
            Agentic AI Control Centre
          </h3>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>6 Agents Active</span>
        </div>
      </div>

      {/* Radial Multi-Agent Visualizer SVG Engine */}
      <div 
        onClick={onViewControlCentre}
        className="flex-1 min-h-0 relative w-full flex items-center justify-center cursor-pointer group bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden"
      >
        <svg className="w-full h-full max-h-52" viewBox="0 0 360 200" preserveAspectRatio="xMidYMid meet">
          {/* Radial Connection Vectors */}
          <line x1="180" y1="100" x2="85" y2="45" stroke="#93C5FD" strokeWidth="2" strokeDasharray={orchestrating ? "2 2" : "3 3"} />
          <line x1="180" y1="100" x2="275" y2="45" stroke="#86EFAC" strokeWidth="2" strokeDasharray={orchestrating ? "2 2" : "3 3"} />
          <line x1="180" y1="100" x2="285" y2="110" stroke="#FDE68A" strokeWidth="2" strokeDasharray={orchestrating ? "2 2" : "3 3"} />
          <line x1="180" y1="100" x2="260" y2="160" stroke="#D8B4FE" strokeWidth="2" strokeDasharray={orchestrating ? "2 2" : "3 3"} />
          <line x1="180" y1="100" x2="100" y2="160" stroke="#99F6E4" strokeWidth="2" strokeDasharray={orchestrating ? "2 2" : "3 3"} />
          <line x1="180" y1="100" x2="80" y2="105" stroke="#C7D2FE" strokeWidth="2" strokeDasharray={orchestrating ? "2 2" : "3 3"} />

          {/* Center Hub: Orchestrator */}
          <circle cx="180" cy="100" r={orchestrating ? 26 : 24} fill="#2563EB" className="transition-all origin-center" />
          <circle cx="180" cy="100" r="28" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.6" className="animate-pulse" />
          <rect x="172" y="92" width="16" height="16" rx="3" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="180" cy="100" r="2.5" fill="#FFFFFF" />

          {/* 1. Transaction Agent (Top Left) */}
          <circle cx="85" cy="45" r="14" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
          {/* 2. Risk Assessment Agent (Top Right) */}
          <circle cx="275" cy="45" r="14" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          {/* 3. KYC Verification Agent (Mid Right) */}
          <circle cx="285" cy="110" r="14" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
          {/* 4. Response Agent (Bottom Right) */}
          <circle cx="260" cy="160" r="14" fill="#A855F7" stroke="#FFFFFF" strokeWidth="2" />
          {/* 5. Predictive Threat Agent (Bottom Left) */}
          <circle cx="100" cy="160" r="14" fill="#14B8A6" stroke="#FFFFFF" strokeWidth="2" />
          {/* 6. Graph Intelligence Agent (Mid Left) */}
          <circle cx="80" cy="105" r="14" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2" />

          {/* Interactive Orchestrate Button Inside Graphic */}
          <g transform="translate(138, 126)" onClick={handleOrchestrate} className="cursor-pointer hover:opacity-90">
            <rect width="84" height="22" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
            <text x="42" y="15" fill="#1D4ED8" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              {orchestrating ? "Working..." : "Orchestrate"}
            </text>
          </g>

          {/* Large, Crisp Vector Text Labels */}
          <text x="85" y="24" fill="#1E293B" fontSize="9.5" fontWeight="bold" textAnchor="middle">Transaction Agent</text>
          <text x="275" y="24" fill="#1E293B" fontSize="9.5" fontWeight="bold" textAnchor="middle">Risk Assessment</text>
          <text x="290" y="90" fill="#1E293B" fontSize="9.5" fontWeight="bold" textAnchor="middle">KYC Verification</text>
          <text x="260" y="188" fill="#1E293B" fontSize="9.5" fontWeight="bold" textAnchor="middle">Response Agent</text>
          <text x="100" y="188" fill="#1E293B" fontSize="9.5" fontWeight="bold" textAnchor="middle">Graph Threat</text>
          <text x="75" y="132" fill="#1E293B" fontSize="9.5" fontWeight="bold" textAnchor="middle">Graph Intelligence</text>
        </svg>

        {/* Live Multi-Agent Execution Feedback Banner */}
        {activeStep && (
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-mono flex items-center gap-2 shadow-lg z-20 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="truncate">{activeStep}</span>
          </div>
        )}
      </div>

      {/* Bottom Link */}
      <div className="flex items-center justify-between pt-1 shrink-0 text-xs">
        <span className="text-[10px] text-slate-500 font-medium">
          Autonomous Collaboration Active
        </span>
        <button
          onClick={onViewControlCentre}
          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>Control Centre</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
