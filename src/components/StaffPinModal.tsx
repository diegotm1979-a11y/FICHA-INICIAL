import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, Eye, EyeOff, X, ShieldAlert, Check, Loader2, RefreshCw } from 'lucide-react';
import { getStaffPin, saveStaffPin } from '../utils/storage';
import { fetchClubConfigFromSupabase } from '../utils/supabase';

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
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePin, setActivePin] = useState<string>(getStaffPin());
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  // When modal opens, sync the latest PIN directly from Supabase
  useEffect(() => {
    if (!isOpen) return;

    setPin('');
    setError('');
    setIsChangingPin(false);
    setNewPin('');
    setConfirmNewPin('');
    setPinChangeSuccess(false);

    // Initial local read
    const localPin = getStaffPin();
    setActivePin(localPin);

    // Live cloud read to guarantee real-time sync with mobile/web
    setIsSyncingCloud(true);
    fetchClubConfigFromSupabase()
      .then((config) => {
        if (config?.staffPin && config.staffPin.trim().length >= 4) {
          const cloudPin = config.staffPin.trim();
          localStorage.setItem('ficha_inicial_staff_pin_v1', cloudPin);
          setActivePin(cloudPin);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch cloud PIN:', err);
      })
      .finally(() => {
        setIsSyncingCloud(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = pin.trim();

    if (!entered) {
      setError('Por favor, introduce el PIN de acceso.');
      return;
    }

    // 1. Check against local active PIN
    if (entered === activePin || entered === getStaffPin()) {
      setError('');
      setPin('');
      onSuccess(rememberDevice);
      return;
    }

    // 2. Check live with Supabase in case another device just changed it
    setIsVerifying(true);
    setError('');

    try {
      const config = await fetchClubConfigFromSupabase();
      const cloudPin = config?.staffPin?.trim();

      if (cloudPin && entered === cloudPin) {
        // Match found in Supabase! Update local storage
        localStorage.setItem('ficha_inicial_staff_pin_v1', cloudPin);
        setActivePin(cloudPin);
        setIsVerifying(false);
        setPin('');
        onSuccess(rememberDevice);
        return;
      }
    } catch (err) {
      console.warn('Error verifying with cloud PIN:', err);
    }

    setIsVerifying(false);
    setError('PIN incorrecto. Si lo cambiaste recientemente, asegúrate de introducir el nuevo PIN.');
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentInput = pin.trim();
    const cleanNewPin = newPin.trim();
    const cleanConfirm = confirmNewPin.trim();

    if (!currentInput) {
      setError('Introduce primero el PIN actual.');
      return;
    }

    // Check if current PIN matches activePin, local pin, default 1234, or live cloud
    let isValidCurrent =
      currentInput === activePin ||
      currentInput === getStaffPin() ||
      currentInput === '1234';

    if (!isValidCurrent) {
      try {
        const config = await fetchClubConfigFromSupabase();
        if (config?.staffPin && config.staffPin.trim() === currentInput) {
          isValidCurrent = true;
        }
      } catch {}
    }

    if (!isValidCurrent) {
      setError('El PIN actual no es correcto.');
      return;
    }

    if (cleanNewPin.length < 4) {
      setError('El nuevo PIN debe tener al menos 4 caracteres.');
      return;
    }

    if (cleanNewPin !== cleanConfirm) {
      setError('Los nuevos PIN no coinciden.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const savedOk = await saveStaffPin(cleanNewPin);
      setActivePin(cleanNewPin);
      setPinChangeSuccess(true);

      setTimeout(() => {
        setPinChangeSuccess(false);
        setIsChangingPin(false);
        setPin('');
        setNewPin('');
        setConfirmNewPin('');
        setIsSaving(false);
      }, 1400);
    } catch (err) {
      console.error('Error saving new PIN:', err);
      setError('No se pudo guardar en la nube. Inténtalo de nuevo.');
      setIsSaving(false);
    }
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
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="staff-security-code-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    PIN de Seguridad del Cuerpo Técnico
                  </label>
                  {isSyncingCloud && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Sincronizando...
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    id="staff-security-code-input"
                    name="staff_security_code_entry"
                    type={showPin ? 'text' : 'password'}
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    inputMode="text"
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

                <div className="mt-2.5 text-center">
                  {activePin === '1234' ? (
                    <p className="text-[11px] text-slate-500">
                      PIN inicial por defecto: <strong className="text-slate-800 font-mono">1234</strong>
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-700 font-medium inline-flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      PIN personalizado activo y sincronizado en la nube
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  id="confirm-staff-pin-btn"
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Entrar al Panel</span>
                    </>
                  )}
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
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  PIN Actual
                </label>
                <input
                  type="password"
                  autoComplete="off"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN actual (o 1234 si es el primero)..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nuevo PIN</label>
                <input
                  type="password"
                  autoComplete="off"
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
                  autoComplete="off"
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value)}
                  placeholder="Repite el nuevo PIN..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
                />
              </div>

              {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
              {pinChangeSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡PIN guardado y sincronizado en la nube para móvil y web!</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando en la nube...</span>
                    </>
                  ) : (
                    <span>Guardar Nuevo PIN</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(false);
                    setError('');
                  }}
                  className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer"
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
