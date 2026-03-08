// @ts-nocheck
/**
 * Audit Logging Service
 * Comprehensive audit trail for compliance and security
 */

// Audit action
type AuditAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'export'
  | 'import'
  | 'approve'
  | 'reject'
  | 'assign'
  | 'unassign'
  | 'activate'
  | 'deactivate'
  | 'archive'
  | 'restore'
  | 'configure'
  | 'execute'
  | 'access'
  | 'deny';

// Resource type
type ResourceType = 
  | 'user'
  | 'alert'
  | 'disaster'
  | 'volunteer'
  | 'donation'
  | 'campaign'
  | 'relief_camp'
  | 'supply'
  | 'shipment'
  | 'report'
  | 'setting'
  | 'role'
  | 'permission'
  | 'session'
  | 'api_key'
  | 'webhook'
  | 'notification'
  | 'file'
  | 'system';

// Audit severity
type AuditSeverity = 'debug' | 'info' | 'warning' | 'error' | 'critical';

// Audit status
type AuditStatus = 'success' | 'failure' | 'partial' | 'pending';

// Compliance framework
type ComplianceFramework = 'gdpr' | 'hipaa' | 'sox' | 'pci_dss' | 'iso27001' | 'nist' | 'it_act_india';

// Log level
type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

// Event category
type EventCategory = 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'security' | 'compliance' | 'user_activity' | 'api' | 'emergency';

// Event status
type EventStatus = 'success' | 'failure' | 'partial' | 'pending';

// Actor type
type ActorType = 'user' | 'system' | 'api' | 'service' | 'admin' | 'external';

// Resource type
type ResourceType = 'user' | 'alert' | 'shelter' | 'donation' | 'resource' | 'volunteer' | 'report' | 'file' | 'setting' | 'permission';

// Retention policy
type RetentionPolicy = '30_days' | '90_days' | '1_year' | '3_years' | '7_years' | 'indefinite';

// Audit log entry
interface AuditLog {
  id: string;
  timestamp: Date;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId?: string;
  resourceName?: string;
  actor: AuditActor;
  target?: AuditTarget;
  changes?: AuditChanges;
  context: AuditContext;
  metadata: AuditMetadata;
  compliance: ComplianceInfo;
  status: AuditStatus;
  severity: AuditSeverity;
  message: string;
  details?: string;
  tags: string[];
}

// Audit actor
interface AuditActor {
  id: string;
  type: 'user' | 'system' | 'api' | 'scheduler' | 'webhook';
  name: string;
  email?: string;
  role?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  apiKeyId?: string;
}

// Audit target
interface AuditTarget {
  id: string;
  type: ResourceType;
  name?: string;
  owner?: string;
}

// Audit changes
interface AuditChanges {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  diff?: FieldChange[];
}

// Field change
interface FieldChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  sensitive: boolean;
}

// Audit context
interface AuditContext {
  requestId?: string;
  correlationId?: string;
  traceId?: string;
  spanId?: string;
  environment: 'development' | 'staging' | 'production';
  service: string;
  version: string;
  feature?: string;
  component?: string;
}

// Audit metadata
interface AuditMetadata {
  duration?: number; // in ms
  responseCode?: number;
  errorCode?: string;
  errorMessage?: string;
  location?: GeoLocation;
  device?: DeviceInfo;
  custom?: Record<string, unknown>;
}

// Geo location
interface GeoLocation {
  country: string;
  region: string;
  city: string;
  coordinates?: { lat: number; lng: number };
  timezone: string;
}

// Device info
interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet' | 'other';
  os: string;
  browser: string;
  fingerprint?: string;
}

