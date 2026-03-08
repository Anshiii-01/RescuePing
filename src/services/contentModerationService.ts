/**
 * Content Moderation Service
 * Automated and manual content review, spam detection, and policy enforcement
 */

// Moderation status
type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'escalated' | 'auto_approved' | 'auto_rejected';

// Content type
type ContentType = 'alert' | 'comment' | 'message' | 'report' | 'user_profile' | 'image' | 'video' | 'document' | 'donation_message' | 'volunteer_application';

// Violation type
type ViolationType = 'spam' | 'harassment' | 'hate_speech' | 'misinformation' | 'explicit_content' | 'violence' | 'personal_info' | 'copyright' | 'scam' | 'impersonation' | 'off_topic' | 'low_quality' | 'duplicate';

// Action type
type ActionType = 'approve' | 'reject' | 'hide' | 'flag' | 'warn' | 'mute' | 'ban' | 'delete' | 'edit' | 'escalate';

// Severity level
type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

// Content item
interface ContentItem {
  id: string;
  type: ContentType;
  content: string;
  metadata: {
    title?: string;
    authorId: string;
    authorName: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    attachments?: { type: string; url: string; size: number }[];
    parentId?: string;
    context?: Record<string, unknown>;
  };
  status: ModerationStatus;
  priority: number;
  language: string;
  createdAt: Date;
  moderatedAt?: Date;
  moderatedBy?: string;
}

// Moderation result
interface ModerationResult {
  id: string;
  contentId: string;
  status: ModerationStatus;
  violations: ViolationDetail[];
  confidence: number;
  aiAnalysis?: AIAnalysisResult;
  manualReview?: ManualReviewResult;
  action: ActionType;
  reason: string;
  appealable: boolean;
  processedAt: Date;
  processingTime: number;
}

// Violation detail
interface ViolationDetail {
  type: ViolationType;
  severity: SeverityLevel;
  confidence: number;
  evidence: string;
  matchedPatterns?: string[];
  location?: { start: number; end: number };
}

// AI analysis result
interface AIAnalysisResult {
  toxicity: number;
  spam: number;
  harassment: number;
  hate: number;
  violence: number;
  adult: number;
  misinformation: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  language: string;
  readability: number;
  keywords: string[];
  entities: { text: string; type: string; salience: number }[];
  modelVersion: string;
  processedAt: Date;
}

// Manual review result
interface ManualReviewResult {
  reviewerId: string;
  reviewerName: string;
  decision: ModerationStatus;
  violations: ViolationType[];
  notes: string;
  actionTaken: ActionType;
  reviewedAt: Date;
  reviewTime: number;
}

