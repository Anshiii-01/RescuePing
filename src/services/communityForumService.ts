/**
 * Community Forum Service
 * Discussion forum for disaster preparedness and response
 */

// Forum categories
type ForumCategory = 
  | 'announcements'
  | 'general_discussion'
  | 'emergency_updates'
  | 'preparedness_tips'
  | 'resource_sharing'
  | 'volunteer_coordination'
  | 'local_communities'
  | 'recovery_support'
  | 'technical_help'
  | 'feedback_suggestions';

// Post status
type PostStatus = 'draft' | 'published' | 'pinned' | 'locked' | 'archived' | 'removed';

// User role
type UserRole = 'admin' | 'moderator' | 'official' | 'verified' | 'member' | 'guest';

// Content type
type ContentType = 'text' | 'image' | 'video' | 'link' | 'poll' | 'alert_reference';

// Reaction type
type ReactionType = 'like' | 'helpful' | 'support' | 'prayer' | 'informative';

// Forum post
interface ForumPost {
  id: string;
  title: string;
  content: string;
  contentType: ContentType;
  category: ForumCategory;
  author: ForumUser;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  attachments: Attachment[];
  poll?: Poll;
  alertReference?: string;
  location?: PostLocation;
  viewCount: number;
  replyCount: number;
  reactions: ReactionSummary;
  isPinned: boolean;
  isLocked: boolean;
  isAnnouncement: boolean;
  metadata: Record<string, unknown>;
}

// Forum user
interface ForumUser {
  id: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  badges: UserBadge[];
  reputation: number;
  joinedAt: Date;
  isVerified: boolean;
  location?: string;
  bio?: string;
}

// User badge
interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: Date;
}

// Attachment
interface Attachment {
  id: string;
  type: 'image' | 'document' | 'video';
  url: string;
  thumbnail?: string;
  name: string;
  size: number;
  mimeType: string;
}

// Poll
interface Poll {
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  endsAt?: Date;
  totalVotes: number;
  isAnonymous: boolean;
}

// Poll option
interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

// Post location
interface PostLocation {
  name: string;
  coordinates?: { lat: number; lng: number };
  district?: string;
  state?: string;
}

// Reaction summary
interface ReactionSummary {
  total: number;
  byType: Record<ReactionType, number>;
  userReaction?: ReactionType;
}

// Reply
interface ForumReply {
  id: string;
  postId: string;
  parentReplyId?: string;
  content: string;
  author: ForumUser;
  createdAt: Date;
  updatedAt: Date;
  attachments: Attachment[];
  reactions: ReactionSummary;
  isAcceptedAnswer: boolean;
  isModerationAction: boolean;
  status: 'visible' | 'hidden' | 'removed';
  children?: ForumReply[];
}

// Category info
interface CategoryInfo {
  id: ForumCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
  recentActivity?: Date;
  moderators: string[];
  rules: string[];
  isRestricted: boolean;
}

// Search filters
interface ForumSearchFilters {
  query?: string;
  categories?: ForumCategory[];
  authors?: string[];
  tags?: string[];
  dateRange?: { start: Date; end: Date };
  hasAttachments?: boolean;
  hasPoll?: boolean;
  location?: { state?: string; district?: string };
  status?: PostStatus[];
  minReactions?: number;
  minReplies?: number;
}

// Search result
interface ForumSearchResult {
  posts: ForumPost[];
  total: number;
  page: number;
  pageSize: number;
  suggestions?: string[];
}

// Notification
interface ForumNotification {
  id: string;
  userId: string;
  type: 'reply' | 'mention' | 'reaction' | 'follow' | 'badge' | 'moderation';
  title: string;
  message: string;
  postId?: string;
  replyId?: string;
  fromUser?: ForumUser;
  isRead: boolean;
  createdAt: Date;
}

// Report
interface ContentReport {
  id: string;
  contentType: 'post' | 'reply';
  contentId: string;
  reportedBy: string;
  reason: 'spam' | 'harassment' | 'misinformation' | 'inappropriate' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
}

// User stats
interface UserForumStats {
  userId: string;
  totalPosts: number;
  totalReplies: number;
  totalReactionsReceived: number;
  totalReactionsGiven: number;
  helpfulAnswers: number;
  reputation: number;
  joinedAt: Date;
  lastActiveAt: Date;
  topCategories: { category: ForumCategory; count: number }[];
  badges: UserBadge[];
}

