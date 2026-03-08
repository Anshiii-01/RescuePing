/**
 * Configuration Management Service
 * Comprehensive configuration management, environment settings, and dynamic config handling
 */

// Config Type
type ConfigType = 'string' | 'number' | 'boolean' | 'json' | 'secret' | 'array' | 'enum';

// Config Scope
type ConfigScope = 'global' | 'environment' | 'service' | 'tenant' | 'user';

// Config Status
type ConfigStatus = 'active' | 'deprecated' | 'pending' | 'disabled';

// Environment
type Environment = 'development' | 'staging' | 'production' | 'testing';

// Configuration Item
interface ConfigurationItem {
  id: string;
  key: string;
  name: string;
  description: string;
  type: ConfigType;
  scope: ConfigScope;
  status: ConfigStatus;
  value: ConfigValue;
  defaultValue: ConfigValue;
  schema: ConfigSchema;
  overrides: ConfigOverride[];
  history: ConfigHistory[];
  dependencies: ConfigDependency[];
  tags: string[];
  category: string;
  sensitive: boolean;
  encrypted: boolean;
  validation: ConfigValidation;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    version: number;
    source: 'manual' | 'api' | 'import' | 'sync';
  };
}

// Config Value
type ConfigValue = string | number | boolean | Record<string, unknown> | unknown[] | null;

// Config Schema
interface ConfigSchema {
  type: ConfigType;
  format?: string;
  enum?: unknown[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  items?: ConfigSchema;
  properties?: Record<string, ConfigSchema>;
  required?: string[];
  default?: ConfigValue;
  examples?: ConfigValue[];
}

// Config Override
interface ConfigOverride {
  id: string;
  scope: ConfigScope;
  scopeId: string;
  scopeName: string;
  value: ConfigValue;
  priority: number;
  enabled: boolean;
  conditions: OverrideCondition[];
  validFrom?: Date;
  validUntil?: Date;
  createdAt: Date;
  createdBy: string;
}

// Override Condition
interface OverrideCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in_list' | 'regex' | 'between';
  value: unknown;
}

// Config History
interface ConfigHistory {
  id: string;
  timestamp: Date;
  action: 'created' | 'updated' | 'deleted' | 'override_added' | 'override_removed' | 'rollback';
  actor: {
    type: 'user' | 'service' | 'system';
    id: string;
    name: string;
  };
  previousValue?: ConfigValue;
  newValue?: ConfigValue;
  version: number;
  reason?: string;
}

// Config Dependency
interface ConfigDependency {
  configKey: string;
  type: 'requires' | 'conflicts' | 'overrides';
  condition?: string;
}

// Config Validation
interface ConfigValidation {
  required: boolean;
  rules: ValidationRule[];
  customValidator?: string;
  errorMessage?: string;
}

// Validation Rule
interface ValidationRule {
  type: 'range' | 'regex' | 'custom' | 'enum' | 'length' | 'type';
  params: Record<string, unknown>;
  message: string;
}

