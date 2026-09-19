import React from 'react';
import { FormStep } from '../types';
import { Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface StepProgressBarProps {
  currentStep: FormStep;
  onSelectStep: (step: FormStep) => void;
  maxStepVisited: FormStep;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onSelectStep,
  maxStepVisited,
}) => {
  const { t } = useLanguage();

  const stepsMeta = [
    { step: 1 as FormStep, ...t.stepsMeta.step1 },
    { step: 2 as FormStep, ...t.stepsMeta.step2 },
    { step: 3 as FormStep, ...t.stepsMeta.step3 },
    { step: 4 as FormStep, ...t.stepsMeta.step4 },
    { step: 5 as FormStep, ...t.stepsMeta.step5 },
    { step: 6 as FormStep, ...t.stepsMeta.step6 },
    { step: 7 as FormStep, ...t.stepsMeta.step7 },
  ];

  const currentMeta = stepsMeta.find((s) => s.step === currentStep);
  const totalSteps = stepsMeta.length;
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  const stepOfLabel = t.nav.stepOf
    .replace('{current}', String(currentStep))
    .replace('{total}', String(totalSteps));

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-red-200 sticky top-0 z-30 px-3 sm:px-6 py-3 no-print shadow-xs">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Top Header info: Step index and percent */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              {stepOfLabel}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {currentMeta?.title}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span className="text-red-600 font-bold">{progressPercent}%</span> {t.nav.completed}
          </div>
        </div>

        {/* Continuous progress bar line */}
        <div className="w-full h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 ease-out rounded-full shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step chips for quick navigation on mobile and desktop */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          {stepsMeta.map((s) => {
            const isCurrent = s.step === currentStep;
            const isCompleted = s.step < currentStep;
            const canNavigate = s.step <= maxStepVisited || isCompleted;

            return (
              <button
                key={s.step}
                type="button"
                id={`step-nav-btn-${s.step}`}
                disabled={!canNavigate}
                onClick={() => canNavigate && onSelectStep(s.step)}
                className={`group flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-red-600 text-white font-bold shadow-sm ring-1 ring-red-500'
                    : isCompleted
                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                    : canNavigate
                    ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                    : 'text-slate-400 cursor-not-allowed opacity-50'
                }`}
                title={s.title}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-white text-red-600'
                      : isCompleted
                      ? 'bg-red-200 text-red-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.step}
                </span>
                <span className="hidden md:inline whitespace-nowrap">{s.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
