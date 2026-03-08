/**
 * Health Check Service
 * Comprehensive health monitoring, status checks, and system diagnostics
 */

// Health Status
type HealthStatus = 'healthy' | 'unhealthy' | 'degraded' | 'unknown' | 'maintenance';

// Check Type
type CheckType = 'http' | 'tcp' | 'grpc' | 'dns' | 'database' | 'cache' | 'queue' | 'storage' | 'custom';

// Check Result
type CheckResult = 'pass' | 'fail' | 'warn' | 'skip' | 'timeout';

// Severity Level
type SeverityLevel = 'info' | 'warning' | 'error' | 'critical';

// Health Check
interface HealthCheck {
  id: string;
  name: string;
  description: string;
  type: CheckType;
  status: HealthStatus;
  lastResult: CheckResult;
  target: CheckTarget;
  configuration: CheckConfiguration;
  schedule: CheckSchedule;
  thresholds: CheckThresholds;
  dependencies: string[];
  alerts: AlertConfiguration[];
  history: CheckHistory[];
  metrics: CheckMetrics;
  tags: string[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    lastCheckedAt?: Date;
    nextCheckAt?: Date;
    enabled: boolean;
  };
}

// Check Target
interface CheckTarget {
  type: 'service' | 'endpoint' | 'database' | 'cache' | 'queue' | 'external';
  name: string;
  host: string;
  port?: number;
  path?: string;
  protocol?: 'http' | 'https' | 'tcp' | 'grpc';
  environment: string;
  region?: string;
  cluster?: string;
}

// Check Configuration
interface CheckConfiguration {
  method?: 'GET' | 'POST' | 'HEAD';
  headers?: Record<string, string>;
  body?: string;
  expectedStatus?: number[];
  expectedBody?: string;
  expectedHeaders?: Record<string, string>;
  timeout: number;
  retries: number;
  retryDelay: number;
  followRedirects?: boolean;
  validateSsl?: boolean;
  authentication?: {
    type: 'none' | 'basic' | 'bearer' | 'api-key';
    credentials?: string;
    headerName?: string;
  };
  customScript?: string;
}

// Check Schedule
interface CheckSchedule {
  type: 'interval' | 'cron' | 'manual';
  interval?: number;
  cron?: string;
  timezone?: string;
  activeHours?: {
    start: string;
    end: string;
    days: number[];
  };
}

// Check Thresholds
interface CheckThresholds {
  responseTime: {
    warning: number;
    critical: number;
  };
  successRate: {
    warning: number;
    critical: number;
  };
  consecutiveFailures: {
    warning: number;
    critical: number;
  };
  custom?: {
    metric: string;
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    warning: number;
    critical: number;
  }[];
}

// Alert Configuration
interface AlertConfiguration {
  id: string;
  name: string;
  condition: string;
  severity: SeverityLevel;
  channels: AlertChannel[];
  throttle: {
    enabled: boolean;
    period: number;
    maxAlerts: number;
  };
  enabled: boolean;
}

// Alert Channel
interface AlertChannel {
  type: 'email' | 'slack' | 'pagerduty' | 'webhook' | 'sms';
  target: string;
  template?: string;
}

// Check History
interface CheckHistory {
  id: string;
  timestamp: Date;
  result: CheckResult;
  status: HealthStatus;
  responseTime: number;
  statusCode?: number;
  message?: string;
  details?: Record<string, unknown>;
}

// Check Metrics
interface CheckMetrics {
  totalChecks: number;
  successfulChecks: number;
  failedChecks: number;
  warningChecks: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p50ResponseTime: number;
  p90ResponseTime: number;
  p99ResponseTime: number;
  uptime: number;
  availability: number;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  lastFailure?: Date;
  lastSuccess?: Date;
}

