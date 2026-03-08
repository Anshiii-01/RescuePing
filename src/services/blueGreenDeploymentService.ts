/**
 * Blue-Green Deployment Service
 * Comprehensive blue-green deployment management, environment switching, and zero-downtime releases
 */

// Deployment Color
type DeploymentColor = 'blue' | 'green';

// Deployment State
type BlueGreenState = 'idle' | 'preparing' | 'deploying' | 'validating' | 'switching' | 'switched' | 'rolling_back' | 'completed' | 'failed';

// Switch Strategy
type SwitchStrategy = 'immediate' | 'gradual' | 'dns' | 'load-balancer' | 'service-mesh';

// Validation Status
type ValidationStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

// Blue-Green Deployment
interface BlueGreenDeployment {
  id: string;
  name: string;
  description: string;
  application: BlueGreenApplication;
  state: BlueGreenState;
  activeColor: DeploymentColor;
  targetColor: DeploymentColor;
  environments: {
    blue: EnvironmentState;
    green: EnvironmentState;
  };
  switchConfig: SwitchConfiguration;
  validation: ValidationConfiguration;
  rollbackConfig: RollbackConfiguration;
  trafficConfig: TrafficConfiguration;
  schedule?: DeploymentSchedule;
  metrics: BlueGreenMetrics;
  history: DeploymentEvent[];
  notifications: NotificationRule[];
  tags: string[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    startedAt?: Date;
    completedAt?: Date;
    lastSwitchAt?: Date;
    revision: number;
  };
}

// Blue-Green Application
interface BlueGreenApplication {
  id: string;
  name: string;
  namespace: string;
  cluster: string;
  type: 'kubernetes' | 'ecs' | 'vm' | 'lambda' | 'cloudrun';
  repository: {
    url: string;
    branch: string;
  };
  services: {
    main: string;
    blue: string;
    green: string;
  };
  team: string;
  owner: string;
}

// Environment State
interface EnvironmentState {
  color: DeploymentColor;
  version: string;
  status: 'active' | 'standby' | 'deploying' | 'validating' | 'draining' | 'offline';
  health: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
  deployment: DeploymentInfo;
  resources: ResourceAllocation;
  endpoints: EndpointInfo[];
  instances: InstanceInfo[];
  lastUpdated: Date;
}

// Deployment Info
interface DeploymentInfo {
  id: string;
  image: string;
  imageTag: string;
  commit?: string;
  buildNumber?: number;
  deployedAt?: Date;
  deployedBy?: string;
  configVersion: string;
  secretsVersion: string;
}

// Resource Allocation
interface ResourceAllocation {
  replicas: {
    desired: number;
    ready: number;
    available: number;
  };
  cpu: {
    requested: string;
    limit: string;
    used: number;
  };
  memory: {
    requested: string;
    limit: string;
    used: number;
  };
  storage?: {
    size: string;
    used: number;
  };
}

// Endpoint Info
interface EndpointInfo {
  name: string;
  type: 'internal' | 'external' | 'public';
  url: string;
  port: number;
  protocol: 'http' | 'https' | 'grpc' | 'tcp';
  healthCheck?: {
    path: string;
    interval: number;
    timeout: number;
    threshold: number;
  };
  tls?: {
    enabled: boolean;
    certName?: string;
    expiry?: Date;
  };
}

// Instance Info
interface InstanceInfo {
  id: string;
  name: string;
  ip: string;
  status: 'running' | 'starting' | 'stopping' | 'stopped' | 'failed';
  health: 'healthy' | 'unhealthy' | 'unknown';
  version: string;
  zone?: string;
  node?: string;
  startTime?: Date;
  lastHealthCheck?: Date;
  metrics: {
    cpu: number;
    memory: number;
    connections: number;
    requestsPerSecond: number;
  };
}

// Switch Configuration
interface SwitchConfiguration {
  strategy: SwitchStrategy;
  automatic: boolean;
  requireApproval: boolean;
  approvers: string[];
  preSwitch: PreSwitchConfig;
  postSwitch: PostSwitchConfig;
  timeout: number;
  drainTimeout: number;
  rollbackOnFailure: boolean;
}

// Pre-Switch Config
interface PreSwitchConfig {
  checks: PreSwitchCheck[];
  hooks: WebhookConfig[];
  warmup: WarmupConfig;
}

