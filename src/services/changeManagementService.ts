/**
 * Change Management Service
 * Comprehensive change request handling, approval workflows, and deployment management
 */

// Change request type
type ChangeType = 'standard' | 'normal' | 'emergency' | 'expedited' | 'pre_approved';

// Change status
type ChangeStatus = 
  | 'draft' 
  | 'submitted' 
  | 'pending_review' 
  | 'approved' 
  | 'rejected' 
  | 'scheduled' 
  | 'in_progress' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'rolled_back';

// Risk level
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Impact level
type ImpactLevel = 'minimal' | 'minor' | 'moderate' | 'major' | 'severe';

// Change category
type ChangeCategory = 
  | 'infrastructure' 
  | 'application' 
  | 'database' 
  | 'network' 
  | 'security' 
  | 'configuration' 
  | 'maintenance' 
  | 'other';

// Change Request
interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  type: ChangeType;
  category: ChangeCategory;
  status: ChangeStatus;
  priority: number;
  requestor: {
    userId: string;
    userName: string;
    email: string;
    department: string;
  };
  assignee?: {
    userId: string;
    userName: string;
    email: string;
  };
  riskAssessment: {
    level: RiskLevel;
    score: number;
    factors: {
      name: string;
      score: number;
      weight: number;
    }[];
    mitigations: string[];
  };
  impactAssessment: {
    level: ImpactLevel;
    affectedSystems: string[];
    affectedUsers: number;
    businessImpact: string;
    technicalImpact: string;
  };
  schedule: {
    requestedDate: Date;
    scheduledStart?: Date;
    scheduledEnd?: Date;
    actualStart?: Date;
    actualEnd?: Date;
    maintenanceWindow?: string;
    blackoutPeriods: {
      start: Date;
      end: Date;
      reason: string;
    }[];
  };
  implementation: {
    plan: string;
    steps: ChangeStep[];
    prerequisites: string[];
    resources: string[];
    estimatedDuration: number;
  };
  rollback: {
    plan: string;
    steps: ChangeStep[];
    estimatedDuration: number;
    triggers: string[];
  };
  testing: {
    plan: string;
    testCases: TestCase[];
    preDeployTests: string[];
    postDeployTests: string[];
  };
  approvals: ChangeApproval[];
  communications: ChangeCommunication[];
  attachments: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    uploadedBy: string;
  }[];
  relatedItems: {
    type: 'change' | 'incident' | 'problem' | 'release';
    id: string;
    title: string;
  }[];
  audit: ChangeAuditEntry[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    submittedAt?: Date;
    approvedAt?: Date;
    completedAt?: Date;
    version: number;
  };
}

// Change Step
interface ChangeStep {
  id: string;
  order: number;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  assignee?: string;
  estimatedDuration: number;
  actualDuration?: number;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  verificationRequired: boolean;
  verified?: boolean;
}

// Test Case
interface TestCase {
  id: string;
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'smoke' | 'regression' | 'performance' | 'security';
  status: 'pending' | 'passed' | 'failed' | 'skipped';
  executedAt?: Date;
  executedBy?: string;
  results?: string;
  evidence?: string;
}

// Change Approval
interface ChangeApproval {
  id: string;
  changeId: string;
  approverId: string;
  approverName: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected' | 'delegated';
  required: boolean;
  order: number;
  requestedAt: Date;
  respondedAt?: Date;
  comments?: string;
  delegatedTo?: {
    userId: string;
    userName: string;
  };
  conditions?: string[];
}

// Change Communication
interface ChangeCommunication {
  id: string;
  changeId: string;
  type: 'notification' | 'announcement' | 'reminder' | 'update' | 'completion';
  channel: 'email' | 'slack' | 'teams' | 'sms' | 'status_page';
  recipients: {
    type: 'user' | 'group' | 'role' | 'external';
    id: string;
    name: string;
  }[];
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledAt?: Date;
  sentAt?: Date;
  template?: string;
}

