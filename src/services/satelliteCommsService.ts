// @ts-nocheck
/**
 * Satellite Communications Service - Issue #123 Implementation
 * 
 * Provides satellite-based communication fallback for remote areas and disaster zones
 * where terrestrial infrastructure is unavailable. Supports multiple satellite networks,
 * message queuing, and bandwidth optimization.
 */

// Status and type definitions
type SatelliteStatus = 'operational' | 'degraded' | 'maintenance' | 'offline' | 'unknown';
type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'handoff' | 'searching';
type MessageStatus = 'queued' | 'transmitting' | 'transmitted' | 'delivered' | 'failed' | 'expired';
type ServiceTier = 'emergency' | 'priority' | 'standard' | 'best_effort';
type SatelliteNetwork = 'iridium' | 'globalstar' | 'inmarsat' | 'thuraya' | 'starlink' | 'oneweb' | 'viasat';

// Satellite interfaces
interface Satellite {
  id: string;
  name: string;
  network: SatelliteNetwork;
  noradId: string;
  status: SatelliteStatus;
  orbit: SatelliteOrbit;
  coverage: SatelliteCoverage;
  capabilities: SatelliteCapabilities;
  health: SatelliteHealth;
  lastUpdate: Date;
}

interface SatelliteOrbit {
  type: 'leo' | 'meo' | 'geo' | 'heo';
  altitude: number; // km
  inclination: number; // degrees
  period: number; // minutes
  currentPosition: {
    lat: number;
    lon: number;
    altitude: number;
  };
  velocity: number; // km/s
}

interface SatelliteCoverage {
  footprint: {
    center: { lat: number; lon: number };
    radius: number; // km
  };
  regions: string[];
  minElevation: number; // degrees
  beams: SatelliteBeam[];
}

interface SatelliteBeam {
  id: string;
  type: 'spot' | 'wide' | 'steerable';
  coverage: { lat: number; lon: number; radius: number };
  capacity: number; // Mbps
  utilization: number; // percentage
}

interface SatelliteCapabilities {
  voiceSupport: boolean;
  dataSupport: boolean;
  broadcastSupport: boolean;
  maxBandwidth: number; // Kbps
  latency: number; // ms
  encryption: string[];
  protocols: string[];
}

interface SatelliteHealth {
  batteryLevel: number;
  solarPanelEfficiency: number;
  transponderStatus: 'nominal' | 'degraded' | 'failed';
  antennaStatus: 'nominal' | 'degraded' | 'failed';
  thermalStatus: 'nominal' | 'hot' | 'cold';
  fuelRemaining: number; // percentage
}

// Ground station interfaces
interface GroundStation {
  id: string;
  name: string;
  location: {
    lat: number;
    lon: number;
    altitude: number;
  };
  status: 'online' | 'offline' | 'maintenance';
  networks: SatelliteNetwork[];
  antennas: GroundAntenna[];
  capacity: {
    maxConnections: number;
    currentConnections: number;
    bandwidth: number; // Mbps
  };
  lastContact: Date;
}

interface GroundAntenna {
  id: string;
  type: 'dish' | 'phased_array' | 'omnidirectional';
  diameter: number; // meters
  bands: ('L' | 'S' | 'C' | 'X' | 'Ku' | 'Ka')[];
  tracking: 'auto' | 'manual' | 'fixed';
  status: 'active' | 'idle' | 'fault';
}

// Terminal interfaces
interface SatelliteTerminal {
  id: string;
  name: string;
  type: 'fixed' | 'portable' | 'handheld' | 'vehicle_mounted' | 'maritime' | 'aircraft';
  network: SatelliteNetwork;
  location: {
    lat: number;
    lon: number;
    altitude: number;
    timestamp: Date;
  };
  status: ConnectionStatus;
  connection: TerminalConnection | null;
  capabilities: TerminalCapabilities;
  subscription: TerminalSubscription;
  metrics: TerminalMetrics;
  createdAt: Date;
  metadata: Record<string, any>;
}

interface TerminalConnection {
  satelliteId: string;
  groundStationId: string;
  beamId: string;
  signalStrength: number; // dB
  snr: number; // signal-to-noise ratio
  uplinkFrequency: number; // MHz
  downlinkFrequency: number; // MHz
  bandwidth: number; // Kbps
  latency: number; // ms
  packetLoss: number; // percentage
  established: Date;
  lastActivity: Date;
}

