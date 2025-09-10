import { useToasts } from '../hooks/useToasts';
import { Toast, ToastContainer } from '../components/common';
import { ToastContext } from '../hooks/useToastContext';

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toastManager = useToasts();

  return (
    <ToastContext.Provider value={toastManager}>
      {children}
      <ToastContainer>
        {toastManager.toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => toastManager.removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

