/**
 * Secret Management Service
 * Secure credential storage, encryption, access control, and secret rotation
 */

// Secret type
type SecretType = 'password' | 'api_key' | 'certificate' | 'ssh_key' | 'token' | 'database' | 'encryption_key' | 'generic';

// Secret status
type SecretStatus = 'active' | 'expired' | 'revoked' | 'pending' | 'rotating';

// Encryption algorithm
type EncryptionAlgorithm = 'AES-256-GCM' | 'AES-256-CBC' | 'RSA-OAEP' | 'ChaCha20-Poly1305';

// Access level
type AccessLevel = 'read' | 'write' | 'admin' | 'rotate';

// Secret
interface Secret {
  id: string;
  name: string;
  description: string;
  type: SecretType;
  path: string;
  version: number;
  status: SecretStatus;
  value: EncryptedValue;
  metadata: {
    tags: string[];
    labels: Record<string, string>;
    customFields: Record<string, string>;
  };
  rotation: {
    enabled: boolean;
    interval: number;
    lastRotated?: Date;
    nextRotation?: Date;
    policy?: RotationPolicy;
  };
  expiration?: {
    enabled: boolean;
    expiresAt?: Date;
    notifyBefore?: number;
  };
  audit: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    accessedAt?: Date;
    accessedBy?: string;
    accessCount: number;
  };
}

// Encrypted value
interface EncryptedValue {
  ciphertext: string;
  algorithm: EncryptionAlgorithm;
  keyId: string;
  iv?: string;
  authTag?: string;
  encrypted: boolean;
}

// Secret version
interface SecretVersion {
  id: string;
  secretId: string;
  version: number;
  value: EncryptedValue;
  status: 'current' | 'previous' | 'deprecated';
  metadata: {
    createdAt: Date;
    createdBy: string;
    reason?: string;
  };
}

// Rotation policy
interface RotationPolicy {
  id: string;
  name: string;
  description: string;
  interval: number;
  strategy: 'automatic' | 'manual' | 'scheduled';
  notifyBefore: number;
  retainVersions: number;
  rules: {
    minLength?: number;
    maxAge?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    excludeChars?: string;
  };
  actions: {
    preRotation?: string[];
    postRotation?: string[];
    onFailure?: string[];
  };
}

// Encryption key
interface EncryptionKey {
  id: string;
  name: string;
  description: string;
  algorithm: EncryptionAlgorithm;
  keySize: number;
  status: 'active' | 'disabled' | 'pending_deletion' | 'deleted';
  purpose: 'encrypt' | 'sign' | 'wrap';
  rotation: {
    enabled: boolean;
    interval: number;
    lastRotated?: Date;
    nextRotation?: Date;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    expiresAt?: Date;
  };
}

// Access policy
interface AccessPolicy {
  id: string;
  name: string;
  description: string;
  principals: {
    users: string[];
    groups: string[];
    services: string[];
    roles: string[];
  };
  resources: {
    paths: string[];
    tags?: string[];
    types?: SecretType[];
  };
  permissions: AccessLevel[];
  conditions?: {
    ipAddresses?: string[];
    timeRange?: { start: string; end: string };
    mfaRequired?: boolean;
    maxAccessCount?: number;
  };
  priority: number;
  enabled: boolean;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Vault
interface Vault {
  id: string;
  name: string;
  description: string;
  type: 'kv' | 'transit' | 'pki' | 'database' | 'aws' | 'azure' | 'gcp';
  path: string;
  status: 'active' | 'sealed' | 'disabled';
  settings: {
    maxVersions: number;
    casRequired: boolean;
    deleteVersionAfter?: number;
  };
  encryption: {
    keyId: string;
    algorithm: EncryptionAlgorithm;
  };
  audit: {
    enabled: boolean;
    logPath?: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    secretCount: number;
  };
}

// Audit log entry
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: 'create' | 'read' | 'update' | 'delete' | 'rotate' | 'access' | 'deny';
  resource: {
    type: 'secret' | 'key' | 'policy' | 'vault';
    id: string;
    path: string;
  };
  actor: {
    type: 'user' | 'service' | 'system';
    id: string;
    name: string;
    ip?: string;
  };
  details: {
    method?: string;
    status: 'success' | 'failure';
    reason?: string;
    metadata?: Record<string, unknown>;
  };
  request?: {
    id: string;
    path: string;
    method: string;
  };
}