// Config Namespace
interface ConfigNamespace {
  id: string;
  name: string;
  description: string;
  path: string;
  parent?: string;
  children: string[];
  configs: string[];
  permissions: NamespacePermission[];
  settings: NamespaceSettings;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Namespace Permission
interface NamespacePermission {
  principal: {
    type: 'user' | 'role' | 'service' | 'group';
    id: string;
  };
  permissions: ('read' | 'write' | 'admin')[];
  inherited: boolean;
}

// Namespace Settings
interface NamespaceSettings {
  inheritFromParent: boolean;
  allowOverrides: boolean;
  requireApproval: boolean;
  encryptSensitive: boolean;
  auditEnabled: boolean;
  maxVersions: number;
}

// Environment Configuration
interface EnvironmentConfiguration {
  id: string;
  name: string;
  environment: Environment;
  description: string;
  status: 'active' | 'inactive' | 'locked';
  variables: EnvironmentVariable[];
  secrets: string[];
  inheritsFrom?: string;
  overrides: Record<string, ConfigValue>;
  deployments: {
    lastDeployed: Date;
    deployedBy: string;
    version: string;
  }[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Environment Variable
interface EnvironmentVariable {
  id: string;
  key: string;
  value: ConfigValue;
  type: ConfigType;
  sensitive: boolean;
  source: 'manual' | 'secret_manager' | 'inherited' | 'computed';
  sourceId?: string;
}

// Config Profile
interface ConfigProfile {
  id: string;
  name: string;
  description: string;
  type: 'base' | 'overlay' | 'override';
  priority: number;
  active: boolean;
  configs: Record<string, ConfigValue>;
  applicability: {
    environments: Environment[];
    services: string[];
    tenants: string[];
    conditions: OverrideCondition[];
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    activatedAt?: Date;
  };
}

// Config Template
interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  schema: {
    configs: Partial<ConfigurationItem>[];
    namespaces: Partial<ConfigNamespace>[];
  };
  variables: {
    name: string;
    description: string;
    default?: ConfigValue;
    required: boolean;
  }[];
  tags: string[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    usageCount: number;
  };
}

// Config Diff
interface ConfigDiff {
  id: string;
  source: {
    type: 'environment' | 'profile' | 'snapshot';
    id: string;
    name: string;
  };
  target: {
    type: 'environment' | 'profile' | 'snapshot';
    id: string;
    name: string;
  };
  changes: {
    key: string;
    type: 'added' | 'removed' | 'modified';
    sourceValue?: ConfigValue;
    targetValue?: ConfigValue;
  }[];
  createdAt: Date;
  createdBy: string;
}

// Config Snapshot
interface ConfigSnapshot {
  id: string;
  name: string;
  description: string;
  environment: Environment;
  configs: Record<string, ConfigValue>;
  profiles: string[];
  version: string;
  tags: string[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    size: number;
    configCount: number;
  };
}

// Config Deployment
interface ConfigDeployment {
  id: string;
  name: string;
  environment: Environment;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rolled_back';
  type: 'full' | 'incremental' | 'rollback';
  source: {
    type: 'snapshot' | 'profile' | 'manual';
    id?: string;
  };
  changes: {
    key: string;
    oldValue?: ConfigValue;
    newValue?: ConfigValue;
    action: 'set' | 'update' | 'delete';
  }[];
  targets: {
    service: string;
    instances: number;
    status: 'pending' | 'applied' | 'failed';
    appliedAt?: Date;
  }[];
  rollback?: {
    snapshotId: string;
    reason: string;
    rolledBackAt: Date;
    rolledBackBy: string;
  };
  schedule?: {
    scheduledAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    startedAt?: Date;
    completedAt?: Date;
  };
}

// Config Watch
interface ConfigWatch {
  id: string;
  name: string;
  keys: string[];
  patterns: string[];
  callback: {
    type: 'webhook' | 'event' | 'function';
    url?: string;
    eventType?: string;
    functionName?: string;
  };
  filters: {
    environments: Environment[];
    scopes: ConfigScope[];
    actions: ('created' | 'updated' | 'deleted')[];
  };
  enabled: boolean;
  lastTriggered?: Date;
  triggerCount: number;
  metadata: {
    createdAt: Date;
    createdBy: string;
  };
}

// Config Audit
interface ConfigAudit {
  id: string;
  timestamp: Date;
  action: string;
  configKey: string;
  environment?: Environment;
  actor: {
    type: 'user' | 'service' | 'system';
    id: string;
    name: string;
    ip?: string;
  };
  changes?: {
    field: string;
    oldValue?: unknown;
    newValue?: unknown;
  }[];
  success: boolean;
  errorMessage?: string;
}

// Config Service Client
interface ConfigServiceClient {
  id: string;
  name: string;
  service: string;
  environment: Environment;
  status: 'connected' | 'disconnected' | 'stale';
  subscriptions: string[];
  lastSync: Date;
  version: string;
  configVersion: number;
  metadata: {
    createdAt: Date;
    lastHeartbeat: Date;
    ip?: string;
    host?: string;
  };
}

// Configuration Statistics
interface ConfigurationStatistics {
  overview: {
    totalConfigs: number;
    activeConfigs: number;
    deprecatedConfigs: number;
    sensitiveConfigs: number;
    totalNamespaces: number;
  };
  byType: Record<ConfigType, number>;
  byScope: Record<ConfigScope, number>;
  byCategory: Record<string, number>;
  activity: {
    changesLast24h: number;
    changesLast7d: number;
    deploymentsLast7d: number;
    activeWatches: number;
  };
  clients: {
    totalClients: number;
    connectedClients: number;
    staleClients: number;
  };
  trends: {
    date: string;
    changes: number;
    deployments: number;
    reads: number;
  }[];
}

class ConfigurationService {
  private static instance: ConfigurationService;
  private configs: Map<string, ConfigurationItem> = new Map();
  private namespaces: Map<string, ConfigNamespace> = new Map();
  private environments: Map<string, EnvironmentConfiguration> = new Map();
  private profiles: Map<string, ConfigProfile> = new Map();
  private templates: Map<string, ConfigTemplate> = new Map();
  private snapshots: Map<string, ConfigSnapshot> = new Map();
  private deployments: Map<string, ConfigDeployment> = new Map();
  private watches: Map<string, ConfigWatch> = new Map();
  private audits: Map<string, ConfigAudit[]> = new Map();
  private clients: Map<string, ConfigServiceClient> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Namespaces
    const namespacesData = [
      { name: 'application', path: '/application', parent: null },
      { name: 'database', path: '/application/database', parent: 'application' },
      { name: 'cache', path: '/application/cache', parent: 'application' },
      { name: 'api', path: '/application/api', parent: 'application' },
      { name: 'services', path: '/services', parent: null },
      { name: 'feature-flags', path: '/feature-flags', parent: null },
    ];

