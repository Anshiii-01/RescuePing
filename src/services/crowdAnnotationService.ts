/**
 * Crowd-sourced Map Annotation Service
 * Community-driven disaster reporting and map annotations
 */

// Annotation types
type AnnotationType = 
  | 'hazard'
  | 'shelter'
  | 'medical'
  | 'food'
  | 'water'
  | 'road_blocked'
  | 'road_clear'
  | 'power_outage'
  | 'flooding'
  | 'fire'
  | 'rescue_needed'
  | 'safe_zone'
  | 'evacuation_point'
  | 'volunteer_hub'
  | 'missing_person'
  | 'found_person'
  | 'animal_rescue'
  | 'donation_center'
  | 'fuel_station'
  | 'communication_hub';

// Annotation severity
type AnnotationSeverity = 'low' | 'medium' | 'high' | 'critical';

// Verification status
type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'disputed' | 'false_report';

// Annotation interface
interface MapAnnotation {
  id: string;
  type: AnnotationType;
  severity: AnnotationSeverity;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
    accuracy?: number;
  };
  media: {
    images: string[];
    videos: string[];
    audio: string[];
  };
  author: {
    id: string;
    name: string;
    trustScore: number;
    isVerified: boolean;
  };
  verification: {
    status: VerificationStatus;
    verifiers: string[];
    disputeReasons: string[];
    officialSource?: string;
  };
  engagement: {
    upvotes: number;
    downvotes: number;
    comments: number;
    shares: number;
    reports: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
    tags: string[];
    disasterEventId?: string;
  };
}

// Comment on annotation
interface AnnotationComment {
  id: string;
  annotationId: string;
  authorId: string;
  authorName: string;
  content: string;
  media?: string[];
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  isOfficial: boolean;
}

// Annotation filter
interface AnnotationFilter {
  types?: AnnotationType[];
  severities?: AnnotationSeverity[];
  verificationStatus?: VerificationStatus[];
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  radius?: {
    lat: number;
    lng: number;
    km: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  minTrustScore?: number;
  onlyVerified?: boolean;
  tags?: string[];
  disasterEventId?: string;
}

// Annotation icons and colors
const ANNOTATION_CONFIG: Record<AnnotationType, { icon: string; color: string; priority: number }> = {
  hazard: { icon: '⚠️', color: '#FF5722', priority: 10 },
  rescue_needed: { icon: '🆘', color: '#F44336', priority: 9 },
  fire: { icon: '🔥', color: '#FF5722', priority: 9 },
  flooding: { icon: '🌊', color: '#2196F3', priority: 8 },
  road_blocked: { icon: '🚧', color: '#FF9800', priority: 7 },
  power_outage: { icon: '⚡', color: '#9C27B0', priority: 6 },
  missing_person: { icon: '🔍', color: '#E91E63', priority: 8 },
  found_person: { icon: '✅', color: '#4CAF50', priority: 5 },
  shelter: { icon: '🏠', color: '#4CAF50', priority: 4 },
  medical: { icon: '🏥', color: '#F44336', priority: 7 },
  food: { icon: '🍽️', color: '#8BC34A', priority: 3 },
  water: { icon: '💧', color: '#03A9F4', priority: 4 },
  safe_zone: { icon: '✓', color: '#4CAF50', priority: 5 },
  evacuation_point: { icon: '🚶', color: '#FF9800', priority: 6 },
  volunteer_hub: { icon: '🤝', color: '#9C27B0', priority: 3 },
  road_clear: { icon: '✓', color: '#4CAF50', priority: 2 },
  animal_rescue: { icon: '🐕', color: '#795548', priority: 4 },
  donation_center: { icon: '📦', color: '#607D8B', priority: 2 },
  fuel_station: { icon: '⛽', color: '#FF5722', priority: 3 },
  communication_hub: { icon: '📡', color: '#3F51B5', priority: 4 },
};

// Trust score thresholds
const TRUST_THRESHOLDS = {
  newUser: 0,
  regular: 25,
  trusted: 50,
  expert: 75,
  official: 90,
};

// Spam detection patterns
const SPAM_PATTERNS = [
  /(.)\1{5,}/i, // Repeated characters
  /\b(spam|fake|test|asdf)\b/i,
  /[A-Z]{10,}/, // Excessive caps
  /(.{3,})\1{3,}/, // Repeated phrases
];

class CrowdAnnotationService {
  private static instance: CrowdAnnotationService;
  private annotations: Map<string, MapAnnotation> = new Map();
  private comments: Map<string, AnnotationComment[]> = new Map();
  private userVotes: Map<string, Map<string, 'up' | 'down'>> = new Map();
  private listeners: ((annotations: MapAnnotation[]) => void)[] = [];