// Certificate
interface Certificate {
  id: string;
  name: string;
  type: 'server' | 'client' | 'ca' | 'intermediate';
  status: 'active' | 'expired' | 'revoked' | 'pending';
  subject: {
    commonName: string;
    organization?: string;
    organizationalUnit?: string;
    country?: string;
    state?: string;
    locality?: string;
  };
  issuer: {
    commonName: string;
    organization?: string;
  };
  serialNumber: string;
  fingerprint: {
    sha1: string;
    sha256: string;
  };
  validity: {
    notBefore: Date;
    notAfter: Date;
    daysRemaining: number;
  };
  keyUsage: string[];
  extKeyUsage: string[];
  sans?: {
    dnsNames: string[];
    ipAddresses: string[];
    emails: string[];
  };
  chain: string[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    renewedAt?: Date;
  };
}

// Secret access request
interface AccessRequest {
  id: string;
  secretId: string;
  requestor: {
    id: string;
    name: string;
    type: 'user' | 'service';
  };
  reason: string;
  duration: number;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  approval?: {
    approvedBy: string;
    approvedAt: Date;
    expiresAt: Date;
    comments?: string;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Secret metrics
interface SecretMetrics {
  overview: {
    totalSecrets: number;
    activeSecrets: number;
    expiringSoon: number;
    recentlyAccessed: number;
  };
  byType: {
    type: SecretType;
    count: number;
    percentage: number;
  }[];
  accessStats: {
    period: string;
    accessCount: number;
    uniqueAccessors: number;
    deniedCount: number;
  }[];
  rotationStats: {
    rotatedLast30Days: number;
    pendingRotation: number;
    overdueRotation: number;
  };
  expirationStats: {
    expiring7Days: number;
    expiring30Days: number;
    expiring90Days: number;
    expired: number;
  };
}

class SecretManagementService {
  private static instance: SecretManagementService;
  private secrets: Map<string, Secret> = new Map();
  private secretVersions: Map<string, SecretVersion[]> = new Map();
  private encryptionKeys: Map<string, EncryptionKey> = new Map();
  private accessPolicies: Map<string, AccessPolicy> = new Map();
  private vaults: Map<string, Vault> = new Map();
  private auditLogs: Map<string, AuditLogEntry> = new Map();
  private certificates: Map<string, Certificate> = new Map();
  private accessRequests: Map<string, AccessRequest> = new Map();
  private rotationPolicies: Map<string, RotationPolicy> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): SecretManagementService {
    if (!SecretManagementService.instance) {
      SecretManagementService.instance = new SecretManagementService();
    }
    return SecretManagementService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize encryption keys
    const keysData = [
      { name: 'master-key', algorithm: 'AES-256-GCM', purpose: 'encrypt' },
      { name: 'signing-key', algorithm: 'RSA-OAEP', purpose: 'sign' },
      { name: 'wrap-key', algorithm: 'AES-256-GCM', purpose: 'wrap' },
    ];

    keysData.forEach((k, idx) => {
      const key: EncryptionKey = {
        id: `key-${(idx + 1).toString().padStart(4, '0')}`,
        name: k.name,
        description: `${k.purpose} key for secret management`,
        algorithm: k.algorithm as EncryptionAlgorithm,
        keySize: k.algorithm.includes('AES') ? 256 : 2048,
        status: 'active',
        purpose: k.purpose as EncryptionKey['purpose'],
        rotation: {
          enabled: true,
          interval: 90 * 24 * 60 * 60 * 1000,
          lastRotated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          nextRotation: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'system',
          updatedAt: new Date(),
        },
      };
      this.encryptionKeys.set(key.id, key);
    });

    // Initialize vaults
    const vaultsData = [
      { name: 'production-secrets', type: 'kv', path: 'secret/production' },
      { name: 'staging-secrets', type: 'kv', path: 'secret/staging' },
      { name: 'pki-vault', type: 'pki', path: 'pki' },
      { name: 'database-credentials', type: 'database', path: 'database' },
      { name: 'transit-engine', type: 'transit', path: 'transit' },
    ];

    vaultsData.forEach((v, idx) => {
      const vault: Vault = {
        id: `vault-${(idx + 1).toString().padStart(4, '0')}`,
        name: v.name,
        description: `${v.type.toUpperCase()} vault for ${v.name}`,
        type: v.type as Vault['type'],
        path: v.path,
        status: 'active',
        settings: {
          maxVersions: 10,
          casRequired: v.type === 'kv',
          deleteVersionAfter: 30 * 24 * 60 * 60 * 1000,
        },
        encryption: {
          keyId: 'key-0001',
          algorithm: 'AES-256-GCM',
        },
        audit: {
          enabled: true,
          logPath: `/var/log/vault/${v.name}.log`,
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          secretCount: Math.floor(Math.random() * 50) + 10,
        },
      };
      this.vaults.set(vault.id, vault);
    });

    // Initialize rotation policies
    const rotationPoliciesData = [
      { name: 'standard-rotation', interval: 90 },
      { name: 'high-security-rotation', interval: 30 },
      { name: 'api-key-rotation', interval: 180 },
    ];

    rotationPoliciesData.forEach((rp, idx) => {
      const policy: RotationPolicy = {
        id: `rotation-policy-${idx + 1}`,
        name: rp.name,
        description: `Rotation policy: every ${rp.interval} days`,
        interval: rp.interval * 24 * 60 * 60 * 1000,
        strategy: idx === 0 ? 'automatic' : idx === 1 ? 'scheduled' : 'manual',
        notifyBefore: 7 * 24 * 60 * 60 * 1000,
        retainVersions: 5,
        rules: {
          minLength: 16,
          maxAge: rp.interval * 24 * 60 * 60 * 1000,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: idx < 2,
        },
        actions: {
          preRotation: ['notify-owners', 'backup-current'],
          postRotation: ['update-dependent-services', 'verify-access'],
          onFailure: ['rollback', 'alert-security-team'],
        },
      };
      this.rotationPolicies.set(policy.id, policy);
    });

    // Initialize secrets
    const secretsData = [
      { name: 'database-password', type: 'database', path: 'secret/production/db' },
      { name: 'api-gateway-key', type: 'api_key', path: 'secret/production/api' },
      { name: 'jwt-signing-secret', type: 'token', path: 'secret/production/jwt' },
      { name: 'encryption-master-key', type: 'encryption_key', path: 'secret/production/encryption' },
      { name: 'ssh-deploy-key', type: 'ssh_key', path: 'secret/production/ssh' },
      { name: 'oauth-client-secret', type: 'token', path: 'secret/production/oauth' },
      { name: 'smtp-password', type: 'password', path: 'secret/production/smtp' },
      { name: 'redis-password', type: 'password', path: 'secret/production/redis' },
      { name: 'aws-secret-key', type: 'api_key', path: 'secret/production/aws' },
      { name: 'stripe-api-key', type: 'api_key', path: 'secret/production/stripe' },
      { name: 'staging-db-password', type: 'database', path: 'secret/staging/db' },
      { name: 'staging-api-key', type: 'api_key', path: 'secret/staging/api' },
    ];

    secretsData.forEach((s, idx) => {
      const daysOld = Math.floor(Math.random() * 90) + 10;
      const lastAccessed = Math.floor(Math.random() * 7);

      const secret: Secret = {
        id: `secret-${(idx + 1).toString().padStart(6, '0')}`,
        name: s.name,
        description: `${s.type.replace('_', ' ')} for ${s.name}`,
        type: s.type as SecretType,
        path: s.path,
        version: Math.floor(Math.random() * 5) + 1,
        status: idx < 10 ? 'active' : idx === 10 ? 'rotating' : 'pending',
        value: {
          ciphertext: this.generateEncryptedValue(),
          algorithm: 'AES-256-GCM',
          keyId: 'key-0001',
          iv: this.generateHex(24),
          authTag: this.generateHex(32),
          encrypted: true,
        },
        metadata: {
          tags: [s.type, s.path.includes('production') ? 'production' : 'staging'],
          labels: {
            environment: s.path.includes('production') ? 'production' : 'staging',
            team: ['platform', 'backend', 'infrastructure'][idx % 3],
          },
          customFields: {},
        },
        rotation: {
          enabled: idx < 8,
          interval: idx < 5 ? 30 * 24 * 60 * 60 * 1000 : 90 * 24 * 60 * 60 * 1000,
          lastRotated: new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000),
          nextRotation: new Date(Date.now() + (90 - daysOld) * 24 * 60 * 60 * 1000),
          policy: this.rotationPolicies.get(`rotation-policy-${(idx % 3) + 1}`),
        },
        expiration: {
          enabled: idx < 5,
          expiresAt: idx < 5 ? new Date(Date.now() + (365 - daysOld) * 24 * 60 * 60 * 1000) : undefined,
          notifyBefore: 30 * 24 * 60 * 60 * 1000,
        },
        audit: {
          createdAt: new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000),
          createdBy: `user-${(idx % 5) + 1}`,
          updatedAt: new Date(Date.now() - Math.floor(daysOld / 2) * 24 * 60 * 60 * 1000),
          updatedBy: `user-${(idx % 5) + 1}`,
          accessedAt: new Date(Date.now() - lastAccessed * 24 * 60 * 60 * 1000),
          accessedBy: `service-${(idx % 3) + 1}`,
          accessCount: Math.floor(Math.random() * 1000) + 100,
        },
      };

      this.secrets.set(secret.id, secret);

      // Create versions
      const versions: SecretVersion[] = [];
      for (let v = 1; v <= secret.version; v++) {
        versions.push({
          id: `version-${secret.id}-${v}`,
          secretId: secret.id,
          version: v,
          value: {
            ciphertext: this.generateEncryptedValue(),
            algorithm: 'AES-256-GCM',
            keyId: 'key-0001',
            iv: this.generateHex(24),
            authTag: this.generateHex(32),
            encrypted: true,
          },
          status: v === secret.version ? 'current' : v === secret.version - 1 ? 'previous' : 'deprecated',
          metadata: {
            createdAt: new Date(Date.now() - (secret.version - v + 1) * 30 * 24 * 60 * 60 * 1000),
            createdBy: `user-${(idx % 5) + 1}`,
            reason: v === 1 ? 'Initial creation' : 'Rotation',
          },
        });
      }
      this.secretVersions.set(secret.id, versions);
    });

