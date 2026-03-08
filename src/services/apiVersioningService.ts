/**
 * API Versioning Service
 * Comprehensive API version management, compatibility tracking, and migration handling
 */

// API Version Status
type VersionStatus = 'development' | 'alpha' | 'beta' | 'stable' | 'deprecated' | 'sunset';

// API Type
type APIType = 'rest' | 'graphql' | 'grpc' | 'websocket';

// Change Type
type ChangeType = 'breaking' | 'non_breaking' | 'deprecation' | 'addition' | 'removal' | 'fix';

// Migration Status
type MigrationStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';

// API Version
interface APIVersion {
  id: string;
  version: string;
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  apiType: APIType;
  status: VersionStatus;
  title: string;
  description: string;
  baseUrl: string;
  endpoints: APIEndpoint[];
  schemas: APISchema[];
  authentication: AuthenticationConfig[];
  rateLimit: RateLimitConfig;
  features: VersionFeature[];
  changelog: ChangelogEntry[];
  compatibility: CompatibilityInfo;
  documentation: DocumentationConfig;
  metrics: VersionMetrics;
  sunsetInfo?: SunsetInfo;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    releasedAt?: Date;
    deprecatedAt?: Date;
    sunsetDate?: Date;
  };
}

// API Endpoint
interface APIEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  summary: string;
  description: string;
  tags: string[];
  deprecated: boolean;
  deprecatedReason?: string;
  replacedBy?: string;
  parameters: EndpointParameter[];
  requestBody?: RequestBody;
  responses: EndpointResponse[];
  security: SecurityRequirement[];
  rateLimit?: RateLimitOverride;
  examples: EndpointExample[];
  metrics: {
    totalCalls: number;
    avgLatency: number;
    errorRate: number;
    last24hCalls: number;
  };
}

// Endpoint Parameter
interface EndpointParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  description: string;
  required: boolean;
  deprecated: boolean;
  schema: SchemaDefinition;
  example?: unknown;
}

// Request Body
interface RequestBody {
  description: string;
  required: boolean;
  contentType: string;
  schema: SchemaDefinition;
  examples: Record<string, unknown>;
}

// Endpoint Response
interface EndpointResponse {
  statusCode: number;
  description: string;
  contentType?: string;
  schema?: SchemaDefinition;
  headers?: Record<string, SchemaDefinition>;
  examples?: Record<string, unknown>;
}

// Security Requirement
interface SecurityRequirement {
  type: 'apiKey' | 'oauth2' | 'bearer' | 'basic';
  name: string;
  scopes?: string[];
  in?: 'header' | 'query' | 'cookie';
}

// Rate Limit Override
interface RateLimitOverride {
  enabled: boolean;
  requestsPerMinute?: number;
  requestsPerHour?: number;
  burstLimit?: number;
}

// Endpoint Example
interface EndpointExample {
  name: string;
  description: string;
  request?: {
    parameters?: Record<string, unknown>;
    body?: unknown;
    headers?: Record<string, string>;
  };
  response: {
    statusCode: number;
    body: unknown;
    headers?: Record<string, string>;
  };
}

// Schema Definition
interface SchemaDefinition {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null';
  format?: string;
  description?: string;
  properties?: Record<string, SchemaDefinition>;
  items?: SchemaDefinition;
  required?: string[];
  enum?: unknown[];
  default?: unknown;
  nullable?: boolean;
  deprecated?: boolean;
  example?: unknown;
  $ref?: string;
}

// API Schema
interface APISchema {
  id: string;
  name: string;
  description: string;
  schema: SchemaDefinition;
  deprecated: boolean;
  usedBy: string[];
  version: number;
  history: SchemaHistory[];
}

// Schema History
interface SchemaHistory {
  version: number;
  schema: SchemaDefinition;
  changedAt: Date;
  changedBy: string;
  changeDescription: string;
}

// Authentication Config
interface AuthenticationConfig {
  id: string;
  type: 'apiKey' | 'oauth2' | 'bearer' | 'basic' | 'mtls';
  name: string;
  description: string;
  config: {
    apiKey?: {
      headerName: string;
      prefix?: string;
    };
    oauth2?: {
      authorizationUrl: string;
      tokenUrl: string;
      scopes: Record<string, string>;
      flows: string[];
    };
    bearer?: {
      format: 'jwt' | 'opaque';
      headerName: string;
    };
  };
  enabled: boolean;
}

