import React from 'react';
import { PlayerData } from '../../types';
import { RatingSelector } from '../RatingSelector';
import { TacticalSystemSection } from '../TacticalSystemSection';
import { Sparkles, Smile, ShieldAlert, Zap, ArrowUpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Step4Props {
  data: PlayerData;
  onChange: (fields: Partial<PlayerData>) => void;
  errors: Record<string, string>;
}

export const Step4Psychology: React.FC<Step4Props> = ({ data, onChange, errors }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-red-600" />
          {t.step4.title}
        </h3>
      </div>

      {/* Grado de ilusión */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
        <RatingSelector
          id="illusion-score"
          label={t.step4.illusionLabel}
          value={data.illusionScore}
          onChange={(val) => onChange({ illusionScore: val })}
          lowLabel={t.step4.illusionLow}
          highLabel={t.step4.illusionHigh}
        />
      </div>

      {/* SECCIÓN PERSONALIDAD */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-red-700 flex items-center gap-2">
          <Smile className="w-4 h-4 text-red-600" />
          {t.step4.personalitySection}
        </h4>

        {/* Rasgos positivos */}
        <div className="space-y-2">
          <label htmlFor="positivePersonalityTraits" className="block text-sm font-semibold text-slate-800">
            {t.step4.positiveTraits} <span className="text-red-600">*</span>
          </label>
          <textarea
            id="positivePersonalityTraits"
            name="positivePersonalityTraits"
            rows={3}
            value={data.positivePersonalityTraits}
            onChange={(e) => onChange({ positivePersonalityTraits: e.target.value })}
            placeholder={t.step4.positiveTraitsPlaceholder}
            className={`w-full p-3.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all resize-none shadow-2xs ${
              errors.positivePersonalityTraits
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
            }`}
          />
          {errors.positivePersonalityTraits && (
            <p className="text-xs text-red-600 font-medium">{errors.positivePersonalityTraits}</p>
          )}
        </div>

        {/* Rasgos a mejorar */}
        <div className="space-y-2">
          <label htmlFor="personalityImprovementTraits" className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            {t.step4.improvementTraits} <span className="text-red-600">*</span>
          </label>
          <textarea
            id="personalityImprovementTraits"
            name="personalityImprovementTraits"
            rows={3}
            value={data.personalityImprovementTraits}
            onChange={(e) => onChange({ personalityImprovementTraits: e.target.value })}
            placeholder={t.step4.improvementTraitsPlaceholder}
            className={`w-full p-3.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all resize-none shadow-2xs ${
              errors.personalityImprovementTraits
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
            }`}
          />
          {errors.personalityImprovementTraits && (
            <p className="text-xs text-red-600 font-medium">{errors.personalityImprovementTraits}</p>
          )}
        </div>
      </div>

      {/* SECCIÓN ASPECTO TÉCNICO-TÁCTICO */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <Zap className="w-4 h-4 text-red-600" />
          {t.step4.tacticalSection}
        </h4>

        {/* En qué destacas */}
        <div className="space-y-2">
          <label htmlFor="tacticalStrengths" className="block text-sm font-semibold text-slate-800">
            {t.step4.tacticalStrengths} <span className="text-red-600">*</span>
          </label>
          <textarea
            id="tacticalStrengths"
            name="tacticalStrengths"
            rows={3}
            value={data.tacticalStrengths}
            onChange={(e) => onChange({ tacticalStrengths: e.target.value })}
            placeholder={t.step4.tacticalStrengthsPlaceholder}
            className={`w-full p-3.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all resize-none shadow-2xs ${
              errors.tacticalStrengths
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
            }`}
          />
          {errors.tacticalStrengths && (
            <p className="text-xs text-red-600 font-medium">{errors.tacticalStrengths}</p>
          )}
        </div>

        {/* Qué te gustaría mejorar */}
        <div className="space-y-2">
          <label htmlFor="tacticalImprovements" className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <ArrowUpCircle className="w-4 h-4 text-red-600" />
            {t.step4.tacticalImprovements} <span className="text-red-600">*</span>
          </label>
          <textarea
            id="tacticalImprovements"
            name="tacticalImprovements"
            rows={3}
            value={data.tacticalImprovements}
            onChange={(e) => onChange({ tacticalImprovements: e.target.value })}
            placeholder={t.step4.tacticalImprovementsPlaceholder}
            className={`w-full p-3.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all resize-none shadow-2xs ${
              errors.tacticalImprovements
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
            }`}
          />
          {errors.tacticalImprovements && (
            <p className="text-xs text-red-600 font-medium">{errors.tacticalImprovements}</p>
          )}
        </div>
      </div>

      {/* APARTADO DE SISTEMAS DE JUEGO (1-4-1-4-1 Y 1-3-2-3-2) */}
      <div className="pt-2 border-t border-slate-200">
        <TacticalSystemSection
          system4141Values={data.tacticalSystem4141 || {}}
          system13232Values={data.tacticalSystem13232 || {}}
          onChange4141={(vals) => onChange({ tacticalSystem4141: vals })}
          onChange13232={(vals) => onChange({ tacticalSystem13232: vals })}
          interactive={true}
        />
      </div>
    </div>
  );
};