    namespacesData.forEach((ns, idx) => {
      const namespace: ConfigNamespace = {
        id: `ns-${(idx + 1).toString().padStart(4, '0')}`,
        name: ns.name,
        description: `Configuration namespace for ${ns.name}`,
        path: ns.path,
        parent: ns.parent ? `ns-${(namespacesData.findIndex((n) => n.name === ns.parent) + 1).toString().padStart(4, '0')}` : undefined,
        children: [],
        configs: [],
        permissions: [
          { principal: { type: 'role', id: 'admin' }, permissions: ['read', 'write', 'admin'], inherited: false },
          { principal: { type: 'role', id: 'developer' }, permissions: ['read'], inherited: false },
        ],
        settings: {
          inheritFromParent: !!ns.parent,
          allowOverrides: true,
          requireApproval: ns.name === 'application',
          encryptSensitive: true,
          auditEnabled: true,
          maxVersions: 50,
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.namespaces.set(namespace.id, namespace);
    });

    // Initialize Configuration Items
    const configsData = [
      { key: 'app.name', name: 'Application Name', type: 'string', value: 'RescuePing', scope: 'global', category: 'application' },
      { key: 'app.version', name: 'Application Version', type: 'string', value: '2.1.0', scope: 'global', category: 'application' },
      { key: 'app.debug', name: 'Debug Mode', type: 'boolean', value: false, scope: 'environment', category: 'application' },
      { key: 'app.log_level', name: 'Log Level', type: 'enum', value: 'info', scope: 'environment', category: 'logging' },
      { key: 'db.host', name: 'Database Host', type: 'string', value: 'localhost', scope: 'environment', category: 'database' },
      { key: 'db.port', name: 'Database Port', type: 'number', value: 5432, scope: 'environment', category: 'database' },
      { key: 'db.name', name: 'Database Name', type: 'string', value: 'rescueping', scope: 'environment', category: 'database' },
      { key: 'db.pool_size', name: 'Connection Pool Size', type: 'number', value: 20, scope: 'environment', category: 'database' },
      { key: 'cache.enabled', name: 'Cache Enabled', type: 'boolean', value: true, scope: 'global', category: 'cache' },
      { key: 'cache.ttl', name: 'Cache TTL', type: 'number', value: 3600, scope: 'global', category: 'cache' },
      { key: 'api.rate_limit', name: 'API Rate Limit', type: 'number', value: 1000, scope: 'service', category: 'api' },
      { key: 'api.timeout', name: 'API Timeout', type: 'number', value: 30000, scope: 'service', category: 'api' },
      { key: 'notification.email_enabled', name: 'Email Notifications', type: 'boolean', value: true, scope: 'tenant', category: 'notifications' },
      { key: 'notification.sms_enabled', name: 'SMS Notifications', type: 'boolean', value: false, scope: 'tenant', category: 'notifications' },
      { key: 'feature.dark_mode', name: 'Dark Mode Feature', type: 'boolean', value: true, scope: 'user', category: 'features' },
      { key: 'security.session_timeout', name: 'Session Timeout', type: 'number', value: 3600, scope: 'global', category: 'security' },
      { key: 'security.max_login_attempts', name: 'Max Login Attempts', type: 'number', value: 5, scope: 'global', category: 'security' },
      { key: 'integrations.slack_webhook', name: 'Slack Webhook URL', type: 'secret', value: 'https://hooks.slack.com/...', scope: 'environment', category: 'integrations' },
      { key: 'ui.theme', name: 'UI Theme', type: 'json', value: { primary: '#007bff', secondary: '#6c757d' }, scope: 'tenant', category: 'ui' },
      { key: 'limits.max_alerts', name: 'Max Alerts per Day', type: 'number', value: 10000, scope: 'tenant', category: 'limits' },
    ];

    configsData.forEach((c, idx) => {
      const config: ConfigurationItem = {
        id: `config-${(idx + 1).toString().padStart(4, '0')}`,
        key: c.key,
        name: c.name,
        description: `Configuration for ${c.name.toLowerCase()}`,
        type: c.type as ConfigType,
        scope: c.scope as ConfigScope,
        status: idx === 3 ? 'deprecated' : 'active',
        value: c.value,
        defaultValue: c.value,
        schema: {
          type: c.type as ConfigType,
          enum: c.type === 'enum' ? ['debug', 'info', 'warn', 'error'] : undefined,
          minimum: c.type === 'number' ? 0 : undefined,
          maximum: c.type === 'number' && c.key.includes('port') ? 65535 : undefined,
        },
        overrides: c.scope === 'environment' ? [
          {
            id: `override-${idx}-1`,
            scope: 'environment',
            scopeId: 'production',
            scopeName: 'Production',
            value: c.key === 'app.debug' ? false : c.key === 'db.host' ? 'db.prod.rescueping.com' : c.value,
            priority: 10,
            enabled: true,
            conditions: [],
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            createdBy: 'admin',
          },
          {
            id: `override-${idx}-2`,
            scope: 'environment',
            scopeId: 'development',
            scopeName: 'Development',
            value: c.key === 'app.debug' ? true : c.key === 'db.host' ? 'localhost' : c.value,
            priority: 5,
            enabled: true,
            conditions: [],
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            createdBy: 'admin',
          },
        ] : [],
        history: [
          {
            id: `hist-${idx}-1`,
            timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            action: 'updated',
            actor: { type: 'user', id: 'admin', name: 'Admin User' },
            previousValue: c.type === 'number' ? (c.value as number) - 1 : c.value,
            newValue: c.value,
            version: 2,
          },
          {
            id: `hist-${idx}-2`,
            timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
            action: 'created',
            actor: { type: 'user', id: 'admin', name: 'Admin User' },
            newValue: c.value,
            version: 1,
          },
        ],
        dependencies: c.key === 'db.pool_size' ? [{ configKey: 'db.host', type: 'requires' }] : [],
        tags: [c.category, c.scope],
        category: c.category,
        sensitive: c.type === 'secret' || c.key.includes('password') || c.key.includes('webhook'),
        encrypted: c.type === 'secret',
        validation: {
          required: true,
          rules: c.type === 'number' ? [
            { type: 'range', params: { min: 0 }, message: 'Value must be positive' },
          ] : [],
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          version: Math.floor(Math.random() * 10) + 1,
          source: 'manual',
        },
      };
      this.configs.set(config.id, config);

      // Add config to appropriate namespace
      const nsName = c.category === 'database' ? 'database' : c.category === 'cache' ? 'cache' : c.category === 'api' ? 'api' : 'application';
      const ns = Array.from(this.namespaces.values()).find((n) => n.name === nsName);
      if (ns) ns.configs.push(config.id);
    });

    // Initialize Environment Configurations
    const envsData: { name: string; environment: Environment }[] = [
      { name: 'Development', environment: 'development' },
      { name: 'Staging', environment: 'staging' },
      { name: 'Production', environment: 'production' },
      { name: 'Testing', environment: 'testing' },
    ];

    envsData.forEach((e, idx) => {
      const envConfig: EnvironmentConfiguration = {
        id: `env-${(idx + 1).toString().padStart(4, '0')}`,
        name: e.name,
        environment: e.environment,
        description: `${e.name} environment configuration`,
        status: e.environment === 'production' ? 'locked' : 'active',
        variables: [
          { id: `var-${idx}-1`, key: 'NODE_ENV', value: e.environment, type: 'string', sensitive: false, source: 'manual' },
          { id: `var-${idx}-2`, key: 'LOG_LEVEL', value: e.environment === 'production' ? 'warn' : 'debug', type: 'string', sensitive: false, source: 'manual' },
          { id: `var-${idx}-3`, key: 'DATABASE_URL', value: `postgres://user:pass@db.${e.environment}.rescueping.com:5432/rescueping`, type: 'string', sensitive: true, source: 'secret_manager' },
          { id: `var-${idx}-4`, key: 'REDIS_URL', value: `redis://cache.${e.environment}.rescueping.com:6379`, type: 'string', sensitive: false, source: 'manual' },
        ],
        secrets: ['secret-0001', 'secret-0002'],
        inheritsFrom: e.environment === 'staging' ? 'env-0001' : undefined,
        overrides: {
          'app.debug': e.environment === 'development',
          'db.host': `db.${e.environment}.rescueping.com`,
          'api.rate_limit': e.environment === 'production' ? 5000 : 1000,
        },
        deployments: [
          {
            lastDeployed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            deployedBy: 'deployment-service',
            version: '2.1.' + (idx + 1),
          },
        ],
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.environments.set(envConfig.id, envConfig);
    });

    // Initialize Config Profiles
    const profilesData = [
      { name: 'High Performance', type: 'overlay', priority: 10 },
      { name: 'Debug Mode', type: 'overlay', priority: 20 },
      { name: 'Security Hardened', type: 'overlay', priority: 30 },
      { name: 'Cost Optimized', type: 'overlay', priority: 15 },
    ];

    profilesData.forEach((p, idx) => {
      const profile: ConfigProfile = {
        id: `profile-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: `${p.name} configuration profile`,
        type: p.type as ConfigProfile['type'],
        priority: p.priority,
        active: idx === 0,
        configs: {
          'db.pool_size': p.name === 'High Performance' ? 50 : p.name === 'Cost Optimized' ? 10 : 20,
          'cache.ttl': p.name === 'High Performance' ? 7200 : 3600,
          'api.timeout': p.name === 'High Performance' ? 60000 : 30000,
          'app.debug': p.name === 'Debug Mode',
          'security.session_timeout': p.name === 'Security Hardened' ? 1800 : 3600,
        },
        applicability: {
          environments: p.name === 'Debug Mode' ? ['development', 'staging'] : ['production', 'staging'],
          services: [],
          tenants: [],
          conditions: [],
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          activatedAt: idx === 0 ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : undefined,
        },
      };
      this.profiles.set(profile.id, profile);
    });

    // Initialize Config Templates
    const templatesData = [
      { name: 'Microservice Config', category: 'services' },
      { name: 'Database Config', category: 'database' },
      { name: 'API Gateway Config', category: 'api' },
    ];

    templatesData.forEach((t, idx) => {
      const template: ConfigTemplate = {
        id: `tmpl-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: `Template for ${t.name.toLowerCase()}`,
        category: t.category,
        schema: {
          configs: [
            { key: `${t.category}.enabled`, type: 'boolean', defaultValue: true },
            { key: `${t.category}.timeout`, type: 'number', defaultValue: 30000 },
            { key: `${t.category}.retries`, type: 'number', defaultValue: 3 },
          ],
          namespaces: [],
        },
        variables: [
          { name: 'SERVICE_NAME', description: 'Name of the service', required: true },
          { name: 'ENVIRONMENT', description: 'Target environment', default: 'development', required: false },
        ],
        tags: ['template', t.category],
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          usageCount: Math.floor(Math.random() * 50) + 10,
        },
      };
      this.templates.set(template.id, template);
    });

    // Initialize Config Snapshots
    const snapshotsData = [
      { name: 'Production Backup', environment: 'production' as Environment },
      { name: 'Pre-Release Snapshot', environment: 'staging' as Environment },
      { name: 'Rollback Point', environment: 'production' as Environment },
    ];

    snapshotsData.forEach((s, idx) => {
      const snapshot: ConfigSnapshot = {
        id: `snap-${(idx + 1).toString().padStart(4, '0')}`,
        name: s.name,
        description: `${s.name} - ${s.environment}`,
        environment: s.environment,
        configs: Object.fromEntries(Array.from(this.configs.values()).map((c) => [c.key, c.value])),
        profiles: Array.from(this.profiles.keys()).slice(0, 2),
        version: `v${idx + 1}.0.0`,
        tags: [s.environment, 'snapshot'],
        metadata: {
          createdAt: new Date(Date.now() - idx * 30 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          size: Math.floor(Math.random() * 100000) + 10000,
          configCount: this.configs.size,
        },
      };
      this.snapshots.set(snapshot.id, snapshot);
    });

    // Initialize Config Deployments
    const deploymentsData = [
      { name: 'Production Release v2.1', environment: 'production' as Environment, status: 'completed' },
      { name: 'Staging Update', environment: 'staging' as Environment, status: 'completed' },
      { name: 'Hotfix Deploy', environment: 'production' as Environment, status: 'in_progress' },
    ];

    deploymentsData.forEach((d, idx) => {
      const deployment: ConfigDeployment = {
        id: `deploy-${(idx + 1).toString().padStart(4, '0')}`,
        name: d.name,
        environment: d.environment,
        status: d.status as ConfigDeployment['status'],
        type: 'incremental',
        source: { type: 'snapshot', id: `snap-${(idx % 3 + 1).toString().padStart(4, '0')}` },
        changes: [
          { key: 'app.version', oldValue: '2.0.0', newValue: '2.1.0', action: 'update' },
          { key: 'api.rate_limit', oldValue: 500, newValue: 1000, action: 'update' },
        ],
        targets: [
          { service: 'api-service', instances: 5, status: d.status === 'completed' ? 'applied' : 'pending', appliedAt: d.status === 'completed' ? new Date() : undefined },
          { service: 'worker-service', instances: 3, status: d.status === 'completed' ? 'applied' : 'pending', appliedAt: d.status === 'completed' ? new Date() : undefined },
        ],
        metadata: {
          createdAt: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
          createdBy: 'deployment-bot',
          startedAt: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000 + 60 * 1000),
          completedAt: d.status === 'completed' ? new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000 + 300 * 1000) : undefined,
        },
      };
      this.deployments.set(deployment.id, deployment);
    });

    // Initialize Config Watches
    const watchesData = [
      { name: 'Security Config Watch', keys: ['security.*'], callback: 'webhook' },
      { name: 'Database Config Watch', keys: ['db.*'], callback: 'event' },
      { name: 'API Config Watch', keys: ['api.*'], callback: 'function' },
    ];

    watchesData.forEach((w, idx) => {
      const watch: ConfigWatch = {
        id: `watch-${(idx + 1).toString().padStart(4, '0')}`,
        name: w.name,
        keys: [],
        patterns: w.keys,
        callback: {
          type: w.callback as ConfigWatch['callback']['type'],
          url: w.callback === 'webhook' ? 'https://hooks.rescueping.com/config' : undefined,
          eventType: w.callback === 'event' ? 'config.changed' : undefined,
          functionName: w.callback === 'function' ? 'onConfigChange' : undefined,
        },
        filters: {
          environments: ['production', 'staging'],
          scopes: ['global', 'environment'],
          actions: ['created', 'updated', 'deleted'],
        },
        enabled: true,
        lastTriggered: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        triggerCount: Math.floor(Math.random() * 100) + 10,
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
        },
      };
      this.watches.set(watch.id, watch);
    });

