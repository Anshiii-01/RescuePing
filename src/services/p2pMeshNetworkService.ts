// @ts-nocheck
/**
 * P2P Mesh Network Service - Issue #122 Implementation
 * 
 * Provides peer-to-peer communication capabilities when traditional infrastructure fails.
 * Implements mesh networking for disaster zones with node discovery, message routing,
 * and resilient data propagation.
 */

// Node and network status types
type NodeStatus = 'active' | 'inactive' | 'connecting' | 'disconnected' | 'unreachable';
type NetworkTopology = 'mesh' | 'star' | 'tree' | 'hybrid';
type MessagePriority = 'critical' | 'high' | 'normal' | 'low';
type MessageType = 'emergency' | 'status' | 'resource' | 'coordination' | 'heartbeat' | 'discovery' | 'relay' | 'ack';
type ConnectionType = 'wifi_direct' | 'bluetooth' | 'lora' | 'wifi_adhoc' | 'nfc' | 'ultrasound';

// Node interfaces
interface MeshNode {
  id: string;
  deviceId: string;
  name: string;
  status: NodeStatus;
  location: {
    lat: number;
    lon: number;
    accuracy: number;
    timestamp: Date;
  };
  capabilities: NodeCapabilities;
  connections: PeerConnection[];
  metrics: NodeMetrics;
  lastSeen: Date;
  createdAt: Date;
  metadata: Record<string, any>;
}

interface NodeCapabilities {
  connectionTypes: ConnectionType[];
  maxConnections: number;
  bandwidth: number; // KB/s
  range: number; // meters
  batteryLevel?: number;
  storageAvailable: number; // MB
  canRelay: boolean;
  hasGPS: boolean;
  hasInternet: boolean;
}

interface PeerConnection {
  peerId: string;
  peerName: string;
  connectionType: ConnectionType;
  signalStrength: number; // -100 to 0 dBm
  latency: number; // ms
  bandwidth: number; // KB/s
  established: Date;
  lastActivity: Date;
  messagesSent: number;
  messagesReceived: number;
  bytesTransferred: number;
}

interface NodeMetrics {
  uptime: number;
  messagesRouted: number;
  messagesOriginated: number;
  bytesRelayed: number;
  connectionAttempts: number;
  connectionFailures: number;
  averageLatency: number;
  packetLoss: number;
}

// Message interfaces
interface MeshMessage {
  id: string;
  type: MessageType;
  priority: MessagePriority;
  sourceId: string;
  destinationId: string | 'broadcast';
  payload: MessagePayload;
  routing: MessageRouting;
  encryption: EncryptionInfo;
  timestamp: Date;
  expiresAt: Date;
  acknowledgments: MessageAck[];
}

interface MessagePayload {
  contentType: string;
  content: string | object;
  attachments?: MessageAttachment[];
  compressed: boolean;
  size: number;
}

interface MessageAttachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  data?: string; // Base64 encoded
  checksum: string;
}

interface MessageRouting {
  hops: RoutingHop[];
  maxHops: number;
  ttl: number;
  algorithm: 'flooding' | 'gossip' | 'dsr' | 'aodv' | 'olsr';
  path?: string[];
}

interface RoutingHop {
  nodeId: string;
  timestamp: Date;
  latency: number;
}

interface EncryptionInfo {
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305' | 'none';
  keyId?: string;
  signature?: string;
}

interface MessageAck {
  nodeId: string;
  timestamp: Date;
  received: boolean;
  relayed: boolean;
}

// Network interfaces
interface MeshNetwork {
  id: string;
  name: string;
  topology: NetworkTopology;
  nodes: Map<string, MeshNode>;
  messages: Map<string, MeshMessage>;
  config: NetworkConfig;
  statistics: NetworkStatistics;
  status: 'active' | 'degraded' | 'offline';
  createdAt: Date;
  updatedAt: Date;
}

interface NetworkConfig {
  maxNodes: number;
  maxMessageSize: number; // bytes
  messageTTL: number; // seconds
  heartbeatInterval: number; // ms
  discoveryInterval: number; // ms
  routingAlgorithm: MessageRouting['algorithm'];
  encryptionEnabled: boolean;
  compressionEnabled: boolean;
  reliableDelivery: boolean;
  storeAndForward: boolean;
}

