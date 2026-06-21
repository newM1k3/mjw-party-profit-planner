// venue.ts — Party Profit Planner on the unified spine (Phase 3).
//
// The planner state is a venue-scoped drawer (tool_key=party_profit, scope=venue). The venue is a
// platform `projects` record, resolved via the user's org membership (mirrors the Corporate
// Proposal Generator's resolveVenue). One drawer per venue. Replaces the retired per-user
// `party_profit_projects` table (which keyed a single 'default' doc per user).
//
// Note on seeding: unlike the room-scoped tools, the planner's package/cost model has no natural
// mapping from the venue profile (brand_voice / corporate_packages / city), so a fresh venue with
// no drawer falls back to the app's local seed example (data/seedData) — that's the "never blank".

import pb from './pocketbase';
import type { AppState } from '../types';

/** The slice of AppState persisted to the drawer (the planner document body). */
export type PlannerPayload = Pick<AppState, 'pkg' | 'scenario' | 'checklist' | 'emailTemplates' | 'activeTab'>;

export interface VenueContext {
  orgId: string;
  venueId: string;
}

/** The user's venue = the first project under their first active org membership. */
export async function resolveVenue(): Promise<VenueContext | null> {
  if (!pb.authStore.isValid) return null;
  const uid = pb.authStore.record?.id;
  if (!uid) return null;

  const memberships = await pb.collection('memberships').getFullList({
    filter: `user = '${uid}' && status = 'active'`,
    requestKey: null,
  });
  for (const m of memberships) {
    const orgId = m.organization as string;
    const projects = await pb.collection('projects').getFullList({
      filter: `organization = '${orgId}'`,
      requestKey: null,
    });
    if (projects[0]) return { orgId, venueId: projects[0].id };
  }
  return null;
}

/** Load the venue's planner drawer, or null if none exists yet. */
export async function loadPlannerDrawer(venueId: string): Promise<PlannerPayload | null> {
  try {
    const rec = await pb.collection('drawers').getFirstListItem(
      `tool_key = 'party_profit' && venue = '${venueId}'`,
      { requestKey: null },
    );
    return rec.data as PlannerPayload;
  } catch {
    return null;
  }
}

/** Upsert the venue's planner drawer (one row per venue). Returns the drawer record id. */
export async function savePlannerDrawer(ctx: VenueContext, state: AppState): Promise<string> {
  if (!pb.authStore.isValid) throw new Error('Must be signed in to save');

  const data: PlannerPayload = {
    pkg: state.pkg,
    scenario: state.scenario,
    checklist: state.checklist,
    emailTemplates: state.emailTemplates,
    activeTab: state.activeTab,
  };
  const body = {
    tool_key: 'party_profit',
    scope_type: 'venue',
    organization: ctx.orgId,
    venue: ctx.venueId,
    title: state.pkg.name || 'Party Profit Plan',
    data,
    status: 'active',
  };

  let existingId: string | null = null;
  try {
    const existing = await pb.collection('drawers').getFirstListItem(
      `tool_key = 'party_profit' && venue = '${ctx.venueId}'`,
      { requestKey: null },
    );
    existingId = existing.id;
  } catch {
    existingId = null; // no drawer for this venue yet
  }

  if (existingId) {
    await pb.collection('drawers').update(existingId, body, { requestKey: null });
    return existingId;
  }
  const created = await pb.collection('drawers').create({ ...body, version: 1 }, { requestKey: null });
  return created.id;
}
