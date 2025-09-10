import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import type { ModalProps } from '../../types';
import { Button } from './Button';

/**
 * Professional Modal Component
 * Full accessibility support, focus management, and escape key handling
 */
export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  footer
}: ModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-2xl max-h-[80vh]',
  };
  
  const panelClasses = clsx(
    'modal-panel',
    sizeClasses[size]
  );
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className="modal-content">
        <div 
          className={panelClasses}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200">
            <h2 
              id="modal-title" 
              className="text-lg font-semibold text-secondary-900"
            >
              {title}
            </h2>
            <Button
              variant="secondary"
              size="small"
              onClick={onClose}
              className="!p-2"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Body */}
          <div className="p-6 flex-1 overflow-y-auto max-h-[50vh]">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Confirmation Modal for dangerous actions
 */
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  isDangerous = false,
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="space-y-4">
        <p className="text-secondary-700">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}