import React from 'react';
import { Card } from './Card';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <Card
        variant="overlay"
        elevation="high"
        className={`w-full ${maxWidthStyles} border border-border-hover flex flex-col max-h-modal overflow-hidden`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            {icon && <div className="shrink-0">{icon}</div>}
            <div>
              <h2 className="font-sans text-base md:text-lg font-semibold text-text-primary tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <div className="font-mono text-xs text-text-muted mt-0.5">
                  {subtitle}
                </div>
              )}
            </div>
          </div>
          <IconButton
            iconName="close"
            onClick={onClose}
            title="Close modal"
            className="text-text-muted hover:text-text-primary"
          />
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-5 overflow-y-auto space-y-4 flex-1">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex items-center justify-between p-4 bg-surface-panel border-t border-white/5">
            {footer}
          </div>
        )}
      </Card>
    </div>
  );
};
