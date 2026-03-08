// @ts-nocheck
/**
 * Emergency Broadcast Service - Issue #121 Implementation
 * 
 * Provides comprehensive public alert system with CAP (Common Alerting Protocol) support,
 * emergency broadcast distribution, multi-channel delivery, and compliance tracking.
 */

// Broadcast status types
type BroadcastStatus = 'draft' | 'scheduled' | 'pending_approval' | 'approved' | 'broadcasting' | 'completed' | 'cancelled' | 'failed';
type AlertSeverity = 'extreme' | 'severe' | 'moderate' | 'minor' | 'unknown';
type AlertUrgency = 'immediate' | 'expected' | 'future' | 'past' | 'unknown';
type AlertCertainty = 'observed' | 'likely' | 'possible' | 'unlikely' | 'unknown';
type ChannelType = 'eas' | 'wireless' | 'broadcast_tv' | 'broadcast_radio' | 'cable' | 'satellite' | 'internet' | 'sirens' | 'social_media' | 'sms' | 'email' | 'push_notification';
type MessageCategory = 'geo' | 'met' | 'safety' | 'security' | 'rescue' | 'fire' | 'health' | 'env' | 'transport' | 'infra' | 'cbrne' | 'other';

// CAP Alert Interface (Common Alerting Protocol)
interface CAPAlert {
  identifier: string;
  sender: string;
  sent: Date;
  status: 'actual' | 'exercise' | 'system' | 'test' | 'draft';
  msgType: 'alert' | 'update' | 'cancel' | 'ack' | 'error';
  source: string;
  scope: 'public' | 'restricted' | 'private';
  restriction?: string;
  addresses?: string[];
  code: string[];
  note?: string;
  references?: string[];
  incidents?: string[];
  info: CAPInfo[];
}

interface CAPInfo {
  language: string;
  category: MessageCategory[];
  event: string;
  responseType: ('shelter' | 'evacuate' | 'prepare' | 'execute' | 'avoid' | 'monitor' | 'assess' | 'allclear' | 'none')[];
  urgency: AlertUrgency;
  severity: AlertSeverity;
  certainty: AlertCertainty;
  audience?: string;
  eventCode?: { valueName: string; value: string }[];
  effective?: Date;
  onset?: Date;
  expires?: Date;
  senderName?: string;
  headline: string;
  description: string;
  instruction?: string;
  web?: string;
  contact?: string;
  parameter?: { valueName: string; value: string }[];
  resource?: CAPResource[];
  area: CAPArea[];
}

interface CAPResource {
  resourceDesc: string;
  mimeType: string;
  size?: number;
  uri?: string;
  derefUri?: string;
  digest?: string;
}

interface CAPArea {
  areaDesc: string;
  polygon?: string[];
  circle?: string[];
  geocode?: { valueName: string; value: string }[];
  altitude?: number;
  ceiling?: number;
}