// Rate Limit Config
interface RateLimitConfig {
  enabled: boolean;
  defaultLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  burstLimit: number;
  tiers: {
    tier: string;
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  }[];
  headers: {
    limitHeader: string;
    remainingHeader: string;
    resetHeader: string;
  };
}

// Version Feature
interface VersionFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  experimental: boolean;
  requiresOptIn: boolean;
  documentation?: string;
}

// Changelog Entry
interface ChangelogEntry {
  id: string;
  version: string;
  date: Date;
  type: ChangeType;
  category: string;
  title: string;
  description: string;
  affectedEndpoints: string[];
  affectedSchemas: string[];
  migrationGuide?: string;
  author: string;
}

// Compatibility Info
interface CompatibilityInfo {
  backwardCompatible: boolean;
  forwardCompatible: boolean;
  compatibleVersions: string[];
  breakingChanges: {
    description: string;
    affectedEndpoints: string[];
    migrationPath: string;
  }[];
  deprecations: {
    feature: string;
    reason: string;
    alternative: string;
    sunsetDate?: Date;
  }[];
}

// Documentation Config
interface DocumentationConfig {
  enabled: boolean;
  baseUrl: string;
  format: 'openapi' | 'swagger' | 'asyncapi' | 'graphql_schema';
  interactive: boolean;
  changelog: boolean;
  examples: boolean;
  customPages: {
    title: string;
    path: string;
    content: string;
  }[];
}

// Version Metrics
interface VersionMetrics {
  usage: {
    totalRequests: number;
    uniqueConsumers: number;
    last24hRequests: number;
    last7dRequests: number;
    last30dRequests: number;
  };
  performance: {
    avgLatency: number;
    p50Latency: number;
    p95Latency: number;
    p99Latency: number;
    errorRate: number;
  };
  adoption: {
    activeConsumers: number;
    newConsumers: number;
    churnedConsumers: number;
    migrationProgress: number;
  };
  endpoints: {
    path: string;
    method: string;
    calls: number;
    avgLatency: number;
    errorRate: number;
  }[];
}

// Sunset Info
interface SunsetInfo {
  announced: Date;
  sunsetDate: Date;
  migrationDeadline: Date;
  reason: string;
  replacementVersion?: string;
  migrationGuide: string;
  affectedConsumers: number;
  migratedConsumers: number;
  notifications: {
    type: 'email' | 'dashboard' | 'api_response' | 'webhook';
    sentAt: Date;
    recipients: number;
  }[];
}

// API Consumer
interface APIConsumer {
  id: string;
  name: string;
  email: string;
  organization?: string;
  apiKeys: {
    id: string;
    key: string;
    name: string;
    createdAt: Date;
    expiresAt?: Date;
    lastUsed?: Date;
    status: 'active' | 'revoked' | 'expired';
  }[];
  versions: {
    version: string;
    firstUsed: Date;
    lastUsed: Date;
    requestCount: number;
  }[];
  quotas: {
    tier: string;
    requestsRemaining: number;
    resetAt: Date;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastActivity: Date;
  };
}

// Version Migration
interface VersionMigration {
  id: string;
  name: string;
  description: string;
  fromVersion: string;
  toVersion: string;
  status: MigrationStatus;
  type: 'automatic' | 'assisted' | 'manual';
  steps: MigrationStep[];
  mappings: EndpointMapping[];
  schemaMappings: SchemaMapping[];
  estimatedEffort: {
    hours: number;
    complexity: 'low' | 'medium' | 'high';
  };
  affectedConsumers: string[];
  progress: {
    totalConsumers: number;
    migratedConsumers: number;
    failedConsumers: number;
  };
  schedule?: {
    startDate: Date;
    endDate: Date;
    phases: {
      name: string;
      startDate: Date;
      endDate: Date;
      status: MigrationStatus;
    }[];
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    completedAt?: Date;
  };
}

// Migration Step
interface MigrationStep {
  id: string;
  order: number;
  name: string;
  description: string;
  type: 'code_change' | 'config_update' | 'data_migration' | 'testing' | 'deployment';
  status: MigrationStatus;
  instructions: string;
  codeExample?: {
    before: string;
    after: string;
    language: string;
  };
  validations: {
    name: string;
    command?: string;
    expected: string;
    passed?: boolean;
  }[];
}

// Endpoint Mapping
interface EndpointMapping {
  id: string;
  sourceEndpoint: {
    path: string;
    method: string;
  };
  targetEndpoint: {
    path: string;
    method: string;
  };
  parameterMappings: {
    source: string;
    target: string;
    transformation?: string;
  }[];
  requestBodyTransformation?: string;
  responseBodyTransformation?: string;
  notes?: string;
}