    // Initialize Service Clients
    const clientsData = [
      { name: 'API Service', service: 'api-service', environment: 'production' as Environment },
      { name: 'Worker Service', service: 'worker-service', environment: 'production' as Environment },
      { name: 'Web App', service: 'web-app', environment: 'production' as Environment },
      { name: 'Mobile BFF', service: 'mobile-bff', environment: 'production' as Environment },
    ];

    clientsData.forEach((c, idx) => {
      const client: ConfigServiceClient = {
        id: `client-${(idx + 1).toString().padStart(4, '0')}`,
        name: c.name,
        service: c.service,
        environment: c.environment,
        status: idx === 3 ? 'stale' : 'connected',
        subscriptions: Array.from(this.configs.values()).slice(0, 10).map((cfg) => cfg.key),
        lastSync: new Date(Date.now() - (idx === 3 ? 60 * 60 * 1000 : Math.random() * 5 * 60 * 1000)),
        version: '1.2.0',
        configVersion: Math.floor(Math.random() * 10) + 1,
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          lastHeartbeat: new Date(Date.now() - (idx === 3 ? 60 * 60 * 1000 : Math.random() * 60 * 1000)),
          ip: `10.0.${idx + 1}.${Math.floor(Math.random() * 255)}`,
          host: `${c.service}-${idx + 1}.prod.rescueping.internal`,
        },
      };
      this.clients.set(client.id, client);
    });