// Health Endpoint
interface HealthEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'HEAD';
  type: 'liveness' | 'readiness' | 'startup' | 'custom';
  checks: string[];
  aggregation: 'all' | 'any' | 'majority';
  timeout: number;
  cache: {
    enabled: boolean;
    ttl: number;
  };
  authentication: {
    required: boolean;
    type?: 'basic' | 'bearer' | 'api-key';
  };
  response: {
    format: 'json' | 'text' | 'status-code';
    includeDetails: boolean;
    includeMetrics: boolean;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Service Health
interface ServiceHealth {
  id: string;
  name: string;
  type: 'api' | 'web' | 'worker' | 'database' | 'cache' | 'queue' | 'gateway';
  status: HealthStatus;
  version: string;
  environment: string;
  instances: InstanceHealth[];
  checks: string[];
  dependencies: DependencyHealth[];
  metrics: ServiceMetrics;
  sla: SLAConfiguration;
  incidents: IncidentInfo[];
  maintenance: MaintenanceWindow[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastHealthyAt?: Date;
    lastUnhealthyAt?: Date;
  };
}

// Instance Health
interface InstanceHealth {
  id: string;
  name: string;
  ip: string;
  status: HealthStatus;
  version: string;
  zone?: string;
  node?: string;
  startTime: Date;
  lastCheck: Date;
  checks: {
    name: string;
    status: HealthStatus;
    lastResult: CheckResult;
    responseTime: number;
  }[];
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    connections: number;
  };
}

// Dependency Health
interface DependencyHealth {
  id: string;
  name: string;
  type: 'internal' | 'external';
  status: HealthStatus;
  critical: boolean;
  lastCheck: Date;
  responseTime: number;
  errorRate: number;
}

// Service Metrics
interface ServiceMetrics {
  availability: number;
  uptime: number;
  mttr: number;
  mtbf: number;
  errorRate: number;
  latencyP50: number;
  latencyP90: number;
  latencyP99: number;
  requestRate: number;
  throughput: number;
}

// SLA Configuration
interface SLAConfiguration {
  target: {
    availability: number;
    responseTime: number;
    errorRate: number;
  };
  current: {
    availability: number;
    responseTime: number;
    errorRate: number;
  };
  period: 'daily' | 'weekly' | 'monthly';
  breaches: {
    timestamp: Date;
    metric: string;
    target: number;
    actual: number;
    duration: number;
  }[];
}

// Incident Info
interface IncidentInfo {
  id: string;
  title: string;
  severity: SeverityLevel;
  status: 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startedAt: Date;
  resolvedAt?: Date;
  duration?: number;
  impact: string;
}

// Maintenance Window
interface MaintenanceWindow {
  id: string;
  name: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  startTime: Date;
  endTime: Date;
  affectedChecks: string[];
  createdBy: string;
}

// Health Dashboard
interface HealthDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: {
    columns: number;
    rows: number;
  };
  refreshInterval: number;
  filters: {
    environments: string[];
    services: string[];
    tags: string[];
  };
  sharing: {
    public: boolean;
    publicUrl?: string;
    password?: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Dashboard Widget
interface DashboardWidget {
  id: string;
  type: 'status' | 'chart' | 'table' | 'metric' | 'timeline' | 'heatmap' | 'map';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  configuration: {
    source: string;
    metric?: string;
    aggregation?: string;
    timeRange?: string;
    groupBy?: string;
    visualization?: Record<string, unknown>;
  };
}

// Health Report
interface HealthReport {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalChecks: number;
    healthyServices: number;
    unhealthyServices: number;
    degradedServices: number;
    overallAvailability: number;
    averageResponseTime: number;
    incidents: number;
    slaBreaches: number;
  };
  services: {
    name: string;
    availability: number;
    incidents: number;
    mttr: number;
    trend: 'improving' | 'stable' | 'declining';
  }[];
  topIssues: {
    check: string;
    failures: number;
    avgDowntime: number;
  }[];
  recommendations: {
    priority: 'low' | 'medium' | 'high';
    category: string;
    description: string;
    action: string;
  }[];
  metadata: {
    generatedAt: Date;
    generatedBy: string;
  };
}

// Status Page
interface StatusPage {
  id: string;
  name: string;
  description: string;
  url: string;
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';
  components: StatusComponent[];
  incidents: StatusIncident[];
  scheduledMaintenances: StatusMaintenance[];
  metrics: StatusMetrics[];
  branding: {
    logo?: string;
    favicon?: string;
    primaryColor?: string;
    customCss?: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    webhook: boolean;
    rss: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastIncident?: Date;
  };
}