// Schema Mapping
interface SchemaMapping {
  id: string;
  sourceSchema: string;
  targetSchema: string;
  fieldMappings: {
    sourcePath: string;
    targetPath: string;
    transformation?: string;
    required: boolean;
  }[];
  addedFields: string[];
  removedFields: string[];
  notes?: string;
}

// API Gateway Config
interface APIGatewayConfig {
  id: string;
  name: string;
  type: 'kong' | 'aws_api_gateway' | 'azure_apim' | 'nginx' | 'custom';
  baseUrl: string;
  versions: {
    version: string;
    path: string;
    upstream: string;
    enabled: boolean;
  }[];
  routing: {
    strategy: 'path' | 'header' | 'query_param' | 'media_type';
    versionParam: string;
    defaultVersion: string;
  };
  cors: {
    enabled: boolean;
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
  };
  caching: {
    enabled: boolean;
    ttl: number;
    keyStrategy: string;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Version Statistics
interface VersionStatistics {
  overview: {
    totalVersions: number;
    activeVersions: number;
    deprecatedVersions: number;
    sunsetVersions: number;
  };
  usage: {
    totalRequests: number;
    requestsLast24h: number;
    requestsLast7d: number;
    uniqueConsumers: number;
    byVersion: Record<string, number>;
  };
  performance: {
    avgLatency: number;
    p95Latency: number;
    errorRate: number;
    byVersion: Record<string, { latency: number; errorRate: number }>;
  };
  adoption: {
    latestVersionAdoption: number;
    migrationInProgress: number;
    pendingMigrations: number;
  };
  trends: {
    date: string;
    requests: number;
    latency: number;
    errors: number;
  }[];
}

class APIVersioningService {
  private static instance: APIVersioningService;
  private versions: Map<string, APIVersion> = new Map();
  private consumers: Map<string, APIConsumer> = new Map();
  private migrations: Map<string, VersionMigration> = new Map();
  private gateways: Map<string, APIGatewayConfig> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): APIVersioningService {
    if (!APIVersioningService.instance) {
      APIVersioningService.instance = new APIVersioningService();
    }
    return APIVersioningService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize API Versions
    const versionsData = [
      { version: '1.0.0', status: 'sunset', title: 'API v1.0' },
      { version: '1.1.0', status: 'deprecated', title: 'API v1.1' },
      { version: '2.0.0', status: 'stable', title: 'API v2.0' },
      { version: '2.1.0', status: 'stable', title: 'API v2.1' },
      { version: '3.0.0-beta', status: 'beta', title: 'API v3.0 Beta' },
    ];

    versionsData.forEach((v, idx) => {
      const [major, minor, patch] = v.version.replace('-beta', '').split('.').map(Number);
      
      const createEndpoints = (version: string): APIEndpoint[] => {
        const endpoints = [
          { path: '/alerts', method: 'GET', summary: 'List alerts', tags: ['Alerts'] },
          { path: '/alerts', method: 'POST', summary: 'Create alert', tags: ['Alerts'] },
          { path: '/alerts/{id}', method: 'GET', summary: 'Get alert', tags: ['Alerts'] },
          { path: '/alerts/{id}', method: 'PUT', summary: 'Update alert', tags: ['Alerts'] },
          { path: '/alerts/{id}', method: 'DELETE', summary: 'Delete alert', tags: ['Alerts'] },
          { path: '/users', method: 'GET', summary: 'List users', tags: ['Users'] },
          { path: '/users/{id}', method: 'GET', summary: 'Get user', tags: ['Users'] },
          { path: '/incidents', method: 'GET', summary: 'List incidents', tags: ['Incidents'] },
          { path: '/incidents/{id}', method: 'GET', summary: 'Get incident', tags: ['Incidents'] },
          { path: '/metrics', method: 'GET', summary: 'Get metrics', tags: ['Metrics'] },
        ];

        return endpoints.map((e, eIdx) => ({
          id: `endpoint-${version}-${eIdx}`,
          path: e.path,
          method: e.method as APIEndpoint['method'],
          summary: e.summary,
          description: `${e.summary} - ${version}`,
          tags: e.tags,
          deprecated: v.status === 'deprecated' || v.status === 'sunset',
          parameters: e.path.includes('{id}') ? [
            {
              name: 'id',
              in: 'path' as const,
              description: 'Resource ID',
              required: true,
              deprecated: false,
              schema: { type: 'string' as const },
            },
          ] : [],
          requestBody: e.method === 'POST' || e.method === 'PUT' ? {
            description: 'Request body',
            required: true,
            contentType: 'application/json',
            schema: { type: 'object' as const },
            examples: {},
          } : undefined,
          responses: [
            { statusCode: 200, description: 'Success', contentType: 'application/json', schema: { type: 'object' as const } },
            { statusCode: 400, description: 'Bad Request' },
            { statusCode: 401, description: 'Unauthorized' },
            { statusCode: 404, description: 'Not Found' },
          ],
          security: [{ type: 'bearer' as const, name: 'Bearer Auth' }],
          examples: [],
          metrics: {
            totalCalls: Math.floor(Math.random() * 100000) + 10000,
            avgLatency: Math.random() * 100 + 20,
            errorRate: Math.random() * 5,
            last24hCalls: Math.floor(Math.random() * 5000) + 500,
          },
        }));
      };

      const createSchemas = (version: string): APISchema[] => {
        const schemas = ['Alert', 'User', 'Incident', 'Metric', 'PaginatedResponse'];
        return schemas.map((s, sIdx) => ({
          id: `schema-${version}-${sIdx}`,
          name: s,
          description: `${s} schema for API ${version}`,
          schema: {
            type: 'object' as const,
            properties: {
              id: { type: 'string' as const, description: 'Unique identifier' },
              createdAt: { type: 'string' as const, format: 'date-time', description: 'Creation timestamp' },
              updatedAt: { type: 'string' as const, format: 'date-time', description: 'Last update timestamp' },
            },
            required: ['id'],
          },
          deprecated: v.status === 'deprecated' || v.status === 'sunset',
          usedBy: [`/alerts`, `/users`, `/incidents`],
          version: 1,
          history: [],
        }));
      };

      const apiVersion: APIVersion = {
        id: `ver-${(idx + 1).toString().padStart(4, '0')}`,
        version: v.version,
        majorVersion: major,
        minorVersion: minor,
        patchVersion: patch,
        apiType: 'rest',
        status: v.status as VersionStatus,
        title: v.title,
        description: `${v.title} - RescuePing REST API`,
        baseUrl: `/api/v${major}`,
        endpoints: createEndpoints(v.version),
        schemas: createSchemas(v.version),
        authentication: [
          {
            id: `auth-${v.version}-1`,
            type: 'bearer',
            name: 'JWT Authentication',
            description: 'JSON Web Token authentication',
            config: {
              bearer: { format: 'jwt', headerName: 'Authorization' },
            },
            enabled: true,
          },
          {
            id: `auth-${v.version}-2`,
            type: 'apiKey',
            name: 'API Key',
            description: 'API Key authentication',
            config: {
              apiKey: { headerName: 'X-API-Key' },
            },
            enabled: true,
          },
        ],
        rateLimit: {
          enabled: true,
          defaultLimit: {
            requestsPerMinute: 60,
            requestsPerHour: 1000,
            requestsPerDay: 10000,
          },
          burstLimit: 100,
          tiers: [
            { tier: 'free', requestsPerMinute: 30, requestsPerHour: 500, requestsPerDay: 5000 },
            { tier: 'basic', requestsPerMinute: 60, requestsPerHour: 1000, requestsPerDay: 10000 },
            { tier: 'premium', requestsPerMinute: 120, requestsPerHour: 5000, requestsPerDay: 50000 },
            { tier: 'enterprise', requestsPerMinute: 600, requestsPerHour: 30000, requestsPerDay: 300000 },
          ],
          headers: {
            limitHeader: 'X-RateLimit-Limit',
            remainingHeader: 'X-RateLimit-Remaining',
            resetHeader: 'X-RateLimit-Reset',
          },
        },
        features: [
          { id: `feat-${v.version}-1`, name: 'Pagination', description: 'Support for paginated responses', enabled: true, experimental: false, requiresOptIn: false },
          { id: `feat-${v.version}-2`, name: 'Filtering', description: 'Advanced filtering capabilities', enabled: true, experimental: false, requiresOptIn: false },
          { id: `feat-${v.version}-3`, name: 'Webhooks', description: 'Webhook notifications', enabled: major >= 2, experimental: major >= 3, requiresOptIn: major >= 3 },
        ],
        changelog: [
          {
            id: `log-${v.version}-1`,
            version: v.version,
            date: new Date(Date.now() - idx * 90 * 24 * 60 * 60 * 1000),
            type: idx === 0 ? 'addition' : major > 1 ? 'breaking' : 'non_breaking',
            category: 'General',
            title: idx === 0 ? 'Initial Release' : `Version ${v.version} Release`,
            description: `Release notes for ${v.version}`,
            affectedEndpoints: [],
            affectedSchemas: [],
            author: 'API Team',
          },
        ],
        compatibility: {
          backwardCompatible: minor > 0 || v.status === 'beta',
          forwardCompatible: false,
          compatibleVersions: minor > 0 ? [`${major}.${minor - 1}.0`] : [],
          breakingChanges: major > 1 ? [
            {
              description: 'Response format changes',
              affectedEndpoints: ['/alerts'],
              migrationPath: 'Update response parsing',
            },
          ] : [],
          deprecations: v.status === 'deprecated' ? [
            {
              feature: 'Legacy endpoints',
              reason: 'Replaced with improved versions',
              alternative: `Use API v${major + 1}`,
              sunsetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            },
          ] : [],
        },
        documentation: {
          enabled: true,
          baseUrl: `https://docs.rescueping.com/api/v${major}`,
          format: 'openapi',
          interactive: true,
          changelog: true,
          examples: true,
          customPages: [],
        },
        metrics: {
          usage: {
            totalRequests: Math.floor(Math.random() * 10000000) + 1000000,
            uniqueConsumers: Math.floor(Math.random() * 1000) + 100,
            last24hRequests: Math.floor(Math.random() * 100000) + 10000,
            last7dRequests: Math.floor(Math.random() * 500000) + 50000,
            last30dRequests: Math.floor(Math.random() * 2000000) + 200000,
          },
          performance: {
            avgLatency: Math.random() * 50 + 20,
            p50Latency: Math.random() * 30 + 15,
            p95Latency: Math.random() * 100 + 50,
            p99Latency: Math.random() * 200 + 100,
            errorRate: Math.random() * 2,
          },
          adoption: {
            activeConsumers: Math.floor(Math.random() * 500) + 50,
            newConsumers: Math.floor(Math.random() * 50) + 5,
            churnedConsumers: Math.floor(Math.random() * 10),
            migrationProgress: v.status === 'sunset' ? 100 : v.status === 'deprecated' ? Math.random() * 50 + 50 : 0,
          },
          endpoints: [],
        },
        sunsetInfo: v.status === 'sunset' ? {
          announced: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          sunsetDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          migrationDeadline: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          reason: 'Replaced by newer version with improved features',
          replacementVersion: '2.0.0',
          migrationGuide: 'https://docs.rescueping.com/migration/v1-to-v2',
          affectedConsumers: 50,
          migratedConsumers: 48,
          notifications: [
            { type: 'email', sentAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), recipients: 50 },
            { type: 'email', sentAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), recipients: 20 },
            { type: 'email', sentAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), recipients: 5 },
          ],
        } : undefined,
        metadata: {
          createdAt: new Date(Date.now() - (versionsData.length - idx) * 180 * 24 * 60 * 60 * 1000),
          createdBy: 'API Team',
          updatedAt: new Date(),
          releasedAt: v.status !== 'development' ? new Date(Date.now() - (versionsData.length - idx) * 90 * 24 * 60 * 60 * 1000) : undefined,
          deprecatedAt: v.status === 'deprecated' || v.status === 'sunset' ? new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) : undefined,
          sunsetDate: v.status === 'sunset' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : undefined,
        },
      };
      this.versions.set(apiVersion.id, apiVersion);
    });

    // Initialize API Consumers
    const consumersData = [
      { name: 'Mobile App', org: 'RescuePing' },
      { name: 'Web Dashboard', org: 'RescuePing' },
      { name: 'Partner Integration', org: 'TechPartner Inc' },
      { name: 'Analytics Service', org: 'DataCorp' },
      { name: 'Third Party App', org: 'ExtApp LLC' },
    ];

    consumersData.forEach((c, idx) => {
      const consumer: APIConsumer = {
        id: `consumer-${(idx + 1).toString().padStart(4, '0')}`,
        name: c.name,
        email: `${c.name.toLowerCase().replace(/\s/g, '.')}@${c.org.toLowerCase().replace(/\s/g, '')}.com`,
        organization: c.org,
        apiKeys: [
          {
            id: `key-${idx}-1`,
            key: `ak_${this.generateId()}`,
            name: 'Production Key',
            createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
            lastUsed: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
            status: 'active',
          },
          {
            id: `key-${idx}-2`,
            key: `ak_${this.generateId()}`,
            name: 'Development Key',
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            status: 'active',
          },
        ],
        versions: [
          { version: '2.1.0', firstUsed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), lastUsed: new Date(), requestCount: Math.floor(Math.random() * 100000) },
          { version: '2.0.0', firstUsed: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), lastUsed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), requestCount: Math.floor(Math.random() * 500000) },
        ],
        quotas: {
          tier: ['free', 'basic', 'premium', 'enterprise'][idx % 4],
          requestsRemaining: Math.floor(Math.random() * 5000) + 1000,
          resetAt: new Date(Date.now() + 60 * 60 * 1000),
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        },
      };
      this.consumers.set(consumer.id, consumer);
    });

    // Initialize Migrations
    const migrationsData = [
      { name: 'V1 to V2 Migration', from: '1.1.0', to: '2.0.0', status: 'completed' },
      { name: 'V2.0 to V2.1 Migration', from: '2.0.0', to: '2.1.0', status: 'in_progress' },
      { name: 'V2 to V3 Migration', from: '2.1.0', to: '3.0.0-beta', status: 'pending' },
    ];

    migrationsData.forEach((m, idx) => {
      const migration: VersionMigration = {
        id: `mig-${(idx + 1).toString().padStart(4, '0')}`,
        name: m.name,
        description: `Migration guide from ${m.from} to ${m.to}`,
        fromVersion: m.from,
        toVersion: m.to,
        status: m.status as MigrationStatus,
        type: m.status === 'completed' ? 'automatic' : 'assisted',
        steps: [
          {
            id: `step-${idx}-1`,
            order: 1,
            name: 'Update SDK',
            description: 'Update to the latest SDK version',
            type: 'code_change',
            status: m.status === 'completed' ? 'completed' : m.status === 'in_progress' ? 'completed' : 'pending',
            instructions: 'npm install @rescueping/sdk@latest',
            codeExample: {
              before: 'import { Client } from "@rescueping/sdk"',
              after: 'import { RescuePingClient } from "@rescueping/sdk"',
              language: 'typescript',
            },
            validations: [{ name: 'SDK Version Check', expected: 'v2.0.0+' }],
          },
          {
            id: `step-${idx}-2`,
            order: 2,
            name: 'Update Endpoints',
            description: 'Update API endpoint calls',
            type: 'code_change',
            status: m.status === 'completed' ? 'completed' : 'pending',
            instructions: 'Replace deprecated endpoint calls with new versions',
            validations: [{ name: 'Endpoint Check', expected: 'No deprecated endpoints' }],
          },
          {
            id: `step-${idx}-3`,
            order: 3,
            name: 'Test Integration',
            description: 'Run integration tests',
            type: 'testing',
            status: m.status === 'completed' ? 'completed' : 'pending',
            instructions: 'Run the test suite against the staging environment',
            validations: [{ name: 'Integration Tests', expected: 'All tests passing' }],
          },
        ],
        mappings: [
          {
            id: `map-${idx}-1`,
            sourceEndpoint: { path: '/alerts', method: 'GET' },
            targetEndpoint: { path: '/v2/alerts', method: 'GET' },
            parameterMappings: [
              { source: 'page', target: 'pageNumber' },
              { source: 'limit', target: 'pageSize' },
            ],
          },
        ],
        schemaMappings: [
          {
            id: `schema-map-${idx}-1`,
            sourceSchema: 'Alert',
            targetSchema: 'Alert',
            fieldMappings: [
              { sourcePath: 'created', targetPath: 'createdAt', required: true },
              { sourcePath: 'updated', targetPath: 'updatedAt', required: false },
            ],
            addedFields: ['metadata'],
            removedFields: ['legacyId'],
          },
        ],
        estimatedEffort: {
          hours: m.status === 'completed' ? 4 : 8,
          complexity: m.from.startsWith('1') ? 'high' : 'medium',
        },
        affectedConsumers: consumersData.map((_, i) => `consumer-${(i + 1).toString().padStart(4, '0')}`),
        progress: {
          totalConsumers: 5,
          migratedConsumers: m.status === 'completed' ? 5 : m.status === 'in_progress' ? 3 : 0,
          failedConsumers: 0,
        },
        schedule: {
          startDate: new Date(Date.now() - (m.status === 'pending' ? 0 : 30) * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + (m.status === 'completed' ? -30 : 60) * 24 * 60 * 60 * 1000),
          phases: [
            { name: 'Preparation', startDate: new Date(), endDate: new Date(), status: m.status === 'completed' ? 'completed' : 'in_progress' as MigrationStatus },
            { name: 'Migration', startDate: new Date(), endDate: new Date(), status: m.status === 'completed' ? 'completed' : 'pending' as MigrationStatus },
            { name: 'Validation', startDate: new Date(), endDate: new Date(), status: m.status === 'completed' ? 'completed' : 'pending' as MigrationStatus },
          ],
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'API Team',
          updatedAt: new Date(),
          completedAt: m.status === 'completed' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : undefined,
        },
      };
      this.migrations.set(migration.id, migration);
    });

    // Initialize API Gateway
    const gateway: APIGatewayConfig = {
      id: 'gateway-0001',
      name: 'RescuePing API Gateway',
      type: 'kong',
      baseUrl: 'https://api.rescueping.com',
      versions: [
        { version: '1.0.0', path: '/v1', upstream: 'http://api-v1:8080', enabled: false },
        { version: '1.1.0', path: '/v1', upstream: 'http://api-v1:8080', enabled: false },
        { version: '2.0.0', path: '/v2', upstream: 'http://api-v2:8080', enabled: true },
        { version: '2.1.0', path: '/v2', upstream: 'http://api-v2:8080', enabled: true },
        { version: '3.0.0-beta', path: '/v3-beta', upstream: 'http://api-v3:8080', enabled: true },
      ],
      routing: {
        strategy: 'path',
        versionParam: 'version',
        defaultVersion: '2.1.0',
      },
      cors: {
        enabled: true,
        allowedOrigins: ['*'],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Authorization', 'Content-Type', 'X-API-Key'],
      },
      caching: {
        enabled: true,
        ttl: 300,
        keyStrategy: 'path_and_query',
      },
      metadata: {
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    };
    this.gateways.set(gateway.id, gateway);
  }

  // Version Operations
  public getVersions(status?: VersionStatus): APIVersion[] {
    let versions = Array.from(this.versions.values());
    if (status) versions = versions.filter((v) => v.status === status);
    return versions.sort((a, b) => b.majorVersion - a.majorVersion || b.minorVersion - a.minorVersion);
  }

  public getVersionById(id: string): APIVersion | undefined {
    return this.versions.get(id);
  }

  public getVersionByNumber(version: string): APIVersion | undefined {
    return Array.from(this.versions.values()).find((v) => v.version === version);
  }

  public getLatestStableVersion(): APIVersion | undefined {
    return this.getVersions('stable')[0];
  }

  public createVersion(data: Partial<APIVersion>): APIVersion {
    const version: APIVersion = {
      id: `ver-${this.generateId()}`,
      version: data.version || '0.0.1',
      majorVersion: data.majorVersion || 0,
      minorVersion: data.minorVersion || 0,
      patchVersion: data.patchVersion || 1,
      apiType: data.apiType || 'rest',
      status: 'development',
      title: data.title || '',
      description: data.description || '',
      baseUrl: data.baseUrl || '',
      endpoints: [],
      schemas: [],
      authentication: [],
      rateLimit: { enabled: true, defaultLimit: { requestsPerMinute: 60, requestsPerHour: 1000, requestsPerDay: 10000 }, burstLimit: 100, tiers: [], headers: { limitHeader: '', remainingHeader: '', resetHeader: '' } },
      features: [],
      changelog: [],
      compatibility: { backwardCompatible: true, forwardCompatible: false, compatibleVersions: [], breakingChanges: [], deprecations: [] },
      documentation: { enabled: false, baseUrl: '', format: 'openapi', interactive: false, changelog: false, examples: false, customPages: [] },
      metrics: { usage: { totalRequests: 0, uniqueConsumers: 0, last24hRequests: 0, last7dRequests: 0, last30dRequests: 0 }, performance: { avgLatency: 0, p50Latency: 0, p95Latency: 0, p99Latency: 0, errorRate: 0 }, adoption: { activeConsumers: 0, newConsumers: 0, churnedConsumers: 0, migrationProgress: 0 }, endpoints: [] },
      metadata: { createdAt: new Date(), createdBy: 'system', updatedAt: new Date() },
    };
    this.versions.set(version.id, version);
    this.emit('version.created', version);
    return version;
  }

  public updateVersionStatus(id: string, status: VersionStatus): APIVersion {
    const version = this.versions.get(id);
    if (!version) throw new Error('Version not found');
    version.status = status;
    version.metadata.updatedAt = new Date();
    if (status === 'deprecated') version.metadata.deprecatedAt = new Date();
    if (status === 'stable' && !version.metadata.releasedAt) version.metadata.releasedAt = new Date();
    this.emit('version.updated', version);
    return version;
  }

  public deprecateVersion(id: string, sunsetDate: Date, reason: string): APIVersion {
    const version = this.versions.get(id);
    if (!version) throw new Error('Version not found');
    version.status = 'deprecated';
    version.metadata.deprecatedAt = new Date();
    version.metadata.sunsetDate = sunsetDate;
    version.sunsetInfo = {
      announced: new Date(),
      sunsetDate,
      migrationDeadline: new Date(sunsetDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      reason,
      migrationGuide: `https://docs.rescueping.com/migration/${version.version}`,
      affectedConsumers: version.metrics.adoption.activeConsumers,
      migratedConsumers: 0,
      notifications: [],
    };
    this.emit('version.deprecated', version);
    return version;
  }

  // Consumer Operations
  public getConsumers(): APIConsumer[] {
    return Array.from(this.consumers.values());
  }

  public getConsumerById(id: string): APIConsumer | undefined {
    return this.consumers.get(id);
  }

  // Migration Operations
  public getMigrations(status?: MigrationStatus): VersionMigration[] {
    let migrations = Array.from(this.migrations.values());
    if (status) migrations = migrations.filter((m) => m.status === status);
    return migrations;
  }

  public getMigrationById(id: string): VersionMigration | undefined {
    return this.migrations.get(id);
  }

  public startMigration(id: string): VersionMigration {
    const migration = this.migrations.get(id);
    if (!migration) throw new Error('Migration not found');
    migration.status = 'in_progress';
    migration.metadata.updatedAt = new Date();
    this.emit('migration.started', migration);
    return migration;
  }

  // Gateway Operations
  public getGateways(): APIGatewayConfig[] {
    return Array.from(this.gateways.values());
  }

  public getGatewayById(id: string): APIGatewayConfig | undefined {
    return this.gateways.get(id);
  }

  // Statistics
  public getStatistics(): VersionStatistics {
    const versions = Array.from(this.versions.values());
    return {
      overview: {
        totalVersions: versions.length,
        activeVersions: versions.filter((v) => v.status === 'stable' || v.status === 'beta').length,
        deprecatedVersions: versions.filter((v) => v.status === 'deprecated').length,
        sunsetVersions: versions.filter((v) => v.status === 'sunset').length,
      },
      usage: {
        totalRequests: versions.reduce((sum, v) => sum + v.metrics.usage.totalRequests, 0),
        requestsLast24h: versions.reduce((sum, v) => sum + v.metrics.usage.last24hRequests, 0),
        requestsLast7d: versions.reduce((sum, v) => sum + v.metrics.usage.last7dRequests, 0),
        uniqueConsumers: versions.reduce((sum, v) => sum + v.metrics.usage.uniqueConsumers, 0),
        byVersion: versions.reduce((acc, v) => { acc[v.version] = v.metrics.usage.totalRequests; return acc; }, {} as Record<string, number>),
      },
      performance: {
        avgLatency: versions.reduce((sum, v) => sum + v.metrics.performance.avgLatency, 0) / versions.length,
        p95Latency: Math.max(...versions.map((v) => v.metrics.performance.p95Latency)),
        errorRate: versions.reduce((sum, v) => sum + v.metrics.performance.errorRate, 0) / versions.length,
        byVersion: versions.reduce((acc, v) => { acc[v.version] = { latency: v.metrics.performance.avgLatency, errorRate: v.metrics.performance.errorRate }; return acc; }, {} as Record<string, { latency: number; errorRate: number }>),
      },
      adoption: {
        latestVersionAdoption: 75,
        migrationInProgress: Array.from(this.migrations.values()).filter((m) => m.status === 'in_progress').length,
        pendingMigrations: Array.from(this.migrations.values()).filter((m) => m.status === 'pending').length,
      },
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

export const apiVersioningService = APIVersioningService.getInstance();
export type {
  VersionStatus,
  APIType,
  ChangeType,
  MigrationStatus,
  APIVersion,
  APIEndpoint,
  EndpointParameter,
  RequestBody,
  EndpointResponse,
  SecurityRequirement,
  RateLimitOverride,
  EndpointExample,
  SchemaDefinition,
  APISchema,
  SchemaHistory,
  AuthenticationConfig,
  RateLimitConfig,
  VersionFeature,
  ChangelogEntry,
  CompatibilityInfo,
  DocumentationConfig,
  VersionMetrics,
  SunsetInfo,
  APIConsumer,
  VersionMigration,
  MigrationStep,
  EndpointMapping,
  SchemaMapping,
  APIGatewayConfig,
  VersionStatistics,
};
