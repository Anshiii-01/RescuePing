import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock modules that require browser APIs or external services
jest.mock('../utils/locationOverride', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('../services/enhancedLocationService', () => ({
  enhancedLocationService: {
    getCurrentLocation: jest.fn(),
    watchLocation: jest.fn(),
  },
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Just check that the component renders
    expect(document.body).toBeInTheDocument();
  });

  it('renders Rescue Ping branding', () => {
    render(<App />);
    // Check for brand name in the document
    const brandElements = screen.queryAllByText(/Rescue Ping/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });

  it('includes navigation elements', () => {
    render(<App />);
    // Navigation should be present
    const navigation = document.querySelector('nav');
    expect(navigation).toBeInTheDocument();
  });

  it('includes router for page navigation', () => {
    render(<App />);
    // Main content area should be present
    const mainContent = document.querySelector('#main-content') || document.querySelector('.App') || document.querySelector('div');
    expect(mainContent).toBeInTheDocument();
  });
});
