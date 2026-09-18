import { createClient } from '@supabase/supabase-js';
import { PlayerData, ClubProfile } from '../types';

// Supabase connection flag
export const IS_SUPABASE_CONNECTED = true;

export const SUPABASE_URL = 'https://cfhutovjwqutocolqivi.supabase.co';

export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaHV0b3Zqd3F1dG9jb2xxaXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MDc0NDgsImV4cCI6MjEwNTI4MzQ0OH0.2f0LHFq3xSYvfXB0xpZrhXOMbW1-tve6MMxgHeGX-kk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_SETUP_SQL = `-- Ejecuta este script en el SQL Editor de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/cfhutovjwqutocolqivi/sql/new

-- 1. TABLA PRINCIPAL DE FICHAS DE JUGADORES
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  staff_notes TEXT DEFAULT ''
);

-- 2. HABILITAR SEGURIDAD POR FILAS (RLS)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE ACCESO PARA EL CLIENTE (ANON)
DROP POLICY IF EXISTS "Permitir lectura publica players" ON public.players;
CREATE POLICY "Permitir lectura publica players" ON public.players
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Permitir insercion publica players" ON public.players;
CREATE POLICY "Permitir insercion publica players" ON public.players
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizacion publica players" ON public.players;
CREATE POLICY "Permitir actualizacion publica players" ON public.players
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir eliminacion publica players" ON public.players;
CREATE POLICY "Permitir eliminacion publica players" ON public.players
  FOR DELETE TO anon, authenticated USING (true);

-- 4. TABLA OPCIONAL PARA PERSONALIZACIÓN DEL CLUB
CREATE TABLE IF NOT EXISTS public.club_profile (
  id TEXT PRIMARY KEY DEFAULT 'default',
  club_name TEXT NOT NULL DEFAULT 'C.D. Laguna',
  subheading TEXT NOT NULL DEFAULT 'Ficha Inicial de Temporada',
  crest_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.club_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir todo club_profile" ON public.club_profile;
CREATE POLICY "Permitir todo club_profile" ON public.club_profile
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
`;

export interface SupabaseStatus {
  connected: boolean;
  tableExists: boolean;
  count?: number;
  error?: string;
  testedAt?: string;
}

export async function checkSupabaseConnection(): Promise<SupabaseStatus> {
  const timestamp = new Date().toLocaleTimeString();
  if (!IS_SUPABASE_CONNECTED) {
    return {
      connected: false,
      tableExists: false,
      testedAt: timestamp,
    };
  }
  try {
    const { data, error, count } = await supabase
      .from('players')
      .select('id', { count: 'exact' })
      .neq('id', '__club_config__')
      .limit(10);

    if (error) {
      console.warn('Supabase check status returned error:', error);
      const isMissingTable =
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        error.message?.toLowerCase().includes('schema cache') ||
        error.message?.toLowerCase().includes('does not exist');

      return {
        connected: !error.message?.toLowerCase().includes('failed to fetch'),
        tableExists: false,
        error: isMissingTable
          ? 'La tabla "players" aún no está creada en Supabase. Pega y ejecuta el script SQL en Supabase.'
          : `${error.message} (${error.code || 'Error'})`,
        testedAt: timestamp,
      };
    }

    const totalCount = count ?? (data ? data.length : 0);
    return {
      connected: true,
      tableExists: true,
      count: totalCount,
      testedAt: timestamp,
    };
  } catch (err: any) {
    console.error('Supabase check status exception:', err);
    return {
      connected: false,
      tableExists: false,
      error: err?.message || 'Error de conexión a Supabase',
      testedAt: timestamp,
    };
  }
}

export async function fetchPlayersFromSupabase(): Promise<{ players: PlayerData[] | null; error: any }> {
  if (!IS_SUPABASE_CONNECTED) {
    return { players: null, error: null };
  }
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .neq('id', '__club_config__')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchPlayers error:', error);
      return { players: null, error };
    }

    if (!data) return { players: [], error: null };

    const parsed: PlayerData[] = data.map((row: any) => {
      // Row might contain full PlayerData inside 'data' jsonb
      if (row.data && typeof row.data === 'object') {
        return {
          ...row.data,
          id: row.id || row.data.id,
          fullName: row.full_name || row.data.fullName,
          staffNotes: row.staff_notes !== undefined ? row.staff_notes : row.data.staffNotes,
          submittedAt: row.submitted_at || row.data.submittedAt,
        };
      }
      // If flat row
      return row as PlayerData;
    });

    return { players: parsed, error: null };
  } catch (err) {
    console.error('Unexpected error in fetchPlayersFromSupabase:', err);
    return { players: null, error: err };
  }
}

