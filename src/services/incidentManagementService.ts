/**
 * Incident Management Service
 * Comprehensive incident lifecycle management, tracking, and resolution
 */

// Incident Severity
type IncidentSeverity = 'sev1' | 'sev2' | 'sev3' | 'sev4' | 'sev5';

// Incident Status
type IncidentStatus = 'detected' | 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'closed' | 'postmortem';

// Incident Type
type IncidentType = 'availability' | 'latency' | 'error-rate' | 'security' | 'data-loss' | 'degradation' | 'outage' | 'custom';

// Incident Impact
type IncidentImpact = 'critical' | 'major' | 'moderate' | 'minor' | 'none';

// Communication Channel
type CommunicationChannel = 'slack' | 'email' | 'statuspage' | 'pagerduty' | 'teams' | 'sms' | 'voice' | 'internal';

// Incident
interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: IncidentType;
  impact: IncidentImpact;
  source: IncidentSource;
  timeline: IncidentTimelineEntry[];
  affectedServices: AffectedService[];
  affectedCustomers: AffectedCustomers;
  assignees: IncidentAssignee[];
  commander?: IncidentCommander;
  communications: IncidentCommunication[];
  tasks: IncidentTask[];
  relatedIncidents: string[];
  relatedAlerts: string[];
  metrics: IncidentMetrics;
  resolution?: IncidentResolution;
  postmortem?: IncidentPostmortem;
  metadata: IncidentMetadata;
}

// Incident Source
interface IncidentSource {
  type: 'alert' | 'monitoring' | 'customer' | 'internal' | 'automated' | 'external';
  alertId?: string;
  reportedBy?: string;
  detectionMethod: string;
  externalId?: string;
  system?: string;
}

// Incident Timeline Entry
interface IncidentTimelineEntry {
  id: string;
  timestamp: Date;
  type: 'status_change' | 'severity_change' | 'assignment' | 'communication' | 'action' | 'note' | 'alert' | 'metric' | 'task' | 'escalation';
  user?: string;
  message: string;
  metadata?: Record<string, unknown>;
  visibility: 'public' | 'internal' | 'restricted';
}

// Affected Service
interface AffectedService {
  id: string;
  name: string;
  component?: string;
  impactLevel: IncidentImpact;
  impactDescription: string;
  degradedFrom: Date;
  restoredAt?: Date;
  healthScore: number;
  dependencies: string[];
}

// Affected Customers
interface AffectedCustomers {
  estimatedCount: number;
  segments: CustomerSegment[];
  regions: string[];
  impactPercentage: number;
  notified: boolean;
  notificationTime?: Date;
}

// Customer Segment
interface CustomerSegment {
  name: string;
  count: number;
  impact: IncidentImpact;
  priority: 'vip' | 'enterprise' | 'business' | 'standard' | 'free';
}

// Incident Assignee
interface IncidentAssignee {
  id: string;
  name: string;
  email: string;
  role: 'responder' | 'investigator' | 'communicator' | 'observer';
  team: string;
  assignedAt: Date;
  assignedBy: string;
  status: 'active' | 'busy' | 'completed';
}

// Incident Commander
interface IncidentCommander {
  id: string;
  name: string;
  email: string;
  phone?: string;
  team: string;
  assignedAt: Date;
  handoffHistory: CommanderHandoff[];
}

// Commander Handoff
interface CommanderHandoff {
  fromUser: string;
  toUser: string;
  timestamp: Date;
  reason: string;
}

// Incident Communication
interface IncidentCommunication {
  id: string;
  channel: CommunicationChannel;
  type: 'initial' | 'update' | 'resolution' | 'postmortem';
  audience: 'internal' | 'customers' | 'stakeholders' | 'public';
  subject: string;
  message: string;
  sentAt: Date;
  sentBy: string;
  status: 'draft' | 'pending' | 'sent' | 'failed';
  recipients?: CommunicationRecipient[];
  engagement?: CommunicationEngagement;
}

// Communication Recipient
interface CommunicationRecipient {
  type: 'user' | 'group' | 'channel' | 'list';
  identifier: string;
  name: string;
  delivered: boolean;
  deliveredAt?: Date;
}

// Communication Engagement
interface CommunicationEngagement {
  opened: number;
  clicked: number;
  replied: number;
  acknowledged: number;
}