// Broadcast interfaces
interface EmergencyBroadcast {
  id: string;
  capAlert: CAPAlert;
  status: BroadcastStatus;
  priority: number;
  channels: BroadcastChannel[];
  targetAudience: TargetAudience;
  schedule: BroadcastSchedule;
  approval: ApprovalWorkflow;
  delivery: DeliveryStatus;
  analytics: BroadcastAnalytics;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

interface BroadcastChannel {
  id: string;
  type: ChannelType;
  name: string;
  enabled: boolean;
  config: ChannelConfig;
  status: 'ready' | 'broadcasting' | 'completed' | 'failed';
  deliveryStats: {
    sent: number;
    delivered: number;
    failed: number;
    acknowledged: number;
  };
}

interface ChannelConfig {
  endpoint?: string;
  credentials?: string;
  format: 'cap' | 'eas' | 'cmas' | 'etws' | 'custom';
  maxRetries: number;
  timeout: number;
  priority: number;
  customParams?: Record<string, any>;
}

interface TargetAudience {
  geographic: {
    regions: string[];
    counties: string[];
    cities: string[];
    zipCodes: string[];
    coordinates?: { lat: number; lon: number; radius: number }[];
    polygons?: { lat: number; lon: number }[][];
  };
  demographic?: {
    languages: string[];
    ageGroups?: string[];
    specialNeeds?: string[];
  };
  estimated: {
    population: number;
    households: number;
    devices: number;
  };
}

interface BroadcastSchedule {
  type: 'immediate' | 'scheduled' | 'recurring';
  scheduledTime?: Date;
  recurringPattern?: {
    frequency: 'hourly' | 'daily' | 'weekly';
    interval: number;
    endTime?: Date;
  };
  expirationTime: Date;
  repeatInterval?: number;
  maxRepeats?: number;
  currentRepeat: number;
}

interface ApprovalWorkflow {
  required: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvers: {
    userId: string;
    name: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp?: Date;
    comments?: string;
  }[];
  autoApproveThreshold?: AlertSeverity;
  escalationTime?: number;
}

interface DeliveryStatus {
  startTime?: Date;
  endTime?: Date;
  totalRecipients: number;
  delivered: number;
  failed: number;
  pending: number;
  acknowledged: number;
  errors: DeliveryError[];
}

interface DeliveryError {
  timestamp: Date;
  channel: ChannelType;
  errorCode: string;
  message: string;
  affectedCount: number;
  retryable: boolean;
}

interface BroadcastAnalytics {
  reach: {
    total: number;
    byChannel: Record<ChannelType, number>;
    byRegion: Record<string, number>;
  };
  engagement: {
    views: number;
    clicks: number;
    shares: number;
    responses: number;
  };
  timing: {
    creationToApproval: number;
    approvalToDelivery: number;
    averageDeliveryTime: number;
  };
  effectiveness: {
    responseRate: number;
    complianceRate: number;
    feedbackScore: number;
  };
}

// Template interfaces
interface BroadcastTemplate {
  id: string;
  name: string;
  category: MessageCategory;
  severity: AlertSeverity;
  channels: ChannelType[];
  capTemplate: Partial<CAPAlert>;
  variables: TemplateVariable[];
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'location' | 'list';
  required: boolean;
  defaultValue?: any;
  validation?: string;
}

// EAS (Emergency Alert System) interfaces
interface EASMessage {
  id: string;
  originator: 'PEP' | 'CIV' | 'WXR' | 'EAS';
  eventCode: string;
  location: string[];
  validTime: number;
  callSign: string;
  timestamp: Date;
  audioUrl?: string;
  textMessage: string;
}

// Subscription interfaces
interface BroadcastSubscription {
  id: string;
  callback: (broadcast: EmergencyBroadcast) => void;
  filters?: {
    severity?: AlertSeverity[];
    categories?: MessageCategory[];
    regions?: string[];
  };
}

// Sample data
const sampleBroadcasts: EmergencyBroadcast[] = [
  {
    id: 'broadcast-001',
    capAlert: {
      identifier: 'CAP-2026-001-FLOOD',
      sender: 'rescue-ping@emergency.gov',
      sent: new Date('2026-01-09T10:00:00Z'),
      status: 'actual',
      msgType: 'alert',
      source: 'National Weather Service',
      scope: 'public',
      code: ['IPAWSv1.0'],
      info: [{
        language: 'en-US',
        category: ['met'],
        event: 'Flash Flood Warning',
        responseType: ['evacuate', 'shelter'],
        urgency: 'immediate',
        severity: 'extreme',
        certainty: 'observed',
        headline: 'Flash Flood Warning for Downtown Area',
        description: 'The National Weather Service has issued a Flash Flood Warning for the downtown metropolitan area. Heavy rainfall has caused rapid water rise in local waterways.',
        instruction: 'Move to higher ground immediately. Do not attempt to cross flooded roadways. Turn around, don\'t drown.',
        effective: new Date('2026-01-09T10:00:00Z'),
        expires: new Date('2026-01-09T16:00:00Z'),
        area: [{
          areaDesc: 'Downtown Metropolitan Area',
          geocode: [{ valueName: 'FIPS6', value: '006001' }]
        }]
      }]
    },
    status: 'broadcasting',
    priority: 1,
    channels: [
      {
        id: 'ch-001',
        type: 'wireless',
        name: 'Wireless Emergency Alerts',
        enabled: true,
        config: { format: 'cmas', maxRetries: 3, timeout: 30000, priority: 1 },
        status: 'broadcasting',
        deliveryStats: { sent: 500000, delivered: 485000, failed: 15000, acknowledged: 350000 }
      },
      {
        id: 'ch-002',
        type: 'broadcast_tv',
        name: 'Television Broadcast',
        enabled: true,
        config: { format: 'eas', maxRetries: 2, timeout: 60000, priority: 2 },
        status: 'completed',
        deliveryStats: { sent: 50, delivered: 50, failed: 0, acknowledged: 50 }
      }
    ],
    targetAudience: {
      geographic: {
        regions: ['West Coast'],
        counties: ['Sample County'],
        cities: ['Metro City'],
        zipCodes: ['90001', '90002', '90003']
      },
      demographic: { languages: ['en', 'es'] },
      estimated: { population: 2500000, households: 850000, devices: 1800000 }
    },
    schedule: {
      type: 'immediate',
      expirationTime: new Date('2026-01-09T16:00:00Z'),
      maxRepeats: 3,
      currentRepeat: 1
    },
    approval: {
      required: true,
      status: 'approved',
      approvers: [{
        userId: 'admin-001',
        name: 'Emergency Director',
        role: 'Emergency Management Director',
        status: 'approved',
        timestamp: new Date('2026-01-09T09:55:00Z')
      }]
    },
    delivery: {
      startTime: new Date('2026-01-09T10:00:00Z'),
      totalRecipients: 1800000,
      delivered: 1720000,
      failed: 30000,
      pending: 50000,
      acknowledged: 1200000,
      errors: []
    },
    analytics: {
      reach: {
        total: 1720000,
        byChannel: { wireless: 1500000, broadcast_tv: 220000, eas: 0, broadcast_radio: 0, cable: 0, satellite: 0, internet: 0, sirens: 0, social_media: 0, sms: 0, email: 0, push_notification: 0 },
        byRegion: { 'Metro City': 1200000, 'Suburbs': 520000 }
      },
      engagement: { views: 1720000, clicks: 45000, shares: 12000, responses: 8500 },
      timing: { creationToApproval: 300, approvalToDelivery: 60, averageDeliveryTime: 45 },
      effectiveness: { responseRate: 0.7, complianceRate: 0.85, feedbackScore: 4.2 }
    },
    createdBy: 'system-auto',
    createdAt: new Date('2026-01-09T09:50:00Z'),
    updatedAt: new Date('2026-01-09T10:30:00Z'),
    metadata: { source: 'NWS', alertId: 'NWS-FF-2026-001' }
  }
];

const sampleTemplates: BroadcastTemplate[] = [
  {
    id: 'template-001',
    name: 'Flash Flood Warning',
    category: 'met',
    severity: 'extreme',
    channels: ['wireless', 'broadcast_tv', 'broadcast_radio', 'sirens'],
    capTemplate: {
      status: 'actual',
      msgType: 'alert',
      scope: 'public',
      info: [{
        language: 'en-US',
        category: ['met'],
        event: 'Flash Flood Warning',
        responseType: ['evacuate', 'shelter'],
        urgency: 'immediate',
        severity: 'extreme',
        certainty: 'observed',
        headline: '{{headline}}',
        description: '{{description}}',
        instruction: '{{instruction}}',
        area: []
      }]
    },
    variables: [
      { name: 'headline', type: 'text', required: true },
      { name: 'description', type: 'text', required: true },
      { name: 'instruction', type: 'text', required: true },
      { name: 'affectedArea', type: 'location', required: true }
    ],
    isActive: true,
    usageCount: 45,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2026-01-01')
  },
  {
    id: 'template-002',
    name: 'Earthquake Alert',
    category: 'geo',
    severity: 'severe',
    channels: ['wireless', 'push_notification', 'sirens'],
    capTemplate: {
      status: 'actual',
      msgType: 'alert',
      scope: 'public',
      info: [{
        language: 'en-US',
        category: ['geo'],
        event: 'Earthquake Warning',
        responseType: ['shelter', 'prepare'],
        urgency: 'immediate',
        severity: 'severe',
        certainty: 'observed',
        headline: '{{headline}}',
        description: '{{description}}',
        instruction: 'Drop, Cover, and Hold On. Move away from windows and heavy objects.',
        area: []
      }]
    },
    variables: [
      { name: 'headline', type: 'text', required: true },
      { name: 'description', type: 'text', required: true },
      { name: 'magnitude', type: 'number', required: true },
      { name: 'epicenter', type: 'location', required: true }
    ],
    isActive: true,
    usageCount: 12,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-12-15')
  }
];

const easEventCodes: Record<string, string> = {
  'EAN': 'Emergency Action Notification',
  'EAT': 'Emergency Action Termination',
  'NIC': 'National Information Center',
  'NPT': 'National Periodic Test',
  'RMT': 'Required Monthly Test',
  'RWT': 'Required Weekly Test',
  'ADR': 'Administrative Message',
  'AVW': 'Avalanche Warning',
  'AVA': 'Avalanche Watch',
  'BZW': 'Blizzard Warning',
  'CAE': 'Child Abduction Emergency',
  'CDW': 'Civil Danger Warning',
  'CEM': 'Civil Emergency Message',
  'CFW': 'Coastal Flood Warning',
  'CFA': 'Coastal Flood Watch',
  'DSW': 'Dust Storm Warning',
  'EQW': 'Earthquake Warning',
  'EVI': 'Evacuation Immediate',
  'EWW': 'Extreme Wind Warning',
  'FRW': 'Fire Warning',
  'FFW': 'Flash Flood Warning',
  'FFA': 'Flash Flood Watch',
  'FLW': 'Flood Warning',
  'FLA': 'Flood Watch',
  'HMW': 'Hazardous Materials Warning',
  'HUW': 'Hurricane Warning',
  'HUA': 'Hurricane Watch',
  'HWW': 'High Wind Warning',
  'HWA': 'High Wind Watch',
  'LAE': 'Local Area Emergency',
  'LEW': 'Law Enforcement Warning',
  'NUW': 'Nuclear Power Plant Warning',
  'RHW': 'Radiological Hazard Warning',
  'SVR': 'Severe Thunderstorm Warning',
  'SVA': 'Severe Thunderstorm Watch',
  'SPW': 'Shelter in Place Warning',
  'SMW': 'Special Marine Warning',
  'SPS': 'Special Weather Statement',
  'SSW': 'Storm Surge Warning',
  'SSA': 'Storm Surge Watch',
  'TOE': 'Tsunami Warning',
  'TOA': 'Tsunami Watch',
  'TOR': 'Tornado Warning',
  'TOA': 'Tornado Watch',
  'TRW': 'Tropical Storm Warning',
  'TRA': 'Tropical Storm Watch',
  'TSW': 'Tsunami Warning',
  'TSA': 'Tsunami Watch',
  'VOW': 'Volcano Warning',
  'WSW': 'Winter Storm Warning',
  'WSA': 'Winter Storm Watch'
};

class EmergencyBroadcastService {
  private static instance: EmergencyBroadcastService;
  private broadcasts: Map<string, EmergencyBroadcast> = new Map();
  private templates: Map<string, BroadcastTemplate> = new Map();
  private subscriptions: Map<string, BroadcastSubscription> = new Map();
  private channelHandlers: Map<ChannelType, (broadcast: EmergencyBroadcast) => Promise<void>> = new Map();
  private broadcastQueue: EmergencyBroadcast[] = [];
  private isProcessing: boolean = false;

