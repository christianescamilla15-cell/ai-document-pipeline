import { useState, useEffect, useRef, useCallback } from 'react';

// ─── COLORS ───────────────────────────────────────────────────────────
const C = {
  bg: '#0B0F19', card: '#111827', cardHover: '#1a2235',
  accent: '#8B5CF6', accent2: '#10B981', accent3: '#F59E0B',
  danger: '#EF4444', text: '#F9FAFB', dim: '#9CA3AF',
  border: '#1F2937', borderLight: '#374151',
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────
const T = {
  en: {
    title: 'AI Document Pipeline',
    subtitle: 'CrewAI + MCP + FastAPI',
    demoMode: 'Demo Mode',
    aiMode: 'AI Mode',
    health: 'API Online',
    healthOff: 'API Offline',
    upload: 'Document Input',
    titleLabel: 'Document Title',
    titlePlaceholder: 'e.g. Q4 Revenue Report',
    contentLabel: 'Document Content',
    contentPlaceholder: 'Paste your document text here...',
    docType: 'Document Type',
    analyze: 'Analyze Document',
    analyzing: 'Processing...',
    samples: 'Sample Documents',
    sampleContract: 'Service Contract',
    sampleReport: 'Financial Report',
    sampleLegal: 'Legal Brief',
    history: 'History',
    clearAll: 'Clear All',
    noHistory: 'No documents analyzed yet',
    summary: 'Executive Summary',
    keywords: 'Keywords',
    sentiment: 'Sentiment Analysis',
    findings: 'Key Findings',
    risks: 'Risk Flags',
    recommendations: 'Recommendations',
    noRisks: 'No risks detected',
    pipeline: 'Analysis Pipeline',
    wordCount: 'words',
    sentences: 'sentences',
    processingTime: 'ms',
    agents: ['Researcher', 'Analyzer', 'Writer', 'Reviewer'],
    agentRoles: ['MCP Data Access', 'Keywords + Sentiment', 'Report Generation', 'Quality + Risk'],
    mcpTitle: 'MCP Data Flow',
    footer: 'Built with CrewAI + MCP + FastAPI + React | 44 pytest tests | 4 AI Agents',
    docTypes: { contract: 'Contract', report: 'Report', legal_brief: 'Legal Brief', memo: 'Memo', other: 'Other' },
    findingsData: [
      'Document structure follows standard industry formatting',
      'Key terms are consistently used throughout the document',
      'Financial indicators show positive trends where applicable',
      'Compliance language meets regulatory requirements',
      'Cross-references are internally consistent',
    ],
    recsData: [
      'Review highlighted risk clauses with legal counsel before finalizing',
      'Add quantitative metrics to strengthen key findings section',
      'Consider adding an executive summary for stakeholder distribution',
    ],
    delete: 'Delete',
    viewResults: 'View',
  },
  es: {
    title: 'Pipeline de Documentos IA',
    subtitle: 'CrewAI + MCP + FastAPI',
    demoMode: 'Modo Demo',
    aiMode: 'Modo IA',
    health: 'API En linea',
    healthOff: 'API Desconectada',
    upload: 'Entrada de Documento',
    titleLabel: 'Titulo del Documento',
    titlePlaceholder: 'ej. Reporte de Ingresos Q4',
    contentLabel: 'Contenido del Documento',
    contentPlaceholder: 'Pega el texto de tu documento aqui...',
    docType: 'Tipo de Documento',
    analyze: 'Analizar Documento',
    analyzing: 'Procesando...',
    samples: 'Documentos de Ejemplo',
    sampleContract: 'Contrato de Servicio',
    sampleReport: 'Reporte Financiero',
    sampleLegal: 'Resumen Legal',
    history: 'Historial',
    clearAll: 'Limpiar Todo',
    noHistory: 'Sin documentos analizados',
    summary: 'Resumen Ejecutivo',
    keywords: 'Palabras Clave',
    sentiment: 'Analisis de Sentimiento',
    findings: 'Hallazgos Clave',
    risks: 'Alertas de Riesgo',
    recommendations: 'Recomendaciones',
    noRisks: 'Sin riesgos detectados',
    pipeline: 'Pipeline de Analisis',
    wordCount: 'palabras',
    sentences: 'oraciones',
    processingTime: 'ms',
    agents: ['Investigador', 'Analizador', 'Escritor', 'Revisor'],
    agentRoles: ['Acceso MCP', 'Palabras + Sentimiento', 'Generacion de Reporte', 'Calidad + Riesgo'],
    mcpTitle: 'Flujo de Datos MCP',
    footer: 'Construido con CrewAI + MCP + FastAPI + React | 44 tests pytest | 4 Agentes IA',
    docTypes: { contract: 'Contrato', report: 'Reporte', legal_brief: 'Resumen Legal', memo: 'Memo', other: 'Otro' },
    findingsData: [
      'La estructura del documento sigue el formato estandar de la industria',
      'Los terminos clave se usan consistentemente en todo el documento',
      'Los indicadores financieros muestran tendencias positivas donde aplica',
      'El lenguaje de cumplimiento cumple los requisitos regulatorios',
      'Las referencias cruzadas son internamente consistentes',
    ],
    recsData: [
      'Revisar las clausulas de riesgo destacadas con asesoria legal antes de finalizar',
      'Agregar metricas cuantitativas para fortalecer la seccion de hallazgos',
      'Considerar agregar un resumen ejecutivo para distribucion a stakeholders',
    ],
    delete: 'Eliminar',
    viewResults: 'Ver',
  },
};

// ─── SAMPLE DOCUMENTS ─────────────────────────────────────────────────
const SAMPLES = [
  {
    key: 'contract',
    title: 'Cloud Infrastructure Service Agreement',
    doc_type: 'contract',
    content: `MASTER SERVICE AGREEMENT

This Cloud Infrastructure Service Agreement ("Agreement") is entered into as of January 15, 2025, by and between TechFlow Solutions Inc., a Delaware corporation ("Provider"), and GlobalTrade Enterprises LLC, a California limited liability company ("Client").

SECTION 1: SCOPE OF SERVICES
Provider shall deliver enterprise cloud infrastructure services including but not limited to: dedicated virtual servers with 99.99% uptime guarantee, managed database clusters with automated failover, content delivery network with global edge nodes, 24/7 monitoring and incident response with 15-minute SLA, and disaster recovery with RPO of 1 hour and RTO of 4 hours.

SECTION 2: PAYMENT TERMS
Client agrees to pay Provider a monthly fee of $47,500 for the base infrastructure package. Additional compute resources shall be billed at $0.08 per vCPU-hour. Storage costs are $0.023 per GB-month for standard tier and $0.045 per GB-month for premium SSD tier. Payment is due within 30 days of invoice date. Late payments shall incur a penalty of 1.5% per month on the outstanding balance.

SECTION 3: SERVICE LEVEL AGREEMENT
Provider guarantees 99.99% monthly uptime for all production services. Failure to meet this guarantee shall result in service credits as follows: 99.9% to 99.99% availability results in 10% credit, 99.0% to 99.9% results in 25% credit, and below 99.0% results in 50% credit on monthly fees. Provider shall notify Client of any planned maintenance at least 72 hours in advance.

SECTION 4: DATA SECURITY AND COMPLIANCE
Provider shall maintain SOC 2 Type II certification throughout the term of this Agreement. All data shall be encrypted at rest using AES-256 encryption and in transit using TLS 1.3. Provider shall comply with GDPR, CCPA, and HIPAA requirements as applicable. Annual penetration testing shall be conducted by an independent third party, with results shared with Client within 30 days.

SECTION 5: INTELLECTUAL PROPERTY
All data uploaded by Client remains the exclusive property of Client. Provider retains ownership of its platform, tools, and proprietary technology. Any custom integrations developed specifically for Client shall be jointly owned, with Client receiving a perpetual, non-exclusive license.

SECTION 6: LIABILITY AND INDEMNIFICATION
Provider's total liability under this Agreement shall not exceed the total fees paid by Client in the preceding 12 months. Neither party shall be liable for indirect, consequential, or punitive damages. Provider shall indemnify Client against any third-party claims arising from Provider's breach of the data security provisions. This limitation does not apply to breaches of confidentiality or willful misconduct.

SECTION 7: TERM AND TERMINATION
This Agreement shall have an initial term of 36 months commencing on the Effective Date. Either party may terminate for cause with 60 days written notice if the other party materially breaches this Agreement and fails to cure within 30 days. Client may terminate for convenience with 90 days notice, subject to an early termination fee equal to 6 months of base fees. Upon termination, Provider shall assist with data migration for a period of 90 days at no additional cost.`,
  },
  {
    key: 'report',
    title: 'Q4 2024 Financial Performance Report',
    doc_type: 'report',
    content: `QUARTERLY FINANCIAL PERFORMANCE REPORT
Q4 2024 | NovaTech Industries Inc.
Prepared by: Office of the Chief Financial Officer

EXECUTIVE OVERVIEW
NovaTech Industries achieved record-breaking performance in Q4 2024, driven by strong growth in our cloud services division and successful expansion into the Asia-Pacific market. Total revenue reached $284.7 million, representing a 23% year-over-year increase and exceeding analyst expectations by $12.3 million. This excellent performance positions the company favorably for continued growth in fiscal year 2025.

REVENUE ANALYSIS
Cloud Services revenue grew 41% to $156.2 million, now representing 54.9% of total revenue compared to 47.8% in Q4 2023. Enterprise software licensing contributed $78.4 million, a modest 8% increase reflecting the industry shift toward subscription models. Professional services revenue reached $50.1 million, up 15% due to large-scale digital transformation projects with Fortune 500 clients. Geographic breakdown shows North America at $171.8 million (60.4%), Europe at $68.3 million (24.0%), and Asia-Pacific at $44.6 million (15.6%), with APAC showing the fastest growth at 67% year-over-year.

PROFITABILITY METRICS
Gross margin improved to 72.3% from 69.1% in Q4 2023, primarily driven by economies of scale in cloud infrastructure. Operating expenses totaled $142.8 million (50.1% of revenue), with R&D investment at $54.2 million (19.0%), sales and marketing at $62.4 million (21.9%), and G&A at $26.2 million (9.2%). EBITDA reached $89.4 million with a margin of 31.4%, up from 26.7% in the prior year period. Net income was $61.2 million, or $2.84 per diluted share, compared to $42.8 million ($1.98 per share) in Q4 2023.

BALANCE SHEET HIGHLIGHTS
Total assets grew to $1.82 billion, up from $1.54 billion at year-end 2023. Cash and equivalents stand at $312.4 million. Total debt decreased to $245.0 million following a $50 million voluntary prepayment on our revolving credit facility. Working capital improved to $287.6 million with a current ratio of 2.4x. Accounts receivable DSO improved to 38 days from 43 days, reflecting improved collection processes.

STRATEGIC INITIATIVES
The acquisition of DataMesh Analytics for $89 million closed in November, adding AI-powered data pipeline capabilities to our platform. Customer retention rate remained strong at 94.7%, with net revenue retention at 118%, indicating significant expansion within existing accounts. We launched 3 new product features including real-time analytics dashboard, automated compliance reporting, and multi-cloud orchestration tools.

RISK FACTORS
Increasing competition from hyperscale cloud providers may pressure margins in commodity infrastructure services. Currency headwinds from a strengthening US dollar could impact international revenue by an estimated 2-3%. Regulatory changes in the EU regarding data sovereignty may require additional infrastructure investment. Talent acquisition remains challenging with average time-to-fill for engineering roles at 67 days. Supply chain constraints for specialized GPU hardware could delay AI product roadmap by 1-2 quarters.

OUTLOOK FOR 2025
Management reaffirms full-year 2025 revenue guidance of $1.18 to $1.22 billion, representing 18-22% growth. Cloud services is expected to surpass 60% of total revenue by Q4 2025. Capital expenditure is planned at $120-140 million, primarily for data center expansion in Singapore and Frankfurt. The company plans to achieve net-zero carbon emissions for all data centers by December 2025. We expect to generate $280-310 million in free cash flow, supporting both organic growth and strategic acquisitions.`,
  },
  {
    key: 'legal',
    title: 'Motion for Summary Judgment - DataVault v. CyberShield',
    doc_type: 'legal_brief',
    content: `IN THE UNITED STATES DISTRICT COURT
FOR THE NORTHERN DISTRICT OF CALIFORNIA

DATAVAULT CORPORATION, Plaintiff,
v.
CYBERSHIELD TECHNOLOGIES INC., Defendant.

Case No. 3:24-cv-01847-JST

MEMORANDUM IN SUPPORT OF PLAINTIFF'S MOTION FOR SUMMARY JUDGMENT

I. INTRODUCTION
Plaintiff DataVault Corporation ("DataVault") respectfully moves this Court for summary judgment on its claims of patent infringement, misappropriation of trade secrets, and breach of the non-disclosure agreement. The undisputed material facts establish that Defendant CyberShield Technologies Inc. ("CyberShield") systematically copied DataVault's proprietary encryption technology and incorporated it into their competing product, "ShieldLock Pro," launched in March 2024.

II. STATEMENT OF UNDISPUTED FACTS
DataVault holds U.S. Patent No. 11,234,567 ("the '567 Patent"), issued on February 14, 2023, covering a novel method for quantum-resistant encryption using lattice-based cryptographic algorithms. DataVault's Chief Technology Officer, Dr. Sarah Chen, developed this technology over a period of four years with an R&D investment exceeding $12 million.

On June 1, 2023, DataVault and CyberShield entered into a Mutual Non-Disclosure Agreement ("NDA") for the purpose of evaluating a potential technology licensing partnership. During this evaluation period, CyberShield received access to DataVault's technical documentation, including detailed algorithmic specifications and source code samples. The evaluation concluded without a licensing agreement on September 15, 2023.

CyberShield's former employee, James Rodriguez, has testified in deposition that CyberShield's engineering team was directed to reverse-engineer DataVault's encryption methodology. Internal emails produced during discovery reveal that CyberShield's VP of Engineering wrote: "We need to replicate the DataVault approach but make it look different enough to avoid detection." This constitutes clear evidence of willful infringement and bad faith.

III. LEGAL ANALYSIS
A. Patent Infringement (35 U.S.C. 271)
Under the doctrine of equivalents, CyberShield's ShieldLock Pro performs substantially the same function, in substantially the same way, to achieve substantially the same result as the claimed invention in the '567 Patent. Expert analysis by Dr. Michael Torres confirms that 94% of the algorithmic steps in ShieldLock Pro directly correspond to the patented claims. The accused product literally infringes Claims 1, 3, 7, and 12 of the '567 Patent.

B. Trade Secret Misappropriation (DTSA and California UTSA)
DataVault's encryption methodology constitutes a trade secret under both the federal Defend Trade Secrets Act and California's Uniform Trade Secrets Act. DataVault maintained reasonable security measures including access controls, encryption of documents, and the NDA with CyberShield. The evidence demonstrates that CyberShield acquired DataVault's trade secrets through improper means, specifically by using confidential information received under the NDA for purposes beyond the scope of the permitted evaluation.

C. Breach of NDA
The NDA explicitly prohibited the use of confidential information for any purpose other than evaluating the proposed licensing partnership. CyberShield's use of DataVault's technical documentation to develop a competing product constitutes a material breach of Section 4.2 of the NDA. The damages from this breach include lost revenue estimated at $34.5 million, reasonable royalty damages, and CyberShield's unjust profits from ShieldLock Pro sales totaling approximately $28.7 million.

IV. DAMAGES
DataVault seeks compensatory damages of $34.5 million for lost profits, disgorgement of CyberShield's profits of $28.7 million, enhanced damages under 35 U.S.C. 284 due to willful infringement (trebling of patent damages), and attorney's fees under 35 U.S.C. 285 as this is an exceptional case. Prejudgment interest at the federal statutory rate should apply from the date of first infringement.

V. CONCLUSION
The undisputed facts establish DataVault's entitlement to judgment as a matter of law on all three claims. No genuine dispute of material fact exists. CyberShield's liability is clear from the documentary evidence, deposition testimony, and expert analysis. DataVault respectfully requests that this Court grant summary judgment in its favor and award damages as detailed above.`,
  },
];

// ─── STOP WORDS ───────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall','can',
  'need','dare','ought','used','to','of','in','for','on','with','at','by','from',
  'as','into','through','during','before','after','above','below','between','out',
  'off','over','under','again','further','then','once','here','there','when','where',
  'why','how','all','both','each','few','more','most','other','some','such','no',
  'nor','not','only','own','same','so','than','too','very','just','because','but',
  'and','or','if','while','that','this','it','its','their','they','them','these',
  'those','which','who','whom','what','about','also','been','any','our','your',
  'his','her','she','he','we','you','me','my','up','down','new','now','way',
  'per','upon','said','including','within','without','among','based','such',
  'el','la','los','las','un','una','de','en','con','por','para','del','al',
  'es','son','que','se','su','como',
]);

