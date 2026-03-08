/**
 * Compliance Management Service
 * Regulatory compliance, policy enforcement, and audit management for disaster management
 */

// Compliance status
type ComplianceStatus = 'compliant' | 'non_compliant' | 'partially_compliant' | 'pending_review' | 'not_applicable';

// Regulation type
type RegulationType = 'data_protection' | 'accessibility' | 'financial' | 'healthcare' | 'environmental' | 'safety' | 'labor' | 'government' | 'industry_standard';

// Assessment status
type AssessmentStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';

// Control status
type ControlStatus = 'implemented' | 'partially_implemented' | 'not_implemented' | 'planned' | 'not_applicable';

// Risk level
type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal';

// Regulation
interface Regulation {
  id: string;
  name: string;
  shortName: string;
  description: string;
  type: RegulationType;
  jurisdiction: string;
  authority: string;
  effectiveDate: Date;
  version: string;
  requirements: Requirement[];
  applicability: {
    regions: string[];
    sectors: string[];
    dataTypes: string[];
    userTypes: string[];
  };
  penalties: {
    description: string;
    maxFine?: number;
    currency?: string;
    otherConsequences?: string[];
  };
  resources: {
    officialUrl: string;
    guidanceUrl?: string;
    faqUrl?: string;
  };
  lastUpdated: Date;
  isActive: boolean;
}

// Requirement
interface Requirement {
  id: string;
  regulationId: string;
  code: string;
  title: string;
  description: string;
  category: string;
  priority: RiskLevel;
  controls: Control[];
  evidence: string[];
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'on_demand';
  responsible: string[];
  dependencies: string[];
  notes?: string;
}

// Control
interface Control {
  id: string;
  requirementId: string;
  code: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective' | 'compensating';
  category: 'technical' | 'administrative' | 'physical';
  status: ControlStatus;
  implementation: {
    method: string;
    system?: string;
    automation: 'fully_automated' | 'partially_automated' | 'manual';
    frequency: string;
    lastTested?: Date;
    nextTest?: Date;
  };
  effectiveness: number;
  owner: string;
  evidence: ControlEvidence[];
  risks: string[];
}

