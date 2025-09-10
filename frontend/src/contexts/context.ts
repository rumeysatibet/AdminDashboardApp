import { createContext } from 'react';
import type { DataRefreshContextValue } from './types';

export const DataRefreshContext = createContext<DataRefreshContextValue | undefined>(undefined);