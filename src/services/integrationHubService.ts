/**
 * Integration Hub Service
 * Third-party service integrations, API connectors, and data synchronization
 */

// Integration status
type IntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error' | 'maintenance' | 'deprecated';

// Integration category
type IntegrationCategory = 'government' | 'weather' | 'communication' | 'payment' | 'mapping' | 'analytics' | 'storage' | 'identity' | 'social' | 'emergency' | 'logistics' | 'healthcare';

// Authentication type
type AuthType = 'api_key' | 'oauth2' | 'basic' | 'bearer' | 'certificate' | 'hmac' | 'custom';

// Sync direction
type SyncDirection = 'inbound' | 'outbound' | 'bidirectional';

// Integration
interface Integration {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  version: string;
  icon: string;
  website: string;
  documentation: string;
  authentication: AuthenticationConfig;
  endpoints: Endpoint[];
  webhooks: WebhookConfig[];
  dataMapping: DataMapping[];
  syncConfig: SyncConfiguration;
  rateLimits: RateLimitConfig;
  features: string[];
  requiredScopes: string[];
  settings: Record<string, unknown>;
  metadata: {
    installedAt: Date;
    installedBy: string;
    lastConnectedAt?: Date;
    lastSyncAt?: Date;
    connectedBy?: string;
  };
  healthCheck: HealthCheckResult;
}

// Authentication configuration
interface AuthenticationConfig {
  type: AuthType;
  credentials: {
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    username?: string;
    password?: string;
    token?: string;
    certificate?: string;
    privateKey?: string;
  };
  oauth?: {
    authorizationUrl: string;
    tokenUrl: string;
    scopes: string[];
    redirectUri: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
}

// Endpoint
interface Endpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestSchema?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
  rateLimitKey?: string;
  timeout: number;
  retries: number;
  caching?: {
    enabled: boolean;
    ttl: number;
    key: string;
  };
}

// Webhook configuration
interface WebhookConfig {
  id: string;
  name: string;
  event: string;
  url: string;
  method: 'POST' | 'PUT';
  headers: Record<string, string>;
  secret?: string;
  enabled: boolean;
  retries: number;
  createdAt: Date;
}

// Data mapping
interface DataMapping {
  id: string;
  name: string;
  sourceEntity: string;
  targetEntity: string;
  direction: SyncDirection;
  fieldMappings: {
    sourceField: string;
    targetField: string;
    transform?: string;
    defaultValue?: unknown;
  }[];
  filters?: {
    field: string;
    operator: string;
    value: unknown;
  }[];
  enabled: boolean;
}

// Sync configuration
interface SyncConfiguration {
  enabled: boolean;
  direction: SyncDirection;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
  cronExpression?: string;
  batchSize: number;
  conflictResolution: 'source_wins' | 'target_wins' | 'most_recent' | 'manual';
  entities: string[];
  lastSyncAt?: Date;
  nextSyncAt?: Date;
}

// Rate limit configuration
interface RateLimitConfig {
  requestsPerSecond: number;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  concurrentRequests: number;
  burstLimit: number;
  retryAfterHeader: boolean;
}

// Health check result
interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
  lastCheck: Date;
  responseTime: number;
  uptime: number;
  errors: { timestamp: Date; message: string }[];
  metrics: {
    successRate: number;
    avgResponseTime: number;
    errorRate: number;
  };
}

// API request
interface APIRequest {
  id: string;
  integrationId: string;
  endpointId: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  queryParams?: Record<string, string>;
  timestamp: Date;
  response?: APIResponse;
  duration: number;
  status: 'pending' | 'success' | 'error' | 'timeout';
  retries: number;
}

// API response
interface APIResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
  timestamp: Date;
  cached: boolean;
}

// Sync job
interface SyncJob {
  id: string;
  integrationId: string;
  type: 'full' | 'incremental' | 'delta';
  direction: SyncDirection;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  stats: {
    total: number;
    processed: number;
    created: number;
    updated: number;
    deleted: number;
    skipped: number;
    errors: number;
  };
  errors: { entity: string; id: string; error: string }[];
  startedAt?: Date;
  completedAt?: Date;
  triggeredBy: string;
  createdAt: Date;
}

