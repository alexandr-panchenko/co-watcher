import React from 'react';
import { useTranslation } from 'react-i18next';
import { ASSETS } from '../../../data/mockData';

interface CutCompositionCanvasProps {
  layoutMode: 'pip' | 'split' | 'fullscreen-diagram';
  animatedCaptions: boolean;
}

export const CutCompositionCanvas: React.FC<CutCompositionCanvasProps> = ({
  layoutMode,
  animatedCaptions,
}) => {
  const { t } = useTranslation('assembly');

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex">
      {layoutMode === 'pip' && (
        <div className="relative w-full h-full">
          <img
            src={ASSETS.lectureStage}
            alt="Source lecture stage"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-16 right-5 w-44 aspect-video rounded-xl overflow-hidden border-2 border-amber shadow-2xl z-20 group/cam transition-transform hover:scale-105">
            <img
              src={ASSETS.studioCam}
              alt="Reaction webcam feed"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-nano font-mono text-amber font-bold uppercase tracking-wider">
              {t('preview.camRec')}
            </div>
          </div>
        </div>
      )}

      {layoutMode === 'split' && (
        <div className="w-full h-full grid grid-cols-2 gap-1 bg-surface-base">
          <div className="relative h-full overflow-hidden">
            <img
              src={ASSETS.lectureStage}
              alt="Source Lecture"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/75 text-micro font-mono text-white">
              {t('preview.sourceLabel')}
            </div>
          </div>
          <div className="relative h-full overflow-hidden border-l border-amber/40">
            <img
              src={ASSETS.studioCam}
              alt="User Reaction"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-amber text-black text-micro font-mono font-bold">
              {t('preview.reactionLabel')}
            </div>
          </div>
        </div>
      )}

      {layoutMode === 'fullscreen-diagram' && (
        <div className="relative w-full h-full bg-surface-canvas flex items-center justify-center p-6">
          <img
            src={ASSETS.diagram}
            alt="Multi-Head Attention full schematic"
            className="max-h-full object-contain rounded-lg border border-white/10"
          />
          <div className="absolute bottom-16 right-6 w-36 aspect-video rounded-lg overflow-hidden border border-amber shadow-xl">
            <img
              src={ASSETS.studioCam}
              alt="Reaction webcam"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {animatedCaptions && (
        <div className="absolute bottom-16 inset-x-0 flex justify-center z-30 pointer-events-none px-6">
          <div className="bg-black/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-center shadow-2xl max-w-lg">
            <span className="text-amber font-semibold text-xs md:text-sm font-sans">
              {t('preview.caption')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
