/**
 * Alert Escalation Service
 * Comprehensive multi-tier escalation management, policy enforcement, and notification routing
 */

// Escalation status
type EscalationStatus = 'pending' | 'active' | 'acknowledged' | 'resolved' | 'expired' | 'cancelled';

// Escalation level
type EscalationLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'executive';

// Notification channel
type NotificationChannel = 'email' | 'sms' | 'phone' | 'slack' | 'pagerduty' | 'webhook' | 'push';

// Alert priority
type AlertPriority = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

// Response status
type ResponseStatus = 'no_response' | 'acknowledged' | 'declined' | 'delegated' | 'resolved';

// Escalation Policy
interface EscalationPolicy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  priority: AlertPriority[];
  conditions: {
    alertTypes: string[];
    services: string[];
    tags: string[];
    severity: number[];
    customRules?: string;
  };
  levels: EscalationLevelConfig[];
  settings: {
    repeatEscalation: boolean;
    maxRepeats: number;
    repeatInterval: number;
    autoResolveTimeout?: number;
    businessHoursOnly: boolean;
    timezone: string;
  };
  notifications: {
    onEscalation: boolean;
    onAcknowledge: boolean;
    onResolve: boolean;
    includeAlertDetails: boolean;
    customTemplate?: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    version: number;
  };
}

// Escalation Level Config
interface EscalationLevelConfig {
  level: EscalationLevel;
  name: string;
  timeout: number;
  targets: EscalationTarget[];
  notificationChannels: NotificationChannel[];
  notificationTemplate?: string;
  autoEscalate: boolean;
  requireAcknowledgment: boolean;
}

// Escalation Target
interface EscalationTarget {
  id: string;
  type: 'user' | 'team' | 'schedule' | 'service';
  targetId: string;
  name: string;
  priority: number;
  channels: {
    channel: NotificationChannel;
    address: string;
    verified: boolean;
  }[];
  availability?: {
    timezone: string;
    schedule: {
      day: number;
      start: string;
      end: string;
    }[];
  };
}

// Escalation Instance
interface EscalationInstance {
  id: string;
  alertId: string;
  alertTitle: string;
  policyId: string;
  policyName: string;
  status: EscalationStatus;
  priority: AlertPriority;
  currentLevel: EscalationLevel;
  startedAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  acknowledgedBy?: string;
  resolvedBy?: string;
  timeline: EscalationEvent[];
  notifications: NotificationRecord[];
  responses: EscalationResponse[];
  metadata: {
    source: string;
    service: string;
    environment: string;
    tags: string[];
    customFields: Record<string, unknown>;
  };
  metrics: {
    timeToAcknowledge?: number;
    timeToResolve?: number;
    totalNotifications: number;
    escalationCount: number;
  };
}

// Escalation Event
interface EscalationEvent {
  id: string;
  timestamp: Date;
  type: 'created' | 'escalated' | 'notified' | 'acknowledged' | 'resolved' | 'expired' | 'cancelled';
  level: EscalationLevel;
  details: {
    from?: EscalationLevel;
    to?: EscalationLevel;
    target?: string;
    channel?: NotificationChannel;
    message?: string;
    reason?: string;
  };
  actor?: {
    type: 'system' | 'user';
    id: string;
    name: string;
  };
}

// Notification Record
interface NotificationRecord {
  id: string;
  escalationId: string;
  level: EscalationLevel;
  targetId: string;
  targetName: string;
  channel: NotificationChannel;
  address: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failureReason?: string;
  retryCount: number;
  messageId?: string;
  content: {
    subject?: string;
    body: string;
    attachments?: string[];
  };
}

// Escalation Response
interface EscalationResponse {
  id: string;
  escalationId: string;
  responderId: string;
  responderName: string;
  status: ResponseStatus;
  timestamp: Date;
  message?: string;
  delegatedTo?: string;
  action?: {
    type: string;
    details: Record<string, unknown>;
  };
}

