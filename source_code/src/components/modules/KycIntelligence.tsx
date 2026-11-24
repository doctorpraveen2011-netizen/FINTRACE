import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Search,
  Building2,
  Smartphone,
  ExternalLink,
  Shield,
  Layers,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

interface LinkedAccount {
  account: string;
  institution?: string;
  reason: string;
  risk: string;
  risk_level: string;
}

interface VerificationStep {
  step: string;
  status?: string;
  latency?: string;
  completed: boolean;
}

interface RiskIndicator {
  indicator: string;
  risk: string;
  severity: string;
  detail?: string;
}

interface KycProfile {
  account_id: string;
  holder_name: string;
  institution: string;
  kyc_score: number;
  status: string;
  synthetic_identity_prob: string;
  mule_conduit_prob: string;
  investigation_note?: string;
  pan_number: string;
  pan_match: string;
  aadhaar_number: string;
  aadhaar_match: string;
  passport_number: string;
  passport_match: string;
  linked_accounts: LinkedAccount[];
  verification_flow: VerificationStep[];
  risk_indicators: RiskIndicator[];
  radar_vector: {
    name_variant_risk: number;
    age_address_consistency: number;
    device_profiling: number;
    behavioral_patterns: number;
    registry_correspondence: number;
  };
}

interface FraudReport {
  report_id: string;
  txn_id: string;
  reported_by_institution: string;
  report_day: number;
  outcome: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  amount_formatted: string;
  timestamp: string;
  channel: string;
}

interface KycIntelligenceProps {
  onNavigate?: (module: string) => void;
}

