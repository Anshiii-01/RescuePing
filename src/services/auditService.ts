/**
 * Audit Service
 * Comprehensive audit logging, trail management, and forensic analysis
 */

// Audit Event Type
type AuditEventType = 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'access' | 'permission' | 'config' | 'system' | 'security' | 'custom';

// Audit Severity
type AuditSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Audit Status
type AuditStatus = 'success' | 'failure' | 'partial' | 'denied' | 'error';

// Retention Policy
type RetentionPolicy = 'regulatory' | 'standard' | 'extended' | 'permanent' | 'custom';

// Audit Event
interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  category: AuditCategory;
  actor: AuditActor;
  target: AuditTarget;
  action: AuditAction;
  context: AuditContext;
  outcome: AuditOutcome;
  metadata: AuditEventMetadata;
}

// Audit Category
interface AuditCategory {
  primary: 'authentication' | 'authorization' | 'data' | 'configuration' | 'system' | 'security' | 'compliance' | 'business';
  secondary: string;
  tags: string[];
}

// Audit Actor
interface AuditActor {
  id: string;
  type: 'user' | 'service' | 'system' | 'api' | 'scheduled' | 'external';
  name: string;
  email?: string;
  role?: string;
  department?: string;
  ipAddress: string;
  userAgent?: string;
  sessionId?: string;
  authMethod?: string;
  impersonator?: ActorImpersonation;
}

// Actor Impersonation
interface ActorImpersonation {
  originalActor: string;
  reason: string;
  approvedBy: string;
  expiresAt: Date;
}

// Audit Target
interface AuditTarget {
  id: string;
  type: 'user' | 'resource' | 'configuration' | 'system' | 'data' | 'api' | 'service';
  name: string;
  path?: string;
  attributes?: Record<string, unknown>;
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  owner?: string;
}

// Audit Action
interface AuditAction {
  operation: string;
  method?: string;
  endpoint?: string;
  parameters?: Record<string, unknown>;
  requestId?: string;
  duration?: number;
  changes?: AuditChange[];
}

// Audit Change
interface AuditChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  sensitive: boolean;
}

// Audit Context
interface AuditContext {
  application: string;
  environment: string;
  version: string;
  component: string;
  correlationId: string;
  traceId?: string;
  spanId?: string;
  location?: AuditLocation;
  device?: AuditDevice;
}

// Audit Location
interface AuditLocation {
  country: string;
  region: string;
  city: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Audit Device
interface AuditDevice {
  type: 'desktop' | 'mobile' | 'tablet' | 'server' | 'iot' | 'unknown';
  os: string;
  browser?: string;
  fingerprint?: string;
}

// Audit Outcome
interface AuditOutcome {
  status: AuditStatus;
  severity: AuditSeverity;
  errorCode?: string;
  errorMessage?: string;
  responseCode?: number;
  affectedRecords?: number;
  dataVolume?: number;
  riskScore?: number;
}

// Audit Event Metadata
interface AuditEventMetadata {
  version: string;
  schema: string;
  source: string;
  ingestionTime: Date;
  retentionPolicy: RetentionPolicy;
  retentionExpiry: Date;
  encrypted: boolean;
  integrity: {
    hash: string;
    algorithm: string;
    signature?: string;
  };
}

// Audit Trail
interface AuditTrail {
  id: string;
  name: string;
  description: string;
  scope: TrailScope;
  filters: TrailFilter[];
  events: string[];
  statistics: TrailStatistics;
  retention: TrailRetention;
  export: TrailExport;
  alerts: TrailAlert[];
  status: 'active' | 'paused' | 'archived';
  metadata: TrailMetadata;
}

// Trail Scope
interface TrailScope {
  applications: string[];
  environments: string[];
  eventTypes: AuditEventType[];
  categories: string[];
  actors: string[];
  targets: string[];
  severities: AuditSeverity[];
}

// Trail Filter
interface TrailFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex' | 'in' | 'not_in' | 'range';
  value: unknown;
  enabled: boolean;
}

// Trail Statistics
interface TrailStatistics {
  totalEvents: number;
  eventsToday: number;
  eventsThisWeek: number;
  eventsThisMonth: number;
  byEventType: Record<AuditEventType, number>;
  bySeverity: Record<AuditSeverity, number>;
  byStatus: Record<AuditStatus, number>;
  topActors: TopItem[];
  topTargets: TopItem[];
  timeline: TimelinePoint[];
}

