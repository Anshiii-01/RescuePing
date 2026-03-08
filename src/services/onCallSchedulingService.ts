/**
 * On-Call Scheduling Service
 * Comprehensive on-call rotation management, scheduling, and coverage tracking
 */

// Schedule status
type ScheduleStatus = 'active' | 'inactive' | 'draft' | 'archived';

// Rotation type
type RotationType = 'daily' | 'weekly' | 'bi_weekly' | 'monthly' | 'custom';

// Shift type
type ShiftType = 'primary' | 'secondary' | 'backup' | 'shadow';

// Override status
type OverrideStatus = 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';

// Handoff status
type HandoffStatus = 'pending' | 'acknowledged' | 'completed' | 'missed';

// User status
type UserOnCallStatus = 'on_call' | 'available' | 'unavailable' | 'vacation' | 'sick_leave';

// Schedule
interface OnCallScheduleDefinition {
  id: string;
  name: string;
  description: string;
  status: ScheduleStatus;
  teamId: string;
  teamName: string;
  timezone: string;
  coverage: {
    type: '24x7' | 'business_hours' | 'custom';
    businessHours?: {
      start: string;
      end: string;
      days: number[];
    };
    customWindows?: {
      id: string;
      name: string;
      start: string;
      end: string;
      days: number[];
    }[];
  };
  rotations: Rotation[];
  layers: ScheduleLayer[];
  finalSchedule: ScheduleEntry[];
  escalationPolicyId?: string;
  notifications: {
    beforeShift: number;
    onHandoff: boolean;
    onOverride: boolean;
    channels: string[];
  };
  statistics: {
    totalRotations: number;
    activeParticipants: number;
    coveragePercentage: number;
    avgShiftLength: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    version: number;
  };
}

