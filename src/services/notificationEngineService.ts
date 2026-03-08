/**
 * Notification Engine Service
 * Advanced notification delivery with templates, channels, and scheduling
 */

// Notification channel type
type NotificationChannel = 'push' | 'sms' | 'email' | 'whatsapp' | 'in_app' | 'voice' | 'telegram' | 'slack';

// Notification status
type NotificationStatus = 'pending' | 'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed' | 'bounced' | 'expired';

// Notification priority
type NotificationPriority = 'critical' | 'high' | 'normal' | 'low';

// Template type
type TemplateType = 'alert' | 'reminder' | 'confirmation' | 'verification' | 'report' | 'marketing' | 'system' | 'emergency';

// Schedule type
type ScheduleType = 'immediate' | 'scheduled' | 'recurring' | 'triggered';

// Recipient type
type RecipientType = 'user' | 'group' | 'role' | 'segment' | 'broadcast';

// Notification
interface Notification {
  id: string;
  type: TemplateType;
  templateId?: string;
  title: string;
  body: string;
  shortMessage?: string;
  priority: NotificationPriority;
  channel: NotificationChannel;
  channelConfig?: ChannelConfig;
  recipientType: RecipientType;
  recipientId: string;
  recipientInfo: RecipientInfo;
  status: NotificationStatus;
  data?: Record<string, unknown>;
  actions?: NotificationAction[];
  media?: NotificationMedia;
  schedule?: NotificationSchedule;
  expiresAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  correlationId?: string;
  campaignId?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Channel config
interface ChannelConfig {
  push?: {
    sound?: string;
    badge?: number;
    ttl?: number;
    collapseKey?: string;
    icon?: string;
    image?: string;
    clickAction?: string;
  };
  sms?: {
    senderId?: string;
    dltTemplateId?: string;
    unicode?: boolean;
    flash?: boolean;
  };
  email?: {
    from?: string;
    replyTo?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: EmailAttachment[];
    trackOpens?: boolean;
    trackClicks?: boolean;
  };
  whatsapp?: {
    templateName?: string;
    language?: string;
    components?: WhatsAppComponent[];
  };
  voice?: {
    voiceId?: string;
    language?: string;
    speed?: number;
    repeat?: number;
    waitForInput?: boolean;
  };
  telegram?: {
    chatId?: string;
    parseMode?: 'HTML' | 'Markdown';
    disableNotification?: boolean;
  };
  slack?: {
    channel?: string;
    username?: string;
    iconEmoji?: string;
    blocks?: unknown[];
  };
}

// Email attachment
interface EmailAttachment {
  filename: string;
  content?: string;
  path?: string;
  contentType?: string;
}

// WhatsApp component
interface WhatsAppComponent {
  type: 'header' | 'body' | 'button';
  parameters: { type: string; text?: string; image?: { link: string } }[];
}

// Recipient info
interface RecipientInfo {
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  deviceTokens?: string[];
  telegramId?: string;
  slackUserId?: string;
  language?: string;
  timezone?: string;
}

// Notification action
interface NotificationAction {
  id: string;
  type: 'button' | 'link' | 'reply' | 'call';
  label: string;
  action: string;
  icon?: string;
  destructive?: boolean;
}

// Notification media
interface NotificationMedia {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  mimeType?: string;
  size?: number;
}

// Notification schedule
interface NotificationSchedule {
  type: ScheduleType;
  sendAt?: Date;
  timezone?: string;
  recurringPattern?: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    time?: string;
    endDate?: Date;
    maxOccurrences?: number;
  };
  trigger?: {
    event: string;
    conditions?: Record<string, unknown>;
    delay?: number;
  };
}

// Notification template
interface NotificationTemplate {
  id: string;
  name: string;
  type: TemplateType;
  description?: string;
  category: string;
  channels: NotificationChannel[];
  subject?: string;
  title: string;
  body: string;
  shortMessage?: string;
  htmlBody?: string;
  variables: TemplateVariable[];
  defaultData?: Record<string, unknown>;
  defaultPriority: NotificationPriority;
  defaultActions?: NotificationAction[];
  defaultMedia?: NotificationMedia;
  isActive: boolean;
  version: number;
  dltTemplateId?: string;
  whatsappTemplateName?: string;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Template variable
interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  required: boolean;
  defaultValue?: unknown;
  description?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: unknown[];
  };
}

