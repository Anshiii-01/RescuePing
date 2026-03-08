/**
 * Deployment Pipeline Service
 * CI/CD pipeline management, build automation, deployment tracking, and release management
 */

// Pipeline status
type PipelineStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled' | 'skipped' | 'waiting';

// Stage type
type StageType = 'build' | 'test' | 'security' | 'deploy' | 'notify' | 'approval' | 'custom';

// Environment type
type DeployEnvironment = 'development' | 'staging' | 'production' | 'testing' | 'preview';

// Deployment strategy
type DeploymentStrategy = 'rolling' | 'blue_green' | 'canary' | 'recreate' | 'a_b_testing';

// Trigger type
type TriggerType = 'push' | 'pull_request' | 'tag' | 'schedule' | 'manual' | 'webhook' | 'api';

// Pipeline
interface Pipeline {
  id: string;
  name: string;
  description: string;
  repository: {
    name: string;
    url: string;
    branch: string;
    provider: 'github' | 'gitlab' | 'bitbucket';
  };
  stages: PipelineStage[];
  triggers: PipelineTrigger[];
  variables: PipelineVariable[];
  secrets: string[];
  settings: {
    timeout: number;
    retries: number;
    concurrency: number;
    queueLimit: number;
    autoCancel: boolean;
    notifyOnFailure: boolean;
  };
  schedule?: {
    cron: string;
    timezone: string;
    enabled: boolean;
  };
  status: 'active' | 'inactive' | 'archived';
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    lastRunAt?: Date;
    runCount: number;
    successRate: number;
  };
}

// Pipeline stage
interface PipelineStage {
  id: string;
  name: string;
  type: StageType;
  order: number;
  jobs: PipelineJob[];
  condition?: {
    type: 'always' | 'on_success' | 'on_failure' | 'manual' | 'expression';
    expression?: string;
  };
  environment?: DeployEnvironment;
  approval?: {
    required: boolean;
    approvers: string[];
    timeout: number;
  };
  timeout: number;
  parallel: boolean;
}

// Pipeline job
interface PipelineJob {
  id: string;
  name: string;
  type: 'script' | 'docker' | 'kubernetes' | 'terraform' | 'custom';
  steps: JobStep[];
  runner: {
    type: 'hosted' | 'self_hosted' | 'container';
    image?: string;
    labels?: string[];
  };
  environment: Record<string, string>;
  artifacts?: {
    paths: string[];
    expireIn: number;
  };
  cache?: {
    key: string;
    paths: string[];
  };
  services?: {
    name: string;
    image: string;
    ports: number[];
  }[];
  timeout: number;
  retries: number;
}

// Job step
interface JobStep {
  id: string;
  name: string;
  type: 'run' | 'checkout' | 'upload' | 'download' | 'action';
  command?: string;
  script?: string;
  action?: {
    uses: string;
    with?: Record<string, unknown>;
  };
  workingDirectory?: string;
  continueOnError: boolean;
  timeout: number;
}

// Pipeline trigger
interface PipelineTrigger {
  id: string;
  type: TriggerType;
  enabled: boolean;
  config: {
    branches?: string[];
    tags?: string[];
    paths?: string[];
    ignorePaths?: string[];
    schedule?: string;
    events?: string[];
  };
}

// Pipeline variable
interface PipelineVariable {
  name: string;
  value: string;
  secret: boolean;
  scope: 'pipeline' | 'stage' | 'job';
  environment?: DeployEnvironment;
}

// Pipeline run
interface PipelineRun {
  id: string;
  pipelineId: string;
  pipelineName: string;
  number: number;
  status: PipelineStatus;
  trigger: {
    type: TriggerType;
    actor: string;
    ref?: string;
    commit?: string;
    message?: string;
  };
  stages: StageRun[];
  artifacts: Artifact[];
  variables: Record<string, string>;
  timing: {
    queuedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
    waitTime?: number;
  };
  logs: string[];
  errors: {
    stage: string;
    job: string;
    message: string;
    timestamp: Date;
  }[];
  metadata: {
    environment?: DeployEnvironment;
    version?: string;
    commit?: {
      sha: string;
      message: string;
      author: string;
      timestamp: Date;
    };
  };
}

