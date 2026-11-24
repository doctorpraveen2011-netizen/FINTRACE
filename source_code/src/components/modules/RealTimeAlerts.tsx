import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Clock,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface RealTimeAlertsProps {
  onNavigate: (id: string, targetAccount?: string) => void;
}

export const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [triagingId, setTriagingId] = useState<string | null>(null);

  // Fetch initial alerts
  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => {
        const initial = data.data || [
          {
            id: "ALT-78456",
            time: "18:45",
            type: "Critical Alert",
            message: "Suspicious transaction pattern detected in AC78456",
            color: "red",
            status: "NEW",
            amount: "₹12,50,000",
            account: "AC78456",
            bank: "Axis Bank",
            location: "Chennai, TN"
          },
          {
            id: "ALT-91823",
            time: "18:42",
            type: "High Risk",
            message: "Multiple accounts linked across 3 distinct branches",
            color: "orange",
            status: "INVESTIGATING",
            amount: "₹6,00,000",
            account: "AC91823",
            bank: "HDFC Bank",
            location: "Coimbatore, TN"
          },
          {
            id: "ALT-55412",
            time: "18:40",
            type: "Info",
            message: "New mule account detected via pass-through velocity scoring",
            color: "blue",
            status: "OPEN",
            amount: "₹1,80,000",
            account: "AC55412",
            bank: "ICICI Bank",
            location: "Bengaluru, KA"
          },
          {
            id: "ALT-33190",
            time: "18:37",
            type: "Warning",
            message: "Unusual transaction velocity: 8 transfers within 5 minutes",
            color: "orange",
            status: "MONITORING",
            amount: "₹4,20,000",
            account: "AC33190",
            bank: "Kotak Mahindra",
            location: "Hyderabad, TS"
          }
        ];
        setAlerts(initial);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Connect to WebSocket Event Bus
    const socketUrl = window.location.port === '3000' ? `http://${window.location.hostname}:5000` : undefined;
    const socket: Socket = io(socketUrl, { transports: ['websocket', 'polling'] });

    socket.on('alert_trigger', (newAlert: any) => {
      setAlerts(prev => [newAlert, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleTriage = async (alertId: string, action: string) => {
    setTriagingId(alertId);
    try {
      const res = await fetch(`/api/alerts/${alertId}/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, officer_name: "Investigator Cyber Analyst" })
      });
      if (res.ok) {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: action } : a));
      }
      setTriagingId(null);
    } catch (e) {
      setTriagingId(null);
    }
  };

  const filteredAlerts = alerts.filter((a: any) => {
    const matchesSearch = (a.account || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.message || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.bank || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = selectedSeverity === "ALL" ||
      (selectedSeverity === "CRITICAL" && (a.color === "red" || a.type?.includes("Critical"))) ||
      (selectedSeverity === "HIGH" && (a.color === "orange" || a.type?.includes("High"))) ||
      (selectedSeverity === "INFO" && (a.color === "blue" || a.type?.includes("Info") || a.type?.includes("Warning")));

    const matchesStatus = selectedStatus === "ALL" || a.status === selectedStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const criticalCount = alerts.filter((a: any) => a.color === "red" || a.type?.includes("Critical")).length;
  const newCount = alerts.filter((a: any) => a.status === "NEW" || a.status === "OPEN").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-50 text-red-600">
              <Bell className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Real-Time Alerts & Threat Triage Queue</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time sub-second alert broadcaster streaming anomalies from the XGBoost inference and Mule Typology engine.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              soundEnabled ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Audio Chime Active' : 'Sound Muted'}</span>
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>WebSocket Live Stream</span>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-semibold block text-[11px]">Total Streamed Alerts</span>
          <strong className="text-2xl font-black text-slate-900 mt-1 block">{alerts.length}</strong>
          <span className="text-[10px] text-slate-400">Past 24 Hours</span>
        </div>
        <div className="bg-red-50/60 p-4 rounded-xl border border-red-200 shadow-sm">
          <span className="text-red-700 font-semibold block text-[11px]">Critical Alerts</span>
          <strong className="text-2xl font-black text-red-600 mt-1 block">{criticalCount}</strong>
          <span className="text-[10px] text-red-600 font-semibold">Immediate Action Required</span>
        </div>
        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 shadow-sm">
          <span className="text-amber-700 font-semibold block text-[11px]">Pending Triage</span>
          <strong className="text-2xl font-black text-amber-600 mt-1 block">{newCount}</strong>
          <span className="text-[10px] text-amber-700">Awaiting Investigator Review</span>
        </div>
        <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 shadow-sm">
          <span className="text-blue-700 font-semibold block text-[11px]">Mean Time to Detect</span>
          <strong className="text-2xl font-black text-blue-600 mt-1 block">1.8s</strong>
          <span className="text-[10px] text-blue-700 font-semibold">Sub-second Stream</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Account, Alert ID, Bank, or Message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {["ALL", "CRITICAL", "HIGH", "INFO"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                  selectedSeverity === sev ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {["ALL", "NEW", "INVESTIGATING", "RESOLVED"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                  selectedStatus === st ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert: any) => {
            const isCrit = alert.color === "red" || alert.type?.includes("Critical");
            const isHigh = alert.color === "orange" || alert.type?.includes("High");

            return (
              <div
                key={alert.id}
                className={`bg-white p-5 rounded-xl border transition-all hover:shadow-md space-y-3 ${
                  isCrit ? 'border-red-200 bg-red-50/10' : isHigh ? 'border-amber-200' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${
                      isCrit ? 'bg-red-500 animate-pulse' : isHigh ? 'bg-amber-500' : 'bg-blue-500'
                    }`}></span>
                    <span className="font-mono text-xs font-extrabold text-slate-900">{alert.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isCrit ? 'bg-red-100 text-red-700' : isHigh ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.type}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      alert.status === 'NEW' ? 'bg-red-50 text-red-600 border border-red-200' :
                      alert.status === 'INVESTIGATING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {alert.status}
                    </span>
                    <div className="text-right">
                      <strong className="text-sm font-extrabold text-slate-900 font-mono">{alert.amount}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-800 font-semibold">{alert.message}</p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>Target Account: <strong className="font-mono text-blue-600">{alert.account}</strong></span>
                      {alert.bank && <span>• Bank: <strong>{alert.bank}</strong></span>}
                      {alert.location && <span>• Location: <strong>{alert.location}</strong></span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {alert.status !== 'INVESTIGATING' && (
                      <button
                        onClick={() => handleTriage(alert.id, "INVESTIGATING")}
                        disabled={triagingId === alert.id}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        Investigate
                      </button>
                    )}

                    {alert.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleTriage(alert.id, "RESOLVED")}
                        disabled={triagingId === alert.id}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        Resolve
                      </button>
                    )}

                    <button
                      onClick={() => onNavigate('shap-explainability', alert.account)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>SHAP</span>
                    </button>

                    {isCrit && (
                      <button
                        onClick={() => onNavigate('automated-response')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Freeze Gate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No alerts matching current filters.
          </div>
        )}
      </div>
    </div>
  );
};