interface TerminalCapabilities {
  voiceEnabled: boolean;
  dataEnabled: boolean;
  smsEnabled: boolean;
  sosEnabled: boolean;
  gpsEnabled: boolean;
  maxBandwidth: number;
  batteryLife: number; // hours
  weatherResistance: string;
}

interface TerminalSubscription {
  plan: ServiceTier;
  dataAllowance: number; // MB
  dataUsed: number;
  voiceMinutes: number;
  voiceUsed: number;
  validUntil: Date;
  autoRenew: boolean;
}

interface TerminalMetrics {
  uptime: number; // seconds
  messagesTransmitted: number;
  messagesReceived: number;
  bytesTransmitted: number;
  bytesReceived: number;
  connectionDrops: number;
  averageLatency: number;
  averageSignalStrength: number;
}

// Message interfaces
interface SatelliteMessage {
  id: string;
  terminalId: string;
  type: 'data' | 'voice' | 'sms' | 'sos' | 'position' | 'broadcast';
  status: MessageStatus;
  priority: ServiceTier;
  payload: SatellitePayload;
  routing: MessageRouting;
  transmission: TransmissionInfo;
  createdAt: Date;
  expiresAt: Date;
}

interface SatellitePayload {
  contentType: string;
  content: string | ArrayBuffer;
  size: number; // bytes
  compressed: boolean;
  encrypted: boolean;
  checksum: string;
}

interface MessageRouting {
  source: {
    terminalId: string;
    location: { lat: number; lon: number };
  };
  destination: {
    type: 'terminal' | 'email' | 'phone' | 'server' | 'broadcast';
    address: string;
  };
  via?: {
    satelliteId: string;
    groundStationId: string;
  };
}

interface TransmissionInfo {
  attempts: number;
  lastAttempt?: Date;
  transmittedAt?: Date;
  deliveredAt?: Date;
  satellite?: string;
  groundStation?: string;
  error?: string;
}

// SOS/Emergency interfaces
interface SOSAlert {
  id: string;
  terminalId: string;
  location: {
    lat: number;
    lon: number;
    altitude: number;
    accuracy: number;
    timestamp: Date;
  };
  type: 'distress' | 'urgency' | 'safety' | 'test';
  status: 'active' | 'acknowledged' | 'responding' | 'resolved' | 'cancelled';
  message?: string;
  contacts: EmergencyContact[];
  responders: ResponderInfo[];
  timeline: SOSEvent[];
  createdAt: Date;
  resolvedAt?: Date;
}

interface EmergencyContact {
  name: string;
  phone?: string;
  email?: string;
  relationship: string;
  notified: boolean;
  notifiedAt?: Date;
}

interface ResponderInfo {
  id: string;
  agency: string;
  type: 'sar' | 'coastguard' | 'police' | 'fire' | 'medical' | 'military';
  status: 'notified' | 'enroute' | 'onscene' | 'completed';
  eta?: number; // minutes
  location?: { lat: number; lon: number };
  contact: string;
}

interface SOSEvent {
  timestamp: Date;
  event: string;
  details?: string;
  actor?: string;
}

