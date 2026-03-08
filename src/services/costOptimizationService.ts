/**
 * Cost Optimization Service
 * Comprehensive cloud cost management, optimization recommendations, and budget tracking
 */

// Cloud provider type
type CloudProvider = 'aws' | 'azure' | 'gcp' | 'digitalocean' | 'other';

// Resource category
type ResourceCategory = 
  | 'compute' 
  | 'storage' 
  | 'network' 
  | 'database' 
  | 'serverless' 
  | 'container' 
  | 'analytics' 
  | 'ai_ml' 
  | 'other';

// Cost trend direction
type TrendDirection = 'increasing' | 'decreasing' | 'stable';

// Optimization status
type OptimizationStatus = 'new' | 'in_progress' | 'implemented' | 'dismissed' | 'expired';

// Alert severity
type AlertSeverity = 'info' | 'warning' | 'critical';

// Cloud Account
interface CloudAccount {
  id: string;
  name: string;
  provider: CloudProvider;
  accountId: string;
  region: string;
  status: 'active' | 'inactive' | 'suspended';
  credentials: {
    type: 'role' | 'access_key' | 'service_account';
    lastRotated: Date;
    expiresAt?: Date;
  };
  tags: Record<string, string>;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastSynced: Date;
  };
}

// Cost Record
interface CostRecord {
  id: string;
  accountId: string;
  date: Date;
  provider: CloudProvider;
  service: string;
  category: ResourceCategory;
  region: string;
  resourceId?: string;
  resourceName?: string;
  usage: {
    quantity: number;
    unit: string;
  };
  cost: {
    amount: number;
    currency: string;
    listPrice: number;
    discount: number;
    credit: number;
  };
  tags: Record<string, string>;
  metadata: {
    invoiceId?: string;
    linkedAccountId?: string;
  };
}

// Cost Summary
interface CostSummary {
  period: {
    start: Date;
    end: Date;
  };
  totalCost: number;
  currency: string;
  byProvider: {
    provider: CloudProvider;
    cost: number;
    percentage: number;
  }[];
  byCategory: {
    category: ResourceCategory;
    cost: number;
    percentage: number;
  }[];
  byService: {
    service: string;
    cost: number;
    percentage: number;
  }[];
  byRegion: {
    region: string;
    cost: number;
    percentage: number;
  }[];
  byTag: {
    tag: string;
    value: string;
    cost: number;
  }[];
  trend: {
    direction: TrendDirection;
    changePercent: number;
    previousPeriodCost: number;
  };
}

