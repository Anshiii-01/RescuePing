/**
 * Capacity Planning Service
 * Comprehensive resource capacity planning, forecasting, and optimization management
 */

// Resource type
type ResourceType = 
  | 'compute' 
  | 'memory' 
  | 'storage' 
  | 'network' 
  | 'database' 
  | 'cache' 
  | 'queue' 
  | 'api' 
  | 'custom';

// Capacity status
type CapacityStatus = 'healthy' | 'warning' | 'critical' | 'exceeded';

// Planning horizon
type PlanningHorizon = 'short' | 'medium' | 'long';

// Scaling direction
type ScalingDirection = 'up' | 'down' | 'none';

// Resource definition
interface ResourceDefinition {
  id: string;
  name: string;
  type: ResourceType;
  description: string;
  unit: string;
  provider: string;
  region: string;
  tags: Record<string, string>;
  limits: {
    min: number;
    max: number;
    softLimit: number;
    hardLimit: number;
  };
  cost: {
    unitCost: number;
    currency: string;
    billingPeriod: 'hourly' | 'daily' | 'monthly';
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastAssessed: Date;
  };
}

// Capacity metric
interface CapacityMetric {
  id: string;
  resourceId: string;
  timestamp: Date;
  current: number;
  allocated: number;
  available: number;
  reserved: number;
  utilization: number;
  peakUtilization: number;
  avgUtilization: number;
  trend: {
    direction: 'increasing' | 'decreasing' | 'stable';
    rate: number;
    confidence: number;
  };
}

// Capacity threshold
interface CapacityThreshold {
  id: string;
  resourceId: string;
  name: string;
  type: 'warning' | 'critical' | 'exceeded';
  metric: string;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
  value: number;
  duration: number;
  enabled: boolean;
  notifications: {
    channels: string[];
    recipients: string[];
  };
  actions: {
    type: 'alert' | 'scale' | 'notify' | 'custom';
    config: Record<string, unknown>;
  }[];
}

// Capacity forecast
interface CapacityForecast {
  id: string;
  resourceId: string;
  resourceName: string;
  horizon: PlanningHorizon;
  generatedAt: Date;
  validUntil: Date;
  model: {
    type: 'linear' | 'exponential' | 'seasonal' | 'ml_based';
    accuracy: number;
    confidence: number;
  };
  predictions: {
    date: Date;
    predicted: number;
    lowerBound: number;
    upperBound: number;
    confidence: number;
  }[];
  insights: {
    exhaustionDate?: Date;
    recommendedAction: string;
    riskLevel: 'low' | 'medium' | 'high';
  };
  factors: {
    name: string;
    impact: number;
    description: string;
  }[];
}

// Capacity plan
interface CapacityPlan {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  horizon: PlanningHorizon;
  startDate: Date;
  endDate: Date;
  owner: {
    userId: string;
    userName: string;
  };
  resources: {
    resourceId: string;
    resourceName: string;
    currentCapacity: number;
    plannedCapacity: number;
    actions: PlanAction[];
  }[];
  budget: {
    allocated: number;
    estimated: number;
    currency: string;
  };
  approvals: {
    approverId: string;
    approverName: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp?: Date;
    comments?: string;
  }[];
  milestones: {
    id: string;
    name: string;
    date: Date;
    completed: boolean;
    completedAt?: Date;
  }[];
  risks: {
    id: string;
    description: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    version: number;
  };
}

// Plan action
interface PlanAction {
  id: string;
  type: 'provision' | 'scale_up' | 'scale_down' | 'decommission' | 'optimize' | 'migrate';
  description: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed';
  scheduledDate: Date;
  completedDate?: Date;
  cost: number;
  impact: string;
  dependencies: string[];
  assignee?: {
    userId: string;
    userName: string;
  };
}