// Pass prediction interface
interface SatellitePass {
  satelliteId: string;
  startTime: Date;
  endTime: Date;
  maxElevation: number;
  azimuthStart: number;
  azimuthEnd: number;
  duration: number; // seconds
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

// Subscription interface
interface ServiceSubscription {
  id: string;
  callback: (event: SatelliteEvent) => void;
  eventTypes?: SatelliteEventType[];
}

type SatelliteEventType = 'connection_changed' | 'message_received' | 'message_transmitted' | 'sos_alert' | 'satellite_handoff' | 'coverage_changed';

interface SatelliteEvent {
  type: SatelliteEventType;
  timestamp: Date;
  data: any;
}

// Sample data
const sampleSatellites: Satellite[] = [
  {
    id: 'sat-iridium-001',
    name: 'Iridium NEXT 101',
    network: 'iridium',
    noradId: '43070',
    status: 'operational',
    orbit: {
      type: 'leo',
      altitude: 780,
      inclination: 86.4,
      period: 100,
      currentPosition: { lat: 35.5, lon: -120.3, altitude: 778 },
      velocity: 7.46
    },
    coverage: {
      footprint: { center: { lat: 35.5, lon: -120.3 }, radius: 4500 },
      regions: ['North America', 'Pacific'],
      minElevation: 8,
      beams: [
        { id: 'beam-1', type: 'spot', coverage: { lat: 36, lon: -121, radius: 400 }, capacity: 100, utilization: 45 }
      ]
    },
    capabilities: {
      voiceSupport: true,
      dataSupport: true,
      broadcastSupport: true,
      maxBandwidth: 704,
      latency: 30,
      encryption: ['AES-256'],
      protocols: ['SBD', 'RUDICS', 'Voice']
    },
    health: {
      batteryLevel: 95,
      solarPanelEfficiency: 92,
      transponderStatus: 'nominal',
      antennaStatus: 'nominal',
      thermalStatus: 'nominal',
      fuelRemaining: 85
    },
    lastUpdate: new Date()
  },
  {
    id: 'sat-starlink-001',
    name: 'Starlink-1234',
    network: 'starlink',
    noradId: '45678',
    status: 'operational',
    orbit: {
      type: 'leo',
      altitude: 550,
      inclination: 53,
      period: 95,
      currentPosition: { lat: 42.1, lon: -71.5, altitude: 548 },
      velocity: 7.59
    },
    coverage: {
      footprint: { center: { lat: 42.1, lon: -71.5 }, radius: 3000 },
      regions: ['North America', 'Atlantic'],
      minElevation: 25,
      beams: [
        { id: 'beam-sl-1', type: 'phased_array', coverage: { lat: 42, lon: -72, radius: 200 }, capacity: 1000, utilization: 60 }
      ]
    },
    capabilities: {
      voiceSupport: false,
      dataSupport: true,
      broadcastSupport: false,
      maxBandwidth: 150000,
      latency: 20,
      encryption: ['AES-256', 'ChaCha20'],
      protocols: ['IP', 'TCP', 'UDP']
    },
    health: {
      batteryLevel: 98,
      solarPanelEfficiency: 95,
      transponderStatus: 'nominal',
      antennaStatus: 'nominal',
      thermalStatus: 'nominal',
      fuelRemaining: 90
    },
    lastUpdate: new Date()
  }
];

const sampleGroundStations: GroundStation[] = [
  {
    id: 'gs-001',
    name: 'Tempe Gateway',
    location: { lat: 33.4255, lon: -111.9400, altitude: 360 },
    status: 'online',
    networks: ['iridium', 'globalstar'],
    antennas: [
      { id: 'ant-001', type: 'dish', diameter: 13, bands: ['L', 'Ka'], tracking: 'auto', status: 'active' },
      { id: 'ant-002', type: 'phased_array', diameter: 5, bands: ['Ku'], tracking: 'auto', status: 'active' }
    ],
    capacity: { maxConnections: 5000, currentConnections: 2340, bandwidth: 10000 },
    lastContact: new Date()
  }
];

const sampleTerminals: SatelliteTerminal[] = [
  {
    id: 'term-001',
    name: 'Field Unit Alpha',
    type: 'portable',
    network: 'iridium',
    location: { lat: 37.7749, lon: -122.4194, altitude: 10, timestamp: new Date() },
    status: 'connected',
    connection: {
      satelliteId: 'sat-iridium-001',
      groundStationId: 'gs-001',
      beamId: 'beam-1',
      signalStrength: -85,
      snr: 12,
      uplinkFrequency: 1626.5,
      downlinkFrequency: 1616.0,
      bandwidth: 2.4,
      latency: 650,
      packetLoss: 0.5,
      established: new Date('2026-01-09T08:00:00Z'),
      lastActivity: new Date()
    },
    capabilities: {
      voiceEnabled: true,
      dataEnabled: true,
      smsEnabled: true,
      sosEnabled: true,
      gpsEnabled: true,
      maxBandwidth: 2.4,
      batteryLife: 8,
      weatherResistance: 'IP67'
    },
    subscription: {
      plan: 'emergency',
      dataAllowance: 100,
      dataUsed: 23,
      voiceMinutes: 60,
      voiceUsed: 12,
      validUntil: new Date('2026-12-31'),
      autoRenew: true
    },
    metrics: {
      uptime: 28800,
      messagesTransmitted: 156,
      messagesReceived: 89,
      bytesTransmitted: 245000,
      bytesReceived: 178000,
      connectionDrops: 3,
      averageLatency: 680,
      averageSignalStrength: -87
    },
    createdAt: new Date('2025-06-01'),
    metadata: { team: 'SAR-Alpha', region: 'Bay Area' }
  }
];

class SatelliteCommsService {
  private static instance: SatelliteCommsService;
  private satellites: Map<string, Satellite> = new Map();
  private groundStations: Map<string, GroundStation> = new Map();
  private terminals: Map<string, SatelliteTerminal> = new Map();
  private messages: Map<string, SatelliteMessage> = new Map();
  private sosAlerts: Map<string, SOSAlert> = new Map();
  private messageQueue: SatelliteMessage[] = [];
  private subscriptions: Map<string, ServiceSubscription> = new Map();
  private localTerminal: SatelliteTerminal | null = null;

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): SatelliteCommsService {
    if (!SatelliteCommsService.instance) {
      SatelliteCommsService.instance = new SatelliteCommsService();
    }
    return SatelliteCommsService.instance;
  }

