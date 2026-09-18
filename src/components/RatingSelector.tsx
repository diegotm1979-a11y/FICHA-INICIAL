import React from 'react';

interface RatingSelectorProps {
  id?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
  sublabel?: string;
  lowLabel?: string;
  highLabel?: string;
}

export const RatingSelector: React.FC<RatingSelectorProps> = ({
  id,
  value,
  onChange,
  min = 0,
  max = 10,
  label,
  sublabel,
  lowLabel = 'Mínimo (0)',
  highLabel = 'Máximo (10)',
}) => {
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div id={id} className="space-y-2.5">
      {(label || sublabel) && (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          {label && <label className="text-sm sm:text-base font-semibold text-slate-900">{label}</label>}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            Puntuación: <span className="ml-1.5 text-sm text-red-700 font-black">{value}</span> / {max}
          </span>
        </div>
      )}
      {sublabel && <p className="text-xs sm:text-sm text-slate-500">{sublabel}</p>}

      <div className="grid grid-cols-11 gap-1 sm:gap-1.5 pt-1">
        {values.map((num) => {
          const isSelected = value === num;
          return (
            <button
              key={num}
              type="button"
              id={`${id}-btn-${num}`}
              onClick={() => onChange(num)}
              className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl border text-sm sm:text-base transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                isSelected
                  ? 'bg-red-600 text-white font-bold border-red-600 shadow-md shadow-red-600/25 ring-2 ring-red-400/50 scale-105 z-10'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400 shadow-2xs'
              }`}
            >
              <span className="font-semibold">{num}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[11px] sm:text-xs text-slate-500 font-medium px-1">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
};