    // Initialize Audits
    const actions = ['created', 'updated', 'deleted', 'read'];
    Array.from(this.configs.values()).forEach((config) => {
      const configAudits: ConfigAudit[] = [];
      for (let i = 0; i < 5; i++) {
        const audit: ConfigAudit = {
          id: `audit-${config.id}-${i}`,
          timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          action: actions[Math.floor(Math.random() * actions.length)],
          configKey: config.key,
          environment: ['production', 'staging', 'development'][Math.floor(Math.random() * 3)] as Environment,
          actor: {
            type: ['user', 'service', 'system'][Math.floor(Math.random() * 3)] as 'user' | 'service' | 'system',
            id: `actor-${i}`,
            name: ['Admin User', 'API Service', 'System'][Math.floor(Math.random() * 3)],
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          },
          success: Math.random() > 0.1,
        };
        configAudits.push(audit);
      }
      this.audits.set(config.id, configAudits);
    });
  }

  // Configuration Operations
  public getConfigs(category?: string, scope?: ConfigScope): ConfigurationItem[] {
    let configs = Array.from(this.configs.values());
    if (category) configs = configs.filter((c) => c.category === category);
    if (scope) configs = configs.filter((c) => c.scope === scope);
    return configs.sort((a, b) => a.key.localeCompare(b.key));
  }