  private initializeSampleData(): void {
    sampleSatellites.forEach(s => this.satellites.set(s.id, s));
    sampleGroundStations.forEach(gs => this.groundStations.set(gs.id, gs));
    sampleTerminals.forEach(t => this.terminals.set(t.id, t));
  }

  // ==================== Terminal Management ====================

  async registerTerminal(params: {
    name: string;
    type: SatelliteTerminal['type'];
    network: SatelliteNetwork;
    location: SatelliteTerminal['location'];
    capabilities: TerminalCapabilities;
    subscription: Omit<TerminalSubscription, 'dataUsed' | 'voiceUsed'>;
  }): Promise<SatelliteTerminal> {
    const terminal: SatelliteTerminal = {
      id: `term-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      network: params.network,
      location: params.location,
      status: 'disconnected',
      connection: null,
      capabilities: params.capabilities,
      subscription: { ...params.subscription, dataUsed: 0, voiceUsed: 0 },
      metrics: {
        uptime: 0,
        messagesTransmitted: 0,
        messagesReceived: 0,
        bytesTransmitted: 0,
        bytesReceived: 0,
        connectionDrops: 0,
        averageLatency: 0,
        averageSignalStrength: 0
      },
      createdAt: new Date(),
      metadata: {}
    };

    this.terminals.set(terminal.id, terminal);
    this.localTerminal = terminal;

    return terminal;
  }

  async getTerminal(terminalId: string): Promise<SatelliteTerminal | null> {
    return this.terminals.get(terminalId) || null;
  }

  async getAllTerminals(filters?: { network?: SatelliteNetwork; status?: ConnectionStatus }): Promise<SatelliteTerminal[]> {
    let terminals = Array.from(this.terminals.values());

    if (filters?.network) {
      terminals = terminals.filter(t => t.network === filters.network);
    }

    if (filters?.status) {
      terminals = terminals.filter(t => t.status === filters.status);
    }

    return terminals;
  }

  async updateTerminalLocation(terminalId: string, location: SatelliteTerminal['location']): Promise<void> {
    const terminal = this.terminals.get(terminalId);
    if (terminal) {
      terminal.location = location;
      
      // Check if handoff is needed
      if (terminal.connection) {
        await this.checkAndPerformHandoff(terminal);
      }
    }
  }

  // ==================== Connection Management ====================

  async connect(terminalId: string): Promise<TerminalConnection | null> {
    const terminal = this.terminals.get(terminalId);
    if (!terminal) {
      throw new Error(`Terminal not found: ${terminalId}`);
    }

    terminal.status = 'searching';

    // Find best satellite
    const availableSatellites = await this.findAvailableSatellites(terminal.location, terminal.network);
    if (availableSatellites.length === 0) {
      terminal.status = 'disconnected';
      throw new Error('No satellites available in coverage area');
    }

    const bestSatellite = availableSatellites[0];

    // Find ground station
    const groundStation = await this.findBestGroundStation(bestSatellite);
    if (!groundStation) {
      terminal.status = 'disconnected';
      throw new Error('No ground station available');
    }

    terminal.status = 'connecting';

    // Simulate connection establishment
    await this.simulateDelay(2000);

    const connection: TerminalConnection = {
      satelliteId: bestSatellite.id,
      groundStationId: groundStation.id,
      beamId: bestSatellite.coverage.beams[0]?.id || 'default',
      signalStrength: this.calculateSignalStrength(terminal.location, bestSatellite),
      snr: 10 + Math.random() * 10,
      uplinkFrequency: this.getUplinkFrequency(terminal.network),
      downlinkFrequency: this.getDownlinkFrequency(terminal.network),
      bandwidth: Math.min(terminal.capabilities.maxBandwidth, bestSatellite.capabilities.maxBandwidth / 1000),
      latency: bestSatellite.capabilities.latency + this.calculatePropagationDelay(bestSatellite.orbit.altitude),
      packetLoss: Math.random() * 2,
      established: new Date(),
      lastActivity: new Date()
    };

    terminal.connection = connection;
    terminal.status = 'connected';

    this.emitEvent({
      type: 'connection_changed',
      timestamp: new Date(),
      data: { terminalId, status: 'connected', connection }
    });

    return connection;
  }

  async disconnect(terminalId: string): Promise<void> {
    const terminal = this.terminals.get(terminalId);
    if (!terminal) return;

    terminal.connection = null;
    terminal.status = 'disconnected';

    this.emitEvent({
      type: 'connection_changed',
      timestamp: new Date(),
      data: { terminalId, status: 'disconnected' }
    });
  }

  private async checkAndPerformHandoff(terminal: SatelliteTerminal): Promise<void> {
    if (!terminal.connection) return;

    const currentSatellite = this.satellites.get(terminal.connection.satelliteId);
    if (!currentSatellite) return;

    // Check if current satellite is still optimal
    const signalStrength = this.calculateSignalStrength(terminal.location, currentSatellite);
    if (signalStrength < -100) {
      // Need handoff
      terminal.status = 'handoff';
      
      const availableSatellites = await this.findAvailableSatellites(terminal.location, terminal.network);
      const newSatellite = availableSatellites.find(s => s.id !== currentSatellite.id);

      if (newSatellite) {
        terminal.connection.satelliteId = newSatellite.id;
        terminal.connection.signalStrength = this.calculateSignalStrength(terminal.location, newSatellite);
        terminal.connection.latency = newSatellite.capabilities.latency + 
          this.calculatePropagationDelay(newSatellite.orbit.altitude);

        this.emitEvent({
          type: 'satellite_handoff',
          timestamp: new Date(),
          data: { 
            terminalId: terminal.id, 
            fromSatellite: currentSatellite.id, 
            toSatellite: newSatellite.id 
          }
        });
      }

      terminal.status = 'connected';
    }
  }

  // ==================== Satellite Operations ====================

  async getSatellite(satelliteId: string): Promise<Satellite | null> {
    return this.satellites.get(satelliteId) || null;
  }

  async getAllSatellites(filters?: { network?: SatelliteNetwork; status?: SatelliteStatus }): Promise<Satellite[]> {
    let satellites = Array.from(this.satellites.values());

    if (filters?.network) {
      satellites = satellites.filter(s => s.network === filters.network);
    }

    if (filters?.status) {
      satellites = satellites.filter(s => s.status === filters.status);
    }

    return satellites;
  }

  async findAvailableSatellites(location: { lat: number; lon: number }, network?: SatelliteNetwork): Promise<Satellite[]> {
    let satellites = Array.from(this.satellites.values())
      .filter(s => s.status === 'operational');

    if (network) {
      satellites = satellites.filter(s => s.network === network);
    }

    // Filter by coverage
    satellites = satellites.filter(s => {
      const distance = this.calculateDistance(location, s.coverage.footprint.center);
      return distance <= s.coverage.footprint.radius;
    });

    // Sort by signal strength (closer = stronger)
    return satellites.sort((a, b) => {
      const distA = this.calculateDistance(location, a.coverage.footprint.center);
      const distB = this.calculateDistance(location, b.coverage.footprint.center);
      return distA - distB;
    });
  }

  async predictSatellitePasses(location: { lat: number; lon: number }, hours: number = 24): Promise<SatellitePass[]> {
    const passes: SatellitePass[] = [];
    const satellites = Array.from(this.satellites.values()).filter(s => s.orbit.type === 'leo');

    for (const satellite of satellites) {
      // Simplified pass prediction (real implementation would use orbital mechanics)
      const passesPerDay = Math.floor(24 * 60 / satellite.orbit.period);
      
      for (let i = 0; i < passesPerDay && i < hours / 24 * passesPerDay; i++) {
        const startTime = new Date(Date.now() + i * satellite.orbit.period * 60 * 1000);
        const duration = 10 + Math.random() * 5; // 10-15 minutes

        passes.push({
          satelliteId: satellite.id,
          startTime,
          endTime: new Date(startTime.getTime() + duration * 60 * 1000),
          maxElevation: 20 + Math.random() * 60,
          azimuthStart: Math.random() * 360,
          azimuthEnd: Math.random() * 360,
          duration: duration * 60,
          quality: this.calculatePassQuality(20 + Math.random() * 60)
        });
      }
    }

    return passes.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  // ==================== Messaging ====================

  async sendMessage(params: {
    terminalId: string;
    type: SatelliteMessage['type'];
    destination: MessageRouting['destination'];
    content: string | ArrayBuffer;
    priority?: ServiceTier;
    compress?: boolean;
    encrypt?: boolean;
  }): Promise<SatelliteMessage> {
    const terminal = this.terminals.get(params.terminalId);
    if (!terminal) {
      throw new Error(`Terminal not found: ${params.terminalId}`);
    }

    if (terminal.status !== 'connected') {
      throw new Error('Terminal is not connected');
    }

    const contentSize = typeof params.content === 'string' 
      ? params.content.length 
      : params.content.byteLength;

    const message: SatelliteMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      terminalId: params.terminalId,
      type: params.type,
      status: 'queued',
      priority: params.priority || terminal.subscription.plan,
      payload: {
        contentType: typeof params.content === 'string' ? 'text/plain' : 'application/octet-stream',
        content: params.content,
        size: contentSize,
        compressed: params.compress || false,
        encrypted: params.encrypt !== false,
        checksum: this.calculateChecksum(params.content)
      },
      routing: {
        source: {
          terminalId: params.terminalId,
          location: { lat: terminal.location.lat, lon: terminal.location.lon }
        },
        destination: params.destination,
        via: terminal.connection ? {
          satelliteId: terminal.connection.satelliteId,
          groundStationId: terminal.connection.groundStationId
        } : undefined
      },
      transmission: {
        attempts: 0
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    this.messages.set(message.id, message);

    // Check data allowance
    const kbSize = contentSize / 1024;
    if (terminal.subscription.dataUsed + kbSize / 1024 > terminal.subscription.dataAllowance) {
      message.status = 'failed';
      message.transmission.error = 'Data allowance exceeded';
      return message;
    }

    // Queue and transmit
    await this.transmitMessage(message);

    return message;
  }

  private async transmitMessage(message: SatelliteMessage): Promise<void> {
    const terminal = this.terminals.get(message.terminalId);
    if (!terminal || !terminal.connection) {
      message.status = 'failed';
      message.transmission.error = 'Terminal not connected';
      return;
    }

    message.status = 'transmitting';
    message.transmission.attempts++;
    message.transmission.lastAttempt = new Date();

    // Simulate transmission
    const transmissionTime = (message.payload.size / (terminal.connection.bandwidth * 1024)) * 1000;
    await this.simulateDelay(transmissionTime + terminal.connection.latency);

    // Simulate success/failure (95% success rate)
    if (Math.random() < 0.95) {
      message.status = 'transmitted';
      message.transmission.transmittedAt = new Date();
      message.transmission.satellite = terminal.connection.satelliteId;
      message.transmission.groundStation = terminal.connection.groundStationId;

      // Update terminal metrics
      terminal.metrics.messagesTransmitted++;
      terminal.metrics.bytesTransmitted += message.payload.size;
      terminal.subscription.dataUsed += message.payload.size / 1024 / 1024; // Convert to MB

      // Simulate delivery confirmation
      setTimeout(() => {
        message.status = 'delivered';
        message.transmission.deliveredAt = new Date();
        this.emitEvent({
          type: 'message_transmitted',
          timestamp: new Date(),
          data: { messageId: message.id, status: 'delivered' }
        });
      }, 2000);
    } else {
      if (message.transmission.attempts < 3) {
        // Retry
        await this.transmitMessage(message);
      } else {
        message.status = 'failed';
        message.transmission.error = 'Maximum retries exceeded';
      }
    }
  }

  async getMessage(messageId: string): Promise<SatelliteMessage | null> {
    return this.messages.get(messageId) || null;
  }

  async getMessagesByTerminal(terminalId: string, limit: number = 50): Promise<SatelliteMessage[]> {
    return Array.from(this.messages.values())
      .filter(m => m.terminalId === terminalId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // ==================== SOS/Emergency ====================

  async sendSOS(terminalId: string, type: SOSAlert['type'] = 'distress', message?: string): Promise<SOSAlert> {
    const terminal = this.terminals.get(terminalId);
    if (!terminal) {
      throw new Error(`Terminal not found: ${terminalId}`);
    }

    if (!terminal.capabilities.sosEnabled) {
      throw new Error('SOS capability not enabled on terminal');
    }

    const sosAlert: SOSAlert = {
      id: `sos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      terminalId,
      location: {
        ...terminal.location,
        accuracy: 10,
        timestamp: new Date()
      },
      type,
      status: 'active',
      message,
      contacts: [],
      responders: [],
      timeline: [
        { timestamp: new Date(), event: 'SOS activated', details: `Type: ${type}` }
      ],
      createdAt: new Date()
    };

    this.sosAlerts.set(sosAlert.id, sosAlert);

    // Send SOS message via satellite
    if (terminal.connection || terminal.status !== 'connected') {
      await this.connect(terminalId);
    }

    await this.sendMessage({
      terminalId,
      type: 'sos',
      destination: { type: 'server', address: 'sar-coordination@emergency.gov' },
      content: JSON.stringify({
        alertId: sosAlert.id,
        type: sosAlert.type,
        location: sosAlert.location,
        message: sosAlert.message,
        terminalInfo: {
          id: terminal.id,
          name: terminal.name,
          network: terminal.network
        }
      }),
      priority: 'emergency'
    });

    // Notify emergency services (simulated)
    sosAlert.responders.push({
      id: 'resp-001',
      agency: 'Coast Guard',
      type: 'coastguard',
      status: 'notified',
      contact: '+1-800-RESCUE'
    });

    sosAlert.timeline.push({
      timestamp: new Date(),
      event: 'Emergency services notified',
      actor: 'System'
    });

    this.emitEvent({
      type: 'sos_alert',
      timestamp: new Date(),
      data: sosAlert
    });

    return sosAlert;
  }

