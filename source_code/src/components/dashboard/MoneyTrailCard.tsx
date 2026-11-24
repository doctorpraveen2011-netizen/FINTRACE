import React, { useState } from 'react';
import { GitFork, ArrowRight, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface MoneyTrailCardProps {
  onExploreGraph?: () => void;
}

interface GraphNode {
  id: string;
  label: string;
  bank: string;
  amount: string;
  type: 'TARGET' | 'INFLOW' | 'OUTFLOW';
  x: number;
  y: number;
  status: 'FLAGGED' | 'FROZEN' | 'ACTIVE';
}

export const MoneyTrailCard: React.FC<MoneyTrailCardProps> = ({ onExploreGraph }) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const nodes: GraphNode[] = [
    // Center Primary Mule Node
    { id: 'AC78456', label: 'AC78456', bank: 'Axis Bank Mule Hub', amount: '₹12,50,000', type: 'TARGET', x: 140, y: 90, status: 'FLAGGED' },
    // Senders / Inflows (Left)
    { id: 'AC33190', label: 'AC33190', bank: 'Kotak Mahindra', amount: '₹4,20,000', type: 'INFLOW', x: 45, y: 35, status: 'ACTIVE' },
    { id: 'AC99104', label: 'AC99104', bank: 'SBI Retail', amount: '₹3,50,000', type: 'INFLOW', x: 30, y: 90, status: 'ACTIVE' },
    { id: 'AC88219', label: 'AC88219', bank: 'ICICI Inflow', amount: '₹4,80,000', type: 'INFLOW', x: 50, y: 145, status: 'ACTIVE' },
    // Layering / Outflows (Right)
    { id: 'AC91823', label: 'AC91823', bank: 'HDFC Layering', amount: '₹6,00,000', type: 'OUTFLOW', x: 235, y: 40, status: 'FLAGGED' },
    { id: 'ATM-CH-04', label: 'ATM-CH-04', bank: 'Chennai ATM Cashout', amount: '₹4,50,000', type: 'OUTFLOW', x: 250, y: 90, status: 'FLAGGED' },
    { id: 'P2P-ESCROW', label: 'P2P-BINANCE', bank: 'Crypto Escrow', amount: '₹2,00,000', type: 'OUTFLOW', x: 230, y: 145, status: 'FLAGGED' }
  ];

  const activeNode = selectedNode || nodes[0];

  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full min-h-0 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <GitFork className="w-4 h-4 text-blue-600 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
            Money Trail Analysis
          </h3>
        </div>
        {/* Compact Legend */}
        <div className="flex items-center gap-2 text-[9.5px] font-bold text-slate-500 shrink-0">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Mule Hub
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Inflow
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Off-Ramp
          </span>
        </div>
      </div>

      {/* Real Interactive Money Trail SVG Engine */}
      <div className="flex-1 min-h-0 relative w-full flex items-center justify-center bg-slate-50/60 rounded-xl border border-slate-100 overflow-hidden">
        <svg className="w-full h-full max-h-48" viewBox="0 0 280 180" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="edgeInflow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="edgeOutflow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Real Transaction Flow Edges */}
          {nodes.filter(n => n.type === 'INFLOW').map((n) => (
            <g key={`edge-${n.id}`}>
              <line x1={n.x} y1={n.y} x2={140} y2={90} stroke="url(#edgeInflow)" strokeWidth="2.5" />
              <circle r="2.5" fill="#3B82F6">
                <animateMotion path={`M ${n.x} ${n.y} L 140 90`} dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {nodes.filter(n => n.type === 'OUTFLOW').map((n) => (
            <g key={`edge-${n.id}`}>
              <line x1={140} y1={90} x2={n.x} y2={n.y} stroke="url(#edgeOutflow)" strokeWidth="2.5" strokeDasharray="4 3" />
              <circle r="2.5" fill="#EF4444">
                <animateMotion path={`M 140 90 L ${n.x} ${n.y}`} dur="1.8s" repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* Senders / Inflows (Left Blue Nodes) */}
          {nodes.filter(n => n.type === 'INFLOW').map((n) => {
            const isSel = selectedNode?.id === n.id;
            return (
              <g
                key={n.id}
                onClick={() => setSelectedNode(n)}
                className="cursor-pointer group"
              >
                <circle cx={n.x} cy={n.y} r={isSel ? 14 : 12} fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" className="transition-all" />
                <text x={n.x} y={n.y - 15} fill="#334155" fontSize="8.5" fontWeight="bold" textAnchor="middle">{n.label}</text>
              </g>
            );
          })}

          {/* Outflows / Layering (Right Cyan/Red Nodes) */}
          {nodes.filter(n => n.type === 'OUTFLOW').map((n) => {
            const isSel = selectedNode?.id === n.id;
            return (
              <g
                key={n.id}
                onClick={() => setSelectedNode(n)}
                className="cursor-pointer group"
              >
                <circle cx={n.x} cy={n.y} r={isSel ? 14 : 12} fill="#06B6D4" stroke="#FFFFFF" strokeWidth="2" className="transition-all" />
                <text x={n.x} y={n.y - 15} fill="#334155" fontSize="8.5" fontWeight="bold" textAnchor="middle">{n.label}</text>
              </g>
            );
          })}

          {/* Primary Center Target Node: AC78456 */}
          <g
            onClick={() => setSelectedNode(nodes[0])}
            className="cursor-pointer group"
          >
            <circle cx={140} cy={90} r="26" fill="none" stroke="#FCA5A5" strokeWidth="2" className="animate-pulse" />
            <circle cx={140} cy={90} r={selectedNode?.id === 'AC78456' ? 22 : 19} fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" className="transition-all" />
            <circle cx={140} cy={84} r="5" fill="#FFFFFF" />
            <path d="M 130 98 A 10 7 0 0 1 150 98 Z" fill="#FFFFFF" />
            <text x="140" y="117" fill="#991B1B" fontSize="9.5" fontWeight="black" textAnchor="middle">AC78456</text>
          </g>
        </svg>

        {/* Live Active Node Badge */}
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md border border-slate-200 text-[9.5px] font-mono shadow-2xs">
          <span className="text-slate-400 font-bold">NODE: </span>
          <strong className="text-blue-700 font-black">{activeNode.label}</strong>
          <span className="text-slate-400 ml-1.5">({activeNode.amount})</span>
        </div>
      </div>

      {/* Bottom Link with Real Account Drilldown */}
      <div className="flex items-center justify-between pt-1 shrink-0 text-xs">
        <span className="text-[10px] text-slate-500 font-medium">
          3 Inflows • 3 Off-Ramp Vectors
        </span>
        <button
          onClick={onExploreGraph}
          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>Explore Graph</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
