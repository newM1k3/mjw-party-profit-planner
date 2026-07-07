<div align="center">

![MJW Design](https://mjwdesign.ca/wp-content/uploads/2024/01/mjw-design-logo.png)

**Built with [MJW Design](https://mjwdesign.ca) — AI-Powered Development**

---

</div>

# MJW Party Profit Planner

A premium party and event business profit planning tool for escape room owners, party venue operators, and event hosts. It helps model pricing, calculate profitability, compare scenarios, build cost and revenue structures, and export polished summaries — with optional **PocketBase cloud saves** for persisting plans across sessions.

## Screenshots

| Dashboard Overview | Scenario Comparison |
| :---- | :---- |
| MJW Party Profit Planner results dashboard | MJW Party Profit Planner scenario comparison view |

## What It Does

Unlike general-purpose spreadsheets, this tool is built around the terminology and cost structures that party venue and escape room operators already work with — packages, add-ons, headcounts, and per-event margins.

| Panel | Purpose |
| :---- | :---- |
| **Welcome Hero** | Onboarding entry point with guided setup prompts. |
| **Package Setup** | Define party packages with names, pricing tiers, and included items. |
| **Revenue Builder** | Model revenue from ticket sales, packages, and add-ons per event. |
| **Cost Builder** | Enter fixed and variable costs — staffing, supplies, venue overhead. |
| **Checklist Builder** | Build per-event operational checklists tied to a package or scenario. |
| **Results Dashboard** | See profit, margin, break-even, and per-head metrics at a glance. |
| **Scenario Comparison** | Compare multiple pricing or cost configurations side by side. |
| **Opportunity Cost Panel** | Weigh trade-offs between booking types or time slots. |
| **Email Template Panel** | Generate client-facing email copy based on the current plan. |
| **Export Panel** | Download or share a formatted summary of the current plan. |

**Key interactions:**

- Set up packages and pricing in the Package Setup panel.
- Enter expected revenue streams in the Revenue Builder.
- Log all costs — fixed and variable — in the Cost Builder.
- View live profit, margin, and break-even calculations in the Results Dashboard.
- Build and compare multiple pricing scenarios in the Scenario Comparison panel.
- Assess opportunity costs between competing booking options.
- Generate email copy pre-filled with plan details for client outreach.
- Export the complete plan as a formatted file for sharing or record-keeping.
- Save and load plans via optional PocketBase cloud persistence.

## How to Use

Open the app and start with the Welcome Hero to understand the planning flow. Work left to right: configure your packages first, then enter your expected revenue, then log your costs. The Results Dashboard updates live as you enter data. Use Scenario Comparison to test a price increase or headcount change before committing, and use the Export Panel when you are ready to share or archive the plan.

The app is designed for desktop use where form entry, side-by-side comparisons, and dashboard review are most comfortable, but it remains usable on tablet and mobile for quick reviews.

## Stack

| Layer | Technology |
| :---- | :---- |
| UI framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Cloud persistence | PocketBase (via pocketbase ^0.26.8) |
| Additional data layer | @supabase/supabase-js ^2.57.4 |
| Hosting | Netlify |

## Local Development

```
npm install
```

```
npm run dev
```

The app works fully with **no environment variables**. Without a PocketBase URL configured, plans are managed in local browser state and can still be exported. Configure `VITE_POCKETBASE_URL` to enable cloud saves.

## Quality Checks

```
npm run typecheck
```

```
npm run lint
```

```
npm run build
```

## Available Scripts

```
npm run dev        # Start development server (http://localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint check
npm run typecheck  # TypeScript type check (no emit)
```

## Environment Variables

All environment variables are optional unless you enable the related feature. The app remains production-usable in local-only mode with no configured variables.

| Variable | Required? | Scope | Enables | Description |
| :---- | :---- | :---- | :---- | :---- |
| `VITE_POCKETBASE_URL` | Optional | Frontend/public | PocketBase cloud saves | Public PocketBase/PocketHost URL used for plan persistence and user-scoped storage. Example: `https://immersive-kit.pockethost.io`. |

## Saved Plans and PocketBase Cloud Saves

The app works fully with **no environment variables**. In local-only mode, plan state is held in browser memory for the current session, and users can still build, compare, and export full profit plans. Configuring `VITE_POCKETBASE_URL` enables cloud persistence so plans survive page reloads and can be accessed across devices.

When `VITE_POCKETBASE_URL` is configured, the app connects to the specified PocketBase instance to read and write plan records. Normal user authentication runs through the public PocketBase URL; **no PocketBase superuser token is placed in frontend code**.

### Recommended `party_plans` Collection

Create a PocketBase collection named `party_plans`. The implementation expects authenticated users to own their own records through an `owner` relation field. For the MJW canonical schema, configure the following fields.

| Field | Type | Notes |
| :---- | :---- | :---- |
| `title` | text | Display name for the saved plan. |
| `description` | text | Optional notes about the event or scenario. |
| `owner` | relation to `users` | Should point to the authenticated user. |
| `plan_json` | json | Stores packages, revenue, costs, and scenario data. |
| `visibility` | select | Recommended values: `private`, `shared`. |
| `version` | number | Incremented on save for conflict tracking. |
| `created` | system field | Managed by PocketBase. |
| `updated` | system field | Managed by PocketBase. |

Recommended collection rules should allow authenticated users to create records for themselves and only read, update, or delete their own records. A practical rule pattern is `@request.auth.id != "" && owner = @request.auth.id` for user-scoped list/view/update/delete rules. The create rule should require authentication and an owner value matching the authenticated user.

## Netlify Deployment

The `netlify.toml` at the project root configures the Vite build and static routing. To deploy on Netlify, connect this GitHub repository and use the following production settings.

| Setting | Value |
| :---- | :---- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node/package install | Netlify default Node environment with `npm install` |

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Deploy first with no environment variables to confirm the local-only app works, then add `VITE_POCKETBASE_URL` to enable cloud plan saves.

## Accessibility and Production Readiness

The release UI includes accessible labels on major panel controls, cost and revenue inputs, scenario comparison actions, and export controls. Empty and unconfigured states are intentionally explicit so the app remains understandable before optional services are set up. The Welcome Hero provides onboarding guidance for new users arriving without context.

## Project Structure

```
src/
  components/
    ChecklistBuilder.tsx      # Per-event operational checklist editor
    CostBuilder.tsx           # Fixed and variable cost entry
    EmailTemplatePanel.tsx    # Client email copy generator
    ExportPanel.tsx           # Plan export and download
    OpportunityCostPanel.tsx  # Trade-off analysis between booking options
    PackageSetupPanel.tsx     # Party package and pricing configuration
    ResultsDashboard.tsx      # Live profit, margin, and break-even display
    RevenueBuilder.tsx        # Revenue stream modelling
    ScenarioComparison.tsx    # Side-by-side scenario comparison
    WelcomeHero.tsx           # Onboarding entry point
  data/
    seedData.ts               # Default/example plan data
  lib/
    exporters.ts              # Plan export helpers
    pocketbase.ts             # Optional PocketBase client wrapper
    profitCalculations.ts     # Core profit, margin, and break-even logic
    storage.ts                # Local state persistence helpers
    venue.ts                  # Venue-specific configuration utilities
  types/
    index.ts                  # Shared plan and scenario types
  App.tsx                     # Root layout and panel routing
  main.tsx                    # Entry point
netlify.toml                  # Netlify build and redirect configuration
```

## Changelog

### v1.0.0 — Initial Production Release

- Launched Package Setup, Revenue Builder, Cost Builder, and Results Dashboard with live profit and margin calculations.
- Added Scenario Comparison panel for side-by-side pricing and cost model analysis.
- Added Opportunity Cost Panel for trade-off analysis between competing booking types.
- Added Email Template Panel for generating client-facing copy from plan data.
- Added Export Panel for downloading formatted plan summaries.
- Added Checklist Builder for per-event operational checklists.
- Included optional PocketBase cloud persistence with local-only fallback.
- Added Welcome Hero onboarding, seed data for first-time users, and Netlify deployment configuration.

---

Part of the **MJW Personal App Platform**.