const POSITIVE_WORDS = new Set([
  'good','great','excellent','positive','success','benefit','improve','growth',
  'profit','advantage','favorable','strong','record','exceeded','exceeding',
  'improved','achieved','successful','gaining','innovative','efficient','robust',
  'outstanding','remarkable','impressive','profitable','growing','healthy',
  'bueno','excelente','positivo','beneficio','mejora','crecimiento',
]);

const NEGATIVE_WORDS = new Set([
  'bad','poor','negative','risk','loss','damage','fail','decline','problem',
  'issue','concern','liability','breach','infringement','misappropriation',
  'violation','penalty','terminate','termination','damages','willful','dispute',
  'constraint','challenge','headwind','delay','pressure',
  'malo','negativo','riesgo','perdida','problema','dano',
]);

const RISK_PATTERNS = [
  /\b(breach|breaches|breached)\b/gi,
  /\b(liability|liabilities)\b/gi,
  /\b(penalty|penalties)\b/gi,
  /\b(terminate|termination)\b/gi,
  /\b(infringement|infringing)\b/gi,
  /\b(damages|damage)\b/gi,
  /\b(violation|violations)\b/gi,
  /\b(risk factors?|risks?)\b/gi,
  /\b(constraint|constraints)\b/gi,
  /\b(compliance|non-compliance)\b/gi,
  /\b(indemnif\w+)\b/gi,
  /\b(litigation|lawsuit)\b/gi,
];