// Compliance info
interface ComplianceInfo {
  frameworks: ComplianceFramework[];
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  piiInvolved: boolean;
  sensitiveData: boolean;
  retentionPolicy: RetentionPolicy;
  legalHold: boolean;
}
// Audit event
interface AuditEvent {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: EventCategory;
  action: string;
  status: EventStatus;
  actor: {
    id: string;
    type: ActorType;
    name?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
    sessionId?: string;
  };
  resource?: {
    type: ResourceType;
    id: string;
    name?: string;
  };
  details: Record<string, unknown>;
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  metadata: {
    correlationId?: string;
    requestId?: string;
    traceId?: string;
    spanId?: string;
    source: string;
    environment: string;
    version: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  risk?: {
    score: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    indicators: string[];
  };
  tags: string[];
  hash?: string;
  signature?: string;
}

// Audit log filter
interface AuditLogFilter {
  startDate?: Date;
  endDate?: Date;
  levels?: LogLevel[];
  categories?: EventCategory[];
  actions?: string[];
  actorIds?: string[];
  actorTypes?: ActorType[];
  resourceTypes?: ResourceType[];
  resourceIds?: string[];
  status?: EventStatus[];
  search?: string;
  tags?: string[];
  minRiskScore?: number;
  correlationId?: string;
}

// Audit log summary
interface AuditLogSummary {
  totalEvents: number;
  byLevel: Record<LogLevel, number>;
  byCategory: Record<EventCategory, number>;
  byStatus: Record<EventStatus, number>;
  byHour: { hour: string; count: number }[];
  topActions: { action: string; count: number }[];
  topActors: { actorId: string; name: string; count: number }[];
  riskSummary: {
    totalHighRisk: number;
    totalCriticalRisk: number;
    topIndicators: { indicator: string; count: number }[];
  };
}

// Audit policy
interface AuditPolicy {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  resourceTypes: ResourceType[];
  actions: AuditAction[];
  actors: ('user' | 'system' | 'api')[];
  minSeverity: AuditSeverity;
  retentionDays: number;
  alertOnFailure: boolean;
  alertOnSensitive: boolean;
  excludePatterns?: string[];
  includePatterns?: string[];
  compliance: ComplianceFramework[];
  enabled: boolean;
  categories: EventCategory[];
  actions: string[];
  retentionPolicy: RetentionPolicy;
  alertOnFailure: boolean;
  alertOnHighRisk: boolean;
  requireSignature: boolean;
  includeDetails: boolean;
  includeChanges: boolean;
  excludeFields: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Audit search filters
interface AuditSearchFilters {
  query?: string;
  actions?: AuditAction[];
  resourceTypes?: ResourceType[];
  resourceId?: string;
  actorId?: string;
  actorType?: AuditActor['type'];
  severity?: AuditSeverity[];
  status?: AuditStatus[];
  dateRange?: { start: Date; end: Date };
  ipAddress?: string;
  tags?: string[];
  compliance?: ComplianceFramework[];
  hasPII?: boolean;
  hasChanges?: boolean;
}

// Audit search result
interface AuditSearchResult {
  logs: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
  aggregations?: AuditAggregations;
}

// Audit aggregations
interface AuditAggregations {
  byAction: { action: AuditAction; count: number }[];
  byResourceType: { resourceType: ResourceType; count: number }[];
  bySeverity: { severity: AuditSeverity; count: number }[];
  byStatus: { status: AuditStatus; count: number }[];
  byActor: { actorId: string; actorName: string; count: number }[];
  byHour: { hour: string; count: number }[];
}

// Audit report
interface AuditReport {
  id: string;
  name: string;
  type: 'summary' | 'detailed' | 'compliance' | 'security' | 'activity';
  period: { start: Date; end: Date };
  filters: AuditSearchFilters;
  summary: ReportSummary;
  sections: ReportSection[];
  generatedAt: Date;
  generatedBy: string;
  format: 'json' | 'csv' | 'pdf' | 'html';
  downloadUrl?: string;
}

// Report summary
interface ReportSummary {
  totalEvents: number;
  successfulEvents: number;
  failedEvents: number;
  uniqueActors: number;
  uniqueResources: number;
  criticalEvents: number;
  piiAccessEvents: number;
  suspiciousEvents: number;
}

// Report section
interface ReportSection {
  title: string;
  description?: string;
  type: 'table' | 'chart' | 'timeline' | 'list';
  data: unknown;
}

// Audit alert
interface AuditAlert {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  conditions: AlertCondition[];
  actions: AlertAction[];
  throttle: number; // in minutes
}
// Compliance report
interface ComplianceReport {
  id: string;
  name: string;
  type: 'SOC2' | 'GDPR' | 'HIPAA' | 'PCI_DSS' | 'ISO27001' | 'custom';
  period: { start: Date; end: Date };
  generatedAt: Date;
  status: 'generating' | 'completed' | 'failed';
  summary: {
    totalEvents: number;
    complianceScore: number;
    violations: number;
    warnings: number;
  };
  sections: {
    title: string;
    description: string;
    status: 'pass' | 'fail' | 'warning' | 'not_applicable';
    evidence: string[];
    recommendations: string[];
  }[];
  generatedBy: string;
}

// Alert rule
interface AuditAlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'regex';
    value: unknown;
  }[];
  threshold?: {
    count: number;
    timeWindow: number; // minutes
  };
  actions: {
    type: 'email' | 'sms' | 'webhook' | 'slack' | 'pagerduty';
    target: string;
  }[];
  severity: LogLevel;
  cooldown: number; // minutes
  lastTriggered?: Date;
  triggerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Alert condition
interface AlertCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'regex';
  value: unknown;
}

