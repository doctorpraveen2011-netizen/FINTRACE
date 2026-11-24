import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Key,
  Shield,
  Radio,
  Layers,
  Search,
  AlertTriangle,
  Send,
  FileText,
  Clock,
  Compass,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Volume2,
  VolumeX,
  Lock,
  ArrowRight,
  Eye,
  Crosshair,
  Zap,
  Building,
  Navigation,
  Maximize2,
  Minimize2,
  ChevronRight,
  Share2,
  Activity,
  Filter,
  CheckSquare,
  Square,
  Database,
  Printer,
  Copy,
  Check,
  PhoneCall,
  Siren,
  X,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  SlidersHorizontal,
  Landmark
} from 'lucide-react';
import { io as socketIOClient, Socket } from 'socket.io-client';

declare global {
  interface Window {
    cyberhxaMapAction?: (action: string, pinId: string) => void;
    fintraceMapAction?: (action: string, pinId: string) => void;
  }
}

export interface InvestigationOfficer {
  officer_name: string;
  rank: string;
  badge_no: string;
  station: string;
  contact_number: string;
  radio_callsign: string;
  encrypted_freq: string;
  statutory_warrant: string;
  directive: string;
  assigned_date: string;
}

export interface PatrolUnit {
  unit_callsign: string;
  vehicle_type: string;
  vehicle_reg: string;
  crew_strength: string;
  status: 'ACTIVE_INTERCEPT' | 'PERIMETER_SURVEILLANCE' | 'WARRANT_EXECUTION' | 'INTERCEPT_STANDBY';
  alert_level: 'RED_CRITICAL' | 'AMBER_HIGH' | 'PURPLE_WARRANT' | 'BLUE_NORMAL';
  eta_minutes: string;
  distance_km: number;
  patrol_coords: { lat: number; lng: number };
  directive: string;
  last_radio_ping: string;
}

export interface CadastralData {
  country: string;
  state_province: string;
  cyber_zone: string;
  district_tehsil: string;
  town_sector: string;
  postal_code: string;
  elevation: string;
  banking_enclave: string;
  street_address: string;
  cross_street: string;
  building_footprint: string;
  cadastral_plot_id: string;
  cctv_safe_city: string;
  police_beat: string;
  gps_inch_precision: {
    latitude: number;
    longitude: number;
    resolution_meters: number;
    resolution_inches: number;
  };
  escape_routes: Array<{
    corridor: string;
    distance_m: number;
    transit_car?: string;
    transit_foot?: string;
    intercept_prob: string;
    patrol?: string;
  }>;
}

interface TacticalPin {
  id: string;
  account_no: string;
  holder_name?: string;
  title: string;
  type: 'ATM_CASHOUT' | 'MULE_HUB' | 'VICTIM_ORIGIN' | 'CRYPTO_DESK' | 'TELECOM_BTS' | 'PATROL_UNIT';
  layer: 'LAYER_A' | 'LAYER_B' | 'LAYER_C' | 'LAYER_D' | 'LAYER_E' | 'LAYER_F';
  layer_name: string;
  typology?: string;
  velocity_burst?: string;
  pass_through_ratio?: string;
  fan_in_senders?: number;
  fan_out_hops?: number;
  linked_phone?: string;
  reported_by_institution?: string;
  tx_evidence?: any[];
  district?: string;
  cityName?: string;
  lat: number;
  lng: number;
  city: string;
  province?: string;
  zone?: string;
  jurisdiction?: string;
  bank: string;
  branch?: string;
  location_text?: string;
  risk: string;
  severity: number;
  amount: string;
  channel?: string;
  telecom_bts?: string;
  freeze_status?: string;
  timestamp: string;
  associated_case?: string;
  evidence_source?: string;
  provenance?: string;
  cctv_reference?: string;
  dispenser_id?: string;
  wallet_hash?: string;
  coverage_radius_meters?: number;
  azimuth_degrees?: number;
  investigation_officer?: InvestigationOfficer;
  patrol_unit?: PatrolUnit;
  target_branch_coords?: { lat: number; lng: number };
  target_account_no?: string;
  target_bank?: string;
  patrol_unit_callsign?: string;
  cadastral?: CadastralData;
  elevation?: string;
  street_address?: string;
  cross_street?: string;
  building_footprint?: string;
  cadastral_plot_id?: string;
  predictive_escape_routes?: any[];
}

interface MoneyTrailVector {
  id: string;
  from: [number, number];
  to: [number, number];
  fromCity: string;
  toCity: string;
  label: string;
  amount: string;
  channel: string;
  channelType: string;
  color: string;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  relationshipStatus: string;
  distanceKm: number;
  estimatedTransitMinutes: number;
}

interface ActivePatrol {
  dispatchId: string;
  unitCallsign: string;
  targetPinId: string;
  targetAccount: string;
  currentCoords: [number, number];
  targetCoords: [number, number];
  etaSeconds: number;
  status: string;
}

interface LiveGoogleMapsProps {
  onNavigate?: (id: string, targetAccount?: string) => void;
  initialAccountId?: string;
}

const DEFAULT_GOOGLE_MAPS_KEY = "AIzaSyFINTRACE-FIU-Gov-Tactical-Key-2026-98412";

type GoogleMapLayerType = 'hybrid' | 'roadmap' | 'satellite' | 'terrain';

// 12 Cybercrime Command Jurisdictions with exact focal centers
const JURISDICTION_COMMANDS = [
  { city: "Gujranwala", count: 110, lat: 32.1877, lng: 74.1945, command: "Punjab Police Cyber Command (Gujranwala)" },
  { city: "Multan", count: 106, lat: 30.1984, lng: 71.4687, command: "Punjab Police Cyber Command (South Multan)" },
  { city: "Sialkot", count: 104, lat: 32.4945, lng: 74.5229, command: "Punjab Police Cyber Unit (Sialkot Industrial)" },
  { city: "Sukkur", count: 99, lat: 27.7052, lng: 68.8574, command: "Sindh Police Cyber Unit (Sukkur Division)" },
  { city: "Karachi", count: 96, lat: 24.8508, lng: 67.0011, command: "Sindh Police FIU Command (Karachi HQ)" },
  { city: "Lahore", count: 95, lat: 31.5204, lng: 74.3587, command: "Punjab Police Cyber Command (Lahore HQ)" },
  { city: "Faisalabad", count: 94, lat: 31.4187, lng: 73.0791, command: "Punjab Police Cyber Crime Wing (Faisalabad)" },
  { city: "Quetta", count: 94, lat: 30.1798, lng: 66.9750, command: "Balochistan FIU Taskforce (Quetta HQ)" },
  { city: "Hyderabad", count: 87, lat: 25.3960, lng: 68.3578, command: "Sindh Police Cyber Crime Wing (Hyderabad)" },
  { city: "Peshawar", count: 85, lat: 34.0151, lng: 71.5249, command: "KP Police Cyber Crime Cell (Peshawar)" },
  { city: "Islamabad", count: 83, lat: 33.7294, lng: 73.0931, command: "FIA Federal Cyber Command (Federal HQ)" },
  { city: "Rawalpindi", count: 78, lat: 33.5973, lng: 73.0479, command: "Punjab Police Cyber Unit (Rawalpindi)" }
];

