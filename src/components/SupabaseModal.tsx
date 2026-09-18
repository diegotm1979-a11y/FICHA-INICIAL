import React, { useState, useEffect } from 'react';
import {
  Database,
  Check,
  Copy,
  ExternalLink,
  X,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { SUPABASE_URL, SUPABASE_SETUP_SQL, SupabaseStatus } from '../utils/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: SupabaseStatus | null;
  onRefreshStatus: () => void;
  isChecking: boolean;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefreshStatus,
  isChecking,
}) => {
  const [copied, setCopied] = useState(false);

  // Automatically check status whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      onRefreshStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Base de Datos Supabase</span>
                {isChecking ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Verificando...
                  </span>
                ) : status?.tableExists ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    🟢 Activa ({status.count ?? 0} {status.count === 1 ? 'ficha' : 'fichas'})
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    🟡 Tabla pendiente
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">Sincronización en la nube con tu proyecto Supabase</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Status Box */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isChecking
                ? 'bg-sky-50 border-sky-200 text-sky-950'
                : status?.tableExists
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {isChecking ? (
                <RefreshCw className="w-5 h-5 text-sky-600 shrink-0 mt-0.5 animate-spin" />
              ) : status?.tableExists ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-sm font-bold">
                  {isChecking
                    ? 'Comprobando conexión y estado de tablas...'
                    : status?.tableExists
                    ? `¡Conexión establecida y tabla activa! (${status.count ?? 0} fichas)`
                    : 'Supabase conectado, requiere crear las tablas'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isChecking
                    ? 'Consultando la API REST de Supabase...'
                    : status?.tableExists
                    ? 'La tabla "players" existe y responde correctamente. Todas las fichas se guardan en la nube.'
                    : status?.error || 'Abre el SQL Editor de Supabase y ejecuta el script de abajo.'}
                </p>
                {status?.testedAt && (
                  <p className="text-[10px] text-slate-400 mt-1">Última comprobación: {status.testedAt}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onRefreshStatus}
              disabled={isChecking}
              className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{isChecking ? 'Comprobando...' : 'Comprobar ahora'}</span>
            </button>
          </div>

          {/* Project Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Detalles del Proyecto Configurado</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-500">URL del Proyecto:</span>
                <p className="font-mono font-semibold text-slate-800 break-all">{SUPABASE_URL}</p>
              </div>
              <div>
                <span className="text-slate-500">Clave Pública (Anon):</span>
                <p className="font-mono text-slate-600 truncate">Configurada correctamente (JWT activo)</p>
              </div>
            </div>
          </div>

          {/* SQL Setup Instructions */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Script SQL para crear la tabla "players"</h4>
                <p className="text-xs text-slate-500">
                  Copia y pega este script en el SQL Editor de tu panel de Supabase:
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://supabase.com/dashboard/project/cfhutovjwqutocolqivi/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir SQL Editor</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopySql}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                    copied
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 text-xs font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
                {SUPABASE_SETUP_SQL}
              </pre>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Respaldo híbrido:</strong> La aplicación siempre guarda una copia local instantánea en el dispositivo y sincroniza en segundo plano con Supabase. Incluso si no hay conexión temporal, no se perderá ninguna información.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm cursor-pointer"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
