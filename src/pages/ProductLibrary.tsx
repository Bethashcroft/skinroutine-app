import { useState, useCallback, useMemo } from 'react';
import type { Product } from '../types';
import { useProducts, type ProductInput } from '../hooks/useProducts';
import { useRoutineLog } from '../hooks/useRoutineLog';
import { lookupProduct, updateUserCatalogFlags } from '../data/product-search';
import { flagOptionsToFlags } from '../data/ingredient-flags';
import { fetchCommunityFlags } from '../lib/supabase';
import { getCategoryLabel } from '../components/ProductForm';
import ProductForm from '../components/ProductForm';
import ProductCard from '../components/ProductCard';
import IngredientAnalysis from '../components/IngredientAnalysis';
import { detectLibraryConflicts } from '../data/conflicts';
import LibraryConflictPanel from '../components/LibraryConflictPanel';
import Toast from '../components/Toast';

type ViewMode = { kind: 'list' } | { kind: 'add'; key: number } | { kind: 'edit'; product: Product };
type SortOption = 'name' | 'recent' | 'most-used' | 'expiring';

interface FlagSuggestion {
  productId: string;
  productName: string;
  flagKeys: string[];
  source: 'local' | 'community';
}

export default function ProductLibrary() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { getProductStats } = useRoutineLog();
  const [view, setView] = useState<ViewMode>({ kind: 'list' });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [flagSuggestion, setFlagSuggestion] = useState<FlagSuggestion | null>(null);
  const [duplicateProduct, setDuplicateProduct] = useState<string | null>(null);
  const [successProduct, setSuccessProduct] = useState<string | null>(null);

  const ownedKeys = useMemo(
    () => new Set(products.map((p) => `${p.name.toLowerCase()}|${p.brand.toLowerCase()}`)),
    [products],
  );

  const libraryConflicts = useMemo(() => detectLibraryConflicts(products), [products]);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(cats).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.includes(q);
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'name':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case 'most-used':
        list = [...list].sort((a, b) => getProductStats(b.id).timesUsed - getProductStats(a.id).timesUsed);
        break;
      case 'expiring': {
        const getExpiry = (p: Product) => {
          if (!p.openedAt || !p.paoMonths) return Infinity;
          const d = new Date(p.openedAt + 'T00:00:00');
          d.setMonth(d.getMonth() + p.paoMonths);
          return d.getTime();
        };
        list = [...list].sort((a, b) => getExpiry(a) - getExpiry(b));
        break;
      }
    }

    return list;
  }, [products, search, filterCategory, sortBy, getProductStats]);

  const runPostAddCheck = useCallback(async (product: Product) => {
    if (product.flags.length > 0) return;

    const localKeys = await lookupProduct(product.name, product.brand);
    if (localKeys.length > 0) {
      setFlagSuggestion({ productId: product.id, productName: product.name, flagKeys: localKeys, source: 'local' });
      return;
    }

    const communityFlags = await fetchCommunityFlags(product.name, product.brand);
    if (communityFlags.length > 0) {
      const communityKeys = communityFlags.map((f) => f.flag_key);
      setFlagSuggestion({ productId: product.id, productName: product.name, flagKeys: communityKeys, source: 'community' });
    }
  }, []);

  function handleAdd(input: ProductInput) {
    const duplicate = products.find(
      (p) => p.name.toLowerCase() === input.name.toLowerCase() &&
             p.brand.toLowerCase() === input.brand.toLowerCase(),
    );
    if (duplicate) {
      setDuplicateProduct(duplicate.name);
      return;
    }
    const product = addProduct(input);
    setSuccessProduct(input.name);
    setView({ kind: 'list' });
    runPostAddCheck(product);
  }

  function handleAcceptFlags() {
    if (!flagSuggestion) return;
    const flags = flagOptionsToFlags(flagSuggestion.flagKeys);
    const product = products.find((p) => p.id === flagSuggestion.productId);
    if (product) {
      updateProduct(flagSuggestion.productId, {
        name: product.name,
        brand: product.brand,
        category: product.category,
        flags,
        ingredients: product.ingredients,
      });
      updateUserCatalogFlags(product.name, product.brand, flagSuggestion.flagKeys);
    }
    setFlagSuggestion(null);
  }

  function handleUpdate(id: string, input: ProductInput) {
    updateProduct(id, input);
    setView({ kind: 'list' });
  }

  function handleDelete(id: string) {
    deleteProduct(id);
    if (expandedId === id) setExpandedId(null);
    if (flagSuggestion?.productId === id) setFlagSuggestion(null);
  }

  if (view.kind === 'add') {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Add product</h2>
          <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">Search for a product or add one manually</p>
        </div>
        <div className="card-solid noise p-5 sm:p-6">
          <ProductForm key={view.key} onSubmit={handleAdd} onCancel={() => setView({ kind: 'list' })} ownedKeys={ownedKeys} />
        </div>
        {duplicateProduct && (
          <Toast
            variant="warning"
            title="Already in your library"
            message={<><strong className="text-gray-700 dark:text-gray-300">{duplicateProduct}</strong> has already been added. Try entering another or edit it in your library.</>}
            onClose={() => setDuplicateProduct(null)}
          />
        )}
      </div>
    );
  }

  if (view.kind === 'edit') {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Edit product</h2>
          <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">Update product details or flags</p>
        </div>
        <div className="card-solid noise p-5 sm:p-6">
          <ProductForm
            initial={view.product}
            onSubmit={(data) => handleUpdate(view.product.id, data)}
            onCancel={() => setView({ kind: 'list' })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Product Library</h2>
          <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>
        <button
          onClick={() => setView({ kind: 'add', key: Date.now() })}
          className="btn-primary w-full sm:w-auto"
        >
          + Add product
        </button>
      </div>

      <LibraryConflictPanel
        conflicts={libraryConflicts}
        subtitle="Flagged products in your library that may clash"
      />

      {/* Flag suggestion banner */}
      {flagSuggestion && (
        <div className={`card-solid border-l-4! p-4 ${
          flagSuggestion.source === 'community'
            ? 'border-l-purple-400! dark:border-l-purple-500!'
            : 'border-l-blue-400! dark:border-l-blue-500!'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                flagSuggestion.source === 'community'
                  ? 'text-purple-800 dark:text-purple-300'
                  : 'text-blue-800 dark:text-blue-300'
              }`}>
                {flagSuggestion.source === 'community'
                  ? <>Community flagged <strong>{flagSuggestion.productName}</strong></>
                  : <>We found ingredient data for <strong>{flagSuggestion.productName}</strong></>
                }
              </p>
              <p className={`mt-0.5 text-xs ${
                flagSuggestion.source === 'community'
                  ? 'text-purple-600/70 dark:text-purple-400/60'
                  : 'text-blue-600/70 dark:text-blue-400/60'
              }`}>
                {flagSuggestion.flagKeys.length} flag{flagSuggestion.flagKeys.length !== 1 ? 's' : ''} {
                  flagSuggestion.source === 'community' ? 'from other users' : 'detected'
                }
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={handleAcceptFlags}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-colors ${
                  flagSuggestion.source === 'community'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}>
                Add flags
              </button>
              <button onClick={() => setFlagSuggestion(null)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                  flagSuggestion.source === 'community'
                    ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, brand, or category…"
              className="glass-input w-full py-2.5 pl-10 pr-4"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="glass-input py-1.5 px-3 text-xs flex-1 sm:flex-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All categories' : getCategoryLabel(c)}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="glass-input py-1.5 px-3 text-xs flex-1 sm:flex-none"
            >
              <option value="recent">Newest first</option>
              <option value="name">A → Z</option>
              <option value="most-used">Most used</option>
              <option value="expiring">Expiring soon</option>
            </select>
          </div>
        </div>
      )}

      {filtered.length === 0 && products.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-white/30 dark:border-white/10 py-16 text-center">
          <div className="mb-4 h-16 w-16 rounded-2xl bg-white/30 dark:bg-white/8 backdrop-blur border border-white/20
                          flex items-center justify-center shadow-md">
            <span className="text-3xl">🧴</span>
          </div>
          <p className="font-semibold text-gray-600 dark:text-gray-300">No products yet</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Add your first skincare product to get started</p>
        </div>
      )}

      {filtered.length === 0 && products.length > 0 && (
        <p className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">No products match "{search}"</p>
      )}

      {successProduct && (
        <Toast
          variant="success"
          title="Product added"
          message={<><strong className="text-gray-700 dark:text-gray-300">{successProduct}</strong> has been added to your library.</>}
          onClose={() => setSuccessProduct(null)}
        />
      )}

      <div className="space-y-3">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isExpanded={expandedId === product.id}
            onToggle={() => setExpandedId(expandedId === product.id ? null : product.id)}
            onEdit={() => setView({ kind: 'edit', product })}
            onDelete={() => handleDelete(product.id)}
            stats={expandedId === product.id ? getProductStats(product.id) : undefined}
          >
            <IngredientAnalysis product={product} />
          </ProductCard>
        ))}
      </div>
    </div>
  );
}
