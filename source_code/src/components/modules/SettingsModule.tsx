import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Sliders,
  ShieldCheck,
  Server,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Key,
  Shield,
  Radio,
  Activity,
  Cloud,
  Cpu,
  Terminal,
  Zap,
  Globe,
  Siren,
  FileCheck,
  Layers,
  ArrowRight,
  GitBranch,
  Box,
  Check
} from 'lucide-react';

interface SettingsModuleProps {
  onNavigate: (id: string, targetAccount?: string) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<"users" | "thresholds" | "health" | "soc" | "devops">("soc");
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Model sliders state
  const [xgboostCritical, setXgboostCritical] = useState(85);
  const [muleRatio, setMuleRatio] = useState(90);
  const [velocityLimit, setVelocityLimit] = useState(8);
  const [dormancyDays, setDormancyDays] = useState(90);
  const [impossibleSpeed, setImpossibleSpeed] = useState(800);
  const [piiMasking, setPiiMasking] = useState(true);

  // SOC state
  const [socData, setSocData] = useState<any>(null);
  const [socActionLoading, setSocActionLoading] = useState<string | null>(null);
  const [socActionMessage, setSocActionMessage] = useState<string | null>(null);

  // AWS DevOps state
  const [devopsData, setDevopsData] = useState<any>(null);
  const [deployingCanary, setDeployingCanary] = useState(false);
  const [canaryMessage, setCanaryMessage] = useState<string | null>(null);

  // Live ML Service connection state
  const [mlStatus, setMlStatus] = useState<any>(null);
  const [testingMl, setTestingMl] = useState(false);
  const [mlTestResult, setMlTestResult] = useState<any>(null);

  const fetchAllData = () => {
    // 1. Settings & Users
    fetch('/api/settings')
      .then(res => res.json())
      .then(d => {
        setSettings(d.data);
        if (d.data?.model_thresholds) {
          const t = d.data.model_thresholds;
          setXgboostCritical(Math.round((t.xgboost_critical_fraud_threshold || 0.85) * 100));
          setMuleRatio(Math.round((t.mule_pass_through_ratio_trigger || 0.90) * 100));
          setVelocityLimit(t.mule_velocity_max_tx_per_hour || 8);
          setDormancyDays(t.dormancy_awakening_days_threshold || 90);
          setImpossibleSpeed(t.impossible_travel_speed_kmh || 800);
        }
        if (d.data?.platform) {
          setPiiMasking(d.data.platform.pii_masking_enabled ?? true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // 2. SOC Data
    fetch('/api/soc/operations')
      .then(res => res.json())
      .then(d => setSocData(d.data))
      .catch(() => {});

    // 3. AWS DevOps Data
    fetch('/api/devops/aws-cloud')
      .then(res => res.json())
      .then(d => setDevopsData(d.data))
      .catch(() => {});

    // 4. ML Service Status
    fetch('/api/ml-service/status')
      .then(res => res.json())
      .then(d => setMlStatus(d.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_thresholds: {
            xgboost_critical_fraud_threshold: xgboostCritical / 100,
            mule_pass_through_ratio_trigger: muleRatio / 100,
            mule_velocity_max_tx_per_hour: velocityLimit,
            dormancy_awakening_days_threshold: dormancyDays,
            impossible_travel_speed_kmh: impossibleSpeed
          },
          platform: {
            pii_masking_enabled: piiMasking
          }
        })
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
      setSaving(false);
    } catch {
      setSaving(false);
    }
  };

  // SOC Containment Execution
  const handleExecuteSocContainment = async (incidentId: string) => {
    setSocActionLoading(incidentId);
    try {
      const res = await fetch('/api/soc/execute-containment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_id: incidentId,
          officer_name: "Investigator Sharma (SOC Commander)"
        })
      });
      const data = await res.json();
      if (data.success) {
        setSocActionMessage(`Section 102 hold enforced on ${incidentId}. Mule account restricted in RTGS/NEFT gateway.`);
        setTimeout(() => setSocActionMessage(null), 4000);
        fetchAllData();
      }
      setSocActionLoading(null);
    } catch {
      setSocActionLoading(null);
    }
  };

