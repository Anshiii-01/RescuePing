/**
 * Secrets Management Service
 * Comprehensive secrets, credentials, and sensitive data management
 */

// Secret Type
type SecretType = 'api_key' | 'password' | 'certificate' | 'ssh_key' | 'token' | 'database_credential' | 'encryption_key' | 'oauth_credential' | 'custom';

// Secret Status
type SecretStatus = 'active' | 'inactive' | 'expired' | 'revoked' | 'pending_rotation';

// Access Level
type AccessLevel = 'read' | 'write' | 'admin';

// Encryption Algorithm
type EncryptionAlgorithm = 'aes-256-gcm' | 'aes-256-cbc' | 'rsa-4096' | 'chacha20-poly1305';

// Secret
interface Secret {
  id: string;
  name: string;
  description: string;
  type: SecretType;
  status: SecretStatus;
  value: EncryptedValue;
  version: number;
  environment: string[];
  tags: string[];
  path: string;
  rotation: RotationConfig;
  access: AccessConfig;
  audit: SecretAuditEntry[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    expiresAt?: Date;
    lastAccessed?: Date;
    lastRotated?: Date;
  };
}

// Encrypted Value
interface EncryptedValue {
  ciphertext: string;
  algorithm: EncryptionAlgorithm;
  keyId: string;
  iv?: string;
  tag?: string;
  encoding: 'base64' | 'hex';
}

// Rotation Config
interface RotationConfig {
  enabled: boolean;
  schedule?: RotationSchedule;
  automatic: boolean;
  notifyBefore: number;
  maxAge: number;
  retainVersions: number;
  rotationLambda?: string;
  hooks?: {
    preRotation?: string;
    postRotation?: string;
    onFailure?: string;
  };
}

// Rotation Schedule
interface RotationSchedule {
  type: 'interval' | 'cron' | 'manual';
  intervalDays?: number;
  cronExpression?: string;
  nextRotation?: Date;
  lastRotation?: Date;
}

// Access Config
interface AccessConfig {
  policies: AccessPolicy[];
  allowedPrincipals: Principal[];
  deniedPrincipals: Principal[];
  conditions: AccessCondition[];
  ipWhitelist?: string[];
  mfaRequired: boolean;
  auditAccess: boolean;
}

// Access Policy
interface AccessPolicy {
  id: string;
  name: string;
  effect: 'allow' | 'deny';
  actions: ('read' | 'write' | 'delete' | 'rotate' | 'share')[];
  resources: string[];
  conditions?: AccessCondition[];
}

// Principal
interface Principal {
  type: 'user' | 'role' | 'service' | 'group';
  id: string;
  name: string;
}

// Access Condition
interface AccessCondition {
  type: 'time' | 'ip' | 'mfa' | 'environment' | 'custom';
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'between';
  value: unknown;
}

// Secret Audit Entry
interface SecretAuditEntry {
  id: string;
  timestamp: Date;
  action: 'created' | 'read' | 'updated' | 'deleted' | 'rotated' | 'accessed' | 'shared' | 'policy_changed';
  actor: {
    type: 'user' | 'service' | 'system';
    id: string;
    name: string;
  };
  source: {
    ip?: string;
    userAgent?: string;
    service?: string;
  };
  details?: Record<string, unknown>;
  success: boolean;
  errorMessage?: string;
}

// Secret Version
interface SecretVersion {
  id: string;
  secretId: string;
  version: number;
  value: EncryptedValue;
  status: 'current' | 'previous' | 'deprecated' | 'deleted';
  createdAt: Date;
  createdBy: string;
  deprecatedAt?: Date;
  deletedAt?: Date;
  metadata?: Record<string, unknown>;
}

// Encryption Key
interface EncryptionKey {
  id: string;
  name: string;
  description: string;
  algorithm: EncryptionAlgorithm;
  status: 'active' | 'inactive' | 'pending_deletion' | 'deleted';
  type: 'symmetric' | 'asymmetric';
  keyMaterial?: EncryptedValue;
  publicKey?: string;
  origin: 'internal' | 'external' | 'hsm';
  usage: ('encrypt' | 'decrypt' | 'sign' | 'verify' | 'wrap' | 'unwrap')[];
  rotation: {
    enabled: boolean;
    period: number;
    lastRotated?: Date;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    expiresAt?: Date;
    deletionDate?: Date;
  };
}

