export type Language = 'es' | 'en';

export interface Translations {
  common: {
    language: string;
    spanish: string;
    english: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    close: string;
    loading: string;
    yes: string;
    no: string;
    optional: string;
  };
  header: {
    playerForm: string;
    coachingStaff: string;
    draftSaved: string;
    startOver: string;
    reset: string;
    logOutStaff: string;
    staffProtectedTitle: string;
    editClubTitle: string;
    editClubWithPinTitle: string;
    changeCrestTitle: string;
    defaultSheetTitle: string;
    defaultSheetSubtitle: string;
  };
  nav: {
    privacyNotice: string;
    footerTitle: string;
    footerSubtitle: string;
    stepOf: string;
    completed: string;
    prevStep: string;
    back: string;
    nextStep: string;
    reviewSummary: string;
    startOverDraft: string;
  };
  stepsMeta: {
    step1: { title: string; shortTitle: string; description: string };
    step2: { title: string; shortTitle: string; description: string };
    step3: { title: string; shortTitle: string; description: string };
    step4: { title: string; shortTitle: string; description: string };
    step5: { title: string; shortTitle: string; description: string };
    step6: { title: string; shortTitle: string; description: string };
    step7: { title: string; shortTitle: string; description: string };
  };
  step1: {
    title: string;
    fullName: string;
    fullNamePlaceholder: string;
    nickname: string;
    nicknamePlaceholder: string;
    dorsal: string;
    dorsalPlaceholder: string;
    position: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    partnerQuestion: string;
    childrenQuestion: string;
    childrenZero: string;
    childrenOne: string;
    childrenTwo: string;
    childrenThreePlus: string;
    childrenAges: string;
    childrenAgesPlaceholder: string;
  };
  step2: {
    title: string;
    subtitle: string;
    selectPrompt: string;
    noneSelected: string;
    selectedCount: string;
    otherSpecify: string;
    otherPlaceholder: string;
  };
  step3: {
    title: string;
    offensiveSection: string;
    foulsCorners: string;
    foulsCornersDesc?: string;
    header: string;
    headerDesc?: string;
    memorizePlays: string;
    memorizePlaysDesc?: string;
    defensiveSection: string;
    manMarking: string;
    manMarkingDesc?: string;
    zonalDefense: string;
    zonalDefenseDesc?: string;
  };
  step4: {
    title: string;
    illusionLabel: string;
    illusionLow: string;
    illusionHigh: string;
    personalitySection: string;
    positiveTraits: string;
    positiveTraitsPlaceholder: string;
    improvementTraits: string;
    improvementTraitsPlaceholder: string;
    tacticalSection: string;
    tacticalStrengths: string;
    tacticalStrengthsPlaceholder: string;
    tacticalImprovements: string;
    tacticalImprovementsPlaceholder: string;
    tacticalSystemsTitle: string;
    tacticalSystemsSubtitle: string;
    tacticalSystemsInstruction: string;
    clearPitch: string;
    selectPreference: string;
    removeAssignment: string;
    preferenceLabel: string;
    pitchUnassigned: string;
    system4141Count: string;
    system13232Count: string;
  };
  step5: {
    title: string;
    block1Title: string;
    notStarting: string;
    notStartingLow: string;
    notStartingHigh: string;
    substituted: string;
    substitutedLow: string;
    substitutedHigh: string;
    block2Title: string;
    pitchTraining: string;
    pitchTrainingLow: string;
    pitchTrainingHigh: string;
    gymWork: string;
    gymWorkLow: string;
    gymWorkHigh: string;
    selfCare: string;
    selfCareLow: string;
    selfCareHigh: string;
    block3Title: string;
    physicalScore: string;
    physicalScoreLow: string;
    physicalScoreHigh: string;
    scorePrefix: string;
  };
  step6: {
    title: string;
    individualGoal: string;
    individualGoalPlaceholder: string;
    collectiveGoal: string;
    collectiveGoalPlaceholder: string;
    referent: string;
    referentPlaceholder: string;
  };
  step7: {
    title: string;
    edit: string;
    notSpecified: string;
    childrenFormat: (count: number, ages: string) => string;
    externalHelpNone: string;
    strengthsLabel: string;
    improvementsLabel: string;
    systemPositionsAssigned: (count: number) => string;
    submitBtn: string;
    submittingBtn: string;
    disclaimer: string;
  };
  validation: {
    fullNameRequired: string;
    fullNameValid: string;
    phoneRequired: string;
    phoneValid: string;
    emailRequired: string;
    emailValid: string;
    partnerRequired: string;
    childrenAgesRequired: string;
    externalHelpsRequired: string;
    externalHelpOtherRequired: string;
    abpFoulsRequired: string;
    abpHeaderRequired: string;
    abpMemorizeRequired: string;
    abpManMarkingRequired: string;
    abpZoneRequired: string;
    positiveTraitsRequired: string;
    improvementTraitsRequired: string;
    tacticalStrengthsRequired: string;
    tacticalImprovementsRequired: string;
    individualGoalRequired: string;
    collectiveGoalRequired: string;
    referentRequired: string;
  };
  success: {
    heroTitle: string;
    heroSubtitle: (name: string) => string;
    badge: string;
    autoResetNotice: string;
    autoResetTitle: string;
    quoteTitle: string;
    quoteText: string;
    collectiveGoalLabel: string;
    defaultCollectiveGoal: string;
    newFormBtn: string;
    abpOffensiveLabel: string;
    abpDefensiveLabel: string;
    physicalPrepLabel: string;
    roleTaker: string;
    roleHeader: string;
    roleSupport: string;
    roleMan: string;
    roleZone: string;
    roleFlexible: string;
  };
  staffDashboard: {
    title: string;
    subtitle: string;
    totalPlayers: string;
    avgIllusion: string;
    avgCommitment: string;
    abpTakers: string;
    headers: string;
    withExternalHelp: string;
    searchPlaceholder: string;
    allPositions: string;
    allABP: string;
    abpTakersFilter: string;
    headersFilter: string;
    exportCsv: string;
    exportDossier: string;
    clubBrandBtn: string;
    backToForm: string;
    lockStaff: string;
    syncSupabase: string;
    syncing: string;
    viewCard: string;
    deletePlayer: string;
    noPlayersTitle: string;
    noPlayersSubtitle: string;
    playerCountFound: (count: number) => string;
    coachNotes: string;
    saveNotes: string;
    notesSaved: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: (name: string) => string;
    deleteConfirmBtn: string;
  };
  modals: {
    resetConfirmTitle: string;
    resetConfirmMessage: string;
    resetConfirmBtn: string;
    staffPinTitle: string;
    staffPinSubtitle: string;
    pinPlaceholder: string;
    rememberDevice: string;
    accessBtn: string;
    changePinBtn: string;
    invalidPin: string;
    newPinLabel: string;
    confirmPinLabel: string;
    saveNewPinBtn: string;
    pinChangedSuccess: string;
    clubEditorTitle: string;
    clubEditorSubtitle: string;
    clubNameLabel: string;
    clubNamePlaceholder: string;
    subheadingLabel: string;
    crestLabel: string;
    dragOrBrowse: string;
    orUrl: string;
    urlPlaceholder: string;
    saveChanges: string;
    resetDefault: string;
    editLookupTitle: string;
    editLookupSubtitle: string;
    editLookupPrivacy: string;
    editLookupNameLabel: string;
    editLookupNamePlaceholder: string;
    editLookupPhoneLabel: string;
    editLookupPhonePlaceholder: string;
    editLookupPhoneHelp: string;
    editLookupSubmit: string;
    editLookupSearching: string;
    editLookupErrorName: string;
    editLookupErrorPhone: string;
    editLookupNotFound: string;
  };
  positions: Record<string, string>;
  externalHelps: Record<string, string>;
}

