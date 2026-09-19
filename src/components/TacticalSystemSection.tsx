import React from 'react';
import {
  TacticalPitch,
  FORMATION_4141_POSITIONS,
  FORMATION_13232_POSITIONS,
} from './TacticalPitch';
import { LayoutGrid, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TacticalSystemSectionProps {
  system4141Values: Record<string, number | null>;
  system13232Values: Record<string, number | null>;
  onChange4141?: (vals: Record<string, number | null>) => void;
  onChange13232?: (vals: Record<string, number | null>) => void;
  interactive?: boolean;
}

export const TacticalSystemSection: React.FC<TacticalSystemSectionProps> = ({
  system4141Values = {},
  system13232Values = {},
  onChange4141,
  onChange13232,
  interactive = true,
}) => {
  const { t } = useLanguage();
  const count4141 = Object.values(system4141Values).filter((v) => v !== null && v !== undefined).length;
  const count13232 = Object.values(system13232Values).filter((v) => v !== null && v !== undefined).length;

  return (
    <div className="space-y-4 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shrink-0">
            <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">
              {t.step4.tacticalSystemsTitle}
            </h4>
            <p className="text-xs text-slate-500">
              {t.step4.tacticalSystemsSubtitle}
            </p>
          </div>
        </div>

        {interactive && (
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
            <span>
              1-4-1-4-1: <strong className="text-red-700">{count4141}/11</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span>
              1-3-2-3-2: <strong className="text-red-700">{count13232}/11</strong>
            </span>
          </div>
        )}
      </div>

      {/* Instructional Banner */}
      {interactive && (
        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.step4.tacticalSystemsInstruction}
          </p>
        </div>
      )}

      {/* Two Football Pitches Side by Side */}
      <div data-avoid-break="true" className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1 print-avoid-break break-inside-avoid">
        {/* Pitch 1: 1-4-1-4-1 */}
        <div data-avoid-break="true" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 print-avoid-break break-inside-avoid">
          <TacticalPitch
            systemTitle="1-4-1-4-1"
            watermarkText="1-4-1-4-1"
            positions={FORMATION_4141_POSITIONS}
            values={system4141Values}
            onChange={onChange4141}
            interactive={interactive}
          />
        </div>

        {/* Pitch 2: 1-3-2-3-2 */}
        <div data-avoid-break="true" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 print-avoid-break break-inside-avoid">
          <TacticalPitch
            systemTitle="1-3-2-3-2"
            watermarkText="1-3-2-3-2"
            positions={FORMATION_13232_POSITIONS}
            values={system13232Values}
            onChange={onChange13232}
            interactive={interactive}
          />
        </div>
      </div>
    </div>
  );
};
