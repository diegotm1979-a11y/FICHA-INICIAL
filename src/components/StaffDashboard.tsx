import React, { useState, useMemo, useEffect } from 'react';
import { PlayerData } from '../types';
import { PlayerPrintableCard } from './PlayerPrintableCard';
import { SquadPdfModal } from './SquadPdfModal';
import { exportPlayersToCSV } from '../utils/export';
import { savePlayerSubmission, deleteStoredPlayer, syncPlayersWithSupabase } from '../utils/storage';
import { checkSupabaseConnection, SupabaseStatus } from '../utils/supabase';
import { ConfirmModal } from './ConfirmModal';
import { SupabaseModal } from './SupabaseModal';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  Trash2,
  Trophy,
  Activity,
  Target,
  Sparkles,
  Flame,
  FileText,
  X,
  Save,
  Printer,
  Lock,
  Database,
  RefreshCw,
} from 'lucide-react';

interface StaffDashboardProps {
  players: PlayerData[];
  onUpdatePlayers: (players: PlayerData[]) => void;
  onBackToPlayerForm: () => void;
  onLockStaff?: () => void;
  onOpenClubEditor?: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  players,
  onUpdatePlayers,
  onBackToPlayerForm,
  onLockStaff,
  onOpenClubEditor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('ALL');
  const [filterABP, setFilterABP] = useState('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [playerToDelete, setPlayerToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleCheckSupabase = async () => {
    setIsCheckingSupabase(true);
    const res = await checkSupabaseConnection();
    setSupabaseStatus(res);
    setIsCheckingSupabase(false);
  };

  const handleSyncSupabase = async () => {
    setIsSyncingSupabase(true);
    setSyncFeedback(null);
    const { players: synced, source, error } = await syncPlayersWithSupabase();
    onUpdatePlayers(synced);
    setIsSyncingSupabase(false);
    if (source === 'supabase') {
      setSyncFeedback('¡Sincronizado con Supabase con éxito!');
      setSupabaseStatus({ connected: true, tableExists: true, count: synced.length });
    } else {
      setSyncFeedback(error || 'Usando base local. Verifica que hayas ejecutado el script SQL en Supabase.');
      setSupabaseStatus({ connected: true, tableExists: false, error });
    }
    setTimeout(() => setSyncFeedback(null), 5000);
  };

  useEffect(() => {
    handleCheckSupabase();
  }, []);

  // Analytics
  const stats = useMemo(() => {
    const count = players.length;
    if (count === 0) {
      return {
        total: 0,
        avgIllusion: 0,
        avgCommitmentNotStarting: 0,
        freeKickTakers: 0,
        headers: 0,
        withExternalHelp: 0,
      };
    }

    const totalIllusion = players.reduce((sum, p) => sum + (p.illusionScore || 0), 0);
    const totalCommitment = players.reduce((sum, p) => sum + (p.commitmentNotStarting || 0), 0);
    const freeKickTakers = players.filter((p) => p.abpOffensiveFoulsCorners).length;
    const headers = players.filter((p) => p.abpOffensiveHeader).length;
    const withExternalHelp = players.filter(
      (p) => p.externalHelps.length > 0 && !p.externalHelps.includes('Ninguna')
    ).length;

    return {
      total: count,
      avgIllusion: (totalIllusion / count).toFixed(1),
      avgCommitmentNotStarting: (totalCommitment / count).toFixed(1),
      freeKickTakers,
      headers,
      withExternalHelp: Math.round((withExternalHelp / count) * 100),
    };
  }, [players]);

  // Filtered players list
  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      // Search
      const search = searchTerm.toLowerCase().trim();
      const matchSearch =
        !search ||
        p.fullName.toLowerCase().includes(search) ||
        (p.nickname && p.nickname.toLowerCase().includes(search)) ||
        (p.dorsal && p.dorsal.includes(search)) ||
        (p.position && p.position.toLowerCase().includes(search));

      // Position filter
      const matchPos = filterPosition === 'ALL' || p.position === filterPosition;

      // ABP filter
      let matchABP = true;
      if (filterABP === 'FOULS') matchABP = !!p.abpOffensiveFoulsCorners;
      if (filterABP === 'HEADERS') matchABP = !!p.abpOffensiveHeader;
      if (filterABP === 'ZONE') matchABP = !!p.abpDefensiveZone;
      if (filterABP === 'MAN') matchABP = !!p.abpDefensiveManMarking;

