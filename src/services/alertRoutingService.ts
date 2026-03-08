/**
 * Alert Routing Service
 * Comprehensive alert routing, escalation, and notification management
 */

// Alert Priority
type AlertPriority = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Alert Status
type AlertStatus = 'firing' | 'acknowledged' | 'resolved' | 'silenced' | 'suppressed';

// Notification Channel Type
type NotificationChannelType = 'email' | 'slack' | 'pagerduty' | 'opsgenie' | 'webhook' | 'sms' | 'voice' | 'teams' | 'discord' | 'telegram';

// Escalation Status
type EscalationStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'failed';

// Alert
interface Alert {
  id: string;
  name: string;
  description: string;
  source: AlertSource;
  priority: AlertPriority;
  status: AlertStatus;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  fingerprint: string;
  startsAt: Date;
  endsAt?: Date;
  updatedAt: Date;
  generatorURL?: string;
  silencedBy?: string[];
  inhibitedBy?: string[];
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  timeline: AlertTimelineEntry[];
  relatedAlerts: string[];
  routing: AlertRouting;
}

// Alert Source
interface AlertSource {
  type: 'prometheus' | 'grafana' | 'alertmanager' | 'custom' | 'cloudwatch' | 'datadog' | 'pagerduty';
  name: string;
  environment: string;
  region?: string;
  cluster?: string;
  namespace?: string;
  service?: string;
  instance?: string;
}

// Alert Timeline Entry
interface AlertTimelineEntry {
  id: string;
  timestamp: Date;
  type: 'created' | 'updated' | 'acknowledged' | 'resolved' | 'silenced' | 'escalated' | 'notified' | 'comment';
  user?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

// Alert Routing
interface AlertRouting {
  routeId: string;
  routeName: string;
  receivers: string[];
  notificationsSent: NotificationRecord[];
  escalationPath?: string;
  escalationLevel: number;
  matchedRules: string[];
}

// Notification Record
interface NotificationRecord {
  id: string;
  receiverId: string;
  channel: NotificationChannelType;
  sentAt: Date;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  error?: string;
  retryCount: number;
  response?: Record<string, unknown>;
}

// Route Configuration
interface RouteConfiguration {
  id: string;
  name: string;
  description: string;
  matchers: RouteMatcher[];
  receiver: string;
  groupBy: string[];
  groupWait: number;
  groupInterval: number;
  repeatInterval: number;
  muteTimeIntervals?: string[];
  activeTimeIntervals?: string[];
  continueRouting: boolean;
  routes?: RouteConfiguration[];
  status: 'active' | 'disabled' | 'testing';
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    version: number;
  };
}

// Route Matcher
interface RouteMatcher {
  label: string;
  operator: 'eq' | 'neq' | 'regex' | 'nregex';
  value: string;
}

