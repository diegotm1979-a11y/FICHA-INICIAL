export interface PlayerData {
  id: string;
  submittedAt: string;
  // Paso 1: Datos Personales y Familiares
  fullName: string;
  nickname: string;
  dorsal?: string;
  position?: string;
  phone: string;
  email: string;
  hasPartner: boolean | null;
  childrenCount: number; // 0, 1, 2, 3 (3 = "3 o más")
  childrenAges: string;

  // Paso 2: Entorno y Rendimiento Externo
  externalHelps: string[]; // ["Entrenador personal", "Coach / Psicólogo deportivo", "Fisioterapeuta / Readaptador externo", "Nutricionista", "Otros", "Ninguna"]
  externalHelpOther: string;

  // Paso 3: Acciones a Balón Parado (ABP)
  // Ofensivo
  abpOffensiveFoulsCorners: boolean | null;
  abpOffensiveHeader: boolean | null;
  abpMemorizePlays: boolean | null;
  // Defensivo
  abpDefensiveManMarking: boolean | null;
  abpDefensiveZone: boolean | null;

  // Paso 4: Psicología, Personalidad y Análisis Técnico-Táctico
  illusionScore: number; // 0 - 10
  positivePersonalityTraits: string;
  personalityImprovementTraits: string;
  tacticalStrengths: string;
  tacticalImprovements: string;
  // Sistemas de Juego y Posicionamiento (1-4-1-4-1 y 1-3-2-3-2)
  // Almacena el número (1 al 9 o null) para cada posición del campo
  tacticalSystem4141: Record<string, number | null>;
  tacticalSystem13232: Record<string, number | null>;

  // Paso 5: Compromiso, Hábitos y Preferencias
  commitmentNotStarting: number; // 0 - 10
  commitmentSubstituted: number; // 0 - 10
  likePitchTraining: number; // 0 - 10
  likeGymWork: number; // 0 - 10
  likeSelfCare: number; // 0 - 10
  physicalPreparationScore: number; // 0 - 10

  // Paso 6: Metas e Inspiración
  individualGoal: string;
  collectiveGoal: string;
  favoriteAthleteReferent: string;

  // Coach annotations (optional)
  staffNotes?: string;
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface StepMeta {
  step: FormStep;
  title: string;
  shortTitle: string;
  description: string;
}

export const FORM_STEPS: StepMeta[] = [
  {
    step: 1,
    title: 'Datos Personales y Familiares',
    shortTitle: 'Personal',
    description: 'Información básica de contacto, entorno personal y familiar.',
  },
  {
    step: 2,
    title: 'Entorno y Rendimiento Externo',
    shortTitle: 'Ayudas Ext.',
    description: 'Profesionales y apoyos con los que trabajas fuera del club.',
  },
  {
    step: 3,
    title: 'Acciones a Balón Parado (ABP)',
    shortTitle: 'ABP',
    description: 'Tus fortalezas y preferencias en jugadas de estrategia.',
  },
  {
    step: 4,
    title: 'Psicología y Aspecto Técnico-Táctico',
    shortTitle: 'Psicología',
    description: 'Nivel de ilusión, rasgos de personalidad y juego.',
  },
  {
    step: 5,
    title: 'Compromiso, Hábitos y Preferencias',
    shortTitle: 'Compromiso',
    description: 'Gestión de minutos, trabajo invisible y preparación física.',
  },
  {
    step: 6,
    title: 'Metas e Inspiración',
    shortTitle: 'Metas',
    description: 'Tus objetivos individuales, de equipo y referentes deportivos.',
  },
  {
    step: 7,
    title: 'Resumen y Confirmación',
    shortTitle: 'Confirmación',
    description: 'Revisa todos tus datos antes del envío al cuerpo técnico.',
  },
];

export const INITIAL_PLAYER_DATA: PlayerData = {
  id: '',
  submittedAt: '',
  fullName: '',
  nickname: '',
  dorsal: '',
  position: 'Mediocentro',
  phone: '',
  email: '',
  hasPartner: null,
  childrenCount: 0,
  childrenAges: '',
  externalHelps: [],
  externalHelpOther: '',
  abpOffensiveFoulsCorners: null,
  abpOffensiveHeader: null,
  abpMemorizePlays: null,
  abpDefensiveManMarking: null,
  abpDefensiveZone: null,
  illusionScore: 10,
  positivePersonalityTraits: '',
  personalityImprovementTraits: '',
  tacticalStrengths: '',
  tacticalImprovements: '',
  tacticalSystem4141: {},
  tacticalSystem13232: {},
  commitmentNotStarting: 10,
  commitmentSubstituted: 10,
  likePitchTraining: 10,
  likeGymWork: 8,
  likeSelfCare: 9,
  physicalPreparationScore: 8,
  individualGoal: '',
  collectiveGoal: '',
  favoriteAthleteReferent: '',
  staffNotes: '',
};

export const FOOTBALL_POSITIONS = [
  'Portero',
  'Defensa Central',
  'Lateral Derecho',
  'Lateral Izquierdo',
  'Pivote / Mediocentro Defensivo',
  'Mediocentro Organizador',
  'Mediapunta / Interior',
  'Extremo Derecho',
  'Extremo Izquierdo',
  'Delantero Centro',
] as const;

export const EXTERNAL_HELP_OPTIONS = [
  'Entrenador personal',
  'Coach / Psicólogo deportivo',
  'Fisioterapeuta / Readaptador externo',
  'Nutricionista',
  'Otros',
  'Ninguna',
] as const;

export interface ClubProfile {
  clubName: string;
  subheading: string;
  crestUrl: string | null;
}

export const DEFAULT_CLUB_PROFILE: ClubProfile = {
  clubName: 'Ficha Inicial de Temporada',
  subheading: 'Información y Compromiso del Futbolista · Cuerpo Técnico',
  crestUrl: null,
};
