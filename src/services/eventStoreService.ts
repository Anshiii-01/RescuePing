/**
 * Event Store Service - #118
 * Event persistence, replay, snapshots, projections, subscriptions
 */

// Event type
type EventType = 'domain' | 'system' | 'audit' | 'integration' | 'notification' | 'command' | 'query';

// Event status
type EventStatus = 'pending' | 'committed' | 'published' | 'failed' | 'archived';

// Subscription status
type SubscriptionStatus = 'active' | 'paused' | 'stopped' | 'errored';

// Projection status
type ProjectionStatus = 'running' | 'stopped' | 'catching_up' | 'errored' | 'faulted';

// Stored event
interface StoredEvent {
  id: string;
  streamId: string;
  streamType: string;
  eventType: string;
  eventCategory: EventType;
  version: number;
  data: Record<string, unknown>;
  metadata: EventMetadata;
  timestamp: Date;
  status: EventStatus;
  correlationId?: string;
  causationId?: string;
  position: number;
  checksum: string;
}

// Event metadata
interface EventMetadata {
  userId?: string;
  sessionId?: string;
  source: string;
  ipAddress?: string;
  userAgent?: string;
  tags: string[];
  custom: Record<string, unknown>;
}

// Event stream
interface EventStream {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  eventCount: number;
  lastEventId: string;
  snapshot?: StreamSnapshot;
  metadata: {
    owner?: string;
    retention?: number;
    encrypted?: boolean;
    compressed?: boolean;
  };
}

// Stream snapshot
interface StreamSnapshot {
  id: string;
  streamId: string;
  version: number;
  state: Record<string, unknown>;
  createdAt: Date;
  size: number;
  checksum: string;
}

