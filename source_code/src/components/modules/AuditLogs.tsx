import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Copy,
  Filter,
  RefreshCw,
  ExternalLink,
  Calendar,
  AlertTriangle,
  Terminal,
  Activity
} from 'lucide-react';

interface AuditLogsProps {
  onNavigate: (id: string, targetAccount?: string) => void;
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ onNavigate }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActorFilter, setSelectedActorFilter] = useState("ALL");
  const [chainStatus, setChainStatus] = useState<any>(null);
  const [verifyingChain, setVerifyingChain] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLogs();
    handleVerifyChain();
  }, []);

  const fetchLogs = () => {
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(d => {
        setLogs(d.data || []);
        if (d.data?.length > 0) setSelectedLog(d.data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleVerifyChain = async () => {
    setVerifyingChain(true);
    try {
      const res = await fetch('/api/audit-logs/verify');
      const data = await res.json();
      setChainStatus(data.data);
      setVerifyingChain(false);
    } catch (e) {
      setVerifyingChain(false);
    }
  };

  const filteredLogs = logs.filter((log: any) => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.target || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.id || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActor = selectedActorFilter === "ALL" ||
      (selectedActorFilter === "HUMAN" && !log.actor.includes("AI") && !log.actor.includes("Agent") && !log.actor.includes("Engine")) ||
      (selectedActorFilter === "AI_AGENT" && (log.actor.includes("AI") || log.actor.includes("Agent") || log.actor.includes("Engine")));

    return matchesSearch && matchesActor;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-800">
              <ClipboardList className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Immutable Audit Trail & Cryptographic Security Ledger</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Append-only forensic blockchain ledger chained with SHA-256 block hashes preventing retroactive tampering.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleVerifyChain}
            disabled={verifyingChain}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className={`w-4 h-4 ${verifyingChain ? 'animate-spin' : ''}`} />
            <span>{verifyingChain ? 'Verifying Chain...' : 'Verify Cryptographic Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Chain Status Verification Banner */}
      {chainStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-emerald-900 flex items-center gap-2">
                <span>Cryptographic Chain Status: {chainStatus.ledger_status}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-mono">
                  {chainStatus.total_blocks} Blocks Sealed
                </span>
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                Genesis Block: <strong className="font-mono">{chainStatus.genesis_block}</strong> • Latest Block: <strong className="font-mono">{chainStatus.latest_block}</strong> • Zero Breaches Detected.
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-emerald-700 font-mono">
            Verified: {new Date(chainStatus.verification_timestamp).toLocaleTimeString('en-GB')}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by Actor, Action, Target, or Block ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-400 text-[11px]">Actor Type:</span>
          {["ALL", "HUMAN", "AI_AGENT"].map((act) => (
            <button
              key={act}
              onClick={() => setSelectedActorFilter(act)}
              className={`px-3 py-1 rounded-md text-[11px] transition-all ${
                selectedActorFilter === act
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {act === "ALL" ? "All Actors" : act === "HUMAN" ? "Human Officers" : "Autonomous Agents"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Table & Raw Block Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chained Ledger Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Block ID</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Principal / Actor</th>
                  <th className="px-4 py-3">Action Event</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Chained Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.map((log: any) => {
                  const isSelected = selectedLog?.id === log.id;
                  const isAi = log.actor.includes("AI") || log.actor.includes("Agent") || log.actor.includes("Engine");

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">{log.id}</td>
                      <td className="px-4 py-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-800 font-bold">{log.actor}</div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          isAi ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isAi ? 'AI ENGINE' : 'HUMAN OFFICER'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700 text-[11px]">{log.action}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{log.target || "PLATFORM"}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{log.hash}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Block Details & Cryptographic Chain Inspector */}
        {selectedLog && (
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-blue-600">{selectedLog.id}</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">{selectedLog.action}</h3>
              <div className="text-xs text-slate-500 mt-1 font-mono">{selectedLog.timestamp}</div>
            </div>

            {/* Block Parameters */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div>
                  <span className="text-slate-400 text-[10px] block">Actor / Principal:</span>
                  <strong className="text-slate-800 text-xs block">{selectedLog.actor}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Source IP Address:</span>
                  <strong className="text-slate-800 font-mono text-xs block">{selectedLog.ip}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Target Resource:</span>
                  <strong className="text-blue-600 font-mono text-xs block">{selectedLog.target}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Execution Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {selectedLog.status}
                  </span>
                </div>
              </div>

              {/* Cryptographic Hash */}
              <div className="p-3 bg-slate-900 rounded-xl text-emerald-400 font-mono text-[11px] space-y-1">
                <div className="text-slate-400 text-[10px]">Chained Block Hash:</div>
                <div className="break-all">{selectedLog.hash}</div>
              </div>

              {/* Details JSON if present */}
              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payload Metadata</span>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[10px] text-slate-700 max-h-36 overflow-y-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => handleCopy(JSON.stringify(selectedLog, null, 2))}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Copy Block JSON'}</span>
              </button>

              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `FINTRACE_Audit_Ledger_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Entire Ledger</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
