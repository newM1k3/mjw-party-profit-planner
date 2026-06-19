import PocketBase from 'pocketbase';
import type { AppState } from '../types';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'https://immersive-kit.pockethost.io');

export default pb;

const COLLECTION = 'party_profit_projects';
const EXTERNAL_ID = 'default';

export async function savePlannerState(state: AppState): Promise<void> {
  if (!pb.authStore.isValid) return;
  const userId = pb.authStore.record?.id as string;
  if (!userId) return;

  const payload = {
    pkg: state.pkg,
    scenario: state.scenario,
    checklist: state.checklist,
    emailTemplates: state.emailTemplates,
    activeTab: state.activeTab,
  };

  try {
    const existing = await pb.collection(COLLECTION).getFirstListItem(
      `external_id = "${EXTERNAL_ID}" && user_id = "${userId}"`
    );
    await pb.collection(COLLECTION).update(existing.id, { payload });
  } catch {
    await pb.collection(COLLECTION).create({
      external_id: EXTERNAL_ID,
      user_id: userId,
      payload,
      archived: false,
    });
  }
}

export async function loadPlannerState(): Promise<AppState | null> {
  if (!pb.authStore.isValid) return null;
  const userId = pb.authStore.record?.id as string;
  if (!userId) return null;

  try {
    const record = await pb.collection(COLLECTION).getFirstListItem(
      `external_id = "${EXTERNAL_ID}" && user_id = "${userId}"`
    );
    return record.payload as AppState;
  } catch {
    return null;
  }
}
