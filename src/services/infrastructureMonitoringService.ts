/**
 * Infrastructure Monitoring Service
 * System health monitoring, alerting, resource utilization tracking, and infrastructure observability
 */

// Alert severity
type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Alert status
type AlertStatus = 'firing' | 'pending' | 'resolved' | 'acknowledged' | 'silenced';

// Metric type
type MetricType = 'gauge' | 'counter' | 'histogram' | 'summary';

// Resource type
type ResourceType = 'server' | 'container' | 'database' | 'network' | 'storage' | 'application' | 'service';

// Health status
type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

// Check type
type CheckType = 'http' | 'tcp' | 'dns' | 'ping' | 'script' | 'ssl' | 'grpc';

// Infrastructure resource
interface InfraResource {
  id: string;
  name: string;
  type: ResourceType;
  provider: 'aws' | 'gcp' | 'azure' | 'on_premise' | 'kubernetes';
  region: string;
  zone?: string;
  status: HealthStatus;
  tags: Record<string, string>;
  metadata: {
    instanceType?: string;
    os?: string;
    version?: string;
    ipAddress?: string;
    hostname?: string;
  };
  dependencies: string[];
  metrics: ResourceMetrics;
  lastSeen: Date;
  createdAt: Date;
}

// Resource metrics
interface ResourceMetrics {
  cpu: {
    usage: number;
    cores: number;
    loadAvg: number[];
  };
  memory: {
    used: number;
    total: number;
    usagePercent: number;
    cached?: number;
    buffers?: number;
  };
  disk: {
    used: number;
    total: number;
    usagePercent: number;
    readOps?: number;
    writeOps?: number;
    readBytes?: number;
    writeBytes?: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    errors: number;
    dropped: number;
  };
  custom?: Record<string, number>;
  timestamp: Date;
}

// Metric definition
interface MetricDefinition {
  id: string;
  name: string;
  description: string;
  type: MetricType;
  unit: string;
  labels: string[];
  aggregations: ('avg' | 'sum' | 'min' | 'max' | 'count' | 'p50' | 'p95' | 'p99')[];
  retentionDays: number;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    owner: string;
  };
}

// Metric data point
interface MetricDataPoint {
  timestamp: Date;
  value: number;
  labels: Record<string, string>;
}

// Time series
interface TimeSeries {
  metric: string;
  labels: Record<string, string>;
  dataPoints: MetricDataPoint[];
  aggregations?: {
    avg: number;
    sum: number;
    min: number;
    max: number;
    count: number;
  };
}

// Alert rule
interface AlertRule {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  enabled: boolean;
  condition: {
    metric: string;
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
    threshold: number;
    duration: number;
    aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count';
  };
  labels: Record<string, string>;
  annotations: {
    summary: string;
    description: string;
    runbook?: string;
  };
  notifications: {
    channels: string[];
    repeatInterval?: number;
    groupWait?: number;
    groupInterval?: number;
  };
  silenceWindows?: {
    start: string;
    end: string;
    days?: number[];
  }[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    evaluationCount: number;
    firingCount: number;
  };
}

// Alert instance
interface AlertInstance {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: AlertSeverity;
  status: AlertStatus;
  labels: Record<string, string>;
  annotations: {
    summary: string;
    description: string;
    value?: string;
  };
  startsAt: Date;
  endsAt?: Date;
  updatedAt: Date;
  fingerprint: string;
  generatorURL?: string;
  acknowledgement?: {
    acknowledgedBy: string;
    acknowledgedAt: Date;
    comment?: string;
  };
  silence?: {
    silencedBy: string;
    silencedAt: Date;
    silencedUntil: Date;
    reason?: string;
  };
}

