import { PlayerData } from '../types';

export function exportPlayersToCSV(players: PlayerData[], filename = 'Fichas_Iniciales_Temporada.csv'): void {
  if (!players || players.length === 0) return;

  const headers = [
    'Nombre Completo',
    'Apodo',
    'Dorsal',
    'Posición',
    'Teléfono',
    'Email',
    '¿Tiene Pareja?',
    'Hijos',
    'Edades de los Hijos',
    'Ayudas Externas',
    'Otras Ayudas',
    'ABP Faltas/Córners',
    'ABP Rematador',
    'ABP Memoriza Jugadas',
    'ABP Marcaje al Hombre',
    'ABP Defensa en Zona',
    'Grado de Ilusión (0-10)',
    'Rasgos Positivos Personalidad',
    'Rasgos a Mejorar Personalidad',
    'Aspectos Técnico-Tácticos Destacados',
    'Aspectos Técnico-Tácticos a Mejorar',
    'Posicionamiento Sistema 1-4-1-4-1',
    'Posicionamiento Sistema 1-3-2-3-2',
    'Compromiso Si No es Titular (0-10)',
    'Compromiso Si es Sustituido (0-10)',
    'Gusto Entrenamiento Campo (0-10)',
    'Gusto Trabajo Gimnasio (0-10)',
    'Gusto Cuidado Personal (0-10)',
    'Preparación Física Previa (0-10)',
    'Objetivo Individual',
    'Objetivo Colectivo',
    'Referente / Ídolo',
    'Fecha de Envío',
  ];

  const escapeCSV = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = players.map((p) => [
    p.fullName,
    p.nickname || '-',
    p.dorsal || '-',
    p.position || '-',
    p.phone,
    p.email,
    p.hasPartner === null ? 'No especificado' : p.hasPartner ? 'Sí' : 'No',
    p.childrenCount === 3 ? '3 o más' : p.childrenCount,
    p.childrenAges || '-',
    p.externalHelps.join(', ') || 'Ninguna',
    p.externalHelpOther || '-',
    p.abpOffensiveFoulsCorners ? 'Sí' : 'No',
    p.abpOffensiveHeader ? 'Sí' : 'No',
    p.abpMemorizePlays ? 'Sí' : 'No',
    p.abpDefensiveManMarking ? 'Sí' : 'No',
    p.abpDefensiveZone ? 'Sí' : 'No',
    p.illusionScore,
    p.positivePersonalityTraits,
    p.personalityImprovementTraits,
    p.tacticalStrengths,
    p.tacticalImprovements,
    p.tacticalSystem4141 ? JSON.stringify(p.tacticalSystem4141) : '-',
    p.tacticalSystem13232 ? JSON.stringify(p.tacticalSystem13232) : '-',
    p.commitmentNotStarting,
    p.commitmentSubstituted,
    p.likePitchTraining,
    p.likeGymWork,
    p.likeSelfCare,
    p.physicalPreparationScore,
    p.individualGoal,
    p.collectiveGoal,
    p.favoriteAthleteReferent,
    p.submittedAt ? new Date(p.submittedAt).toLocaleString('es-ES') : '-',
  ]);

  const csvContent =
    '\uFEFF' + // UTF-8 BOM for Microsoft Excel
    headers.map(escapeCSV).join(';') +
    '\n' +
    rows.map((row) => row.map(escapeCSV).join(';')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSinglePlayerToCSV(player: PlayerData): void {
  const safeName = player.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  exportPlayersToCSV([player], `Ficha_${safeName || 'jugador'}.csv`);
}

export function triggerPrintReport(): void {
  window.print();
}
