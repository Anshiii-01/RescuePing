/**
 * Image Processing Service - #110
 * Resizing, compression, format conversion, CDN integration, lazy loading
 */

// Image format types
type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'svg' | 'bmp' | 'tiff' | 'heic';

// Resize mode
type ResizeMode = 'contain' | 'cover' | 'fill' | 'inside' | 'outside' | 'none';

// Compression quality preset
type QualityPreset = 'ultra' | 'high' | 'medium' | 'low' | 'thumbnail';

// CDN provider
type CDNProvider = 'cloudflare' | 'cloudinary' | 'imgix' | 'fastly' | 'akamai' | 'aws_cloudfront' | 'bunny';

// Image status
type ImageStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cached' | 'expired';

// Processing operation
type ProcessingOperation = 'resize' | 'compress' | 'convert' | 'crop' | 'rotate' | 'flip' | 'watermark' | 'blur' | 'sharpen' | 'grayscale' | 'sepia' | 'brightness' | 'contrast' | 'saturation';

// Image metadata
interface ImageMetadata {
  width: number;
  height: number;
  format: ImageFormat;
  size: number;
  colorSpace: string;
  hasAlpha: boolean;
  orientation: number;
  dpi: number;
  createdAt?: Date;
  camera?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  exif?: Record<string, unknown>;
}

// Image variant
interface ImageVariant {
  id: string;
  name: string;
  width: number;
  height: number;
  format: ImageFormat;
  quality: number;
  size: number;
  url: string;
  cdnUrl?: string;
  createdAt: Date;
}