export const KycIntelligence: React.FC<KycIntelligenceProps> = ({ onNavigate }) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('AC78456');
  const [searchInput, setSearchInput] = useState<string>('');
  const [kycData, setKycData] = useState<KycProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Interbank Fraud Reports states (loaded from provided dataset)
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [reportsTotal, setReportsTotal] = useState<number>(0);
  const [reportsPage, setReportsPage] = useState<number>(1);
  const [reportsTotalPages, setReportsTotalPages] = useState<number>(1);
  const [selectedInstitution, setSelectedInstitution] = useState<string>('All Institutions');
  const [selectedChannel, setSelectedChannel] = useState<string>('All Channels');
  const [reportsSearch, setReportsSearch] = useState<string>('');

  // Fetch KYC Profile for selected account
  const fetchKycProfile = async (accId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/kyc?account_id=${encodeURIComponent(accId)}`);
      if (res.ok) {
        const json = await res.json();
        setKycData(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch KYC profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Fraud Reports
  const fetchFraudReports = async () => {
    try {
      const params = new URLSearchParams({
        page: reportsPage.toString(),
        limit: '6',
        institution: selectedInstitution,
        channel: selectedChannel,
        search: reportsSearch
      });
      const res = await fetch(`/api/kyc/reports?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setReports(json.data || []);
        setReportsTotal(json.total || 0);
        setReportsTotalPages(json.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch fraud reports:', err);
    }
  };

  useEffect(() => {
    fetchKycProfile(selectedAccountId);
  }, [selectedAccountId]);

  useEffect(() => {
    fetchFraudReports();
  }, [reportsPage, selectedInstitution, selectedChannel, reportsSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedAccountId(searchInput.trim());
    }
  };

  // Radar chart geometry for 5 axes:
  // Center (150, 150), Max Radius = 90
  const cx = 150;
  const cy = 150;
  const maxR = 90;
  const axes = [
    { key: 'name_variant_risk', label: 'Name Variant Risk', angle: -90 },
    { key: 'age_address_consistency', label: 'Age-Address Consistency', angle: -18 },
    { key: 'device_profiling', label: 'Device Profiling', angle: 54 },
    { key: 'behavioral_patterns', label: 'Behavioral Patterns', angle: 126 },
    { key: 'registry_correspondence', label: 'Registry Correspondence', angle: 198 }
  ];

  const radarValues = kycData?.radar_vector || {
    name_variant_risk: 8.2,
    age_address_consistency: 4.9,
    device_profiling: 3.8,
    behavioral_patterns: 2.2,
    registry_correspondence: 3.0
  };

  // Calculate polygon points
  const polygonPoints = axes.map((axis) => {
    const val = (radarValues as any)[axis.key] || 5;
    const r = (val / 10) * maxR;
    const rad = (axis.angle * Math.PI) / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* ----------------------------------------------------------------- */}
      {/* HEADER CARD: Exact match to reference image                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs shrink-0">
            <FileCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              KYC Intelligence & Synthetic Identity Detection
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Automated document OCR, NSDL PAN verification, UIDAI Aadhaar biometrics, and synthetic identity risk profiling.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 shadow-2xs">
            KYC Score: {kycData?.kyc_score || 94.7}% ({kycData?.status || 'Verified'})
          </span>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* TARGET ACCOUNT SEARCH & SELECTION BAR                             */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700">Select Account:</span>
          {[
            { id: 'AC78456', label: 'AC78456 (Axis Bank — Operation DarkFlow)' },
            { id: 'AC91823', label: 'AC91823 (HDFC Bank — Delhi Digital Arrest)' },
            { id: 'acc_00008997', label: 'acc_00008997 (Meezan Bank — 1IBFT Mule)' },
            { id: 'acc_00044509', label: 'acc_00044509 (Wallet_B — Delayed Fraud)' },
            { id: 'acc_00062576', label: 'acc_00062576 (Meezan Bank — Recipient Node)' },
            { id: 'acc_00095629', label: 'acc_00095629 (MCB Bank — Relayed Conduit)' }
          ].map((acc) => (
            <button
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedAccountId === acc.id
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {acc.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
          <input
            type="text"
            placeholder="Search Account ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 text-xs cursor-pointer"
          >
            Lookup
          </button>
        </form>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* TOP ROW: Primary Holder Profile & Registry Validation Dossier     */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* CARD 1: Primary Holder Profile (Left ~38% width) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-2 border-b border-slate-100 mb-3">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Primary Holder Profile
              </h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Account Number</span>
                <span className="font-mono font-bold text-slate-900">{kycData?.account_id || selectedAccountId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Holder Name</span>
                <span className="font-bold text-slate-900">{kycData?.holder_name || 'Karthik Raja S.'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Bank & Branch</span>
                <span className="font-semibold text-slate-800">{kycData?.institution || 'Axis Bank (T.Nagar, Chennai)'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Synthetic Identity Probability</span>
                <span className="font-extrabold text-emerald-600">
                  {kycData?.synthetic_identity_prob || '2.1% (Low Risk)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Mule Conduit Probability</span>
                <span className="font-extrabold text-red-600">
                  {kycData?.mule_conduit_prob || '92.4% (Critical Compromise)'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] text-slate-500 leading-relaxed">
            {kycData?.investigation_note || `Forensic graph intelligence indicates high cross-account velocity with pass-through ratio exceeding ${kycData?.mule_conduit_prob || '92.4%'}.`}
          </div>
        </div>

        {/* CARD 2: Registry Validation Dossier (Right ~62% width) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
              Registry Validation Dossier
            </h2>

            {/* 3 Verification Cards (Exact Match to Image) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Tile 1: PAN Card */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs">PAN Card</span>
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-700 tracking-wide">
                  {kycData?.pan_number || 'ABCEE1234F'}
                </div>
                <div className="text-[10px] text-slate-500 mt-2">
                  Biometric Match: <strong className="text-slate-900 font-bold">{kycData?.pan_match || '98.2%'}</strong>
                </div>
              </div>

              {/* Tile 2: Aadhaar e-KYC */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs">Aadhaar e-KYC</span>
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-700 tracking-wide">
                  {kycData?.aadhaar_number || 'XXXX-XXXX-8024'}
                </div>
                <div className="text-[10px] text-slate-500 mt-2">
                  Biometric Match: <strong className="text-slate-900 font-bold">{kycData?.aadhaar_match || '95.0%'}</strong>
                </div>
              </div>

              {/* Tile 3: Passport */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs">Passport</span>
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-700 tracking-wide">
                  {kycData?.passport_number || 'V884216'}
                </div>
                <div className="text-[10px] text-slate-500 mt-2">
                  Biometric Match: <strong className="text-slate-900 font-bold">{kycData?.passport_match || '91.5%'}</strong>
                </div>
              </div>
            </div>

            {/* Linked Accounts Identified */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 mb-2.5">
                Linked Accounts Identified:
              </h3>
              <div className="space-y-2 text-xs">
                {(kycData?.linked_accounts || [
                  { account: 'AC91823 (HDFC Bank)', reason: 'Same Phone (+91 98401 23456)', risk: 'High Mule Risk', risk_level: 'HIGH' },
                  { account: 'AC44510 (State Bank of India)', reason: 'Joint Account', risk: 'Medium Risk', risk_level: 'MEDIUM' }
                ]).map((acc, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                      acc.risk_level === 'CRITICAL' || acc.risk_level === 'HIGH' || acc.risk.includes('High')
                        ? 'bg-red-50/60 border-red-200'
                        : 'bg-amber-50/50 border-amber-200'
                    }`}
                  >
                    <div>
                      <strong className="text-slate-900 font-bold">{acc.account}</strong>
                      <span className="text-slate-600 ml-1.5">— {acc.reason}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] whitespace-nowrap ${
                        acc.risk_level === 'CRITICAL' || acc.risk_level === 'HIGH' || acc.risk.includes('High')
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {acc.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* BOTTOM ROW: Real-time AI Analysis & Synthetic Identity Radar      */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* CARD 3: Real-time AI Analysis & Intelligence Insights (Left ~58%) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-5">
              Real-time AI Analysis & Intelligence Insights
            </h2>

            {/* Continuous Verification Flow Stepper */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-xs font-bold text-slate-800">
                  Continuous Verification Flow
                </h3>
                <span className="text-[10px] font-mono font-medium text-slate-400">
                  Live Pipeline Telemetry
                </span>
              </div>

              {/* Horizontal Stepper with precise circle center connector */}
              <div className="relative flex items-start justify-between px-2 pt-1 pb-3">
                {/* Background Connecting Line precisely at center of circle (circle h-7 -> center 14px) */}
                <div className="absolute left-8 right-8 top-[15px] h-[2px] bg-blue-500 z-0"></div>

                {(kycData?.verification_flow || [
                  { step: 'Data Ingestion', status: 'Ingested', latency: '12ms', completed: true },
                  { step: 'Document OCR', status: 'Passed (98.2%)', latency: '42ms', completed: true },
                  { step: 'Biometric Validation', status: 'Verified (95.0%)', latency: '85ms', completed: true },
                  { step: 'Cross-Registry Match', status: 'Registry Cleared', latency: '130ms', completed: true },
                  { step: 'Mule Probability Profiling', status: 'Flagged (92.4%)', latency: '210ms', completed: true }
                ]).map((s, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white ring-4 ring-white flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-blue-500/20">
                      ✓
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 mt-2 max-w-[76px] leading-tight">
                      {s.step}
                    </span>
                    <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 mt-1 max-w-[80px] truncate">
                      {s.status || 'Verified'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                      {s.latency || '24ms'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Potential Risk Indicators */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800">
                  Potential Risk Indicators
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {kycData?.risk_indicators?.length || 0} Risk Flags Identified
                </span>
              </div>
              <div className="space-y-2.5">
                {kycData?.risk_indicators && kycData.risk_indicators.length > 0 ? (
                  kycData.risk_indicators.map((ri, idx) => {
                    const sev = (ri.severity || '').toUpperCase();
                    const isCritical = sev === 'CRITICAL' || ri.risk.toLowerCase().includes('critical');
                    const isHigh = sev === 'HIGH' || ri.risk.toLowerCase().includes('high');
                    const isMedium = sev === 'MEDIUM' || ri.risk.toLowerCase().includes('medium');

                    const cardBg = isCritical
                      ? 'bg-red-50/60 border-red-200'
                      : isHigh
                      ? 'bg-rose-50/50 border-rose-200'
                      : isMedium
                      ? 'bg-amber-50/40 border-amber-200/80'
                      : 'bg-emerald-50/40 border-emerald-200/80';

                    const badgeBg = isCritical
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : isHigh
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : isMedium
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                    const iconBg = isCritical || isHigh
                      ? 'bg-red-100 text-red-700'
                      : isMedium
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-emerald-100 text-emerald-600';

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${cardBg} transition-all`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${iconBg}`}
                          >
                            {isCritical || isHigh || isMedium ? '!' : <Activity className="w-3 h-3 text-emerald-600" />}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-800 block">
                              {ri.indicator}
                            </span>
                            {ri.detail && (
                              <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
                                {ri.detail}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] whitespace-nowrap border shrink-0 ${badgeBg}`}>
                          {ri.risk}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 text-center">
                    No anomalous risk indicators active for this account profile.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: Synthetic Identity Vector Analysis (Right ~42%) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between items-center">
          <div className="w-full">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight text-center mb-1">
              Synthetic Identity Vector Analysis
            </h2>
            <p className="text-[11px] text-slate-400 text-center mb-2">
              Multivariate anomaly scores (0.0 – 10.0 scale)
            </p>
          </div>

          {/* Precision SVG Radar Chart */}
          <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center my-2">
            <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
              {/* Concentric Guide Pentagons */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, lIdx) => {
                const ringPoints = axes.map((a) => {
                  const rad = (a.angle * Math.PI) / 180;
                  const x = cx + maxR * level * Math.cos(rad);
                  const y = cy + maxR * level * Math.sin(rad);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(' ');
                return (
                  <polygon
                    key={lIdx}
                    points={ringPoints}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray={level < 1.0 ? '3,3' : 'none'}
                  />
                );
              })}

              {/* Radiating Axis Spokes */}
              {axes.map((a, i) => {
                const rad = (a.angle * Math.PI) / 180;
                const x = cx + maxR * Math.cos(rad);
                const y = cy + maxR * Math.sin(rad);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Shaded Radar Data Polygon */}
              <polygon
                points={polygonPoints}
                fill="rgba(37, 99, 235, 0.28)"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Vertex Markers & Score Labels */}
              {axes.map((a, i) => {
                const val = (radarValues as any)[a.key] || 5;
                const r = (val / 10) * maxR;
                const rad = (a.angle * Math.PI) / 180;
                const x = cx + r * Math.cos(rad);
                const y = cy + r * Math.sin(rad);

                // Label outer position
                const labelR = maxR + 24;
                const lx = cx + labelR * Math.cos(rad);
                const ly = cy + labelR * Math.sin(rad);

                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                    
                    <rect
                      x={x - 11}
                      y={y - 18}
                      width="22"
                      height="13"
                      rx="3"
                      fill="#1E293B"
                    />
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {val}
                    </text>

                    <text
                      x={lx}
                      y={ly + (a.angle === -90 ? -4 : a.angle > 90 ? 4 : 0)}
                      textAnchor={Math.abs(a.angle) === 90 ? 'middle' : a.angle > 0 && a.angle < 180 ? 'start' : 'end'}
                      fill="#475569"
                      fontSize="9"
                      fontWeight="600"
                    >
                      {a.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="w-full text-center pt-3 border-t border-slate-100 grid grid-cols-5 gap-1 text-xs">
            <div className="px-1">
              <span className="text-slate-400 text-[10px] block truncate">Name Variant</span>
              <strong className="text-blue-600 font-extrabold text-xs">{radarValues.name_variant_risk}</strong>
            </div>
            <div className="px-1">
              <span className="text-slate-400 text-[10px] block truncate">Age-Address</span>
              <strong className="text-slate-800 font-bold text-xs">{radarValues.age_address_consistency}</strong>
            </div>
            <div className="px-1">
              <span className="text-slate-400 text-[10px] block truncate">Device</span>
              <strong className="text-slate-800 font-bold text-xs">{radarValues.device_profiling}</strong>
            </div>
            <div className="px-1">
              <span className="text-slate-400 text-[10px] block truncate">Behavioral</span>
              <strong className="text-slate-800 font-bold text-xs">{radarValues.behavioral_patterns}</strong>
            </div>
            <div className="px-1">
              <span className="text-slate-400 text-[10px] block truncate">Registry</span>
              <strong className="text-slate-800 font-bold text-xs">{radarValues.registry_correspondence}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* SECTION 3: INTERBANK FRAUD REPORT REPOSITORY (Given Data)         */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Interbank Fraud Report Repository</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold">
                  {reportsTotal} Ingested Reports
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirmed delayed fraud and mule conduit alerts submitted by reporting financial institutions.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All Institutions">All Institutions</option>
              <option value="Meezan">Meezan Bank</option>
              <option value="HBL">HBL</option>
              <option value="UBL">UBL</option>
              <option value="MCB">MCB</option>
              <option value="BankAlfalah">BankAlfalah</option>
              <option value="StandardChartered">Standard Chartered</option>
              <option value="Wallet_A">Wallet_A</option>
              <option value="Wallet_B">Wallet_B</option>
            </select>

            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All Channels">All Channels</option>
              <option value="1ibft">1ibft</option>
              <option value="raast">raast</option>
              <option value="intrabank">intrabank</option>
            </select>

            <input
              type="text"
              placeholder="Filter Txn or Account..."
              value={reportsSearch}
              onChange={(e) => setReportsSearch(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
            />
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3.5">Report ID</th>
                <th className="py-2.5 px-3">Txn Ref</th>
                <th className="py-2.5 px-3">Reporting Bank</th>
                <th className="py-2.5 px-3">Sender Account</th>
                <th className="py-2.5 px-3">Receiver (Mule)</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3 text-center">Outcome</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {reports.map((r) => (
                <tr key={r.report_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3.5 font-mono font-bold text-slate-800">{r.report_id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">{r.txn_id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{r.reported_by_institution}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{r.sender_id}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-red-600">{r.receiver_id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{r.amount_formatted}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 text-slate-700">
                      {r.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full font-bold text-[10px]">
                      confirmed_mule
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedAccountId(r.receiver_id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Inspect KYC →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(reportsPage - 1) * 6 + 1}–{Math.min(reportsPage * 6, reportsTotal)} of {reportsTotal} reports
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={reportsPage <= 1}
              onClick={() => setReportsPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white font-bold text-xs">
              {reportsPage}
            </span>
            <button
              disabled={reportsPage >= reportsTotalPages}
              onClick={() => setReportsPage((p) => Math.min(reportsTotalPages, p + 1))}
              className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