// Event subscription
interface EventSubscription {
  id: string;
  name: string;
  status: SubscriptionStatus;
  streamPattern: string;
  eventTypes: string[];
  startPosition: 'beginning' | 'end' | 'position';
  position?: number;
  checkpoint: number;
  handler: SubscriptionHandler;
  settings: SubscriptionSettings;
  stats: SubscriptionStats;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription handler
interface SubscriptionHandler {
  type: 'http' | 'websocket' | 'queue' | 'function' | 'projection';
  config: {
    url?: string;
    queueName?: string;
    functionName?: string;
    projectionId?: string;
    headers?: Record<string, string>;
    timeout?: number;
  };
}

// Subscription settings
interface SubscriptionSettings {
  batchSize: number;
  maxRetries: number;
  retryDelay: number;
  checkpointInterval: number;
  bufferSize: number;
  resolveLinkTos: boolean;
  extraStatistics: boolean;
}

// Subscription stats
interface SubscriptionStats {
  eventsProcessed: number;
  eventsFailed: number;
  lastProcessedEvent?: string;
  lastProcessedAt?: Date;
  avgProcessingTime: number;
  lagCount: number;
  currentPosition: number;
  headPosition: number;
}

// Projection definition
interface Projection {
  id: string;
  name: string;
  description: string;
  status: ProjectionStatus;
  mode: 'continuous' | 'onetime' | 'transient';
  source: ProjectionSource;
  handlers: ProjectionHandler[];
  state: Record<string, unknown>;
  checkpoint: number;
  position: number;
  stats: ProjectionStats;
  settings: ProjectionSettings;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  stoppedAt?: Date;
}

// Projection source
interface ProjectionSource {
  type: 'all' | 'stream' | 'streams' | 'category' | 'eventType';
  streams?: string[];
  categories?: string[];
  eventTypes?: string[];
}

// Projection handler
interface ProjectionHandler {
  eventType: string;
  handler: string;
  outputStream?: string;
  linkTo?: string;
  emit?: boolean;
}

// Projection stats
interface ProjectionStats {
  eventsProcessed: number;
  eventsEmitted: number;
  stateUpdates: number;
  checkpointWrites: number;
  errorCount: number;
  lastCheckpoint?: Date;
  avgProcessingRate: number;
}

// Projection settings
interface ProjectionSettings {
  checkpointInterval: number;
  checkpointThreshold: number;
  cacheSize: number;
  outputStreamPrefix?: string;
  trackEmittedStreams: boolean;
}

// Event query
interface EventQuery {
  streams?: string[];
  streamPattern?: string;
  eventTypes?: string[];
  categories?: EventType[];
  fromPosition?: number;
  toPosition?: number;
  fromTimestamp?: Date;
  toTimestamp?: Date;
  correlationId?: string;
  metadata?: Record<string, unknown>;
  limit?: number;
  direction?: 'forward' | 'backward';
}

// Query result
interface QueryResult {
  events: StoredEvent[];
  totalCount: number;
  fromPosition: number;
  toPosition: number;
  hasMore: boolean;
  nextPosition?: number;
}

// Replay request
interface ReplayRequest {
  subscriptionId?: string;
  projectionId?: string;
  streamId?: string;
  fromPosition?: number;
  toPosition?: number;
  fromTimestamp?: Date;
  eventTypes?: string[];
  speed?: number;
}

// Replay session
interface ReplaySession {
  id: string;
  request: ReplayRequest;
  status: 'running' | 'paused' | 'completed' | 'cancelled' | 'errored';
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  eventsReplayed: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

// Event store stats
interface EventStoreStats {
  period: { start: Date; end: Date };
  overview: {
    totalEvents: number;
    totalStreams: number;
    totalSubscriptions: number;
    totalProjections: number;
    eventsPerSecond: number;
    storageSize: number;
  };
  byCategory: {
    category: EventType;
    count: number;
    percentage: number;
  }[];
  byStream: {
    streamId: string;
    streamType: string;
    eventCount: number;
  }[];
  eventTrend: {
    timestamp: Date;
    count: number;
    size: number;
  }[];
  subscriptionHealth: {
    subscriptionId: string;
    name: string;
    status: SubscriptionStatus;
    lag: number;
  }[];
}

class EventStoreService {
  private static instance: EventStoreService;
  private events: Map<string, StoredEvent> = new Map();
  private streams: Map<string, EventStream> = new Map();
  private subscriptions: Map<string, EventSubscription> = new Map();
  private projections: Map<string, Projection> = new Map();
  private snapshots: Map<string, StreamSnapshot> = new Map();
  private replaySessions: Map<string, ReplaySession> = new Map();
  private globalPosition: number = 0;
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): EventStoreService {
    if (!EventStoreService.instance) {
      EventStoreService.instance = new EventStoreService();
    }
    return EventStoreService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize event streams
    const streamTypes = [
      { type: 'alert', aggregate: 'Alert' },
      { type: 'user', aggregate: 'User' },
      { type: 'incident', aggregate: 'Incident' },
      { type: 'notification', aggregate: 'Notification' },
      { type: 'resource', aggregate: 'Resource' },
    ];

    streamTypes.forEach((st, stIdx) => {
      for (let i = 0; i < 3; i++) {
        const streamId = `${st.type}-${(stIdx * 3 + i + 1).toString().padStart(6, '0')}`;
        const eventCount = Math.floor(Math.random() * 50) + 10;

        const stream: EventStream = {
          id: streamId,
          type: st.type,
          aggregateId: `${st.aggregate.toLowerCase()}-${i + 1}`,
          aggregateType: st.aggregate,
          version: eventCount,
          createdAt: new Date(Date.now() - (30 - stIdx * 3 - i) * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          eventCount,
          lastEventId: '',
          metadata: {
            owner: 'system',
            retention: 90,
            encrypted: st.type === 'user',
            compressed: true,
          },
        };

        // Generate events for stream
        const eventTypesByStream: Record<string, string[]> = {
          alert: ['AlertCreated', 'AlertUpdated', 'AlertEscalated', 'AlertResolved', 'AlertArchived'],
          user: ['UserRegistered', 'UserUpdated', 'UserLoggedIn', 'UserLoggedOut', 'UserDeactivated'],
          incident: ['IncidentReported', 'IncidentAssigned', 'IncidentUpdated', 'IncidentResolved', 'IncidentClosed'],
          notification: ['NotificationSent', 'NotificationDelivered', 'NotificationRead', 'NotificationFailed'],
          resource: ['ResourceAllocated', 'ResourceUpdated', 'ResourceReleased', 'ResourceExpired'],
        };

        const eventTypes = eventTypesByStream[st.type] || ['EventOccurred'];

        for (let e = 0; e < eventCount; e++) {
          this.globalPosition++;
          const eventId = `evt-${Date.now()}-${this.globalPosition.toString().padStart(10, '0')}`;
          
          const storedEvent: StoredEvent = {
            id: eventId,
            streamId,
            streamType: st.type,
            eventType: eventTypes[e % eventTypes.length],
            eventCategory: ['domain', 'system', 'audit'][e % 3] as EventType,
            version: e + 1,
            data: {
              id: `${st.type}-item-${e + 1}`,
              action: eventTypes[e % eventTypes.length].toLowerCase(),
              timestamp: new Date(Date.now() - (eventCount - e) * 60 * 60 * 1000).toISOString(),
              details: { index: e, streamIdx: stIdx * 3 + i },
            },
            metadata: {
              userId: `user-${(e % 5) + 1}`,
              source: 'rescueping-core',
              tags: [st.type, eventTypes[e % eventTypes.length].toLowerCase()],
              custom: {},
            },
            timestamp: new Date(Date.now() - (eventCount - e) * 60 * 60 * 1000),
            status: 'published',
            correlationId: `corr-${stIdx * 3 + i}-${Math.floor(e / 5)}`,
            position: this.globalPosition,
            checksum: this.generateChecksum(eventId),
          };

          this.events.set(eventId, storedEvent);
          stream.lastEventId = eventId;
        }

        // Create snapshot for some streams
        if (i === 0) {
          const snapshotVersion = Math.floor(eventCount / 2);
          const snapshot: StreamSnapshot = {
            id: `snap-${streamId}-${snapshotVersion}`,
            streamId,
            version: snapshotVersion,
            state: { snapshotAt: snapshotVersion, aggregateState: 'active' },
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            size: Math.floor(Math.random() * 1000) + 200,
            checksum: this.generateChecksum(`snap-${streamId}`),
          };
          this.snapshots.set(snapshot.id, snapshot);
          stream.snapshot = snapshot;
        }

        this.streams.set(streamId, stream);
      }
    });

    // Initialize subscriptions
    const subscriptionsData = [
      { name: 'Alert Processing', pattern: 'alert-*', status: 'active' },
      { name: 'User Events', pattern: 'user-*', status: 'active' },
      { name: 'Incident Handler', pattern: 'incident-*', status: 'active' },
      { name: 'Notification Tracker', pattern: 'notification-*', status: 'paused' },
      { name: 'Resource Monitor', pattern: 'resource-*', status: 'active' },
    ];

    subscriptionsData.forEach((s, idx) => {
      const subscription: EventSubscription = {
        id: `sub-${(idx + 1).toString().padStart(6, '0')}`,
        name: s.name,
        status: s.status as SubscriptionStatus,
        streamPattern: s.pattern,
        eventTypes: [],
        startPosition: 'beginning',
        checkpoint: Math.floor(this.globalPosition * 0.9),
        handler: {
          type: 'http',
          config: {
            url: `https://api.rescueping.com/webhooks/${s.name.toLowerCase().replace(' ', '-')}`,
            timeout: 30000,
          },
        },
        settings: {
          batchSize: 100,
          maxRetries: 3,
          retryDelay: 1000,
          checkpointInterval: 1000,
          bufferSize: 500,
          resolveLinkTos: true,
          extraStatistics: true,
        },
        stats: {
          eventsProcessed: Math.floor(Math.random() * 10000) + 1000,
          eventsFailed: Math.floor(Math.random() * 50),
          lastProcessedAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
          avgProcessingTime: Math.floor(Math.random() * 100) + 10,
          lagCount: Math.floor(Math.random() * 100),
          currentPosition: Math.floor(this.globalPosition * 0.95),
          headPosition: this.globalPosition,
        },
        createdAt: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.subscriptions.set(subscription.id, subscription);
    });

    // Initialize projections
    const projectionsData = [
      { name: 'Active Alerts Count', mode: 'continuous', status: 'running' },
      { name: 'User Activity Summary', mode: 'continuous', status: 'running' },
      { name: 'Incident Timeline', mode: 'continuous', status: 'running' },
      { name: 'Daily Stats', mode: 'continuous', status: 'running' },
      { name: 'Historical Report', mode: 'onetime', status: 'stopped' },
    ];

    projectionsData.forEach((p, idx) => {
      const projection: Projection = {
        id: `proj-${(idx + 1).toString().padStart(6, '0')}`,
        name: p.name,
        description: `${p.name} projection for analytics and reporting`,
        status: p.status as ProjectionStatus,
        mode: p.mode as Projection['mode'],
        source: {
          type: 'all',
        },
        handlers: [
          {
            eventType: 'AlertCreated',
            handler: 'whenAlertCreated',
            emit: true,
          },
          {
            eventType: 'AlertResolved',
            handler: 'whenAlertResolved',
            emit: true,
          },
        ],
        state: {
          count: Math.floor(Math.random() * 1000),
          lastUpdated: new Date().toISOString(),
        },
        checkpoint: Math.floor(this.globalPosition * 0.95),
        position: Math.floor(this.globalPosition * 0.98),
        stats: {
          eventsProcessed: Math.floor(Math.random() * 50000) + 5000,
          eventsEmitted: Math.floor(Math.random() * 10000) + 1000,
          stateUpdates: Math.floor(Math.random() * 20000) + 2000,
          checkpointWrites: Math.floor(Math.random() * 1000) + 100,
          errorCount: Math.floor(Math.random() * 10),
          lastCheckpoint: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
          avgProcessingRate: Math.floor(Math.random() * 500) + 100,
        },
        settings: {
          checkpointInterval: 1000,
          checkpointThreshold: 10000,
          cacheSize: 10000,
          trackEmittedStreams: true,
        },
        createdAt: new Date(Date.now() - idx * 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        startedAt: p.status === 'running' ? new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000) : undefined,
      };
      this.projections.set(projection.id, projection);
    });
  }

  /**
   * Generate checksum
   */
  private generateChecksum(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Append event
   */
  public appendEvent(
    streamId: string,
    eventType: string,
    data: Record<string, unknown>,
    metadata: Partial<EventMetadata>
  ): StoredEvent {
    let stream = this.streams.get(streamId);

    if (!stream) {
      // Create new stream
      const [type] = streamId.split('-');
      stream = {
        id: streamId,
        type,
        aggregateId: streamId,
        aggregateType: type.charAt(0).toUpperCase() + type.slice(1),
        version: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        eventCount: 0,
        lastEventId: '',
        metadata: { owner: 'system', retention: 90 },
      };
      this.streams.set(streamId, stream);
    }

    this.globalPosition++;
    const eventId = `evt-${Date.now()}-${this.globalPosition.toString().padStart(10, '0')}`;

    const storedEvent: StoredEvent = {
      id: eventId,
      streamId,
      streamType: stream.type,
      eventType,
      eventCategory: 'domain',
      version: stream.version + 1,
      data,
      metadata: {
        source: metadata.source || 'api',
        tags: metadata.tags || [],
        custom: metadata.custom || {},
        userId: metadata.userId,
        sessionId: metadata.sessionId,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
      timestamp: new Date(),
      status: 'committed',
      position: this.globalPosition,
      checksum: this.generateChecksum(eventId),
    };

    this.events.set(eventId, storedEvent);

    // Update stream
    stream.version++;
    stream.eventCount++;
    stream.lastEventId = eventId;
    stream.updatedAt = new Date();

    // Publish event
    storedEvent.status = 'published';
    this.emit('event_appended', storedEvent);

    // Notify subscriptions
    this.notifySubscriptions(storedEvent);

    return storedEvent;
  }

  /**
   * Append events batch
   */
  public appendEvents(
    streamId: string,
    events: { eventType: string; data: Record<string, unknown>; metadata?: Partial<EventMetadata> }[]
  ): StoredEvent[] {
    return events.map((e) => this.appendEvent(streamId, e.eventType, e.data, e.metadata || {}));
  }

  /**
   * Notify subscriptions
   */
  private notifySubscriptions(event: StoredEvent): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription.status !== 'active') return;

      // Check if event matches subscription pattern
      const pattern = subscription.streamPattern.replace('*', '.*');
      if (!new RegExp(`^${pattern}$`).test(event.streamId)) return;

      // Check event types filter
      if (subscription.eventTypes.length > 0 && !subscription.eventTypes.includes(event.eventType)) return;

      // Update subscription stats
      subscription.stats.eventsProcessed++;
      subscription.stats.lastProcessedEvent = event.id;
      subscription.stats.lastProcessedAt = new Date();
      subscription.stats.currentPosition = event.position;

      this.emit('subscription_notified', { subscriptionId: subscription.id, eventId: event.id });
    });
  }

