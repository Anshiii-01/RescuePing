/**
 * Incident Response Service
 * Security incident management, response workflows, and post-incident analysis
 */

// Incident severity
type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

// Incident status
type IncidentStatus = 'new' | 'triaging' | 'investigating' | 'containing' | 'eradicating' | 'recovering' | 'resolved' | 'closed';

// Incident type
type IncidentType = 'security_breach' | 'data_leak' | 'malware' | 'phishing' | 'ddos' | 'unauthorized_access' | 'service_disruption' | 'natural_disaster' | 'human_error' | 'policy_violation' | 'other';

// Incident category
type IncidentCategory = 'confidentiality' | 'integrity' | 'availability' | 'privacy' | 'physical' | 'operational';

// Response action type
type ActionType = 'investigate' | 'contain' | 'eradicate' | 'recover' | 'communicate' | 'document' | 'escalate' | 'notify';

// Incident
interface Incident {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  priority: number;
  source: {
    type: 'automated' | 'manual' | 'external' | 'audit';
    system?: string;
    reporter?: string;
    externalRef?: string;
  };
  detection: {
    detectedAt: Date;
    method: string;
    indicators: string[];
  };
  impact: {
    systems: string[];
    data: string[];
    users: number;
    financial?: number;
    reputational: 'none' | 'low' | 'medium' | 'high' | 'critical';
    operational: 'none' | 'low' | 'medium' | 'high' | 'critical';
    description: string;
  };
  timeline: TimelineEntry[];
  team: {
    lead: string;
    members: TeamMember[];
    escalatedTo?: string[];
  };
  artifacts: Artifact[];
  actions: ResponseAction[];
  containment: {
    strategy: string;
    implemented: boolean;
    measures: string[];
    effectiveAt?: Date;
  };
  eradication: {
    rootCause: string;
    steps: string[];
    completed: boolean;
    completedAt?: Date;
  };
  recovery: {
    plan: string;
    steps: string[];
    progress: number;
    restoredAt?: Date;
  };
  communications: Communication[];
  postIncident?: {
    lessonsLearned: string[];
    recommendations: string[];
    preventiveMeasures: string[];
    reviewMeetingAt?: Date;
    reportUrl?: string;
  };
  relatedIncidents: string[];
  tags: string[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    resolvedAt?: Date;
    closedAt?: Date;
  };
}

// Timeline entry
interface TimelineEntry {
  id: string;
  timestamp: Date;
  type: 'status_change' | 'action_taken' | 'discovery' | 'communication' | 'escalation' | 'note';
  description: string;
  actor: string;
  details?: Record<string, unknown>;
}

// Team member
interface TeamMember {
  id: string;
  name: string;
  role: 'lead' | 'analyst' | 'responder' | 'specialist' | 'communicator';
  assignedAt: Date;
  status: 'active' | 'standby' | 'completed';
}

// Artifact
interface Artifact {
  id: string;
  type: 'log' | 'screenshot' | 'memory_dump' | 'network_capture' | 'malware_sample' | 'document' | 'ioc' | 'other';
  name: string;
  description: string;
  hash?: string;
  size?: number;
  collectedAt: Date;
  collectedBy: string;
  preservedAt?: string;
  analysis?: string;
  url?: string;
}

// Response action
interface ResponseAction {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  priority: number;
  assignee: string;
  dueAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  outcome?: string;
  blockedReason?: string;
}

// Communication
interface Communication {
  id: string;
  type: 'internal' | 'external' | 'regulatory' | 'media' | 'customer';
  channel: 'email' | 'phone' | 'meeting' | 'portal' | 'social' | 'press';
  recipients: string[];
  subject: string;
  content: string;
  sentAt: Date;
  sentBy: string;
  status: 'draft' | 'sent' | 'acknowledged';
  attachments?: string[];
}