// Notification campaign
interface NotificationCampaign {
  id: string;
  name: string;
  description?: string;
  type: 'one_time' | 'recurring' | 'triggered' | 'a_b_test';
  templateId: string;
  channels: NotificationChannel[];
  targetAudience: AudienceTarget;
  schedule?: NotificationSchedule;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  abTestConfig?: ABTestConfig;
  throttling?: ThrottlingConfig;
  analytics: CampaignAnalytics;
  startDate?: Date;
  endDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Audience target
interface AudienceTarget {
  type: 'all' | 'segment' | 'filter' | 'list';
  segmentId?: string;
  filters?: AudienceFilter[];
  userIds?: string[];
  excludeUserIds?: string[];
  estimatedSize?: number;
}

// Audience filter
interface AudienceFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in' | 'greater_than' | 'less_than' | 'between';
  value: unknown;
}

// AB test config
interface ABTestConfig {
  enabled: boolean;
  variants: {
    id: string;
    name: string;
    templateId: string;
    weight: number;
  }[];
  testSize: number;
  winnerCriteria: 'open_rate' | 'click_rate' | 'conversion_rate';
  testDuration: number;
  autoSelectWinner: boolean;
}

// Throttling config
interface ThrottlingConfig {
  maxPerMinute?: number;
  maxPerHour?: number;
  maxPerDay?: number;
  respectQuietHours?: boolean;
  quietHours?: { start: string; end: string; timezone: string };
  channelLimits?: Partial<Record<NotificationChannel, { maxPerDay: number }>>;
}

