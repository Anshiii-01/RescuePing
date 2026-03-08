/**
 * Asset Management Service
 * Digital asset organization, version control, and media management
 */

// Asset type
type AssetType = 'image' | 'video' | 'audio' | 'document' | 'spreadsheet' | 'presentation' | 'archive' | 'model' | 'font' | 'other';

// Asset status
type AssetStatus = 'processing' | 'active' | 'archived' | 'deleted' | 'quarantined' | 'pending_review';

// Asset visibility
type AssetVisibility = 'public' | 'private' | 'restricted' | 'internal';

// Processing status
type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Asset
interface Asset {
  id: string;
  name: string;
  description?: string;
  type: AssetType;
  status: AssetStatus;
  visibility: AssetVisibility;
  file: FileInfo;
  metadata: AssetMetadata;
  versions: AssetVersion[];
  currentVersionId: string;
  thumbnails: Thumbnail[];
  tags: string[];
  categories: string[];
  folderId?: string;
  collectionIds: string[];
  permissions: AssetPermission[];
  usage: AssetUsage;
  audit: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    deletedBy?: string;
    deletedAt?: Date;
  };
  expiresAt?: Date;
}

// File info
interface FileInfo {
  originalName: string;
  storagePath: string;
  storageUrl: string;
  cdnUrl?: string;
  mimeType: string;
  extension: string;
  size: number;
  checksum: string;
  encoding?: string;
}

// Asset metadata
interface AssetMetadata {
  width?: number;
  height?: number;
  duration?: number;
  frameRate?: number;
  bitrate?: number;
  codec?: string;
  colorSpace?: string;
  dpi?: number;
  pages?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  hasAlpha?: boolean;
  isAnimated?: boolean;
  capturedAt?: Date;
  location?: {
    lat: number;
    lng: number;
    altitude?: number;
    accuracy?: number;
  };
  camera?: {
    make: string;
    model: string;
    lens?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    focalLength?: number;
  };
  custom: Record<string, unknown>;
}

// Asset version
interface AssetVersion {
  id: string;
  versionNumber: number;
  label?: string;
  file: FileInfo;
  metadata: Partial<AssetMetadata>;
  changes?: string;
  createdBy: string;
  createdAt: Date;
  isCurrent: boolean;
}

// Thumbnail
interface Thumbnail {
  id: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  width: number;
  height: number;
  url: string;
  format: string;
}

// Asset permission
interface AssetPermission {
  principalType: 'user' | 'group' | 'role' | 'public';
  principalId: string;
  permissions: ('view' | 'download' | 'edit' | 'delete' | 'share' | 'manage')[];
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
}

// Asset usage
interface AssetUsage {
  viewCount: number;
  downloadCount: number;
  shareCount: number;
  embeddedIn: { type: string; id: string; name: string }[];
  lastAccessedAt?: Date;
  lastAccessedBy?: string;
}

// Folder
interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  path: string;
  visibility: AssetVisibility;
  assetCount: number;
  folderCount: number;
  size: number;
  color?: string;
  icon?: string;
  permissions: AssetPermission[];
  metadata: Record<string, unknown>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Collection