// Health check
interface HealthCheck {
  id: string;
  name: string;
  type: CheckType;
  target: string;
  enabled: boolean;
  interval: number;
  timeout: number;
  retries: number;
  config: {
    method?: string;
    path?: string;
    port?: number;
    expectedStatus?: number;
    expectedBody?: string;
    headers?: Record<string, string>;
    script?: string;
  };
  regions: string[];
  status: HealthStatus;
  lastCheck: Date;
  results: CheckResult[];
  statistics: {
    uptime: number;
    avgResponseTime: number;
    checksTotal: number;
    checksSuccessful: number;
    checksFailed: number;
  };
  notifications: {
    enabled: boolean;
    channels: string[];
    threshold: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Check result
interface CheckResult {
  id: string;
  checkId: string;
  timestamp: Date;
  region: string;
  status: 'success' | 'failure' | 'timeout';
  responseTime: number;
  statusCode?: number;
  body?: string;
  error?: string;
  certificate?: {
    issuer: string;
    validFrom: Date;
    validUntil: Date;
    daysRemaining: number;
  };
}

// Dashboard
interface Dashboard {
  id: string;
  name: string;
  description: string;
  folder?: string;
  panels: DashboardPanel[];
  variables: {
    name: string;
    type: 'query' | 'custom' | 'interval' | 'datasource';
    values: string[];
    selected: string;
  }[];
  timeRange: {
    from: string;
    to: string;
  };
  refreshInterval: number;
  permissions: {
    users: { id: string; permission: 'view' | 'edit' | 'admin' }[];
    teams: { id: string; permission: 'view' | 'edit' | 'admin' }[];
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    version: number;
  };
}

// Dashboard panel
interface DashboardPanel {
  id: string;
  title: string;
  type: 'graph' | 'stat' | 'gauge' | 'table' | 'heatmap' | 'logs' | 'alert_list' | 'text';
  gridPos: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  queries: {
    datasource: string;
    query: string;
    legend?: string;
  }[];
  options: {
    legend?: { show: boolean; placement: string };
    tooltip?: { mode: string };
    thresholds?: { value: number; color: string }[];
  };
  fieldConfig?: {
    defaults: {
      unit?: string;
      min?: number;
      max?: number;
      decimals?: number;
      color?: { mode: string; fixedColor?: string };
    };
  };
}

// Notification channel
interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'slack' | 'pagerduty' | 'webhook' | 'teams' | 'opsgenie' | 'telegram';
  enabled: boolean;
  config: Record<string, string>;
  sendResolved: boolean;
  templates?: {
    title?: string;
    body?: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    lastNotification?: Date;
    notificationCount: number;
  };
}

// Incident
interface MonitoringIncident {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'closed';
  alerts: string[];
  resources: string[];
  timeline: {
    timestamp: Date;
    event: string;
    actor: string;
    details?: string;
  }[];
  assignees: string[];
  impact: {
    affectedServices: string[];
    affectedUsers?: number;
    downtime?: number;
  };
  resolution?: {
    summary: string;
    rootCause?: string;
    preventiveMeasures?: string;
    resolvedAt: Date;
    resolvedBy: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// SLI (Service Level Indicator)
interface SLI {
  id: string;
  name: string;
  description: string;
  type: 'availability' | 'latency' | 'throughput' | 'error_rate' | 'saturation';
  specification: {
    metric: string;
    goodQuery: string;
    totalQuery: string;
  };
  current: {
    value: number;
    period: string;
    windowStart: Date;
    windowEnd: Date;
  };
  history: {
    period: string;
    value: number;
    timestamp: Date;
  }[];
}

// SLO (Service Level Objective)
interface SLO {
  id: string;
  name: string;
  description: string;
  service: string;
  sli: string;
  target: number;
  window: {
    type: 'rolling' | 'calendar';
    period: '7d' | '28d' | '30d' | '90d';
  };
  status: {
    current: number;
    remaining: number;
    burnRate: number;
    errorBudget: {
      total: number;
      consumed: number;
      remaining: number;
      percentRemaining: number;
    };
  };
  alerts: {
    burnRateThreshold: number;
    channels: string[];
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Infrastructure monitoring metrics
interface InfraMetrics {
  overview: {
    totalResources: number;
    healthyResources: number;
    degradedResources: number;
    unhealthyResources: number;
  };
  alerts: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    firing: number;
    resolved: number;
  };
  uptime: {
    overall: number;
    byService: { service: string; uptime: number }[];
  };
  performance: {
    avgCpuUsage: number;
    avgMemoryUsage: number;
    avgDiskUsage: number;
    avgNetworkThroughput: number;
  };
  trends: {
    timestamp: Date;
    cpuUsage: number;
    memoryUsage: number;
    alertCount: number;
  }[];
}

class InfrastructureMonitoringService {
  private static instance: InfrastructureMonitoringService;
  private resources: Map<string, InfraResource> = new Map();
  private metrics: Map<string, MetricDefinition> = new Map();
  private timeSeries: Map<string, TimeSeries> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private alertInstances: Map<string, AlertInstance> = new Map();
  private healthChecks: Map<string, HealthCheck> = new Map();
  private dashboards: Map<string, Dashboard> = new Map();
  private notificationChannels: Map<string, NotificationChannel> = new Map();
  private incidents: Map<string, MonitoringIncident> = new Map();
  private slis: Map<string, SLI> = new Map();
  private slos: Map<string, SLO> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): InfrastructureMonitoringService {
    if (!InfrastructureMonitoringService.instance) {
      InfrastructureMonitoringService.instance = new InfrastructureMonitoringService();
    }
    return InfrastructureMonitoringService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize resources
    const resourcesData = [
      { name: 'api-server-1', type: 'server', region: 'ap-south-1', zone: 'ap-south-1a' },
      { name: 'api-server-2', type: 'server', region: 'ap-south-1', zone: 'ap-south-1b' },
      { name: 'api-server-3', type: 'server', region: 'ap-south-1', zone: 'ap-south-1c' },
      { name: 'db-primary', type: 'database', region: 'ap-south-1', zone: 'ap-south-1a' },
      { name: 'db-replica', type: 'database', region: 'ap-south-1', zone: 'ap-south-1b' },
      { name: 'redis-cluster', type: 'database', region: 'ap-south-1', zone: 'ap-south-1a' },
      { name: 'load-balancer', type: 'network', region: 'ap-south-1', zone: null },
      { name: 'cdn-edge', type: 'network', region: 'global', zone: null },
      { name: 'storage-primary', type: 'storage', region: 'ap-south-1', zone: 'ap-south-1a' },
      { name: 'api-gateway-pod-1', type: 'container', region: 'ap-south-1', zone: 'ap-south-1a' },
      { name: 'api-gateway-pod-2', type: 'container', region: 'ap-south-1', zone: 'ap-south-1b' },
      { name: 'alert-service-pod-1', type: 'container', region: 'ap-south-1', zone: 'ap-south-1a' },
    ];

    resourcesData.forEach((r, idx) => {
      const resource: InfraResource = {
        id: `resource-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name,
        type: r.type as ResourceType,
        provider: r.type === 'container' ? 'kubernetes' : 'aws',
        region: r.region,
        zone: r.zone || undefined,
        status: idx < 10 ? 'healthy' : idx === 10 ? 'degraded' : 'unhealthy',
        tags: {
          environment: 'production',
          team: ['platform', 'backend', 'infrastructure'][idx % 3],
          service: ['api', 'database', 'cache', 'network'][idx % 4],
        },
        metadata: {
          instanceType: r.type === 'server' ? 'm5.xlarge' : undefined,
          os: r.type === 'server' ? 'Ubuntu 22.04' : undefined,
          version: '1.0.0',
          ipAddress: `10.0.${idx}.100`,
          hostname: r.name,
        },
        dependencies: idx > 0 ? [`resource-${idx.toString().padStart(4, '0')}`] : [],
        metrics: {
          cpu: {
            usage: Math.random() * 70 + 10,
            cores: r.type === 'server' ? 4 : 2,
            loadAvg: [Math.random() * 2, Math.random() * 2, Math.random() * 2],
          },
          memory: {
            used: Math.random() * 12 + 2,
            total: 16,
            usagePercent: Math.random() * 70 + 20,
            cached: Math.random() * 2,
            buffers: Math.random() * 0.5,
          },
          disk: {
            used: Math.random() * 80 + 10,
            total: 100,
            usagePercent: Math.random() * 60 + 20,
            readOps: Math.floor(Math.random() * 1000),
            writeOps: Math.floor(Math.random() * 500),
          },
          network: {
            bytesIn: Math.floor(Math.random() * 100000000),
            bytesOut: Math.floor(Math.random() * 50000000),
            packetsIn: Math.floor(Math.random() * 100000),
            packetsOut: Math.floor(Math.random() * 50000),
            errors: Math.floor(Math.random() * 10),
            dropped: Math.floor(Math.random() * 5),
          },
          timestamp: new Date(),
        },
        lastSeen: new Date(),
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      };
      this.resources.set(resource.id, resource);
    });

    // Initialize metric definitions
    const metricsData = [
      { name: 'cpu_usage_percent', type: 'gauge', unit: 'percent' },
      { name: 'memory_usage_bytes', type: 'gauge', unit: 'bytes' },
      { name: 'disk_usage_percent', type: 'gauge', unit: 'percent' },
      { name: 'network_bytes_total', type: 'counter', unit: 'bytes' },
      { name: 'http_requests_total', type: 'counter', unit: 'requests' },
      { name: 'http_request_duration_seconds', type: 'histogram', unit: 'seconds' },
      { name: 'error_rate', type: 'gauge', unit: 'percent' },
    ];

    metricsData.forEach((m, idx) => {
      const metric: MetricDefinition = {
        id: `metric-${idx + 1}`,
        name: m.name,
        description: `${m.name.replace(/_/g, ' ')} metric`,
        type: m.type as MetricType,
        unit: m.unit,
        labels: ['instance', 'job', 'environment'],
        aggregations: ['avg', 'sum', 'min', 'max', 'count', 'p95'],
        retentionDays: 30,
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          owner: 'monitoring-team',
        },
      };
      this.metrics.set(metric.id, metric);
    });

    // Initialize alert rules
    const alertRulesData = [
      { name: 'High CPU Usage', metric: 'cpu_usage_percent', operator: '>', threshold: 80, severity: 'high' },
      { name: 'High Memory Usage', metric: 'memory_usage_bytes', operator: '>', threshold: 90, severity: 'high' },
      { name: 'Disk Space Low', metric: 'disk_usage_percent', operator: '>', threshold: 85, severity: 'critical' },
      { name: 'High Error Rate', metric: 'error_rate', operator: '>', threshold: 5, severity: 'critical' },
      { name: 'High Latency', metric: 'http_request_duration_seconds', operator: '>', threshold: 2, severity: 'medium' },
      { name: 'Service Down', metric: 'up', operator: '==', threshold: 0, severity: 'critical' },
    ];

    alertRulesData.forEach((ar, idx) => {
      const rule: AlertRule = {
        id: `rule-${(idx + 1).toString().padStart(4, '0')}`,
        name: ar.name,
        description: `Alert when ${ar.metric} ${ar.operator} ${ar.threshold}`,
        severity: ar.severity as AlertSeverity,
        enabled: true,
        condition: {
          metric: ar.metric,
          operator: ar.operator as AlertRule['condition']['operator'],
          threshold: ar.threshold,
          duration: 300,
          aggregation: 'avg',
        },
        labels: { team: 'sre', environment: 'production' },
        annotations: {
          summary: `${ar.name} detected`,
          description: `${ar.metric} has exceeded threshold of ${ar.threshold}`,
          runbook: `https://runbooks.rescueping.com/alerts/${ar.name.toLowerCase().replace(/ /g, '-')}`,
        },
        notifications: {
          channels: ['slack-alerts', 'pagerduty'],
          repeatInterval: 3600000,
          groupWait: 30000,
          groupInterval: 300000,
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          evaluationCount: Math.floor(Math.random() * 10000) + 1000,
          firingCount: Math.floor(Math.random() * 100) + 10,
        },
      };
      this.alertRules.set(rule.id, rule);
    });

    // Initialize alert instances
    const alertStatuses: AlertStatus[] = ['firing', 'firing', 'resolved', 'acknowledged', 'pending'];
    for (let i = 0; i < 20; i++) {
      const ruleIdx = i % 6;
      const rule = Array.from(this.alertRules.values())[ruleIdx];
      const status = alertStatuses[i % 5];

      const alert: AlertInstance = {
        id: `alert-${(i + 1).toString().padStart(6, '0')}`,
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        status,
        labels: { ...rule.labels, instance: `resource-${((i % 12) + 1).toString().padStart(4, '0')}` },
        annotations: {
          summary: rule.annotations.summary,
          description: rule.annotations.description,
          value: `${Math.random() * 100 + rule.condition.threshold}`,
        },
        startsAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        endsAt: status === 'resolved' ? new Date() : undefined,
        updatedAt: new Date(),
        fingerprint: this.generateFingerprint(),
        acknowledgement: status === 'acknowledged' ? {
          acknowledgedBy: 'sre-engineer',
          acknowledgedAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
          comment: 'Investigating the issue',
        } : undefined,
      };
      this.alertInstances.set(alert.id, alert);
    }

    // Initialize health checks
    const healthChecksData = [
      { name: 'API Gateway Health', type: 'http', target: 'https://api.rescueping.com/health' },
      { name: 'Web App Health', type: 'http', target: 'https://rescueping.com' },
      { name: 'Database Health', type: 'tcp', target: 'db.rescueping.internal:5432' },
      { name: 'Redis Health', type: 'tcp', target: 'redis.rescueping.internal:6379' },
      { name: 'SSL Certificate', type: 'ssl', target: 'rescueping.com:443' },
      { name: 'DNS Resolution', type: 'dns', target: 'rescueping.com' },
    ];

    healthChecksData.forEach((hc, idx) => {
      const check: HealthCheck = {
        id: `check-${(idx + 1).toString().padStart(4, '0')}`,
        name: hc.name,
        type: hc.type as CheckType,
        target: hc.target,
        enabled: true,
        interval: 60000,
        timeout: 10000,
        retries: 3,
        config: {
          method: hc.type === 'http' ? 'GET' : undefined,
          path: hc.type === 'http' ? '/health' : undefined,
          expectedStatus: hc.type === 'http' ? 200 : undefined,
        },
        regions: ['ap-south-1', 'us-east-1', 'eu-west-1'],
        status: idx < 5 ? 'healthy' : 'degraded',
        lastCheck: new Date(),
        results: [],
        statistics: {
          uptime: 99.9 + Math.random() * 0.09,
          avgResponseTime: Math.random() * 200 + 50,
          checksTotal: Math.floor(Math.random() * 10000) + 1000,
          checksSuccessful: Math.floor(Math.random() * 9900) + 990,
          checksFailed: Math.floor(Math.random() * 100),
        },
        notifications: {
          enabled: true,
          channels: ['slack-alerts'],
          threshold: 3,
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };

      // Add check results
      for (let r = 0; r < 10; r++) {
        check.results.push({
          id: `result-${check.id}-${r}`,
          checkId: check.id,
          timestamp: new Date(Date.now() - r * 60000),
          region: check.regions[r % 3],
          status: r < 9 ? 'success' : 'failure',
          responseTime: Math.random() * 200 + 50,
          statusCode: hc.type === 'http' ? (r < 9 ? 200 : 500) : undefined,
          error: r >= 9 ? 'Connection timeout' : undefined,
        });
      }

      this.healthChecks.set(check.id, check);
    });

    // Initialize notification channels
    const channelsData = [
      { name: 'slack-alerts', type: 'slack' },
      { name: 'pagerduty', type: 'pagerduty' },
      { name: 'email-team', type: 'email' },
      { name: 'webhook-integration', type: 'webhook' },
    ];

    channelsData.forEach((ch, idx) => {
      const channel: NotificationChannel = {
        id: `channel-${idx + 1}`,
        name: ch.name,
        type: ch.type as NotificationChannel['type'],
        enabled: true,
        config: {
          url: ch.type === 'slack' ? 'https://hooks.slack.com/services/xxx' :
               ch.type === 'webhook' ? 'https://webhooks.rescueping.com/alerts' : '',
          email: ch.type === 'email' ? 'alerts@rescueping.com' : '',
        },
        sendResolved: true,
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          lastNotification: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
          notificationCount: Math.floor(Math.random() * 1000) + 100,
        },
      };
      this.notificationChannels.set(channel.id, channel);
    });

    // Initialize dashboards
    const dashboardsData = [
      { name: 'Infrastructure Overview', folder: 'Infrastructure' },
      { name: 'Application Performance', folder: 'Applications' },
      { name: 'Database Metrics', folder: 'Databases' },
      { name: 'Network Traffic', folder: 'Network' },
    ];

    dashboardsData.forEach((d, idx) => {
      const dashboard: Dashboard = {
        id: `dashboard-${idx + 1}`,
        name: d.name,
        description: `${d.name} monitoring dashboard`,
        folder: d.folder,
        panels: [
          {
            id: `panel-${idx}-1`,
            title: 'CPU Usage',
            type: 'graph',
            gridPos: { x: 0, y: 0, w: 12, h: 8 },
            queries: [{ datasource: 'prometheus', query: 'avg(cpu_usage_percent)', legend: 'CPU %' }],
            options: { legend: { show: true, placement: 'bottom' } },
          },
          {
            id: `panel-${idx}-2`,
            title: 'Memory Usage',
            type: 'gauge',
            gridPos: { x: 12, y: 0, w: 6, h: 8 },
            queries: [{ datasource: 'prometheus', query: 'avg(memory_usage_percent)', legend: 'Memory %' }],
            options: { thresholds: [{ value: 60, color: 'yellow' }, { value: 80, color: 'red' }] },
          },
          {
            id: `panel-${idx}-3`,
            title: 'Active Alerts',
            type: 'stat',
            gridPos: { x: 18, y: 0, w: 6, h: 8 },
            queries: [{ datasource: 'alertmanager', query: 'count(alerts{state="firing"})' }],
            options: {},
          },
        ],
        variables: [
          { name: 'environment', type: 'custom', values: ['production', 'staging'], selected: 'production' },
          { name: 'interval', type: 'interval', values: ['1m', '5m', '15m', '1h'], selected: '5m' },
        ],
        timeRange: { from: 'now-6h', to: 'now' },
        refreshInterval: 30000,
        permissions: {
          users: [],
          teams: [{ id: 'team-sre', permission: 'admin' }],
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          updatedBy: 'admin',
          version: 5,
        },
      };
      this.dashboards.set(dashboard.id, dashboard);
    });

    // Initialize SLIs and SLOs
    const sliData = [
      { name: 'API Availability', type: 'availability', target: 99.9 },
      { name: 'API Latency P95', type: 'latency', target: 99 },
      { name: 'Error Rate', type: 'error_rate', target: 99.5 },
    ];

    sliData.forEach((s, idx) => {
      const sli: SLI = {
        id: `sli-${idx + 1}`,
        name: s.name,
        description: `SLI for ${s.name}`,
        type: s.type as SLI['type'],
        specification: {
          metric: s.type === 'availability' ? 'up' : s.type === 'latency' ? 'http_request_duration_seconds' : 'error_rate',
          goodQuery: `sum(rate(http_requests_total{status=~"2.."}[5m]))`,
          totalQuery: `sum(rate(http_requests_total[5m]))`,
        },
        current: {
          value: s.target - Math.random() * 0.5,
          period: '30d',
          windowStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          windowEnd: new Date(),
        },
        history: [],
      };
      this.slis.set(sli.id, sli);

      const slo: SLO = {
        id: `slo-${idx + 1}`,
        name: `${s.name} SLO`,
        description: `SLO for ${s.name}`,
        service: 'api-gateway',
        sli: sli.id,
        target: s.target,
        window: { type: 'rolling', period: '30d' },
        status: {
          current: s.target - Math.random() * 0.3,
          remaining: s.target - Math.random() * 0.1,
          burnRate: Math.random() * 2,
          errorBudget: {
            total: (100 - s.target) * 30 * 24 * 60,
            consumed: Math.random() * (100 - s.target) * 15 * 24 * 60,
            remaining: Math.random() * (100 - s.target) * 15 * 24 * 60,
            percentRemaining: 50 + Math.random() * 40,
          },
        },
        alerts: {
          burnRateThreshold: 2,
          channels: ['slack-alerts', 'pagerduty'],
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'sre-team',
          updatedAt: new Date(),
        },
      };
      this.slos.set(slo.id, slo);
    });

    // Initialize incidents
    for (let i = 0; i < 5; i++) {
      const incident: MonitoringIncident = {
        id: `incident-${(i + 1).toString().padStart(4, '0')}`,
        title: [`API Latency Spike`, `Database Connection Issues`, `High Error Rate`, `Service Degradation`, `Network Outage`][i],
        description: `Incident affecting production services`,
        severity: ['critical', 'high', 'medium', 'high', 'critical'][i] as AlertSeverity,
        status: ['resolved', 'resolved', 'resolved', 'investigating', 'open'][i] as MonitoringIncident['status'],
        alerts: [`alert-${((i * 3) + 1).toString().padStart(6, '0')}`],
        resources: [`resource-${((i % 12) + 1).toString().padStart(4, '0')}`],
        timeline: [
          { timestamp: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000), event: 'Incident created', actor: 'system' },
          { timestamp: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000 + 300000), event: 'Investigation started', actor: 'sre-engineer' },
        ],
        assignees: ['sre-engineer', 'platform-lead'],
        impact: {
          affectedServices: ['api-gateway', 'web-frontend'],
          affectedUsers: Math.floor(Math.random() * 10000) + 1000,
          downtime: i < 3 ? Math.floor(Math.random() * 60) + 5 : undefined,
        },
        resolution: i < 3 ? {
          summary: 'Issue resolved by scaling up resources',
          rootCause: 'Insufficient capacity during traffic spike',
          preventiveMeasures: 'Implemented auto-scaling policies',
          resolvedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          resolvedBy: 'sre-engineer',
        } : undefined,
        metadata: {
          createdAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
          createdBy: 'system',
          updatedAt: new Date(),
        },
      };
      this.incidents.set(incident.id, incident);
    }
  }

