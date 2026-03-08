/**
 * Incident Timeline Service
 * Comprehensive incident lifecycle tracking, event management, and timeline visualization
 */

// Timeline event type
type TimelineEventType = 
  | 'created' 
  | 'acknowledged' 
  | 'escalated' 
  | 'assigned' 
  | 'status_changed' 
  | 'priority_changed'
  | 'comment_added' 
  | 'attachment_added' 
  | 'linked' 
  | 'merged' 
  | 'resolved' 
  | 'closed'
  | 'reopened'
  | 'automated_action'
  | 'communication_sent'
  | 'postmortem_created'
  | 'sla_breach'
  | 'custom';

// Incident status
type IncidentStatus = 'open' | 'acknowledged' | 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'closed';

// Incident priority
type IncidentPriority = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

// Actor type
type ActorType = 'user' | 'system' | 'automation' | 'integration';

// Timeline Entry
interface TimelineEntry {
  id: string;
  incidentId: string;
  timestamp: Date;
  type: TimelineEventType;
  title: string;
  description: string;
  actor: {
    type: ActorType;
    id: string;
    name: string;
    avatar?: string;
  };
  data: {
    previousValue?: unknown;
    newValue?: unknown;
    metadata?: Record<string, unknown>;
  };
  visibility: 'public' | 'internal' | 'private';
  pinned: boolean;
  tags: string[];
  attachments: {
    id: string;
    type: 'image' | 'file' | 'link' | 'log' | 'metric';
    name: string;
    url: string;
    size?: number;
  }[];
  reactions: {
    userId: string;
    userName: string;
    emoji: string;
    timestamp: Date;
  }[];
  thread: {
    parentId?: string;
    replies: string[];
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    editedBy?: string;
    source: string;
  };
}

// Incident Timeline
interface IncidentTimeline {
  id: string;
  incidentId: string;
  incidentTitle: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  entries: TimelineEntry[];
  milestones: TimelineMilestone[];
  phases: IncidentPhase[];
  participants: TimelineParticipant[];
  communications: TimelineCommunication[];
  metrics: TimelineMetrics;
  summary: {
    totalEntries: number;
    entriesByType: Record<TimelineEventType, number>;
    duration: number;
    keyEvents: string[];
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastActivity: Date;
  };
}