// Processing options
interface ProcessingOptions {
  resize?: {
    width?: number;
    height?: number;
    mode: ResizeMode;
    upscale: boolean;
    background?: string;
  };
  compress?: {
    quality: number;
    progressive: boolean;
    optimizeColors: boolean;
  };
  convert?: {
    format: ImageFormat;
    preserveMetadata: boolean;
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rotate?: {
    angle: number;
    background?: string;
  };
  flip?: {
    horizontal: boolean;
    vertical: boolean;
  };
  watermark?: {
    image?: string;
    text?: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
    scale: number;
  };
  effects?: {
    blur?: number;
    sharpen?: number;
    grayscale?: boolean;
    sepia?: boolean;
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
}

// Image preset
interface ImagePreset {
  id: string;
  name: string;
  description: string;
  operations: ProcessingOptions;
  outputFormat: ImageFormat;
  quality: number;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

// Processed image
interface ProcessedImage {
  id: string;
  originalId: string;
  originalUrl: string;
  originalMetadata: ImageMetadata;
  variants: ImageVariant[];
  operations: ProcessingOperation[];
  processingTime: number;
  status: ImageStatus;
  error?: string;
  cdnIntegration?: {
    provider: CDNProvider;
    urls: Record<string, string>;
    cacheStatus: 'hit' | 'miss' | 'expired' | 'bypass';
    ttl: number;
  };
  lazyLoading?: {
    placeholder: string;
    blurhash: string;
    lqip: string;
    dominantColor: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// CDN configuration
interface CDNConfiguration {
  id: string;
  provider: CDNProvider;
  enabled: boolean;
  baseUrl: string;
  apiKey?: string;
  settings: {
    autoFormat: boolean;
    autoCompress: boolean;
    responsiveImages: boolean;
    lazyLoading: boolean;
    cacheControl: string;
    ttl: number;
  };
  transformations: {
    defaultQuality: number;
    defaultFormat: ImageFormat;
    maxWidth: number;
    maxHeight: number;
  };
  purgeSettings: {
    enabled: boolean;
    batchSize: number;
    cooldownPeriod: number;
  };
  analytics: {
    bandwidth: number;
    requests: number;
    cacheHitRatio: number;
  };
}

// Processing job
interface ProcessingJob {
  id: string;
  imageId: string;
  operations: ProcessingOptions;
  priority: number;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: ProcessedImage;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedDuration: number;
}

// Batch processing request
interface BatchProcessingRequest {
  id: string;
  name: string;
  images: string[];
  operations: ProcessingOptions;
  preset?: string;
  priority: number;
  status: 'pending' | 'processing' | 'completed' | 'partially_completed' | 'failed';
  progress: {
    total: number;
    processed: number;
    failed: number;
  };
  results: ProcessedImage[];
  createdAt: Date;
  completedAt?: Date;
}

// Image optimization stats
interface OptimizationStats {
  period: { start: Date; end: Date };
  totalImages: number;
  totalOriginalSize: number;
  totalOptimizedSize: number;
  compressionRatio: number;
  avgProcessingTime: number;
  formatDistribution: Record<ImageFormat, number>;
  operationStats: Record<ProcessingOperation, number>;
  cdnStats: {
    totalRequests: number;
    bandwidth: number;
    cacheHitRatio: number;
    avgLatency: number;
  };
}

// Lazy loading configuration
interface LazyLoadingConfig {
  enabled: boolean;
  strategy: 'intersection' | 'scroll' | 'idle' | 'eager';
  placeholder: 'blur' | 'color' | 'skeleton' | 'lqip' | 'none';
  threshold: number;
  rootMargin: string;
  loadDelay: number;
  fadeInDuration: number;
  preloadCount: number;
}

// Responsive breakpoint
interface ResponsiveBreakpoint {
  name: string;
  width: number;
  density: number;
  format: ImageFormat;
  quality: number;
}

// Image analysis result
interface ImageAnalysisResult {
  imageId: string;
  dominantColors: string[];
  colorPalette: { color: string; percentage: number }[];
  brightness: number;
  contrast: number;
  sharpness: number;
  noiseLevel: number;
  compressionArtifacts: number;
  faces?: { x: number; y: number; width: number; height: number }[];
  objects?: { label: string; confidence: number; bounds: { x: number; y: number; width: number; height: number } }[];
  text?: { content: string; confidence: number; bounds: { x: number; y: number; width: number; height: number } }[];
  nsfw?: { score: number; category: string };
  quality: {
    overall: number;
    aesthetic: number;
    technical: number;
  };
}

class ImageProcessingService {
  private static instance: ImageProcessingService;
  private images: Map<string, ProcessedImage> = new Map();
  private presets: Map<string, ImagePreset> = new Map();
  private jobs: Map<string, ProcessingJob> = new Map();
  private batchRequests: Map<string, BatchProcessingRequest> = new Map();
  private cdnConfigs: Map<string, CDNConfiguration> = new Map();
  private lazyLoadConfig: LazyLoadingConfig;
  private responsiveBreakpoints: ResponsiveBreakpoint[] = [];
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.lazyLoadConfig = {
      enabled: true,
      strategy: 'intersection',
      placeholder: 'blur',
      threshold: 0.1,
      rootMargin: '50px',
      loadDelay: 0,
      fadeInDuration: 300,
      preloadCount: 2,
    };
    this.initializeSampleData();
  }

  public static getInstance(): ImageProcessingService {
    if (!ImageProcessingService.instance) {
      ImageProcessingService.instance = new ImageProcessingService();
    }
    return ImageProcessingService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize responsive breakpoints
    this.responsiveBreakpoints = [
      { name: 'mobile', width: 320, density: 1, format: 'webp', quality: 80 },
      { name: 'mobile-2x', width: 640, density: 2, format: 'webp', quality: 75 },
      { name: 'tablet', width: 768, density: 1, format: 'webp', quality: 80 },
      { name: 'tablet-2x', width: 1536, density: 2, format: 'webp', quality: 75 },
      { name: 'desktop', width: 1024, density: 1, format: 'webp', quality: 85 },
      { name: 'desktop-2x', width: 2048, density: 2, format: 'webp', quality: 80 },
      { name: 'wide', width: 1440, density: 1, format: 'webp', quality: 85 },
      { name: 'ultra', width: 2560, density: 1, format: 'webp', quality: 90 },
    ];

    // Initialize presets
    const presetsData = [
      { name: 'thumbnail', desc: 'Small thumbnail for listings', width: 150, height: 150, quality: 70 },
      { name: 'preview', desc: 'Medium preview image', width: 400, height: 300, quality: 80 },
      { name: 'hero', desc: 'Large hero banner image', width: 1920, height: 600, quality: 85 },
      { name: 'avatar', desc: 'User profile avatar', width: 200, height: 200, quality: 80 },
      { name: 'og-image', desc: 'Open Graph social sharing', width: 1200, height: 630, quality: 85 },
      { name: 'product', desc: 'E-commerce product image', width: 800, height: 800, quality: 90 },
    ];

    presetsData.forEach((p, idx) => {
      const preset: ImagePreset = {
        id: `preset-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: p.desc,
        operations: {
          resize: {
            width: p.width,
            height: p.height,
            mode: p.name === 'avatar' ? 'cover' : 'contain',
            upscale: false,
          },
          compress: {
            quality: p.quality,
            progressive: true,
            optimizeColors: true,
          },
        },
        outputFormat: 'webp',
        quality: p.quality,
        createdAt: new Date(Date.now() - idx * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        usageCount: Math.floor(Math.random() * 10000) + 1000,
      };
      this.presets.set(preset.id, preset);
    });

    // Initialize CDN configurations
    const cdnData = [
      { provider: 'cloudflare', name: 'Cloudflare Images', baseUrl: 'https://imagedelivery.net' },
      { provider: 'cloudinary', name: 'Cloudinary', baseUrl: 'https://res.cloudinary.com' },
      { provider: 'imgix', name: 'Imgix', baseUrl: 'https://rescueping.imgix.net' },
    ];

    cdnData.forEach((cdn, idx) => {
      const config: CDNConfiguration = {
        id: `cdn-${(idx + 1).toString().padStart(4, '0')}`,
        provider: cdn.provider as CDNProvider,
        enabled: idx === 0,
        baseUrl: cdn.baseUrl,
        settings: {
          autoFormat: true,
          autoCompress: true,
          responsiveImages: true,
          lazyLoading: true,
          cacheControl: 'public, max-age=31536000',
          ttl: 31536000,
        },
        transformations: {
          defaultQuality: 80,
          defaultFormat: 'webp',
          maxWidth: 4096,
          maxHeight: 4096,
        },
        purgeSettings: {
          enabled: true,
          batchSize: 100,
          cooldownPeriod: 60000,
        },
        analytics: {
          bandwidth: Math.floor(Math.random() * 1000000000) + 100000000,
          requests: Math.floor(Math.random() * 10000000) + 1000000,
          cacheHitRatio: 85 + Math.random() * 10,
        },
      };
      this.cdnConfigs.set(config.id, config);
    });

    // Initialize sample images
    const imagesData = [
      { name: 'hero-banner.jpg', width: 1920, height: 600, size: 450000 },
      { name: 'alert-icon.png', width: 256, height: 256, size: 25000 },
      { name: 'map-marker.svg', width: 48, height: 48, size: 2000 },
      { name: 'user-avatar.jpg', width: 400, height: 400, size: 35000 },
      { name: 'disaster-photo.jpg', width: 3000, height: 2000, size: 2500000 },
      { name: 'infographic.png', width: 1200, height: 1800, size: 850000 },
      { name: 'evacuation-map.jpg', width: 2400, height: 1600, size: 1200000 },
      { name: 'weather-satellite.jpg', width: 4096, height: 4096, size: 8500000 },
    ];

    imagesData.forEach((img, idx) => {
      const format = img.name.split('.').pop() as ImageFormat;
      const image: ProcessedImage = {
        id: `img-${(idx + 1).toString().padStart(6, '0')}`,
        originalId: `orig-${(idx + 1).toString().padStart(6, '0')}`,
        originalUrl: `https://storage.rescueping.com/originals/${img.name}`,
        originalMetadata: {
          width: img.width,
          height: img.height,
          format,
          size: img.size,
          colorSpace: 'sRGB',
          hasAlpha: format === 'png',
          orientation: 1,
          dpi: 72,
          createdAt: new Date(Date.now() - idx * 7 * 24 * 60 * 60 * 1000),
        },
        variants: [
          {
            id: `var-${idx}-thumb`,
            name: 'thumbnail',
            width: 150,
            height: Math.round(150 * (img.height / img.width)),
            format: 'webp',
            quality: 70,
            size: Math.round(img.size * 0.02),
            url: `https://cdn.rescueping.com/${img.name.replace(/\.\w+$/, '-thumb.webp')}`,
            cdnUrl: `https://imagedelivery.net/thumb/${img.name}`,
            createdAt: new Date(),
          },
          {
            id: `var-${idx}-medium`,
            name: 'medium',
            width: 800,
            height: Math.round(800 * (img.height / img.width)),
            format: 'webp',
            quality: 80,
            size: Math.round(img.size * 0.15),
            url: `https://cdn.rescueping.com/${img.name.replace(/\.\w+$/, '-medium.webp')}`,
            cdnUrl: `https://imagedelivery.net/medium/${img.name}`,
            createdAt: new Date(),
          },
          {
            id: `var-${idx}-large`,
            name: 'large',
            width: Math.min(img.width, 1920),
            height: Math.round(Math.min(img.width, 1920) * (img.height / img.width)),
            format: 'webp',
            quality: 85,
            size: Math.round(img.size * 0.35),
            url: `https://cdn.rescueping.com/${img.name.replace(/\.\w+$/, '-large.webp')}`,
            cdnUrl: `https://imagedelivery.net/large/${img.name}`,
            createdAt: new Date(),
          },
        ],
        operations: ['resize', 'compress', 'convert'],
        processingTime: Math.floor(Math.random() * 2000) + 500,
        status: 'completed',
        cdnIntegration: {
          provider: 'cloudflare',
          urls: {
            thumbnail: `https://imagedelivery.net/thumb/${img.name}`,
            medium: `https://imagedelivery.net/medium/${img.name}`,
            large: `https://imagedelivery.net/large/${img.name}`,
          },
          cacheStatus: 'hit',
          ttl: 31536000,
        },
        lazyLoading: {
          placeholder: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + img.width + ' ' + img.height + '"><rect fill="#f0f0f0"/></svg>')}`,
          blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
          lqip: `https://cdn.rescueping.com/${img.name.replace(/\.\w+$/, '-lqip.webp')}`,
          dominantColor: ['#4A90D9', '#2ECC71', '#E74C3C', '#9B59B6', '#F39C12'][idx % 5],
        },
        createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.images.set(image.id, image);
    });

    // Initialize processing jobs
    for (let i = 0; i < 10; i++) {
      const job: ProcessingJob = {
        id: `job-${(i + 1).toString().padStart(6, '0')}`,
        imageId: `img-${((i % 8) + 1).toString().padStart(6, '0')}`,
        operations: {
          resize: { width: 800, height: 600, mode: 'contain', upscale: false },
          compress: { quality: 80, progressive: true, optimizeColors: true },
        },
        priority: i < 3 ? 1 : i < 6 ? 2 : 3,
        status: i < 5 ? 'completed' : i < 8 ? 'processing' : 'queued',
        progress: i < 5 ? 100 : i < 8 ? Math.floor(Math.random() * 80) + 10 : 0,
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date(Date.now() - i * 60 * 1000),
        startedAt: i < 8 ? new Date(Date.now() - i * 30 * 1000) : undefined,
        completedAt: i < 5 ? new Date() : undefined,
        estimatedDuration: Math.floor(Math.random() * 5000) + 1000,
      };
      this.jobs.set(job.id, job);
    }
  }

  /**
   * Process image
   */
  public async processImage(
    imageUrl: string,
    options: ProcessingOptions,
    presetId?: string
  ): Promise<ProcessingJob> {
    const job: ProcessingJob = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      imageId: `img-${Date.now()}`,
      operations: presetId ? this.presets.get(presetId)?.operations || options : options,
      priority: 2,
      status: 'queued',
      progress: 0,
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      estimatedDuration: 2000,
    };

    this.jobs.set(job.id, job);

    // Simulate processing
    this.simulateProcessing(job);

    this.emit('job_created', job);

    return job;
  }

  /**
   * Simulate image processing
   */
  private async simulateProcessing(job: ProcessingJob): Promise<void> {
    job.status = 'processing';
    job.startedAt = new Date();

    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      job.progress = (i / steps) * 100;
      this.emit('job_progress', { jobId: job.id, progress: job.progress });
    }

    job.status = 'completed';
    job.progress = 100;
    job.completedAt = new Date();

    this.emit('job_completed', job);
  }

  /**
   * Get processing job
   */
  public getJob(jobId: string): ProcessingJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get jobs
   */
  public getJobs(filter?: {
    status?: ProcessingJob['status'];
    imageId?: string;
    limit?: number;
  }): ProcessingJob[] {
    let jobs = Array.from(this.jobs.values());
    if (filter?.status) jobs = jobs.filter((j) => j.status === filter.status);
    if (filter?.imageId) jobs = jobs.filter((j) => j.imageId === filter.imageId);
    jobs = jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (filter?.limit) jobs = jobs.slice(0, filter.limit);
    return jobs;
  }

  /**
   * Cancel job
   */
  public cancelJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error('Job not found');
    if (job.status === 'completed' || job.status === 'cancelled') {
      throw new Error('Cannot cancel completed or already cancelled job');
    }

    job.status = 'cancelled';
    this.emit('job_cancelled', { jobId });
  }