  private constructor() {
    this.initializeTestData();
  }

  public static getInstance(): CrowdAnnotationService {
    if (!CrowdAnnotationService.instance) {
      CrowdAnnotationService.instance = new CrowdAnnotationService();
    }
    return CrowdAnnotationService.instance;
  }

  /**
   * Initialize with sample data
   */
  private initializeTestData(): void {
    const testAnnotations: Omit<MapAnnotation, 'id'>[] = [
      {
        type: 'flooding',
        severity: 'high',
        title: 'Heavy flooding on NH44',
        description: 'Road completely submerged near Moolakothalam. Vehicles stranded. Avoid this route.',
        location: { lat: 10.5276, lng: 76.2144, address: 'NH44, Thrissur' },
        media: { images: [], videos: [], audio: [] },
        author: { id: 'user1', name: 'Rajesh Kumar', trustScore: 72, isVerified: false },
        verification: { status: 'verified', verifiers: ['user2', 'user3'], disputeReasons: [] },
        engagement: { upvotes: 156, downvotes: 3, comments: 23, shares: 45, reports: 0 },
        metadata: { createdAt: new Date(), updatedAt: new Date(), isActive: true, tags: ['flood', 'road', 'emergency'] },
      },
      {
        type: 'shelter',
        severity: 'low',
        title: 'Government School Relief Camp',
        description: 'Shelter available at Government Higher Secondary School. Capacity: 500. Food and water provided.',
        location: { lat: 10.5125, lng: 76.2228, address: 'Govt HSS, Thrissur' },
        media: { images: [], videos: [], audio: [] },
        author: { id: 'official1', name: 'District Collector Office', trustScore: 95, isVerified: true },
        verification: { status: 'verified', verifiers: [], disputeReasons: [], officialSource: 'District Administration' },
        engagement: { upvotes: 234, downvotes: 1, comments: 12, shares: 89, reports: 0 },
        metadata: { createdAt: new Date(), updatedAt: new Date(), isActive: true, tags: ['shelter', 'official', 'food'] },
      },
      {
        type: 'rescue_needed',
        severity: 'critical',
        title: 'Family trapped on rooftop',
        description: '4 people including 2 children trapped on rooftop. Water level rising. Need immediate rescue.',
        location: { lat: 10.5189, lng: 76.2089, address: 'Pattikkad Road, Thrissur' },
        media: { images: [], videos: [], audio: [] },
        author: { id: 'user4', name: 'Ananya Menon', trustScore: 45, isVerified: false },
        verification: { status: 'pending', verifiers: ['user5'], disputeReasons: [] },
        engagement: { upvotes: 89, downvotes: 0, comments: 34, shares: 67, reports: 0 },
        metadata: { createdAt: new Date(), updatedAt: new Date(), isActive: true, tags: ['rescue', 'urgent', 'children'] },
      },
      {
        type: 'medical',
        severity: 'high',
        title: 'Medical Camp Setup',
        description: 'Free medical camp by Lions Club. Doctors available. Medicines distributed.',
        location: { lat: 10.5301, lng: 76.2156, address: 'Town Hall, Thrissur' },
        media: { images: [], videos: [], audio: [] },
        author: { id: 'user6', name: 'Lions Club Thrissur', trustScore: 88, isVerified: true },
        verification: { status: 'verified', verifiers: ['official1'], disputeReasons: [] },
        engagement: { upvotes: 178, downvotes: 2, comments: 8, shares: 56, reports: 0 },
        metadata: { createdAt: new Date(), updatedAt: new Date(), isActive: true, tags: ['medical', 'free', 'ngo'] },
      },
      {
        type: 'road_blocked',
        severity: 'medium',
        title: 'Landslide blocking road',
        description: 'Minor landslide blocking one lane. Slow traffic. Clearing in progress.',
        location: { lat: 10.5432, lng: 76.1987, address: 'Wadakkanchery Road' },
        media: { images: [], videos: [], audio: [] },
        author: { id: 'user7', name: 'Traffic Police', trustScore: 92, isVerified: true },
        verification: { status: 'verified', verifiers: [], disputeReasons: [], officialSource: 'Traffic Police' },
        engagement: { upvotes: 67, downvotes: 1, comments: 5, shares: 23, reports: 0 },
        metadata: { createdAt: new Date(), updatedAt: new Date(), isActive: true, tags: ['landslide', 'traffic'] },
      },
    ];

    testAnnotations.forEach((annotation) => {
      const id = this.generateId();
      this.annotations.set(id, { ...annotation, id });
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `ann-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create new annotation
   */
  public async createAnnotation(
    type: AnnotationType,
    title: string,
    description: string,
    location: MapAnnotation['location'],
    severity: AnnotationSeverity,
    author: MapAnnotation['author'],
    media?: Partial<MapAnnotation['media']>,
    tags?: string[]
  ): Promise<MapAnnotation> {
    // Validate content
    const validation = this.validateContent(title, description);
    if (!validation.valid) {
      throw new Error(validation.reason);
    }

    const id = this.generateId();
    const now = new Date();

    const annotation: MapAnnotation = {
      id,
      type,
      severity,
      title: this.sanitizeText(title),
      description: this.sanitizeText(description),
      location,
      media: {
        images: media?.images || [],
        videos: media?.videos || [],
        audio: media?.audio || [],
      },
      author,
      verification: {
        status: author.trustScore >= TRUST_THRESHOLDS.expert ? 'verified' : 'unverified',
        verifiers: [],
        disputeReasons: [],
      },
      engagement: {
        upvotes: 0,
        downvotes: 0,
        comments: 0,
        shares: 0,
        reports: 0,
      },
      metadata: {
        createdAt: now,
        updatedAt: now,
        isActive: true,
        tags: tags || this.autoGenerateTags(type, title, description),
        expiresAt: this.calculateExpiry(type),
      },
    };

    this.annotations.set(id, annotation);
    this.notifyListeners();

    return annotation;
  }

  /**
   * Validate content
   */
  private validateContent(title: string, description: string): { valid: boolean; reason?: string } {
    if (!title || title.length < 5) {
      return { valid: false, reason: 'Title too short (minimum 5 characters)' };
    }

    if (title.length > 100) {
      return { valid: false, reason: 'Title too long (maximum 100 characters)' };
    }

    if (!description || description.length < 20) {
      return { valid: false, reason: 'Description too short (minimum 20 characters)' };
    }

    if (description.length > 1000) {
      return { valid: false, reason: 'Description too long (maximum 1000 characters)' };
    }

    // Check for spam
    for (const pattern of SPAM_PATTERNS) {
      if (pattern.test(title) || pattern.test(description)) {
        return { valid: false, reason: 'Content flagged as potential spam' };
      }
    }

    return { valid: true };
  }

  /**
   * Sanitize text
   */
  private sanitizeText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim();
  }

  /**
   * Auto-generate tags
   */
  private autoGenerateTags(type: AnnotationType, title: string, description: string): string[] {
    const tags: Set<string> = new Set([type]);
    const text = `${title} ${description}`.toLowerCase();

    // Emergency keywords
    const emergencyKeywords = ['urgent', 'emergency', 'help', 'rescue', 'trapped', 'critical'];
    emergencyKeywords.forEach((keyword) => {
      if (text.includes(keyword)) tags.add('emergency');
    });

    // Location keywords
    const locationKeywords = ['road', 'highway', 'bridge', 'river', 'building', 'school', 'hospital'];
    locationKeywords.forEach((keyword) => {
      if (text.includes(keyword)) tags.add(keyword);
    });

    // Disaster keywords
    const disasterKeywords = ['flood', 'fire', 'earthquake', 'landslide', 'cyclone', 'storm'];
    disasterKeywords.forEach((keyword) => {
      if (text.includes(keyword)) tags.add(keyword);
    });

    return Array.from(tags);
  }

  /**
   * Calculate expiry time
   */
  private calculateExpiry(type: AnnotationType): Date {
    const now = new Date();
    const expiryHours: Record<AnnotationType, number> = {
      rescue_needed: 6,
      fire: 12,
      flooding: 48,
      hazard: 72,
      road_blocked: 24,
      power_outage: 24,
      missing_person: 168, // 7 days
      found_person: 24,
      shelter: 168,
      medical: 72,
      food: 48,
      water: 48,
      safe_zone: 168,
      evacuation_point: 168,
      volunteer_hub: 168,
      road_clear: 24,
      animal_rescue: 72,
      donation_center: 168,
      fuel_station: 48,
      communication_hub: 168,
    };

    return new Date(now.getTime() + expiryHours[type] * 60 * 60 * 1000);
  }

  /**
   * Update annotation
   */
  public async updateAnnotation(
    id: string,
    updates: Partial<Pick<MapAnnotation, 'title' | 'description' | 'severity' | 'media' | 'metadata'>>
  ): Promise<MapAnnotation | null> {
    const annotation = this.annotations.get(id);
    if (!annotation) return null;

    if (updates.title) annotation.title = this.sanitizeText(updates.title);
    if (updates.description) annotation.description = this.sanitizeText(updates.description);
    if (updates.severity) annotation.severity = updates.severity;
    if (updates.media) annotation.media = { ...annotation.media, ...updates.media };
    if (updates.metadata) annotation.metadata = { ...annotation.metadata, ...updates.metadata };

    annotation.metadata.updatedAt = new Date();
    this.notifyListeners();

    return annotation;
  }

  /**
   * Get annotations with filter
   */
  public getAnnotations(filter?: AnnotationFilter): MapAnnotation[] {
    let result = Array.from(this.annotations.values()).filter((a) => a.metadata.isActive);

    if (filter) {
      if (filter.types?.length) {
        result = result.filter((a) => filter.types!.includes(a.type));
      }

      if (filter.severities?.length) {
        result = result.filter((a) => filter.severities!.includes(a.severity));
      }

      if (filter.verificationStatus?.length) {
        result = result.filter((a) => filter.verificationStatus!.includes(a.verification.status));
      }

      if (filter.bounds) {
        result = result.filter(
          (a) =>
            a.location.lat >= filter.bounds!.south &&
            a.location.lat <= filter.bounds!.north &&
            a.location.lng >= filter.bounds!.west &&
            a.location.lng <= filter.bounds!.east
        );
      }

      if (filter.radius) {
        result = result.filter((a) => {
          const distance = this.calculateDistance(
            filter.radius!.lat,
            filter.radius!.lng,
            a.location.lat,
            a.location.lng
          );
          return distance <= filter.radius!.km;
        });
      }

      if (filter.dateRange) {
        result = result.filter(
          (a) =>
            a.metadata.createdAt >= filter.dateRange!.start &&
            a.metadata.createdAt <= filter.dateRange!.end
        );
      }

      if (filter.minTrustScore !== undefined) {
        result = result.filter((a) => a.author.trustScore >= filter.minTrustScore!);
      }

      if (filter.onlyVerified) {
        result = result.filter((a) => a.verification.status === 'verified');
      }

      if (filter.tags?.length) {
        result = result.filter((a) => filter.tags!.some((t) => a.metadata.tags.includes(t)));
      }

      if (filter.disasterEventId) {
        result = result.filter((a) => a.metadata.disasterEventId === filter.disasterEventId);
      }
    }

    // Sort by priority and recency
    result.sort((a, b) => {
      const priorityDiff = ANNOTATION_CONFIG[b.type].priority - ANNOTATION_CONFIG[a.type].priority;
      if (priorityDiff !== 0) return priorityDiff;
      return b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime();
    });

    return result;
  }

  /**
   * Calculate distance between two points
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Vote on annotation
   */
  public vote(annotationId: string, userId: string, voteType: 'up' | 'down'): void {
    const annotation = this.annotations.get(annotationId);
    if (!annotation) return;

    if (!this.userVotes.has(userId)) {
      this.userVotes.set(userId, new Map());
    }

    const userVoteMap = this.userVotes.get(userId)!;
    const existingVote = userVoteMap.get(annotationId);

    // Remove existing vote
    if (existingVote === 'up') annotation.engagement.upvotes--;
    if (existingVote === 'down') annotation.engagement.downvotes--;

    // Add new vote if different
    if (existingVote !== voteType) {
      if (voteType === 'up') annotation.engagement.upvotes++;
      if (voteType === 'down') annotation.engagement.downvotes++;
      userVoteMap.set(annotationId, voteType);
    } else {
      userVoteMap.delete(annotationId);
    }

    // Update verification status based on votes
    this.updateVerificationFromVotes(annotation);
    this.notifyListeners();
  }

  /**
   * Update verification based on community votes
   */
  private updateVerificationFromVotes(annotation: MapAnnotation): void {
    const { upvotes, downvotes } = annotation.engagement;
    const totalVotes = upvotes + downvotes;

    if (totalVotes >= 10) {
      const upvoteRatio = upvotes / totalVotes;

      if (upvoteRatio >= 0.8 && annotation.verification.status === 'unverified') {
        annotation.verification.status = 'pending';
      } else if (upvoteRatio >= 0.9 && totalVotes >= 20) {
        annotation.verification.status = 'verified';
      } else if (upvoteRatio <= 0.3 && totalVotes >= 15) {
        annotation.verification.status = 'disputed';
      }
    }
  }

  /**
   * Verify annotation
   */
  public verify(annotationId: string, verifierId: string, isOfficial: boolean): void {
    const annotation = this.annotations.get(annotationId);
    if (!annotation) return;

    if (!annotation.verification.verifiers.includes(verifierId)) {
      annotation.verification.verifiers.push(verifierId);
    }

    if (isOfficial || annotation.verification.verifiers.length >= 3) {
      annotation.verification.status = 'verified';
    } else if (annotation.verification.status === 'unverified') {
      annotation.verification.status = 'pending';
    }

    this.notifyListeners();
  }

  /**
   * Dispute annotation
   */
  public dispute(annotationId: string, reason: string): void {
    const annotation = this.annotations.get(annotationId);
    if (!annotation) return;

    annotation.verification.disputeReasons.push(reason);

    if (annotation.verification.disputeReasons.length >= 3) {
      annotation.verification.status = 'disputed';
    }

    this.notifyListeners();
  }

  /**
   * Report annotation as false
   */
  public report(annotationId: string, reason: string): void {
    const annotation = this.annotations.get(annotationId);
    if (!annotation) return;

    annotation.engagement.reports++;

    if (annotation.engagement.reports >= 5) {
      annotation.verification.status = 'false_report';
      annotation.metadata.isActive = false;
    }

    this.notifyListeners();
  }

  /**
   * Add comment
   */
  public addComment(
    annotationId: string,
    authorId: string,
    authorName: string,
    content: string,
    isOfficial: boolean = false,
    media?: string[]
  ): AnnotationComment {
    const annotation = this.annotations.get(annotationId);
    if (!annotation) throw new Error('Annotation not found');

    const comment: AnnotationComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      annotationId,
      authorId,
      authorName,
      content: this.sanitizeText(content),
      media,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
      isOfficial,
    };

    if (!this.comments.has(annotationId)) {
      this.comments.set(annotationId, []);
    }

    this.comments.get(annotationId)!.push(comment);
    annotation.engagement.comments++;
    this.notifyListeners();

    return comment;
  }

  /**
   * Get comments
   */
  public getComments(annotationId: string): AnnotationComment[] {
    return this.comments.get(annotationId) || [];
  }

  /**
   * Share annotation
   */
  public share(annotationId: string): { url: string; text: string } {
    const annotation = this.annotations.get(annotationId);
    if (!annotation) throw new Error('Annotation not found');

    annotation.engagement.shares++;
    this.notifyListeners();

    const config = ANNOTATION_CONFIG[annotation.type];
    return {
      url: `https://rescueping.app/annotation/${annotationId}`,
      text: `${config.icon} ${annotation.title}\n📍 ${annotation.location.address || 'Location'}\n${annotation.description}\n\n#RescuePing #DisasterResponse`,
    };
  }

  /**
   * Get annotation statistics
   */
  public getStatistics(): {
    total: number;
    byType: Record<AnnotationType, number>;
    bySeverity: Record<AnnotationSeverity, number>;
    byStatus: Record<VerificationStatus, number>;
    activeEmergencies: number;
  } {
    const annotations = Array.from(this.annotations.values()).filter((a) => a.metadata.isActive);

    const byType = {} as Record<AnnotationType, number>;
    const bySeverity = {} as Record<AnnotationSeverity, number>;
    const byStatus = {} as Record<VerificationStatus, number>;

    annotations.forEach((a) => {
      byType[a.type] = (byType[a.type] || 0) + 1;
      bySeverity[a.severity] = (bySeverity[a.severity] || 0) + 1;
      byStatus[a.verification.status] = (byStatus[a.verification.status] || 0) + 1;
    });

    const emergencyTypes: AnnotationType[] = ['rescue_needed', 'fire', 'flooding', 'hazard'];
    const activeEmergencies = annotations.filter(
      (a) => emergencyTypes.includes(a.type) && a.severity === 'critical'
    ).length;

    return {
      total: annotations.length,
      byType,
      bySeverity,
      byStatus,
      activeEmergencies,
    };
  }

  /**
   * Get nearby annotations
   */
  public getNearby(lat: number, lng: number, radiusKm: number = 10): MapAnnotation[] {
    return this.getAnnotations({ radius: { lat, lng, km: radiusKm } });
  }

  /**
   * Get trending annotations
   */
  public getTrending(limit: number = 10): MapAnnotation[] {
    const annotations = Array.from(this.annotations.values()).filter((a) => a.metadata.isActive);

    // Calculate trend score
    const withScores = annotations.map((a) => {
      const ageHours = (Date.now() - a.metadata.createdAt.getTime()) / (1000 * 60 * 60);
      const engagementScore =
        a.engagement.upvotes * 2 +
        a.engagement.comments * 3 +
        a.engagement.shares * 5 -
        a.engagement.downvotes * 2;
      const trendScore = engagementScore / Math.pow(ageHours + 2, 1.5);
      return { annotation: a, trendScore };
    });

    return withScores
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit)
      .map((item) => item.annotation);
  }

  /**
   * Cleanup expired annotations
   */
  public cleanupExpired(): number {
    let count = 0;
    const now = new Date();

    this.annotations.forEach((annotation, id) => {
      if (annotation.metadata.expiresAt && annotation.metadata.expiresAt < now) {
        annotation.metadata.isActive = false;
        count++;
      }
    });

    if (count > 0) this.notifyListeners();
    return count;
  }

  /**
   * Subscribe to changes
   */
  public subscribe(callback: (annotations: MapAnnotation[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    const annotations = this.getAnnotations();
    this.listeners.forEach((callback) => callback(annotations));
  }

  /**
   * Get annotation config
   */
  public getAnnotationConfig(): typeof ANNOTATION_CONFIG {
    return ANNOTATION_CONFIG;
  }

  /**
   * Get annotation types
   */
  public getAnnotationTypes(): AnnotationType[] {
    return Object.keys(ANNOTATION_CONFIG) as AnnotationType[];
  }
}

export const crowdAnnotationService = CrowdAnnotationService.getInstance();
export type {
  MapAnnotation,
  AnnotationType,
  AnnotationSeverity,
  VerificationStatus,
  AnnotationComment,
  AnnotationFilter,
};
