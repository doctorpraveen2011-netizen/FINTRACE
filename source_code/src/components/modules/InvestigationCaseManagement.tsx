import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  ChevronRight,
  ChevronLeft,
  Eye,
  Plus,
  X,
  MapPin,
  Smartphone,
  Building2,
  User,
  Activity,
  Paperclip,
  Printer,
  ArrowRight,
  Calendar,
  Layers,
  Database,
  Lock,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';

interface InvestigationCase {
  id: string;
  title: string;
  suspect_account: string;
  linked_accounts?: string;
  linked_mobile?: string;
  exposure: string;
  exposure_val?: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  assigned_officer: string;
  last_activity: string;
  status: string;
  overview?: string;
  complaint_summary?: string;
  milestones?: Array<{ date: string; text: string; status: string }>;
  evidence_count?: number;
  evidence_verified?: boolean;
  evidence_items?: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    sha256: string;
    verified: boolean;
    integrity_status?: string;
  }>;
  activity_log?: Array<{
    activity_id: string;
    activity_timestamp: string;
    activity_type: string;
    actor: string;
    description: string;
    demo_only?: boolean;
  }>;
  is_demo?: boolean;
}

interface InvestigationCaseManagementProps {
  onNavigate?: (module: string) => void;
}

export const InvestigationCaseManagement: React.FC<InvestigationCaseManagementProps> = ({ onNavigate }) => {
  // State
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<InvestigationCase | null>(null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Milestones' | 'Evidence' | 'Activity Log'>('Overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCases, setTotalCases] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  // Filter States matching reference image
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [severityFilter, setSeverityFilter] = useState<string>('All Severity');
  const [officerFilter, setOfficerFilter] = useState<string>('All Officers');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('24 Oct 2025 - 24 Nov 2025');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showDossierModal, setShowDossierModal] = useState<boolean>(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState<boolean>(false);
  const [newMilestoneText, setNewMilestoneText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // New Case Form State
  const [newCaseData, setNewCaseData] = useState({
    title: '',
    suspect_account: '',
    linked_accounts: '',
    linked_mobile: '',
    exposure: '₹12,50,000',
    severity: 'CRITICAL',
    assigned_officer: 'Rajesh Kumar',
    overview: '',
    complaint_summary: ''
  });

  // Fetch Cases from Backend API
  const fetchCases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: searchQuery,
        status: statusFilter,
        severity: severityFilter,
        officer: officerFilter
      });

      const res = await fetch(`/api/investigations?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setCases(json.data || []);
        setTotalCases(json.total || 0);
        setTotalPages(json.totalPages || 1);

        // Auto select first case if none selected or if selected is not in current view
        if (json.data && json.data.length > 0) {
          if (!selectedCase || !json.data.find((c: InvestigationCase) => c.id === selectedCase.id)) {
            setSelectedCase(json.data[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load investigation cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [page, statusFilter, severityFilter, officerFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCases();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Create Investigation Case
  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseData.title || !newCaseData.suspect_account) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/investigations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCaseData)
      });
      if (res.ok) {
        const result = await res.json();
        setShowCreateModal(false);
        setNewCaseData({
          title: '',
          suspect_account: '',
          linked_accounts: '',
          linked_mobile: '',
          exposure: '₹12,50,000',
          severity: 'CRITICAL',
          assigned_officer: 'Rajesh Kumar',
          overview: '',
          complaint_summary: ''
        });
        // Select newly created case and refresh list
        setSelectedCase(result.data);
        fetchCases();
      }
    } catch (err) {
      console.error('Error creating case:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Add Milestone
  const handleAddMilestone = async () => {
    if (!selectedCase || !newMilestoneText.trim()) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/investigations/${selectedCase.id}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newMilestoneText,
          officer: selectedCase.assigned_officer || 'Rajesh Kumar'
        })
      });
      if (res.ok) {
        const result = await res.json();
        setSelectedCase(result.data);
        setNewMilestoneText('');
        setShowAddMilestoneModal(false);
        fetchCases();
      }
    } catch (err) {
      console.error('Failed to add milestone:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in text-slate-800">
      {/* ----------------------------------------------------------------- */}
      {/* TOP HEADER: Investigation Case Management                          */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            {/* Custom police folder search icon */}
            <div className="relative">
              <FileText className="w-6 h-6" />
              <Search className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-white bg-blue-700 rounded-full p-0.5" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Investigation Case Management</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Lifecycle dossier tracking for ongoing cyber financial fraud operations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Realtime LEA Dossier Engine
          </span>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* SEARCH AND FILTER BAR (Exact Match to Reference Image)             */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search case ID / suspect account..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter 1: Status */}
        <div className="relative min-w-[130px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Evidence Review">Evidence Review</option>
            <option value="Escalated to LEA">Escalated to LEA</option>
            <option value="New - Demo">New - Demo</option>
            <option value="Closed">Closed</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Filter 2: Severity */}
        <div className="relative min-w-[130px]">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="All Severity">All Severity</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Filter 3: Officers */}
        <div className="relative min-w-[130px]">
          <select
            value={officerFilter}
            onChange={(e) => setOfficerFilter(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="All Officers">All Officers</option>
            <option value="Rajesh Kumar">Rajesh Kumar</option>
            <option value="Ananya Sharma">Ananya Sharma</option>
            <option value="Unassigned">Unassigned</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Filter 4: Date Range */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{dateRangeFilter}</span>
        </div>

        {(searchQuery || statusFilter !== 'All Status' || severityFilter !== 'All Severity' || officerFilter !== 'All Officers') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All Status');
              setSeverityFilter('All Severity');
              setOfficerFilter('All Officers');
            }}
            className="px-2.5 py-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* MAIN TWO-COLUMN SPLIT LAYOUT (Reference Image Layout)              */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* =============================================================== */}
        {/* LEFT COLUMN: CASES TABLE (Width ~ 60-62%)                       */}
        {/* =============================================================== */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Card Header: Cases count + Create Investigation button */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Cases ({totalCases})
              </h2>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Investigation</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto min-h-[360px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3.5">Case ID</th>
                  <th className="py-3 px-3">Investigation</th>
                  <th className="py-3 px-3">Suspect Account</th>
                  <th className="py-3 px-3">Exposure</th>
                  <th className="py-3 px-2 text-center">Severity</th>
                  <th className="py-3 px-3">Assigned Officer</th>
                  <th className="py-3 px-3">Last Activity</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Loading investigation dockets...</span>
                      </div>
                    </td>
                  </tr>
                ) : cases.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No investigation cases found matching the active filters.
                    </td>
                  </tr>
                ) : (
                  cases.map((c) => {
                    const isSelected = selectedCase?.id === c.id;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCase(c)}
                        className={`transition-colors cursor-pointer group ${
                          isSelected
                            ? 'bg-blue-50/70 border-l-4 border-l-blue-600'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Case ID */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                            {c.id}
                          </span>
                          {c.is_demo && (
                            <span className="block text-[9px] text-amber-600 font-medium">DEMO</span>
                          )}
                        </td>

                        {/* Investigation */}
                        <td className="py-3 px-3 min-w-[140px] max-w-[200px]">
                          <div className="font-medium text-slate-800 text-xs line-clamp-2 leading-snug">
                            {c.title}
                          </div>
                        </td>

                        {/* Suspect Account */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            {c.suspect_account}
                          </span>
                        </td>

                        {/* Exposure */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-semibold text-xs text-slate-900">
                            {c.exposure}
                          </span>
                        </td>

                        {/* Severity */}
                        <td className="py-3 px-2 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight uppercase ${
                              c.severity === 'CRITICAL'
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : c.severity === 'HIGH'
                                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                : c.severity === 'MEDIUM'
                                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {c.severity}
                          </span>
                        </td>

                        {/* Assigned Officer */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-600 text-xs">
                          {c.assigned_officer}
                        </td>

                        {/* Last Activity */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                          {c.last_activity}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-2 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[11px] font-medium leading-none ${
                              c.status === 'Under Investigation'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : c.status === 'Evidence Review'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : c.status === 'Escalated to LEA'
                                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCase(c);
                            }}
                            title="View Case Docket"
                            className="p-1.5 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-600 transition-colors shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing {cases.length > 0 ? (page - 1) * limit + 1 : 0}–
              {Math.min(page * limit, totalCases)} of {totalCases} cases
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white font-bold text-xs shadow-xs">
                {page}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* RIGHT COLUMN: CASE DETAILS DRAWER (Exact Reference Match)         */}
        {/* =============================================================== */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
          {selectedCase ? (
            <div className="flex flex-col">
              {/* 1. Dark Navy Header Banner */}
              <div className="bg-[#0B1528] text-white px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-200">
                    Case Details
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  title="Close Drawer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Case Identification & Severity */}
              <div className="p-5 border-b border-slate-100 bg-white">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Red Shield with White Dagger/Cross */}
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                      <Shield className="w-4 h-4 fill-red-500/20" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        {selectedCase.id}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                      selectedCase.severity === 'CRITICAL'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : selectedCase.severity === 'HIGH'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}
                  >
                    {selectedCase.severity}
                  </span>
                </div>

                <div className="mt-2 font-medium text-xs text-slate-700 leading-snug">
                  {selectedCase.title}
                </div>

                {selectedCase.is_demo && (
                  <div className="mt-2.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-md text-[10px] text-amber-800 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>DEMO DATA / SYNTHETIC CASE CANDIDATE</span>
                  </div>
                )}
              </div>

              {/* 3. Navigation Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50/50 text-xs font-semibold px-4">
                {(['Overview', 'Milestones', 'Evidence', 'Activity Log'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-3 transition-colors relative cursor-pointer ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                    {tab === 'Evidence' && (
                      <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full">
                        {selectedCase.evidence_count || selectedCase.evidence_items?.length || 0}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* 4. Tab Contents */}
              <div className="p-5 space-y-4">
                {/* ---------------- OVERVIEW TAB ---------------- */}
                {activeTab === 'Overview' && (
                  <div className="space-y-4">
                    {/* Case Overview */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-800">Case Overview</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {selectedCase.overview ||
                            'Large-scale mule account network detected in Chennai with suspicious fund movements across multiple accounts.'}
                        </p>
                      </div>
                    </div>

                    {/* Complaint Summary */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-800">Complaint Summary</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {selectedCase.complaint_summary ||
                            'Multiple victims reported unauthorized debits linked to suspect accounts operated from Chennai region.'}
                        </p>
                      </div>
                    </div>

                    {/* 2x2 Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {/* Box 1: Suspect Account(s) */}
                      <div className="bg-slate-50/90 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                          <Building2 className="w-3 h-3 text-blue-500" />
                          <span>Suspect Account(s)</span>
                        </div>
                        <div className="text-xs font-mono font-bold text-slate-900 mt-1 truncate">
                          {selectedCase.linked_accounts || selectedCase.suspect_account}
                        </div>
                      </div>

                      {/* Box 2: Linked Mobile */}
                      <div className="bg-slate-50/90 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                          <Smartphone className="w-3 h-3 text-blue-500" />
                          <span>Linked Mobile</span>
                        </div>
                        <div className="text-xs font-mono font-bold text-slate-900 mt-1 truncate">
                          {selectedCase.linked_mobile || '+91 98765 43210'}
                        </div>
                      </div>

                      {/* Box 3: Assigned Investigator */}
                      <div className="bg-slate-50/90 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                          <User className="w-3 h-3 text-blue-500" />
                          <span>Assigned Investigator</span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 mt-1 truncate">
                          {selectedCase.assigned_officer}
                        </div>
                      </div>

                      {/* Box 4: Case Status */}
                      <div className="bg-slate-50/90 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                          <Activity className="w-3 h-3 text-blue-500" />
                          <span>Case Status</span>
                        </div>
                        <div className="text-xs font-bold text-blue-600 mt-1 truncate">
                          {selectedCase.status}
                        </div>
                      </div>
                    </div>

                    {/* Key Milestones (Vertical Timeline with connected line) */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-slate-800">Key Milestones</h4>
                        <button
                          onClick={() => setShowAddMilestoneModal(true)}
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Step
                        </button>
                      </div>

                      <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-300">
                        {(selectedCase.milestones && selectedCase.milestones.length > 0
                          ? selectedCase.milestones
                          : [
                              { date: '24 Nov 2025, 14:20', text: 'Complaint Received', status: 'completed' },
                              { date: '24 Nov 2025, 15:05', text: 'Case Assigned', status: 'completed' },
                              { date: '24 Nov 2025, 16:30', text: 'Evidence Collected', status: 'completed' },
                              { date: '24 Nov 2025, 18:42', text: 'Investigation In Progress', status: 'current' }
                            ]
                        ).map((m, idx) => (
                          <div key={idx} className="relative flex items-center justify-between text-xs">
                            <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-[8px] font-bold shadow-xs">
                              ✓
                            </div>
                            <span className="font-mono text-slate-500 text-[11px]">{m.date}</span>
                            <span className="font-medium text-slate-800 text-right ml-2 text-xs">
                              — {m.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Evidence References */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                        <Paperclip className="w-4 h-4 text-blue-600" />
                        <span>Evidence Files ({selectedCase.evidence_count || 3})</span>
                      </div>
                      {selectedCase.evidence_verified !== false ? (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] flex items-center gap-1">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-full font-bold text-[10px]">
                          CSV Reference
                        </span>
                      )}
                    </div>

                    {/* View Case Dossier Action Button */}
                    <button
                      onClick={() => setShowDossierModal(true)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Case Dossier →</span>
                    </button>
                  </div>
                )}

                {/* ---------------- MILESTONES TAB ---------------- */}
                {activeTab === 'Milestones' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">Investigation Lifecycle Timeline</h4>
                      <button
                        onClick={() => setShowAddMilestoneModal(true)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Record Milestone
                      </button>
                    </div>

                    <div className="space-y-3 divide-y divide-slate-100 text-xs">
                      {(selectedCase.milestones || []).map((m, idx) => (
                        <div key={idx} className="pt-2 flex items-start gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800">{m.text}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{m.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ---------------- EVIDENCE TAB ---------------- */}
                {activeTab === 'Evidence' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">
                        Registered Case Evidence ({selectedCase.evidence_items?.length || 0})
                      </h4>
                      {onNavigate && (
                        <button
                          onClick={() => onNavigate('evidence-management')}
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          Evidence Manager <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {(selectedCase.evidence_items || []).map((ev, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              {ev.name}
                            </span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                              {ev.size}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono break-all">
                            SHA-256: {ev.sha256}
                          </div>
                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <span className="text-slate-500">Type: {ev.type}</span>
                            <span className="text-emerald-700 font-semibold">
                              {ev.verified ? '✓ Chain of Custody Intact' : 'CSV Row Reference'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ---------------- ACTIVITY LOG TAB ---------------- */}
                {activeTab === 'Activity Log' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">
                        Case Activity Audit Trail
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {selectedCase.activity_log?.length || 0} Events Logged
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {(selectedCase.activity_log || []).map((act, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-slate-200/70 bg-slate-50/70 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              {act.activity_id}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {act.activity_timestamp.replace('T', ' ').slice(0, 16)}
                            </span>
                          </div>
                          <div className="font-semibold text-slate-800 text-xs">
                            {act.activity_type}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {act.description}
                          </p>
                          <div className="text-[10px] text-slate-400 pt-0.5">
                            Actor: <span className="font-medium text-slate-700">{act.actor}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select an investigation case on the left table to inspect docket details.
            </div>
          )}
        </div>
      </div>

      {/* =============================================================== */}
      {/* MODAL 1: CREATE INVESTIGATION CASE                               */}
      {/* =============================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-scale-up">
            <div className="bg-[#0B1528] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Initiate New Cyber Investigation Docket</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Investigation Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operation DarkFlow: Chennai Mule Ring Syndicate"
                  value={newCaseData.title}
                  onChange={(e) => setNewCaseData({ ...newCaseData, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Primary Suspect Account *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AC78456"
                    value={newCaseData.suspect_account}
                    onChange={(e) => setNewCaseData({ ...newCaseData, suspect_account: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Linked Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={newCaseData.linked_mobile}
                    onChange={(e) => setNewCaseData({ ...newCaseData, linked_mobile: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Potential Exposure
                  </label>
                  <input
                    type="text"
                    value={newCaseData.exposure}
                    onChange={(e) => setNewCaseData({ ...newCaseData, exposure: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={newCaseData.severity}
                    onChange={(e) => setNewCaseData({ ...newCaseData, severity: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Officer</label>
                  <select
                    value={newCaseData.assigned_officer}
                    onChange={(e) => setNewCaseData({ ...newCaseData, assigned_officer: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  >
                    <option value="Rajesh Kumar">Rajesh Kumar</option>
                    <option value="Ananya Sharma">Ananya Sharma</option>
                    <option value="Vikramaditya Sen">Vikramaditya Sen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Case Overview</label>
                <textarea
                  rows={2}
                  placeholder="Overview of illicit fund movement and network syndicates..."
                  value={newCaseData.overview}
                  onChange={(e) => setNewCaseData({ ...newCaseData, overview: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Complaint Summary</label>
                <textarea
                  rows={2}
                  placeholder="Summary of 1930 Helpline or FIU alert..."
                  value={newCaseData.complaint_summary}
                  onChange={(e) => setNewCaseData({ ...newCaseData, complaint_summary: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering Docket...' : 'Create Investigation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* MODAL 2: ADD MILESTONE STEP                                     */}
      {/* =============================================================== */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Add Milestone Step</h3>
              <button
                onClick={() => setShowAddMilestoneModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Milestone Action / Decision
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Bank response received; debit lien confirmed under Section 102 CrPC"
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddMilestoneModal(false)}
                className="px-3 py-1.5 border border-slate-200 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMilestone}
                disabled={!newMilestoneText.trim() || isSubmitting}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg disabled:opacity-50"
              >
                Save Milestone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* MODAL 3: FULL FIU CASE DOSSIER (Court-Admissible Viewer)        */}
      {/* =============================================================== */}
      {showDossierModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-up">
            {/* Dossier Header */}
            <div className="bg-[#0B1528] text-white p-6 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-blue-400">
                    CYBER POLICE FORENSIC DOSSIER
                  </div>
                  <h2 className="text-lg font-extrabold text-white">
                    {selectedCase.id}: {selectedCase.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-slate-700">
              {/* Statutory Notice Banner */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    Section 102 CrPC / Section 106 BNSS Compliant Evidentiary Record
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Prepared for FIU-IND submission & Judicial Magistrate court proceedings.
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                  Evidence Verified
                </span>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Suspect Account</div>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                    {selectedCase.suspect_account}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Exposure Amount</div>
                  <div className="text-sm font-bold text-red-600 mt-0.5">
                    {selectedCase.exposure}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Investigating Officer</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    {selectedCase.assigned_officer}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Severity Level</div>
                  <div className="text-xs font-extrabold text-red-600 mt-0.5">
                    {selectedCase.severity}
                  </div>
                </div>
              </div>

              {/* Case Findings */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Forensic Intelligence Summary</h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed space-y-2">
                  <p><strong>Overview:</strong> {selectedCase.overview}</p>
                  <p><strong>Complaint Narrative:</strong> {selectedCase.complaint_summary}</p>
                  <p>
                    <strong>Algorithmic Correlation:</strong> Graph relationship engine identified rapid pass-through mule behaviour across secondary accounts ({selectedCase.linked_accounts || 'N/A'}) with coordinated IP geolocation clusters.
                  </p>
                </div>
              </div>

              {/* Milestones in Dossier */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Chronological Milestones</h4>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {(selectedCase.milestones || []).map((m, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-500">{m.date}</span>
                      <span className="font-semibold text-slate-800">{m.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {onNavigate && (
                    <>
                      <button
                        onClick={() => {
                          setShowDossierModal(false);
                          onNavigate('money-trail');
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                      >
                        Inspect Money Trail →
                      </button>
                      <button
                        onClick={() => {
                          setShowDossierModal(false);
                          onNavigate('google-maps');
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                      >
                        View Tactical Map →
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / Export PDF
                  </button>
                  <button
                    onClick={() => setShowDossierModal(false)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md shadow-blue-500/20"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
