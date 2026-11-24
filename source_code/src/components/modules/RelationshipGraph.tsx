import React, { useState, useEffect } from 'react';
import {
  Share2,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  Smartphone,
  CreditCard,
  Laptop,
  Globe,
  MapPin,
  GitFork,
  Radio,
  CheckCircle2
} from 'lucide-react';

interface RelationshipGraphProps {
  onNavigate: (id: string, targetAccount?: string) => void;
}

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({ onNavigate }) => {
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL");
  const [selectedCommunityFilter, setSelectedCommunityFilter] = useState("ALL");
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    fetch('/api/relationship-graph')
      .then(res => res.json())
      .then(d => {
        setGraphData(d.data);
        if (d.data?.nodes?.length > 0) {
          setSelectedNode(d.data.nodes[0]); // default AC78456
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const nodes = graphData?.nodes || [];
  const links = graphData?.links || [];
  const centrality = graphData?.centrality_metrics || {};

  const filteredNodes = nodes.filter((n: any) => {
    const matchesSearch = n.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypeFilter === "ALL" || n.type === selectedTypeFilter;
    const matchesCommunity = selectedCommunityFilter === "ALL" || String(n.community) === selectedCommunityFilter;
    return matchesSearch && matchesType && matchesCommunity;
  });

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'ACCOUNT': return CreditCard;
      case 'PHONE': return Smartphone;
      case 'PAN': return CreditCard;
      case 'DEVICE': return Laptop;
      case 'IP': return Globe;
      case 'LOCATION': return MapPin;
      case 'OFFRAMP': return GitFork;
      default: return Share2;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-blue-500 text-white';
      default: return 'bg-emerald-500 text-white';
    }
  };

  // Find linked edges for selected node
  const linkedEdges = selectedNode
    ? links.filter((l: any) => l.source === selectedNode.id || l.target === selectedNode.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Share2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Entity Relationship Graph & Syndicate Resolution</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Louvain community clustering resolving shared phones, PAN cards, device fingerprints, and anonymization relays.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
            Resolved Graph: {nodes.length} Entities • {links.length} Relations
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search graph entities by Account, Phone, Device, or PAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-400 text-[11px] mr-1">Type:</span>
            {["ALL", "ACCOUNT", "PHONE", "DEVICE", "IP", "LOCATION", "OFFRAMP"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedTypeFilter(type)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  selectedTypeFilter === type
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-400 text-[11px]">Louvain Community Cluster:</span>
          {["ALL", "1", "2", "3"].map((comm) => (
            <button
              key={comm}
              onClick={() => setSelectedCommunityFilter(comm)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                selectedCommunityFilter === comm
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {comm === "ALL" ? "All Clusters" : `Cluster ${comm} (${comm === "1" ? "Chennai DarkFlow" : comm === "2" ? "Bengaluru Escrow" : "Victim Inflows"})`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Entities Matrix Visualizer */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Critical Hubs</span>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ml-2"></span>
              <span>High Risk</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2"></span>
              <span>Intermediaries</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ml-2"></span>
              <span>Victims</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Click node to inspect forensic attributes</span>
          </div>

          {/* Node Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredNodes.map((n: any) => {
              const Icon = getNodeIcon(n.type);
              const isSelected = selectedNode?.id === n.id;
              const isKingpin = n.id === "AC78456";

              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all relative ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {isKingpin && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded bg-red-600 text-white font-extrabold text-[9px] shadow-sm">
                      PRIMARY MULE
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`p-1.5 rounded-lg ${
                      n.risk === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      n.risk === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                      n.risk === 'MEDIUM' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-400">{n.type}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs truncate">{n.label}</h4>
                  <div className="text-[10px] text-slate-500 mt-1 truncate">
                    {n.holder || n.carrier || n.os || n.loc || n.bank || n.loss || "Node Linkage"}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono">Cluster {n.community}</span>
                    <span className={`font-bold ${
                      n.risk === 'CRITICAL' ? 'text-red-600' :
                      n.risk === 'HIGH' ? 'text-orange-600' :
                      n.risk === 'MEDIUM' ? 'text-blue-600' : 'text-emerald-600'
                    }`}>
                      {n.risk}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Entity Detail & Centrality Inspector */}
        {selectedNode && (
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedNode.risk === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                  selectedNode.risk === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedNode.risk} RISK
                </span>
                <span className="font-mono text-xs text-slate-400">{selectedNode.type}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">{selectedNode.label}</h3>
              <p className="text-xs font-mono text-blue-600">{selectedNode.id}</p>
            </div>

            {/* Centrality Metrics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Graph Centrality & Hub Scores
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px]">Betweenness Centrality</div>
                  <div className="text-base font-black text-indigo-600 mt-0.5 font-mono">
                    {centrality.betweenness?.[selectedNode.id] || "0.412"}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Syndicate Chokepoint</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px]">PageRank Influence</div>
                  <div className="text-base font-black text-blue-600 mt-0.5 font-mono">
                    {centrality.pagerank?.[selectedNode.id] || "0.195"}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Network Importance</div>
                </div>
              </div>
            </div>

            {/* Linked Relationships */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Connected Relations ({linkedEdges.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                {linkedEdges.map((link: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800 text-[11px]">
                        {link.source === selectedNode.id ? link.target : link.source}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[9px] font-bold">
                        {link.channel || "ENTITY"}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold">{link.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2 border-t border-slate-100">
              {selectedNode.type === 'ACCOUNT' && (
                <button
                  onClick={() => onNavigate('money-trail', selectedNode.id)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Explore Money Trail for {selectedNode.id}</span>
                </button>
              )}

              {selectedNode.type === 'LOCATION' && (
                <button
                  onClick={() => onNavigate('maps')}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Locate ATM Kiosk on Police Tactical Grid</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('tactical-workbench', selectedNode.id)}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch CDR & Tower Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
