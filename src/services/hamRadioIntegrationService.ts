// @ts-nocheck
/**
 * Ham Radio Integration Service - Issue #124 Implementation
 * 
 * Provides amateur radio network integration for emergency communications.
 * Supports digital modes (APRS, Winlink, JS8Call), voice protocols, and mesh networking
 * with ham radio operators during disaster response.
 */

// Status and type definitions
type OperatorStatus = 'active' | 'standby' | 'offline' | 'emergency';
type FrequencyBand = '160m' | '80m' | '40m' | '20m' | '15m' | '10m' | '6m' | '2m' | '70cm' | '23cm';
type ModulationType = 'ssb' | 'fm' | 'am' | 'cw' | 'rtty' | 'psk31' | 'ft8' | 'js8' | 'packet' | 'aprs' | 'winlink' | 'dstar' | 'dmr' | 'ysf';
type MessagePriority = 'flash' | 'immediate' | 'priority' | 'routine' | 'welfare';
type NetType = 'emergency' | 'traffic' | 'tactical' | 'resource' | 'welfare' | 'training';

// Operator interfaces
interface HamOperator {
  id: string;
  callsign: string;
  name: string;
  status: OperatorStatus;
  license: OperatorLicense;
  location: {
    lat: number;
    lon: number;
    gridSquare: string;
    qth: string;
  };
  equipment: RadioEquipment[];
  capabilities: OperatorCapabilities;
  availability: OperatorAvailability;
  certifications: string[];
  lastHeardFrom: Date;
  createdAt: Date;
  metadata: Record<string, any>;
}

interface OperatorLicense {
  class: 'technician' | 'general' | 'extra' | 'amateur_extra';
  country: string;
  issueDate: Date;
  expirationDate: Date;
  verified: boolean;
}

interface RadioEquipment {
  id: string;
  type: 'hf_transceiver' | 'vhf_transceiver' | 'uhf_transceiver' | 'handheld' | 'mobile' | 'repeater' | 'antenna' | 'tnc';
  manufacturer: string;
  model: string;
  bands: FrequencyBand[];
  modes: ModulationType[];
  power: number; // watts
  portable: boolean;
}

interface OperatorCapabilities {
  bands: FrequencyBand[];
  modes: ModulationType[];
  maxPower: number;
  canRelay: boolean;
  hasInternet: boolean;
  mobileCapable: boolean;
  emergencyPower: boolean;
  antennaTypes: string[];
}

interface OperatorAvailability {
  schedule: {
    dayOfWeek: number;
    startHour: number;
    endHour: number;
  }[];
  emergencyAvailable: boolean;
  maxHoursPerWeek: number;
  currentHoursThisWeek: number;
}

// Frequency and repeater interfaces
interface Frequency {
  id: string;
  frequency: number; // MHz
  band: FrequencyBand;
  mode: ModulationType;
  bandwidth: number; // kHz
  purpose: 'calling' | 'emergency' | 'net' | 'repeater' | 'simplex' | 'digital';
  restrictions?: string;
  active: boolean;
}

interface Repeater {
  id: string;
  callsign: string;
  name: string;
  location: {
    lat: number;
    lon: number;
    altitude: number;
    city: string;
    state: string;
  };
  outputFrequency: number;
  inputFrequency: number;
  offset: number;
  tone?: {
    type: 'ctcss' | 'dcs';
    value: number | string;
  };
  mode: ModulationType;
  status: 'operational' | 'degraded' | 'offline' | 'unknown';
  coverage: {
    radius: number; // km
    terrain: 'excellent' | 'good' | 'fair' | 'poor';
  };
  features: string[];
  trustee: string;
  lastCheckin: Date;
}

// Net (organized communication session) interfaces
interface RadioNet {
  id: string;
  name: string;
  type: NetType;
  frequency: Frequency;
  repeater?: Repeater;
  schedule: NetSchedule;
  netControl: string; // callsign
  participants: NetParticipant[];
  messages: NetMessage[];
  status: 'scheduled' | 'active' | 'paused' | 'closed';
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
}

interface NetSchedule {
  type: 'recurring' | 'one_time' | 'emergency';
  dayOfWeek?: number[];
  time: string; // HH:MM UTC
  duration: number; // minutes
  nextSession?: Date;
}

