/**
 * Service Mesh Service
 * Microservices communication, traffic management, service discovery, and observability
 */

// Service status
type ServiceStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown' | 'starting' | 'stopping';

// Load balancing algorithm
type LoadBalancingAlgorithm = 'round_robin' | 'least_connections' | 'random' | 'weighted' | 'ip_hash' | 'consistent_hash';

// Protocol type
type ProtocolType = 'http' | 'https' | 'grpc' | 'tcp' | 'udp' | 'websocket';

// Circuit breaker state
type CircuitState = 'closed' | 'open' | 'half_open';

// Service instance
interface ServiceInstance {
  id: string;
  serviceId: string;
  host: string;
  port: number;
  status: ServiceStatus;
  metadata: {
    version: string;
    zone: string;
    region: string;
    labels: Record<string, string>;
  };
  health: {
    lastCheck: Date;
    consecutiveFailures: number;
    consecutiveSuccesses: number;
    lastFailure?: Date;
    lastSuccess?: Date;
  };
  metrics: {
    requestCount: number;
    errorCount: number;
    latencyP50: number;
    latencyP95: number;
    latencyP99: number;
    activeConnections: number;
  };
  registeredAt: Date;
  lastHeartbeat: Date;
}

// Service definition
interface ServiceDefinition {
  id: string;
  name: string;
  namespace: string;
  description: string;
  protocol: ProtocolType;
  instances: ServiceInstance[];
  endpoints: ServiceEndpoint[];
  dependencies: string[];
  settings: {
    timeout: number;
    retries: number;
    retryBackoff: number;
    connectionPool: {
      maxConnections: number;
      maxIdleConnections: number;
      idleTimeout: number;
    };
  };
  loadBalancing: {
    algorithm: LoadBalancingAlgorithm;
    weights?: Record<string, number>;
    healthCheck: {
      enabled: boolean;
      interval: number;
      timeout: number;
      unhealthyThreshold: number;
      healthyThreshold: number;
    };
  };
  circuitBreaker: CircuitBreakerConfig;
  rateLimiting?: RateLimitConfig;
  security: {
    mtlsEnabled: boolean;
    authRequired: boolean;
    allowedClients: string[];
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    owner: string;
    team: string;
    tags: string[];
  };
}

// Service endpoint
interface ServiceEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
  description: string;
  timeout?: number;
  retries?: number;
  rateLimit?: {
    requestsPerSecond: number;
    burstSize: number;
  };
  circuitBreaker?: CircuitBreakerConfig;
  headers?: Record<string, string>;
  responseTimeout: number;
}

// Circuit breaker config
interface CircuitBreakerConfig {
  enabled: boolean;
  threshold: number;
  timeout: number;
  halfOpenRequests: number;
  successThreshold: number;
  failureThreshold: number;
  excludeExceptions?: string[];
}

// Rate limit config
interface RateLimitConfig {
  enabled: boolean;
  requestsPerSecond: number;
  burstSize: number;
  keyType: 'ip' | 'user' | 'service' | 'custom';
  customKey?: string;
  responseCode: number;
}