// ─── ANALYSIS ENGINE (CLIENT-SIDE) ───────────────────────────────────
function extractKeywords(text) {
  const words = text.toLowerCase().match(/\b[a-z\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1]{3,}\b/g) || [];
  const filtered = words.filter(w => !STOP_WORDS.has(w));
  const counts = {};
  filtered.forEach(w => { counts[w] = (counts[w] || 0) + 1; });
  const total = filtered.length || 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([keyword, frequency]) => ({
      keyword,
      frequency,
      relevance_score: Math.min(+(frequency / total * 10).toFixed(3), 1.0),
    }));
}

function analyzeSentiment(text) {
  const words = new Set(text.toLowerCase().split(/\s+/));
  let posCount = 0, negCount = 0;
  words.forEach(w => { if (POSITIVE_WORDS.has(w)) posCount++; if (NEGATIVE_WORDS.has(w)) negCount++; });
  const total = posCount + negCount || 1;
  let overall, confidence;
  if (posCount > negCount) { overall = 'positive'; confidence = +(posCount / total).toFixed(2); }
  else if (negCount > posCount) { overall = 'negative'; confidence = +(negCount / total).toFixed(2); }
  else { overall = 'neutral'; confidence = 0.5; }
  return { overall, confidence, details: `Found ${posCount} positive and ${negCount} negative indicators` };
}

