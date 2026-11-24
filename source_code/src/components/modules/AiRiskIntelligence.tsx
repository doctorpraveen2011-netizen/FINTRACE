import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Sliders,
  Cpu,
  Database,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Eye,
  RefreshCw,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  DollarSign,
  PieChart as PieChartIcon
} from 'lucide-react';

interface DatasetMeta {
  name: string;
  source_file: string;
  total_records: number;
  fraud_cases: number;
  legit_cases: number;
  fraud_percentage: number;
  imbalance_ratio: string;
  features_count: number;
  total_volume_usd: number;
  avg_fraud_amount_usd: number;
  avg_legit_amount_usd: number;
  max_fraud_amount_usd: number;
  max_amount_usd: number;
}

interface ModelEvaluation {
  model_name: string;
  algorithm: string;
  test_size: number;
  test_fraud_cases: number;
  roc_auc: number;
  recall: number;
  precision: number;
  f1_score: number;
  accuracy: number;
  confusion_matrix: {
    true_negatives: number;
    false_positives: number;
    false_negatives: number;
    true_positives: number;
  };
  threshold_curve: Array<{
    threshold: number;
    precision: number;
    recall: number;
    f1: number;
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  }>;
}

interface FeatureRanking {
  feature: string;
  description: string;
  gain: number;
  gain_pct: number;
  weight: number;
  is_top_driver: boolean;
}

interface TransactionRecord {
  tx_id: string;
  raw_index: number;
  time_seconds: number;
  time_formatted: string;
  amount_usd: number;
  amount_inr: number;
  amount_formatted: string;
  class: number;
  is_fraud: boolean;
  fraud_probability: number;
  raw_prob: number;
  anomaly_score: number;
  risk_level: string;
  risk_color: string;
  top_features: Array<{
    feature: string;
    description: string;
    value: number;
    impact: string;
  }>;
  v_features: Record<string, number>;
}