  /**
   * Get events
   */
  public getEvents(query: EventQuery): QueryResult {
    let events = Array.from(this.events.values());

    // Filter by streams
    if (query.streams?.length) {
      events = events.filter((e) => query.streams!.includes(e.streamId));
    }

    // Filter by stream pattern
    if (query.streamPattern) {
      const pattern = query.streamPattern.replace('*', '.*');
      events = events.filter((e) => new RegExp(`^${pattern}$`).test(e.streamId));
    }

    // Filter by event types
    if (query.eventTypes?.length) {
      events = events.filter((e) => query.eventTypes!.includes(e.eventType));
    }

    // Filter by categories
    if (query.categories?.length) {
      events = events.filter((e) => query.categories!.includes(e.eventCategory));
    }

    // Filter by position
    if (query.fromPosition !== undefined) {
      events = events.filter((e) => e.position >= query.fromPosition!);
    }
    if (query.toPosition !== undefined) {
      events = events.filter((e) => e.position <= query.toPosition!);
    }

    // Filter by timestamp
    if (query.fromTimestamp) {
      events = events.filter((e) => e.timestamp >= query.fromTimestamp!);
    }
    if (query.toTimestamp) {
      events = events.filter((e) => e.timestamp <= query.toTimestamp!);
    }

    // Filter by correlation ID
    if (query.correlationId) {
      events = events.filter((e) => e.correlationId === query.correlationId);
    }

    // Sort by position
    const direction = query.direction || 'forward';
    events.sort((a, b) => direction === 'forward' ? a.position - b.position : b.position - a.position);

    // Apply limit
    const totalCount = events.length;
    const limit = query.limit || 100;
    const hasMore = events.length > limit;
    events = events.slice(0, limit);

    return {
      events,
      totalCount,
      fromPosition: events.length > 0 ? events[0].position : 0,
      toPosition: events.length > 0 ? events[events.length - 1].position : 0,
      hasMore,
      nextPosition: hasMore && events.length > 0 ? events[events.length - 1].position + 1 : undefined,
    };
  }

