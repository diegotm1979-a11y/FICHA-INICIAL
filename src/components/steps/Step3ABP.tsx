import React from 'react';
import { PlayerData } from '../../types';
import { ToggleYesNo } from '../ToggleYesNo';
import { Target, ShieldCheck, Flame } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Step3Props {
  data: PlayerData;
  onChange: (fields: Partial<PlayerData>) => void;
  errors: Record<string, string>;
}

export const Step3ABP: React.FC<Step3Props> = ({ data, onChange, errors }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-red-600" />
          {t.step3.title}
        </h3>
      </div>

      {/* BLOQUE ABP OFENSIVO */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-red-700 font-bold text-base sm:text-lg border-b border-red-200 pb-2">
          <Flame className="w-5 h-5 text-red-600" />
          <h4>{t.step3.offensiveSection}</h4>
        </div>

        <div className="space-y-3">
          <ToggleYesNo
            id="abp-offensive-fouls-corners"
            label={t.step3.foulsCorners}
            yesText={t.common.yes}
            noText={t.common.no}
            value={data.abpOffensiveFoulsCorners}
            onChange={(val) => onChange({ abpOffensiveFoulsCorners: val })}
            error={errors.abpOffensiveFoulsCorners}
          />

          <ToggleYesNo
            id="abp-offensive-header"
            label={t.step3.header}
            yesText={t.common.yes}
            noText={t.common.no}
            value={data.abpOffensiveHeader}
            onChange={(val) => onChange({ abpOffensiveHeader: val })}
            error={errors.abpOffensiveHeader}
          />

          <ToggleYesNo
            id="abp-memorize-plays"
            label={t.step3.memorizePlays}
            yesText={t.common.yes}
            noText={t.common.no}
            value={data.abpMemorizePlays}
            onChange={(val) => onChange({ abpMemorizePlays: val })}
            error={errors.abpMemorizePlays}
          />
        </div>
      </div>

      {/* BLOQUE ABP DEFENSIVO */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg border-b border-slate-200 pb-2">
          <ShieldCheck className="w-5 h-5 text-slate-700" />
          <h4>{t.step3.defensiveSection}</h4>
        </div>

        <div className="space-y-3">
          <ToggleYesNo
            id="abp-defensive-man-marking"
            label={t.step3.manMarking}
            yesText={t.common.yes}
            noText={t.common.no}
            value={data.abpDefensiveManMarking}
            onChange={(val) => onChange({ abpDefensiveManMarking: val })}
            error={errors.abpDefensiveManMarking}
          />

          <ToggleYesNo
            id="abp-defensive-zone"
            label={t.step3.zonalDefense}
            yesText={t.common.yes}
            noText={t.common.no}
            value={data.abpDefensiveZone}
            onChange={(val) => onChange({ abpDefensiveZone: val })}
            error={errors.abpDefensiveZone}
          />
        </div>
      </div>
    </div>
  );
};
