import { useContext } from 'react';
import { createContext } from 'react';
import type { ToastManager } from './useToasts';

const ToastContext = createContext<ToastManager | null>(null);

export { ToastContext };

export function useToastContext(): ToastManager {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}