import { useEffect } from 'react';
import type { Product } from '../types';
import { getProductExpiryDate } from '../data/conflicts';

const THRESHOLDS = [30, 7, 1] as const;
const STORAGE_PREFIX = 'pao-notified:';

function notifiedKey(productId: string, days: number): string {
  return `${STORAGE_PREFIX}${productId}:${days}`;
}

function wasNotifiedToday(productId: string, days: number): boolean {
  const val = localStorage.getItem(notifiedKey(productId, days));
  if (!val) return false;
  return new Date(val).toDateString() === new Date().toDateString();
}

function markNotified(productId: string, days: number): void {
  localStorage.setItem(notifiedKey(productId, days), new Date().toISOString());
}

function daysUntil(date: Date): number {
  return Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function showNotification(title: string, body: string): void {
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: '/logo.png', badge: '/logo.png' });
  } catch {
    // Notifications blocked or unsupported
  }
}

export function usePaoNotifications(products: Product[]): void {
  useEffect(() => {
    if (
      typeof Notification === 'undefined' ||
      Notification.permission !== 'granted'
    )
      return;

    const productsWithPao = products.filter(
      (p) => p.openedAt && p.paoMonths && p.paoMonths > 0,
    );

    for (const p of productsWithPao) {
      const expiry = getProductExpiryDate(p);
      if (!expiry) continue;
      const days = daysUntil(expiry);

      for (const threshold of THRESHOLDS) {
        if (
          days <= threshold &&
          days >= 0 &&
          !wasNotifiedToday(p.id, threshold)
        ) {
          const label =
            threshold === 1
              ? 'expires tomorrow'
              : threshold === 7
                ? 'expires in 7 days'
                : 'expires in 30 days';
          showNotification(
            `${p.name} ${label}`,
            `${p.brand} · opened ${new Date(p.openedAt!).toLocaleDateString('en-GB')} · ${p.paoMonths}M PAO`,
          );
          markNotified(p.id, threshold);
          break; // show the most urgent threshold only
        }
      }
    }
  }, [products]);
}
