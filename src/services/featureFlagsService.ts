/**
 * Feature Flags Service
 * Feature toggles, gradual rollouts, and A/B testing management
 */

// Flag status
type FlagStatus = 'active' | 'inactive' | 'archived';

// Flag type
type FlagType = 'boolean' | 'string' | 'number' | 'json';

// Rollout strategy
type RolloutStrategy = 'all' | 'percentage' | 'user_ids' | 'user_attributes' | 'segment' | 'gradual' | 'scheduled';

// Evaluation result
type EvaluationResult = { enabled: boolean; value: unknown; reason: string; variant?: string };

// Feature flag
interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  type: FlagType;
  status: FlagStatus;
  defaultValue: unknown;
  variants: FlagVariant[];
  rolloutRules: RolloutRule[];
  targeting: TargetingRule[];
  prerequisites: Prerequisite[];
  schedules: Schedule[];
  metadata: {
    owner: string;
    team: string;
    tags: string[];
    jiraTicket?: string;
    documentationUrl?: string;
  };
  audit: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    enabledAt?: Date;
    disabledAt?: Date;
  };
  analytics: {
    trackEvents: boolean;
    trackExposures: boolean;
  };
  staleAfterDays?: number;
  permanent: boolean;
}

// Flag variant
interface FlagVariant {
  id: string;
  name: string;
  value: unknown;
  weight: number;
  description?: string;
}

// Rollout rule
interface RolloutRule {
  id: string;
  name: string;
  strategy: RolloutStrategy;
  percentage?: number;
  userIds?: string[];
  segmentIds?: string[];
  attributeConditions?: AttributeCondition[];
  variant?: string;
  enabled: boolean;
  priority: number;
}

// Attribute condition
interface AttributeCondition {
  attribute: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'in' | 'not_in' | 'greater_than' | 'less_than' | 'regex' | 'semver_equals' | 'semver_greater' | 'semver_less';
  value: unknown;
  negate?: boolean;
}

// Targeting rule
interface TargetingRule {
  id: string;
  name: string;
  conditions: AttributeCondition[];
  variant: string;
  percentage: number;
  enabled: boolean;
  priority: number;
}

// Prerequisite
interface Prerequisite {
  flagKey: string;
  expectedValue: unknown;
}

// Schedule
interface Schedule {
  id: string;
  name: string;
  action: 'enable' | 'disable' | 'set_percentage' | 'set_variant';
  value?: unknown;
  startTime: Date;
  endTime?: Date;
  timezone: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    daysOfMonth?: number[];
  };
  executed: boolean;
}

