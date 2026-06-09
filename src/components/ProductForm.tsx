import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { Product, ProductCategory, IngredientFlag } from '../types';
import { flagOptionsToFlags, flagsToOptionKeys } from '../data/ingredient-flags';
import { searchProducts, detectFlagsFromIngredients, type SearchResult } from '../data/product-search';
import { dbGet, dbSet } from '../lib/db';
import { useClickOutside } from '../hooks/useClickOutside';
import FlagPicker from './FlagPicker';

const BUILT_IN_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'cleanser', label: 'Cleanser' },
  { value: 'toner', label: 'Toner' },
  { value: 'serum', label: 'Serum' },
  { value: 'moisturiser', label: 'Moisturiser' },
  { value: 'spf', label: 'SPF' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'mask', label: 'Face Mask' },
  { value: 'other', label: 'Other' },
];

const CUSTOM_CATEGORIES_KEY = 'routinelog:custom-categories';

async function loadCustomCategories(): Promise<string[]> {
  return (await dbGet<string[]>(CUSTOM_CATEGORIES_KEY)) ?? [];
}

async function saveCustomCategory(name: string): Promise<void> {
  const existing = await loadCustomCategories();
  if (!existing.includes(name)) {
    await dbSet(CUSTOM_CATEGORIES_KEY, [...existing, name]);
  }
}

interface Props {
  onSubmit: (data: {
    name: string; brand: string; category: ProductCategory; flags: IngredientFlag[];
    ingredients?: string; notes?: string; openedAt?: string; paoMonths?: number;
  }) => void;
  onCancel: () => void;
  initial?: Product;
  ownedKeys?: Set<string>;
}

const isMobile = typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