interface NetworkStatistics {
  totalNodes: number;
  activeNodes: number;
  totalMessages: number;
  deliveredMessages: number;
  failedMessages: number;
  averageHops: number;
  networkDiameter: number;
  averageLatency: number;
  throughput: number; // messages/second
  reliability: number; // percentage
}

// Discovery interfaces
interface DiscoveryResult {
  discoveredNodes: MeshNode[];
  newConnections: number;
  timestamp: Date;
  scanDuration: number;
  connectionTypes: ConnectionType[];
}

// Emergency broadcast interface
interface EmergencyBroadcast {
  id: string;
  message: MeshMessage;
  coverage: {
    targetNodes: number;
    reachedNodes: number;
    pendingNodes: number;
    failedNodes: number;
  };
  status: 'broadcasting' | 'completed' | 'partial' | 'failed';
  startTime: Date;
  endTime?: Date;
}

// Store and forward queue
interface QueuedMessage {
  message: MeshMessage;
  targetId: string;
  attempts: number;
  lastAttempt?: Date;
  nextAttempt: Date;
}

// Subscription interface
interface NetworkSubscription {
  id: string;
  callback: (event: NetworkEvent) => void;
  eventTypes?: NetworkEventType[];
}

type NetworkEventType = 'node_joined' | 'node_left' | 'message_received' | 'message_delivered' | 'connection_established' | 'connection_lost' | 'network_status_changed';

interface NetworkEvent {
  type: NetworkEventType;
  timestamp: Date;
  data: any;
}

// Sample data
const sampleNodes: MeshNode[] = [
  {
    id: 'node-001',
    deviceId: 'device-abc123',
    name: 'Emergency Hub Alpha',
    status: 'active',
    location: { lat: 37.7749, lon: -122.4194, accuracy: 10, timestamp: new Date() },
    capabilities: {
      connectionTypes: ['wifi_direct', 'bluetooth', 'lora'],
      maxConnections: 20,
      bandwidth: 500,
      range: 1000,
      batteryLevel: 85,
      storageAvailable: 2048,
      canRelay: true,
      hasGPS: true,
      hasInternet: false
    },
    connections: [
      {
        peerId: 'node-002',
        peerName: 'Mobile Unit Beta',
        connectionType: 'wifi_direct',
        signalStrength: -45,
        latency: 15,
        bandwidth: 450,
        established: new Date('2026-01-09T08:00:00Z'),
        lastActivity: new Date(),
        messagesSent: 234,
        messagesReceived: 189,
        bytesTransferred: 1024000
      }
    ],
    metrics: {
      uptime: 28800,
      messagesRouted: 1523,
      messagesOriginated: 45,
      bytesRelayed: 5242880,
      connectionAttempts: 150,
      connectionFailures: 12,
      averageLatency: 25,
      packetLoss: 0.02
    },
    lastSeen: new Date(),
    createdAt: new Date('2026-01-09T00:00:00Z'),
    metadata: { role: 'hub', priority: 1 }
  },
  {
    id: 'node-002',
    deviceId: 'device-def456',
    name: 'Mobile Unit Beta',
    status: 'active',
    location: { lat: 37.7751, lon: -122.4180, accuracy: 15, timestamp: new Date() },
    capabilities: {
      connectionTypes: ['wifi_direct', 'bluetooth'],
      maxConnections: 5,
      bandwidth: 200,
      range: 100,
      batteryLevel: 62,
      storageAvailable: 512,
      canRelay: true,
      hasGPS: true,
      hasInternet: false
    },
    connections: [],
    metrics: {
      uptime: 14400,
      messagesRouted: 89,
      messagesOriginated: 23,
      bytesRelayed: 524288,
      connectionAttempts: 45,
      connectionFailures: 5,
      averageLatency: 35,
      packetLoss: 0.05
    },
    lastSeen: new Date(),
    createdAt: new Date('2026-01-09T04:00:00Z'),
    metadata: { role: 'mobile', team: 'rescue-1' }
  },
  {
    id: 'node-003',
    deviceId: 'device-ghi789',
    name: 'Shelter Point Charlie',
    status: 'active',
    location: { lat: 37.7745, lon: -122.4200, accuracy: 5, timestamp: new Date() },
    capabilities: {
      connectionTypes: ['wifi_direct', 'lora'],
      maxConnections: 50,
      bandwidth: 1000,
      range: 5000,
      batteryLevel: 100,
      storageAvailable: 8192,
      canRelay: true,
      hasGPS: true,
      hasInternet: true
    },
    connections: [],
    metrics: {
      uptime: 86400,
      messagesRouted: 5678,
      messagesOriginated: 234,
      bytesRelayed: 52428800,
      connectionAttempts: 500,
      connectionFailures: 25,
      averageLatency: 20,
      packetLoss: 0.01
    },
    lastSeen: new Date(),
    createdAt: new Date('2026-01-08T00:00:00Z'),
    metadata: { role: 'gateway', hasExternalConnection: true }
  }
];

