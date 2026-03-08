import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../../styles/components';
import { useGeolocation } from '../Location/GeolocationManager';
import { RescuePingAPIService } from '../../services/apiService';
import { ExternalAPIService } from '../../services/externalAPIs';
import CoordinateResolver from '../../services/coordinateResolver';
import { TemperatureConverter } from '../../utils/temperatureConverter';

const VerificationContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.primary};
  min-height: 100vh;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const VerificationCard = styled(Card)`
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  margin-bottom: 24px;
`;

const TestButton = styled.button`
  background: ${({ theme }) => theme.colors.gradients.primary};
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusBadge = styled.span<{ status: 'PASS' | 'FAIL' | 'RUNNING' }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${({ status, theme }) => {
    switch (status) {
      case 'PASS': return theme.colors.success[500];
      case 'FAIL': return theme.colors.danger[500];
      case 'RUNNING': return theme.colors.warning[500];
      default: return theme.colors.text.tertiary;
    }
  }};
  color: white;
`;

const ResultsContainer = styled.pre`
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 8px;
  padding: 16px;
  max-height: 600px;
  overflow-y: auto;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const VerdictCard = styled(VerificationCard)<{ isSuccess: boolean }>`
  border-color: ${({ isSuccess, theme }) => 
    isSuccess ? theme.colors.success[500] : theme.colors.warning[500]};
  background: ${({ isSuccess, theme }) => 
    isSuccess ? theme.colors.success[50] : theme.colors.warning[50]};
