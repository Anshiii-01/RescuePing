/**
 * Feature Flag Service
 * Comprehensive feature flag management, targeting rules, and rollout strategies
 */

// Flag status
type FlagStatus = 'active' | 'inactive' | 'archived';

// Flag type
type FlagType = 'boolean' | 'string' | 'number' | 'json';

// Rollout strategy
type RolloutStrategy = 'all' | 'percentage' | 'targeted' | 'gradual' | 'scheduled';

// Targeting operator
type TargetingOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'in_list'
  | 'not_in_list'
  | 'regex';

// Environment
type Environment = 'development' | 'staging' | 'production';

// Feature Flag
interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  type: FlagType;
  status: FlagStatus;
  defaultValue: FlagValue;
  environments: {
    [K in Environment]: EnvironmentConfig;
  };
  tags: string[];
  owner: {
    userId: string;
    userName: string;
    email: string;
  };
  project?: string;
  prerequisites: {
    flagKey: string;
    variation: string;
  }[];
  variations: FlagVariation[];
  metrics: FlagMetrics;
  audit: FlagAuditEntry[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    archivedAt?: Date;
    version: number;
  };
}

// Flag Value
type FlagValue = boolean | string | number | Record<string, unknown>;

// Flag Variation
interface FlagVariation {
  id: string;
  name: string;
  description?: string;
  value: FlagValue;
  weight?: number;
}

// Environment Config
interface EnvironmentConfig {
  enabled: boolean;
  defaultVariation: string;
  rules: TargetingRule[];
  rollout: RolloutConfig;
  schedule?: ScheduleConfig;
  killSwitch: boolean;
  lastModified: Date;
  modifiedBy?: string;
}

// Targeting Rule
interface TargetingRule {
  id: string;
  name: string;
  description?: string;
  priority: number;
  enabled: boolean;
  conditions: RuleCondition[];
  conditionLogic: 'and' | 'or';
  variation: string;
  percentage?: number;
  bucketBy?: string;
}

// Rule Condition
interface RuleCondition {
  id: string;
  attribute: string;
  operator: TargetingOperator;
  value: unknown;
  negate?: boolean;
}

// Rollout Config
interface RolloutConfig {
  strategy: RolloutStrategy;
  percentage?: number;
  bucketBy?: string;
  gradual?: {
    startPercentage: number;
    endPercentage: number;
    incrementPercentage: number;
    intervalMinutes: number;
    currentPercentage: number;
    startedAt?: Date;
    completedAt?: Date;
  };
  segments?: string[];
}

// Schedule Config
interface ScheduleConfig {
  enabled: boolean;
  startDate?: Date;
  endDate?: Date;
  timezone: string;
  windows: {
    dayOfWeek: number[];
    startTime: string;
    endTime: string;
  }[];
}

