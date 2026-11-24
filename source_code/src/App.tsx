import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { MetricCards } from './components/dashboard/MetricCards.tsx';
import { PreAttackCard } from './components/dashboard/PreAttackCard.tsx';
import { AgenticAICard } from './components/dashboard/AgenticAICard.tsx';
import { KYCCard } from './components/dashboard/KYCCard.tsx';
import { MuleCard } from './components/dashboard/MuleCard.tsx';
import { MoneyTrailCard } from './components/dashboard/MoneyTrailCard.tsx';
import { GoogleMapsCard } from './components/dashboard/GoogleMapsCard.tsx';
import { DigitalTwinCard } from './components/dashboard/DigitalTwinCard.tsx';
import { RiskShapCard } from './components/dashboard/RiskShapCard.tsx';
import { AccountRiskCard } from './components/dashboard/AccountRiskCard.tsx';
import { RecentAlertsCard } from './components/dashboard/RecentAlertsCard.tsx';
import { AutomatedResponseCard } from './components/dashboard/AutomatedResponseCard.tsx';
import { ModuleView } from './components/modules/ModuleView.tsx';
import { LoginPage, UserSession } from './components/auth/LoginPage.tsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { io, Socket } from 'socket.io-client';
import { Monitor, Maximize2, Settings, ShieldCheck } from 'lucide-react';