      return matchSearch && matchPos && matchABP;
    });
  }, [players, searchTerm, filterPosition, filterABP]);

  const handleOpenDetail = (player: PlayerData) => {
    setSelectedPlayer(player);
    setEditingNotes(player.staffNotes || '');
  };

  const handleSaveNotes = () => {
    if (!selectedPlayer) return;
    const updated = { ...selectedPlayer, staffNotes: editingNotes };
    const newPlayerList = savePlayerSubmission(updated);
    onUpdatePlayers(newPlayerList);
    setSelectedPlayer(updated);
  };

  const handleDelete = (id: string, name: string) => {
    setPlayerToDelete({ id, name });
  };

  const handleConfirmDelete = () => {
    if (!playerToDelete) return;
    const updated = deleteStoredPlayer(playerToDelete.id);
    onUpdatePlayers(updated);
    if (selectedPlayer?.id === playerToDelete.id) {
      setSelectedPlayer(null);
    }
    setPlayerToDelete(null);
  };

  return (
    <div className={`space-y-6 max-w-7xl mx-auto py-6 px-3 sm:px-6 ${isPdfModalOpen || selectedPlayer ? 'print:hidden' : ''}`}>
      {/* Top Staff Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              Panel del Cuerpo Técnico
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-red-600" />
            Fichas Iniciales de la Plantilla
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Supabase status & SQL modal button */}
          <button
            type="button"
            id="staff-supabase-btn"
            onClick={() => {
              setIsSupabaseModalOpen(true);
              handleCheckSupabase();
            }}
            className={`px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              supabaseStatus?.tableExists
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                : isCheckingSupabase
                ? 'bg-sky-50 text-sky-900 border-sky-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title="Base de datos Supabase: Ver estado y script SQL"
          >
            <Database
              className={`w-4 h-4 ${
                supabaseStatus?.tableExists
                  ? 'text-emerald-600'
                  : isCheckingSupabase
                  ? 'text-sky-600 animate-spin'
                  : 'text-amber-600'
              }`}
            />
            <span>
              {isCheckingSupabase
                ? 'Comprobando...'
                : supabaseStatus?.tableExists
                ? `Supabase Conectado (${supabaseStatus.count ?? 0})`
                : 'Supabase (Script SQL)'}
            </span>
          </button>

          <button
            type="button"
            id="staff-sync-btn"
            onClick={handleSyncSupabase}
            disabled={isSyncingSupabase}
            className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
            title="Sincronizar fichas con la nube de Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSupabase ? 'animate-spin text-emerald-600' : 'text-slate-600'}`} />
            <span>{isSyncingSupabase ? 'Sincronizando...' : 'Sincronizar'}</span>
          </button>

          <button
            type="button"
            id="staff-export-squad-pdf"
            onClick={() => setIsPdfModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-red-600/20 transition-all active:scale-95 cursor-pointer"
            title="Generar y descargar informe de la plantilla en PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Exportar Plantilla (PDF)</span>
          </button>

          <button
            type="button"
            id="staff-export-all-csv"
            onClick={() => exportPlayersToCSV(players)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
            title="Descargar archivo Excel / CSV con todas las respuestas"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Exportar CSV / Excel</span>
          </button>

          {onOpenClubEditor && (
            <button
              type="button"
              id="staff-open-club-editor"
              onClick={onOpenClubEditor}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="Configurar nombre del club y escudo oficial"
            >
              <Shield className="w-4 h-4 text-red-600" />
              <span>Nombre y Escudo</span>
            </button>
          )}

          <button
            type="button"
            id="staff-back-to-form"
            onClick={onBackToPlayerForm}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
          >
            Volver a Formulario Jugador
          </button>

          {onLockStaff && (
            <button
              type="button"
              id="staff-lock-exit-btn"
              onClick={onLockStaff}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="Bloquear acceso al cuerpo técnico y volver al formulario"
            >
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>Bloquear / Salir</span>
            </button>
          )}
        </div>
      </div>

      {syncFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncFeedback(null)}
            className="p-1 text-emerald-700 hover:text-emerald-950 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SQUAD METRICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-600 text-xs block font-semibold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-red-600" />
            Fichas Recibidas
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.total}
          </div>
          <span className="text-[11px] text-slate-500">Jugadores registrados</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-600 text-xs block font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            Ilusión Media
          </span>
          <div className="text-2xl sm:text-3xl font-black text-red-600 mt-1">
            {stats.avgIllusion}
            <span className="text-xs text-slate-500 font-normal">/10</span>
          </div>
          <span className="text-[11px] text-slate-500">Motivación inicial</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-600 text-xs block font-semibold flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Compromiso Banquillo
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.avgCommitmentNotStarting}
            <span className="text-xs text-slate-500 font-normal">/10</span>
          </div>
          <span className="text-[11px] text-slate-500">Si no es titular</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-600 text-xs block font-semibold flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-red-600" />
            Lanzadores Faltas
          </span>
          <div className="text-2xl sm:text-3xl font-black text-red-600 mt-1">
            {stats.freeKickTakers}
          </div>
          <span className="text-[11px] text-slate-500">Especialistas ABP</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-600 text-xs block font-semibold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            Rematadores Área
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.headers}
          </div>
          <span className="text-[11px] text-slate-500">Juego aéreo ABP</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-600 text-xs block font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-red-600" />
            Ayudas Externas
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.withExternalHelp}%
          </div>
          <span className="text-[11px] text-slate-500">Nutri / Fisio / Coach</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            id="staff-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por jugador, apodo, dorsal o posición..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Position Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            id="staff-filter-position"
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">Todas las posiciones</option>
            <option value="Portero">Portero</option>
            <option value="Defensa Central">Defensa Central</option>
            <option value="Lateral Derecho">Lateral Derecho</option>
            <option value="Lateral Izquierdo">Lateral Izquierdo</option>
            <option value="Pivote / Mediocentro Defensivo">Pivote / Mediocentro Defensivo</option>
            <option value="Mediocentro Organizador">Mediocentro Organizador</option>
            <option value="Mediapunta / Interior">Mediapunta / Interior</option>
            <option value="Extremo Derecho">Extremo Derecho</option>
            <option value="Extremo Izquierdo">Extremo Izquierdo</option>
            <option value="Delantero Centro">Delantero Centro</option>
          </select>

          {/* ABP filter */}
          <select
            id="staff-filter-abp"
            value={filterABP}
            onChange={(e) => setFilterABP(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">Todos los perfiles ABP</option>
            <option value="FOULS">Lanzador Faltas/Córners</option>
            <option value="HEADERS">Rematador de Área</option>
            <option value="ZONE">Defensor en Zona</option>
            <option value="MAN">Marcador al Hombre</option>
          </select>
        </div>
      </div>

      {/* PLAYERS LIST TABLE / CARDS */}
      {filteredPlayers.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-base font-semibold text-slate-700">No se encontraron fichas con los filtros actuales.</p>
          <p className="text-xs text-slate-500">Prueba a limpiar la búsqueda o cambiar el filtro de posición.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-500 transition-all space-y-4 flex flex-col justify-between group shadow-2xs hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 font-mono font-black text-lg shrink-0">
                      {player.dorsal ? `#${player.dorsal}` : <Shield className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base leading-tight group-hover:text-red-600 transition-colors">
                        {player.fullName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {player.position} {player.nickname ? `("${player.nickname}")` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Ilusión</span>
                    <span className="text-lg font-black text-red-600">{player.illusionScore}/10</span>
                  </div>
                </div>

                {/* Key indicators */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1 border-t border-slate-100">
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">No titular</span>
                    <span className="font-bold text-slate-800">{player.commitmentNotStarting}/10</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Físico prev.</span>
                    <span className="font-bold text-slate-800">{player.physicalPreparationScore}/10</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">ABP Ofensivo</span>
                    <span className="font-bold text-red-600">
                      {player.abpOffensiveFoulsCorners ? 'Lanza' : player.abpOffensiveHeader ? 'Remata' : 'Apoyo'}
                    </span>
                  </div>
                </div>

                {/* Goal snippet */}
                <div className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                  "{player.individualGoal || 'Sin objetivo individual especificado'}"
                </div>

                {/* Coach staff note badge if exists */}
                {player.staffNotes && (
                  <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-300 p-2 rounded-lg line-clamp-2">
                    <strong>Nota Cuerpo Técnico:</strong> {player.staffNotes}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  id={`view-player-btn-${player.id}`}
                  onClick={() => handleOpenDetail(player)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Ficha Completa</span>
                </button>

                <button
                  type="button"
                  id={`delete-player-btn-${player.id}`}
                  onClick={() => handleDelete(player.id, player.fullName)}
                  title="Eliminar ficha"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-500 border border-slate-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL WITH FULL DOSSIER & STAFF NOTES */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:static print:p-0 print:bg-white print:overflow-visible">
          <div className="bg-white border-2 border-red-500 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-6 print:max-h-none print:h-auto print:border-none print:shadow-none print:rounded-none print:p-0 print:overflow-visible">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 no-print print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  Dossier Técnico Detallado
                </span>
                <span className="text-sm font-bold text-slate-900">{selectedPlayer.fullName}</span>
              </div>
              <button
                type="button"
                id="modal-close-btn"
                onClick={() => setSelectedPlayer(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Card */}
            <PlayerPrintableCard player={selectedPlayer} showActions={true} />

            {/* Coach Staff Notes Section */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 no-print print:hidden">
              <div className="flex items-center justify-between">
                <label htmlFor="staffNotes" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  Notas Privadas del Cuerpo Técnico
                </label>
                <button
                  type="button"
                  id="save-notes-btn"
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Nota</span>
                </button>
              </div>
              <textarea
                id="staffNotes"
                rows={3}
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Anotaciones técnicas, impresiones tras entrevista personal, rol asignado en ABP o pautas de preparación física..."
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <p className="text-[11px] text-slate-500">
                Estas notas solo son visibles por el cuerpo técnico y se guardan junto a la ficha del jugador.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Player Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(playerToDelete)}
        title="¿Eliminar ficha de jugador?"
        message={`¿Estás seguro de que deseas eliminar la ficha de "${playerToDelete?.name}"? Esta información se eliminará del registro local del cuerpo técnico.`}
        confirmLabel="Eliminar ficha"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPlayerToDelete(null)}
      />

      {/* Squad PDF Export Modal */}
      <SquadPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        players={players}
      />

      {/* Supabase Database Configuration & SQL Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        status={supabaseStatus}
        onRefreshStatus={handleCheckSupabase}
        isChecking={isCheckingSupabase}
      />
    </div>
  );
};
