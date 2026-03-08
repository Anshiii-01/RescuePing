/**
 * Message Queue Service
 * Asynchronous message processing, queue management, pub/sub, and event streaming
 */

// Message status
type MessageStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'dead_letter' | 'scheduled' | 'cancelled';

// Queue type
type QueueType = 'standard' | 'fifo' | 'priority' | 'delay' | 'dead_letter';

// Delivery mode
type DeliveryMode = 'at_most_once' | 'at_least_once' | 'exactly_once';

// Message priority
type MessagePriority = 'critical' | 'high' | 'normal' | 'low' | 'background';

// Subscription type
type SubscriptionType = 'push' | 'pull' | 'streaming';

// Message
interface Message {
  id: string;
  queueId: string;
  topic?: string;
  status: MessageStatus;
  priority: MessagePriority;
  headers: Record<string, string>;
  body: unknown;
  contentType: string;
  correlationId?: string;
  replyTo?: string;
  groupId?: string;
  deduplicationId?: string;
  scheduledAt?: Date;
  deliverAt?: Date;
  expiresAt?: Date;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  tracing: {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
  };
  metadata: {
    producerId: string;
    producerName: string;
    createdAt: Date;
    enqueuedAt: Date;
    processingStartedAt?: Date;
    completedAt?: Date;
    acknowledgedAt?: Date;
    size: number;
  };
}

// Queue
interface Queue {
  id: string;
  name: string;
  description: string;
  type: QueueType;
  status: 'active' | 'paused' | 'draining' | 'deleted';
  config: {
    maxSize: number;
    maxMessageSize: number;
    messageRetention: number;
    visibilityTimeout: number;
    deliveryDelay: number;
    receiveWaitTime: number;
    deliveryMode: DeliveryMode;
    fifo: boolean;
    contentBasedDeduplication: boolean;
    deadLetterQueue?: string;
    maxReceiveCount: number;
  };
  stats: {
    messagesVisible: number;
    messagesInFlight: number;
    messagesDelayed: number;
    messagesTotal: number;
    oldestMessage?: Date;
    approximateAge: number;
  };
  consumers: Consumer[];
  tags: Record<string, string>;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    lastActivity?: Date;
  };
}

// Consumer
interface Consumer {
  id: string;
  queueId: string;
  name: string;
  status: 'active' | 'idle' | 'busy' | 'disconnected';
  type: SubscriptionType;
  config: {
    prefetchCount: number;
    ackTimeout: number;
    maxConcurrency: number;
    autoAck: boolean;
    filter?: string;
  };
  stats: {
    messagesReceived: number;
    messagesAcknowledged: number;
    messagesRejected: number;
    messagesRequeued: number;
    averageProcessingTime: number;
    lastHeartbeat: Date;
  };
  connection: {
    clientId: string;
    ipAddress: string;
    connectedAt: Date;
  };
}