  async cancelSOS(alertId: string, reason: string): Promise<SOSAlert> {
    const alert = this.sosAlerts.get(alertId);
    if (!alert) {
      throw new Error(`SOS alert not found: ${alertId}`);
    }

    alert.status = 'cancelled';
    alert.resolvedAt = new Date();
    alert.timeline.push({
      timestamp: new Date(),
      event: 'SOS cancelled',
      details: reason
    });

    // Notify responders
    for (const responder of alert.responders) {
      responder.status = 'completed';
    }

    return alert;
  }

  async updateSOSPosition(alertId: string, location: SOSAlert['location']): Promise<SOSAlert> {
    const alert = this.sosAlerts.get(alertId);
    if (!alert) {
      throw new Error(`SOS alert not found: ${alertId}`);
    }

    alert.location = location;
    alert.timeline.push({
      timestamp: new Date(),
      event: 'Position updated',
      details: `Lat: ${location.lat}, Lon: ${location.lon}`
    });

    return alert;
  }

  async getSOSAlert(alertId: string): Promise<SOSAlert | null> {
    return this.sosAlerts.get(alertId) || null;
  }

  async getActiveSOSAlerts(): Promise<SOSAlert[]> {
    return Array.from(this.sosAlerts.values())
      .filter(a => a.status === 'active' || a.status === 'acknowledged' || a.status === 'responding');
  }

