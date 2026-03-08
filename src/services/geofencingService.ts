// @ts-nocheck
/**
 * Geofencing Service
 * Location-based triggers, zones, and proximity alerts for disaster management
 */

// Zone type
type ZoneType = 'danger' | 'evacuation' | 'safe' | 'shelter' | 'distribution' | 'hospital' | 'checkpoint' | 'restricted' | 'monitoring' | 'custom';

// Zone status
type ZoneStatus = 'active' | 'inactive' | 'pending' | 'expired' | 'archived';

// Alert trigger type
type TriggerType = 'enter' | 'exit' | 'dwell' | 'crossing' | 'proximity';

// Shape type
type ShapeType = 'circle' | 'polygon' | 'rectangle';

// Coordinate
interface Coordinate {
  latitude: number;
  longitude: number;
}

// Geofence zone
interface GeofenceZone {
  id: string;
  name: string;
  description?: string;
  type: ZoneType;
  status: ZoneStatus;
  priority: number;
  shape: GeofenceShape;
  boundingBox: BoundingBox;
  triggers: ZoneTrigger[];
  alertConfig: AlertConfig;
  schedule?: ZoneSchedule;
  capacity?: ZoneCapacity;
  metadata: ZoneMetadata;
  permissions: ZonePermission[];
  parentZoneId?: string;
  childZoneIds: string[];
  relatedAlertId?: string;
  relatedIncidentId?: string;
  tags: string[];
  createdBy: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Geofence shape
interface GeofenceShape {
  type: ShapeType;
  center?: Coordinate;
  radius?: number; // in meters, for circle
  coordinates?: Coordinate[]; // for polygon/rectangle
  innerRadius?: number; // for ring/donut shape
}

// Bounding box
interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Zone trigger
interface ZoneTrigger {
  id: string;
  type: TriggerType;
  dwellTime?: number; // seconds, for dwell trigger
  proximityDistance?: number; // meters, for proximity trigger
  direction?: 'in' | 'out' | 'both'; // for crossing trigger
  cooldown?: number; // seconds between triggers
  conditions?: TriggerCondition[];
  actions: TriggerAction[];
  enabled: boolean;
}

// Trigger condition
interface TriggerCondition {
  field: 'time' | 'day' | 'speed' | 'altitude' | 'accuracy' | 'user_role' | 'custom';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: unknown;
}

// Trigger action
interface TriggerAction {
  type: 'notification' | 'webhook' | 'alert' | 'sms' | 'email' | 'call' | 'log' | 'api_call';
  config: Record<string, unknown>;
  delay?: number; // seconds
}

// Alert config
interface AlertConfig {
  sendPush: boolean;
  sendSms: boolean;
  sendEmail: boolean;
  sendVoice: boolean;
  alertTemplate?: string;
  customMessage?: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  repeatInterval?: number; // minutes
  maxRepeats?: number;
}

// Zone schedule
interface ZoneSchedule {
  type: 'always' | 'scheduled' | 'recurring';
  startTime?: Date;
  endTime?: Date;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    timeRanges?: { start: string; end: string }[];
  };
  timezone: string;
}

// Zone capacity
interface ZoneCapacity {
  maxOccupancy: number;
  currentOccupancy: number;
  alertThreshold: number; // percentage
  overcrowdingAlert: boolean;
}

// Zone metadata
interface ZoneMetadata {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  landmark?: string;
  contactPerson?: string;
  contactPhone?: string;
  facilities?: string[];
  accessibility?: string[];
  operatingHours?: string;
  custom: Record<string, unknown>;
}

// Zone permission
interface ZonePermission {
  principalId: string;
  principalType: 'user' | 'role' | 'group';
  permissions: ('view' | 'edit' | 'delete' | 'manage_triggers' | 'view_events')[];
}

