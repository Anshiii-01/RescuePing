/**
 * Template Management Service - #116
 * Template CRUD, versioning, variables, rendering, preview
 */

// Template type
type TemplateType = 'email' | 'sms' | 'push' | 'document' | 'report' | 'page' | 'component' | 'notification' | 'alert' | 'form';

// Template status
type TemplateStatus = 'draft' | 'review' | 'approved' | 'published' | 'deprecated' | 'archived';

// Variable type
type VariableType = 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object' | 'image' | 'url' | 'html' | 'markdown';

// Render format
type RenderFormat = 'html' | 'pdf' | 'text' | 'json' | 'xml' | 'markdown' | 'image';

// Template variable
interface TemplateVariable {
  name: string;
  type: VariableType;
  label: string;
  description?: string;
  required: boolean;
  defaultValue?: unknown;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    enum?: unknown[];
  };
  transform?: {
    type: 'uppercase' | 'lowercase' | 'capitalize' | 'trim' | 'format' | 'custom';
    format?: string;
    customFunction?: string;
  };
}

// Template section
interface TemplateSection {
  id: string;
  name: string;
  type: 'header' | 'body' | 'footer' | 'sidebar' | 'component' | 'conditional' | 'loop';
  content: string;
  condition?: string;
  loopVariable?: string;
  styling?: Record<string, string>;
  order: number;
  visible: boolean;
}

// Template version
interface TemplateVersion {
  id: string;
  version: string;
  templateId: string;
  content: string;
  sections: TemplateSection[];
  variables: TemplateVariable[];
  changelog: string;
  createdAt: Date;
  createdBy: string;
  approvedAt?: Date;
  approvedBy?: string;
  isLive: boolean;
}

// Template definition
interface Template {
  id: string;
  name: string;
  description: string;
  type: TemplateType;
  category: string;
  tags: string[];
  status: TemplateStatus;
  currentVersion: string;
  content: string;
  sections: TemplateSection[];
  variables: TemplateVariable[];
  styling: TemplateStyling;
  metadata: {
    subject?: string;
    sender?: string;
    replyTo?: string;
    cc?: string[];
    bcc?: string[];
    priority?: 'low' | 'normal' | 'high';
    [key: string]: unknown;
  };
  localization: {
    defaultLocale: string;
    translations: Record<string, {
      content: string;
      variables: Record<string, string>;
    }>;
  };
  permissions: {
    owner: string;
    editors: string[];
    viewers: string[];
    approvers: string[];
  };
  usage: {
    totalRenders: number;
    lastRendered?: Date;
    avgRenderTime: number;
    successRate: number;
  };
  audit: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    publishedAt?: Date;
    publishedBy?: string;
  };
}

// Template styling
interface TemplateStyling {
  theme: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    [key: string]: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    headingFontFamily?: string;
  };
  spacing: {
    padding: string;
    margin: string;
    gap: string;
  };
  customCSS?: string;
}

// Render request
interface RenderRequest {
  templateId: string;
  version?: string;
  format: RenderFormat;
  variables: Record<string, unknown>;
  locale?: string;
  options?: {
    preview?: boolean;
    minify?: boolean;
    inline?: boolean;
    watermark?: boolean;
    pageSize?: string;
    orientation?: 'portrait' | 'landscape';
    [key: string]: unknown;
  };
}

// Render result
interface RenderResult {
  id: string;
  templateId: string;
  version: string;
  format: RenderFormat;
  content: string;
  contentType: string;
  size: number;
  renderTime: number;
  cached: boolean;
  expiresAt?: Date;
  metadata: {
    variables: Record<string, unknown>;
    locale: string;
    options: Record<string, unknown>;
  };
  createdAt: Date;
}

// Preview request
interface PreviewRequest {
  templateId?: string;
  content: string;
  sections?: TemplateSection[];
  variables: TemplateVariable[];
  sampleData: Record<string, unknown>;
  format: RenderFormat;
  styling?: TemplateStyling;
}