// Status Component
interface StatusComponent {
  id: string;
  name: string;
  description: string;
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';
  group?: string;
  order: number;
  showOnStatusPage: boolean;
  linkedChecks: string[];
}

// Status Incident
interface StatusIncident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  impact: 'none' | 'minor' | 'major' | 'critical';
  components: string[];
  updates: {
    id: string;
    status: string;
    message: string;
    timestamp: Date;
    author: string;
  }[];
  createdAt: Date;
  resolvedAt?: Date;
}

// Status Maintenance
interface StatusMaintenance {
  id: string;
  title: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  impact: 'none' | 'minor' | 'major';
  components: string[];
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  updates: {
    id: string;
    message: string;
    timestamp: Date;
  }[];
}

// Status Metrics
interface StatusMetrics {
  id: string;
  name: string;
  suffix: string;
  tooltipDescription: string;
  displayType: 'day' | 'week' | 'month';
  data: {
    timestamp: Date;
    value: number;
  }[];
}

// Health Statistics
interface HealthStatistics {
  overview: {
    totalChecks: number;
    activeChecks: number;
    healthyChecks: number;
    unhealthyChecks: number;
    degradedChecks: number;
    overallHealth: HealthStatus;
  };
  byType: Record<CheckType, number>;
  byStatus: Record<HealthStatus, number>;
  byEnvironment: Record<string, { total: number; healthy: number; unhealthy: number }>;
  performance: {
    averageResponseTime: number;
    p50ResponseTime: number;
    p90ResponseTime: number;
    p99ResponseTime: number;
    slowestChecks: { name: string; responseTime: number }[];
  };
  availability: {
    overall: number;
    last24h: number;
    last7d: number;
    last30d: number;
    byService: Record<string, number>;
  };
  incidents: {
    total: number;
    open: number;
    mttr: number;
    byService: Record<string, number>;
  };
  trends: {
    date: string;
    healthy: number;
    unhealthy: number;
    degraded: number;
    avgResponseTime: number;
  }[];
}

class HealthCheckService {
  private static instance: HealthCheckService;
  private checks: Map<string, HealthCheck> = new Map();
  private endpoints: Map<string, HealthEndpoint> = new Map();
  private services: Map<string, ServiceHealth> = new Map();
  private dashboards: Map<string, HealthDashboard> = new Map();
  private reports: Map<string, HealthReport> = new Map();
  private statusPages: Map<string, StatusPage> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Health Checks
    const checksData = [
      { name: 'API Gateway Health', type: 'http' as CheckType, status: 'healthy' as HealthStatus },
      { name: 'Database Connection', type: 'database' as CheckType, status: 'healthy' as HealthStatus },
      { name: 'Redis Cache', type: 'cache' as CheckType, status: 'healthy' as HealthStatus },
      { name: 'RabbitMQ Queue', type: 'queue' as CheckType, status: 'degraded' as HealthStatus },
      { name: 'External Payment API', type: 'http' as CheckType, status: 'healthy' as HealthStatus },
      { name: 'Auth Service', type: 'grpc' as CheckType, status: 'healthy' as HealthStatus },
      { name: 'S3 Storage', type: 'storage' as CheckType, status: 'healthy' as HealthStatus },
      { name: 'DNS Resolution', type: 'dns' as CheckType, status: 'healthy' as HealthStatus },
      { name: 'Notification Service', type: 'http' as CheckType, status: 'unhealthy' as HealthStatus },
      { name: 'Search Elasticsearch', type: 'tcp' as CheckType, status: 'healthy' as HealthStatus },
    ];