// Top Item
interface TopItem {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

// Timeline Point
interface TimelinePoint {
  timestamp: Date;
  count: number;
  severity: AuditSeverity;
}

// Trail Retention
interface TrailRetention {
  policy: RetentionPolicy;
  duration: number;
  unit: 'days' | 'months' | 'years';
  archiveEnabled: boolean;
  archiveLocation?: string;
  deleteAfterArchive: boolean;
}

// Trail Export
interface TrailExport {
  enabled: boolean;
  format: 'json' | 'csv' | 'parquet' | 'avro';
  schedule: ExportSchedule;
  destination: ExportDestination;
  lastExport?: Date;
  nextExport?: Date;
}

// Export Schedule
interface ExportSchedule {
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'on_demand';
  time?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timezone: string;
}

// Export Destination
interface ExportDestination {
  type: 's3' | 'gcs' | 'azure_blob' | 'sftp' | 'elasticsearch' | 'splunk';
  config: Record<string, unknown>;
  encryption: boolean;
  compression: boolean;
}

// Trail Alert
interface TrailAlert {
  id: string;
  name: string;
  condition: AlertCondition;
  threshold: number;
  window: number;
  windowUnit: 'minutes' | 'hours' | 'days';
  actions: AlertAction[];
  enabled: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

// Alert Condition
interface AlertCondition {
  type: 'count' | 'rate' | 'pattern' | 'anomaly' | 'threshold';
  field?: string;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';
  value: number;
  groupBy?: string[];
}

// Alert Action
interface AlertAction {
  type: 'email' | 'slack' | 'webhook' | 'pagerduty' | 'ticket';
  target: string;
  template?: string;
  enabled: boolean;
}

// Trail Metadata
interface TrailMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  version: number;
  owner: string;
}

// Audit Query
interface AuditQuery {
  id: string;
  name: string;
  description: string;
  query: QueryDefinition;
  schedule?: QuerySchedule;
  results?: QueryResults;
  visualization?: QueryVisualization;
  sharing: QuerySharing;
  metadata: QueryMetadata;
}

// Query Definition
interface QueryDefinition {
  timeRange: TimeRange;
  filters: QueryFilter[];
  aggregations?: QueryAggregation[];
  groupBy?: string[];
  orderBy?: OrderBy[];
  limit?: number;
  offset?: number;
}

// Time Range
interface TimeRange {
  type: 'relative' | 'absolute';
  relative?: {
    value: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
  };
  absolute?: {
    start: Date;
    end: Date;
  };
}

// Query Filter
interface QueryFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'contains' | 'regex' | 'exists';
  value: unknown;
  negate?: boolean;
}

// Query Aggregation
interface QueryAggregation {
  type: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'cardinality' | 'percentile' | 'histogram';
  field?: string;
  name: string;
  params?: Record<string, unknown>;
}

// Order By
interface OrderBy {
  field: string;
  direction: 'asc' | 'desc';
}

// Query Schedule
interface QuerySchedule {
  enabled: boolean;
  cron: string;
  timezone: string;
  lastRun?: Date;
  nextRun?: Date;
  notifications: string[];
}

// Query Results
interface QueryResults {
  executedAt: Date;
  duration: number;
  totalCount: number;
  events?: AuditEvent[];
  aggregations?: Record<string, AggregationResult>;
  metadata: {
    scannedEvents: number;
    matchedEvents: number;
    bytesProcessed: number;
  };
}

// Aggregation Result
interface AggregationResult {
  value: number | Record<string, number>;
  buckets?: AggregationBucket[];
}

// Aggregation Bucket
interface AggregationBucket {
  key: string;
  count: number;
  value?: number;
}

// Query Visualization
interface QueryVisualization {
  type: 'table' | 'line' | 'bar' | 'pie' | 'area' | 'heatmap' | 'timeline';
  config: VisualizationConfig;
}

// Visualization Config
interface VisualizationConfig {
  title: string;
  xAxis?: string;
  yAxis?: string;
  series?: string[];
  colors?: string[];
  legend?: boolean;
  options?: Record<string, unknown>;
}

// Query Sharing
interface QuerySharing {
  public: boolean;
  sharedWith: string[];
  permissions: 'view' | 'edit' | 'admin';
  link?: string;
  expiresAt?: Date;
}

// Query Metadata
interface QueryMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  version: number;
  favorite: boolean;
  tags: string[];
}

// Audit Report
interface AuditReport {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  scope: ReportScope;
  period: ReportPeriod;
  sections: ReportSection[];
  summary: ReportSummary;
  generation: ReportGeneration;
  distribution: ReportDistribution;
  metadata: ReportMetadata;
}