// Receiver
interface Receiver {
  id: string;
  name: string;
  description: string;
  channels: NotificationChannel[];
  schedule?: OnCallSchedule;
  escalationPolicy?: string;
  defaultPriority: AlertPriority;
  status: 'active' | 'disabled';
  stats: ReceiverStats;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Notification Channel
interface NotificationChannel {
  id: string;
  type: NotificationChannelType;
  name: string;
  configuration: ChannelConfiguration;
  templates: NotificationTemplates;
  filters: ChannelFilter[];
  rateLimiting: RateLimitConfig;
  retryPolicy: RetryPolicy;
  status: 'active' | 'disabled' | 'error';
  testStatus?: {
    lastTest: Date;
    success: boolean;
    error?: string;
  };
}

// Channel Configuration
interface ChannelConfiguration {
  // Email
  emailAddresses?: string[];
  smtpServer?: string;
  smtpPort?: number;
  useTLS?: boolean;
  from?: string;
  replyTo?: string;
  // Slack
  webhookUrl?: string;
  channel?: string;
  username?: string;
  iconEmoji?: string;
  iconUrl?: string;
  // PagerDuty
  serviceKey?: string;
  routingKey?: string;
  severity?: string;
  client?: string;
  clientUrl?: string;
  // OpsGenie
  apiKey?: string;
  apiUrl?: string;
  teams?: string[];
  responders?: string[];
  // Webhook
  url?: string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  basicAuth?: { username: string; password: string };
  // SMS
  phoneNumbers?: string[];
  provider?: string;
  accountSid?: string;
  authToken?: string;
  // Voice
  voiceProvider?: string;
  callbackUrl?: string;
  // Teams
  teamsWebhookUrl?: string;
  // Discord
  discordWebhookUrl?: string;
  // Telegram
  botToken?: string;
  chatId?: string;
}

// Notification Templates
interface NotificationTemplates {
  title?: string;
  body?: string;
  summary?: string;
  details?: string;
  footer?: string;
  customFields?: Record<string, string>;
}

// Channel Filter
interface ChannelFilter {
  field: string;
  operator: 'eq' | 'neq' | 'contains' | 'regex' | 'in' | 'nin';
  value: string | string[];
  action: 'include' | 'exclude';
}

// Rate Limit Config
interface RateLimitConfig {
  enabled: boolean;
  maxPerMinute: number;
  maxPerHour: number;
  maxPerDay: number;
  burstSize: number;
  cooldownPeriod: number;
}

// Retry Policy
interface RetryPolicy {
  enabled: boolean;
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

// Receiver Stats
interface ReceiverStats {
  totalAlerts: number;
  totalNotifications: number;
  successfulNotifications: number;
  failedNotifications: number;
  avgResponseTime: number;
  lastAlertAt?: Date;
  lastNotificationAt?: Date;
}

// On-Call Schedule
interface OnCallSchedule {
  id: string;
  name: string;
  description: string;
  timezone: string;
  rotations: ScheduleRotation[];
  overrides: ScheduleOverride[];
  currentOnCall: OnCallPerson[];
  nextRotation: Date;
  status: 'active' | 'paused';
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Schedule Rotation
interface ScheduleRotation {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'custom';
  participants: RotationParticipant[];
  handoffTime: string;
  handoffDay?: number;
  restrictions?: TimeRestriction[];
  effectiveFrom: Date;
  effectiveUntil?: Date;
}

// Rotation Participant
interface RotationParticipant {
  id: string;
  type: 'user' | 'team' | 'schedule';
  name: string;
  email?: string;
  phone?: string;
  order: number;
}

// Schedule Override
interface ScheduleOverride {
  id: string;
  userId: string;
  userName: string;
  startTime: Date;
  endTime: Date;
  reason: string;
  createdBy: string;
  createdAt: Date;
}

// On-Call Person
interface OnCallPerson {
  id: string;
  name: string;
  email: string;
  phone?: string;
  level: number;
  startTime: Date;
  endTime: Date;
  rotationId: string;
}

// Time Restriction
interface TimeRestriction {
  type: 'time_of_day' | 'day_of_week';
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
}

// Escalation Policy
interface EscalationPolicy {
  id: string;
  name: string;
  description: string;
  levels: EscalationLevel[];
  repeatPolicy: RepeatPolicy;
  acknowledgementTimeout: number;
  status: 'active' | 'disabled';
  stats: EscalationStats;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Escalation Level
interface EscalationLevel {
  level: number;
  name: string;
  targets: EscalationTarget[];
  escalationDelay: number;
  notificationChannels: NotificationChannelType[];
}

// Escalation Target
interface EscalationTarget {
  type: 'user' | 'team' | 'schedule' | 'receiver';
  id: string;
  name: string;
}

// Repeat Policy
interface RepeatPolicy {
  enabled: boolean;
  repeatCount: number;
  repeatInterval: number;
  escalateOnRepeat: boolean;
}

// Escalation Stats
interface EscalationStats {
  totalEscalations: number;
  avgEscalationLevel: number;
  avgTimeToAcknowledge: number;
  avgTimeToResolve: number;
  escalatedToLevel: Record<number, number>;
}

// Escalation Instance
interface EscalationInstance {
  id: string;
  alertId: string;
  policyId: string;
  policyName: string;
  currentLevel: number;
  status: EscalationStatus;
  startedAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  history: EscalationHistoryEntry[];
}

// Escalation History Entry
interface EscalationHistoryEntry {
  timestamp: Date;
  level: number;
  action: 'started' | 'escalated' | 'notified' | 'acknowledged' | 'resolved' | 'cancelled' | 'timeout';
  targets: string[];
  channels: NotificationChannelType[];
  result: 'success' | 'failed' | 'partial';
  error?: string;
}

// Silence
interface Silence {
  id: string;
  matchers: SilenceMatcher[];
  startsAt: Date;
  endsAt: Date;
  createdBy: string;
  comment: string;
  status: 'pending' | 'active' | 'expired';
  affectedAlerts: number;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Silence Matcher
interface SilenceMatcher {
  name: string;
  value: string;
  isRegex: boolean;
  isEqual: boolean;
}

// Inhibition Rule
interface InhibitionRule {
  id: string;
  name: string;
  description: string;
  sourceMatchers: RouteMatcher[];
  targetMatchers: RouteMatcher[];
  equal: string[];
  status: 'active' | 'disabled';
  stats: {
    inhibitionsTotal: number;
    lastInhibition?: Date;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Alert Group
interface AlertGroup {
  id: string;
  labels: Record<string, string>;
  alerts: Alert[];
  receiver: string;
  status: 'active' | 'suppressed' | 'silenced';
  startsAt: Date;
  updatedAt: Date;
  lastNotification?: Date;
  notificationCount: number;
}

// Notification History
interface NotificationHistory {
  id: string;
  alertId: string;
  alertName: string;
  receiverId: string;
  receiverName: string;
  channel: NotificationChannelType;
  priority: AlertPriority;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'failed' | 'bounced' | 'clicked' | 'acknowledged';
  latency: number;
  error?: string;
  metadata: Record<string, unknown>;
}

// Routing Statistics
interface RoutingStatistics {
  overview: {
    totalAlerts: number;
    activeAlerts: number;
    acknowledgedAlerts: number;
    resolvedAlerts: number;
    silencedAlerts: number;
    suppressedAlerts: number;
    totalNotifications: number;
    successfulNotifications: number;
    failedNotifications: number;
  };
  byPriority: Record<AlertPriority, number>;
  byStatus: Record<AlertStatus, number>;
  byReceiver: Record<string, number>;
  byChannel: Record<NotificationChannelType, number>;
  escalations: {
    total: number;
    pending: number;
    active: number;
    completed: number;
    avgTimeToAcknowledge: number;
    avgTimeToResolve: number;
  };
  performance: {
    avgRoutingLatency: number;
    avgNotificationLatency: number;
    avgAcknowledgementTime: number;
    avgResolutionTime: number;
  };
  trends: {
    timestamp: Date;
    alertsCreated: number;
    alertsResolved: number;
    notificationsSent: number;
  }[];
}

class AlertRoutingService {
  private static instance: AlertRoutingService;
  private alerts: Map<string, Alert> = new Map();
  private routes: Map<string, RouteConfiguration> = new Map();
  private receivers: Map<string, Receiver> = new Map();
  private schedules: Map<string, OnCallSchedule> = new Map();
  private policies: Map<string, EscalationPolicy> = new Map();
  private escalations: Map<string, EscalationInstance> = new Map();
  private silences: Map<string, Silence> = new Map();
  private inhibitions: Map<string, InhibitionRule> = new Map();
  private alertGroups: Map<string, AlertGroup> = new Map();
  private notificationHistory: Map<string, NotificationHistory> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): AlertRoutingService {
    if (!AlertRoutingService.instance) {
      AlertRoutingService.instance = new AlertRoutingService();
    }
    return AlertRoutingService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Receivers
    const receiversData = [
      { name: 'Platform Team', channels: ['slack', 'pagerduty'] },
      { name: 'Infrastructure Team', channels: ['email', 'opsgenie'] },
      { name: 'Security Team', channels: ['slack', 'email', 'sms'] },
      { name: 'Database Team', channels: ['pagerduty', 'slack'] },
      { name: 'DevOps On-Call', channels: ['pagerduty', 'voice', 'sms'] },
    ];

    receiversData.forEach((r, idx) => {
      const receiver: Receiver = {
        id: `receiver-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name,
        description: `${r.name} alert receiver`,
        channels: r.channels.map((ch, chIdx) => ({
          id: `channel-${idx}-${chIdx}`,
          type: ch as NotificationChannelType,
          name: `${r.name} ${ch}`,
          configuration: this.getChannelConfig(ch as NotificationChannelType),
          templates: { title: '{{ .AlertName }}', body: '{{ .Description }}', summary: '{{ .Summary }}' },
          filters: [],
          rateLimiting: { enabled: true, maxPerMinute: 60, maxPerHour: 500, maxPerDay: 2000, burstSize: 10, cooldownPeriod: 60 },
          retryPolicy: { enabled: true, maxRetries: 3, initialDelay: 1000, maxDelay: 30000, backoffMultiplier: 2, retryableErrors: ['timeout', 'connection_error'] },
          status: 'active',
        })),
        defaultPriority: idx === 4 ? 'critical' : idx === 2 ? 'high' : 'medium',
        status: 'active',
        stats: {
          totalAlerts: Math.floor(Math.random() * 10000) + 1000,
          totalNotifications: Math.floor(Math.random() * 50000) + 5000,
          successfulNotifications: Math.floor(Math.random() * 49000) + 4900,
          failedNotifications: Math.floor(Math.random() * 100) + 10,
          avgResponseTime: Math.random() * 500 + 100,
          lastAlertAt: new Date(),
          lastNotificationAt: new Date(),
        },
        metadata: { createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date() },
      };
      this.receivers.set(receiver.id, receiver);
    });

    // Initialize Routes
    const routesData = [
      { name: 'Critical Infrastructure', matchers: [{ label: 'severity', operator: 'eq' as const, value: 'critical' }, { label: 'team', operator: 'eq' as const, value: 'infrastructure' }], receiver: 'receiver-0002' },
      { name: 'Security Alerts', matchers: [{ label: 'alertname', operator: 'regex' as const, value: 'Security.*' }], receiver: 'receiver-0003' },
      { name: 'Database Alerts', matchers: [{ label: 'service', operator: 'eq' as const, value: 'database' }], receiver: 'receiver-0004' },
      { name: 'Default Route', matchers: [], receiver: 'receiver-0001' },
    ];

    routesData.forEach((r, idx) => {
      const route: RouteConfiguration = {
        id: `route-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name,
        description: `Route for ${r.name}`,
        matchers: r.matchers,
        receiver: r.receiver,
        groupBy: ['alertname', 'service'],
        groupWait: 30,
        groupInterval: 300,
        repeatInterval: 3600,
        continueRouting: idx < 3,
        status: 'active',
        metadata: { createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date(), version: 1 },
      };
      this.routes.set(route.id, route);
    });

    // Initialize On-Call Schedules
    const scheduleData = [
      { name: 'Primary On-Call', participants: ['John Doe', 'Jane Smith', 'Bob Johnson'] },
      { name: 'Secondary On-Call', participants: ['Alice Brown', 'Charlie Wilson'] },
    ];

    scheduleData.forEach((s, idx) => {
      const schedule: OnCallSchedule = {
        id: `schedule-${(idx + 1).toString().padStart(4, '0')}`,
        name: s.name,
        description: `${s.name} rotation schedule`,
        timezone: 'America/New_York',
        rotations: [
          {
            id: `rotation-${idx}-1`,
            name: 'Weekly Rotation',
            type: 'weekly',
            participants: s.participants.map((p, pIdx) => ({ id: `participant-${idx}-${pIdx}`, type: 'user', name: p, email: `${p.toLowerCase().replace(' ', '.')}@example.com`, phone: `+1555000${pIdx}000`, order: pIdx })),
            handoffTime: '09:00',
            handoffDay: 1,
            effectiveFrom: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          },
        ],
        overrides: [],
        currentOnCall: [{ id: `oncall-${idx}`, name: s.participants[0], email: `${s.participants[0].toLowerCase().replace(' ', '.')}@example.com`, phone: '+15550000000', level: idx + 1, startTime: new Date(), endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), rotationId: `rotation-${idx}-1` }],
        nextRotation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'active',
        metadata: { createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date() },
      };
      this.schedules.set(schedule.id, schedule);
    });

    // Initialize Escalation Policies
    const policiesData = [
      { name: 'Critical Escalation', levels: 3, timeout: 5 },
      { name: 'Standard Escalation', levels: 2, timeout: 15 },
      { name: 'Low Priority Escalation', levels: 1, timeout: 30 },
    ];

    policiesData.forEach((p, idx) => {
      const policy: EscalationPolicy = {
        id: `policy-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: `${p.name} policy`,
        levels: Array.from({ length: p.levels }, (_, l) => ({
          level: l + 1,
          name: `Level ${l + 1}`,
          targets: [{ type: 'schedule' as const, id: l === 0 ? 'schedule-0001' : 'schedule-0002', name: l === 0 ? 'Primary On-Call' : 'Secondary On-Call' }],
          escalationDelay: p.timeout * 60 * (l + 1),
          notificationChannels: l === 0 ? ['slack', 'pagerduty'] : l === 1 ? ['sms', 'voice'] : ['email', 'slack'],
        })),
        repeatPolicy: { enabled: true, repeatCount: 3, repeatInterval: 3600, escalateOnRepeat: true },
        acknowledgementTimeout: p.timeout * 60,
        status: 'active',
        stats: {
          totalEscalations: Math.floor(Math.random() * 1000) + 100,
          avgEscalationLevel: 1.3 + idx * 0.2,
          avgTimeToAcknowledge: p.timeout * 30 + Math.random() * 60,
          avgTimeToResolve: p.timeout * 60 * 2 + Math.random() * 120,
          escalatedToLevel: { 1: Math.floor(Math.random() * 800), 2: Math.floor(Math.random() * 150), 3: Math.floor(Math.random() * 50) },
        },
        metadata: { createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date() },
      };
      this.policies.set(policy.id, policy);
    });

    // Initialize Alerts
    const alertsData = [
      { name: 'HighCPUUsage', priority: 'high' as AlertPriority, status: 'firing' as AlertStatus, service: 'api-gateway' },
      { name: 'DatabaseConnectionPool', priority: 'critical' as AlertPriority, status: 'acknowledged' as AlertStatus, service: 'user-service' },
      { name: 'HighMemoryUsage', priority: 'medium' as AlertPriority, status: 'firing' as AlertStatus, service: 'payment-service' },
      { name: 'DiskSpaceWarning', priority: 'low' as AlertPriority, status: 'resolved' as AlertStatus, service: 'notification-service' },
      { name: 'HighErrorRate', priority: 'critical' as AlertPriority, status: 'firing' as AlertStatus, service: 'auth-service' },
    ];

    alertsData.forEach((a, idx) => {
      const alert: Alert = {
        id: `alert-${(idx + 1).toString().padStart(6, '0')}`,
        name: a.name,
        description: `${a.name} alert for ${a.service}`,
        source: {
          type: 'prometheus',
          name: 'prometheus',
          environment: 'production',
          region: 'us-east-1',
          cluster: 'prod-cluster',
          service: a.service,
        },
        priority: a.priority,
        status: a.status,
        labels: { alertname: a.name, severity: a.priority, service: a.service, team: 'platform' },
        annotations: { summary: `${a.name} detected`, description: `${a.name} is occurring on ${a.service}`, runbook: `https://runbooks.example.com/${a.name.toLowerCase()}` },
        fingerprint: `fingerprint-${idx}-${Date.now()}`,
        startsAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        endsAt: a.status === 'resolved' ? new Date() : undefined,
        updatedAt: new Date(),
        generatorURL: `http://prometheus:9090/graph?g0.expr=${a.name}`,
        acknowledgedBy: a.status === 'acknowledged' ? 'admin' : undefined,
        acknowledgedAt: a.status === 'acknowledged' ? new Date(Date.now() - 30 * 60 * 1000) : undefined,
        resolvedBy: a.status === 'resolved' ? 'system' : undefined,
        resolvedAt: a.status === 'resolved' ? new Date() : undefined,
        timeline: [
          { id: `timeline-${idx}-1`, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'created', message: 'Alert created' },
          { id: `timeline-${idx}-2`, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), type: 'notified', message: 'Notification sent to Platform Team', metadata: { channel: 'slack' } },
        ],
        relatedAlerts: [],
        routing: {
          routeId: 'route-0001',
          routeName: 'Default Route',
          receivers: ['receiver-0001'],
          notificationsSent: [{ id: `notif-${idx}`, receiverId: 'receiver-0001', channel: 'slack', sentAt: new Date(), status: 'delivered', retryCount: 0 }],
          escalationLevel: 1,
          matchedRules: ['route-0001'],
        },
      };
      this.alerts.set(alert.id, alert);
    });