  /**
   * Batch process images
   */
  public async batchProcess(
    imageUrls: string[],
    options: ProcessingOptions,
    name: string
  ): Promise<BatchProcessingRequest> {
    const batch: BatchProcessingRequest = {
      id: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name,
      images: imageUrls,
      operations: options,
      priority: 2,
      status: 'pending',
      progress: {
        total: imageUrls.length,
        processed: 0,
        failed: 0,
      },
      results: [],
      createdAt: new Date(),
    };

    this.batchRequests.set(batch.id, batch);

    this.emit('batch_created', batch);

    return batch;
  }

  /**
   * Get batch request
   */
  public getBatchRequest(batchId: string): BatchProcessingRequest | undefined {
    return this.batchRequests.get(batchId);
  }

  /**
   * Get processed images
   */
  public getImages(filter?: {
    status?: ImageStatus;
    format?: ImageFormat;
    limit?: number;
  }): ProcessedImage[] {
    let images = Array.from(this.images.values());
    if (filter?.status) images = images.filter((i) => i.status === filter.status);
    if (filter?.format) images = images.filter((i) => i.originalMetadata.format === filter.format);
    images = images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (filter?.limit) images = images.slice(0, filter.limit);
    return images;
  }

  /**
   * Get image
   */
  public getImage(imageId: string): ProcessedImage | undefined {
    return this.images.get(imageId);
  }