// Incident Task
interface IncidentTask {
  id: string;
  title: string;
  description: string;
  type: 'investigation' | 'mitigation' | 'communication' | 'recovery' | 'verification' | 'documentation';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  assignee?: string;
  dueAt?: Date;
  createdAt: Date;
  createdBy: string;
  completedAt?: Date;
  completedBy?: string;
  blockedReason?: string;
  dependencies: string[];
  subtasks: IncidentSubtask[];
}

// Incident Subtask
interface IncidentSubtask {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  completedAt?: Date;
}

// Incident Metrics
interface IncidentMetrics {
  timeToDetect: number;
  timeToAcknowledge: number;
  timeToMitigate: number;
  timeToResolve: number;
  timeToClose: number;
  totalDuration: number;
  statusDurations: Record<IncidentStatus, number>;
  escalationCount: number;
  communicationCount: number;
  taskCount: number;
  updateFrequency: number;
  customerImpactMinutes: number;
  slaBreached: boolean;
  costEstimate?: number;
}

// Incident Resolution
interface IncidentResolution {
  summary: string;
  rootCause: string;
  rootCauseCategory: 'code_change' | 'configuration' | 'infrastructure' | 'dependency' | 'capacity' | 'security' | 'human_error' | 'unknown' | 'external';
  resolution: string;
  workaround?: string;
  preventionSteps: string[];
  resolvedAt: Date;
  resolvedBy: string;
  verifiedAt?: Date;
  verifiedBy?: string;
}

// Incident Postmortem
interface IncidentPostmortem {
  id: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  authors: string[];
  reviewers: string[];
  summary: PostmortemSummary;
  timeline: PostmortemTimeline[];
  analysis: PostmortemAnalysis;
  actionItems: PostmortemActionItem[];
  learnings: string[];
  metrics: PostmortemMetrics;
  attachments: PostmortemAttachment[];
  publishedAt?: Date;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
  };
}

// Postmortem Summary
interface PostmortemSummary {
  title: string;
  executiveSummary: string;
  impactSummary: string;
  rootCauseSummary: string;
  resolutionSummary: string;
}

// Postmortem Timeline
interface PostmortemTimeline {
  timestamp: Date;
  event: string;
  type: 'detection' | 'response' | 'mitigation' | 'resolution' | 'communication';
  actor?: string;
  impact?: string;
}

// Postmortem Analysis
interface PostmortemAnalysis {
  whatHappened: string;
  whyHappened: string;
  contributingFactors: ContributingFactor[];
  fiveWhys: string[];
  triggerEvent: string;
  escalationPath: string;
  responseEffectiveness: 'excellent' | 'good' | 'adequate' | 'poor';
}

// Contributing Factor
interface ContributingFactor {
  category: 'technical' | 'process' | 'people' | 'external';
  description: string;
  weight: 'primary' | 'secondary' | 'minor';
}

// Postmortem Action Item
interface PostmortemActionItem {
  id: string;
  title: string;
  description: string;
  type: 'bug_fix' | 'feature' | 'process' | 'training' | 'documentation' | 'monitoring' | 'other';
  priority: 'p1' | 'p2' | 'p3' | 'p4';
  owner: string;
  team: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  ticketId?: string;
  completedAt?: Date;
}

// Postmortem Metrics
interface PostmortemMetrics {
  detectionTime: number;
  responseTime: number;
  resolutionTime: number;
  customerImpact: number;
  financialImpact?: number;
  servicesAffected: number;
  alertsGenerated: number;
  communicationsSent: number;
}

// Postmortem Attachment
interface PostmortemAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'log' | 'chart' | 'link';
  url: string;
  description?: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Incident Metadata
interface IncidentMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  version: number;
  tags: string[];
  labels: Record<string, string>;
  externalLinks: ExternalLink[];
}

// External Link
interface ExternalLink {
  name: string;
  url: string;
  type: 'ticket' | 'runbook' | 'dashboard' | 'documentation' | 'slack' | 'other';
}

// Incident Template
interface IncidentTemplate {
  id: string;
  name: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  initialTasks: IncidentTask[];
  communicationTemplates: CommunicationTemplate[];
  runbookUrl?: string;
  tags: string[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    usageCount: number;
  };
}