  // ==================== Ground Stations ====================

  async getGroundStation(stationId: string): Promise<GroundStation | null> {
    return this.groundStations.get(stationId) || null;
  }

  async getAllGroundStations(): Promise<GroundStation[]> {
    return Array.from(this.groundStations.values());
  }

  private async findBestGroundStation(satellite: Satellite): Promise<GroundStation | null> {
    const stations = Array.from(this.groundStations.values())
      .filter(gs => gs.status === 'online' && gs.networks.includes(satellite.network))
      .filter(gs => gs.capacity.currentConnections < gs.capacity.maxConnections);

    if (stations.length === 0) return null;

    // Sort by available capacity
    return stations.sort((a, b) => {
      const availA = a.capacity.maxConnections - a.capacity.currentConnections;
      const availB = b.capacity.maxConnections - b.capacity.currentConnections;
      return availB - availA;
    })[0];
  }

  // ==================== Helper Methods ====================

  private calculateSignalStrength(location: { lat: number; lon: number }, satellite: Satellite): number {
    const distance = this.calculateDistance(location, satellite.coverage.footprint.center);
    const maxDistance = satellite.coverage.footprint.radius;
    
    // Signal strength decreases with distance (simplified model)
    const baseStrength = -70; // dBm at center
    const degradation = (distance / maxDistance) * 30; // Up to 30 dB degradation at edge
    
    return baseStrength - degradation - Math.random() * 5;
  }

