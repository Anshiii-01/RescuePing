// @ts-nocheck
/**
 * Crowdsourced Reporting Service - Issue #151 Implementation
 * 
 * Provides comprehensive citizen reporting capabilities for disaster response
 * including incident reports, damage assessments, resource needs, safety concerns,
 * verification workflows, and community engagement.
 */

// Type definitions
type ReportType = 'incident' | 'damage' | 'hazard' | 'resource_need' | 'missing_person' | 'infrastructure' | 'safety' | 'wildlife' | 'environmental' | 'other';
type ReportStatus = 'submitted' | 'under_review' | 'verified' | 'actionable' | 'assigned' | 'resolved' | 'rejected' | 'duplicate';
type ReportPriority = 'low' | 'medium' | 'high' | 'critical';
type VerificationStatus = 'pending' | 'verified' | 'partially_verified' | 'unverified' | 'conflicting';
type MediaType = 'photo' | 'video' | 'audio' | 'document';
type CredibilityLevel = 'new' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'verified_official';

// Report interfaces
interface CrowdsourcedReport {
  id: string;
  type: ReportType;
  category: string;
  subcategory?: string;
  status: ReportStatus;
  priority: ReportPriority;
  title: string;
  description: string;
  location: ReportLocation;
  reporter: ReporterInfo;
  media: ReportMedia[];
  verification: VerificationInfo;
  assignment?: AssignmentInfo;
  relatedReports: string[];
  tags: string[];
  votes: VoteInfo;
  comments: ReportComment[];
  timeline: TimelineEvent[];
  metadata: ReportMetadata;
  createdAt: Date;
  updatedAt: Date;
}

interface ReportLocation {
  coordinates: { lat: number; lon: number };
  accuracy: number; // meters
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  landmark?: string;
  description?: string;
  geocodeSource: 'gps' | 'manual' | 'geocoded' | 'ip';
}

interface ReporterInfo {
  id: string;
  type: 'anonymous' | 'registered' | 'verified' | 'official';
  name?: string;
  phone?: string;
  email?: string;
  credibilityScore: number; // 0-100
  credibilityLevel: CredibilityLevel;
  totalReports: number;
  verifiedReports: number;
  organization?: string;
  role?: string;
}

interface ReportMedia {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  size: number; // bytes
  mimeType: string;
  duration?: number; // seconds for video/audio
  dimensions?: { width: number; height: number };
  metadata?: {
    capturedAt?: Date;
    device?: string;
    geotagged?: boolean;
    coordinates?: { lat: number; lon: number };
  };
  verified: boolean;
  uploadedAt: Date;
}

interface VerificationInfo {
  status: VerificationStatus;
  score: number; // 0-100
  method: string[];
  verifiedBy?: string[];
  verifiedAt?: Date;
  autoVerification: {
    locationMatch: boolean;
    mediaAnalysis: boolean;
    textAnalysis: boolean;
    crossReference: boolean;
  };
  communityVerification: {
    upvotes: number;
    downvotes: number;
    corroborations: number;
  };
  officialVerification?: {
    verifierId: string;
    verifierName: string;
    verifierOrg: string;
    timestamp: Date;
    notes: string;
  };
  flags: VerificationFlag[];
}

interface VerificationFlag {
  type: 'spam' | 'misinformation' | 'duplicate' | 'inappropriate' | 'location_mismatch' | 'outdated';
  reportedBy: string;
  reportedAt: Date;
  reason: string;
  resolved: boolean;
  resolution?: string;
}

interface AssignmentInfo {
  assignedTo: string;
  assignedBy: string;
  assignedAt: Date;
  organization: string;
  team?: string;
  priority: ReportPriority;
  deadline?: Date;
  status: 'pending' | 'acknowledged' | 'in_progress' | 'completed' | 'escalated';
  notes: string;
}

interface VoteInfo {
  upvotes: number;
  downvotes: number;
  confirmations: number;
  disputations: number;
  voters: { odUserId: string; vote: 'up' | 'down' | 'confirm' | 'dispute'; timestamp: Date }[];
}

interface ReportComment {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'citizen' | 'official' | 'responder' | 'moderator';
  content: string;
  isOfficial: boolean;
  createdAt: Date;
  updatedAt?: Date;
  replies: ReportComment[];
  likes: number;
  flags: number;
}

interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'verified' | 'assigned' | 'status_change' | 'comment' | 'media_added' | 'location_updated' | 'merged' | 'resolved';
  timestamp: Date;
  actor: string;
  actorType: 'system' | 'reporter' | 'official' | 'responder' | 'moderator';
  description: string;
  details?: Record<string, any>;
}

