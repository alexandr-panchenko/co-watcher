import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../ui';

export const HomeHero: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <div className="text-center max-w-3xl flex flex-col items-center gap-3 mb-10">
      <Badge variant="sapphire" size="md">
        <span className="material-symbols-outlined text-sm">auto_awesome</span>
        <span>{t('hero.badge')}</span>
      </Badge>
      <h1 className="font-sans text-3xl md:text-5xl text-text-primary font-semibold tracking-tight leading-tight">
        {t('hero.title')}
      </h1>
      <p className="font-sans text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl">
        {t('hero.description')}
      </p>
    </div>
  );
};