  private calculateDistance(loc1: { lat: number; lon: number }, loc2: { lat: number; lon: number }): number {
    const R = 6371; // Earth's radius in km
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

  private calculatePropagationDelay(altitude: number): number {
    // Round trip delay at speed of light
    const speedOfLight = 299792; // km/s
    return (altitude * 2 / speedOfLight) * 1000; // ms
  }

  private getUplinkFrequency(network: SatelliteNetwork): number {
    const frequencies: Record<SatelliteNetwork, number> = {
      iridium: 1626.5,
      globalstar: 1610.0,
      inmarsat: 1626.5,
      thuraya: 1626.5,
      starlink: 14000,
      oneweb: 14000,
      viasat: 29000
    };
    return frequencies[network];
  }

  private getDownlinkFrequency(network: SatelliteNetwork): number {
    const frequencies: Record<SatelliteNetwork, number> = {
      iridium: 1616.0,
      globalstar: 2483.5,
      inmarsat: 1525.0,
      thuraya: 1525.0,
      starlink: 12000,
      oneweb: 12000,
      viasat: 20000
    };
    return frequencies[network];
  }

  private calculatePassQuality(elevation: number): SatellitePass['quality'] {
    if (elevation >= 60) return 'excellent';
    if (elevation >= 40) return 'good';
    if (elevation >= 20) return 'fair';
    return 'poor';
  }

  private calculateChecksum(content: string | ArrayBuffer): string {
    // Simple checksum (real implementation would use proper hash)
    const str = typeof content === 'string' ? content : 'binary';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, Math.min(ms, 100))); // Cap for simulation
  }

  // ==================== Network Statistics ====================

  getNetworkStatistics(network?: SatelliteNetwork): {
    satellites: { total: number; operational: number };
    groundStations: { total: number; online: number };
    terminals: { total: number; connected: number };
    messages: { total: number; delivered: number; failed: number };
    activeSOSAlerts: number;
  } {
    let satellites = Array.from(this.satellites.values());
    let groundStations = Array.from(this.groundStations.values());
    let terminals = Array.from(this.terminals.values());
    let messages = Array.from(this.messages.values());

    if (network) {
      satellites = satellites.filter(s => s.network === network);
      groundStations = groundStations.filter(gs => gs.networks.includes(network));
      terminals = terminals.filter(t => t.network === network);
    }

    return {
      satellites: {
        total: satellites.length,
        operational: satellites.filter(s => s.status === 'operational').length
      },
      groundStations: {
        total: groundStations.length,
        online: groundStations.filter(gs => gs.status === 'online').length
      },
      terminals: {
        total: terminals.length,
        connected: terminals.filter(t => t.status === 'connected').length
      },
      messages: {
        total: messages.length,
        delivered: messages.filter(m => m.status === 'delivered').length,
        failed: messages.filter(m => m.status === 'failed').length
      },
      activeSOSAlerts: Array.from(this.sosAlerts.values())
        .filter(a => a.status !== 'resolved' && a.status !== 'cancelled').length
    };
  }

  // ==================== Subscriptions ====================

  subscribe(callback: (event: SatelliteEvent) => void, eventTypes?: SatelliteEventType[]): string {
    const id = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.subscriptions.set(id, { id, callback, eventTypes });
    return id;
  }

  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }

  private emitEvent(event: SatelliteEvent): void {
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
}

export const satelliteCommsService = SatelliteCommsService.getInstance();
export default SatelliteCommsService;
