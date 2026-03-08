// @ts-nocheck
/**
 * Public Feedback Service - Issue #155 Implementation
 * 
 * Provides comprehensive public feedback collection for disaster response
 * including surveys, ratings, suggestions, complaints, satisfaction tracking,
 * sentiment analysis, and feedback-driven improvements.
 */

// Type definitions
type FeedbackType = 'survey' | 'rating' | 'suggestion' | 'complaint' | 'compliment' | 'inquiry' | 'report' | 'testimonial';
type FeedbackStatus = 'submitted' | 'under_review' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed' | 'archived';
type FeedbackCategory = 'emergency_response' | 'communication' | 'shelters' | 'medical' | 'logistics' | 'personnel' | 'technology' | 'accessibility' | 'coordination' | 'recovery' | 'general';
type FeedbackPriority = 'low' | 'medium' | 'high' | 'urgent';
type SentimentType = 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
type SurveyQuestionType = 'rating' | 'text' | 'choice' | 'multichoice' | 'scale' | 'yes_no' | 'date' | 'ranking';

// Feedback interfaces
interface PublicFeedback {
  id: string;
  type: FeedbackType;
  category: FeedbackCategory;
  subcategory?: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  title: string;
  description: string;
  submitter: SubmitterInfo;
  incident?: IncidentReference;
  rating?: RatingInfo;
  attachments: FeedbackAttachment[];
  sentiment: SentimentAnalysis;
  assignment?: FeedbackAssignment;
  responses: FeedbackResponse[];
  timeline: FeedbackEvent[];
  tags: string[];
  isPublic: boolean;
  isAnonymous: boolean;
  metadata: FeedbackMetadata;
  createdAt: Date;
  updatedAt: Date;
}

interface SubmitterInfo {
  id: string;
  type: 'citizen' | 'business' | 'organization' | 'government' | 'anonymous';
  name?: string;
  email?: string;
  phone?: string;
  location?: {
    city: string;
    state: string;
    zipCode?: string;
    coordinates?: { lat: number; lon: number };
  };
  previousFeedback: number;
  responseRate: number;
  affectedByDisaster: boolean;
  role?: string;
  organization?: string;
}

interface IncidentReference {
  incidentId: string;
  incidentType: string;
  incidentDate: Date;
  location?: string;
  responders?: string[];
  services?: string[];
}

interface RatingInfo {
  overall: number; // 1-5
  categories?: {
    responseTime?: number;
    communication?: number;
    professionalism?: number;
    effectiveness?: number;
    empathy?: number;
    followUp?: number;
  };
  recommendationScore?: number; // 0-10 NPS
  wouldUseAgain?: boolean;
}