// Campaign analytics
interface CampaignAnalytics {
  totalRecipients: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  failed: number;
  bounced: number;
  unsubscribed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

// User preference
interface UserNotificationPreference {
  userId: string;
  globalEnabled: boolean;
  channels: {
    [K in NotificationChannel]?: {
      enabled: boolean;
      quietHours?: { start: string; end: string };
    };
  };
  categories: {
    [category: string]: {
      enabled: boolean;
      channels: NotificationChannel[];
    };
  };
  frequency?: {
    maxPerDay?: number;
    maxPerHour?: number;
    digest?: {
      enabled: boolean;
      frequency: 'daily' | 'weekly';
      time: string;
    };
  };
  unsubscribedFrom: string[];
  timezone: string;
  language: string;
  updatedAt: Date;
}

// Delivery log
interface DeliveryLog {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  provider: string;
  providerMessageId?: string;
  recipientAddress: string;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bouncedAt?: Date;
  bounceType?: 'hard' | 'soft';
  bounceReason?: string;
  errorCode?: string;
  errorMessage?: string;
  attempts: number;
  cost?: number;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

// Provider config
interface ProviderConfig {
  id: string;
  name: string;
  channel: NotificationChannel;
  provider: string;
  isDefault: boolean;
  isActive: boolean;
  priority: number;
  config: Record<string, unknown>;
  rateLimit?: { requests: number; period: number };
  healthStatus: 'healthy' | 'degraded' | 'down';
  lastHealthCheck: Date;
  failureCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Notification queue item
interface QueueItem {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  priority: number;
  attempts: number;
  maxAttempts: number;
  scheduledAt: Date;
  lockedAt?: Date;
  lockedBy?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: Date;
}

// Analytics data
interface NotificationAnalytics {
  period: { start: Date; end: Date };
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalFailed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  byChannel: {
    channel: NotificationChannel;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  }[];
  byType: {
    type: TemplateType;
    sent: number;
    delivered: number;
  }[];
  byPriority: {
    priority: NotificationPriority;
    sent: number;
    avgDeliveryTime: number;
  }[];
  byHour: { hour: number; count: number }[];
  byDay: { date: string; sent: number; delivered: number }[];
  topTemplates: { templateId: string; name: string; count: number; openRate: number }[];
  errors: { code: string; message: string; count: number }[];
}

class NotificationEngineService {
  private static instance: NotificationEngineService;
  private notifications: Map<string, Notification> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private campaigns: Map<string, NotificationCampaign> = new Map();
  private userPreferences: Map<string, UserNotificationPreference> = new Map();
  private deliveryLogs: DeliveryLog[] = [];
  private providers: Map<string, ProviderConfig> = new Map();
  private queue: QueueItem[] = [];
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): NotificationEngineService {
    if (!NotificationEngineService.instance) {
      NotificationEngineService.instance = new NotificationEngineService();
    }
    return NotificationEngineService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Create sample templates
    const sampleTemplates: Omit<NotificationTemplate, 'createdAt' | 'updatedAt'>[] = [
      {
        id: 'tpl-emergency-alert',
        name: 'Emergency Alert',
        type: 'emergency',
        description: 'Critical emergency notification for disasters',
        category: 'emergency',
        channels: ['push', 'sms', 'email', 'whatsapp', 'voice'],
        subject: '🚨 Emergency Alert: {{alertType}}',
        title: '🚨 {{alertType}} Alert',
        body: 'Emergency alert for {{location}}. {{message}}. Severity: {{severity}}. Please take immediate action. Emergency contacts: {{emergencyContacts}}',
        shortMessage: '🚨 {{alertType}}: {{message}} - {{location}}',
        htmlBody: '<div style="background:#ff0000;color:white;padding:20px"><h1>🚨 {{alertType}} Alert</h1><p>{{message}}</p><p>Location: {{location}}</p><p>Severity: {{severity}}</p></div>',
        variables: [
          { name: 'alertType', type: 'string', required: true, description: 'Type of emergency' },
          { name: 'message', type: 'string', required: true, description: 'Alert message' },
          { name: 'location', type: 'string', required: true, description: 'Affected location' },
          { name: 'severity', type: 'string', required: true, description: 'Severity level' },
          { name: 'emergencyContacts', type: 'string', required: false, description: 'Emergency contact numbers' },
        ],
        defaultPriority: 'critical',
        defaultActions: [
          { id: 'view', type: 'button', label: 'View Details', action: 'open_alert' },
          { id: 'safe', type: 'button', label: 'Mark Safe', action: 'mark_safe' },
        ],
        isActive: true,
        version: 1,
        tags: ['emergency', 'critical'],
        createdBy: 'system',
      },
      {
        id: 'tpl-safety-check',
        name: 'Safety Check Request',
        type: 'alert',
        description: 'Request for safety status confirmation',
        category: 'safety',
        channels: ['push', 'sms', 'whatsapp'],
        title: 'Safety Check: {{eventName}}',
        body: 'A {{eventType}} has been reported in {{location}}. Please confirm your safety status.',
        shortMessage: 'Safety check: {{eventName}}. Reply SAFE if you are okay.',
        variables: [
          { name: 'eventName', type: 'string', required: true },
          { name: 'eventType', type: 'string', required: true },
          { name: 'location', type: 'string', required: true },
        ],
        defaultPriority: 'high',
        defaultActions: [
          { id: 'safe', type: 'reply', label: "I'm Safe", action: 'mark_safe' },
          { id: 'help', type: 'reply', label: 'Need Help', action: 'request_help' },
        ],
        isActive: true,
        version: 1,
        tags: ['safety', 'check'],
        createdBy: 'system',
      },
      {
        id: 'tpl-weather-alert',
        name: 'Weather Alert',
        type: 'alert',
        description: 'Weather warning notification',
        category: 'weather',
        channels: ['push', 'sms', 'email'],
        subject: '⛈️ Weather Alert: {{weatherType}}',
        title: '⛈️ {{weatherType}} Alert',
        body: 'Weather warning for {{location}}: {{message}}. Expected: {{expectedTime}}. Precautions: {{precautions}}',
        shortMessage: '⛈️ {{weatherType}} alert for {{location}}: {{message}}',
        variables: [
          { name: 'weatherType', type: 'string', required: true },
          { name: 'location', type: 'string', required: true },
          { name: 'message', type: 'string', required: true },
          { name: 'expectedTime', type: 'string', required: false },
          { name: 'precautions', type: 'string', required: false },
        ],
        defaultPriority: 'high',
        isActive: true,
        version: 1,
        tags: ['weather', 'warning'],
        createdBy: 'system',
      },
      {
        id: 'tpl-donation-receipt',
        name: 'Donation Receipt',
        type: 'confirmation',
        description: 'Donation confirmation with receipt',
        category: 'donation',
        channels: ['email', 'sms'],
        subject: 'Thank you for your donation - Receipt #{{receiptNumber}}',
        title: 'Donation Confirmed',
        body: 'Thank you {{donorName}} for your generous donation of ₹{{amount}}. Your receipt number is {{receiptNumber}}. Your contribution will help {{cause}}.',
        shortMessage: 'Thank you for donating ₹{{amount}}. Receipt: {{receiptNumber}}',
        htmlBody: '<div style="font-family:Arial"><h1>Thank You!</h1><p>Dear {{donorName}},</p><p>Your donation of <strong>₹{{amount}}</strong> has been received.</p><p>Receipt: {{receiptNumber}}</p><p>Your contribution will help {{cause}}.</p></div>',
        variables: [
          { name: 'donorName', type: 'string', required: true },
          { name: 'amount', type: 'number', required: true },
          { name: 'receiptNumber', type: 'string', required: true },
          { name: 'cause', type: 'string', required: false },
        ],
        defaultPriority: 'normal',
        isActive: true,
        version: 1,
        tags: ['donation', 'receipt'],
        createdBy: 'system',
      },
      {
        id: 'tpl-volunteer-assignment',
        name: 'Volunteer Assignment',
        type: 'alert',
        description: 'Volunteer task assignment notification',
        category: 'volunteer',
        channels: ['push', 'email', 'sms'],
        subject: 'New Assignment: {{taskName}}',
        title: 'New Assignment',
        body: 'You have been assigned to: {{taskName}}. Location: {{location}}. Time: {{startTime}}. Please confirm your availability.',
        shortMessage: 'New assignment: {{taskName}} at {{location}}',
        variables: [
          { name: 'taskName', type: 'string', required: true },
          { name: 'location', type: 'string', required: true },
          { name: 'startTime', type: 'date', required: true },
          { name: 'description', type: 'string', required: false },
        ],
        defaultPriority: 'high',
        defaultActions: [
          { id: 'accept', type: 'button', label: 'Accept', action: 'accept_assignment' },
          { id: 'decline', type: 'button', label: 'Decline', action: 'decline_assignment' },
        ],
        isActive: true,
        version: 1,
        tags: ['volunteer', 'assignment'],
        createdBy: 'system',
      },
      {
        id: 'tpl-otp',
        name: 'OTP Verification',
        type: 'verification',
        description: 'One-time password for verification',
        category: 'security',
        channels: ['sms', 'email', 'whatsapp'],
        subject: 'Your verification code: {{otp}}',
        title: 'Verification Code',
        body: 'Your verification code is {{otp}}. Valid for {{validityMinutes}} minutes. Do not share this code.',
        shortMessage: 'Your Rescue Ping OTP is {{otp}}. Valid for {{validityMinutes}} min.',
        variables: [
          { name: 'otp', type: 'string', required: true },
          { name: 'validityMinutes', type: 'number', required: true, defaultValue: 10 },
        ],
        defaultPriority: 'high',
        isActive: true,
        version: 1,
        dltTemplateId: 'DLT123456',
        tags: ['otp', 'security'],
        createdBy: 'system',
      },
    ];

    sampleTemplates.forEach((template) => {
      this.templates.set(template.id, {
        ...template,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      });
    });

    // Create sample providers
    const sampleProviders: Omit<ProviderConfig, 'createdAt' | 'updatedAt'>[] = [
      { id: 'prov-firebase', name: 'Firebase Cloud Messaging', channel: 'push', provider: 'firebase', isDefault: true, isActive: true, priority: 1, config: { projectId: 'rescue-ping-prod' }, healthStatus: 'healthy', lastHealthCheck: new Date(), failureCount: 0 },
      { id: 'prov-twilio-sms', name: 'Twilio SMS', channel: 'sms', provider: 'twilio', isDefault: true, isActive: true, priority: 1, config: { accountSid: 'ACxxx' }, healthStatus: 'healthy', lastHealthCheck: new Date(), failureCount: 0 },
      { id: 'prov-msg91', name: 'MSG91', channel: 'sms', provider: 'msg91', isDefault: false, isActive: true, priority: 2, config: { authKey: 'xxx' }, healthStatus: 'healthy', lastHealthCheck: new Date(), failureCount: 0 },
      { id: 'prov-sendgrid', name: 'SendGrid', channel: 'email', provider: 'sendgrid', isDefault: true, isActive: true, priority: 1, config: { apiKey: 'SG.xxx' }, healthStatus: 'healthy', lastHealthCheck: new Date(), failureCount: 0 },
      { id: 'prov-whatsapp', name: 'WhatsApp Business', channel: 'whatsapp', provider: 'whatsapp_business', isDefault: true, isActive: true, priority: 1, config: { phoneNumberId: 'xxx' }, healthStatus: 'healthy', lastHealthCheck: new Date(), failureCount: 0 },
      { id: 'prov-voice', name: 'Twilio Voice', channel: 'voice', provider: 'twilio', isDefault: true, isActive: true, priority: 1, config: { accountSid: 'ACxxx' }, healthStatus: 'healthy', lastHealthCheck: new Date(), failureCount: 0 },
    ];

    sampleProviders.forEach((provider) => {
      this.providers.set(provider.id, {
        ...provider,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      });
    });

    // Create sample notifications
    const channels: NotificationChannel[] = ['push', 'sms', 'email', 'whatsapp'];
    const statuses: NotificationStatus[] = ['sent', 'delivered', 'read', 'failed'];
    const priorities: NotificationPriority[] = ['critical', 'high', 'normal', 'low'];

    for (let i = 0; i < 1000; i++) {
      const channel = channels[i % channels.length];
      const status = statuses[i % statuses.length];
      const template = sampleTemplates[i % sampleTemplates.length];

      const notification: Notification = {
        id: `notif-${i.toString().padStart(8, '0')}`,
        type: template.type,
        templateId: template.id,
        title: `Sample notification ${i}`,
        body: `This is sample notification body ${i}`,
        priority: priorities[i % priorities.length],
        channel,
        recipientType: 'user',
        recipientId: `user-${(i % 100) + 1}`,
        recipientInfo: {
          userId: `user-${(i % 100) + 1}`,
          name: `User ${(i % 100) + 1}`,
          email: `user${(i % 100) + 1}@example.com`,
          phone: `+9198765${(i % 100).toString().padStart(5, '0')}`,
        },
        status,
        retryCount: status === 'failed' ? 3 : 0,
        maxRetries: 3,
        metadata: {},
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        sentAt: status !== 'pending' ? new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000) : undefined,
        deliveredAt: ['delivered', 'read'].includes(status) ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000) : undefined,
        readAt: status === 'read' ? new Date(Date.now() - Math.random() * 4 * 24 * 60 * 60 * 1000) : undefined,
      };