// On-Call Schedule
interface OnCallSchedule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  teamId: string;
  teamName: string;
  timezone: string;
  rotations: {
    id: string;
    name: string;
    type: 'daily' | 'weekly' | 'custom';
    participants: {
      userId: string;
      userName: string;
      order: number;
    }[];
    handoffTime: string;
    restrictions?: {
      type: 'time' | 'day';
      startTime?: string;
      endTime?: string;
      days?: number[];
    }[];
  }[];
  overrides: {
    id: string;
    userId: string;
    userName: string;
    start: Date;
    end: Date;
    reason: string;
  }[];
  current: {
    userId: string;
    userName: string;
    since: Date;
    until: Date;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Escalation Rule
interface EscalationRule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  priority: number;
  conditions: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'matches' | 'greater_than' | 'less_than';
    value: unknown;
  }[];
  actions: {
    type: 'assign' | 'notify' | 'escalate' | 'tag' | 'suppress' | 'custom';
    config: Record<string, unknown>;
  }[];
  schedule?: {
    enabled: boolean;
    timezone: string;
    windows: {
      days: number[];
      start: string;
      end: string;
    }[];
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    triggeredCount: number;
    lastTriggered?: Date;
  };
}

// Notification Template
interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  channel: NotificationChannel;
  status: 'active' | 'inactive' | 'draft';
  subject?: string;
  body: string;
  variables: {
    name: string;
    description: string;
    defaultValue?: string;
    required: boolean;
  }[];
  formatting: {
    html: boolean;
    markdown: boolean;
    customCss?: string;
  };
  preview?: string;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    usageCount: number;
  };
}

