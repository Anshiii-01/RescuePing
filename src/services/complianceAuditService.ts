/**
 * Compliance Audit Service
 * Comprehensive regulatory compliance management, audit tracking, and policy enforcement
 */

// Compliance framework type
type ComplianceFramework = 
  | 'SOC2' 
  | 'ISO27001' 
  | 'GDPR' 
  | 'HIPAA' 
  | 'PCI_DSS' 
  | 'SOX' 
  | 'NIST' 
  | 'FedRAMP'
  | 'CCPA'
  | 'custom';

// Compliance status
type ComplianceStatus = 'compliant' | 'non_compliant' | 'partially_compliant' | 'not_assessed' | 'exempt';

// Control status
type ControlStatus = 'implemented' | 'not_implemented' | 'partially_implemented' | 'not_applicable';

// Audit status
type AuditStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';

// Finding severity
type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

// Evidence type
type EvidenceType = 'document' | 'screenshot' | 'log' | 'configuration' | 'attestation' | 'automated';

// Compliance Control
interface ComplianceControl {
  id: string;
  frameworkId: string;
  controlNumber: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  status: ControlStatus;
  owner: {
    userId: string;
    userName: string;
    email: string;
  };
  implementation: {
    description: string;
    procedures: string[];
    tools: string[];
    automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
  };
  testing: {
    frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    lastTested: Date;
    nextTest: Date;
    testProcedure: string;
  };
  evidence: ControlEvidence[];
  mappings: {
    frameworkId: string;
    controlId: string;
    relationship: 'equivalent' | 'partial' | 'related';
  }[];
  risks: string[];
  metrics: {
    effectivenessScore: number;
    maturityLevel: number;
    testPassRate: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastReviewedAt: Date;
    version: number;
  };
}

