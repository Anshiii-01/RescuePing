// @ts-nocheck
/**
 * Pipeline Monitoring Service - Issue #150 Implementation
 * 
 * Provides comprehensive pipeline infrastructure monitoring for disaster response
 * including oil/gas pipelines, water mains, sewage systems, monitoring sensors,
 * leak detection, and emergency response coordination.
 */

// Type definitions
type PipelineType = 'natural_gas' | 'crude_oil' | 'refined_products' | 'water' | 'wastewater' | 'chemicals' | 'slurry' | 'steam';
type PipelineMaterial = 'steel' | 'cast_iron' | 'ductile_iron' | 'pvc' | 'hdpe' | 'concrete' | 'composite' | 'copper';
type OperationalStatus = 'operational' | 'reduced_flow' | 'shutdown' | 'maintenance' | 'damaged' | 'abandoned';
type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';
type SensorType = 'pressure' | 'flow' | 'temperature' | 'leak' | 'vibration' | 'corrosion' | 'pig_detector' | 'gas_detector';
type LeakSeverity = 'minor' | 'moderate' | 'major' | 'catastrophic';
type InspectionType = 'visual' | 'inline' | 'hydrostatic' | 'ultrasonic' | 'magnetic' | 'aerial' | 'excavation';

// Pipeline interfaces
interface Pipeline {
  id: string;
  name: string;
  systemId: string;
  type: PipelineType;
  material: PipelineMaterial;
  segments: PipelineSegment[];
  specifications: PipelineSpecifications;
  operationalStatus: OperationalStatus;
  currentConditions: PipelineConditions;
  sensors: string[];
  valves: Valve[];
  pumpStations: PumpStation[];
  owner: OwnerInfo;
  regulatoryInfo: RegulatoryInfo;
  maintenanceHistory: MaintenanceRecord[];
  incidents: string[];
  emergencyPlan: EmergencyPlan;
  createdAt: Date;
  updatedAt: Date;
}

interface PipelineSegment {
  id: string;
  name: string;
  startPoint: { lat: number; lon: number; description: string };
  endPoint: { lat: number; lon: number; description: string };
  length: number; // km
  diameter: number; // mm
  wallThickness: number; // mm
  material: PipelineMaterial;
  depth: number; // meters below surface
  yearInstalled: number;
  coatingType?: string;
  cathodicProtection: boolean;
  maxOperatingPressure: number; // psi or bar
  currentPressure?: number;
  terrain: string[];
  crossings: PipelineCrossing[];
  riskScore: number; // 0-100
}

interface PipelineCrossing {
  id: string;
  type: 'road' | 'railway' | 'water' | 'utility' | 'highway' | 'building';
  description: string;
  location: { lat: number; lon: number };
  protectionMethod: string;
  lastInspected: Date;
}

interface PipelineSpecifications {
  totalLength: number; // km
  averageDiameter: number; // mm
  designPressure: number; // psi or bar
  designFlow: number; // cubic meters per hour
  currentFlow: number;
  capacityUtilization: number; // percent
  productTransported: string;
  productGrade?: string;
  throughputDaily: number; // cubic meters
  yearCommissioned: number;
  designLife: number; // years
  ageYears: number;
}

interface PipelineConditions {
  pressure: {
    inlet: number;
    outlet: number;
    average: number;
    trend: 'rising' | 'stable' | 'falling';
  };
  flow: {
    current: number;
    average: number;
    percentOfCapacity: number;
  };
  temperature: {
    current: number;
    normal: number;
    status: 'normal' | 'elevated' | 'critical';
  };
  integrity: {
    overallScore: number; // 0-100
    lastAssessment: Date;
    nextAssessment: Date;
    concerns: string[];
  };
}

// Valve interfaces
interface Valve {
  id: string;
  name: string;
  type: 'gate' | 'ball' | 'check' | 'butterfly' | 'plug' | 'globe' | 'pressure_relief';
  location: { lat: number; lon: number };
  segmentId: string;
  size: number; // mm
  actuatorType: 'manual' | 'electric' | 'pneumatic' | 'hydraulic';
  status: 'open' | 'closed' | 'partial' | 'failed' | 'maintenance';
  percentOpen?: number;
  remoteOperable: boolean;
  emergencyShutoff: boolean;
  lastOperated: Date;
  lastTested: Date;
  nextTest: Date;
  responseTime?: number; // seconds to close
}

// Pump Station interfaces
interface PumpStation {
  id: string;
  name: string;
  location: { lat: number; lon: number; address: string };
  type: 'booster' | 'main' | 'transfer' | 'injection';
  capacity: number; // cubic meters per hour
  currentOutput: number;
  pumps: Pump[];
  powerSource: 'grid' | 'generator' | 'dual';
  backupPower: boolean;
  status: 'operational' | 'reduced' | 'offline' | 'maintenance';
  pressureIn: number;
  pressureOut: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
}