export const LiveGoogleMaps: React.FC<LiveGoogleMapsProps> = ({
  onNavigate,
  initialAccountId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const tileLayer = useRef<L.TileLayer | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);
  const corridorsGroup = useRef<L.LayerGroup | null>(null);
  const patrolsGroup = useRef<L.LayerGroup | null>(null);
  const inspectorMarkerRef = useRef<L.Marker | null>(null);

  // Real Google Maps API Key State
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('FINTRACE_GOOGLE_MAPS_KEY') || localStorage.getItem('CYBERHXA_GOOGLE_MAPS_KEY') || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || DEFAULT_GOOGLE_MAPS_KEY;
  });
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey);
  const [mapLayer, setMapLayer] = useState<GoogleMapLayerType>('hybrid');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Data States
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState<TacticalPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<TacticalPin | null>(null);
  const [availableAccounts, setAvailableAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(initialAccountId || 'acc_00083575');
  const [moneyTrailVectors, setMoneyTrailVectors] = useState<MoneyTrailVector[]>([]);
  const [layerCounts, setLayerCounts] = useState({ layer_a: 0, layer_b: 0, layer_c: 0, layer_d: 0, layer_e: 0, layer_f: 0 });

  // 6 Geospatial Intelligence Layers Visibility
  const [activeLayers, setActiveLayers] = useState({
    layer_a: true, // Mule Account Hubs
    layer_b: true, // ATM Cash-outs
    layer_c: true, // Victim Origins
    layer_d: true, // Crypto Desks
    layer_e: true, // Telecom BTS Towers
    layer_f: true  // Police Patrol Interceptors & IO Units
  });

  // Active Patrol Alert & Intercept Mode
  const [patrolAlertMode, setPatrolAlertMode] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // 3D Oblique Viewing Angle & Compass Heading State (User Viewing Angle Upgrade)
  const [viewingAngle, setViewingAngle] = useState<number>(0); // 0° (2D Top-Down), 30°, 45°, 60°
  const [headingAngle, setHeadingAngle] = useState<number>(0); // 0° (North), 90°, 180°, 270°
  const [isStreetFootprintActive, setIsStreetFootprintActive] = useState<boolean>(false);

  // Tactical Encrypted Radio Transmission Modal State
  const [showRadioModal, setShowRadioModal] = useState(false);
  const [radioTargetPin, setRadioTargetPin] = useState<TacticalPin | null>(null);
  const [radioTxMessage, setRadioTxMessage] = useState('');
  const [isRadioTransmitting, setIsRadioTransmitting] = useState(false);
  const [radioTransmissionLogs, setRadioTransmissionLogs] = useState<any[]>([
    {
      id: "LOG-01",
      timestamp: "14:20:12",
      channel: "155.475 MHz",
      from: "Central Cybercrime Dispatch",
      to: "ALL UNITS",
      message: "Priority Alert: All jurisdiction tactical patrol units standby for coordinated Section 102 CrPC perimeter cordon.",
      ack: "Acknowledged by 12 Tactical Units across regional grids."
    }
  ]);

  // All-Points Bulletin (APB) Flash Modal State
  const [showApbModal, setShowApbModal] = useState(false);
  const [apbTargetPin, setApbTargetPin] = useState<TacticalPin | null>(null);
  const [apbSuccessMsg, setApbSuccessMsg] = useState<string | null>(null);

  // Police Crime Typology Filter State
  const [selectedTypology, setSelectedTypology] = useState<string>('ALL');
  const [selectedJurisdictionCity, setSelectedJurisdictionCity] = useState<string>('ALL');

  // Feature Detection Dimension Filters
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>('ALL');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Real-Time Alert Ticker & WebSockets
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [patrolStatus, setPatrolStatus] = useState<{ [id: string]: { status: string; eta: string; unit: string } }>({});
  const [activePatrols, setActivePatrols] = useState<ActivePatrol[]>([]);
  const [freezeNoticeMsg, setFreezeNoticeMsg] = useState<string | null>(null);
  const [showSatelliteModal, setShowSatelliteModal] = useState(false);
  const [satelliteViewType, setSatelliteViewType] = useState<'k' | 'm' | 'street'>('k');

  // Statutory Notice Modal State
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [statutoryNoticeData, setStatutoryNoticeData] = useState<any>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [noticeTransmitted, setNoticeTransmitted] = useState(false);

  // Coordinate Inspector (Map Click Reverse Geocode)
  const [inspectedLocation, setInspectedLocation] = useState<any>(null);

  // Selected Corridor Modal
  const [selectedCorridor, setSelectedCorridor] = useState<MoneyTrailVector | null>(null);

  // Play subtle tactical radio ping sound via Web Audio API
  const playTacticalAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // Google Maps Tile URL Generator
  const getGoogleTileUrl = (type: GoogleMapLayerType) => {
    const code = type === 'satellite' ? 's' :
                 type === 'roadmap' ? 'm' :
                 type === 'terrain' ? 'p' : 'y';
    return `https://mt{s}.google.com/vt/lyrs=${code}&x={x}&y={y}&z={z}`;
  };

  // Initialize Leaflet Map with Google Maps Tile Engine & Click Inspector
  useEffect(() => {
    if (!mapContainerRef.current || leafletMap.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [30.1575, 71.5249],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true
    });

    const tiles = L.tileLayer(getGoogleTileUrl(mapLayer), {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '© Google Maps Platform • Law Enforcement Tactical Grid'
    }).addTo(map);

    tileLayer.current = tiles;

    const mg = L.layerGroup().addTo(map);
    const cg = L.layerGroup().addTo(map);
    const pg = L.layerGroup().addTo(map);
    markersGroup.current = mg;
    corridorsGroup.current = cg;
    patrolsGroup.current = pg;

    // Handle Map Click for Reverse Geocoding & Coordinate Telemetry Inspection
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(`/api/maps/reverse-geocode?lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setInspectedLocation(json.data);
          playTacticalAlertSound();

          // Drop or move the inspector marker
          if (inspectorMarkerRef.current) {
            inspectorMarkerRef.current.setLatLng([lat, lng]);
          } else {
            const crosshairIcon = L.divIcon({
              className: 'inspector-crosshair',
              html: `
                <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
                  <div style="position:absolute;inset:0;border:2px dashed #0284C7;border-radius:50%;animation:spin 6s linear infinite;"></div>
                  <div style="width:8px;height:8px;background:#0284C7;border-radius:50%;"></div>
                </div>
              `,
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            });
            inspectorMarkerRef.current = L.marker([lat, lng], { icon: crosshairIcon }).addTo(map);
          }
        }
      } catch (err) {
        console.error("Reverse geocode failed:", err);
      }
    });

    leafletMap.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  // Map popup action bridge (allows direct clicks on buttons inside Leaflet popups)
  useEffect(() => {
    const handleAction = (action: string, pinId: string) => {
      const pin = pins.find(p => p.id === pinId);
      if (!pin) return;

      if (action === 'dossier') {
        setSelectedPin(pin);
        leafletMap.current?.flyTo([pin.lat, pin.lng], 9, { duration: 1 });
      } else if (action === 'freeze') {
        handleFreezeNode(pin.account_no);
      } else if (action === 'patrol') {
        handleDispatchPatrol(pin);
      } else if (action === 'recon') {
        setSelectedPin(pin);
        setShowSatelliteModal(true);
      } else if (action === 'radio') {
        setSelectedPin(pin);
        setRadioTargetPin(pin);
        setShowRadioModal(true);
        playTacticalAlertSound();
      } else if (action === 'apb') {
        setSelectedPin(pin);
        setApbTargetPin(pin);
        setShowApbModal(true);
        playTacticalAlertSound();
      }
    };

    window.cyberhxaMapAction = handleAction;
    window.fintraceMapAction = handleAction;

    return () => {
      delete window.cyberhxaMapAction;
      delete window.fintraceMapAction;
    };
  }, [pins]);

  // Update Google Maps Tile Layer when user switches Hybrid/Roads/Satellite/Terrain
  useEffect(() => {
    if (tileLayer.current) {
      tileLayer.current.setUrl(getGoogleTileUrl(mapLayer));
    }
  }, [mapLayer]);

  // Handle Fullscreen resize
  useEffect(() => {
    if (leafletMap.current) {
      setTimeout(() => {
        leafletMap.current?.invalidateSize();
      }, 300);
    }
  }, [isFullscreen]);

  // Fetch Mule Accounts & Live Tactical Pins
  const fetchMapData = async (accId?: string) => {
    setLoading(true);
    try {
      const queryAcc = accId || selectedAccountId;
      const res = await fetch(`/api/maps/live-pins?account_no=${encodeURIComponent(queryAcc)}&limit=350`);
      const json = await res.json();
      if (json.success && json.data) {
        setPins(json.data.pins || []);
        setMoneyTrailVectors(json.data.money_trail_vectors || []);
        if (json.data.counts_by_layer) {
          setLayerCounts(json.data.counts_by_layer);
        }

        if (json.data.focal_center && leafletMap.current) {
          leafletMap.current.panTo([json.data.focal_center.lat, json.data.focal_center.lng], { animate: true });
        }

        const targetPin = json.data.pins?.find((p: any) => p.account_no === queryAcc) || json.data.pins?.[0];
        if (targetPin) {
          setSelectedPin(targetPin);
        }
      }
    } catch (err) {
      console.error('Failed to load live pins:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch list of available mule accounts for switcher
  const fetchAvailableAccounts = async () => {
    try {
      const res = await fetch('/api/mules?limit=35');
      const json = await res.json();
      if (json.success && json.accounts) {
        setAvailableAccounts(json.accounts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAvailableAccounts();
  }, []);

  useEffect(() => {
    if (initialAccountId && initialAccountId !== selectedAccountId) {
      setSelectedAccountId(initialAccountId);
      fetchMapData(initialAccountId);
    } else {
      fetchMapData(selectedAccountId);
    }
  }, [initialAccountId]);

  // Connect to Real-time WebSocket Event Pipeline directly to Gateway (port 5000)
  useEffect(() => {
    let socket: Socket | null = null;
    try {
      const socketUrl = window.location.port === '3000' ? `http://${window.location.hostname}:5000` : undefined;
      socket = socketIOClient(socketUrl, { transports: ['websocket', 'polling'] });
      
      socket.on('geospatial_event', (eventData: any) => {
        playTacticalAlertSound();
        setLiveEvents(prev => [eventData, ...prev.slice(0, 9)]);
      });

      socket.on('patrol_dispatched', (docket: any) => {
        setPatrolStatus(prev => ({
          ...prev,
          [docket.target_pin_id]: {
            status: "PATROL_DISPATCHED",
            eta: `${docket.eta_minutes} mins`,
            unit: docket.unit_callsign
          }
        }));

        if (docket.patrol_start_coords && docket.target_coordinates) {
          const newPatrol: ActivePatrol = {
            dispatchId: docket.dispatch_id,
            unitCallsign: docket.unit_callsign,
            targetPinId: docket.target_pin_id,
            targetAccount: docket.target_account,
            currentCoords: [docket.patrol_start_coords.lat, docket.patrol_start_coords.lng],
            targetCoords: [docket.target_coordinates.lat, docket.target_coordinates.lng],
            etaSeconds: Math.round(parseFloat(docket.eta_minutes) * 60),
            status: "INTERCEPT_TRANSIT"
          };
          setActivePatrols(prev => [...prev.filter(p => p.dispatchId !== newPatrol.dispatchId), newPatrol]);
        }
      });

      socket.on('freeze_applied', (data: any) => {
        setPins(prev => prev.map(p => p.account_no === data.account_no ? { ...p, freeze_status: 'DEBIT_FROZEN' } : p));
      });
    } catch (e) {
      console.warn("WebSocket listener initialization skipped:", e);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [soundEnabled]);

  // Active Patrol Intercept Countdown & Movement Simulation
  useEffect(() => {
    if (activePatrols.length === 0) return;
    const interval = setInterval(() => {
      setActivePatrols(prev => prev.map(patrol => {
        if (patrol.etaSeconds <= 1) {
          return { ...patrol, etaSeconds: 0, status: "ON_SCENE_INTERCEPTED" };
        }
        const latStep = (patrol.targetCoords[0] - patrol.currentCoords[0]) * 0.04;
        const lngStep = (patrol.targetCoords[1] - patrol.currentCoords[1]) * 0.04;
        return {
          ...patrol,
          currentCoords: [patrol.currentCoords[0] + latStep, patrol.currentCoords[1] + lngStep],
          etaSeconds: patrol.etaSeconds - 1
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [activePatrols.length]);

  // Render Active Flying Squad Patrol Units on Map
  useEffect(() => {
    if (!patrolsGroup.current || !leafletMap.current) return;
    patrolsGroup.current.clearLayers();

    activePatrols.forEach(patrol => {
      const isArrived = patrol.status === 'ON_SCENE_INTERCEPTED';
      const squadIcon = L.divIcon({
        className: 'custom-squad-unit',
        html: `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
            <div style="background:#ffffff;color:${isArrived ? '#059669' : '#0284C7'};font-weight:900;font-size:9.5px;padding:2px 6px;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);border:1.5px solid ${isArrived ? '#059669' : '#0284C7'};white-space:nowrap;display:flex;align-items:center;gap:4px;">
              <span>🚓 ${patrol.unitCallsign}</span>
              <span style="font-family:monospace;font-size:8.5px;color:#64748B;">(${isArrived ? 'ON SCENE' : `${Math.floor(patrol.etaSeconds / 60)}m ${patrol.etaSeconds % 60}s`})</span>
            </div>
            <div style="width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid ${isArrived ? '#059669' : '#0284C7'};"></div>
          </div>
        `,
        iconSize: [84, 32],
        iconAnchor: [42, 30]
      });

      L.marker(patrol.currentCoords, { icon: squadIcon }).addTo(patrolsGroup.current!);

      L.polyline([patrol.currentCoords, patrol.targetCoords], {
        color: isArrived ? '#059669' : '#38BDF8',
        weight: 2,
        dashArray: '4, 4',
        opacity: 0.8
      }).addTo(patrolsGroup.current!);
    });
  }, [activePatrols.length]);

  // Filter Pins based on 6 Active Layers, Typology Classification & Jurisdiction
  const filteredPins = pins.filter(p => {
    if (p.layer === 'LAYER_A' && !activeLayers.layer_a) return false;
    if (p.layer === 'LAYER_B' && !activeLayers.layer_b) return false;
    if (p.layer === 'LAYER_C' && !activeLayers.layer_c) return false;
    if (p.layer === 'LAYER_D' && !activeLayers.layer_d) return false;
    if (p.layer === 'LAYER_E' && !activeLayers.layer_e) return false;
    if (p.layer === 'LAYER_F' && !activeLayers.layer_f) return false;

    // In Patrol Alert Mode, isolate Patrol Units & Target Mule Accounts only
    if (patrolAlertMode && p.layer !== 'LAYER_F' && p.layer !== 'LAYER_A') return false;

    // Filter by Police Typology Classification
    if (selectedTypology !== 'ALL' && (p.layer === 'LAYER_A' || p.layer === 'LAYER_F')) {
      if (selectedTypology === 'L1_COLLECTION' && p.typology !== 'Layer-1 Collection Hub') return false;
      if (selectedTypology === 'DORMANT_AWAKENED' && p.typology !== 'Dormant Account Awakening') return false;
      if (selectedTypology === 'L2_TRANSIT' && p.typology !== 'Layer-2 Transit Aggregator') return false;
      if (selectedTypology === 'FAST_PAYMENT' && p.typology !== 'Fast Payment Conduit') return false;
      if (selectedTypology === 'RAPID_RELAY' && p.typology !== 'Rapid Pass-Through Relay') return false;
    }

    // Filter by Transaction Channel Feature
    if (selectedChannel !== 'ALL') {
      if (!p.channel || !p.channel.toLowerCase().includes(selectedChannel.toLowerCase())) return false;
    }

    // Filter by Legal Restriction & Surveillance Status Feature
    if (selectedStatus !== 'ALL') {
      if (p.freeze_status !== selectedStatus) return false;
    }

    // Filter by Risk Tier Feature
    if (selectedRiskTier !== 'ALL') {
      if (p.risk !== selectedRiskTier) return false;
    }

    // Filter by Cybercrime Command City
    if (selectedJurisdictionCity !== 'ALL') {
      if (!p.city.toLowerCase().includes(selectedJurisdictionCity.toLowerCase())) return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.account_no.toLowerCase().includes(q) ||
             p.bank.toLowerCase().includes(q) ||
             p.city.toLowerCase().includes(q) ||
             (p.typology && p.typology.toLowerCase().includes(q)) ||
             (p.investigation_officer?.officer_name && p.investigation_officer.officer_name.toLowerCase().includes(q)) ||
             (p.patrol_unit?.unit_callsign && p.patrol_unit.unit_callsign.toLowerCase().includes(q));
    }
    return true;
  });

  // Memoized 60 FPS Render Pins (prioritizes active target + caps simultaneous DOM markers to 250 for instantaneous response)
  const displayedPins = React.useMemo(() => {
    const list = [...filteredPins];
    if (selectedPin && !list.find(p => p.id === selectedPin.id)) {
      list.unshift(selectedPin);
    }
    return list.slice(0, 250);
  }, [filteredPins, selectedPin]);

  // Render Tactical Markers on Leaflet Map with Distinctive Forensic Classification Badges
  useEffect(() => {
    if (!markersGroup.current || !leafletMap.current) return;
    markersGroup.current.clearLayers();

    displayedPins.forEach((pin) => {
      const isSelected = selectedPin?.id === pin.id;
      const isCritical = pin.risk === 'CRITICAL' || pin.severity > 90;

      let markerHtml = '';
      let iconSize: [number, number] = [34, 46];
      let iconAnchor: [number, number] = [17, 23];

      if (pin.layer === 'LAYER_B') {
        iconSize = [36, 46];
        iconAnchor = [18, 23];
        markerHtml = `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;inset:0;border-radius:6px;background:#EF4444;opacity:0.4;animation:pulse 1.5s infinite;"></div>
              <div style="width:26px;height:26px;border-radius:6px;background:#DC2626;border:2px solid ${isSelected ? '#38BDF8' : 'white'};box-shadow:0 3px 8px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:8px;font-family:sans-serif;">
                ATM
              </div>
            </div>
            <div style="font-size:8.5px;font-weight:800;background:#ffffff;color:#B91C1C;padding:1.5px 5px;border-radius:4px;border:1px solid #FCA5A5;box-shadow:0 1px 4px rgba(0,0,0,0.12);white-space:nowrap;margin-top:2px;">${pin.city.split(',')[0]} • ${pin.amount}</div>
          </div>
        `;
      } else if (pin.layer === 'LAYER_D') {
        iconSize = [32, 46];
        iconAnchor = [16, 23];
        markerHtml = `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
              <div style="width:22px;height:22px;border-radius:5px;transform:rotate(45deg);background:#9333EA;border:2px solid ${isSelected ? '#38BDF8' : 'white'};box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:10px;">
                <span style="transform:rotate(-45deg);">₿</span>
              </div>
            </div>
            <div style="font-size:8.5px;font-weight:800;background:#ffffff;color:#7E22CE;padding:1.5px 5px;border-radius:4px;border:1px solid #D8B4FE;box-shadow:0 1px 4px rgba(0,0,0,0.12);white-space:nowrap;margin-top:2px;">Crypto OTC Desk</div>
          </div>
        `;
      } else if (pin.layer === 'LAYER_C') {
        iconSize = [28, 44];
        iconAnchor = [14, 22];
        markerHtml = `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="position:relative;width:26px;height:26px;display:flex;align-items:center;justify-content:center;">
              <div style="width:22px;height:22px;border-radius:50%;background:#2563EB;border:2px solid ${isSelected ? '#38BDF8' : 'white'};box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:9px;">
                V
              </div>
            </div>
            <div style="font-size:8.5px;font-weight:800;background:#ffffff;color:#1D4ED8;padding:1.5px 5px;border-radius:4px;border:1px solid #93C5FD;box-shadow:0 1px 4px rgba(0,0,0,0.12);white-space:nowrap;margin-top:2px;">Victim FIR</div>
          </div>
        `;
      } else if (pin.layer === 'LAYER_E') {
        iconSize = [32, 46];
        iconAnchor = [16, 23];
        markerHtml = `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="width:24px;height:24px;border-radius:50%;background:#0D9488;border:2px solid ${isSelected ? '#38BDF8' : 'white'};box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;">
              📶
            </div>
            <div style="font-size:8.5px;font-weight:800;background:#ffffff;color:#0F766E;padding:1.5px 5px;border-radius:4px;border:1px solid #99F6E4;box-shadow:0 1px 4px rgba(0,0,0,0.12);white-space:nowrap;margin-top:2px;">Telecom BTS</div>
          </div>
        `;

        L.circle([pin.lat, pin.lng], {
          radius: pin.coverage_radius_meters || 1200,
          color: '#0D9488',
          fillColor: '#0D9488',
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4, 4'
        }).addTo(markersGroup.current!);
      } else if (pin.layer === 'LAYER_F') {
        // LAYER F: Police Patrol Units & Tactical Interceptor AVL
        iconSize = [40, 52];
        iconAnchor = [20, 26];
        const isCriticalPatrol = pin.patrol_unit?.alert_level === 'RED_CRITICAL';
        const isWarrant = pin.patrol_unit?.alert_level === 'PURPLE_WARRANT';
        const pColor = isCriticalPatrol ? '#DC2626' : (isWarrant ? '#7C3AED' : '#2563EB');
        const pulseColor = isCriticalPatrol ? '#EF4444' : (isWarrant ? '#A855F7' : '#3B82F6');

        markerHtml = `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;inset:-4px;border-radius:50%;background:${pulseColor};opacity:0.4;animation:ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position:absolute;inset:0;border-radius:50%;background:${pColor};opacity:0.25;"></div>
              <div style="width:28px;height:28px;border-radius:50%;background:${pColor};border:2px solid ${isSelected ? '#FBBF24' : 'white'};box-shadow:0 3px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:13px;">
                🚓
              </div>
            </div>
            <div style="font-size:8.5px;font-weight:800;background:#ffffff;color:${pColor};padding:1.5px 5px;border-radius:4px;border:1.5px solid ${pColor};white-space:nowrap;margin-top:2px;box-shadow:0 2px 5px rgba(0,0,0,0.12);">
              ${pin.patrol_unit?.unit_callsign || 'PATROL'} • IO: ${pin.investigation_officer?.officer_name?.split(' ').slice(-1)[0] || 'IO'} • ETA ${pin.patrol_unit?.eta_minutes}m
            </div>
          </div>
        `;

        // Draw tactical intercept vector connecting patrol car to target bank branch
        if (pin.target_branch_coords && markersGroup.current) {
          L.polyline([[pin.lat, pin.lng], [pin.target_branch_coords.lat, pin.target_branch_coords.lng]], {
            color: pColor,
            weight: isSelected ? 3.5 : 2,
            dashArray: '5, 8',
            opacity: isSelected ? 0.95 : 0.65
          }).bindTooltip(`🚓 ${pin.patrol_unit?.unit_callsign} ➔ Intercept Target: ${pin.target_account_no} (${pin.target_bank}) | ETA: ${pin.patrol_unit?.eta_minutes} mins`, {
            sticky: true,
            className: 'bg-slate-900 text-white font-bold text-xs px-2 py-1 rounded shadow-lg border border-slate-700'
          }).addTo(markersGroup.current);
        }
      } else {
        // LAYER A: Mule Account Hubs (Categorized by Police Cybercrime Typology)
        let badgeColor = '#DC2626'; // Red for Layer-1 Collection
        let badgeLabel = 'L1';
        let badgeSub = 'L1 Hub';

        if (pin.typology === 'Layer-2 Transit Aggregator') {
          badgeColor = '#EA580C'; // Orange
          badgeLabel = 'L2';
          badgeSub = 'L2 Transit';
        } else if (pin.typology === 'Dormant Account Awakening') {
          badgeColor = '#D97706'; // Amber
          badgeLabel = 'DA';
          badgeSub = 'Awakened';
        } else if (pin.typology === 'Fast Payment Conduit') {
          badgeColor = '#059669'; // Emerald
          badgeLabel = 'FP';
          badgeSub = 'Fast Conduit';
        } else if (pin.typology === 'Rapid Pass-Through Relay') {
          badgeColor = '#9333EA'; // Purple
          badgeLabel = 'RR';
          badgeSub = 'Relay';
        }

        iconSize = [42, 50];
        iconAnchor = [21, 25];
        markerHtml = `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
              ${isCritical ? `<div style="position:absolute;inset:0;border-radius:50%;background:${badgeColor};opacity:0.35;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>` : ''}
              <div style="width:24px;height:24px;border-radius:50%;background:${badgeColor};border:2px solid ${isSelected ? '#38BDF8' : 'white'};box-shadow:0 3px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:9.5px;font-family:monospace;">
                ${badgeLabel}
              </div>
            </div>
            <div style="font-size:8.5px;font-weight:800;background:#ffffff;color:#0F172A;padding:1.5px 6px;border-radius:4px;border:1.5px solid ${badgeColor};box-shadow:0 1px 4px rgba(0,0,0,0.12);white-space:nowrap;margin-top:1px;">
              ${pin.cityName || pin.city.split(',')[0]} • <span style="color:${badgeColor};font-weight:900;">${badgeSub}</span>
            </div>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: 'custom-geo-marker',
        html: markerHtml,
        iconSize,
        iconAnchor
      });

      const marker = L.marker([pin.lat, pin.lng], { icon: customIcon });

      // Interactive Police Tactical Information Window
      marker.bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 12px; min-width: 240px; padding: 4px;">
          <div style="font-weight: 800; color: #0F172A; font-size: 13px; margin-bottom: 2px;">${pin.title}</div>
          <div style="display:inline-block;padding:1px 6px;border-radius:4px;background:#EFF6FF;color:#1D4ED8;font-size:10px;font-weight:bold;margin-bottom:6px;">
            ${pin.typology || pin.layer_name}
          </div>
          <div style="color: #475569; font-size: 11px;"><b>City/District:</b> ${pin.district || pin.city}</div>
          <div style="color: #475569; font-size: 11px;"><b>Bank:</b> ${pin.bank} (${pin.branch || 'Main Commercial'})</div>
          <div style="color: #475569; font-size: 11px;"><b>Jurisdiction:</b> ${pin.jurisdiction || 'Regional Cyber Command'}</div>
          <div style="color: #DC2626; font-size: 11px; font-weight: 800; margin-top: 3px;"><b>Volume:</b> ${pin.amount}</div>
          ${pin.velocity_burst ? `<div style="color:#D97706;font-size:10.5px;font-weight:bold;"><b>Burst Velocity:</b> ${pin.velocity_burst} (Siphon: ${pin.pass_through_ratio})</div>` : ''}
          ${pin.investigation_officer ? `
            <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:4px;padding:4px 6px;margin-top:4px;font-size:10px;color:#166534;">
              <b>Assigned IO:</b> ${pin.investigation_officer.officer_name} (${pin.investigation_officer.badge_no})<br/>
              <b>Unit:</b> ${pin.patrol_unit?.unit_callsign} • <b>Status:</b> ${pin.patrol_unit?.status} (ETA: ${pin.patrol_unit?.eta_minutes}m)
            </div>
          ` : ''}
          <div style="color: #64748B; font-size: 10px; margin-top: 4px; border-top: 1px solid #E2E8F0; padding-top: 4px;">
            GPS: ${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}
          </div>
          <div style="margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <button onclick="window.fintraceMapAction ? window.fintraceMapAction('dossier', '${pin.id}') : window.cyberhxaMapAction('dossier', '${pin.id}')" style="background:#2563EB;color:white;border:none;border-radius:4px;padding:4px 6px;font-size:10px;font-weight:bold;cursor:pointer;">Dossier</button>
            <button onclick="window.fintraceMapAction ? window.fintraceMapAction('radio', '${pin.id}') : window.cyberhxaMapAction('radio', '${pin.id}')" style="background:#0D9488;color:white;border:none;border-radius:4px;padding:4px 6px;font-size:10px;font-weight:bold;cursor:pointer;">📻 Radio IO</button>
            <button onclick="window.fintraceMapAction ? window.fintraceMapAction('apb', '${pin.id}') : window.cyberhxaMapAction('apb', '${pin.id}')" style="background:#B91C1C;color:white;border:none;border-radius:4px;padding:4px 6px;font-size:10px;font-weight:bold;cursor:pointer;">🚨 APB Flash</button>
            <button onclick="window.fintraceMapAction ? window.fintraceMapAction('freeze', '${pin.id}') : window.cyberhxaMapAction('freeze', '${pin.id}')" style="background:#DC2626;color:white;border:none;border-radius:4px;padding:4px 6px;font-size:10px;font-weight:bold;cursor:pointer;">Freeze</button>
          </div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedPin(pin);
        playTacticalAlertSound();
      });

      marker.addTo(markersGroup.current!);
    });
  }, [filteredPins, selectedPin]);

  // Render Money Trail Geospatial Corridors on Google Maps
  useEffect(() => {
    if (!corridorsGroup.current || !leafletMap.current) return;
    corridorsGroup.current.clearLayers();

    moneyTrailVectors.forEach((vec) => {
      const isDashed = vec.lineStyle === 'dashed';
      const isDotted = vec.lineStyle === 'dotted';
      const dashArray = isDotted ? '4, 6' : (isDashed ? '8, 8' : undefined);

      const polyline = L.polyline([vec.from, vec.to], {
        color: vec.color,
        weight: 3.5,
        opacity: 0.85,
        dashArray: dashArray
      }).addTo(corridorsGroup.current!);

      polyline.bindTooltip(`
        <div style="font-family: system-ui, sans-serif; font-size: 11px; padding: 2px 4px;">
          <strong style="color: ${vec.color}">${vec.channel}</strong>: ${vec.amount}<br/>
          <span style="color: #475569">${vec.fromCity} ➔ ${vec.toCity} (${vec.distanceKm} km)</span>
        </div>
      `, { sticky: true });

      polyline.on('click', () => {
        setSelectedCorridor(vec);
        playTacticalAlertSound();
      });
    });
  }, [moneyTrailVectors]);

  // Pan Map smoothly when selectedPin changes
  useEffect(() => {
    if (selectedPin && leafletMap.current) {
      leafletMap.current.panTo([selectedPin.lat, selectedPin.lng], { animate: true });
    }
  }, [selectedPin?.id]);

  // Handle Quick Fly-to Cybercrime Jurisdiction
  const handleFlyToJurisdiction = (j: typeof JURISDICTION_COMMANDS[0]) => {
    setSelectedJurisdictionCity(j.city);
    if (leafletMap.current) {
      leafletMap.current.flyTo([j.lat, j.lng], 9, { duration: 1.5 });
    }
    playTacticalAlertSound();
  };

  // Handle Search Input & Gazetteer Autocomplete
  const handleSearchChange = async (val: string) => {
    setSearchTerm(val);
    if (val.trim().length > 1) {
      try {
        const res = await fetch(`/api/maps/geosearch?q=${encodeURIComponent(val)}`);
        const json = await res.json();
        if (json.success && json.results) {
          setSearchResults(json.results);
          setShowSearchResults(true);
        }
      } catch (e) {
        setSearchResults([]);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSelectSearchResult = (res: any) => {
    if (res.coords && leafletMap.current) {
      leafletMap.current.flyTo([res.coords.lat, res.coords.lng], 9, { duration: 1.5 });
      if (res.account_no) {
        setSelectedAccountId(res.account_no);
        fetchMapData(res.account_no);
      }
    }
    setShowSearchResults(false);
    setSearchTerm('');
  };

  const handleAccountSelect = (newAcc: string) => {
    setSelectedAccountId(newAcc);
    fetchMapData(newAcc);
  };

  const handleSaveApiKey = () => {
    const trimmed = inputKey.trim() || DEFAULT_GOOGLE_MAPS_KEY;
    localStorage.setItem('FINTRACE_GOOGLE_MAPS_KEY', trimmed);
    setApiKey(trimmed);
    setIsEditingKey(false);
  };

  const handleGenerateNotice = async (accountNo: string, amount: string, bank: string) => {
    try {
      const res = await fetch('/api/police/statutory-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_no: accountNo,
          amount,
          bank: bank || "HBL",
          case_no: `CY-MULE-${accountNo.slice(-5)}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatutoryNoticeData(data.data);
        setShowNoticeModal(true);
        setNoticeTransmitted(false);
        setCopiedNotice(false);
        playTacticalAlertSound();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDispatchPatrol = async (pin: TacticalPin) => {
    playTacticalAlertSound();
    try {
      const res = await fetch('/api/maps/patrol/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin_id: pin.id,
          account_no: pin.account_no,
          lat: pin.lat,
          lng: pin.lng,
          city: pin.city,
          officer: "Investigator Cyber Analyst"
        })
      });
      const json = await res.json();
      if (json.success) {
        setPatrolStatus(prev => ({
          ...prev,
          [pin.id]: {
            status: "PATROL_DISPATCHED",
            eta: `${json.docket.eta_minutes} mins`,
            unit: `${json.docket.unit_callsign} (${json.docket.radio_freq})`
          }
        }));

        if (json.docket.patrol_start_coords) {
          const newPatrol: ActivePatrol = {
            dispatchId: json.docket.dispatch_id,
            unitCallsign: json.docket.unit_callsign,
            targetPinId: pin.id,
            targetAccount: pin.account_no,
            currentCoords: [json.docket.patrol_start_coords.lat, json.docket.patrol_start_coords.lng],
            targetCoords: [pin.lat, pin.lng],
            etaSeconds: Math.round(parseFloat(json.docket.eta_minutes) * 60),
            status: "INTERCEPT_TRANSIT"
          };
          setActivePatrols(prev => [...prev.filter(p => p.dispatchId !== newPatrol.dispatchId), newPatrol]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFreezeNode = async (accountNo: string) => {
    try {
      const res = await fetch('/api/maps/freeze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_no: accountNo,
          officer: "Investigator Cyber Analyst",
          reason: "Emergency Section 102 CrPC Live Tactical Geospatial Grid Lien"
        })
      });
      const json = await res.json();
      if (json.success) {
        setFreezeNoticeMsg(json.message);
        playTacticalAlertSound();
        setPins(prev => prev.map(p => p.account_no === accountNo ? { ...p, freeze_status: 'DEBIT_FROZEN' } : p));
        setTimeout(() => setFreezeNoticeMsg(null), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Tactical Encrypted Radio Transmission to field IO
  const handleSendRadioTransmission = async () => {
    if (!radioTargetPin || !radioTxMessage.trim()) return;
    setIsRadioTransmitting(true);
    playTacticalAlertSound();

    try {
      const ioInfo = radioTargetPin.investigation_officer;
      const patrolInfo = radioTargetPin.patrol_unit;

      const res = await fetch('/api/maps/patrol/radio-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_callsign: patrolInfo?.unit_callsign || "TACTICAL-PATROL",
          officer_name: ioInfo?.officer_name || "Investigator Cybercrime",
          account_no: radioTargetPin.account_no,
          message: radioTxMessage,
          channel: ioInfo?.encrypted_freq || "155.475 MHz"
        })
      });

      const json = await res.json();
      if (json.success && json.transmission) {
        setRadioTransmissionLogs(prev => [json.transmission, ...prev]);
        setRadioTxMessage('');
      }
    } catch (err) {
      console.error("Radio transmission error:", err);
    } finally {
      setIsRadioTransmitting(false);
    }
  };

  // Handle All-Points Bulletin (APB) Alert Broadcast
  const handleBroadcastApb = async () => {
    if (!apbTargetPin) return;
    playTacticalAlertSound();

    try {
      const res = await fetch('/api/maps/patrol/apb-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_no: apbTargetPin.account_no,
          city: apbTargetPin.cityName || apbTargetPin.city.split(',')[0],
          jurisdiction: apbTargetPin.jurisdiction,
          officer: apbTargetPin.investigation_officer?.officer_name || "Command Center",
          reason: `High-velocity mule syndicate activity on ${apbTargetPin.account_no}`
        })
      });

      const json = await res.json();
      if (json.success && json.apb) {
        setApbSuccessMsg(json.apb.broadcast_message);
        setLiveEvents(prev => [{
          title: `🚨 APB BROADCAST: ${json.apb.city}`,
          description: json.apb.broadcast_message,
          timestamp: json.apb.timestamp,
          severity: 98,
          action: "ALL_UNITS_ALERTED"
        }, ...prev]);

        setTimeout(() => {
          setShowApbModal(false);
          setApbSuccessMsg(null);
        }, 2500);
      }
    } catch (err) {
      console.error("APB broadcast error:", err);
    }
  };

  // Zoom into Inch-by-Inch Building Footprint at maximum zoom (Level 19)
  const handleZoomToInchFootprint = (pin: TacticalPin) => {
    setSelectedPin(pin);
    setIsStreetFootprintActive(true);
    if (leafletMap.current) {
      leafletMap.current.flyTo([pin.lat, pin.lng], 19, { duration: 1.5 });
    }
    playTacticalAlertSound();
  };

  // Directional Quick-Pan across the tactical grid
  const handlePanDirection = (dir: 'N' | 'E' | 'S' | 'W') => {
    if (!leafletMap.current) return;
    const center = leafletMap.current.getCenter();
    const offset = 0.06;
    let newLat = center.lat;
    let newLng = center.lng;
    if (dir === 'N') newLat += offset;
    if (dir === 'S') newLat -= offset;
    if (dir === 'E') newLng += offset;
    if (dir === 'W') newLng -= offset;
    leafletMap.current.panTo([newLat, newLng], { animate: true, duration: 0.6 });
    playTacticalAlertSound();
  };

  // Re-center on the target account
  const handleCenterOnTarget = () => {
    if (selectedPin && leafletMap.current) {
      leafletMap.current.flyTo([selectedPin.lat, selectedPin.lng], 15, { duration: 1.2 });
      playTacticalAlertSound();
    }
  };

  // Rotate heading angle for Street View inspection
  const handleRotateHeading = (deg: number) => {
    setHeadingAngle(prev => (prev + deg + 360) % 360);
    playTacticalAlertSound();
  };

  return (
    <div className={`h-full flex flex-col gap-2 min-h-0 select-none ${isFullscreen ? 'fixed inset-0 z-50 bg-[#F8FAFC] p-2.5 overflow-hidden' : ''}`}>
      {/* 1. Sleek Compact Command & Operations Strip */}
      <div className="bg-white px-3 py-2 rounded-xl border border-slate-200/90 shadow-2xs shrink-0 flex flex-col gap-2">
        {/* Tier 1: Title, Live Status, Target Account Selector, Search & Layer Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <Compass className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                  Live Google Maps — Police Geospatial Cybercrime Tactical Grid
                </h2>
                <div className="hidden md:flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>Live Stream</span>
                </div>
              </div>
            </div>

            {/* Target Account Selector */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <select
                value={selectedAccountId}
                onChange={(e) => handleAccountSelect(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 font-mono font-bold text-blue-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 max-w-[210px] truncate cursor-pointer"
                title="Select Target Account"
              >
                {availableAccounts.map((m: any) => (
                  <option key={m.account_no} value={m.account_no}>
                    {m.account_no} • {m.bank} ({m.location?.split(' ')[0] || 'City'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center Search & Right Map Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search Box */}
            <div className="relative w-44 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search city, branch, account..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {searchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectSearchResult(res)}
                      className="p-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                    >
                      <div className="font-bold text-slate-800">{res.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{res.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Google Maps Layer Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
              {(['hybrid', 'roadmap', 'satellite', 'terrain'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setMapLayer(layer)}
                  className={`px-2 py-0.5 rounded transition-all capitalize ${
                    mapLayer === layer
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {layer === 'hybrid' ? '🛰️ Hybrid' : layer === 'roadmap' ? '🗺️ Roads' : layer === 'satellite' ? '🌍 Sat' : '⛰️ Terrain'}
                </button>
              ))}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilterDrawer(prev => !prev)}
              className={`px-2 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                showFilterDrawer ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Advanced Crime Typologies & Layer Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Key Settings Button */}
            <button
              onClick={() => setIsEditingKey(true)}
              className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Google Maps API Key Settings"
            >
              <Key className="w-3.5 h-3.5" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1 rounded-lg border text-xs font-bold transition-colors ${
                soundEnabled ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
              title={soundEnabled ? 'Mute Radio Alerts' : 'Enable Radio Chime'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Tier 2: Streamlined Typology Pills & Intelligence Layers (Single Compact Row) */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 pt-1.5 text-xs">
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Typology:</span>
            {[
              { id: 'ALL', label: 'All (1,131)' },
              { id: 'L1_COLLECTION', label: '🔴 L1 Hubs' },
              { id: 'DORMANT_AWAKENED', label: '🟡 Dormant' },
              { id: 'L2_TRANSIT', label: '🟠 L2 Transit' },
              { id: 'FAST_PAYMENT', label: '⚡ Fast Pay' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTypology(t.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  selectedTypology === t.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Intelligence Layers Toggles */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Layers:</span>
            {[
              { key: 'layer_a', label: 'Mule Hubs', active: activeLayers.layer_a },
              { key: 'layer_b', label: 'Cashouts', active: activeLayers.layer_b },
              { key: 'layer_c', label: 'Victims', active: activeLayers.layer_c },
              { key: 'layer_d', label: 'Crypto', active: activeLayers.layer_d },
              { key: 'layer_e', label: 'BTS', active: activeLayers.layer_e },
              { key: 'layer_f', label: 'Patrols', active: activeLayers.layer_f },
            ].map(l => (
              <button
                key={l.key}
                onClick={() => setActiveLayers(prev => ({ ...prev, [l.key]: !prev[l.key as keyof typeof prev] }))}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border transition-all ${
                  l.active ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${l.active ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>

          {/* Quick-Fly Sectors */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Sector:</span>
            <select
              value={selectedJurisdictionCity}
              onChange={(e) => {
                const city = e.target.value;
                setSelectedJurisdictionCity(city);
                if (city === 'ALL') {
                  leafletMap.current?.setView([30.1575, 71.5249], 6);
                } else {
                  const target = JURISDICTION_COMMANDS.find(j => j.city === city);
                  if (target) handleFlyToJurisdiction(target);
                }
              }}
              className="bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[10px] rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">National Grid (12)</option>
              {JURISDICTION_COMMANDS.map(j => (
                <option key={j.city} value={j.city}>{j.city} ({j.count})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showFilterDrawer && (
          <div className="border-t border-slate-100 pt-2 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-600">Payment Conduit:</span>
              {['ALL', 'Raast', 'IMPS', 'Intrabank'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedChannel === ch ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-600">Legal Status:</span>
              {['ALL', 'DEBIT_FROZEN', 'UNDER_SURVEILLANCE', 'ACTIVE_MONITORING'].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedStatus === st ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'DEBIT_FROZEN' ? 'Frozen' : st === 'UNDER_SURVEILLANCE' ? 'Surveillance' : st === 'ACTIVE_MONITORING' ? 'Active' : 'All'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-600">Risk Tier:</span>
              {['ALL', 'CRITICAL', 'HIGH'].map(rt => (
                <button
                  key={rt}
                  onClick={() => setSelectedRiskTier(rt)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedRiskTier === rt ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* API Key Modal / Drawer */}
      {isEditingKey && (
        <div className="bg-white p-3.5 rounded-xl border-2 border-blue-500 shadow-md space-y-2 animate-fadeIn shrink-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-blue-600" />
              <span>Real-Time Google Maps Platform Key Configuration</span>
            </h4>
            <button onClick={() => setIsEditingKey(false)} className="text-xs text-slate-400 hover:text-slate-600">✕ Close</button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste custom AIzaSy... key or use platform auto-generated key"
              className="flex-1 p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
            >
              Save Key &amp; Apply
            </button>
            <button
              onClick={() => { setInputKey(DEFAULT_GOOGLE_MAPS_KEY); }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg whitespace-nowrap"
            >
              Reset Default
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Map Canvas & Right Tactical Docket - Fills Viewport Height 100% Without Scrolling */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 h-full">
        {/* Left: Map Container (col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex flex-col justify-between h-full min-h-0 relative">
          {/* Top Controls on Map */}
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              <span className="font-bold text-slate-800 text-[11px]">
                Tactical Grid:
              </span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-[10px]">
                {filteredPins.length} Pins
              </span>
              {moneyTrailVectors.length > 0 && (
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-bold text-[10px]">
                  {moneyTrailVectors.length} Corridors
                </span>
              )}

              {/* Dedicated Police Patrol Alert Intercept Mode Toggle */}
              <button
                onClick={() => {
                  setPatrolAlertMode(prev => !prev);
                  playTacticalAlertSound();
                }}
                className={`px-2 py-0.5 text-[9.5px] font-extrabold rounded-md flex items-center gap-1 transition-all shadow-xs ${
                  patrolAlertMode
                    ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-400'
                    : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200'
                }`}
                title="Toggle Active Police Patrols & Tactical Intercept Mode"
              >
                <Siren className={`w-3 h-3 ${patrolAlertMode ? 'text-white animate-spin' : 'text-indigo-600'}`} />
                <span>{patrolAlertMode ? '🚨 PATROL ALERT' : '🚨 Patrol & IO Units'}</span>
              </button>
            </div>

            {/* Tactical Scale Presets & 3D Triggers */}
            <div className="flex items-center gap-1">
              <div className="flex items-center bg-slate-50 p-0.5 rounded-md border border-slate-200 text-[9.5px] font-bold">
                {[
                  { label: "Z6", zoom: 6, title: "National Grid" },
                  { label: "Z10", zoom: 10, title: "Metro Range" },
                  { label: "Z15", zoom: 15, title: "Banking Row" },
                  { label: "Z19", zoom: 19, title: "Cadastral Footprint" }
                ].map(item => (
                  <button
                    key={item.zoom}
                    onClick={() => {
                      if (item.zoom === 19 && selectedPin) {
                        handleZoomToInchFootprint(selectedPin);
                      } else if (leafletMap.current) {
                        leafletMap.current.setZoom(item.zoom);
                        playTacticalAlertSound();
                      }
                    }}
                    className="px-1.5 py-0.5 rounded transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    title={item.title}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setSatelliteViewType('k');
                  setShowSatelliteModal(true);
                  playTacticalAlertSound();
                }}
                className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[9.5px] font-bold flex items-center gap-1 transition-all"
                title="Inspect authentic 3D Satellite Orthoimagery"
              >
                <Eye className="w-3 h-3 text-blue-600" />
                <span className="hidden sm:inline">3D Satellite</span>
              </button>

              <button
                onClick={() => {
                  setSatelliteViewType('street');
                  setShowSatelliteModal(true);
                  playTacticalAlertSound();
                }}
                className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[9.5px] font-bold flex items-center gap-1 transition-all"
                title="Launch Google Street View 360° Panorama"
              >
                <Navigation className="w-3 h-3 text-indigo-600" />
                <span className="hidden sm:inline">360° Street</span>
              </button>
            </div>
          </div>

          {/* Interactive Google Maps Surface powered by Leaflet Tile Engine */}
          <div className="relative flex-1 min-h-0 rounded-lg overflow-hidden border border-slate-200/80 bg-slate-50 w-full h-full">
            <div
              ref={mapContainerRef}
              className="absolute inset-0 w-full h-full z-0 cursor-crosshair"
            />

            {/* Rotating Tactical Compass Rose Widget */}
            <div
              onClick={() => {
                if (selectedPin && leafletMap.current) {
                  leafletMap.current.setView([selectedPin.lat, selectedPin.lng], 15);
                } else if (leafletMap.current) {
                  leafletMap.current.setView([30.1575, 71.5249], 6);
                }
                playTacticalAlertSound();
              }}
              className="absolute top-28 right-3 z-[500] w-10 h-10 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all backdrop-blur-xs group"
              title="Tactical Compass Rose (Click to snap to target center)"
            >
              <div
                className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center transition-transform duration-300"
              >
                <div className="w-0.5 h-6 bg-gradient-to-b from-red-600 via-transparent to-slate-400 relative">
                  <div className="absolute -top-1.5 -left-1 text-[8px] font-black text-red-600 select-none">N</div>
                </div>
              </div>
            </div>

            {/* Map Navigation Controls (Zoom & Reset) */}
            <div className="absolute top-3 right-3 z-[500] flex flex-col gap-1 bg-white/95 rounded-lg border border-slate-200 shadow-md p-1 backdrop-blur-xs">
              <button
                onClick={() => leafletMap.current?.zoomIn()}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700 font-bold text-sm"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => leafletMap.current?.zoomOut()}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700 font-bold text-sm"
                title="Zoom Out"
              >
                -
              </button>
              <button
                onClick={() => {
                  leafletMap.current?.setView([30.1575, 71.5249], 6);
                }}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700 text-xs"
                title="Reset Center on Regional Grid"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tactical Coordinate Telemetry HUD (when map is clicked) */}
            {inspectedLocation && (
              <div className="absolute top-3 left-3 z-[500] bg-white/95 border border-blue-200 backdrop-blur-md p-2.5 rounded-xl text-slate-800 text-[11px] shadow-lg max-w-xs animate-fadeIn space-y-1">
                <div className="flex items-center justify-between text-blue-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                    COORDINATE TELEMETRY
                  </span>
                  <button onClick={() => setInspectedLocation(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                </div>
                <div className="font-mono text-[10px] text-slate-500">
                  Lat: {inspectedLocation.queried_coords?.lat.toFixed(4)}° N, Lng: {inspectedLocation.queried_coords?.lng.toFixed(4)}° E
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  {inspectedLocation.formatted_location}
                </div>
                {inspectedLocation.nearest_mule_account && (
                  <div className="text-[9.5px] text-slate-600 border-t border-slate-100 pt-1">
                    Nearest Mule: <strong>{inspectedLocation.nearest_mule_account.account_no}</strong> ({inspectedLocation.nearest_mule_account.city} • {inspectedLocation.nearest_mule_account.distance_km.toFixed(1)} km)
                  </div>
                )}
              </div>
            )}

            {/* Tactical Google Map Legend Overlay with Forensic Typologies */}
            <div className="absolute bottom-3 left-3 z-[500] bg-white/95 border border-slate-200 backdrop-blur-md p-3 rounded-xl text-slate-800 text-[10px] space-y-1.5 shadow-md max-w-sm pointer-events-auto">
              <div className="flex items-center justify-between text-blue-700 font-extrabold tracking-wider border-b border-slate-100 pb-1">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  POLICE CYBERCRIME GEOSPATIAL RADAR
                </span>
                <span className="text-[9px] text-slate-500 font-mono">1,131 Mules Monitored</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 text-[9.5px] text-slate-700">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600 text-white font-mono text-[8px] flex items-center justify-center font-black">L1</span> Layer-1 Collection Hub</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-600 text-white font-mono text-[8px] flex items-center justify-center font-black">L2</span> Layer-2 Transit Intermediary</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 text-white font-mono text-[8px] flex items-center justify-center font-black">DA</span> Dormant Account Awakened</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 text-white font-mono text-[8px] flex items-center justify-center font-black">FP</span> Fast Payment Conduit</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-md bg-red-600 text-white text-[7px] flex items-center justify-center font-bold">ATM</span> Physical Cashout Terminal</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[8px]">📶</span> Telecom Tower Mast</div>
              </div>
              {moneyTrailVectors.length > 0 && (
                <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>Transit Distance:</span>
                  <strong className="text-emerald-700 font-mono">
                    {moneyTrailVectors.reduce((acc, v) => acc + (v.distanceKm || 0), 0)} km across banking corridors
                  </strong>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Live Alert Ticker Bar at Bottom of Map */}
          {liveEvents.length > 0 && (
            <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-xs flex items-center justify-between animate-fadeIn shrink-0 mt-1.5">
              <div className="flex items-center gap-2 text-red-900 font-medium truncate mr-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0"></span>
                <strong>[LIVE GEO EVENT {liveEvents[0].time}]:</strong>
                <span className="truncate">{liveEvents[0].message}</span>
              </div>
              <button
                onClick={() => {
                  if (liveEvents[0].geo && leafletMap.current) {
                    leafletMap.current.flyTo([liveEvents[0].geo.lat, liveEvents[0].geo.lng], 9, { duration: 1.5 });
                  }
                }}
                className="px-2.5 py-0.5 bg-red-600 text-white font-bold rounded text-[10px] hover:bg-red-700 shrink-0 whitespace-nowrap"
              >
                Track on Map →
              </button>
            </div>
          )}
        </div>

        {/* Right: Police Tactical Incident Docket (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-3 flex flex-col h-full min-h-0 overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Geospatial Tactical Dossier</span>
            </h3>
            <span className="text-[10px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
              FIU-CY-2026
            </span>
          </div>

          {selectedPin ? (
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2.5 text-xs mt-2">
                {/* Target Node Identification Card with Forensic Typology */}
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-red-900 text-sm font-mono">{selectedPin.account_no}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      selectedPin.freeze_status === 'DEBIT_FROZEN'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedPin.freeze_status === 'DEBIT_FROZEN' ? 'DEBIT FROZEN' : `${selectedPin.risk} RISK (${selectedPin.severity}%)`}
                    </span>
                  </div>

                  {/* Crime Typology Badge */}
                  <div className="p-1.5 bg-white border border-red-200 rounded-lg flex items-center justify-between text-[11px]">
                    <span className="font-bold text-red-900 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      {selectedPin.typology || selectedPin.layer_name}
                    </span>
                    <span className="text-[9.5px] font-mono text-slate-500 font-bold">Mule Score: {selectedPin.severity}</span>
                  </div>

                  <div className="text-slate-800 font-bold text-xs">{selectedPin.title}</div>

                  <div className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{selectedPin.bank} • {selectedPin.branch || selectedPin.city}</span>
                  </div>

                  {/* Detailed Physical Branch & District Location */}
                  {selectedPin.district && (
                    <div className="p-1.5 bg-slate-50 rounded border border-slate-200 text-[10px] text-slate-700">
                      <strong>District Center:</strong> {selectedPin.district}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Jurisdiction:</span>
                    <span className="font-bold text-slate-800 text-right">{selectedPin.jurisdiction || 'Regional Cyber Crime Wing'}</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">GPS Coordinates:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Monitored Volume:</span>
                    <span className="font-extrabold text-red-600 text-sm">{selectedPin.amount}</span>
                  </div>

                  {/* Forensic Banking Metrics */}
                  {selectedPin.velocity_burst && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-red-200/60 text-[10px]">
                      <div className="bg-white p-1 rounded border border-slate-200">
                        <span className="text-slate-400 block">Burst Velocity:</span>
                        <strong className="text-amber-700 font-mono">{selectedPin.velocity_burst}</strong>
                      </div>
                      <div className="bg-white p-1 rounded border border-slate-200">
                        <span className="text-slate-400 block">Pass-Through:</span>
                        <strong className="text-red-600 font-mono">{selectedPin.pass_through_ratio}</strong>
                      </div>
                    </div>
                  )}

                  {selectedPin.associated_case && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Case Reference:</span>
                      <span className="font-mono font-bold text-blue-700">{selectedPin.associated_case}</span>
                    </div>
                  )}

                  {selectedPin.provenance && (
                    <div className="p-1.5 rounded bg-white/80 border border-slate-200 text-[9.5px] text-slate-600 leading-tight">
                      <strong>Evidence Provenance:</strong> {selectedPin.provenance}
                    </div>
                  )}
                </div>

                {/* Real Transaction Forensic Ledger (tx_evidence) */}
                {selectedPin.tx_evidence && selectedPin.tx_evidence.length > 0 && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                        Forensic Transaction Evidence
                      </span>
                      <span className="text-[9.5px] text-slate-400 font-mono">{selectedPin.tx_evidence.length} Txns Logged</span>
                    </div>

                    <div className="divide-y divide-slate-200 text-[10px] max-h-36 overflow-y-auto">
                      {selectedPin.tx_evidence.map((tx: any, idx: number) => (
                        <div key={idx} className="py-1.5 flex items-center justify-between">
                          <div>
                            <div className="font-mono font-bold text-slate-800 flex items-center gap-1">
                              {tx.direction === 'INFLOW' ? (
                                <span className="text-emerald-600 flex items-center">↓ INFLOW</span>
                              ) : (
                                <span className="text-red-600 flex items-center">↑ OUTFLOW</span>
                              )}
                              <span>{tx.amount_formatted}</span>
                            </div>
                            <div className="text-[9px] text-slate-400">
                              {tx.channel} • {tx.timestamp}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-slate-500 block truncate max-w-[85px]">{tx.counterparty}</span>
                            <span className="text-[8.5px] text-slate-400">{tx.institution}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assigned Police Investigation Officer (IO) Card */}
                {selectedPin.investigation_officer && (
                  <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-indigo-700" />
                        Assigned Investigation Officer (IO)
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-200 text-indigo-900">
                        {selectedPin.investigation_officer.badge_no}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-indigo-100 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">
                            {selectedPin.investigation_officer.officer_name}
                          </div>
                          <div className="text-[10px] text-indigo-700 font-bold">
                            {selectedPin.investigation_officer.rank}
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                          ON ACTIVE DUTY
                        </span>
                      </div>

                      <div className="text-[10.5px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                        <div><strong>Station:</strong> {selectedPin.investigation_officer.station}</div>
                        <div><strong>Direct Line:</strong> <span className="font-mono text-slate-800">{selectedPin.investigation_officer.contact_number}</span></div>
                        <div className="flex items-center justify-between">
                          <span><strong>Encrypted Radio:</strong> <span className="font-mono text-blue-700">{selectedPin.investigation_officer.radio_callsign}</span></span>
                          <span className="font-mono text-[9.5px] text-slate-500 bg-slate-100 px-1.5 rounded">{selectedPin.investigation_officer.encrypted_freq}</span>
                        </div>
                        <div><strong>Warrant Mandate:</strong> <span className="font-mono text-amber-800">{selectedPin.investigation_officer.statutory_warrant}</span></div>
                      </div>

                      <div className="p-1.5 bg-indigo-50/60 rounded text-[9.5px] text-indigo-950 font-medium">
                        <strong>Operational Directive:</strong> {selectedPin.investigation_officer.directive}
                      </div>
                    </div>
                  </div>
                )}

                {/* Assigned Tactical Patrol Interceptor Unit */}
                {selectedPin.patrol_unit && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                        <Siren className="w-3.5 h-3.5 text-blue-700" />
                        Tactical Patrol Intercept Unit
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        selectedPin.patrol_unit.alert_level === 'RED_CRITICAL'
                          ? 'bg-red-600 text-white animate-pulse'
                          : selectedPin.patrol_unit.alert_level === 'PURPLE_WARRANT'
                          ? 'bg-purple-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}>
                        {selectedPin.patrol_unit.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-blue-100 space-y-1.5 shadow-2xs text-[10.5px]">
                      <div className="flex items-center justify-between">
                        <strong className="text-blue-900 font-mono text-xs">{selectedPin.patrol_unit.unit_callsign}</strong>
                        <span className="text-[10px] text-slate-600 font-mono">
                          Dist: <strong className="text-red-600">{selectedPin.patrol_unit.distance_km} km</strong> • ETA: <strong className="text-emerald-700">{selectedPin.patrol_unit.eta_minutes} mins</strong>
                        </span>
                      </div>
                      <div className="text-slate-600 text-[10px]">
                        <strong>Vehicle:</strong> {selectedPin.patrol_unit.vehicle_type} ({selectedPin.patrol_unit.vehicle_reg})
                      </div>
                      <div className="text-slate-600 text-[10px]">
                        <strong>Crew Strength:</strong> {selectedPin.patrol_unit.crew_strength}
                      </div>
                      <div className="text-slate-500 text-[9.5px] italic">
                        AVL Ping: {selectedPin.patrol_unit.last_radio_ping}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setRadioTargetPin(selectedPin);
                          setShowRadioModal(true);
                          playTacticalAlertSound();
                        }}
                        className="py-1.5 px-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all shadow-xs"
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>Radio Dispatch IO</span>
                      </button>

                      <button
                        onClick={() => {
                          setApbTargetPin(selectedPin);
                          setShowApbModal(true);
                          playTacticalAlertSound();
                        }}
                        className="py-1.5 px-2 bg-red-700 hover:bg-red-800 text-white rounded text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all shadow-xs"
                      >
                        <Siren className="w-3.5 h-3.5" />
                        <span>Sound APB Alert</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Zoom to Inch-by-Inch Footprint (Zoom 19 & 45° 3D) Button */}
                <button
                  onClick={() => handleZoomToInchFootprint(selectedPin)}
                  className="w-full py-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Crosshair className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>Zoom to Inch-by-Inch Footprint (Zoom 19 &amp; 45° Tilt)</span>
                </button>

                {/* Inch-by-Inch Cadastral & Geographic Hierarchy Card */}
                <div className="p-3 bg-white text-slate-800 rounded-xl border border-slate-200 space-y-2.5 shadow-xs text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-blue-700" />
                      Inch-by-Inch Cadastral Hierarchy
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      ±0.11m (~4.3") Res
                    </span>
                  </div>

                  {/* Cadastral Land Parcel Plot Reference */}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[10.5px] space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[9.5px]">
                      <span>CADASTRAL PARCEL PLOT ID:</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">VERIFIED PLOT</span>
                    </div>
                    <div className="text-slate-900 font-bold tracking-wide">
                      {selectedPin.cadastral?.cadastral_plot_id || selectedPin.cadastral_plot_id || `CADASTRAL-PK-${selectedPin.cityName.substring(0,3).toUpperCase()}-PLT-09A`}
                    </div>
                  </div>

                  {/* Hierarchy: Country > State > District > Town > Street > Building */}
                  <div className="space-y-1 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">State / Province:</span>
                      <strong className="text-slate-800">{selectedPin.cadastral?.state_province || 'Punjab Province'}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Cyber Command Zone:</span>
                      <strong className="text-blue-700">{selectedPin.cadastral?.cyber_zone || `${selectedPin.cityName} Cybercrime Range`}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">District / Tehsil:</span>
                      <strong className="text-slate-800">{selectedPin.cadastral?.district_tehsil || selectedPin.district || `${selectedPin.cityName} Cantt Tehsil`}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Town / Sector:</span>
                      <strong className="text-slate-800">{selectedPin.cadastral?.town_sector || `${selectedPin.cityName} Commercial Sector`} ({selectedPin.cadastral?.postal_code || '60000'})</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Banking Enclave:</span>
                      <strong className="text-amber-800 text-right">{selectedPin.cadastral?.banking_enclave || `${selectedPin.bank} Regional Financial Row`}</strong>
                    </div>
                    <div className="flex justify-between items-start pt-1 border-t border-slate-200">
                      <span className="text-slate-500 shrink-0">Street Address:</span>
                      <strong className="text-slate-900 text-right">{selectedPin.cadastral?.street_address || selectedPin.street_address || 'Main Boulevard Banking Belt'}</strong>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500 shrink-0">Cross-Street:</span>
                      <span className="text-slate-700 text-right text-[10.5px]">{selectedPin.cadastral?.cross_street || selectedPin.cross_street || 'Opposite State Bank & High Court Crossing'}</span>
                    </div>
                    <div className="flex justify-between items-start pt-1 border-t border-slate-200">
                      <span className="text-slate-500 shrink-0">Building Footprint:</span>
                      <strong className="text-indigo-800 text-right">{selectedPin.cadastral?.building_footprint || selectedPin.building_footprint || 'Ground Floor Vault & Cash Office'}</strong>
                    </div>
                  </div>

                  {/* 6-Decimal Geodetic Telemetry */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
                      <span className="text-slate-500 block">6-Decimal GPS (Sub-Meter):</span>
                      <span className="font-mono font-bold text-emerald-700 text-[10.5px]">
                        {selectedPin.lat.toFixed(6)}, {selectedPin.lng.toFixed(6)}
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
                      <span className="text-slate-500 block">Elevation AMSL:</span>
                      <span className="font-mono font-bold text-amber-800 text-[10.5px]">
                        {selectedPin.cadastral?.elevation || selectedPin.elevation || '128m AMSL'}
                      </span>
                    </div>
                  </div>

                  {/* Police Beat & Safe City CCTV */}
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[10.5px] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Police Beat Patrol:</span>
                      <span className="font-bold text-blue-700">{selectedPin.cadastral?.police_beat || `${selectedPin.cityName} Beat Sector-1`}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Safe City CCTV LOS:</span>
                      <span className="font-mono text-emerald-700 font-bold text-[10px] truncate max-w-[190px]">
                        {selectedPin.cadastral?.cctv_safe_city || `CAM-SAFE-CITY-${selectedPin.cityName.substring(0,3).toUpperCase()}-104 (22m)`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Predictive Suspect Movement & Escape Intercept Corridors */}
                {(selectedPin.predictive_escape_routes || selectedPin.cadastral?.escape_routes) && (
                  <div className="p-3 bg-white rounded-xl border border-red-200 space-y-2 text-xs shadow-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-red-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-900 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                        AI Predictive Intercept &amp; Escape Routing
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                        Geo-Forecast
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-600 leading-tight">
                      Sub-second predictive escape corridors calculated from branch cadastral exit vectors:
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {(selectedPin.predictive_escape_routes || selectedPin.cadastral?.escape_routes || []).map((route: any, rIdx: number) => (
                        <div key={rIdx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-[10.5px] truncate max-w-[180px]">
                              {route.route_name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-red-50 text-red-700 border border-red-200">
                              {route.intercept_probability}% Probability
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[9.5px] text-slate-600 font-mono">
                            <span>Dist: <strong className="text-amber-800">{route.distance_meters}m</strong></span>
                            <span>Vehicle ETA: <strong className="text-emerald-700">{route.vehicle_transit_seconds}s</strong></span>
                            <span>Foot ETA: <strong className="text-blue-700">{route.foot_transit_seconds}s</strong></span>
                          </div>

                          <div className="text-[9.5px] text-red-800 bg-red-50 p-1 rounded border border-red-200 italic">
                            🎯 <strong>Tactical Action:</strong> {route.tactical_recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inspect Physical Satellite Imagery Button */}
                <button
                  onClick={() => setShowSatelliteModal(true)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-white" />
                  <span>Inspect Physical Google Satellite &amp; Street View</span>
                </button>

                {/* Telecom Tower BTS Info */}
                {selectedPin.telecom_bts && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                      <Radio className="w-3.5 h-3.5 text-blue-600" />
                      <span>Telecom Tower BTS ID: {selectedPin.telecom_bts}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Azimuth sector coverage antenna verified near branch perimeter.
                    </div>
                  </div>
                )}

                {/* Freeze Status Notification */}
                {freezeNoticeMsg && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{freezeNoticeMsg}</span>
                  </div>
                )}

                {/* Patrol Dispatch Status */}
                {patrolStatus[selectedPin.id] && (
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 font-bold space-y-0.5">
                    <div className="flex items-center gap-1.5 text-blue-700">
                      <Send className="w-3.5 h-3.5 text-blue-600" />
                      <span>Patrol Dispatched: {patrolStatus[selectedPin.id].unit}</span>
                    </div>
                    <div className="text-[10px] text-blue-600 font-mono">
                      Estimated Time of Arrival: <strong>{patrolStatus[selectedPin.id].eta}</strong>
                    </div>
                  </div>
                )}

                {/* Police Tactical Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleFreezeNode(selectedPin.account_no)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Execute Section 102 CrPC Debit Restriction</span>
                  </button>

                  <button
                    onClick={() => handleDispatchPatrol(selectedPin)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Flying Squad to Coordinates</span>
                  </button>

                  <button
                    onClick={() => handleGenerateNotice(selectedPin.account_no, selectedPin.amount, selectedPin.bank)}
                    className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>Draft Statutory Bank Nodal Notice</span>
                  </button>
                </div>

                {/* Cross-Module Navigation Links */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Cross-Module Forensic Intelligence:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onNavigate && onNavigate('mule-detection', selectedPin.account_no)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-[10px] font-bold text-left truncate"
                    >
                      → Mule Detection
                    </button>
                    <button
                      onClick={() => onNavigate && onNavigate('money-trail', selectedPin.account_no)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-[10px] font-bold text-left truncate"
                    >
                      → Money Trail
                    </button>
                    <button
                      onClick={() => onNavigate && onNavigate('kyc-intelligence')}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-[10px] font-bold text-left truncate"
                    >
                      → KYC Intelligence
                    </button>
                    <button
                      onClick={() => onNavigate && onNavigate('investigations')}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-[10px] font-bold text-left truncate"
                    >
                      → Investigation Case
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Click any tactical marker on the Google Map to inspect suspect telemetry, telecom towers, and dispatch squad units.</p>
              </div>
            )}
        </div>
      </div>

      {/* 6. Google Maps Satellite & Street View Inspection Modal */}
      {showSatelliteModal && selectedPin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn space-y-0">
            <div className="p-4 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Google Maps Optical &amp; Cadastral Inspection: {selectedPin.bank} ({selectedPin.city})
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Cadastral Plot: <strong className="text-blue-700">{selectedPin.cadastral?.cadastral_plot_id || selectedPin.cadastral_plot_id || 'CADASTRAL-PK-PLOT-08'}</strong> • GPS: {selectedPin.lat.toFixed(6)}, {selectedPin.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setSatelliteViewType('k')}
                    className={`px-2.5 py-1 rounded font-bold transition-all ${satelliteViewType === 'k' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Satellite (Zoom 19)
                  </button>
                  <button
                    onClick={() => setSatelliteViewType('m')}
                    className={`px-2.5 py-1 rounded font-bold transition-all ${satelliteViewType === 'm' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Roadways
                  </button>
                  <button
                    onClick={() => setSatelliteViewType('street')}
                    className={`px-2.5 py-1 rounded font-bold transition-all ${satelliteViewType === 'street' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Street View 360°
                  </button>
                </div>
                <button
                  onClick={() => setShowSatelliteModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Embedded Live Google Maps Viewport */}
            <div className="w-full h-96 bg-slate-950 relative">
              {satelliteViewType === 'street' ? (
                apiKey && apiKey.startsWith('AIzaSy') && !apiKey.includes('CYBERHXA') && !apiKey.includes('FINTRACE') ? (
                  <iframe
                    title="Google Street View 360"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${selectedPin.lat},${selectedPin.lng}&heading=${headingAngle}&pitch=5&fov=75`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Navigation className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">Google Street View 360° Panoramic Feed</h4>
                      <p className="text-xs text-slate-300 max-w-md mt-1 font-mono">
                        Target: {selectedPin.bank} • Cadastral: {selectedPin.cadastral?.street_address || selectedPin.street_address || 'Main Banking Boulevard'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        GPS Coordinates: {selectedPin.lat.toFixed(6)}, {selectedPin.lng.toFixed(6)} | Azimuth Heading: {headingAngle}°
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                      <a
                        href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${selectedPin.lat},${selectedPin.lng}&heading=${headingAngle}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Launch Physical 360° Street View</span>
                      </a>
                      <a
                        href={`https://earth.google.com/web/@${selectedPin.lat},${selectedPin.lng},100a,35d,35y,${headingAngle}h,60t,0r`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Inspect in Google Earth 3D</span>
                      </a>
                      <button
                        onClick={() => {
                          setShowSatelliteModal(false);
                          setIsEditingKey(true);
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-medium"
                      >
                        Configure Google Maps API Key
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <iframe
                  title="Google Maps Physical Satellite"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${selectedPin.lat},${selectedPin.lng}&t=${satelliteViewType}&z=19&output=embed`}
                />
              )}

              {/* Street View Orientation Controls Overlay */}
              {satelliteViewType === 'street' && (
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 p-2 rounded-lg border border-slate-200 flex items-center gap-2 text-xs shadow-md">
                  <span className="font-mono text-[10px] text-slate-500 font-bold">Pan Angle: {headingAngle}°</span>
                  <button
                    onClick={() => handleRotateHeading(-30)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold"
                  >
                    ↺ -30°
                  </button>
                  <button
                    onClick={() => handleRotateHeading(30)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold"
                  >
                    ↻ +30°
                  </button>
                  <button
                    onClick={() => setHeadingAngle(0)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold"
                  >
                    North
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-slate-600 space-y-1">
                <div className="flex flex-wrap gap-2">
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    District: <strong>{selectedPin.cadastral?.district_tehsil || selectedPin.district || selectedPin.cityName}</strong>
                  </span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    Street: <strong>{selectedPin.cadastral?.street_address || selectedPin.street_address || 'Main Financial Strip'}</strong>
                  </span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    Footprint: <strong>{selectedPin.cadastral?.building_footprint || selectedPin.building_footprint || 'Commercial Floor'}</strong>
                  </span>
                  {selectedPin.cadastral?.elevation && (
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-amber-700">
                      AMSL: <strong>{selectedPin.cadastral.elevation}</strong>
                    </span>
                  )}
                  {selectedPin.cadastral?.cctv_safe_city && (
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-700">
                      Safe City: <strong>{selectedPin.cadastral.cctv_safe_city}</strong>
                    </span>
                  )}
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedPin.lat},${selectedPin.lng}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <span>Open in Official Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 7. Official Section 102 CrPC / Section 106 BNSS Statutory Bank Notice Modal */}
      {showNoticeModal && statutoryNoticeData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn space-y-0">
            <div className="p-4 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Statutory Bank Debit Restriction Directive
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {statutoryNoticeData.notice_id} • Pursuant to Section 102 CrPC / Section 106 BNSS
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-slate-50 max-h-[70vh] overflow-y-auto space-y-4 text-xs font-serif leading-relaxed text-slate-800">
              <div className="text-center space-y-1 pb-3 border-b border-slate-300">
                <div className="font-bold text-sm tracking-wide text-slate-950 uppercase">
                  POLICE CYBER CRIME DIVISION • CENTRAL CRIME COMMAND
                </div>
                <div className="text-[11px] text-slate-600 font-sans">
                  FINANCIAL INVESTIGATION UNIT • STATUTORY LEGAL PROCEEDING
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Date: {statutoryNoticeData.date} | Notice Ref: {statutoryNoticeData.notice_id}
                </div>
              </div>

              <div>
                <strong>TO:</strong><br />
                {statutoryNoticeData.to_nodal_officer}<br />
                Law Enforcement Assistance Unit
              </div>

              <div>
                <strong>SUBJECT:</strong><br />
                <span className="font-bold underline text-slate-900">
                  {statutoryNoticeData.subject}
                </span>
              </div>

              <div className="whitespace-pre-line bg-white p-4 rounded-lg border border-slate-200 shadow-xs font-mono text-[11px] text-slate-700">
                {statutoryNoticeData.statutory_text}
              </div>

              <div className="pt-2 flex justify-between items-end border-t border-slate-200 text-slate-600 font-sans text-[11px]">
                <div>
                  <div>Investigating Officer: <strong>Inspector of Police (Cyber Crime)</strong></div>
                  <div className="font-mono text-[10px] text-slate-400">Cryptographic Hash: {statutoryNoticeData.hash}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-700 font-bold font-sans">DIGITALLY SIGNED</div>
                  <div className="font-mono text-[10px] text-slate-400">FIU Law Enforcement Gateway</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(statutoryNoticeData.statutory_text);
                    setCopiedNotice(true);
                    setTimeout(() => setCopiedNotice(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNotice ? 'Copied to Clipboard' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setNoticeTransmitted(true);
                  playTacticalAlertSound();
                }}
                className={`px-4 py-2 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all ${
                  noticeTransmitted
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {noticeTransmitted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span>{noticeTransmitted ? 'Transmitted to Bank Gateway' : 'Transmit Notice to Bank Nodal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Money Trail Corridor Detail Inspection Modal */}
      {selectedCorridor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-5 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Activity className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Banking Corridor Fund Route Inspection
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {selectedCorridor.channel} • {selectedCorridor.relationshipStatus}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedCorridor(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Transferred Volume:</span>
                <span className="font-extrabold text-red-600 text-base font-mono">{selectedCorridor.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Routing Path:</span>
                <span className="font-bold text-slate-800">{selectedCorridor.fromCity} ➔ {selectedCorridor.toCity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Inter-City Haversine Distance:</span>
                <span className="font-mono font-bold text-blue-700">{selectedCorridor.distanceKm} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Estimated Transit Speed:</span>
                <span className="font-bold text-emerald-700">~{selectedCorridor.estimatedTransitMinutes} mins via clearing house</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedCorridor(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('money-trail', selectedAccountId);
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
              >
                <span>Open in Money Trail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Tactical Encrypted Radio Transmission Modal with Field IO */}
      {showRadioModal && radioTargetPin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn space-y-0">
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
                  <Radio className="w-5 h-5 animate-pulse text-indigo-700" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>Encrypted Tactical Radio Transmission</span>
                    <span className="px-2 py-0.5 rounded text-[9.5px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                      SECURE AES-256
                    </span>
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Channel: {radioTargetPin.investigation_officer?.encrypted_freq || '155.475 MHz'} • Callsign: {radioTargetPin.investigation_officer?.radio_callsign || 'HQ-COMMAND'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowRadioModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md text-lg"
              >
                ✕
              </button>
            </div>

            {/* Officer & Unit Dossier Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {radioTargetPin.investigation_officer?.officer_name || 'Investigation Officer'}
                  </div>
                  <div className="text-indigo-700 text-[11px] font-semibold">
                    {radioTargetPin.investigation_officer?.rank} • Badge #{radioTargetPin.investigation_officer?.badge_no}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-emerald-700 text-xs font-bold block">
                    {radioTargetPin.patrol_unit?.unit_callsign || 'PATROL-UNIT'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ETA: {radioTargetPin.patrol_unit?.eta_minutes}m ({radioTargetPin.patrol_unit?.distance_km} km)
                  </span>
                </div>
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700">
                <span className="text-slate-500 font-mono block text-[9.5px]">ASSIGNED TARGET:</span>
                <strong>{radioTargetPin.title}</strong> — {radioTargetPin.bank} ({radioTargetPin.district || radioTargetPin.city})
              </div>
            </div>

            {/* Live Audio Waveform Animation & Transmission Feed */}
            <div className="p-4 space-y-3">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 h-6">
                  <span className="w-1 h-3 bg-emerald-500 animate-pulse rounded-full"></span>
                  <span className="w-1 h-5 bg-emerald-500 animate-pulse rounded-full"></span>
                  <span className="w-1 h-2 bg-emerald-500 animate-pulse rounded-full"></span>
                  <span className="w-1 h-6 bg-emerald-600 animate-pulse rounded-full"></span>
                  <span className="w-1 h-4 bg-emerald-500 animate-pulse rounded-full"></span>
                  <span className="w-1 h-2 bg-emerald-500 animate-pulse rounded-full"></span>
                  <span className="w-1 h-5 bg-emerald-500 animate-pulse rounded-full"></span>
                  <span className="w-1 h-3 bg-emerald-500 animate-pulse rounded-full"></span>
                </div>
                <div className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  RADIO LINK ACTIVE (TX/RX)
                </div>
              </div>

              {/* Transmission Logs */}
              <div className="max-h-44 overflow-y-auto space-y-2 pr-1 font-mono text-[11px]">
                {radioTransmissionLogs.map((log: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span className="text-indigo-700 font-bold">[{log.channel}] {log.from} ➔ {log.to}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="text-slate-800">
                      &gt; "{log.outbound_order || log.message}"
                    </div>
                    {log.acknowledgment && (
                      <div className="text-emerald-700 text-[10.5px] pl-2 border-l-2 border-emerald-500 pt-0.5">
                        &lt; {log.acknowledgment}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Tactical Command Presets */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Quick Tactical Directives:
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    "Seal branch perimeter immediately.",
                    "Detain OTC cash-out suspect at teller counter.",
                    "Preserve ATM surveillance CCTV footage.",
                    "Execute Section 102 CrPC freezing order."
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setRadioTxMessage(preset)}
                      className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input & Dispatch Button */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={radioTxMessage}
                  onChange={(e) => setRadioTxMessage(e.target.value)}
                  placeholder="Type operational tactical dispatch order to IO..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-sans"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendRadioTransmission();
                  }}
                />
                <button
                  onClick={handleSendRadioTransmission}
                  disabled={!radioTxMessage.trim() || isRadioTransmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isRadioTransmitting ? 'Transmitting...' : 'Transmit (TX)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. All-Points Bulletin (APB) Flash Modal */}
      {showApbModal && apbTargetPin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full border-2 border-red-500 shadow-2xl p-5 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg border border-red-200">
                  <Siren className="w-5 h-5 text-red-600 animate-spin" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-red-700 uppercase tracking-wider">
                    All-Points Bulletin (APB) Authorization
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    PRIORITY FLASH ALERT • MULTI-AGENCY DISPATCH
                  </p>
                </div>
              </div>
              <button onClick={() => setShowApbModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2 text-xs">
              <div className="text-red-900 font-bold">
                BROADCAST TARGET: <span className="font-mono text-red-700">{apbTargetPin.account_no}</span> ({apbTargetPin.bank})
              </div>
              <div className="text-slate-700 text-[11px]">
                <strong>Jurisdiction:</strong> {apbTargetPin.jurisdiction || apbTargetPin.cityName}
              </div>
              <div className="text-slate-700 text-[11px]">
                <strong>Assigned Lead IO:</strong> {apbTargetPin.investigation_officer?.officer_name} ({apbTargetPin.investigation_officer?.rank})
              </div>
              <div className="text-red-700 font-bold text-xs">
                Exposure at Risk: {apbTargetPin.amount}
              </div>
            </div>

            {apbSuccessMsg ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{apbSuccessMsg}</span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Authorizing this APB will transmit an emergency alert siren to all active police patrol units within this sector, alerting squad cars to seal nearby ATMs and banking avenues.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowApbModal(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBroadcastApb}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Siren className="w-3.5 h-3.5" />
                    <span>Authorize &amp; Broadcast APB</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
