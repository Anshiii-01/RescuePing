// @ts-nocheck
/**
 * Citizen Training Service - Issue #156 Implementation
 * 
 * Provides comprehensive citizen preparedness training for disaster response
 * including emergency preparedness courses, certification programs, drill scheduling,
 * skills tracking, community education, and public awareness campaigns.
 */

// Type definitions
type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
type CourseFormat = 'online' | 'in_person' | 'hybrid' | 'self_paced' | 'live_virtual';
type CourseStatus = 'draft' | 'published' | 'archived' | 'scheduled';
type EnrollmentStatus = 'registered' | 'in_progress' | 'completed' | 'dropped' | 'waitlisted';
type ContentType = 'video' | 'document' | 'quiz' | 'simulation' | 'interactive' | 'audio' | 'presentation';
type DrillType = 'evacuation' | 'shelter_in_place' | 'fire' | 'earthquake' | 'flood' | 'active_threat' | 'medical' | 'communication' | 'full_scale';
type CertificationType = 'cpr' | 'first_aid' | 'cert' | 'fire_safety' | 'hazmat' | 'search_rescue' | 'emergency_preparedness' | 'community_response';

// Course interfaces
interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: CourseCategory;
  level: CourseLevel;
  format: CourseFormat;
  status: CourseStatus;
  modules: CourseModule[];
  prerequisites: string[];
  objectives: string[];
  targetAudience: string[];
  duration: number; // minutes
  estimatedTime: number; // minutes for self-paced
  certification?: CertificationInfo;
  instructor?: InstructorInfo;
  schedule?: CourseSchedule;
  capacity?: number;
  enrollments: CourseEnrollment[];
  ratings: CourseRating[];
  resources: CourseResource[];
  tags: string[];
  metadata: CourseMetadata;
  createdAt: Date;
  updatedAt: Date;
}

type CourseCategory = 
  | 'emergency_preparedness'
  | 'first_aid'
  | 'fire_safety'
  | 'natural_disaster'
  | 'communication'
  | 'evacuation'
  | 'shelter'
  | 'search_rescue'
  | 'community_response'
  | 'psychological_first_aid'
  | 'hazmat'
  | 'family_planning';

interface CourseModule {
  id: string;
  order: number;
  title: string;
  description: string;
  duration: number; // minutes
  content: ModuleContent[];
  objectives: string[];
  completionCriteria: CompletionCriteria;
  isRequired: boolean;
}

interface ModuleContent {
  id: string;
  order: number;
  type: ContentType;
  title: string;
  description?: string;
  url?: string;
  duration?: number;
  fileSize?: number;
  metadata?: Record<string, any>;
}

interface CompletionCriteria {
  type: 'view_all' | 'quiz_pass' | 'time_spent' | 'all_activities';
  minScore?: number;
  minTime?: number; // minutes
  requiredActivities?: string[];
}

interface CertificationInfo {
  type: CertificationType;
  name: string;
  issuingAuthority: string;
  validityPeriod: number; // months
  renewalRequired: boolean;
  renewalProcess?: string;
  accreditations: string[];
  requirements: string[];
}

interface InstructorInfo {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo?: string;
  credentials: string[];
  specializations: string[];
  email: string;
  rating?: number;
  coursesLed: number;
}

interface CourseSchedule {
  sessions: ScheduledSession[];
  registrationDeadline?: Date;
  cancellationPolicy?: string;
}

interface ScheduledSession {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: SessionLocation;
  capacity: number;
  enrolled: number;
  waitlist: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

interface SessionLocation {
  type: 'physical' | 'virtual' | 'hybrid';
  name?: string;
  address?: string;
  coordinates?: { lat: number; lon: number };
  virtualLink?: string;
  accessInstructions?: string;
}

interface CourseEnrollment {
  id: string;
  odUserId: string;
  userName: string;
  userEmail: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  progress: EnrollmentProgress;
  sessionId?: string;
  certificateIssued: boolean;
  certificateId?: string;
  notes?: string;
}

interface EnrollmentProgress {
  overallPercent: number;
  moduleProgress: { moduleId: string; percent: number; completed: boolean }[];
  quizScores: { quizId: string; score: number; attempts: number; passed: boolean }[];
  timeSpent: number; // minutes
  lastAccessed?: Date;
  checkpoints: { name: string; timestamp: Date }[];
}

interface CourseRating {
  odUserId: string;
  userName: string;
  overall: number;
  categories: {
    content: number;
    instructor: number;
    materials: number;
    practicality: number;
  };
  review?: string;
  wouldRecommend: boolean;
  createdAt: Date;
}

interface CourseResource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'checklist' | 'template' | 'tool';
  url: string;
  description?: string;
  downloadable: boolean;
  fileSize?: number;
}

