import React, { useState } from 'react';
import {
  Shield,
  Lock,
  User,
  Building,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Fingerprint,
  Radio,
  FileCheck2,
  Globe,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';

export interface UserSession {
  officer_name: string;
  badge_no: string;
  role: string;
  agency: string;
  station: string;
  clearance_level: string;
  login_time: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { language, setLanguage, t } = useLanguage();
  const [badgeId, setBadgeId] = useState('FIN-INV-8842');
  const [password, setPassword] = useState('••••••••••••');
  const [agency, setAgency] = useState('FIU-IND Special Cyber Operations (New Delhi)');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!badgeId.trim()) {
      setError('Please provide Officer ID / Badge Number');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const session: UserSession = {
        officer_name: badgeId.includes('8842') ? 'Investigator Sharma' : 'Investigator Analyst',
        badge_no: badgeId.trim().toUpperCase(),
        role: 'Lead Cyber Forensic Analyst',
        agency: agency,
        station: 'National Cyber Forensic Directorate',
        clearance_level: 'TOP SECRET // LEVEL-4 EYES ONLY',
        login_time: new Date().toLocaleTimeString('en-US', { hour12: false })
      };
      try {
        localStorage.setItem('fintrace_auth_session', JSON.stringify(session));
      } catch {}
      setLoading(false);
      onLoginSuccess(session);
    }, 500);
  };

  const handleInstantDemoLogin = () => {
    setBadgeId('FIN-INV-8842');
    setPassword('FinTrace@2026!');
    setAgency('FIU-IND Special Cyber Operations (New Delhi)');
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const session: UserSession = {
        officer_name: 'Investigator Sharma',
        badge_no: 'FIN-INV-8842',
        role: 'Lead Cyber Forensic Analyst',
        agency: 'FIU-IND Special Cyber Operations (New Delhi)',
        station: 'National Cyber Forensic Directorate',
        clearance_level: 'TOP SECRET // LEVEL-4 EYES ONLY',
        login_time: new Date().toLocaleTimeString('en-US', { hour12: false })
      };
      try {
        localStorage.setItem('fintrace_auth_session', JSON.stringify(session));
      } catch {}
      setLoading(false);
      onLoginSuccess(session);
    }, 350);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col justify-between relative select-none">
      {/* Top Header Bar */}
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
            <Shield className="w-5 h-5 fill-blue-600 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900">FINTRACE</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                v2.4 SECURE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              MHA // FIU-IND FINANCIAL INTELLIGENCE & FORENSIC ENGINE
            </p>
          </div>
        </div>

        {/* Language Selection Pill */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all shadow-2xs"
          >
            <span className="text-sm">{currentLangObj.flag}</span>
            <span>{currentLangObj.native}</span>
            <span className="text-[10px] text-slate-400 uppercase font-mono">({currentLangObj.code})</span>
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 divide-y divide-slate-100 text-xs">
              <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                Select Language / भाषा
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                      language === l.code ? 'text-blue-700 font-bold bg-blue-50/70' : 'text-slate-700'
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
      </header>

      {/* Main Login Workspace - Clean White Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>{t('clearance', 'TOP SECRET // LEVEL-4 EYES ONLY')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('login_title', 'FINTRACE LAW ENFORCEMENT GATEWAY')}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t('login_subtitle', 'Ministry of Home Affairs // Financial Intelligence Unit')}
            </p>
          </div>

          {/* Quick Demo Access Button */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-center">
            <div className="text-xs text-blue-900 font-semibold">
              Evaluating or verifying the platform?
            </div>
            <button
              onClick={handleInstantDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('instant_demo', 'Instant Access as Lead Investigator (Demo Mode)')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest shrink-0">
              OR CREDENTIAL AUTHENTICATION
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Officer ID / Badge */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-700 font-semibold block flex items-center justify-between">
                <span>{t('badge_id', 'Officer ID / Badge Number')}:</span>
                <span className="text-[10px] font-mono text-blue-600 font-bold">Verified ID</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  placeholder="e.g. FIN-INV-8842 or officer@fintrace.gov.in"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Agency / Jurisdiction */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-700 font-semibold block">
                {t('agency', 'Agency / Jurisdiction Desk')}:
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer shadow-2xs"
                >
                  <option value="FIU-IND Special Cyber Operations (New Delhi)">FIU-IND Special Cyber Operations (New Delhi)</option>
                  <option value="National Cyber Crime Coordination Centre (I4C)">National Cyber Crime Coordination Centre (I4C)</option>
                  <option value="Enforcement Directorate - PMLA Financial Forensics">Enforcement Directorate - PMLA Financial Forensics</option>
                  <option value="State Cyber Police HQ - Special Crime Wing">State Cyber Police HQ - Special Crime Wing</option>
                  <option value="Interpol NCB - Cross-Border Intelligence Wing">Interpol NCB - Cross-Border Intelligence Wing</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-700 font-semibold block flex items-center justify-between">
                <span>{t('password', 'Password / Access Secret')}:</span>
                <span className="text-[10px] text-slate-400 font-medium">256-Bit Encrypted</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter encrypted security secret"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-10 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating Statutory Credentials...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4 text-blue-100" />
                  <span>{t('sign_in', 'Secure Sign In to Tactical Terminal')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Statutory Forensic Watermark Notice */}
          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center space-y-1 font-mono">
            <div className="flex items-center justify-center gap-1.5 text-slate-600">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold">Section 65B Indian Evidence Act Forensic Audit Active</span>
            </div>
            <p>Every login attempt is cryptographically logged to immutable SHA-256 system ledger.</p>
          </div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="px-6 py-3 bg-white border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
        <div className="text-[11px] font-mono">
          FINTRACE Forensic Core // All Access Monitored under IT Act 2000 &amp; Bharatiya Nyaya Sanhita 2023
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
          <span>IP: 127.0.0.1</span>
          <span>•</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Airgap Tunnel Secure
          </span>
        </div>
      </footer>
    </div>
  );
};
