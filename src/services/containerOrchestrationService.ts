/**
 * Container Orchestration Service
 * Container management, deployment orchestration, scaling, and cluster operations
 */

// Container status
type ContainerStatus = 'pending' | 'running' | 'stopped' | 'failed' | 'terminated' | 'unknown';

// Pod phase
type PodPhase = 'Pending' | 'Running' | 'Succeeded' | 'Failed' | 'Unknown';

// Deployment strategy
type DeployStrategy = 'RollingUpdate' | 'Recreate' | 'BlueGreen' | 'Canary';

// Resource type
type ResourceType = 'cpu' | 'memory' | 'storage' | 'gpu';

// Restart policy
type RestartPolicy = 'Always' | 'OnFailure' | 'Never';

// Container
interface Container {
  id: string;
  name: string;
  image: string;
  imageTag: string;
  status: ContainerStatus;
  ports: {
    containerPort: number;
    protocol: 'TCP' | 'UDP';
    hostPort?: number;
  }[];
  environment: Record<string, string>;
  resources: {
    requests: { cpu: string; memory: string };
    limits: { cpu: string; memory: string };
  };
  volumeMounts: {
    name: string;
    mountPath: string;
    readOnly?: boolean;
  }[];
  healthCheck?: {
    type: 'http' | 'tcp' | 'exec';
    path?: string;
    port?: number;
    command?: string[];
    initialDelaySeconds: number;
    periodSeconds: number;
    timeoutSeconds: number;
    failureThreshold: number;
  };
  securityContext?: {
    runAsUser?: number;
    runAsGroup?: number;
    privileged?: boolean;
    readOnlyRootFilesystem?: boolean;
  };
  state: {
    running?: { startedAt: Date };
    waiting?: { reason: string; message?: string };
    terminated?: { exitCode: number; reason: string; finishedAt: Date };
  };
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    networkIn: number;
    networkOut: number;
    restartCount: number;
  };
}

// Pod
interface Pod {
  id: string;
  name: string;
  namespace: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  phase: PodPhase;
  containers: Container[];
  initContainers?: Container[];
  nodeName?: string;
  hostIP?: string;
  podIP?: string;
  serviceAccount?: string;
  restartPolicy: RestartPolicy;
  volumes: {
    name: string;
    type: 'configMap' | 'secret' | 'persistentVolumeClaim' | 'emptyDir' | 'hostPath';
    source: string;
  }[];
  conditions: {
    type: 'PodScheduled' | 'Initialized' | 'ContainersReady' | 'Ready';
    status: 'True' | 'False' | 'Unknown';
    lastTransitionTime: Date;
    reason?: string;
    message?: string;
  }[];
  metadata: {
    createdAt: Date;
    uid: string;
    ownerReferences?: {
      kind: string;
      name: string;
      uid: string;
    }[];
  };
}

// Deployment
interface Deployment {
  id: string;
  name: string;
  namespace: string;
  labels: Record<string, string>;
  replicas: {
    desired: number;
    current: number;
    ready: number;
    available: number;
    updated: number;
  };
  selector: Record<string, string>;
  template: {
    labels: Record<string, string>;
    containers: Omit<Container, 'id' | 'status' | 'state' | 'metrics'>[];
    volumes?: Pod['volumes'];
  };
  strategy: {
    type: DeployStrategy;
    rollingUpdate?: {
      maxUnavailable: number | string;
      maxSurge: number | string;
    };
  };
  conditions: {
    type: 'Available' | 'Progressing' | 'ReplicaFailure';
    status: 'True' | 'False' | 'Unknown';
    lastUpdateTime: Date;
    lastTransitionTime: Date;
    reason: string;
    message: string;
  }[];
  revisionHistory: {
    revision: number;
    template: Deployment['template'];
    createdAt: Date;
    cause?: string;
  }[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    generation: number;
  };
}

