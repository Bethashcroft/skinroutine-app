import { useState, useMemo } from 'react';
import type { SkinRating, RoutineEntry } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useRoutineLog } from '../hooks/useRoutineLog';
import RoutineEntryForm from '../components/RoutineEntryForm';
import RoutineEntryCard from '../components/RoutineEntryCard';

type FormState =
  | { kind: 'closed' }
  | { kind: 'add'; session: 'AM' | 'PM' }
  | { kind: 'edit'; entry: RoutineEntry };

function toLocalDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function RoutineLog() {
  const { products } = useProducts();
  const { entries, addEntry, updateEntry, deleteEntry } = useRoutineLog();

  const [selectedDate, setSelectedDate] = useState(() => toLocalDateString(new Date()));
  const [form, setForm] = useState<FormState>({ kind: 'closed' });

  const dayEntries = useMemo(
    () => entries.filter((e) => e.date === selectedDate),
    [entries, selectedDate],
  );

  const amEntries = dayEntries.filter((e) => e.session === 'AM');
  const pmEntries = dayEntries.filter((e) => e.session === 'PM');

  const yesterdayStr = useMemo(() => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    return toLocalDateString(d);
  }, [selectedDate]);

  const yesterdayEntries = useMemo(
    () => entries.filter((e) => e.date === yesterdayStr),
    [entries, yesterdayStr],
  );

  const yesterdayAM = yesterdayEntries.filter((e) => e.session === 'AM');
  const yesterdayPM = yesterdayEntries.filter((e) => e.session === 'PM');

  const canRepeatAM = amEntries.length === 0 && yesterdayAM.length > 0;
  const canRepeatPM = pmEntries.length === 0 && yesterdayPM.length > 0;
  const canRepeatAll = canRepeatAM && canRepeatPM;

  function handleRepeatSession(session: 'AM' | 'PM') {
    const source = session === 'AM' ? yesterdayAM : yesterdayPM;
    for (const entry of source) {
      addEntry({
        date: selectedDate,
        session: entry.session,
        productIds: entry.productIds,
        skinRating: entry.skinRating,
        notes: '',
      });
    }
  }

  function handleRepeatAll() {
    for (const entry of yesterdayEntries) {
      const alreadyLogged = entry.session === 'AM' ? amEntries : pmEntries;
      if (alreadyLogged.length > 0) continue;
      addEntry({
        date: selectedDate,
        session: entry.session,
        productIds: entry.productIds,
        skinRating: entry.skinRating,
        notes: '',
      });
    }
  }

  function handleAdd(session: 'AM' | 'PM', data: { productIds: string[]; skinRating: SkinRating; notes: string }) {
    addEntry({ date: selectedDate, session, ...data });
    setForm({ kind: 'closed' });
  }

  function handleUpdate(id: string, data: { productIds: string[]; skinRating: SkinRating; notes: string }) {
    updateEntry(id, data);
    setForm({ kind: 'closed' });
  }

  function navigateDate(offset: number) {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + offset);
    setSelectedDate(toLocalDateString(d));
    setForm({ kind: 'closed' });
  }

  const isToday = selectedDate === toLocalDateString(new Date());

  const dateObj = new Date(selectedDate + 'T12:00:00');
  const displayDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Routine Log</h2>
        <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">Track your daily skincare</p>
      </div>

      {/* Date navigator */}
      <div className="card flex items-center justify-between px-2 sm:px-4 py-2.5">
        <button
          type="button"
          onClick={() => navigateDate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200
                     bg-white/20 backdrop-blur border border-white/20 text-sand-600
                     hover:bg-white/35 hover:shadow-md
                     dark:bg-white/6 dark:border-white/8 dark:text-sand-400 dark:hover:bg-white/12"
          aria-label="Previous day"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <span className="block text-sm font-bold text-gray-700 dark:text-gray-200 tracking-tight">{displayDate}</span>
          {isToday && (
            <span className="inline-block mt-0.5 rounded-full bg-white/30 dark:bg-white/8 backdrop-blur
                             px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-sand-600 dark:text-sand-400
                             border border-white/20 dark:border-white/8">
              Today
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => navigateDate(1)}
          disabled={isToday}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200
                     bg-white/20 backdrop-blur border border-white/20 text-sand-600
                     hover:bg-white/35 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-20
                     dark:bg-white/6 dark:border-white/8 dark:text-sand-400 dark:hover:bg-white/12"
          aria-label="Next day"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {canRepeatAll && (
        <button
          type="button"
          onClick={handleRepeatAll}
          className="w-full rounded-2xl border-2 border-dashed px-4 py-3.5 text-sm font-medium transition-all duration-200
                     border-white/30 text-sand-600 bg-white/15 backdrop-blur
                     hover:border-white/50 hover:bg-white/25 hover:shadow-md
                     dark:border-white/10 dark:text-sand-400 dark:bg-white/3
                     dark:hover:border-white/15 dark:hover:bg-white/6"
        >
          🔁 Repeat yesterday&apos;s routine
        </button>
      )}

      <SessionSection
        label="Morning"
        session="AM"
        entries={amEntries}
        products={products}
        form={form}
        canRepeat={canRepeatAM && !canRepeatAll}
        onRepeat={() => handleRepeatSession('AM')}
        onAdd={() => setForm({ kind: 'add', session: 'AM' })}
        onSubmit={(data) => handleAdd('AM', data)}
        onEdit={(entry) => setForm({ kind: 'edit', entry })}
        onUpdate={handleUpdate}
        onDelete={(id) => deleteEntry(id)}
        onCancel={() => setForm({ kind: 'closed' })}
      />

      <SessionSection
        label="Evening"
        session="PM"
        entries={pmEntries}
        products={products}
        form={form}
        canRepeat={canRepeatPM && !canRepeatAll}
        onRepeat={() => handleRepeatSession('PM')}
        onAdd={() => setForm({ kind: 'add', session: 'PM' })}
        onSubmit={(data) => handleAdd('PM', data)}
        onEdit={(entry) => setForm({ kind: 'edit', entry })}
        onUpdate={handleUpdate}
        onDelete={(id) => deleteEntry(id)}
        onCancel={() => setForm({ kind: 'closed' })}
      />
    </div>
  );
}

