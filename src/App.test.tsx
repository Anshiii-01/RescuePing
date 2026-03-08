import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock modules that require browser APIs or external services
jest.mock('./utils/locationOverride', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('./services/enhancedLocationService', () => ({
  enhancedLocationService: {
    getCurrentLocation: jest.fn(),
    watchLocation: jest.fn(),
  },
}));

test('renders without crashing', () => {
  render(<App />);
  expect(document.body).toBeInTheDocument();
});