    // Initialize Silences
    const silencesData = [
      { matchers: [{ name: 'service', value: 'staging-.*', isRegex: true, isEqual: true }], comment: 'Silence staging alerts during deployment' },
      { matchers: [{ name: 'alertname', value: 'DiskSpaceWarning', isRegex: false, isEqual: true }], comment: 'Known issue, working on fix' },
    ];

    silencesData.forEach((s, idx) => {
      const silence: Silence = {
        id: `silence-${(idx + 1).toString().padStart(4, '0')}`,
        matchers: s.matchers,
        startsAt: new Date(Date.now() - 60 * 60 * 1000),
        endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        createdBy: 'admin',
        comment: s.comment,
        status: 'active',
        affectedAlerts: Math.floor(Math.random() * 10) + 1,
        metadata: { createdAt: new Date(Date.now() - 60 * 60 * 1000), updatedAt: new Date() },
      };
      this.silences.set(silence.id, silence);
    });

    // Initialize Inhibition Rules
    const inhibitionsData = [
      { name: 'Inhibit Child Alerts', sourceMatchers: [{ label: 'alertname', operator: 'eq' as const, value: 'ClusterDown' }], targetMatchers: [{ label: 'severity', operator: 'neq' as const, value: 'critical' }], equal: ['cluster'] },
      { name: 'Inhibit Non-Critical During Maintenance', sourceMatchers: [{ label: 'alertname', operator: 'eq' as const, value: 'MaintenanceMode' }], targetMatchers: [{ label: 'severity', operator: 'eq' as const, value: 'warning' }], equal: ['service'] },
    ];

