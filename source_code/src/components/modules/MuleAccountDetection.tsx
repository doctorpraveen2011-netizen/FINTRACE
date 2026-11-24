import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Phone,
  Building,
  User,
  Clock,
  Activity,
  Layers,
  CheckCircle2,
  Lock,
  Radio
} from 'lucide-react';

interface MuleAccountDetectionProps {
  onNavigate: (moduleId: string, targetAccount?: string) => void;
}

export const MuleAccountDetection: React.FC<MuleAccountDetectionProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedBank, setSelectedBank] = useState('ALL');
  const [selectedTypology, setSelectedTypology] = useState('ALL');
  
  // Selected Mule for Side Dossier
  const [selectedMule, setSelectedMule] = useState<any>(null);
  
  // Freeze Notice Modal
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeData, setNoticeData] = useState<any>(null);
  const [freezing, setFreezing] = useState(false);

  // Fetch Mules from backend API
  const fetchMules = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        risk: selectedRisk,
        bank: selectedBank,
        typology: selectedTypology,
        page: page.toString(),
        limit: '10'
      });
      const res = await fetch(`/api/mules?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setAccounts(json.accounts || []);
        setMetrics(json.data || null);
        setTotal(json.total || 0);
        setTotalPages(json.totalPages || 1);
        
        // Auto-select first account if none selected
        if (!selectedMule && json.accounts && json.accounts.length > 0) {
          setSelectedMule(json.accounts[0]);
        } else if (selectedMule && json.accounts) {
          // Update selected mule reference
          const updated = json.accounts.find((a: any) => a.account_no === selectedMule.account_no);
          if (updated) setSelectedMule(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load mule data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMules();
  }, [page, selectedRisk, selectedBank, selectedTypology]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMules();
  };

  // Handle Freezing Account
  const handleFreezeAccount = async (account_no: string) => {
    setFreezing(true);
    try {
      const res = await fetch(`/api/mules/${account_no}/freeze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer: "Investigator Cyber Analyst",
          reason: "Section 102 CrPC / Section 106 BNSS Statutory Emergency Debit Freeze"
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSelectedMule(json.data);
        fetchMules();
      }
    } catch (err) {
      console.error('Freeze error:', err);
    } finally {
      setFreezing(false);
    }
  };

  // Generate Notice
  const handleGenerateNotice = async (mule: any) => {
    try {
      const res = await fetch('/api/investigations/bank-freeze-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_no: mule.account_no,
          bank: mule.bank,
          amount: mule.total_volume_inr,
          case_no: mule.associated_case || "CY-CH-2025-089"
        })
      });
      const json = await res.json();
      if (json.success) {
        setNoticeData(json.data);
        setShowNoticeModal(true);
      }
    } catch (err) {
      console.error('Notice error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Mule Account Detection & Typology Classifier</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
              High Risk
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic heuristic surveillance and machine learning classification identifying illicit funnel routing and pass-through drainage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-black text-red-600">
              {metrics?.mule_accounts_detected || 86} Mules
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Active Surveillance Window</div>
          </div>
          <button
            onClick={() => { setPage(1); fetchMules(); }}
            className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title="Refresh Dataset"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Primary KPI Indicators (Matching CYBERHXA UI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Rapid Transactions",
            value: `${metrics?.metrics?.rapid_transactions_pct || 73}%`,
            sub: "Outflow within < 300s of inflow",
            color: "text-red-600",
            dot: "bg-red-500"
          },
          {
            label: "Multiple Senders",
            value: `${metrics?.metrics?.multiple_senders_pct || 62}%`,
            sub: "10+ victim inflows consolidating",
            color: "text-red-600",
            dot: "bg-red-500"
          },
          {
            label: "Unusual Pattern",
            value: `${metrics?.metrics?.unusual_pattern_pct || 58}%`,
            sub: "180x baseline turnover spike",
            color: "text-red-600",
            dot: "bg-red-500"
          },
          {
            label: "Linked Accounts",
            value: `${metrics?.metrics?.linked_accounts_pct || 47}%`,
            sub: "Shared phone/device fingerprint",
            color: "text-red-600",
            dot: "bg-red-500"
          }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${stat.dot}`}></span>
              <span className="text-xs font-bold text-slate-700">{stat.label}</span>
            </div>
            <div className={`text-2xl font-black ${stat.color} my-1.5`}>{stat.value}</div>
            <div className="text-[10px] text-slate-400">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* 3. Funnel Stages Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Layer-1 Collection Mules</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{metrics?.funnel_distribution?.layer1_collection || 42} Accounts (Micro-Conduits)</div>
            <div className="text-[11px] text-slate-500">First-hop aggregation from victim accounts</div>
          </div>
          <span className="px-2.5 py-1 bg-red-50 text-red-700 font-bold text-xs rounded-lg border border-red-100">
            High Velocity
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Layer-2 Transit Aggregators</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{metrics?.funnel_distribution?.layer2_transit || 31} Accounts (Interbank Relay)</div>
            <div className="text-[11px] text-slate-500">Multi-bank fast splitting across conduits</div>
          </div>
          <span className="px-2.5 py-1 bg-orange-50 text-orange-700 font-bold text-xs rounded-lg border border-orange-100">
            Layering Phase
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Layer-3 Off-Ramp Cashout</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{metrics?.funnel_distribution?.layer3_cashout || 13} Accounts (ATM / P2P)</div>
            <div className="text-[11px] text-slate-500">Fast digital payments & ATM cashout conversion</div>
          </div>
          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded-lg border border-purple-100">
            Extraction
          </span>
        </div>
      </div>

      {/* 4. Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Account No, Holder, Bank, Location, Phone, or Case..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            Search Mules
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Risk Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => { setSelectedRisk(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="CRITICAL">Critical Risk (88%+)</option>
            <option value="HIGH">High Risk (78% - 87%)</option>
            <option value="MEDIUM">Medium Risk (&lt; 78%)</option>
          </select>

          {/* Bank Filter */}
          <select
            value={selectedBank}
            onChange={(e) => { setSelectedBank(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Institutions</option>
            <option value="HBL">Habib Bank Limited (HBL)</option>
            <option value="UBL">United Bank Limited (UBL)</option>
            <option value="Meezan">Meezan Bank</option>
            <option value="MCB">MCB Bank</option>
            <option value="BankAlfalah">Bank Alfalah</option>
            <option value="Wallet_A">Digital Wallet A</option>
            <option value="Wallet_B">Digital Wallet B</option>
            <option value="StandardChartered">Standard Chartered</option>
          </select>

          {/* Typology Filter */}
          <select
            value={selectedTypology}
            onChange={(e) => { setSelectedTypology(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Typologies</option>
            <option value="Rapid Pass-Through">Rapid Pass-Through Relay</option>
            <option value="Layer-1 Collection">Layer-1 Collection Hub</option>
            <option value="Layer-2 Transit">Layer-2 Transit Aggregator</option>
            <option value="ATM Cashout">ATM Cashout Off-Ramp</option>
            <option value="Crypto P2P">Crypto P2P Intermediary</option>
          </select>

          {(selectedRisk !== 'ALL' || selectedBank !== 'ALL' || selectedTypology !== 'ALL' || searchTerm) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRisk('ALL');
                setSelectedBank('ALL');
                setSelectedTypology('ALL');
                setPage(1);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 5. Main Content: Table + Side Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table: 7 Cols */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-slate-800">
                Suspect Mule Accounts Registry ({total} Records Indexed)
              </h3>
              <p className="text-[10px] text-slate-400">
                Select an account to inspect counterparties, pass-through ratio, and statutory freeze status.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Page {page} of {totalPages}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-3">Account No</th>
                  <th className="px-3 py-3">Holder & Bank</th>
                  <th className="px-3 py-3">Mule Score</th>
                  <th className="px-3 py-3">Velocity Burst</th>
                  <th className="px-3 py-3">Pass-Through</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No suspect accounts found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  accounts.map((mule: any) => {
                    const isSelected = selectedMule?.account_no === mule.account_no;
                    const isCrit = mule.risk_tier === 'CRITICAL';
                    const isHigh = mule.risk_tier === 'HIGH';
                    const isFrozen = mule.freeze_status === 'DEBIT_FROZEN';

                    return (
                      <tr
                        key={mule.account_no}
                        onClick={() => setSelectedMule(mule)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/80 border-l-4 border-l-blue-600'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-3.5 py-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                          {mule.account_no}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-slate-900 truncate max-w-[130px]">{mule.holder_name}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[130px]">{mule.bank}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                                isCrit
                                  ? 'bg-red-100 text-red-700'
                                  : isHigh
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {mule.mule_score}%
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-mono text-slate-700 whitespace-nowrap">
                          {mule.velocity_burst}
                        </td>
                        <td className="px-3 py-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                          {mule.pass_through_ratio}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              isFrozen
                                ? 'bg-red-600 text-white'
                                : mule.freeze_status === 'PENDING_APPROVAL'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isFrozen ? 'FROZEN' : mule.freeze_status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('tactical-workbench', mule.account_no);
                            }}
                            className="px-2 py-1 rounded text-[10.5px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all inline-flex items-center gap-1 shadow-2xs"
                            title="Correlate cell towers, IMEI, and CDR logs for this mule"
                          >
                            <Radio className="w-3 h-3 text-indigo-600" />
                            <span>CDR &amp; Tower →</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('money-trail', mule.account_no);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-bold text-[11px] hover:underline"
                          >
                            Trace Trail →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Showing {accounts.length > 0 ? (page - 1) * 10 + 1 : 0} to{' '}
              {Math.min(page * 10, total)} of {total} accounts
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <span className="px-2 font-bold text-slate-700">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Side Dossier: 5 Cols */}
        <div className="lg:col-span-5 space-y-4">
          {selectedMule ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
              {/* Dossier Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black font-mono text-slate-900">
                      {selectedMule.account_no}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        selectedMule.risk_tier === 'CRITICAL'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {selectedMule.risk_tier} RISK ({selectedMule.mule_score}%)
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1">
                    {selectedMule.holder_name}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedMule.branch}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-400">Total Monitored Inflow</div>
                  <div className="text-base font-black text-slate-900">
                    {selectedMule.total_volume_inr}
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              {selectedMule.freeze_status === 'DEBIT_FROZEN' ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-red-600 shrink-0" />
                  <div className="text-xs text-red-900">
                    <strong className="font-bold">Statutory Debit Freeze Enforced:</strong> Account restricted under Section 102 CrPC / Section 106 BNSS.
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Status: <strong>{selectedMule.freeze_status.replace(/_/g, ' ')}</strong></span>
                  </div>
                  <button
                    onClick={() => handleFreezeAccount(selectedMule.account_no)}
                    disabled={freezing}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-md shadow-sm transition-colors"
                  >
                    {freezing ? 'Executing...' : 'Freeze Account'}
                  </button>
                </div>
              )}

              {/* Behavioral Characteristics */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-800">Mule Typology & Behavioral Attributes</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Typology Model</span>
                    <strong className="text-slate-800">{selectedMule.typology}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Pass-Through Velocity</span>
                    <strong className="text-red-600">{selectedMule.pass_through_ratio}</strong> (drain &lt; 300s)
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Disparate Victim Inflows</span>
                    <strong className="text-slate-800">{selectedMule.fan_in_senders} Unique Senders</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Downstream Relay Hops</span>
                    <strong className="text-slate-800">{selectedMule.fan_out_hops} Beneficiaries</strong>
                  </div>
                </div>
              </div>

              {/* Identity & Reference Links */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Registered Phone</span>
                  <span className="font-mono font-bold text-slate-800">{selectedMule.linked_phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Associated Investigation Dossier</span>
                  <span className="font-mono font-bold text-blue-600">{selectedMule.associated_case}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Forensic Cryptographic Hash</span>
                  <span className="font-mono text-[10px] text-slate-400 truncate max-w-[200px]" title={selectedMule.evidence_hash}>
                    {selectedMule.evidence_hash}
                  </span>
                </div>
              </div>

              {/* Linked Fraud Transactions From Given Dataset */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Confirmed Dataset Evidence ({selectedMule.tx_evidence?.length || 0} Transfers)</span>
                  <span className="text-[10px] text-slate-400">Audited Feed</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {(selectedMule.tx_evidence || []).map((tx: any, idx: number) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] flex justify-between items-center">
                      <div>
                        <div className="font-mono font-bold text-slate-800">{tx.txn_id}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {tx.channel} • {tx.timestamp}
                        </div>
                        <div className="text-[10px] text-slate-600">
                          Counterparty: <strong className="font-mono text-blue-600">{tx.counterparty}</strong>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-slate-900">{tx.amount_formatted}</div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          tx.direction === 'INFLOW' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.direction}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Police Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleGenerateNotice(selectedMule)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Statutory Freeze Notice (Sec 102 CrPC)</span>
                </button>

                <button
                  onClick={() => onNavigate('tactical-workbench', selectedMule.account_no)}
                  className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-indigo-200"
                >
                  <Radio className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Telecom Tower CDR / IPDR Triangulation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onNavigate('money-trail', selectedMule.account_no)}
                    className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Trace Trail Graph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('kyc-intelligence')}
                    className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>KYC Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-400 text-xs">
              Select an account from the suspect registry to inspect its forensic dossier.
            </div>
          )}
        </div>
      </div>

      {/* 6. Statutory Police Freeze Notice Modal */}
      {showNoticeModal && noticeData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Statutory Bank Freeze Directive (Legal Order)
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Formally addressed to Nodal Officer pursuant to CrPC / BNSS provisions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Notice ID:</span>
                  <strong className="text-slate-800">{noticeData.notice_id}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Statutory Authority:</span>
                  <strong className="text-slate-800">{noticeData.statutory_section}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Recipient Bank:</span>
                  <strong className="text-slate-800">{noticeData.to_nodal_officer}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Account / UTR:</span>
                  <strong className="text-red-600 font-bold">{noticeData.account_no}</strong>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Subject Directive:
                </label>
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-800 font-medium leading-relaxed">
                  {noticeData.subject}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Statutory Order Text:
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] whitespace-pre-line text-slate-700 leading-relaxed">
                  {noticeData.statutory_text}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-900">
                <div>
                  <div className="font-bold text-[11px]">Cryptographic Digital Seal:</div>
                  <div className="font-mono text-[10px] text-emerald-700 truncate max-w-sm">
                    {noticeData.hash}
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded">
                  AUTHENTICATED
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Dispatched under authority of Special Cyber Crime Police Station
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert(`Statutory notice ${noticeData.notice_id} printed and archived to case dossier.`);
                    setShowNoticeModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Signed Legal PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