// Service
interface KubeService {
  id: string;
  name: string;
  namespace: string;
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName';
  clusterIP?: string;
  externalIPs?: string[];
  loadBalancerIP?: string;
  ports: {
    name: string;
    protocol: 'TCP' | 'UDP';
    port: number;
    targetPort: number;
    nodePort?: number;
  }[];
  selector: Record<string, string>;
  sessionAffinity: 'None' | 'ClientIP';
  endpoints: {
    addresses: string[];
    ports: { name: string; port: number }[];
  }[];
  metadata: {
    createdAt: Date;
    uid: string;
  };
}

// Node
interface ClusterNode {
  id: string;
  name: string;
  status: 'Ready' | 'NotReady' | 'Unknown';
  role: 'master' | 'worker';
  labels: Record<string, string>;
  addresses: {
    type: 'InternalIP' | 'ExternalIP' | 'Hostname';
    address: string;
  }[];
  capacity: {
    cpu: string;
    memory: string;
    pods: string;
    storage: string;
  };
  allocatable: {
    cpu: string;
    memory: string;
    pods: string;
    storage: string;
  };
  conditions: {
    type: 'Ready' | 'DiskPressure' | 'MemoryPressure' | 'PIDPressure' | 'NetworkUnavailable';
    status: 'True' | 'False' | 'Unknown';
    lastHeartbeatTime: Date;
    lastTransitionTime: Date;
    reason: string;
    message: string;
  }[];
  systemInfo: {
    architecture: string;
    containerRuntime: string;
    kernelVersion: string;
    kubeProxyVersion: string;
    kubeletVersion: string;
    operatingSystem: string;
    osImage: string;
  };
  metrics: {
    cpuUsage: number;
    cpuCapacity: number;
    memoryUsage: number;
    memoryCapacity: number;
    podCount: number;
    podCapacity: number;
  };
}

// Namespace
interface Namespace {
  id: string;
  name: string;
  status: 'Active' | 'Terminating';
  labels: Record<string, string>;
  annotations: Record<string, string>;
  resourceQuota?: {
    hard: Record<string, string>;
    used: Record<string, string>;
  };
  limitRange?: {
    type: 'Container' | 'Pod' | 'PersistentVolumeClaim';
    default?: Record<string, string>;
    defaultRequest?: Record<string, string>;
    max?: Record<string, string>;
    min?: Record<string, string>;
  }[];
  metadata: {
    createdAt: Date;
    uid: string;
  };
}

// ConfigMap
interface ConfigMap {
  id: string;
  name: string;
  namespace: string;
  data: Record<string, string>;
  binaryData?: Record<string, string>;
  metadata: {
    createdAt: Date;
    uid: string;
  };
}

// Secret
interface Secret {
  id: string;
  name: string;
  namespace: string;
  type: 'Opaque' | 'kubernetes.io/service-account-token' | 'kubernetes.io/tls' | 'kubernetes.io/dockerconfigjson';
  data: Record<string, string>;
  metadata: {
    createdAt: Date;
    uid: string;
  };
}

// Horizontal Pod Autoscaler
interface HPA {
  id: string;
  name: string;
  namespace: string;
  scaleTargetRef: {
    kind: string;
    name: string;
  };
  minReplicas: number;
  maxReplicas: number;
  metrics: {
    type: 'Resource' | 'Pods' | 'Object' | 'External';
    resource?: {
      name: string;
      targetAverageUtilization?: number;
      targetAverageValue?: string;
    };
  }[];
  status: {
    currentReplicas: number;
    desiredReplicas: number;
    currentMetrics: {
      type: string;
      currentAverageUtilization?: number;
      currentAverageValue?: string;
    }[];
    lastScaleTime?: Date;
  };
  metadata: {
    createdAt: Date;
    uid: string;
  };
}

