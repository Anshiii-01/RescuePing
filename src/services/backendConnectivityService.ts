import { verifySystemStatus } from './apiService';

export interface ConnectivityDiagnostics {
  timestamp: number;
  backend: {
    reachable: boolean;
    response_time: number;
    status: string;
    endpoints: {
      [key: string]: {
        available: boolean;
        response_time: number;
        error?: string;
      };
    };
  };
  external_apis: {
    openweathermap: {
      reachable: boolean;
      response_time: number;
      status: string;
      error?: string;
    };
    ip_geolocation: {
      reachable: boolean;
      response_time: number;
      status: string;
      error?: string;
    };
  };
  overall_status: 'healthy' | 'degraded' | 'critical';
  recommendations: string[];
}

class BackendConnectivityService {
  private static instance: BackendConnectivityService;
  
  static getInstance(): BackendConnectivityService {
    if (!BackendConnectivityService.instance) {
      BackendConnectivityService.instance = new BackendConnectivityService();
    }
    return BackendConnectivityService.instance;
  }

  async runComprehensiveDiagnostics(): Promise<ConnectivityDiagnostics> {
    const startTime = Date.now();
    const diagnostics: ConnectivityDiagnostics = {
      timestamp: startTime,
      backend: {
        reachable: false,
        response_time: 0,
        status: 'unknown',
        endpoints: {}
      },
      external_apis: {
        openweathermap: {
          reachable: false,
          response_time: 0,
          status: 'unknown'
        },
        ip_geolocation: {
          reachable: false,
          response_time: 0,
          status: 'unknown'
        }
      },
      overall_status: 'critical',
      recommendations: []
    };

    // Test backend connectivity
    await this.testBackendConnectivity(diagnostics);
    
    // Test external API connectivity
    await this.testExternalAPIs(diagnostics);
    
    // Determine overall status and recommendations
    this.assessOverallStatus(diagnostics);
    
    return diagnostics;
  }