interface CourseMetadata {
  language: string;
  translations: string[];
  accessibilityFeatures: string[];
  lastReviewDate?: Date;
  version: string;
  updateHistory: { version: string; date: Date; changes: string }[];
}

// Drill interfaces
interface CommunityDrill {
  id: string;
  title: string;
  type: DrillType;
  description: string;
  objectives: string[];
  scenario: DrillScenario;
  schedule: DrillSchedule;
  location: DrillLocation;
  participants: DrillParticipant[];
  coordinators: DrillCoordinator[];
  resources: DrillResource[];
  safetyBriefing: string[];
  evaluation: DrillEvaluation;
  status: 'planned' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  publicEvent: boolean;
  mediaContact?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DrillScenario {
  description: string;
  timeline: ScenarioEvent[];
  expectedResponses: string[];
  injects: ScenarioInject[];
  successCriteria: string[];
}

interface ScenarioEvent {
  time: number; // minutes from start
  event: string;
  location?: string;
  expectedAction: string;
}

interface ScenarioInject {
  id: string;
  time: number;
  type: 'information' | 'complication' | 'resource_change' | 'communication';
  description: string;
  targetAudience: string;
}

interface DrillSchedule {
  date: Date;
  startTime: string;
  endTime: string;
  checkInTime: string;
  briefingTime: string;
  executionStart: string;
  debriefTime: string;
  alternateDate?: Date;
  weatherPolicy?: string;
}

interface DrillLocation {
  name: string;
  address: string;
  coordinates: { lat: number; lon: number };
  areas: { name: string; purpose: string }[];
  assemblyPoints: { lat: number; lon: number; name: string }[];
  accessRoutes: string[];
  restrictions?: string;
}

interface DrillParticipant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'citizen' | 'volunteer' | 'responder' | 'observer' | 'evaluator';
  role?: string;
  organization?: string;
  registeredAt: Date;
  attended: boolean;
  waiver: boolean;
  specialNeeds?: string;
  feedback?: DrillFeedback;
}

interface DrillCoordinator {
  id: string;
  name: string;
  role: string;
  responsibilities: string[];
  phone: string;
  email: string;
}

interface DrillResource {
  type: string;
  description: string;
  quantity: number;
  provider: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface DrillEvaluation {
  overallRating?: number;
  objectivesMet: { objective: string; met: boolean; notes: string }[];
  strengths: string[];
  areasForImprovement: string[];
  lessons: string[];
  recommendations: string[];
  evaluators: { name: string; organization: string; report?: string }[];
  metrics: DrillMetrics;
}

interface DrillMetrics {
  totalParticipants: number;
  responseTime?: number; // seconds
  evacuationTime?: number; // seconds
  communicationSuccess?: number; // percent
  objectivesAchieved: number;
  objectivesTotal: number;
  incidentsFree: boolean;
  incidents?: string[];
}

interface DrillFeedback {
  overallRating: number;
  realism: number;
  organization: number;
  communication: number;
  learned: string;
  suggestions: string;
  wouldParticipateAgain: boolean;
}

// Certification tracking
interface CitizenCertification {
  id: string;
  odUserId: string;
  userName: string;
  type: CertificationType;
  name: string;
  issuingAuthority: string;
  courseId?: string;
  courseName?: string;
  issuedDate: Date;
  expiryDate?: Date;
  certificateNumber: string;
  verificationUrl?: string;
  status: 'active' | 'expired' | 'revoked' | 'pending_renewal';
  renewalReminders: { sentAt: Date; daysBeforeExpiry: number }[];
  skills: string[];
}

// Learning path interfaces
interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  duration: number; // estimated total hours
  courses: LearningPathCourse[];
  finalCertification?: CertificationInfo;
  prerequisites: string[];
  objectives: string[];
  enrolledUsers: number;
  completedUsers: number;
  rating?: number;
  createdAt: Date;
}

interface LearningPathCourse {
  courseId: string;
  courseName: string;
  order: number;
  required: boolean;
  duration: number;
}

// Progress tracking
interface UserTrainingProgress {
  odUserId: string;
  userName: string;
  enrolledCourses: CourseEnrollment[];
  completedCourses: { courseId: string; courseName: string; completedAt: Date; score?: number }[];
  certifications: CitizenCertification[];
  drillParticipation: { drillId: string; drillName: string; date: Date; role: string }[];
  learningPaths: { pathId: string; pathName: string; progress: number; startedAt: Date }[];
  skills: UserSkill[];
  totalHoursLearned: number;
  achievements: Achievement[];
  streak: number;
  lastActive: Date;
}

