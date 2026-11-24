import React, { useState, useEffect } from 'react';
import { LiveGoogleMaps } from './LiveGoogleMaps.tsx';
import { MuleAccountDetection } from './MuleAccountDetection.tsx';
import { InvestigationCaseManagement } from './InvestigationCaseManagement.tsx';
import { KycIntelligence } from './KycIntelligence.tsx';
import { TacticalAiWorkbench } from './TacticalAiWorkbench.tsx';
import { MoneyTrailAnalysis } from './MoneyTrailAnalysis.tsx';
import { AiRiskIntelligence } from './AiRiskIntelligence.tsx';
import { DigitalTwinSimulation } from './DigitalTwinSimulation.tsx';
import { AttackIntelligence } from './AttackIntelligence.tsx';
import { DomainIntelligence } from './DomainIntelligence.tsx';
import { IpIntelligence } from './IpIntelligence.tsx';
import { RelationshipGraph } from './RelationshipGraph.tsx';
import { RealTimeAlerts } from './RealTimeAlerts.tsx';
import { EvidenceManagement } from './EvidenceManagement.tsx';
import { InvestigationReports } from './InvestigationReports.tsx';
import { AuditLogs } from './AuditLogs.tsx';
import { SettingsModule } from './SettingsModule.tsx';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  FileCheck,
  FileText,
  FolderLock,
  GitFork,
  Globe,
  Layers,
  MapPin,
  Play,
  RotateCcw,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  XCircle,
  Download,
  Filter,
  Check
} from 'lucide-react';

interface ModuleViewProps {
  moduleId: string;
  onNavigate: (id: string, targetAccount?: string) => void;
  systemData: any;
  onRefreshData?: () => void;
  selectedTrailAccount?: string;
}

