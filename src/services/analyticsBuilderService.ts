/**
 * Analytics Builder Service - #115
 * Widget library, drag-drop, data sources, sharing, embedding
 */

// Widget type
type WidgetType = 'chart' | 'metric' | 'table' | 'map' | 'gauge' | 'timeline' | 'funnel' | 'heatmap' | 'text' | 'image' | 'filter' | 'container';

// Chart variant
type ChartVariant = 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'scatter' | 'bubble' | 'radar' | 'treemap' | 'sankey' | 'waterfall' | 'candlestick';

// Dashboard status
type DashboardStatus = 'draft' | 'published' | 'archived' | 'deleted';

// Share permission
type SharePermission = 'view' | 'edit' | 'admin';

// Embed type
type EmbedType = 'iframe' | 'javascript' | 'api' | 'oembed';

// Data aggregation
type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'distinct' | 'first' | 'last' | 'median' | 'percentile';

// Widget definition
interface Widget {
  id: string;
  type: WidgetType;
  name: string;
  description?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
  config: WidgetConfig;
  dataBinding?: DataBinding;
  interactions?: WidgetInteraction[];
  styling: WidgetStyling;
  visibility?: {
    condition?: string;
    responsive?: {
      mobile: boolean;
      tablet: boolean;
      desktop: boolean;
    };
  };
  refreshRate?: number;
  caching?: {
    enabled: boolean;
    ttl: number;
  };
}

// Widget configuration
interface WidgetConfig {
  // Chart specific
  chartType?: ChartVariant;
  series?: {
    name: string;
    field: string;
    type?: ChartVariant;
    color?: string;
    yAxis?: number;
  }[];
  xAxis?: {
    field: string;
    type: 'category' | 'time' | 'value';
    label?: string;
  };
  yAxis?: {
    field?: string;
    type?: 'value' | 'log';
    label?: string;
    min?: number;
    max?: number;
  }[];
  legend?: {
    show: boolean;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
  
  // Metric specific
  metricField?: string;
  aggregation?: AggregationType;
  format?: string;
  prefix?: string;
  suffix?: string;
  comparison?: {
    enabled: boolean;
    field: string;
    type: 'previous_period' | 'target' | 'custom';
    value?: number;
  };
  
  // Table specific
  columns?: {
    field: string;
    label: string;
    width?: number;
    sortable?: boolean;
    filterable?: boolean;
    format?: string;
  }[];
  pagination?: {
    enabled: boolean;
    pageSize: number;
  };
  
  // Map specific
  mapType?: 'marker' | 'heatmap' | 'choropleth' | 'cluster';
  latField?: string;
  lngField?: string;
  valueField?: string;
  
  // Gauge specific
  minValue?: number;
  maxValue?: number;
  thresholds?: { value: number; color: string }[];
  
  // Filter specific
  filterField?: string;
  filterType?: 'select' | 'multiselect' | 'range' | 'date' | 'search';
  
  // Text specific
  content?: string;
  markdown?: boolean;
  
  // Container specific
  layout?: 'row' | 'column' | 'grid';
  childWidgets?: string[];
}

// Data binding
interface DataBinding {
  sourceId: string;
  query?: string;
  fields: string[];
  filters?: {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between' | 'contains' | 'startswith';
    value: unknown;
    parameterized?: boolean;
  }[];
  groupBy?: string[];
  orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  limit?: number;
  transformations?: DataTransformation[];
}

// Data transformation
interface DataTransformation {
  type: 'calculate' | 'filter' | 'aggregate' | 'pivot' | 'unpivot' | 'join' | 'format';
  config: Record<string, unknown>;
}

// Widget interaction
interface WidgetInteraction {
  type: 'click' | 'hover' | 'select' | 'filter' | 'drill';
  action: 'filter' | 'navigate' | 'popup' | 'highlight' | 'export' | 'custom';
  target?: string;
  params?: Record<string, string>;
}

// Widget styling
interface WidgetStyling {
  backgroundColor?: string;
  borderRadius?: number;
  border?: string;
  shadow?: boolean;
  padding?: number;
  margin?: number;
  titleStyle?: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
  };
  customCSS?: string;
}

