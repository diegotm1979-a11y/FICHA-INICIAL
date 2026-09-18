import React from 'react';
import { FORM_STEPS, FormStep } from '../types';
import { Check } from 'lucide-react';

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
  const currentMeta = FORM_STEPS.find((s) => s.step === currentStep);
  const totalSteps = FORM_STEPS.length;
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-red-200 sticky top-0 z-30 px-3 sm:px-6 py-3 no-print shadow-xs">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Top Header info: Step index and percent */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              Paso {currentStep} de {totalSteps}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {currentMeta?.title}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span className="text-red-600 font-bold">{progressPercent}%</span> completado
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
          {FORM_STEPS.map((s) => {
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
