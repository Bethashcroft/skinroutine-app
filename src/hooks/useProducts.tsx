import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { nanoid } from 'nanoid';
import type { Product, ProductCategory, IngredientFlag } from '../types';
import { useStoredState } from './useStoredState';
import { useAuth } from './useAuth';
import { addToUserCatalog } from '../data/product-search';
import { flagsToOptionKeys } from '../data/ingredient-flags';
import { submitCommunityFlags } from '../lib/supabase';
import {
  pushProducts,
  pullProducts,
  pullDeletedProductIds,
  deleteRemoteProduct,
} from '../lib/sync';
import { dbGet, dbSet } from '../lib/db';
import { productsKey, LEGACY_PRODUCTS_KEY } from '../lib/storage-keys';

export interface ProductInput {
  name: string;
  brand: string;
  category: ProductCategory;
  flags: IngredientFlag[];
  ingredients?: string;
  notes?: string;
  openedAt?: string;
  paoMonths?: number;
}

interface ProductsContextValue {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  addProduct: (input: ProductInput) => Product;
  updateProduct: (id: string, input: ProductInput) => Product | null;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | null;
  initialSyncDone: boolean;
  isNewUser: boolean;
  clearIsNewUser: () => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

function useProductsState(): ProductsContextValue {
  const { user } = useAuth();
  const key = productsKey(user?.id);
  const [products, setProducts, isReady] = useStoredState<Product[]>(key, []);
  const syncedUserRef = useRef<string | null>(null);
  const migratedLegacy = useRef(false);
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const initialSyncDone = !user || syncedUserId === user.id;

  useEffect(() => {
    if (!user?.id || migratedLegacy.current || !isReady) return;
    migratedLegacy.current = true;

    (async () => {
      const current = await dbGet<Product[]>(key);
      if (current && current.length > 0) return;

      const legacy = await dbGet<Product[]>(LEGACY_PRODUCTS_KEY);
      if (legacy && legacy.length > 0) {
        setProducts(legacy);
        await dbSet(key, legacy);
      }
    })();
  }, [user?.id, isReady, key, setProducts]);

  useEffect(() => {
    if (!user) syncedUserRef.current = null;
  }, [user]);

  useEffect(() => {
    if (!user || !isReady) return;
    if (syncedUserRef.current === user.id) return;
    syncedUserRef.current = user.id;
    const userId = user.id;

    Promise.all([pullProducts(), pullDeletedProductIds()])
      .then(([remote, deletedIds]) => {
        setIsNewUser(remote.length === 0);
        const deletedSet = new Set(deletedIds);
        setProducts((local) => {
          // Drop anything deleted on another device before merging.
          const survivingLocal = local.filter((p) => !deletedSet.has(p.id));
          const localIds = new Set(survivingLocal.map((p) => p.id));
          const remoteIds = new Set(remote.map((p) => p.id));
          const merged = [...survivingLocal];
          for (const rp of remote) {
            if (!localIds.has(rp.id)) merged.push(rp);
          }
          // Only push local products that are genuinely new (not tombstoned).
          const localOnly = survivingLocal.filter((p) => !remoteIds.has(p.id));
          if (localOnly.length > 0) {
            pushProducts(localOnly).catch(() => {});
          }
          return merged;
        });
      })
      .catch(() => {
        setIsNewUser(false);
      })
      .finally(() => setSyncedUserId(userId));
  }, [user, isReady, setProducts]);

  const syncProduct = useCallback(
    (product: Product) => {
      if (!user) return;
      pushProducts([product]).catch(() => {});
    },
    [user],
  );

  const addProduct = useCallback(
    (input: ProductInput): Product => {
      const product: Product = {
        id: nanoid(),
        name: input.name,
        brand: input.brand,
        category: input.category,
        flags: input.flags,
        ...(input.ingredients ? { ingredients: input.ingredients } : {}),
        ...(input.notes ? { notes: input.notes } : {}),
        ...(input.openedAt ? { openedAt: input.openedAt } : {}),
        ...(input.paoMonths ? { paoMonths: input.paoMonths } : {}),
        createdAt: new Date().toISOString(),
      };

      setProducts((prev) => [...prev, product]);
      addToUserCatalog({
        name: input.name,
        brand: input.brand,
        category: input.category,
        flagKeys: flagsToOptionKeys(input.flags),
      });

      const keys = flagsToOptionKeys(input.flags);
      if (keys.length > 0) {
        submitCommunityFlags(input.name, input.brand, keys);
      }

      syncProduct(product);
      return product;
    },
    [setProducts, syncProduct],
  );

  const updateProduct = useCallback(
    (id: string, input: ProductInput): Product | null => {
      const existing = products.find((p) => p.id === id);
      if (!existing) return null;

      const saved: Product = {
        ...existing,
        name: input.name,
        brand: input.brand,
        category: input.category,
        flags: input.flags,
        ingredients: input.ingredients,
        notes: input.notes,
        openedAt: input.openedAt,
        paoMonths: input.paoMonths,
      };

      setProducts((prev) => prev.map((p) => (p.id === id ? saved : p)));

      if (saved.flags.length > 0) {
        submitCommunityFlags(
          saved.name,
          saved.brand,
          flagsToOptionKeys(saved.flags),
        );
      }

      syncProduct(saved);
      return saved;
    },
    [products, setProducts, syncProduct],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (user) {
        deleteRemoteProduct(id).catch(() => {});
      }
    },
    [setProducts, user],
  );

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id) ?? null,
    [products],
  );

  const clearIsNewUser = useCallback(() => setIsNewUser(false), []);

  return {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    initialSyncDone,
    isNewUser,
    clearIsNewUser,
  };
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const value = useProductsState();
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return ctx;
}
