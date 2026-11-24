import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Search,
  FileCheck,
  ShieldAlert,
  GitFork,
  Sparkles,
  BarChart3,
  Cpu,
  Target,
  Globe,
  MapPin,
  Map,
  Share2,
  Bell,
  FolderLock,
  FileText,
  ClipboardList,
  Settings,
  Shield,
  Activity
} from 'lucide-react';

export interface SidebarProps {
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
  alertBadgeCount?: number;
  isCollapsed?: boolean;
}

export const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'investigations', label: 'Investigations', icon: Search },
  { id: 'kyc-intelligence', label: 'KYC Intelligence', icon: FileCheck },
  { id: 'mule-detection', label: 'Mule Account Detection', icon: ShieldAlert },
  { id: 'money-trail', label: 'Money Trail', icon: GitFork },
  { id: 'ai-risk', label: 'AI Risk Intelligence', icon: Sparkles },
  { id: 'shap-explainability', label: 'SHAP Explainability', icon: BarChart3 },
  { id: 'tactical-workbench', label: 'Tactical AI & CDR Workbench', icon: Activity },
  { id: 'digital-twin', label: 'Digital Twin', icon: Cpu },
  { id: 'attack-intel', label: 'Attack Intelligence', icon: Target },
  { id: 'domain-intel', label: 'Domain Intelligence', icon: Globe },
  { id: 'ip-intel', label: 'IP Intelligence', icon: MapPin },
  { id: 'maps', label: 'Live Google Maps', icon: Map },
  { id: 'relationship-graph', label: 'Relationship Graph', icon: Share2 },
  { id: 'alerts', label: 'Real-Time Alerts', icon: Bell, badge: 5 },
  { id: 'evidence', label: 'Evidence Management', icon: FolderLock },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'audit-logs', label: 'Audit Logs', icon: ClipboardList },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  alertBadgeCount = 5,
  isCollapsed = false
}) => {
  const { t } = useLanguage();

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-[272px]'
      } bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none h-[calc(100dvh-4rem)] sticky top-16 transition-all duration-200 z-30 box-border`}
    >
      {/* Navigation List - Seamless Pixel-Faithful Sidebar with Hidden Scrollbar */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2 2xl:py-3 px-2 flex flex-col justify-between min-h-0">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          const translatedLabel = t(item.id, item.label);

          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              title={isCollapsed ? translatedLabel : undefined}
              className={`w-full flex items-center ${
                isCollapsed
                  ? 'justify-center px-0 py-2'
                  : 'justify-between px-3 py-1.5 2xl:py-2'
              } text-[13px] 2xl:text-[13.5px] font-semibold rounded-lg transition-all relative group ${
                isActive
                  ? 'bg-[#1D63FF] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
                <Icon
                  className={`w-[18px] h-[18px] 2xl:w-5 2xl:h-5 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate text-left leading-none tracking-tight">{translatedLabel}</span>
                )}
              </div>

              {/* Badges */}
              {item.badge && !isActive && (
                isCollapsed ? (
                  <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                ) : (
                  <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 ml-1 shadow-2xs">
                    {alertBadgeCount}
                  </span>
                )
              )}
            </button>
          );
        })}
      </div>

      {/* Sleek Compact Footer Strip */}
      <div className={`border-t border-slate-200/80 mt-auto bg-slate-50/80 shrink-0 ${isCollapsed ? 'p-2.5 flex justify-center' : 'px-3.5 py-2.5 flex items-center justify-between'}`}>
        {isCollapsed ? (
          <div className="relative group cursor-pointer" title="FINTRACE v2.4 Online">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-4 h-4 fill-current" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
                <Shield className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-xs font-bold text-slate-800 tracking-tight">FINTRACE</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              v2.4 Online
            </span>
          </>
        )}
      </div>
    </aside>
  );
};