// Stage run
interface StageRun {
  id: string;
  stageId: string;
  name: string;
  type: StageType;
  status: PipelineStatus;
  jobs: JobRun[];
  approval?: {
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: Date;
    comments?: string;
  };
  timing: {
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
  };
}

// Job run
interface JobRun {
  id: string;
  jobId: string;
  name: string;
  status: PipelineStatus;
  steps: StepRun[];
  runner: {
    id: string;
    name: string;
    type: string;
  };
  timing: {
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
  };
  logs: string[];
  exitCode?: number;
}

// Step run
interface StepRun {
  id: string;
  stepId: string;
  name: string;
  status: PipelineStatus;
  output?: string;
  timing: {
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
  };
  exitCode?: number;
}

// Artifact
interface Artifact {
  id: string;
  runId: string;
  name: string;
  path: string;
  size: number;
  type: string;
  downloadUrl: string;
  expiresAt: Date;
  metadata: {
    createdAt: Date;
    downloads: number;
  };
}

// Deployment
interface Deployment {
  id: string;
  runId: string;
  pipelineId: string;
  environment: DeployEnvironment;
  status: 'pending' | 'in_progress' | 'success' | 'failed' | 'rolled_back';
  strategy: DeploymentStrategy;
  version: string;
  previousVersion?: string;
  services: DeployedService[];
  healthChecks: HealthCheck[];
  rollback?: {
    available: boolean;
    version?: string;
    rolledBackAt?: Date;
    rolledBackBy?: string;
    reason?: string;
  };
  traffic?: {
    current: number;
    target: number;
    increments: number;
  };
  timing: {
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
  };
  metadata: {
    deployedBy: string;
    commit: string;
    releaseNotes?: string;
  };
}

// Deployed service
interface DeployedService {
  name: string;
  version: string;
  replicas: {
    desired: number;
    ready: number;
    available: number;
  };
  endpoints: string[];
  status: 'healthy' | 'degraded' | 'unhealthy';
}

// Health check
interface HealthCheck {
  id: string;
  name: string;
  type: 'http' | 'tcp' | 'command';
  target: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastCheck: Date;
  responseTime?: number;
  details?: string;
}

// Release
interface Release {
  id: string;
  version: string;
  name: string;
  description: string;
  status: 'draft' | 'pending' | 'released' | 'archived';
  tag: string;
  commit: string;
  deployments: {
    environment: DeployEnvironment;
    deploymentId: string;
    status: string;
    deployedAt?: Date;
  }[];
  changelog: {
    type: 'feature' | 'bugfix' | 'enhancement' | 'breaking';
    description: string;
    issueId?: string;
  }[];
  assets: {
    name: string;
    url: string;
    size: number;
  }[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    releasedAt?: Date;
    releasedBy?: string;
  };
}

// Pipeline metrics
interface PipelineMetrics {
  pipelineId: string;
  period: { start: Date; end: Date };
  runs: {
    total: number;
    successful: number;
    failed: number;
    cancelled: number;
  };
  timing: {
    averageDuration: number;
    medianDuration: number;
    p95Duration: number;
    averageWaitTime: number;
  };
  trends: {
    date: string;
    runs: number;
    successRate: number;
    avgDuration: number;
  }[];
  failureReasons: {
    reason: string;
    count: number;
    percentage: number;
  }[];
  stageMetrics: {
    stage: string;
    avgDuration: number;
    successRate: number;
  }[];
}

