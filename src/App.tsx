import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PlayerData, FormStep, INITIAL_PLAYER_DATA, ClubProfile, DEFAULT_CLUB_PROFILE } from './types';
import { Header } from './components/Header';
import { StepProgressBar } from './components/StepProgressBar';
import { Step1Personal } from './components/steps/Step1Personal';
import { Step2ExternalHelp } from './components/steps/Step2ExternalHelp';
import { Step3ABP } from './components/steps/Step3ABP';
import { Step4Psychology } from './components/steps/Step4Psychology';
import { Step5Commitment } from './components/steps/Step5Commitment';
import { Step6Goals } from './components/steps/Step6Goals';
import { Step7Summary } from './components/steps/Step7Summary';
import { SuccessView } from './components/SuccessView';
import { StaffDashboard } from './components/StaffDashboard';
import { ClubBadgeEditorModal } from './components/ClubBadgeEditorModal';
import { StaffPinModal } from './components/StaffPinModal';
import {
  getStoredPlayers,
  savePlayerSubmission,
  getFormDraft,
  saveFormDraft,
  clearFormDraft,
  getClubProfile,
  saveClubProfile,
  syncPlayersWithSupabase,
  syncClubProfileWithSupabase,
} from './utils/storage';
import { ConfirmModal } from './components/ConfirmModal';
import { ArrowLeft, ArrowRight, Shield, Check, RotateCcw, Lock, UserCheck, X } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'FORM' | 'STAFF' | 'SUCCESS'>('FORM');
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [maxStepVisited, setMaxStepVisited] = useState<FormStep>(1);
  const [formData, setFormData] = useState<PlayerData>(INITIAL_PLAYER_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [submittedPlayer, setSubmittedPlayer] = useState<PlayerData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [clubProfile, setClubProfile] = useState<ClubProfile>(DEFAULT_CLUB_PROFILE);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ficha_inicial_staff_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isStaffPinModalOpen, setIsStaffPinModalOpen] = useState(false);

  // Initialize data from local storage
  useEffect(() => {
    const loadedPlayers = getStoredPlayers();
    setPlayers(loadedPlayers);
    setClubProfile(getClubProfile());

    // Synchronize seamlessly with Supabase in the background
    syncPlayersWithSupabase().then(({ players: synced, source }) => {
      if (source === 'supabase' && synced) {
        setPlayers(synced);
      }
    });
    syncClubProfileWithSupabase().then((syncedProfile) => {
      if (syncedProfile) {
        setClubProfile(syncedProfile);
      }
    });

    const draft = getFormDraft();
    if (draft && draft.data) {
      const hasAnyData = Boolean(
        draft.data.fullName?.trim() ||
        draft.data.nickname?.trim() ||
        draft.data.phone?.trim() ||
        draft.data.email?.trim() ||
        draft.data.dorsal ||
        draft.step > 1
      );
      if (hasAnyData) {
        setFormData(draft.data);
        const validStep = Math.min(Math.max(draft.step || 1, 1), 7) as FormStep;
        setCurrentStep(validStep);
        setMaxStepVisited(validStep);
      }
    }
  }, []);

  // Determine if there is draft data that can be reset
  const hasDraft = Boolean(
    formData.fullName.trim() ||
    formData.nickname.trim() ||
    formData.dorsal ||
    formData.phone.trim() ||
    formData.email.trim() ||
    formData.externalHelps.length > 0 ||
    formData.abpOffensiveFoulsCorners !== null ||
    formData.abpOffensiveHeader !== null ||
    formData.positivePersonalityTraits.trim() ||
    formData.tacticalStrengths.trim() ||
    formData.individualGoal.trim() ||
    currentStep > 1
  );

  // Auto-save draft on data changes
  const updateFormData = (fields: Partial<PlayerData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...fields };
      saveFormDraft(updated, currentStep);
      return updated;
    });

    // Clear matching errors
    if (Object.keys(fields).length > 0) {
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        Object.keys(fields).forEach((k) => {
          delete nextErrors[k];
        });
        return nextErrors;
      });
    }
  };

  // Step Validation logic
  const validateStep = (step: FormStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'El nombre completo es obligatorio.';
      } else if (formData.fullName.trim().length < 3) {
        newErrors.fullName = 'Introduce nombre y apellidos válidos.';
      }

      const phoneClean = formData.phone.replace(/[^0-9+]/g, '');
      if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono de contacto es obligatorio.';
      } else if (phoneClean.length < 7) {
        newErrors.phone = 'Introduce un número de teléfono válido.';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'El correo electrónico es obligatorio.';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Introduce una dirección de correo válida (ej. nombre@correo.com).';
      }

      if (formData.hasPartner === null) {
        newErrors.hasPartner = 'Por favor, indica si tienes pareja.';
      }

      if (formData.childrenCount > 0 && !formData.childrenAges.trim()) {
        newErrors.childrenAges = 'Indica la edad o edades de tus hijos.';
      }
    }

    if (step === 2) {
      if (formData.externalHelps.length === 0) {
        newErrors.externalHelps = 'Selecciona al menos una opción o marca "Ninguna".';
      }
      if (formData.externalHelps.includes('Otros') && !formData.externalHelpOther.trim()) {
        newErrors.externalHelpOther = 'Especifica qué otra ayuda externa utilizas.';
      }
    }

    if (step === 3) {
      if (formData.abpOffensiveFoulsCorners === null) {
        newErrors.abpOffensiveFoulsCorners = 'Indica si eres lanzador de faltas/córners.';
      }
      if (formData.abpOffensiveHeader === null) {
        newErrors.abpOffensiveHeader = 'Indica si eres rematador en el área.';
      }
      if (formData.abpMemorizePlays === null) {
        newErrors.abpMemorizePlays = 'Indica tu capacidad para memorizar jugadas ensayadas.';
      }
      if (formData.abpDefensiveManMarking === null) {
        newErrors.abpDefensiveManMarking = 'Indica si marcas al hombre.';
      }
      if (formData.abpDefensiveZone === null) {
        newErrors.abpDefensiveZone = 'Indica si defiendes en zona.';
      }
    }

    if (step === 4) {
      if (!formData.positivePersonalityTraits.trim()) {
        newErrors.positivePersonalityTraits = 'Indica al menos un rasgo positivo de tu personalidad.';
      }
      if (!formData.personalityImprovementTraits.trim()) {
        newErrors.personalityImprovementTraits = 'Indica un rasgo de tu personalidad que te gustaría mejorar.';
      }
      if (!formData.tacticalStrengths.trim()) {
        newErrors.tacticalStrengths = 'Indica en qué características técnico-tácticas destacas.';
      }
      if (!formData.tacticalImprovements.trim()) {
        newErrors.tacticalImprovements = 'Indica qué aspecto técnico-táctico deseas pulir esta temporada.';
      }
    }

    // Step 5 has defaults between 0 and 10, always valid

    if (step === 6) {
      if (!formData.individualGoal.trim()) {
        newErrors.individualGoal = 'Escribe tu meta individual para este año.';
      }
      if (!formData.collectiveGoal.trim()) {
        newErrors.collectiveGoal = 'Escribe tu objetivo para el equipo.';
      }
      if (!formData.favoriteAthleteReferent.trim()) {
        newErrors.favoriteAthleteReferent = 'Indica un deportista o jugador referente.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = (currentStep + 1) as FormStep;
      setCurrentStep(nextStep);
      setMaxStepVisited((prev) => (nextStep > prev ? nextStep : prev));
      saveFormDraft(formData, nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = (currentStep - 1) as FormStep;
      setCurrentStep(prevStep);
      saveFormDraft(formData, prevStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToStep = (step: FormStep) => {
    // Check validation if trying to jump forward past current step
    if (step > currentStep) {
      if (!validateStep(currentStep)) return;
    }
    setCurrentStep(step);
    saveFormDraft(formData, step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    // Validate all steps 1 through 6
    for (let s = 1; s <= 6; s++) {
      if (!validateStep(s as FormStep)) {
        setCurrentStep(s as FormStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setIsSubmitting(true);
    const finalPlayer: PlayerData = {
      ...formData,
      id: formData.id || `player-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      const updatedList = savePlayerSubmission(finalPlayer);
      setPlayers(updatedList);
      setSubmittedPlayer(finalPlayer);

      // Cada vez que se envía la ficha al cuerpo técnico, vuelve a estar en blanco automáticamente
      clearFormDraft();
      setFormData(INITIAL_PLAYER_DATA);
      setCurrentStep(1);
      setMaxStepVisited(1);
      setErrors({});

      setIsSubmitting(false);
      setActiveView('SUCCESS');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const handleStartNewForm = () => {
    clearFormDraft();
    setFormData(INITIAL_PLAYER_DATA);
    setCurrentStep(1);
    setMaxStepVisited(1);
    setErrors({});
    setActiveView('FORM');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenResetModal = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    clearFormDraft();
    setFormData(INITIAL_PLAYER_DATA);
    setCurrentStep(1);
    setMaxStepVisited(1);
    setErrors({});
    setIsResetConfirmOpen(false);
    setToastMessage('Formulario restablecido en blanco.');
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectView = (view: 'FORM' | 'STAFF') => {
    if (view === 'STAFF') {
      if (!isStaffAuthenticated) {
        setIsStaffPinModalOpen(true);
        return;
      }
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStaffPinSuccess = () => {
    setIsStaffAuthenticated(true);
    try {
      sessionStorage.setItem('ficha_inicial_staff_auth', 'true');
    } catch {}
    setIsStaffPinModalOpen(false);
    setActiveView('STAFF');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLockStaff = () => {
    setIsStaffAuthenticated(false);
    try {
      sessionStorage.removeItem('ficha_inicial_staff_auth');
    } catch {}
    setActiveView('FORM');
    setToastMessage('Sesión del Cuerpo Técnico cerrada y panel protegido.');
    setTimeout(() => setToastMessage(null), 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenClubEditor = () => {
    if (!isStaffAuthenticated) {
      setIsStaffPinModalOpen(true);
      return;
    }
    setIsClubModalOpen(true);
  };

  const handleSaveClubProfile = (newProfile: ClubProfile) => {
    setClubProfile(newProfile);
    saveClubProfile(newProfile);
    setToastMessage('Escudo e identidad del club actualizados.');
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col border-4 sm:border-8 border-red-600 print:border-none selection:bg-red-600 selection:text-white">
      {/* Club Staff Header */}
      <Header
        activeView={activeView === 'STAFF' ? 'STAFF' : 'FORM'}
        onSelectView={handleSelectView}
        playerCount={players.length}
        hasDraft={hasDraft}
        onResetDraft={handleOpenResetModal}
        clubProfile={clubProfile}
        onOpenClubEditor={handleOpenClubEditor}
        isStaffAuthenticated={isStaffAuthenticated}
        onLockStaff={handleLockStaff}
      />

      {/* VIEW: STAFF DASHBOARD */}
      {activeView === 'STAFF' && (
        <main className="flex-1 bg-white">
          <StaffDashboard
            players={players}
            onUpdatePlayers={setPlayers}
            onBackToPlayerForm={() => setActiveView('FORM')}
            onLockStaff={handleLockStaff}
          />
        </main>
      )}

      {/* VIEW: SUCCESS SCREEN */}
      {activeView === 'SUCCESS' && submittedPlayer && (
        <main className="flex-1 bg-white">
          <SuccessView
            player={submittedPlayer}
            onNewForm={handleStartNewForm}
          />
        </main>
      )}

      {/* VIEW: MULTI-STEP PLAYER FORM */}
      {activeView === 'FORM' && (
        <main className="flex-1 flex flex-col bg-white">
          {/* Top Progress Bar */}
          <StepProgressBar
            currentStep={currentStep}
            onSelectStep={handleGoToStep}
            maxStepVisited={maxStepVisited}
          />

          {/* Privacy Context Banner */}
          <div className="max-w-3xl mx-auto w-full px-4 pt-3 pb-1">
            <div className="flex items-center justify-between gap-1.5 text-xs py-1">
              <span className="text-[11px] text-slate-500">
                Completa tu ficha antes de iniciar la pretemporada. Tus datos son privados y se envían directamente al cuerpo técnico.
              </span>
            </div>
          </div>

          {/* Step Form Container */}
          <div className={`flex-1 w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-all duration-300 ${
            currentStep === 4 || currentStep === 7 ? 'max-w-5xl' : 'max-w-3xl'
          }`}>
            <div className="bg-white border-2 border-red-500 rounded-3xl p-5 sm:p-8 shadow-xl shadow-red-950/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 1 && (
                    <Step1Personal
                      data={formData}
                      onChange={updateFormData}
                      errors={errors}
                    />
                  )}

                  {currentStep === 2 && (
                    <Step2ExternalHelp
                      data={formData}
                      onChange={updateFormData}
                      errors={errors}
                    />
                  )}

                  {currentStep === 3 && (
                    <Step3ABP
                      data={formData}
                      onChange={updateFormData}
                      errors={errors}
                    />
                  )}

                  {currentStep === 4 && (
                    <Step4Psychology
                      data={formData}
                      onChange={updateFormData}
                      errors={errors}
                    />
                  )}

                  {currentStep === 5 && (
                    <Step5Commitment
                      data={formData}
                      onChange={updateFormData}
                    />
                  )}

                  {currentStep === 6 && (
                    <Step6Goals
                      data={formData}
                      onChange={updateFormData}
                      errors={errors}
                    />
                  )}

                  {currentStep === 7 && (
                    <Step7Summary
                      data={formData}
                      onGoToStep={handleGoToStep}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Bottom Navigation Buttons (Steps 1 to 6) */}
              {currentStep < 7 && (
                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    id="btn-step-prev"
                    disabled={currentStep === 1}
                    onClick={handleBack}
                    className={`min-h-[48px] px-4 sm:px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 border transition-all ${
                      currentStep === 1
                        ? 'opacity-30 cursor-not-allowed border-slate-200 text-slate-400 bg-slate-100'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 active:scale-95 cursor-pointer shadow-xs'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Paso Anterior</span>
                    <span className="sm:hidden">Atrás</span>
                  </button>

                  <div className="text-xs text-slate-500 font-semibold hidden md:block">
                    Paso {currentStep} de 7
                  </div>

                  <button
                    type="button"
                    id="btn-step-next"
                    onClick={handleNext}
                    className="min-h-[48px] px-6 sm:px-8 py-3 rounded-xl font-extrabold text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shadow-lg shadow-red-600/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{currentStep === 6 ? 'Revisar Resumen' : 'Siguiente Paso'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              )}

              {/* In-form Reset Button */}
              {hasDraft && currentStep < 7 && (
                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-center">
                  <button
                    type="button"
                    id="btn-reset-draft-bottom"
                    onClick={handleOpenResetModal}
                    className="text-xs text-slate-500 hover:text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Empezar de cero y borrar borrador</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* In-app Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="¿Empezar de cero?"
        message="Se borrarán todos los datos introducidos en el formulario y volverás al Paso 1 con la ficha limpia. Esta acción no se puede deshacer."
        confirmLabel="Sí, empezar de cero"
        cancelLabel="Cancelar"
        variant="reset"
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Club Badge and Identity Customizer Modal */}
      <ClubBadgeEditorModal
        isOpen={isClubModalOpen}
        onClose={() => setIsClubModalOpen(false)}
        currentProfile={clubProfile}
        onSave={handleSaveClubProfile}
      />

      {/* Staff Security PIN Modal (protects Staff Dashboard) */}
      <StaffPinModal
        isOpen={isStaffPinModalOpen}
        onClose={() => setIsStaffPinModalOpen(false)}
        onSuccess={handleStaffPinSuccess}
      />

      {/* Feedback Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 bg-white border-2 border-red-500 text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean Sports Footer */}
      <footer className="border-t border-red-200 bg-slate-50 py-4 px-4 text-center text-xs text-slate-600 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-red-600" />
            <span>Ficha Inicial de Temporada · Gestión Técnica y Táctica de Plantilla</span>
          </p>
          <p className="text-[11px] text-slate-500">
            Diseñado para dispositivos móviles y cuerpo técnico profesional
          </p>
        </div>
      </footer>
    </div>
  );
}
