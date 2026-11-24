import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  ShieldAlert,
  AlertTriangle,
  FileText,
  ExternalLink,
  Download,
  Copy,
  CheckCircle2,
  Lock,
  Server,
  RefreshCw,
  Send,
  Radio
} from 'lucide-react';

interface DomainIntelligenceProps {
  onNavigate: (id: string, targetAccount?: string) => void;
}

export const DomainIntelligence: React.FC<DomainIntelligenceProps> = ({ onNavigate }) => {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanInput, setScanInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedDomainNotice, setSelectedDomainNotice] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/domain-intel')
      .then(res => res.json())
      .then(data => {
        setDomains(data.data?.flagged_domains || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!scanInput.trim()) return;
    setScanning(true);
    try {
      const res = await fetch('/api/domain-intel/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: scanInput })
      });
      const data = await res.json();
      setScanResult(data.data);
      setScanning(false);
    } catch (e) {
      setScanning(false);
    }
  };

  const filteredDomains = domains.filter((d: any) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "PHISHING") return d.status === "ACTIVE_PHISHING";
    if (activeFilter === "HARVESTER") return d.status === "CREDENTIAL_HARVESTER";
    if (activeFilter === "FAST_FLUX") return d.status === "FAST_FLUX_HOSTED";
    return true;
  });

  const handleCopyNotice = (text: string) => {
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
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Globe className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Domain Intelligence & Phishing Radar</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated brand impersonation radar, fast-flux DNS detection, and Section 79(3)(b) IT Act takedown enforcement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
            Active Threat Feeds: 8 Domains Flagged
          </span>
        </div>
      </div>

      {/* Interactive Domain Scanner Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleScan} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter suspect URL or domain name (e.g., sbi-kyc-verification.online, axis-rewards.in)..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={scanning || !scanInput.trim()}
            className="w-full sm:w-auto py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Analyzing Domain...' : 'Scan Domain & WHOIS'}</span>
          </button>
        </form>

        {/* Live Scan Result Box */}
        {scanResult && (
          <div className={`mt-4 p-4 rounded-xl border text-xs space-y-3 ${
            scanResult.verdict === 'MALICIOUS_PHISHING_DOMAIN'
              ? 'bg-red-50/70 border-red-200'
              : 'bg-emerald-50/70 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  scanResult.verdict === 'MALICIOUS_PHISHING_DOMAIN' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {scanResult.verdict}
                </span>
                <span className="font-mono font-bold text-slate-900">{scanResult.domain}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500">Risk Confidence: </span>
                <strong className={`text-sm font-extrabold ${scanResult.risk_score > 70 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {scanResult.risk_score}%
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] bg-white p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block">Target Bank:</span>
                <strong className="text-slate-800">{scanResult.target_bank}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Registrar:</span>
                <strong className="text-slate-800 truncate block">{scanResult.registrar}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Resolved IP:</span>
                <strong className="text-slate-800 font-mono">{scanResult.ip_resolution}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Phishing Kit:</span>
                <strong className="text-red-600 font-mono truncate block">{scanResult.phishing_kit_signature}</strong>
              </div>
            </div>

            {scanResult.notice_draft && (
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-600 text-[11px]">Section 79(3)(b) Takedown Notice automatically compiled.</span>
                <button
                  onClick={() => setSelectedDomainNotice(scanResult)}
                  className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 text-xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View & Export Takedown Notice</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Flagged Domains Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">Active Phishing Infrastructure</span>
            <span className="text-xs text-slate-400">({filteredDomains.length} records)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-[11px] font-semibold">
            {["ALL", "PHISHING", "HARVESTER", "FAST_FLUX"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeFilter === tab ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Target Entity</th>
                <th className="px-4 py-3">Registrar / Created</th>
                <th className="px-4 py-3">Resolved IP</th>
                <th className="px-4 py-3">Risk Index</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Takedown Progress</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDomains.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-blue-600 flex items-center gap-1.5">
                      <span>{d.domain}</span>
                      <ExternalLink className="w-3 h-3 text-slate-300" />
                    </div>
                    <div className="text-[10px] text-slate-400">Kit: {d.phishing_kit}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-800 font-semibold">{d.target_bank}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{d.registrar}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{d.created_date}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">{d.ip_address}</td>
                  <td className="px-4 py-3">
                    <span className="font-extrabold text-red-600">{d.risk_score}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      d.status === 'ACTIVE_PHISHING'
                        ? 'bg-red-100 text-red-700'
                        : d.status === 'CREDENTIAL_HARVESTER'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      d.takedown_status === 'TAKEDOWN_SUCCESSFUL'
                        ? 'bg-emerald-100 text-emerald-800'
                        : d.takedown_status === 'NOTICE_SERVED_SEC79'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.takedown_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedDomainNotice({
                        domain: d.domain,
                        target_bank: d.target_bank,
                        registrar: d.registrar,
                        ip_resolution: d.ip_address,
                        notice_draft: `NOTICE UNDER SECTION 79(3)(b) OF THE INFORMATION TECHNOLOGY ACT, 2000:\nTo: Nodal Abuse Desk of ${d.registrar}\nSubject: Urgent Takedown Demand for Phishing Domain: ${d.domain}\nThis is a formal statutory notice from the Cyber Crime Investigation Division. The domain ${d.domain} is engaged in active credential harvesting and fraud targeting ${d.target_bank} consumers linked to Primary Syndicate Node AC78456.`
                      })}
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                    >
                      <span>Notice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Takedown Notice Modal */}
      {selectedDomainNotice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Section 79(3)(b) Statutory Takedown Notice</h3>
                <p className="text-xs text-slate-500">Official legal directive for domain registry and hosting takedown.</p>
              </div>
              <button
                onClick={() => setSelectedDomainNotice(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {selectedDomainNotice.notice_draft}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Governed under Information Technology (Intermediary Guidelines) Rules, 2021.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyNotice(selectedDomainNotice.notice_draft)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Section 79 Notice for ${selectedDomainNotice.domain} dispatched to Registrar Nodal Desk & CERT-In.`);
                    setSelectedDomainNotice(null);
                  }}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Registrar Nodal Desk</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