interface ReportMetadata {
  source: 'mobile_app' | 'web' | 'sms' | 'voice' | 'social_media' | 'api';
  deviceInfo?: {
    platform: string;
    osVersion: string;
    appVersion: string;
    deviceId?: string;
  };
  languageCode: string;
  translated: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'urgent';
  urgencyScore: number; // 0-100
  impactScore: number; // 0-100
  aiAnalysis?: {
    category: string;
    confidence: number;
    entities: string[];
    keywords: string[];
    suggestedPriority: ReportPriority;
  };
}

// Reporter interfaces
interface Reporter {
  id: string;
  type: ReporterInfo['type'];
  profile: ReporterProfile;
  credentials: ReporterCredentials;
  activity: ReporterActivity;
  preferences: ReporterPreferences;
  badges: Badge[];
  reputation: ReputationInfo;
  createdAt: Date;
  updatedAt: Date;
}

interface ReporterProfile {
  displayName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  bio?: string;
  location?: { city: string; state: string };
  languages: string[];
  skills: string[];
  availability: 'available' | 'limited' | 'unavailable';
}

interface ReporterCredentials {
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  backgroundChecked: boolean;
  certifications: string[];
  affiliations: string[];
}

interface ReporterActivity {
  totalReports: number;
  verifiedReports: number;
  rejectedReports: number;
  totalVotes: number;
  helpfulVotes: number;
  commentsPosted: number;
  lastActive: Date;
  activeStreak: number; // days
  reportsByType: Record<ReportType, number>;
  monthlyReports: { month: string; count: number }[];
}

interface ReporterPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    reportUpdates: boolean;
    areaAlerts: boolean;
    weeklyDigest: boolean;
  };
  privacy: {
    showName: boolean;
    showLocation: boolean;
    allowContact: boolean;
  };
  alertAreas: { lat: number; lon: number; radius: number }[];
  reportTypes: ReportType[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'reporting' | 'verification' | 'community' | 'special';
  earnedAt: Date;
  level?: number;
}

interface ReputationInfo {
  score: number; // 0-1000
  level: CredibilityLevel;
  rank?: number;
  trend: 'rising' | 'stable' | 'declining';
  factors: {
    accuracy: number;
    timeliness: number;
    helpfulness: number;
    consistency: number;
  };
}

// Analytics interfaces
interface ReportingAnalytics {
  period: { start: Date; end: Date };
  totalReports: number;
  byType: Record<ReportType, number>;
  byStatus: Record<ReportStatus, number>;
  byPriority: Record<ReportPriority, number>;
  verificationRate: number;
  averageVerificationTime: number; // minutes
  averageResolutionTime: number; // hours
  topReporters: { reporterId: string; name: string; count: number }[];
  hotspots: { lat: number; lon: number; count: number; types: ReportType[] }[];
  trendsings: { keyword: string; count: number; trend: 'rising' | 'stable' | 'falling' }[];
}

// Campaign interfaces
interface ReportingCampaign {
  id: string;
  name: string;
  description: string;
  type: 'damage_assessment' | 'needs_survey' | 'safety_check' | 'resource_mapping' | 'custom';
  status: 'draft' | 'active' | 'paused' | 'completed';
  area: {
    type: 'polygon' | 'radius';
    center?: { lat: number; lon: number };
    radius?: number;
    polygon?: { lat: number; lon: number }[];
  };
  targetReports: number;
  currentReports: number;
  questions?: CampaignQuestion[];
  incentives?: string[];
  startDate: Date;
  endDate?: Date;
  createdBy: string;
  participants: string[];
}

interface CampaignQuestion {
  id: string;
  question: string;
  type: 'text' | 'number' | 'choice' | 'multichoice' | 'rating' | 'photo';
  required: boolean;
  options?: string[];
}

// Alert interfaces
interface ReportingAlert {
  id: string;
  type: 'cluster' | 'spike' | 'critical' | 'trending' | 'unverified';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affectedArea?: { lat: number; lon: number; radius: number };
  reportIds: string[];
  triggeredAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
}

