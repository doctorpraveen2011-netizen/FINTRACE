import React, { useEffect, useRef } from 'react';
import { MapPin, Plus, Minus, ExternalLink, ShieldAlert, Crosshair } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GoogleMapsCardProps {
  onOpenMap?: () => void;
}

export const GoogleMapsCard: React.FC<GoogleMapsCardProps> = ({ onOpenMap }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid duplicate initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      // 1. Initialize real Leaflet Map centered on Chennai, TN hotspot
      const map = L.map(mapContainerRef.current, {
        center: [13.0827, 80.2707],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: true
      });

      mapInstanceRef.current = map;

      // 2. Real OpenStreetMap Cartographic Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // 3. Custom Pulsing Red Cashout Pin (Chennai Central ATM Kiosk #09)
      const redPulseIcon = L.divIcon({
        className: 'custom-pulse-marker',
        html: `
          <div style="position:relative; width:30px; height:30px;">
            <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:#EF4444; opacity:0.4; animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position:absolute; top:4px; left:4px; width:22px; height:22px; border-radius:50%; background:#DC2626; border:2px solid #FFFFFF; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.35);">
              <div style="width:7px; height:7px; border-radius:50%; background:#FFFFFF;"></div>
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // 4. Secondary Mule Hub Branch Pin (Axis Bank Gateway)
      const orangeMuleIcon = L.divIcon({
        className: 'mule-hub-marker',
        html: `
          <div style="width:22px; height:22px; border-radius:50%; background:#F59E0B; border:2px solid #FFFFFF; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
            <div style="width:6px; height:6px; border-radius:50%; background:#FFFFFF;"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      // 5. Police Intercept Patrol Unit Pin (Cyber Patrol Bravo-4)
      const bluePatrolIcon = L.divIcon({
        className: 'patrol-marker',
        html: `
          <div style="width:22px; height:22px; border-radius:50%; background:#2563EB; border:2px solid #FFFFFF; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">
            <div style="width:6px; height:6px; border-radius:50%; background:#FFFFFF;"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      // Add real markers to map
      const m1 = L.marker([13.0827, 80.2707], { icon: redPulseIcon })
        .addTo(map)
        .bindPopup("<b>ATM Kiosk #09 (Chennai)</b><br/>Suspect cashout: ₹4,50,000<br/>Status: <b>FLAGGED_CRITICAL</b>");

      const m2 = L.marker([13.0520, 80.2450], { icon: orangeMuleIcon })
        .addTo(map)
        .bindPopup("<b>Axis Bank Gateway Branch</b><br/>Origin Mule: AC78456<br/>Status: <b>MONITORED</b>");

      const m3 = L.marker([13.0950, 80.2800], { icon: bluePatrolIcon })
        .addTo(map)
        .bindPopup("<b>Cyber Patrol Intercept Bravo-4</b><br/>ETA: 4.2 mins<br/>Status: <b>EN ROUTE</b>");

      // 6. Draw real vector flight / transaction line between mule and ATM
      L.polyline([[13.0520, 80.2450], [13.0827, 80.2707]], {
        color: '#EF4444',
        weight: 3,
        dashArray: '5, 5',
        opacity: 0.85
      }).addTo(map);

      L.polyline([[13.0827, 80.2707], [13.0950, 80.2800]], {
        color: '#2563EB',
        weight: 2.5,
        dashArray: '4, 4',
        opacity: 0.75
      }).addTo(map);

      // Force size invalidation so tiles render perfectly within flex bounds
      setTimeout(() => {
        map.invalidateSize();
      }, 250);

    } catch (e) {
      console.error("Leaflet map initialization error:", e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full min-h-0 min-w-0 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 shrink-0 z-10">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
            Live Google Maps
          </h3>
        </div>
        <button
          onClick={onOpenMap}
          className="flex items-center gap-1 text-[10.5px] font-bold text-blue-600 hover:text-blue-800 transition-colors shrink-0"
        >
          <span>Open Full Map</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Real Live Leaflet Map Container */}
      <div 
        onClick={onOpenMap}
        className="flex-1 min-h-0 relative w-full rounded-xl overflow-hidden border border-slate-200/80 cursor-pointer group shadow-inner"
      >
        <div ref={mapContainerRef} className="w-full h-full min-h-[140px] z-0" />

        {/* Suspicious Location Banner with Real Coordinates */}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs rounded-lg px-2.5 py-1.5 shadow-md border border-slate-200 text-left z-[500] pointer-events-none">
          <div className="flex items-center gap-1 text-[9px] font-bold text-red-600 uppercase tracking-wider leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span>Suspicious Location</span>
          </div>
          <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight mt-0.5">
            Chennai, TN
          </div>
          <div className="text-[8.5px] font-mono text-slate-400 mt-0.5">
            13.0827° N, 80.2707° E
          </div>
        </div>

        {/* Real Interactive Leaflet Zoom Controls */}
        <div className="absolute bottom-2 right-2 flex flex-col bg-white rounded-md shadow-md border border-slate-200 overflow-hidden text-slate-700 z-[500]">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 hover:bg-slate-100 transition-colors border-b border-slate-100 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 hover:bg-slate-100 transition-colors flex items-center justify-center"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
