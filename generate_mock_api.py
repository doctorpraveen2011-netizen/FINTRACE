# -*- coding: utf-8 -*-
"""
FINTRACE Master Mock API Generator
Generates a complete, authentic forensic mock dataset covering 100% of FINTRACE features.
"""

mock_code = r'''/**
 * FINTRACE - Unified Financial-Cyber Intelligence Platform
 * Comprehensive Forensic Intelligence Engine
 * 100% Feature Coverage: Tactical AI & CDR Workbench, Live Google Maps, Relationship Graph, KYC, Mule Detection, Money Trail, AI Risk, Attack Intel, Domain Intel, IP Intel, Real-Time Alerts.
 */
(function() {
  'use strict';
  console.log('[FINTRACE] Master Forensic Intelligence Engine Initializing...');

  // Helper response builder
  function jsonRes(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status: status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  // -------------------------------------------------------------
  // Master Datasets
  // -------------------------------------------------------------
  const MULE_ACCOUNTS = [
    {
      account_no: 'acc_00020535',
      holder_name: 'Ramesh Sharma (Proxy Conduit)',
      bank: 'Axis Bank',
      branch: 'Mount Road Branch, Chennai',
      mule_score: 94,
      risk_tier: 'CRITICAL',
      velocity_burst: '14 tx / 90s',
      pass_through_ratio: '99.8%',
      freeze_status: 'DEBIT_FROZEN',
      frozen: true,
      total_volume_inr: '₹12,50,000',
      turnover_24h: '₹12,50,000',
      channel: 'IMPS • RTGS',
      location: 'Chennai (South Zone)',
      typology: 'Rapid Pass-Through Relay',
      associated_case: 'CASE-2026-089',
      phone: '+91 98412 88412',
      pan: 'ABCPS1294F',
      upi_id: 'ramesh.conduit@axisbank',
      layer: 'LAYER_1'
    },
    {
      account_no: 'acc_00083575',
      holder_name: 'Farhan Zaidi (Layer-1 Conduit)',
      bank: 'Axis Bank',
      branch: 'Anna Salai Main Sector, Chennai',
      mule_score: 95,
      risk_tier: 'CRITICAL',
      velocity_burst: '16 tx / 90s',
      pass_through_ratio: '99.9%',
      freeze_status: 'ACTIVE',
      frozen: false,
      total_volume_inr: '₹14,80,000',
      turnover_24h: '₹14,80,000',
      channel: 'IMPS • UPI Fast',
      location: 'Chennai (Central Sector)',
      typology: 'Layer-1 Collection Hub',
      associated_case: 'CASE-2026-089',
      phone: '+91 98412 88412',
      pan: 'ABCPS1294F',
      upi_id: 'farhan.conduit@axisbank',
      layer: 'LAYER_1'
    },
    {
      account_no: 'AC78456',
      holder_name: 'Varun S. Proxy Hub',
      bank: 'Axis Bank',
      branch: 'Anna Salai Corporate Hub, Chennai',
      mule_score: 92,
      risk_tier: 'CRITICAL',
      velocity_burst: '12 tx / 120s',
      pass_through_ratio: '98.5%',
      freeze_status: 'DEBIT_FROZEN',
      frozen: true,
      total_volume_inr: '₹12,50,000',
      turnover_24h: '₹12,50,000',
      channel: 'Wire • IMPS',
      location: 'Chennai (Central Sector)',
      typology: 'Layer-1 Collection Hub',
      associated_case: 'CASE-2026-089',
      phone: '+91 98412 88412',
      pan: 'ABCPS1294F',
      upi_id: 'ac78456@axisbank',
      layer: 'LAYER_1'
    },
    {
      account_no: 'AC91823',
      holder_name: 'Karthik Enterprises (Shell Entity)',
      bank: 'HDFC Bank',
      branch: 'Anna Nagar West, Chennai',
      mule_score: 88,
      risk_tier: 'HIGH',
      velocity_burst: '9 tx / 180s',
      pass_through_ratio: '94.2%',
      freeze_status: 'ACTIVE',
      frozen: false,
      total_volume_inr: '₹34,80,000',
      turnover_24h: '₹6,00,000',
      channel: 'RTGS • Corporate Netbanking',
      location: 'Coimbatore, Tamil Nadu',
      typology: 'Layer-2 Transit Aggregator',
      associated_case: 'CASE-2026-088',
      phone: '+91 94451 22910',
      pan: 'AAACK4412M',
      upi_id: 'karthik.ent@hdfcbank',
      layer: 'LAYER_2'
    },
    {
      account_no: 'AC55412',
      holder_name: 'Sunil Kumar (Crypto OTC Mule)',
      bank: 'ICICI Bank',
      branch: 'Koramangala, Bengaluru',
      mule_score: 84,
      risk_tier: 'HIGH',
      velocity_burst: '11 tx / 150s',
      pass_through_ratio: '91.0%',
      freeze_status: 'ACTIVE',
      frozen: false,
      total_volume_inr: '₹18,20,000',
      turnover_24h: '₹6,50,000',
      channel: 'P2P • UPI Intermediary',
      location: 'Bengaluru, Karnataka',
      typology: 'Fast Payment Conduit',
      associated_case: 'CASE-2026-087',
      phone: '+91 91760 99411',
      pan: 'BKPSK9921E',
      upi_id: 'sunil.crypto@icici',
      layer: 'LAYER_2'
    },
    {
      account_no: 'AC44510',
      holder_name: 'Devi Trading Co. (Layer 3 Mule)',
      bank: 'State Bank of India',
      branch: 'Secunderabad Main, Hyderabad',
      mule_score: 79,
      risk_tier: 'HIGH',
      velocity_burst: '7 tx / 240s',
      pass_through_ratio: '88.5%',
      freeze_status: 'ACTIVE',
      frozen: false,
      total_volume_inr: '₹8,90,000',
      turnover_24h: '₹5,80,000',
      channel: 'NEFT • Branch Transfer',
      location: 'Hyderabad, Telangana',
      typology: 'Dormant Account Awakening',
      associated_case: 'CASE-2026-086',
      phone: '+91 97890 12345',
      pan: 'CCEPD8812K',
      upi_id: 'devi.trade@sbi',
      layer: 'LAYER_2'
    },
    {
      account_no: 'AC38192',
      holder_name: 'Kiosk #09 Cashout Mule',
      bank: 'Punjab National Bank',
      branch: 'Anna Nagar Kiosk ATM, Chennai',
      mule_score: 95,
      risk_tier: 'CRITICAL',
      velocity_burst: '18 card swipes / 60s',
      pass_through_ratio: '100%',
      freeze_status: 'DEBIT_FROZEN',
      frozen: true,
      total_volume_inr: '₹3,20,000',
      turnover_24h: '₹3,20,000',
      channel: 'ATM Cash Withdrawal',
      location: 'Chennai (Anna Nagar)',
      typology: 'Rapid Pass-Through Relay',
      associated_case: 'CASE-2026-089',
      phone: '+91 98841 00291',
      pan: 'DDFPK1192L',
      upi_id: 'kiosk09.cash@pnb',
      layer: 'LAYER_3'
    }
  ];

  // -------------------------------------------------------------
  // Telecom Dossiers (Specifically structured for TacticalAiWorkbench Switch Suspect Dropdown)
  // -------------------------------------------------------------
  const TELECOM_DOSSIERS = [
    {
      account_no: 'acc_00020535',
      bank: 'Axis Bank',
      city: 'Chennai (Mount Road)',
      holder_name: 'Ramesh Sharma (Proxy Conduit)',
      msisdn: '+91 98412 88412',
      imei: '864201048821940',
      imsi: '404450192841029',
      provider: 'Airtel 5G (Tamil Nadu Circle)',
      circle: 'Chennai Metro',
      home_location: 'Mount Road Cell ID 84102',
      active_tower_b_party_matches: ['+91 94451 22910', '+91 91760 99411'],
      risk_level: 'CRITICAL',
      suspect_name: 'Ramesh Sharma',
      call_count_24h: 42
    },
    {
      account_no: 'acc_00083575',
      bank: 'Axis Bank',
      city: 'Chennai (Anna Salai)',
      holder_name: 'Farhan Zaidi (Layer-1 Conduit)',
      msisdn: '+91 98412 88412',
      imei: '864201048821940',
      imsi: '404450192841029',
      provider: 'Airtel 5G (Tamil Nadu Circle)',
      circle: 'Chennai Metro',
      home_location: 'Anna Salai Cell ID 84102',
      active_tower_b_party_matches: ['+91 94451 22910'],
      risk_level: 'CRITICAL',
      suspect_name: 'Farhan Zaidi',
      call_count_24h: 38
    },
    {
      account_no: 'AC78456',
      bank: 'Axis Bank',
      city: 'Chennai (Anna Salai)',
      holder_name: 'Varun S. Proxy Hub',
      msisdn: '+91 98412 88412',
      imei: '864201048821940',
      imsi: '404450192841029',
      provider: 'Airtel 5G (Tamil Nadu Circle)',
      circle: 'Chennai Metro',
      home_location: 'Anna Salai Sector A',
      active_tower_b_party_matches: ['+91 94451 22910'],
      risk_level: 'CRITICAL',
      suspect_name: 'Varun S. Proxy Hub',
      call_count_24h: 31
    },
    {
      account_no: 'AC91823',
      bank: 'HDFC Bank',
      city: 'Coimbatore (Gandhipuram)',
      holder_name: 'Karthik Enterprises (Transit Mule)',
      msisdn: '+91 94451 22910',
      imei: '862961251404189',
      imsi: '404459697354961',
      provider: 'Jio True5G (TN Circle)',
      circle: 'Coimbatore District',
      home_location: 'Gandhipuram Cell ID 44102',
      active_tower_b_party_matches: ['+91 98412 88412'],
      risk_level: 'HIGH',
      suspect_name: 'Karthik Enterprises',
      call_count_24h: 19
    },
    {
      account_no: 'AC55412',
      bank: 'ICICI Bank',
      city: 'Bengaluru (Koramangala)',
      holder_name: 'Sunil Kumar (P2P Crypto Desk)',
      msisdn: '+91 91760 99411',
      imei: '869102948192019',
      imsi: '404451928374910',
      provider: 'Vi (Karnataka Circle)',
      circle: 'Bengaluru Metro',
      home_location: 'Koramangala Cell ID 19204',
      active_tower_b_party_matches: ['+91 98412 88412'],
      risk_level: 'HIGH',
      suspect_name: 'Sunil Kumar',
      call_count_24h: 27
    },
    {
      account_no: 'AC44510',
      bank: 'State Bank of India',
      city: 'Hyderabad (Secunderabad)',
      holder_name: 'Devi Trading Co. (Layer 3 Mule)',
      msisdn: '+91 97890 12345',
      imei: '860192849102941',
      imsi: '404458829102944',
      provider: 'Airtel 5G (AP/TS Circle)',
      circle: 'Hyderabad Metro',
      home_location: 'Secunderabad Cell ID 33012',
      active_tower_b_party_matches: ['+91 94451 22910'],
      risk_level: 'HIGH',
      suspect_name: 'Devi Trading Co.',
      call_count_24h: 14
    }
  ];

  // -------------------------------------------------------------
  // Live Google Maps Tactical Pins
  // -------------------------------------------------------------
  const MAP_PINS = [
    {
      id: 'PIN-MULE-20535',
      account_no: 'acc_00020535',
      holder_name: 'Ramesh Sharma (Proxy Conduit)',
      title: 'Mule Conduit acc_00020535',
      type: 'MULE_HUB',
      layer: 'LAYER_A',
      layer_name: 'Mule Account Hubs',
      typology: 'Rapid Pass-Through Relay',
      velocity_burst: '14 tx / 90s',
      pass_through_ratio: '99.8%',
      fan_in_senders: 14,
      fan_out_hops: 4,
      linked_phone: '+91 98412 88412',
      reported_by_institution: 'Axis Bank',
      cityName: 'Chennai',
      city: 'Chennai, Tamil Nadu',
      province: 'Tamil Nadu',
      zone: 'Chennai South Cyber Command',
      jurisdiction: 'Chennai Central Cyber Command',
      lat: 13.0604,
      lng: 80.2496,
      bank: 'Axis Bank',
      branch: 'Mount Road Corporate Branch',
      location_text: 'Plot 42, Anna Salai Commercial Corridor, Chennai',
      risk: 'CRITICAL',
      severity: 94,
      amount: '₹12,50,000',
      channel: 'IMPS • RTGS',
      telecom_bts: 'CHN-SALAI-BTS-042',
      freeze_status: 'DEBIT_FROZEN',
      timestamp: '2026-11-24 18:45:12',
      associated_case: 'CASE-2026-089',
      elevation: '14m ASL',
      street_address: 'Mount Road, Chennai',
      cross_street: 'Opp LIC Metro',
      target_branch_coords: { lat: 13.0604, lng: 80.2496 },
      target_account_no: 'acc_00020535',
      target_bank: 'Axis Bank',
      patrol_unit_callsign: 'CHEETAH-1',
      cadastral: {
        country: 'India',
        state_province: 'Tamil Nadu',
        cyber_zone: 'Chennai Cyber Command',
        district_tehsil: 'Chennai Central',
        town_sector: 'Mount Road Financial Enclave',
        postal_code: '600002',
        elevation: '14m ASL',
        banking_enclave: 'Anna Salai Corridor',
        street_address: 'Plot 42, Mount Road',
        cross_street: 'Opp. LIC Metro',
        building_footprint: 'Commercial RCC',
        cadastral_plot_id: 'TN-CHN-2026-BLK-8419',
        cctv_safe_city: 'CAM-TN-CHN-0914 (360° PTZ 4K Live)',
        police_beat: 'Beat No. 4',
        gps_inch_precision: { latitude: 13.0604, longitude: 80.2496, resolution_meters: 0.12, resolution_inches: 4.7 },
        escape_routes: [
          { corridor: 'Anna Salai Arterial', distance_m: 450, transit_car: '2.5 mins', intercept_prob: '88%', patrol: 'Cheetah-1' }
        ]
      }
    },
    {
      id: 'PIN-MULE-83575',
      account_no: 'acc_00083575',
      holder_name: 'Farhan Zaidi (Layer-1 Conduit)',
      title: 'Mule Hub acc_00083575 (Axis Bank)',
      type: 'MULE_HUB',
      layer: 'LAYER_A',
      layer_name: 'Mule Account Hubs',
      typology: 'Layer-1 Collection Hub',
      velocity_burst: '16 tx / 90s',
      pass_through_ratio: '99.9%',
      fan_in_senders: 16,
      fan_out_hops: 4,
      linked_phone: '+91 98412 88412',
      reported_by_institution: 'Axis Bank',
      cityName: 'Chennai',
      city: 'Chennai, Tamil Nadu',
      province: 'Tamil Nadu',
      zone: 'Chennai South Cyber Command',
      jurisdiction: 'Chennai Central Cyber Command',
      lat: 13.0604,
      lng: 80.2496,
      bank: 'Axis Bank',
      branch: 'Anna Salai Main Sector',
      location_text: 'Plot 42, Anna Salai Commercial Corridor, Chennai',
      risk: 'CRITICAL',
      severity: 95,
      amount: '₹14,80,000',
      channel: 'IMPS • UPI Fast',
      telecom_bts: 'CHN-SALAI-BTS-042',
      freeze_status: 'ACTIVE',
      timestamp: '2026-11-24 18:45:12',
      associated_case: 'CASE-2026-089',
      evidence_source: 'Core Banking Switch Logs (Axis Bank)',
      provenance: 'Cryptographically Verified Stream',
      cctv_reference: 'CAM-CHN-0914-LIVE',
      dispenser_id: 'N/A',
      wallet_hash: 'N/A',
      coverage_radius_meters: 1200,
      azimuth_degrees: 60,
      investigation_officer: {
        officer_name: 'Inspector Rajesh Kumar',
        rank: 'Lead Cyber Crime Investigator',
        badge_no: 'TN-CC-8421',
        station: 'Cyber Crime Division, Chennai HQ',
        contact_number: '+91 94440 12345',
        radio_callsign: 'CYBER-ALPHA-1',
        encrypted_freq: '155.475 MHz',
        statutory_warrant: 'Sec 102 CrPC Warrant #TN/2026/8912',
        directive: 'Execute emergency debit restriction and seize terminal equipment',
        assigned_date: '24 Nov 2026'
      },
      patrol_unit: {
        unit_callsign: 'CHEETAH-1',
        vehicle_type: 'Tactical PCR Interceptor SUV',
        vehicle_reg: 'TN-01-G-9921',
        crew_strength: '3 Tactical Officers',
        status: 'ACTIVE_INTERCEPT',
        alert_level: 'RED_CRITICAL',
        eta_minutes: '1.8',
        distance_km: 1.2,
        patrol_coords: { lat: 13.0720, lng: 80.2600 },
        directive: 'Cordon off ATM exit & detain cashout suspect',
        last_radio_ping: '8s ago'
      },
      target_branch_coords: { lat: 13.0604, lng: 80.2496 },
      target_account_no: 'acc_00083575',
      target_bank: 'Axis Bank',
      patrol_unit_callsign: 'CHEETAH-1',
      elevation: '14m ASL',
      street_address: 'Plot 42, Mount Road Corporate Tower',
      cross_street: 'Opp. LIC Metro Station',
      building_footprint: 'Commercial G+6 RCC Glass Facade',
      cadastral_plot_id: 'TN-CHN-2026-BLK-8419',
      cadastral: {
        country: 'India',
        state_province: 'Tamil Nadu',
        cyber_zone: 'Chennai Cyber Command',
        district_tehsil: 'Chennai Central',
        town_sector: 'Mount Road Financial Enclave',
        postal_code: '600002',
        elevation: '14m ASL',
        banking_enclave: 'Anna Salai Banking Corridor',
        street_address: 'Plot 42, Mount Road Corporate Tower',
        cross_street: 'Opp. LIC Metro Station',
        building_footprint: 'Commercial G+6 RCC Glass Facade',
        cadastral_plot_id: 'TN-CHN-2026-BLK-8419',
        cctv_safe_city: 'CAM-TN-CHN-0914 (360° PTZ 4K Live)',
        police_beat: 'Beat No. 4, Anna Salai Police Station',
        gps_inch_precision: { latitude: 13.0604, longitude: 80.2496, resolution_meters: 0.12, resolution_inches: 4.7 },
        escape_routes: [
          { corridor: 'Anna Salai Arterial Highway', distance_m: 450, transit_car: '2.5 mins', intercept_prob: '88%', patrol: 'Cheetah-1' },
          { corridor: 'Mount Road Alleyway to Metro', distance_m: 180, transit_foot: '1.2 mins', intercept_prob: '74%', patrol: 'Beat Officer #4' }
        ]
      },
      predictive_escape_routes: [
        { corridor: 'Anna Salai Arterial to Airport Expressway', distance_m: 450, transit_car: '2.5 mins', intercept_prob: '88%', patrol: 'Cheetah-1' }
      ]
    },
    {
      id: 'PIN-ATM-09',
      account_no: 'AC38192',
      holder_name: 'ATM Cashout Point #09',
      title: 'Axis Bank ATM Kiosk #09',
      type: 'ATM_CASHOUT',
      layer: 'LAYER_B',
      layer_name: 'ATM Cash-outs',
      typology: 'Rapid Pass-Through Relay',
      velocity_burst: '18 swipes / 60s',
      pass_through_ratio: '100%',
      cityName: 'Chennai',
      city: 'Chennai (Anna Nagar)',
      province: 'Tamil Nadu',
      lat: 13.0827,
      lng: 80.2707,
      bank: 'Axis Bank ATM Network',
      branch: 'Anna Nagar West Kiosk #09',
      risk: 'CRITICAL',
      severity: 98,
      amount: '₹3,20,000',
      channel: 'ATM Cash Dispense',
      freeze_status: 'DEBIT_FROZEN',
      dispenser_id: 'ATM-AXS-CH-09',
      cctv_reference: 'CCTV-CHN-AN-09-LIVE',
      timestamp: '2026-11-24 18:48:12',
      associated_case: 'CASE-2026-089',
      target_branch_coords: { lat: 13.0827, lng: 80.2707 },
      target_account_no: 'AC38192',
      target_bank: 'Punjab National Bank'
    },
    {
      id: 'PIN-VICTIM-VARUN',
      account_no: 'ACC-VICTIM-VARUN',
      holder_name: 'Varun S. (Complainant)',
      title: 'Victim Origin: Varun S.',
      type: 'VICTIM_ORIGIN',
      layer: 'LAYER_C',
      layer_name: 'Victim Origins',
      cityName: 'Chennai',
      city: 'Chennai (T. Nagar)',
      province: 'Tamil Nadu',
      lat: 13.0405,
      lng: 80.2337,
      bank: 'Canara Bank',
      branch: 'T. Nagar Branch',
      risk: 'LOW',
      severity: 15,
      amount: '₹12,50,000 Debited',
      channel: 'IMPS Unauthorized Debit',
      freeze_status: 'COMPLAINT_FILED',
      timestamp: '2026-11-24 18:45:00',
      associated_case: 'CASE-2026-089'
    },
    {
      id: 'PIN-CRYPTO-DESK',
      account_no: 'CRYPTO-DESK-USDT',
      holder_name: 'Tether USDT P2P OTC Desk',
      title: 'Binance P2P OTC Escrow Node',
      type: 'CRYPTO_DESK',
      layer: 'LAYER_D',
      layer_name: 'Crypto Desks',
      cityName: 'Chennai',
      city: 'Chennai (Adyar / OMR Corridor)',
      province: 'Tamil Nadu',
      lat: 13.0012,
      lng: 80.2565,
      bank: 'P2P Escrow Offramp',
      branch: 'Virtual OTC Desk',
      risk: 'CRITICAL',
      severity: 96,
      amount: '₹3,30,000 (USDT Off-Ramp)',
      channel: 'P2P Crypto Escrow',
      wallet_hash: '0x71C...4f9B (TRC-20 USDT)',
      freeze_status: 'ACTIVE_ESCROW',
      timestamp: '2026-11-24 18:49:00',
      associated_case: 'CASE-2026-089'
    },
    {
      id: 'PIN-BTS-042',
      account_no: 'BTS-CHN-404-12',
      holder_name: 'Telecom BTS Tower Sector A',
      title: 'Airtel BTS Tower CID-84102',
      type: 'TELECOM_BTS',
      layer: 'LAYER_E',
      layer_name: 'Telecom BTS Towers',
      cityName: 'Chennai',
      city: 'Chennai (Mount Road Sector)',
      province: 'Tamil Nadu',
      lat: 13.0550,
      lng: 80.2450,
      bank: 'Telecom Telemetry',
      branch: 'Airtel Tower CID-84102',
      risk: 'MEDIUM',
      severity: 45,
      amount: '42 Call Events',
      channel: 'Cellular Triangulation',
      coverage_radius_meters: 1400,
      azimuth_degrees: 60,
      freeze_status: 'MONITORING',
      timestamp: '2026-11-24 18:48:04',
      associated_case: 'CASE-2026-089'
    },
    {
      id: 'PIN-PATROL-CHEETAH1',
      account_no: 'PATROL-CHEETAH-1',
      holder_name: 'Tactical PCR Unit Cheetah-1',
      title: 'PCR Cheetah-1 (Tamil Nadu Police)',
      type: 'PATROL_UNIT',
      layer: 'LAYER_F',
      layer_name: 'Police Patrol Units',
      cityName: 'Chennai',
      city: 'Chennai (Central Sector)',
      province: 'Tamil Nadu',
      lat: 13.0720,
      lng: 80.2600,
      bank: 'Police Enforcement',
      branch: 'Law & Order Division',
      risk: 'LOW',
      severity: 10,
      amount: 'Armed 3-Man Team',
      channel: 'Police Encrypted VHF (155.475 MHz)',
      freeze_status: 'ACTIVE_INTERCEPT',
      timestamp: '2026-11-24 18:50:00',
      associated_case: 'CASE-2026-089',
      patrol_unit: {
        unit_callsign: 'CHEETAH-1',
        vehicle_type: 'Tactical PCR Interceptor SUV',
        vehicle_reg: 'TN-01-G-9921',
        crew_strength: '3 Armed Tactical Personnel',
        status: 'ACTIVE_INTERCEPT',
        alert_level: 'RED_CRITICAL',
        eta_minutes: '1.8',
        distance_km: 1.2,
        patrol_coords: { lat: 13.0720, lng: 80.2600 },
        directive: 'Intercept cashout suspect at ATM Kiosk #09 Anna Nagar',
        last_radio_ping: '10s ago'
      },
      target_branch_coords: { lat: 13.0827, lng: 80.2707 },
      target_account_no: 'AC38192',
      target_bank: 'Punjab National Bank'
    },
    {
      id: 'PIN-MULE-91823',
      account_no: 'AC91823',
      holder_name: 'Karthik Enterprises (Layer 2 Mule)',
      title: 'HDFC Node AC91823',
      type: 'MULE_HUB',
      layer: 'LAYER_A',
      layer_name: 'Mule Account Hubs',
      typology: 'Layer-2 Transit Aggregator',
      velocity_burst: '9 tx / 180s',
      pass_through_ratio: '94.2%',
      fan_in_senders: 8,
      fan_out_hops: 3,
      cityName: 'Coimbatore',
      city: 'Coimbatore, Tamil Nadu',
      province: 'Tamil Nadu',
      lat: 11.0168,
      lng: 76.9558,
      bank: 'HDFC Bank',
      branch: 'Coimbatore Main Branch',
      risk: 'HIGH',
      severity: 88,
      amount: '₹6,00,000',
      channel: 'RTGS Transit',
      freeze_status: 'ACTIVE',
      timestamp: '2026-11-24 18:46:00',
      associated_case: 'CASE-2026-088'
    },
    {
      id: 'PIN-MULE-55412',
      account_no: 'AC55412',
      holder_name: 'Sunil Kumar (P2P Intermediary)',
      title: 'ICICI Node AC55412',
      type: 'MULE_HUB',
      layer: 'LAYER_A',
      layer_name: 'Mule Account Hubs',
      typology: 'Fast Payment Conduit',
      velocity_burst: '11 tx / 150s',
      pass_through_ratio: '91.0%',
      fan_in_senders: 11,
      fan_out_hops: 2,
      cityName: 'Bengaluru',
      city: 'Bengaluru, Karnataka',
      province: 'Karnataka',
      lat: 12.9352,
      lng: 77.6245,
      bank: 'ICICI Bank',
      branch: 'Koramangala 4th Block',
      risk: 'HIGH',
      severity: 84,
      amount: '₹6,50,000',
      channel: 'UPI / IMPS',
      freeze_status: 'ACTIVE',
      timestamp: '2026-11-24 18:46:30',
      associated_case: 'CASE-2026-087'
    },
    {
      id: 'PIN-MULE-44510',
      account_no: 'AC44510',
      holder_name: 'Devi Trading Co. (Layer 3 Mule)',
      title: 'SBI Node AC44510',
      type: 'MULE_HUB',
      layer: 'LAYER_A',
      layer_name: 'Mule Account Hubs',
      typology: 'Dormant Account Awakening',
      velocity_burst: '7 tx / 240s',
      pass_through_ratio: '88.5%',
      fan_in_senders: 5,
      fan_out_hops: 2,
      cityName: 'Hyderabad',
      city: 'Hyderabad, Telangana',
      province: 'Telangana',
      lat: 17.3850,
      lng: 78.4867,
      bank: 'State Bank of India',
      branch: 'Secunderabad Main',
      risk: 'HIGH',
      severity: 79,
      amount: '₹5,80,000',
      channel: 'NEFT Fast',
      freeze_status: 'ACTIVE',
      timestamp: '2026-11-24 18:47:10',
      associated_case: 'CASE-2026-086'
    }
  ];

  const MONEY_TRAIL_VECTORS = [
    {
      id: 'VEC-01',
      from: [13.0405, 80.2337],
      to: [13.0604, 80.2496],
      fromCity: 'Chennai South (Victim Varun S.)',
      toCity: 'Chennai Central (Mule Conduit acc_00083575)',
      label: '₹12,50,000 IMPS Inflow',
      amount: '₹12,50,000',
      channel: 'IMPS Fast',
      risk: 'CRITICAL'
    },
    {
      id: 'VEC-02',
      from: [13.0604, 80.2496],
      to: [13.0827, 80.2707],
      fromCity: 'Chennai Central (Mule Conduit)',
      toCity: 'Anna Nagar (ATM Kiosk #09)',
      label: '₹3,20,000 ATM Cashout',
      amount: '₹3,20,000',
      channel: 'ATM Cashout',
      risk: 'CRITICAL'
    },
    {
      id: 'VEC-03',
      from: [13.0604, 80.2496],
      to: [11.0168, 76.9558],
      fromCity: 'Chennai',
      toCity: 'Coimbatore (HDFC Node AC91823)',
      label: '₹6,00,000 RTGS Layering',
      amount: '₹6,00,000',
      channel: 'RTGS',
      risk: 'HIGH'
    },
    {
      id: 'VEC-04',
      from: [13.0604, 80.2496],
      to: [12.9352, 77.6245],
      fromCity: 'Chennai',
      toCity: 'Bengaluru (ICICI Node AC55412)',
      label: '₹6,50,000 P2P Offramp',
      amount: '₹6,50,000',
      channel: 'UPI / OTC',
      risk: 'HIGH'
    },
    {
      id: 'VEC-05',
      from: [12.9352, 77.6245],
      to: [13.0012, 80.2565],
      fromCity: 'Bengaluru',
      toCity: 'Chennai (Binance OTC Escrow)',
      label: '₹3,30,000 USDT Conversion',
      amount: '₹3,30,000',
      channel: 'P2P Crypto',
      risk: 'CRITICAL'
    }
  ];

  // -------------------------------------------------------------
  // Real-Time Alerts (8 items)
  // -------------------------------------------------------------
  const REAL_TIME_ALERTS = [
    {
      id: "ALT-78456",
      time: "18:45",
      type: "Critical Alert",
      message: "Suspicious velocity burst detected in acc_00083575: 16 rapid tx within 90s",
      color: "red",
      status: "NEW",
      amount: "₹12,50,000",
      account: "acc_00083575",
      bank: "Axis Bank",
      location: "Chennai (Central Sector), TN"
    },
    {
      id: "ALT-91823",
      time: "18:42",
      type: "High Risk",
      message: "Multiple accounts linked across 3 distinct branches: AC91823 (HDFC)",
      color: "orange",
      status: "INVESTIGATING",
      amount: "₹6,00,000",
      account: "AC91823",
      bank: "HDFC Bank",
      location: "Coimbatore, TN"
    },
    {
      id: "ALT-55412",
      time: "18:40",
      type: "High Risk",
      message: "Rapid pass-through crypto OTC desk off-ramp velocity burst in AC55412",
      color: "orange",
      status: "NEW",
      amount: "₹6,50,000",
      account: "AC55412",
      bank: "ICICI Bank",
      location: "Bengaluru, KA"
    },
    {
      id: "ALT-44510",
      time: "18:38",
      type: "High Risk",
      message: "Dormant account awakened after 180 days with instant RTGS inflow",
      color: "orange",
      status: "OPEN",
      amount: "₹5,80,000",
      account: "AC44510",
      bank: "State Bank of India",
      location: "Hyderabad, TS"
    },
    {
      id: "ALT-38192",
      time: "18:35",
      type: "Critical Alert",
      message: "ATM cashout in progress at Anna Nagar Kiosk #09 (18 card swipes / 60s)",
      color: "red",
      status: "NEW",
      amount: "₹3,20,000",
      account: "AC38192",
      bank: "Punjab National Bank",
      location: "Chennai (Anna Nagar), TN"
    },
    {
      id: "ALT-DOM01",
      time: "18:30",
      type: "Critical Alert",
      message: "Phishing kit targeting SBI netbanking users detected: sbi-kyc-verification.online",
      color: "red",
      status: "OPEN",
      amount: "₹24,00,000 Exposed",
      account: "DOM-01",
      bank: "State Bank of India",
      location: "National Perimeter"
    },
    {
      id: "ALT-IP01",
      time: "18:25",
      type: "Critical Alert",
      message: "Tor exit node 185.220.101.5 associated with 3 active mule accounts",
      color: "red",
      status: "INVESTIGATING",
      amount: "14 Sessions",
      account: "185.220.101.5",
      bank: "Multi-Bank Gateway",
      location: "Frankfurt (DE) / Impossible Hop"
    },
    {
      id: "ALT-TEL01",
      time: "18:20",
      type: "Warning",
      message: "Duplicate SIM swap detected 48h prior on suspect mobile +91 98412 88412",
      color: "orange",
      status: "NEW",
      amount: "N/A",
      account: "+91 98412 88412",
      bank: "Airtel TN Circle",
      location: "Chennai Metro"
    }
  ];

  // -------------------------------------------------------------
  // Relationship Graph Dataset
  // -------------------------------------------------------------
  const RELATIONSHIP_GRAPH_DATA = {
    nodes: [
      { id: 'AC78456', label: 'AC78456 (Varun S. Proxy Hub)', type: 'ACCOUNT', risk: 'CRITICAL', community: 1, degree: 6, bank: 'Axis Bank', holder: 'Varun S. Proxy', loss: '₹12,50,000' },
      { id: 'acc_00020535', label: 'acc_00020535 (Ramesh Sharma)', type: 'ACCOUNT', risk: 'CRITICAL', community: 1, degree: 5, bank: 'Axis Bank', holder: 'Ramesh Sharma', loss: '₹12,50,000' },
      { id: 'AC91823', label: 'AC91823 (Karthik Enterprises)', type: 'ACCOUNT', risk: 'HIGH', community: 1, degree: 4, bank: 'HDFC Bank', holder: 'Karthik Ent.', loss: '₹6,00,000' },
      { id: 'AC55412', label: 'AC55412 (Sunil Kumar Crypto)', type: 'ACCOUNT', risk: 'HIGH', community: 2, degree: 4, bank: 'ICICI Bank', holder: 'Sunil Kumar', loss: '₹6,50,000' },
      { id: 'AC44510', label: 'AC44510 (Devi Trading)', type: 'ACCOUNT', risk: 'HIGH', community: 2, degree: 3, bank: 'SBI', holder: 'Devi Trading', loss: '₹5,80,000' },
      { id: 'AC38192', label: 'AC38192 (ATM Kiosk #09)', type: 'ACCOUNT', risk: 'CRITICAL', community: 1, degree: 3, bank: 'PNB', holder: 'ATM Terminal', loss: '₹3,20,000' },
      { id: 'PHONE-98412', label: '+91 98412 88412 (SIM Swapped)', type: 'PHONE', risk: 'CRITICAL', community: 1, degree: 5, carrier: 'Airtel TN Circle', loc: 'Chennai' },
      { id: 'PHONE-94451', label: '+91 94451 22910', type: 'PHONE', risk: 'HIGH', community: 1, degree: 3, carrier: 'Jio TN Circle', loc: 'Coimbatore' },
      { id: 'PAN-ABCPS', label: 'PAN: ABCPS1294F', type: 'PAN', risk: 'CRITICAL', community: 1, degree: 4, holder: 'Mismatch Record', loc: 'Income Tax Dept' },
      { id: 'PAN-AAACK', label: 'PAN: AAACK4412M', type: 'PAN', risk: 'HIGH', community: 1, degree: 2, holder: 'Shell Corp PAN', loc: 'Corporate Registry' },
      { id: 'IMEI-86420', label: 'IMEI: 864201048821940', type: 'DEVICE', risk: 'CRITICAL', community: 1, degree: 4, os: 'Android 14 (Emulated)', loc: 'Chennai BTS' },
      { id: 'IP-185-TOR', label: '185.220.101.5 (Tor Exit)', type: 'IP', risk: 'CRITICAL', community: 2, degree: 4, os: 'Tor Relay', loc: 'Frankfurt (DE)' },
      { id: 'LOC-CHENNAI', label: 'Chennai South Command Grid', type: 'LOCATION', risk: 'HIGH', community: 1, degree: 5, loc: 'Tamil Nadu' },
      { id: 'OFFRAMP-BINANCE', label: 'Binance P2P USDT OTC Desk', type: 'OFFRAMP', risk: 'CRITICAL', community: 2, degree: 3, loss: '₹3,30,000' }
    ],
    links: [
      { source: 'AC78456', target: 'acc_00020535', relation: 'IMPS_FUND_DISPERSAL', weight: 0.9 },
      { source: 'AC78456', target: 'PHONE-98412', relation: 'REGISTERED_MOBILE', weight: 0.8 },
      { source: 'AC78456', target: 'PAN-ABCPS', relation: 'KYC_IDENTIFIER', weight: 0.95 },
      { source: 'acc_00020535', target: 'IMEI-86420', relation: 'SHARED_DEVICE_LOGIN', weight: 0.85 },
      { source: 'acc_00020535', target: 'AC91823', relation: 'RTGS_TRANSIT_HOP', weight: 0.75 },
      { source: 'acc_00020535', target: 'AC38192', relation: 'ATM_CASHOUT_RUN', weight: 0.92 },
      { source: 'AC91823', target: 'PHONE-94451', relation: 'REGISTERED_MOBILE', weight: 0.7 },
      { source: 'AC91823', target: 'PAN-AAACK', relation: 'KYC_IDENTIFIER', weight: 0.8 },
      { source: 'AC78456', target: 'AC55412', relation: 'P2P_TRANSFER', weight: 0.65 },
      { source: 'AC55412', target: 'OFFRAMP-BINANCE', relation: 'CRYPTO_OFFRAMP', weight: 0.94 },
      { source: 'AC55412', target: 'IP-185-TOR', relation: 'C2_NETWORK_HOP', weight: 0.88 },
      { source: 'AC44510', target: 'AC91823', relation: 'NEFT_INTERMEDIARY', weight: 0.6 },
      { source: 'PHONE-98412', target: 'LOC-CHENNAI', relation: 'TOWER_BTS_PING', weight: 0.82 },
      { source: 'IMEI-86420', target: 'IP-185-TOR', relation: 'PROXY_TUNNEL', weight: 0.91 }
    ],
    centrality_metrics: {
      highest_betweenness: 'acc_00020535 (0.842)',
      louvain_modularity: '0.68',
      graph_density: '0.34',
      diameter: 4,
      betweenness: {
        'AC78456': '0.785',
        'acc_00020535': '0.842',
        'AC91823': '0.512',
        'AC55412': '0.620',
        'PHONE-98412': '0.690',
        'IMEI-86420': '0.710',
        'IP-185-TOR': '0.640'
      },
      pagerank: {
        'AC78456': '0.245',
        'acc_00020535': '0.280',
        'AC91823': '0.145',
        'AC55412': '0.160',
        'PHONE-98412': '0.190',
        'IMEI-86420': '0.185'
      }
    }
  };

  // -------------------------------------------------------------
  // Intercept window.fetch
  // -------------------------------------------------------------
  const originalFetch = window.fetch;

  window.fetch = async function(input, init) {
    let url = typeof input === 'string' ? input : (input && input.url ? input.url : '');

    if (url.startsWith('/api/') || url.includes('/api/')) {
      const urlObj = new URL(url, window.location.origin);
      const pathname = urlObj.pathname;
      console.log(`[FINTRACE Mock API] Intercepting: ${pathname}`);

      // 1. Tactical AI & Telecom Workbench Endpoints
      if (pathname === '/api/telecom/overview') {
        return jsonRes({
          success: true,
          data: {
            monitored_msisdn: 28,
            tower_dumps_analyzed: 14,
            ipdr_records: '1.4M',
            cross_matched_suspects: 9,
            imei_clones: 3,
            kpi_by_operator: [
              { operator: 'Airtel 5G (TN Circle)', total_calls: 11420, fraud_rate: '8.4%' },
              { operator: 'Jio True5G (TN & KA)', total_calls: 9140, fraud_rate: '6.9%' },
              { operator: 'Vodafone Idea (Vi)', total_calls: 3983, fraud_rate: '5.2%' }
            ]
          }
        });
      }

      if (pathname === '/api/telecom/dossiers') {
        return jsonRes({
          success: true,
          data: TELECOM_DOSSIERS
        });
      }

      if (pathname === '/api/ai/train') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        const isDelayed = body.dataset === 'delayed_reports';
        return jsonRes({
          success: true,
          data: {
            status: "TRAINED_SUCCESSFULLY",
            model_version: `XGBoost-Police-CreditFraud-v4.2.${Date.now().toString().slice(-4)}`,
            dataset_name: isDelayed ? 'Cybercrime Delayed Reports Benchmark (4,725 Cases)' : 'Kaggle creditcard.csv Benchmark (284,807 Records)',
            dataset_metrics: {
              total_samples: isDelayed ? 4725 : 284807,
              fraud_samples: isDelayed ? 892 : 492,
              test_size: isDelayed ? 945 : 56962
            },
            evaluation_metrics: {
              accuracy: isDelayed ? 98.40 : 99.94,
              roc_auc: isDelayed ? 97.34 : 98.42,
              recall: isDelayed ? 84.69 : 91.84,
              precision: isDelayed ? 89.50 : 93.75,
              f1_score: isDelayed ? 87.03 : 92.78
            },
            confusion_matrix: {
              true_positives: isDelayed ? 152 : 90,
              false_negatives: isDelayed ? 27 : 8,
              false_positives: isDelayed ? 18 : 6,
              true_negatives: isDelayed ? 748 : 56858
            },
            feature_importance: [
              { feature: "V14 (Primary Latent Anomaly Vector)", importance: 0.384 },
              { feature: "V4 (Transaction Frequency Volatility)", importance: 0.241 },
              { feature: "V12 (Rapid Pass-Through Discrepancy)", importance: 0.163 },
              { feature: "V10 (High-Volume Layering Indication)", importance: 0.128 },
              { feature: "V17 (Critical Risk Exposure Index)", importance: 0.115 },
              { feature: "Amount (Transaction Value INR / USD)", importance: 0.072 }
            ]
          }
        });
      }

      if (pathname === '/api/ai/cdr-ipdr') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        const target = body.target_account || 'acc_00020535';
        const mule = TELECOM_DOSSIERS.find(d => d.account_no === target) || TELECOM_DOSSIERS[0];

        const cdrCalls = [
          {
            call_id: "CDR-CALL-20535-01",
            direction: "OUTBOUND",
            counterparty_phone: "+91 77164 40495",
            counterparty_role: "Syndicate Lead (Jamtara Hub)",
            timestamp: "2026-11-24 18:48:11",
            duration_formatted: "0m 47s",
            cost_inr: 21.15,
            cell_tower: "CHN-SALAI-BTS-042",
            azimuth: "60° Sector A",
            fraud_flag: 1
          },
          {
            call_id: "CDR-CALL-20535-02",
            direction: "INBOUND",
            counterparty_phone: "+91 91295 81426",
            counterparty_role: "Hawala Cash Courier",
            timestamp: "2026-11-24 18:42:30",
            duration_formatted: "3m 15s",
            cost_inr: 45.00,
            cell_tower: "CHN-SALAI-BTS-042",
            azimuth: "60° Sector A",
            fraud_flag: 1
          },
          {
            call_id: "CDR-CALL-20535-03",
            direction: "INBOUND",
            counterparty_phone: "AX-AXISBK",
            counterparty_role: "Bank Netbanking OTP SMS",
            timestamp: "2026-11-24 18:35:12",
            duration_formatted: "0m 00s",
            cost_inr: 0.00,
            cell_tower: "CHN-SALAI-BTS-042",
            azimuth: "60° Sector A",
            fraud_flag: 1
          },
          {
            call_id: "CDR-CALL-20535-04",
            direction: "OUTBOUND",
            counterparty_phone: "+91 94451 22910",
            counterparty_role: "Linked Mule AC91823",
            timestamp: "2026-11-24 18:24:38",
            duration_formatted: "2m 10s",
            cost_inr: 18.50,
            cell_tower: "CHN-SALAI-BTS-042",
            azimuth: "60° Sector A",
            fraud_flag: 1
          },
          {
            call_id: "CDR-CALL-20535-05",
            direction: "OUTBOUND",
            counterparty_phone: "+91 91760 99411",
            counterparty_role: "Crypto OTC Mule AC55412",
            timestamp: "2026-11-24 18:15:02",
            duration_formatted: "1m 32s",
            cost_inr: 12.00,
            cell_tower: "CHN-SALAI-BTS-042",
            azimuth: "60° Sector A",
            fraud_flag: 1
          }
        ];

        return jsonRes({
          success: true,
          data: {
            status: "CORRELATED",
            account_no: mule.account_no,
            mule_name: mule.holder_name,
            bank: mule.bank,
            city: mule.city,
            associated_case: "CASE-2026-089",
            suspect_mobile: mule.msisdn,
            suspect_imei: mule.imei,
            suspect_imsi: mule.imsi,
            sim_swap_detected: true,
            sim_swap_time: "48h prior to ₹12.5L inflow (Critical Risk Trigger)",
            operator: mule.provider,
            tower_triangulation: {
              tower_id: "CHN-SALAI-BTS-042",
              operator: mule.provider,
              cell_id: "CID-404-12-84102",
              area: "Anna Salai Commercial Corridor (Direct Line-of-Sight to ATM)",
              azimuth_sector: "60° Sector A",
              distance_to_atm: "32 meters (Direct Line-of-Sight)",
              distance_meters: 32,
              colocated_with_atm: true,
              cashout_timestamp: "2026-11-24 18:48:12",
              tower_ping_timestamp: "2026-11-24 18:48:04",
              time_delta: "-8s",
              confidence: "98.5%"
            },
            metrics: {
              fraud_probability: 94.2,
              fraud_severity_score: 89.5,
              severity_label: "Critical Risk",
              investigation_priority: "Priority 1 (Urgent Freeze)",
              roaming_flag: 0,
              international_flag: 1,
              call_cost_inr: 482.50,
              total_calls_logged: 6,
              recommendation: "Immediate Section 102 CrPC statutory debit freeze & physical dispatch of Cheetah-1 PCR patrol unit to ATM Kiosk #09."
            },
            calls_history: cdrCalls,
            call_detail_records: cdrCalls,
            correlations: [
              {
                tower_id: "CHN-SALAI-BTS-042",
                operator: mule.provider,
                cell_id: "CID-404-12-84102",
                suspect_mobile: mule.msisdn,
                suspect_imei: mule.imei,
                cashout_timestamp: "2026-11-24 18:48:12",
                tower_ping_timestamp: "2026-11-24 18:48:04",
                time_delta: "-8s",
                azimuth_sector: "60° Sector A",
                distance_to_atm: "32 meters (Direct Line-of-Sight)",
                confidence: "98.5%"
              }
            ]
          }
        });
      }

      if (pathname === '/api/investigations/bank-freeze-notice') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        const accNo = body.account_no || 'acc_00020535';
        const bankName = body.bank || 'Axis Bank';
        const amountStr = body.amount || '₹12,50,000';
        const caseNo = body.case_no || 'CASE-2026-089';

        return jsonRes({
          success: true,
          data: {
            notice_id: `SEC102-${Date.now().toString().slice(-6)}`,
            account_no: accNo,
            bank: bankName,
            amount: amountStr,
            case_no: caseNo,
            statutory_section: "Section 102 CrPC / Section 106 BNSS 2023",
            to_nodal_officer: `Chief Nodal Compliance Officer, ${bankName}`,
            subject: `Immediate Pre-Trial Statutory Debit Freeze on Target Mule Account ${accNo}`,
            statutory_text: `STATUTORY NOTICE UNDER SECTION 102 CrPC / SECTION 106 BNSS 2023:\n\nTO: Chief Nodal Compliance Officer, ${bankName}\nFROM: Inspector Rajesh Kumar, Cyber Crime Division, Commissionerate of Police\nSUBJECT: Formal Directive for Immediate Debit Restriction on Account ${accNo}\n\n1. WHEREAS credible cyber-forensic and telecommunications triangulation evidence has been gathered in Case Ref: ${caseNo};\n2. AND WHEREAS the aforementioned account ${accNo} has functioned as an active conduit for illicit funds exfiltrated through unauthorized electronic banking transfers amounting to ${amountStr};\n3. YOU ARE HEREBY ORDERED under Section 102 of the Code of Criminal Procedure, 1973 (read with Section 106 of Bharatiya Nagarik Suraksha Sanhita, 2023) to immediately place an administrative and debit lien upon the specified account.\n4. No withdrawals, clearing transfers, UPI disbursements, or ATM cash-outs shall be honored without express judicial authorization.\n\nDate: ${new Date().toLocaleDateString('en-GB')}\nPlace: Cyber Crime Headquarters`,
            court: "Special Court for Cyber & Economic Offences",
            officer_name: "Inspector Rajesh Kumar (Lead Cyber Investigator)",
            hash: "SHA256: 9f8a3c8e4d2a1b5c7e9f0a2b4d6e8f1a3c5e7b9d0f2a4c6e8b0d2f4a6c8e0b2 (CERT-IN-SEAL)"
          }
        });
      }

      // 2. Live Google Maps Endpoints
      if (pathname === '/api/maps/live-pins') {
        const queryAcc = urlObj.searchParams.get('account_no') || 'acc_00020535';
        const focalPin = MAP_PINS.find(p => p.account_no === queryAcc) || MAP_PINS[0];

        return jsonRes({
          success: true,
          data: {
            pins: MAP_PINS,
            money_trail_vectors: MONEY_TRAIL_VECTORS,
            counts_by_layer: {
              layer_a: 4,
              layer_b: 1,
              layer_c: 1,
              layer_d: 1,
              layer_e: 1,
              layer_f: 1
            },
            focal_center: {
              lat: focalPin.lat,
              lng: focalPin.lng
            }
          }
        });
      }

      if (pathname === '/api/maps/reverse-geocode') {
        const lat = parseFloat(urlObj.searchParams.get('lat') || '13.0604');
        const lng = parseFloat(urlObj.searchParams.get('lng') || '80.2496');
        return jsonRes({
          success: true,
          data: {
            address: `Sector 4, Anna Salai Commercial Corridor, Chennai (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            cadastral_plot: `TN-CHN-GEO-${Math.floor(lat * 100)}-${Math.floor(lng * 100)}`,
            elevation: '14m ASL',
            nearest_atm_distance_m: 85,
            nearest_patrol_eta: '1.8 mins',
            jurisdiction: 'Chennai South Police Beat #4'
          }
        });
      }

      if (pathname === '/api/maps/geosearch') {
        const q = (urlObj.searchParams.get('q') || '').toLowerCase();
        const results = MAP_PINS.filter(p =>
          p.account_no.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.bank.toLowerCase().includes(q)
        ).map(p => ({
          account_no: p.account_no,
          title: `${p.account_no} • ${p.bank} (${p.city})`,
          city: p.city,
          coords: { lat: p.lat, lng: p.lng }
        }));
        return jsonRes({ success: true, results });
      }

      if (pathname === '/api/police/statutory-notice') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        return jsonRes({
          success: true,
          data: {
            notice_id: `SEC102-${Date.now().toString().slice(-6)}`,
            account_no: body.account_no || 'acc_00020535',
            bank: body.bank || 'Axis Bank',
            amount: body.amount || '₹12,50,000',
            court: 'Special Court for Cyber & Economic Offences, Chennai',
            officer_name: 'Inspector Rajesh Kumar (Lead Cyber Investigator)',
            statute: 'Section 102 CrPC / Section 106 BNSS (2023)',
            notice_text: `STATUTORY NOTICE UNDER SECTION 102 CrPC / SECTION 106 BNSS 2023:\nTO: Chief Nodal Compliance Officer, ${body.bank || 'Axis Bank'}\nSUBJECT: Immediate Pre-Trial Emergency Debit Freeze on Target Mule Account ${body.account_no || 'acc_00020535'}\nAMOUNT: ${body.amount || '₹12,50,000'}\nYou are hereby directed to freeze all outbound debit transfers with immediate effect.`
          }
        });
      }

      if (pathname === '/api/maps/patrol/dispatch') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        return jsonRes({
          success: true,
          docket: {
            dispatch_id: `DSP-${Date.now().toString().slice(-4)}`,
            unit_callsign: 'CHEETAH-1',
            eta_minutes: '1.8',
            radio_freq: '155.475 MHz',
            target_pin_id: body.pin_id || 'PIN-ATM-09',
            target_account: body.account_no || 'acc_00020535',
            patrol_start_coords: { lat: 13.0720, lng: 80.2600 },
            target_coordinates: { lat: body.lat || 13.0827, lng: body.lng || 80.2707 }
          }
        });
      }

      if (pathname === '/api/maps/freeze') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        return jsonRes({
          success: true,
          message: `Account ${body.account_no || 'Target'} successfully placed under Emergency Debit Freeze under Section 102 CrPC.`
        });
      }

      if (pathname === '/api/maps/patrol/radio-contact') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        return jsonRes({
          success: true,
          transmission: {
            id: `RADIO-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toLocaleTimeString(),
            channel: body.channel || '155.475 MHz',
            from: 'Central Cybercrime Dispatch',
            to: body.unit_callsign || 'CHEETAH-1',
            message: body.message || 'Standby for perimeter cordon.',
            ack: 'Acknowledged: Unit en route to target coordinates.'
          }
        });
      }

      if (pathname === '/api/maps/patrol/apb-alert') {
        return jsonRes({
          success: true,
          message: 'All-Points Bulletin (APB) Flash Broadcast successfully transmitted to all sector patrol units.'
        });
      }

      // 3. Real-Time Alerts Endpoints
      if (pathname === '/api/alerts') {
        return jsonRes({
          success: true,
          data: REAL_TIME_ALERTS,
          total: REAL_TIME_ALERTS.length
        });
      }

      if (pathname.match(/^\/api\/alerts\/[^\/]+\/triage$/)) {
        return jsonRes({
          success: true,
          message: 'Alert status successfully triaged.'
        });
      }

      // 4. Relationship Graph Endpoint
      if (pathname === '/api/relationship-graph') {
        return jsonRes({
          success: true,
          data: RELATIONSHIP_GRAPH_DATA
        });
      }

      // 5. KYC Intelligence Profile & Reports
      if (pathname === '/api/kyc') {
        const accId = urlObj.searchParams.get('account_id') || 'AC78456';
        return jsonRes({
          success: true,
          data: {
            account_id: accId,
            holder_name: 'Farhan Zaidi (Proxy Conduit)',
            institution: 'Axis Bank • Mount Road Branch',
            kyc_score: 94.7,
            status: 'CRITICAL_RISK',
            synthetic_identity_prob: '89.4%',
            mule_conduit_prob: '94.2%',
            investigation_note: 'Primary mobile +91 98412 88412 updated 48h prior to ₹12.5L inflow. Biometric iris hash failed NSDL consistency verification.',
            pan_number: 'ABCPS1294F',
            pan_match: 'NAME_MISMATCH',
            aadhaar_number: 'XXXX-XXXX-8421',
            aadhaar_match: 'VERIFIED_BIOMETRIC_FAIL',
            passport_number: 'Z8912441',
            passport_match: 'NO_RECORD',
            linked_accounts: [
              { account: 'AC91823', institution: 'HDFC Bank', reason: 'Shared contact phone +91 94451 22910 & IPDR tower', risk: '92%', risk_level: 'CRITICAL' },
              { account: 'AC55412', institution: 'ICICI Bank', reason: 'Common IMEI 864201048821940 device match', risk: '85%', risk_level: 'HIGH' },
              { account: 'AC44510', institution: 'State Bank of India', reason: 'High-velocity pass-through recipient', risk: '78%', risk_level: 'HIGH' },
              { account: 'AC38192', institution: 'Punjab National Bank', reason: 'Direct ATM terminal withdrawal link', risk: '95%', risk_level: 'CRITICAL' }
            ],
            verification_flow: [
              { step: 'UIDAI Aadhaar Biometric eKYC', status: 'VERIFIED_API', latency: '210ms', completed: true },
              { step: 'NSDL PAN Registry Crosscheck', status: 'NAME_MISMATCH', latency: '180ms', completed: false },
              { step: 'CISP / NCRP Fraudster Hit', status: 'POSITIVE_FLAG', latency: '95ms', completed: false },
              { step: 'Telecom Duplicate SIM Swap Check', status: 'SIM_SWAPPED_48H_AGO', latency: '320ms', completed: false },
              { step: 'Device IMEI Hardware Fingerprint', status: 'EMULATOR_DETECTED', latency: '140ms', completed: false }
            ],
            risk_indicators: [
              { indicator: 'Recent Mobile Number Replacement', risk: 'HIGH', severity: 'CRITICAL', detail: 'SIM card swapped 48 hours prior to transaction surge.' },
              { indicator: 'Synthetic Identity Anomaly', risk: '94.2%', severity: 'CRITICAL', detail: 'PAN card holder name differs from biometric registry.' },
              { indicator: 'Pass-Through Drain Velocity', risk: '99.8%', severity: 'CRITICAL', detail: 'Funds drained within 180 seconds of initial deposit.' }
            ],
            radar_vector: {
              name_variant_risk: 88,
              age_address_consistency: 34,
              device_profiling: 92,
              behavioral_patterns: 95,
              registry_correspondence: 25
            }
          }
        });
      }

      if (pathname === '/api/kyc/reports') {
        const fraudReports = [
          { report_id: 'REP-KYC-001', txn_id: 'TXN891244', reported_by_institution: 'Axis Bank', report_day: 24, outcome: 'CONFIRMED_FRAUD', sender_id: 'ACC-VICTIM-VARUN', receiver_id: 'AC78456', amount: 1250000, amount_formatted: '₹12,50,000', timestamp: '2026-11-24 18:45:12', channel: 'IMPS' },
          { report_id: 'REP-KYC-002', txn_id: 'TXN891245', reported_by_institution: 'HDFC Bank', report_day: 24, outcome: 'SUSPICIOUS_CONDUIT', sender_id: 'AC78456', receiver_id: 'AC91823', amount: 600000, amount_formatted: '₹6,00,000', timestamp: '2026-11-24 18:46:00', channel: 'RTGS' },
          { report_id: 'REP-KYC-003', txn_id: 'TXN891246', reported_by_institution: 'ICICI Bank', report_day: 24, outcome: 'SUSPICIOUS_CONDUIT', sender_id: 'AC78456', receiver_id: 'AC55412', amount: 650000, amount_formatted: '₹6,50,000', timestamp: '2026-11-24 18:46:30', channel: 'NEFT' },
          { report_id: 'REP-KYC-004', txn_id: 'TXN891247', reported_by_institution: 'State Bank of India', report_day: 24, outcome: 'PASS_THROUGH_MULE', sender_id: 'AC91823', receiver_id: 'AC44510', amount: 580000, amount_formatted: '₹5,80,000', timestamp: '2026-11-24 18:47:10', channel: 'IMPS' },
          { report_id: 'REP-KYC-005', txn_id: 'TXN891248', reported_by_institution: 'Punjab National Bank', report_day: 24, outcome: 'ATM_DRAINAGE_ATTEMPT', sender_id: 'AC55412', receiver_id: 'AC38192', amount: 320000, amount_formatted: '₹3,20,000', timestamp: '2026-11-24 18:48:00', channel: 'UPI / ATM' }
        ];
        return jsonRes({
          success: true,
          data: fraudReports,
          total: fraudReports.length,
          totalPages: 1
        });
      }

      // 6. Mule Account Detection
      if (pathname === '/api/mules') {
        const query = (urlObj.searchParams.get('search') || urlObj.searchParams.get('q') || '').toLowerCase();
        const risk = urlObj.searchParams.get('risk') || 'ALL';
        const bank = urlObj.searchParams.get('bank') || 'ALL';
        const typology = urlObj.searchParams.get('typology') || 'ALL';

        let list = MULE_ACCOUNTS;
        if (query) {
          list = list.filter(m => m.account_no.toLowerCase().includes(query) || m.holder_name.toLowerCase().includes(query));
        }
        if (risk !== 'ALL') {
          list = list.filter(m => m.risk_tier === risk);
        }
        if (bank !== 'ALL') {
          list = list.filter(m => m.bank.toLowerCase().includes(bank.toLowerCase()));
        }
        if (typology !== 'ALL') {
          list = list.filter(m => m.typology.toLowerCase().includes(typology.toLowerCase()));
        }

        return jsonRes({
          success: true,
          accounts: list,
          total: list.length,
          totalPages: 1,
          data: {
            mule_accounts_detected: 86,
            metrics: {
              rapid_transactions_pct: 73,
              multiple_senders_pct: 62,
              unusual_pattern_pct: 58,
              linked_accounts_pct: 47
            },
            funnel_distribution: {
              layer1_collection: 42,
              layer2_transit: 31,
              layer3_cashout: 13
            }
          }
        });
      }

      if (pathname.match(/^\/api\/mules\/[^\/]+\/freeze$/)) {
        const parts = pathname.split('/');
        const accId = parts[3];
        const mule = MULE_ACCOUNTS.find(m => m.account_no === accId);
        if (mule) {
          mule.frozen = !mule.frozen;
          mule.freeze_status = mule.frozen ? 'DEBIT_FROZEN' : 'ACTIVE';
        }
        return jsonRes({
          success: true,
          data: mule || MULE_ACCOUNTS[0],
          message: `Account ${accId} freeze status updated under Section 102 CrPC.`
        });
      }

      // 7. Money Trail Analysis
      if (pathname === '/api/money-trail') {
        const focalAcc = urlObj.searchParams.get('account_no') || 'acc_00020535';
        
        const trailData = {
          focal_account: focalAcc,
          focal_bank: 'Axis Bank',
          focal_location: { city: 'Chennai', zone: 'South Sector' },
          layers_count: 4,
          nodes_count: 7,
          detected_topology: 'radial_funnel',
          topology_descriptions: {
            radial_funnel: 'Radial Funnel: Aggregating multiple victim inflows into central mule conduit.',
            linear_relay: 'Linear Pipeline: Rapid sequential hopping through successive interbank layers.',
            tree_dispersal: 'Branching Tree: Smurfing large sums into micro-cashout increments.',
            circular_ring: 'Circular Ring: Complex layering loop designed to obfuscate audit trail.',
            geo_spatial: 'Geo-Spatial Quad: Cross-regional fund movement spanning state jurisdictions.'
          },
          nodes: [
            {
              id: 'V1',
              label: 'Varun S. (Victim)',
              bank: 'Canara Bank',
              type: 'victim',
              isCenter: false,
              isSquare: false,
              risk: 5,
              balance: '₹14,200',
              location: { city: 'Chennai' },
              layouts: {
                auto: { x: 120, y: 90 },
                radial_funnel: { x: 120, y: 90 },
                linear_relay: { x: 80, y: 170 },
                tree_dispersal: { x: 120, y: 90 },
                circular_ring: { x: 200, y: 70 },
                geo_spatial: { x: 160, y: 110 }
              }
            },
            {
              id: 'V2',
              label: 'Pooja R. (Victim 2)',
              bank: 'SBI Retail',
              type: 'victim',
              isCenter: false,
              isSquare: false,
              risk: 8,
              balance: '₹8,500',
              location: { city: 'Coimbatore' },
              layouts: {
                auto: { x: 120, y: 250 },
                radial_funnel: { x: 120, y: 250 },
                linear_relay: { x: 80, y: 250 },
                tree_dispersal: { x: 120, y: 250 },
                circular_ring: { x: 200, y: 270 },
                geo_spatial: { x: 160, y: 240 }
              }
            },
            {
              id: focalAcc,
              label: `${focalAcc} (Primary Mule Conduit)`,
              bank: 'Axis Bank',
              type: 'mule_hub',
              isCenter: true,
              isSquare: true,
              risk: 94,
              balance: '₹12,48,900',
              location: { city: 'Chennai' },
              layouts: {
                auto: { x: 380, y: 170 },
                radial_funnel: { x: 380, y: 170 },
                linear_relay: { x: 320, y: 170 },
                tree_dispersal: { x: 340, y: 170 },
                circular_ring: { x: 430, y: 70 },
                geo_spatial: { x: 400, y: 170 }
              }
            },
            {
              id: 'AC91823',
              label: 'AC91823 (Karthik Ent.)',
              bank: 'HDFC Bank',
              type: 'layer2',
              isCenter: false,
              isSquare: false,
              risk: 88,
              balance: '₹5,98,400',
              location: { city: 'Chennai' },
              layouts: {
                auto: { x: 580, y: 90 },
                radial_funnel: { x: 580, y: 90 },
                linear_relay: { x: 520, y: 170 },
                tree_dispersal: { x: 560, y: 90 },
                circular_ring: { x: 660, y: 140 },
                geo_spatial: { x: 560, y: 90 }
              }
            },
            {
              id: 'AC55412',
              label: 'AC55412 (Sunil Kumar)',
              bank: 'ICICI Bank',
              type: 'layer2',
              isCenter: false,
              isSquare: false,
              risk: 84,
              balance: '₹6,48,000',
              location: { city: 'Bengaluru' },
              layouts: {
                auto: { x: 580, y: 250 },
                radial_funnel: { x: 580, y: 250 },
                linear_relay: { x: 680, y: 170 },
                tree_dispersal: { x: 560, y: 250 },
                circular_ring: { x: 660, y: 240 },
                geo_spatial: { x: 560, y: 250 }
              }
            },
            {
              id: 'AC38192',
              label: 'Kiosk #09 (ATM Exit)',
              bank: 'PNB Cashout',
              type: 'cashout',
              isCenter: false,
              isSquare: false,
              risk: 92,
              balance: '₹3,18,000',
              location: { city: 'Anna Nagar' },
              layouts: {
                auto: { x: 760, y: 90 },
                radial_funnel: { x: 760, y: 90 },
                linear_relay: { x: 790, y: 120 },
                tree_dispersal: { x: 760, y: 90 },
                circular_ring: { x: 430, y: 270 },
                geo_spatial: { x: 750, y: 100 }
              }
            },
            {
              id: 'CRYPTO1',
              label: 'Tether USDT P2P OTC Desk',
              bank: 'Binance P2P',
              type: 'crypto',
              isCenter: false,
              isSquare: false,
              risk: 96,
              balance: '₹3,30,000',
              location: { city: 'Offshore OTC' },
              layouts: {
                auto: { x: 760, y: 250 },
                radial_funnel: { x: 760, y: 250 },
                linear_relay: { x: 790, y: 220 },
                tree_dispersal: { x: 760, y: 250 },
                circular_ring: { x: 300, y: 200 },
                geo_spatial: { x: 750, y: 240 }
              }
            }
          ],
          edges: [
            { from: 'V1', to: focalAcc, amount: '₹12,50,000', corridor: 'Chennai → Axis', color: '#3B82F6', channel: { type: '1ibft', label: 'IMPS', icon: '⚡', lineColor: '#3B82F6', dashArray: 'none' } },
            { from: 'V2', to: focalAcc, amount: '₹1,50,000', corridor: 'Coimbatore → Axis', color: '#3B82F6', channel: { type: '1ibft', label: 'UPI', icon: '⚡', lineColor: '#3B82F6', dashArray: 'none' } },
            { from: focalAcc, to: 'AC91823', amount: '₹6,00,000', corridor: 'Axis → HDFC', color: '#F59E0B', channel: { type: 'intrabank', label: 'RTGS', icon: '🏦', lineColor: '#F59E0B', dashArray: 'none' } },
            { from: focalAcc, to: 'AC55412', amount: '₹6,50,000', corridor: 'Axis → ICICI', color: '#10B981', channel: { type: 'raast', label: 'NEFT Fast', icon: '⚡', lineColor: '#10B981', dashArray: 'none' } },
            { from: 'AC91823', to: 'AC38192', amount: '₹3,20,000', corridor: 'HDFC → ATM Kiosk', color: '#DC2626', channel: { type: 'atm', label: 'ATM Cashout', icon: '🏧', lineColor: '#DC2626', dashArray: '4 3' } },
            { from: 'AC55412', to: 'CRYPTO1', amount: '₹3,30,000', corridor: 'ICICI → Crypto', color: '#7C3AED', channel: { type: 'crypto', label: 'P2P USDT', icon: '🪙', lineColor: '#7C3AED', dashArray: 'none' } }
          ],
          active_node_statuses: [
            { id: focalAcc, label: `Mule Hub (${focalAcc})`, isFrozen: true },
            { id: 'AC91823', label: 'Layer 2 Transit (AC91823)', isFrozen: false },
            { id: 'AC55412', label: 'Crypto Transit (AC55412)', isFrozen: false },
            { id: 'AC38192', label: 'ATM Exit (Kiosk #09)', isFrozen: true },
            { id: 'CRYPTO1', label: 'Offshore OTC Desk', isFrozen: false }
          ]
        };

        return jsonRes({ success: true, data: trailData });
      }

      if (pathname === '/api/money-trail/multi-node-freeze') {
        return jsonRes({
          success: true,
          message: 'All syndicate nodes frozen under Section 102 CrPC / Section 106 BNSS 2023.'
        });
      }

      // 8. AI Risk Intelligence & SHAP Explainability
      if (pathname === '/api/ai-risk/overview') {
        return jsonRes({
          success: true,
          data: {
            dataset: {
              name: 'Credit Card Fraud Benchmark & Real-time Banking Logs',
              source_file: 'creditcard.csv',
              total_records: 284807,
              fraud_cases: 492,
              legit_cases: 284315,
              fraud_percentage: 0.173,
              imbalance_ratio: '1:578',
              features_count: 30,
              total_volume_usd: 25164210,
              avg_fraud_amount_usd: 122.21,
              avg_legit_amount_usd: 88.29,
              max_fraud_amount_usd: 2125.87,
              max_amount_usd: 25691.16
            }
          }
        });
      }

      if (pathname === '/api/ai-risk/evaluation') {
        return jsonRes({
          success: true,
          data: {
            model_name: 'XGBoost Supervised Gradient Boosting + SMOTE',
            algorithm: 'XGBClassifier (learning_rate=0.08, max_depth=6, scale_pos_weight=578)',
            test_size: 56962,
            test_fraud_cases: 98,
            roc_auc: 0.9842,
            recall: 0.9184,
            precision: 0.9375,
            f1_score: 0.9278,
            accuracy: 0.9994,
            confusion_matrix: {
              true_negatives: 56858,
              false_positives: 6,
              false_negatives: 8,
              true_positives: 90
            },
            threshold_curve: [
              { threshold: 0.1, precision: 0.72, recall: 0.96, f1: 0.82, tp: 94, fp: 36, tn: 56828, fn: 4 },
              { threshold: 0.3, precision: 0.88, recall: 0.94, f1: 0.91, tp: 92, fp: 12, tn: 56852, fn: 6 },
              { threshold: 0.5, precision: 0.938, recall: 0.918, f1: 0.928, tp: 90, fp: 6, tn: 56858, fn: 8 },
              { threshold: 0.7, precision: 0.965, recall: 0.847, f1: 0.902, tp: 83, fp: 3, tn: 56861, fn: 15 },
              { threshold: 0.9, precision: 0.986, recall: 0.724, f1: 0.835, tp: 71, fp: 1, tn: 56863, fn: 27 }
            ]
          }
        });
      }

      if (pathname === '/api/ai-risk/features') {
        return jsonRes({
          success: true,
          data: [
            { feature: 'V14', description: 'Latent PCA Feature 14 (Primary Fraud Anomaly Vector)', gain: 0.342, gain_pct: 34.2, weight: 142, is_top_driver: true },
            { feature: 'V12', description: 'Latent PCA Feature 12 (Device / Behavioral Correlation)', gain: 0.215, gain_pct: 21.5, weight: 98, is_top_driver: true },
            { feature: 'V10', description: 'Latent PCA Feature 10 (Geospatial Velocity Vector)', gain: 0.154, gain_pct: 15.4, weight: 87, is_top_driver: true },
            { feature: 'V17', description: 'Latent PCA Feature 17 (Account Age to Outflow Ratio)', gain: 0.112, gain_pct: 11.2, weight: 64, is_top_driver: true },
            { feature: 'Amount', description: 'Monetary Value of Outflow in INR / USD', gain: 0.089, gain_pct: 8.9, weight: 52, is_top_driver: false },
            { feature: 'V4', description: 'Latent PCA Feature 4 (Rapid Succession Indicator)', gain: 0.054, gain_pct: 5.4, weight: 38, is_top_driver: false },
            { feature: 'V11', description: 'Latent PCA Feature 11 (Channel Anomaly Deviation)', gain: 0.034, gain_pct: 3.4, weight: 24, is_top_driver: false }
          ]
        });
      }

      if (pathname === '/api/ai-risk/transactions') {
        const txList = [
          {
            tx_id: 'TX-CC-284102',
            raw_index: 284102,
            time_seconds: 169842,
            time_formatted: '47h 10m',
            amount_usd: 149.62,
            amount_inr: 1250000,
            amount_formatted: '₹12,50,000',
            class: 1,
            is_fraud: true,
            fraud_probability: 0.942,
            raw_prob: 0.942,
            anomaly_score: 9.4,
            risk_level: 'CRITICAL',
            risk_color: 'red',
            top_features: [
              { feature: 'V14', description: 'Strong negative latent deflection', value: -4.82, impact: '+0.42' },
              { feature: 'V12', description: 'Severe PCA cluster deviation', value: -3.91, impact: '+0.28' }
            ],
            v_features: { Time: 169842, Amount: 149.62, V14: -4.82, V12: -3.91, V10: -2.84, V17: -5.12, V4: 4.19, V11: 3.82 }
          },
          {
            tx_id: 'TX-CC-284103',
            raw_index: 284103,
            time_seconds: 169850,
            time_formatted: '47h 11m',
            amount_usd: 72.10,
            amount_inr: 600000,
            amount_formatted: '₹6,00,000',
            class: 1,
            is_fraud: true,
            fraud_probability: 0.887,
            raw_prob: 0.887,
            anomaly_score: 8.8,
            risk_level: 'HIGH',
            risk_color: 'red',
            top_features: [
              { feature: 'V14', description: 'High anomaly score', value: -3.95, impact: '+0.35' }
            ],
            v_features: { Time: 169850, Amount: 72.10, V14: -3.95, V12: -2.81, V10: -2.10, V17: -4.10, V4: 3.50, V11: 2.90 }
          },
          {
            tx_id: 'TX-CC-284104',
            raw_index: 284104,
            time_seconds: 169865,
            time_formatted: '47h 12m',
            amount_usd: 24.50,
            amount_inr: 14500,
            amount_formatted: '₹14,500',
            class: 0,
            is_fraud: false,
            fraud_probability: 0.032,
            raw_prob: 0.032,
            anomaly_score: 0.3,
            risk_level: 'LOW',
            risk_color: 'emerald',
            top_features: [
              { feature: 'V14', description: 'Within normal cluster bounds', value: 0.24, impact: '-0.15' }
            ],
            v_features: { Time: 169865, Amount: 24.50, V14: 0.24, V12: 0.12, V10: -0.05, V17: 0.18, V4: -0.22, V11: -0.10 }
          }
        ];
        return jsonRes({
          success: true,
          data: {
            transactions: txList,
            total: txList.length,
            totalPages: 1
          }
        });
      }

      if (pathname === '/api/ai-risk/sample-vectors') {
        return jsonRes({
          success: true,
          data: {
            sample_fraud: {
              tx_id: 'TX-SAMPLE-FRAUD-01',
              v_features: { Time: 169842, Amount: 149.62, V14: -4.82, V17: -8.20, V12: -5.10, V10: -6.00, V4: 5.50, V11: 4.00 }
            },
            sample_legit: {
              tx_id: 'TX-SAMPLE-LEGIT-01',
              v_features: { Time: 84210, Amount: 24.50, V14: 0.24, V17: 0.18, V12: 0.12, V10: -0.05, V4: -0.22, V11: -0.10 }
            }
          }
        });
      }

      if (pathname === '/api/ai-risk/predict') {
        return jsonRes({
          success: true,
          fraud_probability: 0.942,
          risk_tier: 'CRITICAL',
          shap_top_features: [
            { feature: 'V14', shap_value: '+0.42' },
            { feature: 'V4', shap_value: '+0.28' },
            { feature: 'Amount', shap_value: '+0.15' }
          ]
        });
      }

      // 9. Attack Intelligence
      if (pathname === '/api/attack-intel') {
        return jsonRes({
          success: true,
          data: {
            active_syndicates: [
              {
                id: 'SYN-01',
                name: 'Storm-0824 (FinThreat Alpha)',
                origin: 'Cross-Border / Southeast Asia Hub',
                threat_level: 'CRITICAL',
                active_mules: 42,
                estimated_monthly_turnover: '₹14.2 Cr',
                modus: 'Deceptive SMS phishing pretending to be bank PAN/KYC updates, pushing remote access Android APKs that capture OTPs and initiate IMPS transfers.',
                targeted_banks: ['State Bank of India', 'HDFC Bank', 'Axis Bank', 'ICICI Bank'],
                c2_infrastructure: ['185.220.101.5:8443', '103.251.167.22:443', 'sbi-kyc-verification.online'],
                iocs: ['APK: com.bank.kyc.update.apk', 'Hash: 4a2b8e...c91a', 'Domain: sbi-kyc-verification.online'],
                associated_cases: ['CASE-2026-089', 'CASE-2026-088']
              },
              {
                id: 'SYN-02',
                name: 'CryptoHawala Nexus',
                origin: 'Offshore P2P Relay',
                threat_level: 'HIGH',
                active_mules: 28,
                estimated_monthly_turnover: '₹22.0 Cr',
                modus: 'Layering proceeds through Indian mule rings into crypto exchanges, using OTC cash desk brokers to convert fiat into USDT within minutes.',
                targeted_banks: ['ICICI Bank', 'Kotak Mahindra', 'Federal Bank'],
                c2_infrastructure: ['45.154.255.89:9001', 'p2p-escrow.darknet.to'],
                iocs: ['Wallet: 0x71C...4f9B (TRC-20 USDT)', 'Telegram Bot: @HawalaEscrowBot'],
                associated_cases: ['CASE-2026-085', 'CASE-2026-084']
              },
              {
                id: 'SYN-03',
                name: 'Deepfake Executive Wire Nexus',
                origin: 'Cyberabad / Western Corridor',
                threat_level: 'CRITICAL',
                active_mules: 16,
                estimated_monthly_turnover: '₹8.5 Cr',
                modus: 'AI audio voice cloning targeting corporate finance managers via spoofed WhatsApp calls instructing urgent RTGS vendor disbursement.',
                targeted_banks: ['HDFC Bank', 'Standard Chartered', 'Axis Bank'],
                c2_infrastructure: ['194.26.29.112:443', 'voice-clone-c2.darknet.is'],
                iocs: ['Audio Sample: SHA256:8b0d2f4a6c8e0b2d4f6a1c3e', 'Phone: +91 91760 99411'],
                associated_cases: ['CASE-2026-087']
              }
            ],
            mitre_attack_mappings: [
              {
                technique_id: 'T1566.002',
                name: 'Spearphishing Link (Malicious APK Delivery)',
                stage: 'Initial Access',
                severity: 'CRITICAL',
                description: 'Adversaries send deceptive SMS/WhatsApp links impersonating bank KYC updates to deliver remote access trojans.',
                detection_rule: 'SIGMA_RULE_APK_REMOTE_CONTROL_ACCESSIBILITY_SERVICE',
                mitigation: 'Domain takedown request to NIXI/Registrar & CERT-In advisory under IT Act Sec 79.'
              },
              {
                technique_id: 'T1110.001',
                name: 'Password Guessing & OTP Interception',
                stage: 'Credential Access',
                severity: 'HIGH',
                description: 'Exploiting stolen duplicate SIMs to intercept 2FA banking SMS OTPs.',
                detection_rule: 'TELCO_SIM_SWAP_VELOCITY_BURST',
                mitigation: 'Automated 24h cooling period mandate on duplicate SIM netbanking transactions.'
              },
              {
                technique_id: 'T1071.001',
                name: 'Web Protocols (HTTPS Fast-Flux C2)',
                stage: 'Command & Control',
                severity: 'CRITICAL',
                description: 'Malware on victim phone communicates with Tor exit nodes or bulletproof proxies.',
                detection_rule: 'SNORT_RULE_TOR_EXIT_HTTPS_BEACONING',
                mitigation: 'Perimeter IP blocklist propagation across telecom gateway firewalls.'
              },
              {
                technique_id: 'T1078.004',
                name: 'Cloud Accounts (P2P Exchange Off-Ramp)',
                stage: 'Exfiltration',
                severity: 'HIGH',
                description: 'Direct conversion of illicit INR bank deposits into crypto tokens via P2P escrow.',
                detection_rule: 'AML_HIGH_FREQUENCY_P2P_EXCHANGE_OUTFLOW',
                mitigation: 'FIU-IND emergency freeze order dispatched to exchange AML compliance officer.'
              }
            ]
          }
        });
      }

      // 10. Domain Intelligence
      if (pathname === '/api/domain-intel') {
        return jsonRes({
          success: true,
          data: {
            flagged_domains: [
              {
                id: 'DOM-01',
                domain: 'sbi-kyc-verification.online',
                phishing_kit: 'Storm-0824 BankPhish v4.2',
                target_bank: 'State Bank of India',
                registrar: 'Hostinger International Ltd',
                created_date: '22 Nov 2026',
                ip_address: '185.220.101.5',
                risk_score: 98.4,
                status: 'ACTIVE_PHISHING',
                takedown_status: 'NOTICE_SERVED_SEC79'
              },
              {
                id: 'DOM-02',
                domain: 'hdfc-netbanking-verify.cc',
                phishing_kit: 'HDFC Credential Harvester v2',
                target_bank: 'HDFC Bank',
                registrar: 'NameCheap Inc.',
                created_date: '23 Nov 2026',
                ip_address: '103.251.167.22',
                risk_score: 96.1,
                status: 'CREDENTIAL_HARVESTER',
                takedown_status: 'NOTICE_SERVED_SEC79'
              },
              {
                id: 'DOM-03',
                domain: 'axis-reward-points-redeem.site',
                phishing_kit: 'Axis OTP Sniffer Kit',
                target_bank: 'Axis Bank',
                registrar: 'Cloudflare Registrar',
                created_date: '20 Nov 2026',
                ip_address: '45.154.255.89',
                risk_score: 92.5,
                status: 'FAST_FLUX_HOSTED',
                takedown_status: 'TAKEDOWN_PENDING'
              },
              {
                id: 'DOM-04',
                domain: 'icici-instant-loan-approval.xyz',
                phishing_kit: 'Predatory Loan Stealer',
                target_bank: 'ICICI Bank',
                registrar: 'Tucows Domains Inc.',
                created_date: '18 Nov 2026',
                ip_address: '194.26.29.112',
                risk_score: 89.2,
                status: 'ACTIVE_PHISHING',
                takedown_status: 'TAKEDOWN_SUCCESSFUL'
              },
              {
                id: 'DOM-05',
                domain: 'pnb-one-kyc-update.com',
                phishing_kit: 'Mobile Banking Clone Kit',
                target_bank: 'Punjab National Bank',
                registrar: 'GoDaddy.com LLC',
                created_date: '24 Nov 2026',
                ip_address: '185.220.101.5',
                risk_score: 95.8,
                status: 'CREDENTIAL_HARVESTER',
                takedown_status: 'NOTICE_SERVED_SEC79'
              }
            ]
          }
        });
      }

      if (pathname === '/api/domain-intel/scan') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        const domainName = body.domain || 'suspect-banking-portal.online';
        return jsonRes({
          success: true,
          data: {
            domain: domainName,
            verdict: 'MALICIOUS_PHISHING_DOMAIN',
            risk_score: 96.8,
            target_bank: 'State Bank of India',
            registrar: 'NameCheap Inc. / Hostinger',
            ip_resolution: '185.220.101.5 (Tor Exit Node)',
            phishing_kit_signature: 'Storm-0824_BankPhish_v4.2',
            notice_draft: `NOTICE UNDER SECTION 79(3)(b) OF THE INFORMATION TECHNOLOGY ACT, 2000:\nTo: Nodal Abuse Officer\nSubject: Formal Statutory Takedown Demand for Illicit Banking Domain: ${domainName}\nInvestigation Case Ref: CASE-2026-089\nThis office has forensic proof of deceptive credential harvesting targeting Indian consumers.`
          }
        });
      }

      // 11. IP Intelligence
      if (pathname === '/api/ip-intel') {
        return jsonRes({
          success: true,
          data: {
            flagged_ips: [
              {
                ip: '185.220.101.5',
                risk_score: 98,
                asn: 'AS60729 (Zwiebelfreunde e.V., Germany)',
                vpn: false,
                tor: true,
                city: 'Frankfurt',
                country: 'Germany',
                isp: 'Zwiebelfreunde Tor Node Operator',
                proxy_type: 'Tor Exit Node (Bulletproof)',
                threat_actor: 'Storm-0824 / FinThreat Alpha',
                total_sessions_24h: 412,
                associated_mules: ['acc_00083575', 'acc_00020535', 'AC78456', 'AC91823'],
                last_detected: '3 mins ago',
                impossible_travel_events: [
                  {
                    from: 'Chennai (IN)',
                    to: 'Frankfurt (DE)',
                    speed_kmh: 4200,
                    status: 'IMPOSSIBLE_TRAVEL_HOP',
                    time: '18:45:12'
                  }
                ]
              },
              {
                ip: '103.251.167.22',
                risk_score: 94,
                asn: 'AS133296 (Camintel S.A., Cambodia)',
                vpn: true,
                tor: false,
                city: 'Phnom Penh',
                country: 'Cambodia',
                isp: 'Southeast Asia Bulletproof Hosting',
                proxy_type: 'Commercial VPN Relay',
                threat_actor: 'CryptoHawala Nexus',
                total_sessions_24h: 284,
                associated_mules: ['AC55412', 'AC44510'],
                last_detected: '12 mins ago',
                impossible_travel_events: [
                  {
                    from: 'Bengaluru (IN)',
                    to: 'Phnom Penh (KH)',
                    speed_kmh: 3650,
                    status: 'IMPOSSIBLE_TRAVEL_HOP',
                    time: '18:42:00'
                  }
                ]
              },
              {
                ip: '45.154.255.89',
                risk_score: 91,
                asn: 'AS44050 (WebHost1 LLC, Russia)',
                vpn: true,
                tor: false,
                city: 'Moscow',
                country: 'Russia',
                isp: 'MowNet Residential Relay',
                proxy_type: 'Residential Proxy Network',
                threat_actor: 'Deepfake Impersonation Ring',
                total_sessions_24h: 178,
                associated_mules: ['AC91823'],
                last_detected: '25 mins ago',
                impossible_travel_events: []
              },
              {
                ip: '194.26.29.112',
                risk_score: 89,
                asn: 'AS200019 (Alexhost SRL, Moldova)',
                vpn: false,
                tor: true,
                city: 'Chisinau',
                country: 'Moldova',
                isp: 'Offshore Bulletproof VPS',
                proxy_type: 'Tor Relay / C2 Proxy',
                threat_actor: 'Storm-0824 C2',
                total_sessions_24h: 96,
                associated_mules: ['AC38192'],
                last_detected: '40 mins ago',
                impossible_travel_events: []
              }
            ]
          }
        });
      }

      if (pathname === '/api/ip-intel/lookup') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        const queryIp = body.ip || '185.220.101.5';
        return jsonRes({
          success: true,
          data: {
            ip: queryIp,
            risk_score: 95,
            asn: 'AS60729 (Zwiebelfreunde e.V.)',
            vpn: true,
            tor: true,
            city: 'Frankfurt',
            country: 'Germany',
            isp: 'Anonymizer Gateway Service',
            proxy_type: 'Tor Exit Node / High-Risk Proxy',
            threat_actor: 'Storm-0824 Syndicate',
            total_sessions_24h: 310,
            associated_mules: ['acc_00083575', 'acc_00020535', 'AC78456'],
            last_detected: 'Just now',
            impossible_travel_events: [
              {
                from: 'Chennai (IN)',
                to: 'Frankfurt (DE)',
                speed_kmh: 4800,
                status: 'IMPOSSIBLE_TRAVEL_HOP',
                time: 'Just now'
              }
            ]
          }
        });
      }

      // 12. Command Centre Metrics & Live Feed
      if (pathname === '/api/command-centre/metrics') {
        return jsonRes({
          success: true,
          data: {
            total_transactions_monitored: '2.8M',
            transactions_growth_pct: '+12.5%',
            suspicious_activities_detected: 1248,
            suspicious_growth_pct: '+28.7%',
            critical_accounts: 37,
            critical_growth_pct: '+5.7%',
            resolved_cases: 892,
            resolved_growth_pct: '+18.2%',
            system_status: 'System Online',
            last_updated: '24 Nov 2026, 18:45:32'
          }
        });
      }

      if (pathname === '/api/pre-attack') {
        return jsonRes({
          success: true,
          data: {
            time_series: [
              { time: '18:00', normal: 22, suspicious: 45, high_risk: 12 },
              { time: '18:05', normal: 28, suspicious: 50, high_risk: 18 },
              { time: '18:10', normal: 25, suspicious: 42, high_risk: 35 },
              { time: '18:15', normal: 30, suspicious: 55, high_risk: 48 },
              { time: '18:20', normal: 38, suspicious: 60, high_risk: 68 },
              { time: '18:25', normal: 42, suspicious: 65, high_risk: 92 }
            ],
            early_warning: {
              title: 'Unusual micro-probe velocity pattern detected!',
              fraud_probability_pct: 92.4,
              potential_exposure_inr: '12,50,000',
              target_account: 'acc_00083575'
            }
          }
        });
      }

      if (pathname === '/api/agents') {
        const agList = [
          { id: 'ag_01', name: 'Transaction Stream Ingestor', role: 'Real-time 1,420 eps velocity surveillance', status: 'ACTIVE', color: '#10B981', health: 99.4, active_tasks: 1420, last_log: 'Monitoring IMPS/RTGS gateway stream. Velocity steady.' },
          { id: 'ag_02', name: 'Multi-Hop Graph Sentinel', role: '5-Hop Money Trail & Smurfing Mapper', status: 'ACTIVE', color: '#3B82F6', health: 98.8, active_tasks: 48, last_log: 'Mapping 5-hop fund traversal from acc_00083575 to Kiosk #09.' },
          { id: 'ag_03', name: 'Mule Detection XGBoost Model', role: 'Behavioral mule scoring & anomaly classifier', status: 'ACTIVE', color: '#8B5CF6', health: 97.5, active_tasks: 34, last_log: 'Scored acc_00083575 at 94.2% risk probability.' },
          { id: 'ag_04', name: 'KYC & Biometric Cross-Referencer', role: 'UIDAI/CKYC/PAN identity verification', status: 'ACTIVE', color: '#F59E0B', health: 99.1, active_tasks: 19, last_log: 'Detected synthetic identity marker on PAN ABCPS1294F.' },
          { id: 'ag_05', name: 'Legal Notice & SOAR Drafter', role: 'Section 102 CrPC statutory warrant compiler', status: 'ACTIVE', color: '#EC4899', health: 100.0, active_tasks: 3, last_log: 'Emergency freeze order compiled for Axis Bank Nodal Officer.' },
          { id: 'ag_06', name: 'Tactical Police Geospatial Dispatcher', role: 'Patrol unit APB & ATM intercept coordinator', status: 'ACTIVE', color: '#06B6D4', health: 98.2, active_tasks: 5, last_log: 'Cheetah-1 PCR unit routed to Anna Nagar Kiosk.' }
        ];
        return jsonRes({
          success: true,
          data: { agents: agList },
          agents: agList,
          agentic_orchestrator: { agents: agList }
        });
      }

      // 13. Digital Twin Simulation
      if (pathname === '/api/digital-twin') {
        return jsonRes({
          success: true,
          data: {
            scenarios: [
              { id: 'scen_velocity_burst', title: 'Scenario A: Velocity Multi-Hop Cashout', description: 'Attacker disperses ₹12.5L across 5 hops in 90s.', threat_level: 'CRITICAL', default_freeze_target: 'acc_00083575' },
              { id: 'scen_crypto_offramp', title: 'Scenario B: P2P Crypto OTC Desk Conversion', description: 'Layer 2 mules transfer into P2P USDT OTC desks within 3m.', threat_level: 'HIGH', default_freeze_target: 'AC91823' },
              { id: 'scen_atm_run', title: 'Scenario C: Coordinated Multi-ATM Cashout Run', description: 'Simultaneous withdrawals across Chennai kiosks.', threat_level: 'HIGH', default_freeze_target: 'AC38192' }
            ]
          }
        });
      }

      if (pathname === '/api/digital-twin/simulate') {
        return jsonRes({
          success: true,
          data: {
            scenario_id: 'scen_velocity_burst',
            projected_fraud_saved: '₹11,40,000 (91.2%)',
            containment_time_sec: 14.2,
            recommended_freeze_node: 'acc_00083575',
            confidence: 97.8,
            simulation_steps: [
              { step: 1, action: 'Pre-Attack Probe Detected', latency: '4.2s', status: 'CONTAINED' },
              { step: 2, action: 'Multi-Agent Consensus Reached', latency: '8.1s', status: 'CONTAINED' },
              { step: 3, action: 'Emergency Lien Placed on Axis Node', latency: '14.2s', status: 'RESOLVED' }
            ]
          }
        });
      }

      if (pathname === '/api/digital-twin/apply-live') {
        return jsonRes({ success: true, message: 'Policy successfully applied.' });
      }

      // 14. Automated Response Management
      if (pathname === '/api/automated-response/approve') {
        return jsonRes({ success: true, status: 'APPROVED', message: 'Action sanctioned under Section 102 CrPC.' });
      }
      if (pathname === '/api/automated-response/reject') {
        return jsonRes({ success: true, status: 'REJECTED', message: 'Action rejected.' });
      }

      // 15. Investigations & Cases
      if (pathname === '/api/investigations' || pathname === '/api/cases') {
        const casesList = [
          {
            id: 'CASE-2026-089',
            title: 'Operation Red Cashout: Cross-Border Mule Syndicate',
            suspect_account: 'acc_00083575',
            linked_accounts: 'AC91823, AC55412, AC44510, AC38192',
            linked_mobile: '+91 98412 88412',
            exposure: '₹14,80,000',
            exposure_val: 1480000,
            severity: 'CRITICAL',
            assigned_officer: 'Inspector Rajesh Kumar',
            last_activity: '10 mins ago',
            status: 'UNDER_INVESTIGATION',
            overview: 'Multi-layered UPI-to-RTGS layering scam originating from fraudulent KYC SIMs in Jamtara, routing through 4 tier mules in Axis & HDFC Bank with planned ATM cashouts in Chennai.',
            complaint_summary: 'Victim (Varun S., Chennai) filed cyber complaint on NCRP Portal (#2026-881923) reporting unauthorized debit of ₹12,50,000 via malicious APK remote access.',
            milestones: [
              { date: '24 Nov 2026, 18:45', text: 'Pre-Attack velocity burst detected by XGBoost & Mule Sentinel Agent.', status: 'COMPLETED' },
              { date: '24 Nov 2026, 18:47', text: 'Evidence package compiled and hashed under SHA-256.', status: 'COMPLETED' },
              { date: '24 Nov 2026, 18:48', text: 'Section 102 CrPC statutory debit freeze warrant drafted.', status: 'COMPLETED' },
              { date: '24 Nov 2026, 18:50', text: 'PCR Unit Cheetah-1 dispatched to ATM Kiosk #09 Anna Nagar.', status: 'IN_PROGRESS' }
            ],
            evidence_count: 5,
            evidence_verified: true,
            evidence_items: [
              { id: 'EVD-8456-01', name: 'Axis_Bank_Statement_acc_00083575.pdf', type: 'FINANCIAL_STATEMENT', size: '2.4 MB', sha256: '9f8a3c8e4d2a1b5c7e9f0a2b4d6e8f1a3c5e7b9d0f2a4c6e8b0d2f4a6c8e0b2', verified: true, integrity_status: 'VERIFIED_TAMPER_FREE' },
              { id: 'EVD-8456-02', name: 'ATM_CCTV_Cashout_Kiosk09.mp4', type: 'CCTV_FOOTAGE', size: '48.2 MB', sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5', verified: true, integrity_status: 'VERIFIED_TAMPER_FREE' }
            ],
            activity_log: [
              { activity_id: 'ACT-901', activity_timestamp: '18:52:10', officer_name: 'Rajesh Kumar', action_description: 'Dispatched emergency APB to Chennai South Sector PCR patrol units.' }
            ]
          },
          {
            id: 'CASE-2026-088',
            title: 'Instant Loan App Extortion & Crypto Off-Ramp Ring',
            suspect_account: 'AC91823',
            linked_accounts: 'AC33104, AC88912',
            linked_mobile: '+91 94451 22910',
            exposure: '₹45,20,000',
            exposure_val: 4520000,
            severity: 'CRITICAL',
            assigned_officer: 'DSP Anita Sundaram',
            last_activity: '25 mins ago',
            status: 'UNDER_INVESTIGATION',
            overview: 'Predatory lending app syndicate harvesting victim contacts and extorting funds into mule rings before conversion to USDT on P2P exchanges.',
            complaint_summary: 'Consolidated complaints across cyber cells.',
            milestones: [
              { date: '24 Nov 2026, 17:10', text: 'Takedown notice sent to Registrar for 6 phishing APK domains.', status: 'COMPLETED' }
            ],
            evidence_count: 3,
            evidence_verified: true,
            evidence_items: [],
            activity_log: []
          }
        ];
        return jsonRes({
          success: true,
          data: casesList,
          cases: casesList,
          total: casesList.length,
          totalPages: 1
        });
      }

      // 16. Evidence Management
      if (pathname === '/api/evidence') {
        const evList = [
          {
            id: 'EVD-2026-01',
            name: 'Axis_Bank_Statement_acc_00083575.pdf',
            type: 'FINANCIAL_STATEMENT',
            size: '2.4 MB',
            sha256: '9f8a3c8e4d2a1b5c7e9f0a2b4d6e8f1a3c5e7b9d0f2a4c6e8b0d2f4a6c8e0b2',
            verified: true,
            sec65b_certified: true,
            case_id: 'CASE-2026-089',
            target_account: 'acc_00083575',
            upload_date: '2026-11-24 18:47:12',
            uploaded_by: 'Inspector Rajesh Kumar',
            integrity_status: 'VERIFIED_TAMPER_FREE'
          },
          {
            id: 'EVD-2026-02',
            name: 'ATM_CCTV_Cashout_Kiosk09.mp4',
            type: 'CCTV_FOOTAGE',
            size: '48.2 MB',
            sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
            verified: true,
            sec65b_certified: true,
            case_id: 'CASE-2026-089',
            target_account: 'acc_00083575',
            upload_date: '2026-11-24 18:50:00',
            uploaded_by: 'Inspector Rajesh Kumar',
            integrity_status: 'VERIFIED_TAMPER_FREE'
          }
        ];
        return jsonRes({ success: true, data: evList });
      }

      if (pathname.match(/^\/api\/evidence\/[^\/]+\/sec65b$/)) {
        return jsonRes({
          success: true,
          data: {
            certificate_number: 'SEC65B/2026/TN/CYBER-089',
            statute: 'Section 65B Indian Evidence Act 1872 / Section 63 Bharatiya Sakshya Adhiniyam 2023',
            hash_sha256: '9f8a3c8e4d2a1b5c7e9f0a2b4d6e8f1a3c5e7b9d0f2a4c6e8b0d2f4a6c8e0b2',
            digital_signature: 'CERT-IN-CYBER-ANALYST-TN-8921-RSA2048',
            officer_name: 'Inspector Rajesh Kumar',
            officer_designation: 'Cyber Crime Division, Police Commissionerate, Chennai',
            court_jurisdiction: 'Hon’ble Special Court for Cyber & Economic Offences',
            issue_date: '24 November 2026, 18:48:32',
            court_admissible: true,
            storage_medium: 'Encrypted Forensic NVMe Array (Block #89124)'
          }
        });
      }

      if (pathname === '/api/evidence/verify') {
        return jsonRes({
          success: true,
          data: {
            verified: true,
            sha256_match: true,
            chain_of_custody_intact: true,
            timestamp: new Date().toISOString()
          }
        });
      }

      // 17. Reports, Audit, Settings
      if (pathname === '/api/reports') {
        const repList = [
          {
            id: 'REP-2026-089A',
            case_id: 'CASE-2026-089',
            title: 'Comprehensive FIU Court-Admissible Forensic Dossier',
            classification: 'STRICTLY CONFIDENTIAL // FIU-IND SUBMISSION',
            suspect: 'Farhan Zaidi (Linked to Jamtara Syndicate)',
            target_account: 'acc_00083575',
            exposure: '₹14,80,000',
            signatory: 'Inspector Rajesh Kumar (Cyber Crime Division)',
            generated_at: '24 Nov 2026, 18:50',
            status: 'READY_COURT_SUBMISSION',
            report_type: 'FIU_COURT_ADMISSIBLE_DOSSIER',
            sha256: '9f8a3c8e4d2a1b5c7e9f0a2b4d6e8f1a3c5e7b9d0f2a4c6e8b0d2f4a6c8e0b2',
            barcode_data: 'FINTRACE-REP-2026-089A-SHA256-VALID-SEC65B',
            qr_data: 'https://fintrace.gov.in/verify/REP-2026-089A',
            sections_included: [
              "Executive Summary & Threat Attribution",
              "XGBoost Model Inference & Tree SHAP Feature Decomposition",
              "Money Trail Multi-Hop Network Topology",
              "Cryptographic Chain of Custody & Section 65B Certificate"
            ]
          },
          {
            id: 'REP-2026-042B',
            case_id: 'CASE-2026-042',
            title: 'Section 102 CrPC Statutory Debit Freeze Order',
            classification: 'URGENT // STATUTORY BANK DIRECTIVE',
            suspect: 'Pooja Verma (Pass-Through Mule Conduit)',
            target_account: 'acc_00020535',
            exposure: '₹9,46,554',
            signatory: 'Assistant Commissioner S. Sundaram',
            generated_at: '24 Nov 2026, 17:30',
            status: 'SERVED_TO_NODAL_OFFICER',
            report_type: 'BANK_FREEZE_STATUTORY_NOTICE',
            sha256: '8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7',
            barcode_data: 'FINTRACE-REP-2026-042B-SHA256-VALID-SEC65B',
            qr_data: 'https://fintrace.gov.in/verify/REP-2026-042B',
            sections_included: [
              "Statutory Legal Notice under Section 102 CrPC / Section 106 BNSS",
              "Beneficiary Mule Account Identification & Nodal Routing",
              "Forensic Inflow Velocity & Account Lien Justification",
              "Judicial Cryptographic Seal & IO Signature"
            ]
          }
        ];
        return jsonRes({ success: true, data: { reports: repList } });
      }

      if (pathname.startsWith('/api/reports/') && pathname.endsWith('/csv')) {
        const csvContent = `Record_ID,Hop_Level,Timestamp,Source_Account,Source_Bank,Destination_Account,Destination_Bank,Amount_INR,Payment_Channel,UTR_Number,Typology_Risk_Flag,Status,Cryptographic_Hash
TXN-001,HOP_1,2026-11-24 18:45:12,ACC-VICTIM-VARUN,HDFC Bank,acc_00083575,Axis Bank,1480000.00,IMPS,UTR9812401824,PRIMARY_PHISHING_INFLOW,CONFIRMED_FRAUD,9f8a3c8e4d2a1b5c7e9f0a2b4d6e8f1a
TXN-002,HOP_2,2026-11-24 18:46:00,acc_00083575,Axis Bank,AC91823,HDFC Bank,600000.00,RTGS,UTR9812401825,LAYER_1_RAPID_SPLIT,CONDUIT_MULE,a1b2c3d4e5f60718293a4b5c6d7e8f9a
TXN-003,HOP_2,2026-11-24 18:46:30,acc_00083575,Axis Bank,AC55412,ICICI Bank,650000.00,NEFT,UTR9812401826,LAYER_1_RAPID_SPLIT,CONDUIT_MULE,b2c3d4e5f60718293a4b5c6d7e8f9a0b
TXN-004,HOP_3,2026-11-24 18:47:10,AC91823,HDFC Bank,AC44510,State Bank of India,580000.00,IMPS,UTR9812401827,LAYER_2_SMURFING,PASS_THROUGH_MULE,c3d4e5f60718293a4b5c6d7e8f9a0b1c
TXN-005,HOP_3,2026-11-24 18:48:00,AC55412,ICICI Bank,AC38192,Punjab National Bank,320000.00,UPI,UTR9812401828,LAYER_2_PASS_THROUGH,PASS_THROUGH_MULE,d4e5f60718293a4b5c6d7e8f9a0b1c2d
TXN-006,HOP_4,2026-11-24 18:48:12,AC38192,Punjab National Bank,ATM-KIOSK-09,ATM Anna Salai Chennai,150000.00,ATM_WITHDRAWAL,ATM-CASH-TXN-01,CRITICAL_CASHOUT,CASH_DRAINED,e5f60718293a4b5c6d7e8f9a0b1c2d3e`;
        return new Response(csvContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="Forensic_Dossier_REP-2026-089A.csv"'
          }
        });
      }

      if (pathname === '/api/reports/verify-barcode') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        const bData = body.barcode_data || '';
        const isTampered = bData.includes('TAMPERED') || bData.includes('INVALID');

        return jsonRes({
          success: true,
          valid: !isTampered,
          status: isTampered ? "TAMPERED_COMPROMISED" : "AUTHENTIC_VERIFIED",
          barcode_data: bData,
          verification: {
            immutable_ledger_hash: isTampered 
              ? "0000000000000000000000000000000000000000000000000000000000000000" 
              : "9f8a3c8e4d2a1b5c7e9f0a2b4d6e8f1a3c5e7b9d0f2a4c6e8b0d2f4a6c8e0b2",
            verified_at: new Date().toISOString(),
            algorithm: "SHA-256 + ECDSA secp256k1 Judicial Stamp"
          },
          report: {
            id: 'REP-2026-089A',
            case_id: 'CASE-2026-089',
            title: 'Comprehensive FIU Court-Admissible Forensic Dossier',
            classification: 'STRICTLY CONFIDENTIAL // FIU-IND SUBMISSION',
            suspect: 'Farhan Zaidi (Linked to Jamtara Syndicate)',
            target_account: 'acc_00083575',
            exposure: '₹14,80,000',
            signatory: 'Inspector Rajesh Kumar (Cyber Crime Division)',
            generated_at: '24 Nov 2026, 18:50',
            sha256: '9f8a3c8e4d2a1b5c7e9f0a2b4d6e8f1a3c5e7b9d0f2a4c6e8b0d2f4a6c8e0b2',
            sections_included: [
              "Executive Summary & Threat Attribution",
              "XGBoost Model Inference & Tree SHAP Feature Decomposition",
              "Money Trail Multi-Hop Network Topology",
              "Cryptographic Chain of Custody & Section 65B Certificate"
            ]
          }
        });
      }

      if (pathname === '/api/reports/generate') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        const repId = `REP-2026-${Math.floor(100 + Math.random() * 900)}B`;
        const newRep = {
          id: repId,
          case_id: body.case_id || 'CASE-2026-089',
          title: body.report_type === 'FIU_COURT_ADMISSIBLE_DOSSIER' 
            ? 'Comprehensive FIU Court-Admissible Forensic Dossier' 
            : 'Statutory Police Debit Freeze Directive',
          classification: 'STRICTLY CONFIDENTIAL // JUDICIAL SUBMISSION',
          suspect: 'Farhan Zaidi (Jamtara Phishing Ring)',
          target_account: body.target_account || 'acc_00083575',
          exposure: '₹14,80,000',
          signatory: 'Inspector Rajesh Kumar (Cyber Crime Division)',
          generated_at: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          sha256: 'a9b8c7d6e5f403123456789abcdef0123456789abcdef0123456789abcdef012',
          sections_included: [
            "Executive Summary & Threat Attribution",
            "XGBoost Model Inference & Tree SHAP Feature Decomposition",
            "Money Trail Multi-Hop Network Topology",
            "Cryptographic Chain of Custody & Section 65B Certificate"
          ]
        };
        return jsonRes({ success: true, data: newRep });
      }

      if (pathname === '/api/audit-logs') {
        const auditList = [
          {
            log_id: 'LOG-2026-001',
            timestamp: '2026-11-24 18:48:32',
            actor: 'Inspector Rajesh Kumar',
            role: 'LEAD_INVESTIGATOR',
            action: 'EMERGENCY_DEBIT_FREEZE_SIGN',
            target: 'acc_00083575 (Axis Bank)',
            ip_address: '10.240.18.91',
            previous_hash: '0x3a4b...c8d9',
            block_hash: '0x7b4a...b4a3',
            verified: true,
            details: 'Section 102 CrPC debit freeze enacted.'
          }
        ];
        return jsonRes({ success: true, data: auditList });
      }

      if (pathname === '/api/audit-logs/verify') {
        return jsonRes({
          success: true,
          data: {
            chain_valid: true,
            blocks_verified: 14,
            root_hash: '0x89f4e28ab091ca2e',
            tamper_detected: false,
            last_verified: new Date().toLocaleString()
          }
        });
      }

      if (pathname === '/api/settings') {
        if (init && init.method === 'POST') {
          return jsonRes({
            success: true,
            message: "Production parameters and detection thresholds updated successfully."
          });
        }
        return jsonRes({
          success: true,
          data: {
            system_mode: 'PRODUCTION_FORENSIC',
            auto_freeze_threshold: 95.0,
            require_mfa: true,
            audit_retention_days: 2555,
            session_timeout_mins: 30,
            enabled_integrations: ['RBI_CYBER_CRISIS', 'NCRP_CISP', 'FINNET_2_0'],
            model_thresholds: {
              xgboost_critical_fraud_threshold: 0.85,
              mule_ratio: 0.90,
              velocity_limit: 8,
              dormancy_days: 90,
              impossible_speed: 800,
              pii_masking: true
            },
            users: [
              {
                id: 'USR-01',
                name: 'Inspector Rajesh Kumar',
                email: 'rajesh.kumar@cybercrime.gov.in',
                role: 'Lead Forensic Investigator',
                clearance_level: 'TOP_SECRET // LEA',
                status: 'ACTIVE'
              },
              {
                id: 'USR-02',
                name: 'Superintendent Anita Sharma',
                email: 'anita.sharma@fiu.gov.in',
                role: 'FIU Statutory Officer',
                clearance_level: 'TOP_SECRET // JUDICIAL',
                status: 'ACTIVE'
              },
              {
                id: 'USR-03',
                name: 'Vikramaditya Rao',
                email: 'vikram.rao@fintrace.gov.in',
                role: 'SOC Commander & Platform Lead',
                clearance_level: 'SECRET // SEC_OPS',
                status: 'ACTIVE'
              },
              {
                id: 'USR-04',
                name: 'S. Sundaram',
                email: 'sundaram.s@police.tn.gov.in',
                role: 'Assistant Commissioner of Police',
                clearance_level: 'TOP_SECRET // LEA',
                status: 'ACTIVE'
              }
            ]
          }
        });
      }

      // 18. SOC Operations, AWS DevOps & Python ML Microservice
      if (pathname === '/api/soc/operations') {
        return jsonRes({
          success: true,
          data: {
            threat_level: "DEFCON 3 // ELEVATED (Active Financial Syndicate Hunt)",
            kpi: {
              mttd_seconds: 42,
              mttr_minutes: 3.8,
              events_per_second: 1420,
              suppressed_false_positive_pct: 96.4
            },
            incidents: [
              {
                id: "INC-8491",
                severity: "CRITICAL",
                time: "2m ago",
                title: "High-Velocity Mule Layer-1 Account Dispersion",
                account_no: "acc_00083575",
                bank: "Axis Bank",
                amount: "₹14,80,000",
                analyst: "Inspector Rajesh Kumar",
                containment_status: "ACTIVE_THREAT"
              },
              {
                id: "INC-8490",
                severity: "HIGH",
                time: "8m ago",
                title: "Rapid Hawala Smurfing to Multiple Wallets",
                account_no: "acc_00020535",
                bank: "HDFC Bank",
                amount: "₹9,46,554",
                analyst: "S. Sundaram (ACP)",
                containment_status: "DEBIT_RESTRICTED"
              },
              {
                id: "INC-8488",
                severity: "CRITICAL",
                time: "14m ago",
                title: "SIM-Swap Correlated Physical ATM Drainage",
                account_no: "AC55412",
                bank: "ICICI Bank",
                amount: "₹6,50,000",
                analyst: "Anita Sharma (FIU Lead)",
                containment_status: "ACTIVE_THREAT"
              }
            ],
            soar_playbooks: [
              {
                id: "PB-01",
                name: "Section 102 CrPC Automated Debit Freeze",
                status: "ENABLED",
                trigger: "XGBoost Prob > 85%",
                execution_time: "240ms"
              },
              {
                id: "PB-02",
                name: "Cell Tower Colocation & PCR Intercept Alert",
                status: "ENABLED",
                trigger: "Distance to ATM < 50m",
                execution_time: "380ms"
              },
              {
                id: "PB-03",
                name: "Interbank STR Telemetry Dispatch",
                status: "ENABLED",
                trigger: "Multi-Hop Velocity > 4 hops/min",
                execution_time: "510ms"
              }
            ],
            analyst_roster: [
              {
                tier: "Tier-1 Cyber Triage Unit",
                status: "ACTIVE SHIFT",
                lead: "Inspector Rajesh Kumar",
                analysts_active: "6 Officers"
              },
              {
                tier: "Tier-2 Forensic Graph Investigation",
                status: "ON-CALL READY",
                lead: "Anita Sharma",
                analysts_active: "4 Analysts"
              },
              {
                tier: "Tier-3 SOAR Automation & ML DevOps",
                status: "ACTIVE 24/7",
                lead: "Vikramaditya Rao",
                analysts_active: "3 Engineers"
              }
            ],
            siem_connectors: [
              {
                name: "Splunk Enterprise Security (CISP)",
                status: "CONNECTED",
                type: "Syslog / CEF Bridge",
                latency: "12ms (Normal)"
              },
              {
                name: "CrowdStrike Falcon EDR Core",
                status: "CONNECTED",
                type: "REST API v2 Streaming",
                latency: "18ms (Optimal)"
              },
              {
                name: "RBI Cyber Crisis Management Cell",
                status: "CONNECTED",
                type: "Encrypted VPN Tunnel",
                latency: "28ms (Synchronized)"
              }
            ]
          }
        });
      }

      if (pathname === '/api/soc/execute-containment') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        return jsonRes({
          success: true,
          message: `Statutory containment executed on ticket ${body.incident_id || 'INC-8491'}. Emergency debit restriction applied under Section 102 CrPC.`
        });
      }

      if (pathname === '/api/soc/toggle-playbook') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        return jsonRes({
          success: true,
          message: `Playbook ${body.playbook_id || 'PB-01'} state toggled.`
        });
      }

      if (pathname === '/api/devops/aws-cloud') {
        return jsonRes({
          success: true,
          data: {
            region: "ap-south-1",
            region_name: "Asia Pacific (Mumbai)",
            available_regions: [
              { id: 'ap-south-1', name: 'Mumbai (Primary)', latency: '12ms' },
              { id: 'ap-south-2', name: 'Hyderabad (DR)', latency: '24ms' },
              { id: 'ap-southeast-1', name: 'Singapore', latency: '48ms' }
            ],
            infrastructure: {
              eks_cluster: {
                name: "cyberhxa-prod-eks",
                status: "ACTIVE",
                nodes_healthy: 8,
                pods_running: 24,
                cpu_utilization_pct: 32
              },
              sagemaker: {
                endpoint_name: "cyberhxa-xgboost-fraud-v2",
                status: "InService",
                p99_latency_ms: 11.4,
                invocation_rate_rpm: 4820,
                model_drift_index: 0.012
              },
              s3_vault: {
                bucket_name: "cyberhxa-evidence-vault",
                dossiers_sealed: 4725
              },
              waf_and_guardduty: {
                security_hub_score: "98.6%",
                waf_blocked_requests_24h: 18450
              }
            },
            ci_cd_pipeline: {
              build_number: "#184",
              commit: "a8f9c1d",
              stages: [
                { name: "Git Ingestion & Lint", duration: "18s", status: "PASSED" },
                { name: "SAST & Dependency Audit", duration: "45s", status: "PASSED" },
                { name: "XGBoost Benchmark Evals", duration: "1m 12s", status: "PASSED" },
                { name: "Container Seal & Sign", duration: "22s", status: "PASSED" },
                { name: "EKS Blue/Green Deploy", duration: "35s", status: "ACTIVE" }
              ]
            },
            cloudwatch_logs: [
              { timestamp: "2026-11-24T18:50:12.412Z", pod: "fintrace-worker-841f9", level: "SUCCESS", message: "EKS worker ingested Kafka stream partition #04 [1,420 eps]" },
              { timestamp: "2026-11-24T18:49:58.204Z", pod: "fintrace-xgboost-32d1", level: "INFO", message: "SageMaker endpoint scored batch #9028; latency p99=11.2ms" },
              { timestamp: "2026-11-24T18:49:15.891Z", pod: "fintrace-gateway-01a", level: "SUCCESS", message: "WAF verified incoming banking webhook signature from Axis Bank Gateway" },
              { timestamp: "2026-11-24T18:48:42.110Z", pod: "fintrace-vault-daemon", level: "SUCCESS", message: "S3 Object Lock: sealed dossier REP-2026-089A with SHA-256 integrity tag" }
            ]
          }
        });
      }

      if (pathname === '/api/devops/trigger-canary') {
        return jsonRes({
          success: true,
          canary: { version: "v2.4.1-rc3" }
        });
      }

      if (pathname === '/api/devops/switch-region') {
        let body = {};
        try { body = init && init.body ? JSON.parse(init.body) : {}; } catch(e){}
        return jsonRes({
          success: true,
          region: body.region || "ap-south-1"
        });
      }

      if (pathname === '/api/ml-service/status') {
        return jsonRes({
          success: true,
          data: {
            connected: true,
            latency_ms: 2
          }
        });
      }

      if (pathname === '/api/ml-service/infer') {
        return jsonRes({
          success: true,
          source: "FastAPI XGBoost Engine",
          data: {
            account_no: "AC78456",
            fraud_probability: 94.8,
            risk_classification: "CRITICAL",
            is_fraud_predicted: true,
            shap_contributions: [
              { feature: "V14_ratio_inflow", contribution: 34.2 },
              { feature: "velocity_delta_60s", contribution: 28.4 },
              { feature: "sim_swap_indicator", contribution: 19.1 },
              { feature: "geo_impossible_speed", contribution: 18.3 }
            ]
          }
        });
      }

      // Default fallback
      return jsonRes({ success: true, data: {} });
    }

    return originalFetch.apply(this, arguments);
  };

  console.log('[FINTRACE] Master Forensic Intelligence Engine successfully hooked into window.fetch.');
})();
'''

with open('mock-api.js', 'w', encoding='utf-8') as f:
    f.write(mock_code)

print("Generated mock-api.js successfully!")