    inhibitionsData.forEach((i, idx) => {
      const inhibition: InhibitionRule = {
        id: `inhibition-${(idx + 1).toString().padStart(4, '0')}`,
        name: i.name,
        description: `${i.name} inhibition rule`,
        sourceMatchers: i.sourceMatchers,
        targetMatchers: i.targetMatchers,
        equal: i.equal,
        status: 'active',
        stats: { inhibitionsTotal: Math.floor(Math.random() * 500) + 50, lastInhibition: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) },
        metadata: { createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date() },
      };
      this.inhibitions.set(inhibition.id, inhibition);
    });

    // Initialize Notification History
    for (let i = 0; i < 50; i++) {
      const history: NotificationHistory = {
        id: `history-${(i + 1).toString().padStart(6, '0')}`,
        alertId: `alert-${((i % 5) + 1).toString().padStart(6, '0')}`,
        alertName: alertsData[i % 5].name,
        receiverId: `receiver-${((i % 5) + 1).toString().padStart(4, '0')}`,
        receiverName: receiversData[i % 5].name,
        channel: ['slack', 'email', 'pagerduty', 'sms', 'webhook'][i % 5] as NotificationChannelType,
        priority: alertsData[i % 5].priority,
        timestamp: new Date(Date.now() - i * 30 * 60 * 1000),
        status: i % 10 === 0 ? 'failed' : 'delivered',
        latency: Math.random() * 500 + 100,
        error: i % 10 === 0 ? 'Connection timeout' : undefined,
        metadata: {},
      };
      this.notificationHistory.set(history.id, history);
    }
  }

