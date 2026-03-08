/**
 * Log Aggregation Service
 * Comprehensive centralized log collection, parsing, indexing, and analysis
 */

// Log level
type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Log source type
type LogSourceType = 'application' | 'system' | 'container' | 'network' | 'security' | 'database' | 'audit';

// Parser type
type ParserType = 'json' | 'regex' | 'grok' | 'csv' | 'syslog' | 'custom';

// Pipeline status
type PipelineStatus = 'active' | 'paused' | 'error' | 'stopped' | 'starting';

// Alert severity
type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Log Entry
interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  source: {
    type: LogSourceType;
    name: string;
    host: string;
    service?: string;
    container?: string;
    pod?: string;
    namespace?: string;
  };
  message: string;
  fields: Record<string, unknown>;
  trace?: {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
  };
  context?: {
    userId?: string;
    requestId?: string;
    sessionId?: string;
    environment?: string;
    version?: string;
  };
  parsed: {
    success: boolean;
    parser: string;
    extractedFields: Record<string, unknown>;
  };
  metadata: {
    receivedAt: Date;
    indexedAt: Date;
    pipeline: string;
    size: number;
  };
}

// Log Source
interface LogSource {
  id: string;
  name: string;
  description: string;
  type: LogSourceType;
  status: 'active' | 'inactive' | 'error';
  connection: {
    type: 'file' | 'tcp' | 'udp' | 'http' | 'kafka' | 's3' | 'cloudwatch';
    config: Record<string, unknown>;
  };
  collection: {
    enabled: boolean;
    interval?: number;
    batchSize?: number;
    startPosition?: 'beginning' | 'end' | 'timestamp';
  };
  parsing: {
    parser: ParserType;
    pattern?: string;
    timestampField?: string;
    timestampFormat?: string;
    multiline?: {
      enabled: boolean;
      pattern: string;
      negate: boolean;
    };
  };
  enrichment: {
    enabled: boolean;
    rules: EnrichmentRule[];
  };
  filtering: {
    include?: string[];
    exclude?: string[];
    sampleRate?: number;
  };
  metrics: {
    eventsReceived: number;
    bytesReceived: number;
    eventsPerSecond: number;
    errors: number;
    lastEvent?: Date;
  };
  health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    lastCheck: Date;
    issues: string[];
  };
  tags: Record<string, string>;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Enrichment Rule
interface EnrichmentRule {
  id: string;
  name: string;
  type: 'geoip' | 'dns' | 'lookup' | 'compute' | 'add_field' | 'remove_field';
  condition?: string;
  config: Record<string, unknown>;
  enabled: boolean;
}

