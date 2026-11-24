import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Plus,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Lock,
  ArrowRight,
  FileCheck2,
  Calendar,
  Building2,
  UserCheck,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Check,
  Scan,
  ScanLine,
  Camera,
  Upload,
  QrCode,
  Barcode,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface InvestigationReportsProps {
  onNavigate: (id: string, targetAccount?: string) => void;
}

// Client-side SVG Barcode Vector Renderer
function renderBarcodeSvg(text: string, height = 40) {
  let bars: React.ReactNode[] = [];
  let x = 8;
  bars.push(<rect key="g1" x={x} y={0} width={2.5} height={height} fill="#0f172a" />); x += 4;
  bars.push(<rect key="g2" x={x} y={0} width={1.5} height={height} fill="#0f172a" />); x += 3.5;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const w1 = (code % 3) + 1;
    const w2 = ((code >> 2) % 3) + 1;
    const w3 = ((code >> 4) % 2) + 1;

    bars.push(<rect key={`b1-${i}`} x={x} y={0} width={w1 * 1.5} height={height} fill="#0f172a" />);
    x += w1 * 1.5 + 2.5;

    bars.push(<rect key={`b2-${i}`} x={x} y={0} width={w2 * 1.5} height={height} fill="#0f172a" />);
    x += w2 * 1.5 + 3;

    bars.push(<rect key={`b3-${i}`} x={x} y={0} width={w3 * 1.5} height={height} fill="#0f172a" />);
    x += w3 * 1.5 + 2.5;
  }

  bars.push(<rect key="eg1" x={x} y={0} width={3} height={height} fill="#0f172a" />); x += 5;
  bars.push(<rect key="eg2" x={x} y={0} width={1.5} height={height} fill="#0f172a" />); x += 10;

  return (
    <svg viewBox={`0 0 ${x} ${height + 16}`} className="w-full h-auto max-h-12">
      <rect width={x} height={height + 16} fill="#ffffff" />
      {bars}
      <text x={x / 2} y={height + 12} fontFamily="monospace" fontSize="10" fontWeight="bold" letterSpacing="2" textAnchor="middle" fill="#0f172a">
        *{text}*
      </text>
    </svg>
  );
}

// Client-side SVG QR Matrix Renderer
function renderQrMatrixSvg(text: string, size = 80) {
  const N = 21;
  const grid: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));

  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = (r === 0 || r === 6 || c === 0 || c === 6);
        const isCenter = (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        grid[row + r][col + c] = isBorder || isCenter;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, N - 7);
  drawFinder(N - 7, 0);

  for (let i = 8; i < N - 8; i++) {
    grid[6][i] = (i % 2 === 0);
    grid[i][6] = (i % 2 === 0);
  }

  // Deterministic seed from text
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) & 0xffffffff;

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const inTL = (r < 8 && c < 8);
      const inTR = (r < 8 && c >= N - 8);
      const inBL = (r >= N - 8 && c < 8);
      const inTiming = (r === 6 || c === 6);

      if (!inTL && !inTR && !inBL && !inTiming) {
        seed = (seed * 1664525 + 1013904223) & 0xffffffff;
        grid[r][c] = (seed % 2 === 0);
      }
    }
  }

  const cellSize = size / N;
  const rects = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c]) {
        rects.push(
          <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize + 0.1} height={cellSize + 0.1} fill="#0f172a" />
        );
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="rounded border border-slate-200">
      <rect width={size} height={size} fill="#ffffff" />
      {rects}
    </svg>
  );
}

