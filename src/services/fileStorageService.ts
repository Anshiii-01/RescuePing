/**
 * File Storage Service
 * Secure file upload, storage, and management with CDN support
 */

// File status
type FileStatus = 'uploading' | 'processing' | 'active' | 'archived' | 'deleted' | 'quarantined' | 'expired';

// Storage provider
type StorageProvider = 'local' | 's3' | 'gcs' | 'azure' | 'cloudinary' | 'firebase';

// File category
type FileCategory = 'document' | 'image' | 'video' | 'audio' | 'archive' | 'spreadsheet' | 'presentation' | 'other';

// Access level
type AccessLevel = 'public' | 'private' | 'authenticated' | 'restricted';

// Upload status
type UploadStatus = 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled';

// File entity
interface StoredFile {
  id: string;
  name: string;
  originalName: string;
  extension: string;
  mimeType: string;
  size: number;
  category: FileCategory;
  status: FileStatus;
  accessLevel: AccessLevel;
  path: string;
  bucket: string;
  provider: StorageProvider;
  url: string;
  cdnUrl?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  checksum: string;
  etag?: string;
  metadata: FileMetadata;
  uploadedBy: string;
  ownerId: string;
  ownerType: 'user' | 'organization' | 'system';
  parentFolderId?: string;
  tags: string[];
  versions: FileVersion[];
  currentVersion: number;
  isEncrypted: boolean;
  encryptionKey?: string;
  expiresAt?: Date;
  deletedAt?: Date;
  archivedAt?: Date;
  lastAccessedAt?: Date;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// File metadata
interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number; // for audio/video in seconds
  bitrate?: number;
  fps?: number;
  codec?: string;
  colorSpace?: string;
  pages?: number; // for documents
  wordCount?: number;
  hasAudio?: boolean;
  hasVideo?: boolean;
  gpsLatitude?: number;
  gpsLongitude?: number;
  capturedAt?: Date;
  cameraModel?: string;
  custom: Record<string, unknown>;
}

// File version
interface FileVersion {
  version: number;
  path: string;
  size: number;
  checksum: string;
  createdBy: string;
  createdAt: Date;
  comment?: string;
}