// Ingress
interface Ingress {
  id: string;
  name: string;
  namespace: string;
  ingressClassName?: string;
  tls?: {
    hosts: string[];
    secretName: string;
  }[];
  rules: {
    host?: string;
    http: {
      paths: {
        path: string;
        pathType: 'Exact' | 'Prefix' | 'ImplementationSpecific';
        backend: {
          service: {
            name: string;
            port: { number: number } | { name: string };
          };
        };
      }[];
    };
  }[];
  status: {
    loadBalancer: {
      ingress: { ip?: string; hostname?: string }[];
    };
  };
  metadata: {
    createdAt: Date;
    uid: string;
  };
}

// Persistent Volume
interface PersistentVolume {
  id: string;
  name: string;
  capacity: string;
  accessModes: ('ReadWriteOnce' | 'ReadOnlyMany' | 'ReadWriteMany')[];
  persistentVolumeReclaimPolicy: 'Retain' | 'Recycle' | 'Delete';
  storageClassName?: string;
  volumeMode: 'Filesystem' | 'Block';
  status: 'Available' | 'Bound' | 'Released' | 'Failed';
  claimRef?: {
    namespace: string;
    name: string;
  };
  source: {
    type: 'hostPath' | 'nfs' | 'awsEBS' | 'gcePD' | 'azureDisk';
    config: Record<string, string>;
  };
  metadata: {
    createdAt: Date;
    uid: string;
  };
}

// Cluster event
interface ClusterEvent {
  id: string;
  type: 'Normal' | 'Warning';
  reason: string;
  message: string;
  source: {
    component: string;
    host?: string;
  };
  involvedObject: {
    kind: string;
    namespace?: string;
    name: string;
    uid: string;
  };
  count: number;
  firstTimestamp: Date;
  lastTimestamp: Date;
}

// Cluster metrics
interface ClusterMetrics {
  nodes: {
    total: number;
    ready: number;
    notReady: number;
  };
  pods: {
    total: number;
    running: number;
    pending: number;
    failed: number;
  };
  resources: {
    cpuCapacity: number;
    cpuUsage: number;
    cpuPercentage: number;
    memoryCapacity: number;
    memoryUsage: number;
    memoryPercentage: number;
  };
  namespaces: {
    name: string;
    podCount: number;
    cpuUsage: number;
    memoryUsage: number;
  }[];
  topWorkloads: {
    name: string;
    namespace: string;
    kind: string;
    cpuUsage: number;
    memoryUsage: number;
  }[];
}

class ContainerOrchestrationService {
  private static instance: ContainerOrchestrationService;
  private namespaces: Map<string, Namespace> = new Map();
  private nodes: Map<string, ClusterNode> = new Map();
  private pods: Map<string, Pod> = new Map();
  private deployments: Map<string, Deployment> = new Map();
  private services: Map<string, KubeService> = new Map();
  private configMaps: Map<string, ConfigMap> = new Map();
  private secrets: Map<string, Secret> = new Map();
  private hpas: Map<string, HPA> = new Map();
  private ingresses: Map<string, Ingress> = new Map();
  private persistentVolumes: Map<string, PersistentVolume> = new Map();
  private events: Map<string, ClusterEvent> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ContainerOrchestrationService {
    if (!ContainerOrchestrationService.instance) {
      ContainerOrchestrationService.instance = new ContainerOrchestrationService();
    }
    return ContainerOrchestrationService.instance;
  }

  /**
   * Generate UID
   */
  private generateUid(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize namespaces
    const namespacesData = ['default', 'kube-system', 'production', 'staging', 'monitoring'];
    namespacesData.forEach((name, idx) => {
      const namespace: Namespace = {
        id: `ns-${idx + 1}`,
        name,
        status: 'Active',
        labels: { 'kubernetes.io/metadata.name': name },
        annotations: {},
        resourceQuota: name === 'production' ? {
          hard: { 'requests.cpu': '10', 'requests.memory': '20Gi', pods: '100' },
          used: { 'requests.cpu': '5', 'requests.memory': '10Gi', pods: '45' },
        } : undefined,
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          uid: this.generateUid(),
        },
      };
      this.namespaces.set(namespace.name, namespace);
    });