interface NetParticipant {
  callsign: string;
  operatorId: string;
  role: 'net_control' | 'backup_control' | 'relay' | 'participant';
  checkedIn: boolean;
  checkinTime?: Date;
  signalReport?: string; // RST
  location?: string;
  trafficCount: number;
}

interface NetMessage {
  id: string;
  timestamp: Date;
  from: string; // callsign
  to: string; // callsign or 'NET'
  type: 'checkin' | 'checkout' | 'traffic' | 'announcement' | 'emergency' | 'welfare';
  content: string;
  priority: MessagePriority;
  acknowledged: boolean;
}

// APRS (Automatic Packet Reporting System) interfaces
interface APRSStation {
  callsign: string;
  ssid: string;
  symbol: string;
  position: {
    lat: number;
    lon: number;
    altitude?: number;
    timestamp: Date;
  };
  course?: number;
  speed?: number;
  weather?: APRSWeather;
  telemetry?: APRSTelemetry;
  status?: string;
  lastHeard: Date;
  path: string[];
}

interface APRSWeather {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  windSpeed?: number;
  windDirection?: number;
  windGust?: number;
  rainfall1h?: number;
  rainfall24h?: number;
  luminosity?: number;
}

interface APRSTelemetry {
  sequence: number;
  analog: number[];
  digital: number;
  labels?: string[];
}

interface APRSMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  messageId?: string;
  acknowledged: boolean;
  timestamp: Date;
}

// Winlink interfaces
interface WinlinkMessage {
  id: string;
  from: string; // callsign
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  attachments?: WinlinkAttachment[];
  priority: MessagePriority;
  status: 'draft' | 'outbox' | 'sent' | 'delivered' | 'read';
  sentVia?: string; // RMS callsign
  timestamp: Date;
}

interface WinlinkAttachment {
  name: string;
  mimeType: string;
  size: number;
  data: string; // base64
}

interface WinlinkRMS {
  callsign: string;
  location: { lat: number; lon: number };
  frequency: number;
  mode: 'packet' | 'winmor' | 'ardop' | 'vara';
  status: 'online' | 'offline';
  lastUpdate: Date;
}

// Traffic handling (formal message) interfaces
interface RadiogramMessage {
  id: string;
  preamble: {
    number: number;
    precedence: MessagePriority;
    handling: 'hx' | 'hxc' | 'hxe' | 'hxg';
    station: string;
    check: number;
    place: string;
    time: string;
    date: string;
  };
  address: {
    name: string;
    street?: string;
    city: string;
    state: string;
    zip?: string;
    phone?: string;
  };
  text: string[];
  signature: string;
  status: 'received' | 'in_transit' | 'delivered' | 'undeliverable';
  route: {
    station: string;
    timestamp: Date;
    action: 'originated' | 'received' | 'relayed' | 'delivered';
  }[];
}

// Subscription interface
interface RadioSubscription {
  id: string;
  callback: (event: RadioEvent) => void;
  eventTypes?: RadioEventType[];
}

type RadioEventType = 'operator_status' | 'net_activity' | 'aprs_position' | 'message_received' | 'emergency_traffic';

interface RadioEvent {
  type: RadioEventType;
  timestamp: Date;
  data: any;
}