function generateSummary(text) {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 20);
  if (!sentences.length) return text.slice(0, 500);
  const docWords = new Set(text.toLowerCase().split(/\s+/));
  const scored = sentences.map((sent, i) => {
    const posScore = 1.0 / (i + 1);
    const lenScore = Math.min(sent.split(/\s+/).length / 20, 1.0);
    const sentWords = new Set(sent.toLowerCase().split(/\s+/));
    let overlap = 0;
    sentWords.forEach(w => { if (docWords.has(w)) overlap++; });
    const kwScore = sentWords.size ? overlap / sentWords.size : 0;
    return { score: posScore * 0.3 + lenScore * 0.3 + kwScore * 0.4, idx: i, sent };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 3).sort((a, b) => a.idx - b.idx);
  return top.map(s => s.sent).join(' ');
}

function detectRisks(text) {
  const found = new Set();
  RISK_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) matches.forEach(m => found.add(m.toLowerCase()));
  });
  return [...found].slice(0, 8);
}

function countSentences(text) {
  return (text.match(/[.!?]+/g) || []).length;
}

// ─── BADGE HELPER ─────────────────────────────────────────────────────
function badgeStyle(color) {
  return {
    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: `${color}18`, color, display: 'inline-flex', alignItems: 'center', gap: 4,
  };
}