      this.notifications.set(notification.id, notification);

      // Create delivery log
      const log: DeliveryLog = {
        id: `dl-${i.toString().padStart(8, '0')}`,
        notificationId: notification.id,
        channel,
        status,
        provider: channel === 'push' ? 'firebase' : channel === 'sms' ? 'twilio' : channel === 'email' ? 'sendgrid' : 'whatsapp_business',
        recipientAddress: channel === 'email' ? notification.recipientInfo.email! : notification.recipientInfo.phone!,
        sentAt: notification.sentAt,
        deliveredAt: notification.deliveredAt,
        openedAt: notification.readAt,
        attempts: notification.retryCount + 1,
        metadata: {},
        createdAt: notification.createdAt,
      };

      this.deliveryLogs.push(log);
    }

    // Create sample user preferences
    for (let i = 1; i <= 50; i++) {
      const preference: UserNotificationPreference = {
        userId: `user-${i}`,
        globalEnabled: true,
        channels: {
          push: { enabled: true },
          sms: { enabled: true, quietHours: { start: '22:00', end: '07:00' } },
          email: { enabled: true },
          whatsapp: { enabled: i % 2 === 0 },
          in_app: { enabled: true },
          voice: { enabled: false },
        },
        categories: {
          emergency: { enabled: true, channels: ['push', 'sms', 'voice'] },
          weather: { enabled: true, channels: ['push', 'email'] },
          donation: { enabled: true, channels: ['email'] },
          volunteer: { enabled: i % 3 === 0, channels: ['push', 'email'] },
        },
        frequency: {
          maxPerDay: 50,
          digest: { enabled: i % 5 === 0, frequency: 'daily', time: '09:00' },
        },
        unsubscribedFrom: [],
        timezone: 'Asia/Kolkata',
        language: 'en',
        updatedAt: new Date(),
      };

      this.userPreferences.set(preference.userId, preference);
    }

