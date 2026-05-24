import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Push a product's flags to the community database.
 * Fire-and-forget — never blocks UI or throws to callers.
 */
export async function submitCommunityFlags(
  name: string,
  brand: string,
  flagKeys: string[],
): Promise<void> {
  if (!supabase || flagKeys.length === 0) return;

  try {
    await supabase.rpc('upsert_community_flags', {
      p_name: name.trim(),
      p_brand: brand.trim(),
      p_flag_keys: flagKeys,
    });
  } catch {
    // Silent fail — community features are non-critical
  }
}

export interface CommunityFlag {
  flag_key: string;
  vote_count: number;
}

/**
 * Fetch community-contributed flags for a product.
 * Returns only flags with vote_count >= minVotes (default 2).
 */
export async function fetchCommunityFlags(
  name: string,
  brand: string,
  minVotes = 2,
): Promise<CommunityFlag[]> {
  if (!supabase) return [];

  try {
    const nameNorm = name.trim().toLowerCase();
    const brandNorm = brand.trim().toLowerCase();

    const { data: products } = await supabase
      .from('community_products')
      .select('id')
      .eq('name_normalised', nameNorm)
      .eq('brand_normalised', brandNorm)
      .limit(1);

    if (!products || products.length === 0) return [];

    const productId = products[0].id;

    const { data: flags } = await supabase
      .from('community_flags')
      .select('flag_key, vote_count')
      .eq('product_id', productId)
      .gte('vote_count', minVotes);

    return (flags as CommunityFlag[]) ?? [];
  } catch {
    return [];
  }
}