  /**
   * Get image variants
   */
  public getImageVariants(imageId: string): ImageVariant[] {
    const image = this.images.get(imageId);
    return image?.variants || [];
  }

  /**
   * Generate responsive srcset
   */
  public generateSrcSet(imageId: string): string {
    const image = this.images.get(imageId);
    if (!image) return '';

    return image.variants
      .map((v) => `${v.cdnUrl || v.url} ${v.width}w`)
      .join(', ');
  }

  /**
   * Get presets
   */
  public getPresets(): ImagePreset[] {
    return Array.from(this.presets.values());
  }

  /**
   * Get preset
   */
  public getPreset(presetId: string): ImagePreset | undefined {
    return this.presets.get(presetId);
  }

  /**
   * Create preset
   */
  public createPreset(preset: Omit<ImagePreset, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): ImagePreset {
    const newPreset: ImagePreset = {
      ...preset,
      id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
    };

    this.presets.set(newPreset.id, newPreset);

    this.emit('preset_created', newPreset);

    return newPreset;
  }

  /**
   * Get CDN configurations
   */
  public getCDNConfigurations(): CDNConfiguration[] {
    return Array.from(this.cdnConfigs.values());
  }

  /**
   * Get CDN configuration
   */
  public getCDNConfiguration(configId: string): CDNConfiguration | undefined {
    return this.cdnConfigs.get(configId);
  }

