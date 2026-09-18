import React from 'react';
import { PlayerData } from '../../types';
import { Trophy, Target, Users, Star } from 'lucide-react';

interface Step6Props {
  data: PlayerData;
  onChange: (fields: Partial<PlayerData>) => void;
  errors: Record<string, string>;
}

export const Step6Goals: React.FC<Step6Props> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-red-600" />
          Metas e Inspiración
        </h3>
      </div>

      {/* Objetivo individual */}
      <div className="space-y-2">
        <label htmlFor="individualGoal" className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Target className="w-4 h-4 text-red-600" />
          Objetivo individual para la temporada <span className="text-red-600">*</span>
        </label>
        <textarea
          id="individualGoal"
          name="individualGoal"
          rows={3}
          value={data.individualGoal}
          onChange={(e) => onChange({ individualGoal: e.target.value })}
          placeholder="Ej. Consolidarme en el once inicial, superar mi marca de 10 asistencias y ser más regular los 90 minutos..."
          className={`w-full p-3.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all resize-none shadow-2xs ${
            errors.individualGoal
              ? 'border-red-500 focus:ring-red-500/30'
              : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
          }`}
        />
        {errors.individualGoal && (
          <p className="text-xs text-red-600 font-medium">{errors.individualGoal}</p>
        )}
      </div>

      {/* Objetivo colectivo */}
      <div className="space-y-2">
        <label htmlFor="collectiveGoal" className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-red-600" />
          Objetivo colectivo para la temporada <span className="text-red-600">*</span>
        </label>
        <textarea
          id="collectiveGoal"
          name="collectiveGoal"
          rows={3}
          value={data.collectiveGoal}
          onChange={(e) => onChange({ collectiveGoal: e.target.value })}
          placeholder="Ej. Clasificarnos para la fase de ascenso, ser el equipo más solidario de la liga y hacernos invencibles en casa..."
          className={`w-full p-3.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all resize-none shadow-2xs ${
            errors.collectiveGoal
              ? 'border-red-500 focus:ring-red-500/30'
              : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
          }`}
        />
        {errors.collectiveGoal && (
          <p className="text-xs text-red-600 font-medium">{errors.collectiveGoal}</p>
        )}
      </div>

      {/* Jugador o deportista referente */}
      <div className="space-y-2">
        <label htmlFor="favoriteAthleteReferent" className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          Jugador y/o deportista favorito / referente <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="favoriteAthleteReferent"
          name="favoriteAthleteReferent"
          value={data.favoriteAthleteReferent}
          onChange={(e) => onChange({ favoriteAthleteReferent: e.target.value })}
          placeholder="Ej. Luka Modrić, Carles Puyol, Rafa Nadal, Kobe Bryant..."
          className={`w-full min-h-[48px] px-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-2xs ${
            errors.favoriteAthleteReferent
              ? 'border-red-500 focus:ring-red-500/30'
              : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
          }`}
        />
        {errors.favoriteAthleteReferent && (
          <p className="text-xs text-red-600 font-medium">{errors.favoriteAthleteReferent}</p>
        )}
      </div>
    </div>
  );
};