class DeploymentPipelineService {
  private static instance: DeploymentPipelineService;
  private pipelines: Map<string, Pipeline> = new Map();
  private runs: Map<string, PipelineRun> = new Map();
  private deployments: Map<string, Deployment> = new Map();
  private releases: Map<string, Release> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): DeploymentPipelineService {
    if (!DeploymentPipelineService.instance) {
      DeploymentPipelineService.instance = new DeploymentPipelineService();
    }
    return DeploymentPipelineService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize pipelines
    const pipelinesData = [
      { name: 'Main CI/CD', description: 'Main continuous integration and deployment pipeline' },
      { name: 'PR Validation', description: 'Pull request validation pipeline' },
      { name: 'Nightly Build', description: 'Nightly build and test pipeline' },
      { name: 'Security Scan', description: 'Security scanning pipeline' },
      { name: 'Release Pipeline', description: 'Release and deployment pipeline' },
    ];

    pipelinesData.forEach((p, idx) => {
      const pipeline: Pipeline = {
        id: `pipeline-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: p.description,
        repository: {
          name: 'rescue-ping',
          url: 'https://github.com/rescueping/rescue-ping',
          branch: idx === 1 ? '*' : 'main',
          provider: 'github',
        },
        stages: [],
        triggers: [],
        variables: [
          { name: 'NODE_ENV', value: 'production', secret: false, scope: 'pipeline' },
          { name: 'API_URL', value: 'https://api.rescueping.com', secret: false, scope: 'pipeline' },
        ],
        secrets: ['DATABASE_PASSWORD', 'JWT_SECRET', 'AWS_SECRET_KEY'],
        settings: {
          timeout: 3600,
          retries: 2,
          concurrency: 3,
          queueLimit: 10,
          autoCancel: true,
          notifyOnFailure: true,
        },
        schedule: idx === 2 ? { cron: '0 0 * * *', timezone: 'Asia/Kolkata', enabled: true } : undefined,
        status: 'active',
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          lastRunAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          runCount: Math.floor(Math.random() * 500) + 100,
          successRate: 85 + Math.random() * 10,
        },
      };

      // Add stages
      const stagesTemplates = [
        { name: 'Build', type: 'build', order: 1 },
        { name: 'Unit Tests', type: 'test', order: 2 },
        { name: 'Security Scan', type: 'security', order: 3 },
        { name: 'Deploy to Staging', type: 'deploy', order: 4, environment: 'staging' },
        { name: 'Integration Tests', type: 'test', order: 5 },
        { name: 'Approval', type: 'approval', order: 6, approval: true },
        { name: 'Deploy to Production', type: 'deploy', order: 7, environment: 'production' },
      ];

      stagesTemplates.slice(0, idx === 1 ? 3 : 7).forEach((st) => {
        const stage: PipelineStage = {
          id: `stage-${idx}-${st.order}`,
          name: st.name,
          type: st.type as StageType,
          order: st.order,
          jobs: [
            {
              id: `job-${idx}-${st.order}-1`,
              name: `${st.name} Job`,
              type: 'script',
              steps: [
                {
                  id: `step-${idx}-${st.order}-1`,
                  name: 'Checkout',
                  type: 'checkout',
                  continueOnError: false,
                  timeout: 60,
                },
                {
                  id: `step-${idx}-${st.order}-2`,
                  name: 'Execute',
                  type: 'run',
                  command: st.type === 'build' ? 'npm run build' :
                           st.type === 'test' ? 'npm run test' :
                           st.type === 'security' ? 'npm audit' : 'echo "Step"',
                  continueOnError: false,
                  timeout: 600,
                },
              ],
              runner: { type: 'hosted', image: 'node:18' },
              environment: {},
              timeout: 1800,
              retries: 1,
            },
          ],
          condition: st.approval ? { type: 'manual' } : { type: 'on_success' },
          environment: st.environment as DeployEnvironment | undefined,
          approval: st.approval ? { required: true, approvers: ['tech-lead', 'manager'], timeout: 86400 } : undefined,
          timeout: 1800,
          parallel: false,
        };
        pipeline.stages.push(stage);
      });

      // Add triggers
      pipeline.triggers = [
        { id: `trigger-${idx}-1`, type: 'push', enabled: true, config: { branches: ['main'] } },
        { id: `trigger-${idx}-2`, type: 'pull_request', enabled: true, config: { branches: ['main'] } },
        { id: `trigger-${idx}-3`, type: 'manual', enabled: true, config: {} },
      ];

      this.pipelines.set(pipeline.id, pipeline);
    });

    // Initialize pipeline runs
    for (let i = 0; i < 50; i++) {
      const pipelineIdx = i % 5;
      const pipeline = Array.from(this.pipelines.values())[pipelineIdx];
      const statuses: PipelineStatus[] = ['success', 'success', 'success', 'failed', 'running'];
      const status = statuses[i % 5];

      const run: PipelineRun = {
        id: `run-${(i + 1).toString().padStart(6, '0')}`,
        pipelineId: pipeline.id,
        pipelineName: pipeline.name,
        number: Math.floor(i / 5) + 1,
        status,
        trigger: {
          type: ['push', 'pull_request', 'manual'][i % 3] as TriggerType,
          actor: `user-${(i % 5) + 1}`,
          ref: 'main',
          commit: this.generateCommitSha(),
          message: `Commit message for run ${i + 1}`,
        },
        stages: pipeline.stages.map((stage, stageIdx) => ({
          id: `stage-run-${i}-${stageIdx}`,
          stageId: stage.id,
          name: stage.name,
          type: stage.type,
          status: status === 'running' && stageIdx === 2 ? 'running' :
                  status === 'failed' && stageIdx === 3 ? 'failed' :
                  stageIdx <= 3 || status === 'success' ? 'success' : 'pending',
          jobs: stage.jobs.map((job) => ({
            id: `job-run-${i}-${stageIdx}`,
            jobId: job.id,
            name: job.name,
            status: 'success' as PipelineStatus,
            steps: job.steps.map((step) => ({
              id: `step-run-${i}-${stageIdx}`,
              stepId: step.id,
              name: step.name,
              status: 'success' as PipelineStatus,
              timing: {
                startedAt: new Date(Date.now() - Math.random() * 60000),
                completedAt: new Date(),
                duration: Math.floor(Math.random() * 60),
              },
            })),
            runner: { id: 'runner-1', name: 'GitHub Hosted Runner', type: 'hosted' },
            timing: {
              startedAt: new Date(Date.now() - Math.random() * 600000),
              completedAt: status !== 'running' ? new Date() : undefined,
              duration: Math.floor(Math.random() * 300),
            },
            logs: [],
          })),
          timing: {
            startedAt: new Date(Date.now() - Math.random() * 600000),
            completedAt: status !== 'running' || stageIdx < 2 ? new Date() : undefined,
            duration: Math.floor(Math.random() * 300),
          },
        })),
        artifacts: [],
        variables: {},
        timing: {
          queuedAt: new Date(Date.now() - (i + 1) * 60 * 60 * 1000),
          startedAt: new Date(Date.now() - i * 60 * 60 * 1000),
          completedAt: status !== 'running' ? new Date() : undefined,
          duration: Math.floor(Math.random() * 1800) + 300,
          waitTime: Math.floor(Math.random() * 60),
        },
        logs: [],
        errors: status === 'failed' ? [{
          stage: 'Deploy to Staging',
          job: 'Deploy Job',
          message: 'Deployment failed: Connection timeout',
          timestamp: new Date(),
        }] : [],
        metadata: {
          environment: i % 3 === 0 ? 'production' : 'staging',
          version: `1.${Math.floor(i / 10)}.${i % 10}`,
          commit: {
            sha: this.generateCommitSha(),
            message: `Feature: Add new functionality #${i + 1}`,
            author: `Developer ${(i % 5) + 1}`,
            timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
          },
        },
      };

      // Add artifacts
      if (status === 'success' && i % 3 === 0) {
        run.artifacts.push({
          id: `artifact-${i}`,
          runId: run.id,
          name: 'build-output',
          path: 'dist/',
          size: Math.floor(Math.random() * 10000000) + 1000000,
          type: 'directory',
          downloadUrl: `https://artifacts.rescueping.com/${run.id}/build-output.zip`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          metadata: {
            createdAt: new Date(),
            downloads: Math.floor(Math.random() * 50),
          },
        });
      }

      this.runs.set(run.id, run);
    }

    // Initialize deployments
    for (let i = 0; i < 20; i++) {
      const deployment: Deployment = {
        id: `deployment-${(i + 1).toString().padStart(4, '0')}`,
        runId: `run-${((i * 3) + 1).toString().padStart(6, '0')}`,
        pipelineId: `pipeline-${((i % 5) + 1).toString().padStart(4, '0')}`,
        environment: i % 3 === 0 ? 'production' : i % 3 === 1 ? 'staging' : 'development',
        status: ['success', 'success', 'success', 'failed', 'in_progress'][i % 5] as Deployment['status'],
        strategy: ['rolling', 'blue_green', 'canary'][i % 3] as DeploymentStrategy,
        version: `2.${Math.floor(i / 5)}.${i % 5}`,
        previousVersion: i > 0 ? `2.${Math.floor((i - 1) / 5)}.${(i - 1) % 5}` : undefined,
        services: [
          {
            name: 'api-service',
            version: `2.${Math.floor(i / 5)}.${i % 5}`,
            replicas: { desired: 3, ready: 3, available: 3 },
            endpoints: ['https://api.rescueping.com'],
            status: 'healthy',
          },
          {
            name: 'web-service',
            version: `2.${Math.floor(i / 5)}.${i % 5}`,
            replicas: { desired: 2, ready: 2, available: 2 },
            endpoints: ['https://rescueping.com'],
            status: 'healthy',
          },
        ],
        healthChecks: [
          {
            id: `health-${i}-1`,
            name: 'API Health',
            type: 'http',
            target: 'https://api.rescueping.com/health',
            status: 'healthy',
            lastCheck: new Date(),
            responseTime: Math.floor(Math.random() * 100) + 50,
          },
          {
            id: `health-${i}-2`,
            name: 'Database Connection',
            type: 'tcp',
            target: 'db.rescueping.com:5432',
            status: 'healthy',
            lastCheck: new Date(),
          },
        ],
        rollback: {
          available: i % 5 < 3,
          version: i > 0 ? `2.${Math.floor((i - 1) / 5)}.${(i - 1) % 5}` : undefined,
        },
        traffic: i % 3 === 2 ? { current: 50, target: 100, increments: 10 } : undefined,
        timing: {
          startedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
          completedAt: i % 5 !== 4 ? new Date(Date.now() - i * 24 * 60 * 60 * 1000) : undefined,
          duration: Math.floor(Math.random() * 600) + 120,
        },
        metadata: {
          deployedBy: `user-${(i % 5) + 1}`,
          commit: this.generateCommitSha(),
          releaseNotes: `Release notes for version 2.${Math.floor(i / 5)}.${i % 5}`,
        },
      };
      this.deployments.set(deployment.id, deployment);
    }

    // Initialize releases
    for (let i = 0; i < 10; i++) {
      const release: Release = {
        id: `release-${(i + 1).toString().padStart(4, '0')}`,
        version: `2.${i}.0`,
        name: `Release v2.${i}.0`,
        description: `Major release v2.${i}.0 with new features and improvements`,
        status: i === 0 ? 'released' : i === 1 ? 'pending' : 'draft',
        tag: `v2.${i}.0`,
        commit: this.generateCommitSha(),
        deployments: [
          { environment: 'production', deploymentId: `deployment-${(i * 2 + 1).toString().padStart(4, '0')}`, status: 'success', deployedAt: new Date() },
          { environment: 'staging', deploymentId: `deployment-${(i * 2 + 2).toString().padStart(4, '0')}`, status: 'success', deployedAt: new Date() },
        ],
        changelog: [
          { type: 'feature', description: 'Added new alert management features', issueId: `#${100 + i * 3}` },
          { type: 'bugfix', description: 'Fixed notification delivery issues', issueId: `#${101 + i * 3}` },
          { type: 'enhancement', description: 'Improved performance and stability', issueId: `#${102 + i * 3}` },
        ],
        assets: [
          { name: `rescue-ping-v2.${i}.0.zip`, url: `https://releases.rescueping.com/v2.${i}.0/rescue-ping.zip`, size: 50000000 },
          { name: 'CHANGELOG.md', url: `https://releases.rescueping.com/v2.${i}.0/CHANGELOG.md`, size: 10000 },
        ],
        metadata: {
          createdAt: new Date(Date.now() - (i + 1) * 14 * 24 * 60 * 60 * 1000),
          createdBy: 'release-manager',
          releasedAt: i === 0 ? new Date() : undefined,
          releasedBy: i === 0 ? 'release-manager' : undefined,
        },
      };
      this.releases.set(release.id, release);
    }
  }

  /**
   * Generate commit SHA
   */
  private generateCommitSha(): string {
    return Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  /**
   * Get pipelines
   */
  public getPipelines(filter?: { status?: Pipeline['status'] }): Pipeline[] {
    let pipelines = Array.from(this.pipelines.values());
    if (filter?.status) pipelines = pipelines.filter((p) => p.status === filter.status);
    return pipelines.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get pipeline
   */
  public getPipeline(id: string): Pipeline | undefined {
    return this.pipelines.get(id);
  }

  /**
   * Get pipeline runs
   */
  public getRuns(filter?: {
    pipelineId?: string;
    status?: PipelineStatus[];
    limit?: number;
  }): PipelineRun[] {
    let runs = Array.from(this.runs.values());
    if (filter?.pipelineId) runs = runs.filter((r) => r.pipelineId === filter.pipelineId);
    if (filter?.status?.length) runs = runs.filter((r) => filter.status!.includes(r.status));
    runs = runs.sort((a, b) => b.timing.queuedAt.getTime() - a.timing.queuedAt.getTime());
    if (filter?.limit) runs = runs.slice(0, filter.limit);
    return runs;
  }

  /**
   * Get run
   */
  public getRun(id: string): PipelineRun | undefined {
    return this.runs.get(id);
  }

  /**
   * Trigger pipeline
   */
  public triggerPipeline(pipelineId: string, actor: string, ref?: string): PipelineRun {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) throw new Error('Pipeline not found');

    const runNumber = Array.from(this.runs.values())
      .filter((r) => r.pipelineId === pipelineId).length + 1;

    const run: PipelineRun = {
      id: `run-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      pipelineId,
      pipelineName: pipeline.name,
      number: runNumber,
      status: 'pending',
      trigger: {
        type: 'manual',
        actor,
        ref: ref || pipeline.repository.branch,
        commit: this.generateCommitSha(),
      },
      stages: pipeline.stages.map((stage) => ({
        id: `stage-run-${Date.now()}-${stage.id}`,
        stageId: stage.id,
        name: stage.name,
        type: stage.type,
        status: 'pending',
        jobs: stage.jobs.map((job) => ({
          id: `job-run-${Date.now()}-${job.id}`,
          jobId: job.id,
          name: job.name,
          status: 'pending',
          steps: job.steps.map((step) => ({
            id: `step-run-${Date.now()}-${step.id}`,
            stepId: step.id,
            name: step.name,
            status: 'pending',
            timing: {},
          })),
          runner: { id: '', name: '', type: '' },
          timing: {},
          logs: [],
        })),
        timing: {},
      })),
      artifacts: [],
      variables: {},
      timing: {
        queuedAt: new Date(),
      },
      logs: [],
      errors: [],
      metadata: {},
    };

    this.runs.set(run.id, run);
    pipeline.metadata.lastRunAt = new Date();
    pipeline.metadata.runCount++;

    this.emit('pipeline_triggered', run);

    // Simulate starting the run
    setTimeout(() => {
      run.status = 'running';
      run.timing.startedAt = new Date();
      this.emit('pipeline_started', run);
    }, 1000);

    return run;
  }

  /**
   * Cancel run
   */
  public cancelRun(runId: string): void {
    const run = this.runs.get(runId);
    if (!run) throw new Error('Run not found');
    if (!['pending', 'running'].includes(run.status)) {
      throw new Error('Run cannot be cancelled');
    }

    run.status = 'cancelled';
    run.timing.completedAt = new Date();
    run.stages.forEach((stage) => {
      if (['pending', 'running'].includes(stage.status)) {
        stage.status = 'cancelled';
      }
    });

    this.emit('pipeline_cancelled', run);
  }

  /**
   * Approve stage
   */
  public approveStage(runId: string, stageId: string, approver: string, comments?: string): void {
    const run = this.runs.get(runId);
    if (!run) throw new Error('Run not found');

    const stage = run.stages.find((s) => s.stageId === stageId);
    if (!stage) throw new Error('Stage not found');
    if (stage.type !== 'approval') throw new Error('Stage does not require approval');

    stage.approval = {
      status: 'approved',
      approvedBy: approver,
      approvedAt: new Date(),
      comments,
    };
    stage.status = 'success';

    this.emit('stage_approved', { runId, stageId, approver });
  }

  /**
   * Get deployments
   */
  public getDeployments(filter?: {
    environment?: DeployEnvironment;
    status?: Deployment['status'];
    limit?: number;
  }): Deployment[] {
    let deployments = Array.from(this.deployments.values());
    if (filter?.environment) deployments = deployments.filter((d) => d.environment === filter.environment);
    if (filter?.status) deployments = deployments.filter((d) => d.status === filter.status);
    deployments = deployments.sort((a, b) => b.timing.startedAt.getTime() - a.timing.startedAt.getTime());
    if (filter?.limit) deployments = deployments.slice(0, filter.limit);
    return deployments;
  }

  /**
   * Get deployment
   */
  public getDeployment(id: string): Deployment | undefined {
    return this.deployments.get(id);
  }

  /**
   * Rollback deployment
   */
  public rollbackDeployment(deploymentId: string, actor: string, reason: string): Deployment {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) throw new Error('Deployment not found');
    if (!deployment.rollback?.available) throw new Error('Rollback not available');

    deployment.status = 'rolled_back';
    deployment.rollback.rolledBackAt = new Date();
    deployment.rollback.rolledBackBy = actor;
    deployment.rollback.reason = reason;

    this.emit('deployment_rolled_back', deployment);

    return deployment;
  }

  /**
   * Get releases
   */
  public getReleases(filter?: { status?: Release['status'] }): Release[] {
    let releases = Array.from(this.releases.values());
    if (filter?.status) releases = releases.filter((r) => r.status === filter.status);
    return releases.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  /**
   * Get release
   */
  public getRelease(id: string): Release | undefined {
    return this.releases.get(id);
  }

  /**
   * Get pipeline metrics
   */
  public getMetrics(pipelineId: string, period: { start: Date; end: Date }): PipelineMetrics {
    const runs = Array.from(this.runs.values())
      .filter((r) => r.pipelineId === pipelineId && r.timing.queuedAt >= period.start && r.timing.queuedAt <= period.end);

    const successful = runs.filter((r) => r.status === 'success').length;
    const failed = runs.filter((r) => r.status === 'failed').length;
    const cancelled = runs.filter((r) => r.status === 'cancelled').length;
    const durations = runs.filter((r) => r.timing.duration).map((r) => r.timing.duration!).sort((a, b) => a - b);

    return {
      pipelineId,
      period,
      runs: {
        total: runs.length,
        successful,
        failed,
        cancelled,
      },
      timing: {
        averageDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
        medianDuration: durations[Math.floor(durations.length / 2)] || 0,
        p95Duration: durations[Math.floor(durations.length * 0.95)] || 0,
        averageWaitTime: runs.reduce((a, r) => a + (r.timing.waitTime || 0), 0) / (runs.length || 1),
      },
      trends: [],
      failureReasons: [],
      stageMetrics: [],
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

export const deploymentPipelineService = DeploymentPipelineService.getInstance();
export type {
  PipelineStatus,
  StageType,
  DeployEnvironment,
  DeploymentStrategy,
  TriggerType,
  Pipeline,
  PipelineStage,
  PipelineJob,
  JobStep,
  PipelineTrigger,
  PipelineVariable,
  PipelineRun,
  StageRun,
  JobRun,
  StepRun,
  Artifact,
  Deployment,
  DeployedService,
  HealthCheck,
  Release,
  PipelineMetrics,
};
