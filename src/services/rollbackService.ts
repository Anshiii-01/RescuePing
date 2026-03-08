/**
 * Rollback Management Service
 * Comprehensive rollback orchestration, version control, and recovery management
 */

// Rollback Status
type RollbackStatus = 'pending' | 'preparing' | 'executing' | 'verifying' | 'completed' | 'failed' | 'cancelled';

// Rollback Type
type RollbackType = 'full' | 'partial' | 'selective' | 'emergency' | 'scheduled';

// Rollback Scope
type RollbackScope = 'application' | 'service' | 'configuration' | 'database' | 'infrastructure';

// Trigger Type
type TriggerType = 'manual' | 'automatic' | 'scheduled' | 'alert' | 'policy';

// Recovery Strategy
type RecoveryStrategy = 'instant' | 'gradual' | 'staged' | 'blue-green' | 'canary';

// Rollback Operation
interface RollbackOperation {
  id: string;
  name: string;
  description: string;
  type: RollbackType;
  scope: RollbackScope;
  status: RollbackStatus;
  trigger: RollbackTrigger;
  source: RollbackSource;
  target: RollbackTarget;
  strategy: RollbackStrategy;
  steps: RollbackStep[];
  currentStep: number;
  validation: RollbackValidation;
  impact: ImpactAssessment;
  notifications: RollbackNotification[];
  audit: AuditEntry[];
  metrics: RollbackMetrics;
  tags: string[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
    approvedBy?: string;
    approvedAt?: Date;
  };
}

// Rollback Trigger
interface RollbackTrigger {
  type: TriggerType;
  source: string;
  reason: string;
  alert?: {
    id: string;
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    metric?: string;
    threshold?: number;
    value?: number;
  };
  policy?: {
    id: string;
    name: string;
    condition: string;
  };
  timestamp: Date;
  actor?: {
    type: 'user' | 'system' | 'automation';
    id: string;
    name: string;
  };
}

// Rollback Source
interface RollbackSource {
  type: 'deployment' | 'snapshot' | 'backup' | 'version' | 'commit';
  id: string;
  version: string;
  environment: string;
  timestamp: Date;
  artifacts: SourceArtifact[];
  configuration?: Record<string, unknown>;
}

// Source Artifact
interface SourceArtifact {
  type: 'container' | 'binary' | 'config' | 'database' | 'state';
  name: string;
  version: string;
  location: string;
  checksum: string;
  size: number;
}

// Rollback Target
interface RollbackTarget {
  type: 'deployment' | 'service' | 'configuration' | 'database';
  id: string;
  name: string;
  environment: string;
  currentVersion: string;
  targetVersion: string;
  instances: TargetInstance[];
  dependencies: TargetDependency[];
}

// Target Instance
interface TargetInstance {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'rolling_back' | 'rolled_back' | 'failed';
  currentVersion: string;
  targetVersion: string;
  ip?: string;
  node?: string;
}

// Target Dependency
interface TargetDependency {
  type: 'upstream' | 'downstream' | 'database' | 'cache' | 'queue';
  name: string;
  version: string;
  compatible: boolean;
  requiresRollback: boolean;
}

// Rollback Strategy
interface RollbackStrategy {
  type: RecoveryStrategy;
  batchSize: number | 'all';
  batchDelay: number;
  parallelism: number;
  healthCheckInterval: number;
  healthCheckTimeout: number;
  failureThreshold: number;
  rollbackOnFailure: boolean;
  preserveConnections: boolean;
  drainTimeout: number;
  warmupTime: number;
}

// Rollback Step
interface RollbackStep {
  id: string;
  name: string;
  type: 'prepare' | 'backup' | 'drain' | 'stop' | 'restore' | 'start' | 'verify' | 'cleanup' | 'notify';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  order: number;
  configuration: StepConfiguration;
  timeout: number;
  retries: number;
  retriesLeft: number;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  error?: string;
  output?: Record<string, unknown>;
}

// Step Configuration
interface StepConfiguration {
  action: string;
  targets?: string[];
  params?: Record<string, unknown>;
  conditions?: StepCondition[];
  hooks?: StepHook[];
}

// Step Condition
interface StepCondition {
  type: 'previous_success' | 'health_check' | 'metric' | 'custom';
  value?: unknown;
  operator?: string;
  threshold?: number;
}