// Communication Template
interface CommunicationTemplate {
  id: string;
  name: string;
  channel: CommunicationChannel;
  type: 'initial' | 'update' | 'resolution' | 'postmortem';
  audience: 'internal' | 'customers' | 'stakeholders' | 'public';
  subject: string;
  body: string;
  variables: string[];
}

// Runbook
interface Runbook {
  id: string;
  name: string;
  description: string;
  incidentTypes: IncidentType[];
  services: string[];
  steps: RunbookStep[];
  escalation: RunbookEscalation;
  verification: RunbookVerification;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    version: number;
    lastUsed?: Date;
    usageCount: number;
  };
}

// Runbook Step
interface RunbookStep {
  id: string;
  order: number;
  title: string;
  description: string;
  type: 'manual' | 'automated' | 'decision' | 'verification';
  commands?: string[];
  expectedOutcome: string;
  timeout?: number;
  automationId?: string;
  onFailure: 'continue' | 'retry' | 'escalate' | 'abort';
}

// Runbook Escalation
interface RunbookEscalation {
  enabled: boolean;
  triggerConditions: string[];
  escalationPath: string;
  notifyChannels: CommunicationChannel[];
}

// Runbook Verification
interface RunbookVerification {
  steps: string[];
  metrics: string[];
  healthChecks: string[];
  signoffRequired: boolean;
}

