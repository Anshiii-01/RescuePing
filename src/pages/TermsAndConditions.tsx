import React from 'react';
import styled from 'styled-components';
import { productionColors } from '../styles/production-ui-system';

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  color: ${productionColors.text.primary};
`;

const TermsWrapper = styled(PageWrapper)``;

const TermsAndConditions: React.FC = () => (
  <TermsWrapper>
    <h1>Terms & Conditions</h1>
    <p><strong>Last updated:</strong> 8 January 2026</p>

    <p>
      Rescue Ping provides AI-powered disaster prediction and emergency guidance
      for informational purposes only. Users must follow official advisories
      during emergencies.
    </p>

    <h2>Accuracy Disclaimer</h2>
    <p>
      Predictions are based on data models and external APIs and may not be
      fully accurate in all situations.
    </p>

    <h2>User Responsibilities</h2>
    <ul>
      <li>Use the platform lawfully and responsibly</li>
      <li>Do not misuse alerts or submit false data</li>
    </ul>

    <h2>Limitation of Liability</h2>
    <p>
      Rescue Ping is not liable for losses or damages arising from reliance on
      platform outputs.
    </p>

    <h2>Intellectual Property</h2>
    <p>
      All platform content, models, and branding remain the property of Alert
      Aid.
    </p>
  </TermsWrapper>
);

export default TermsAndConditions;