// User Segment
interface UserSegment {
  id: string;
  key: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  rules: SegmentRule[];
  includedUsers: string[];
  excludedUsers: string[];
  estimatedSize: number;
  lastCalculated: Date;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Segment Rule
interface SegmentRule {
  id: string;
  attribute: string;
  operator: TargetingOperator;
  value: unknown;
  weight?: number;
}

// Flag Evaluation
interface FlagEvaluation {
  id: string;
  flagKey: string;
  environment: Environment;
  userId?: string;
  context: EvaluationContext;
  variation: string;
  value: FlagValue;
  reason: EvaluationReason;
  timestamp: Date;
  duration: number;
}

// Evaluation Context
interface EvaluationContext {
  userId?: string;
  email?: string;
  name?: string;
  country?: string;
  device?: string;
  platform?: string;
  version?: string;
  custom?: Record<string, unknown>;
}

// Evaluation Reason
interface EvaluationReason {
  kind: 'off' | 'fallthrough' | 'target_match' | 'rule_match' | 'prerequisite_failed' | 'error';
  ruleId?: string;
  ruleName?: string;
  prerequisiteKey?: string;
  errorKind?: string;
}

// Flag Metrics
interface FlagMetrics {
  evaluations: {
    total: number;
    last24h: number;
    last7d: number;
    byVariation: Record<string, number>;
  };
  users: {
    unique: number;
    last24h: number;
    last7d: number;
  };
  errors: {
    total: number;
    last24h: number;
    byType: Record<string, number>;
  };
  latency: {
    avg: number;
    p50: number;
    p95: number;
    p99: number;
  };
}

// Flag Audit Entry
interface FlagAuditEntry {
  id: string;
  timestamp: Date;
  action: 'created' | 'updated' | 'enabled' | 'disabled' | 'archived' | 'rule_added' | 'rule_removed' | 'rollout_changed';
  actor: {
    userId: string;
    userName: string;
  };
  environment?: Environment;
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  comment?: string;
}

// Experiment
interface Experiment {
  id: string;
  name: string;
  description: string;
  flagKey: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'cancelled';
  hypothesis: string;
  metric: {
    name: string;
    type: 'conversion' | 'numeric' | 'revenue';
    successCriteria: 'increase' | 'decrease';
    minimumEffect: number;
  };
  variations: {
    variationId: string;
    name: string;
    trafficAllocation: number;
  }[];
  audience: {
    segments: string[];
    percentage: number;
  };
  schedule: {
    startDate: Date;
    endDate?: Date;
    minimumRuntime: number;
    minimumSampleSize: number;
  };
  results?: ExperimentResults;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
  };
}

// Experiment Results
interface ExperimentResults {
  status: 'significant' | 'not_significant' | 'inconclusive';
  winningVariation?: string;
  confidence: number;
  sampleSize: number;
  variations: {
    variationId: string;
    sampleSize: number;
    conversionRate?: number;
    meanValue?: number;
    improvement?: number;
    confidenceInterval: {
      lower: number;
      upper: number;
    };
  }[];
  calculatedAt: Date;
}

// Flag Template
interface FlagTemplate {
  id: string;
  name: string;
  description: string;
  type: FlagType;
  defaultValue: FlagValue;
  variations: Omit<FlagVariation, 'id'>[];
  tags: string[];
  rules?: Omit<TargetingRule, 'id'>[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    usageCount: number;
  };
}

// Webhook
interface FlagWebhook {
  id: string;
  name: string;
  url: string;
  secret?: string;
  events: ('flag.created' | 'flag.updated' | 'flag.deleted' | 'flag.toggled' | 'experiment.started' | 'experiment.completed')[];
  environments: Environment[];
  status: 'active' | 'inactive';
  headers?: Record<string, string>;
  retryConfig: {
    maxRetries: number;
    retryInterval: number;
  };
  metadata: {
    createdAt: Date;
    lastTriggered?: Date;
    successCount: number;
    failureCount: number;
  };
}

// SDK Connection
interface SDKConnection {
  id: string;
  name: string;
  sdkType: 'server' | 'client' | 'mobile';
  environment: Environment;
  apiKey: string;
  status: 'active' | 'inactive' | 'expired';
  lastSeen?: Date;
  version?: string;
  ip?: string;
  metadata: {
    createdAt: Date;
    createdBy: string;
    expiresAt?: Date;
  };
}

// Feature Flag Statistics
interface FeatureFlagStatistics {
  overview: {
    totalFlags: number;
    activeFlags: number;
    inactiveFlags: number;
    archivedFlags: number;
  };
  usage: {
    totalEvaluations: number;
    evaluationsLast24h: number;
    evaluationsLast7d: number;
    uniqueUsers: number;
  };
  performance: {
    avgLatency: number;
    p95Latency: number;
    errorRate: number;
  };
  experiments: {
    total: number;
    running: number;
    completed: number;
    avgDuration: number;
  };
  trends: {
    date: string;
    evaluations: number;
    uniqueUsers: number;
    errors: number;
  }[];
}

