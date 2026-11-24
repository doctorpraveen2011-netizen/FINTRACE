import React, { useState, useEffect } from 'react';
import {
  Target,
  ShieldAlert,
  Search,
  ExternalLink,
  Users,
  Building2,
  Terminal,
  AlertTriangle,
  Flame,
  ArrowRight,
  Fingerprint,
  Radio,
  FileCheck2,
  Check
} from 'lucide-react';

interface AttackIntelligenceProps {
  onNavigate: (id: string, targetAccount?: string) => void;
}

export const AttackIntelligence: React.FC<AttackIntelligenceProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"syndicates" | "mitre">("syndicates");
  const [selectedSyndicate, setSelectedSyndicate] = useState<any>(null);

  useEffect(() => {
    fetch('/api/attack-intel')
      .then(res => res.json())
      .then(d => {
        setData(d.data);
        if (d.data?.active_syndicates?.length > 0) {
          setSelectedSyndicate(d.data.active_syndicates[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const syndicates = data?.active_syndicates || [];
  const mitreMappings = data?.mitre_attack_mappings || [];

  const filteredSyndicates = syndicates.filter((s: any) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.modus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-50 text-red-600">
              <Target className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Attack Intelligence & Transnational Threat Syndicates</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time attribution, modus operandi profiling, and MITRE ATT&CK for Enterprise & Financial Cybercrime mappings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab("syndicates")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "syndicates" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Active Syndicates ({syndicates.length})
            </button>
            <button
              onClick={() => setActiveTab("mitre")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "mitre" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              MITRE ATT&CK Matrix ({mitreMappings.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === "syndicates" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Syndicates List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search syndicates by name, origin, or rail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-3">
              {filteredSyndicates.map((syn: any) => {
                const isSelected = selectedSyndicate?.id === syn.id;
                return (
                  <div
                    key={syn.id}
                    onClick={() => setSelectedSyndicate(syn)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-50/40 border-red-500 ring-1 ring-red-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-bold text-slate-400">{syn.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        syn.threat_level === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {syn.threat_level} THREAT
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs mb-1">{syn.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{syn.origin}</p>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Active Mules: <strong className="text-slate-800">{syn.active_mules}</strong></span>
                      <span className="text-slate-400">Monthly Volume: <strong className="text-red-600">{syn.estimated_monthly_turnover}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Syndicate Dossier */}
          {selectedSyndicate && (
            <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                      {selectedSyndicate.threat_level}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{selectedSyndicate.id}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{selectedSyndicate.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>Geographic Origin:</span>
                    <strong className="text-slate-800 font-semibold">{selectedSyndicate.origin}</strong>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('investigations')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                >
                  <span>Open Active Case</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Modus Operandi Card */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-600" />
                  <span>Modus Operandi & Execution Blueprint</span>
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {selectedSyndicate.modus}
                </div>
              </div>

              {/* Targeted Financial Institutions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Primary Targeted Financial Institutions & Channels</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSyndicate.targeted_banks.map((bank: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold rounded-lg">
                      {bank}
                    </span>
                  ))}
                </div>
              </div>

              {/* Command and Control (C2) Infrastructure */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-700" />
                  <span>Identified Command-and-Control (C2) & Proxy Infrastructure</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {selectedSyndicate.c2_infrastructure.map((c2: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg border border-slate-800 truncate">
                      {c2}
                    </div>
                  ))}
                </div>
              </div>

              {/* Indicators of Compromise (IOCs) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Forensic Indicators of Compromise (IOCs)</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedSyndicate.iocs.map((ioc: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span>{ioc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="text-[11px] text-slate-400">
                  Associated Legal Dockets: <span className="font-mono text-slate-600 font-bold">{selectedSyndicate.associated_cases.join(", ")}</span>
                </div>
                <button
                  onClick={() => onNavigate('maps')}
                  className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Track Kiosks on Police Grid</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MITRE ATT&CK Matrix Grid */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">MITRE ATT&CK for Enterprise & Banking Cybercrime Matrix</h3>
              <p className="text-xs text-slate-500">Structured threat tactics, detection rules, and statutory mitigation playbooks.</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              8 Standardized Techniques
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mitreMappings.map((technique: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 transition-all space-y-3 bg-slate-50/40">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-extrabold bg-blue-100 text-blue-800">
                    {technique.technique_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    technique.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {technique.stage} • {technique.severity}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">{technique.name}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{technique.description}</p>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-[11px] space-y-1.5">
                  <div>
                    <span className="font-bold text-slate-700">Detection Rule: </span>
                    <span className="text-slate-600 font-mono text-[10px]">{technique.detection_rule}</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-700">Recommended Statutory Mitigation: </span>
                    <span className="text-slate-700">{technique.mitigation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