interface Collection {
  id: string;
  name: string;
  description?: string;
  coverAssetId?: string;
  assetIds: string[];
  visibility: AssetVisibility;
  type: 'manual' | 'smart';
  smartRules?: {
    conditions: { field: string; operator: string; value: unknown }[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
  };
  permissions: AssetPermission[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Upload session
interface UploadSession {
  id: string;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled';
  files: {
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'failed';
    assetId?: string;
    error?: string;
  }[];
  folderId?: string;
  options: {
    autoGenerateThumbnails: boolean;
    extractMetadata: boolean;
    detectDuplicates: boolean;
    applyWatermark?: string;
    targetFormat?: string;
  };
  totalSize: number;
  uploadedSize: number;
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  createdBy: string;
}

// Processing job
interface ProcessingJob {
  id: string;
  assetId: string;
  type: 'thumbnail' | 'transcode' | 'compress' | 'watermark' | 'extract_metadata' | 'ocr' | 'face_detection' | 'object_detection';
  status: ProcessingStatus;
  progress: number;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

// Storage quota
interface StorageQuota {
  userId?: string;
  teamId?: string;
  totalBytes: number;
  usedBytes: number;
  assetCount: number;
  limits: {
    maxFileSize: number;
    maxAssets: number;
    allowedTypes: string[];
    bandwidthMonthly: number;
  };
  usage: {
    byType: Record<string, { count: number; size: number }>;
    byMonth: { month: string; bytes: number; count: number }[];
  };
}

// Asset analytics
interface AssetAnalytics {
  period: { start: Date; end: Date };
  uploads: { count: number; size: number };
  downloads: { count: number; size: number };
  views: number;
  shares: number;
  topAssets: { assetId: string; name: string; views: number; downloads: number }[];
  byType: Record<string, { count: number; size: number }>;
  storageGrowth: { date: string; totalSize: number; assetCount: number }[];
  bandwidth: { date: string; ingress: number; egress: number }[];
}

// Transform preset
interface TransformPreset {
  id: string;
  name: string;
  description: string;
  type: AssetType;
  transforms: {
    action: 'resize' | 'crop' | 'rotate' | 'flip' | 'compress' | 'format' | 'watermark' | 'trim' | 'overlay';
    params: Record<string, unknown>;
  }[];
  outputFormat?: string;
  quality?: number;
  isDefault: boolean;
  createdAt: Date;
}

class AssetManagementService {
  private static instance: AssetManagementService;
  private assets: Map<string, Asset> = new Map();
  private folders: Map<string, Folder> = new Map();
  private collections: Map<string, Collection> = new Map();
  private uploadSessions: Map<string, UploadSession> = new Map();
  private processingJobs: Map<string, ProcessingJob> = new Map();
  private presets: Map<string, TransformPreset> = new Map();
  private quotas: Map<string, StorageQuota> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): AssetManagementService {
    if (!AssetManagementService.instance) {
      AssetManagementService.instance = new AssetManagementService();
    }
    return AssetManagementService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize folders
    const foldersData = [
      { name: 'Emergency Alerts', path: '/emergency-alerts', description: 'Emergency alert media' },
      { name: 'Shelter Documentation', path: '/shelter-documentation', description: 'Shelter photos and documents' },
      { name: 'Training Materials', path: '/training-materials', description: 'Volunteer training resources' },
      { name: 'Press Releases', path: '/press-releases', description: 'Official press releases' },
      { name: 'Reports', path: '/reports', description: 'Disaster reports and analysis' },
      { name: 'Maps', path: '/maps', description: 'Geographic maps and overlays' },
      { name: 'Infographics', path: '/infographics', description: 'Visual information graphics' },
      { name: 'Videos', path: '/videos', description: 'Video content' },
    ];

    foldersData.forEach((f, idx) => {
      const folder: Folder = {
        id: `folder-${(idx + 1).toString().padStart(4, '0')}`,
        name: f.name,
        description: f.description,
        path: f.path,
        visibility: 'internal',
        assetCount: Math.floor(Math.random() * 50) + 10,
        folderCount: Math.floor(Math.random() * 5),
        size: Math.floor(Math.random() * 500000000) + 10000000,
        color: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548', '#607D8B'][idx],
        permissions: [],
        metadata: {},
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.folders.set(folder.id, folder);
    });

    // Initialize assets
    const assetsData = [
      { name: 'Flood Warning Map - Mumbai', type: 'image', mimeType: 'image/png', size: 2500000, folderId: 'folder-0001' },
      { name: 'Cyclone Safety Guidelines', type: 'document', mimeType: 'application/pdf', size: 1500000, folderId: 'folder-0003' },
      { name: 'Emergency Evacuation Video', type: 'video', mimeType: 'video/mp4', size: 50000000, folderId: 'folder-0008' },
      { name: 'Shelter Location Photo - Chennai', type: 'image', mimeType: 'image/jpeg', size: 3500000, folderId: 'folder-0002' },
      { name: 'Disaster Response Training Audio', type: 'audio', mimeType: 'audio/mp3', size: 15000000, folderId: 'folder-0003' },
      { name: 'Relief Distribution Report', type: 'spreadsheet', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 500000, folderId: 'folder-0005' },
      { name: 'Press Release - Monsoon Alert', type: 'document', mimeType: 'application/pdf', size: 250000, folderId: 'folder-0004' },
      { name: 'Volunteer ID Card Template', type: 'image', mimeType: 'image/png', size: 800000, folderId: 'folder-0003' },
      { name: 'Earthquake Safety Infographic', type: 'image', mimeType: 'image/svg+xml', size: 150000, folderId: 'folder-0007' },
      { name: 'Emergency Contact List', type: 'spreadsheet', mimeType: 'application/vnd.ms-excel', size: 350000, folderId: 'folder-0001' },
      { name: 'Flood Affected Areas Overlay', type: 'image', mimeType: 'image/geojson', size: 450000, folderId: 'folder-0006' },
      { name: 'First Aid Training Presentation', type: 'presentation', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: 8500000, folderId: 'folder-0003' },
      { name: 'Shelter Capacity Dashboard', type: 'image', mimeType: 'image/png', size: 1200000, folderId: 'folder-0002' },
      { name: 'Disaster Impact Assessment', type: 'document', mimeType: 'application/pdf', size: 4500000, folderId: 'folder-0005' },
      { name: 'Warning Siren Audio', type: 'audio', mimeType: 'audio/wav', size: 2500000, folderId: 'folder-0001' },
    ];

    assetsData.forEach((a, idx) => {
      const asset: Asset = {
        id: `asset-${(idx + 1).toString().padStart(8, '0')}`,
        name: a.name,
        description: `${a.name} - Disaster management resource`,
        type: a.type as AssetType,
        status: 'active',
        visibility: 'internal',
        file: {
          originalName: `${a.name.toLowerCase().replace(/\s+/g, '_')}.${a.mimeType.split('/')[1]}`,
          storagePath: `/assets/${a.folderId}/${idx + 1}`,
          storageUrl: `https://storage.rescueping.com/assets/${idx + 1}`,
          cdnUrl: `https://cdn.rescueping.com/assets/${idx + 1}`,
          mimeType: a.mimeType,
          extension: a.mimeType.split('/')[1],
          size: a.size,
          checksum: Math.random().toString(36).substr(2, 32),
        },
        metadata: {
          width: a.type === 'image' || a.type === 'video' ? 1920 : undefined,
          height: a.type === 'image' || a.type === 'video' ? 1080 : undefined,
          duration: a.type === 'video' ? 180 : a.type === 'audio' ? 300 : undefined,
          pages: a.type === 'document' || a.type === 'presentation' ? Math.floor(Math.random() * 20) + 5 : undefined,
          orientation: a.type === 'image' ? 'landscape' : undefined,
          custom: {},
        },
        versions: [{
          id: `ver-${idx + 1}-1`,
          versionNumber: 1,
          file: {
            originalName: `${a.name.toLowerCase().replace(/\s+/g, '_')}.${a.mimeType.split('/')[1]}`,
            storagePath: `/assets/${a.folderId}/${idx + 1}/v1`,
            storageUrl: `https://storage.rescueping.com/assets/${idx + 1}/v1`,
            mimeType: a.mimeType,
            extension: a.mimeType.split('/')[1],
            size: a.size,
            checksum: Math.random().toString(36).substr(2, 32),
          },
          metadata: {},
          createdBy: 'admin',
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          isCurrent: true,
        }],
        currentVersionId: `ver-${idx + 1}-1`,
        thumbnails: a.type === 'image' || a.type === 'video' ? [
          { id: `thumb-${idx}-xs`, size: 'xs', width: 50, height: 50, url: `https://cdn.rescueping.com/thumbs/${idx}/xs.jpg`, format: 'jpeg' },
          { id: `thumb-${idx}-sm`, size: 'sm', width: 150, height: 150, url: `https://cdn.rescueping.com/thumbs/${idx}/sm.jpg`, format: 'jpeg' },
          { id: `thumb-${idx}-md`, size: 'md', width: 300, height: 300, url: `https://cdn.rescueping.com/thumbs/${idx}/md.jpg`, format: 'jpeg' },
          { id: `thumb-${idx}-lg`, size: 'lg', width: 600, height: 600, url: `https://cdn.rescueping.com/thumbs/${idx}/lg.jpg`, format: 'jpeg' },
        ] : [],
        tags: ['disaster-management', a.type, a.folderId?.replace('folder-', 'cat-') || 'uncategorized'],
        categories: [a.folderId?.replace('folder-', '') || 'general'],
        folderId: a.folderId,
        collectionIds: [],
        permissions: [],
        usage: {
          viewCount: Math.floor(Math.random() * 1000) + 100,
          downloadCount: Math.floor(Math.random() * 200) + 20,
          shareCount: Math.floor(Math.random() * 50) + 5,
          embeddedIn: [],
          lastAccessedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
        audit: {
          createdBy: 'admin',
          createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
          updatedBy: 'admin',
          updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      };
      this.assets.set(asset.id, asset);
    });

    // Initialize collections
    const collectionsData = [
      { name: 'Monsoon 2024 Alert Media', description: 'All media related to 2024 monsoon alerts', type: 'manual' },
      { name: 'Training Resources', description: 'Curated training materials', type: 'manual' },
      { name: 'Recent Uploads', description: 'Assets uploaded in the last 7 days', type: 'smart' },
      { name: 'High-Resolution Images', description: 'Images with resolution > 1080p', type: 'smart' },
      { name: 'Press Kit', description: 'Official media kit for press', type: 'manual' },
    ];

    collectionsData.forEach((c, idx) => {
      const collection: Collection = {
        id: `collection-${(idx + 1).toString().padStart(4, '0')}`,
        name: c.name,
        description: c.description,
        assetIds: Array.from(this.assets.keys()).slice(0, Math.floor(Math.random() * 5) + 2),
        visibility: 'internal',
        type: c.type as 'manual' | 'smart',
        smartRules: c.type === 'smart' ? {
          conditions: [{ field: 'createdAt', operator: 'within', value: '7d' }],
          sortBy: 'createdAt',
          sortOrder: 'desc',
        } : undefined,
        permissions: [],
        createdBy: 'admin',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.collections.set(collection.id, collection);
    });

    // Initialize transform presets
    const presetsData = [
      { name: 'Web Thumbnail', type: 'image', transforms: [{ action: 'resize', params: { width: 300, height: 200, fit: 'cover' } }, { action: 'compress', params: { quality: 80 } }] },
      { name: 'Social Media Square', type: 'image', transforms: [{ action: 'crop', params: { aspectRatio: '1:1' } }, { action: 'resize', params: { width: 1080, height: 1080 } }] },
      { name: 'Mobile Video', type: 'video', transforms: [{ action: 'resize', params: { width: 720, height: 1280 } }, { action: 'compress', params: { bitrate: '2M' } }] },
      { name: 'PDF Watermark', type: 'document', transforms: [{ action: 'watermark', params: { text: 'RESCUE PING', opacity: 0.3 } }] },
      { name: 'Audio Compress', type: 'audio', transforms: [{ action: 'compress', params: { bitrate: '128k', format: 'mp3' } }] },
    ];

    presetsData.forEach((p, idx) => {
      const preset: TransformPreset = {
        id: `preset-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: `Preset for ${p.name.toLowerCase()}`,
        type: p.type as AssetType,
        transforms: p.transforms as TransformPreset['transforms'],
        quality: 80,
        isDefault: idx === 0,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      };
      this.presets.set(preset.id, preset);
    });

    // Initialize default quota
    const quota: StorageQuota = {
      totalBytes: 100 * 1024 * 1024 * 1024, // 100 GB
      usedBytes: Array.from(this.assets.values()).reduce((sum, a) => sum + a.file.size, 0),
      assetCount: this.assets.size,
      limits: {
        maxFileSize: 500 * 1024 * 1024, // 500 MB
        maxAssets: 10000,
        allowedTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'application/vnd.*'],
        bandwidthMonthly: 1024 * 1024 * 1024 * 1024, // 1 TB
      },
      usage: {
        byType: {
          image: { count: 6, size: 8500000 },
          video: { count: 1, size: 50000000 },
          audio: { count: 2, size: 17500000 },
          document: { count: 3, size: 6250000 },
          spreadsheet: { count: 2, size: 850000 },
          presentation: { count: 1, size: 8500000 },
        },
        byMonth: [
          { month: '2024-01', bytes: 20000000, count: 5 },
          { month: '2024-02', bytes: 35000000, count: 8 },
          { month: '2024-03', bytes: 45000000, count: 12 },
        ],
      },
    };
    this.quotas.set('default', quota);
  }

  /**
   * Get asset
   */
  public getAsset(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  /**
   * Get assets
   */
  public getAssets(filter?: {
    type?: AssetType;
    folderId?: string;
    status?: AssetStatus;
    tags?: string[];
    search?: string;
    sortBy?: 'name' | 'createdAt' | 'size' | 'viewCount';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): { assets: Asset[]; total: number } {
    let assets = Array.from(this.assets.values());

    if (filter?.type) assets = assets.filter((a) => a.type === filter.type);
    if (filter?.folderId) assets = assets.filter((a) => a.folderId === filter.folderId);
    if (filter?.status) assets = assets.filter((a) => a.status === filter.status);
    if (filter?.tags) assets = assets.filter((a) => filter.tags!.some((t) => a.tags.includes(t)));
    if (filter?.search) {
      const search = filter.search.toLowerCase();
      assets = assets.filter((a) =>
        a.name.toLowerCase().includes(search) ||
        a.description?.toLowerCase().includes(search) ||
        a.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    // Sort
    const sortBy = filter?.sortBy || 'createdAt';
    const sortOrder = filter?.sortOrder || 'desc';
    assets.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = a.audit.createdAt.getTime() - b.audit.createdAt.getTime();
          break;
        case 'size':
          comparison = a.file.size - b.file.size;
          break;
        case 'viewCount':
          comparison = a.usage.viewCount - b.usage.viewCount;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    const total = assets.length;

    // Pagination
    if (filter?.offset) assets = assets.slice(filter.offset);
    if (filter?.limit) assets = assets.slice(0, filter.limit);

    return { assets, total };
  }

  /**
   * Upload asset
   */
  public async uploadAsset(file: {
    name: string;
    content: ArrayBuffer;
    mimeType: string;
    size: number;
  }, options?: {
    folderId?: string;
    description?: string;
    tags?: string[];
    visibility?: AssetVisibility;
    createdBy: string;
  }): Promise<Asset> {
    const type = this.getAssetType(file.mimeType);
    const extension = file.mimeType.split('/')[1] || 'bin';

    const asset: Asset = {
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: file.name,
      description: options?.description,
      type,
      status: 'processing',
      visibility: options?.visibility || 'private',
      file: {
        originalName: file.name,
        storagePath: `/assets/${Date.now()}/${file.name}`,
        storageUrl: `https://storage.rescueping.com/assets/${Date.now()}`,
        mimeType: file.mimeType,
        extension,
        size: file.size,
        checksum: await this.calculateChecksum(file.content),
      },
      metadata: { custom: {} },
      versions: [],
      currentVersionId: '',
      thumbnails: [],
      tags: options?.tags || [],
      categories: [],
      folderId: options?.folderId,
      collectionIds: [],
      permissions: [],
      usage: {
        viewCount: 0,
        downloadCount: 0,
        shareCount: 0,
        embeddedIn: [],
      },
      audit: {
        createdBy: options?.createdBy || 'system',
        createdAt: new Date(),
        updatedBy: options?.createdBy || 'system',
        updatedAt: new Date(),
      },
    };

    // Create initial version
    const version: AssetVersion = {
      id: `ver-${Date.now()}`,
      versionNumber: 1,
      file: { ...asset.file },
      metadata: {},
      createdBy: options?.createdBy || 'system',
      createdAt: new Date(),
      isCurrent: true,
    };

    asset.versions.push(version);
    asset.currentVersionId = version.id;

    this.assets.set(asset.id, asset);

    // Trigger processing
    await this.processAsset(asset.id);

    this.emit('asset_uploaded', asset);
    return asset;
  }

  /**
   * Process asset
   */
  private async processAsset(assetId: string): Promise<void> {
    const asset = this.assets.get(assetId);
    if (!asset) return;

    // Simulate metadata extraction
    if (asset.type === 'image') {
      asset.metadata.width = 1920;
      asset.metadata.height = 1080;
      asset.metadata.orientation = 'landscape';
    } else if (asset.type === 'video') {
      asset.metadata.width = 1920;
      asset.metadata.height = 1080;
      asset.metadata.duration = 180;
      asset.metadata.frameRate = 30;
    }

    // Generate thumbnails
    if (asset.type === 'image' || asset.type === 'video') {
      asset.thumbnails = [
        { id: `thumb-${asset.id}-xs`, size: 'xs', width: 50, height: 50, url: `${asset.file.cdnUrl}/thumb_xs.jpg`, format: 'jpeg' },
        { id: `thumb-${asset.id}-sm`, size: 'sm', width: 150, height: 150, url: `${asset.file.cdnUrl}/thumb_sm.jpg`, format: 'jpeg' },
        { id: `thumb-${asset.id}-md`, size: 'md', width: 300, height: 300, url: `${asset.file.cdnUrl}/thumb_md.jpg`, format: 'jpeg' },
      ];
    }

    asset.status = 'active';
    asset.audit.updatedAt = new Date();

    this.emit('asset_processed', asset);
  }

  /**
   * Update asset
   */
  public updateAsset(id: string, updates: Partial<Pick<Asset, 'name' | 'description' | 'tags' | 'visibility' | 'folderId'>>, updatedBy: string): Asset {
    const asset = this.assets.get(id);
    if (!asset) throw new Error('Asset not found');

    Object.assign(asset, updates);
    asset.audit.updatedBy = updatedBy;
    asset.audit.updatedAt = new Date();

    this.emit('asset_updated', asset);
    return asset;
  }

  /**
   * Delete asset
   */
  public deleteAsset(id: string, deletedBy: string): void {
    const asset = this.assets.get(id);
    if (!asset) throw new Error('Asset not found');

    asset.status = 'deleted';
    asset.audit.deletedBy = deletedBy;
    asset.audit.deletedAt = new Date();

    this.emit('asset_deleted', { id, deletedBy });
  }

  /**
   * Get folders
   */
  public getFolders(parentId?: string): Folder[] {
    return Array.from(this.folders.values())
      .filter((f) => f.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get folder
   */
  public getFolder(id: string): Folder | undefined {
    return this.folders.get(id);
  }

  /**
   * Create folder
   */
  public createFolder(data: { name: string; description?: string; parentId?: string; createdBy: string }): Folder {
    const parentPath = data.parentId ? this.folders.get(data.parentId)?.path || '' : '';

    const folder: Folder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: data.name,
      description: data.description,
      parentId: data.parentId,
      path: `${parentPath}/${data.name.toLowerCase().replace(/\s+/g, '-')}`,
      visibility: 'private',
      assetCount: 0,
      folderCount: 0,
      size: 0,
      permissions: [],
      metadata: {},
      createdBy: data.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.folders.set(folder.id, folder);
    this.emit('folder_created', folder);

    return folder;
  }

  /**
   * Get collections
   */
  public getCollections(): Collection[] {
    return Array.from(this.collections.values());
  }

  /**
   * Get collection
   */
  public getCollection(id: string): Collection | undefined {
    return this.collections.get(id);
  }

  /**
   * Create collection
   */
  public createCollection(data: { name: string; description?: string; assetIds?: string[]; type?: 'manual' | 'smart'; createdBy: string }): Collection {
    const collection: Collection = {
      id: `collection-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: data.name,
      description: data.description,
      assetIds: data.assetIds || [],
      visibility: 'private',
      type: data.type || 'manual',
      permissions: [],
      createdBy: data.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.collections.set(collection.id, collection);
    this.emit('collection_created', collection);

    return collection;
  }

  /**
   * Add asset to collection
   */
  public addToCollection(collectionId: string, assetId: string): void {
    const collection = this.collections.get(collectionId);
    if (!collection) throw new Error('Collection not found');

    if (!collection.assetIds.includes(assetId)) {
      collection.assetIds.push(assetId);
      collection.updatedAt = new Date();
    }
  }

  /**
   * Get presets
   */
  public getPresets(type?: AssetType): TransformPreset[] {
    let presets = Array.from(this.presets.values());
    if (type) presets = presets.filter((p) => p.type === type);
    return presets;
  }

  /**
   * Get quota
   */
  public getQuota(userId?: string): StorageQuota {
    return this.quotas.get(userId || 'default')!;
  }

  /**
   * Get analytics
   */
  public getAnalytics(period: { start: Date; end: Date }): AssetAnalytics {
    const assets = Array.from(this.assets.values()).filter(
      (a) => a.audit.createdAt >= period.start && a.audit.createdAt <= period.end
    );

    const byType: Record<string, { count: number; size: number }> = {};
    assets.forEach((a) => {
      if (!byType[a.type]) byType[a.type] = { count: 0, size: 0 };
      byType[a.type].count++;
      byType[a.type].size += a.file.size;
    });

    const topAssets = Array.from(this.assets.values())
      .sort((a, b) => b.usage.viewCount - a.usage.viewCount)
      .slice(0, 10)
      .map((a) => ({
        assetId: a.id,
        name: a.name,
        views: a.usage.viewCount,
        downloads: a.usage.downloadCount,
      }));

    return {
      period,
      uploads: { count: assets.length, size: assets.reduce((sum, a) => sum + a.file.size, 0) },
      downloads: { count: Math.floor(Math.random() * 500), size: Math.floor(Math.random() * 100000000) },
      views: Math.floor(Math.random() * 5000),
      shares: Math.floor(Math.random() * 200),
      topAssets,
      byType,
      storageGrowth: [],
      bandwidth: [],
    };
  }

  /**
   * Search assets
   */
  public search(query: string, options?: { types?: AssetType[]; limit?: number }): Asset[] {
    const lowerQuery = query.toLowerCase();

    return Array.from(this.assets.values())
      .filter((a) => {
        if (options?.types && !options.types.includes(a.type)) return false;

        return (
          a.name.toLowerCase().includes(lowerQuery) ||
          a.description?.toLowerCase().includes(lowerQuery) ||
          a.tags.some((t) => t.toLowerCase().includes(lowerQuery))
        );
      })
      .slice(0, options?.limit || 20);
  }

  /**
   * Get asset type from mime type
   */
  private getAssetType(mimeType: string): AssetType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'document';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return 'archive';
    return 'other';
  }

  /**
   * Calculate checksum
   */
  private async calculateChecksum(_content: ArrayBuffer): Promise<string> {
    // Simplified checksum calculation
    return Math.random().toString(36).substr(2, 32);
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

export const assetManagementService = AssetManagementService.getInstance();
export type {
  AssetType,
  AssetStatus,
  AssetVisibility,
  ProcessingStatus,
  Asset,
  FileInfo,
  AssetMetadata,
  AssetVersion,
  Thumbnail,
  AssetPermission,
  AssetUsage,
  Folder,
  Collection,
  UploadSession,
  ProcessingJob,
  StorageQuota,
  AssetAnalytics,
  TransformPreset,
};