// Playbook
interface Playbook {
  id: string;
  name: string;
  description: string;
  incidentTypes: IncidentType[];
  severity: IncidentSeverity[];
  isActive: boolean;
  version: string;
  phases: PlaybookPhase[];
  escalationMatrix: EscalationRule[];
  communicationTemplate: {
    internal?: string;
    external?: string;
    regulatory?: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    lastUsed?: Date;
    usageCount: number;
  };
}

// Playbook phase
interface PlaybookPhase {
  id: string;
  name: string;
  order: number;
  description: string;
  tasks: PlaybookTask[];
  duration: number;
  autoAdvance: boolean;
  completionCriteria: string[];
}

// Playbook task
interface PlaybookTask {
  id: string;
  name: string;
  description: string;
  type: ActionType;
  required: boolean;
  order: number;
  assignTo: 'lead' | 'analyst' | 'responder' | 'specialist' | 'any';
  instructions: string[];
  tools?: string[];
  outputs?: string[];
  automated?: {
    enabled: boolean;
    script?: string;
    parameters?: Record<string, unknown>;
  };
}

// Escalation rule
interface EscalationRule {
  id: string;
  name: string;
  conditions: {
    severity?: IncidentSeverity[];
    duration?: number;
    status?: IncidentStatus[];
    unresponsive?: boolean;
  };
  escalateTo: string;
  notificationMethod: 'email' | 'sms' | 'call' | 'all';
  message: string;
  autoEscalate: boolean;
}

// IOC (Indicator of Compromise)
interface IOC {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'filename' | 'registry' | 'mutex' | 'other';
  value: string;
  description: string;
  severity: IncidentSeverity;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  firstSeen: Date;
  lastSeen: Date;
  relatedIncidents: string[];
  tags: string[];
  isActive: boolean;
  expiresAt?: Date;
}

// Incident metrics
interface IncidentMetrics {
  total: number;
  bySeverity: Record<IncidentSeverity, number>;
  byStatus: Record<IncidentStatus, number>;
  byType: Record<string, number>;
  mttr: number;
  mttd: number;
  mttc: number;
  openIncidents: number;
  resolvedThisWeek: number;
  trends: { date: string; count: number; severity: IncidentSeverity }[];
  topSources: { source: string; count: number }[];
  teamPerformance: { member: string; resolved: number; avgTime: number }[];
}

// On-call schedule
interface OnCallSchedule {
  id: string;
  name: string;
  team: string;
  rotationType: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  members: {
    userId: string;
    name: string;
    order: number;
    phone: string;
    email: string;
  }[];
  currentOnCall: string;
  nextRotation: Date;
  overrides: {
    userId: string;
    start: Date;
    end: Date;
    reason: string;
  }[];
  isActive: boolean;
}

