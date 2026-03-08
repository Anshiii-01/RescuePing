/**
 * Data Warehouse Service - #119
 * Data ingestion, transformation, partitioning, querying, retention
 */

// Data source type
type DataSourceType = 'database' | 'api' | 'file' | 'stream' | 'event' | 'external';

// Ingestion status
type IngestionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

// Transformation type
type TransformationType = 'extract' | 'filter' | 'map' | 'aggregate' | 'join' | 'pivot' | 'unpivot' | 'window' | 'sort' | 'dedupe' | 'enrich' | 'custom';

// Partition strategy
type PartitionStrategy = 'time' | 'hash' | 'range' | 'list' | 'composite';

// Query status
type QueryStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout';

// Data type
type DataType = 'string' | 'integer' | 'decimal' | 'boolean' | 'date' | 'timestamp' | 'array' | 'object' | 'binary' | 'geometry';

// Data source definition
interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  description: string;
  connection: DataSourceConnection;
  schema: DataSchema;
  metadata: {
    owner: string;
    created: Date;
    updated: Date;
    lastSync?: Date;
    tags: string[];
  };
  status: 'active' | 'inactive' | 'error';
  settings: {
    refreshInterval?: number;
    retryAttempts: number;
    timeout: number;
  };
}

// Data source connection
interface DataSourceConnection {
  // Database
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  
  // API
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  authentication?: {
    type: 'none' | 'basic' | 'bearer' | 'apikey' | 'oauth2';
    credentials?: Record<string, string>;
  };
  
  // File
  path?: string;
  format?: 'csv' | 'json' | 'parquet' | 'avro' | 'orc';
  compression?: 'none' | 'gzip' | 'snappy' | 'lz4';
  
  // Stream
  bootstrapServers?: string;
  topic?: string;
  groupId?: string;
}

// Data schema
interface DataSchema {
  columns: SchemaColumn[];
  primaryKey?: string[];
  foreignKeys?: {
    columns: string[];
    references: { table: string; columns: string[] };
  }[];
  indexes?: { name: string; columns: string[]; unique?: boolean }[];
}

// Schema column
interface SchemaColumn {
  name: string;
  type: DataType;
  nullable: boolean;
  defaultValue?: unknown;
  description?: string;
  constraints?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: unknown[];
  };
}