export async function savePlayerToSupabase(player: PlayerData): Promise<{ success: boolean; error?: any }> {
  if (!IS_SUPABASE_CONNECTED) {
    return { success: true };
  }
  try {
    const payload = {
      id: player.id,
      full_name: player.fullName,
      submitted_at: player.submittedAt || new Date().toISOString(),
      staff_notes: player.staffNotes || '',
      data: player,
    };

    const { error } = await supabase.from('players').upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Error saving player to Supabase:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error saving player to Supabase:', err);
    return { success: false, error: err };
  }
}

export async function deletePlayerFromSupabase(id: string): Promise<{ success: boolean; error?: any }> {
  if (!IS_SUPABASE_CONNECTED) {
    return { success: true };
  }
  try {
    const { error } = await supabase.from('players').delete().eq('id', id);
    if (error) {
      console.error('Error deleting player from Supabase:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('Unexpected error deleting player from Supabase:', err);
    return { success: false, error: err };
  }
}

export async function saveStaffNotesToSupabase(id: string, notes: string): Promise<{ success: boolean; error?: any }> {
  if (!IS_SUPABASE_CONNECTED) {
    return { success: true };
  }
  try {
    // First read current row to keep data JSON consistent
    const { data: current } = await supabase.from('players').select('data').eq('id', id).single();
    const updatedData = current?.data ? { ...current.data, staffNotes: notes } : null;

    const payload: any = { staff_notes: notes };
    if (updatedData) payload.data = updatedData;

    const { error } = await supabase.from('players').update(payload).eq('id', id);
    if (error) {
      console.error('Error updating staff notes in Supabase:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function fetchClubProfileFromSupabase(): Promise<ClubProfile | null> {
  if (!IS_SUPABASE_CONNECTED) {
    return null;
  }
  try {
    const { data, error } = await supabase.from('club_profile').select('*').eq('id', 'default').single();
    if (error || !data) return null;
    return {
      clubName: data.club_name,
      subheading: data.subheading,
      crestUrl: data.crest_url,
    };
  } catch {
    return null;
  }
}

export async function saveClubProfileToSupabase(profile: ClubProfile): Promise<boolean> {
  if (!IS_SUPABASE_CONNECTED) {
    return true;
  }
  try {
    const { error } = await supabase.from('club_profile').upsert({
      id: 'default',
      club_name: profile.clubName,
      subheading: profile.subheading,
      crest_url: profile.crestUrl,
      updated_at: new Date().toISOString(),
    });
    // Also save into club config fallback
    await saveClubConfigToSupabase({ clubProfile: profile }).catch(() => {});
    return !error;
  } catch {
    return false;
  }
}

/**
 * Universal Club and Security Config in Supabase
 * Synchronizes Staff PIN and Club Profile across Mobile and Web
 */
export async function fetchClubConfigFromSupabase(): Promise<{
  staffPin?: string;
  clubProfile?: ClubProfile;
} | null> {
  if (!IS_SUPABASE_CONNECTED) return null;
  try {
    const { data, error } = await supabase
      .from('players')
      .select('data')
      .eq('id', '__club_config__')
      .maybeSingle();

    if (error || !data || !data.data) return null;
    return {
      staffPin: data.data.staffPin,
      clubProfile: data.data.clubProfile,
    };
  } catch {
    return null;
  }
}

export async function saveClubConfigToSupabase(config: {
  staffPin?: string;
  clubProfile?: ClubProfile;
}): Promise<boolean> {
  if (!IS_SUPABASE_CONNECTED) return true;
  try {
    const existing = await fetchClubConfigFromSupabase();
    const payload = {
      id: '__club_config__',
      full_name: 'Configuración del Club',
      submitted_at: new Date().toISOString(),
      staff_notes: 'Sistema - Configuración de PIN y Club',
      data: {
        staffPin: config.staffPin ?? existing?.staffPin ?? '1234',
        clubProfile: config.clubProfile ?? existing?.clubProfile ?? null,
      },
    };
    const { error } = await supabase.from('players').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch (err) {
    console.error('Error saving club config to Supabase:', err);
    return false;
  }
}
