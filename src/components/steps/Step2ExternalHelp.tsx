import React from 'react';
import { PlayerData, EXTERNAL_HELP_OPTIONS } from '../../types';
import { Activity, Dumbbell, Brain, Stethoscope, Apple, PlusCircle, Ban, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Step2Props {
  data: PlayerData;
  onChange: (fields: Partial<PlayerData>) => void;
  errors: Record<string, string>;
}

export const Step2ExternalHelp: React.FC<Step2Props> = ({ data, onChange, errors }) => {
  const { t, translateExternalHelp } = useLanguage();

  const getIcon = (option: string) => {
    switch (option) {
      case 'Entrenador personal':
        return <Dumbbell className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'Coach / Psicólogo deportivo':
        return <Brain className="w-5 h-5 text-indigo-500 shrink-0" />;
      case 'Fisioterapeuta / Readaptador externo':
        return <Stethoscope className="w-5 h-5 text-teal-500 shrink-0" />;
      case 'Nutricionista':
        return <Apple className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'Otros':
        return <PlusCircle className="w-5 h-5 text-purple-500 shrink-0" />;
      case 'Ninguna':
        return <Ban className="w-5 h-5 text-slate-400 shrink-0" />;
      default:
        return <Activity className="w-5 h-5 text-emerald-500 shrink-0" />;
    }
  };

  const toggleOption = (option: string) => {
    let nextList = [...data.externalHelps];

    if (option === 'Ninguna') {
      // If "Ninguna" is selected, clear all others
      nextList = nextList.includes('Ninguna') ? [] : ['Ninguna'];
      onChange({
        externalHelps: nextList,
        externalHelpOther: '',
      });
      return;
    }

    // If another option is clicked and "Ninguna" was present, remove "Ninguna"
    nextList = nextList.filter((item) => item !== 'Ninguna');

    if (nextList.includes(option)) {
      nextList = nextList.filter((item) => item !== option);
      // If "Otros" was unselected, clear the other text
      if (option === 'Otros') {
        onChange({ externalHelps: nextList, externalHelpOther: '' });
        return;
      }
    } else {
      nextList.push(option);
    }

    onChange({ externalHelps: nextList });
  };

  const isSelected = (opt: string) => data.externalHelps.includes(opt);
  const hasOther = isSelected('Otros');

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-red-600" />
          {t.step2.title}
        </h3>
        <p className="text-sm sm:text-base font-semibold text-slate-700 mt-1.5">
          {t.step2.subtitle}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">
            {t.step2.selectPrompt} <span className="text-red-600">*</span>
          </span>
          <span className="text-xs text-slate-500">
            {data.externalHelps.length === 0
              ? t.step2.noneSelected
              : `${data.externalHelps.length} ${t.step2.selectedCount}`}
          </span>
        </div>

        {/* Selection grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {EXTERNAL_HELP_OPTIONS.map((opt) => {
            const selected = isSelected(opt);
            const localizedLabel = translateExternalHelp(opt);
            return (
              <button
                key={opt}
                type="button"
                id={`help-chip-${opt.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => toggleOption(opt)}
                className={`min-h-[58px] p-4 rounded-xl border flex items-center justify-between gap-3 text-left transition-all duration-200 active:scale-[0.98] ${
                  selected
                    ? opt === 'Ninguna'
                      ? 'bg-red-50 border-red-500 text-red-950 shadow-sm ring-1 ring-red-400/40'
                      : 'bg-red-50/60 border-red-500 text-slate-950 shadow-sm ring-1 ring-red-400/40'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getIcon(opt)}
                  <span className="font-semibold text-sm sm:text-base leading-snug">{localizedLabel}</span>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                    selected
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'border-slate-300 bg-slate-100'
                  }`}
                >
                  {selected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {errors.externalHelps && (
          <p className="text-xs text-red-600 font-medium">{errors.externalHelps}</p>
        )}

        {/* Conditional text input if "Otros" is marked */}
        {hasOther && (
          <div className="p-4 bg-slate-50/70 border border-red-300 rounded-xl space-y-2 animate-fadeIn">
            <label htmlFor="externalHelpOther" className="block text-sm font-semibold text-slate-800">
              {t.step2.otherSpecify} <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="externalHelpOther"
              name="externalHelpOther"
              value={data.externalHelpOther}
              onChange={(e) => onChange({ externalHelpOther: e.target.value })}
              placeholder={t.step2.otherPlaceholder}
              className={`w-full min-h-[48px] px-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-2xs ${
                errors.externalHelpOther
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
              }`}
            />
            {errors.externalHelpOther && (
              <p className="text-xs text-red-600 font-medium">{errors.externalHelpOther}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
