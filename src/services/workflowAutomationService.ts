/**
 * Workflow Automation Service
 * Automated workflows, triggers, and actions for disaster management processes
 */

// Workflow status
type WorkflowStatus = 'draft' | 'active' | 'paused' | 'disabled' | 'archived';

// Execution status
type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'waiting' | 'timeout';

// Trigger type
type TriggerType = 'event' | 'schedule' | 'webhook' | 'manual' | 'condition' | 'api';

// Action type
type ActionType = 'send_notification' | 'create_alert' | 'update_record' | 'assign_task' | 'call_api' | 'send_email' | 'send_sms' | 'run_script' | 'approval' | 'delay' | 'condition' | 'parallel' | 'loop' | 'transform_data';

// Condition operator
type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty' | 'matches_regex' | 'in_list' | 'not_in_list';

// Workflow definition
interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  version: number;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  variables: WorkflowVariable[];
  settings: WorkflowSettings;
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    lastExecutedAt?: Date;
    executionCount: number;
  };
  tags: string[];
}

// Workflow trigger
interface WorkflowTrigger {
  type: TriggerType;
  config: {
    eventType?: string;
    eventFilters?: Record<string, unknown>;
    schedule?: {
      cron: string;
      timezone: string;
    };
    webhookPath?: string;
    condition?: WorkflowCondition;
    apiEndpoint?: string;
  };
  enabled: boolean;
}

// Workflow step
interface WorkflowStep {
  id: string;
  name: string;
  type: ActionType;
  config: StepConfig;
  conditions?: WorkflowCondition[];
  errorHandling: {
    onError: 'fail' | 'continue' | 'retry' | 'fallback';
    retryCount?: number;
    retryDelay?: number;
    fallbackStepId?: string;
  };
  timeout?: number;
  nextSteps: string[];
  position: { x: number; y: number };
}

// Step configuration
interface StepConfig {
  // Notification
  notificationType?: 'push' | 'email' | 'sms' | 'in_app';
  recipients?: string[];
  recipientType?: 'user' | 'role' | 'group' | 'dynamic';
  template?: string;
  subject?: string;
  body?: string;

  // Alert
  alertType?: string;
  alertSeverity?: string;
  alertData?: Record<string, unknown>;

  // Record update
  entityType?: string;
  entityId?: string;
  fields?: Record<string, unknown>;

  // Task assignment
  taskTitle?: string;
  taskDescription?: string;
  assigneeType?: 'user' | 'role' | 'group' | 'round_robin';
  assignees?: string[];
  dueDate?: string;
  priority?: number;

  // API call
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  payload?: Record<string, unknown>;
  responseMapping?: Record<string, string>;

  // Script
  script?: string;
  language?: 'javascript' | 'python';
  inputs?: Record<string, unknown>;

  // Approval
  approvers?: string[];
  approvalType?: 'any' | 'all' | 'majority';
  expiryHours?: number;
  escalationPath?: string[];

  // Delay
  delayMinutes?: number;
  waitUntil?: string;

  // Condition
  conditions?: WorkflowCondition[];
  trueBranch?: string;
  falseBranch?: string;

  // Parallel
  branches?: string[][];

  // Loop
  collection?: string;
  itemVariable?: string;
  maxIterations?: number;

  // Transform
  inputData?: string;
  transformation?: string;
  outputVariable?: string;
}

// Workflow condition
interface WorkflowCondition {
  field: string;
  operator: ConditionOperator;
  value: unknown;
  logicalOperator?: 'and' | 'or';
}

// Workflow variable
interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';
  defaultValue?: unknown;
  required: boolean;
  description?: string;
}

// Workflow settings
interface WorkflowSettings {
  maxConcurrentExecutions: number;
  executionTimeout: number;
  retryOnFailure: boolean;
  maxRetries: number;
  enableLogging: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  notifyOnFailure: boolean;
  notifyOnSuccess: boolean;
  notificationRecipients: string[];
}

// Workflow execution
interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: ExecutionStatus;
  triggerType: TriggerType;
  triggerData?: Record<string, unknown>;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  steps: StepExecution[];
  variables: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  errorMessage?: string;
  retryCount: number;
  parentExecutionId?: string;
}

// Step execution
interface StepExecution {
  stepId: string;
  stepName: string;
  status: ExecutionStatus;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  errorMessage?: string;
  retryCount: number;
  logs: ExecutionLog[];
}