// Step Hook
interface StepHook {
  type: 'pre' | 'post';
  action: 'webhook' | 'script' | 'command';
  target: string;
  timeout: number;
  continueOnFailure: boolean;
}

// Rollback Validation
interface RollbackValidation {
  enabled: boolean;
  stages: ValidationStage[];
  parallelValidation: boolean;
  failFast: boolean;
  timeout: number;
}

// Validation Stage
interface ValidationStage {
  id: string;
  name: string;
  order: number;
  checks: ValidationCheck[];
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  required: boolean;
  timeout: number;
  startedAt?: Date;
  completedAt?: Date;
}

// Validation Check
interface ValidationCheck {
  id: string;
  name: string;
  type: 'health' | 'endpoint' | 'metric' | 'functional' | 'performance' | 'data' | 'custom';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  configuration: {
    endpoint?: string;
    method?: string;
    expectedStatus?: number;
    expectedResponse?: unknown;
    metric?: string;
    threshold?: number;
    query?: string;
    script?: string;
  };
  timeout: number;
  retries: number;
  result?: {
    success: boolean;
    message: string;
    duration: number;
    details?: Record<string, unknown>;
  };
}

// Impact Assessment
interface ImpactAssessment {
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedServices: AffectedService[];
  affectedUsers: number;
  estimatedDowntime: number;
  dataLoss: 'none' | 'minimal' | 'partial' | 'significant';
  risks: RiskItem[];
  mitigations: MitigationItem[];
}

// Affected Service
interface AffectedService {
  name: string;
  type: 'direct' | 'indirect' | 'downstream';
  impact: 'none' | 'degraded' | 'unavailable';
  estimatedRecovery: number;
}

// Risk Item
interface RiskItem {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: string;
  mitigation?: string;
}

// Mitigation Item
interface MitigationItem {
  id: string;
  risk: string;
  action: string;
  responsible: string;
  status: 'pending' | 'in_progress' | 'completed';
}

// Rollback Notification
interface RollbackNotification {
  id: string;
  type: 'started' | 'step_completed' | 'validation_passed' | 'validation_failed' | 'completed' | 'failed' | 'cancelled';
  channels: NotificationChannel[];
  recipients: string[];
  template: string;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
}

// Notification Channel
interface NotificationChannel {
  type: 'email' | 'slack' | 'pagerduty' | 'webhook' | 'sms';
  target: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

// Audit Entry
interface AuditEntry {
  id: string;
  timestamp: Date;
  action: string;
  actor: {
    type: 'user' | 'system' | 'automation';
    id: string;
    name: string;
  };
  details: Record<string, unknown>;
  result: 'success' | 'failure';
  error?: string;
}

// Rollback Metrics
interface RollbackMetrics {
  duration: number;
  stepsCompleted: number;
  stepsTotal: number;
  stepsFailed: number;
  validationsPassed: number;
  validationsFailed: number;
  instancesRolledBack: number;
  instancesFailed: number;
  dataRestored: number;
  connectionsPreserved: number;
  downtime: number;
}

// Rollback Snapshot
interface RollbackSnapshot {
  id: string;
  name: string;
  description: string;
  type: 'full' | 'incremental' | 'differential';
  scope: RollbackScope;
  source: {
    type: string;
    id: string;
    version: string;
  };
  artifacts: SnapshotArtifact[];
  configuration: Record<string, unknown>;
  dependencies: SnapshotDependency[];
  retention: {
    policy: string;
    expiry: Date;
    protected: boolean;
  };
  verification: {
    status: 'pending' | 'verified' | 'failed';
    verifiedAt?: Date;
    checksum?: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    size: number;
    compressed: boolean;
    encrypted: boolean;
  };
}

// Snapshot Artifact
interface SnapshotArtifact {
  id: string;
  type: 'container' | 'binary' | 'config' | 'database' | 'state' | 'volume';
  name: string;
  version: string;
  location: string;
  checksum: string;
  size: number;
  encrypted: boolean;
}

// Snapshot Dependency
interface SnapshotDependency {
  type: 'service' | 'database' | 'config' | 'secret';
  name: string;
  version: string;
  snapshotId?: string;
}

// Rollback Policy
interface RollbackPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scope: RollbackScope;
  triggers: PolicyTrigger[];
  actions: PolicyAction[];
  conditions: PolicyCondition[];
  approval: ApprovalConfig;
  schedule?: PolicySchedule;
  retention: RetentionPolicy;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    lastTriggered?: Date;
    triggerCount: number;
  };
}

