import React from 'react';
import { PlayerData } from '../types';
import {
  CheckCircle2,
  Plus,
  Shield,
  Sparkles,
  Award,
} from 'lucide-react';

interface SuccessViewProps {
  player: PlayerData;
  onNewForm: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  player,
  onNewForm,
}) => {
  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-8 animate-fadeIn">
      {/* Motivational Trophy Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-100 border-2 border-red-500 text-red-600 shadow-xl shadow-red-500/20 animate-bounce">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
            <Sparkles className="w-3.5 h-3.5" /> Ficha registrada con éxito
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ¡FICHA ENVIADA AL CUERPO TÉCNICO!
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed pt-1">
            Gracias, <strong className="text-slate-900">{player.fullName}</strong>. Tus respuestas han quedado registradas de forma confidencial en el sistema del cuerpo técnico.
          </p>
        </div>
      </div>

      {/* Auto-reset Notification Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Formulario en blanco:</strong> El formulario se ha restablecido automáticamente en blanco para preservar la privacidad de tus datos.
        </span>
      </div>

      {/* Printable summary container with ref */}
      {/* Summary Box */}
      <div id="success-printable-summary" className="bg-white p-2 rounded-2xl space-y-6">
        {/* Motivational Quote Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-red-50/60 border border-red-200 text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Compromiso e Ilusión</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-900 italic">
            "El talento gana partidos, pero el trabajo en equipo y el compromiso ganan campeonatos."
          </p>
          <p className="text-xs text-slate-600">
            Objetivo colectivo: <span className="text-red-700 font-semibold">"{player.collectiveGoal || 'Dar el 100% cada partido'}"</span>
          </p>
        </div>

        {/* Mini Player Summary Card */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 font-mono font-bold text-lg">
                {player.dorsal ? `#${player.dorsal}` : <Shield className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">{player.fullName}</h3>
                <p className="text-xs text-slate-500">
                  {player.position} {player.nickname ? `("${player.nickname}")` : ''}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Ilusión</span>
              <span className="text-xl font-black text-red-600">{player.illusionScore}/10</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px]">ABP Ofensivo</span>
              <span className="font-bold text-red-600">
                {player.abpOffensiveFoulsCorners ? 'Lanzador' : player.abpOffensiveHeader ? 'Rematador' : 'Apoyo'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px]">ABP Defensivo</span>
              <span className="font-bold text-slate-800">
                {player.abpDefensiveManMarking ? 'Hombre' : player.abpDefensiveZone ? 'Zona' : 'Flexible'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Compromiso</span>
              <span className="font-bold text-red-600">{player.commitmentNotStarting}/10</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Físico Previo</span>
              <span className="font-bold text-red-600">{player.physicalPreparationScore}/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          id="success-new-form-btn"
          onClick={onNewForm}
          className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Volver al formulario en blanco</span>
        </button>
      </div>
    </div>
  );
};