    // Initialize access policies
    const policiesData = [
      { name: 'production-read', paths: ['secret/production/*'], permissions: ['read'] },
      { name: 'production-admin', paths: ['secret/production/*'], permissions: ['read', 'write', 'rotate', 'admin'] },
      { name: 'staging-full', paths: ['secret/staging/*'], permissions: ['read', 'write', 'rotate'] },
      { name: 'database-access', paths: ['secret/*/db'], permissions: ['read'] },
      { name: 'api-key-rotation', paths: ['secret/*/api'], permissions: ['read', 'rotate'] },
    ];

    policiesData.forEach((p, idx) => {
      const policy: AccessPolicy = {
        id: `policy-${(idx + 1).toString().padStart(4, '0')}`,
        name: p.name,
        description: `Access policy for ${p.name}`,
        principals: {
          users: [`user-${idx + 1}`, `user-${idx + 2}`],
          groups: [`group-${(idx % 3) + 1}`],
          services: [`service-${(idx % 3) + 1}`],
          roles: idx < 2 ? ['admin', 'developer'] : ['developer'],
        },
        resources: {
          paths: p.paths,
          types: idx === 3 ? ['database'] : idx === 4 ? ['api_key'] : undefined,
        },
        permissions: p.permissions as AccessLevel[],
        conditions: idx === 0 ? {
          ipAddresses: ['10.0.0.0/8', '192.168.0.0/16'],
          mfaRequired: true,
        } : undefined,
        priority: 100 - idx * 10,
        enabled: true,
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.accessPolicies.set(policy.id, policy);
    });

    // Initialize certificates
    const certsData = [
      { name: 'api.rescueping.com', type: 'server', cn: 'api.rescueping.com' },
      { name: 'rescueping.com', type: 'server', cn: '*.rescueping.com' },
      { name: 'internal-ca', type: 'ca', cn: 'RescuePing Internal CA' },
      { name: 'client-cert', type: 'client', cn: 'api-client' },
    ];

    certsData.forEach((c, idx) => {
      const daysRemaining = Math.floor(Math.random() * 300) + 30;
      const cert: Certificate = {
        id: `cert-${(idx + 1).toString().padStart(4, '0')}`,
        name: c.name,
        type: c.type as Certificate['type'],
        status: daysRemaining > 30 ? 'active' : daysRemaining > 0 ? 'active' : 'expired',
        subject: {
          commonName: c.cn,
          organization: 'RescuePing',
          organizationalUnit: 'Engineering',
          country: 'IN',
          state: 'Karnataka',
          locality: 'Bangalore',
        },
        issuer: {
          commonName: c.type === 'ca' ? c.cn : 'RescuePing Internal CA',
          organization: 'RescuePing',
        },
        serialNumber: this.generateHex(32),
        fingerprint: {
          sha1: this.generateHex(40),
          sha256: this.generateHex(64),
        },
        validity: {
          notBefore: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          notAfter: new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000),
          daysRemaining,
        },
        keyUsage: c.type === 'ca' ? ['keyCertSign', 'cRLSign'] : ['digitalSignature', 'keyEncipherment'],
        extKeyUsage: c.type === 'server' ? ['serverAuth'] : c.type === 'client' ? ['clientAuth'] : [],
        sans: c.type === 'server' ? {
          dnsNames: [c.cn, `www.${c.cn.replace('*.', '')}`],
          ipAddresses: [],
          emails: [],
        } : undefined,
        chain: c.type !== 'ca' ? ['cert-0003'] : [],
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'pki-admin',
        },
      };
      this.certificates.set(cert.id, cert);
    });

    // Initialize audit logs
    const actions = ['create', 'read', 'update', 'rotate', 'access', 'deny'];
    for (let i = 0; i < 100; i++) {
      const action = actions[i % 6] as AuditLogEntry['action'];
      const log: AuditLogEntry = {
        id: `audit-${(i + 1).toString().padStart(8, '0')}`,
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
        action,
        resource: {
          type: 'secret',
          id: `secret-${((i % 12) + 1).toString().padStart(6, '0')}`,
          path: `secret/production/${['db', 'api', 'jwt', 'ssh'][i % 4]}`,
        },
        actor: {
          type: i % 3 === 0 ? 'user' : i % 3 === 1 ? 'service' : 'system',
          id: `actor-${(i % 10) + 1}`,
          name: i % 3 === 0 ? `User ${(i % 5) + 1}` : i % 3 === 1 ? `Service ${(i % 3) + 1}` : 'System',
          ip: `10.0.${i % 256}.${(i * 7) % 256}`,
        },
        details: {
          method: ['GET', 'POST', 'PUT', 'DELETE'][i % 4],
          status: action === 'deny' ? 'failure' : 'success',
          reason: action === 'deny' ? 'Access denied: insufficient permissions' : undefined,
        },
        request: {
          id: `req-${i + 1}`,
          path: `/v1/secrets/${((i % 12) + 1).toString().padStart(6, '0')}`,
          method: ['GET', 'POST', 'PUT', 'DELETE'][i % 4],
        },
      };
      this.auditLogs.set(log.id, log);
    }

    // Initialize access requests
    for (let i = 0; i < 10; i++) {
      const request: AccessRequest = {
        id: `request-${(i + 1).toString().padStart(4, '0')}`,
        secretId: `secret-${((i % 12) + 1).toString().padStart(6, '0')}`,
        requestor: {
          id: `user-${(i % 5) + 1}`,
          name: `User ${(i % 5) + 1}`,
          type: 'user',
        },
        reason: `Need access for ${['deployment', 'debugging', 'audit', 'maintenance'][i % 4]}`,
        duration: [3600000, 86400000, 604800000][i % 3],
        status: ['pending', 'approved', 'approved', 'denied', 'expired'][i % 5] as AccessRequest['status'],
        approval: i % 5 === 1 || i % 5 === 2 ? {
          approvedBy: 'admin',
          approvedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + (7 - i) * 24 * 60 * 60 * 1000),
          comments: 'Approved for temporary access',
        } : undefined,
        metadata: {
          createdAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        },
      };
      this.accessRequests.set(request.id, request);
    }
  }

  /**
   * Generate encrypted value placeholder
   */
  private generateEncryptedValue(): string {
    return Buffer.from(this.generateHex(64)).toString('base64');
  }

  /**
   * Generate hex string
   */
  private generateHex(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  /**
   * Get secrets
   */
  public getSecrets(filter?: {
    type?: SecretType;
    status?: SecretStatus;
    path?: string;
    tags?: string[];
  }): Secret[] {
    let secrets = Array.from(this.secrets.values());
    if (filter?.type) secrets = secrets.filter((s) => s.type === filter.type);
    if (filter?.status) secrets = secrets.filter((s) => s.status === filter.status);
    if (filter?.path) secrets = secrets.filter((s) => s.path.startsWith(filter.path!));
    if (filter?.tags?.length) {
      secrets = secrets.filter((s) => filter.tags!.some((t) => s.metadata.tags.includes(t)));
    }
    return secrets.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get secret
   */
  public getSecret(id: string): Secret | undefined {
    return this.secrets.get(id);
  }

  /**
   * Get secret by path
   */
  public getSecretByPath(path: string): Secret | undefined {
    return Array.from(this.secrets.values()).find((s) => s.path === path);
  }

  /**
   * Get secret versions
   */
  public getSecretVersions(secretId: string): SecretVersion[] {
    return this.secretVersions.get(secretId) || [];
  }

  /**
   * Rotate secret
   */
  public rotateSecret(secretId: string, actor: string): Secret {
    const secret = this.secrets.get(secretId);
    if (!secret) throw new Error('Secret not found');

    const newVersion = secret.version + 1;
    const newVersionEntry: SecretVersion = {
      id: `version-${secretId}-${newVersion}`,
      secretId,
      version: newVersion,
      value: {
        ciphertext: this.generateEncryptedValue(),
        algorithm: secret.value.algorithm,
        keyId: secret.value.keyId,
        iv: this.generateHex(24),
        authTag: this.generateHex(32),
        encrypted: true,
      },
      status: 'current',
      metadata: {
        createdAt: new Date(),
        createdBy: actor,
        reason: 'Rotation',
      },
    };

    // Update previous versions
    const versions = this.secretVersions.get(secretId) || [];
    versions.forEach((v) => {
      if (v.status === 'current') v.status = 'previous';
      else if (v.status === 'previous') v.status = 'deprecated';
    });
    versions.push(newVersionEntry);
    this.secretVersions.set(secretId, versions);

    // Update secret
    secret.version = newVersion;
    secret.value = newVersionEntry.value;
    secret.rotation.lastRotated = new Date();
    secret.rotation.nextRotation = new Date(Date.now() + (secret.rotation.interval || 90 * 24 * 60 * 60 * 1000));
    secret.audit.updatedAt = new Date();
    secret.audit.updatedBy = actor;

    this.emit('secret_rotated', { secretId, version: newVersion, actor });
    this.logAudit('rotate', 'secret', secret.id, secret.path, actor);

    return secret;
  }

  /**
   * Get encryption keys
   */
  public getEncryptionKeys(filter?: { status?: EncryptionKey['status'] }): EncryptionKey[] {
    let keys = Array.from(this.encryptionKeys.values());
    if (filter?.status) keys = keys.filter((k) => k.status === filter.status);
    return keys;
  }

  /**
   * Get access policies
   */
  public getAccessPolicies(filter?: { enabled?: boolean }): AccessPolicy[] {
    let policies = Array.from(this.accessPolicies.values());
    if (filter?.enabled !== undefined) policies = policies.filter((p) => p.enabled === filter.enabled);
    return policies.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Check access
   */
  public checkAccess(actorId: string, actorType: string, secretPath: string, permission: AccessLevel): boolean {
    const policies = Array.from(this.accessPolicies.values())
      .filter((p) => p.enabled)
      .sort((a, b) => b.priority - a.priority);

    for (const policy of policies) {
      const matchesPrincipal = actorType === 'user'
        ? policy.principals.users.includes(actorId)
        : policy.principals.services.includes(actorId);

      const matchesPath = policy.resources.paths.some((p) => {
        if (p.endsWith('*')) {
          return secretPath.startsWith(p.slice(0, -1));
        }
        return secretPath === p;
      });

      if (matchesPrincipal && matchesPath && policy.permissions.includes(permission)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get vaults
   */
  public getVaults(filter?: { type?: Vault['type']; status?: Vault['status'] }): Vault[] {
    let vaults = Array.from(this.vaults.values());
    if (filter?.type) vaults = vaults.filter((v) => v.type === filter.type);
    if (filter?.status) vaults = vaults.filter((v) => v.status === filter.status);
    return vaults;
  }

  /**
   * Get certificates
   */
  public getCertificates(filter?: {
    type?: Certificate['type'];
    status?: Certificate['status'];
    expiringSoon?: boolean;
  }): Certificate[] {
    let certs = Array.from(this.certificates.values());
    if (filter?.type) certs = certs.filter((c) => c.type === filter.type);
    if (filter?.status) certs = certs.filter((c) => c.status === filter.status);
    if (filter?.expiringSoon) certs = certs.filter((c) => c.validity.daysRemaining <= 30);
    return certs;
  }

  /**
   * Get audit logs
   */
  public getAuditLogs(filter?: {
    action?: AuditLogEntry['action'];
    resourceType?: AuditLogEntry['resource']['type'];
    actorId?: string;
    limit?: number;
  }): AuditLogEntry[] {
    let logs = Array.from(this.auditLogs.values());
    if (filter?.action) logs = logs.filter((l) => l.action === filter.action);
    if (filter?.resourceType) logs = logs.filter((l) => l.resource.type === filter.resourceType);
    if (filter?.actorId) logs = logs.filter((l) => l.actor.id === filter.actorId);
    logs = logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (filter?.limit) logs = logs.slice(0, filter.limit);
    return logs;
  }

  /**
   * Log audit entry
   */
  private logAudit(action: AuditLogEntry['action'], resourceType: AuditLogEntry['resource']['type'], resourceId: string, resourcePath: string, actorId: string): void {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date(),
      action,
      resource: { type: resourceType, id: resourceId, path: resourcePath },
      actor: { type: 'user', id: actorId, name: actorId },
      details: { status: 'success' },
    };
    this.auditLogs.set(entry.id, entry);
  }

  /**
   * Get access requests
   */
  public getAccessRequests(filter?: { status?: AccessRequest['status'] }): AccessRequest[] {
    let requests = Array.from(this.accessRequests.values());
    if (filter?.status) requests = requests.filter((r) => r.status === filter.status);
    return requests.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime());
  }

  /**
   * Get metrics
   */
  public getMetrics(): SecretMetrics {
    const secrets = Array.from(this.secrets.values());
    const now = new Date();

    // Type distribution
    const typeCount: Map<SecretType, number> = new Map();
    secrets.forEach((s) => {
      typeCount.set(s.type, (typeCount.get(s.type) || 0) + 1);
    });

    // Expiration stats
    const expiring7 = secrets.filter((s) => s.expiration?.expiresAt && s.expiration.expiresAt.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000).length;
    const expiring30 = secrets.filter((s) => s.expiration?.expiresAt && s.expiration.expiresAt.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000).length;
    const expiring90 = secrets.filter((s) => s.expiration?.expiresAt && s.expiration.expiresAt.getTime() - now.getTime() < 90 * 24 * 60 * 60 * 1000).length;
    const expired = secrets.filter((s) => s.status === 'expired').length;

    // Rotation stats
    const rotatedLast30 = secrets.filter((s) => s.rotation.lastRotated && now.getTime() - s.rotation.lastRotated.getTime() < 30 * 24 * 60 * 60 * 1000).length;
    const pendingRotation = secrets.filter((s) => s.rotation.nextRotation && s.rotation.nextRotation.getTime() < now.getTime() + 7 * 24 * 60 * 60 * 1000).length;
    const overdueRotation = secrets.filter((s) => s.rotation.nextRotation && s.rotation.nextRotation.getTime() < now.getTime()).length;

    return {
      overview: {
        totalSecrets: secrets.length,
        activeSecrets: secrets.filter((s) => s.status === 'active').length,
        expiringSoon: expiring30,
        recentlyAccessed: secrets.filter((s) => s.audit.accessedAt && now.getTime() - s.audit.accessedAt.getTime() < 24 * 60 * 60 * 1000).length,
      },
      byType: Array.from(typeCount.entries()).map(([type, count]) => ({
        type,
        count,
        percentage: (count / secrets.length) * 100,
      })),
      accessStats: [],
      rotationStats: {
        rotatedLast30Days: rotatedLast30,
        pendingRotation,
        overdueRotation,
      },
      expirationStats: {
        expiring7Days: expiring7,
        expiring30Days: expiring30,
        expiring90Days: expiring90,
        expired,
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

export const secretManagementService = SecretManagementService.getInstance();
export type {
  SecretType,
  SecretStatus,
  EncryptionAlgorithm,
  AccessLevel,
  Secret,
  EncryptedValue,
  SecretVersion,
  RotationPolicy,
  EncryptionKey,
  AccessPolicy,
  Vault,
  AuditLogEntry,
  Certificate,
  AccessRequest,
  SecretMetrics,
};
