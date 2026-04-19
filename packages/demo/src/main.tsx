import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Landing } from './Landing.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Landing />
  </StrictMode>,
);