// Integration log
interface IntegrationLog {
  id: string;
  integrationId: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  category: 'request' | 'response' | 'webhook' | 'sync' | 'auth' | 'health';
  message: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

// Integration analytics
interface IntegrationAnalytics {
  integrationId: string;
  period: { start: Date; end: Date };
  requests: {
    total: number;
    successful: number;
    failed: number;
    cached: number;
  };
  avgResponseTime: number;
  dataTransferred: {
    inbound: number;
    outbound: number;
  };
  syncJobs: {
    total: number;
    successful: number;
    failed: number;
  };
  webhooks: {
    received: number;
    processed: number;
    failed: number;
  };
  byEndpoint: {
    endpointId: string;
    name: string;
    calls: number;
    avgTime: number;
    errorRate: number;
  }[];
  timeline: {
    timestamp: string;
    requests: number;
    errors: number;
  }[];
}

// Integration template
interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: IntegrationCategory;
  logo: string;
  documentation: string;
  authTypes: AuthType[];
  features: string[];
  endpoints: Partial<Endpoint>[];
  webhookEvents: string[];
  requiredFields: { name: string; type: string; required: boolean; description: string }[];
  popularity: number;
  verified: boolean;
}

class IntegrationHubService {
  private static instance: IntegrationHubService;
  private integrations: Map<string, Integration> = new Map();
  private templates: Map<string, IntegrationTemplate> = new Map();
  private syncJobs: Map<string, SyncJob> = new Map();
  private requests: Map<string, APIRequest> = new Map();
  private logs: IntegrationLog[] = [];
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): IntegrationHubService {
    if (!IntegrationHubService.instance) {
      IntegrationHubService.instance = new IntegrationHubService();
    }
    return IntegrationHubService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize integration templates
    const templatesData: Partial<IntegrationTemplate>[] = [
      {
        name: 'India Meteorological Department',
        description: 'Official weather data and forecasts from IMD',
        provider: 'Government of India',
        category: 'weather',
        logo: '🌤️',
        authTypes: ['api_key'],
        features: ['Weather forecasts', 'Severe weather alerts', 'Historical data', 'Regional data'],
        verified: true,
      },
      {
        name: 'National Disaster Management Authority',
        description: 'NDMA alerts and disaster information',
        provider: 'Government of India',
        category: 'government',
        logo: '🏛️',
        authTypes: ['api_key', 'oauth2'],
        features: ['Disaster alerts', 'Relief updates', 'Resource coordination'],
        verified: true,
      },
      {
        name: 'Indian Space Research Organisation',
        description: 'Satellite imagery and earth observation data',
        provider: 'ISRO',
        category: 'mapping',
        logo: '🛰️',
        authTypes: ['api_key'],
        features: ['Satellite imagery', 'Flood mapping', 'Weather analysis'],
        verified: true,
      },
      {
        name: 'Unified Payments Interface',
        description: 'UPI payment gateway for donations',
        provider: 'NPCI',
        category: 'payment',
        logo: '💳',
        authTypes: ['oauth2', 'hmac'],
        features: ['Payment processing', 'Refunds', 'Transaction history'],
        verified: true,
      },
      {
        name: 'Google Maps Platform',
        description: 'Maps, geocoding, and location services',
        provider: 'Google',
        category: 'mapping',
        logo: '🗺️',
        authTypes: ['api_key'],
        features: ['Maps', 'Geocoding', 'Directions', 'Places'],
        verified: true,
      },
      {
        name: 'Twilio',
        description: 'SMS and voice communication platform',
        provider: 'Twilio',
        category: 'communication',
        logo: '📱',
        authTypes: ['basic', 'api_key'],
        features: ['SMS', 'Voice calls', 'WhatsApp', 'Verify'],
        verified: true,
      },
      {
        name: 'Firebase Cloud Messaging',
        description: 'Push notification service',
        provider: 'Google',
        category: 'communication',
        logo: '🔔',
        authTypes: ['bearer'],
        features: ['Push notifications', 'Topics', 'Analytics'],
        verified: true,
      },
      {
        name: 'AWS S3',
        description: 'Cloud storage for assets and backups',
        provider: 'Amazon Web Services',
        category: 'storage',
        logo: '☁️',
        authTypes: ['api_key', 'hmac'],
        features: ['File storage', 'CDN', 'Versioning', 'Lifecycle management'],
        verified: true,
      },
      {
        name: 'OpenWeatherMap',
        description: 'Global weather data API',
        provider: 'OpenWeather',
        category: 'weather',
        logo: '🌦️',
        authTypes: ['api_key'],
        features: ['Current weather', 'Forecasts', 'Historical data', 'Weather maps'],
        verified: true,
      },
      {
        name: 'Razorpay',
        description: 'Payment gateway for India',
        provider: 'Razorpay',
        category: 'payment',
        logo: '💰',
        authTypes: ['basic', 'api_key'],
        features: ['Payments', 'Subscriptions', 'Payouts', 'Split payments'],
        verified: true,
      },
      {
        name: 'Aadhaar Authentication',
        description: 'Identity verification through Aadhaar',
        provider: 'UIDAI',
        category: 'identity',
        logo: '🆔',
        authTypes: ['certificate', 'hmac'],
        features: ['eKYC', 'OTP auth', 'Demographic auth'],
        verified: true,
      },
      {
        name: 'DigiLocker',
        description: 'Digital document storage and verification',
        provider: 'Government of India',
        category: 'identity',
        logo: '📄',
        authTypes: ['oauth2'],
        features: ['Document fetch', 'Document issue', 'Verification'],
        verified: true,
      },
    ];

    templatesData.forEach((t, idx) => {
      const template: IntegrationTemplate = {
        id: `template-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name!,
        description: t.description!,
        provider: t.provider!,
        category: t.category!,
        logo: t.logo!,
        documentation: `https://docs.rescueping.com/integrations/${t.name?.toLowerCase().replace(/\s+/g, '-')}`,
        authTypes: t.authTypes!,
        features: t.features!,
        endpoints: [],
        webhookEvents: [],
        requiredFields: [
          { name: 'apiKey', type: 'string', required: true, description: 'API Key for authentication' },
        ],
        popularity: Math.floor(Math.random() * 1000) + 100,
        verified: t.verified!,
      };
      this.templates.set(template.id, template);
    });

    // Initialize connected integrations
    const integrationsData = [
      { templateId: 'template-0001', name: 'IMD Weather API', status: 'connected' },
      { templateId: 'template-0002', name: 'NDMA Alerts', status: 'connected' },
      { templateId: 'template-0005', name: 'Google Maps', status: 'connected' },
      { templateId: 'template-0006', name: 'Twilio SMS', status: 'connected' },
      { templateId: 'template-0007', name: 'Firebase Notifications', status: 'connected' },
      { templateId: 'template-0010', name: 'Razorpay Payments', status: 'connected' },
    ];

    integrationsData.forEach((i, idx) => {
      const template = this.templates.get(i.templateId)!;
      const integration: Integration = {
        id: `int-${(idx + 1).toString().padStart(6, '0')}`,
        name: i.name,
        description: template.description,
        provider: template.provider,
        category: template.category,
        status: i.status as IntegrationStatus,
        version: '1.0.0',
        icon: template.logo,
        website: `https://${template.provider.toLowerCase().replace(/\s+/g, '')}.com`,
        documentation: template.documentation,
        authentication: {
          type: template.authTypes[0],
          credentials: {
            apiKey: `sk_${Math.random().toString(36).substr(2, 24)}`,
          },
          headers: {
            'X-API-Key': '{{apiKey}}',
          },
        },
        endpoints: [
          {
            id: `ep-${idx}-1`,
            name: 'Get Data',
            method: 'GET',
            path: '/api/v1/data',
            description: 'Fetch data from the integration',
            timeout: 30000,
            retries: 3,
          },
          {
            id: `ep-${idx}-2`,
            name: 'Send Data',
            method: 'POST',
            path: '/api/v1/data',
            description: 'Send data to the integration',
            timeout: 30000,
            retries: 3,
          },
        ],
        webhooks: [
          {
            id: `wh-${idx}-1`,
            name: 'Event Webhook',
            event: 'data.updated',
            url: `https://api.rescueping.com/webhooks/${i.name.toLowerCase().replace(/\s+/g, '-')}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            secret: Math.random().toString(36).substr(2, 32),
            enabled: true,
            retries: 3,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        ],
        dataMapping: [
          {
            id: `dm-${idx}-1`,
            name: 'Default Mapping',
            sourceEntity: 'external_data',
            targetEntity: 'local_data',
            direction: 'inbound',
            fieldMappings: [
              { sourceField: 'id', targetField: 'externalId' },
              { sourceField: 'name', targetField: 'title' },
              { sourceField: 'timestamp', targetField: 'createdAt', transform: 'toDate' },
            ],
            enabled: true,
          },
        ],
        syncConfig: {
          enabled: true,
          direction: 'bidirectional',
          frequency: 'hourly',
          batchSize: 100,
          conflictResolution: 'most_recent',
          entities: ['alerts', 'resources'],
          lastSyncAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        },
        rateLimits: {
          requestsPerSecond: 10,
          requestsPerMinute: 100,
          requestsPerHour: 1000,
          requestsPerDay: 10000,
          concurrentRequests: 5,
          burstLimit: 20,
          retryAfterHeader: true,
        },
        features: template.features,
        requiredScopes: [],
        settings: {},
        metadata: {
          installedAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
          installedBy: 'admin',
          lastConnectedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          lastSyncAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
          connectedBy: 'admin',
        },
        healthCheck: {
          status: 'healthy',
          lastCheck: new Date(),
          responseTime: Math.floor(Math.random() * 200) + 50,
          uptime: 99.9 - Math.random() * 0.5,
          errors: [],
          metrics: {
            successRate: 99 + Math.random(),
            avgResponseTime: Math.floor(Math.random() * 150) + 30,
            errorRate: Math.random() * 0.5,
          },
        },
      };
      this.integrations.set(integration.id, integration);
    });

    // Initialize sync jobs
    const statuses: SyncJob['status'][] = ['completed', 'completed', 'completed', 'failed', 'running'];
    for (let i = 0; i < 20; i++) {
      const integration = Array.from(this.integrations.values())[i % this.integrations.size];
      const status = statuses[i % statuses.length];
      const startedAt = new Date(Date.now() - i * 6 * 60 * 60 * 1000);

      const job: SyncJob = {
        id: `sync-${(i + 1).toString().padStart(6, '0')}`,
        integrationId: integration.id,
        type: i % 3 === 0 ? 'full' : 'incremental',
        direction: 'bidirectional',
        status,
        progress: status === 'running' ? Math.floor(Math.random() * 100) : 100,
        stats: {
          total: Math.floor(Math.random() * 1000) + 100,
          processed: status === 'running' ? Math.floor(Math.random() * 500) : Math.floor(Math.random() * 1000) + 100,
          created: Math.floor(Math.random() * 50),
          updated: Math.floor(Math.random() * 100),
          deleted: Math.floor(Math.random() * 10),
          skipped: Math.floor(Math.random() * 20),
          errors: status === 'failed' ? Math.floor(Math.random() * 10) + 1 : 0,
        },
        errors: status === 'failed' ? [{ entity: 'alert', id: '123', error: 'Validation failed' }] : [],
        startedAt,
        completedAt: status !== 'running' ? new Date(startedAt.getTime() + Math.random() * 300000) : undefined,
        triggeredBy: i % 2 === 0 ? 'system' : 'admin',
        createdAt: startedAt,
      };
      this.syncJobs.set(job.id, job);
    }

    // Initialize request logs
    for (let i = 0; i < 50; i++) {
      const integration = Array.from(this.integrations.values())[i % this.integrations.size];
      const endpoint = integration.endpoints[i % integration.endpoints.length];
      const status = Math.random() > 0.1 ? 'success' : 'error';

      const request: APIRequest = {
        id: `req-${(i + 1).toString().padStart(8, '0')}`,
        integrationId: integration.id,
        endpointId: endpoint.id,
        method: endpoint.method,
        url: `https://api.example.com${endpoint.path}`,
        headers: { 'Content-Type': 'application/json' },
        timestamp: new Date(Date.now() - i * 15 * 60 * 1000),
        response: {
          statusCode: status === 'success' ? 200 : 500,
          headers: { 'Content-Type': 'application/json' },
          body: status === 'success' ? { success: true } : { error: 'Internal error' },
          timestamp: new Date(Date.now() - i * 15 * 60 * 1000 + 100),
          cached: Math.random() > 0.8,
        },
        duration: Math.floor(Math.random() * 500) + 50,
        status,
        retries: 0,
      };
      this.requests.set(request.id, request);
    }

    // Initialize logs
    const levels: IntegrationLog['level'][] = ['info', 'info', 'info', 'warn', 'error'];
    const categories: IntegrationLog['category'][] = ['request', 'response', 'sync', 'webhook', 'auth'];
    for (let i = 0; i < 100; i++) {
      const integration = Array.from(this.integrations.values())[i % this.integrations.size];
      const log: IntegrationLog = {
        id: `log-${(i + 1).toString().padStart(8, '0')}`,
        integrationId: integration.id,
        level: levels[i % levels.length],
        category: categories[i % categories.length],
        message: `${categories[i % categories.length]} ${levels[i % levels.length]} for ${integration.name}`,
        timestamp: new Date(Date.now() - i * 5 * 60 * 1000),
      };
      this.logs.push(log);
    }
  }

  /**
   * Get integrations
   */
  public getIntegrations(filter?: { category?: IntegrationCategory; status?: IntegrationStatus }): Integration[] {
    let integrations = Array.from(this.integrations.values());

    if (filter?.category) integrations = integrations.filter((i) => i.category === filter.category);
    if (filter?.status) integrations = integrations.filter((i) => i.status === filter.status);

    return integrations.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get integration
   */
  public getIntegration(id: string): Integration | undefined {
    return this.integrations.get(id);
  }

  /**
   * Install integration
   */
  public async installIntegration(templateId: string, config: {
    name: string;
    credentials: Record<string, string>;
    settings?: Record<string, unknown>;
    installedBy: string;
  }): Promise<Integration> {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    const integration: Integration = {
      id: `int-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: config.name,
      description: template.description,
      provider: template.provider,
      category: template.category,
      status: 'pending',
      version: '1.0.0',
      icon: template.logo,
      website: '',
      documentation: template.documentation,
      authentication: {
        type: template.authTypes[0],
        credentials: config.credentials,
      },
      endpoints: template.endpoints as Endpoint[],
      webhooks: [],
      dataMapping: [],
      syncConfig: {
        enabled: false,
        direction: 'inbound',
        frequency: 'manual',
        batchSize: 100,
        conflictResolution: 'source_wins',
        entities: [],
      },
      rateLimits: {
        requestsPerSecond: 10,
        requestsPerMinute: 100,
        requestsPerHour: 1000,
        requestsPerDay: 10000,
        concurrentRequests: 5,
        burstLimit: 20,
        retryAfterHeader: true,
      },
      features: template.features,
      requiredScopes: [],
      settings: config.settings || {},
      metadata: {
        installedAt: new Date(),
        installedBy: config.installedBy,
      },
      healthCheck: {
        status: 'unknown',
        lastCheck: new Date(),
        responseTime: 0,
        uptime: 0,
        errors: [],
        metrics: {
          successRate: 0,
          avgResponseTime: 0,
          errorRate: 0,
        },
      },
    };

    this.integrations.set(integration.id, integration);

    // Test connection
    await this.testConnection(integration.id);

    this.emit('integration_installed', integration);
    return integration;
  }

  /**
   * Test connection
   */
  public async testConnection(integrationId: string): Promise<{ success: boolean; message: string; responseTime?: number }> {
    const integration = this.integrations.get(integrationId);
    if (!integration) throw new Error('Integration not found');

    // Simulate connection test
    const success = Math.random() > 0.1;
    const responseTime = Math.floor(Math.random() * 500) + 50;

    if (success) {
      integration.status = 'connected';
      integration.metadata.lastConnectedAt = new Date();
      integration.healthCheck = {
        status: 'healthy',
        lastCheck: new Date(),
        responseTime,
        uptime: 99.9,
        errors: [],
        metrics: {
          successRate: 99.5,
          avgResponseTime: responseTime,
          errorRate: 0.5,
        },
      };
    } else {
      integration.status = 'error';
      integration.healthCheck = {
        status: 'unhealthy',
        lastCheck: new Date(),
        responseTime: 0,
        uptime: 0,
        errors: [{ timestamp: new Date(), message: 'Connection failed' }],
        metrics: {
          successRate: 0,
          avgResponseTime: 0,
          errorRate: 100,
        },
      };
    }

    this.emit('connection_tested', { integrationId, success, responseTime });
    return { success, message: success ? 'Connected successfully' : 'Connection failed', responseTime: success ? responseTime : undefined };
  }

  /**
   * Make API request
   */
  public async makeRequest(integrationId: string, endpointId: string, options?: {
    body?: unknown;
    queryParams?: Record<string, string>;
    headers?: Record<string, string>;
  }): Promise<APIResponse> {
    const integration = this.integrations.get(integrationId);
    if (!integration) throw new Error('Integration not found');

    const endpoint = integration.endpoints.find((e) => e.id === endpointId);
    if (!endpoint) throw new Error('Endpoint not found');

    const startTime = Date.now();

    const request: APIRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      integrationId,
      endpointId,
      method: endpoint.method,
      url: `${integration.website}${endpoint.path}`,
      headers: { ...integration.authentication.headers, ...options?.headers },
      body: options?.body,
      queryParams: options?.queryParams,
      timestamp: new Date(),
      duration: 0,
      status: 'pending',
      retries: 0,
    };

    // Simulate request
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 50));

    const success = Math.random() > 0.05;
    const duration = Date.now() - startTime;

    const response: APIResponse = {
      statusCode: success ? 200 : 500,
      headers: { 'Content-Type': 'application/json' },
      body: success ? { data: [], message: 'Success' } : { error: 'Internal server error' },
      timestamp: new Date(),
      cached: false,
    };

    request.response = response;
    request.duration = duration;
    request.status = success ? 'success' : 'error';

    this.requests.set(request.id, request);

    this.log(integrationId, success ? 'info' : 'error', 'request', `${endpoint.method} ${endpoint.path} - ${response.statusCode}`);

    this.emit('request_completed', { request, response });
    return response;
  }

  /**
   * Trigger sync
   */
  public async triggerSync(integrationId: string, type: 'full' | 'incremental', triggeredBy: string): Promise<SyncJob> {
    const integration = this.integrations.get(integrationId);
    if (!integration) throw new Error('Integration not found');

    const job: SyncJob = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      integrationId,
      type,
      direction: integration.syncConfig.direction,
      status: 'running',
      progress: 0,
      stats: {
        total: 0,
        processed: 0,
        created: 0,
        updated: 0,
        deleted: 0,
        skipped: 0,
        errors: 0,
      },
      errors: [],
      startedAt: new Date(),
      triggeredBy,
      createdAt: new Date(),
    };

    this.syncJobs.set(job.id, job);
    this.emit('sync_started', job);

    // Simulate sync progress
    this.simulateSync(job);

    return job;
  }

  /**
   * Simulate sync
   */
  private async simulateSync(job: SyncJob): Promise<void> {
    const total = Math.floor(Math.random() * 500) + 100;
    job.stats.total = total;

    for (let i = 0; i < total && job.status === 'running'; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      job.stats.processed = Math.min(i + 10, total);
      job.stats.created += Math.floor(Math.random() * 3);
      job.stats.updated += Math.floor(Math.random() * 5);
      job.progress = Math.floor((job.stats.processed / total) * 100);
    }

    const success = Math.random() > 0.1;
    job.status = success ? 'completed' : 'failed';
    job.progress = 100;
    job.completedAt = new Date();

    if (!success) {
      job.stats.errors = 5;
      job.errors.push({ entity: 'record', id: '123', error: 'Validation failed' });
    }

    const integration = this.integrations.get(job.integrationId);
    if (integration) {
      integration.syncConfig.lastSyncAt = new Date();
      integration.metadata.lastSyncAt = new Date();
    }

    this.emit('sync_completed', job);
  }

  /**
   * Get sync jobs
   */
  public getSyncJobs(filter?: { integrationId?: string; status?: SyncJob['status']; limit?: number }): SyncJob[] {
    let jobs = Array.from(this.syncJobs.values());

    if (filter?.integrationId) jobs = jobs.filter((j) => j.integrationId === filter.integrationId);
    if (filter?.status) jobs = jobs.filter((j) => j.status === filter.status);

    jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (filter?.limit) jobs = jobs.slice(0, filter.limit);

    return jobs;
  }

  /**
   * Get templates
   */
  public getTemplates(category?: IntegrationCategory): IntegrationTemplate[] {
    let templates = Array.from(this.templates.values());
    if (category) templates = templates.filter((t) => t.category === category);
    return templates.sort((a, b) => b.popularity - a.popularity);
  }

  /**
   * Get analytics
   */
  public getAnalytics(integrationId: string, period: { start: Date; end: Date }): IntegrationAnalytics {
    const requests = Array.from(this.requests.values()).filter(
      (r) => r.integrationId === integrationId && r.timestamp >= period.start && r.timestamp <= period.end
    );

    const successful = requests.filter((r) => r.status === 'success');
    const cached = requests.filter((r) => r.response?.cached);

    const syncJobs = Array.from(this.syncJobs.values()).filter(
      (j) => j.integrationId === integrationId && j.createdAt >= period.start && j.createdAt <= period.end
    );

    const byEndpoint: IntegrationAnalytics['byEndpoint'] = [];
    const endpointStats = new Map<string, { calls: number; totalTime: number; errors: number }>();

    requests.forEach((r) => {
      const stats = endpointStats.get(r.endpointId) || { calls: 0, totalTime: 0, errors: 0 };
      stats.calls++;
      stats.totalTime += r.duration;
      if (r.status === 'error') stats.errors++;
      endpointStats.set(r.endpointId, stats);
    });

    const integration = this.integrations.get(integrationId);
    endpointStats.forEach((stats, endpointId) => {
      const endpoint = integration?.endpoints.find((e) => e.id === endpointId);
      byEndpoint.push({
        endpointId,
        name: endpoint?.name || endpointId,
        calls: stats.calls,
        avgTime: stats.calls > 0 ? Math.floor(stats.totalTime / stats.calls) : 0,
        errorRate: stats.calls > 0 ? (stats.errors / stats.calls) * 100 : 0,
      });
    });

    return {
      integrationId,
      period,
      requests: {
        total: requests.length,
        successful: successful.length,
        failed: requests.length - successful.length,
        cached: cached.length,
      },
      avgResponseTime: requests.length > 0
        ? Math.floor(requests.reduce((sum, r) => sum + r.duration, 0) / requests.length)
        : 0,
      dataTransferred: {
        inbound: Math.floor(Math.random() * 100000000),
        outbound: Math.floor(Math.random() * 50000000),
      },
      syncJobs: {
        total: syncJobs.length,
        successful: syncJobs.filter((j) => j.status === 'completed').length,
        failed: syncJobs.filter((j) => j.status === 'failed').length,
      },
      webhooks: {
        received: Math.floor(Math.random() * 1000),
        processed: Math.floor(Math.random() * 950),
        failed: Math.floor(Math.random() * 50),
      },
      byEndpoint,
      timeline: [],
    };
  }

  /**
   * Get logs
   */
  public getLogs(filter?: { integrationId?: string; level?: IntegrationLog['level']; limit?: number }): IntegrationLog[] {
    let logs = [...this.logs];

    if (filter?.integrationId) logs = logs.filter((l) => l.integrationId === filter.integrationId);
    if (filter?.level) logs = logs.filter((l) => l.level === filter.level);

    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filter?.limit) logs = logs.slice(0, filter.limit);

    return logs;
  }

  /**
   * Log entry
   */
  private log(integrationId: string, level: IntegrationLog['level'], category: IntegrationLog['category'], message: string, data?: Record<string, unknown>): void {
    const log: IntegrationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      integrationId,
      level,
      category,
      message,
      data,
      timestamp: new Date(),
    };

    this.logs.unshift(log);

    // Keep logs limited
    if (this.logs.length > 10000) {
      this.logs = this.logs.slice(0, 5000);
    }
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

export const integrationHubService = IntegrationHubService.getInstance();
export type {
  IntegrationStatus,
  IntegrationCategory,
  AuthType,
  SyncDirection,
  Integration,
  AuthenticationConfig,
  Endpoint,
  WebhookConfig,
  DataMapping,
  SyncConfiguration,
  RateLimitConfig,
  HealthCheckResult,
  APIRequest,
  APIResponse,
  SyncJob,
  IntegrationLog,
  IntegrationAnalytics,
  IntegrationTemplate,
};