// Alert action
interface AlertAction {
  type: 'email' | 'sms' | 'webhook' | 'slack' | 'pagerduty';
  config: Record<string, unknown>;
}

// Activity timeline
interface ActivityTimeline {
  userId: string;
  userName: string;
  period: { start: Date; end: Date };
  activities: TimelineActivity[];
  summary: {
    totalActivities: number;
    byAction: Record<AuditAction, number>;
    byResource: Record<ResourceType, number>;
    firstActivity: Date;
    lastActivity: Date;
  };
}

// Timeline activity
interface TimelineActivity {
  timestamp: Date;
  action: AuditAction;
  resourceType: ResourceType;
  resourceName?: string;
  description: string;
  status: AuditStatus;
  ipAddress?: string;
}

// Export config
interface ExportConfig {
  format: 'json' | 'csv' | 'xlsx';
  filters: AuditSearchFilters;
  fields: string[];
  includeChanges: boolean;
  includeMetadata: boolean;
  maxRecords?: number;
  compression?: boolean;
}

// Audit statistics
interface AuditStatistics {
  period: { start: Date; end: Date };
  totalLogs: number;
  logsPerDay: { date: string; count: number }[];
  topActors: { actorId: string; actorName: string; count: number }[];
  topResources: { resourceType: ResourceType; count: number }[];
  topActions: { action: AuditAction; count: number }[];
  failureRate: number;
  averageResponseTime: number;
  peakHour: string;
  complianceBreaches: number;
  piiAccessCount: number;
}

// Sensitive fields to mask
const SENSITIVE_FIELDS = [
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'apiKey',
  'secret',
  'pin',
  'otp',
  'ssn',
  'aadhaar',
  'pan',
  'cardNumber',
  'cvv',
  'accountNumber',
];

// Export configuration
interface ExportConfig {
  format: 'json' | 'csv' | 'pdf' | 'xml';
  filter: AuditLogFilter;
  fields: string[];
  includeMetadata: boolean;
  compress: boolean;
  encrypt: boolean;
  destination?: {
    type: 'download' | 's3' | 'sftp' | 'email';
    config: Record<string, unknown>;
  };
}

// Archived log
interface ArchivedLog {
  id: string;
  period: { start: Date; end: Date };
  eventCount: number;
  fileSize: number;
  filePath: string;
  hash: string;
  encrypted: boolean;
  archivedAt: Date;
  expiresAt?: Date;
  metadata: Record<string, unknown>;
}

// Session activity
interface SessionActivity {
  sessionId: string;
  userId: string;
  startedAt: Date;
  lastActivityAt: Date;
  endedAt?: Date;
  ipAddress: string;
  userAgent: string;
  device?: {
    type: string;
    os: string;
    browser: string;
  };
  location?: {
    city: string;
    country: string;
  };
  events: number;
  riskScore: number;
  isActive: boolean;
}

// Security incident
interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  category: string;
  affectedResources: { type: ResourceType; id: string; name?: string }[];
  affectedUsers: string[];
  relatedEvents: string[];
  timeline: { timestamp: Date; action: string; actor: string; notes?: string }[];
  assignedTo?: string;
  rootCause?: string;
  resolution?: string;
  preventionMeasures?: string[];
  reportedAt: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Data access log
interface DataAccessLog {
  id: string;
  timestamp: Date;
  userId: string;
  resourceType: ResourceType;
  resourceId: string;
  accessType: 'view' | 'download' | 'export' | 'print' | 'share';
  fields?: string[];
  purpose?: string;
  ipAddress: string;
  sessionId: string;
  authorized: boolean;
  metadata: Record<string, unknown>;
}

// API access log
interface APIAccessLog {
  id: string;
  timestamp: Date;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  statusCode: number;
  responseTime: number; // ms
  requestSize: number; // bytes
  responseSize: number; // bytes
  clientId?: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  error?: string;
  rateLimit?: {
    remaining: number;
    limit: number;
    reset: Date;
  };
}

