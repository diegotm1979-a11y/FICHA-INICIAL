import React, { useState, useRef } from 'react';
import { PlayerData } from '../types';
import { getClubProfile } from '../utils/storage';
import { PlayerPrintableCard } from './PlayerPrintableCard';
import { downloadElementAsPdf, safePrint } from '../utils/pdfExport';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  Printer,
  X,
  Shield,
  Sparkles,
  Target,
  Calendar,
  HelpCircle,
  Download,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface SquadPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: PlayerData[];
}

export const SquadPdfModal: React.FC<SquadPdfModalProps> = ({
  isOpen,
  onClose,
  players,
}) => {
  const { t, language, translatePosition } = useLanguage();
  const [exportMode, setExportMode] = useState<'roster' | 'dossier'>('roster');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);
  const printableAreaRef = useRef<HTMLDivElement>(null);
  const clubProfile = getClubProfile();

  if (!isOpen) return null;

  const totalPlayers = players.length;
  const avgIllusion = totalPlayers
    ? (players.reduce((acc, p) => acc + (p.illusionScore || 0), 0) / totalPlayers).toFixed(1)
    : '0';
  const avgCommitment = totalPlayers
    ? (players.reduce((acc, p) => acc + (p.commitmentNotStarting || 0), 0) / totalPlayers).toFixed(1)
    : '0';
  const avgFitness = totalPlayers
    ? (players.reduce((acc, p) => acc + (p.physicalPreparationScore || 0), 0) / totalPlayers).toFixed(1)
    : '0';

  const freeKickTakers = players.filter((p) => p.abpOffensiveFoulsCorners).length;
  const headerThreats = players.filter((p) => p.abpOffensiveHeader).length;
  const zoneDefenders = players.filter((p) => p.abpDefensiveZone).length;
  const manMarkers = players.filter((p) => p.abpDefensiveManMarking).length;

  const handleDownloadPdf = async () => {
    if (!printableAreaRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setPdfSuccessMessage(null);

    const clubSlug = (clubProfile.clubName || 'Club').replace(/[^a-zA-Z0-9_-]/g, '_');
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename =
      exportMode === 'roster'
        ? `${clubSlug}_Roster_Plantilla_${dateStr}.pdf`
        : `${clubSlug}_Dossier_Fichas_${dateStr}.pdf`;
    const orientation = exportMode === 'roster' ? 'landscape' : 'portrait';

    const success = await downloadElementAsPdf(printableAreaRef.current, filename, orientation);

    setIsGeneratingPdf(false);
    if (success) {
      setPdfSuccessMessage(
        language === 'en'
          ? `PDF generated and downloaded successfully! File: ${filename}`
          : `¡PDF generado y descargado con éxito! Archivo: ${filename}`
      );
      setTimeout(() => setPdfSuccessMessage(null), 5000);
    } else {
      setPdfSuccessMessage(
        language === 'en'
          ? 'Opening browser print dialog...'
          : 'Iniciando diálogo de impresión...'
      );
      safePrint();
      setTimeout(() => setPdfSuccessMessage(null), 3000);
    }
  };

  const handlePrint = () => {
    const ok = safePrint();
    if (!ok) {
      handleDownloadPdf();
    }
  };

  const formattedDate = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:static print:p-0 print:m-0 print:w-full print:bg-white print:overflow-visible">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-red-500 shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 print:max-h-none print:h-auto print:border-none print:shadow-none print:rounded-none print:overflow-visible">
        {/* Top Modal Controls (NO PRINT) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {language === 'en' ? 'Export Squad to PDF' : 'Exportar Plantilla a PDF'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'en'
                  ? 'Configure and download official squad report in PDF format'
                  : 'Configura y descarga el documento oficial de toda la plantilla en formato PDF'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setExportMode('roster')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  exportMode === 'roster'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {language === 'en' ? 'Summary Roster' : 'Roster Resumen'}
              </button>
              <button
                type="button"
                onClick={() => setExportMode('dossier')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  exportMode === 'dossier'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {language === 'en' ? `Full Dossier (${totalPlayers} Cards)` : `Dossier Completo (${totalPlayers} Fichas)`}
              </button>
            </div>

            {/* Print/Save to PDF Main Button */}
            <button
              type="button"
              id="squad-confirm-pdf-btn"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer ${
                isGeneratingPdf
                  ? 'bg-slate-700 cursor-not-allowed text-slate-300'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
              }`}
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>{language === 'en' ? 'Generating and downloading PDF...' : 'Generando y descargando PDF...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{language === 'en' ? 'Download PDF' : 'Descargar PDF en mi ordenador'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="squad-native-print-btn"
              onClick={handlePrint}
              disabled={isGeneratingPdf}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title={language === 'en' ? 'Open native print dialog' : 'Abrir vista de impresión directa del navegador'}
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'en' ? 'Print' : 'Imprimir'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title={t.common.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Download feedback toast banner */}
        {pdfSuccessMessage && (
          <div className="no-print bg-emerald-600 text-white px-5 py-2 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{pdfSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setPdfSuccessMessage(null)}
              className="text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Informative helper banner (NO PRINT) */}
        <div className="no-print bg-red-50 border-b border-red-200 px-5 py-2.5 text-xs text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>{language === 'en' ? 'Direct PDF Download:' : 'Descarga directa a PDF:'}</strong>{' '}
              {language === 'en'
                ? 'Click "Download PDF" to immediately generate and save the official PDF document.'
                : 'Pulsa «Descargar PDF en mi ordenador» para generar y descargar inmediatamente el archivo PDF oficial con los datos del club en tu carpeta de descargas.'}
            </span>
          </div>
          <span className="text-[11px] font-bold text-red-700 bg-red-100/60 px-2.5 py-0.5 rounded-md self-start sm:self-auto">
            {exportMode === 'roster'
              ? language === 'en'
                ? 'Consolidated Roster Mode (A4 Landscape)'
                : 'Modo Roster Consolidado (A4 Horizontal)'
              : language === 'en'
              ? 'Detailed Dossier Mode (A4 Portrait)'
              : 'Modo Fichas Detalladas (A4 Vertical)'}
          </span>
        </div>

        {/* Scrollable Printable Document Content */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-white text-slate-900 print:p-0 print:overflow-visible">
          <div ref={printableAreaRef} id="squad-printable-document" className="w-full bg-white text-slate-900">
            {/* MODE 1: ROSTER RESUMEN EJECUTIVO */}
            {exportMode === 'roster' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {/* Club Header */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-red-600">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white shadow-sm overflow-hidden p-1.5">
                      {clubProfile.crestUrl ? (
                        <img
                          src={clubProfile.crestUrl}
                          alt={clubProfile.clubName}
                          className="w-full h-full object-contain bg-white rounded-xl p-0.5"
                        />
                      ) : (
                        <Shield className="w-8 h-8 stroke-[2.2]" />
                      )}
                    </div>
                    <div>
                      <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                        {clubProfile.clubName || (language === 'en' ? 'Initial Season Form' : 'Ficha Inicial de Temporada')}
                      </h1>
                      <p className="text-xs text-slate-500 font-medium">
                        {clubProfile.subheading}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-50 text-red-700 border border-red-200">
                      {language === 'en' ? 'Official Squad Report' : 'Informe Oficial de Plantilla'}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-end gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Statistical Summary Strip */}
                <div className="grid grid-cols-4 gap-3 print-break-inside-avoid">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {language === 'en' ? 'Total Squad' : 'Efectivos Totales'}
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      {totalPlayers}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {language === 'en' ? 'players' : 'jugadores'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {t.staffDashboard.avgIllusion}
                    </span>
                    <span className="text-2xl font-black text-red-600">
                      {avgIllusion}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {language === 'en' ? 'out of 10' : 'sobre 10'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {language === 'en' ? 'Bench Commitment' : 'Compromiso Suplencia'}
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      {avgCommitment}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {language === 'en' ? 'out of 10' : 'sobre 10'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {language === 'en' ? 'Initial Fitness' : 'Prep. Física Previa'}
                    </span>
                    <span className="text-2xl font-black text-red-600">
                      {avgFitness}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {language === 'en' ? 'out of 10' : 'sobre 10'}
                    </span>
                  </div>
                </div>

                {/* ABP Indicators Overview */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-around text-xs font-semibold text-slate-700 print-break-inside-avoid">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-red-600" />
                    <span>{language === 'en' ? 'Set Piece / Corner Takers:' : 'Lanzadores Faltas/Córners:'}</span>
                    <strong className="text-slate-900 font-black">{freeKickTakers}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{language === 'en' ? 'Box Headers:' : 'Rematadores Ofensivos:'}</span>
                    <strong className="text-slate-900 font-black">{headerThreats}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-slate-600" />
                    <span>{language === 'en' ? 'Zonal Defense:' : 'Defensa en Zona:'}</span>
                    <strong className="text-slate-900 font-black">{zoneDefenders}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-red-600" />
                    <span>{language === 'en' ? 'Man Marking:' : 'Marcaje al Hombre:'}</span>
                    <strong className="text-slate-900 font-black">{manMarkers}</strong>
                  </div>
                </div>

                {/* Roster Table */}
                <div className="overflow-hidden rounded-xl border border-slate-300">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-3 text-center w-12">#</th>
                        <th className="py-2.5 px-3">{language === 'en' ? 'Player' : 'Jugador'}</th>
                        <th className="py-2.5 px-3">{language === 'en' ? 'Position' : 'Posición'}</th>
                        <th className="py-2.5 px-3">{language === 'en' ? 'Contact' : 'Contacto'}</th>
                        <th className="py-2.5 px-2 text-center">{language === 'en' ? 'Illusion' : 'Ilusión'}</th>
                        <th className="py-2.5 px-2 text-center">{language === 'en' ? 'Bench' : 'Suplencia'}</th>
                        <th className="py-2.5 px-3">{language === 'en' ? 'ABP Profile' : 'Perfil ABP'}</th>
                        <th className="py-2.5 px-3">{language === 'en' ? 'Personal Goal' : 'Objetivo Personal'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {players.map((player, idx) => (
                        <tr
                          key={player.id || idx}
                          className={`hover:bg-slate-50 transition-colors print-break-inside-avoid ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center font-black text-slate-900">
                            {player.dorsal ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-red-50 text-red-700 font-bold border border-red-200 text-xs">
                                {player.dorsal}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal">-</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{player.fullName}</div>
                            {player.nickname && (
                              <div className="text-[10px] text-red-600 font-semibold italic">
                                "{player.nickname}"
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-800">
                              {player.position ? translatePosition(player.position) : (language === 'en' ? 'Unset' : 'Sin definir')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                            <div>{player.phone || '-'}</div>
                            <div className="text-slate-400 text-[10px] truncate max-w-[120px]">
                              {player.email || ''}
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-red-600">
                            {player.illusionScore}/10
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                            {player.commitmentNotStarting}/10
                          </td>
                          <td className="py-2.5 px-3 text-[11px]">
                            <div className="flex flex-wrap gap-1">
                              {player.abpOffensiveFoulsCorners && (
                                <span className="px-1.5 py-0.5 rounded-xs bg-red-100 text-red-700 text-[9px] font-bold">
                                  {language === 'en' ? 'FK/Corner' : 'Faltas/Córner'}
                                </span>
                              )}
                              {player.abpOffensiveHeader && (
                                <span className="px-1.5 py-0.5 rounded-xs bg-amber-100 text-amber-800 text-[9px] font-bold">
                                  {language === 'en' ? 'Header' : 'Rematador'}
                                </span>
                              )}
                              {player.abpDefensiveZone && (
                                <span className="px-1.5 py-0.5 rounded-xs bg-slate-100 text-slate-700 text-[9px] font-medium">
                                  {language === 'en' ? 'Zonal' : 'Zona'}
                                </span>
                              )}
                              {player.abpDefensiveManMarking && (
                                <span className="px-1.5 py-0.5 rounded-xs bg-slate-100 text-slate-700 text-[9px] font-medium">
                                  {language === 'en' ? 'Man' : 'Hombre'}
                                </span>
                              )}
                              {!player.abpOffensiveFoulsCorners &&
                                !player.abpOffensiveHeader &&
                                !player.abpDefensiveZone &&
                                !player.abpDefensiveManMarking && (
                                  <span className="text-slate-400">-</span>
                                )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-[180px]">
                            <p className="line-clamp-2 italic">
                              {player.individualGoal ? `"${player.individualGoal}"` : '-'}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Official Signatures Box in PDF */}
                <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs text-slate-500 print-break-inside-avoid">
                  <div>
                    <div className="h-16 border-b border-dashed border-slate-300 mb-2"></div>
                    <span className="font-bold text-slate-800">
                      {language === 'en' ? 'Head Coach Signature' : 'Firma Primer Entrenador'}
                    </span>
                    <p className="text-[10px]">
                      {language === 'en' ? 'Coaching Staff' : 'Cuerpo Técnico'}
                    </p>
                  </div>
                  <div>
                    <div className="h-16 border-b border-dashed border-slate-300 mb-2"></div>
                    <span className="font-bold text-slate-800">
                      {language === 'en' ? 'Sporting Director Signature' : 'Firma Coordinación Deportiva'}
                    </span>
                    <p className="text-[10px]">
                      {language === 'en' ? 'Football Management' : 'Dirección de Fútbol'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: DOSSIER COMPLETO (ALL PLAYER CARDS WITH PAGE BREAKS) */}
            {exportMode === 'dossier' && (
              <div className="space-y-12">
                {players.map((player, idx) => (
                  <div
                    key={player.id || idx}
                    className={`${
                      idx < players.length - 1 ? 'page-break-after pb-8 border-b-2 border-slate-200 print:border-none' : ''
                    }`}
                  >
                    <PlayerPrintableCard player={player} showActions={false} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