  private getChannelConfig(type: NotificationChannelType): ChannelConfiguration {
    switch (type) {
      case 'slack': return { webhookUrl: 'https://hooks.slack.com/services/xxx', channel: '#alerts', username: 'AlertBot', iconEmoji: ':warning:' };
      case 'email': return { emailAddresses: ['team@example.com'], smtpServer: 'smtp.example.com', smtpPort: 587, useTLS: true, from: 'alerts@example.com' };
      case 'pagerduty': return { serviceKey: 'pagerduty-service-key', routingKey: 'routing-key', severity: 'critical', client: 'RescuePing', clientUrl: 'https://rescueping.example.com' };
      case 'opsgenie': return { apiKey: 'opsgenie-api-key', apiUrl: 'https://api.opsgenie.com', teams: ['platform'], responders: [] };
      case 'sms': return { phoneNumbers: ['+15551234567'], provider: 'twilio', accountSid: 'twilio-sid', authToken: 'twilio-token' };
      case 'voice': return { phoneNumbers: ['+15551234567'], voiceProvider: 'twilio', callbackUrl: 'https://rescueping.example.com/voice/callback' };
      case 'webhook': return { url: 'https://webhook.example.com/alerts', method: 'POST', headers: { 'Content-Type': 'application/json' } };
      case 'teams': return { teamsWebhookUrl: 'https://outlook.office.com/webhook/xxx' };
      case 'discord': return { discordWebhookUrl: 'https://discord.com/api/webhooks/xxx' };
      case 'telegram': return { botToken: 'telegram-bot-token', chatId: '-1001234567890' };
      default: return {};
    }
  }

