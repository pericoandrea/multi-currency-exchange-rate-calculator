import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import CurrencyCalculator from './components/CurrencyCalculator';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <CurrencyCalculator />
      </div>
    </QueryClientProvider>
  );
}

export default App;