  /**
   * Update CDN configuration
   */
  public updateCDNConfiguration(
    configId: string,
    updates: Partial<CDNConfiguration>
  ): CDNConfiguration {
    const config = this.cdnConfigs.get(configId);
    if (!config) throw new Error('CDN configuration not found');

    Object.assign(config, updates);

    this.emit('cdn_config_updated', config);

    return config;
  }

  /**
   * Purge CDN cache
   */
  public async purgeCDNCache(configId: string, urls?: string[]): Promise<void> {
    const config = this.cdnConfigs.get(configId);
    if (!config) throw new Error('CDN configuration not found');

    // Simulate cache purge
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.emit('cdn_cache_purged', { configId, urls: urls || 'all' });
  }

  /**
   * Get lazy loading configuration
   */
  public getLazyLoadingConfig(): LazyLoadingConfig {
    return { ...this.lazyLoadConfig };
  }

  /**
   * Update lazy loading configuration
   */
  public updateLazyLoadingConfig(config: Partial<LazyLoadingConfig>): LazyLoadingConfig {
    Object.assign(this.lazyLoadConfig, config);
    this.emit('lazy_loading_config_updated', this.lazyLoadConfig);
    return { ...this.lazyLoadConfig };
  }

  /**
   * Get responsive breakpoints
   */
  public getResponsiveBreakpoints(): ResponsiveBreakpoint[] {
    return [...this.responsiveBreakpoints];
  }

