// ================================
// File: src/components/Footer.tsx
// ================================

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Github, Twitter, Globe, Shield, MapPin, AlertTriangle } from 'lucide-react';
import { productionColors, productionAnimations } from '../styles/production-ui-system';

const FooterWrapper = styled.footer`
  margin-top: 80px;
  padding: 64px 24px 32px;
  background: linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%);
  border-top: 1px solid rgba(99, 102, 241, 0.2);
  position: relative;
  overflow: hidden;

  /* Define the keyframes animation */
  @keyframes slideInFromLeft {
    0% {
      background-position: -100% 0;
    }
    100% {
      background-position: 100% 0;
    }
  }
  
  /* Animated background elements */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${productionColors.brand.primary}, transparent);
    background-size: 200% 100%;
    animation: slideInFromLeft 3s infinite alternate;
  }
`;

const FooterGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr;
  gap: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const FooterColumn = styled.div`
  color: ${productionColors.text.secondary};

  h4 {
    color: ${productionColors.text.primary};
    font-size: 18px;
    margin-bottom: 16px;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 40px;
      height: 2px;
      background: ${productionColors.brand.primary};
      border-radius: 2px;
    }
  }

  p {
    color: ${productionColors.text.tertiary};
    line-height: 1.7;
    margin-bottom: 16px;
    font-size: 14px;
  }

  a {
    display: flex;
    align-items: center;
    color: ${productionColors.text.secondary};
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 12px;
    transition: all ${productionAnimations.duration.fast} ${productionAnimations.easing.smooth};
    gap: 8px;

    &:hover {
      color: ${productionColors.brand.primary};
      transform: translateX(4px);
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
    
    a {
      margin-bottom: 0;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    color: ${productionColors.text.secondary};
    transition: all ${productionAnimations.duration.fast} ${productionAnimations.easing.smooth};
    
    &:hover {
      background: ${productionColors.brand.primary};
      color: ${productionColors.text.primary};
      transform: translateY(-2px);
    }
  }
`;

const FooterBottom = styled.div`
  max-width: 1400px;
  margin: 48px auto 0;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const CopyrightNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;
  
  a {
    color: ${productionColors.text.tertiary};
    text-decoration: none;
    transition: color ${productionAnimations.duration.fast} ${productionAnimations.easing.smooth};
    
    &:hover {
      color: ${productionColors.brand.primary};
    }
  }
  
  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

const BrandTagline = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  
  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }
`;

const EmergencyContact = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${productionColors.status.warning};
  font-weight: 600;
  
  /* Pulse animation */
  @keyframes pulse {
    0%, 100% { 
      opacity: 1; 
    }
    50% { 
      opacity: 0.5; 
    }
  }
  animation: pulse 2s infinite;
`;

const Footer: React.FC = () => (
  <FooterWrapper>
    <FooterGrid>
      <FooterColumn>
        <h4>Rescue Ping</h4>
        <p>
          AI-powered disaster prediction and emergency response platform
          delivering early warnings, real-time risk analysis, and evacuation
          guidance to protect lives.
        </p>
        <SocialLinks>
          <a href="https://twitter.com/rescueping" target="_blank" rel="noopener noreferrer">
            <Twitter size={16} />
          </a>
          <a href="https://github.com/Anshiii-01/RescuePing" target="_blank" rel="noopener noreferrer">
            <Github size={16} />
          </a>
          <a href="https://rescueping.org" target="_blank" rel="noopener noreferrer">
            <Globe size={16} />
          </a>
        </SocialLinks>
      </FooterColumn>

      <FooterColumn>
        <h4>Platform</h4>
        <ul>
          <li><Link to="/dashboard"><MapPin size={14} /> Dashboard</Link></li>
          <li><Link to="/alerts"><AlertTriangle size={14} /> Alerts</Link></li>
          <li><Link to="/evacuation"><Shield size={14} /> Evacuation</Link></li>
          <li><Link to="/predictions">Predictions</Link></li>
          <li><Link to="/flood-forecast">Flood Forecast</Link></li>
        </ul>
      </FooterColumn>

      <FooterColumn>
        <h4>Resources</h4>
        <ul>
          <li><Link to="/api-docs">API Documentation</Link></li>
          <li><Link to="/developer-tools">Developer Tools</Link></li>
          <li><Link to="/research">Research & Data</Link></li>
          <li><Link to="/community">Community Forum</Link></li>
          <li><Link to="/support">Support Center</Link></li>
        </ul>
      </FooterColumn>

      <FooterColumn>
        <h4>Emergency</h4>
        <EmergencyContact>
          <AlertTriangle size={16} />
          <span>Emergency Hotline: 1-800-SAFE-NOW</span>
        </EmergencyContact>
        <br />
        <h4>Legal</h4>
        <ul>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms & Conditions</Link></li>
          <li><Link to="/compliance">Compliance</Link></li>
        </ul>
      </FooterColumn>
    </FooterGrid>

    <FooterBottom>
      <CopyrightNotice>
        <span>© {new Date().getFullYear()} Rescue Ping. All rights reserved.</span>
      </CopyrightNotice>

      <FooterLinks>
        <Link to="/accessibility">Accessibility</Link>
        <Link to="/security">Security</Link>
        <Link to="/status">Status</Link>
      </FooterLinks>

      <BrandTagline>
        <span><Shield size={14} /> Disaster preparedness</span>
        <span><AlertTriangle size={14} /> Public safety</span>
        <span><Globe size={14} /> AI powered</span>
      </BrandTagline>
    </FooterBottom>
  </FooterWrapper>
);

export default Footer;
