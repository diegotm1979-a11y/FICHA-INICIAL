import { PlayerData, INITIAL_PLAYER_DATA, ClubProfile, DEFAULT_CLUB_PROFILE } from '../types';
import { MOCK_PLAYERS } from '../data/mockPlayers';
import {
  savePlayerToSupabase,
  deletePlayerFromSupabase,
  fetchPlayersFromSupabase,
  saveClubProfileToSupabase,
  fetchClubProfileFromSupabase,
  fetchClubConfigFromSupabase,
  saveClubConfigToSupabase,
} from './supabase';

const PLAYERS_STORAGE_KEY = 'ficha_inicial_temporada_players_v1';
const DRAFT_STORAGE_KEY = 'ficha_inicial_temporada_draft_v1';
const DRAFT_STEP_KEY = 'ficha_inicial_temporada_draft_step_v1';
const CLUB_PROFILE_STORAGE_KEY = 'ficha_inicial_temporada_club_profile_v1';

export function getStoredPlayers(): PlayerData[] {
  try {
    const raw = localStorage.getItem(PLAYERS_STORAGE_KEY);
    if (!raw) {
      // Seed with mock players initially
      localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(MOCK_PLAYERS));
      return MOCK_PLAYERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : MOCK_PLAYERS;
  } catch (err) {
    console.error('Error loading stored players:', err);
    return MOCK_PLAYERS;
  }
}

export function savePlayerSubmission(player: PlayerData): PlayerData[] {
  try {
    const current = getStoredPlayers();
    const existingIndex = current.findIndex((p) => p.id === player.id);
    let updated: PlayerData[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = player;
    } else {
      updated = [player, ...current];
    }
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(updated));

    // Asynchronously synchronize with Supabase database
    savePlayerToSupabase(player).catch((err) => {
      console.warn('Supabase async save background error:', err);
    });

    return updated;
  } catch (err) {
    console.error('Error saving player:', err);
    return [player];
  }
}

export function deleteStoredPlayer(id: string): PlayerData[] {
  try {
    const current = getStoredPlayers();
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(updated));

    // Asynchronously delete from Supabase database
    deletePlayerFromSupabase(id).catch((err) => {
      console.warn('Supabase async delete background error:', err);
    });

    return updated;
  } catch (err) {
    console.error('Error deleting player:', err);
    return [];
  }
}

/**
 * Synchronizes player records between Supabase and local storage
 */
export async function syncPlayersWithSupabase(): Promise<{
  players: PlayerData[];
  source: 'supabase' | 'local';
  error?: string;
}> {
  try {
    const { players, error } = await fetchPlayersFromSupabase();

    if (!error && players) {
      if (players.length > 0) {
        // Authoritative list from Supabase
        localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
        return { players, source: 'supabase' };
      } else {
        // Table exists in Supabase but is empty: upload local players so cloud has them
        const local = getStoredPlayers();
        if (local.length > 0) {
          await Promise.all(local.map((p) => savePlayerToSupabase(p)));
        }
        return { players: local, source: 'supabase' };
      }
    }

    return {
      players: getStoredPlayers(),
      source: 'local',
      error: error?.message || 'No se pudo conectar a la tabla de Supabase',
    };
  } catch (err: any) {
    return {
      players: getStoredPlayers(),
      source: 'local',
      error: err?.message || 'Error de sincronización con Supabase',
    };
  }
}

/**
 * Synchronizes club profile with Supabase
 */
export async function syncClubProfileWithSupabase(): Promise<ClubProfile> {
  try {
    const remote = await fetchClubProfileFromSupabase();
    if (remote && remote.clubName) {
      localStorage.setItem(CLUB_PROFILE_STORAGE_KEY, JSON.stringify(remote));
      return remote;
    }
  } catch {}
  return getClubProfile();
}

export function saveFormDraft(data: PlayerData, step: number): void {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(DRAFT_STEP_KEY, String(step));
  } catch (err) {
    console.warn('Could not save draft:', err);
  }
}

export function getFormDraft(): { data: PlayerData; step: number } | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    const rawStep = localStorage.getItem(DRAFT_STEP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const step = rawStep ? parseInt(rawStep, 10) : 1;
    return { data: { ...INITIAL_PLAYER_DATA, ...parsed }, step: isNaN(step) ? 1 : step };
  } catch {
    return null;
  }
}

export function clearFormDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(DRAFT_STEP_KEY);
  } catch {
    // Ignore error
  }
}

export function getClubProfile(): ClubProfile {
  try {
    const raw = localStorage.getItem(CLUB_PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_CLUB_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      clubName: parsed.clubName || DEFAULT_CLUB_PROFILE.clubName,
      subheading: parsed.subheading || DEFAULT_CLUB_PROFILE.subheading,
      crestUrl: parsed.crestUrl || null,
    };
  } catch {
    return DEFAULT_CLUB_PROFILE;
  }
}

