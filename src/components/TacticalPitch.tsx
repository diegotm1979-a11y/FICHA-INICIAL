import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface TacticalPosition {
  id: string;
  number: number;
  role: string;
  name: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export const FORMATION_4141_POSITIONS: TacticalPosition[] = [
  { id: '1', number: 1, role: 'POR', name: 'Portero', x: 8, y: 50 },
  { id: '6', number: 6, role: 'LI', name: 'Lateral Izquierdo', x: 24, y: 13 },
  { id: '3', number: 3, role: 'DFC Izq', name: 'Central Izquierdo', x: 21, y: 37 },
  { id: '2', number: 2, role: 'DFC Der', name: 'Central Derecho', x: 21, y: 63 },
  { id: '4', number: 4, role: 'LD', name: 'Lateral Derecho', x: 24, y: 87 },
  { id: '5', number: 5, role: 'PIV', name: 'Pivote Defensivo', x: 41, y: 50 },
  { id: '7', number: 7, role: 'EXT Izq', name: 'Extremo / Interior Izquierdo', x: 63, y: 13 },
  { id: '10', number: 10, role: 'INT Izq', name: 'Interior Izquierdo', x: 57, y: 37 },
  { id: '8', number: 8, role: 'INT Der', name: 'Interior Derecho', x: 57, y: 63 },
  { id: '11', number: 11, role: 'EXT Der', name: 'Extremo / Interior Derecho', x: 63, y: 87 },
  { id: '9', number: 9, role: 'DC', name: 'Delantero Centro', x: 84, y: 50 },
];

export const FORMATION_13232_POSITIONS: TacticalPosition[] = [
  { id: '1', number: 1, role: 'POR', name: 'Portero', x: 8, y: 50 },
  { id: '2', number: 2, role: 'DFC Izq', name: 'Central Izquierdo', x: 22, y: 22 },
  { id: '3', number: 3, role: 'DFC Cen', name: 'Central / Líbero', x: 19, y: 50 },
  { id: '4', number: 4, role: 'DFC Der', name: 'Central Derecho', x: 22, y: 78 },
  { id: '5', number: 5, role: 'PIV Izq', name: 'Doble Pivote Izquierdo', x: 40, y: 35 },
  { id: '6', number: 6, role: 'PIV Der', name: 'Doble Pivote Derecho', x: 40, y: 65 },
  { id: '7', number: 7, role: 'CARR Izq', name: 'Carrilero Izquierdo', x: 61, y: 13 },
  { id: '8', number: 8, role: 'MP', name: 'Mediapunta / Enganche', x: 60, y: 50 },
  { id: '9', number: 9, role: 'CARR Der', name: 'Carrilero Derecho', x: 61, y: 87 },
  { id: '10', number: 10, role: 'DC Izq', name: 'Delantero Izquierdo', x: 82, y: 35 },
  { id: '11', number: 11, role: 'DC Der', name: 'Delantero Derecho', x: 82, y: 65 },
];

interface TacticalPitchProps {
  systemTitle: string; // e.g. "1-4-1-4-1" o "1-3-2-3-2"
  watermarkText?: string; // e.g. "4-1-4-1" o "1-3-2-3-2"
  positions: TacticalPosition[];
  values: Record<string, number | null>;
  onChange?: (values: Record<string, number | null>) => void;
  interactive?: boolean;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  systemTitle,
  watermarkText,
  positions,
  values = {},
  onChange,
  interactive = true,
}) => {
  const { t, language, translatePosition } = useLanguage();
  const [activePosId, setActivePosId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePosId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSetNumber = (posId: string, num: number | null) => {
    if (!interactive || !onChange) return;
    const next = { ...values };
    if (num === null) {
      delete next[posId];
    } else {
      next[posId] = num;
    }
    onChange(next);
    setActivePosId(null);
  };

  const handleClearPitch = () => {
    if (!interactive || !onChange) return;
    onChange({});
    setActivePosId(null);
  };

  const activePosition = positions.find((p) => p.id === activePosId);

  return (
    <div className="space-y-2.5" ref={containerRef}>
      {/* Header bar of pitch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-red-600 text-white tracking-wide shadow-2xs">
            {language === 'en' ? 'System' : 'Sistema'} {systemTitle}
          </span>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {language === 'en' ? 'Values 1 to 9 per position' : 'Valores 1 al 9 por posición'}
          </span>
        </div>

        {interactive && onChange && Object.keys(values).length > 0 && (
          <button
            type="button"
            onClick={handleClearPitch}
            className="text-[11px] font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
            title={t.step4.clearPitch}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.step4.clearPitch}</span>
          </button>
        )}
      </div>

      {/* Football Pitch Stage */}
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-red-500 shadow-md select-none">
        {/* SVG Football Turf with authentic markings */}
        <div className="relative w-full aspect-[16/10] bg-[#438a35]">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 800 500"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Pattern for alternating grass stripes */}
              <pattern id="grassStripes" width="80" height="500" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="40" height="500" fill="#448b36" />
                <rect x="40" y="0" width="40" height="500" fill="#4ea03e" />
              </pattern>
            </defs>

            {/* Grass Stripes Fill */}
            <rect x="0" y="0" width="800" height="500" fill="url(#grassStripes)" />

            {/* Field Outer Boundary Line */}
            <rect
              x="20"
              y="20"
              width="760"
              height="460"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />

            {/* Halfway Line */}
            <line
              x1="400"
              y1="20"
              x2="400"
              y2="480"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />

            {/* Center Circle */}
            <circle
              cx="400"
              cy="250"
              r="68"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />
            {/* Center Spot */}
            <circle cx="400" cy="250" r="4" fill="#ffffff" fillOpacity="0.9" />

            {/* LEFT PENALTY BOX */}
            <rect
              x="20"
              y="105"
              width="130"
              height="290"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />
            {/* Left 6-Yard Box */}
            <rect
              x="20"
              y="175"
              width="45"
              height="150"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />
            {/* Left Penalty Spot */}
            <circle cx="95" cy="250" r="3.5" fill="#ffffff" fillOpacity="0.9" />
            {/* Left Penalty Arc */}
            <path
              d="M 150,210 A 68 68 0 0 1 150,290"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />
            {/* Left Goal Post Net */}
            <rect
              x="8"
              y="195"
              width="12"
              height="110"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeOpacity="0.8"
            />

            {/* RIGHT PENALTY BOX */}
            <rect
              x="650"
              y="105"
              width="130"
              height="290"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />
            {/* Right 6-Yard Box */}
            <rect
              x="735"
              y="175"
              width="45"
              height="150"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />
            {/* Right Penalty Spot */}
            <circle cx="705" cy="250" r="3.5" fill="#ffffff" fillOpacity="0.9" />
            {/* Right Penalty Arc */}
            <path
              d="M 650,210 A 68 68 0 0 0 650,290"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />
            {/* Right Goal Post Net */}
            <rect
              x="780"
              y="195"
              width="12"
              height="110"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeOpacity="0.8"
            />

            {/* Corner Arcs */}
            <path d="M 20,35 A 15 15 0 0 0 35,20" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.85" />
            <path d="M 20,465 A 15 15 0 0 1 35,480" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.85" />
            <path d="M 780,35 A 15 15 0 0 1 765,20" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.85" />
            <path d="M 780,465 A 15 15 0 0 0 765,480" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.85" />

            {/* Sporty Watermark formation text in bottom right (matching user's screenshot) */}
            <text
              x="760"
              y="468"
              textAnchor="end"
              fontFamily="'Teko', 'Impact', sans-serif"
              fontSize={(watermarkText || systemTitle).length > 7 ? "40" : "46"}
              fontWeight="900"
              fill="#ffffff"
              stroke="#111827"
              strokeWidth="2.5"
              paintOrder="stroke fill"
              letterSpacing="1.5"
            >
              {watermarkText || systemTitle}
            </text>
          </svg>

          {/* Interactive Player Position Circles Overlay */}
          {positions.map((pos) => {
            const val = values[pos.id];
            const isFilled = val !== undefined && val !== null;
            const isCurrentActive = activePosId === pos.id;

            return (
              <div
                key={pos.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-auto"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {/* Circle with WHITE INTERIOR and RED BORDER */}
                <button
                  type="button"
                  disabled={!interactive}
                  onClick={() => setActivePosId(isCurrentActive ? null : pos.id)}
                  title={`${pos.name} (${pos.role}) - Pulsa para asignar número del 1 al 9`}
                  className={`relative ${
                    interactive
                      ? 'w-7 h-7 sm:w-8 sm:h-8 border-2'
                      : 'w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] border-[1.5px]'
                  } rounded-full bg-white transition-all flex items-center justify-center shadow-2xs ${
                    isCurrentActive
                      ? 'border-red-600 ring-4 ring-red-400/50 scale-110 z-30 shadow-md'
                      : isFilled
                      ? 'border-red-600 ring-1 ring-red-600/30'
                      : 'border-red-600 hover:border-red-700'
                  } ${interactive ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                >
                  {/* Inside number 1-9 (Player choice/preference) */}
                  {isFilled ? (
                    <span
                      className={`font-black text-red-600 leading-none select-none text-center flex items-center justify-center ${
                        interactive ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-[12px]'
                      }`}
                    >
                      {val}
                    </span>
                  ) : (
                    <span
                      className={`font-bold text-slate-300 select-none leading-none flex items-center justify-center ${
                        interactive ? 'text-[10px] sm:text-xs group-hover:text-red-400' : 'text-[9px]'
                      }`}
                    >
                      -
                    </span>
                  )}
                </button>

                {/* Role label badge below circle */}
                <span
                  className={`mt-0.5 px-1 py-0 rounded font-black bg-slate-950/90 text-white border border-white/20 whitespace-nowrap shadow-2xs pointer-events-none leading-tight tracking-tight ${
                    interactive ? 'text-[7.5px] sm:text-[8px]' : 'text-[6.5px] sm:text-[7.5px]'
                  }`}
                >
                  {pos.role}
                </span>

                {/* Direct Inline input if focused or editing */}
                {interactive && (
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[1-9]*"
                    maxLength={1}
                    value={val ?? ''}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^1-9]/g, '').slice(-1);
                      handleSetNumber(pos.id, clean ? parseInt(clean, 10) : null);
                    }}
                    onFocus={() => setActivePosId(pos.id)}
                    aria-label={`Posición ${pos.role} - número del 1 al 9`}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Popover Selector (Numbers 1-9 and clear) when a circle is clicked */}
        {interactive && activePosId && activePosition && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border-2 border-red-500 shadow-2xl flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150 max-w-[94%]">
            <div className="flex items-center justify-between w-full gap-2 px-1 text-xs">
              <span className="font-bold text-slate-900">
                {language === 'en' ? 'Position:' : 'Posición:'}{' '}
                <span className="text-red-600">{translatePosition(activePosition.name)}</span> ({activePosition.role})
              </span>
              <span className="text-[11px] text-slate-500">
                {language === 'en' ? 'Select (1 to 9):' : 'Selecciona (1 al 9):'}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const isSelected = values[activePosId] === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSetNumber(activePosId, num)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-black text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-300'
                        : 'bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-700 border border-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handleSetNumber(activePosId, null)}
                className="px-2 h-7 sm:h-8 rounded-lg font-bold text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                title={language === 'en' ? 'Remove number from this position' : 'Quitar número de esta posición'}
              >
                {language === 'en' ? 'Clear' : 'Borrar'}
              </button>

              <button
                type="button"
                onClick={() => setActivePosId(null)}
                className="px-2 h-7 sm:h-8 rounded-lg font-bold text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Done' : 'Listo'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Caption instruction */}
      {interactive ? (
        <p className="text-[11px] text-slate-500 text-center">
          {language === 'en'
            ? 'Click on any white circle with a red border to enter or choose a number from 1 to 9.'
            : 'Clica en cualquier círculo blanco con borde rojo para escribir o elegir un número del 1 al 9.'}
        </p>
      ) : (
        <p className="text-[10px] text-slate-400 text-center">
          {language === 'en'
            ? 'Positions and tactical preference order (1 = Peak performance)'
            : 'Posiciones y orden de preferencia táctica (1 = Máximo rendimiento)'}
        </p>
      )}
    </div>
  );
};
