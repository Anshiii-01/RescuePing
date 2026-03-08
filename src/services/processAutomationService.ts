/**
 * Process Automation Service - #117
 * BPMN workflows, triggers, conditions, actions, monitoring
 */

// Process status
type ProcessStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed' | 'cancelled' | 'archived';

// Node type
type NodeType = 'start' | 'end' | 'task' | 'decision' | 'parallel' | 'join' | 'subprocess' | 'timer' | 'event' | 'script' | 'human' | 'service';

// Trigger type
type TriggerType = 'manual' | 'schedule' | 'event' | 'webhook' | 'condition' | 'message' | 'signal';

// Action type
type ActionType = 'http' | 'email' | 'sms' | 'push' | 'database' | 'file' | 'script' | 'transform' | 'notify' | 'assign' | 'approve' | 'reject';

// Condition operator
type ConditionOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with' | 'matches' | 'exists' | 'is_null';

// Execution status
type ExecutionStatus = 'pending' | 'running' | 'waiting' | 'completed' | 'failed' | 'cancelled' | 'timeout' | 'skipped';

// Workflow node
interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  description?: string;
  position: { x: number; y: number };
  config: NodeConfig;
  inputs: string[];
  outputs: string[];
  timeout?: number;
  retries?: {
    maxAttempts: number;
    delay: number;
    backoff: 'linear' | 'exponential';
  };
  errorHandling?: {
    strategy: 'fail' | 'continue' | 'retry' | 'fallback';
    fallbackNode?: string;
  };
}

// Node configuration
interface NodeConfig {
  // Task node
  taskType?: ActionType;
  action?: ActionConfig;
  
  // Decision node
  conditions?: Condition[];
  defaultOutput?: string;
  
  // Timer node
  delay?: number;
  schedule?: string;
  
  // Script node
  script?: string;
  language?: 'javascript' | 'python' | 'groovy';
  
  // Human node
  assignee?: string;
  assigneeType?: 'user' | 'role' | 'group' | 'dynamic';
  formId?: string;
  dueDate?: number;
  escalation?: {
    after: number;
    to: string;
  };
  
  // Service node
  serviceId?: string;
  method?: string;
  parameters?: Record<string, unknown>;
  
  // Subprocess node
  subprocessId?: string;
  inputMapping?: Record<string, string>;
  outputMapping?: Record<string, string>;
  
  // Parallel/Join node
  waitFor?: 'all' | 'any' | 'count';
  count?: number;
}

// Action configuration
interface ActionConfig {
  type: ActionType;
  
  // HTTP action
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  
  // Email action
  to?: string[];
  cc?: string[];
  subject?: string;
  template?: string;
  
  // SMS action
  phoneNumbers?: string[];
  message?: string;
  
  // Database action
  operation?: 'query' | 'insert' | 'update' | 'delete';
  table?: string;
  query?: string;
  data?: Record<string, unknown>;
  
  // Script action
  script?: string;
  
  // Transform action
  transformations?: { source: string; target: string; expression: string }[];
}

// Condition
interface Condition {
  id: string;
  name: string;
  expression?: string;
  rules?: {
    field: string;
    operator: ConditionOperator;
    value: unknown;
    logic?: 'and' | 'or';
  }[];
  targetOutput: string;
}

// Workflow trigger
interface WorkflowTrigger {
  id: string;
  type: TriggerType;
  name: string;
  enabled: boolean;
  config: TriggerConfig;
}

// Trigger configuration
interface TriggerConfig {
  // Schedule trigger
  cron?: string;
  timezone?: string;
  
  // Event trigger
  eventType?: string;
  eventSource?: string;
  filters?: { field: string; operator: ConditionOperator; value: unknown }[];
  
  // Webhook trigger
  webhookPath?: string;
  method?: 'GET' | 'POST';
  authentication?: {
    type: 'none' | 'apikey' | 'basic' | 'oauth';
    config?: Record<string, string>;
  };
  
  // Condition trigger
  condition?: string;
  checkInterval?: number;
  
  // Message trigger
  queue?: string;
  topic?: string;
  