// Dashboard definition
interface Dashboard {
  id: string;
  name: string;
  description: string;
  status: DashboardStatus;
  widgets: Widget[];
  layout: {
    type: 'grid' | 'freeform';
    columns: number;
    rowHeight: number;
    gap: number;
    responsive: {
      breakpoint: number;
      columns: number;
    }[];
  };
  dataSources: DashboardDataSource[];
  parameters: DashboardParameter[];
  theme: DashboardTheme;
  filters: GlobalFilter[];
  sharing: SharingConfig;
  embedding?: EmbeddingConfig;
  permissions: {
    owner: string;
    collaborators: { userId: string; permission: SharePermission }[];
    public: boolean;
  };
  analytics: {
    views: number;
    uniqueViewers: number;
    avgViewDuration: number;
    lastViewed?: Date;
  };
  versioning: {
    current: number;
    autosave: boolean;
    lastSaved: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Dashboard data source
interface DashboardDataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream' | 'custom';
  connection: Record<string, unknown>;
  schema: {
    fields: {
      name: string;
      type: 'string' | 'number' | 'date' | 'boolean' | 'geo' | 'array' | 'object';
      label?: string;
      description?: string;
    }[];
  };
  refresh: {
    type: 'manual' | 'interval' | 'realtime';
    interval?: number;
  };
  caching: {
    enabled: boolean;
    ttl: number;
  };
}

// Dashboard parameter
interface DashboardParameter {
  id: string;
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'daterange' | 'select' | 'multiselect';
  defaultValue?: unknown;
  options?: { value: unknown; label: string }[];
  required: boolean;
  visible: boolean;
}

// Dashboard theme
interface DashboardTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    chart: string[];
  };
  typography: {
    fontFamily: string;
    headingFontFamily?: string;
    baseFontSize: number;
  };
  spacing: {
    unit: number;
    widgetPadding: number;
    widgetGap: number;
  };
  custom?: Record<string, unknown>;
}

// Global filter
interface GlobalFilter {
  id: string;
  name: string;
  field: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'daterange' | 'search';
  dataSourceId: string;
  affectedWidgets: string[];
  defaultValue?: unknown;
  visible: boolean;
}

// Sharing configuration
interface SharingConfig {
  enabled: boolean;
  allowPublic: boolean;
  expiresAt?: Date;
  password?: boolean;
  watermark?: boolean;
  shareLinks: ShareLink[];
}

// Share link
interface ShareLink {
  id: string;
  url: string;
  type: 'view' | 'embed' | 'export';
  permission: SharePermission;
  createdAt: Date;
  expiresAt?: Date;
  accessCount: number;
  password?: string;
}

// Embedding configuration
interface EmbeddingConfig {
  enabled: boolean;
  allowedDomains: string[];
  type: EmbedType;
  code: string;
  options: {
    responsive: boolean;
    showHeader: boolean;
    showFilters: boolean;
    allowInteraction: boolean;
    theme?: string;
  };
}

// Widget library item
interface WidgetLibraryItem {
  id: string;
  name: string;
  description: string;
  type: WidgetType;
  category: string;
  thumbnail: string;
  defaultConfig: WidgetConfig;
  defaultStyling: WidgetStyling;
  supportedDataTypes: string[];
  interactive: boolean;
  premium: boolean;
  tags: string[];
  usageCount: number;
}

// Analytics builder stats
interface AnalyticsBuilderStats {
  period: { start: Date; end: Date };
  overview: {
    totalDashboards: number;
    publishedDashboards: number;
    totalWidgets: number;
    totalViews: number;
    uniqueViewers: number;
    avgViewDuration: number;
  };
  byWidgetType: {
    type: WidgetType;
    count: number;
    percentage: number;
  }[];
  topDashboards: {
    id: string;
    name: string;
    views: number;
    uniqueViewers: number;
  }[];
  engagement: {
    date: Date;
    views: number;
    interactions: number;
  }[];
}

