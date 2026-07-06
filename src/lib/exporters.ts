import type { AppState, ProfitResult } from '../types';

export function exportJSON(state: AppState, result: ProfitResult): void {
  const payload = { ...state, calculationResult: result };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  downloadBlob(blob, `party-profit-plan-${slugify(state.pkg.name)}.json`);
}

export function exportMarkdown(state: AppState, result: ProfitResult): string {
  const { pkg, scenario, checklist, emailTemplates } = state;
  const fmt = (n: number) => `$${n.toFixed(2)}`;
  const pct = (n: number) => `${n.toFixed(1)}%`;

  const lines: string[] = [];

  lines.push(`# Profit – ${pkg.name}`);
  lines.push(`**Event Type:** ${formatEventType(pkg.eventType)}`);
  lines.push(`**Room:** ${pkg.roomName}`);
  lines.push(`**Generated:** ${new Date().toLocaleDateString()}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Package Summary');
  lines.push(`- Base Package Price: ${fmt(pkg.basePrice)}`);
  lines.push(`- Included Guests: ${pkg.includedGuests}`);
  lines.push(`- Extra Guest Fee: ${fmt(pkg.extraGuestFee)}`);
  lines.push(`- Event Duration: ${pkg.defaultDurationMinutes} min`);
  lines.push(`- Party Room Time: ${pkg.defaultPartyRoomMinutes} min`);
  lines.push(`- Target Margin: ${pct(pkg.targetMargin)}`);
  lines.push('');
  lines.push('## Scenario Assumptions');
  lines.push(`- Guest Count: ${scenario.guestCount}`);
  lines.push(`- Discount: ${fmt(scenario.discountAmount)}`);
  lines.push(`- Service Fees: ${fmt(scenario.serviceFees)}`);
  lines.push(`- Tax (excluded from profit): ${fmt(scenario.taxAmount)}`);
  lines.push(`- Staff Count: ${scenario.labor.staffCount}`);
  lines.push(`- Staff Hourly Wage: ${fmt(scenario.labor.hourlyWage)}`);
  lines.push(
    `- Time Breakdown: Setup ${scenario.labor.setupMinutes}min / Event ${scenario.labor.eventMinutes}min / Cleanup ${scenario.labor.cleanupMinutes}min / Admin ${scenario.labor.adminMinutes}min`
  );
  if (scenario.labor.managerMinutes > 0) {
    lines.push(
      `- Manager: ${scenario.labor.managerMinutes}min @ ${fmt(scenario.labor.managerHourlyWage)}/hr`
    );
  }
  lines.push('');
  lines.push('## Profit Breakdown');
  lines.push(`| Line Item | Amount |`);
  lines.push(`|---|---|`);
  lines.push(`| Base Package Price | ${fmt(pkg.basePrice)} |`);
  lines.push(`| Extra Guest Revenue | ${fmt(result.extraGuestRevenue)} |`);
  lines.push(`| Add-On Revenue | ${fmt(result.addOnRevenue)} |`);
  lines.push(`| Service Fees | ${fmt(scenario.serviceFees)} |`);
  lines.push(`| Discount | -${fmt(scenario.discountAmount)} |`);
  lines.push(`| **Gross Revenue** | **${fmt(result.grossRevenue)}** |`);
  lines.push(`| Labor Cost | -${fmt(result.laborCost)} |`);
  lines.push(`| Consumable Cost | -${fmt(result.consumableCost)} |`);
  lines.push(`| **Direct Event Cost** | **-${fmt(result.directEventCost)}** |`);
  lines.push(`| Opportunity Cost | -${fmt(result.opportunityCost)} |`);
  lines.push(`| **True Contribution Profit** | **${fmt(result.trueContributionProfit)}** |`);
  lines.push(`| True Margin | ${pct(result.trueMarginPercent)} (${result.marginLabel}) |`);
  lines.push(`| Break-Even Base Price | ${fmt(result.breakEvenBasePrice)} |`);
  lines.push(`| Target Base Price (${pct(pkg.targetMargin)} margin) | ${fmt(result.targetBasePrice)} |`);
  lines.push('');
  lines.push('## Recommendation');
  lines.push(result.recommendationSummary);
  lines.push('');

  if (scenario.addOns.length > 0) {
    lines.push('## Add-Ons');
    lines.push('| Name | Category | Price | Qty | Cost/Unit |');
    lines.push('|---|---|---|---|---|');
    scenario.addOns.forEach((a) => {
      lines.push(
        `| ${a.name} | ${a.category} | ${fmt(a.price)} | ${a.quantity} | ${fmt(a.costPerUnit)} |`
      );
    });
    lines.push('');
  }

  const phases = [...new Set(checklist.map((c) => c.phase))];
  if (phases.length > 0) {
    lines.push('## Event Checklist');
    phases.forEach((phase) => {
      lines.push(`### ${formatPhase(phase)}`);
      checklist
        .filter((c) => c.phase === phase)
        .forEach((c) => {
          lines.push(`- [ ] **${c.label}** – ${c.description} *(${c.assignedRole})*`);
        });
      lines.push('');
    });
  }

  if (emailTemplates.length > 0) {
    lines.push('## Email Templates');
    emailTemplates.forEach((t) => {
      lines.push(`### ${formatTemplateType(t.templateType)}`);
      lines.push(`**Subject:** ${t.subject}`);
      lines.push('');
      lines.push(t.body);
      lines.push('');
    });
  }

  lines.push('---');
  lines.push(
    '_Results are planning estimates only and do not constitute accounting or legal advice._'
  );

  return lines.join('\n');
}

export function downloadMarkdown(state: AppState, result: ProfitResult): void {
  const md = exportMarkdown(state, result);
  const blob = new Blob([md], { type: 'text/markdown' });
  downloadBlob(blob, `party-profit-plan-${slugify(state.pkg.name)}.md`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function formatEventType(type: string): string {
  const map: Record<string, string> = {
    birthday_party: 'Birthday Party',
    school_group: 'School Group',
    corporate_event: 'Corporate Event',
    private_rental: 'Private Rental',
    bachelor_bachelorette: 'Bachelor / Bachelorette',
    custom: 'Custom Event',
  };
  return map[type] ?? type;
}

function formatPhase(phase: string): string {
  const map: Record<string, string> = {
    inquiry: 'Inquiry',
    booking_confirmation: 'Booking Confirmation',
    week_before: 'Week Before',
    day_before: 'Day Before',
    arrival: 'Arrival',
    gameplay: 'Gameplay',
    party_room: 'Party Room Time',
    cleanup: 'Cleanup',
    follow_up: 'Follow-Up',
  };
  return map[phase] ?? phase;
}

function formatTemplateType(type: string): string {
  const map: Record<string, string> = {
    booking_confirmation: 'Booking Confirmation',
    waiver_reminder: 'Waiver Reminder',
    addon_upsell: 'Add-On Upsell',
    day_before_reminder: 'Day-Before Reminder',
    post_party_thankyou: 'Post-Party Thank-You',
  };
  return map[type] ?? type;
}
