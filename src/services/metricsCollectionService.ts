/**
 * Metrics Collection Service
 * Comprehensive metrics collection, aggregation, and time-series management
 */

// Metric Type
type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary' | 'timer' | 'rate' | 'percentile';

// Aggregation Type
type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'p50' | 'p75' | 'p90' | 'p95' | 'p99' | 'stddev' | 'variance';

// Metric Status
type MetricStatus = 'active' | 'stale' | 'deprecated' | 'disabled';

// Time Unit
type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month';

// Metric Definition
interface MetricDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: MetricType;
  unit: string;
  namespace: string;
  subsystem?: string;
  labels: LabelDefinition[];
  help: string;
  buckets?: number[];
  objectives?: { quantile: number; error: number }[];
  status: MetricStatus;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    version: number;
  };
}

// Label Definition
interface LabelDefinition {
  name: string;
  description: string;
  required: boolean;
  allowedValues?: string[];
  defaultValue?: string;
  cardinality: 'low' | 'medium' | 'high' | 'unbounded';
}

// Metric Sample
interface MetricSample {
  id: string;
  metricId: string;
  timestamp: Date;
  value: number;
  labels: Record<string, string>;
  source: MetricSource;
  quality: SampleQuality;
}

// Metric Source
interface MetricSource {
  type: 'application' | 'infrastructure' | 'cloud' | 'custom' | 'synthetic';
  name: string;
  host: string;
  instance: string;
  job: string;
  environment: string;
  region?: string;
  cluster?: string;
  namespace?: string;
}

// Sample Quality
interface SampleQuality {
  precision: number;
  accuracy: number;
  completeness: boolean;
  timeliness: boolean;
  delayed: boolean;
  interpolated: boolean;
}

// Metric Series
interface MetricSeries {
  id: string;
  metricId: string;
  labels: Record<string, string>;
  fingerprint: string;
  samples: TimeSeriesPoint[];
  stats: SeriesStats;
  status: 'active' | 'stale' | 'archived';
  firstSeen: Date;
  lastSeen: Date;
  retentionPolicy?: string;
}

// Time Series Point
interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
  annotations?: string[];
}

// Series Stats
interface SeriesStats {
  sampleCount: number;
  min: number;
  max: number;
  avg: number;
  sum: number;
  stddev: number;
  lastValue: number;
  lastTimestamp: Date;
  changeRate: number;
}

// Scrape Target
interface ScrapeTarget {
  id: string;
  name: string;
  description: string;
  endpoint: ScrapeEndpoint;
  configuration: ScrapeConfiguration;
  labels: Record<string, string>;
  status: TargetStatus;
  health: TargetHealth;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    lastModified: Date;
  };
}

// Scrape Endpoint
interface ScrapeEndpoint {
  scheme: 'http' | 'https';
  host: string;
  port: number;
  path: string;
  params?: Record<string, string>;
  authentication?: {
    type: 'none' | 'basic' | 'bearer' | 'oauth2' | 'tls';
    credentials?: string;
    secretRef?: string;
  };
  tlsConfig?: {
    insecureSkipVerify: boolean;
    certFile?: string;
    keyFile?: string;
    caFile?: string;
  };
}

// Scrape Configuration
interface ScrapeConfiguration {
  scrapeInterval: number;
  scrapeTimeout: number;
  metricsPath: string;
  honorLabels: boolean;
  honorTimestamps: boolean;
  scheme: string;
  sampleLimit: number;
  labelLimit: number;
  labelNameLengthLimit: number;
  labelValueLengthLimit: number;
  bodyLimit: number;
  relabelConfigs?: RelabelConfig[];
  metricRelabelConfigs?: RelabelConfig[];
}

// Relabel Config
interface RelabelConfig {
  sourceLabels: string[];
  separator: string;
  targetLabel: string;
  regex: string;
  modulus?: number;
  replacement: string;
  action: 'replace' | 'keep' | 'drop' | 'hashmod' | 'labelmap' | 'labeldrop' | 'labelkeep';
}

// Target Status
interface TargetStatus {
  state: 'up' | 'down' | 'unknown';
  lastScrape: Date;
  lastScrapeDuration: number;
  lastScrapeError?: string;
  scrapeCount: number;
  scrapeSuccessCount: number;
  scrapeFailureCount: number;
  samplesScraped: number;
  samplesPostRelabel: number;
}