// Sample data
const sampleOperators: HamOperator[] = [
  {
    id: 'op-001',
    callsign: 'W6ABC',
    name: 'John Smith',
    status: 'active',
    license: {
      class: 'extra',
      country: 'USA',
      issueDate: new Date('2020-01-15'),
      expirationDate: new Date('2030-01-15'),
      verified: true
    },
    location: {
      lat: 37.7749,
      lon: -122.4194,
      gridSquare: 'CM87ss',
      qth: 'San Francisco, CA'
    },
    equipment: [
      {
        id: 'eq-001',
        type: 'hf_transceiver',
        manufacturer: 'Icom',
        model: 'IC-7300',
        bands: ['160m', '80m', '40m', '20m', '15m', '10m', '6m'],
        modes: ['ssb', 'cw', 'ft8', 'psk31', 'rtty'],
        power: 100,
        portable: false
      },
      {
        id: 'eq-002',
        type: 'handheld',
        manufacturer: 'Yaesu',
        model: 'FT-5DR',
        bands: ['2m', '70cm'],
        modes: ['fm', 'aprs', 'ysf'],
        power: 5,
        portable: true
      }
    ],
    capabilities: {
      bands: ['160m', '80m', '40m', '20m', '15m', '10m', '6m', '2m', '70cm'],
      modes: ['ssb', 'fm', 'cw', 'ft8', 'psk31', 'rtty', 'aprs'],
      maxPower: 100,
      canRelay: true,
      hasInternet: true,
      mobileCapable: true,
      emergencyPower: true,
      antennaTypes: ['wire dipole', 'vertical', 'yagi']
    },
    availability: {
      schedule: [
        { dayOfWeek: 1, startHour: 18, endHour: 22 },
        { dayOfWeek: 3, startHour: 18, endHour: 22 },
        { dayOfWeek: 6, startHour: 8, endHour: 16 }
      ],
      emergencyAvailable: true,
      maxHoursPerWeek: 20,
      currentHoursThisWeek: 8
    },
    certifications: ['ARES', 'RACES', 'SKYWARN', 'CERT'],
    lastHeardFrom: new Date(),
    createdAt: new Date('2023-01-01'),
    metadata: { emcomm_id: 'SF-001' }
  }
];

const sampleRepeaters: Repeater[] = [
  {
    id: 'rpt-001',
    callsign: 'W6PW',
    name: 'Palo Alto Repeater',
    location: {
      lat: 37.4419,
      lon: -122.1430,
      altitude: 850,
      city: 'Palo Alto',
      state: 'CA'
    },
    outputFrequency: 145.230,
    inputFrequency: 144.630,
    offset: -0.6,
    tone: { type: 'ctcss', value: 100.0 },
    mode: 'fm',
    status: 'operational',
    coverage: { radius: 75, terrain: 'excellent' },
    features: ['autopatch', 'emergency_power', 'internet_linked'],
    trustee: 'W6ABC',
    lastCheckin: new Date()
  }
];

const emergencyFrequencies: Frequency[] = [
  { id: 'freq-001', frequency: 7.232, band: '40m', mode: 'ssb', bandwidth: 3, purpose: 'emergency', active: true },
  { id: 'freq-002', frequency: 3.923, band: '80m', mode: 'ssb', bandwidth: 3, purpose: 'emergency', active: true },
  { id: 'freq-003', frequency: 14.300, band: '20m', mode: 'ssb', bandwidth: 3, purpose: 'emergency', active: true },
  { id: 'freq-004', frequency: 146.520, band: '2m', mode: 'fm', bandwidth: 15, purpose: 'calling', active: true },
  { id: 'freq-005', frequency: 144.390, band: '2m', mode: 'aprs', bandwidth: 15, purpose: 'digital', active: true },
  { id: 'freq-006', frequency: 7.078, band: '40m', mode: 'js8', bandwidth: 3, purpose: 'digital', active: true }
];