// Default categories
const CATEGORY_INFO: CategoryInfo[] = [
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Official announcements from authorities and administrators',
    icon: '📢',
    color: '#D32F2F',
    postCount: 0,
    moderators: [],
    rules: ['Official posts only', 'No replies allowed on some posts'],
    isRestricted: true,
  },
  {
    id: 'emergency_updates',
    name: 'Emergency Updates',
    description: 'Real-time updates during active emergencies',
    icon: '🚨',
    color: '#F44336',
    postCount: 0,
    moderators: [],
    rules: ['Verified information only', 'Include source', 'No speculation'],
    isRestricted: false,
  },
  {
    id: 'general_discussion',
    name: 'General Discussion',
    description: 'Open discussions about disaster preparedness and response',
    icon: '💬',
    color: '#1976D2',
    postCount: 0,
    moderators: [],
    rules: ['Be respectful', 'Stay on topic', 'No spam'],
    isRestricted: false,
  },
  {
    id: 'preparedness_tips',
    name: 'Preparedness Tips',
    description: 'Share and learn disaster preparedness tips',
    icon: '📚',
    color: '#4CAF50',
    postCount: 0,
    moderators: [],
    rules: ['Share practical tips', 'Cite sources when possible'],
    isRestricted: false,
  },
  {
    id: 'resource_sharing',
    name: 'Resource Sharing',
    description: 'Share and find resources, supplies, and help',
    icon: '🤝',
    color: '#FF9800',
    postCount: 0,
    moderators: [],
    rules: ['Specify location', 'Update availability', 'No commercial posts'],
    isRestricted: false,
  },
  {
    id: 'volunteer_coordination',
    name: 'Volunteer Coordination',
    description: 'Coordinate volunteer activities and teams',
    icon: '🙋',
    color: '#9C27B0',
    postCount: 0,
    moderators: [],
    rules: ['Specify requirements', 'Include contact details', 'Update status'],
    isRestricted: false,
  },
  {
    id: 'local_communities',
    name: 'Local Communities',
    description: 'District and state-specific discussions',
    icon: '🏘️',
    color: '#00BCD4',
    postCount: 0,
    moderators: [],
    rules: ['Use location tags', 'Respect local context'],
    isRestricted: false,
  },
  {
    id: 'recovery_support',
    name: 'Recovery Support',
    description: 'Support and resources for disaster recovery',
    icon: '💪',
    color: '#795548',
    postCount: 0,
    moderators: [],
    rules: ['Be supportive', 'Share verified resources'],
    isRestricted: false,
  },
  {
    id: 'technical_help',
    name: 'Technical Help',
    description: 'Help with using the Rescue Ping platform',
    icon: '🔧',
    color: '#607D8B',
    postCount: 0,
    moderators: [],
    rules: ['Search before posting', 'Include details'],
    isRestricted: false,
  },
  {
    id: 'feedback_suggestions',
    name: 'Feedback & Suggestions',
    description: 'Share feedback and suggest improvements',
    icon: '💡',
    color: '#FFC107',
    postCount: 0,
    moderators: [],
    rules: ['Be constructive', 'Check existing suggestions'],
    isRestricted: false,
  },
];

// Available badges
const AVAILABLE_BADGES: Omit<UserBadge, 'earnedAt'>[] = [
  { id: 'first_post', name: 'First Post', icon: '✍️', description: 'Created your first post' },
  { id: 'helper', name: 'Helper', icon: '🤝', description: 'Had 10 answers marked as helpful' },
  { id: 'contributor', name: 'Contributor', icon: '⭐', description: 'Made 50+ posts' },
  { id: 'verified_responder', name: 'Verified Responder', icon: '✅', description: 'Official emergency responder' },
  { id: 'local_hero', name: 'Local Hero', icon: '🦸', description: 'Recognized for community service' },
  { id: 'early_adopter', name: 'Early Adopter', icon: '🌟', description: 'Joined during early access' },
  { id: 'mentor', name: 'Mentor', icon: '🎓', description: 'Helped 100+ community members' },
  { id: 'preparedness_pro', name: 'Preparedness Pro', icon: '🛡️', description: 'Shared 25+ preparedness tips' },
];