// Vault
interface Vault {
  id: string;
  name: string;
  description: string;
  type: 'standard' | 'hsm' | 'external';
  status: 'active' | 'sealed' | 'standby';
  region: string;
  secrets: string[];
  keys: string[];
  config: VaultConfig;
  seal: SealConfig;
  audit: VaultAuditConfig;
  metrics: VaultMetrics;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    lastUnsealed?: Date;
  };
}

// Vault Config
interface VaultConfig {
  maxVersions: number;
  defaultTtl: number;
  maxTtl: number;
  deletionProtection: boolean;
  casRequired: boolean;
  softDelete: {
    enabled: boolean;
    retentionDays: number;
  };
}

// Seal Config
interface SealConfig {
  type: 'shamir' | 'transit' | 'awskms' | 'gcpkms' | 'azurekv';
  threshold?: number;
  shares?: number;
  keyId?: string;
  recovery?: {
    enabled: boolean;
    shares: number;
    threshold: number;
  };
}

// Vault Audit Config
interface VaultAuditConfig {
  enabled: boolean;
  logPath?: string;
  format: 'json' | 'jsonx';
  hmacAccessor: boolean;
  logSensitiveData: boolean;
  elideListResponses: boolean;
}

// Vault Metrics
interface VaultMetrics {
  secretsCount: number;
  keysCount: number;
  accessCount: number;
  rotationsCount: number;
  last24h: {
    reads: number;
    writes: number;
    rotations: number;
    failures: number;
  };
}

// Service Account
interface ServiceAccount {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'locked';
  credentials: ServiceCredential[];
  permissions: Permission[];
  secretAccess: string[];
  quotas: {
    maxSecretsAccess: number;
    maxRequestsPerMinute: number;
    maxRequestsPerDay: number;
  };
  lastActivity?: Date;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    expiresAt?: Date;
  };
}

// Service Credential
interface ServiceCredential {
  id: string;
  type: 'api_key' | 'certificate' | 'token';
  value?: string;
  status: 'active' | 'inactive' | 'revoked';
  expiresAt?: Date;
  lastUsed?: Date;
  createdAt: Date;
  createdBy: string;
}

// Permission
interface Permission {
  resource: string;
  actions: AccessLevel[];
  conditions?: AccessCondition[];
}

// Lease
interface SecretLease {
  id: string;
  secretId: string;
  secretPath: string;
  principal: Principal;
  ttl: number;
  renewable: boolean;
  maxTtl: number;
  issuedAt: Date;
  expiresAt: Date;
  renewedAt?: Date;
  revokedAt?: Date;
  status: 'active' | 'expired' | 'revoked';
  metadata?: Record<string, unknown>;
}

// Dynamic Secret Template
interface DynamicSecretTemplate {
  id: string;
  name: string;
  description: string;
  type: 'database' | 'aws' | 'gcp' | 'azure' | 'ssh' | 'pki' | 'custom';
  backend: string;
  config: {
    connectionString?: string;
    role?: string;
    ttl?: number;
    maxTtl?: number;
    creationStatements?: string[];
    revocationStatements?: string[];
    rollbackStatements?: string[];
    renewStatements?: string[];
  };
  enabled: boolean;
  metrics: {
    generated: number;
    revoked: number;
    active: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
  };
}

// Certificate
interface Certificate {
  id: string;
  name: string;
  description: string;
  type: 'root_ca' | 'intermediate_ca' | 'leaf' | 'client';
  status: 'active' | 'expired' | 'revoked' | 'pending';
  subject: {
    commonName: string;
    organization?: string;
    organizationalUnit?: string;
    country?: string;
    state?: string;
    locality?: string;
  };
  issuer?: string;
  serialNumber: string;
  publicKey: string;
  privateKey?: EncryptedValue;
  chain?: string[];
  sans?: string[];
  keyUsage?: string[];
  extKeyUsage?: string[];
  validity: {
    notBefore: Date;
    notAfter: Date;
  };
  fingerprint: {
    sha1: string;
    sha256: string;
  };
  revocation?: {
    revokedAt: Date;
    reason: string;
    revokedBy: string;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    renewedAt?: Date;
  };
}