// Policy Trigger
interface PolicyTrigger {
  type: 'metric' | 'alert' | 'health' | 'deployment' | 'schedule';
  condition: string;
  threshold?: number;
  window?: number;
  alertId?: string;
  cron?: string;
}

// Policy Action
interface PolicyAction {
  type: 'rollback' | 'notify' | 'scale' | 'custom';
  target: string;
  params: Record<string, unknown>;
  delay?: number;
  priority: number;
}

// Policy Condition
interface PolicyCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: unknown;
}

// Approval Config
interface ApprovalConfig {
  required: boolean;
  type: 'manual' | 'automated' | 'hybrid';
  approvers: string[];
  minApprovals: number;
  timeout: number;
  autoApprove: {
    enabled: boolean;
    conditions: string[];
  };
}

// Policy Schedule
interface PolicySchedule {
  type: 'always' | 'business_hours' | 'maintenance_window' | 'custom';
  timezone: string;
  windows?: {
    start: string;
    end: string;
    days: number[];
  }[];
}

// Retention Policy
interface RetentionPolicy {
  snapshots: number;
  days: number;
  minimumHealthy: number;
  protectedVersions: string[];
}

// Rollback History
interface RollbackHistory {
  id: string;
  operationId: string;
  environment: string;
  application: string;
  fromVersion: string;
  toVersion: string;
  type: RollbackType;
  status: 'success' | 'failed' | 'partial';
  trigger: TriggerType;
  duration: number;
  downtime: number;
  impactedUsers: number;
  timestamp: Date;
  actor: string;
  notes?: string;
}

// Rollback Statistics
interface RollbackStatistics {
  overview: {
    totalRollbacks: number;
    successfulRollbacks: number;
    failedRollbacks: number;
    averageDuration: number;
    averageDowntime: number;
  };
  byType: Record<RollbackType, number>;
  byScope: Record<RollbackScope, number>;
  byTrigger: Record<TriggerType, number>;
  byEnvironment: Record<string, number>;
  trends: {
    date: string;
    rollbacks: number;
    successful: number;
    failed: number;
    avgDuration: number;
  }[];
  topReasons: {
    reason: string;
    count: number;
    percentage: number;
  }[];
  performance: {
    mttr: number;
    successRate: number;
    avgImpactedUsers: number;
  };
}