// Topic
interface Topic {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'deleted';
  config: {
    partitions: number;
    replicationFactor: number;
    retentionMs: number;
    maxMessageSize: number;
    compaction: boolean;
  };
  subscriptions: Subscription[];
  stats: {
    messagesPublished: number;
    messagesPerSecond: number;
    subscribers: number;
    partitionStats: {
      partition: number;
      offset: number;
      lag: number;
    }[];
  };
  schema?: {
    type: 'json' | 'avro' | 'protobuf';
    definition: Record<string, unknown>;
    version: number;
  };
  tags: Record<string, string>;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Subscription
interface Subscription {
  id: string;
  topicId: string;
  name: string;
  type: SubscriptionType;
  status: 'active' | 'paused' | 'expired';
  config: {
    ackDeadline: number;
    retainAckedMessages: boolean;
    messageRetention: number;
    filter?: string;
    deadLetterTopic?: string;
    maxDeliveryAttempts: number;
    pushConfig?: {
      endpoint: string;
      authentication?: {
        type: 'none' | 'bearer' | 'oauth';
        token?: string;
      };
    };
  };
  stats: {
    messagesDelivered: number;
    messagesAcknowledged: number;
    messagesPending: number;
    oldestUnackedMessage?: Date;
    deliveryRate: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    expiresAt?: Date;
  };
}

// Dead letter message
interface DeadLetterMessage extends Message {
  originalQueue: string;
  originalTopic?: string;
  failureReason: string;
  failedAt: Date;
  retryHistory: {
    attempt: number;
    timestamp: Date;
    error: string;
  }[];
}

// Scheduled message
interface ScheduledMessage {
  id: string;
  queueId: string;
  message: Omit<Message, 'id' | 'status' | 'metadata'>;
  schedule: {
    type: 'once' | 'recurring';
    executeAt?: Date;
    cron?: string;
    timezone?: string;
    repeatCount?: number;
    repeatInterval?: number;
  };
  status: 'scheduled' | 'executing' | 'completed' | 'cancelled' | 'failed';
  executions: {
    executionId: string;
    scheduledAt: Date;
    executedAt?: Date;
    status: 'pending' | 'success' | 'failed';
    error?: string;
  }[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    lastExecutedAt?: Date;
    nextExecutionAt?: Date;
  };
}

// Message batch
interface MessageBatch {
  id: string;
  queueId: string;
  messages: Message[];
  status: 'pending' | 'processing' | 'completed' | 'partial' | 'failed';
  results: {
    messageId: string;
    status: 'success' | 'failed';
    error?: string;
  }[];
  metadata: {
    createdAt: Date;
    processedAt?: Date;
    successCount: number;
    failureCount: number;
  };
}

// Queue metrics
interface QueueMetrics {
  queueId: string;
  period: { start: Date; end: Date };
  messagesEnqueued: number;
  messagesDequeued: number;
  messagesCompleted: number;
  messagesFailed: number;
  messagesExpired: number;
  averageWaitTime: number;
  averageProcessingTime: number;
  throughput: {
    enqueue: number;
    dequeue: number;
  };
  depth: {
    min: number;
    max: number;
    average: number;
    current: number;
  };
  consumerStats: {
    active: number;
    idle: number;
    processing: number;
  };
  errorRate: number;
  retryRate: number;
}

// Event
interface StreamEvent {
  id: string;
  streamId: string;
  type: string;
  source: string;
  subject?: string;
  data: unknown;
  dataContentType: string;
  time: Date;
  specVersion: string;
  extensions?: Record<string, unknown>;
}

// Stream
interface EventStream {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'archived';
  config: {
    retention: 'limits' | 'interest' | 'workqueue';
    maxAge: number;
    maxMessages: number;
    maxBytes: number;
    duplicateWindow: number;
    storage: 'file' | 'memory';
    replicas: number;
  };
  subjects: string[];
  consumers: StreamConsumer[];
  stats: {
    messages: number;
    bytes: number;
    firstSequence: number;
    lastSequence: number;
    consumerCount: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Stream consumer
interface StreamConsumer {
  id: string;
  streamId: string;
  name: string;
  durableName?: string;
  status: 'active' | 'inactive';
  config: {
    deliverPolicy: 'all' | 'last' | 'new' | 'by_start_sequence' | 'by_start_time';
    ackPolicy: 'none' | 'all' | 'explicit';
    ackWait: number;
    maxDeliver: number;
    filterSubject?: string;
    replayPolicy: 'instant' | 'original';
    maxAckPending: number;
  };
  stats: {
    delivered: number;
    ackPending: number;
    redelivered: number;
    waiting: number;
    numPending: number;
  };
}

class MessageQueueService {
  private static instance: MessageQueueService;
  private queues: Map<string, Queue> = new Map();
  private topics: Map<string, Topic> = new Map();
  private messages: Map<string, Message> = new Map();
  private deadLetterMessages: Map<string, DeadLetterMessage> = new Map();
  private scheduledMessages: Map<string, ScheduledMessage> = new Map();
  private streams: Map<string, EventStream> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): MessageQueueService {
    if (!MessageQueueService.instance) {
      MessageQueueService.instance = new MessageQueueService();
    }
    return MessageQueueService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize queues
    const queuesData = [
      { name: 'alerts-queue', type: 'priority', description: 'Queue for alert notifications' },
      { name: 'notifications-queue', type: 'standard', description: 'Queue for general notifications' },
      { name: 'email-queue', type: 'fifo', description: 'Queue for email delivery' },
      { name: 'sms-queue', type: 'fifo', description: 'Queue for SMS delivery' },
      { name: 'analytics-queue', type: 'standard', description: 'Queue for analytics events' },
      { name: 'webhook-queue', type: 'delay', description: 'Queue for webhook delivery' },
      { name: 'dlq-alerts', type: 'dead_letter', description: 'Dead letter queue for alerts' },
    ];

    queuesData.forEach((q, idx) => {
      const queue: Queue = {
        id: `queue-${(idx + 1).toString().padStart(4, '0')}`,
        name: q.name,
        description: q.description,
        type: q.type as QueueType,
        status: 'active',
        config: {
          maxSize: 1000000,
          maxMessageSize: 262144,
          messageRetention: 604800,
          visibilityTimeout: 30,
          deliveryDelay: q.type === 'delay' ? 60 : 0,
          receiveWaitTime: 20,
          deliveryMode: 'at_least_once',
          fifo: q.type === 'fifo',
          contentBasedDeduplication: q.type === 'fifo',
          deadLetterQueue: q.type !== 'dead_letter' ? 'dlq-alerts' : undefined,
          maxReceiveCount: 3,
        },
        stats: {
          messagesVisible: Math.floor(Math.random() * 1000),
          messagesInFlight: Math.floor(Math.random() * 50),
          messagesDelayed: q.type === 'delay' ? Math.floor(Math.random() * 100) : 0,
          messagesTotal: Math.floor(Math.random() * 100000) + 10000,
          oldestMessage: new Date(Date.now() - Math.random() * 3600000),
          approximateAge: Math.floor(Math.random() * 60),
        },
        consumers: [],
        tags: { environment: 'production', service: 'rescue-ping' },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          lastActivity: new Date(),
        },
      };

      // Add consumers
      for (let i = 0; i < 3; i++) {
        const consumer: Consumer = {
          id: `consumer-${idx}-${i}`,
          queueId: queue.id,
          name: `${q.name}-consumer-${i + 1}`,
          status: ['active', 'busy', 'idle'][i % 3] as Consumer['status'],
          type: 'pull',
          config: {
            prefetchCount: 10,
            ackTimeout: 30000,
            maxConcurrency: 5,
            autoAck: false,
          },
          stats: {
            messagesReceived: Math.floor(Math.random() * 10000),
            messagesAcknowledged: Math.floor(Math.random() * 9500),
            messagesRejected: Math.floor(Math.random() * 100),
            messagesRequeued: Math.floor(Math.random() * 50),
            averageProcessingTime: Math.random() * 500 + 100,
            lastHeartbeat: new Date(),
          },
          connection: {
            clientId: `client-${idx}-${i}`,
            ipAddress: `192.168.1.${10 + idx + i}`,
            connectedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          },
        };
        queue.consumers.push(consumer);
      }

      this.queues.set(queue.id, queue);
    });

    // Initialize topics
    const topicsData = [
      { name: 'alerts', description: 'Alert events topic' },
      { name: 'user-activity', description: 'User activity events' },
      { name: 'system-events', description: 'System events and logs' },
      { name: 'notifications', description: 'Notification events' },
      { name: 'analytics', description: 'Analytics events stream' },
    ];

    topicsData.forEach((t, idx) => {
      const topic: Topic = {
        id: `topic-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: t.description,
        status: 'active',
        config: {
          partitions: 3,
          replicationFactor: 2,
          retentionMs: 604800000,
          maxMessageSize: 1048576,
          compaction: false,
        },
        subscriptions: [],
        stats: {
          messagesPublished: Math.floor(Math.random() * 1000000),
          messagesPerSecond: Math.random() * 100,
          subscribers: Math.floor(Math.random() * 10) + 1,
          partitionStats: [
            { partition: 0, offset: 1000000 + Math.floor(Math.random() * 100000), lag: Math.floor(Math.random() * 100) },
            { partition: 1, offset: 1000000 + Math.floor(Math.random() * 100000), lag: Math.floor(Math.random() * 100) },
            { partition: 2, offset: 1000000 + Math.floor(Math.random() * 100000), lag: Math.floor(Math.random() * 100) },
          ],
        },
        tags: { environment: 'production' },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };

      // Add subscriptions
      for (let i = 0; i < 2; i++) {
        const subscription: Subscription = {
          id: `sub-${idx}-${i}`,
          topicId: topic.id,
          name: `${t.name}-subscription-${i + 1}`,
          type: i === 0 ? 'pull' : 'push',
          status: 'active',
          config: {
            ackDeadline: 60,
            retainAckedMessages: false,
            messageRetention: 604800,
            maxDeliveryAttempts: 5,
            pushConfig: i === 1 ? {
              endpoint: `https://api.rescueping.com/webhooks/${t.name}`,
              authentication: { type: 'bearer', token: 'token-xxx' },
            } : undefined,
          },
          stats: {
            messagesDelivered: Math.floor(Math.random() * 500000),
            messagesAcknowledged: Math.floor(Math.random() * 490000),
            messagesPending: Math.floor(Math.random() * 1000),
            deliveryRate: Math.random() * 50,
          },
          metadata: {
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            createdBy: 'admin',
            updatedAt: new Date(),
          },
        };
        topic.subscriptions.push(subscription);
      }