    checksData.forEach((c, idx) => {
      const check: HealthCheck = {
        id: `check-${(idx + 1).toString().padStart(4, '0')}`,
        name: c.name,
        description: `Health check for ${c.name}`,
        type: c.type,
        status: c.status,
        lastResult: c.status === 'healthy' ? 'pass' : c.status === 'unhealthy' ? 'fail' : 'warn',
        target: {
          type: c.type === 'http' || c.type === 'grpc' ? 'service' : c.type === 'database' ? 'database' : c.type === 'cache' ? 'cache' : c.type === 'queue' ? 'queue' : 'endpoint',
          name: c.name.toLowerCase().replace(/\s/g, '-'),
          host: c.type === 'http' ? `${c.name.toLowerCase().replace(/\s/g, '-')}.rescueping.io` : `${c.name.toLowerCase().replace(/\s/g, '-')}.internal`,
          port: c.type === 'http' ? 443 : c.type === 'database' ? 5432 : c.type === 'cache' ? 6379 : c.type === 'grpc' ? 9090 : 8080,
          path: c.type === 'http' ? '/health' : undefined,
          protocol: c.type === 'http' ? 'https' : c.type === 'grpc' ? 'grpc' : 'tcp',
          environment: 'production',
          region: 'us-east-1',
          cluster: 'prod-cluster-1',
        },
        configuration: {
          method: c.type === 'http' ? 'GET' : undefined,
          expectedStatus: c.type === 'http' ? [200] : undefined,
          timeout: 5000,
          retries: 3,
          retryDelay: 1000,
          followRedirects: true,
          validateSsl: true,
          authentication: { type: 'none' },
        },
        schedule: {
          type: 'interval',
          interval: 30000,
          timezone: 'UTC',
        },
        thresholds: {
          responseTime: { warning: 500, critical: 2000 },
          successRate: { warning: 0.99, critical: 0.95 },
          consecutiveFailures: { warning: 2, critical: 5 },
        },
        dependencies: idx > 0 ? [`check-${(idx).toString().padStart(4, '0')}`] : [],
        alerts: [
          {
            id: `alert-${idx}-1`,
            name: 'Check Failed Alert',
            condition: 'consecutiveFailures >= 3',
            severity: 'critical',
            channels: [{ type: 'slack', target: '#alerts' }, { type: 'pagerduty', target: 'platform-team' }],
            throttle: { enabled: true, period: 300, maxAlerts: 3 },
            enabled: true,
          },
          {
            id: `alert-${idx}-2`,
            name: 'High Latency Alert',
            condition: 'responseTime > 1000',
            severity: 'warning',
            channels: [{ type: 'slack', target: '#monitoring' }],
            throttle: { enabled: true, period: 600, maxAlerts: 5 },
            enabled: true,
          },
        ],
        history: Array.from({ length: 20 }, (_, i) => ({
          id: `hist-${idx}-${i}`,
          timestamp: new Date(Date.now() - i * 30 * 1000),
          result: c.status === 'healthy' ? 'pass' : c.status === 'unhealthy' && i < 3 ? 'fail' : c.status === 'degraded' && i % 3 === 0 ? 'warn' : 'pass',
          status: c.status === 'healthy' ? 'healthy' : c.status === 'unhealthy' && i < 3 ? 'unhealthy' : c.status === 'degraded' && i % 3 === 0 ? 'degraded' : 'healthy',
          responseTime: Math.random() * 200 + (c.status === 'degraded' ? 300 : 50),
          statusCode: c.type === 'http' ? 200 : undefined,
          message: c.status === 'unhealthy' && i < 3 ? 'Connection refused' : 'OK',
        })),
        metrics: {
          totalChecks: 1000 + Math.floor(Math.random() * 500),
          successfulChecks: c.status === 'healthy' ? 990 + Math.floor(Math.random() * 10) : c.status === 'degraded' ? 950 + Math.floor(Math.random() * 30) : 900 + Math.floor(Math.random() * 50),
          failedChecks: c.status === 'healthy' ? Math.floor(Math.random() * 10) : c.status === 'unhealthy' ? 50 + Math.floor(Math.random() * 50) : 20 + Math.floor(Math.random() * 30),
          warningChecks: c.status === 'degraded' ? 30 + Math.floor(Math.random() * 20) : Math.floor(Math.random() * 10),
          averageResponseTime: c.status === 'healthy' ? Math.random() * 100 + 30 : c.status === 'degraded' ? Math.random() * 300 + 200 : Math.random() * 500 + 300,
          minResponseTime: Math.random() * 20 + 10,
          maxResponseTime: c.status === 'healthy' ? Math.random() * 500 + 200 : Math.random() * 2000 + 500,
          p50ResponseTime: c.status === 'healthy' ? Math.random() * 50 + 20 : Math.random() * 200 + 100,
          p90ResponseTime: c.status === 'healthy' ? Math.random() * 150 + 50 : Math.random() * 400 + 200,
          p99ResponseTime: c.status === 'healthy' ? Math.random() * 300 + 100 : Math.random() * 800 + 400,
          uptime: c.status === 'healthy' ? 0.9999 : c.status === 'degraded' ? 0.995 : 0.98,
          availability: c.status === 'healthy' ? 99.99 : c.status === 'degraded' ? 99.5 : 98.0,
          consecutiveFailures: c.status === 'unhealthy' ? 5 : 0,
          consecutiveSuccesses: c.status === 'healthy' ? 100 : c.status === 'degraded' ? 3 : 0,
          lastFailure: c.status !== 'healthy' ? new Date(Date.now() - Math.random() * 60 * 60 * 1000) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          lastSuccess: c.status === 'healthy' ? new Date() : new Date(Date.now() - 5 * 60 * 1000),
        },
        tags: ['production', c.type, c.name.toLowerCase().split(' ')[0]],
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          lastCheckedAt: new Date(),
          nextCheckAt: new Date(Date.now() + 30 * 1000),
          enabled: true,
        },
      };
      this.checks.set(check.id, check);
    });

    // Initialize Health Endpoints
    const endpointsData = [
      { name: 'Liveness Probe', path: '/health/live', type: 'liveness' as const },
      { name: 'Readiness Probe', path: '/health/ready', type: 'readiness' as const },
      { name: 'Startup Probe', path: '/health/startup', type: 'startup' as const },
      { name: 'Full Health', path: '/health', type: 'custom' as const },
    ];

    endpointsData.forEach((e, idx) => {
      const endpoint: HealthEndpoint = {
        id: `endpoint-${(idx + 1).toString().padStart(4, '0')}`,
        name: e.name,
        path: e.path,
        method: 'GET',
        type: e.type,
        checks: Array.from(this.checks.keys()).slice(0, e.type === 'liveness' ? 2 : e.type === 'readiness' ? 5 : 10),
        aggregation: e.type === 'liveness' ? 'all' : 'majority',
        timeout: 5000,
        cache: {
          enabled: e.type === 'liveness',
          ttl: 5,
        },
        authentication: {
          required: e.type === 'custom',
          type: e.type === 'custom' ? 'bearer' : undefined,
        },
        response: {
          format: 'json',
          includeDetails: e.type === 'custom',
          includeMetrics: e.type === 'custom',
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.endpoints.set(endpoint.id, endpoint);
    });

    // Initialize Service Health
    const servicesData = [
      { name: 'API Gateway', type: 'gateway' as const, status: 'healthy' as HealthStatus },
      { name: 'Auth Service', type: 'api' as const, status: 'healthy' as HealthStatus },
      { name: 'User Service', type: 'api' as const, status: 'healthy' as HealthStatus },
      { name: 'Notification Service', type: 'worker' as const, status: 'unhealthy' as HealthStatus },
      { name: 'PostgreSQL', type: 'database' as const, status: 'healthy' as HealthStatus },
      { name: 'Redis Cache', type: 'cache' as const, status: 'healthy' as HealthStatus },
      { name: 'RabbitMQ', type: 'queue' as const, status: 'degraded' as HealthStatus },
    ];

    servicesData.forEach((s, idx) => {
      const service: ServiceHealth = {
        id: `service-${(idx + 1).toString().padStart(4, '0')}`,
        name: s.name,
        type: s.type,
        status: s.status,
        version: '2.1.0',
        environment: 'production',
        instances: Array.from({ length: s.type === 'database' || s.type === 'cache' ? 1 : 3 }, (_, i) => ({
          id: `instance-${idx}-${i}`,
          name: `${s.name.toLowerCase().replace(/\s/g, '-')}-${i + 1}`,
          ip: `10.0.${idx}.${i + 1}`,
          status: s.status === 'unhealthy' && i === 0 ? 'unhealthy' : s.status === 'degraded' && i === 2 ? 'degraded' : 'healthy',
          version: '2.1.0',
          zone: `zone-${i % 3 + 1}`,
          node: `node-${i + 1}`,
          startTime: new Date(Date.now() - (7 + i) * 24 * 60 * 60 * 1000),
          lastCheck: new Date(),
          checks: [
            { name: 'liveness', status: 'healthy', lastResult: 'pass', responseTime: Math.random() * 20 + 5 },
            { name: 'readiness', status: s.status, lastResult: s.status === 'healthy' ? 'pass' : s.status === 'degraded' ? 'warn' : 'fail', responseTime: Math.random() * 50 + 10 },
          ],
          resources: {
            cpu: Math.random() * 40 + 20,
            memory: Math.random() * 50 + 30,
            disk: Math.random() * 30 + 10,
            connections: Math.floor(Math.random() * 100) + 50,
          },
        })),
        checks: Array.from(this.checks.keys()).slice(idx * 2, idx * 2 + 2),
        dependencies: idx > 0 ? [
          { id: `dep-${idx}-1`, name: 'PostgreSQL', type: 'internal', status: 'healthy', critical: true, lastCheck: new Date(), responseTime: Math.random() * 10 + 2, errorRate: 0.001 },
          { id: `dep-${idx}-2`, name: 'Redis', type: 'internal', status: 'healthy', critical: false, lastCheck: new Date(), responseTime: Math.random() * 5 + 1, errorRate: 0.0001 },
        ] : [],
        metrics: {
          availability: s.status === 'healthy' ? 99.99 : s.status === 'degraded' ? 99.5 : 98.0,
          uptime: s.status === 'healthy' ? 0.9999 : s.status === 'degraded' ? 0.995 : 0.98,
          mttr: Math.random() * 30 + 10,
          mtbf: Math.random() * 500 + 200,
          errorRate: s.status === 'healthy' ? 0.001 : s.status === 'degraded' ? 0.01 : 0.05,
          latencyP50: Math.random() * 30 + 10,
          latencyP90: Math.random() * 80 + 30,
          latencyP99: Math.random() * 200 + 100,
          requestRate: Math.random() * 1000 + 500,
          throughput: Math.random() * 10000 + 5000,
        },
        sla: {
          target: { availability: 99.9, responseTime: 200, errorRate: 0.01 },
          current: { availability: s.status === 'healthy' ? 99.99 : s.status === 'degraded' ? 99.5 : 98.0, responseTime: Math.random() * 100 + 50, errorRate: s.status === 'healthy' ? 0.001 : 0.02 },
          period: 'monthly',
          breaches: s.status !== 'healthy' ? [{ timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), metric: 'availability', target: 99.9, actual: s.status === 'degraded' ? 99.5 : 98.0, duration: 3600 }] : [],
        },
        incidents: s.status !== 'healthy' ? [
          { id: `incident-${idx}-1`, title: `${s.name} Degraded Performance`, severity: s.status === 'unhealthy' ? 'critical' : 'warning', status: 'investigating', startedAt: new Date(Date.now() - 30 * 60 * 1000), impact: 'Service experiencing issues' },
        ] : [],
        maintenance: [],
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          lastHealthyAt: s.status === 'healthy' ? new Date() : new Date(Date.now() - 2 * 60 * 60 * 1000),
          lastUnhealthyAt: s.status !== 'healthy' ? new Date() : undefined,
        },
      };
      this.services.set(service.id, service);
    });

    // Initialize Dashboard
    const dashboard: HealthDashboard = {
      id: 'dashboard-0001',
      name: 'System Health Overview',
      description: 'Main health monitoring dashboard',
      widgets: [
        { id: 'widget-1', type: 'status', title: 'Overall System Status', position: { x: 0, y: 0, width: 4, height: 2 }, configuration: { source: 'all' } },
        { id: 'widget-2', type: 'metric', title: 'Availability', position: { x: 4, y: 0, width: 2, height: 1 }, configuration: { source: 'all', metric: 'availability' } },
        { id: 'widget-3', type: 'metric', title: 'Response Time P99', position: { x: 6, y: 0, width: 2, height: 1 }, configuration: { source: 'all', metric: 'p99_latency' } },
        { id: 'widget-4', type: 'chart', title: 'Response Time Trend', position: { x: 0, y: 2, width: 6, height: 2 }, configuration: { source: 'all', metric: 'response_time', timeRange: '24h' } },
        { id: 'widget-5', type: 'table', title: 'Service Status', position: { x: 6, y: 2, width: 6, height: 2 }, configuration: { source: 'services' } },
      ],
      layout: { columns: 12, rows: 4 },
      refreshInterval: 30,
      filters: { environments: ['production'], services: [], tags: [] },
      sharing: { public: true, publicUrl: 'https://status.rescueping.io/dashboard' },
      metadata: { createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date() },
    };
    this.dashboards.set(dashboard.id, dashboard);

    // Initialize Status Page
    const statusPage: StatusPage = {
      id: 'status-page-0001',
      name: 'RescuePing Status',
      description: 'Current system status and incidents',
      url: 'https://status.rescueping.io',
      status: 'degraded',
      components: servicesData.map((s, idx) => ({
        id: `component-${idx}`,
        name: s.name,
        description: `${s.name} service status`,
        status: s.status === 'healthy' ? 'operational' : s.status === 'degraded' ? 'degraded' : 'partial_outage',
        group: s.type === 'api' || s.type === 'gateway' || s.type === 'web' ? 'Services' : 'Infrastructure',
        order: idx,
        showOnStatusPage: true,
        linkedChecks: [],
      })),
      incidents: [
        {
          id: 'incident-001',
          title: 'Notification Service Degraded',
          status: 'investigating',
          impact: 'minor',
          components: ['component-3'],
          updates: [
            { id: 'update-1', status: 'investigating', message: 'We are investigating increased latency in the notification service.', timestamp: new Date(Date.now() - 30 * 60 * 1000), author: 'Platform Team' },
          ],
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
        },
      ],
      scheduledMaintenances: [],
      metrics: [
        { id: 'metric-1', name: 'Uptime', suffix: '%', tooltipDescription: 'Percentage uptime', displayType: 'month', data: Array.from({ length: 30 }, (_, i) => ({ timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), value: 99.5 + Math.random() * 0.5 })) },
      ],
      branding: { primaryColor: '#007bff' },
      notifications: { email: true, sms: false, webhook: true, rss: true },
      metadata: { createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), updatedAt: new Date(), lastIncident: new Date(Date.now() - 30 * 60 * 1000) },
    };
    this.statusPages.set(statusPage.id, statusPage);
  }

  // Check Operations
  public getChecks(status?: HealthStatus, type?: CheckType): HealthCheck[] {
    let checks = Array.from(this.checks.values());
    if (status) checks = checks.filter((c) => c.status === status);
    if (type) checks = checks.filter((c) => c.type === type);
    return checks;
  }

  public getCheckById(id: string): HealthCheck | undefined {
    return this.checks.get(id);
  }

  public runCheck(id: string): HealthCheck {
    const check = this.checks.get(id);
    if (!check) throw new Error('Health check not found');
    check.metadata.lastCheckedAt = new Date();
    check.metadata.nextCheckAt = new Date(Date.now() + (check.schedule.interval || 30000));
    this.emit('check.executed', check);
    return check;
  }

  // Endpoint Operations
  public getEndpoints(): HealthEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  public getEndpointById(id: string): HealthEndpoint | undefined {
    return this.endpoints.get(id);
  }

  // Service Operations
  public getServices(status?: HealthStatus): ServiceHealth[] {
    let services = Array.from(this.services.values());
    if (status) services = services.filter((s) => s.status === status);
    return services;
  }

  public getServiceById(id: string): ServiceHealth | undefined {
    return this.services.get(id);
  }

  // Dashboard Operations
  public getDashboards(): HealthDashboard[] {
    return Array.from(this.dashboards.values());
  }

  public getDashboardById(id: string): HealthDashboard | undefined {
    return this.dashboards.get(id);
  }

  // Status Page Operations
  public getStatusPages(): StatusPage[] {
    return Array.from(this.statusPages.values());
  }

  public getStatusPageById(id: string): StatusPage | undefined {
    return this.statusPages.get(id);
  }

  // Statistics
  public getStatistics(): HealthStatistics {
    const checks = Array.from(this.checks.values());
    const services = Array.from(this.services.values());
    const byType: Record<CheckType, number> = {} as Record<CheckType, number>;
    const byStatus: Record<HealthStatus, number> = {} as Record<HealthStatus, number>;
    const byEnvironment: Record<string, { total: number; healthy: number; unhealthy: number }> = {};

    checks.forEach((c) => {
      byType[c.type] = (byType[c.type] || 0) + 1;
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      const env = c.target.environment;
      if (!byEnvironment[env]) byEnvironment[env] = { total: 0, healthy: 0, unhealthy: 0 };
      byEnvironment[env].total++;
      if (c.status === 'healthy') byEnvironment[env].healthy++;
      if (c.status === 'unhealthy') byEnvironment[env].unhealthy++;
    });

    const healthyChecks = checks.filter((c) => c.status === 'healthy').length;
    const unhealthyChecks = checks.filter((c) => c.status === 'unhealthy').length;
    const overallHealth: HealthStatus = unhealthyChecks > 0 ? 'unhealthy' : checks.some((c) => c.status === 'degraded') ? 'degraded' : 'healthy';

    return {
      overview: {
        totalChecks: checks.length,
        activeChecks: checks.filter((c) => c.metadata.enabled).length,
        healthyChecks,
        unhealthyChecks,
        degradedChecks: checks.filter((c) => c.status === 'degraded').length,
        overallHealth,
      },
      byType,
      byStatus,
      byEnvironment,
      performance: {
        averageResponseTime: checks.reduce((sum, c) => sum + c.metrics.averageResponseTime, 0) / checks.length,
        p50ResponseTime: checks.reduce((sum, c) => sum + c.metrics.p50ResponseTime, 0) / checks.length,
        p90ResponseTime: checks.reduce((sum, c) => sum + c.metrics.p90ResponseTime, 0) / checks.length,
        p99ResponseTime: checks.reduce((sum, c) => sum + c.metrics.p99ResponseTime, 0) / checks.length,
        slowestChecks: checks.sort((a, b) => b.metrics.averageResponseTime - a.metrics.averageResponseTime).slice(0, 5).map((c) => ({ name: c.name, responseTime: c.metrics.averageResponseTime })),
      },
      availability: {
        overall: checks.reduce((sum, c) => sum + c.metrics.availability, 0) / checks.length,
        last24h: 99.5,
        last7d: 99.8,
        last30d: 99.9,
        byService: Object.fromEntries(services.map((s) => [s.name, s.metrics.availability])),
      },
      incidents: {
        total: services.reduce((sum, s) => sum + s.incidents.length, 0),
        open: services.reduce((sum, s) => sum + s.incidents.filter((i) => i.status !== 'resolved').length, 0),
        mttr: services.reduce((sum, s) => sum + s.metrics.mttr, 0) / services.length,
        byService: Object.fromEntries(services.map((s) => [s.name, s.incidents.length])),
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

export const healthCheckService = HealthCheckService.getInstance();
export type {
  HealthStatus,
  CheckType,
  CheckResult,
  SeverityLevel,
  HealthCheck,
  CheckTarget,
  CheckConfiguration,
  CheckSchedule,
  CheckThresholds,
  AlertConfiguration,
  AlertChannel,
  CheckHistory,
  CheckMetrics,
  HealthEndpoint,
  ServiceHealth,
  InstanceHealth,
  DependencyHealth,
  ServiceMetrics,
  SLAConfiguration,
  IncidentInfo,
  MaintenanceWindow,
  HealthDashboard,
  DashboardWidget,
  HealthReport,
  StatusPage,
  StatusComponent,
  StatusIncident,
  StatusMaintenance,
  StatusMetrics,
  HealthStatistics,
};