// Report Type
type ReportType = 'compliance' | 'security' | 'access' | 'activity' | 'forensic' | 'executive' | 'custom';

// Report Scope
interface ReportScope {
  trails: string[];
  applications: string[];
  environments: string[];
  eventTypes: AuditEventType[];
  actors?: string[];
  targets?: string[];
}

// Report Period
interface ReportPeriod {
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  start: Date;
  end: Date;
  comparison?: {
    start: Date;
    end: Date;
  };
}

// Report Section
interface ReportSection {
  id: string;
  title: string;
  type: 'summary' | 'chart' | 'table' | 'text' | 'metrics';
  content: SectionContent;
  order: number;
}

// Section Content
interface SectionContent {
  query?: string;
  data?: unknown;
  visualization?: QueryVisualization;
  narrative?: string;
  metrics?: ReportMetric[];
}

// Report Metric
interface ReportMetric {
  name: string;
  value: number;
  unit?: string;
  change?: number;
  changePercent?: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

// Report Summary
interface ReportSummary {
  totalEvents: number;
  uniqueActors: number;
  uniqueTargets: number;
  criticalEvents: number;
  failedOperations: number;
  complianceScore?: number;
  riskScore?: number;
  highlights: string[];
  recommendations: string[];
}

// Report Generation
interface ReportGeneration {
  schedule?: ReportSchedule;
  format: 'pdf' | 'html' | 'docx' | 'xlsx' | 'json';
  template?: string;
  lastGenerated?: Date;
  nextGeneration?: Date;
  status: 'pending' | 'generating' | 'completed' | 'failed';
}

// Report Schedule
interface ReportSchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
}

// Report Distribution
interface ReportDistribution {
  channels: DistributionChannel[];
  recipients: string[];
  passwordProtected: boolean;
  includeRawData: boolean;
}

// Distribution Channel
interface DistributionChannel {
  type: 'email' | 's3' | 'sharepoint' | 'api';
  config: Record<string, unknown>;
  enabled: boolean;
}

// Report Metadata
interface ReportMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  version: number;
  owner: string;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
}

// Forensic Investigation
interface ForensicInvestigation {
  id: string;
  caseId: string;
  title: string;
  description: string;
  type: InvestigationType;
  status: InvestigationStatus;
  priority: 'critical' | 'high' | 'medium' | 'low';
  scope: InvestigationScope;
  timeline: InvestigationTimeline;
  evidence: InvestigationEvidence;
  findings: InvestigationFinding[];
  team: InvestigationTeam;
  chain: ChainOfCustody;
  report: InvestigationReport;
  metadata: InvestigationMetadata;
}

// Investigation Type
type InvestigationType = 'security_breach' | 'data_leak' | 'unauthorized_access' | 'policy_violation' | 'fraud' | 'compliance' | 'other';

// Investigation Status
type InvestigationStatus = 'open' | 'in_progress' | 'pending_review' | 'closed' | 'archived';

// Investigation Scope
interface InvestigationScope {
  timeRange: TimeRange;
  systems: string[];
  actors: string[];
  targets: string[];
  eventTypes: AuditEventType[];
  keywords: string[];
}

// Investigation Timeline
interface InvestigationTimeline {
  opened: Date;
  assigned?: Date;
  started?: Date;
  completed?: Date;
  closed?: Date;
  milestones: TimelineMilestone[];
}

// Timeline Milestone
interface TimelineMilestone {
  date: Date;
  event: string;
  actor: string;
  notes?: string;
}

// Investigation Evidence
interface InvestigationEvidence {
  auditEvents: string[];
  documents: EvidenceDocument[];
  screenshots: EvidenceScreenshot[];
  notes: EvidenceNote[];
  preserved: boolean;
  preservationDate?: Date;
}

// Evidence Document
interface EvidenceDocument {
  id: string;
  name: string;
  type: string;
  location: string;
  hash: string;
  collectedAt: Date;
  collectedBy: string;
}

// Evidence Screenshot
interface EvidenceScreenshot {
  id: string;
  name: string;
  location: string;
  capturedAt: Date;
  capturedBy: string;
  description: string;
}

// Evidence Note
interface EvidenceNote {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  attachments?: string[];
}

// Investigation Finding
interface InvestigationFinding {
  id: string;
  title: string;
  description: string;
  severity: AuditSeverity;
  evidence: string[];
  impact: string;
  rootCause?: string;
  recommendations: string[];
  status: 'draft' | 'confirmed' | 'disputed' | 'resolved';
}

