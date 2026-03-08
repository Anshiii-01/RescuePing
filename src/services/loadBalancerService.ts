/**
 * Load Balancer Service
 * Comprehensive traffic distribution, health-based routing, connection pooling, and load management
 */

// Load balancing algorithm
type LoadBalancingAlgorithm = 'round_robin' | 'least_connections' | 'weighted_round_robin' | 'ip_hash' | 'least_response_time' | 'random' | 'consistent_hash';

// Backend status
type BackendStatus = 'healthy' | 'unhealthy' | 'degraded' | 'draining' | 'maintenance' | 'offline';

// Protocol type
type ProtocolType = 'http' | 'https' | 'tcp' | 'udp' | 'grpc' | 'websocket';

// Health check type
type HealthCheckType = 'http' | 'https' | 'tcp' | 'grpc' | 'script' | 'dns';

// Session persistence type
type SessionPersistenceType = 'none' | 'cookie' | 'ip_hash' | 'header' | 'url_param';

// SSL termination mode
type SSLTerminationMode = 'passthrough' | 'offload' | 'reencrypt';

// Load Balancer
interface LoadBalancer {
  id: string;
  name: string;
  description: string;
  type: 'application' | 'network' | 'gateway';
  status: 'active' | 'inactive' | 'provisioning' | 'error' | 'updating';
  tier: 'standard' | 'premium' | 'enterprise';
  network: {
    vpcId: string;
    subnetIds: string[];
    securityGroups: string[];
    publicIp?: string;
    privateIps: string[];
    dnsName: string;
  };
  listeners: Listener[];
  targetGroups: string[];
  crossZone: boolean;
  idleTimeout: number;
  deletionProtection: boolean;
  accessLogs: {
    enabled: boolean;
    bucket?: string;
    prefix?: string;
    interval: number;
  };
  attributes: {
    routingAlgorithm: LoadBalancingAlgorithm;
    connectionDraining: boolean;
    drainingTimeout: number;
    preserveHostHeader: boolean;
    xForwardedFor: boolean;
  };
  waf: {
    enabled: boolean;
    webAclId?: string;
    rules: string[];
  };
  monitoring: {
    metricsEnabled: boolean;
    loggingEnabled: boolean;
    tracingEnabled: boolean;
  };
  tags: Record<string, string>;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    region: string;
    availabilityZones: string[];
  };
}