  // Signal trigger
  signalName?: string;
}

// Workflow definition
interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  status: ProcessStatus;
  category: string;
  tags: string[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  triggers: WorkflowTrigger[];
  variables: WorkflowVariable[];
  errorHandlers: ErrorHandler[];
  permissions: {
    owner: string;
    editors: string[];
    executors: string[];
    viewers: string[];
  };
  settings: {
    maxExecutionTime: number;
    retentionDays: number;
    logging: 'minimal' | 'normal' | 'verbose';
    notifications: {
      onStart?: string[];
      onComplete?: string[];
      onError?: string[];
    };
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    publishedAt?: Date;
    publishedBy?: string;
  };
  stats: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    avgExecutionTime: number;
    lastExecutedAt?: Date;
  };
}

// Workflow edge
interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
  isDefault?: boolean;
}

// Workflow variable
interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  defaultValue?: unknown;
  required: boolean;
  scope: 'input' | 'output' | 'local';
  description?: string;
}

// Error handler
interface ErrorHandler {
  id: string;
  name: string;
  errorType: 'timeout' | 'validation' | 'execution' | 'connection' | 'custom';
  errorCode?: string;
  handler: {
    type: 'retry' | 'fallback' | 'compensate' | 'escalate' | 'ignore';
    config: Record<string, unknown>;
  };
}

// Execution instance
interface ExecutionInstance {
  id: string;
  workflowId: string;
  workflowVersion: string;
  status: ExecutionStatus;
  triggerId?: string;
  triggerType: TriggerType;
  triggerData?: Record<string, unknown>;
  variables: Record<string, unknown>;
  currentNodes: string[];
  completedNodes: string[];
  nodeHistory: NodeExecution[];
  startedAt: Date;
  completedAt?: Date;
  error?: {
    nodeId: string;
    message: string;
    stack?: string;
    timestamp: Date;
  };
  output?: Record<string, unknown>;
  parentExecutionId?: string;
  childExecutions?: string[];
}

// Node execution
interface NodeExecution {
  nodeId: string;
  nodeName: string;
  nodeType: NodeType;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  attempt: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  logs: { timestamp: Date; level: 'info' | 'warn' | 'error'; message: string }[];
}

// Human task
interface HumanTask {
  id: string;
  executionId: string;
  nodeId: string;
  workflowId: string;
  workflowName: string;
  name: string;
  description: string;
  assignee?: string;
  assigneeType: 'user' | 'role' | 'group';
  candidates?: string[];
  status: 'pending' | 'claimed' | 'completed' | 'cancelled' | 'expired';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  dueDate?: Date;
  formId?: string;
  formData?: Record<string, unknown>;
  outcome?: string;
  comments?: { userId: string; comment: string; timestamp: Date }[];
  createdAt: Date;
  claimedAt?: Date;
  completedAt?: Date;
}

// Process metrics
interface ProcessMetrics {
  period: { start: Date; end: Date };
  overview: {
    totalWorkflows: number;
    activeWorkflows: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    pendingTasks: number;
    avgExecutionTime: number;
  };
  byWorkflow: {
    workflowId: string;
    workflowName: string;
    executions: number;
    successRate: number;
    avgTime: number;
  }[];
  byTrigger: {
    type: TriggerType;
    count: number;
  }[];
  executionTrend: {
    date: Date;
    total: number;
    successful: number;
    failed: number;
  }[];
  nodePerformance: {
    nodeId: string;
    nodeName: string;
    avgDuration: number;
    failureRate: number;
  }[];
}