// Investigation Team
interface InvestigationTeam {
  lead: TeamMember;
  investigators: TeamMember[];
  reviewers: TeamMember[];
  legal?: TeamMember;
}

// Team Member
interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  assignedAt: Date;
}

// Chain of Custody
interface ChainOfCustody {
  enabled: boolean;
  entries: CustodyEntry[];
}

// Custody Entry
interface CustodyEntry {
  timestamp: Date;
  action: 'collected' | 'transferred' | 'analyzed' | 'returned' | 'destroyed';
  actor: string;
  description: string;
  evidenceIds: string[];
  signature?: string;
}

// Investigation Report
interface InvestigationReport {
  executiveSummary: string;
  methodology: string;
  findings: string;
  conclusions: string;
  recommendations: string[];
  appendices: ReportAppendix[];
  generatedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

// Report Appendix
interface ReportAppendix {
  title: string;
  content: string;
  attachments?: string[];
}

// Investigation Metadata
interface InvestigationMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  version: number;
  confidentiality: 'public' | 'internal' | 'confidential' | 'restricted';
  legalHold: boolean;
}

// Audit Statistics
interface AuditStatistics {
  overview: {
    totalEvents: number;
    eventsToday: number;
    eventsThisWeek: number;
    eventsThisMonth: number;
    avgEventsPerDay: number;
    peakEventsPerHour: number;
  };
  byEventType: Record<AuditEventType, number>;
  bySeverity: Record<AuditSeverity, number>;
  byStatus: Record<AuditStatus, number>;
  byCategory: Record<string, number>;
  trails: {
    total: number;
    active: number;
    paused: number;
    archived: number;
  };
  queries: {
    total: number;
    scheduled: number;
    lastExecuted: number;
    avgDuration: number;
  };
  investigations: {
    total: number;
    open: number;
    inProgress: number;
    closed: number;
  };
  storage: {
    totalSize: number;
    indexedSize: number;
    archivedSize: number;
    retentionCompliance: number;
  };
}

class AuditService {
  private static instance: AuditService;
  private events: Map<string, AuditEvent> = new Map();
  private trails: Map<string, AuditTrail> = new Map();
  private queries: Map<string, AuditQuery> = new Map();
  private reports: Map<string, AuditReport> = new Map();
  private investigations: Map<string, ForensicInvestigation> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Audit Events
    const eventTypes: AuditEventType[] = ['login', 'create', 'update', 'delete', 'access', 'permission', 'config'];
    const categories = ['authentication', 'data', 'configuration', 'security'];
    const actors = ['user-001', 'user-002', 'service-api', 'system-cron', 'admin-001'];
    const targets = ['users', 'orders', 'products', 'settings', 'permissions'];