  private constructor() {
    this.initializeSampleData();
    this.registerDefaultChannelHandlers();
  }

  public static getInstance(): EmergencyBroadcastService {
    if (!EmergencyBroadcastService.instance) {
      EmergencyBroadcastService.instance = new EmergencyBroadcastService();
    }
    return EmergencyBroadcastService.instance;
  }

  private initializeSampleData(): void {
    sampleBroadcasts.forEach(b => this.broadcasts.set(b.id, b));
    sampleTemplates.forEach(t => this.templates.set(t.id, t));
  }

  private registerDefaultChannelHandlers(): void {
    // Register simulated channel handlers
    this.channelHandlers.set('wireless', this.handleWirelessBroadcast.bind(this));
    this.channelHandlers.set('broadcast_tv', this.handleTVBroadcast.bind(this));
    this.channelHandlers.set('broadcast_radio', this.handleRadioBroadcast.bind(this));
    this.channelHandlers.set('sirens', this.handleSirenActivation.bind(this));
    this.channelHandlers.set('sms', this.handleSMSBroadcast.bind(this));
    this.channelHandlers.set('email', this.handleEmailBroadcast.bind(this));
    this.channelHandlers.set('push_notification', this.handlePushNotification.bind(this));
    this.channelHandlers.set('social_media', this.handleSocialMedia.bind(this));
  }

