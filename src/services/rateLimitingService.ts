/**
 * Rate Limiting Service
 * Comprehensive rate limiting, throttling, and quota management
 */

// Rate Limit Strategy
type RateLimitStrategy = 'fixed_window' | 'sliding_window' | 'token_bucket' | 'leaky_bucket' | 'concurrent';

// Rate Limit Scope
type RateLimitScope = 'global' | 'per_user' | 'per_ip' | 'per_api_key' | 'per_endpoint' | 'per_tenant';

// Limit Status
type LimitStatus = 'within_limit' | 'warning' | 'exceeded' | 'blocked';

// Action Type
type ActionType = 'allow' | 'throttle' | 'reject' | 'queue';

// Rate Limit Policy
interface RateLimitPolicy {
  id: string;
  name: string;
  description: string;
  strategy: RateLimitStrategy;
  scope: RateLimitScope;
  enabled: boolean;
  priority: number;
  limits: RateLimit[];
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  exemptions: PolicyExemption[];
  quotas: QuotaConfig[];
  burstConfig?: BurstConfig;
  retryAfterConfig: RetryAfterConfig;
  headers: HeaderConfig;
  metrics: PolicyMetrics;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    version: number;
  };
}

// Rate Limit
interface RateLimit {
  id: string;
  name: string;
  window: {
    size: number;
    unit: 'second' | 'minute' | 'hour' | 'day';
  };
  maxRequests: number;
  warningThreshold: number;
  costPerRequest?: number;
  enabled: boolean;
}

// Policy Condition
interface PolicyCondition {
  id: string;
  type: 'endpoint' | 'method' | 'header' | 'query_param' | 'body_field' | 'user_attribute' | 'time_of_day' | 'geo_location';
  field?: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'starts_with' | 'ends_with' | 'in_list' | 'regex' | 'between';
  value: unknown;
  negate?: boolean;
}

// Policy Action
interface PolicyAction {
  id: string;
  type: ActionType;
  config: {
    throttleDelay?: number;
    queuePriority?: number;
    rejectStatusCode?: number;
    rejectMessage?: string;
    redirectUrl?: string;
    customResponse?: Record<string, unknown>;
  };
  notification?: {
    enabled: boolean;
    channels: ('email' | 'webhook' | 'slack')[];
    template: string;
  };
}

// Policy Exemption
interface PolicyExemption {
  id: string;
  type: 'user' | 'ip' | 'api_key' | 'user_agent' | 'path' | 'role';
  value: string | string[];
  reason: string;
  expiresAt?: Date;
  createdBy: string;
  createdAt: Date;
}

// Quota Config
interface QuotaConfig {
  id: string;
  name: string;
  type: 'requests' | 'bandwidth' | 'compute_units' | 'custom';
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  limit: number;
  unit?: string;
  cost?: {
    base: number;
    overage: number;
    currency: string;
  };
  resetDay?: number;
  rollover?: {
    enabled: boolean;
    maxRollover: number;
  };
}

// Burst Config
interface BurstConfig {
  enabled: boolean;
  maxBurst: number;
  refillRate: number;
  refillInterval: number;
  borrowingEnabled?: boolean;
  maxBorrow?: number;
}

// Retry After Config
interface RetryAfterConfig {
  mode: 'fixed' | 'dynamic' | 'exponential';
  baseDelay: number;
  maxDelay: number;
  jitter?: boolean;
  jitterRange?: number;
}

// Header Config
interface HeaderConfig {
  enabled: boolean;
  limitHeader: string;
  remainingHeader: string;
  resetHeader: string;
  retryAfterHeader: string;
  policyHeader?: string;
  customHeaders?: Record<string, string>;
}

// Policy Metrics
interface PolicyMetrics {
  totalRequests: number;
  allowedRequests: number;
  throttledRequests: number;
  rejectedRequests: number;
  queuedRequests: number;
  avgLatency: number;
  last24h: {
    requests: number;
    allowed: number;
    rejected: number;
  };
  byEndpoint: Record<string, {
    requests: number;
    rejected: number;
  }>;
}

// Rate Limit Client
interface RateLimitClient {
  id: string;
  identifier: string;
  type: 'user' | 'ip' | 'api_key' | 'tenant';
  status: LimitStatus;
  tier: string;
  currentUsage: ClientUsage;
  quotaUsage: QuotaUsage[];
  limits: ClientLimit[];
  history: UsageHistory[];
  violations: Violation[];
  metadata: {
    firstSeen: Date;
    lastSeen: Date;
    blocked?: boolean;
    blockedAt?: Date;
    blockedReason?: string;
    unblockAt?: Date;
  };
}

// Client Usage
interface ClientUsage {
  currentWindow: {
    requests: number;
    windowStart: Date;
    windowEnd: Date;
  };
  tokensRemaining?: number;
  concurrentRequests?: number;
  bandwidth?: {
    used: number;
    limit: number;
    unit: string;
  };
}

