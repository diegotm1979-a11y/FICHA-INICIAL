import React, { useRef, useState } from 'react';
import { PlayerData } from '../types';
import { exportSinglePlayerToCSV } from '../utils/export';
import { downloadElementAsPdf, safePrint } from '../utils/pdfExport';
import { getClubProfile } from '../utils/storage';
import { TacticalSystemSection } from './TacticalSystemSection';
import {
  Printer,
  Download,
  User,
  Shield,
  Activity,
  Target,
  Sparkles,
  Compass,
  Trophy,
  Calendar,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface PlayerPrintableCardProps {
  player: PlayerData;
  onClose?: () => void;
  showActions?: boolean;
}

export const PlayerPrintableCard: React.FC<PlayerPrintableCardProps> = ({
  player,
  onClose,
  showActions = true,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const clubProfile = getClubProfile();

  const handleDownloadPdf = async () => {
    if (!cardContentRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    const safeName = player.fullName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Ficha_Oficial_${safeName}.pdf`;

    const success = await downloadElementAsPdf(cardContentRef.current, filename, 'portrait');
    setIsGeneratingPdf(false);

    if (success) {
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } else {
      safePrint();
    }
  };

  return (
    <div className="bg-white text-slate-900 rounded-2xl border-2 border-red-500 print:border-none p-5 sm:p-8 max-w-4xl mx-auto space-y-6 shadow-sm">
      {/* Top Action Bar (hidden in print) */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 print:hidden no-print">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              Dossier Oficial de Jugador
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {player.submittedAt ? new Date(player.submittedAt).toLocaleDateString('es-ES') : 'Borrador'}
            </span>
            {pdfSuccess && (
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ¡PDF Descargado!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="print-card-btn"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                isGeneratingPdf
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300'
              }`}
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-red-600" />
                  <span>Descargar PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="csv-single-player-btn"
              onClick={() => exportSinglePlayerToCSV(player)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Excel</span>
            </button>

            {onClose && (
              <button
                type="button"
                id="close-player-card-btn"
                onClick={onClose}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Printable Report Section with cardContentRef */}
      <div ref={cardContentRef} id={`player-card-${player.id || 'current'}`} className="space-y-4 sm:space-y-5 bg-white">
        {/* Official Club Header (always visible in print and view) */}
        <div data-avoid-break="true" className="flex items-center justify-between pb-3 border-b border-slate-200 print-avoid-break break-inside-avoid">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white shadow-sm overflow-hidden p-1">
            {clubProfile.crestUrl ? (
              <img
                src={clubProfile.crestUrl}
                alt={clubProfile.clubName}
                className="w-full h-full object-contain bg-white rounded-lg p-0.5"
              />
            ) : (
              <Shield className="w-6 h-6 stroke-[2.2]" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              {clubProfile.clubName || 'Ficha Inicial de Temporada'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {clubProfile.subheading}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
          Informe Técnico Oficial
        </span>
      </div>

      {/* Header Profile Banner */}
      <div data-avoid-break="true" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 print-avoid-break break-inside-avoid">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 font-mono text-2xl sm:text-3xl font-extrabold shrink-0">
            {player.dorsal ? `#${player.dorsal}` : <User className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {player.fullName || 'Nombre no especificado'}
              </h2>
              {player.nickname && (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  "{player.nickname}"
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-600 mt-0.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-red-600" />
              {player.position || 'Posición no definida'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Tel: {player.phone || '-'} · Email: {player.email || '-'}
            </p>
          </div>
        </div>

        {/* Highlight Score Pill */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Nivel de Ilusión</span>
            <div className="text-2xl sm:text-3xl font-black text-red-600">
              {player.illusionScore}<span className="text-xs font-normal text-slate-500">/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        {/* Entorno y Familia */}
        <div data-avoid-break="true" className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 print-avoid-break break-inside-avoid">
          <div className="flex items-center gap-2 font-bold text-red-700 text-sm">
            <User className="w-4 h-4 text-red-600" />
            <span>Entorno y Situación Personal</span>
          </div>
          <div className="space-y-1 text-slate-800">
            <p>
              <strong>¿Tiene pareja?:</strong>{' '}
              {player.hasPartner === null ? (
                'No indicado'
              ) : player.hasPartner ? (
                <span className="text-emerald-600 font-bold">Sí</span>
              ) : (
                <span className="text-red-600 font-bold">No</span>
              )}
            </p>
            <p>
              <strong>Hijos:</strong>{' '}
              {player.childrenCount === 0
                ? '0'
                : `${player.childrenCount === 3 ? '3 o más' : player.childrenCount} (${player.childrenAges || 'Edades no indicadas'})`}
            </p>
          </div>
        </div>

        {/* Ayudas Externas */}
        <div data-avoid-break="true" className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 print-avoid-break break-inside-avoid">
          <div className="flex items-center gap-2 font-bold text-red-700 text-sm">
            <Activity className="w-4 h-4 text-red-600" />
            <span>Ayudas y Profesionales Externos</span>
          </div>
          <div className="text-slate-800">
            {player.externalHelps.length === 0 ? (
              <span className="text-slate-500 italic">Ninguna reportada</span>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {player.externalHelps.map((h) => (
                  <span
                    key={h}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-800 border border-red-200"
                  >
                    {h === 'Otros' && player.externalHelpOther ? `Otros: ${player.externalHelpOther}` : h}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ABP Rol Ofensivo y Defensivo */}
        <div data-avoid-break="true" className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 md:col-span-2 print-avoid-break break-inside-avoid">
          <div className="flex items-center gap-2 font-bold text-red-700 text-sm">
            <Target className="w-4 h-4 text-red-600" />
            <span>Acciones a Balón Parado (ABP)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-500 block">Lanzador faltas/córners</span>
              <strong className={player.abpOffensiveFoulsCorners ? 'text-emerald-600' : 'text-red-600'}>
                {player.abpOffensiveFoulsCorners ? 'Sí' : 'No'}
              </strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-500 block">Rematador área</span>
              <strong className={player.abpOffensiveHeader ? 'text-emerald-600' : 'text-red-600'}>
                {player.abpOffensiveHeader ? 'Sí' : 'No'}
              </strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-500 block">Memoriza jugadas</span>
              <strong className={player.abpMemorizePlays ? 'text-emerald-600' : 'text-red-600'}>
                {player.abpMemorizePlays ? 'Sí' : 'No'}
              </strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-500 block">Marcaje hombre</span>
              <strong className={player.abpDefensiveManMarking ? 'text-slate-800' : 'text-red-600'}>
                {player.abpDefensiveManMarking ? 'Sí' : 'No'}
              </strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-500 block">Defensa en zona</span>
              <strong className={player.abpDefensiveZone ? 'text-slate-800' : 'text-red-600'}>
                {player.abpDefensiveZone ? 'Sí' : 'No'}
              </strong>
            </div>
          </div>
        </div>

        {/* Psicología y Rasgos */}
        <div data-avoid-break="true" className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 print-avoid-break break-inside-avoid">
          <div className="flex items-center gap-2 font-bold text-red-700 text-sm">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>Personalidad y Mentalidad</span>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block">Rasgos positivos:</span>
              <p className="text-slate-800">{player.positivePersonalityTraits || '-'}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Aspectos a mejorar:</span>
              <p className="text-slate-800">{player.personalityImprovementTraits || '-'}</p>
            </div>
          </div>
        </div>

        {/* Aspecto Técnico-Táctico */}
        <div data-avoid-break="true" className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 print-avoid-break break-inside-avoid">
          <div className="flex items-center gap-2 font-bold text-red-700 text-sm">
            <Shield className="w-4 h-4 text-red-600" />
            <span>Perfil Técnico-Táctico</span>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block">En lo que destaca:</span>
              <p className="text-slate-800">{player.tacticalStrengths || '-'}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">A mejorar esta temporada:</span>
              <p className="text-slate-800">{player.tacticalImprovements || '-'}</p>
            </div>
          </div>
        </div>

        {/* Posicionamiento en Sistemas Tácticos (1-4-1-4-1 y 1-3-2-3-2) */}
        <div data-avoid-break="true" className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 md:col-span-2 print-avoid-break break-inside-avoid">
          <TacticalSystemSection
            system4141Values={player.tacticalSystem4141 || {}}
            system13232Values={player.tacticalSystem13232 || {}}
            interactive={false}
          />
        </div>

        {/* Compromiso y Hábitos */}
        <div data-avoid-break="true" className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 md:col-span-2 print-avoid-break break-inside-avoid">
          <div className="flex items-center gap-2 font-bold text-red-700 text-sm">
            <Compass className="w-4 h-4 text-red-600" />
            <span>Métricas de Compromiso y Hábitos (Escala 0 a 10)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-500 block">No titular</span>
              <strong className="text-base text-red-600">{player.commitmentNotStarting}/10</strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-500 block">Sustituido</span>
              <strong className="text-base text-red-600">{player.commitmentSubstituted}/10</strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-500 block">Campo</span>
              <strong className="text-base text-red-600">{player.likePitchTraining}/10</strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-500 block">Gimnasio</span>
              <strong className="text-base text-red-600">{player.likeGymWork}/10</strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-500 block">Cuidado pers.</span>
              <strong className="text-base text-red-600">{player.likeSelfCare}/10</strong>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-500 block">Físico previo</span>
              <strong className="text-base text-red-600">{player.physicalPreparationScore}/10</strong>
            </div>
          </div>
        </div>

        {/* Metas e Inspiración */}
        <div data-avoid-break="true" className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 md:col-span-2 print-avoid-break break-inside-avoid">
          <div className="flex items-center gap-2 font-bold text-red-700 text-sm">
            <Trophy className="w-4 h-4 text-red-600" />
            <span>Metas e Inspiración</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block">Objetivo Individual:</span>
              <p className="text-slate-800">{player.individualGoal || '-'}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Objetivo Colectivo:</span>
              <p className="text-slate-800">{player.collectiveGoal || '-'}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Referente deportivo:</span>
              <p className="text-slate-800 font-semibold">{player.favoriteAthleteReferent || '-'}</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
