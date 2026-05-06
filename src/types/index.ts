export type EventType =
  | 'birthday_party'
  | 'school_group'
  | 'corporate_event'
  | 'private_rental'
  | 'bachelor_bachelorette'
  | 'custom';

export type MarginBand = 'loss_risk' | 'too_thin' | 'acceptable' | 'healthy' | 'excellent';

export interface PartyPackage {
  id: string;
  name: string;
  eventType: EventType;
  roomName: string;
  basePrice: number;
  includedGuests: number;
  extraGuestFee: number;
  defaultDurationMinutes: number;
  defaultPartyRoomMinutes: number;
  targetMargin: number;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export type AddOnCategory = 'food' | 'drink' | 'favor' | 'upgrade' | 'extra_time' | 'merch' | 'other';

export interface AddOnItem {
  id: string;
  name: string;
  category: AddOnCategory;
  price: number;
  costPerUnit: number;
  quantity: number;
}

export interface LaborAssumptions {
  staffCount: number;
  hourlyWage: number;
  setupMinutes: number;
  eventMinutes: number;
  cleanupMinutes: number;
  adminMinutes: number;
  managerMinutes: number;
  managerHourlyWage: number;
}

export interface CostAssumptions {
  fixedConsumables: number;
  perGuestConsumables: number;
  propWearAllowance: number;
  cleaningCost: number;
  decorCost: number;
  foodCost: number;
  otherFixedCosts: number;
}

export interface EventScenario {
  id: string;
  packageId: string;
  scenarioName: string;
  guestCount: number;
  discountAmount: number;
  serviceFees: number;
  taxAmount: number;
  averageRoomBookingValue: number;
  blockedBookingSlots: number;
  probabilityOfDisplacement: number;
  addOns: AddOnItem[];
  labor: LaborAssumptions;
  costs: CostAssumptions;
  createdAt: string;
}

export interface ProfitResult {
  extraGuestRevenue: number;
  addOnRevenue: number;
  addOnCost: number;
  grossRevenue: number;
  laborHours: number;
  laborCost: number;
  consumableCost: number;
  directEventCost: number;
  opportunityCost: number;
  trueContributionProfit: number;
  trueMarginPercent: number;
  breakEvenBasePrice: number;
  targetBasePrice: number;
  marginBand: MarginBand;
  marginLabel: string;
  recommendationSummary: string;
}

export interface ChecklistItem {
  id: string;
  phase: ChecklistPhase;
  label: string;
  description: string;
  assignedRole: string;
  isRequired: boolean;
  isChecked: boolean;
}

export type ChecklistPhase =
  | 'inquiry'
  | 'booking_confirmation'
  | 'week_before'
  | 'day_before'
  | 'arrival'
  | 'gameplay'
  | 'party_room'
  | 'cleanup'
  | 'follow_up';

export type EmailTemplateType =
  | 'booking_confirmation'
  | 'waiver_reminder'
  | 'addon_upsell'
  | 'day_before_reminder'
  | 'post_party_thankyou';

export interface EmailTemplate {
  id: string;
  templateType: EmailTemplateType;
  subject: string;
  body: string;
}

export interface AppState {
  pkg: PartyPackage;
  scenario: EventScenario;
  checklist: ChecklistItem[];
  emailTemplates: EmailTemplate[];
  activeTab: TabId;
}

export type TabId =
  | 'setup'
  | 'revenue'
  | 'costs'
  | 'opportunity'
  | 'results'
  | 'scenarios'
  | 'checklist'
  | 'emails'
  | 'export';