// Device location
interface DeviceLocation {
  deviceId: string;
  userId?: string;
  coordinate: Coordinate;
  altitude?: number;
  accuracy: number; // in meters
  speed?: number; // in m/s
  heading?: number; // in degrees
  battery?: number; // percentage
  timestamp: Date;
  source: 'gps' | 'network' | 'wifi' | 'manual' | 'ip';
  isMoving: boolean;
  currentZones: string[];
  metadata?: Record<string, unknown>;
}

// Geofence event
interface GeofenceEvent {
  id: string;
  type: TriggerType;
  zoneId: string;
  zoneName: string;
  zoneType: ZoneType;
  deviceId: string;
  userId?: string;
  triggerId: string;
  coordinate: Coordinate;
  accuracy: number;
  speed?: number;
  dwellDuration?: number;
  previousZoneId?: string;
  timestamp: Date;
  processed: boolean;
  actionsExecuted: { action: TriggerAction; status: 'success' | 'failed'; error?: string }[];
  metadata?: Record<string, unknown>;
}

// Location history
interface LocationHistory {
  deviceId: string;
  userId?: string;
  locations: {
    coordinate: Coordinate;
    timestamp: Date;
    accuracy: number;
    zoneIds: string[];
  }[];
  startDate: Date;
  endDate: Date;
  totalDistance: number; // meters
  totalTime: number; // seconds
}

// Proximity alert
interface ProximityAlert {
  id: string;
  name: string;
  description?: string;
  sourceType: 'device' | 'zone' | 'poi';
  sourceId: string;
  targetType: 'device' | 'zone' | 'poi';
  targetIds: string[];
  distance: number; // meters
  triggerOn: 'entering' | 'leaving' | 'both';
  alertConfig: AlertConfig;
  enabled: boolean;
  lastTriggered?: Date;
  triggerCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Point of interest
interface PointOfInterest {
  id: string;
  name: string;
  description?: string;
  category: 'hospital' | 'shelter' | 'fire_station' | 'police_station' | 'distribution_center' | 'evacuation_point' | 'landmark' | 'hazard' | 'other';
  coordinate: Coordinate;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  operatingHours?: string;
  capacity?: number;
  currentOccupancy?: number;
  services?: string[];
  accessibility?: string[];
  status: 'operational' | 'limited' | 'closed' | 'unknown';
  verifiedAt?: Date;
  verifiedBy?: string;
  photos?: string[];
  rating?: number;
  reviews?: number;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Route
interface Route {
  id: string;
  name: string;
  description?: string;
  type: 'evacuation' | 'supply' | 'patrol' | 'custom';
  waypoints: Coordinate[];
  distance: number; // meters
  estimatedDuration: number; // seconds
  status: 'active' | 'blocked' | 'congested' | 'unknown';
  blockageInfo?: {
    location: Coordinate;
    reason: string;
    reportedAt: Date;
    reportedBy: string;
  };
  alternativeRouteId?: string;
  zones: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Heatmap data
interface HeatmapData {
  timestamp: Date;
  resolution: 'high' | 'medium' | 'low';
  bounds: BoundingBox;
  points: {
    coordinate: Coordinate;
    weight: number;
    metadata?: Record<string, unknown>;
  }[];
}

// Zone analytics
interface ZoneAnalytics {
  zoneId: string;
  period: { start: Date; end: Date };
  totalEvents: number;
  uniqueDevices: number;
  avgDwellTime: number;
  peakOccupancy: number;
  avgOccupancy: number;
  entryExitRatio: number;
  byEventType: { type: TriggerType; count: number }[];
  byHour: { hour: number; entries: number; exits: number }[];
  byDay: { date: string; entries: number; exits: number; avgOccupancy: number }[];
  hotspots: { coordinate: Coordinate; eventCount: number }[];
}

// Geofencing settings
interface GeofencingSettings {
  defaultRadius: number;
  minAccuracy: number;
  updateInterval: number;
  batchSize: number;
  maxZonesPerDevice: number;
  maxActiveZones: number;
  eventRetention: number; // days
  locationHistoryRetention: number; // days
  enableBackgroundTracking: boolean;
  enableBatteryOptimization: boolean;
}

class GeofencingService {
  private static instance: GeofencingService;
  private zones: Map<string, GeofenceZone> = new Map();
  private deviceLocations: Map<string, DeviceLocation> = new Map();
  private events: GeofenceEvent[] = [];
  private proximityAlerts: Map<string, ProximityAlert> = new Map();
  private pois: Map<string, PointOfInterest> = new Map();
  private routes: Map<string, Route> = new Map();
  private locationHistories: Map<string, LocationHistory> = new Map();
  private settings: GeofencingSettings;
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.settings = {
      defaultRadius: 500,
      minAccuracy: 100,
      updateInterval: 30,
      batchSize: 100,
      maxZonesPerDevice: 50,
      maxActiveZones: 1000,
      eventRetention: 90,
      locationHistoryRetention: 30,
      enableBackgroundTracking: true,
      enableBatteryOptimization: true,
    };
    this.initializeSampleData();
  }