// Preview result
interface PreviewResult {
  content: string;
  contentType: string;
  errors: { type: string; message: string; location?: string }[];
  warnings: { type: string; message: string; location?: string }[];
  variablesUsed: string[];
  variablesMissing: string[];
  renderTime: number;
}

// Template library item
interface TemplateLibraryItem {
  id: string;
  name: string;
  description: string;
  type: TemplateType;
  category: string;
  thumbnail: string;
  preview: string;
  popularity: number;
  rating: number;
  tags: string[];
  isPremium: boolean;
}

// Template comparison
interface TemplateComparison {
  version1: string;
  version2: string;
  differences: {
    type: 'added' | 'removed' | 'modified';
    path: string;
    oldValue?: unknown;
    newValue?: unknown;
  }[];
  contentDiff: string;
}

// Template stats
interface TemplateStats {
  period: { start: Date; end: Date };
  overview: {
    totalTemplates: number;
    publishedTemplates: number;
    totalRenders: number;
    avgRenderTime: number;
    successRate: number;
  };
  byType: {
    type: TemplateType;
    count: number;
    renders: number;
  }[];
  topTemplates: {
    id: string;
    name: string;
    type: TemplateType;
    renders: number;
  }[];
  renderTrend: {
    date: Date;
    renders: number;
    avgTime: number;
  }[];
}