// Status Page
interface StatusPage {
  id: string;
  name: string;
  url: string;
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';
  components: StatusPageComponent[];
  activeIncidents: StatusPageIncident[];
  scheduledMaintenance: ScheduledMaintenance[];
  metrics: StatusPageMetrics;
  subscribers: number;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Status Page Component
interface StatusPageComponent {
  id: string;
  name: string;
  description: string;
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';
  group?: string;
  order: number;
  showHistory: boolean;
  uptimePercentage: number;
}

// Status Page Incident
interface StatusPageIncident {
  id: string;
  incidentId: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  impact: 'none' | 'minor' | 'major' | 'critical';
  affectedComponents: string[];
  updates: StatusPageUpdate[];
  createdAt: Date;
  resolvedAt?: Date;
}

// Status Page Update
interface StatusPageUpdate {
  id: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  message: string;
  createdAt: Date;
  createdBy: string;
}

// Scheduled Maintenance
interface ScheduledMaintenance {
  id: string;
  title: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  affectedComponents: string[];
  impact: 'none' | 'minor' | 'major';
  createdBy: string;
}

// Status Page Metrics
interface StatusPageMetrics {
  pageViews: number;
  uniqueVisitors: number;
  apiRequests: number;
  avgResponseTime: number;
  uptime: number;
}

// Incident Statistics
interface IncidentStatistics {
  overview: {
    totalIncidents: number;
    activeIncidents: number;
    resolvedIncidents: number;
    avgTimeToResolve: number;
    avgTimeToDetect: number;
    mttr: number;
    mtta: number;
    mttd: number;
  };
  bySeverity: Record<IncidentSeverity, number>;
  byStatus: Record<IncidentStatus, number>;
  byType: Record<IncidentType, number>;
  byImpact: Record<IncidentImpact, number>;
  byService: Record<string, number>;
  byTeam: Record<string, number>;
  trends: {
    timestamp: Date;
    created: number;
    resolved: number;
    avgDuration: number;
  }[];
  sla: {
    met: number;
    breached: number;
    compliance: number;
  };
  postmortems: {
    total: number;
    pending: number;
    completed: number;
    actionItemsOpen: number;
    actionItemsCompleted: number;
  };
}

class IncidentManagementService {
  private static instance: IncidentManagementService;
  private incidents: Map<string, Incident> = new Map();
  private templates: Map<string, IncidentTemplate> = new Map();
  private runbooks: Map<string, Runbook> = new Map();
  private statusPages: Map<string, StatusPage> = new Map();
  private communicationTemplates: Map<string, CommunicationTemplate> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): IncidentManagementService {
    if (!IncidentManagementService.instance) {
      IncidentManagementService.instance = new IncidentManagementService();
    }
    return IncidentManagementService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Incidents
    const incidentsData = [
      { title: 'API Gateway High Latency', severity: 'sev2' as IncidentSeverity, status: 'investigating' as IncidentStatus, type: 'latency' as IncidentType, service: 'api-gateway' },
      { title: 'Database Connection Pool Exhausted', severity: 'sev1' as IncidentSeverity, status: 'identified' as IncidentStatus, type: 'availability' as IncidentType, service: 'user-service' },
      { title: 'Payment Processing Failures', severity: 'sev1' as IncidentSeverity, status: 'monitoring' as IncidentStatus, type: 'error-rate' as IncidentType, service: 'payment-service' },
      { title: 'Authentication Service Degradation', severity: 'sev3' as IncidentSeverity, status: 'resolved' as IncidentStatus, type: 'degradation' as IncidentType, service: 'auth-service' },
      { title: 'CDN Cache Invalidation Failure', severity: 'sev4' as IncidentSeverity, status: 'closed' as IncidentStatus, type: 'degradation' as IncidentType, service: 'cdn' },
    ];

    incidentsData.forEach((i, idx) => {
      const startTime = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
      const incident: Incident = {
        id: `INC-${(idx + 1).toString().padStart(6, '0')}`,
        title: i.title,
        description: `${i.title} affecting production systems`,
        severity: i.severity,
        status: i.status,
        type: i.type,
        impact: i.severity === 'sev1' ? 'critical' : i.severity === 'sev2' ? 'major' : 'moderate',
        source: {
          type: 'alert',
          alertId: `alert-${idx + 1}`,
          detectionMethod: 'automated_monitoring',
          system: 'prometheus',
        },
        timeline: [
          { id: `tl-${idx}-1`, timestamp: startTime, type: 'status_change', message: 'Incident created', visibility: 'internal' },
          { id: `tl-${idx}-2`, timestamp: new Date(startTime.getTime() + 5 * 60 * 1000), type: 'assignment', user: 'oncall-engineer', message: 'Assigned to on-call engineer', visibility: 'internal' },
          { id: `tl-${idx}-3`, timestamp: new Date(startTime.getTime() + 10 * 60 * 1000), type: 'communication', message: 'Initial communication sent', visibility: 'public' },
        ],
        affectedServices: [
          { id: `svc-${idx}`, name: i.service, impactLevel: i.severity === 'sev1' ? 'critical' : 'major', impactDescription: `${i.service} is experiencing issues`, degradedFrom: startTime, healthScore: 60 + Math.random() * 20, dependencies: [] },
        ],
        affectedCustomers: {
          estimatedCount: Math.floor(Math.random() * 10000) + 1000,
          segments: [{ name: 'Enterprise', count: Math.floor(Math.random() * 100), impact: 'major', priority: 'enterprise' }],
          regions: ['us-east-1', 'eu-west-1'],
          impactPercentage: Math.random() * 30 + 10,
          notified: true,
          notificationTime: new Date(startTime.getTime() + 15 * 60 * 1000),
        },
        assignees: [
          { id: `assignee-${idx}`, name: 'John Doe', email: 'john.doe@example.com', role: 'responder', team: 'platform', assignedAt: startTime, assignedBy: 'system', status: 'active' },
        ],
        commander: {
          id: `commander-${idx}`,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+15551234567',
          team: 'platform',
          assignedAt: startTime,
          handoffHistory: [],
        },
        communications: [
          { id: `comm-${idx}-1`, channel: 'slack', type: 'initial', audience: 'internal', subject: `[${i.severity.toUpperCase()}] ${i.title}`, message: `We are investigating ${i.title}. Updates to follow.`, sentAt: new Date(startTime.getTime() + 5 * 60 * 1000), sentBy: 'incident-bot', status: 'sent' },
          { id: `comm-${idx}-2`, channel: 'statuspage', type: 'update', audience: 'customers', subject: 'Service Disruption', message: 'We are experiencing issues with some services.', sentAt: new Date(startTime.getTime() + 10 * 60 * 1000), sentBy: 'jane.smith', status: 'sent' },
        ],
        tasks: [
          { id: `task-${idx}-1`, title: 'Investigate root cause', description: 'Analyze logs and metrics', type: 'investigation', priority: 'critical', status: i.status === 'investigating' ? 'in_progress' : 'completed', assignee: 'john.doe', createdAt: startTime, createdBy: 'system', dependencies: [], subtasks: [] },
          { id: `task-${idx}-2`, title: 'Apply mitigation', description: 'Implement temporary fix', type: 'mitigation', priority: 'high', status: i.status === 'investigating' ? 'pending' : 'completed', createdAt: startTime, createdBy: 'system', dependencies: [`task-${idx}-1`], subtasks: [] },
        ],
        relatedIncidents: [],
        relatedAlerts: [`alert-${idx + 1}`],
        metrics: {
          timeToDetect: Math.floor(Math.random() * 300) + 60,
          timeToAcknowledge: Math.floor(Math.random() * 600) + 120,
          timeToMitigate: Math.floor(Math.random() * 1800) + 300,
          timeToResolve: i.status === 'resolved' || i.status === 'closed' ? Math.floor(Math.random() * 7200) + 1800 : 0,
          timeToClose: i.status === 'closed' ? Math.floor(Math.random() * 86400) + 7200 : 0,
          totalDuration: Date.now() - startTime.getTime(),
          statusDurations: { detected: 300, investigating: 1800, identified: 900, monitoring: 1800, resolved: 0, closed: 0, postmortem: 0 },
          escalationCount: Math.floor(Math.random() * 3),
          communicationCount: 2,
          taskCount: 2,
          updateFrequency: 15,
          customerImpactMinutes: Math.floor(Math.random() * 120) + 30,
          slaBreached: false,
          costEstimate: Math.floor(Math.random() * 50000) + 5000,
        },
        resolution: i.status === 'resolved' || i.status === 'closed' ? {
          summary: `${i.title} has been resolved`,
          rootCause: 'Configuration drift caused by recent deployment',
          rootCauseCategory: 'configuration',
          resolution: 'Rolled back configuration and applied fix',
          preventionSteps: ['Add automated configuration validation', 'Implement canary deployments'],
          resolvedAt: new Date(startTime.getTime() + 2 * 60 * 60 * 1000),
          resolvedBy: 'john.doe',
        } : undefined,
        postmortem: i.status === 'closed' ? {
          id: `pm-${idx}`,
          status: 'approved',
          authors: ['john.doe', 'jane.smith'],
          reviewers: ['bob.johnson'],
          summary: { title: `Postmortem: ${i.title}`, executiveSummary: 'Brief overview', impactSummary: 'Customer impact summary', rootCauseSummary: 'Root cause explanation', resolutionSummary: 'How we fixed it' },
          timeline: [{ timestamp: startTime, event: 'Incident detected', type: 'detection' }],
          analysis: { whatHappened: 'Description', whyHappened: 'Analysis', contributingFactors: [{ category: 'technical', description: 'Config drift', weight: 'primary' }], fiveWhys: ['Why 1', 'Why 2'], triggerEvent: 'Deployment', escalationPath: 'L1 -> L2', responseEffectiveness: 'good' },
          actionItems: [{ id: `ai-${idx}`, title: 'Add validation', description: 'Implement config validation', type: 'feature', priority: 'p2', owner: 'john.doe', team: 'platform', dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), status: 'open' }],
          learnings: ['Need better validation', 'Improve monitoring'],
          metrics: { detectionTime: 300, responseTime: 600, resolutionTime: 7200, customerImpact: 5000, servicesAffected: 1, alertsGenerated: 5, communicationsSent: 3 },
          attachments: [],
          metadata: { createdAt: new Date(), updatedAt: new Date(), version: 1 },
        } : undefined,
        metadata: {
          createdAt: startTime,
          createdBy: 'system',
          updatedAt: new Date(),
          updatedBy: 'john.doe',
          version: 3,
          tags: [i.type, i.severity, i.service],
          labels: { environment: 'production', region: 'us-east-1' },
          externalLinks: [{ name: 'Runbook', url: 'https://runbooks.example.com', type: 'runbook' }],
        },
      };
      this.incidents.set(incident.id, incident);
    });

