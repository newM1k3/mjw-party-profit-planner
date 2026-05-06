import type { AppState } from '../types';

const STORAGE_KEY = 'mjw_party_profit_planner_state_v1';

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or private mode
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