  public getConfigById(id: string): ConfigurationItem | undefined {
    return this.configs.get(id);
  }

  public getConfigByKey(key: string): ConfigurationItem | undefined {
    return Array.from(this.configs.values()).find((c) => c.key === key);
  }

  public getValue(key: string, context?: { environment?: Environment; service?: string; tenant?: string; user?: string }): ConfigValue {
    const config = this.getConfigByKey(key);
    if (!config) return null;

    // Apply overrides based on context
    if (context) {
      const applicableOverrides = config.overrides
        .filter((o) => o.enabled)
        .filter((o) => {
          if (o.scope === 'environment' && context.environment) return o.scopeId === context.environment;
          if (o.scope === 'service' && context.service) return o.scopeId === context.service;
          if (o.scope === 'tenant' && context.tenant) return o.scopeId === context.tenant;
          if (o.scope === 'user' && context.user) return o.scopeId === context.user;
          return false;
        })
        .sort((a, b) => b.priority - a.priority);

      if (applicableOverrides.length > 0) {
        return applicableOverrides[0].value;
      }
    }

    return config.value;
  }

  public setConfig(key: string, value: ConfigValue, actor: string): ConfigurationItem {
    let config = this.getConfigByKey(key);
    
    if (!config) {
      config = {
        id: `config-${this.generateId()}`,
        key,
        name: key,
        description: '',
        type: typeof value as ConfigType,
        scope: 'global',
        status: 'active',
        value,
        defaultValue: value,
        schema: { type: typeof value as ConfigType },
        overrides: [],
        history: [],
        dependencies: [],
        tags: [],
        category: 'custom',
        sensitive: false,
        encrypted: false,
        validation: { required: false, rules: [] },
        metadata: { createdAt: new Date(), createdBy: actor, updatedAt: new Date(), version: 1, source: 'api' },
      };
      this.configs.set(config.id, config);
    } else {
      const previousValue = config.value;
      config.value = value;
      config.metadata.version++;
      config.metadata.updatedAt = new Date();
      
      config.history.unshift({
        id: `hist-${this.generateId()}`,
        timestamp: new Date(),
        action: 'updated',
        actor: { type: 'user', id: actor, name: actor },
        previousValue,
        newValue: value,
        version: config.metadata.version,
      });
    }

    this.emit('config.changed', { config, actor });
    this.notifyWatches(config);
    return config;
  }

