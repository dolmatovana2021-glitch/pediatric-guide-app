import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { setupPwa } from '@/components/shared/pwa'

setupPwa();

createRoot(document.getElementById("root")!).render(<App />);

requestAnimationFrame(() => {
  (window as Window & { __hideSplash?: () => void }).__hideSplash?.();
});