// Control evidence
interface ControlEvidence {
  id: string;
  type: 'document' | 'screenshot' | 'log' | 'report' | 'certificate' | 'attestation';
  name: string;
  description: string;
  url: string;
  collectedAt: Date;
  collectedBy: string;
  expiresAt?: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

// Compliance assessment
interface ComplianceAssessment {
  id: string;
  name: string;
  description: string;
  regulationIds: string[];
  type: 'self_assessment' | 'internal_audit' | 'external_audit' | 'gap_analysis' | 'certification';
  status: AssessmentStatus;
  scope: {
    systems: string[];
    processes: string[];
    departments: string[];
    dataTypes: string[];
  };
  schedule: {
    plannedStart: Date;
    plannedEnd: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  team: {
    lead: string;
    assessors: string[];
    reviewers: string[];
    stakeholders: string[];
  };
  findings: Finding[];
  recommendations: Recommendation[];
  overallStatus: ComplianceStatus;
  complianceScore: number;
  riskScore: number;
  report?: {
    generatedAt: Date;
    url: string;
    format: string;
  };
  signOff?: {
    signedBy: string;
    signedAt: Date;
    comments?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Finding
interface Finding {
  id: string;
  assessmentId: string;
  requirementId: string;
  title: string;
  description: string;
  severity: RiskLevel;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted' | 'disputed';
  type: 'gap' | 'deficiency' | 'observation' | 'improvement';
  evidence: string[];
  rootCause?: string;
  impact: string;
  likelihood: RiskLevel;
  remediation?: {
    plan: string;
    owner: string;
    dueDate: Date;
    progress: number;
    completedAt?: Date;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Recommendation
interface Recommendation {
  id: string;
  assessmentId: string;
  findingId?: string;
  title: string;
  description: string;
  priority: RiskLevel;
  status: 'proposed' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  owner?: string;
  dueDate?: Date;
  completedAt?: Date;
  notes?: string;
}

// Policy
interface Policy {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: string;
  type: 'policy' | 'standard' | 'procedure' | 'guideline';
  status: 'draft' | 'review' | 'approved' | 'active' | 'deprecated' | 'archived';
  version: string;
  effectiveDate?: Date;
  expiryDate?: Date;
  content: {
    purpose: string;
    scope: string;
    definitions: { term: string; definition: string }[];
    statements: { id: string; text: string; rationale?: string }[];
    exceptions?: string;
    enforcement?: string;
  };
  applicability: {
    regions: string[];
    departments: string[];
    roles: string[];
  };
  relatedRegulations: string[];
  relatedPolicies: string[];
  owner: string;
  approver?: string;
  approvedAt?: Date;
  reviewCycle: number;
  nextReviewDate?: Date;
  acknowledgements: {
    userId: string;
    acknowledgedAt: Date;
  }[];
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
  };
}

// Training record
interface TrainingRecord {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  type: 'compliance' | 'policy' | 'security' | 'safety' | 'skills';
  status: 'not_started' | 'in_progress' | 'completed' | 'expired' | 'waived';
  progress: number;
  score?: number;
  passingScore: number;
  attempts: number;
  startedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date;
  certificateUrl?: string;
  notes?: string;
}

// Compliance report
interface ComplianceReport {
  id: string;
  name: string;
  type: 'summary' | 'detailed' | 'executive' | 'regulatory' | 'audit_trail';
  period: { start: Date; end: Date };
  regulations: string[];
  sections: {
    title: string;
    content: string;
    data?: Record<string, unknown>;
  }[];
  summary: {
    overallStatus: ComplianceStatus;
    complianceScore: number;
    riskScore: number;
    totalRequirements: number;
    compliantCount: number;
    nonCompliantCount: number;
    pendingCount: number;
    openFindings: number;
    closedFindings: number;
  };
  generatedAt: Date;
  generatedBy: string;
  format: 'pdf' | 'html' | 'excel' | 'json';
  url?: string;
}

// Compliance dashboard
interface ComplianceDashboard {
  overallStatus: ComplianceStatus;
  complianceScore: number;
  riskScore: number;
  byRegulation: {
    regulationId: string;
    name: string;
    status: ComplianceStatus;
    score: number;
    requirementsMet: number;
    totalRequirements: number;
  }[];
  byCategory: Record<string, { compliant: number; nonCompliant: number; pending: number }>;
  recentFindings: Finding[];
  upcomingDeadlines: { id: string; title: string; dueDate: Date; type: string }[];
  trends: {
    date: string;
    complianceScore: number;
    riskScore: number;
    openFindings: number;
  }[];
  alerts: { level: RiskLevel; message: string; timestamp: Date }[];
}

class ComplianceManagementService {
  private static instance: ComplianceManagementService;
  private regulations: Map<string, Regulation> = new Map();
  private assessments: Map<string, ComplianceAssessment> = new Map();
  private policies: Map<string, Policy> = new Map();
  private trainingRecords: Map<string, TrainingRecord> = new Map();
  private reports: Map<string, ComplianceReport> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ComplianceManagementService {
    if (!ComplianceManagementService.instance) {
      ComplianceManagementService.instance = new ComplianceManagementService();
    }
    return ComplianceManagementService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize regulations
    const regulationsData: Partial<Regulation>[] = [
      {
        name: 'Digital Personal Data Protection Act',
        shortName: 'DPDPA',
        description: 'India\'s comprehensive data protection law governing personal data processing',
        type: 'data_protection',
        jurisdiction: 'India',
        authority: 'Ministry of Electronics and IT',
        effectiveDate: new Date('2023-08-11'),
        version: '1.0',
      },
      {
        name: 'Information Technology Act',
        shortName: 'IT Act',
        description: 'Primary law dealing with cybercrime and electronic commerce in India',
        type: 'data_protection',
        jurisdiction: 'India',
        authority: 'Ministry of Electronics and IT',
        effectiveDate: new Date('2000-10-17'),
        version: '2.0',
      },
      {
        name: 'Disaster Management Act',
        shortName: 'DM Act',
        description: 'Provides for effective management of disasters in India',
        type: 'government',
        jurisdiction: 'India',
        authority: 'National Disaster Management Authority',
        effectiveDate: new Date('2005-12-23'),
        version: '1.0',
      },
      {
        name: 'Rights of Persons with Disabilities Act',
        shortName: 'RPwD Act',
        description: 'Ensures accessibility and equal opportunity for persons with disabilities',
        type: 'accessibility',
        jurisdiction: 'India',
        authority: 'Ministry of Social Justice',
        effectiveDate: new Date('2016-12-28'),
        version: '1.0',
      },
      {
        name: 'Foreign Contribution Regulation Act',
        shortName: 'FCRA',
        description: 'Regulates foreign donations and ensures proper utilization',
        type: 'financial',
        jurisdiction: 'India',
        authority: 'Ministry of Home Affairs',
        effectiveDate: new Date('2010-09-26'),
        version: '2.0',
      },
      {
        name: 'Guidelines for Accessibility',
        shortName: 'GIGW',
        description: 'Guidelines for Indian Government Websites accessibility',
        type: 'accessibility',
        jurisdiction: 'India',
        authority: 'NIC',
        effectiveDate: new Date('2018-01-01'),
        version: '2.0',
      },
    ];

    regulationsData.forEach((r, idx) => {
      const regulation: Regulation = {
        id: `reg-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name!,
        shortName: r.shortName!,
        description: r.description!,
        type: r.type!,
        jurisdiction: r.jurisdiction!,
        authority: r.authority!,
        effectiveDate: r.effectiveDate!,
        version: r.version!,
        requirements: [],
        applicability: {
          regions: ['India'],
          sectors: ['Disaster Management', 'NGO', 'Government'],
          dataTypes: ['Personal Data', 'Location Data', 'Health Data'],
          userTypes: ['Citizens', 'Volunteers', 'Organizations'],
        },
        penalties: {
          description: 'Penalties as per the Act',
          maxFine: 25000000,
          currency: 'INR',
        },
        resources: {
          officialUrl: `https://www.meity.gov.in/${r.shortName?.toLowerCase()}`,
        },
        lastUpdated: new Date(),
        isActive: true,
      };

      // Add requirements
      for (let i = 1; i <= 5; i++) {
        const requirement: Requirement = {
          id: `req-${idx}-${i}`,
          regulationId: regulation.id,
          code: `${r.shortName}-R${i}`,
          title: `Requirement ${i} under ${r.shortName}`,
          description: `Detailed requirement ${i} description for ${r.name}`,
          category: ['Data Processing', 'Security', 'Consent', 'Rights', 'Reporting'][i - 1],
          priority: ['critical', 'high', 'medium', 'low', 'medium'][i - 1] as RiskLevel,
          controls: [],
          evidence: ['Policy document', 'System logs', 'Audit report'],
          frequency: ['continuous', 'daily', 'monthly', 'quarterly', 'annually'][i - 1] as Requirement['frequency'],
          responsible: ['Data Protection Officer', 'IT Team', 'Compliance Team'],
          dependencies: [],
        };

        // Add controls
        for (let j = 1; j <= 3; j++) {
          const control: Control = {
            id: `ctrl-${idx}-${i}-${j}`,
            requirementId: requirement.id,
            code: `${r.shortName}-C${i}.${j}`,
            name: `Control ${j} for Requirement ${i}`,
            description: `Implementation control for ${requirement.title}`,
            type: ['preventive', 'detective', 'corrective'][j - 1] as Control['type'],
            category: ['technical', 'administrative', 'physical'][j - 1] as Control['category'],
            status: Math.random() > 0.2 ? 'implemented' : 'partially_implemented',
            implementation: {
              method: 'Automated system control',
              system: 'Rescue Ping Platform',
              automation: ['fully_automated', 'partially_automated', 'manual'][j - 1] as Control['implementation']['automation'],
              frequency: 'Continuous',
              lastTested: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            },
            effectiveness: Math.random() * 20 + 80,
            owner: 'compliance-team',
            evidence: [],
            risks: [],
          };
          requirement.controls.push(control);
        }

        regulation.requirements.push(requirement);
      }

      this.regulations.set(regulation.id, regulation);
    });

    // Initialize policies
    const policiesData = [
      { name: 'Data Protection Policy', category: 'Privacy', type: 'policy' },
      { name: 'Information Security Policy', category: 'Security', type: 'policy' },
      { name: 'Acceptable Use Policy', category: 'Operations', type: 'policy' },
      { name: 'Incident Response Procedure', category: 'Security', type: 'procedure' },
      { name: 'Data Retention Standard', category: 'Data Management', type: 'standard' },
      { name: 'Access Control Guidelines', category: 'Security', type: 'guideline' },
      { name: 'Volunteer Code of Conduct', category: 'Ethics', type: 'policy' },
      { name: 'Donation Handling Procedure', category: 'Finance', type: 'procedure' },
    ];

    policiesData.forEach((p, idx) => {
      const policy: Policy = {
        id: `policy-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        shortName: p.name.split(' ').map((w) => w[0]).join(''),
        description: `Official ${p.name.toLowerCase()} for Rescue Ping platform`,
        category: p.category,
        type: p.type as Policy['type'],
        status: 'active',
        version: '1.0',
        effectiveDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        content: {
          purpose: `This ${p.type} establishes guidelines for ${p.name.toLowerCase().replace(' policy', '').replace(' procedure', '').replace(' standard', '').replace(' guidelines', '')}`,
          scope: 'All users, employees, volunteers, and third parties',
          definitions: [
            { term: 'Personal Data', definition: 'Any data relating to an identified or identifiable individual' },
            { term: 'Processing', definition: 'Any operation performed on personal data' },
          ],
          statements: [
            { id: 's1', text: 'All data must be processed lawfully, fairly, and transparently' },
            { id: 's2', text: 'Data must be collected for specified, explicit, and legitimate purposes' },
            { id: 's3', text: 'Data must be adequate, relevant, and limited to what is necessary' },
          ],
          enforcement: 'Violations may result in disciplinary action',
        },
        applicability: {
          regions: ['India'],
          departments: ['All'],
          roles: ['All'],
        },
        relatedRegulations: ['reg-0001', 'reg-0002'],
        relatedPolicies: [],
        owner: 'compliance-team',
        approver: 'ceo',
        approvedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        reviewCycle: 365,
        nextReviewDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
        acknowledgements: [],
        metadata: {
          createdBy: 'compliance-team',
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          updatedBy: 'compliance-team',
          updatedAt: new Date(),
        },
      };
      this.policies.set(policy.id, policy);
    });

    // Initialize assessments
    const assessmentsData = [
      { name: 'DPDPA Compliance Assessment Q1 2024', type: 'self_assessment', regulations: ['reg-0001'] },
      { name: 'Annual Security Audit 2024', type: 'internal_audit', regulations: ['reg-0002'] },
      { name: 'Accessibility Assessment', type: 'gap_analysis', regulations: ['reg-0004', 'reg-0006'] },
      { name: 'FCRA Compliance Review', type: 'external_audit', regulations: ['reg-0005'] },
    ];

    assessmentsData.forEach((a, idx) => {
      const assessment: ComplianceAssessment = {
        id: `assess-${(idx + 1).toString().padStart(4, '0')}`,
        name: a.name,
        description: `${a.type.replace('_', ' ')} for ${a.regulations.length} regulation(s)`,
        regulationIds: a.regulations,
        type: a.type as ComplianceAssessment['type'],
        status: ['completed', 'in_progress', 'scheduled', 'completed'][idx] as AssessmentStatus,
        scope: {
          systems: ['Rescue Ping Platform', 'Mobile App', 'Admin Dashboard'],
          processes: ['Data Collection', 'User Management', 'Donations'],
          departments: ['IT', 'Operations', 'Finance'],
          dataTypes: ['Personal Data', 'Financial Data'],
        },
        schedule: {
          plannedStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          plannedEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          actualStart: idx < 2 ? new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) : undefined,
          actualEnd: idx === 0 ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) : undefined,
        },
        team: {
          lead: 'compliance-lead',
          assessors: ['assessor-1', 'assessor-2'],
          reviewers: ['reviewer-1'],
          stakeholders: ['cto', 'coo'],
        },
        findings: [],
        recommendations: [],
        overallStatus: ['compliant', 'partially_compliant', 'pending_review', 'compliant'][idx] as ComplianceStatus,
        complianceScore: 75 + Math.random() * 20,
        riskScore: Math.random() * 30 + 10,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };

      // Add findings
      for (let i = 1; i <= 3; i++) {
        const finding: Finding = {
          id: `finding-${idx}-${i}`,
          assessmentId: assessment.id,
          requirementId: `req-${idx}-${i}`,
          title: `Finding ${i} - ${['Data Processing Gap', 'Access Control Issue', 'Documentation Missing'][i - 1]}`,
          description: `Detailed description of finding ${i}`,
          severity: ['high', 'medium', 'low'][i - 1] as RiskLevel,
          status: ['resolved', 'in_progress', 'open'][i - 1] as Finding['status'],
          type: ['gap', 'deficiency', 'observation'][i - 1] as Finding['type'],
          evidence: ['Audit log', 'System screenshot'],
          impact: `Potential compliance risk if not addressed`,
          likelihood: 'medium',
          remediation: {
            plan: `Remediation plan for finding ${i}`,
            owner: 'it-team',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            progress: [100, 50, 0][i - 1],
            completedAt: i === 1 ? new Date() : undefined,
          },
          notes: '',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        };
        assessment.findings.push(finding);
      }

      // Add recommendations
      for (let i = 1; i <= 2; i++) {
        const recommendation: Recommendation = {
          id: `rec-${idx}-${i}`,
          assessmentId: assessment.id,
          findingId: `finding-${idx}-${i}`,
          title: `Recommendation ${i}`,
          description: `Recommended action to address finding`,
          priority: ['high', 'medium'][i - 1] as RiskLevel,
          status: ['in_progress', 'accepted'][i - 1] as Recommendation['status'],
          effort: ['medium', 'low'][i - 1] as Recommendation['effort'],
          impact: ['high', 'medium'][i - 1] as Recommendation['impact'],
          owner: 'it-team',
          dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        };
        assessment.recommendations.push(recommendation);
      }

      this.assessments.set(assessment.id, assessment);
    });

    // Initialize training records
    const courses = [
      { id: 'course-1', name: 'Data Protection Fundamentals', type: 'compliance' },
      { id: 'course-2', name: 'Information Security Basics', type: 'security' },
      { id: 'course-3', name: 'Disaster Response Training', type: 'safety' },
      { id: 'course-4', name: 'DPDPA Compliance Training', type: 'compliance' },
    ];

    for (let i = 1; i <= 20; i++) {
      const course = courses[i % courses.length];
      const record: TrainingRecord = {
        id: `training-${i.toString().padStart(4, '0')}`,
        userId: `user-${Math.floor(i / 4) + 1}`,
        userName: `User ${Math.floor(i / 4) + 1}`,
        courseId: course.id,
        courseName: course.name,
        type: course.type as TrainingRecord['type'],
        status: ['completed', 'completed', 'in_progress', 'not_started'][i % 4] as TrainingRecord['status'],
        progress: [100, 100, 50, 0][i % 4],
        score: [95, 88, undefined, undefined][i % 4],
        passingScore: 80,
        attempts: [1, 2, 1, 0][i % 4],
        startedAt: i % 4 !== 3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
        completedAt: i % 4 < 2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
        expiresAt: i % 4 < 2 ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : undefined,
      };
      this.trainingRecords.set(record.id, record);
    }
  }

  /**
   * Get regulations
   */
  public getRegulations(filter?: { type?: RegulationType; jurisdiction?: string }): Regulation[] {
    let regulations = Array.from(this.regulations.values());

    if (filter?.type) regulations = regulations.filter((r) => r.type === filter.type);
    if (filter?.jurisdiction) regulations = regulations.filter((r) => r.jurisdiction === filter.jurisdiction);

    return regulations.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get regulation
   */
  public getRegulation(id: string): Regulation | undefined {
    return this.regulations.get(id);
  }

  /**
   * Get requirement status
   */
  public getRequirementStatus(requirementId: string): { status: ComplianceStatus; score: number; controls: Control[] } {
    for (const regulation of this.regulations.values()) {
      const requirement = regulation.requirements.find((r) => r.id === requirementId);
      if (requirement) {
        const implementedControls = requirement.controls.filter((c) => c.status === 'implemented').length;
        const totalControls = requirement.controls.length;
        const score = totalControls > 0 ? (implementedControls / totalControls) * 100 : 0;

        let status: ComplianceStatus;
        if (score === 100) status = 'compliant';
        else if (score >= 80) status = 'partially_compliant';
        else if (score >= 50) status = 'pending_review';
        else status = 'non_compliant';

        return { status, score, controls: requirement.controls };
      }
    }
    throw new Error('Requirement not found');
  }

  /**
   * Get assessments
   */
  public getAssessments(filter?: { status?: AssessmentStatus; regulationId?: string }): ComplianceAssessment[] {
    let assessments = Array.from(this.assessments.values());

    if (filter?.status) assessments = assessments.filter((a) => a.status === filter.status);
    if (filter?.regulationId) assessments = assessments.filter((a) => a.regulationIds.includes(filter.regulationId!));

    return assessments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get assessment
   */
  public getAssessment(id: string): ComplianceAssessment | undefined {
    return this.assessments.get(id);
  }

  /**
   * Create assessment
   */
  public createAssessment(data: {
    name: string;
    description: string;
    regulationIds: string[];
    type: ComplianceAssessment['type'];
    scope: ComplianceAssessment['scope'];
    schedule: { plannedStart: Date; plannedEnd: Date };
    team: ComplianceAssessment['team'];
  }): ComplianceAssessment {
    const assessment: ComplianceAssessment = {
      id: `assess-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: data.name,
      description: data.description,
      regulationIds: data.regulationIds,
      type: data.type,
      status: 'scheduled',
      scope: data.scope,
      schedule: data.schedule,
      team: data.team,
      findings: [],
      recommendations: [],
      overallStatus: 'pending_review',
      complianceScore: 0,
      riskScore: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.assessments.set(assessment.id, assessment);
    this.emit('assessment_created', assessment);

    return assessment;
  }

  /**
   * Add finding to assessment
   */
  public addFinding(assessmentId: string, finding: Omit<Finding, 'id' | 'assessmentId' | 'createdAt' | 'updatedAt'>): Finding {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    const newFinding: Finding = {
      ...finding,
      id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      assessmentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    assessment.findings.push(newFinding);
    assessment.updatedAt = new Date();

    this.emit('finding_added', newFinding);
    return newFinding;
  }

  /**
   * Get policies
   */
  public getPolicies(filter?: { category?: string; status?: Policy['status'] }): Policy[] {
    let policies = Array.from(this.policies.values());

    if (filter?.category) policies = policies.filter((p) => p.category === filter.category);
    if (filter?.status) policies = policies.filter((p) => p.status === filter.status);

    return policies.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get policy
   */
  public getPolicy(id: string): Policy | undefined {
    return this.policies.get(id);
  }

  /**
   * Acknowledge policy
   */
  public acknowledgePolicy(policyId: string, userId: string): void {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error('Policy not found');

    const existingAck = policy.acknowledgements.find((a) => a.userId === userId);
    if (!existingAck) {
      policy.acknowledgements.push({ userId, acknowledgedAt: new Date() });
    }

    this.emit('policy_acknowledged', { policyId, userId });
  }

  /**
   * Get training records
   */
  public getTrainingRecords(filter?: { userId?: string; status?: TrainingRecord['status'] }): TrainingRecord[] {
    let records = Array.from(this.trainingRecords.values());

    if (filter?.userId) records = records.filter((r) => r.userId === filter.userId);
    if (filter?.status) records = records.filter((r) => r.status === filter.status);

    return records;
  }

  /**
   * Get dashboard
   */
  public getDashboard(): ComplianceDashboard {
    const regulations = Array.from(this.regulations.values());
    const assessments = Array.from(this.assessments.values());

    // Calculate overall scores
    let totalScore = 0;
    let totalRisk = 0;

    const byRegulation = regulations.map((r) => {
      const requirementStatuses = r.requirements.map((req) => {
        const implemented = req.controls.filter((c) => c.status === 'implemented').length;
        return implemented / req.controls.length;
      });

      const score = requirementStatuses.length > 0
        ? (requirementStatuses.reduce((a, b) => a + b, 0) / requirementStatuses.length) * 100
        : 0;

      totalScore += score;

      let status: ComplianceStatus;
      if (score >= 90) status = 'compliant';
      else if (score >= 70) status = 'partially_compliant';
      else status = 'non_compliant';

      return {
        regulationId: r.id,
        name: r.shortName,
        status,
        score,
        requirementsMet: r.requirements.filter((req) =>
          req.controls.every((c) => c.status === 'implemented')
        ).length,
        totalRequirements: r.requirements.length,
      };
    });

    const avgScore = regulations.length > 0 ? totalScore / regulations.length : 0;

    // Get recent findings
    const allFindings = assessments.flatMap((a) => a.findings);
    const recentFindings = allFindings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    // Calculate risk score
    totalRisk = allFindings.filter((f) => f.status === 'open').length * 10;

    // Determine overall status
    let overallStatus: ComplianceStatus;
    if (avgScore >= 90) overallStatus = 'compliant';
    else if (avgScore >= 70) overallStatus = 'partially_compliant';
    else overallStatus = 'non_compliant';

    return {
      overallStatus,
      complianceScore: avgScore,
      riskScore: Math.min(100, totalRisk),
      byRegulation,
      byCategory: {
        data_protection: { compliant: 15, nonCompliant: 2, pending: 3 },
        accessibility: { compliant: 8, nonCompliant: 1, pending: 1 },
        financial: { compliant: 10, nonCompliant: 0, pending: 2 },
      },
      recentFindings,
      upcomingDeadlines: [
        { id: '1', title: 'DPDPA Annual Review', dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), type: 'assessment' },
        { id: '2', title: 'Security Audit Q2', dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), type: 'audit' },
      ],
      trends: [],
      alerts: allFindings
        .filter((f) => f.status === 'open' && f.severity === 'critical')
        .map((f) => ({ level: f.severity, message: f.title, timestamp: f.createdAt })),
    };
  }

  /**
   * Generate report
   */
  public generateReport(config: {
    name: string;
    type: ComplianceReport['type'];
    period: { start: Date; end: Date };
    regulations: string[];
    format: ComplianceReport['format'];
    generatedBy: string;
  }): ComplianceReport {
    const assessments = Array.from(this.assessments.values()).filter(
      (a) => config.regulations.some((r) => a.regulationIds.includes(r))
    );

    const allFindings = assessments.flatMap((a) => a.findings);
    const openFindings = allFindings.filter((f) => f.status === 'open').length;
    const closedFindings = allFindings.filter((f) => f.status === 'resolved').length;

    const report: ComplianceReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: config.name,
      type: config.type,
      period: config.period,
      regulations: config.regulations,
      sections: [
        { title: 'Executive Summary', content: 'Overview of compliance status...' },
        { title: 'Assessment Results', content: 'Detailed assessment findings...' },
        { title: 'Recommendations', content: 'Action items and recommendations...' },
      ],
      summary: {
        overallStatus: 'partially_compliant',
        complianceScore: 85,
        riskScore: 25,
        totalRequirements: 50,
        compliantCount: 42,
        nonCompliantCount: 3,
        pendingCount: 5,
        openFindings,
        closedFindings,
      },
      generatedAt: new Date(),
      generatedBy: config.generatedBy,
      format: config.format,
    };

    this.reports.set(report.id, report);
    this.emit('report_generated', report);

    return report;
  }

  /**
   * Get reports
   */
  public getReports(): ComplianceReport[] {
    return Array.from(this.reports.values())
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  /**
   * Subscribe to events
   */
  public subscribe(callback: (event: string, data: unknown) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    this.listeners.forEach((callback) => callback(event, data));
  }
}

export const complianceManagementService = ComplianceManagementService.getInstance();
export type {
  ComplianceStatus,
  RegulationType,
  AssessmentStatus,
  ControlStatus,
  RiskLevel,
  Regulation,
  Requirement,
  Control,
  ControlEvidence,
  ComplianceAssessment,
  Finding,
  Recommendation,
  Policy,
  TrainingRecord,
  ComplianceReport,
  ComplianceDashboard,
};