class FeatureFlagService {
  private static instance: FeatureFlagService;
  private flags: Map<string, FeatureFlag> = new Map();
  private segments: Map<string, UserSegment> = new Map();
  private evaluations: Map<string, FlagEvaluation[]> = new Map();
  private experiments: Map<string, Experiment> = new Map();
  private templates: Map<string, FlagTemplate> = new Map();
  private webhooks: Map<string, FlagWebhook> = new Map();
  private connections: Map<string, SDKConnection> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize User Segments
    const segmentsData = [
      { key: 'beta-users', name: 'Beta Users', description: 'Users enrolled in beta program' },
      { key: 'premium-users', name: 'Premium Users', description: 'Users with premium subscription' },
      { key: 'internal-users', name: 'Internal Users', description: 'Company employees' },
      { key: 'power-users', name: 'Power Users', description: 'High-engagement users' },
      { key: 'new-users', name: 'New Users', description: 'Users registered in last 30 days' },
    ];

    segmentsData.forEach((s, idx) => {
      const segment: UserSegment = {
        id: `seg-${(idx + 1).toString().padStart(4, '0')}`,
        key: s.key,
        name: s.name,
        description: s.description,
        status: 'active',
        rules: [
          {
            id: `rule-${idx}-1`,
            attribute: s.key === 'internal-users' ? 'email' : s.key === 'new-users' ? 'created_at' : 'plan',
            operator: s.key === 'internal-users' ? 'ends_with' : s.key === 'new-users' ? 'greater_than' : 'equals',
            value: s.key === 'internal-users' ? '@rescueping.com' : s.key === 'new-users' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : s.key.replace('-users', ''),
          },
        ],
        includedUsers: s.key === 'beta-users' ? ['user-001', 'user-002', 'user-003'] : [],
        excludedUsers: [],
        estimatedSize: Math.floor(Math.random() * 5000) + 500,
        lastCalculated: new Date(),
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.segments.set(segment.id, segment);
    });

    // Initialize Feature Flags
    const flagsData = [
      { key: 'new-dashboard', name: 'New Dashboard', type: 'boolean', status: 'active' },
      { key: 'dark-mode', name: 'Dark Mode', type: 'boolean', status: 'active' },
      { key: 'notification-v2', name: 'Notification V2', type: 'boolean', status: 'active' },
      { key: 'max-alerts-per-page', name: 'Max Alerts Per Page', type: 'number', status: 'active' },
      { key: 'api-rate-limit', name: 'API Rate Limit', type: 'number', status: 'active' },
      { key: 'payment-provider', name: 'Payment Provider', type: 'string', status: 'active' },
      { key: 'feature-config', name: 'Feature Configuration', type: 'json', status: 'active' },
      { key: 'beta-features', name: 'Beta Features', type: 'boolean', status: 'active' },
      { key: 'maintenance-mode', name: 'Maintenance Mode', type: 'boolean', status: 'inactive' },
      { key: 'legacy-api', name: 'Legacy API', type: 'boolean', status: 'archived' },
    ];

    const usersData = [
      { name: 'John Smith', email: 'john.smith@rescueping.com' },
      { name: 'Sarah Johnson', email: 'sarah.johnson@rescueping.com' },
      { name: 'Mike Chen', email: 'mike.chen@rescueping.com' },
    ];

    flagsData.forEach((f, idx) => {
      const user = usersData[idx % usersData.length];
      
      const createEnvironmentConfig = (env: Environment, enabled: boolean): EnvironmentConfig => ({
        enabled,
        defaultVariation: 'off',
        rules: env === 'production' ? [
          {
            id: `rule-${f.key}-${env}-1`,
            name: 'Beta Users Rule',
            priority: 1,
            enabled: true,
            conditions: [
              {
                id: `cond-${f.key}-${env}-1`,
                attribute: 'segment',
                operator: 'in_list',
                value: ['beta-users', 'internal-users'],
              },
            ],
            conditionLogic: 'and',
            variation: 'on',
          },
        ] : [],
        rollout: {
          strategy: env === 'production' ? 'percentage' : 'all',
          percentage: env === 'production' ? Math.floor(Math.random() * 50) + 10 : 100,
          bucketBy: 'userId',
        },
        killSwitch: false,
        lastModified: new Date(),
        modifiedBy: user.name,
      });

      const variations: FlagVariation[] = f.type === 'boolean' ? [
        { id: 'on', name: 'On', value: true },
        { id: 'off', name: 'Off', value: false },
      ] : f.type === 'number' ? [
        { id: 'default', name: 'Default', value: f.key === 'max-alerts-per-page' ? 25 : 100 },
        { id: 'increased', name: 'Increased', value: f.key === 'max-alerts-per-page' ? 50 : 200 },
        { id: 'unlimited', name: 'Unlimited', value: -1 },
      ] : f.type === 'string' ? [
        { id: 'stripe', name: 'Stripe', value: 'stripe' },
        { id: 'paypal', name: 'PayPal', value: 'paypal' },
        { id: 'braintree', name: 'Braintree', value: 'braintree' },
      ] : [
        { id: 'default', name: 'Default Config', value: { enabled: true, settings: {} } },
        { id: 'enhanced', name: 'Enhanced Config', value: { enabled: true, settings: { enhanced: true } } },
      ];

      const flag: FeatureFlag = {
        id: `flag-${(idx + 1).toString().padStart(4, '0')}`,
        key: f.key,
        name: f.name,
        description: `Feature flag for ${f.name.toLowerCase()}`,
        type: f.type as FlagType,
        status: f.status as FlagStatus,
        defaultValue: f.type === 'boolean' ? false : f.type === 'number' ? 0 : f.type === 'string' ? '' : {},
        environments: {
          development: createEnvironmentConfig('development', true),
          staging: createEnvironmentConfig('staging', f.status === 'active'),
          production: createEnvironmentConfig('production', f.status === 'active' && idx < 5),
        },
        tags: [f.type, idx % 2 === 0 ? 'core' : 'experimental'],
        owner: {
          userId: `user-${(idx % 3 + 1).toString().padStart(4, '0')}`,
          userName: user.name,
          email: user.email,
        },
        project: 'rescueping-core',
        prerequisites: f.key === 'notification-v2' ? [{ flagKey: 'new-dashboard', variation: 'on' }] : [],
        variations,
        metrics: {
          evaluations: {
            total: Math.floor(Math.random() * 100000) + 10000,
            last24h: Math.floor(Math.random() * 5000) + 500,
            last7d: Math.floor(Math.random() * 30000) + 3000,
            byVariation: variations.reduce((acc, v) => {
              acc[v.id] = Math.floor(Math.random() * 50000) + 5000;
              return acc;
            }, {} as Record<string, number>),
          },
          users: {
            unique: Math.floor(Math.random() * 10000) + 1000,
            last24h: Math.floor(Math.random() * 1000) + 100,
            last7d: Math.floor(Math.random() * 5000) + 500,
          },
          errors: {
            total: Math.floor(Math.random() * 100) + 10,
            last24h: Math.floor(Math.random() * 10),
            byType: {
              'timeout': Math.floor(Math.random() * 20),
              'invalid_context': Math.floor(Math.random() * 30),
            },
          },
          latency: {
            avg: Math.random() * 5 + 1,
            p50: Math.random() * 3 + 0.5,
            p95: Math.random() * 10 + 5,
            p99: Math.random() * 20 + 10,
          },
        },
        audit: [
          {
            id: `audit-${f.key}-1`,
            timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            action: 'created',
            actor: { userId: user.email.split('@')[0], userName: user.name },
            comment: 'Initial creation',
          },
          {
            id: `audit-${f.key}-2`,
            timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            action: 'enabled',
            actor: { userId: user.email.split('@')[0], userName: user.name },
            environment: 'staging',
          },
        ],
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: user.name,
          updatedAt: new Date(),
          archivedAt: f.status === 'archived' ? new Date() : undefined,
          version: Math.floor(Math.random() * 10) + 1,
        },
      };
      this.flags.set(flag.id, flag);

      // Generate evaluations for each flag
      const evaluationsList: FlagEvaluation[] = [];
      for (let e = 0; e < 20; e++) {
        const evaluation: FlagEvaluation = {
          id: `eval-${flag.id}-${e}`,
          flagKey: flag.key,
          environment: ['development', 'staging', 'production'][e % 3] as Environment,
          userId: `user-${(e % 100 + 1).toString().padStart(5, '0')}`,
          context: {
            userId: `user-${(e % 100 + 1).toString().padStart(5, '0')}`,
            email: `user${e % 100 + 1}@example.com`,
            country: ['US', 'UK', 'CA', 'DE', 'JP'][e % 5],
            platform: ['web', 'ios', 'android'][e % 3],
          },
          variation: variations[e % variations.length].id,
          value: variations[e % variations.length].value,
          reason: {
            kind: e % 5 === 0 ? 'rule_match' : 'fallthrough',
            ruleId: e % 5 === 0 ? `rule-${flag.key}-production-1` : undefined,
          },
          timestamp: new Date(Date.now() - e * 60 * 60 * 1000),
          duration: Math.random() * 5 + 0.5,
        };
        evaluationsList.push(evaluation);
      }
      this.evaluations.set(flag.id, evaluationsList);
    });

