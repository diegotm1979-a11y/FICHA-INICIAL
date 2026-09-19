import React, { useState } from 'react';
import { PlayerData } from '../types';
import { findPlayerForEdit } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import { UserCheck, Search, X, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface PlayerEditLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayerLoaded: (player: PlayerData) => void;
}

export const PlayerEditLookupModal: React.FC<PlayerEditLookupModalProps> = ({
  isOpen,
  onClose,
  onPlayerLoaded,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phoneOrDorsal, setPhoneOrDorsal] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage(t.modals.editLookupErrorName);
      return;
    }
    if (!phoneOrDorsal.trim()) {
      setErrorMessage(t.modals.editLookupErrorPhone);
      return;
    }

    setIsSearching(true);
    setErrorMessage('');

    setTimeout(() => {
      const match = findPlayerForEdit(name, phoneOrDorsal);
      setIsSearching(false);

      if (match) {
        onPlayerLoaded(match);
        onClose();
        setName('');
        setPhoneOrDorsal('');
      } else {
        setErrorMessage(t.modals.editLookupNotFound);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border-2 border-red-500 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-red-600/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.modals.editLookupTitle}</h3>
              <p className="text-xs text-slate-400">{t.modals.editLookupSubtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p>{t.modals.editLookupPrivacy}</p>
          </div>

          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label htmlFor="lookup-player-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.modals.editLookupNameLabel}
              </label>
              <input
                id="lookup-player-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder={t.modals.editLookupNamePlaceholder}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label htmlFor="lookup-player-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.modals.editLookupPhoneLabel}
              </label>
              <input
                id="lookup-player-phone"
                type="text"
                value={phoneOrDorsal}
                onChange={(e) => {
                  setPhoneOrDorsal(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder={t.modals.editLookupPhonePlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {t.modals.editLookupPhoneHelp}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                id="lookup-player-submit-btn"
                disabled={isSearching}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSearching ? (
                  <span>{t.modals.editLookupSearching}</span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t.modals.editLookupSubmit}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
              >
                {t.common.cancel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
