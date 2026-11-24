import React, { useState, useEffect } from 'react';
import {
  GitFork,
  Search,
  ShieldAlert,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Maximize2,
  Layers,
  ArrowRight,
  Lock,
  CheckCircle2,
  Download,
  X,
  Building,
  User,
  Activity,
  CreditCard,
  Smartphone,
  Zap,
  Share2,
  Navigation
} from 'lucide-react';

interface MoneyTrailAnalysisProps {
  initialAccountId?: string;
  onNavigate: (moduleId: string, targetAccount?: string) => void;
}

type TopologyType = 'auto' | 'radial_funnel' | 'linear_relay' | 'tree_dispersal' | 'circular_ring' | 'geo_spatial';
type PatternMode = 'channels' | 'locations';

export const MoneyTrailAnalysis: React.FC<MoneyTrailAnalysisProps> = ({
  initialAccountId,
  onNavigate
}) => {
  const [loading, setLoading] = useState(true);
  const [trailData, setTrailData] = useState<any>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(initialAccountId || 'acc_00020535');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [availableMules, setAvailableMules] = useState<any[]>([]);
  const [customSearch, setCustomSearch] = useState<string>('');
  
  // Interactive Topology & Pattern states
  const [selectedTopology, setSelectedTopology] = useState<TopologyType>('auto');
  const [patternMode, setPatternMode] = useState<PatternMode>('channels');

  // Interactive node freeze states (local toggles)
  const [nodeFreezeStates, setNodeFreezeStates] = useState<{ [key: string]: boolean }>({});
  
  // Multi-node freeze modal
  const [showMultiFreezeModal, setShowMultiFreezeModal] = useState(false);
  const [freezingMulti, setFreezingMulti] = useState(false);
  const [freezeSuccessMsg, setFreezeSuccessMsg] = useState<string | null>(null);

  // Fetch list of available mules from Mule Detection to populate the switcher
  const fetchAvailableMules = async () => {
    try {
      const res = await fetch('/api/mules?limit=30');
      const json = await res.json();
      if (json.success && json.accounts) {
        setAvailableMules(json.accounts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch Money Trail for the active focal account
  const fetchTrail = async (accId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/money-trail?account_no=${encodeURIComponent(accId)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setTrailData(json.data);
        
        // Initialize freeze states for nodes in this trail
        const initialFreezes: { [key: string]: boolean } = {};
        json.data.active_node_statuses?.forEach((n: any) => {
          initialFreezes[n.id] = n.isFrozen || false;
        });
        setNodeFreezeStates(initialFreezes);
        
        // Select focal mule as default inspected node
        const focal = json.data.nodes?.find((n: any) => n.isCenter);
        if (focal) setSelectedNode(focal);
      }
    } catch (err) {
      console.error('Failed to load money trail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableMules();
  }, []);

  useEffect(() => {
    if (initialAccountId && initialAccountId !== selectedAccountId) {
      setSelectedAccountId(initialAccountId);
      fetchTrail(initialAccountId);
    } else {
      fetchTrail(selectedAccountId);
    }
  }, [initialAccountId]);

  const handleAccountSelect = (newAccId: string) => {
    setSelectedAccountId(newAccId);
    fetchTrail(newAccId);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSearch.trim()) {
      handleAccountSelect(customSearch.trim());
    }
  };

  // Toggle freeze on individual node
  const handleToggleNodeFreeze = async (nodeId: string) => {
    const currentState = !!nodeFreezeStates[nodeId];
    const newState = !currentState;
    
    setNodeFreezeStates(prev => ({ ...prev, [nodeId]: newState }));

    try {
      await fetch(`/api/mules/${nodeId}/freeze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer: "Investigator Cyber Analyst",
          reason: newState ? "Interactive Section 102 CrPC Trail Node Freeze" : "Lien Administrative Review"
        })
      });
    } catch (e) {
      console.error('Freeze error:', e);
    }
  };

  // Propose Emergency Multi-Node Freeze across all nodes in the trail
  const handleExecuteMultiFreeze = async () => {
    setFreezingMulti(true);
    try {
      const nodeIds = trailData?.active_node_statuses?.map((n: any) => n.id) || [selectedAccountId];
      const res = await fetch('/api/money-trail/multi-node-freeze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_numbers: nodeIds,
          officer: "Investigator Cyber Analyst",
          reason: "Emergency Section 102 CrPC / Section 106 BNSS Multi-Node Syndicate Freeze"
        })
      });
      const json = await res.json();
      if (json.success) {
        const updated: { [key: string]: boolean } = {};
        nodeIds.forEach((id: string) => { updated[id] = true; });
        setNodeFreezeStates(prev => ({ ...prev, ...updated }));
        setFreezeSuccessMsg(json.message);
        setTimeout(() => {
          setShowMultiFreezeModal(false);
          setFreezeSuccessMsg(null);
        }, 1800);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFreezingMulti(false);
    }
  };

  // Determine current effective layout topology
  const effectiveTopology: TopologyType = selectedTopology === 'auto'
    ? (trailData?.detected_topology || 'radial_funnel')
    : selectedTopology;

  // Layout description
  const activeTopologyDescription = trailData?.topology_descriptions?.[effectiveTopology] ||
    "Multi-Hop Flow: Dynamically adapting to fund velocity, transaction channels, and regional geography.";

  // Node position helper based on effective topology
  const getNodePos = (node: any) => {
    if (node?.layouts && node.layouts[effectiveTopology]) {
      return node.layouts[effectiveTopology];
    }
    return { x: node?.x || 100, y: node?.y || 100 };
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar Matching CYBERHXA UI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <GitFork className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Money Trail Analysis &amp; Multi-Hop Fund Dispersal Graph
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual forensic tracing of fund division, smurfing, and off-ramp destinations across banking layers.
          </p>
        </div>

        <button
          onClick={() => setShowMultiFreezeModal(true)}
          className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Lock className="w-4 h-4" />
          <span>Propose Emergency Multi-Node Freeze</span>
        </button>
      </div>

      {/* 2. Reactive Connection Bar to Mule Detection */}
      <div className="bg-white p-4 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/50 via-white to-slate-50 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-bold text-slate-800">Connected Mule Account Conduit:</span>
          <select
            value={selectedAccountId}
            onChange={(e) => handleAccountSelect(e.target.value)}
            className="bg-white border border-blue-300 font-mono font-bold text-blue-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs shadow-xs max-w-sm"
          >
            {availableMules.map((m: any) => (
              <option key={m.account_no} value={m.account_no}>
                {m.account_no} • {m.bank} ({m.location?.split(' ')[0] || 'City'}) • {m.channel || 'Wire'} ({m.total_volume_inr})
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search or Enter Account ID..."
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              className="bg-white border border-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-52 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
          >
            Load Trail
          </button>
          <button
            type="button"
            onClick={() => onNavigate('mule-detection')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
          >
            View Mule Registry
          </button>
        </form>
      </div>

      {/* 3. Main Multi-Hop Graph Canvas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        {/* Graph Header: Incident Title on Left, Controls & Meta Pill on Right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900">
                Fund Layering Graph for Incident{' '}
                <span className="font-mono text-blue-600">
                  {trailData?.focal_account || selectedAccountId}
                </span>{' '}
                <span className="text-slate-500 font-medium">
                  ({trailData?.focal_bank || 'Banking'} Mule Syndicate)
                </span>
              </h3>
              {trailData?.focal_location && (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  {trailData.focal_location.city} ({trailData.focal_location.zone})
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {activeTopologyDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 font-medium rounded-lg text-[11px]">
              Layers: {trailData?.layers_count || 4} / Nodes: {trailData?.nodes_count || 8} / Intercept Tracker: <strong className="text-emerald-600">Active</strong>
            </span>

            {/* Interactive Graph Tool Buttons */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
                className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
                className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('maps', selectedAccountId)}
                className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md font-bold text-[11px] flex items-center gap-1"
                title="Layer on Live Map"
              >
                <MapPin className="w-3 h-3" />
                <span>Layer on Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Topology & Pattern Switcher Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 text-xs">
          {/* Topology Shape Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mr-1">
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              Graph Shape:
            </span>
            <button
              onClick={() => setSelectedTopology('auto')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedTopology === 'auto'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Auto ({trailData?.detected_topology === 'linear_relay' ? 'Linear Pipeline' : trailData?.detected_topology === 'tree_dispersal' ? 'Branching Tree' : trailData?.detected_topology === 'circular_ring' ? 'Circular Ring' : trailData?.detected_topology === 'geo_spatial' ? 'Geo Spatial' : 'Radial Funnel'})
            </button>
            <button
              onClick={() => setSelectedTopology('radial_funnel')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                effectiveTopology === 'radial_funnel' && selectedTopology !== 'auto'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Radial Funnel
            </button>
            <button
              onClick={() => setSelectedTopology('linear_relay')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                effectiveTopology === 'linear_relay' && selectedTopology !== 'auto'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Linear Pipeline
            </button>
            <button
              onClick={() => setSelectedTopology('tree_dispersal')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                effectiveTopology === 'tree_dispersal' && selectedTopology !== 'auto'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Branching Tree
            </button>
            <button
              onClick={() => setSelectedTopology('circular_ring')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                effectiveTopology === 'circular_ring' && selectedTopology !== 'auto'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Circular Ring
            </button>
            <button
              onClick={() => setSelectedTopology('geo_spatial')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                effectiveTopology === 'geo_spatial' && selectedTopology !== 'auto'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Geo-Spatial Quad
            </button>
          </div>

          {/* Pattern Visual Mode Toggle */}
          <div className="flex items-center gap-1.5 self-start md:self-auto">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Pattern Mode:
            </span>
            <div className="bg-white p-0.5 rounded-lg border border-slate-200 flex items-center">
              <button
                onClick={() => setPatternMode('channels')}
                className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] transition-all ${
                  patternMode === 'channels'
                    ? 'bg-blue-50 text-blue-700 font-extrabold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Transfer Channels
              </button>
              <button
                onClick={() => setPatternMode('locations')}
                className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] transition-all ${
                  patternMode === 'locations'
                    ? 'bg-blue-50 text-blue-700 font-extrabold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Regional Corridors
              </button>
            </div>
          </div>
        </div>

        {/* Interactive SVG Diagram matching image layout + dynamic topology */}
        <div className="relative w-full h-88 bg-gradient-to-b from-slate-50/90 to-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <RotateCcw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Synthesizing multi-hop layering pathways and spatial coordinates...</span>
            </div>
          ) : (
            <div
              className="w-full h-full transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <svg className="w-full h-full" viewBox="0 0 860 340">
                {/* Defs for arrowheads and gradients */}
                <defs>
                  <marker
                    id="arrowhead-blue"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#3B82F6" />
                  </marker>
                  <marker
                    id="arrowhead-emerald"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#10B981" />
                  </marker>
                  <marker
                    id="arrowhead-amber"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#F59E0B" />
                  </marker>
                  <marker
                    id="arrowhead-red"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#EF4444" />
                  </marker>
                  <marker
                    id="arrowhead-purple"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#7C3AED" />
                  </marker>
                  <marker
                    id="arrowhead-dashed"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#DC2626" />
                  </marker>
                </defs>

                {/* Background Regional Quadrant Watermarks (Active in Geo Spatial Mode) */}
                {effectiveTopology === 'geo_spatial' && (
                  <g opacity="0.6">
                    <rect x="360" y="30" width="360" height="90" rx="8" fill="#F1F5F9" stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x="375" y="50" fontSize="10" fontWeight="bold" fill="#64748B">NORTH ZONE (Federal Capital &amp; KPK)</text>

                    <rect x="460" y="125" width="260" height="80" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x="475" y="142" fontSize="10" fontWeight="bold" fill="#64748B">CENTRAL ZONE (Punjab Corridor)</text>

                    <rect x="250" y="215" width="240" height="90" rx="8" fill="#F1F5F9" stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x="265" y="235" fontSize="10" fontWeight="bold" fill="#64748B">SOUTH ZONE (Sindh / Karachi)</text>

                    <rect x="120" y="130" width="180" height="80" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x="135" y="148" fontSize="10" fontWeight="bold" fill="#64748B">WEST ZONE (Balochistan)</text>
                  </g>
                )}

                {/* 1. Connecting Edges with Amounts & Channel Patterns */}
                {(trailData?.edges || []).map((edge: any, idx: number) => {
                  const fromNode = trailData?.nodes?.find((n: any) => n.id === edge.from);
                  const toNode = trailData?.nodes?.find((n: any) => n.id === edge.to);
                  
                  const p1 = getNodePos(fromNode);
                  const p2 = getNodePos(toNode);

                  const channelType = edge.channel?.type || '1ibft';
                  const strokeColor = edge.channel?.lineColor || edge.color || '#3B82F6';
                  const isDashed = edge.dashed || edge.channel?.dashArray !== 'none';
                  const dashArray = edge.channel?.dashArray || (isDashed ? '4 3' : 'none');

                  // Calculate curve arc for flight / circular paths
                  const isCurved = effectiveTopology === 'geo_spatial' || effectiveTopology === 'circular_ring';
                  const curveOffset = effectiveTopology === 'geo_spatial' ? -30 : (idx % 2 === 0 ? 25 : -25);
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2 + (isCurved ? curveOffset : 0);

                  const pathD = isCurved
                    ? `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`
                    : `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;

                  // Marker selection
                  const markerId = channelType === 'raast'
                    ? 'url(#arrowhead-emerald)'
                    : channelType === 'intrabank'
                    ? 'url(#arrowhead-amber)'
                    : channelType === 'crypto'
                    ? 'url(#arrowhead-purple)'
                    : channelType === 'atm'
                    ? 'url(#arrowhead-dashed)'
                    : edge.from.startsWith('V')
                    ? 'url(#arrowhead-blue)'
                    : 'url(#arrowhead-red)';

                  // Badge Text based on Pattern Mode
                  const badgeText = patternMode === 'channels'
                    ? `${edge.channel?.icon || '•'} ${edge.channel?.label || 'TRANSFER'}`
                    : `✈️ ${edge.corridor || 'Inter-City'}`;

                  return (
                    <g key={idx}>
                      {/* Base Edge Path with smooth transition */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={channelType === 'raast' ? '2.5' : channelType === 'atm' ? '2' : '2.2'}
                        strokeDasharray={dashArray}
                        markerEnd={markerId}
                        className={channelType === 'raast' ? 'animate-pulse' : ''}
                      />

                      {/* Moving pulse dot along the path for instant/wire channels */}
                      {(channelType === 'raast' || channelType === '1ibft') && (
                        <circle
                          r="3"
                          fill={strokeColor}
                          opacity="0.9"
                        >
                          <animateMotion
                            path={pathD}
                            dur={channelType === 'raast' ? '1.5s' : '3s'}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Edge Pill: Displays Channel Mechanism or Geographic Corridor + Amount */}
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-48"
                          y="-16"
                          width="96"
                          height="28"
                          rx="5"
                          fill="#FFFFFF"
                          stroke={strokeColor}
                          strokeWidth="0.9"
                          className="drop-shadow-xs"
                          opacity="0.96"
                        />
                        {/* Channel or Corridor Label */}
                        <text
                          x="0"
                          y="-5"
                          fontSize="7.5"
                          fontWeight="bold"
                          fill={strokeColor}
                          textAnchor="middle"
                        >
                          {badgeText}
                        </text>
                        {/* Amount */}
                        <text
                          x="0"
                          y="7"
                          fontSize="9"
                          fontWeight="900"
                          fill="#1E293B"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {edge.amount}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* 2. Interactive Nodes with Dynamic Coordinates & Location Badges */}
                {(trailData?.nodes || []).map((node: any, idx: number) => {
                  const pos = getNodePos(node);
                  const isSelected = selectedNode?.id === node.id;
                  const isMuleHub = node.isCenter;
                  const isVictim = node.type === 'victim';
                  const isLayer2 = node.type === 'layer2';
                  const isSquare = node.isSquare;

                  const cityLabel = node.location?.city || (node.isSquare ? 'Branch' : 'City');

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer transition-all hover:opacity-95"
                      onClick={() => setSelectedNode(node)}
                    >
                      {/* Node Shape */}
                      {isSquare ? (
                        // Off-Ramp Square Node (ATM or Crypto)
                        <>
                          <rect
                            x={pos.x - 22}
                            y={pos.y - 22}
                            width="44"
                            height="44"
                            rx="10"
                            fill={node.color}
                            stroke={isSelected ? '#1D63FF' : '#FFFFFF'}
                            strokeWidth={isSelected ? '3' : '1.5'}
                            className="drop-shadow-sm"
                          />
                          <text
                            x={pos.x}
                            y={pos.y + 5}
                            fontSize="17"
                            fill="#FFFFFF"
                            textAnchor="middle"
                          >
                            {node.label}
                          </text>
                        </>
                      ) : isMuleHub ? (
                        // Center Mule Hub (Prominent with Pulsing Ring)
                        <>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="38"
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="2"
                            opacity="0.3"
                            className="animate-ping"
                          />
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="32"
                            fill="#EF4444"
                            stroke={isSelected ? '#1D63FF' : '#FCA5A5'}
                            strokeWidth="4"
                            className="drop-shadow-md"
                          />
                          <text
                            x={pos.x}
                            y={pos.y + 4}
                            fontSize="10"
                            fill="#FFFFFF"
                            textAnchor="middle"
                            fontWeight="900"
                            fontFamily="monospace"
                          >
                            {node.label.length > 10 ? `${node.label.slice(0, 9)}..` : node.label}
                          </text>
                        </>
                      ) : (
                        // Standard Circular Node (Victim or Layer-2)
                        <>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={isVictim ? '22' : '25'}
                            fill={node.color}
                            stroke={isSelected ? '#1D63FF' : '#FFFFFF'}
                            strokeWidth={isSelected ? '3' : '1.5'}
                            className="drop-shadow-xs"
                          />
                          <text
                            x={pos.x}
                            y={pos.y + 4}
                            fontSize={isVictim ? '11' : '10'}
                            fill="#FFFFFF"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            {node.label}
                          </text>
                        </>
                      )}

                      {/* Sub-label Below Node */}
                      <text
                        x={pos.x}
                        y={pos.y + 35}
                        fontSize="9"
                        fill={isMuleHub ? '#DC2626' : isLayer2 ? '#C2410C' : isVictim ? '#334155' : '#7C3AED'}
                        textAnchor="middle"
                        fontWeight={isMuleHub ? 'bold' : '600'}
                      >
                        {node.sub}
                      </text>

                      {/* Location Badge Pin Below Sub-label */}
                      <g transform={`translate(${pos.x}, ${pos.y + 48})`}>
                        <rect
                          x="-32"
                          y="-8"
                          width="64"
                          height="14"
                          rx="3"
                          fill="#F8FAFC"
                          stroke="#CBD5E1"
                          strokeWidth="0.6"
                          opacity="0.9"
                        />
                        <text
                          x="0"
                          y="2"
                          fontSize="7.5"
                          fontWeight="bold"
                          fill="#475569"
                          textAnchor="middle"
                        >
                          📍 {cityLabel}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Node Inspector Bar (When a node is selected) */}
        {selectedNode && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/90 via-slate-50 to-white border border-blue-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-slate-800">Inspected Forensic Node:</span>
              <span className="font-mono font-bold text-blue-700 bg-white px-2.5 py-1 rounded-md border border-blue-200 shadow-2xs">
                {selectedNode.id} ({selectedNode.sub})
              </span>
              <span className="text-slate-600">
                Volume: <strong>{selectedNode.amount}</strong>
              </span>
              {selectedNode.location && (
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                  📍 {selectedNode.location.city}, {selectedNode.location.province} ({selectedNode.location.jurisdiction})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('evidence')}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-lg text-[11px]"
              >
                View Evidence Hash
              </button>
              <button
                onClick={() => handleToggleNodeFreeze(selectedNode.id)}
                className={`px-3 py-1 font-bold rounded-lg text-[11px] text-white shadow-xs ${
                  nodeFreezeStates[selectedNode.id]
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {nodeFreezeStates[selectedNode.id] ? 'Debit Restricted (Frozen)' : 'Freeze This Node'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Row: Left Panel (Timeline & Velocity) + Right Panel (Syndicate Analytics & Speedometer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Panel 1 (Left 6 Cols): Forensic Timeline & Transaction Flow */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Forensic Timeline &amp; Transaction Flow
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Visual forensic tracing of fund division, velocity pulses, and channel latency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Sub-chart A: Historical Inflow-Outflow Timeline (8 Cols) */}
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 text-[11px]">Historical Inflow-Outflow Timeline</span>
                <div className="flex items-center gap-3 text-[10px] font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                    <span className="text-slate-600">Incoming</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-red-500"></span>
                    <span className="text-slate-600">Outgoing</span>
                  </span>
                </div>
              </div>

              {/* Dual-directional SVG Timeline Chart */}
              <div className="h-36 w-full bg-slate-50 rounded-lg border border-slate-200 p-2 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 280 110">
                  {/* Center zero line */}
                  <line x1="20" y1="55" x2="270" y2="55" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="8" y="58" fontSize="8" fill="#94A3B8">0</text>
                  <text x="6" y="16" fontSize="8" fill="#3B82F6">+100</text>
                  <text x="6" y="102" fontSize="8" fill="#EF4444">-100</text>

                  {/* Incoming Upper Blue Curve */}
                  <path
                    d="M 30 55 L 55 35 L 80 15 L 105 45 L 130 10 L 155 40 L 180 20 L 205 50 L 230 18 L 255 42"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  {/* Outgoing Lower Red Curve */}
                  <path
                    d="M 30 55 L 55 65 L 80 85 L 105 95 L 130 80 L 155 102 L 180 75 L 205 98 L 230 70 L 255 100"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                  />

                  {/* Points on peaks */}
                  <circle cx="80" cy="15" r="3" fill="#3B82F6" />
                  <circle cx="130" cy="10" r="3" fill="#3B82F6" />
                  <circle cx="105" cy="95" r="3" fill="#EF4444" />
                  <circle cx="155" cy="102" r="3" fill="#EF4444" />
                </svg>
              </div>

              <div className="flex justify-between text-[9px] text-slate-400 font-mono px-2">
                <span>18:00</span>
                <span>18:15</span>
                <span>18:30</span>
                <span>18:45</span>
              </div>
            </div>

            {/* Sub-chart B: Detected Alert Velocity Gauges (4 Cols) */}
            <div className="md:col-span-4 space-y-3 pl-2 border-l border-slate-100">
              <div className="font-bold text-slate-800 text-[11px]">Detected Alert Velocity</div>

              {/* Gauge 1: Overall */}
              <div className="text-center">
                <div className="relative w-24 h-13 mx-auto overflow-hidden">
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" strokeDasharray="125 125" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="8" strokeDasharray="95 125" strokeLinecap="round" />
                    <line x1="50" y1="50" x2="35" y2="25" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="3" fill="#1E293B" />
                  </svg>
                </div>
                <div className="text-[10px] font-bold text-slate-400">Overall</div>
                <div className="text-[11px] font-extrabold text-slate-800">
                  Overall Laundering Velocity
                </div>
              </div>

              {/* Gauge 2: Burst Rate */}
              <div className="text-center pt-1 border-t border-slate-100">
                <div className="relative w-24 h-13 mx-auto overflow-hidden">
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" strokeDasharray="125 125" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="8" strokeDasharray="115 125" strokeLinecap="round" />
                    <line x1="50" y1="50" x2="68" y2="28" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="3" fill="#EF4444" />
                  </svg>
                </div>
                <div className="text-[10px] font-bold text-slate-400">Burst rate:</div>
                <div className="text-[11px] font-black text-red-600">
                  {trailData?.velocities?.burst_rate || '7.4 tx/min (Red Alert)'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2 (Right 6 Cols): Syndicate Analytics & Node Status */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Syndicate Analytics &amp; Node Status
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live operational health and interactive cryptographic debit freeze controls
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Sub-panel A: Active Node Health & Freeze Status Table (7 Cols) */}
            <div className="md:col-span-7 space-y-2">
              <div className="font-bold text-slate-800 text-[11px]">Active Node Health &amp; Freeze Status</div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-2.5 py-2">Node</th>
                      <th className="px-2 py-2">Status</th>
                      <th className="px-2 py-2 text-right">Interactive freeze</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-[11px]">
                    {(trailData?.active_node_statuses || []).map((nodeItem: any) => {
                      const isFrozen = !!nodeFreezeStates[nodeItem.id];
                      return (
                        <tr key={nodeItem.id} className="hover:bg-slate-50">
                          <td className="px-2.5 py-2 font-mono font-bold text-slate-800 truncate max-w-[100px]">
                            <div>{nodeItem.name}</div>
                            {nodeItem.location && (
                              <div className="text-[9px] font-normal text-slate-400 font-sans">{nodeItem.location}</div>
                            )}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                              isFrozen
                                ? 'bg-red-600 text-white'
                                : nodeItem.badgeColor || 'bg-slate-100 text-slate-700'
                            }`}>
                              {isFrozen ? 'DEBIT FROZEN' : nodeItem.status}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-right">
                            {/* Interactive iOS-style Toggle Switch */}
                            <button
                              type="button"
                              onClick={() => handleToggleNodeFreeze(nodeItem.id)}
                              className={`w-9 h-5 rounded-full transition-colors relative inline-flex items-center p-0.5 ${
                                isFrozen ? 'bg-red-600' : 'bg-blue-600'
                              }`}
                              title={isFrozen ? 'Unfreeze' : 'Freeze Account'}
                            >
                              <span
                                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                                  isFrozen ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-panel B: Risk Speedometer (5 Cols) */}
            <div className="md:col-span-5 text-center pl-2 border-l border-slate-100 space-y-2">
              <div className="font-bold text-slate-800 text-[11px]">Risk Speedometer</div>

              {/* Gauge Semi-Circle Meter with Color Bands */}
              <div className="relative w-36 h-20 mx-auto overflow-hidden">
                <svg className="w-36 h-36" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="speedoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="85%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#B91C1C" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="10"
                    strokeDasharray="125 125"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#speedoGrad)"
                    strokeWidth="10"
                    strokeDasharray="120 125"
                    strokeLinecap="round"
                  />
                  <line
                    x1="50"
                    y1="50"
                    x2="80"
                    y2="38"
                    stroke="#B91C1C"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="50" r="4" fill="#1E293B" />
                </svg>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-600">
                  {trailData?.velocities?.risk_label || 'Extreme Multi-Node Velocity'}
                </div>
                <div className="text-base font-black text-red-600 mt-0.5">
                  Risk: {trailData?.risk_score || 96}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Transfer Channels & Regional Corridors Breakdown Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Channel Breakdown Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" />
              Transfer Channels Composition
            </span>
            <span className="text-[11px] text-slate-500">Live Transaction Distribution</span>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-1">
            <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-center">
              <div className="text-[10px] font-bold text-emerald-700">RAAST FAST</div>
              <div className="text-sm font-black text-emerald-900 mt-0.5">{trailData?.channel_distribution?.raast || 68}%</div>
              <div className="text-[9px] text-emerald-600">Instant (&lt;30s)</div>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 text-center">
              <div className="text-[10px] font-bold text-blue-700">1IBFT WIRE</div>
              <div className="text-sm font-black text-blue-900 mt-0.5">{trailData?.channel_distribution?.ibft || 72}%</div>
              <div className="text-[9px] text-blue-600">Real-Time RTGS</div>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-center">
              <div className="text-[10px] font-bold text-amber-700">INTRABANK</div>
              <div className="text-sm font-black text-amber-900 mt-0.5">{trailData?.channel_distribution?.intrabank || 45}%</div>
              <div className="text-[9px] text-amber-600">Internal Sweep</div>
            </div>
            <div className="p-2.5 rounded-lg bg-red-50/60 border border-red-200 text-center">
              <div className="text-[10px] font-bold text-red-700">OFF-RAMPS</div>
              <div className="text-sm font-black text-red-900 mt-0.5">{trailData?.channel_distribution?.cashout || 42}%</div>
              <div className="text-[9px] text-red-600">ATM + Crypto</div>
            </div>
          </div>
        </div>

        {/* Geographic Corridors Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-blue-600" />
              Regional Geographic Corridors
            </span>
            <span className="text-[11px] text-slate-500">Cross-Jurisdiction Tracking</span>
          </div>
          <div className="space-y-1.5 pt-1 text-xs">
            {(trailData?.edges || []).slice(0, 3).map((e: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 font-mono">{e.corridor}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    e.isCrossJurisdiction ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {e.isCrossJurisdiction ? 'Inter-Provincial Jump' : 'Intra-State'}
                  </span>
                </div>
                <span className="font-mono font-bold text-blue-700">{e.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Emergency Multi-Node Freeze Modal */}
      {showMultiFreezeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-4 border-b border-slate-200 bg-red-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-sm text-red-900">
                  Propose Emergency Multi-Node Freeze
                </h3>
              </div>
              <button
                onClick={() => setShowMultiFreezeModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              <p className="text-slate-600 leading-relaxed">
                You are executing an emergency simultaneous debit restriction order across all active nodes in Money Trail incident{' '}
                <strong className="font-mono text-red-600">{trailData?.focal_account}</strong>.
              </p>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Targeted Syndicate Nodes for Immediate Freezing:
                </div>
                {(trailData?.active_node_statuses || []).map((node: any) => (
                  <div key={node.id} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-800">{node.name}</span>
                      {node.location && <span className="ml-2 text-[10px] text-slate-400">({node.location})</span>}
                    </div>
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                      Section 102 CrPC Lien
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-relaxed">
                <strong>Statutory Governance Mandate:</strong> This order will dispatch immediate electronic preservation directives to all intermediary banking nodal officers pursuant to Section 102 CrPC / Section 106 BNSS.
              </div>

              {freezeSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{freezeSuccessMsg}</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowMultiFreezeModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteMultiFreeze}
                disabled={freezingMulti}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{freezingMulti ? 'Enforcing Freezes...' : 'Execute Multi-Node Freeze Order'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};