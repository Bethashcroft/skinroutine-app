import { useState } from 'react';
import { SKIN_TYPES, CONCERNS } from '../data/skin-recommendations';
import type { SkinType, Concern, SkinProfile } from '../types';

interface Props {
  initialSkinType?: SkinType;
  initialConcerns?: Concern[];
  onSave: (profile: SkinProfile) => void | Promise<void>;
  onCancel: () => void;
  saveLabel?: string;
}

/**
 * Shared skin-type + concerns editor used on both the Dashboard and Settings.
 * Manages its own draft state; commits via onSave.
 */
export default function SkinProfileEditor({
  initialSkinType = 'normal',
  initialConcerns = [],
  onSave,
  onCancel,
  saveLabel = 'Save',
}: Props) {
  const [skinType, setSkinType] = useState<SkinType>(initialSkinType);
  const [concerns, setConcerns] = useState<Concern[]>(initialConcerns);
  const [saving, setSaving] = useState(false);

  function toggleConcern(c: Concern) {
    setConcerns((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      await onSave({ skinType, concerns });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Skin type</p>
        <div className="flex flex-wrap gap-1.5">
          {SKIN_TYPES.map((t) => {
            const active = skinType === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setSkinType(t.value)}
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
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Concerns</p>
        <div className="flex flex-wrap gap-1.5">
          {CONCERNS.map((c) => {
            const active = concerns.includes(c.value);
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => toggleConcern(c.value)}
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
        <button type="button" onClick={handleSave} disabled={saving}
          className="btn-primary px-4! py-1.5! text-xs! disabled:opacity-50">
          {saving ? 'Saving…' : saveLabel}
        </button>
        <button type="button" onClick={onCancel} disabled={saving}
          className="btn-ghost px-4! py-1.5! text-xs!">
          Cancel
        </button>
      </div>
    </div>
  );
}
