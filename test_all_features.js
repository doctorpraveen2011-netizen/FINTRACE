const fs = require('fs');
const vm = require('vm');

const mockApiCode = fs.readFileSync('mock-api.js', 'utf8');

// Set up mock window and URL
const sandbox = {
  window: {},
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Date: Date,
  Math: Math,
  JSON: JSON,
  URL: URL,
  URLSearchParams: URLSearchParams,
  Response: globalThis.Response,
  location: new URL('http://localhost:3000/')
};
sandbox.window.location = sandbox.location;
sandbox.window.fetch = async (url) => {
  throw new Error('Original fetch should not be called: ' + url);
};

vm.createContext(sandbox);
vm.runInContext(mockApiCode, sandbox);

const fetch = sandbox.window.fetch;

async function runTests() {
  console.log('--- Testing 100% of FINTRACE Forensic Modules & Endpoints ---');
  let passed = 0;
  let failed = 0;

  async function check(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. Live Google Maps
  await check('1.1 Maps: Live Tactical Pins & Layer Schema', async () => {
    const res = await fetch('/api/maps/live-pins?account_no=acc_00083575&limit=350');
    const json = await res.json();
    if (!json.success || !json.data || !json.data.pins || !json.data.counts_by_layer || !json.data.focal_center) {
      throw new Error('Invalid Live Pins Response: ' + JSON.stringify(json));
    }
    const pin = json.data.pins[0];
    if (!pin.layer || !pin.type || !pin.cadastral || !pin.lat || !pin.lng) {
      throw new Error('Pin schema missing required fields: ' + JSON.stringify(pin));
    }
    if (json.data.counts_by_layer.layer_a < 1) throw new Error('Missing layer_a counts');
  });

  await check('1.2 Maps: Reverse Geocoding Click Inspector', async () => {
    const res = await fetch('/api/maps/reverse-geocode?lat=13.0604&lng=80.2496');
    const json = await res.json();
    if (!json.success || !json.data.address || !json.data.jurisdiction) {
      throw new Error('Invalid Reverse Geocode');
    }
  });

  await check('1.3 Maps: Gazetteer City & Account Autocomplete', async () => {
    const res = await fetch('/api/maps/geosearch?q=Chennai');
    const json = await res.json();
    if (!json.success || !Array.isArray(json.results) || json.results.length === 0) {
      throw new Error('Invalid Geosearch results');
    }
  });

  await check('1.4 Maps: Police Statutory Notice Generation', async () => {
    const res = await fetch('/api/police/statutory-notice', {
      method: 'POST',
      body: JSON.stringify({ account_no: 'acc_00083575', bank: 'Axis Bank', amount: '₹14,80,000' })
    });
    const json = await res.json();
    if (!json.success || !json.data.notice_text) throw new Error('Invalid Statutory Notice');
  });

  await check('1.5 Maps: Tactical Patrol Intercept Dispatch', async () => {
    const res = await fetch('/api/maps/patrol/dispatch', {
      method: 'POST',
      body: JSON.stringify({ pin_id: 'PIN-ATM-09', account_no: 'acc_00083575' })
    });
    const json = await res.json();
    if (!json.success || !json.docket.unit_callsign || !json.docket.patrol_start_coords) {
      throw new Error('Invalid Patrol Dispatch response');
    }
  });

  await check('1.6 Maps: Live Grid Node Debit Freeze', async () => {
    const res = await fetch('/api/maps/freeze', {
      method: 'POST',
      body: JSON.stringify({ account_no: 'acc_00083575' })
    });
    const json = await res.json();
    if (!json.success || !json.message) throw new Error('Invalid Freeze Response');
  });

  await check('1.7 Maps: Encrypted Radio Contact Transmission', async () => {
    const res = await fetch('/api/maps/patrol/radio-contact', {
      method: 'POST',
      body: JSON.stringify({ unit_callsign: 'CHEETAH-1', message: 'Test Radio' })
    });
    const json = await res.json();
    if (!json.success || !json.transmission.ack) throw new Error('Invalid Radio response');
  });

  await check('1.8 Maps: All-Points Bulletin Flash Broadcast', async () => {
    const res = await fetch('/api/maps/patrol/apb-alert', { method: 'POST', body: JSON.stringify({}) });
    const json = await res.json();
    if (!json.success) throw new Error('Invalid APB response');
  });

  // 2. Real-Time Alerts
  await check('2.1 Real-Time Alerts Feed (8 items matching badge)', async () => {
    const res = await fetch('/api/alerts');
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data) || json.data.length !== 8) {
      throw new Error('Alerts must contain exactly 8 items matching badge');
    }
  });

  await check('2.2 Real-Time Alert Triage', async () => {
    const res = await fetch('/api/alerts/ALT-78456/triage', {
      method: 'POST',
      body: JSON.stringify({ action: 'INVESTIGATING' })
    });
    const json = await res.json();
    if (!json.success) throw new Error('Alert triage failed');
  });

  // 3. Relationship Graph
  await check('3.1 Relationship Graph Multi-Entity Network', async () => {
    const res = await fetch('/api/relationship-graph');
    const json = await res.json();
    if (!json.success || !json.data.nodes || !json.data.links || !json.data.centrality_metrics) {
      throw new Error('Invalid Relationship Graph structure');
    }
    const node = json.data.nodes[0];
    if (!node.type || !node.community || !node.degree) {
      throw new Error('Node missing required fields');
    }
  });

  // 4. Tactical AI & Telecom Workbench
  await check('4.1 Tactical AI: Telecom Meta Overview & Operator KPIs', async () => {
    const res = await fetch('/api/telecom/overview');
    const json = await res.json();
    if (!json.success || !json.data.monitored_msisdn || !Array.isArray(json.data.kpi_by_operator) || json.data.kpi_by_operator.length === 0) {
      throw new Error('Invalid Telecom Overview: missing kpi_by_operator');
    }
  });

  await check('4.2 Tactical AI: MSISDN Dossiers with Account & Bank', async () => {
    const res = await fetch('/api/telecom/dossiers');
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
      throw new Error('Invalid Telecom Dossiers');
    }
    const d = json.data[0];
    if (!d.account_no || !d.bank || !d.city || !d.msisdn) {
      throw new Error('Dossier missing account_no, bank, or city: ' + JSON.stringify(d));
    }
  });

  await check('4.3 Tactical AI: Model Retrain Endpoint (XGBoost Feature Gain)', async () => {
    const res = await fetch('/api/ai/train', { method: 'POST', body: JSON.stringify({ dataset: 'creditcard.csv' }) });
    const json = await res.json();
    if (!json.success || !json.data.evaluation_metrics.roc_auc || !Array.isArray(json.data.feature_importance)) {
      throw new Error('Invalid Model Retrain response: missing feature_importance');
    }
  });

  await check('4.4 Tactical AI: Tower CDR/IPDR Forensic Correlation & Calls History', async () => {
    const res = await fetch('/api/ai/cdr-ipdr', { method: 'POST', body: JSON.stringify({ target_account: 'acc_00083575' }) });
    const json = await res.json();
    if (!json.success || !json.data.tower_triangulation || !json.data.calls_history || !json.data.call_detail_records) {
      throw new Error('Invalid CDR correlation response: missing calls_history or call_detail_records');
    }
    if (!json.data.metrics || !json.data.metrics.fraud_severity_score) {
      throw new Error('Missing metrics.fraud_severity_score');
    }
  });

  await check('4.5 Tactical AI: Section 102 CrPC Bank Freeze Notice Generation', async () => {
    const res = await fetch('/api/investigations/bank-freeze-notice', {
      method: 'POST',
      body: JSON.stringify({ account_no: 'acc_00083575', bank: 'Axis Bank', amount: '₹14,80,000' })
    });
    const json = await res.json();
    if (!json.success || !json.data.statutory_text || !json.data.to_nodal_officer || !json.data.hash) {
      throw new Error('Invalid Freeze Notice generation');
    }
  });

  // 5. KYC Intelligence
  await check('5.1 KYC Profile & Radar Geometry Vector', async () => {
    const res = await fetch('/api/kyc?account_id=AC78456');
    const json = await res.json();
    if (!json.success || !json.data.radar_vector || !json.data.linked_accounts) throw new Error('Invalid KYC');
  });

  await check('5.2 KYC Interbank Ingested Fraud Reports', async () => {
    const res = await fetch('/api/kyc/reports?page=1&limit=6');
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data) || json.data.length === 0 || !json.total) {
      throw new Error('Invalid KYC Fraud Reports pagination');
    }
  });

  // 6. Mule Detection
  await check('6.1 Mule Detection Accounts & Funnel Metrics', async () => {
    const res = await fetch('/api/mules');
    const json = await res.json();
    if (!json.success || !json.accounts || !json.data.mule_accounts_detected) throw new Error('Invalid Mules');
  });

  // 7. Money Trail
  await check('7.1 Money Trail Topology Graph', async () => {
    const res = await fetch('/api/money-trail?account_no=acc_00083575');
    const json = await res.json();
    if (!json.success || !json.data.nodes || !json.data.edges) throw new Error('Invalid Trail');
  });

  // 8. AI Risk & SHAP
  await check('8.1 AI Risk Evaluation & ROC curve', async () => {
    const res = await fetch('/api/ai-risk/evaluation');
    const json = await res.json();
    if (!json.success || !json.data.roc_auc) throw new Error('Invalid AI Risk Eval');
  });

  // 9. Attack Intelligence
  await check('9.1 Attack Intel Syndicates & MITRE', async () => {
    const res = await fetch('/api/attack-intel');
    const json = await res.json();
    if (!json.success || !json.data.active_syndicates) throw new Error('Invalid Attack Intel');
  });

  // 10. Domain Intelligence
  await check('10.1 Domain Intelligence Phishing Radar', async () => {
    const res = await fetch('/api/domain-intel');
    const json = await res.json();
    if (!json.success || !json.data.flagged_domains) throw new Error('Invalid Domain Intel');
  });

  // 11. IP Intelligence
  await check('11.1 IP Intelligence & Impossible Travel', async () => {
    const res = await fetch('/api/ip-intel');
    const json = await res.json();
    if (!json.success || !json.data.flagged_ips) throw new Error('Invalid IP Intel');
  });

  // 12. Forensic Reports & PDF Artifacts
  await check('12.1 Reports: List Forensic Dossiers', async () => {
    const res = await fetch('/api/reports');
    const json = await res.json();
    if (!json.success || !json.data.reports || json.data.reports.length === 0) throw new Error('Invalid Reports response');
  });

  await check('12.2 Reports: Verify Cryptographic Barcode & Seal', async () => {
    const res = await fetch('/api/reports/verify-barcode', {
      method: 'POST',
      body: JSON.stringify({ barcode_data: 'FINTRACE-EVIDENCE://REP-2026-089A|CASE=CASE-2025-089|ACC=AC78456' })
    });
    const json = await res.json();
    if (!json.success || !json.valid || !json.report || !json.verification.immutable_ledger_hash) {
      throw new Error('Invalid Barcode Verification response');
    }
  });

  await check('12.3 Reports: Generate New Statutory Dossier', async () => {
    const res = await fetch('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ case_id: 'CASE-2026-089', target_account: 'acc_00083575', report_type: 'FIU_COURT_ADMISSIBLE_DOSSIER' })
    });
    const json = await res.json();
    if (!json.success || !json.data.id || !json.data.sha256) throw new Error('Invalid Dossier Generation response');
  });

  await check('12.4 Reports: Tabular Evidence CSV Export', async () => {
    const res = await fetch('/api/reports/REP-2026-089A/csv');
    const text = await res.text();
    if (!text.includes('Record_ID') || !text.includes('UTRNumber') && !text.includes('UTR_Number')) {
      throw new Error('Invalid CSV export response');
    }
  });

  // 13. Settings, SOC Operations, AWS DevOps & Python ML Service
  await check('13.1 Settings: Global Config, Model Thresholds & RBAC Directory', async () => {
    const res = await fetch('/api/settings');
    const json = await res.json();
    if (!json.success || !json.data.model_thresholds || !Array.isArray(json.data.users) || json.data.users.length === 0) {
      throw new Error('Invalid Settings response: missing model_thresholds or users');
    }
  });

  await check('13.2 Settings: SOC Operations Threat Incidents & SOAR Roster', async () => {
    const res = await fetch('/api/soc/operations');
    const json = await res.json();
    if (!json.success || !json.data.incidents || json.data.incidents.length === 0 || !json.data.soar_playbooks || !json.data.analyst_roster) {
      throw new Error('Invalid SOC operations response');
    }
  });

  await check('13.3 Settings: SOC Execute Containment Action', async () => {
    const res = await fetch('/api/soc/execute-containment', {
      method: 'POST',
      body: JSON.stringify({ incident_id: 'INC-8491', officer_name: 'Inspector Rajesh Kumar' })
    });
    const json = await res.json();
    if (!json.success || !json.message) throw new Error('Invalid SOC containment response');
  });

  await check('13.4 Settings: SOC Toggle SOAR Playbook', async () => {
    const res = await fetch('/api/soc/toggle-playbook', {
      method: 'POST',
      body: JSON.stringify({ playbook_id: 'PB-01' })
    });
    const json = await res.json();
    if (!json.success) throw new Error('Invalid SOAR toggle response');
  });

  await check('13.5 Settings: AWS DevOps Cloud Architecture & EKS Cluster', async () => {
    const res = await fetch('/api/devops/aws-cloud');
    const json = await res.json();
    if (!json.success || !json.data.infrastructure?.eks_cluster || !json.data.ci_cd_pipeline || !json.data.cloudwatch_logs) {
      throw new Error('Invalid AWS DevOps response');
    }
  });

  await check('13.6 Settings: AWS DevOps Canary Deployment & Region Switch', async () => {
    const resCanary = await fetch('/api/devops/trigger-canary', { method: 'POST' });
    const jsonCanary = await resCanary.json();
    if (!jsonCanary.success || !jsonCanary.canary?.version) throw new Error('Invalid Canary trigger');

    const resRegion = await fetch('/api/devops/switch-region', {
      method: 'POST',
      body: JSON.stringify({ region: 'ap-south-2' })
    });
    const jsonRegion = await resRegion.json();
    if (!jsonRegion.success) throw new Error('Invalid Region switch');
  });

  await check('13.7 Settings: Python ML Microservice Status & Real-time Inference', async () => {
    const resStatus = await fetch('/api/ml-service/status');
    const jsonStatus = await resStatus.json();
    if (!jsonStatus.success || !jsonStatus.data.connected) throw new Error('Invalid ML Status response');

    const resInfer = await fetch('/api/ml-service/infer', {
      method: 'POST',
      body: JSON.stringify({ amount: 1480000, velocity_1h: 12 })
    });
    const jsonInfer = await resInfer.json();
    if (!jsonInfer.success || !jsonInfer.data.fraud_probability || !jsonInfer.data.shap_contributions) {
      throw new Error('Invalid ML Inference response');
    }
  });

  console.log(`\n======================================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`======================================================`);

  if (failed > 0) process.exit(1);
}

runTests();