// Timeline Milestone
interface TimelineMilestone {
  id: string;
  incidentId: string;
  name: string;
  description: string;
  type: 'detection' | 'acknowledgment' | 'triage' | 'mitigation' | 'resolution' | 'closure' | 'custom';
  timestamp: Date;
  duration?: number;
  achieved: boolean;
  sla?: {
    target: number;
    actual: number;
    breached: boolean;
  };
  responsible?: {
    userId: string;
    userName: string;
  };
  notes?: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Incident Phase
interface IncidentPhase {
  id: string;
  incidentId: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  order: number;
  activities: {
    id: string;
    name: string;
    completed: boolean;
    completedAt?: Date;
    completedBy?: string;
  }[];
  notes: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Timeline Participant
interface TimelineParticipant {
  id: string;
  incidentId: string;
  userId: string;
  userName: string;
  email: string;
  role: 'commander' | 'lead' | 'responder' | 'observer' | 'stakeholder' | 'scribe';
  status: 'active' | 'inactive' | 'removed';
  joinedAt: Date;
  leftAt?: Date;
  contributions: {
    comments: number;
    statusUpdates: number;
    actions: number;
  };
  notifications: {
    enabled: boolean;
    channels: string[];
  };
}

// Timeline Communication
interface TimelineCommunication {
  id: string;
  incidentId: string;
  type: 'status_page' | 'email' | 'slack' | 'sms' | 'internal' | 'customer';
  timestamp: Date;
  sender: {
    userId: string;
    userName: string;
  };
  recipients: {
    type: 'user' | 'group' | 'channel' | 'external';
    id: string;
    name: string;
  }[];
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'delivered' | 'failed';
  template?: string;
  metadata: {
    createdAt: Date;
    sentAt?: Date;
    deliveredAt?: Date;
  };
}

// Timeline Metrics
interface TimelineMetrics {
  incidentId: string;
  timing: {
    timeToDetect: number;
    timeToAcknowledge: number;
    timeToMitigate: number;
    timeToResolve: number;
    totalDuration: number;
  };
  engagement: {
    totalParticipants: number;
    totalComments: number;
    totalStatusUpdates: number;
    avgResponseTime: number;
  };
  impact: {
    affectedServices: string[];
    affectedUsers: number;
    financialImpact?: number;
    severity: number;
  };
  sla: {
    ackSlaTarget: number;
    ackSlaActual: number;
    ackSlaMet: boolean;
    resolveSlaTarget: number;
    resolveSlaActual: number;
    resolveSlaMet: boolean;
  };
}

// Postmortem
interface Postmortem {
  id: string;
  incidentId: string;
  incidentTitle: string;
  status: 'draft' | 'in_review' | 'published' | 'archived';
  summary: string;
  timeline: TimelineEntry[];
  impact: {
    description: string;
    duration: number;
    affectedServices: string[];
    affectedUsers: number;
    financialImpact?: number;
  };
  rootCause: {
    description: string;
    category: string;
    contributing: string[];
  };
  detection: {
    method: string;
    delay?: number;
    improvements?: string[];
  };
  response: {
    summary: string;
    whatWorked: string[];
    whatDidntWork: string[];
    luckyBreaks: string[];
  };
  actionItems: {
    id: string;
    title: string;
    description: string;
    owner: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    dueDate?: Date;
    completedAt?: Date;
  }[];
  lessons: string[];
  participants: string[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    publishedAt?: Date;
    reviewers: string[];
  };
}

// Timeline Filter
interface TimelineFilter {
  types?: TimelineEventType[];
  actors?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  visibility?: ('public' | 'internal' | 'private')[];
  pinned?: boolean;
  search?: string;
}

// Timeline Template
interface TimelineTemplate {
  id: string;
  name: string;
  description: string;
  type: 'incident' | 'postmortem' | 'communication';
  status: 'active' | 'inactive' | 'draft';
  phases: {
    name: string;
    order: number;
    activities: string[];
  }[];
  milestones: {
    name: string;
    type: TimelineMilestone['type'];
    slaMinutes?: number;
  }[];
  communications: {
    trigger: string;
    template: string;
    channels: string[];
  }[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    usageCount: number;
  };
}

// Timeline Statistics
interface TimelineStatistics {
  overview: {
    totalIncidents: number;
    totalTimelineEntries: number;
    avgEntriesPerIncident: number;
    avgIncidentDuration: number;
  };
  byType: {
    type: TimelineEventType;
    count: number;
    percentage: number;
  }[];
  byPhase: {
    phase: string;
    avgDuration: number;
    incidents: number;
  }[];
  timing: {
    avgTimeToDetect: number;
    avgTimeToAcknowledge: number;
    avgTimeToMitigate: number;
    avgTimeToResolve: number;
  };
  sla: {
    ackComplianceRate: number;
    resolveComplianceRate: number;
    overallComplianceRate: number;
  };
  trends: {
    date: string;
    incidents: number;
    avgDuration: number;
    slaCompliance: number;
  }[];
}

class IncidentTimelineService {
  private static instance: IncidentTimelineService;
  private timelines: Map<string, IncidentTimeline> = new Map();
  private entries: Map<string, TimelineEntry> = new Map();
  private milestones: Map<string, TimelineMilestone> = new Map();
  private phases: Map<string, IncidentPhase> = new Map();
  private participants: Map<string, TimelineParticipant> = new Map();
  private communications: Map<string, TimelineCommunication> = new Map();
  private postmortems: Map<string, Postmortem> = new Map();
  private templates: Map<string, TimelineTemplate> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): IncidentTimelineService {
    if (!IncidentTimelineService.instance) {
      IncidentTimelineService.instance = new IncidentTimelineService();
    }
    return IncidentTimelineService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Timeline Templates
    const templatesData = [
      { name: 'Standard Incident', type: 'incident' },
      { name: 'Critical Incident', type: 'incident' },
      { name: 'Standard Postmortem', type: 'postmortem' },
    ];

    templatesData.forEach((t, idx) => {
      const template: TimelineTemplate = {
        id: `tmpl-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: `Template for ${t.name.toLowerCase()}`,
        type: t.type as TimelineTemplate['type'],
        status: 'active',
        phases: [
          { name: 'Detection', order: 1, activities: ['Verify alert', 'Initial assessment'] },
          { name: 'Triage', order: 2, activities: ['Assess severity', 'Assign responders'] },
          { name: 'Investigation', order: 3, activities: ['Gather data', 'Identify root cause'] },
          { name: 'Mitigation', order: 4, activities: ['Implement fix', 'Verify fix'] },
          { name: 'Resolution', order: 5, activities: ['Close incident', 'Document learnings'] },
        ],
        milestones: [
          { name: 'Detected', type: 'detection' },
          { name: 'Acknowledged', type: 'acknowledgment', slaMinutes: 15 },
          { name: 'Triaged', type: 'triage', slaMinutes: 30 },
          { name: 'Mitigated', type: 'mitigation', slaMinutes: 60 },
          { name: 'Resolved', type: 'resolution', slaMinutes: 240 },
        ],
        communications: [
          { trigger: 'on_acknowledge', template: 'Initial notification', channels: ['slack', 'email'] },
          { trigger: 'on_resolve', template: 'Resolution notification', channels: ['slack', 'email'] },
        ],
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          usageCount: Math.floor(Math.random() * 100) + 20,
        },
      };
      this.templates.set(template.id, template);
    });

    // Initialize sample incidents with timelines
    const incidentsData = [
      { title: 'Database Connection Pool Exhaustion', status: 'resolved', priority: 'P1' },
      { title: 'API Gateway High Latency', status: 'resolved', priority: 'P2' },
      { title: 'Authentication Service Degraded', status: 'monitoring', priority: 'P2' },
      { title: 'CDN Cache Invalidation Issue', status: 'investigating', priority: 'P3' },
      { title: 'Payment Processing Delays', status: 'acknowledged', priority: 'P1' },
      { title: 'Email Notification Failures', status: 'resolved', priority: 'P3' },
      { title: 'Memory Leak in User Service', status: 'resolved', priority: 'P2' },
      { title: 'SSL Certificate Expiry Warning', status: 'closed', priority: 'P4' },
    ];

    const usersData = [
      { name: 'John Smith', role: 'commander' },
      { name: 'Sarah Johnson', role: 'lead' },
      { name: 'Mike Chen', role: 'responder' },
      { name: 'Emily Davis', role: 'responder' },
      { name: 'Alex Wilson', role: 'observer' },
    ];

    incidentsData.forEach((inc, idx) => {
      const incidentId = `inc-${(idx + 1).toString().padStart(6, '0')}`;
      const timelineId = `timeline-${incidentId}`;
      const startTime = new Date(Date.now() - (30 - idx * 3) * 24 * 60 * 60 * 1000);
      const isResolved = ['resolved', 'closed'].includes(inc.status);
      const duration = isResolved ? Math.floor(Math.random() * 180) + 30 : undefined;

      // Create timeline entries
      const timelineEntries: TimelineEntry[] = [];
      const eventTypes: { type: TimelineEventType; minutesOffset: number; title: string }[] = [
        { type: 'created', minutesOffset: 0, title: 'Incident created' },
        { type: 'acknowledged', minutesOffset: Math.floor(Math.random() * 10) + 2, title: 'Incident acknowledged' },
        { type: 'assigned', minutesOffset: Math.floor(Math.random() * 5) + 12, title: 'Responders assigned' },
        { type: 'status_changed', minutesOffset: Math.floor(Math.random() * 10) + 20, title: 'Status changed to investigating' },
        { type: 'comment_added', minutesOffset: Math.floor(Math.random() * 15) + 35, title: 'Investigation update' },
        { type: 'escalated', minutesOffset: Math.floor(Math.random() * 10) + 50, title: 'Escalated to L2' },
        { type: 'communication_sent', minutesOffset: Math.floor(Math.random() * 5) + 60, title: 'Status update sent' },
      ];

      if (isResolved) {
        eventTypes.push(
          { type: 'status_changed', minutesOffset: Math.floor(Math.random() * 30) + 90, title: 'Status changed to identified' },
          { type: 'status_changed', minutesOffset: Math.floor(Math.random() * 30) + 120, title: 'Status changed to monitoring' },
          { type: 'resolved', minutesOffset: duration!, title: 'Incident resolved' },
        );
        if (inc.status === 'closed') {
          eventTypes.push(
            { type: 'postmortem_created', minutesOffset: duration! + 60, title: 'Postmortem created' },
            { type: 'closed', minutesOffset: duration! + 1440, title: 'Incident closed' },
          );
        }
      }

      eventTypes.forEach((evt, evtIdx) => {
        const user = usersData[evtIdx % usersData.length];
        const entry: TimelineEntry = {
          id: `entry-${incidentId}-${(evtIdx + 1).toString().padStart(3, '0')}`,
          incidentId,
          timestamp: new Date(startTime.getTime() + evt.minutesOffset * 60 * 1000),
          type: evt.type,
          title: evt.title,
          description: `${evt.title} for incident ${inc.title}`,
          actor: {
            type: evtIdx === 0 ? 'system' : 'user',
            id: `user-${(evtIdx % 5 + 1).toString().padStart(4, '0')}`,
            name: evtIdx === 0 ? 'Monitoring System' : user.name,
          },
          data: {
            previousValue: evt.type === 'status_changed' ? incidentsData[idx].status : undefined,
            newValue: evt.type === 'status_changed' ? 'investigating' : undefined,
          },
          visibility: evt.type === 'communication_sent' ? 'public' : 'internal',
          pinned: evt.type === 'created' || evt.type === 'resolved',
          tags: [],
          attachments: evtIdx === 4 ? [{
            id: `attach-${evtIdx}`,
            type: 'log',
            name: 'error_logs.txt',
            url: '/attachments/error_logs.txt',
            size: 1024,
          }] : [],
          reactions: [],
          thread: { replies: [] },
          metadata: {
            createdAt: new Date(startTime.getTime() + evt.minutesOffset * 60 * 1000),
            updatedAt: new Date(),
            source: evtIdx === 0 ? 'monitoring' : 'web',
          },
        };
        timelineEntries.push(entry);
        this.entries.set(entry.id, entry);
      });

      // Create milestones
      const milestonesData: TimelineMilestone[] = [
        {
          id: `ms-${incidentId}-1`,
          incidentId,
          name: 'Detected',
          description: 'Incident detected by monitoring',
          type: 'detection',
          timestamp: startTime,
          achieved: true,
          metadata: { createdAt: startTime, updatedAt: new Date() },
        },
        {
          id: `ms-${incidentId}-2`,
          incidentId,
          name: 'Acknowledged',
          description: 'Incident acknowledged by responder',
          type: 'acknowledgment',
          timestamp: new Date(startTime.getTime() + 5 * 60 * 1000),
          achieved: true,
          sla: { target: 15 * 60, actual: 5 * 60, breached: false },
          responsible: { userId: 'user-0001', userName: usersData[0].name },
          metadata: { createdAt: startTime, updatedAt: new Date() },
        },
        {
          id: `ms-${incidentId}-3`,
          incidentId,
          name: 'Mitigated',
          description: 'Initial mitigation applied',
          type: 'mitigation',
          timestamp: isResolved ? new Date(startTime.getTime() + (duration! - 30) * 60 * 1000) : undefined!,
          achieved: isResolved,
          sla: isResolved ? { target: 60 * 60, actual: (duration! - 30) * 60, breached: duration! > 60 } : undefined,
          metadata: { createdAt: startTime, updatedAt: new Date() },
        },
        {
          id: `ms-${incidentId}-4`,
          incidentId,
          name: 'Resolved',
          description: 'Incident fully resolved',
          type: 'resolution',
          timestamp: isResolved ? new Date(startTime.getTime() + duration! * 60 * 1000) : undefined!,
          achieved: isResolved,
          sla: isResolved ? { target: 240 * 60, actual: duration! * 60, breached: duration! > 240 } : undefined,
          metadata: { createdAt: startTime, updatedAt: new Date() },
        },
      ];

      milestonesData.forEach((ms) => this.milestones.set(ms.id, ms));

      // Create phases
      const phasesData: IncidentPhase[] = [
        {
          id: `phase-${incidentId}-1`,
          incidentId,
          name: 'Detection',
          status: 'completed',
          startTime,
          endTime: new Date(startTime.getTime() + 5 * 60 * 1000),
          duration: 5 * 60 * 1000,
          order: 1,
          activities: [
            { id: 'act-1', name: 'Alert triggered', completed: true, completedAt: startTime },
            { id: 'act-2', name: 'Initial verification', completed: true },
          ],
          notes: 'Detected via automated monitoring',
          metadata: { createdAt: startTime, updatedAt: new Date() },
        },
        {
          id: `phase-${incidentId}-2`,
          incidentId,
          name: 'Investigation',
          status: isResolved ? 'completed' : 'active',
          startTime: new Date(startTime.getTime() + 5 * 60 * 1000),
          endTime: isResolved ? new Date(startTime.getTime() + 60 * 60 * 1000) : undefined,
          order: 2,
          activities: [
            { id: 'act-3', name: 'Gather logs', completed: true },
            { id: 'act-4', name: 'Identify root cause', completed: isResolved },
          ],
          notes: 'Investigation in progress',
          metadata: { createdAt: startTime, updatedAt: new Date() },
        },
        {
          id: `phase-${incidentId}-3`,
          incidentId,
          name: 'Resolution',
          status: isResolved ? 'completed' : 'pending',
          startTime: isResolved ? new Date(startTime.getTime() + 60 * 60 * 1000) : undefined,
          endTime: isResolved ? new Date(startTime.getTime() + duration! * 60 * 1000) : undefined,
          order: 3,
          activities: [
            { id: 'act-5', name: 'Apply fix', completed: isResolved },
            { id: 'act-6', name: 'Verify resolution', completed: isResolved },
          ],
          notes: '',
          metadata: { createdAt: startTime, updatedAt: new Date() },
        },
      ];

      phasesData.forEach((p) => this.phases.set(p.id, p));

      // Create participants
      const participantsData: TimelineParticipant[] = usersData.slice(0, Math.min(3 + idx % 3, 5)).map((u, uIdx) => ({
        id: `part-${incidentId}-${uIdx + 1}`,
        incidentId,
        userId: `user-${(uIdx + 1).toString().padStart(4, '0')}`,
        userName: u.name,
        email: `${u.name.toLowerCase().replace(' ', '.')}@rescueping.com`,
        role: u.role as TimelineParticipant['role'],
        status: 'active',
        joinedAt: new Date(startTime.getTime() + uIdx * 5 * 60 * 1000),
        contributions: {
          comments: Math.floor(Math.random() * 10) + 1,
          statusUpdates: Math.floor(Math.random() * 5) + 1,
          actions: Math.floor(Math.random() * 8) + 1,
        },
        notifications: {
          enabled: true,
          channels: ['email', 'slack'],
        },
      }));

      participantsData.forEach((p) => this.participants.set(p.id, p));

      // Create communications
      const communicationsData: TimelineCommunication[] = [
        {
          id: `comm-${incidentId}-1`,
          incidentId,
          type: 'internal',
          timestamp: new Date(startTime.getTime() + 10 * 60 * 1000),
          sender: { userId: 'user-0001', userName: usersData[0].name },
          recipients: [{ type: 'channel', id: 'incident-channel', name: '#incident-response' }],
          subject: `[Incident] ${inc.title}`,
          content: `Incident detected: ${inc.title}. Investigation starting.`,
          status: 'delivered',
          metadata: { createdAt: startTime, sentAt: new Date(startTime.getTime() + 10 * 60 * 1000), deliveredAt: new Date(startTime.getTime() + 10 * 60 * 1000 + 5000) },
        },
        {
          id: `comm-${incidentId}-2`,
          incidentId,
          type: 'status_page',
          timestamp: new Date(startTime.getTime() + 30 * 60 * 1000),
          sender: { userId: 'user-0002', userName: usersData[1].name },
          recipients: [{ type: 'external', id: 'status-page', name: 'Public Status Page' }],
          subject: 'Service Degradation',
          content: 'We are currently investigating an issue affecting some services.',
          status: 'delivered',
          metadata: { createdAt: startTime, sentAt: new Date(startTime.getTime() + 30 * 60 * 1000) },
        },
      ];

      communicationsData.forEach((c) => this.communications.set(c.id, c));

      // Create timeline
      const timeline: IncidentTimeline = {
        id: timelineId,
        incidentId,
        incidentTitle: inc.title,
        status: inc.status as IncidentStatus,
        priority: inc.priority as IncidentPriority,
        entries: timelineEntries,
        milestones: milestonesData,
        phases: phasesData,
        participants: participantsData,
        communications: communicationsData,
        metrics: {
          incidentId,
          timing: {
            timeToDetect: 0,
            timeToAcknowledge: 5 * 60,
            timeToMitigate: isResolved ? (duration! - 30) * 60 : 0,
            timeToResolve: isResolved ? duration! * 60 : 0,
            totalDuration: isResolved ? duration! * 60 : Date.now() - startTime.getTime(),
          },
          engagement: {
            totalParticipants: participantsData.length,
            totalComments: timelineEntries.filter((e) => e.type === 'comment_added').length,
            totalStatusUpdates: timelineEntries.filter((e) => e.type === 'status_changed').length,
            avgResponseTime: 5 * 60,
          },
          impact: {
            affectedServices: ['api-gateway', 'user-service'],
            affectedUsers: Math.floor(Math.random() * 10000) + 100,
            severity: parseInt(inc.priority.substring(1)),
          },
          sla: {
            ackSlaTarget: 15 * 60,
            ackSlaActual: 5 * 60,
            ackSlaMet: true,
            resolveSlaTarget: 240 * 60,
            resolveSlaActual: isResolved ? duration! * 60 : 0,
            resolveSlaMet: isResolved && duration! <= 240,
          },
        },
        summary: {
          totalEntries: timelineEntries.length,
          entriesByType: timelineEntries.reduce((acc, e) => {
            acc[e.type] = (acc[e.type] || 0) + 1;
            return acc;
          }, {} as Record<TimelineEventType, number>),
          duration: isResolved ? duration! * 60 : 0,
          keyEvents: ['Incident created', 'Acknowledged', isResolved ? 'Resolved' : 'In progress'].filter(Boolean),
        },
        metadata: {
          createdAt: startTime,
          updatedAt: new Date(),
          lastActivity: timelineEntries[timelineEntries.length - 1]?.timestamp || new Date(),
        },
      };

      this.timelines.set(timeline.id, timeline);

      // Create postmortem for resolved incidents
      if (inc.status === 'closed') {
        const postmortem: Postmortem = {
          id: `pm-${incidentId}`,
          incidentId,
          incidentTitle: inc.title,
          status: 'published',
          summary: `Postmortem for ${inc.title} incident that occurred on ${startTime.toDateString()}`,
          timeline: timelineEntries.slice(0, 5),
          impact: {
            description: `Service degradation affecting ${['api-gateway', 'user-service'].join(', ')}`,
            duration: duration! * 60,
            affectedServices: ['api-gateway', 'user-service'],
            affectedUsers: Math.floor(Math.random() * 10000) + 100,
          },
          rootCause: {
            description: 'Connection pool exhaustion due to connection leak',
            category: 'Software Bug',
            contributing: ['High traffic', 'Missing connection timeout'],
          },
          detection: {
            method: 'Automated monitoring alert',
            delay: 2 * 60,
            improvements: ['Add more granular monitoring'],
          },
          response: {
            summary: 'Team responded promptly and resolved within SLA',
            whatWorked: ['Quick escalation', 'Good communication'],
            whatDidntWork: ['Initial diagnosis took too long'],
            luckyBreaks: ['On-call engineer had recent experience with similar issue'],
          },
          actionItems: [
            {
              id: `ai-${idx}-1`,
              title: 'Add connection pool monitoring',
              description: 'Implement monitoring for connection pool utilization',
              owner: usersData[0].name,
              priority: 'high',
              status: 'completed',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              completedAt: new Date(),
            },
            {
              id: `ai-${idx}-2`,
              title: 'Implement connection timeout',
              description: 'Add timeout configuration for database connections',
              owner: usersData[1].name,
              priority: 'high',
              status: 'in_progress',
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            },
          ],
          lessons: [
            'Connection pool monitoring is critical for database-heavy applications',
            'Timeouts should be configured at all layers',
          ],
          participants: participantsData.map((p) => p.userName),
          metadata: {
            createdAt: new Date(startTime.getTime() + (duration! + 60) * 60 * 1000),
            createdBy: usersData[0].name,
            updatedAt: new Date(),
            publishedAt: new Date(startTime.getTime() + (duration! + 1440) * 60 * 1000),
            reviewers: [usersData[1].name, usersData[2].name],
          },
        };
        this.postmortems.set(postmortem.id, postmortem);
      }
    });
  }

  // Timeline Operations
  public getTimelines(filter?: { status?: IncidentStatus; priority?: IncidentPriority }): IncidentTimeline[] {
    let timelines = Array.from(this.timelines.values());
    if (filter?.status) timelines = timelines.filter((t) => t.status === filter.status);
    if (filter?.priority) timelines = timelines.filter((t) => t.priority === filter.priority);
    return timelines.sort((a, b) => b.metadata.lastActivity.getTime() - a.metadata.lastActivity.getTime());
  }

  public getTimelineById(id: string): IncidentTimeline | undefined {
    return this.timelines.get(id);
  }

  public getTimelineByIncidentId(incidentId: string): IncidentTimeline | undefined {
    return Array.from(this.timelines.values()).find((t) => t.incidentId === incidentId);
  }

  // Entry Operations
  public getEntries(incidentId: string, filter?: TimelineFilter): TimelineEntry[] {
    let entries = Array.from(this.entries.values()).filter((e) => e.incidentId === incidentId);
    
    if (filter?.types) entries = entries.filter((e) => filter.types!.includes(e.type));
    if (filter?.actors) entries = entries.filter((e) => filter.actors!.includes(e.actor.id));
    if (filter?.visibility) entries = entries.filter((e) => filter.visibility!.includes(e.visibility));
    if (filter?.pinned !== undefined) entries = entries.filter((e) => e.pinned === filter.pinned);
    if (filter?.dateRange) {
      entries = entries.filter((e) => 
        e.timestamp >= filter.dateRange!.start && e.timestamp <= filter.dateRange!.end
      );
    }
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      entries = entries.filter((e) => 
        e.title.toLowerCase().includes(searchLower) || 
        e.description.toLowerCase().includes(searchLower)
      );
    }

    return entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  public addEntry(incidentId: string, data: Partial<TimelineEntry>): TimelineEntry {
    const entry: TimelineEntry = {
      id: `entry-${this.generateId()}`,
      incidentId,
      timestamp: new Date(),
      type: data.type || 'custom',
      title: data.title || '',
      description: data.description || '',
      actor: data.actor || { type: 'system', id: 'system', name: 'System' },
      data: data.data || {},
      visibility: data.visibility || 'internal',
      pinned: false,
      tags: data.tags || [],
      attachments: data.attachments || [],
      reactions: [],
      thread: { replies: [] },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'api',
      },
    };

    this.entries.set(entry.id, entry);
    
    const timeline = this.getTimelineByIncidentId(incidentId);
    if (timeline) {
      timeline.entries.push(entry);
      timeline.metadata.lastActivity = new Date();
    }

    this.emit('entry_added', entry);
    return entry;
  }

  // Milestone Operations
  public getMilestones(incidentId: string): TimelineMilestone[] {
    return Array.from(this.milestones.values())
      .filter((m) => m.incidentId === incidentId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  public achieveMilestone(id: string, userId?: string): TimelineMilestone {
    const milestone = this.milestones.get(id);
    if (!milestone) throw new Error('Milestone not found');

    milestone.achieved = true;
    milestone.timestamp = new Date();
    if (userId) {
      milestone.responsible = { userId, userName: 'User' };
    }
    milestone.metadata.updatedAt = new Date();

    this.emit('milestone_achieved', milestone);
    return milestone;
  }

  // Phase Operations
  public getPhases(incidentId: string): IncidentPhase[] {
    return Array.from(this.phases.values())
      .filter((p) => p.incidentId === incidentId)
      .sort((a, b) => a.order - b.order);
  }

  public updatePhaseStatus(id: string, status: IncidentPhase['status']): IncidentPhase {
    const phase = this.phases.get(id);
    if (!phase) throw new Error('Phase not found');

    phase.status = status;
    if (status === 'active' && !phase.startTime) {
      phase.startTime = new Date();
    }
    if (status === 'completed') {
      phase.endTime = new Date();
      phase.duration = phase.endTime.getTime() - (phase.startTime?.getTime() || 0);
    }
    phase.metadata.updatedAt = new Date();

    this.emit('phase_updated', phase);
    return phase;
  }

  // Participant Operations
  public getParticipants(incidentId: string): TimelineParticipant[] {
    return Array.from(this.participants.values()).filter((p) => p.incidentId === incidentId);
  }

  public addParticipant(incidentId: string, data: Partial<TimelineParticipant>): TimelineParticipant {
    const participant: TimelineParticipant = {
      id: `part-${this.generateId()}`,
      incidentId,
      userId: data.userId || '',
      userName: data.userName || '',
      email: data.email || '',
      role: data.role || 'responder',
      status: 'active',
      joinedAt: new Date(),
      contributions: { comments: 0, statusUpdates: 0, actions: 0 },
      notifications: { enabled: true, channels: ['email', 'slack'] },
    };

    this.participants.set(participant.id, participant);
    this.emit('participant_added', participant);
    return participant;
  }

  // Communication Operations
  public getCommunications(incidentId: string): TimelineCommunication[] {
    return Array.from(this.communications.values())
      .filter((c) => c.incidentId === incidentId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  public addCommunication(incidentId: string, data: Partial<TimelineCommunication>): TimelineCommunication {
    const communication: TimelineCommunication = {
      id: `comm-${this.generateId()}`,
      incidentId,
      type: data.type || 'internal',
      timestamp: new Date(),
      sender: data.sender || { userId: '', userName: '' },
      recipients: data.recipients || [],
      subject: data.subject || '',
      content: data.content || '',
      status: 'draft',
      metadata: { createdAt: new Date() },
    };

    this.communications.set(communication.id, communication);
    this.emit('communication_added', communication);
    return communication;
  }

  // Postmortem Operations
  public getPostmortems(): Postmortem[] {
    return Array.from(this.postmortems.values());
  }

  public getPostmortemById(id: string): Postmortem | undefined {
    return this.postmortems.get(id);
  }

  public getPostmortemByIncidentId(incidentId: string): Postmortem | undefined {
    return Array.from(this.postmortems.values()).find((p) => p.incidentId === incidentId);
  }

  public createPostmortem(incidentId: string): Postmortem {
    const timeline = this.getTimelineByIncidentId(incidentId);
    if (!timeline) throw new Error('Timeline not found');

    const postmortem: Postmortem = {
      id: `pm-${this.generateId()}`,
      incidentId,
      incidentTitle: timeline.incidentTitle,
      status: 'draft',
      summary: '',
      timeline: timeline.entries,
      impact: {
        description: '',
        duration: timeline.metrics.timing.totalDuration,
        affectedServices: timeline.metrics.impact.affectedServices,
        affectedUsers: timeline.metrics.impact.affectedUsers,
      },
      rootCause: {
        description: '',
        category: '',
        contributing: [],
      },
      detection: { method: '' },
      response: {
        summary: '',
        whatWorked: [],
        whatDidntWork: [],
        luckyBreaks: [],
      },
      actionItems: [],
      lessons: [],
      participants: timeline.participants.map((p) => p.userName),
      metadata: {
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
        reviewers: [],
      },
    };

    this.postmortems.set(postmortem.id, postmortem);
    this.emit('postmortem_created', postmortem);
    return postmortem;
  }

  // Template Operations
  public getTemplates(): TimelineTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplateById(id: string): TimelineTemplate | undefined {
    return this.templates.get(id);
  }

  // Statistics
  public getStatistics(): TimelineStatistics {
    const timelines = Array.from(this.timelines.values());
    const entries = Array.from(this.entries.values());
    const resolved = timelines.filter((t) => ['resolved', 'closed'].includes(t.status));

    const eventTypes: TimelineEventType[] = ['created', 'acknowledged', 'escalated', 'status_changed', 'comment_added', 'resolved'];
    
    return {
      overview: {
        totalIncidents: timelines.length,
        totalTimelineEntries: entries.length,
        avgEntriesPerIncident: entries.length / timelines.length,
        avgIncidentDuration: resolved.reduce((sum, t) => sum + t.metrics.timing.totalDuration, 0) / resolved.length,
      },
      byType: eventTypes.map((type) => ({
        type,
        count: entries.filter((e) => e.type === type).length,
        percentage: (entries.filter((e) => e.type === type).length / entries.length) * 100,
      })),
      byPhase: ['Detection', 'Investigation', 'Resolution'].map((phase) => ({
        phase,
        avgDuration: Math.floor(Math.random() * 30) + 10,
        incidents: timelines.length,
      })),
      timing: {
        avgTimeToDetect: resolved.reduce((sum, t) => sum + t.metrics.timing.timeToDetect, 0) / resolved.length,
        avgTimeToAcknowledge: resolved.reduce((sum, t) => sum + t.metrics.timing.timeToAcknowledge, 0) / resolved.length,
        avgTimeToMitigate: resolved.reduce((sum, t) => sum + t.metrics.timing.timeToMitigate, 0) / resolved.length,
        avgTimeToResolve: resolved.reduce((sum, t) => sum + t.metrics.timing.timeToResolve, 0) / resolved.length,
      },
      sla: {
        ackComplianceRate: (resolved.filter((t) => t.metrics.sla.ackSlaMet).length / resolved.length) * 100,
        resolveComplianceRate: (resolved.filter((t) => t.metrics.sla.resolveSlaMet).length / resolved.length) * 100,
        overallComplianceRate: (resolved.filter((t) => t.metrics.sla.ackSlaMet && t.metrics.sla.resolveSlaMet).length / resolved.length) * 100,
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

export const incidentTimelineService = IncidentTimelineService.getInstance();
export type {
  TimelineEventType,
  IncidentStatus,
  IncidentPriority,
  ActorType,
  TimelineEntry,
  IncidentTimeline,
  TimelineMilestone,
  IncidentPhase,
  TimelineParticipant,
  TimelineCommunication,
  TimelineMetrics,
  Postmortem,
  TimelineFilter,
  TimelineTemplate,
  TimelineStatistics,
};
