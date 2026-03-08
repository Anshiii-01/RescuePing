/**
 * Distributed Tracing Service
 * Comprehensive request tracing across microservices, span analysis, and performance insights
 */

// Span kind
type SpanKind = 'internal' | 'server' | 'client' | 'producer' | 'consumer';

// Span status
type SpanStatus = 'ok' | 'error' | 'unset';

// Trace status
type TraceStatus = 'complete' | 'in_progress' | 'error' | 'timeout' | 'partial';

// Service status
type ServiceStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

// Sampling decision
type SamplingDecision = 'sampled' | 'not_sampled' | 'deferred';

// Trace
interface Trace {
  id: string;
  traceId: string;
  name: string;
  status: TraceStatus;
  startTime: Date;
  endTime?: Date;
  duration: number;
  root: {
    service: string;
    operation: string;
    spanId: string;
  };
  spans: Span[];
  services: string[];
  summary: {
    totalSpans: number;
    errorSpans: number;
    avgDuration: number;
    criticalPath: string[];
    bottleneck?: { service: string; operation: string; duration: number };
  };
  tags: Record<string, string>;
  baggage: Record<string, string>;
  sampling: {
    decision: SamplingDecision;
    probability: number;
    rule?: string;
  };
  metadata: {
    receivedAt: Date;
    indexedAt: Date;
    source: string;
  };
}

// Span
interface Span {
  id: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  serviceName: string;
  kind: SpanKind;
  status: SpanStatus;
  startTime: Date;
  endTime?: Date;
  duration: number;
  tags: Record<string, unknown>;
  logs: SpanLog[];
  references: SpanReference[];
  context: SpanContext;
  resource: {
    serviceName: string;
    serviceVersion: string;
    serviceNamespace?: string;
    hostName: string;
    hostIp?: string;
    containerId?: string;
    podName?: string;
  };
  instrumentation: {
    library: string;
    version: string;
  };
  error?: {
    type: string;
    message: string;
    stack?: string;
  };
  metrics: {
    selfTime: number;
    childTime: number;
    queueTime?: number;
  };
}

// Span Log
interface SpanLog {
  timestamp: Date;
  fields: Record<string, unknown>;
}

// Span Reference
interface SpanReference {
  type: 'child_of' | 'follows_from';
  traceId: string;
  spanId: string;
}

// Span Context
interface SpanContext {
  traceId: string;
  spanId: string;
  traceFlags: number;
  traceState?: string;
}

// Service
interface TracingService {
  id: string;
  name: string;
  displayName: string;
  status: ServiceStatus;
  version: string;
  environment: string;
  operations: ServiceOperation[];
  dependencies: {
    upstream: string[];
    downstream: string[];
  };
  statistics: {
    totalTraces: number;
    totalSpans: number;
    errorRate: number;
    avgDuration: number;
    p50Duration: number;
    p95Duration: number;
    p99Duration: number;
    throughput: number;
  };
  slos: {
    latencyTarget: number;
    errorRateTarget: number;
    latencyCompliance: number;
    errorRateCompliance: number;
  };
  health: {
    status: ServiceStatus;
    lastCheck: Date;
    issues: string[];
  };
  metadata: {
    team: string;
    owner: string;
    repository?: string;
    documentation?: string;
    firstSeen: Date;
    lastSeen: Date;
  };
}

// Service Operation
interface ServiceOperation {
  id: string;
  name: string;
  type: 'http' | 'grpc' | 'database' | 'cache' | 'queue' | 'internal';
  method?: string;
  path?: string;
  statistics: {
    count: number;
    errorCount: number;
    avgDuration: number;
    p50Duration: number;
    p95Duration: number;
    p99Duration: number;
  };
  trends: {
    latency: 'increasing' | 'decreasing' | 'stable';
    errorRate: 'increasing' | 'decreasing' | 'stable';
    throughput: 'increasing' | 'decreasing' | 'stable';
  };
}