// Folder
interface Folder {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  ownerId: string;
  ownerType: 'user' | 'organization' | 'system';
  accessLevel: AccessLevel;
  color?: string;
  icon?: string;
  fileCount: number;
  folderCount: number;
  totalSize: number;
  permissions: FolderPermission[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Folder permission
interface FolderPermission {
  principalId: string;
  principalType: 'user' | 'group' | 'role';
  permissions: ('read' | 'write' | 'delete' | 'share' | 'admin')[];
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
}

// Upload session
interface UploadSession {
  id: string;
  status: UploadStatus;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBytes: number;
  progress: number;
  chunks: ChunkInfo[];
  totalChunks: number;
  uploadedChunks: number;
  uploadedBy: string;
  targetFolderId?: string;
  accessLevel: AccessLevel;
  metadata?: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
  expiresAt: Date;
  error?: string;
}

// Chunk info
interface ChunkInfo {
  index: number;
  size: number;
  checksum: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'failed';
  uploadedAt?: Date;
  retries: number;
}

// Download request
interface DownloadRequest {
  id: string;
  fileId: string;
  userId: string;
  type: 'direct' | 'zip' | 'stream';
  status: 'pending' | 'processing' | 'ready' | 'expired' | 'failed';
  downloadUrl?: string;
  expiresAt?: Date;
  ipAddress: string;
  userAgent: string;
  downloadedAt?: Date;
  createdAt: Date;
}

// File share
interface FileShare {
  id: string;
  fileId: string;
  sharedBy: string;
  sharedWith: ShareRecipient[];
  accessType: 'view' | 'download' | 'edit';
  password?: string;
  maxDownloads?: number;
  currentDownloads: number;
  expiresAt?: Date;
  notifyOnAccess: boolean;
  allowedIPs?: string[];
  shortUrl: string;
  isActive: boolean;
  accessLogs: ShareAccessLog[];
  createdAt: Date;
  updatedAt: Date;
}

// Share recipient
interface ShareRecipient {
  type: 'email' | 'user' | 'group' | 'public';
  value: string;
  notified: boolean;
  notifiedAt?: Date;
  firstAccessedAt?: Date;
}

// Share access log
interface ShareAccessLog {
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  userId?: string;
  action: 'view' | 'download';
  success: boolean;
  failureReason?: string;
}

// Storage quota
interface StorageQuota {
  userId: string;
  totalBytes: number;
  usedBytes: number;
  availableBytes: number;
  fileCount: number;
  maxFileSize: number;
  allowedTypes: string[];
  byCategory: { category: FileCategory; bytes: number; count: number }[];
  lastCalculatedAt: Date;
}

// Storage policy
interface StoragePolicy {
  id: string;
  name: string;
  description?: string;
  targetType: 'user' | 'organization' | 'role' | 'global';
  targetId?: string;
  rules: PolicyRule[];
  quotaBytes: number;
  maxFileSize: number;
  allowedMimeTypes: string[];
  blockedMimeTypes: string[];
  allowedExtensions: string[];
  blockedExtensions: string[];
  scanForViruses: boolean;
  scanForMalware: boolean;
  encryption: {
    required: boolean;
    algorithm: string;
  };
  retention: {
    enabled: boolean;
    days: number;
    action: 'delete' | 'archive';
  };
  versioning: {
    enabled: boolean;
    maxVersions: number;
  };
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

// Policy rule
interface PolicyRule {
  type: 'size' | 'type' | 'extension' | 'name' | 'content';
  condition: 'allow' | 'block' | 'warn';
  pattern?: string;
  maxSize?: number;
  message?: string;
}

// Image transformation
interface ImageTransformation {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  format?: 'jpeg' | 'png' | 'webp' | 'avif' | 'gif';
  quality?: number;
  blur?: number;
  grayscale?: boolean;
  rotate?: number;
  flip?: 'horizontal' | 'vertical' | 'both';
  crop?: { x: number; y: number; width: number; height: number };
  watermark?: {
    text?: string;
    image?: string;
    position: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    opacity: number;
  };
}

// File operation log
interface FileOperationLog {
  id: string;
  fileId: string;
  operation: 'upload' | 'download' | 'view' | 'delete' | 'restore' | 'share' | 'move' | 'copy' | 'rename' | 'update';
  userId: string;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, unknown>;
  success: boolean;
  error?: string;
  timestamp: Date;
}

// Virus scan result
interface VirusScanResult {
  fileId: string;
  scannedAt: Date;
  status: 'clean' | 'infected' | 'suspicious' | 'error';
  threats: string[];
  scanner: string;
  scanDuration: number;
}

// Storage stats
interface StorageStats {
  totalFiles: number;
  totalSize: number;
  byCategory: { category: FileCategory; count: number; size: number }[];
  byStatus: { status: FileStatus; count: number }[];
  byProvider: { provider: StorageProvider; count: number; size: number }[];
  uploadsToday: number;
  downloadsToday: number;
  activeShares: number;
  quarantinedFiles: number;
}

class FileStorageService {
  private static instance: FileStorageService;
  private files: Map<string, StoredFile> = new Map();
  private folders: Map<string, Folder> = new Map();
  private uploadSessions: Map<string, UploadSession> = new Map();
  private downloadRequests: Map<string, DownloadRequest> = new Map();
  private shares: Map<string, FileShare> = new Map();
  private quotas: Map<string, StorageQuota> = new Map();
  private policies: Map<string, StoragePolicy> = new Map();
  private operationLogs: FileOperationLog[] = [];
  private scanResults: Map<string, VirusScanResult> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): FileStorageService {
    if (!FileStorageService.instance) {
      FileStorageService.instance = new FileStorageService();
    }
    return FileStorageService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Create sample folders
    const rootFolders = [
      { id: 'folder-reports', name: 'Reports', path: '/reports', icon: '📊' },
      { id: 'folder-images', name: 'Images', path: '/images', icon: '🖼️' },
      { id: 'folder-documents', name: 'Documents', path: '/documents', icon: '📄' },
      { id: 'folder-videos', name: 'Videos', path: '/videos', icon: '🎬' },
      { id: 'folder-backups', name: 'Backups', path: '/backups', icon: '💾' },
    ];

    rootFolders.forEach((f) => {
      const folder: Folder = {
        id: f.id,
        name: f.name,
        path: f.path,
        ownerId: 'system',
        ownerType: 'system',
        accessLevel: 'authenticated',
        icon: f.icon,
        fileCount: Math.floor(Math.random() * 50),
        folderCount: Math.floor(Math.random() * 5),
        totalSize: Math.floor(Math.random() * 100) * 1024 * 1024,
        permissions: [],
        metadata: {},
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.folders.set(folder.id, folder);
    });

    // Create sample files
    const categories: FileCategory[] = ['document', 'image', 'video', 'audio', 'archive', 'spreadsheet'];
    const mimeTypes: Record<FileCategory, string[]> = {
      document: ['application/pdf', 'application/msword', 'text/plain'],
      image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      video: ['video/mp4', 'video/webm', 'video/quicktime'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
      archive: ['application/zip', 'application/x-rar', 'application/x-7z-compressed'],
      spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      presentation: ['application/vnd.ms-powerpoint'],
      other: ['application/octet-stream'],
    };

    for (let i = 0; i < 200; i++) {
      const category = categories[i % categories.length];
      const mimeTypeList = mimeTypes[category];
      const mimeType = mimeTypeList[i % mimeTypeList.length];
      const extension = this.getExtensionFromMimeType(mimeType);

      const file: StoredFile = {
        id: `file-${i.toString().padStart(6, '0')}`,
        name: `${category}_${i}.${extension}`,
        originalName: `Original ${category} file ${i}.${extension}`,
        extension,
        mimeType,
        size: Math.floor(Math.random() * 50) * 1024 * 1024 + 1024,
        category,
        status: Math.random() > 0.95 ? 'archived' : 'active',
        accessLevel: Math.random() > 0.7 ? 'public' : 'authenticated',
        path: `/${category}s/${category}_${i}.${extension}`,
        bucket: 'rescue-ping-storage',
        provider: 's3',
        url: `https://storage.rescueping.com/${category}s/${category}_${i}.${extension}`,
        cdnUrl: `https://cdn.rescueping.com/${category}s/${category}_${i}.${extension}`,
        thumbnailUrl: category === 'image' || category === 'video' ? `https://cdn.rescueping.com/thumbnails/${category}_${i}.jpg` : undefined,
        checksum: this.generateChecksum(`file-${i}`),
        metadata: this.generateMetadata(category),
        uploadedBy: `user-${(i % 20) + 1}`,
        ownerId: `user-${(i % 20) + 1}`,
        ownerType: 'user',
        parentFolderId: rootFolders[i % rootFolders.length].id,
        tags: [category, 'sample'],
        versions: [{
          version: 1,
          path: `/${category}s/${category}_${i}.${extension}`,
          size: Math.floor(Math.random() * 50) * 1024 * 1024 + 1024,
          checksum: this.generateChecksum(`file-${i}-v1`),
          createdBy: `user-${(i % 20) + 1}`,
          createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        }],
        currentVersion: 1,
        isEncrypted: Math.random() > 0.8,
        downloadCount: Math.floor(Math.random() * 100),
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };

      this.files.set(file.id, file);

      // Create scan result
      this.scanResults.set(file.id, {
        fileId: file.id,
        scannedAt: file.createdAt,
        status: Math.random() > 0.99 ? 'suspicious' : 'clean',
        threats: [],
        scanner: 'ClamAV',
        scanDuration: Math.floor(Math.random() * 5000),
      });
    }

    // Create sample storage policies
    const policies: Omit<StoragePolicy, 'createdAt' | 'updatedAt'>[] = [
      {
        id: 'policy-global',
        name: 'Global Storage Policy',
        description: 'Default policy for all users',
        targetType: 'global',
        rules: [
          { type: 'size', condition: 'block', maxSize: 100 * 1024 * 1024, message: 'File size exceeds 100MB limit' },
          { type: 'extension', condition: 'block', pattern: '\\.(exe|bat|cmd|sh)$', message: 'Executable files not allowed' },
        ],
        quotaBytes: 10 * 1024 * 1024 * 1024, // 10GB
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedMimeTypes: ['*'],
        blockedMimeTypes: ['application/x-executable', 'application/x-msdownload'],
        allowedExtensions: ['*'],
        blockedExtensions: ['exe', 'bat', 'cmd', 'sh', 'msi'],
        scanForViruses: true,
        scanForMalware: true,
        encryption: { required: false, algorithm: 'AES-256' },
        retention: { enabled: true, days: 365, action: 'archive' },
        versioning: { enabled: true, maxVersions: 10 },
        isActive: true,
        priority: 0,
      },
      {
        id: 'policy-admin',
        name: 'Admin Storage Policy',
        description: 'Extended storage for admins',
        targetType: 'role',
        targetId: 'admin',
        rules: [],
        quotaBytes: 100 * 1024 * 1024 * 1024, // 100GB
        maxFileSize: 1024 * 1024 * 1024, // 1GB
        allowedMimeTypes: ['*'],
        blockedMimeTypes: [],
        allowedExtensions: ['*'],
        blockedExtensions: [],
        scanForViruses: true,
        scanForMalware: true,
        encryption: { required: true, algorithm: 'AES-256' },
        retention: { enabled: false, days: 0, action: 'delete' },
        versioning: { enabled: true, maxVersions: 50 },
        isActive: true,
        priority: 10,
      },
    ];

    policies.forEach((policy) => {
      this.policies.set(policy.id, {
        ...policy,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      });
    });

    // Create sample quotas
    for (let i = 1; i <= 20; i++) {
      const quota: StorageQuota = {
        userId: `user-${i}`,
        totalBytes: 10 * 1024 * 1024 * 1024,
        usedBytes: Math.floor(Math.random() * 5 * 1024 * 1024 * 1024),
        availableBytes: 0,
        fileCount: Math.floor(Math.random() * 100),
        maxFileSize: 100 * 1024 * 1024,
        allowedTypes: ['*'],
        byCategory: categories.map((cat) => ({
          category: cat,
          bytes: Math.floor(Math.random() * 500 * 1024 * 1024),
          count: Math.floor(Math.random() * 20),
        })),
        lastCalculatedAt: new Date(),
      };
      quota.availableBytes = quota.totalBytes - quota.usedBytes;
      this.quotas.set(quota.userId, quota);
    }

    // Create sample shares
    for (let i = 0; i < 30; i++) {
      const fileId = `file-${(i * 5).toString().padStart(6, '0')}`;
      const share: FileShare = {
        id: `share-${i.toString().padStart(6, '0')}`,
        fileId,
        sharedBy: `user-${(i % 20) + 1}`,
        sharedWith: [
          { type: 'email', value: `recipient${i}@example.com`, notified: true, notifiedAt: new Date() },
        ],
        accessType: Math.random() > 0.5 ? 'download' : 'view',
        currentDownloads: Math.floor(Math.random() * 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notifyOnAccess: true,
        shortUrl: `https://share.rescueping.com/s/${this.generateShortCode()}`,
        isActive: true,
        accessLogs: [],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.shares.set(share.id, share);
    }

    // Create sample operation logs
    const operations: FileOperationLog['operation'][] = ['upload', 'download', 'view', 'delete', 'share'];
    for (let i = 0; i < 500; i++) {
      const log: FileOperationLog = {
        id: `log-${i.toString().padStart(8, '0')}`,
        fileId: `file-${(i % 200).toString().padStart(6, '0')}`,
        operation: operations[i % operations.length],
        userId: `user-${(i % 20) + 1}`,
        ipAddress: `192.168.${Math.floor(i / 256)}.${i % 256}`,
        userAgent: 'Mozilla/5.0',
        success: Math.random() > 0.05,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      };
      this.operationLogs.push(log);
    }
  }

  /**
   * Get extension from mime type
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const map: Record<string, string> = {
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'text/plain': 'txt',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'video/quicktime': 'mov',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
      'audio/ogg': 'ogg',
      'application/zip': 'zip',
      'application/x-rar': 'rar',
      'application/x-7z-compressed': '7z',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/vnd.ms-powerpoint': 'ppt',
    };
    return map[mimeType] || 'bin';
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
   * Generate metadata based on category
   */
  private generateMetadata(category: FileCategory): FileMetadata {
    const base: FileMetadata = { custom: {} };

    switch (category) {
      case 'image':
        return { ...base, width: Math.floor(Math.random() * 3000) + 800, height: Math.floor(Math.random() * 2000) + 600, colorSpace: 'sRGB' };
      case 'video':
        return { ...base, width: 1920, height: 1080, duration: Math.floor(Math.random() * 600) + 30, fps: 30, codec: 'H.264', hasAudio: true, hasVideo: true };
      case 'audio':
        return { ...base, duration: Math.floor(Math.random() * 300) + 60, bitrate: 320000, codec: 'MP3' };
      case 'document':
        return { ...base, pages: Math.floor(Math.random() * 50) + 1, wordCount: Math.floor(Math.random() * 5000) + 500 };
      default:
        return base;
    }
  }

  /**
   * Generate short code
   */
  private generateShortCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  /**
   * Start upload
   */
  public async startUpload(data: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string;
    targetFolderId?: string;
    accessLevel?: AccessLevel;
    metadata?: Record<string, unknown>;
    chunkSize?: number;
  }): Promise<UploadSession> {
    // Check quota
    const quota = this.quotas.get(data.uploadedBy);
    if (quota && quota.usedBytes + data.fileSize > quota.totalBytes) {
      throw new Error('Storage quota exceeded');
    }

    // Check policy
    const policy = this.getApplicablePolicy(data.uploadedBy);
    if (policy && data.fileSize > policy.maxFileSize) {
      throw new Error(`File size exceeds maximum allowed size of ${policy.maxFileSize} bytes`);
    }

    const chunkSize = data.chunkSize || 5 * 1024 * 1024; // 5MB default
    const totalChunks = Math.ceil(data.fileSize / chunkSize);

    const session: UploadSession = {
      id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      status: 'pending',
      fileName: data.fileName,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      uploadedBytes: 0,
      progress: 0,
      chunks: Array.from({ length: totalChunks }, (_, i) => ({
        index: i,
        size: i === totalChunks - 1 ? data.fileSize - (i * chunkSize) : chunkSize,
        checksum: '',
        status: 'pending',
        retries: 0,
      })),
      totalChunks,
      uploadedChunks: 0,
      uploadedBy: data.uploadedBy,
      targetFolderId: data.targetFolderId,
      accessLevel: data.accessLevel || 'private',
      metadata: data.metadata,
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    this.uploadSessions.set(session.id, session);
    this.emit('upload_started', session);

    return session;
  }

  /**
   * Upload chunk
   */
  public async uploadChunk(sessionId: string, chunkIndex: number, data: ArrayBuffer, checksum: string): Promise<{ uploaded: boolean; progress: number }> {
    const session = this.uploadSessions.get(sessionId);
    if (!session) throw new Error('Upload session not found');
    if (session.status === 'completed') throw new Error('Upload already completed');
    if (session.status === 'cancelled') throw new Error('Upload was cancelled');

    const chunk = session.chunks[chunkIndex];
    if (!chunk) throw new Error('Invalid chunk index');

    session.status = 'uploading';
    chunk.status = 'uploading';

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));

    chunk.status = 'uploaded';
    chunk.checksum = checksum;
    chunk.uploadedAt = new Date();

    session.uploadedChunks++;
    session.uploadedBytes += chunk.size;
    session.progress = Math.round((session.uploadedBytes / session.fileSize) * 100);

    // Check if all chunks uploaded
    if (session.uploadedChunks === session.totalChunks) {
      await this.finalizeUpload(session);
    }

    return { uploaded: true, progress: session.progress };
  }

  /**
   * Finalize upload
   */
  private async finalizeUpload(session: UploadSession): Promise<StoredFile> {
    session.status = 'completed';
    session.completedAt = new Date();

    const extension = session.fileName.split('.').pop() || 'bin';
    const category = this.getCategoryFromMimeType(session.mimeType);

    const file: StoredFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      name: session.fileName,
      originalName: session.fileName,
      extension,
      mimeType: session.mimeType,
      size: session.fileSize,
      category,
      status: 'processing',
      accessLevel: session.accessLevel,
      path: `/${category}s/${session.fileName}`,
      bucket: 'rescue-ping-storage',
      provider: 's3',
      url: `https://storage.rescueping.com/${category}s/${session.fileName}`,
      cdnUrl: `https://cdn.rescueping.com/${category}s/${session.fileName}`,
      checksum: this.generateChecksum(session.id),
      metadata: { custom: session.metadata || {} },
      uploadedBy: session.uploadedBy,
      ownerId: session.uploadedBy,
      ownerType: 'user',
      parentFolderId: session.targetFolderId,
      tags: [],
      versions: [{
        version: 1,
        path: `/${category}s/${session.fileName}`,
        size: session.fileSize,
        checksum: this.generateChecksum(session.id),
        createdBy: session.uploadedBy,
        createdAt: new Date(),
      }],
      currentVersion: 1,
      isEncrypted: false,
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Scan for viruses
    await this.scanFile(file);

    file.status = 'active';
    this.files.set(file.id, file);

    // Update quota
    this.updateQuota(file.ownerId, file.size);

    // Log operation
    this.logOperation(file.id, 'upload', file.uploadedBy);

    this.emit('upload_completed', file);

    return file;
  }

  /**
   * Get category from mime type
   */
  private getCategoryFromMimeType(mimeType: string): FileCategory {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z') || mimeType.includes('tar')) return 'archive';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word') || mimeType.startsWith('text/')) return 'document';
    return 'other';
  }

  /**
   * Scan file for viruses
   */
  private async scanFile(file: StoredFile): Promise<VirusScanResult> {
    // Simulate scanning
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result: VirusScanResult = {
      fileId: file.id,
      scannedAt: new Date(),
      status: Math.random() > 0.999 ? 'suspicious' : 'clean',
      threats: [],
      scanner: 'ClamAV',
      scanDuration: Math.floor(Math.random() * 5000),
    };

    this.scanResults.set(file.id, result);

    if (result.status !== 'clean') {
      file.status = 'quarantined';
      this.emit('file_quarantined', { file, scanResult: result });
    }

    return result;
  }

  /**
   * Update quota
   */
  private updateQuota(userId: string, bytesChange: number): void {
    const quota = this.quotas.get(userId);
    if (quota) {
      quota.usedBytes += bytesChange;
      quota.availableBytes = quota.totalBytes - quota.usedBytes;
      quota.fileCount += bytesChange > 0 ? 1 : -1;
      quota.lastCalculatedAt = new Date();
    }
  }

  /**
   * Log operation
   */
  private logOperation(fileId: string, operation: FileOperationLog['operation'], userId: string, details?: Record<string, unknown>): void {
    const log: FileOperationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      fileId,
      operation,
      userId,
      ipAddress: '127.0.0.1',
      userAgent: 'RescuePing/2.0',
      details,
      success: true,
      timestamp: new Date(),
    };

    this.operationLogs.push(log);
  }

  /**
   * Get applicable policy
   */
  private getApplicablePolicy(userId: string): StoragePolicy | undefined {
    return Array.from(this.policies.values())
      .filter((p) => p.isActive)
      .sort((a, b) => b.priority - a.priority)[0];
  }

  /**
   * Get file
   */
  public getFile(fileId: string): StoredFile | undefined {
    return this.files.get(fileId);
  }

  /**
   * Get files
   */
  public getFiles(filters?: {
    ownerId?: string;
    category?: FileCategory;
    status?: FileStatus;
    folderId?: string;
    tags?: string[];
    search?: string;
  }, page: number = 1, pageSize: number = 20): { files: StoredFile[]; total: number } {
    let files = Array.from(this.files.values());

    if (filters?.ownerId) {
      files = files.filter((f) => f.ownerId === filters.ownerId);
    }

    if (filters?.category) {
      files = files.filter((f) => f.category === filters.category);
    }

    if (filters?.status) {
      files = files.filter((f) => f.status === filters.status);
    }

    if (filters?.folderId) {
      files = files.filter((f) => f.parentFolderId === filters.folderId);
    }

    if (filters?.tags?.length) {
      files = files.filter((f) => filters.tags!.some((tag) => f.tags.includes(tag)));
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      files = files.filter((f) =>
        f.name.toLowerCase().includes(search) ||
        f.originalName.toLowerCase().includes(search)
      );
    }

    files.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = files.length;
    const startIndex = (page - 1) * pageSize;

    return {
      files: files.slice(startIndex, startIndex + pageSize),
      total,
    };
  }

  /**
   * Delete file
   */
  public deleteFile(fileId: string, userId: string, permanent: boolean = false): boolean {
    const file = this.files.get(fileId);
    if (!file) return false;

    if (permanent) {
      this.files.delete(fileId);
      this.updateQuota(file.ownerId, -file.size);
    } else {
      file.status = 'deleted';
      file.deletedAt = new Date();
      file.updatedAt = new Date();
    }

    this.logOperation(fileId, 'delete', userId, { permanent });
    this.emit('file_deleted', { fileId, permanent });

    return true;
  }

  /**
   * Restore file
   */
  public restoreFile(fileId: string, userId: string): boolean {
    const file = this.files.get(fileId);
    if (!file || file.status !== 'deleted') return false;

    file.status = 'active';
    file.deletedAt = undefined;
    file.updatedAt = new Date();

    this.logOperation(fileId, 'restore', userId);
    this.emit('file_restored', file);

    return true;
  }

  /**
   * Create download request
   */
  public createDownloadRequest(fileId: string, userId: string, ipAddress: string, userAgent: string): DownloadRequest {
    const file = this.files.get(fileId);
    if (!file) throw new Error('File not found');
    if (file.status !== 'active') throw new Error('File is not available for download');

    const request: DownloadRequest = {
      id: `dl-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      fileId,
      userId,
      type: 'direct',
      status: 'ready',
      downloadUrl: `${file.cdnUrl || file.url}?token=${this.generateShortCode()}`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      ipAddress,
      userAgent,
      createdAt: new Date(),
    };

    this.downloadRequests.set(request.id, request);

    file.downloadCount++;
    file.lastAccessedAt = new Date();

    this.logOperation(fileId, 'download', userId);
    this.emit('download_requested', request);

    return request;
  }

  /**
   * Create share
   */
  public createShare(data: {
    fileId: string;
    sharedBy: string;
    recipients: ShareRecipient[];
    accessType: FileShare['accessType'];
    password?: string;
    maxDownloads?: number;
    expiresAt?: Date;
    notifyOnAccess?: boolean;
  }): FileShare {
    const file = this.files.get(data.fileId);
    if (!file) throw new Error('File not found');

    const share: FileShare = {
      id: `share-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      fileId: data.fileId,
      sharedBy: data.sharedBy,
      sharedWith: data.recipients,
      accessType: data.accessType,
      password: data.password,
      maxDownloads: data.maxDownloads,
      currentDownloads: 0,
      expiresAt: data.expiresAt,
      notifyOnAccess: data.notifyOnAccess ?? true,
      shortUrl: `https://share.rescueping.com/s/${this.generateShortCode()}`,
      isActive: true,
      accessLogs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.shares.set(share.id, share);
    this.logOperation(data.fileId, 'share', data.sharedBy, { shareId: share.id });
    this.emit('share_created', share);

    return share;
  }

  /**
   * Get shares for file
   */
  public getSharesForFile(fileId: string): FileShare[] {
    return Array.from(this.shares.values()).filter((s) => s.fileId === fileId);
  }

  /**
   * Revoke share
   */
  public revokeShare(shareId: string): boolean {
    const share = this.shares.get(shareId);
    if (!share) return false;

    share.isActive = false;
    share.updatedAt = new Date();

    this.emit('share_revoked', share);
    return true;
  }

  /**
   * Get storage quota
   */
  public getStorageQuota(userId: string): StorageQuota | undefined {
    return this.quotas.get(userId);
  }

  /**
   * Get storage stats
   */
  public getStorageStats(): StorageStats {
    const files = Array.from(this.files.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const byCategory = new Map<FileCategory, { count: number; size: number }>();
    const byStatus = new Map<FileStatus, number>();
    const byProvider = new Map<StorageProvider, { count: number; size: number }>();

    let totalSize = 0;

    files.forEach((file) => {
      totalSize += file.size;

      const cat = byCategory.get(file.category) || { count: 0, size: 0 };
      cat.count++;
      cat.size += file.size;
      byCategory.set(file.category, cat);

      byStatus.set(file.status, (byStatus.get(file.status) || 0) + 1);

      const prov = byProvider.get(file.provider) || { count: 0, size: 0 };
      prov.count++;
      prov.size += file.size;
      byProvider.set(file.provider, prov);
    });

    const uploadsToday = this.operationLogs.filter(
      (log) => log.operation === 'upload' && log.timestamp >= today
    ).length;

    const downloadsToday = this.operationLogs.filter(
      (log) => log.operation === 'download' && log.timestamp >= today
    ).length;

    return {
      totalFiles: files.length,
      totalSize,
      byCategory: Array.from(byCategory.entries()).map(([category, stats]) => ({ category, ...stats })),
      byStatus: Array.from(byStatus.entries()).map(([status, count]) => ({ status, count })),
      byProvider: Array.from(byProvider.entries()).map(([provider, stats]) => ({ provider, ...stats })),
      uploadsToday,
      downloadsToday,
      activeShares: Array.from(this.shares.values()).filter((s) => s.isActive).length,
      quarantinedFiles: files.filter((f) => f.status === 'quarantined').length,
    };
  }

  /**
   * Get folders
   */
  public getFolders(parentId?: string): Folder[] {
    return Array.from(this.folders.values())
      .filter((f) => f.parentId === parentId);
  }

  /**
   * Create folder
   */
  public createFolder(data: {
    name: string;
    parentId?: string;
    ownerId: string;
    accessLevel?: AccessLevel;
  }): Folder {
    const parent = data.parentId ? this.folders.get(data.parentId) : undefined;
    const path = parent ? `${parent.path}/${data.name}` : `/${data.name}`;

    const folder: Folder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: data.name,
      path,
      parentId: data.parentId,
      ownerId: data.ownerId,
      ownerType: 'user',
      accessLevel: data.accessLevel || 'private',
      fileCount: 0,
      folderCount: 0,
      totalSize: 0,
      permissions: [],
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.folders.set(folder.id, folder);
    this.emit('folder_created', folder);

    return folder;
  }

  /**
   * Get image URL with transformation
   */
  public getTransformedImageUrl(fileId: string, transformation: ImageTransformation): string {
    const file = this.files.get(fileId);
    if (!file || file.category !== 'image') throw new Error('File is not an image');

    const params = new URLSearchParams();
    if (transformation.width) params.append('w', String(transformation.width));
    if (transformation.height) params.append('h', String(transformation.height));
    if (transformation.fit) params.append('fit', transformation.fit);
    if (transformation.format) params.append('f', transformation.format);
    if (transformation.quality) params.append('q', String(transformation.quality));

    return `${file.cdnUrl}?${params.toString()}`;
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

export const fileStorageService = FileStorageService.getInstance();
export type {
  FileStatus,
  StorageProvider,
  FileCategory,
  AccessLevel,
  UploadStatus,
  StoredFile,
  FileMetadata,
  FileVersion,
  Folder,
  FolderPermission,
  UploadSession,
  ChunkInfo,
  DownloadRequest,
  FileShare,
  ShareRecipient,
  ShareAccessLog,
  StorageQuota,
  StoragePolicy,
  PolicyRule,
  ImageTransformation,
  FileOperationLog,
  VirusScanResult,
  StorageStats,
};
