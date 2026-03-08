/**
 * Data Export Service
 * Comprehensive data export and backup functionality
 */

// Export formats
type ExportFormat = 'json' | 'csv' | 'xml' | 'excel' | 'sqlite' | 'parquet';

// Data category
type DataCategory = 
  | 'alerts'
  | 'incidents'
  | 'shelters'
  | 'resources'
  | 'volunteers'
  | 'evacuations'
  | 'reports'
  | 'analytics'
  | 'users'
  | 'settings'
  | 'audit_logs'
  | 'communications';

// Export status
type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

// Compression type
type CompressionType = 'none' | 'gzip' | 'zip' | 'brotli';

// Export configuration
interface ExportConfig {
  id: string;
  name: string;
  categories: DataCategory[];
  format: ExportFormat;
  compression: CompressionType;
  filters?: DataFilter[];
  dateRange?: { start: Date; end: Date };
  fields?: FieldSelection[];
  includeMetadata: boolean;
  encryption?: EncryptionConfig;
  schedule?: ScheduleConfig;
}

// Data filter
interface DataFilter {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'contains' | 'between';
  value: unknown;
}

// Field selection
interface FieldSelection {
  category: DataCategory;
  fields: string[];
  aliases?: Record<string, string>;
  transformations?: FieldTransformation[];
}

// Field transformation
interface FieldTransformation {
  field: string;
  type: 'uppercase' | 'lowercase' | 'trim' | 'format_date' | 'mask' | 'round' | 'custom';
  config?: Record<string, unknown>;
}

// Encryption config
interface EncryptionConfig {
  enabled: boolean;
  algorithm: 'AES-256' | 'AES-128';
  keyDerivation: 'PBKDF2' | 'scrypt';
}

// Schedule config
interface ScheduleConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  retentionDays: number;
  destination: ExportDestination;
}

// Export destination
interface ExportDestination {
  type: 'local' | 's3' | 'gcs' | 'azure' | 'ftp' | 'sftp';
  path: string;
  credentials?: Record<string, string>;
}

// Export job
interface ExportJob {
  id: string;
  configId: string;
  status: ExportStatus;
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  result?: ExportResult;
  logs: ExportLog[];
}

// Export result
interface ExportResult {
  fileSize: number;
  recordCount: number;
  filePath: string;
  checksum: string;
  downloadUrl?: string;
  expiresAt?: Date;
}

// Export log
interface ExportLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: Record<string, unknown>;
}

// Data schema
interface DataSchema {
  category: DataCategory;
  fields: SchemaField[];
  relationships?: SchemaRelationship[];
}

// Schema field
interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  description: string;
  exportable: boolean;
  sensitive: boolean;
}

// Schema relationship
interface SchemaRelationship {
  field: string;
  relatedCategory: DataCategory;
  relatedField: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

// Import config
interface ImportConfig {
  id: string;
  name: string;
  category: DataCategory;
  format: ExportFormat;
  mapping: FieldMapping[];
  validation: ValidationRule[];
  onConflict: 'skip' | 'overwrite' | 'merge' | 'error';
}

// Field mapping
interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: FieldTransformation;
  defaultValue?: unknown;
}

// Validation rule
interface ValidationRule {
  field: string;
  rule: 'required' | 'unique' | 'format' | 'range' | 'custom';
  config?: Record<string, unknown>;
  errorMessage: string;
}

// Import job
interface ImportJob {
  id: string;
  configId: string;
  status: ExportStatus;
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  result?: ImportResult;
}

// Import result
interface ImportResult {
  totalRecords: number;
  imported: number;
  skipped: number;
  errors: { row: number; field: string; error: string }[];
}

