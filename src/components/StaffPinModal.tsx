import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, X, ShieldAlert, Check } from 'lucide-react';
import { getStaffPin, saveStaffPin } from '../utils/storage';

interface StaffPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (rememberDevice?: boolean) => void;
}

export const StaffPinModal: React.FC<StaffPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPin = getStaffPin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Por favor, introduce el PIN de acceso.');
      return;
    }

    if (pin.trim() === currentPin) {
      setError('');
      setPin('');
      onSuccess(rememberDevice);
    } else {
      setError('PIN incorrecto. Acceso exclusivo al cuerpo técnico.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Introduce primero el PIN actual.');
      return;
    }
    if (pin.trim() !== currentPin) {
      setError('El PIN actual no es correcto.');
      return;
    }
    if (newPin.length < 4) {
      setError('El nuevo PIN debe tener al menos 4 caracteres.');
      return;
    }
    if (newPin !== confirmNewPin) {
      setError('Los nuevos PIN no coinciden.');
      return;
    }

    saveStaffPin(newPin);
    setPinChangeSuccess(true);
    setError('');
    setTimeout(() => {
      setPinChangeSuccess(false);
      setIsChangingPin(false);
      setPin('');
      setNewPin('');
      setConfirmNewPin('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border-2 border-red-500 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-red-600/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Acceso al Cuerpo Técnico</h3>
              <p className="text-xs text-slate-400">Protección de privacidad de la plantilla</p>
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Privacidad garantizada:</strong> Las fichas del resto de jugadores son confidenciales y solo pueden ser consultadas por el cuerpo técnico.
            </div>
          </div>

          {!isChangingPin ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="staff-pin-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  PIN de Seguridad del Cuerpo Técnico
                </label>
                <div className="relative">
                  <input
                    id="staff-pin-input"
                    name="staff-pin"
                    type={showPin ? 'text' : 'password'}
                    autoComplete="current-password"
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Introduce el PIN..."
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-center text-lg tracking-widest font-mono font-bold focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showPin ? 'Ocultar PIN' : 'Ver PIN'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5">{error}</p>
                )}

                {/* Persistent session toggle for mobile and web */}
                <label className="flex items-start gap-2.5 mt-3 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer shrink-0"
                  />
                  <div className="text-xs text-slate-700">
                    <span className="font-bold">Recordar acceso en este dispositivo</span>
                    <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                      Mantiene la sesión iniciada al abrir la aplicación en tu móvil o navegador.
                    </p>
                  </div>
                </label>

                <p className="text-[11px] text-slate-500 mt-2.5 text-center">
                  {currentPin === '1234' ? (
                    <>
                      PIN por defecto del cuerpo técnico: <strong className="text-slate-800 font-mono">1234</strong>
                    </>
                  ) : (
                    <span className="text-emerald-700 font-medium">
                      ✓ PIN personalizado activo (sincronizado con la nube)
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  id="confirm-staff-pin-btn"
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Entrar al Panel</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(true);
                    setError('');
                  }}
                  className="text-xs text-slate-500 hover:text-red-600 font-medium underline cursor-pointer"
                >
                  ¿Deseas cambiar el PIN del cuerpo técnico?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePin} className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-red-600" /> Cambiar PIN del Cuerpo Técnico
              </h4>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">PIN Actual</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN actual..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nuevo PIN</label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Nuevo PIN (mínimo 4 caracteres)..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Confirmar Nuevo PIN</label>
                <input
                  type="password"
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value)}
                  placeholder="Repite el nuevo PIN..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
                />
              </div>

              {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
              {pinChangeSuccess && (
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> ¡PIN actualizado correctamente!
                </p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-lg bg-red-600 text-white font-bold text-xs"
                >
                  Guardar Nuevo PIN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(false);
                    setError('');
                  }}
                  className="py-2 px-3 rounded-lg bg-slate-100 text-slate-700 text-xs"
                >
                  Volver
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