function MainApp() {
  const { t } = useLanguage();
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('fintrace_auth_session') || localStorage.getItem('cyberhxa_auth_session');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [alertCount, setAlertCount] = useState<number>(8);
  const [systemData, setSystemData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTrailAccount, setSelectedTrailAccount] = useState<string>('acc_00020535');
  const [dashboardFit, setDashboardFit] = useState<boolean>(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const handleNavigate = (id: string, targetAccount?: string) => {
    if (targetAccount) {
      setSelectedTrailAccount(targetAccount);
    }
    setActiveModule(id);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('fintrace_auth_session');
      localStorage.removeItem('cyberhxa_auth_session');
    } catch {}
    setUserSession(null);
  };

  // Fetch initial state from backend API
  const fetchState = async () => {
    try {
      const [metricsRes, preAttackRes, agentsRes, mulesRes, alertsRes, casesRes, evidenceRes, auditRes] = await Promise.all([
        fetch('/api/command-centre/metrics').then(r => r.json()).catch(() => null),
        fetch('/api/pre-attack').then(r => r.json()).catch(() => null),
        fetch('/api/agents').then(r => r.json()).catch(() => null),
        fetch('/api/mules').then(r => r.json()).catch(() => null),
        fetch('/api/alerts').then(r => r.json()).catch(() => null),
        fetch('/api/cases').then(r => r.json()).catch(() => null),
        fetch('/api/evidence').then(r => r.json()).catch(() => null),
        fetch('/api/audit-logs').then(r => r.json()).catch(() => null)
      ]);

      setSystemData({
        system_metrics: metricsRes?.data || {
          total_transactions_monitored: "2.8M",
          transactions_growth_pct: "+12.5%",
          suspicious_activities_detected: 1248,
          suspicious_growth_pct: "+28.7%",
          critical_accounts: 37,
          critical_growth_pct: "+5.7%",
          resolved_cases: 892,
          resolved_growth_pct: "+18.2%",
          system_status: "System Online",
          last_updated: "24 Nov 2025, 18:45:32"
        },
        pre_attack_detection: preAttackRes?.data,
        agentic_ai: agentsRes?.data,
        agentic_orchestrator: agentsRes?.data || { agents: agentsRes?.data?.agents || [] },
        mule_detection: mulesRes?.data,
        recent_alerts: Array.isArray(alertsRes?.data) ? alertsRes.data : (alertsRes?.data?.alerts || []),
        investigation_cases: casesRes?.data?.cases || casesRes?.data || [],
        evidence_chain: evidenceRes?.data || [],
        audit_logs: auditRes?.data || []
      });
      setLoading(false);
    } catch (e) {
      console.error("Error loading system state:", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();

    // WebSocket real-time updates
    const socket: Socket = io({ path: '/socket.io', transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('Connected to real-time financial intelligence feed');
    });

    socket.on('new_transaction', (tx: any) => {
      if (tx.risk_level === 'CRITICAL' || tx.risk_level === 'HIGH') {
        setAlertCount(prev => prev + 1);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // If user is not authenticated, render LoginPage
  if (!userSession) {
    return <LoginPage onLoginSuccess={(session) => setUserSession(session)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans antialiased overflow-hidden select-none">
      {/* 1. Master System Header (64px) */}
      <Header
        onSearch={(term) => {
          if (term.toLowerCase().includes('mule') || term.includes('78456')) {
            setActiveModule('mule-detection');
          } else if (term.toLowerCase().includes('map') || term.toLowerCase().includes('chennai')) {
            setActiveModule('maps');
          } else if (term.toLowerCase().includes('twin') || term.toLowerCase().includes('simulat')) {
            setActiveModule('digital-twin');
          } else {
            setActiveModule('live-transactions');
          }
        }}
        systemStatus={systemData?.system_metrics?.system_status || "System Online"}
        lastUpdated={systemData?.system_metrics?.last_updated || "24 Nov 2025, 18:45:32"}
        alertCount={alertCount}
        isSidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
        userSession={userSession}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* 2. Left Navigation Sidebar (240px expanded / 64px collapsed) */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={(id) => setActiveModule(id)}
          alertBadgeCount={alertCount}
          isCollapsed={sidebarCollapsed}
        />

        {/* 3. Main Operational Content Canvas */}
        <main
          className={`flex-1 min-w-0 h-[calc(100dvh-4rem)] flex flex-col ${
            activeModule === 'maps' || activeModule === 'digital-twin'
              ? 'p-2 sm:p-2.5 overflow-hidden'
              : dashboardFit && activeModule === 'dashboard'
              ? 'p-2 sm:p-2.5 xl:p-3 overflow-y-auto lg:overflow-y-hidden'
              : 'p-3 sm:p-4 overflow-y-auto'
          } box-border`}
        >
          {activeModule === 'dashboard' ? (
            <div className="flex flex-col flex-1 min-h-0 gap-2">
              {/* Density & View Controls Bar */}
              <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200/90 shadow-2xs shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight truncate">
                    Operational Command Center
                  </h2>
                  <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 pl-2.5 border-l border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="truncate">All 12 Real-Time Intelligence Features Active</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setDashboardFit(true)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md border flex items-center gap-1.5 transition-all ${
                      dashboardFit
                        ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="Fit all features to viewport without scrolling"
                  >
                    <Monitor className="w-3.5 h-3.5 text-blue-600" />
                    <span>Fit to Screen</span>
                  </button>

                  <button
                    onClick={() => setDashboardFit(false)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md border flex items-center gap-1.5 transition-all ${
                      !dashboardFit
                        ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="Expand view with normal scrolling"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Expand View</span>
                  </button>

                  <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-500 font-semibold pl-2 border-l border-slate-200">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700 font-bold text-[10px]">
                      100dvh Grid
                    </span>
                  </div>
                </div>
              </div>

              {/* Responsive Dynamic Grid - 4 Rows matching exact architecture */}
              <div
                className={`flex-1 min-h-0 ${
                  dashboardFit
                    ? 'grid grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 xl:gap-2.5'
                    : 'flex flex-col gap-3'
                }`}
              >
                {/* Row 1: 4 Metric Cards */}
                <div className="shrink-0">
                  <MetricCards
                    metrics={systemData?.system_metrics || {}}
                    onDrilldown={(mod) => setActiveModule(mod)}
                    compact={dashboardFit}
                  />
                </div>

                {/* Row 2: Pre-Attack Line Chart + Agentic AI Radial + KYC Intelligence */}
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-2 xl:gap-2.5 min-h-0 min-w-0 ${
                    dashboardFit ? 'h-full' : 'min-h-[220px]'
                  }`}
                >
                  <div className="lg:col-span-5 min-h-0 min-w-0 h-full">
                    <PreAttackCard
                      data={systemData?.pre_attack_detection}
                      onViewDetails={() => setActiveModule('pre-attack')}
                    />
                  </div>
                  <div className="lg:col-span-4 min-h-0 min-w-0 h-full">
                    <AgenticAICard
                      onViewControlCentre={() => setActiveModule('agentic-control')}
                    />
                  </div>
                  <div className="lg:col-span-3 min-h-0 min-w-0 h-full">
                    <KYCCard
                      score={94.7}
                      onViewDetails={() => setActiveModule('kyc-intelligence')}
                    />
                  </div>
                </div>

                {/* Row 3: Mule Account Detection + Money Trail Analysis + Live Google Maps + Digital Twin */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 xl:gap-2.5 min-h-0 min-w-0 ${
                    dashboardFit ? 'h-full' : 'min-h-[200px]'
                  }`}
                >
                  <div className="min-h-0 min-w-0 h-full">
                    <MuleCard
                      detectedCount={systemData?.mule_detection?.mule_accounts_detected || 86}
                      metrics={systemData?.mule_detection?.metrics}
                      onViewAnalysis={() => setActiveModule('mule-detection')}
                    />
                  </div>
                  <div className="min-h-0 min-w-0 h-full">
                    <MoneyTrailCard
                      onExploreGraph={() => setActiveModule('money-trail')}
                    />
                  </div>
                  <div className="min-h-0 min-w-0 h-full">
                    <GoogleMapsCard
                      onOpenMap={() => setActiveModule('maps')}
                    />
                  </div>
                  <div className="min-h-0 min-w-0 h-full">
                    <DigitalTwinCard
                      onRunSimulation={() => setActiveModule('digital-twin')}
                    />
                  </div>
                </div>

                {/* Row 4: AI Risk Intelligence & SHAP + Account Risk Classification + Recent Alerts + Automated Response */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 xl:gap-2.5 min-h-0 min-w-0 ${
                    dashboardFit ? 'h-full' : 'min-h-[200px]'
                  }`}
                >
                  <div className="min-h-0 min-w-0 h-full">
                    <RiskShapCard
                      score={91.3}
                      onViewExplanation={() => setActiveModule('shap-explainability')}
                    />
                  </div>
                  <div className="min-h-0 min-w-0 h-full">
                    <AccountRiskCard
                      onViewTiers={() => setActiveModule('account-risk')}
                    />
                  </div>
                  <div className="min-h-0 min-w-0 h-full">
                    <RecentAlertsCard
                      alerts={systemData?.recent_alerts}
                      onViewAll={() => setActiveModule('alerts')}
                    />
                  </div>
                  <div className="min-h-0 min-w-0 h-full">
                    <AutomatedResponseCard
                      onViewRequest={() => setActiveModule('automated-response')}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Dedicated Functional Page for Selected Module */
            <div className={`flex-1 min-h-0 ${activeModule === 'maps' || activeModule === 'digital-twin' ? 'overflow-hidden h-full flex flex-col' : 'overflow-y-auto'}`}>
              <ModuleView
                moduleId={activeModule}
                onNavigate={handleNavigate}
                systemData={systemData}
                onRefreshData={fetchState}
                selectedTrailAccount={selectedTrailAccount}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

export default App;