// Change Audit Entry
interface ChangeAuditEntry {
  id: string;
  changeId: string;
  timestamp: Date;
  action: string;
  actor: {
    userId: string;
    userName: string;
  };
  previousValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

// Approval Workflow
interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  triggerConditions: {
    changeTypes?: ChangeType[];
    categories?: ChangeCategory[];
    riskLevels?: RiskLevel[];
    impactLevels?: ImpactLevel[];
  };
  stages: ApprovalStage[];
  escalation: {
    enabled: boolean;
    timeoutMinutes: number;
    escalateTo: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    usageCount: number;
  };
}

// Approval Stage
interface ApprovalStage {
  id: string;
  name: string;
  order: number;
  approverType: 'user' | 'role' | 'group' | 'manager';
  approvers: {
    id: string;
    name: string;
  }[];
  requiredApprovals: number;
  timeoutMinutes?: number;
  autoApprove?: {
    enabled: boolean;
    conditions: string[];
  };
  notifications: {
    onPending: boolean;
    onApproved: boolean;
    onRejected: boolean;
    reminderMinutes?: number;
  };
}

// Change Calendar
interface ChangeCalendar {
  id: string;
  name: string;
  description: string;
  timezone: string;
  maintenanceWindows: MaintenanceWindow[];
  blackoutPeriods: BlackoutPeriod[];
  holidays: {
    date: Date;
    name: string;
    blocked: boolean;
  }[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Maintenance Window
interface MaintenanceWindow {
  id: string;
  name: string;
  description: string;
  recurrence: {
    type: 'once' | 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number[];
    dayOfMonth?: number[];
    startTime: string;
    endTime: string;
  };
  allowedChangeTypes: ChangeType[];
  maxConcurrentChanges: number;
  requiresApproval: boolean;
  notificationLeadTime: number;
}

// Blackout Period
interface BlackoutPeriod {
  id: string;
  name: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  affectedSystems: string[];
  exceptions: string[];
  createdBy: string;
  approvedBy?: string;
}

// Change Template
interface ChangeTemplate {
  id: string;
  name: string;
  description: string;
  category: ChangeCategory;
  type: ChangeType;
  status: 'active' | 'inactive' | 'draft';
  defaultValues: Partial<ChangeRequest>;
  requiredFields: string[];
  customFields: {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'multi_select' | 'checkbox';
    options?: string[];
    required: boolean;
  }[];
  workflowId?: string;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    usageCount: number;
  };
}

// Change Metrics
interface ChangeMetrics {
  overview: {
    totalChanges: number;
    changesByStatus: Record<ChangeStatus, number>;
    changesByType: Record<ChangeType, number>;
    changesByCategory: Record<ChangeCategory, number>;
  };
  success: {
    successRate: number;
    failedChanges: number;
    rolledBackChanges: number;
    cancelledChanges: number;
  };
  timing: {
    avgApprovalTime: number;
    avgImplementationTime: number;
    avgLeadTime: number;
    onTimeDeliveryRate: number;
  };
  risk: {
    changesByRisk: Record<RiskLevel, number>;
    highRiskSuccessRate: number;
    incidentsFromChanges: number;
    changeFailureRate: number;
  };
  trends: {
    date: string;
    changes: number;
    successRate: number;
    avgDuration: number;
  }[];
}

// Change Filter
interface ChangeFilter {
  status?: ChangeStatus[];
  type?: ChangeType[];
  category?: ChangeCategory[];
  riskLevel?: RiskLevel[];
  requestorId?: string;
  assigneeId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

class ChangeManagementService {
  private static instance: ChangeManagementService;
  private changeRequests: Map<string, ChangeRequest> = new Map();
  private approvals: Map<string, ChangeApproval> = new Map();
  private workflows: Map<string, ApprovalWorkflow> = new Map();
  private calendars: Map<string, ChangeCalendar> = new Map();
  private templates: Map<string, ChangeTemplate> = new Map();
  private auditEntries: Map<string, ChangeAuditEntry> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ChangeManagementService {
    if (!ChangeManagementService.instance) {
      ChangeManagementService.instance = new ChangeManagementService();
    }
    return ChangeManagementService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Approval Workflows
    const workflowsData = [
      { name: 'Standard Change Workflow', types: ['standard'], risk: ['low', 'medium'] },
      { name: 'Emergency Change Workflow', types: ['emergency'], risk: ['high', 'critical'] },
      { name: 'Normal Change Workflow', types: ['normal'], risk: ['low', 'medium', 'high'] },
    ];

    workflowsData.forEach((w, idx) => {
      const workflow: ApprovalWorkflow = {
        id: `wf-${(idx + 1).toString().padStart(4, '0')}`,
        name: w.name,
        description: `Approval workflow for ${w.types.join(', ')} changes`,
        status: 'active',
        triggerConditions: {
          changeTypes: w.types as ChangeType[],
          riskLevels: w.risk as RiskLevel[],
        },
        stages: [
          {
            id: `stage-${idx}-1`,
            name: 'Technical Review',
            order: 1,
            approverType: 'role',
            approvers: [{ id: 'role-tech-lead', name: 'Technical Lead' }],
            requiredApprovals: 1,
            timeoutMinutes: 240,
            notifications: { onPending: true, onApproved: true, onRejected: true, reminderMinutes: 60 },
          },
          {
            id: `stage-${idx}-2`,
            name: 'Manager Approval',
            order: 2,
            approverType: 'manager',
            approvers: [],
            requiredApprovals: 1,
            timeoutMinutes: 480,
            notifications: { onPending: true, onApproved: true, onRejected: true },
          },
        ],
        escalation: {
          enabled: true,
          timeoutMinutes: 720,
          escalateTo: 'change-advisory-board',
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          usageCount: Math.floor(Math.random() * 200) + 50,
        },
      };
      this.workflows.set(workflow.id, workflow);
    });

    // Initialize Change Templates
    const templatesData = [
      { name: 'Database Schema Change', category: 'database', type: 'normal' },
      { name: 'Configuration Update', category: 'configuration', type: 'standard' },
      { name: 'Security Patch', category: 'security', type: 'emergency' },
      { name: 'Application Deployment', category: 'application', type: 'normal' },
      { name: 'Network Configuration', category: 'network', type: 'normal' },
    ];

    templatesData.forEach((t, idx) => {
      const template: ChangeTemplate = {
        id: `tmpl-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: `Template for ${t.name.toLowerCase()}`,
        category: t.category as ChangeCategory,
        type: t.type as ChangeType,
        status: 'active',
        defaultValues: {
          category: t.category as ChangeCategory,
          type: t.type as ChangeType,
        },
        requiredFields: ['title', 'description', 'implementation.plan', 'rollback.plan'],
        customFields: [
          { name: 'Systems Affected', type: 'multi_select', options: ['API Gateway', 'User Service', 'Database', 'Cache'], required: true },
          { name: 'Environment', type: 'select', options: ['Development', 'Staging', 'Production'], required: true },
        ],
        workflowId: 'wf-0001',
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          usageCount: Math.floor(Math.random() * 100) + 20,
        },
      };
      this.templates.set(template.id, template);
    });

    // Initialize Change Calendar
    const calendar: ChangeCalendar = {
      id: 'cal-0001',
      name: 'Production Change Calendar',
      description: 'Calendar for production environment changes',
      timezone: 'America/New_York',
      maintenanceWindows: [
        {
          id: 'mw-0001',
          name: 'Weekly Maintenance',
          description: 'Weekly maintenance window',
          recurrence: {
            type: 'weekly',
            dayOfWeek: [0],
            startTime: '02:00',
            endTime: '06:00',
          },
          allowedChangeTypes: ['standard', 'normal'],
          maxConcurrentChanges: 3,
          requiresApproval: false,
          notificationLeadTime: 48,
        },
        {
          id: 'mw-0002',
          name: 'Daily Deployment Window',
          description: 'Daily deployment window',
          recurrence: {
            type: 'daily',
            startTime: '03:00',
            endTime: '05:00',
          },
          allowedChangeTypes: ['standard', 'pre_approved'],
          maxConcurrentChanges: 2,
          requiresApproval: false,
          notificationLeadTime: 24,
        },
      ],
      blackoutPeriods: [
        {
          id: 'bp-0001',
          name: 'End of Year Freeze',
          reason: 'Holiday code freeze',
          startDate: new Date(new Date().getFullYear(), 11, 15),
          endDate: new Date(new Date().getFullYear() + 1, 0, 2),
          affectedSystems: ['all'],
          exceptions: ['emergency', 'security'],
          createdBy: 'admin',
          approvedBy: 'cto',
        },
      ],
      holidays: [
        { date: new Date(new Date().getFullYear(), 0, 1), name: 'New Year', blocked: true },
        { date: new Date(new Date().getFullYear(), 11, 25), name: 'Christmas', blocked: true },
      ],
      metadata: {
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    };
    this.calendars.set(calendar.id, calendar);

    // Initialize Sample Change Requests
    const usersData = [
      { name: 'John Smith', department: 'Engineering' },
      { name: 'Sarah Johnson', department: 'DevOps' },
      { name: 'Mike Chen', department: 'Security' },
      { name: 'Emily Davis', department: 'Platform' },
    ];

    const changesData = [
      { title: 'Database Index Optimization', category: 'database', type: 'standard', status: 'completed', risk: 'low' },
      { title: 'API Gateway Rate Limiting Update', category: 'application', type: 'normal', status: 'in_progress', risk: 'medium' },
      { title: 'Security Certificate Renewal', category: 'security', type: 'emergency', status: 'approved', risk: 'high' },
      { title: 'Redis Cluster Scaling', category: 'infrastructure', type: 'normal', status: 'scheduled', risk: 'medium' },
      { title: 'Network Firewall Rules Update', category: 'network', type: 'normal', status: 'pending_review', risk: 'high' },
      { title: 'Feature Flag Configuration', category: 'configuration', type: 'standard', status: 'completed', risk: 'low' },
      { title: 'Load Balancer Health Check Update', category: 'network', type: 'standard', status: 'approved', risk: 'low' },
      { title: 'Database Migration v2.5', category: 'database', type: 'normal', status: 'draft', risk: 'high' },
      { title: 'CDN Configuration Update', category: 'infrastructure', type: 'standard', status: 'completed', risk: 'low' },
      { title: 'Authentication Service Upgrade', category: 'application', type: 'normal', status: 'rejected', risk: 'medium' },
    ];

    changesData.forEach((change, idx) => {
      const user = usersData[idx % usersData.length];
      const changeId = `CHG-${(idx + 1).toString().padStart(6, '0')}`;
      const createdDate = new Date(Date.now() - (30 - idx * 3) * 24 * 60 * 60 * 1000);
      const isCompleted = ['completed', 'failed', 'cancelled', 'rolled_back'].includes(change.status);

      // Create implementation steps
      const implementationSteps: ChangeStep[] = [
        {
          id: `step-${changeId}-1`,
          order: 1,
          name: 'Pre-implementation backup',
          description: 'Create backup of affected systems',
          status: isCompleted ? 'completed' : 'pending',
          estimatedDuration: 30,
          verificationRequired: true,
          verified: isCompleted,
        },
        {
          id: `step-${changeId}-2`,
          order: 2,
          name: 'Apply changes',
          description: 'Apply the configuration/code changes',
          status: isCompleted ? 'completed' : 'pending',
          estimatedDuration: 60,
          verificationRequired: true,
        },
        {
          id: `step-${changeId}-3`,
          order: 3,
          name: 'Verify changes',
          description: 'Verify the changes are working correctly',
          status: isCompleted ? 'completed' : 'pending',
          estimatedDuration: 30,
          verificationRequired: true,
        },
        {
          id: `step-${changeId}-4`,
          order: 4,
          name: 'Post-implementation testing',
          description: 'Run post-implementation tests',
          status: isCompleted ? 'completed' : 'pending',
          estimatedDuration: 45,
          verificationRequired: false,
        },
      ];

      // Create rollback steps
      const rollbackSteps: ChangeStep[] = [
        {
          id: `rb-${changeId}-1`,
          order: 1,
          name: 'Revert changes',
          description: 'Revert to previous configuration',
          status: 'pending',
          estimatedDuration: 30,
          verificationRequired: true,
        },
        {
          id: `rb-${changeId}-2`,
          order: 2,
          name: 'Restore from backup',
          description: 'Restore data from backup if needed',
          status: 'pending',
          estimatedDuration: 60,
          verificationRequired: true,
        },
      ];

      // Create test cases
      const testCases: TestCase[] = [
        {
          id: `test-${changeId}-1`,
          name: 'Smoke Test',
          description: 'Basic functionality test',
          type: 'smoke',
          status: isCompleted ? 'passed' : 'pending',
          executedAt: isCompleted ? new Date() : undefined,
        },
        {
          id: `test-${changeId}-2`,
          name: 'Integration Test',
          description: 'Test integration with dependent services',
          type: 'integration',
          status: isCompleted ? 'passed' : 'pending',
        },
        {
          id: `test-${changeId}-3`,
          name: 'Performance Test',
          description: 'Verify performance is not degraded',
          type: 'performance',
          status: isCompleted ? 'passed' : 'pending',
        },
      ];

      // Create approvals
      const approvals: ChangeApproval[] = [
        {
          id: `appr-${changeId}-1`,
          changeId,
          approverId: 'user-tech-lead',
          approverName: 'Technical Lead',
          approverRole: 'Tech Lead',
          status: ['completed', 'in_progress', 'approved', 'scheduled'].includes(change.status) ? 'approved' : 'pending',
          required: true,
          order: 1,
          requestedAt: createdDate,
          respondedAt: ['completed', 'in_progress', 'approved', 'scheduled'].includes(change.status) ? new Date() : undefined,
        },
        {
          id: `appr-${changeId}-2`,
          changeId,
          approverId: 'user-manager',
          approverName: 'Engineering Manager',
          approverRole: 'Manager',
          status: ['completed', 'in_progress', 'approved', 'scheduled'].includes(change.status) ? 'approved' : 
                  change.status === 'rejected' ? 'rejected' : 'pending',
          required: true,
          order: 2,
          requestedAt: createdDate,
          respondedAt: ['completed', 'in_progress', 'approved', 'scheduled', 'rejected'].includes(change.status) ? new Date() : undefined,
          comments: change.status === 'rejected' ? 'Needs more testing before approval' : undefined,
        },
      ];

      approvals.forEach((a) => this.approvals.set(a.id, a));

      // Create communications
      const communications: ChangeCommunication[] = [
        {
          id: `comm-${changeId}-1`,
          changeId,
          type: 'notification',
          channel: 'email',
          recipients: [{ type: 'group', id: 'engineering', name: 'Engineering Team' }],
          subject: `[Change Request] ${change.title}`,
          content: `A new change request has been submitted: ${change.title}`,
          status: 'sent',
          sentAt: createdDate,
        },
      ];

      // Create change request
      const changeRequest: ChangeRequest = {
        id: changeId,
        title: change.title,
        description: `Change request for ${change.title.toLowerCase()}. This change will improve system ${change.category === 'database' ? 'performance' : 'reliability'}.`,
        type: change.type as ChangeType,
        category: change.category as ChangeCategory,
        status: change.status as ChangeStatus,
        priority: change.risk === 'critical' ? 1 : change.risk === 'high' ? 2 : change.risk === 'medium' ? 3 : 4,
        requestor: {
          userId: `user-${(idx % 4 + 1).toString().padStart(4, '0')}`,
          userName: user.name,
          email: `${user.name.toLowerCase().replace(' ', '.')}@rescueping.com`,
          department: user.department,
        },
        assignee: ['in_progress', 'completed'].includes(change.status) ? {
          userId: 'user-0001',
          userName: usersData[0].name,
          email: `${usersData[0].name.toLowerCase().replace(' ', '.')}@rescueping.com`,
        } : undefined,
        riskAssessment: {
          level: change.risk as RiskLevel,
          score: change.risk === 'critical' ? 90 : change.risk === 'high' ? 70 : change.risk === 'medium' ? 50 : 25,
          factors: [
            { name: 'Complexity', score: Math.floor(Math.random() * 5) + 1, weight: 0.3 },
            { name: 'Impact Scope', score: Math.floor(Math.random() * 5) + 1, weight: 0.25 },
            { name: 'Testing Coverage', score: Math.floor(Math.random() * 5) + 1, weight: 0.25 },
            { name: 'Rollback Feasibility', score: Math.floor(Math.random() * 5) + 1, weight: 0.2 },
          ],
          mitigations: [
            'Comprehensive testing in staging',
            'Rollback plan documented',
            'On-call support during deployment',
          ],
        },
        impactAssessment: {
          level: change.risk === 'critical' ? 'severe' : change.risk === 'high' ? 'major' : change.risk === 'medium' ? 'moderate' : 'minor',
          affectedSystems: ['api-gateway', 'user-service', change.category === 'database' ? 'postgresql' : 'redis'],
          affectedUsers: Math.floor(Math.random() * 10000) + 100,
          businessImpact: 'Potential service degradation during maintenance window',
          technicalImpact: 'Brief increase in latency expected',
        },
        schedule: {
          requestedDate: new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          scheduledStart: ['scheduled', 'in_progress', 'completed'].includes(change.status) 
            ? new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000) : undefined,
          scheduledEnd: ['scheduled', 'in_progress', 'completed'].includes(change.status)
            ? new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) : undefined,
          actualStart: ['in_progress', 'completed'].includes(change.status)
            ? new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000) : undefined,
          actualEnd: isCompleted 
            ? new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000) : undefined,
          blackoutPeriods: [],
        },
        implementation: {
          plan: `Implementation plan for ${change.title}:\n1. Create backup\n2. Apply changes\n3. Verify\n4. Test`,
          steps: implementationSteps,
          prerequisites: ['Staging testing completed', 'Backup verified', 'Team notified'],
          resources: ['1 Senior Engineer', '1 DBA', '1 QA Engineer'],
          estimatedDuration: 120,
        },
        rollback: {
          plan: 'Rollback plan in case of failure:\n1. Revert changes\n2. Restore from backup\n3. Verify service health',
          steps: rollbackSteps,
          estimatedDuration: 60,
          triggers: ['Error rate > 1%', 'Response time > 500ms', 'Health check failures'],
        },
        testing: {
          plan: 'Testing plan:\n1. Smoke test\n2. Integration test\n3. Performance test',
          testCases,
          preDeployTests: ['Unit tests', 'Integration tests'],
          postDeployTests: ['Smoke tests', 'Health checks', 'Performance validation'],
        },
        approvals,
        communications,
        attachments: [],
        relatedItems: [],
        audit: [],
        metadata: {
          createdAt: createdDate,
          updatedAt: new Date(),
          submittedAt: change.status !== 'draft' ? createdDate : undefined,
          approvedAt: ['approved', 'scheduled', 'in_progress', 'completed'].includes(change.status)
            ? new Date(createdDate.getTime() + 2 * 24 * 60 * 60 * 1000) : undefined,
          completedAt: isCompleted 
            ? new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000) : undefined,
          version: 1,
        },
      };

      this.changeRequests.set(changeRequest.id, changeRequest);

      // Create audit entries
      const auditActions = ['created', 'submitted', 'approved', 'scheduled', 'started', 'completed'];
      auditActions.forEach((action, actionIdx) => {
        const auditEntry: ChangeAuditEntry = {
          id: `audit-${changeId}-${actionIdx + 1}`,
          changeId,
          timestamp: new Date(createdDate.getTime() + actionIdx * 24 * 60 * 60 * 1000),
          action: `Change ${action}`,
          actor: {
            userId: `user-${(actionIdx % 4 + 1).toString().padStart(4, '0')}`,
            userName: usersData[actionIdx % 4].name,
          },
        };
        this.auditEntries.set(auditEntry.id, auditEntry);
      });
    });
  }

  // Change Request Operations
  public getChangeRequests(filter?: ChangeFilter): ChangeRequest[] {
    let changes = Array.from(this.changeRequests.values());

    if (filter?.status) changes = changes.filter((c) => filter.status!.includes(c.status));
    if (filter?.type) changes = changes.filter((c) => filter.type!.includes(c.type));
    if (filter?.category) changes = changes.filter((c) => filter.category!.includes(c.category));
    if (filter?.riskLevel) changes = changes.filter((c) => filter.riskLevel!.includes(c.riskAssessment.level));
    if (filter?.requestorId) changes = changes.filter((c) => c.requestor.userId === filter.requestorId);
    if (filter?.assigneeId) changes = changes.filter((c) => c.assignee?.userId === filter.assigneeId);
    if (filter?.dateRange) {
      changes = changes.filter((c) =>
        c.metadata.createdAt >= filter.dateRange!.start && c.metadata.createdAt <= filter.dateRange!.end
      );
    }
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      changes = changes.filter((c) =>
        c.title.toLowerCase().includes(searchLower) || c.description.toLowerCase().includes(searchLower)
      );
    }

    return changes.sort((a, b) => b.metadata.updatedAt.getTime() - a.metadata.updatedAt.getTime());
  }

  public getChangeRequestById(id: string): ChangeRequest | undefined {
    return this.changeRequests.get(id);
  }

  public createChangeRequest(data: Partial<ChangeRequest>): ChangeRequest {
    const changeRequest: ChangeRequest = {
      id: `CHG-${this.generateId()}`,
      title: data.title || '',
      description: data.description || '',
      type: data.type || 'standard',
      category: data.category || 'other',
      status: 'draft',
      priority: data.priority || 4,
      requestor: data.requestor || { userId: '', userName: '', email: '', department: '' },
      riskAssessment: data.riskAssessment || { level: 'low', score: 0, factors: [], mitigations: [] },
      impactAssessment: data.impactAssessment || { level: 'minimal', affectedSystems: [], affectedUsers: 0, businessImpact: '', technicalImpact: '' },
      schedule: data.schedule || { requestedDate: new Date(), blackoutPeriods: [] },
      implementation: data.implementation || { plan: '', steps: [], prerequisites: [], resources: [], estimatedDuration: 0 },
      rollback: data.rollback || { plan: '', steps: [], estimatedDuration: 0, triggers: [] },
      testing: data.testing || { plan: '', testCases: [], preDeployTests: [], postDeployTests: [] },
      approvals: [],
      communications: [],
      attachments: [],
      relatedItems: [],
      audit: [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      },
    };

    this.changeRequests.set(changeRequest.id, changeRequest);
    this.addAuditEntry(changeRequest.id, 'Change request created', data.requestor?.userId || 'system');
    this.emit('change_created', changeRequest);
    return changeRequest;
  }

  public updateChangeRequest(id: string, updates: Partial<ChangeRequest>): ChangeRequest {
    const changeRequest = this.changeRequests.get(id);
    if (!changeRequest) throw new Error('Change request not found');

    Object.assign(changeRequest, updates);
    changeRequest.metadata.updatedAt = new Date();
    changeRequest.metadata.version++;

    this.addAuditEntry(id, 'Change request updated', 'system');
    this.emit('change_updated', changeRequest);
    return changeRequest;
  }

  public submitChangeRequest(id: string, userId: string): ChangeRequest {
    const changeRequest = this.changeRequests.get(id);
    if (!changeRequest) throw new Error('Change request not found');

    changeRequest.status = 'submitted';
    changeRequest.metadata.submittedAt = new Date();
    changeRequest.metadata.updatedAt = new Date();

    this.addAuditEntry(id, 'Change request submitted', userId);
    this.emit('change_submitted', changeRequest);
    return changeRequest;
  }

  // Approval Operations
  public getApprovals(changeId: string): ChangeApproval[] {
    return Array.from(this.approvals.values())
      .filter((a) => a.changeId === changeId)
      .sort((a, b) => a.order - b.order);
  }

  public approveChange(approvalId: string, comments?: string): ChangeApproval {
    const approval = this.approvals.get(approvalId);
    if (!approval) throw new Error('Approval not found');

    approval.status = 'approved';
    approval.respondedAt = new Date();
    approval.comments = comments;

    const change = this.changeRequests.get(approval.changeId);
    if (change) {
      const allApprovals = this.getApprovals(approval.changeId);
      const allApproved = allApprovals.every((a) => a.status === 'approved');
      if (allApproved) {
        change.status = 'approved';
        change.metadata.approvedAt = new Date();
      }
    }

    this.emit('approval_granted', approval);
    return approval;
  }

  public rejectChange(approvalId: string, comments: string): ChangeApproval {
    const approval = this.approvals.get(approvalId);
    if (!approval) throw new Error('Approval not found');

    approval.status = 'rejected';
    approval.respondedAt = new Date();
    approval.comments = comments;

    const change = this.changeRequests.get(approval.changeId);
    if (change) {
      change.status = 'rejected';
    }

    this.emit('approval_rejected', approval);
    return approval;
  }

  // Workflow Operations
  public getWorkflows(): ApprovalWorkflow[] {
    return Array.from(this.workflows.values());
  }

  public getWorkflowById(id: string): ApprovalWorkflow | undefined {
    return this.workflows.get(id);
  }

  // Calendar Operations
  public getCalendars(): ChangeCalendar[] {
    return Array.from(this.calendars.values());
  }

  public getCalendarById(id: string): ChangeCalendar | undefined {
    return this.calendars.get(id);
  }

  public isInMaintenanceWindow(date: Date = new Date()): boolean {
    const calendar = Array.from(this.calendars.values())[0];
    if (!calendar) return false;

    return calendar.maintenanceWindows.some((mw) => {
      const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      return time >= mw.recurrence.startTime && time <= mw.recurrence.endTime;
    });
  }

  public isInBlackoutPeriod(date: Date = new Date()): boolean {
    const calendar = Array.from(this.calendars.values())[0];
    if (!calendar) return false;

    return calendar.blackoutPeriods.some((bp) => date >= bp.startDate && date <= bp.endDate);
  }

  // Template Operations
  public getTemplates(): ChangeTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplateById(id: string): ChangeTemplate | undefined {
    return this.templates.get(id);
  }

  // Metrics
  public getMetrics(): ChangeMetrics {
    const changes = Array.from(this.changeRequests.values());
    const completed = changes.filter((c) => ['completed', 'failed', 'rolled_back', 'cancelled'].includes(c.status));

    const statusCounts = changes.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<ChangeStatus, number>);

    const typeCounts = changes.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as Record<ChangeType, number>);

    const categoryCounts = changes.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<ChangeCategory, number>);

    const riskCounts = changes.reduce((acc, c) => {
      acc[c.riskAssessment.level] = (acc[c.riskAssessment.level] || 0) + 1;
      return acc;
    }, {} as Record<RiskLevel, number>);

    const successfulChanges = completed.filter((c) => c.status === 'completed');

    return {
      overview: {
        totalChanges: changes.length,
        changesByStatus: statusCounts,
        changesByType: typeCounts,
        changesByCategory: categoryCounts,
      },
      success: {
        successRate: completed.length > 0 ? (successfulChanges.length / completed.length) * 100 : 0,
        failedChanges: completed.filter((c) => c.status === 'failed').length,
        rolledBackChanges: completed.filter((c) => c.status === 'rolled_back').length,
        cancelledChanges: completed.filter((c) => c.status === 'cancelled').length,
      },
      timing: {
        avgApprovalTime: 48 * 60,
        avgImplementationTime: 90,
        avgLeadTime: 7 * 24 * 60,
        onTimeDeliveryRate: 85,
      },
      risk: {
        changesByRisk: riskCounts,
        highRiskSuccessRate: 75,
        incidentsFromChanges: 2,
        changeFailureRate: completed.length > 0 ? ((completed.length - successfulChanges.length) / completed.length) * 100 : 0,
      },
      trends: [],
    };
  }

  // Audit Operations
  public getAuditEntries(changeId: string): ChangeAuditEntry[] {
    return Array.from(this.auditEntries.values())
      .filter((e) => e.changeId === changeId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private addAuditEntry(changeId: string, action: string, userId: string): void {
    const entry: ChangeAuditEntry = {
      id: `audit-${this.generateId()}`,
      changeId,
      timestamp: new Date(),
      action,
      actor: { userId, userName: 'User' },
    };
    this.auditEntries.set(entry.id, entry);
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

export const changeManagementService = ChangeManagementService.getInstance();
export type {
  ChangeType,
  ChangeStatus,
  RiskLevel,
  ImpactLevel,
  ChangeCategory,
  ChangeRequest,
  ChangeStep,
  TestCase,
  ChangeApproval,
  ChangeCommunication,
  ChangeAuditEntry,
  ApprovalWorkflow,
  ApprovalStage,
  ChangeCalendar,
  MaintenanceWindow,
  BlackoutPeriod,
  ChangeTemplate,
  ChangeMetrics,
  ChangeFilter,
};