    // Initialize Incident Templates
    const templatesData = [
      { name: 'High Latency', type: 'latency' as IncidentType, severity: 'sev2' as IncidentSeverity },
      { name: 'Service Outage', type: 'outage' as IncidentType, severity: 'sev1' as IncidentSeverity },
      { name: 'Data Issue', type: 'data-loss' as IncidentType, severity: 'sev1' as IncidentSeverity },
      { name: 'Security Incident', type: 'security' as IncidentType, severity: 'sev1' as IncidentSeverity },
    ];

    templatesData.forEach((t, idx) => {
      const template: IncidentTemplate = {
        id: `template-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: `Template for ${t.name} incidents`,
        type: t.type,
        severity: t.severity,
        initialTasks: [
          { id: `task-t-${idx}-1`, title: 'Assess impact', description: 'Determine scope of impact', type: 'investigation', priority: 'critical', status: 'pending', createdAt: new Date(), createdBy: 'system', dependencies: [], subtasks: [] },
          { id: `task-t-${idx}-2`, title: 'Notify stakeholders', description: 'Send initial communication', type: 'communication', priority: 'high', status: 'pending', createdAt: new Date(), createdBy: 'system', dependencies: [], subtasks: [] },
        ],
        communicationTemplates: [
          { id: `ct-${idx}-1`, name: 'Initial Alert', channel: 'slack', type: 'initial', audience: 'internal', subject: `[{{severity}}] {{title}}`, body: 'We are investigating {{title}}. IC: {{commander}}', variables: ['severity', 'title', 'commander'] },
        ],
        runbookUrl: `https://runbooks.example.com/${t.type}`,
        tags: [t.type, t.severity],
        metadata: { createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date(), usageCount: Math.floor(Math.random() * 50) + 10 },
      };
      this.templates.set(template.id, template);
    });

