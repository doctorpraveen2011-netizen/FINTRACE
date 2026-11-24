import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  ShieldAlert,
  Server,
  Globe,
  Radio,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Zap,
  Activity
} from 'lucide-react';

interface IpIntelligenceProps {
  onNavigate: (id: string, targetAccount?: string) => void;
}

export const IpIntelligence: React.FC<IpIntelligenceProps> = ({ onNavigate }) => {
  const [ips, setIps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lookupInput, setLookupInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [selectedIpDetail, setSelectedIpDetail] = useState<any>(null);

  useEffect(() => {
    fetch('/api/ip-intel')
      .then(res => res.json())
      .then(data => {
        const list = data.data?.flagged_ips || [];
        setIps(list);
        if (list.length > 0) setSelectedIpDetail(list[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!lookupInput.trim()) return;
    setSearching(true);
    try {
      const res = await fetch('/api/ip-intel/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: lookupInput })
      });
      const data = await res.json();
      setLookupResult(data.data);
      setSelectedIpDetail(data.data);
      setSearching(false);
    } catch (e) {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">IP Intelligence, VPN & Impossible Travel Radar</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Commercial VPN exit detection, Tor relay telemetry, ASN reputation, and algorithmic impossible travel hops.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
            Flagged Threat IPs: {ips.length}
          </span>
        </div>
      </div>

      {/* IP Lookup Tool */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Query any IP address (e.g., 103.21.244.1, 185.220.101.5, 45.142.122.8)..."
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !lookupInput.trim()}
            className="w-full sm:w-auto py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${searching ? 'animate-spin' : ''}`} />
            <span>{searching ? 'Querying Threat DB...' : 'Analyze IP & Routing'}</span>
          </button>
        </form>
      </div>

      {/* Main Content Split: List & Deep Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Flagged IPs List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider px-1">
            Active Anonymization Nodes & Relays
          </h3>

          <div className="space-y-3">
            {ips.map((item: any) => {
              const isSelected = selectedIpDetail?.ip === item.ip;
              return (
                <div
                  key={item.ip}
                  onClick={() => setSelectedIpDetail(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs">{item.ip}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.risk_score > 90 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      Score: {item.risk_score}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium truncate">{item.asn}</div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {item.vpn && <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-bold">VPN</span>}
                      {item.tor && <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[9px] font-bold">TOR EXIT</span>}
                      <span className="text-slate-400 text-[10px]">{item.city}, {item.country}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{item.last_detected}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: IP Deep Telemetry Dossier */}
        {selectedIpDetail && (
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-base text-slate-900">{selectedIpDetail.ip}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                    Risk: {selectedIpDetail.risk_score}/100
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Location: <strong className="text-slate-800">{selectedIpDetail.city}, {selectedIpDetail.country}</strong> • ISP: <strong className="text-slate-800">{selectedIpDetail.isp}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedIpDetail.associated_mules?.length > 0 && (
                  <button
                    onClick={() => onNavigate('money-trail', selectedIpDetail.associated_mules[0])}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                  >
                    <span>View Mule Trail</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Classification Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Proxy Classification</span>
                <strong className="text-slate-800 text-xs mt-0.5 block truncate">{selectedIpDetail.proxy_type}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Threat Attribution</span>
                <strong className="text-red-600 text-xs mt-0.5 block truncate">{selectedIpDetail.threat_actor}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Sessions (24h)</span>
                <strong className="text-slate-800 text-xs mt-0.5 block">{selectedIpDetail.total_sessions_24h}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Correlated Mules</span>
                <strong className="text-blue-600 font-mono text-xs mt-0.5 block">
                  {selectedIpDetail.associated_mules?.join(", ") || "None"}
                </strong>
              </div>
            </div>

            {/* Impossible Travel Radar Card */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Impossible Travel Telemetry & Velocity Anomalies</span>
              </h4>

              {selectedIpDetail.impossible_travel_events?.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {selectedIpDetail.impossible_travel_events.map((ev: any, idx: number) => (
                    <div key={idx} className="p-4 bg-amber-50/40 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{ev.from} ➔ {ev.to}</span>
                          <span className="px-1.5 py-0.5 bg-amber-200 text-amber-800 text-[10px] font-mono rounded">
                            {ev.speed_kmh} km/h
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Consecutive banking heartbeats spaced &lt;10 mins apart; physically impossible without commercial VPN relay.
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                          {ev.status}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">{ev.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                  Zero impossible travel hops detected for this subnet in the last 24 hours.
                </div>
              )}
            </div>

            {/* Routing & ASN Details */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-700" />
                <span>Autonomous System Number (ASN) & Gateway Path</span>
              </h4>
              <div className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl border border-slate-800 space-y-1">
                <div>ASN: {selectedIpDetail.asn}</div>
                <div>Reverse DNS: rdns-{selectedIpDetail.ip?.replace(/\./g, '-')}.anonymizer.net</div>
                <div>Colocated Mule Accounts: {selectedIpDetail.associated_mules?.join(", ") || "None"}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Data enriched via MaxMind GeoIP2 Precision & Cloudflare Threat Matrix.
              </span>
              <button
                onClick={() => onNavigate('maps')}
                className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>View Coordinates on Tactical Grid</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