    // Create sample campaign
    const campaign: NotificationCampaign = {
      id: 'camp-flood-awareness',
      name: 'Monsoon Flood Awareness',
      description: 'Awareness campaign for flood preparedness during monsoon',
      type: 'one_time',
      templateId: 'tpl-weather-alert',
      channels: ['push', 'sms', 'email'],
      targetAudience: {
        type: 'filter',
        filters: [
          { field: 'state', operator: 'in', value: ['Maharashtra', 'Gujarat', 'Karnataka'] },
        ],
        estimatedSize: 50000,
      },
      status: 'completed',
      analytics: {
        totalRecipients: 48500,
        sent: 48500,
        delivered: 46000,
        opened: 32000,
        clicked: 15000,
        converted: 5000,
        failed: 2500,
        bounced: 300,
        unsubscribed: 50,
        deliveryRate: 94.8,
        openRate: 69.6,
        clickRate: 32.6,
        conversionRate: 10.9,
      },
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
      createdBy: 'admin-1',
      createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    this.campaigns.set(campaign.id, campaign);
  }

  /**
   * Send notification
   */
  public async send(data: {
    templateId?: string;
    type?: TemplateType;
    title?: string;
    body?: string;
    channel: NotificationChannel;
    recipientType: RecipientType;
    recipientId: string;
    recipientInfo: RecipientInfo;
    data?: Record<string, unknown>;
    priority?: NotificationPriority;
    actions?: NotificationAction[];
    media?: NotificationMedia;
    schedule?: NotificationSchedule;
    channelConfig?: ChannelConfig;
    campaignId?: string;
    correlationId?: string;
  }): Promise<Notification> {
    // Check user preferences
    const preference = this.userPreferences.get(data.recipientInfo.userId || '');
    if (preference && !this.checkUserPreferences(preference, data.channel, data.type)) {
      throw new Error('User has disabled this notification type or channel');
    }

    // Get template if provided
    let title = data.title || '';
    let body = data.body || '';
    let type = data.type || 'system';
    let actions = data.actions;
    let media = data.media;
    let priority = data.priority || 'normal';

    if (data.templateId) {
      const template = this.templates.get(data.templateId);
      if (!template) throw new Error('Template not found');
      if (!template.isActive) throw new Error('Template is not active');

      title = this.renderTemplate(template.title, data.data || {});
      body = this.renderTemplate(template.body, data.data || {});
      type = template.type;
      actions = actions || template.defaultActions;
      media = media || template.defaultMedia;
      priority = priority || template.defaultPriority;
    }

    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      type,
      templateId: data.templateId,
      title,
      body,
      priority,
      channel: data.channel,
      channelConfig: data.channelConfig,
      recipientType: data.recipientType,
      recipientId: data.recipientId,
      recipientInfo: data.recipientInfo,
      status: data.schedule?.type === 'scheduled' ? 'pending' : 'queued',
      data: data.data,
      actions,
      media,
      schedule: data.schedule,
      retryCount: 0,
      maxRetries: 3,
      correlationId: data.correlationId || `corr-${Date.now()}`,
      campaignId: data.campaignId,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.notifications.set(notification.id, notification);

    // Queue for delivery
    if (!data.schedule || data.schedule.type === 'immediate') {
      await this.queueForDelivery(notification);
    }

    this.emit('notification_created', notification);
    return notification;
  }

