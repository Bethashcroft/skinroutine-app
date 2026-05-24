import { supabase } from './supabase';
import type { Product, RoutineEntry, SkinProfile, SkinType, Concern } from '../types';

function productToRow(p: Product) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    flags: JSON.stringify(p.flags),
    ingredients: p.ingredients ?? null,
    notes: p.notes ?? null,
    opened_at: p.openedAt ?? null,
    pao_months: p.paoMonths ?? null,
    created_at: p.createdAt,
  };
}

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    brand: row.brand as string,
    category: row.category as string,
    flags: typeof row.flags === 'string' ? JSON.parse(row.flags) : (row.flags as Product['flags']),
    ...(row.ingredients ? { ingredients: row.ingredients as string } : {}),
    ...(row.notes ? { notes: row.notes as string } : {}),
    ...(row.opened_at ? { openedAt: row.opened_at as string } : {}),
    ...(row.pao_months ? { paoMonths: row.pao_months as number } : {}),
    createdAt: row.created_at as string,
  };
}

function entryToRow(e: RoutineEntry) {
  return {
    id: e.id,
    date: e.date,
    session: e.session,
    product_ids: JSON.stringify(e.productIds),
    skin_rating: e.skinRating,
    notes: e.notes,
  };
}

function rowToEntry(row: Record<string, unknown>): RoutineEntry {
  return {
    id: row.id as string,
    date: row.date as string,
    session: row.session as 'AM' | 'PM',
    productIds: typeof row.product_ids === 'string' ? JSON.parse(row.product_ids) : (row.product_ids as string[]),
    skinRating: row.skin_rating as RoutineEntry['skinRating'],
    notes: (row.notes as string) ?? '',
  };
}

export async function pullProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('user_products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToProduct);
}

export async function pushProducts(products: Product[]): Promise<void> {
  if (!supabase || products.length === 0) return;
  const rows = products.map(productToRow);
  const { error } = await supabase
    .from('user_products')
    .upsert(rows, { onConflict: 'user_id,id' });
  if (error) throw error;
}

export async function deleteRemoteProduct(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('user_products')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function pullEntries(): Promise<RoutineEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('user_entries')
    .select('*')
    .order('date', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToEntry);
}

export async function pushEntries(entries: RoutineEntry[]): Promise<void> {
  if (!supabase || entries.length === 0) return;
  const rows = entries.map(entryToRow);
  const { error } = await supabase
    .from('user_entries')
    .upsert(rows, { onConflict: 'user_id,id' });
  if (error) throw error;
}

export async function deleteRemoteEntry(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('user_entries')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

function rowToProfile(row: Record<string, unknown>): SkinProfile {
  const concerns = typeof row.concerns === 'string'
    ? JSON.parse(row.concerns)
    : (row.concerns as Concern[]);
  return {
    skinType: row.skin_type as SkinType,
    concerns: concerns ?? [],
  };
}

export async function pullProfile(): Promise<SkinProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('user_skin_profiles')
    .select('skin_type, concerns')
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToProfile(data as Record<string, unknown>);
}

export async function pushProfile(profile: SkinProfile): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('user_skin_profiles')
    .upsert({
      skin_type: profile.skinType,
      concerns: profile.concerns,
    }, { onConflict: 'user_id' });
  if (error) throw error;
}