  /**
   * Get event
   */
  public getEvent(eventId: string): StoredEvent | undefined {
    return this.events.get(eventId);
  }

  /**
   * Get stream
   */
  public getStream(streamId: string): EventStream | undefined {
    return this.streams.get(streamId);
  }

  /**
   * Get stream events
   */
  public getStreamEvents(streamId: string, fromVersion?: number, toVersion?: number): StoredEvent[] {
    const events = Array.from(this.events.values())
      .filter((e) => e.streamId === streamId)
      .filter((e) => fromVersion === undefined || e.version >= fromVersion)
      .filter((e) => toVersion === undefined || e.version <= toVersion)
      .sort((a, b) => a.version - b.version);

    return events;
  }

  /**
   * Get streams
   */
  public getStreams(filter?: { type?: string; limit?: number }): EventStream[] {
    let streams = Array.from(this.streams.values());
    if (filter?.type) streams = streams.filter((s) => s.type === filter.type);
    streams = streams.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    if (filter?.limit) streams = streams.slice(0, filter.limit);
    return streams;
  }

  /**
   * Create snapshot
   */
  public createSnapshot(streamId: string, state: Record<string, unknown>): StreamSnapshot {
    const stream = this.streams.get(streamId);
    if (!stream) throw new Error('Stream not found');

    const snapshot: StreamSnapshot = {
      id: `snap-${streamId}-${stream.version}`,
      streamId,
      version: stream.version,
      state,
      createdAt: new Date(),
      size: JSON.stringify(state).length,
      checksum: this.generateChecksum(`snap-${streamId}-${stream.version}`),
    };

    this.snapshots.set(snapshot.id, snapshot);
    stream.snapshot = snapshot;

    this.emit('snapshot_created', snapshot);

    return snapshot;
  }