// Service Dependency
interface ServiceDependency {
  id: string;
  source: string;
  target: string;
  operation: string;
  statistics: {
    callCount: number;
    errorCount: number;
    avgDuration: number;
    p95Duration: number;
  };
  health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    errorRate: number;
  };
  lastSeen: Date;
}

// Trace Query
interface TraceQuery {
  id: string;
  name?: string;
  filters: {
    service?: string[];
    operation?: string[];
    tags?: Record<string, string>;
    minDuration?: number;
    maxDuration?: number;
    status?: TraceStatus[];
    startTime?: Date;
    endTime?: Date;
    traceId?: string;
  };
  sorting: {
    field: 'startTime' | 'duration' | 'spans';
    order: 'asc' | 'desc';
  };
  pagination: {
    limit: number;
    offset: number;
  };
  results?: {
    traces: Trace[];
    total: number;
    took: number;
  };
}

// Critical Path
interface CriticalPath {
  traceId: string;
  totalDuration: number;
  segments: {
    spanId: string;
    service: string;
    operation: string;
    duration: number;
    percentage: number;
    isBottleneck: boolean;
  }[];
  bottleneck: {
    service: string;
    operation: string;
    duration: number;
    percentage: number;
    recommendation?: string;
  };
}

// Latency Analysis
interface LatencyAnalysis {
  service: string;
  operation?: string;
  period: {
    start: Date;
    end: Date;
  };
  percentiles: {
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
    p999: number;
    max: number;
  };
  histogram: {
    bucket: string;
    count: number;
  }[];
  breakdown: {
    component: string;
    avgDuration: number;
    percentage: number;
  }[];
  comparison?: {
    previous: {
      p50: number;
      p95: number;
      p99: number;
    };
    change: {
      p50: number;
      p95: number;
      p99: number;
    };
  };
}

// Error Analysis
interface ErrorAnalysis {
  service: string;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalErrors: number;
    errorRate: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  byType: {
    type: string;
    count: number;
    percentage: number;
    samples: string[];
  }[];
  byOperation: {
    operation: string;
    count: number;
    errorRate: number;
  }[];
  timeline: {
    timestamp: string;
    count: number;
    rate: number;
  }[];
  rootCauses: {
    cause: string;
    count: number;
    services: string[];
    recommendation: string;
  }[];
}

// Service Map
interface ServiceMap {
  nodes: ServiceMapNode[];
  edges: ServiceMapEdge[];
  clusters: {
    name: string;
    services: string[];
  }[];
  statistics: {
    totalServices: number;
    totalDependencies: number;
    avgFanOut: number;
    avgFanIn: number;
  };
}

// Service Map Node
interface ServiceMapNode {
  id: string;
  name: string;
  type: 'service' | 'database' | 'cache' | 'queue' | 'external';
  status: ServiceStatus;
  statistics: {
    requestRate: number;
    errorRate: number;
    avgLatency: number;
  };
  position?: {
    x: number;
    y: number;
  };
}

// Service Map Edge
interface ServiceMapEdge {
  id: string;
  source: string;
  target: string;
  statistics: {
    requestRate: number;
    errorRate: number;
    avgLatency: number;
  };
  operations: string[];
}

