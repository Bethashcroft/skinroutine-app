import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbGetAll, dbSet, dbClear } from '../lib/db';
import { useAuth, isSupabaseConfigured } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { useRoutineLog } from '../hooks/useRoutineLog';
import { useSkinProfile } from '../hooks/useSkinProfile';
import { SKIN_TYPES, CONCERNS } from '../data/skin-recommendations';
import { pushProducts, pushEntries, pushProfile } from '../lib/sync';
import SyncFailedModal from '../components/SyncFailedModal';
import type { SkinType, Concern } from '../types';

export default function Settings() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { user, signOut } = useAuth();
  const { products } = useProducts();
  const { entries } = useRoutineLog();
  const { profile, setProfile } = useSkinProfile();
  const navigate = useNavigate();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');
  const [syncFailedOpen, setSyncFailedOpen] = useState(false);

  async function handleExport() {
    const data = await dbGetAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skinroutine-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result as string);
        for (const [key, value] of Object.entries(data)) {
          await dbSet(key, value);
        }
        setImportStatus('success');
        setTimeout(() => window.location.reload(), 800);
      } catch {
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  }

  async function handleClearAll() {
    await dbClear();
    window.location.reload();
  }

  const handleSyncNow = useCallback(async () => {
    if (!user) return;
    setSyncStatus('syncing');
    setSyncFailedOpen(false);
    try {
      const tasks: Promise<void>[] = [
        pushProducts(products),
        pushEntries(entries),
      ];
      if (profile) tasks.push(pushProfile(profile));
      await Promise.all(tasks);
      setSyncFailedOpen(false);
      setSyncStatus('done');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch {
      setSyncStatus('error');
      setSyncFailedOpen(true);
    }
  }, [user, products, entries, profile]);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const [editingProfile, setEditingProfile] = useState(false);
  const [draftSkinType, setDraftSkinType] = useState<SkinType>(profile?.skinType ?? 'normal');
  const [draftConcerns, setDraftConcerns] = useState<Concern[]>(profile?.concerns ?? []);
  const [confirmClear, setConfirmClear] = useState(false);

  function startEditProfile() {
    setDraftSkinType(profile?.skinType ?? 'normal');
    setDraftConcerns(profile?.concerns ?? []);
    setEditingProfile(true);
  }

  async function saveProfile() {
    await setProfile({ skinType: draftSkinType, concerns: draftConcerns });
    setEditingProfile(false);
  }

  function toggleDraftConcern(c: Concern) {
    setDraftConcerns((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  return (
    <div className="space-y-6">
      <SyncFailedModal
        open={syncFailedOpen}
        onClose={() => setSyncFailedOpen(false)}
        onRetry={handleSyncNow}
        retrying={syncStatus === 'syncing'}
      />
      <div>
        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Settings</h2>
        <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">Manage your account and data</p>
      </div>

      {/* Account section */}
      {isSupabaseConfigured && (
        <div className="card-solid noise overflow-hidden divide-y divide-white/15 dark:divide-white/8">
          {user ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
                <div>
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Account</h3>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    Signed in as <strong className="text-gray-600 dark:text-gray-300">{user.email}</strong>
                  </p>
                </div>
                <button type="button" onClick={handleSignOut}
                  className="btn-ghost w-full sm:w-auto text-red-500! dark:text-red-400!">
                  Sign out
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
                <div>
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Cloud sync</h3>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    Push all local data to the cloud right now
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSyncNow}
                  disabled={syncStatus === 'syncing'}
                  className="btn-primary w-full sm:w-auto disabled:opacity-50"
                >
                  {syncStatus === 'syncing'
                    ? 'Syncing…'
                    : syncStatus === 'done'
                      ? 'Synced'
                      : syncStatus === 'error'
                        ? 'Retry'
                        : 'Sync now'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Account</h3>
                <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                  Sign in to sync your data across devices
                </p>
              </div>
              <button type="button" onClick={() => navigate('/auth')} className="btn-primary w-full sm:w-auto">
                Sign in
              </button>
            </div>
          )}
        </div>
      )}

      {/* Skin profile */}
      <div className="card-solid noise overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/15 dark:border-white/8">
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Skin profile</h3>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
              {profile ? 'Your skin type and concerns' : 'Set up your profile for personalised recommendations'}
            </p>
          </div>
          <div className="flex gap-2">
            {profile && !editingProfile && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/?retake=quiz')}
                  className="btn-ghost px-3! py-1.5! text-xs! rounded-lg!"
                >
                  Retake quiz
                </button>
                <button type="button" onClick={startEditProfile}
                  className="btn-ghost px-3! py-1.5! text-xs! rounded-lg!">
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        {editingProfile ? (
          <div className="px-5 py-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Skin type</p>
              <div className="flex flex-wrap gap-1.5">
                {SKIN_TYPES.map((t) => {
                  const active = draftSkinType === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setDraftSkinType(t.value)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border
                        ${active
                          ? 'bg-sand-500/15 border-sand-400/30 text-sand-700 dark:bg-sand-400/10 dark:border-sand-500/20 dark:text-sand-300 shadow-sm'
                          : 'bg-white/20 dark:bg-white/4 border-white/20 dark:border-white/8 text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/6'
                        }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Concerns
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CONCERNS.map((c) => {
                  const active = draftConcerns.includes(c.value);
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => toggleDraftConcern(c.value)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all border
                        ${active
                          ? 'bg-sand-500/15 border-sand-400/30 text-sand-700 dark:bg-sand-400/10 dark:border-sand-500/20 dark:text-sand-300 shadow-sm'
                          : 'bg-white/20 dark:bg-white/4 border-white/20 dark:border-white/8 text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/6'
                        }`}
                    >
                      {c.icon} {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 pt-1 justify-end">
              <button type="button" onClick={saveProfile}
                className="btn-primary px-4! py-1.5! text-xs!">
                Save
              </button>
              <button type="button" onClick={() => setEditingProfile(false)}
                className="btn-ghost px-4! py-1.5! text-xs!">
                Cancel
              </button>
            </div>
          </div>
        ) : profile ? (
          <div className="px-5 py-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sand-500/15 dark:bg-sand-400/10 border border-sand-400/25 dark:border-sand-500/15
                             px-3 py-1 text-xs font-bold text-sand-700 dark:text-sand-300">
              {SKIN_TYPES.find((t) => t.value === profile.skinType)?.label ?? profile.skinType} skin
            </span>
            {profile.concerns.map((c) => {
              const meta = CONCERNS.find((x) => x.value === c);
              return (
                <span key={c} className="rounded-full bg-white/35 dark:bg-white/8 border border-white/25 dark:border-white/10
                                         px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                  {meta?.icon} {meta?.label ?? c}
                </span>
              );
            })}
            {profile.concerns.length === 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">No concerns selected</span>
            )}
          </div>
        ) : (
          <div className="px-5 py-4">
            <button type="button" onClick={startEditProfile} className="btn-primary w-full sm:w-auto">
              Set up profile
            </button>
          </div>
        )}
      </div>

      {/* Data management */}
      <div className="card-solid noise overflow-hidden divide-y divide-white/15 dark:divide-white/8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Export data</h3>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Download all your products and routine logs as a JSON file</p>
          </div>
          <button type="button" onClick={handleExport} className="btn-primary w-full sm:w-auto">
            Export
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Import data</h3>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Restore from a previously exported backup file</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost w-full sm:w-auto">
              Import
            </button>
            {importStatus === 'success' && <span className="text-xs text-green-600 dark:text-green-400 font-medium">Imported!</span>}
            {importStatus === 'error' && <span className="text-xs text-red-500 dark:text-red-400 font-medium">Invalid file</span>}
          </div>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Clear all data</h3>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Permanently delete all local products, logs and cached data</p>
          </div>
          {confirmClear ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500 dark:text-red-400">This cannot be undone!</span>
              <button type="button" onClick={handleClearAll}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-600">
                Confirm
              </button>
              <button type="button" onClick={() => setConfirmClear(false)} className="btn-ghost px-4! py-2.5!">
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="w-full sm:w-auto rounded-xl bg-white/20 backdrop-blur border border-red-300/30
                         dark:border-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-500 dark:text-red-400
                         transition-all hover:bg-red-50/50 dark:hover:bg-red-950/20"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