interface SessionSectionProps {
  label: string;
  session: 'AM' | 'PM';
  entries: RoutineEntry[];
  products: ReturnType<typeof useProducts>['products'];
  form: FormState;
  canRepeat: boolean;
  onRepeat: () => void;
  onAdd: () => void;
  onSubmit: (data: { productIds: string[]; skinRating: SkinRating; notes: string }) => void;
  onEdit: (entry: RoutineEntry) => void;
  onUpdate: (id: string, data: { productIds: string[]; skinRating: SkinRating; notes: string }) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

function SessionSection({
  label,
  session,
  entries,
  products,
  form,
  canRepeat,
  onRepeat,
  onAdd,
  onSubmit,
  onEdit,
  onUpdate,
  onDelete,
  onCancel,
}: SessionSectionProps) {
  const isAddingThis = form.kind === 'add' && form.session === session;
  const editingEntry = form.kind === 'edit' && form.entry.session === session ? form.entry : null;

  const isAM = session === 'AM';
  const accentColor = isAM ? 'bg-sand-400' : 'bg-violet-400/80';
  const emoji = isAM ? '☀️' : '🌙';

  return (
    <section className="card-solid noise overflow-hidden">
      <div className={`h-1.5 ${accentColor}`} />
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200 tracking-tight">
            <span className="text-lg">{emoji}</span> {label} Routine
          </h3>
          {!isAddingThis && !editingEntry && (
            <button type="button" onClick={onAdd} className="btn-ghost px-4! py-2! text-xs!">
              + Log {label.toLowerCase()}
            </button>
          )}
        </div>

        {isAddingThis && (
          <div className="card p-5 mb-3">
            <RoutineEntryForm
              products={products}
              session={session}
              onSubmit={onSubmit}
              onCancel={onCancel}
            />
          </div>
        )}

        <div className="space-y-3">
          {entries.map((entry) =>
            editingEntry?.id === entry.id ? (
              <div key={entry.id} className="card p-5">
                <RoutineEntryForm
                  products={products}
                  session={session}
                  initial={{
                    productIds: entry.productIds,
                    skinRating: entry.skinRating,
                    notes: entry.notes,
                  }}
                  onSubmit={(data) => onUpdate(entry.id, data)}
                  onCancel={onCancel}
                />
              </div>
            ) : (
              <RoutineEntryCard
                key={entry.id}
                entry={entry}
                products={products}
                onEdit={() => onEdit(entry)}
                onDelete={() => onDelete(entry.id)}
              />
            ),
          )}
        </div>

        {entries.length === 0 && !isAddingThis && (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="text-2xl opacity-25">{emoji}</span>
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
              No {label.toLowerCase()} routine logged
            </p>
            {canRepeat && (
              <button
                type="button"
                onClick={onRepeat}
                className="mt-3 rounded-xl border border-dashed px-4 py-2 text-xs font-medium transition-all duration-200
                           border-white/30 text-sand-600 bg-white/15 backdrop-blur
                           hover:border-white/50 hover:bg-white/25 hover:shadow-md
                           dark:border-white/10 dark:text-sand-400 dark:bg-white/3
                           dark:hover:border-white/15 dark:hover:bg-white/6"
              >
                🔁 Repeat yesterday&apos;s {label.toLowerCase()}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