export function saveClubProfile(profile: ClubProfile): void {
  try {
    localStorage.setItem(CLUB_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving club profile:', err);
  }
}

export const STAFF_AUTH_KEY = 'ficha_inicial_staff_auth_v1';
const STAFF_PIN_KEY = 'ficha_inicial_staff_pin_v1';
export const DEFAULT_STAFF_PIN = '1234';

/**
 * Checks if the staff session is authenticated in either localStorage or sessionStorage
 */
export function isStaffSessionActive(): boolean {
  try {
    return (
      localStorage.getItem(STAFF_AUTH_KEY) === 'true' ||
      localStorage.getItem('ficha_inicial_staff_auth') === 'true' ||
      sessionStorage.getItem(STAFF_AUTH_KEY) === 'true' ||
      sessionStorage.getItem('ficha_inicial_staff_auth') === 'true'
    );
  } catch {
    return false;
  }
}

/**
 * Persists staff session so mobile does not lose authentication on backgrounding or closing
 */
export function setStaffSessionActive(persistent: boolean = true): void {
  try {
    if (persistent) {
      localStorage.setItem(STAFF_AUTH_KEY, 'true');
      localStorage.setItem('ficha_inicial_staff_auth', 'true');
    }
    sessionStorage.setItem(STAFF_AUTH_KEY, 'true');
    sessionStorage.setItem('ficha_inicial_staff_auth', 'true');
  } catch (err) {
    console.warn('Could not save staff session:', err);
  }
}

/**
 * Clears staff session on manual logout or lock
 */
export function clearStaffSession(): void {
  try {
    localStorage.removeItem(STAFF_AUTH_KEY);
    localStorage.removeItem('ficha_inicial_staff_auth');
    sessionStorage.removeItem(STAFF_AUTH_KEY);
    sessionStorage.removeItem('ficha_inicial_staff_auth');
  } catch (err) {
    console.warn('Could not clear staff session:', err);
  }
}

export function getStaffPin(): string {
  try {
    return localStorage.getItem(STAFF_PIN_KEY) || DEFAULT_STAFF_PIN;
  } catch {
    return DEFAULT_STAFF_PIN;
  }
}

export function saveStaffPin(pin: string): void {
  try {
    localStorage.setItem(STAFF_PIN_KEY, pin);
    // Asynchronously synchronize PIN with Supabase so mobile and web stay in sync
    saveClubConfigToSupabase({ staffPin: pin }).catch((err) => {
      console.warn('Supabase PIN sync background error:', err);
    });
  } catch (err) {
    console.error('Error saving staff PIN:', err);
  }
}

/**
 * Synchronizes staff PIN and club config with Supabase
 */
export async function syncStaffConfigWithSupabase(): Promise<{
  staffPin: string;
  clubProfile: ClubProfile;
}> {
  try {
    const remote = await fetchClubConfigFromSupabase();
    let currentPin = getStaffPin();
    let currentProfile = getClubProfile();

    if (remote?.staffPin && remote.staffPin.trim().length >= 4) {
      localStorage.setItem(STAFF_PIN_KEY, remote.staffPin.trim());
      currentPin = remote.staffPin.trim();
    } else if (currentPin !== DEFAULT_STAFF_PIN) {
      // If we have a local custom PIN, upload it to cloud so mobile receives it
      saveClubConfigToSupabase({ staffPin: currentPin }).catch(() => {});
    }

    if (remote?.clubProfile && remote.clubProfile.clubName) {
      localStorage.setItem(CLUB_PROFILE_STORAGE_KEY, JSON.stringify(remote.clubProfile));
      currentProfile = remote.clubProfile;
    }

    return { staffPin: currentPin, clubProfile: currentProfile };
  } catch (e) {
    return { staffPin: getStaffPin(), clubProfile: getClubProfile() };
  }
}

export function findPlayerForEdit(nameQuery: string, phoneOrDorsalQuery: string): PlayerData | null {
  const players = getStoredPlayers();
  const cleanName = nameQuery.trim().toLowerCase();
  const cleanPhone = phoneOrDorsalQuery.trim().toLowerCase().replace(/[^0-9+]/g, '');
  const cleanDorsal = phoneOrDorsalQuery.trim();

  if (!cleanName && !cleanPhone && !cleanDorsal) return null;

  return players.find((p) => {
    const pName = (p.fullName || '').toLowerCase();
    const pNick = (p.nickname || '').toLowerCase();
    const pPhone = (p.phone || '').replace(/[^0-9+]/g, '');
    const pDorsal = String(p.dorsal || '').trim();

    const nameMatches = cleanName.length > 0 && (
      pName.includes(cleanName) ||
      cleanName.includes(pName) ||
      (pNick && (pNick.includes(cleanName) || cleanName.includes(pNick)))
    );

    const phoneMatches = cleanPhone.length > 0 && (
      (pPhone && (pPhone.includes(cleanPhone) || cleanPhone.includes(pPhone)))
    );

    const dorsalMatches = cleanDorsal.length > 0 && pDorsal === cleanDorsal;

    const identifierMatches = phoneMatches || dorsalMatches;

    if (cleanName && (cleanPhone || cleanDorsal)) {
      return nameMatches && identifierMatches;
    }
    return nameMatches || identifierMatches;
  }) || null;
}