// User segment
interface UserSegment {
  id: string;
  key: string;
  name: string;
  description: string;
  rules: {
    operator: 'and' | 'or';
    conditions: AttributeCondition[];
  };
  includedUserIds: string[];
  excludedUserIds: string[];
  estimatedSize: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Evaluation context
interface EvaluationContext {
  userId?: string;
  sessionId?: string;
  anonymousId?: string;
  attributes: Record<string, unknown>;
  groups?: Record<string, string>;
  ip?: string;
  userAgent?: string;
}

// Flag evaluation log
interface EvaluationLog {
  id: string;
  flagKey: string;
  timestamp: Date;
  context: EvaluationContext;
  result: EvaluationResult;
  matchedRule?: string;
  latency: number;
}

// A/B experiment
interface ABExperiment {
  id: string;
  key: string;
  name: string;
  description: string;
  hypothesis: string;
  flagKey: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'cancelled';
  variants: {
    name: string;
    value: unknown;
    weight: number;
    isControl: boolean;
  }[];
  targetingRules: TargetingRule[];
  metrics: {
    name: string;
    type: 'conversion' | 'count' | 'revenue' | 'duration';
    eventName: string;
    isPrimary: boolean;
    minimumSampleSize?: number;
  }[];
  results?: {
    variant: string;
    sampleSize: number;
    conversionRate: number;
    confidence: number;
    improvement?: number;
    isWinner?: boolean;
  }[];
  traffic: number;
  startDate?: Date;
  endDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Flag change history
interface FlagChange {
  id: string;
  flagKey: string;
  timestamp: Date;
  userId: string;
  action: 'created' | 'updated' | 'enabled' | 'disabled' | 'archived' | 'rollout_changed' | 'variant_added' | 'variant_removed';
  changes: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  comment?: string;
}

// Flag metrics
interface FlagMetrics {
  flagKey: string;
  period: { start: Date; end: Date };
  evaluations: {
    total: number;
    enabled: number;
    disabled: number;
    byVariant: Record<string, number>;
  };
  uniqueUsers: number;
  latency: {
    p50: number;
    p95: number;
    p99: number;
    avg: number;
  };
  errorRate: number;
}

// Environment
interface Environment {
  id: string;
  key: string;
  name: string;
  description: string;
  color: string;
  isProduction: boolean;
  requiresApproval: boolean;
  apiKey: string;
  sdkKey: string;
  mobileKey: string;
  createdAt: Date;
}

// Override
interface FlagOverride {
  id: string;
  flagKey: string;
  userId?: string;
  segmentId?: string;
  environment: string;
  value: unknown;
  enabled: boolean;
  expiresAt?: Date;
  createdBy: string;
  createdAt: Date;
}

class FeatureFlagsService {
  private static instance: FeatureFlagsService;
  private flags: Map<string, FeatureFlag> = new Map();
  private segments: Map<string, UserSegment> = new Map();
  private experiments: Map<string, ABExperiment> = new Map();
  private environments: Map<string, Environment> = new Map();
  private overrides: Map<string, FlagOverride> = new Map();
  private history: FlagChange[] = [];
  private evaluationLogs: EvaluationLog[] = [];
  private metrics: Map<string, FlagMetrics> = new Map();
  private currentEnvironment: string = 'production';
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): FeatureFlagsService {
    if (!FeatureFlagsService.instance) {
      FeatureFlagsService.instance = new FeatureFlagsService();
    }
    return FeatureFlagsService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize environments
    const envData = [
      { key: 'development', name: 'Development', color: '#4CAF50', isProduction: false, requiresApproval: false },
      { key: 'staging', name: 'Staging', color: '#FF9800', isProduction: false, requiresApproval: false },
      { key: 'production', name: 'Production', color: '#F44336', isProduction: true, requiresApproval: true },
    ];

    envData.forEach((e, index) => {
      const env: Environment = {
        id: `env-${(index + 1).toString().padStart(4, '0')}`,
        ...e,
        description: `${e.name} environment`,
        apiKey: `api-${e.key}-${Math.random().toString(36).substr(2, 16)}`,
        sdkKey: `sdk-${e.key}-${Math.random().toString(36).substr(2, 16)}`,
        mobileKey: `mob-${e.key}-${Math.random().toString(36).substr(2, 16)}`,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      };
      this.environments.set(env.key, env);
    });

    // Initialize user segments
    const segmentsData = [
      { key: 'beta_users', name: 'Beta Users', description: 'Users who opted into beta features', rules: { operator: 'and' as const, conditions: [{ attribute: 'isBetaUser', operator: 'equals' as const, value: true }] } },
      { key: 'premium_users', name: 'Premium Users', description: 'Users with premium subscription', rules: { operator: 'and' as const, conditions: [{ attribute: 'subscriptionTier', operator: 'equals' as const, value: 'premium' }] } },
      { key: 'internal_users', name: 'Internal Users', description: 'Rescue Ping employees', rules: { operator: 'and' as const, conditions: [{ attribute: 'email', operator: 'ends_with' as const, value: '@rescueping.com' }] } },
      { key: 'mobile_users', name: 'Mobile Users', description: 'Users on mobile devices', rules: { operator: 'and' as const, conditions: [{ attribute: 'platform', operator: 'in' as const, value: ['ios', 'android'] }] } },
      { key: 'govt_agencies', name: 'Government Agencies', description: 'Government agency accounts', rules: { operator: 'and' as const, conditions: [{ attribute: 'accountType', operator: 'equals' as const, value: 'government' }] } },
    ];

    segmentsData.forEach((s, index) => {
      const segment: UserSegment = {
        id: `segment-${(index + 1).toString().padStart(4, '0')}`,
        key: s.key,
        name: s.name,
        description: s.description,
        rules: s.rules,
        includedUserIds: [],
        excludedUserIds: [],
        estimatedSize: Math.floor(Math.random() * 5000) + 500,
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.segments.set(segment.key, segment);
    });

    // Initialize feature flags
    const flagsData = [
      { key: 'new_alert_ui', name: 'New Alert UI', description: 'Redesigned alert notification interface', type: 'boolean' as FlagType, defaultValue: false, status: 'active' as FlagStatus },
      { key: 'real_time_tracking', name: 'Real-time Tracking', description: 'Enable real-time location tracking for volunteers', type: 'boolean' as FlagType, defaultValue: false, status: 'active' as FlagStatus },
      { key: 'ai_disaster_prediction', name: 'AI Disaster Prediction', description: 'AI-powered disaster prediction system', type: 'boolean' as FlagType, defaultValue: false, status: 'active' as FlagStatus },
      { key: 'multi_language_support', name: 'Multi-language Support', description: 'Enable support for multiple Indian languages', type: 'boolean' as FlagType, defaultValue: true, status: 'active' as FlagStatus },
      { key: 'donation_upi', name: 'UPI Donations', description: 'Enable UPI payment method for donations', type: 'boolean' as FlagType, defaultValue: true, status: 'active' as FlagStatus },
      { key: 'shelter_capacity_threshold', name: 'Shelter Capacity Alert Threshold', description: 'Percentage threshold for shelter capacity alerts', type: 'number' as FlagType, defaultValue: 80, status: 'active' as FlagStatus },
      { key: 'alert_sound_type', name: 'Alert Sound Type', description: 'Type of sound for emergency alerts', type: 'string' as FlagType, defaultValue: 'siren', status: 'active' as FlagStatus },
      { key: 'map_provider', name: 'Map Provider', description: 'Map service provider configuration', type: 'json' as FlagType, defaultValue: { provider: 'google', apiKey: 'default' }, status: 'active' as FlagStatus },
      { key: 'offline_mode_v2', name: 'Offline Mode V2', description: 'Enhanced offline capabilities', type: 'boolean' as FlagType, defaultValue: false, status: 'active' as FlagStatus },
      { key: 'sos_quick_dial', name: 'SOS Quick Dial', description: 'Quick dial emergency contacts feature', type: 'boolean' as FlagType, defaultValue: true, status: 'active' as FlagStatus },
      { key: 'volunteer_gamification', name: 'Volunteer Gamification', description: 'Gamification features for volunteers', type: 'boolean' as FlagType, defaultValue: false, status: 'active' as FlagStatus },
      { key: 'legacy_api', name: 'Legacy API', description: 'Support for legacy API endpoints', type: 'boolean' as FlagType, defaultValue: true, status: 'active' as FlagStatus },
      { key: 'dark_mode', name: 'Dark Mode', description: 'Dark mode theme support', type: 'boolean' as FlagType, defaultValue: true, status: 'active' as FlagStatus },
      { key: 'push_notification_v2', name: 'Push Notifications V2', description: 'New push notification system', type: 'boolean' as FlagType, defaultValue: false, status: 'active' as FlagStatus },
      { key: 'biometric_auth', name: 'Biometric Authentication', description: 'Biometric login support', type: 'boolean' as FlagType, defaultValue: false, status: 'active' as FlagStatus },
    ];

    flagsData.forEach((f, index) => {
      const flag: FeatureFlag = {
        id: `flag-${(index + 1).toString().padStart(6, '0')}`,
        key: f.key,
        name: f.name,
        description: f.description,
        type: f.type,
        status: f.status,
        defaultValue: f.defaultValue,
        variants: f.type === 'boolean' ? [
          { id: 'v-on', name: 'On', value: true, weight: 50 },
          { id: 'v-off', name: 'Off', value: false, weight: 50 },
        ] : [],
        rolloutRules: [
          {
            id: `rule-${index}-1`,
            name: 'Beta Users',
            strategy: 'segment',
            segmentIds: ['beta_users'],
            enabled: true,
            priority: 1,
          },
          {
            id: `rule-${index}-2`,
            name: 'Percentage Rollout',
            strategy: 'percentage',
            percentage: Math.floor(Math.random() * 50) + 10,
            enabled: true,
            priority: 2,
          },
        ],
        targeting: [],
        prerequisites: [],
        schedules: [],
        metadata: {
          owner: 'product-team',
          team: ['alerts', 'donations', 'shelters', 'volunteers'][index % 4],
          tags: ['feature', f.type],
        },
        audit: {
          createdBy: 'admin',
          createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
          updatedBy: 'admin',
          updatedAt: new Date(),
          enabledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
        analytics: {
          trackEvents: true,
          trackExposures: true,
        },
        permanent: f.key === 'legacy_api',
      };
      this.flags.set(flag.key, flag);
    });

    // Initialize A/B experiments
    const experimentsData = [
      {
        key: 'alert_button_color',
        name: 'Alert Button Color Test',
        description: 'Testing different colors for the emergency alert button',
        hypothesis: 'A red alert button will increase click-through rate',
        flagKey: 'new_alert_ui',
        variants: [
          { name: 'Control', value: 'orange', weight: 50, isControl: true },
          { name: 'Variant A', value: 'red', weight: 25, isControl: false },
          { name: 'Variant B', value: 'purple', weight: 25, isControl: false },
        ],
        status: 'running' as const,
      },
      {
        key: 'donation_flow',
        name: 'Donation Flow Optimization',
        description: 'Testing simplified donation flow',
        hypothesis: 'Fewer steps will increase donation completion rate',
        flagKey: 'donation_upi',
        variants: [
          { name: 'Control', value: 'multi_step', weight: 50, isControl: true },
          { name: 'Single Page', value: 'single_page', weight: 50, isControl: false },
        ],
        status: 'running' as const,
      },
    ];

    experimentsData.forEach((e, index) => {
      const experiment: ABExperiment = {
        id: `exp-${(index + 1).toString().padStart(6, '0')}`,
        key: e.key,
        name: e.name,
        description: e.description,
        hypothesis: e.hypothesis,
        flagKey: e.flagKey,
        status: e.status,
        variants: e.variants,
        targetingRules: [],
        metrics: [
          { name: 'Click Rate', type: 'conversion', eventName: 'button_click', isPrimary: true, minimumSampleSize: 1000 },
          { name: 'Completion Rate', type: 'conversion', eventName: 'flow_complete', isPrimary: false },
        ],
        results: e.status === 'running' ? e.variants.map((v) => ({
          variant: v.name,
          sampleSize: Math.floor(Math.random() * 5000) + 1000,
          conversionRate: Math.random() * 20 + 5,
          confidence: Math.random() * 30 + 70,
          improvement: v.isControl ? undefined : (Math.random() * 20 - 10),
        })) : undefined,
        traffic: 100,
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        createdBy: 'product-team',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.experiments.set(experiment.key, experiment);
    });

    // Initialize flag metrics
    for (const flag of this.flags.values()) {
      const metrics: FlagMetrics = {
        flagKey: flag.key,
        period: { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date() },
        evaluations: {
          total: Math.floor(Math.random() * 100000) + 10000,
          enabled: Math.floor(Math.random() * 50000) + 5000,
          disabled: Math.floor(Math.random() * 50000) + 5000,
          byVariant: { 'On': Math.floor(Math.random() * 50000), 'Off': Math.floor(Math.random() * 50000) },
        },
        uniqueUsers: Math.floor(Math.random() * 10000) + 1000,
        latency: {
          p50: Math.random() * 5 + 1,
          p95: Math.random() * 15 + 5,
          p99: Math.random() * 30 + 10,
          avg: Math.random() * 8 + 2,
        },
        errorRate: Math.random() * 0.5,
      };
      this.metrics.set(flag.key, metrics);
    }

    // Initialize change history
    const actions: FlagChange['action'][] = ['created', 'updated', 'enabled', 'disabled', 'rollout_changed'];
    for (let i = 0; i < 50; i++) {
      const flag = Array.from(this.flags.values())[i % this.flags.size];
      const change: FlagChange = {
        id: `change-${(i + 1).toString().padStart(8, '0')}`,
        flagKey: flag.key,
        timestamp: new Date(Date.now() - i * 12 * 60 * 60 * 1000),
        userId: ['admin', 'product-1', 'engineer-1'][i % 3],
        action: actions[i % actions.length],
        changes: [{
          field: 'status',
          oldValue: 'inactive',
          newValue: 'active',
        }],
        comment: i % 3 === 0 ? 'Enabling for beta testing' : undefined,
      };
      this.history.push(change);
    }
  }

  /**
   * Evaluate flag
   */
  public evaluate(flagKey: string, context: EvaluationContext): EvaluationResult {
    const startTime = Date.now();
    const flag = this.flags.get(flagKey);

    if (!flag) {
      return { enabled: false, value: null, reason: 'FLAG_NOT_FOUND' };
    }

    if (flag.status !== 'active') {
      return { enabled: false, value: flag.defaultValue, reason: 'FLAG_INACTIVE' };
    }

    // Check overrides
    const override = this.getOverride(flagKey, context);
    if (override) {
      return { enabled: override.enabled, value: override.value, reason: 'OVERRIDE' };
    }

    // Check prerequisites
    for (const prereq of flag.prerequisites) {
      const prereqResult = this.evaluate(prereq.flagKey, context);
      if (prereqResult.value !== prereq.expectedValue) {
        return { enabled: false, value: flag.defaultValue, reason: 'PREREQUISITE_NOT_MET' };
      }
    }

    // Check targeting rules
    for (const rule of flag.targeting.sort((a, b) => a.priority - b.priority)) {
      if (!rule.enabled) continue;

      if (this.matchesConditions(context, rule.conditions)) {
        const variant = flag.variants.find((v) => v.name === rule.variant);
        const value = variant?.value ?? flag.defaultValue;
        const enabled = flag.type === 'boolean' ? Boolean(value) : true;

        this.logEvaluation(flagKey, context, { enabled, value, reason: 'TARGETING_MATCH', variant: rule.variant }, startTime);
        return { enabled, value, reason: 'TARGETING_MATCH', variant: rule.variant };
      }
    }

    // Check rollout rules
    for (const rule of flag.rolloutRules.sort((a, b) => a.priority - b.priority)) {
      if (!rule.enabled) continue;

      let matches = false;

      switch (rule.strategy) {
        case 'all':
          matches = true;
          break;

        case 'percentage':
          matches = this.isInPercentage(context.userId || context.anonymousId || '', flagKey, rule.percentage!);
          break;

        case 'user_ids':
          matches = rule.userIds?.includes(context.userId || '') ?? false;
          break;

        case 'segment':
          if (rule.segmentIds) {
            for (const segmentId of rule.segmentIds) {
              if (this.isInSegment(context, segmentId)) {
                matches = true;
                break;
              }
            }
          }
          break;

        case 'user_attributes':
          if (rule.attributeConditions) {
            matches = this.matchesConditions(context, rule.attributeConditions);
          }
          break;
      }

      if (matches) {
        const variant = rule.variant ? flag.variants.find((v) => v.name === rule.variant) : flag.variants[0];
        const value = variant?.value ?? flag.defaultValue;
        const enabled = flag.type === 'boolean' ? Boolean(value) : true;

        this.logEvaluation(flagKey, context, { enabled, value, reason: 'ROLLOUT_MATCH', variant: variant?.name }, startTime);
        return { enabled, value, reason: 'ROLLOUT_MATCH', variant: variant?.name };
      }
    }

    // Default
    const result: EvaluationResult = {
      enabled: flag.type === 'boolean' ? Boolean(flag.defaultValue) : false,
      value: flag.defaultValue,
      reason: 'DEFAULT',
    };

    this.logEvaluation(flagKey, context, result, startTime);
    return result;
  }

  /**
   * Check if context is in percentage
   */
  private isInPercentage(identifier: string, flagKey: string, percentage: number): boolean {
    const hash = this.hashString(`${identifier}-${flagKey}`);
    const bucket = hash % 100;
    return bucket < percentage;
  }

  /**
   * Simple hash function
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Check if context matches conditions
   */
  private matchesConditions(context: EvaluationContext, conditions: AttributeCondition[]): boolean {
    return conditions.every((condition) => {
      const attributeValue = context.attributes[condition.attribute];
      let matches = false;

      switch (condition.operator) {
        case 'equals':
          matches = attributeValue === condition.value;
          break;
        case 'not_equals':
          matches = attributeValue !== condition.value;
          break;
        case 'contains':
          matches = String(attributeValue).includes(String(condition.value));
          break;
        case 'not_contains':
          matches = !String(attributeValue).includes(String(condition.value));
          break;
        case 'starts_with':
          matches = String(attributeValue).startsWith(String(condition.value));
          break;
        case 'ends_with':
          matches = String(attributeValue).endsWith(String(condition.value));
          break;
        case 'in':
          matches = Array.isArray(condition.value) && condition.value.includes(attributeValue);
          break;
        case 'not_in':
          matches = Array.isArray(condition.value) && !condition.value.includes(attributeValue);
          break;
        case 'greater_than':
          matches = Number(attributeValue) > Number(condition.value);
          break;
        case 'less_than':
          matches = Number(attributeValue) < Number(condition.value);
          break;
        case 'regex':
          matches = new RegExp(String(condition.value)).test(String(attributeValue));
          break;
      }

      return condition.negate ? !matches : matches;
    });
  }

  /**
   * Check if context is in segment
   */
  private isInSegment(context: EvaluationContext, segmentKey: string): boolean {
    const segment = this.segments.get(segmentKey);
    if (!segment) return false;

    // Check excluded users
    if (context.userId && segment.excludedUserIds.includes(context.userId)) {
      return false;
    }

    // Check included users
    if (context.userId && segment.includedUserIds.includes(context.userId)) {
      return true;
    }

    // Check rules
    const conditions = segment.rules.conditions;
    if (segment.rules.operator === 'and') {
      return this.matchesConditions(context, conditions);
    } else {
      return conditions.some((c) => this.matchesConditions(context, [c]));
    }
  }

  /**
   * Get override
   */
  private getOverride(flagKey: string, context: EvaluationContext): FlagOverride | undefined {
    return Array.from(this.overrides.values()).find((o) =>
      o.flagKey === flagKey &&
      o.environment === this.currentEnvironment &&
      o.enabled &&
      (!o.expiresAt || o.expiresAt > new Date()) &&
      (o.userId === context.userId || (o.segmentId && this.isInSegment(context, o.segmentId)))
    );
  }

  /**
   * Log evaluation
   */
  private logEvaluation(flagKey: string, context: EvaluationContext, result: EvaluationResult, startTime: number): void {
    const log: EvaluationLog = {
      id: `eval-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      flagKey,
      timestamp: new Date(),
      context,
      result,
      latency: Date.now() - startTime,
    };

    this.evaluationLogs.push(log);

    // Keep only recent logs
    if (this.evaluationLogs.length > 10000) {
      this.evaluationLogs = this.evaluationLogs.slice(-5000);
    }

    this.emit('evaluation', log);
  }

  /**
   * Get flag
   */
  public getFlag(key: string): FeatureFlag | undefined {
    return this.flags.get(key);
  }

  /**
   * Get all flags
   */
  public getFlags(filter?: { status?: FlagStatus; team?: string; tag?: string }): FeatureFlag[] {
    let flags = Array.from(this.flags.values());

    if (filter?.status) flags = flags.filter((f) => f.status === filter.status);
    if (filter?.team) flags = flags.filter((f) => f.metadata.team === filter.team);
    if (filter?.tag) flags = flags.filter((f) => f.metadata.tags.includes(filter.tag!));

    return flags.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Create flag
   */
  public createFlag(data: {
    key: string;
    name: string;
    description: string;
    type: FlagType;
    defaultValue: unknown;
    createdBy: string;
  }): FeatureFlag {
    if (this.flags.has(data.key)) {
      throw new Error('Flag key already exists');
    }

    const flag: FeatureFlag = {
      id: `flag-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      key: data.key,
      name: data.name,
      description: data.description,
      type: data.type,
      status: 'inactive',
      defaultValue: data.defaultValue,
      variants: data.type === 'boolean' ? [
        { id: 'v-on', name: 'On', value: true, weight: 50 },
        { id: 'v-off', name: 'Off', value: false, weight: 50 },
      ] : [],
      rolloutRules: [],
      targeting: [],
      prerequisites: [],
      schedules: [],
      metadata: {
        owner: data.createdBy,
        team: 'default',
        tags: [],
      },
      audit: {
        createdBy: data.createdBy,
        createdAt: new Date(),
        updatedBy: data.createdBy,
        updatedAt: new Date(),
      },
      analytics: {
        trackEvents: true,
        trackExposures: true,
      },
      permanent: false,
    };

    this.flags.set(flag.key, flag);
    this.recordChange(flag.key, data.createdBy, 'created', []);

    this.emit('flag_created', flag);
    return flag;
  }

  /**
   * Update flag status
   */
  public updateFlagStatus(key: string, status: FlagStatus, userId: string): FeatureFlag {
    const flag = this.flags.get(key);
    if (!flag) throw new Error('Flag not found');

    const oldStatus = flag.status;
    flag.status = status;
    flag.audit.updatedBy = userId;
    flag.audit.updatedAt = new Date();

    if (status === 'active' && oldStatus !== 'active') {
      flag.audit.enabledAt = new Date();
    } else if (status !== 'active' && oldStatus === 'active') {
      flag.audit.disabledAt = new Date();
    }

    this.recordChange(key, userId, status === 'active' ? 'enabled' : 'disabled', [
      { field: 'status', oldValue: oldStatus, newValue: status },
    ]);

    this.emit('flag_updated', flag);
    return flag;
  }

  /**
   * Record change
   */
  private recordChange(flagKey: string, userId: string, action: FlagChange['action'], changes: FlagChange['changes'], comment?: string): void {
    const change: FlagChange = {
      id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      flagKey,
      timestamp: new Date(),
      userId,
      action,
      changes,
      comment,
    };

    this.history.unshift(change);

    // Keep only recent history
    if (this.history.length > 1000) {
      this.history = this.history.slice(0, 500);
    }
  }

  /**
   * Get segments
   */
  public getSegments(): UserSegment[] {
    return Array.from(this.segments.values());
  }

  /**
   * Get segment
   */
  public getSegment(key: string): UserSegment | undefined {
    return this.segments.get(key);
  }

  /**
   * Get experiments
   */
  public getExperiments(status?: ABExperiment['status']): ABExperiment[] {
    let experiments = Array.from(this.experiments.values());
    if (status) {
      experiments = experiments.filter((e) => e.status === status);
    }
    return experiments.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Get experiment
   */
  public getExperiment(key: string): ABExperiment | undefined {
    return this.experiments.get(key);
  }

  /**
   * Get environments
   */
  public getEnvironments(): Environment[] {
    return Array.from(this.environments.values());
  }

  /**
   * Set current environment
   */
  public setEnvironment(key: string): void {
    if (!this.environments.has(key)) {
      throw new Error('Environment not found');
    }
    this.currentEnvironment = key;
    this.emit('environment_changed', { environment: key });
  }

  /**
   * Get flag history
   */
  public getFlagHistory(flagKey?: string, limit: number = 50): FlagChange[] {
    let history = [...this.history];
    if (flagKey) {
      history = history.filter((h) => h.flagKey === flagKey);
    }
    return history.slice(0, limit);
  }

  /**
   * Get flag metrics
   */
  public getFlagMetrics(flagKey: string): FlagMetrics | undefined {
    return this.metrics.get(flagKey);
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

export const featureFlagsService = FeatureFlagsService.getInstance();
export type {
  FlagStatus,
  FlagType,
  RolloutStrategy,
  EvaluationResult,
  FeatureFlag,
  FlagVariant,
  RolloutRule,
  AttributeCondition,
  TargetingRule,
  Prerequisite,
  Schedule,
  UserSegment,
  EvaluationContext,
  EvaluationLog,
  ABExperiment,
  FlagChange,
  FlagMetrics,
  Environment,
  FlagOverride,
};