class RollbackService {
  private static instance: RollbackService;
  private operations: Map<string, RollbackOperation> = new Map();
  private snapshots: Map<string, RollbackSnapshot> = new Map();
  private policies: Map<string, RollbackPolicy> = new Map();
  private history: Map<string, RollbackHistory[]> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): RollbackService {
    if (!RollbackService.instance) {
      RollbackService.instance = new RollbackService();
    }
    return RollbackService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Rollback Snapshots
    const snapshotsData = [
      { name: 'API Service v2.0.0', type: 'full' as const, scope: 'application' as RollbackScope },
      { name: 'Web App v3.0.0', type: 'full' as const, scope: 'application' as RollbackScope },
      { name: 'Database Migration 45', type: 'incremental' as const, scope: 'database' as RollbackScope },
      { name: 'Config Update 2024-01', type: 'differential' as const, scope: 'configuration' as RollbackScope },
      { name: 'Worker Service v1.5.0', type: 'full' as const, scope: 'service' as RollbackScope },
    ];

    snapshotsData.forEach((s, idx) => {
      const snapshot: RollbackSnapshot = {
        id: `snap-${(idx + 1).toString().padStart(4, '0')}`,
        name: s.name,
        description: `Snapshot of ${s.name}`,
        type: s.type,
        scope: s.scope,
        source: {
          type: 'deployment',
          id: `deploy-${idx + 1}`,
          version: s.name.split('v')[1]?.split(' ')[0] || '1.0.0',
        },
        artifacts: [
          {
            id: `artifact-${idx}-1`,
            type: s.scope === 'database' ? 'database' : s.scope === 'configuration' ? 'config' : 'container',
            name: s.name.toLowerCase().replace(/\s/g, '-'),
            version: s.name.split('v')[1]?.split(' ')[0] || '1.0.0',
            location: `s3://rescueping-snapshots/${s.name.toLowerCase().replace(/\s/g, '-')}`,
            checksum: `sha256:${Math.random().toString(36).substr(2, 64)}`,
            size: Math.floor(Math.random() * 500) * 1024 * 1024,
            encrypted: true,
          },
        ],
        configuration: {
          replicas: 3,
          resources: { cpu: '500m', memory: '1Gi' },
        },
        dependencies: [
          { type: 'database', name: 'postgres', version: '14.0' },
          { type: 'config', name: 'app-config', version: 'v1.0.0' },
        ],
        retention: {
          policy: 'standard',
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          protected: idx < 2,
        },
        verification: {
          status: 'verified',
          verifiedAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000),
          checksum: `sha256:${Math.random().toString(36).substr(2, 64)}`,
        },
        metadata: {
          createdAt: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
          createdBy: 'deployment-bot',
          size: Math.floor(Math.random() * 500) * 1024 * 1024,
          compressed: true,
          encrypted: true,
        },
      };
      this.snapshots.set(snapshot.id, snapshot);
    });

    // Initialize Rollback Policies
    const policiesData = [
      { name: 'Auto Rollback on Error Rate', trigger: 'metric' as const },
      { name: 'Health Check Failure Rollback', trigger: 'health' as const },
      { name: 'Alert-Based Rollback', trigger: 'alert' as const },
      { name: 'Scheduled Rollback Window', trigger: 'schedule' as const },
    ];

    policiesData.forEach((p, idx) => {
      const policy: RollbackPolicy = {
        id: `policy-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: `Policy for ${p.name.toLowerCase()}`,
        enabled: true,
        scope: 'application',
        triggers: [
          {
            type: p.trigger,
            condition: p.trigger === 'metric' ? 'error_rate > 0.05' : p.trigger === 'health' ? 'health_status == unhealthy' : p.trigger === 'alert' ? 'severity == critical' : 'cron_match',
            threshold: p.trigger === 'metric' ? 0.05 : undefined,
            window: 300,
            cron: p.trigger === 'schedule' ? '0 2 * * 0' : undefined,
          },
        ],
        actions: [
          {
            type: 'rollback',
            target: 'latest_stable',
            params: { strategy: 'instant' },
            priority: 1,
          },
          {
            type: 'notify',
            target: 'platform-team',
            params: { channels: ['slack', 'email'] },
            priority: 2,
          },
        ],
        conditions: [
          { field: 'environment', operator: 'equals', value: 'production' },
        ],
        approval: {
          required: idx === 0,
          type: idx === 0 ? 'manual' : 'automated',
          approvers: ['platform-lead', 'release-manager'],
          minApprovals: 1,
          timeout: 300,
          autoApprove: {
            enabled: idx !== 0,
            conditions: ['severity == critical'],
          },
        },
        schedule: {
          type: 'always',
          timezone: 'UTC',
        },
        retention: {
          snapshots: 10,
          days: 30,
          minimumHealthy: 3,
          protectedVersions: ['v2.0.0', 'v1.9.0'],
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          lastTriggered: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
          triggerCount: Math.floor(Math.random() * 20) + 5,
        },
      };
      this.policies.set(policy.id, policy);
    });

    // Initialize Rollback Operations
    const operationsData = [
      { name: 'API Service Rollback', status: 'completed' as RollbackStatus, type: 'full' as RollbackType },
      { name: 'Web App Emergency Rollback', status: 'executing' as RollbackStatus, type: 'emergency' as RollbackType },
      { name: 'Config Rollback', status: 'verifying' as RollbackStatus, type: 'selective' as RollbackType },
      { name: 'Database Migration Rollback', status: 'failed' as RollbackStatus, type: 'full' as RollbackType },
      { name: 'Scheduled Worker Rollback', status: 'pending' as RollbackStatus, type: 'scheduled' as RollbackType },
    ];

    operationsData.forEach((o, idx) => {
      const operation: RollbackOperation = {
        id: `rollback-${(idx + 1).toString().padStart(4, '0')}`,
        name: o.name,
        description: `${o.type} rollback for ${o.name.replace(' Rollback', '')}`,
        type: o.type,
        scope: o.name.includes('Database') ? 'database' : o.name.includes('Config') ? 'configuration' : 'application',
        status: o.status,
        trigger: {
          type: o.type === 'emergency' ? 'alert' : o.type === 'scheduled' ? 'scheduled' : idx === 0 ? 'automatic' : 'manual',
          source: o.type === 'emergency' ? 'monitoring-system' : 'deployment-pipeline',
          reason: o.type === 'emergency' ? 'Critical error rate exceeded threshold' : 'Version rollback requested',
          alert: o.type === 'emergency' ? {
            id: 'alert-001',
            name: 'High Error Rate',
            severity: 'critical',
            metric: 'error_rate',
            threshold: 0.05,
            value: 0.12,
          } : undefined,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          actor: {
            type: o.type === 'emergency' ? 'system' : 'user',
            id: o.type === 'emergency' ? 'monitoring' : 'admin',
            name: o.type === 'emergency' ? 'Monitoring System' : 'Admin User',
          },
        },
        source: {
          type: 'snapshot',
          id: `snap-${(idx % 5 + 1).toString().padStart(4, '0')}`,
          version: '2.0.0',
          environment: 'production',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          artifacts: [
            {
              type: 'container',
              name: o.name.toLowerCase().replace(/\s/g, '-').replace('-rollback', ''),
              version: '2.0.0',
              location: `gcr.io/rescueping/${o.name.toLowerCase().replace(/\s/g, '-').replace('-rollback', '')}:2.0.0`,
              checksum: `sha256:${Math.random().toString(36).substr(2, 64)}`,
              size: Math.floor(Math.random() * 200) * 1024 * 1024,
            },
          ],
        },
        target: {
          type: 'deployment',
          id: `deploy-${idx + 1}`,
          name: o.name.replace(' Rollback', ''),
          environment: 'production',
          currentVersion: '2.1.0',
          targetVersion: '2.0.0',
          instances: Array.from({ length: 5 }, (_, i) => ({
            id: `instance-${idx}-${i}`,
            name: `pod-${i + 1}`,
            status: o.status === 'completed' ? 'rolled_back' : o.status === 'executing' ? (i < 3 ? 'rolled_back' : 'rolling_back') : 'active',
            currentVersion: o.status === 'completed' ? '2.0.0' : o.status === 'executing' && i < 3 ? '2.0.0' : '2.1.0',
            targetVersion: '2.0.0',
            ip: `10.0.${idx}.${i + 1}`,
            node: `node-${i % 3 + 1}`,
          })),
          dependencies: [
            { type: 'database', name: 'postgres', version: '14.0', compatible: true, requiresRollback: o.name.includes('Database') },
            { type: 'cache', name: 'redis', version: '7.0', compatible: true, requiresRollback: false },
          ],
        },
        strategy: {
          type: o.type === 'emergency' ? 'instant' : 'gradual',
          batchSize: o.type === 'emergency' ? 'all' : 2,
          batchDelay: o.type === 'emergency' ? 0 : 30,
          parallelism: o.type === 'emergency' ? 10 : 2,
          healthCheckInterval: 10,
          healthCheckTimeout: 30,
          failureThreshold: 3,
          rollbackOnFailure: true,
          preserveConnections: true,
          drainTimeout: 30,
          warmupTime: 60,
        },
        steps: [
          { id: `step-${idx}-1`, name: 'Prepare', type: 'prepare', status: o.status === 'pending' ? 'pending' : 'completed', order: 1, configuration: { action: 'validate_snapshot' }, timeout: 60, retries: 3, retriesLeft: 3 },
          { id: `step-${idx}-2`, name: 'Backup Current State', type: 'backup', status: o.status === 'pending' ? 'pending' : 'completed', order: 2, configuration: { action: 'create_snapshot' }, timeout: 300, retries: 2, retriesLeft: 2 },
          { id: `step-${idx}-3`, name: 'Drain Traffic', type: 'drain', status: o.status === 'pending' ? 'pending' : o.status === 'executing' ? 'running' : 'completed', order: 3, configuration: { action: 'drain_connections' }, timeout: 60, retries: 3, retriesLeft: 3 },
          { id: `step-${idx}-4`, name: 'Stop Services', type: 'stop', status: o.status === 'pending' || o.status === 'executing' ? 'pending' : o.status === 'failed' ? 'failed' : 'completed', order: 4, configuration: { action: 'stop_pods' }, timeout: 120, retries: 2, retriesLeft: o.status === 'failed' ? 0 : 2, error: o.status === 'failed' ? 'Failed to stop database service' : undefined },
          { id: `step-${idx}-5`, name: 'Restore from Snapshot', type: 'restore', status: o.status === 'completed' || o.status === 'verifying' ? 'completed' : 'pending', order: 5, configuration: { action: 'restore_snapshot' }, timeout: 600, retries: 1, retriesLeft: 1 },
          { id: `step-${idx}-6`, name: 'Start Services', type: 'start', status: o.status === 'completed' || o.status === 'verifying' ? 'completed' : 'pending', order: 6, configuration: { action: 'start_pods' }, timeout: 300, retries: 3, retriesLeft: 3 },
          { id: `step-${idx}-7`, name: 'Verify Health', type: 'verify', status: o.status === 'completed' ? 'completed' : o.status === 'verifying' ? 'running' : 'pending', order: 7, configuration: { action: 'health_check' }, timeout: 120, retries: 5, retriesLeft: 5 },
          { id: `step-${idx}-8`, name: 'Cleanup', type: 'cleanup', status: o.status === 'completed' ? 'completed' : 'pending', order: 8, configuration: { action: 'cleanup_resources' }, timeout: 60, retries: 1, retriesLeft: 1 },
          { id: `step-${idx}-9`, name: 'Notify', type: 'notify', status: o.status === 'completed' ? 'completed' : 'pending', order: 9, configuration: { action: 'send_notifications' }, timeout: 30, retries: 3, retriesLeft: 3 },
        ],
        currentStep: o.status === 'pending' ? 0 : o.status === 'executing' ? 3 : o.status === 'verifying' ? 7 : o.status === 'failed' ? 4 : 9,
        validation: {
          enabled: true,
          stages: [
            {
              id: `vstage-${idx}-1`,
              name: 'Health Validation',
              order: 1,
              checks: [
                { id: `vcheck-${idx}-1-1`, name: 'Liveness', type: 'health', status: o.status === 'completed' ? 'passed' : o.status === 'verifying' ? 'running' : 'pending', configuration: { endpoint: '/health/live' }, timeout: 30, retries: 3 },
                { id: `vcheck-${idx}-1-2`, name: 'Readiness', type: 'health', status: o.status === 'completed' ? 'passed' : 'pending', configuration: { endpoint: '/health/ready' }, timeout: 30, retries: 3 },
              ],
              status: o.status === 'completed' ? 'passed' : o.status === 'verifying' ? 'running' : 'pending',
              required: true,
              timeout: 120,
            },
            {
              id: `vstage-${idx}-2`,
              name: 'Functional Validation',
              order: 2,
              checks: [
                { id: `vcheck-${idx}-2-1`, name: 'API Response', type: 'endpoint', status: o.status === 'completed' ? 'passed' : 'pending', configuration: { endpoint: '/api/v1/status', expectedStatus: 200 }, timeout: 60, retries: 2 },
              ],
              status: o.status === 'completed' ? 'passed' : 'pending',
              required: true,
              timeout: 180,
            },
          ],
          parallelValidation: true,
          failFast: true,
          timeout: 600,
        },
        impact: {
          severity: o.type === 'emergency' ? 'critical' : 'medium',
          affectedServices: [
            { name: o.name.replace(' Rollback', ''), type: 'direct', impact: 'unavailable', estimatedRecovery: 300 },
            { name: 'Gateway', type: 'downstream', impact: 'degraded', estimatedRecovery: 60 },
          ],
          affectedUsers: Math.floor(Math.random() * 10000) + 1000,
          estimatedDowntime: o.type === 'emergency' ? 60 : 180,
          dataLoss: o.name.includes('Database') ? 'minimal' : 'none',
          risks: [
            { id: `risk-${idx}-1`, description: 'Temporary service unavailability', severity: 'medium', probability: 0.9, impact: 'User experience degradation' },
          ],
          mitigations: [
            { id: `mit-${idx}-1`, risk: 'Service unavailability', action: 'Enable circuit breaker', responsible: 'platform-team', status: 'completed' },
          ],
        },
        notifications: [
          { id: `notif-${idx}-1`, type: 'started', channels: [{ type: 'slack', target: '#deployments' }], recipients: ['platform-team'], template: 'rollback_started', status: o.status !== 'pending' ? 'sent' : 'pending' },
          { id: `notif-${idx}-2`, type: 'completed', channels: [{ type: 'slack', target: '#deployments' }, { type: 'email', target: 'platform-team@rescueping.io' }], recipients: ['platform-team', 'release-manager'], template: 'rollback_completed', status: o.status === 'completed' ? 'sent' : 'pending' },
        ],
        audit: [
          { id: `audit-${idx}-1`, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), action: 'rollback_created', actor: { type: 'user', id: 'admin', name: 'Admin User' }, details: { version: '2.0.0' }, result: 'success' },
          { id: `audit-${idx}-2`, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), action: 'rollback_started', actor: { type: 'system', id: 'system', name: 'System' }, details: {}, result: 'success' },
        ],
        metrics: {
          duration: o.status === 'completed' ? Math.floor(Math.random() * 600) + 300 : 0,
          stepsCompleted: o.status === 'completed' ? 9 : o.status === 'verifying' ? 6 : o.status === 'executing' ? 3 : o.status === 'failed' ? 3 : 0,
          stepsTotal: 9,
          stepsFailed: o.status === 'failed' ? 1 : 0,
          validationsPassed: o.status === 'completed' ? 4 : o.status === 'verifying' ? 2 : 0,
          validationsFailed: 0,
          instancesRolledBack: o.status === 'completed' ? 5 : o.status === 'executing' ? 3 : 0,
          instancesFailed: 0,
          dataRestored: o.name.includes('Database') ? Math.floor(Math.random() * 1000) * 1024 * 1024 : 0,
          connectionsPreserved: Math.floor(Math.random() * 100) + 50,
          downtime: o.status === 'completed' ? Math.floor(Math.random() * 60) + 30 : 0,
        },
        tags: ['production', o.type, o.name.toLowerCase().replace(/\s/g, '-').replace('-rollback', '')],
        metadata: {
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdBy: 'admin',
          startedAt: o.status !== 'pending' ? new Date(Date.now() - 1 * 60 * 60 * 1000) : undefined,
          completedAt: o.status === 'completed' || o.status === 'failed' ? new Date(Date.now() - 30 * 60 * 1000) : undefined,
          duration: o.status === 'completed' ? 1800 : undefined,
          approvedBy: o.type === 'emergency' ? undefined : 'platform-lead',
          approvedAt: o.type === 'emergency' ? undefined : new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        },
      };
      this.operations.set(operation.id, operation);

      // Initialize history
      const historyEntry: RollbackHistory = {
        id: `history-${idx}`,
        operationId: operation.id,
        environment: 'production',
        application: o.name.replace(' Rollback', ''),
        fromVersion: '2.1.0',
        toVersion: '2.0.0',
        type: o.type,
        status: o.status === 'completed' ? 'success' : o.status === 'failed' ? 'failed' : 'partial',
        trigger: o.type === 'emergency' ? 'alert' : o.type === 'scheduled' ? 'scheduled' : 'manual',
        duration: o.status === 'completed' ? Math.floor(Math.random() * 600) + 300 : 0,
        downtime: Math.floor(Math.random() * 60) + 30,
        impactedUsers: Math.floor(Math.random() * 5000) + 500,
        timestamp: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
        actor: 'admin',
        notes: o.status === 'failed' ? 'Rollback failed due to database lock' : undefined,
      };
      const appHistory = this.history.get(o.name.replace(' Rollback', '')) || [];
      appHistory.push(historyEntry);
      this.history.set(o.name.replace(' Rollback', ''), appHistory);
    });
  }

  // Operation Methods
  public getOperations(status?: RollbackStatus): RollbackOperation[] {
    let operations = Array.from(this.operations.values());
    if (status) operations = operations.filter((o) => o.status === status);
    return operations.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  public getOperationById(id: string): RollbackOperation | undefined {
    return this.operations.get(id);
  }

  public startRollback(id: string): RollbackOperation {
    const operation = this.operations.get(id);
    if (!operation) throw new Error('Rollback operation not found');
    operation.status = 'executing';
    operation.metadata.startedAt = new Date();
    this.emit('rollback.started', operation);
    return operation;
  }

  public cancelRollback(id: string, reason?: string): RollbackOperation {
    const operation = this.operations.get(id);
    if (!operation) throw new Error('Rollback operation not found');
    operation.status = 'cancelled';
    operation.metadata.completedAt = new Date();
    operation.audit.push({
      id: this.generateId(),
      timestamp: new Date(),
      action: 'rollback_cancelled',
      actor: { type: 'user', id: 'admin', name: 'Admin User' },
      details: { reason },
      result: 'success',
    });
    this.emit('rollback.cancelled', { operation, reason });
    return operation;
  }

  // Snapshot Methods
  public getSnapshots(scope?: RollbackScope): RollbackSnapshot[] {
    let snapshots = Array.from(this.snapshots.values());
    if (scope) snapshots = snapshots.filter((s) => s.scope === scope);
    return snapshots.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  public getSnapshotById(id: string): RollbackSnapshot | undefined {
    return this.snapshots.get(id);
  }

  // Policy Methods
  public getPolicies(enabled?: boolean): RollbackPolicy[] {
    let policies = Array.from(this.policies.values());
    if (enabled !== undefined) policies = policies.filter((p) => p.enabled === enabled);
    return policies;
  }

  public getPolicyById(id: string): RollbackPolicy | undefined {
    return this.policies.get(id);
  }

  // History Methods
  public getHistory(application?: string): RollbackHistory[] {
    if (application) {
      return this.history.get(application) || [];
    }
    return Array.from(this.history.values()).flat().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Statistics
  public getStatistics(): RollbackStatistics {
    const operations = Array.from(this.operations.values());
    const byType: Record<RollbackType, number> = {} as Record<RollbackType, number>;
    const byScope: Record<RollbackScope, number> = {} as Record<RollbackScope, number>;
    const byTrigger: Record<TriggerType, number> = {} as Record<TriggerType, number>;
    const byEnvironment: Record<string, number> = {};

    operations.forEach((o) => {
      byType[o.type] = (byType[o.type] || 0) + 1;
      byScope[o.scope] = (byScope[o.scope] || 0) + 1;
      byTrigger[o.trigger.type] = (byTrigger[o.trigger.type] || 0) + 1;
      byEnvironment[o.target.environment] = (byEnvironment[o.target.environment] || 0) + 1;
    });

    const completed = operations.filter((o) => o.status === 'completed');
    const failed = operations.filter((o) => o.status === 'failed');

    return {
      overview: {
        totalRollbacks: operations.length,
        successfulRollbacks: completed.length,
        failedRollbacks: failed.length,
        averageDuration: completed.reduce((sum, o) => sum + (o.metrics.duration || 0), 0) / completed.length || 0,
        averageDowntime: completed.reduce((sum, o) => sum + (o.metrics.downtime || 0), 0) / completed.length || 0,
      },
      byType,
      byScope,
      byTrigger,
      byEnvironment,
      trends: [],
      topReasons: [],
      performance: {
        mttr: completed.reduce((sum, o) => sum + (o.metrics.duration || 0), 0) / completed.length || 0,
        successRate: operations.length > 0 ? completed.length / operations.length : 0,
        avgImpactedUsers: operations.reduce((sum, o) => sum + o.impact.affectedUsers, 0) / operations.length || 0,
      },
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

export const rollbackService = RollbackService.getInstance();
export type {
  RollbackStatus,
  RollbackType,
  RollbackScope,
  TriggerType,
  RecoveryStrategy,
  RollbackOperation,
  RollbackTrigger,
  RollbackSource,
  SourceArtifact,
  RollbackTarget,
  TargetInstance,
  TargetDependency,
  RollbackStrategy,
  RollbackStep,
  StepConfiguration,
  StepCondition,
  StepHook,
  RollbackValidation,
  ValidationStage,
  ValidationCheck,
  ImpactAssessment,
  AffectedService,
  RiskItem,
  MitigationItem,
  RollbackNotification,
  NotificationChannel,
  AuditEntry,
  RollbackMetrics,
  RollbackSnapshot,
  SnapshotArtifact,
  SnapshotDependency,
  RollbackPolicy,
  PolicyTrigger,
  PolicyAction,
  PolicyCondition,
  ApprovalConfig,
  PolicySchedule,
  RetentionPolicy,
  RollbackHistory,
  RollbackStatistics,
};