// Sample data
const sampleReports: CrowdsourcedReport[] = [
  {
    id: 'report-001',
    type: 'damage',
    category: 'Structure',
    subcategory: 'Building',
    status: 'verified',
    priority: 'high',
    title: 'Collapsed roof on Main Street',
    description: 'Two-story building with collapsed roof after storm. Debris blocking sidewalk. No known injuries.',
    location: {
      coordinates: { lat: 34.0522, lon: -118.2437 },
      accuracy: 10,
      address: '123 Main Street',
      city: 'Metro City',
      state: 'CA',
      zipCode: '90001',
      geocodeSource: 'gps'
    },
    reporter: {
      id: 'reporter-001',
      type: 'registered',
      name: 'John Citizen',
      credibilityScore: 85,
      credibilityLevel: 'gold',
      totalReports: 45,
      verifiedReports: 38
    },
    media: [
      {
        id: 'media-001',
        type: 'photo',
        url: 'https://example.com/photos/damage-001.jpg',
        thumbnailUrl: 'https://example.com/photos/damage-001-thumb.jpg',
        filename: 'damage-001.jpg',
        size: 2500000,
        mimeType: 'image/jpeg',
        dimensions: { width: 4032, height: 3024 },
        metadata: { capturedAt: new Date(), geotagged: true },
        verified: true,
        uploadedAt: new Date()
      }
    ],
    verification: {
      status: 'verified',
      score: 92,
      method: ['community', 'official'],
      verifiedBy: ['official-001'],
      verifiedAt: new Date(),
      autoVerification: { locationMatch: true, mediaAnalysis: true, textAnalysis: true, crossReference: true },
      communityVerification: { upvotes: 15, downvotes: 1, corroborations: 8 },
      officialVerification: {
        verifierId: 'official-001',
        verifierName: 'Emergency Response Team',
        verifierOrg: 'City Emergency Services',
        timestamp: new Date(),
        notes: 'Confirmed on-site inspection'
      },
      flags: []
    },
    relatedReports: [],
    tags: ['storm-damage', 'structural', 'urgent'],
    votes: { upvotes: 15, downvotes: 1, confirmations: 8, disputations: 0, voters: [] },
    comments: [],
    timeline: [],
    metadata: {
      source: 'mobile_app',
      languageCode: 'en',
      translated: false,
      urgencyScore: 85,
      impactScore: 75
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class CrowdsourcedReportingService {
  private static instance: CrowdsourcedReportingService;
  private reports: Map<string, CrowdsourcedReport> = new Map();
  private reporters: Map<string, Reporter> = new Map();
  private campaigns: Map<string, ReportingCampaign> = new Map();
  private alerts: Map<string, ReportingAlert> = new Map();

  private readonly VERIFICATION_THRESHOLD = 70;
  private readonly AUTO_PRIORITY_KEYWORDS = {
    critical: ['trapped', 'fire', 'collapse', 'explosion', 'fatality', 'life-threatening'],
    high: ['injured', 'flooding', 'gas leak', 'power line', 'blocked road', 'evacuation'],
    medium: ['damage', 'debris', 'hazard', 'outage', 'closed']
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CrowdsourcedReportingService {
    if (!CrowdsourcedReportingService.instance) {
      CrowdsourcedReportingService.instance = new CrowdsourcedReportingService();
    }
    return CrowdsourcedReportingService.instance;
  }

  private initializeSampleData(): void {
    sampleReports.forEach(r => this.reports.set(r.id, r));
  }

  // ==================== Report Management ====================

  async submitReport(params: {
    type: ReportType;
    category: string;
    subcategory?: string;
    title: string;
    description: string;
    location: Omit<ReportLocation, 'geocodeSource'>;
    reporter: Partial<ReporterInfo>;
    media?: Omit<ReportMedia, 'id' | 'verified' | 'uploadedAt'>[];
    tags?: string[];
    source?: ReportMetadata['source'];
  }): Promise<CrowdsourcedReport> {
    // Auto-detect priority based on content
    const priority = this.detectPriority(params.title, params.description);

    // Calculate urgency and impact scores
    const urgencyScore = this.calculateUrgencyScore(params.type, priority, params.description);
    const impactScore = this.calculateImpactScore(params.type, params.description);

    const report: CrowdsourcedReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      category: params.category,
      subcategory: params.subcategory,
      status: 'submitted',
      priority,
      title: params.title,
      description: params.description,
      location: {
        ...params.location,
        geocodeSource: params.location.coordinates ? 'gps' : 'manual'
      },
      reporter: {
        id: params.reporter.id || `anon-${Date.now()}`,
        type: params.reporter.type || 'anonymous',
        name: params.reporter.name,
        phone: params.reporter.phone,
        email: params.reporter.email,
        credibilityScore: params.reporter.credibilityScore || 50,
        credibilityLevel: params.reporter.credibilityLevel || 'new',
        totalReports: params.reporter.totalReports || 0,
        verifiedReports: params.reporter.verifiedReports || 0
      },
      media: (params.media || []).map(m => ({
        ...m,
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        verified: false,
        uploadedAt: new Date()
      })),
      verification: {
        status: 'pending',
        score: 0,
        method: [],
        autoVerification: {
          locationMatch: false,
          mediaAnalysis: false,
          textAnalysis: false,
          crossReference: false
        },
        communityVerification: { upvotes: 0, downvotes: 0, corroborations: 0 },
        flags: []
      },
      relatedReports: [],
      tags: params.tags || [],
      votes: { upvotes: 0, downvotes: 0, confirmations: 0, disputations: 0, voters: [] },
      comments: [],
      timeline: [{
        id: `event-${Date.now()}`,
        type: 'created',
        timestamp: new Date(),
        actor: 'System',
        actorType: 'system',
        description: 'Report submitted'
      }],
      metadata: {
        source: params.source || 'mobile_app',
        languageCode: 'en',
        translated: false,
        urgencyScore,
        impactScore
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.reports.set(report.id, report);

    // Trigger auto-verification
    await this.runAutoVerification(report.id);

    // Check for duplicate/related reports
    await this.findRelatedReports(report.id);

    // Update reporter stats
    await this.updateReporterStats(report.reporter.id, 'submitted');

    // Check for alert conditions
    await this.checkAlertConditions(report);

    return report;
  }

  private detectPriority(title: string, description: string): ReportPriority {
    const text = `${title} ${description}`.toLowerCase();

    for (const keyword of this.AUTO_PRIORITY_KEYWORDS.critical) {
      if (text.includes(keyword)) return 'critical';
    }
    for (const keyword of this.AUTO_PRIORITY_KEYWORDS.high) {
      if (text.includes(keyword)) return 'high';
    }
    for (const keyword of this.AUTO_PRIORITY_KEYWORDS.medium) {
      if (text.includes(keyword)) return 'medium';
    }
    return 'low';
  }

  private calculateUrgencyScore(type: ReportType, priority: ReportPriority, description: string): number {
    let score = 50;

    // Type factor
    const typeScores: Record<ReportType, number> = {
      incident: 80, damage: 70, hazard: 75, resource_need: 60,
      missing_person: 90, infrastructure: 65, safety: 70,
      wildlife: 40, environmental: 50, other: 30
    };
    score = typeScores[type] || 50;

    // Priority factor
    const priorityMultipliers: Record<ReportPriority, number> = {
      critical: 1.3, high: 1.15, medium: 1.0, low: 0.8
    };
    score *= priorityMultipliers[priority];

    return Math.min(100, Math.round(score));
  }

  private calculateImpactScore(type: ReportType, description: string): number {
    let score = 50;

    // Check for impact keywords
    if (description.toLowerCase().includes('multiple')) score += 15;
    if (description.toLowerCase().includes('widespread')) score += 20;
    if (description.toLowerCase().includes('community')) score += 10;
    if (description.toLowerCase().includes('school') || description.toLowerCase().includes('hospital')) score += 25;

    return Math.min(100, score);
  }

  async getReport(reportId: string): Promise<CrowdsourcedReport | null> {
    return this.reports.get(reportId) || null;
  }

  async getReports(params?: {
    type?: ReportType;
    status?: ReportStatus;
    priority?: ReportPriority;
    verified?: boolean;
    location?: { lat: number; lon: number; radius: number };
    reporterId?: string;
    tags?: string[];
    dateRange?: { start: Date; end: Date };
    limit?: number;
    offset?: number;
  }): Promise<{ reports: CrowdsourcedReport[]; total: number }> {
    let reports = Array.from(this.reports.values());

    if (params?.type) {
      reports = reports.filter(r => r.type === params.type);
    }

    if (params?.status) {
      reports = reports.filter(r => r.status === params.status);
    }

    if (params?.priority) {
      reports = reports.filter(r => r.priority === params.priority);
    }

    if (params?.verified) {
      reports = reports.filter(r => r.verification.status === 'verified');
    }

    if (params?.location) {
      reports = reports.filter(r => {
        const distance = this.calculateDistance(
          params.location!.lat, params.location!.lon,
          r.location.coordinates.lat, r.location.coordinates.lon
        );
        return distance <= params.location!.radius;
      });
    }

    if (params?.reporterId) {
      reports = reports.filter(r => r.reporter.id === params.reporterId);
    }

    if (params?.tags && params.tags.length > 0) {
      reports = reports.filter(r =>
        params.tags!.some(tag => r.tags.includes(tag))
      );
    }

    if (params?.dateRange) {
      reports = reports.filter(r =>
        r.createdAt >= params.dateRange!.start &&
        r.createdAt <= params.dateRange!.end
      );
    }

    // Sort by priority and recency
    reports.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const total = reports.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || 50;
    reports = reports.slice(offset, offset + limit);

    return { reports, total };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async updateReport(reportId: string, update: {
    status?: ReportStatus;
    priority?: ReportPriority;
    description?: string;
    tags?: string[];
    actor: string;
    actorType: TimelineEvent['actorType'];
    notes?: string;
  }): Promise<CrowdsourcedReport> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error(`Report not found: ${reportId}`);

    const changes: string[] = [];

    if (update.status && update.status !== report.status) {
      changes.push(`Status: ${report.status} → ${update.status}`);
      report.status = update.status;
    }

    if (update.priority && update.priority !== report.priority) {
      changes.push(`Priority: ${report.priority} → ${update.priority}`);
      report.priority = update.priority;
    }

    if (update.description) {
      report.description = update.description;
      changes.push('Description updated');
    }

    if (update.tags) {
      report.tags = update.tags;
      changes.push('Tags updated');
    }

    report.updatedAt = new Date();

    // Add timeline event
    report.timeline.push({
      id: `event-${Date.now()}`,
      type: 'status_change',
      timestamp: new Date(),
      actor: update.actor,
      actorType: update.actorType,
      description: changes.join('; ') + (update.notes ? ` - ${update.notes}` : '')
    });

    return report;
  }

  // ==================== Verification ====================

  private async runAutoVerification(reportId: string): Promise<void> {
    const report = this.reports.get(reportId);
    if (!report) return;

    let score = 0;
    const methods: string[] = [];

    // Location verification
    if (report.location.accuracy < 50) {
      report.verification.autoVerification.locationMatch = true;
      score += 20;
      methods.push('location');
    }

    // Media verification
    if (report.media.length > 0) {
      const geotaggedMedia = report.media.filter(m => m.metadata?.geotagged);
      if (geotaggedMedia.length > 0) {
        report.verification.autoVerification.mediaAnalysis = true;
        score += 25;
        methods.push('media');
      }
    }

    // Reporter credibility
    score += (report.reporter.credibilityScore / 100) * 30;

    // Text analysis (simplified)
    if (report.description.length > 50) {
      report.verification.autoVerification.textAnalysis = true;
      score += 10;
      methods.push('text');
    }

    report.verification.score = Math.min(100, score);
    report.verification.method = methods;

    // Auto-verify if score is high enough and reporter is credible
    if (score >= this.VERIFICATION_THRESHOLD && report.reporter.credibilityLevel !== 'new') {
      report.verification.status = 'verified';
      report.status = 'verified';
    }
  }

  async verifyReport(reportId: string, verification: {
    verifierId: string;
    verifierName: string;
    verifierOrg: string;
    status: VerificationStatus;
    notes: string;
  }): Promise<CrowdsourcedReport> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error(`Report not found: ${reportId}`);

    report.verification.status = verification.status;
    report.verification.verifiedBy = [verification.verifierId];
    report.verification.verifiedAt = new Date();
    report.verification.officialVerification = {
      verifierId: verification.verifierId,
      verifierName: verification.verifierName,
      verifierOrg: verification.verifierOrg,
      timestamp: new Date(),
      notes: verification.notes
    };
    report.verification.score = verification.status === 'verified' ? 100 : 50;

    if (verification.status === 'verified') {
      report.status = 'verified';
      await this.updateReporterStats(report.reporter.id, 'verified');
    }

    report.updatedAt = new Date();

    report.timeline.push({
      id: `event-${Date.now()}`,
      type: 'verified',
      timestamp: new Date(),
      actor: verification.verifierName,
      actorType: 'official',
      description: `Verified by ${verification.verifierOrg}: ${verification.notes}`
    });

    return report;
  }

  async voteOnReport(reportId: string, vote: {
    odUserId: string;
    type: 'up' | 'down' | 'confirm' | 'dispute';
  }): Promise<CrowdsourcedReport> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error(`Report not found: ${reportId}`);

    // Check if already voted
    const existingVote = report.votes.voters.find(v => v.odUserId === vote.odUserId);
    if (existingVote) {
      throw new Error('User has already voted on this report');
    }

    report.votes.voters.push({
      odUserId: vote.odUserId,
      vote: vote.type,
      timestamp: new Date()
    });

    switch (vote.type) {
      case 'up':
        report.votes.upvotes++;
        report.verification.communityVerification.upvotes++;
        break;
      case 'down':
        report.votes.downvotes++;
        report.verification.communityVerification.downvotes++;
        break;
      case 'confirm':
        report.votes.confirmations++;
        report.verification.communityVerification.corroborations++;
        break;
      case 'dispute':
        report.votes.disputations++;
        break;
    }

    // Update verification score based on community votes
    const communityScore = (report.verification.communityVerification.upvotes * 2 +
      report.verification.communityVerification.corroborations * 3 -
      report.verification.communityVerification.downvotes) * 2;
    report.verification.score = Math.min(100, Math.max(0, report.verification.score + communityScore / 10));

    return report;
  }

  async flagReport(reportId: string, flag: Omit<VerificationFlag, 'resolved' | 'resolution'>): Promise<CrowdsourcedReport> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error(`Report not found: ${reportId}`);

    report.verification.flags.push({
      ...flag,
      resolved: false
    });

    // Auto-quarantine if multiple flags
    if (report.verification.flags.filter(f => !f.resolved).length >= 3) {
      report.status = 'under_review';
    }

    return report;
  }

  // ==================== Assignment ====================

  async assignReport(reportId: string, assignment: Omit<AssignmentInfo, 'status'>): Promise<CrowdsourcedReport> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error(`Report not found: ${reportId}`);

    report.assignment = {
      ...assignment,
      status: 'pending'
    };
    report.status = 'assigned';
    report.updatedAt = new Date();

    report.timeline.push({
      id: `event-${Date.now()}`,
      type: 'assigned',
      timestamp: new Date(),
      actor: assignment.assignedBy,
      actorType: 'official',
      description: `Assigned to ${assignment.organization}${assignment.team ? ` - ${assignment.team}` : ''}`
    });

    return report;
  }

  async updateAssignmentStatus(reportId: string, status: AssignmentInfo['status'], notes?: string): Promise<CrowdsourcedReport> {
    const report = this.reports.get(reportId);
    if (!report || !report.assignment) throw new Error(`Report or assignment not found: ${reportId}`);

    report.assignment.status = status;
    if (notes) report.assignment.notes = notes;

    if (status === 'completed') {
      report.status = 'resolved';
    }

    report.updatedAt = new Date();

    report.timeline.push({
      id: `event-${Date.now()}`,
      type: 'status_change',
      timestamp: new Date(),
      actor: report.assignment.assignedTo,
      actorType: 'responder',
      description: `Assignment status: ${status}${notes ? ` - ${notes}` : ''}`
    });

    return report;
  }

  // ==================== Comments ====================

  async addComment(reportId: string, comment: Omit<ReportComment, 'id' | 'createdAt' | 'replies' | 'likes' | 'flags'>): Promise<ReportComment> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error(`Report not found: ${reportId}`);

    const newComment: ReportComment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date(),
      replies: [],
      likes: 0,
      flags: 0
    };

    report.comments.push(newComment);
    report.updatedAt = new Date();

    report.timeline.push({
      id: `event-${Date.now()}`,
      type: 'comment',
      timestamp: new Date(),
      actor: comment.authorName,
      actorType: comment.authorType === 'citizen' ? 'reporter' : comment.authorType as any,
      description: comment.isOfficial ? 'Official response added' : 'Comment added'
    });

    return newComment;
  }

  // ==================== Related Reports ====================

  private async findRelatedReports(reportId: string): Promise<void> {
    const report = this.reports.get(reportId);
    if (!report) return;

    const related: string[] = [];

    for (const [id, other] of this.reports.entries()) {
      if (id === reportId) continue;

      // Check proximity (within 500m)
      const distance = this.calculateDistance(
        report.location.coordinates.lat, report.location.coordinates.lon,
        other.location.coordinates.lat, other.location.coordinates.lon
      );

      if (distance <= 0.5) {
        // Check time proximity (within 24 hours)
        const timeDiff = Math.abs(report.createdAt.getTime() - other.createdAt.getTime());
        if (timeDiff <= 24 * 60 * 60 * 1000) {
          // Check type similarity
          if (report.type === other.type || report.category === other.category) {
            related.push(id);
          }
        }
      }
    }

    report.relatedReports = related;
  }

  async mergeReports(primaryId: string, duplicateIds: string[], mergedBy: string): Promise<CrowdsourcedReport> {
    const primary = this.reports.get(primaryId);
    if (!primary) throw new Error(`Primary report not found: ${primaryId}`);

    for (const dupId of duplicateIds) {
      const duplicate = this.reports.get(dupId);
      if (duplicate) {
        // Mark as duplicate
        duplicate.status = 'duplicate';
        duplicate.relatedReports.push(primaryId);

        // Merge media
        primary.media.push(...duplicate.media);

        // Merge votes
        primary.votes.upvotes += duplicate.votes.upvotes;
        primary.votes.confirmations += duplicate.votes.confirmations;

        // Add to related
        primary.relatedReports.push(dupId);
      }
    }

    primary.timeline.push({
      id: `event-${Date.now()}`,
      type: 'merged',
      timestamp: new Date(),
      actor: mergedBy,
      actorType: 'moderator',
      description: `Merged ${duplicateIds.length} duplicate reports`
    });

    primary.updatedAt = new Date();
    return primary;
  }

  // ==================== Reporter Management ====================

  private async updateReporterStats(reporterId: string, action: 'submitted' | 'verified' | 'rejected'): Promise<void> {
    let reporter = this.reporters.get(reporterId);

    if (!reporter) {
      reporter = {
        id: reporterId,
        type: 'registered',
        profile: { languages: ['en'] },
        credentials: {
          emailVerified: false, phoneVerified: false,
          identityVerified: false, backgroundChecked: false,
          certifications: [], affiliations: []
        },
        activity: {
          totalReports: 0, verifiedReports: 0, rejectedReports: 0,
          totalVotes: 0, helpfulVotes: 0, commentsPosted: 0,
          lastActive: new Date(), activeStreak: 1, reportsByType: {} as any,
          monthlyReports: []
        },
        preferences: {
          notifications: { email: true, sms: false, push: true, reportUpdates: true, areaAlerts: true, weeklyDigest: false },
          privacy: { showName: true, showLocation: false, allowContact: false },
          alertAreas: [], reportTypes: []
        },
        badges: [],
        reputation: { score: 100, level: 'new', trend: 'stable', factors: { accuracy: 50, timeliness: 50, helpfulness: 50, consistency: 50 } },
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    reporter.activity.lastActive = new Date();

    switch (action) {
      case 'submitted':
        reporter.activity.totalReports++;
        break;
      case 'verified':
        reporter.activity.verifiedReports++;
        reporter.reputation.score += 10;
        reporter.reputation.factors.accuracy = Math.min(100,
          (reporter.activity.verifiedReports / reporter.activity.totalReports) * 100
        );
        break;
      case 'rejected':
        reporter.activity.rejectedReports++;
        reporter.reputation.score = Math.max(0, reporter.reputation.score - 5);
        break;
    }

    // Update credibility level
    reporter.reputation.level = this.calculateCredibilityLevel(reporter.reputation.score, reporter.activity);

    this.reporters.set(reporterId, reporter);
  }

  private calculateCredibilityLevel(score: number, activity: ReporterActivity): CredibilityLevel {
    if (activity.totalReports >= 100 && score >= 900) return 'platinum';
    if (activity.totalReports >= 50 && score >= 700) return 'gold';
    if (activity.totalReports >= 20 && score >= 500) return 'silver';
    if (activity.totalReports >= 5 && score >= 200) return 'bronze';
    return 'new';
  }

  async getReporter(reporterId: string): Promise<Reporter | null> {
    return this.reporters.get(reporterId) || null;
  }

  // ==================== Campaigns ====================

  async createCampaign(params: Omit<ReportingCampaign, 'id' | 'currentReports' | 'participants'>): Promise<ReportingCampaign> {
    const campaign: ReportingCampaign = {
      ...params,
      id: `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      currentReports: 0,
      participants: []
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async getCampaigns(params?: { status?: ReportingCampaign['status'] }): Promise<ReportingCampaign[]> {
    let campaigns = Array.from(this.campaigns.values());

    if (params?.status) {
      campaigns = campaigns.filter(c => c.status === params.status);
    }

    return campaigns;
  }

  // ==================== Alerts ====================

  private async checkAlertConditions(report: CrowdsourcedReport): Promise<void> {
    // Check for cluster alerts (many reports in same area)
    const nearbyReports = Array.from(this.reports.values()).filter(r => {
      const distance = this.calculateDistance(
        report.location.coordinates.lat, report.location.coordinates.lon,
        r.location.coordinates.lat, r.location.coordinates.lon
      );
      const timeDiff = Math.abs(Date.now() - r.createdAt.getTime());
      return distance <= 1 && timeDiff <= 3600000; // 1km, 1 hour
    });

    if (nearbyReports.length >= 5) {
      const alert: ReportingAlert = {
        id: `alert-${Date.now()}`,
        type: 'cluster',
        severity: 'warning',
        title: 'Report cluster detected',
        description: `${nearbyReports.length} reports in small area within last hour`,
        affectedArea: { ...report.location.coordinates, radius: 1 },
        reportIds: nearbyReports.map(r => r.id),
        triggeredAt: new Date()
      };
      this.alerts.set(alert.id, alert);
    }

    // Check for critical reports
    if (report.priority === 'critical') {
      const alert: ReportingAlert = {
        id: `alert-${Date.now()}`,
        type: 'critical',
        severity: 'critical',
        title: 'Critical report submitted',
        description: report.title,
        reportIds: [report.id],
        triggeredAt: new Date()
      };
      this.alerts.set(alert.id, alert);
    }
  }

  async getAlerts(params?: { unresolved?: boolean }): Promise<ReportingAlert[]> {
    let alerts = Array.from(this.alerts.values());

    if (params?.unresolved) {
      alerts = alerts.filter(a => !a.resolvedAt);
    }

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // ==================== Analytics ====================

  async getAnalytics(period: { start: Date; end: Date }): Promise<ReportingAnalytics> {
    const reports = Array.from(this.reports.values()).filter(r =>
      r.createdAt >= period.start && r.createdAt <= period.end
    );

    const byType: Record<ReportType, number> = {} as any;
    const byStatus: Record<ReportStatus, number> = {} as any;
    const byPriority: Record<ReportPriority, number> = {} as any;
    const reporterCounts: Map<string, { id: string; name: string; count: number }> = new Map();

    let verifiedCount = 0;
    let totalVerificationTime = 0;
    let totalResolutionTime = 0;
    let resolvedCount = 0;

    reports.forEach(r => {
      byType[r.type] = (byType[r.type] || 0) + 1;
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      byPriority[r.priority] = (byPriority[r.priority] || 0) + 1;

      if (r.verification.status === 'verified' && r.verification.verifiedAt) {
        verifiedCount++;
        totalVerificationTime += r.verification.verifiedAt.getTime() - r.createdAt.getTime();
      }

      if (r.status === 'resolved') {
        resolvedCount++;
        totalResolutionTime += r.updatedAt.getTime() - r.createdAt.getTime();
      }

      const existing = reporterCounts.get(r.reporter.id);
      if (existing) {
        existing.count++;
      } else {
        reporterCounts.set(r.reporter.id, {
          id: r.reporter.id,
          name: r.reporter.name || 'Anonymous',
          count: 1
        });
      }
    });

    return {
      period,
      totalReports: reports.length,
      byType,
      byStatus,
      byPriority,
      verificationRate: reports.length > 0 ? (verifiedCount / reports.length) * 100 : 0,
      averageVerificationTime: verifiedCount > 0 ? totalVerificationTime / verifiedCount / 60000 : 0,
      averageResolutionTime: resolvedCount > 0 ? totalResolutionTime / resolvedCount / 3600000 : 0,
      topReporters: Array.from(reporterCounts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      hotspots: [],
      trendsings: []
    };
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalReports: number;
    byType: Record<ReportType, number>;
    byStatus: Record<ReportStatus, number>;
    byPriority: Record<ReportPriority, number>;
    verificationRate: number;
    totalReporters: number;
    activeCampaigns: number;
    unresolvedAlerts: number;
    reportsToday: number;
    reportsThisWeek: number;
  }> {
    const reports = Array.from(this.reports.values());
    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const byType: Record<ReportType, number> = {} as any;
    const byStatus: Record<ReportStatus, number> = {} as any;
    const byPriority: Record<ReportPriority, number> = {} as any;
    let verifiedCount = 0;

    reports.forEach(r => {
      byType[r.type] = (byType[r.type] || 0) + 1;
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      byPriority[r.priority] = (byPriority[r.priority] || 0) + 1;
      if (r.verification.status === 'verified') verifiedCount++;
    });

    const alerts = await this.getAlerts({ unresolved: true });
    const campaigns = await this.getCampaigns({ status: 'active' });

    return {
      totalReports: reports.length,
      byType,
      byStatus,
      byPriority,
      verificationRate: reports.length > 0 ? (verifiedCount / reports.length) * 100 : 0,
      totalReporters: this.reporters.size,
      activeCampaigns: campaigns.length,
      unresolvedAlerts: alerts.length,
      reportsToday: reports.filter(r => r.createdAt >= today).length,
      reportsThisWeek: reports.filter(r => r.createdAt >= weekAgo).length
    };
  }
}

export const crowdsourcedReportingService = CrowdsourcedReportingService.getInstance();
export default CrowdsourcedReportingService;