    // Initialize Runbooks
    const runbooksData = [
      { name: 'High Latency Response', types: ['latency'] as IncidentType[], services: ['api-gateway', 'user-service'] },
      { name: 'Database Failover', types: ['availability', 'outage'] as IncidentType[], services: ['database'] },
      { name: 'Security Incident Response', types: ['security'] as IncidentType[], services: ['all'] },
    ];

    runbooksData.forEach((r, idx) => {
      const runbook: Runbook = {
        id: `runbook-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name,
        description: `Runbook for ${r.name}`,
        incidentTypes: r.types,
        services: r.services,
        steps: [
          { id: `step-${idx}-1`, order: 1, title: 'Initial Assessment', description: 'Check monitoring dashboards', type: 'manual', expectedOutcome: 'Understand scope of issue', onFailure: 'continue' },
          { id: `step-${idx}-2`, order: 2, title: 'Check Logs', description: 'Review recent logs for errors', type: 'manual', commands: ['kubectl logs -f deployment/service'], expectedOutcome: 'Identify error patterns', onFailure: 'continue' },
          { id: `step-${idx}-3`, order: 3, title: 'Apply Mitigation', description: 'Apply known fix', type: 'decision', expectedOutcome: 'Service restored', onFailure: 'escalate' },
        ],
        escalation: { enabled: true, triggerConditions: ['No improvement after 30 minutes'], escalationPath: 'L1 -> L2 -> Engineering Lead', notifyChannels: ['pagerduty', 'slack'] },
        verification: { steps: ['Check error rates', 'Verify latency'], metrics: ['error_rate', 'latency_p99'], healthChecks: ['health_endpoint'], signoffRequired: true },
        metadata: { createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date(), version: 3, lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), usageCount: Math.floor(Math.random() * 100) + 20 },
      };
      this.runbooks.set(runbook.id, runbook);
    });

    // Initialize Status Page
    const statusPage: StatusPage = {
      id: 'statuspage-0001',
      name: 'RescuePing Status',
      url: 'https://status.rescueping.com',
      status: 'degraded',
      components: [
        { id: 'comp-1', name: 'API', description: 'Core API services', status: 'operational', order: 1, showHistory: true, uptimePercentage: 99.95 },
        { id: 'comp-2', name: 'Web Application', description: 'Web dashboard', status: 'operational', order: 2, showHistory: true, uptimePercentage: 99.98 },
        { id: 'comp-3', name: 'Authentication', description: 'Login and SSO', status: 'degraded', order: 3, showHistory: true, uptimePercentage: 99.50 },
        { id: 'comp-4', name: 'Notifications', description: 'Email and push notifications', status: 'operational', order: 4, showHistory: true, uptimePercentage: 99.90 },
        { id: 'comp-5', name: 'Database', description: 'Data storage', status: 'operational', order: 5, showHistory: true, uptimePercentage: 99.99 },
      ],
      activeIncidents: [
        { id: 'sp-inc-1', incidentId: 'INC-000001', title: 'Authentication Service Slowness', status: 'monitoring', impact: 'minor', affectedComponents: ['comp-3'], updates: [{ id: 'upd-1', status: 'monitoring', message: 'We are monitoring the fix', createdAt: new Date(), createdBy: 'admin' }], createdAt: new Date(Date.now() - 60 * 60 * 1000) },
      ],
      scheduledMaintenance: [
        { id: 'maint-1', title: 'Database Maintenance', description: 'Routine database maintenance', status: 'scheduled', scheduledStart: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), scheduledEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), affectedComponents: ['comp-5'], impact: 'minor', createdBy: 'admin' },
      ],
      metrics: { pageViews: 50000, uniqueVisitors: 15000, apiRequests: 1000000, avgResponseTime: 150, uptime: 99.9 },
      subscribers: 5000,
      metadata: { createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
    };
    this.statusPages.set(statusPage.id, statusPage);

    // Initialize Communication Templates
    const commTemplatesData = [
      { name: 'Initial Internal Alert', channel: 'slack' as CommunicationChannel, type: 'initial' as const, audience: 'internal' as const },
      { name: 'Customer Status Update', channel: 'statuspage' as CommunicationChannel, type: 'update' as const, audience: 'customers' as const },
      { name: 'Resolution Notice', channel: 'email' as CommunicationChannel, type: 'resolution' as const, audience: 'customers' as const },
    ];

    commTemplatesData.forEach((ct, idx) => {
      const commTemplate: CommunicationTemplate = {
        id: `comm-template-${(idx + 1).toString().padStart(4, '0')}`,
        name: ct.name,
        channel: ct.channel,
        type: ct.type,
        audience: ct.audience,
        subject: ct.type === 'initial' ? '[{{severity}}] {{title}}' : ct.type === 'update' ? 'Update: {{title}}' : 'Resolved: {{title}}',
        body: ct.type === 'initial' ? 'We are investigating {{title}}. Current status: {{status}}. Incident Commander: {{commander}}' : ct.type === 'update' ? 'Status update for {{title}}: {{message}}' : '{{title}} has been resolved. Root cause: {{rootCause}}. Resolution: {{resolution}}',
        variables: ct.type === 'initial' ? ['severity', 'title', 'status', 'commander'] : ct.type === 'update' ? ['title', 'message'] : ['title', 'rootCause', 'resolution'],
      };
      this.communicationTemplates.set(commTemplate.id, commTemplate);
    });
  }

  // Incident Operations
  public getIncidents(status?: IncidentStatus, severity?: IncidentSeverity): Incident[] {
    let incidents = Array.from(this.incidents.values());
    if (status) incidents = incidents.filter((i) => i.status === status);
    if (severity) incidents = incidents.filter((i) => i.severity === severity);
    return incidents.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  public getIncidentById(id: string): Incident | undefined {
    return this.incidents.get(id);
  }

  public getActiveIncidents(): Incident[] {
    return this.getIncidents().filter((i) => !['resolved', 'closed'].includes(i.status));
  }

  // Template Operations
  public getTemplates(): IncidentTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplateById(id: string): IncidentTemplate | undefined {
    return this.templates.get(id);
  }

  // Runbook Operations
  public getRunbooks(): Runbook[] {
    return Array.from(this.runbooks.values());
  }

  public getRunbookById(id: string): Runbook | undefined {
    return this.runbooks.get(id);
  }

  public getRunbookForIncidentType(type: IncidentType): Runbook[] {
    return Array.from(this.runbooks.values()).filter((r) => r.incidentTypes.includes(type));
  }

  // Status Page Operations
  public getStatusPages(): StatusPage[] {
    return Array.from(this.statusPages.values());
  }

  public getStatusPageById(id: string): StatusPage | undefined {
    return this.statusPages.get(id);
  }

  // Communication Template Operations
  public getCommunicationTemplates(): CommunicationTemplate[] {
    return Array.from(this.communicationTemplates.values());
  }

  // Statistics
  public getStatistics(): IncidentStatistics {
    const incidents = Array.from(this.incidents.values());

    const bySeverity: Record<IncidentSeverity, number> = { sev1: 0, sev2: 0, sev3: 0, sev4: 0, sev5: 0 };
    const byStatus: Record<IncidentStatus, number> = { detected: 0, investigating: 0, identified: 0, monitoring: 0, resolved: 0, closed: 0, postmortem: 0 };
    const byType: Record<IncidentType, number> = { availability: 0, latency: 0, 'error-rate': 0, security: 0, 'data-loss': 0, degradation: 0, outage: 0, custom: 0 };
    const byImpact: Record<IncidentImpact, number> = { critical: 0, major: 0, moderate: 0, minor: 0, none: 0 };
    const byService: Record<string, number> = {};
    const byTeam: Record<string, number> = {};

    incidents.forEach((i) => {
      bySeverity[i.severity]++;
      byStatus[i.status]++;
      byType[i.type]++;
      byImpact[i.impact]++;
      i.affectedServices.forEach((s) => { byService[s.name] = (byService[s.name] || 0) + 1; });
      i.assignees.forEach((a) => { byTeam[a.team] = (byTeam[a.team] || 0) + 1; });
    });

    const resolvedIncidents = incidents.filter((i) => i.resolution);
    const avgTimeToResolve = resolvedIncidents.length > 0
      ? resolvedIncidents.reduce((sum, i) => sum + i.metrics.timeToResolve, 0) / resolvedIncidents.length
      : 0;

    return {
      overview: {
        totalIncidents: incidents.length,
        activeIncidents: incidents.filter((i) => !['resolved', 'closed'].includes(i.status)).length,
        resolvedIncidents: incidents.filter((i) => i.status === 'resolved' || i.status === 'closed').length,
        avgTimeToResolve,
        avgTimeToDetect: incidents.reduce((sum, i) => sum + i.metrics.timeToDetect, 0) / incidents.length,
        mttr: avgTimeToResolve,
        mtta: incidents.reduce((sum, i) => sum + i.metrics.timeToAcknowledge, 0) / incidents.length,
        mttd: incidents.reduce((sum, i) => sum + i.metrics.timeToDetect, 0) / incidents.length,
      },
      bySeverity,
      byStatus,
      byType,
      byImpact,
      byService,
      byTeam,
      trends: [],
      sla: {
        met: Math.floor(incidents.length * 0.9),
        breached: Math.floor(incidents.length * 0.1),
        compliance: 90,
      },
      postmortems: {
        total: incidents.filter((i) => i.postmortem).length,
        pending: incidents.filter((i) => i.postmortem?.status === 'draft' || i.postmortem?.status === 'review').length,
        completed: incidents.filter((i) => i.postmortem?.status === 'approved' || i.postmortem?.status === 'published').length,
        actionItemsOpen: incidents.filter((i) => i.postmortem).reduce((sum, i) => sum + (i.postmortem?.actionItems.filter((a) => a.status === 'open').length || 0), 0),
        actionItemsCompleted: incidents.filter((i) => i.postmortem).reduce((sum, i) => sum + (i.postmortem?.actionItems.filter((a) => a.status === 'completed').length || 0), 0),
      },
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

export const incidentManagementService = IncidentManagementService.getInstance();
export type {
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  IncidentImpact,
  CommunicationChannel,
  Incident,
  IncidentSource,
  IncidentTimelineEntry,
  AffectedService,
  AffectedCustomers,
  CustomerSegment,
  IncidentAssignee,
  IncidentCommander,
  CommanderHandoff,
  IncidentCommunication,
  CommunicationRecipient,
  CommunicationEngagement,
  IncidentTask,
  IncidentSubtask,
  IncidentMetrics,
  IncidentResolution,
  IncidentPostmortem,
  PostmortemSummary,
  PostmortemTimeline,
  PostmortemAnalysis,
  ContributingFactor,
  PostmortemActionItem,
  PostmortemMetrics,
  PostmortemAttachment,
  IncidentMetadata,
  ExternalLink,
  IncidentTemplate,
  CommunicationTemplate,
  Runbook,
  RunbookStep,
  RunbookEscalation,
  RunbookVerification,
  StatusPage,
  StatusPageComponent,
  StatusPageIncident,
  StatusPageUpdate,
  ScheduledMaintenance,
  StatusPageMetrics,
  IncidentStatistics,
};
