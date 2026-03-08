/**
 * Service Registry Service
 * Comprehensive service discovery, registration, health monitoring, and load balancing
 */

// Service status
type RegistryServiceStatus = 'up' | 'down' | 'starting' | 'stopping' | 'unhealthy' | 'unknown';

// Health status
type HealthStatus = 'healthy' | 'unhealthy' | 'degraded' | 'unknown';

// Registration mode
type RegistrationMode = 'self' | 'third_party' | 'automatic';

// Load balancing strategy
type LoadBalancingStrategy = 'round_robin' | 'random' | 'least_connections' | 'weighted' | 'ip_hash' | 'consistent_hash';

// Protocol
type ServiceProtocol = 'http' | 'https' | 'grpc' | 'tcp' | 'udp' | 'websocket';

// Service Instance
interface ServiceInstance {
  id: string;
  serviceId: string;
  serviceName: string;
  version: string;
  status: RegistryServiceStatus;
  host: string;
  port: number;
  protocol: ServiceProtocol;
  secure: boolean;
  weight: number;
  zone: string;
  region: string;
  metadata: {
    environment: string;
    cluster: string;
    namespace?: string;
    podName?: string;
    containerId?: string;
    nodeId?: string;
    buildVersion?: string;
    gitCommit?: string;
    startTime: Date;
    tags: Record<string, string>;
  };
  endpoints: {
    health: string;
    info?: string;
    metrics?: string;
    admin?: string;
  };
  health: {
    status: HealthStatus;
    lastCheck: Date;
    consecutiveSuccesses: number;
    consecutiveFailures: number;
    latency: number;
    details: Record<string, unknown>;
  };
  traffic: {
    enabled: boolean;
    weight: number;
    connections: number;
    requestsPerSecond: number;
  };
  lease: {
    registeredAt: Date;
    lastRenewal: Date;
    expiresAt: Date;
    ttl: number;
  };
}

// Registered Service
interface RegisteredService {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  status: RegistryServiceStatus;
  type: 'microservice' | 'api' | 'database' | 'cache' | 'queue' | 'external';
  instances: ServiceInstance[];
  config: {
    registrationMode: RegistrationMode;
    loadBalancing: LoadBalancingStrategy;
    healthCheck: HealthCheckConfig;
    circuitBreaker?: CircuitBreakerConfig;
    retryPolicy?: RetryPolicy;
    timeout?: TimeoutConfig;
  };
  endpoints: {
    primary: string;
    fallback?: string[];
  };
  dependencies: string[];
  dependents: string[];
  sla: {
    availability: number;
    latencyP50: number;
    latencyP99: number;
    errorRate: number;
  };
  statistics: {
    totalInstances: number;
    healthyInstances: number;
    unhealthyInstances: number;
    totalRequests: number;
    failedRequests: number;
    avgResponseTime: number;
  };
  tags: Record<string, string>;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    team: string;
    owner: string;
    documentation?: string;
    repository?: string;
  };
}

// Health Check Config
interface HealthCheckConfig {
  enabled: boolean;
  protocol: 'http' | 'https' | 'tcp' | 'grpc';
  path: string;
  port?: number;
  interval: number;
  timeout: number;
  healthyThreshold: number;
  unhealthyThreshold: number;
  headers?: Record<string, string>;
}

// Circuit Breaker Config
interface CircuitBreakerConfig {
  enabled: boolean;
  errorThreshold: number;
  volumeThreshold: number;
  sleepWindow: number;
  halfOpenRequests: number;
}

// Retry Policy
interface RetryPolicy {
  enabled: boolean;
  maxRetries: number;
  retryOn: string[];
  backoff: {
    type: 'fixed' | 'exponential' | 'linear';
    initialDelay: number;
    maxDelay: number;
    multiplier?: number;
  };
}

// Timeout Config
interface TimeoutConfig {
  connect: number;
  read: number;
  write: number;
  idle: number;
}