// Quota Usage
interface QuotaUsage {
  quotaId: string;
  quotaName: string;
  period: string;
  used: number;
  limit: number;
  remaining: number;
  resetsAt: Date;
  overage?: number;
  cost?: number;
}

// Client Limit
interface ClientLimit {
  policyId: string;
  policyName: string;
  limitId: string;
  limitName: string;
  maxRequests: number;
  currentRequests: number;
  remaining: number;
  resetsAt: Date;
  status: LimitStatus;
}

// Usage History
interface UsageHistory {
  timestamp: Date;
  requests: number;
  allowed: number;
  rejected: number;
  avgLatency: number;
  peakConcurrent?: number;
}

// Violation
interface Violation {
  id: string;
  timestamp: Date;
  policyId: string;
  policyName: string;
  type: 'rate_exceeded' | 'quota_exceeded' | 'burst_exceeded' | 'concurrent_exceeded';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: {
    limit: number;
    actual: number;
    endpoint?: string;
    action: ActionType;
  };
  resolved: boolean;
  resolvedAt?: Date;
}

// Rate Limit Result
interface RateLimitResult {
  allowed: boolean;
  action: ActionType;
  status: LimitStatus;
  clientId: string;
  policyId?: string;
  remaining: number;
  limit: number;
  resetAt: Date;
  retryAfter?: number;
  headers: Record<string, string>;
  reason?: string;
  queuePosition?: number;
}

// Rate Limit Request
interface RateLimitRequest {
  clientId: string;
  clientType: 'user' | 'ip' | 'api_key' | 'tenant';
  endpoint: string;
  method: string;
  cost?: number;
  metadata?: Record<string, unknown>;
}

// Tier Configuration
interface TierConfiguration {
  id: string;
  name: string;
  description: string;
  priority: number;
  limits: {
    requestsPerSecond: number;
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
    requestsPerMonth: number;
  };
  quotas: {
    bandwidth: number;
    computeUnits: number;
    storage: number;
  };
  burst: {
    enabled: boolean;
    multiplier: number;
    duration: number;
  };
  features: string[];
  price?: {
    monthly: number;
    yearly: number;
    currency: string;
  };
}

// Queue Entry
interface QueueEntry {
  id: string;
  clientId: string;
  request: RateLimitRequest;
  priority: number;
  enqueuedAt: Date;
  estimatedProcessTime?: Date;
  timeout: Date;
  status: 'waiting' | 'processing' | 'completed' | 'expired' | 'cancelled';
  position: number;
}

// Rate Limit Analytics
interface RateLimitAnalytics {
  overview: {
    totalRequests: number;
    allowedRequests: number;
    throttledRequests: number;
    rejectedRequests: number;
    allowRate: number;
    rejectRate: number;
  };
  byPolicy: {
    policyId: string;
    policyName: string;
    requests: number;
    allowed: number;
    rejected: number;
  }[];
  byClient: {
    clientId: string;
    clientType: string;
    requests: number;
    violations: number;
    status: LimitStatus;
  }[];
  byEndpoint: {
    endpoint: string;
    method: string;
    requests: number;
    rejected: number;
    avgLatency: number;
  }[];
  trends: {
    timestamp: Date;
    requests: number;
    allowed: number;
    rejected: number;
    avgLatency: number;
  }[];
  topViolators: {
    clientId: string;
    violations: number;
    lastViolation: Date;
    status: LimitStatus;
  }[];
}

// Distributed Rate Limiter Config
interface DistributedConfig {
  enabled: boolean;
  backend: 'redis' | 'memcached' | 'custom';
  syncInterval: number;
  failoverMode: 'local' | 'allow' | 'reject';
  nodes: {
    host: string;
    port: number;
    weight: number;
    status: 'active' | 'down' | 'draining';
  }[];
  consistency: 'eventual' | 'strong';
}

// Alert Configuration
interface AlertConfiguration {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    metric: 'reject_rate' | 'violation_count' | 'queue_depth' | 'latency';
    operator: 'greater_than' | 'less_than' | 'equals';
    threshold: number;
    duration: number;
  }[];
  actions: {
    type: 'notify' | 'escalate' | 'auto_scale' | 'block';
    config: Record<string, unknown>;
  }[];
  cooldown: number;
  lastTriggered?: Date;
}

// Rate Limit Statistics
interface RateLimitStatistics {
  global: {
    totalPolicies: number;
    activePolicies: number;
    totalClients: number;
    activeClients: number;
    blockedClients: number;
  };
  usage: {
    last24h: {
      totalRequests: number;
      allowedRequests: number;
      rejectedRequests: number;
      throttledRequests: number;
    };
    last7d: {
      totalRequests: number;
      allowedRequests: number;
      rejectedRequests: number;
      throttledRequests: number;
    };
  };
  performance: {
    avgCheckLatency: number;
    p50Latency: number;
    p95Latency: number;
    p99Latency: number;
    cacheHitRate: number;
  };
  violations: {
    total: number;
    last24h: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
  };
  trends: {
    date: string;
    requests: number;
    allowed: number;
    rejected: number;
    violations: number;
  }[];
}