// Default schemas
const DATA_SCHEMAS: DataSchema[] = [
  {
    category: 'alerts',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique alert ID', exportable: true, sensitive: false },
      { name: 'type', type: 'string', required: true, description: 'Alert type', exportable: true, sensitive: false },
      { name: 'severity', type: 'string', required: true, description: 'Severity level', exportable: true, sensitive: false },
      { name: 'title', type: 'string', required: true, description: 'Alert title', exportable: true, sensitive: false },
      { name: 'description', type: 'string', required: false, description: 'Detailed description', exportable: true, sensitive: false },
      { name: 'location', type: 'object', required: true, description: 'Geographic location', exportable: true, sensitive: false },
      { name: 'affectedArea', type: 'object', required: false, description: 'Affected area polygon', exportable: true, sensitive: false },
      { name: 'issuedAt', type: 'date', required: true, description: 'Issue timestamp', exportable: true, sensitive: false },
      { name: 'expiresAt', type: 'date', required: false, description: 'Expiry timestamp', exportable: true, sensitive: false },
      { name: 'source', type: 'string', required: true, description: 'Alert source', exportable: true, sensitive: false },
      { name: 'status', type: 'string', required: true, description: 'Alert status', exportable: true, sensitive: false },
    ],
    relationships: [
      { field: 'incidentId', relatedCategory: 'incidents', relatedField: 'id', type: 'one-to-one' },
    ],
  },
  {
    category: 'incidents',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique incident ID', exportable: true, sensitive: false },
      { name: 'type', type: 'string', required: true, description: 'Incident type', exportable: true, sensitive: false },
      { name: 'title', type: 'string', required: true, description: 'Incident title', exportable: true, sensitive: false },
      { name: 'description', type: 'string', required: false, description: 'Description', exportable: true, sensitive: false },
      { name: 'severity', type: 'string', required: true, description: 'Severity', exportable: true, sensitive: false },
      { name: 'location', type: 'object', required: true, description: 'Location', exportable: true, sensitive: false },
      { name: 'reportedAt', type: 'date', required: true, description: 'Report time', exportable: true, sensitive: false },
      { name: 'reportedBy', type: 'string', required: false, description: 'Reporter', exportable: true, sensitive: true },
      { name: 'status', type: 'string', required: true, description: 'Status', exportable: true, sensitive: false },
      { name: 'assignedTo', type: 'array', required: false, description: 'Assigned teams', exportable: true, sensitive: false },
    ],
  },
  {
    category: 'shelters',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Shelter ID', exportable: true, sensitive: false },
      { name: 'name', type: 'string', required: true, description: 'Shelter name', exportable: true, sensitive: false },
      { name: 'type', type: 'string', required: true, description: 'Shelter type', exportable: true, sensitive: false },
      { name: 'location', type: 'object', required: true, description: 'Location', exportable: true, sensitive: false },
      { name: 'address', type: 'string', required: true, description: 'Full address', exportable: true, sensitive: false },
      { name: 'capacity', type: 'number', required: true, description: 'Total capacity', exportable: true, sensitive: false },
      { name: 'currentOccupancy', type: 'number', required: true, description: 'Current occupancy', exportable: true, sensitive: false },
      { name: 'facilities', type: 'array', required: false, description: 'Available facilities', exportable: true, sensitive: false },
      { name: 'contactPerson', type: 'string', required: false, description: 'Contact person', exportable: true, sensitive: true },
      { name: 'contactPhone', type: 'string', required: false, description: 'Contact phone', exportable: true, sensitive: true },
      { name: 'status', type: 'string', required: true, description: 'Operational status', exportable: true, sensitive: false },
    ],
  },
  {
    category: 'resources',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Resource ID', exportable: true, sensitive: false },
      { name: 'type', type: 'string', required: true, description: 'Resource type', exportable: true, sensitive: false },
      { name: 'name', type: 'string', required: true, description: 'Resource name', exportable: true, sensitive: false },
      { name: 'quantity', type: 'number', required: true, description: 'Available quantity', exportable: true, sensitive: false },
      { name: 'unit', type: 'string', required: true, description: 'Unit of measure', exportable: true, sensitive: false },
      { name: 'location', type: 'object', required: false, description: 'Current location', exportable: true, sensitive: false },
      { name: 'status', type: 'string', required: true, description: 'Status', exportable: true, sensitive: false },
      { name: 'allocatedTo', type: 'string', required: false, description: 'Allocation', exportable: true, sensitive: false },
    ],
  },
  {
    category: 'volunteers',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Volunteer ID', exportable: true, sensitive: false },
      { name: 'name', type: 'string', required: true, description: 'Full name', exportable: true, sensitive: true },
      { name: 'email', type: 'string', required: true, description: 'Email', exportable: true, sensitive: true },
      { name: 'phone', type: 'string', required: true, description: 'Phone', exportable: true, sensitive: true },
      { name: 'skills', type: 'array', required: false, description: 'Skills', exportable: true, sensitive: false },
      { name: 'availability', type: 'object', required: false, description: 'Availability', exportable: true, sensitive: false },
      { name: 'status', type: 'string', required: true, description: 'Status', exportable: true, sensitive: false },
      { name: 'assignedTasks', type: 'array', required: false, description: 'Assigned tasks', exportable: true, sensitive: false },
    ],
  },
  {
    category: 'evacuations',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Evacuation ID', exportable: true, sensitive: false },
      { name: 'zone', type: 'string', required: true, description: 'Evacuation zone', exportable: true, sensitive: false },
      { name: 'status', type: 'string', required: true, description: 'Status', exportable: true, sensitive: false },
      { name: 'issuedAt', type: 'date', required: true, description: 'Issue time', exportable: true, sensitive: false },
      { name: 'routes', type: 'array', required: false, description: 'Evacuation routes', exportable: true, sensitive: false },
      { name: 'shelterIds', type: 'array', required: false, description: 'Destination shelters', exportable: true, sensitive: false },
      { name: 'estimatedPeople', type: 'number', required: false, description: 'Est. affected', exportable: true, sensitive: false },
      { name: 'evacuatedCount', type: 'number', required: false, description: 'Evacuated count', exportable: true, sensitive: false },
    ],
    relationships: [
      { field: 'shelterIds', relatedCategory: 'shelters', relatedField: 'id', type: 'one-to-many' },
    ],
  },
];

