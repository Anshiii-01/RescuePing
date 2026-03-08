/**
 * Configuration Management Service
 * Centralized configuration, environment management, secrets, and dynamic settings
 */

// Config type
type ConfigType = 'string' | 'number' | 'boolean' | 'json' | 'array' | 'secret' | 'file' | 'url';

// Environment
type Environment = 'development' | 'staging' | 'production' | 'testing' | 'local';

// Config status
type ConfigStatus = 'active' | 'deprecated' | 'disabled' | 'pending_review';

// Change type
type ConfigChangeType = 'create' | 'update' | 'delete' | 'restore' | 'rollback';

// Validation rule
type ValidationRule = 'required' | 'min' | 'max' | 'pattern' | 'enum' | 'url' | 'email' | 'custom';

// Configuration item
interface ConfigItem {
  id: string;
  key: string;
  name: string;
  description: string;
  type: ConfigType;
  category: string;
  tags: string[];
  values: {
    [env in Environment]?: {
      value: unknown;
      encrypted: boolean;
      overridden: boolean;
      source: 'default' | 'env' | 'file' | 'remote' | 'override';
    };
  };
  defaultValue: unknown;
  validation: {
    rules: { rule: ValidationRule; params?: unknown }[];
    schema?: Record<string, unknown>;
  };
  metadata: {
    sensitive: boolean;
    restartRequired: boolean;
    dynamicReload: boolean;
    scope: 'global' | 'service' | 'instance';
    service?: string;
    permissions: string[];
    documentation?: string;
  };
  status: ConfigStatus;
  version: number;
  history: ConfigHistory[];
  audit: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
  };
}

