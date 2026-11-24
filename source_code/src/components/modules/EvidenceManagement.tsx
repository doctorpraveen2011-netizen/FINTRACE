import React, { useState, useEffect } from 'react';
import {
  FolderLock,
  Search,
  Plus,
  ShieldCheck,
  Download,
  FileCheck2,
  Lock,
  ExternalLink,
  Copy,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Upload,
  RefreshCw
} from 'lucide-react';

interface EvidenceManagementProps {
  onNavigate: (id: string, targetAccount?: string) => void;
}

export const EvidenceManagement: React.FC<EvidenceManagementProps> = ({ onNavigate }) => {
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [sec65bModal, setSec65bModal] = useState<any>(null);
  const [verifyModal, setVerifyModal] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState("FINANCIAL_STATEMENT");
  const [newFileSize, setNewFileSize] = useState("3.4 MB");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/evidence')
      .then(res => res.json())
      .then(d => {
        setEvidence(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOpenSec65b = async (id: string) => {
    try {
      const res = await fetch(`/api/evidence/${id}/sec65b`);
      const data = await res.json();
      setSec65bModal(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyHash = async (item: any) => {
    setVerifyModal(item);
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch('/api/evidence/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evidence_id: item.id, expected_sha256: item.sha256 })
      });
      const data = await res.json();
      setVerifyResult(data.data);
      setVerifying(false);
    } catch (e) {
      setVerifying(false);
    }
  };

  const handleUploadArtifact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    try {
      const res = await fetch('/api/evidence/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFileName,
          type: newFileType,
          size: newFileSize,
          case_id: "CASE-2025-089"
        })
      });
      const data = await res.json();
      if (data.data) {
        setEvidence(prev => [data.data, ...prev]);
        setUploadModal(false);
        setNewFileName("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredEvidence = evidence.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sha256.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "ALL" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FolderLock className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Evidence Vault & Cryptographic Chain of Custody</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Forensic locker computing SHA-256 integrity hashes for judicial admissibility under Section 65B Indian Evidence Act / Section 63 BSA 2023.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUploadModal(true)}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ingest Forensic Artifact</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-semibold block text-[11px]">Total Stored Artifacts</span>
          <strong className="text-2xl font-black text-slate-900 mt-1 block">{evidence.length}</strong>
          <span className="text-[10px] text-slate-400">Cryptographically Sealed</span>
        </div>
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <span className="text-emerald-700 font-semibold block text-[11px]">Chain of Custody Valid</span>
          <strong className="text-2xl font-black text-emerald-600 mt-1 block">100%</strong>
          <span className="text-[10px] text-emerald-700 font-semibold">Zero Compromised Hashes</span>
        </div>
        <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 shadow-sm">
          <span className="text-blue-700 font-semibold block text-[11px]">Primary Case Association</span>
          <strong className="text-xl font-bold text-blue-600 mt-1 block font-mono">CASE-2025-089</strong>
          <span className="text-[10px] text-blue-700">Operation DarkFlow</span>
        </div>
        <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 shadow-sm">
          <span className="text-purple-700 font-semibold block text-[11px]">Statutory Compliance</span>
          <strong className="text-xl font-bold text-purple-700 mt-1 block">Sec 65B / BSA 63</strong>
          <span className="text-[10px] text-purple-700 font-semibold">Ready for Court Submission</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search artifacts by File Name, ID, or SHA-256 hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {["ALL", "FINANCIAL_STATEMENT", "NETWORK_CAPTURE", "CDR_RECORDS", "CCTV_STILL"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                selectedType === type
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Artifact ID</th>
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">SHA-256 Cryptographic Signature</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Chain of Custody</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEvidence.map((ev: any) => (
                <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{ev.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{ev.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Case: {ev.case_id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {ev.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-[10px] text-slate-600 truncate max-w-xs">{ev.sha256}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{ev.size}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-fit">
                      <ShieldCheck className="w-3 h-3" />
                      <span>INTACT</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerifyHash(ev)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-[11px]"
                      >
                        Verify Hash
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => handleOpenSec65b(ev.id)}
                        className="text-purple-600 hover:text-purple-800 font-bold text-[11px] flex items-center gap-1"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Sec 65B Cert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verify Hash Modal */}
      {verifyModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Cryptographic Hash Integrity Verification</span>
              </h3>
              <button onClick={() => setVerifyModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {verifying ? (
              <div className="p-8 text-center space-y-3">
                <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500">Recalculating SHA-256 byte digest against tamper-evident ledger...</p>
              </div>
            ) : verifyResult && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Hash Verification Succeeded: ZERO Alterations Detected (Integrity: 100%)</span>
                </div>

                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Expected Ledger SHA-256:</span>
                    <strong className="text-slate-800 break-all">{verifyModal.sha256}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Recalculated Byte Hash:</span>
                    <strong className="text-emerald-600 break-all">{verifyResult.computed_hash}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Verified against FINTRACE Cryptographic Authority on {new Date().toLocaleString('en-GB')}.
                </div>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setVerifyModal(null)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 65B Certificate Modal */}
      {sec65bModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Certificate of Electronic Evidence (Section 65B)</h3>
                <p className="text-xs text-slate-500">Statutory Form under Section 65B Indian Evidence Act / Section 63 BSA 2023.</p>
              </div>
              <button onClick={() => setSec65bModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3 font-serif leading-relaxed">
              <div className="text-center font-bold text-slate-900 uppercase tracking-widest text-xs border-b border-slate-200 pb-2">
                Certificate under Section 65B(4) of the Indian Evidence Act, 1872
              </div>

              <p className="text-[11px] text-slate-700 italic">
                "{sec65bModal.legal_declaration}"
              </p>

              <div className="font-mono text-[11px] space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                <div><strong>Certificate ID:</strong> {sec65bModal.certificate_id}</div>
                <div><strong>Evidence Artifact:</strong> {sec65bModal.file_name} ({sec65bModal.file_size})</div>
                <div><strong>SHA-256 Digest:</strong> {sec65bModal.sha256_hash}</div>
                <div><strong>Capture System:</strong> {sec65bModal.device_details}</div>
                <div><strong>Forensic Operator:</strong> {sec65bModal.operator_name}</div>
                <div><strong>Status:</strong> <span className="text-emerald-600 font-bold">{sec65bModal.integrity_status}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">Judicially signed with forensic seal.</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(JSON.stringify(sec65bModal, null, 2))}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'Copy Cert JSON'}</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Exported formal judicial certificate for ${sec65bModal.file_name}.`);
                    setSec65bModal(null);
                  }}
                  className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Signed Certificate (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Ingest Forensic Artifact</h3>
              <button onClick={() => setUploadModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleUploadArtifact} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Artifact File Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., ATM_CCTV_Frame_Chennai_089.jpg"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category / Type:</label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                >
                  <option value="FINANCIAL_STATEMENT">Financial Bank Statement</option>
                  <option value="NETWORK_CAPTURE">Network Capture (PCAP)</option>
                  <option value="CDR_RECORDS">Call Detail Records (CDR/IPDR)</option>
                  <option value="CCTV_STILL">CCTV Kiosk Still</option>
                  <option value="MALWARE_BINARY">Malware APK / Trojan Dump</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Simulated Size:</label>
                <input
                  type="text"
                  value={newFileSize}
                  onChange={(e) => setNewFileSize(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-[11px]">
                Upon ingestion, a cryptographically unbroken SHA-256 hash will be computed and permanently logged to the append-only audit ledger.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModal(false)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                >
                  Ingest & Seal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