class TemplateManagementService {
  private static instance: TemplateManagementService;
  private templates: Map<string, Template> = new Map();
  private versions: Map<string, TemplateVersion[]> = new Map();
  private renderResults: Map<string, RenderResult> = new Map();
  private library: Map<string, TemplateLibraryItem> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): TemplateManagementService {
    if (!TemplateManagementService.instance) {
      TemplateManagementService.instance = new TemplateManagementService();
    }
    return TemplateManagementService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize templates
    const templatesData: { name: string; type: TemplateType; category: string; status: TemplateStatus }[] = [
      { name: 'Emergency Alert', type: 'alert', category: 'Emergency', status: 'published' },
      { name: 'Weather Warning', type: 'notification', category: 'Weather', status: 'published' },
      { name: 'Evacuation Notice', type: 'email', category: 'Emergency', status: 'published' },
      { name: 'Safety Report', type: 'report', category: 'Reports', status: 'approved' },
      { name: 'Incident Summary', type: 'document', category: 'Reports', status: 'published' },
      { name: 'SMS Alert', type: 'sms', category: 'Emergency', status: 'published' },
      { name: 'Push Notification', type: 'push', category: 'Notifications', status: 'published' },
      { name: 'Landing Page', type: 'page', category: 'Pages', status: 'draft' },
      { name: 'Alert Card', type: 'component', category: 'Components', status: 'published' },
      { name: 'Feedback Form', type: 'form', category: 'Forms', status: 'published' },
    ];

    templatesData.forEach((t, idx) => {
      const variables: TemplateVariable[] = [
        { name: 'title', type: 'string', label: 'Title', required: true },
        { name: 'message', type: 'string', label: 'Message', required: true },
        { name: 'severity', type: 'string', label: 'Severity', required: false, defaultValue: 'medium', validation: { enum: ['low', 'medium', 'high', 'critical'] } },
        { name: 'timestamp', type: 'date', label: 'Timestamp', required: true },
        { name: 'location', type: 'object', label: 'Location', required: false },
        { name: 'recipientName', type: 'string', label: 'Recipient Name', required: false },
        { name: 'logoUrl', type: 'image', label: 'Logo URL', required: false },
        { name: 'actionUrl', type: 'url', label: 'Action URL', required: false },
      ];

      const sections: TemplateSection[] = [
        {
          id: 'header',
          name: 'Header',
          type: 'header',
          content: '<header><img src="{{logoUrl}}" alt="Logo"><h1>{{title}}</h1></header>',
          order: 1,
          visible: true,
        },
        {
          id: 'body',
          name: 'Body',
          type: 'body',
          content: '<main><p>{{message}}</p><span class="severity {{severity}}">{{severity}}</span></main>',
          order: 2,
          visible: true,
        },
        {
          id: 'footer',
          name: 'Footer',
          type: 'footer',
          content: '<footer><p>Sent at {{timestamp}}</p><a href="{{actionUrl}}">Take Action</a></footer>',
          order: 3,
          visible: true,
        },
      ];

      const template: Template = {
        id: `tmpl-${(idx + 1).toString().padStart(6, '0')}`,
        name: t.name,
        description: `${t.name} template for ${t.category.toLowerCase()}`,
        type: t.type,
        category: t.category,
        tags: [t.type, t.category.toLowerCase(), 'rescueping'],
        status: t.status,
        currentVersion: '1.0.0',
        content: sections.map((s) => s.content).join('\n'),
        sections,
        variables,
        styling: {
          theme: 'default',
          colors: {
            primary: '#4A90D9',
            secondary: '#6B7280',
            accent: '#F59E0B',
            background: '#ffffff',
            text: '#111827',
          },
          typography: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            lineHeight: '1.5',
          },
          spacing: {
            padding: '24px',
            margin: '16px',
            gap: '12px',
          },
        },
        metadata: {
          subject: t.type === 'email' ? `[RescuePing] {{title}}` : undefined,
          sender: t.type === 'email' ? 'alerts@rescueping.com' : undefined,
          priority: t.category === 'Emergency' ? 'high' : 'normal',
        },
        localization: {
          defaultLocale: 'en',
          translations: {
            es: {
              content: sections.map((s) => s.content).join('\n'),
              variables: { title: 'título', message: 'mensaje' },
            },
            fr: {
              content: sections.map((s) => s.content).join('\n'),
              variables: { title: 'titre', message: 'message' },
            },
          },
        },
        permissions: {
          owner: 'user-001',
          editors: ['user-002', 'user-003'],
          viewers: ['user-004', 'user-005'],
          approvers: ['user-006'],
        },
        usage: {
          totalRenders: Math.floor(Math.random() * 10000) + 500,
          lastRendered: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          avgRenderTime: Math.floor(Math.random() * 100) + 20,
          successRate: 95 + Math.random() * 5,
        },
        audit: {
          createdAt: new Date(Date.now() - idx * 30 * 24 * 60 * 60 * 1000),
          createdBy: 'user-001',
          updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          updatedBy: 'user-002',
          publishedAt: t.status === 'published' ? new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) : undefined,
          publishedBy: t.status === 'published' ? 'user-006' : undefined,
        },
      };

      this.templates.set(template.id, template);

      // Initialize versions
      const versions: TemplateVersion[] = [
        {
          id: `ver-${template.id}-001`,
          version: '1.0.0',
          templateId: template.id,
          content: template.content,
          sections: template.sections,
          variables: template.variables,
          changelog: 'Initial version',
          createdAt: template.audit.createdAt,
          createdBy: template.audit.createdBy,
          approvedAt: t.status === 'published' ? template.audit.publishedAt : undefined,
          approvedBy: t.status === 'published' ? template.audit.publishedBy : undefined,
          isLive: t.status === 'published',
        },
      ];
      this.versions.set(template.id, versions);
    });

    // Initialize library
    const libraryData: { name: string; type: TemplateType; category: string }[] = [
      { name: 'Basic Alert', type: 'alert', category: 'Emergency' },
      { name: 'Professional Email', type: 'email', category: 'Communication' },
      { name: 'Modern Report', type: 'report', category: 'Reports' },
      { name: 'Minimal Notification', type: 'notification', category: 'Notifications' },
      { name: 'Dashboard Card', type: 'component', category: 'Components' },
      { name: 'Contact Form', type: 'form', category: 'Forms' },
      { name: 'Landing Hero', type: 'page', category: 'Pages' },
      { name: 'SMS Compact', type: 'sms', category: 'Messages' },
    ];

    libraryData.forEach((l, idx) => {
      const item: TemplateLibraryItem = {
        id: `lib-${(idx + 1).toString().padStart(6, '0')}`,
        name: l.name,
        description: `A ${l.name.toLowerCase()} template for ${l.category.toLowerCase()}`,
        type: l.type,
        category: l.category,
        thumbnail: `https://cdn.rescueping.com/templates/${l.type}-${idx + 1}-thumb.png`,
        preview: `https://cdn.rescueping.com/templates/${l.type}-${idx + 1}-preview.png`,
        popularity: Math.floor(Math.random() * 1000) + 100,
        rating: 3.5 + Math.random() * 1.5,
        tags: [l.type, l.category.toLowerCase()],
        isPremium: idx % 3 === 0,
      };
      this.library.set(item.id, item);
    });
  }

  /**
   * Get templates
   */
  public getTemplates(filter?: {
    type?: TemplateType;
    status?: TemplateStatus;
    category?: string;
    owner?: string;
    limit?: number;
  }): Template[] {
    let templates = Array.from(this.templates.values());
    if (filter?.type) templates = templates.filter((t) => t.type === filter.type);
    if (filter?.status) templates = templates.filter((t) => t.status === filter.status);
    if (filter?.category) templates = templates.filter((t) => t.category === filter.category);
    if (filter?.owner) templates = templates.filter((t) => t.permissions.owner === filter.owner);
    templates = templates.sort((a, b) => b.audit.updatedAt.getTime() - a.audit.updatedAt.getTime());
    if (filter?.limit) templates = templates.slice(0, filter.limit);
    return templates;
  }

  /**
   * Get template
   */
  public getTemplate(templateId: string): Template | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Create template
   */
  public createTemplate(
    template: Omit<Template, 'id' | 'currentVersion' | 'usage' | 'audit'>
  ): Template {
    const newTemplate: Template = {
      ...template,
      id: `tmpl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      currentVersion: '1.0.0',
      usage: { totalRenders: 0, avgRenderTime: 0, successRate: 100 },
      audit: {
        createdAt: new Date(),
        createdBy: template.permissions.owner,
        updatedAt: new Date(),
        updatedBy: template.permissions.owner,
      },
    };

    this.templates.set(newTemplate.id, newTemplate);

    // Create initial version
    const initialVersion: TemplateVersion = {
      id: `ver-${newTemplate.id}-001`,
      version: '1.0.0',
      templateId: newTemplate.id,
      content: newTemplate.content,
      sections: newTemplate.sections,
      variables: newTemplate.variables,
      changelog: 'Initial version',
      createdAt: new Date(),
      createdBy: template.permissions.owner,
      isLive: false,
    };
    this.versions.set(newTemplate.id, [initialVersion]);

    this.emit('template_created', newTemplate);

    return newTemplate;
  }

  /**
   * Update template
   */
  public updateTemplate(templateId: string, updates: Partial<Template>, updatedBy: string): Template {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    Object.assign(template, updates, {
      audit: {
        ...template.audit,
        updatedAt: new Date(),
        updatedBy,
      },
    });

    this.emit('template_updated', template);

    return template;
  }

  /**
   * Delete template
   */
  public deleteTemplate(templateId: string): void {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    template.status = 'archived';
    this.emit('template_deleted', { templateId });
  }

  /**
   * Create version
   */
  public createVersion(
    templateId: string,
    version: string,
    changelog: string,
    createdBy: string
  ): TemplateVersion {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    const newVersion: TemplateVersion = {
      id: `ver-${templateId}-${Date.now()}`,
      version,
      templateId,
      content: template.content,
      sections: [...template.sections],
      variables: [...template.variables],
      changelog,
      createdAt: new Date(),
      createdBy,
      isLive: false,
    };

    const versions = this.versions.get(templateId) || [];
    versions.push(newVersion);
    this.versions.set(templateId, versions);

    template.currentVersion = version;
    template.audit.updatedAt = new Date();
    template.audit.updatedBy = createdBy;

    this.emit('version_created', newVersion);

    return newVersion;
  }

  /**
   * Get versions
   */
  public getVersions(templateId: string): TemplateVersion[] {
    return this.versions.get(templateId) || [];
  }

  /**
   * Get version
   */
  public getVersion(templateId: string, version: string): TemplateVersion | undefined {
    const versions = this.versions.get(templateId) || [];
    return versions.find((v) => v.version === version);
  }

  /**
   * Publish version
   */
  public publishVersion(templateId: string, version: string, approvedBy: string): TemplateVersion {
    const versions = this.versions.get(templateId);
    if (!versions) throw new Error('Template not found');

    const templateVersion = versions.find((v) => v.version === version);
    if (!templateVersion) throw new Error('Version not found');

    // Set all versions to not live
    versions.forEach((v) => (v.isLive = false));

    // Set this version to live
    templateVersion.isLive = true;
    templateVersion.approvedAt = new Date();
    templateVersion.approvedBy = approvedBy;

    // Update template status
    const template = this.templates.get(templateId);
    if (template) {
      template.status = 'published';
      template.audit.publishedAt = new Date();
      template.audit.publishedBy = approvedBy;
    }

    this.emit('version_published', templateVersion);

    return templateVersion;
  }

  /**
   * Compare versions
   */
  public compareVersions(templateId: string, version1: string, version2: string): TemplateComparison {
    const v1 = this.getVersion(templateId, version1);
    const v2 = this.getVersion(templateId, version2);

    if (!v1 || !v2) throw new Error('Version not found');

    const differences: TemplateComparison['differences'] = [];

    // Compare content
    if (v1.content !== v2.content) {
      differences.push({
        type: 'modified',
        path: 'content',
        oldValue: v1.content.substring(0, 100) + '...',
        newValue: v2.content.substring(0, 100) + '...',
      });
    }

    // Compare variables
    const v1Vars = new Set(v1.variables.map((v) => v.name));
    const v2Vars = new Set(v2.variables.map((v) => v.name));

    v2.variables.forEach((v) => {
      if (!v1Vars.has(v.name)) {
        differences.push({ type: 'added', path: `variables.${v.name}`, newValue: v });
      }
    });

    v1.variables.forEach((v) => {
      if (!v2Vars.has(v.name)) {
        differences.push({ type: 'removed', path: `variables.${v.name}`, oldValue: v });
      }
    });

    // Compare sections
    const v1Sections = new Set(v1.sections.map((s) => s.id));
    const v2Sections = new Set(v2.sections.map((s) => s.id));

    v2.sections.forEach((s) => {
      if (!v1Sections.has(s.id)) {
        differences.push({ type: 'added', path: `sections.${s.id}`, newValue: s });
      }
    });

    v1.sections.forEach((s) => {
      if (!v2Sections.has(s.id)) {
        differences.push({ type: 'removed', path: `sections.${s.id}`, oldValue: s });
      }
    });

    return {
      version1,
      version2,
      differences,
      contentDiff: this.generateDiff(v1.content, v2.content),
    };
  }

  /**
   * Generate diff (simplified)
   */
  private generateDiff(oldContent: string, newContent: string): string {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    
    let diff = '';
    const maxLines = Math.max(oldLines.length, newLines.length);

    for (let i = 0; i < maxLines; i++) {
      if (oldLines[i] !== newLines[i]) {
        if (oldLines[i]) diff += `- ${oldLines[i]}\n`;
        if (newLines[i]) diff += `+ ${newLines[i]}\n`;
      } else if (oldLines[i]) {
        diff += `  ${oldLines[i]}\n`;
      }
    }

    return diff;
  }

  /**
   * Render template
   */
  public renderTemplate(request: RenderRequest): RenderResult {
    const template = this.templates.get(request.templateId);
    if (!template) throw new Error('Template not found');

    const startTime = Date.now();

    // Get version content
    let content = template.content;
    if (request.version) {
      const version = this.getVersion(request.templateId, request.version);
      if (version) content = version.content;
    }

    // Get localized content
    if (request.locale && request.locale !== template.localization.defaultLocale) {
      const translation = template.localization.translations[request.locale];
      if (translation) content = translation.content;
    }

    // Replace variables
    Object.entries(request.variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, String(value));
    });

    // Apply transformations based on format
    if (request.format === 'text') {
      content = content.replace(/<[^>]*>/g, '');
    } else if (request.format === 'json') {
      content = JSON.stringify({ rendered: content, variables: request.variables });
    }

    // Minify if requested
    if (request.options?.minify && request.format === 'html') {
      content = content.replace(/\s+/g, ' ').replace(/>\s+</g, '><');
    }

    const renderTime = Date.now() - startTime;

    const result: RenderResult = {
      id: `render-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      templateId: request.templateId,
      version: request.version || template.currentVersion,
      format: request.format,
      content,
      contentType: this.getContentType(request.format),
      size: new Blob([content]).size,
      renderTime,
      cached: false,
      metadata: {
        variables: request.variables,
        locale: request.locale || template.localization.defaultLocale,
        options: request.options || {},
      },
      createdAt: new Date(),
    };

    this.renderResults.set(result.id, result);

    // Update usage stats
    template.usage.totalRenders++;
    template.usage.lastRendered = new Date();
    template.usage.avgRenderTime = (template.usage.avgRenderTime + renderTime) / 2;

    this.emit('template_rendered', result);

    return result;
  }

  /**
   * Preview template
   */
  public previewTemplate(request: PreviewRequest): PreviewResult {
    const startTime = Date.now();
    const errors: PreviewResult['errors'] = [];
    const warnings: PreviewResult['warnings'] = [];
    const variablesUsed: string[] = [];
    const variablesMissing: string[] = [];

    let content = request.content;

    // Check for variable usage
    const variableRegex = /\{\{(\w+)\}\}/g;
    let match;
    while ((match = variableRegex.exec(content)) !== null) {
      const varName = match[1];
      variablesUsed.push(varName);

      if (!(varName in request.sampleData)) {
        const variable = request.variables.find((v) => v.name === varName);
        if (variable?.required) {
          variablesMissing.push(varName);
          errors.push({
            type: 'missing_variable',
            message: `Required variable "${varName}" is missing`,
            location: `position ${match.index}`,
          });
        } else {
          warnings.push({
            type: 'optional_variable',
            message: `Optional variable "${varName}" has no value`,
            location: `position ${match.index}`,
          });
        }
      }
    }

    // Replace variables with sample data
    Object.entries(request.sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, String(value));
    });

    // Validate HTML if applicable
    if (request.format === 'html') {
      const openTags = (content.match(/<[a-z][^>]*[^/]>/gi) || []).length;
      const closeTags = (content.match(/<\/[a-z]+>/gi) || []).length;
      if (openTags !== closeTags) {
        warnings.push({
          type: 'html_validation',
          message: 'Unclosed HTML tags detected',
        });
      }
    }

    return {
      content,
      contentType: this.getContentType(request.format),
      errors,
      warnings,
      variablesUsed: [...new Set(variablesUsed)],
      variablesMissing,
      renderTime: Date.now() - startTime,
    };
  }

  /**
   * Get content type
   */
  private getContentType(format: RenderFormat): string {
    const contentTypes: Record<RenderFormat, string> = {
      html: 'text/html',
      pdf: 'application/pdf',
      text: 'text/plain',
      json: 'application/json',
      xml: 'application/xml',
      markdown: 'text/markdown',
      image: 'image/png',
    };
    return contentTypes[format] || 'text/plain';
  }

  /**
   * Get library
   */
  public getLibrary(filter?: { type?: TemplateType; category?: string }): TemplateLibraryItem[] {
    let items = Array.from(this.library.values());
    if (filter?.type) items = items.filter((i) => i.type === filter.type);
    if (filter?.category) items = items.filter((i) => i.category === filter.category);
    return items.sort((a, b) => b.popularity - a.popularity);
  }

  /**
   * Get library item
   */
  public getLibraryItem(itemId: string): TemplateLibraryItem | undefined {
    return this.library.get(itemId);
  }

  /**
   * Use library template
   */
  public useLibraryTemplate(itemId: string, owner: string): Template {
    const item = this.library.get(itemId);
    if (!item) throw new Error('Library item not found');

    // Increment popularity
    item.popularity++;

    // Create template from library item
    return this.createTemplate({
      name: `${item.name} - Copy`,
      description: item.description,
      type: item.type,
      category: item.category,
      tags: [...item.tags],
      status: 'draft',
      content: `<!-- ${item.name} Template -->\n<div class="template">\n  <h1>{{title}}</h1>\n  <p>{{message}}</p>\n</div>`,
      sections: [
        { id: 'main', name: 'Main', type: 'body', content: '<div class="template">{{content}}</div>', order: 1, visible: true },
      ],
      variables: [
        { name: 'title', type: 'string', label: 'Title', required: true },
        { name: 'message', type: 'string', label: 'Message', required: true },
      ],
      styling: {
        theme: 'default',
        colors: { primary: '#4A90D9', secondary: '#6B7280', accent: '#F59E0B', background: '#ffffff', text: '#111827' },
        typography: { fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: '1.5' },
        spacing: { padding: '24px', margin: '16px', gap: '12px' },
      },
      metadata: {},
      localization: { defaultLocale: 'en', translations: {} },
      permissions: { owner, editors: [], viewers: [], approvers: [] },
    });
  }

  /**
   * Clone template
   */
  public cloneTemplate(templateId: string, newName: string, owner: string): Template {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    return this.createTemplate({
      ...template,
      name: newName,
      status: 'draft',
      permissions: { owner, editors: [], viewers: [], approvers: [] },
    });
  }

  /**
   * Get stats
   */
  public getStats(period: { start: Date; end: Date }): TemplateStats {
    const templates = Array.from(this.templates.values());

    const byType: Record<TemplateType, { count: number; renders: number }> = {
      email: { count: 0, renders: 0 },
      sms: { count: 0, renders: 0 },
      push: { count: 0, renders: 0 },
      document: { count: 0, renders: 0 },
      report: { count: 0, renders: 0 },
      page: { count: 0, renders: 0 },
      component: { count: 0, renders: 0 },
      notification: { count: 0, renders: 0 },
      alert: { count: 0, renders: 0 },
      form: { count: 0, renders: 0 },
    };

    templates.forEach((t) => {
      byType[t.type].count++;
      byType[t.type].renders += t.usage.totalRenders;
    });

    const totalRenders = templates.reduce((sum, t) => sum + t.usage.totalRenders, 0);
    const avgRenderTime = templates.reduce((sum, t) => sum + t.usage.avgRenderTime, 0) / (templates.length || 1);
    const avgSuccessRate = templates.reduce((sum, t) => sum + t.usage.successRate, 0) / (templates.length || 1);

    return {
      period,
      overview: {
        totalTemplates: templates.length,
        publishedTemplates: templates.filter((t) => t.status === 'published').length,
        totalRenders,
        avgRenderTime,
        successRate: avgSuccessRate,
      },
      byType: Object.entries(byType).map(([type, data]) => ({
        type: type as TemplateType,
        count: data.count,
        renders: data.renders,
      })),
      topTemplates: templates
        .sort((a, b) => b.usage.totalRenders - a.usage.totalRenders)
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          name: t.name,
          type: t.type,
          renders: t.usage.totalRenders,
        })),
      renderTrend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
        renders: Math.floor(Math.random() * 1000) + 200,
        avgTime: Math.floor(Math.random() * 50) + 20,
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

export const templateManagementService = TemplateManagementService.getInstance();
export type {
  TemplateType,
  TemplateStatus,
  VariableType,
  RenderFormat,
  TemplateVariable,
  TemplateSection,
  TemplateVersion,
  Template,
  TemplateStyling,
  RenderRequest,
  RenderResult,
  PreviewRequest,
  PreviewResult,
  TemplateLibraryItem,
  TemplateComparison,
  TemplateStats,
};
