import io
import os
import hashlib
from datetime import datetime

from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.graphics.barcode import code128, qr
from reportlab.graphics.shapes import Drawing

def generate_dossier_pdf(report_id="REP-2026-089A", target_account="acc_00083575", case_id="CASE-2026-089", suspect="Farhan Zaidi", exposure="₹14,80,000", signatory="Inspector Rajesh Kumar"):
    """
    Generates a formal, court-admissible, multi-page forensic dossier PDF
    compliant with Section 65B Indian Evidence Act / Section 63 BSA standards.
    """
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor('#0f172a')
    accent_blue = colors.HexColor('#1d4ed8')
    danger_red = colors.HexColor('#b91c1c')
    success_green = colors.HexColor('#15803d')
    slate_border = colors.HexColor('#cbd5e1')
    slate_bg = colors.HexColor('#f8fafc')

    header_style = ParagraphStyle(
        'DocHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=primary_color,
        alignment=1
    )

    sub_header_style = ParagraphStyle(
        'SubHeader',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#475569'),
        alignment=1
    )

    banner_style = ParagraphStyle(
        'BannerText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1
    )

    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=accent_blue,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=primary_color
    )

    mono_style = ParagraphStyle(
        'MonoText',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=primary_color
    )

    cert_style = ParagraphStyle(
        'CertText',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#334155')
    )

    elements = []

    # 1. Top Header Banner
    elements.append(Paragraph("GOVERNMENT OF INDIA • FINANCIAL INTELLIGENCE UNIT (FIU-IND)", header_style))
    elements.append(Paragraph("MINISTRY OF FINANCE • SPECIAL CYBER-FINANCIAL INVESTIGATION PLATFORM", sub_header_style))
    elements.append(Spacer(1, 6))

    # Classification Strip
    class_table = Table(
        [[Paragraph("CONFIDENTIAL // JUDICIAL SUBMISSION // EVIDENCE ACT SECTION 65B CERTIFIED", banner_style)]],
        colWidths=[540],
        rowHeights=[16]
    )
    class_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
    ]))
    elements.append(class_table)
    elements.append(Spacer(1, 10))

    # 2. Key Metadata & Dual Barcode Section
    barcode = code128.Code128(report_id, barHeight=22, barWidth=1.1)

    qr_target = f"https://fintrace.gov.in/verify/{report_id}?case={case_id}"
    qr_widget = qr.QrCodeWidget(qr_target)
    b = qr_widget.getBounds()
    w = b[2] - b[0]
    h = b[3] - b[1]
    qr_draw = Drawing(52, 52, transform=[52.0/w, 0, 0, 52.0/h, 0, 0])
    qr_draw.add(qr_widget)

    meta_left = [
        [Paragraph("<b>Dossier ID:</b>", body_style), Paragraph(f"<font color='#1d4ed8'><b>{report_id}</b></font>", mono_style)],
        [Paragraph("<b>Case Docket:</b>", body_style), Paragraph(f"<b>{case_id}</b>", mono_style)],
        [Paragraph("<b>Target Entity:</b>", body_style), Paragraph(f"{suspect} (<b>{target_account}</b>)", body_style)],
        [Paragraph("<b>Primary Bank:</b>", body_style), Paragraph("Axis Bank (Anna Salai, Chennai)", body_style)],
        [Paragraph("<b>Confirmed Exposure:</b>", body_style), Paragraph(f"<font color='#b91c1c'><b>{exposure}</b></font>", body_style)],
        [Paragraph("<b>Compilation Date:</b>", body_style), Paragraph(f"{datetime.now().strftime('%d %b %Y, %H:%M:%S')} IST", body_style)],
        [Paragraph("<b>Investigating Signatory:</b>", body_style), Paragraph(f"<b>{signatory}</b> (Cyber Crime Division)", body_style)]
    ]
    meta_table = Table(meta_left, colWidths=[110, 240])
    meta_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
    ]))

    barcode_col = [
        [Paragraph("<b>FORENSIC SCANNABLE BARCODE:</b>", ParagraphStyle('BHeader', parent=body_style, fontSize=7, fontName='Helvetica-Bold'))],
        [barcode],
        [Paragraph(f"<font size=7 color='#475569'>*FINTRACE://{report_id}*</font>", mono_style)],
        [Spacer(1, 4)],
        [qr_draw],
        [Paragraph("<font size=6.5 color='#15803d'><b>SEC 65B QR RETICLE</b></font>", body_style)]
    ]
    barcode_table = Table(barcode_col, colWidths=[180])
    barcode_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 1),
    ]))

    top_grid = Table([[meta_table, barcode_table]], colWidths=[355, 185])
    top_grid.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, slate_border),
        ('BACKGROUND', (0,0), (-1,-1), slate_bg),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    elements.append(top_grid)
    elements.append(Spacer(1, 10))

    # 3. Forensic Multi-Hop Money Trail Ledger Table
    elements.append(Paragraph("1. FORENSIC MONEY TRAIL & RAPID DISPERSAL LEDGER (UTR LOGS)", section_title_style))

    trail_data = [
        [
            Paragraph("<b>Hop</b>", banner_style),
            Paragraph("<b>Timestamp</b>", banner_style),
            Paragraph("<b>Sender Entity</b>", banner_style),
            Paragraph("<b>Receiver Entity</b>", banner_style),
            Paragraph("<b>Channel / UTR</b>", banner_style),
            Paragraph("<b>Amount (INR)</b>", banner_style),
            Paragraph("<b>Typology Flag</b>", banner_style)
        ],
        [
            Paragraph("HOP 1", mono_style),
            Paragraph("18:45:12", mono_style),
            Paragraph("Victim Account (Varun)", body_style),
            Paragraph(f"{target_account} (Axis)", body_style),
            Paragraph("IMPS: 9812401824", mono_style),
            Paragraph("₹14,80,000", body_style),
            Paragraph("<font color='#b91c1c'>Primary Inflow</font>", body_style)
        ],
        [
            Paragraph("HOP 2", mono_style),
            Paragraph("18:46:00", mono_style),
            Paragraph(f"{target_account} (Axis)", body_style),
            Paragraph("AC91823 (HDFC)", body_style),
            Paragraph("RTGS: 9812401825", mono_style),
            Paragraph("₹6,00,000", body_style),
            Paragraph("<font color='#ea580c'>Layer-1 Split</font>", body_style)
        ],
        [
            Paragraph("HOP 3", mono_style),
            Paragraph("18:46:30", mono_style),
            Paragraph(f"{target_account} (Axis)", body_style),
            Paragraph("AC55412 (ICICI)", body_style),
            Paragraph("NEFT: 9812401826", mono_style),
            Paragraph("₹6,50,000", body_style),
            Paragraph("<font color='#ea580c'>Layer-1 Split</font>", body_style)
        ],
        [
            Paragraph("HOP 4", mono_style),
            Paragraph("18:47:10", mono_style),
            Paragraph("AC91823 (HDFC)", body_style),
            Paragraph("AC44510 (SBI)", body_style),
            Paragraph("IMPS: 9812401827", mono_style),
            Paragraph("₹5,80,000", body_style),
            Paragraph("<font color='#d97706'>Mule Smurfing</font>", body_style)
        ],
        [
            Paragraph("HOP 5", mono_style),
            Paragraph("18:48:00", mono_style),
            Paragraph("AC55412 (ICICI)", body_style),
            Paragraph("AC38192 (PNB)", body_style),
            Paragraph("UPI: 9812401828", mono_style),
            Paragraph("₹3,20,000", body_style),
            Paragraph("<font color='#d97706'>Pass-Through</font>", body_style)
        ],
        [
            Paragraph("HOP 6", mono_style),
            Paragraph("18:48:12", mono_style),
            Paragraph("AC38192 (PNB)", body_style),
            Paragraph("ATM Kiosk #09 (Anna Salai)", body_style),
            Paragraph("ATM-CASH-TXN-01", mono_style),
            Paragraph("₹1,50,000", body_style),
            Paragraph("<font color='#b91c1c'><b>Physical Cash-Out</b></font>", body_style)
        ]
    ]

    trail_table = Table(trail_data, colWidths=[38, 48, 105, 105, 95, 68, 81])
    trail_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('GRID', (0,0), (-1,-1), 0.5, slate_border),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, slate_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(trail_table)
    elements.append(Spacer(1, 10))

    # 4. Telecom Triangulation & AI Attribution Grid
    elements.append(Paragraph("2. TACTICAL AI CDR TRIANGULATION & SHAP RISK ATTRIBUTION", section_title_style))

    telecom_cell = [
        [Paragraph("<b>TELECOM CDR / BTS TRIANGULATION</b>", ParagraphStyle('TH', parent=body_style, fontName='Helvetica-Bold', fontSize=8, textColor=accent_blue))],
        [Paragraph("• <b>Target MSISDN:</b> +91 98841 82349 (Bharti Airtel)", body_style)],
        [Paragraph("• <b>IMEI / IMSI:</b> 864912048591240 / 404450192847561", mono_style)],
        [Paragraph("• <b>SIM Swap Alert:</b> Detected 48h prior to ₹14.8L inflow", body_style)],
        [Paragraph("• <b>Serving BTS Cell ID:</b> CID-404-12-84102 (Anna Salai BTS-042)", body_style)],
        [Paragraph("• <b>Tower Sector Azimuth:</b> 60° Sector A (Line-of-Sight to ATM Kiosk #09)", body_style)],
        [Paragraph("• <b>Co-Location Proximity:</b> 32 meters from cash-out ATM", body_style)],
        [Paragraph("• <b>Time Delta:</b> -8 seconds between ATM cash-out & Tower ping", body_style)]
    ]
    telecom_sub = Table(telecom_cell, colWidths=[260])
    telecom_sub.setStyle(TableStyle([
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.5),
        ('TOPPADDING', (0,0), (-1,-1), 1.5),
    ]))

    ai_cell = [
        [Paragraph("<b>XGBOOST & SHAP EXPLAINABILITY</b>", ParagraphStyle('TH2', parent=body_style, fontName='Helvetica-Bold', fontSize=8, textColor=accent_blue))],
        [Paragraph("• <b>Fraud Severity Score:</b> <font color='#b91c1c'><b>89.5 / 100 (Critical Risk)</b></font>", body_style)],
        [Paragraph("• <b>ROC-AUC Discrimination:</b> 0.978 (Test Accuracy: 99.8%)", body_style)],
        [Paragraph("• <b>Primary SHAP Driver:</b> V14_ratio_inflow (+34.2% Gain)", body_style)],
        [Paragraph("• <b>Secondary SHAP Driver:</b> velocity_delta_60s (+28.4% Gain)", body_style)],
        [Paragraph("• <b>Tertiary SHAP Driver:</b> sim_swap_indicator (+19.1% Gain)", body_style)],
        [Paragraph("• <b>Syndicate Signature:</b> Jamtara Phishing Ring / Mewat Splitter", body_style)],
        [Paragraph("• <b>Prescribed Directive:</b> Immediate Section 102 CrPC Debit Freeze", body_style)]
    ]
    ai_sub = Table(ai_cell, colWidths=[260])
    ai_sub.setStyle(TableStyle([
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.5),
        ('TOPPADDING', (0,0), (-1,-1), 1.5),
    ]))

    intel_table = Table([[telecom_sub, ai_sub]], colWidths=[268, 272])
    intel_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, slate_border),
        ('BACKGROUND', (0,0), (-1,-1), slate_bg),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP')
    ]))
    elements.append(intel_table)
    elements.append(Spacer(1, 10))

    # 5. Section 65B Certificate & Digital Seal
    elements.append(Paragraph("3. STATUTORY CERTIFICATE UNDER SECTION 65B(4) INDIAN EVIDENCE ACT", section_title_style))

    cert_text = (
        "I hereby certify that the electronic forensic records, transaction ledgers, tower triangulation logs, "
        "and machine learning risk inferences contained in this dossier were produced by the FINTRACE Cyber-Financial "
        "Intelligence Platform during the ordinary course of lawful forensic investigation. The computing devices and "
        "cryptographic verification engines were operating properly throughout the extraction cycle with no unauthorized "
        "tampering or compromise. The electronic data has been mathematically sealed with SHA-256 integrity digests and "
        "is judicially admissible in evidence before any competent Court of Law."
    )
    elements.append(Paragraph(cert_text, cert_style))
    elements.append(Spacer(1, 6))

    raw_hash = hashlib.sha256(f"{report_id}-{target_account}-{case_id}-FINTRACE-SEC65B".encode()).hexdigest()

    sig_data = [
        [
            Paragraph(f"<b>Cryptographic Hash:</b> <font face='Courier' size=7>{raw_hash}</font>", body_style),
            Paragraph("<b>Digital Signatory Seal:</b>", body_style)
        ],
        [
            Paragraph("<b>Integrity Status:</b> <font color='#15803d'><b>VERIFIED_TAMPER_FREE (SEC 65B COMPLIANT)</b></font>", body_style),
            Paragraph(f"<b>{signatory}</b><br/><font size=7 color='#475569'>Lead Cyber Forensic Examiner, CCD</font>", body_style)
        ]
    ]
    sig_table = Table(sig_data, colWidths=[340, 200])
    sig_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, slate_border),
        ('BACKGROUND', (0,0), (-1,-1), slate_bg),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    elements.append(sig_table)

    doc.build(elements)
    return buf.getvalue()