  /**
   * Send bulk notifications
   */
  public async sendBulk(data: {
    templateId: string;
    recipients: { recipientId: string; recipientInfo: RecipientInfo; data?: Record<string, unknown> }[];
    channel: NotificationChannel;
    priority?: NotificationPriority;
    campaignId?: string;
  }): Promise<{ total: number; queued: number; skipped: number }> {
    const results = { total: data.recipients.length, queued: 0, skipped: 0 };

    for (const recipient of data.recipients) {
      try {
        await this.send({
          templateId: data.templateId,
          channel: data.channel,
          recipientType: 'user',
          recipientId: recipient.recipientId,
          recipientInfo: recipient.recipientInfo,
          data: recipient.data,
          priority: data.priority,
          campaignId: data.campaignId,
        });
        results.queued++;
      } catch {
        results.skipped++;
      }
    }

    return results;
  }

  /**
   * Queue notification for delivery
   */
  private async queueForDelivery(notification: Notification): Promise<void> {
    const queueItem: QueueItem = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      notificationId: notification.id,
      channel: notification.channel,
      priority: this.getPriorityNumber(notification.priority),
      attempts: 0,
      maxAttempts: notification.maxRetries + 1,
      scheduledAt: new Date(),
      status: 'pending',
      createdAt: new Date(),
    };

    this.queue.push(queueItem);

    // Process immediately (in production, this would be handled by a worker)
    await this.processQueueItem(queueItem);
  }

  /**
   * Process queue item
   */
  private async processQueueItem(item: QueueItem): Promise<void> {
    const notification = this.notifications.get(item.notificationId);
    if (!notification) return;

    item.status = 'processing';
    item.lockedAt = new Date();
    notification.status = 'sending';

    try {
      // Simulate sending (in production, call actual provider)
      await new Promise((resolve) => setTimeout(resolve, 100));

      const success = Math.random() > 0.05; // 95% success rate

      if (success) {
        notification.status = 'sent';
        notification.sentAt = new Date();
        item.status = 'completed';

        // Simulate delivery (in production, this comes from webhook)
        setTimeout(() => {
          notification.status = 'delivered';
          notification.deliveredAt = new Date();
          this.createDeliveryLog(notification, 'delivered');
        }, 1000);

        this.createDeliveryLog(notification, 'sent');
      } else {
        throw new Error('Provider returned error');
      }
    } catch (error) {
      item.attempts++;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';

      if (item.attempts >= item.maxAttempts) {
        notification.status = 'failed';
        notification.failedAt = new Date();
        notification.failureReason = errorMsg;
        item.status = 'failed';
        item.error = errorMsg;

        this.createDeliveryLog(notification, 'failed', errorMsg);
      } else {
        notification.retryCount = item.attempts;
        item.status = 'pending';
        item.scheduledAt = new Date(Date.now() + Math.pow(2, item.attempts) * 1000); // Exponential backoff
      }
    }

    notification.updatedAt = new Date();
    this.emit('notification_status_changed', notification);
  }