  private notifyWatches(config: ConfigurationItem): void {
    Array.from(this.watches.values())
      .filter((w) => w.enabled)
      .filter((w) => w.keys.includes(config.key) || w.patterns.some((p) => new RegExp(p.replace('*', '.*')).test(config.key)))
      .forEach((watch) => {
        watch.lastTriggered = new Date();
        watch.triggerCount++;
        this.emit('watch.triggered', { watch, config });
      });
  }

  // Namespace Operations
  public getNamespaces(): ConfigNamespace[] {
    return Array.from(this.namespaces.values());
  }

  public getNamespaceById(id: string): ConfigNamespace | undefined {
    return this.namespaces.get(id);
  }

  // Environment Operations
  public getEnvironments(): EnvironmentConfiguration[] {
    return Array.from(this.environments.values());
  }

  public getEnvironmentById(id: string): EnvironmentConfiguration | undefined {
    return this.environments.get(id);
  }

  public getEnvironmentByName(environment: Environment): EnvironmentConfiguration | undefined {
    return Array.from(this.environments.values()).find((e) => e.environment === environment);
  }

  // Profile Operations
  public getProfiles(active?: boolean): ConfigProfile[] {
    let profiles = Array.from(this.profiles.values());
    if (active !== undefined) profiles = profiles.filter((p) => p.active === active);
    return profiles.sort((a, b) => b.priority - a.priority);
  }

  public getProfileById(id: string): ConfigProfile | undefined {
    return this.profiles.get(id);
  }

  public activateProfile(id: string): ConfigProfile {
    const profile = this.profiles.get(id);
    if (!profile) throw new Error('Profile not found');
    profile.active = true;
    profile.metadata.activatedAt = new Date();
    profile.metadata.updatedAt = new Date();
    this.emit('profile.activated', profile);
    return profile;
  }

  // Template Operations
  public getTemplates(): ConfigTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplateById(id: string): ConfigTemplate | undefined {
    return this.templates.get(id);
  }