  public static getInstance(): GeofencingService {
    if (!GeofencingService.instance) {
      GeofencingService.instance = new GeofencingService();
    }
    return GeofencingService.instance;
  }

  /**
   * Initialize predefined danger zones
   */
  private initializePredefinedZones(): void {
    PREDEFINED_DANGER_ZONES.forEach((zone, index) => {
      const geofence: Geofence = {
        id: `predefined-${index + 1}`,
        name: zone.name!,
        type: zone.type!,
        geometry: zone.geometry!,
        alertLevel: zone.alertLevel!,
        triggerOnEnter: true,
        triggerOnExit: true,
        triggerOnDwell: false,
        active: true,
        metadata: {
          lastUpdated: new Date(),
        },
      };
      this.geofences.set(geofence.id, geofence);
    });
  }

  /**
   * Create a new geofence
   */
  public createGeofence(geofence: Omit<Geofence, 'id'>): Geofence {
    const id = `geofence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newGeofence: Geofence = {
      ...geofence,
      id,
      metadata: {
        ...geofence.metadata,
        lastUpdated: new Date(),
      },
    };

    this.geofences.set(id, newGeofence);

    // Check if user is already inside
    if (this.lastLocation && newGeofence.active) {
      this.checkGeofence(newGeofence, this.lastLocation);
    }

    this.notifyStatusChange();
    return newGeofence;
  }

  /**
   * Update existing geofence
   */
  public updateGeofence(id: string, updates: Partial<Geofence>): Geofence | null {
    const existing = this.geofences.get(id);
    if (!existing) return null;

    const updated: Geofence = {
      ...existing,
      ...updates,
      id,
      metadata: {
        ...existing.metadata,
        ...updates.metadata,
        lastUpdated: new Date(),
      },
    };

    this.geofences.set(id, updated);
    this.notifyStatusChange();
    return updated;
  }

  /**
   * Delete geofence
   */
  public deleteGeofence(id: string): boolean {
    const deleted = this.geofences.delete(id);
    if (deleted) {
      this.activeGeofences.delete(id);
      this.clearDwellTimer(id);
      this.notifyStatusChange();
    }
    return deleted;
  }

  /**
   * Start monitoring geofences
   */
  public startMonitoring(): boolean {
    if (this.watchId !== null) return true;

    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return false;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.handleLocationUpdate(position),
      (error) => this.handleLocationError(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    this.notifyStatusChange();
    return true;
  }

  /**
   * Stop monitoring
   */
  public stopMonitoring(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    // Clear all dwell timers
    this.dwellTimers.forEach((timer) => clearTimeout(timer));
    this.dwellTimers.clear();

    this.notifyStatusChange();
  }

  /**
   * Handle location update
   */
  private handleLocationUpdate(position: GeolocationPosition): void {
    const location: TrackedLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp),
      speed: position.coords.speed ?? undefined,
      heading: position.coords.heading ?? undefined,
    };

    this.lastLocation = location;

    // Check all active geofences
    this.geofences.forEach((geofence) => {
      if (geofence.active && this.isGeofenceValid(geofence)) {
        this.checkGeofence(geofence, location);
      }
    });

    this.notifyStatusChange();
  }

  /**
   * Handle location error
   */
  private handleLocationError(error: GeolocationPositionError): void {
    console.error('Location error:', error.message);
  }

  /**
   * Check if geofence is valid (within time bounds)
   */
  private isGeofenceValid(geofence: Geofence): boolean {
    const now = new Date();
    if (geofence.validFrom && now < geofence.validFrom) return false;
    if (geofence.validUntil && now > geofence.validUntil) return false;
    return true;
  }

  /**
   * Check single geofence against location
   */
  private checkGeofence(geofence: Geofence, location: TrackedLocation): void {
    const isInside = this.isInsideGeofence(geofence, location);
    const wasInside = this.activeGeofences.has(geofence.id);

    if (isInside && !wasInside) {
      // Entered geofence
      this.activeGeofences.add(geofence.id);

      if (geofence.triggerOnEnter) {
        this.triggerEvent(geofence, 'enter', location);
      }

      if (geofence.triggerOnDwell && geofence.dwellTime) {
        this.startDwellTimer(geofence, location);
      }
    } else if (!isInside && wasInside) {
      // Exited geofence
      this.activeGeofences.delete(geofence.id);
      this.clearDwellTimer(geofence.id);

      if (geofence.triggerOnExit) {
        this.triggerEvent(geofence, 'exit', location);
      }
    }
  }

  /**
   * Check if location is inside geofence
   */
  private isInsideGeofence(geofence: Geofence, location: TrackedLocation): boolean {
    switch (geofence.geometry.type) {
      case 'circle':
        return this.isInsideCircle(geofence.geometry, location);
      case 'polygon':
        return this.isInsidePolygon(geofence.geometry, location);
      case 'corridor':
        return this.isInsideCorridor(geofence.geometry, location);
      default:
        return false;
    }
  }

  /**
   * Check if inside circle geofence
   */
  private isInsideCircle(geometry: CircleGeometry, location: TrackedLocation): boolean {
    const distance = this.calculateDistance(
      location.latitude,
      location.longitude,
      geometry.center.latitude,
      geometry.center.longitude
    );
    return distance <= geometry.radius;
  }

  /**
   * Check if inside polygon geofence (Ray casting algorithm)
   */
  private isInsidePolygon(geometry: PolygonGeometry, location: TrackedLocation): boolean {
    const { latitude: y, longitude: x } = location;
    const polygon = geometry.coordinates;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].longitude;
      const yi = polygon[i].latitude;
      const xj = polygon[j].longitude;
      const yj = polygon[j].latitude;

      const intersect =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Create zone
   */
  public createZone(data: Omit<GeofenceZone, 'id' | 'boundingBox' | 'childZoneIds' | 'createdAt' | 'updatedAt'>): GeofenceZone {
    const id = `zone-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

    const boundingBox = this.calculateBoundingBox(data.shape);

    const zone: GeofenceZone = {
      ...data,
      id,
      boundingBox,
      childZoneIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.zones.set(id, zone);
    this.emit('zone_created', zone);

    return zone;
  }

  /**
   * Calculate bounding box
   */
  private calculateBoundingBox(shape: GeofenceShape): BoundingBox {
    if (shape.type === 'circle' && shape.center && shape.radius) {
      const latDelta = (shape.radius / 111320);
      const lonDelta = shape.radius / (111320 * Math.cos(this.toRadians(shape.center.latitude)));
      return {
        north: shape.center.latitude + latDelta,
        south: shape.center.latitude - latDelta,
        east: shape.center.longitude + lonDelta,
        west: shape.center.longitude - lonDelta,
      };
    }

    if (shape.coordinates && shape.coordinates.length > 0) {
      const lats = shape.coordinates.map((c) => c.latitude);
      const lons = shape.coordinates.map((c) => c.longitude);
      return {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lons),
        west: Math.min(...lons),
      };
    }

    return { north: 0, south: 0, east: 0, west: 0 };
  }