    // Initialize nodes
    for (let i = 0; i < 5; i++) {
      const node: ClusterNode = {
        id: `node-${i + 1}`,
        name: `worker-node-${i + 1}`,
        status: i < 4 ? 'Ready' : 'NotReady',
        role: i === 0 ? 'master' : 'worker',
        labels: {
          'kubernetes.io/hostname': `worker-node-${i + 1}`,
          'node.kubernetes.io/instance-type': 'm5.xlarge',
          'topology.kubernetes.io/zone': ['zone-a', 'zone-b', 'zone-c'][i % 3],
        },
        addresses: [
          { type: 'InternalIP', address: `10.0.${i}.100` },
          { type: 'Hostname', address: `worker-node-${i + 1}` },
        ],
        capacity: {
          cpu: '4',
          memory: '16Gi',
          pods: '110',
          storage: '100Gi',
        },
        allocatable: {
          cpu: '3800m',
          memory: '15Gi',
          pods: '100',
          storage: '95Gi',
        },
        conditions: [
          { type: 'Ready', status: i < 4 ? 'True' : 'False', lastHeartbeatTime: new Date(), lastTransitionTime: new Date(), reason: 'KubeletReady', message: 'kubelet is posting ready status' },
          { type: 'DiskPressure', status: 'False', lastHeartbeatTime: new Date(), lastTransitionTime: new Date(), reason: 'KubeletHasSufficientDisk', message: 'kubelet has sufficient disk space available' },
          { type: 'MemoryPressure', status: 'False', lastHeartbeatTime: new Date(), lastTransitionTime: new Date(), reason: 'KubeletHasSufficientMemory', message: 'kubelet has sufficient memory available' },
          { type: 'PIDPressure', status: 'False', lastHeartbeatTime: new Date(), lastTransitionTime: new Date(), reason: 'KubeletHasSufficientPID', message: 'kubelet has sufficient PID available' },
        ],
        systemInfo: {
          architecture: 'amd64',
          containerRuntime: 'containerd://1.6.20',
          kernelVersion: '5.15.0-73-generic',
          kubeProxyVersion: 'v1.28.0',
          kubeletVersion: 'v1.28.0',
          operatingSystem: 'linux',
          osImage: 'Ubuntu 22.04 LTS',
        },
        metrics: {
          cpuUsage: Math.random() * 3000 + 500,
          cpuCapacity: 4000,
          memoryUsage: Math.random() * 10 + 3,
          memoryCapacity: 16,
          podCount: Math.floor(Math.random() * 30) + 10,
          podCapacity: 100,
        },
      };
      this.nodes.set(node.id, node);
    }

    // Initialize deployments and pods
    const deploymentsData = [
      { name: 'api-gateway', namespace: 'production', replicas: 3 },
      { name: 'user-service', namespace: 'production', replicas: 2 },
      { name: 'alert-service', namespace: 'production', replicas: 3 },
      { name: 'notification-service', namespace: 'production', replicas: 2 },
      { name: 'web-frontend', namespace: 'production', replicas: 2 },
      { name: 'api-gateway', namespace: 'staging', replicas: 1 },
      { name: 'user-service', namespace: 'staging', replicas: 1 },
      { name: 'prometheus', namespace: 'monitoring', replicas: 1 },
      { name: 'grafana', namespace: 'monitoring', replicas: 1 },
    ];

