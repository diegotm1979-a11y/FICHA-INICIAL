import React from 'react';
import { PlayerData } from '../../types';
import { RatingSelector } from '../RatingSelector';
import { ShieldAlert, Dumbbell, Compass, Flame } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Step5Props {
  data: PlayerData;
  onChange: (fields: Partial<PlayerData>) => void;
}

export const Step5Commitment: React.FC<Step5Props> = ({ data, onChange }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Compass className="w-6 h-6 text-red-600" />
          {t.step5.title}
        </h3>
      </div>

      {/* BLOQUE 1: COMPROMISO ANTE SITUACIONES DEPORTIVAS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-red-700 font-bold text-base sm:text-lg border-b border-red-200 pb-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <h4>{t.step5.block1Title}</h4>
        </div>

        <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-4">
          <RatingSelector
            id="commitment-not-starting"
            label={t.step5.notStarting}
            value={data.commitmentNotStarting}
            onChange={(val) => onChange({ commitmentNotStarting: val })}
            lowLabel={t.step5.notStartingLow}
            highLabel={t.step5.notStartingHigh}
          />

          <div className="border-t border-slate-200 pt-4">
            <RatingSelector
              id="commitment-substituted"
              label={t.step5.substituted}
              value={data.commitmentSubstituted}
              onChange={(val) => onChange({ commitmentSubstituted: val })}
              lowLabel={t.step5.substitutedLow}
              highLabel={t.step5.substitutedHigh}
            />
          </div>
        </div>
      </div>

      {/* BLOQUE 2: ¿CUÁNTO TE GUSTA? (PREFERENCIAS DE TRABAJO) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg border-b border-slate-200 pb-2">
          <Dumbbell className="w-5 h-5 text-red-600" />
          <h4>{t.step5.block2Title}</h4>
        </div>

        <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-5">
          <RatingSelector
            id="like-pitch-training"
            label={t.step5.pitchTraining}
            value={data.likePitchTraining}
            onChange={(val) => onChange({ likePitchTraining: val })}
            lowLabel={t.step5.pitchTrainingLow}
            highLabel={t.step5.pitchTrainingHigh}
          />

          <div className="border-t border-slate-200 pt-4">
            <RatingSelector
              id="like-gym-work"
              label={t.step5.gymWork}
              value={data.likeGymWork}
              onChange={(val) => onChange({ likeGymWork: val })}
              lowLabel={t.step5.gymWorkLow}
              highLabel={t.step5.gymWorkHigh}
            />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <RatingSelector
              id="like-self-care"
              label={t.step5.selfCare}
              value={data.likeSelfCare}
              onChange={(val) => onChange({ likeSelfCare: val })}
              lowLabel={t.step5.selfCareLow}
              highLabel={t.step5.selfCareHigh}
            />
          </div>
        </div>
      </div>

      {/* BLOQUE 3: PREPARACIÓN PREVIA */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg border-b border-slate-200 pb-2">
          <Flame className="w-5 h-5 text-red-600" />
          <h4>{t.step5.block3Title}</h4>
        </div>

        <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
          <RatingSelector
            id="physical-preparation-score"
            label={t.step5.physicalScore}
            value={data.physicalPreparationScore}
            onChange={(val) => onChange({ physicalPreparationScore: val })}
            lowLabel={t.step5.physicalScoreLow}
            highLabel={t.step5.physicalScoreHigh}
          />
        </div>
      </div>
    </div>
  );
};