`;

const VerificationDashboard: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { location } = useGeolocation();

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {} as any,
      verdict: '',
      realDataPercentage: '',
      operationalPercentage: ''
    };

    try {
      // Resolve coordinates consistently for all tests
      const resolvedCoords = CoordinateResolver.resolveCoordinates(location, null, true);
      const weatherCoords = CoordinateResolver.getWeatherCoordinates(location, null);
      const mlLocationData = CoordinateResolver.getMLCoordinates(location, null);
      const alertsCoords = CoordinateResolver.getAlertsCoordinates(location, null);
      
      console.log('🎯 Verification using consistent coordinates:', {
        resolved: CoordinateResolver.getCoordinateSummary(resolvedCoords),
        weather: weatherCoords,
        alerts: alertsCoords,
        mlLocation: `${mlLocationData.city}, ${mlLocationData.country}`
      });

      // TEST 1: Location Service
      console.log('🔍 Testing Location Service...');
      try {
        const currentLocation = location || await ExternalAPIService.getBrowserLocation();
        results.tests.location = {
          status: "PASS",
          data: currentLocation,
          isReal: currentLocation && currentLocation.city !== "New York" && currentLocation.latitude !== 40.7128,
          details: `Using geolocation API, detected: ${currentLocation?.city || 'Unknown'}, ${currentLocation?.country || 'Unknown'}`,
          source: currentLocation ? 'geolocation' : 'manual'
        };
      } catch (error: any) {
        results.tests.location = {
          status: "FAIL",
          error: error.message,
          isReal: false
        };
      }

      // TEST 2: Weather API (using consistent coordinates)
      console.log('🌤️ Testing Weather API...');
      try {
        CoordinateResolver.logCoordinateUsage('Weather API', resolvedCoords);
        const weatherResponse = await RescuePingAPIService.getEnhancedWeatherData(weatherCoords.lat, weatherCoords.lon);
        const weather = weatherResponse.data;
        results.tests.weather = {
          status: "PASS",
          data: weather,
          isReal: weather && weather.is_real && weather.temperature > -50 && weather.temperature < 60,
          apiCalled: `GET /weather/${weatherCoords.lat}/${weatherCoords.lon}`,
          details: `Temperature: ${TemperatureConverter.formatForDisplay(weather?.temperature, 'C')}, Humidity: ${weather?.humidity}%, Source: ${weather?.source}`
        };
      } catch (error: any) {
        results.tests.weather = {
          status: "FAIL",
          error: error.message,
          isReal: false
        };
      }

      // TEST 3: ML Model (using consistent coordinates)
      console.log('🤖 Testing ML Model...');
      try {
        CoordinateResolver.logCoordinateUsage('ML API', resolvedCoords, { 
          locationData: mlLocationData 
        });
        const prediction = await RescuePingAPIService.predictDisasterRisk(mlLocationData, true);
        results.tests.mlModel = {
          status: "PASS",
          data: prediction,
          isReal: prediction && typeof prediction.overall_risk === 'string' && prediction.confidence > 0,
          modelUsed: "DisasterPredictionModel",
          features: ["latitude", "longitude", "weather", "geographic"],
          details: `Overall Risk: ${prediction?.overall_risk}, Confidence: ${prediction?.confidence}, Location: (${prediction?.location_analyzed?.latitude}, ${prediction?.location_analyzed?.longitude})`
        };
      } catch (error: any) {
        results.tests.mlModel = {
          status: "FAIL",
          error: error.message,
          isReal: false
        };
      }

      // TEST 4: Disaster Alerts (using consistent coordinates)
      console.log('🚨 Testing Alert System...');
      try {
        CoordinateResolver.logCoordinateUsage('Alerts API', resolvedCoords);
        const alerts = await RescuePingAPIService.getActiveAlerts(alertsCoords.lat, alertsCoords.lon);
        results.tests.alerts = {
          status: "PASS",
          data: alerts,
          isReal: alerts && typeof alerts.count === 'number',
          source: "RescuePing API",
          count: alerts?.count || 0
        };
      } catch (error: any) {
        results.tests.alerts = {
          status: "FAIL",
          error: error.message,
          isReal: false
        };
      }

      // TEST 5: External APIs (using earthquake data)
      console.log('🌍 Testing External APIs...');
      try {
        const earthquakes = await RescuePingAPIService.getEarthquakeData(weatherCoords.lat, weatherCoords.lon);
        results.tests.externalAPIs = {
          status: "PASS",
          data: earthquakes,
          isReal: earthquakes && earthquakes.is_real,
          source: "USGS/External API",
          details: `Recent earthquakes: ${earthquakes?.count || 0}`
        };
      } catch (error: any) {
        results.tests.externalAPIs = {
          status: "FAIL",
          error: error.message,
          isReal: false
        };
      }

      // OVERALL VERDICT
      const testResults = Object.values(results.tests);
      const passedTests = testResults.filter((test: any) => test.status === 'PASS');
      const realDataTests = testResults.filter((test: any) => test.isReal === true);
      
      results.verdict = realDataTests.length === testResults.length ? 
        "✅ ALL SYSTEMS USING REAL DATA" : 
        `⚠️ ${passedTests.length}/${testResults.length} SYSTEMS OPERATIONAL, ${realDataTests.length}/${testResults.length} USING REAL DATA`;
      
      results.realDataPercentage = ((realDataTests.length / testResults.length) * 100).toFixed(0);
      results.operationalPercentage = ((passedTests.length / testResults.length) * 100).toFixed(0);

    } catch (error: any) {
      results.verdict = "❌ DIAGNOSTIC FAILED";
      results.error = error.message;
    }

    setDiagnostics(results);
    setIsRunning(false);
    console.log('📋 Diagnostics completed:', results);
  };

  return (
    <VerificationContainer>
      <VerificationCard>
        <h1>Rescue Ping System Verification</h1>
        <p>Comprehensive diagnostic suite to verify real data integration vs placeholder data</p>
        
        <TestButton onClick={runDiagnostics} disabled={isRunning}>
          {isRunning ? '🔄 Running Diagnostics...' : '🔍 Run Full Diagnostics'}
        </TestButton>
      </VerificationCard>

      {diagnostics?.verdict && (
        <VerdictCard isSuccess={diagnostics.realDataPercentage === '100'}>
          <h2>{diagnostics.verdict}</h2>
          <p><strong>Real Data Score:</strong> {diagnostics.realDataPercentage}%</p>
          <p><strong>Operational Status:</strong> {diagnostics.operationalPercentage}%</p>
          <p><strong>Test Run:</strong> {new Date(diagnostics.timestamp).toLocaleString()}</p>
          
          <h3>Test Results Summary:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {Object.entries(diagnostics.tests).map(([testName, result]: [string, any]) => (
              <div key={testName}>
                <StatusBadge status={result.status}>{testName.toUpperCase()}</StatusBadge>
                {result.isReal && <span style={{ marginLeft: '4px' }}>📡</span>}
              </div>
            ))}
          </div>
        </VerdictCard>
      )}

      {diagnostics && (
        <VerificationCard>
          <h3>Complete Diagnostic Results (JSON)</h3>
          <p>Copy this output and send to Claude for analysis:</p>
          <ResultsContainer>
            {JSON.stringify(diagnostics, null, 2)}
          </ResultsContainer>
        </VerificationCard>
      )}
    </VerificationContainer>
  );
};

export default VerificationDashboard;