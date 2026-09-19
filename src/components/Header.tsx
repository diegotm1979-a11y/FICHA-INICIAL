import React from 'react';
import { Shield, Users, FileText, CheckCircle2, RotateCcw, Pencil, Camera, Lock, LogOut } from 'lucide-react';
import { ClubProfile } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeView: 'FORM' | 'STAFF';
  onSelectView: (view: 'FORM' | 'STAFF') => void;
  playerCount: number;
  hasDraft?: boolean;
  onResetDraft?: () => void;
  clubProfile?: ClubProfile;
  onOpenClubEditor?: () => void;
  isStaffAuthenticated?: boolean;
  onLockStaff?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  playerCount,
  hasDraft = false,
  onResetDraft,
  clubProfile,
  onOpenClubEditor,
  isStaffAuthenticated = false,
  onLockStaff,
}) => {
  const { t } = useLanguage();
  const clubName = (clubProfile?.clubName || '').trim();
  const subheading = clubProfile?.subheading || t.header.defaultSheetSubtitle;
  const crestUrl = clubProfile?.crestUrl;

  return (
    <header className="bg-white/95 border-b-2 border-red-600 sticky top-0 z-40 backdrop-blur-md no-print shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Brand & Crest */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              {/* Editable Club Crest Button */}
              <button
                type="button"
                id="header-edit-club-crest-btn"
                onClick={onOpenClubEditor}
                className="group relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black shadow-md shadow-red-500/25 overflow-hidden transition-all hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-transparent hover:ring-red-400 focus:outline-hidden"
                title={t.header.changeCrestTitle}
              >
                {crestUrl ? (
                  <img
                    src={crestUrl}
                    alt={clubName}
                    className="w-full h-full object-contain p-1 bg-white"
                  />
                ) : (
                  <Shield className="w-6 h-6 stroke-[2.2]" />
                )}

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[1px]">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">
                    {clubName || t.header.defaultSheetTitle}
                  </h1>
                  {onOpenClubEditor && (
                    <button
                      type="button"
                      onClick={onOpenClubEditor}
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title={
                        isStaffAuthenticated
                          ? t.header.editClubTitle
                          : t.header.editClubWithPinTitle
                      }
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                  {clubName ? subheading : t.header.defaultSheetSubtitle}
                </p>
              </div>
            </div>

            {/* Mobile language & reset actions */}
            <div className="flex items-center gap-2 sm:hidden">
              <LanguageSelector />
              {hasDraft && activeView === 'FORM' && onResetDraft && (
                <button
                  type="button"
                  id="header-reset-draft-mobile"
                  onClick={onResetDraft}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-red-700 bg-red-50 border border-red-200 active:scale-95 transition-all"
                  title={t.nav.startOverDraft}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.header.reset}</span>
                </button>
              )}
            </div>
          </div>

          {/* Mode Switcher Buttons, Language Selector & Reset (Desktop / Tablet) */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* Desktop Language Selector */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            {hasDraft && activeView === 'FORM' && (
              <div className="hidden sm:flex items-center gap-2 mr-1">
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t.header.draftSaved}
                </span>
                {onResetDraft && (
                  <button
                    type="button"
                    id="header-reset-draft-desktop"
                    onClick={onResetDraft}
                    className="text-[11px] text-slate-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer border border-transparent hover:border-red-200"
                    title={t.nav.startOverDraft}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.header.startOver}</span>
                  </button>
                )}
              </div>
            )}

            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 w-full sm:w-auto">
              <button
                type="button"
                id="header-tab-player"
                onClick={() => onSelectView('FORM')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeView === 'FORM'
                    ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.header.playerForm}</span>
              </button>

              <button
                type="button"
                id="header-tab-staff"
                onClick={() => onSelectView('STAFF')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeView === 'STAFF'
                    ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={isStaffAuthenticated ? t.staffDashboard.title : t.header.staffProtectedTitle}
              >
                {!isStaffAuthenticated ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Users className="w-3.5 h-3.5" />
                )}
                <span>{t.header.coachingStaff}</span>
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    activeView === 'STAFF'
                      ? 'bg-white text-red-600'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {playerCount}
                </span>
              </button>
            </div>

            {isStaffAuthenticated && activeView === 'STAFF' && onLockStaff && (
              <button
                type="button"
                id="header-lock-staff-btn"
                onClick={onLockStaff}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 transition-colors cursor-pointer"
                title={t.header.logOutStaff}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