    // Initialize Experiments
    const experimentsData = [
      { name: 'Dashboard Layout Test', flagKey: 'new-dashboard', status: 'running' },
      { name: 'Dark Mode Adoption', flagKey: 'dark-mode', status: 'completed' },
      { name: 'Notification Engagement', flagKey: 'notification-v2', status: 'draft' },
    ];

    experimentsData.forEach((e, idx) => {
      const flag = Array.from(this.flags.values()).find((f) => f.key === e.flagKey);
      if (!flag) return;

      const experiment: Experiment = {
        id: `exp-${(idx + 1).toString().padStart(4, '0')}`,
        name: e.name,
        description: `A/B test for ${e.name.toLowerCase()}`,
        flagKey: e.flagKey,
        status: e.status as Experiment['status'],
        hypothesis: `Enabling ${e.flagKey} will improve user engagement`,
        metric: {
          name: 'Conversion Rate',
          type: 'conversion',
          successCriteria: 'increase',
          minimumEffect: 5,
        },
        variations: flag.variations.map((v, vIdx) => ({
          variationId: v.id,
          name: v.name,
          trafficAllocation: vIdx === 0 ? 50 : 50 / (flag.variations.length - 1),
        })),
        audience: {
          segments: ['beta-users'],
          percentage: 20,
        },
        schedule: {
          startDate: new Date(Date.now() - (e.status === 'draft' ? 0 : 14) * 24 * 60 * 60 * 1000),
          endDate: e.status === 'completed' ? new Date() : undefined,
          minimumRuntime: 14,
          minimumSampleSize: 1000,
        },
        results: e.status === 'completed' ? {
          status: 'significant',
          winningVariation: 'on',
          confidence: 95,
          sampleSize: 5000,
          variations: flag.variations.map((v) => ({
            variationId: v.id,
            sampleSize: 2500,
            conversionRate: v.id === 'on' ? 0.12 : 0.08,
            improvement: v.id === 'on' ? 50 : 0,
            confidenceInterval: {
              lower: v.id === 'on' ? 0.10 : 0.06,
              upper: v.id === 'on' ? 0.14 : 0.10,
            },
          })),
          calculatedAt: new Date(),
        } : undefined,
        metadata: {
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          createdBy: usersData[idx % 3].name,
          updatedAt: new Date(),
          startedAt: e.status !== 'draft' ? new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) : undefined,
          completedAt: e.status === 'completed' ? new Date() : undefined,
        },
      };
      this.experiments.set(experiment.id, experiment);
    });

    // Initialize Templates
    const templatesData = [
      { name: 'Boolean Feature', type: 'boolean' },
      { name: 'Percentage Rollout', type: 'boolean' },
      { name: 'Multi-variant Test', type: 'string' },
    ];

    templatesData.forEach((t, idx) => {
      const template: FlagTemplate = {
        id: `tmpl-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: `Template for ${t.name.toLowerCase()} flags`,
        type: t.type as FlagType,
        defaultValue: t.type === 'boolean' ? false : '',
        variations: t.type === 'boolean' ? [
          { name: 'Enabled', value: true },
          { name: 'Disabled', value: false },
        ] : [
          { name: 'Control', value: 'control' },
          { name: 'Variant A', value: 'variant_a' },
          { name: 'Variant B', value: 'variant_b' },
        ],
        tags: ['template', t.type],
        rules: t.name === 'Percentage Rollout' ? [
          {
            name: 'Gradual Rollout',
            priority: 1,
            enabled: true,
            conditions: [],
            conditionLogic: 'and',
            variation: 'on',
            percentage: 10,
            bucketBy: 'userId',
          },
        ] : undefined,
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          usageCount: Math.floor(Math.random() * 50) + 10,
        },
      };
      this.templates.set(template.id, template);
    });

    // Initialize Webhooks
    const webhooksData = [
      { name: 'Slack Notifications', events: ['flag.toggled', 'experiment.completed'] },
      { name: 'DataDog Metrics', events: ['flag.updated', 'flag.toggled'] },
    ];

    webhooksData.forEach((w, idx) => {
      const webhook: FlagWebhook = {
        id: `hook-${(idx + 1).toString().padStart(4, '0')}`,
        name: w.name,
        url: `https://hooks.example.com/${w.name.toLowerCase().replace(' ', '-')}`,
        events: w.events as FlagWebhook['events'],
        environments: ['production'],
        status: 'active',
        retryConfig: {
          maxRetries: 3,
          retryInterval: 60,
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          lastTriggered: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          successCount: Math.floor(Math.random() * 500) + 100,
          failureCount: Math.floor(Math.random() * 10),
        },
      };
      this.webhooks.set(webhook.id, webhook);
    });

    // Initialize SDK Connections
    const connectionsData = [
      { name: 'Production API', sdkType: 'server', environment: 'production' },
      { name: 'Mobile App iOS', sdkType: 'mobile', environment: 'production' },
      { name: 'Web App', sdkType: 'client', environment: 'production' },
      { name: 'Staging Server', sdkType: 'server', environment: 'staging' },
    ];

    connectionsData.forEach((c, idx) => {
      const connection: SDKConnection = {
        id: `conn-${(idx + 1).toString().padStart(4, '0')}`,
        name: c.name,
        sdkType: c.sdkType as SDKConnection['sdkType'],
        environment: c.environment as Environment,
        apiKey: `sdk-${c.environment}-${this.generateId()}`,
        status: 'active',
        lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        version: '2.1.0',
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
        },
      };
      this.connections.set(connection.id, connection);
    });
  }

  // Flag Operations
  public getFlags(status?: FlagStatus, project?: string): FeatureFlag[] {
    let flags = Array.from(this.flags.values());
    if (status) flags = flags.filter((f) => f.status === status);
    if (project) flags = flags.filter((f) => f.project === project);
    return flags.sort((a, b) => a.name.localeCompare(b.name));
  }

  public getFlagById(id: string): FeatureFlag | undefined {
    return this.flags.get(id);
  }

  public getFlagByKey(key: string): FeatureFlag | undefined {
    return Array.from(this.flags.values()).find((f) => f.key === key);
  }

  public createFlag(data: Partial<FeatureFlag>): FeatureFlag {
    const flag: FeatureFlag = {
      id: `flag-${this.generateId()}`,
      key: data.key || '',
      name: data.name || '',
      description: data.description || '',
      type: data.type || 'boolean',
      status: 'inactive',
      defaultValue: data.defaultValue ?? false,
      environments: {
        development: { enabled: true, defaultVariation: 'off', rules: [], rollout: { strategy: 'all' }, killSwitch: false, lastModified: new Date() },
        staging: { enabled: false, defaultVariation: 'off', rules: [], rollout: { strategy: 'all' }, killSwitch: false, lastModified: new Date() },
        production: { enabled: false, defaultVariation: 'off', rules: [], rollout: { strategy: 'all' }, killSwitch: false, lastModified: new Date() },
      },
      tags: data.tags || [],
      owner: data.owner || { userId: '', userName: '', email: '' },
      prerequisites: [],
      variations: data.variations || [
        { id: 'on', name: 'On', value: true },
        { id: 'off', name: 'Off', value: false },
      ],
      metrics: {
        evaluations: { total: 0, last24h: 0, last7d: 0, byVariation: {} },
        users: { unique: 0, last24h: 0, last7d: 0 },
        errors: { total: 0, last24h: 0, byType: {} },
        latency: { avg: 0, p50: 0, p95: 0, p99: 0 },
      },
      audit: [],
      metadata: {
        createdAt: new Date(),
        createdBy: data.owner?.userName || 'system',
        updatedAt: new Date(),
        version: 1,
      },
    };

    this.flags.set(flag.id, flag);
    this.emit('flag.created', flag);
    return flag;
  }

  public toggleFlag(id: string, environment: Environment, enabled: boolean): FeatureFlag {
    const flag = this.flags.get(id);
    if (!flag) throw new Error('Flag not found');

    flag.environments[environment].enabled = enabled;
    flag.environments[environment].lastModified = new Date();
    flag.metadata.updatedAt = new Date();

    this.emit('flag.toggled', { flag, environment, enabled });
    return flag;
  }

  public updateRollout(id: string, environment: Environment, rollout: RolloutConfig): FeatureFlag {
    const flag = this.flags.get(id);
    if (!flag) throw new Error('Flag not found');

    flag.environments[environment].rollout = rollout;
    flag.environments[environment].lastModified = new Date();
    flag.metadata.updatedAt = new Date();

    this.emit('flag.updated', flag);
    return flag;
  }

  // Evaluation
  public evaluate(flagKey: string, context: EvaluationContext, environment: Environment = 'production'): FlagEvaluation {
    const flag = this.getFlagByKey(flagKey);
    if (!flag) {
      return {
        id: `eval-${this.generateId()}`,
        flagKey,
        environment,
        context,
        variation: 'off',
        value: false,
        reason: { kind: 'error', errorKind: 'FLAG_NOT_FOUND' },
        timestamp: new Date(),
        duration: 0,
      };
    }

    const envConfig = flag.environments[environment];
    const startTime = Date.now();

    let variation = envConfig.defaultVariation;
    let reason: EvaluationReason = { kind: 'fallthrough' };

    if (!envConfig.enabled || envConfig.killSwitch) {
      reason = { kind: 'off' };
    } else {
      // Check targeting rules
      for (const rule of envConfig.rules) {
        if (rule.enabled && this.evaluateRule(rule, context)) {
          variation = rule.variation;
          reason = { kind: 'rule_match', ruleId: rule.id, ruleName: rule.name };
          break;
        }
      }

      // Apply rollout if no rule matched
      if (reason.kind === 'fallthrough' && envConfig.rollout.strategy === 'percentage') {
        const bucket = this.getBucket(context.userId || '', flagKey);
        if (bucket < (envConfig.rollout.percentage || 0)) {
          variation = flag.variations.find((v) => v.value === true)?.id || variation;
        }
      }
    }

    const selectedVariation = flag.variations.find((v) => v.id === variation);

    const evaluation: FlagEvaluation = {
      id: `eval-${this.generateId()}`,
      flagKey,
      environment,
      userId: context.userId,
      context,
      variation,
      value: selectedVariation?.value ?? flag.defaultValue,
      reason,
      timestamp: new Date(),
      duration: Date.now() - startTime,
    };

    return evaluation;
  }

  private evaluateRule(rule: TargetingRule, context: EvaluationContext): boolean {
    const results = rule.conditions.map((condition) => this.evaluateCondition(condition, context));
    return rule.conditionLogic === 'and' ? results.every(Boolean) : results.some(Boolean);
  }

  private evaluateCondition(condition: RuleCondition, context: EvaluationContext): boolean {
    const value = (context as Record<string, unknown>)[condition.attribute] ?? context.custom?.[condition.attribute];
    let result = false;

    switch (condition.operator) {
      case 'equals':
        result = value === condition.value;
        break;
      case 'not_equals':
        result = value !== condition.value;
        break;
      case 'contains':
        result = String(value).includes(String(condition.value));
        break;
      case 'in_list':
        result = Array.isArray(condition.value) && condition.value.includes(value);
        break;
      default:
        result = false;
    }

    return condition.negate ? !result : result;
  }

  private getBucket(userId: string, flagKey: string): number {
    const hash = this.hashString(`${userId}-${flagKey}`);
    return hash % 100;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Segment Operations
  public getSegments(): UserSegment[] {
    return Array.from(this.segments.values());
  }

  public getSegmentById(id: string): UserSegment | undefined {
    return this.segments.get(id);
  }

  public getSegmentByKey(key: string): UserSegment | undefined {
    return Array.from(this.segments.values()).find((s) => s.key === key);
  }

  // Experiment Operations
  public getExperiments(status?: Experiment['status']): Experiment[] {
    let experiments = Array.from(this.experiments.values());
    if (status) experiments = experiments.filter((e) => e.status === status);
    return experiments.sort((a, b) => b.metadata.updatedAt.getTime() - a.metadata.updatedAt.getTime());
  }

  public getExperimentById(id: string): Experiment | undefined {
    return this.experiments.get(id);
  }

  public startExperiment(id: string): Experiment {
    const experiment = this.experiments.get(id);
    if (!experiment) throw new Error('Experiment not found');

    experiment.status = 'running';
    experiment.metadata.startedAt = new Date();
    experiment.metadata.updatedAt = new Date();

    this.emit('experiment.started', experiment);
    return experiment;
  }

  // Template Operations
  public getTemplates(): FlagTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplateById(id: string): FlagTemplate | undefined {
    return this.templates.get(id);
  }

  // Webhook Operations
  public getWebhooks(): FlagWebhook[] {
    return Array.from(this.webhooks.values());
  }

  public getWebhookById(id: string): FlagWebhook | undefined {
    return this.webhooks.get(id);
  }

  // Connection Operations
  public getConnections(): SDKConnection[] {
    return Array.from(this.connections.values());
  }

  public getConnectionById(id: string): SDKConnection | undefined {
    return this.connections.get(id);
  }

  // Statistics
  public getStatistics(): FeatureFlagStatistics {
    const flags = Array.from(this.flags.values());
    const experiments = Array.from(this.experiments.values());

    return {
      overview: {
        totalFlags: flags.length,
        activeFlags: flags.filter((f) => f.status === 'active').length,
        inactiveFlags: flags.filter((f) => f.status === 'inactive').length,
        archivedFlags: flags.filter((f) => f.status === 'archived').length,
      },
      usage: {
        totalEvaluations: flags.reduce((sum, f) => sum + f.metrics.evaluations.total, 0),
        evaluationsLast24h: flags.reduce((sum, f) => sum + f.metrics.evaluations.last24h, 0),
        evaluationsLast7d: flags.reduce((sum, f) => sum + f.metrics.evaluations.last7d, 0),
        uniqueUsers: flags.reduce((sum, f) => sum + f.metrics.users.unique, 0),
      },
      performance: {
        avgLatency: flags.reduce((sum, f) => sum + f.metrics.latency.avg, 0) / flags.length,
        p95Latency: Math.max(...flags.map((f) => f.metrics.latency.p95)),
        errorRate: flags.reduce((sum, f) => sum + f.metrics.errors.total, 0) / flags.reduce((sum, f) => sum + f.metrics.evaluations.total, 0) * 100,
      },
      experiments: {
        total: experiments.length,
        running: experiments.filter((e) => e.status === 'running').length,
        completed: experiments.filter((e) => e.status === 'completed').length,
        avgDuration: 14,
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

export const featureFlagService = FeatureFlagService.getInstance();
export type {
  FlagStatus,
  FlagType,
  RolloutStrategy,
  TargetingOperator,
  Environment,
  FeatureFlag,
  FlagValue,
  FlagVariation,
  EnvironmentConfig,
  TargetingRule,
  RuleCondition,
  RolloutConfig,
  ScheduleConfig,
  UserSegment,
  SegmentRule,
  FlagEvaluation,
  EvaluationContext,
  EvaluationReason,
  FlagMetrics,
  FlagAuditEntry,
  Experiment,
  ExperimentResults,
  FlagTemplate,
  FlagWebhook,
  SDKConnection,
  FeatureFlagStatistics,
};