interface FeedbackAttachment {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

interface SentimentAnalysis {
  overall: SentimentType;
  score: number; // -1 to 1
  confidence: number; // 0-100
  emotions: {
    anger: number;
    fear: number;
    sadness: number;
    joy: number;
    surprise: number;
    trust: number;
  };
  keywords: { word: string; sentiment: SentimentType; frequency: number }[];
  topics: string[];
}

interface FeedbackAssignment {
  assignedTo: string;
  assignedBy: string;
  assignedAt: Date;
  department: string;
  team?: string;
  dueDate?: Date;
  escalationLevel: number;
  notes?: string;
}

interface FeedbackResponse {
  id: string;
  responderId: string;
  responderName: string;
  responderRole: string;
  isOfficial: boolean;
  message: string;
  isPublic: boolean;
  actionsTaken?: string[];
  attachments?: string[];
  createdAt: Date;
}

interface FeedbackEvent {
  id: string;
  type: 'submitted' | 'updated' | 'assigned' | 'responded' | 'escalated' | 'resolved' | 'reopened' | 'closed';
  timestamp: Date;
  actor: string;
  actorType: 'system' | 'submitter' | 'staff' | 'manager';
  description: string;
  details?: Record<string, any>;
}

interface FeedbackMetadata {
  source: 'web' | 'mobile' | 'phone' | 'email' | 'in_person' | 'social_media' | 'kiosk';
  language: string;
  translated: boolean;
  deviceInfo?: {
    platform: string;
    browser?: string;
    appVersion?: string;
  };
  referrer?: string;
  campaign?: string;
  surveyId?: string;
}

// Survey interfaces
interface FeedbackSurvey {
  id: string;
  title: string;
  description: string;
  type: 'post_incident' | 'satisfaction' | 'needs_assessment' | 'service_evaluation' | 'general' | 'custom';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  version: number;
  questions: SurveyQuestion[];
  settings: SurveySettings;
  targetAudience?: TargetAudience;
  schedule?: SurveySchedule;
  responses: SurveyResponse[];
  analytics?: SurveyAnalytics;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SurveyQuestion {
  id: string;
  order: number;
  type: SurveyQuestionType;
  question: string;
  description?: string;
  required: boolean;
  options?: string[];
  scale?: { min: number; max: number; minLabel?: string; maxLabel?: string };
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  conditionalLogic?: {
    dependsOn: string;
    condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
  category?: FeedbackCategory;
}

interface SurveySettings {
  allowAnonymous: boolean;
  requireEmail: boolean;
  showProgressBar: boolean;
  randomizeQuestions: boolean;
  limitResponses?: number;
  responseLimit?: 'one_per_person' | 'unlimited';
  thankYouMessage: string;
  notifyOnResponse: boolean;
  notifyEmails: string[];
}

interface TargetAudience {
  affectedAreas?: string[];
  incidentTypes?: string[];
  demographics?: {
    ageGroups?: string[];
    languages?: string[];
  };
  previousRespondents?: 'include' | 'exclude';
  customCriteria?: string;
}

interface SurveySchedule {
  startDate: Date;
  endDate?: Date;
  reminderDays?: number[];
  autoClose: boolean;
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  answers: SurveyAnswer[];
  completedAt: Date;
  duration: number; // seconds
  isComplete: boolean;
  device: string;
  language: string;
}

interface SurveyAnswer {
  questionId: string;
  value: any;
  textValue?: string;
  timestamp: Date;
}

interface SurveyAnalytics {
  totalResponses: number;
  completionRate: number;
  averageCompletionTime: number;
  responsesByDay: { date: string; count: number }[];
  questionAnalytics: QuestionAnalytics[];
  npsScore?: number;
  satisfactionScore?: number;
  topThemes: { theme: string; count: number; sentiment: SentimentType }[];
}

interface QuestionAnalytics {
  questionId: string;
  responseCount: number;
  skipCount: number;
  distribution?: { value: any; count: number; percentage: number }[];
  average?: number;
  textResponses?: { response: string; sentiment: SentimentType }[];
}

// Trend interfaces
interface FeedbackTrend {
  id: string;
  name: string;
  category: FeedbackCategory;
  type: 'emerging' | 'ongoing' | 'declining' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  feedbackIds: string[];
  feedbackCount: number;
  sentiment: SentimentType;
  firstSeen: Date;
  lastSeen: Date;
  keywords: string[];
  suggestedActions: string[];
  status: 'new' | 'acknowledged' | 'investigating' | 'action_taken' | 'closed';
}

// Report interfaces
interface FeedbackReport {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'incident' | 'custom';
  period: { start: Date; end: Date };
  summary: ReportSummary;
  categoryBreakdown: CategoryBreakdown[];
  sentimentAnalysis: AggregateSentiment;
  trends: FeedbackTrend[];
  topIssues: TopIssue[];
  topPraise: TopPraise[];
  recommendations: string[];
  generatedAt: Date;
  generatedBy: string;
}

interface ReportSummary {
  totalFeedback: number;
  newFeedback: number;
  resolvedFeedback: number;
  averageResolutionTime: number;
  averageRating: number;
  npsScore: number;
  responseRate: number;
  satisfactionTrend: 'improving' | 'stable' | 'declining';
}

interface CategoryBreakdown {
  category: FeedbackCategory;
  count: number;
  percentage: number;
  averageRating: number;
  sentiment: SentimentType;
  trend: 'up' | 'down' | 'stable';
}

interface AggregateSentiment {
  distribution: Record<SentimentType, number>;
  averageScore: number;
  trendDirection: 'positive' | 'negative' | 'neutral';
  weekOverWeekChange: number;
}

interface TopIssue {
  description: string;
  category: FeedbackCategory;
  count: number;
  sentiment: SentimentType;
  status: 'new' | 'addressing' | 'resolved';
  exampleFeedbackIds: string[];
}

interface TopPraise {
  description: string;
  category: FeedbackCategory;
  count: number;
  exampleFeedbackIds: string[];
}

// Action tracking
interface FeedbackAction {
  id: string;
  title: string;
  description: string;
  type: 'policy_change' | 'process_improvement' | 'training' | 'resource_allocation' | 'communication' | 'technology' | 'other';
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  priority: FeedbackPriority;
  relatedFeedbackIds: string[];
  relatedTrendIds: string[];
  owner: string;
  department: string;
  targetDate?: Date;
  completedDate?: Date;
  impact?: {
    expectedImprovement: string;
    measuredImprovement?: string;
    affectedMetrics: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Sample data
const sampleFeedback: PublicFeedback[] = [
  {
    id: 'feedback-001',
    type: 'rating',
    category: 'emergency_response',
    subcategory: 'Fire Department',
    status: 'resolved',
    priority: 'medium',
    title: 'Excellent response to house fire',
    description: 'The fire department responded within 5 minutes and handled the situation professionally. They even helped us find temporary housing. Very grateful for their service.',
    submitter: {
      id: 'user-001',
      type: 'citizen',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      location: { city: 'Metro City', state: 'CA', zipCode: '90002' },
      previousFeedback: 2,
      responseRate: 1.0,
      affectedByDisaster: true
    },
    incident: {
      incidentId: 'INC-2024-001',
      incidentType: 'House Fire',
      incidentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      location: '123 Oak Street',
      responders: ['Fire Station 7'],
      services: ['Fire Response', 'Medical', 'Social Services']
    },
    rating: {
      overall: 5,
      categories: {
        responseTime: 5,
        communication: 4,
        professionalism: 5,
        effectiveness: 5,
        empathy: 5,
        followUp: 4
      },
      recommendationScore: 10,
      wouldUseAgain: true
    },
    attachments: [],
    sentiment: {
      overall: 'very_positive',
      score: 0.92,
      confidence: 95,
      emotions: { anger: 0.02, fear: 0.05, sadness: 0.1, joy: 0.7, surprise: 0.08, trust: 0.85 },
      keywords: [
        { word: 'excellent', sentiment: 'very_positive', frequency: 1 },
        { word: 'professional', sentiment: 'positive', frequency: 1 },
        { word: 'grateful', sentiment: 'very_positive', frequency: 1 }
      ],
      topics: ['response_time', 'professionalism', 'support_services']
    },
    responses: [{
      id: 'response-001',
      responderId: 'staff-001',
      responderName: 'Fire Chief Martinez',
      responderRole: 'Fire Chief',
      isOfficial: true,
      message: 'Thank you for your kind words. We are glad our team could help during this difficult time. Please don\'t hesitate to reach out if you need any further assistance.',
      isPublic: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }],
    timeline: [],
    tags: ['positive', 'fire-response', 'commendation'],
    isPublic: true,
    isAnonymous: false,
    metadata: {
      source: 'web',
      language: 'en',
      translated: false
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

const sampleSurveys: FeedbackSurvey[] = [
  {
    id: 'survey-001',
    title: 'Post-Incident Satisfaction Survey',
    description: 'Help us improve our emergency response services by sharing your experience.',
    type: 'post_incident',
    status: 'active',
    version: 1,
    questions: [
      {
        id: 'q1',
        order: 1,
        type: 'rating',
        question: 'How satisfied were you with the overall emergency response?',
        required: true,
        scale: { min: 1, max: 5, minLabel: 'Very Dissatisfied', maxLabel: 'Very Satisfied' },
        category: 'emergency_response'
      },
      {
        id: 'q2',
        order: 2,
        type: 'rating',
        question: 'How would you rate the response time?',
        required: true,
        scale: { min: 1, max: 5, minLabel: 'Very Slow', maxLabel: 'Very Fast' },
        category: 'emergency_response'
      },
      {
        id: 'q3',
        order: 3,
        type: 'text',
        question: 'What could we have done better?',
        required: false,
        validation: { maxLength: 1000 },
        category: 'general'
      },
      {
        id: 'q4',
        order: 4,
        type: 'scale',
        question: 'How likely are you to recommend our services to others?',
        description: 'Net Promoter Score',
        required: true,
        scale: { min: 0, max: 10, minLabel: 'Not at all likely', maxLabel: 'Extremely likely' },
        category: 'general'
      }
    ],
    settings: {
      allowAnonymous: true,
      requireEmail: false,
      showProgressBar: true,
      randomizeQuestions: false,
      responseLimit: 'one_per_person',
      thankYouMessage: 'Thank you for your feedback! Your input helps us improve our services.',
      notifyOnResponse: true,
      notifyEmails: ['feedback@emergency.gov']
    },
    responses: [],
    createdBy: 'admin-001',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class PublicFeedbackService {
  private static instance: PublicFeedbackService;
  private feedback: Map<string, PublicFeedback> = new Map();
  private surveys: Map<string, FeedbackSurvey> = new Map();
  private trends: Map<string, FeedbackTrend> = new Map();
  private reports: Map<string, FeedbackReport> = new Map();
  private actions: Map<string, FeedbackAction> = new Map();

  private readonly SENTIMENT_KEYWORDS = {
    very_positive: ['excellent', 'amazing', 'outstanding', 'exceptional', 'wonderful', 'fantastic', 'grateful', 'thankful'],
    positive: ['good', 'helpful', 'professional', 'efficient', 'friendly', 'quick', 'satisfied'],
    neutral: ['okay', 'average', 'adequate', 'acceptable', 'standard'],
    negative: ['slow', 'poor', 'disappointing', 'unhelpful', 'difficult', 'frustrated', 'confused'],
    very_negative: ['terrible', 'awful', 'horrible', 'worst', 'angry', 'unacceptable', 'dangerous', 'negligent']
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): PublicFeedbackService {
    if (!PublicFeedbackService.instance) {
      PublicFeedbackService.instance = new PublicFeedbackService();
    }
    return PublicFeedbackService.instance;
  }

  private initializeSampleData(): void {
    sampleFeedback.forEach(f => this.feedback.set(f.id, f));
    sampleSurveys.forEach(s => this.surveys.set(s.id, s));
  }

  // ==================== Feedback Submission ====================

  async submitFeedback(params: {
    type: FeedbackType;
    category: FeedbackCategory;
    subcategory?: string;
    title: string;
    description: string;
    submitter: Partial<SubmitterInfo>;
    incident?: IncidentReference;
    rating?: RatingInfo;
    attachments?: Omit<FeedbackAttachment, 'id' | 'uploadedAt'>[];
    tags?: string[];
    isAnonymous?: boolean;
    source?: FeedbackMetadata['source'];
  }): Promise<PublicFeedback> {
    // Analyze sentiment
    const sentiment = this.analyzeSentiment(params.title, params.description);

    // Determine priority based on sentiment and type
    const priority = this.determinePriority(params.type, sentiment);

    const feedback: PublicFeedback = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      category: params.category,
      subcategory: params.subcategory,
      status: 'submitted',
      priority,
      title: params.title,
      description: params.description,
      submitter: {
        id: params.submitter.id || `anon-${Date.now()}`,
        type: params.submitter.type || 'anonymous',
        name: params.isAnonymous ? undefined : params.submitter.name,
        email: params.submitter.email,
        phone: params.submitter.phone,
        location: params.submitter.location,
        previousFeedback: params.submitter.previousFeedback || 0,
        responseRate: params.submitter.responseRate || 0,
        affectedByDisaster: params.submitter.affectedByDisaster || false
      },
      incident: params.incident,
      rating: params.rating,
      attachments: (params.attachments || []).map(a => ({
        ...a,
        id: `attach-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        uploadedAt: new Date()
      })),
      sentiment,
      responses: [],
      timeline: [{
        id: `event-${Date.now()}`,
        type: 'submitted',
        timestamp: new Date(),
        actor: 'System',
        actorType: 'system',
        description: 'Feedback submitted'
      }],
      tags: params.tags || [],
      isPublic: false,
      isAnonymous: params.isAnonymous || false,
      metadata: {
        source: params.source || 'web',
        language: 'en',
        translated: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.feedback.set(feedback.id, feedback);

    // Check for trend patterns
    await this.detectTrends(feedback);

    return feedback;
  }

  private analyzeSentiment(title: string, description: string): SentimentAnalysis {
    const text = `${title} ${description}`.toLowerCase();
    const words = text.split(/\s+/);

    let score = 0;
    let matchCount = 0;
    const foundKeywords: { word: string; sentiment: SentimentType; frequency: number }[] = [];
    const emotionScores = { anger: 0, fear: 0, sadness: 0, joy: 0, surprise: 0, trust: 0 };

    for (const [sentiment, keywords] of Object.entries(this.SENTIMENT_KEYWORDS)) {
      for (const keyword of keywords) {
        const count = words.filter(w => w.includes(keyword)).length;
        if (count > 0) {
          matchCount += count;
          const sentimentScore = {
            very_positive: 1, positive: 0.5, neutral: 0,
            negative: -0.5, very_negative: -1
          }[sentiment];
          score += sentimentScore * count;

          foundKeywords.push({
            word: keyword,
            sentiment: sentiment as SentimentType,
            frequency: count
          });

          // Update emotion scores
          if (sentiment === 'very_positive' || sentiment === 'positive') {
            emotionScores.joy += count * 0.3;
            emotionScores.trust += count * 0.3;
          } else if (sentiment === 'negative' || sentiment === 'very_negative') {
            emotionScores.anger += count * 0.2;
            emotionScores.sadness += count * 0.2;
          }
        }
      }
    }

    const normalizedScore = matchCount > 0 ? score / matchCount : 0;

    let overall: SentimentType;
    if (normalizedScore >= 0.5) overall = 'very_positive';
    else if (normalizedScore >= 0.2) overall = 'positive';
    else if (normalizedScore >= -0.2) overall = 'neutral';
    else if (normalizedScore >= -0.5) overall = 'negative';
    else overall = 'very_negative';

    // Normalize emotion scores
    const emotionTotal = Object.values(emotionScores).reduce((a, b) => a + b, 0) || 1;
    for (const key of Object.keys(emotionScores) as (keyof typeof emotionScores)[]) {
      emotionScores[key] = emotionScores[key] / emotionTotal;
    }

    return {
      overall,
      score: normalizedScore,
      confidence: Math.min(95, 50 + matchCount * 10),
      emotions: emotionScores,
      keywords: foundKeywords.slice(0, 10),
      topics: this.extractTopics(text)
    };
  }

  private extractTopics(text: string): string[] {
    const topicKeywords: Record<string, string[]> = {
      response_time: ['quick', 'fast', 'slow', 'late', 'delayed', 'immediate', 'minutes', 'hours'],
      communication: ['called', 'informed', 'updated', 'notified', 'silent', 'unclear'],
      professionalism: ['professional', 'courteous', 'rude', 'helpful', 'unhelpful'],
      support_services: ['shelter', 'housing', 'food', 'medical', 'assistance'],
      equipment: ['equipment', 'tools', 'resources', 'supplies'],
      coordination: ['coordinated', 'organized', 'confused', 'chaotic']
    };

    const topics: string[] = [];
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(k => text.includes(k))) {
        topics.push(topic);
      }
    }

    return topics;
  }

  private determinePriority(type: FeedbackType, sentiment: SentimentAnalysis): FeedbackPriority {
    if (type === 'complaint' && (sentiment.overall === 'very_negative' || sentiment.overall === 'negative')) {
      return sentiment.overall === 'very_negative' ? 'urgent' : 'high';
    }
    if (sentiment.emotions.anger > 0.5 || sentiment.emotions.fear > 0.5) {
      return 'high';
    }
    if (type === 'inquiry') return 'medium';
    return 'low';
  }

  async getFeedback(feedbackId: string): Promise<PublicFeedback | null> {
    return this.feedback.get(feedbackId) || null;
  }

  async getFeedbackList(params?: {
    type?: FeedbackType;
    category?: FeedbackCategory;
    status?: FeedbackStatus;
    priority?: FeedbackPriority;
    sentiment?: SentimentType;
    submitterId?: string;
    incidentId?: string;
    dateRange?: { start: Date; end: Date };
    hasRating?: boolean;
    minRating?: number;
    isPublic?: boolean;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{ feedback: PublicFeedback[]; total: number }> {
    let feedbackList = Array.from(this.feedback.values());

    if (params?.type) {
      feedbackList = feedbackList.filter(f => f.type === params.type);
    }

    if (params?.category) {
      feedbackList = feedbackList.filter(f => f.category === params.category);
    }

    if (params?.status) {
      feedbackList = feedbackList.filter(f => f.status === params.status);
    }

    if (params?.priority) {
      feedbackList = feedbackList.filter(f => f.priority === params.priority);
    }

    if (params?.sentiment) {
      feedbackList = feedbackList.filter(f => f.sentiment.overall === params.sentiment);
    }

    if (params?.submitterId) {
      feedbackList = feedbackList.filter(f => f.submitter.id === params.submitterId);
    }

    if (params?.incidentId) {
      feedbackList = feedbackList.filter(f => f.incident?.incidentId === params.incidentId);
    }

    if (params?.dateRange) {
      feedbackList = feedbackList.filter(f =>
        f.createdAt >= params.dateRange!.start && f.createdAt <= params.dateRange!.end
      );
    }

    if (params?.hasRating) {
      feedbackList = feedbackList.filter(f => f.rating !== undefined);
    }

    if (params?.minRating) {
      feedbackList = feedbackList.filter(f => (f.rating?.overall || 0) >= params.minRating!);
    }

    if (params?.isPublic !== undefined) {
      feedbackList = feedbackList.filter(f => f.isPublic === params.isPublic);
    }

    if (params?.tags && params.tags.length > 0) {
      feedbackList = feedbackList.filter(f =>
        params.tags!.some(tag => f.tags.includes(tag))
      );
    }

    // Sort by priority and recency
    feedbackList.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const total = feedbackList.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || 50;
    feedbackList = feedbackList.slice(offset, offset + limit);

    return { feedback: feedbackList, total };
  }

  async updateFeedback(feedbackId: string, update: {
    status?: FeedbackStatus;
    priority?: FeedbackPriority;
    tags?: string[];
    isPublic?: boolean;
    actor: string;
    actorType: FeedbackEvent['actorType'];
    notes?: string;
  }): Promise<PublicFeedback> {
    const feedback = this.feedback.get(feedbackId);
    if (!feedback) throw new Error(`Feedback not found: ${feedbackId}`);

    const changes: string[] = [];

    if (update.status && update.status !== feedback.status) {
      changes.push(`Status: ${feedback.status} → ${update.status}`);
      feedback.status = update.status;
    }

    if (update.priority && update.priority !== feedback.priority) {
      changes.push(`Priority: ${feedback.priority} → ${update.priority}`);
      feedback.priority = update.priority;
    }

    if (update.tags) {
      feedback.tags = update.tags;
      changes.push('Tags updated');
    }

    if (update.isPublic !== undefined) {
      feedback.isPublic = update.isPublic;
      changes.push(`Visibility: ${update.isPublic ? 'public' : 'private'}`);
    }

    feedback.updatedAt = new Date();

    feedback.timeline.push({
      id: `event-${Date.now()}`,
      type: 'updated',
      timestamp: new Date(),
      actor: update.actor,
      actorType: update.actorType,
      description: changes.join('; ') + (update.notes ? ` - ${update.notes}` : '')
    });

    return feedback;
  }

  async assignFeedback(feedbackId: string, assignment: Omit<FeedbackAssignment, 'assignedAt' | 'escalationLevel'>): Promise<PublicFeedback> {
    const feedback = this.feedback.get(feedbackId);
    if (!feedback) throw new Error(`Feedback not found: ${feedbackId}`);

    feedback.assignment = {
      ...assignment,
      assignedAt: new Date(),
      escalationLevel: 1
    };
    feedback.status = 'in_progress';
    feedback.updatedAt = new Date();

    feedback.timeline.push({
      id: `event-${Date.now()}`,
      type: 'assigned',
      timestamp: new Date(),
      actor: assignment.assignedBy,
      actorType: 'staff',
      description: `Assigned to ${assignment.assignedTo} (${assignment.department})`
    });

    return feedback;
  }

  async respondToFeedback(feedbackId: string, response: Omit<FeedbackResponse, 'id' | 'createdAt'>): Promise<PublicFeedback> {
    const feedback = this.feedback.get(feedbackId);
    if (!feedback) throw new Error(`Feedback not found: ${feedbackId}`);

    const fullResponse: FeedbackResponse = {
      ...response,
      id: `response-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date()
    };

    feedback.responses.push(fullResponse);
    feedback.status = response.isOfficial ? 'acknowledged' : feedback.status;
    feedback.updatedAt = new Date();

    feedback.timeline.push({
      id: `event-${Date.now()}`,
      type: 'responded',
      timestamp: new Date(),
      actor: response.responderName,
      actorType: response.isOfficial ? 'staff' : 'staff',
      description: response.isOfficial ? 'Official response added' : 'Response added'
    });

    return feedback;
  }

  async resolveFeedback(feedbackId: string, resolution: {
    resolvedBy: string;
    resolutionNotes: string;
    actionsTaken?: string[];
  }): Promise<PublicFeedback> {
    const feedback = this.feedback.get(feedbackId);
    if (!feedback) throw new Error(`Feedback not found: ${feedbackId}`);

    feedback.status = 'resolved';
    feedback.updatedAt = new Date();

    feedback.timeline.push({
      id: `event-${Date.now()}`,
      type: 'resolved',
      timestamp: new Date(),
      actor: resolution.resolvedBy,
      actorType: 'staff',
      description: resolution.resolutionNotes,
      details: { actionsTaken: resolution.actionsTaken }
    });

    return feedback;
  }

  // ==================== Surveys ====================

  async createSurvey(params: Omit<FeedbackSurvey, 'id' | 'status' | 'version' | 'responses' | 'createdAt' | 'updatedAt'>): Promise<FeedbackSurvey> {
    const survey: FeedbackSurvey = {
      ...params,
      id: `survey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      version: 1,
      responses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.surveys.set(survey.id, survey);
    return survey;
  }

  async getSurvey(surveyId: string): Promise<FeedbackSurvey | null> {
    return this.surveys.get(surveyId) || null;
  }

  async getSurveys(params?: {
    type?: FeedbackSurvey['type'];
    status?: FeedbackSurvey['status'];
    createdBy?: string;
  }): Promise<FeedbackSurvey[]> {
    let surveys = Array.from(this.surveys.values());

    if (params?.type) {
      surveys = surveys.filter(s => s.type === params.type);
    }

    if (params?.status) {
      surveys = surveys.filter(s => s.status === params.status);
    }

    if (params?.createdBy) {
      surveys = surveys.filter(s => s.createdBy === params.createdBy);
    }

    return surveys.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async activateSurvey(surveyId: string): Promise<FeedbackSurvey> {
    const survey = this.surveys.get(surveyId);
    if (!survey) throw new Error(`Survey not found: ${surveyId}`);

    survey.status = 'active';
    survey.updatedAt = new Date();
    if (survey.schedule && !survey.schedule.startDate) {
      survey.schedule.startDate = new Date();
    }

    return survey;
  }

  async submitSurveyResponse(surveyId: string, response: Omit<SurveyResponse, 'id' | 'completedAt'>): Promise<SurveyResponse> {
    const survey = this.surveys.get(surveyId);
    if (!survey) throw new Error(`Survey not found: ${surveyId}`);
    if (survey.status !== 'active') throw new Error('Survey is not active');

    const fullResponse: SurveyResponse = {
      ...response,
      id: `response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      completedAt: new Date()
    };

    survey.responses.push(fullResponse);
    survey.updatedAt = new Date();

    // Update analytics
    await this.updateSurveyAnalytics(surveyId);

    return fullResponse;
  }

  private async updateSurveyAnalytics(surveyId: string): Promise<void> {
    const survey = this.surveys.get(surveyId);
    if (!survey) return;

    const responses = survey.responses;
    const totalResponses = responses.length;
    const completeResponses = responses.filter(r => r.isComplete);
    const completionRate = totalResponses > 0 ? (completeResponses.length / totalResponses) * 100 : 0;
    const averageCompletionTime = completeResponses.length > 0
      ? completeResponses.reduce((sum, r) => sum + r.duration, 0) / completeResponses.length
      : 0;

    // Calculate NPS if applicable
    const npsQuestion = survey.questions.find(q => q.scale?.min === 0 && q.scale?.max === 10);
    let npsScore: number | undefined;
    if (npsQuestion) {
      const npsAnswers = responses
        .map(r => r.answers.find(a => a.questionId === npsQuestion.id)?.value)
        .filter((v): v is number => typeof v === 'number');

      if (npsAnswers.length > 0) {
        const promoters = npsAnswers.filter(v => v >= 9).length;
        const detractors = npsAnswers.filter(v => v <= 6).length;
        npsScore = ((promoters - detractors) / npsAnswers.length) * 100;
      }
    }

    // Calculate question analytics
    const questionAnalytics: QuestionAnalytics[] = survey.questions.map(q => {
      const answers = responses.map(r => r.answers.find(a => a.questionId === q.id)).filter(Boolean);
      const responseCount = answers.length;
      const skipCount = responses.length - responseCount;

      let distribution: { value: any; count: number; percentage: number }[] | undefined;
      let average: number | undefined;

      if (q.type === 'rating' || q.type === 'scale') {
        const values = answers.map(a => a!.value).filter((v): v is number => typeof v === 'number');
        if (values.length > 0) {
          average = values.reduce((a, b) => a + b, 0) / values.length;
          const valueCounts: Record<number, number> = {};
          values.forEach(v => { valueCounts[v] = (valueCounts[v] || 0) + 1; });
          distribution = Object.entries(valueCounts).map(([value, count]) => ({
            value: Number(value),
            count,
            percentage: (count / values.length) * 100
          }));
        }
      } else if (q.type === 'choice' || q.type === 'multichoice') {
        const valueCounts: Record<string, number> = {};
        answers.forEach(a => {
          const values = Array.isArray(a!.value) ? a!.value : [a!.value];
          values.forEach((v: string) => { valueCounts[v] = (valueCounts[v] || 0) + 1; });
        });
        const total = Object.values(valueCounts).reduce((a, b) => a + b, 0);
        distribution = Object.entries(valueCounts).map(([value, count]) => ({
          value,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0
        }));
      }

      return { questionId: q.id, responseCount, skipCount, distribution, average };
    });

    // Response by day
    const responsesByDay: { date: string; count: number }[] = [];
    const dayGroups: Record<string, number> = {};
    responses.forEach(r => {
      const dateKey = r.completedAt.toISOString().split('T')[0];
      dayGroups[dateKey] = (dayGroups[dateKey] || 0) + 1;
    });
    Object.entries(dayGroups).forEach(([date, count]) => {
      responsesByDay.push({ date, count });
    });

    survey.analytics = {
      totalResponses,
      completionRate,
      averageCompletionTime,
      responsesByDay: responsesByDay.sort((a, b) => a.date.localeCompare(b.date)),
      questionAnalytics,
      npsScore,
      satisfactionScore: undefined, // Could calculate from rating questions
      topThemes: []
    };
  }

  async getSurveyAnalytics(surveyId: string): Promise<SurveyAnalytics | null> {
    const survey = this.surveys.get(surveyId);
    if (!survey) return null;

    if (!survey.analytics) {
      await this.updateSurveyAnalytics(surveyId);
    }

    return survey.analytics || null;
  }

  // ==================== Trend Detection ====================

  private async detectTrends(newFeedback: PublicFeedback): Promise<void> {
    // Simple trend detection based on keywords and categories
    const recentFeedback = Array.from(this.feedback.values()).filter(f =>
      f.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) &&
      f.category === newFeedback.category
    );

    if (recentFeedback.length >= 5) {
      // Check for common keywords
      const keywordCounts: Record<string, number> = {};
      recentFeedback.forEach(f => {
        f.sentiment.keywords.forEach(k => {
          keywordCounts[k.word] = (keywordCounts[k.word] || 0) + 1;
        });
      });

      const commonKeywords = Object.entries(keywordCounts)
        .filter(([, count]) => count >= 3)
        .map(([word]) => word);

      if (commonKeywords.length > 0) {
        // Check if trend already exists
        const existingTrend = Array.from(this.trends.values()).find(t =>
          t.category === newFeedback.category &&
          t.status !== 'closed' &&
          commonKeywords.some(k => t.keywords.includes(k))
        );

        if (existingTrend) {
          existingTrend.feedbackIds.push(newFeedback.id);
          existingTrend.feedbackCount++;
          existingTrend.lastSeen = new Date();
        } else {
          // Create new trend
          const avgSentiment = recentFeedback.reduce((sum, f) => sum + f.sentiment.score, 0) / recentFeedback.length;
          const trend: FeedbackTrend = {
            id: `trend-${Date.now()}`,
            name: `${newFeedback.category} - ${commonKeywords[0]}`,
            category: newFeedback.category,
            type: 'emerging',
            severity: avgSentiment < -0.3 ? 'high' : avgSentiment < 0 ? 'medium' : 'low',
            description: `Emerging trend in ${newFeedback.category} feedback with keywords: ${commonKeywords.join(', ')}`,
            feedbackIds: recentFeedback.map(f => f.id),
            feedbackCount: recentFeedback.length,
            sentiment: avgSentiment >= 0.2 ? 'positive' : avgSentiment <= -0.2 ? 'negative' : 'neutral',
            firstSeen: new Date(Math.min(...recentFeedback.map(f => f.createdAt.getTime()))),
            lastSeen: new Date(),
            keywords: commonKeywords,
            suggestedActions: [],
            status: 'new'
          };
          this.trends.set(trend.id, trend);
        }
      }
    }
  }

  async getTrends(params?: {
    category?: FeedbackCategory;
    type?: FeedbackTrend['type'];
    status?: FeedbackTrend['status'];
    minSeverity?: FeedbackTrend['severity'];
  }): Promise<FeedbackTrend[]> {
    let trends = Array.from(this.trends.values());

    if (params?.category) {
      trends = trends.filter(t => t.category === params.category);
    }

    if (params?.type) {
      trends = trends.filter(t => t.type === params.type);
    }

    if (params?.status) {
      trends = trends.filter(t => t.status === params.status);
    }

    if (params?.minSeverity) {
      const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
      trends = trends.filter(t =>
        severityOrder[t.severity] >= severityOrder[params.minSeverity!]
      );
    }

    return trends.sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  }

  // ==================== Actions ====================

  async createAction(params: Omit<FeedbackAction, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<FeedbackAction> {
    const action: FeedbackAction = {
      ...params,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'proposed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.actions.set(action.id, action);
    return action;
  }

  async getActions(params?: {
    status?: FeedbackAction['status'];
    type?: FeedbackAction['type'];
    department?: string;
    owner?: string;
  }): Promise<FeedbackAction[]> {
    let actions = Array.from(this.actions.values());

    if (params?.status) {
      actions = actions.filter(a => a.status === params.status);
    }

    if (params?.type) {
      actions = actions.filter(a => a.type === params.type);
    }

    if (params?.department) {
      actions = actions.filter(a => a.department === params.department);
    }

    if (params?.owner) {
      actions = actions.filter(a => a.owner === params.owner);
    }

    return actions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateActionStatus(actionId: string, status: FeedbackAction['status']): Promise<FeedbackAction> {
    const action = this.actions.get(actionId);
    if (!action) throw new Error(`Action not found: ${actionId}`);

    action.status = status;
    if (status === 'completed') {
      action.completedDate = new Date();
    }
    action.updatedAt = new Date();

    return action;
  }

  // ==================== Reports ====================

  async generateReport(params: {
    title: string;
    type: FeedbackReport['type'];
    period: { start: Date; end: Date };
    generatedBy: string;
  }): Promise<FeedbackReport> {
    const feedbackInPeriod = Array.from(this.feedback.values()).filter(f =>
      f.createdAt >= params.period.start && f.createdAt <= params.period.end
    );

    // Calculate summary
    const newFeedback = feedbackInPeriod.filter(f => f.status === 'submitted').length;
    const resolvedFeedback = feedbackInPeriod.filter(f => f.status === 'resolved').length;
    const withRating = feedbackInPeriod.filter(f => f.rating);
    const averageRating = withRating.length > 0
      ? withRating.reduce((sum, f) => sum + (f.rating?.overall || 0), 0) / withRating.length
      : 0;

    // Calculate NPS
    const npsScores = withRating
      .map(f => f.rating?.recommendationScore)
      .filter((s): s is number => s !== undefined);
    const npsScore = npsScores.length > 0
      ? ((npsScores.filter(s => s >= 9).length - npsScores.filter(s => s <= 6).length) / npsScores.length) * 100
      : 0;

    // Category breakdown
    const categoryGroups: Record<FeedbackCategory, PublicFeedback[]> = {} as any;
    feedbackInPeriod.forEach(f => {
      if (!categoryGroups[f.category]) categoryGroups[f.category] = [];
      categoryGroups[f.category].push(f);
    });

    const categoryBreakdown: CategoryBreakdown[] = Object.entries(categoryGroups).map(([category, items]) => {
      const withRating = items.filter(f => f.rating);
      const avgRating = withRating.length > 0
        ? withRating.reduce((sum, f) => sum + (f.rating?.overall || 0), 0) / withRating.length
        : 0;
      const avgSentiment = items.reduce((sum, f) => sum + f.sentiment.score, 0) / items.length;

      return {
        category: category as FeedbackCategory,
        count: items.length,
        percentage: feedbackInPeriod.length > 0 ? (items.length / feedbackInPeriod.length) * 100 : 0,
        averageRating: avgRating,
        sentiment: avgSentiment >= 0.2 ? 'positive' : avgSentiment <= -0.2 ? 'negative' : 'neutral',
        trend: 'stable'
      };
    });

    // Sentiment analysis
    const sentimentDistribution: Record<SentimentType, number> = {
      very_positive: 0, positive: 0, neutral: 0, negative: 0, very_negative: 0
    };
    feedbackInPeriod.forEach(f => {
      sentimentDistribution[f.sentiment.overall]++;
    });

    const report: FeedbackReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: params.title,
      type: params.type,
      period: params.period,
      summary: {
        totalFeedback: feedbackInPeriod.length,
        newFeedback,
        resolvedFeedback,
        averageResolutionTime: 24, // Would need more data
        averageRating,
        npsScore,
        responseRate: 85, // Would need more data
        satisfactionTrend: 'stable'
      },
      categoryBreakdown,
      sentimentAnalysis: {
        distribution: sentimentDistribution,
        averageScore: feedbackInPeriod.length > 0
          ? feedbackInPeriod.reduce((sum, f) => sum + f.sentiment.score, 0) / feedbackInPeriod.length
          : 0,
        trendDirection: 'neutral',
        weekOverWeekChange: 0
      },
      trends: Array.from(this.trends.values()).filter(t =>
        t.lastSeen >= params.period.start && t.lastSeen <= params.period.end
      ),
      topIssues: [],
      topPraise: [],
      recommendations: [],
      generatedAt: new Date(),
      generatedBy: params.generatedBy
    };

    this.reports.set(report.id, report);
    return report;
  }

  async getReports(params?: {
    type?: FeedbackReport['type'];
    limit?: number;
  }): Promise<FeedbackReport[]> {
    let reports = Array.from(this.reports.values());

    if (params?.type) {
      reports = reports.filter(r => r.type === params.type);
    }

    reports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());

    if (params?.limit) {
      reports = reports.slice(0, params.limit);
    }

    return reports;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalFeedback: number;
    byType: Record<FeedbackType, number>;
    byCategory: Record<FeedbackCategory, number>;
    byStatus: Record<FeedbackStatus, number>;
    bySentiment: Record<SentimentType, number>;
    averageRating: number;
    npsScore: number;
    responseRate: number;
    averageResolutionTime: number;
    feedbackThisWeek: number;
    feedbackThisMonth: number;
    activeSurveys: number;
    activeTrends: number;
    pendingActions: number;
  }> {
    const feedbackList = Array.from(this.feedback.values());
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const byType: Record<FeedbackType, number> = {} as any;
    const byCategory: Record<FeedbackCategory, number> = {} as any;
    const byStatus: Record<FeedbackStatus, number> = {} as any;
    const bySentiment: Record<SentimentType, number> = {} as any;

    let totalRating = 0;
    let ratingCount = 0;
    const npsScores: number[] = [];

    feedbackList.forEach(f => {
      byType[f.type] = (byType[f.type] || 0) + 1;
      byCategory[f.category] = (byCategory[f.category] || 0) + 1;
      byStatus[f.status] = (byStatus[f.status] || 0) + 1;
      bySentiment[f.sentiment.overall] = (bySentiment[f.sentiment.overall] || 0) + 1;

      if (f.rating?.overall) {
        totalRating += f.rating.overall;
        ratingCount++;
      }

      if (f.rating?.recommendationScore !== undefined) {
        npsScores.push(f.rating.recommendationScore);
      }
    });

    const npsScore = npsScores.length > 0
      ? ((npsScores.filter(s => s >= 9).length - npsScores.filter(s => s <= 6).length) / npsScores.length) * 100
      : 0;

    const surveys = Array.from(this.surveys.values());
    const trends = Array.from(this.trends.values());
    const actions = Array.from(this.actions.values());

    return {
      totalFeedback: feedbackList.length,
      byType,
      byCategory,
      byStatus,
      bySentiment,
      averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
      npsScore,
      responseRate: 85, // Would calculate based on responded feedback
      averageResolutionTime: 24, // Would calculate based on resolution times
      feedbackThisWeek: feedbackList.filter(f => f.createdAt >= weekAgo).length,
      feedbackThisMonth: feedbackList.filter(f => f.createdAt >= monthAgo).length,
      activeSurveys: surveys.filter(s => s.status === 'active').length,
      activeTrends: trends.filter(t => t.status !== 'closed').length,
      pendingActions: actions.filter(a => a.status === 'proposed' || a.status === 'approved').length
    };
  }
}

export const publicFeedbackService = PublicFeedbackService.getInstance();
export default PublicFeedbackService;
