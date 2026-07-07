<div align="center">

![MJW Design](https://mjwdesign.ca/wp-content/uploads/2024/01/mjw-design-logo.png)

**Built with [MJW Design](https://mjwdesign.ca) — AI-Powered Development**

---

</div>

# MJW Party Profit Planner

A premium profit-planning tool for party and event venue operators. It helps design, save, export, and compare pricing packages with a purpose-built calculator covering revenue, costs, opportunity cost, and net profit. The app includes local/offline saved scenarios, optional **PocketBase cloud saves**, checklist and email template builders, scenario comparison, and full export support.

## Screenshots

| Desktop Dashboard | Package Setup & Results |
| :---- | :---- |
| MJW Party Profit Planner desktop dashboard interface | MJW Party Profit Planner package setup and results state |

## What It Does

Unlike generic spreadsheet tools, this app uses terminology and structures that party venue operators and event planners already know.

| Panel | Purpose |
| :---- | :---- |
| **Welcome Hero** | Onboarding entry point with quick-start guidance. |
| **Package Setup** | Define your event packages, capacity, and base pricing. |
| **Revenue Builder** | Model ticket sales, add-ons, and upsell revenue streams. |
| **Cost Builder** | Itemise fixed and variable costs per event. |
| **Opportunity Cost** | Factor in the value of time slots and alternative uses. |
| **Results Dashboard** | View net profit, margin, break-even, and per-head figures. |
| **Scenario Comparison** | Side-by-side analysis of multiple pricing scenarios. |
| **Checklist Builder** | Build pre-event and post-event operational checklists. |
| **Email Template Panel** | Draft and store client-facing email templates. |
| **Export Panel** | Export results to portable formats for sharing or records. |

**Key interactions:**

- Define one or more packages through the Package Setup panel.
- Add revenue line items in the Revenue Builder and cost line items in the Cost Builder.
- Factor in opportunity costs for each time slot or day-part.
- View live profit calculations, margin percentages, and break-even attendance in the Results Dashboard.
- Compare multiple pricing scenarios side by side in the Scenario Comparison panel.
- Build operational checklists and draft email templates for client communication.
- Save and load scenarios locally or via PocketBase cloud.
- Export results and summaries for use outside the app.

## How to Use

The app opens with a Welcome Hero so new users immediately understand where to begin. Start by entering a package name and capacity in Package Setup, then move through Revenue Builder and Cost Builder to model a real event. The Results Dashboard updates live as figures change. Use Scenario Comparison when evaluating a price increase or capacity change before committing. Checklists and email templates can be built at any stage and reused across events.

The tool is designed for desktop use where form-heavy data entry is most comfortable, but all panels remain accessible on smaller screens for review and reference.

## Stack

| Layer | Technology |
| :---- | :---- |
| UI framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Optional cloud persistence | PocketBase |
| Optional data layer | Supabase (`@supabase/supabase-js`) |
| Hosting | Netlify |

## Local Development

```
npm install
```

```
npm run dev
```

The app works fully with **no environment variables**. Without a PocketBase URL configured, it runs as a local/offline browser app with localStorage-based scenario saves and full export support.

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

All environment variables are optional unless you enable the related feature. The app remains fully usable in local-only mode with no configured variables.

| Variable | Required? | Scope | Enables | Description |
| :---- | :---- | :---- | :---- | :---- |
| `VITE_POCKETBASE_URL` | Optional | Frontend/public | PocketBase cloud scenario saves | Public PocketBase/PocketHost URL used for authentication and user-scoped CRUD. Example: `https://immersive-kit.pockethost.io`. |

## Saved Scenarios and PocketBase Cloud Saves

The app works fully with **no environment variables**. In local-only mode, scenarios are stored in browser `localStorage`, and users can still create, load, edit, and export their profit plans. This ensures the planner is safe to deploy and use before PocketBase is configured.

Cloud saves are optional. When `VITE_POCKETBASE_URL` is set, users can sign in and save scenario records to PocketBase. Authentication runs through the public PocketBase URL; **no superuser token is placed in frontend code**.

### Recommended `scenarios` Collection

Create a PocketBase collection named `scenarios`. The implementation expects authenticated users to own their own records. Configure the following fields.

| Field | Type | Notes |
| :---- | :---- | :---- |
| `title` | text | Display name for the saved scenario. |
| `description` | text | Optional notes about the scenario. |
| `owner` | relation to `users` | Should point to the authenticated user. |
| `scenario_json` | json | Stores the full scenario configuration including packages, revenue, and costs. |
| `visibility` | select | Recommended values: `private`, `shared`. |
| `version` | number | Incremented on save to support conflict detection. |
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

Deploy first with no environment variables to confirm the local-only app works, then add `VITE_POCKETBASE_URL` to enable cloud saves.

## Accessibility and Production Readiness

Major panel controls, form inputs, and action buttons include accessible labels. The Welcome Hero provides clear onboarding so users understand the workflow before entering data. Empty and unconfigured states are explicit so the app remains understandable before optional services are set up. The Results Dashboard reflects live calculation state so users always see current figures without a manual refresh step.

## Project Structure

```
src/
  components/
    ChecklistBuilder.tsx      # Pre/post-event operational checklist builder
    CostBuilder.tsx           # Fixed and variable cost line-item editor
    EmailTemplatePanel.tsx    # Client-facing email template drafting
    ExportPanel.tsx           # Export results and summaries
    OpportunityCostPanel.tsx  # Time-slot and alternative-use cost modelling
    PackageSetupPanel.tsx     # Package name, capacity, and base pricing
    ResultsDashboard.tsx      # Live profit, margin, and break-even display
    RevenueBuilder.tsx        # Revenue stream and add-on modelling
    ScenarioComparison.tsx    # Side-by-side scenario analysis
    WelcomeHero.tsx           # Onboarding entry point
  data/
    seedData.ts               # Example/starter scenario data
  lib/
    exporters.ts              # Export helpers
    pocketbase.ts             # Optional PocketBase client wrapper
    profitCalculations.ts     # Core profit, margin, and break-even logic
    storage.ts                # Local autosave and scenario persistence
    venue.ts                  # Venue-level configuration helpers
  types/
    index.ts                  # Shared types for scenarios, packages, and costs
  App.tsx                     # Root layout and panel navigation
  main.tsx                    # Entry point

netlify.toml                  # Netlify build and redirect configuration
```

## Changelog

### v1.0.0 — Initial Production Release

- Built complete profit-planning workflow: Package Setup, Revenue Builder, Cost Builder, Opportunity Cost, and Results Dashboard.
- Added Scenario Comparison for side-by-side pricing analysis.
- Added Checklist Builder and Email Template Panel for operational use.
- Added Export Panel for sharing and record-keeping.
- Added local-only operation with optional PocketBase cloud saves.
- Added Netlify deployment configuration and environment variable documentation.

---

Part of the **MJW Personal App Platform**.