      this.topics.set(topic.id, topic);
    });

    // Initialize sample messages
    for (let i = 0; i < 100; i++) {
      const queueIdx = i % 6;
      const message: Message = {
        id: `msg-${(i + 1).toString().padStart(6, '0')}`,
        queueId: `queue-${(queueIdx + 1).toString().padStart(4, '0')}`,
        status: ['pending', 'processing', 'completed', 'failed'][i % 4] as MessageStatus,
        priority: ['critical', 'high', 'normal', 'low'][i % 4] as MessagePriority,
        headers: {
          'Content-Type': 'application/json',
          'X-Trace-Id': `trace-${i}`,
        },
        body: {
          type: ['alert', 'notification', 'email', 'sms'][i % 4],
          payload: { message: `Sample message ${i + 1}` },
        },
        contentType: 'application/json',
        correlationId: `corr-${Math.floor(i / 10)}`,
        retryCount: i % 4 === 3 ? 3 : 0,
        maxRetries: 3,
        lastError: i % 4 === 3 ? 'Processing timeout' : undefined,
        tracing: {
          traceId: `trace-${this.generateId()}`,
          spanId: `span-${this.generateId()}`,
        },
        metadata: {
          producerId: `producer-${queueIdx}`,
          producerName: `Service ${queueIdx + 1}`,
          createdAt: new Date(Date.now() - Math.random() * 3600000),
          enqueuedAt: new Date(Date.now() - Math.random() * 3000000),
          processingStartedAt: i % 4 >= 1 ? new Date(Date.now() - Math.random() * 2000000) : undefined,
          completedAt: i % 4 === 2 ? new Date() : undefined,
          size: Math.floor(Math.random() * 10000) + 100,
        },
      };
      this.messages.set(message.id, message);
    }

    // Initialize dead letter messages
    for (let i = 0; i < 10; i++) {
      const dlm: DeadLetterMessage = {
        id: `dlm-${(i + 1).toString().padStart(4, '0')}`,
        queueId: 'queue-0007',
        originalQueue: `queue-${((i % 6) + 1).toString().padStart(4, '0')}`,
        status: 'dead_letter',
        priority: 'normal',
        headers: {},
        body: { failedPayload: `Failed message ${i + 1}` },
        contentType: 'application/json',
        retryCount: 3,
        maxRetries: 3,
        failureReason: ['Timeout', 'Invalid format', 'Processing error', 'Network error'][i % 4],
        failedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        retryHistory: [
          { attempt: 1, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), error: 'First attempt failed' },
          { attempt: 2, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), error: 'Second attempt failed' },
          { attempt: 3, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), error: 'Final attempt failed' },
        ],
        tracing: {
          traceId: `trace-dlm-${i}`,
          spanId: `span-dlm-${i}`,
        },
        metadata: {
          producerId: 'unknown',
          producerName: 'Unknown',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          enqueuedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          size: 500,
        },
      };
      this.deadLetterMessages.set(dlm.id, dlm);
    }

    // Initialize scheduled messages
    for (let i = 0; i < 5; i++) {
      const sm: ScheduledMessage = {
        id: `scheduled-${(i + 1).toString().padStart(4, '0')}`,
        queueId: `queue-${((i % 3) + 1).toString().padStart(4, '0')}`,
        message: {
          queueId: '',
          priority: 'normal',
          headers: {},
          body: { scheduledPayload: `Scheduled message ${i + 1}` },
          contentType: 'application/json',
          retryCount: 0,
          maxRetries: 3,
          tracing: {
            traceId: `trace-scheduled-${i}`,
            spanId: `span-scheduled-${i}`,
          },
        },
        schedule: {
          type: i % 2 === 0 ? 'once' : 'recurring',
          executeAt: i % 2 === 0 ? new Date(Date.now() + (i + 1) * 60 * 60 * 1000) : undefined,
          cron: i % 2 === 1 ? '0 */6 * * *' : undefined,
          timezone: 'Asia/Kolkata',
        },
        status: 'scheduled',
        executions: [],
        metadata: {
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          createdBy: 'scheduler',
          nextExecutionAt: new Date(Date.now() + (i + 1) * 60 * 60 * 1000),
        },
      };
      this.scheduledMessages.set(sm.id, sm);
    }

    // Initialize event streams
    const streamsData = [
      { name: 'events', description: 'Main event stream' },
      { name: 'audit-log', description: 'Audit log stream' },
      { name: 'metrics', description: 'Metrics stream' },
    ];

    streamsData.forEach((s, idx) => {
      const stream: EventStream = {
        id: `stream-${(idx + 1).toString().padStart(4, '0')}`,
        name: s.name,
        description: s.description,
        status: 'active',
        config: {
          retention: 'limits',
          maxAge: 604800000,
          maxMessages: 10000000,
          maxBytes: 10737418240,
          duplicateWindow: 120000,
          storage: 'file',
          replicas: 1,
        },
        subjects: [`${s.name}.*`, `${s.name}.>`],
        consumers: [],
        stats: {
          messages: Math.floor(Math.random() * 1000000),
          bytes: Math.floor(Math.random() * 1073741824),
          firstSequence: 1,
          lastSequence: Math.floor(Math.random() * 1000000),
          consumerCount: 3,
        },
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };

      // Add stream consumers
      for (let i = 0; i < 2; i++) {
        const consumer: StreamConsumer = {
          id: `stream-consumer-${idx}-${i}`,
          streamId: stream.id,
          name: `${s.name}-consumer-${i + 1}`,
          durableName: `${s.name}-durable-${i + 1}`,
          status: 'active',
          config: {
            deliverPolicy: 'all',
            ackPolicy: 'explicit',
            ackWait: 30000,
            maxDeliver: 5,
            replayPolicy: 'instant',
            maxAckPending: 1000,
          },
          stats: {
            delivered: Math.floor(Math.random() * 100000),
            ackPending: Math.floor(Math.random() * 100),
            redelivered: Math.floor(Math.random() * 1000),
            waiting: Math.floor(Math.random() * 10),
            numPending: Math.floor(Math.random() * 10000),
          },
        };
        stream.consumers.push(consumer);
      }

      this.streams.set(stream.id, stream);
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get queues
   */
  public getQueues(filter?: { type?: QueueType; status?: Queue['status'] }): Queue[] {
    let queues = Array.from(this.queues.values());
    if (filter?.type) queues = queues.filter((q) => q.type === filter.type);
    if (filter?.status) queues = queues.filter((q) => q.status === filter.status);
    return queues.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get queue
   */
  public getQueue(id: string): Queue | undefined {
    return this.queues.get(id);
  }

  /**
   * Create queue
   */
  public createQueue(data: {
    name: string;
    description: string;
    type: QueueType;
    config: Partial<Queue['config']>;
    creator: string;
  }): Queue {
    const queue: Queue = {
      id: `queue-${Date.now()}-${this.generateId()}`,
      name: data.name,
      description: data.description,
      type: data.type,
      status: 'active',
      config: {
        maxSize: data.config.maxSize || 1000000,
        maxMessageSize: data.config.maxMessageSize || 262144,
        messageRetention: data.config.messageRetention || 604800,
        visibilityTimeout: data.config.visibilityTimeout || 30,
        deliveryDelay: data.config.deliveryDelay || 0,
        receiveWaitTime: data.config.receiveWaitTime || 20,
        deliveryMode: data.config.deliveryMode || 'at_least_once',
        fifo: data.type === 'fifo',
        contentBasedDeduplication: data.config.contentBasedDeduplication || false,
        maxReceiveCount: data.config.maxReceiveCount || 3,
      },
      stats: {
        messagesVisible: 0,
        messagesInFlight: 0,
        messagesDelayed: 0,
        messagesTotal: 0,
        approximateAge: 0,
      },
      consumers: [],
      tags: {},
      metadata: {
        createdAt: new Date(),
        createdBy: data.creator,
        updatedAt: new Date(),
      },
    };

    this.queues.set(queue.id, queue);
    this.emit('queue_created', queue);

    return queue;
  }

  /**
   * Enqueue message
   */
  public enqueue(queueId: string, data: {
    body: unknown;
    priority?: MessagePriority;
    headers?: Record<string, string>;
    delay?: number;
    groupId?: string;
    deduplicationId?: string;
    producer: string;
  }): Message {
    const queue = this.queues.get(queueId);
    if (!queue) throw new Error('Queue not found');

    const message: Message = {
      id: `msg-${Date.now()}-${this.generateId()}`,
      queueId,
      status: data.delay ? 'scheduled' : 'pending',
      priority: data.priority || 'normal',
      headers: data.headers || {},
      body: data.body,
      contentType: 'application/json',
      groupId: data.groupId,
      deduplicationId: data.deduplicationId,
      deliverAt: data.delay ? new Date(Date.now() + data.delay * 1000) : undefined,
      retryCount: 0,
      maxRetries: queue.config.maxReceiveCount,
      tracing: {
        traceId: `trace-${this.generateId()}`,
        spanId: `span-${this.generateId()}`,
      },
      metadata: {
        producerId: data.producer,
        producerName: data.producer,
        createdAt: new Date(),
        enqueuedAt: new Date(),
        size: JSON.stringify(data.body).length,
      },
    };

    this.messages.set(message.id, message);
    queue.stats.messagesTotal++;
    queue.stats.messagesVisible++;

    this.emit('message_enqueued', message);

    return message;
  }

  /**
   * Dequeue message
   */
  public dequeue(queueId: string, consumerId: string, count: number = 1): Message[] {
    const queue = this.queues.get(queueId);
    if (!queue) throw new Error('Queue not found');

    const pendingMessages = Array.from(this.messages.values())
      .filter((m) => m.queueId === queueId && m.status === 'pending')
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3, background: 4 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, count);

    pendingMessages.forEach((message) => {
      message.status = 'processing';
      message.metadata.processingStartedAt = new Date();
      queue.stats.messagesVisible--;
      queue.stats.messagesInFlight++;
    });

    return pendingMessages;
  }

  /**
   * Acknowledge message
   */
  public acknowledge(messageId: string): void {
    const message = this.messages.get(messageId);
    if (!message) throw new Error('Message not found');

    message.status = 'completed';
    message.metadata.completedAt = new Date();
    message.metadata.acknowledgedAt = new Date();

    const queue = this.queues.get(message.queueId);
    if (queue) {
      queue.stats.messagesInFlight--;
    }

    this.emit('message_acknowledged', message);
  }

  /**
   * Reject message
   */
  public reject(messageId: string, requeue: boolean = true): void {
    const message = this.messages.get(messageId);
    if (!message) throw new Error('Message not found');

    const queue = this.queues.get(message.queueId);

    if (requeue && message.retryCount < message.maxRetries) {
      message.status = 'pending';
      message.retryCount++;
      if (queue) {
        queue.stats.messagesInFlight--;
        queue.stats.messagesVisible++;
      }
    } else {
      message.status = 'dead_letter';
      message.lastError = 'Max retries exceeded';
      if (queue) {
        queue.stats.messagesInFlight--;
      }

      // Move to dead letter queue
      const dlm: DeadLetterMessage = {
        ...message,
        originalQueue: message.queueId,
        failureReason: 'Max retries exceeded',
        failedAt: new Date(),
        retryHistory: [],
      };
      this.deadLetterMessages.set(dlm.id, dlm);
    }

    this.emit('message_rejected', message);
  }

  /**
   * Get topics
   */
  public getTopics(): Topic[] {
    return Array.from(this.topics.values());
  }

  /**
   * Get topic
   */
  public getTopic(id: string): Topic | undefined {
    return this.topics.get(id);
  }

  /**
   * Publish to topic
   */
  public publish(topicId: string, event: Omit<StreamEvent, 'id' | 'time' | 'specVersion'>): StreamEvent {
    const topic = this.topics.get(topicId);
    if (!topic) throw new Error('Topic not found');

    const streamEvent: StreamEvent = {
      ...event,
      id: `event-${Date.now()}-${this.generateId()}`,
      time: new Date(),
      specVersion: '1.0',
    };

    topic.stats.messagesPublished++;

    this.emit('event_published', { topicId, event: streamEvent });

    return streamEvent;
  }

  /**
   * Get dead letter messages
   */
  public getDeadLetterMessages(): DeadLetterMessage[] {
    return Array.from(this.deadLetterMessages.values());
  }

  /**
   * Get scheduled messages
   */
  public getScheduledMessages(): ScheduledMessage[] {
    return Array.from(this.scheduledMessages.values());
  }

  /**
   * Get streams
   */
  public getStreams(): EventStream[] {
    return Array.from(this.streams.values());
  }

  /**
   * Get queue metrics
   */
  public getQueueMetrics(queueId: string, period: { start: Date; end: Date }): QueueMetrics {
    const queue = this.queues.get(queueId);
    if (!queue) throw new Error('Queue not found');

    const messages = Array.from(this.messages.values())
      .filter((m) => m.queueId === queueId && m.metadata.createdAt >= period.start && m.metadata.createdAt <= period.end);

    const completed = messages.filter((m) => m.status === 'completed');
    const failed = messages.filter((m) => m.status === 'failed' || m.status === 'dead_letter');

    return {
      queueId,
      period,
      messagesEnqueued: messages.length,
      messagesDequeued: completed.length + failed.length,
      messagesCompleted: completed.length,
      messagesFailed: failed.length,
      messagesExpired: 0,
      averageWaitTime: 500,
      averageProcessingTime: 200,
      throughput: {
        enqueue: messages.length / ((period.end.getTime() - period.start.getTime()) / 1000),
        dequeue: (completed.length + failed.length) / ((period.end.getTime() - period.start.getTime()) / 1000),
      },
      depth: {
        min: 0,
        max: queue.stats.messagesVisible + 100,
        average: queue.stats.messagesVisible,
        current: queue.stats.messagesVisible,
      },
      consumerStats: {
        active: queue.consumers.filter((c) => c.status === 'active').length,
        idle: queue.consumers.filter((c) => c.status === 'idle').length,
        processing: queue.consumers.filter((c) => c.status === 'busy').length,
      },
      errorRate: failed.length / (messages.length || 1),
      retryRate: messages.filter((m) => m.retryCount > 0).length / (messages.length || 1),
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

export const messageQueueService = MessageQueueService.getInstance();
export type {
  MessageStatus,
  QueueType,
  DeliveryMode,
  MessagePriority,
  SubscriptionType,
  Message,
  Queue,
  Consumer,
  Topic,
  Subscription,
  DeadLetterMessage,
  ScheduledMessage,
  MessageBatch,
  QueueMetrics,
  StreamEvent,
  EventStream,
  StreamConsumer,
};