// Resource allocation
interface ResourceAllocation {
  id: string;
  resourceId: string;
  resourceName: string;
  consumerId: string;
  consumerName: string;
  consumerType: 'service' | 'team' | 'project' | 'environment';
  allocated: number;
  used: number;
  reserved: number;
  priority: number;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'expired' | 'pending' | 'revoked';
  quotas: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Scaling policy
interface ScalingPolicy {
  id: string;
  name: string;
  description: string;
  resourceId: string;
  enabled: boolean;
  type: 'reactive' | 'predictive' | 'scheduled';
  direction: 'horizontal' | 'vertical' | 'both';
  triggers: {
    metric: string;
    condition: 'above' | 'below';
    threshold: number;
    duration: number;
  }[];
  actions: {
    scaleUp: {
      increment: number;
      maxInstances: number;
      cooldown: number;
    };
    scaleDown: {
      decrement: number;
      minInstances: number;
      cooldown: number;
    };
  };
  schedule?: {
    enabled: boolean;
    rules: {
      name: string;
      cron: string;
      targetCapacity: number;
    }[];
  };
  constraints: {
    minCapacity: number;
    maxCapacity: number;
    maxScalePercentage: number;
    quietPeriods: {
      start: string;
      end: string;
      reason: string;
    }[];
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastTriggered?: Date;
    triggerCount: number;
  };
}

// Capacity report
interface CapacityReport {
  id: string;
  name: string;
  type: 'summary' | 'detailed' | 'trend' | 'forecast' | 'cost';
  period: {
    start: Date;
    end: Date;
  };
  generatedAt: Date;
  generatedBy: string;
  resources: {
    resourceId: string;
    resourceName: string;
    type: ResourceType;
    metrics: {
      avgUtilization: number;
      peakUtilization: number;
      avgAvailable: number;
      trend: string;
    };
    status: CapacityStatus;
    recommendations: string[];
  }[];
  summary: {
    totalResources: number;
    healthyResources: number;
    warningResources: number;
    criticalResources: number;
    overallUtilization: number;
    totalCost: number;
    costTrend: number;
  };
  insights: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    actionable: boolean;
  }[];
}

// Demand pattern
interface DemandPattern {
  id: string;
  resourceId: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'event_driven';
  pattern: {
    hour?: number[];
    dayOfWeek?: number[];
    dayOfMonth?: number[];
    month?: number[];
  };
  baselineMultiplier: number;
  peakMultiplier: number;
  confidence: number;
  detectedAt: Date;
  validUntil: Date;
}

// Optimization recommendation
interface OptimizationRecommendation {
  id: string;
  resourceId: string;
  resourceName: string;
  type: 'rightsizing' | 'reservation' | 'scheduling' | 'consolidation' | 'migration';
  title: string;
  description: string;
  impact: {
    costSavings: number;
    performanceImpact: 'positive' | 'neutral' | 'negative';
    riskLevel: 'low' | 'medium' | 'high';
  };
  status: 'new' | 'acknowledged' | 'implemented' | 'dismissed';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  implementation: {
    steps: string[];
    estimatedTime: number;
    prerequisites: string[];
  };
  metadata: {
    createdAt: Date;
    expiresAt: Date;
    implementedAt?: Date;
  };
}

// Capacity statistics
interface CapacityStatistics {
  overview: {
    totalResources: number;
    resourcesByType: Record<ResourceType, number>;
    resourcesByStatus: Record<CapacityStatus, number>;
    avgUtilization: number;
    totalCapacity: number;
    usedCapacity: number;
  };
  cost: {
    totalMonthlyCost: number;
    costByResourceType: Record<ResourceType, number>;
    projectedCost: number;
    savingsOpportunities: number;
  };
  health: {
    healthyPercentage: number;
    warningPercentage: number;
    criticalPercentage: number;
    exceededPercentage: number;
  };
  trends: {
    date: string;
    utilization: number;
    capacity: number;
    cost: number;
  }[];
  forecasts: {
    resourceId: string;
    resourceName: string;
    exhaustionRisk: 'low' | 'medium' | 'high';
    daysToExhaustion?: number;
  }[];
}