    for (let i = 0; i < 50; i++) {
      const eventType = eventTypes[i % eventTypes.length];
      const severity: AuditSeverity = i % 10 === 0 ? 'critical' : i % 5 === 0 ? 'high' : i % 3 === 0 ? 'medium' : 'low';
      const status: AuditStatus = i % 8 === 0 ? 'failure' : i % 12 === 0 ? 'denied' : 'success';

      const event: AuditEvent = {
        id: `event-${(i + 1).toString().padStart(6, '0')}`,
        timestamp: new Date(Date.now() - i * 30 * 60 * 1000),
        eventType,
        category: {
          primary: categories[i % categories.length] as AuditCategory['primary'],
          secondary: 'operation',
          tags: [eventType, categories[i % categories.length]],
        },
        actor: {
          id: actors[i % actors.length],
          type: actors[i % actors.length].startsWith('user') ? 'user' : actors[i % actors.length].startsWith('service') ? 'service' : 'system',
          name: `Actor ${actors[i % actors.length]}`,
          email: actors[i % actors.length].startsWith('user') ? `${actors[i % actors.length]}@company.com` : undefined,
          role: i % 5 === 0 ? 'admin' : 'user',
          department: 'Engineering',
          ipAddress: `192.168.1.${100 + (i % 50)}`,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          sessionId: `session-${i}`,
          authMethod: 'oauth2',
        },
        target: {
          id: `target-${i}`,
          type: 'resource',
          name: targets[i % targets.length],
          path: `/api/v1/${targets[i % targets.length]}`,
          attributes: { resourceType: targets[i % targets.length] },
          sensitivity: i % 10 === 0 ? 'restricted' : i % 5 === 0 ? 'confidential' : 'internal',
          owner: 'platform-team',
        },
        action: {
          operation: `${eventType}_${targets[i % targets.length]}`,
          method: eventType === 'read' || eventType === 'access' ? 'GET' : eventType === 'create' ? 'POST' : eventType === 'update' ? 'PUT' : 'DELETE',
          endpoint: `/api/v1/${targets[i % targets.length]}`,
          parameters: { id: `resource-${i}` },
          requestId: `req-${i}`,
          duration: Math.floor(Math.random() * 500) + 50,
          changes: eventType === 'update' ? [{ field: 'status', oldValue: 'active', newValue: 'inactive', sensitive: false }] : undefined,
        },
        context: {
          application: 'rescue-ping',
          environment: 'production',
          version: '1.0.0',
          component: 'api-gateway',
          correlationId: `corr-${i}`,
          traceId: `trace-${i}`,
          spanId: `span-${i}`,
          location: {
            country: 'US',
            region: 'California',
            city: 'San Francisco',
          },
          device: {
            type: 'desktop',
            os: 'macOS',
            browser: 'Chrome',
          },
        },
        outcome: {
          status,
          severity,
          errorCode: status === 'failure' ? 'ERR_001' : undefined,
          errorMessage: status === 'failure' ? 'Operation failed' : undefined,
          responseCode: status === 'success' ? 200 : status === 'denied' ? 403 : 500,
          affectedRecords: eventType === 'update' || eventType === 'delete' ? 1 : undefined,
          riskScore: severity === 'critical' ? 90 : severity === 'high' ? 70 : severity === 'medium' ? 50 : 20,
        },
        metadata: {
          version: '1.0',
          schema: 'audit-event-v1',
          source: 'api-gateway',
          ingestionTime: new Date(),
          retentionPolicy: 'standard',
          retentionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          encrypted: true,
          integrity: {
            hash: `sha256-${Math.random().toString(36).substr(2, 64)}`,
            algorithm: 'sha256',
            signature: `sig-${i}`,
          },
        },
      };
      this.events.set(event.id, event);
    }

