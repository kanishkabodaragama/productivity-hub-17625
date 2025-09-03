import { getSupabaseClient } from './supabaseClient';

/**
 * PUBLIC_INTERFACE
 * savePublicProfile publishes or updates a user's public profile in Supabase table "public_profiles".
 * Falls back to a mock localStorage implementation if Supabase is not configured.
 *
 * Params:
 * - payload: {
 *    slug: string, name: string, title?: string, bio?: string, avatar_url?: string,
 *    stats?: { tasksCompleted?: number, activeProjects?: number, focusScore?: number },
 *    links?: Array<{ label: string, url: string }>
 *   }
 * - userId?: string (if available, stored in table for reference and uniqueness)
 *
 * Returns: { data, error }
 */
export async function savePublicProfile(payload, userId) {
  let supabase = null;
  try {
    supabase = getSupabaseClient();
  } catch (_e) {
    supabase = null;
  }

  if (supabase) {
    try {
      // Upsert into "public_profiles" by slug (make sure slug is unique in table schema)
      const record = toRecord(payload, userId);
      const { data, error } = await supabase
        .from('public_profiles')
        .upsert(record, { onConflict: 'slug' })
        .select('*')
        .single();
      return { data, error: error || null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Mock fallback via localStorage
  try {
    const key = 'tm_public_profiles';
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((r) => r.slug === payload.slug);
    const rec = toRecord(payload, userId);
    if (idx >= 0) list[idx] = rec;
    else list.push(rec);
    localStorage.setItem(key, JSON.stringify(list));
    return { data: rec, error: null };
  } catch (error) {
    return { data: null, error: new Error('Mock publish failed: ' + error.message) };
  }
}

/**
 * PUBLIC_INTERFACE
 * fetchPublicProfile retrieves a published public profile by slug.
 * Uses Supabase if available, otherwise mock localStorage.
 */
export async function fetchPublicProfile(slug) {
  let supabase = null;
  try {
    supabase = getSupabaseClient();
  } catch (_e) {
    supabase = null;
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('public_profiles')
        .select('*')
        .eq('slug', slug)
        .limit(1)
        .maybeSingle();
      return { data, error: error || null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Mock fallback
  try {
    const key = 'tm_public_profiles';
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    const found = list.find((r) => r.slug === slug);
    return { data: found || null, error: null };
  } catch (error) {
    return { data: null, error: new Error('Mock fetch failed: ' + error.message) };
  }
}

function toRecord(payload, userId) {
  const {
    slug,
    name,
    title = '',
    bio = '',
    avatar_url = '',
    stats = {},
    links = [],
  } = payload;
  return {
    slug: String(slug || '').trim(),
    name: String(name || '').trim(),
    title: String(title || '').trim(),
    bio: String(bio || '').trim(),
    avatar_url: String(avatar_url || '').trim(),
    tasksCompleted: toNumOrNull(stats.tasksCompleted),
    activeProjects: toNumOrNull(stats.activeProjects),
    focusScore: toNumOrNull(stats.focusScore),
    links: Array.isArray(links) ? links : [],
    user_id: userId || null,
    updated_at: new Date().toISOString(),
  };
}

function toNumOrNull(v) {
  if (v === undefined || v === null || v === '') return null;
  const num = Number(v);
  return Number.isFinite(num) ? num : null;
}