// Execution log
interface ExecutionLog {
  timestamp: Date;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  data?: Record<string, unknown>;
}

// Workflow template
interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  workflow: Partial<Workflow>;
  requiredIntegrations: string[];
  documentation: string;
  popularity: number;
  createdAt: Date;
}

// Workflow analytics
interface WorkflowAnalytics {
  workflowId: string;
  period: { start: Date; end: Date };
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  byTriggerType: Record<string, number>;
  byStatus: Record<string, number>;
  stepMetrics: {
    stepId: string;
    stepName: string;
    executionCount: number;
    successRate: number;
    avgDuration: number;
    errorRate: number;
  }[];
  dailyTrend: { date: string; executions: number; success: number; failed: number }[];
}

// Integration
interface Integration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'messaging' | 'storage';
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, unknown>;
  credentials?: {
    encrypted: boolean;
    lastRotated?: Date;
  };
  healthCheck?: {
    lastCheck: Date;
    status: 'healthy' | 'unhealthy';
    responseTime?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

class WorkflowAutomationService {
  private static instance: WorkflowAutomationService;
  private workflows: Map<string, Workflow> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private templates: Map<string, WorkflowTemplate> = new Map();
  private integrations: Map<string, Integration> = new Map();
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): WorkflowAutomationService {
    if (!WorkflowAutomationService.instance) {
      WorkflowAutomationService.instance = new WorkflowAutomationService();
    }
    return WorkflowAutomationService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize integrations
    const integrationsData = [
      { name: 'SMS Gateway', type: 'messaging', status: 'connected' },
      { name: 'Email Service', type: 'messaging', status: 'connected' },
      { name: 'Push Notification Service', type: 'messaging', status: 'connected' },
      { name: 'Weather API', type: 'api', status: 'connected' },
      { name: 'Government Alert System', type: 'api', status: 'connected' },
      { name: 'GIS Database', type: 'database', status: 'connected' },
      { name: 'Cloud Storage', type: 'storage', status: 'connected' },
    ];

    integrationsData.forEach((i, idx) => {
      const integration: Integration = {
        id: `int-${(idx + 1).toString().padStart(4, '0')}`,
        name: i.name,
        type: i.type as Integration['type'],
        status: i.status as Integration['status'],
        config: {},
        credentials: { encrypted: true, lastRotated: new Date() },
        healthCheck: {
          lastCheck: new Date(),
          status: 'healthy',
          responseTime: Math.floor(Math.random() * 100) + 20,
        },
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.integrations.set(integration.id, integration);
    });

    // Initialize workflow templates
    const templatesData = [
      {
        name: 'Emergency Alert Notification',
        description: 'Send multi-channel notifications when emergency alert is created',
        category: 'Alerts',
        icon: '🚨',
        requiredIntegrations: ['SMS Gateway', 'Push Notification Service'],
      },
      {
        name: 'Shelter Capacity Alert',
        description: 'Monitor shelter capacity and trigger alerts when threshold reached',
        category: 'Shelters',
        icon: '🏠',
        requiredIntegrations: ['Email Service'],
      },
      {
        name: 'Volunteer Assignment',
        description: 'Automatically assign volunteers based on skills and location',
        category: 'Volunteers',
        icon: '👥',
        requiredIntegrations: ['Push Notification Service'],
      },
      {
        name: 'Weather Alert Integration',
        description: 'Fetch weather data and create alerts for severe conditions',
        category: 'Alerts',
        icon: '🌦️',
        requiredIntegrations: ['Weather API'],
      },
      {
        name: 'Donation Receipt',
        description: 'Send receipt and thank you message after donation',
        category: 'Donations',
        icon: '💰',
        requiredIntegrations: ['Email Service', 'SMS Gateway'],
      },
    ];

    templatesData.forEach((t, idx) => {
      const template: WorkflowTemplate = {
        id: `template-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: t.description,
        category: t.category,
        icon: t.icon,
        workflow: {
          name: t.name,
          description: t.description,
          category: t.category,
        },
        requiredIntegrations: t.requiredIntegrations,
        documentation: `# ${t.name}

${t.description}

## Setup

Configure the required integrations before using this template.`,
        popularity: Math.floor(Math.random() * 1000) + 100,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      };
      this.templates.set(template.id, template);
    });

    // Initialize workflows
    const workflowsData: Partial<Workflow>[] = [
      {
        name: 'Emergency Alert Broadcast',
        description: 'Broadcast emergency alerts through all channels',
        category: 'Alerts',
        status: 'active',
        trigger: {
          type: 'event',
          config: { eventType: 'alert.created', eventFilters: { severity: ['high', 'critical'] } },
          enabled: true,
        },
        steps: [
          {
            id: 'step-1',
            name: 'Validate Alert',
            type: 'condition',
            config: { conditions: [{ field: 'severity', operator: 'in_list', value: ['high', 'critical'] }], trueBranch: 'step-2', falseBranch: 'step-end' },
            errorHandling: { onError: 'fail' },
            nextSteps: ['step-2'],
            position: { x: 100, y: 100 },
          },
          {
            id: 'step-2',
            name: 'Send Push Notification',
            type: 'send_notification',
            config: { notificationType: 'push', recipientType: 'group', recipients: ['affected_area_users'], template: 'emergency_alert' },
            errorHandling: { onError: 'continue', retryCount: 3, retryDelay: 1000 },
            nextSteps: ['step-3'],
            position: { x: 100, y: 200 },
          },
          {
            id: 'step-3',
            name: 'Send SMS Alert',
            type: 'send_sms',
            config: { recipientType: 'dynamic', template: 'emergency_sms' },
            errorHandling: { onError: 'continue', retryCount: 3, retryDelay: 2000 },
            nextSteps: ['step-4'],
            position: { x: 100, y: 300 },
          },
          {
            id: 'step-4',
            name: 'Notify Government Agencies',
            type: 'call_api',
            config: { url: 'https://api.gov.in/disaster/notify', method: 'POST' },
            errorHandling: { onError: 'continue' },
            nextSteps: ['step-5'],
            position: { x: 100, y: 400 },
          },
          {
            id: 'step-5',
            name: 'Log Alert',
            type: 'update_record',
            config: { entityType: 'alert_log', fields: { status: 'broadcasted', broadcastedAt: '{{now}}' } },
            errorHandling: { onError: 'fail' },
            nextSteps: [],
            position: { x: 100, y: 500 },
          },
        ],
        variables: [
          { name: 'alertId', type: 'string', required: true },
          { name: 'severity', type: 'string', required: true },
          { name: 'affectedArea', type: 'object', required: true },
        ],
      },
      {
        name: 'Shelter Capacity Monitor',
        description: 'Monitor shelter capacity and create alerts',
        category: 'Shelters',
        status: 'active',
        trigger: {
          type: 'schedule',
          config: { schedule: { cron: '*/15 * * * *', timezone: 'Asia/Kolkata' } },
          enabled: true,
        },
        steps: [
          {
            id: 'step-1',
            name: 'Fetch Shelter Data',
            type: 'call_api',
            config: { url: '/api/shelters/status', method: 'GET', responseMapping: { shelters: 'data.shelters' } },
            errorHandling: { onError: 'fail' },
            nextSteps: ['step-2'],
            position: { x: 100, y: 100 },
          },
          {
            id: 'step-2',
            name: 'Check Capacity',
            type: 'loop',
            config: { collection: '{{shelters}}', itemVariable: 'shelter', maxIterations: 1000 },
            errorHandling: { onError: 'continue' },
            nextSteps: ['step-3'],
            position: { x: 100, y: 200 },
          },
          {
            id: 'step-3',
            name: 'Capacity Threshold Check',
            type: 'condition',
            config: { conditions: [{ field: 'shelter.occupancyRate', operator: 'greater_than', value: 0.9 }], trueBranch: 'step-4', falseBranch: 'step-end' },
            errorHandling: { onError: 'fail' },
            nextSteps: ['step-4'],
            position: { x: 100, y: 300 },
          },
          {
            id: 'step-4',
            name: 'Create Capacity Alert',
            type: 'create_alert',
            config: { alertType: 'shelter_capacity', alertSeverity: 'medium', alertData: { shelterId: '{{shelter.id}}', occupancyRate: '{{shelter.occupancyRate}}' } },
            errorHandling: { onError: 'continue' },
            nextSteps: ['step-5'],
            position: { x: 100, y: 400 },
          },
          {
            id: 'step-5',
            name: 'Notify Shelter Manager',
            type: 'send_email',
            config: { recipientType: 'dynamic', recipients: ['{{shelter.managerId}}'], template: 'shelter_capacity_warning' },
            errorHandling: { onError: 'continue' },
            nextSteps: [],
            position: { x: 100, y: 500 },
          },
        ],
        variables: [
          { name: 'thresholdPercentage', type: 'number', defaultValue: 90, required: false },
        ],
      },
      {
        name: 'Volunteer Auto-Assignment',
        description: 'Automatically assign volunteers to tasks based on skills and availability',
        category: 'Volunteers',
        status: 'active',
        trigger: {
          type: 'event',
          config: { eventType: 'task.created', eventFilters: { requiresVolunteer: true } },
          enabled: true,
        },
        steps: [
          {
            id: 'step-1',
            name: 'Find Available Volunteers',
            type: 'call_api',
            config: { url: '/api/volunteers/available', method: 'GET', payload: { skills: '{{task.requiredSkills}}', location: '{{task.location}}' } },
            errorHandling: { onError: 'fail' },
            nextSteps: ['step-2'],
            position: { x: 100, y: 100 },
          },
          {
            id: 'step-2',
            name: 'Check Volunteer Availability',
            type: 'condition',
            config: { conditions: [{ field: 'volunteers.length', operator: 'greater_than', value: 0 }], trueBranch: 'step-3', falseBranch: 'step-5' },
            errorHandling: { onError: 'fail' },
            nextSteps: ['step-3', 'step-5'],
            position: { x: 100, y: 200 },
          },
          {
            id: 'step-3',
            name: 'Assign Task',
            type: 'assign_task',
            config: { assigneeType: 'round_robin', assignees: ['{{volunteers}}'] as any, taskTitle: '{{task.title}}', priority: 1 },
            errorHandling: { onError: 'continue' },
            nextSteps: ['step-4'],
            position: { x: 100, y: 300 },
          },
          {
            id: 'step-4',
            name: 'Notify Volunteer',
            type: 'send_notification',
            config: { notificationType: 'push', recipientType: 'user', recipients: ['{{assignedVolunteer.id}}'], template: 'task_assigned' },
            errorHandling: { onError: 'continue' },
            nextSteps: [],
            position: { x: 100, y: 400 },
          },
          {
            id: 'step-5',
            name: 'Escalate to Coordinator',
            type: 'send_notification',
            config: { notificationType: 'email', recipientType: 'role', recipients: ['volunteer_coordinator'], template: 'no_volunteers_available' },
            errorHandling: { onError: 'fail' },
            nextSteps: [],
            position: { x: 300, y: 300 },
          },
        ],
        variables: [
          { name: 'taskId', type: 'string', required: true },
          { name: 'requiredSkills', type: 'array', required: true },
          { name: 'location', type: 'object', required: true },
        ],
      },
      {
        name: 'Donation Processing',
        description: 'Process donation and send acknowledgment',
        category: 'Donations',
        status: 'active',
        trigger: {
          type: 'event',
          config: { eventType: 'donation.completed' },
          enabled: true,
        },
        steps: [
          {
            id: 'step-1',
            name: 'Generate Receipt',
            type: 'transform_data',
            config: { inputData: '{{donation}}', transformation: 'generateReceipt', outputVariable: 'receipt' },
            errorHandling: { onError: 'fail' },
            nextSteps: ['step-2'],
            position: { x: 100, y: 100 },
          },
          {
            id: 'step-2',
            name: 'Send Email Receipt',
            type: 'send_email',
            config: { recipientType: 'dynamic', recipients: ['{{donation.donorEmail}}'], template: 'donation_receipt', subject: 'Thank you for your donation!' },
            errorHandling: { onError: 'retry', retryCount: 3 },
            nextSteps: ['step-3'],
            position: { x: 100, y: 200 },
          },
          {
            id: 'step-3',
            name: 'Send SMS Confirmation',
            type: 'send_sms',
            config: { recipientType: 'dynamic', recipients: ['{{donation.donorPhone}}'], template: 'donation_sms_thanks' },
            errorHandling: { onError: 'continue' },
            nextSteps: ['step-4'],
            position: { x: 100, y: 300 },
          },
          {
            id: 'step-4',
            name: 'Update Donor Record',
            type: 'update_record',
            config: { entityType: 'donor', entityId: '{{donation.donorId}}', fields: { totalDonations: '{{donor.totalDonations + donation.amount}}', lastDonation: '{{now}}' } },
            errorHandling: { onError: 'continue' },
            nextSteps: [],
            position: { x: 100, y: 400 },
          },
        ],
        variables: [
          { name: 'donationId', type: 'string', required: true },
          { name: 'amount', type: 'number', required: true },
          { name: 'donorEmail', type: 'string', required: true },
        ],
      },
      {
        name: 'Daily Weather Check',
        description: 'Check weather conditions and create alerts for severe weather',
        category: 'Alerts',
        status: 'active',
        trigger: {
          type: 'schedule',
          config: { schedule: { cron: '0 6,12,18 * * *', timezone: 'Asia/Kolkata' } },
          enabled: true,
        },
        steps: [
          {
            id: 'step-1',
            name: 'Fetch Weather Data',
            type: 'call_api',
            config: { url: 'https://api.weather.gov.in/forecast', method: 'GET', headers: { 'Authorization': 'Bearer {{weatherApiKey}}' } },
            errorHandling: { onError: 'fail' },
            nextSteps: ['step-2'],
            position: { x: 100, y: 100 },
          },
          {
            id: 'step-2',
            name: 'Analyze Weather Data',
            type: 'run_script',
            config: { script: 'analyzeWeatherData(weatherData)', language: 'javascript', inputs: { weatherData: '{{response.data}}' } },
            errorHandling: { onError: 'fail' },
            nextSteps: ['step-3'],
            position: { x: 100, y: 200 },
          },
          {
            id: 'step-3',
            name: 'Check Severe Weather',
            type: 'condition',
            config: { conditions: [{ field: 'analysis.severeWeather', operator: 'equals', value: true }], trueBranch: 'step-4', falseBranch: 'step-end' },
            errorHandling: { onError: 'fail' },
            nextSteps: ['step-4'],
            position: { x: 100, y: 300 },
          },
          {
            id: 'step-4',
            name: 'Create Weather Alert',
            type: 'create_alert',
            config: { alertType: 'weather', alertSeverity: '{{analysis.severity}}', alertData: { forecast: '{{analysis.forecast}}', affectedAreas: '{{analysis.affectedAreas}}' } },
            errorHandling: { onError: 'fail' },
            nextSteps: [],
            position: { x: 100, y: 400 },
          },
        ],
        variables: [
          { name: 'regions', type: 'array', defaultValue: ['all'], required: false },
        ],
      },
    ];

    workflowsData.forEach((w, idx) => {
      const workflow: Workflow = {
        id: `wf-${(idx + 1).toString().padStart(6, '0')}`,
        name: w.name!,
        description: w.description!,
        category: w.category!,
        version: 1,
        status: w.status as WorkflowStatus,
        trigger: w.trigger!,
        steps: w.steps!,
        variables: w.variables || [],
        settings: {
          maxConcurrentExecutions: 10,
          executionTimeout: 300000,
          retryOnFailure: true,
          maxRetries: 3,
          enableLogging: true,
          logLevel: 'info',
          notifyOnFailure: true,
          notifyOnSuccess: false,
          notificationRecipients: ['admin@rescueping.com'],
        },
        metadata: {
          createdBy: 'admin',
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          updatedBy: 'admin',
          updatedAt: new Date(),
          executionCount: Math.floor(Math.random() * 10000) + 500,
        },
        tags: [w.category!.toLowerCase()],
      };
      this.workflows.set(workflow.id, workflow);
    });

    // Initialize sample executions
    const statuses: ExecutionStatus[] = ['completed', 'completed', 'completed', 'failed', 'completed'];
    for (let i = 0; i < 50; i++) {
      const workflow = Array.from(this.workflows.values())[i % this.workflows.size];
      const status = statuses[i % statuses.length];
      const startedAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const duration = Math.floor(Math.random() * 30000) + 1000;

      const execution: WorkflowExecution = {
        id: `exec-${(i + 1).toString().padStart(8, '0')}`,
        workflowId: workflow.id,
        workflowName: workflow.name,
        status,
        triggerType: workflow.trigger.type,
        input: { triggeredAt: startedAt.toISOString() },
        output: status === 'completed' ? { success: true } : undefined,
        steps: workflow.steps.map((s) => ({
          stepId: s.id,
          stepName: s.name,
          status: status === 'failed' && s.id === 'step-3' ? 'failed' : 'completed',
          startedAt: startedAt,
          completedAt: new Date(startedAt.getTime() + Math.random() * 5000),
          duration: Math.floor(Math.random() * 5000),
          retryCount: 0,
          logs: [],
        })),
        variables: {},
        startedAt,
        completedAt: new Date(startedAt.getTime() + duration),
        duration,
        errorMessage: status === 'failed' ? 'API timeout' : undefined,
        retryCount: status === 'failed' ? 1 : 0,
      };
      this.executions.set(execution.id, execution);
    }
  }

  /**
   * Execute workflow
   */
  public async executeWorkflow(workflowId: string, input: Record<string, unknown> = {}, triggeredBy?: string): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');
    if (workflow.status !== 'active') throw new Error('Workflow is not active');

    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      workflowId,
      workflowName: workflow.name,
      status: 'running',
      triggerType: triggeredBy ? 'manual' : workflow.trigger.type,
      triggerData: triggeredBy ? { triggeredBy } : undefined,
      input,
      steps: workflow.steps.map((s) => ({
        stepId: s.id,
        stepName: s.name,
        status: 'pending',
        retryCount: 0,
        logs: [],
      })),
      variables: { ...input },
      startedAt: new Date(),
      retryCount: 0,
    };

    this.executions.set(execution.id, execution);
    this.emit('execution_started', execution);

    // Simulate execution
    await this.simulateExecution(execution, workflow);

    return execution;
  }

  /**
   * Simulate workflow execution
   */
  private async simulateExecution(execution: WorkflowExecution, workflow: Workflow): Promise<void> {
    for (const step of workflow.steps) {
      const stepExec = execution.steps.find((s) => s.stepId === step.id);
      if (!stepExec) continue;

      stepExec.status = 'running';
      stepExec.startedAt = new Date();

      // Simulate step execution
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100 + 50));

      // Simulate success/failure
      const success = Math.random() > 0.1;

      if (success) {
        stepExec.status = 'completed';
        stepExec.output = { success: true };
      } else {
        stepExec.status = 'failed';
        stepExec.errorMessage = 'Simulated failure';

        if (step.errorHandling.onError === 'fail') {
          execution.status = 'failed';
          execution.errorMessage = `Step "${step.name}" failed: ${stepExec.errorMessage}`;
          break;
        }
      }

      stepExec.completedAt = new Date();
      stepExec.duration = stepExec.completedAt.getTime() - stepExec.startedAt!.getTime();
    }

    if (execution.status !== 'failed') {
      execution.status = 'completed';
    }

    execution.completedAt = new Date();
    execution.duration = execution.completedAt.getTime() - execution.startedAt.getTime();

    // Update workflow metadata
    workflow.metadata.lastExecutedAt = new Date();
    workflow.metadata.executionCount++;

    this.emit('execution_completed', execution);
  }

  /**
   * Get workflows
   */
  public getWorkflows(filter?: { category?: string; status?: WorkflowStatus }): Workflow[] {
    let workflows = Array.from(this.workflows.values());

    if (filter?.category) workflows = workflows.filter((w) => w.category === filter.category);
    if (filter?.status) workflows = workflows.filter((w) => w.status === filter.status);

    return workflows.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get workflow
   */
  public getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  /**
   * Create workflow
   */
  public createWorkflow(data: {
    name: string;
    description: string;
    category: string;
    trigger: WorkflowTrigger;
    steps: WorkflowStep[];
    variables?: WorkflowVariable[];
    createdBy: string;
  }): Workflow {
    const workflow: Workflow = {
      id: `wf-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: data.name,
      description: data.description,
      category: data.category,
      version: 1,
      status: 'draft',
      trigger: data.trigger,
      steps: data.steps,
      variables: data.variables || [],
      settings: {
        maxConcurrentExecutions: 10,
        executionTimeout: 300000,
        retryOnFailure: true,
        maxRetries: 3,
        enableLogging: true,
        logLevel: 'info',
        notifyOnFailure: true,
        notifyOnSuccess: false,
        notificationRecipients: [],
      },
      metadata: {
        createdBy: data.createdBy,
        createdAt: new Date(),
        updatedBy: data.createdBy,
        updatedAt: new Date(),
        executionCount: 0,
      },
      tags: [],
    };

    this.workflows.set(workflow.id, workflow);
    this.emit('workflow_created', workflow);

    return workflow;
  }

  /**
   * Update workflow status
   */
  public updateWorkflowStatus(id: string, status: WorkflowStatus, updatedBy: string): Workflow {
    const workflow = this.workflows.get(id);
    if (!workflow) throw new Error('Workflow not found');

    workflow.status = status;
    workflow.metadata.updatedBy = updatedBy;
    workflow.metadata.updatedAt = new Date();

    if (status === 'active' && workflow.trigger.type === 'schedule') {
      this.scheduleWorkflow(workflow);
    } else {
      this.unscheduleWorkflow(id);
    }

    this.emit('workflow_updated', workflow);
    return workflow;
  }

  /**
   * Schedule workflow
   */
  private scheduleWorkflow(_workflow: Workflow): void {
    // Placeholder for scheduling logic
  }

  /**
   * Unschedule workflow
   */
  private unscheduleWorkflow(workflowId: string): void {
    const job = this.scheduledJobs.get(workflowId);
    if (job) {
      clearInterval(job);
      this.scheduledJobs.delete(workflowId);
    }
  }

  /**
   * Get executions
   */
  public getExecutions(filter?: { workflowId?: string; status?: ExecutionStatus; limit?: number }): WorkflowExecution[] {
    let executions = Array.from(this.executions.values());

    if (filter?.workflowId) executions = executions.filter((e) => e.workflowId === filter.workflowId);
    if (filter?.status) executions = executions.filter((e) => e.status === filter.status);

    executions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

    if (filter?.limit) executions = executions.slice(0, filter.limit);

    return executions;
  }

  /**
   * Get execution
   */
  public getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.get(id);
  }

  /**
   * Get workflow analytics
   */
  public getWorkflowAnalytics(workflowId: string, period: { start: Date; end: Date }): WorkflowAnalytics {
    const executions = Array.from(this.executions.values()).filter(
      (e) => e.workflowId === workflowId && e.startedAt >= period.start && e.startedAt <= period.end
    );

    const successful = executions.filter((e) => e.status === 'completed');
    const failed = executions.filter((e) => e.status === 'failed');

    const durations = executions.filter((e) => e.duration).map((e) => e.duration!);

    const byTriggerType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    executions.forEach((e) => {
      byTriggerType[e.triggerType] = (byTriggerType[e.triggerType] || 0) + 1;
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
    });

    // Daily trend
    const trendMap = new Map<string, { executions: number; success: number; failed: number }>();
    executions.forEach((e) => {
      const dateKey = e.startedAt.toISOString().split('T')[0];
      const existing = trendMap.get(dateKey) || { executions: 0, success: 0, failed: 0 };
      existing.executions++;
      if (e.status === 'completed') existing.success++;
      if (e.status === 'failed') existing.failed++;
      trendMap.set(dateKey, existing);
    });

    const dailyTrend = Array.from(trendMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      workflowId,
      period,
      totalExecutions: executions.length,
      successfulExecutions: successful.length,
      failedExecutions: failed.length,
      avgDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      minDuration: durations.length > 0 ? Math.min(...durations) : 0,
      maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
      byTriggerType,
      byStatus,
      stepMetrics: [],
      dailyTrend,
    };
  }

  /**
   * Get templates
   */
  public getTemplates(category?: string): WorkflowTemplate[] {
    let templates = Array.from(this.templates.values());
    if (category) templates = templates.filter((t) => t.category === category);
    return templates.sort((a, b) => b.popularity - a.popularity);
  }

  /**
   * Get integrations
   */
  public getIntegrations(): Integration[] {
    return Array.from(this.integrations.values());
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

export const workflowAutomationService = WorkflowAutomationService.getInstance();
export type {
  WorkflowStatus,
  ExecutionStatus,
  TriggerType,
  ActionType,
  ConditionOperator,
  Workflow,
  WorkflowTrigger,
  WorkflowStep,
  StepConfig,
  WorkflowCondition,
  WorkflowVariable,
  WorkflowSettings,
  WorkflowExecution,
  StepExecution,
  ExecutionLog,
  WorkflowTemplate,
  WorkflowAnalytics,
  Integration,
};
