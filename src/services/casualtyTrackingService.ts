// @ts-nocheck
/**
 * Casualty Tracking Service - Issue #132 Implementation
 * 
 * Provides comprehensive casualty tracking and management for mass casualty
 * incidents including victim identification, status tracking, family reunification,
 * morgue operations, and coordination with medical examiner/coroner offices.
 */

// Type definitions
type CasualtyStatus = 'missing' | 'located' | 'injured' | 'hospitalized' | 'deceased' | 'recovered' | 'reunified';
type InjurySeverity = 'minor' | 'moderate' | 'serious' | 'critical' | 'fatal';
type IdentificationMethod = 'visual' | 'personal_effects' | 'fingerprint' | 'dental' | 'dna' | 'medical_records' | 'family_confirmation' | 'other';
type SearchStatus = 'not_started' | 'in_progress' | 'completed' | 'suspended';
type NotificationStatus = 'pending' | 'in_progress' | 'completed' | 'unable_to_notify';

// Casualty interfaces
interface Casualty {
  id: string;
  trackingNumber: string;
  incidentId: string;
  status: CasualtyStatus;
  identificationStatus: 'unidentified' | 'tentative' | 'confirmed';
  personalInfo?: PersonalInfo;
  physicalDescription: PhysicalDescription;
  locationInfo: LocationInfo;
  medicalInfo?: MedicalInfo;
  identificationInfo: IdentificationInfo;
  familyInfo: FamilyInfo;
  timeline: CasualtyEvent[];
  attachments: Attachment[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  aliases?: string[];
  dateOfBirth?: Date;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  nationality?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  occupation?: string;
  employer?: string;
  ssn?: string; // Last 4 only for partial matching
}

interface PhysicalDescription {
  height?: { value: number; unit: 'cm' | 'in' };
  weight?: { value: number; unit: 'kg' | 'lb' };
  hairColor?: string;
  eyeColor?: string;
  skinTone?: string;
  build?: 'thin' | 'average' | 'athletic' | 'heavy';
  distinguishingMarks?: DistinguishingMark[];
  clothing?: ClothingItem[];
  personalEffects?: PersonalEffect[];
}

interface DistinguishingMark {
  type: 'tattoo' | 'scar' | 'birthmark' | 'piercing' | 'prosthetic' | 'other';
  location: string;
  description: string;
  imageId?: string;
}

interface ClothingItem {
  type: string;
  color: string;
  brand?: string;
  size?: string;
  description: string;
}

interface PersonalEffect {
  type: string;
  description: string;
  serialNumber?: string;
  condition: string;
  evidenceTagNumber?: string;
}

interface LocationInfo {
  lastKnownLocation?: {
    description: string;
    coordinates?: { lat: number; lon: number };
    timestamp?: Date;
    source: string;
  };
  foundLocation?: {
    description: string;
    coordinates?: { lat: number; lon: number };
    timestamp: Date;
    foundBy: string;
  };
  currentLocation?: {
    type: 'scene' | 'hospital' | 'morgue' | 'shelter' | 'home' | 'other';
    facility?: string;
    address?: string;
  };
  searchArea?: {
    description: string;
    sectors: string[];
    status: SearchStatus;
  };
}

interface MedicalInfo {
  injuries: Injury[];
  severity: InjurySeverity;
  treatmentFacility?: string;
  admissionTime?: Date;
  dischargeTime?: Date;
  medicalRecordNumber?: string;
  treatingPhysician?: string;
  condition: 'stable' | 'serious' | 'critical' | 'deceased';
  causeOfDeath?: string;
  timeOfDeath?: Date;
  pronouncedBy?: string;
}

interface Injury {
  type: string;
  bodyPart: string;
  severity: InjurySeverity;
  description: string;
  treatment?: string;
}

interface IdentificationInfo {
  status: Casualty['identificationStatus'];
  methods: IdentificationAttempt[];
  documents: IdentificationDocument[];
  biometrics?: BiometricData;
  dentalRecords?: DentalRecordMatch;
  dnaProfile?: DNAProfile;
  confirmedBy?: string;
  confirmedAt?: Date;
}

interface IdentificationAttempt {
  method: IdentificationMethod;
  performedBy: string;
  performedAt: Date;
  result: 'positive' | 'negative' | 'inconclusive' | 'pending';
  confidence?: number;
  notes: string;
}

interface IdentificationDocument {
  type: 'drivers_license' | 'passport' | 'id_card' | 'military_id' | 'other';
  documentNumber?: string;
  issuingAuthority?: string;
  name?: string;
  dateOfBirth?: Date;
  photo?: string;
  verified: boolean;
}

interface BiometricData {
  fingerprints?: {
    available: boolean;
    quality: 'good' | 'partial' | 'poor';
    matchAttempted: boolean;
    matchResult?: 'matched' | 'no_match' | 'pending';
  };
  faceRecognition?: {
    available: boolean;
    photoId?: string;
    matchAttempted: boolean;
    matchResult?: 'matched' | 'no_match' | 'pending';
  };
}

interface DentalRecordMatch {
  recordsObtained: boolean;
  source?: string;
  comparisonPerformed: boolean;
  result?: 'matched' | 'no_match' | 'inconclusive';
  comparedBy?: string;
  comparedAt?: Date;
}

interface DNAProfile {
  sampleCollected: boolean;
  sampleType?: 'blood' | 'tissue' | 'bone' | 'tooth' | 'hair';
  collectedAt?: Date;
  profileGenerated: boolean;
  familyReferenceCollected: boolean;
  comparisonResult?: 'matched' | 'no_match' | 'pending';
  laboratory?: string;
}

interface FamilyInfo {
  contacts: FamilyContact[];
  reunificationStatus: 'not_applicable' | 'pending' | 'in_progress' | 'completed';
  notificationStatus: NotificationStatus;
  notificationHistory: NotificationRecord[];
  assignedLiaison?: string;
}

interface FamilyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimaryContact: boolean;
  isNextOfKin: boolean;
  canIdentify: boolean;
  notified: boolean;
  notifiedAt?: Date;
  notifiedBy?: string;
  notes?: string;
}

