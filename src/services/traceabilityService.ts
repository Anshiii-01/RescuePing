/**
 * Traceability Service
 * Comprehensive distributed tracing, span management, and trace analysis
 */

// Trace Status
type TraceStatus = 'ok' | 'error' | 'unset' | 'timeout';

// Span Kind
type SpanKind = 'internal' | 'server' | 'client' | 'producer' | 'consumer';

// Span Status
type SpanStatus = 'ok' | 'error' | 'unset';

// Sampling Decision
type SamplingDecision = 'sampled' | 'not-sampled' | 'deferred';

// Trace
interface Trace {
  id: string;
  traceId: string;
  name: string;
  status: TraceStatus;
  rootSpan: Span;
  spans: Span[];
  services: string[];
  duration: number;
  startTime: Date;
  endTime: Date;
  spanCount: number;
  errorCount: number;
  warningCount: number;
  annotations: TraceAnnotation[];
  baggage: Record<string, string>;
  tags: Record<string, string>;
  links: TraceLink[];
  metadata: {
    createdAt: Date;
    samplingDecision: SamplingDecision;
    samplingProbability: number;
    source: string;
    environment: string;
    version: string;
  };
}

// Span
interface Span {
  id: string;
  spanId: string;
  traceId: string;
  parentSpanId?: string;
  operationName: string;
  serviceName: string;
  kind: SpanKind;
  status: SpanStatus;
  statusMessage?: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  tags: SpanTag[];
  logs: SpanLog[];
  references: SpanReference[];
  resource: SpanResource;
  attributes: Record<string, unknown>;
  events: SpanEvent[];
  links: SpanLink[];
  metadata: {
    processId: string;
    warnings?: string[];
    droppedAttributesCount: number;
    droppedEventsCount: number;
    droppedLinksCount: number;
  };
}

// Span Tag
interface SpanTag {
  key: string;
  type: 'string' | 'bool' | 'int64' | 'float64' | 'binary';
  value: string | boolean | number;
}

// Span Log
interface SpanLog {
  timestamp: Date;
  fields: { key: string; type: string; value: unknown }[];
}

// Span Reference
interface SpanReference {
  type: 'child_of' | 'follows_from';
  traceId: string;
  spanId: string;
}

// Span Resource
interface SpanResource {
  serviceName: string;
  serviceVersion: string;
  serviceNamespace?: string;
  serviceInstanceId?: string;
  deploymentEnvironment?: string;
  telemetrySdkName?: string;
  telemetrySdkLanguage?: string;
  telemetrySdkVersion?: string;
  hostName?: string;
  hostId?: string;
  processId?: number;
  attributes: Record<string, unknown>;
}

// Span Event
interface SpanEvent {
  name: string;
  timestamp: Date;
  attributes: Record<string, unknown>;
  droppedAttributesCount: number;
}

// Span Link
interface SpanLink {
  traceId: string;
  spanId: string;
  traceState?: string;
  attributes: Record<string, unknown>;
  droppedAttributesCount: number;
}

// Trace Annotation
interface TraceAnnotation {
  spanId: string;
  timestamp: Date;
  value: string;
  endpoint?: {
    serviceName: string;
    ipv4?: string;
    ipv6?: string;
    port?: number;
  };
}

// Trace Link
interface TraceLink {
  traceId: string;
  spanId: string;
  relationship: 'causal' | 'temporal' | 'correlation';
  attributes: Record<string, string>;
}

// Service Dependency
interface ServiceDependency {
  id: string;
  parent: string;
  child: string;
  callCount: number;
  errorCount: number;
  avgDuration: number;
  p50Duration: number;
  p90Duration: number;
  p99Duration: number;
  errorRate: number;
  lastSeen: Date;
}

// Service Graph Node
interface ServiceGraphNode {
  id: string;
  name: string;
  type: 'service' | 'database' | 'cache' | 'queue' | 'external';
  status: 'healthy' | 'degraded' | 'unhealthy';
  requestRate: number;
  errorRate: number;
  avgLatency: number;
  instances: number;
}

