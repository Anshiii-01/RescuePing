/**
 * Offline Map Caching Service
 * Download and cache map tiles for offline disaster response
 */

// Map tile definition
interface MapTile {
  x: number;
  y: number;
  z: number; // zoom level
  url: string;
  blob?: Blob;
  size: number;
  lastAccessed: Date;
  cached: boolean;
}

// Offline region
interface OfflineRegion {
  id: string;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  minZoom: number;
  maxZoom: number;
  tileCount: number;
  downloadedTiles: number;
  totalSize: number;
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'error';
  progress: number;
  createdAt: Date;
  lastUpdated: Date;
  expiresAt?: Date;
  mapStyle: MapStyle;
}

// Map style options
type MapStyle = 'standard' | 'satellite' | 'terrain' | 'hybrid' | 'emergency';

// Download progress
interface DownloadProgress {
  regionId: string;
  totalTiles: number;
  downloadedTiles: number;
  failedTiles: number;
  bytesDownloaded: number;
  estimatedSize: number;
  speed: number; // bytes per second
  eta: number; // seconds
  status: string;
}

// Cache statistics
interface CacheStats {
  totalRegions: number;
  totalTiles: number;
  totalSize: number;
  availableSpace: number;
  oldestTile: Date | null;
  newestTile: Date | null;
}

// Tile server configuration
const TILE_SERVERS: Record<MapStyle, string> = {
  standard: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  terrain: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
  hybrid: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
  emergency: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', // Custom emergency style
};