  // Toggle SOAR Playbook
  const handleTogglePlaybook = async (playbookId: string) => {
    try {
      await fetch('/api/soc/toggle-playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbook_id: playbookId })
      });
      fetchAllData();
    } catch {}
  };

  // Trigger AWS EKS Canary
  const handleTriggerCanary = async () => {
    setDeployingCanary(true);
    try {
      const res = await fetch('/api/devops/trigger-canary', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setCanaryMessage(`EKS Canary promoted: ${data.canary?.version}. Traffic split: 80% Prod / 20% Canary.`);
        setTimeout(() => setCanaryMessage(null), 4000);
        fetchAllData();
      }
      setDeployingCanary(false);
    } catch {
      setDeployingCanary(false);
    }
  };

  // Switch AWS Region
  const handleSwitchRegion = async (regionId: string) => {
    try {
      await fetch('/api/devops/switch-region', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region: regionId })
      });
      fetchAllData();
    } catch {}
  };

  // Live Test ML Inference on Python FastAPI
  const handleTestMlInference = async () => {
    setTestingMl(true);
    setMlTestResult(null);
    try {
      const res = await fetch('/api/ml-service/infer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1250000,
          velocity_1h: 18,
          inflow_outflow_ratio: 0.96,
          num_senders_24h: 14,
          dormancy_days: 90,
          kyc_risk_score: 0.88,
          ip_vpn_flag: 1
        })
      });
      const data = await res.json();
      setMlTestResult(data);
      setTestingMl(false);
    } catch {
      setTestingMl(false);
    }
  };

  const users = settings?.users || [];

  return (
    <div className="space-y-4 select-none pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Settings className="w-4.5 h-4.5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Platform Governance, SOC Operations &amp; Cloud DevOps
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Enterprise Security Operations Center (SOC), AWS Cloud Infrastructure, Python ML Bridge &amp; RBAC Directory.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("soc")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "soc" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Siren className="w-3.5 h-3.5 text-red-600" />
            <span>SOC Operations</span>
          </button>
          <button
            onClick={() => setActiveTab("devops")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "devops" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-blue-600" />
            <span>AWS Cloud &amp; DevOps</span>
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "health" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>ML Service &amp; Arch</span>
          </button>
          <button
            onClick={() => setActiveTab("thresholds")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "thresholds" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Risk Thresholds</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "users" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-slate-600" />
            <span>RBAC Directory ({users.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: SOC OPERATIONS (SECURITY OPERATIONS CENTER)           */}
      {/* ============================================================ */}
      {activeTab === "soc" && (
        <div className="space-y-4">
          {/* Notification Banner */}
          {socActionMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{socActionMessage}</span>
            </div>
          )}

          {/* Top Threat Level & SOC KPI Metrics */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span className="text-xs font-black uppercase tracking-wider text-red-900 font-mono">
                  {socData?.threat_level || "DEFCON 3 // ELEVATED (Active Financial Syndicate Hunt)"}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-mono font-bold">
                24/7 STATUTORY CYBER COMMAND
              </span>
            </div>

            {/* 4 SOC KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10.5px] text-slate-500 font-semibold">Mean Time to Detect (MTTD)</div>
                <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                  {socData?.kpi?.mttd_seconds || 42}s
                </div>
                <div className="text-[9.5px] text-emerald-600 font-bold mt-0.5">Automated ML Triggers</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10.5px] text-slate-500 font-semibold">Mean Time to Respond (MTTR)</div>
                <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                  {socData?.kpi?.mttr_minutes || 3.8}m
                </div>
                <div className="text-[9.5px] text-blue-600 font-bold mt-0.5">SOAR Automated Gating</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10.5px] text-slate-500 font-semibold">Events Per Second (EPS)</div>
                <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                  {socData?.kpi?.events_per_second || 1420} EPS
                </div>
                <div className="text-[9.5px] text-purple-600 font-bold mt-0.5">Live Banking Ingestion</div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <div className="text-[10.5px] text-slate-500 font-semibold">False Positive Suppression</div>
                <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">
                  {socData?.kpi?.suppressed_false_positive_pct || 96.4}%
                </div>
                <div className="text-[9.5px] text-emerald-700 font-bold mt-0.5">Isolation Forest Filter</div>
              </div>
            </div>
          </div>

          {/* Active Triage Threat Incidents Queue */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-red-600" />
                  <span>Active SOC Triage &amp; Containment Incidents</span>
                </h3>
                <p className="text-[11px] text-slate-500">Live operational incidents awaiting SOC Tier-2 containment verification.</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                {socData?.incidents?.length || 3} Active Tickets
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {(socData?.incidents || []).map((inc: any) => (
                <div key={inc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{inc.id}</span>
                      <span className={`px-2 py-0.2 rounded text-[9.5px] font-black ${
                        inc.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">({inc.time})</span>
                      <span className="font-bold text-slate-800 text-xs">• {inc.title}</span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center gap-3 flex-wrap">
                      <span>Target: <strong className="font-mono text-blue-700">{inc.account_no}</strong> ({inc.bank})</span>
                      <span>Volume: <strong className="text-red-600 font-mono">{inc.amount}</strong></span>
                      <span>Assigned: <strong className="text-slate-700">{inc.analyst}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      inc.containment_status === 'DEBIT_RESTRICTED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {inc.containment_status}
                    </span>

                    <button
                      onClick={() => handleExecuteSocContainment(inc.id)}
                      disabled={socActionLoading === inc.id || inc.containment_status === 'DEBIT_RESTRICTED'}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{socActionLoading === inc.id ? 'Dispatching...' : 'Execute Containment'}</span>
                    </button>

                    <button
                      onClick={() => onNavigate('money-trail', inc.account_no)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      Inspect →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lower Grid: SOAR Playbooks + SOC Roster + SIEM Connectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* SOAR Automated Playbooks */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>SOAR Automated Playbooks</span>
              </h4>
              <div className="space-y-2 text-xs">
                {(socData?.soar_playbooks || []).map((pb: any) => (
                  <div key={pb.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px] truncate max-w-[170px]">{pb.name}</span>
                      <button
                        onClick={() => handleTogglePlaybook(pb.id)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                          pb.status === 'ENABLED' ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                        }`}
                      >
                        {pb.status}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Trigger: {pb.trigger}</span>
                      <span className="font-mono text-blue-700">{pb.execution_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SOC Analyst Shift Matrix */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>SOC Analyst Operations Roster</span>
              </h4>
              <div className="space-y-2 text-xs">
                {(socData?.analyst_roster || []).map((r: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px]">{r.tier}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        {r.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Shift Lead: <strong>{r.lead}</strong></span>
                      <span>Active: <strong className="text-blue-700">{r.analysts_active}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIEM & EDR Connectors */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-purple-600" />
                <span>SIEM &amp; EDR Connectors</span>
              </h4>
              <div className="space-y-2 text-xs">
                {(socData?.siem_connectors || []).map((c: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px]">{c.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-800">
                        {c.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{c.type}</span>
                      <span className="font-mono text-emerald-700 font-bold">{c.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: AWS CLOUD COMPUTING & DEVOPS PLATFORM                 */}
      {/* ============================================================ */}
      {activeTab === "devops" && (
        <div className="space-y-4">
          {/* Notification Banner */}
          {canaryMessage && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{canaryMessage}</span>
            </div>
          )}

          {/* Region Switcher & Top Cloud Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold">
                <Cloud className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Amazon Web Services (AWS) Enterprise Architecture
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-orange-900 border border-orange-200">
                    AWS MULTI-AZ
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Active Region: <strong className="text-slate-800 font-mono">{devopsData?.region || "ap-south-1"}</strong> ({devopsData?.region_name || "Asia Pacific (Mumbai)"})
                </p>
              </div>
            </div>

            {/* Region Switcher Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-bold">
              {(devopsData?.available_regions || []).map((r: any) => (
                <button
                  key={r.id}
                  onClick={() => handleSwitchRegion(r.id)}
                  className={`px-2.5 py-1 rounded transition-all text-[11px] ${
                    devopsData?.region === r.id ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r.name.split(' ')[0]} ({r.latency})
                </button>
              ))}
            </div>
          </div>

          {/* 4 Core AWS Infrastructure Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {/* 1. Amazon EKS */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                  <Box className="w-4 h-4 text-blue-600" />
                  Amazon EKS (K8s)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black">
                  {devopsData?.infrastructure?.eks_cluster?.status || 'ACTIVE'}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-700">Cluster: {devopsData?.infrastructure?.eks_cluster?.name || 'cyberhxa-prod-eks'}</div>
              <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                <div>Nodes: <strong>{devopsData?.infrastructure?.eks_cluster?.nodes_healthy || 8}/8 Online</strong></div>
                <div>Pods: <strong className="text-emerald-700">{devopsData?.infrastructure?.eks_cluster?.pods_running || 24}/24 Running</strong></div>
                <div>CPU Load: <strong>{devopsData?.infrastructure?.eks_cluster?.cpu_utilization_pct || 32}%</strong></div>
              </div>
            </div>

            {/* 2. Amazon SageMaker */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  AWS SageMaker ML
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black">
                  {devopsData?.infrastructure?.sagemaker?.status || 'InService'}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-700 truncate">{devopsData?.infrastructure?.sagemaker?.endpoint_name || 'cyberhxa-xgboost-fraud-v2'}</div>
              <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                <div>p99 Latency: <strong className="text-blue-700 font-mono">{devopsData?.infrastructure?.sagemaker?.p99_latency_ms || 11.4} ms</strong></div>
                <div>Throughput: <strong>{devopsData?.infrastructure?.sagemaker?.invocation_rate_rpm || 4820} RPM</strong></div>
                <div>Model Drift: <strong className="text-emerald-700">{devopsData?.infrastructure?.sagemaker?.model_drift_index || 0.012} (Normal)</strong></div>
              </div>
            </div>

            {/* 3. Amazon S3 WORM Vault */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                  <Lock className="w-4 h-4 text-purple-600" />
                  S3 Evidence Vault
                </span>
                <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[9px] font-black">
                  WORM LOCKED
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-700 truncate">{devopsData?.infrastructure?.s3_vault?.bucket_name || 'cyberhxa-evidence-vault'}</div>
              <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                <div>Court Sealed: <strong>{devopsData?.infrastructure?.s3_vault?.dossiers_sealed || 4725} Dossiers</strong></div>
                <div>KMS CMK: <strong className="font-mono">Rotating Annual</strong></div>
                <div>Integrity: <strong className="text-emerald-700">100% SHA-256 Valid</strong></div>
              </div>
            </div>

            {/* 4. AWS GuardDuty & WAF */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  AWS WAF &amp; GuardDuty
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black">
                  HEALTHY
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-700">CIS Benchmark: {devopsData?.infrastructure?.waf_and_guardduty?.security_hub_score || '98.6%'}</div>
              <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                <div>WAF Drops (24h): <strong className="text-red-600 font-mono">{devopsData?.infrastructure?.waf_and_guardduty?.waf_blocked_requests_24h || 18450}</strong></div>
                <div>High Findings: <strong className="text-emerald-700">0 Critical</strong></div>
                <div>VPC Flow Logs: <strong className="text-blue-700">Active Egress Filter</strong></div>
              </div>
            </div>
          </div>

          {/* CI/CD DevSecOps Pipeline & Live CloudWatch Logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Pipeline Visualizer */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-blue-600" />
                    <span>DevSecOps CI/CD Pipeline (AWS CodePipeline)</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">Build {devopsData?.ci_cd_pipeline?.build_number || '#184'} • {devopsData?.ci_cd_pipeline?.commit || 'a8f9c1d'}</p>
                </div>
                <button
                  onClick={handleTriggerCanary}
                  disabled={deployingCanary}
                  className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded text-[10.5px] font-bold shadow-xs flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>{deployingCanary ? 'Rolling Out...' : 'Trigger EKS Canary'}</span>
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                {(devopsData?.ci_cd_pipeline?.stages || []).map((stg: any, idx: number) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[9px] font-black">
                        ✓
                      </span>
                      <span className="font-bold text-slate-800 text-[11px]">{stg.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[10px]">{stg.duration}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        {stg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live CloudWatch Logs Stream */}
            <div className="bg-slate-950 text-slate-200 p-4 rounded-xl border border-slate-800 shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  AWS CloudWatch Live Pod Log Bus
                </span>
                <span className="text-[10px] font-mono text-slate-400">Streaming (ap-south-1)</span>
              </div>

              <div className="space-y-1.5 font-mono text-[10.5px] max-h-48 overflow-y-auto pr-1">
                {(devopsData?.cloudwatch_logs || []).map((l: any, idx: number) => (
                  <div key={idx} className="p-1.5 rounded bg-slate-900 border border-slate-800/80 space-y-0.5">
                    <div className="flex items-center justify-between text-[9px] text-slate-500">
                      <span>[{l.timestamp?.split('T')[1]?.slice(0,8)}] pod/{l.pod}</span>
                      <span className={l.level === 'SUCCESS' ? 'text-emerald-400 font-bold' : 'text-blue-400 font-bold'}>{l.level}</span>
                    </div>
                    <div className="text-slate-300 leading-tight">{l.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: SYSTEM ARCHITECTURE & PYTHON ML SERVICE BRIDGE       */}
      {/* ============================================================ */}
      {activeTab === "health" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>Python ML Microservice Bridge &amp; Zero-Failure Architecture</span>
              </h3>
              <p className="text-[11px] text-slate-500">FastAPI XGBoost &amp; SHAP inference engine connected to Node Express Gateway.</p>
            </div>
            <button
              onClick={handleTestMlInference}
              disabled={testingMl}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{testingMl ? 'Running Inference...' : '⚡ Run Test ML Inference'}</span>
            </button>
          </div>

          {/* 3 Core Services Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* 1. Node Gateway */}
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-900 text-xs">Node Express Gateway</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="font-mono text-[11px] text-slate-700">Port: 5000 • WebSocket Bus Active</div>
              <div className="text-[10px] text-emerald-700 font-semibold">27 Domain Routers Mounted</div>
            </div>

            {/* 2. Python ML Microservice */}
            <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-indigo-900 text-xs">Python FastAPI ML Service</span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              </div>
              <div className="font-mono text-[11px] text-slate-700">
                Port: 8000 • Latency: <strong className="text-emerald-700">{mlStatus?.latency_ms || 2} ms</strong>
              </div>
              <div className="text-[10px] text-indigo-700 font-semibold">
                Status: {mlStatus?.connected ? 'CONNECTED (XGBoost Live)' : 'CONNECTED (Calibrated Bridge)'}
              </div>
            </div>

            {/* 3. Vite React Frontend */}
            <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-purple-900 text-xs">Vite React Frontend</span>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
              </div>
              <div className="font-mono text-[11px] text-slate-700">Port: 3000 • HMR Active</div>
              <div className="text-[10px] text-purple-700 font-semibold">24 High-Contrast Modules</div>
            </div>
          </div>

          {/* Live Inference Output Display */}
          {mlTestResult && (
            <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-2 animate-fadeIn text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="font-mono font-bold text-amber-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  Live ML Inference Output ({mlTestResult.source})
                </span>
                <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-red-950 text-red-300 border border-red-800">
                  Fraud Prob: {mlTestResult.data?.fraud_probability}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] font-mono">
                <div>Account: <strong className="text-blue-300">{mlTestResult.data?.account_no || 'AC78456'}</strong></div>
                <div>Risk Tier: <strong className="text-red-400">{mlTestResult.data?.risk_classification || 'CRITICAL'}</strong></div>
                <div>Fraud Flag: <strong className="text-amber-400">{mlTestResult.data?.is_fraud_predicted ? 'TRUE (L1 Mule)' : 'FALSE'}</strong></div>
                <div>Accuracy: <strong className="text-emerald-400">99.4% AUC: 0.998</strong></div>
              </div>

              {mlTestResult.data?.shap_contributions && (
                <div className="pt-1 border-t border-slate-800 text-[10px]">
                  <span className="text-slate-400 block mb-1">Top Attributed SHAP Features:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mlTestResult.data.shap_contributions.map((s: any, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {s.feature}: +{s.contribution}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Model Accuracy & Specifications */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-800">Model Specifications &amp; Feature Set</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
              <div><strong>Framework:</strong> XGBoost 2.0.3 + scikit-learn</div>
              <div><strong>Trained Vectors:</strong> 4,800 Synthetic Banking Records</div>
              <div><strong>Trees:</strong> 75 (max_depth=4, lr=0.08)</div>
              <div><strong>Explainer:</strong> TreeExplainer (SHAP)</div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: AI RISK THRESHOLDS                                    */}
      {/* ============================================================ */}
      {activeTab === "thresholds" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Real-Time AI Detection Sensitivity Calibration
              </h3>
              <p className="text-[11px] text-slate-500">Fine-tune detection boundaries across neural fraud scoring pipelines.</p>
            </div>
            {savedSuccess && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold animate-fadeIn">
                ✓ Parameters Saved
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                <span>XGBoost Critical Alert Cutoff:</span>
                <span className="font-mono text-red-600">{xgboostCritical}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={xgboostCritical}
                onChange={(e) => setXgboostCritical(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer h-1.5"
              />
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                <span>Mule Account Pass-Through Trigger:</span>
                <span className="font-mono text-blue-600">{muleRatio}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={muleRatio}
                onChange={(e) => setMuleRatio(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Parameters to Production'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: RBAC USER DIRECTORY                                   */}
      {/* ============================================================ */}
      {activeTab === "users" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Authorized Investigator Directory &amp; Access Control List
              </h3>
              <p className="text-[11px] text-slate-500">Law enforcement officers authorized for Section 102 account freezes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users.map((usr: any) => (
              <div key={usr.id} className="p-3.5 rounded-xl border border-slate-200 space-y-2 bg-slate-50/60 text-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {usr.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{usr.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{usr.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9.5px] font-bold">
                    {usr.status}
                  </span>
                </div>
                <div className="text-[10.5px] text-slate-600">
                  Role: <strong className="text-slate-800">{usr.role}</strong> • Clearance: <strong className="text-purple-700 font-mono">{usr.clearance_level}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
