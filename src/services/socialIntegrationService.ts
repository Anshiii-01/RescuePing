// @ts-nocheck
/**
 * Social Integration Service - #112
 * Platform APIs, sharing, authentication, analytics, content sync
 */

// Social platform
type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'whatsapp' | 'telegram' | 'reddit' | 'pinterest';

// Connection status
type ConnectionStatus = 'connected' | 'disconnected' | 'expired' | 'error' | 'pending' | 'revoked';

// Share type
type ShareType = 'post' | 'story' | 'reel' | 'tweet' | 'message' | 'link' | 'video' | 'image' | 'carousel';

// Content sync status
type SyncStatus = 'synced' | 'pending' | 'syncing' | 'failed' | 'scheduled' | 'cancelled';

// Auth provider type
type AuthProvider = 'oauth2' | 'oauth1' | 'api_key' | 'jwt' | 'saml';

// Social platform configuration
interface PlatformConfiguration {
  id: string;
  platform: SocialPlatform;
  enabled: boolean;
  appId: string;
  appSecret?: string;
  apiVersion: string;
  authType: AuthProvider;
  scopes: string[];
  endpoints: {
    auth: string;
    token: string;
    refresh: string;
    revoke: string;
    api: string;
  };
  rateLimits: {
    requestsPerHour: number;
    requestsPerDay: number;
    currentUsage: number;
    resetTime: Date;
  };
  features: {
    posting: boolean;
    stories: boolean;
    messaging: boolean;
    analytics: boolean;
    scheduling: boolean;
    webhooks: boolean;
  };
  webhookConfig?: {
    url: string;
    secret: string;
    events: string[];
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Social account connection
interface SocialConnection {
  id: string;
  userId: string;
  platform: SocialPlatform;
  platformUserId: string;
  platformUsername: string;
  displayName: string;
  profileUrl: string;
  avatarUrl: string;
  status: ConnectionStatus;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry: Date;
  scopes: string[];
  permissions: {
    read: boolean;
    write: boolean;
    admin: boolean;
  };
  accountType: 'personal' | 'business' | 'creator' | 'page';
  linkedPages?: {
    id: string;
    name: string;
    type: string;
    selected: boolean;
  }[];
  stats: {
    followers: number;
    following: number;
    posts: number;
    engagement: number;
  };
  lastSync: Date;
  connectedAt: Date;
  expiresAt?: Date;
}

// Share request
interface ShareRequest {
  id: string;
  userId: string;
  platforms: SocialPlatform[];
  content: {
    type: ShareType;
    text?: string;
    title?: string;
    description?: string;
    url?: string;
    media?: {
      type: 'image' | 'video' | 'gif';
      url: string;
      thumbnail?: string;
      altText?: string;
    }[];
    hashtags?: string[];
    mentions?: string[];
    location?: {
      name: string;
      latitude: number;
      longitude: number;
    };
  };
  scheduling?: {
    scheduled: boolean;
    publishAt: Date;
    timezone: string;
  };
  options: {
    crossPost: boolean;
    shortenUrls: boolean;
    trackClicks: boolean;
    addWatermark: boolean;
  };
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  results: ShareResult[];
  createdAt: Date;
  updatedAt: Date;
}

// Share result
interface ShareResult {
  platform: SocialPlatform;
  status: 'success' | 'failed' | 'pending';
  postId?: string;
  postUrl?: string;
  publishedAt?: Date;
  error?: {
    code: string;
    message: string;
  };
  analytics?: {
    impressions: number;
    engagements: number;
    clicks: number;
    shares: number;
  };
}

// Social auth session
interface SocialAuthSession {
  id: string;
  platform: SocialPlatform;
  state: string;
  codeVerifier?: string;
  redirectUri: string;
  scopes: string[];
  status: 'pending' | 'completed' | 'expired' | 'failed';
  userId?: string;
  createdAt: Date;
  expiresAt: Date;
}

// Content sync configuration
interface ContentSyncConfig {
  id: string;
  userId: string;
  platform: SocialPlatform;
  connectionId: string;
  enabled: boolean;
  direction: 'import' | 'export' | 'bidirectional';
  contentTypes: ShareType[];
  filters: {
    hashtags?: string[];
    keywords?: string[];
    dateRange?: { start: Date; end: Date };
    mediaTypes?: string[];
  };
  schedule: {
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
    lastRun?: Date;
    nextRun?: Date;
  };
  mapping: {
    fields: Record<string, string>;
    transformations: Record<string, string>;
  };
  status: SyncStatus;
  stats: {
    itemsSynced: number;
    lastSyncedAt?: Date;
    errors: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Synced content
interface SyncedContent {
  id: string;
  syncConfigId: string;
  platform: SocialPlatform;
  externalId: string;
  contentType: ShareType;
  content: {
    text?: string;
    media?: {
      type: string;
      url: string;
      localUrl?: string;
    }[];
    metadata: Record<string, unknown>;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  author: {
    id: string;
    username: string;
    displayName: string;
  };
  originalUrl: string;
  publishedAt: Date;
  syncedAt: Date;
  status: SyncStatus;
}

// Social analytics
interface SocialAnalytics {
  userId: string;
  platform: SocialPlatform;
  period: { start: Date; end: Date };
  overview: {
    followers: number;
    followerChange: number;
    posts: number;
    totalEngagement: number;
    engagementRate: number;
    reach: number;
    impressions: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
  };
  audience: {
    demographics: {
      ageRange: string;
      percentage: number;
    }[];
    genders: {
      gender: string;
      percentage: number;
    }[];
    locations: {
      country: string;
      city?: string;
      count: number;
    }[];
    activeHours: {
      hour: number;
      engagement: number;
    }[];
  };
  content: {
    topPosts: {
      id: string;
      type: ShareType;
      engagement: number;
      reach: number;
    }[];
    performanceByType: {
      type: ShareType;
      avgEngagement: number;
      count: number;
    }[];
  };
  growth: {
    date: Date;
    followers: number;
    engagement: number;
  }[];
}

// Aggregate analytics
interface AggregateAnalytics {
  userId: string;
  period: { start: Date; end: Date };
  platforms: {
    platform: SocialPlatform;
    followers: number;
    engagement: number;
    posts: number;
  }[];
  totals: {
    totalFollowers: number;
    totalEngagement: number;
    totalPosts: number;
    totalReach: number;
  };
  bestPerformingPlatform: SocialPlatform;
  bestPerformingContent: {
    platform: SocialPlatform;
    postId: string;
    engagement: number;
  };
}

// Webhook event
interface WebhookEvent {
  id: string;
  platform: SocialPlatform;
  eventType: string;
  payload: Record<string, unknown>;
  signature: string;
  verified: boolean;
  processedAt?: Date;
  status: 'pending' | 'processed' | 'failed' | 'ignored';
  createdAt: Date;
}

class SocialIntegrationService {
  private static instance: SocialIntegrationService;
  private platformConfigs: Map<string, PlatformConfiguration> = new Map();
  private connections: Map<string, SocialConnection> = new Map();
  private shareRequests: Map<string, ShareRequest> = new Map();
  private authSessions: Map<string, SocialAuthSession> = new Map();
  private syncConfigs: Map<string, ContentSyncConfig> = new Map();
  private syncedContent: Map<string, SyncedContent> = new Map();
  private webhookEvents: Map<string, WebhookEvent> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): SocialIntegrationService {
    if (!SocialIntegrationService.instance) {
      SocialIntegrationService.instance = new SocialIntegrationService();
    }
    return SocialIntegrationService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize platform configurations
    const platformsData: {
      platform: SocialPlatform;
      appId: string;
      apiVersion: string;
      features: PlatformConfiguration['features'];
    }[] = [
      {
        platform: 'facebook',
        appId: 'fb-app-123456',
        apiVersion: 'v18.0',
        features: { posting: true, stories: true, messaging: true, analytics: true, scheduling: true, webhooks: true },
      },
      {
        platform: 'twitter',
        appId: 'tw-app-789012',
        apiVersion: 'v2',
        features: { posting: true, stories: false, messaging: true, analytics: true, scheduling: true, webhooks: true },
      },
      {
        platform: 'instagram',
        appId: 'ig-app-345678',
        apiVersion: 'v18.0',
        features: { posting: true, stories: true, messaging: false, analytics: true, scheduling: true, webhooks: true },
      },
      {
        platform: 'linkedin',
        appId: 'li-app-901234',
        apiVersion: 'v2',
        features: { posting: true, stories: false, messaging: true, analytics: true, scheduling: true, webhooks: true },
      },
      {
        platform: 'youtube',
        appId: 'yt-app-567890',
        apiVersion: 'v3',
        features: { posting: true, stories: false, messaging: false, analytics: true, scheduling: true, webhooks: true },
      },
      {
        platform: 'tiktok',
        appId: 'tt-app-123789',
        apiVersion: 'v2',
        features: { posting: true, stories: false, messaging: false, analytics: true, scheduling: false, webhooks: false },
      },
      {
        platform: 'whatsapp',
        appId: 'wa-app-456012',
        apiVersion: 'v18.0',
        features: { posting: false, stories: true, messaging: true, analytics: true, scheduling: false, webhooks: true },
      },
      {
        platform: 'telegram',
        appId: 'tg-app-789345',
        apiVersion: 'bot',
        features: { posting: true, stories: false, messaging: true, analytics: false, scheduling: true, webhooks: true },
      },
    ];

    platformsData.forEach((p, idx) => {
      const config: PlatformConfiguration = {
        id: `config-${p.platform}`,
        platform: p.platform,
        enabled: idx < 6,
        appId: p.appId,
        apiVersion: p.apiVersion,
        authType: 'oauth2',
        scopes: ['read', 'write', 'publish', 'analytics'],
        endpoints: {
          auth: `https://api.${p.platform}.com/oauth/authorize`,
          token: `https://api.${p.platform}.com/oauth/token`,
          refresh: `https://api.${p.platform}.com/oauth/refresh`,
          revoke: `https://api.${p.platform}.com/oauth/revoke`,
          api: `https://api.${p.platform}.com/${p.apiVersion}`,
        },
        rateLimits: {
          requestsPerHour: 500,
          requestsPerDay: 5000,
          currentUsage: Math.floor(Math.random() * 100),
          resetTime: new Date(Date.now() + 60 * 60 * 1000),
        },
        features: p.features,
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.platformConfigs.set(config.id, config);
    });

    // Initialize social connections
    const connectionsData: {
      platform: SocialPlatform;
      username: string;
      displayName: string;
      followers: number;
    }[] = [
      { platform: 'facebook', username: 'rescueping.official', displayName: 'RescuePing Official', followers: 125000 },
      { platform: 'twitter', username: 'RescuePingApp', displayName: 'RescuePing', followers: 89000 },
      { platform: 'instagram', username: 'rescueping', displayName: 'RescuePing Emergency', followers: 156000 },
      { platform: 'linkedin', username: 'rescueping-inc', displayName: 'RescuePing Inc', followers: 45000 },
      { platform: 'youtube', username: 'RescuePingChannel', displayName: 'RescuePing Channel', followers: 234000 },
    ];

    connectionsData.forEach((conn, idx) => {
      const connection: SocialConnection = {
        id: `conn-${(idx + 1).toString().padStart(6, '0')}`,
        userId: 'user-001',
        platform: conn.platform,
        platformUserId: `${conn.platform}-${idx + 1}`,
        platformUsername: conn.username,
        displayName: conn.displayName,
        profileUrl: `https://${conn.platform}.com/${conn.username}`,
        avatarUrl: `https://cdn.rescueping.com/social/${conn.platform}-avatar.jpg`,
        status: 'connected',
        accessToken: `token-${conn.platform}-${Math.random().toString(36).substr(2, 20)}`,
        refreshToken: `refresh-${conn.platform}-${Math.random().toString(36).substr(2, 20)}`,
        tokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        scopes: ['read', 'write', 'publish', 'analytics'],
        permissions: { read: true, write: true, admin: idx < 2 },
        accountType: idx === 3 ? 'business' : idx === 0 ? 'page' : 'creator',
        stats: {
          followers: conn.followers,
          following: Math.floor(conn.followers * 0.01),
          posts: Math.floor(Math.random() * 500) + 100,
          engagement: 2 + Math.random() * 5,
        },
        lastSync: new Date(),
        connectedAt: new Date(Date.now() - idx * 30 * 24 * 60 * 60 * 1000),
      };
      this.connections.set(connection.id, connection);
    });

    // Initialize share requests
    const shareData = [
      { text: 'Emergency Alert: Flood warning issued for coastal areas. Stay safe!', platforms: ['facebook', 'twitter', 'instagram'] },
      { text: 'New disaster preparedness guide available. Link in bio!', platforms: ['instagram', 'tiktok'] },
      { text: 'Join our live webinar on emergency response training tomorrow at 10 AM.', platforms: ['facebook', 'linkedin', 'twitter'] },
      { text: 'Thank you to all volunteers who helped during the recent evacuation.', platforms: ['facebook', 'twitter'] },
      { text: 'Download our app for real-time emergency alerts in your area.', platforms: ['instagram', 'twitter', 'linkedin'] },
    ];

    shareData.forEach((share, idx) => {
      const request: ShareRequest = {
        id: `share-${(idx + 1).toString().padStart(6, '0')}`,
        userId: 'user-001',
        platforms: share.platforms as SocialPlatform[],
        content: {
          type: 'post',
          text: share.text,
          url: `https://rescueping.com/alert/${idx + 1}`,
          hashtags: ['Emergency', 'Safety', 'RescuePing', 'DisasterPreparedness'],
        },
        options: {
          crossPost: true,
          shortenUrls: true,
          trackClicks: true,
          addWatermark: false,
        },
        status: idx < 3 ? 'published' : idx === 3 ? 'scheduled' : 'draft',
        results: share.platforms.map((platform) => ({
          platform: platform as SocialPlatform,
          status: idx < 3 ? 'success' : 'pending',
          postId: idx < 3 ? `post-${platform}-${idx + 1}` : undefined,
          postUrl: idx < 3 ? `https://${platform}.com/rescueping/post/${idx + 1}` : undefined,
          publishedAt: idx < 3 ? new Date(Date.now() - idx * 24 * 60 * 60 * 1000) : undefined,
          analytics: idx < 3 ? {
            impressions: Math.floor(Math.random() * 50000) + 10000,
            engagements: Math.floor(Math.random() * 5000) + 500,
            clicks: Math.floor(Math.random() * 2000) + 200,
            shares: Math.floor(Math.random() * 500) + 50,
          } : undefined,
        })),
        createdAt: new Date(Date.now() - idx * 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.shareRequests.set(request.id, request);
    });

    // Initialize sync configurations
    const syncData: { platform: SocialPlatform; direction: ContentSyncConfig['direction'] }[] = [
      { platform: 'facebook', direction: 'bidirectional' },
      { platform: 'twitter', direction: 'import' },
      { platform: 'instagram', direction: 'export' },
    ];

    syncData.forEach((sync, idx) => {
      const config: ContentSyncConfig = {
        id: `sync-${(idx + 1).toString().padStart(4, '0')}`,
        userId: 'user-001',
        platform: sync.platform,
        connectionId: `conn-${(idx + 1).toString().padStart(6, '0')}`,
        enabled: true,
        direction: sync.direction,
        contentTypes: ['post', 'image', 'video'],
        filters: {
          hashtags: ['RescuePing', 'Emergency'],
        },
        schedule: {
          frequency: 'hourly',
          lastRun: new Date(Date.now() - 30 * 60 * 1000),
          nextRun: new Date(Date.now() + 30 * 60 * 1000),
        },
        mapping: {
          fields: { text: 'content', media: 'attachments' },
          transformations: {},
        },
        status: 'synced',
        stats: {
          itemsSynced: Math.floor(Math.random() * 1000) + 100,
          lastSyncedAt: new Date(),
          errors: Math.floor(Math.random() * 5),
        },
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.syncConfigs.set(config.id, config);
    });

    // Initialize synced content
    for (let i = 0; i < 20; i++) {
      const platform = ['facebook', 'twitter', 'instagram'][i % 3] as SocialPlatform;
      const content: SyncedContent = {
        id: `synced-${(i + 1).toString().padStart(6, '0')}`,
        syncConfigId: `sync-${((i % 3) + 1).toString().padStart(4, '0')}`,
        platform,
        externalId: `ext-${platform}-${i + 1}`,
        contentType: ['post', 'image', 'video'][i % 3] as ShareType,
        content: {
          text: `Synced content from ${platform} #${i + 1}`,
          metadata: { source: platform },
        },
        engagement: {
          likes: Math.floor(Math.random() * 5000) + 100,
          comments: Math.floor(Math.random() * 500) + 10,
          shares: Math.floor(Math.random() * 200) + 5,
          views: Math.floor(Math.random() * 20000) + 1000,
        },
        author: {
          id: `author-${i + 1}`,
          username: `user${i + 1}`,
          displayName: `User ${i + 1}`,
        },
        originalUrl: `https://${platform}.com/post/${i + 1}`,
        publishedAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000),
        syncedAt: new Date(Date.now() - i * 60 * 60 * 1000),
        status: 'synced',
      };
      this.syncedContent.set(content.id, content);
    }
  }

  /**
   * Get platform configurations
   */
  public getPlatformConfigurations(): PlatformConfiguration[] {
    return Array.from(this.platformConfigs.values());
  }

  /**
   * Get platform configuration
   */
  public getPlatformConfiguration(platform: SocialPlatform): PlatformConfiguration | undefined {
    return this.platformConfigs.get(`config-${platform}`);
  }

  /**
   * Initiate OAuth flow
   */
  public initiateOAuth(platform: SocialPlatform, redirectUri: string): SocialAuthSession {
    const config = this.platformConfigs.get(`config-${platform}`);
    if (!config) throw new Error('Platform not configured');

    const session: SocialAuthSession = {
      id: `auth-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      platform,
      state: Math.random().toString(36).substr(2, 32),
      codeVerifier: Math.random().toString(36).substr(2, 64),
      redirectUri,
      scopes: config.scopes,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };

    this.authSessions.set(session.id, session);

    return session;
  }

  /**
   * Complete OAuth flow
   */
  public async completeOAuth(sessionId: string, code: string): Promise<SocialConnection> {
    const session = this.authSessions.get(sessionId);
    if (!session) throw new Error('Auth session not found');
    if (session.status !== 'pending') throw new Error('Auth session already processed');

    // Simulate token exchange
    await new Promise((resolve) => setTimeout(resolve, 500));

    session.status = 'completed';

    const connection: SocialConnection = {
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId: 'user-001',
      platform: session.platform,
      platformUserId: `${session.platform}-${Date.now()}`,
      platformUsername: `user_${session.platform}`,
      displayName: `User on ${session.platform}`,
      profileUrl: `https://${session.platform}.com/user`,
      avatarUrl: `https://cdn.rescueping.com/avatars/default.jpg`,
      status: 'connected',
      accessToken: `token-${Math.random().toString(36).substr(2, 20)}`,
      refreshToken: `refresh-${Math.random().toString(36).substr(2, 20)}`,
      tokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      scopes: session.scopes,
      permissions: { read: true, write: true, admin: false },
      accountType: 'personal',
      stats: { followers: 0, following: 0, posts: 0, engagement: 0 },
      lastSync: new Date(),
      connectedAt: new Date(),
    };

    this.connections.set(connection.id, connection);

    this.emit('connection_created', connection);

    return connection;
  }

  /**
   * Get connections
   */
  public getConnections(filter?: {
    userId?: string;
    platform?: SocialPlatform;
    status?: ConnectionStatus;
  }): SocialConnection[] {
    let connections = Array.from(this.connections.values());
    if (filter?.userId) connections = connections.filter((c) => c.userId === filter.userId);
    if (filter?.platform) connections = connections.filter((c) => c.platform === filter.platform);
    if (filter?.status) connections = connections.filter((c) => c.status === filter.status);
    return connections;
  }

  /**
   * Get connection
   */
  public getConnection(connectionId: string): SocialConnection | undefined {
    return this.connections.get(connectionId);
  }

  /**
   * Disconnect platform
   */
  public disconnect(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) throw new Error('Connection not found');

    connection.status = 'disconnected';

    this.emit('connection_disconnected', connection);
  }

  /**
   * Refresh token
   */
  public async refreshToken(connectionId: string): Promise<SocialConnection> {
    const connection = this.connections.get(connectionId);
    if (!connection) throw new Error('Connection not found');

    // Simulate token refresh
    await new Promise((resolve) => setTimeout(resolve, 300));

    connection.accessToken = `token-${Math.random().toString(36).substr(2, 20)}`;
    connection.tokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    connection.status = 'connected';

    this.emit('token_refreshed', connection);

    return connection;
  }

  /**
   * Create share request
   */
  public createShareRequest(
    userId: string,
    platforms: SocialPlatform[],
    content: ShareRequest['content'],
    options?: Partial<ShareRequest['options']>,
    scheduling?: ShareRequest['scheduling']
  ): ShareRequest {
    const request: ShareRequest = {
      id: `share-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId,
      platforms,
      content,
      scheduling,
      options: {
        crossPost: true,
        shortenUrls: true,
        trackClicks: true,
        addWatermark: false,
        ...options,
      },
      status: scheduling?.scheduled ? 'scheduled' : 'draft',
      results: platforms.map((platform) => ({
        platform,
        status: 'pending',
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.shareRequests.set(request.id, request);

    this.emit('share_request_created', request);

    return request;
  }

  /**
   * Publish share request
   */
  public async publishShareRequest(requestId: string): Promise<ShareRequest> {
    const request = this.shareRequests.get(requestId);
    if (!request) throw new Error('Share request not found');

    request.status = 'publishing';

    // Simulate publishing to each platform
    for (const result of request.results) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      result.status = 'success';
      result.postId = `post-${result.platform}-${Date.now()}`;
      result.postUrl = `https://${result.platform}.com/rescueping/post/${result.postId}`;
      result.publishedAt = new Date();
    }

    request.status = 'published';
    request.updatedAt = new Date();

    this.emit('share_published', request);

    return request;
  }

  /**
   * Get share requests
   */
  public getShareRequests(filter?: {
    userId?: string;
    status?: ShareRequest['status'];
    platform?: SocialPlatform;
    limit?: number;
  }): ShareRequest[] {
    let requests = Array.from(this.shareRequests.values());
    if (filter?.userId) requests = requests.filter((r) => r.userId === filter.userId);
    if (filter?.status) requests = requests.filter((r) => r.status === filter.status);
    if (filter?.platform) requests = requests.filter((r) => r.platforms.includes(filter.platform));
    requests = requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (filter?.limit) requests = requests.slice(0, filter.limit);
    return requests;
  }

  /**
   * Get share request
   */
  public getShareRequest(requestId: string): ShareRequest | undefined {
    return this.shareRequests.get(requestId);
  }

  /**
   * Get sync configurations
   */
  public getSyncConfigurations(userId?: string): ContentSyncConfig[] {
    let configs = Array.from(this.syncConfigs.values());
    if (userId) configs = configs.filter((c) => c.userId === userId);
    return configs;
  }

  /**
   * Create sync configuration
   */
  public createSyncConfiguration(
    config: Omit<ContentSyncConfig, 'id' | 'status' | 'stats' | 'createdAt' | 'updatedAt'>
  ): ContentSyncConfig {
    const newConfig: ContentSyncConfig = {
      ...config,
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending',
      stats: { itemsSynced: 0, errors: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.syncConfigs.set(newConfig.id, newConfig);

    this.emit('sync_config_created', newConfig);

    return newConfig;
  }

  /**
   * Trigger sync
   */
  public async triggerSync(syncConfigId: string): Promise<ContentSyncConfig> {
    const config = this.syncConfigs.get(syncConfigId);
    if (!config) throw new Error('Sync configuration not found');

    config.status = 'syncing';

    // Simulate sync
    await new Promise((resolve) => setTimeout(resolve, 1000));

    config.status = 'synced';
    config.stats.itemsSynced += Math.floor(Math.random() * 10) + 1;
    config.stats.lastSyncedAt = new Date();
    config.schedule.lastRun = new Date();
    config.updatedAt = new Date();

    this.emit('sync_completed', config);

    return config;
  }

  /**
   * Get synced content
   */
  public getSyncedContent(filter?: {
    syncConfigId?: string;
    platform?: SocialPlatform;
    limit?: number;
  }): SyncedContent[] {
    let content = Array.from(this.syncedContent.values());
    if (filter?.syncConfigId) content = content.filter((c) => c.syncConfigId === filter.syncConfigId);
    if (filter?.platform) content = content.filter((c) => c.platform === filter.platform);
    content = content.sort((a, b) => b.syncedAt.getTime() - a.syncedAt.getTime());
    if (filter?.limit) content = content.slice(0, filter.limit);
    return content;
  }

  /**
   * Get social analytics
   */
  public getSocialAnalytics(
    userId: string,
    platform: SocialPlatform,
    period: { start: Date; end: Date }
  ): SocialAnalytics {
    const connection = Array.from(this.connections.values()).find(
      (c) => c.userId === userId && c.platform === platform
    );

    return {
      userId,
      platform,
      period,
      overview: {
        followers: connection?.stats.followers || 0,
        followerChange: Math.floor((connection?.stats.followers || 0) * 0.05),
        posts: Math.floor(Math.random() * 50) + 10,
        totalEngagement: Math.floor(Math.random() * 100000) + 10000,
        engagementRate: 2 + Math.random() * 5,
        reach: Math.floor(Math.random() * 500000) + 50000,
        impressions: Math.floor(Math.random() * 1000000) + 100000,
      },
      engagement: {
        likes: Math.floor(Math.random() * 50000) + 5000,
        comments: Math.floor(Math.random() * 10000) + 1000,
        shares: Math.floor(Math.random() * 5000) + 500,
        saves: Math.floor(Math.random() * 2000) + 200,
        clicks: Math.floor(Math.random() * 15000) + 1500,
      },
      audience: {
        demographics: [
          { ageRange: '18-24', percentage: 25 },
          { ageRange: '25-34', percentage: 35 },
          { ageRange: '35-44', percentage: 22 },
          { ageRange: '45-54', percentage: 12 },
          { ageRange: '55+', percentage: 6 },
        ],
        genders: [
          { gender: 'Male', percentage: 52 },
          { gender: 'Female', percentage: 46 },
          { gender: 'Other', percentage: 2 },
        ],
        locations: [
          { country: 'India', count: Math.floor(Math.random() * 50000) + 10000 },
          { country: 'United States', count: Math.floor(Math.random() * 20000) + 5000 },
          { country: 'United Kingdom', count: Math.floor(Math.random() * 10000) + 2000 },
        ],
        activeHours: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          engagement: Math.floor(Math.random() * 1000) + (i >= 9 && i <= 21 ? 500 : 100),
        })),
      },
      content: {
        topPosts: Array.from({ length: 5 }, (_, i) => ({
          id: `post-${i + 1}`,
          type: ['post', 'image', 'video'][i % 3] as ShareType,
          engagement: Math.floor(Math.random() * 10000) + 1000,
          reach: Math.floor(Math.random() * 50000) + 5000,
        })),
        performanceByType: [
          { type: 'video' as ShareType, avgEngagement: 5000 + Math.random() * 3000, count: 20 },
          { type: 'image' as ShareType, avgEngagement: 3000 + Math.random() * 2000, count: 50 },
          { type: 'post' as ShareType, avgEngagement: 1500 + Math.random() * 1000, count: 100 },
        ],
      },
      growth: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
        followers: (connection?.stats.followers || 10000) - (30 - i) * 100,
        engagement: Math.floor(Math.random() * 5000) + 1000,
      })),
    };
  }

  /**
   * Get aggregate analytics
   */
  public getAggregateAnalytics(userId: string, period: { start: Date; end: Date }): AggregateAnalytics {
    const connections = this.getConnections({ userId });

    return {
      userId,
      period,
      platforms: connections.map((c) => ({
        platform: c.platform,
        followers: c.stats.followers,
        engagement: Math.floor(c.stats.followers * c.stats.engagement / 100),
        posts: c.stats.posts,
      })),
      totals: {
        totalFollowers: connections.reduce((sum, c) => sum + c.stats.followers, 0),
        totalEngagement: connections.reduce((sum, c) => sum + Math.floor(c.stats.followers * c.stats.engagement / 100), 0),
        totalPosts: connections.reduce((sum, c) => sum + c.stats.posts, 0),
        totalReach: connections.reduce((sum, c) => sum + c.stats.followers * 3, 0),
      },
      bestPerformingPlatform: connections.sort((a, b) => b.stats.engagement - a.stats.engagement)[0]?.platform || 'facebook',
      bestPerformingContent: {
        platform: 'instagram',
        postId: 'post-best-1',
        engagement: Math.floor(Math.random() * 50000) + 10000,
      },
    };
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

export const socialIntegrationService = SocialIntegrationService.getInstance();
export type {
  SocialPlatform,
  ConnectionStatus,
  ShareType,
  SyncStatus,
  AuthProvider,
  PlatformConfiguration,
  SocialConnection,
  ShareRequest,
  ShareResult,
  SocialAuthSession,
  ContentSyncConfig,
  SyncedContent,
  SocialAnalytics,
  AggregateAnalytics,
  WebhookEvent,
};
