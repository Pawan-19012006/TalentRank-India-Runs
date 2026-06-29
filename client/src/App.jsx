import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { RankingProvider } from './store/rankingStore';

function App() {
  return (
    <RankingProvider>
      <div className="min-h-screen text-text-main bg-background font-sans">
        <AppRoutes />
      </div>
    </RankingProvider>
  );
}

export default App;