class HamRadioIntegrationService {
  private static instance: HamRadioIntegrationService;
  private operators: Map<string, HamOperator> = new Map();
  private repeaters: Map<string, Repeater> = new Map();
  private frequencies: Map<string, Frequency> = new Map();
  private nets: Map<string, RadioNet> = new Map();
  private aprsStations: Map<string, APRSStation> = new Map();
  private aprsMessages: Map<string, APRSMessage> = new Map();
  private winlinkMessages: Map<string, WinlinkMessage> = new Map();
  private radiograms: Map<string, RadiogramMessage> = new Map();
  private subscriptions: Map<string, RadioSubscription> = new Map();
  private localCallsign: string | null = null;

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): HamRadioIntegrationService {
    if (!HamRadioIntegrationService.instance) {
      HamRadioIntegrationService.instance = new HamRadioIntegrationService();
    }
    return HamRadioIntegrationService.instance;
  }

  private initializeSampleData(): void {
    sampleOperators.forEach(op => this.operators.set(op.id, op));
    sampleRepeaters.forEach(rpt => this.repeaters.set(rpt.id, rpt));
    emergencyFrequencies.forEach(freq => this.frequencies.set(freq.id, freq));
  }

  // ==================== Operator Management ====================

  async registerOperator(params: {
    callsign: string;
    name: string;
    license: OperatorLicense;
    location: HamOperator['location'];
    equipment: RadioEquipment[];
    capabilities: OperatorCapabilities;
    availability: OperatorAvailability;
    certifications?: string[];
  }): Promise<HamOperator> {
    // Validate callsign format
    if (!this.validateCallsign(params.callsign)) {
      throw new Error(`Invalid callsign format: ${params.callsign}`);
    }

    const operator: HamOperator = {
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      callsign: params.callsign.toUpperCase(),
      name: params.name,
      status: 'standby',
      license: params.license,
      location: params.location,
      equipment: params.equipment,
      capabilities: params.capabilities,
      availability: params.availability,
      certifications: params.certifications || [],
      lastHeardFrom: new Date(),
      createdAt: new Date(),
      metadata: {}
    };

    this.operators.set(operator.id, operator);
    this.localCallsign = operator.callsign;

    return operator;
  }

  async getOperator(operatorId: string): Promise<HamOperator | null> {
    return this.operators.get(operatorId) || null;
  }

  async getOperatorByCallsign(callsign: string): Promise<HamOperator | null> {
    const normalized = callsign.toUpperCase();
    return Array.from(this.operators.values()).find(op => op.callsign === normalized) || null;
  }

  async getAllOperators(filters?: {
    status?: OperatorStatus[];
    bands?: FrequencyBand[];
    modes?: ModulationType[];
    emergencyAvailable?: boolean;
  }): Promise<HamOperator[]> {
    let operators = Array.from(this.operators.values());

    if (filters?.status) {
      operators = operators.filter(op => filters.status!.includes(op.status));
    }

    if (filters?.bands) {
      operators = operators.filter(op => 
        filters.bands!.some(band => op.capabilities.bands.includes(band))
      );
    }

    if (filters?.modes) {
      operators = operators.filter(op => 
        filters.modes!.some(mode => op.capabilities.modes.includes(mode))
      );
    }

    if (filters?.emergencyAvailable) {
      operators = operators.filter(op => op.availability.emergencyAvailable);
    }

    return operators;
  }

  async updateOperatorStatus(operatorId: string, status: OperatorStatus): Promise<HamOperator> {
    const operator = this.operators.get(operatorId);
    if (!operator) {
      throw new Error(`Operator not found: ${operatorId}`);
    }

    operator.status = status;
    operator.lastHeardFrom = new Date();

    this.emitEvent({
      type: 'operator_status',
      timestamp: new Date(),
      data: { operatorId, callsign: operator.callsign, status }
    });

    return operator;
  }

  async updateOperatorLocation(operatorId: string, location: HamOperator['location']): Promise<void> {
    const operator = this.operators.get(operatorId);
    if (operator) {
      operator.location = location;
      operator.lastHeardFrom = new Date();
    }
  }

  private validateCallsign(callsign: string): boolean {
    // Basic validation for amateur radio callsigns
    const pattern = /^[A-Z]{1,2}[0-9][A-Z]{1,4}$/i;
    return pattern.test(callsign);
  }

  // ==================== Repeater Management ====================

  async getRepeater(repeaterId: string): Promise<Repeater | null> {
    return this.repeaters.get(repeaterId) || null;
  }

  async getRepeaterByCallsign(callsign: string): Promise<Repeater | null> {
    return Array.from(this.repeaters.values()).find(
      rpt => rpt.callsign.toUpperCase() === callsign.toUpperCase()
    ) || null;
  }

  async getAllRepeaters(filters?: {
    band?: FrequencyBand;
    mode?: ModulationType;
    status?: Repeater['status'];
  }): Promise<Repeater[]> {
    let repeaters = Array.from(this.repeaters.values());

    if (filters?.status) {
      repeaters = repeaters.filter(rpt => rpt.status === filters.status);
    }

    if (filters?.mode) {
      repeaters = repeaters.filter(rpt => rpt.mode === filters.mode);
    }

    return repeaters;
  }

  async findNearbyRepeaters(location: { lat: number; lon: number }, radiusKm: number = 100): Promise<Repeater[]> {
    return Array.from(this.repeaters.values())
      .filter(rpt => {
        const distance = this.calculateDistance(location, rpt.location);
        return distance <= radiusKm;
      })
      .sort((a, b) => {
        const distA = this.calculateDistance(location, a.location);
        const distB = this.calculateDistance(location, b.location);
        return distA - distB;
      });
  }

  async addRepeater(repeater: Omit<Repeater, 'id' | 'lastCheckin'>): Promise<Repeater> {
    const newRepeater: Repeater = {
      ...repeater,
      id: `rpt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastCheckin: new Date()
    };

    this.repeaters.set(newRepeater.id, newRepeater);
    return newRepeater;
  }

  // ==================== Frequency Management ====================

  async getFrequency(frequencyId: string): Promise<Frequency | null> {
    return this.frequencies.get(frequencyId) || null;
  }

  async getAllFrequencies(filters?: {
    band?: FrequencyBand;
    mode?: ModulationType;
    purpose?: Frequency['purpose'];
  }): Promise<Frequency[]> {
    let frequencies = Array.from(this.frequencies.values());

    if (filters?.band) {
      frequencies = frequencies.filter(f => f.band === filters.band);
    }

    if (filters?.mode) {
      frequencies = frequencies.filter(f => f.mode === filters.mode);
    }

    if (filters?.purpose) {
      frequencies = frequencies.filter(f => f.purpose === filters.purpose);
    }

    return frequencies.filter(f => f.active);
  }

  getEmergencyFrequencies(): Frequency[] {
    return Array.from(this.frequencies.values())
      .filter(f => f.purpose === 'emergency' && f.active);
  }

  // ==================== Net Operations ====================

  async createNet(params: {
    name: string;
    type: NetType;
    frequency: Frequency;
    repeater?: Repeater;
    schedule: NetSchedule;
    netControl: string;
  }): Promise<RadioNet> {
    const net: RadioNet = {
      id: `net-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      frequency: params.frequency,
      repeater: params.repeater,
      schedule: params.schedule,
      netControl: params.netControl,
      participants: [],
      messages: [],
      status: 'scheduled',
      createdAt: new Date()
    };

    this.nets.set(net.id, net);
    return net;
  }

  async startNet(netId: string): Promise<RadioNet> {
    const net = this.nets.get(netId);
    if (!net) {
      throw new Error(`Net not found: ${netId}`);
    }

    net.status = 'active';
    net.startTime = new Date();

    // Add net control as first participant
    net.participants.push({
      callsign: net.netControl,
      operatorId: '',
      role: 'net_control',
      checkedIn: true,
      checkinTime: new Date(),
      trafficCount: 0
    });

    this.emitEvent({
      type: 'net_activity',
      timestamp: new Date(),
      data: { netId, action: 'started', netControl: net.netControl }
    });

    return net;
  }

  async closeNet(netId: string): Promise<RadioNet> {
    const net = this.nets.get(netId);
    if (!net) {
      throw new Error(`Net not found: ${netId}`);
    }

    net.status = 'closed';
    net.endTime = new Date();

    this.emitEvent({
      type: 'net_activity',
      timestamp: new Date(),
      data: { netId, action: 'closed', participants: net.participants.length }
    });

    return net;
  }

  async checkinToNet(netId: string, params: {
    callsign: string;
    operatorId?: string;
    signalReport?: string;
    location?: string;
    trafficCount?: number;
  }): Promise<NetParticipant> {
    const net = this.nets.get(netId);
    if (!net) {
      throw new Error(`Net not found: ${netId}`);
    }

    if (net.status !== 'active') {
      throw new Error('Net is not active');
    }

    const participant: NetParticipant = {
      callsign: params.callsign.toUpperCase(),
      operatorId: params.operatorId || '',
      role: 'participant',
      checkedIn: true,
      checkinTime: new Date(),
      signalReport: params.signalReport,
      location: params.location,
      trafficCount: params.trafficCount || 0
    };

    net.participants.push(participant);

    // Log the checkin
    net.messages.push({
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
      from: params.callsign.toUpperCase(),
      to: 'NET',
      type: 'checkin',
      content: `${params.callsign} checking in${params.location ? ` from ${params.location}` : ''}${params.trafficCount ? `, ${params.trafficCount} traffic` : ''}`,
      priority: 'routine',
      acknowledged: true
    });

    this.emitEvent({
      type: 'net_activity',
      timestamp: new Date(),
      data: { netId, action: 'checkin', callsign: params.callsign }
    });

    return participant;
  }

  async getNet(netId: string): Promise<RadioNet | null> {
    return this.nets.get(netId) || null;
  }

  async getActiveNets(): Promise<RadioNet[]> {
    return Array.from(this.nets.values()).filter(net => net.status === 'active');
  }

  // ==================== APRS Operations ====================

  async updateAPRSPosition(callsign: string, position: APRSStation['position'], params?: {
    course?: number;
    speed?: number;
    status?: string;
    weather?: APRSWeather;
    path?: string[];
  }): Promise<APRSStation> {
    const station: APRSStation = {
      callsign: callsign.toUpperCase(),
      ssid: this.extractSSID(callsign),
      symbol: this.determineSymbol(callsign),
      position,
      course: params?.course,
      speed: params?.speed,
      status: params?.status,
      weather: params?.weather,
      lastHeard: new Date(),
      path: params?.path || ['WIDE1-1', 'WIDE2-1']
    };

    this.aprsStations.set(callsign.toUpperCase(), station);

    this.emitEvent({
      type: 'aprs_position',
      timestamp: new Date(),
      data: station
    });

    return station;
  }

  async getAPRSStation(callsign: string): Promise<APRSStation | null> {
    return this.aprsStations.get(callsign.toUpperCase()) || null;
  }

  async getAllAPRSStations(maxAge: number = 3600000): Promise<APRSStation[]> {
    const cutoff = new Date(Date.now() - maxAge);
    return Array.from(this.aprsStations.values())
      .filter(station => station.lastHeard >= cutoff);
  }

  async sendAPRSMessage(from: string, to: string, message: string): Promise<APRSMessage> {
    const aprsMsg: APRSMessage = {
      id: `aprs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      message,
      messageId: Math.random().toString(36).substr(2, 5),
      acknowledged: false,
      timestamp: new Date()
    };

    this.aprsMessages.set(aprsMsg.id, aprsMsg);

    this.emitEvent({
      type: 'message_received',
      timestamp: new Date(),
      data: { type: 'aprs', message: aprsMsg }
    });

    return aprsMsg;
  }

  async acknowledgeAPRSMessage(messageId: string): Promise<void> {
    const message = this.aprsMessages.get(messageId);
    if (message) {
      message.acknowledged = true;
    }
  }

  private extractSSID(callsign: string): string {
    const parts = callsign.split('-');
    return parts.length > 1 ? parts[1] : '';
  }

  private determineSymbol(callsign: string): string {
    const ssid = this.extractSSID(callsign);
    const symbols: Record<string, string> = {
      '': '[-]', '1': '[/]', '2': '[\\]', '3': '[#]', '4': '[*]',
      '5': '[!]', '6': '[&]', '7': ['@'], '8': '[Y]', '9': '[>]',
      '10': '[<]', '11': '[H]', '12': '[S]', '13': '[W]', '14': '[K]', '15': ['.']
    };
    return symbols[ssid] || '[-]';
  }

  formatAPRSPacket(station: APRSStation): string {
    const lat = this.formatAPRSLatitude(station.position.lat);
    const lon = this.formatAPRSLongitude(station.position.lon);
    const symbol = station.symbol;
    
    let packet = `${station.callsign}>${station.path.join(',')}:=${lat}${symbol[1]}${lon}${symbol[2]}`;
    
    if (station.course !== undefined && station.speed !== undefined) {
      packet += `${String(station.course).padStart(3, '0')}/${String(Math.round(station.speed)).padStart(3, '0')}`;
    }
    
    if (station.status) {
      packet += ` ${station.status}`;
    }
    
    return packet;
  }

  private formatAPRSLatitude(lat: number): string {
    const deg = Math.floor(Math.abs(lat));
    const min = (Math.abs(lat) - deg) * 60;
    const dir = lat >= 0 ? 'N' : 'S';
    return `${String(deg).padStart(2, '0')}${min.toFixed(2).padStart(5, '0')}${dir}`;
  }

  private formatAPRSLongitude(lon: number): string {
    const deg = Math.floor(Math.abs(lon));
    const min = (Math.abs(lon) - deg) * 60;
    const dir = lon >= 0 ? 'E' : 'W';
    return `${String(deg).padStart(3, '0')}${min.toFixed(2).padStart(5, '0')}${dir}`;
  }

  // ==================== Winlink Operations ====================

  async createWinlinkMessage(params: {
    from: string;
    to: string[];
    cc?: string[];
    subject: string;
    body: string;
    attachments?: WinlinkAttachment[];
    priority?: MessagePriority;
  }): Promise<WinlinkMessage> {
    const message: WinlinkMessage = {
      id: `wl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: params.from.toUpperCase(),
      to: params.to.map(t => t.toUpperCase()),
      cc: params.cc?.map(c => c.toUpperCase()),
      subject: params.subject,
      body: params.body,
      attachments: params.attachments,
      priority: params.priority || 'routine',
      status: 'draft',
      timestamp: new Date()
    };

    this.winlinkMessages.set(message.id, message);
    return message;
  }

  async sendWinlinkMessage(messageId: string, viaRMS?: string): Promise<WinlinkMessage> {
    const message = this.winlinkMessages.get(messageId);
    if (!message) {
      throw new Error(`Message not found: ${messageId}`);
    }

    message.status = 'outbox';
    
    // Simulate sending
    await this.simulateDelay(2000);
    
    message.status = 'sent';
    message.sentVia = viaRMS;

    return message;
  }

  async getWinlinkMessage(messageId: string): Promise<WinlinkMessage | null> {
    return this.winlinkMessages.get(messageId) || null;
  }

  async getWinlinkMessages(callsign: string): Promise<WinlinkMessage[]> {
    const normalized = callsign.toUpperCase();
    return Array.from(this.winlinkMessages.values())
      .filter(m => m.from === normalized || m.to.includes(normalized))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // ==================== Radiogram (Formal Traffic) Operations ====================

  async createRadiogram(params: {
    precedence: MessagePriority;
    station: string;
    place: string;
    address: RadiogramMessage['address'];
    text: string[];
    signature: string;
  }): Promise<RadiogramMessage> {
    const radiogram: RadiogramMessage = {
      id: `rg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      preamble: {
        number: this.getNextRadiogramNumber(),
        precedence: params.precedence,
        handling: 'hx',
        station: params.station.toUpperCase(),
        check: params.text.join(' ').split(' ').length,
        place: params.place,
        time: new Date().toISOString().substr(11, 5).replace(':', ''),
        date: new Date().toISOString().substr(5, 5).replace('-', '')
      },
      address: params.address,
      text: params.text,
      signature: params.signature,
      status: 'received',
      route: [{
        station: params.station.toUpperCase(),
        timestamp: new Date(),
        action: 'originated'
      }]
    };

    this.radiograms.set(radiogram.id, radiogram);

    if (params.precedence === 'flash' || params.precedence === 'immediate') {
      this.emitEvent({
        type: 'emergency_traffic',
        timestamp: new Date(),
        data: { radiogramId: radiogram.id, precedence: params.precedence }
      });
    }

    return radiogram;
  }

  async relayRadiogram(radiogramId: string, relayStation: string): Promise<RadiogramMessage> {
    const radiogram = this.radiograms.get(radiogramId);
    if (!radiogram) {
      throw new Error(`Radiogram not found: ${radiogramId}`);
    }

    radiogram.status = 'in_transit';
    radiogram.route.push({
      station: relayStation.toUpperCase(),
      timestamp: new Date(),
      action: 'relayed'
    });

    return radiogram;
  }

  async deliverRadiogram(radiogramId: string, deliveryStation: string): Promise<RadiogramMessage> {
    const radiogram = this.radiograms.get(radiogramId);
    if (!radiogram) {
      throw new Error(`Radiogram not found: ${radiogramId}`);
    }

    radiogram.status = 'delivered';
    radiogram.route.push({
      station: deliveryStation.toUpperCase(),
      timestamp: new Date(),
      action: 'delivered'
    });

    return radiogram;
  }

  formatRadiogram(radiogram: RadiogramMessage): string {
    const p = radiogram.preamble;
    const a = radiogram.address;
    
    let formatted = `NR ${p.number} ${p.precedence.toUpperCase()} ${p.handling.toUpperCase()} ${p.station} ${p.check} ${p.place} ${p.time} ${p.date}\n`;
    formatted += `${a.name}\n`;
    if (a.street) formatted += `${a.street}\n`;
    formatted += `${a.city} ${a.state}${a.zip ? ' ' + a.zip : ''}\n`;
    if (a.phone) formatted += `${a.phone}\n`;
    formatted += `BT\n`;
    formatted += radiogram.text.join(' X ') + '\n';
    formatted += `BT\n`;
    formatted += radiogram.signature;
    
    return formatted;
  }

  private getNextRadiogramNumber(): number {
    const numbers = Array.from(this.radiograms.values())
      .map(r => r.preamble.number);
    return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  }

  // ==================== Emergency Activation ====================

  async activateEmergencyNet(params: {
    name: string;
    frequency: Frequency;
    netControl: string;
    scope: string;
    description: string;
  }): Promise<RadioNet> {
    const net = await this.createNet({
      name: params.name,
      type: 'emergency',
      frequency: params.frequency,
      schedule: { type: 'emergency', time: 'NOW', duration: 0 },
      netControl: params.netControl
    });

    await this.startNet(net.id);

    // Notify all available operators
    const availableOperators = await this.getAllOperators({ emergencyAvailable: true });
    for (const operator of availableOperators) {
      await this.updateOperatorStatus(operator.id, 'emergency');
    }

    this.emitEvent({
      type: 'emergency_traffic',
      timestamp: new Date(),
      data: {
        type: 'emergency_net_activation',
        netId: net.id,
        scope: params.scope,
        description: params.description,
        frequency: params.frequency.frequency
      }
    });

    return net;
  }

  async broadcastEmergencyMessage(params: {
    message: string;
    priority: MessagePriority;
    frequency: Frequency;
    repeater?: Repeater;
  }): Promise<void> {
    // Create emergency radiogram
    await this.createRadiogram({
      precedence: params.priority,
      station: this.localCallsign || 'EMERGENCY',
      place: 'EMERGENCY OPS',
      address: {
        name: 'ALL STATIONS',
        city: 'BROADCAST',
        state: 'XX'
      },
      text: params.message.split(' ').slice(0, 25), // Max 25 word groups
      signature: 'EMERGENCY MANAGEMENT'
    });

    this.emitEvent({
      type: 'emergency_traffic',
      timestamp: new Date(),
      data: {
        type: 'emergency_broadcast',
        message: params.message,
        priority: params.priority,
        frequency: params.frequency.frequency
      }
    });
  }

  // ==================== Utility Methods ====================

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

  toMaidenhead(lat: number, lon: number): string {
    // Convert lat/lon to Maidenhead grid square
    lon += 180;
    lat += 90;
    
    const field = String.fromCharCode(65 + Math.floor(lon / 20)) +
                  String.fromCharCode(65 + Math.floor(lat / 10));
    const square = String(Math.floor((lon % 20) / 2)) +
                   String(Math.floor(lat % 10));
    const subsquare = String.fromCharCode(97 + Math.floor((lon % 2) * 12)) +
                      String.fromCharCode(97 + Math.floor((lat % 1) * 24));
    
    return field + square + subsquare;
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, Math.min(ms, 100)));
  }

  // ==================== Statistics ====================

  getStatistics(): {
    operators: { total: number; active: number; emergency: number };
    repeaters: { total: number; operational: number };
    nets: { total: number; active: number };
    aprsStations: number;
    pendingTraffic: number;
  } {
    const operators = Array.from(this.operators.values());
    const repeaters = Array.from(this.repeaters.values());
    const nets = Array.from(this.nets.values());

    return {
      operators: {
        total: operators.length,
        active: operators.filter(op => op.status === 'active').length,
        emergency: operators.filter(op => op.status === 'emergency').length
      },
      repeaters: {
        total: repeaters.length,
        operational: repeaters.filter(rpt => rpt.status === 'operational').length
      },
      nets: {
        total: nets.length,
        active: nets.filter(n => n.status === 'active').length
      },
      aprsStations: this.aprsStations.size,
      pendingTraffic: Array.from(this.radiograms.values())
        .filter(r => r.status === 'received' || r.status === 'in_transit').length
    };
  }

  // ==================== Subscriptions ====================

  subscribe(callback: (event: RadioEvent) => void, eventTypes?: RadioEventType[]): string {
    const id = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.subscriptions.set(id, { id, callback, eventTypes });
    return id;
  }

  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }

  private emitEvent(event: RadioEvent): void {
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

export const hamRadioIntegrationService = HamRadioIntegrationService.getInstance();
export default HamRadioIntegrationService;