// Log Pipeline
interface LogPipeline {
  id: string;
  name: string;
  description: string;
  status: PipelineStatus;
  sources: string[];
  stages: PipelineStage[];
  destinations: string[];
  routing: {
    rules: RoutingRule[];
    defaultDestination: string;
  };
  performance: {
    throughput: number;
    latency: number;
    queueSize: number;
    backpressure: number;
  };
  errors: {
    total: number;
    parseErrors: number;
    deliveryErrors: number;
    lastError?: { timestamp: Date; message: string };
  };
  metrics: {
    eventsProcessed: number;
    bytesProcessed: number;
    eventsDropped: number;
    eventsPerSecond: number;
  };
  config: {
    bufferSize: number;
    workers: number;
    batchSize: number;
    flushInterval: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Pipeline Stage
interface PipelineStage {
  id: string;
  name: string;
  type: 'parse' | 'filter' | 'transform' | 'enrich' | 'aggregate' | 'sample';
  order: number;
  config: Record<string, unknown>;
  enabled: boolean;
  metrics: {
    inputEvents: number;
    outputEvents: number;
    droppedEvents: number;
    processingTime: number;
  };
}

// Routing Rule
interface RoutingRule {
  id: string;
  name: string;
  condition: string;
  destination: string;
  priority: number;
  enabled: boolean;
}

// Log Destination
interface LogDestination {
  id: string;
  name: string;
  description: string;
  type: 'elasticsearch' | 's3' | 'kafka' | 'splunk' | 'datadog' | 'cloudwatch' | 'file';
  status: 'active' | 'inactive' | 'error';
  connection: {
    config: Record<string, unknown>;
    credentials?: string;
  };
  settings: {
    indexPattern?: string;
    rotation?: 'daily' | 'weekly' | 'monthly' | 'size';
    retention?: number;
    compression?: boolean;
    encryption?: boolean;
  };
  batching: {
    enabled: boolean;
    maxSize: number;
    maxWait: number;
  };
  retry: {
    enabled: boolean;
    maxRetries: number;
    backoff: string;
  };
  metrics: {
    eventsDelivered: number;
    bytesDelivered: number;
    eventsPerSecond: number;
    avgLatency: number;
    errors: number;
  };
  health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    lastCheck: Date;
    lastSuccess?: Date;
    issues: string[];
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Log Index
interface LogIndex {
  id: string;
  name: string;
  pattern: string;
  status: 'open' | 'closed' | 'archived';
  settings: {
    shards: number;
    replicas: number;
    refreshInterval: string;
    maxDocsPerShard: number;
  };
  mapping: {
    dynamic: boolean;
    fields: { name: string; type: string; index: boolean }[];
  };
  lifecycle: {
    policy: string;
    phase: 'hot' | 'warm' | 'cold' | 'delete';
    rollover: { maxAge: string; maxSize: string; maxDocs: number };
  };
  statistics: {
    docsCount: number;
    docsDeleted: number;
    storeSize: number;
    primarySize: number;
    indexingRate: number;
    searchRate: number;
  };
  health: {
    status: 'green' | 'yellow' | 'red';
    relocatingShards: number;
    initializingShards: number;
    unassignedShards: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Log Query
interface LogQuery {
  id: string;
  name: string;
  description?: string;
  query: {
    text: string;
    type: 'lucene' | 'kql' | 'sql';
    filters: QueryFilter[];
    timeRange: {
      from: Date;
      to: Date;
      timezone: string;
    };
    aggregations?: QueryAggregation[];
  };
  results?: {
    totalHits: number;
    took: number;
    logs: LogEntry[];
    aggregations?: Record<string, unknown>;
  };
  savedQuery?: {
    isPublic: boolean;
    tags: string[];
    lastRun?: Date;
    runCount: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Query Filter
interface QueryFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'exists' | 'not_exists' | 'range' | 'in' | 'not_in';
  value: unknown;
  enabled: boolean;
}

// Query Aggregation
interface QueryAggregation {
  name: string;
  type: 'terms' | 'histogram' | 'date_histogram' | 'sum' | 'avg' | 'min' | 'max' | 'cardinality' | 'percentiles';
  field: string;
  config: Record<string, unknown>;
  subAggregations?: QueryAggregation[];
}

// Log Alert
interface LogAlert {
  id: string;
  name: string;
  description: string;
  status: 'enabled' | 'disabled' | 'muted';
  severity: AlertSeverity;
  condition: {
    query: string;
    threshold: {
      type: 'above' | 'below' | 'equals' | 'not_equals';
      value: number;
      field?: string;
    };
    timeWindow: number;
    groupBy?: string[];
  };
  schedule: {
    interval: number;
    timezone: string;
  };
  actions: AlertAction[];
  notifications: {
    channels: string[];
    throttle: number;
    escalation?: {
      after: number;
      channels: string[];
    };
  };
  state: {
    status: 'ok' | 'alerting' | 'no_data' | 'error';
    lastCheck: Date;
    lastAlert?: Date;
    alertCount: number;
  };
  history: {
    timestamp: Date;
    status: string;
    matchCount: number;
    message?: string;
  }[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Alert Action
interface AlertAction {
  id: string;
  type: 'email' | 'slack' | 'pagerduty' | 'webhook' | 'opsgenie' | 'script';
  config: Record<string, unknown>;
  template?: string;
  enabled: boolean;
}

// Log Dashboard
interface LogDashboard {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
  layout: {
    type: 'grid' | 'freeform';
    columns: number;
  };
  panels: DashboardPanel[];
  variables: {
    name: string;
    type: 'query' | 'custom' | 'interval' | 'datasource';
    current: string;
    options: string[];
  }[];
  timeRange: {
    from: string;
    to: string;
    timezone: string;
  };
  refreshInterval?: number;
  sharing: {
    isPublic: boolean;
    viewers: string[];
    editors: string[];
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    views: number;
  };
}

// Dashboard Panel
interface DashboardPanel {
  id: string;
  title: string;
  type: 'log_stream' | 'bar_chart' | 'line_chart' | 'pie_chart' | 'table' | 'metric' | 'heatmap' | 'map';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  query: {
    text: string;
    filters: QueryFilter[];
    aggregation?: QueryAggregation;
  };
  visualization: {
    config: Record<string, unknown>;
    thresholds?: { value: number; color: string }[];
  };
  drilldown?: {
    enabled: boolean;
    query: string;
    dashboard?: string;
  };
}

// Log Pattern
interface LogPattern {
  id: string;
  pattern: string;
  signature: string;
  count: number;
  percentage: number;
  level: LogLevel;
  samples: string[];
  firstSeen: Date;
  lastSeen: Date;
  trend: 'increasing' | 'decreasing' | 'stable';
  anomaly: boolean;
  metadata: {
    extractedFields: string[];
    category?: string;
  };
}

// Aggregation Metrics
interface AggregationMetrics {
  period: {
    start: Date;
    end: Date;
    granularity: string;
  };
  overview: {
    totalEvents: number;
    totalBytes: number;
    eventsPerSecond: number;
    bytesPerSecond: number;
    sources: number;
  };
  byLevel: {
    level: LogLevel;
    count: number;
    percentage: number;
  }[];
  bySource: {
    source: string;
    count: number;
    percentage: number;
    bytes: number;
  }[];
  byHost: {
    host: string;
    count: number;
    errors: number;
  }[];
  errors: {
    total: number;
    rate: number;
    topMessages: { message: string; count: number }[];
  };
  performance: {
    avgLatency: number;
    p95Latency: number;
    p99Latency: number;
    throughput: number;
  };
  trends: {
    timestamp: string;
    events: number;
    errors: number;
    latency: number;
  }[];
}

class LogAggregationService {
  private static instance: LogAggregationService;
  private logEntries: Map<string, LogEntry> = new Map();
  private sources: Map<string, LogSource> = new Map();
  private pipelines: Map<string, LogPipeline> = new Map();
  private destinations: Map<string, LogDestination> = new Map();
  private indices: Map<string, LogIndex> = new Map();
  private queries: Map<string, LogQuery> = new Map();
  private alerts: Map<string, LogAlert> = new Map();
  private dashboards: Map<string, LogDashboard> = new Map();
  private patterns: Map<string, LogPattern> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): LogAggregationService {
    if (!LogAggregationService.instance) {
      LogAggregationService.instance = new LogAggregationService();
    }
    return LogAggregationService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize Log Sources
    const sourcesData = [
      { name: 'API Gateway Logs', type: 'application', connection: 'kafka' },
      { name: 'Kubernetes Pods', type: 'container', connection: 'tcp' },
      { name: 'System Logs', type: 'system', connection: 'file' },
      { name: 'Security Audit', type: 'security', connection: 'http' },
      { name: 'Database Logs', type: 'database', connection: 'tcp' },
      { name: 'Network Firewall', type: 'network', connection: 'udp' },
    ];

    sourcesData.forEach((s, idx) => {
      const source: LogSource = {
        id: `source-${(idx + 1).toString().padStart(4, '0')}`,
        name: s.name,
        description: `Log source for ${s.name.toLowerCase()}`,
        type: s.type as LogSourceType,
        status: idx < 5 ? 'active' : 'error',
        connection: {
          type: s.connection as LogSource['connection']['type'],
          config: {
            host: `log-collector-${idx + 1}.rescueping.internal`,
            port: 5514 + idx,
            ssl: true,
          },
        },
        collection: {
          enabled: true,
          interval: 1000,
          batchSize: 1000,
          startPosition: 'end',
        },
        parsing: {
          parser: idx % 2 === 0 ? 'json' : 'grok',
          pattern: idx % 2 !== 0 ? '%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}' : undefined,
          timestampField: 'timestamp',
          timestampFormat: 'ISO8601',
        },
        enrichment: {
          enabled: true,
          rules: [
            { id: `enrich-${idx}-1`, name: 'GeoIP', type: 'geoip', config: { field: 'client_ip' }, enabled: true },
            { id: `enrich-${idx}-2`, name: 'Add environment', type: 'add_field', config: { field: 'environment', value: 'production' }, enabled: true },
          ],
        },
        filtering: {
          exclude: ['health_check', 'ping'],
          sampleRate: 1.0,
        },
        metrics: {
          eventsReceived: Math.floor(Math.random() * 100000000) + 10000000,
          bytesReceived: Math.floor(Math.random() * 500000000000) + 50000000000,
          eventsPerSecond: Math.floor(Math.random() * 5000) + 500,
          errors: Math.floor(Math.random() * 100),
          lastEvent: new Date(),
        },
        health: {
          status: idx < 5 ? 'healthy' : 'unhealthy',
          lastCheck: new Date(),
          issues: idx >= 5 ? ['Connection timeout to collector'] : [],
        },
        tags: {
          environment: 'production',
          team: ['platform', 'security', 'data'][idx % 3],
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.sources.set(source.id, source);
    });

    // Initialize Pipelines
    const pipelineNames = ['Production Logs', 'Security Events', 'Metrics Pipeline', 'Error Tracking'];
    pipelineNames.forEach((name, idx) => {
      const pipeline: LogPipeline = {
        id: `pipeline-${(idx + 1).toString().padStart(4, '0')}`,
        name,
        description: `Pipeline for ${name.toLowerCase()}`,
        status: idx < 3 ? 'active' : 'paused',
        sources: [`source-${(idx + 1).toString().padStart(4, '0')}`],
        stages: [
          { id: `stage-${idx}-1`, name: 'Parse', type: 'parse', order: 1, config: { parser: 'json' }, enabled: true, metrics: { inputEvents: 1000000, outputEvents: 999000, droppedEvents: 1000, processingTime: 5 } },
          { id: `stage-${idx}-2`, name: 'Filter', type: 'filter', order: 2, config: { exclude: ['debug'] }, enabled: true, metrics: { inputEvents: 999000, outputEvents: 900000, droppedEvents: 99000, processingTime: 2 } },
          { id: `stage-${idx}-3`, name: 'Enrich', type: 'enrich', order: 3, config: { rules: ['geoip', 'dns'] }, enabled: true, metrics: { inputEvents: 900000, outputEvents: 900000, droppedEvents: 0, processingTime: 10 } },
          { id: `stage-${idx}-4`, name: 'Transform', type: 'transform', order: 4, config: { mapping: {} }, enabled: true, metrics: { inputEvents: 900000, outputEvents: 900000, droppedEvents: 0, processingTime: 3 } },
        ],
        destinations: [`dest-${(idx + 1).toString().padStart(4, '0')}`],
        routing: {
          rules: [
            { id: `route-${idx}-1`, name: 'Errors to dedicated', condition: 'level:error', destination: 'dest-errors', priority: 1, enabled: true },
          ],
          defaultDestination: `dest-${(idx + 1).toString().padStart(4, '0')}`,
        },
        performance: {
          throughput: Math.floor(Math.random() * 10000) + 1000,
          latency: Math.floor(Math.random() * 100) + 10,
          queueSize: Math.floor(Math.random() * 10000),
          backpressure: Math.random() * 20,
        },
        errors: {
          total: Math.floor(Math.random() * 100),
          parseErrors: Math.floor(Math.random() * 50),
          deliveryErrors: Math.floor(Math.random() * 50),
          lastError: idx === 3 ? { timestamp: new Date(), message: 'Destination unreachable' } : undefined,
        },
        metrics: {
          eventsProcessed: Math.floor(Math.random() * 1000000000),
          bytesProcessed: Math.floor(Math.random() * 10000000000000),
          eventsDropped: Math.floor(Math.random() * 1000000),
          eventsPerSecond: Math.floor(Math.random() * 10000) + 1000,
        },
        config: {
          bufferSize: 10000,
          workers: 8,
          batchSize: 1000,
          flushInterval: 5000,
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.pipelines.set(pipeline.id, pipeline);
    });

    // Initialize Destinations
    const destTypes = ['elasticsearch', 's3', 'kafka', 'datadog'];
    destTypes.forEach((type, idx) => {
      const dest: LogDestination = {
        id: `dest-${(idx + 1).toString().padStart(4, '0')}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Storage`,
        description: `Log storage on ${type}`,
        type: type as LogDestination['type'],
        status: idx < 3 ? 'active' : 'error',
        connection: {
          config: {
            endpoint: `${type}.rescueping.internal`,
            index: 'logs-*',
          },
        },
        settings: {
          indexPattern: type === 'elasticsearch' ? 'logs-{yyyy.MM.dd}' : undefined,
          rotation: 'daily',
          retention: 90,
          compression: true,
          encryption: true,
        },
        batching: {
          enabled: true,
          maxSize: 5000,
          maxWait: 5000,
        },
        retry: {
          enabled: true,
          maxRetries: 3,
          backoff: 'exponential',
        },
        metrics: {
          eventsDelivered: Math.floor(Math.random() * 1000000000),
          bytesDelivered: Math.floor(Math.random() * 10000000000000),
          eventsPerSecond: Math.floor(Math.random() * 10000) + 1000,
          avgLatency: Math.floor(Math.random() * 50) + 10,
          errors: Math.floor(Math.random() * 100),
        },
        health: {
          status: idx < 3 ? 'healthy' : 'unhealthy',
          lastCheck: new Date(),
          lastSuccess: idx < 3 ? new Date() : new Date(Date.now() - 300000),
          issues: idx >= 3 ? ['Connection timeout'] : [],
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.destinations.set(dest.id, dest);
    });

    // Initialize Indices
    for (let i = 0; i < 10; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0].replace(/-/g, '.');
      const index: LogIndex = {
        id: `index-logs-${dateStr}`,
        name: `logs-${dateStr}`,
        pattern: 'logs-*',
        status: i < 7 ? 'open' : 'closed',
        settings: {
          shards: 5,
          replicas: 1,
          refreshInterval: '1s',
          maxDocsPerShard: 100000000,
        },
        mapping: {
          dynamic: true,
          fields: [
            { name: 'timestamp', type: 'date', index: true },
            { name: 'level', type: 'keyword', index: true },
            { name: 'message', type: 'text', index: true },
            { name: 'host', type: 'keyword', index: true },
            { name: 'service', type: 'keyword', index: true },
          ],
        },
        lifecycle: {
          policy: 'logs-lifecycle',
          phase: i < 3 ? 'hot' : i < 7 ? 'warm' : 'cold',
          rollover: { maxAge: '1d', maxSize: '50gb', maxDocs: 100000000 },
        },
        statistics: {
          docsCount: Math.floor(Math.random() * 100000000) + 10000000,
          docsDeleted: Math.floor(Math.random() * 100000),
          storeSize: Math.floor(Math.random() * 50000000000) + 5000000000,
          primarySize: Math.floor(Math.random() * 25000000000) + 2500000000,
          indexingRate: i < 3 ? Math.floor(Math.random() * 10000) + 1000 : 0,
          searchRate: Math.floor(Math.random() * 100) + 10,
        },
        health: {
          status: i < 8 ? 'green' : 'yellow',
          relocatingShards: 0,
          initializingShards: 0,
          unassignedShards: i >= 8 ? 1 : 0,
        },
        metadata: {
          createdAt: date,
          updatedAt: new Date(),
        },
      };
      this.indices.set(index.id, index);
    }

    // Initialize sample Log Entries
    const services = ['api-gateway', 'user-service', 'alert-service', 'notification-service'];
    const levels: LogLevel[] = ['info', 'warn', 'error', 'debug'];
    for (let i = 0; i < 100; i++) {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const entry: LogEntry = {
        id: `log-${Date.now()}-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        level,
        source: {
          type: 'application',
          name: services[i % 4],
          host: `pod-${services[i % 4]}-${Math.floor(Math.random() * 5) + 1}`,
          service: services[i % 4],
          namespace: 'production',
        },
        message: level === 'error' ? `Error processing request: ${['Connection timeout', 'Invalid input', 'Database error'][i % 3]}` : `Request processed successfully in ${Math.floor(Math.random() * 100) + 10}ms`,
        fields: {
          request_id: `req-${Math.random().toString(36).substr(2, 9)}`,
          user_id: `user-${Math.floor(Math.random() * 1000) + 1}`,
          duration_ms: Math.floor(Math.random() * 500) + 10,
          status_code: level === 'error' ? 500 : 200,
        },
        trace: {
          traceId: Math.random().toString(36).substr(2, 32),
          spanId: Math.random().toString(36).substr(2, 16),
        },
        context: {
          environment: 'production',
          version: '2.1.0',
        },
        parsed: {
          success: true,
          parser: 'json',
          extractedFields: {},
        },
        metadata: {
          receivedAt: new Date(),
          indexedAt: new Date(),
          pipeline: 'pipeline-0001',
          size: Math.floor(Math.random() * 1000) + 100,
        },
      };
      this.logEntries.set(entry.id, entry);
    }

    // Initialize Alerts
    const alertConfigs = [
      { name: 'High Error Rate', query: 'level:error', threshold: 100 },
      { name: 'Database Connection Errors', query: 'message:"database" AND level:error', threshold: 10 },
      { name: 'Slow Response Times', query: 'duration_ms:>1000', threshold: 50 },
      { name: 'Authentication Failures', query: 'message:"auth failed"', threshold: 20 },
      { name: 'Service Unavailable', query: 'status_code:503', threshold: 5 },
    ];

    alertConfigs.forEach((a, idx) => {
      const alert: LogAlert = {
        id: `alert-${(idx + 1).toString().padStart(4, '0')}`,
        name: a.name,
        description: `Alert for ${a.name.toLowerCase()}`,
        status: 'enabled',
        severity: ['critical', 'high', 'medium'][idx % 3] as AlertSeverity,
        condition: {
          query: a.query,
          threshold: { type: 'above', value: a.threshold },
          timeWindow: 300,
        },
        schedule: {
          interval: 60,
          timezone: 'Asia/Kolkata',
        },
        actions: [
          { id: `action-${idx}-1`, type: 'slack', config: { channel: '#alerts' }, enabled: true },
          { id: `action-${idx}-2`, type: 'pagerduty', config: { serviceKey: 'xxx' }, enabled: idx < 2 },
        ],
        notifications: {
          channels: ['slack', 'email'],
          throttle: 300,
          escalation: idx < 2 ? { after: 600, channels: ['pagerduty'] } : undefined,
        },
        state: {
          status: idx === 0 ? 'alerting' : 'ok',
          lastCheck: new Date(),
          lastAlert: idx === 0 ? new Date(Date.now() - 300000) : undefined,
          alertCount: idx === 0 ? 5 : 0,
        },
        history: [],
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.alerts.set(alert.id, alert);
    });

    // Initialize Dashboards
    const dashboardNames = ['Operations Overview', 'Error Analysis', 'Security Audit', 'Performance Metrics'];
    dashboardNames.forEach((name, idx) => {
      const dashboard: LogDashboard = {
        id: `dashboard-${(idx + 1).toString().padStart(4, '0')}`,
        name,
        description: `Dashboard for ${name.toLowerCase()}`,
        status: 'active',
        layout: { type: 'grid', columns: 12 },
        panels: [
          { id: `panel-${idx}-1`, title: 'Log Volume', type: 'line_chart', position: { x: 0, y: 0, width: 6, height: 4 }, query: { text: '*', filters: [] }, visualization: { config: {} } },
          { id: `panel-${idx}-2`, title: 'Error Distribution', type: 'pie_chart', position: { x: 6, y: 0, width: 6, height: 4 }, query: { text: 'level:error', filters: [] }, visualization: { config: {} } },
          { id: `panel-${idx}-3`, title: 'Recent Logs', type: 'log_stream', position: { x: 0, y: 4, width: 12, height: 6 }, query: { text: '*', filters: [] }, visualization: { config: { columns: ['timestamp', 'level', 'message'] } } },
        ],
        variables: [
          { name: 'service', type: 'query', current: 'all', options: ['all', 'api-gateway', 'user-service'] },
          { name: 'level', type: 'custom', current: 'all', options: ['all', 'error', 'warn', 'info'] },
        ],
        timeRange: { from: 'now-1h', to: 'now', timezone: 'Asia/Kolkata' },
        refreshInterval: 30,
        sharing: { isPublic: false, viewers: [], editors: [] },
        metadata: {
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          views: Math.floor(Math.random() * 1000) + 100,
        },
      };
      this.dashboards.set(dashboard.id, dashboard);
    });

    // Initialize Patterns
    const patternSamples = [
      { pattern: 'Request processed in <duration>ms', signature: 'REQ_SUCCESS', level: 'info' },
      { pattern: 'Connection timeout to <service>', signature: 'CONN_TIMEOUT', level: 'error' },
      { pattern: 'User <user_id> logged in from <ip>', signature: 'USER_LOGIN', level: 'info' },
      { pattern: 'Database query took <duration>ms', signature: 'DB_QUERY', level: 'warn' },
      { pattern: 'Memory usage at <percent>%', signature: 'MEM_USAGE', level: 'warn' },
    ];

    patternSamples.forEach((p, idx) => {
      const pattern: LogPattern = {
        id: `pattern-${(idx + 1).toString().padStart(4, '0')}`,
        pattern: p.pattern,
        signature: p.signature,
        count: Math.floor(Math.random() * 1000000) + 10000,
        percentage: Math.random() * 30 + 5,
        level: p.level as LogLevel,
        samples: [`Sample 1: ${p.pattern.replace('<duration>', '45').replace('<service>', 'database')}`, `Sample 2: ${p.pattern.replace('<duration>', '120').replace('<service>', 'cache')}`],
        firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastSeen: new Date(),
        trend: ['increasing', 'decreasing', 'stable'][idx % 3] as LogPattern['trend'],
        anomaly: idx === 1,
        metadata: {
          extractedFields: ['duration', 'service', 'user_id', 'ip'].slice(0, idx + 1),
          category: ['performance', 'connectivity', 'security'][idx % 3],
        },
      };
      this.patterns.set(pattern.id, pattern);
    });
  }

  /**
   * Get Log Sources
   */
  public getSources(filter?: { type?: LogSourceType; status?: LogSource['status'] }): LogSource[] {
    let sources = Array.from(this.sources.values());
    if (filter?.type) sources = sources.filter((s) => s.type === filter.type);
    if (filter?.status) sources = sources.filter((s) => s.status === filter.status);
    return sources;
  }

  /**
   * Get Pipelines
   */
  public getPipelines(filter?: { status?: PipelineStatus }): LogPipeline[] {
    let pipelines = Array.from(this.pipelines.values());
    if (filter?.status) pipelines = pipelines.filter((p) => p.status === filter.status);
    return pipelines;
  }

  /**
   * Get Destinations
   */
  public getDestinations(filter?: { type?: LogDestination['type']; status?: LogDestination['status'] }): LogDestination[] {
    let destinations = Array.from(this.destinations.values());
    if (filter?.type) destinations = destinations.filter((d) => d.type === filter.type);
    if (filter?.status) destinations = destinations.filter((d) => d.status === filter.status);
    return destinations;
  }

  /**
   * Get Indices
   */
  public getIndices(filter?: { status?: LogIndex['status'] }): LogIndex[] {
    let indices = Array.from(this.indices.values());
    if (filter?.status) indices = indices.filter((i) => i.status === filter.status);
    return indices.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  /**
   * Get Log Entries
   */
  public getLogs(filter?: { level?: LogLevel; source?: string; limit?: number }): LogEntry[] {
    let logs = Array.from(this.logEntries.values());
    if (filter?.level) logs = logs.filter((l) => l.level === filter.level);
    if (filter?.source) logs = logs.filter((l) => l.source.name === filter.source);
    logs = logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (filter?.limit) logs = logs.slice(0, filter.limit);
    return logs;
  }

  /**
   * Get Alerts
   */
  public getAlerts(filter?: { status?: LogAlert['status']; severity?: AlertSeverity }): LogAlert[] {
    let alerts = Array.from(this.alerts.values());
    if (filter?.status) alerts = alerts.filter((a) => a.status === filter.status);
    if (filter?.severity) alerts = alerts.filter((a) => a.severity === filter.severity);
    return alerts;
  }

  /**
   * Get Dashboards
   */
  public getDashboards(): LogDashboard[] {
    return Array.from(this.dashboards.values());
  }

  /**
   * Get Patterns
   */
  public getPatterns(filter?: { anomaly?: boolean; limit?: number }): LogPattern[] {
    let patterns = Array.from(this.patterns.values());
    if (filter?.anomaly !== undefined) patterns = patterns.filter((p) => p.anomaly === filter.anomaly);
    patterns = patterns.sort((a, b) => b.count - a.count);
    if (filter?.limit) patterns = patterns.slice(0, filter.limit);
    return patterns;
  }

  /**
   * Get Metrics
   */
  public getMetrics(): AggregationMetrics {
    const sources = Array.from(this.sources.values());
    const logs = Array.from(this.logEntries.values());
    const totalEvents = sources.reduce((sum, s) => sum + s.metrics.eventsReceived, 0);
    const totalBytes = sources.reduce((sum, s) => sum + s.metrics.bytesReceived, 0);

    const levelCounts = logs.reduce((acc, l) => {
      acc[l.level] = (acc[l.level] || 0) + 1;
      return acc;
    }, {} as Record<LogLevel, number>);

    return {
      period: { start: new Date(Date.now() - 3600000), end: new Date(), granularity: '1m' },
      overview: {
        totalEvents,
        totalBytes,
        eventsPerSecond: sources.reduce((sum, s) => sum + s.metrics.eventsPerSecond, 0),
        bytesPerSecond: totalBytes / 3600,
        sources: sources.filter((s) => s.status === 'active').length,
      },
      byLevel: Object.entries(levelCounts).map(([level, count]) => ({
        level: level as LogLevel,
        count,
        percentage: (count / logs.length) * 100,
      })),
      bySource: sources.map((s) => ({
        source: s.name,
        count: s.metrics.eventsReceived,
        percentage: (s.metrics.eventsReceived / totalEvents) * 100,
        bytes: s.metrics.bytesReceived,
      })),
      byHost: [],
      errors: {
        total: logs.filter((l) => l.level === 'error').length,
        rate: (logs.filter((l) => l.level === 'error').length / logs.length) * 100,
        topMessages: [],
      },
      performance: {
        avgLatency: 25,
        p95Latency: 100,
        p99Latency: 250,
        throughput: sources.reduce((sum, s) => sum + s.metrics.eventsPerSecond, 0),
      },
      trends: [],
    };
  }

  /**
   * Subscribe to events
   */
  public subscribe(callback: (event: string, data: unknown) => void): () => void {
    this.eventListeners.push(callback);
    return () => {
      const index = this.eventListeners.indexOf(callback);
      if (index > -1) this.eventListeners.splice(index, 1);
    };
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    this.eventListeners.forEach((callback) => callback(event, data));
  }
}

export const logAggregationService = LogAggregationService.getInstance();
export type {
  LogLevel,
  LogSourceType,
  ParserType,
  PipelineStatus,
  AlertSeverity,
  LogEntry,
  LogSource,
  EnrichmentRule,
  LogPipeline,
  PipelineStage,
  RoutingRule,
  LogDestination,
  LogIndex,
  LogQuery,
  QueryFilter,
  QueryAggregation,
  LogAlert,
  AlertAction,
  LogDashboard,
  DashboardPanel,
  LogPattern,
  AggregationMetrics,
};