// Pre-Switch Check
interface PreSwitchCheck {
  id: string;
  name: string;
  type: 'health' | 'readiness' | 'smoke-test' | 'load-test' | 'custom';
  status: ValidationStatus;
  configuration: Record<string, unknown>;
  timeout: number;
  required: boolean;
  result?: {
    success: boolean;
    message: string;
    data?: Record<string, unknown>;
  };
}

// Webhook Config
interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  payload?: Record<string, unknown>;
  timeout: number;
  continueOnFailure: boolean;
}

// Warmup Config
interface WarmupConfig {
  enabled: boolean;
  duration: number;
  trafficPercentage: number;
  requestPattern?: {
    endpoint: string;
    method: string;
    rate: number;
  }[];
}

// Post-Switch Config
interface PostSwitchConfig {
  checks: PostSwitchCheck[];
  hooks: WebhookConfig[];
  cleanup: CleanupConfig;
}

// Post-Switch Check
interface PostSwitchCheck {
  id: string;
  name: string;
  type: 'health' | 'metrics' | 'functional' | 'custom';
  status: ValidationStatus;
  delay: number;
  duration: number;
  threshold: number;
  result?: {
    success: boolean;
    message: string;
  };
}

// Cleanup Config
interface CleanupConfig {
  scaleDownStandby: boolean;
  scaleDownDelay: number;
  preserveResources: boolean;
  retainLogs: boolean;
  retainMetrics: number;
}

// Validation Configuration
interface ValidationConfiguration {
  enabled: boolean;
  stages: ValidationStage[];
  parallelChecks: boolean;
  failFast: boolean;
  retryPolicy: {
    maxRetries: number;
    delay: number;
    backoff: 'linear' | 'exponential';
  };
}

// Validation Stage
interface ValidationStage {
  id: string;
  name: string;
  order: number;
  checks: ValidationCheck[];
  status: ValidationStatus;
  required: boolean;
  timeout: number;
  startedAt?: Date;
  completedAt?: Date;
}