// Rotation
interface Rotation {
  id: string;
  scheduleId: string;
  name: string;
  type: RotationType;
  shiftType: ShiftType;
  status: 'active' | 'inactive';
  participants: RotationParticipant[];
  config: {
    shiftLength: number;
    shiftUnit: 'hours' | 'days' | 'weeks';
    handoffTime: string;
    handoffDay?: number;
    startDate: Date;
    endDate?: Date;
  };
  restrictions: {
    type: 'time_of_day' | 'day_of_week';
    startTime?: string;
    endTime?: string;
    days?: number[];
  }[];
  currentIndex: number;
  statistics: {
    totalShifts: number;
    completedShifts: number;
    missedHandoffs: number;
    avgResponseTime: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Rotation Participant
interface RotationParticipant {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone?: string;
  order: number;
  status: 'active' | 'inactive' | 'temporary_out';
  role: 'regular' | 'lead' | 'backup';
  preferences: {
    preferredDays?: number[];
    preferredShifts?: string[];
    maxShiftsPerWeek?: number;
    maxConsecutiveDays?: number;
  };
  restrictions: {
    startDate?: Date;
    endDate?: Date;
    excludeDays?: number[];
    excludeDates?: Date[];
  };
  statistics: {
    totalShifts: number;
    hoursOnCall: number;
    incidents: number;
    avgResponseTime: number;
  };
  joinedAt: Date;
}

// Schedule Layer
interface ScheduleLayer {
  id: string;
  scheduleId: string;
  name: string;
  priority: number;
  rotationId: string;
  restrictions: {
    startTime: string;
    endTime: string;
    days: number[];
  }[];
  overridesAllowed: boolean;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Schedule Entry
interface ScheduleEntry {
  id: string;
  scheduleId: string;
  rotationId: string;
  layerId?: string;
  userId: string;
  userName: string;
  start: Date;
  end: Date;
  shiftType: ShiftType;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  source: 'rotation' | 'override' | 'manual';
  overrideId?: string;
  notes?: string;
  incidents: {
    incidentId: string;
    timestamp: Date;
    acknowledged: boolean;
  }[];
  handoff: {
    status: HandoffStatus;
    fromUserId?: string;
    toUserId?: string;
    timestamp?: Date;
    notes?: string;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Override Request
interface OverrideRequest {
  id: string;
  scheduleId: string;
  type: 'swap' | 'takeover' | 'temporary' | 'vacation';
  status: OverrideStatus;
  requester: {
    userId: string;
    userName: string;
    reason: string;
  };
  originalAssignment: {
    userId: string;
    userName: string;
    start: Date;
    end: Date;
  };
  newAssignment: {
    userId: string;
    userName: string;
    start: Date;
    end: Date;
  };
  approval: {
    required: boolean;
    approvers: string[];
    approvedBy?: string;
    approvedAt?: Date;
    rejectedBy?: string;
    rejectedAt?: Date;
    comments?: string;
  };
  compensation?: {
    type: 'time_off' | 'swap_back' | 'payment' | 'none';
    details?: string;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
  };
}

// User Availability
interface UserAvailability {
  id: string;
  userId: string;
  userName: string;
  status: UserOnCallStatus;
  currentShift?: {
    scheduleId: string;
    scheduleName: string;
    start: Date;
    end: Date;
    shiftType: ShiftType;
  };
  upcomingShifts: {
    scheduleId: string;
    scheduleName: string;
    start: Date;
    end: Date;
    shiftType: ShiftType;
  }[];
  timeOff: {
    id: string;
    type: 'vacation' | 'sick_leave' | 'personal' | 'other';
    start: Date;
    end: Date;
    reason?: string;
    approved: boolean;
  }[];
  preferences: {
    timezone: string;
    workingHours: {
      day: number;
      start: string;
      end: string;
    }[];
    notificationPreferences: {
      channel: string;
      enabled: boolean;
      leadTime: number;
    }[];
  };
  statistics: {
    totalHoursThisMonth: number;
    totalHoursThisYear: number;
    incidentsHandled: number;
    avgResponseTime: number;
  };
}

// Gap Analysis
interface CoverageGap {
  id: string;
  scheduleId: string;
  scheduleName: string;
  start: Date;
  end: Date;
  duration: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reason: 'no_assignment' | 'all_unavailable' | 'timezone_gap' | 'holiday';
  suggestedFixes: {
    type: 'assign_user' | 'extend_shift' | 'create_override';
    userId?: string;
    userName?: string;
    details: string;
  }[];
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

// Handoff Record
interface HandoffRecord {
  id: string;
  scheduleId: string;
  timestamp: Date;
  status: HandoffStatus;
  outgoing: {
    userId: string;
    userName: string;
    shiftEnd: Date;
  };
  incoming: {
    userId: string;
    userName: string;
    shiftStart: Date;
  };
  summary: {
    activeIncidents: number;
    pendingTasks: string[];
    notes: string;
  };
  acknowledgment: {
    acknowledgedAt?: Date;
    acknowledgedBy?: string;
    comments?: string;
  };
  metrics: {
    handoffDelay: number;
    incidentsTransferred: number;
  };
}

// Schedule Report
interface ScheduleReport {
  id: string;
  scheduleId: string;
  scheduleName: string;
  type: 'daily' | 'weekly' | 'monthly';
  period: {
    start: Date;
    end: Date;
  };
  coverage: {
    totalHours: number;
    coveredHours: number;
    coveragePercentage: number;
    gaps: number;
  };
  participants: {
    userId: string;
    userName: string;
    hoursOnCall: number;
    incidents: number;
    avgResponseTime: number;
  }[];
  incidents: {
    total: number;
    acknowledged: number;
    avgTimeToAcknowledge: number;
    byPriority: { priority: string; count: number }[];
  };
  overrides: {
    total: number;
    approved: number;
    rejected: number;
    byType: { type: string; count: number }[];
  };
  fairness: {
    score: number;
    distribution: { userId: string; userName: string; percentage: number }[];
    recommendations: string[];
  };
  metadata: {
    generatedAt: Date;
    generatedBy: string;
  };
}

// Holiday
interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: 'national' | 'regional' | 'company' | 'religious';
  recurring: boolean;
  regions: string[];
  impact: {
    scheduleIds: string[];
    adjustments: 'normal' | 'reduced' | 'skeleton' | 'closed';
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
  };
}

// Schedule Statistics
interface ScheduleStatistics {
  overview: {
    totalSchedules: number;
    activeSchedules: number;
    totalParticipants: number;
    activeOnCall: number;
    coverageGaps: number;
  };
  coverage: {
    overall: number;
    bySchedule: {
      scheduleId: string;
      scheduleName: string;
      coverage: number;
    }[];
  };
  workload: {
    totalHours: number;
    avgHoursPerPerson: number;
    distribution: {
      userId: string;
      userName: string;
      hours: number;
      percentage: number;
    }[];
  };
  overrides: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  handoffs: {
    total: number;
    onTime: number;
    late: number;
    missed: number;
  };
  trends: {
    timestamp: string;
    coverage: number;
    incidents: number;
    avgResponseTime: number;
  }[];
}

class OnCallSchedulingService {
  private static instance: OnCallSchedulingService;
  private schedules: Map<string, OnCallScheduleDefinition> = new Map();
  private rotations: Map<string, Rotation> = new Map();
  private entries: Map<string, ScheduleEntry> = new Map();
  private overrides: Map<string, OverrideRequest> = new Map();
  private availability: Map<string, UserAvailability> = new Map();
  private gaps: Map<string, CoverageGap> = new Map();
  private handoffs: Map<string, HandoffRecord> = new Map();
  private reports: Map<string, ScheduleReport> = new Map();
  private holidays: Map<string, Holiday> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): OnCallSchedulingService {
    if (!OnCallSchedulingService.instance) {
      OnCallSchedulingService.instance = new OnCallSchedulingService();
    }
    return OnCallSchedulingService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Users for Availability
    const usersData = [
      { name: 'John Smith', email: 'john.smith@rescueping.com', team: 'Platform' },
      { name: 'Sarah Johnson', email: 'sarah.johnson@rescueping.com', team: 'Platform' },
      { name: 'Mike Chen', email: 'mike.chen@rescueping.com', team: 'Infrastructure' },
      { name: 'Emily Davis', email: 'emily.davis@rescueping.com', team: 'Platform' },
      { name: 'Alex Wilson', email: 'alex.wilson@rescueping.com', team: 'Infrastructure' },
      { name: 'Lisa Brown', email: 'lisa.brown@rescueping.com', team: 'Platform' },
      { name: 'David Lee', email: 'david.lee@rescueping.com', team: 'Infrastructure' },
      { name: 'Amanda Taylor', email: 'amanda.taylor@rescueping.com', team: 'Platform' },
    ];

    usersData.forEach((u, idx) => {
      const userId = `user-${(idx + 1).toString().padStart(4, '0')}`;
      const isOnCall = idx === 0;

      const userAvailability: UserAvailability = {
        id: `avail-${(idx + 1).toString().padStart(4, '0')}`,
        userId,
        userName: u.name,
        status: isOnCall ? 'on_call' : idx < 4 ? 'available' : 'unavailable',
        currentShift: isOnCall ? {
          scheduleId: 'sched-0001',
          scheduleName: 'Platform On-Call',
          start: new Date(Date.now() - 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          shiftType: 'primary',
        } : undefined,
        upcomingShifts: Array.from({ length: 3 }, (_, i) => ({
          scheduleId: 'sched-0001',
          scheduleName: 'Platform On-Call',
          start: new Date(Date.now() + ((idx + i) * 7 + 7) * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + ((idx + i) * 7 + 14) * 24 * 60 * 60 * 1000),
          shiftType: 'primary' as ShiftType,
        })),
        timeOff: idx === 5 ? [{
          id: `pto-${idx}`,
          type: 'vacation',
          start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          reason: 'Family vacation',
          approved: true,
        }] : [],
        preferences: {
          timezone: 'America/New_York',
          workingHours: [
            { day: 1, start: '09:00', end: '17:00' },
            { day: 2, start: '09:00', end: '17:00' },
            { day: 3, start: '09:00', end: '17:00' },
            { day: 4, start: '09:00', end: '17:00' },
            { day: 5, start: '09:00', end: '17:00' },
          ],
          notificationPreferences: [
            { channel: 'email', enabled: true, leadTime: 60 },
            { channel: 'sms', enabled: true, leadTime: 15 },
            { channel: 'slack', enabled: true, leadTime: 30 },
          ],
        },
        statistics: {
          totalHoursThisMonth: Math.floor(Math.random() * 80) + 40,
          totalHoursThisYear: Math.floor(Math.random() * 800) + 400,
          incidentsHandled: Math.floor(Math.random() * 50) + 10,
          avgResponseTime: Math.floor(Math.random() * 300) + 60,
        },
      };
      this.availability.set(userAvailability.id, userAvailability);
    });

    // Initialize Schedules
    const schedulesData = [
      { name: 'Platform On-Call', team: 'Platform', coverage: '24x7' },
      { name: 'Infrastructure On-Call', team: 'Infrastructure', coverage: '24x7' },
      { name: 'Business Hours Support', team: 'Platform', coverage: 'business_hours' },
    ];

    schedulesData.forEach((s, idx) => {
      const scheduleId = `sched-${(idx + 1).toString().padStart(4, '0')}`;
      const teamUsers = usersData
        .filter((u) => u.team === s.team)
        .map((u, i) => ({
          id: `part-${scheduleId}-${i + 1}`,
          userId: `user-${usersData.indexOf(u) + 1}`.padStart(9, '0').replace('user-000', 'user-'),
          userName: u.name,
          email: u.email,
          order: i + 1,
          status: 'active' as const,
          role: i === 0 ? 'lead' as const : 'regular' as const,
          preferences: {
            maxShiftsPerWeek: 2,
            maxConsecutiveDays: 7,
          },
          restrictions: {},
          statistics: {
            totalShifts: Math.floor(Math.random() * 50) + 10,
            hoursOnCall: Math.floor(Math.random() * 500) + 100,
            incidents: Math.floor(Math.random() * 30) + 5,
            avgResponseTime: Math.floor(Math.random() * 300) + 60,
          },
          joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        }));

      const rotationId = `rot-${scheduleId}-001`;
      const rotation: Rotation = {
        id: rotationId,
        scheduleId,
        name: 'Primary Rotation',
        type: 'weekly',
        shiftType: 'primary',
        status: 'active',
        participants: teamUsers,
        config: {
          shiftLength: 7,
          shiftUnit: 'days',
          handoffTime: '09:00',
          handoffDay: 1,
          startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        },
        restrictions: [],
        currentIndex: 0,
        statistics: {
          totalShifts: Math.floor(Math.random() * 100) + 50,
          completedShifts: Math.floor(Math.random() * 90) + 45,
          missedHandoffs: Math.floor(Math.random() * 5),
          avgResponseTime: Math.floor(Math.random() * 300) + 60,
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.rotations.set(rotationId, rotation);

      const secondaryRotationId = `rot-${scheduleId}-002`;
      const secondaryRotation: Rotation = {
        ...rotation,
        id: secondaryRotationId,
        name: 'Secondary Rotation',
        shiftType: 'secondary',
        participants: [...teamUsers].reverse(),
        currentIndex: 1,
      };
      this.rotations.set(secondaryRotationId, secondaryRotation);

      const schedule: OnCallScheduleDefinition = {
        id: scheduleId,
        name: s.name,
        description: `On-call schedule for ${s.team} team`,
        status: 'active',
        teamId: `team-${(idx + 1).toString().padStart(4, '0')}`,
        teamName: s.team,
        timezone: 'America/New_York',
        coverage: {
          type: s.coverage as OnCallScheduleDefinition['coverage']['type'],
          businessHours: s.coverage === 'business_hours' ? {
            start: '09:00',
            end: '17:00',
            days: [1, 2, 3, 4, 5],
          } : undefined,
        },
        rotations: [rotation, secondaryRotation],
        layers: [
          {
            id: `layer-${scheduleId}-1`,
            scheduleId,
            name: 'Primary Layer',
            priority: 1,
            rotationId,
            restrictions: [],
            overridesAllowed: true,
            metadata: { createdAt: new Date(), updatedAt: new Date() },
          },
          {
            id: `layer-${scheduleId}-2`,
            scheduleId,
            name: 'Secondary Layer',
            priority: 2,
            rotationId: secondaryRotationId,
            restrictions: [],
            overridesAllowed: true,
            metadata: { createdAt: new Date(), updatedAt: new Date() },
          },
        ],
        finalSchedule: [],
        notifications: {
          beforeShift: 60,
          onHandoff: true,
          onOverride: true,
          channels: ['email', 'slack'],
        },
        statistics: {
          totalRotations: 2,
          activeParticipants: teamUsers.length,
          coveragePercentage: 100,
          avgShiftLength: 168,
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          version: 5,
        },
      };

      // Generate schedule entries
      for (let week = -4; week <= 8; week++) {
        const weekStart = new Date(Date.now() + week * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        const participantIndex = (Math.abs(week) + idx) % teamUsers.length;
        const participant = teamUsers[participantIndex];

        const entry: ScheduleEntry = {
          id: `entry-${scheduleId}-${week + 5}`,
          scheduleId,
          rotationId,
          userId: participant.userId,
          userName: participant.userName,
          start: weekStart,
          end: weekEnd,
          shiftType: 'primary',
          status: week < 0 ? 'completed' : week === 0 ? 'active' : 'scheduled',
          source: 'rotation',
          incidents: week < 0 ? Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => ({
            incidentId: `inc-${this.generateId()}`,
            timestamp: new Date(weekStart.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
            acknowledged: true,
          })) : [],
          handoff: {
            status: week < 0 ? 'completed' : week === 0 ? 'acknowledged' : 'pending',
            fromUserId: week > -4 ? teamUsers[(participantIndex + teamUsers.length - 1) % teamUsers.length].userId : undefined,
            toUserId: participant.userId,
            timestamp: week <= 0 ? weekStart : undefined,
          },
          metadata: {
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
          },
        };
        this.entries.set(entry.id, entry);
        schedule.finalSchedule.push(entry);
      }

      this.schedules.set(schedule.id, schedule);
    });

    // Initialize Override Requests
    const overridesData = [
      { type: 'swap', status: 'approved', requester: 'user-0001', original: 'user-0001', new: 'user-0002' },
      { type: 'vacation', status: 'pending', requester: 'user-0003', original: 'user-0003', new: 'user-0004' },
      { type: 'takeover', status: 'completed', requester: 'user-0002', original: 'user-0005', new: 'user-0002' },
    ];

    overridesData.forEach((o, idx) => {
      const override: OverrideRequest = {
        id: `override-${(idx + 1).toString().padStart(4, '0')}`,
        scheduleId: 'sched-0001',
        type: o.type as OverrideRequest['type'],
        status: o.status as OverrideStatus,
        requester: {
          userId: o.requester,
          userName: usersData[parseInt(o.requester.split('-')[1]) - 1]?.name || 'Unknown',
          reason: o.type === 'vacation' ? 'Vacation request' : 'Schedule conflict',
        },
        originalAssignment: {
          userId: o.original,
          userName: usersData[parseInt(o.original.split('-')[1]) - 1]?.name || 'Unknown',
          start: new Date(Date.now() + (idx + 1) * 7 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + (idx + 2) * 7 * 24 * 60 * 60 * 1000),
        },
        newAssignment: {
          userId: o.new,
          userName: usersData[parseInt(o.new.split('-')[1]) - 1]?.name || 'Unknown',
          start: new Date(Date.now() + (idx + 1) * 7 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + (idx + 2) * 7 * 24 * 60 * 60 * 1000),
        },
        approval: {
          required: true,
          approvers: ['manager-0001'],
          approvedBy: o.status === 'approved' || o.status === 'completed' ? 'manager-0001' : undefined,
          approvedAt: o.status === 'approved' || o.status === 'completed' ? new Date(Date.now() - 24 * 60 * 60 * 1000) : undefined,
        },
        compensation: o.type === 'swap' ? {
          type: 'swap_back',
          details: 'Will swap back in 2 weeks',
        } : undefined,
        metadata: {
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
          updatedAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      };
      this.overrides.set(override.id, override);
    });

    // Initialize Coverage Gaps
    for (let i = 0; i < 5; i++) {
      const gap: CoverageGap = {
        id: `gap-${(i + 1).toString().padStart(4, '0')}`,
        scheduleId: `sched-${((i % 3) + 1).toString().padStart(4, '0')}`,
        scheduleName: schedulesData[i % 3].name,
        start: new Date(Date.now() + (i + 1) * 14 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + (i + 1) * 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        duration: 4 * 60 * 60 * 1000,
        severity: ['critical', 'high', 'medium', 'low'][i % 4] as CoverageGap['severity'],
        reason: ['no_assignment', 'all_unavailable', 'timezone_gap', 'holiday'][i % 4] as CoverageGap['reason'],
        suggestedFixes: [
          {
            type: 'assign_user',
            userId: `user-${((i % 4) + 1).toString().padStart(4, '0')}`,
            userName: usersData[i % 4].name,
            details: `Assign ${usersData[i % 4].name} to cover this gap`,
          },
        ],
        resolved: i < 2,
        resolvedBy: i < 2 ? 'admin' : undefined,
        resolvedAt: i < 2 ? new Date(Date.now() - 24 * 60 * 60 * 1000) : undefined,
      };
      this.gaps.set(gap.id, gap);
    }

    // Initialize Handoff Records
    for (let i = 0; i < 20; i++) {
      const handoffTime = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
      const outgoingIdx = i % usersData.length;
      const incomingIdx = (i + 1) % usersData.length;

      const handoff: HandoffRecord = {
        id: `handoff-${(i + 1).toString().padStart(4, '0')}`,
        scheduleId: 'sched-0001',
        timestamp: handoffTime,
        status: i < 18 ? 'completed' : i === 18 ? 'acknowledged' : 'pending',
        outgoing: {
          userId: `user-${(outgoingIdx + 1).toString().padStart(4, '0')}`,
          userName: usersData[outgoingIdx].name,
          shiftEnd: handoffTime,
        },
        incoming: {
          userId: `user-${(incomingIdx + 1).toString().padStart(4, '0')}`,
          userName: usersData[incomingIdx].name,
          shiftStart: handoffTime,
        },
        summary: {
          activeIncidents: Math.floor(Math.random() * 3),
          pendingTasks: ['Monitor deployment', 'Follow up on ticket #123'],
          notes: 'All systems normal',
        },
        acknowledgment: i < 18 ? {
          acknowledgedAt: new Date(handoffTime.getTime() + Math.random() * 30 * 60 * 1000),
          acknowledgedBy: `user-${(incomingIdx + 1).toString().padStart(4, '0')}`,
          comments: 'Acknowledged',
        } : undefined,
        metrics: {
          handoffDelay: Math.floor(Math.random() * 30) * 60 * 1000,
          incidentsTransferred: Math.floor(Math.random() * 3),
        },
      };
      this.handoffs.set(handoff.id, handoff);
    }

    // Initialize Holidays
    const holidaysData = [
      { name: 'New Year\'s Day', date: new Date(2025, 0, 1), type: 'national' },
      { name: 'Memorial Day', date: new Date(2025, 4, 26), type: 'national' },
      { name: 'Independence Day', date: new Date(2025, 6, 4), type: 'national' },
      { name: 'Labor Day', date: new Date(2025, 8, 1), type: 'national' },
      { name: 'Thanksgiving', date: new Date(2025, 10, 27), type: 'national' },
      { name: 'Christmas Day', date: new Date(2025, 11, 25), type: 'national' },
    ];

    holidaysData.forEach((h, idx) => {
      const holiday: Holiday = {
        id: `holiday-${(idx + 1).toString().padStart(4, '0')}`,
        name: h.name,
        date: h.date,
        type: h.type as Holiday['type'],
        recurring: true,
        regions: ['US'],
        impact: {
          scheduleIds: Array.from(this.schedules.keys()),
          adjustments: 'skeleton',
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
        },
      };
      this.holidays.set(holiday.id, holiday);
    });

    // Initialize Reports
    const report: ScheduleReport = {
      id: 'report-0001',
      scheduleId: 'sched-0001',
      scheduleName: 'Platform On-Call',
      type: 'monthly',
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      coverage: {
        totalHours: 720,
        coveredHours: 718,
        coveragePercentage: 99.7,
        gaps: 2,
      },
      participants: usersData.filter((u) => u.team === 'Platform').map((u, i) => ({
        userId: `user-${(usersData.indexOf(u) + 1).toString().padStart(4, '0')}`,
        userName: u.name,
        hoursOnCall: Math.floor(Math.random() * 200) + 100,
        incidents: Math.floor(Math.random() * 20) + 5,
        avgResponseTime: Math.floor(Math.random() * 300) + 60,
      })),
      incidents: {
        total: 45,
        acknowledged: 44,
        avgTimeToAcknowledge: 180,
        byPriority: [
          { priority: 'P1', count: 5 },
          { priority: 'P2', count: 15 },
          { priority: 'P3', count: 20 },
          { priority: 'P4', count: 5 },
        ],
      },
      overrides: {
        total: 8,
        approved: 6,
        rejected: 2,
        byType: [
          { type: 'swap', count: 4 },
          { type: 'vacation', count: 3 },
          { type: 'takeover', count: 1 },
        ],
      },
      fairness: {
        score: 85,
        distribution: usersData.filter((u) => u.team === 'Platform').map((u) => ({
          userId: `user-${(usersData.indexOf(u) + 1).toString().padStart(4, '0')}`,
          userName: u.name,
          percentage: 100 / usersData.filter((user) => user.team === 'Platform').length,
        })),
        recommendations: ['Consider rotating primary/secondary assignments more frequently'],
      },
      metadata: {
        generatedAt: new Date(),
        generatedBy: 'system',
      },
    };
    this.reports.set(report.id, report);
  }

  // Schedule Operations
  public getSchedules(filter?: { status?: ScheduleStatus; teamId?: string }): OnCallScheduleDefinition[] {
    let schedules = Array.from(this.schedules.values());
    if (filter?.status) schedules = schedules.filter((s) => s.status === filter.status);
    if (filter?.teamId) schedules = schedules.filter((s) => s.teamId === filter.teamId);
    return schedules;
  }

  public getScheduleById(id: string): OnCallScheduleDefinition | undefined {
    return this.schedules.get(id);
  }

  public createSchedule(data: Partial<OnCallScheduleDefinition>): OnCallScheduleDefinition {
    const id = `sched-${this.generateId()}`;
    const schedule: OnCallScheduleDefinition = {
      id,
      name: data.name || 'New Schedule',
      description: data.description || '',
      status: 'draft',
      teamId: data.teamId || '',
      teamName: data.teamName || '',
      timezone: data.timezone || 'UTC',
      coverage: data.coverage || { type: '24x7' },
      rotations: [],
      layers: [],
      finalSchedule: [],
      notifications: data.notifications || {
        beforeShift: 60,
        onHandoff: true,
        onOverride: true,
        channels: ['email'],
      },
      statistics: {
        totalRotations: 0,
        activeParticipants: 0,
        coveragePercentage: 0,
        avgShiftLength: 0,
      },
      metadata: {
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
        version: 1,
      },
    };
    this.schedules.set(id, schedule);
    this.emit('schedule_created', schedule);
    return schedule;
  }

  public updateSchedule(id: string, updates: Partial<OnCallScheduleDefinition>): OnCallScheduleDefinition {
    const schedule = this.schedules.get(id);
    if (!schedule) throw new Error('Schedule not found');

    const updated = {
      ...schedule,
      ...updates,
      metadata: {
        ...schedule.metadata,
        updatedAt: new Date(),
        version: schedule.metadata.version + 1,
      },
    };
    this.schedules.set(id, updated);
    this.emit('schedule_updated', updated);
    return updated;
  }

  // Rotation Operations
  public getRotations(scheduleId?: string): Rotation[] {
    let rotations = Array.from(this.rotations.values());
    if (scheduleId) rotations = rotations.filter((r) => r.scheduleId === scheduleId);
    return rotations;
  }

  public getRotationById(id: string): Rotation | undefined {
    return this.rotations.get(id);
  }

  // Entry Operations
  public getEntries(filter?: { scheduleId?: string; userId?: string; status?: ScheduleEntry['status'] }): ScheduleEntry[] {
    let entries = Array.from(this.entries.values());
    if (filter?.scheduleId) entries = entries.filter((e) => e.scheduleId === filter.scheduleId);
    if (filter?.userId) entries = entries.filter((e) => e.userId === filter.userId);
    if (filter?.status) entries = entries.filter((e) => e.status === filter.status);
    return entries.sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  public getCurrentOnCall(scheduleId: string): ScheduleEntry | undefined {
    return Array.from(this.entries.values()).find(
      (e) => e.scheduleId === scheduleId && e.status === 'active'
    );
  }

  // Override Operations
  public getOverrides(filter?: { scheduleId?: string; status?: OverrideStatus }): OverrideRequest[] {
    let overrides = Array.from(this.overrides.values());
    if (filter?.scheduleId) overrides = overrides.filter((o) => o.scheduleId === filter.scheduleId);
    if (filter?.status) overrides = overrides.filter((o) => o.status === filter.status);
    return overrides;
  }

  public createOverride(data: Partial<OverrideRequest>): OverrideRequest {
    const id = `override-${this.generateId()}`;
    const override: OverrideRequest = {
      id,
      scheduleId: data.scheduleId || '',
      type: data.type || 'temporary',
      status: 'pending',
      requester: data.requester || { userId: '', userName: '', reason: '' },
      originalAssignment: data.originalAssignment || { userId: '', userName: '', start: new Date(), end: new Date() },
      newAssignment: data.newAssignment || { userId: '', userName: '', start: new Date(), end: new Date() },
      approval: {
        required: true,
        approvers: ['manager'],
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    this.overrides.set(id, override);
    this.emit('override_created', override);
    return override;
  }

  public approveOverride(id: string, approverId: string): OverrideRequest {
    const override = this.overrides.get(id);
    if (!override) throw new Error('Override not found');

    override.status = 'approved';
    override.approval.approvedBy = approverId;
    override.approval.approvedAt = new Date();
    override.metadata.updatedAt = new Date();

    this.emit('override_approved', override);
    return override;
  }

  public rejectOverride(id: string, rejecterId: string, reason?: string): OverrideRequest {
    const override = this.overrides.get(id);
    if (!override) throw new Error('Override not found');

    override.status = 'cancelled';
    override.approval.rejectedBy = rejecterId;
    override.approval.rejectedAt = new Date();
    override.approval.comments = reason;
    override.metadata.updatedAt = new Date();

    this.emit('override_rejected', override);
    return override;
  }

  // Availability Operations
  public getUserAvailability(userId: string): UserAvailability | undefined {
    return Array.from(this.availability.values()).find((a) => a.userId === userId);
  }

  public getAllAvailability(): UserAvailability[] {
    return Array.from(this.availability.values());
  }

  // Gap Operations
  public getGaps(filter?: { scheduleId?: string; resolved?: boolean }): CoverageGap[] {
    let gaps = Array.from(this.gaps.values());
    if (filter?.scheduleId) gaps = gaps.filter((g) => g.scheduleId === filter.scheduleId);
    if (filter?.resolved !== undefined) gaps = gaps.filter((g) => g.resolved === filter.resolved);
    return gaps;
  }

  // Handoff Operations
  public getHandoffs(scheduleId?: string): HandoffRecord[] {
    let handoffs = Array.from(this.handoffs.values());
    if (scheduleId) handoffs = handoffs.filter((h) => h.scheduleId === scheduleId);
    return handoffs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public acknowledgeHandoff(id: string, userId: string, comments?: string): HandoffRecord {
    const handoff = this.handoffs.get(id);
    if (!handoff) throw new Error('Handoff not found');

    handoff.status = 'acknowledged';
    handoff.acknowledgment = {
      acknowledgedAt: new Date(),
      acknowledgedBy: userId,
      comments,
    };

    this.emit('handoff_acknowledged', handoff);
    return handoff;
  }

  // Report Operations
  public getReports(): ScheduleReport[] {
    return Array.from(this.reports.values());
  }

  // Holiday Operations
  public getHolidays(): Holiday[] {
    return Array.from(this.holidays.values());
  }

  // Statistics
  public getStatistics(): ScheduleStatistics {
    const schedules = Array.from(this.schedules.values());
    const entries = Array.from(this.entries.values());
    const overrides = Array.from(this.overrides.values());
    const handoffs = Array.from(this.handoffs.values());
    const gaps = Array.from(this.gaps.values());

    const activeEntries = entries.filter((e) => e.status === 'active');
    const participants = new Set<string>();
    schedules.forEach((s) => s.rotations.forEach((r) => r.participants.forEach((p) => participants.add(p.userId))));

    return {
      overview: {
        totalSchedules: schedules.length,
        activeSchedules: schedules.filter((s) => s.status === 'active').length,
        totalParticipants: participants.size,
        activeOnCall: activeEntries.length,
        coverageGaps: gaps.filter((g) => !g.resolved).length,
      },
      coverage: {
        overall: schedules.reduce((sum, s) => sum + s.statistics.coveragePercentage, 0) / schedules.length,
        bySchedule: schedules.map((s) => ({
          scheduleId: s.id,
          scheduleName: s.name,
          coverage: s.statistics.coveragePercentage,
        })),
      },
      workload: {
        totalHours: entries.reduce((sum, e) => sum + (e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60), 0),
        avgHoursPerPerson: 0,
        distribution: [],
      },
      overrides: {
        total: overrides.length,
        pending: overrides.filter((o) => o.status === 'pending').length,
        approved: overrides.filter((o) => o.status === 'approved' || o.status === 'completed').length,
        rejected: overrides.filter((o) => o.status === 'cancelled').length,
      },
      handoffs: {
        total: handoffs.length,
        onTime: handoffs.filter((h) => h.status === 'completed' && h.metrics.handoffDelay < 15 * 60 * 1000).length,
        late: handoffs.filter((h) => h.status === 'completed' && h.metrics.handoffDelay >= 15 * 60 * 1000).length,
        missed: handoffs.filter((h) => h.status === 'missed').length,
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

export const onCallSchedulingService = OnCallSchedulingService.getInstance();
export type {
  ScheduleStatus,
  RotationType,
  ShiftType,
  OverrideStatus,
  HandoffStatus,
  UserOnCallStatus,
  OnCallScheduleDefinition,
  Rotation,
  RotationParticipant,
  ScheduleLayer,
  ScheduleEntry,
  OverrideRequest,
  UserAvailability,
  CoverageGap,
  HandoffRecord,
  ScheduleReport,
  Holiday,
  ScheduleStatistics,
};