class AnalyticsBuilderService {
  private static instance: AnalyticsBuilderService;
  private dashboards: Map<string, Dashboard> = new Map();
  private widgetLibrary: Map<string, WidgetLibraryItem> = new Map();
  private dataSources: Map<string, DashboardDataSource> = new Map();
  private themes: Map<string, DashboardTheme> = new Map();
  private shareLinks: Map<string, ShareLink> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): AnalyticsBuilderService {
    if (!AnalyticsBuilderService.instance) {
      AnalyticsBuilderService.instance = new AnalyticsBuilderService();
    }
    return AnalyticsBuilderService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize widget library
    const widgetsData: { name: string; type: WidgetType; category: string; desc: string }[] = [
      { name: 'Line Chart', type: 'chart', category: 'Charts', desc: 'Time series and trend visualization' },
      { name: 'Bar Chart', type: 'chart', category: 'Charts', desc: 'Categorical comparisons' },
      { name: 'Pie Chart', type: 'chart', category: 'Charts', desc: 'Part-to-whole relationships' },
      { name: 'Area Chart', type: 'chart', category: 'Charts', desc: 'Cumulative values over time' },
      { name: 'Metric Card', type: 'metric', category: 'KPIs', desc: 'Single value with comparison' },
      { name: 'Gauge', type: 'gauge', category: 'KPIs', desc: 'Progress toward a goal' },
      { name: 'Data Table', type: 'table', category: 'Tables', desc: 'Tabular data display' },
      { name: 'Interactive Map', type: 'map', category: 'Maps', desc: 'Geographic visualization' },
      { name: 'Heatmap', type: 'heatmap', category: 'Advanced', desc: 'Density visualization' },
      { name: 'Timeline', type: 'timeline', category: 'Advanced', desc: 'Event sequence display' },
      { name: 'Funnel', type: 'funnel', category: 'Advanced', desc: 'Conversion visualization' },
      { name: 'Filter Control', type: 'filter', category: 'Controls', desc: 'Interactive filtering' },
      { name: 'Text Box', type: 'text', category: 'Content', desc: 'Static or dynamic text' },
      { name: 'Image', type: 'image', category: 'Content', desc: 'Static or dynamic images' },
      { name: 'Container', type: 'container', category: 'Layout', desc: 'Group widgets together' },
    ];

    widgetsData.forEach((w, idx) => {
      const item: WidgetLibraryItem = {
        id: `widget-lib-${(idx + 1).toString().padStart(4, '0')}`,
        name: w.name,
        description: w.desc,
        type: w.type,
        category: w.category,
        thumbnail: `https://cdn.rescueping.com/widgets/${w.type}-${idx + 1}.png`,
        defaultConfig: {
          chartType: w.type === 'chart' ? ['line', 'bar', 'pie', 'area'][idx % 4] as ChartVariant : undefined,
        },
        defaultStyling: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          shadow: true,
          padding: 16,
        },
        supportedDataTypes: ['number', 'string', 'date'],
        interactive: ['chart', 'table', 'map', 'filter'].includes(w.type),
        premium: ['heatmap', 'timeline', 'funnel'].includes(w.type),
        tags: [w.category.toLowerCase(), w.type, 'analytics'],
        usageCount: Math.floor(Math.random() * 5000) + 500,
      };
      this.widgetLibrary.set(item.id, item);
    });

    // Initialize themes
    const themesData = [
      { name: 'Light', primary: '#4A90D9', background: '#ffffff' },
      { name: 'Dark', primary: '#60A5FA', background: '#1F2937' },
      { name: 'Corporate', primary: '#0066CC', background: '#F8FAFC' },
      { name: 'Vibrant', primary: '#8B5CF6', background: '#FEFCE8' },
    ];

    themesData.forEach((t, idx) => {
      const theme: DashboardTheme = {
        id: `theme-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        colors: {
          primary: t.primary,
          secondary: '#6B7280',
          accent: '#F59E0B',
          background: t.background,
          surface: t.name === 'Dark' ? '#374151' : '#ffffff',
          text: t.name === 'Dark' ? '#F9FAFB' : '#111827',
          textSecondary: t.name === 'Dark' ? '#9CA3AF' : '#6B7280',
          border: t.name === 'Dark' ? '#4B5563' : '#E5E7EB',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          chart: ['#4A90D9', '#2ECC71', '#E74C3C', '#9B59B6', '#F39C12', '#1ABC9C', '#E67E22', '#3498DB'],
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          headingFontFamily: 'Inter, sans-serif',
          baseFontSize: 14,
        },
        spacing: {
          unit: 8,
          widgetPadding: 16,
          widgetGap: 16,
        },
      };
      this.themes.set(theme.id, theme);
    });

    // Initialize data sources
    const dataSourcesData = [
      { name: 'Alert Metrics', type: 'database' },
      { name: 'User Activity', type: 'api' },
      { name: 'Incident Reports', type: 'database' },
      { name: 'Real-time Events', type: 'stream' },
      { name: 'Geographic Data', type: 'api' },
    ];

    dataSourcesData.forEach((ds, idx) => {
      const dataSource: DashboardDataSource = {
        id: `ds-${(idx + 1).toString().padStart(4, '0')}`,
        name: ds.name,
        type: ds.type as DashboardDataSource['type'],
        connection: {
          host: ds.type === 'database' ? 'db.rescueping.com' : undefined,
          apiUrl: ds.type !== 'database' ? `https://api.rescueping.com/${ds.name.toLowerCase().replace(' ', '-')}` : undefined,
        },
        schema: {
          fields: [
            { name: 'id', type: 'string', label: 'ID' },
            { name: 'timestamp', type: 'date', label: 'Timestamp' },
            { name: 'value', type: 'number', label: 'Value' },
            { name: 'category', type: 'string', label: 'Category' },
            { name: 'location', type: 'geo', label: 'Location' },
          ],
        },
        refresh: {
          type: ds.type === 'stream' ? 'realtime' : 'interval',
          interval: ds.type === 'stream' ? undefined : 60000,
        },
        caching: {
          enabled: ds.type !== 'stream',
          ttl: 300,
        },
      };
      this.dataSources.set(dataSource.id, dataSource);
    });

    // Initialize dashboards
    const dashboardsData = [
      { name: 'Emergency Overview', status: 'published', widgets: 8 },
      { name: 'User Analytics', status: 'published', widgets: 6 },
      { name: 'Incident Tracking', status: 'published', widgets: 10 },
      { name: 'Geographic Analysis', status: 'draft', widgets: 5 },
      { name: 'Performance Metrics', status: 'published', widgets: 7 },
    ];

    dashboardsData.forEach((d, idx) => {
      const widgets: Widget[] = [];
      for (let i = 0; i < d.widgets; i++) {
        const widgetTypes: WidgetType[] = ['metric', 'chart', 'chart', 'table', 'map', 'gauge', 'timeline', 'chart'];
        widgets.push({
          id: `w-${idx}-${i}`,
          type: widgetTypes[i % widgetTypes.length],
          name: `Widget ${i + 1}`,
          position: {
            x: (i % 4) * 3,
            y: Math.floor(i / 4) * 4,
            width: i === 0 ? 12 : 3,
            height: i === 0 ? 2 : 4,
          },
          config: {
            chartType: widgetTypes[i % widgetTypes.length] === 'chart' ? ['line', 'bar', 'pie', 'area'][i % 4] as ChartVariant : undefined,
            metricField: 'value',
            aggregation: 'sum',
          },
          dataBinding: {
            sourceId: `ds-${((i % 5) + 1).toString().padStart(4, '0')}`,
            fields: ['value', 'timestamp', 'category'],
          },
          styling: {
            backgroundColor: '#ffffff',
            borderRadius: 8,
            shadow: true,
            padding: 16,
          },
        });
      }

      const dashboard: Dashboard = {
        id: `dash-${(idx + 1).toString().padStart(6, '0')}`,
        name: d.name,
        description: `${d.name} dashboard for monitoring and analysis`,
        status: d.status as DashboardStatus,
        widgets,
        layout: {
          type: 'grid',
          columns: 12,
          rowHeight: 80,
          gap: 16,
          responsive: [
            { breakpoint: 768, columns: 6 },
            { breakpoint: 480, columns: 4 },
          ],
        },
        dataSources: Array.from(this.dataSources.values()).slice(0, 3),
        parameters: [
          { id: 'p1', name: 'dateRange', label: 'Date Range', type: 'daterange', required: true, visible: true },
          { id: 'p2', name: 'region', label: 'Region', type: 'select', required: false, visible: true, options: [
            { value: 'all', label: 'All Regions' },
            { value: 'north', label: 'North' },
            { value: 'south', label: 'South' },
          ]},
        ],
        theme: this.themes.get('theme-0001')!,
        filters: [
          {
            id: 'f1',
            name: 'Category Filter',
            field: 'category',
            type: 'multiselect',
            dataSourceId: 'ds-0001',
            affectedWidgets: widgets.map((w) => w.id),
            visible: true,
          },
        ],
        sharing: {
          enabled: true,
          allowPublic: idx === 0,
          shareLinks: [],
        },
        embedding: {
          enabled: d.status === 'published',
          allowedDomains: ['rescueping.com', '*.rescueping.com'],
          type: 'iframe',
          code: `<iframe src="https://analytics.rescueping.com/embed/dash-${idx + 1}" width="100%" height="600"></iframe>`,
          options: {
            responsive: true,
            showHeader: true,
            showFilters: true,
            allowInteraction: true,
          },
        },
        permissions: {
          owner: 'user-001',
          collaborators: [
            { userId: 'user-002', permission: 'edit' },
            { userId: 'user-003', permission: 'view' },
          ],
          public: idx === 0,
        },
        analytics: {
          views: Math.floor(Math.random() * 10000) + 1000,
          uniqueViewers: Math.floor(Math.random() * 2000) + 200,
          avgViewDuration: Math.floor(Math.random() * 300) + 60,
          lastViewed: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        },
        versioning: {
          current: 1,
          autosave: true,
          lastSaved: new Date(),
        },
        createdAt: new Date(Date.now() - idx * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        createdBy: 'user-001',
      };
      this.dashboards.set(dashboard.id, dashboard);
    });
  }

  /**
   * Get dashboards
   */
  public getDashboards(filter?: {
    status?: DashboardStatus;
    owner?: string;
    limit?: number;
  }): Dashboard[] {
    let dashboards = Array.from(this.dashboards.values());
    if (filter?.status) dashboards = dashboards.filter((d) => d.status === filter.status);
    if (filter?.owner) dashboards = dashboards.filter((d) => d.permissions.owner === filter.owner);
    dashboards = dashboards.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    if (filter?.limit) dashboards = dashboards.slice(0, filter.limit);
    return dashboards;
  }

  /**
   * Get dashboard
   */
  public getDashboard(dashboardId: string): Dashboard | undefined {
    return this.dashboards.get(dashboardId);
  }

  /**
   * Create dashboard
   */
  public createDashboard(
    dashboard: Omit<Dashboard, 'id' | 'analytics' | 'versioning' | 'createdAt' | 'updatedAt'>
  ): Dashboard {
    const newDashboard: Dashboard = {
      ...dashboard,
      id: `dash-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      analytics: { views: 0, uniqueViewers: 0, avgViewDuration: 0 },
      versioning: { current: 1, autosave: true, lastSaved: new Date() },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.dashboards.set(newDashboard.id, newDashboard);
    this.emit('dashboard_created', newDashboard);

    return newDashboard;
  }

  /**
   * Update dashboard
   */
  public updateDashboard(dashboardId: string, updates: Partial<Dashboard>): Dashboard {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    Object.assign(dashboard, updates, { updatedAt: new Date() });
    dashboard.versioning.current++;
    dashboard.versioning.lastSaved = new Date();

    this.emit('dashboard_updated', dashboard);

    return dashboard;
  }

  /**
   * Delete dashboard
   */
  public deleteDashboard(dashboardId: string): void {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    dashboard.status = 'deleted';
    this.emit('dashboard_deleted', { dashboardId });
  }

  /**
   * Add widget to dashboard
   */
  public addWidget(dashboardId: string, widget: Omit<Widget, 'id'>): Widget {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    const newWidget: Widget = {
      ...widget,
      id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    };

    dashboard.widgets.push(newWidget);
    dashboard.updatedAt = new Date();

    this.emit('widget_added', { dashboardId, widget: newWidget });

    return newWidget;
  }

  /**
   * Update widget
   */
  public updateWidget(dashboardId: string, widgetId: string, updates: Partial<Widget>): Widget {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    const widget = dashboard.widgets.find((w) => w.id === widgetId);
    if (!widget) throw new Error('Widget not found');

    Object.assign(widget, updates);
    dashboard.updatedAt = new Date();

    this.emit('widget_updated', { dashboardId, widget });

    return widget;
  }

  /**
   * Remove widget
   */
  public removeWidget(dashboardId: string, widgetId: string): void {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    dashboard.widgets = dashboard.widgets.filter((w) => w.id !== widgetId);
    dashboard.updatedAt = new Date();

    this.emit('widget_removed', { dashboardId, widgetId });
  }

  /**
   * Reorder widgets
   */
  public reorderWidgets(dashboardId: string, widgetPositions: { id: string; position: Widget['position'] }[]): void {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    widgetPositions.forEach((wp) => {
      const widget = dashboard.widgets.find((w) => w.id === wp.id);
      if (widget) {
        widget.position = wp.position;
      }
    });

    dashboard.updatedAt = new Date();
    this.emit('widgets_reordered', { dashboardId });
  }

  /**
   * Get widget library
   */
  public getWidgetLibrary(filter?: { category?: string; type?: WidgetType }): WidgetLibraryItem[] {
    let items = Array.from(this.widgetLibrary.values());
    if (filter?.category) items = items.filter((i) => i.category === filter.category);
    if (filter?.type) items = items.filter((i) => i.type === filter.type);
    return items.sort((a, b) => b.usageCount - a.usageCount);
  }

  /**
   * Get widget library item
   */
  public getWidgetLibraryItem(itemId: string): WidgetLibraryItem | undefined {
    return this.widgetLibrary.get(itemId);
  }

  /**
   * Get data sources
   */
  public getDataSources(): DashboardDataSource[] {
    return Array.from(this.dataSources.values());
  }

  /**
   * Get data source
   */
  public getDataSource(dataSourceId: string): DashboardDataSource | undefined {
    return this.dataSources.get(dataSourceId);
  }

  /**
   * Get themes
   */
  public getThemes(): DashboardTheme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Get theme
   */
  public getTheme(themeId: string): DashboardTheme | undefined {
    return this.themes.get(themeId);
  }

  /**
   * Create share link
   */
  public createShareLink(
    dashboardId: string,
    type: ShareLink['type'],
    permission: SharePermission,
    expiresAt?: Date
  ): ShareLink {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    const shareLink: ShareLink = {
      id: `share-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      url: `https://analytics.rescueping.com/shared/${dashboardId}/${Math.random().toString(36).substr(2, 12)}`,
      type,
      permission,
      createdAt: new Date(),
      expiresAt,
      accessCount: 0,
    };

    dashboard.sharing.shareLinks.push(shareLink);
    this.shareLinks.set(shareLink.id, shareLink);

    this.emit('share_link_created', shareLink);

    return shareLink;
  }

  /**
   * Get share link
   */
  public getShareLink(linkId: string): ShareLink | undefined {
    return this.shareLinks.get(linkId);
  }

  /**
   * Generate embed code
   */
  public generateEmbedCode(
    dashboardId: string,
    type: EmbedType,
    options?: EmbeddingConfig['options']
  ): string {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    const baseUrl = `https://analytics.rescueping.com/embed/${dashboardId}`;
    const params = new URLSearchParams();
    
    if (options) {
      if (options.theme) params.set('theme', options.theme);
      if (!options.showHeader) params.set('header', 'false');
      if (!options.showFilters) params.set('filters', 'false');
      if (!options.allowInteraction) params.set('interactive', 'false');
    }

    const embedUrl = params.toString() ? `${baseUrl}?${params}` : baseUrl;

    switch (type) {
      case 'iframe':
        return `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
      case 'javascript':
        return `<div id="rescueping-dashboard-${dashboardId}"></div>\n<script src="https://cdn.rescueping.com/embed.js" data-dashboard="${dashboardId}"></script>`;
      case 'api':
        return `GET ${embedUrl}/api/v1/data`;
      case 'oembed':
        return `https://analytics.rescueping.com/oembed?url=${encodeURIComponent(embedUrl)}`;
      default:
        return embedUrl;
    }
  }

  /**
   * Clone dashboard
   */
  public cloneDashboard(dashboardId: string, newName: string, createdBy: string): Dashboard {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    return this.createDashboard({
      ...dashboard,
      name: newName,
      status: 'draft',
      widgets: dashboard.widgets.map((w) => ({ ...w, id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` })),
      sharing: { enabled: false, allowPublic: false, shareLinks: [] },
      permissions: { owner: createdBy, collaborators: [], public: false },
      createdBy,
    });
  }

  /**
   * Export dashboard
   */
  public exportDashboard(dashboardId: string): Record<string, unknown> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      dashboard: {
        name: dashboard.name,
        description: dashboard.description,
        widgets: dashboard.widgets,
        layout: dashboard.layout,
        theme: dashboard.theme,
        filters: dashboard.filters,
      },
    };
  }

  /**
   * Get stats
   */
  public getStats(period: { start: Date; end: Date }): AnalyticsBuilderStats {
    const dashboards = Array.from(this.dashboards.values());
    const totalWidgets = dashboards.reduce((sum, d) => sum + d.widgets.length, 0);

    const byWidgetType: Record<WidgetType, number> = {
      chart: 0, metric: 0, table: 0, map: 0, gauge: 0, timeline: 0, funnel: 0, heatmap: 0, text: 0, image: 0, filter: 0, container: 0,
    };
    dashboards.forEach((d) => {
      d.widgets.forEach((w) => byWidgetType[w.type]++);
    });

    const total = totalWidgets || 1;

    return {
      period,
      overview: {
        totalDashboards: dashboards.length,
        publishedDashboards: dashboards.filter((d) => d.status === 'published').length,
        totalWidgets,
        totalViews: dashboards.reduce((sum, d) => sum + d.analytics.views, 0),
        uniqueViewers: dashboards.reduce((sum, d) => sum + d.analytics.uniqueViewers, 0),
        avgViewDuration: dashboards.reduce((sum, d) => sum + d.analytics.avgViewDuration, 0) / (dashboards.length || 1),
      },
      byWidgetType: Object.entries(byWidgetType).map(([type, count]) => ({
        type: type as WidgetType,
        count,
        percentage: (count / total) * 100,
      })),
      topDashboards: dashboards
        .sort((a, b) => b.analytics.views - a.analytics.views)
        .slice(0, 5)
        .map((d) => ({
          id: d.id,
          name: d.name,
          views: d.analytics.views,
          uniqueViewers: d.analytics.uniqueViewers,
        })),
      engagement: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
        views: Math.floor(Math.random() * 1000) + 200,
        interactions: Math.floor(Math.random() * 500) + 100,
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

export const analyticsBuilderService = AnalyticsBuilderService.getInstance();
export type {
  WidgetType,
  ChartVariant,
  DashboardStatus,
  SharePermission,
  EmbedType,
  AggregationType,
  Widget,
  WidgetConfig,
  DataBinding,
  DataTransformation,
  WidgetInteraction,
  WidgetStyling,
  Dashboard,
  DashboardDataSource,
  DashboardParameter,
  DashboardTheme,
  GlobalFilter,
  SharingConfig,
  ShareLink,
  EmbeddingConfig,
  WidgetLibraryItem,
  AnalyticsBuilderStats,
};