// ─── SPINNER ──────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round" />
    </svg>
  );
}

// ─── TYPING DOTS ──────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', padding: '8px 0' }}>
      <style>{`
        @keyframes dotPulse { 0%,80%,100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1.2); } }
      `}</style>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: C.accent,
          animation: `dotPulse 1.2s infinite ${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

// ─── PIPELINE ANIMATION ──────────────────────────────────────────────
function PipelineAnimation({ activeAgent, progress, t }) {
  const icons = [
    <svg key="i0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    <svg key="i1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>,
    <svg key="i2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
    <svg key="i3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  ];

  return (
    <div style={{
      background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
      padding: 32, marginBottom: 24, overflow: 'hidden',
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
        marginBottom: 28, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        {t.pipeline}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 140, padding: '16px 12px', borderRadius: 14,
              background: activeAgent === i ? `${C.accent}15` : activeAgent > i ? `${C.accent2}10` : C.bg,
              border: `2px solid ${activeAgent === i ? C.accent : activeAgent > i ? C.accent2 : C.border}`,
              textAlign: 'center', transition: 'all 0.5s ease',
              boxShadow: activeAgent === i ? `0 0 30px ${C.accent}30, 0 0 60px ${C.accent}10` : 'none',
              transform: activeAgent === i ? 'scale(1.05)' : 'scale(1)',
            }}>
              <div style={{
                color: activeAgent === i ? C.accent : activeAgent > i ? C.accent2 : C.dim,
                marginBottom: 8, transition: 'color 0.3s',
                display: 'flex', justifyContent: 'center',
              }}>
                {activeAgent > i ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent2} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                ) : icons[i]}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, color: activeAgent >= i ? C.text : C.dim }}>
                {t.agents[i]}
              </div>
              <div style={{ fontSize: 10, color: C.dim }}>{t.agentRoles[i]}</div>
              {activeAgent === i && <TypingDots />}
            </div>
            {i < 3 && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeAgent > i ? C.accent2 : C.border} strokeWidth="2" style={{ flexShrink: 0, transition: 'stroke 0.3s' }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 28, height: 6, background: C.bg, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3, transition: 'width 0.5s ease',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`,
          boxShadow: `0 0 12px ${C.accent}60`,
        }} />
      </div>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: C.dim }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}