class CapacityPlanningService {
  private static instance: CapacityPlanningService;
  private resources: Map<string, ResourceDefinition> = new Map();
  private metrics: Map<string, CapacityMetric[]> = new Map();
  private thresholds: Map<string, CapacityThreshold> = new Map();
  private forecasts: Map<string, CapacityForecast> = new Map();
  private plans: Map<string, CapacityPlan> = new Map();
  private allocations: Map<string, ResourceAllocation> = new Map();
  private policies: Map<string, ScalingPolicy> = new Map();
  private reports: Map<string, CapacityReport> = new Map();
  private patterns: Map<string, DemandPattern> = new Map();
  private recommendations: Map<string, OptimizationRecommendation> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CapacityPlanningService {
    if (!CapacityPlanningService.instance) {
      CapacityPlanningService.instance = new CapacityPlanningService();
    }
    return CapacityPlanningService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Resources
    const resourcesData = [
      { name: 'API Gateway Cluster', type: 'compute', provider: 'AWS', region: 'us-east-1', unit: 'instances' },
      { name: 'User Service Pods', type: 'compute', provider: 'Kubernetes', region: 'us-east-1', unit: 'pods' },
      { name: 'PostgreSQL Primary', type: 'database', provider: 'AWS RDS', region: 'us-east-1', unit: 'GB' },
      { name: 'Redis Cache Cluster', type: 'cache', provider: 'AWS ElastiCache', region: 'us-east-1', unit: 'GB' },
      { name: 'Object Storage', type: 'storage', provider: 'AWS S3', region: 'us-east-1', unit: 'TB' },
      { name: 'Message Queue', type: 'queue', provider: 'AWS SQS', region: 'us-east-1', unit: 'messages/sec' },
      { name: 'Application Memory', type: 'memory', provider: 'Kubernetes', region: 'us-east-1', unit: 'GB' },
      { name: 'Network Bandwidth', type: 'network', provider: 'AWS', region: 'us-east-1', unit: 'Gbps' },
    ];

    resourcesData.forEach((r, idx) => {
      const resource: ResourceDefinition = {
        id: `res-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name,
        type: r.type as ResourceType,
        description: `${r.name} resource in ${r.region}`,
        unit: r.unit,
        provider: r.provider,
        region: r.region,
        tags: {
          environment: 'production',
          team: 'platform',
          cost_center: 'engineering',
        },
        limits: {
          min: 1,
          max: r.type === 'storage' ? 1000 : r.type === 'compute' ? 100 : 500,
          softLimit: r.type === 'storage' ? 800 : r.type === 'compute' ? 80 : 400,
          hardLimit: r.type === 'storage' ? 950 : r.type === 'compute' ? 95 : 480,
        },
        cost: {
          unitCost: r.type === 'compute' ? 0.10 : r.type === 'storage' ? 0.023 : 0.05,
          currency: 'USD',
          billingPeriod: 'hourly',
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          lastAssessed: new Date(),
        },
      };
      this.resources.set(resource.id, resource);

      // Generate metrics history for each resource
      const metricsHistory: CapacityMetric[] = [];
      for (let i = 30; i >= 0; i--) {
        const baseUtilization = 50 + Math.random() * 30;
        const metric: CapacityMetric = {
          id: `metric-${resource.id}-${i}`,
          resourceId: resource.id,
          timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          current: Math.floor(baseUtilization * resource.limits.max / 100),
          allocated: resource.limits.max,
          available: Math.floor((100 - baseUtilization) * resource.limits.max / 100),
          reserved: Math.floor(resource.limits.max * 0.1),
          utilization: baseUtilization,
          peakUtilization: baseUtilization + Math.random() * 15,
          avgUtilization: baseUtilization - Math.random() * 10,
          trend: {
            direction: Math.random() > 0.5 ? 'increasing' : 'stable',
            rate: Math.random() * 5,
            confidence: 0.8 + Math.random() * 0.2,
          },
        };
        metricsHistory.push(metric);
      }
      this.metrics.set(resource.id, metricsHistory);

      // Create thresholds for each resource
      const thresholdsData = [
        { name: 'Warning Threshold', type: 'warning', value: 70 },
        { name: 'Critical Threshold', type: 'critical', value: 85 },
        { name: 'Exceeded Threshold', type: 'exceeded', value: 95 },
      ];

      thresholdsData.forEach((t, tIdx) => {
        const threshold: CapacityThreshold = {
          id: `threshold-${resource.id}-${tIdx + 1}`,
          resourceId: resource.id,
          name: t.name,
          type: t.type as CapacityThreshold['type'],
          metric: 'utilization',
          operator: 'gte',
          value: t.value,
          duration: 300,
          enabled: true,
          notifications: {
            channels: ['email', 'slack'],
            recipients: ['platform-team@rescueping.com'],
          },
          actions: [
            { type: 'alert', config: { severity: t.type } },
            t.type === 'critical' ? { type: 'scale', config: { direction: 'up', increment: 10 } } : null,
          ].filter(Boolean) as CapacityThreshold['actions'],
        };
        this.thresholds.set(threshold.id, threshold);
      });

      // Create forecast for each resource
      const forecast: CapacityForecast = {
        id: `forecast-${resource.id}`,
        resourceId: resource.id,
        resourceName: resource.name,
        horizon: 'medium',
        generatedAt: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        model: {
          type: 'ml_based',
          accuracy: 0.85 + Math.random() * 0.1,
          confidence: 0.8 + Math.random() * 0.15,
        },
        predictions: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
          predicted: 60 + Math.random() * 20 + i * 0.5,
          lowerBound: 55 + Math.random() * 15 + i * 0.4,
          upperBound: 65 + Math.random() * 25 + i * 0.6,
          confidence: 0.9 - i * 0.01,
        })),
        insights: {
          exhaustionDate: Math.random() > 0.7 ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) : undefined,
          recommendedAction: 'Monitor utilization and plan for capacity increase in 45 days',
          riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        },
        factors: [
          { name: 'User Growth', impact: 0.4, description: 'Projected user growth rate' },
          { name: 'Feature Launches', impact: 0.25, description: 'Upcoming feature releases' },
          { name: 'Seasonal Patterns', impact: 0.2, description: 'Historical seasonal patterns' },
          { name: 'External Events', impact: 0.15, description: 'Marketing campaigns and events' },
        ],
      };
      this.forecasts.set(forecast.id, forecast);

      // Create scaling policy for compute resources
      if (['compute', 'memory'].includes(r.type)) {
        const policy: ScalingPolicy = {
          id: `policy-${resource.id}`,
          name: `${resource.name} Auto Scaling`,
          description: `Auto scaling policy for ${resource.name}`,
          resourceId: resource.id,
          enabled: true,
          type: 'reactive',
          direction: 'horizontal',
          triggers: [
            { metric: 'cpu_utilization', condition: 'above', threshold: 70, duration: 300 },
            { metric: 'cpu_utilization', condition: 'below', threshold: 30, duration: 600 },
          ],
          actions: {
            scaleUp: { increment: 2, maxInstances: resource.limits.max, cooldown: 300 },
            scaleDown: { decrement: 1, minInstances: resource.limits.min, cooldown: 600 },
          },
          schedule: {
            enabled: true,
            rules: [
              { name: 'Business Hours Scale Up', cron: '0 8 * * 1-5', targetCapacity: 20 },
              { name: 'Off Hours Scale Down', cron: '0 20 * * 1-5', targetCapacity: 10 },
            ],
          },
          constraints: {
            minCapacity: resource.limits.min,
            maxCapacity: resource.limits.max,
            maxScalePercentage: 50,
            quietPeriods: [
              { start: '00:00', end: '06:00', reason: 'Maintenance window' },
            ],
          },
          metadata: {
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
            lastTriggered: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            triggerCount: Math.floor(Math.random() * 100) + 20,
          },
        };
        this.policies.set(policy.id, policy);
      }

      // Create demand pattern
      const pattern: DemandPattern = {
        id: `pattern-${resource.id}`,
        resourceId: resource.id,
        name: `${resource.name} Weekly Pattern`,
        type: 'weekly',
        pattern: {
          hour: [0.6, 0.5, 0.4, 0.4, 0.5, 0.7, 0.9, 1.0, 1.0, 0.95, 0.9, 0.85, 0.8, 0.85, 0.9, 0.95, 1.0, 0.95, 0.85, 0.75, 0.65, 0.6, 0.55, 0.5],
          dayOfWeek: [0.6, 1.0, 1.0, 1.0, 1.0, 0.9, 0.5],
        },
        baselineMultiplier: 1.0,
        peakMultiplier: 1.5,
        confidence: 0.85,
        detectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      this.patterns.set(pattern.id, pattern);

      // Create optimization recommendation
      if (Math.random() > 0.5) {
        const recommendation: OptimizationRecommendation = {
          id: `rec-${resource.id}`,
          resourceId: resource.id,
          resourceName: resource.name,
          type: ['rightsizing', 'reservation', 'scheduling'][Math.floor(Math.random() * 3)] as OptimizationRecommendation['type'],
          title: `Optimize ${resource.name}`,
          description: `Based on usage patterns, ${resource.name} can be optimized for cost savings`,
          impact: {
            costSavings: Math.floor(Math.random() * 500) + 100,
            performanceImpact: 'neutral',
            riskLevel: 'low',
          },
          status: 'new',
          effort: ['low', 'medium'][Math.floor(Math.random() * 2)] as OptimizationRecommendation['effort'],
          priority: Math.floor(Math.random() * 5) + 1,
          implementation: {
            steps: ['Review current configuration', 'Apply recommended changes', 'Monitor for 7 days', 'Validate savings'],
            estimatedTime: 4,
            prerequisites: ['Access to cloud console', 'Approval from team lead'],
          },
          metadata: {
            createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        };
        this.recommendations.set(recommendation.id, recommendation);
      }
    });

    // Create allocations
    const consumersData = [
      { name: 'User Service', type: 'service' },
      { name: 'Platform Team', type: 'team' },
      { name: 'Analytics Project', type: 'project' },
      { name: 'Production Environment', type: 'environment' },
    ];

    const resourcesList = Array.from(this.resources.values());
    consumersData.forEach((consumer, cIdx) => {
      resourcesList.forEach((resource, rIdx) => {
        if ((cIdx + rIdx) % 3 === 0) {
          const allocation: ResourceAllocation = {
            id: `alloc-${cIdx}-${rIdx}`,
            resourceId: resource.id,
            resourceName: resource.name,
            consumerId: `consumer-${cIdx}`,
            consumerName: consumer.name,
            consumerType: consumer.type as ResourceAllocation['consumerType'],
            allocated: Math.floor(resource.limits.max * (0.1 + Math.random() * 0.3)),
            used: Math.floor(resource.limits.max * (0.05 + Math.random() * 0.2)),
            reserved: Math.floor(resource.limits.max * 0.05),
            priority: Math.floor(Math.random() * 5) + 1,
            startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            status: 'active',
            quotas: {
              daily: Math.floor(resource.limits.max * 0.5),
              monthly: resource.limits.max * 15,
            },
            metadata: {
              createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
              createdBy: 'admin',
              updatedAt: new Date(),
            },
          };
          this.allocations.set(allocation.id, allocation);
        }
      });
    });

    // Create capacity plans
    const plansData = [
      { name: 'Q4 Capacity Expansion', status: 'approved', horizon: 'medium' },
      { name: 'Holiday Season Preparation', status: 'in_progress', horizon: 'short' },
      { name: 'Next Year Infrastructure', status: 'draft', horizon: 'long' },
    ];

    plansData.forEach((p, idx) => {
      const plan: CapacityPlan = {
        id: `plan-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: `Capacity plan for ${p.name.toLowerCase()}`,
        status: p.status as CapacityPlan['status'],
        horizon: p.horizon as PlanningHorizon,
        startDate: new Date(Date.now() + idx * 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + (idx + 3) * 30 * 24 * 60 * 60 * 1000),
        owner: {
          userId: 'user-0001',
          userName: 'John Smith',
        },
        resources: resourcesList.slice(0, 4).map((r) => ({
          resourceId: r.id,
          resourceName: r.name,
          currentCapacity: r.limits.max,
          plannedCapacity: Math.floor(r.limits.max * 1.2),
          actions: [
            {
              id: `action-${r.id}-1`,
              type: 'scale_up',
              description: `Increase ${r.name} capacity by 20%`,
              status: p.status === 'in_progress' ? 'in_progress' : 'pending',
              scheduledDate: new Date(Date.now() + (idx + 1) * 30 * 24 * 60 * 60 * 1000),
              cost: Math.floor(r.cost.unitCost * r.limits.max * 0.2 * 720),
              impact: 'Improved capacity headroom',
              dependencies: [],
            },
          ],
        })),
        budget: {
          allocated: 50000,
          estimated: 35000 + idx * 10000,
          currency: 'USD',
        },
        approvals: [
          {
            approverId: 'user-manager',
            approverName: 'Engineering Manager',
            status: p.status !== 'draft' ? 'approved' : 'pending',
            timestamp: p.status !== 'draft' ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : undefined,
          },
          {
            approverId: 'user-finance',
            approverName: 'Finance Director',
            status: p.status !== 'draft' ? 'approved' : 'pending',
            timestamp: p.status !== 'draft' ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) : undefined,
          },
        ],
        milestones: [
          { id: 'm1', name: 'Plan Approval', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), completed: p.status !== 'draft' },
          { id: 'm2', name: 'Resource Provisioning', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), completed: false },
          { id: 'm3', name: 'Validation Complete', date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), completed: false },
        ],
        risks: [
          { id: 'r1', description: 'Vendor capacity constraints', probability: 'low', impact: 'high', mitigation: 'Multi-vendor strategy' },
          { id: 'r2', description: 'Budget overrun', probability: 'medium', impact: 'medium', mitigation: 'Phased implementation' },
        ],
        metadata: {
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          createdBy: 'user-0001',
          updatedAt: new Date(),
          version: idx + 1,
        },
      };
      this.plans.set(plan.id, plan);
    });

    // Create capacity report
    const report: CapacityReport = {
      id: 'report-0001',
      name: 'Monthly Capacity Report',
      type: 'summary',
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      generatedAt: new Date(),
      generatedBy: 'system',
      resources: resourcesList.map((r) => {
        const latestMetrics = this.metrics.get(r.id)?.[0];
        return {
          resourceId: r.id,
          resourceName: r.name,
          type: r.type,
          metrics: {
            avgUtilization: latestMetrics?.avgUtilization || 60,
            peakUtilization: latestMetrics?.peakUtilization || 85,
            avgAvailable: latestMetrics?.available || 100,
            trend: latestMetrics?.trend.direction || 'stable',
          },
          status: (latestMetrics?.utilization || 60) > 85 ? 'critical' : (latestMetrics?.utilization || 60) > 70 ? 'warning' : 'healthy',
          recommendations: ['Monitor utilization trends', 'Review scaling policies'],
        };
      }),
      summary: {
        totalResources: resourcesList.length,
        healthyResources: 5,
        warningResources: 2,
        criticalResources: 1,
        overallUtilization: 65,
        totalCost: 25000,
        costTrend: 5,
      },
      insights: [
        { title: 'Database approaching capacity', description: 'PostgreSQL Primary is at 82% utilization', priority: 'high', actionable: true },
        { title: 'Cost optimization opportunity', description: 'Reserved instance savings available for compute resources', priority: 'medium', actionable: true },
      ],
    };
    this.reports.set(report.id, report);
  }

  // Resource Operations
  public getResources(type?: ResourceType): ResourceDefinition[] {
    let resources = Array.from(this.resources.values());
    if (type) resources = resources.filter((r) => r.type === type);
    return resources.sort((a, b) => a.name.localeCompare(b.name));
  }

  public getResourceById(id: string): ResourceDefinition | undefined {
    return this.resources.get(id);
  }

  public getResourceMetrics(resourceId: string, days: number = 30): CapacityMetric[] {
    const metrics = this.metrics.get(resourceId) || [];
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return metrics.filter((m) => m.timestamp >= cutoff);
  }

  public getCurrentCapacityStatus(resourceId: string): CapacityStatus {
    const metrics = this.metrics.get(resourceId);
    if (!metrics || metrics.length === 0) return 'healthy';
    const latest = metrics[metrics.length - 1];
    if (latest.utilization >= 95) return 'exceeded';
    if (latest.utilization >= 85) return 'critical';
    if (latest.utilization >= 70) return 'warning';
    return 'healthy';
  }

  // Threshold Operations
  public getThresholds(resourceId?: string): CapacityThreshold[] {
    let thresholds = Array.from(this.thresholds.values());
    if (resourceId) thresholds = thresholds.filter((t) => t.resourceId === resourceId);
    return thresholds;
  }

  // Forecast Operations
  public getForecasts(): CapacityForecast[] {
    return Array.from(this.forecasts.values());
  }

  public getForecastByResourceId(resourceId: string): CapacityForecast | undefined {
    return Array.from(this.forecasts.values()).find((f) => f.resourceId === resourceId);
  }

  // Plan Operations
  public getPlans(status?: CapacityPlan['status']): CapacityPlan[] {
    let plans = Array.from(this.plans.values());
    if (status) plans = plans.filter((p) => p.status === status);
    return plans.sort((a, b) => b.metadata.updatedAt.getTime() - a.metadata.updatedAt.getTime());
  }

  public getPlanById(id: string): CapacityPlan | undefined {
    return this.plans.get(id);
  }

  public createPlan(data: Partial<CapacityPlan>): CapacityPlan {
    const plan: CapacityPlan = {
      id: `plan-${this.generateId()}`,
      name: data.name || '',
      description: data.description || '',
      status: 'draft',
      horizon: data.horizon || 'short',
      startDate: data.startDate || new Date(),
      endDate: data.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      owner: data.owner || { userId: '', userName: '' },
      resources: data.resources || [],
      budget: data.budget || { allocated: 0, estimated: 0, currency: 'USD' },
      approvals: [],
      milestones: [],
      risks: [],
      metadata: {
        createdAt: new Date(),
        createdBy: data.owner?.userId || 'system',
        updatedAt: new Date(),
        version: 1,
      },
    };

    this.plans.set(plan.id, plan);
    this.emit('plan_created', plan);
    return plan;
  }

  // Allocation Operations
  public getAllocations(resourceId?: string, consumerId?: string): ResourceAllocation[] {
    let allocations = Array.from(this.allocations.values());
    if (resourceId) allocations = allocations.filter((a) => a.resourceId === resourceId);
    if (consumerId) allocations = allocations.filter((a) => a.consumerId === consumerId);
    return allocations;
  }

  public createAllocation(data: Partial<ResourceAllocation>): ResourceAllocation {
    const allocation: ResourceAllocation = {
      id: `alloc-${this.generateId()}`,
      resourceId: data.resourceId || '',
      resourceName: data.resourceName || '',
      consumerId: data.consumerId || '',
      consumerName: data.consumerName || '',
      consumerType: data.consumerType || 'service',
      allocated: data.allocated || 0,
      used: 0,
      reserved: data.reserved || 0,
      priority: data.priority || 5,
      startDate: data.startDate || new Date(),
      status: 'active',
      quotas: data.quotas || {},
      metadata: {
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
      },
    };

    this.allocations.set(allocation.id, allocation);
    this.emit('allocation_created', allocation);
    return allocation;
  }

  // Policy Operations
  public getPolicies(resourceId?: string): ScalingPolicy[] {
    let policies = Array.from(this.policies.values());
    if (resourceId) policies = policies.filter((p) => p.resourceId === resourceId);
    return policies;
  }

  public getPolicyById(id: string): ScalingPolicy | undefined {
    return this.policies.get(id);
  }

  // Report Operations
  public getReports(): CapacityReport[] {
    return Array.from(this.reports.values());
  }

  public getReportById(id: string): CapacityReport | undefined {
    return this.reports.get(id);
  }

  // Pattern Operations
  public getPatterns(resourceId?: string): DemandPattern[] {
    let patterns = Array.from(this.patterns.values());
    if (resourceId) patterns = patterns.filter((p) => p.resourceId === resourceId);
    return patterns;
  }

  // Recommendation Operations
  public getRecommendations(status?: OptimizationRecommendation['status']): OptimizationRecommendation[] {
    let recommendations = Array.from(this.recommendations.values());
    if (status) recommendations = recommendations.filter((r) => r.status === status);
    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  public implementRecommendation(id: string): OptimizationRecommendation {
    const recommendation = this.recommendations.get(id);
    if (!recommendation) throw new Error('Recommendation not found');

    recommendation.status = 'implemented';
    recommendation.metadata.implementedAt = new Date();

    this.emit('recommendation_implemented', recommendation);
    return recommendation;
  }

  // Statistics
  public getStatistics(): CapacityStatistics {
    const resources = Array.from(this.resources.values());
    const forecasts = Array.from(this.forecasts.values());

    const resourcesByType = resources.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {} as Record<ResourceType, number>);

    const statusCounts = resources.reduce((acc, r) => {
      const status = this.getCurrentCapacityStatus(r.id);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<CapacityStatus, number>);

    const costByType = resources.reduce((acc, r) => {
      const monthlyCost = r.cost.unitCost * r.limits.max * 720;
      acc[r.type] = (acc[r.type] || 0) + monthlyCost;
      return acc;
    }, {} as Record<ResourceType, number>);

    const totalCost = Object.values(costByType).reduce((sum, c) => sum + c, 0);

    return {
      overview: {
        totalResources: resources.length,
        resourcesByType,
        resourcesByStatus: statusCounts,
        avgUtilization: 65,
        totalCapacity: resources.reduce((sum, r) => sum + r.limits.max, 0),
        usedCapacity: resources.reduce((sum, r) => sum + r.limits.max * 0.65, 0),
      },
      cost: {
        totalMonthlyCost: totalCost,
        costByResourceType: costByType,
        projectedCost: totalCost * 1.1,
        savingsOpportunities: Array.from(this.recommendations.values())
          .reduce((sum, r) => sum + r.impact.costSavings, 0),
      },
      health: {
        healthyPercentage: ((statusCounts['healthy'] || 0) / resources.length) * 100,
        warningPercentage: ((statusCounts['warning'] || 0) / resources.length) * 100,
        criticalPercentage: ((statusCounts['critical'] || 0) / resources.length) * 100,
        exceededPercentage: ((statusCounts['exceeded'] || 0) / resources.length) * 100,
      },
      trends: [],
      forecasts: forecasts.map((f) => ({
        resourceId: f.resourceId,
        resourceName: f.resourceName,
        exhaustionRisk: f.insights.riskLevel,
        daysToExhaustion: f.insights.exhaustionDate
          ? Math.floor((f.insights.exhaustionDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
          : undefined,
      })),
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

export const capacityPlanningService = CapacityPlanningService.getInstance();
export type {
  ResourceType,
  CapacityStatus,
  PlanningHorizon,
  ScalingDirection,
  ResourceDefinition,
  CapacityMetric,
  CapacityThreshold,
  CapacityForecast,
  CapacityPlan,
  PlanAction,
  ResourceAllocation,
  ScalingPolicy,
  CapacityReport,
  DemandPattern,
  OptimizationRecommendation,
  CapacityStatistics,
};
