import React from 'react';
import { PlayerData } from '../../types';
import { RatingSelector } from '../RatingSelector';
import { ShieldAlert, Dumbbell, Compass, Flame } from 'lucide-react';

interface Step5Props {
  data: PlayerData;
  onChange: (fields: Partial<PlayerData>) => void;
}

export const Step5Commitment: React.FC<Step5Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Compass className="w-6 h-6 text-red-600" />
          Compromiso, Hábitos y Preferencias
        </h3>
      </div>

      {/* BLOQUE 1: COMPROMISO ANTE SITUACIONES DEPORTIVAS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-red-700 font-bold text-base sm:text-lg border-b border-red-200 pb-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <h4>Gestión de Roles y Resiliencia (0 a 10)</h4>
        </div>

        <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-4">
          <RatingSelector
            id="commitment-not-starting"
            label="1. No eres titular en varios partidos seguidos"
            value={data.commitmentNotStarting}
            onChange={(val) => onChange({ commitmentNotStarting: val })}
            lowLabel="0 (Baja actitud)"
            highLabel="10 (Máximo empuje)"
          />

          <div className="border-t border-slate-200 pt-4">
            <RatingSelector
              id="commitment-substituted"
              label="2. Eres sustituido en varios partidos seguidos"
              value={data.commitmentSubstituted}
              onChange={(val) => onChange({ commitmentSubstituted: val })}
              lowLabel="0 (Frustración desmedida)"
              highLabel="10 (Compromiso y respeto total)"
            />
          </div>
        </div>
      </div>

      {/* BLOQUE 2: ¿CUÁNTO TE GUSTA? (PREFERENCIAS DE TRABAJO) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg border-b border-slate-200 pb-2">
          <Dumbbell className="w-5 h-5 text-red-600" />
          <h4>Preferencias en el Día a Día (0 a 10)</h4>
        </div>

        <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-5">
          <RatingSelector
            id="like-pitch-training"
            label="Entrenamiento en campo de fútbol"
            value={data.likePitchTraining}
            onChange={(val) => onChange({ likePitchTraining: val })}
            lowLabel="0 (Poco gusto)"
            highLabel="10 (Máximo disfrute)"
          />

          <div className="border-t border-slate-200 pt-4">
            <RatingSelector
              id="like-gym-work"
              label="Trabajo de fuerza y gimnasio"
              value={data.likeGymWork}
              onChange={(val) => onChange({ likeGymWork: val })}
              lowLabel="0 (Poco gusto)"
              highLabel="10 (Máximo disfrute)"
            />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <RatingSelector
              id="like-self-care"
              label="Cuidado personal (Entrenamiento invisible)"
              value={data.likeSelfCare}
              onChange={(val) => onChange({ likeSelfCare: val })}
              lowLabel="0 (Me cuesta mucho)"
              highLabel="10 (Muy riguroso y constante)"
            />
          </div>
        </div>
      </div>

      {/* BLOQUE 3: PREPARACIÓN PREVIA */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg border-b border-slate-200 pb-2">
          <Flame className="w-5 h-5 text-red-600" />
          <h4>Estado de Forma de Partida (0 a 10)</h4>
        </div>

        <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
          <RatingSelector
            id="physical-preparation-score"
            label="Preparación física previa a la pretemporada"
            value={data.physicalPreparationScore}
            onChange={(val) => onChange({ physicalPreparationScore: val })}
            lowLabel="0 (Inactivo total)"
            highLabel="10 (Preparación impecable)"
          />
        </div>
      </div>
    </div>
  );
};