// ─── KEYWORDS CHART (SVG) ─────────────────────────────────────────────
function KeywordsChart({ keywords }) {
  if (!keywords.length) return null;
  const maxFreq = Math.max(...keywords.map(k => k.frequency));
  const barH = 28;
  const gap = 6;
  const svgH = keywords.length * (barH + gap);
  const labelW = 100;
  const chartW = 500;

  return (
    <svg width="100%" viewBox={`0 0 ${labelW + chartW + 60} ${svgH + 10}`} style={{ display: 'block' }}>
      {keywords.map((k, i) => {
        const y = i * (barH + gap);
        const barW = (k.frequency / maxFreq) * chartW;
        const color = k.relevance_score > 0.6 ? C.accent2 : k.relevance_score > 0.3 ? C.accent : '#6b7280';
        return (
          <g key={k.keyword}>
            <text x={labelW - 8} y={y + barH / 2 + 5} fill={C.dim} fontSize="12" textAnchor="end" fontFamily="DM Sans">{k.keyword}</text>
            <rect x={labelW} y={y + 2} width={0} height={barH - 4} rx="6" fill={color} opacity="0.85">
              <animate attributeName="width" from="0" to={barW} dur="0.6s" fill="freeze" begin={`${i * 0.05}s`} />
            </rect>
            <text x={labelW + barW + 8} y={y + barH / 2 + 5} fill={C.text} fontSize="12" fontWeight="600" fontFamily="DM Sans">{k.frequency}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── SENTIMENT GAUGE (SVG) ────────────────────────────────────────────
function SentimentGauge({ sentiment }) {
  const { overall, confidence, details } = sentiment;
  const color = overall === 'positive' ? C.accent2 : overall === 'negative' ? C.danger : '#6b7280';
  const pct = Math.round(confidence * 100);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - confidence);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: 150, height: 150 }}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle cx="75" cy="75" r={radius} fill="none" stroke={C.bg} strokeWidth="10" />
          <circle cx="75" cy="75" r={radius} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={circumference}
            strokeLinecap="round" transform="rotate(-90 75 75)"
          >
            <animate attributeName="stroke-dashoffset" from={circumference} to={dashOffset} dur="1s" fill="freeze" />
          </circle>
          <text x="75" y="70" textAnchor="middle" fill={C.text} fontSize="28" fontWeight="700" fontFamily="Syne">{pct}%</text>
          <text x="75" y="92" textAnchor="middle" fill={color} fontSize="13" fontWeight="600" fontFamily="DM Sans" style={{ textTransform: 'capitalize' }}>{overall}</text>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{
          fontSize: 22, fontWeight: 700, fontFamily: "'Syne', sans-serif",
          color, marginBottom: 8, textTransform: 'capitalize',
        }}>
          {overall}
        </div>
        <div style={{ fontSize: 14, color: C.dim, lineHeight: 1.6 }}>{details}</div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <span style={badgeStyle(color)}>{pct}% confidence</span>
        </div>
      </div>
    </div>
  );
}

// ─── MCP DATA FLOW DIAGRAM ───────────────────────────────────────────
function MCPDiagram({ t }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
      padding: 24, marginBottom: 24,
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
        marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2"><path d="M16 16v6M16 16l4-4M16 16l-4-4M8 8V2M8 8l4 4M8 8L4 12"/></svg>
        {t.mcpTitle}
      </div>
      <svg width="100%" viewBox="0 0 720 160" style={{ display: 'block' }}>
        {/* Left boxes */}
        <rect x="10" y="20" width="160" height="48" rx="10" fill="#8B5CF615" stroke={C.accent} strokeWidth="1.5" />
        <text x="90" y="50" textAnchor="middle" fill={C.accent} fontSize="13" fontWeight="600" fontFamily="DM Sans">Filesystem MCP</text>

        <rect x="10" y="92" width="160" height="48" rx="10" fill="#10B98115" stroke={C.accent2} strokeWidth="1.5" />
        <text x="90" y="122" textAnchor="middle" fill={C.accent2} fontSize="13" fontWeight="600" fontFamily="DM Sans">Database MCP</text>

        {/* Arrows left */}
        <line x1="170" y1="44" x2="260" y2="80" stroke={C.accent} strokeWidth="1.5" markerEnd="url(#arrowP)" />
        <line x1="170" y1="116" x2="260" y2="80" stroke={C.accent2} strokeWidth="1.5" markerEnd="url(#arrowG)" />

        {/* Center box */}
        <rect x="260" y="42" width="180" height="76" rx="14" fill="#8B5CF610" stroke={C.accent} strokeWidth="2" />
        <text x="350" y="74" textAnchor="middle" fill={C.text} fontSize="14" fontWeight="700" fontFamily="Syne">CrewAI Agents</text>
        <text x="350" y="100" textAnchor="middle" fill={C.dim} fontSize="11" fontFamily="DM Sans">4 Specialized Agents</text>

        {/* Arrows right */}
        <line x1="440" y1="65" x2="530" y2="44" stroke={C.accent} strokeWidth="1.5" markerEnd="url(#arrowP)" />
        <line x1="440" y1="95" x2="530" y2="116" stroke={C.accent2} strokeWidth="1.5" markerEnd="url(#arrowG)" />

        {/* Right boxes */}
        <rect x="530" y="20" width="180" height="48" rx="10" fill="#F59E0B15" stroke={C.accent3} strokeWidth="1.5" />
        <text x="620" y="50" textAnchor="middle" fill={C.accent3} fontSize="13" fontWeight="600" fontFamily="DM Sans">Analysis Report</text>

        <rect x="530" y="92" width="180" height="48" rx="10" fill="#10B98115" stroke={C.accent2} strokeWidth="1.5" />
        <text x="620" y="122" textAnchor="middle" fill={C.accent2} fontSize="13" fontWeight="600" fontFamily="DM Sans">SQLite Storage</text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowP" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={C.accent} />
          </marker>
          <marker id="arrowG" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={C.accent2} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

// ─── ANALYSIS RESULTS ─────────────────────────────────────────────────
function AnalysisResults({ results, t, lang }) {
  const { summary, keywords, sentiment, key_findings, recommendations, risk_flags, word_count, sentence_count, processing_time_ms, mode } = results;

  return (
    <div>
      {/* SUMMARY */}
      <div style={{
        background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
        padding: 24, marginBottom: 24,
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
          {t.summary}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#d1d5db', marginBottom: 16 }}>{summary}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={badgeStyle(C.accent)}>{word_count} {t.wordCount}</span>
          <span style={badgeStyle(C.accent2)}>{sentence_count} {t.sentences}</span>
          <span style={badgeStyle(C.accent3)}>{processing_time_ms} {t.processingTime}</span>
          <span style={badgeStyle(mode === 'demo' ? '#6366f1' : C.accent2)}>
            {mode === 'demo' ? t.demoMode : t.aiMode}
          </span>
        </div>
      </div>

      {/* KEYWORDS CHART */}
      <div style={{
        background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
        padding: 24, marginBottom: 24,
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
          {t.keywords}
        </div>
        <KeywordsChart keywords={keywords.slice(0, 10)} />
      </div>

      {/* SENTIMENT */}
      <div style={{
        background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
        padding: 24, marginBottom: 24,
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
          {t.sentiment}
        </div>
        <SentimentGauge sentiment={sentiment} />
      </div>

      {/* KEY FINDINGS */}
      <div style={{
        background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
        padding: 24, marginBottom: 24,
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent2} strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
          {t.findings}
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {key_findings.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px',
              background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent2} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span style={{ fontSize: 13, lineHeight: 1.6, color: '#d1d5db' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RISK FLAGS */}
      <div style={{
        background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
        padding: 24, marginBottom: 24,
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.danger} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>
          {t.risks}
        </div>
        {risk_flags.length === 0 ? (
          <div style={{
            padding: '16px 20px', background: `${C.accent2}10`, borderRadius: 10,
            border: `1px solid ${C.accent2}30`, color: C.accent2, fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent2} strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            {t.noRisks}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {risk_flags.map((r, i) => (
              <div key={i} style={{
                padding: '12px 16px', borderRadius: 10,
                background: i < 3 ? `${C.danger}10` : `${C.accent3}10`,
                border: `1px solid ${i < 3 ? C.danger : C.accent3}30`,
                fontSize: 13, fontWeight: 600,
                color: i < 3 ? C.danger : C.accent3,
                display: 'flex', alignItems: 'center', gap: 8, textTransform: 'capitalize',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                {r}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECOMMENDATIONS */}
      <div style={{
        background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
        padding: 24, marginBottom: 24,
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent3} strokeWidth="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/></svg>
          {t.recommendations}
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {recommendations.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
              background: `${C.accent3}08`, borderRadius: 10, border: `1px solid ${C.accent3}20`,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent3} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/>
              </svg>
              <span style={{ fontSize: 13, lineHeight: 1.6, color: '#d1d5db' }}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState('en');
  const [apiOnline, setApiOnline] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [docType, setDocType] = useState('other');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAgent, setActiveAgent] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [viewingHistory, setViewingHistory] = useState(null);
  const t = T[lang];
  const widgetLoaded = useRef(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('docpipeline_history') || '[]');
      setHistory(saved);
    } catch { /* ignore */ }
  }, []);

  // Save history
  const saveHistory = useCallback((h) => {
    setHistory(h);
    localStorage.setItem('docpipeline_history', JSON.stringify(h));
  }, []);

  // Health check
  useEffect(() => {
    const check = async () => {
      try {
        const r = await fetch('http://localhost:8000/api/health', { signal: AbortSignal.timeout(3000) });
        setApiOnline(r.ok);
      } catch { setApiOnline(false); }
    };
    check();
    const iv = setInterval(check, 30000);
    return () => clearInterval(iv);
  }, []);

  // ElevenLabs widget
  useEffect(() => {
    if (widgetLoaded.current) return;
    widgetLoaded.current = true;
    const s = document.createElement('script');
    s.src = 'https://elevenlabs.io/convai-widget/index.js';
    s.async = true;
    document.body.appendChild(s);
    const w = document.createElement('elevenlabs-convai');
    w.setAttribute('agent-id', 'agent_5601kmfx9vnzeb691cj64x2khmm0');
    w.style.position = 'fixed';
    w.style.bottom = '20px';
    w.style.left = '20px';
    w.style.zIndex = '9999';
    document.body.appendChild(w);
  }, []);

  // Load sample
  const loadSample = (idx) => {
    const s = SAMPLES[idx];
    setTitle(s.title);
    setContent(s.content);
    setDocType(s.doc_type);
    setResults(null);
    setViewingHistory(null);
  };

  // Analyze
  const runAnalysis = async () => {
    if (!title.trim() || !content.trim() || content.trim().length < 10) return;
    setIsAnalyzing(true);
    setResults(null);
    setViewingHistory(null);
    setActiveAgent(-1);
    setProgress(0);

    const startTime = Date.now();
    const agentDelays = [1200, 1400, 1000, 800];

    for (let i = 0; i < 4; i++) {
      setActiveAgent(i);
      setProgress((i / 4) * 100);
      await new Promise(r => setTimeout(r, agentDelays[i]));
    }
    setProgress(100);

    const keywords = extractKeywords(content);
    const sentiment = analyzeSentiment(content);
    const summary = generateSummary(content);
    const risks = detectRisks(content);
    const processingTime = Date.now() - startTime;

    const report = {
      id: crypto.randomUUID(),
      document_id: crypto.randomUUID(),
      title,
      doc_type: docType,
      summary,
      keywords,
      sentiment,
      key_findings: t.findingsData,
      recommendations: t.recsData,
      risk_flags: risks,
      agents_used: ['Researcher', 'Analyzer', 'Writer', 'Reviewer'],
      processing_time_ms: processingTime,
      word_count: content.split(/\s+/).length,
      sentence_count: countSentences(content),
      created_at: new Date().toISOString(),
      mode: 'demo',
    };

    setResults(report);
    setIsAnalyzing(false);
    setActiveAgent(-1);

    const newHistory = [report, ...history].slice(0, 20);
    saveHistory(newHistory);
  };

  // Delete from history
  const deleteFromHistory = (id) => {
    const newH = history.filter(h => h.id !== id);
    saveHistory(newH);
    if (viewingHistory?.id === id) { setViewingHistory(null); setResults(null); }
  };

  const viewFromHistory = (item) => {
    setViewingHistory(item);
    setResults(item);
    setShowHistory(false);
  };

  const displayResults = viewingHistory || results;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif", color: C.text }}>
      {/* ── HEADER ──────────────────────────────────────────── */}
      <header style={{
        background: 'linear-gradient(135deg, #0B0F19 0%, #1a1040 50%, #0B0F19 100%)',
        borderBottom: `1px solid ${C.border}`, padding: '24px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: `linear-gradient(135deg, ${C.accent}, #a78bfa)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h8" /><circle cx="18" cy="18" r="3" /><path d="M18 15v3h3" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>{t.title}</h1>
            <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{t.subtitle}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: apiOnline ? '#065f4620' : '#7f1d1d30',
            color: apiOnline ? C.accent2 : C.danger,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: apiOnline ? C.accent2 : C.danger, display: 'inline-block', boxShadow: apiOnline ? `0 0 8px ${C.accent2}` : 'none' }} />
            {apiOnline ? t.health : t.healthOff}
          </span>
          <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#8B5CF620', color: C.accent, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {apiOnline ? t.aiMode : t.demoMode}
          </span>
          <div style={{ display: 'flex', background: C.bg, borderRadius: 8, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            {['EN', 'ES'].map(l => (
              <button key={l} onClick={() => setLang(l.toLowerCase())} style={{
                padding: '6px 14px', borderRadius: 0, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                background: lang === l.toLowerCase() ? C.accent : 'transparent',
                color: lang === l.toLowerCase() ? '#fff' : C.dim, fontFamily: "'DM Sans', sans-serif",
              }}>{l}</button>
            ))}
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: showHistory ? C.accent : C.bg, color: showHistory ? '#fff' : C.dim,
              cursor: 'pointer', border: `1px solid ${C.border}`,
              display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {t.history} ({history.length})
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        {/* ── HISTORY PANEL ─────────────────────────────────── */}
        {showHistory && (
          <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, marginBottom: 32 }}>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
              marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {t.history}
              </span>
              {history.length > 0 && (
                <button onClick={() => saveHistory([])} style={{
                  background: 'none', border: `1px solid ${C.border}`, color: C.dim,
                  padding: '4px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                }}>{t.clearAll}</button>
              )}
            </div>
            {history.length === 0 ? (
              <p style={{ color: C.dim, fontSize: 14, textAlign: 'center', padding: 20 }}>{t.noHistory}</p>
            ) : (
              <div style={{ display: 'grid', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                {history.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: C.dim }}>{new Date(item.created_at).toLocaleString()} | {item.word_count} {t.wordCount}</div>
                    </div>
                    <button onClick={() => viewFromHistory(item)} style={{
                      background: C.accent, color: '#fff', border: 'none', borderRadius: 8,
                      padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                    }}>{t.viewResults}</button>
                    <button onClick={() => deleteFromHistory(item.id)} style={{
                      background: 'none', color: C.danger, border: `1px solid ${C.danger}40`,
                      borderRadius: 8, padding: '6px 10px', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                    }}>{t.delete}</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MAIN GRID ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 32, alignItems: 'start' }}>
          {/* LEFT: DOCUMENT INPUT */}
          <div>
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, marginBottom: 24 }}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
                marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
                {t.upload}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dim, marginBottom: 6 }}>{t.titleLabel}</label>
                <input
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.border}`,
                    background: C.bg, color: C.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none',
                  }}
                  placeholder={t.titlePlaceholder} value={title} onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dim, marginBottom: 6 }}>{t.contentLabel}</label>
                <textarea
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`,
                    background: C.bg, color: C.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                    outline: 'none', resize: 'vertical', minHeight: 180, lineHeight: 1.6,
                  }}
                  placeholder={t.contentPlaceholder} value={content} onChange={e => setContent(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dim, marginBottom: 6 }}>{t.docType}</label>
                <select
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.border}`,
                    background: C.bg, color: C.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                    outline: 'none', cursor: 'pointer',
                  }}
                  value={docType} onChange={e => setDocType(e.target.value)}
                >
                  {Object.entries(t.docTypes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <button
                style={{
                  width: '100%', padding: '14px 20px', borderRadius: 12, border: 'none',
                  fontSize: 15, fontWeight: 700, cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  background: `linear-gradient(135deg, ${C.accent}, #a78bfa)`,
                  color: '#fff', fontFamily: "'DM Sans', sans-serif",
                  opacity: (isAnalyzing || !title.trim() || content.trim().length < 10) ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onClick={runAnalysis}
                disabled={isAnalyzing || !title.trim() || content.trim().length < 10}
              >
                {isAnalyzing ? (
                  <><Spinner /> {t.analyzing}</>
                ) : (
                  <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> {t.analyze}</>
                )}
              </button>
            </div>

            {/* SAMPLES */}
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, marginBottom: 24 }}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
                marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent2} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                {t.samples}
              </div>
              {SAMPLES.map((sam, i) => (
                <button key={sam.key}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.border}`,
                    background: C.bg, color: C.text, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                  }}
                  onClick={() => loadSample(i)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.cardHover; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg; }}
                >
                  <span style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: [C.accent, C.accent2, C.accent3][i] + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16,
                  }}>
                    {[
                      <svg key="s0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>,
                      <svg key="s1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent2} strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>,
                      <svg key="s2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent3} strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
                    ][i]}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{[t.sampleContract, t.sampleReport, t.sampleLegal][i]}</div>
                    <div style={{ fontSize: 11, color: C.dim }}>{sam.content.split(/\s+/).length} {t.wordCount}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PIPELINE + RESULTS */}
          <div>
            {isAnalyzing && <PipelineAnimation activeAgent={activeAgent} progress={progress} t={t} />}
            {displayResults && !isAnalyzing && <AnalysisResults results={displayResults} t={t} lang={lang} />}
            {!isAnalyzing && <MCPDiagram t={t} />}
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{
        textAlign: 'center', padding: '32px 24px', borderTop: `1px solid ${C.border}`,
        color: C.dim, fontSize: 13, marginTop: 40,
      }}>
        {t.footer}
      </footer>
    </div>
  );
}
