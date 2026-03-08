/**
 * Report Builder Service - #114
 * Report definitions, scheduling, formats, distribution, templates
 */

// Report type
type ReportType = 'dashboard' | 'tabular' | 'chart' | 'pivot' | 'narrative' | 'composite' | 'kpi' | 'executive';

// Report format
type ReportFormat = 'pdf' | 'excel' | 'csv' | 'html' | 'json' | 'powerpoint' | 'word' | 'image';

// Schedule frequency
type ScheduleFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

// Distribution method
type DistributionMethod = 'email' | 'slack' | 'teams' | 'webhook' | 'sftp' | 's3' | 'api' | 'download';

// Report status
type ReportStatus = 'draft' | 'published' | 'scheduled' | 'generating' | 'completed' | 'failed' | 'archived';

// Data source type
type DataSourceType = 'database' | 'api' | 'file' | 'warehouse' | 'realtime' | 'aggregated';

// Chart type
type ChartType = 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter' | 'heatmap' | 'gauge' | 'funnel' | 'treemap' | 'sankey' | 'radar';

// Report data source
interface ReportDataSource {
  id: string;
  name: string;
  type: DataSourceType;
  connection: {
    host?: string;
    database?: string;
    table?: string;
    apiUrl?: string;
    filePath?: string;
  };
  query?: string;
  parameters?: ReportParameter[];
  transformations?: DataTransformation[];
  caching: {
    enabled: boolean;
    ttl: number;
    lastRefresh?: Date;
  };
  metadata: {
    fields: {
      name: string;
      type: 'string' | 'number' | 'date' | 'boolean' | 'object';
      label: string;
    }[];
    rowCount?: number;
  };
}