// Moderation rule
interface ModerationRule {
  id: string;
  name: string;
  description: string;
  contentTypes: ContentType[];
  conditions: RuleCondition[];
  action: ActionType;
  severity: SeverityLevel;
  enabled: boolean;
  priority: number;
  autoExecute: boolean;
  notifyModerator: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Rule condition
interface RuleCondition {
  field: 'content' | 'author' | 'metadata' | 'ai_score';
  operator: 'contains' | 'not_contains' | 'matches' | 'equals' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | number | string[];
  caseSensitive?: boolean;
}

// Word filter
interface WordFilter {
  id: string;
  category: string;
  words: string[];
  action: ActionType;
  severity: SeverityLevel;
  enabled: boolean;
  exactMatch: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Moderator
interface Moderator {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'junior' | 'senior' | 'lead' | 'admin';
  permissions: string[];
  specializations: ContentType[];
  languages: string[];
  stats: {
    totalReviews: number;
    approvals: number;
    rejections: number;
    escalations: number;
    avgReviewTime: number;
    accuracyRate: number;
  };
  workload: {
    current: number;
    maxDaily: number;
    lastAssigned: Date;
  };
  schedule: {
    timezone: string;
    workHours: { start: string; end: string };
    daysOff: number[];
  };
  status: 'active' | 'inactive' | 'on_break';
  createdAt: Date;
  lastActiveAt: Date;
}

// Moderation queue
interface ModerationQueue {
  id: string;
  name: string;
  description: string;
  contentTypes: ContentType[];
  priority: number;
  assignedModerators: string[];
  filters: {
    minPriority?: number;
    maxPriority?: number;
    languages?: string[];
    statuses?: ModerationStatus[];
  };
  slaMinutes: number;
  autoAssign: boolean;
  stats: {
    pending: number;
    inProgress: number;
    completed: number;
    avgWaitTime: number;
    avgProcessTime: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Appeal
interface Appeal {
  id: string;
  contentId: string;
  originalDecision: ModerationResult;
  userId: string;
  reason: string;
  status: 'pending' | 'under_review' | 'upheld' | 'overturned' | 'partially_overturned';
  assignedTo?: string;
  response?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

// User reputation
interface UserReputation {
  userId: string;
  score: number;
  level: 'untrusted' | 'new' | 'regular' | 'trusted' | 'verified';
  factors: {
    accountAge: number;
    contentQuality: number;
    violations: number;
    appeals: number;
    helpfulness: number;
  };
  history: {
    date: Date;
    action: string;
    scoreChange: number;
  }[];
  restrictions: {
    type: string;
    reason: string;
    expiresAt?: Date;
  }[];
  updatedAt: Date;
}

// Moderation stats
interface ModerationStats {
  period: { start: Date; end: Date };
  total: number;
  byStatus: Record<ModerationStatus, number>;
  byContentType: Record<string, number>;
  byViolation: Record<string, number>;
  byAction: Record<string, number>;
  aiAccuracy: number;
  avgProcessingTime: number;
  slaCompliance: number;
  appealRate: number;
  overturnnedRate: number;
}

class ContentModerationService {
  private static instance: ContentModerationService;
  private contentQueue: Map<string, ContentItem> = new Map();
  private moderationResults: Map<string, ModerationResult> = new Map();
  private rules: Map<string, ModerationRule> = new Map();
  private wordFilters: Map<string, WordFilter> = new Map();
  private moderators: Map<string, Moderator> = new Map();
  private queues: Map<string, ModerationQueue> = new Map();
  private appeals: Map<string, Appeal> = new Map();
  private userReputations: Map<string, UserReputation> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ContentModerationService {
    if (!ContentModerationService.instance) {
      ContentModerationService.instance = new ContentModerationService();
    }
    return ContentModerationService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize word filters
    const filters: Partial<WordFilter>[] = [
      { category: 'spam', words: ['buy now', 'click here', 'free money', 'act now', 'limited time', 'congratulations winner'], action: 'flag', severity: 'medium' },
      { category: 'profanity', words: ['badword1', 'badword2', 'badword3'], action: 'reject', severity: 'high' },
      { category: 'scam', words: ['send money', 'bank details', 'lottery', 'prince', 'inheritance'], action: 'reject', severity: 'critical' },
      { category: 'misinformation', words: ['fake news', 'hoax', 'conspiracy'], action: 'escalate', severity: 'high' },
      { category: 'personal_info', words: ['ssn:', 'password:', 'credit card:', 'cvv:'], action: 'hide', severity: 'critical' },
    ];

    filters.forEach((f, idx) => {
      const filter: WordFilter = {
        id: `filter-${(idx + 1).toString().padStart(4, '0')}`,
        category: f.category!,
        words: f.words!,
        action: f.action!,
        severity: f.severity!,
        enabled: true,
        exactMatch: false,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.wordFilters.set(filter.id, filter);
    });

    // Initialize moderation rules
    const rulesData: Partial<ModerationRule>[] = [
      {
        name: 'Auto-approve trusted users',
        description: 'Automatically approve content from trusted users',
        contentTypes: ['comment', 'message'],
        conditions: [{ field: 'author', operator: 'in', value: ['trusted', 'verified'] }],
        action: 'approve',
        severity: 'low',
        autoExecute: true,
        priority: 10,
      },
      {
        name: 'Flag high toxicity',
        description: 'Flag content with high toxicity scores',
        contentTypes: ['comment', 'message', 'report'],
        conditions: [{ field: 'ai_score', operator: 'greater_than', value: 0.8 }],
        action: 'escalate',
        severity: 'high',
        autoExecute: true,
        priority: 1,
      },
      {
        name: 'Block spam patterns',
        description: 'Automatically reject obvious spam',
        contentTypes: ['comment', 'message', 'donation_message'],
        conditions: [{ field: 'content', operator: 'matches', value: 'http[s]?://.*\\.(xyz|tk|ml)' }],
        action: 'reject',
        severity: 'medium',
        autoExecute: true,
        priority: 2,
      },
      {
        name: 'Review new user alerts',
        description: 'Manually review alerts from new users',
        contentTypes: ['alert'],
        conditions: [{ field: 'author', operator: 'equals', value: 'new' }],
        action: 'flag',
        severity: 'medium',
        autoExecute: false,
        priority: 5,
      },
      {
        name: 'Auto-approve verified organizations',
        description: 'Approve content from verified organizations',
        contentTypes: ['alert', 'report'],
        conditions: [{ field: 'metadata', operator: 'equals', value: 'verified_org' }],
        action: 'approve',
        severity: 'low',
        autoExecute: true,
        priority: 3,
      },
    ];

    rulesData.forEach((r, idx) => {
      const rule: ModerationRule = {
        id: `rule-${(idx + 1).toString().padStart(4, '0')}`,
        name: r.name!,
        description: r.description!,
        contentTypes: r.contentTypes!,
        conditions: r.conditions!,
        action: r.action!,
        severity: r.severity!,
        enabled: true,
        priority: r.priority!,
        autoExecute: r.autoExecute!,
        notifyModerator: r.severity === 'high' || r.severity === 'critical',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.rules.set(rule.id, rule);
    });

    // Initialize moderators
    const moderatorsData = [
      { name: 'Priya Sharma', role: 'lead', specializations: ['alert', 'report'], languages: ['en', 'hi'] },
      { name: 'Rahul Verma', role: 'senior', specializations: ['comment', 'message'], languages: ['en', 'hi', 'mr'] },
      { name: 'Anita Desai', role: 'senior', specializations: ['image', 'video'], languages: ['en', 'gu'] },
      { name: 'Vikram Singh', role: 'junior', specializations: ['comment', 'user_profile'], languages: ['en', 'hi', 'pa'] },
      { name: 'Meera Krishnan', role: 'junior', specializations: ['donation_message', 'volunteer_application'], languages: ['en', 'ta', 'ml'] },
    ];

    moderatorsData.forEach((m, idx) => {
      const moderator: Moderator = {
        id: `mod-${(idx + 1).toString().padStart(4, '0')}`,
        userId: `user-mod-${idx + 1}`,
        name: m.name,
        email: `${m.name.toLowerCase().replace(' ', '.')}@rescueping.com`,
        role: m.role as Moderator['role'],
        permissions: m.role === 'lead' ? ['approve', 'reject', 'ban', 'escalate', 'manage_rules'] :
                     m.role === 'senior' ? ['approve', 'reject', 'escalate'] :
                     ['approve', 'reject'],
        specializations: m.specializations as ContentType[],
        languages: m.languages,
        stats: {
          totalReviews: Math.floor(Math.random() * 5000) + 1000,
          approvals: Math.floor(Math.random() * 3000) + 500,
          rejections: Math.floor(Math.random() * 1000) + 200,
          escalations: Math.floor(Math.random() * 200) + 50,
          avgReviewTime: Math.random() * 60 + 30,
          accuracyRate: Math.random() * 0.1 + 0.9,
        },
        workload: {
          current: Math.floor(Math.random() * 20),
          maxDaily: 100,
          lastAssigned: new Date(),
        },
        schedule: {
          timezone: 'Asia/Kolkata',
          workHours: { start: '09:00', end: '18:00' },
          daysOff: [0, 6],
        },
        status: 'active',
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastActiveAt: new Date(),
      };
      this.moderators.set(moderator.id, moderator);
    });

    // Initialize queues
    const queuesData = [
      { name: 'High Priority', contentTypes: ['alert', 'report'], priority: 1, slaMinutes: 15 },
      { name: 'Standard', contentTypes: ['comment', 'message'], priority: 2, slaMinutes: 60 },
      { name: 'Media Review', contentTypes: ['image', 'video', 'document'], priority: 3, slaMinutes: 120 },
      { name: 'User Verification', contentTypes: ['user_profile', 'volunteer_application'], priority: 4, slaMinutes: 240 },
    ];

    queuesData.forEach((q, idx) => {
      const queue: ModerationQueue = {
        id: `queue-${(idx + 1).toString().padStart(4, '0')}`,
        name: q.name,
        description: `Queue for ${q.name.toLowerCase()} content`,
        contentTypes: q.contentTypes as ContentType[],
        priority: q.priority,
        assignedModerators: Array.from(this.moderators.values())
          .filter((m) => m.specializations.some((s) => q.contentTypes.includes(s)))
          .map((m) => m.id),
        filters: {},
        slaMinutes: q.slaMinutes,
        autoAssign: true,
        stats: {
          pending: Math.floor(Math.random() * 50) + 10,
          inProgress: Math.floor(Math.random() * 20) + 5,
          completed: Math.floor(Math.random() * 1000) + 500,
          avgWaitTime: Math.random() * q.slaMinutes * 0.5,
          avgProcessTime: Math.random() * 30 + 10,
        },
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.queues.set(queue.id, queue);
    });

    // Initialize sample content items
    const contentData = [
      { type: 'alert' as ContentType, content: 'Flood warning issued for coastal areas. Please evacuate immediately.', authorName: 'NDMA Official' },
      { type: 'comment' as ContentType, content: 'Thank you for the timely alert. Sharing with my family.', authorName: 'Citizen User' },
      { type: 'alert' as ContentType, content: 'URGENT: Free money! Click here to claim your prize!', authorName: 'Suspicious User' },
      { type: 'message' as ContentType, content: 'How can I volunteer for relief efforts in Kerala?', authorName: 'New Volunteer' },
      { type: 'report' as ContentType, content: 'Shelter at XYZ school is running low on supplies. Need immediate assistance.', authorName: 'Field Worker' },
      { type: 'comment' as ContentType, content: 'This information is completely false! The government is hiding the truth!', authorName: 'Angry User' },
      { type: 'donation_message' as ContentType, content: 'Donating towards flood relief. Stay strong everyone!', authorName: 'Kind Donor' },
    ];

    contentData.forEach((c, idx) => {
      const item: ContentItem = {
        id: `content-${(idx + 1).toString().padStart(8, '0')}`,
        type: c.type,
        content: c.content,
        metadata: {
          authorId: `user-${idx + 1}`,
          authorName: c.authorName,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        },
        status: 'pending',
        priority: c.type === 'alert' ? 1 : c.type === 'report' ? 2 : 3,
        language: 'en',
        createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      };
      this.contentQueue.set(item.id, item);
    });

    // Initialize user reputations
    for (let i = 1; i <= 20; i++) {
      const score = Math.random() * 100;
      const reputation: UserReputation = {
        userId: `user-${i}`,
        score,
        level: score < 20 ? 'untrusted' : score < 40 ? 'new' : score < 60 ? 'regular' : score < 80 ? 'trusted' : 'verified',
        factors: {
          accountAge: Math.floor(Math.random() * 30),
          contentQuality: Math.random() * 100,
          violations: Math.floor(Math.random() * 5),
          appeals: Math.floor(Math.random() * 3),
          helpfulness: Math.random() * 100,
        },
        history: [],
        restrictions: [],
        updatedAt: new Date(),
      };
      this.userReputations.set(reputation.userId, reputation);
    }
  }

  /**
   * Submit content for moderation
   */
  public submitContent(content: {
    type: ContentType;
    content: string;
    metadata: ContentItem['metadata'];
    language?: string;
  }): ContentItem {
    const item: ContentItem = {
      id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type: content.type,
      content: content.content,
      metadata: content.metadata,
      status: 'pending',
      priority: this.calculatePriority(content.type, content.metadata.authorId),
      language: content.language || 'en',
      createdAt: new Date(),
    };

    this.contentQueue.set(item.id, item);

    // Auto-moderate if possible
    this.autoModerate(item);

    this.emit('content_submitted', item);
    return item;
  }

  /**
   * Calculate content priority
   */
  private calculatePriority(type: ContentType, authorId: string): number {
    let priority = 5;

    // Type-based priority
    if (type === 'alert') priority = 1;
    else if (type === 'report') priority = 2;
    else if (type === 'image' || type === 'video') priority = 3;

    // Author reputation adjustment
    const reputation = this.userReputations.get(authorId);
    if (reputation) {
      if (reputation.level === 'untrusted') priority = Math.min(priority, 2);
      else if (reputation.level === 'verified') priority = Math.max(priority, 4);
    }

    return priority;
  }

  /**
   * Auto-moderate content
   */
  private autoModerate(item: ContentItem): void {
    const violations: ViolationDetail[] = [];
    let confidence = 0;

    // Check word filters
    for (const filter of this.wordFilters.values()) {
      if (!filter.enabled) continue;

      for (const word of filter.words) {
        const pattern = filter.exactMatch
          ? new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'gi')
          : new RegExp(this.escapeRegex(word), 'gi');

        if (pattern.test(item.content)) {
          violations.push({
            type: this.mapCategoryToViolation(filter.category),
            severity: filter.severity,
            confidence: 0.9,
            evidence: `Matched filter: ${filter.category}`,
            matchedPatterns: [word],
          });
          confidence = Math.max(confidence, 0.9);
        }
      }
    }

    // Simulate AI analysis
    const aiAnalysis = this.performAIAnalysis(item.content);

    // Check AI scores
    if (aiAnalysis.toxicity > 0.8) {
      violations.push({
        type: 'harassment',
        severity: 'high',
        confidence: aiAnalysis.toxicity,
        evidence: 'High toxicity detected by AI',
      });
    }

    if (aiAnalysis.spam > 0.8) {
      violations.push({
        type: 'spam',
        severity: 'medium',
        confidence: aiAnalysis.spam,
        evidence: 'Spam detected by AI',
      });
    }

    if (aiAnalysis.misinformation > 0.7) {
      violations.push({
        type: 'misinformation',
        severity: 'high',
        confidence: aiAnalysis.misinformation,
        evidence: 'Potential misinformation detected',
      });
    }

    // Apply rules
    for (const rule of Array.from(this.rules.values()).sort((a, b) => a.priority - b.priority)) {
      if (!rule.enabled) continue;
      if (!rule.contentTypes.includes(item.type)) continue;

      const matches = this.evaluateRuleConditions(rule.conditions, item, aiAnalysis);
      if (matches && rule.autoExecute) {
        const result = this.createModerationResult(item, violations, aiAnalysis, rule.action, `Matched rule: ${rule.name}`, confidence);
        this.applyModerationResult(item, result);
        return;
      }
    }

    // Auto-decision based on violations
    if (violations.length > 0) {
      const maxSeverity = Math.max(...violations.map((v) => this.severityToNumber(v.severity)));
      const avgConfidence = violations.reduce((sum, v) => sum + v.confidence, 0) / violations.length;

      if (maxSeverity >= 3 && avgConfidence > 0.9) {
        const result = this.createModerationResult(item, violations, aiAnalysis, 'reject', 'Auto-rejected due to high-severity violations', avgConfidence);
        this.applyModerationResult(item, result);
        return;
      } else if (maxSeverity >= 2) {
        const result = this.createModerationResult(item, violations, aiAnalysis, 'escalate', 'Escalated for manual review', avgConfidence);
        this.applyModerationResult(item, result);
        return;
      }
    }

    // Check user reputation for auto-approval
    const reputation = this.userReputations.get(item.metadata.authorId);
    if (reputation && reputation.level === 'verified' && violations.length === 0) {
      const result = this.createModerationResult(item, [], aiAnalysis, 'approve', 'Auto-approved - verified user', 0.95);
      this.applyModerationResult(item, result);
    }
  }

  /**
   * Perform AI analysis (simulated)
   */
  private performAIAnalysis(content: string): AIAnalysisResult {
    const lowerContent = content.toLowerCase();

    // Simulated scores based on content patterns
    const hasSpamIndicators = /free|click|winner|prize|limited|urgent!/i.test(content);
    const hasToxicIndicators = /hate|stupid|idiot|fake|liar/i.test(content);
    const hasViolentIndicators = /kill|attack|destroy|bomb/i.test(content);

    return {
      toxicity: hasToxicIndicators ? Math.random() * 0.3 + 0.7 : Math.random() * 0.3,
      spam: hasSpamIndicators ? Math.random() * 0.3 + 0.7 : Math.random() * 0.2,
      harassment: hasToxicIndicators ? Math.random() * 0.3 + 0.5 : Math.random() * 0.2,
      hate: Math.random() * 0.2,
      violence: hasViolentIndicators ? Math.random() * 0.3 + 0.5 : Math.random() * 0.1,
      adult: Math.random() * 0.1,
      misinformation: /conspiracy|hoax|fake news/i.test(content) ? Math.random() * 0.3 + 0.6 : Math.random() * 0.2,
      sentiment: hasToxicIndicators ? 'negative' : hasSpamIndicators ? 'neutral' : 'positive',
      language: 'en',
      readability: Math.random() * 50 + 50,
      keywords: lowerContent.split(/\s+/).slice(0, 5),
      entities: [],
      modelVersion: 'v2.5.0',
      processedAt: new Date(),
    };
  }

  /**
   * Evaluate rule conditions
   */
  private evaluateRuleConditions(conditions: RuleCondition[], item: ContentItem, aiAnalysis: AIAnalysisResult): boolean {
    return conditions.every((condition) => {
      let fieldValue: unknown;

      switch (condition.field) {
        case 'content':
          fieldValue = item.content;
          break;
        case 'author':
          fieldValue = this.userReputations.get(item.metadata.authorId)?.level || 'new';
          break;
        case 'metadata':
          fieldValue = item.metadata;
          break;
        case 'ai_score':
          fieldValue = Math.max(aiAnalysis.toxicity, aiAnalysis.spam, aiAnalysis.harassment);
          break;
      }

      switch (condition.operator) {
        case 'contains':
          return String(fieldValue).includes(String(condition.value));
        case 'not_contains':
          return !String(fieldValue).includes(String(condition.value));
        case 'matches':
          return new RegExp(String(condition.value), condition.caseSensitive ? '' : 'i').test(String(fieldValue));
        case 'equals':
          return fieldValue === condition.value;
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);
        case 'less_than':
          return Number(fieldValue) < Number(condition.value);
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(String(fieldValue));
        case 'not_in':
          return Array.isArray(condition.value) && !(condition.value as unknown[]).includes(fieldValue);
        default:
          return false;
      }
    });
  }

  /**
   * Create moderation result
   */
  private createModerationResult(
    item: ContentItem,
    violations: ViolationDetail[],
    aiAnalysis: AIAnalysisResult,
    action: ActionType,
    reason: string,
    confidence: number
  ): ModerationResult {
    const status: ModerationStatus = action === 'approve' ? 'auto_approved' :
                                     action === 'reject' ? 'auto_rejected' :
                                     action === 'escalate' ? 'escalated' : 'pending';

    return {
      id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      contentId: item.id,
      status,
      violations,
      confidence,
      aiAnalysis,
      action,
      reason,
      appealable: action === 'reject' || action === 'ban',
      processedAt: new Date(),
      processingTime: Math.floor(Math.random() * 100) + 10,
    };
  }

  /**
   * Apply moderation result
   */
  private applyModerationResult(item: ContentItem, result: ModerationResult): void {
    item.status = result.status;
    item.moderatedAt = result.processedAt;

    this.moderationResults.set(result.id, result);

    // Update user reputation if needed
    if (result.status === 'auto_rejected' || result.status === 'rejected') {
      this.updateUserReputation(item.metadata.authorId, -10, 'Content rejected');
    } else if (result.status === 'auto_approved' || result.status === 'approved') {
      this.updateUserReputation(item.metadata.authorId, 1, 'Content approved');
    }

    this.emit('content_moderated', { item, result });
  }

  /**
   * Manual review
   */
  public manualReview(contentId: string, review: {
    reviewerId: string;
    decision: ModerationStatus;
    violations: ViolationType[];
    notes: string;
    action: ActionType;
  }): ModerationResult {
    const item = this.contentQueue.get(contentId);
    if (!item) throw new Error('Content not found');

    const moderator = Array.from(this.moderators.values()).find((m) => m.userId === review.reviewerId);
    if (!moderator) throw new Error('Moderator not found');

    const aiAnalysis = this.performAIAnalysis(item.content);

    const violations: ViolationDetail[] = review.violations.map((v) => ({
      type: v,
      severity: 'medium' as SeverityLevel,
      confidence: 1,
      evidence: 'Manual review',
    }));

    const result: ModerationResult = {
      id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      contentId,
      status: review.decision,
      violations,
      confidence: 1,
      aiAnalysis,
      manualReview: {
        reviewerId: review.reviewerId,
        reviewerName: moderator.name,
        decision: review.decision,
        violations: review.violations,
        notes: review.notes,
        actionTaken: review.action,
        reviewedAt: new Date(),
        reviewTime: Math.floor(Math.random() * 120) + 30,
      },
      action: review.action,
      reason: review.notes,
      appealable: review.action === 'reject' || review.action === 'ban',
      processedAt: new Date(),
      processingTime: 0,
    };

    this.applyModerationResult(item, result);

    // Update moderator stats
    moderator.stats.totalReviews++;
    if (review.decision === 'approved') moderator.stats.approvals++;
    else if (review.decision === 'rejected') moderator.stats.rejections++;
    else if (review.decision === 'escalated') moderator.stats.escalations++;
    moderator.lastActiveAt = new Date();

    return result;
  }

  /**
   * Submit appeal
   */
  public submitAppeal(contentId: string, userId: string, reason: string): Appeal {
    const result = Array.from(this.moderationResults.values()).find((r) => r.contentId === contentId);
    if (!result) throw new Error('Moderation result not found');
    if (!result.appealable) throw new Error('Decision is not appealable');

    const appeal: Appeal = {
      id: `appeal-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      contentId,
      originalDecision: result,
      userId,
      reason,
      status: 'pending',
      createdAt: new Date(),
    };

    this.appeals.set(appeal.id, appeal);
    this.emit('appeal_submitted', appeal);

    return appeal;
  }

  /**
   * Update user reputation
   */
  private updateUserReputation(userId: string, change: number, reason: string): void {
    let reputation = this.userReputations.get(userId);

    if (!reputation) {
      reputation = {
        userId,
        score: 50,
        level: 'new',
        factors: {
          accountAge: 0,
          contentQuality: 50,
          violations: 0,
          appeals: 0,
          helpfulness: 50,
        },
        history: [],
        restrictions: [],
        updatedAt: new Date(),
      };
      this.userReputations.set(userId, reputation);
    }

    reputation.score = Math.max(0, Math.min(100, reputation.score + change));
    reputation.level = reputation.score < 20 ? 'untrusted' :
                       reputation.score < 40 ? 'new' :
                       reputation.score < 60 ? 'regular' :
                       reputation.score < 80 ? 'trusted' : 'verified';

    reputation.history.push({ date: new Date(), action: reason, scoreChange: change });
    reputation.updatedAt = new Date();

    if (change < 0) {
      reputation.factors.violations++;
    } else {
      reputation.factors.contentQuality = Math.min(100, reputation.factors.contentQuality + 1);
    }
  }

  /**
   * Get pending content
   */
  public getPendingContent(filter?: { type?: ContentType; priority?: number }): ContentItem[] {
    let items = Array.from(this.contentQueue.values())
      .filter((i) => i.status === 'pending' || i.status === 'escalated');

    if (filter?.type) items = items.filter((i) => i.type === filter.type);
    if (filter?.priority) items = items.filter((i) => i.priority <= filter.priority!);

    return items.sort((a, b) => a.priority - b.priority || a.createdAt.getTime() - b.createdAt.getTime());
  }

  /**
   * Get moderation stats
   */
  public getStats(period: { start: Date; end: Date }): ModerationStats {
    const results = Array.from(this.moderationResults.values())
      .filter((r) => r.processedAt >= period.start && r.processedAt <= period.end);

    const byStatus: Record<ModerationStatus, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      escalated: 0,
      auto_approved: 0,
      auto_rejected: 0,
    };

    const byContentType: Record<string, number> = {};
    const byViolation: Record<string, number> = {};
    const byAction: Record<string, number> = {};

    results.forEach((r) => {
      byStatus[r.status]++;

      const item = this.contentQueue.get(r.contentId);
      if (item) {
        byContentType[item.type] = (byContentType[item.type] || 0) + 1;
      }

      r.violations.forEach((v) => {
        byViolation[v.type] = (byViolation[v.type] || 0) + 1;
      });

      byAction[r.action] = (byAction[r.action] || 0) + 1;
    });

    const appeals = Array.from(this.appeals.values())
      .filter((a) => a.createdAt >= period.start && a.createdAt <= period.end);

    return {
      period,
      total: results.length,
      byStatus,
      byContentType,
      byViolation,
      byAction,
      aiAccuracy: 0.92,
      avgProcessingTime: results.length > 0
        ? results.reduce((sum, r) => sum + r.processingTime, 0) / results.length
        : 0,
      slaCompliance: 0.95,
      appealRate: results.length > 0 ? appeals.length / results.length : 0,
      overturnnedRate: appeals.length > 0
        ? appeals.filter((a) => a.status === 'overturned').length / appeals.length
        : 0,
    };
  }

  /**
   * Get moderators
   */
  public getModerators(): Moderator[] {
    return Array.from(this.moderators.values());
  }

  /**
   * Get queues
   */
  public getQueues(): ModerationQueue[] {
    return Array.from(this.queues.values());
  }

  /**
   * Get rules
   */
  public getRules(): ModerationRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get user reputation
   */
  public getUserReputation(userId: string): UserReputation | undefined {
    return this.userReputations.get(userId);
  }

  /**
   * Helper functions
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private mapCategoryToViolation(category: string): ViolationType {
    const mapping: Record<string, ViolationType> = {
      spam: 'spam',
      profanity: 'harassment',
      scam: 'scam',
      misinformation: 'misinformation',
      personal_info: 'personal_info',
    };
    return mapping[category] || 'low_quality';
  }

  private severityToNumber(severity: SeverityLevel): number {
    return { low: 1, medium: 2, high: 3, critical: 4 }[severity];
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

export const contentModerationService = ContentModerationService.getInstance();
export type {
  ModerationStatus,
  ContentType,
  ViolationType,
  ActionType,
  SeverityLevel,
  ContentItem,
  ModerationResult,
  ViolationDetail,
  AIAnalysisResult,
  ManualReviewResult,
  ModerationRule,
  RuleCondition,
  WordFilter,
  Moderator,
  ModerationQueue,
  Appeal,
  UserReputation,
  ModerationStats,
};