  // Alert Operations
  public getAlerts(status?: AlertStatus, priority?: AlertPriority): Alert[] {
    let alerts = Array.from(this.alerts.values());
    if (status) alerts = alerts.filter((a) => a.status === status);
    if (priority) alerts = alerts.filter((a) => a.priority === priority);
    return alerts.sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
  }

  public getAlertById(id: string): Alert | undefined {
    return this.alerts.get(id);
  }

  public getFiringAlerts(): Alert[] {
    return this.getAlerts('firing');
  }

  // Route Operations
  public getRoutes(): RouteConfiguration[] {
    return Array.from(this.routes.values());
  }

  public getRouteById(id: string): RouteConfiguration | undefined {
    return this.routes.get(id);
  }

  // Receiver Operations
  public getReceivers(): Receiver[] {
    return Array.from(this.receivers.values());
  }

  public getReceiverById(id: string): Receiver | undefined {
    return this.receivers.get(id);
  }

  // Schedule Operations
  public getSchedules(): OnCallSchedule[] {
    return Array.from(this.schedules.values());
  }

  public getScheduleById(id: string): OnCallSchedule | undefined {
    return this.schedules.get(id);
  }

  public getCurrentOnCall(): OnCallPerson[] {
    const oncall: OnCallPerson[] = [];
    this.schedules.forEach((s) => oncall.push(...s.currentOnCall));
    return oncall;
  }