// Budget
interface Budget {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  scope: {
    accounts?: string[];
    providers?: CloudProvider[];
    categories?: ResourceCategory[];
    services?: string[];
    tags?: Record<string, string>;
  };
  alerts: {
    threshold: number;
    type: 'actual' | 'forecasted';
    recipients: string[];
    channels: ('email' | 'slack' | 'webhook')[];
  }[];
  tracking: {
    currentSpend: number;
    forecastedSpend: number;
    utilizationPercent: number;
    status: 'on_track' | 'at_risk' | 'exceeded';
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Cost Anomaly
interface CostAnomaly {
  id: string;
  accountId: string;
  detectedAt: Date;
  service: string;
  category: ResourceCategory;
  region: string;
  anomalyType: 'spike' | 'unusual_growth' | 'new_resource' | 'pricing_change';
  severity: AlertSeverity;
  impact: {
    dailyCostIncrease: number;
    estimatedMonthlyImpact: number;
    percentageIncrease: number;
  };
  baseline: {
    avgDailyCost: number;
    stdDeviation: number;
  };
  current: {
    dailyCost: number;
    zscore: number;
  };
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  rootCause?: string;
  resolution?: string;
  assignee?: {
    userId: string;
    userName: string;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
  };
}

// Optimization Recommendation
interface CostOptimizationRecommendation {
  id: string;
  accountId: string;
  provider: CloudProvider;
  category: ResourceCategory;
  type: 
    | 'rightsizing' 
    | 'reserved_instances' 
    | 'spot_instances' 
    | 'idle_resources' 
    | 'storage_optimization' 
    | 'network_optimization'
    | 'license_optimization'
    | 'architecture_change';
  title: string;
  description: string;
  resourceId?: string;
  resourceName?: string;
  region?: string;
  impact: {
    estimatedMonthlySavings: number;
    estimatedAnnualSavings: number;
    savingsPercentage: number;
    confidence: number;
  };
  effort: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium' | 'high';
  priority: number;
  status: OptimizationStatus;
  implementation: {
    steps: string[];
    automatable: boolean;
    estimatedTime: string;
    prerequisites: string[];
  };
  evidence: {
    currentConfig: Record<string, unknown>;
    recommendedConfig: Record<string, unknown>;
    utilizationData?: {
      metric: string;
      avg: number;
      max: number;
      p95: number;
    }[];
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    implementedAt?: Date;
    expiresAt: Date;
  };
}

// Reserved Instance
interface ReservedInstance {
  id: string;
  accountId: string;
  provider: CloudProvider;
  service: string;
  instanceType: string;
  region: string;
  quantity: number;
  term: '1_year' | '3_year';
  paymentOption: 'all_upfront' | 'partial_upfront' | 'no_upfront';
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  pricing: {
    upfrontCost: number;
    hourlyCost: number;
    effectiveHourlyCost: number;
    totalCost: number;
    savingsVsOnDemand: number;
    savingsPercentage: number;
  };
  utilization: {
    usedHours: number;
    totalHours: number;
    utilizationPercent: number;
    unusedValue: number;
  };
  linkedInstances: {
    instanceId: string;
    instanceName: string;
    coveredHours: number;
  }[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Savings Plan
interface SavingsPlan {
  id: string;
  accountId: string;
  provider: CloudProvider;
  type: 'compute' | 'ec2_instance' | 'sagemaker';
  commitment: number;
  term: '1_year' | '3_year';
  paymentOption: 'all_upfront' | 'partial_upfront' | 'no_upfront';
  status: 'active' | 'pending' | 'expired';
  startDate: Date;
  endDate: Date;
  utilization: {
    usedCommitment: number;
    totalCommitment: number;
    utilizationPercent: number;
    netSavings: number;
  };
  coverage: {
    coveredUsage: number;
    onDemandUsage: number;
    coveragePercent: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Cost Allocation Tag
interface CostAllocationTag {
  id: string;
  key: string;
  description: string;
  status: 'active' | 'inactive';
  type: 'user_defined' | 'aws_generated';
  coverage: {
    totalResources: number;
    taggedResources: number;
    coveragePercent: number;
    untaggedCost: number;
  };
  values: {
    value: string;
    resourceCount: number;
    totalCost: number;
  }[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Cost Report
interface CostReport {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  format: 'pdf' | 'csv' | 'xlsx' | 'json';
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone: string;
  };
  filters: {
    accounts?: string[];
    providers?: CloudProvider[];
    categories?: ResourceCategory[];
    services?: string[];
    regions?: string[];
    tags?: Record<string, string>;
    dateRange: {
      start: Date;
      end: Date;
    };
  };
  groupBy: string[];
  recipients: {
    email: string;
    name: string;
  }[];
  lastGenerated?: Date;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Cost Forecast
interface CostForecast {
  id: string;
  accountId?: string;
  period: {
    start: Date;
    end: Date;
  };
  granularity: 'daily' | 'weekly' | 'monthly';
  model: {
    type: 'linear' | 'exponential' | 'seasonal' | 'ml_based';
    accuracy: number;
    lastTrained: Date;
  };
  predictions: {
    date: Date;
    predicted: number;
    lowerBound: number;
    upperBound: number;
    confidence: number;
  }[];
  summary: {
    totalForecast: number;
    avgDailyCost: number;
    peakDailyCost: number;
    trendDirection: TrendDirection;
    changeFromCurrent: number;
  };
  metadata: {
    generatedAt: Date;
    validUntil: Date;
  };
}

// Chargeback Record
interface ChargebackRecord {
  id: string;
  period: {
    start: Date;
    end: Date;
  };
  costCenter: {
    id: string;
    name: string;
    owner: string;
  };
  allocation: {
    method: 'direct' | 'proportional' | 'fixed' | 'custom';
    percentage?: number;
    fixedAmount?: number;
  };
  costs: {
    totalAllocated: number;
    byCategory: Record<ResourceCategory, number>;
    byService: Record<string, number>;
  };
  adjustments: {
    type: 'credit' | 'debit';
    amount: number;
    reason: string;
    approvedBy: string;
  }[];
  status: 'draft' | 'pending_approval' | 'approved' | 'invoiced';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    approvedAt?: Date;
  };
}

// Cost Statistics
interface CostStatistics {
  overview: {
    totalMonthToDate: number;
    totalLastMonth: number;
    totalYearToDate: number;
    avgDailyCost: number;
    trend: TrendDirection;
    changePercent: number;
  };
  savings: {
    totalSavings: number;
    riSavings: number;
    spotSavings: number;
    optimizationSavings: number;
    potentialSavings: number;
  };
  coverage: {
    riCoverage: number;
    spotCoverage: number;
    onDemandCoverage: number;
  };
  efficiency: {
    wastedSpend: number;
    idleResourcesCost: number;
    unusedCommitments: number;
    overProvisionedCost: number;
  };
  trends: {
    date: string;
    cost: number;
    forecast: number;
    budget: number;
  }[];
}

class CostOptimizationService {
  private static instance: CostOptimizationService;
  private accounts: Map<string, CloudAccount> = new Map();
  private costRecords: Map<string, CostRecord[]> = new Map();
  private budgets: Map<string, Budget> = new Map();
  private anomalies: Map<string, CostAnomaly> = new Map();
  private recommendations: Map<string, CostOptimizationRecommendation> = new Map();
  private reservedInstances: Map<string, ReservedInstance> = new Map();
  private savingsPlans: Map<string, SavingsPlan> = new Map();
  private tags: Map<string, CostAllocationTag> = new Map();
  private reports: Map<string, CostReport> = new Map();
  private forecasts: Map<string, CostForecast> = new Map();
  private chargebacks: Map<string, ChargebackRecord> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CostOptimizationService {
    if (!CostOptimizationService.instance) {
      CostOptimizationService.instance = new CostOptimizationService();
    }
    return CostOptimizationService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Cloud Accounts
    const accountsData = [
      { name: 'Production AWS', provider: 'aws', region: 'us-east-1' },
      { name: 'Production GCP', provider: 'gcp', region: 'us-central1' },
      { name: 'Development AWS', provider: 'aws', region: 'us-west-2' },
      { name: 'Staging Azure', provider: 'azure', region: 'eastus' },
    ];

    accountsData.forEach((a, idx) => {
      const account: CloudAccount = {
        id: `acc-${(idx + 1).toString().padStart(4, '0')}`,
        name: a.name,
        provider: a.provider as CloudProvider,
        accountId: `${idx + 100000000000}`,
        region: a.region,
        status: 'active',
        credentials: {
          type: 'role',
          lastRotated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        tags: {
          environment: a.name.toLowerCase().includes('prod') ? 'production' : 
                       a.name.toLowerCase().includes('dev') ? 'development' : 'staging',
          team: 'platform',
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          lastSynced: new Date(),
        },
      };
      this.accounts.set(account.id, account);

      // Generate cost records for each account
      const services = [
        { name: 'EC2', category: 'compute' },
        { name: 'S3', category: 'storage' },
        { name: 'RDS', category: 'database' },
        { name: 'Lambda', category: 'serverless' },
        { name: 'EKS', category: 'container' },
        { name: 'CloudFront', category: 'network' },
      ];

      const records: CostRecord[] = [];
      for (let day = 30; day >= 0; day--) {
        services.forEach((service, sIdx) => {
          const baseCost = (sIdx + 1) * 100 + Math.random() * 50;
          const record: CostRecord = {
            id: `cost-${account.id}-${day}-${sIdx}`,
            accountId: account.id,
            date: new Date(Date.now() - day * 24 * 60 * 60 * 1000),
            provider: account.provider,
            service: service.name,
            category: service.category as ResourceCategory,
            region: account.region,
            usage: {
              quantity: Math.floor(Math.random() * 1000) + 100,
              unit: service.category === 'compute' ? 'hours' : 'GB',
            },
            cost: {
              amount: baseCost * (account.name.includes('Production') ? 3 : 1),
              currency: 'USD',
              listPrice: baseCost * 1.2,
              discount: baseCost * 0.1,
              credit: 0,
            },
            tags: {
              environment: account.tags.environment,
              service: service.name.toLowerCase(),
            },
            metadata: {},
          };
          records.push(record);
        });
      }
      this.costRecords.set(account.id, records);
    });

    // Initialize Budgets
    const budgetsData = [
      { name: 'Monthly Infrastructure Budget', amount: 50000, period: 'monthly' },
      { name: 'Development Environment Budget', amount: 10000, period: 'monthly' },
      { name: 'Q4 Cloud Spend Budget', amount: 150000, period: 'quarterly' },
    ];

    budgetsData.forEach((b, idx) => {
      const budget: Budget = {
        id: `budget-${(idx + 1).toString().padStart(4, '0')}`,
        name: b.name,
        description: `Budget for ${b.name.toLowerCase()}`,
        amount: b.amount,
        currency: 'USD',
        period: b.period as Budget['period'],
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        scope: {
          providers: ['aws', 'gcp', 'azure'],
        },
        alerts: [
          { threshold: 50, type: 'actual', recipients: ['finance@rescueping.com'], channels: ['email'] },
          { threshold: 75, type: 'actual', recipients: ['finance@rescueping.com', 'platform@rescueping.com'], channels: ['email', 'slack'] },
          { threshold: 90, type: 'forecasted', recipients: ['cto@rescueping.com'], channels: ['email', 'slack'] },
        ],
        tracking: {
          currentSpend: b.amount * (0.5 + Math.random() * 0.3),
          forecastedSpend: b.amount * (0.9 + Math.random() * 0.2),
          utilizationPercent: 60 + Math.random() * 30,
          status: Math.random() > 0.7 ? 'at_risk' : 'on_track',
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.budgets.set(budget.id, budget);
    });

    // Initialize Anomalies
    const anomaliesData = [
      { service: 'EC2', type: 'spike', severity: 'warning' },
      { service: 'S3', type: 'unusual_growth', severity: 'info' },
      { service: 'RDS', type: 'pricing_change', severity: 'critical' },
    ];

    anomaliesData.forEach((a, idx) => {
      const anomaly: CostAnomaly = {
        id: `anomaly-${(idx + 1).toString().padStart(4, '0')}`,
        accountId: 'acc-0001',
        detectedAt: new Date(Date.now() - idx * 3 * 24 * 60 * 60 * 1000),
        service: a.service,
        category: a.service === 'EC2' ? 'compute' : a.service === 'S3' ? 'storage' : 'database',
        region: 'us-east-1',
        anomalyType: a.type as CostAnomaly['anomalyType'],
        severity: a.severity as AlertSeverity,
        impact: {
          dailyCostIncrease: Math.floor(Math.random() * 500) + 100,
          estimatedMonthlyImpact: Math.floor(Math.random() * 15000) + 3000,
          percentageIncrease: Math.floor(Math.random() * 50) + 20,
        },
        baseline: {
          avgDailyCost: 500 + Math.random() * 200,
          stdDeviation: 50 + Math.random() * 30,
        },
        current: {
          dailyCost: 800 + Math.random() * 300,
          zscore: 2 + Math.random() * 2,
        },
        status: idx === 0 ? 'open' : idx === 1 ? 'investigating' : 'resolved',
        rootCause: idx === 2 ? 'Reserved instance expired' : undefined,
        metadata: {
          createdAt: new Date(Date.now() - idx * 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          resolvedAt: idx === 2 ? new Date() : undefined,
        },
      };
      this.anomalies.set(anomaly.id, anomaly);
    });

    // Initialize Recommendations
    const recommendationsData = [
      { type: 'rightsizing', title: 'Rightsize EC2 instances', savings: 2500 },
      { type: 'reserved_instances', title: 'Purchase Reserved Instances', savings: 8000 },
      { type: 'idle_resources', title: 'Delete idle EBS volumes', savings: 500 },
      { type: 'spot_instances', title: 'Use Spot Instances for batch jobs', savings: 3000 },
      { type: 'storage_optimization', title: 'Move to S3 Intelligent-Tiering', savings: 1200 },
      { type: 'network_optimization', title: 'Optimize data transfer', savings: 800 },
    ];

    recommendationsData.forEach((r, idx) => {
      const recommendation: CostOptimizationRecommendation = {
        id: `rec-${(idx + 1).toString().padStart(4, '0')}`,
        accountId: 'acc-0001',
        provider: 'aws',
        category: ['compute', 'compute', 'storage', 'compute', 'storage', 'network'][idx] as ResourceCategory,
        type: r.type as CostOptimizationRecommendation['type'],
        title: r.title,
        description: `Recommendation to ${r.title.toLowerCase()} for cost optimization`,
        resourceId: `resource-${idx}`,
        resourceName: `Resource ${idx + 1}`,
        region: 'us-east-1',
        impact: {
          estimatedMonthlySavings: r.savings,
          estimatedAnnualSavings: r.savings * 12,
          savingsPercentage: Math.floor(Math.random() * 30) + 10,
          confidence: 0.8 + Math.random() * 0.15,
        },
        effort: ['low', 'medium', 'low', 'medium', 'low', 'medium'][idx] as CostOptimizationRecommendation['effort'],
        risk: 'low',
        priority: idx + 1,
        status: idx < 2 ? 'new' : idx < 4 ? 'in_progress' : 'implemented',
        implementation: {
          steps: [
            'Review current configuration',
            'Test changes in staging',
            'Apply changes in production',
            'Monitor for 7 days',
          ],
          automatable: idx % 2 === 0,
          estimatedTime: ['15 minutes', '2 hours', '30 minutes', '1 hour', '45 minutes', '2 hours'][idx],
          prerequisites: ['AWS console access', 'Change approval'],
        },
        evidence: {
          currentConfig: { instanceType: 'm5.xlarge' },
          recommendedConfig: { instanceType: 'm5.large' },
          utilizationData: [
            { metric: 'CPU', avg: 15, max: 45, p95: 35 },
            { metric: 'Memory', avg: 30, max: 60, p95: 50 },
          ],
        },
        metadata: {
          createdAt: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          implementedAt: idx >= 4 ? new Date() : undefined,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      };
      this.recommendations.set(recommendation.id, recommendation);
    });

    // Initialize Reserved Instances
    const riData = [
      { instanceType: 'm5.xlarge', quantity: 10, term: '1_year' },
      { instanceType: 'r5.2xlarge', quantity: 5, term: '3_year' },
      { instanceType: 'c5.large', quantity: 20, term: '1_year' },
    ];

    riData.forEach((ri, idx) => {
      const reservedInstance: ReservedInstance = {
        id: `ri-${(idx + 1).toString().padStart(4, '0')}`,
        accountId: 'acc-0001',
        provider: 'aws',
        service: 'EC2',
        instanceType: ri.instanceType,
        region: 'us-east-1',
        quantity: ri.quantity,
        term: ri.term as ReservedInstance['term'],
        paymentOption: 'partial_upfront',
        status: 'active',
        startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + (ri.term === '1_year' ? 185 : 915) * 24 * 60 * 60 * 1000),
        pricing: {
          upfrontCost: ri.quantity * 500 * (ri.term === '3_year' ? 2 : 1),
          hourlyCost: 0.05 * ri.quantity,
          effectiveHourlyCost: 0.03 * ri.quantity,
          totalCost: ri.quantity * 1000 * (ri.term === '3_year' ? 2.5 : 1),
          savingsVsOnDemand: ri.quantity * 400 * (ri.term === '3_year' ? 2 : 1),
          savingsPercentage: ri.term === '3_year' ? 60 : 40,
        },
        utilization: {
          usedHours: Math.floor(Math.random() * 5000) + 3000,
          totalHours: 8760 * ri.quantity / 2,
          utilizationPercent: 75 + Math.random() * 20,
          unusedValue: Math.floor(Math.random() * 500),
        },
        linkedInstances: Array.from({ length: ri.quantity }, (_, i) => ({
          instanceId: `i-${i.toString().padStart(8, '0')}`,
          instanceName: `Instance ${i + 1}`,
          coveredHours: Math.floor(Math.random() * 720) + 400,
        })),
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.reservedInstances.set(reservedInstance.id, reservedInstance);
    });

    // Initialize Savings Plans
    const spData = [
      { type: 'compute', commitment: 5000, term: '1_year' },
      { type: 'ec2_instance', commitment: 3000, term: '3_year' },
    ];

    spData.forEach((sp, idx) => {
      const savingsPlan: SavingsPlan = {
        id: `sp-${(idx + 1).toString().padStart(4, '0')}`,
        accountId: 'acc-0001',
        provider: 'aws',
        type: sp.type as SavingsPlan['type'],
        commitment: sp.commitment,
        term: sp.term as SavingsPlan['term'],
        paymentOption: 'no_upfront',
        status: 'active',
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + (sp.term === '1_year' ? 275 : 1005) * 24 * 60 * 60 * 1000),
        utilization: {
          usedCommitment: sp.commitment * (0.7 + Math.random() * 0.25),
          totalCommitment: sp.commitment,
          utilizationPercent: 70 + Math.random() * 25,
          netSavings: sp.commitment * 0.3 * (sp.term === '3_year' ? 1.5 : 1),
        },
        coverage: {
          coveredUsage: sp.commitment * 1.2,
          onDemandUsage: sp.commitment * 0.3,
          coveragePercent: 80,
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.savingsPlans.set(savingsPlan.id, savingsPlan);
    });

    // Initialize Cost Allocation Tags
    const tagsData = [
      { key: 'environment', values: ['production', 'staging', 'development'] },
      { key: 'team', values: ['platform', 'product', 'data'] },
      { key: 'service', values: ['api', 'web', 'worker', 'database'] },
      { key: 'cost_center', values: ['engineering', 'operations', 'marketing'] },
    ];

    tagsData.forEach((t, idx) => {
      const tag: CostAllocationTag = {
        id: `tag-${(idx + 1).toString().padStart(4, '0')}`,
        key: t.key,
        description: `Cost allocation by ${t.key}`,
        status: 'active',
        type: 'user_defined',
        coverage: {
          totalResources: 500,
          taggedResources: Math.floor(Math.random() * 100) + 350,
          coveragePercent: 70 + Math.random() * 25,
          untaggedCost: Math.floor(Math.random() * 5000) + 1000,
        },
        values: t.values.map((v) => ({
          value: v,
          resourceCount: Math.floor(Math.random() * 100) + 50,
          totalCost: Math.floor(Math.random() * 20000) + 5000,
        })),
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.tags.set(tag.id, tag);
    });

    // Initialize Cost Reports
    const reportsData = [
      { name: 'Monthly Cost Summary', type: 'monthly' },
      { name: 'Weekly Spend Report', type: 'weekly' },
      { name: 'Daily Cost Breakdown', type: 'daily' },
    ];

    reportsData.forEach((r, idx) => {
      const report: CostReport = {
        id: `report-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name,
        description: `Automated ${r.name.toLowerCase()}`,
        type: r.type as CostReport['type'],
        format: 'pdf',
        schedule: {
          enabled: true,
          frequency: r.type as CostReport['schedule']['frequency'],
          time: '09:00',
          timezone: 'America/New_York',
        },
        filters: {
          providers: ['aws', 'gcp', 'azure'],
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            end: new Date(),
          },
        },
        groupBy: ['service', 'region'],
        recipients: [
          { email: 'finance@rescueping.com', name: 'Finance Team' },
          { email: 'platform@rescueping.com', name: 'Platform Team' },
        ],
        lastGenerated: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.reports.set(report.id, report);
    });

    // Initialize Forecast
    const forecast: CostForecast = {
      id: 'forecast-0001',
      period: {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      granularity: 'daily',
      model: {
        type: 'ml_based',
        accuracy: 0.92,
        lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      predictions: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
        predicted: 1500 + Math.random() * 500 + i * 10,
        lowerBound: 1300 + Math.random() * 400 + i * 8,
        upperBound: 1700 + Math.random() * 600 + i * 12,
        confidence: 0.95 - i * 0.01,
      })),
      summary: {
        totalForecast: 50000,
        avgDailyCost: 1667,
        peakDailyCost: 2200,
        trendDirection: 'increasing',
        changeFromCurrent: 5,
      },
      metadata: {
        generatedAt: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    };
    this.forecasts.set(forecast.id, forecast);

    // Initialize Chargeback Records
    const costCentersData = [
      { name: 'Engineering', owner: 'John Smith' },
      { name: 'Product', owner: 'Sarah Johnson' },
      { name: 'Operations', owner: 'Mike Chen' },
    ];

    costCentersData.forEach((cc, idx) => {
      const chargeback: ChargebackRecord = {
        id: `cb-${(idx + 1).toString().padStart(4, '0')}`,
        period: {
          start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          end: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
        },
        costCenter: {
          id: `cc-${idx + 1}`,
          name: cc.name,
          owner: cc.owner,
        },
        allocation: {
          method: 'proportional',
          percentage: [50, 30, 20][idx],
        },
        costs: {
          totalAllocated: Math.floor([50000, 30000, 20000][idx] * (0.9 + Math.random() * 0.2)),
          byCategory: {
            compute: Math.floor(Math.random() * 10000) + 5000,
            storage: Math.floor(Math.random() * 5000) + 2000,
            network: Math.floor(Math.random() * 3000) + 1000,
            database: Math.floor(Math.random() * 8000) + 3000,
            serverless: Math.floor(Math.random() * 2000) + 500,
            container: Math.floor(Math.random() * 4000) + 1500,
            analytics: Math.floor(Math.random() * 2000) + 500,
            ai_ml: Math.floor(Math.random() * 1000) + 200,
            other: Math.floor(Math.random() * 500) + 100,
          },
          byService: {
            EC2: Math.floor(Math.random() * 8000) + 3000,
            S3: Math.floor(Math.random() * 3000) + 1000,
            RDS: Math.floor(Math.random() * 5000) + 2000,
            Lambda: Math.floor(Math.random() * 1000) + 500,
          },
        },
        adjustments: idx === 0 ? [
          { type: 'credit', amount: 500, reason: 'Promotional credit applied', approvedBy: 'admin' },
        ] : [],
        status: idx === 0 ? 'approved' : idx === 1 ? 'pending_approval' : 'draft',
        metadata: {
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          approvedAt: idx === 0 ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) : undefined,
        },
      };
      this.chargebacks.set(chargeback.id, chargeback);
    });
  }

  // Account Operations
  public getAccounts(): CloudAccount[] {
    return Array.from(this.accounts.values());
  }

  public getAccountById(id: string): CloudAccount | undefined {
    return this.accounts.get(id);
  }

  // Cost Operations
  public getCostRecords(accountId: string, days: number = 30): CostRecord[] {
    const records = this.costRecords.get(accountId) || [];
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return records.filter((r) => r.date >= cutoff);
  }

  public getCostSummary(accountId?: string, days: number = 30): CostSummary {
    const allRecords: CostRecord[] = [];
    
    if (accountId) {
      allRecords.push(...(this.costRecords.get(accountId) || []));
    } else {
      this.costRecords.forEach((records) => allRecords.push(...records));
    }

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const filteredRecords = allRecords.filter((r) => r.date >= cutoff);
    const totalCost = filteredRecords.reduce((sum, r) => sum + r.cost.amount, 0);

    const byProvider = ['aws', 'gcp', 'azure'].map((p) => {
      const cost = filteredRecords.filter((r) => r.provider === p).reduce((sum, r) => sum + r.cost.amount, 0);
      return { provider: p as CloudProvider, cost, percentage: totalCost > 0 ? (cost / totalCost) * 100 : 0 };
    });

    const byCategory = ['compute', 'storage', 'database', 'network', 'serverless', 'container'].map((c) => {
      const cost = filteredRecords.filter((r) => r.category === c).reduce((sum, r) => sum + r.cost.amount, 0);
      return { category: c as ResourceCategory, cost, percentage: totalCost > 0 ? (cost / totalCost) * 100 : 0 };
    });

    return {
      period: {
        start: cutoff,
        end: new Date(),
      },
      totalCost,
      currency: 'USD',
      byProvider,
      byCategory,
      byService: [],
      byRegion: [],
      byTag: [],
      trend: {
        direction: 'stable',
        changePercent: 5,
        previousPeriodCost: totalCost * 0.95,
      },
    };
  }

  // Budget Operations
  public getBudgets(): Budget[] {
    return Array.from(this.budgets.values());
  }

  public getBudgetById(id: string): Budget | undefined {
    return this.budgets.get(id);
  }

  public createBudget(data: Partial<Budget>): Budget {
    const budget: Budget = {
      id: `budget-${this.generateId()}`,
      name: data.name || '',
      description: data.description || '',
      amount: data.amount || 0,
      currency: data.currency || 'USD',
      period: data.period || 'monthly',
      startDate: data.startDate || new Date(),
      scope: data.scope || {},
      alerts: data.alerts || [],
      tracking: {
        currentSpend: 0,
        forecastedSpend: 0,
        utilizationPercent: 0,
        status: 'on_track',
      },
      metadata: {
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
      },
    };

    this.budgets.set(budget.id, budget);
    this.emit('budget_created', budget);
    return budget;
  }

  // Anomaly Operations
  public getAnomalies(status?: CostAnomaly['status']): CostAnomaly[] {
    let anomalies = Array.from(this.anomalies.values());
    if (status) anomalies = anomalies.filter((a) => a.status === status);
    return anomalies.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
  }

  public getAnomalyById(id: string): CostAnomaly | undefined {
    return this.anomalies.get(id);
  }

  public resolveAnomaly(id: string, resolution: string): CostAnomaly {
    const anomaly = this.anomalies.get(id);
    if (!anomaly) throw new Error('Anomaly not found');

    anomaly.status = 'resolved';
    anomaly.resolution = resolution;
    anomaly.metadata.resolvedAt = new Date();
    anomaly.metadata.updatedAt = new Date();

    this.emit('anomaly_resolved', anomaly);
    return anomaly;
  }

  // Recommendation Operations
  public getRecommendations(status?: OptimizationStatus): CostOptimizationRecommendation[] {
    let recommendations = Array.from(this.recommendations.values());
    if (status) recommendations = recommendations.filter((r) => r.status === status);
    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  public getRecommendationById(id: string): CostOptimizationRecommendation | undefined {
    return this.recommendations.get(id);
  }

  public implementRecommendation(id: string): CostOptimizationRecommendation {
    const recommendation = this.recommendations.get(id);
    if (!recommendation) throw new Error('Recommendation not found');

    recommendation.status = 'implemented';
    recommendation.metadata.implementedAt = new Date();
    recommendation.metadata.updatedAt = new Date();

    this.emit('recommendation_implemented', recommendation);
    return recommendation;
  }

  public getTotalPotentialSavings(): number {
    return Array.from(this.recommendations.values())
      .filter((r) => r.status === 'new' || r.status === 'in_progress')
      .reduce((sum, r) => sum + r.impact.estimatedMonthlySavings, 0);
  }

  // Reserved Instance Operations
  public getReservedInstances(): ReservedInstance[] {
    return Array.from(this.reservedInstances.values());
  }

  public getReservedInstanceById(id: string): ReservedInstance | undefined {
    return this.reservedInstances.get(id);
  }

  // Savings Plan Operations
  public getSavingsPlans(): SavingsPlan[] {
    return Array.from(this.savingsPlans.values());
  }

  public getSavingsPlanById(id: string): SavingsPlan | undefined {
    return this.savingsPlans.get(id);
  }

  // Tag Operations
  public getTags(): CostAllocationTag[] {
    return Array.from(this.tags.values());
  }

  public getTagById(id: string): CostAllocationTag | undefined {
    return this.tags.get(id);
  }

  // Report Operations
  public getReports(): CostReport[] {
    return Array.from(this.reports.values());
  }

  public getReportById(id: string): CostReport | undefined {
    return this.reports.get(id);
  }

  // Forecast Operations
  public getForecasts(): CostForecast[] {
    return Array.from(this.forecasts.values());
  }

  public getForecastById(id: string): CostForecast | undefined {
    return this.forecasts.get(id);
  }

  // Chargeback Operations
  public getChargebacks(): ChargebackRecord[] {
    return Array.from(this.chargebacks.values());
  }

  public getChargebackById(id: string): ChargebackRecord | undefined {
    return this.chargebacks.get(id);
  }

  // Statistics
  public getStatistics(): CostStatistics {
    const accounts = Array.from(this.accounts.values());
    const recommendations = Array.from(this.recommendations.values());
    const ris = Array.from(this.reservedInstances.values());
    const sps = Array.from(this.savingsPlans.values());

    let totalMonthToDate = 0;
    accounts.forEach((acc) => {
      const records = this.costRecords.get(acc.id) || [];
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      totalMonthToDate += records
        .filter((r) => r.date >= monthStart)
        .reduce((sum, r) => sum + r.cost.amount, 0);
    });

    const riSavings = ris.reduce((sum, ri) => sum + ri.pricing.savingsVsOnDemand, 0);
    const spSavings = sps.reduce((sum, sp) => sum + sp.utilization.netSavings, 0);
    const potentialSavings = recommendations
      .filter((r) => r.status === 'new' || r.status === 'in_progress')
      .reduce((sum, r) => sum + r.impact.estimatedMonthlySavings, 0);

    return {
      overview: {
        totalMonthToDate,
        totalLastMonth: totalMonthToDate * 0.95,
        totalYearToDate: totalMonthToDate * 10,
        avgDailyCost: totalMonthToDate / new Date().getDate(),
        trend: 'increasing',
        changePercent: 5,
      },
      savings: {
        totalSavings: riSavings + spSavings,
        riSavings,
        spotSavings: 2000,
        optimizationSavings: recommendations
          .filter((r) => r.status === 'implemented')
          .reduce((sum, r) => sum + r.impact.estimatedMonthlySavings, 0),
        potentialSavings,
      },
      coverage: {
        riCoverage: ris.reduce((sum, ri) => sum + ri.utilization.utilizationPercent, 0) / ris.length || 0,
        spotCoverage: 15,
        onDemandCoverage: 30,
      },
      efficiency: {
        wastedSpend: Math.floor(totalMonthToDate * 0.1),
        idleResourcesCost: Math.floor(totalMonthToDate * 0.05),
        unusedCommitments: ris.reduce((sum, ri) => sum + ri.utilization.unusedValue, 0),
        overProvisionedCost: Math.floor(totalMonthToDate * 0.08),
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

export const costOptimizationService = CostOptimizationService.getInstance();
export type {
  CloudProvider,
  ResourceCategory,
  TrendDirection,
  OptimizationStatus,
  AlertSeverity,
  CloudAccount,
  CostRecord,
  CostSummary,
  Budget,
  CostAnomaly,
  CostOptimizationRecommendation,
  ReservedInstance,
  SavingsPlan,
  CostAllocationTag,
  CostReport,
  CostForecast,
  ChargebackRecord,
  CostStatistics,
};