// Sample data generators
const generateSampleData = {
  alerts: (count: number) => {
    const types = ['flood', 'fire', 'cyclone', 'earthquake', 'landslide', 'tsunami'];
    const severities = ['critical', 'high', 'medium', 'low'];
    const statuses = ['active', 'resolved', 'expired'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `ALT-${String(i + 1).padStart(6, '0')}`,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      title: `${types[Math.floor(Math.random() * types.length)].toUpperCase()} Alert - Region ${i + 1}`,
      description: 'Simulated alert for testing purposes',
      location: { lat: 10 + Math.random() * 5, lng: 76 + Math.random() * 3 },
      affectedArea: { radius: 5 + Math.random() * 20 },
      issuedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      source: 'NDMA',
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }));
  },
  shelters: (count: number) => {
    const types = ['school', 'community_hall', 'stadium', 'marriage_hall', 'temple'];
    const statuses = ['open', 'full', 'closed'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `SHL-${String(i + 1).padStart(4, '0')}`,
      name: `Relief Shelter ${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      location: { lat: 10 + Math.random() * 5, lng: 76 + Math.random() * 3 },
      address: `Address ${i + 1}, District, State - 600001`,
      capacity: 100 + Math.floor(Math.random() * 400),
      currentOccupancy: Math.floor(Math.random() * 500),
      facilities: ['water', 'toilets', 'medical', 'kitchen'],
      contactPerson: `Contact Person ${i + 1}`,
      contactPhone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }));
  },
  resources: (count: number) => {
    const types = ['medical', 'food', 'water', 'equipment', 'vehicle'];
    const statuses = ['available', 'deployed', 'reserved', 'maintenance'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `RES-${String(i + 1).padStart(5, '0')}`,
      type: types[Math.floor(Math.random() * types.length)],
      name: `Resource Item ${i + 1}`,
      quantity: 10 + Math.floor(Math.random() * 100),
      unit: 'units',
      location: { lat: 10 + Math.random() * 5, lng: 76 + Math.random() * 3 },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      allocatedTo: Math.random() > 0.5 ? `SHL-${String(Math.floor(Math.random() * 50) + 1).padStart(4, '0')}` : null,
    }));
  },
  volunteers: (count: number) => {
    const skills = ['first_aid', 'driving', 'cooking', 'counseling', 'translation', 'technical'];
    const statuses = ['active', 'inactive', 'on_duty'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `VOL-${String(i + 1).padStart(5, '0')}`,
      name: `Volunteer ${i + 1}`,
      email: `volunteer${i + 1}@example.com`,
      phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      skills: skills.slice(0, Math.floor(Math.random() * 3) + 1),
      availability: { weekdays: true, weekends: true },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assignedTasks: [],
    }));
  },
};

class DataExportService {
  private static instance: DataExportService;
  private configs: Map<string, ExportConfig> = new Map();
  private jobs: Map<string, ExportJob> = new Map();
  private importConfigs: Map<string, ImportConfig> = new Map();
  private importJobs: Map<string, ImportJob> = new Map();
  private listeners: ((job: ExportJob) => void)[] = [];

  private constructor() {
    this.initializeDefaultConfigs();
  }

  public static getInstance(): DataExportService {
    if (!DataExportService.instance) {
      DataExportService.instance = new DataExportService();
    }
    return DataExportService.instance;
  }

  /**
   * Initialize default export configs
   */
  private initializeDefaultConfigs(): void {
    const fullBackup: ExportConfig = {
      id: 'full-backup',
      name: 'Full System Backup',
      categories: ['alerts', 'incidents', 'shelters', 'resources', 'volunteers', 'evacuations'],
      format: 'json',
      compression: 'gzip',
      includeMetadata: true,
    };

    const alertsExport: ExportConfig = {
      id: 'alerts-export',
      name: 'Alerts Export',
      categories: ['alerts'],
      format: 'csv',
      compression: 'none',
      includeMetadata: false,
    };

    const shelterReport: ExportConfig = {
      id: 'shelter-report',
      name: 'Shelter Status Report',
      categories: ['shelters'],
      format: 'excel',
      compression: 'none',
      includeMetadata: true,
    };

    this.configs.set('full-backup', fullBackup);
    this.configs.set('alerts-export', alertsExport);
    this.configs.set('shelter-report', shelterReport);
  }

  /**
   * Create export configuration
   */
  public createExportConfig(config: Omit<ExportConfig, 'id'>): ExportConfig {
    const id = `export-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newConfig: ExportConfig = { ...config, id };
    this.configs.set(id, newConfig);
    return newConfig;
  }

  /**
   * Start export job
   */
  public async startExport(configId: string): Promise<ExportJob> {
    const config = this.configs.get(configId);
    if (!config) {
      throw new Error(`Export config not found: ${configId}`);
    }

    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const job: ExportJob = {
      id: jobId,
      configId,
      status: 'pending',
      progress: 0,
      startedAt: new Date(),
      logs: [{ timestamp: new Date(), level: 'info', message: 'Export job created' }],
    };

    this.jobs.set(jobId, job);
    this.processExport(job, config);
    return job;
  }

  /**
   * Process export
   */
  private async processExport(job: ExportJob, config: ExportConfig): Promise<void> {
    try {
      job.status = 'processing';
      this.addLog(job, 'info', 'Starting export process');
      this.notifyListeners(job);

      const exportData: Record<string, unknown[]> = {};
      let totalRecords = 0;

      for (let i = 0; i < config.categories.length; i++) {
        const category = config.categories[i];
        this.addLog(job, 'info', `Exporting ${category} data`);

        const data = await this.fetchCategoryData(category, config);
        exportData[category] = data;
        totalRecords += data.length;

        job.progress = Math.round(((i + 1) / config.categories.length) * 80);
        this.notifyListeners(job);

        // Simulate processing time
        await this.sleep(500);
      }

      this.addLog(job, 'info', 'Formatting export data');
      job.progress = 90;
      this.notifyListeners(job);

      const formatted = await this.formatExportData(exportData, config);
      const compressed = await this.compressData(formatted, config.compression);

      this.addLog(job, 'info', 'Export completed successfully');
      job.status = 'completed';
      job.progress = 100;
      job.completedAt = new Date();
      job.result = {
        fileSize: compressed.length,
        recordCount: totalRecords,
        filePath: `/exports/${job.id}.${this.getFileExtension(config)}`,
        checksum: this.generateChecksum(compressed),
        downloadUrl: `data:application/octet-stream;base64,${btoa(compressed)}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      this.notifyListeners(job);
    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      this.addLog(job, 'error', `Export failed: ${job.error}`);
      this.notifyListeners(job);
    }
  }

  /**
   * Fetch category data
   */
  private async fetchCategoryData(category: DataCategory, config: ExportConfig): Promise<unknown[]> {
    const generator = generateSampleData[category as keyof typeof generateSampleData];
    if (generator) {
      const data = generator(100 + Math.floor(Math.random() * 100));
      
      // Apply date range filter
      if (config.dateRange && Array.isArray(data)) {
        return (data as Array<{ issuedAt?: string; reportedAt?: string }>).filter((item) => {
          const dateField = item.issuedAt || item.reportedAt;
          if (!dateField) return true;
          const date = new Date(dateField);
          return date >= config.dateRange!.start && date <= config.dateRange!.end;
        });
      }
      
      return data;
    }
    return [];
  }

  /**
   * Format export data
   */
  private async formatExportData(data: Record<string, unknown[]>, config: ExportConfig): Promise<string> {
    switch (config.format) {
      case 'json':
        return this.formatAsJson(data, config);
      case 'csv':
        return this.formatAsCsv(data);
      case 'xml':
        return this.formatAsXml(data);
      case 'excel':
        return this.formatAsExcelCompatible(data);
      default:
        return JSON.stringify(data);
    }
  }

  /**
   * Format as JSON
   */
  private formatAsJson(data: Record<string, unknown[]>, config: ExportConfig): string {
    const output: Record<string, unknown> = { data };
    
    if (config.includeMetadata) {
      output.metadata = {
        exportedAt: new Date().toISOString(),
        categories: config.categories,
        recordCounts: Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, v.length])
        ),
        version: '1.0',
      };
    }
    
    return JSON.stringify(output, null, 2);
  }

  /**
   * Format as CSV
   */
  private formatAsCsv(data: Record<string, unknown[]>): string {
    let csv = '';
    
    for (const [category, records] of Object.entries(data)) {
      if (records.length === 0) continue;
      
      csv += `\n# ${category.toUpperCase()}\n`;
      const headers = Object.keys(records[0] as object);
      csv += headers.join(',') + '\n';
      
      for (const record of records) {
        const values = headers.map((h) => {
          const value = (record as Record<string, unknown>)[h];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
          return String(value).replace(/"/g, '""');
        });
        csv += `"${values.join('","')}"\n`;
      }
    }
    
    return csv;
  }

  /**
   * Format as XML
   */
  private formatAsXml(data: Record<string, unknown[]>): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<export>\n';
    
    for (const [category, records] of Object.entries(data)) {
      xml += `  <${category}>\n`;
      for (const record of records) {
        xml += '    <record>\n';
        for (const [key, value] of Object.entries(record as object)) {
          const escaped = String(value).replace(/[<>&'"]/g, (c) => {
            const entities: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' };
            return entities[c];
          });
          xml += `      <${key}>${escaped}</${key}>\n`;
        }
        xml += '    </record>\n';
      }
      xml += `  </${category}>\n`;
    }
    
    xml += '</export>';
    return xml;
  }

  /**
   * Format as Excel-compatible (TSV with metadata)
   */
  private formatAsExcelCompatible(data: Record<string, unknown[]>): string {
    let content = 'RESCUE-PING DATA EXPORT\t\t\t\t\n';
    content += `Generated: ${new Date().toISOString()}\t\t\t\t\n\n`;
    
    for (const [category, records] of Object.entries(data)) {
      if (records.length === 0) continue;
      
      content += `${category.toUpperCase()}\t\t\t\t\n`;
      const headers = Object.keys(records[0] as object);
      content += headers.join('\t') + '\n';
      
      for (const record of records) {
        const values = headers.map((h) => {
          const value = (record as Record<string, unknown>)[h];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        });
        content += values.join('\t') + '\n';
      }
      content += '\n';
    }
    
    return content;
  }

  /**
   * Compress data
   */
  private async compressData(data: string, compression: CompressionType): Promise<string> {
    switch (compression) {
      case 'gzip':
      case 'brotli':
        // Simulated compression - in real implementation would use compression libraries
        return `[COMPRESSED:${compression}]${data}`;
      case 'zip':
        return `[ZIP]${data}`;
      default:
        return data;
    }
  }

  /**
   * Generate checksum
   */
  private generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Get file extension
   */
  private getFileExtension(config: ExportConfig): string {
    const extensions: Record<ExportFormat, string> = {
      json: 'json',
      csv: 'csv',
      xml: 'xml',
      excel: 'xlsx',
      sqlite: 'db',
      parquet: 'parquet',
    };
    
    let ext = extensions[config.format];
    if (config.compression === 'gzip') ext += '.gz';
    else if (config.compression === 'zip') ext = 'zip';
    
    return ext;
  }

  /**
   * Add log entry
   */
  private addLog(job: ExportJob, level: 'info' | 'warning' | 'error', message: string): void {
    job.logs.push({ timestamp: new Date(), level, message });
  }

  /**
   * Get export job
   */
  public getJob(jobId: string): ExportJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs
   */
  public getAllJobs(): ExportJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Get export configs
   */
  public getConfigs(): ExportConfig[] {
    return Array.from(this.configs.values());
  }

  /**
   * Get config
   */
  public getConfig(configId: string): ExportConfig | undefined {
    return this.configs.get(configId);
  }

  /**
   * Get data schemas
   */
  public getSchemas(): DataSchema[] {
    return DATA_SCHEMAS;
  }

  /**
   * Get schema for category
   */
  public getSchema(category: DataCategory): DataSchema | undefined {
    return DATA_SCHEMAS.find((s) => s.category === category);
  }

  /**
   * Cancel export
   */
  public cancelExport(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'completed' || job.status === 'failed') return false;
    
    job.status = 'cancelled';
    this.addLog(job, 'warning', 'Export cancelled by user');
    this.notifyListeners(job);
    return true;
  }

  /**
   * Create import configuration
   */
  public createImportConfig(config: Omit<ImportConfig, 'id'>): ImportConfig {
    const id = `import-${Date.now()}`;
    const newConfig: ImportConfig = { ...config, id };
    this.importConfigs.set(id, newConfig);
    return newConfig;
  }

  /**
   * Start import
   */
  public async startImport(configId: string, fileData: string): Promise<ImportJob> {
    const config = this.importConfigs.get(configId);
    if (!config) {
      throw new Error(`Import config not found: ${configId}`);
    }

    const jobId = `import-job-${Date.now()}`;
    const job: ImportJob = {
      id: jobId,
      configId,
      status: 'processing',
      progress: 0,
      startedAt: new Date(),
    };

    this.importJobs.set(jobId, job);
    this.processImport(job, config, fileData);
    return job;
  }

  /**
   * Process import
   */
  private async processImport(job: ImportJob, config: ImportConfig, fileData: string): Promise<void> {
    try {
      const records = this.parseImportData(fileData, config.format);
      const total = records.length;
      let imported = 0;
      let skipped = 0;
      const errors: { row: number; field: string; error: string }[] = [];

      for (let i = 0; i < records.length; i++) {
        const validation = this.validateRecord(records[i], config.validation);
        
        if (validation.valid) {
          imported++;
        } else {
          if (config.onConflict === 'skip') {
            skipped++;
          } else {
            errors.push({ row: i + 1, field: validation.field || '', error: validation.error || '' });
          }
        }
        
        job.progress = Math.round(((i + 1) / total) * 100);
        await this.sleep(10);
      }

      job.status = 'completed';
      job.completedAt = new Date();
      job.result = { totalRecords: total, imported, skipped, errors };
    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  /**
   * Parse import data
   */
  private parseImportData(data: string, format: ExportFormat): Record<string, unknown>[] {
    if (format === 'json') {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    if (format === 'csv') {
      const lines = data.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
      if (lines.length < 2) return [];
      const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
      return lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
        return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
      });
    }
    return [];
  }

  /**
   * Validate record
   */
  private validateRecord(
    record: Record<string, unknown>,
    rules: ValidationRule[]
  ): { valid: boolean; field?: string; error?: string } {
    for (const rule of rules) {
      const value = record[rule.field];
      
      if (rule.rule === 'required' && (value === null || value === undefined || value === '')) {
        return { valid: false, field: rule.field, error: rule.errorMessage };
      }
    }
    return { valid: true };
  }

  /**
   * Quick export
   */
  public async quickExport(
    category: DataCategory,
    format: ExportFormat = 'csv'
  ): Promise<string> {
    const generator = generateSampleData[category as keyof typeof generateSampleData];
    if (!generator) throw new Error(`Unknown category: ${category}`);
    
    const data = generator(50);
    const formatted = await this.formatExportData({ [category]: data }, {
      id: 'quick',
      name: 'Quick Export',
      categories: [category],
      format,
      compression: 'none',
      includeMetadata: false,
    });
    
    return formatted;
  }

  /**
   * Subscribe to job updates
   */
  public subscribe(callback: (job: ExportJob) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(job: ExportJob): void {
    this.listeners.forEach((callback) => callback(job));
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const dataExportService = DataExportService.getInstance();
export type {
  ExportFormat,
  DataCategory,
  ExportStatus,
  CompressionType,
  ExportConfig,
  DataFilter,
  FieldSelection,
  FieldTransformation,
  EncryptionConfig,
  ScheduleConfig,
  ExportDestination,
  ExportJob,
  ExportResult,
  ExportLog,
  DataSchema,
  SchemaField,
  SchemaRelationship,
  ImportConfig,
  FieldMapping,
  ValidationRule,
  ImportJob,
  ImportResult,
};