// Service Graph Edge
interface ServiceGraphEdge {
  source: string;
  target: string;
  requestRate: number;
  errorRate: number;
  avgLatency: number;
  protocol: string;
}

// Tracing Configuration
interface TracingConfiguration {
  id: string;
  name: string;
  enabled: boolean;
  provider: 'jaeger' | 'zipkin' | 'datadog' | 'lightstep' | 'honeycomb' | 'tempo';
  endpoint: string;
  sampling: SamplingConfiguration;
  propagation: PropagationConfiguration;
  exporters: ExporterConfiguration[];
  processors: ProcessorConfiguration[];
  resourceDetectors: string[];
  instrumentation: InstrumentationConfiguration;
  limits: {
    maxSpansPerTrace: number;
    maxAttributesPerSpan: number;
    maxEventsPerSpan: number;
    maxLinksPerSpan: number;
    maxAttributeValueLength: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Sampling Configuration
interface SamplingConfiguration {
  type: 'always-on' | 'always-off' | 'probability' | 'rate-limiting' | 'parent-based' | 'custom';
  probability?: number;
  rateLimit?: number;
  rules?: SamplingRule[];
}

// Sampling Rule
interface SamplingRule {
  id: string;
  name: string;
  priority: number;
  conditions: {
    field: 'service' | 'operation' | 'tag' | 'duration';
    operator: 'equals' | 'contains' | 'regex' | 'gt' | 'lt';
    value: string | number;
  }[];
  samplingRate: number;
  enabled: boolean;
}

// Propagation Configuration
interface PropagationConfiguration {
  formats: ('w3c' | 'b3' | 'b3-multi' | 'jaeger' | 'datadog' | 'ot-tracer')[];
  baggage: {
    enabled: boolean;
    maxItems: number;
    maxValueLength: number;
  };
}

// Exporter Configuration
interface ExporterConfiguration {
  type: 'otlp' | 'jaeger' | 'zipkin' | 'console' | 'noop';
  endpoint?: string;
  headers?: Record<string, string>;
  compression?: 'none' | 'gzip';
  timeout?: number;
  batchSize?: number;
  queueSize?: number;
  enabled: boolean;
}

// Processor Configuration
interface ProcessorConfiguration {
  type: 'batch' | 'simple' | 'attribute' | 'span' | 'tail-sampling';
  configuration: Record<string, unknown>;
  order: number;
  enabled: boolean;
}

// Instrumentation Configuration
interface InstrumentationConfiguration {
  autoInstrumentation: boolean;
  libraries: {
    name: string;
    enabled: boolean;
    configuration?: Record<string, unknown>;
  }[];
  customSpans: {
    enabled: boolean;
    patterns: string[];
  };
}

// Trace Query
interface TraceQuery {
  id: string;
  name: string;
  description: string;
  query: {
    traceId?: string;
    service?: string;
    operation?: string;
    tags?: Record<string, string>;
    minDuration?: number;
    maxDuration?: number;
    startTime: Date;
    endTime: Date;
    limit?: number;
    status?: TraceStatus[];
    spanKind?: SpanKind[];
  };
  savedAt?: Date;
  savedBy?: string;
  isPublic: boolean;
  executionCount: number;
  lastExecuted?: Date;
}

// Trace Analysis
interface TraceAnalysis {
  id: string;
  traceId: string;
  analyzedAt: Date;
  findings: AnalysisFinding[];
  bottlenecks: BottleneckInfo[];
  anomalies: AnomalyInfo[];
  recommendations: AnalysisRecommendation[];
  metrics: {
    criticalPath: CriticalPathInfo;
    parallelism: number;
    depth: number;
    breadth: number;
  };
}

// Analysis Finding
interface AnalysisFinding {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'latency' | 'error' | 'resource' | 'dependency' | 'configuration';
  title: string;
  description: string;
  spanId?: string;
  serviceName?: string;
  impact: 'high' | 'medium' | 'low';
}

// Bottleneck Info
interface BottleneckInfo {
  spanId: string;
  serviceName: string;
  operationName: string;
  duration: number;
  percentOfTrace: number;
  cause: string;
  suggestions: string[];
}

// Anomaly Info
interface AnomalyInfo {
  id: string;
  type: 'latency' | 'error-rate' | 'throughput' | 'pattern';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  detectedAt: Date;
  affectedSpans: string[];
  baseline: number;
  actual: number;
  deviation: number;
}

// Analysis Recommendation
interface AnalysisRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'performance' | 'reliability' | 'cost' | 'observability';
  title: string;
  description: string;
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
}

// Critical Path Info
interface CriticalPathInfo {
  spans: { spanId: string; serviceName: string; operationName: string; duration: number }[];
  totalDuration: number;
  percentOfTrace: number;
}

// Trace Comparison
interface TraceComparison {
  id: string;
  baselineTraceId: string;
  comparisonTraceId: string;
  createdAt: Date;
  differences: {
    addedSpans: string[];
    removedSpans: string[];
    modifiedSpans: SpanDifference[];
    addedServices: string[];
    removedServices: string[];
  };
  metrics: {
    baselineDuration: number;
    comparisonDuration: number;
    durationChange: number;
    baselineSpanCount: number;
    comparisonSpanCount: number;
    spanCountChange: number;
  };
}

// Span Difference
interface SpanDifference {
  spanId: string;
  operationName: string;
  changes: {
    field: string;
    baselineValue: unknown;
    comparisonValue: unknown;
    changePercent?: number;
  }[];
}

// Trace Alert
interface TraceAlert {
  id: string;
  name: string;
  description: string;
  type: 'latency' | 'error-rate' | 'throughput' | 'anomaly' | 'custom';
  conditions: AlertCondition[];
  actions: AlertAction[];
  status: 'enabled' | 'disabled' | 'triggered';
  lastTriggered?: Date;
  triggerCount: number;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Alert Condition
interface AlertCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'neq';
  threshold: number;
  duration: number;
  aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count' | 'p50' | 'p90' | 'p99';
}

// Alert Action
interface AlertAction {
  type: 'email' | 'slack' | 'pagerduty' | 'webhook' | 'opsgenie';
  configuration: Record<string, string>;
  enabled: boolean;
}

// Trace Statistics
interface TraceStatistics {
  overview: {
    totalTraces: number;
    totalSpans: number;
    uniqueServices: number;
    uniqueOperations: number;
    avgTraceDuration: number;
    avgSpansPerTrace: number;
    errorRate: number;
  };
  byService: Record<string, {
    traceCount: number;
    spanCount: number;
    avgDuration: number;
    errorRate: number;
    p50Duration: number;
    p90Duration: number;
    p99Duration: number;
  }>;
  byOperation: Record<string, {
    count: number;
    avgDuration: number;
    errorRate: number;
    p99Duration: number;
  }>;
  latencyDistribution: {
    bucket: string;
    count: number;
    percentage: number;
  }[];
  errorDistribution: {
    errorType: string;
    count: number;
    percentage: number;
  }[];
  trends: {
    timestamp: Date;
    traceCount: number;
    avgDuration: number;
    errorRate: number;
  }[];
}

class TraceabilityService {
  private static instance: TraceabilityService;
  private traces: Map<string, Trace> = new Map();
  private spans: Map<string, Span> = new Map();
  private configurations: Map<string, TracingConfiguration> = new Map();
  private queries: Map<string, TraceQuery> = new Map();
  private alerts: Map<string, TraceAlert> = new Map();
  private dependencies: Map<string, ServiceDependency> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): TraceabilityService {
    if (!TraceabilityService.instance) {
      TraceabilityService.instance = new TraceabilityService();
    }
    return TraceabilityService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTraceId(): string {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private generateSpanId(): string {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private initializeSampleData(): void {
    // Initialize Traces
    const services = ['api-gateway', 'user-service', 'auth-service', 'payment-service', 'notification-service', 'inventory-service', 'order-service', 'shipping-service'];
    const operations = ['HTTP GET', 'HTTP POST', 'gRPC Call', 'Database Query', 'Cache Get', 'Queue Publish', 'External API'];

    for (let t = 0; t < 20; t++) {
      const traceId = this.generateTraceId();
      const startTime = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
      const spanCount = Math.floor(Math.random() * 15) + 5;
      const hasError = Math.random() < 0.1;

      const traceSpans: Span[] = [];
      let parentSpanId: string | undefined = undefined;

      for (let s = 0; s < spanCount; s++) {
        const spanId = this.generateSpanId();
        const serviceName = services[Math.floor(Math.random() * services.length)];
        const operationName = `${operations[Math.floor(Math.random() * operations.length)]} /${serviceName}/api/v1`;
        const spanStartTime = new Date(startTime.getTime() + s * Math.random() * 50);
        const spanDuration = Math.random() * 200 + 10;
        const spanEndTime = new Date(spanStartTime.getTime() + spanDuration);
        const spanHasError = hasError && s === Math.floor(spanCount / 2);

        const span: Span = {
          id: `span-${t}-${s}`,
          spanId,
          traceId,
          parentSpanId: s > 0 ? parentSpanId : undefined,
          operationName,
          serviceName,
          kind: s === 0 ? 'server' : ['client', 'internal', 'producer'][Math.floor(Math.random() * 3)] as SpanKind,
          status: spanHasError ? 'error' : 'ok',
          statusMessage: spanHasError ? 'Internal Server Error' : undefined,
          startTime: spanStartTime,
          endTime: spanEndTime,
          duration: spanDuration,
          tags: [
            { key: 'http.method', type: 'string', value: 'GET' },
            { key: 'http.status_code', type: 'int64', value: spanHasError ? 500 : 200 },
            { key: 'http.url', type: 'string', value: `https://${serviceName}.rescueping.io/api/v1` },
            { key: 'span.kind', type: 'string', value: s === 0 ? 'server' : 'client' },
          ],
          logs: spanHasError ? [{ timestamp: spanEndTime, fields: [{ key: 'event', type: 'string', value: 'error' }, { key: 'message', type: 'string', value: 'Connection timeout' }] }] : [],
          references: s > 0 && parentSpanId ? [{ type: 'child_of', traceId, spanId: parentSpanId }] : [],
          resource: {
            serviceName,
            serviceVersion: '1.0.0',
            serviceNamespace: 'production',
            serviceInstanceId: `${serviceName}-instance-${Math.floor(Math.random() * 3)}`,
            deploymentEnvironment: 'production',
            telemetrySdkName: 'opentelemetry',
            telemetrySdkLanguage: 'nodejs',
            telemetrySdkVersion: '1.17.0',
            attributes: { 'k8s.pod.name': `${serviceName}-pod-${Math.floor(Math.random() * 5)}` },
          },
          attributes: { 'custom.attribute': 'value' },
          events: [{ name: 'request.received', timestamp: spanStartTime, attributes: {}, droppedAttributesCount: 0 }],
          links: [],
          metadata: {
            processId: `process-${serviceName}`,
            droppedAttributesCount: 0,
            droppedEventsCount: 0,
            droppedLinksCount: 0,
          },
        };

        traceSpans.push(span);
        this.spans.set(span.id, span);

        if (s === 0 || Math.random() < 0.3) {
          parentSpanId = spanId;
        }
      }

      const traceDuration = traceSpans[traceSpans.length - 1].endTime.getTime() - startTime.getTime();
      const traceEndTime = new Date(startTime.getTime() + traceDuration);

      const trace: Trace = {
        id: `trace-${(t + 1).toString().padStart(4, '0')}`,
        traceId,
        name: traceSpans[0].operationName,
        status: hasError ? 'error' : 'ok',
        rootSpan: traceSpans[0],
        spans: traceSpans,
        services: [...new Set(traceSpans.map((s) => s.serviceName))],
        duration: traceDuration,
        startTime,
        endTime: traceEndTime,
        spanCount,
        errorCount: hasError ? 1 : 0,
        warningCount: 0,
        annotations: [],
        baggage: { 'user.id': `user-${Math.floor(Math.random() * 1000)}` },
        tags: { environment: 'production', version: '1.0.0' },
        links: [],
        metadata: {
          createdAt: startTime,
          samplingDecision: 'sampled',
          samplingProbability: 1.0,
          source: 'opentelemetry',
          environment: 'production',
          version: '1.0.0',
        },
      };
      this.traces.set(trace.id, trace);
    }

    // Initialize Service Dependencies
    const dependencyPairs = [
      ['api-gateway', 'user-service'],
      ['api-gateway', 'auth-service'],
      ['user-service', 'auth-service'],
      ['user-service', 'notification-service'],
      ['order-service', 'payment-service'],
      ['order-service', 'inventory-service'],
      ['order-service', 'shipping-service'],
      ['payment-service', 'notification-service'],
    ];

    dependencyPairs.forEach(([parent, child], idx) => {
      const dep: ServiceDependency = {
        id: `dep-${(idx + 1).toString().padStart(4, '0')}`,
        parent,
        child,
        callCount: Math.floor(Math.random() * 10000) + 1000,
        errorCount: Math.floor(Math.random() * 100),
        avgDuration: Math.random() * 100 + 20,
        p50Duration: Math.random() * 50 + 10,
        p90Duration: Math.random() * 150 + 50,
        p99Duration: Math.random() * 300 + 100,
        errorRate: Math.random() * 2,
        lastSeen: new Date(),
      };
      this.dependencies.set(dep.id, dep);
    });

    // Initialize Tracing Configuration
    const config: TracingConfiguration = {
      id: 'config-0001',
      name: 'Production Tracing',
      enabled: true,
      provider: 'jaeger',
      endpoint: 'http://jaeger-collector:14268/api/traces',
      sampling: {
        type: 'probability',
        probability: 0.1,
        rules: [
          { id: 'rule-1', name: 'Sample all errors', priority: 1, conditions: [{ field: 'tag', operator: 'equals', value: 'error' }], samplingRate: 1.0, enabled: true },
          { id: 'rule-2', name: 'Sample slow requests', priority: 2, conditions: [{ field: 'duration', operator: 'gt', value: 1000 }], samplingRate: 1.0, enabled: true },
        ],
      },
      propagation: {
        formats: ['w3c', 'b3'],
        baggage: { enabled: true, maxItems: 64, maxValueLength: 4096 },
      },
      exporters: [
        { type: 'otlp', endpoint: 'http://otel-collector:4317', compression: 'gzip', timeout: 10000, batchSize: 512, queueSize: 2048, enabled: true },
        { type: 'jaeger', endpoint: 'http://jaeger-collector:14268', enabled: true },
      ],
      processors: [
        { type: 'batch', configuration: { maxExportBatchSize: 512, scheduledDelayMillis: 5000 }, order: 1, enabled: true },
        { type: 'attribute', configuration: { actions: [{ key: 'sensitive.data', action: 'delete' }] }, order: 2, enabled: true },
      ],
      resourceDetectors: ['env', 'host', 'os', 'process', 'container'],
      instrumentation: {
        autoInstrumentation: true,
        libraries: [
          { name: 'http', enabled: true },
          { name: 'express', enabled: true },
          { name: 'pg', enabled: true },
          { name: 'redis', enabled: true },
        ],
        customSpans: { enabled: true, patterns: ['*Service.*', '*Repository.*'] },
      },
      limits: {
        maxSpansPerTrace: 1000,
        maxAttributesPerSpan: 128,
        maxEventsPerSpan: 128,
        maxLinksPerSpan: 128,
        maxAttributeValueLength: 4096,
      },
      metadata: {
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        createdBy: 'admin',
        updatedAt: new Date(),
      },
    };
    this.configurations.set(config.id, config);

    // Initialize Trace Alerts
    const alertsData = [
      { name: 'High Latency Alert', type: 'latency' as const },
      { name: 'Error Rate Alert', type: 'error-rate' as const },
      { name: 'Throughput Drop', type: 'throughput' as const },
      { name: 'Anomaly Detection', type: 'anomaly' as const },
    ];

    alertsData.forEach((a, idx) => {
      const alert: TraceAlert = {
        id: `alert-${(idx + 1).toString().padStart(4, '0')}`,
        name: a.name,
        description: `Alert for ${a.type} issues`,
        type: a.type,
        conditions: [
          { metric: a.type === 'latency' ? 'p99_latency' : a.type === 'error-rate' ? 'error_rate' : 'request_rate', operator: a.type === 'throughput' ? 'lt' : 'gt', threshold: a.type === 'latency' ? 2000 : a.type === 'error-rate' ? 5 : 100, duration: 300, aggregation: a.type === 'latency' ? 'p99' : 'avg' },
        ],
        actions: [
          { type: 'slack', configuration: { channel: '#alerts', webhook: 'https://hooks.slack.com/...' }, enabled: true },
          { type: 'pagerduty', configuration: { routingKey: 'xxx', severity: 'critical' }, enabled: true },
        ],
        status: 'enabled',
        triggerCount: Math.floor(Math.random() * 10),
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.alerts.set(alert.id, alert);
    });

    // Initialize Saved Queries
    const queriesData = [
      { name: 'Error Traces', description: 'Find all traces with errors' },
      { name: 'Slow Requests', description: 'Find traces over 2 seconds' },
      { name: 'Payment Flows', description: 'Traces through payment service' },
    ];

    queriesData.forEach((q, idx) => {
      const query: TraceQuery = {
        id: `query-${(idx + 1).toString().padStart(4, '0')}`,
        name: q.name,
        description: q.description,
        query: {
          service: idx === 2 ? 'payment-service' : undefined,
          status: idx === 0 ? ['error'] : undefined,
          minDuration: idx === 1 ? 2000 : undefined,
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          endTime: new Date(),
          limit: 100,
        },
        savedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        savedBy: 'admin',
        isPublic: true,
        executionCount: Math.floor(Math.random() * 100) + 10,
        lastExecuted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      };
      this.queries.set(query.id, query);
    });
  }

  // Trace Operations
  public getTraces(status?: TraceStatus, service?: string, limit: number = 100): Trace[] {
    let traces = Array.from(this.traces.values());
    if (status) traces = traces.filter((t) => t.status === status);
    if (service) traces = traces.filter((t) => t.services.includes(service));
    return traces.slice(0, limit);
  }

  public getTraceById(id: string): Trace | undefined {
    return this.traces.get(id);
  }

  public getTraceByTraceId(traceId: string): Trace | undefined {
    return Array.from(this.traces.values()).find((t) => t.traceId === traceId);
  }

  public searchTraces(query: TraceQuery['query']): Trace[] {
    let traces = Array.from(this.traces.values());

    if (query.traceId) {
      traces = traces.filter((t) => t.traceId === query.traceId);
    }
    if (query.service) {
      traces = traces.filter((t) => t.services.includes(query.service!));
    }
    if (query.status && query.status.length > 0) {
      traces = traces.filter((t) => query.status!.includes(t.status));
    }
    if (query.minDuration) {
      traces = traces.filter((t) => t.duration >= query.minDuration!);
    }
    if (query.maxDuration) {
      traces = traces.filter((t) => t.duration <= query.maxDuration!);
    }
    if (query.startTime) {
      traces = traces.filter((t) => t.startTime >= query.startTime);
    }
    if (query.endTime) {
      traces = traces.filter((t) => t.endTime <= query.endTime);
    }

    return traces.slice(0, query.limit || 100);
  }

  // Span Operations
  public getSpansByTraceId(traceId: string): Span[] {
    return Array.from(this.spans.values()).filter((s) => s.traceId === traceId);
  }

  public getSpanById(id: string): Span | undefined {
    return this.spans.get(id);
  }

  // Dependency Operations
  public getDependencies(): ServiceDependency[] {
    return Array.from(this.dependencies.values());
  }

  public getServiceGraph(): { nodes: ServiceGraphNode[]; edges: ServiceGraphEdge[] } {
    const services = new Set<string>();
    const deps = Array.from(this.dependencies.values());

    deps.forEach((d) => {
      services.add(d.parent);
      services.add(d.child);
    });

    const nodes: ServiceGraphNode[] = Array.from(services).map((s) => ({
      id: s,
      name: s,
      type: s.includes('database') ? 'database' : s.includes('cache') ? 'cache' : s.includes('queue') ? 'queue' : 'service',
      status: Math.random() > 0.1 ? 'healthy' : 'degraded',
      requestRate: Math.random() * 1000 + 100,
      errorRate: Math.random() * 2,
      avgLatency: Math.random() * 100 + 20,
      instances: Math.floor(Math.random() * 5) + 1,
    }));

    const edges: ServiceGraphEdge[] = deps.map((d) => ({
      source: d.parent,
      target: d.child,
      requestRate: d.callCount / 3600,
      errorRate: d.errorRate,
      avgLatency: d.avgDuration,
      protocol: 'HTTP',
    }));

    return { nodes, edges };
  }

  // Configuration Operations
  public getConfigurations(): TracingConfiguration[] {
    return Array.from(this.configurations.values());
  }

  public getConfigurationById(id: string): TracingConfiguration | undefined {
    return this.configurations.get(id);
  }

  // Query Operations
  public getQueries(): TraceQuery[] {
    return Array.from(this.queries.values());
  }

  public getQueryById(id: string): TraceQuery | undefined {
    return this.queries.get(id);
  }

  // Alert Operations
  public getAlerts(): TraceAlert[] {
    return Array.from(this.alerts.values());
  }

  public getAlertById(id: string): TraceAlert | undefined {
    return this.alerts.get(id);
  }

  // Analysis
  public analyzeTrace(traceId: string): TraceAnalysis | undefined {
    const trace = this.getTraceByTraceId(traceId);
    if (!trace) return undefined;

    const spanDurations = trace.spans.map((s) => ({ spanId: s.spanId, duration: s.duration, serviceName: s.serviceName, operationName: s.operationName }));
    const sortedByDuration = [...spanDurations].sort((a, b) => b.duration - a.duration);

    return {
      id: this.generateId(),
      traceId,
      analyzedAt: new Date(),
      findings: trace.errorCount > 0 ? [{ id: '1', type: 'error', category: 'error', title: 'Trace contains errors', description: `Found ${trace.errorCount} error(s) in trace`, impact: 'high' }] : [],
      bottlenecks: sortedByDuration.slice(0, 3).map((s) => ({
        spanId: s.spanId,
        serviceName: s.serviceName,
        operationName: s.operationName,
        duration: s.duration,
        percentOfTrace: (s.duration / trace.duration) * 100,
        cause: 'Slow operation',
        suggestions: ['Consider caching', 'Optimize query'],
      })),
      anomalies: [],
      recommendations: [
        { id: '1', priority: 'medium', category: 'performance', title: 'Consider async operations', description: 'Some operations could be parallelized', expectedImpact: '20% latency reduction', effort: 'medium' },
      ],
      metrics: {
        criticalPath: {
          spans: sortedByDuration.slice(0, 5),
          totalDuration: sortedByDuration.slice(0, 5).reduce((sum, s) => sum + s.duration, 0),
          percentOfTrace: (sortedByDuration.slice(0, 5).reduce((sum, s) => sum + s.duration, 0) / trace.duration) * 100,
        },
        parallelism: Math.random() * 0.5 + 0.2,
        depth: Math.floor(Math.random() * 5) + 3,
        breadth: Math.floor(Math.random() * 4) + 2,
      },
    };
  }

  // Statistics
  public getStatistics(timeRange?: { start: Date; end: Date }): TraceStatistics {
    const traces = Array.from(this.traces.values());
    const spans = Array.from(this.spans.values());

    const byService: Record<string, { traceCount: number; spanCount: number; avgDuration: number; errorRate: number; p50Duration: number; p90Duration: number; p99Duration: number }> = {};
    const byOperation: Record<string, { count: number; avgDuration: number; errorRate: number; p99Duration: number }> = {};

    traces.forEach((t) => {
      t.services.forEach((s) => {
        if (!byService[s]) byService[s] = { traceCount: 0, spanCount: 0, avgDuration: 0, errorRate: 0, p50Duration: 0, p90Duration: 0, p99Duration: 0 };
        byService[s].traceCount++;
      });
    });

    spans.forEach((s) => {
      if (byService[s.serviceName]) {
        byService[s.serviceName].spanCount++;
        byService[s.serviceName].avgDuration = (byService[s.serviceName].avgDuration + s.duration) / 2;
      }
      const opKey = `${s.serviceName}:${s.operationName}`;
      if (!byOperation[opKey]) byOperation[opKey] = { count: 0, avgDuration: 0, errorRate: 0, p99Duration: 0 };
      byOperation[opKey].count++;
      byOperation[opKey].avgDuration = (byOperation[opKey].avgDuration + s.duration) / 2;
    });

    return {
      overview: {
        totalTraces: traces.length,
        totalSpans: spans.length,
        uniqueServices: Object.keys(byService).length,
        uniqueOperations: Object.keys(byOperation).length,
        avgTraceDuration: traces.reduce((sum, t) => sum + t.duration, 0) / traces.length,
        avgSpansPerTrace: spans.length / traces.length,
        errorRate: (traces.filter((t) => t.status === 'error').length / traces.length) * 100,
      },
      byService,
      byOperation,
      latencyDistribution: [
        { bucket: '0-100ms', count: Math.floor(traces.length * 0.4), percentage: 40 },
        { bucket: '100-500ms', count: Math.floor(traces.length * 0.35), percentage: 35 },
        { bucket: '500ms-1s', count: Math.floor(traces.length * 0.15), percentage: 15 },
        { bucket: '1s+', count: Math.floor(traces.length * 0.1), percentage: 10 },
      ],
      errorDistribution: [
        { errorType: 'Timeout', count: 5, percentage: 50 },
        { errorType: 'Connection Error', count: 3, percentage: 30 },
        { errorType: 'Internal Error', count: 2, percentage: 20 },
      ],
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

export const traceabilityService = TraceabilityService.getInstance();
export type {
  TraceStatus,
  SpanKind,
  SpanStatus,
  SamplingDecision,
  Trace,
  Span,
  SpanTag,
  SpanLog,
  SpanReference,
  SpanResource,
  SpanEvent,
  SpanLink,
  TraceAnnotation,
  TraceLink,
  ServiceDependency,
  ServiceGraphNode,
  ServiceGraphEdge,
  TracingConfiguration,
  SamplingConfiguration,
  SamplingRule,
  PropagationConfiguration,
  ExporterConfiguration,
  ProcessorConfiguration,
  InstrumentationConfiguration,
  TraceQuery,
  TraceAnalysis,
  AnalysisFinding,
  BottleneckInfo,
  AnomalyInfo,
  AnalysisRecommendation,
  CriticalPathInfo,
  TraceComparison,
  SpanDifference,
  TraceAlert,
  AlertCondition,
  AlertAction,
  TraceStatistics,
};