// Secret Template
interface SecretTemplate {
  id: string;
  name: string;
  description: string;
  type: SecretType;
  schema: {
    fields: TemplateField[];
    required: string[];
    validation?: string;
  };
  defaults: Record<string, unknown>;
  rotation?: Omit<RotationConfig, 'schedule'>;
  access?: Partial<AccessConfig>;
  tags: string[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    usageCount: number;
  };
}

// Template Field
interface TemplateField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'secret';
  description?: string;
  default?: unknown;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

// Secrets Statistics
interface SecretsStatistics {
  overview: {
    totalSecrets: number;
    activeSecrets: number;
    expiredSecrets: number;
    pendingRotation: number;
    totalVersions: number;
  };
  byType: Record<SecretType, number>;
  byEnvironment: Record<string, number>;
  access: {
    totalAccesses: number;
    last24hAccesses: number;
    uniqueAccessors: number;
    deniedAccesses: number;
  };
  rotation: {
    rotationsLast30d: number;
    scheduledRotations: number;
    failedRotations: number;
    avgRotationAge: number;
  };
  security: {
    secretsWithMfa: number;
    secretsWithRotation: number;
    secretsExpiringSoon: number;
    policyViolations: number;
  };
  trends: {
    date: string;
    created: number;
    accessed: number;
    rotated: number;
  }[];
}

