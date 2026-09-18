import React from 'react';
import { Check, X } from 'lucide-react';

interface ToggleYesNoProps {
  id?: string;
  label: string;
  description?: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
  error?: string;
  yesText?: string;
  noText?: string;
}

export const ToggleYesNo: React.FC<ToggleYesNoProps> = ({
  id,
  label,
  description,
  value,
  onChange,
  error,
  yesText = 'Sí',
  noText = 'No',
}) => {
  return (
    <div id={id} className={`p-4 rounded-xl border transition-colors ${error ? 'border-red-400 bg-red-50/70' : 'border-slate-200 bg-slate-50/70'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-sm sm:text-base font-semibold text-slate-900 block">{label}</span>
          {description && <p className="text-xs sm:text-sm text-slate-500">{description}</p>}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            id={`${id}-yes`}
            onClick={() => onChange(true)}
            className={`min-h-[44px] min-w-[72px] px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 border transition-all active:scale-95 ${
              value === true
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-400/30'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900 shadow-2xs'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{yesText}</span>
          </button>

          <button
            type="button"
            id={`${id}-no`}
            onClick={() => onChange(false)}
            className={`min-h-[44px] min-w-[72px] px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 border transition-all active:scale-95 ${
              value === false
                ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/25 ring-2 ring-red-400/30'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-red-400 hover:text-slate-900 shadow-2xs'
            }`}
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>{noText}</span>
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