class CommunityForumService {
  private static instance: CommunityForumService;
  private posts: Map<string, ForumPost> = new Map();
  private replies: Map<string, ForumReply> = new Map();
  private users: Map<string, ForumUser> = new Map();
  private categories: Map<ForumCategory, CategoryInfo> = new Map();
  private notifications: Map<string, ForumNotification[]> = new Map();
  private reports: Map<string, ContentReport> = new Map();
  private listeners: ((post: ForumPost) => void)[] = [];

  private constructor() {
    this.initializeCategories();
    this.initializeSampleData();
  }

  public static getInstance(): CommunityForumService {
    if (!CommunityForumService.instance) {
      CommunityForumService.instance = new CommunityForumService();
    }
    return CommunityForumService.instance;
  }

  /**
   * Initialize categories
   */
  private initializeCategories(): void {
    CATEGORY_INFO.forEach((cat) => {
      this.categories.set(cat.id, { ...cat });
    });
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Sample users
    const sampleUsers: ForumUser[] = [
      {
        id: 'user-1',
        displayName: 'Emergency Admin',
        role: 'admin',
        badges: [{ ...AVAILABLE_BADGES[0], earnedAt: new Date() }],
        reputation: 1500,
        joinedAt: new Date('2023-01-01'),
        isVerified: true,
        location: 'Delhi',
      },
      {
        id: 'user-2',
        displayName: 'Community Helper',
        role: 'verified',
        badges: [{ ...AVAILABLE_BADGES[1], earnedAt: new Date() }],
        reputation: 850,
        joinedAt: new Date('2023-03-15'),
        isVerified: true,
        location: 'Kerala',
      },
    ];

    sampleUsers.forEach((user) => this.users.set(user.id, user));

    // Sample posts
    const samplePosts: Omit<ForumPost, 'reactions'>[] = [
      {
        id: 'post-1',
        title: 'Welcome to Rescue Ping Community Forum',
        content: 'Welcome to our community forum! This is a space for disaster preparedness discussion, sharing resources, and supporting each other during emergencies. Please read the community guidelines before posting.',
        contentType: 'text',
        category: 'announcements',
        author: sampleUsers[0],
        status: 'pinned',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        tags: ['welcome', 'guidelines'],
        attachments: [],
        viewCount: 1500,
        replyCount: 25,
        isPinned: true,
        isLocked: false,
        isAnnouncement: true,
        metadata: {},
      },
      {
        id: 'post-2',
        title: 'Flood Preparedness Checklist - Essential Items',
        content: 'Here\'s a comprehensive checklist for flood preparedness:\n\n1. Important documents in waterproof container\n2. First aid kit\n3. Flashlights and batteries\n4. Portable phone charger\n5. Non-perishable food for 3 days\n6. Drinking water (1 gallon per person per day)\n7. Medications\n8. Cash in small denominations\n9. Emergency contact list\n10. Battery-powered radio',
        contentType: 'text',
        category: 'preparedness_tips',
        author: sampleUsers[1],
        status: 'published',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        tags: ['flood', 'preparedness', 'checklist'],
        attachments: [],
        viewCount: 890,
        replyCount: 42,
        isPinned: false,
        isLocked: false,
        isAnnouncement: false,
        metadata: {},
      },
    ];

    samplePosts.forEach((post) => {
      this.posts.set(post.id, {
        ...post,
        reactions: { total: Math.floor(Math.random() * 100), byType: { like: 50, helpful: 30, support: 15, prayer: 3, informative: 2 } },
      });
      const category = this.categories.get(post.category);
      if (category) {
        category.postCount++;
        category.recentActivity = post.createdAt;
      }
    });
  }