// Control Evidence
interface ControlEvidence {
  id: string;
  controlId: string;
  type: EvidenceType;
  name: string;
  description: string;
  source: string;
  collectedAt: Date;
  validUntil: Date;
  status: 'valid' | 'expired' | 'pending_review' | 'rejected';
  artifact: {
    url?: string;
    content?: string;
    hash?: string;
    size?: number;
  };
  reviewer?: {
    userId: string;
    userName: string;
    reviewedAt: Date;
    comments?: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Compliance Framework
interface ComplianceFrameworkDefinition {
  id: string;
  name: string;
  shortName: ComplianceFramework;
  version: string;
  description: string;
  publisher: string;
  status: 'active' | 'inactive' | 'draft';
  effectiveDate: Date;
  expirationDate?: Date;
  controlCount: number;
  categories: {
    id: string;
    name: string;
    description: string;
    controlCount: number;
  }[];
  complianceScore: number;
  lastAssessment: Date;
  nextAssessment: Date;
  certifications: {
    name: string;
    issuedDate: Date;
    expirationDate: Date;
    issuer: string;
    status: 'valid' | 'expired' | 'pending';
  }[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Compliance Audit
interface ComplianceAudit {
  id: string;
  name: string;
  description: string;
  type: 'internal' | 'external' | 'certification' | 'regulatory';
  frameworkIds: string[];
  status: AuditStatus;
  scope: {
    systems: string[];
    processes: string[];
    departments: string[];
    locations: string[];
  };
  schedule: {
    plannedStart: Date;
    plannedEnd: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  auditor: {
    type: 'internal' | 'external';
    organization?: string;
    leadAuditor: {
      userId?: string;
      name: string;
      email: string;
    };
    team: {
      name: string;
      role: string;
    }[];
  };
  findings: AuditFinding[];
  controlsAssessed: {
    controlId: string;
    status: 'passed' | 'failed' | 'not_tested';
    notes?: string;
  }[];
  evidence: {
    requested: number;
    collected: number;
    pending: number;
  };
  report?: {
    url: string;
    generatedAt: Date;
    type: 'draft' | 'final';
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Audit Finding
interface AuditFinding {
  id: string;
  auditId: string;
  controlId?: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: 'open' | 'in_remediation' | 'remediated' | 'accepted' | 'closed';
  category: string;
  rootCause?: string;
  impact: {
    description: string;
    affectedSystems: string[];
    riskScore: number;
  };
  remediation: {
    plan: string;
    owner: {
      userId: string;
      userName: string;
    };
    dueDate: Date;
    completedDate?: Date;
    steps: {
      id: string;
      description: string;
      status: 'pending' | 'in_progress' | 'completed';
      completedAt?: Date;
    }[];
  };
  evidence: {
    findingEvidence: ControlEvidence[];
    remediationEvidence: ControlEvidence[];
  };
  history: {
    timestamp: Date;
    action: string;
    actor: string;
    details?: string;
  }[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
  };
}

// Compliance Policy
interface CompliancePolicy {
  id: string;
  name: string;
  description: string;
  type: 'policy' | 'standard' | 'procedure' | 'guideline';
  status: 'draft' | 'pending_approval' | 'approved' | 'retired';
  version: string;
  effectiveDate: Date;
  reviewDate: Date;
  owner: {
    userId: string;
    userName: string;
    department: string;
  };
  approvers: {
    userId: string;
    userName: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedAt?: Date;
    comments?: string;
  }[];
  scope: {
    departments: string[];
    roles: string[];
    systems: string[];
  };
  content: {
    purpose: string;
    scope: string;
    policy: string;
    procedures: string[];
    exceptions: string[];
    references: string[];
  };
  controls: string[];
  frameworks: ComplianceFramework[];
  acknowledgments: {
    required: boolean;
    count: number;
    acknowledged: number;
    pending: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    publishedAt?: Date;
  };
}

// Risk Assessment
interface RiskAssessment {
  id: string;
  name: string;
  description: string;
  type: 'security' | 'compliance' | 'operational' | 'strategic';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  scope: {
    systems: string[];
    processes: string[];
    assets: string[];
  };
  assessor: {
    userId: string;
    userName: string;
  };
  methodology: string;
  risks: {
    id: string;
    name: string;
    description: string;
    category: string;
    likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'almost_certain';
    impact: 'insignificant' | 'minor' | 'moderate' | 'major' | 'catastrophic';
    inherentRiskScore: number;
    residualRiskScore: number;
    controls: string[];
    treatment: 'accept' | 'mitigate' | 'transfer' | 'avoid';
    owner: string;
  }[];
  summary: {
    totalRisks: number;
    criticalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    avgRiskScore: number;
  };
  recommendations: {
    id: string;
    riskId: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'open' | 'in_progress' | 'completed' | 'rejected';
  }[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    nextReview: Date;
  };
}

// Compliance Task
interface ComplianceTask {
  id: string;
  type: 'evidence_collection' | 'control_review' | 'policy_review' | 'training' | 'remediation' | 'assessment';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  assignee: {
    userId: string;
    userName: string;
    email: string;
  };
  dueDate: Date;
  completedDate?: Date;
  relatedItems: {
    type: 'control' | 'audit' | 'finding' | 'policy' | 'risk';
    id: string;
    name: string;
  }[];
  notes: string;
  attachments: {
    id: string;
    name: string;
    url: string;
    uploadedAt: Date;
  }[];
  reminders: {
    enabled: boolean;
    daysBefore: number[];
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Compliance Dashboard
interface ComplianceDashboard {
  overview: {
    overallScore: number;
    trend: 'improving' | 'stable' | 'declining';
    frameworkScores: {
      framework: ComplianceFramework;
      score: number;
      status: ComplianceStatus;
    }[];
  };
  controls: {
    total: number;
    implemented: number;
    partiallyImplemented: number;
    notImplemented: number;
    notApplicable: number;
  };
  findings: {
    total: number;
    open: number;
    inRemediation: number;
    overdue: number;
    bySeverity: Record<FindingSeverity, number>;
  };
  audits: {
    upcoming: number;
    inProgress: number;
    completed: number;
    nextAudit?: {
      name: string;
      date: Date;
      framework: string;
    };
  };
  tasks: {
    total: number;
    pending: number;
    overdue: number;
    completedThisMonth: number;
  };
  risks: {
    total: number;
    critical: number;
    high: number;
    avgScore: number;
  };
}

// Compliance Report
interface ComplianceReport {
  id: string;
  name: string;
  type: 'executive_summary' | 'detailed' | 'gap_analysis' | 'trend' | 'audit_report';
  framework?: ComplianceFramework;
  period: {
    start: Date;
    end: Date;
  };
  generatedAt: Date;
  generatedBy: string;
  sections: {
    name: string;
    content: string;
    charts?: {
      type: string;
      data: unknown;
    }[];
  }[];
  summary: {
    overallScore: number;
    keyFindings: string[];
    recommendations: string[];
    trends: {
      metric: string;
      direction: 'up' | 'down' | 'stable';
      change: number;
    }[];
  };
  distribution: {
    recipients: string[];
    sentAt?: Date;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Compliance Statistics
interface ComplianceStatistics {
  overview: {
    overallComplianceScore: number;
    totalControls: number;
    totalFindings: number;
    totalAudits: number;
    activePolicies: number;
  };
  byFramework: {
    framework: ComplianceFramework;
    score: number;
    controls: number;
    findings: number;
    status: ComplianceStatus;
  }[];
  controlMetrics: {
    implementationRate: number;
    automationRate: number;
    testPassRate: number;
    avgMaturityLevel: number;
  };
  findingMetrics: {
    avgRemediationTime: number;
    overdueRate: number;
    recurrenceRate: number;
    bySeverity: Record<FindingSeverity, number>;
  };
  trends: {
    date: string;
    complianceScore: number;
    openFindings: number;
    controlsImplemented: number;
  }[];
}

class ComplianceAuditService {
  private static instance: ComplianceAuditService;
  private frameworks: Map<string, ComplianceFrameworkDefinition> = new Map();
  private controls: Map<string, ComplianceControl> = new Map();
  private evidence: Map<string, ControlEvidence> = new Map();
  private audits: Map<string, ComplianceAudit> = new Map();
  private findings: Map<string, AuditFinding> = new Map();
  private policies: Map<string, CompliancePolicy> = new Map();
  private riskAssessments: Map<string, RiskAssessment> = new Map();
  private tasks: Map<string, ComplianceTask> = new Map();
  private reports: Map<string, ComplianceReport> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ComplianceAuditService {
    if (!ComplianceAuditService.instance) {
      ComplianceAuditService.instance = new ComplianceAuditService();
    }
    return ComplianceAuditService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Compliance Frameworks
    const frameworksData = [
      { name: 'SOC 2 Type II', shortName: 'SOC2', controls: 100 },
      { name: 'ISO 27001:2022', shortName: 'ISO27001', controls: 114 },
      { name: 'General Data Protection Regulation', shortName: 'GDPR', controls: 85 },
      { name: 'Payment Card Industry Data Security Standard', shortName: 'PCI_DSS', controls: 78 },
      { name: 'NIST Cybersecurity Framework', shortName: 'NIST', controls: 108 },
    ];

    const usersData = [
      { name: 'John Smith', department: 'Security' },
      { name: 'Sarah Johnson', department: 'Compliance' },
      { name: 'Mike Chen', department: 'IT' },
      { name: 'Emily Davis', department: 'Legal' },
    ];

    frameworksData.forEach((f, idx) => {
      const framework: ComplianceFrameworkDefinition = {
        id: `fw-${(idx + 1).toString().padStart(4, '0')}`,
        name: f.name,
        shortName: f.shortName as ComplianceFramework,
        version: '2023',
        description: `${f.name} compliance framework`,
        publisher: f.shortName === 'SOC2' ? 'AICPA' : f.shortName === 'ISO27001' ? 'ISO' : 'Various',
        status: 'active',
        effectiveDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        controlCount: f.controls,
        categories: [
          { id: `cat-${idx}-1`, name: 'Access Control', description: 'Access management controls', controlCount: Math.floor(f.controls * 0.2) },
          { id: `cat-${idx}-2`, name: 'Data Protection', description: 'Data security controls', controlCount: Math.floor(f.controls * 0.25) },
          { id: `cat-${idx}-3`, name: 'Incident Response', description: 'Incident management controls', controlCount: Math.floor(f.controls * 0.15) },
          { id: `cat-${idx}-4`, name: 'Risk Management', description: 'Risk assessment controls', controlCount: Math.floor(f.controls * 0.2) },
          { id: `cat-${idx}-5`, name: 'Security Operations', description: 'Operational security controls', controlCount: Math.floor(f.controls * 0.2) },
        ],
        complianceScore: 75 + Math.random() * 20,
        lastAssessment: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextAssessment: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        certifications: f.shortName === 'SOC2' || f.shortName === 'ISO27001' ? [
          {
            name: `${f.name} Certification`,
            issuedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
            expirationDate: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000),
            issuer: f.shortName === 'SOC2' ? 'External Auditor' : 'ISO Registrar',
            status: 'valid',
          },
        ] : [],
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.frameworks.set(framework.id, framework);

      // Create controls for each framework
      const categories = ['Access Control', 'Data Protection', 'Incident Response', 'Risk Management', 'Security Operations'];
      for (let c = 0; c < 20; c++) {
        const user = usersData[c % usersData.length];
        const status: ControlStatus[] = ['implemented', 'implemented', 'implemented', 'partially_implemented', 'not_implemented'];
        const control: ComplianceControl = {
          id: `ctrl-${framework.id}-${(c + 1).toString().padStart(3, '0')}`,
          frameworkId: framework.id,
          controlNumber: `${f.shortName}-${(c + 1).toString().padStart(3, '0')}`,
          name: `${categories[c % 5]} Control ${c + 1}`,
          description: `Control requirement for ${categories[c % 5].toLowerCase()} - ${c + 1}`,
          category: categories[c % 5],
          status: status[c % 5],
          owner: {
            userId: `user-${(c % 4 + 1).toString().padStart(4, '0')}`,
            userName: user.name,
            email: `${user.name.toLowerCase().replace(' ', '.')}@rescueping.com`,
          },
          implementation: {
            description: `Implementation details for control ${c + 1}`,
            procedures: ['Procedure 1', 'Procedure 2', 'Procedure 3'],
            tools: ['Tool A', 'Tool B'],
            automationLevel: c % 3 === 0 ? 'fully_automated' : c % 3 === 1 ? 'semi_automated' : 'manual',
          },
          testing: {
            frequency: ['continuous', 'weekly', 'monthly', 'quarterly'][c % 4] as ComplianceControl['testing']['frequency'],
            lastTested: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            nextTest: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
            testProcedure: `Test procedure for control ${c + 1}`,
          },
          evidence: [],
          mappings: [],
          risks: [`risk-${c % 3 + 1}`],
          metrics: {
            effectivenessScore: 70 + Math.random() * 25,
            maturityLevel: Math.floor(Math.random() * 3) + 2,
            testPassRate: 80 + Math.random() * 18,
          },
          metadata: {
            createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
            lastReviewedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
            version: 1,
          },
        };
        this.controls.set(control.id, control);

        // Create evidence for some controls
        if (c % 3 === 0) {
          const evidenceItem: ControlEvidence = {
            id: `evd-${control.id}-1`,
            controlId: control.id,
            type: ['document', 'screenshot', 'log', 'automated'][c % 4] as EvidenceType,
            name: `Evidence for ${control.name}`,
            description: `Supporting evidence for control ${control.controlNumber}`,
            source: 'Internal audit',
            collectedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            status: 'valid',
            artifact: {
              url: `/evidence/${control.id}/artifact.pdf`,
              size: Math.floor(Math.random() * 1000000) + 10000,
            },
            metadata: {
              createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
              createdBy: user.name,
              updatedAt: new Date(),
            },
          };
          this.evidence.set(evidenceItem.id, evidenceItem);
        }
      }
    });

    // Initialize Audits
    const auditsData = [
      { name: 'Annual SOC 2 Audit', type: 'external', status: 'completed' },
      { name: 'Q3 Internal Audit', type: 'internal', status: 'in_progress' },
      { name: 'ISO 27001 Recertification', type: 'certification', status: 'planned' },
      { name: 'GDPR Compliance Review', type: 'regulatory', status: 'completed' },
    ];

    auditsData.forEach((a, idx) => {
      const audit: ComplianceAudit = {
        id: `audit-${(idx + 1).toString().padStart(4, '0')}`,
        name: a.name,
        description: `${a.name} - ${new Date().getFullYear()}`,
        type: a.type as ComplianceAudit['type'],
        frameworkIds: [`fw-${(idx % 5 + 1).toString().padStart(4, '0')}`],
        status: a.status as AuditStatus,
        scope: {
          systems: ['API Gateway', 'User Service', 'Database'],
          processes: ['Access Management', 'Change Management', 'Incident Response'],
          departments: ['Engineering', 'Security', 'Operations'],
          locations: ['US-East', 'US-West'],
        },
        schedule: {
          plannedStart: new Date(Date.now() - (idx * 30) * 24 * 60 * 60 * 1000),
          plannedEnd: new Date(Date.now() - (idx * 30 - 30) * 24 * 60 * 60 * 1000),
          actualStart: a.status !== 'planned' ? new Date(Date.now() - (idx * 30) * 24 * 60 * 60 * 1000) : undefined,
          actualEnd: a.status === 'completed' ? new Date(Date.now() - (idx * 30 - 25) * 24 * 60 * 60 * 1000) : undefined,
        },
        auditor: {
          type: a.type === 'internal' ? 'internal' : 'external',
          organization: a.type !== 'internal' ? 'External Audit Firm LLC' : undefined,
          leadAuditor: {
            name: a.type === 'internal' ? usersData[1].name : 'External Lead Auditor',
            email: a.type === 'internal' ? 'sarah.johnson@rescueping.com' : 'auditor@external.com',
          },
          team: [
            { name: 'Auditor 1', role: 'Senior Auditor' },
            { name: 'Auditor 2', role: 'IT Auditor' },
          ],
        },
        findings: [],
        controlsAssessed: Array.from({ length: 10 }, (_, i) => ({
          controlId: `ctrl-fw-${(idx % 5 + 1).toString().padStart(4, '0')}-${(i + 1).toString().padStart(3, '0')}`,
          status: i % 5 === 0 ? 'failed' : 'passed' as 'passed' | 'failed' | 'not_tested',
          notes: i % 5 === 0 ? 'Gap identified' : undefined,
        })),
        evidence: {
          requested: 50,
          collected: a.status === 'completed' ? 50 : a.status === 'in_progress' ? 35 : 0,
          pending: a.status === 'completed' ? 0 : a.status === 'in_progress' ? 15 : 50,
        },
        report: a.status === 'completed' ? {
          url: `/reports/audit-${idx + 1}.pdf`,
          generatedAt: new Date(Date.now() - (idx * 30 - 20) * 24 * 60 * 60 * 1000),
          type: 'final',
        } : undefined,
        metadata: {
          createdAt: new Date(Date.now() - (idx * 30 + 30) * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.audits.set(audit.id, audit);

      // Create findings for audits
      if (a.status === 'completed' || a.status === 'in_progress') {
        const findingsCount = Math.floor(Math.random() * 5) + 2;
        for (let f = 0; f < findingsCount; f++) {
          const severity: FindingSeverity[] = ['critical', 'high', 'medium', 'low', 'informational'];
          const finding: AuditFinding = {
            id: `finding-${audit.id}-${(f + 1).toString().padStart(3, '0')}`,
            auditId: audit.id,
            controlId: `ctrl-fw-${(idx % 5 + 1).toString().padStart(4, '0')}-${(f + 1).toString().padStart(3, '0')}`,
            title: `Finding ${f + 1}: ${['Access Control Gap', 'Logging Deficiency', 'Configuration Issue', 'Policy Violation', 'Documentation Gap'][f % 5]}`,
            description: `Detailed description of finding ${f + 1}`,
            severity: severity[f % 5],
            status: a.status === 'completed' && f < 3 ? 'closed' : f < 2 ? 'in_remediation' : 'open',
            category: ['Access Control', 'Monitoring', 'Configuration', 'Policy', 'Documentation'][f % 5],
            rootCause: `Root cause analysis for finding ${f + 1}`,
            impact: {
              description: `Impact description for finding ${f + 1}`,
              affectedSystems: ['System A', 'System B'],
              riskScore: (5 - (f % 5)) * 2,
            },
            remediation: {
              plan: `Remediation plan for finding ${f + 1}`,
              owner: {
                userId: `user-${(f % 4 + 1).toString().padStart(4, '0')}`,
                userName: usersData[f % 4].name,
              },
              dueDate: new Date(Date.now() + (30 - f * 5) * 24 * 60 * 60 * 1000),
              completedDate: a.status === 'completed' && f < 3 ? new Date() : undefined,
              steps: [
                { id: 's1', description: 'Step 1', status: a.status === 'completed' && f < 3 ? 'completed' : 'pending' },
                { id: 's2', description: 'Step 2', status: a.status === 'completed' && f < 3 ? 'completed' : 'pending' },
              ],
            },
            evidence: {
              findingEvidence: [],
              remediationEvidence: [],
            },
            history: [
              { timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), action: 'Created', actor: 'Auditor' },
            ],
            metadata: {
              createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              updatedAt: new Date(),
              closedAt: a.status === 'completed' && f < 3 ? new Date() : undefined,
            },
          };
          this.findings.set(finding.id, finding);
        }
      }
    });

    // Initialize Policies
    const policiesData = [
      { name: 'Information Security Policy', type: 'policy' },
      { name: 'Access Control Standard', type: 'standard' },
      { name: 'Incident Response Procedure', type: 'procedure' },
      { name: 'Data Classification Guideline', type: 'guideline' },
    ];

    policiesData.forEach((p, idx) => {
      const policy: CompliancePolicy = {
        id: `policy-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: `${p.name} for RescuePing`,
        type: p.type as CompliancePolicy['type'],
        status: 'approved',
        version: '1.0',
        effectiveDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        reviewDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        owner: {
          userId: `user-${(idx % 4 + 1).toString().padStart(4, '0')}`,
          userName: usersData[idx % 4].name,
          department: usersData[idx % 4].department,
        },
        approvers: [
          {
            userId: 'user-0001',
            userName: 'John Smith',
            status: 'approved',
            approvedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          },
          {
            userId: 'user-0004',
            userName: 'Emily Davis',
            status: 'approved',
            approvedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          },
        ],
        scope: {
          departments: ['All'],
          roles: ['All'],
          systems: ['All'],
        },
        content: {
          purpose: `Purpose of ${p.name}`,
          scope: 'This policy applies to all employees and contractors',
          policy: `Main policy content for ${p.name}`,
          procedures: ['Procedure 1', 'Procedure 2', 'Procedure 3'],
          exceptions: ['Exception requests must be approved by CISO'],
          references: ['ISO 27001', 'NIST CSF'],
        },
        controls: [`ctrl-fw-0001-${(idx + 1).toString().padStart(3, '0')}`],
        frameworks: ['SOC2', 'ISO27001'] as ComplianceFramework[],
        acknowledgments: {
          required: true,
          count: 100,
          acknowledged: 85 + Math.floor(Math.random() * 10),
          pending: 5 + Math.floor(Math.random() * 5),
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: usersData[idx % 4].name,
          updatedAt: new Date(),
          publishedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        },
      };
      this.policies.set(policy.id, policy);
    });

    // Initialize Risk Assessments
    const riskAssessment: RiskAssessment = {
      id: 'ra-0001',
      name: 'Annual Security Risk Assessment',
      description: 'Annual security risk assessment for RescuePing platform',
      type: 'security',
      status: 'completed',
      scope: {
        systems: ['API Gateway', 'User Service', 'Database', 'Cache'],
        processes: ['Authentication', 'Data Processing', 'Incident Response'],
        assets: ['Customer Data', 'System Configurations', 'Source Code'],
      },
      assessor: {
        userId: 'user-0001',
        userName: 'John Smith',
      },
      methodology: 'NIST Risk Management Framework',
      risks: [
        {
          id: 'risk-1',
          name: 'Unauthorized Access',
          description: 'Risk of unauthorized access to sensitive systems',
          category: 'Access Control',
          likelihood: 'unlikely',
          impact: 'major',
          inherentRiskScore: 8,
          residualRiskScore: 4,
          controls: ['ctrl-fw-0001-001', 'ctrl-fw-0001-002'],
          treatment: 'mitigate',
          owner: 'John Smith',
        },
        {
          id: 'risk-2',
          name: 'Data Breach',
          description: 'Risk of customer data exposure',
          category: 'Data Protection',
          likelihood: 'rare',
          impact: 'catastrophic',
          inherentRiskScore: 9,
          residualRiskScore: 5,
          controls: ['ctrl-fw-0001-003', 'ctrl-fw-0001-004'],
          treatment: 'mitigate',
          owner: 'Sarah Johnson',
        },
        {
          id: 'risk-3',
          name: 'Service Disruption',
          description: 'Risk of service unavailability',
          category: 'Availability',
          likelihood: 'possible',
          impact: 'moderate',
          inherentRiskScore: 6,
          residualRiskScore: 3,
          controls: ['ctrl-fw-0001-005'],
          treatment: 'accept',
          owner: 'Mike Chen',
        },
      ],
      summary: {
        totalRisks: 3,
        criticalRisks: 0,
        highRisks: 2,
        mediumRisks: 1,
        lowRisks: 0,
        avgRiskScore: 4,
      },
      recommendations: [
        { id: 'rec-1', riskId: 'risk-1', description: 'Implement MFA for all admin access', priority: 'high', status: 'completed' },
        { id: 'rec-2', riskId: 'risk-2', description: 'Encrypt all data at rest', priority: 'high', status: 'in_progress' },
      ],
      metadata: {
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextReview: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
      },
    };
    this.riskAssessments.set(riskAssessment.id, riskAssessment);

    // Initialize Compliance Tasks
    const tasksData = [
      { type: 'evidence_collection', title: 'Collect Q3 access logs' },
      { type: 'control_review', title: 'Review encryption controls' },
      { type: 'policy_review', title: 'Annual policy review' },
      { type: 'training', title: 'Security awareness training' },
      { type: 'remediation', title: 'Remediate audit finding #1' },
    ];

    tasksData.forEach((t, idx) => {
      const task: ComplianceTask = {
        id: `task-${(idx + 1).toString().padStart(4, '0')}`,
        type: t.type as ComplianceTask['type'],
        title: t.title,
        description: `Task details for ${t.title}`,
        status: idx < 2 ? 'completed' : idx < 4 ? 'in_progress' : 'pending',
        priority: idx < 2 ? 'high' : 'medium',
        assignee: {
          userId: `user-${(idx % 4 + 1).toString().padStart(4, '0')}`,
          userName: usersData[idx % 4].name,
          email: `${usersData[idx % 4].name.toLowerCase().replace(' ', '.')}@rescueping.com`,
        },
        dueDate: new Date(Date.now() + (idx - 2) * 7 * 24 * 60 * 60 * 1000),
        completedDate: idx < 2 ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : undefined,
        relatedItems: [],
        notes: '',
        attachments: [],
        reminders: {
          enabled: true,
          daysBefore: [7, 3, 1],
        },
        metadata: {
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.tasks.set(task.id, task);
    });
  }

  // Framework Operations
  public getFrameworks(): ComplianceFrameworkDefinition[] {
    return Array.from(this.frameworks.values());
  }

  public getFrameworkById(id: string): ComplianceFrameworkDefinition | undefined {
    return this.frameworks.get(id);
  }

  // Control Operations
  public getControls(frameworkId?: string): ComplianceControl[] {
    let controls = Array.from(this.controls.values());
    if (frameworkId) controls = controls.filter((c) => c.frameworkId === frameworkId);
    return controls.sort((a, b) => a.controlNumber.localeCompare(b.controlNumber));
  }

  public getControlById(id: string): ComplianceControl | undefined {
    return this.controls.get(id);
  }

  public updateControlStatus(id: string, status: ControlStatus): ComplianceControl {
    const control = this.controls.get(id);
    if (!control) throw new Error('Control not found');

    control.status = status;
    control.metadata.updatedAt = new Date();

    this.emit('control_updated', control);
    return control;
  }

  // Evidence Operations
  public getEvidence(controlId?: string): ControlEvidence[] {
    let evidence = Array.from(this.evidence.values());
    if (controlId) evidence = evidence.filter((e) => e.controlId === controlId);
    return evidence.sort((a, b) => b.collectedAt.getTime() - a.collectedAt.getTime());
  }

  public addEvidence(data: Partial<ControlEvidence>): ControlEvidence {
    const evidenceItem: ControlEvidence = {
      id: `evd-${this.generateId()}`,
      controlId: data.controlId || '',
      type: data.type || 'document',
      name: data.name || '',
      description: data.description || '',
      source: data.source || '',
      collectedAt: new Date(),
      validUntil: data.validUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'pending_review',
      artifact: data.artifact || {},
      metadata: {
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
      },
    };

    this.evidence.set(evidenceItem.id, evidenceItem);
    this.emit('evidence_added', evidenceItem);
    return evidenceItem;
  }

  // Audit Operations
  public getAudits(status?: AuditStatus): ComplianceAudit[] {
    let audits = Array.from(this.audits.values());
    if (status) audits = audits.filter((a) => a.status === status);
    return audits.sort((a, b) => b.schedule.plannedStart.getTime() - a.schedule.plannedStart.getTime());
  }

  public getAuditById(id: string): ComplianceAudit | undefined {
    return this.audits.get(id);
  }

  // Finding Operations
  public getFindings(auditId?: string, severity?: FindingSeverity): AuditFinding[] {
    let findings = Array.from(this.findings.values());
    if (auditId) findings = findings.filter((f) => f.auditId === auditId);
    if (severity) findings = findings.filter((f) => f.severity === severity);
    return findings.sort((a, b) => {
      const severityOrder = ['critical', 'high', 'medium', 'low', 'informational'];
      return severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
    });
  }

  public getFindingById(id: string): AuditFinding | undefined {
    return this.findings.get(id);
  }

  public updateFindingStatus(id: string, status: AuditFinding['status']): AuditFinding {
    const finding = this.findings.get(id);
    if (!finding) throw new Error('Finding not found');

    finding.status = status;
    finding.metadata.updatedAt = new Date();
    if (status === 'closed') finding.metadata.closedAt = new Date();

    this.emit('finding_updated', finding);
    return finding;
  }

  // Policy Operations
  public getPolicies(status?: CompliancePolicy['status']): CompliancePolicy[] {
    let policies = Array.from(this.policies.values());
    if (status) policies = policies.filter((p) => p.status === status);
    return policies.sort((a, b) => a.name.localeCompare(b.name));
  }

  public getPolicyById(id: string): CompliancePolicy | undefined {
    return this.policies.get(id);
  }

  // Risk Assessment Operations
  public getRiskAssessments(): RiskAssessment[] {
    return Array.from(this.riskAssessments.values());
  }

  public getRiskAssessmentById(id: string): RiskAssessment | undefined {
    return this.riskAssessments.get(id);
  }

  // Task Operations
  public getTasks(status?: ComplianceTask['status']): ComplianceTask[] {
    let tasks = Array.from(this.tasks.values());
    if (status) tasks = tasks.filter((t) => t.status === status);
    return tasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  public getTaskById(id: string): ComplianceTask | undefined {
    return this.tasks.get(id);
  }

  public completeTask(id: string): ComplianceTask {
    const task = this.tasks.get(id);
    if (!task) throw new Error('Task not found');

    task.status = 'completed';
    task.completedDate = new Date();
    task.metadata.updatedAt = new Date();

    this.emit('task_completed', task);
    return task;
  }

  // Dashboard
  public getDashboard(): ComplianceDashboard {
    const controls = Array.from(this.controls.values());
    const findings = Array.from(this.findings.values());
    const audits = Array.from(this.audits.values());
    const tasks = Array.from(this.tasks.values());
    const risks = Array.from(this.riskAssessments.values()).flatMap((ra) => ra.risks);

    const findingsBySeverity: Record<FindingSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      informational: 0,
    };
    findings.forEach((f) => {
      findingsBySeverity[f.severity]++;
    });

    return {
      overview: {
        overallScore: 82,
        trend: 'improving',
        frameworkScores: Array.from(this.frameworks.values()).map((f) => ({
          framework: f.shortName,
          score: f.complianceScore,
          status: f.complianceScore >= 90 ? 'compliant' : f.complianceScore >= 70 ? 'partially_compliant' : 'non_compliant',
        })),
      },
      controls: {
        total: controls.length,
        implemented: controls.filter((c) => c.status === 'implemented').length,
        partiallyImplemented: controls.filter((c) => c.status === 'partially_implemented').length,
        notImplemented: controls.filter((c) => c.status === 'not_implemented').length,
        notApplicable: controls.filter((c) => c.status === 'not_applicable').length,
      },
      findings: {
        total: findings.length,
        open: findings.filter((f) => f.status === 'open').length,
        inRemediation: findings.filter((f) => f.status === 'in_remediation').length,
        overdue: findings.filter((f) => f.status !== 'closed' && f.remediation.dueDate < new Date()).length,
        bySeverity: findingsBySeverity,
      },
      audits: {
        upcoming: audits.filter((a) => a.status === 'planned').length,
        inProgress: audits.filter((a) => a.status === 'in_progress').length,
        completed: audits.filter((a) => a.status === 'completed').length,
        nextAudit: audits.find((a) => a.status === 'planned') ? {
          name: audits.find((a) => a.status === 'planned')!.name,
          date: audits.find((a) => a.status === 'planned')!.schedule.plannedStart,
          framework: audits.find((a) => a.status === 'planned')!.frameworkIds[0],
        } : undefined,
      },
      tasks: {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === 'pending').length,
        overdue: tasks.filter((t) => t.status !== 'completed' && t.dueDate < new Date()).length,
        completedThisMonth: tasks.filter((t) => t.status === 'completed' && t.completedDate && t.completedDate.getMonth() === new Date().getMonth()).length,
      },
      risks: {
        total: risks.length,
        critical: risks.filter((r) => r.residualRiskScore >= 8).length,
        high: risks.filter((r) => r.residualRiskScore >= 6 && r.residualRiskScore < 8).length,
        avgScore: risks.reduce((sum, r) => sum + r.residualRiskScore, 0) / risks.length || 0,
      },
    };
  }

  // Statistics
  public getStatistics(): ComplianceStatistics {
    const controls = Array.from(this.controls.values());
    const findings = Array.from(this.findings.values());
    const audits = Array.from(this.audits.values());
    const policies = Array.from(this.policies.values());

    const findingsBySeverity: Record<FindingSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      informational: 0,
    };
    findings.forEach((f) => {
      findingsBySeverity[f.severity]++;
    });

    return {
      overview: {
        overallComplianceScore: 82,
        totalControls: controls.length,
        totalFindings: findings.length,
        totalAudits: audits.length,
        activePolicies: policies.filter((p) => p.status === 'approved').length,
      },
      byFramework: Array.from(this.frameworks.values()).map((f) => ({
        framework: f.shortName,
        score: f.complianceScore,
        controls: controls.filter((c) => c.frameworkId === f.id).length,
        findings: findings.filter((fn) => controls.find((c) => c.id === fn.controlId)?.frameworkId === f.id).length,
        status: f.complianceScore >= 90 ? 'compliant' : f.complianceScore >= 70 ? 'partially_compliant' : 'non_compliant',
      })),
      controlMetrics: {
        implementationRate: (controls.filter((c) => c.status === 'implemented').length / controls.length) * 100,
        automationRate: (controls.filter((c) => c.implementation.automationLevel !== 'manual').length / controls.length) * 100,
        testPassRate: controls.reduce((sum, c) => sum + c.metrics.testPassRate, 0) / controls.length,
        avgMaturityLevel: controls.reduce((sum, c) => sum + c.metrics.maturityLevel, 0) / controls.length,
      },
      findingMetrics: {
        avgRemediationTime: 30,
        overdueRate: (findings.filter((f) => f.status !== 'closed' && f.remediation.dueDate < new Date()).length / findings.length) * 100,
        recurrenceRate: 5,
        bySeverity: findingsBySeverity,
      },
      trends: [],
    };
  }

  // Event Handling
  public subscribe(callback: (event: string, data: unknown) => void): () => void {
    this.eventListeners.push(callback);
    return () => {
      const index = this.eventListeners.indexOf(callback);
      if (index > -1) this.eventListeners.splice(index, 1);
    };
  }

  private emit(event: string, data: unknown): void {
    this.eventListeners.forEach((callback) => callback(event, data));
  }
}

export const complianceAuditService = ComplianceAuditService.getInstance();
export type {
  ComplianceFramework,
  ComplianceStatus,
  ControlStatus,
  AuditStatus,
  FindingSeverity,
  EvidenceType,
  ComplianceControl,
  ControlEvidence,
  ComplianceFrameworkDefinition,
  ComplianceAudit,
  AuditFinding,
  CompliancePolicy,
  RiskAssessment,
  ComplianceTask,
  ComplianceDashboard,
  ComplianceReport,
  ComplianceStatistics,
};