interface Pump {
  id: string;
  name: string;
  type: 'centrifugal' | 'positive_displacement' | 'submersible';
  capacity: number;
  currentOutput: number;
  efficiency: number; // percent
  status: 'running' | 'standby' | 'failed' | 'maintenance';
  runtime: number; // hours
  lastOverhaul: Date;
}

// Sensor interfaces
interface PipelineSensor {
  id: string;
  pipelineId: string;
  segmentId: string;
  type: SensorType;
  name: string;
  location: { lat: number; lon: number; milePost?: number };
  specifications: {
    manufacturer: string;
    model: string;
    range: { min: number; max: number };
    unit: string;
    accuracy: number;
    resolution: number;
  };
  thresholds: {
    low_warning?: number;
    low_critical?: number;
    high_warning: number;
    high_critical: number;
    rateOfChange?: number;
  };
  calibration: {
    lastCalibrated: Date;
    nextCalibration: Date;
    factor: number;
  };
  status: 'online' | 'offline' | 'degraded' | 'alarm';
  lastReading?: SensorReading;
  installedAt: Date;
}

interface SensorReading {
  id: string;
  sensorId: string;
  pipelineId: string;
  timestamp: Date;
  value: number;
  unit: string;
  quality: 'good' | 'suspect' | 'bad';
  status: 'normal' | 'warning' | 'critical' | 'emergency';
  rateOfChange?: number;
}

// Leak interfaces
interface LeakEvent {
  id: string;
  pipelineId: string;
  segmentId?: string;
  severity: LeakSeverity;
  location: { lat: number; lon: number; accuracy: number };
  estimatedLocation?: { milePost: number; description: string };
  detectionMethod: 'sensor' | 'visual' | 'public_report' | 'aerial' | 'satellite' | 'pressure_drop' | 'flow_imbalance';
  detectedAt: Date;
  confirmedAt?: Date;
  status: 'suspected' | 'confirmed' | 'contained' | 'repaired' | 'monitoring' | 'closed';
  estimatedVolume?: number; // liters
  actualVolume?: number;
  environmentalImpact: EnvironmentalImpact;
  response: LeakResponse;
  cause?: string;
  repairs?: RepairRecord;
  updates: LeakUpdate[];
}

interface EnvironmentalImpact {
  groundwater: boolean;
  surfaceWater: boolean;
  soil: boolean;
  airQuality: boolean;
  wildlife: boolean;
  affectedArea?: number; // square meters
  evacuationRequired: boolean;
  evacuationRadius?: number; // meters
  cleanupRequired: boolean;
  regulatoryNotifications: string[];
}

interface LeakResponse {
  commander?: string;
  respondingTeams: string[];
  valvesClosed: string[];
  pumpsStopped: string[];
  containmentDeployed: boolean;
  evacuationInitiated: boolean;
  emergencyServicesNotified: boolean;
  regulatoryReported: boolean;
  publicNotified: boolean;
  mediaStatement?: string;
  estimatedRepairTime?: number; // hours
}

interface LeakUpdate {
  id: string;
  timestamp: Date;
  author: string;
  status: string;
  message: string;
  volumeEstimate?: number;
}

interface RepairRecord {
  id: string;
  startTime: Date;
  endTime?: Date;
  method: string;
  contractor?: string;
  materials: string[];
  cost?: number;
  pressureTest?: { date: Date; result: string };
  returnToService?: Date;
}