  /**
   * Get snapshot
   */
  public getSnapshot(streamId: string, version?: number): StreamSnapshot | undefined {
    const stream = this.streams.get(streamId);
    if (!stream) return undefined;

    if (version) {
      return Array.from(this.snapshots.values())
        .find((s) => s.streamId === streamId && s.version <= version);
    }

    return stream.snapshot;
  }

  /**
   * Get subscriptions
   */
  public getSubscriptions(filter?: { status?: SubscriptionStatus }): EventSubscription[] {
    let subscriptions = Array.from(this.subscriptions.values());
    if (filter?.status) subscriptions = subscriptions.filter((s) => s.status === filter.status);
    return subscriptions;
  }

  /**
   * Get subscription
   */
  public getSubscription(subscriptionId: string): EventSubscription | undefined {
    return this.subscriptions.get(subscriptionId);
  }

  /**
   * Create subscription
   */
  public createSubscription(
    subscription: Omit<EventSubscription, 'id' | 'checkpoint' | 'stats' | 'createdAt' | 'updatedAt'>
  ): EventSubscription {
    const newSubscription: EventSubscription = {
      ...subscription,
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      checkpoint: subscription.startPosition === 'beginning' ? 0 : this.globalPosition,
      stats: {
        eventsProcessed: 0,
        eventsFailed: 0,
        avgProcessingTime: 0,
        lagCount: 0,
        currentPosition: subscription.startPosition === 'beginning' ? 0 : this.globalPosition,
        headPosition: this.globalPosition,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.subscriptions.set(newSubscription.id, newSubscription);
    this.emit('subscription_created', newSubscription);

    return newSubscription;
  }

  /**
   * Update subscription
   */
  public updateSubscription(subscriptionId: string, updates: Partial<EventSubscription>): EventSubscription {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');

    Object.assign(subscription, updates, { updatedAt: new Date() });
    this.emit('subscription_updated', subscription);

    return subscription;
  }

  /**
   * Delete subscription
   */
  public deleteSubscription(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) throw new Error('Subscription not found');

    this.subscriptions.delete(subscriptionId);
    this.emit('subscription_deleted', { subscriptionId });
  }

  /**
   * Get projections
   */
  public getProjections(filter?: { status?: ProjectionStatus }): Projection[] {
    let projections = Array.from(this.projections.values());
    if (filter?.status) projections = projections.filter((p) => p.status === filter.status);
    return projections;
  }

  /**
   * Get projection
   */
  public getProjection(projectionId: string): Projection | undefined {
    return this.projections.get(projectionId);
  }

  /**
   * Get projection state
   */
  public getProjectionState(projectionId: string): Record<string, unknown> | undefined {
    const projection = this.projections.get(projectionId);
    return projection?.state;
  }

  /**
   * Create projection
   */
  public createProjection(
    projection: Omit<Projection, 'id' | 'state' | 'checkpoint' | 'position' | 'stats' | 'createdAt' | 'updatedAt'>
  ): Projection {
    const newProjection: Projection = {
      ...projection,
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      state: {},
      checkpoint: 0,
      position: 0,
      stats: {
        eventsProcessed: 0,
        eventsEmitted: 0,
        stateUpdates: 0,
        checkpointWrites: 0,
        errorCount: 0,
        avgProcessingRate: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.projections.set(newProjection.id, newProjection);
    this.emit('projection_created', newProjection);

    return newProjection;
  }

  /**
   * Start projection
   */
  public startProjection(projectionId: string): Projection {
    const projection = this.projections.get(projectionId);
    if (!projection) throw new Error('Projection not found');

    projection.status = 'running';
    projection.startedAt = new Date();
    projection.updatedAt = new Date();

    this.emit('projection_started', projection);

    return projection;
  }

  /**
   * Stop projection
   */
  public stopProjection(projectionId: string): Projection {
    const projection = this.projections.get(projectionId);
    if (!projection) throw new Error('Projection not found');

    projection.status = 'stopped';
    projection.stoppedAt = new Date();
    projection.updatedAt = new Date();

    this.emit('projection_stopped', projection);

    return projection;
  }

  /**
   * Start replay
   */
  public startReplay(request: ReplayRequest): ReplaySession {
    const session: ReplaySession = {
      id: `replay-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      request,
      status: 'running',
      progress: {
        current: 0,
        total: this.globalPosition,
        percentage: 0,
      },
      eventsReplayed: 0,
      startedAt: new Date(),
    };

    this.replaySessions.set(session.id, session);
    this.emit('replay_started', session);

    // Simulate replay progress
    this.simulateReplay(session);

    return session;
  }

  /**
   * Simulate replay
   */
  private simulateReplay(session: ReplaySession): void {
    const interval = setInterval(() => {
      if (session.status !== 'running') {
        clearInterval(interval);
        return;
      }

      session.progress.current += Math.floor(session.progress.total / 10);
      session.progress.percentage = Math.min(100, (session.progress.current / session.progress.total) * 100);
      session.eventsReplayed += Math.floor(Math.random() * 100) + 50;

      if (session.progress.percentage >= 100) {
        session.status = 'completed';
        session.completedAt = new Date();
        clearInterval(interval);
        this.emit('replay_completed', session);
      }
    }, 1000);
  }

  /**
   * Get replay session
   */
  public getReplaySession(sessionId: string): ReplaySession | undefined {
    return this.replaySessions.get(sessionId);
  }

  /**
   * Cancel replay
   */
  public cancelReplay(sessionId: string): ReplaySession {
    const session = this.replaySessions.get(sessionId);
    if (!session) throw new Error('Replay session not found');

    session.status = 'cancelled';
    session.completedAt = new Date();

    this.emit('replay_cancelled', session);

    return session;
  }

  /**
   * Get stats
   */
  public getStats(period: { start: Date; end: Date }): EventStoreStats {
    const events = Array.from(this.events.values());
    const streams = Array.from(this.streams.values());
    const subscriptions = Array.from(this.subscriptions.values());
    const projections = Array.from(this.projections.values());

    const byCategory: Record<EventType, number> = {
      domain: 0, system: 0, audit: 0, integration: 0, notification: 0, command: 0, query: 0,
    };
    events.forEach((e) => byCategory[e.eventCategory]++);

    const totalEvents = events.length;

    return {
      period,
      overview: {
        totalEvents,
        totalStreams: streams.length,
        totalSubscriptions: subscriptions.length,
        totalProjections: projections.length,
        eventsPerSecond: Math.floor(totalEvents / (7 * 24 * 60 * 60)),
        storageSize: totalEvents * 500,
      },
      byCategory: Object.entries(byCategory).map(([category, count]) => ({
        category: category as EventType,
        count,
        percentage: totalEvents > 0 ? (count / totalEvents) * 100 : 0,
      })),
      byStream: streams.slice(0, 10).map((s) => ({
        streamId: s.id,
        streamType: s.type,
        eventCount: s.eventCount,
      })),
      eventTrend: Array.from({ length: 7 }, (_, i) => ({
        timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
        count: Math.floor(Math.random() * 1000) + 200,
        size: Math.floor(Math.random() * 500000) + 100000,
      })),
      subscriptionHealth: subscriptions.map((s) => ({
        subscriptionId: s.id,
        name: s.name,
        status: s.status,
        lag: s.stats.lagCount,
      })),
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

export const eventStoreService = EventStoreService.getInstance();
export type {
  EventType,
  EventStatus,
  SubscriptionStatus,
  ProjectionStatus,
  StoredEvent,
  EventMetadata,
  EventStream,
  StreamSnapshot,
  EventSubscription,
  SubscriptionHandler,
  SubscriptionSettings,
  SubscriptionStats,
  Projection,
  ProjectionSource,
  ProjectionHandler,
  ProjectionStats,
  ProjectionSettings,
  EventQuery,
  QueryResult,
  ReplayRequest,
  ReplaySession,
  EventStoreStats,
};