// Sampling Rule
interface SamplingRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  enabled: boolean;
  condition: {
    service?: string[];
    operation?: string[];
    tags?: Record<string, string>;
    minDuration?: number;
  };
  rate: {
    type: 'probability' | 'rate_limiting' | 'adaptive';
    value: number;
    maxPerSecond?: number;
  };
  statistics: {
    evaluated: number;
    sampled: number;
    samplingRate: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Alert Rule
interface TracingAlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  condition: {
    type: 'latency' | 'error_rate' | 'throughput' | 'dependency';
    service: string;
    operation?: string;
    threshold: number;
    comparison: 'above' | 'below';
    duration: number;
  };
  notifications: {
    channels: string[];
    throttle: number;
  };
  state: {
    status: 'ok' | 'alerting' | 'pending';
    lastCheck: Date;
    lastAlert?: Date;
    value?: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Tracing Metrics
interface TracingMetrics {
  period: {
    start: Date;
    end: Date;
    granularity: string;
  };
  overview: {
    totalTraces: number;
    totalSpans: number;
    activeServices: number;
    avgTraceDuration: number;
    errorRate: number;
  };
  throughput: {
    tracesPerSecond: number;
    spansPerSecond: number;
    bytesPerSecond: number;
  };
  latency: {
    avgDuration: number;
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
  errors: {
    total: number;
    rate: number;
    byType: Record<string, number>;
  };
  services: {
    name: string;
    requests: number;
    errors: number;
    avgLatency: number;
  }[];
  trends: {
    timestamp: string;
    traces: number;
    avgDuration: number;
    errorRate: number;
  }[];
}

// Trace Comparison
interface TraceComparison {
  baseline: {
    traceId: string;
    duration: number;
    spans: number;
  };
  comparison: {
    traceId: string;
    duration: number;
    spans: number;
  };
  differences: {
    type: 'added' | 'removed' | 'changed';
    service: string;
    operation: string;
    baselineDuration?: number;
    comparisonDuration?: number;
    change?: number;
  }[];
  summary: {
    durationChange: number;
    spanCountChange: number;
    newOperations: string[];
    removedOperations: string[];
    slowedOperations: string[];
    improvedOperations: string[];
  };
}

class DistributedTracingService {
  private static instance: DistributedTracingService;
  private traces: Map<string, Trace> = new Map();
  private spans: Map<string, Span> = new Map();
  private services: Map<string, TracingService> = new Map();
  private dependencies: Map<string, ServiceDependency> = new Map();
  private samplingRules: Map<string, SamplingRule> = new Map();
  private alertRules: Map<string, TracingAlertRule> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): DistributedTracingService {
    if (!DistributedTracingService.instance) {
      DistributedTracingService.instance = new DistributedTracingService();
    }
    return DistributedTracingService.instance;
  }

  /**
   * Generate trace ID
   */
  private generateTraceId(): string {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  /**
   * Generate span ID
   */
  private generateSpanId(): string {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize Services
    const servicesData = [
      { name: 'api-gateway', displayName: 'API Gateway', type: 'gateway' },
      { name: 'user-service', displayName: 'User Service', type: 'backend' },
      { name: 'alert-service', displayName: 'Alert Service', type: 'backend' },
      { name: 'notification-service', displayName: 'Notification Service', type: 'backend' },
      { name: 'auth-service', displayName: 'Auth Service', type: 'backend' },
      { name: 'analytics-service', displayName: 'Analytics Service', type: 'backend' },
      { name: 'postgres-primary', displayName: 'PostgreSQL Primary', type: 'database' },
      { name: 'redis-cache', displayName: 'Redis Cache', type: 'cache' },
    ];

    servicesData.forEach((s, idx) => {
      const service: TracingService = {
        id: `svc-${(idx + 1).toString().padStart(4, '0')}`,
        name: s.name,
        displayName: s.displayName,
        status: idx < 7 ? 'healthy' : 'degraded',
        version: '2.1.0',
        environment: 'production',
        operations: [
          { id: `op-${idx}-1`, name: `${s.name}:GET /api/v1/*`, type: 'http', method: 'GET', path: '/api/v1/*', statistics: { count: Math.floor(Math.random() * 1000000), errorCount: Math.floor(Math.random() * 1000), avgDuration: Math.floor(Math.random() * 50) + 10, p50Duration: Math.floor(Math.random() * 30) + 5, p95Duration: Math.floor(Math.random() * 100) + 30, p99Duration: Math.floor(Math.random() * 200) + 50 }, trends: { latency: 'stable', errorRate: 'stable', throughput: 'increasing' } },
          { id: `op-${idx}-2`, name: `${s.name}:POST /api/v1/*`, type: 'http', method: 'POST', path: '/api/v1/*', statistics: { count: Math.floor(Math.random() * 500000), errorCount: Math.floor(Math.random() * 500), avgDuration: Math.floor(Math.random() * 100) + 20, p50Duration: Math.floor(Math.random() * 50) + 10, p95Duration: Math.floor(Math.random() * 200) + 50, p99Duration: Math.floor(Math.random() * 500) + 100 }, trends: { latency: 'stable', errorRate: 'decreasing', throughput: 'stable' } },
          { id: `op-${idx}-3`, name: `${s.name}:db.query`, type: 'database', statistics: { count: Math.floor(Math.random() * 2000000), errorCount: Math.floor(Math.random() * 100), avgDuration: Math.floor(Math.random() * 20) + 5, p50Duration: Math.floor(Math.random() * 10) + 2, p95Duration: Math.floor(Math.random() * 50) + 10, p99Duration: Math.floor(Math.random() * 100) + 20 }, trends: { latency: 'stable', errorRate: 'stable', throughput: 'increasing' } },
        ],
        dependencies: {
          upstream: idx > 0 ? servicesData.slice(0, idx).map((_, i) => servicesData[i].name).slice(-2) : [],
          downstream: idx < servicesData.length - 1 ? servicesData.slice(idx + 1).map((s) => s.name).slice(0, 2) : [],
        },
        statistics: {
          totalTraces: Math.floor(Math.random() * 10000000),
          totalSpans: Math.floor(Math.random() * 50000000),
          errorRate: Math.random() * 2,
          avgDuration: Math.floor(Math.random() * 100) + 20,
          p50Duration: Math.floor(Math.random() * 50) + 10,
          p95Duration: Math.floor(Math.random() * 200) + 50,
          p99Duration: Math.floor(Math.random() * 500) + 100,
          throughput: Math.floor(Math.random() * 5000) + 500,
        },
        slos: {
          latencyTarget: 200,
          errorRateTarget: 1,
          latencyCompliance: 98 - idx,
          errorRateCompliance: 99 - idx * 0.5,
        },
        health: {
          status: idx < 7 ? 'healthy' : 'degraded',
          lastCheck: new Date(),
          issues: idx >= 7 ? ['Increased latency detected'] : [],
        },
        metadata: {
          team: ['platform', 'backend', 'data'][idx % 3],
          owner: `team-${(idx % 3) + 1}`,
          repository: `https://github.com/rescueping/${s.name}`,
          documentation: `https://docs.rescueping.com/${s.name}`,
          firstSeen: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          lastSeen: new Date(),
        },
      };
      this.services.set(service.id, service);
    });

    // Initialize Dependencies
    const serviceNames = servicesData.map((s) => s.name);
    const dependencyPairs = [
      ['api-gateway', 'user-service'],
      ['api-gateway', 'alert-service'],
      ['api-gateway', 'auth-service'],
      ['user-service', 'postgres-primary'],
      ['user-service', 'redis-cache'],
      ['alert-service', 'notification-service'],
      ['alert-service', 'postgres-primary'],
      ['notification-service', 'redis-cache'],
      ['auth-service', 'postgres-primary'],
      ['analytics-service', 'postgres-primary'],
    ];

    dependencyPairs.forEach((pair, idx) => {
      const dep: ServiceDependency = {
        id: `dep-${(idx + 1).toString().padStart(4, '0')}`,
        source: pair[0],
        target: pair[1],
        operation: 'query',
        statistics: {
          callCount: Math.floor(Math.random() * 10000000),
          errorCount: Math.floor(Math.random() * 10000),
          avgDuration: Math.floor(Math.random() * 50) + 10,
          p95Duration: Math.floor(Math.random() * 200) + 50,
        },
        health: {
          status: idx < 8 ? 'healthy' : 'degraded',
          errorRate: Math.random() * 2,
        },
        lastSeen: new Date(),
      };
      this.dependencies.set(dep.id, dep);
    });

    // Initialize Traces and Spans
    for (let i = 0; i < 100; i++) {
      const traceId = this.generateTraceId();
      const hasError = Math.random() < 0.1;
      const startTime = new Date(Date.now() - Math.random() * 3600000);
      const duration = Math.floor(Math.random() * 500) + 50;

      const traceSpans: Span[] = [];
      const spanCount = Math.floor(Math.random() * 10) + 3;

      // Root span
      const rootSpanId = this.generateSpanId();
      const rootSpan: Span = {
        id: `span-${traceId}-root`,
        traceId,
        spanId: rootSpanId,
        operationName: 'HTTP GET /api/v1/alerts',
        serviceName: 'api-gateway',
        kind: 'server',
        status: hasError ? 'error' : 'ok',
        startTime,
        endTime: new Date(startTime.getTime() + duration),
        duration,
        tags: {
          'http.method': 'GET',
          'http.url': '/api/v1/alerts',
          'http.status_code': hasError ? 500 : 200,
        },
        logs: hasError ? [{ timestamp: new Date(startTime.getTime() + duration - 10), fields: { event: 'error', message: 'Internal server error' } }] : [],
        references: [],
        context: { traceId, spanId: rootSpanId, traceFlags: 1 },
        resource: {
          serviceName: 'api-gateway',
          serviceVersion: '2.1.0',
          hostName: 'api-gateway-pod-1',
          hostIp: '10.0.0.10',
          podName: 'api-gateway-5f7d4c8b9-abc12',
        },
        instrumentation: { library: 'opentelemetry', version: '1.0.0' },
        error: hasError ? { type: 'InternalServerError', message: 'Database connection failed' } : undefined,
        metrics: { selfTime: duration * 0.1, childTime: duration * 0.9 },
      };
      traceSpans.push(rootSpan);
      this.spans.set(rootSpan.id, rootSpan);

      // Child spans
      let currentParentId = rootSpanId;
      const childServices = ['user-service', 'alert-service', 'postgres-primary', 'redis-cache'];
      for (let j = 1; j < spanCount; j++) {
        const childSpanId = this.generateSpanId();
        const childService = childServices[j % childServices.length];
        const childStartOffset = (duration / spanCount) * j;
        const childDuration = Math.floor(Math.random() * (duration / spanCount)) + 5;

        const childSpan: Span = {
          id: `span-${traceId}-${j}`,
          traceId,
          spanId: childSpanId,
          parentSpanId: j === 1 ? rootSpanId : currentParentId,
          operationName: childService.includes('postgres') ? 'db.query' : childService.includes('redis') ? 'cache.get' : `${childService}:processRequest`,
          serviceName: childService,
          kind: j % 2 === 0 ? 'client' : 'server',
          status: hasError && j === spanCount - 1 ? 'error' : 'ok',
          startTime: new Date(startTime.getTime() + childStartOffset),
          endTime: new Date(startTime.getTime() + childStartOffset + childDuration),
          duration: childDuration,
          tags: {
            'component': childService,
          },
          logs: [],
          references: [{ type: 'child_of', traceId, spanId: j === 1 ? rootSpanId : currentParentId }],
          context: { traceId, spanId: childSpanId, traceFlags: 1 },
          resource: {
            serviceName: childService,
            serviceVersion: '2.1.0',
            hostName: `${childService}-pod-1`,
          },
          instrumentation: { library: 'opentelemetry', version: '1.0.0' },
          metrics: { selfTime: childDuration, childTime: 0 },
        };
        traceSpans.push(childSpan);
        this.spans.set(childSpan.id, childSpan);
        currentParentId = childSpanId;
      }

      const trace: Trace = {
        id: `trace-${i + 1}`,
        traceId,
        name: 'GET /api/v1/alerts',
        status: hasError ? 'error' : 'complete',
        startTime,
        endTime: new Date(startTime.getTime() + duration),
        duration,
        root: {
          service: 'api-gateway',
          operation: 'HTTP GET /api/v1/alerts',
          spanId: rootSpanId,
        },
        spans: traceSpans,
        services: [...new Set(traceSpans.map((s) => s.serviceName))],
        summary: {
          totalSpans: traceSpans.length,
          errorSpans: traceSpans.filter((s) => s.status === 'error').length,
          avgDuration: duration / traceSpans.length,
          criticalPath: traceSpans.slice(0, 3).map((s) => s.operationName),
        },
        tags: { 'http.method': 'GET', 'user.id': `user-${Math.floor(Math.random() * 1000)}` },
        baggage: { 'request.id': `req-${Math.random().toString(36).substr(2, 9)}` },
        sampling: { decision: 'sampled', probability: 0.1 },
        metadata: { receivedAt: new Date(), indexedAt: new Date(), source: 'otel-collector' },
      };
      this.traces.set(trace.id, trace);
    }

    // Initialize Sampling Rules
    const samplingRulesData = [
      { name: 'Default Sampling', rate: 0.1, condition: {} },
      { name: 'Error Sampling', rate: 1.0, condition: { tags: { 'error': 'true' } } },
      { name: 'Slow Request Sampling', rate: 1.0, condition: { minDuration: 1000 } },
      { name: 'Auth Service High Sampling', rate: 0.5, condition: { service: ['auth-service'] } },
    ];

    samplingRulesData.forEach((r, idx) => {
      const rule: SamplingRule = {
        id: `sample-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name,
        description: `Sampling rule: ${r.name}`,
        priority: (idx + 1) * 10,
        enabled: true,
        condition: r.condition,
        rate: {
          type: idx === 0 ? 'probability' : idx === 2 ? 'rate_limiting' : 'probability',
          value: r.rate,
          maxPerSecond: idx === 2 ? 100 : undefined,
        },
        statistics: {
          evaluated: Math.floor(Math.random() * 10000000),
          sampled: Math.floor(Math.random() * 1000000),
          samplingRate: r.rate * 100,
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.samplingRules.set(rule.id, rule);
    });

    // Initialize Alert Rules
    const alertRulesData = [
      { name: 'High Latency Alert', type: 'latency', threshold: 500, service: 'api-gateway' },
      { name: 'Error Rate Alert', type: 'error_rate', threshold: 5, service: 'user-service' },
      { name: 'Database Latency', type: 'latency', threshold: 100, service: 'postgres-primary' },
      { name: 'Low Throughput', type: 'throughput', threshold: 100, service: 'alert-service' },
    ];

    alertRulesData.forEach((a, idx) => {
      const rule: TracingAlertRule = {
        id: `alert-${(idx + 1).toString().padStart(4, '0')}`,
        name: a.name,
        description: `Alert for ${a.name.toLowerCase()}`,
        enabled: true,
        severity: ['critical', 'high', 'medium', 'low'][idx % 4] as TracingAlertRule['severity'],
        condition: {
          type: a.type as TracingAlertRule['condition']['type'],
          service: a.service,
          threshold: a.threshold,
          comparison: a.type === 'throughput' ? 'below' : 'above',
          duration: 300,
        },
        notifications: {
          channels: ['slack', 'pagerduty'],
          throttle: 300,
        },
        state: {
          status: idx === 0 ? 'alerting' : 'ok',
          lastCheck: new Date(),
          lastAlert: idx === 0 ? new Date(Date.now() - 300000) : undefined,
          value: idx === 0 ? 650 : undefined,
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.alertRules.set(rule.id, rule);
    });
  }

  /**
   * Get Traces
   */
  public getTraces(filter?: { service?: string; status?: TraceStatus; limit?: number }): Trace[] {
    let traces = Array.from(this.traces.values());
    if (filter?.service) traces = traces.filter((t) => t.services.includes(filter.service!));
    if (filter?.status) traces = traces.filter((t) => t.status === filter.status);
    traces = traces.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    if (filter?.limit) traces = traces.slice(0, filter.limit);
    return traces;
  }

  /**
   * Get Trace
   */
  public getTrace(id: string): Trace | undefined {
    return this.traces.get(id);
  }

  /**
   * Get Trace by Trace ID
   */
  public getTraceByTraceId(traceId: string): Trace | undefined {
    return Array.from(this.traces.values()).find((t) => t.traceId === traceId);
  }

  /**
   * Get Spans
   */
  public getSpans(filter?: { traceId?: string; serviceName?: string; status?: SpanStatus }): Span[] {
    let spans = Array.from(this.spans.values());
    if (filter?.traceId) spans = spans.filter((s) => s.traceId === filter.traceId);
    if (filter?.serviceName) spans = spans.filter((s) => s.serviceName === filter.serviceName);
    if (filter?.status) spans = spans.filter((s) => s.status === filter.status);
    return spans.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  /**
   * Get Services
   */
  public getServices(filter?: { status?: ServiceStatus }): TracingService[] {
    let services = Array.from(this.services.values());
    if (filter?.status) services = services.filter((s) => s.status === filter.status);
    return services;
  }

  /**
   * Get Service
   */
  public getService(name: string): TracingService | undefined {
    return Array.from(this.services.values()).find((s) => s.name === name);
  }

  /**
   * Get Dependencies
   */
  public getDependencies(filter?: { source?: string; target?: string }): ServiceDependency[] {
    let deps = Array.from(this.dependencies.values());
    if (filter?.source) deps = deps.filter((d) => d.source === filter.source);
    if (filter?.target) deps = deps.filter((d) => d.target === filter.target);
    return deps;
  }

  /**
   * Get Service Map
   */
  public getServiceMap(): ServiceMap {
    const services = Array.from(this.services.values());
    const deps = Array.from(this.dependencies.values());

    return {
      nodes: services.map((s) => ({
        id: s.name,
        name: s.displayName,
        type: s.name.includes('postgres') ? 'database' : s.name.includes('redis') ? 'cache' : 'service',
        status: s.status,
        statistics: {
          requestRate: s.statistics.throughput,
          errorRate: s.statistics.errorRate,
          avgLatency: s.statistics.avgDuration,
        },
      })),
      edges: deps.map((d) => ({
        id: d.id,
        source: d.source,
        target: d.target,
        statistics: {
          requestRate: d.statistics.callCount / 3600,
          errorRate: (d.statistics.errorCount / d.statistics.callCount) * 100,
          avgLatency: d.statistics.avgDuration,
        },
        operations: [d.operation],
      })),
      clusters: [
        { name: 'API Layer', services: ['api-gateway'] },
        { name: 'Business Logic', services: ['user-service', 'alert-service', 'notification-service', 'auth-service', 'analytics-service'] },
        { name: 'Data Layer', services: ['postgres-primary', 'redis-cache'] },
      ],
      statistics: {
        totalServices: services.length,
        totalDependencies: deps.length,
        avgFanOut: deps.length / services.length,
        avgFanIn: deps.length / services.length,
      },
    };
  }

  /**
   * Get Latency Analysis
   */
  public getLatencyAnalysis(service: string): LatencyAnalysis {
    const svc = this.getService(service);
    if (!svc) throw new Error('Service not found');

    return {
      service,
      period: { start: new Date(Date.now() - 3600000), end: new Date() },
      percentiles: {
        p50: svc.statistics.p50Duration,
        p75: svc.statistics.p50Duration * 1.5,
        p90: svc.statistics.p95Duration * 0.9,
        p95: svc.statistics.p95Duration,
        p99: svc.statistics.p99Duration,
        p999: svc.statistics.p99Duration * 1.5,
        max: svc.statistics.p99Duration * 2,
      },
      histogram: [
        { bucket: '0-10ms', count: Math.floor(Math.random() * 10000) },
        { bucket: '10-50ms', count: Math.floor(Math.random() * 50000) },
        { bucket: '50-100ms', count: Math.floor(Math.random() * 30000) },
        { bucket: '100-500ms', count: Math.floor(Math.random() * 10000) },
        { bucket: '500ms+', count: Math.floor(Math.random() * 1000) },
      ],
      breakdown: [
        { component: 'Application logic', avgDuration: svc.statistics.avgDuration * 0.4, percentage: 40 },
        { component: 'Database queries', avgDuration: svc.statistics.avgDuration * 0.35, percentage: 35 },
        { component: 'Cache operations', avgDuration: svc.statistics.avgDuration * 0.15, percentage: 15 },
        { component: 'Network', avgDuration: svc.statistics.avgDuration * 0.1, percentage: 10 },
      ],
    };
  }

  /**
   * Get Sampling Rules
   */
  public getSamplingRules(): SamplingRule[] {
    return Array.from(this.samplingRules.values()).sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get Alert Rules
   */
  public getAlertRules(): TracingAlertRule[] {
    return Array.from(this.alertRules.values());
  }

  /**
   * Get Metrics
   */
  public getMetrics(): TracingMetrics {
    const traces = Array.from(this.traces.values());
    const services = Array.from(this.services.values());
    const errorTraces = traces.filter((t) => t.status === 'error');

    return {
      period: { start: new Date(Date.now() - 3600000), end: new Date(), granularity: '1m' },
      overview: {
        totalTraces: traces.length,
        totalSpans: traces.reduce((sum, t) => sum + t.spans.length, 0),
        activeServices: services.filter((s) => s.status === 'healthy').length,
        avgTraceDuration: traces.reduce((sum, t) => sum + t.duration, 0) / traces.length,
        errorRate: (errorTraces.length / traces.length) * 100,
      },
      throughput: {
        tracesPerSecond: traces.length / 3600,
        spansPerSecond: traces.reduce((sum, t) => sum + t.spans.length, 0) / 3600,
        bytesPerSecond: Math.floor(Math.random() * 10000000),
      },
      latency: {
        avgDuration: traces.reduce((sum, t) => sum + t.duration, 0) / traces.length,
        p50: Math.floor(Math.random() * 50) + 20,
        p90: Math.floor(Math.random() * 100) + 50,
        p95: Math.floor(Math.random() * 200) + 100,
        p99: Math.floor(Math.random() * 500) + 200,
      },
      errors: {
        total: errorTraces.length,
        rate: (errorTraces.length / traces.length) * 100,
        byType: { 'InternalServerError': 5, 'Timeout': 3, 'NotFound': 2 },
      },
      services: services.map((s) => ({
        name: s.name,
        requests: s.statistics.totalTraces,
        errors: Math.floor(s.statistics.totalTraces * s.statistics.errorRate / 100),
        avgLatency: s.statistics.avgDuration,
      })),
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

export const distributedTracingService = DistributedTracingService.getInstance();
export type {
  SpanKind,
  SpanStatus,
  TraceStatus,
  ServiceStatus,
  SamplingDecision,
  Trace,
  Span,
  SpanLog,
  SpanReference,
  SpanContext,
  TracingService,
  ServiceOperation,
  ServiceDependency,
  TraceQuery,
  CriticalPath,
  LatencyAnalysis,
  ErrorAnalysis,
  ServiceMap,
  ServiceMapNode,
  ServiceMapEdge,
  SamplingRule,
  TracingAlertRule,
  TracingMetrics,
  TraceComparison,
};