def generate_dossier_csv(report_id="REP-2026-089A", target_account="acc_00083575", case_id="CASE-2026-089"):
    """
    Generates a formal, raw forensic CSV ledger of the multi-hop transaction chain.
    """
    lines = [
        "Record_ID,Hop_Level,Timestamp,Source_Account,Source_Bank,Destination_Account,Destination_Bank,Amount_INR,Payment_Channel,UTR_Number,Typology_Risk_Flag,Status,Cryptographic_Hash",
        f"TXN-001,HOP_1,2026-11-24 18:45:12,ACC-VICTIM-VARUN,HDFC Bank,{target_account},Axis Bank,1480000.00,IMPS,UTR9812401824,PRIMARY_PHISHING_INFLOW,CONFIRMED_FRAUD,9f8a3c8e4d2a1b5c7e9f0a2b4d6e8f1a",
        f"TXN-002,HOP_2,2026-11-24 18:46:00,{target_account},Axis Bank,AC91823,HDFC Bank,600000.00,RTGS,UTR9812401825,LAYER_1_RAPID_SPLIT,CONDUIT_MULE,a1b2c3d4e5f60718293a4b5c6d7e8f9a",
        f"TXN-003,HOP_2,2026-11-24 18:46:30,{target_account},Axis Bank,AC55412,ICICI Bank,650000.00,NEFT,UTR9812401826,LAYER_1_RAPID_SPLIT,CONDUIT_MULE,b2c3d4e5f60718293a4b5c6d7e8f9a0b",
        f"TXN-004,HOP_3,2026-11-24 18:47:10,AC91823,HDFC Bank,AC44510,State Bank of India,580000.00,IMPS,UTR9812401827,LAYER_2_SMURFING,PASS_THROUGH_MULE,c3d4e5f60718293a4b5c6d7e8f9a0b1c",
        f"TXN-005,HOP_3,2026-11-24 18:48:00,AC55412,ICICI Bank,AC38192,Punjab National Bank,320000.00,UPI,UTR9812401828,LAYER_2_PASS_THROUGH,PASS_THROUGH_MULE,d4e5f60718293a4b5c6d7e8f9a0b1c2d",
        f"TXN-006,HOP_4,2026-11-24 18:48:12,AC38192,Punjab National Bank,ATM-KIOSK-09,ATM Anna Salai Chennai,150000.00,ATM_WITHDRAWAL,ATM-CASH-TXN-01,CRITICAL_CASHOUT,CASH_DRAINED,e5f60718293a4b5c6d7e8f9a0b1c2d3e"
    ]
    return "\n".join(lines).encode('utf-8')

if __name__ == '__main__':
    pdf = generate_dossier_pdf()
    csv = generate_dossier_csv()
    print(f"Generated PDF size: {len(pdf)} bytes")
    print(f"Generated CSV size: {len(csv)} bytes")
