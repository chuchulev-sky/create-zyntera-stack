import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import { AppProviders } from './app/providers';
import { Spinner } from './components/ui/Spinner';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      }
    >
      <AppProviders />
    </Suspense>
  </StrictMode>,
);