  // Snapshot Operations
  public getSnapshots(environment?: Environment): ConfigSnapshot[] {
    let snapshots = Array.from(this.snapshots.values());
    if (environment) snapshots = snapshots.filter((s) => s.environment === environment);
    return snapshots.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  public getSnapshotById(id: string): ConfigSnapshot | undefined {
    return this.snapshots.get(id);
  }

  public createSnapshot(name: string, environment: Environment, createdBy: string): ConfigSnapshot {
    const snapshot: ConfigSnapshot = {
      id: `snap-${this.generateId()}`,
      name,
      description: `Snapshot created at ${new Date().toISOString()}`,
      environment,
      configs: Object.fromEntries(Array.from(this.configs.values()).map((c) => [c.key, this.getValue(c.key, { environment })])),
      profiles: Array.from(this.profiles.values()).filter((p) => p.active).map((p) => p.id),
      version: `v${this.snapshots.size + 1}.0.0`,
      tags: [environment, 'snapshot'],
      metadata: {
        createdAt: new Date(),
        createdBy,
        size: 0,
        configCount: this.configs.size,
      },
    };
    this.snapshots.set(snapshot.id, snapshot);
    this.emit('snapshot.created', snapshot);
    return snapshot;
  }

  // Deployment Operations
  public getDeployments(status?: ConfigDeployment['status']): ConfigDeployment[] {
    let deployments = Array.from(this.deployments.values());
    if (status) deployments = deployments.filter((d) => d.status === status);
    return deployments.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  public getDeploymentById(id: string): ConfigDeployment | undefined {
    return this.deployments.get(id);
  }

  // Watch Operations
  public getWatches(): ConfigWatch[] {
    return Array.from(this.watches.values());
  }

  public getWatchById(id: string): ConfigWatch | undefined {
    return this.watches.get(id);
  }

  // Client Operations
  public getClients(status?: ConfigServiceClient['status']): ConfigServiceClient[] {
    let clients = Array.from(this.clients.values());
    if (status) clients = clients.filter((c) => c.status === status);
    return clients;
  }

  public getClientById(id: string): ConfigServiceClient | undefined {
    return this.clients.get(id);
  }

  // Audit Operations
  public getAudits(configId?: string): ConfigAudit[] {
    if (configId) {
      return this.audits.get(configId) || [];
    }
    return Array.from(this.audits.values()).flat().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Statistics
  public getStatistics(): ConfigurationStatistics {
    const configs = Array.from(this.configs.values());
    const byType: Record<ConfigType, number> = {} as Record<ConfigType, number>;
    const byScope: Record<ConfigScope, number> = {} as Record<ConfigScope, number>;
    const byCategory: Record<string, number> = {};

    configs.forEach((c) => {
      byType[c.type] = (byType[c.type] || 0) + 1;
      byScope[c.scope] = (byScope[c.scope] || 0) + 1;
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    });

    const allAudits = Array.from(this.audits.values()).flat();
    const clients = Array.from(this.clients.values());

    return {
      overview: {
        totalConfigs: configs.length,
        activeConfigs: configs.filter((c) => c.status === 'active').length,
        deprecatedConfigs: configs.filter((c) => c.status === 'deprecated').length,
        sensitiveConfigs: configs.filter((c) => c.sensitive).length,
        totalNamespaces: this.namespaces.size,
      },
      byType,
      byScope,
      byCategory,
      activity: {
        changesLast24h: allAudits.filter((a) => a.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
        changesLast7d: allAudits.filter((a) => a.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
        deploymentsLast7d: Array.from(this.deployments.values()).filter((d) => d.metadata.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
        activeWatches: Array.from(this.watches.values()).filter((w) => w.enabled).length,
      },
      clients: {
        totalClients: clients.length,
        connectedClients: clients.filter((c) => c.status === 'connected').length,
        staleClients: clients.filter((c) => c.status === 'stale').length,
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

export const configurationService = ConfigurationService.getInstance();
export type {
  ConfigType,
  ConfigScope,
  ConfigStatus,
  Environment,
  ConfigurationItem,
  ConfigValue,
  ConfigSchema,
  ConfigOverride,
  OverrideCondition,
  ConfigHistory,
  ConfigDependency,
  ConfigValidation,
  ValidationRule,
  ConfigNamespace,
  NamespacePermission,
  NamespaceSettings,
  EnvironmentConfiguration,
  EnvironmentVariable,
  ConfigProfile,
  ConfigTemplate,
  ConfigDiff,
  ConfigSnapshot,
  ConfigDeployment,
  ConfigWatch,
  ConfigAudit,
  ConfigServiceClient,
  ConfigurationStatistics,
};