  /**
   * Create delivery log
   */
  private createDeliveryLog(notification: Notification, status: NotificationStatus, error?: string): void {
    const log: DeliveryLog = {
      id: `dl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      notificationId: notification.id,
      channel: notification.channel,
      status,
      provider: this.getProviderForChannel(notification.channel),
      recipientAddress: notification.channel === 'email' ? notification.recipientInfo.email! : notification.recipientInfo.phone!,
      sentAt: notification.sentAt,
      deliveredAt: notification.deliveredAt,
      attempts: notification.retryCount + 1,
      errorMessage: error,
      metadata: {},
      createdAt: new Date(),
    };

    this.deliveryLogs.push(log);
  }

  /**
   * Get provider for channel
   */
  private getProviderForChannel(channel: NotificationChannel): string {
    const provider = Array.from(this.providers.values()).find(
      (p) => p.channel === channel && p.isDefault && p.isActive
    );
    return provider?.provider || 'unknown';
  }

  /**
   * Check user preferences
   */
  private checkUserPreferences(pref: UserNotificationPreference, channel: NotificationChannel, type?: TemplateType): boolean {
    if (!pref.globalEnabled) return false;

    const channelPref = pref.channels[channel];
    if (!channelPref?.enabled) return false;

    // Check quiet hours
    if (channelPref.quietHours) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const { start, end } = channelPref.quietHours;

      if (start <= end) {
        if (currentTime >= start && currentTime <= end) return false;
      } else {
        if (currentTime >= start || currentTime <= end) return false;
      }
    }

    return true;
  }

  /**
   * Render template
   */
  private renderTemplate(template: string, data: Record<string, unknown>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return data[key] !== undefined ? String(data[key]) : `{{${key}}}`;
    });
  }

  /**
   * Get priority number
   */
  private getPriorityNumber(priority: NotificationPriority): number {
    const priorities: Record<NotificationPriority, number> = { critical: 1, high: 2, normal: 3, low: 4 };
    return priorities[priority];
  }

  /**
   * Get notification
   */
  public getNotification(id: string): Notification | undefined {
    return this.notifications.get(id);
  }

  /**
   * Get notifications for user
   */
  public getNotificationsForUser(userId: string, options?: {
    channel?: NotificationChannel;
    status?: NotificationStatus;
    unreadOnly?: boolean;
  }, page: number = 1, pageSize: number = 20): { notifications: Notification[]; total: number } {
    let notifications = Array.from(this.notifications.values())
      .filter((n) => n.recipientInfo.userId === userId);

    if (options?.channel) {
      notifications = notifications.filter((n) => n.channel === options.channel);
    }

    if (options?.status) {
      notifications = notifications.filter((n) => n.status === options.status);
    }

    if (options?.unreadOnly) {
      notifications = notifications.filter((n) => !n.readAt);
    }

    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = notifications.length;
    const startIndex = (page - 1) * pageSize;

    return {
      notifications: notifications.slice(startIndex, startIndex + pageSize),
      total,
    };
  }

  /**
   * Mark as read
   */
  public markAsRead(notificationId: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (!notification) return false;

    notification.status = 'read';
    notification.readAt = new Date();
    notification.updatedAt = new Date();

    this.emit('notification_read', notification);
    return true;
  }

  /**
   * Mark all as read
   */
  public markAllAsRead(userId: string): number {
    let count = 0;
    this.notifications.forEach((notification) => {
      if (notification.recipientInfo.userId === userId && !notification.readAt) {
        notification.status = 'read';
        notification.readAt = new Date();
        notification.updatedAt = new Date();
        count++;
      }
    });
    return count;
  }

  /**
   * Get templates
   */
  public getTemplates(filters?: { type?: TemplateType; channel?: NotificationChannel; category?: string }): NotificationTemplate[] {
    let templates = Array.from(this.templates.values());

    if (filters?.type) {
      templates = templates.filter((t) => t.type === filters.type);
    }

    if (filters?.channel) {
      templates = templates.filter((t) => t.channels.includes(filters.channel!));
    }

    if (filters?.category) {
      templates = templates.filter((t) => t.category === filters.category);
    }

    return templates;
  }

  /**
   * Create template
   */
  public createTemplate(data: Omit<NotificationTemplate, 'id' | 'version' | 'createdAt' | 'updatedAt'>): NotificationTemplate {
    const template: NotificationTemplate = {
      ...data,
      id: `tpl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.templates.set(template.id, template);
    this.emit('template_created', template);

    return template;
  }

  /**
   * Update user preferences
   */
  public updateUserPreferences(userId: string, updates: Partial<Omit<UserNotificationPreference, 'userId' | 'updatedAt'>>): UserNotificationPreference {
    const existing = this.userPreferences.get(userId) || {
      userId,
      globalEnabled: true,
      channels: {},
      categories: {},
      unsubscribedFrom: [],
      timezone: 'Asia/Kolkata',
      language: 'en',
      updatedAt: new Date(),
    };

    const updated: UserNotificationPreference = {
      ...existing,
      ...updates,
      userId,
      updatedAt: new Date(),
    };

    this.userPreferences.set(userId, updated);
    return updated;
  }

  /**
   * Get user preferences
   */
  public getUserPreferences(userId: string): UserNotificationPreference | undefined {
    return this.userPreferences.get(userId);
  }

  /**
   * Get analytics
   */
  public getAnalytics(period: { start: Date; end: Date }): NotificationAnalytics {
    const periodLogs = this.deliveryLogs.filter(
      (log) => log.createdAt >= period.start && log.createdAt <= period.end
    );

    const byChannel = new Map<NotificationChannel, { sent: number; delivered: number; opened: number; clicked: number; failed: number }>();
    const byHour = new Map<number, number>();
    const byDay = new Map<string, { sent: number; delivered: number }>();
    const templateCounts = new Map<string, { count: number; opened: number }>();

    let totalSent = 0, totalDelivered = 0, totalOpened = 0, totalClicked = 0, totalFailed = 0;

    periodLogs.forEach((log) => {
      // Count by status
      if (log.status === 'sent' || log.status === 'delivered' || log.status === 'read') totalSent++;
      if (log.status === 'delivered' || log.status === 'read') totalDelivered++;
      if (log.openedAt) totalOpened++;
      if (log.clickedAt) totalClicked++;
      if (log.status === 'failed') totalFailed++;

      // By channel
      const channelStats = byChannel.get(log.channel) || { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0 };
      channelStats.sent++;
      if (log.status === 'delivered' || log.status === 'read') channelStats.delivered++;
      if (log.openedAt) channelStats.opened++;
      if (log.clickedAt) channelStats.clicked++;
      if (log.status === 'failed') channelStats.failed++;
      byChannel.set(log.channel, channelStats);

      // By hour
      const hour = log.createdAt.getHours();
      byHour.set(hour, (byHour.get(hour) || 0) + 1);

      // By day
      const dayKey = log.createdAt.toISOString().split('T')[0];
      const dayStats = byDay.get(dayKey) || { sent: 0, delivered: 0 };
      dayStats.sent++;
      if (log.status === 'delivered' || log.status === 'read') dayStats.delivered++;
      byDay.set(dayKey, dayStats);

      // By template
      const notification = this.notifications.get(log.notificationId);
      if (notification?.templateId) {
        const tplStats = templateCounts.get(notification.templateId) || { count: 0, opened: 0 };
        tplStats.count++;
        if (log.openedAt) tplStats.opened++;
        templateCounts.set(notification.templateId, tplStats);
      }
    });

    return {
      period,
      totalSent,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalFailed,
      deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
      openRate: totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0,
      clickRate: totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0,
      byChannel: Array.from(byChannel.entries()).map(([channel, stats]) => ({ channel, ...stats })),
      byType: [],
      byPriority: [],
      byHour: Array.from(byHour.entries()).map(([hour, count]) => ({ hour, count })),
      byDay: Array.from(byDay.entries()).map(([date, stats]) => ({ date, ...stats })),
      topTemplates: Array.from(templateCounts.entries())
        .map(([templateId, stats]) => ({
          templateId,
          name: this.templates.get(templateId)?.name || 'Unknown',
          count: stats.count,
          openRate: stats.count > 0 ? (stats.opened / stats.count) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      errors: [],
    };
  }

  /**
   * Get unread count
   */
  public getUnreadCount(userId: string): number {
    return Array.from(this.notifications.values())
      .filter((n) => n.recipientInfo.userId === userId && !n.readAt)
      .length;
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

export const notificationEngineService = NotificationEngineService.getInstance();
export type {
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
  TemplateType,
  ScheduleType,
  RecipientType,
  Notification,
  ChannelConfig,
  EmailAttachment,
  WhatsAppComponent,
  RecipientInfo,
  NotificationAction,
  NotificationMedia,
  NotificationSchedule,
  NotificationTemplate,
  TemplateVariable,
  NotificationCampaign,
  AudienceTarget,
  AudienceFilter,
  ABTestConfig,
  ThrottlingConfig,
  CampaignAnalytics,
  UserNotificationPreference,
  DeliveryLog,
  ProviderConfig,
  QueueItem,
  NotificationAnalytics,
};
