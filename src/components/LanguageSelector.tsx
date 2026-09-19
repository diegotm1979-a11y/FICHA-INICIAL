import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'segmented' | 'dropdown';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'segmented',
  className = '',
}) => {
  const { language, setLanguage, t } = useLanguage();

  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <label htmlFor="language-select-dropdown" className="sr-only">
          {t.common.language}
        </label>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs">
          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <select
            id="language-select-dropdown"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
            className="bg-transparent text-slate-800 font-bold text-xs focus:outline-none cursor-pointer pr-1"
          >
            <option value="es">🇪🇸 Español</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
      </div>
    );
  }

  // Segmented pill design (default)
  return (
    <div
      role="group"
      aria-label={t.common.language}
      className={`inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 shadow-2xs ${className}`}
    >
      <button
        type="button"
        id="lang-btn-es"
        onClick={() => setLanguage('es')}
        aria-pressed={language === 'es'}
        title="Cambiar idioma a Español"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
          language === 'es'
            ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 ring-1 ring-slate-950/5'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
        }`}
      >
        <span className="text-sm leading-none" role="img" aria-label="Bandera España">
          🇪🇸
        </span>
        <span className="hidden sm:inline">Español</span>
        <span className="sm:hidden font-extrabold">ES</span>
      </button>

      <button
        type="button"
        id="lang-btn-en"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        title="Switch language to English"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
          language === 'en'
            ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 ring-1 ring-slate-950/5'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
        }`}
      >
        <span className="text-sm leading-none" role="img" aria-label="UK Flag">
          🇬🇧
        </span>
        <span className="hidden sm:inline">English</span>
        <span className="sm:hidden font-extrabold">EN</span>
      </button>
    </div>
  );
};