class P2PMeshNetworkService {
  private static instance: P2PMeshNetworkService;
  private network: MeshNetwork;
  private localNode: MeshNode | null = null;
  private messageQueue: QueuedMessage[] = [];
  private subscriptions: Map<string, NetworkSubscription> = new Map();
  private discoveryTimer: NodeJS.Timer | null = null;
  private heartbeatTimer: NodeJS.Timer | null = null;
  private routingTable: Map<string, string[]> = new Map();
  private seenMessages: Set<string> = new Set();

  private constructor() {
    this.network = this.initializeNetwork();
    this.initializeSampleData();
  }

  public static getInstance(): P2PMeshNetworkService {
    if (!P2PMeshNetworkService.instance) {
      P2PMeshNetworkService.instance = new P2PMeshNetworkService();
    }
    return P2PMeshNetworkService.instance;
  }

  private initializeNetwork(): MeshNetwork {
    return {
      id: `network-${Date.now()}`,
      name: 'Emergency Mesh Network',
      topology: 'mesh',
      nodes: new Map(),
      messages: new Map(),
      config: {
        maxNodes: 1000,
        maxMessageSize: 65536,
        messageTTL: 300,
        heartbeatInterval: 5000,
        discoveryInterval: 30000,
        routingAlgorithm: 'gossip',
        encryptionEnabled: true,
        compressionEnabled: true,
        reliableDelivery: true,
        storeAndForward: true
      },
      statistics: {
        totalNodes: 0,
        activeNodes: 0,
        totalMessages: 0,
        deliveredMessages: 0,
        failedMessages: 0,
        averageHops: 0,
        networkDiameter: 0,
        averageLatency: 0,
        throughput: 0,
        reliability: 0
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private initializeSampleData(): void {
    sampleNodes.forEach(node => this.network.nodes.set(node.id, node));
    this.updateNetworkStatistics();
  }

  // ==================== Node Management ====================

  async joinNetwork(deviceId: string, name: string, capabilities: NodeCapabilities, location: MeshNode['location']): Promise<MeshNode> {
    const node: MeshNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deviceId,
      name,
      status: 'connecting',
      location,
      capabilities,
      connections: [],
      metrics: {
        uptime: 0,
        messagesRouted: 0,
        messagesOriginated: 0,
        bytesRelayed: 0,
        connectionAttempts: 0,
        connectionFailures: 0,
        averageLatency: 0,
        packetLoss: 0
      },
      lastSeen: new Date(),
      createdAt: new Date(),
      metadata: {}
    };

    this.network.nodes.set(node.id, node);
    this.localNode = node;

    // Start discovery and heartbeat
    await this.startDiscovery();
    this.startHeartbeat();

    node.status = 'active';
    this.emitEvent({ type: 'node_joined', timestamp: new Date(), data: node });
    this.updateNetworkStatistics();

    return node;
  }

  async leaveNetwork(nodeId: string): Promise<void> {
    const node = this.network.nodes.get(nodeId);
    if (!node) return;

    // Notify peers
    for (const connection of node.connections) {
      const peer = this.network.nodes.get(connection.peerId);
      if (peer) {
        peer.connections = peer.connections.filter(c => c.peerId !== nodeId);
      }
    }

    // Stop timers if local node
    if (this.localNode?.id === nodeId) {
      this.stopDiscovery();
      this.stopHeartbeat();
      this.localNode = null;
    }

    this.network.nodes.delete(nodeId);
    this.emitEvent({ type: 'node_left', timestamp: new Date(), data: { nodeId } });
    this.updateNetworkStatistics();
  }

  async getNode(nodeId: string): Promise<MeshNode | null> {
    return this.network.nodes.get(nodeId) || null;
  }

  async getAllNodes(filters?: { status?: NodeStatus[]; hasInternet?: boolean }): Promise<MeshNode[]> {
    let nodes = Array.from(this.network.nodes.values());

    if (filters?.status) {
      nodes = nodes.filter(n => filters.status!.includes(n.status));
    }

    if (filters?.hasInternet !== undefined) {
      nodes = nodes.filter(n => n.capabilities.hasInternet === filters.hasInternet);
    }

    return nodes;
  }

  async updateNodeLocation(nodeId: string, location: MeshNode['location']): Promise<void> {
    const node = this.network.nodes.get(nodeId);
    if (node) {
      node.location = location;
      node.lastSeen = new Date();
    }
  }

  // ==================== Connection Management ====================

  async connectToPeer(targetNodeId: string, connectionType: ConnectionType): Promise<PeerConnection | null> {
    if (!this.localNode) {
      throw new Error('Local node not initialized. Call joinNetwork first.');
    }

    const targetNode = this.network.nodes.get(targetNodeId);
    if (!targetNode) {
      throw new Error(`Target node not found: ${targetNodeId}`);
    }

    // Check if already connected
    const existingConnection = this.localNode.connections.find(c => c.peerId === targetNodeId);
    if (existingConnection) {
      return existingConnection;
    }

    // Check compatibility
    const commonTypes = this.localNode.capabilities.connectionTypes.filter(
      t => targetNode.capabilities.connectionTypes.includes(t)
    );
    if (!commonTypes.includes(connectionType)) {
      throw new Error(`Incompatible connection type: ${connectionType}`);
    }

    // Simulate connection establishment
    this.localNode.metrics.connectionAttempts++;

    const success = Math.random() > 0.1; // 90% success rate
    if (!success) {
      this.localNode.metrics.connectionFailures++;
      return null;
    }

    const connection: PeerConnection = {
      peerId: targetNodeId,
      peerName: targetNode.name,
      connectionType,
      signalStrength: -40 - Math.random() * 40,
      latency: 10 + Math.random() * 50,
      bandwidth: Math.min(this.localNode.capabilities.bandwidth, targetNode.capabilities.bandwidth),
      established: new Date(),
      lastActivity: new Date(),
      messagesSent: 0,
      messagesReceived: 0,
      bytesTransferred: 0
    };

    this.localNode.connections.push(connection);

    // Add reverse connection
    targetNode.connections.push({
      ...connection,
      peerId: this.localNode.id,
      peerName: this.localNode.name
    });

    this.emitEvent({ 
      type: 'connection_established', 
      timestamp: new Date(), 
      data: { localNode: this.localNode.id, peerNode: targetNodeId, connectionType } 
    });

    this.updateRoutingTable();
    return connection;
  }

  async disconnectFromPeer(targetNodeId: string): Promise<void> {
    if (!this.localNode) return;

    this.localNode.connections = this.localNode.connections.filter(c => c.peerId !== targetNodeId);

    const targetNode = this.network.nodes.get(targetNodeId);
    if (targetNode) {
      targetNode.connections = targetNode.connections.filter(c => c.peerId !== this.localNode!.id);
    }

    this.emitEvent({ 
      type: 'connection_lost', 
      timestamp: new Date(), 
      data: { localNode: this.localNode.id, peerNode: targetNodeId } 
    });

    this.updateRoutingTable();
  }

  getConnections(): PeerConnection[] {
    return this.localNode?.connections || [];
  }

  // ==================== Discovery ====================

  private async startDiscovery(): Promise<void> {
    await this.performDiscovery();
    
    this.discoveryTimer = setInterval(() => {
      this.performDiscovery();
    }, this.network.config.discoveryInterval);
  }

  private stopDiscovery(): void {
    if (this.discoveryTimer) {
      clearInterval(this.discoveryTimer);
      this.discoveryTimer = null;
    }
  }

  async performDiscovery(): Promise<DiscoveryResult> {
    if (!this.localNode) {
      return { discoveredNodes: [], newConnections: 0, timestamp: new Date(), scanDuration: 0, connectionTypes: [] };
    }

    const startTime = Date.now();
    const discoveredNodes: MeshNode[] = [];
    let newConnections = 0;

    // Scan for nearby nodes
    for (const [nodeId, node] of this.network.nodes) {
      if (nodeId === this.localNode.id) continue;
      if (node.status !== 'active') continue;

      // Check if within range
      const distance = this.calculateDistance(this.localNode.location, node.location);
      const maxRange = Math.max(this.localNode.capabilities.range, node.capabilities.range);

      if (distance <= maxRange) {
        discoveredNodes.push(node);

        // Attempt connection if not already connected
        const isConnected = this.localNode.connections.some(c => c.peerId === nodeId);
        if (!isConnected && this.localNode.connections.length < this.localNode.capabilities.maxConnections) {
          const commonTypes = this.localNode.capabilities.connectionTypes.filter(
            t => node.capabilities.connectionTypes.includes(t)
          );
          if (commonTypes.length > 0) {
            const connection = await this.connectToPeer(nodeId, commonTypes[0]);
            if (connection) newConnections++;
          }
        }
      }
    }

    return {
      discoveredNodes,
      newConnections,
      timestamp: new Date(),
      scanDuration: Date.now() - startTime,
      connectionTypes: this.localNode.capabilities.connectionTypes
    };
  }

  private calculateDistance(loc1: MeshNode['location'], loc2: MeshNode['location']): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = loc1.lat * Math.PI / 180;
    const φ2 = loc2.lat * Math.PI / 180;
    const Δφ = (loc2.lat - loc1.lat) * Math.PI / 180;
    const Δλ = (loc2.lon - loc1.lon) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // ==================== Heartbeat ====================

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, this.network.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private async sendHeartbeat(): Promise<void> {
    if (!this.localNode) return;

    const heartbeat: MeshMessage = {
      id: `hb-${Date.now()}`,
      type: 'heartbeat',
      priority: 'low',
      sourceId: this.localNode.id,
      destinationId: 'broadcast',
      payload: {
        contentType: 'application/json',
        content: {
          status: this.localNode.status,
          location: this.localNode.location,
          batteryLevel: this.localNode.capabilities.batteryLevel,
          connections: this.localNode.connections.length
        },
        compressed: false,
        size: 0
      },
      routing: {
        hops: [],
        maxHops: 1,
        ttl: 5,
        algorithm: 'flooding'
      },
      encryption: { algorithm: 'none' },
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 10000),
      acknowledgments: []
    };

    // Send to all connected peers
    for (const connection of this.localNode.connections) {
      this.deliverMessage(heartbeat, connection.peerId);
    }

    this.localNode.metrics.uptime += this.network.config.heartbeatInterval / 1000;
    this.localNode.lastSeen = new Date();
  }

  // ==================== Messaging ====================

  async sendMessage(params: {
    destinationId: string | 'broadcast';
    type: MessageType;
    priority: MessagePriority;
    content: string | object;
    attachments?: MessageAttachment[];
    maxHops?: number;
    encrypted?: boolean;
  }): Promise<MeshMessage> {
    if (!this.localNode) {
      throw new Error('Local node not initialized. Call joinNetwork first.');
    }

    const message: MeshMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      priority: params.priority,
      sourceId: this.localNode.id,
      destinationId: params.destinationId,
      payload: {
        contentType: typeof params.content === 'string' ? 'text/plain' : 'application/json',
        content: params.content,
        attachments: params.attachments,
        compressed: this.network.config.compressionEnabled,
        size: JSON.stringify(params.content).length
      },
      routing: {
        hops: [],
        maxHops: params.maxHops || 10,
        ttl: this.network.config.messageTTL,
        algorithm: this.network.config.routingAlgorithm
      },
      encryption: {
        algorithm: params.encrypted !== false && this.network.config.encryptionEnabled 
          ? 'aes-256-gcm' 
          : 'none'
      },
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + this.network.config.messageTTL * 1000),
      acknowledgments: []
    };

