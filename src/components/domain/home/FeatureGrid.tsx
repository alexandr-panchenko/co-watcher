import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenType } from '../../../types';
import { Card } from '../../ui';

interface FeatureGridProps {
  onNavigate: (screen: ScreenType) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onNavigate }) => {
  const { t } = useTranslation('home');

  return (
    <>
      {/* Top 3 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-4">
        <Card
          variant="hoverable"
          onClick={() => onNavigate('discovery')}
          className="p-5 flex flex-col gap-2.5 cursor-pointer group hover:border-primary/40"
        >
          <div className="flex items-center gap-2.5 text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary-container/15 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">schedule</span>
            </div>
            <h3 className="font-sans text-base font-semibold text-text-primary">
              {t('features.context.title')}
            </h3>
          </div>
          <p className="font-sans text-caption-md text-text-secondary leading-relaxed">
            {t('features.context.description')}
          </p>
        </Card>

        <Card
          variant="hoverable"
          onClick={() => onNavigate('discovery')}
          className="p-5 flex flex-col gap-2.5 cursor-pointer group hover:border-secondary/40"
        >
          <div className="flex items-center gap-2.5 text-secondary">
            <div className="w-8 h-8 rounded-lg bg-secondary-container/15 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">verified</span>
            </div>
            <h3 className="font-sans text-base font-semibold text-text-primary">
              {t('features.factCheck.title')}
            </h3>
          </div>
          <p className="font-sans text-caption-md text-text-secondary leading-relaxed">
            {t('features.factCheck.description')}
          </p>
        </Card>

        <Card
          variant="hoverable"
          onClick={() => onNavigate('discovery')}
          className="p-5 flex flex-col gap-2.5 cursor-pointer group hover:border-primary/40"
        >
          <div className="flex items-center gap-2.5 text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">tune</span>
            </div>
            <h3 className="font-sans text-base font-semibold text-text-primary">
              {t('features.personal.title')}
            </h3>
          </div>
          <p className="font-sans text-caption-md text-text-secondary leading-relaxed">
            {t('features.personal.description')}
          </p>
        </Card>
      </div>

      {/* Bottom 2 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-10">
        <Card
          variant="hoverable"
          onClick={() => onNavigate('discovery')}
          className="p-5 flex flex-col gap-2.5 cursor-pointer group hover:border-tertiary/40"
        >
          <div className="flex items-center gap-2.5 text-tertiary">
            <div className="w-8 h-8 rounded-lg bg-tertiary-container/15 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">explore</span>
            </div>
            <h3 className="font-sans text-base font-semibold text-text-primary">
              {t('features.discovery.title')}
            </h3>
          </div>
          <p className="font-sans text-caption-md text-text-secondary leading-relaxed">
            {t('features.discovery.description')}
          </p>
        </Card>

        <Card
          variant="hoverable"
          onClick={() => onNavigate('assembly')}
          className="p-5 flex flex-col gap-2.5 cursor-pointer group hover:border-secondary/40"
        >
          <div className="flex items-center gap-2.5 text-secondary">
            <div className="w-8 h-8 rounded-lg bg-secondary-container/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">movie_edit</span>
            </div>
            <h3 className="font-sans text-base font-semibold text-text-primary">
              {t('features.reactions.title')}
            </h3>
          </div>
          <p className="font-sans text-caption-md text-text-secondary leading-relaxed">
            {t('features.reactions.description')}
          </p>
        </Card>
      </div>
    </>
  );
};