// Validation Check
interface ValidationCheck {
  id: string;
  name: string;
  type: 'health' | 'endpoint' | 'smoke' | 'integration' | 'performance' | 'security' | 'custom';
  status: ValidationStatus;
  configuration: {
    endpoint?: string;
    method?: string;
    expectedStatus?: number;
    expectedBody?: string;
    threshold?: number;
    script?: string;
  };
  timeout: number;
  retries: number;
  result?: {
    success: boolean;
    duration: number;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Rollback Configuration
interface RollbackConfiguration {
  enabled: boolean;
  automatic: boolean;
  triggers: RollbackTrigger[];
  maxRollbacks: number;
  cooldownPeriod: number;
  preserveSnapshots: number;
  snapshots: RollbackSnapshot[];
}

// Rollback Trigger
interface RollbackTrigger {
  type: 'health' | 'error-rate' | 'latency' | 'validation-failure' | 'manual';
  threshold: number;
  window: number;
  action: 'immediate' | 'gradual';
}

// Rollback Snapshot
interface RollbackSnapshot {
  id: string;
  color: DeploymentColor;
  version: string;
  timestamp: Date;
  config: Record<string, unknown>;
  healthy: boolean;
}

// Traffic Configuration
interface TrafficConfiguration {
  type: 'service' | 'ingress' | 'dns' | 'load-balancer';
  provider: 'kubernetes' | 'aws-alb' | 'nginx' | 'istio' | 'route53' | 'cloudflare';
  activeService: string;
  standbyService: string;
  routing: {
    rules: RoutingRule[];
    weights?: {
      active: number;
      standby: number;
    };
  };
  healthCheck: {
    enabled: boolean;
    path: string;
    interval: number;
    timeout: number;
    healthyThreshold: number;
    unhealthyThreshold: number;
  };
  stickySession?: {
    enabled: boolean;
    duration: number;
    cookieName: string;
  };
}

// Routing Rule
interface RoutingRule {
  id: string;
  name: string;
  priority: number;
  match: {
    path?: string;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
  };
  target: DeploymentColor;
  enabled: boolean;
}

// Deployment Schedule
interface DeploymentSchedule {
  type: 'immediate' | 'scheduled' | 'maintenance-window';
  scheduledTime?: Date;
  maintenanceWindow?: {
    start: string;
    end: string;
    timezone: string;
    days: number[];
  };
  approval?: {
    required: boolean;
    approvers: string[];
    deadline?: Date;
  };
}

// Blue-Green Metrics
interface BlueGreenMetrics {
  totalDeployments: number;
  successfulSwitches: number;
  failedSwitches: number;
  rollbacks: number;
  averageSwitchTime: number;
  averageValidationTime: number;
  lastSwitchDuration: number;
  downtime: number;
  currentState: {
    activeColor: DeploymentColor;
    activeVersion: string;
    activeHealth: 'healthy' | 'unhealthy' | 'degraded';
    standbyColor: DeploymentColor;
    standbyVersion: string;
    standbyHealth: 'healthy' | 'unhealthy' | 'degraded' | 'offline';
  };
  performance: {
    blue: PerformanceStats;
    green: PerformanceStats;
  };
}

// Performance Stats
interface PerformanceStats {
  requestRate: number;
  successRate: number;
  errorRate: number;
  latencyP50: number;
  latencyP90: number;
  latencyP99: number;
  throughput: number;
  availability: number;
}

// Deployment Event
interface DeploymentEvent {
  id: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'error' | 'success';
  phase: BlueGreenState;
  action: string;
  message: string;
  details?: Record<string, unknown>;
  actor?: {
    type: 'user' | 'system' | 'automation';
    id: string;
    name: string;
  };
}

// Notification Rule
interface NotificationRule {
  id: string;
  name: string;
  events: ('deployment_started' | 'validation_complete' | 'switch_started' | 'switch_complete' | 'rollback' | 'failure')[];
  channels: {
    type: 'slack' | 'email' | 'webhook' | 'pagerduty';
    target: string;
    template?: string;
  }[];
  enabled: boolean;
}

// Blue-Green Template
interface BlueGreenTemplate {
  id: string;
  name: string;
  description: string;
  switchConfig: Partial<SwitchConfiguration>;
  validation: Partial<ValidationConfiguration>;
  rollbackConfig: Partial<RollbackConfiguration>;
  trafficConfig: Partial<TrafficConfiguration>;
  notifications: NotificationRule[];
  tags: string[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    usageCount: number;
  };
}

// Comparison Report
interface ComparisonReport {
  id: string;
  deploymentId: string;
  timestamp: Date;
  duration: number;
  environments: {
    blue: EnvironmentReport;
    green: EnvironmentReport;
  };
  comparison: {
    metric: string;
    blue: number;
    green: number;
    difference: number;
    differencePercent: number;
    winner: DeploymentColor | 'tie';
  }[];
  recommendation: {
    action: 'proceed' | 'wait' | 'abort';
    confidence: number;
    reasons: string[];
  };
}

// Environment Report
interface EnvironmentReport {
  color: DeploymentColor;
  version: string;
  health: 'healthy' | 'unhealthy' | 'degraded';
  metrics: {
    successRate: number;
    errorRate: number;
    latencyP50: number;
    latencyP99: number;
    throughput: number;
  };
  issues: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
  }[];
}

// Blue-Green Statistics
interface BlueGreenStatistics {
  overview: {
    totalDeployments: number;
    activeDeployments: number;
    successfulDeployments: number;
    failedDeployments: number;
    averageSwitchTime: number;
  };
  byState: Record<BlueGreenState, number>;
  byApplication: Record<string, number>;
  performance: {
    successRate: number;
    rollbackRate: number;
    averageDowntime: number;
    averageValidationTime: number;
  };
  trends: {
    date: string;
    deployments: number;
    switches: number;
    rollbacks: number;
  }[];
}

class BlueGreenDeploymentService {
  private static instance: BlueGreenDeploymentService;
  private deployments: Map<string, BlueGreenDeployment> = new Map();
  private templates: Map<string, BlueGreenTemplate> = new Map();
  private comparisons: Map<string, ComparisonReport[]> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): BlueGreenDeploymentService {
    if (!BlueGreenDeploymentService.instance) {
      BlueGreenDeploymentService.instance = new BlueGreenDeploymentService();
    }
    return BlueGreenDeploymentService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Templates
    const templatesData = [
      { name: 'Standard Blue-Green', strategy: 'immediate' as SwitchStrategy },
      { name: 'Gradual Switch', strategy: 'gradual' as SwitchStrategy },
      { name: 'DNS-Based Switch', strategy: 'dns' as SwitchStrategy },
      { name: 'Load Balancer Switch', strategy: 'load-balancer' as SwitchStrategy },
    ];

    templatesData.forEach((t, idx) => {
      const template: BlueGreenTemplate = {
        id: `bg-tmpl-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: `Template for ${t.name.toLowerCase()} deployments`,
        switchConfig: {
          strategy: t.strategy,
          automatic: t.strategy === 'immediate',
          requireApproval: t.strategy !== 'immediate',
          timeout: 600,
          drainTimeout: 60,
          rollbackOnFailure: true,
        },
        validation: {
          enabled: true,
          parallelChecks: true,
          failFast: true,
        },
        rollbackConfig: {
          enabled: true,
          automatic: true,
          maxRollbacks: 3,
          cooldownPeriod: 300,
        },
        trafficConfig: {
          type: t.strategy === 'dns' ? 'dns' : t.strategy === 'load-balancer' ? 'load-balancer' : 'service',
        },
        notifications: [
          { id: `notif-${idx}-1`, name: 'Slack Notification', events: ['switch_started', 'switch_complete', 'failure'], channels: [{ type: 'slack', target: '#deployments' }], enabled: true },
        ],
        tags: [t.strategy, 'blue-green'],
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          usageCount: Math.floor(Math.random() * 50) + 10,
        },
      };
      this.templates.set(template.id, template);
    });

    // Initialize Deployments
    const deploymentsData = [
      { name: 'API Service Blue-Green', state: 'completed' as BlueGreenState, activeColor: 'green' as DeploymentColor },
      { name: 'Web App Blue-Green', state: 'validating' as BlueGreenState, activeColor: 'blue' as DeploymentColor },
      { name: 'Worker Service Blue-Green', state: 'switching' as BlueGreenState, activeColor: 'blue' as DeploymentColor },
      { name: 'Auth Service Blue-Green', state: 'failed' as BlueGreenState, activeColor: 'blue' as DeploymentColor },
      { name: 'Notification Service Blue-Green', state: 'idle' as BlueGreenState, activeColor: 'green' as DeploymentColor },
    ];

    deploymentsData.forEach((d, idx) => {
      const targetColor: DeploymentColor = d.activeColor === 'blue' ? 'green' : 'blue';
      
      const createEnvironmentState = (color: DeploymentColor, isActive: boolean, isTarget: boolean): EnvironmentState => ({
        color,
        version: isTarget ? '2.1.0' : '2.0.0',
        status: isActive ? 'active' : isTarget ? (d.state === 'validating' ? 'validating' : d.state === 'switching' ? 'deploying' : 'standby') : 'standby',
        health: d.state === 'failed' && isTarget ? 'unhealthy' : 'healthy',
        deployment: {
          id: `deploy-${color}-${idx}`,
          image: `gcr.io/rescueping/${d.name.toLowerCase().replace(/\s/g, '-').replace('-blue-green', '')}`,
          imageTag: isTarget ? '2.1.0' : '2.0.0',
          commit: `${color}${idx}${Math.random().toString(36).substr(2, 7)}`,
          buildNumber: isTarget ? 110 + idx : 100 + idx,
          deployedAt: new Date(Date.now() - (isTarget ? 1 : 7) * 24 * 60 * 60 * 1000),
          deployedBy: 'deployment-bot',
          configVersion: 'v1.0.0',
          secretsVersion: 'v1.0.0',
        },
        resources: {
          replicas: { desired: isActive ? 5 : 3, ready: isActive ? 5 : d.state === 'failed' && isTarget ? 2 : 3, available: isActive ? 5 : d.state === 'failed' && isTarget ? 2 : 3 },
          cpu: { requested: '500m', limit: '2000m', used: Math.random() * 40 + 20 },
          memory: { requested: '1Gi', limit: '4Gi', used: Math.random() * 50 + 30 },
        },
        endpoints: [
          { name: 'http', type: 'internal', url: `http://${d.name.toLowerCase().replace(/\s/g, '-').replace('-blue-green', '')}-${color}.prod.svc.cluster.local`, port: 8080, protocol: 'http' },
          { name: 'external', type: 'external', url: `https://${d.name.toLowerCase().replace(/\s/g, '-').replace('-blue-green', '')}-${color}.rescueping.io`, port: 443, protocol: 'https', tls: { enabled: true } },
        ],
        instances: Array.from({ length: isActive ? 5 : 3 }, (_, i) => ({
          id: `instance-${color}-${idx}-${i}`,
          name: `pod-${color}-${i + 1}`,
          ip: `10.${color === 'blue' ? 0 : 1}.${idx}.${i + 1}`,
          status: d.state === 'failed' && isTarget && i >= 2 ? 'failed' : 'running',
          health: d.state === 'failed' && isTarget && i >= 2 ? 'unhealthy' : 'healthy',
          version: isTarget ? '2.1.0' : '2.0.0',
          zone: `zone-${i % 3 + 1}`,
          node: `node-${i % 5 + 1}`,
          startTime: new Date(Date.now() - (isTarget ? 1 : 7) * 24 * 60 * 60 * 1000),
          lastHealthCheck: new Date(),
          metrics: {
            cpu: Math.random() * 40 + 20,
            memory: Math.random() * 50 + 30,
            connections: Math.floor(Math.random() * 100),
            requestsPerSecond: Math.floor(Math.random() * 50),
          },
        })),
        lastUpdated: new Date(),
      });

      const deployment: BlueGreenDeployment = {
        id: `bg-${(idx + 1).toString().padStart(4, '0')}`,
        name: d.name,
        description: `Blue-green deployment for ${d.name.replace(' Blue-Green', '')}`,
        application: {
          id: `app-${idx + 1}`,
          name: d.name.replace(' Blue-Green', ''),
          namespace: 'production',
          cluster: 'prod-cluster-1',
          type: 'kubernetes',
          repository: {
            url: `https://github.com/rescueping/${d.name.toLowerCase().replace(/\s/g, '-').replace('-blue-green', '')}`,
            branch: 'main',
          },
          services: {
            main: d.name.toLowerCase().replace(/\s/g, '-').replace('-blue-green', ''),
            blue: `${d.name.toLowerCase().replace(/\s/g, '-').replace('-blue-green', '')}-blue`,
            green: `${d.name.toLowerCase().replace(/\s/g, '-').replace('-blue-green', '')}-green`,
          },
          team: 'Platform Team',
          owner: 'platform-lead',
        },
        state: d.state,
        activeColor: d.activeColor,
        targetColor,
        environments: {
          blue: createEnvironmentState('blue', d.activeColor === 'blue', targetColor === 'blue'),
          green: createEnvironmentState('green', d.activeColor === 'green', targetColor === 'green'),
        },
        switchConfig: {
          strategy: 'immediate',
          automatic: false,
          requireApproval: true,
          approvers: ['platform-lead', 'release-manager'],
          preSwitch: {
            checks: [
              { id: `pre-${idx}-1`, name: 'Health Check', type: 'health', status: d.state === 'idle' || d.state === 'completed' ? 'passed' : d.state === 'failed' ? 'failed' : 'running', configuration: {}, timeout: 60, required: true },
              { id: `pre-${idx}-2`, name: 'Readiness Check', type: 'readiness', status: d.state === 'idle' || d.state === 'completed' ? 'passed' : 'running', configuration: {}, timeout: 60, required: true },
              { id: `pre-${idx}-3`, name: 'Smoke Tests', type: 'smoke-test', status: d.state === 'idle' || d.state === 'completed' ? 'passed' : 'pending', configuration: {}, timeout: 300, required: true },
            ],
            hooks: [
              { id: `hook-${idx}-1`, name: 'Pre-switch webhook', url: 'https://hooks.rescueping.io/pre-switch', method: 'POST', timeout: 30, continueOnFailure: false },
            ],
            warmup: {
              enabled: true,
              duration: 60,
              trafficPercentage: 5,
            },
          },
          postSwitch: {
            checks: [
              { id: `post-${idx}-1`, name: 'Post-switch Health', type: 'health', status: d.state === 'completed' ? 'passed' : 'pending', delay: 30, duration: 60, threshold: 0.99 },
              { id: `post-${idx}-2`, name: 'Metrics Validation', type: 'metrics', status: d.state === 'completed' ? 'passed' : 'pending', delay: 60, duration: 300, threshold: 0.95 },
            ],
            hooks: [],
            cleanup: {
              scaleDownStandby: true,
              scaleDownDelay: 300,
              preserveResources: false,
              retainLogs: true,
              retainMetrics: 7,
            },
          },
          timeout: 600,
          drainTimeout: 60,
          rollbackOnFailure: true,
        },
        validation: {
          enabled: true,
          stages: [
            {
              id: `stage-${idx}-1`,
              name: 'Health Validation',
              order: 1,
              checks: [
                { id: `check-${idx}-1-1`, name: 'Liveness Check', type: 'health', status: d.state === 'idle' || d.state === 'completed' ? 'passed' : d.state === 'validating' ? 'running' : 'pending', configuration: { endpoint: '/health/live' }, timeout: 30, retries: 3 },
                { id: `check-${idx}-1-2`, name: 'Readiness Check', type: 'health', status: d.state === 'idle' || d.state === 'completed' ? 'passed' : 'pending', configuration: { endpoint: '/health/ready' }, timeout: 30, retries: 3 },
              ],
              status: d.state === 'idle' || d.state === 'completed' ? 'passed' : d.state === 'validating' ? 'running' : 'pending',
              required: true,
              timeout: 120,
            },
            {
              id: `stage-${idx}-2`,
              name: 'Smoke Tests',
              order: 2,
              checks: [
                { id: `check-${idx}-2-1`, name: 'API Endpoint Test', type: 'smoke', status: d.state === 'completed' ? 'passed' : 'pending', configuration: { endpoint: '/api/v1/health', expectedStatus: 200 }, timeout: 60, retries: 2 },
              ],
              status: d.state === 'completed' ? 'passed' : 'pending',
              required: true,
              timeout: 300,
            },
            {
              id: `stage-${idx}-3`,
              name: 'Performance Validation',
              order: 3,
              checks: [
                { id: `check-${idx}-3-1`, name: 'Latency Check', type: 'performance', status: d.state === 'completed' ? 'passed' : 'pending', configuration: { threshold: 200 }, timeout: 300, retries: 1 },
              ],
              status: d.state === 'completed' ? 'passed' : 'pending',
              required: false,
              timeout: 600,
            },
          ],
          parallelChecks: true,
          failFast: true,
          retryPolicy: {
            maxRetries: 3,
            delay: 10,
            backoff: 'exponential',
          },
        },
        rollbackConfig: {
          enabled: true,
          automatic: true,
          triggers: [
            { type: 'health', threshold: 0.5, window: 60, action: 'immediate' },
            { type: 'error-rate', threshold: 0.1, window: 120, action: 'immediate' },
            { type: 'latency', threshold: 500, window: 60, action: 'gradual' },
          ],
          maxRollbacks: 3,
          cooldownPeriod: 300,
          preserveSnapshots: 5,
          snapshots: [
            { id: `snap-${idx}-1`, color: d.activeColor, version: '2.0.0', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), config: {}, healthy: true },
            { id: `snap-${idx}-2`, color: d.activeColor === 'blue' ? 'green' : 'blue', version: '1.9.0', timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), config: {}, healthy: true },
          ],
        },
        trafficConfig: {
          type: 'service',
          provider: 'kubernetes',
          activeService: `${d.name.toLowerCase().replace(/\s/g, '-').replace('-blue-green', '')}-${d.activeColor}`,
          standbyService: `${d.name.toLowerCase().replace(/\s/g, '-').replace('-blue-green', '')}-${targetColor}`,
          routing: {
            rules: [
              { id: `rule-${idx}-1`, name: 'Default', priority: 1, match: {}, target: d.activeColor, enabled: true },
            ],
            weights: { active: 100, standby: 0 },
          },
          healthCheck: {
            enabled: true,
            path: '/health',
            interval: 10,
            timeout: 5,
            healthyThreshold: 2,
            unhealthyThreshold: 3,
          },
        },
        metrics: {
          totalDeployments: Math.floor(Math.random() * 50) + 10,
          successfulSwitches: Math.floor(Math.random() * 45) + 8,
          failedSwitches: d.state === 'failed' ? 1 : 0,
          rollbacks: Math.floor(Math.random() * 3),
          averageSwitchTime: Math.random() * 120 + 60,
          averageValidationTime: Math.random() * 300 + 120,
          lastSwitchDuration: d.state === 'completed' ? Math.random() * 100 + 50 : 0,
          downtime: 0,
          currentState: {
            activeColor: d.activeColor,
            activeVersion: '2.0.0',
            activeHealth: 'healthy',
            standbyColor: targetColor,
            standbyVersion: '2.1.0',
            standbyHealth: d.state === 'failed' ? 'unhealthy' : d.state === 'idle' ? 'offline' : 'healthy',
          },
          performance: {
            blue: {
              requestRate: Math.random() * 500 + 200,
              successRate: 0.995,
              errorRate: 0.005,
              latencyP50: Math.random() * 30 + 10,
              latencyP90: Math.random() * 80 + 40,
              latencyP99: Math.random() * 150 + 100,
              throughput: Math.random() * 1000 + 500,
              availability: 0.9999,
            },
            green: {
              requestRate: Math.random() * 500 + 200,
              successRate: d.state === 'failed' ? 0.92 : 0.996,
              errorRate: d.state === 'failed' ? 0.08 : 0.004,
              latencyP50: d.state === 'failed' ? Math.random() * 50 + 30 : Math.random() * 25 + 8,
              latencyP90: d.state === 'failed' ? Math.random() * 120 + 80 : Math.random() * 70 + 35,
              latencyP99: d.state === 'failed' ? Math.random() * 250 + 150 : Math.random() * 140 + 90,
              throughput: Math.random() * 1000 + 500,
              availability: d.state === 'failed' ? 0.95 : 0.9999,
            },
          },
        },
        history: [
          { id: `event-${idx}-1`, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'info', phase: 'idle', action: 'created', message: 'Deployment created' },
          { id: `event-${idx}-2`, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), type: 'info', phase: 'preparing', action: 'preparing', message: 'Preparing target environment' },
          ...(d.state === 'failed' ? [{ id: `event-${idx}-3`, timestamp: new Date(Date.now() - 30 * 60 * 1000), type: 'error' as const, phase: 'failed' as BlueGreenState, action: 'failed', message: 'Validation failed - health check failed' }] : []),
          ...(d.state === 'completed' ? [{ id: `event-${idx}-3`, timestamp: new Date(Date.now() - 30 * 60 * 1000), type: 'success' as const, phase: 'completed' as BlueGreenState, action: 'completed', message: 'Switch completed successfully' }] : []),
        ],
        notifications: [
          { id: `notif-${idx}-1`, name: 'Slack', events: ['deployment_started', 'switch_complete', 'failure'], channels: [{ type: 'slack', target: '#deployments' }], enabled: true },
          { id: `notif-${idx}-2`, name: 'Email', events: ['failure', 'rollback'], channels: [{ type: 'email', target: 'platform-team@rescueping.io' }], enabled: true },
        ],
        tags: ['production', d.name.toLowerCase().replace(/\s/g, '-').replace('-blue-green', '')],
        metadata: {
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdBy: 'deployment-bot',
          startedAt: d.state !== 'idle' ? new Date(Date.now() - 1 * 60 * 60 * 1000) : undefined,
          completedAt: d.state === 'completed' || d.state === 'failed' ? new Date(Date.now() - 30 * 60 * 1000) : undefined,
          lastSwitchAt: d.state === 'completed' ? new Date(Date.now() - 30 * 60 * 1000) : undefined,
          revision: Math.floor(Math.random() * 10) + 1,
        },
      };
      this.deployments.set(deployment.id, deployment);

      // Initialize comparisons
      const comparison: ComparisonReport = {
        id: `comparison-${idx}`,
        deploymentId: deployment.id,
        timestamp: new Date(),
        duration: 3600,
        environments: {
          blue: { color: 'blue', version: d.activeColor === 'blue' ? '2.0.0' : '2.1.0', health: 'healthy', metrics: { successRate: 0.995, errorRate: 0.005, latencyP50: 25, latencyP99: 120, throughput: 800 }, issues: [] },
          green: { color: 'green', version: d.activeColor === 'green' ? '2.0.0' : '2.1.0', health: d.state === 'failed' ? 'unhealthy' : 'healthy', metrics: { successRate: d.state === 'failed' ? 0.92 : 0.996, errorRate: d.state === 'failed' ? 0.08 : 0.004, latencyP50: d.state === 'failed' ? 45 : 22, latencyP99: d.state === 'failed' ? 200 : 110, throughput: 850 }, issues: d.state === 'failed' ? [{ severity: 'critical', message: 'High error rate detected' }] : [] },
        },
        comparison: [
          { metric: 'success-rate', blue: 0.995, green: d.state === 'failed' ? 0.92 : 0.996, difference: d.state === 'failed' ? -0.075 : 0.001, differencePercent: d.state === 'failed' ? -7.5 : 0.1, winner: d.state === 'failed' ? 'blue' : 'green' },
          { metric: 'latency-p99', blue: 120, green: d.state === 'failed' ? 200 : 110, difference: d.state === 'failed' ? 80 : -10, differencePercent: d.state === 'failed' ? 66.7 : -8.3, winner: d.state === 'failed' ? 'blue' : 'green' },
        ],
        recommendation: {
          action: d.state === 'failed' ? 'abort' : 'proceed',
          confidence: d.state === 'failed' ? 0.95 : 0.9,
          reasons: d.state === 'failed' ? ['High error rate in green environment', 'Latency degradation detected'] : ['Green environment shows improved performance'],
        },
      };
      this.comparisons.set(deployment.id, [comparison]);
    });
  }

  // Deployment Operations
  public getDeployments(state?: BlueGreenState): BlueGreenDeployment[] {
    let deployments = Array.from(this.deployments.values());
    if (state) deployments = deployments.filter((d) => d.state === state);
    return deployments.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  public getDeploymentById(id: string): BlueGreenDeployment | undefined {
    return this.deployments.get(id);
  }

  public startDeployment(id: string): BlueGreenDeployment {
    const deployment = this.deployments.get(id);
    if (!deployment) throw new Error('Deployment not found');
    deployment.state = 'preparing';
    deployment.metadata.startedAt = new Date();
    this.emit('deployment.started', deployment);
    return deployment;
  }

  public switchEnvironments(id: string): BlueGreenDeployment {
    const deployment = this.deployments.get(id);
    if (!deployment) throw new Error('Deployment not found');
    deployment.state = 'switching';
    const temp = deployment.activeColor;
    deployment.activeColor = deployment.targetColor;
    deployment.targetColor = temp;
    deployment.metadata.lastSwitchAt = new Date();
    this.emit('deployment.switched', deployment);
    return deployment;
  }

  public rollback(id: string, reason?: string): BlueGreenDeployment {
    const deployment = this.deployments.get(id);
    if (!deployment) throw new Error('Deployment not found');
    deployment.state = 'rolling_back';
    const temp = deployment.activeColor;
    deployment.activeColor = deployment.targetColor;
    deployment.targetColor = temp;
    deployment.metrics.rollbacks++;
    deployment.history.push({
      id: this.generateId(),
      timestamp: new Date(),
      type: 'warning',
      phase: 'rolling_back',
      action: 'rollback',
      message: `Rollback initiated: ${reason || 'Manual rollback'}`,
    });
    this.emit('deployment.rolledBack', { deployment, reason });
    return deployment;
  }

  // Template Operations
  public getTemplates(): BlueGreenTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplateById(id: string): BlueGreenTemplate | undefined {
    return this.templates.get(id);
  }

  // Comparison Operations
  public getComparisons(deploymentId: string): ComparisonReport[] {
    return this.comparisons.get(deploymentId) || [];
  }

  // Statistics
  public getStatistics(): BlueGreenStatistics {
    const deployments = Array.from(this.deployments.values());
    const byState: Record<BlueGreenState, number> = {} as Record<BlueGreenState, number>;
    const byApplication: Record<string, number> = {};

    deployments.forEach((d) => {
      byState[d.state] = (byState[d.state] || 0) + 1;
      byApplication[d.application.name] = (byApplication[d.application.name] || 0) + 1;
    });

    const completed = deployments.filter((d) => d.state === 'completed');
    const failed = deployments.filter((d) => d.state === 'failed');

    return {
      overview: {
        totalDeployments: deployments.length,
        activeDeployments: deployments.filter((d) => !['idle', 'completed', 'failed'].includes(d.state)).length,
        successfulDeployments: completed.length,
        failedDeployments: failed.length,
        averageSwitchTime: deployments.filter((d) => d.metrics.lastSwitchDuration > 0).reduce((sum, d) => sum + d.metrics.lastSwitchDuration, 0) / deployments.filter((d) => d.metrics.lastSwitchDuration > 0).length || 0,
      },
      byState,
      byApplication,
      performance: {
        successRate: deployments.length > 0 ? completed.length / deployments.length : 0,
        rollbackRate: deployments.length > 0 ? deployments.filter((d) => d.metrics.rollbacks > 0).length / deployments.length : 0,
        averageDowntime: 0,
        averageValidationTime: deployments.reduce((sum, d) => sum + d.metrics.averageValidationTime, 0) / deployments.length || 0,
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

export const blueGreenDeploymentService = BlueGreenDeploymentService.getInstance();
export type {
  DeploymentColor,
  BlueGreenState,
  SwitchStrategy,
  ValidationStatus,
  BlueGreenDeployment,
  BlueGreenApplication,
  EnvironmentState,
  DeploymentInfo,
  ResourceAllocation,
  EndpointInfo,
  InstanceInfo,
  SwitchConfiguration,
  PreSwitchConfig,
  PreSwitchCheck,
  WebhookConfig,
  WarmupConfig,
  PostSwitchConfig,
  PostSwitchCheck,
  CleanupConfig,
  ValidationConfiguration,
  ValidationStage,
  ValidationCheck,
  RollbackConfiguration,
  RollbackTrigger,
  RollbackSnapshot,
  TrafficConfiguration,
  RoutingRule,
  DeploymentSchedule,
  BlueGreenMetrics,
  PerformanceStats,
  DeploymentEvent,
  NotificationRule,
  BlueGreenTemplate,
  ComparisonReport,
  EnvironmentReport,
  BlueGreenStatistics,
};