  /**
   * Create post
   */
  public async createPost(
    data: {
      title: string;
      content: string;
      contentType?: ContentType;
      category: ForumCategory;
      authorId: string;
      tags?: string[];
      attachments?: Omit<Attachment, 'id'>[];
      poll?: Omit<Poll, 'totalVotes'>;
      alertReference?: string;
      location?: PostLocation;
    }
  ): Promise<ForumPost> {
    const author = this.users.get(data.authorId);
    if (!author) {
      throw new Error('User not found');
    }

    const category = this.categories.get(data.category);
    if (category?.isRestricted && !['admin', 'moderator', 'official'].includes(author.role)) {
      throw new Error('Posting restricted in this category');
    }

    const id = `post-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    const now = new Date();

    const post: ForumPost = {
      id,
      title: data.title,
      content: data.content,
      contentType: data.contentType || 'text',
      category: data.category,
      author,
      status: 'published',
      createdAt: now,
      updatedAt: now,
      tags: data.tags || [],
      attachments: (data.attachments || []).map((a, i) => ({ ...a, id: `att-${id}-${i}` })),
      poll: data.poll ? { ...data.poll, totalVotes: 0, options: data.poll.options.map((o, i) => ({ ...o, id: `opt-${i}`, votes: 0, percentage: 0 })) } : undefined,
      alertReference: data.alertReference,
      location: data.location,
      viewCount: 0,
      replyCount: 0,
      reactions: { total: 0, byType: { like: 0, helpful: 0, support: 0, prayer: 0, informative: 0 } },
      isPinned: false,
      isLocked: false,
      isAnnouncement: false,
      metadata: {},
    };

    this.posts.set(id, post);

    // Update category
    if (category) {
      category.postCount++;
      category.recentActivity = now;
    }

    this.notifyListeners(post);
    return post;
  }

  /**
   * Get post
   */
  public getPost(postId: string): ForumPost | undefined {
    const post = this.posts.get(postId);
    if (post) {
      post.viewCount++;
    }
    return post;
  }

  /**
   * Update post
   */
  public updatePost(postId: string, updates: Partial<Pick<ForumPost, 'title' | 'content' | 'tags' | 'attachments'>>): ForumPost | null {
    const post = this.posts.get(postId);
    if (!post) return null;

    Object.assign(post, updates);
    post.updatedAt = new Date();
    this.notifyListeners(post);
    return post;
  }

  /**
   * Delete post
   */
  public deletePost(postId: string, userId: string): boolean {
    const post = this.posts.get(postId);
    if (!post) return false;

    const user = this.users.get(userId);
    if (!user) return false;

    if (post.author.id !== userId && !['admin', 'moderator'].includes(user.role)) {
      return false;
    }

    post.status = 'removed';
    return true;
  }

  /**
   * Add reply
   */
  public async addReply(
    postId: string,
    data: {
      content: string;
      authorId: string;
      parentReplyId?: string;
      attachments?: Omit<Attachment, 'id'>[];
    }
  ): Promise<ForumReply> {
    const post = this.posts.get(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.isLocked) {
      throw new Error('Post is locked');
    }

    const author = this.users.get(data.authorId);
    if (!author) {
      throw new Error('User not found');
    }

    const id = `reply-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    const now = new Date();

    const reply: ForumReply = {
      id,
      postId,
      parentReplyId: data.parentReplyId,
      content: data.content,
      author,
      createdAt: now,
      updatedAt: now,
      attachments: (data.attachments || []).map((a, i) => ({ ...a, id: `att-${id}-${i}` })),
      reactions: { total: 0, byType: { like: 0, helpful: 0, support: 0, prayer: 0, informative: 0 } },
      isAcceptedAnswer: false,
      isModerationAction: false,
      status: 'visible',
    };

    this.replies.set(id, reply);
    post.replyCount++;

    // Notify post author
    if (post.author.id !== data.authorId) {
      this.addNotification(post.author.id, {
        type: 'reply',
        title: 'New reply to your post',
        message: `${author.displayName} replied to "${post.title}"`,
        postId,
        replyId: id,
        fromUser: author,
      });
    }

    return reply;
  }

  /**
   * Get replies
   */
  public getReplies(postId: string): ForumReply[] {
    const replies = Array.from(this.replies.values())
      .filter((r) => r.postId === postId && r.status === 'visible')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // Build thread structure
    const topLevel = replies.filter((r) => !r.parentReplyId);
    topLevel.forEach((reply) => {
      reply.children = replies.filter((r) => r.parentReplyId === reply.id);
    });

    return topLevel;
  }