class ProcessAutomationService {
  private static instance: ProcessAutomationService;
  private workflows: Map<string, Workflow> = new Map();
  private executions: Map<string, ExecutionInstance> = new Map();
  private humanTasks: Map<string, HumanTask> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ProcessAutomationService {
    if (!ProcessAutomationService.instance) {
      ProcessAutomationService.instance = new ProcessAutomationService();
    }
    return ProcessAutomationService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize workflows
    const workflowsData: { name: string; category: string; status: ProcessStatus }[] = [
      { name: 'Emergency Alert Processing', category: 'Emergency', status: 'active' },
      { name: 'Incident Escalation', category: 'Incident Management', status: 'active' },
      { name: 'User Registration', category: 'User Management', status: 'active' },
      { name: 'Report Generation', category: 'Reporting', status: 'active' },
      { name: 'Resource Allocation', category: 'Operations', status: 'draft' },
      { name: 'Notification Dispatch', category: 'Communication', status: 'active' },
      { name: 'Data Sync', category: 'Integration', status: 'active' },
      { name: 'Approval Workflow', category: 'Governance', status: 'active' },
    ];

    workflowsData.forEach((w, idx) => {
      const nodes: WorkflowNode[] = [
        {
          id: 'start',
          type: 'start',
          name: 'Start',
          position: { x: 100, y: 200 },
          config: {},
          inputs: [],
          outputs: ['node-1'],
        },
        {
          id: 'node-1',
          type: 'task',
          name: 'Validate Input',
          position: { x: 250, y: 200 },
          config: {
            taskType: 'script',
            action: { type: 'script', script: 'return input.valid;' },
          },
          inputs: ['start'],
          outputs: ['node-2'],
          retries: { maxAttempts: 3, delay: 1000, backoff: 'exponential' },
        },
        {
          id: 'node-2',
          type: 'decision',
          name: 'Check Severity',
          position: { x: 400, y: 200 },
          config: {
            conditions: [
              { id: 'c1', name: 'High Severity', rules: [{ field: 'severity', operator: 'eq', value: 'high' }], targetOutput: 'node-3' },
              { id: 'c2', name: 'Medium Severity', rules: [{ field: 'severity', operator: 'eq', value: 'medium' }], targetOutput: 'node-4' },
            ],
            defaultOutput: 'node-5',
          },
          inputs: ['node-1'],
          outputs: ['node-3', 'node-4', 'node-5'],
        },
        {
          id: 'node-3',
          type: 'service',
          name: 'High Priority Handler',
          position: { x: 550, y: 100 },
          config: { serviceId: 'alert-service', method: 'sendUrgent' },
          inputs: ['node-2'],
          outputs: ['node-6'],
        },
        {
          id: 'node-4',
          type: 'service',
          name: 'Medium Priority Handler',
          position: { x: 550, y: 200 },
          config: { serviceId: 'alert-service', method: 'sendNormal' },
          inputs: ['node-2'],
          outputs: ['node-6'],
        },
        {
          id: 'node-5',
          type: 'service',
          name: 'Low Priority Handler',
          position: { x: 550, y: 300 },
          config: { serviceId: 'alert-service', method: 'queue' },
          inputs: ['node-2'],
          outputs: ['node-6'],
        },
        {
          id: 'node-6',
          type: 'join',
          name: 'Merge Results',
          position: { x: 700, y: 200 },
          config: { waitFor: 'any' },
          inputs: ['node-3', 'node-4', 'node-5'],
          outputs: ['end'],
        },
        {
          id: 'end',
          type: 'end',
          name: 'End',
          position: { x: 850, y: 200 },
          config: {},
          inputs: ['node-6'],
          outputs: [],
        },
      ];

      const edges: WorkflowEdge[] = [
        { id: 'e1', source: 'start', target: 'node-1' },
        { id: 'e2', source: 'node-1', target: 'node-2' },
        { id: 'e3', source: 'node-2', target: 'node-3', label: 'High', condition: "severity === 'high'" },
        { id: 'e4', source: 'node-2', target: 'node-4', label: 'Medium', condition: "severity === 'medium'" },
        { id: 'e5', source: 'node-2', target: 'node-5', label: 'Low', isDefault: true },
        { id: 'e6', source: 'node-3', target: 'node-6' },
        { id: 'e7', source: 'node-4', target: 'node-6' },
        { id: 'e8', source: 'node-5', target: 'node-6' },
        { id: 'e9', source: 'node-6', target: 'end' },
      ];

      const triggers: WorkflowTrigger[] = [
        {
          id: `trigger-${idx}-1`,
          type: 'event',
          name: 'On Alert Created',
          enabled: true,
          config: { eventType: 'alert.created', eventSource: 'rescueping' },
        },
        {
          id: `trigger-${idx}-2`,
          type: 'webhook',
          name: 'External Webhook',
          enabled: true,
          config: { webhookPath: `/api/workflows/${idx}/trigger`, method: 'POST' },
        },
      ];

      const workflow: Workflow = {
        id: `wf-${(idx + 1).toString().padStart(6, '0')}`,
        name: w.name,
        description: `${w.name} workflow for automated processing`,
        version: '1.0.0',
        status: w.status,
        category: w.category,
        tags: [w.category.toLowerCase().replace(' ', '-'), 'automation', 'rescueping'],
        nodes,
        edges,
        triggers,
        variables: [
          { name: 'input', type: 'object', required: true, scope: 'input', description: 'Input data' },
          { name: 'severity', type: 'string', defaultValue: 'low', required: false, scope: 'input' },
          { name: 'result', type: 'object', required: false, scope: 'output' },
        ],
        errorHandlers: [
          {
            id: 'eh-1',
            name: 'Timeout Handler',
            errorType: 'timeout',
            handler: { type: 'retry', config: { maxAttempts: 3 } },
          },
          {
            id: 'eh-2',
            name: 'Connection Error',
            errorType: 'connection',
            handler: { type: 'escalate', config: { to: 'ops-team' } },
          },
        ],
        permissions: {
          owner: 'user-001',
          editors: ['user-002', 'user-003'],
          executors: ['user-004', 'system'],
          viewers: ['user-005', 'user-006'],
        },
        settings: {
          maxExecutionTime: 3600000,
          retentionDays: 30,
          logging: 'normal',
          notifications: {
            onError: ['ops-team@rescueping.com'],
          },
        },
        metadata: {
          createdAt: new Date(Date.now() - idx * 30 * 24 * 60 * 60 * 1000),
          createdBy: 'user-001',
          updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          updatedBy: 'user-002',
          publishedAt: w.status === 'active' ? new Date(Date.now() - idx * 15 * 24 * 60 * 60 * 1000) : undefined,
          publishedBy: w.status === 'active' ? 'user-001' : undefined,
        },
        stats: {
          totalExecutions: Math.floor(Math.random() * 1000) + 100,
          successfulExecutions: Math.floor(Math.random() * 900) + 80,
          failedExecutions: Math.floor(Math.random() * 100),
          avgExecutionTime: Math.floor(Math.random() * 5000) + 500,
          lastExecutedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        },
      };

      this.workflows.set(workflow.id, workflow);

      // Create sample executions
      for (let i = 0; i < 5; i++) {
        const execution: ExecutionInstance = {
          id: `exec-${workflow.id}-${i}`,
          workflowId: workflow.id,
          workflowVersion: workflow.version,
          status: (['completed', 'running', 'failed', 'completed', 'completed'] as ExecutionStatus[])[i],
          triggerType: 'event',
          variables: { input: { id: `alert-${i}` }, severity: ['high', 'medium', 'low'][i % 3] },
          currentNodes: i === 1 ? ['node-3'] : [],
          completedNodes: i === 0 || i > 2 ? nodes.map((n) => n.id) : ['start', 'node-1', 'node-2'],
          nodeHistory: nodes.slice(0, i === 1 ? 3 : i === 2 ? 4 : nodes.length).map((n, ni) => ({
            nodeId: n.id,
            nodeName: n.name,
            nodeType: n.type,
            status: i === 2 && ni === 3 ? 'failed' : 'completed',
            startedAt: new Date(Date.now() - (10 - ni) * 60000),
            completedAt: new Date(Date.now() - (9 - ni) * 60000),
            duration: Math.floor(Math.random() * 1000) + 100,
            attempt: 1,
            logs: [{ timestamp: new Date(), level: 'info', message: `Executed ${n.name}` }],
          })),
          startedAt: new Date(Date.now() - 10 * 60000),
          completedAt: i !== 1 ? new Date(Date.now() - 5 * 60000) : undefined,
          error: i === 2 ? { nodeId: 'node-3', message: 'Service unavailable', timestamp: new Date() } : undefined,
        };
        this.executions.set(execution.id, execution);
      }
    });

    // Create human tasks
    const taskNames = ['Review Alert', 'Approve Escalation', 'Verify Incident', 'Confirm Resource', 'Sign Off Report'];
    taskNames.forEach((name, idx) => {
      const task: HumanTask = {
        id: `task-${(idx + 1).toString().padStart(6, '0')}`,
        executionId: `exec-wf-000001-${idx % 5}`,
        nodeId: 'node-human',
        workflowId: 'wf-000001',
        workflowName: 'Emergency Alert Processing',
        name,
        description: `${name} for processing`,
        assignee: idx < 2 ? `user-00${idx + 2}` : undefined,
        assigneeType: 'user',
        candidates: ['user-002', 'user-003', 'user-004'],
        status: ['pending', 'claimed', 'completed', 'pending', 'pending'][idx] as HumanTask['status'],
        priority: ['urgent', 'high', 'normal', 'normal', 'low'][idx] as HumanTask['priority'],
        dueDate: new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000),
        formId: 'form-review',
        createdAt: new Date(Date.now() - idx * 60 * 60 * 1000),
        claimedAt: idx === 1 ? new Date(Date.now() - 30 * 60 * 1000) : undefined,
        completedAt: idx === 2 ? new Date(Date.now() - 10 * 60 * 1000) : undefined,
      };
      this.humanTasks.set(task.id, task);
    });
  }

  /**
   * Get workflows
   */
  public getWorkflows(filter?: {
    status?: ProcessStatus;
    category?: string;
    owner?: string;
    limit?: number;
  }): Workflow[] {
    let workflows = Array.from(this.workflows.values());
    if (filter?.status) workflows = workflows.filter((w) => w.status === filter.status);
    if (filter?.category) workflows = workflows.filter((w) => w.category === filter.category);
    if (filter?.owner) workflows = workflows.filter((w) => w.permissions.owner === filter.owner);
    workflows = workflows.sort((a, b) => b.metadata.updatedAt.getTime() - a.metadata.updatedAt.getTime());
    if (filter?.limit) workflows = workflows.slice(0, filter.limit);
    return workflows;
  }

  /**
   * Get workflow
   */
  public getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Create workflow
   */
  public createWorkflow(
    workflow: Omit<Workflow, 'id' | 'metadata' | 'stats'>
  ): Workflow {
    const newWorkflow: Workflow = {
      ...workflow,
      id: `wf-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      metadata: {
        createdAt: new Date(),
        createdBy: workflow.permissions.owner,
        updatedAt: new Date(),
        updatedBy: workflow.permissions.owner,
      },
      stats: {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        avgExecutionTime: 0,
      },
    };

    this.workflows.set(newWorkflow.id, newWorkflow);
    this.emit('workflow_created', newWorkflow);

    return newWorkflow;
  }

  /**
   * Update workflow
   */
  public updateWorkflow(workflowId: string, updates: Partial<Workflow>, updatedBy: string): Workflow {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    Object.assign(workflow, updates, {
      metadata: {
        ...workflow.metadata,
        updatedAt: new Date(),
        updatedBy,
      },
    });

    this.emit('workflow_updated', workflow);

    return workflow;
  }

  /**
   * Delete workflow
   */
  public deleteWorkflow(workflowId: string): void {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    workflow.status = 'archived';
    this.emit('workflow_deleted', { workflowId });
  }

  /**
   * Publish workflow
   */
  public publishWorkflow(workflowId: string, publishedBy: string): Workflow {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    workflow.status = 'active';
    workflow.metadata.publishedAt = new Date();
    workflow.metadata.publishedBy = publishedBy;

    this.emit('workflow_published', workflow);

    return workflow;
  }

  /**
   * Execute workflow
   */
  public executeWorkflow(
    workflowId: string,
    triggerType: TriggerType,
    variables: Record<string, unknown>,
    triggerId?: string
  ): ExecutionInstance {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    const execution: ExecutionInstance = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      workflowId,
      workflowVersion: workflow.version,
      status: 'running',
      triggerId,
      triggerType,
      variables,
      currentNodes: ['start'],
      completedNodes: [],
      nodeHistory: [],
      startedAt: new Date(),
    };

    this.executions.set(execution.id, execution);

    // Simulate async execution
    this.simulateExecution(execution, workflow);

    this.emit('execution_started', execution);

    return execution;
  }

  /**
   * Simulate execution (for demo purposes)
   */
  private simulateExecution(execution: ExecutionInstance, workflow: Workflow): void {
    setTimeout(() => {
      const success = Math.random() > 0.1;

      workflow.nodes.forEach((node) => {
        const nodeExecution: NodeExecution = {
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          status: success ? 'completed' : node.id === 'node-3' ? 'failed' : 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
          duration: Math.floor(Math.random() * 500) + 50,
          attempt: 1,
          logs: [{ timestamp: new Date(), level: 'info', message: `Executed ${node.name}` }],
        };
        execution.nodeHistory.push(nodeExecution);
        execution.completedNodes.push(node.id);
      });

      execution.currentNodes = [];
      execution.status = success ? 'completed' : 'failed';
      execution.completedAt = new Date();

      if (!success) {
        execution.error = {
          nodeId: 'node-3',
          message: 'Simulated failure',
          timestamp: new Date(),
        };
      }

      // Update workflow stats
      workflow.stats.totalExecutions++;
      if (success) {
        workflow.stats.successfulExecutions++;
      } else {
        workflow.stats.failedExecutions++;
      }
      workflow.stats.lastExecutedAt = new Date();

      this.emit('execution_completed', execution);
    }, 2000);
  }

  /**
   * Get executions
   */
  public getExecutions(filter?: {
    workflowId?: string;
    status?: ExecutionStatus;
    limit?: number;
  }): ExecutionInstance[] {
    let executions = Array.from(this.executions.values());
    if (filter?.workflowId) executions = executions.filter((e) => e.workflowId === filter.workflowId);
    if (filter?.status) executions = executions.filter((e) => e.status === filter.status);
    executions = executions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    if (filter?.limit) executions = executions.slice(0, filter.limit);
    return executions;
  }

  /**
   * Get execution
   */
  public getExecution(executionId: string): ExecutionInstance | undefined {
    return this.executions.get(executionId);
  }

  /**
   * Cancel execution
   */
  public cancelExecution(executionId: string): ExecutionInstance {
    const execution = this.executions.get(executionId);
    if (!execution) throw new Error('Execution not found');

    execution.status = 'cancelled';
    execution.completedAt = new Date();

    this.emit('execution_cancelled', execution);

    return execution;
  }

  /**
   * Retry execution
   */
  public retryExecution(executionId: string): ExecutionInstance {
    const execution = this.executions.get(executionId);
    if (!execution) throw new Error('Execution not found');

    const workflow = this.workflows.get(execution.workflowId);
    if (!workflow) throw new Error('Workflow not found');

    return this.executeWorkflow(
      execution.workflowId,
      execution.triggerType,
      execution.variables,
      execution.triggerId
    );
  }

  /**
   * Get human tasks
   */
  public getHumanTasks(filter?: {
    assignee?: string;
    status?: HumanTask['status'];
    workflowId?: string;
    limit?: number;
  }): HumanTask[] {
    let tasks = Array.from(this.humanTasks.values());
    if (filter?.assignee) tasks = tasks.filter((t) => t.assignee === filter.assignee);
    if (filter?.status) tasks = tasks.filter((t) => t.status === filter.status);
    if (filter?.workflowId) tasks = tasks.filter((t) => t.workflowId === filter.workflowId);
    tasks = tasks.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    if (filter?.limit) tasks = tasks.slice(0, filter.limit);
    return tasks;
  }

  /**
   * Get human task
   */
  public getHumanTask(taskId: string): HumanTask | undefined {
    return this.humanTasks.get(taskId);
  }

  /**
   * Claim task
   */
  public claimTask(taskId: string, userId: string): HumanTask {
    const task = this.humanTasks.get(taskId);
    if (!task) throw new Error('Task not found');

    task.status = 'claimed';
    task.assignee = userId;
    task.claimedAt = new Date();

    this.emit('task_claimed', task);

    return task;
  }

  /**
   * Complete task
   */
  public completeTask(taskId: string, outcome: string, formData?: Record<string, unknown>): HumanTask {
    const task = this.humanTasks.get(taskId);
    if (!task) throw new Error('Task not found');

    task.status = 'completed';
    task.outcome = outcome;
    task.formData = formData;
    task.completedAt = new Date();

    // Resume execution
    const execution = this.executions.get(task.executionId);
    if (execution && execution.status === 'waiting') {
      execution.status = 'running';
      this.emit('execution_resumed', execution);
    }

    this.emit('task_completed', task);

    return task;
  }

  /**
   * Get metrics
   */
  public getMetrics(period: { start: Date; end: Date }): ProcessMetrics {
    const workflows = Array.from(this.workflows.values());
    const executions = Array.from(this.executions.values());
    const tasks = Array.from(this.humanTasks.values());

    const totalExecutions = workflows.reduce((sum, w) => sum + w.stats.totalExecutions, 0);
    const successfulExecutions = workflows.reduce((sum, w) => sum + w.stats.successfulExecutions, 0);
    const failedExecutions = workflows.reduce((sum, w) => sum + w.stats.failedExecutions, 0);
    const avgExecutionTime = workflows.reduce((sum, w) => sum + w.stats.avgExecutionTime, 0) / (workflows.length || 1);

    const byTrigger: Record<TriggerType, number> = {
      manual: 0, schedule: 0, event: 0, webhook: 0, condition: 0, message: 0, signal: 0,
    };
    executions.forEach((e) => byTrigger[e.triggerType]++);

    return {
      period,
      overview: {
        totalWorkflows: workflows.length,
        activeWorkflows: workflows.filter((w) => w.status === 'active').length,
        totalExecutions,
        successfulExecutions,
        failedExecutions,
        pendingTasks: tasks.filter((t) => t.status === 'pending').length,
        avgExecutionTime,
      },
      byWorkflow: workflows.slice(0, 10).map((w) => ({
        workflowId: w.id,
        workflowName: w.name,
        executions: w.stats.totalExecutions,
        successRate: w.stats.totalExecutions > 0 ? (w.stats.successfulExecutions / w.stats.totalExecutions) * 100 : 100,
        avgTime: w.stats.avgExecutionTime,
      })),
      byTrigger: Object.entries(byTrigger).map(([type, count]) => ({
        type: type as TriggerType,
        count,
      })),
      executionTrend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
        total: Math.floor(Math.random() * 100) + 20,
        successful: Math.floor(Math.random() * 80) + 15,
        failed: Math.floor(Math.random() * 20) + 2,
      })),
      nodePerformance: [
        { nodeId: 'node-1', nodeName: 'Validate Input', avgDuration: 150, failureRate: 2 },
        { nodeId: 'node-2', nodeName: 'Check Severity', avgDuration: 50, failureRate: 0 },
        { nodeId: 'node-3', nodeName: 'High Priority Handler', avgDuration: 500, failureRate: 5 },
        { nodeId: 'node-4', nodeName: 'Medium Priority Handler', avgDuration: 300, failureRate: 3 },
      ],
    };
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

export const processAutomationService = ProcessAutomationService.getInstance();
export type {
  ProcessStatus,
  NodeType,
  TriggerType,
  ActionType,
  ConditionOperator,
  ExecutionStatus,
  WorkflowNode,
  NodeConfig,
  ActionConfig,
  Condition,
  WorkflowTrigger,
  TriggerConfig,
  Workflow,
  WorkflowEdge,
  WorkflowVariable,
  ErrorHandler,
  ExecutionInstance,
  NodeExecution,
  HumanTask,
  ProcessMetrics,
};
