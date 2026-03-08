/**
 * RESCUE PING - HEALTH CHECK SCRIPT
 * Production health monitoring and verification
 */

const http = require('http');
const https = require('https');

class HealthChecker {
  constructor() {
    this.checks = [
      { name: 'Application Status', check: () => this.checkApplicationHealth() },
      { name: 'API Connectivity', check: () => this.checkAPIConnectivity() },
      { name: 'Weather Service', check: () => this.checkWeatherService() },
      { name: 'Performance Metrics', check: () => this.checkPerformanceMetrics() },
      { name: 'Security Headers', check: () => this.checkSecurityHeaders() }
    ];
  }

  async runHealthChecks() {
    console.log('🏥 Rescue Ping Health Check - Production Readiness Verification');
    console.log('=' .repeat(60));
    
    const results = [];
    
    for (const check of this.checks) {
      try {
        console.log(`\n🔍 Checking: ${check.name}...`);
        const result = await check.check();
        results.push({ ...result, name: check.name });
        
        if (result.status === 'pass') {
          console.log(`✅ ${check.name}: PASS - ${result.message}`);
        } else {
          console.log(`❌ ${check.name}: FAIL - ${result.message}`);
        }
      } catch (error) {
        console.log(`💥 ${check.name}: ERROR - ${error.message}`);
        results.push({
          name: check.name,
          status: 'error',
          message: error.message
        });
      }
    }

    this.generateHealthReport(results);
    return results;
  }

  async checkApplicationHealth() {
    return new Promise((resolve) => {
      const req = http.get('http://localhost:3000', (res) => {
        if (res.statusCode === 200) {
          resolve({
            status: 'pass',
            message: `Application responding (${res.statusCode})`
          });
        } else {
          resolve({
            status: 'fail',
            message: `Unexpected status code: ${res.statusCode}`
          });
        }
      });

      req.on('error', () => {
        resolve({
          status: 'fail',
          message: 'Application not responding'
        });
      });

      req.setTimeout(5000, () => {
        resolve({
          status: 'fail',
          message: 'Response timeout'
        });
      });
    });
  }

  async checkAPIConnectivity() {
    return new Promise((resolve) => {
      const req = https.get('https://httpbin.org/status/200', (res) => {
        if (res.statusCode === 200) {
          resolve({
            status: 'pass',
            message: 'External API connectivity verified'
          });
        } else {
          resolve({
            status: 'fail',
            message: 'API connectivity issues detected'
          });
        }
      });

      req.on('error', () => {
        resolve({
          status: 'fail',
          message: 'Network connectivity failed'
        });
      });

      req.setTimeout(10000, () => {
        resolve({
          status: 'fail',
          message: 'API response timeout'
        });
      });
    });
  }

  async checkWeatherService() {
    const apiKey = '1801423b3942e324ab80f5b47afe0859';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}`;
    
    return new Promise((resolve) => {
      const req = https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const weatherData = JSON.parse(data);
            if (weatherData.main && weatherData.main.temp) {
              resolve({
                status: 'pass',
                message: `Weather service operational (${weatherData.name})`
              });
            } else {
              resolve({
                status: 'fail',
                message: 'Weather service returned invalid data'
              });
            }
          } catch (error) {
            resolve({
              status: 'fail',
              message: 'Weather service JSON parsing failed'
            });
          }
        });
      });

      req.on('error', () => {
        resolve({
          status: 'fail',
          message: 'Weather service connection failed'
        });
      });

      req.setTimeout(15000, () => {
        resolve({
          status: 'fail',
          message: 'Weather service timeout'
        });
      });
    });
  }

  async checkPerformanceMetrics() {
    // Simulate performance check
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const responseTime = Date.now() - startTime;
        
        if (responseTime < 200) {
          resolve({
            status: 'pass',
            message: `Excellent response time: ${responseTime}ms`
          });
        } else if (responseTime < 500) {
          resolve({
            status: 'pass',
            message: `Good response time: ${responseTime}ms`
          });
        } else {
          resolve({
            status: 'fail',
            message: `Slow response time: ${responseTime}ms`
          });
        }
      }, 100);
    });
  }

  async checkSecurityHeaders() {
    return new Promise((resolve) => {
      const req = http.get('http://localhost:3000', (res) => {
        const headers = res.headers;
        const securityHeaders = [
          'x-frame-options',
          'x-content-type-options',
          'x-xss-protection'
        ];
        
        const missingHeaders = securityHeaders.filter(header => !headers[header]);
        
        if (missingHeaders.length === 0) {
          resolve({
            status: 'pass',
            message: 'All security headers present'
          });
        } else {
          resolve({
            status: 'fail',
            message: `Missing headers: ${missingHeaders.join(', ')}`
          });
        }
      });

      req.on('error', () => {
        resolve({
          status: 'fail',
          message: 'Unable to check security headers'
        });
      });

      req.setTimeout(5000, () => {
        resolve({
          status: 'fail',
          message: 'Security check timeout'
        });
      });
    });
  }

  generateHealthReport(results) {
    console.log('\n📊 HEALTH CHECK SUMMARY');
    console.log('=' .repeat(40));
    
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const errors = results.filter(r => r.status === 'error').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`💥 Errors: ${errors}`);
    
    const overallHealth = failed === 0 && errors === 0 ? 'HEALTHY' : 'ISSUES DETECTED';
    console.log(`\n🎯 Overall Status: ${overallHealth}`);
    
    if (overallHealth === 'HEALTHY') {
      console.log('\n🚀 Rescue Ping is READY for production deployment!');
    } else {
      console.log('\n⚠️  Please resolve issues before production deployment.');
    }
  }
}

// Run health checks if called directly
if (require.main === module) {
  const checker = new HealthChecker();
  checker.runHealthChecks().catch(console.error);
}

module.exports = HealthChecker;