// Listener
interface Listener {
  id: string;
  loadBalancerId: string;
  port: number;
  protocol: ProtocolType;
  status: 'active' | 'inactive' | 'error';
  defaultAction: {
    type: 'forward' | 'redirect' | 'fixed_response';
    targetGroupId?: string;
    redirectConfig?: {
      protocol: string;
      port: string;
      host: string;
      path: string;
      statusCode: number;
    };
    fixedResponse?: {
      statusCode: number;
      contentType: string;
      body: string;
    };
  };
  rules: ListenerRule[];
  ssl?: {
    certificateArn: string;
    policy: string;
    mode: SSLTerminationMode;
    protocols: string[];
    ciphers: string[];
  };
  timeout: {
    idle: number;
    connect: number;
    read: number;
    write: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Listener Rule
interface ListenerRule {
  id: string;
  listenerId: string;
  priority: number;
  conditions: {
    type: 'path' | 'host' | 'header' | 'query' | 'method' | 'source_ip';
    field?: string;
    values: string[];
    operator?: 'equals' | 'contains' | 'prefix' | 'suffix' | 'regex';
  }[];
  actions: {
    type: 'forward' | 'redirect' | 'fixed_response' | 'authenticate';
    targetGroupId?: string;
    weight?: number;
    config?: Record<string, unknown>;
  }[];
  enabled: boolean;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Target Group
interface TargetGroup {
  id: string;
  name: string;
  description: string;
  loadBalancerId: string;
  protocol: ProtocolType;
  port: number;
  targetType: 'instance' | 'ip' | 'lambda' | 'alb';
  algorithm: LoadBalancingAlgorithm;
  targets: Target[];
  healthCheck: HealthCheck;
  sessionPersistence: {
    type: SessionPersistenceType;
    cookieName?: string;
    ttl?: number;
  };
  deregistration: {
    delay: number;
    connectionDraining: boolean;
  };
  slowStart: {
    enabled: boolean;
    duration: number;
  };
  attributes: {
    stickinessEnabled: boolean;
    stickinessDuration: number;
    loadBalancingAlgorithm: LoadBalancingAlgorithm;
  };
  metrics: {
    healthyTargets: number;
    unhealthyTargets: number;
    requestsPerSecond: number;
    averageResponseTime: number;
    errorRate: number;
  };
  tags: Record<string, string>;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Target
interface Target {
  id: string;
  targetGroupId: string;
  type: 'instance' | 'ip' | 'lambda';
  address: string;
  port: number;
  weight: number;
  status: BackendStatus;
  healthStatus: {
    status: 'healthy' | 'unhealthy' | 'draining' | 'unavailable';
    reason?: string;
    lastCheck: Date;
    consecutiveFailures: number;
    consecutiveSuccesses: number;
  };
  availabilityZone: string;
  connections: {
    active: number;
    total: number;
    maxConnections: number;
  };
  metrics: {
    requestsPerSecond: number;
    averageResponseTime: number;
    errorRate: number;
    bytesIn: number;
    bytesOut: number;
  };
  metadata: {
    registeredAt: Date;
    instanceId?: string;
    privateIp?: string;
    tags: Record<string, string>;
  };
}

// Health Check
interface HealthCheck {
  id: string;
  targetGroupId: string;
  type: HealthCheckType;
  protocol: ProtocolType;
  port: number | 'traffic-port';
  path?: string;
  host?: string;
  interval: number;
  timeout: number;
  healthyThreshold: number;
  unhealthyThreshold: number;
  matcher?: {
    httpCode?: string;
    grpcCode?: string;
    bodyRegex?: string;
  };
  enabled: boolean;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Connection Pool
interface ConnectionPool {
  id: string;
  targetGroupId: string;
  maxConnections: number;
  maxPendingRequests: number;
  maxRetries: number;
  idleTimeout: number;
  connectTimeout: number;
  current: {
    active: number;
    idle: number;
    pending: number;
  };
  circuit: {
    enabled: boolean;
    threshold: number;
    duration: number;
    state: 'closed' | 'open' | 'half_open';
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Traffic Policy
interface TrafficPolicy {
  id: string;
  name: string;
  description: string;
  loadBalancerId: string;
  type: 'rate_limit' | 'circuit_breaker' | 'retry' | 'timeout' | 'canary';
  enabled: boolean;
  config: {
    rateLimit?: {
      requestsPerSecond: number;
      burstSize: number;
      scope: 'global' | 'per_ip' | 'per_user';
    };
    circuitBreaker?: {
      errorThreshold: number;
      volumeThreshold: number;
      sleepWindow: number;
    };
    retry?: {
      maxRetries: number;
      retryOn: string[];
      perTryTimeout: number;
      retryBackoff: { base: number; max: number };
    };
    timeout?: {
      requestTimeout: number;
      idleTimeout: number;
    };
    canary?: {
      weight: number;
      targetGroupId: string;
      headers?: Record<string, string>;
    };
  };
  priority: number;
  conditions: {
    paths?: string[];
    hosts?: string[];
    methods?: string[];
    headers?: Record<string, string>;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Traffic Split
interface TrafficSplit {
  id: string;
  name: string;
  loadBalancerId: string;
  type: 'weighted' | 'header_based' | 'cookie_based' | 'canary';
  status: 'active' | 'inactive' | 'completed';
  targets: {
    targetGroupId: string;
    weight: number;
    conditions?: Record<string, string>;
  }[];
  schedule?: {
    startTime: Date;
    endTime?: Date;
    rampUpDuration?: number;
  };
  metrics: {
    totalRequests: number;
    distribution: Record<string, number>;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Load Balancer Metrics
interface LoadBalancerMetrics {
  loadBalancerId: string;
  period: {
    start: Date;
    end: Date;
    granularity: string;
  };
  traffic: {
    requestsTotal: number;
    requestsPerSecond: number;
    bytesIn: number;
    bytesOut: number;
    newConnections: number;
    activeConnections: number;
  };
  latency: {
    average: number;
    p50: number;
    p90: number;
    p95: number;
    p99: number;
    max: number;
  };
  errors: {
    total: number;
    rate: number;
    http4xx: number;
    http5xx: number;
    connectionErrors: number;
    targetErrors: number;
  };
  targets: {
    total: number;
    healthy: number;
    unhealthy: number;
    draining: number;
  };
  ssl: {
    handshakes: number;
    handshakeFailures: number;
    avgHandshakeTime: number;
  };
  trends: {
    timestamp: string;
    requests: number;
    latency: number;
    errors: number;
  }[];
}

// SSL Certificate
interface SSLCertificate {
  id: string;
  name: string;
  domain: string;
  sans: string[];
  type: 'acm' | 'imported' | 'self_signed';
  status: 'active' | 'expired' | 'pending' | 'revoked';
  issuer: string;
  serialNumber: string;
  validFrom: Date;
  validTo: Date;
  algorithm: string;
  keySize: number;
  fingerprint: string;
  chain: string[];
  autoRenew: boolean;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    usedBy: string[];
  };
}

// IP Allowlist
interface IPAllowlist {
  id: string;
  name: string;
  description: string;
  loadBalancerId: string;
  entries: {
    cidr: string;
    description: string;
    addedAt: Date;
    addedBy: string;
  }[];
  action: 'allow' | 'deny';
  enabled: boolean;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Geo Routing Rule
interface GeoRoutingRule {
  id: string;
  name: string;
  loadBalancerId: string;
  enabled: boolean;
  rules: {
    region: string;
    countries: string[];
    targetGroupId: string;
    weight: number;
    fallback?: string;
  }[];
  defaultTarget: string;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

class LoadBalancerService {
  private static instance: LoadBalancerService;
  private loadBalancers: Map<string, LoadBalancer> = new Map();
  private listeners: Map<string, Listener> = new Map();
  private listenerRules: Map<string, ListenerRule> = new Map();
  private targetGroups: Map<string, TargetGroup> = new Map();
  private targets: Map<string, Target> = new Map();
  private healthChecks: Map<string, HealthCheck> = new Map();
  private connectionPools: Map<string, ConnectionPool> = new Map();
  private trafficPolicies: Map<string, TrafficPolicy> = new Map();
  private trafficSplits: Map<string, TrafficSplit> = new Map();
  private sslCertificates: Map<string, SSLCertificate> = new Map();
  private ipAllowlists: Map<string, IPAllowlist> = new Map();
  private geoRoutingRules: Map<string, GeoRoutingRule> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): LoadBalancerService {
    if (!LoadBalancerService.instance) {
      LoadBalancerService.instance = new LoadBalancerService();
    }
    return LoadBalancerService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize Load Balancers
    const lbData = [
      { name: 'api-gateway-lb', type: 'application', tier: 'enterprise' },
      { name: 'web-frontend-lb', type: 'application', tier: 'premium' },
      { name: 'internal-services-lb', type: 'network', tier: 'standard' },
      { name: 'grpc-gateway-lb', type: 'application', tier: 'premium' },
    ];

    lbData.forEach((lb, idx) => {
      const loadBalancer: LoadBalancer = {
        id: `lb-${(idx + 1).toString().padStart(4, '0')}`,
        name: lb.name,
        description: `Load balancer for ${lb.name.replace(/-/g, ' ')}`,
        type: lb.type as LoadBalancer['type'],
        status: idx < 3 ? 'active' : 'updating',
        tier: lb.tier as LoadBalancer['tier'],
        network: {
          vpcId: 'vpc-main',
          subnetIds: ['subnet-1a', 'subnet-1b', 'subnet-1c'],
          securityGroups: ['sg-lb-public', 'sg-lb-internal'],
          publicIp: `52.${66 + idx}.${100 + idx}.${10 + idx}`,
          privateIps: [`10.0.${idx}.10`, `10.0.${idx}.11`],
          dnsName: `${lb.name}.ap-south-1.elb.amazonaws.com`,
        },
        listeners: [],
        targetGroups: [],
        crossZone: true,
        idleTimeout: 60,
        deletionProtection: true,
        accessLogs: {
          enabled: true,
          bucket: 'rescueping-lb-logs',
          prefix: lb.name,
          interval: 5,
        },
        attributes: {
          routingAlgorithm: 'least_connections',
          connectionDraining: true,
          drainingTimeout: 300,
          preserveHostHeader: true,
          xForwardedFor: true,
        },
        waf: {
          enabled: idx < 2,
          webAclId: idx < 2 ? 'waf-acl-001' : undefined,
          rules: idx < 2 ? ['SQL-injection', 'XSS', 'Rate-limit'] : [],
        },
        monitoring: {
          metricsEnabled: true,
          loggingEnabled: true,
          tracingEnabled: idx < 2,
        },
        tags: {
          environment: 'production',
          team: 'platform',
          cost_center: 'infrastructure',
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'infra-admin',
          updatedAt: new Date(),
          region: 'ap-south-1',
          availabilityZones: ['ap-south-1a', 'ap-south-1b', 'ap-south-1c'],
        },
      };
      this.loadBalancers.set(loadBalancer.id, loadBalancer);
    });

    // Initialize Target Groups
    const tgData = [
      { name: 'api-servers', protocol: 'https', port: 443, algorithm: 'least_connections' },
      { name: 'web-servers', protocol: 'http', port: 80, algorithm: 'round_robin' },
      { name: 'auth-servers', protocol: 'https', port: 8443, algorithm: 'ip_hash' },
      { name: 'grpc-servers', protocol: 'grpc', port: 50051, algorithm: 'round_robin' },
      { name: 'websocket-servers', protocol: 'websocket', port: 8080, algorithm: 'least_connections' },
      { name: 'internal-api', protocol: 'http', port: 8000, algorithm: 'weighted_round_robin' },
    ];

    tgData.forEach((tg, idx) => {
      const healthCheck: HealthCheck = {
        id: `hc-${(idx + 1).toString().padStart(4, '0')}`,
        targetGroupId: `tg-${(idx + 1).toString().padStart(4, '0')}`,
        type: tg.protocol === 'grpc' ? 'grpc' : 'http',
        protocol: tg.protocol as ProtocolType,
        port: 'traffic-port',
        path: '/health',
        interval: 30,
        timeout: 10,
        healthyThreshold: 2,
        unhealthyThreshold: 3,
        matcher: {
          httpCode: '200-299',
        },
        enabled: true,
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.healthChecks.set(healthCheck.id, healthCheck);

      const targetGroup: TargetGroup = {
        id: `tg-${(idx + 1).toString().padStart(4, '0')}`,
        name: tg.name,
        description: `Target group for ${tg.name.replace(/-/g, ' ')}`,
        loadBalancerId: `lb-${((idx % 4) + 1).toString().padStart(4, '0')}`,
        protocol: tg.protocol as ProtocolType,
        port: tg.port,
        targetType: 'instance',
        algorithm: tg.algorithm as LoadBalancingAlgorithm,
        targets: [],
        healthCheck,
        sessionPersistence: {
          type: idx % 3 === 0 ? 'cookie' : 'none',
          cookieName: idx % 3 === 0 ? 'AWSALB' : undefined,
          ttl: idx % 3 === 0 ? 86400 : undefined,
        },
        deregistration: {
          delay: 300,
          connectionDraining: true,
        },
        slowStart: {
          enabled: idx < 3,
          duration: 30,
        },
        attributes: {
          stickinessEnabled: idx % 3 === 0,
          stickinessDuration: 86400,
          loadBalancingAlgorithm: tg.algorithm as LoadBalancingAlgorithm,
        },
        metrics: {
          healthyTargets: Math.floor(Math.random() * 5) + 3,
          unhealthyTargets: Math.floor(Math.random() * 2),
          requestsPerSecond: Math.floor(Math.random() * 1000) + 100,
          averageResponseTime: Math.floor(Math.random() * 100) + 20,
          errorRate: Math.random() * 2,
        },
        tags: {
          environment: 'production',
          service: tg.name.split('-')[0],
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'devops',
          updatedAt: new Date(),
        },
      };
      this.targetGroups.set(targetGroup.id, targetGroup);
    });

    // Initialize Targets for each Target Group
    const targetGroupIds = Array.from(this.targetGroups.keys());
    targetGroupIds.forEach((tgId, tgIdx) => {
      const targetCount = Math.floor(Math.random() * 4) + 3;
      for (let i = 0; i < targetCount; i++) {
        const target: Target = {
          id: `target-${tgId}-${(i + 1).toString().padStart(3, '0')}`,
          targetGroupId: tgId,
          type: 'instance',
          address: `10.0.${tgIdx}.${10 + i}`,
          port: this.targetGroups.get(tgId)!.port,
          weight: 100,
          status: i === 0 && tgIdx === 0 ? 'draining' : i < targetCount - 1 ? 'healthy' : Math.random() > 0.7 ? 'unhealthy' : 'healthy',
          healthStatus: {
            status: i < targetCount - 1 ? 'healthy' : Math.random() > 0.7 ? 'unhealthy' : 'healthy',
            lastCheck: new Date(Date.now() - Math.random() * 60000),
            consecutiveFailures: 0,
            consecutiveSuccesses: Math.floor(Math.random() * 100) + 10,
          },
          availabilityZone: ['ap-south-1a', 'ap-south-1b', 'ap-south-1c'][i % 3],
          connections: {
            active: Math.floor(Math.random() * 100) + 10,
            total: Math.floor(Math.random() * 10000) + 1000,
            maxConnections: 1000,
          },
          metrics: {
            requestsPerSecond: Math.floor(Math.random() * 200) + 20,
            averageResponseTime: Math.floor(Math.random() * 50) + 10,
            errorRate: Math.random() * 1,
            bytesIn: Math.floor(Math.random() * 1000000000),
            bytesOut: Math.floor(Math.random() * 5000000000),
          },
          metadata: {
            registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            instanceId: `i-${Math.random().toString(36).substr(2, 17)}`,
            privateIp: `10.0.${tgIdx}.${10 + i}`,
            tags: { Name: `server-${tgIdx}-${i + 1}` },
          },
        };
        this.targets.set(target.id, target);
      }
    });

    // Initialize Listeners
    const listenerData = [
      { lbId: 'lb-0001', port: 443, protocol: 'https' },
      { lbId: 'lb-0001', port: 80, protocol: 'http' },
      { lbId: 'lb-0002', port: 443, protocol: 'https' },
      { lbId: 'lb-0003', port: 8080, protocol: 'tcp' },
      { lbId: 'lb-0004', port: 50051, protocol: 'grpc' },
    ];

    listenerData.forEach((l, idx) => {
      const listener: Listener = {
        id: `listener-${(idx + 1).toString().padStart(4, '0')}`,
        loadBalancerId: l.lbId,
        port: l.port,
        protocol: l.protocol as ProtocolType,
        status: 'active',
        defaultAction: {
          type: 'forward',
          targetGroupId: targetGroupIds[idx % targetGroupIds.length],
        },
        rules: [],
        ssl: l.protocol === 'https' ? {
          certificateArn: 'arn:aws:acm:ap-south-1:123456789:certificate/abc123',
          policy: 'ELBSecurityPolicy-TLS13-1-2-2021-06',
          mode: 'offload',
          protocols: ['TLSv1.2', 'TLSv1.3'],
          ciphers: ['ECDHE-RSA-AES128-GCM-SHA256', 'ECDHE-RSA-AES256-GCM-SHA384'],
        } : undefined,
        timeout: {
          idle: 60,
          connect: 10,
          read: 60,
          write: 60,
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.listeners.set(listener.id, listener);
    });

    // Initialize Listener Rules
    const ruleConfigs = [
      { path: '/api/v1/*', targetGroup: 'tg-0001' },
      { path: '/api/v2/*', targetGroup: 'tg-0001' },
      { path: '/auth/*', targetGroup: 'tg-0003' },
      { path: '/ws/*', targetGroup: 'tg-0005' },
      { host: 'admin.*', targetGroup: 'tg-0006' },
    ];

    ruleConfigs.forEach((r, idx) => {
      const rule: ListenerRule = {
        id: `rule-${(idx + 1).toString().padStart(4, '0')}`,
        listenerId: 'listener-0001',
        priority: (idx + 1) * 10,
        conditions: r.path ? [{ type: 'path', values: [r.path] }] : [{ type: 'host', values: [r.host!] }],
        actions: [{ type: 'forward', targetGroupId: r.targetGroup }],
        enabled: true,
        metadata: {
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.listenerRules.set(rule.id, rule);
    });

    // Initialize Connection Pools
    targetGroupIds.slice(0, 4).forEach((tgId, idx) => {
      const pool: ConnectionPool = {
        id: `pool-${(idx + 1).toString().padStart(4, '0')}`,
        targetGroupId: tgId,
        maxConnections: 1000,
        maxPendingRequests: 100,
        maxRetries: 3,
        idleTimeout: 300,
        connectTimeout: 10,
        current: {
          active: Math.floor(Math.random() * 500) + 100,
          idle: Math.floor(Math.random() * 200) + 50,
          pending: Math.floor(Math.random() * 20),
        },
        circuit: {
          enabled: true,
          threshold: 50,
          duration: 30,
          state: idx === 3 ? 'half_open' : 'closed',
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.connectionPools.set(pool.id, pool);
    });

    // Initialize Traffic Policies
    const policyTypes = ['rate_limit', 'circuit_breaker', 'retry', 'timeout', 'canary'];
    policyTypes.forEach((type, idx) => {
      const policy: TrafficPolicy = {
        id: `policy-${(idx + 1).toString().padStart(4, '0')}`,
        name: `${type.replace('_', '-')}-policy`,
        description: `Traffic policy for ${type.replace('_', ' ')}`,
        loadBalancerId: 'lb-0001',
        type: type as TrafficPolicy['type'],
        enabled: true,
        config: {
          rateLimit: type === 'rate_limit' ? { requestsPerSecond: 1000, burstSize: 100, scope: 'per_ip' } : undefined,
          circuitBreaker: type === 'circuit_breaker' ? { errorThreshold: 50, volumeThreshold: 20, sleepWindow: 30000 } : undefined,
          retry: type === 'retry' ? { maxRetries: 3, retryOn: ['5xx', 'reset'], perTryTimeout: 10, retryBackoff: { base: 100, max: 1000 } } : undefined,
          timeout: type === 'timeout' ? { requestTimeout: 30000, idleTimeout: 60000 } : undefined,
          canary: type === 'canary' ? { weight: 10, targetGroupId: 'tg-0002' } : undefined,
        },
        priority: (idx + 1) * 100,
        conditions: {},
        metadata: {
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          createdBy: 'platform-team',
          updatedAt: new Date(),
        },
      };
      this.trafficPolicies.set(policy.id, policy);
    });

    // Initialize SSL Certificates
    const certDomains = ['*.rescueping.com', 'api.rescueping.com', 'admin.rescueping.com'];
    certDomains.forEach((domain, idx) => {
      const cert: SSLCertificate = {
        id: `cert-${(idx + 1).toString().padStart(4, '0')}`,
        name: `${domain.replace('*.', 'wildcard-').replace('.', '-')}-cert`,
        domain,
        sans: idx === 0 ? ['rescueping.com', 'www.rescueping.com'] : [],
        type: 'acm',
        status: 'active',
        issuer: 'Amazon',
        serialNumber: Math.random().toString(36).substr(2, 32).toUpperCase(),
        validFrom: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        validTo: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000),
        algorithm: 'RSA-2048',
        keySize: 2048,
        fingerprint: Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase(),
        chain: ['Root CA', 'Intermediate CA'],
        autoRenew: true,
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          usedBy: [`lb-${(idx + 1).toString().padStart(4, '0')}`],
        },
      };
      this.sslCertificates.set(cert.id, cert);
    });

    // Initialize IP Allowlists
    const allowlist: IPAllowlist = {
      id: 'allowlist-0001',
      name: 'Office IPs',
      description: 'IP addresses of office locations',
      loadBalancerId: 'lb-0001',
      entries: [
        { cidr: '203.0.113.0/24', description: 'Mumbai Office', addedAt: new Date(), addedBy: 'admin' },
        { cidr: '198.51.100.0/24', description: 'Delhi Office', addedAt: new Date(), addedBy: 'admin' },
        { cidr: '192.0.2.0/24', description: 'Bangalore Office', addedAt: new Date(), addedBy: 'admin' },
      ],
      action: 'allow',
      enabled: true,
      metadata: {
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        createdBy: 'security-team',
        updatedAt: new Date(),
      },
    };
    this.ipAllowlists.set(allowlist.id, allowlist);

    // Initialize Geo Routing Rules
    const geoRule: GeoRoutingRule = {
      id: 'geo-0001',
      name: 'Regional Routing',
      loadBalancerId: 'lb-0001',
      enabled: true,
      rules: [
        { region: 'Asia', countries: ['IN', 'SG', 'JP'], targetGroupId: 'tg-0001', weight: 100 },
        { region: 'Europe', countries: ['GB', 'DE', 'FR'], targetGroupId: 'tg-0002', weight: 100 },
        { region: 'Americas', countries: ['US', 'CA', 'BR'], targetGroupId: 'tg-0003', weight: 100 },
      ],
      defaultTarget: 'tg-0001',
      metadata: {
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        createdBy: 'platform-team',
        updatedAt: new Date(),
      },
    };
    this.geoRoutingRules.set(geoRule.id, geoRule);
  }

  /**
   * Get Load Balancers
   */
  public getLoadBalancers(filter?: { type?: LoadBalancer['type']; status?: LoadBalancer['status'] }): LoadBalancer[] {
    let lbs = Array.from(this.loadBalancers.values());
    if (filter?.type) lbs = lbs.filter((lb) => lb.type === filter.type);
    if (filter?.status) lbs = lbs.filter((lb) => lb.status === filter.status);
    return lbs;
  }

  /**
   * Get Load Balancer
   */
  public getLoadBalancer(id: string): LoadBalancer | undefined {
    return this.loadBalancers.get(id);
  }

  /**
   * Get Target Groups
   */
  public getTargetGroups(filter?: { loadBalancerId?: string }): TargetGroup[] {
    let groups = Array.from(this.targetGroups.values());
    if (filter?.loadBalancerId) groups = groups.filter((tg) => tg.loadBalancerId === filter.loadBalancerId);
    return groups;
  }

  /**
   * Get Targets
   */
  public getTargets(filter?: { targetGroupId?: string; status?: BackendStatus }): Target[] {
    let targets = Array.from(this.targets.values());
    if (filter?.targetGroupId) targets = targets.filter((t) => t.targetGroupId === filter.targetGroupId);
    if (filter?.status) targets = targets.filter((t) => t.status === filter.status);
    return targets;
  }

  /**
   * Get Listeners
   */
  public getListeners(filter?: { loadBalancerId?: string }): Listener[] {
    let listeners = Array.from(this.listeners.values());
    if (filter?.loadBalancerId) listeners = listeners.filter((l) => l.loadBalancerId === filter.loadBalancerId);
    return listeners;
  }

  /**
   * Get Traffic Policies
   */
  public getTrafficPolicies(filter?: { loadBalancerId?: string; type?: TrafficPolicy['type'] }): TrafficPolicy[] {
    let policies = Array.from(this.trafficPolicies.values());
    if (filter?.loadBalancerId) policies = policies.filter((p) => p.loadBalancerId === filter.loadBalancerId);
    if (filter?.type) policies = policies.filter((p) => p.type === filter.type);
    return policies;
  }

  /**
   * Get SSL Certificates
   */
  public getSSLCertificates(filter?: { status?: SSLCertificate['status'] }): SSLCertificate[] {
    let certs = Array.from(this.sslCertificates.values());
    if (filter?.status) certs = certs.filter((c) => c.status === filter.status);
    return certs;
  }

  /**
   * Get Load Balancer Metrics
   */
  public getMetrics(loadBalancerId: string): LoadBalancerMetrics {
    const lb = this.loadBalancers.get(loadBalancerId);
    if (!lb) throw new Error('Load balancer not found');

    const targets = this.getTargets();
    const healthyTargets = targets.filter((t) => t.status === 'healthy').length;
    const unhealthyTargets = targets.filter((t) => t.status === 'unhealthy').length;

    return {
      loadBalancerId,
      period: {
        start: new Date(Date.now() - 3600000),
        end: new Date(),
        granularity: '1m',
      },
      traffic: {
        requestsTotal: Math.floor(Math.random() * 1000000) + 100000,
        requestsPerSecond: Math.floor(Math.random() * 5000) + 500,
        bytesIn: Math.floor(Math.random() * 10000000000),
        bytesOut: Math.floor(Math.random() * 50000000000),
        newConnections: Math.floor(Math.random() * 10000) + 1000,
        activeConnections: Math.floor(Math.random() * 5000) + 500,
      },
      latency: {
        average: Math.floor(Math.random() * 50) + 10,
        p50: Math.floor(Math.random() * 30) + 5,
        p90: Math.floor(Math.random() * 100) + 30,
        p95: Math.floor(Math.random() * 150) + 50,
        p99: Math.floor(Math.random() * 300) + 100,
        max: Math.floor(Math.random() * 1000) + 200,
      },
      errors: {
        total: Math.floor(Math.random() * 1000) + 10,
        rate: Math.random() * 2,
        http4xx: Math.floor(Math.random() * 500) + 5,
        http5xx: Math.floor(Math.random() * 100) + 1,
        connectionErrors: Math.floor(Math.random() * 50),
        targetErrors: Math.floor(Math.random() * 100),
      },
      targets: {
        total: targets.length,
        healthy: healthyTargets,
        unhealthy: unhealthyTargets,
        draining: targets.filter((t) => t.status === 'draining').length,
      },
      ssl: {
        handshakes: Math.floor(Math.random() * 100000) + 10000,
        handshakeFailures: Math.floor(Math.random() * 100),
        avgHandshakeTime: Math.floor(Math.random() * 20) + 5,
      },
      trends: [],
    };
  }

  /**
   * Register Target
   */
  public registerTarget(targetGroupId: string, address: string, port: number): Target {
    const targetGroup = this.targetGroups.get(targetGroupId);
    if (!targetGroup) throw new Error('Target group not found');

    const target: Target = {
      id: `target-${targetGroupId}-${Date.now()}`,
      targetGroupId,
      type: 'instance',
      address,
      port,
      weight: 100,
      status: 'healthy',
      healthStatus: {
        status: 'healthy',
        lastCheck: new Date(),
        consecutiveFailures: 0,
        consecutiveSuccesses: 0,
      },
      availabilityZone: 'ap-south-1a',
      connections: { active: 0, total: 0, maxConnections: 1000 },
      metrics: { requestsPerSecond: 0, averageResponseTime: 0, errorRate: 0, bytesIn: 0, bytesOut: 0 },
      metadata: {
        registeredAt: new Date(),
        privateIp: address,
        tags: {},
      },
    };

    this.targets.set(target.id, target);
    this.emit('target_registered', target);
    return target;
  }

  /**
   * Deregister Target
   */
  public deregisterTarget(targetId: string): void {
    const target = this.targets.get(targetId);
    if (!target) throw new Error('Target not found');

    target.status = 'draining';
    target.healthStatus.status = 'draining';
    this.emit('target_deregistering', target);
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

export const loadBalancerService = LoadBalancerService.getInstance();
export type {
  LoadBalancingAlgorithm,
  BackendStatus,
  ProtocolType,
  HealthCheckType,
  SessionPersistenceType,
  SSLTerminationMode,
  LoadBalancer,
  Listener,
  ListenerRule,
  TargetGroup,
  Target,
  HealthCheck,
  ConnectionPool,
  TrafficPolicy,
  TrafficSplit,
  LoadBalancerMetrics,
  SSLCertificate,
  IPAllowlist,
  GeoRoutingRule,
};