    // Initialize Audit Trail
    const trail: AuditTrail = {
      id: 'trail-0001',
      name: 'Production Security Trail',
      description: 'Comprehensive audit trail for production security events',
      scope: {
        applications: ['rescue-ping', 'api-gateway'],
        environments: ['production'],
        eventTypes: ['login', 'logout', 'access', 'permission', 'config', 'security'],
        categories: ['authentication', 'authorization', 'security'],
        actors: [],
        targets: [],
        severities: ['critical', 'high', 'medium'],
      },
      filters: [
        { id: 'filter-1', field: 'environment', operator: 'equals', value: 'production', enabled: true },
        { id: 'filter-2', field: 'severity', operator: 'in', value: ['critical', 'high'], enabled: true },
      ],
      events: Array.from(this.events.keys()).slice(0, 30),
      statistics: {
        totalEvents: 50,
        eventsToday: 25,
        eventsThisWeek: 150,
        eventsThisMonth: 500,
        byEventType: { login: 100, logout: 80, access: 150, permission: 50, config: 30, create: 40, read: 60, update: 45, delete: 20, system: 10, security: 15, custom: 5 },
        bySeverity: { critical: 5, high: 20, medium: 100, low: 300, info: 75 },
        byStatus: { success: 450, failure: 30, partial: 10, denied: 8, error: 2 },
        topActors: [
          { id: 'user-001', name: 'User 001', count: 150, percentage: 30 },
          { id: 'service-api', name: 'API Service', count: 200, percentage: 40 },
        ],
        topTargets: [
          { id: 'users', name: 'Users Resource', count: 180, percentage: 36 },
          { id: 'orders', name: 'Orders Resource', count: 120, percentage: 24 },
        ],
        timeline: Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
          count: Math.floor(Math.random() * 50) + 10,
          severity: 'low' as AuditSeverity,
        })),
      },
      retention: {
        policy: 'regulatory',
        duration: 7,
        unit: 'years',
        archiveEnabled: true,
        archiveLocation: 's3://audit-archive/production/',
        deleteAfterArchive: false,
      },
      export: {
        enabled: true,
        format: 'json',
        schedule: {
          frequency: 'daily',
          time: '02:00',
          timezone: 'UTC',
        },
        destination: {
          type: 's3',
          config: { bucket: 'audit-exports', prefix: 'production/' },
          encryption: true,
          compression: true,
        },
        lastExport: new Date(Date.now() - 24 * 60 * 60 * 1000),
        nextExport: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
      alerts: [
        {
          id: 'alert-1',
          name: 'Critical Security Event',
          condition: { type: 'count', operator: 'gt', value: 0 },
          threshold: 1,
          window: 5,
          windowUnit: 'minutes',
          actions: [
            { type: 'pagerduty', target: 'security-team', enabled: true },
            { type: 'email', target: 'security@company.com', enabled: true },
          ],
          enabled: true,
          triggerCount: 5,
        },
      ],
      status: 'active',
      metadata: {
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        createdBy: 'security-team',
        updatedAt: new Date(),
        version: 3,
        owner: 'security-team',
      },
    };
    this.trails.set(trail.id, trail);

    // Initialize Audit Query
    const query: AuditQuery = {
      id: 'query-0001',
      name: 'Failed Login Attempts',
      description: 'Query for failed login attempts in the last 24 hours',
      query: {
        timeRange: {
          type: 'relative',
          relative: { value: 24, unit: 'hours' },
        },
        filters: [
          { field: 'eventType', operator: 'eq', value: 'login' },
          { field: 'outcome.status', operator: 'eq', value: 'failure' },
        ],
        aggregations: [
          { type: 'count', name: 'total_failures' },
          { type: 'cardinality', field: 'actor.id', name: 'unique_actors' },
        ],
        groupBy: ['actor.ipAddress'],
        orderBy: [{ field: 'count', direction: 'desc' }],
        limit: 100,
      },
      schedule: {
        enabled: true,
        cron: '0 * * * *',
        timezone: 'UTC',
        lastRun: new Date(Date.now() - 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 60 * 60 * 1000),
        notifications: ['security@company.com'],
      },
      results: {
        executedAt: new Date(Date.now() - 60 * 60 * 1000),
        duration: 1250,
        totalCount: 15,
        aggregations: {
          total_failures: { value: 15 },
          unique_actors: { value: 8 },
        },
        metadata: {
          scannedEvents: 50000,
          matchedEvents: 15,
          bytesProcessed: 25000000,
        },
      },
      visualization: {
        type: 'bar',
        config: {
          title: 'Failed Logins by IP',
          xAxis: 'actor.ipAddress',
          yAxis: 'count',
          colors: ['#ff6384'],
          legend: true,
        },
      },
      sharing: {
        public: false,
        sharedWith: ['security-team'],
        permissions: 'view',
      },
      metadata: {
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        createdBy: 'security-analyst',
        updatedAt: new Date(),
        version: 2,
        favorite: true,
        tags: ['security', 'login', 'monitoring'],
      },
    };
    this.queries.set(query.id, query);

    // Initialize Audit Report
    const report: AuditReport = {
      id: 'report-0001',
      name: 'Monthly Security Audit Report',
      description: 'Comprehensive monthly security audit report',
      type: 'security',
      scope: {
        trails: ['trail-0001'],
        applications: ['rescue-ping'],
        environments: ['production'],
        eventTypes: ['login', 'logout', 'access', 'permission', 'security'],
      },
      period: {
        type: 'monthly',
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
        comparison: {
          start: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      sections: [
        {
          id: 'section-1',
          title: 'Executive Summary',
          type: 'summary',
          content: {
            narrative: 'This report summarizes security audit events for the past month.',
          },
          order: 1,
        },
        {
          id: 'section-2',
          title: 'Event Overview',
          type: 'chart',
          content: {
            visualization: { type: 'pie', config: { title: 'Events by Type', legend: true } },
          },
          order: 2,
        },
      ],
      summary: {
        totalEvents: 500,
        uniqueActors: 50,
        uniqueTargets: 100,
        criticalEvents: 5,
        failedOperations: 30,
        complianceScore: 95,
        riskScore: 25,
        highlights: ['5 critical security events detected', 'Login failures increased by 10%'],
        recommendations: ['Implement additional MFA', 'Review access policies'],
      },
      generation: {
        schedule: {
          enabled: true,
          frequency: 'monthly',
          dayOfMonth: 1,
          time: '09:00',
          timezone: 'America/New_York',
        },
        format: 'pdf',
        lastGenerated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextGeneration: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        status: 'completed',
      },
      distribution: {
        channels: [
          { type: 'email', config: { recipients: ['ciso@company.com'] }, enabled: true },
        ],
        recipients: ['security-team', 'compliance-team'],
        passwordProtected: true,
        includeRawData: false,
      },
      metadata: {
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        createdBy: 'compliance-team',
        updatedAt: new Date(),
        version: 5,
        owner: 'security-team',
        classification: 'confidential',
      },
    };
    this.reports.set(report.id, report);

    // Initialize Investigation
    const investigation: ForensicInvestigation = {
      id: 'inv-0001',
      caseId: 'CASE-2024-001',
      title: 'Unauthorized Access Investigation',
      description: 'Investigation into potential unauthorized access to customer data',
      type: 'unauthorized_access',
      status: 'in_progress',
      priority: 'high',
      scope: {
        timeRange: {
          type: 'absolute',
          absolute: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            end: new Date(),
          },
        },
        systems: ['production-db', 'api-gateway'],
        actors: ['user-002'],
        targets: ['customer-data'],
        eventTypes: ['access', 'read'],
        keywords: ['customer', 'export', 'download'],
      },
      timeline: {
        opened: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        assigned: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        started: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        milestones: [
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), event: 'Case opened', actor: 'Security Team', notes: 'Initial alert triggered' },
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), event: 'Investigation started', actor: 'Lead Investigator' },
        ],
      },
      evidence: {
        auditEvents: Array.from(this.events.keys()).slice(0, 10),
        documents: [
          { id: 'doc-1', name: 'Access Logs', type: 'log', location: '/evidence/logs.zip', hash: 'sha256-abc123', collectedAt: new Date(), collectedBy: 'Investigator' },
        ],
        screenshots: [],
        notes: [
          { id: 'note-1', content: 'Suspicious access pattern detected', createdAt: new Date(), createdBy: 'Investigator' },
        ],
        preserved: true,
        preservationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      findings: [
        {
          id: 'finding-1',
          title: 'Anomalous Access Pattern',
          description: 'User accessed customer data outside normal working hours',
          severity: 'high',
          evidence: ['doc-1'],
          impact: 'Potential data exposure',
          recommendations: ['Review user access', 'Implement time-based access controls'],
          status: 'confirmed',
        },
      ],
      team: {
        lead: { id: 'lead-1', name: 'John Smith', role: 'Lead Investigator', email: 'john@company.com', assignedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        investigators: [
          { id: 'inv-1', name: 'Jane Doe', role: 'Security Analyst', email: 'jane@company.com', assignedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        ],
        reviewers: [
          { id: 'rev-1', name: 'CISO', role: 'Reviewer', email: 'ciso@company.com', assignedAt: new Date() },
        ],
        legal: { id: 'legal-1', name: 'Legal Counsel', role: 'Legal', email: 'legal@company.com', assignedAt: new Date() },
      },
      chain: {
        enabled: true,
        entries: [
          { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), action: 'collected', actor: 'Lead Investigator', description: 'Collected access logs', evidenceIds: ['doc-1'] },
        ],
      },
      report: {
        executiveSummary: 'Investigation into potential unauthorized access to customer data.',
        methodology: 'Log analysis and timeline reconstruction',
        findings: 'Anomalous access patterns detected',
        conclusions: 'Further analysis required',
        recommendations: ['Review access controls', 'Implement monitoring'],
        appendices: [],
      },
      metadata: {
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        createdBy: 'security-team',
        updatedAt: new Date(),
        version: 3,
        confidentiality: 'restricted',
        legalHold: true,
      },
    };
    this.investigations.set(investigation.id, investigation);
  }

  // Event Operations
  public getEvents(limit?: number): AuditEvent[] {
    let events = Array.from(this.events.values());
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (limit) events = events.slice(0, limit);
    return events;
  }

  public getEventById(id: string): AuditEvent | undefined {
    return this.events.get(id);
  }

  // Trail Operations
  public getTrails(): AuditTrail[] {
    return Array.from(this.trails.values());
  }

  public getTrailById(id: string): AuditTrail | undefined {
    return this.trails.get(id);
  }

  // Query Operations
  public getQueries(): AuditQuery[] {
    return Array.from(this.queries.values());
  }

  public getQueryById(id: string): AuditQuery | undefined {
    return this.queries.get(id);
  }

  // Report Operations
  public getReports(): AuditReport[] {
    return Array.from(this.reports.values());
  }

  public getReportById(id: string): AuditReport | undefined {
    return this.reports.get(id);
  }

  // Investigation Operations
  public getInvestigations(): ForensicInvestigation[] {
    return Array.from(this.investigations.values());
  }

  public getInvestigationById(id: string): ForensicInvestigation | undefined {
    return this.investigations.get(id);
  }

  // Statistics
  public getStatistics(): AuditStatistics {
    const events = Array.from(this.events.values());
    const trails = Array.from(this.trails.values());
    const queries = Array.from(this.queries.values());
    const investigations = Array.from(this.investigations.values());

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);

    const byEventType: Record<AuditEventType, number> = {
      create: 0, read: 0, update: 0, delete: 0, login: 0, logout: 0,
      access: 0, permission: 0, config: 0, system: 0, security: 0, custom: 0,
    };
    const bySeverity: Record<AuditSeverity, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    const byStatus: Record<AuditStatus, number> = { success: 0, failure: 0, partial: 0, denied: 0, error: 0 };
    const byCategory: Record<string, number> = {};

    events.forEach((e) => {
      byEventType[e.eventType]++;
      bySeverity[e.outcome.severity]++;
      byStatus[e.outcome.status]++;
      byCategory[e.category.primary] = (byCategory[e.category.primary] || 0) + 1;
    });

    return {
      overview: {
        totalEvents: events.length,
        eventsToday: events.filter((e) => e.timestamp >= todayStart).length,
        eventsThisWeek: events.filter((e) => e.timestamp >= weekStart).length,
        eventsThisMonth: events.filter((e) => e.timestamp >= monthStart).length,
        avgEventsPerDay: Math.floor(events.length / 30),
        peakEventsPerHour: 25,
      },
      byEventType,
      bySeverity,
      byStatus,
      byCategory,
      trails: {
        total: trails.length,
        active: trails.filter((t) => t.status === 'active').length,
        paused: trails.filter((t) => t.status === 'paused').length,
        archived: trails.filter((t) => t.status === 'archived').length,
      },
      queries: {
        total: queries.length,
        scheduled: queries.filter((q) => q.schedule?.enabled).length,
        lastExecuted: queries.filter((q) => q.results?.executedAt && q.results.executedAt > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
        avgDuration: queries.reduce((sum, q) => sum + (q.results?.duration || 0), 0) / (queries.length || 1),
      },
      investigations: {
        total: investigations.length,
        open: investigations.filter((i) => i.status === 'open').length,
        inProgress: investigations.filter((i) => i.status === 'in_progress').length,
        closed: investigations.filter((i) => i.status === 'closed' || i.status === 'archived').length,
      },
      storage: {
        totalSize: 50 * 1024 * 1024 * 1024,
        indexedSize: 45 * 1024 * 1024 * 1024,
        archivedSize: 200 * 1024 * 1024 * 1024,
        retentionCompliance: 98.5,
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

export const auditService = AuditService.getInstance();
export type {
  AuditEventType,
  AuditSeverity,
  AuditStatus,
  RetentionPolicy,
  AuditEvent,
  AuditCategory,
  AuditActor,
  ActorImpersonation,
  AuditTarget,
  AuditAction,
  AuditChange,
  AuditContext,
  AuditLocation,
  AuditDevice,
  AuditOutcome,
  AuditEventMetadata,
  AuditTrail,
  TrailScope,
  TrailFilter,
  TrailStatistics,
  TopItem,
  TimelinePoint,
  TrailRetention,
  TrailExport,
  ExportSchedule,
  ExportDestination,
  TrailAlert,
  AlertCondition,
  AlertAction,
  TrailMetadata,
  AuditQuery,
  QueryDefinition,
  TimeRange,
  QueryFilter,
  QueryAggregation,
  OrderBy,
  QuerySchedule,
  QueryResults,
  AggregationResult,
  AggregationBucket,
  QueryVisualization,
  VisualizationConfig,
  QuerySharing,
  QueryMetadata,
  AuditReport,
  ReportType,
  ReportScope,
  ReportPeriod,
  ReportSection,
  SectionContent,
  ReportMetric,
  ReportSummary,
  ReportGeneration,
  ReportSchedule,
  ReportDistribution,
  DistributionChannel,
  ReportMetadata,
  ForensicInvestigation,
  InvestigationType,
  InvestigationStatus,
  InvestigationScope,
  InvestigationTimeline,
  TimelineMilestone,
  InvestigationEvidence,
  EvidenceDocument,
  EvidenceScreenshot,
  EvidenceNote,
  InvestigationFinding,
  InvestigationTeam,
  TeamMember,
  ChainOfCustody,
  CustodyEntry,
  InvestigationReport,
  ReportAppendix,
  InvestigationMetadata,
  AuditStatistics,
};