  /**
   * Update zone
   */
  public updateZone(zoneId: string, updates: Partial<Omit<GeofenceZone, 'id' | 'createdAt' | 'updatedAt'>>): GeofenceZone | null {
    const zone = this.zones.get(zoneId);
    if (!zone) return null;

    Object.assign(zone, updates);

    if (updates.shape) {
      zone.boundingBox = this.calculateBoundingBox(updates.shape);
    }

    zone.updatedAt = new Date();

    this.emit('zone_updated', zone);
    return zone;
  }

  /**
   * Delete zone
   */
  public deleteZone(zoneId: string): boolean {
    const zone = this.zones.get(zoneId);
    if (!zone) return false;

    this.zones.delete(zoneId);
    this.emit('zone_deleted', { zoneId });

    return true;
  }

  /**
   * Get zone
   */
  public getZone(zoneId: string): GeofenceZone | undefined {
    return this.zones.get(zoneId);
  }

  /**
   * Get zones
   */
  public getZones(filters?: {
    type?: ZoneType;
    status?: ZoneStatus;
    bounds?: BoundingBox;
    tags?: string[];
  }): GeofenceZone[] {
    let zones = Array.from(this.zones.values());

    if (filters?.type) {
      zones = zones.filter((z) => z.type === filters.type);
    }

    if (filters?.status) {
      zones = zones.filter((z) => z.status === filters.status);
    }

    if (filters?.bounds) {
      zones = zones.filter((z) => this.boundingBoxesOverlap(z.boundingBox, filters.bounds!));
    }

    if (filters?.tags?.length) {
      zones = zones.filter((z) => filters.tags!.some((tag) => z.tags.includes(tag)));
    }

    return zones.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Check if bounding boxes overlap
   */
  private boundingBoxesOverlap(box1: BoundingBox, box2: BoundingBox): boolean {
    return !(
      box1.east < box2.west ||
      box1.west > box2.east ||
      box1.north < box2.south ||
      box1.south > box2.north
    );
  }

  /**
   * Update device location
   */
  public updateDeviceLocation(data: {
    deviceId: string;
    userId?: string;
    coordinate: Coordinate;
    accuracy: number;
    altitude?: number;
    speed?: number;
    heading?: number;
    battery?: number;
    source?: DeviceLocation['source'];
  }): { location: DeviceLocation; events: GeofenceEvent[] } {
    const previousLocation = this.deviceLocations.get(data.deviceId);
    const previousZones = previousLocation?.currentZones || [];

    const currentZones: string[] = [];
    const events: GeofenceEvent[] = [];

    // Check which zones the device is now in
    this.zones.forEach((zone, zoneId) => {
      if (zone.status !== 'active') return;

      const isInZone = this.isPointInZone(data.coordinate, zone);

      if (isInZone) {
        currentZones.push(zoneId);

        // Check for enter event
        if (!previousZones.includes(zoneId)) {
          const enterTriggers = zone.triggers.filter((t) => t.type === 'enter' && t.enabled);
          enterTriggers.forEach((trigger) => {
            const event = this.createEvent('enter', zone, zoneId, data, trigger);
            events.push(event);
          });
        }
      } else if (previousZones.includes(zoneId)) {
        // Check for exit event
        const exitTriggers = zone.triggers.filter((t) => t.type === 'exit' && t.enabled);
        exitTriggers.forEach((trigger) => {
          const event = this.createEvent('exit', zone, zoneId, data, trigger);
          events.push(event);
        });
      }
    });

    const location: DeviceLocation = {
      deviceId: data.deviceId,
      userId: data.userId,
      coordinate: data.coordinate,
      altitude: data.altitude,
      accuracy: data.accuracy,
      speed: data.speed,
      heading: data.heading,
      battery: data.battery,
      timestamp: new Date(),
      source: data.source || 'gps',
      isMoving: (data.speed || 0) > 0.5,
      currentZones,
    };

    this.deviceLocations.set(data.deviceId, location);

    // Process events
    events.forEach((event) => {
      this.events.push(event);
      this.emit('geofence_event', event);
    });

    return { location, events };
  }

  /**
   * Create event
   */
  private createEvent(
    type: TriggerType,
    zone: GeofenceZone,
    zoneId: string,
    locationData: { deviceId: string; userId?: string; coordinate: Coordinate; accuracy: number; speed?: number },
    trigger: ZoneTrigger
  ): GeofenceEvent {
    return {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      type,
      zoneId,
      zoneName: zone.name,
      zoneType: zone.type,
      deviceId: locationData.deviceId,
      userId: locationData.userId,
      triggerId: trigger.id,
      coordinate: locationData.coordinate,
      accuracy: locationData.accuracy,
      speed: locationData.speed,
      timestamp: new Date(),
      processed: false,
      actionsExecuted: [],
    };
  }

  /**
   * Get device location
   */
  public getDeviceLocation(deviceId: string): DeviceLocation | undefined {
    return this.deviceLocations.get(deviceId);
  }

  /**
   * Get devices in zone
   */
  public getDevicesInZone(zoneId: string): DeviceLocation[] {
    return Array.from(this.deviceLocations.values())
      .filter((loc) => loc.currentZones.includes(zoneId));
  }

  /**
   * Get events
   */
  public getEvents(filters?: {
    zoneId?: string;
    deviceId?: string;
    type?: TriggerType;
    dateRange?: { start: Date; end: Date };
  }, page: number = 1, pageSize: number = 50): { events: GeofenceEvent[]; total: number } {
    let events = [...this.events];

    if (filters?.zoneId) {
      events = events.filter((e) => e.zoneId === filters.zoneId);
    }

    if (filters?.deviceId) {
      events = events.filter((e) => e.deviceId === filters.deviceId);
    }

    if (filters?.type) {
      events = events.filter((e) => e.type === filters.type);
    }

    if (filters?.dateRange) {
      events = events.filter((e) =>
        e.timestamp >= filters.dateRange!.start && e.timestamp <= filters.dateRange!.end
      );
    }

    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = events.length;
    const startIndex = (page - 1) * pageSize;

    return {
      events: events.slice(startIndex, startIndex + pageSize),
      total,
    };
  }

  /**
   * Get zone analytics
   */
  public getZoneAnalytics(zoneId: string, period: { start: Date; end: Date }): ZoneAnalytics {
    const zoneEvents = this.events.filter(
      (e) => e.zoneId === zoneId && e.timestamp >= period.start && e.timestamp <= period.end
    );

    const uniqueDevices = new Set(zoneEvents.map((e) => e.deviceId)).size;
    const dwellEvents = zoneEvents.filter((e) => e.type === 'dwell' && e.dwellDuration);
    const avgDwellTime = dwellEvents.length > 0
      ? dwellEvents.reduce((sum, e) => sum + (e.dwellDuration || 0), 0) / dwellEvents.length
      : 0;

    const byEventType = new Map<TriggerType, number>();
    const byHour = new Map<number, { entries: number; exits: number }>();
    const byDay = new Map<string, { entries: number; exits: number; avgOccupancy: number }>();

    zoneEvents.forEach((event) => {
      byEventType.set(event.type, (byEventType.get(event.type) || 0) + 1);

      const hour = event.timestamp.getHours();
      const hourStats = byHour.get(hour) || { entries: 0, exits: 0 };
      if (event.type === 'enter') hourStats.entries++;
      if (event.type === 'exit') hourStats.exits++;
      byHour.set(hour, hourStats);

      const day = event.timestamp.toISOString().split('T')[0];
      const dayStats = byDay.get(day) || { entries: 0, exits: 0, avgOccupancy: 0 };
      if (event.type === 'enter') dayStats.entries++;
      if (event.type === 'exit') dayStats.exits++;
      byDay.set(day, dayStats);
    });

    const entries = zoneEvents.filter((e) => e.type === 'enter').length;
    const exits = zoneEvents.filter((e) => e.type === 'exit').length;

    return {
      zoneId,
      period,
      totalEvents: zoneEvents.length,
      uniqueDevices,
      avgDwellTime,
      peakOccupancy: Math.max(...Array.from(byHour.values()).map((h) => h.entries - h.exits)),
      avgOccupancy: uniqueDevices / Math.max(1, (period.end.getTime() - period.start.getTime()) / (24 * 60 * 60 * 1000)),
      entryExitRatio: exits > 0 ? entries / exits : entries,
      byEventType: Array.from(byEventType.entries()).map(([type, count]) => ({ type, count })),
      byHour: Array.from(byHour.entries()).map(([hour, stats]) => ({ hour, ...stats })),
      byDay: Array.from(byDay.entries()).map(([date, stats]) => ({ date, ...stats })),
      hotspots: [],
    };
  }

  /**
   * Get POIs
   */
  public getPOIs(filters?: {
    category?: PointOfInterest['category'];
    bounds?: BoundingBox;
    status?: PointOfInterest['status'];
  }): PointOfInterest[] {
    let pois = Array.from(this.pois.values());

    if (filters?.category) {
      pois = pois.filter((p) => p.category === filters.category);
    }

    if (filters?.status) {
      pois = pois.filter((p) => p.status === filters.status);
    }

    if (filters?.bounds) {
      pois = pois.filter((p) =>
        p.coordinate.latitude >= filters.bounds!.south &&
        p.coordinate.latitude <= filters.bounds!.north &&
        p.coordinate.longitude >= filters.bounds!.west &&
        p.coordinate.longitude <= filters.bounds!.east
      );
    }

    return pois;
  }

  /**
   * Find nearest POIs
   */
  public findNearestPOIs(coordinate: Coordinate, category?: PointOfInterest['category'], limit: number = 5): { poi: PointOfInterest; distance: number }[] {
    let pois = Array.from(this.pois.values());

    if (category) {
      pois = pois.filter((p) => p.category === category);
    }

    return pois
      .map((poi) => ({
        poi,
        distance: this.calculateDistance(coordinate, poi.coordinate),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }

  /**
   * Get routes
   */
  public getRoutes(type?: Route['type']): Route[] {
    let routes = Array.from(this.routes.values());
    if (type) {
      routes = routes.filter((r) => r.type === type);
    }
    return routes;
  }

  /**
   * Generate heatmap data
   */
  public generateHeatmap(bounds: BoundingBox, resolution: 'high' | 'medium' | 'low'): HeatmapData {
    const points: HeatmapData['points'] = [];

    this.events.forEach((event) => {
      if (
        event.coordinate.latitude >= bounds.south &&
        event.coordinate.latitude <= bounds.north &&
        event.coordinate.longitude >= bounds.west &&
        event.coordinate.longitude <= bounds.east
      ) {
        points.push({
          coordinate: event.coordinate,
          weight: event.type === 'dwell' ? 2 : 1,
        });
      }
    });

    return {
      timestamp: new Date(),
      resolution,
      bounds,
      points,
    };
  }

  /**
   * Get settings
   */
  public getSettings(): GeofencingSettings {
    return { ...this.settings };
  }

  /**
   * Update settings
   */
  public updateSettings(updates: Partial<GeofencingSettings>): void {
    Object.assign(this.settings, updates);
    this.emit('settings_updated', this.settings);
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

export const geofencingService = GeofencingService.getInstance();
export type {
  ZoneType,
  ZoneStatus,
  TriggerType,
  ShapeType,
  Coordinate,
  GeofenceZone,
  GeofenceShape,
  BoundingBox,
  ZoneTrigger,
  TriggerCondition,
  TriggerAction,
  AlertConfig,
  ZoneSchedule,
  ZoneCapacity,
  ZoneMetadata,
  ZonePermission,
  DeviceLocation,
  GeofenceEvent,
  LocationHistory,
  ProximityAlert,
  PointOfInterest,
  Route,
  HeatmapData,
  ZoneAnalytics,
  GeofencingSettings,
};
