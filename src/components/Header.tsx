import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenType } from '../types';
import { IconButton, Button } from './ui';

interface HeaderProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenHelp,
}) => {
  const { t } = useTranslation('common');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-base/90 backdrop-blur-xl border-b border-white/5 shadow-header-bar">
      <div className="h-14 w-full px-4 md:px-6 flex items-center justify-between">
        {/* Left: Brand logo & Name */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left cursor-pointer p-0"
            title={t('brand.name')}
          >
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <span className="font-semibold text-base tracking-tight text-text-primary flex items-center gap-1.5 font-sans">
              {t('brand.name')}
            </span>
          </Button>
        </div>

        {/* Right side controls: Help & Avatar */}
        <div className="flex items-center gap-3">
          <IconButton
            iconName="help_outline"
            onClick={onOpenHelp}
            title={t('nav.helpTitle')}
          />

          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-mono text-xs font-bold shadow-md p-0"
            title={t('nav.profileTitle')}
          >
            {t('nav.userInitials')}
          </Button>
        </div>
      </div>
    </header>
  );
};