class IncidentResponseService {
  private static instance: IncidentResponseService;
  private incidents: Map<string, Incident> = new Map();
  private playbooks: Map<string, Playbook> = new Map();
  private iocs: Map<string, IOC> = new Map();
  private schedules: Map<string, OnCallSchedule> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): IncidentResponseService {
    if (!IncidentResponseService.instance) {
      IncidentResponseService.instance = new IncidentResponseService();
    }
    return IncidentResponseService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize playbooks
    const playbooksData = [
      {
        name: 'Data Breach Response',
        description: 'Standard playbook for data breach incidents',
        incidentTypes: ['security_breach', 'data_leak', 'unauthorized_access'],
        severity: ['critical', 'high'],
      },
      {
        name: 'DDoS Attack Response',
        description: 'Playbook for distributed denial of service attacks',
        incidentTypes: ['ddos', 'service_disruption'],
        severity: ['critical', 'high', 'medium'],
      },
      {
        name: 'Malware Incident',
        description: 'Response procedures for malware infections',
        incidentTypes: ['malware', 'phishing'],
        severity: ['high', 'medium'],
      },
      {
        name: 'Service Disruption',
        description: 'General service disruption response',
        incidentTypes: ['service_disruption', 'natural_disaster'],
        severity: ['medium', 'low'],
      },
      {
        name: 'Policy Violation',
        description: 'Response for internal policy violations',
        incidentTypes: ['policy_violation', 'human_error'],
        severity: ['low', 'informational'],
      },
    ];

    playbooksData.forEach((p, idx) => {
      const playbook: Playbook = {
        id: `playbook-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: p.description,
        incidentTypes: p.incidentTypes as IncidentType[],
        severity: p.severity as IncidentSeverity[],
        isActive: true,
        version: '1.0',
        phases: [
          {
            id: `phase-${idx}-1`,
            name: 'Detection & Triage',
            order: 1,
            description: 'Initial detection and triage of the incident',
            tasks: [
              {
                id: `task-${idx}-1-1`,
                name: 'Verify Incident',
                description: 'Confirm the incident is genuine',
                type: 'investigate',
                required: true,
                order: 1,
                assignTo: 'analyst',
                instructions: ['Review alerts', 'Check for false positives', 'Gather initial evidence'],
              },
              {
                id: `task-${idx}-1-2`,
                name: 'Assess Severity',
                description: 'Determine incident severity and priority',
                type: 'investigate',
                required: true,
                order: 2,
                assignTo: 'lead',
                instructions: ['Evaluate impact', 'Determine affected systems', 'Assign severity rating'],
              },
            ],
            duration: 30,
            autoAdvance: false,
            completionCriteria: ['Incident verified', 'Severity assigned', 'Team notified'],
          },
          {
            id: `phase-${idx}-2`,
            name: 'Containment',
            order: 2,
            description: 'Contain the incident to prevent further damage',
            tasks: [
              {
                id: `task-${idx}-2-1`,
                name: 'Isolate Affected Systems',
                description: 'Isolate compromised systems from the network',
                type: 'contain',
                required: true,
                order: 1,
                assignTo: 'responder',
                instructions: ['Identify affected systems', 'Apply network isolation', 'Document containment actions'],
              },
              {
                id: `task-${idx}-2-2`,
                name: 'Preserve Evidence',
                description: 'Collect and preserve evidence for analysis',
                type: 'document',
                required: true,
                order: 2,
                assignTo: 'analyst',
                instructions: ['Capture logs', 'Take system snapshots', 'Document timeline'],
              },
            ],
            duration: 60,
            autoAdvance: false,
            completionCriteria: ['Systems isolated', 'Evidence preserved', 'Spread contained'],
          },
          {
            id: `phase-${idx}-3`,
            name: 'Eradication',
            order: 3,
            description: 'Remove the threat and root cause',
            tasks: [
              {
                id: `task-${idx}-3-1`,
                name: 'Identify Root Cause',
                description: 'Determine the root cause of the incident',
                type: 'investigate',
                required: true,
                order: 1,
                assignTo: 'specialist',
                instructions: ['Analyze evidence', 'Identify attack vector', 'Document findings'],
              },
              {
                id: `task-${idx}-3-2`,
                name: 'Remove Threat',
                description: 'Eliminate the threat from all systems',
                type: 'eradicate',
                required: true,
                order: 2,
                assignTo: 'responder',
                instructions: ['Remove malware', 'Patch vulnerabilities', 'Reset credentials'],
              },
            ],
            duration: 120,
            autoAdvance: false,
            completionCriteria: ['Root cause identified', 'Threat removed', 'Vulnerabilities patched'],
          },
          {
            id: `phase-${idx}-4`,
            name: 'Recovery',
            order: 4,
            description: 'Restore systems and services',
            tasks: [
              {
                id: `task-${idx}-4-1`,
                name: 'Restore Systems',
                description: 'Restore affected systems from clean backups',
                type: 'recover',
                required: true,
                order: 1,
                assignTo: 'responder',
                instructions: ['Verify backups', 'Restore systems', 'Test functionality'],
              },
              {
                id: `task-${idx}-4-2`,
                name: 'Monitor for Recurrence',
                description: 'Implement enhanced monitoring',
                type: 'investigate',
                required: true,
                order: 2,
                assignTo: 'analyst',
                instructions: ['Set up alerts', 'Monitor indicators', 'Document observations'],
              },
            ],
            duration: 180,
            autoAdvance: false,
            completionCriteria: ['Systems restored', 'Services verified', 'Monitoring in place'],
          },
          {
            id: `phase-${idx}-5`,
            name: 'Post-Incident',
            order: 5,
            description: 'Review and improve',
            tasks: [
              {
                id: `task-${idx}-5-1`,
                name: 'Conduct Review',
                description: 'Hold post-incident review meeting',
                type: 'document',
                required: true,
                order: 1,
                assignTo: 'lead',
                instructions: ['Schedule review', 'Gather participants', 'Facilitate discussion'],
              },
              {
                id: `task-${idx}-5-2`,
                name: 'Document Lessons',
                description: 'Document lessons learned and improvements',
                type: 'document',
                required: true,
                order: 2,
                assignTo: 'lead',
                instructions: ['Compile report', 'Identify improvements', 'Update procedures'],
              },
            ],
            duration: 60,
            autoAdvance: false,
            completionCriteria: ['Review completed', 'Report generated', 'Improvements documented'],
          },
        ],
        escalationMatrix: [
          {
            id: `esc-${idx}-1`,
            name: 'Critical Escalation',
            conditions: { severity: ['critical'], duration: 15 },
            escalateTo: 'ciso',
            notificationMethod: 'call',
            message: 'Critical incident requires immediate attention',
            autoEscalate: true,
          },
          {
            id: `esc-${idx}-2`,
            name: 'High Escalation',
            conditions: { severity: ['high'], duration: 30 },
            escalateTo: 'security-manager',
            notificationMethod: 'sms',
            message: 'High severity incident requires attention',
            autoEscalate: true,
          },
        ],
        communicationTemplate: {
          internal: 'An incident has been detected. The security team is investigating.',
          external: 'We are aware of an issue and are working to resolve it.',
          regulatory: 'Formal notification of security incident as required by regulations.',
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'security-team',
          updatedAt: new Date(),
          usageCount: Math.floor(Math.random() * 20),
        },
      };
      this.playbooks.set(playbook.id, playbook);
    });

    // Initialize incidents
    const incidentsData = [
      {
        title: 'Suspicious Login Activity Detected',
        type: 'unauthorized_access',
        category: 'confidentiality',
        severity: 'high',
        status: 'investigating',
      },
      {
        title: 'DDoS Attack on Main API',
        type: 'ddos',
        category: 'availability',
        severity: 'critical',
        status: 'containing',
      },
      {
        title: 'Phishing Email Campaign Reported',
        type: 'phishing',
        category: 'confidentiality',
        severity: 'medium',
        status: 'resolved',
      },
      {
        title: 'Database Misconfiguration Found',
        type: 'human_error',
        category: 'integrity',
        severity: 'medium',
        status: 'eradicating',
      },
      {
        title: 'Unauthorized API Access Attempt',
        type: 'unauthorized_access',
        category: 'confidentiality',
        severity: 'low',
        status: 'closed',
      },
      {
        title: 'Service Outage Due to Infrastructure Issue',
        type: 'service_disruption',
        category: 'availability',
        severity: 'high',
        status: 'recovering',
      },
    ];

    incidentsData.forEach((inc, idx) => {
      const incident: Incident = {
        id: `incident-${(idx + 1).toString().padStart(4, '0')}`,
        title: inc.title,
        description: `Detailed description of ${inc.title}`,
        type: inc.type as IncidentType,
        category: inc.category as IncidentCategory,
        severity: inc.severity as IncidentSeverity,
        status: inc.status as IncidentStatus,
        priority: ['critical', 'high'].includes(inc.severity) ? 1 : 2,
        source: {
          type: ['automated', 'manual', 'external'][idx % 3] as Incident['source']['type'],
          system: 'Rescue Ping Platform',
          reporter: idx % 2 === 0 ? `user-${idx}` : undefined,
        },
        detection: {
          detectedAt: new Date(Date.now() - (idx + 1) * 24 * 60 * 60 * 1000),
          method: ['SIEM Alert', 'User Report', 'Automated Scan'][idx % 3],
          indicators: ['Unusual traffic pattern', 'Failed login attempts', 'Suspicious IP'],
        },
        impact: {
          systems: ['Alert Service', 'User Database', 'API Gateway'].slice(0, idx % 3 + 1),
          data: ['User credentials', 'Location data'].slice(0, idx % 2 + 1),
          users: Math.floor(Math.random() * 10000),
          reputational: ['none', 'low', 'medium', 'high'][idx % 4] as Incident['impact']['reputational'],
          operational: ['none', 'low', 'medium', 'high'][idx % 4] as Incident['impact']['operational'],
          description: `Impact assessment for ${inc.title}`,
        },
        timeline: [
          {
            id: `tl-${idx}-1`,
            timestamp: new Date(Date.now() - (idx + 1) * 24 * 60 * 60 * 1000),
            type: 'discovery',
            description: 'Incident detected',
            actor: 'system',
          },
          {
            id: `tl-${idx}-2`,
            timestamp: new Date(Date.now() - idx * 24 * 60 * 60 * 1000),
            type: 'status_change',
            description: `Status changed to ${inc.status}`,
            actor: 'responder-1',
          },
        ],
        team: {
          lead: 'security-lead',
          members: [
            { id: 'member-1', name: 'Security Analyst', role: 'analyst', assignedAt: new Date(), status: 'active' },
            { id: 'member-2', name: 'Incident Responder', role: 'responder', assignedAt: new Date(), status: 'active' },
          ],
        },
        artifacts: [
          {
            id: `art-${idx}-1`,
            type: 'log',
            name: 'System Logs',
            description: 'Collected system logs from affected servers',
            collectedAt: new Date(),
            collectedBy: 'analyst-1',
          },
        ],
        actions: [
          {
            id: `action-${idx}-1`,
            type: 'investigate',
            title: 'Initial Investigation',
            description: 'Conduct initial investigation',
            status: 'completed',
            priority: 1,
            assignee: 'analyst-1',
            completedAt: new Date(),
          },
          {
            id: `action-${idx}-2`,
            type: 'contain',
            title: 'Implement Containment',
            description: 'Implement containment measures',
            status: inc.status === 'investigating' ? 'pending' : 'completed',
            priority: 1,
            assignee: 'responder-1',
          },
        ],
        containment: {
          strategy: 'Network isolation and credential rotation',
          implemented: ['containing', 'eradicating', 'recovering', 'resolved', 'closed'].includes(inc.status),
          measures: ['Isolated affected systems', 'Blocked suspicious IPs', 'Revoked compromised tokens'],
        },
        eradication: {
          rootCause: 'Vulnerability in authentication module',
          steps: ['Patch vulnerability', 'Reset credentials', 'Update firewall rules'],
          completed: ['eradicating', 'recovering', 'resolved', 'closed'].includes(inc.status),
        },
        recovery: {
          plan: 'Restore services from clean state',
          steps: ['Verify system integrity', 'Restore from backup', 'Validate functionality'],
          progress: ['resolved', 'closed'].includes(inc.status) ? 100 : Math.floor(Math.random() * 80),
        },
        communications: [
          {
            id: `comm-${idx}-1`,
            type: 'internal',
            channel: 'email',
            recipients: ['security-team', 'management'],
            subject: `Incident Alert: ${inc.title}`,
            content: 'An incident has been detected and is being investigated.',
            sentAt: new Date(),
            sentBy: 'security-lead',
            status: 'sent',
          },
        ],
        postIncident: ['resolved', 'closed'].includes(inc.status) ? {
          lessonsLearned: ['Improve monitoring coverage', 'Update access controls'],
          recommendations: ['Implement MFA', 'Enhance logging'],
          preventiveMeasures: ['Security awareness training', 'Automated scanning'],
        } : undefined,
        relatedIncidents: [],
        tags: ['security', inc.type],
        metadata: {
          createdAt: new Date(Date.now() - (idx + 2) * 24 * 60 * 60 * 1000),
          createdBy: 'system',
          updatedAt: new Date(),
          updatedBy: 'security-lead',
          resolvedAt: inc.status === 'resolved' || inc.status === 'closed' ? new Date() : undefined,
          closedAt: inc.status === 'closed' ? new Date() : undefined,
        },
      };
      this.incidents.set(incident.id, incident);
    });

    // Initialize IOCs
    const iocsData = [
      { type: 'ip', value: '192.168.1.100', description: 'Suspicious source IP' },
      { type: 'domain', value: 'malicious-domain.com', description: 'Known malware C2' },
      { type: 'hash', value: 'a1b2c3d4e5f6...', description: 'Malware file hash' },
      { type: 'email', value: 'phishing@attacker.com', description: 'Phishing sender' },
      { type: 'url', value: 'http://evil.com/payload', description: 'Malware distribution' },
    ];

    iocsData.forEach((ioc, idx) => {
      const indicator: IOC = {
        id: `ioc-${(idx + 1).toString().padStart(4, '0')}`,
        type: ioc.type as IOC['type'],
        value: ioc.value,
        description: ioc.description,
        severity: ['high', 'critical', 'medium'][idx % 3] as IncidentSeverity,
        confidence: ['high', 'medium', 'low'][idx % 3] as IOC['confidence'],
        source: 'Internal Detection',
        firstSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        lastSeen: new Date(),
        relatedIncidents: [`incident-000${idx + 1}`],
        tags: ['malware', 'external'],
        isActive: true,
      };
      this.iocs.set(indicator.id, indicator);
    });

    // Initialize on-call schedule
    const schedule: OnCallSchedule = {
      id: 'schedule-0001',
      name: 'Security Response Team',
      team: 'security',
      rotationType: 'weekly',
      members: [
        { userId: 'user-1', name: 'Security Analyst 1', order: 1, phone: '+91XXXXXXXXXX', email: 'analyst1@rescueping.com' },
        { userId: 'user-2', name: 'Security Analyst 2', order: 2, phone: '+91XXXXXXXXXX', email: 'analyst2@rescueping.com' },
        { userId: 'user-3', name: 'Security Lead', order: 3, phone: '+91XXXXXXXXXX', email: 'lead@rescueping.com' },
      ],
      currentOnCall: 'user-1',
      nextRotation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      overrides: [],
      isActive: true,
    };
    this.schedules.set(schedule.id, schedule);
  }

  /**
   * Get incidents
   */
  public getIncidents(filter?: {
    status?: IncidentStatus[];
    severity?: IncidentSeverity[];
    type?: IncidentType[];
  }): Incident[] {
    let incidents = Array.from(this.incidents.values());

    if (filter?.status?.length) incidents = incidents.filter((i) => filter.status!.includes(i.status));
    if (filter?.severity?.length) incidents = incidents.filter((i) => filter.severity!.includes(i.severity));
    if (filter?.type?.length) incidents = incidents.filter((i) => filter.type!.includes(i.type));

    return incidents.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return b.detection.detectedAt.getTime() - a.detection.detectedAt.getTime();
    });
  }

  /**
   * Get incident
   */
  public getIncident(id: string): Incident | undefined {
    return this.incidents.get(id);
  }

  /**
   * Create incident
   */
  public createIncident(data: {
    title: string;
    description: string;
    type: IncidentType;
    category: IncidentCategory;
    severity: IncidentSeverity;
    source: Incident['source'];
    impact: Partial<Incident['impact']>;
    reporter: string;
  }): Incident {
    const id = `incident-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const incident: Incident = {
      id,
      title: data.title,
      description: data.description,
      type: data.type,
      category: data.category,
      severity: data.severity,
      status: 'new',
      priority: data.severity === 'critical' ? 1 : data.severity === 'high' ? 2 : 3,
      source: data.source,
      detection: {
        detectedAt: new Date(),
        method: data.source.type === 'automated' ? 'Automated Detection' : 'Manual Report',
        indicators: [],
      },
      impact: {
        systems: data.impact.systems || [],
        data: data.impact.data || [],
        users: data.impact.users || 0,
        reputational: data.impact.reputational || 'none',
        operational: data.impact.operational || 'none',
        description: data.impact.description || '',
      },
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date(),
          type: 'discovery',
          description: 'Incident created',
          actor: data.reporter,
        },
      ],
      team: { lead: '', members: [] },
      artifacts: [],
      actions: [],
      containment: { strategy: '', implemented: false, measures: [] },
      eradication: { rootCause: '', steps: [], completed: false },
      recovery: { plan: '', steps: [], progress: 0 },
      communications: [],
      relatedIncidents: [],
      tags: [],
      metadata: {
        createdAt: new Date(),
        createdBy: data.reporter,
        updatedAt: new Date(),
        updatedBy: data.reporter,
      },
    };

    this.incidents.set(id, incident);
    this.emit('incident_created', incident);

    // Auto-assign playbook
    this.autoAssignPlaybook(incident);

    return incident;
  }

  /**
   * Update incident status
   */
  public updateStatus(id: string, status: IncidentStatus, actor: string, notes?: string): Incident {
    const incident = this.incidents.get(id);
    if (!incident) throw new Error('Incident not found');

    const oldStatus = incident.status;
    incident.status = status;
    incident.metadata.updatedAt = new Date();
    incident.metadata.updatedBy = actor;

    if (status === 'resolved') incident.metadata.resolvedAt = new Date();
    if (status === 'closed') incident.metadata.closedAt = new Date();

    incident.timeline.push({
      id: `tl-${Date.now()}`,
      timestamp: new Date(),
      type: 'status_change',
      description: `Status changed from ${oldStatus} to ${status}${notes ? `: ${notes}` : ''}`,
      actor,
    });

    this.emit('incident_status_changed', { incident, oldStatus, newStatus: status });

    return incident;
  }

  /**
   * Add timeline entry
   */
  public addTimelineEntry(
    incidentId: string,
    entry: Omit<TimelineEntry, 'id' | 'timestamp'>
  ): TimelineEntry {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error('Incident not found');

    const timelineEntry: TimelineEntry = {
      ...entry,
      id: `tl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date(),
    };

    incident.timeline.push(timelineEntry);
    incident.metadata.updatedAt = new Date();

    return timelineEntry;
  }

  /**
   * Add response action
   */
  public addAction(incidentId: string, action: Omit<ResponseAction, 'id'>): ResponseAction {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error('Incident not found');

    const responseAction: ResponseAction = {
      ...action,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    };

    incident.actions.push(responseAction);
    incident.metadata.updatedAt = new Date();

    this.emit('action_added', { incidentId, action: responseAction });

    return responseAction;
  }

  /**
   * Auto-assign playbook
   */
  private autoAssignPlaybook(incident: Incident): void {
    const matchingPlaybook = Array.from(this.playbooks.values()).find(
      (p) => p.isActive &&
        p.incidentTypes.includes(incident.type) &&
        p.severity.includes(incident.severity)
    );

    if (matchingPlaybook) {
      // Create actions from playbook tasks
      const firstPhase = matchingPlaybook.phases[0];
      if (firstPhase) {
        firstPhase.tasks.forEach((task) => {
          this.addAction(incident.id, {
            type: task.type,
            title: task.name,
            description: task.description,
            status: 'pending',
            priority: task.order,
            assignee: '',
          });
        });
      }

      this.emit('playbook_assigned', { incidentId: incident.id, playbookId: matchingPlaybook.id });
    }
  }

  /**
   * Get playbooks
   */
  public getPlaybooks(): Playbook[] {
    return Array.from(this.playbooks.values());
  }

  /**
   * Get playbook
   */
  public getPlaybook(id: string): Playbook | undefined {
    return this.playbooks.get(id);
  }

  /**
   * Get IOCs
   */
  public getIOCs(filter?: { type?: IOC['type']; active?: boolean }): IOC[] {
    let iocs = Array.from(this.iocs.values());

    if (filter?.type) iocs = iocs.filter((i) => i.type === filter.type);
    if (filter?.active !== undefined) iocs = iocs.filter((i) => i.isActive === filter.active);

    return iocs;
  }

  /**
   * Add IOC
   */
  public addIOC(data: Omit<IOC, 'id' | 'firstSeen' | 'lastSeen'>): IOC {
    const ioc: IOC = {
      ...data,
      id: `ioc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      firstSeen: new Date(),
      lastSeen: new Date(),
    };

    this.iocs.set(ioc.id, ioc);
    this.emit('ioc_added', ioc);

    return ioc;
  }

  /**
   * Get metrics
   */
  public getMetrics(): IncidentMetrics {
    const incidents = Array.from(this.incidents.values());

    const bySeverity = { critical: 0, high: 0, medium: 0, low: 0, informational: 0 };
    const byStatus: Record<IncidentStatus, number> = {
      new: 0, triaging: 0, investigating: 0, containing: 0,
      eradicating: 0, recovering: 0, resolved: 0, closed: 0,
    };
    const byType: Record<string, number> = {};

    let totalDetectionTime = 0;
    let totalContainmentTime = 0;
    let totalRecoveryTime = 0;
    let resolvedCount = 0;

    incidents.forEach((i) => {
      bySeverity[i.severity]++;
      byStatus[i.status]++;
      byType[i.type] = (byType[i.type] || 0) + 1;

      if (i.metadata.resolvedAt) {
        resolvedCount++;
        totalRecoveryTime += i.metadata.resolvedAt.getTime() - i.detection.detectedAt.getTime();
      }
    });

    const openIncidents = incidents.filter((i) =>
      !['resolved', 'closed'].includes(i.status)
    ).length;

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const resolvedThisWeek = incidents.filter((i) =>
      i.metadata.resolvedAt && i.metadata.resolvedAt >= weekAgo
    ).length;

    return {
      total: incidents.length,
      bySeverity,
      byStatus,
      byType,
      mttr: resolvedCount > 0 ? totalRecoveryTime / resolvedCount / (60 * 60 * 1000) : 0,
      mttd: 0.5,
      mttc: 2,
      openIncidents,
      resolvedThisWeek,
      trends: [],
      topSources: [
        { source: 'Automated Detection', count: 15 },
        { source: 'User Report', count: 8 },
        { source: 'External', count: 3 },
      ],
      teamPerformance: [],
    };
  }

  /**
   * Get on-call schedule
   */
  public getOnCallSchedule(): OnCallSchedule | undefined {
    return Array.from(this.schedules.values())[0];
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

export const incidentResponseService = IncidentResponseService.getInstance();
export type {
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  IncidentCategory,
  ActionType,
  Incident,
  TimelineEntry,
  TeamMember,
  Artifact,
  ResponseAction,
  Communication,
  Playbook,
  PlaybookPhase,
  PlaybookTask,
  EscalationRule,
  IOC,
  IncidentMetrics,
  OnCallSchedule,
};