    deploymentsData.forEach((depData, idx) => {
      const deployment: Deployment = {
        id: `deploy-${idx + 1}`,
        name: depData.name,
        namespace: depData.namespace,
        labels: { app: depData.name, environment: depData.namespace },
        replicas: {
          desired: depData.replicas,
          current: depData.replicas,
          ready: depData.replicas,
          available: depData.replicas,
          updated: depData.replicas,
        },
        selector: { app: depData.name },
        template: {
          labels: { app: depData.name },
          containers: [{
            name: depData.name,
            image: `rescueping/${depData.name}`,
            imageTag: '1.0.0',
            ports: [{ containerPort: 8080, protocol: 'TCP' }],
            environment: { NODE_ENV: depData.namespace },
            resources: {
              requests: { cpu: '100m', memory: '128Mi' },
              limits: { cpu: '500m', memory: '512Mi' },
            },
            volumeMounts: [],
          }],
        },
        strategy: {
          type: 'RollingUpdate',
          rollingUpdate: { maxUnavailable: 1, maxSurge: 1 },
        },
        conditions: [
          { type: 'Available', status: 'True', lastUpdateTime: new Date(), lastTransitionTime: new Date(), reason: 'MinimumReplicasAvailable', message: 'Deployment has minimum availability.' },
          { type: 'Progressing', status: 'True', lastUpdateTime: new Date(), lastTransitionTime: new Date(), reason: 'NewReplicaSetAvailable', message: 'ReplicaSet has successfully progressed.' },
        ],
        revisionHistory: [
          { revision: 1, template: {} as Deployment['template'], createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), cause: 'Initial deployment' },
        ],
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          generation: 3,
        },
      };
      this.deployments.set(deployment.id, deployment);