// Inspection interfaces
interface PipelineInspection {
  id: string;
  pipelineId: string;
  segmentIds: string[];
  type: InspectionType;
  scheduledDate: Date;
  actualDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  inspector: InspectorInfo;
  findings: InspectionFinding[];
  defects: DefectRecord[];
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  recommendations: string[];
  priorityRepairs: string[];
  nextInspection: Date;
  report?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InspectorInfo {
  id: string;
  name: string;
  company: string;
  certifications: string[];
  phone: string;
  email: string;
}

interface InspectionFinding {
  id: string;
  location: { lat: number; lon: number; milePost?: number };
  type: string;
  description: string;
  severity: 'minor' | 'moderate' | 'significant' | 'critical';
  dimensions?: { length: number; width: number; depth: number };
  photoIds: string[];
  recommendedAction: string;
  priority: 'immediate' | 'urgent' | 'routine' | 'monitor';
}

interface DefectRecord {
  id: string;
  type: 'corrosion' | 'dent' | 'crack' | 'weld_defect' | 'coating_damage' | 'wall_loss' | 'anomaly';
  location: { lat: number; lon: number; milePost: number; clock_position?: string };
  dimensions: { length: number; width: number; depth: number; wallLossPercent: number };
  severity: 'minor' | 'moderate' | 'significant' | 'critical';
  repairRequired: boolean;
  repairPriority?: 'immediate' | 'scheduled' | 'monitor';
  repairDeadline?: Date;
  status: 'identified' | 'scheduled' | 'repaired' | 'monitoring';
}

// Owner/Regulatory interfaces
interface OwnerInfo {
  company: string;
  type: 'utility' | 'private' | 'government' | 'municipal';
  contactName: string;
  phone: string;
  email: string;
  emergencyHotline: string;
  address: string;
}

interface RegulatoryInfo {
  agency: string;
  permitNumber: string;
  complianceStatus: 'compliant' | 'minor_issues' | 'major_issues' | 'non_compliant';
  lastAudit: Date;
  nextAudit: Date;
  violations: string[];
  correctiveActions: string[];
}

// Maintenance interfaces
interface MaintenanceRecord {
  id: string;
  type: 'preventive' | 'corrective' | 'emergency' | 'upgrade';
  description: string;
  segmentId?: string;
  location?: { lat: number; lon: number };
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  impact: 'none' | 'reduced_flow' | 'shutdown';
  contractor?: string;
  cost?: number;
  notes: string;
}

// Emergency Plan interfaces
interface EmergencyPlan {
  id: string;
  version: string;
  lastUpdated: Date;
  contacts: EmergencyContact[];
  procedures: EmergencyProcedure[];
  valveOperations: ValveOperation[];
  evacuationZones: EvacuationZone[];
  equipment: EmergencyEquipment[];
}

interface EmergencyContact {
  role: string;
  name: string;
  organization: string;
  phone: string;
  available24x7: boolean;
}

interface EmergencyProcedure {
  scenario: string;
  steps: string[];
  notifications: string[];
  resources: string[];
}

interface ValveOperation {
  scenario: string;
  valveIds: string[];
  sequence: { valveId: string; action: string; order: number }[];
  isolationTime: number; // minutes
}

interface EvacuationZone {
  id: string;
  name: string;
  polygon: { lat: number; lon: number }[];
  population: number;
  facilities: string[];
  evacuationRoutes: string[];
}

interface EmergencyEquipment {
  type: string;
  location: string;
  quantity: number;
  condition: string;
  lastChecked: Date;
}

// Alert interfaces
interface PipelineAlert {
  id: string;
  pipelineId: string;
  segmentId?: string;
  type: 'pressure' | 'flow' | 'leak' | 'temperature' | 'integrity' | 'equipment' | 'security';
  severity: AlertSeverity;
  title: string;
  description: string;
  sensorId?: string;
  currentValue?: number;
  threshold?: number;
  unit?: string;
  triggeredAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  actions: string[];
  relatedEventId?: string;
}

// Sample data
const samplePipelines: Pipeline[] = [
  {
    id: 'pipeline-001',
    name: 'Metro Gas Main',
    systemId: 'NGS-001',
    type: 'natural_gas',
    material: 'steel',
    segments: [
      {
        id: 'seg-001',
        name: 'Main Trunk Line',
        startPoint: { lat: 34.0522, lon: -118.2437, description: 'City Gate Station' },
        endPoint: { lat: 34.0622, lon: -118.2537, description: 'Distribution Hub' },
        length: 15,
        diameter: 600,
        wallThickness: 12,
        material: 'steel',
        depth: 1.5,
        yearInstalled: 1985,
        coatingType: 'Fusion Bonded Epoxy',
        cathodicProtection: true,
        maxOperatingPressure: 600,
        currentPressure: 450,
        terrain: ['urban', 'residential'],
        crossings: [],
        riskScore: 35
      }
    ],
    specifications: {
      totalLength: 150,
      averageDiameter: 500,
      designPressure: 600,
      designFlow: 50000,
      currentFlow: 35000,
      capacityUtilization: 70,
      productTransported: 'Natural Gas',
      throughputDaily: 840000,
      yearCommissioned: 1985,
      designLife: 50,
      ageYears: 39
    },
    operationalStatus: 'operational',
    currentConditions: {
      pressure: { inlet: 500, outlet: 400, average: 450, trend: 'stable' },
      flow: { current: 35000, average: 33000, percentOfCapacity: 70 },
      temperature: { current: 15, normal: 15, status: 'normal' },
      integrity: {
        overallScore: 85,
        lastAssessment: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        nextAssessment: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        concerns: []
      }
    },
    sensors: ['sensor-001', 'sensor-002'],
    valves: [
      {
        id: 'valve-001',
        name: 'City Gate Valve 1',
        type: 'gate',
        location: { lat: 34.0522, lon: -118.2437 },
        segmentId: 'seg-001',
        size: 600,
        actuatorType: 'electric',
        status: 'open',
        percentOpen: 100,
        remoteOperable: true,
        emergencyShutoff: true,
        lastOperated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastTested: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        nextTest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        responseTime: 30
      }
    ],
    pumpStations: [],
    owner: {
      company: 'Metro Gas Utility',
      type: 'utility',
      contactName: 'David Miller',
      phone: '555-0101',
      email: 'dmiller@metrogas.com',
      emergencyHotline: '1-800-GAS-LEAK',
      address: '100 Utility Road, Metro City, CA'
    },
    regulatoryInfo: {
      agency: 'Pipeline Safety Agency',
      permitNumber: 'PSA-2024-001',
      complianceStatus: 'compliant',
      lastAudit: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      nextAudit: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      violations: [],
      correctiveActions: []
    },
    maintenanceHistory: [],
    incidents: [],
    emergencyPlan: {
      id: 'eplan-001',
      version: '3.0',
      lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      contacts: [],
      procedures: [],
      valveOperations: [],
      evacuationZones: [],
      equipment: []
    },
    createdAt: new Date(Date.now() - 365 * 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class PipelineMonitoringService {
  private static instance: PipelineMonitoringService;
  private pipelines: Map<string, Pipeline> = new Map();
  private sensors: Map<string, PipelineSensor> = new Map();
  private readings: Map<string, SensorReading[]> = new Map();
  private leaks: Map<string, LeakEvent> = new Map();
  private inspections: Map<string, PipelineInspection> = new Map();
  private alerts: Map<string, PipelineAlert> = new Map();

  private readonly PRESSURE_VARIANCE_THRESHOLD = 0.10; // 10%
  private readonly FLOW_IMBALANCE_THRESHOLD = 0.05; // 5%

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): PipelineMonitoringService {
    if (!PipelineMonitoringService.instance) {
      PipelineMonitoringService.instance = new PipelineMonitoringService();
    }
    return PipelineMonitoringService.instance;
  }

  private initializeSampleData(): void {
    samplePipelines.forEach(p => this.pipelines.set(p.id, p));
  }

  // ==================== Pipeline Management ====================

  async createPipeline(params: Omit<Pipeline, 'id' | 'sensors' | 'incidents' | 'maintenanceHistory' | 'createdAt' | 'updatedAt'>): Promise<Pipeline> {
    const pipeline: Pipeline = {
      ...params,
      id: `pipeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sensors: [],
      incidents: [],
      maintenanceHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.pipelines.set(pipeline.id, pipeline);
    return pipeline;
  }

  async getPipeline(pipelineId: string): Promise<Pipeline | null> {
    return this.pipelines.get(pipelineId) || null;
  }

  async getPipelines(params?: {
    type?: PipelineType;
    status?: OperationalStatus;
    owner?: string;
    material?: PipelineMaterial;
  }): Promise<Pipeline[]> {
    let pipelines = Array.from(this.pipelines.values());

    if (params?.type) {
      pipelines = pipelines.filter(p => p.type === params.type);
    }

    if (params?.status) {
      pipelines = pipelines.filter(p => p.operationalStatus === params.status);
    }

    if (params?.owner) {
      pipelines = pipelines.filter(p => p.owner.company === params.owner);
    }

    if (params?.material) {
      pipelines = pipelines.filter(p => p.material === params.material);
    }

    return pipelines;
  }

  async updatePipelineStatus(pipelineId: string, status: OperationalStatus, reason?: string): Promise<Pipeline> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) throw new Error(`Pipeline not found: ${pipelineId}`);

    const previousStatus = pipeline.operationalStatus;
    pipeline.operationalStatus = status;
    pipeline.updatedAt = new Date();

    // Create alert if status changed significantly
    if (previousStatus === 'operational' && status !== 'operational') {
      await this.createAlert({
        pipelineId,
        type: 'equipment',
        severity: status === 'damaged' ? 'critical' : status === 'shutdown' ? 'warning' : 'info',
        title: `Pipeline ${pipeline.name} status changed to ${status}`,
        description: reason || `Pipeline status changed from ${previousStatus} to ${status}`
      });
    }

    return pipeline;
  }

  async updatePipelineConditions(pipelineId: string, conditions: Partial<PipelineConditions>): Promise<Pipeline> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) throw new Error(`Pipeline not found: ${pipelineId}`);

    if (conditions.pressure) {
      Object.assign(pipeline.currentConditions.pressure, conditions.pressure);
    }
    if (conditions.flow) {
      Object.assign(pipeline.currentConditions.flow, conditions.flow);
    }
    if (conditions.temperature) {
      Object.assign(pipeline.currentConditions.temperature, conditions.temperature);
    }
    if (conditions.integrity) {
      Object.assign(pipeline.currentConditions.integrity, conditions.integrity);
    }

    pipeline.updatedAt = new Date();

    // Check for anomalies
    await this.checkForAnomalies(pipeline);

    return pipeline;
  }

  private async checkForAnomalies(pipeline: Pipeline): Promise<void> {
    const { pressure, flow } = pipeline.currentConditions;

    // Check for pressure anomalies
    const pressureDrop = (pressure.inlet - pressure.outlet) / pressure.inlet;
    if (pressureDrop > this.PRESSURE_VARIANCE_THRESHOLD) {
      await this.createAlert({
        pipelineId: pipeline.id,
        type: 'pressure',
        severity: 'warning',
        title: `Abnormal pressure drop on ${pipeline.name}`,
        description: `Pressure drop of ${(pressureDrop * 100).toFixed(1)}% detected`,
        currentValue: pressureDrop * 100,
        threshold: this.PRESSURE_VARIANCE_THRESHOLD * 100,
        unit: '%'
      });
    }

    // Check for temperature anomalies
    if (pipeline.currentConditions.temperature.status === 'critical') {
      await this.createAlert({
        pipelineId: pipeline.id,
        type: 'temperature',
        severity: 'critical',
        title: `Critical temperature on ${pipeline.name}`,
        description: `Temperature at ${pipeline.currentConditions.temperature.current}°C`,
        currentValue: pipeline.currentConditions.temperature.current,
        unit: '°C'
      });
    }
  }

  // ==================== Valve Operations ====================

  async operateValve(pipelineId: string, valveId: string, operation: {
    action: 'open' | 'close' | 'partial';
    percentOpen?: number;
    reason: string;
    operator: string;
  }): Promise<Valve> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) throw new Error(`Pipeline not found: ${pipelineId}`);

    const valve = pipeline.valves.find(v => v.id === valveId);
    if (!valve) throw new Error(`Valve not found: ${valveId}`);

    valve.status = operation.action === 'partial' ? 'partial' : operation.action;
    if (operation.percentOpen !== undefined) {
      valve.percentOpen = operation.percentOpen;
    } else {
      valve.percentOpen = operation.action === 'open' ? 100 : 0;
    }
    valve.lastOperated = new Date();

    pipeline.updatedAt = new Date();

    // Log valve operation
    pipeline.maintenanceHistory.push({
      id: `maint-${Date.now()}`,
      type: 'corrective',
      description: `Valve ${valve.name} ${operation.action}: ${operation.reason}`,
      scheduledStart: new Date(),
      scheduledEnd: new Date(),
      actualStart: new Date(),
      actualEnd: new Date(),
      status: 'completed',
      impact: operation.action === 'close' ? 'shutdown' : 'none',
      notes: `Operated by ${operation.operator}`
    });

    return valve;
  }

  async emergencyShutdown(pipelineId: string, segmentId?: string, reason: string, operator: string): Promise<{
    pipeline: Pipeline;
    valvesClosed: Valve[];
    pumpsStopped: PumpStation[];
  }> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) throw new Error(`Pipeline not found: ${pipelineId}`);

    const valvesClosed: Valve[] = [];
    const pumpsStopped: PumpStation[] = [];

    // Close emergency shutoff valves
    const emergencyValves = pipeline.valves.filter(v => v.emergencyShutoff);
    for (const valve of emergencyValves) {
      if (segmentId && valve.segmentId !== segmentId) continue;
      await this.operateValve(pipelineId, valve.id, {
        action: 'close',
        reason: `Emergency shutdown: ${reason}`,
        operator
      });
      valvesClosed.push(valve);
    }

    // Stop pump stations
    for (const station of pipeline.pumpStations) {
      station.status = 'offline';
      for (const pump of station.pumps) {
        pump.status = 'standby';
      }
      pumpsStopped.push(station);
    }

    // Update pipeline status
    await this.updatePipelineStatus(pipelineId, 'shutdown', `Emergency shutdown: ${reason}`);

    // Create critical alert
    await this.createAlert({
      pipelineId,
      segmentId,
      type: 'equipment',
      severity: 'emergency',
      title: `Emergency shutdown of ${pipeline.name}`,
      description: reason
    });

    return { pipeline, valvesClosed, pumpsStopped };
  }

  // ==================== Sensor Management ====================

  async installSensor(params: Omit<PipelineSensor, 'id' | 'installedAt'>): Promise<PipelineSensor> {
    const pipeline = this.pipelines.get(params.pipelineId);
    if (!pipeline) throw new Error(`Pipeline not found: ${params.pipelineId}`);

    const sensor: PipelineSensor = {
      ...params,
      id: `sensor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      installedAt: new Date()
    };

    this.sensors.set(sensor.id, sensor);
    pipeline.sensors.push(sensor.id);
    pipeline.updatedAt = new Date();

    return sensor;
  }

  async getSensor(sensorId: string): Promise<PipelineSensor | null> {
    return this.sensors.get(sensorId) || null;
  }

  async getSensorsForPipeline(pipelineId: string): Promise<PipelineSensor[]> {
    return Array.from(this.sensors.values()).filter(s => s.pipelineId === pipelineId);
  }

  async recordSensorReading(params: {
    sensorId: string;
    value: number;
    quality?: SensorReading['quality'];
  }): Promise<SensorReading> {
    const sensor = this.sensors.get(params.sensorId);
    if (!sensor) throw new Error(`Sensor not found: ${params.sensorId}`);

    // Calculate rate of change
    const previousReadings = this.readings.get(sensor.pipelineId) || [];
    const lastReading = previousReadings.filter(r => r.sensorId === sensor.id).slice(-1)[0];
    let rateOfChange: number | undefined;

    if (lastReading) {
      const timeDiff = (Date.now() - lastReading.timestamp.getTime()) / 3600000;
      if (timeDiff > 0) {
        rateOfChange = (params.value - lastReading.value) / timeDiff;
      }
    }

    // Determine status
    let status: SensorReading['status'] = 'normal';
    const value = params.value;
    const thresholds = sensor.thresholds;

    if (value >= thresholds.high_critical || (thresholds.low_critical && value <= thresholds.low_critical)) {
      status = 'critical';
    } else if (value >= thresholds.high_warning || (thresholds.low_warning && value <= thresholds.low_warning)) {
      status = 'warning';
    }

    // Check rate of change if threshold exists
    if (thresholds.rateOfChange && rateOfChange && Math.abs(rateOfChange) > thresholds.rateOfChange) {
      status = status === 'normal' ? 'warning' : status;
    }

    const reading: SensorReading = {
      id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sensorId: params.sensorId,
      pipelineId: sensor.pipelineId,
      timestamp: new Date(),
      value: params.value,
      unit: sensor.specifications.unit,
      quality: params.quality || 'good',
      status,
      rateOfChange
    };

    // Store reading
    const readings = this.readings.get(sensor.pipelineId) || [];
    readings.push(reading);
    if (readings.length > 100000) readings.shift();
    this.readings.set(sensor.pipelineId, readings);

    // Update sensor
    sensor.lastReading = reading;
    if (status !== 'normal') {
      sensor.status = 'alarm';
      await this.createAlert({
        pipelineId: sensor.pipelineId,
        segmentId: sensor.segmentId,
        type: sensor.type as any,
        severity: status === 'critical' ? 'critical' : 'warning',
        title: `${sensor.type} alert on pipeline`,
        description: `Sensor ${sensor.name} reading: ${reading.value} ${reading.unit}`,
        sensorId: sensor.id,
        currentValue: reading.value,
        threshold: thresholds.high_warning,
        unit: reading.unit
      });
    } else {
      sensor.status = 'online';
    }

    return reading;
  }

  // ==================== Leak Detection ====================

  async reportLeak(params: {
    pipelineId: string;
    segmentId?: string;
    severity: LeakSeverity;
    location: { lat: number; lon: number; accuracy: number };
    detectionMethod: LeakEvent['detectionMethod'];
    description?: string;
  }): Promise<LeakEvent> {
    const pipeline = this.pipelines.get(params.pipelineId);
    if (!pipeline) throw new Error(`Pipeline not found: ${params.pipelineId}`);

    const leak: LeakEvent = {
      id: `leak-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pipelineId: params.pipelineId,
      segmentId: params.segmentId,
      severity: params.severity,
      location: params.location,
      detectionMethod: params.detectionMethod,
      detectedAt: new Date(),
      status: 'suspected',
      environmentalImpact: {
        groundwater: false,
        surfaceWater: false,
        soil: false,
        airQuality: pipeline.type === 'natural_gas',
        wildlife: false,
        evacuationRequired: params.severity === 'major' || params.severity === 'catastrophic',
        cleanupRequired: false,
        regulatoryNotifications: []
      },
      response: {
        respondingTeams: [],
        valvesClosed: [],
        pumpsStopped: [],
        containmentDeployed: false,
        evacuationInitiated: false,
        emergencyServicesNotified: false,
        regulatoryReported: false,
        publicNotified: false
      },
      updates: [{
        id: `update-${Date.now()}`,
        timestamp: new Date(),
        author: 'System',
        status: 'suspected',
        message: params.description || `Leak detected via ${params.detectionMethod}`
      }]
    };

    this.leaks.set(leak.id, leak);
    pipeline.incidents.push(leak.id);

    // Create alert
    await this.createAlert({
      pipelineId: params.pipelineId,
      segmentId: params.segmentId,
      type: 'leak',
      severity: this.getSeverityFromLeak(params.severity),
      title: `${params.severity.toUpperCase()} leak detected on ${pipeline.name}`,
      description: params.description || `Leak detected via ${params.detectionMethod}`,
      relatedEventId: leak.id
    });

    // Auto-initiate emergency response for major/catastrophic
    if (params.severity === 'major' || params.severity === 'catastrophic') {
      await this.emergencyShutdown(params.pipelineId, params.segmentId, 'Leak detected', 'System');
    }

    return leak;
  }

  private getSeverityFromLeak(leakSeverity: LeakSeverity): AlertSeverity {
    switch (leakSeverity) {
      case 'catastrophic': return 'emergency';
      case 'major': return 'critical';
      case 'moderate': return 'warning';
      default: return 'info';
    }
  }

  async updateLeak(leakId: string, update: {
    status?: LeakEvent['status'];
    estimatedVolume?: number;
    actualVolume?: number;
    environmentalImpact?: Partial<EnvironmentalImpact>;
    response?: Partial<LeakResponse>;
    message?: string;
    author?: string;
  }): Promise<LeakEvent> {
    const leak = this.leaks.get(leakId);
    if (!leak) throw new Error(`Leak not found: ${leakId}`);

    if (update.status) {
      leak.status = update.status;
    }
    if (update.estimatedVolume !== undefined) {
      leak.estimatedVolume = update.estimatedVolume;
    }
    if (update.actualVolume !== undefined) {
      leak.actualVolume = update.actualVolume;
    }
    if (update.environmentalImpact) {
      Object.assign(leak.environmentalImpact, update.environmentalImpact);
    }
    if (update.response) {
      Object.assign(leak.response, update.response);
    }

    if (update.message) {
      leak.updates.push({
        id: `update-${Date.now()}`,
        timestamp: new Date(),
        author: update.author || 'System',
        status: leak.status,
        message: update.message,
        volumeEstimate: update.estimatedVolume
      });
    }

    return leak;
  }

  async confirmLeak(leakId: string, confirmedBy: string): Promise<LeakEvent> {
    return this.updateLeak(leakId, {
      status: 'confirmed',
      message: `Leak confirmed by ${confirmedBy}`,
      author: confirmedBy
    });
  }

  async getLeaks(params?: {
    pipelineId?: string;
    status?: LeakEvent['status'];
    severity?: LeakSeverity;
    active?: boolean;
  }): Promise<LeakEvent[]> {
    let leaks = Array.from(this.leaks.values());

    if (params?.pipelineId) {
      leaks = leaks.filter(l => l.pipelineId === params.pipelineId);
    }

    if (params?.status) {
      leaks = leaks.filter(l => l.status === params.status);
    }

    if (params?.severity) {
      leaks = leaks.filter(l => l.severity === params.severity);
    }

    if (params?.active) {
      leaks = leaks.filter(l =>
        l.status !== 'closed' && l.status !== 'repaired'
      );
    }

    return leaks.sort((a, b) => {
      const severityOrder = { catastrophic: 0, major: 1, moderate: 2, minor: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // ==================== Inspection Management ====================

  async scheduleInspection(params: {
    pipelineId: string;
    segmentIds: string[];
    type: InspectionType;
    scheduledDate: Date;
    inspector: InspectorInfo;
  }): Promise<PipelineInspection> {
    const pipeline = this.pipelines.get(params.pipelineId);
    if (!pipeline) throw new Error(`Pipeline not found: ${params.pipelineId}`);

    const inspection: PipelineInspection = {
      id: `insp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pipelineId: params.pipelineId,
      segmentIds: params.segmentIds,
      type: params.type,
      scheduledDate: params.scheduledDate,
      status: 'scheduled',
      inspector: params.inspector,
      findings: [],
      defects: [],
      overallCondition: 'good',
      recommendations: [],
      priorityRepairs: [],
      nextInspection: new Date(params.scheduledDate.getTime() + 365 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.inspections.set(inspection.id, inspection);
    return inspection;
  }

  async completeInspection(inspectionId: string, results: {
    findings: InspectionFinding[];
    defects: DefectRecord[];
    overallCondition: PipelineInspection['overallCondition'];
    recommendations: string[];
  }): Promise<PipelineInspection> {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) throw new Error(`Inspection not found: ${inspectionId}`);

    inspection.status = 'completed';
    inspection.actualDate = new Date();
    inspection.findings = results.findings;
    inspection.defects = results.defects;
    inspection.overallCondition = results.overallCondition;
    inspection.recommendations = results.recommendations;
    inspection.updatedAt = new Date();

    // Update pipeline integrity score
    const pipeline = this.pipelines.get(inspection.pipelineId);
    if (pipeline) {
      const conditionScores = { excellent: 100, good: 80, fair: 60, poor: 40, critical: 20 };
      pipeline.currentConditions.integrity.overallScore = conditionScores[results.overallCondition];
      pipeline.currentConditions.integrity.lastAssessment = new Date();
      pipeline.updatedAt = new Date();

      // Alert if poor/critical condition
      if (results.overallCondition === 'poor' || results.overallCondition === 'critical') {
        await this.createAlert({
          pipelineId: inspection.pipelineId,
          type: 'integrity',
          severity: results.overallCondition === 'critical' ? 'critical' : 'warning',
          title: `Pipeline ${pipeline.name} in ${results.overallCondition} condition`,
          description: `Inspection found ${results.defects.length} defects`
        });
      }
    }

    return inspection;
  }

  async getInspections(params?: {
    pipelineId?: string;
    status?: PipelineInspection['status'];
    type?: InspectionType;
    overdue?: boolean;
  }): Promise<PipelineInspection[]> {
    let inspections = Array.from(this.inspections.values());

    if (params?.pipelineId) {
      inspections = inspections.filter(i => i.pipelineId === params.pipelineId);
    }

    if (params?.status) {
      inspections = inspections.filter(i => i.status === params.status);
    }

    if (params?.type) {
      inspections = inspections.filter(i => i.type === params.type);
    }

    if (params?.overdue) {
      const now = new Date();
      inspections = inspections.filter(i =>
        i.status === 'scheduled' && i.scheduledDate < now
      );
    }

    return inspections.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  // ==================== Alert Management ====================

  private async createAlert(params: Omit<PipelineAlert, 'id' | 'triggeredAt' | 'actions'>): Promise<PipelineAlert> {
    const alert: PipelineAlert = {
      ...params,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      triggeredAt: new Date(),
      actions: this.getAlertActions(params.type, params.severity)
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  private getAlertActions(type: PipelineAlert['type'], severity: AlertSeverity): string[] {
    const actions: string[] = [];

    if (severity === 'emergency' || severity === 'critical') {
      actions.push('Activate emergency response team');
      actions.push('Notify regulatory agency');
      actions.push('Prepare for potential evacuation');
    }

    switch (type) {
      case 'pressure':
        actions.push('Check pressure sensors and readings');
        actions.push('Inspect for leaks or blockages');
        break;
      case 'leak':
        actions.push('Isolate affected section');
        actions.push('Deploy containment measures');
        actions.push('Assess environmental impact');
        break;
      case 'integrity':
        actions.push('Schedule detailed inspection');
        actions.push('Review repair priorities');
        break;
    }

    return actions;
  }

  async getAlerts(params?: {
    pipelineId?: string;
    type?: PipelineAlert['type'];
    severity?: AlertSeverity;
    unresolved?: boolean;
  }): Promise<PipelineAlert[]> {
    let alerts = Array.from(this.alerts.values());

    if (params?.pipelineId) {
      alerts = alerts.filter(a => a.pipelineId === params.pipelineId);
    }

    if (params?.type) {
      alerts = alerts.filter(a => a.type === params.type);
    }

    if (params?.severity) {
      alerts = alerts.filter(a => a.severity === params.severity);
    }

    if (params?.unresolved) {
      alerts = alerts.filter(a => !a.resolvedAt);
    }

    return alerts.sort((a, b) => {
      const severityOrder = { emergency: 0, critical: 1, warning: 2, info: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<PipelineAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = acknowledgedBy;
    return alert;
  }

  async resolveAlert(alertId: string): Promise<PipelineAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.resolvedAt = new Date();
    return alert;
  }

  // ==================== Statistics ====================

  async getStatistics(incidentId?: string): Promise<{
    totalPipelines: number;
    byType: Record<PipelineType, number>;
    byStatus: Record<OperationalStatus, number>;
    totalLength: number;
    activeSensors: number;
    activeLeaks: number;
    activeAlerts: number;
    overdueInspections: number;
    averageIntegrity: number;
    valvesOperational: number;
    valvesTotal: number;
  }> {
    const pipelines = Array.from(this.pipelines.values());
    const sensors = Array.from(this.sensors.values());
    const leaks = await this.getLeaks({ active: true });
    const alerts = await this.getAlerts({ unresolved: true });
    const overdueInspections = await this.getInspections({ overdue: true });

    const byType: Record<PipelineType, number> = {
      natural_gas: 0, crude_oil: 0, refined_products: 0, water: 0,
      wastewater: 0, chemicals: 0, slurry: 0, steam: 0
    };
    const byStatus: Record<OperationalStatus, number> = {
      operational: 0, reduced_flow: 0, shutdown: 0, maintenance: 0, damaged: 0, abandoned: 0
    };

    let totalLength = 0;
    let totalIntegrity = 0;
    let valvesTotal = 0;
    let valvesOperational = 0;

    pipelines.forEach(p => {
      byType[p.type]++;
      byStatus[p.operationalStatus]++;
      totalLength += p.specifications.totalLength;
      totalIntegrity += p.currentConditions.integrity.overallScore;
      valvesTotal += p.valves.length;
      valvesOperational += p.valves.filter(v => v.status !== 'failed').length;
    });

    return {
      totalPipelines: pipelines.length,
      byType,
      byStatus,
      totalLength,
      activeSensors: sensors.filter(s => s.status === 'online' || s.status === 'alarm').length,
      activeLeaks: leaks.length,
      activeAlerts: alerts.length,
      overdueInspections: overdueInspections.length,
      averageIntegrity: pipelines.length > 0 ? Math.round(totalIntegrity / pipelines.length) : 0,
      valvesOperational,
      valvesTotal
    };
  }
}

export const pipelineMonitoringService = PipelineMonitoringService.getInstance();
export default PipelineMonitoringService;