  /**
   * Generate fingerprint
   */
  private generateFingerprint(): string {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  /**
   * Get resources
   */
  public getResources(filter?: {
    type?: ResourceType;
    status?: HealthStatus;
    region?: string;
  }): InfraResource[] {
    let resources = Array.from(this.resources.values());
    if (filter?.type) resources = resources.filter((r) => r.type === filter.type);
    if (filter?.status) resources = resources.filter((r) => r.status === filter.status);
    if (filter?.region) resources = resources.filter((r) => r.region === filter.region);
    return resources;
  }

  /**
   * Get resource
   */
  public getResource(id: string): InfraResource | undefined {
    return this.resources.get(id);
  }

  /**
   * Get alert rules
   */
  public getAlertRules(filter?: { severity?: AlertSeverity; enabled?: boolean }): AlertRule[] {
    let rules = Array.from(this.alertRules.values());
    if (filter?.severity) rules = rules.filter((r) => r.severity === filter.severity);
    if (filter?.enabled !== undefined) rules = rules.filter((r) => r.enabled === filter.enabled);
    return rules;
  }

  /**
   * Get alert instances
   */
  public getAlertInstances(filter?: {
    status?: AlertStatus[];
    severity?: AlertSeverity[];
    limit?: number;
  }): AlertInstance[] {
    let alerts = Array.from(this.alertInstances.values());
    if (filter?.status?.length) alerts = alerts.filter((a) => filter.status!.includes(a.status));
    if (filter?.severity?.length) alerts = alerts.filter((a) => filter.severity!.includes(a.severity));
    alerts = alerts.sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
    if (filter?.limit) alerts = alerts.slice(0, filter.limit);
    return alerts;
  }

  /**
   * Acknowledge alert
   */
  public acknowledgeAlert(alertId: string, acknowledgedBy: string, comment?: string): void {
    const alert = this.alertInstances.get(alertId);
    if (!alert) throw new Error('Alert not found');

    alert.status = 'acknowledged';
    alert.acknowledgement = {
      acknowledgedBy,
      acknowledgedAt: new Date(),
      comment,
    };
    alert.updatedAt = new Date();

    this.emit('alert_acknowledged', alert);
  }

  /**
   * Get health checks
   */
  public getHealthChecks(filter?: { status?: HealthStatus; type?: CheckType }): HealthCheck[] {
    let checks = Array.from(this.healthChecks.values());
    if (filter?.status) checks = checks.filter((c) => c.status === filter.status);
    if (filter?.type) checks = checks.filter((c) => c.type === filter.type);
    return checks;
  }

  /**
   * Get dashboards
   */
  public getDashboards(): Dashboard[] {
    return Array.from(this.dashboards.values());
  }

  /**
   * Get dashboard
   */
  public getDashboard(id: string): Dashboard | undefined {
    return this.dashboards.get(id);
  }

  /**
   * Get incidents
   */
  public getIncidents(filter?: { status?: MonitoringIncident['status']; severity?: AlertSeverity }): MonitoringIncident[] {
    let incidents = Array.from(this.incidents.values());
    if (filter?.status) incidents = incidents.filter((i) => i.status === filter.status);
    if (filter?.severity) incidents = incidents.filter((i) => i.severity === filter.severity);
    return incidents.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  /**
   * Get SLOs
   */
  public getSLOs(): SLO[] {
    return Array.from(this.slos.values());
  }

  /**
   * Get metrics overview
   */
  public getMetrics(): InfraMetrics {
    const resources = Array.from(this.resources.values());
    const alerts = Array.from(this.alertInstances.values());

    return {
      overview: {
        totalResources: resources.length,
        healthyResources: resources.filter((r) => r.status === 'healthy').length,
        degradedResources: resources.filter((r) => r.status === 'degraded').length,
        unhealthyResources: resources.filter((r) => r.status === 'unhealthy').length,
      },
      alerts: {
        total: alerts.length,
        critical: alerts.filter((a) => a.severity === 'critical').length,
        high: alerts.filter((a) => a.severity === 'high').length,
        medium: alerts.filter((a) => a.severity === 'medium').length,
        low: alerts.filter((a) => a.severity === 'low').length,
        firing: alerts.filter((a) => a.status === 'firing').length,
        resolved: alerts.filter((a) => a.status === 'resolved').length,
      },
      uptime: {
        overall: 99.95,
        byService: [
          { service: 'api-gateway', uptime: 99.99 },
          { service: 'web-frontend', uptime: 99.97 },
          { service: 'database', uptime: 99.99 },
        ],
      },
      performance: {
        avgCpuUsage: resources.reduce((sum, r) => sum + r.metrics.cpu.usage, 0) / resources.length,
        avgMemoryUsage: resources.reduce((sum, r) => sum + r.metrics.memory.usagePercent, 0) / resources.length,
        avgDiskUsage: resources.reduce((sum, r) => sum + r.metrics.disk.usagePercent, 0) / resources.length,
        avgNetworkThroughput: resources.reduce((sum, r) => sum + r.metrics.network.bytesIn + r.metrics.network.bytesOut, 0) / resources.length,
      },
      trends: [],
    };
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

export const infrastructureMonitoringService = InfrastructureMonitoringService.getInstance();
export type {
  AlertSeverity,
  AlertStatus,
  MetricType,
  ResourceType,
  HealthStatus,
  CheckType,
  InfraResource,
  ResourceMetrics,
  MetricDefinition,
  MetricDataPoint,
  TimeSeries,
  AlertRule,
  AlertInstance,
  HealthCheck,
  CheckResult,
  Dashboard,
  DashboardPanel,
  NotificationChannel,
  MonitoringIncident,
  SLI,
  SLO,
  InfraMetrics,
};