export const ModuleView: React.FC<ModuleViewProps> = ({
  moduleId,
  onNavigate,
  systemData,
  onRefreshData,
  selectedTrailAccount
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("overview");
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);
  const [approvalStatus, setApprovalStatus] = useState<string>("PENDING_APPROVAL");
  const [actionNotes, setActionNotes] = useState("");
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCasePriority, setNewCasePriority] = useState("HIGH");
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Handle Response Approval
  const handleApproveAction = async () => {
    try {
      const res = await fetch('/api/automated-response/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_name: "Investigator Cyber Analyst",
          notes: actionNotes || "Sanctioned under Section 102 CrPC / PMLA Section 5."
        })
      });
      if (res.ok) {
        setApprovalStatus("APPROVED");
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectAction = async () => {
    try {
      const res = await fetch('/api/automated-response/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_name: "Investigator Cyber Analyst",
          reason: actionNotes || "Insufficient prima facie evidence"
        })
      });
      if (res.ok) {
        setApprovalStatus("REJECTED");
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Run Simulation
  const handleRunSimulation = async (scenarioId: string) => {
    setSimulating(true);
    try {
      const res = await fetch('/api/digital-twin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenarioId })
      });
      const data = await res.json();
      setTimeout(() => {
        setSimResult(data.data);
        setSimulating(false);
      }, 800);
    } catch (e) {
      setSimulating(false);
    }
  };

  // Render individual views
  switch (moduleId) {
    // -----------------------------------------------------------------
    // MODULE 02: Pre-Attack Transaction Detection
    // -----------------------------------------------------------------
    case 'pre-attack':
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-red-50 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">Pre-Attack Transaction Detection Engine</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time algorithmic surveillance identifying reconnaissance transfers, micro-probes, and velocity bursts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse">
                Early Warning Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Active Suspicious Clusters (Pre-Exploit Phase)</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { target: "AC78456 (Axis Bank)", pattern: "14 Rapid ₹1 Micro-Deposits within 90s followed by ₹12.5L Inflow", risk: "CRITICAL (92.4%)", status: "PENDING_FREEZE" },
                  { target: "AC91823 (HDFC Bank)", pattern: "Dormant account awakened after 180 days with multiple UPI aggregators", risk: "HIGH (88.7%)", status: "UNDER_SURVEILLANCE" },
                  { target: "AC55412 (ICICI Bank)", pattern: "Sudden mobile number update immediately followed by ₹8.5L RTGS request", risk: "HIGH (84.1%)", status: "UNDER_SURVEILLANCE" }
                ].map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{item.target}</div>
                      <div className="text-slate-500 mt-0.5">{item.pattern}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-red-600">{item.risk}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50/70 p-6 rounded-xl border border-red-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-red-900">Recommended Pre-Emptive Mitigation</h3>
              <p className="text-xs text-red-700 leading-relaxed">
                Platform predictive model suggests preemptive debit freeze on target node <span className="font-mono font-bold">AC78456</span> to avert impending ₹12,50,000 cashout.
              </p>
              <button
                onClick={() => onNavigate('automated-response')}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Human Approval Gate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );

    // -----------------------------------------------------------------
    // MODULE 03: Live Transaction Monitoring
    // -----------------------------------------------------------------
    case 'live-transactions':
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Activity className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">Live Financial Transaction Stream</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time sub-second ingestion feed across UPI, IMPS, RTGS, and NEFT banking gateways.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by UTR, Account, or Location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Streaming Live</span>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">UTR Reference</th>
                    <th className="px-4 py-3">Sender</th>
                    <th className="px-4 py-3">Receiver</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Channel / Bank</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Risk Assessment</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { time: "18:45:12", utr: "UTR202511248456", sender: "ACC-VICTIM-VARUN", receiver: "AC78456", amount: "₹12,50,000", channel: "IMPS • Axis Bank", location: "Chennai, TN", risk: "CRITICAL (92.4%)", isCrit: true },
                    { time: "18:44:58", utr: "UTR202511248455", sender: "ACC-38491", receiver: "AC91823", amount: "₹6,00,000", channel: "RTGS • HDFC Bank", location: "Coimbatore, TN", risk: "HIGH (88.7%)", isHigh: true },
                    { time: "18:44:30", utr: "UTR202511248454", sender: "ACC-12903", receiver: "AC44510", amount: "₹5,80,000", channel: "NEFT • SBI", location: "Bengaluru, KA", risk: "HIGH (76.5%)", isHigh: true },
                    { time: "18:44:11", utr: "UTR202511248453", sender: "ACC-55210", receiver: "ACC-99214", amount: "₹14,500", channel: "UPI • ICICI Bank", location: "Mumbai, MH", risk: "NORMAL (3.2%)" },
                    { time: "18:43:55", utr: "UTR202511248452", sender: "ACC-84102", receiver: "ACC-41092", amount: "₹3,200", channel: "UPI • Kotak Bank", location: "New Delhi, DL", risk: "NORMAL (1.8%)" },
                    { time: "18:43:30", utr: "UTR202511248451", sender: "ACC-71290", receiver: "AC55412", amount: "₹1,80,000", channel: "IMPS • PNB", location: "Hyderabad, TS", risk: "HIGH (79.5%)", isHigh: true }
                  ].map((tx, idx) => (
                    <tr key={idx} className={`hover:bg-slate-50 transition-colors ${tx.isCrit ? 'bg-red-50/40' : ''}`}>
                      <td className="px-4 py-3 font-mono text-slate-500">{tx.time}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">{tx.utr}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{tx.sender}</td>
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">{tx.receiver}</td>
                      <td className="px-4 py-3 font-extrabold text-slate-900">{tx.amount}</td>
                      <td className="px-4 py-3 text-slate-600">{tx.channel}</td>
                      <td className="px-4 py-3 text-slate-600">{tx.location}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          tx.isCrit ? 'bg-red-100 text-red-700' : tx.isHigh ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {tx.risk}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onNavigate('shap-explainability')}
                          className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                        >
                          Inspect SHAP
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    // -----------------------------------------------------------------
    // MODULE 04: Agentic AI Control Centre
    // -----------------------------------------------------------------
    case 'agentic-control':
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Cpu className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">Agentic AI Control Centre & Autonomous Multi-Agent Mesh</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Supervised multi-agent architecture enforcing strict human authorization boundaries.
              </p>
            </div>
            <button
              onClick={() => handleRunSimulation("orchestration_consensus")}
              disabled={simulating}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
              <span>{simulating ? 'Orchestrating Agents...' : 'Trigger Agent Consensus Loop'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(systemData?.agentic_orchestrator?.agents || []).map((agent: any) => (
              <div key={agent.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: agent.color }}></span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {agent.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{agent.name}</h4>
                  <p className="text-[10px] font-medium text-slate-500 mt-0.5">{agent.role}</p>
                  <p className="text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-3 font-mono leading-tight">
                    {agent.last_log}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                  <span>Health: <strong className="text-slate-800">{agent.health}%</strong></span>
                  <span>Active Tasks: <strong className="text-slate-800">{agent.active_tasks}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Master Governance Rule Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
            <div className="text-xs text-amber-900">
              <strong className="font-bold">Human-in-the-Loop Governance Guard:</strong> Agents possess authority to assemble evidence, evaluate mathematical models, and draft legal notices. Autonomous account freezing or debit restriction without human officer signature is strictly prohibited under Rule 1.1.
            </div>
          </div>
        </div>
      );

    // -----------------------------------------------------------------
    // MODULE 05: KYC Intelligence
    // -----------------------------------------------------------------
    case 'kyc-intelligence':
      return <KycIntelligence onNavigate={onNavigate} />;

    // -------------------------------------------------------------
    // MODULE 06: Mule Account Detection
    // -------------------------------------------------------------
    case 'mule-detection':
      return <MuleAccountDetection onNavigate={onNavigate} />;

    // -------------------------------------------------------------
    // MODULE 07: Money Trail Analysis (MULTI-HOP FUND DISPERSAL GRAPH)
    // -------------------------------------------------------------
    case 'money-trail':
      return (
        <MoneyTrailAnalysis
          initialAccountId={selectedTrailAccount}
          onNavigate={onNavigate}
        />
      );

    // -----------------------------------------------------------------
    // MODULE 10: SHAP Explainability & Risk Intelligence (Powered by creditcard.csv)
    // -----------------------------------------------------------------
    case 'shap-explainability':
    case 'ai-risk':
    case 'account-risk':
      return <AiRiskIntelligence />;

    // -----------------------------------------------------------------
    // MODULE 11: Digital Twin Simulation
    // -----------------------------------------------------------------
    case 'digital-twin':
      return <DigitalTwinSimulation onNavigate={onNavigate} />;

    // -----------------------------------------------------------------
    // MODULE 12: Attack Intelligence
    // -----------------------------------------------------------------
    case 'attack-intel':
      return <AttackIntelligence onNavigate={onNavigate} />;

    // -----------------------------------------------------------------
    // MODULE 13: Domain Intelligence
    // -----------------------------------------------------------------
    case 'domain-intel':
      return <DomainIntelligence onNavigate={onNavigate} />;

    // -----------------------------------------------------------------
    // MODULE 14: IP Intelligence
    // -----------------------------------------------------------------
    case 'ip-intel':
      return <IpIntelligence onNavigate={onNavigate} />;

    // -----------------------------------------------------------------
    // MODULE 08: Relationship Graph
    // -----------------------------------------------------------------
    case 'relationship-graph':
      return <RelationshipGraph onNavigate={onNavigate} />;

    // -----------------------------------------------------------------
    // MODULE 17: Real-Time Alerts
    // -----------------------------------------------------------------
    case 'alerts':
      return <RealTimeAlerts onNavigate={onNavigate} />;

    // -----------------------------------------------------------------
    // MODULE 18: Automated Response Management (GOVERNED HUMAN APPROVAL)
    // -----------------------------------------------------------------
    case 'automated-response':
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">Automated Response Management (Human-in-the-Loop SOAR)</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Governed policy execution requiring mandatory cryptographic signature from an authorized investigator.
              </p>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
              approvalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
            }`}>
              {approvalStatus === 'APPROVED' ? 'Action Executed: Frozen' : 'Awaiting Investigator Approval'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 4-Step Pipeline Tracker */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-900">Governed Execution Pipeline</h3>
              <div className="space-y-4 text-xs font-semibold">
                {[
                  { step: 1, title: "Alert Generated", time: "18:45:00", desc: "XGBoost & Mule Agent flagged AC78456", done: true },
                  { step: 2, title: "Investigator Notified", time: "18:46:00", desc: "Push notification dispatched to Lead Cyber Analyst", done: true },
                  { step: 3, title: "Review in Progress", time: "18:47:00", desc: "Forensic evidence package compiled and hashed", done: true },
                  { step: 4, title: "Action Pending Approval", time: "18:48:00", desc: "Judicial notice drafted under Section 102 CrPC", done: approvalStatus === 'APPROVED' }
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      s.done ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 text-slate-400'
                    }`}>
                      {s.done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
                    </div>
                    <div>
                      <div className="text-slate-900 font-bold flex items-center gap-2">
                        <span>{s.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{s.time}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Human Authorization Form */}
            <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Investigator Authorization Checkpoint</h3>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Suspect Account:</span>
                  <strong className="font-mono text-red-600">AC78456 (Axis Bank)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Proposed Action:</span>
                  <strong className="text-slate-900">EMERGENCY_DEBIT_FREEZE</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">At-Risk Exposure:</span>
                  <strong className="text-slate-900">₹12,50,000</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statutory Power:</span>
                  <strong className="text-slate-900">Section 102 CrPC / PMLA Section 5 Order Drafted</strong>
                </div>
              </div>

              {approvalStatus === 'APPROVED' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Action Succeeded: Account Frozen & Notified to Axis Bank Nodal Officer</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Cryptographic sign-off logged to immutable audit ledger (Hash: <span className="font-mono">7b4a2e...</span>).
                  </p>
                </div>
              ) : approvalStatus === 'REJECTED' ? (
                <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700">
                  Action was declined by Investigator. Account remains active.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Investigator Case Notes / Judicial Justification:
                    </label>
                    <textarea
                      rows={2}
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Enter legal justification for emergency account freeze..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleApproveAction}
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approve & Sign Debit Freeze</span>
                    </button>

                    <button
                      onClick={handleRejectAction}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4 text-slate-500" />
                      <span>Reject Action</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    // -----------------------------------------------------------------
    // MODULE 19: Evidence Management
    // -----------------------------------------------------------------
    case 'evidence':
      return <EvidenceManagement onNavigate={onNavigate} />;

    // -----------------------------------------------------------------
    // MODULE 20: Investigation Case Management
    // -----------------------------------------------------------------
    case 'investigations':
      return <InvestigationCaseManagement onNavigate={onNavigate} />;

    // -----------------------------------------------------------------
    // MODULE 22: Investigation Reports
    // -----------------------------------------------------------------
    case 'reports':
      return <InvestigationReports onNavigate={onNavigate} />;

    // -----------------------------------------------------------------
    // MODULE 23: Audit Logs
    // -----------------------------------------------------------------
    case 'audit-logs':
      return <AuditLogs onNavigate={onNavigate} />;

    // -----------------------------------------------------------------
    // MODULE 24: Platform Settings & RBAC
    // -----------------------------------------------------------------
    case 'settings':
      return <SettingsModule onNavigate={onNavigate} />;

    // -----------------------------------------------------------------
    // MODULE 15: Live Google Maps (Tactical Police Geospatial Grid)
    // -----------------------------------------------------------------
    case 'maps':
      return <LiveGoogleMaps onNavigate={onNavigate} initialAccountId={selectedTrailAccount} />;

    // -------------------------------------------------------------
    // SEPARATE FEATURE: Tactical AI & CDR Workbench
    // -------------------------------------------------------------
    case 'tactical-workbench':
      return <TacticalAiWorkbench onNavigate={onNavigate} targetAccount={selectedTrailAccount} />;


    // -----------------------------------------------------------------
    // DEFAULT: Universal Module Container
    // -----------------------------------------------------------------
    default:
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 capitalize">
              {moduleId.replace(/-/g, ' ')} Module
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Active forensic intelligence telemetry and operations workbench for {moduleId}.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Active Live Telemetry Connected</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              This module is operating synchronously with the FINTRACE Master Orchestrator, listening to live events on the WebSocket bus.
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              ← Return to Main Command Centre
            </button>
          </div>
        </div>
      );
  }
};