  // Policy Operations
  public getPolicies(): EscalationPolicy[] {
    return Array.from(this.policies.values());
  }

  public getPolicyById(id: string): EscalationPolicy | undefined {
    return this.policies.get(id);
  }

  // Silence Operations
  public getSilences(status?: 'pending' | 'active' | 'expired'): Silence[] {
    let silences = Array.from(this.silences.values());
    if (status) silences = silences.filter((s) => s.status === status);
    return silences;
  }

  public getSilenceById(id: string): Silence | undefined {
    return this.silences.get(id);
  }

  // Inhibition Operations
  public getInhibitions(): InhibitionRule[] {
    return Array.from(this.inhibitions.values());
  }

  // Notification History
  public getNotificationHistory(limit: number = 100): NotificationHistory[] {
    return Array.from(this.notificationHistory.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Statistics
  public getStatistics(): RoutingStatistics {
    const alerts = Array.from(this.alerts.values());
    const history = Array.from(this.notificationHistory.values());
    const policies = Array.from(this.policies.values());

    const byPriority: Record<AlertPriority, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    const byStatus: Record<AlertStatus, number> = { firing: 0, acknowledged: 0, resolved: 0, silenced: 0, suppressed: 0 };
    const byReceiver: Record<string, number> = {};
    const byChannel: Record<NotificationChannelType, number> = { email: 0, slack: 0, pagerduty: 0, opsgenie: 0, webhook: 0, sms: 0, voice: 0, teams: 0, discord: 0, telegram: 0 };

    alerts.forEach((a) => {
      byPriority[a.priority]++;
      byStatus[a.status]++;
      a.routing.receivers.forEach((r) => { byReceiver[r] = (byReceiver[r] || 0) + 1; });
    });

    history.forEach((h) => {
      byChannel[h.channel]++;
    });

    return {
      overview: {
        totalAlerts: alerts.length,
        activeAlerts: alerts.filter((a) => a.status === 'firing').length,
        acknowledgedAlerts: alerts.filter((a) => a.status === 'acknowledged').length,
        resolvedAlerts: alerts.filter((a) => a.status === 'resolved').length,
        silencedAlerts: alerts.filter((a) => a.status === 'silenced').length,
        suppressedAlerts: alerts.filter((a) => a.status === 'suppressed').length,
        totalNotifications: history.length,
        successfulNotifications: history.filter((h) => h.status === 'delivered').length,
        failedNotifications: history.filter((h) => h.status === 'failed').length,
      },
      byPriority,
      byStatus,
      byReceiver,
      byChannel,
      escalations: {
        total: policies.reduce((sum, p) => sum + p.stats.totalEscalations, 0),
        pending: Math.floor(Math.random() * 10),
        active: Math.floor(Math.random() * 20),
        completed: policies.reduce((sum, p) => sum + p.stats.totalEscalations, 0) - 30,
        avgTimeToAcknowledge: policies.reduce((sum, p) => sum + p.stats.avgTimeToAcknowledge, 0) / policies.length,
        avgTimeToResolve: policies.reduce((sum, p) => sum + p.stats.avgTimeToResolve, 0) / policies.length,
      },
      performance: {
        avgRoutingLatency: Math.random() * 50 + 10,
        avgNotificationLatency: history.reduce((sum, h) => sum + h.latency, 0) / history.length,
        avgAcknowledgementTime: Math.random() * 300 + 60,
        avgResolutionTime: Math.random() * 3600 + 600,
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

export const alertRoutingService = AlertRoutingService.getInstance();
export type {
  AlertPriority,
  AlertStatus,
  NotificationChannelType,
  EscalationStatus,
  Alert,
  AlertSource,
  AlertTimelineEntry,
  AlertRouting,
  NotificationRecord,
  RouteConfiguration,
  RouteMatcher,
  Receiver,
  NotificationChannel,
  ChannelConfiguration,
  NotificationTemplates,
  ChannelFilter,
  RateLimitConfig,
  RetryPolicy,
  ReceiverStats,
  OnCallSchedule,
  ScheduleRotation,
  RotationParticipant,
  ScheduleOverride,
  OnCallPerson,
  TimeRestriction,
  EscalationPolicy,
  EscalationLevel,
  EscalationTarget,
  RepeatPolicy,
  EscalationStats,
  EscalationInstance,
  EscalationHistoryEntry,
  Silence,
  SilenceMatcher,
  InhibitionRule,
  AlertGroup,
  NotificationHistory,
  RoutingStatistics,
};