      // Create pods for deployment
      for (let p = 0; p < depData.replicas; p++) {
        const pod: Pod = {
          id: `pod-${idx}-${p + 1}`,
          name: `${depData.name}-${this.generateUid().slice(0, 8)}`,
          namespace: depData.namespace,
          labels: { app: depData.name, 'pod-template-hash': this.generateUid().slice(0, 8) },
          annotations: {},
          phase: 'Running',
          containers: [{
            id: `container-${idx}-${p + 1}`,
            name: depData.name,
            image: `rescueping/${depData.name}`,
            imageTag: '1.0.0',
            status: 'running',
            ports: [{ containerPort: 8080, protocol: 'TCP' }],
            environment: { NODE_ENV: depData.namespace },
            resources: {
              requests: { cpu: '100m', memory: '128Mi' },
              limits: { cpu: '500m', memory: '512Mi' },
            },
            volumeMounts: [],
            state: { running: { startedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) } },
            metrics: {
              cpuUsage: Math.random() * 300 + 50,
              memoryUsage: Math.random() * 300 + 100,
              networkIn: Math.floor(Math.random() * 1000000),
              networkOut: Math.floor(Math.random() * 500000),
              restartCount: Math.floor(Math.random() * 3),
            },
          }],
          nodeName: `worker-node-${(p % 4) + 1}`,
          hostIP: `10.0.${p % 4}.100`,
          podIP: `10.1.${idx}.${p + 10}`,
          restartPolicy: 'Always',
          volumes: [],
          conditions: [
            { type: 'PodScheduled', status: 'True', lastTransitionTime: new Date() },
            { type: 'Initialized', status: 'True', lastTransitionTime: new Date() },
            { type: 'ContainersReady', status: 'True', lastTransitionTime: new Date() },
            { type: 'Ready', status: 'True', lastTransitionTime: new Date() },
          ],
          metadata: {
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            uid: this.generateUid(),
            ownerReferences: [{ kind: 'ReplicaSet', name: `${depData.name}-rs`, uid: this.generateUid() }],
          },
        };
        this.pods.set(pod.id, pod);
      }
    });

    // Initialize services
    const servicesData = [
      { name: 'api-gateway', namespace: 'production', type: 'LoadBalancer', port: 80 },
      { name: 'user-service', namespace: 'production', type: 'ClusterIP', port: 8080 },
      { name: 'alert-service', namespace: 'production', type: 'ClusterIP', port: 8080 },
      { name: 'notification-service', namespace: 'production', type: 'ClusterIP', port: 8080 },
      { name: 'web-frontend', namespace: 'production', type: 'LoadBalancer', port: 80 },
    ];

    servicesData.forEach((svcData, idx) => {
      const service: KubeService = {
        id: `svc-${idx + 1}`,
        name: svcData.name,
        namespace: svcData.namespace,
        type: svcData.type as KubeService['type'],
        clusterIP: `10.96.${idx}.${10 + idx}`,
        loadBalancerIP: svcData.type === 'LoadBalancer' ? `34.123.${idx}.100` : undefined,
        ports: [{
          name: 'http',
          protocol: 'TCP',
          port: svcData.port,
          targetPort: 8080,
          nodePort: svcData.type === 'LoadBalancer' ? 30000 + idx : undefined,
        }],
        selector: { app: svcData.name },
        sessionAffinity: 'None',
        endpoints: [{
          addresses: [`10.1.${idx}.10`, `10.1.${idx}.11`],
          ports: [{ name: 'http', port: 8080 }],
        }],
        metadata: {
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          uid: this.generateUid(),
        },
      };
      this.services.set(service.id, service);
    });

    // Initialize ConfigMaps
    const configMapsData = [
      { name: 'app-config', namespace: 'production', data: { API_URL: 'https://api.rescueping.com', LOG_LEVEL: 'info' } },
      { name: 'nginx-config', namespace: 'production', data: { 'nginx.conf': 'server { listen 80; }' } },
    ];

    configMapsData.forEach((cm, idx) => {
      const configMap: ConfigMap = {
        id: `cm-${idx + 1}`,
        name: cm.name,
        namespace: cm.namespace,
        data: cm.data,
        metadata: {
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          uid: this.generateUid(),
        },
      };
      this.configMaps.set(configMap.id, configMap);
    });

    // Initialize Secrets
    const secretsData = [
      { name: 'db-credentials', namespace: 'production', type: 'Opaque' },
      { name: 'tls-secret', namespace: 'production', type: 'kubernetes.io/tls' },
    ];

    secretsData.forEach((sec, idx) => {
      const secret: Secret = {
        id: `secret-${idx + 1}`,
        name: sec.name,
        namespace: sec.namespace,
        type: sec.type as Secret['type'],
        data: { username: btoa('admin'), password: btoa('********') },
        metadata: {
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          uid: this.generateUid(),
        },
      };
      this.secrets.set(secret.id, secret);
    });

    // Initialize HPAs
    const hpasData = [
      { name: 'api-gateway-hpa', target: 'api-gateway', min: 2, max: 10 },
      { name: 'alert-service-hpa', target: 'alert-service', min: 2, max: 8 },
    ];

    hpasData.forEach((hpaData, idx) => {
      const hpa: HPA = {
        id: `hpa-${idx + 1}`,
        name: hpaData.name,
        namespace: 'production',
        scaleTargetRef: { kind: 'Deployment', name: hpaData.target },
        minReplicas: hpaData.min,
        maxReplicas: hpaData.max,
        metrics: [{ type: 'Resource', resource: { name: 'cpu', targetAverageUtilization: 70 } }],
        status: {
          currentReplicas: 3,
          desiredReplicas: 3,
          currentMetrics: [{ type: 'Resource', currentAverageUtilization: 45 }],
          lastScaleTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        metadata: {
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          uid: this.generateUid(),
        },
      };
      this.hpas.set(hpa.id, hpa);
    });

    // Initialize Ingresses
    const ingress: Ingress = {
      id: 'ingress-1',
      name: 'main-ingress',
      namespace: 'production',
      ingressClassName: 'nginx',
      tls: [{ hosts: ['rescueping.com', 'api.rescueping.com'], secretName: 'tls-secret' }],
      rules: [
        { host: 'rescueping.com', http: { paths: [{ path: '/', pathType: 'Prefix', backend: { service: { name: 'web-frontend', port: { number: 80 } } } }] } },
        { host: 'api.rescueping.com', http: { paths: [{ path: '/', pathType: 'Prefix', backend: { service: { name: 'api-gateway', port: { number: 80 } } } }] } },
      ],
      status: { loadBalancer: { ingress: [{ ip: '34.123.0.100' }] } },
      metadata: { createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), uid: this.generateUid() },
    };
    this.ingresses.set(ingress.id, ingress);

    // Initialize PersistentVolumes
    for (let i = 0; i < 5; i++) {
      const pv: PersistentVolume = {
        id: `pv-${i + 1}`,
        name: `pv-${i + 1}`,
        capacity: `${(i + 1) * 10}Gi`,
        accessModes: ['ReadWriteOnce'],
        persistentVolumeReclaimPolicy: 'Retain',
        storageClassName: 'standard',
        volumeMode: 'Filesystem',
        status: i < 3 ? 'Bound' : 'Available',
        claimRef: i < 3 ? { namespace: 'production', name: `pvc-${i + 1}` } : undefined,
        source: { type: 'awsEBS', config: { volumeID: `vol-${this.generateUid()}` } },
        metadata: { createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), uid: this.generateUid() },
      };
      this.persistentVolumes.set(pv.id, pv);
    }

    // Initialize events
    const eventsData = [
      { type: 'Normal', reason: 'Scheduled', message: 'Successfully assigned pod to node' },
      { type: 'Normal', reason: 'Pulled', message: 'Container image pulled successfully' },
      { type: 'Normal', reason: 'Started', message: 'Container started' },
      { type: 'Warning', reason: 'BackOff', message: 'Back-off restarting failed container' },
      { type: 'Warning', reason: 'FailedScheduling', message: 'Insufficient cpu' },
    ];

    eventsData.forEach((ev, idx) => {
      const event: ClusterEvent = {
        id: `event-${idx + 1}`,
        type: ev.type as ClusterEvent['type'],
        reason: ev.reason,
        message: ev.message,
        source: { component: 'kubelet', host: 'worker-node-1' },
        involvedObject: { kind: 'Pod', namespace: 'production', name: `pod-${idx + 1}`, uid: this.generateUid() },
        count: Math.floor(Math.random() * 10) + 1,
        firstTimestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        lastTimestamp: new Date(),
      };
      this.events.set(event.id, event);
    });
  }

  /**
   * Get namespaces
   */
  public getNamespaces(): Namespace[] {
    return Array.from(this.namespaces.values());
  }

  /**
   * Get namespace
   */
  public getNamespace(name: string): Namespace | undefined {
    return this.namespaces.get(name);
  }

  /**
   * Get nodes
   */
  public getNodes(filter?: { status?: ClusterNode['status'] }): ClusterNode[] {
    let nodes = Array.from(this.nodes.values());
    if (filter?.status) nodes = nodes.filter((n) => n.status === filter.status);
    return nodes;
  }

  /**
   * Get node
   */
  public getNode(id: string): ClusterNode | undefined {
    return this.nodes.get(id);
  }

  /**
   * Get pods
   */
  public getPods(filter?: { namespace?: string; phase?: PodPhase; labels?: Record<string, string> }): Pod[] {
    let pods = Array.from(this.pods.values());
    if (filter?.namespace) pods = pods.filter((p) => p.namespace === filter.namespace);
    if (filter?.phase) pods = pods.filter((p) => p.phase === filter.phase);
    if (filter?.labels) {
      pods = pods.filter((p) => Object.entries(filter.labels!).every(([k, v]) => p.labels[k] === v));
    }
    return pods;
  }

  /**
   * Get pod
   */
  public getPod(id: string): Pod | undefined {
    return this.pods.get(id);
  }

  /**
   * Get deployments
   */
  public getDeployments(filter?: { namespace?: string }): Deployment[] {
    let deployments = Array.from(this.deployments.values());
    if (filter?.namespace) deployments = deployments.filter((d) => d.namespace === filter.namespace);
    return deployments;
  }

  /**
   * Get deployment
   */
  public getDeployment(id: string): Deployment | undefined {
    return this.deployments.get(id);
  }

  /**
   * Scale deployment
   */
  public scaleDeployment(id: string, replicas: number): Deployment {
    const deployment = this.deployments.get(id);
    if (!deployment) throw new Error('Deployment not found');

    deployment.replicas.desired = replicas;
    deployment.metadata.updatedAt = new Date();

    this.emit('deployment_scaled', { id, replicas });

    return deployment;
  }

  /**
   * Get services
   */
  public getServices(filter?: { namespace?: string; type?: KubeService['type'] }): KubeService[] {
    let services = Array.from(this.services.values());
    if (filter?.namespace) services = services.filter((s) => s.namespace === filter.namespace);
    if (filter?.type) services = services.filter((s) => s.type === filter.type);
    return services;
  }

  /**
   * Get service
   */
  public getService(id: string): KubeService | undefined {
    return this.services.get(id);
  }

  /**
   * Get cluster metrics
   */
  public getClusterMetrics(): ClusterMetrics {
    const nodes = Array.from(this.nodes.values());
    const pods = Array.from(this.pods.values());

    const readyNodes = nodes.filter((n) => n.status === 'Ready').length;
    const runningPods = pods.filter((p) => p.phase === 'Running').length;
    const pendingPods = pods.filter((p) => p.phase === 'Pending').length;
    const failedPods = pods.filter((p) => p.phase === 'Failed').length;

    const totalCpuCapacity = nodes.reduce((sum, n) => sum + n.metrics.cpuCapacity, 0);
    const totalCpuUsage = nodes.reduce((sum, n) => sum + n.metrics.cpuUsage, 0);
    const totalMemoryCapacity = nodes.reduce((sum, n) => sum + n.metrics.memoryCapacity, 0);
    const totalMemoryUsage = nodes.reduce((sum, n) => sum + n.metrics.memoryUsage, 0);

    // Namespace metrics
    const namespaceMetrics: Map<string, { pods: number; cpu: number; memory: number }> = new Map();
    pods.forEach((pod) => {
      const existing = namespaceMetrics.get(pod.namespace) || { pods: 0, cpu: 0, memory: 0 };
      existing.pods++;
      pod.containers.forEach((c) => {
        existing.cpu += c.metrics.cpuUsage;
        existing.memory += c.metrics.memoryUsage;
      });
      namespaceMetrics.set(pod.namespace, existing);
    });

    return {
      nodes: {
        total: nodes.length,
        ready: readyNodes,
        notReady: nodes.length - readyNodes,
      },
      pods: {
        total: pods.length,
        running: runningPods,
        pending: pendingPods,
        failed: failedPods,
      },
      resources: {
        cpuCapacity: totalCpuCapacity,
        cpuUsage: totalCpuUsage,
        cpuPercentage: (totalCpuUsage / totalCpuCapacity) * 100,
        memoryCapacity: totalMemoryCapacity,
        memoryUsage: totalMemoryUsage,
        memoryPercentage: (totalMemoryUsage / totalMemoryCapacity) * 100,
      },
      namespaces: Array.from(namespaceMetrics.entries()).map(([name, metrics]) => ({
        name,
        podCount: metrics.pods,
        cpuUsage: metrics.cpu,
        memoryUsage: metrics.memory,
      })),
      topWorkloads: [],
    };
  }

  /**
   * Get events
   */
  public getEvents(filter?: { namespace?: string; type?: ClusterEvent['type'] }): ClusterEvent[] {
    let events = Array.from(this.events.values());
    if (filter?.namespace) events = events.filter((e) => e.involvedObject.namespace === filter.namespace);
    if (filter?.type) events = events.filter((e) => e.type === filter.type);
    return events.sort((a, b) => b.lastTimestamp.getTime() - a.lastTimestamp.getTime());
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

export const containerOrchestrationService = ContainerOrchestrationService.getInstance();
export type {
  ContainerStatus,
  PodPhase,
  DeployStrategy,
  ResourceType,
  RestartPolicy,
  Container,
  Pod,
  Deployment,
  KubeService,
  ClusterNode,
  Namespace,
  ConfigMap,
  Secret,
  HPA,
  Ingress,
  PersistentVolume,
  ClusterEvent,
  ClusterMetrics,
};
