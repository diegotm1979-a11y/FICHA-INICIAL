import React, { useState, useRef } from 'react';
import { ClubProfile, DEFAULT_CLUB_PROFILE } from '../types';
import {
  Shield,
  Upload,
  Link as LinkIcon,
  X,
  Check,
  RotateCcw,
  Image as ImageIcon,
  Building2,
} from 'lucide-react';

interface ClubBadgeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ClubProfile;
  onSave: (profile: ClubProfile) => void;
}

export const ClubBadgeEditorModal: React.FC<ClubBadgeEditorModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSave,
}) => {
  const [clubName, setClubName] = useState(currentProfile.clubName);
  const [subheading, setSubheading] = useState(currentProfile.subheading);
  const [crestUrl, setCrestUrl] = useState<string | null>(currentProfile.crestUrl);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen es demasiado grande. Tamaño máximo recomendado: 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCrestUrl(result);
      }
    };
    reader.onerror = () => {
      setUploadError('Error al leer el archivo. Inténtalo de nuevo.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setCrestUrl(urlInput.trim());
      setUrlInput('');
      setUploadError(null);
    }
  };

  const handleResetToDefault = () => {
    setClubName('');
    setSubheading('Ficha Inicial de Temporada · Cuerpo Técnico');
    setCrestUrl(null);
    setUploadError(null);
  };

  const handleSave = () => {
    onSave({
      clubName: clubName.trim(),
      subheading: subheading.trim() || 'Ficha Inicial de Temporada · Cuerpo Técnico',
      crestUrl,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border-2 border-red-500 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white leading-snug">
                Escudo e Identidad del Club
              </h3>
              <p className="text-[11px] text-red-100">
                Personaliza el escudo oficial que aparecerá en la cabecera e informes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Current Live Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black shadow-lg shadow-red-500/25 overflow-hidden border-2 border-white">
                {crestUrl ? (
                  <img
                    src={crestUrl}
                    alt="Escudo del Club"
                    className="w-full h-full object-contain p-1 bg-white"
                  />
                ) : (
                  <Shield className="w-9 h-9 stroke-[2.2]" />
                )}
              </div>
              {crestUrl && (
                <button
                  type="button"
                  onClick={() => setCrestUrl(null)}
                  title="Quitar escudo y volver al icono por defecto"
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xs border border-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-wider block">
                Previsualización
              </span>
              <h4 className="text-base font-black text-slate-900 truncate">
                {clubName || 'Ficha Inicial de Temporada'}
              </h4>
              <p className="text-xs text-slate-500 truncate">
                {subheading || 'Información y Compromiso del Futbolista · Cuerpo Técnico'}
              </p>
            </div>
          </div>

          {/* Upload Drop Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
              1. Subir Imagen del Escudo
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-red-600 bg-red-50/70 scale-[1.01]'
                  : 'border-slate-300 hover:border-red-500 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              <div className="flex flex-col items-center gap-2">
                <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-2xs">
                  <Upload className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Haz clic para elegir el escudo o arrastra el archivo aquí
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Formatos: PNG transparente, SVG, JPG o WebP (máx. 5 MB)
                  </p>
                </div>
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                {uploadError}
              </p>
            )}
          </div>

          {/* Alternative: Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
              O introducir enlace directo a la imagen
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <LinkIcon className="w-3.5 h-3.5" />
                </div>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/escudo-club.png"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyUrl();
                    }
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                disabled={!urlInput.trim()}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>

          {/* Club Name & Subheading Optional Fields */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              2. Datos del Club o Categoría
            </label>

            <div>
              <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                Nombre del Club o Título
              </span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="Escribe el nombre del club cuando lo desees..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                Subtítulo / Categoría
              </span>
              <input
                type="text"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="Ej: Juvenil Nacional · Temporada 2026/27"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 cursor-pointer transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-600/30 cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Escudo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
