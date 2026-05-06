import type {
  PartyPackage,
  EventScenario,
  ProfitResult,
  MarginBand,
} from '../types';

export function calculateProfit(
  pkg: PartyPackage,
  scenario: EventScenario
): ProfitResult {
  const { labor, costs, addOns } = scenario;

  // Revenue
  const extraGuestRevenue =
    Math.max(0, scenario.guestCount - pkg.includedGuests) * pkg.extraGuestFee;
  const addOnRevenue = addOns.reduce((sum, a) => sum + a.price * a.quantity, 0);
  const addOnCost = addOns.reduce((sum, a) => sum + a.costPerUnit * a.quantity, 0);
  const grossRevenue =
    pkg.basePrice +
    extraGuestRevenue +
    addOnRevenue +
    scenario.serviceFees -
    scenario.discountAmount;

  // Labor
  const staffHours =
    ((labor.setupMinutes + labor.eventMinutes + labor.cleanupMinutes + labor.adminMinutes) /
      60) *
    labor.staffCount;
  const managerHours = labor.managerMinutes / 60;
  const laborHours = staffHours + managerHours;
  const laborCost =
    staffHours * labor.hourlyWage + managerHours * (labor.managerHourlyWage || 0);

  // Consumables
  const consumableCost =
    costs.fixedConsumables +
    scenario.guestCount * costs.perGuestConsumables +
    costs.propWearAllowance +
    costs.cleaningCost +
    costs.decorCost +
    costs.foodCost +
    costs.otherFixedCosts +
    addOnCost;

  const directEventCost = laborCost + consumableCost;

  // Opportunity cost
  const opportunityCost =
    scenario.blockedBookingSlots *
    scenario.averageRoomBookingValue *
    (scenario.probabilityOfDisplacement / 100);

  const trueContributionProfit = grossRevenue - directEventCost - opportunityCost;
  const trueMarginPercent =
    grossRevenue > 0 ? (trueContributionProfit / grossRevenue) * 100 : 0;

  // Break-even: base price such that grossRevenue covers direct + opportunity
  // grossRevenue = basePrice + extraGuestRevenue + addOnRevenue + serviceFees - discounts
  // => basePrice = directEventCost + opportunityCost - extraGuestRevenue - addOnRevenue - serviceFees + discounts
  const breakEvenBasePrice =
    directEventCost +
    opportunityCost -
    extraGuestRevenue -
    addOnRevenue -
    scenario.serviceFees +
    scenario.discountAmount;

  // Target price: base price needed to achieve targetMargin
  // grossRevenue * (1 - targetMargin) = directEventCost + opportunityCost
  // grossRevenue = (directEventCost + opportunityCost) / (1 - targetMargin)
  // targetBasePrice = grossRevenue_target - extraGuestRevenue - addOnRevenue - serviceFees + discounts
  const targetMarginDecimal = pkg.targetMargin / 100;
  const targetGrossRevenue =
    targetMarginDecimal < 1
      ? (directEventCost + opportunityCost) / (1 - targetMarginDecimal)
      : directEventCost + opportunityCost;
  const targetBasePrice =
    targetGrossRevenue -
    extraGuestRevenue -
    addOnRevenue -
    scenario.serviceFees +
    scenario.discountAmount;

  const marginBand = getMarginBand(trueMarginPercent);
  const marginLabel = getMarginLabel(marginBand);
  const recommendationSummary = buildRecommendation({
    trueContributionProfit,
    trueMarginPercent,
    laborCost,
    grossRevenue,
    opportunityCost,
    directEventCost,
    discountAmount: scenario.discountAmount,
    addOnRevenue,
    perGuestConsumables: costs.perGuestConsumables,
    targetMargin: pkg.targetMargin,
  });

  return {
    extraGuestRevenue,
    addOnRevenue,
    addOnCost,
    grossRevenue,
    laborHours,
    laborCost,
    consumableCost,
    directEventCost,
    opportunityCost,
    trueContributionProfit,
    trueMarginPercent,
    breakEvenBasePrice,
    targetBasePrice,
    marginBand,
    marginLabel,
    recommendationSummary,
  };
}

function getMarginBand(margin: number): MarginBand {
  if (margin < 0) return 'loss_risk';
  if (margin < 15) return 'too_thin';
  if (margin < 25) return 'acceptable';
  if (margin < 35) return 'healthy';
  return 'excellent';
}

function getMarginLabel(band: MarginBand): string {
  switch (band) {
    case 'loss_risk': return 'Loss Risk';
    case 'too_thin': return 'Too Thin';
    case 'acceptable': return 'Acceptable – Watch Closely';
    case 'healthy': return 'Healthy';
    case 'excellent': return 'Excellent';
  }
}

interface RecommendationInput {
  trueContributionProfit: number;
  trueMarginPercent: number;
  laborCost: number;
  grossRevenue: number;
  opportunityCost: number;
  directEventCost: number;
  discountAmount: number;
  addOnRevenue: number;
  perGuestConsumables: number;
  targetMargin: number;
}

function buildRecommendation(input: RecommendationInput): string {
  const lines: string[] = [];

  if (input.trueContributionProfit < 0) {
    lines.push(
      'This package loses money after all costs and opportunity cost. Raise the base price, reduce included extras, or restrict it to off-peak time slots.'
    );
  } else if (input.trueMarginPercent < 15) {
    lines.push(
      'This package is too thin to be reliable. Consider a minimum guest count, fewer included favors, or converting some extras into paid add-ons.'
    );
  } else if (input.trueMarginPercent >= input.targetMargin) {
    lines.push(
      'This package meets your target margin. Preserve the structure and test premium add-ons to push profit further.'
    );
  }

  if (input.grossRevenue > 0 && input.laborCost / input.grossRevenue > 0.35) {
    lines.push(
      'Staffing is the largest margin drag. Review setup and cleanup assumptions, or charge separately for hosted party-room time.'
    );
  }

  if (input.opportunityCost > input.directEventCost) {
    lines.push(
      'Opportunity cost exceeds direct costs. This package may be blocking a more profitable room slot — consider limiting parties to lower-demand times.'
    );
  }

  if (input.discountAmount > 0 && input.discountAmount > input.addOnRevenue * 0.5) {
    lines.push(
      'Discounting is erasing add-on margin. Use value-added bonuses instead of price cuts.'
    );
  }

  if (input.perGuestConsumables > 8) {
    lines.push(
      'Per-guest consumables are high. Move some items into optional add-ons or create tiered packages with a lower base.'
    );
  }

  if (lines.length === 0) {
    lines.push(
      `Margin is ${input.trueMarginPercent.toFixed(1)}% — within your target range. Monitor labor and consumables as guest counts scale.`
    );
  }

  return lines.join(' ');
}