  /**
   * React to content
   */
  public react(
    contentType: 'post' | 'reply',
    contentId: string,
    userId: string,
    reactionType: ReactionType
  ): boolean {
    const content = contentType === 'post' ? this.posts.get(contentId) : this.replies.get(contentId);
    if (!content) return false;

    const reactions = content.reactions;
    const previousReaction = reactions.userReaction;

    if (previousReaction === reactionType) {
      // Remove reaction
      reactions.byType[reactionType]--;
      reactions.total--;
      reactions.userReaction = undefined;
    } else {
      if (previousReaction) {
        reactions.byType[previousReaction]--;
      } else {
        reactions.total++;
      }
      reactions.byType[reactionType]++;
      reactions.userReaction = reactionType;
    }

    return true;
  }

  /**
   * Mark as accepted answer
   */
  public markAcceptedAnswer(postId: string, replyId: string, userId: string): boolean {
    const post = this.posts.get(postId);
    if (!post || post.author.id !== userId) return false;

    const reply = this.replies.get(replyId);
    if (!reply || reply.postId !== postId) return false;

    // Remove previous accepted answer
    Array.from(this.replies.values())
      .filter((r) => r.postId === postId)
      .forEach((r) => { r.isAcceptedAnswer = false; });

    reply.isAcceptedAnswer = true;

    // Award reputation
    const replyAuthor = reply.author;
    replyAuthor.reputation += 15;

    return true;
  }