// Cache configuration
const CACHE_CONFIG = {
  dbName: 'RescuePingMapCache',
  storeName: 'tiles',
  regionStoreName: 'regions',
  maxCacheSize: 500 * 1024 * 1024, // 500MB
  tileExpiry: 30 * 24 * 60 * 60 * 1000, // 30 days
  maxConcurrentDownloads: 4,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Predefined regions for quick download
const PREDEFINED_REGIONS: Omit<OfflineRegion, 'id' | 'tileCount' | 'downloadedTiles' | 'totalSize' | 'status' | 'progress' | 'createdAt' | 'lastUpdated'>[] = [
  {
    name: 'Delhi NCR',
    bounds: { north: 28.9, south: 28.3, east: 77.5, west: 76.8 },
    minZoom: 10,
    maxZoom: 16,
    mapStyle: 'standard',
  },
  {
    name: 'Mumbai Metropolitan',
    bounds: { north: 19.3, south: 18.9, east: 73.1, west: 72.7 },
    minZoom: 10,
    maxZoom: 16,
    mapStyle: 'standard',
  },
  {
    name: 'Chennai City',
    bounds: { north: 13.2, south: 12.9, east: 80.35, west: 80.1 },
    minZoom: 10,
    maxZoom: 16,
    mapStyle: 'standard',
  },
  {
    name: 'Kolkata City',
    bounds: { north: 22.7, south: 22.4, east: 88.5, west: 88.2 },
    minZoom: 10,
    maxZoom: 16,
    mapStyle: 'standard',
  },
  {
    name: 'Bangalore Urban',
    bounds: { north: 13.15, south: 12.8, east: 77.8, west: 77.4 },
    minZoom: 10,
    maxZoom: 16,
    mapStyle: 'standard',
  },
];

class OfflineMapService {
  private static instance: OfflineMapService;
  private db: IDBDatabase | null = null;
  private regions: Map<string, OfflineRegion> = new Map();
  private downloadQueue: Map<string, AbortController> = new Map();
  private progressCallbacks: ((progress: DownloadProgress) => void)[] = [];
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): OfflineMapService {
    if (!OfflineMapService.instance) {
      OfflineMapService.instance = new OfflineMapService();
    }
    return OfflineMapService.instance;
  }

  /**
   * Initialize the service
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await this.openDatabase();
    await this.loadRegions();
    this.isInitialized = true;
  }

  /**
   * Open IndexedDB database
   */
  private async openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CACHE_CONFIG.dbName, 1);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Tiles store
        if (!db.objectStoreNames.contains(CACHE_CONFIG.storeName)) {
          const tileStore = db.createObjectStore(CACHE_CONFIG.storeName, {
            keyPath: ['x', 'y', 'z', 'style'],
          });
          tileStore.createIndex('regionId', 'regionId', { unique: false });
          tileStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
        }

        // Regions store
        if (!db.objectStoreNames.contains(CACHE_CONFIG.regionStoreName)) {
          db.createObjectStore(CACHE_CONFIG.regionStoreName, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Load saved regions
   */
  private async loadRegions(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(CACHE_CONFIG.regionStoreName, 'readonly');
      const store = transaction.objectStore(CACHE_CONFIG.regionStoreName);
      const request = store.getAll();

      request.onsuccess = () => {
        const regions = request.result as OfflineRegion[];
        regions.forEach((region) => this.regions.set(region.id, region));
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Create offline region for download
   */
  public async createRegion(
    name: string,
    bounds: OfflineRegion['bounds'],
    minZoom: number,
    maxZoom: number,
    mapStyle: MapStyle = 'standard'
  ): Promise<OfflineRegion> {
    const id = `region-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tileCount = this.calculateTileCount(bounds, minZoom, maxZoom);
    const estimatedSize = tileCount * 15000; // ~15KB per tile average

    const region: OfflineRegion = {
      id,
      name,
      bounds,
      minZoom,
      maxZoom,
      tileCount,
      downloadedTiles: 0,
      totalSize: 0,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      lastUpdated: new Date(),
      mapStyle,
    };

    this.regions.set(id, region);
    await this.saveRegion(region);

    return region;
  }

  /**
   * Calculate number of tiles in a region
   */
  private calculateTileCount(
    bounds: OfflineRegion['bounds'],
    minZoom: number,
    maxZoom: number
  ): number {
    let count = 0;

    for (let z = minZoom; z <= maxZoom; z++) {
      const minTile = this.latLngToTile(bounds.south, bounds.west, z);
      const maxTile = this.latLngToTile(bounds.north, bounds.east, z);

      const tilesX = Math.abs(maxTile.x - minTile.x) + 1;
      const tilesY = Math.abs(maxTile.y - minTile.y) + 1;
      count += tilesX * tilesY;
    }

    return count;
  }

  /**
   * Convert lat/lng to tile coordinates
   */
  private latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
    const n = Math.pow(2, zoom);
    const x = Math.floor((lng + 180) / 360 * n);
    const latRad = lat * Math.PI / 180;
    const y = Math.floor((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n);
    return { x, y };
  }

  /**
   * Convert tile coordinates to lat/lng
   */
  private tileToLatLng(x: number, y: number, zoom: number): { lat: number; lng: number } {
    const n = Math.pow(2, zoom);
    const lng = x / n * 360 - 180;
    const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
    const lat = latRad * 180 / Math.PI;
    return { lat, lng };
  }

  /**
   * Start downloading a region
   */
  public async downloadRegion(regionId: string): Promise<void> {
    const region = this.regions.get(regionId);
    if (!region) throw new Error('Region not found');

    if (region.status === 'downloading') return;

    const controller = new AbortController();
    this.downloadQueue.set(regionId, controller);

    region.status = 'downloading';
    await this.saveRegion(region);

    const tiles = this.getTilesForRegion(region);
    let downloadedCount = region.downloadedTiles;
    let failedCount = 0;
    let bytesDownloaded = region.totalSize;
    const startTime = Date.now();

    const downloadBatch = async (batch: typeof tiles): Promise<void> => {
      await Promise.all(
        batch.map(async (tile) => {
          if (controller.signal.aborted) return;

          try {
            const cached = await this.getTile(tile.x, tile.y, tile.z, region.mapStyle);
            if (cached) {
              downloadedCount++;
              return;
            }

            const blob = await this.downloadTile(tile, region.mapStyle, controller.signal);
            if (blob) {
              await this.saveTile(tile.x, tile.y, tile.z, region.mapStyle, blob, regionId);
              downloadedCount++;
              bytesDownloaded += blob.size;
            }
          } catch (error) {
            if ((error as Error).name !== 'AbortError') {
              failedCount++;
            }
          }

          // Update progress
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = bytesDownloaded / elapsed;
          const remaining = region.tileCount - downloadedCount;
          const eta = remaining * (elapsed / downloadedCount);

          this.notifyProgress({
            regionId,
            totalTiles: region.tileCount,
            downloadedTiles: downloadedCount,
            failedTiles: failedCount,
            bytesDownloaded,
            estimatedSize: region.tileCount * 15000,
            speed,
            eta,
            status: 'downloading',
          });
        })
      );
    };

    // Process tiles in batches
    const batchSize = CACHE_CONFIG.maxConcurrentDownloads;
    for (let i = 0; i < tiles.length; i += batchSize) {
      if (controller.signal.aborted) break;
      const batch = tiles.slice(i, i + batchSize);
      await downloadBatch(batch);
    }

    // Update region status
    region.downloadedTiles = downloadedCount;
    region.totalSize = bytesDownloaded;
    region.progress = (downloadedCount / region.tileCount) * 100;
    region.status = downloadedCount === region.tileCount ? 'completed' : 'paused';
    region.lastUpdated = new Date();
    await this.saveRegion(region);

    this.downloadQueue.delete(regionId);
  }

  /**
   * Get tiles for a region
   */
  private getTilesForRegion(region: OfflineRegion): { x: number; y: number; z: number }[] {
    const tiles: { x: number; y: number; z: number }[] = [];

    for (let z = region.minZoom; z <= region.maxZoom; z++) {
      const minTile = this.latLngToTile(region.bounds.south, region.bounds.west, z);
      const maxTile = this.latLngToTile(region.bounds.north, region.bounds.east, z);

      const xMin = Math.min(minTile.x, maxTile.x);
      const xMax = Math.max(minTile.x, maxTile.x);
      const yMin = Math.min(minTile.y, maxTile.y);
      const yMax = Math.max(minTile.y, maxTile.y);

      for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
          tiles.push({ x, y, z });
        }
      }
    }

    return tiles;
  }

  /**
   * Download a single tile
   */
  private async downloadTile(
    tile: { x: number; y: number; z: number },
    style: MapStyle,
    signal: AbortSignal
  ): Promise<Blob | null> {
    const url = TILE_SERVERS[style]
      .replace('{x}', tile.x.toString())
      .replace('{y}', tile.y.toString())
      .replace('{z}', tile.z.toString());

    for (let attempt = 0; attempt < CACHE_CONFIG.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, { signal });
        if (response.ok) {
          return await response.blob();
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') throw error;
        if (attempt < CACHE_CONFIG.retryAttempts - 1) {
          await new Promise((r) => setTimeout(r, CACHE_CONFIG.retryDelay * (attempt + 1)));
        }
      }
    }

    return null;
  }

  /**
   * Save tile to IndexedDB
   */
  private async saveTile(
    x: number,
    y: number,
    z: number,
    style: MapStyle,
    blob: Blob,
    regionId: string
  ): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(CACHE_CONFIG.storeName, 'readwrite');
      const store = transaction.objectStore(CACHE_CONFIG.storeName);

      const tile = {
        x,
        y,
        z,
        style,
        blob,
        size: blob.size,
        regionId,
        lastAccessed: new Date(),
      };

      const request = store.put(tile);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get tile from cache
   */
  public async getTile(
    x: number,
    y: number,
    z: number,
    style: MapStyle
  ): Promise<Blob | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(CACHE_CONFIG.storeName, 'readonly');
      const store = transaction.objectStore(CACHE_CONFIG.storeName);
      const request = store.get([x, y, z, style]);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Update last accessed
          this.updateTileAccess(x, y, z, style);
          resolve(result.blob);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update tile last accessed time
   */
  private async updateTileAccess(x: number, y: number, z: number, style: MapStyle): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(CACHE_CONFIG.storeName, 'readwrite');
    const store = transaction.objectStore(CACHE_CONFIG.storeName);
    const request = store.get([x, y, z, style]);

    request.onsuccess = () => {
      const tile = request.result;
      if (tile) {
        tile.lastAccessed = new Date();
        store.put(tile);
      }
    };
  }

  /**
   * Save region to IndexedDB
   */
  private async saveRegion(region: OfflineRegion): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(CACHE_CONFIG.regionStoreName, 'readwrite');
      const store = transaction.objectStore(CACHE_CONFIG.regionStoreName);
      const request = store.put(region);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Pause region download
   */
  public pauseDownload(regionId: string): void {
    const controller = this.downloadQueue.get(regionId);
    if (controller) {
      controller.abort();
      this.downloadQueue.delete(regionId);
    }

    const region = this.regions.get(regionId);
    if (region) {
      region.status = 'paused';
      this.saveRegion(region);
    }
  }

  /**
   * Delete region and its tiles
   */
  public async deleteRegion(regionId: string): Promise<void> {
    // Pause if downloading
    this.pauseDownload(regionId);

    // Delete tiles
    if (this.db) {
      const transaction = this.db.transaction(CACHE_CONFIG.storeName, 'readwrite');
      const store = transaction.objectStore(CACHE_CONFIG.storeName);
      const index = store.index('regionId');
      const request = index.openCursor(IDBKeyRange.only(regionId));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        }
      };
    }

    // Delete region
    if (this.db) {
      const transaction = this.db.transaction(CACHE_CONFIG.regionStoreName, 'readwrite');
      const store = transaction.objectStore(CACHE_CONFIG.regionStoreName);
      store.delete(regionId);
    }

    this.regions.delete(regionId);
  }

  /**
   * Get all regions
   */
  public getRegions(): OfflineRegion[] {
    return Array.from(this.regions.values());
  }

  /**
   * Get region by ID
   */
  public getRegion(regionId: string): OfflineRegion | undefined {
    return this.regions.get(regionId);
  }

  /**
   * Get predefined regions
   */
  public getPredefinedRegions(): typeof PREDEFINED_REGIONS {
    return PREDEFINED_REGIONS;
  }

  /**
   * Get cache statistics
   */
  public async getCacheStats(): Promise<CacheStats> {
    if (!this.db) {
      return {
        totalRegions: 0,
        totalTiles: 0,
        totalSize: 0,
        availableSpace: 0,
        oldestTile: null,
        newestTile: null,
      };
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(CACHE_CONFIG.storeName, 'readonly');
      const store = transaction.objectStore(CACHE_CONFIG.storeName);
      
      let totalTiles = 0;
      let totalSize = 0;
      let oldestTile: Date | null = null;
      let newestTile: Date | null = null;

      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          totalTiles++;
          totalSize += cursor.value.size || 0;
          
          const accessed = new Date(cursor.value.lastAccessed);
          if (!oldestTile || accessed < oldestTile) oldestTile = accessed;
          if (!newestTile || accessed > newestTile) newestTile = accessed;
          
          cursor.continue();
        } else {
          resolve({
            totalRegions: this.regions.size,
            totalTiles,
            totalSize,
            availableSpace: CACHE_CONFIG.maxCacheSize - totalSize,
            oldestTile,
            newestTile,
          });
        }
      };
    });
  }

  /**
   * Clean up expired tiles
   */
  public async cleanupExpiredTiles(): Promise<number> {
    if (!this.db) return 0;

    const expiryDate = new Date(Date.now() - CACHE_CONFIG.tileExpiry);
    let deletedCount = 0;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(CACHE_CONFIG.storeName, 'readwrite');
      const store = transaction.objectStore(CACHE_CONFIG.storeName);
      const index = store.index('lastAccessed');
      const range = IDBKeyRange.upperBound(expiryDate);
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          deletedCount++;
          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };
    });
  }

  /**
   * Check if location has offline coverage
   */
  public hasOfflineCoverage(lat: number, lng: number, zoom: number): boolean {
    const regionsArray = Array.from(this.regions.values());
    for (const region of regionsArray) {
      if (
        region.status === 'completed' &&
        lat >= region.bounds.south &&
        lat <= region.bounds.north &&
        lng >= region.bounds.west &&
        lng <= region.bounds.east &&
        zoom >= region.minZoom &&
        zoom <= region.maxZoom
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get tile URL (online or offline)
   */
  public async getTileUrl(
    x: number,
    y: number,
    z: number,
    style: MapStyle = 'standard'
  ): Promise<string> {
    // Try cache first
    const cachedTile = await this.getTile(x, y, z, style);
    if (cachedTile) {
      return URL.createObjectURL(cachedTile);
    }

    // Return online URL
    return TILE_SERVERS[style]
      .replace('{x}', x.toString())
      .replace('{y}', y.toString())
      .replace('{z}', z.toString());
  }

  /**
   * Subscribe to download progress
   */
  public onProgress(callback: (progress: DownloadProgress) => void): () => void {
    this.progressCallbacks.push(callback);
    return () => {
      const index = this.progressCallbacks.indexOf(callback);
      if (index > -1) this.progressCallbacks.splice(index, 1);
    };
  }

  /**
   * Notify progress callbacks
   */
  private notifyProgress(progress: DownloadProgress): void {
    this.progressCallbacks.forEach((callback) => callback(progress));
  }

  /**
   * Export region for sharing
   */
  public async exportRegion(regionId: string): Promise<Blob> {
    const region = this.regions.get(regionId);
    if (!region) throw new Error('Region not found');

    const tiles = this.getTilesForRegion(region);
    const exportData: { region: OfflineRegion; tiles: unknown[] } = {
      region,
      tiles: [],
    };

    for (const tile of tiles) {
      const blob = await this.getTile(tile.x, tile.y, tile.z, region.mapStyle);
      if (blob) {
        const base64 = await this.blobToBase64(blob);
        exportData.tiles.push({ ...tile, data: base64 });
      }
    }

    return new Blob([JSON.stringify(exportData)], { type: 'application/json' });
  }

  /**
   * Convert blob to base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Format size for display
   */
  public formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

export const offlineMapService = OfflineMapService.getInstance();
export type { OfflineRegion, MapStyle, DownloadProgress, CacheStats, MapTile };