// Traffic rule
interface TrafficRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  enabled: boolean;
  match: {
    source?: {
      services?: string[];
      namespaces?: string[];
      labels?: Record<string, string>;
    };
    destination?: {
      service: string;
      port?: number;
    };
    headers?: Record<string, string>;
    paths?: string[];
    methods?: string[];
  };
  action: {
    type: 'route' | 'redirect' | 'mirror' | 'abort' | 'delay';
    route?: {
      destination: {
        service: string;
        subset?: string;
        port?: number;
      };
      weight: number;
    }[];
    redirect?: {
      uri?: string;
      authority?: string;
      responseCode?: number;
    };
    mirror?: {
      service: string;
      percentage: number;
    };
    abort?: {
      percentage: number;
      httpStatus: number;
    };
    delay?: {
      percentage: number;
      fixedDelay: number;
    };
  };
  timeout?: number;
  retries?: {
    attempts: number;
    perTryTimeout: number;
    retryOn: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Service mesh gateway
interface MeshGateway {
  id: string;
  name: string;
  type: 'ingress' | 'egress' | 'internal';
  hosts: string[];
  ports: {
    number: number;
    protocol: ProtocolType;
    name: string;
  }[];
  tls?: {
    mode: 'passthrough' | 'simple' | 'mutual';
    serverCertificate?: string;
    privateKey?: string;
    caCertificates?: string;
  };
  routes: GatewayRoute[];
  status: 'active' | 'inactive' | 'error';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Gateway route
interface GatewayRoute {
  id: string;
  hosts: string[];
  paths: string[];
  destination: {
    service: string;
    port: number;
    weight?: number;
  }[];
  headers?: {
    request?: Record<string, string>;
    response?: Record<string, string>;
  };
  rewrite?: {
    uri?: string;
    authority?: string;
  };
  timeout?: number;
}

// Service call
interface ServiceCall {
  id: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  source: {
    service: string;
    instance: string;
    version: string;
  };
  destination: {
    service: string;
    instance: string;
    version: string;
    endpoint: string;
  };
  request: {
    method: string;
    path: string;
    headers: Record<string, string>;
    size: number;
  };
  response: {
    statusCode: number;
    headers: Record<string, string>;
    size: number;
  };
  timing: {
    startTime: Date;
    endTime: Date;
    duration: number;
    serverTime: number;
    networkTime: number;
  };
  status: 'success' | 'error' | 'timeout' | 'circuit_open';
  error?: {
    code: string;
    message: string;
    stack?: string;
  };
  metadata: {
    userId?: string;
    requestId?: string;
    correlationId?: string;
  };
}

// Circuit breaker status
interface CircuitBreakerStatus {
  serviceId: string;
  endpoint?: string;
  state: CircuitState;
  metrics: {
    totalRequests: number;
    failedRequests: number;
    successRate: number;
    lastFailure?: Date;
    lastStateChange: Date;
  };
  config: CircuitBreakerConfig;
}

// Service mesh metrics
interface MeshMetrics {
  period: { start: Date; end: Date };
  overview: {
    totalServices: number;
    healthyServices: number;
    totalInstances: number;
    healthyInstances: number;
    totalRequests: number;
    errorRate: number;
    avgLatency: number;
  };
  services: {
    service: string;
    requestCount: number;
    errorCount: number;
    errorRate: number;
    latencyP50: number;
    latencyP95: number;
    latencyP99: number;
  }[];
  traffic: {
    source: string;
    destination: string;
    requestCount: number;
    errorRate: number;
    avgLatency: number;
  }[];
  topEndpoints: {
    service: string;
    endpoint: string;
    requestCount: number;
    errorRate: number;
    avgLatency: number;
  }[];
}

// Service dependency
interface ServiceDependency {
  source: string;
  target: string;
  callCount: number;
  errorRate: number;
  avgLatency: number;
  lastCall: Date;
}

class ServiceMeshService {
  private static instance: ServiceMeshService;
  private services: Map<string, ServiceDefinition> = new Map();
  private instances: Map<string, ServiceInstance> = new Map();
  private trafficRules: Map<string, TrafficRule> = new Map();
  private gateways: Map<string, MeshGateway> = new Map();
  private serviceCalls: Map<string, ServiceCall> = new Map();
  private circuitBreakers: Map<string, CircuitBreakerStatus> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ServiceMeshService {
    if (!ServiceMeshService.instance) {
      ServiceMeshService.instance = new ServiceMeshService();
    }
    return ServiceMeshService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize services
    const servicesData = [
      { name: 'api-gateway', desc: 'API Gateway service', protocol: 'https' },
      { name: 'user-service', desc: 'User management service', protocol: 'grpc' },
      { name: 'alert-service', desc: 'Alert management service', protocol: 'grpc' },
      { name: 'notification-service', desc: 'Notification delivery service', protocol: 'grpc' },
      { name: 'auth-service', desc: 'Authentication service', protocol: 'grpc' },
      { name: 'location-service', desc: 'Location tracking service', protocol: 'grpc' },
      { name: 'analytics-service', desc: 'Analytics and reporting service', protocol: 'http' },
      { name: 'media-service', desc: 'Media processing service', protocol: 'http' },
      { name: 'search-service', desc: 'Search functionality service', protocol: 'grpc' },
      { name: 'cache-service', desc: 'Distributed cache service', protocol: 'tcp' },
    ];

    servicesData.forEach((s, idx) => {
      const service: ServiceDefinition = {
        id: `svc-${(idx + 1).toString().padStart(4, '0')}`,
        name: s.name,
        namespace: 'production',
        description: s.desc,
        protocol: s.protocol as ProtocolType,
        instances: [],
        endpoints: [],
        dependencies: [],
        settings: {
          timeout: 30000,
          retries: 3,
          retryBackoff: 1000,
          connectionPool: {
            maxConnections: 100,
            maxIdleConnections: 10,
            idleTimeout: 300000,
          },
        },
        loadBalancing: {
          algorithm: 'round_robin',
          healthCheck: {
            enabled: true,
            interval: 10000,
            timeout: 5000,
            unhealthyThreshold: 3,
            healthyThreshold: 2,
          },
        },
        circuitBreaker: {
          enabled: true,
          threshold: 50,
          timeout: 30000,
          halfOpenRequests: 3,
          successThreshold: 5,
          failureThreshold: 5,
        },
        rateLimiting: {
          enabled: true,
          requestsPerSecond: 1000,
          burstSize: 100,
          keyType: 'service',
          responseCode: 429,
        },
        security: {
          mtlsEnabled: true,
          authRequired: true,
          allowedClients: ['api-gateway', 'internal-services'],
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          owner: `team-${(idx % 3) + 1}`,
          team: ['platform', 'backend', 'infrastructure'][idx % 3],
          tags: ['microservice', s.protocol, 'production'],
        },
      };

      // Add instances
      const instanceCount = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < instanceCount; i++) {
        const instance: ServiceInstance = {
          id: `inst-${service.id}-${i + 1}`,
          serviceId: service.id,
          host: `${s.name}-${i + 1}.mesh.local`,
          port: 8080 + i,
          status: i === 0 ? 'healthy' : (['healthy', 'healthy', 'degraded'][i % 3] as ServiceStatus),
          metadata: {
            version: `1.${idx}.${i}`,
            zone: ['zone-a', 'zone-b', 'zone-c'][i % 3],
            region: 'asia-south1',
            labels: { tier: 'production', pod: `pod-${i + 1}` },
          },
          health: {
            lastCheck: new Date(),
            consecutiveFailures: 0,
            consecutiveSuccesses: i === 0 ? 100 : Math.floor(Math.random() * 50),
            lastSuccess: new Date(),
          },
          metrics: {
            requestCount: Math.floor(Math.random() * 100000) + 10000,
            errorCount: Math.floor(Math.random() * 100),
            latencyP50: Math.floor(Math.random() * 50) + 10,
            latencyP95: Math.floor(Math.random() * 150) + 50,
            latencyP99: Math.floor(Math.random() * 300) + 100,
            activeConnections: Math.floor(Math.random() * 50) + 10,
          },
          registeredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          lastHeartbeat: new Date(),
        };
        service.instances.push(instance);
        this.instances.set(instance.id, instance);
      }

      // Add endpoints
      const endpointsData = [
        { path: '/health', method: 'GET', desc: 'Health check endpoint' },
        { path: '/api/v1/resource', method: 'GET', desc: 'Get resources' },
        { path: '/api/v1/resource', method: 'POST', desc: 'Create resource' },
        { path: '/api/v1/resource/:id', method: 'PUT', desc: 'Update resource' },
        { path: '/api/v1/resource/:id', method: 'DELETE', desc: 'Delete resource' },
      ];

      endpointsData.forEach((ep, epIdx) => {
        service.endpoints.push({
          id: `ep-${service.id}-${epIdx + 1}`,
          path: ep.path,
          method: ep.method as ServiceEndpoint['method'],
          description: ep.desc,
          timeout: 30000,
          retries: 2,
          responseTimeout: 30000,
        });
      });

      // Add dependencies
      if (idx > 0) {
        service.dependencies = servicesData
          .slice(0, idx)
          .filter(() => Math.random() > 0.5)
          .map((d, dIdx) => `svc-${(dIdx + 1).toString().padStart(4, '0')}`);
      }

      this.services.set(service.id, service);

      // Initialize circuit breaker status
      const cbStatus: CircuitBreakerStatus = {
        serviceId: service.id,
        state: 'closed',
        metrics: {
          totalRequests: Math.floor(Math.random() * 100000) + 10000,
          failedRequests: Math.floor(Math.random() * 100),
          successRate: 99 + Math.random(),
          lastStateChange: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
        config: service.circuitBreaker,
      };
      this.circuitBreakers.set(service.id, cbStatus);
    });

    // Initialize traffic rules
    const trafficRulesData = [
      { name: 'Canary Release', desc: 'Route 10% traffic to canary version', priority: 100 },
      { name: 'Header Routing', desc: 'Route based on custom header', priority: 90 },
      { name: 'A/B Testing', desc: 'Split traffic for A/B testing', priority: 80 },
      { name: 'Fault Injection', desc: 'Inject faults for testing', priority: 70 },
      { name: 'Rate Limiting', desc: 'Rate limit specific endpoints', priority: 60 },
    ];

    trafficRulesData.forEach((rule, idx) => {
      const trafficRule: TrafficRule = {
        id: `rule-${(idx + 1).toString().padStart(4, '0')}`,
        name: rule.name,
        description: rule.desc,
        priority: rule.priority,
        enabled: idx < 3,
        match: {
          destination: {
            service: `svc-${(idx + 1).toString().padStart(4, '0')}`,
          },
        },
        action: {
          type: idx === 0 ? 'route' : idx === 3 ? 'delay' : 'route',
          route: idx !== 3 ? [
            { destination: { service: `svc-${(idx + 1).toString().padStart(4, '0')}`, subset: 'stable' }, weight: 90 },
            { destination: { service: `svc-${(idx + 1).toString().padStart(4, '0')}`, subset: 'canary' }, weight: 10 },
          ] : undefined,
          delay: idx === 3 ? { percentage: 10, fixedDelay: 500 } : undefined,
        },
        timeout: 30000,
        retries: { attempts: 3, perTryTimeout: 10000, retryOn: ['5xx', 'reset', 'connect-failure'] },
        createdAt: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.trafficRules.set(trafficRule.id, trafficRule);
    });

    // Initialize gateways
    const gatewaysData = [
      { name: 'Main Ingress', type: 'ingress', hosts: ['api.rescueping.com', 'www.rescueping.com'] },
      { name: 'Admin Ingress', type: 'ingress', hosts: ['admin.rescueping.com'] },
      { name: 'External Egress', type: 'egress', hosts: ['*.external-service.com'] },
    ];

    gatewaysData.forEach((gw, idx) => {
      const gateway: MeshGateway = {
        id: `gw-${(idx + 1).toString().padStart(4, '0')}`,
        name: gw.name,
        type: gw.type as MeshGateway['type'],
        hosts: gw.hosts,
        ports: [
          { number: 80, protocol: 'http', name: 'http' },
          { number: 443, protocol: 'https', name: 'https' },
        ],
        tls: gw.type === 'ingress' ? {
          mode: 'simple',
          serverCertificate: '/etc/certs/server.crt',
          privateKey: '/etc/certs/server.key',
        } : undefined,
        routes: [
          {
            id: `route-${idx}-1`,
            hosts: gw.hosts,
            paths: ['/api/*'],
            destination: [{ service: 'svc-0001', port: 8080, weight: 100 }],
            timeout: 30000,
          },
        ],
        status: 'active',
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.gateways.set(gateway.id, gateway);
    });

    // Initialize service calls
    for (let i = 0; i < 100; i++) {
      const sourceIdx = i % 10;
      const destIdx = (i + 1) % 10;
      const call: ServiceCall = {
        id: `call-${(i + 1).toString().padStart(8, '0')}`,
        traceId: this.generateTraceId(),
        spanId: this.generateSpanId(),
        parentSpanId: i > 0 ? this.generateSpanId() : undefined,
        source: {
          service: `svc-${(sourceIdx + 1).toString().padStart(4, '0')}`,
          instance: `inst-svc-${(sourceIdx + 1).toString().padStart(4, '0')}-1`,
          version: '1.0.0',
        },
        destination: {
          service: `svc-${(destIdx + 1).toString().padStart(4, '0')}`,
          instance: `inst-svc-${(destIdx + 1).toString().padStart(4, '0')}-1`,
          version: '1.0.0',
          endpoint: '/api/v1/resource',
        },
        request: {
          method: ['GET', 'POST', 'PUT', 'DELETE'][i % 4],
          path: '/api/v1/resource',
          headers: { 'content-type': 'application/json' },
          size: Math.floor(Math.random() * 1000) + 100,
        },
        response: {
          statusCode: i % 20 === 0 ? 500 : 200,
          headers: { 'content-type': 'application/json' },
          size: Math.floor(Math.random() * 5000) + 500,
        },
        timing: {
          startTime: new Date(Date.now() - i * 60 * 1000),
          endTime: new Date(Date.now() - i * 60 * 1000 + Math.floor(Math.random() * 100)),
          duration: Math.floor(Math.random() * 100) + 10,
          serverTime: Math.floor(Math.random() * 80) + 5,
          networkTime: Math.floor(Math.random() * 20) + 5,
        },
        status: i % 20 === 0 ? 'error' : 'success',
        error: i % 20 === 0 ? { code: 'INTERNAL_ERROR', message: 'Internal server error' } : undefined,
        metadata: {
          requestId: `req-${i + 1}`,
          correlationId: `corr-${Math.floor(i / 5) + 1}`,
        },
      };
      this.serviceCalls.set(call.id, call);
    }
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
   * Get services
   */
  public getServices(filter?: {
    namespace?: string;
    status?: ServiceStatus;
    protocol?: ProtocolType;
  }): ServiceDefinition[] {
    let services = Array.from(this.services.values());
    if (filter?.namespace) services = services.filter((s) => s.namespace === filter.namespace);
    if (filter?.protocol) services = services.filter((s) => s.protocol === filter.protocol);
    if (filter?.status) {
      services = services.filter((s) => {
        const healthyInstances = s.instances.filter((i) => i.status === 'healthy').length;
        if (filter.status === 'healthy') return healthyInstances === s.instances.length;
        if (filter.status === 'unhealthy') return healthyInstances === 0;
        return healthyInstances > 0 && healthyInstances < s.instances.length;
      });
    }
    return services.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get service
   */
  public getService(id: string): ServiceDefinition | undefined {
    return this.services.get(id);
  }

  /**
   * Get service by name
   */
  public getServiceByName(name: string, namespace: string = 'production'): ServiceDefinition | undefined {
    return Array.from(this.services.values()).find(
      (s) => s.name === name && s.namespace === namespace
    );
  }

  /**
   * Register service instance
   */
  public registerInstance(serviceId: string, instance: Omit<ServiceInstance, 'id' | 'serviceId'>): ServiceInstance {
    const service = this.services.get(serviceId);
    if (!service) throw new Error('Service not found');

    const newInstance: ServiceInstance = {
      ...instance,
      id: `inst-${serviceId}-${Date.now()}`,
      serviceId,
    };

    service.instances.push(newInstance);
    this.instances.set(newInstance.id, newInstance);

    this.emit('instance_registered', newInstance);

    return newInstance;
  }

  /**
   * Deregister service instance
   */
  public deregisterInstance(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (!instance) throw new Error('Instance not found');

    const service = this.services.get(instance.serviceId);
    if (service) {
      service.instances = service.instances.filter((i) => i.id !== instanceId);
    }

    this.instances.delete(instanceId);

    this.emit('instance_deregistered', { instanceId });
  }

  /**
   * Get service instances
   */
  public getInstances(serviceId: string): ServiceInstance[] {
    const service = this.services.get(serviceId);
    return service?.instances || [];
  }

  /**
   * Update instance health
   */
  public updateInstanceHealth(instanceId: string, healthy: boolean): void {
    const instance = this.instances.get(instanceId);
    if (!instance) throw new Error('Instance not found');

    instance.health.lastCheck = new Date();
    if (healthy) {
      instance.health.consecutiveSuccesses++;
      instance.health.consecutiveFailures = 0;
      instance.health.lastSuccess = new Date();
      if (instance.health.consecutiveSuccesses >= 2) {
        instance.status = 'healthy';
      }
    } else {
      instance.health.consecutiveFailures++;
      instance.health.consecutiveSuccesses = 0;
      instance.health.lastFailure = new Date();
      if (instance.health.consecutiveFailures >= 3) {
        instance.status = 'unhealthy';
      } else if (instance.health.consecutiveFailures >= 2) {
        instance.status = 'degraded';
      }
    }

    this.emit('instance_health_updated', instance);
  }

  /**
   * Get traffic rules
   */
  public getTrafficRules(filter?: { enabled?: boolean; serviceId?: string }): TrafficRule[] {
    let rules = Array.from(this.trafficRules.values());
    if (filter?.enabled !== undefined) rules = rules.filter((r) => r.enabled === filter.enabled);
    if (filter?.serviceId) rules = rules.filter((r) => r.match.destination?.service === filter.serviceId);
    return rules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get traffic rule
   */
  public getTrafficRule(id: string): TrafficRule | undefined {
    return this.trafficRules.get(id);
  }

  /**
   * Create traffic rule
   */
  public createTrafficRule(rule: Omit<TrafficRule, 'id' | 'createdAt' | 'updatedAt'>): TrafficRule {
    const newRule: TrafficRule = {
      ...rule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.trafficRules.set(newRule.id, newRule);

    this.emit('traffic_rule_created', newRule);

    return newRule;
  }

  /**
   * Get gateways
   */
  public getGateways(filter?: { type?: MeshGateway['type']; status?: MeshGateway['status'] }): MeshGateway[] {
    let gateways = Array.from(this.gateways.values());
    if (filter?.type) gateways = gateways.filter((g) => g.type === filter.type);
    if (filter?.status) gateways = gateways.filter((g) => g.status === filter.status);
    return gateways;
  }

  /**
   * Get gateway
   */
  public getGateway(id: string): MeshGateway | undefined {
    return this.gateways.get(id);
  }

  /**
   * Get service calls
   */
  public getServiceCalls(filter?: {
    sourceService?: string;
    destinationService?: string;
    status?: ServiceCall['status'];
    limit?: number;
  }): ServiceCall[] {
    let calls = Array.from(this.serviceCalls.values());
    if (filter?.sourceService) calls = calls.filter((c) => c.source.service === filter.sourceService);
    if (filter?.destinationService) calls = calls.filter((c) => c.destination.service === filter.destinationService);
    if (filter?.status) calls = calls.filter((c) => c.status === filter.status);
    calls = calls.sort((a, b) => b.timing.startTime.getTime() - a.timing.startTime.getTime());
    if (filter?.limit) calls = calls.slice(0, filter.limit);
    return calls;
  }

  /**
   * Get circuit breaker status
   */
  public getCircuitBreakerStatus(serviceId: string): CircuitBreakerStatus | undefined {
    return this.circuitBreakers.get(serviceId);
  }

  /**
   * Open circuit breaker
   */
  public openCircuitBreaker(serviceId: string): void {
    const cb = this.circuitBreakers.get(serviceId);
    if (!cb) throw new Error('Circuit breaker not found');

    cb.state = 'open';
    cb.metrics.lastStateChange = new Date();

    this.emit('circuit_breaker_opened', { serviceId });
  }

  /**
   * Close circuit breaker
   */
  public closeCircuitBreaker(serviceId: string): void {
    const cb = this.circuitBreakers.get(serviceId);
    if (!cb) throw new Error('Circuit breaker not found');

    cb.state = 'closed';
    cb.metrics.lastStateChange = new Date();

    this.emit('circuit_breaker_closed', { serviceId });
  }

  /**
   * Get service dependencies
   */
  public getServiceDependencies(): ServiceDependency[] {
    const dependencies: Map<string, ServiceDependency> = new Map();

    this.serviceCalls.forEach((call) => {
      const key = `${call.source.service}->${call.destination.service}`;
      const existing = dependencies.get(key);

      if (existing) {
        existing.callCount++;
        existing.lastCall = call.timing.startTime;
        if (call.status === 'error') {
          existing.errorRate = (existing.errorRate * (existing.callCount - 1) + 100) / existing.callCount;
        }
        existing.avgLatency = (existing.avgLatency * (existing.callCount - 1) + call.timing.duration) / existing.callCount;
      } else {
        dependencies.set(key, {
          source: call.source.service,
          target: call.destination.service,
          callCount: 1,
          errorRate: call.status === 'error' ? 100 : 0,
          avgLatency: call.timing.duration,
          lastCall: call.timing.startTime,
        });
      }
    });

    return Array.from(dependencies.values());
  }

  /**
   * Get mesh metrics
   */
  public getMetrics(period: { start: Date; end: Date }): MeshMetrics {
    const services = Array.from(this.services.values());
    const calls = Array.from(this.serviceCalls.values()).filter(
      (c) => c.timing.startTime >= period.start && c.timing.startTime <= period.end
    );

    const healthyServices = services.filter((s) =>
      s.instances.every((i) => i.status === 'healthy')
    ).length;

    const healthyInstances = Array.from(this.instances.values()).filter(
      (i) => i.status === 'healthy'
    ).length;

    const errorCount = calls.filter((c) => c.status === 'error').length;
    const totalLatency = calls.reduce((sum, c) => sum + c.timing.duration, 0);

    // Service metrics
    const serviceMetrics: Map<string, { requests: number; errors: number; latencies: number[] }> = new Map();
    calls.forEach((call) => {
      const key = call.destination.service;
      const existing = serviceMetrics.get(key) || { requests: 0, errors: 0, latencies: [] };
      existing.requests++;
      if (call.status === 'error') existing.errors++;
      existing.latencies.push(call.timing.duration);
      serviceMetrics.set(key, existing);
    });

    return {
      period,
      overview: {
        totalServices: services.length,
        healthyServices,
        totalInstances: this.instances.size,
        healthyInstances,
        totalRequests: calls.length,
        errorRate: calls.length > 0 ? (errorCount / calls.length) * 100 : 0,
        avgLatency: calls.length > 0 ? totalLatency / calls.length : 0,
      },
      services: Array.from(serviceMetrics.entries()).map(([service, metrics]) => {
        const sorted = metrics.latencies.sort((a, b) => a - b);
        return {
          service,
          requestCount: metrics.requests,
          errorCount: metrics.errors,
          errorRate: (metrics.errors / metrics.requests) * 100,
          latencyP50: sorted[Math.floor(sorted.length * 0.5)] || 0,
          latencyP95: sorted[Math.floor(sorted.length * 0.95)] || 0,
          latencyP99: sorted[Math.floor(sorted.length * 0.99)] || 0,
        };
      }),
      traffic: [],
      topEndpoints: [],
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

export const serviceMeshService = ServiceMeshService.getInstance();
export type {
  ServiceStatus,
  LoadBalancingAlgorithm,
  ProtocolType,
  CircuitState,
  ServiceInstance,
  ServiceDefinition,
  ServiceEndpoint,
  CircuitBreakerConfig,
  RateLimitConfig,
  TrafficRule,
  MeshGateway,
  GatewayRoute,
  ServiceCall,
  CircuitBreakerStatus,
  MeshMetrics,
  ServiceDependency,
};