// Target Health
interface TargetHealth {
  healthy: boolean;
  consecutiveFailures: number;
  uptime: number;
  availability: number;
  latency: {
    avg: number;
    p50: number;
    p99: number;
  };
}

// Push Gateway
interface PushGateway {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  authentication?: {
    type: 'none' | 'basic' | 'bearer';
    credentials?: string;
  };
  configuration: PushConfiguration;
  groups: MetricGroup[];
  status: 'active' | 'inactive' | 'error';
  metrics: PushMetrics;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Push Configuration
interface PushConfiguration {
  pushInterval: number;
  pushTimeout: number;
  batchSize: number;
  retryAttempts: number;
  retryBackoff: number;
  compression: 'none' | 'gzip' | 'snappy';
  format: 'prometheus' | 'json' | 'influx' | 'carbon';
}

// Metric Group
interface MetricGroup {
  name: string;
  labels: Record<string, string>;
  metrics: GroupMetric[];
  lastPush: Date;
  pushCount: number;
}

// Group Metric
interface GroupMetric {
  name: string;
  type: MetricType;
  value: number;
  labels: Record<string, string>;
  timestamp?: Date;
}

// Push Metrics
interface PushMetrics {
  totalPushes: number;
  successfulPushes: number;
  failedPushes: number;
  metricsQueued: number;
  avgPushLatency: number;
  lastPush?: Date;
  lastError?: string;
}

// Aggregation Rule
interface AggregationRule {
  id: string;
  name: string;
  description: string;
  inputMetric: string;
  outputMetric: string;
  aggregation: AggregationType;
  window: {
    duration: number;
    unit: TimeUnit;
  };
  groupBy: string[];
  filters?: AggregationFilter[];
  schedule: string;
  status: 'active' | 'paused' | 'error';
  lastRun?: Date;
  nextRun?: Date;
  stats: {
    runsTotal: number;
    runsSuccessful: number;
    runsFailed: number;
    avgDuration: number;
    lastDuration?: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Aggregation Filter
interface AggregationFilter {
  label: string;
  operator: 'eq' | 'neq' | 'regex' | 'nregex' | 'in' | 'nin';
  value: string | string[];
}

// Recording Rule
interface RecordingRule {
  id: string;
  name: string;
  description: string;
  record: string;
  expr: string;
  labels: Record<string, string>;
  group: string;
  interval: number;
  status: 'active' | 'paused' | 'error';
  lastEvaluation?: Date;
  evaluationTime?: number;
  samples?: number;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Alert Rule
interface AlertRule {
  id: string;
  name: string;
  description: string;
  alert: string;
  expr: string;
  for: number;
  labels: Record<string, string>;
  annotations: {
    summary: string;
    description: string;
    runbook?: string;
  };
  severity: 'info' | 'warning' | 'critical';
  status: 'active' | 'paused' | 'firing' | 'pending';
  activeAlerts: ActiveAlert[];
  lastEvaluation?: Date;
  evaluationTime?: number;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Active Alert
interface ActiveAlert {
  id: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  state: 'pending' | 'firing' | 'resolved';
  activeAt: Date;
  value: number;
  firedAt?: Date;
  resolvedAt?: Date;
}

// Metric Query
interface MetricQuery {
  id: string;
  name: string;
  description: string;
  query: string;
  type: 'instant' | 'range';
  start?: Date;
  end?: Date;
  step?: number;
  timeout?: number;
  lookbackDelta?: number;
  deduplication?: boolean;
  maxSourceResolution?: number;
}

// Query Result
interface QueryResult {
  queryId: string;
  status: 'success' | 'error' | 'timeout';
  resultType: 'vector' | 'matrix' | 'scalar' | 'string';
  data: QueryResultData;
  warnings?: string[];
  executionTime: number;
  samplesProcessed: number;
  peakSamples: number;
}

// Query Result Data
interface QueryResultData {
  result: ResultItem[];
}

// Result Item
interface ResultItem {
  metric: Record<string, string>;
  value?: [number, string];
  values?: [number, string][];
}

// Dashboard
interface MetricsDashboard {
  id: string;
  name: string;
  description: string;
  uid: string;
  version: number;
  panels: DashboardPanel[];
  variables: DashboardVariable[];
  annotations: DashboardAnnotation[];
  timeRange: {
    from: string;
    to: string;
  };
  refresh?: string;
  tags: string[];
  folder?: string;
  sharing: {
    public: boolean;
    users: string[];
    teams: string[];
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
  };
}

// Dashboard Panel
interface DashboardPanel {
  id: number;
  title: string;
  type: 'graph' | 'stat' | 'gauge' | 'bargauge' | 'table' | 'heatmap' | 'histogram' | 'text' | 'alert-list';
  description?: string;
  targets: PanelTarget[];
  gridPos: { x: number; y: number; w: number; h: number };
  options: Record<string, unknown>;
  fieldConfig?: {
    defaults: Record<string, unknown>;
    overrides: Record<string, unknown>[];
  };
  transformations?: PanelTransformation[];
  links?: PanelLink[];
}

// Panel Target
interface PanelTarget {
  refId: string;
  expr: string;
  legendFormat?: string;
  interval?: string;
  instant?: boolean;
  range?: boolean;
  datasource?: string;
}

// Panel Transformation
interface PanelTransformation {
  id: string;
  options: Record<string, unknown>;
}

// Panel Link
interface PanelLink {
  title: string;
  url: string;
  targetBlank?: boolean;
}

// Dashboard Variable
interface DashboardVariable {
  name: string;
  label: string;
  type: 'query' | 'custom' | 'interval' | 'datasource' | 'constant';
  query?: string;
  options?: { text: string; value: string }[];
  current?: { text: string; value: string };
  multi?: boolean;
  includeAll?: boolean;
  refresh?: number;
  sort?: number;
}

// Dashboard Annotation
interface DashboardAnnotation {
  name: string;
  datasource: string;
  enable: boolean;
  expr?: string;
  iconColor: string;
  step?: string;
  tags?: string[];
}

// Storage Configuration
interface StorageConfiguration {
  id: string;
  name: string;
  type: 'local' | 's3' | 'gcs' | 'azure' | 'minio';
  retention: RetentionConfiguration;
  compaction: CompactionConfiguration;
  replication: ReplicationConfiguration;
  status: 'active' | 'readonly' | 'compacting' | 'error';
  stats: StorageStats;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Retention Configuration
interface RetentionConfiguration {
  rawRetention: number;
  resolutions: ResolutionRetention[];
  deletionDelay: number;
  blockDuration: number;
}

// Resolution Retention
interface ResolutionRetention {
  resolution: number;
  retention: number;
}

// Compaction Configuration
interface CompactionConfiguration {
  enabled: boolean;
  interval: number;
  maxBlockDuration: number;
  minBlockDuration: number;
  maxOpeningBlocks: number;
  concurrency: number;
}

// Replication Configuration
interface ReplicationConfiguration {
  enabled: boolean;
  factor: number;
  destinations: ReplicationDestination[];
}

// Replication Destination
interface ReplicationDestination {
  name: string;
  endpoint: string;
  status: 'active' | 'lagging' | 'error';
  lag: number;
}

// Storage Stats
interface StorageStats {
  totalSeries: number;
  totalSamples: number;
  totalBytes: number;
  numBlocks: number;
  oldestBlock: Date;
  newestBlock: Date;
  headSeries: number;
  headChunks: number;
  headSamples: number;
  walSegments: number;
  walBytes: number;
  compactionsTotal: number;
  compactionsFailed: number;
}

// Metrics Statistics
interface MetricsStatistics {
  overview: {
    totalMetrics: number;
    totalSeries: number;
    totalSamples: number;
    totalTargets: number;
    activeTargets: number;
    samplesPerSecond: number;
    seriesCreated: number;
    seriesDeleted: number;
  };
  byType: Record<MetricType, number>;
  byNamespace: Record<string, number>;
  bySource: Record<string, number>;
  scraping: {
    targetsUp: number;
    targetsDown: number;
    scrapeInterval: number;
    avgScrapeDuration: number;
    scrapeErrors: number;
  };
  storage: {
    totalBytes: number;
    compressedBytes: number;
    compressionRatio: number;
    blocksTotal: number;
    chunksTotal: number;
  };
  queries: {
    totalQueries: number;
    avgQueryDuration: number;
    slowQueries: number;
    failedQueries: number;
  };
}

class MetricsCollectionService {
  private static instance: MetricsCollectionService;
  private metrics: Map<string, MetricDefinition> = new Map();
  private samples: Map<string, MetricSample[]> = new Map();
  private series: Map<string, MetricSeries> = new Map();
  private targets: Map<string, ScrapeTarget> = new Map();
  private gateways: Map<string, PushGateway> = new Map();
  private aggregationRules: Map<string, AggregationRule> = new Map();
  private recordingRules: Map<string, RecordingRule> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private dashboards: Map<string, MetricsDashboard> = new Map();
  private storage: Map<string, StorageConfiguration> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): MetricsCollectionService {
    if (!MetricsCollectionService.instance) {
      MetricsCollectionService.instance = new MetricsCollectionService();
    }
    return MetricsCollectionService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Metric Definitions
    const metricsData = [
      { name: 'http_requests_total', type: 'counter' as MetricType, unit: 'requests', namespace: 'http', description: 'Total HTTP requests' },
      { name: 'http_request_duration_seconds', type: 'histogram' as MetricType, unit: 'seconds', namespace: 'http', description: 'HTTP request latency' },
      { name: 'http_requests_in_flight', type: 'gauge' as MetricType, unit: 'requests', namespace: 'http', description: 'In-flight requests' },
      { name: 'process_cpu_seconds_total', type: 'counter' as MetricType, unit: 'seconds', namespace: 'process', description: 'CPU usage' },
      { name: 'process_resident_memory_bytes', type: 'gauge' as MetricType, unit: 'bytes', namespace: 'process', description: 'Memory usage' },
      { name: 'go_goroutines', type: 'gauge' as MetricType, unit: 'goroutines', namespace: 'go', description: 'Number of goroutines' },
      { name: 'database_queries_total', type: 'counter' as MetricType, unit: 'queries', namespace: 'database', description: 'Total database queries' },
      { name: 'database_query_duration_seconds', type: 'histogram' as MetricType, unit: 'seconds', namespace: 'database', description: 'Query duration' },
      { name: 'cache_hits_total', type: 'counter' as MetricType, unit: 'hits', namespace: 'cache', description: 'Cache hits' },
      { name: 'cache_misses_total', type: 'counter' as MetricType, unit: 'misses', namespace: 'cache', description: 'Cache misses' },
    ];

    metricsData.forEach((m, idx) => {
      const metric: MetricDefinition = {
        id: `metric-${(idx + 1).toString().padStart(4, '0')}`,
        name: m.name,
        displayName: m.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        description: m.description,
        type: m.type,
        unit: m.unit,
        namespace: m.namespace,
        labels: [
          { name: 'job', description: 'Job name', required: true, cardinality: 'low' },
          { name: 'instance', description: 'Instance address', required: true, cardinality: 'medium' },
          { name: 'service', description: 'Service name', required: false, cardinality: 'low' },
        ],
        help: m.description,
        buckets: m.type === 'histogram' ? [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10] : undefined,
        objectives: m.type === 'summary' ? [{ quantile: 0.5, error: 0.05 }, { quantile: 0.9, error: 0.01 }, { quantile: 0.99, error: 0.001 }] : undefined,
        status: 'active',
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'system',
          updatedAt: new Date(),
          version: 1,
        },
      };
      this.metrics.set(metric.id, metric);

      // Generate samples for each metric
      const samples: MetricSample[] = [];
      for (let i = 0; i < 100; i++) {
        const sample: MetricSample = {
          id: `sample-${metric.id}-${i}`,
          metricId: metric.id,
          timestamp: new Date(Date.now() - i * 60000),
          value: m.type === 'counter' ? Math.floor(Math.random() * 10000) + (idx * 1000) : m.type === 'gauge' ? Math.random() * 100 : Math.random() * 5,
          labels: { job: 'rescueping', instance: `localhost:${9090 + idx}`, service: ['api', 'worker', 'scheduler'][idx % 3] },
          source: {
            type: 'application',
            name: 'rescueping',
            host: 'localhost',
            instance: `localhost:${9090 + idx}`,
            job: 'rescueping',
            environment: 'production',
            region: 'us-east-1',
          },
          quality: { precision: 0.99, accuracy: 0.99, completeness: true, timeliness: true, delayed: false, interpolated: false },
        };
        samples.push(sample);
      }
      this.samples.set(metric.id, samples);
    });

    // Initialize Scrape Targets
    const servicesForTargets = ['api-gateway', 'user-service', 'auth-service', 'payment-service', 'notification-service'];
    servicesForTargets.forEach((service, idx) => {
      const target: ScrapeTarget = {
        id: `target-${(idx + 1).toString().padStart(4, '0')}`,
        name: service,
        description: `${service} metrics endpoint`,
        endpoint: {
          scheme: 'http',
          host: `${service}.rescueping.svc.cluster.local`,
          port: 9090,
          path: '/metrics',
          authentication: { type: 'none' },
        },
        configuration: {
          scrapeInterval: 15,
          scrapeTimeout: 10,
          metricsPath: '/metrics',
          honorLabels: false,
          honorTimestamps: true,
          scheme: 'http',
          sampleLimit: 10000,
          labelLimit: 50,
          labelNameLengthLimit: 1024,
          labelValueLengthLimit: 4096,
          bodyLimit: 10485760,
        },
        labels: { job: 'rescueping', service, env: 'production' },
        status: {
          state: idx < 4 ? 'up' : 'down',
          lastScrape: new Date(),
          lastScrapeDuration: Math.random() * 0.5 + 0.1,
          lastScrapeError: idx === 4 ? 'connection refused' : undefined,
          scrapeCount: Math.floor(Math.random() * 100000) + 10000,
          scrapeSuccessCount: Math.floor(Math.random() * 99000) + 9900,
          scrapeFailureCount: Math.floor(Math.random() * 100),
          samplesScraped: Math.floor(Math.random() * 5000) + 500,
          samplesPostRelabel: Math.floor(Math.random() * 4500) + 450,
        },
        health: {
          healthy: idx < 4,
          consecutiveFailures: idx === 4 ? 5 : 0,
          uptime: idx < 4 ? 99.9 : 85.5,
          availability: idx < 4 ? 99.99 : 95.0,
          latency: { avg: Math.random() * 100 + 50, p50: Math.random() * 80 + 40, p99: Math.random() * 500 + 200 },
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          lastModified: new Date(),
        },
      };
      this.targets.set(target.id, target);
    });

    // Initialize Push Gateway
    const gateway: PushGateway = {
      id: 'gateway-0001',
      name: 'Default Push Gateway',
      description: 'Main push gateway for batch jobs',
      endpoint: 'http://pushgateway.rescueping.svc.cluster.local:9091',
      authentication: { type: 'none' },
      configuration: {
        pushInterval: 60,
        pushTimeout: 10,
        batchSize: 1000,
        retryAttempts: 3,
        retryBackoff: 1000,
        compression: 'gzip',
        format: 'prometheus',
      },
      groups: [
        { name: 'batch_job_1', labels: { job: 'batch' }, metrics: [{ name: 'job_duration_seconds', type: 'gauge', value: 125.5, labels: {} }], lastPush: new Date(), pushCount: 1000 },
        { name: 'batch_job_2', labels: { job: 'etl' }, metrics: [{ name: 'records_processed', type: 'counter', value: 50000, labels: {} }], lastPush: new Date(), pushCount: 500 },
      ],
      status: 'active',
      metrics: {
        totalPushes: 15000,
        successfulPushes: 14950,
        failedPushes: 50,
        metricsQueued: 25,
        avgPushLatency: 45.5,
        lastPush: new Date(),
      },
      metadata: { createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date() },
    };
    this.gateways.set(gateway.id, gateway);

    // Initialize Aggregation Rules
    const aggRulesData = [
      { name: 'Request Rate 5m', input: 'http_requests_total', output: 'http_requests:rate5m', agg: 'sum' as AggregationType },
      { name: 'Avg Response Time 5m', input: 'http_request_duration_seconds', output: 'http_request_duration:avg5m', agg: 'avg' as AggregationType },
      { name: 'Error Rate 5m', input: 'http_errors_total', output: 'http_errors:rate5m', agg: 'sum' as AggregationType },
    ];

    aggRulesData.forEach((r, idx) => {
      const rule: AggregationRule = {
        id: `agg-rule-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name,
        description: `Aggregation rule for ${r.name}`,
        inputMetric: r.input,
        outputMetric: r.output,
        aggregation: r.agg,
        window: { duration: 5, unit: 'minute' },
        groupBy: ['service', 'instance'],
        schedule: '*/5 * * * *',
        status: 'active',
        lastRun: new Date(),
        nextRun: new Date(Date.now() + 5 * 60 * 1000),
        stats: { runsTotal: 1000, runsSuccessful: 998, runsFailed: 2, avgDuration: 150, lastDuration: 145 },
        metadata: { createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date() },
      };
      this.aggregationRules.set(rule.id, rule);
    });

    // Initialize Recording Rules
    const recordingRulesData = [
      { name: 'job:http_requests:rate5m', expr: 'sum by (job) (rate(http_requests_total[5m]))' },
      { name: 'instance:cpu:rate5m', expr: 'sum by (instance) (rate(process_cpu_seconds_total[5m]))' },
      { name: 'service:memory:avg', expr: 'avg by (service) (process_resident_memory_bytes)' },
    ];

    recordingRulesData.forEach((r, idx) => {
      const rule: RecordingRule = {
        id: `rec-rule-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name,
        description: `Recording rule for ${r.name}`,
        record: r.name,
        expr: r.expr,
        labels: { aggregated: 'true' },
        group: 'rescueping_rules',
        interval: 15,
        status: 'active',
        lastEvaluation: new Date(),
        evaluationTime: Math.random() * 10 + 5,
        samples: Math.floor(Math.random() * 100) + 10,
        metadata: { createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date() },
      };
      this.recordingRules.set(rule.id, rule);
    });

    // Initialize Alert Rules
    const alertRulesData = [
      { name: 'HighErrorRate', expr: 'sum(rate(http_errors_total[5m])) / sum(rate(http_requests_total[5m])) > 0.05', severity: 'critical' as const },
      { name: 'HighLatency', expr: 'histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 1', severity: 'warning' as const },
      { name: 'HighMemoryUsage', expr: 'process_resident_memory_bytes / 1024 / 1024 / 1024 > 4', severity: 'warning' as const },
    ];

    alertRulesData.forEach((a, idx) => {
      const rule: AlertRule = {
        id: `alert-rule-${(idx + 1).toString().padStart(4, '0')}`,
        name: a.name,
        description: `Alert for ${a.name}`,
        alert: a.name,
        expr: a.expr,
        for: 300,
        labels: { team: 'platform', severity: a.severity },
        annotations: { summary: `${a.name} detected`, description: `${a.name} alert has been triggered`, runbook: `https://runbooks.rescueping.com/${a.name.toLowerCase()}` },
        severity: a.severity,
        status: idx === 0 ? 'firing' : 'active',
        activeAlerts: idx === 0 ? [{ id: `active-${idx}`, labels: { service: 'api-gateway' }, annotations: {}, state: 'firing', activeAt: new Date(), value: 0.08, firedAt: new Date() }] : [],
        lastEvaluation: new Date(),
        evaluationTime: Math.random() * 20 + 10,
        metadata: { createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date() },
      };
      this.alertRules.set(rule.id, rule);
    });

    // Initialize Dashboard
    const dashboard: MetricsDashboard = {
      id: 'dashboard-0001',
      name: 'Application Overview',
      description: 'Main application metrics dashboard',
      uid: 'app-overview',
      version: 5,
      panels: [
        { id: 1, title: 'Request Rate', type: 'graph', targets: [{ refId: 'A', expr: 'sum(rate(http_requests_total[5m]))', legendFormat: '{{service}}' }], gridPos: { x: 0, y: 0, w: 12, h: 8 }, options: {} },
        { id: 2, title: 'Error Rate', type: 'graph', targets: [{ refId: 'A', expr: 'sum(rate(http_errors_total[5m])) / sum(rate(http_requests_total[5m])) * 100', legendFormat: 'Error %' }], gridPos: { x: 12, y: 0, w: 12, h: 8 }, options: {} },
        { id: 3, title: 'Latency p95', type: 'stat', targets: [{ refId: 'A', expr: 'histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))', legendFormat: 'p95' }], gridPos: { x: 0, y: 8, w: 6, h: 4 }, options: {} },
        { id: 4, title: 'Memory Usage', type: 'gauge', targets: [{ refId: 'A', expr: 'sum(process_resident_memory_bytes) / 1024 / 1024 / 1024', legendFormat: 'GB' }], gridPos: { x: 6, y: 8, w: 6, h: 4 }, options: {} },
      ],
      variables: [{ name: 'service', label: 'Service', type: 'query', query: 'label_values(http_requests_total, service)', multi: true, includeAll: true }],
      annotations: [{ name: 'Deployments', datasource: 'prometheus', enable: true, expr: 'changes(deployment_timestamp[5m]) > 0', iconColor: 'blue' }],
      timeRange: { from: 'now-1h', to: 'now' },
      refresh: '30s',
      tags: ['application', 'overview'],
      sharing: { public: true, users: [], teams: ['platform'] },
      metadata: { createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date(), updatedBy: 'admin' },
    };
    this.dashboards.set(dashboard.id, dashboard);

    // Initialize Storage Configuration
    const storageConfig: StorageConfiguration = {
      id: 'storage-0001',
      name: 'Primary Storage',
      type: 'local',
      retention: { rawRetention: 15 * 24 * 60 * 60, resolutions: [{ resolution: 300, retention: 90 * 24 * 60 * 60 }, { resolution: 3600, retention: 365 * 24 * 60 * 60 }], deletionDelay: 24 * 60 * 60, blockDuration: 2 * 60 * 60 },
      compaction: { enabled: true, interval: 2 * 60 * 60, maxBlockDuration: 24 * 60 * 60, minBlockDuration: 2 * 60 * 60, maxOpeningBlocks: 5, concurrency: 4 },
      replication: { enabled: true, factor: 2, destinations: [{ name: 'replica-1', endpoint: 'http://prometheus-replica:9090', status: 'active', lag: 5 }] },
      status: 'active',
      stats: {
        totalSeries: 150000,
        totalSamples: 5000000000,
        totalBytes: 500000000000,
        numBlocks: 500,
        oldestBlock: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        newestBlock: new Date(),
        headSeries: 50000,
        headChunks: 200000,
        headSamples: 10000000,
        walSegments: 50,
        walBytes: 500000000,
        compactionsTotal: 10000,
        compactionsFailed: 5,
      },
      metadata: { createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
    };
    this.storage.set(storageConfig.id, storageConfig);
  }

  // Metric Definition Operations
  public getMetrics(namespace?: string): MetricDefinition[] {
    let metrics = Array.from(this.metrics.values());
    if (namespace) metrics = metrics.filter((m) => m.namespace === namespace);
    return metrics;
  }

  public getMetricById(id: string): MetricDefinition | undefined {
    return this.metrics.get(id);
  }

  public getMetricByName(name: string): MetricDefinition | undefined {
    return Array.from(this.metrics.values()).find((m) => m.name === name);
  }

  // Sample Operations
  public getSamples(metricId: string, limit: number = 100): MetricSample[] {
    const samples = this.samples.get(metricId) || [];
    return samples.slice(0, limit);
  }

  // Target Operations
  public getTargets(state?: 'up' | 'down' | 'unknown'): ScrapeTarget[] {
    let targets = Array.from(this.targets.values());
    if (state) targets = targets.filter((t) => t.status.state === state);
    return targets;
  }

  public getTargetById(id: string): ScrapeTarget | undefined {
    return this.targets.get(id);
  }

  // Gateway Operations
  public getGateways(): PushGateway[] {
    return Array.from(this.gateways.values());
  }

  public getGatewayById(id: string): PushGateway | undefined {
    return this.gateways.get(id);
  }

  // Rule Operations
  public getAggregationRules(): AggregationRule[] {
    return Array.from(this.aggregationRules.values());
  }

  public getRecordingRules(): RecordingRule[] {
    return Array.from(this.recordingRules.values());
  }

  public getAlertRules(): AlertRule[] {
    return Array.from(this.alertRules.values());
  }

  public getFiringAlerts(): ActiveAlert[] {
    const alerts: ActiveAlert[] = [];
    this.alertRules.forEach((rule) => {
      rule.activeAlerts.filter((a) => a.state === 'firing').forEach((a) => alerts.push(a));
    });
    return alerts;
  }

  // Dashboard Operations
  public getDashboards(): MetricsDashboard[] {
    return Array.from(this.dashboards.values());
  }

  public getDashboardById(id: string): MetricsDashboard | undefined {
    return this.dashboards.get(id);
  }

  // Storage Operations
  public getStorageConfigurations(): StorageConfiguration[] {
    return Array.from(this.storage.values());
  }

  // Statistics
  public getStatistics(): MetricsStatistics {
    const metrics = Array.from(this.metrics.values());
    const targets = Array.from(this.targets.values());
    const storages = Array.from(this.storage.values());

    const byType: Record<MetricType, number> = { counter: 0, gauge: 0, histogram: 0, summary: 0, timer: 0, rate: 0, percentile: 0 };
    const byNamespace: Record<string, number> = {};

    metrics.forEach((m) => {
      byType[m.type]++;
      byNamespace[m.namespace] = (byNamespace[m.namespace] || 0) + 1;
    });

    const totalStorage = storages.reduce((sum, s) => sum + s.stats.totalBytes, 0);

    return {
      overview: {
        totalMetrics: metrics.length,
        totalSeries: storages.reduce((sum, s) => sum + s.stats.totalSeries, 0),
        totalSamples: storages.reduce((sum, s) => sum + s.stats.totalSamples, 0),
        totalTargets: targets.length,
        activeTargets: targets.filter((t) => t.status.state === 'up').length,
        samplesPerSecond: targets.reduce((sum, t) => sum + t.status.samplesScraped / 15, 0),
        seriesCreated: Math.floor(Math.random() * 1000),
        seriesDeleted: Math.floor(Math.random() * 100),
      },
      byType,
      byNamespace,
      bySource: { application: metrics.length },
      scraping: {
        targetsUp: targets.filter((t) => t.status.state === 'up').length,
        targetsDown: targets.filter((t) => t.status.state === 'down').length,
        scrapeInterval: 15,
        avgScrapeDuration: targets.reduce((sum, t) => sum + t.status.lastScrapeDuration, 0) / targets.length,
        scrapeErrors: targets.reduce((sum, t) => sum + t.status.scrapeFailureCount, 0),
      },
      storage: {
        totalBytes: totalStorage,
        compressedBytes: totalStorage * 0.3,
        compressionRatio: 3.3,
        blocksTotal: storages.reduce((sum, s) => sum + s.stats.numBlocks, 0),
        chunksTotal: storages.reduce((sum, s) => sum + s.stats.headChunks, 0),
      },
      queries: {
        totalQueries: Math.floor(Math.random() * 1000000),
        avgQueryDuration: Math.random() * 100 + 50,
        slowQueries: Math.floor(Math.random() * 100),
        failedQueries: Math.floor(Math.random() * 50),
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

export const metricsCollectionService = MetricsCollectionService.getInstance();
export type {
  MetricType,
  AggregationType,
  MetricStatus,
  TimeUnit,
  MetricDefinition,
  LabelDefinition,
  MetricSample,
  MetricSource,
  SampleQuality,
  MetricSeries,
  TimeSeriesPoint,
  SeriesStats,
  ScrapeTarget,
  ScrapeEndpoint,
  ScrapeConfiguration,
  RelabelConfig,
  TargetStatus,
  TargetHealth,
  PushGateway,
  PushConfiguration,
  MetricGroup,
  GroupMetric,
  PushMetrics,
  AggregationRule,
  AggregationFilter,
  RecordingRule,
  AlertRule,
  ActiveAlert,
  MetricQuery,
  QueryResult,
  QueryResultData,
  ResultItem,
  MetricsDashboard,
  DashboardPanel,
  PanelTarget,
  PanelTransformation,
  PanelLink,
  DashboardVariable,
  DashboardAnnotation,
  StorageConfiguration,
  RetentionConfiguration,
  ResolutionRetention,
  CompactionConfiguration,
  ReplicationConfiguration,
  ReplicationDestination,
  StorageStats,
  MetricsStatistics,
};