// Report parameter
interface ReportParameter {
  id: string;
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'daterange' | 'select' | 'multiselect' | 'boolean';
  required: boolean;
  defaultValue?: unknown;
  options?: { value: unknown; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Data transformation
interface DataTransformation {
  id: string;
  type: 'filter' | 'sort' | 'group' | 'aggregate' | 'pivot' | 'join' | 'calculate' | 'format';
  config: Record<string, unknown>;
  order: number;
}

// Report element
interface ReportElement {
  id: string;
  type: 'text' | 'chart' | 'table' | 'kpi' | 'image' | 'divider' | 'spacer' | 'container';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: {
    title?: string;
    description?: string;
    dataSourceId?: string;
    chartType?: ChartType;
    columns?: string[];
    formatting?: Record<string, unknown>;
    styling?: Record<string, unknown>;
    drillDown?: {
      enabled: boolean;
      targetReportId?: string;
      parameters?: Record<string, string>;
    };
  };
  conditionalFormatting?: {
    field: string;
    conditions: {
      operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'between';
      value: unknown;
      style: Record<string, unknown>;
    }[];
  }[];
  visibility?: {
    condition?: string;
    roles?: string[];
  };
}

// Report template
interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: ReportType;
  thumbnail: string;
  layout: {
    orientation: 'portrait' | 'landscape';
    pageSize: 'a4' | 'letter' | 'legal' | 'custom';
    margins: { top: number; right: number; bottom: number; left: number };
    header?: {
      content: string;
      height: number;
    };
    footer?: {
      content: string;
      height: number;
    };
  };
  elements: ReportElement[];
  dataSources: string[];
  parameters: ReportParameter[];
  styling: {
    theme: string;
    colors: string[];
    fonts: { heading: string; body: string };
    logo?: string;
  };
  metadata: {
    author: string;
    version: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  };
  usageCount: number;
}

// Report definition
interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  templateId?: string;
  status: ReportStatus;
  dataSources: ReportDataSource[];
  parameters: ReportParameter[];
  elements: ReportElement[];
  layout: ReportTemplate['layout'];
  styling: ReportTemplate['styling'];
  schedule?: ReportSchedule;
  distribution?: ReportDistribution[];
  permissions: {
    owner: string;
    editors: string[];
    viewers: string[];
    public: boolean;
  };
  versioning: {
    current: number;
    history: {
      version: number;
      createdAt: Date;
      createdBy: string;
      changes: string;
    }[];
  };
  analytics: {
    views: number;
    downloads: number;
    lastViewed?: Date;
    avgGenerationTime: number;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Report schedule
interface ReportSchedule {
  id: string;
  reportId: string;
  enabled: boolean;
  frequency: ScheduleFrequency;
  config: {
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    monthOfYear?: number;
    cronExpression?: string;
    timezone: string;
  };
  parameters?: Record<string, unknown>;
  format: ReportFormat;
  nextRun?: Date;
  lastRun?: Date;
  lastStatus?: 'success' | 'failed';
  runCount: number;
  failureCount: number;
}

// Report distribution
interface ReportDistribution {
  id: string;
  method: DistributionMethod;
  enabled: boolean;
  config: {
    recipients?: string[];
    channel?: string;
    webhookUrl?: string;
    bucket?: string;
    path?: string;
    filename?: string;
  };
  format: ReportFormat;
  conditions?: {
    field: string;
    operator: string;
    value: unknown;
  }[];
  template?: {
    subject?: string;
    body?: string;
  };
}

// Generated report
interface GeneratedReport {
  id: string;
  reportId: string;
  version: number;
  status: 'queued' | 'generating' | 'completed' | 'failed';
  format: ReportFormat;
  parameters: Record<string, unknown>;
  output?: {
    url: string;
    size: number;
    pages?: number;
    expiresAt: Date;
  };
  timing: {
    queuedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  distribution?: {
    method: DistributionMethod;
    status: 'pending' | 'sent' | 'failed';
    sentAt?: Date;
    error?: string;
  }[];
  triggeredBy: 'manual' | 'scheduled' | 'api';
  createdBy?: string;
}

// Report builder stats
interface ReportBuilderStats {
  period: { start: Date; end: Date };
  overview: {
    totalReports: number;
    activeReports: number;
    scheduledReports: number;
    totalGenerations: number;
    totalDistributions: number;
  };
  byType: {
    type: ReportType;
    count: number;
    percentage: number;
  }[];
  byFormat: {
    format: ReportFormat;
    count: number;
    percentage: number;
  }[];
  performance: {
    avgGenerationTime: number;
    successRate: number;
    queueDepth: number;
    peakUsageHour: number;
  };
  topReports: {
    id: string;
    name: string;
    views: number;
    downloads: number;
  }[];
  trends: {
    date: Date;
    generations: number;
    failures: number;
  }[];
}

class ReportBuilderService {
  private static instance: ReportBuilderService;
  private reports: Map<string, ReportDefinition> = new Map();
  private templates: Map<string, ReportTemplate> = new Map();
  private dataSources: Map<string, ReportDataSource> = new Map();
  private schedules: Map<string, ReportSchedule> = new Map();
  private generatedReports: Map<string, GeneratedReport> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ReportBuilderService {
    if (!ReportBuilderService.instance) {
      ReportBuilderService.instance = new ReportBuilderService();
    }
    return ReportBuilderService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize data sources
    const dataSourcesData = [
      { name: 'Alerts Database', type: 'database', table: 'alerts' },
      { name: 'User Analytics', type: 'warehouse', table: 'user_analytics' },
      { name: 'Weather API', type: 'api', apiUrl: 'https://api.weather.rescueping.com' },
      { name: 'Incident Reports', type: 'database', table: 'incidents' },
      { name: 'Performance Metrics', type: 'realtime', apiUrl: 'wss://metrics.rescueping.com' },
    ];

    dataSourcesData.forEach((ds, idx) => {
      const dataSource: ReportDataSource = {
        id: `ds-${(idx + 1).toString().padStart(4, '0')}`,
        name: ds.name,
        type: ds.type as DataSourceType,
        connection: {
          host: ds.type === 'database' ? 'db.rescueping.com' : undefined,
          database: ds.type === 'database' ? 'rescueping_prod' : undefined,
          table: ds.table,
          apiUrl: ds.apiUrl,
        },
        query: ds.type === 'database' ? `SELECT * FROM ${ds.table}` : undefined,
        parameters: [
          { id: 'p1', name: 'startDate', label: 'Start Date', type: 'date', required: true },
          { id: 'p2', name: 'endDate', label: 'End Date', type: 'date', required: true },
        ],
        caching: {
          enabled: true,
          ttl: 3600,
          lastRefresh: new Date(),
        },
        metadata: {
          fields: [
            { name: 'id', type: 'string', label: 'ID' },
            { name: 'name', type: 'string', label: 'Name' },
            { name: 'value', type: 'number', label: 'Value' },
            { name: 'date', type: 'date', label: 'Date' },
            { name: 'status', type: 'string', label: 'Status' },
          ],
          rowCount: Math.floor(Math.random() * 100000) + 10000,
        },
      };
      this.dataSources.set(dataSource.id, dataSource);
    });

    // Initialize templates
    const templatesData = [
      { name: 'Executive Summary', type: 'executive', category: 'Management' },
      { name: 'Daily Operations', type: 'dashboard', category: 'Operations' },
      { name: 'Incident Analysis', type: 'tabular', category: 'Safety' },
      { name: 'Performance KPIs', type: 'kpi', category: 'Performance' },
      { name: 'Monthly Trends', type: 'chart', category: 'Analytics' },
      { name: 'Compliance Report', type: 'narrative', category: 'Compliance' },
    ];

    templatesData.forEach((t, idx) => {
      const template: ReportTemplate = {
        id: `template-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: `${t.name} template for ${t.category.toLowerCase()} reporting`,
        category: t.category,
        type: t.type as ReportType,
        thumbnail: `https://cdn.rescueping.com/templates/thumb-${idx + 1}.png`,
        layout: {
          orientation: t.type === 'executive' ? 'landscape' : 'portrait',
          pageSize: 'a4',
          margins: { top: 20, right: 20, bottom: 20, left: 20 },
          header: {
            content: '<div>{{companyLogo}} {{reportTitle}}</div>',
            height: 60,
          },
          footer: {
            content: '<div>Page {{pageNumber}} of {{totalPages}} | Generated: {{generatedDate}}</div>',
            height: 40,
          },
        },
        elements: [
          {
            id: `elem-${idx}-1`,
            type: 'text',
            position: { x: 0, y: 0, width: 12, height: 1 },
            config: { title: t.name },
          },
          {
            id: `elem-${idx}-2`,
            type: t.type === 'chart' ? 'chart' : t.type === 'kpi' ? 'kpi' : 'table',
            position: { x: 0, y: 1, width: 12, height: 6 },
            config: {
              dataSourceId: `ds-${((idx % 5) + 1).toString().padStart(4, '0')}`,
              chartType: 'bar',
            },
          },
        ],
        dataSources: [`ds-${((idx % 5) + 1).toString().padStart(4, '0')}`],
        parameters: [
          { id: 'p1', name: 'dateRange', label: 'Date Range', type: 'daterange', required: true },
          { id: 'p2', name: 'region', label: 'Region', type: 'select', required: false, options: [
            { value: 'all', label: 'All Regions' },
            { value: 'north', label: 'North' },
            { value: 'south', label: 'South' },
            { value: 'east', label: 'East' },
            { value: 'west', label: 'West' },
          ]},
        ],
        styling: {
          theme: 'professional',
          colors: ['#4A90D9', '#2ECC71', '#E74C3C', '#9B59B6', '#F39C12'],
          fonts: { heading: 'Inter', body: 'Open Sans' },
          logo: 'https://cdn.rescueping.com/logo.png',
        },
        metadata: {
          author: 'RescuePing Team',
          version: '1.0.0',
          tags: [t.category.toLowerCase(), t.type, 'template'],
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
        usageCount: Math.floor(Math.random() * 500) + 50,
      };
      this.templates.set(template.id, template);
    });

    // Initialize reports
    const reportsData = [
      { name: 'Weekly Alert Summary', type: 'dashboard', status: 'published' },
      { name: 'Monthly Incident Report', type: 'tabular', status: 'published' },
      { name: 'Executive Briefing', type: 'executive', status: 'scheduled' },
      { name: 'Response Time Analysis', type: 'chart', status: 'published' },
      { name: 'User Engagement Report', type: 'composite', status: 'draft' },
      { name: 'Quarterly Performance', type: 'kpi', status: 'scheduled' },
      { name: 'Compliance Audit', type: 'narrative', status: 'published' },
    ];

    reportsData.forEach((r, idx) => {
      const template = this.templates.get(`template-${((idx % 6) + 1).toString().padStart(4, '0')}`);
      const report: ReportDefinition = {
        id: `report-${(idx + 1).toString().padStart(6, '0')}`,
        name: r.name,
        description: `${r.name} - Auto-generated report definition`,
        type: r.type as ReportType,
        templateId: template?.id,
        status: r.status as ReportStatus,
        dataSources: Array.from(this.dataSources.values()).slice(0, 2),
        parameters: [
          { id: 'p1', name: 'startDate', label: 'Start Date', type: 'date', required: true, defaultValue: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          { id: 'p2', name: 'endDate', label: 'End Date', type: 'date', required: true, defaultValue: new Date() },
        ],
        elements: template?.elements || [],
        layout: template?.layout || {
          orientation: 'portrait',
          pageSize: 'a4',
          margins: { top: 20, right: 20, bottom: 20, left: 20 },
        },
        styling: template?.styling || {
          theme: 'default',
          colors: ['#4A90D9', '#2ECC71', '#E74C3C'],
          fonts: { heading: 'Inter', body: 'Open Sans' },
        },
        schedule: r.status === 'scheduled' ? {
          id: `sched-${idx + 1}`,
          reportId: `report-${(idx + 1).toString().padStart(6, '0')}`,
          enabled: true,
          frequency: idx === 2 ? 'weekly' : 'monthly',
          config: {
            time: '08:00',
            dayOfWeek: 1,
            timezone: 'Asia/Kolkata',
          },
          format: 'pdf',
          nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
          lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          lastStatus: 'success',
          runCount: Math.floor(Math.random() * 50) + 10,
          failureCount: Math.floor(Math.random() * 3),
        } : undefined,
        distribution: [
          {
            id: `dist-${idx}-1`,
            method: 'email',
            enabled: true,
            config: {
              recipients: ['team@rescueping.com', 'reports@rescueping.com'],
            },
            format: 'pdf',
            template: {
              subject: `${r.name} - {{date}}`,
              body: 'Please find attached the latest report.',
            },
          },
        ],
        permissions: {
          owner: 'user-001',
          editors: ['user-002', 'user-003'],
          viewers: ['user-004', 'user-005'],
          public: false,
        },
        versioning: {
          current: 1,
          history: [
            { version: 1, createdAt: new Date(), createdBy: 'user-001', changes: 'Initial version' },
          ],
        },
        analytics: {
          views: Math.floor(Math.random() * 500) + 50,
          downloads: Math.floor(Math.random() * 200) + 20,
          lastViewed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          avgGenerationTime: Math.floor(Math.random() * 30) + 5,
        },
        createdAt: new Date(Date.now() - idx * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        createdBy: 'user-001',
      };
      this.reports.set(report.id, report);

      if (report.schedule) {
        this.schedules.set(report.schedule.id, report.schedule);
      }
    });

    // Initialize generated reports
    for (let i = 0; i < 20; i++) {
      const reportId = `report-${((i % 7) + 1).toString().padStart(6, '0')}`;
      const generated: GeneratedReport = {
        id: `gen-${(i + 1).toString().padStart(8, '0')}`,
        reportId,
        version: 1,
        status: i < 15 ? 'completed' : i < 18 ? 'generating' : 'queued',
        format: ['pdf', 'excel', 'csv'][i % 3] as ReportFormat,
        parameters: {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
        },
        output: i < 15 ? {
          url: `https://cdn.rescueping.com/reports/gen-${i + 1}.pdf`,
          size: Math.floor(Math.random() * 5000000) + 100000,
          pages: Math.floor(Math.random() * 20) + 5,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        } : undefined,
        timing: {
          queuedAt: new Date(Date.now() - i * 60 * 60 * 1000),
          startedAt: i < 18 ? new Date(Date.now() - i * 60 * 60 * 1000 + 1000) : undefined,
          completedAt: i < 15 ? new Date(Date.now() - i * 60 * 60 * 1000 + Math.random() * 30000) : undefined,
          duration: i < 15 ? Math.floor(Math.random() * 30) + 5 : undefined,
        },
        distribution: i < 15 ? [
          {
            method: 'email',
            status: 'sent',
            sentAt: new Date(Date.now() - i * 60 * 60 * 1000 + 60000),
          },
        ] : undefined,
        triggeredBy: i % 3 === 0 ? 'scheduled' : 'manual',
        createdBy: i % 3 === 0 ? undefined : 'user-001',
      };
      this.generatedReports.set(generated.id, generated);
    }
  }

  /**
   * Get reports
   */
  public getReports(filter?: {
    status?: ReportStatus;
    type?: ReportType;
    owner?: string;
    limit?: number;
  }): ReportDefinition[] {
    let reports = Array.from(this.reports.values());
    if (filter?.status) reports = reports.filter((r) => r.status === filter.status);
    if (filter?.type) reports = reports.filter((r) => r.type === filter.type);
    if (filter?.owner) reports = reports.filter((r) => r.permissions.owner === filter.owner);
    reports = reports.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    if (filter?.limit) reports = reports.slice(0, filter.limit);
    return reports;
  }

  /**
   * Get report
   */
  public getReport(reportId: string): ReportDefinition | undefined {
    return this.reports.get(reportId);
  }

  /**
   * Create report
   */
  public createReport(
    report: Omit<ReportDefinition, 'id' | 'versioning' | 'analytics' | 'createdAt' | 'updatedAt'>
  ): ReportDefinition {
    const newReport: ReportDefinition = {
      ...report,
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      versioning: {
        current: 1,
        history: [{ version: 1, createdAt: new Date(), createdBy: report.createdBy, changes: 'Initial version' }],
      },
      analytics: { views: 0, downloads: 0, avgGenerationTime: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reports.set(newReport.id, newReport);
    this.emit('report_created', newReport);

    return newReport;
  }

  /**
   * Update report
   */
  public updateReport(reportId: string, updates: Partial<ReportDefinition>): ReportDefinition {
    const report = this.reports.get(reportId);
    if (!report) throw new Error('Report not found');

    Object.assign(report, updates, { updatedAt: new Date() });
    report.versioning.current++;
    report.versioning.history.push({
      version: report.versioning.current,
      createdAt: new Date(),
      createdBy: updates.createdBy || report.createdBy,
      changes: 'Report updated',
    });

    this.emit('report_updated', report);

    return report;
  }

  /**
   * Delete report
   */
  public deleteReport(reportId: string): void {
    const report = this.reports.get(reportId);
    if (!report) throw new Error('Report not found');

    this.reports.delete(reportId);
    this.emit('report_deleted', { reportId });
  }

  /**
   * Get templates
   */
  public getTemplates(filter?: { category?: string; type?: ReportType }): ReportTemplate[] {
    let templates = Array.from(this.templates.values());
    if (filter?.category) templates = templates.filter((t) => t.category === filter.category);
    if (filter?.type) templates = templates.filter((t) => t.type === filter.type);
    return templates.sort((a, b) => b.usageCount - a.usageCount);
  }

  /**
   * Get template
   */
  public getTemplate(templateId: string): ReportTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Create report from template
   */
  public createFromTemplate(
    templateId: string,
    name: string,
    createdBy: string
  ): ReportDefinition {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    template.usageCount++;

    return this.createReport({
      name,
      description: `Report based on ${template.name}`,
      type: template.type,
      templateId,
      status: 'draft',
      dataSources: template.dataSources.map((id) => this.dataSources.get(id)!).filter(Boolean),
      parameters: template.parameters,
      elements: template.elements,
      layout: template.layout,
      styling: template.styling,
      permissions: {
        owner: createdBy,
        editors: [],
        viewers: [],
        public: false,
      },
      createdBy,
    });
  }

  /**
   * Get data sources
   */
  public getDataSources(): ReportDataSource[] {
    return Array.from(this.dataSources.values());
  }

  /**
   * Get data source
   */
  public getDataSource(dataSourceId: string): ReportDataSource | undefined {
    return this.dataSources.get(dataSourceId);
  }

  /**
   * Generate report
   */
  public async generateReport(
    reportId: string,
    format: ReportFormat,
    parameters: Record<string, unknown>,
    triggeredBy: GeneratedReport['triggeredBy'],
    createdBy?: string
  ): Promise<GeneratedReport> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error('Report not found');

    const generated: GeneratedReport = {
      id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      reportId,
      version: report.versioning.current,
      status: 'queued',
      format,
      parameters,
      timing: { queuedAt: new Date() },
      triggeredBy,
      createdBy,
    };

    this.generatedReports.set(generated.id, generated);
    this.emit('generation_queued', generated);

    // Simulate generation
    this.simulateGeneration(generated, report);

    return generated;
  }

  /**
   * Simulate report generation
   */
  private async simulateGeneration(generated: GeneratedReport, report: ReportDefinition): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    generated.status = 'generating';
    generated.timing.startedAt = new Date();
    this.emit('generation_started', generated);

    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000));

    generated.status = 'completed';
    generated.timing.completedAt = new Date();
    generated.timing.duration = (generated.timing.completedAt.getTime() - generated.timing.startedAt!.getTime()) / 1000;
    generated.output = {
      url: `https://cdn.rescueping.com/reports/${generated.id}.${generated.format}`,
      size: Math.floor(Math.random() * 5000000) + 100000,
      pages: Math.floor(Math.random() * 20) + 5,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    report.analytics.avgGenerationTime = (
      report.analytics.avgGenerationTime * report.analytics.downloads + generated.timing.duration
    ) / (report.analytics.downloads + 1);

    this.emit('generation_completed', generated);
  }

  /**
   * Get generated reports
   */
  public getGeneratedReports(filter?: {
    reportId?: string;
    status?: GeneratedReport['status'];
    limit?: number;
  }): GeneratedReport[] {
    let generated = Array.from(this.generatedReports.values());
    if (filter?.reportId) generated = generated.filter((g) => g.reportId === filter.reportId);
    if (filter?.status) generated = generated.filter((g) => g.status === filter.status);
    generated = generated.sort((a, b) => b.timing.queuedAt.getTime() - a.timing.queuedAt.getTime());
    if (filter?.limit) generated = generated.slice(0, filter.limit);
    return generated;
  }

  /**
   * Get generated report
   */
  public getGeneratedReport(generatedId: string): GeneratedReport | undefined {
    return this.generatedReports.get(generatedId);
  }

  /**
   * Schedule report
   */
  public scheduleReport(
    reportId: string,
    schedule: Omit<ReportSchedule, 'id' | 'reportId' | 'runCount' | 'failureCount'>
  ): ReportSchedule {
    const report = this.reports.get(reportId);
    if (!report) throw new Error('Report not found');

    const newSchedule: ReportSchedule = {
      ...schedule,
      id: `sched-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      reportId,
      runCount: 0,
      failureCount: 0,
    };

    this.schedules.set(newSchedule.id, newSchedule);
    report.schedule = newSchedule;
    report.status = 'scheduled';

    this.emit('report_scheduled', newSchedule);

    return newSchedule;
  }

  /**
   * Get schedules
   */
  public getSchedules(filter?: { enabled?: boolean }): ReportSchedule[] {
    let schedules = Array.from(this.schedules.values());
    if (filter?.enabled !== undefined) schedules = schedules.filter((s) => s.enabled === filter.enabled);
    return schedules;
  }

  /**
   * Distribute report
   */
  public async distributeReport(generatedId: string): Promise<void> {
    const generated = this.generatedReports.get(generatedId);
    if (!generated) throw new Error('Generated report not found');
    if (generated.status !== 'completed') throw new Error('Report not completed');

    const report = this.reports.get(generated.reportId);
    if (!report?.distribution) return;

    generated.distribution = [];

    for (const dist of report.distribution) {
      if (!dist.enabled) continue;

      // Simulate distribution
      await new Promise((resolve) => setTimeout(resolve, 500));

      generated.distribution.push({
        method: dist.method,
        status: 'sent',
        sentAt: new Date(),
      });
    }

    this.emit('report_distributed', generated);
  }

  /**
   * Get stats
   */
  public getStats(period: { start: Date; end: Date }): ReportBuilderStats {
    const reports = Array.from(this.reports.values());
    const generated = Array.from(this.generatedReports.values()).filter(
      (g) => g.timing.queuedAt >= period.start && g.timing.queuedAt <= period.end
    );

    const byType: Record<ReportType, number> = {
      dashboard: 0, tabular: 0, chart: 0, pivot: 0, narrative: 0, composite: 0, kpi: 0, executive: 0,
    };
    reports.forEach((r) => byType[r.type]++);

    const byFormat: Record<ReportFormat, number> = {
      pdf: 0, excel: 0, csv: 0, html: 0, json: 0, powerpoint: 0, word: 0, image: 0,
    };
    generated.forEach((g) => byFormat[g.format]++);

    const total = reports.length || 1;
    const genTotal = generated.length || 1;

    return {
      period,
      overview: {
        totalReports: reports.length,
        activeReports: reports.filter((r) => r.status === 'published').length,
        scheduledReports: reports.filter((r) => r.status === 'scheduled').length,
        totalGenerations: generated.length,
        totalDistributions: generated.filter((g) => g.distribution?.some((d) => d.status === 'sent')).length,
      },
      byType: Object.entries(byType).map(([type, count]) => ({
        type: type as ReportType,
        count,
        percentage: (count / total) * 100,
      })),
      byFormat: Object.entries(byFormat).map(([format, count]) => ({
        format: format as ReportFormat,
        count,
        percentage: (count / genTotal) * 100,
      })),
      performance: {
        avgGenerationTime: generated.reduce((sum, g) => sum + (g.timing.duration || 0), 0) / genTotal,
        successRate: (generated.filter((g) => g.status === 'completed').length / genTotal) * 100,
        queueDepth: generated.filter((g) => g.status === 'queued').length,
        peakUsageHour: 10,
      },
      topReports: reports
        .sort((a, b) => b.analytics.views - a.analytics.views)
        .slice(0, 5)
        .map((r) => ({
          id: r.id,
          name: r.name,
          views: r.analytics.views,
          downloads: r.analytics.downloads,
        })),
      trends: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
        generations: Math.floor(Math.random() * 50) + 10,
        failures: Math.floor(Math.random() * 5),
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

export const reportBuilderService = ReportBuilderService.getInstance();
export type {
  ReportType,
  ReportFormat,
  ScheduleFrequency,
  DistributionMethod,
  ReportStatus,
  DataSourceType,
  ChartType,
  ReportDataSource,
  ReportParameter,
  DataTransformation,
  ReportElement,
  ReportTemplate,
  ReportDefinition,
  ReportSchedule,
  ReportDistribution,
  GeneratedReport,
  ReportBuilderStats,
};