  // ==================== CAP Alert Management ====================

  async createCAPAlert(alertData: Partial<CAPAlert>): Promise<CAPAlert> {
    const alert: CAPAlert = {
      identifier: alertData.identifier || `CAP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: alertData.sender || 'rescue-ping@emergency.gov',
      sent: new Date(),
      status: alertData.status || 'draft',
      msgType: alertData.msgType || 'alert',
      source: alertData.source || 'Rescue Ping System',
      scope: alertData.scope || 'public',
      code: alertData.code || ['IPAWSv1.0'],
      info: alertData.info || []
    };

    return alert;
  }

  validateCAPAlert(alert: CAPAlert): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!alert.identifier) errors.push('Missing required field: identifier');
    if (!alert.sender) errors.push('Missing required field: sender');
    if (!alert.sent) errors.push('Missing required field: sent');
    if (!alert.status) errors.push('Missing required field: status');
    if (!alert.msgType) errors.push('Missing required field: msgType');
    if (!alert.scope) errors.push('Missing required field: scope');

    if (alert.info.length === 0) {
      errors.push('At least one info block is required');
    } else {
      alert.info.forEach((info, index) => {
        if (!info.event) errors.push(`Info[${index}]: Missing required field: event`);
        if (!info.urgency) errors.push(`Info[${index}]: Missing required field: urgency`);
        if (!info.severity) errors.push(`Info[${index}]: Missing required field: severity`);
        if (!info.certainty) errors.push(`Info[${index}]: Missing required field: certainty`);
        if (info.category.length === 0) errors.push(`Info[${index}]: At least one category is required`);
        if (info.area.length === 0) errors.push(`Info[${index}]: At least one area is required`);
      });
    }

    return { valid: errors.length === 0, errors };
  }

  convertToCAP(broadcast: EmergencyBroadcast): string {
    const cap = broadcast.capAlert;
    return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${cap.identifier}</identifier>
  <sender>${cap.sender}</sender>
  <sent>${cap.sent.toISOString()}</sent>
  <status>${cap.status}</status>
  <msgType>${cap.msgType}</msgType>
  <source>${cap.source}</source>
  <scope>${cap.scope}</scope>
  ${cap.code.map(c => `<code>${c}</code>`).join('\n  ')}
  ${cap.info.map(info => this.convertInfoToCAP(info)).join('\n')}
</alert>`;
  }

  private convertInfoToCAP(info: CAPInfo): string {
    return `  <info>
    <language>${info.language}</language>
    ${info.category.map(c => `<category>${c}</category>`).join('\n    ')}
    <event>${info.event}</event>
    ${info.responseType.map(r => `<responseType>${r}</responseType>`).join('\n    ')}
    <urgency>${info.urgency}</urgency>
    <severity>${info.severity}</severity>
    <certainty>${info.certainty}</certainty>
    <headline>${info.headline}</headline>
    <description>${info.description}</description>
    ${info.instruction ? `<instruction>${info.instruction}</instruction>` : ''}
    ${info.effective ? `<effective>${info.effective.toISOString()}</effective>` : ''}
    ${info.expires ? `<expires>${info.expires.toISOString()}</expires>` : ''}
    ${info.area.map(area => this.convertAreaToCAP(area)).join('\n')}
  </info>`;
  }

  private convertAreaToCAP(area: CAPArea): string {
    return `    <area>
      <areaDesc>${area.areaDesc}</areaDesc>
      ${area.polygon?.map(p => `<polygon>${p}</polygon>`).join('\n      ') || ''}
      ${area.circle?.map(c => `<circle>${c}</circle>`).join('\n      ') || ''}
      ${area.geocode?.map(g => `<geocode><valueName>${g.valueName}</valueName><value>${g.value}</value></geocode>`).join('\n      ') || ''}
    </area>`;
  }

  // ==================== Broadcast Management ====================

  async createBroadcast(params: {
    capAlert: CAPAlert;
    channels: ChannelType[];
    targetAudience: TargetAudience;
    schedule: Partial<BroadcastSchedule>;
    requireApproval?: boolean;
    createdBy: string;
  }): Promise<EmergencyBroadcast> {
    const validation = this.validateCAPAlert(params.capAlert);
    if (!validation.valid) {
      throw new Error(`Invalid CAP Alert: ${validation.errors.join(', ')}`);
    }

    const broadcast: EmergencyBroadcast = {
      id: `broadcast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      capAlert: params.capAlert,
      status: params.requireApproval ? 'pending_approval' : 'draft',
      priority: this.calculatePriority(params.capAlert),
      channels: params.channels.map(type => this.createChannelConfig(type)),
      targetAudience: params.targetAudience,
      schedule: {
        type: params.schedule.type || 'immediate',
        scheduledTime: params.schedule.scheduledTime,
        expirationTime: params.schedule.expirationTime || new Date(Date.now() + 6 * 60 * 60 * 1000),
        maxRepeats: params.schedule.maxRepeats || 1,
        currentRepeat: 0
      },
      approval: {
        required: params.requireApproval || false,
        status: params.requireApproval ? 'pending' : 'approved',
        approvers: []
      },
      delivery: {
        totalRecipients: params.targetAudience.estimated.devices,
        delivered: 0,
        failed: 0,
        pending: params.targetAudience.estimated.devices,
        acknowledged: 0,
        errors: []
      },
      analytics: {
        reach: { total: 0, byChannel: {} as Record<ChannelType, number>, byRegion: {} },
        engagement: { views: 0, clicks: 0, shares: 0, responses: 0 },
        timing: { creationToApproval: 0, approvalToDelivery: 0, averageDeliveryTime: 0 },
        effectiveness: { responseRate: 0, complianceRate: 0, feedbackScore: 0 }
      },
      createdBy: params.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {}
    };

    this.broadcasts.set(broadcast.id, broadcast);
    this.notifySubscribers(broadcast);

    return broadcast;
  }

  private calculatePriority(alert: CAPAlert): number {
    const severityPriority: Record<AlertSeverity, number> = {
      extreme: 1,
      severe: 2,
      moderate: 3,
      minor: 4,
      unknown: 5
    };

    const urgencyPriority: Record<AlertUrgency, number> = {
      immediate: 1,
      expected: 2,
      future: 3,
      past: 4,
      unknown: 5
    };

    const info = alert.info[0];
    if (!info) return 5;

    return Math.min(severityPriority[info.severity], urgencyPriority[info.urgency]);
  }

  private createChannelConfig(type: ChannelType): BroadcastChannel {
    const configs: Record<ChannelType, Partial<ChannelConfig>> = {
      wireless: { format: 'cmas', maxRetries: 3, timeout: 30000, priority: 1 },
      broadcast_tv: { format: 'eas', maxRetries: 2, timeout: 60000, priority: 2 },
      broadcast_radio: { format: 'eas', maxRetries: 2, timeout: 60000, priority: 2 },
      eas: { format: 'eas', maxRetries: 3, timeout: 30000, priority: 1 },
      cable: { format: 'eas', maxRetries: 2, timeout: 60000, priority: 3 },
      satellite: { format: 'eas', maxRetries: 2, timeout: 60000, priority: 3 },
      internet: { format: 'cap', maxRetries: 3, timeout: 30000, priority: 3 },
      sirens: { format: 'custom', maxRetries: 5, timeout: 10000, priority: 1 },
      social_media: { format: 'custom', maxRetries: 3, timeout: 30000, priority: 4 },
      sms: { format: 'custom', maxRetries: 3, timeout: 30000, priority: 2 },
      email: { format: 'custom', maxRetries: 3, timeout: 60000, priority: 4 },
      push_notification: { format: 'custom', maxRetries: 3, timeout: 30000, priority: 2 }
    };

    return {
      id: `ch-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      name: this.getChannelName(type),
      enabled: true,
      config: { ...configs[type], maxRetries: 3, timeout: 30000, priority: 1 } as ChannelConfig,
      status: 'ready',
      deliveryStats: { sent: 0, delivered: 0, failed: 0, acknowledged: 0 }
    };
  }

  private getChannelName(type: ChannelType): string {
    const names: Record<ChannelType, string> = {
      eas: 'Emergency Alert System',
      wireless: 'Wireless Emergency Alerts (WEA)',
      broadcast_tv: 'Television Broadcast',
      broadcast_radio: 'Radio Broadcast',
      cable: 'Cable TV Override',
      satellite: 'Satellite Broadcast',
      internet: 'Internet Push',
      sirens: 'Outdoor Warning Sirens',
      social_media: 'Social Media',
      sms: 'SMS Text Messages',
      email: 'Email Alerts',
      push_notification: 'Mobile Push Notifications'
    };
    return names[type];
  }

  async getBroadcast(id: string): Promise<EmergencyBroadcast | null> {
    return this.broadcasts.get(id) || null;
  }

  async getAllBroadcasts(filters?: {
    status?: BroadcastStatus[];
    severity?: AlertSeverity[];
    dateRange?: { start: Date; end: Date };
  }): Promise<EmergencyBroadcast[]> {
    let broadcasts = Array.from(this.broadcasts.values());

    if (filters?.status) {
      broadcasts = broadcasts.filter(b => filters.status!.includes(b.status));
    }

    if (filters?.severity) {
      broadcasts = broadcasts.filter(b => {
        const info = b.capAlert.info[0];
        return info && filters.severity!.includes(info.severity);
      });
    }

    if (filters?.dateRange) {
      broadcasts = broadcasts.filter(b => 
        b.createdAt >= filters.dateRange!.start && 
        b.createdAt <= filters.dateRange!.end
      );
    }

    return broadcasts.sort((a, b) => a.priority - b.priority);
  }

  async updateBroadcast(id: string, updates: Partial<EmergencyBroadcast>): Promise<EmergencyBroadcast> {
    const broadcast = this.broadcasts.get(id);
    if (!broadcast) {
      throw new Error(`Broadcast not found: ${id}`);
    }

    const updated = { ...broadcast, ...updates, updatedAt: new Date() };
    this.broadcasts.set(id, updated);
    this.notifySubscribers(updated);

    return updated;
  }

  async cancelBroadcast(id: string, reason: string): Promise<EmergencyBroadcast> {
    const broadcast = this.broadcasts.get(id);
    if (!broadcast) {
      throw new Error(`Broadcast not found: ${id}`);
    }

    // Create cancellation CAP message
    const cancellation: CAPAlert = {
      ...broadcast.capAlert,
      identifier: `${broadcast.capAlert.identifier}-CANCEL`,
      msgType: 'cancel',
      sent: new Date(),
      references: [broadcast.capAlert.identifier],
      note: reason
    };

    const updated = await this.updateBroadcast(id, {
      status: 'cancelled',
      capAlert: cancellation,
      metadata: { ...broadcast.metadata, cancellationReason: reason }
    });

    // Send cancellation to all channels
    await this.distributeCancellation(updated);

    return updated;
  }

  // ==================== Broadcast Execution ====================

  async executeBroadcast(id: string): Promise<EmergencyBroadcast> {
    const broadcast = this.broadcasts.get(id);
    if (!broadcast) {
      throw new Error(`Broadcast not found: ${id}`);
    }

    if (broadcast.approval.required && broadcast.approval.status !== 'approved') {
      throw new Error('Broadcast requires approval before execution');
    }

    await this.updateBroadcast(id, {
      status: 'broadcasting',
      delivery: { ...broadcast.delivery, startTime: new Date() }
    });

    // Execute on all enabled channels
    const channelPromises = broadcast.channels
      .filter(ch => ch.enabled)
      .map(channel => this.executeChannel(broadcast, channel));

    await Promise.allSettled(channelPromises);

    // Update final status
    const finalBroadcast = this.broadcasts.get(id)!;
    const allCompleted = finalBroadcast.channels.every(
      ch => ch.status === 'completed' || ch.status === 'failed'
    );

    if (allCompleted) {
      await this.updateBroadcast(id, {
        status: 'completed',
        delivery: { ...finalBroadcast.delivery, endTime: new Date() }
      });
    }

    return this.broadcasts.get(id)!;
  }

  private async executeChannel(broadcast: EmergencyBroadcast, channel: BroadcastChannel): Promise<void> {
    const handler = this.channelHandlers.get(channel.type);
    if (!handler) {
      console.warn(`No handler registered for channel: ${channel.type}`);
      return;
    }

    try {
      channel.status = 'broadcasting';
      await handler(broadcast);
      channel.status = 'completed';
    } catch (error) {
      channel.status = 'failed';
      broadcast.delivery.errors.push({
        timestamp: new Date(),
        channel: channel.type,
        errorCode: 'CHANNEL_FAILURE',
        message: error instanceof Error ? error.message : 'Unknown error',
        affectedCount: channel.deliveryStats.sent - channel.deliveryStats.delivered,
        retryable: true
      });
    }
  }

  private async distributeCancellation(broadcast: EmergencyBroadcast): Promise<void> {
    for (const channel of broadcast.channels) {
      const handler = this.channelHandlers.get(channel.type);
      if (handler) {
        try {
          await handler(broadcast);
        } catch (error) {
          console.error(`Failed to send cancellation via ${channel.type}:`, error);
        }
      }
    }
  }

  // ==================== Channel Handlers ====================

  private async handleWirelessBroadcast(broadcast: EmergencyBroadcast): Promise<void> {
    // Simulate WEA (Wireless Emergency Alert) broadcast
    console.log(`[WEA] Broadcasting alert: ${broadcast.capAlert.identifier}`);
    await this.simulateDelay(1000);
    
    const channel = broadcast.channels.find(c => c.type === 'wireless');
    if (channel) {
      channel.deliveryStats.sent = broadcast.targetAudience.estimated.devices;
      channel.deliveryStats.delivered = Math.floor(channel.deliveryStats.sent * 0.95);
      channel.deliveryStats.failed = channel.deliveryStats.sent - channel.deliveryStats.delivered;
    }
  }

  private async handleTVBroadcast(broadcast: EmergencyBroadcast): Promise<void> {
    console.log(`[TV] Broadcasting EAS alert: ${broadcast.capAlert.identifier}`);
    await this.simulateDelay(2000);
  }

  private async handleRadioBroadcast(broadcast: EmergencyBroadcast): Promise<void> {
    console.log(`[Radio] Broadcasting EAS alert: ${broadcast.capAlert.identifier}`);
    await this.simulateDelay(2000);
  }

  private async handleSirenActivation(broadcast: EmergencyBroadcast): Promise<void> {
    console.log(`[Sirens] Activating outdoor warning sirens for: ${broadcast.capAlert.identifier}`);
    await this.simulateDelay(500);
  }

  private async handleSMSBroadcast(broadcast: EmergencyBroadcast): Promise<void> {
    console.log(`[SMS] Sending bulk SMS for: ${broadcast.capAlert.identifier}`);
    await this.simulateDelay(3000);
  }

  private async handleEmailBroadcast(broadcast: EmergencyBroadcast): Promise<void> {
    console.log(`[Email] Sending email alerts for: ${broadcast.capAlert.identifier}`);
    await this.simulateDelay(5000);
  }

  private async handlePushNotification(broadcast: EmergencyBroadcast): Promise<void> {
    console.log(`[Push] Sending push notifications for: ${broadcast.capAlert.identifier}`);
    await this.simulateDelay(1500);
  }

  private async handleSocialMedia(broadcast: EmergencyBroadcast): Promise<void> {
    console.log(`[Social] Posting to social media for: ${broadcast.capAlert.identifier}`);
    await this.simulateDelay(2000);
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==================== Approval Workflow ====================

  async submitForApproval(id: string, approvers: string[]): Promise<EmergencyBroadcast> {
    const broadcast = this.broadcasts.get(id);
    if (!broadcast) {
      throw new Error(`Broadcast not found: ${id}`);
    }

    const approval: ApprovalWorkflow = {
      required: true,
      status: 'pending',
      approvers: approvers.map(userId => ({
        userId,
        name: `Approver ${userId}`,
        role: 'Emergency Manager',
        status: 'pending'
      }))
    };

    return this.updateBroadcast(id, {
      status: 'pending_approval',
      approval
    });
  }

  async approveBroadcast(id: string, approverId: string, comments?: string): Promise<EmergencyBroadcast> {
    const broadcast = this.broadcasts.get(id);
    if (!broadcast) {
      throw new Error(`Broadcast not found: ${id}`);
    }

    const approver = broadcast.approval.approvers.find(a => a.userId === approverId);
    if (!approver) {
      throw new Error(`Approver not found: ${approverId}`);
    }

    approver.status = 'approved';
    approver.timestamp = new Date();
    approver.comments = comments;

    // Check if all required approvers have approved
    const allApproved = broadcast.approval.approvers.every(a => a.status === 'approved');
    
    return this.updateBroadcast(id, {
      status: allApproved ? 'approved' : 'pending_approval',
      approval: {
        ...broadcast.approval,
        status: allApproved ? 'approved' : 'pending',
        approvers: broadcast.approval.approvers
      },
      analytics: {
        ...broadcast.analytics,
        timing: {
          ...broadcast.analytics.timing,
          creationToApproval: allApproved ? Date.now() - broadcast.createdAt.getTime() : 0
        }
      }
    });
  }

  async rejectBroadcast(id: string, approverId: string, reason: string): Promise<EmergencyBroadcast> {
    const broadcast = this.broadcasts.get(id);
    if (!broadcast) {
      throw new Error(`Broadcast not found: ${id}`);
    }

    const approver = broadcast.approval.approvers.find(a => a.userId === approverId);
    if (approver) {
      approver.status = 'rejected';
      approver.timestamp = new Date();
      approver.comments = reason;
    }

    return this.updateBroadcast(id, {
      status: 'draft',
      approval: {
        ...broadcast.approval,
        status: 'rejected'
      }
    });
  }

  // ==================== Template Management ====================

  async createTemplate(template: Omit<BroadcastTemplate, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<BroadcastTemplate> {
    const newTemplate: BroadcastTemplate = {
      ...template,
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.templates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  async getTemplate(id: string): Promise<BroadcastTemplate | null> {
    return this.templates.get(id) || null;
  }

  async getAllTemplates(category?: MessageCategory): Promise<BroadcastTemplate[]> {
    let templates = Array.from(this.templates.values()).filter(t => t.isActive);
    
    if (category) {
      templates = templates.filter(t => t.category === category);
    }

    return templates.sort((a, b) => b.usageCount - a.usageCount);
  }

  async createBroadcastFromTemplate(
    templateId: string,
    variables: Record<string, any>,
    targetAudience: TargetAudience,
    createdBy: string
  ): Promise<EmergencyBroadcast> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Validate required variables
    for (const variable of template.variables) {
      if (variable.required && !(variable.name in variables)) {
        throw new Error(`Missing required variable: ${variable.name}`);
      }
    }

    // Render template with variables
    const capAlert = await this.renderTemplate(template, variables);

    // Increment usage count
    template.usageCount++;
    template.updatedAt = new Date();

    return this.createBroadcast({
      capAlert,
      channels: template.channels,
      targetAudience,
      schedule: { type: 'immediate' },
      createdBy
    });
  }

  private async renderTemplate(template: BroadcastTemplate, variables: Record<string, any>): Promise<CAPAlert> {
    const capTemplate = JSON.stringify(template.capTemplate);
    let rendered = capTemplate;

    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }

    const partialAlert = JSON.parse(rendered) as Partial<CAPAlert>;
    return this.createCAPAlert(partialAlert);
  }

  // ==================== EAS Support ====================

  getEASEventCodes(): Record<string, string> {
    return { ...easEventCodes };
  }

  createEASMessage(params: {
    eventCode: string;
    locations: string[];
    validMinutes: number;
    callSign: string;
    message: string;
  }): EASMessage {
    return {
      id: `eas-${Date.now()}`,
      originator: 'CIV',
      eventCode: params.eventCode,
      location: params.locations,
      validTime: params.validMinutes,
      callSign: params.callSign,
      timestamp: new Date(),
      textMessage: params.message
    };
  }

  formatEASHeader(message: EASMessage): string {
    // ZCZC-ORG-EEE-PSSCCC-PSSCCC+TTTT-JJJHHMM-LLLLLLLL-
    const locations = message.location.slice(0, 31).join('-');
    const timeCode = this.formatEASTime(message.timestamp);
    
    return `ZCZC-${message.originator}-${message.eventCode}-${locations}+${String(message.validTime).padStart(4, '0')}-${timeCode}-${message.callSign}-`;
  }

  private formatEASTime(date: Date): string {
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${String(dayOfYear).padStart(3, '0')}${hours}${minutes}`;
  }

  // ==================== Analytics ====================

  async getBroadcastAnalytics(id: string): Promise<BroadcastAnalytics> {
    const broadcast = this.broadcasts.get(id);
    if (!broadcast) {
      throw new Error(`Broadcast not found: ${id}`);
    }
    return broadcast.analytics;
  }

  async getOverallAnalytics(dateRange: { start: Date; end: Date }): Promise<{
    totalBroadcasts: number;
    totalReach: number;
    averageDeliveryTime: number;
    channelPerformance: Record<ChannelType, { sent: number; delivered: number; rate: number }>;
    severityBreakdown: Record<AlertSeverity, number>;
  }> {
    const broadcasts = await this.getAllBroadcasts({ dateRange });

    const channelPerformance: Record<ChannelType, { sent: number; delivered: number; rate: number }> = {} as any;
    const severityBreakdown: Record<AlertSeverity, number> = {
      extreme: 0,
      severe: 0,
      moderate: 0,
      minor: 0,
      unknown: 0
    };

    let totalReach = 0;
    let totalDeliveryTime = 0;

    for (const broadcast of broadcasts) {
      totalReach += broadcast.analytics.reach.total;
      totalDeliveryTime += broadcast.analytics.timing.averageDeliveryTime;

      const info = broadcast.capAlert.info[0];
      if (info) {
        severityBreakdown[info.severity]++;
      }

      for (const channel of broadcast.channels) {
        if (!channelPerformance[channel.type]) {
          channelPerformance[channel.type] = { sent: 0, delivered: 0, rate: 0 };
        }
        channelPerformance[channel.type].sent += channel.deliveryStats.sent;
        channelPerformance[channel.type].delivered += channel.deliveryStats.delivered;
      }
    }

    // Calculate rates
    for (const type of Object.keys(channelPerformance) as ChannelType[]) {
      const perf = channelPerformance[type];
      perf.rate = perf.sent > 0 ? perf.delivered / perf.sent : 0;
    }

    return {
      totalBroadcasts: broadcasts.length,
      totalReach,
      averageDeliveryTime: broadcasts.length > 0 ? totalDeliveryTime / broadcasts.length : 0,
      channelPerformance,
      severityBreakdown
    };
  }

  // ==================== Subscriptions ====================

  subscribe(callback: (broadcast: EmergencyBroadcast) => void, filters?: BroadcastSubscription['filters']): string {
    const id = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.subscriptions.set(id, { id, callback, filters });
    return id;
  }

  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }

  private notifySubscribers(broadcast: EmergencyBroadcast): void {
    const info = broadcast.capAlert.info[0];

    for (const subscription of this.subscriptions.values()) {
      let shouldNotify = true;

      if (subscription.filters) {
        if (subscription.filters.severity && info) {
          shouldNotify = subscription.filters.severity.includes(info.severity);
        }
        if (shouldNotify && subscription.filters.categories && info) {
          shouldNotify = info.category.some(c => subscription.filters!.categories!.includes(c));
        }
        if (shouldNotify && subscription.filters.regions) {
          const broadcastRegions = broadcast.targetAudience.geographic.regions;
          shouldNotify = subscription.filters.regions.some(r => broadcastRegions.includes(r));
        }
      }

      if (shouldNotify) {
        try {
          subscription.callback(broadcast);
        } catch (error) {
          console.error(`Subscription callback error:`, error);
        }
      }
    }
  }

  // ==================== Queue Management ====================

  async queueBroadcast(broadcast: EmergencyBroadcast): Promise<void> {
    this.broadcastQueue.push(broadcast);
    this.broadcastQueue.sort((a, b) => a.priority - b.priority);

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.broadcastQueue.length === 0) return;

    this.isProcessing = true;

    while (this.broadcastQueue.length > 0) {
      const broadcast = this.broadcastQueue.shift()!;
      try {
        await this.executeBroadcast(broadcast.id);
      } catch (error) {
        console.error(`Failed to execute broadcast ${broadcast.id}:`, error);
      }
    }

    this.isProcessing = false;
  }

  getQueueStatus(): { length: number; isProcessing: boolean; nextPriority?: number } {
    return {
      length: this.broadcastQueue.length,
      isProcessing: this.isProcessing,
      nextPriority: this.broadcastQueue[0]?.priority
    };
  }
}

export const emergencyBroadcastService = EmergencyBroadcastService.getInstance();
export default EmergencyBroadcastService;