class RateLimitingService {
  private static instance: RateLimitingService;
  private policies: Map<string, RateLimitPolicy> = new Map();
  private clients: Map<string, RateLimitClient> = new Map();
  private tiers: Map<string, TierConfiguration> = new Map();
  private queue: Map<string, QueueEntry> = new Map();
  private alerts: Map<string, AlertConfiguration> = new Map();
  private distributedConfig: DistributedConfig | null = null;
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): RateLimitingService {
    if (!RateLimitingService.instance) {
      RateLimitingService.instance = new RateLimitingService();
    }
    return RateLimitingService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Tier Configurations
    const tiersData = [
      { name: 'Free', rps: 10, rpm: 100, rph: 1000, rpd: 10000, price: 0 },
      { name: 'Basic', rps: 50, rpm: 500, rph: 5000, rpd: 50000, price: 29 },
      { name: 'Pro', rps: 200, rpm: 2000, rph: 20000, rpd: 200000, price: 99 },
      { name: 'Enterprise', rps: 1000, rpm: 10000, rph: 100000, rpd: 1000000, price: 499 },
    ];

    tiersData.forEach((t, idx) => {
      const tier: TierConfiguration = {
        id: `tier-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: `${t.name} tier with ${t.rpm} requests per minute`,
        priority: idx + 1,
        limits: {
          requestsPerSecond: t.rps,
          requestsPerMinute: t.rpm,
          requestsPerHour: t.rph,
          requestsPerDay: t.rpd,
          requestsPerMonth: t.rpd * 30,
        },
        quotas: {
          bandwidth: (idx + 1) * 10 * 1024 * 1024 * 1024,
          computeUnits: (idx + 1) * 10000,
          storage: (idx + 1) * 1024 * 1024 * 1024,
        },
        burst: {
          enabled: idx > 0,
          multiplier: 1 + (idx * 0.5),
          duration: 10,
        },
        features: idx === 0 ? ['basic_api'] : idx === 1 ? ['basic_api', 'webhooks'] : idx === 2 ? ['basic_api', 'webhooks', 'analytics'] : ['basic_api', 'webhooks', 'analytics', 'priority_support', 'custom_limits'],
        price: {
          monthly: t.price,
          yearly: Math.floor(t.price * 12 * 0.8),
          currency: 'USD',
        },
      };
      this.tiers.set(tier.id, tier);
    });

    // Initialize Rate Limit Policies
    const policiesData = [
      { name: 'Global Rate Limit', strategy: 'sliding_window', scope: 'global' },
      { name: 'Per User Limit', strategy: 'token_bucket', scope: 'per_user' },
      { name: 'API Key Limit', strategy: 'fixed_window', scope: 'per_api_key' },
      { name: 'IP Based Limit', strategy: 'leaky_bucket', scope: 'per_ip' },
      { name: 'Endpoint Specific', strategy: 'sliding_window', scope: 'per_endpoint' },
      { name: 'Concurrent Request Limit', strategy: 'concurrent', scope: 'per_user' },
    ];

    policiesData.forEach((p, idx) => {
      const policy: RateLimitPolicy = {
        id: `policy-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: `${p.name} policy using ${p.strategy} strategy`,
        strategy: p.strategy as RateLimitStrategy,
        scope: p.scope as RateLimitScope,
        enabled: true,
        priority: idx + 1,
        limits: [
          {
            id: `limit-${idx}-1`,
            name: 'Per Second',
            window: { size: 1, unit: 'second' },
            maxRequests: 100 * (idx + 1),
            warningThreshold: 80,
            enabled: true,
          },
          {
            id: `limit-${idx}-2`,
            name: 'Per Minute',
            window: { size: 1, unit: 'minute' },
            maxRequests: 1000 * (idx + 1),
            warningThreshold: 80,
            enabled: true,
          },
          {
            id: `limit-${idx}-3`,
            name: 'Per Hour',
            window: { size: 1, unit: 'hour' },
            maxRequests: 10000 * (idx + 1),
            warningThreshold: 80,
            enabled: true,
          },
        ],
        conditions: p.scope === 'per_endpoint' ? [
          {
            id: `cond-${idx}-1`,
            type: 'endpoint',
            operator: 'starts_with',
            value: '/api/v2/',
          },
        ] : [],
        actions: [
          {
            id: `action-${idx}-1`,
            type: 'throttle',
            config: {
              throttleDelay: 1000,
              rejectStatusCode: 429,
              rejectMessage: 'Rate limit exceeded. Please try again later.',
            },
            notification: {
              enabled: idx < 3,
              channels: ['webhook'],
              template: 'rate_limit_warning',
            },
          },
          {
            id: `action-${idx}-2`,
            type: 'reject',
            config: {
              rejectStatusCode: 429,
              rejectMessage: 'Too many requests. Rate limit exceeded.',
              customResponse: {
                error: 'rate_limit_exceeded',
                message: 'You have exceeded the rate limit',
                retry_after: 60,
              },
            },
          },
        ],
        exemptions: [
          {
            id: `exempt-${idx}-1`,
            type: 'role',
            value: ['admin', 'system'],
            reason: 'Administrative access',
            createdBy: 'system',
            createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          },
        ],
        quotas: [
          {
            id: `quota-${idx}-1`,
            name: 'Monthly Requests',
            type: 'requests',
            period: 'monthly',
            limit: 100000 * (idx + 1),
            resetDay: 1,
            rollover: {
              enabled: idx > 1,
              maxRollover: 50000,
            },
          },
          {
            id: `quota-${idx}-2`,
            name: 'Daily Bandwidth',
            type: 'bandwidth',
            period: 'daily',
            limit: 1024 * 1024 * 1024 * (idx + 1),
            unit: 'bytes',
          },
        ],
        burstConfig: p.strategy === 'token_bucket' ? {
          enabled: true,
          maxBurst: 50 * (idx + 1),
          refillRate: 10 * (idx + 1),
          refillInterval: 1000,
          borrowingEnabled: idx > 2,
          maxBorrow: 20,
        } : undefined,
        retryAfterConfig: {
          mode: 'dynamic',
          baseDelay: 1000,
          maxDelay: 60000,
          jitter: true,
          jitterRange: 500,
        },
        headers: {
          enabled: true,
          limitHeader: 'X-RateLimit-Limit',
          remainingHeader: 'X-RateLimit-Remaining',
          resetHeader: 'X-RateLimit-Reset',
          retryAfterHeader: 'Retry-After',
          policyHeader: 'X-RateLimit-Policy',
        },
        metrics: {
          totalRequests: Math.floor(Math.random() * 10000000) + 1000000,
          allowedRequests: Math.floor(Math.random() * 9000000) + 900000,
          throttledRequests: Math.floor(Math.random() * 500000) + 50000,
          rejectedRequests: Math.floor(Math.random() * 100000) + 10000,
          queuedRequests: Math.floor(Math.random() * 50000) + 5000,
          avgLatency: Math.random() * 5 + 0.5,
          last24h: {
            requests: Math.floor(Math.random() * 500000) + 50000,
            allowed: Math.floor(Math.random() * 450000) + 45000,
            rejected: Math.floor(Math.random() * 10000) + 1000,
          },
          byEndpoint: {
            '/api/v2/alerts': { requests: Math.floor(Math.random() * 100000), rejected: Math.floor(Math.random() * 5000) },
            '/api/v2/users': { requests: Math.floor(Math.random() * 50000), rejected: Math.floor(Math.random() * 2000) },
            '/api/v2/incidents': { requests: Math.floor(Math.random() * 75000), rejected: Math.floor(Math.random() * 3000) },
          },
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          version: Math.floor(Math.random() * 10) + 1,
        },
      };
      this.policies.set(policy.id, policy);
    });

    // Initialize Rate Limit Clients
    const clientsData = [
      { identifier: 'user-001', type: 'user', tier: 'Pro' },
      { identifier: 'user-002', type: 'user', tier: 'Basic' },
      { identifier: 'api-key-abc123', type: 'api_key', tier: 'Enterprise' },
      { identifier: '192.168.1.100', type: 'ip', tier: 'Free' },
      { identifier: 'tenant-acme', type: 'tenant', tier: 'Pro' },
      { identifier: 'user-003', type: 'user', tier: 'Free' },
      { identifier: '10.0.0.50', type: 'ip', tier: 'Basic' },
    ];

    clientsData.forEach((c, idx) => {
      const tierConfig = Array.from(this.tiers.values()).find((t) => t.name === c.tier);
      const client: RateLimitClient = {
        id: `client-${(idx + 1).toString().padStart(4, '0')}`,
        identifier: c.identifier,
        type: c.type as RateLimitClient['type'],
        status: idx === 3 ? 'exceeded' : idx === 5 ? 'warning' : 'within_limit',
        tier: c.tier,
        currentUsage: {
          currentWindow: {
            requests: Math.floor(Math.random() * (tierConfig?.limits.requestsPerMinute || 100)),
            windowStart: new Date(Date.now() - 30 * 1000),
            windowEnd: new Date(Date.now() + 30 * 1000),
          },
          tokensRemaining: Math.floor(Math.random() * 100) + 10,
          concurrentRequests: Math.floor(Math.random() * 10),
          bandwidth: {
            used: Math.floor(Math.random() * 1024 * 1024 * 100),
            limit: 1024 * 1024 * 1024,
            unit: 'bytes',
          },
        },
        quotaUsage: [
          {
            quotaId: 'quota-monthly',
            quotaName: 'Monthly Requests',
            period: 'monthly',
            used: Math.floor(Math.random() * 50000) + 10000,
            limit: 100000,
            remaining: Math.floor(Math.random() * 50000) + 40000,
            resetsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          },
        ],
        limits: Array.from(this.policies.values()).slice(0, 3).map((p) => ({
          policyId: p.id,
          policyName: p.name,
          limitId: p.limits[0].id,
          limitName: p.limits[0].name,
          maxRequests: p.limits[0].maxRequests,
          currentRequests: Math.floor(Math.random() * p.limits[0].maxRequests * 0.8),
          remaining: Math.floor(p.limits[0].maxRequests * 0.2),
          resetsAt: new Date(Date.now() + 60 * 1000),
          status: idx === 3 ? 'exceeded' : 'within_limit',
        })),
        history: Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
          requests: Math.floor(Math.random() * 5000) + 500,
          allowed: Math.floor(Math.random() * 4500) + 450,
          rejected: Math.floor(Math.random() * 100) + 10,
          avgLatency: Math.random() * 50 + 10,
          peakConcurrent: Math.floor(Math.random() * 20) + 5,
        })),
        violations: idx === 3 || idx === 5 ? [
          {
            id: `viol-${idx}-1`,
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
            policyId: 'policy-0001',
            policyName: 'Global Rate Limit',
            type: 'rate_exceeded',
            severity: idx === 3 ? 'high' : 'medium',
            details: {
              limit: 1000,
              actual: 1200 + Math.floor(Math.random() * 500),
              endpoint: '/api/v2/alerts',
              action: 'reject',
            },
            resolved: idx === 5,
            resolvedAt: idx === 5 ? new Date() : undefined,
          },
        ] : [],
        metadata: {
          firstSeen: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
          blocked: idx === 3,
          blockedAt: idx === 3 ? new Date(Date.now() - 30 * 60 * 1000) : undefined,
          blockedReason: idx === 3 ? 'Exceeded rate limit multiple times' : undefined,
          unblockAt: idx === 3 ? new Date(Date.now() + 30 * 60 * 1000) : undefined,
        },
      };
      this.clients.set(client.id, client);
    });

    // Initialize Alert Configurations
    const alertsData = [
      { name: 'High Rejection Rate', metric: 'reject_rate', threshold: 10 },
      { name: 'Queue Depth Alert', metric: 'queue_depth', threshold: 100 },
      { name: 'High Latency Alert', metric: 'latency', threshold: 500 },
      { name: 'Violation Spike', metric: 'violation_count', threshold: 50 },
    ];

    alertsData.forEach((a, idx) => {
      const alert: AlertConfiguration = {
        id: `alert-${(idx + 1).toString().padStart(4, '0')}`,
        name: a.name,
        enabled: true,
        conditions: [
          {
            metric: a.metric as AlertConfiguration['conditions'][0]['metric'],
            operator: 'greater_than',
            threshold: a.threshold,
            duration: 300,
          },
        ],
        actions: [
          {
            type: 'notify',
            config: {
              channels: ['slack', 'email'],
              recipients: ['ops-team@rescueping.com'],
            },
          },
        ],
        cooldown: 900,
        lastTriggered: idx % 2 === 0 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : undefined,
      };
      this.alerts.set(alert.id, alert);
    });

    // Initialize Queue
    for (let i = 0; i < 5; i++) {
      const entry: QueueEntry = {
        id: `queue-${this.generateId()}`,
        clientId: `client-${((i % 7) + 1).toString().padStart(4, '0')}`,
        request: {
          clientId: `client-${((i % 7) + 1).toString().padStart(4, '0')}`,
          clientType: 'user',
          endpoint: '/api/v2/alerts',
          method: 'GET',
        },
        priority: Math.floor(Math.random() * 10) + 1,
        enqueuedAt: new Date(Date.now() - Math.random() * 60 * 1000),
        estimatedProcessTime: new Date(Date.now() + Math.random() * 30 * 1000),
        timeout: new Date(Date.now() + 60 * 1000),
        status: 'waiting',
        position: i + 1,
      };
      this.queue.set(entry.id, entry);
    }

    // Initialize Distributed Config
    this.distributedConfig = {
      enabled: true,
      backend: 'redis',
      syncInterval: 1000,
      failoverMode: 'local',
      nodes: [
        { host: 'redis-1.rescueping.local', port: 6379, weight: 100, status: 'active' },
        { host: 'redis-2.rescueping.local', port: 6379, weight: 100, status: 'active' },
        { host: 'redis-3.rescueping.local', port: 6379, weight: 50, status: 'draining' },
      ],
      consistency: 'eventual',
    };
  }

  // Check Rate Limit
  public checkRateLimit(request: RateLimitRequest): RateLimitResult {
    const client = this.getClientByIdentifier(request.clientId, request.clientType);
    const applicablePolicies = this.getApplicablePolicies(request);
    
    if (!client) {
      return this.createAllowResult(request.clientId);
    }

    if (client.metadata.blocked) {
      return this.createBlockedResult(client);
    }

    for (const policy of applicablePolicies) {
      if (!policy.enabled) continue;
      
      if (this.isPolicyExempt(policy, client)) continue;

      const result = this.evaluatePolicy(policy, client, request);
      if (!result.allowed) {
        this.recordViolation(client, policy, result);
        return result;
      }
    }

    this.incrementUsage(client, request);
    return this.createAllowResult(client.id);
  }

  private getApplicablePolicies(request: RateLimitRequest): RateLimitPolicy[] {
    return Array.from(this.policies.values())
      .filter((p) => p.enabled)
      .filter((p) => this.matchesPolicyConditions(p, request))
      .sort((a, b) => a.priority - b.priority);
  }

  private matchesPolicyConditions(policy: RateLimitPolicy, request: RateLimitRequest): boolean {
    if (policy.conditions.length === 0) return true;
    
    return policy.conditions.every((condition) => {
      switch (condition.type) {
        case 'endpoint':
          return this.matchCondition(request.endpoint, condition);
        case 'method':
          return this.matchCondition(request.method, condition);
        default:
          return true;
      }
    });
  }

  private matchCondition(value: string, condition: PolicyCondition): boolean {
    let result = false;
    switch (condition.operator) {
      case 'equals':
        result = value === condition.value;
        break;
      case 'starts_with':
        result = value.startsWith(String(condition.value));
        break;
      case 'contains':
        result = value.includes(String(condition.value));
        break;
      default:
        result = true;
    }
    return condition.negate ? !result : result;
  }

  private isPolicyExempt(policy: RateLimitPolicy, client: RateLimitClient): boolean {
    return policy.exemptions.some((exemption) => {
      if (exemption.expiresAt && exemption.expiresAt < new Date()) return false;
      
      switch (exemption.type) {
        case 'user':
          return client.type === 'user' && (Array.isArray(exemption.value) ? exemption.value.includes(client.identifier) : exemption.value === client.identifier);
        case 'ip':
          return client.type === 'ip' && (Array.isArray(exemption.value) ? exemption.value.includes(client.identifier) : exemption.value === client.identifier);
        default:
          return false;
      }
    });
  }

  private evaluatePolicy(policy: RateLimitPolicy, client: RateLimitClient, _request: RateLimitRequest): RateLimitResult {
    for (const limit of policy.limits) {
      if (!limit.enabled) continue;
      
      const clientLimit = client.limits.find((l) => l.limitId === limit.id);
      if (clientLimit && clientLimit.currentRequests >= limit.maxRequests) {
        return {
          allowed: false,
          action: 'reject',
          status: 'exceeded',
          clientId: client.id,
          policyId: policy.id,
          remaining: 0,
          limit: limit.maxRequests,
          resetAt: clientLimit.resetsAt,
          retryAfter: Math.ceil((clientLimit.resetsAt.getTime() - Date.now()) / 1000),
          headers: this.generateHeaders(policy, 0, limit.maxRequests, clientLimit.resetsAt),
          reason: `Rate limit exceeded for ${limit.name}`,
        };
      }
    }

    return this.createAllowResult(client.id);
  }

  private createAllowResult(clientId: string): RateLimitResult {
    return {
      allowed: true,
      action: 'allow',
      status: 'within_limit',
      clientId,
      remaining: 100,
      limit: 1000,
      resetAt: new Date(Date.now() + 60 * 1000),
      headers: {
        'X-RateLimit-Limit': '1000',
        'X-RateLimit-Remaining': '100',
        'X-RateLimit-Reset': String(Math.floor((Date.now() + 60 * 1000) / 1000)),
      },
    };
  }

  private createBlockedResult(client: RateLimitClient): RateLimitResult {
    return {
      allowed: false,
      action: 'reject',
      status: 'blocked',
      clientId: client.id,
      remaining: 0,
      limit: 0,
      resetAt: client.metadata.unblockAt || new Date(Date.now() + 60 * 60 * 1000),
      retryAfter: client.metadata.unblockAt ? Math.ceil((client.metadata.unblockAt.getTime() - Date.now()) / 1000) : 3600,
      headers: {
        'X-RateLimit-Limit': '0',
        'X-RateLimit-Remaining': '0',
        'Retry-After': '3600',
      },
      reason: client.metadata.blockedReason || 'Client is blocked',
    };
  }

  private generateHeaders(policy: RateLimitPolicy, remaining: number, limit: number, resetAt: Date): Record<string, string> {
    const headers: Record<string, string> = {};
    if (policy.headers.enabled) {
      headers[policy.headers.limitHeader] = String(limit);
      headers[policy.headers.remainingHeader] = String(remaining);
      headers[policy.headers.resetHeader] = String(Math.floor(resetAt.getTime() / 1000));
      if (policy.headers.policyHeader) {
        headers[policy.headers.policyHeader] = policy.name;
      }
    }
    return headers;
  }

  private recordViolation(client: RateLimitClient, policy: RateLimitPolicy, result: RateLimitResult): void {
    const violation: Violation = {
      id: `viol-${this.generateId()}`,
      timestamp: new Date(),
      policyId: policy.id,
      policyName: policy.name,
      type: 'rate_exceeded',
      severity: result.remaining <= 0 ? 'high' : 'medium',
      details: {
        limit: result.limit,
        actual: result.limit + 1,
        action: result.action,
      },
      resolved: false,
    };
    client.violations.push(violation);
    client.status = 'exceeded';
    this.emit('violation.created', { client, violation });
  }

  private incrementUsage(client: RateLimitClient, _request: RateLimitRequest): void {
    client.currentUsage.currentWindow.requests++;
    client.limits.forEach((limit) => {
      limit.currentRequests++;
      limit.remaining = Math.max(0, limit.remaining - 1);
    });
  }

  // Policy Operations
  public getPolicies(enabled?: boolean): RateLimitPolicy[] {
    let policies = Array.from(this.policies.values());
    if (enabled !== undefined) policies = policies.filter((p) => p.enabled === enabled);
    return policies.sort((a, b) => a.priority - b.priority);
  }

  public getPolicyById(id: string): RateLimitPolicy | undefined {
    return this.policies.get(id);
  }

  public createPolicy(data: Partial<RateLimitPolicy>): RateLimitPolicy {
    const policy: RateLimitPolicy = {
      id: `policy-${this.generateId()}`,
      name: data.name || 'New Policy',
      description: data.description || '',
      strategy: data.strategy || 'sliding_window',
      scope: data.scope || 'global',
      enabled: false,
      priority: data.priority || this.policies.size + 1,
      limits: data.limits || [],
      conditions: data.conditions || [],
      actions: data.actions || [],
      exemptions: data.exemptions || [],
      quotas: data.quotas || [],
      burstConfig: data.burstConfig,
      retryAfterConfig: data.retryAfterConfig || { mode: 'fixed', baseDelay: 1000, maxDelay: 60000 },
      headers: data.headers || { enabled: true, limitHeader: 'X-RateLimit-Limit', remainingHeader: 'X-RateLimit-Remaining', resetHeader: 'X-RateLimit-Reset', retryAfterHeader: 'Retry-After' },
      metrics: { totalRequests: 0, allowedRequests: 0, throttledRequests: 0, rejectedRequests: 0, queuedRequests: 0, avgLatency: 0, last24h: { requests: 0, allowed: 0, rejected: 0 }, byEndpoint: {} },
      metadata: { createdAt: new Date(), createdBy: 'admin', updatedAt: new Date(), version: 1 },
    };
    this.policies.set(policy.id, policy);
    this.emit('policy.created', policy);
    return policy;
  }

  public togglePolicy(id: string, enabled: boolean): RateLimitPolicy {
    const policy = this.policies.get(id);
    if (!policy) throw new Error('Policy not found');
    policy.enabled = enabled;
    policy.metadata.updatedAt = new Date();
    this.emit('policy.toggled', { policy, enabled });
    return policy;
  }

  // Client Operations
  public getClients(status?: LimitStatus): RateLimitClient[] {
    let clients = Array.from(this.clients.values());
    if (status) clients = clients.filter((c) => c.status === status);
    return clients.sort((a, b) => b.metadata.lastSeen.getTime() - a.metadata.lastSeen.getTime());
  }

  public getClientById(id: string): RateLimitClient | undefined {
    return this.clients.get(id);
  }

  public getClientByIdentifier(identifier: string, type: string): RateLimitClient | undefined {
    return Array.from(this.clients.values()).find((c) => c.identifier === identifier && c.type === type);
  }

  public blockClient(id: string, reason: string, duration: number): RateLimitClient {
    const client = this.clients.get(id);
    if (!client) throw new Error('Client not found');
    client.metadata.blocked = true;
    client.metadata.blockedAt = new Date();
    client.metadata.blockedReason = reason;
    client.metadata.unblockAt = new Date(Date.now() + duration * 1000);
    client.status = 'blocked';
    this.emit('client.blocked', { client, reason, duration });
    return client;
  }

  public unblockClient(id: string): RateLimitClient {
    const client = this.clients.get(id);
    if (!client) throw new Error('Client not found');
    client.metadata.blocked = false;
    client.metadata.blockedAt = undefined;
    client.metadata.blockedReason = undefined;
    client.metadata.unblockAt = undefined;
    client.status = 'within_limit';
    this.emit('client.unblocked', client);
    return client;
  }

  // Tier Operations
  public getTiers(): TierConfiguration[] {
    return Array.from(this.tiers.values()).sort((a, b) => a.priority - b.priority);
  }

  public getTierById(id: string): TierConfiguration | undefined {
    return this.tiers.get(id);
  }

  // Queue Operations
  public getQueue(): QueueEntry[] {
    return Array.from(this.queue.values()).sort((a, b) => a.position - b.position);
  }

  // Alert Operations
  public getAlerts(): AlertConfiguration[] {
    return Array.from(this.alerts.values());
  }

  public getAlertById(id: string): AlertConfiguration | undefined {
    return this.alerts.get(id);
  }

  // Analytics
  public getAnalytics(): RateLimitAnalytics {
    const policies = Array.from(this.policies.values());
    const clients = Array.from(this.clients.values());

    const totalRequests = policies.reduce((sum, p) => sum + p.metrics.totalRequests, 0);
    const allowedRequests = policies.reduce((sum, p) => sum + p.metrics.allowedRequests, 0);
    const throttledRequests = policies.reduce((sum, p) => sum + p.metrics.throttledRequests, 0);
    const rejectedRequests = policies.reduce((sum, p) => sum + p.metrics.rejectedRequests, 0);

    return {
      overview: {
        totalRequests,
        allowedRequests,
        throttledRequests,
        rejectedRequests,
        allowRate: (allowedRequests / totalRequests) * 100,
        rejectRate: (rejectedRequests / totalRequests) * 100,
      },
      byPolicy: policies.map((p) => ({
        policyId: p.id,
        policyName: p.name,
        requests: p.metrics.totalRequests,
        allowed: p.metrics.allowedRequests,
        rejected: p.metrics.rejectedRequests,
      })),
      byClient: clients.map((c) => ({
        clientId: c.id,
        clientType: c.type,
        requests: c.history.reduce((sum, h) => sum + h.requests, 0),
        violations: c.violations.length,
        status: c.status,
      })),
      byEndpoint: [
        { endpoint: '/api/v2/alerts', method: 'GET', requests: 500000, rejected: 25000, avgLatency: 45 },
        { endpoint: '/api/v2/users', method: 'GET', requests: 250000, rejected: 12000, avgLatency: 35 },
        { endpoint: '/api/v2/incidents', method: 'POST', requests: 100000, rejected: 5000, avgLatency: 65 },
      ],
      trends: [],
      topViolators: clients
        .filter((c) => c.violations.length > 0)
        .sort((a, b) => b.violations.length - a.violations.length)
        .slice(0, 10)
        .map((c) => ({
          clientId: c.id,
          violations: c.violations.length,
          lastViolation: c.violations[c.violations.length - 1]?.timestamp || new Date(),
          status: c.status,
        })),
    };
  }

  // Statistics
  public getStatistics(): RateLimitStatistics {
    const policies = Array.from(this.policies.values());
    const clients = Array.from(this.clients.values());

    return {
      global: {
        totalPolicies: policies.length,
        activePolicies: policies.filter((p) => p.enabled).length,
        totalClients: clients.length,
        activeClients: clients.filter((c) => c.status !== 'blocked').length,
        blockedClients: clients.filter((c) => c.metadata.blocked).length,
      },
      usage: {
        last24h: {
          totalRequests: policies.reduce((sum, p) => sum + p.metrics.last24h.requests, 0),
          allowedRequests: policies.reduce((sum, p) => sum + p.metrics.last24h.allowed, 0),
          rejectedRequests: policies.reduce((sum, p) => sum + p.metrics.last24h.rejected, 0),
          throttledRequests: Math.floor(policies.reduce((sum, p) => sum + p.metrics.throttledRequests, 0) / 30),
        },
        last7d: {
          totalRequests: policies.reduce((sum, p) => sum + p.metrics.totalRequests, 0) / 4,
          allowedRequests: policies.reduce((sum, p) => sum + p.metrics.allowedRequests, 0) / 4,
          rejectedRequests: policies.reduce((sum, p) => sum + p.metrics.rejectedRequests, 0) / 4,
          throttledRequests: policies.reduce((sum, p) => sum + p.metrics.throttledRequests, 0) / 4,
        },
      },
      performance: {
        avgCheckLatency: 2.5,
        p50Latency: 1.5,
        p95Latency: 8,
        p99Latency: 15,
        cacheHitRate: 95,
      },
      violations: {
        total: clients.reduce((sum, c) => sum + c.violations.length, 0),
        last24h: clients.reduce((sum, c) => sum + c.violations.filter((v) => v.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)).length, 0),
        byType: { rate_exceeded: 80, quota_exceeded: 15, burst_exceeded: 5 },
        bySeverity: { low: 30, medium: 50, high: 18, critical: 2 },
      },
      trends: [],
    };
  }

  // Distributed Config
  public getDistributedConfig(): DistributedConfig | null {
    return this.distributedConfig;
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

export const rateLimitingService = RateLimitingService.getInstance();
export type {
  RateLimitStrategy,
  RateLimitScope,
  LimitStatus,
  ActionType,
  RateLimitPolicy,
  RateLimit,
  PolicyCondition,
  PolicyAction,
  PolicyExemption,
  QuotaConfig,
  BurstConfig,
  RetryAfterConfig,
  HeaderConfig,
  PolicyMetrics,
  RateLimitClient,
  ClientUsage,
  QuotaUsage,
  ClientLimit,
  UsageHistory,
  Violation,
  RateLimitResult,
  RateLimitRequest,
  TierConfiguration,
  QueueEntry,
  RateLimitAnalytics,
  DistributedConfig,
  AlertConfiguration,
  RateLimitStatistics,
};