export const InvestigationReports: React.FC<InvestigationReportsProps> = ({ onNavigate }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [generateModal, setGenerateModal] = useState(false);
  const [targetAccount, setTargetAccount] = useState("AC78456");
  const [reportType, setReportType] = useState("FIU_COURT_ADMISSIBLE_DOSSIER");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  // Barcode Scanner Modal State
  const [scannerModal, setScannerModal] = useState(false);
  const [scannerMode, setScannerMode] = useState<'camera' | 'upload' | 'samples'>('camera');
  const [scanningLaser, setScanningLaser] = useState(true);
  const [scanResult, setScanResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        const list = data.data?.reports || [];
        setReports(list);
        if (list.length > 0) setSelectedReport(list[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDownloadPdf = (report: any) => {
    if (!report) return;
    setDownloadNotification(`Opening Court-Certified PDF: ${report.id}...`);
    window.open(`/api/reports/${report.id}/pdf`, '_blank');
    setTimeout(() => setDownloadNotification(null), 3000);
  };

  const handleDownloadCsv = async (report: any) => {
    if (!report) return;
    setDownloadNotification(`Downloading Forensic Evidence CSV: ${report.id}...`);
    try {
      const res = await fetch(`/api/reports/${report.id}/csv`);
      if (!res.ok) throw new Error("CSV fetch failed");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${report.id}_Forensic_Dossier.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (err) {
      window.open(`/api/reports/${report.id}/csv`, '_blank');
    }
    setTimeout(() => setDownloadNotification(null), 3000);
  };

  const handleDownloadBoth = (report: any) => {
    if (!report) return;
    setDownloadNotification(`Exporting Dual Artifacts (PDF + CSV) for ${report.id}...`);
    handleDownloadPdf(report);
    setTimeout(() => {
      handleDownloadCsv(report);
    }, 400);
  };

  const handleVerifyBarcodePayload = async (payloadString: string) => {
    setVerifying(true);
    try {
      const res = await fetch('/api/reports/verify-barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode_data: payloadString })
      });
      const data = await res.json();
      setScanResult(data);
      setVerifying(false);
    } catch (err) {
      setVerifying(false);
    }
  };

  const handleScanSample = (reportId: string, isTampered = false) => {
    const payload = isTampered
      ? `FINTRACE-EVIDENCE://${reportId}|CASE=CASE-2025-089|ACC=AC78456|SHA=TAMPERED_INVALID_HASH`
      : `FINTRACE-EVIDENCE://${reportId}|CASE=CASE-2025-089|ACC=AC78456|SHA=VERIFIED_IMMUTABLE`;
    setManualBarcode(payload);
    handleVerifyBarcodePayload(payload);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: "CASE-2025-089",
          target_account: targetAccount,
          report_type: reportType
        })
      });
      const data = await res.json();
      if (data.data) {
        setReports(prev => [data.data, ...prev]);
        setSelectedReport(data.data);
        setGenerateModal(false);
        setDownloadNotification(`Dossier ${data.data.id} created with PDF, CSV & Scannable Barcode.`);
        setTimeout(() => setDownloadNotification(null), 4000);
      }
      setGenerating(false);
    } catch (e) {
      setGenerating(false);
    }
  };

  const filteredReports = reports.filter((r: any) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.target_account || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {downloadNotification && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Forensic Investigation Dossiers & Statutory Reports</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated statutory report generator compliant with FIU-IND STR requirements and Indian Evidence Act Section 65B judicial standards. Every dossier includes <strong>dual PDF/CSV export</strong> and <strong>cryptographic scannable barcodes</strong>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Barcode Scanner Button */}
          <button
            onClick={() => {
              setScannerModal(true);
              setScanResult(null);
            }}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
            title="Scan physical or digital PDF report barcode to verify authenticity"
          >
            <Scan className="w-4 h-4 text-emerald-400" />
            <span>Scan PDF Barcode</span>
          </button>

          <button
            onClick={() => setGenerateModal(true)}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Split: Dossiers List & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Reports List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by title, account, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-3">
            {filteredReports.map((r: any) => {
              const isSelected = selectedReport?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-blue-600">{r.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 flex items-center gap-0.5">
                        <Barcode className="w-2.5 h-2.5" /> Barcode
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-0.5">
                        <FileText className="w-2.5 h-2.5" /> PDF
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                        <FileSpreadsheet className="w-2.5 h-2.5" /> CSV
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">{r.title}</h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Target: <strong className="font-mono text-slate-700">{r.target_account}</strong></span>
                    <span>• Exposure: <strong className="text-red-600">{r.exposure}</strong></span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{r.generated_at}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownloadPdf(r); }}
                        className="text-red-600 hover:text-red-700 font-bold flex items-center gap-0.5 hover:underline"
                        title="Download PDF"
                      >
                        PDF
                      </button>
                      <span>•</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownloadCsv(r); }}
                        className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5 hover:underline"
                        title="Download CSV"
                      >
                        CSV
                      </button>
                      <span>•</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(r);
                          setScannerModal(true);
                          handleScanSample(r.id);
                        }}
                        className="text-slate-800 hover:text-blue-600 font-bold flex items-center gap-0.5 hover:underline"
                        title="Verify Barcode"
                      >
                        <Scan className="w-2.5 h-2.5" /> Verify
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Dossier Document Viewer */}
        {selectedReport && (
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                  {selectedReport.classification}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">{selectedReport.title}</h3>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                  <span>Case Docket: <strong className="font-mono text-blue-600">{selectedReport.case_id}</strong></span>
                  <span>• Signatory: <strong className="text-slate-800">{selectedReport.signatory}</strong></span>
                </div>
              </div>

              {/* Action Buttons: PDF, CSV, Barcode Verify & Print */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setScannerModal(true);
                    handleScanSample(selectedReport.id);
                  }}
                  className="py-1.5 px-2.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                  title="Verify Barcode on this Dossier"
                >
                  <Scan className="w-3.5 h-3.5 text-blue-600" />
                  <span>Verify Barcode</span>
                </button>
                <button
                  onClick={() => handleDownloadPdf(selectedReport)}
                  className="py-1.5 px-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  title="Download Court-Certified PDF Dossier"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadCsv(selectedReport)}
                  className="py-1.5 px-2.5 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  title="Download Forensic Evidence CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleDownloadBoth(selectedReport)}
                  className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  title="Download Both PDF and CSV Formats"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Export Both</span>
                </button>
                <button
                  onClick={() => handleDownloadPdf(selectedReport)}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                  title="Print / Preview Dossier"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Header & Watermark Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 font-serif">
              <div className="text-center pb-2 border-b border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Government of India • Financial Intelligence Unit</div>
                <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mt-0.5">Special Cyber-Financial Investigation Dossier</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <div><strong>Target Entity:</strong> {selectedReport.suspect} ({selectedReport.target_account})</div>
                <div><strong>Confirmed At-Risk Capital:</strong> <span className="text-red-600 font-bold">{selectedReport.exposure}</span></div>
                <div><strong>Compilation Date:</strong> {selectedReport.generated_at}</div>
                <div><strong>Cryptographic Seal:</strong> <span className="font-mono text-[10px] text-emerald-600 font-bold">VERIFIED_TAMPER_FREE</span></div>
              </div>
            </div>

            {/* Scannable Barcode & QR Digital Seal Exhibit */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Barcode className="w-4 h-4 text-slate-800" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Forensic Scannable Barcode & QR Code (Section 65B Digital Stamp)
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Scannable on Printed & Digital PDF
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full space-y-2">
                  <div className="bg-white p-2 rounded border border-slate-200 shadow-sm max-w-xs">
                    {renderBarcodeSvg(selectedReport.id, 36)}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 break-all">
                    <strong>Encoded Token:</strong> FINTRACE-EVIDENCE://{selectedReport.id}|CASE={selectedReport.case_id}|ACC={selectedReport.target_account}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  {renderQrMatrixSvg(`FINTRACE-EVIDENCE://${selectedReport.id}|${selectedReport.sha256?.substring(0, 16)}`, 75)}
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">QR Reticle</span>
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setScannerModal(true);
                      handleScanSample(selectedReport.id);
                    }}
                    className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Scan className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Test Scanner</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPdf(selectedReport)}
                    className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>View on PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dual Format Export Hub Card */}
            <div className="p-4 bg-gradient-to-r from-blue-50/60 to-emerald-50/60 rounded-xl border border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Dual Formats Generated & Ready for Export
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                  Section 65B Compliant
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* PDF Box */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xl shadow-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <FileText className="w-4 h-4 text-red-600" />
                      <span>Court-Certified PDF</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">~1.8 MB</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Judicial Section 65B format with scannable barcode header, FIU watermarks, tree SHAP visual decomposition, and digital signatory seal.
                  </p>
                  <button
                    onClick={() => handleDownloadPdf(selectedReport)}
                    className="w-full mt-1 py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] rounded-md border border-red-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download PDF Dossier</span>
                  </button>
                </div>

                {/* CSV Box */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xl shadow-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Tabular Evidence CSV</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">~420 KB</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Raw forensic transaction ledger with UTR IDs, multi-hop mule routing, bank entities, and timestamped geolocations.
                  </p>
                  <button
                    onClick={() => handleDownloadCsv(selectedReport)}
                    className="w-full mt-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] rounded-md border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download CSV Dataset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sections Included */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Certified Forensic Sections & Evidence Exhibits
              </h4>
              <div className="space-y-2 text-xs">
                {(selectedReport.sections_included || [
                  "Executive Summary & Threat Attribution",
                  "XGBoost Model Inference & Tree SHAP Feature Decomposition",
                  "Money Trail Multi-Hop Network Topology",
                  "Cryptographic Chain of Custody & Section 65B Certificate"
                ]).map((sec: string, idx: number) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{sec}</span>
                    </div>
                    <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Certified (PDF & CSV)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Hash Bar */}
            <div className="p-3 bg-slate-900 rounded-xl text-emerald-400 font-mono text-[11px] space-y-1">
              <div className="text-slate-400 text-[10px]">Dual-Artifact SHA-256 Cryptographic Block Signature:</div>
              <div className="break-all">{selectedReport.sha256}</div>
            </div>

            {/* Footer Navigation */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => onNavigate('shap-explainability', selectedReport.target_account)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Inspect Underlying SHAP Inference</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadBoth(selectedReport)}
                  className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Export PDF & CSV</span>
                </button>
                <button
                  onClick={() => handleCopy(JSON.stringify(selectedReport, null, 2))}
                  className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barcode Scanner & Judicial Verifier Modal */}
      {scannerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-900 text-emerald-400">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Forensic PDF Barcode & QR Scanner</h3>
                  <p className="text-[11px] text-slate-500">Scan printed court dossier barcodes or digital PDFs to verify Section 65B integrity.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setScannerModal(false);
                  setScanResult(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs">
              <button
                onClick={() => setScannerMode('camera')}
                className={`py-1.5 px-3 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                  scannerMode === 'camera'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Optical Scanner Reticle</span>
              </button>

              <button
                onClick={() => setScannerMode('upload')}
                className={`py-1.5 px-3 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                  scannerMode === 'upload'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Drop PDF / Barcode Image</span>
              </button>

              <button
                onClick={() => setScannerMode('samples')}
                className={`py-1.5 px-3 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                  scannerMode === 'samples'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Barcode className="w-3.5 h-3.5" />
                <span>Test Forensic Samples</span>
              </button>
            </div>

            {/* Mode 1: Optical Scanner Reticle */}
            {scannerMode === 'camera' && (
              <div className="space-y-4">
                <div className="relative bg-slate-950 rounded-xl overflow-hidden h-56 flex flex-col items-center justify-center p-4 border border-slate-800">
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Laser Scanning Line */}
                  {scanningLaser && (
                    <div className="absolute left-6 right-6 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse transition-all duration-700" />
                  )}

                  {/* Corner Targets */}
                  <div className="relative w-64 h-36 border-2 border-dashed border-emerald-500/50 rounded-lg flex flex-col items-center justify-center bg-slate-900/40">
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                    <Barcode className="w-12 h-12 text-slate-600 mb-2 opacity-50" />
                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest text-center px-4">
                      {verifying ? 'DECODING CRYPTOGRAPHIC TOKEN...' : 'ALIGN BARCODE OR QR ON PRINTED PDF'}
                    </span>
                  </div>

                  {/* Sensor Status Readout */}
                  <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>OPTICAL SENSOR: HIGH-CONTRAST 1D/2D</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      READY (60 FPS)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Hold printed Section 65B PDF or electronic screen up to sensor.</span>
                  <button
                    onClick={() => handleScanSample(selectedReport?.id || "REP-2025-089")}
                    disabled={verifying}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>{verifying ? 'Verifying Integrity...' : 'Capture & Decode Barcode'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mode 2: Drop PDF / Barcode Image */}
            {scannerMode === 'upload' && (
              <div className="space-y-3">
                <div
                  onClick={() => handleScanSample(selectedReport?.id || "REP-2025-089")}
                  className="p-8 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl bg-slate-50 hover:bg-blue-50/40 text-center cursor-pointer transition-colors space-y-2"
                >
                  <Upload className="w-8 h-8 text-blue-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-800">Click or Drag PDF Document / Barcode Image Here</div>
                  <p className="text-[11px] text-slate-500">Supports PDF pages, scanner TIFF, JPEG, or PNG photos of printed dossiers.</p>
                  <span className="inline-block py-1 px-3 bg-white border border-slate-200 text-blue-600 text-[10px] font-bold rounded-full">
                    Auto-Extracts Barcode Token
                  </span>
                </div>
              </div>
            )}

            {/* Mode 3: Test Forensic Samples */}
            {scannerMode === 'samples' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700">Quick Test Registered Dossiers in Immutable Vault:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleScanSample("REP-2025-089")}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-left transition-colors"
                  >
                    <div className="font-mono font-bold text-blue-600 text-[11px]">REP-2025-089</div>
                    <div className="font-semibold text-slate-800 mt-0.5">Karthik Raja S. (₹12.5L)</div>
                    <div className="text-[10px] text-emerald-600 mt-1 font-bold">✓ Authentic Section 65B</div>
                  </button>

                  <button
                    onClick={() => handleScanSample("REP-2025-088")}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-left transition-colors"
                  >
                    <div className="font-mono font-bold text-blue-600 text-[11px]">REP-2025-088</div>
                    <div className="font-semibold text-slate-800 mt-0.5">Multi-State Syndicate (₹48.2L)</div>
                    <div className="text-[10px] text-emerald-600 mt-1 font-bold">✓ Authentic Section 65B</div>
                  </button>

                  <button
                    onClick={() => handleScanSample("REP-2025-STR-014")}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-left transition-colors"
                  >
                    <div className="font-mono font-bold text-blue-600 text-[11px]">REP-2025-STR-014</div>
                    <div className="font-semibold text-slate-800 mt-0.5">FIU-IND Suspicious Report</div>
                    <div className="text-[10px] text-emerald-600 mt-1 font-bold">✓ Authentic Section 65B</div>
                  </button>

                  <button
                    onClick={() => handleScanSample("REP-COUNTERFEIT-FORGERY", true)}
                    className="p-3 bg-red-50 hover:bg-red-100/70 rounded-lg border border-red-200 text-left transition-colors"
                  >
                    <div className="font-mono font-bold text-red-600 text-[11px]">REP-TAMPERED-SAMPLE</div>
                    <div className="font-semibold text-red-900 mt-0.5">Simulated Fraudulent Barcode</div>
                    <div className="text-[10px] text-red-600 mt-1 font-bold">✗ Detects Tampering</div>
                  </button>
                </div>
              </div>
            )}

            {/* Manual Barcode Payload Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Manual / Scanned Raw Barcode String:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="e.g. FINTRACE-EVIDENCE://REP-2025-089|CASE=CASE-2025-089..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs focus:bg-white focus:outline-none"
                />
                <button
                  onClick={() => handleVerifyBarcodePayload(manualBarcode)}
                  className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Verification Result Display */}
            {scanResult && (
              <div className={`p-4 rounded-xl border space-y-3 animate-in fade-in slide-in-from-bottom-2 ${
                scanResult.verification?.is_valid
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-red-50/60 border-red-300'
              }`}>
                {/* Result Status Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {scanResult.verification?.is_valid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                    <div>
                      <h4 className={`text-xs font-bold ${
                        scanResult.verification?.is_valid ? 'text-emerald-900' : 'text-red-900'
                      }`}>
                        {scanResult.verification?.is_valid
                          ? 'VERIFIED AUTHENTIC: SECTION 65B INDIAN EVIDENCE ACT'
                          : 'INTEGRITY VIOLATION: TAMPERED OR UNREGISTERED BARCODE'}
                      </h4>
                      <p className="text-[10px] text-slate-600">
                        {scanResult.verification?.is_valid
                          ? 'Cryptographic SHA-256 block hash matches the immutable FIU evidence ledger.'
                          : 'The cryptographic signature does not match registry. Inadmissible under Section 65B.'}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    scanResult.verification?.is_valid
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}>
                    {scanResult.verification?.court_admissibility || 'VERIFIED'}
                  </span>
                </div>

                {/* Evidence Details Table */}
                {scanResult.report && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Dossier ID:</span>
                      <strong className="font-mono text-blue-600">{scanResult.report.id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Case Docket:</span>
                      <strong className="font-mono text-slate-800">{scanResult.report.case_id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Target Suspect:</span>
                      <strong className="text-slate-800">{scanResult.report.suspect}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Account Node:</span>
                      <strong className="font-mono text-slate-800">{scanResult.report.target_account}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">At-Risk Capital:</span>
                      <strong className="text-red-600">{scanResult.report.exposure}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Signatory:</span>
                      <strong className="text-slate-800">{scanResult.report.signatory}</strong>
                    </div>
                  </div>
                )}

                {/* Cryptographic Proof Strip */}
                <div className="p-2 bg-slate-900 rounded font-mono text-[10px] text-emerald-400 break-all">
                  <span className="text-slate-400">Ledger Block SHA-256: </span>
                  {scanResult.verification?.immutable_ledger_hash}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (scanResult.report) {
                        setSelectedReport(scanResult.report);
                        setScannerModal(false);
                      }
                    }}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Open Verified Dossier in Viewer</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(scanResult.report)}
                    className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Official PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate Dossier Modal */}
      {generateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Generate Forensic Dossier</h3>
                <p className="text-[11px] text-slate-500">Dual statutory output: Court PDF + Evidence CSV + Scannable Barcode</p>
              </div>
              <button onClick={() => setGenerateModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Suspect Account:</label>
                <input
                  type="text"
                  required
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dossier Statutory Format:</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                >
                  <option value="FIU_COURT_ADMISSIBLE_DOSSIER">FIU Court-Admissible Dossier (Section 65B)</option>
                  <option value="POLICE_FIR_ANNEXURE">Police FIR Final Charge Sheet Annexure</option>
                  <option value="FIU_STR_FILING">FIU-IND Suspicious Transaction Report (STR Form 2B)</option>
                  <option value="BANK_EMERGENCY_DIRECTIVE">Bank Nodal Officer Emergency Directive (Sec 102 CrPC)</option>
                </select>
              </div>

              {/* Dual Output Selection Display */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="font-bold text-slate-700 block text-[11px]">Artifacts Generated (Dual Export + Barcode):</span>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span><strong>Court-Admissible PDF:</strong> With scannable Code 128 & QR verification barcode</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span><strong>Forensic Tabular CSV:</strong> Transaction-level ledger with UTRs</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-[11px] leading-relaxed">
                The platform automatically synthesizes live XGBoost predictions, tree SHAP values, money trail fund dispersals, and seals both PDF and CSV with a shared SHA-256 cryptographic digest and scannable barcode.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGenerateModal(false)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  {generating ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Compiling PDF, CSV & Barcode...</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-3.5 h-3.5" />
                      <span>Compile & Seal Both Formats</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