interface UserSkill {
  name: string;
  category: string;
  level: 'novice' | 'intermediate' | 'proficient' | 'expert';
  acquiredFrom: string[];
  validatedDate?: Date;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'completion' | 'mastery' | 'participation' | 'community' | 'streak';
}

// Campaign interfaces
interface AwarenessCampaign {
  id: string;
  title: string;
  description: string;
  topic: string;
  objectives: string[];
  targetAudience: string[];
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed' | 'paused';
  channels: CampaignChannel[];
  content: CampaignContent[];
  events: CampaignEvent[];
  metrics: CampaignMetrics;
  budget?: number;
  sponsors?: string[];
}

interface CampaignChannel {
  type: 'social_media' | 'email' | 'sms' | 'website' | 'radio' | 'tv' | 'print' | 'community_event';
  platform?: string;
  reach?: number;
  schedule: { date: Date; content: string }[];
}

interface CampaignContent {
  id: string;
  type: 'article' | 'video' | 'infographic' | 'poster' | 'flyer' | 'social_post' | 'email';
  title: string;
  description: string;
  url?: string;
  publishDate?: Date;
  engagementMetrics?: { views: number; shares: number; likes: number };
}

interface CampaignEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  type: 'workshop' | 'webinar' | 'fair' | 'demonstration' | 'open_house';
  expectedAttendance: number;
  actualAttendance?: number;
}

interface CampaignMetrics {
  reach: number;
  engagement: number;
  registrations: number;
  completions: number;
  surveys: { sent: number; completed: number; averageRating: number };
}

