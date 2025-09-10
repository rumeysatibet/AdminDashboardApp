import { useState, useCallback } from 'react';
import type { ToastType } from '../types';

/**
 * Toast Manager Hook
 * Manages multiple toasts with unique IDs
 */
interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ToastManager {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export function useToasts(): ToastManager {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  
  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);
  
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  const success = useCallback((message: string, duration?: number) => {
    addToast({ type: 'success', message, duration });
  }, [addToast]);
  
  const error = useCallback((message: string, duration?: number) => {
    addToast({ type: 'error', message, duration });
  }, [addToast]);
  
  const warning = useCallback((message: string, duration?: number) => {
    addToast({ type: 'warning', message, duration });
  }, [addToast]);
  
  const info = useCallback((message: string, duration?: number) => {
    addToast({ type: 'info', message, duration });
  }, [addToast]);
  
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}