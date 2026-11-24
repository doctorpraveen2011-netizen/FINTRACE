import React, { useState } from 'react';
import {
  Search,
  Bell,
  Shield,
  User,
  PanelLeft,
  PanelLeftClose,
  Globe,
  LogOut,
  ChevronDown,
  Building,
  KeyRound,
  FileCheck2
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { UserSession } from './auth/LoginPage';

interface HeaderProps {
  onSearch?: (term: string) => void;
  systemStatus?: string;
  lastUpdated?: string;
  alertCount?: number;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  userSession?: UserSession | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  systemStatus = "System Online",
  lastUpdated = "24 Nov 2025, 18:45:32",
  alertCount = 3,
  isSidebarCollapsed = false,
  onToggleSidebar,
  userSession,
  onLogout
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-4 lg:px-5 flex items-center justify-between sticky top-0 z-40 shadow-xs shrink-0 box-border">
      {/* Left: Sidebar Toggle + Brand Logo & Title */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            title={isSidebarCollapsed ? "Expand sidebar (256px)" : "Collapse sidebar (64px)"}
            aria-label="Toggle navigation sidebar"
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="w-5 h-5 text-blue-600" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-slate-600" />
            )}
          </button>
        )}

        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs shrink-0">
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/>
          </svg>
        </div>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 leading-none truncate">
            FINTRACE
          </h1>
          <p className="text-[10px] font-medium text-slate-500 tracking-tight mt-0.5 hidden xs:block truncate">
            {t('platform_subtitle', 'Unified Financial-Cyber Intelligence Platform')}
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-2 sm:mx-4 lg:mx-6 min-w-0 shrink">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_placeholder', 'Search Account No, UTR, Mobile, Domain...')}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg pl-9 pr-3 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </form>

      {/* Right Controls: Language Selector, System Status, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Multilingual Translation Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
            title="Translate interface / भाषा बदलें"
          >
            <span className="text-sm leading-none">{currentLangObj.flag}</span>
            <span className="hidden sm:inline text-[11px]">{currentLangObj.native}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 divide-y divide-slate-100 text-xs animate-fadeIn">
              <div className="px-3 py-1 text-[9.5px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                Select Language
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                      language === l.code ? 'text-blue-700 font-bold bg-blue-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.native}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{l.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* System Online Badge */}
        <div className="flex items-center gap-2 text-right">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-slate-800 leading-none flex items-center gap-1.5">
              <span>{t('system_online', systemStatus)}</span>
            </div>
            <div className="text-[9px] text-slate-400 leading-none mt-0.5 font-mono">
              {lastUpdated}
            </div>
          </div>
        </div>

        {/* Notification Bell */}
        <div 
          className="relative cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg transition-colors shrink-0"
          title={`${alertCount} ${t('active_alerts', 'active alerts')}`}
        >
          <Bell className="w-4 h-4 text-slate-600" />
          {alertCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
              {alertCount}
            </span>
          )}
        </div>

        {/* User Profile & Logout Dropdown */}
        <div className="relative pl-2 border-l border-slate-200 shrink-0">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-lg transition-all text-left"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
              <User className="w-4 h-4 text-slate-200" />
            </div>
            <div className="leading-tight hidden md:block">
              <div className="text-xs font-bold text-slate-900 leading-none">
                {userSession?.officer_name || t('investigator', 'Investigator')}
              </div>
              <div className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">
                {userSession?.role || t('cyber_analyst', 'Cyber Analyst')}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 text-xs animate-fadeIn">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>{userSession?.officer_name || 'Investigator Sharma'}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Badge: <strong className="text-blue-700">{userSession?.badge_no || 'CYBER-INV-8842'}</strong>
                </div>
                <div className="text-[9.5px] text-slate-400 mt-0.5 truncate">
                  {userSession?.agency || 'FIU-IND Special Cyber Operations'}
                </div>
                <div className="mt-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[9px] font-bold inline-block">
                  {userSession?.clearance_level || 'TOP SECRET // LEVEL-4'}
                </div>
              </div>

              {onLogout && (
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('logout', 'Sign Out & Lock Terminal')}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