// Sample data
const sampleCourses: TrainingCourse[] = [
  {
    id: 'course-001',
    title: 'Family Emergency Preparedness',
    description: 'Learn how to prepare your family for emergencies including creating emergency kits, communication plans, and evacuation procedures.',
    shortDescription: 'Essential family preparedness skills',
    category: 'emergency_preparedness',
    level: 'beginner',
    format: 'self_paced',
    status: 'published',
    modules: [
      {
        id: 'mod-001',
        order: 1,
        title: 'Understanding Emergency Risks',
        description: 'Learn about different types of emergencies and how to assess risks in your area.',
        duration: 30,
        content: [
          { id: 'content-001', order: 1, type: 'video', title: 'Types of Emergencies', duration: 15 },
          { id: 'content-002', order: 2, type: 'document', title: 'Risk Assessment Guide' },
          { id: 'content-003', order: 3, type: 'quiz', title: 'Risk Assessment Quiz' }
        ],
        objectives: ['Identify common emergency types', 'Conduct a home risk assessment'],
        completionCriteria: { type: 'quiz_pass', minScore: 70 },
        isRequired: true
      },
      {
        id: 'mod-002',
        order: 2,
        title: 'Building Emergency Kits',
        description: 'Learn what to include in your emergency supply kit for different scenarios.',
        duration: 45,
        content: [
          { id: 'content-004', order: 1, type: 'video', title: 'Emergency Kit Essentials', duration: 20 },
          { id: 'content-005', order: 2, type: 'interactive', title: 'Kit Builder Tool' },
          { id: 'content-006', order: 3, type: 'document', title: 'Printable Checklist' }
        ],
        objectives: ['List essential emergency supplies', 'Build a 72-hour kit'],
        completionCriteria: { type: 'view_all' },
        isRequired: true
      }
    ],
    prerequisites: [],
    objectives: [
      'Create a family emergency plan',
      'Build a 72-hour emergency kit',
      'Establish communication protocols',
      'Know evacuation routes and shelter locations'
    ],
    targetAudience: ['Families', 'Homeowners', 'Renters', 'Parents'],
    duration: 120,
    estimatedTime: 90,
    certification: {
      type: 'emergency_preparedness',
      name: 'Family Preparedness Certificate',
      issuingAuthority: 'Emergency Management Agency',
      validityPeriod: 24,
      renewalRequired: true,
      accreditations: [],
      requirements: ['Complete all modules', 'Pass final assessment with 80%+']
    },
    enrollments: [],
    ratings: [],
    resources: [
      { id: 'res-001', title: 'Emergency Kit Checklist', type: 'checklist', url: '/resources/kit-checklist.pdf', downloadable: true },
      { id: 'res-002', title: 'Family Communication Plan Template', type: 'template', url: '/resources/comm-plan.pdf', downloadable: true }
    ],
    tags: ['beginner', 'family', 'preparedness', 'popular'],
    metadata: {
      language: 'en',
      translations: ['es', 'zh', 'vi'],
      accessibilityFeatures: ['closed_captions', 'screen_reader_compatible', 'keyboard_navigation'],
      version: '2.0'
    },
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

const sampleDrills: CommunityDrill[] = [
  {
    id: 'drill-001',
    title: 'Great ShakeOut Earthquake Drill',
    type: 'earthquake',
    description: 'Annual earthquake preparedness drill practicing Drop, Cover, and Hold On.',
    objectives: [
      'Practice Drop, Cover, and Hold On technique',
      'Test communication systems',
      'Evaluate evacuation procedures'
    ],
    scenario: {
      description: 'A magnitude 7.0 earthquake strikes the region at 10:15 AM.',
      timeline: [
        { time: 0, event: 'Earthquake alarm sounds', expectedAction: 'Drop, Cover, Hold On' },
        { time: 2, event: 'Shaking stops', location: 'All areas', expectedAction: 'Assess immediate surroundings' },
        { time: 5, event: 'Evacuation order', expectedAction: 'Proceed to assembly points' },
        { time: 15, event: 'Accountability check', expectedAction: 'Report to coordinator' }
      ],
      expectedResponses: ['Immediate protective action', 'Safe evacuation', 'Successful communication'],
      injects: [],
      successCriteria: ['90% participation in protective action', 'Complete evacuation within 10 minutes']
    },
    schedule: {
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      startTime: '10:00',
      endTime: '11:30',
      checkInTime: '09:30',
      briefingTime: '09:45',
      executionStart: '10:15',
      debriefTime: '11:00'
    },
    location: {
      name: 'Metro City Community Center',
      address: '100 Community Way, Metro City',
      coordinates: { lat: 34.0522, lon: -118.2437 },
      areas: [
        { name: 'Main Hall', purpose: 'Primary drill area' },
        { name: 'Parking Lot', purpose: 'Assembly point' }
      ],
      assemblyPoints: [{ lat: 34.0525, lon: -118.2440, name: 'North Lot' }],
      accessRoutes: ['Main Street entrance', 'Oak Avenue entrance']
    },
    participants: [],
    coordinators: [
      {
        id: 'coord-001',
        name: 'Sarah Chen',
        role: 'Drill Commander',
        responsibilities: ['Overall coordination', 'Safety oversight'],
        phone: '555-0101',
        email: 'schen@emergency.gov'
      }
    ],
    resources: [
      { type: 'Equipment', description: 'Emergency alarm system', quantity: 1, provider: 'Facility', status: 'confirmed' },
      { type: 'Supplies', description: 'Safety vests', quantity: 20, provider: 'Emergency Management', status: 'confirmed' }
    ],
    safetyBriefing: [
      'No running during evacuation',
      'Watch for trip hazards',
      'Report any injuries immediately',
      'Use designated evacuation routes only'
    ],
    evaluation: {
      objectivesMet: [],
      strengths: [],
      areasForImprovement: [],
      lessons: [],
      recommendations: [],
      evaluators: [],
      metrics: {
        totalParticipants: 0,
        objectivesAchieved: 0,
        objectivesTotal: 3,
        incidentsFree: true
      }
    },
    status: 'scheduled',
    publicEvent: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class CitizenTrainingService {
  private static instance: CitizenTrainingService;
  private courses: Map<string, TrainingCourse> = new Map();
  private drills: Map<string, CommunityDrill> = new Map();
  private certifications: Map<string, CitizenCertification> = new Map();
  private learningPaths: Map<string, LearningPath> = new Map();
  private campaigns: Map<string, AwarenessCampaign> = new Map();
  private userProgress: Map<string, UserTrainingProgress> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CitizenTrainingService {
    if (!CitizenTrainingService.instance) {
      CitizenTrainingService.instance = new CitizenTrainingService();
    }
    return CitizenTrainingService.instance;
  }

  private initializeSampleData(): void {
    sampleCourses.forEach(c => this.courses.set(c.id, c));
    sampleDrills.forEach(d => this.drills.set(d.id, d));
  }

  // ==================== Course Management ====================

  async createCourse(params: Omit<TrainingCourse, 'id' | 'enrollments' | 'ratings' | 'createdAt' | 'updatedAt'>): Promise<TrainingCourse> {
    const course: TrainingCourse = {
      ...params,
      id: `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      enrollments: [],
      ratings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.courses.set(course.id, course);
    return course;
  }

  async getCourse(courseId: string): Promise<TrainingCourse | null> {
    return this.courses.get(courseId) || null;
  }

  async getCourses(params?: {
    category?: CourseCategory;
    level?: CourseLevel;
    format?: CourseFormat;
    status?: CourseStatus;
    hasCertification?: boolean;
    search?: string;
    limit?: number;
  }): Promise<TrainingCourse[]> {
    let courses = Array.from(this.courses.values());

    if (params?.category) {
      courses = courses.filter(c => c.category === params.category);
    }

    if (params?.level) {
      courses = courses.filter(c => c.level === params.level);
    }

    if (params?.format) {
      courses = courses.filter(c => c.format === params.format);
    }

    if (params?.status) {
      courses = courses.filter(c => c.status === params.status);
    }

    if (params?.hasCertification) {
      courses = courses.filter(c => c.certification !== undefined);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Sort by popularity (enrollment count)
    courses.sort((a, b) => b.enrollments.length - a.enrollments.length);

    if (params?.limit) {
      courses = courses.slice(0, params.limit);
    }

    return courses;
  }

  async updateCourse(courseId: string, update: Partial<TrainingCourse>): Promise<TrainingCourse> {
    const course = this.courses.get(courseId);
    if (!course) throw new Error(`Course not found: ${courseId}`);

    Object.assign(course, update, { updatedAt: new Date() });
    return course;
  }

  async publishCourse(courseId: string): Promise<TrainingCourse> {
    return this.updateCourse(courseId, { status: 'published' });
  }

  // ==================== Enrollment ====================

  async enrollInCourse(courseId: string, user: {
    odUserId: string;
    userName: string;
    userEmail: string;
  }, sessionId?: string): Promise<CourseEnrollment> {
    const course = this.courses.get(courseId);
    if (!course) throw new Error(`Course not found: ${courseId}`);

    // Check if already enrolled
    const existing = course.enrollments.find(e => e.odUserId === user.odUserId && e.status !== 'dropped');
    if (existing) throw new Error('User is already enrolled in this course');

    // Check capacity for scheduled sessions
    if (sessionId && course.schedule) {
      const session = course.schedule.sessions.find(s => s.id === sessionId);
      if (session && session.enrolled >= session.capacity) {
        throw new Error('Session is at capacity');
      }
    }

    const enrollment: CourseEnrollment = {
      id: `enrollment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...user,
      status: 'registered',
      enrolledAt: new Date(),
      progress: {
        overallPercent: 0,
        moduleProgress: course.modules.map(m => ({ moduleId: m.id, percent: 0, completed: false })),
        quizScores: [],
        timeSpent: 0,
        checkpoints: []
      },
      sessionId,
      certificateIssued: false
    };

    course.enrollments.push(enrollment);
    course.updatedAt = new Date();

    // Update user progress
    await this.updateUserProgress(user.odUserId, user.userName, {
      type: 'enroll',
      courseId,
      courseName: course.title
    });

    return enrollment;
  }

  async updateProgress(courseId: string, odUserId: string, progress: Partial<EnrollmentProgress>): Promise<CourseEnrollment> {
    const course = this.courses.get(courseId);
    if (!course) throw new Error(`Course not found: ${courseId}`);

    const enrollment = course.enrollments.find(e => e.odUserId === odUserId);
    if (!enrollment) throw new Error('Enrollment not found');

    Object.assign(enrollment.progress, progress);
    enrollment.progress.lastAccessed = new Date();

    // Update status based on progress
    if (enrollment.progress.overallPercent > 0 && enrollment.status === 'registered') {
      enrollment.status = 'in_progress';
      enrollment.startedAt = enrollment.startedAt || new Date();
    }

    // Check if completed
    if (enrollment.progress.overallPercent >= 100) {
      await this.completeCourse(courseId, odUserId);
    }

    return enrollment;
  }

  async completeCourse(courseId: string, odUserId: string): Promise<CourseEnrollment> {
    const course = this.courses.get(courseId);
    if (!course) throw new Error(`Course not found: ${courseId}`);

    const enrollment = course.enrollments.find(e => e.odUserId === odUserId);
    if (!enrollment) throw new Error('Enrollment not found');

    enrollment.status = 'completed';
    enrollment.completedAt = new Date();
    enrollment.progress.overallPercent = 100;

    // Issue certificate if applicable
    if (course.certification) {
      const certificate = await this.issueCertificate({
        odUserId: enrollment.odUserId,
        userName: enrollment.userName,
        type: course.certification.type,
        name: course.certification.name,
        issuingAuthority: course.certification.issuingAuthority,
        courseId,
        courseName: course.title,
        validityPeriod: course.certification.validityPeriod
      });
      enrollment.certificateIssued = true;
      enrollment.certificateId = certificate.id;
    }

    // Update user progress
    await this.updateUserProgress(odUserId, enrollment.userName, {
      type: 'complete',
      courseId,
      courseName: course.title
    });

    return enrollment;
  }

  async submitQuiz(courseId: string, odUserId: string, quizId: string, score: number): Promise<{
    passed: boolean;
    score: number;
    attempts: number;
  }> {
    const course = this.courses.get(courseId);
    if (!course) throw new Error(`Course not found: ${courseId}`);

    const enrollment = course.enrollments.find(e => e.odUserId === odUserId);
    if (!enrollment) throw new Error('Enrollment not found');

    let quizProgress = enrollment.progress.quizScores.find(q => q.quizId === quizId);
    if (quizProgress) {
      quizProgress.attempts++;
      quizProgress.score = Math.max(quizProgress.score, score);
    } else {
      quizProgress = { quizId, score, attempts: 1, passed: false };
      enrollment.progress.quizScores.push(quizProgress);
    }

    // Check if passed (assuming 70% threshold)
    quizProgress.passed = quizProgress.score >= 70;

    return {
      passed: quizProgress.passed,
      score: quizProgress.score,
      attempts: quizProgress.attempts
    };
  }

  async rateCourse(courseId: string, rating: Omit<CourseRating, 'createdAt'>): Promise<CourseRating> {
    const course = this.courses.get(courseId);
    if (!course) throw new Error(`Course not found: ${courseId}`);

    const fullRating: CourseRating = {
      ...rating,
      createdAt: new Date()
    };

    // Update or add rating
    const existingIndex = course.ratings.findIndex(r => r.odUserId === rating.odUserId);
    if (existingIndex >= 0) {
      course.ratings[existingIndex] = fullRating;
    } else {
      course.ratings.push(fullRating);
    }

    course.updatedAt = new Date();
    return fullRating;
  }

  // ==================== Drills ====================

  async createDrill(params: Omit<CommunityDrill, 'id' | 'participants' | 'evaluation' | 'createdAt' | 'updatedAt'>): Promise<CommunityDrill> {
    const drill: CommunityDrill = {
      ...params,
      id: `drill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      participants: [],
      evaluation: {
        objectivesMet: params.objectives.map(o => ({ objective: o, met: false, notes: '' })),
        strengths: [],
        areasForImprovement: [],
        lessons: [],
        recommendations: [],
        evaluators: [],
        metrics: {
          totalParticipants: 0,
          objectivesAchieved: 0,
          objectivesTotal: params.objectives.length,
          incidentsFree: true
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.drills.set(drill.id, drill);
    return drill;
  }

  async getDrill(drillId: string): Promise<CommunityDrill | null> {
    return this.drills.get(drillId) || null;
  }

  async getDrills(params?: {
    type?: DrillType;
    status?: CommunityDrill['status'];
    upcoming?: boolean;
    public?: boolean;
  }): Promise<CommunityDrill[]> {
    let drills = Array.from(this.drills.values());

    if (params?.type) {
      drills = drills.filter(d => d.type === params.type);
    }

    if (params?.status) {
      drills = drills.filter(d => d.status === params.status);
    }

    if (params?.upcoming) {
      drills = drills.filter(d =>
        d.schedule.date > new Date() &&
        (d.status === 'planned' || d.status === 'scheduled')
      );
    }

    if (params?.public !== undefined) {
      drills = drills.filter(d => d.publicEvent === params.public);
    }

    return drills.sort((a, b) => a.schedule.date.getTime() - b.schedule.date.getTime());
  }

  async registerForDrill(drillId: string, participant: Omit<DrillParticipant, 'id' | 'registeredAt' | 'attended' | 'feedback'>): Promise<DrillParticipant> {
    const drill = this.drills.get(drillId);
    if (!drill) throw new Error(`Drill not found: ${drillId}`);

    const fullParticipant: DrillParticipant = {
      ...participant,
      id: `participant-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      registeredAt: new Date(),
      attended: false
    };

    drill.participants.push(fullParticipant);
    drill.updatedAt = new Date();

    return fullParticipant;
  }

  async recordDrillAttendance(drillId: string, participantId: string, attended: boolean): Promise<DrillParticipant> {
    const drill = this.drills.get(drillId);
    if (!drill) throw new Error(`Drill not found: ${drillId}`);

    const participant = drill.participants.find(p => p.id === participantId);
    if (!participant) throw new Error('Participant not found');

    participant.attended = attended;

    // Update metrics
    drill.evaluation.metrics.totalParticipants = drill.participants.filter(p => p.attended).length;

    return participant;
  }

  async submitDrillFeedback(drillId: string, participantId: string, feedback: DrillFeedback): Promise<DrillParticipant> {
    const drill = this.drills.get(drillId);
    if (!drill) throw new Error(`Drill not found: ${drillId}`);

    const participant = drill.participants.find(p => p.id === participantId);
    if (!participant) throw new Error('Participant not found');

    participant.feedback = feedback;
    return participant;
  }

  async completeDrill(drillId: string, evaluation: Partial<DrillEvaluation>): Promise<CommunityDrill> {
    const drill = this.drills.get(drillId);
    if (!drill) throw new Error(`Drill not found: ${drillId}`);

    Object.assign(drill.evaluation, evaluation);
    drill.status = 'completed';
    drill.updatedAt = new Date();

    // Update user progress for all attendees
    for (const participant of drill.participants.filter(p => p.attended)) {
      if (participant.email) {
        const userProgress = this.userProgress.get(participant.email);
        if (userProgress) {
          userProgress.drillParticipation.push({
            drillId,
            drillName: drill.title,
            date: drill.schedule.date,
            role: participant.role || participant.type
          });
        }
      }
    }

    return drill;
  }

  // ==================== Certifications ====================

  async issueCertificate(params: {
    odUserId: string;
    userName: string;
    type: CertificationType;
    name: string;
    issuingAuthority: string;
    courseId?: string;
    courseName?: string;
    validityPeriod?: number;
  }): Promise<CitizenCertification> {
    const expiryDate = params.validityPeriod
      ? new Date(Date.now() + params.validityPeriod * 30 * 24 * 60 * 60 * 1000)
      : undefined;

    const certification: CitizenCertification = {
      id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      odUserId: params.odUserId,
      userName: params.userName,
      type: params.type,
      name: params.name,
      issuingAuthority: params.issuingAuthority,
      courseId: params.courseId,
      courseName: params.courseName,
      issuedDate: new Date(),
      expiryDate,
      certificateNumber: `CERT-${Date.now().toString(36).toUpperCase()}`,
      status: 'active',
      renewalReminders: [],
      skills: []
    };

    this.certifications.set(certification.id, certification);

    // Update user progress
    const userProgress = this.userProgress.get(params.odUserId);
    if (userProgress) {
      userProgress.certifications.push(certification);
    }

    return certification;
  }

  async getCertifications(params?: {
    odUserId?: string;
    type?: CertificationType;
    status?: CitizenCertification['status'];
    expiringSoon?: boolean;
  }): Promise<CitizenCertification[]> {
    let certs = Array.from(this.certifications.values());

    if (params?.odUserId) {
      certs = certs.filter(c => c.odUserId === params.odUserId);
    }

    if (params?.type) {
      certs = certs.filter(c => c.type === params.type);
    }

    if (params?.status) {
      certs = certs.filter(c => c.status === params.status);
    }

    if (params?.expiringSoon) {
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      certs = certs.filter(c =>
        c.expiryDate && c.expiryDate <= thirtyDaysFromNow && c.status === 'active'
      );
    }

    return certs.sort((a, b) => b.issuedDate.getTime() - a.issuedDate.getTime());
  }

  async verifyCertificate(certificateNumber: string): Promise<{
    valid: boolean;
    certificate?: CitizenCertification;
    message: string;
  }> {
    const cert = Array.from(this.certifications.values()).find(c =>
      c.certificateNumber === certificateNumber
    );

    if (!cert) {
      return { valid: false, message: 'Certificate not found' };
    }

    if (cert.status === 'revoked') {
      return { valid: false, certificate: cert, message: 'Certificate has been revoked' };
    }

    if (cert.status === 'expired' || (cert.expiryDate && cert.expiryDate < new Date())) {
      return { valid: false, certificate: cert, message: 'Certificate has expired' };
    }

    return { valid: true, certificate: cert, message: 'Certificate is valid' };
  }

  // ==================== Learning Paths ====================

  async createLearningPath(params: Omit<LearningPath, 'id' | 'enrolledUsers' | 'completedUsers' | 'createdAt'>): Promise<LearningPath> {
    const path: LearningPath = {
      ...params,
      id: `path-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      enrolledUsers: 0,
      completedUsers: 0,
      createdAt: new Date()
    };

    this.learningPaths.set(path.id, path);
    return path;
  }

  async getLearningPaths(params?: {
    level?: CourseLevel;
    hasCertification?: boolean;
  }): Promise<LearningPath[]> {
    let paths = Array.from(this.learningPaths.values());

    if (params?.level) {
      paths = paths.filter(p => p.level === params.level);
    }

    if (params?.hasCertification) {
      paths = paths.filter(p => p.finalCertification !== undefined);
    }

    return paths;
  }

  // ==================== User Progress ====================

  private async updateUserProgress(odUserId: string, userName: string, update: {
    type: 'enroll' | 'complete' | 'drill';
    courseId?: string;
    courseName?: string;
    drillId?: string;
    drillName?: string;
  }): Promise<void> {
    let progress = this.userProgress.get(odUserId);

    if (!progress) {
      progress = {
        odUserId,
        userName,
        enrolledCourses: [],
        completedCourses: [],
        certifications: [],
        drillParticipation: [],
        learningPaths: [],
        skills: [],
        totalHoursLearned: 0,
        achievements: [],
        streak: 1,
        lastActive: new Date()
      };
      this.userProgress.set(odUserId, progress);
    }

    if (update.type === 'complete' && update.courseId && update.courseName) {
      progress.completedCourses.push({
        courseId: update.courseId,
        courseName: update.courseName,
        completedAt: new Date()
      });

      // Check for achievements
      if (progress.completedCourses.length === 1) {
        progress.achievements.push({
          id: `ach-${Date.now()}`,
          name: 'First Steps',
          description: 'Completed your first course',
          icon: '🎓',
          earnedAt: new Date(),
          category: 'completion'
        });
      }
      if (progress.completedCourses.length === 5) {
        progress.achievements.push({
          id: `ach-${Date.now()}`,
          name: 'Dedicated Learner',
          description: 'Completed 5 courses',
          icon: '📚',
          earnedAt: new Date(),
          category: 'mastery'
        });
      }
    }

    progress.lastActive = new Date();
  }

  async getUserProgress(odUserId: string): Promise<UserTrainingProgress | null> {
    return this.userProgress.get(odUserId) || null;
  }

  // ==================== Campaigns ====================

  async createCampaign(params: Omit<AwarenessCampaign, 'id' | 'metrics'>): Promise<AwarenessCampaign> {
    const campaign: AwarenessCampaign = {
      ...params,
      id: `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metrics: {
        reach: 0,
        engagement: 0,
        registrations: 0,
        completions: 0,
        surveys: { sent: 0, completed: 0, averageRating: 0 }
      }
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async getCampaigns(params?: {
    status?: AwarenessCampaign['status'];
    topic?: string;
  }): Promise<AwarenessCampaign[]> {
    let campaigns = Array.from(this.campaigns.values());

    if (params?.status) {
      campaigns = campaigns.filter(c => c.status === params.status);
    }

    if (params?.topic) {
      campaigns = campaigns.filter(c => c.topic.toLowerCase().includes(params.topic!.toLowerCase()));
    }

    return campaigns.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalCourses: number;
    publishedCourses: number;
    totalEnrollments: number;
    completionRate: number;
    totalCertificationsIssued: number;
    activeCertifications: number;
    upcomingDrills: number;
    totalDrillParticipants: number;
    activeCampaigns: number;
    averageCourseRating: number;
    byCategory: Record<CourseCategory, number>;
    byLevel: Record<CourseLevel, number>;
    popularCourses: { id: string; title: string; enrollments: number }[];
  }> {
    const courses = Array.from(this.courses.values());
    const certifications = Array.from(this.certifications.values());
    const drills = Array.from(this.drills.values());
    const campaigns = Array.from(this.campaigns.values());

    let totalEnrollments = 0;
    let completedEnrollments = 0;
    let totalRatings = 0;
    let ratingSum = 0;

    const byCategory: Record<CourseCategory, number> = {} as any;
    const byLevel: Record<CourseLevel, number> = {} as any;

    courses.forEach(c => {
      totalEnrollments += c.enrollments.length;
      completedEnrollments += c.enrollments.filter(e => e.status === 'completed').length;
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
      byLevel[c.level] = (byLevel[c.level] || 0) + 1;

      c.ratings.forEach(r => {
        totalRatings++;
        ratingSum += r.overall;
      });
    });

    const upcomingDrills = drills.filter(d =>
      d.schedule.date > new Date() && d.status === 'scheduled'
    );

    const popularCourses = courses
      .filter(c => c.status === 'published')
      .sort((a, b) => b.enrollments.length - a.enrollments.length)
      .slice(0, 10)
      .map(c => ({ id: c.id, title: c.title, enrollments: c.enrollments.length }));

    return {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.status === 'published').length,
      totalEnrollments,
      completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0,
      totalCertificationsIssued: certifications.length,
      activeCertifications: certifications.filter(c => c.status === 'active').length,
      upcomingDrills: upcomingDrills.length,
      totalDrillParticipants: drills.reduce((sum, d) => sum + d.participants.length, 0),
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      averageCourseRating: totalRatings > 0 ? ratingSum / totalRatings : 0,
      byCategory,
      byLevel,
      popularCourses
    };
  }
}

export const citizenTrainingService = CitizenTrainingService.getInstance();
export default CitizenTrainingService;
