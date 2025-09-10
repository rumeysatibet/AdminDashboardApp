import { useState, useCallback, type ReactNode } from 'react';
import { DataRefreshContext } from './context';

interface DataRefreshProviderProps {
  children: ReactNode;
}

export function DataRefreshProvider({ children }: DataRefreshProviderProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <DataRefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </DataRefreshContext.Provider>
  );
}