  private async testBackendConnectivity(diagnostics: ConnectivityDiagnostics): Promise<void> {
    try {
      const startTime = Date.now();
      const response = await verifySystemStatus();
      const responseTime = Date.now() - startTime;
      
      diagnostics.backend.reachable = true;
      diagnostics.backend.response_time = responseTime;
      diagnostics.backend.status = 'connected';
      
      // Test individual endpoints from system verification response
      if (response.api_endpoints) {
        console.log('✅ Backend endpoints available:', Object.keys(response.api_endpoints));
      }
      
      // Always test individual endpoints to populate the endpoints object
      await this.testIndividualEndpoints(diagnostics);
      
    } catch (error) {
      diagnostics.backend.reachable = false;
      diagnostics.backend.status = `error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      // If backend is unreachable, test individual endpoints directly
      await this.testIndividualEndpoints(diagnostics);
    }
  }

  private async testIndividualEndpoints(diagnostics: ConnectivityDiagnostics): Promise<void> {
    const getApiBaseUrl = (): string => {
      const envUrl = process.env.REACT_APP_API_URL;
      if (envUrl && envUrl.trim() !== '') {
        return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
      }
      if (process.env.NODE_ENV === 'production') {
        return ''; // Same origin for Vercel
      }
      return 'http://127.0.0.1:8000';
    };
    const baseUrl = getApiBaseUrl();
    // Use test coordinates for endpoints that require parameters
    const testLat = 26.8413685;
    const testLon = 75.562645;
    
    const endpoints = {
      health: { url: `${baseUrl}/api/health`, method: 'GET' },
      weather: { url: `${baseUrl}/api/weather/${testLat}/${testLon}`, method: 'GET' },
      alerts: { url: `${baseUrl}/api/alerts/active?lat=${testLat}&lon=${testLon}`, method: 'GET' },
      predict: { url: `${baseUrl}/api/predict/disaster-risk?lat=${testLat}&lon=${testLon}`, method: 'GET' },
    };

    for (const [name, config] of Object.entries(endpoints)) {
      diagnostics.backend.endpoints[name] = await this.testEndpoint(config.url, config.method);
    }
  }

  private async testEndpoint(url: string, method: string = 'GET'): Promise<{ available: boolean; response_time: number; error?: string }> {
    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method: method,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        }
      } as any);
      
      const responseTime = Date.now() - startTime;
      
      return {
        available: response.ok,
        response_time: responseTime,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };
    } catch (error) {
      return {
        available: false,
        response_time: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testExternalAPIs(diagnostics: ConnectivityDiagnostics): Promise<void> {
    // Test OpenWeatherMap API
    try {
      const startTime = Date.now();
      const apiKey = '1801423b3942e324ab80f5b47afe0859';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.0060&appid=${apiKey}&units=metric`,
        { timeout: 10000 } as any
      );
      
      const responseTime = Date.now() - startTime;
      
      diagnostics.external_apis.openweathermap = {
        reachable: response.ok,
        response_time: responseTime,
        status: response.ok ? 'connected' : `HTTP ${response.status}`,
        error: response.ok ? undefined : `Failed to fetch weather data: ${response.statusText}`
      };
    } catch (error) {
      diagnostics.external_apis.openweathermap = {
        reachable: false,
        response_time: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test IP Geolocation API
    try {
      const startTime = Date.now();
      const response = await fetch('https://ipapi.co/json/', { timeout: 10000 } as any);
      const responseTime = Date.now() - startTime;
      
      diagnostics.external_apis.ip_geolocation = {
        reachable: response.ok,
        response_time: responseTime,
        status: response.ok ? 'connected' : `HTTP ${response.status}`,
        error: response.ok ? undefined : `Failed to fetch location data: ${response.statusText}`
      };
    } catch (error) {
      diagnostics.external_apis.ip_geolocation = {
        reachable: false,
        response_time: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private assessOverallStatus(diagnostics: ConnectivityDiagnostics): void {
    const recommendations: string[] = [];
    let healthyServices = 0;
    let totalServices = 0;

    // Assess backend status
    totalServices++;
    if (diagnostics.backend.reachable) {
      healthyServices++;
    } else {
      recommendations.push('Backend API server appears to be offline. Check if the Rescue Ping backend service is running on port 8000.');
    }

    // Assess endpoint availability
    const endpointCount = Object.keys(diagnostics.backend.endpoints).length;
    const availableEndpoints = Object.values(diagnostics.backend.endpoints).filter(e => e.available).length;
    
    if (endpointCount > 0) {
      totalServices += endpointCount;
      healthyServices += availableEndpoints;
      
      if (availableEndpoints < endpointCount) {
        const unavailableEndpoints = Object.entries(diagnostics.backend.endpoints)
          .filter(([_, endpoint]) => !endpoint.available)
          .map(([name, _]) => name);
        recommendations.push(`Some backend endpoints are unavailable: ${unavailableEndpoints.join(', ')}`);
      }
    }

    // Assess external APIs
    totalServices += 2;
    if (diagnostics.external_apis.openweathermap.reachable) {
      healthyServices++;
    } else {
      recommendations.push('OpenWeatherMap API is unreachable. Weather data may not be available.');
    }

    if (diagnostics.external_apis.ip_geolocation.reachable) {
      healthyServices++;
    } else {
      recommendations.push('IP Geolocation API is unreachable. Network-based location detection may not work.');
    }

    // Determine overall status
    const healthRatio = healthyServices / totalServices;
    
    if (healthRatio >= 0.8) {
      diagnostics.overall_status = 'healthy';
      if (recommendations.length === 0) {
        recommendations.push('All systems are operational and performing well.');
      }
    } else if (healthRatio >= 0.5) {
      diagnostics.overall_status = 'degraded';
      recommendations.push('System is operational but some services are unavailable. User experience may be impacted.');
    } else {
      diagnostics.overall_status = 'critical';
      recommendations.push('Multiple critical services are unavailable. System functionality is severely limited.');
    }

    // Add performance recommendations
    const avgResponseTime = [
      diagnostics.backend.response_time,
      ...Object.values(diagnostics.backend.endpoints).map(e => e.response_time),
      diagnostics.external_apis.openweathermap.response_time,
      diagnostics.external_apis.ip_geolocation.response_time
    ].filter(time => time > 0).reduce((sum, time, _, arr) => sum + time / arr.length, 0);

    if (avgResponseTime > 2000) {
      recommendations.push('High response times detected. Consider optimizing network connectivity or API performance.');
    }

    diagnostics.recommendations = recommendations;
  }

  async generateConnectivityReport(): Promise<string> {
    const diagnostics = await this.runComprehensiveDiagnostics();
    
    let report = `# Rescue Ping Connectivity Diagnostics Report\n\n`;
    report += `**Generated**: ${new Date(diagnostics.timestamp).toISOString()}\n`;
    report += `**Overall Status**: ${diagnostics.overall_status.toUpperCase()}\n\n`;

    // Backend Status
    report += `## Backend Services\n\n`;
    report += `- **Status**: ${diagnostics.backend.reachable ? '✅ Connected' : '❌ Offline'}\n`;
    report += `- **Response Time**: ${diagnostics.backend.response_time}ms\n`;
    report += `- **Details**: ${diagnostics.backend.status}\n\n`;

    if (Object.keys(diagnostics.backend.endpoints).length > 0) {
      report += `### API Endpoints\n\n`;
      for (const [name, endpoint] of Object.entries(diagnostics.backend.endpoints)) {
        report += `- **${name}**: ${endpoint.available ? '✅' : '❌'} (${endpoint.response_time}ms)`;
        if (endpoint.error) {
          report += ` - ${endpoint.error}`;
        }
        report += `\n`;
      }
      report += `\n`;
    }

    // External APIs Status
    report += `## External Services\n\n`;
    report += `### OpenWeatherMap API\n`;
    report += `- **Status**: ${diagnostics.external_apis.openweathermap.reachable ? '✅ Connected' : '❌ Offline'}\n`;
    report += `- **Response Time**: ${diagnostics.external_apis.openweathermap.response_time}ms\n`;
    if (diagnostics.external_apis.openweathermap.error) {
      report += `- **Error**: ${diagnostics.external_apis.openweathermap.error}\n`;
    }
    report += `\n`;

    report += `### IP Geolocation API\n`;
    report += `- **Status**: ${diagnostics.external_apis.ip_geolocation.reachable ? '✅ Connected' : '❌ Offline'}\n`;
    report += `- **Response Time**: ${diagnostics.external_apis.ip_geolocation.response_time}ms\n`;
    if (diagnostics.external_apis.ip_geolocation.error) {
      report += `- **Error**: ${diagnostics.external_apis.ip_geolocation.error}\n`;
    }
    report += `\n`;

    // Recommendations
    report += `## Recommendations\n\n`;
    for (const recommendation of diagnostics.recommendations) {
      report += `- ${recommendation}\n`;
    }

    return report;
  }
}

export const backendConnectivityService = BackendConnectivityService.getInstance();
export default backendConnectivityService;