// Ingestion job
interface IngestionJob {
  id: string;
  name: string;
  sourceId: string;
  targetTable: string;
  status: IngestionStatus;
  mode: 'full' | 'incremental' | 'append' | 'upsert';
  schedule?: {
    cron: string;
    timezone: string;
    enabled: boolean;
  };
  watermark?: {
    column: string;
    value: unknown;
  };
  transformations: Transformation[];
  validation: {
    enabled: boolean;
    rules: ValidationRule[];
    onFailure: 'fail' | 'skip' | 'quarantine';
  };
  stats: {
    rowsRead: number;
    rowsWritten: number;
    rowsFailed: number;
    bytesProcessed: number;
    startTime?: Date;
    endTime?: Date;
    duration?: number;
  };
  history: {
    runId: string;
    status: IngestionStatus;
    startTime: Date;
    endTime?: Date;
    rowsProcessed: number;
    error?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Transformation
interface Transformation {
  id: string;
  name: string;
  type: TransformationType;
  order: number;
  config: TransformationConfig;
  enabled: boolean;
}

// Transformation config
interface TransformationConfig {
  // Extract
  sourceColumns?: string[];
  
  // Filter
  condition?: string;
  
  // Map
  mappings?: { source: string; target: string; expression?: string }[];
  
  // Aggregate
  groupBy?: string[];
  aggregations?: { column: string; function: 'sum' | 'avg' | 'min' | 'max' | 'count'; alias: string }[];
  
  // Join
  joinType?: 'inner' | 'left' | 'right' | 'full' | 'cross';
  joinTable?: string;
  joinCondition?: string;
  
  // Pivot/Unpivot
  pivotColumn?: string;
  valueColumn?: string;
  
  // Window
  windowFunction?: 'row_number' | 'rank' | 'dense_rank' | 'lead' | 'lag';
  partitionBy?: string[];
  orderBy?: { column: string; direction: 'asc' | 'desc' }[];
  
  // Sort
  sortColumns?: { column: string; direction: 'asc' | 'desc' }[];
  
  // Dedupe
  dedupeColumns?: string[];
  keepStrategy?: 'first' | 'last' | 'max' | 'min';
  
  // Enrich
  lookupTable?: string;
  lookupKey?: string;
  enrichColumns?: string[];
  
  // Custom
  customScript?: string;
  language?: 'sql' | 'python' | 'javascript';
}

// Validation rule
interface ValidationRule {
  id: string;
  name: string;
  column: string;
  type: 'not_null' | 'unique' | 'range' | 'pattern' | 'reference' | 'custom';
  params?: Record<string, unknown>;
  severity: 'error' | 'warning';
}

// Data table
interface DataTable {
  id: string;
  name: string;
  schema: string;
  description: string;
  columns: SchemaColumn[];
  partitioning: TablePartitioning;
  clustering?: string[];
  retention: RetentionPolicy;
  stats: TableStats;
  metadata: {
    owner: string;
    created: Date;
    updated: Date;
    lastModified?: Date;
    tags: string[];
  };
}

// Table partitioning
interface TablePartitioning {
  enabled: boolean;
  strategy: PartitionStrategy;
  column?: string;
  granularity?: 'hour' | 'day' | 'week' | 'month' | 'year';
  ranges?: { name: string; min: unknown; max: unknown }[];
  listValues?: { name: string; values: unknown[] }[];
  partitions: Partition[];
}

// Partition
interface Partition {
  id: string;
  name: string;
  tableId: string;
  value: unknown;
  rowCount: number;
  sizeBytes: number;
  createdAt: Date;
  expiresAt?: Date;
  compressed: boolean;
  status: 'active' | 'archived' | 'expired';
}

// Retention policy
interface RetentionPolicy {
  enabled: boolean;
  duration: number;
  unit: 'hours' | 'days' | 'weeks' | 'months' | 'years';
  action: 'delete' | 'archive' | 'compress';
  excludePartitions?: string[];
}

// Table stats
interface TableStats {
  rowCount: number;
  sizeBytes: number;
  partitionCount: number;
  avgRowSize: number;
  lastAnalyzed?: Date;
  columnStats: {
    column: string;
    distinctCount: number;
    nullCount: number;
    minValue?: unknown;
    maxValue?: unknown;
  }[];
}

// Query definition
interface Query {
  id: string;
  name: string;
  sql: string;
  description?: string;
  parameters: QueryParameter[];
  owner: string;
  shared: boolean;
  tags: string[];
  stats: {
    executions: number;
    avgDuration: number;
    lastExecuted?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Query parameter
interface QueryParameter {
  name: string;
  type: DataType;
  defaultValue?: unknown;
  required: boolean;
}

// Query execution
interface QueryExecution {
  id: string;
  queryId?: string;
  sql: string;
  parameters?: Record<string, unknown>;
  status: QueryStatus;
  executedBy: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  rowsAffected?: number;
  bytesScanned?: number;
  result?: {
    columns: { name: string; type: DataType }[];
    rows: unknown[][];
    truncated: boolean;
    totalRows: number;
  };
  error?: {
    code: string;
    message: string;
    position?: number;
  };
  cost?: {
    credits: number;
    bytes: number;
  };
}

// Warehouse stats
interface WarehouseStats {
  period: { start: Date; end: Date };
  overview: {
    totalTables: number;
    totalRows: number;
    totalSize: number;
    totalQueries: number;
    avgQueryTime: number;
    storageUsed: number;
    storageLimit: number;
  };
  ingestion: {
    jobsRun: number;
    rowsIngested: number;
    bytesIngested: number;
    failedJobs: number;
  };
  queries: {
    total: number;
    successful: number;
    failed: number;
    avgDuration: number;
    p95Duration: number;
  };
  byTable: {
    tableId: string;
    tableName: string;
    rowCount: number;
    sizeBytes: number;
    queries: number;
  }[];
  trend: {
    date: Date;
    queries: number;
    rowsIngested: number;
    storage: number;
  }[];
}

class DataWarehouseService {
  private static instance: DataWarehouseService;
  private dataSources: Map<string, DataSource> = new Map();
  private ingestionJobs: Map<string, IngestionJob> = new Map();
  private tables: Map<string, DataTable> = new Map();
  private partitions: Map<string, Partition> = new Map();
  private queries: Map<string, Query> = new Map();
  private executions: Map<string, QueryExecution> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): DataWarehouseService {
    if (!DataWarehouseService.instance) {
      DataWarehouseService.instance = new DataWarehouseService();
    }
    return DataWarehouseService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize data sources
    const sourcesData: { name: string; type: DataSourceType; desc: string }[] = [
      { name: 'Alert Database', type: 'database', desc: 'Primary alert data source' },
      { name: 'User Activity API', type: 'api', desc: 'User activity events' },
      { name: 'Incident Files', type: 'file', desc: 'Historical incident data' },
      { name: 'Real-time Events', type: 'stream', desc: 'Kafka event stream' },
      { name: 'External Weather', type: 'external', desc: 'Weather data API' },
    ];

    sourcesData.forEach((s, idx) => {
      const dataSource: DataSource = {
        id: `ds-${(idx + 1).toString().padStart(6, '0')}`,
        name: s.name,
        type: s.type,
        description: s.desc,
        connection: {
          host: s.type === 'database' ? 'db.rescueping.com' : undefined,
          port: s.type === 'database' ? 5432 : undefined,
          database: s.type === 'database' ? 'rescueping_prod' : undefined,
          url: s.type !== 'database' ? `https://api.rescueping.com/${s.name.toLowerCase().replace(' ', '-')}` : undefined,
          format: s.type === 'file' ? 'parquet' : undefined,
          bootstrapServers: s.type === 'stream' ? 'kafka.rescueping.com:9092' : undefined,
          topic: s.type === 'stream' ? 'events' : undefined,
        },
        schema: {
          columns: [
            { name: 'id', type: 'string', nullable: false },
            { name: 'timestamp', type: 'timestamp', nullable: false },
            { name: 'type', type: 'string', nullable: false },
            { name: 'data', type: 'object', nullable: true },
            { name: 'value', type: 'decimal', nullable: true },
          ],
        },
        metadata: {
          owner: 'data-team',
          created: new Date(Date.now() - idx * 30 * 24 * 60 * 60 * 1000),
          updated: new Date(),
          lastSync: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          tags: [s.type, 'production'],
        },
        status: 'active',
        settings: {
          refreshInterval: 3600000,
          retryAttempts: 3,
          timeout: 30000,
        },
      };
      this.dataSources.set(dataSource.id, dataSource);
    });

    // Initialize tables
    const tablesData: { name: string; schema: string; rows: number }[] = [
      { name: 'alerts', schema: 'public', rows: 1500000 },
      { name: 'users', schema: 'public', rows: 250000 },
      { name: 'incidents', schema: 'public', rows: 85000 },
      { name: 'notifications', schema: 'public', rows: 5000000 },
      { name: 'audit_logs', schema: 'audit', rows: 10000000 },
      { name: 'metrics', schema: 'analytics', rows: 50000000 },
      { name: 'events', schema: 'events', rows: 100000000 },
    ];

    tablesData.forEach((t, idx) => {
      const partitions: Partition[] = [];
      for (let p = 0; p < 7; p++) {
        const partition: Partition = {
          id: `part-${idx}-${p}`,
          name: `${t.name}_${new Date(Date.now() - (6 - p) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
          tableId: `tbl-${(idx + 1).toString().padStart(6, '0')}`,
          value: new Date(Date.now() - (6 - p) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          rowCount: Math.floor(t.rows / 7),
          sizeBytes: Math.floor(t.rows / 7) * 500,
          createdAt: new Date(Date.now() - (6 - p) * 24 * 60 * 60 * 1000),
          compressed: true,
          status: 'active',
        };
        partitions.push(partition);
        this.partitions.set(partition.id, partition);
      }

      const table: DataTable = {
        id: `tbl-${(idx + 1).toString().padStart(6, '0')}`,
        name: t.name,
        schema: t.schema,
        description: `${t.name} table for storing ${t.name} data`,
        columns: [
          { name: 'id', type: 'string', nullable: false },
          { name: 'created_at', type: 'timestamp', nullable: false },
          { name: 'updated_at', type: 'timestamp', nullable: false },
          { name: 'type', type: 'string', nullable: true },
          { name: 'status', type: 'string', nullable: true },
          { name: 'data', type: 'object', nullable: true },
        ],
        partitioning: {
          enabled: true,
          strategy: 'time',
          column: 'created_at',
          granularity: 'day',
          partitions,
        },
        clustering: ['type', 'status'],
        retention: {
          enabled: true,
          duration: idx < 4 ? 90 : 365,
          unit: 'days',
          action: idx < 4 ? 'archive' : 'delete',
        },
        stats: {
          rowCount: t.rows,
          sizeBytes: t.rows * 500,
          partitionCount: 7,
          avgRowSize: 500,
          lastAnalyzed: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          columnStats: [
            { column: 'id', distinctCount: t.rows, nullCount: 0 },
            { column: 'type', distinctCount: 10, nullCount: Math.floor(t.rows * 0.01) },
            { column: 'status', distinctCount: 5, nullCount: 0 },
          ],
        },
        metadata: {
          owner: 'data-team',
          created: new Date(Date.now() - idx * 60 * 24 * 60 * 60 * 1000),
          updated: new Date(),
          lastModified: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
          tags: [t.schema, 'production'],
        },
      };
      this.tables.set(table.id, table);
    });

    // Initialize ingestion jobs
    const jobsData = [
      { name: 'Alert Sync', source: 'ds-000001', table: 'alerts' },
      { name: 'User Sync', source: 'ds-000002', table: 'users' },
      { name: 'Incident Import', source: 'ds-000003', table: 'incidents' },
      { name: 'Event Stream', source: 'ds-000004', table: 'events' },
      { name: 'Metric Collection', source: 'ds-000001', table: 'metrics' },
    ];

    jobsData.forEach((j, idx) => {
      const job: IngestionJob = {
        id: `job-${(idx + 1).toString().padStart(6, '0')}`,
        name: j.name,
        sourceId: j.source,
        targetTable: j.table,
        status: ['completed', 'running', 'completed', 'completed', 'failed'][idx] as IngestionStatus,
        mode: ['incremental', 'incremental', 'full', 'append', 'upsert'][idx] as IngestionJob['mode'],
        schedule: {
          cron: ['0 * * * *', '0 */6 * * *', '0 0 * * *', '*/5 * * * *', '0 */4 * * *'][idx],
          timezone: 'UTC',
          enabled: true,
        },
        watermark: ['incremental', 'upsert'].includes(['incremental', 'incremental', 'full', 'append', 'upsert'][idx]) ? {
          column: 'updated_at',
          value: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
        } : undefined,
        transformations: [
          {
            id: 'tf-1',
            name: 'Extract Columns',
            type: 'extract',
            order: 1,
            config: { sourceColumns: ['id', 'timestamp', 'type', 'data'] },
            enabled: true,
          },
          {
            id: 'tf-2',
            name: 'Filter Valid',
            type: 'filter',
            order: 2,
            config: { condition: 'status IS NOT NULL' },
            enabled: true,
          },
          {
            id: 'tf-3',
            name: 'Deduplicate',
            type: 'dedupe',
            order: 3,
            config: { dedupeColumns: ['id'], keepStrategy: 'last' },
            enabled: true,
          },
        ],
        validation: {
          enabled: true,
          rules: [
            { id: 'v1', name: 'ID Not Null', column: 'id', type: 'not_null', severity: 'error' },
            { id: 'v2', name: 'Valid Type', column: 'type', type: 'pattern', params: { pattern: '^[a-z_]+$' }, severity: 'warning' },
          ],
          onFailure: 'quarantine',
        },
        stats: {
          rowsRead: Math.floor(Math.random() * 100000) + 10000,
          rowsWritten: Math.floor(Math.random() * 95000) + 9000,
          rowsFailed: Math.floor(Math.random() * 1000),
          bytesProcessed: Math.floor(Math.random() * 50000000) + 5000000,
          startTime: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
          endTime: idx !== 1 ? new Date() : undefined,
          duration: idx !== 1 ? Math.floor(Math.random() * 300000) + 30000 : undefined,
        },
        history: Array.from({ length: 5 }, (_, i) => ({
          runId: `run-${idx}-${i}`,
          status: i === 0 && idx === 4 ? 'failed' : 'completed',
          startTime: new Date(Date.now() - i * 6 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - i * 6 * 60 * 60 * 1000 + Math.random() * 300000),
          rowsProcessed: Math.floor(Math.random() * 100000) + 10000,
          error: i === 0 && idx === 4 ? 'Connection timeout' : undefined,
        })),
        createdAt: new Date(Date.now() - idx * 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.ingestionJobs.set(job.id, job);
    });

    // Initialize saved queries
    const queriesData = [
      { name: 'Active Alerts', sql: 'SELECT * FROM alerts WHERE status = \'active\' ORDER BY created_at DESC' },
      { name: 'Daily Metrics', sql: 'SELECT date, SUM(value) as total FROM metrics GROUP BY date' },
      { name: 'User Activity', sql: 'SELECT user_id, COUNT(*) as events FROM events WHERE timestamp > :start_date GROUP BY user_id' },
      { name: 'Incident Summary', sql: 'SELECT type, status, COUNT(*) as count FROM incidents GROUP BY type, status' },
      { name: 'Top Alerts', sql: 'SELECT type, COUNT(*) as count FROM alerts GROUP BY type ORDER BY count DESC LIMIT 10' },
    ];

    queriesData.forEach((q, idx) => {
      const query: Query = {
        id: `qry-${(idx + 1).toString().padStart(6, '0')}`,
        name: q.name,
        sql: q.sql,
        description: `${q.name} query for analytics`,
        parameters: q.sql.includes(':') ? [{ name: 'start_date', type: 'timestamp', required: true }] : [],
        owner: 'analyst-001',
        shared: true,
        tags: ['analytics', 'reporting'],
        stats: {
          executions: Math.floor(Math.random() * 500) + 50,
          avgDuration: Math.floor(Math.random() * 5000) + 500,
          lastExecuted: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        },
        createdAt: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.queries.set(query.id, query);
    });
  }

  /**
   * Get data sources
   */
  public getDataSources(filter?: { type?: DataSourceType; status?: string }): DataSource[] {
    let sources = Array.from(this.dataSources.values());
    if (filter?.type) sources = sources.filter((s) => s.type === filter.type);
    if (filter?.status) sources = sources.filter((s) => s.status === filter.status);
    return sources;
  }

  /**
   * Get data source
   */
  public getDataSource(sourceId: string): DataSource | undefined {
    return this.dataSources.get(sourceId);
  }

  /**
   * Create data source
   */
  public createDataSource(source: Omit<DataSource, 'id' | 'metadata'>): DataSource {
    const newSource: DataSource = {
      ...source,
      id: `ds-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      metadata: {
        owner: 'system',
        created: new Date(),
        updated: new Date(),
        tags: [],
      },
    };

    this.dataSources.set(newSource.id, newSource);
    this.emit('datasource_created', newSource);

    return newSource;
  }

  /**
   * Test data source
   */
  public testDataSource(sourceId: string): { success: boolean; message: string; latency: number } {
    const source = this.dataSources.get(sourceId);
    if (!source) throw new Error('Data source not found');

    const success = Math.random() > 0.1;
    return {
      success,
      message: success ? 'Connection successful' : 'Connection failed: timeout',
      latency: Math.floor(Math.random() * 500) + 50,
    };
  }

  /**
   * Get tables
   */
  public getTables(filter?: { schema?: string }): DataTable[] {
    let tables = Array.from(this.tables.values());
    if (filter?.schema) tables = tables.filter((t) => t.schema === filter.schema);
    return tables.sort((a, b) => b.stats.rowCount - a.stats.rowCount);
  }

  /**
   * Get table
   */
  public getTable(tableId: string): DataTable | undefined {
    return this.tables.get(tableId);
  }

  /**
   * Get table partitions
   */
  public getTablePartitions(tableId: string): Partition[] {
    const table = this.tables.get(tableId);
    if (!table) return [];
    return table.partitioning.partitions;
  }

  /**
   * Create table
   */
  public createTable(table: Omit<DataTable, 'id' | 'stats' | 'metadata'>): DataTable {
    const newTable: DataTable = {
      ...table,
      id: `tbl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      stats: {
        rowCount: 0,
        sizeBytes: 0,
        partitionCount: 0,
        avgRowSize: 0,
        columnStats: [],
      },
      metadata: {
        owner: 'system',
        created: new Date(),
        updated: new Date(),
        tags: [],
      },
    };

    this.tables.set(newTable.id, newTable);
    this.emit('table_created', newTable);

    return newTable;
  }

  /**
   * Get ingestion jobs
   */
  public getIngestionJobs(filter?: { status?: IngestionStatus; sourceId?: string }): IngestionJob[] {
    let jobs = Array.from(this.ingestionJobs.values());
    if (filter?.status) jobs = jobs.filter((j) => j.status === filter.status);
    if (filter?.sourceId) jobs = jobs.filter((j) => j.sourceId === filter.sourceId);
    return jobs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Get ingestion job
   */
  public getIngestionJob(jobId: string): IngestionJob | undefined {
    return this.ingestionJobs.get(jobId);
  }

  /**
   * Create ingestion job
   */
  public createIngestionJob(job: Omit<IngestionJob, 'id' | 'stats' | 'history' | 'createdAt' | 'updatedAt'>): IngestionJob {
    const newJob: IngestionJob = {
      ...job,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      stats: { rowsRead: 0, rowsWritten: 0, rowsFailed: 0, bytesProcessed: 0 },
      history: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.ingestionJobs.set(newJob.id, newJob);
    this.emit('job_created', newJob);

    return newJob;
  }

  /**
   * Run ingestion job
   */
  public runIngestionJob(jobId: string): IngestionJob {
    const job = this.ingestionJobs.get(jobId);
    if (!job) throw new Error('Ingestion job not found');

    job.status = 'running';
    job.stats.startTime = new Date();
    job.updatedAt = new Date();

    this.emit('job_started', job);

    // Simulate job execution
    setTimeout(() => {
      job.status = Math.random() > 0.1 ? 'completed' : 'failed';
      job.stats.endTime = new Date();
      job.stats.duration = job.stats.endTime.getTime() - job.stats.startTime!.getTime();
      job.stats.rowsRead = Math.floor(Math.random() * 100000) + 10000;
      job.stats.rowsWritten = Math.floor(job.stats.rowsRead * 0.95);
      job.stats.rowsFailed = job.stats.rowsRead - job.stats.rowsWritten;
      job.stats.bytesProcessed = job.stats.rowsRead * 500;

      job.history.unshift({
        runId: `run-${Date.now()}`,
        status: job.status,
        startTime: job.stats.startTime!,
        endTime: job.stats.endTime,
        rowsProcessed: job.stats.rowsWritten,
        error: job.status === 'failed' ? 'Simulated failure' : undefined,
      });

      if (job.history.length > 10) job.history.pop();

      this.emit('job_completed', job);
    }, 3000);

    return job;
  }

  /**
   * Get saved queries
   */
  public getQueries(filter?: { owner?: string; shared?: boolean }): Query[] {
    let queries = Array.from(this.queries.values());
    if (filter?.owner) queries = queries.filter((q) => q.owner === filter.owner);
    if (filter?.shared !== undefined) queries = queries.filter((q) => q.shared === filter.shared);
    return queries.sort((a, b) => b.stats.executions - a.stats.executions);
  }

  /**
   * Get query
   */
  public getQuery(queryId: string): Query | undefined {
    return this.queries.get(queryId);
  }

  /**
   * Create query
   */
  public createQuery(query: Omit<Query, 'id' | 'stats' | 'createdAt' | 'updatedAt'>): Query {
    const newQuery: Query = {
      ...query,
      id: `qry-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      stats: { executions: 0, avgDuration: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.queries.set(newQuery.id, newQuery);
    this.emit('query_created', newQuery);

    return newQuery;
  }

  /**
   * Execute query
   */
  public executeQuery(sql: string, parameters?: Record<string, unknown>, queryId?: string): QueryExecution {
    const execution: QueryExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      queryId,
      sql,
      parameters,
      status: 'running',
      executedBy: 'user-001',
      startTime: new Date(),
    };

    this.executions.set(execution.id, execution);
    this.emit('query_started', execution);

    // Simulate query execution
    setTimeout(() => {
      execution.status = Math.random() > 0.05 ? 'completed' : 'failed';
      execution.endTime = new Date();
      execution.duration = execution.endTime.getTime() - execution.startTime.getTime();
      execution.bytesScanned = Math.floor(Math.random() * 100000000) + 1000000;

      if (execution.status === 'completed') {
        execution.rowsAffected = Math.floor(Math.random() * 10000) + 100;
        execution.result = {
          columns: [
            { name: 'id', type: 'string' },
            { name: 'value', type: 'decimal' },
            { name: 'timestamp', type: 'timestamp' },
          ],
          rows: Array.from({ length: Math.min(100, execution.rowsAffected) }, (_, i) => [
            `id-${i}`,
            Math.random() * 1000,
            new Date().toISOString(),
          ]),
          truncated: execution.rowsAffected > 100,
          totalRows: execution.rowsAffected,
        };
        execution.cost = {
          credits: Math.ceil(execution.bytesScanned / 1000000000),
          bytes: execution.bytesScanned,
        };
      } else {
        execution.error = {
          code: 'QUERY_ERROR',
          message: 'Simulated query failure',
        };
      }

      // Update saved query stats
      if (queryId) {
        const query = this.queries.get(queryId);
        if (query) {
          query.stats.executions++;
          query.stats.avgDuration = (query.stats.avgDuration + execution.duration) / 2;
          query.stats.lastExecuted = new Date();
        }
      }

      this.emit('query_completed', execution);
    }, Math.random() * 2000 + 500);

    return execution;
  }

  /**
   * Get execution
   */
  public getExecution(executionId: string): QueryExecution | undefined {
    return this.executions.get(executionId);
  }

  /**
   * Get executions
   */
  public getExecutions(filter?: { queryId?: string; status?: QueryStatus; limit?: number }): QueryExecution[] {
    let executions = Array.from(this.executions.values());
    if (filter?.queryId) executions = executions.filter((e) => e.queryId === filter.queryId);
    if (filter?.status) executions = executions.filter((e) => e.status === filter.status);
    executions = executions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    if (filter?.limit) executions = executions.slice(0, filter.limit);
    return executions;
  }

  /**
   * Cancel execution
   */
  public cancelExecution(executionId: string): QueryExecution {
    const execution = this.executions.get(executionId);
    if (!execution) throw new Error('Execution not found');

    execution.status = 'cancelled';
    execution.endTime = new Date();

    this.emit('query_cancelled', execution);

    return execution;
  }

  /**
   * Get stats
   */
  public getStats(period: { start: Date; end: Date }): WarehouseStats {
    const tables = Array.from(this.tables.values());
    const jobs = Array.from(this.ingestionJobs.values());
    const executions = Array.from(this.executions.values());

    const totalRows = tables.reduce((sum, t) => sum + t.stats.rowCount, 0);
    const totalSize = tables.reduce((sum, t) => sum + t.stats.sizeBytes, 0);
    const successfulQueries = executions.filter((e) => e.status === 'completed').length;
    const failedQueries = executions.filter((e) => e.status === 'failed').length;

    return {
      period,
      overview: {
        totalTables: tables.length,
        totalRows,
        totalSize,
        totalQueries: executions.length,
        avgQueryTime: executions.reduce((sum, e) => sum + (e.duration || 0), 0) / (executions.length || 1),
        storageUsed: totalSize,
        storageLimit: 1000000000000,
      },
      ingestion: {
        jobsRun: jobs.reduce((sum, j) => sum + j.history.length, 0),
        rowsIngested: jobs.reduce((sum, j) => sum + j.stats.rowsWritten, 0),
        bytesIngested: jobs.reduce((sum, j) => sum + j.stats.bytesProcessed, 0),
        failedJobs: jobs.filter((j) => j.status === 'failed').length,
      },
      queries: {
        total: executions.length,
        successful: successfulQueries,
        failed: failedQueries,
        avgDuration: executions.reduce((sum, e) => sum + (e.duration || 0), 0) / (executions.length || 1),
        p95Duration: Math.max(...executions.map((e) => e.duration || 0)),
      },
      byTable: tables.slice(0, 10).map((t) => ({
        tableId: t.id,
        tableName: t.name,
        rowCount: t.stats.rowCount,
        sizeBytes: t.stats.sizeBytes,
        queries: Math.floor(Math.random() * 100) + 10,
      })),
      trend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
        queries: Math.floor(Math.random() * 500) + 100,
        rowsIngested: Math.floor(Math.random() * 1000000) + 100000,
        storage: totalSize + i * Math.floor(totalSize * 0.01),
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

export const dataWarehouseService = DataWarehouseService.getInstance();
export type {
  DataSourceType,
  IngestionStatus,
  TransformationType,
  PartitionStrategy,
  QueryStatus,
  DataType,
  DataSource,
  DataSourceConnection,
  DataSchema,
  SchemaColumn,
  IngestionJob,
  Transformation,
  TransformationConfig,
  ValidationRule,
  DataTable,
  TablePartitioning,
  Partition,
  RetentionPolicy,
  TableStats,
  Query,
  QueryParameter,
  QueryExecution,
  WarehouseStats,
};