class SecretsManagementService {
  private static instance: SecretsManagementService;
  private secrets: Map<string, Secret> = new Map();
  private versions: Map<string, SecretVersion[]> = new Map();
  private keys: Map<string, EncryptionKey> = new Map();
  private vaults: Map<string, Vault> = new Map();
  private serviceAccounts: Map<string, ServiceAccount> = new Map();
  private leases: Map<string, SecretLease> = new Map();
  private dynamicTemplates: Map<string, DynamicSecretTemplate> = new Map();
  private certificates: Map<string, Certificate> = new Map();
  private templates: Map<string, SecretTemplate> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): SecretsManagementService {
    if (!SecretsManagementService.instance) {
      SecretsManagementService.instance = new SecretsManagementService();
    }
    return SecretsManagementService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Encryption Keys
    const keysData = [
      { name: 'Master Key', algorithm: 'aes-256-gcm', type: 'symmetric' },
      { name: 'Signing Key', algorithm: 'rsa-4096', type: 'asymmetric' },
      { name: 'Data Encryption Key', algorithm: 'aes-256-gcm', type: 'symmetric' },
      { name: 'Transit Key', algorithm: 'chacha20-poly1305', type: 'symmetric' },
    ];

    keysData.forEach((k, idx) => {
      const key: EncryptionKey = {
        id: `key-${(idx + 1).toString().padStart(4, '0')}`,
        name: k.name,
        description: `${k.name} for secrets encryption`,
        algorithm: k.algorithm as EncryptionAlgorithm,
        status: 'active',
        type: k.type as EncryptionKey['type'],
        origin: idx === 0 ? 'hsm' : 'internal',
        usage: k.type === 'symmetric' ? ['encrypt', 'decrypt'] : ['sign', 'verify', 'wrap', 'unwrap'],
        rotation: {
          enabled: true,
          period: 90,
          lastRotated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
        },
      };
      this.keys.set(key.id, key);
    });

    // Initialize Vaults
    const vaultsData = [
      { name: 'Production Vault', type: 'hsm', region: 'us-east-1' },
      { name: 'Development Vault', type: 'standard', region: 'us-west-2' },
      { name: 'CI/CD Vault', type: 'standard', region: 'us-east-1' },
    ];

    vaultsData.forEach((v, idx) => {
      const vault: Vault = {
        id: `vault-${(idx + 1).toString().padStart(4, '0')}`,
        name: v.name,
        description: `${v.name} for secure secrets storage`,
        type: v.type as Vault['type'],
        status: 'active',
        region: v.region,
        secrets: [],
        keys: Array.from(this.keys.keys()).slice(0, 2),
        config: {
          maxVersions: 10,
          defaultTtl: 86400,
          maxTtl: 2592000,
          deletionProtection: v.type === 'hsm',
          casRequired: true,
          softDelete: {
            enabled: true,
            retentionDays: 30,
          },
        },
        seal: {
          type: v.type === 'hsm' ? 'awskms' : 'shamir',
          threshold: 3,
          shares: 5,
          keyId: v.type === 'hsm' ? 'arn:aws:kms:us-east-1:123456789:key/abc123' : undefined,
        },
        audit: {
          enabled: true,
          format: 'json',
          hmacAccessor: true,
          logSensitiveData: false,
          elideListResponses: true,
        },
        metrics: {
          secretsCount: Math.floor(Math.random() * 100) + 20,
          keysCount: 2,
          accessCount: Math.floor(Math.random() * 10000) + 1000,
          rotationsCount: Math.floor(Math.random() * 50) + 10,
          last24h: {
            reads: Math.floor(Math.random() * 500) + 100,
            writes: Math.floor(Math.random() * 50) + 10,
            rotations: Math.floor(Math.random() * 5),
            failures: Math.floor(Math.random() * 10),
          },
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          lastUnsealed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
      };
      this.vaults.set(vault.id, vault);
    });

    // Initialize Secrets
    const secretsData = [
      { name: 'Database Password', type: 'database_credential', env: ['production'] },
      { name: 'API Key - Stripe', type: 'api_key', env: ['production', 'staging'] },
      { name: 'JWT Signing Key', type: 'encryption_key', env: ['production', 'staging', 'development'] },
      { name: 'AWS Access Key', type: 'token', env: ['production'] },
      { name: 'SendGrid API Key', type: 'api_key', env: ['production', 'staging'] },
      { name: 'GitHub Token', type: 'token', env: ['development', 'ci'] },
      { name: 'SSH Deploy Key', type: 'ssh_key', env: ['production'] },
      { name: 'TLS Certificate', type: 'certificate', env: ['production'] },
      { name: 'OAuth Client Secret', type: 'oauth_credential', env: ['production', 'staging'] },
      { name: 'Encryption Master Key', type: 'encryption_key', env: ['production'] },
    ];

    const usersData = ['admin', 'devops', 'security-team', 'automation'];

    secretsData.forEach((s, idx) => {
      const user = usersData[idx % usersData.length];
      const expiresAt = s.type === 'api_key' || s.type === 'token' ? new Date(Date.now() + (Math.random() * 180 + 30) * 24 * 60 * 60 * 1000) : undefined;
      const isExpiringSoon = expiresAt && expiresAt.getTime() < Date.now() + 30 * 24 * 60 * 60 * 1000;

      const secret: Secret = {
        id: `secret-${(idx + 1).toString().padStart(4, '0')}`,
        name: s.name,
        description: `${s.name} secret`,
        type: s.type as SecretType,
        status: isExpiringSoon ? 'pending_rotation' : 'active',
        value: {
          ciphertext: Buffer.from(`encrypted-value-${idx}`).toString('base64'),
          algorithm: 'aes-256-gcm',
          keyId: 'key-0001',
          iv: Buffer.from('random-iv').toString('base64'),
          tag: Buffer.from('auth-tag').toString('base64'),
          encoding: 'base64',
        },
        version: Math.floor(Math.random() * 10) + 1,
        environment: s.env,
        tags: [s.type, ...s.env],
        path: `/secrets/${s.env[0]}/${s.name.toLowerCase().replace(/\s/g, '-')}`,
        rotation: {
          enabled: s.type !== 'certificate',
          schedule: {
            type: 'interval',
            intervalDays: s.type === 'api_key' ? 90 : 180,
            nextRotation: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
            lastRotation: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          },
          automatic: idx < 5,
          notifyBefore: 14,
          maxAge: 365,
          retainVersions: 5,
        },
        access: {
          policies: [
            {
              id: `policy-${idx}-1`,
              name: 'Default Read Policy',
              effect: 'allow',
              actions: ['read'],
              resources: [`/secrets/${s.env[0]}/*`],
            },
          ],
          allowedPrincipals: [
            { type: 'user', id: 'admin', name: 'Admin User' },
            { type: 'service', id: 'api-service', name: 'API Service' },
          ],
          deniedPrincipals: [],
          conditions: s.env.includes('production') ? [
            { type: 'ip', operator: 'in', value: ['10.0.0.0/8', '192.168.0.0/16'] },
          ] : [],
          mfaRequired: s.env.includes('production'),
          auditAccess: true,
        },
        audit: [
          {
            id: `audit-${idx}-1`,
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
            action: 'accessed',
            actor: { type: 'service', id: 'api-service', name: 'API Service' },
            source: { ip: '10.0.1.50', service: 'api-service' },
            success: true,
          },
          {
            id: `audit-${idx}-2`,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            action: 'rotated',
            actor: { type: 'system', id: 'rotation-service', name: 'Rotation Service' },
            source: { service: 'rotation-service' },
            success: true,
          },
        ],
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: user,
          updatedAt: new Date(),
          expiresAt,
          lastAccessed: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          lastRotated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        },
      };
      this.secrets.set(secret.id, secret);

      // Add secret to vault
      const vault = Array.from(this.vaults.values())[0];
      vault.secrets.push(secret.id);

      // Generate versions
      const secretVersions: SecretVersion[] = [];
      for (let v = 0; v < secret.version; v++) {
        const version: SecretVersion = {
          id: `version-${secret.id}-${v + 1}`,
          secretId: secret.id,
          version: v + 1,
          value: {
            ciphertext: Buffer.from(`encrypted-value-${idx}-v${v + 1}`).toString('base64'),
            algorithm: 'aes-256-gcm',
            keyId: 'key-0001',
            encoding: 'base64',
          },
          status: v + 1 === secret.version ? 'current' : v + 1 === secret.version - 1 ? 'previous' : 'deprecated',
          createdAt: new Date(Date.now() - (secret.version - v) * 30 * 24 * 60 * 60 * 1000),
          createdBy: user,
        };
        secretVersions.push(version);
      }
      this.versions.set(secret.id, secretVersions);
    });

    // Initialize Service Accounts
    const serviceAccountsData = [
      { name: 'API Service', secrets: ['secret-0001', 'secret-0002', 'secret-0003'] },
      { name: 'Background Worker', secrets: ['secret-0001', 'secret-0004'] },
      { name: 'CI/CD Pipeline', secrets: ['secret-0006', 'secret-0007'] },
      { name: 'Monitoring Service', secrets: ['secret-0002', 'secret-0005'] },
    ];

    serviceAccountsData.forEach((sa, idx) => {
      const account: ServiceAccount = {
        id: `sa-${(idx + 1).toString().padStart(4, '0')}`,
        name: sa.name,
        description: `Service account for ${sa.name}`,
        status: 'active',
        credentials: [
          {
            id: `cred-${idx}-1`,
            type: 'api_key',
            value: `sk_${this.generateId()}`,
            status: 'active',
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            lastUsed: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            createdBy: 'admin',
          },
        ],
        permissions: [
          { resource: '/secrets/*', actions: ['read'] },
          { resource: '/keys/*', actions: ['read'] },
        ],
        secretAccess: sa.secrets,
        quotas: {
          maxSecretsAccess: 10,
          maxRequestsPerMinute: 100,
          maxRequestsPerDay: 10000,
        },
        lastActivity: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.serviceAccounts.set(account.id, account);
    });

    // Initialize Leases
    for (let i = 0; i < 10; i++) {
      const secret = Array.from(this.secrets.values())[i % this.secrets.size];
      const lease: SecretLease = {
        id: `lease-${this.generateId()}`,
        secretId: secret.id,
        secretPath: secret.path,
        principal: secret.access.allowedPrincipals[0],
        ttl: 3600,
        renewable: true,
        maxTtl: 86400,
        issuedAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + Math.random() * 60 * 60 * 1000),
        status: 'active',
      };
      this.leases.set(lease.id, lease);
    }

    // Initialize Dynamic Secret Templates
    const dynamicTemplatesData = [
      { name: 'PostgreSQL Credentials', type: 'database', backend: 'postgresql' },
      { name: 'MySQL Credentials', type: 'database', backend: 'mysql' },
      { name: 'AWS STS Credentials', type: 'aws', backend: 'aws-sts' },
      { name: 'SSH Certificates', type: 'ssh', backend: 'ssh-ca' },
    ];

    dynamicTemplatesData.forEach((dt, idx) => {
      const template: DynamicSecretTemplate = {
        id: `dyn-${(idx + 1).toString().padStart(4, '0')}`,
        name: dt.name,
        description: `Dynamic ${dt.name.toLowerCase()}`,
        type: dt.type as DynamicSecretTemplate['type'],
        backend: dt.backend,
        config: {
          ttl: 3600,
          maxTtl: 86400,
          role: `${dt.backend}-role`,
          creationStatements: dt.type === 'database' ? ['CREATE USER ...', 'GRANT SELECT ON ...'] : undefined,
          revocationStatements: dt.type === 'database' ? ['DROP USER ...'] : undefined,
        },
        enabled: true,
        metrics: {
          generated: Math.floor(Math.random() * 1000) + 100,
          revoked: Math.floor(Math.random() * 500) + 50,
          active: Math.floor(Math.random() * 50) + 10,
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
        },
      };
      this.dynamicTemplates.set(template.id, template);
    });

    // Initialize Certificates
    const certificatesData = [
      { name: 'Root CA', type: 'root_ca', cn: 'RescuePing Root CA' },
      { name: 'Intermediate CA', type: 'intermediate_ca', cn: 'RescuePing Intermediate CA' },
      { name: 'API Server Certificate', type: 'leaf', cn: 'api.rescueping.com' },
      { name: 'Web Server Certificate', type: 'leaf', cn: '*.rescueping.com' },
    ];

    certificatesData.forEach((c, idx) => {
      const cert: Certificate = {
        id: `cert-${(idx + 1).toString().padStart(4, '0')}`,
        name: c.name,
        description: `${c.name} for RescuePing`,
        type: c.type as Certificate['type'],
        status: 'active',
        subject: {
          commonName: c.cn,
          organization: 'RescuePing Inc',
          organizationalUnit: 'Engineering',
          country: 'US',
          state: 'California',
          locality: 'San Francisco',
        },
        issuer: c.type !== 'root_ca' ? 'cert-0001' : undefined,
        serialNumber: Math.random().toString(16).substring(2, 18),
        publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----',
        sans: c.type === 'leaf' ? [c.cn, `www.${c.cn.replace('*.', '')}`] : undefined,
        keyUsage: c.type.includes('ca') ? ['digitalSignature', 'keyCertSign', 'cRLSign'] : ['digitalSignature', 'keyEncipherment'],
        extKeyUsage: c.type === 'leaf' ? ['serverAuth', 'clientAuth'] : undefined,
        validity: {
          notBefore: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          notAfter: new Date(Date.now() + (c.type.includes('ca') ? 10 : 1) * 365 * 24 * 60 * 60 * 1000),
        },
        fingerprint: {
          sha1: Math.random().toString(16).substring(2, 42),
          sha256: Math.random().toString(16).substring(2, 66),
        },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
        },
      };
      this.certificates.set(cert.id, cert);
    });

    // Initialize Secret Templates
    const templatesData = [
      { name: 'API Key Template', type: 'api_key' },
      { name: 'Database Credential Template', type: 'database_credential' },
      { name: 'OAuth Credential Template', type: 'oauth_credential' },
    ];

    templatesData.forEach((t, idx) => {
      const template: SecretTemplate = {
        id: `tmpl-${(idx + 1).toString().padStart(4, '0')}`,
        name: t.name,
        description: `Template for ${t.type.replace('_', ' ')} secrets`,
        type: t.type as SecretType,
        schema: {
          fields: [
            { name: 'value', type: 'secret', description: 'The secret value' },
            { name: 'environment', type: 'string', description: 'Target environment' },
            { name: 'expires_at', type: 'string', description: 'Expiration date' },
          ],
          required: ['value', 'environment'],
        },
        defaults: {
          rotation_enabled: true,
          rotation_days: 90,
        },
        rotation: {
          enabled: true,
          automatic: false,
          notifyBefore: 14,
          maxAge: 365,
          retainVersions: 5,
        },
        tags: ['template', t.type],
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          usageCount: Math.floor(Math.random() * 50) + 10,
        },
      };
      this.templates.set(template.id, template);
    });
  }

  // Secret Operations
  public getSecrets(type?: SecretType, environment?: string): Secret[] {
    let secrets = Array.from(this.secrets.values());
    if (type) secrets = secrets.filter((s) => s.type === type);
    if (environment) secrets = secrets.filter((s) => s.environment.includes(environment));
    return secrets.sort((a, b) => a.name.localeCompare(b.name));
  }

  public getSecretById(id: string): Secret | undefined {
    return this.secrets.get(id);
  }

  public getSecretByPath(path: string): Secret | undefined {
    return Array.from(this.secrets.values()).find((s) => s.path === path);
  }

  public createSecret(data: Partial<Secret>): Secret {
    const secret: Secret = {
      id: `secret-${this.generateId()}`,
      name: data.name || 'New Secret',
      description: data.description || '',
      type: data.type || 'custom',
      status: 'active',
      value: data.value || { ciphertext: '', algorithm: 'aes-256-gcm', keyId: 'key-0001', encoding: 'base64' },
      version: 1,
      environment: data.environment || ['development'],
      tags: data.tags || [],
      path: data.path || `/secrets/${data.name?.toLowerCase().replace(/\s/g, '-')}`,
      rotation: data.rotation || { enabled: false, automatic: false, notifyBefore: 14, maxAge: 365, retainVersions: 5 },
      access: data.access || { policies: [], allowedPrincipals: [], deniedPrincipals: [], conditions: [], mfaRequired: false, auditAccess: true },
      audit: [],
      metadata: { createdAt: new Date(), createdBy: 'admin', updatedAt: new Date() },
    };
    this.secrets.set(secret.id, secret);
    this.emit('secret.created', secret);
    return secret;
  }

  public rotateSecret(id: string): Secret {
    const secret = this.secrets.get(id);
    if (!secret) throw new Error('Secret not found');
    
    secret.version++;
    secret.metadata.lastRotated = new Date();
    secret.metadata.updatedAt = new Date();
    secret.status = 'active';
    
    if (secret.rotation.schedule) {
      secret.rotation.schedule.lastRotation = new Date();
      secret.rotation.schedule.nextRotation = new Date(Date.now() + (secret.rotation.schedule.intervalDays || 90) * 24 * 60 * 60 * 1000);
    }

    this.emit('secret.rotated', secret);
    return secret;
  }

  public revokeSecret(id: string, reason: string): Secret {
    const secret = this.secrets.get(id);
    if (!secret) throw new Error('Secret not found');
    
    secret.status = 'revoked';
    secret.metadata.updatedAt = new Date();
    secret.audit.push({
      id: `audit-${this.generateId()}`,
      timestamp: new Date(),
      action: 'deleted',
      actor: { type: 'user', id: 'admin', name: 'Admin' },
      source: {},
      details: { reason },
      success: true,
    });

    this.emit('secret.revoked', { secret, reason });
    return secret;
  }

  // Version Operations
  public getVersions(secretId: string): SecretVersion[] {
    return this.versions.get(secretId) || [];
  }

  public getVersion(secretId: string, version: number): SecretVersion | undefined {
    const versions = this.versions.get(secretId);
    return versions?.find((v) => v.version === version);
  }

  // Key Operations
  public getKeys(): EncryptionKey[] {
    return Array.from(this.keys.values());
  }

  public getKeyById(id: string): EncryptionKey | undefined {
    return this.keys.get(id);
  }

  // Vault Operations
  public getVaults(): Vault[] {
    return Array.from(this.vaults.values());
  }

  public getVaultById(id: string): Vault | undefined {
    return this.vaults.get(id);
  }

  // Service Account Operations
  public getServiceAccounts(): ServiceAccount[] {
    return Array.from(this.serviceAccounts.values());
  }

  public getServiceAccountById(id: string): ServiceAccount | undefined {
    return this.serviceAccounts.get(id);
  }

  // Lease Operations
  public getLeases(status?: SecretLease['status']): SecretLease[] {
    let leases = Array.from(this.leases.values());
    if (status) leases = leases.filter((l) => l.status === status);
    return leases;
  }

  public getLeaseById(id: string): SecretLease | undefined {
    return this.leases.get(id);
  }

  public renewLease(id: string): SecretLease {
    const lease = this.leases.get(id);
    if (!lease) throw new Error('Lease not found');
    if (!lease.renewable) throw new Error('Lease is not renewable');
    
    lease.renewedAt = new Date();
    lease.expiresAt = new Date(Date.now() + lease.ttl * 1000);
    
    this.emit('lease.renewed', lease);
    return lease;
  }

  public revokeLease(id: string): SecretLease {
    const lease = this.leases.get(id);
    if (!lease) throw new Error('Lease not found');
    
    lease.status = 'revoked';
    lease.revokedAt = new Date();
    
    this.emit('lease.revoked', lease);
    return lease;
  }

  // Dynamic Secret Operations
  public getDynamicTemplates(): DynamicSecretTemplate[] {
    return Array.from(this.dynamicTemplates.values());
  }

  public getDynamicTemplateById(id: string): DynamicSecretTemplate | undefined {
    return this.dynamicTemplates.get(id);
  }

  // Certificate Operations
  public getCertificates(type?: Certificate['type']): Certificate[] {
    let certificates = Array.from(this.certificates.values());
    if (type) certificates = certificates.filter((c) => c.type === type);
    return certificates;
  }

  public getCertificateById(id: string): Certificate | undefined {
    return this.certificates.get(id);
  }

  // Template Operations
  public getTemplates(): SecretTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplateById(id: string): SecretTemplate | undefined {
    return this.templates.get(id);
  }

  // Statistics
  public getStatistics(): SecretsStatistics {
    const secrets = Array.from(this.secrets.values());
    const byType: Record<SecretType, number> = {} as Record<SecretType, number>;
    const byEnvironment: Record<string, number> = {};

    secrets.forEach((s) => {
      byType[s.type] = (byType[s.type] || 0) + 1;
      s.environment.forEach((env) => {
        byEnvironment[env] = (byEnvironment[env] || 0) + 1;
      });
    });

    return {
      overview: {
        totalSecrets: secrets.length,
        activeSecrets: secrets.filter((s) => s.status === 'active').length,
        expiredSecrets: secrets.filter((s) => s.status === 'expired').length,
        pendingRotation: secrets.filter((s) => s.status === 'pending_rotation').length,
        totalVersions: Array.from(this.versions.values()).flat().length,
      },
      byType,
      byEnvironment,
      access: {
        totalAccesses: secrets.reduce((sum, s) => sum + s.audit.filter((a) => a.action === 'accessed').length, 0),
        last24hAccesses: secrets.reduce((sum, s) => sum + s.audit.filter((a) => a.action === 'accessed' && a.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)).length, 0),
        uniqueAccessors: new Set(secrets.flatMap((s) => s.audit.map((a) => a.actor.id))).size,
        deniedAccesses: secrets.reduce((sum, s) => sum + s.audit.filter((a) => !a.success).length, 0),
      },
      rotation: {
        rotationsLast30d: secrets.filter((s) => s.metadata.lastRotated && s.metadata.lastRotated > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
        scheduledRotations: secrets.filter((s) => s.rotation.enabled && s.rotation.schedule?.nextRotation).length,
        failedRotations: 0,
        avgRotationAge: 45,
      },
      security: {
        secretsWithMfa: secrets.filter((s) => s.access.mfaRequired).length,
        secretsWithRotation: secrets.filter((s) => s.rotation.enabled).length,
        secretsExpiringSoon: secrets.filter((s) => s.metadata.expiresAt && s.metadata.expiresAt < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length,
        policyViolations: 0,
      },
      trends: [],
    };
  }

  // Event Handling
  public subscribe(callback: (event: string, data: unknown) => void): () => void {
    this.eventListeners.push(callback);
    return () => {
      const index = this.eventListeners.indexOf(callback);
      if (index > -1) this.eventListeners.splice(index, 1);
    };
  }

  private emit(event: string, data: unknown): void {
    this.eventListeners.forEach((callback) => callback(event, data));
  }
}

export const secretsManagementService = SecretsManagementService.getInstance();
export type {
  SecretType,
  SecretStatus,
  AccessLevel,
  EncryptionAlgorithm,
  Secret,
  EncryptedValue,
  RotationConfig,
  RotationSchedule,
  AccessConfig,
  AccessPolicy,
  Principal,
  AccessCondition,
  SecretAuditEntry,
  SecretVersion,
  EncryptionKey,
  Vault,
  VaultConfig,
  SealConfig,
  VaultAuditConfig,
  VaultMetrics,
  ServiceAccount,
  ServiceCredential,
  Permission,
  SecretLease,
  DynamicSecretTemplate,
  Certificate,
  SecretTemplate,
  TemplateField,
  SecretsStatistics,
};
