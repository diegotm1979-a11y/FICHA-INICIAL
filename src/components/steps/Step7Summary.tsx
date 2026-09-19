import React from 'react';
import { PlayerData, FormStep } from '../../types';
import { TacticalSystemSection } from '../TacticalSystemSection';
import {
  User,
  Activity,
  Target,
  Sparkles,
  Compass,
  Trophy,
  Edit3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Step7Props {
  data: PlayerData;
  onGoToStep: (step: FormStep) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const Step7Summary: React.FC<Step7Props> = ({
  data,
  onGoToStep,
  onSubmit,
  isSubmitting = false,
}) => {
  const { t, language, translatePosition, translateExternalHelp } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-red-600" />
          {t.step7.title}
        </h3>
      </div>

      {/* BLOQUE 1: DATOS PERSONALES */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm sm:text-base">
            <User className="w-4 h-4 text-red-600" />
            <span>{t.stepsMeta.step1.title}</span>
          </div>
          <button
            type="button"
            id="summary-edit-step-1"
            onClick={() => onGoToStep(1)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors p-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.step7.edit}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-xs text-slate-500 block">{t.step1.fullName}</span>
            <span className="font-semibold text-slate-900">{data.fullName || '-'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">
              {language === 'en' ? 'Nickname / Dorsal / Position' : 'Apodo / Dorsal / Posición'}
            </span>
            <span className="font-semibold text-slate-900">
              {data.nickname ? `"${data.nickname}"` : '-'}
              {data.dorsal ? ` · #${data.dorsal}` : ''}
              {data.position ? ` · ${translatePosition(data.position)}` : ''}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">
              {language === 'en' ? 'Phone and Email' : 'Teléfono y Correo'}
            </span>
            <span className="text-slate-800 block truncate">{data.phone}</span>
            <span className="text-slate-500 text-xs truncate block">{data.email}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">{t.step1.partnerQuestion}</span>
            <span className="font-semibold text-slate-800">
              {data.hasPartner === null ? (
                t.step7.notSpecified
              ) : data.hasPartner ? (
                <span className="text-emerald-600">{t.common.yes}</span>
              ) : (
                <span className="text-red-600">{t.common.no}</span>
              )}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">{t.step1.childrenQuestion}</span>
            <span className="font-semibold text-slate-800">
              {t.step7.childrenFormat(data.childrenCount, data.childrenAges)}
            </span>
          </div>
        </div>
      </div>

      {/* BLOQUE 2: AYUDAS EXTERNAS */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm sm:text-base">
            <Activity className="w-4 h-4 text-red-600" />
            <span>{t.stepsMeta.step2.title}</span>
          </div>
          <button
            type="button"
            id="summary-edit-step-2"
            onClick={() => onGoToStep(2)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors p-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.step7.edit}</span>
          </button>
        </div>

        <div>
          <span className="text-xs text-slate-500 block mb-1.5">{t.step2.subtitle}:</span>
          {data.externalHelps.length === 0 ? (
            <span className="text-sm text-slate-500 italic">{t.step7.externalHelpNone}</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.externalHelps.map((h) => (
                <span
                  key={h}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-800 border border-red-200"
                >
                  {h === 'Otros' && data.externalHelpOther
                    ? `${translateExternalHelp('Otros')}: ${data.externalHelpOther}`
                    : translateExternalHelp(h)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BLOQUE 3: ACCIONES A BALÓN PARADO (ABP) */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm sm:text-base">
            <Target className="w-4 h-4 text-red-600" />
            <span>{t.stepsMeta.step3.title}</span>
          </div>
          <button
            type="button"
            id="summary-edit-step-3"
            onClick={() => onGoToStep(3)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors p-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.step7.edit}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="text-slate-500 text-xs block">{t.step3.foulsCorners}:</span>
            <span className={`font-bold ${data.abpOffensiveFoulsCorners ? 'text-emerald-600' : 'text-red-600'}`}>
              {data.abpOffensiveFoulsCorners ? t.common.yes : t.common.no}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="text-slate-500 text-xs block">{t.step3.header}:</span>
            <span className={`font-bold ${data.abpOffensiveHeader ? 'text-emerald-600' : 'text-red-600'}`}>
              {data.abpOffensiveHeader ? t.common.yes : t.common.no}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="text-slate-500 text-xs block">{t.step3.memorizePlays}:</span>
            <span className={`font-bold ${data.abpMemorizePlays ? 'text-emerald-600' : 'text-red-600'}`}>
              {data.abpMemorizePlays ? t.common.yes : t.common.no}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="text-slate-500 text-xs block">{t.step3.manMarking}:</span>
            <span className={`font-bold ${data.abpDefensiveManMarking ? 'text-slate-800' : 'text-red-600'}`}>
              {data.abpDefensiveManMarking ? t.common.yes : t.common.no}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="text-slate-500 text-xs block">{t.step3.zonalDefense}:</span>
            <span className={`font-bold ${data.abpDefensiveZone ? 'text-slate-800' : 'text-red-600'}`}>
              {data.abpDefensiveZone ? t.common.yes : t.common.no}
            </span>
          </div>
        </div>
      </div>

      {/* BLOQUE 4: PSICOLOGÍA Y ANÁLISIS TÁCTICO */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm sm:text-base">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>{t.stepsMeta.step4.title}</span>
          </div>
          <button
            type="button"
            id="summary-edit-step-4"
            onClick={() => onGoToStep(4)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors p-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.step7.edit}</span>
          </button>
        </div>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">{t.step4.illusionLabel}:</span>
            <span className="px-2 py-0.5 rounded-md font-bold bg-red-100 text-red-700 text-xs">
              {data.illusionScore} / 10
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">{t.step4.positiveTraits}:</span>
            <p className="text-slate-800 mt-0.5 text-xs sm:text-sm">{data.positivePersonalityTraits || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">{t.step4.improvementTraits}:</span>
            <p className="text-slate-800 mt-0.5 text-xs sm:text-sm">{data.personalityImprovementTraits || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">{t.step4.tacticalStrengths}:</span>
            <p className="text-slate-800 mt-0.5 text-xs sm:text-sm">{data.tacticalStrengths || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">{t.step4.tacticalImprovements}:</span>
            <p className="text-slate-800 mt-0.5 text-xs sm:text-sm">{data.tacticalImprovements || '-'}</p>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <TacticalSystemSection
              system4141Values={data.tacticalSystem4141 || {}}
              system13232Values={data.tacticalSystem13232 || {}}
              interactive={false}
            />
          </div>
        </div>
      </div>

      {/* BLOQUE 5: COMPROMISO Y HÁBITOS */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm sm:text-base">
            <Compass className="w-4 h-4 text-red-600" />
            <span>{t.stepsMeta.step5.title}</span>
          </div>
          <button
            type="button"
            id="summary-edit-step-5"
            onClick={() => onGoToStep(5)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors p-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.step7.edit}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs sm:text-sm">
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-500 text-xs block">{t.step5.notStarting}:</span>
            <span className="font-bold text-red-600 text-base">{data.commitmentNotStarting}/10</span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-500 text-xs block">{t.step5.substituted}:</span>
            <span className="font-bold text-red-600 text-base">{data.commitmentSubstituted}/10</span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-500 text-xs block">{t.step5.pitchTraining}:</span>
            <span className="font-bold text-red-600 text-base">{data.likePitchTraining}/10</span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-500 text-xs block">{t.step5.gymWork}:</span>
            <span className="font-bold text-red-600 text-base">{data.likeGymWork}/10</span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-500 text-xs block">{t.step5.selfCare}:</span>
            <span className="font-bold text-red-600 text-base">{data.likeSelfCare}/10</span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-500 text-xs block">{t.step5.physicalScore}:</span>
            <span className="font-bold text-red-600 text-base">{data.physicalPreparationScore}/10</span>
          </div>
        </div>
      </div>

      {/* BLOQUE 6: METAS E INSPIRACIÓN */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm sm:text-base">
            <Trophy className="w-4 h-4 text-red-600" />
            <span>{t.stepsMeta.step6.title}</span>
          </div>
          <button
            type="button"
            id="summary-edit-step-6"
            onClick={() => onGoToStep(6)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors p-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.step7.edit}</span>
          </button>
        </div>

        <div className="space-y-2 text-xs sm:text-sm">
          <div>
            <span className="text-slate-500 text-xs block">{t.step6.individualGoal}:</span>
            <p className="text-slate-800 mt-0.5 text-xs sm:text-sm">{data.individualGoal || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">{t.step6.collectiveGoal}:</span>
            <p className="text-slate-800 mt-0.5 text-xs sm:text-sm">{data.collectiveGoal || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">{t.step6.referent}:</span>
            <p className="text-slate-800 mt-0.5 font-semibold text-xs sm:text-sm">{data.favoriteAthleteReferent || '-'}</p>
          </div>
        </div>
      </div>

      {/* Final submission card */}
      <div className="p-5 bg-red-50/60 border-2 border-red-500 rounded-2xl space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              {language === 'en'
                ? 'Ready to submit your profile to the coaching staff?'
                : '¿Listo para enviar tu ficha al cuerpo técnico?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.step7.disclaimer}
            </p>
          </div>
        </div>

        <button
          type="button"
          id="final-submit-button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="w-full min-h-[52px] px-6 py-3.5 rounded-xl text-white font-extrabold text-base bg-red-600 hover:bg-red-700 active:scale-[0.99] transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{isSubmitting ? t.step7.submittingBtn : t.step7.submitBtn}</span>
        </button>
      </div>
    </div>
  );
};