export default function ProductForm({ onSubmit, onCancel, initial, ownedKeys }: Props) {
  const isEditing = !!initial;

  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const [name, setName] = useState(initial?.name ?? '');
  const [brand, setBrand] = useState(initial?.brand ?? '');
  const [category, setCategory] = useState<ProductCategory>(initial?.category ?? 'cleanser');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [savedCustomCategories, setSavedCustomCategories] = useState<string[]>([]);
  const [selectedFlags, setSelectedFlags] = useState<string[]>(
    initial ? flagsToOptionKeys(initial.flags) : [],
  );
  const [showFlags, setShowFlags] = useState(isEditing);

  const [ingredients, setIngredients] = useState(initial?.ingredients ?? '');
  const [showIngredients, setShowIngredients] = useState(!!initial?.ingredients);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrError, setOcrError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productNotes, setProductNotes] = useState(initial?.notes ?? '');
  const [openedAt, setOpenedAt] = useState(initial?.openedAt ?? '');
  const [paoMonths, setPaoMonths] = useState(initial?.paoMonths?.toString() ?? '');

  const detectedFromPaste = useMemo(
    () => (ingredients.trim() ? detectFlagsFromIngredients(ingredients) : []),
    [ingredients],
  );

  useEffect(() => {
    if (detectedFromPaste.length === 0) return;
    setSelectedFlags((prev) => {
      const merged = new Set([...prev, ...detectedFromPaste]);
      return merged.size === prev.length ? prev : [...merged];
    });
  }, [detectedFromPaste]);

  const isBuiltIn = BUILT_IN_CATEGORIES.some((c) => c.value === category);
  const showCustomInput = category === 'other';

  useEffect(() => {
    loadCustomCategories().then(setSavedCustomCategories);
  }, []);

  useEffect(() => {
    if (initial && !isBuiltIn && initial.category !== 'other') {
      setCustomCategoryName(initial.category);
      setCategory('other');
    }
  }, []);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useClickOutside(wrapperRef, () => setShowResults(false));

  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const apiResults = await searchProducts(query);
      setResults(apiResults);
    } finally {
      setSearching(false);
    }
  }, []);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setShowResults(value.length >= 2);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length >= 2) {
      debounceRef.current = setTimeout(() => performSearch(value), 350);
    } else {
      setResults([]);
    }
  }

  function handleSelectProduct(product: SearchResult) {
    setName(product.name);
    setBrand(product.brand);
    setCategory(product.category);
    setCustomCategoryName('');
    setSelectedFlags(product.flagKeys);
    if (product.ingredients) {
      setIngredients(product.ingredients);
      setShowIngredients(false);
    }
    setSearchQuery('');
    setShowResults(false);
  }

  function handleCategoryChange(value: string) {
    if (value === 'other') {
      setCategory('other');
      setCustomCategoryName('');
    } else if (value.startsWith('custom:')) {
      const customName = value.slice(7);
      setCategory('other');
      setCustomCategoryName(customName);
    } else {
      setCategory(value as ProductCategory);
      setCustomCategoryName('');
    }
  }

  async function handleOcrFile(file: File) {
    setOcrProcessing(true);
    setOcrProgress(0);
    setOcrError('');
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng', undefined, {
        logger: (info: { progress: number }) => {
          if (typeof info.progress === 'number') setOcrProgress(info.progress);
        },
      });
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const text = data.text.trim();
      if (text) {
        setIngredients(text);
        setShowIngredients(true);
      } else {
        setOcrError('No text detected — try a clearer photo');
      }
    } catch {
      setOcrError('OCR failed — try a different image');
    } finally {
      setOcrProcessing(false);
      setOcrProgress(0);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleOcrFile(file);
    e.target.value = '';
  }

  const canSubmit = name.trim() && brand.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const finalCategory = (category === 'other' && customCategoryName.trim())
      ? customCategoryName.trim().toLowerCase()
      : category;

    if (category === 'other' && customCategoryName.trim()) {
      saveCustomCategory(customCategoryName.trim().toLowerCase());
    }

    onSubmit({
      name: name.trim(),
      brand: brand.trim(),
      category: finalCategory,
      flags: flagOptionsToFlags(selectedFlags),
      ...(ingredients.trim() ? { ingredients: ingredients.trim() } : {}),
      ...(productNotes.trim() ? { notes: productNotes.trim() } : {}),
      ...(openedAt ? { openedAt } : {}),
      ...(paoMonths && parseInt(paoMonths) > 0 ? { paoMonths: parseInt(paoMonths) } : {}),
    });
  }

  const selectValue = category === 'other'
    ? (customCategoryName && savedCustomCategories.includes(customCategoryName.toLowerCase())
        ? `custom:${customCategoryName.toLowerCase()}`
        : 'other')
    : category;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isEditing && (
        <div ref={wrapperRef} className="relative">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Quick search
          </span>
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              placeholder="Search to auto-fill, or type below..."
              className="glass-input w-full py-2.5 pl-10 pr-4"
              autoFocus
            />
            {searching && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-sand-300 border-t-sand-600" />
              </div>
            )}
          </div>

          {showResults && (
            <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl shadow-xl backdrop-blur-xl
                            bg-white/80 border border-white/30
                            dark:bg-dark-card/90 dark:border-white/10">
              {results.length > 0 ? (
                <ul className="max-h-72 overflow-y-auto py-1">
                  {results.map((product, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors
                                   hover:bg-white/40 dark:hover:bg-white/5"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="block truncate text-sm font-medium text-gray-800 dark:text-gray-200">{product.name}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {product.brand}
                            {product.source === 'builtin' && (
                              <span className="ml-1.5 text-emerald-600 dark:text-emerald-400"> · ingredients included</span>
                            )}
                          </span>
                        </div>
                        {ownedKeys?.has(`${product.name.toLowerCase()}|${product.brand.toLowerCase()}`) ? (
                          <span className="shrink-0 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10
                                           px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400
                                           border border-emerald-400/20 dark:border-emerald-500/15">
                            In library
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-white/40 dark:bg-white/8 backdrop-blur
                                           px-2 py-0.5 text-[10px] font-bold text-sand-600 dark:text-sand-400
                                           border border-white/20 dark:border-white/8">
                            {getCategoryLabel(product.category)}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : searching ? (
                <div className="flex items-center justify-center gap-2 px-4 py-5">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-sand-300 border-t-sand-600" />
                  <span className="text-sm text-gray-400 dark:text-gray-500">Searching...</span>
                </div>
              ) : (
                <div className="px-4 py-3 text-center text-sm text-gray-400 dark:text-gray-500">
                  No results — fill in the details below
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!isEditing && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/20 dark:bg-white/8" />
          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Product details</span>
          <div className="h-px flex-1 bg-white/20 dark:bg-white/8" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Product name
          </span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Hydrating Cleanser" className="glass-input w-full px-3.5 py-2.5" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Brand
          </span>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. CeraVe" className="glass-input w-full px-3.5 py-2.5" />
        </label>
      </div>

      <div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Category
          </span>
          <select
            value={selectValue}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="glass-input w-full px-3.5 py-2.5"
          >
            {BUILT_IN_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
            {savedCustomCategories.length > 0 && (
              <optgroup label="Your categories">
                {savedCustomCategories.map((c) => (
                  <option key={c} value={`custom:${c}`}>{capitalize(c)}</option>
                ))}
              </optgroup>
            )}
          </select>
        </label>

        {showCustomInput && (
          <div className="mt-2">
            <input
              type="text"
              value={customCategoryName}
              onChange={(e) => setCustomCategoryName(e.target.value)}
              placeholder="e.g. Mask, Oil, Mist…"
              className="glass-input w-full px-3.5 py-2.5"
              autoFocus
            />
            <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
              Type a custom category — it'll be saved for next time
            </p>
          </div>
        )}
      </div>

      {/* Hidden file input for OCR */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        {...(isMobile ? { capture: 'environment' as const } : {})}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Ingredients paste / scan section */}
      <div>
        <button
          type="button"
          onClick={() => setShowIngredients(!showIngredients)}
          className="flex w-full items-center justify-between rounded-xl bg-white/20 dark:bg-white/5 backdrop-blur
                     border border-white/20 dark:border-white/8 px-3.5 py-2.5 transition-colors
                     hover:bg-white/30 dark:hover:bg-white/8"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Paste or scan ingredients
            {detectedFromPaste.length > 0 && (
              <span className="rounded-full bg-sand-500/20 dark:bg-sand-400/20 px-2 py-0.5 text-[10px] font-bold text-sand-700 dark:text-sand-400">
                {detectedFromPaste.length} found
              </span>
            )}
          </span>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showIngredients ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showIngredients && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={ocrProcessing}
                className="btn-ghost flex items-center gap-1.5 px-3! py-1.5! text-xs!"
              >
                {isMobile ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Snap ingredients label
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload ingredients photo
                  </>
                )}
              </button>
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                {isMobile ? 'or paste the list from the packaging below' : 'JPG, PNG, or WebP'}
              </span>
            </div>

            {ocrProcessing && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Scanning image...</span>
                  <span>{Math.round(ocrProgress * 100)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20 dark:bg-white/8">
                  <div
                    className="h-full rounded-full bg-sand-500 transition-all duration-300"
                    style={{ width: `${Math.max(ocrProgress * 100, 2)}%` }}
                  />
                </div>
              </div>
            )}

            {ocrError && (
              <p className="text-xs text-red-500 dark:text-red-400">{ocrError}</p>
            )}

            <textarea
              value={ingredients}
              onChange={(e) => { setIngredients(e.target.value); setOcrError(''); }}
              placeholder="Paste the full INCI ingredients list from the back of the product or brand website..."
              rows={6}
              className="glass-input w-full resize-y px-3.5 py-2.5 text-sm leading-relaxed"
            />

            {detectedFromPaste.length > 0 && (
              <div className="rounded-xl bg-emerald-500/10 backdrop-blur border border-emerald-400/20 dark:border-emerald-500/10 px-3.5 py-2.5">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5">
                  {detectedFromPaste.length} flag{detectedFromPaste.length !== 1 ? 's' : ''} detected
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {detectedFromPaste.map((key) => (
                    <span key={key} className="rounded-lg bg-emerald-500/15 dark:bg-emerald-500/20
                                               px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                      {key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional: expiry + personal notes */}
      <div className="space-y-3">
        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Optional
        </span>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Period after opening
            </span>
            <input
              type="number"
              value={paoMonths}
              onChange={(e) => setPaoMonths(e.target.value)}
              min="1"
              max="60"
              placeholder="e.g. 12"
              className="glass-input w-full px-3.5 py-2.5"
            />
            <span className="mt-1.5 block text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
              Months from the open-jar symbol on the pack (e.g. 12M → 12)
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Date opened
            </span>
            <input
              type="date"
              value={openedAt}
              onChange={(e) => setOpenedAt(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="glass-input w-full px-3.5 py-2.5"
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Personal notes
          </span>
          <input
            type="text"
            value={productNotes}
            onChange={(e) => setProductNotes(e.target.value)}
            placeholder="e.g. HG moisturiser, only use in winter, stings on broken skin…"
            className="glass-input w-full px-3.5 py-2.5"
          />
        </label>
      </div>

      {selectedFlags.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Detected flags ({selectedFlags.length})
            </span>
            <button
              type="button"
              onClick={() => setShowFlags(!showFlags)}
              className="text-xs font-semibold text-sand-500 hover:text-sand-700 transition-colors dark:text-sand-400 dark:hover:text-sand-300"
            >
              {showFlags ? 'Hide' : 'Review & edit'}
            </button>
          </div>
          {!showFlags && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {flagOptionsToFlags(selectedFlags).map((f, i) => (
                <span key={i} className="rounded-lg bg-white/30 dark:bg-white/8 backdrop-blur
                                         border border-white/20 dark:border-white/8
                                         px-2 py-0.5 text-xs font-medium text-sand-700 dark:text-sand-400">
                  {f.ingredient}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {name.trim() && brand.trim() && ingredients.trim() && selectedFlags.length === 0 && !showFlags && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 backdrop-blur
                        border border-emerald-400/20 dark:border-emerald-500/10
                        px-3.5 py-2.5 text-sm text-emerald-700 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <span className="text-base">✅</span>
            No known flags for this product
          </div>
          <button
            type="button"
            onClick={() => setShowFlags(true)}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors
                       dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Add manually
          </button>
        </div>
      )}

      {showFlags && (
        <FlagPicker selected={selectedFlags} onChange={setSelectedFlags} />
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={!canSubmit} className="btn-primary">
          {isEditing ? 'Save changes' : 'Add product'}
        </button>
      </div>
    </form>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getCategoryLabel(category: string): string {
  const built = BUILT_IN_CATEGORIES.find((c) => c.value === category);
  if (built) return built.label;
  return capitalize(category);
}