class AuditLoggingService {
  private static instance: AuditLoggingService;
  private events: Map<string, AuditEvent> = new Map();
  private policies: Map<string, AuditPolicy> = new Map();
  private alertRules: Map<string, AuditAlertRule> = new Map();
  private complianceReports: Map<string, ComplianceReport> = new Map();
  private archivedLogs: ArchivedLog[] = [];
  private sessions: Map<string, SessionActivity> = new Map();
  private incidents: Map<string, SecurityIncident> = new Map();
  private dataAccessLogs: DataAccessLog[] = [];
  private apiAccessLogs: APIAccessLog[] = [];
  private listeners: ((event: string, data: unknown) => void)[] = [];
  private environment: string = 'production';
  private version: string = '1.0.0';

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): AuditLoggingService {
    if (!AuditLoggingService.instance) {
      AuditLoggingService.instance = new AuditLoggingService();
    }
    return AuditLoggingService.instance;
  }

  /**
   * Initialize default policies
   */
  private initializeDefaultPolicies(): void {
    const defaultPolicies: AuditPolicy[] = [
      {
        id: 'policy-security',
        name: 'Security Events',
        description: 'Audit all security-related events',
        isEnabled: true,
        resourceTypes: ['user', 'session', 'role', 'permission', 'api_key'],
        actions: ['login', 'logout', 'create', 'update', 'delete'],
        actors: ['user', 'system', 'api'],
        minSeverity: 'info',
        retentionDays: 365,
        alertOnFailure: true,
        alertOnSensitive: true,
        compliance: ['iso27001', 'it_act_india'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'policy-data-access',
        name: 'Data Access',
        description: 'Audit all data access events',
        isEnabled: true,
        resourceTypes: ['alert', 'disaster', 'volunteer', 'donation'],
        actions: ['read', 'export'],
        actors: ['user', 'api'],
        minSeverity: 'info',
        retentionDays: 90,
        alertOnFailure: false,
        alertOnSensitive: true,
        compliance: ['gdpr', 'it_act_india'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'policy-admin',
        name: 'Administrative Actions',
        description: 'Audit all administrative actions',
        isEnabled: true,
        resourceTypes: ['setting', 'role', 'permission', 'system'],
        actions: ['create', 'update', 'delete', 'configure'],
        actors: ['user'],
        minSeverity: 'warning',
        retentionDays: 730,
        alertOnFailure: true,
        alertOnSensitive: true,
        compliance: ['sox', 'iso27001'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    defaultPolicies.forEach((policy) => this.policies.set(policy.id, policy));
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    const actions: AuditAction[] = ['create', 'read', 'update', 'delete', 'login', 'logout', 'export'];
    const resourceTypes: ResourceType[] = ['user', 'alert', 'disaster', 'volunteer', 'donation', 'setting'];
    const severities: AuditSeverity[] = ['debug', 'info', 'warning', 'error'];

    for (let i = 0; i < 500; i++) {
      const action = actions[i % actions.length];
      const resourceType = resourceTypes[i % resourceTypes.length];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      const log: AuditLog = {
        id: `audit-${i.toString().padStart(8, '0')}`,
        timestamp,
        action,
        resourceType,
        resourceId: `${resourceType}-${Math.floor(Math.random() * 100)}`,
        resourceName: `Sample ${resourceType} ${Math.floor(Math.random() * 100)}`,
        actor: {
          id: `user-${(i % 20) + 1}`,
          type: i % 10 === 0 ? 'system' : 'user',
          name: `User ${(i % 20) + 1}`,
          email: `user${(i % 20) + 1}@example.com`,
          role: ['admin', 'user', 'coordinator'][i % 3],
          ipAddress: `192.168.${Math.floor(i / 256)}.${i % 256}`,
        },
        context: {
          ...this.context as AuditContext,
          requestId: `req-${Date.now()}-${i}`,
        },
        metadata: {
          duration: Math.floor(Math.random() * 500),
          responseCode: i % 20 === 0 ? 500 : 200,
        },
        compliance: {
          frameworks: ['it_act_india'],
          dataClassification: 'internal',
          piiInvolved: i % 5 === 0,
          sensitiveData: i % 10 === 0,
          retentionPolicy: '1_year',
          legalHold: false,
        },
        status: i % 15 === 0 ? 'failure' : 'success',
        severity,
        message: `${action} operation on ${resourceType}`,
        tags: [action, resourceType],
      };

      this.logs.push(log);
    }
  }

  /**
   * Log audit event
   */
  public async log(params: {
    action: AuditAction;
    resourceType: ResourceType;
    resourceId?: string;
    resourceName?: string;
    actor: Partial<AuditActor>;
    target?: AuditTarget;
    changes?: AuditChanges;
    metadata?: Partial<AuditMetadata>;
    message: string;
    details?: string;
    tags?: string[];
    severity?: AuditSeverity;
    status?: AuditStatus;
    compliance?: Partial<ComplianceInfo>;
  }): Promise<AuditLog> {
    const id = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

    // Mask sensitive fields in changes
    let maskedChanges = params.changes;
    if (params.changes) {
      maskedChanges = this.maskSensitiveData(params.changes);
    }

    const log: AuditLog = {
      id,
      timestamp: new Date(),
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      resourceName: params.resourceName,
      actor: {
        id: params.actor.id || 'unknown',
        type: params.actor.type || 'user',
        name: params.actor.name || 'Unknown',
        ...params.actor,
      } as AuditActor,
      target: params.target,
      changes: maskedChanges,
      context: {
        ...this.context as AuditContext,
        requestId: `req-${Date.now()}`,
      },
      metadata: {
        ...params.metadata,
      },
      compliance: {
        frameworks: params.compliance?.frameworks || ['it_act_india'],
        dataClassification: params.compliance?.dataClassification || 'internal',
        piiInvolved: params.compliance?.piiInvolved || false,
        sensitiveData: params.compliance?.sensitiveData || false,
        retentionPolicy: params.compliance?.retentionPolicy || '1_year',
        legalHold: params.compliance?.legalHold || false,
      },
      status: params.status || 'success',
      severity: params.severity || 'info',
      message: params.message,
      details: params.details,
      tags: params.tags || [params.action, params.resourceType],
    };

    this.logs.push(log);

    // Check for alerts
    await this.checkAlerts(log);

    // Emit event
    this.emit('audit_logged', log);

    // Keep logs under limit
    if (this.logs.length > 100000) {
      this.logs = this.logs.slice(-50000);
    }

    return log;
  }

  /**
   * Mask sensitive data
   */
  private maskSensitiveData(changes: AuditChanges): AuditChanges {
    const mask = (obj: Record<string, unknown>): Record<string, unknown> => {
      const masked: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (SENSITIVE_FIELDS.some((f) => key.toLowerCase().includes(f.toLowerCase()))) {
          masked[key] = '***MASKED***';
        } else if (typeof value === 'object' && value !== null) {
          masked[key] = mask(value as Record<string, unknown>);
        } else {
          masked[key] = value;
        }
      }
      return masked;
    };

    return {
      before: changes.before ? mask(changes.before) : undefined,
      after: changes.after ? mask(changes.after) : undefined,
      diff: changes.diff?.map((d) => ({
        ...d,
        oldValue: SENSITIVE_FIELDS.some((f) => d.field.toLowerCase().includes(f.toLowerCase())) ? '***MASKED***' : d.oldValue,
        newValue: SENSITIVE_FIELDS.some((f) => d.field.toLowerCase().includes(f.toLowerCase())) ? '***MASKED***' : d.newValue,
        sensitive: SENSITIVE_FIELDS.some((f) => d.field.toLowerCase().includes(f.toLowerCase())),
      })),
    };
  }

  /**
   * Search audit logs
   */
  public async search(filters: AuditSearchFilters, page: number = 1, pageSize: number = 50, includeAggregations: boolean = false): Promise<AuditSearchResult> {
    let results = [...this.logs];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter((log) =>
        log.message.toLowerCase().includes(query) ||
        log.resourceName?.toLowerCase().includes(query) ||
        log.actor.name.toLowerCase().includes(query)
      );
    }

    if (filters.actions?.length) {
      results = results.filter((log) => filters.actions!.includes(log.action));
    }

    if (filters.resourceTypes?.length) {
      results = results.filter((log) => filters.resourceTypes!.includes(log.resourceType));
    }

    if (filters.resourceId) {
      results = results.filter((log) => log.resourceId === filters.resourceId);
    }

    if (filters.actorId) {
      results = results.filter((log) => log.actor.id === filters.actorId);
    }

    if (filters.actorType) {
      results = results.filter((log) => log.actor.type === filters.actorType);
    }

    if (filters.severity?.length) {
      results = results.filter((log) => filters.severity!.includes(log.severity));
    }

    if (filters.status?.length) {
      results = results.filter((log) => filters.status!.includes(log.status));
    }

    if (filters.dateRange) {
      results = results.filter((log) =>
        log.timestamp >= filters.dateRange!.start && log.timestamp <= filters.dateRange!.end
      );
    }

    if (filters.ipAddress) {
      results = results.filter((log) => log.actor.ipAddress === filters.ipAddress);
    }

    if (filters.tags?.length) {
      results = results.filter((log) => filters.tags!.some((tag) => log.tags.includes(tag)));
    }

    if (filters.compliance?.length) {
      results = results.filter((log) =>
        filters.compliance!.some((f) => log.compliance.frameworks.includes(f))
      );
    }

    if (filters.hasPII !== undefined) {
      results = results.filter((log) => log.compliance.piiInvolved === filters.hasPII);
    }

    if (filters.hasChanges !== undefined) {
      results = results.filter((log) => (!!log.changes) === filters.hasChanges);
    }

    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = results.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize);

    let aggregations: AuditAggregations | undefined;
    if (includeAggregations) {
      aggregations = this.calculateAggregations(results);
    }

    return {
      logs: paginatedResults,
      total,
      page,
      pageSize,
      aggregations,
    };
  }

  /**
   * Calculate aggregations
   */
  private calculateAggregations(logs: AuditLog[]): AuditAggregations {
    const byAction = new Map<AuditAction, number>();
    const byResourceType = new Map<ResourceType, number>();
    const bySeverity = new Map<AuditSeverity, number>();
    const byStatus = new Map<AuditStatus, number>();
    const byActor = new Map<string, { name: string; count: number }>();
    const byHour = new Map<string, number>();

    logs.forEach((log) => {
      byAction.set(log.action, (byAction.get(log.action) || 0) + 1);
      byResourceType.set(log.resourceType, (byResourceType.get(log.resourceType) || 0) + 1);
      bySeverity.set(log.severity, (bySeverity.get(log.severity) || 0) + 1);
      byStatus.set(log.status, (byStatus.get(log.status) || 0) + 1);

      const actorData = byActor.get(log.actor.id) || { name: log.actor.name, count: 0 };
      actorData.count++;
      byActor.set(log.actor.id, actorData);

      const hour = log.timestamp.toISOString().substr(0, 13);
      byHour.set(hour, (byHour.get(hour) || 0) + 1);
    });

    return {
      byAction: Array.from(byAction.entries()).map(([action, count]) => ({ action, count })),
      byResourceType: Array.from(byResourceType.entries()).map(([resourceType, count]) => ({ resourceType, count })),
      bySeverity: Array.from(bySeverity.entries()).map(([severity, count]) => ({ severity, count })),
      byStatus: Array.from(byStatus.entries()).map(([status, count]) => ({ status, count })),
      byActor: Array.from(byActor.entries())
        .map(([actorId, { name, count }]) => ({ actorId, actorName: name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      byHour: Array.from(byHour.entries())
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => a.hour.localeCompare(b.hour)),
    };
  }

  /**
   * Get log by ID
   */
  public getLog(logId: string): AuditLog | undefined {
    return this.logs.find((log) => log.id === logId);
  }

  /**
   * Get activity timeline
   */
  public getActivityTimeline(userId: string, period: { start: Date; end: Date }): ActivityTimeline {
    const userLogs = this.logs.filter(
      (log) => log.actor.id === userId && log.timestamp >= period.start && log.timestamp <= period.end
    );

    const userName = userLogs[0]?.actor.name || 'Unknown User';

    const byAction: Record<AuditAction, number> = {} as Record<AuditAction, number>;
    const byResource: Record<ResourceType, number> = {} as Record<ResourceType, number>;

    userLogs.forEach((log) => {
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      byResource[log.resourceType] = (byResource[log.resourceType] || 0) + 1;
    });

    const sortedLogs = [...userLogs].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return {
      userId,
      userName,
      period,
      activities: sortedLogs.map((log) => ({
        timestamp: log.timestamp,
        action: log.action,
        resourceType: log.resourceType,
        resourceName: log.resourceName,
        description: log.message,
        status: log.status,
        ipAddress: log.actor.ipAddress,
      })),
      summary: {
        totalActivities: userLogs.length,
        byAction,
        byResource,
        firstActivity: sortedLogs[0]?.timestamp || period.start,
        lastActivity: sortedLogs[sortedLogs.length - 1]?.timestamp || period.end,
      },
    };
  }

  /**
   * Get statistics
   */
  public getStatistics(period: { start: Date; end: Date }): AuditStatistics {
    const periodLogs = this.logs.filter(
      (log) => log.timestamp >= period.start && log.timestamp <= period.end
    );

    const logsPerDay = new Map<string, number>();
    const topActors = new Map<string, { name: string; count: number }>();
    const topResources = new Map<ResourceType, number>();
    const topActions = new Map<AuditAction, number>();
    const hourCounts = new Map<number, number>();

    let failureCount = 0;
    let totalDuration = 0;
    let durationCount = 0;
    let piiCount = 0;

    periodLogs.forEach((log) => {
      const date = log.timestamp.toISOString().substr(0, 10);
      logsPerDay.set(date, (logsPerDay.get(date) || 0) + 1);

      const actorData = topActors.get(log.actor.id) || { name: log.actor.name, count: 0 };
      actorData.count++;
      topActors.set(log.actor.id, actorData);

      topResources.set(log.resourceType, (topResources.get(log.resourceType) || 0) + 1);
      topActions.set(log.action, (topActions.get(log.action) || 0) + 1);

      const hour = log.timestamp.getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);

      if (log.status === 'failure') failureCount++;
      if (log.metadata.duration) {
        totalDuration += log.metadata.duration;
        durationCount++;
      }
      if (log.compliance.piiInvolved) piiCount++;
    });

    // Find peak hour
    let peakHour = 0;
    let maxHourCount = 0;
    hourCounts.forEach((count, hour) => {
      if (count > maxHourCount) {
        maxHourCount = count;
        peakHour = hour;
      }
    });

    return {
      period,
      totalLogs: periodLogs.length,
      logsPerDay: Array.from(logsPerDay.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      topActors: Array.from(topActors.entries())
        .map(([actorId, { name, count }]) => ({ actorId, actorName: name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      topResources: Array.from(topResources.entries())
        .map(([resourceType, count]) => ({ resourceType, count }))
        .sort((a, b) => b.count - a.count),
      topActions: Array.from(topActions.entries())
        .map(([action, count]) => ({ action, count }))
        .sort((a, b) => b.count - a.count),
      failureRate: periodLogs.length > 0 ? (failureCount / periodLogs.length) * 100 : 0,
      averageResponseTime: durationCount > 0 ? totalDuration / durationCount : 0,
      peakHour: `${peakHour.toString().padStart(2, '0')}:00`,
      complianceBreaches: 0,
      piiAccessCount: piiCount,
    };
  }

  /**
   * Generate report
   */
  public async generateReport(params: {
    name: string;
    type: AuditReport['type'];
    period: { start: Date; end: Date };
    filters?: AuditSearchFilters;
    format?: AuditReport['format'];
    generatedBy: string;
  }): Promise<AuditReport> {
    const { logs } = await this.search({
      ...params.filters,
      dateRange: params.period,
    }, 1, 10000);

    const statistics = this.getStatistics(params.period);

    const report: AuditReport = {
      id: `report-${Date.now()}`,
      name: params.name,
      type: params.type,
      period: params.period,
      filters: params.filters || {},
      summary: {
        totalEvents: logs.length,
        successfulEvents: logs.filter((l) => l.status === 'success').length,
        failedEvents: logs.filter((l) => l.status === 'failure').length,
        uniqueActors: new Set(logs.map((l) => l.actor.id)).size,
        uniqueResources: new Set(logs.map((l) => l.resourceId).filter(Boolean)).size,
        criticalEvents: logs.filter((l) => l.severity === 'critical').length,
        piiAccessEvents: logs.filter((l) => l.compliance.piiInvolved).length,
        suspiciousEvents: logs.filter((l) => l.severity === 'warning' || l.severity === 'error').length,
      },
      sections: [
        {
          title: 'Activity Over Time',
          type: 'chart',
          data: statistics.logsPerDay,
        },
        {
          title: 'Top Users',
          type: 'table',
          data: statistics.topActors,
        },
        {
          title: 'Actions Summary',
          type: 'chart',
          data: statistics.topActions,
        },
        {
          title: 'Resource Types',
          type: 'chart',
          data: statistics.topResources,
        },
      ],
      generatedAt: new Date(),
      generatedBy: params.generatedBy,
      format: params.format || 'json',
    };

    this.reports.set(report.id, report);
    return report;
  }

  /**
   * Export logs
   */
  public async exportLogs(config: ExportConfig): Promise<{ data: string; filename: string; mimeType: string }> {
    const { logs } = await this.search(config.filters, 1, config.maxRecords || 10000);

    const exportData = logs.map((log) => {
      const record: Record<string, unknown> = {};
      config.fields.forEach((field) => {
        const value = field.split('.').reduce((obj: any, key) => obj?.[key], log);
        record[field] = value;
      });
      if (config.includeChanges) record.changes = log.changes;
      if (config.includeMetadata) record.metadata = log.metadata;
      return record;
    });

    let data: string;
    let mimeType: string;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    switch (config.format) {
      case 'csv':
        const headers = Object.keys(exportData[0] || {});
        data = [headers.join(','), ...exportData.map((row) =>
          headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
        )].join('\n');
        mimeType = 'text/csv';
        break;
      case 'xlsx':
        data = JSON.stringify(exportData);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      default:
        data = JSON.stringify(exportData, null, 2);
        mimeType = 'application/json';
    }

    return {
      data,
      filename: `audit-export-${timestamp}.${config.format}`,
      mimeType,
    };
  }

  /**
   * Create alert
   */
  public createAlert(alert: Omit<AuditAlert, 'id' | 'lastTriggered' | 'triggerCount' | 'createdAt' | 'updatedAt'>): AuditAlert {
    const newAlert: AuditAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      triggerCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.alerts.set(newAlert.id, newAlert);
    return newAlert;
  }

  /**
   * Check alerts
   */
  private async checkAlerts(log: AuditLog): Promise<void> {
    for (const alert of this.alerts.values()) {
      if (!alert.isEnabled) continue;

      // Check throttle
      if (alert.lastTriggered) {
        const throttleMs = alert.throttle * 60 * 1000;
        if (Date.now() - alert.lastTriggered.getTime() < throttleMs) continue;
      }

      // Check conditions
      const matches = alert.conditions.every((condition) => {
        const value = condition.field.split('.').reduce((obj: any, key) => obj?.[key], log);
        switch (condition.operator) {
          case 'equals': return value === condition.value;
          case 'contains': return String(value).includes(String(condition.value));
          case 'greater_than': return Number(value) > Number(condition.value);
          case 'less_than': return Number(value) < Number(condition.value);
          case 'in': return (condition.value as unknown[]).includes(value);
          case 'not_in': return !(condition.value as unknown[]).includes(value);
          case 'regex': return new RegExp(String(condition.value)).test(String(value));
          default: return false;
        }
      });

      if (matches) {
        alert.lastTriggered = new Date();
        alert.triggerCount++;
        this.emit('alert_triggered', { alertId: alert.id, log });
      }
    }
  }

  /**
   * Get policies
   */
  public getPolicies(): AuditPolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Get alerts
   */
  public getAlerts(): AuditAlert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Set context
   */
  public setContext(context: Partial<AuditContext>): void {
    this.context = { ...this.context, ...context };
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

export const auditLoggingService = AuditLoggingService.getInstance();
export type {
  AuditAction,
  ResourceType,
  AuditSeverity,
  AuditStatus,
  ComplianceFramework,
  RetentionPolicy,
  AuditLog,
  AuditActor,
  AuditTarget,
  AuditChanges,
  FieldChange,
  AuditContext,
  AuditMetadata,
  GeoLocation,
  DeviceInfo,
  ComplianceInfo,
  AuditPolicy,
  AuditSearchFilters,
  AuditSearchResult,
  AuditAggregations,
  AuditReport,
  ReportSummary,
  ReportSection,
  AuditAlert,
  AlertCondition,
  AlertAction,
  ActivityTimeline,
  TimelineActivity,
  ExportConfig,
  AuditStatistics,
  LogLevel,
  EventCategory,
  EventStatus,
  ActorType,
  ResourceType,
  RetentionPolicy,
  AuditEvent,
  AuditLogFilter,
  AuditLogSummary,
  AuditPolicy,
  ComplianceReport,
  AuditAlertRule,
  ExportConfig,
  ArchivedLog,
  SessionActivity,
  SecurityIncident,
  DataAccessLog,
  APIAccessLog,
};