export const translations: Record<Language, Translations> = {
  es: {
    common: {
      language: 'Idioma',
      spanish: 'Español',
      english: 'Inglés',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      close: 'Cerrar',
      loading: 'Cargando...',
      yes: 'Sí',
      no: 'No',
      optional: '(Opcional)',
    },
    header: {
      playerForm: 'Ficha Jugador',
      coachingStaff: 'Cuerpo Técnico',
      draftSaved: 'Borrador guardado',
      startOver: 'Empezar de cero',
      reset: 'Reiniciar',
      logOutStaff: 'Cerrar sesión del Cuerpo Técnico y bloquear acceso',
      staffProtectedTitle: 'Acceso protegido por clave para el Cuerpo Técnico',
      editClubTitle: 'Editar nombre y escudo del club',
      editClubWithPinTitle: 'Editar nombre y escudo del club (Solo Cuerpo Técnico con PIN)',
      changeCrestTitle: 'Haz clic para cambiar el escudo del club',
      defaultSheetTitle: 'Ficha Inicial de Temporada',
      defaultSheetSubtitle: 'Información y Compromiso del Futbolista · Plantilla',
    },
    nav: {
      privacyNotice: 'Completa tu ficha antes de iniciar la pretemporada. Tus datos son privados y se envían directamente al cuerpo técnico.',
      footerTitle: 'Ficha Inicial de Temporada · Gestión Técnica y Táctica de Plantilla',
      footerSubtitle: 'Diseñado para dispositivos móviles y cuerpo técnico profesional',
      stepOf: 'Paso {current} de {total}',
      completed: 'completado',
      prevStep: 'Paso Anterior',
      back: 'Atrás',
      nextStep: 'Siguiente Paso',
      reviewSummary: 'Revisar Resumen',
      startOverDraft: 'Empezar de cero y borrar borrador',
    },
    stepsMeta: {
      step1: {
        title: 'Datos Personales y Familiares',
        shortTitle: 'Personal',
        description: 'Información básica de contacto, entorno personal y familiar.',
      },
      step2: {
        title: 'Entorno y Rendimiento Externo',
        shortTitle: 'Ayudas Ext.',
        description: 'Profesionales y apoyos con los que trabajas fuera del club.',
      },
      step3: {
        title: 'Acciones a Balón Parado (ABP)',
        shortTitle: 'ABP',
        description: 'Tus fortalezas y preferencias en jugadas de estrategia.',
      },
      step4: {
        title: 'Psicología y Aspecto Técnico-Táctico',
        shortTitle: 'Psicología',
        description: 'Nivel de ilusión, rasgos de personalidad y juego.',
      },
      step5: {
        title: 'Compromiso, Hábitos y Preferencias',
        shortTitle: 'Compromiso',
        description: 'Gestión de minutos, trabajo invisible y preparación física.',
      },
      step6: {
        title: 'Metas e Inspiración',
        shortTitle: 'Metas',
        description: 'Tus objetivos individuales, de equipo y referentes deportivos.',
      },
      step7: {
        title: 'Resumen y Confirmación',
        shortTitle: 'Confirmación',
        description: 'Revisa todos tus datos antes del envío al cuerpo técnico.',
      },
    },
    step1: {
      title: 'Datos Personales y Familiares',
      fullName: 'Nombre completo',
      fullNamePlaceholder: 'Ej. Carlos Mendoza Gil',
      nickname: 'Apodo / Nombre deportivo',
      nicknamePlaceholder: 'Ej. Charlie, El Rayo',
      dorsal: 'Dorsal',
      dorsalPlaceholder: 'Ej. 10',
      position: 'Posición habitual',
      phone: 'Teléfono móvil',
      phonePlaceholder: 'Ej. +34 600 123 456',
      email: 'Dirección de correo electrónico',
      emailPlaceholder: 'Ej. jugador@correo.com',
      partnerQuestion: '¿Tienes pareja?',
      childrenQuestion: 'Hijos',
      childrenZero: '0',
      childrenOne: '1',
      childrenTwo: '2',
      childrenThreePlus: '3 o más',
      childrenAges: 'Edades de los hijos',
      childrenAgesPlaceholder: 'Ej. 3 y 6 años / 8 meses',
    },
    step2: {
      title: 'Entorno y Rendimiento Externo',
      subtitle: 'Ayudas externas',
      selectPrompt: 'Selecciona todas las que apliquen:',
      noneSelected: 'Ninguna seleccionada',
      selectedCount: 'seleccionada(s)',
      otherSpecify: 'Especifica qué otra ayuda externa utilizas:',
      otherPlaceholder: 'Ej. Podólogo deportivo, osteópata, entrenador de fuerza...',
    },
    step3: {
      title: 'Acciones a Balón Parado (ABP)',
      offensiveSection: 'ABP Ofensivo',
      foulsCorners: 'Lanzador de faltas directas / córners',
      header: 'Rematador de área',
      memorizePlays: 'Capacidad para memorizar jugadas ensayadas',
      defensiveSection: 'ABP Defensivo',
      manMarking: 'Marcador al hombre',
      zonalDefense: 'Defensor en zona',
    },
    step4: {
      title: 'Psicología, Personalidad y Análisis Técnico-Táctico',
      illusionLabel: 'Grado de ilusión para esta temporada',
      illusionLow: '0 (Desmotivado)',
      illusionHigh: '10 (Máxima ilusión)',
      personalitySection: 'Personalidad dentro y fuera del campo',
      positiveTraits: 'Enumera 1 o 2 rasgos positivos de tu personalidad',
      positiveTraitsPlaceholder: 'Ej. Soy muy solidario con el compañero en apuros, transmito calma en momentos de tensión y tengo mentalidad ganadora...',
      improvementTraits: 'Enumera 1 o 2 rasgos de tu personalidad que mejorarías',
      improvementTraitsPlaceholder: 'Ej. A veces me cuesta digerir un error puntual, tiendo a sobrepensar o me pongo impaciente con las decisiones arbitrales...',
      tacticalSection: 'Análisis Técnico-Táctico',
      tacticalStrengths: '1 o 2 características técnico-tácticas en las que destacas',
      tacticalStrengthsPlaceholder: 'Ej. Visión periférica de juego, primer toque rápido para salir de presión, cambio de orientación preciso...',
      tacticalImprovements: '1 o 2 características técnico-tácticas a mejorar esta temporada',
      tacticalImprovementsPlaceholder: 'Ej. Salida con pierna menos hábil, timing en los duelos aéreos, mayor agresividad en la presión tras pérdida...',
      tacticalSystemsTitle: 'Sistemas de Juego y Posicionamiento Táctico',
      tacticalSystemsSubtitle: 'Sistemas 1-4-1-4-1 y 1-3-2-3-2 · Círculos en blanco para numerar del 1 al 9',
      tacticalSystemsInstruction: 'Colócate por orden de preferencia (Nº dentro del circulo) donde crees que puedes rendir en estos dos sistemas (1 Máximo rendimiento, 2, 3....)',
      clearPitch: 'Limpiar campo',
      selectPreference: 'Selecciona preferencia (1 = Máxima):',
      removeAssignment: 'Quitar asignación',
      preferenceLabel: 'Preferencia',
      pitchUnassigned: 'Sin asignar',
      system4141Count: '1-4-1-4-1',
      system13232Count: '1-3-2-3-2',
    },
    step5: {
      title: 'Compromiso, Hábitos y Preferencias',
      block1Title: 'Gestión de Roles y Resiliencia (0 a 10)',
      notStarting: '1. No eres titular en varios partidos seguidos',
      notStartingLow: '0 (Baja actitud)',
      notStartingHigh: '10 (Máximo empuje)',
      substituted: '2. Eres sustituido en varios partidos seguidos',
      substitutedLow: '0 (Frustración desmedida)',
      substitutedHigh: '10 (Compromiso y respeto total)',
      block2Title: 'Preferencias en el Día a Día (0 a 10)',
      pitchTraining: 'Entrenamiento en campo de fútbol',
      pitchTrainingLow: '0 (Poco gusto)',
      pitchTrainingHigh: '10 (Máximo disfrute)',
      gymWork: 'Trabajo de fuerza y gimnasio',
      gymWorkLow: '0 (Poco gusto)',
      gymWorkHigh: '10 (Máximo disfrute)',
      selfCare: 'Cuidado personal (Entrenamiento invisible)',
      selfCareLow: '0 (Me cuesta mucho)',
      selfCareHigh: '10 (Muy riguroso y constante)',
      block3Title: 'Estado de Forma de Partida (0 a 10)',
      physicalScore: '¿Con qué nivel de preparación física llegas al inicio de la pretemporada?',
      physicalScoreLow: '0 (Desentrenado)',
      physicalScoreHigh: '10 (En plena forma física)',
      scorePrefix: 'Puntuación:',
    },
    step6: {
      title: 'Metas e Inspiración',
      individualGoal: 'Objetivo individual para la temporada',
      individualGoalPlaceholder: 'Ej. Consolidarme en el once inicial, superar mi marca de 10 asistencias y ser más regular los 90 minutos...',
      collectiveGoal: 'Objetivo colectivo para la temporada',
      collectiveGoalPlaceholder: 'Ej. Clasificarnos para la fase de ascenso, ser el equipo más solidario de la liga y hacernos invencibles en casa...',
      referent: 'Jugador y/o deportista favorito / referente',
      referentPlaceholder: 'Ej. Luka Modrić, Carles Puyol, Rafa Nadal, Kobe Bryant...',
    },
    step7: {
      title: 'Resumen y Confirmación Final',
      edit: 'Editar',
      notSpecified: 'No especificado',
      childrenFormat: (count, ages) => (count === 0 ? '0 hijos' : `${count === 3 ? '3 o más' : count} (${ages || 'Edades no indicadas'})`),
      externalHelpNone: 'Ninguna ayuda externa declarada',
      strengthsLabel: 'Fortalezas:',
      improvementsLabel: 'A mejorar:',
      systemPositionsAssigned: (count) => `${count} posición/es asignadas`,
      submitBtn: 'Confirmar y Enviar Ficha al Cuerpo Técnico',
      submittingBtn: 'Enviando al sistema...',
      disclaimer: 'Al enviar esta ficha, confirmas que los datos facilitados son veraces y serán utilizados exclusivamente por el cuerpo técnico y médico del club para la planificación deportiva y seguimiento de la temporada.',
    },
    validation: {
      fullNameRequired: 'El nombre completo es obligatorio.',
      fullNameValid: 'Introduce nombre y apellidos válidos.',
      phoneRequired: 'El teléfono de contacto es obligatorio.',
      phoneValid: 'Introduce un número de teléfono válido.',
      emailRequired: 'El correo electrónico es obligatorio.',
      emailValid: 'Introduce una dirección de correo válida (ej. nombre@correo.com).',
      partnerRequired: 'Por favor, indica si tienes pareja.',
      childrenAgesRequired: 'Indica la edad o edades de tus hijos.',
      externalHelpsRequired: 'Selecciona al menos una opción o marca "Ninguna".',
      externalHelpOtherRequired: 'Especifica qué otra ayuda externa utilizas.',
      abpFoulsRequired: 'Indica si eres lanzador de faltas/córners.',
      abpHeaderRequired: 'Indica si eres rematador en el área.',
      abpMemorizeRequired: 'Indica tu capacidad para memorizar jugadas ensayadas.',
      abpManMarkingRequired: 'Indica si marcas al hombre.',
      abpZoneRequired: 'Indica si defiendes en zona.',
      positiveTraitsRequired: 'Indica al menos un rasgo positivo de tu personalidad.',
      improvementTraitsRequired: 'Indica un rasgo de tu personalidad que te gustaría mejorar.',
      tacticalStrengthsRequired: 'Indica en qué características técnico-tácticas destacas.',
      tacticalImprovementsRequired: 'Indica qué aspecto técnico-táctico deseas pulir esta temporada.',
      individualGoalRequired: 'Escribe tu meta individual para este año.',
      collectiveGoalRequired: 'Escribe tu objetivo para el equipo.',
      referentRequired: 'Indica un deportista o jugador referente.',
    },
    success: {
      heroTitle: '¡FICHA ENVIADA AL CUERPO TÉCNICO!',
      heroSubtitle: (name) => `Gracias, ${name}. Tus respuestas han quedado registradas de forma confidencial en el sistema del cuerpo técnico.`,
      badge: 'Ficha registrada con éxito',
      autoResetNotice: 'El formulario se ha restablecido automáticamente en blanco para preservar la privacidad de tus datos.',
      autoResetTitle: 'Formulario en blanco:',
      quoteTitle: 'Compromiso e Ilusión',
      quoteText: '"El talento gana partidos, pero el trabajo en equipo y el compromiso ganan campeonatos."',
      collectiveGoalLabel: 'Objetivo colectivo:',
      defaultCollectiveGoal: 'Dar el 100% cada partido',
      newFormBtn: 'Rellenar otra ficha',
      abpOffensiveLabel: 'ABP Ofensivo',
      abpDefensiveLabel: 'ABP Defensivo',
      physicalPrepLabel: 'Forma Física',
      roleTaker: 'Lanzador',
      roleHeader: 'Rematador',
      roleSupport: 'Apoyo',
      roleMan: 'Hombre',
      roleZone: 'Zona',
      roleFlexible: 'Flexible',
    },
    staffDashboard: {
      title: 'Panel del Cuerpo Técnico',
      subtitle: 'Gestión técnica, táctica y psicológica de la plantilla',
      totalPlayers: 'Jugadores registrados',
      avgIllusion: 'Ilusión media',
      avgCommitment: 'Compromiso medio',
      abpTakers: 'Lanzadores ABP',
      headers: 'Rematadores área',
      withExternalHelp: 'Con ayuda externa',
      searchPlaceholder: 'Buscar por nombre, apodo o dorsal...',
      allPositions: 'Todas las posiciones',
      allABP: 'Todos los perfiles ABP',
      abpTakersFilter: 'Lanzadores ABP',
      headersFilter: 'Rematadores de área',
      exportCsv: 'Exportar CSV / Excel',
      exportDossier: 'Descargar Dossier Plantilla PDF',
      clubBrandBtn: 'Nombre y Escudo',
      backToForm: 'Volver a Ficha Jugador',
      lockStaff: 'Bloquear acceso',
      syncSupabase: 'Sincronizar Supabase',
      syncing: 'Sincronizando...',
      viewCard: 'Ver ficha completa',
      deletePlayer: 'Eliminar jugador',
      noPlayersTitle: 'No se encontraron jugadores',
      noPlayersSubtitle: 'Aún no hay fichas enviadas o no coinciden con los filtros seleccionados.',
      playerCountFound: (count) => `Mostrando ${count} jugador(es)`,
      coachNotes: 'Notas privadas del cuerpo técnico:',
      saveNotes: 'Guardar notas',
      notesSaved: 'Notas guardadas correctamente',
      deleteConfirmTitle: '¿Eliminar ficha de jugador?',
      deleteConfirmMessage: (name) => `¿Estás seguro de que deseas eliminar permanentemente la ficha de ${name}? Esta acción no se puede deshacer.`,
      deleteConfirmBtn: 'Sí, eliminar ficha',
    },
    modals: {
      resetConfirmTitle: '¿Empezar de cero?',
      resetConfirmMessage: 'Se borrarán todos los datos introducidos en el formulario y volverás al Paso 1 con la ficha limpia. Esta acción no se puede deshacer.',
      resetConfirmBtn: 'Sí, empezar de cero',
      staffPinTitle: 'Acceso al Cuerpo Técnico',
      staffPinSubtitle: 'Introduce el PIN de seguridad de 4 a 6 dígitos para acceder al panel.',
      pinPlaceholder: 'Introduce el PIN',
      rememberDevice: 'Recordar este dispositivo (no volver a pedir PIN)',
      accessBtn: 'Acceder al Panel',
      changePinBtn: 'Cambiar clave de acceso',
      invalidPin: 'PIN incorrecto. Inténtalo de nuevo.',
      newPinLabel: 'Nuevo PIN (mínimo 4 caracteres)',
      confirmPinLabel: 'Confirmar nuevo PIN',
      saveNewPinBtn: 'Guardar nuevo PIN',
      pinChangedSuccess: '¡PIN actualizado con éxito!',
      clubEditorTitle: 'Identidad y Escudo del Club',
      clubEditorSubtitle: 'Personaliza el nombre del club y el escudo oficial que presidirá la aplicación y los informes PDF.',
      clubNameLabel: 'Nombre oficial del Club',
      clubNamePlaceholder: 'Ej. Real Club Deportivo...',
      subheadingLabel: 'Subtítulo / Encabezado de la ficha',
      crestLabel: 'Escudo del Club',
      dragOrBrowse: 'Arrastra una imagen aquí o haz clic para seleccionarla',
      orUrl: 'O pega la URL directa de la imagen:',
      urlPlaceholder: 'https://ejemplo.com/escudo.png',
      saveChanges: 'Guardar cambios',
      resetDefault: 'Restablecer por defecto',
      editLookupTitle: 'Editar mi Ficha de Jugador',
      editLookupSubtitle: 'Recupera tu propia ficha de forma segura',
      editLookupPrivacy: 'Por privacidad hacia tus compañeros, únicamente podrás acceder a tu propia ficha. Introduce tus datos de identificación para cargarla en el formulario.',
      editLookupNameLabel: 'Tu Nombre completo o Apodo deportivo',
      editLookupNamePlaceholder: 'Ej: Carlos García o "Carli"',
      editLookupPhoneLabel: 'Tu Teléfono de contacto o Dorsal',
      editLookupPhonePlaceholder: 'Ej: 612345678 o 10',
      editLookupPhoneHelp: 'Utilizado para verificar que la ficha te pertenece.',
      editLookupSubmit: 'Cargar mi ficha para editar',
      editLookupSearching: 'Buscando tu ficha...',
      editLookupErrorName: 'Introduce tu nombre o apodo para localizar tu ficha.',
      editLookupErrorPhone: 'Introduce tu teléfono de contacto o tu dorsal para verificar tu identidad.',
      editLookupNotFound: 'No se encontró ninguna ficha con esos datos. Comprueba que el nombre y el teléfono o dorsal coincidan con los que introdujiste al enviar tu ficha.',
    },
    positions: {
      'Portero': 'Portero',
      'Defensa Central': 'Defensa Central',
      'Lateral Derecho': 'Lateral Derecho',
      'Lateral Izquierdo': 'Lateral Izquierdo',
      'Pivote / Mediocentro Defensivo': 'Pivote / Mediocentro Defensivo',
      'Mediocentro Organizador': 'Mediocentro Organizador',
      'Mediapunta / Interior': 'Mediapunta / Interior',
      'Extremo Derecho': 'Extremo Derecho',
      'Extremo Izquierdo': 'Extremo Izquierdo',
      'Delantero Centro': 'Delantero Centro',
    },
    externalHelps: {
      'Entrenador personal': 'Entrenador personal',
      'Coach / Psicólogo deportivo': 'Coach / Psicólogo deportivo',
      'Fisioterapeuta / Readaptador externo': 'Fisioterapeuta / Readaptador externo',
      'Nutricionista': 'Nutricionista',
      'Otros': 'Otros',
      'Ninguna': 'Ninguna',
    },
  },
  en: {
    common: {
      language: 'Language',
      spanish: 'Spanish',
      english: 'English',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      close: 'Close',
      loading: 'Loading...',
      yes: 'Yes',
      no: 'No',
      optional: '(Optional)',
    },
    header: {
      playerForm: 'Player Form',
      coachingStaff: 'Coaching Staff',
      draftSaved: 'Draft saved',
      startOver: 'Start over',
      reset: 'Reset',
      logOutStaff: 'Log out from Coaching Staff and lock access',
      staffProtectedTitle: 'Password protected access for Coaching Staff',
      editClubTitle: 'Edit club name and crest',
      editClubWithPinTitle: 'Edit club name and crest (Coaching Staff only with PIN)',
      changeCrestTitle: 'Click to change club crest',
      defaultSheetTitle: 'Season Initial Form',
      defaultSheetSubtitle: 'Player Information & Commitment · Squad',
    },
    nav: {
      privacyNotice: 'Complete your form before starting pre-season. Your responses are private and sent directly to the coaching staff.',
      footerTitle: 'Season Initial Form · Squad Technical & Tactical Management',
      footerSubtitle: 'Designed for mobile devices and professional coaching staff',
      stepOf: 'Step {current} of {total}',
      completed: 'completed',
      prevStep: 'Previous Step',
      back: 'Back',
      nextStep: 'Next Step',
      reviewSummary: 'Review Summary',
      startOverDraft: 'Start over and clear draft',
    },
    stepsMeta: {
      step1: {
        title: 'Personal & Family Details',
        shortTitle: 'Personal',
        description: 'Basic contact information, personal and family background.',
      },
      step2: {
        title: 'External Environment & Support',
        shortTitle: 'Ext. Support',
        description: 'Professionals and external support you work with outside the club.',
      },
      step3: {
        title: 'Set Pieces (ABP)',
        shortTitle: 'Set Pieces',
        description: 'Your strengths and preferences in strategic set-piece plays.',
      },
      step4: {
        title: 'Psychology & Technical-Tactical Analysis',
        shortTitle: 'Psychology',
        description: 'Motivation level, personality traits and style of play.',
      },
      step5: {
        title: 'Commitment, Habits & Preferences',
        shortTitle: 'Commitment',
        description: 'Minutes management, invisible training and physical preparation.',
      },
      step6: {
        title: 'Goals & Inspiration',
        shortTitle: 'Goals',
        description: 'Your individual and team goals, plus sporting role models.',
      },
      step7: {
        title: 'Summary & Confirmation',
        shortTitle: 'Confirmation',
        description: 'Review all your information before submitting to the coaching staff.',
      },
    },
    step1: {
      title: 'Personal & Family Details',
      fullName: 'Full Name',
      fullNamePlaceholder: 'E.g. Carlos Mendoza Gil',
      nickname: 'Nickname / Sporting Name',
      nicknamePlaceholder: 'E.g. Charlie, The Flash',
      dorsal: 'Jersey #',
      dorsalPlaceholder: 'E.g. 10',
      position: 'Preferred Position',
      phone: 'Mobile Phone',
      phonePlaceholder: 'E.g. +34 600 123 456',
      email: 'Email Address',
      emailPlaceholder: 'E.g. player@email.com',
      partnerQuestion: 'Do you have a partner?',
      childrenQuestion: 'Children',
      childrenZero: '0',
      childrenOne: '1',
      childrenTwo: '2',
      childrenThreePlus: '3 or more',
      childrenAges: "Children's ages",
      childrenAgesPlaceholder: 'E.g. 3 and 6 years old / 8 months',
    },
    step2: {
      title: 'External Environment & Support',
      subtitle: 'External support',
      selectPrompt: 'Select all that apply:',
      noneSelected: 'None selected',
      selectedCount: 'selected',
      otherSpecify: 'Specify what other external support or professional you use:',
      otherPlaceholder: 'E.g. Sports podiatrist, osteopath, strength coach...',
    },
    step3: {
      title: 'Set Pieces (ABP)',
      offensiveSection: 'Offensive Set Pieces',
      foulsCorners: 'Direct free kick / corner taker',
      header: 'Penalty box header / finisher',
      memorizePlays: 'Ability to memorize set-piece routines',
      defensiveSection: 'Defensive Set Pieces',
      manMarking: 'Man-to-man marker',
      zonalDefense: 'Zonal defender',
    },
    step4: {
      title: 'Psychology, Personality & Technical-Tactical Analysis',
      illusionLabel: 'Motivation level for this season',
      illusionLow: '0 (Unmotivated)',
      illusionHigh: '10 (Maximum excitement)',
      personalitySection: 'Personality on and off the pitch',
      positiveTraits: 'List 1 or 2 positive personality traits',
      positiveTraitsPlaceholder: 'E.g. I am very supportive of teammates, stay composed under pressure and possess a winning mindset...',
      improvementTraits: 'List 1 or 2 personality traits you would like to improve',
      improvementTraitsPlaceholder: 'E.g. Sometimes I dwell on individual errors, tend to overthink or get impatient with referee calls...',
      tacticalSection: 'Technical-Tactical Analysis',
      tacticalStrengths: '1 or 2 technical-tactical characteristics where you excel',
      tacticalStrengthsPlaceholder: 'E.g. Peripheral pitch vision, quick first touch to beat high press, accurate switch of play...',
      tacticalImprovements: '1 or 2 technical-tactical characteristics to refine this season',
      tacticalImprovementsPlaceholder: 'E.g. Weak foot exit, timing in aerial duels, higher intensity in counter-pressing...',
      tacticalSystemsTitle: 'Game Systems & Tactical Positioning',
      tacticalSystemsSubtitle: 'Systems 1-4-1-4-1 and 1-3-2-3-2 · Number circles from 1 to 9 in order of preference',
      tacticalSystemsInstruction: 'Place yourself in order of preference (Number inside circle) where you perform best in these two systems (1 Highest performance, 2, 3...)',
      clearPitch: 'Clear pitch',
      selectPreference: 'Select preference (1 = Highest):',
      removeAssignment: 'Unassign position',
      preferenceLabel: 'Preference',
      pitchUnassigned: 'Unassigned',
      system4141Count: '1-4-1-4-1',
      system13232Count: '1-3-2-3-2',
    },
    step5: {
      title: 'Commitment, Habits & Preferences',
      block1Title: 'Role Management & Resilience (0 to 10)',
      notStarting: '1. You are not a starter for several consecutive matches',
      notStartingLow: '0 (Poor attitude)',
      notStartingHigh: '10 (Maximum drive)',
      substituted: '2. You are substituted in several consecutive matches',
      substitutedLow: '0 (Excessive frustration)',
      substitutedHigh: '10 (Total commitment & respect)',
      block2Title: 'Daily Work Preferences (0 to 10)',
      pitchTraining: 'On-pitch football training',
      pitchTrainingLow: '0 (Dislike)',
      pitchTrainingHigh: '10 (Maximum enjoyment)',
      gymWork: 'Strength & gym conditioning',
      gymWorkLow: '0 (Dislike)',
      gymWorkHigh: '10 (Maximum enjoyment)',
      selfCare: 'Self-care (Invisible training: rest, nutrition, recovery)',
      selfCareLow: '0 (Very hard for me)',
      selfCareHigh: '10 (Very disciplined & consistent)',
      block3Title: 'Starting Physical Condition (0 to 10)',
      physicalScore: 'What physical fitness level do you arrive with at pre-season start?',
      physicalScoreLow: '0 (Untrained)',
      physicalScoreHigh: '10 (Peak physical shape)',
      scorePrefix: 'Score:',
    },
    step6: {
      title: 'Goals & Inspiration',
      individualGoal: 'Individual goal for the season',
      individualGoalPlaceholder: 'E.g. Secure a starting spot, deliver 10+ assists and maintain consistent 90-minute intensity...',
      collectiveGoal: 'Collective team goal for the season',
      collectiveGoalPlaceholder: 'E.g. Qualify for the promotion playoffs, be the most united team in the league and remain unbeaten at home...',
      referent: 'Favorite athlete / role model',
      referentPlaceholder: 'E.g. Luka Modrić, Carles Puyol, Rafa Nadal, Kobe Bryant...',
    },
    step7: {
      title: 'Summary & Final Confirmation',
      edit: 'Edit',
      notSpecified: 'Not specified',
      childrenFormat: (count, ages) => (count === 0 ? '0 children' : `${count === 3 ? '3 or more' : count} (${ages || 'Ages not specified'})`),
      externalHelpNone: 'No external support declared',
      strengthsLabel: 'Strengths:',
      improvementsLabel: 'To improve:',
      systemPositionsAssigned: (count) => `${count} position(s) assigned`,
      submitBtn: 'Confirm & Submit Form to Coaching Staff',
      submittingBtn: 'Submitting to system...',
      disclaimer: 'By submitting this form, you confirm that all provided details are truthful and will be used exclusively by the coaching and medical staff for sporting planning and season follow-up.',
    },
    validation: {
      fullNameRequired: 'Full name is required.',
      fullNameValid: 'Please enter a valid first and last name.',
      phoneRequired: 'Contact phone number is required.',
      phoneValid: 'Please enter a valid phone number.',
      emailRequired: 'Email address is required.',
      emailValid: 'Please enter a valid email address (e.g. name@email.com).',
      partnerRequired: 'Please indicate whether you have a partner.',
      childrenAgesRequired: "Please specify your children's ages.",
      externalHelpsRequired: 'Select at least one option or choose "None".',
      externalHelpOtherRequired: 'Please specify what other external support you use.',
      abpFoulsRequired: 'Indicate whether you take free kicks/corners.',
      abpHeaderRequired: 'Indicate whether you are an aerial finisher in the box.',
      abpMemorizeRequired: 'Indicate your ability to memorize tactical set-piece routines.',
      abpManMarkingRequired: 'Indicate whether you mark man-to-man.',
      abpZoneRequired: 'Indicate whether you defend zonally.',
      positiveTraitsRequired: 'List at least one positive personality trait.',
      improvementTraitsRequired: 'List at least one personality trait you wish to improve.',
      tacticalStrengthsRequired: 'Indicate which technical-tactical characteristics you excel at.',
      tacticalImprovementsRequired: 'Indicate which technical-tactical aspect you wish to refine.',
      individualGoalRequired: 'Please state your individual goal for this year.',
      collectiveGoalRequired: 'Please state your collective goal for the team.',
      referentRequired: 'Please name a sporting role model or favorite athlete.',
    },
    success: {
      heroTitle: 'FORM SUBMITTED TO COACHING STAFF!',
      heroSubtitle: (name) => `Thank you, ${name}. Your responses have been securely recorded in the coaching staff system.`,
      badge: 'Form registered successfully',
      autoResetNotice: 'The form has been automatically reset to blank to preserve your privacy.',
      autoResetTitle: 'Blank form:',
      quoteTitle: 'Commitment & Passion',
      quoteText: '"Talent wins games, but teamwork and intelligence win championships."',
      collectiveGoalLabel: 'Collective goal:',
      defaultCollectiveGoal: 'Give 100% every single match',
      newFormBtn: 'Fill another form',
      abpOffensiveLabel: 'Offensive ABP',
      abpDefensiveLabel: 'Defensive ABP',
      physicalPrepLabel: 'Physical Shape',
      roleTaker: 'Taker',
      roleHeader: 'Finisher',
      roleSupport: 'Support',
      roleMan: 'Man-mark',
      roleZone: 'Zonal',
      roleFlexible: 'Flexible',
    },
    staffDashboard: {
      title: 'Coaching Staff Dashboard',
      subtitle: 'Technical, tactical and psychological squad management',
      totalPlayers: 'Registered players',
      avgIllusion: 'Avg. Motivation',
      avgCommitment: 'Avg. Commitment',
      abpTakers: 'Set Piece Takers',
      headers: 'Box Headers',
      withExternalHelp: 'With External Support',
      searchPlaceholder: 'Search by name, nickname or jersey #...',
      allPositions: 'All positions',
      allABP: 'All ABP profiles',
      abpTakersFilter: 'Set Piece Takers',
      headersFilter: 'Box Headers',
      exportCsv: 'Export CSV / Excel',
      exportDossier: 'Download Squad Dossier PDF',
      clubBrandBtn: 'Name & Crest',
      backToForm: 'Back to Player Form',
      lockStaff: 'Lock access',
      syncSupabase: 'Sync Supabase',
      syncing: 'Syncing...',
      viewCard: 'View full dossier',
      deletePlayer: 'Delete player',
      noPlayersTitle: 'No players found',
      noPlayersSubtitle: 'No forms have been submitted yet or none match your selected filters.',
      playerCountFound: (count) => `Showing ${count} player(s)`,
      coachNotes: 'Private coaching staff notes:',
      saveNotes: 'Save notes',
      notesSaved: 'Notes saved successfully',
      deleteConfirmTitle: 'Delete player dossier?',
      deleteConfirmMessage: (name) => `Are you sure you want to permanently delete the dossier for ${name}? This action cannot be undone.`,
      deleteConfirmBtn: 'Yes, delete dossier',
    },
    modals: {
      resetConfirmTitle: 'Start over?',
      resetConfirmMessage: 'All data entered in the form will be cleared and you will return to Step 1 with a blank form. This cannot be undone.',
      resetConfirmBtn: 'Yes, start over',
      staffPinTitle: 'Coaching Staff Access',
      staffPinSubtitle: 'Enter the 4 to 6-digit security PIN to access the dashboard.',
      pinPlaceholder: 'Enter PIN',
      rememberDevice: 'Remember this device (do not ask for PIN again)',
      accessBtn: 'Access Dashboard',
      changePinBtn: 'Change security PIN',
      invalidPin: 'Incorrect PIN. Please try again.',
      newPinLabel: 'New PIN (minimum 4 characters)',
      confirmPinLabel: 'Confirm new PIN',
      saveNewPinBtn: 'Save new PIN',
      pinChangedSuccess: 'PIN updated successfully!',
      clubEditorTitle: 'Club Identity & Crest',
      clubEditorSubtitle: 'Customize the club name and official crest that will preside over the app and exported PDF reports.',
      clubNameLabel: 'Official Club Name',
      clubNamePlaceholder: 'E.g. Royal Football Club...',
      subheadingLabel: 'Form Subtitle / Heading',
      crestLabel: 'Club Crest',
      dragOrBrowse: 'Drag an image here or click to browse',
      orUrl: 'Or paste direct image URL:',
      urlPlaceholder: 'https://example.com/crest.png',
      saveChanges: 'Save changes',
      resetDefault: 'Reset to default',
      editLookupTitle: 'Edit My Player Dossier',
      editLookupSubtitle: 'Securely retrieve and edit your submitted form',
      editLookupPrivacy: 'For privacy reasons, you can only access your own form. Enter your identifying information to load it into the form.',
      editLookupNameLabel: 'Your Full Name or Sports Nickname',
      editLookupNamePlaceholder: 'E.g.: Carlos Garcia or "Carli"',
      editLookupPhoneLabel: 'Your Phone Number or Jersey #',
      editLookupPhonePlaceholder: 'E.g.: 612345678 or 10',
      editLookupPhoneHelp: 'Used to verify that this dossier belongs to you.',
      editLookupSubmit: 'Load my form for editing',
      editLookupSearching: 'Searching for your form...',
      editLookupErrorName: 'Please enter your name or nickname to locate your form.',
      editLookupErrorPhone: 'Please enter your phone number or jersey number to verify your identity.',
      editLookupNotFound: 'No form was found with those details. Please check that your name and phone/jersey number match the ones submitted previously.',
    },
    positions: {
      'Portero': 'Goalkeeper (GK)',
      'Defensa Central': 'Center Back (CB)',
      'Lateral Derecho': 'Right Back (RB)',
      'Lateral Izquierdo': 'Left Back (LB)',
      'Pivote / Mediocentro Defensivo': 'Defensive Midfielder (CDM)',
      'Mediocentro Organizador': 'Central Midfielder (CM)',
      'Mediapunta / Interior': 'Attacking Midfielder (CAM)',
      'Extremo Derecho': 'Right Winger (RW)',
      'Extremo Izquierdo': 'Left Winger (LW)',
      'Delantero Centro': 'Center Forward / Striker (ST)',
    },
    externalHelps: {
      'Entrenador personal': 'Personal Trainer',
      'Coach / Psicólogo deportivo': 'Sports Psychologist / Mental Coach',
      'Fisioterapeuta / Readaptador externo': 'External Physiotherapist / Rehab Specialist',
      'Nutricionista': 'Nutritionist',
      'Otros': 'Other',
      'Ninguna': 'None',
    },
  },
};