  /**
   * Analyze image
   */
  public async analyzeImage(imageId: string): Promise<ImageAnalysisResult> {
    const image = this.images.get(imageId);
    if (!image) throw new Error('Image not found');

    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      imageId,
      dominantColors: ['#4A90D9', '#2ECC71', '#FFFFFF', '#333333', '#F5F5F5'],
      colorPalette: [
        { color: '#4A90D9', percentage: 35 },
        { color: '#2ECC71', percentage: 25 },
        { color: '#FFFFFF', percentage: 20 },
        { color: '#333333', percentage: 12 },
        { color: '#F5F5F5', percentage: 8 },
      ],
      brightness: 0.65,
      contrast: 0.72,
      sharpness: 0.85,
      noiseLevel: 0.05,
      compressionArtifacts: 0.02,
      quality: {
        overall: 85,
        aesthetic: 78,
        technical: 92,
      },
    };
  }

  /**
   * Get optimization stats
   */
  public getOptimizationStats(period: { start: Date; end: Date }): OptimizationStats {
    const images = Array.from(this.images.values()).filter(
      (i) => i.createdAt >= period.start && i.createdAt <= period.end
    );

    const totalOriginalSize = images.reduce((sum, i) => sum + i.originalMetadata.size, 0);
    const totalOptimizedSize = images.reduce(
      (sum, i) => sum + i.variants.reduce((vs, v) => vs + v.size, 0),
      0
    );

    const formatDistribution: Record<ImageFormat, number> = {
      jpeg: 0, png: 0, webp: 0, avif: 0, gif: 0, svg: 0, bmp: 0, tiff: 0, heic: 0,
    };
    images.forEach((i) => {
      formatDistribution[i.originalMetadata.format]++;
    });

    const operationStats: Record<ProcessingOperation, number> = {
      resize: 0, compress: 0, convert: 0, crop: 0, rotate: 0, flip: 0,
      watermark: 0, blur: 0, sharpen: 0, grayscale: 0, sepia: 0,
      brightness: 0, contrast: 0, saturation: 0,
    };
    images.forEach((i) => {
      i.operations.forEach((op) => {
        operationStats[op]++;
      });
    });

    return {
      period,
      totalImages: images.length,
      totalOriginalSize,
      totalOptimizedSize,
      compressionRatio: totalOriginalSize > 0 ? (1 - totalOptimizedSize / totalOriginalSize) * 100 : 0,
      avgProcessingTime: images.reduce((sum, i) => sum + i.processingTime, 0) / (images.length || 1),
      formatDistribution,
      operationStats,
      cdnStats: {
        totalRequests: Math.floor(Math.random() * 1000000) + 100000,
        bandwidth: Math.floor(Math.random() * 100000000) + 10000000,
        cacheHitRatio: 85 + Math.random() * 10,
        avgLatency: Math.floor(Math.random() * 50) + 10,
      },
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

export const imageProcessingService = ImageProcessingService.getInstance();
export type {
  ImageFormat,
  ResizeMode,
  QualityPreset,
  CDNProvider,
  ImageStatus,
  ProcessingOperation,
  ImageMetadata,
  ImageVariant,
  ProcessingOptions,
  ImagePreset,
  ProcessedImage,
  CDNConfiguration,
  ProcessingJob,
  BatchProcessingRequest,
  OptimizationStats,
  LazyLoadingConfig,
  ResponsiveBreakpoint,
  ImageAnalysisResult,
};