    // Validate size
    if (message.payload.size > this.network.config.maxMessageSize) {
      throw new Error(`Message size exceeds maximum: ${message.payload.size} > ${this.network.config.maxMessageSize}`);
    }

    this.network.messages.set(message.id, message);
    this.seenMessages.add(message.id);
    this.localNode.metrics.messagesOriginated++;

    // Route the message
    await this.routeMessage(message);

    this.updateNetworkStatistics();
    return message;
  }

  private async routeMessage(message: MeshMessage): Promise<void> {
    if (!this.localNode) return;

    if (message.destinationId === 'broadcast') {
      await this.broadcastMessage(message);
    } else {
      await this.unicastMessage(message);
    }
  }

  private async broadcastMessage(message: MeshMessage): Promise<void> {
    if (!this.localNode) return;

    // Add hop
    message.routing.hops.push({
      nodeId: this.localNode.id,
      timestamp: new Date(),
      latency: 0
    });

    // Check TTL and max hops
    if (message.routing.hops.length > message.routing.maxHops) return;
    if (new Date() > message.expiresAt) return;

    // Send to all connected peers
    for (const connection of this.localNode.connections) {
      this.deliverMessage(message, connection.peerId);
    }
  }

  private async unicastMessage(message: MeshMessage): Promise<void> {
    if (!this.localNode) return;

    const targetId = message.destinationId as string;

    // Check if directly connected
    const directConnection = this.localNode.connections.find(c => c.peerId === targetId);
    if (directConnection) {
      this.deliverMessage(message, targetId);
      return;
    }

    // Find route
    const route = this.findRoute(this.localNode.id, targetId);
    if (route && route.length > 0) {
      message.routing.path = route;
      this.deliverMessage(message, route[0]);
    } else {
      // Store and forward
      if (this.network.config.storeAndForward) {
        this.queueMessage(message, targetId);
      }
    }
  }

  private deliverMessage(message: MeshMessage, targetId: string): void {
    if (!this.localNode) return;

    const connection = this.localNode.connections.find(c => c.peerId === targetId);
    if (connection) {
      connection.messagesSent++;
      connection.bytesTransferred += message.payload.size;
      connection.lastActivity = new Date();
    }

    // Simulate delivery (in real implementation, this would use actual network protocols)
    const targetNode = this.network.nodes.get(targetId);
    if (targetNode) {
      this.receiveMessage(message, targetNode);
    }

    this.localNode.metrics.messagesRouted++;
    this.localNode.metrics.bytesRelayed += message.payload.size;
  }

  private receiveMessage(message: MeshMessage, node: MeshNode): void {
    // Check if already seen
    if (this.seenMessages.has(message.id)) return;
    this.seenMessages.add(message.id);

    // Add acknowledgment
    message.acknowledgments.push({
      nodeId: node.id,
      timestamp: new Date(),
      received: true,
      relayed: false
    });

    // Check if this is the destination
    if (message.destinationId === node.id || message.destinationId === 'broadcast') {
      this.emitEvent({ 
        type: 'message_received', 
        timestamp: new Date(), 
        data: { message, receivedBy: node.id } 
      });

      if (message.destinationId === node.id) {
        this.emitEvent({ 
          type: 'message_delivered', 
          timestamp: new Date(), 
          data: { messageId: message.id, deliveredTo: node.id } 
        });
        this.network.statistics.deliveredMessages++;
      }
    }

    // Relay if broadcast or routing to another node
    if (message.destinationId === 'broadcast' || 
        (message.routing.path && message.routing.path.includes(node.id))) {
      // Would continue routing in a real implementation
    }
  }

  // ==================== Routing ====================

  private updateRoutingTable(): void {
    this.routingTable.clear();

    // Build routing table using BFS from each node
    for (const [startId] of this.network.nodes) {
      const routes = this.computeRoutesFrom(startId);
      for (const [destId, path] of routes) {
        const key = `${startId}->${destId}`;
        this.routingTable.set(key, path);
      }
    }
  }

  private computeRoutesFrom(startId: string): Map<string, string[]> {
    const routes = new Map<string, string[]>();
    const visited = new Set<string>();
    const queue: { nodeId: string; path: string[] }[] = [{ nodeId: startId, path: [] }];

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;
      
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      if (nodeId !== startId) {
        routes.set(nodeId, path);
      }

      const node = this.network.nodes.get(nodeId);
      if (node) {
        for (const connection of node.connections) {
          if (!visited.has(connection.peerId)) {
            queue.push({ 
              nodeId: connection.peerId, 
              path: [...path, connection.peerId] 
            });
          }
        }
      }
    }

    return routes;
  }

  private findRoute(fromId: string, toId: string): string[] | null {
    const key = `${fromId}->${toId}`;
    return this.routingTable.get(key) || null;
  }

  // ==================== Store and Forward ====================

  private queueMessage(message: MeshMessage, targetId: string): void {
    this.messageQueue.push({
      message,
      targetId,
      attempts: 0,
      nextAttempt: new Date(Date.now() + 5000)
    });
  }

  async processMessageQueue(): Promise<void> {
    const now = new Date();
    const pending = this.messageQueue.filter(q => q.nextAttempt <= now);

    for (const queued of pending) {
      const route = this.findRoute(this.localNode?.id || '', queued.targetId);
      if (route && route.length > 0) {
        queued.message.routing.path = route;
        this.deliverMessage(queued.message, route[0]);
        
        // Remove from queue
        const index = this.messageQueue.indexOf(queued);
        if (index > -1) this.messageQueue.splice(index, 1);
      } else {
        queued.attempts++;
        queued.lastAttempt = now;
        queued.nextAttempt = new Date(now.getTime() + Math.pow(2, queued.attempts) * 5000);

        // Remove if max attempts reached
        if (queued.attempts >= 5) {
          const index = this.messageQueue.indexOf(queued);
          if (index > -1) {
            this.messageQueue.splice(index, 1);
            this.network.statistics.failedMessages++;
          }
        }
      }
    }
  }

  getQueueStatus(): { pending: number; oldestMessage?: Date } {
    return {
      pending: this.messageQueue.length,
      oldestMessage: this.messageQueue.length > 0 
        ? this.messageQueue.reduce((oldest, q) => 
            q.message.timestamp < oldest ? q.message.timestamp : oldest, 
            this.messageQueue[0].message.timestamp)
        : undefined
    };
  }

  // ==================== Emergency Broadcast ====================

  async sendEmergencyBroadcast(content: string | object, priority: MessagePriority = 'critical'): Promise<EmergencyBroadcast> {
    const message = await this.sendMessage({
      destinationId: 'broadcast',
      type: 'emergency',
      priority,
      content,
      maxHops: 20,
      encrypted: false
    });

    const broadcast: EmergencyBroadcast = {
      id: `eb-${message.id}`,
      message,
      coverage: {
        targetNodes: this.network.nodes.size,
        reachedNodes: 0,
        pendingNodes: this.network.nodes.size,
        failedNodes: 0
      },
      status: 'broadcasting',
      startTime: new Date()
    };

    // Track coverage
    message.acknowledgments.forEach(() => {
      broadcast.coverage.reachedNodes++;
      broadcast.coverage.pendingNodes--;
    });

    return broadcast;
  }

  // ==================== Network Statistics ====================

  private updateNetworkStatistics(): void {
    const nodes = Array.from(this.network.nodes.values());
    const activeNodes = nodes.filter(n => n.status === 'active');
    const messages = Array.from(this.network.messages.values());

    this.network.statistics = {
      totalNodes: nodes.length,
      activeNodes: activeNodes.length,
      totalMessages: messages.length,
      deliveredMessages: messages.filter(m => m.acknowledgments.some(a => a.received)).length,
      failedMessages: this.network.statistics.failedMessages,
      averageHops: messages.length > 0 
        ? messages.reduce((sum, m) => sum + m.routing.hops.length, 0) / messages.length 
        : 0,
      networkDiameter: this.calculateNetworkDiameter(),
      averageLatency: this.calculateAverageLatency(),
      throughput: this.calculateThroughput(),
      reliability: this.calculateReliability()
    };

    this.network.updatedAt = new Date();
  }

  private calculateNetworkDiameter(): number {
    let maxHops = 0;
    for (const route of this.routingTable.values()) {
      if (route.length > maxHops) maxHops = route.length;
    }
    return maxHops;
  }

  private calculateAverageLatency(): number {
    const nodes = Array.from(this.network.nodes.values());
    const totalLatency = nodes.reduce((sum, node) => 
      sum + node.connections.reduce((connSum, conn) => connSum + conn.latency, 0), 0);
    const totalConnections = nodes.reduce((sum, node) => sum + node.connections.length, 0);
    return totalConnections > 0 ? totalLatency / totalConnections : 0;
  }

  private calculateThroughput(): number {
    const nodes = Array.from(this.network.nodes.values());
    const totalMessages = nodes.reduce((sum, node) => sum + node.metrics.messagesRouted, 0);
    const totalUptime = nodes.reduce((sum, node) => sum + node.metrics.uptime, 0);
    return totalUptime > 0 ? totalMessages / totalUptime : 0;
  }

  private calculateReliability(): number {
    const { deliveredMessages, totalMessages, failedMessages } = this.network.statistics;
    const total = deliveredMessages + failedMessages;
    return total > 0 ? deliveredMessages / total : 1;
  }

  getNetworkStatistics(): NetworkStatistics {
    return { ...this.network.statistics };
  }

  getNetworkTopology(): {
    nodes: { id: string; name: string; status: NodeStatus; location: MeshNode['location'] }[];
    edges: { source: string; target: string; type: ConnectionType; strength: number }[];
  } {
    const nodes = Array.from(this.network.nodes.values()).map(n => ({
      id: n.id,
      name: n.name,
      status: n.status,
      location: n.location
    }));

    const edges: { source: string; target: string; type: ConnectionType; strength: number }[] = [];
    const seenEdges = new Set<string>();

    for (const node of this.network.nodes.values()) {
      for (const conn of node.connections) {
        const edgeKey = [node.id, conn.peerId].sort().join('-');
        if (!seenEdges.has(edgeKey)) {
          seenEdges.add(edgeKey);
          edges.push({
            source: node.id,
            target: conn.peerId,
            type: conn.connectionType,
            strength: Math.abs(conn.signalStrength)
          });
        }
      }
    }

    return { nodes, edges };
  }

  // ==================== Subscriptions ====================

  subscribe(callback: (event: NetworkEvent) => void, eventTypes?: NetworkEventType[]): string {
    const id = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.subscriptions.set(id, { id, callback, eventTypes });
    return id;
  }

  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }

  private emitEvent(event: NetworkEvent): void {
    for (const subscription of this.subscriptions.values()) {
      if (!subscription.eventTypes || subscription.eventTypes.includes(event.type)) {
        try {
          subscription.callback(event);
        } catch (error) {
          console.error('Subscription callback error:', error);
        }
      }
    }
  }

  // ==================== Gateway Functions ====================

  async findGatewayNodes(): Promise<MeshNode[]> {
    return Array.from(this.network.nodes.values())
      .filter(n => n.capabilities.hasInternet && n.status === 'active')
      .sort((a, b) => {
        const aConnections = a.connections.length;
        const bConnections = b.connections.length;
        return bConnections - aConnections;
      });
  }

  async relayToInternet(message: MeshMessage, gatewayId: string): Promise<boolean> {
    const gateway = this.network.nodes.get(gatewayId);
    if (!gateway || !gateway.capabilities.hasInternet) {
      return false;
    }

    // Route to gateway first
    if (this.localNode && this.localNode.id !== gatewayId) {
      const route = this.findRoute(this.localNode.id, gatewayId);
      if (!route) return false;
    }

    // Gateway would forward to internet (simulated)
    console.log(`[Gateway ${gatewayId}] Relaying message ${message.id} to internet`);
    return true;
  }
}

export const p2pMeshNetworkService = P2PMeshNetworkService.getInstance();
export default P2PMeshNetworkService;