  /**
   * Search posts
   */
  public async search(filters: ForumSearchFilters, page: number = 1, pageSize: number = 20): Promise<ForumSearchResult> {
    let results = Array.from(this.posts.values()).filter((p) => p.status !== 'removed');

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter((p) =>
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query)
      );
    }

    if (filters.categories?.length) {
      results = results.filter((p) => filters.categories!.includes(p.category));
    }

    if (filters.authors?.length) {
      results = results.filter((p) => filters.authors!.includes(p.author.id));
    }

    if (filters.tags?.length) {
      results = results.filter((p) => filters.tags!.some((tag) => p.tags.includes(tag)));
    }

    if (filters.dateRange) {
      results = results.filter((p) => {
        return p.createdAt >= filters.dateRange!.start && p.createdAt <= filters.dateRange!.end;
      });
    }

    if (filters.hasAttachments) {
      results = results.filter((p) => p.attachments.length > 0);
    }

    if (filters.hasPoll) {
      results = results.filter((p) => !!p.poll);
    }

    if (filters.location?.state) {
      results = results.filter((p) => p.location?.state === filters.location!.state);
    }

    if (filters.minReactions) {
      results = results.filter((p) => p.reactions.total >= filters.minReactions!);
    }

    if (filters.minReplies) {
      results = results.filter((p) => p.replyCount >= filters.minReplies!);
    }

    // Sort by relevance/date
    results.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const total = results.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize);

    return {
      posts: paginatedResults,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Get trending posts
   */
  public getTrendingPosts(limit: number = 10): ForumPost[] {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return Array.from(this.posts.values())
      .filter((p) => p.status === 'published' && p.createdAt >= dayAgo)
      .sort((a, b) => {
        const scoreA = a.viewCount * 0.5 + a.replyCount * 2 + a.reactions.total * 1.5;
        const scoreB = b.viewCount * 0.5 + b.replyCount * 2 + b.reactions.total * 1.5;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * Get recent posts
   */
  public getRecentPosts(category?: ForumCategory, limit: number = 20): ForumPost[] {
    let posts = Array.from(this.posts.values())
      .filter((p) => p.status === 'published' || p.status === 'pinned');

    if (category) {
      posts = posts.filter((p) => p.category === category);
    }

    return posts
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(0, limit);
  }

  /**
   * Get categories
   */
  public getCategories(): CategoryInfo[] {
    return Array.from(this.categories.values());
  }

  /**
   * Get category
   */
  public getCategory(categoryId: ForumCategory): CategoryInfo | undefined {
    return this.categories.get(categoryId);
  }

  /**
   * Vote on poll
   */
  public votePoll(postId: string, optionIds: string[], userId: string): boolean {
    const post = this.posts.get(postId);
    if (!post?.poll) return false;

    if (!post.poll.allowMultiple && optionIds.length > 1) return false;

    if (post.poll.endsAt && new Date() > post.poll.endsAt) return false;

    optionIds.forEach((optionId) => {
      const option = post.poll!.options.find((o) => o.id === optionId);
      if (option) {
        option.votes++;
        post.poll!.totalVotes++;
      }
    });

    // Recalculate percentages
    post.poll.options.forEach((option) => {
      option.percentage = post.poll!.totalVotes > 0
        ? Math.round((option.votes / post.poll!.totalVotes) * 100)
        : 0;
    });

    return true;
  }

  /**
   * Pin/Unpin post
   */
  public togglePin(postId: string, userId: string): boolean {
    const user = this.users.get(userId);
    if (!user || !['admin', 'moderator'].includes(user.role)) return false;

    const post = this.posts.get(postId);
    if (!post) return false;

    post.isPinned = !post.isPinned;
    post.status = post.isPinned ? 'pinned' : 'published';
    return true;
  }

  /**
   * Lock/Unlock post
   */
  public toggleLock(postId: string, userId: string): boolean {
    const user = this.users.get(userId);
    if (!user || !['admin', 'moderator'].includes(user.role)) return false;

    const post = this.posts.get(postId);
    if (!post) return false;

    post.isLocked = !post.isLocked;
    post.status = post.isLocked ? 'locked' : 'published';
    return true;
  }

  /**
   * Report content
   */
  public reportContent(
    contentType: 'post' | 'reply',
    contentId: string,
    reportedBy: string,
    reason: ContentReport['reason'],
    description?: string
  ): ContentReport {
    const id = `report-${Date.now()}`;
    const report: ContentReport = {
      id,
      contentType,
      contentId,
      reportedBy,
      reason,
      description,
      status: 'pending',
      createdAt: new Date(),
    };

    this.reports.set(id, report);
    return report;
  }

  /**
   * Get user stats
   */
  public getUserStats(userId: string): UserForumStats | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const userPosts = Array.from(this.posts.values()).filter((p) => p.author.id === userId);
    const userReplies = Array.from(this.replies.values()).filter((r) => r.author.id === userId);

    const categoryCounts = new Map<ForumCategory, number>();
    userPosts.forEach((p) => {
      categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
    });

    return {
      userId,
      totalPosts: userPosts.length,
      totalReplies: userReplies.length,
      totalReactionsReceived: userPosts.reduce((sum, p) => sum + p.reactions.total, 0) +
        userReplies.reduce((sum, r) => sum + r.reactions.total, 0),
      totalReactionsGiven: 0,
      helpfulAnswers: userReplies.filter((r) => r.isAcceptedAnswer).length,
      reputation: user.reputation,
      joinedAt: user.joinedAt,
      lastActiveAt: new Date(),
      topCategories: Array.from(categoryCounts.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      badges: user.badges,
    };
  }

  /**
   * Add notification
   */
  private addNotification(userId: string, notification: Omit<ForumNotification, 'id' | 'userId' | 'isRead' | 'createdAt'>): void {
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.push({
      ...notification,
      id: `notif-${Date.now()}`,
      userId,
      isRead: false,
      createdAt: new Date(),
    });
    this.notifications.set(userId, userNotifications);
  }

  /**
   * Get notifications
   */
  public getNotifications(userId: string, unreadOnly: boolean = false): ForumNotification[] {
    const notifications = this.notifications.get(userId) || [];
    if (unreadOnly) {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Mark notifications as read
   */
  public markNotificationsRead(userId: string, notificationIds?: string[]): void {
    const notifications = this.notifications.get(userId) || [];
    notifications.forEach((n) => {
      if (!notificationIds || notificationIds.includes(n.id)) {
        n.isRead = true;
      }
    });
  }

  /**
   * Subscribe to updates
   */
  public subscribe(callback: (post: ForumPost) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(post: ForumPost): void {
    this.listeners.forEach((callback) => callback(post));
  }
}

export const communityForumService = CommunityForumService.getInstance();
export type {
  ForumCategory,
  PostStatus,
  UserRole,
  ContentType,
  ReactionType,
  ForumPost,
  ForumUser,
  UserBadge,
  Attachment,
  Poll,
  PollOption,
  PostLocation,
  ReactionSummary,
  ForumReply,
  CategoryInfo,
  ForumSearchFilters,
  ForumSearchResult,
  ForumNotification,
  ContentReport,
  UserForumStats,
};