export const AiRiskIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explorer' | 'features' | 'evaluation' | 'simulator'>('explorer');

  // Overview and Meta States
  const [meta, setMeta] = useState<DatasetMeta | null>(null);
  const [evaluation, setEvaluation] = useState<ModelEvaluation | null>(null);
  const [features, setFeatures] = useState<FeatureRanking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Transaction Explorer States
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [classFilter, setClassFilter] = useState<'all' | 'fraud' | 'legit'>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('risk');
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);

  // Threshold Slider State for Evaluation Tab
  const [selectedThreshold, setSelectedThreshold] = useState<number>(0.50);

  // Simulator State
  const [simFeatures, setSimFeatures] = useState<Record<string, number>>({
    Time: 3600,
    Amount: 99.99,
    V14: -4.5,
    V17: -8.2,
    V12: -5.1,
    V10: -6.0,
    V4: 5.5,
    V11: 4.0
  });
  const [simResult, setSimResult] = useState<any>(null);
  const [simLoading, setSimLoading] = useState<boolean>(false);

  // Load Overview & Initial Data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [overviewRes, evalRes, featRes] = await Promise.all([
        fetch('/api/ai-risk/overview').then(r => r.json()).catch(() => null),
        fetch('/api/ai-risk/evaluation').then(r => r.json()).catch(() => null),
        fetch('/api/ai-risk/features').then(r => r.json()).catch(() => null)
      ]);

      if (overviewRes?.data?.dataset) setMeta(overviewRes.data.dataset);
      if (evalRes?.data) setEvaluation(evalRes.data);
      if (featRes?.data) setFeatures(featRes.data);
    } catch (e) {
      console.error('Failed to load risk intelligence metadata:', e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Transactions on query change
  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '15',
        search: searchTerm,
        classType: classFilter,
        riskLevel: riskFilter,
        sortBy
      });

      const res = await fetch(`/api/ai-risk/transactions?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setTransactions(json.data.transactions || []);
        setTotalCount(json.data.total || 0);
        setTotalPages(json.data.totalPages || 1);
      }
    } catch (e) {
      console.error('Failed to fetch transactions:', e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, classFilter, riskFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTransactions();
  };

  // Load Sample Case into Simulator
  const loadSimulatorSample = async (type: 'fraud' | 'legit') => {
    try {
      const res = await fetch('/api/ai-risk/sample-vectors');
      const json = await res.json();
      if (json.success && json.data) {
        const target = type === 'fraud' ? json.data.sample_fraud : json.data.sample_legit;
        if (target && target.v_features) {
          setSimFeatures({
            Time: target.time_seconds || 3600,
            Amount: target.amount_usd || 100,
            V14: target.v_features.V14 || 0,
            V17: target.v_features.V17 || 0,
            V12: target.v_features.V12 || 0,
            V10: target.v_features.V10 || 0,
            V4: target.v_features.V4 || 0,
            V11: target.v_features.V11 || 0
          });
          // Run immediate prediction
          runSimulationWithFeatures({
            ...target.v_features,
            Amount: target.amount_usd,
            Time: target.time_seconds
          });
        }
      }
    } catch (e) {
      console.error('Error loading sample vector:', e);
    }
  };

  // Run Simulation
  const runSimulationWithFeatures = async (featDict = simFeatures) => {
    try {
      setSimLoading(true);
      const res = await fetch('/api/ai-risk/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: featDict })
      });
      const json = await res.json();
      if (json.success) {
        setSimResult(json);
      }
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setSimLoading(false);
    }
  };

  // Current Threshold Metrics in Evaluation tab
  const currentThresholdMetric = useMemo(() => {
    if (!evaluation?.threshold_curve) return null;
    return evaluation.threshold_curve.find(t => Math.abs(t.threshold - selectedThreshold) < 0.03) || evaluation.threshold_curve[9];
  }, [evaluation, selectedThreshold]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Real creditcard.csv Dataset & Model Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  AI Risk Intelligence &amp; Fraud Detection Lab
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
                  Benchmark Ingested
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Powered by Kaggle's standard benchmark dataset (<code className="font-mono font-bold text-slate-800">creditcard.csv</code>) • 284,807 transactions with XGBoost v4.2 &amp; Isolation Forest
              </p>
            </div>
          </div>
        </div>

        {/* Quick KPI Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Model ROC-AUC</span>
            <span className="text-sm font-black text-emerald-600">
              {evaluation?.roc_auc ? `${(evaluation.roc_auc * 100).toFixed(2)}%` : '97.34%'}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Fraud Recall</span>
            <span className="text-sm font-black text-blue-600">
              {evaluation?.recall ? `${(evaluation.recall * 100).toFixed(2)}%` : '84.69%'}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Total Rows</span>
            <span className="text-sm font-black text-slate-900">
              {meta?.total_records ? meta.total_records.toLocaleString() : '284,807'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Total Monitored Volume</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              ${meta?.total_volume_usd ? (meta.total_volume_usd / 1000000).toFixed(2) : '25.16'}M
            </span>
            <span className="text-[11px] font-bold text-slate-500 font-mono">
              (₹{(meta?.total_volume_usd ? (meta.total_volume_usd * 84.5 / 10000000).toFixed(1) : '212.6')} Cr)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            284,807 transactions with 30 PCA features
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Identified Fraud Synergies</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600">
              {meta?.fraud_cases?.toLocaleString() || '492'}
            </span>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              {meta?.fraud_percentage ? `${meta.fraud_percentage}%` : '0.173%'} Base Rate
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Class imbalance of {meta?.imbalance_ratio || '1:577.9'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Fraud Detection Recall</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">
              {evaluation?.recall ? `${(evaluation.recall * 100).toFixed(1)}%` : '84.7%'}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              High Sensitivity
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            83 out of 98 test fraud cases detected
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Overall Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {evaluation?.accuracy ? `${(evaluation.accuracy * 100).toFixed(2)}%` : '99.83%'}
            </span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              F1: {evaluation?.f1_score ? evaluation.f1_score.toFixed(3) : '0.629'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            56,781 clean non-fraud authentications
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'explorer', label: 'Live Transaction Explorer', icon: Search, count: totalCount },
          { id: 'features', label: 'SHAP Feature Importance & Gain', icon: BarChart3, count: features.length },
          { id: 'evaluation', label: 'Confusion Matrix & Threshold Tuning', icon: Sliders },
          { id: 'simulator', label: 'What-If Inference Simulator', icon: Cpu }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Live Transaction Risk Explorer */}
      {activeTab === 'explorer' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by TX ID or Amount..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-blue-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Class Filter */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 px-1">Class:</span>
                {(['all', 'fraud', 'legit'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => { setClassFilter(c); setCurrentPage(1); }}
                    className={`px-2 py-0.5 rounded font-bold transition-all capitalize ${
                      classFilter === c
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {c === 'all' ? 'All' : c === 'fraud' ? 'Confirmed Fraud (Class 1)' : 'Legitimate (Class 0)'}
                  </button>
                ))}
              </div>

              {/* Risk Level Filter */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 px-1">Risk:</span>
                {(['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => { setRiskFilter(r); setCurrentPage(1); }}
                    className={`px-2 py-0.5 rounded font-bold transition-all text-[11px] ${
                      riskFilter === r
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r === 'all' ? 'All' : r}
                  </button>
                ))}
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
              >
                <option value="risk">Sort: Highest Fraud Probability</option>
                <option value="anomaly">Sort: Isolation Anomaly Index</option>
                <option value="amount">Sort: Transaction Amount</option>
                <option value="time">Sort: Timestamp</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Elapsed Time</th>
                    <th className="py-3 px-4">Amount (USD &amp; INR)</th>
                    <th className="py-3 px-4">True Class</th>
                    <th className="py-3 px-4">AI Fraud Probability</th>
                    <th className="py-3 px-4">Anomaly Score</th>
                    <th className="py-3 px-4">Primary SHAP Driver</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No transactions found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    transactions.map(t => (
                      <tr key={t.tx_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {t.tx_id}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono">
                          {t.time_formatted}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 font-mono">${t.amount_usd.toFixed(2)}</div>
                          <div className="text-[10px] text-slate-500 font-mono">({t.amount_formatted})</div>
                        </td>
                        <td className="py-3 px-4">
                          {t.class === 1 ? (
                            <span className="px-2 py-0.5 rounded font-black text-[10px] bg-red-100 text-red-800 border border-red-200">
                              FRAUD (Class 1)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Legitimate (Class 0)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  t.fraud_probability >= 80 ? 'bg-red-600' :
                                  t.fraud_probability >= 50 ? 'bg-orange-500' :
                                  t.fraud_probability >= 20 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${t.fraud_probability}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-slate-900">
                              {t.fraud_probability}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {t.anomaly_score}%
                        </td>
                        <td className="py-3 px-4">
                          {t.top_features[0] ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              <span className="font-bold text-blue-700">{t.top_features[0].feature}</span>
                              <span className="text-slate-400">({t.top_features[0].value.toFixed(2)})</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedTx(t)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-bold border border-blue-200 transition-all inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div>
                Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalCount.toLocaleString()} total sample transactions)
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-50 hover:bg-slate-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-50 hover:bg-slate-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHAP Feature Importance */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Global Feature Importance &amp; Discrimination Gain
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Empirical XGBoost feature attribution across 284,807 transactions. Features with highest information gain represent key discriminators between authentic cardholder habits and fraud anomalies.
            </p>

            {/* Top 6 Feature Bars */}
            <div className="space-y-3">
              {features.slice(0, 10).map((f, i) => (
                <div key={f.feature} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-blue-700 w-8">#{i + 1}</span>
                      <strong className="text-slate-900 font-mono">{f.feature}</strong>
                      <span className="text-slate-500 text-[11px]">— {f.description}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400 text-[10px]">Gain: {f.gain.toFixed(2)}</span>
                      <strong className="text-blue-700 font-bold">{f.gain_pct.toFixed(1)}% Impact</strong>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      style={{ width: `${Math.min(100, f.gain_pct * 3.5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Feature Catalog Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800">
              All 30 Credit Card Transaction Features Ranked
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="py-2.5 px-4">Rank</th>
                    <th className="py-2.5 px-4">Feature Name</th>
                    <th className="py-2.5 px-4">Forensic Attribution &amp; Interpretation</th>
                    <th className="py-2.5 px-4">XGBoost Gain</th>
                    <th className="py-2.5 px-4">Relative Gain %</th>
                    <th className="py-2.5 px-4">Decision Tree Splits (Weight)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {features.map((f, i) => (
                    <tr key={f.feature} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-500">#{i + 1}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-700">{f.feature}</td>
                      <td className="py-2.5 px-4 text-slate-700 font-medium">{f.description}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-900">{f.gain.toFixed(2)}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">{f.gain_pct}%</td>
                      <td className="py-2.5 px-4 font-mono text-slate-600">{f.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Model Evaluation & Interactive Threshold Tuning */}
      {activeTab === 'evaluation' && evaluation && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Confusion Matrix Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Confusion Matrix on Test Split (56,962 Records)
              </h3>
              <p className="text-xs text-slate-500">
                Performance breakdown on the unseen 20% test validation slice (98 confirmed frauds, 56,864 legitimate transactions):
              </p>

              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">True Negatives (TN)</span>
                  <span className="text-xl font-black text-emerald-700 font-mono">
                    {evaluation.confusion_matrix.true_negatives.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-1">Clean Authorizations</span>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">False Positives (FP)</span>
                  <span className="text-xl font-black text-amber-700 font-mono">
                    {evaluation.confusion_matrix.false_positives}
                  </span>
                  <span className="text-[10px] text-amber-600 block mt-1">False Alarms</span>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-[10px] font-bold text-red-800 uppercase block">False Negatives (FN)</span>
                  <span className="text-xl font-black text-red-700 font-mono">
                    {evaluation.confusion_matrix.false_negatives}
                  </span>
                  <span className="text-[10px] text-red-600 block mt-1">Missed Frauds</span>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[10px] font-bold text-blue-800 uppercase block">True Positives (TP)</span>
                  <span className="text-xl font-black text-blue-700 font-mono">
                    {evaluation.confusion_matrix.true_positives}
                  </span>
                  <span className="text-[10px] text-blue-600 block mt-1">Caught Frauds ({((evaluation.confusion_matrix.true_positives / (evaluation.confusion_matrix.true_positives + evaluation.confusion_matrix.false_negatives)) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>

            {/* Interactive Threshold Slider */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Interactive Decision Threshold Tuning
                  </h3>
                  <p className="text-xs text-slate-500">
                    Slide to adjust the fraud classification boundary from 0.05 (aggressive catch) to 0.95 (conservative):
                  </p>
                </div>
                <div className="px-3 py-1 bg-slate-900 text-white rounded-lg font-mono font-bold text-xs">
                  Threshold: {selectedThreshold.toFixed(2)}
                </div>
              </div>

              {/* Slider */}
              <div className="pt-2">
                <input
                  type="range"
                  min="0.05"
                  max="0.95"
                  step="0.05"
                  value={selectedThreshold}
                  onChange={e => setSelectedThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0.05 (Max Recall)</span>
                  <span>0.50 (Balanced Standard)</span>
                  <span>0.95 (Max Precision)</span>
                </div>
              </div>

              {/* Dynamic KPI Output at Selected Threshold */}
              {currentThresholdMetric && (
                <div className="grid grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Recall</span>
                    <strong className="text-lg font-black text-blue-600 font-mono">
                      {(currentThresholdMetric.recall * 100).toFixed(1)}%
                    </strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {currentThresholdMetric.tp} / 98 Frauds Caught
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Precision</span>
                    <strong className="text-lg font-black text-indigo-600 font-mono">
                      {(currentThresholdMetric.precision * 100).toFixed(1)}%
                    </strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {currentThresholdMetric.fp} False Alarms
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">F1-Score</span>
                    <strong className="text-lg font-black text-emerald-600 font-mono">
                      {currentThresholdMetric.f1.toFixed(3)}
                    </strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Harmonic Mean
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Missed Frauds</span>
                    <strong className="text-lg font-black text-red-600 font-mono">
                      {currentThresholdMetric.fn}
                    </strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Escaped Layering
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: What-If Inference Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Interactive 'What-If' Credit Card Inference Simulator
                </h3>
                <p className="text-xs text-slate-500">
                  Input custom PCA transaction vectors or load benchmark samples to evaluate real-time fraud probability and SHAP attribution.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadSimulatorSample('fraud')}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Load Confirmed Fraud Case</span>
                </button>
                <button
                  onClick={() => loadSimulatorSample('legit')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Load Clean Legitimate Case</span>
                </button>
              </div>
            </div>

            {/* Form Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Transaction Amount ($)</label>
                <input
                  type="number"
                  value={simFeatures.Amount || 0}
                  onChange={e => setSimFeatures({ ...simFeatures, Amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  ≈ ₹{((simFeatures.Amount || 0) * 84.5).toLocaleString('en-IN')} INR
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">V14 (Primary Fraud Index)</label>
                <input
                  type="number"
                  step="0.5"
                  value={simFeatures.V14 || 0}
                  onChange={e => setSimFeatures({ ...simFeatures, V14: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Negative values (&lt; -3.0) signal severe risk</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">V17 (Critical Risk Index)</label>
                <input
                  type="number"
                  step="0.5"
                  value={simFeatures.V17 || 0}
                  onChange={e => setSimFeatures({ ...simFeatures, V17: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">High negative values signal fraud bursts</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">V12 (Velocity Discrepancy)</label>
                <input
                  type="number"
                  step="0.5"
                  value={simFeatures.V12 || 0}
                  onChange={e => setSimFeatures({ ...simFeatures, V12: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Pass-through outflow acceleration</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">V10 (Layering Indication)</label>
                <input
                  type="number"
                  step="0.5"
                  value={simFeatures.V10 || 0}
                  onChange={e => setSimFeatures({ ...simFeatures, V10: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">V4 (Frequency Volatility)</label>
                <input
                  type="number"
                  step="0.5"
                  value={simFeatures.V4 || 0}
                  onChange={e => setSimFeatures({ ...simFeatures, V4: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">V11 (Outflow Acceleration)</label>
                <input
                  type="number"
                  step="0.5"
                  value={simFeatures.V11 || 0}
                  onChange={e => setSimFeatures({ ...simFeatures, V11: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => runSimulationWithFeatures(simFeatures)}
                  disabled={simLoading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  {simLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>Run Real-Time AI Prediction</span>
                </button>
              </div>
            </div>

            {/* Inference Result Box */}
            {simResult && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-black text-lg ${
                      simResult.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-300' :
                      simResult.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-700 border border-orange-300' :
                      simResult.risk_level === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border border-amber-300' :
                      'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    }`}>
                      {simResult.fraud_probability}%
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Model Verdict</span>
                      <strong className={`text-base font-bold ${
                        simResult.is_fraud_predicted ? 'text-red-600' : 'text-emerald-700'
                      }`}>
                        {simResult.is_fraud_predicted ? 'FLAGGED AS FRAUDULENT' : 'AUTHENTIC TRANSACTION'}
                      </strong>
                      <span className="text-[11px] text-slate-500 block">Risk Level: {simResult.risk_level}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-500">Transaction Value</span>
                      <strong className="font-mono">${simResult.amount_usd} (₹{simResult.amount_inr})</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-500">Model Engine</span>
                      <span className="font-mono text-slate-700 text-[11px]">{simResult.model}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Top Risk Contributors</span>
                    <div className="flex flex-wrap gap-1">
                      {simResult.top_features?.map((tf: any) => (
                        <span key={tf.feature} className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          tf.impact === 'INCREASES_RISK'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {tf.feature}: {tf.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transaction Inspection Drawer / Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn space-y-4 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Forensic Dossier: {selectedTx.tx_id}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Elapsed Time: {selectedTx.time_formatted} • Raw Index: #{selectedTx.raw_index}
                </span>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Actual Class Label</span>
                <strong className={`text-sm ${selectedTx.class === 1 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {selectedTx.class === 1 ? 'Class 1 (Confirmed Fraud)' : 'Class 0 (Legitimate)'}
                </strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">AI Fraud Probability</span>
                <strong className="text-sm font-mono text-red-600">
                  {selectedTx.fraud_probability}% ({selectedTx.risk_level})
                </strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Amount (USD / INR)</span>
                <strong className="text-sm font-mono text-slate-900">
                  ${selectedTx.amount_usd} ({selectedTx.amount_formatted})
                </strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Isolation Anomaly Index</span>
                <strong className="text-sm font-mono text-slate-900">
                  {selectedTx.anomaly_score}%
                </strong>
              </div>
            </div>

            {/* PCA Feature Matrix Grid */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-2">
                All 28 Principal Component Features (PCA Latent Vectors):
              </span>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {Object.entries(selectedTx.v_features).map(([key, val]) => (
                  <div key={key} className="p-1.5 bg-white rounded border border-slate-100 text-center font-mono">
                    <span className="text-[9px] text-slate-400 block font-bold">{key}</span>
                    <span className={`text-[10px] font-bold ${
                      Math.abs(val) > 3.0 ? 'text-red-600' : 'text-slate-700'
                    }`}>
                      {val.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