// Responder
interface Responder {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  team: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  channels: {
    channel: NotificationChannel;
    address: string;
    verified: boolean;
    preferred: boolean;
  }[];
  availability: {
    timezone: string;
    workingHours: {
      day: number;
      start: string;
      end: string;
    }[];
    vacations: {
      start: Date;
      end: Date;
      reason: string;
    }[];
  };
  statistics: {
    totalEscalations: number;
    acknowledged: number;
    avgResponseTime: number;
    lastOnCall?: Date;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Escalation Metrics
interface EscalationMetrics {
  overview: {
    totalEscalations: number;
    activeEscalations: number;
    acknowledgedRate: number;
    avgTimeToAcknowledge: number;
    avgTimeToResolve: number;
  };
  byPriority: {
    priority: AlertPriority;
    count: number;
    acknowledged: number;
    avgResponseTime: number;
  }[];
  byLevel: {
    level: EscalationLevel;
    count: number;
    percentage: number;
  }[];
  byChannel: {
    channel: NotificationChannel;
    sent: number;
    delivered: number;
    failed: number;
  }[];
  byTeam: {
    teamId: string;
    teamName: string;
    escalations: number;
    avgResponseTime: number;
  }[];
  trends: {
    timestamp: string;
    escalations: number;
    acknowledged: number;
    resolved: number;
  }[];
  performance: {
    slaCompliance: number;
    missedEscalations: number;
    autoResolvedCount: number;
  };
}

class AlertEscalationService {
  private static instance: AlertEscalationService;
  private policies: Map<string, EscalationPolicy> = new Map();
  private instances: Map<string, EscalationInstance> = new Map();
  private schedules: Map<string, OnCallSchedule> = new Map();
  private rules: Map<string, EscalationRule> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private responders: Map<string, Responder> = new Map();
  private notifications: Map<string, NotificationRecord> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): AlertEscalationService {
    if (!AlertEscalationService.instance) {
      AlertEscalationService.instance = new AlertEscalationService();
    }
    return AlertEscalationService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Responders
    const respondersData = [
      { name: 'John Smith', email: 'john.smith@rescueping.com', role: 'SRE Lead', team: 'Platform' },
      { name: 'Sarah Johnson', email: 'sarah.johnson@rescueping.com', role: 'Senior Engineer', team: 'Platform' },
      { name: 'Mike Chen', email: 'mike.chen@rescueping.com', role: 'DevOps Engineer', team: 'Infrastructure' },
      { name: 'Emily Davis', email: 'emily.davis@rescueping.com', role: 'SRE', team: 'Platform' },
      { name: 'Alex Wilson', email: 'alex.wilson@rescueping.com', role: 'Engineering Manager', team: 'Platform' },
      { name: 'Lisa Brown', email: 'lisa.brown@rescueping.com', role: 'VP Engineering', team: 'Executive' },
      { name: 'David Lee', email: 'david.lee@rescueping.com', role: 'DevOps Lead', team: 'Infrastructure' },
      { name: 'Amanda Taylor', email: 'amanda.taylor@rescueping.com', role: 'SRE', team: 'Infrastructure' },
    ];

    respondersData.forEach((r, idx) => {
      const responder: Responder = {
        id: `resp-${(idx + 1).toString().padStart(4, '0')}`,
        userId: `user-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name,
        email: r.email,
        phone: `+1-555-${(1000 + idx).toString()}`,
        role: r.role,
        team: r.team,
        status: ['available', 'available', 'busy', 'available'][idx % 4] as Responder['status'],
        channels: [
          { channel: 'email', address: r.email, verified: true, preferred: true },
          { channel: 'sms', address: `+1-555-${(1000 + idx).toString()}`, verified: true, preferred: false },
          { channel: 'slack', address: `@${r.name.toLowerCase().replace(' ', '.')}`, verified: true, preferred: false },
        ],
        availability: {
          timezone: 'America/New_York',
          workingHours: [
            { day: 1, start: '09:00', end: '17:00' },
            { day: 2, start: '09:00', end: '17:00' },
            { day: 3, start: '09:00', end: '17:00' },
            { day: 4, start: '09:00', end: '17:00' },
            { day: 5, start: '09:00', end: '17:00' },
          ],
          vacations: [],
        },
        statistics: {
          totalEscalations: Math.floor(Math.random() * 100) + 10,
          acknowledged: Math.floor(Math.random() * 90) + 10,
          avgResponseTime: Math.floor(Math.random() * 300) + 60,
          lastOnCall: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.responders.set(responder.id, responder);
    });

    // Initialize Escalation Policies
    const policiesData = [
      { name: 'Critical Infrastructure', priority: ['P1'], services: ['api-gateway', 'database'] },
      { name: 'Production Services', priority: ['P1', 'P2'], services: ['user-service', 'alert-service'] },
      { name: 'Standard Operations', priority: ['P2', 'P3'], services: ['notification-service'] },
      { name: 'Low Priority', priority: ['P3', 'P4', 'P5'], services: ['analytics-service'] },
    ];

    policiesData.forEach((p, idx) => {
      const respondersList = Array.from(this.responders.values());
      const policy: EscalationPolicy = {
        id: `policy-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: `Escalation policy for ${p.name.toLowerCase()}`,
        status: 'active',
        priority: p.priority as AlertPriority[],
        conditions: {
          alertTypes: ['incident', 'alert'],
          services: p.services,
          tags: [],
          severity: idx === 0 ? [4, 5] : idx === 1 ? [3, 4] : [1, 2, 3],
        },
        levels: [
          {
            level: 'L1',
            name: 'First Response',
            timeout: idx === 0 ? 5 : idx === 1 ? 15 : 30,
            targets: respondersList.slice(0, 2).map((r, i) => ({
              id: r.id,
              type: 'user',
              targetId: r.userId,
              name: r.name,
              priority: i + 1,
              channels: r.channels,
            })),
            notificationChannels: ['email', 'slack', 'sms'],
            autoEscalate: true,
            requireAcknowledgment: true,
          },
          {
            level: 'L2',
            name: 'Team Lead',
            timeout: idx === 0 ? 10 : idx === 1 ? 30 : 60,
            targets: respondersList.slice(2, 4).map((r, i) => ({
              id: r.id,
              type: 'user',
              targetId: r.userId,
              name: r.name,
              priority: i + 1,
              channels: r.channels,
            })),
            notificationChannels: ['email', 'slack', 'phone'],
            autoEscalate: true,
            requireAcknowledgment: true,
          },
          {
            level: 'L3',
            name: 'Management',
            timeout: idx === 0 ? 15 : idx === 1 ? 45 : 120,
            targets: respondersList.slice(4, 6).map((r, i) => ({
              id: r.id,
              type: 'user',
              targetId: r.userId,
              name: r.name,
              priority: i + 1,
              channels: r.channels,
            })),
            notificationChannels: ['email', 'phone'],
            autoEscalate: idx < 2,
            requireAcknowledgment: true,
          },
          {
            level: 'executive',
            name: 'Executive',
            timeout: 30,
            targets: respondersList.slice(5, 6).map((r, i) => ({
              id: r.id,
              type: 'user',
              targetId: r.userId,
              name: r.name,
              priority: i + 1,
              channels: r.channels,
            })),
            notificationChannels: ['phone'],
            autoEscalate: false,
            requireAcknowledgment: true,
          },
        ],
        settings: {
          repeatEscalation: true,
          maxRepeats: 3,
          repeatInterval: idx === 0 ? 15 : 30,
          autoResolveTimeout: idx > 1 ? 240 : undefined,
          businessHoursOnly: idx > 1,
          timezone: 'America/New_York',
        },
        notifications: {
          onEscalation: true,
          onAcknowledge: true,
          onResolve: true,
          includeAlertDetails: true,
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          version: 3,
        },
      };
      this.policies.set(policy.id, policy);
    });

    // Initialize On-Call Schedules
    const schedulesData = [
      { name: 'Platform On-Call', team: 'Platform' },
      { name: 'Infrastructure On-Call', team: 'Infrastructure' },
    ];

    schedulesData.forEach((s, idx) => {
      const teamResponders = Array.from(this.responders.values()).filter((r) => r.team === s.team);
      const schedule: OnCallSchedule = {
        id: `sched-${(idx + 1).toString().padStart(4, '0')}`,
        name: s.name,
        description: `On-call schedule for ${s.team} team`,
        status: 'active',
        teamId: `team-${(idx + 1).toString().padStart(4, '0')}`,
        teamName: s.team,
        timezone: 'America/New_York',
        rotations: [
          {
            id: `rot-${idx + 1}-1`,
            name: 'Primary',
            type: 'weekly',
            participants: teamResponders.map((r, i) => ({
              userId: r.userId,
              userName: r.name,
              order: i + 1,
            })),
            handoffTime: '09:00',
          },
          {
            id: `rot-${idx + 1}-2`,
            name: 'Secondary',
            type: 'weekly',
            participants: teamResponders.reverse().map((r, i) => ({
              userId: r.userId,
              userName: r.name,
              order: i + 1,
            })),
            handoffTime: '09:00',
          },
        ],
        overrides: [],
        current: {
          userId: teamResponders[0]?.userId || '',
          userName: teamResponders[0]?.name || '',
          since: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          until: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.schedules.set(schedule.id, schedule);
    });

    // Initialize Escalation Rules
    const rulesData = [
      { name: 'Critical Service Down', field: 'service', operator: 'equals', value: 'api-gateway' },
      { name: 'High CPU Alert', field: 'metric', operator: 'contains', value: 'cpu' },
      { name: 'Database Errors', field: 'source', operator: 'contains', value: 'database' },
      { name: 'Security Incident', field: 'tags', operator: 'contains', value: 'security' },
    ];

    rulesData.forEach((r, idx) => {
      const rule: EscalationRule = {
        id: `rule-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name,
        description: `Escalation rule for ${r.name.toLowerCase()}`,
        status: 'active',
        priority: idx + 1,
        conditions: [
          {
            field: r.field,
            operator: r.operator as EscalationRule['conditions'][0]['operator'],
            value: r.value,
          },
        ],
        actions: [
          {
            type: 'escalate',
            config: { policyId: `policy-${(idx % 4 + 1).toString().padStart(4, '0')}` },
          },
          {
            type: 'notify',
            config: { channels: ['slack'] },
          },
        ],
        schedule: {
          enabled: false,
          timezone: 'America/New_York',
          windows: [
            { days: [1, 2, 3, 4, 5], start: '00:00', end: '23:59' },
          ],
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          triggeredCount: Math.floor(Math.random() * 500) + 50,
          lastTriggered: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        },
      };
      this.rules.set(rule.id, rule);
    });

    // Initialize Notification Templates
    const templatesData = [
      { name: 'Critical Alert', channel: 'email', subject: '[CRITICAL] {{alert_title}}' },
      { name: 'Escalation Notice', channel: 'email', subject: '[ESCALATED] {{alert_title}} - Level {{level}}' },
      { name: 'SMS Alert', channel: 'sms', subject: undefined },
      { name: 'Slack Notification', channel: 'slack', subject: undefined },
    ];

    templatesData.forEach((t, idx) => {
      const template: NotificationTemplate = {
        id: `tmpl-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: `Template for ${t.name.toLowerCase()}`,
        channel: t.channel as NotificationChannel,
        status: 'active',
        subject: t.subject,
        body: `Alert: {{alert_title}}\nService: {{service}}\nPriority: {{priority}}\nTime: {{timestamp}}\n\n{{alert_description}}\n\nAcknowledge: {{acknowledge_url}}`,
        variables: [
          { name: 'alert_title', description: 'Alert title', required: true },
          { name: 'service', description: 'Affected service', required: true },
          { name: 'priority', description: 'Alert priority', required: true },
          { name: 'timestamp', description: 'Alert timestamp', required: true },
          { name: 'alert_description', description: 'Alert description', required: false, defaultValue: 'No description provided' },
          { name: 'acknowledge_url', description: 'URL to acknowledge', required: true },
        ],
        formatting: {
          html: t.channel === 'email',
          markdown: t.channel === 'slack',
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          usageCount: Math.floor(Math.random() * 10000) + 1000,
        },
      };
      this.templates.set(template.id, template);
    });

    // Initialize Escalation Instances
    const policiesList = Array.from(this.policies.values());
    const respondersList = Array.from(this.responders.values());

    for (let i = 0; i < 50; i++) {
      const policy = policiesList[i % policiesList.length];
      const status = ['active', 'acknowledged', 'resolved', 'expired'][i % 4] as EscalationStatus;
      const level = ['L1', 'L2', 'L3'][Math.min(i % 3, 2)] as EscalationLevel;
      const responder = respondersList[i % respondersList.length];

      const startTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const ackTime = status !== 'active' ? new Date(startTime.getTime() + Math.random() * 30 * 60 * 1000) : undefined;
      const resolveTime = status === 'resolved' ? new Date((ackTime?.getTime() || startTime.getTime()) + Math.random() * 60 * 60 * 1000) : undefined;

      const instance: EscalationInstance = {
        id: `esc-${(i + 1).toString().padStart(6, '0')}`,
        alertId: `alert-${(i + 1000).toString().padStart(6, '0')}`,
        alertTitle: `${['High CPU usage', 'Service unavailable', 'Database connection timeout', 'Memory exhaustion'][i % 4]} on ${['api-gateway', 'user-service', 'database', 'cache'][i % 4]}`,
        policyId: policy.id,
        policyName: policy.name,
        status,
        priority: ['P1', 'P2', 'P3'][i % 3] as AlertPriority,
        currentLevel: level,
        startedAt: startTime,
        acknowledgedAt: ackTime,
        resolvedAt: resolveTime,
        acknowledgedBy: ackTime ? responder.name : undefined,
        resolvedBy: resolveTime ? responder.name : undefined,
        timeline: [
          {
            id: `event-${i}-1`,
            timestamp: startTime,
            type: 'created',
            level: 'L1',
            details: { message: 'Escalation created' },
            actor: { type: 'system', id: 'system', name: 'Alert System' },
          },
          ...(level !== 'L1' ? [{
            id: `event-${i}-2`,
            timestamp: new Date(startTime.getTime() + policy.levels[0].timeout * 60 * 1000),
            type: 'escalated' as const,
            level: 'L2' as EscalationLevel,
            details: { from: 'L1' as EscalationLevel, to: 'L2' as EscalationLevel, reason: 'Timeout exceeded' },
            actor: { type: 'system' as const, id: 'system', name: 'Escalation Engine' },
          }] : []),
          ...(ackTime ? [{
            id: `event-${i}-3`,
            timestamp: ackTime,
            type: 'acknowledged' as const,
            level,
            details: { message: 'Alert acknowledged' },
            actor: { type: 'user' as const, id: responder.userId, name: responder.name },
          }] : []),
        ],
        notifications: [
          {
            id: `notif-${i}-1`,
            escalationId: `esc-${(i + 1).toString().padStart(6, '0')}`,
            level: 'L1',
            targetId: responder.id,
            targetName: responder.name,
            channel: 'email',
            address: responder.email,
            status: 'delivered',
            sentAt: startTime,
            deliveredAt: new Date(startTime.getTime() + 5000),
            retryCount: 0,
            content: {
              subject: `[ALERT] ${['High CPU usage', 'Service unavailable', 'Database timeout', 'Memory issue'][i % 4]}`,
              body: 'Alert details...',
            },
          },
        ],
        responses: ackTime ? [
          {
            id: `resp-${i}-1`,
            escalationId: `esc-${(i + 1).toString().padStart(6, '0')}`,
            responderId: responder.id,
            responderName: responder.name,
            status: 'acknowledged',
            timestamp: ackTime,
            message: 'Looking into it',
          },
        ] : [],
        metadata: {
          source: 'monitoring-system',
          service: ['api-gateway', 'user-service', 'database', 'cache'][i % 4],
          environment: 'production',
          tags: ['automated', 'monitoring'],
          customFields: {},
        },
        metrics: {
          timeToAcknowledge: ackTime ? (ackTime.getTime() - startTime.getTime()) / 1000 : undefined,
          timeToResolve: resolveTime ? (resolveTime.getTime() - startTime.getTime()) / 1000 : undefined,
          totalNotifications: Math.floor(Math.random() * 5) + 1,
          escalationCount: ['L1', 'L2', 'L3'].indexOf(level),
        },
      };
      this.instances.set(instance.id, instance);
    }
  }

  // Policy Operations
  public getPolicies(filter?: { status?: EscalationPolicy['status'] }): EscalationPolicy[] {
    let policies = Array.from(this.policies.values());
    if (filter?.status) policies = policies.filter((p) => p.status === filter.status);
    return policies;
  }

  public getPolicyById(id: string): EscalationPolicy | undefined {
    return this.policies.get(id);
  }

  public createPolicy(data: Partial<EscalationPolicy>): EscalationPolicy {
    const policy: EscalationPolicy = {
      id: `policy-${this.generateId()}`,
      name: data.name || 'Unnamed Policy',
      description: data.description || '',
      status: 'draft',
      priority: data.priority || ['P3'],
      conditions: data.conditions || { alertTypes: [], services: [], tags: [], severity: [] },
      levels: data.levels || [],
      settings: data.settings || {
        repeatEscalation: false,
        maxRepeats: 3,
        repeatInterval: 30,
        businessHoursOnly: false,
        timezone: 'UTC',
      },
      notifications: data.notifications || {
        onEscalation: true,
        onAcknowledge: true,
        onResolve: true,
        includeAlertDetails: true,
      },
      metadata: {
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
        version: 1,
      },
    };
    this.policies.set(policy.id, policy);
    this.emit('policy_created', policy);
    return policy;
  }

  public updatePolicy(id: string, updates: Partial<EscalationPolicy>): EscalationPolicy {
    const policy = this.policies.get(id);
    if (!policy) throw new Error('Policy not found');

    const updated = {
      ...policy,
      ...updates,
      metadata: {
        ...policy.metadata,
        updatedAt: new Date(),
        version: policy.metadata.version + 1,
      },
    };
    this.policies.set(id, updated);
    this.emit('policy_updated', updated);
    return updated;
  }

  // Instance Operations
  public getInstances(filter?: { status?: EscalationStatus; priority?: AlertPriority; policyId?: string }): EscalationInstance[] {
    let instances = Array.from(this.instances.values());
    if (filter?.status) instances = instances.filter((i) => i.status === filter.status);
    if (filter?.priority) instances = instances.filter((i) => i.priority === filter.priority);
    if (filter?.policyId) instances = instances.filter((i) => i.policyId === filter.policyId);
    return instances.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }

  public getInstanceById(id: string): EscalationInstance | undefined {
    return this.instances.get(id);
  }

  public createEscalation(alertId: string, policyId: string, alertTitle: string, priority: AlertPriority): EscalationInstance {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error('Policy not found');

    const instance: EscalationInstance = {
      id: `esc-${this.generateId()}`,
      alertId,
      alertTitle,
      policyId,
      policyName: policy.name,
      status: 'pending',
      priority,
      currentLevel: 'L1',
      startedAt: new Date(),
      timeline: [{
        id: this.generateId(),
        timestamp: new Date(),
        type: 'created',
        level: 'L1',
        details: { message: 'Escalation created' },
        actor: { type: 'system', id: 'system', name: 'Alert System' },
      }],
      notifications: [],
      responses: [],
      metadata: {
        source: 'api',
        service: '',
        environment: 'production',
        tags: [],
        customFields: {},
      },
      metrics: {
        totalNotifications: 0,
        escalationCount: 0,
      },
    };

    this.instances.set(instance.id, instance);
    this.emit('escalation_created', instance);
    return instance;
  }

  public acknowledgeEscalation(id: string, userId: string, message?: string): EscalationInstance {
    const instance = this.instances.get(id);
    if (!instance) throw new Error('Escalation not found');

    const responder = Array.from(this.responders.values()).find((r) => r.userId === userId);
    instance.status = 'acknowledged';
    instance.acknowledgedAt = new Date();
    instance.acknowledgedBy = responder?.name || userId;
    instance.metrics.timeToAcknowledge = (Date.now() - instance.startedAt.getTime()) / 1000;

    instance.timeline.push({
      id: this.generateId(),
      timestamp: new Date(),
      type: 'acknowledged',
      level: instance.currentLevel,
      details: { message: message || 'Alert acknowledged' },
      actor: { type: 'user', id: userId, name: responder?.name || userId },
    });

    instance.responses.push({
      id: this.generateId(),
      escalationId: instance.id,
      responderId: userId,
      responderName: responder?.name || userId,
      status: 'acknowledged',
      timestamp: new Date(),
      message,
    });

    this.emit('escalation_acknowledged', instance);
    return instance;
  }

  public resolveEscalation(id: string, userId: string, message?: string): EscalationInstance {
    const instance = this.instances.get(id);
    if (!instance) throw new Error('Escalation not found');

    const responder = Array.from(this.responders.values()).find((r) => r.userId === userId);
    instance.status = 'resolved';
    instance.resolvedAt = new Date();
    instance.resolvedBy = responder?.name || userId;
    instance.metrics.timeToResolve = (Date.now() - instance.startedAt.getTime()) / 1000;

    instance.timeline.push({
      id: this.generateId(),
      timestamp: new Date(),
      type: 'resolved',
      level: instance.currentLevel,
      details: { message: message || 'Alert resolved' },
      actor: { type: 'user', id: userId, name: responder?.name || userId },
    });

    this.emit('escalation_resolved', instance);
    return instance;
  }

  public escalateToNextLevel(id: string): EscalationInstance {
    const instance = this.instances.get(id);
    if (!instance) throw new Error('Escalation not found');

    const policy = this.policies.get(instance.policyId);
    if (!policy) throw new Error('Policy not found');

    const levels: EscalationLevel[] = ['L1', 'L2', 'L3', 'L4', 'executive'];
    const currentIndex = levels.indexOf(instance.currentLevel);
    const nextLevel = levels[currentIndex + 1];

    if (!nextLevel) throw new Error('Already at highest level');

    instance.currentLevel = nextLevel;
    instance.metrics.escalationCount++;

    instance.timeline.push({
      id: this.generateId(),
      timestamp: new Date(),
      type: 'escalated',
      level: nextLevel,
      details: {
        from: levels[currentIndex],
        to: nextLevel,
        reason: 'Manual escalation',
      },
      actor: { type: 'system', id: 'system', name: 'Escalation Engine' },
    });

    this.emit('escalation_escalated', instance);
    return instance;
  }

  // Schedule Operations
  public getSchedules(): OnCallSchedule[] {
    return Array.from(this.schedules.values());
  }

  public getScheduleById(id: string): OnCallSchedule | undefined {
    return this.schedules.get(id);
  }

  public getCurrentOnCall(scheduleId: string): OnCallSchedule['current'] | undefined {
    const schedule = this.schedules.get(scheduleId);
    return schedule?.current;
  }

  // Rule Operations
  public getRules(): EscalationRule[] {
    return Array.from(this.rules.values());
  }

  public getRuleById(id: string): EscalationRule | undefined {
    return this.rules.get(id);
  }

  // Template Operations
  public getTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplateById(id: string): NotificationTemplate | undefined {
    return this.templates.get(id);
  }

  // Responder Operations
  public getResponders(filter?: { team?: string; status?: Responder['status'] }): Responder[] {
    let responders = Array.from(this.responders.values());
    if (filter?.team) responders = responders.filter((r) => r.team === filter.team);
    if (filter?.status) responders = responders.filter((r) => r.status === filter.status);
    return responders;
  }

  public getResponderById(id: string): Responder | undefined {
    return this.responders.get(id);
  }

  // Metrics
  public getMetrics(): EscalationMetrics {
    const instances = Array.from(this.instances.values());
    const acknowledged = instances.filter((i) => i.status === 'acknowledged' || i.status === 'resolved');
    const resolved = instances.filter((i) => i.status === 'resolved');

    const priorities: AlertPriority[] = ['P1', 'P2', 'P3', 'P4', 'P5'];
    const levels: EscalationLevel[] = ['L1', 'L2', 'L3', 'L4', 'executive'];
    const channels: NotificationChannel[] = ['email', 'sms', 'phone', 'slack', 'pagerduty', 'webhook', 'push'];

    return {
      overview: {
        totalEscalations: instances.length,
        activeEscalations: instances.filter((i) => i.status === 'active' || i.status === 'pending').length,
        acknowledgedRate: (acknowledged.length / instances.length) * 100,
        avgTimeToAcknowledge: acknowledged.reduce((sum, i) => sum + (i.metrics.timeToAcknowledge || 0), 0) / acknowledged.length,
        avgTimeToResolve: resolved.reduce((sum, i) => sum + (i.metrics.timeToResolve || 0), 0) / resolved.length,
      },
      byPriority: priorities.map((p) => {
        const priorityInstances = instances.filter((i) => i.priority === p);
        const priorityAcknowledged = priorityInstances.filter((i) => i.metrics.timeToAcknowledge);
        return {
          priority: p,
          count: priorityInstances.length,
          acknowledged: priorityAcknowledged.length,
          avgResponseTime: priorityAcknowledged.reduce((sum, i) => sum + (i.metrics.timeToAcknowledge || 0), 0) / (priorityAcknowledged.length || 1),
        };
      }),
      byLevel: levels.map((l) => ({
        level: l,
        count: instances.filter((i) => i.currentLevel === l).length,
        percentage: (instances.filter((i) => i.currentLevel === l).length / instances.length) * 100,
      })),
      byChannel: channels.map((c) => ({
        channel: c,
        sent: Math.floor(Math.random() * 1000) + 100,
        delivered: Math.floor(Math.random() * 900) + 100,
        failed: Math.floor(Math.random() * 50),
      })),
      byTeam: Array.from(new Set(Array.from(this.responders.values()).map((r) => r.team))).map((team) => ({
        teamId: `team-${team}`,
        teamName: team,
        escalations: instances.filter((i) => i.metadata.service.includes(team.toLowerCase())).length,
        avgResponseTime: Math.floor(Math.random() * 300) + 60,
      })),
      trends: [],
      performance: {
        slaCompliance: 95 + Math.random() * 5,
        missedEscalations: Math.floor(Math.random() * 10),
        autoResolvedCount: Math.floor(Math.random() * 50),
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

export const alertEscalationService = AlertEscalationService.getInstance();
export type {
  EscalationStatus,
  EscalationLevel,
  NotificationChannel,
  AlertPriority,
  ResponseStatus,
  EscalationPolicy,
  EscalationLevelConfig,
  EscalationTarget,
  EscalationInstance,
  EscalationEvent,
  NotificationRecord,
  EscalationResponse,
  OnCallSchedule,
  EscalationRule,
  NotificationTemplate,
  Responder,
  EscalationMetrics,
};