// Service Namespace
interface ServiceNamespace {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'deprecated';
  environment: string;
  services: string[];
  config: {
    isolation: boolean;
    defaultLoadBalancing: LoadBalancingStrategy;
    defaultHealthCheck: HealthCheckConfig;
  };
  quotas: {
    maxServices: number;
    maxInstancesPerService: number;
    requestsPerSecond: number;
  };
  access: {
    allowedServices: string[];
    deniedServices: string[];
    policies: string[];
  };
  statistics: {
    totalServices: number;
    totalInstances: number;
    healthyInstances: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Service Endpoint
interface ServiceEndpoint {
  id: string;
  serviceId: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  protocol: ServiceProtocol;
  version: string;
  status: 'active' | 'deprecated' | 'disabled';
  authentication: {
    required: boolean;
    type: 'none' | 'api_key' | 'oauth2' | 'jwt' | 'basic';
  };
  rateLimit?: {
    enabled: boolean;
    requestsPerSecond: number;
    burst: number;
  };
  cache?: {
    enabled: boolean;
    ttl: number;
    varyBy: string[];
  };
  documentation?: {
    summary: string;
    description: string;
    parameters: { name: string; type: string; required: boolean }[];
    responses: { code: number; description: string }[];
  };
  statistics: {
    totalRequests: number;
    avgResponseTime: number;
    errorRate: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Service Discovery Request
interface DiscoveryRequest {
  id: string;
  serviceName: string;
  version?: string;
  namespace?: string;
  tags?: Record<string, string>;
  preferredZone?: string;
  loadBalancing?: LoadBalancingStrategy;
  timeout?: number;
}

// Service Discovery Response
interface DiscoveryResponse {
  requestId: string;
  serviceName: string;
  instances: {
    id: string;
    host: string;
    port: number;
    protocol: ServiceProtocol;
    weight: number;
    metadata: Record<string, string>;
  }[];
  totalInstances: number;
  healthyInstances: number;
  loadBalancer: LoadBalancingStrategy;
  cacheControl: {
    maxAge: number;
    stale: number;
  };
  timestamp: Date;
}

// Registration Request
interface RegistrationRequest {
  serviceName: string;
  version: string;
  host: string;
  port: number;
  protocol: ServiceProtocol;
  secure: boolean;
  metadata: Record<string, string>;
  healthEndpoint: string;
  ttl: number;
}

// Registration Response
interface RegistrationResponse {
  instanceId: string;
  serviceId: string;
  status: 'registered' | 'updated' | 'failed';
  lease: {
    ttl: number;
    expiresAt: Date;
    renewalToken: string;
  };
  message?: string;
}

// Health Check Result
interface HealthCheckResult {
  instanceId: string;
  timestamp: Date;
  status: HealthStatus;
  latency: number;
  statusCode?: number;
  error?: string;
  details: Record<string, unknown>;
}

// Service Event
interface ServiceEvent {
  id: string;
  type: 'registered' | 'deregistered' | 'health_changed' | 'config_updated' | 'traffic_shifted';
  serviceId: string;
  serviceName: string;
  instanceId?: string;
  timestamp: Date;
  details: {
    previousState?: unknown;
    currentState?: unknown;
    reason?: string;
    initiatedBy?: string;
  };
  metadata: {
    source: string;
    correlationId?: string;
  };
}

// Service Watch
interface ServiceWatch {
  id: string;
  serviceName: string;
  callback: string;
  filters: {
    events: string[];
    zones?: string[];
    versions?: string[];
  };
  status: 'active' | 'paused' | 'expired';
  statistics: {
    eventsReceived: number;
    lastEvent?: Date;
  };
  metadata: {
    createdAt: Date;
    expiresAt?: Date;
    clientId: string;
  };
}

// Service Mesh Config
interface ServiceMeshConfig {
  id: string;
  name: string;
  enabled: boolean;
  sidecar: {
    enabled: boolean;
    image: string;
    resources: {
      cpu: string;
      memory: string;
    };
  };
  mtls: {
    enabled: boolean;
    mode: 'strict' | 'permissive' | 'disabled';
    certificateRotation: number;
  };
  traffic: {
    defaultTimeout: number;
    retryPolicy: RetryPolicy;
    circuitBreaker: CircuitBreakerConfig;
  };
  observability: {
    tracing: boolean;
    metrics: boolean;
    accessLogs: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Registry Statistics
interface RegistryStatistics {
  overview: {
    totalServices: number;
    totalInstances: number;
    healthyInstances: number;
    unhealthyInstances: number;
    totalNamespaces: number;
  };
  registrations: {
    last24h: number;
    lastHour: number;
    lastMinute: number;
  };
  healthChecks: {
    totalChecks: number;
    successfulChecks: number;
    failedChecks: number;
    avgLatency: number;
  };
  discovery: {
    totalRequests: number;
    avgLatency: number;
    cacheHitRate: number;
  };
  byNamespace: {
    namespace: string;
    services: number;
    instances: number;
    healthy: number;
  }[];
  byZone: {
    zone: string;
    services: number;
    instances: number;
  }[];
  trends: {
    timestamp: string;
    instances: number;
    healthy: number;
    requests: number;
  }[];
}

class ServiceRegistryService {
  private static instance: ServiceRegistryService;
  private services: Map<string, RegisteredService> = new Map();
  private instances: Map<string, ServiceInstance> = new Map();
  private namespaces: Map<string, ServiceNamespace> = new Map();
  private endpoints: Map<string, ServiceEndpoint> = new Map();
  private events: Map<string, ServiceEvent> = new Map();
  private watches: Map<string, ServiceWatch> = new Map();
  private meshConfigs: Map<string, ServiceMeshConfig> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ServiceRegistryService {
    if (!ServiceRegistryService.instance) {
      ServiceRegistryService.instance = new ServiceRegistryService();
    }
    return ServiceRegistryService.instance;
  }

  /**
   * Generate ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize Namespaces
    const namespacesData = [
      { name: 'production', environment: 'production' },
      { name: 'staging', environment: 'staging' },
      { name: 'development', environment: 'development' },
    ];

    namespacesData.forEach((ns, idx) => {
      const namespace: ServiceNamespace = {
        id: `ns-${(idx + 1).toString().padStart(4, '0')}`,
        name: ns.name,
        description: `${ns.name.charAt(0).toUpperCase() + ns.name.slice(1)} environment namespace`,
        status: 'active',
        environment: ns.environment,
        services: [],
        config: {
          isolation: true,
          defaultLoadBalancing: 'round_robin',
          defaultHealthCheck: {
            enabled: true,
            protocol: 'http',
            path: '/health',
            interval: 10,
            timeout: 5,
            healthyThreshold: 2,
            unhealthyThreshold: 3,
          },
        },
        quotas: {
          maxServices: 100,
          maxInstancesPerService: 50,
          requestsPerSecond: 10000,
        },
        access: {
          allowedServices: [],
          deniedServices: [],
          policies: ['default-allow'],
        },
        statistics: {
          totalServices: 0,
          totalInstances: 0,
          healthyInstances: 0,
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.namespaces.set(namespace.id, namespace);
    });

    // Initialize Services
    const servicesData = [
      { name: 'api-gateway', displayName: 'API Gateway', type: 'api', instances: 3 },
      { name: 'user-service', displayName: 'User Service', type: 'microservice', instances: 5 },
      { name: 'alert-service', displayName: 'Alert Service', type: 'microservice', instances: 4 },
      { name: 'notification-service', displayName: 'Notification Service', type: 'microservice', instances: 3 },
      { name: 'auth-service', displayName: 'Auth Service', type: 'microservice', instances: 3 },
      { name: 'analytics-service', displayName: 'Analytics Service', type: 'microservice', instances: 2 },
      { name: 'postgres-primary', displayName: 'PostgreSQL Primary', type: 'database', instances: 1 },
      { name: 'postgres-replica', displayName: 'PostgreSQL Replica', type: 'database', instances: 2 },
      { name: 'redis-cache', displayName: 'Redis Cache', type: 'cache', instances: 3 },
      { name: 'rabbitmq', displayName: 'RabbitMQ', type: 'queue', instances: 3 },
    ];

    servicesData.forEach((s, idx) => {
      const serviceId = `svc-${(idx + 1).toString().padStart(4, '0')}`;
      const serviceInstances: ServiceInstance[] = [];

      // Create instances for each service
      for (let i = 0; i < s.instances; i++) {
        const instanceId = `inst-${serviceId}-${(i + 1).toString().padStart(3, '0')}`;
        const isHealthy = Math.random() > 0.1;

        const instance: ServiceInstance = {
          id: instanceId,
          serviceId,
          serviceName: s.name,
          version: '2.1.0',
          status: isHealthy ? 'up' : 'unhealthy',
          host: `${s.name}-${i + 1}.rescueping.internal`,
          port: s.type === 'database' ? 5432 : s.type === 'cache' ? 6379 : s.type === 'queue' ? 5672 : 8080,
          protocol: s.type === 'database' || s.type === 'cache' || s.type === 'queue' ? 'tcp' : 'http',
          secure: true,
          weight: 100,
          zone: ['ap-south-1a', 'ap-south-1b', 'ap-south-1c'][i % 3],
          region: 'ap-south-1',
          metadata: {
            environment: 'production',
            cluster: 'main',
            namespace: 'production',
            podName: `${s.name}-${Math.random().toString(36).substr(2, 10)}`,
            startTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            tags: {
              version: '2.1.0',
              team: ['platform', 'backend', 'data'][idx % 3],
            },
          },
          endpoints: {
            health: '/health',
            info: '/info',
            metrics: '/metrics',
          },
          health: {
            status: isHealthy ? 'healthy' : 'unhealthy',
            lastCheck: new Date(),
            consecutiveSuccesses: isHealthy ? Math.floor(Math.random() * 100) + 10 : 0,
            consecutiveFailures: isHealthy ? 0 : Math.floor(Math.random() * 5) + 1,
            latency: Math.floor(Math.random() * 50) + 5,
            details: {
              database: isHealthy ? 'ok' : 'error',
              cache: 'ok',
              diskSpace: 'ok',
            },
          },
          traffic: {
            enabled: true,
            weight: 100,
            connections: Math.floor(Math.random() * 100) + 10,
            requestsPerSecond: Math.floor(Math.random() * 500) + 50,
          },
          lease: {
            registeredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            lastRenewal: new Date(Date.now() - Math.random() * 30000),
            expiresAt: new Date(Date.now() + 90000),
            ttl: 90,
          },
        };

        this.instances.set(instance.id, instance);
        serviceInstances.push(instance);
      }

      const healthyCount = serviceInstances.filter((i) => i.health.status === 'healthy').length;

      const service: RegisteredService = {
        id: serviceId,
        name: s.name,
        displayName: s.displayName,
        description: `${s.displayName} for Rescue Ping platform`,
        version: '2.1.0',
        status: healthyCount > 0 ? 'up' : 'down',
        type: s.type as RegisteredService['type'],
        instances: serviceInstances,
        config: {
          registrationMode: 'self',
          loadBalancing: 'round_robin',
          healthCheck: {
            enabled: true,
            protocol: 'http',
            path: '/health',
            interval: 10,
            timeout: 5,
            healthyThreshold: 2,
            unhealthyThreshold: 3,
          },
          circuitBreaker: {
            enabled: true,
            errorThreshold: 50,
            volumeThreshold: 20,
            sleepWindow: 30000,
            halfOpenRequests: 5,
          },
          retryPolicy: {
            enabled: true,
            maxRetries: 3,
            retryOn: ['5xx', 'reset', 'connect-failure'],
            backoff: {
              type: 'exponential',
              initialDelay: 100,
              maxDelay: 10000,
              multiplier: 2,
            },
          },
          timeout: {
            connect: 5000,
            read: 30000,
            write: 30000,
            idle: 60000,
          },
        },
        endpoints: {
          primary: `http://${s.name}.rescueping.internal:8080`,
          fallback: [`http://${s.name}-fallback.rescueping.internal:8080`],
        },
        dependencies: idx > 0 ? [servicesData[Math.max(0, idx - 1)].name] : [],
        dependents: idx < servicesData.length - 1 ? [servicesData[idx + 1].name] : [],
        sla: {
          availability: 99.9,
          latencyP50: 50,
          latencyP99: 200,
          errorRate: 0.1,
        },
        statistics: {
          totalInstances: serviceInstances.length,
          healthyInstances: healthyCount,
          unhealthyInstances: serviceInstances.length - healthyCount,
          totalRequests: Math.floor(Math.random() * 10000000),
          failedRequests: Math.floor(Math.random() * 10000),
          avgResponseTime: Math.floor(Math.random() * 50) + 20,
        },
        tags: {
          environment: 'production',
          tier: ['tier1', 'tier2', 'tier3'][idx % 3],
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          team: ['platform', 'backend', 'data'][idx % 3],
          owner: `team-${(idx % 3) + 1}`,
          documentation: `https://docs.rescueping.com/${s.name}`,
          repository: `https://github.com/rescueping/${s.name}`,
        },
      };

      this.services.set(service.id, service);

      // Create endpoints for each service
      const endpointMethods: ('GET' | 'POST' | 'PUT' | 'DELETE')[] = ['GET', 'POST', 'PUT', 'DELETE'];
      endpointMethods.slice(0, 3).forEach((method, epIdx) => {
        const endpoint: ServiceEndpoint = {
          id: `ep-${serviceId}-${epIdx + 1}`,
          serviceId,
          name: `${method} /${s.name}/api/v1`,
          path: `/api/v1/${s.name.replace('-service', '')}`,
          method,
          protocol: 'http',
          version: 'v1',
          status: 'active',
          authentication: {
            required: true,
            type: 'jwt',
          },
          rateLimit: {
            enabled: true,
            requestsPerSecond: 1000,
            burst: 100,
          },
          cache: method === 'GET' ? {
            enabled: true,
            ttl: 60,
            varyBy: ['Authorization', 'Accept'],
          } : undefined,
          documentation: {
            summary: `${method} ${s.displayName} resource`,
            description: `Endpoint to ${method.toLowerCase()} ${s.displayName.toLowerCase()} resources`,
            parameters: [
              { name: 'id', type: 'string', required: method !== 'POST' },
            ],
            responses: [
              { code: 200, description: 'Success' },
              { code: 400, description: 'Bad Request' },
              { code: 401, description: 'Unauthorized' },
              { code: 500, description: 'Internal Server Error' },
            ],
          },
          statistics: {
            totalRequests: Math.floor(Math.random() * 1000000),
            avgResponseTime: Math.floor(Math.random() * 50) + 10,
            errorRate: Math.random() * 2,
          },
          metadata: {
            createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
          },
        };
        this.endpoints.set(endpoint.id, endpoint);
      });
    });

    // Update namespace statistics
    const prodNamespace = Array.from(this.namespaces.values()).find((ns) => ns.name === 'production');
    if (prodNamespace) {
      const allServices = Array.from(this.services.values());
      const allInstances = Array.from(this.instances.values());
      prodNamespace.services = allServices.map((s) => s.name);
      prodNamespace.statistics = {
        totalServices: allServices.length,
        totalInstances: allInstances.length,
        healthyInstances: allInstances.filter((i) => i.health.status === 'healthy').length,
      };
    }

    // Initialize Events
    for (let i = 0; i < 50; i++) {
      const eventTypes: ServiceEvent['type'][] = ['registered', 'deregistered', 'health_changed', 'config_updated', 'traffic_shifted'];
      const services = Array.from(this.services.values());
      const randomService = services[Math.floor(Math.random() * services.length)];
      const instances = Array.from(this.instances.values()).filter((inst) => inst.serviceId === randomService.id);
      const randomInstance = instances.length > 0 ? instances[Math.floor(Math.random() * instances.length)] : undefined;

      const event: ServiceEvent = {
        id: `event-${(i + 1).toString().padStart(6, '0')}`,
        type: eventTypes[i % eventTypes.length],
        serviceId: randomService.id,
        serviceName: randomService.name,
        instanceId: randomInstance?.id,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        details: {
          reason: ['Scheduled restart', 'Health check failure', 'Manual update', 'Auto-scaling'][i % 4],
          initiatedBy: i % 2 === 0 ? 'system' : 'admin',
        },
        metadata: {
          source: 'registry-service',
          correlationId: `corr-${Math.random().toString(36).substr(2, 9)}`,
        },
      };
      this.events.set(event.id, event);
    }

    // Initialize Watches
    const servicesArr = Array.from(this.services.values());
    for (let i = 0; i < 10; i++) {
      const randomService = servicesArr[i % servicesArr.length];
      const watch: ServiceWatch = {
        id: `watch-${(i + 1).toString().padStart(4, '0')}`,
        serviceName: randomService.name,
        callback: `https://client-${i + 1}.rescueping.internal/callback`,
        filters: {
          events: ['health_changed', 'registered', 'deregistered'],
          zones: ['ap-south-1a', 'ap-south-1b'],
        },
        status: i < 8 ? 'active' : 'paused',
        statistics: {
          eventsReceived: Math.floor(Math.random() * 1000) + 100,
          lastEvent: new Date(Date.now() - Math.random() * 3600000),
        },
        metadata: {
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          clientId: `client-${i + 1}`,
        },
      };
      this.watches.set(watch.id, watch);
    }

    // Initialize Mesh Config
    const meshConfig: ServiceMeshConfig = {
      id: 'mesh-0001',
      name: 'production-mesh',
      enabled: true,
      sidecar: {
        enabled: true,
        image: 'envoyproxy/envoy:v1.28.0',
        resources: {
          cpu: '100m',
          memory: '128Mi',
        },
      },
      mtls: {
        enabled: true,
        mode: 'strict',
        certificateRotation: 86400,
      },
      traffic: {
        defaultTimeout: 30000,
        retryPolicy: {
          enabled: true,
          maxRetries: 3,
          retryOn: ['5xx', 'reset'],
          backoff: {
            type: 'exponential',
            initialDelay: 100,
            maxDelay: 10000,
            multiplier: 2,
          },
        },
        circuitBreaker: {
          enabled: true,
          errorThreshold: 50,
          volumeThreshold: 20,
          sleepWindow: 30000,
          halfOpenRequests: 5,
        },
      },
      observability: {
        tracing: true,
        metrics: true,
        accessLogs: true,
      },
      metadata: {
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    };
    this.meshConfigs.set(meshConfig.id, meshConfig);
  }

  /**
   * Get Services
   */
  public getServices(filter?: { type?: RegisteredService['type']; status?: RegistryServiceStatus; namespace?: string }): RegisteredService[] {
    let services = Array.from(this.services.values());
    if (filter?.type) services = services.filter((s) => s.type === filter.type);
    if (filter?.status) services = services.filter((s) => s.status === filter.status);
    return services;
  }

  /**
   * Get Service
   */
  public getService(name: string): RegisteredService | undefined {
    return Array.from(this.services.values()).find((s) => s.name === name);
  }

  /**
   * Get Service by ID
   */
  public getServiceById(id: string): RegisteredService | undefined {
    return this.services.get(id);
  }

  /**
   * Get Instances
   */
  public getInstances(filter?: { serviceId?: string; status?: RegistryServiceStatus; zone?: string }): ServiceInstance[] {
    let instances = Array.from(this.instances.values());
    if (filter?.serviceId) instances = instances.filter((i) => i.serviceId === filter.serviceId);
    if (filter?.status) instances = instances.filter((i) => i.status === filter.status);
    if (filter?.zone) instances = instances.filter((i) => i.zone === filter.zone);
    return instances;
  }

  /**
   * Get Instance
   */
  public getInstance(id: string): ServiceInstance | undefined {
    return this.instances.get(id);
  }

  /**
   * Get Namespaces
   */
  public getNamespaces(): ServiceNamespace[] {
    return Array.from(this.namespaces.values());
  }

  /**
   * Get Endpoints
   */
  public getEndpoints(filter?: { serviceId?: string }): ServiceEndpoint[] {
    let endpoints = Array.from(this.endpoints.values());
    if (filter?.serviceId) endpoints = endpoints.filter((e) => e.serviceId === filter.serviceId);
    return endpoints;
  }

  /**
   * Get Events
   */
  public getEvents(filter?: { serviceId?: string; type?: ServiceEvent['type']; limit?: number }): ServiceEvent[] {
    let events = Array.from(this.events.values());
    if (filter?.serviceId) events = events.filter((e) => e.serviceId === filter.serviceId);
    if (filter?.type) events = events.filter((e) => e.type === filter.type);
    events = events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (filter?.limit) events = events.slice(0, filter.limit);
    return events;
  }

  /**
   * Get Watches
   */
  public getWatches(filter?: { serviceName?: string }): ServiceWatch[] {
    let watches = Array.from(this.watches.values());
    if (filter?.serviceName) watches = watches.filter((w) => w.serviceName === filter.serviceName);
    return watches;
  }

  /**
   * Discover Service
   */
  public discoverService(request: DiscoveryRequest): DiscoveryResponse {
    const service = this.getService(request.serviceName);
    if (!service) throw new Error(`Service ${request.serviceName} not found`);

    let instances = service.instances.filter((i) => i.health.status === 'healthy' && i.traffic.enabled);

    if (request.version) {
      instances = instances.filter((i) => i.version === request.version);
    }

    if (request.preferredZone) {
      const preferredInstances = instances.filter((i) => i.zone === request.preferredZone);
      if (preferredInstances.length > 0) {
        instances = preferredInstances;
      }
    }

    return {
      requestId: request.id,
      serviceName: request.serviceName,
      instances: instances.map((i) => ({
        id: i.id,
        host: i.host,
        port: i.port,
        protocol: i.protocol,
        weight: i.weight,
        metadata: i.metadata.tags,
      })),
      totalInstances: service.instances.length,
      healthyInstances: instances.length,
      loadBalancer: request.loadBalancing || service.config.loadBalancing,
      cacheControl: {
        maxAge: 30,
        stale: 60,
      },
      timestamp: new Date(),
    };
  }

  /**
   * Register Instance
   */
  public registerInstance(request: RegistrationRequest): RegistrationResponse {
    const existingService = this.getService(request.serviceName);
    const serviceId = existingService?.id || `svc-${this.generateId()}`;
    const instanceId = `inst-${this.generateId()}`;

    const now = new Date();
    const instance: ServiceInstance = {
      id: instanceId,
      serviceId,
      serviceName: request.serviceName,
      version: request.version,
      status: 'starting',
      host: request.host,
      port: request.port,
      protocol: request.protocol,
      secure: request.secure,
      weight: 100,
      zone: 'ap-south-1a',
      region: 'ap-south-1',
      metadata: {
        environment: 'production',
        cluster: 'main',
        startTime: now,
        tags: request.metadata,
      },
      endpoints: {
        health: request.healthEndpoint,
      },
      health: {
        status: 'unknown',
        lastCheck: now,
        consecutiveSuccesses: 0,
        consecutiveFailures: 0,
        latency: 0,
        details: {},
      },
      traffic: {
        enabled: false,
        weight: 100,
        connections: 0,
        requestsPerSecond: 0,
      },
      lease: {
        registeredAt: now,
        lastRenewal: now,
        expiresAt: new Date(now.getTime() + request.ttl * 1000),
        ttl: request.ttl,
      },
    };

    this.instances.set(instance.id, instance);
    this.emit('instance_registered', instance);

    return {
      instanceId,
      serviceId,
      status: 'registered',
      lease: {
        ttl: request.ttl,
        expiresAt: instance.lease.expiresAt,
        renewalToken: `token-${this.generateId()}`,
      },
    };
  }

  /**
   * Deregister Instance
   */
  public deregisterInstance(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (!instance) throw new Error('Instance not found');

    instance.status = 'stopping';
    instance.traffic.enabled = false;

    this.emit('instance_deregistered', instance);
    this.instances.delete(instanceId);
  }

  /**
   * Renew Lease
   */
  public renewLease(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (!instance) throw new Error('Instance not found');

    const now = new Date();
    instance.lease.lastRenewal = now;
    instance.lease.expiresAt = new Date(now.getTime() + instance.lease.ttl * 1000);
  }

  /**
   * Get Statistics
   */
  public getStatistics(): RegistryStatistics {
    const services = Array.from(this.services.values());
    const instances = Array.from(this.instances.values());
    const namespaces = Array.from(this.namespaces.values());
    const events = Array.from(this.events.values());

    const healthyInstances = instances.filter((i) => i.health.status === 'healthy');
    const recentEvents = events.filter((e) => e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000));

    const byZone = instances.reduce((acc, inst) => {
      if (!acc[inst.zone]) acc[inst.zone] = { services: new Set<string>(), instances: 0 };
      acc[inst.zone].services.add(inst.serviceName);
      acc[inst.zone].instances++;
      return acc;
    }, {} as Record<string, { services: Set<string>; instances: number }>);

    return {
      overview: {
        totalServices: services.length,
        totalInstances: instances.length,
        healthyInstances: healthyInstances.length,
        unhealthyInstances: instances.length - healthyInstances.length,
        totalNamespaces: namespaces.length,
      },
      registrations: {
        last24h: recentEvents.filter((e) => e.type === 'registered').length,
        lastHour: events.filter((e) => e.type === 'registered' && e.timestamp > new Date(Date.now() - 3600000)).length,
        lastMinute: events.filter((e) => e.type === 'registered' && e.timestamp > new Date(Date.now() - 60000)).length,
      },
      healthChecks: {
        totalChecks: instances.reduce((sum, i) => sum + i.health.consecutiveSuccesses + i.health.consecutiveFailures, 0),
        successfulChecks: instances.reduce((sum, i) => sum + i.health.consecutiveSuccesses, 0),
        failedChecks: instances.reduce((sum, i) => sum + i.health.consecutiveFailures, 0),
        avgLatency: instances.reduce((sum, i) => sum + i.health.latency, 0) / instances.length,
      },
      discovery: {
        totalRequests: Math.floor(Math.random() * 10000000),
        avgLatency: Math.floor(Math.random() * 10) + 2,
        cacheHitRate: 85,
      },
      byNamespace: namespaces.map((ns) => ({
        namespace: ns.name,
        services: ns.statistics.totalServices,
        instances: ns.statistics.totalInstances,
        healthy: ns.statistics.healthyInstances,
      })),
      byZone: Object.entries(byZone).map(([zone, data]) => ({
        zone,
        services: data.services.size,
        instances: data.instances,
      })),
      trends: [],
    };
  }

  /**
   * Get Mesh Config
   */
  public getMeshConfig(): ServiceMeshConfig | undefined {
    return Array.from(this.meshConfigs.values())[0];
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

export const serviceRegistryService = ServiceRegistryService.getInstance();
export type {
  RegistryServiceStatus,
  HealthStatus,
  RegistrationMode,
  LoadBalancingStrategy,
  ServiceProtocol,
  ServiceInstance,
  RegisteredService,
  HealthCheckConfig,
  CircuitBreakerConfig,
  RetryPolicy,
  TimeoutConfig,
  ServiceNamespace,
  ServiceEndpoint,
  DiscoveryRequest,
  DiscoveryResponse,
  RegistrationRequest,
  RegistrationResponse,
  HealthCheckResult,
  ServiceEvent,
  ServiceWatch,
  ServiceMeshConfig,
  RegistryStatistics,
};
