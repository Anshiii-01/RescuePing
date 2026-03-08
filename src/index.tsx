import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import logger from './utils/logger';
import { registerServiceWorker } from './serviceWorkerRegistration';

// Log app startup
logger.log('🌟 Rescue Ping v2.1.0 - Optimized Build');
logger.log('📅 Build Date:', new Date().toLocaleString());

// Register service worker for PWA support
registerServiceWorker();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals();