interface NotificationRecord {
  contactId: string;
  method: 'phone' | 'in_person' | 'email';
  attemptedAt: Date;
  attemptedBy: string;
  result: 'successful' | 'no_answer' | 'wrong_number' | 'message_left' | 'declined';
  notes?: string;
}

interface CasualtyEvent {
  id: string;
  timestamp: Date;
  type: 'created' | 'located' | 'identified' | 'status_change' | 'medical_update' | 'family_notified' | 'reunified' | 'transferred' | 'note';
  description: string;
  actor: string;
  details?: Record<string, any>;
}

interface Attachment {
  id: string;
  type: 'photo' | 'document' | 'dental_xray' | 'fingerprint' | 'other';
  name: string;
  mimeType: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  classification: 'public' | 'restricted' | 'confidential';
}

// Missing person interfaces
interface MissingPersonReport {
  id: string;
  incidentId: string;
  reportedBy: FamilyContact;
  missingPerson: {
    name: string;
    dateOfBirth?: Date;
    gender?: string;
    physicalDescription: PhysicalDescription;
    lastKnownLocation?: string;
    lastContact?: Date;
    medicalConditions?: string[];
    medications?: string[];
  };
  circumstances: string;
  searchEfforts: SearchEffort[];
  status: 'open' | 'located' | 'closed';
  linkedCasualtyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SearchEffort {
  id: string;
  type: 'ground' | 'air' | 'k9' | 'technical' | 'canvassing';
  area: string;
  startTime: Date;
  endTime?: Date;
  teamLeader: string;
  teamSize: number;
  findings: string;
  status: SearchStatus;
}

// Facility interfaces
interface MorgueFacility {
  id: string;
  name: string;
  type: 'permanent' | 'temporary' | 'mobile';
  address: string;
  coordinates?: { lat: number; lon: number };
  capacity: number;
  currentOccupancy: number;
  refrigerationCapacity: number;
  services: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  status: 'operational' | 'limited' | 'full' | 'closed';
}

interface FamilyAssistanceCenter {
  id: string;
  name: string;
  incidentId: string;
  address: string;
  coordinates?: { lat: number; lon: number };
  services: string[];
  staffAssigned: number;
  familiesServed: number;
  operatingHours: { open: string; close: string };
  contact: string;
  status: 'setup' | 'operational' | 'closing' | 'closed';
}

// Report interfaces
interface CasualtyReport {
  incidentId: string;
  incidentName: string;
  reportDate: Date;
  summary: {
    totalCasualties: number;
    byStatus: Record<CasualtyStatus, number>;
    byIdentificationStatus: Record<string, number>;
    bySeverity: Record<InjurySeverity, number>;
  };
  facilities: {
    hospitals: { name: string; patients: number }[];
    morgues: { name: string; decedents: number }[];
  };
  familyAssistance: {
    familiesRegistered: number;
    familiesNotified: number;
    reunificationsCompleted: number;
  };
  pendingActions: string[];
}

// Sample data
const sampleCasualties: Casualty[] = [
  {
    id: 'casualty-001',
    trackingNumber: 'MCI-2024-001-0001',
    incidentId: 'incident-001',
    status: 'hospitalized',
    identificationStatus: 'confirmed',
    personalInfo: {
      firstName: 'Jane',
      lastName: 'Doe',
      age: 35,
      gender: 'female'
    },
    physicalDescription: {
      height: { value: 165, unit: 'cm' },
      weight: { value: 60, unit: 'kg' },
      hairColor: 'Brown',
      eyeColor: 'Blue',
      build: 'average'
    },
    locationInfo: {
      currentLocation: {
        type: 'hospital',
        facility: 'Metro General Hospital'
      }
    },
    medicalInfo: {
      injuries: [{ type: 'Fracture', bodyPart: 'Left arm', severity: 'moderate', description: 'Closed fracture of radius' }],
      severity: 'moderate',
      treatmentFacility: 'Metro General Hospital',
      condition: 'stable'
    },
    identificationInfo: {
      status: 'confirmed',
      methods: [{ method: 'personal_effects', performedBy: 'Officer Smith', performedAt: new Date(), result: 'positive', notes: 'ID found in wallet' }],
      documents: [{ type: 'drivers_license', verified: true }]
    },
    familyInfo: {
      contacts: [],
      reunificationStatus: 'not_applicable',
      notificationStatus: 'completed',
      notificationHistory: []
    },
    timeline: [{ id: 'event-001', timestamp: new Date(), type: 'created', description: 'Casualty record created', actor: 'System' }],
    attachments: [],
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class CasualtyTrackingService {
  private static instance: CasualtyTrackingService;
  private casualties: Map<string, Casualty> = new Map();
  private missingReports: Map<string, MissingPersonReport> = new Map();
  private morgues: Map<string, MorgueFacility> = new Map();
  private familyAssistanceCenters: Map<string, FamilyAssistanceCenter> = new Map();
  private casualtyCounter: Map<string, number> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CasualtyTrackingService {
    if (!CasualtyTrackingService.instance) {
      CasualtyTrackingService.instance = new CasualtyTrackingService();
    }
    return CasualtyTrackingService.instance;
  }

  private initializeSampleData(): void {
    sampleCasualties.forEach(c => this.casualties.set(c.id, c));
  }

  private generateTrackingNumber(incidentId: string): string {
    const count = (this.casualtyCounter.get(incidentId) || 0) + 1;
    this.casualtyCounter.set(incidentId, count);
    const year = new Date().getFullYear();
    return `MCI-${year}-${incidentId.substring(0, 3).toUpperCase()}-${String(count).padStart(4, '0')}`;
  }

  // ==================== Casualty Management ====================

  async registerCasualty(params: {
    incidentId: string;
    status: CasualtyStatus;
    personalInfo?: PersonalInfo;
    physicalDescription: PhysicalDescription;
    locationInfo: Partial<LocationInfo>;
    medicalInfo?: Partial<MedicalInfo>;
    foundBy?: string;
  }): Promise<Casualty> {
    const casualty: Casualty = {
      id: `casualty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      trackingNumber: this.generateTrackingNumber(params.incidentId),
      incidentId: params.incidentId,
      status: params.status,
      identificationStatus: params.personalInfo?.firstName ? 'tentative' : 'unidentified',
      personalInfo: params.personalInfo,
      physicalDescription: params.physicalDescription,
      locationInfo: {
        ...params.locationInfo,
        foundLocation: params.locationInfo.foundLocation || {
          description: 'Incident scene',
          timestamp: new Date(),
          foundBy: params.foundBy || 'First responder'
        }
      } as LocationInfo,
      medicalInfo: params.medicalInfo ? {
        ...params.medicalInfo,
        injuries: params.medicalInfo.injuries || [],
        severity: params.medicalInfo.severity || 'moderate',
        condition: params.medicalInfo.condition || 'stable'
      } as MedicalInfo : undefined,
      identificationInfo: {
        status: params.personalInfo?.firstName ? 'tentative' : 'unidentified',
        methods: [],
        documents: []
      },
      familyInfo: {
        contacts: [],
        reunificationStatus: 'not_applicable',
        notificationStatus: 'pending',
        notificationHistory: []
      },
      timeline: [{
        id: `event-${Date.now()}`,
        timestamp: new Date(),
        type: 'created',
        description: 'Casualty registered',
        actor: params.foundBy || 'System'
      }],
      attachments: [],
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.casualties.set(casualty.id, casualty);
    return casualty;
  }

  async getCasualty(casualtyId: string): Promise<Casualty | null> {
    return this.casualties.get(casualtyId) || null;
  }

  async getCasualtyByTrackingNumber(trackingNumber: string): Promise<Casualty | null> {
    return Array.from(this.casualties.values())
      .find(c => c.trackingNumber === trackingNumber) || null;
  }

  async updateCasualtyStatus(casualtyId: string, status: CasualtyStatus, actor: string, notes?: string): Promise<Casualty> {
    const casualty = this.casualties.get(casualtyId);
    if (!casualty) throw new Error(`Casualty not found: ${casualtyId}`);

    casualty.status = status;
    casualty.updatedAt = new Date();
    casualty.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'status_change',
      description: `Status changed to ${status}${notes ? `: ${notes}` : ''}`,
      actor
    });

    return casualty;
  }

  async updateMedicalInfo(casualtyId: string, medicalInfo: Partial<MedicalInfo>, actor: string): Promise<Casualty> {
    const casualty = this.casualties.get(casualtyId);
    if (!casualty) throw new Error(`Casualty not found: ${casualtyId}`);

    if (!casualty.medicalInfo) {
      casualty.medicalInfo = {
        injuries: [],
        severity: 'minor',
        condition: 'stable'
      };
    }

    Object.assign(casualty.medicalInfo, medicalInfo);
    casualty.updatedAt = new Date();
    casualty.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'medical_update',
      description: `Medical information updated`,
      actor,
      details: medicalInfo
    });

    return casualty;
  }

  async searchCasualties(query: {
    incidentId?: string;
    status?: CasualtyStatus[];
    identificationStatus?: Casualty['identificationStatus'][];
    name?: string;
    ageRange?: { min: number; max: number };
    gender?: string;
    facility?: string;
  }): Promise<Casualty[]> {
    let casualties = Array.from(this.casualties.values());

    if (query.incidentId) {
      casualties = casualties.filter(c => c.incidentId === query.incidentId);
    }

    if (query.status && query.status.length > 0) {
      casualties = casualties.filter(c => query.status!.includes(c.status));
    }

    if (query.identificationStatus && query.identificationStatus.length > 0) {
      casualties = casualties.filter(c => query.identificationStatus!.includes(c.identificationStatus));
    }

    if (query.name) {
      const nameLower = query.name.toLowerCase();
      casualties = casualties.filter(c =>
        c.personalInfo?.firstName?.toLowerCase().includes(nameLower) ||
        c.personalInfo?.lastName?.toLowerCase().includes(nameLower)
      );
    }

    if (query.ageRange) {
      casualties = casualties.filter(c =>
        c.personalInfo?.age !== undefined &&
        c.personalInfo.age >= query.ageRange!.min &&
        c.personalInfo.age <= query.ageRange!.max
      );
    }

    if (query.gender) {
      casualties = casualties.filter(c => c.personalInfo?.gender === query.gender);
    }

    if (query.facility) {
      casualties = casualties.filter(c =>
        c.locationInfo.currentLocation?.facility?.toLowerCase().includes(query.facility!.toLowerCase()) ||
        c.medicalInfo?.treatmentFacility?.toLowerCase().includes(query.facility!.toLowerCase())
      );
    }

    return casualties.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  // ==================== Identification ====================

  async recordIdentificationAttempt(casualtyId: string, attempt: Omit<IdentificationAttempt, 'performedAt'>): Promise<Casualty> {
    const casualty = this.casualties.get(casualtyId);
    if (!casualty) throw new Error(`Casualty not found: ${casualtyId}`);

    casualty.identificationInfo.methods.push({
      ...attempt,
      performedAt: new Date()
    });

    // Update identification status based on result
    if (attempt.result === 'positive') {
      if (attempt.method === 'dna' || attempt.method === 'fingerprint' || attempt.method === 'dental') {
        casualty.identificationStatus = 'confirmed';
        casualty.identificationInfo.status = 'confirmed';
      } else if (casualty.identificationStatus === 'unidentified') {
        casualty.identificationStatus = 'tentative';
        casualty.identificationInfo.status = 'tentative';
      }
    }

    casualty.updatedAt = new Date();
    casualty.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'identified',
      description: `Identification attempt: ${attempt.method} - ${attempt.result}`,
      actor: attempt.performedBy
    });

    return casualty;
  }

  async confirmIdentification(casualtyId: string, confirmedBy: string, method: IdentificationMethod): Promise<Casualty> {
    const casualty = this.casualties.get(casualtyId);
    if (!casualty) throw new Error(`Casualty not found: ${casualtyId}`);

    casualty.identificationStatus = 'confirmed';
    casualty.identificationInfo.status = 'confirmed';
    casualty.identificationInfo.confirmedBy = confirmedBy;
    casualty.identificationInfo.confirmedAt = new Date();
    casualty.updatedAt = new Date();

    casualty.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'identified',
      description: `Identity confirmed via ${method}`,
      actor: confirmedBy
    });

    return casualty;
  }

  async addDocument(casualtyId: string, document: IdentificationDocument): Promise<Casualty> {
    const casualty = this.casualties.get(casualtyId);
    if (!casualty) throw new Error(`Casualty not found: ${casualtyId}`);

    casualty.identificationInfo.documents.push(document);

    // Update personal info from document if available
    if (document.verified && document.name && !casualty.personalInfo?.lastName) {
      const nameParts = document.name.split(' ');
      casualty.personalInfo = {
        ...casualty.personalInfo,
        firstName: nameParts[0],
        lastName: nameParts[nameParts.length - 1],
        dateOfBirth: document.dateOfBirth
      };

      if (casualty.identificationStatus === 'unidentified') {
        casualty.identificationStatus = 'tentative';
        casualty.identificationInfo.status = 'tentative';
      }
    }

    casualty.updatedAt = new Date();
    return casualty;
  }

  // ==================== Family Management ====================

  async addFamilyContact(casualtyId: string, contact: Omit<FamilyContact, 'id' | 'notified'>): Promise<FamilyContact> {
    const casualty = this.casualties.get(casualtyId);
    if (!casualty) throw new Error(`Casualty not found: ${casualtyId}`);

    const newContact: FamilyContact = {
      ...contact,
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      notified: false
    };

    casualty.familyInfo.contacts.push(newContact);
    casualty.updatedAt = new Date();

    return newContact;
  }

  async recordNotificationAttempt(casualtyId: string, contactId: string, notification: Omit<NotificationRecord, 'contactId'>): Promise<Casualty> {
    const casualty = this.casualties.get(casualtyId);
    if (!casualty) throw new Error(`Casualty not found: ${casualtyId}`);

    const contact = casualty.familyInfo.contacts.find(c => c.id === contactId);
    if (!contact) throw new Error(`Contact not found: ${contactId}`);

    casualty.familyInfo.notificationHistory.push({
      ...notification,
      contactId
    });

    if (notification.result === 'successful') {
      contact.notified = true;
      contact.notifiedAt = notification.attemptedAt;
      contact.notifiedBy = notification.attemptedBy;

      // Update overall notification status
      const allNotified = casualty.familyInfo.contacts
        .filter(c => c.isNextOfKin)
        .every(c => c.notified);

      if (allNotified) {
        casualty.familyInfo.notificationStatus = 'completed';
      } else {
        casualty.familyInfo.notificationStatus = 'in_progress';
      }

      casualty.timeline.push({
        id: `event-${Date.now()}`,
        timestamp: new Date(),
        type: 'family_notified',
        description: `Family member ${contact.name} notified`,
        actor: notification.attemptedBy
      });
    }

    casualty.updatedAt = new Date();
    return casualty;
  }

  async recordReunification(casualtyId: string, reunifiedWith: string, actor: string): Promise<Casualty> {
    const casualty = this.casualties.get(casualtyId);
    if (!casualty) throw new Error(`Casualty not found: ${casualtyId}`);

    casualty.status = 'reunified';
    casualty.familyInfo.reunificationStatus = 'completed';
    casualty.updatedAt = new Date();

    casualty.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'reunified',
      description: `Reunified with ${reunifiedWith}`,
      actor
    });

    return casualty;
  }

  // ==================== Missing Person Reports ====================

  async createMissingPersonReport(params: {
    incidentId: string;
    reportedBy: Omit<FamilyContact, 'id' | 'notified'>;
    missingPerson: MissingPersonReport['missingPerson'];
    circumstances: string;
  }): Promise<MissingPersonReport> {
    const report: MissingPersonReport = {
      id: `missing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId: params.incidentId,
      reportedBy: {
        ...params.reportedBy,
        id: `contact-${Date.now()}`,
        notified: false
      },
      missingPerson: params.missingPerson,
      circumstances: params.circumstances,
      searchEfforts: [],
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.missingReports.set(report.id, report);

    // Attempt to match with existing unidentified casualties
    await this.attemptMatchWithCasualties(report);

    return report;
  }

  private async attemptMatchWithCasualties(report: MissingPersonReport): Promise<Casualty[]> {
    const potentialMatches: Casualty[] = [];
    const casualties = Array.from(this.casualties.values())
      .filter(c => c.incidentId === report.incidentId && c.identificationStatus !== 'confirmed');

    for (const casualty of casualties) {
      let matchScore = 0;

      // Gender match
      if (report.missingPerson.gender && casualty.personalInfo?.gender === report.missingPerson.gender) {
        matchScore += 20;
      }

      // Age match (within 5 years)
      if (report.missingPerson.dateOfBirth && casualty.personalInfo?.age) {
        const missingAge = Math.floor((Date.now() - report.missingPerson.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        if (Math.abs(missingAge - casualty.personalInfo.age) <= 5) {
          matchScore += 20;
        }
      }

      // Physical description matches
      const mp = report.missingPerson.physicalDescription;
      const cp = casualty.physicalDescription;

      if (mp.hairColor && cp.hairColor?.toLowerCase() === mp.hairColor.toLowerCase()) {
        matchScore += 15;
      }
      if (mp.eyeColor && cp.eyeColor?.toLowerCase() === mp.eyeColor.toLowerCase()) {
        matchScore += 15;
      }
      if (mp.build && cp.build === mp.build) {
        matchScore += 10;
      }

      // Height match (within 5cm/2in)
      if (mp.height && cp.height) {
        const diff = Math.abs(mp.height.value - cp.height.value);
        if (diff <= 5) matchScore += 10;
      }

      if (matchScore >= 40) {
        potentialMatches.push(casualty);
      }
    }

    return potentialMatches;
  }

  async linkReportToCasualty(reportId: string, casualtyId: string): Promise<MissingPersonReport> {
    const report = this.missingReports.get(reportId);
    if (!report) throw new Error(`Missing person report not found: ${reportId}`);

    const casualty = this.casualties.get(casualtyId);
    if (!casualty) throw new Error(`Casualty not found: ${casualtyId}`);

    report.linkedCasualtyId = casualtyId;
    report.status = 'located';
    report.updatedAt = new Date();

    // Add reporter as family contact
    await this.addFamilyContact(casualtyId, {
      name: report.reportedBy.name,
      relationship: report.reportedBy.relationship,
      phone: report.reportedBy.phone,
      email: report.reportedBy.email,
      isPrimaryContact: true,
      isNextOfKin: report.reportedBy.isNextOfKin,
      canIdentify: report.reportedBy.canIdentify
    });

    // Update casualty with missing person info
    if (!casualty.personalInfo?.firstName) {
      casualty.personalInfo = {
        ...casualty.personalInfo,
        firstName: report.missingPerson.name.split(' ')[0],
        lastName: report.missingPerson.name.split(' ').slice(1).join(' '),
        dateOfBirth: report.missingPerson.dateOfBirth,
        gender: report.missingPerson.gender
      };
      casualty.identificationStatus = 'tentative';
      casualty.identificationInfo.status = 'tentative';
    }

    casualty.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'located',
      description: `Linked to missing person report ${report.id}`,
      actor: 'System'
    });

    casualty.updatedAt = new Date();

    return report;
  }

  async getOpenMissingReports(incidentId?: string): Promise<MissingPersonReport[]> {
    let reports = Array.from(this.missingReports.values())
      .filter(r => r.status === 'open');

    if (incidentId) {
      reports = reports.filter(r => r.incidentId === incidentId);
    }

    return reports;
  }

  // ==================== Facility Management ====================

  async registerMorgueFacility(facility: Omit<MorgueFacility, 'id'>): Promise<MorgueFacility> {
    const newFacility: MorgueFacility = {
      ...facility,
      id: `morgue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.morgues.set(newFacility.id, newFacility);
    return newFacility;
  }

  async getMorgueFacilities(status?: MorgueFacility['status']): Promise<MorgueFacility[]> {
    let facilities = Array.from(this.morgues.values());

    if (status) {
      facilities = facilities.filter(f => f.status === status);
    }

    return facilities;
  }

  async updateMorgueOccupancy(facilityId: string, occupancy: number): Promise<MorgueFacility> {
    const facility = this.morgues.get(facilityId);
    if (!facility) throw new Error(`Morgue facility not found: ${facilityId}`);

    facility.currentOccupancy = occupancy;
    
    if (occupancy >= facility.capacity) {
      facility.status = 'full';
    } else if (occupancy >= facility.capacity * 0.9) {
      facility.status = 'limited';
    }

    return facility;
  }

  async createFamilyAssistanceCenter(params: {
    name: string;
    incidentId: string;
    address: string;
    coordinates?: { lat: number; lon: number };
    services: string[];
    contact: string;
  }): Promise<FamilyAssistanceCenter> {
    const center: FamilyAssistanceCenter = {
      id: `fac-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...params,
      staffAssigned: 0,
      familiesServed: 0,
      operatingHours: { open: '08:00', close: '20:00' },
      status: 'setup'
    };

    this.familyAssistanceCenters.set(center.id, center);
    return center;
  }

  async getFamilyAssistanceCenters(incidentId?: string): Promise<FamilyAssistanceCenter[]> {
    let centers = Array.from(this.familyAssistanceCenters.values());

    if (incidentId) {
      centers = centers.filter(c => c.incidentId === incidentId);
    }

    return centers;
  }

  // ==================== Reporting ====================

  async generateCasualtyReport(incidentId: string): Promise<CasualtyReport> {
    const casualties = Array.from(this.casualties.values())
      .filter(c => c.incidentId === incidentId);

    const byStatus: Record<CasualtyStatus, number> = {
      missing: 0, located: 0, injured: 0, hospitalized: 0, deceased: 0, recovered: 0, reunified: 0
    };

    const byIdentificationStatus: Record<string, number> = {
      unidentified: 0, tentative: 0, confirmed: 0
    };

    const bySeverity: Record<InjurySeverity, number> = {
      minor: 0, moderate: 0, serious: 0, critical: 0, fatal: 0
    };

    casualties.forEach(c => {
      byStatus[c.status]++;
      byIdentificationStatus[c.identificationStatus]++;
      if (c.medicalInfo?.severity) {
        bySeverity[c.medicalInfo.severity]++;
      }
    });

    // Group by facility
    const hospitalMap = new Map<string, number>();
    const morgueMap = new Map<string, number>();

    casualties.forEach(c => {
      if (c.status === 'hospitalized' && c.medicalInfo?.treatmentFacility) {
        hospitalMap.set(c.medicalInfo.treatmentFacility, (hospitalMap.get(c.medicalInfo.treatmentFacility) || 0) + 1);
      }
      if (c.status === 'deceased' && c.locationInfo.currentLocation?.facility) {
        morgueMap.set(c.locationInfo.currentLocation.facility, (morgueMap.get(c.locationInfo.currentLocation.facility) || 0) + 1);
      }
    });

    const familiesNotified = casualties.filter(c => c.familyInfo.notificationStatus === 'completed').length;
    const reunifications = casualties.filter(c => c.familyInfo.reunificationStatus === 'completed').length;

    const pendingActions: string[] = [];
    if (byIdentificationStatus.unidentified > 0) {
      pendingActions.push(`${byIdentificationStatus.unidentified} casualties require identification`);
    }
    const pendingNotifications = casualties.filter(c => c.familyInfo.notificationStatus === 'pending').length;
    if (pendingNotifications > 0) {
      pendingActions.push(`${pendingNotifications} families pending notification`);
    }

    return {
      incidentId,
      incidentName: `Incident ${incidentId}`,
      reportDate: new Date(),
      summary: {
        totalCasualties: casualties.length,
        byStatus,
        byIdentificationStatus,
        bySeverity
      },
      facilities: {
        hospitals: Array.from(hospitalMap.entries()).map(([name, patients]) => ({ name, patients })),
        morgues: Array.from(morgueMap.entries()).map(([name, decedents]) => ({ name, decedents }))
      },
      familyAssistance: {
        familiesRegistered: casualties.reduce((sum, c) => sum + c.familyInfo.contacts.length, 0),
        familiesNotified,
        reunificationsCompleted: reunifications
      },
      pendingActions
    };
  }

  // ==================== Statistics ====================

  async getStatistics(incidentId?: string): Promise<{
    totalCasualties: number;
    byStatus: Record<CasualtyStatus, number>;
    identified: number;
    unidentified: number;
    familiesNotified: number;
    reunified: number;
    openMissingReports: number;
  }> {
    let casualties = Array.from(this.casualties.values());
    let missingReports = Array.from(this.missingReports.values());

    if (incidentId) {
      casualties = casualties.filter(c => c.incidentId === incidentId);
      missingReports = missingReports.filter(r => r.incidentId === incidentId);
    }

    const byStatus: Record<CasualtyStatus, number> = {
      missing: 0, located: 0, injured: 0, hospitalized: 0, deceased: 0, recovered: 0, reunified: 0
    };

    casualties.forEach(c => byStatus[c.status]++);

    return {
      totalCasualties: casualties.length,
      byStatus,
      identified: casualties.filter(c => c.identificationStatus === 'confirmed').length,
      unidentified: casualties.filter(c => c.identificationStatus === 'unidentified').length,
      familiesNotified: casualties.filter(c => c.familyInfo.notificationStatus === 'completed').length,
      reunified: casualties.filter(c => c.familyInfo.reunificationStatus === 'completed').length,
      openMissingReports: missingReports.filter(r => r.status === 'open').length
    };
  }
}

export const casualtyTrackingService = CasualtyTrackingService.getInstance();
export default CasualtyTrackingService;
