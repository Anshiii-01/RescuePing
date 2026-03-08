
import React from 'react';
import styled from 'styled-components';
import { productionColors } from '../styles/production-ui-system';

const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 96px 24px 48px;
  color: ${productionColors.text.secondary};

  h1, h2 { color: ${productionColors.text.primary}; }
  h1 { font-size: 42px; margin-bottom: 16px; }
  h2 { font-size: 22px; margin: 32px 0 12px; }
  p, li { font-size: 15px; line-height: 1.7; }
`;

const PrivacyPolicy: React.FC = () => (
  <PageWrapper>
    <h1>Privacy Policy</h1>
    <p><strong>Last updated:</strong> 8 January 2026</p>

    <p>
      Rescue Ping is committed to protecting user privacy while delivering
      real-time disaster intelligence. This policy explains how data is
      collected, processed, and safeguarded.
    </p>

    <h2>Information We Collect</h2>
    <ul>
      <li>Approximate location data for hazard assessment</li>
      <li>Device and usage metadata for security and performance</li>
      <li>User-submitted alerts or reports (optional)</li>
    </ul>

    <h2>How We Use Data</h2>
    <p>
      Data is used solely to generate risk predictions, alerts, evacuation
      routes, and to improve system accuracy.
    </p>

    <h2>Security</h2>
    <p>
      We apply encryption, access controls, and monitoring to protect all
      collected data from unauthorized access.
    </p>

    <h2>Third-Party Services</h2>
    <p>
      Weather, map, and analytics providers are used strictly to support core
      functionality and operate under their own privacy policies.
    </p>

    <h2>User Rights</h2>
    <p>
      Users may request clarification or deletion of stored personal data by
      contacting platform support.
    </p>
  </PageWrapper>
);

export default PrivacyPolicy;