// Config history
interface ConfigHistory {
  id: string;
  configId: string;
  version: number;
  changeType: ConfigChangeType;
  environment: Environment;
  previousValue: unknown;
  newValue: unknown;
  reason?: string;
  changedBy: string;
  changedAt: Date;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

// Config namespace
interface ConfigNamespace {
  id: string;
  name: string;
  description: string;
  path: string;
  parent?: string;
  children: string[];
  configs: string[];
  permissions: {
    read: string[];
    write: string[];
    admin: string[];
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Secret
interface Secret {
  id: string;
  key: string;
  name: string;
  description: string;
  type: 'api_key' | 'password' | 'certificate' | 'token' | 'connection_string' | 'private_key' | 'other';
  values: {
    [env in Environment]?: {
      encryptedValue: string;
      version: number;
      rotatedAt?: Date;
      expiresAt?: Date;
    };
  };
  rotation: {
    enabled: boolean;
    interval: number;
    lastRotated?: Date;
    nextRotation?: Date;
    strategy: 'manual' | 'automatic' | 'on_demand';
  };
  access: {
    services: string[];
    roles: string[];
    lastAccessed?: Date;
    accessCount: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Environment config
interface EnvironmentConfig {
  id: string;
  environment: Environment;
  name: string;
  description: string;
  status: 'active' | 'maintenance' | 'inactive';
  variables: {
    key: string;
    value: string;
    encrypted: boolean;
    source: string;
  }[];
  settings: {
    debugMode: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    features: string[];
    limits: Record<string, number>;
  };
  connections: {
    name: string;
    type: string;
    host: string;
    port: number;
    database?: string;
    ssl: boolean;
  }[];
  endpoints: {
    name: string;
    url: string;
    timeout: number;
    retries: number;
  }[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    deployedAt?: Date;
    version: string;
  };
}

// Config template
interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  schema: Record<string, unknown>;
  defaults: Record<string, unknown>;
  variables: {
    name: string;
    type: ConfigType;
    description: string;
    required: boolean;
    default?: unknown;
  }[];
  validations: {
    field: string;
    rules: { rule: ValidationRule; params?: unknown }[];
  }[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    usageCount: number;
  };
}

// Config deployment
interface ConfigDeployment {
  id: string;
  name: string;
  description: string;
  environment: Environment;
  configs: {
    configId: string;
    key: string;
    previousValue: unknown;
    newValue: unknown;
  }[];
  status: 'pending' | 'approved' | 'deploying' | 'deployed' | 'failed' | 'rolled_back';
  schedule?: {
    scheduledAt: Date;
    deployedAt?: Date;
  };
  approval: {
    required: boolean;
    approvers: string[];
    approvedBy?: string;
    approvedAt?: Date;
    comments?: string;
  };
  rollback?: {
    available: boolean;
    previousDeploymentId?: string;
    rolledBackAt?: Date;
    rolledBackBy?: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Config snapshot
interface ConfigSnapshot {
  id: string;
  name: string;
  description: string;
  environment: Environment;
  configs: {
    configId: string;
    key: string;
    value: unknown;
    version: number;
  }[];
  type: 'manual' | 'automatic' | 'deployment';
  status: 'active' | 'archived' | 'restored';
  metadata: {
    createdAt: Date;
    createdBy: string;
    size: number;
    checksum: string;
  };
}

// Config validation result
interface ConfigValidationResult {
  valid: boolean;
  errors: {
    configId: string;
    key: string;
    rule: string;
    message: string;
  }[];
  warnings: {
    configId: string;
    key: string;
    message: string;
  }[];
}

// Config diff
interface ConfigDiff {
  id: string;
  source: { environment: Environment; version?: number };
  target: { environment: Environment; version?: number };
  differences: {
    configId: string;
    key: string;
    sourceValue: unknown;
    targetValue: unknown;
    type: 'added' | 'removed' | 'modified' | 'unchanged';
  }[];
  summary: {
    added: number;
    removed: number;
    modified: number;
    unchanged: number;
  };
  generatedAt: Date;
}

// Config import/export
interface ConfigBundle {
  id: string;
  name: string;
  description: string;
  format: 'json' | 'yaml' | 'env' | 'properties';
  environment: Environment;
  configs: {
    key: string;
    value: unknown;
    type: ConfigType;
    metadata?: Record<string, unknown>;
  }[];
  metadata: {
    version: string;
    exportedAt: Date;
    exportedBy: string;
    checksum: string;
  };
}

class ConfigurationManagementService {
  private static instance: ConfigurationManagementService;
  private configs: Map<string, ConfigItem> = new Map();
  private namespaces: Map<string, ConfigNamespace> = new Map();
  private secrets: Map<string, Secret> = new Map();
  private environments: Map<Environment, EnvironmentConfig> = new Map();
  private templates: Map<string, ConfigTemplate> = new Map();
  private deployments: Map<string, ConfigDeployment> = new Map();
  private snapshots: Map<string, ConfigSnapshot> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];
  private currentEnvironment: Environment = 'development';

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ConfigurationManagementService {
    if (!ConfigurationManagementService.instance) {
      ConfigurationManagementService.instance = new ConfigurationManagementService();
    }
    return ConfigurationManagementService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize namespaces
    const namespacesData = [
      { name: 'app', path: '/app', description: 'Application settings' },
      { name: 'database', path: '/database', description: 'Database configurations' },
      { name: 'api', path: '/api', description: 'API settings' },
      { name: 'notifications', path: '/notifications', description: 'Notification settings' },
      { name: 'security', path: '/security', description: 'Security configurations' },
      { name: 'features', path: '/features', description: 'Feature flags and toggles' },
    ];

    namespacesData.forEach((ns, idx) => {
      const namespace: ConfigNamespace = {
        id: `ns-${(idx + 1).toString().padStart(4, '0')}`,
        name: ns.name,
        description: ns.description,
        path: ns.path,
        children: [],
        configs: [],
        permissions: {
          read: ['developer', 'admin'],
          write: ['admin'],
          admin: ['admin'],
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.namespaces.set(namespace.id, namespace);
    });

    // Initialize configs
    const configsData = [
      { key: 'app.name', name: 'Application Name', category: 'app', type: 'string', value: 'Rescue Ping' },
      { key: 'app.version', name: 'Application Version', category: 'app', type: 'string', value: '2.0.0' },
      { key: 'app.debug', name: 'Debug Mode', category: 'app', type: 'boolean', value: false, sensitive: false },
      { key: 'app.logLevel', name: 'Log Level', category: 'app', type: 'string', value: 'info' },
      { key: 'app.maxUploadSize', name: 'Max Upload Size', category: 'app', type: 'number', value: 10485760 },
      { key: 'database.host', name: 'Database Host', category: 'database', type: 'string', value: 'localhost' },
      { key: 'database.port', name: 'Database Port', category: 'database', type: 'number', value: 5432 },
      { key: 'database.name', name: 'Database Name', category: 'database', type: 'string', value: 'rescueping' },
      { key: 'database.pool.min', name: 'Min Pool Size', category: 'database', type: 'number', value: 5 },
      { key: 'database.pool.max', name: 'Max Pool Size', category: 'database', type: 'number', value: 20 },
      { key: 'api.baseUrl', name: 'API Base URL', category: 'api', type: 'url', value: 'https://api.rescueping.com' },
      { key: 'api.timeout', name: 'API Timeout', category: 'api', type: 'number', value: 30000 },
      { key: 'api.rateLimit', name: 'Rate Limit', category: 'api', type: 'number', value: 1000 },
      { key: 'notifications.email.enabled', name: 'Email Notifications', category: 'notifications', type: 'boolean', value: true },
      { key: 'notifications.sms.enabled', name: 'SMS Notifications', category: 'notifications', type: 'boolean', value: true },
      { key: 'notifications.push.enabled', name: 'Push Notifications', category: 'notifications', type: 'boolean', value: true },
      { key: 'security.sessionTimeout', name: 'Session Timeout', category: 'security', type: 'number', value: 3600 },
      { key: 'security.maxLoginAttempts', name: 'Max Login Attempts', category: 'security', type: 'number', value: 5 },
      { key: 'security.passwordMinLength', name: 'Password Min Length', category: 'security', type: 'number', value: 8 },
      { key: 'features.darkMode', name: 'Dark Mode Feature', category: 'features', type: 'boolean', value: true },
      { key: 'features.betaFeatures', name: 'Beta Features', category: 'features', type: 'boolean', value: false },
    ];

    configsData.forEach((cfg, idx) => {
      const config: ConfigItem = {
        id: `cfg-${(idx + 1).toString().padStart(4, '0')}`,
        key: cfg.key,
        name: cfg.name,
        description: `Configuration for ${cfg.name}`,
        type: cfg.type as ConfigType,
        category: cfg.category,
        tags: [cfg.category],
        values: {
          development: { value: cfg.value, encrypted: false, overridden: false, source: 'default' },
          staging: { value: cfg.value, encrypted: false, overridden: false, source: 'default' },
          production: { value: cfg.value, encrypted: false, overridden: false, source: 'default' },
          testing: { value: cfg.value, encrypted: false, overridden: false, source: 'default' },
        },
        defaultValue: cfg.value,
        validation: {
          rules: [{ rule: 'required' }],
        },
        metadata: {
          sensitive: cfg.sensitive ?? false,
          restartRequired: false,
          dynamicReload: true,
          scope: 'global',
          permissions: ['admin'],
        },
        status: 'active',
        version: 1,
        history: [],
        audit: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          updatedBy: 'admin',
        },
      };

      // Add some variations for different environments
      if (cfg.key === 'app.debug') {
        config.values.development = { value: true, encrypted: false, overridden: true, source: 'env' };
        config.values.production = { value: false, encrypted: false, overridden: true, source: 'env' };
      }
      if (cfg.key === 'app.logLevel') {
        config.values.development = { value: 'debug', encrypted: false, overridden: true, source: 'env' };
        config.values.production = { value: 'warn', encrypted: false, overridden: true, source: 'env' };
      }
      if (cfg.key === 'database.host') {
        config.values.development = { value: 'localhost', encrypted: false, overridden: false, source: 'default' };
        config.values.staging = { value: 'db-staging.rescueping.com', encrypted: false, overridden: true, source: 'env' };
        config.values.production = { value: 'db-prod.rescueping.com', encrypted: false, overridden: true, source: 'env' };
      }
      if (cfg.key === 'api.baseUrl') {
        config.values.development = { value: 'http://localhost:3000/api', encrypted: false, overridden: true, source: 'env' };
        config.values.staging = { value: 'https://staging-api.rescueping.com', encrypted: false, overridden: true, source: 'env' };
        config.values.production = { value: 'https://api.rescueping.com', encrypted: false, overridden: true, source: 'env' };
      }

      this.configs.set(config.id, config);
    });

    // Initialize secrets
    const secretsData = [
      { key: 'database.password', name: 'Database Password', type: 'password' },
      { key: 'jwt.secret', name: 'JWT Secret', type: 'token' },
      { key: 'api.key.google', name: 'Google API Key', type: 'api_key' },
      { key: 'api.key.firebase', name: 'Firebase API Key', type: 'api_key' },
      { key: 'smtp.password', name: 'SMTP Password', type: 'password' },
      { key: 'aws.secretKey', name: 'AWS Secret Key', type: 'api_key' },
      { key: 'encryption.key', name: 'Encryption Key', type: 'private_key' },
      { key: 'ssl.certificate', name: 'SSL Certificate', type: 'certificate' },
    ];

    secretsData.forEach((s, idx) => {
      const secret: Secret = {
        id: `secret-${(idx + 1).toString().padStart(4, '0')}`,
        key: s.key,
        name: s.name,
        description: `Secret for ${s.name}`,
        type: s.type as Secret['type'],
        values: {
          development: { encryptedValue: this.encrypt(`dev-${s.key}`), version: 1 },
          staging: { encryptedValue: this.encrypt(`staging-${s.key}`), version: 1 },
          production: {
            encryptedValue: this.encrypt(`prod-${s.key}`),
            version: 2,
            rotatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        rotation: {
          enabled: s.type === 'password' || s.type === 'api_key',
          interval: 90 * 24 * 60 * 60 * 1000,
          lastRotated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          nextRotation: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          strategy: 'automatic',
        },
        access: {
          services: ['api-service', 'auth-service'],
          roles: ['admin'],
          accessCount: Math.floor(Math.random() * 1000),
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.secrets.set(secret.id, secret);
    });

    // Initialize environments
    const environmentsData: Environment[] = ['development', 'staging', 'production', 'testing'];

    environmentsData.forEach((env) => {
      const envConfig: EnvironmentConfig = {
        id: `env-${env}`,
        environment: env,
        name: `${env.charAt(0).toUpperCase() + env.slice(1)} Environment`,
        description: `${env} environment configuration`,
        status: 'active',
        variables: [
          { key: 'NODE_ENV', value: env, encrypted: false, source: 'system' },
          { key: 'LOG_LEVEL', value: env === 'production' ? 'warn' : 'debug', encrypted: false, source: 'env' },
        ],
        settings: {
          debugMode: env !== 'production',
          logLevel: env === 'production' ? 'warn' : 'debug',
          features: env === 'production' ? ['stable'] : ['stable', 'beta'],
          limits: {
            maxRequests: env === 'production' ? 10000 : 1000,
            maxConnections: env === 'production' ? 100 : 10,
          },
        },
        connections: [
          {
            name: 'Primary Database',
            type: 'postgresql',
            host: env === 'production' ? 'db-prod.rescueping.com' : 'localhost',
            port: 5432,
            database: 'rescueping',
            ssl: env === 'production',
          },
          {
            name: 'Cache',
            type: 'redis',
            host: env === 'production' ? 'cache-prod.rescueping.com' : 'localhost',
            port: 6379,
            ssl: env === 'production',
          },
        ],
        endpoints: [
          {
            name: 'API Gateway',
            url: env === 'production' ? 'https://api.rescueping.com' : `https://${env}.rescueping.com`,
            timeout: 30000,
            retries: 3,
          },
        ],
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          version: '2.0.0',
        },
      };
      this.environments.set(env, envConfig);
    });

    // Initialize templates
    const templatesData = [
      { name: 'Service Config', category: 'service', description: 'Template for service configuration' },
      { name: 'Database Config', category: 'database', description: 'Template for database connection' },
      { name: 'API Integration', category: 'integration', description: 'Template for API integrations' },
      { name: 'Feature Flag', category: 'feature', description: 'Template for feature flags' },
    ];

    templatesData.forEach((t, idx) => {
      const template: ConfigTemplate = {
        id: `template-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: t.description,
        category: t.category,
        schema: {},
        defaults: {},
        variables: [
          { name: 'name', type: 'string', description: 'Configuration name', required: true },
          { name: 'enabled', type: 'boolean', description: 'Enable/disable', required: true, default: true },
          { name: 'timeout', type: 'number', description: 'Timeout in ms', required: false, default: 30000 },
        ],
        validations: [
          { field: 'name', rules: [{ rule: 'required' }, { rule: 'min', params: 3 }] },
        ],
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          usageCount: Math.floor(Math.random() * 50),
        },
      };
      this.templates.set(template.id, template);
    });

    // Initialize deployments
    const deploymentsData = [
      { name: 'Config Update v2.1', environment: 'production', status: 'deployed' },
      { name: 'Feature Flag Update', environment: 'staging', status: 'deployed' },
      { name: 'Security Settings', environment: 'production', status: 'pending' },
    ];

    deploymentsData.forEach((d, idx) => {
      const deployment: ConfigDeployment = {
        id: `deploy-${(idx + 1).toString().padStart(4, '0')}`,
        name: d.name,
        description: `Deployment: ${d.name}`,
        environment: d.environment as Environment,
        configs: [
          { configId: 'cfg-0001', key: 'app.name', previousValue: 'Rescue Ping', newValue: 'Rescue Ping v2' },
          { configId: 'cfg-0003', key: 'app.debug', previousValue: true, newValue: false },
        ],
        status: d.status as ConfigDeployment['status'],
        approval: {
          required: d.environment === 'production',
          approvers: ['admin', 'tech-lead'],
          approvedBy: d.status === 'deployed' ? 'admin' : undefined,
          approvedAt: d.status === 'deployed' ? new Date(Date.now() - 24 * 60 * 60 * 1000) : undefined,
        },
        rollback: {
          available: d.status === 'deployed',
          previousDeploymentId: idx > 0 ? `deploy-${idx.toString().padStart(4, '0')}` : undefined,
        },
        metadata: {
          createdAt: new Date(Date.now() - (idx + 1) * 7 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.deployments.set(deployment.id, deployment);
    });

    // Initialize snapshots
    const snapshotsData = [
      { name: 'Pre-deployment Snapshot', environment: 'production', type: 'deployment' },
      { name: 'Weekly Backup', environment: 'production', type: 'automatic' },
      { name: 'Manual Backup', environment: 'staging', type: 'manual' },
    ];

    snapshotsData.forEach((s, idx) => {
      const snapshot: ConfigSnapshot = {
        id: `snapshot-${(idx + 1).toString().padStart(4, '0')}`,
        name: s.name,
        description: `${s.type} snapshot for ${s.environment}`,
        environment: s.environment as Environment,
        configs: Array.from(this.configs.values()).slice(0, 10).map((c) => ({
          configId: c.id,
          key: c.key,
          value: c.values[s.environment as Environment]?.value,
          version: c.version,
        })),
        type: s.type as ConfigSnapshot['type'],
        status: 'active',
        metadata: {
          createdAt: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
          createdBy: s.type === 'automatic' ? 'system' : 'admin',
          size: Math.floor(Math.random() * 100000) + 10000,
          checksum: this.generateChecksum(),
        },
      };
      this.snapshots.set(snapshot.id, snapshot);
    });
  }

  /**
   * Simple encryption (for demo purposes)
   */
  private encrypt(value: string): string {
    return Buffer.from(value).toString('base64');
  }

  /**
   * Generate checksum
   */
  private generateChecksum(): string {
    return Math.random().toString(36).substr(2, 16);
  }

  /**
   * Get configs
   */
  public getConfigs(filter?: { category?: string; environment?: Environment }): ConfigItem[] {
    let configs = Array.from(this.configs.values());
    if (filter?.category) configs = configs.filter((c) => c.category === filter.category);
    return configs.sort((a, b) => a.key.localeCompare(b.key));
  }

  /**
   * Get config
   */
  public getConfig(id: string): ConfigItem | undefined {
    return this.configs.get(id);
  }

  /**
   * Get config by key
   */
  public getConfigByKey(key: string): ConfigItem | undefined {
    return Array.from(this.configs.values()).find((c) => c.key === key);
  }

  /**
   * Get config value
   */
  public getValue<T>(key: string, environment?: Environment): T | undefined {
    const config = this.getConfigByKey(key);
    if (!config) return undefined;

    const env = environment || this.currentEnvironment;
    const envValue = config.values[env];

    return (envValue?.value ?? config.defaultValue) as T;
  }

  /**
   * Set config value
   */
  public setValue(key: string, value: unknown, environment: Environment, actor: string, reason?: string): ConfigItem {
    const config = this.getConfigByKey(key);
    if (!config) throw new Error('Config not found');

    const previousValue = config.values[environment]?.value;

    config.values[environment] = {
      value,
      encrypted: false,
      overridden: true,
      source: 'override',
    };

    config.version++;
    config.audit.updatedAt = new Date();
    config.audit.updatedBy = actor;

    // Add history
    const historyEntry: ConfigHistory = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      configId: config.id,
      version: config.version,
      changeType: 'update',
      environment,
      previousValue,
      newValue: value,
      reason,
      changedBy: actor,
      changedAt: new Date(),
      approved: environment !== 'production',
    };
    config.history.push(historyEntry);

    this.emit('config_updated', { config, historyEntry });

    return config;
  }

  /**
   * Get namespaces
   */
  public getNamespaces(): ConfigNamespace[] {
    return Array.from(this.namespaces.values());
  }

  /**
   * Get secrets
   */
  public getSecrets(): Secret[] {
    return Array.from(this.secrets.values()).map((s) => ({
      ...s,
      values: Object.fromEntries(
        Object.entries(s.values).map(([env, val]) => [
          env,
          { ...val, encryptedValue: '***REDACTED***' },
        ])
      ),
    })) as Secret[];
  }

  /**
   * Get secret value (requires authentication)
   */
  public getSecretValue(key: string, environment: Environment): string | undefined {
    const secret = Array.from(this.secrets.values()).find((s) => s.key === key);
    if (!secret) return undefined;

    const envValue = secret.values[environment];
    if (!envValue) return undefined;

    // In production, this would decrypt the value
    return Buffer.from(envValue.encryptedValue, 'base64').toString();
  }

  /**
   * Get environment config
   */
  public getEnvironmentConfig(environment: Environment): EnvironmentConfig | undefined {
    return this.environments.get(environment);
  }

  /**
   * Get all environments
   */
  public getEnvironments(): EnvironmentConfig[] {
    return Array.from(this.environments.values());
  }

  /**
   * Get templates
   */
  public getTemplates(): ConfigTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get deployments
   */
  public getDeployments(environment?: Environment): ConfigDeployment[] {
    let deployments = Array.from(this.deployments.values());
    if (environment) deployments = deployments.filter((d) => d.environment === environment);
    return deployments.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  /**
   * Create deployment
   */
  public createDeployment(data: {
    name: string;
    description: string;
    environment: Environment;
    configs: { configId: string; newValue: unknown }[];
    creator: string;
  }): ConfigDeployment {
    const configChanges = data.configs.map((c) => {
      const config = this.configs.get(c.configId);
      if (!config) throw new Error(`Config ${c.configId} not found`);
      return {
        configId: c.configId,
        key: config.key,
        previousValue: config.values[data.environment]?.value,
        newValue: c.newValue,
      };
    });

    const deployment: ConfigDeployment = {
      id: `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: data.name,
      description: data.description,
      environment: data.environment,
      configs: configChanges,
      status: 'pending',
      approval: {
        required: data.environment === 'production',
        approvers: ['admin', 'tech-lead'],
      },
      rollback: {
        available: false,
      },
      metadata: {
        createdAt: new Date(),
        createdBy: data.creator,
        updatedAt: new Date(),
      },
    };

    this.deployments.set(deployment.id, deployment);
    this.emit('deployment_created', deployment);

    return deployment;
  }

  /**
   * Get snapshots
   */
  public getSnapshots(environment?: Environment): ConfigSnapshot[] {
    let snapshots = Array.from(this.snapshots.values());
    if (environment) snapshots = snapshots.filter((s) => s.environment === environment);
    return snapshots.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  /**
   * Create snapshot
   */
  public createSnapshot(data: {
    name: string;
    description: string;
    environment: Environment;
    creator: string;
  }): ConfigSnapshot {
    const configs = Array.from(this.configs.values()).map((c) => ({
      configId: c.id,
      key: c.key,
      value: c.values[data.environment]?.value,
      version: c.version,
    }));

    const snapshot: ConfigSnapshot = {
      id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: data.name,
      description: data.description,
      environment: data.environment,
      configs,
      type: 'manual',
      status: 'active',
      metadata: {
        createdAt: new Date(),
        createdBy: data.creator,
        size: JSON.stringify(configs).length,
        checksum: this.generateChecksum(),
      },
    };

    this.snapshots.set(snapshot.id, snapshot);
    this.emit('snapshot_created', snapshot);

    return snapshot;
  }

  /**
   * Compare environments
   */
  public compareEnvironments(source: Environment, target: Environment): ConfigDiff {
    const differences: ConfigDiff['differences'] = [];

    this.configs.forEach((config) => {
      const sourceValue = config.values[source]?.value ?? config.defaultValue;
      const targetValue = config.values[target]?.value ?? config.defaultValue;

      let type: ConfigDiff['differences'][0]['type'] = 'unchanged';
      if (JSON.stringify(sourceValue) !== JSON.stringify(targetValue)) {
        type = 'modified';
      }

      differences.push({
        configId: config.id,
        key: config.key,
        sourceValue,
        targetValue,
        type,
      });
    });

    const summary = {
      added: differences.filter((d) => d.type === 'added').length,
      removed: differences.filter((d) => d.type === 'removed').length,
      modified: differences.filter((d) => d.type === 'modified').length,
      unchanged: differences.filter((d) => d.type === 'unchanged').length,
    };

    return {
      id: `diff-${Date.now()}`,
      source: { environment: source },
      target: { environment: target },
      differences,
      summary,
      generatedAt: new Date(),
    };
  }

  /**
   * Validate config
   */
  public validateConfig(configId: string, value: unknown): ConfigValidationResult {
    const config = this.configs.get(configId);
    if (!config) throw new Error('Config not found');

    const errors: ConfigValidationResult['errors'] = [];
    const warnings: ConfigValidationResult['warnings'] = [];

    config.validation.rules.forEach((r) => {
      switch (r.rule) {
        case 'required':
          if (value === undefined || value === null || value === '') {
            errors.push({
              configId,
              key: config.key,
              rule: 'required',
              message: `${config.name} is required`,
            });
          }
          break;
        case 'min':
          if (typeof value === 'number' && value < (r.params as number)) {
            errors.push({
              configId,
              key: config.key,
              rule: 'min',
              message: `${config.name} must be at least ${r.params}`,
            });
          }
          break;
        case 'max':
          if (typeof value === 'number' && value > (r.params as number)) {
            errors.push({
              configId,
              key: config.key,
              rule: 'max',
              message: `${config.name} must be at most ${r.params}`,
            });
          }
          break;
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Export configs
   */
  public exportConfigs(environment: Environment, format: ConfigBundle['format']): ConfigBundle {
    const configs = Array.from(this.configs.values()).map((c) => ({
      key: c.key,
      value: c.values[environment]?.value ?? c.defaultValue,
      type: c.type,
      metadata: { category: c.category, sensitive: c.metadata.sensitive },
    }));

    return {
      id: `bundle-${Date.now()}`,
      name: `Config Export - ${environment}`,
      description: `Configuration export for ${environment} environment`,
      format,
      environment,
      configs,
      metadata: {
        version: '1.0',
        exportedAt: new Date(),
        exportedBy: 'system',
        checksum: this.generateChecksum(),
      },
    };
  }

  /**
   * Set current environment
   */
  public setCurrentEnvironment(environment: Environment): void {
    this.currentEnvironment = environment;
    this.emit('environment_changed', environment);
  }

  /**
   * Get current environment
   */
  public getCurrentEnvironment(): Environment {
    return this.currentEnvironment;
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

export const configurationManagementService = ConfigurationManagementService.getInstance();
export type {
  ConfigType,
  Environment,
  ConfigStatus,
  ConfigChangeType,
  ValidationRule,
  ConfigItem,
  ConfigHistory,
  ConfigNamespace,
  Secret,
  EnvironmentConfig,
  ConfigTemplate,
  ConfigDeployment,
  ConfigSnapshot,
  ConfigValidationResult,
  ConfigDiff,
  ConfigBundle,
};
