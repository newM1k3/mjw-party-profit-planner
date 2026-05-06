import type {
  PartyPackage,
  EventScenario,
  ChecklistItem,
  EmailTemplate,
} from '../types';

export const seedPackage: PartyPackage = {
  id: 'pkg_seed_001',
  name: 'Ultimate Birthday Bash',
  eventType: 'birthday_party',
  roomName: 'The Haunted Mansion',
  basePrice: 249,
  includedGuests: 8,
  extraGuestFee: 18,
  defaultDurationMinutes: 60,
  defaultPartyRoomMinutes: 45,
  targetMargin: 25,
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const seedScenario: EventScenario = {
  id: 'scn_seed_001',
  packageId: 'pkg_seed_001',
  scenarioName: 'Typical Saturday Party',
  guestCount: 12,
  discountAmount: 15,
  serviceFees: 10,
  taxAmount: 22,
  averageRoomBookingValue: 120,
  blockedBookingSlots: 1,
  probabilityOfDisplacement: 70,
  addOns: [
    {
      id: 'ao_001',
      name: 'Pizza Package (2 pizzas)',
      category: 'food',
      price: 35,
      costPerUnit: 22,
      quantity: 1,
    },
    {
      id: 'ao_002',
      name: 'Loot Bags',
      category: 'favor',
      price: 8,
      costPerUnit: 4,
      quantity: 12,
    },
    {
      id: 'ao_003',
      name: 'Juice Boxes',
      category: 'drink',
      price: 2,
      costPerUnit: 0.75,
      quantity: 12,
    },
  ],
  labor: {
    staffCount: 2,
    hourlyWage: 16,
    setupMinutes: 30,
    eventMinutes: 60,
    cleanupMinutes: 30,
    adminMinutes: 15,
    managerMinutes: 20,
    managerHourlyWage: 22,
  },
  costs: {
    fixedConsumables: 8,
    perGuestConsumables: 3.5,
    propWearAllowance: 10,
    cleaningCost: 15,
    decorCost: 20,
    foodCost: 0,
    otherFixedCosts: 5,
  },
  createdAt: new Date().toISOString(),
};

export const seedChecklist: ChecklistItem[] = [
  // Inquiry
  {
    id: 'cl_001', phase: 'inquiry', label: 'Receive party inquiry', isRequired: true, isChecked: false,
    description: 'Log the inquiry with name, date, guest count, and event type.',
    assignedRole: 'Front Desk',
  },
  {
    id: 'cl_002', phase: 'inquiry', label: 'Send package options', isRequired: true, isChecked: false,
    description: 'Email available packages, pricing, and availability.',
    assignedRole: 'Front Desk',
  },
  // Booking Confirmation
  {
    id: 'cl_003', phase: 'booking_confirmation', label: 'Collect deposit', isRequired: true, isChecked: false,
    description: 'Confirm deposit received and apply to booking.',
    assignedRole: 'Manager',
  },
  {
    id: 'cl_004', phase: 'booking_confirmation', label: 'Send confirmation email', isRequired: true, isChecked: false,
    description: 'Send booking confirmation with date, time, guest count, and next steps.',
    assignedRole: 'Front Desk',
  },
  {
    id: 'cl_005', phase: 'booking_confirmation', label: 'Send waiver links', isRequired: true, isChecked: false,
    description: 'Send digital waivers for all attending guests.',
    assignedRole: 'Front Desk',
  },
  {
    id: 'cl_006', phase: 'booking_confirmation', label: 'Confirm add-ons', isRequired: false, isChecked: false,
    description: 'Review and confirm all paid add-ons with the booking party.',
    assignedRole: 'Front Desk',
  },
  // Week Before
  {
    id: 'cl_007', phase: 'week_before', label: 'Send week-before reminder', isRequired: true, isChecked: false,
    description: 'Remind party host of date, time, arrival instructions, and waiver status.',
    assignedRole: 'Front Desk',
  },
  {
    id: 'cl_008', phase: 'week_before', label: 'Check waiver completions', isRequired: true, isChecked: false,
    description: 'Review which guests have completed waivers; resend if needed.',
    assignedRole: 'Front Desk',
  },
  {
    id: 'cl_009', phase: 'week_before', label: 'Confirm final guest count', isRequired: true, isChecked: false,
    description: 'Get updated guest count for staffing and consumable prep.',
    assignedRole: 'Manager',
  },
  {
    id: 'cl_010', phase: 'week_before', label: 'Send add-on upsell email', isRequired: false, isChecked: false,
    description: 'Offer pizza, drinks, or upgrade options to increase booking value.',
    assignedRole: 'Front Desk',
  },
  // Day Before
  {
    id: 'cl_011', phase: 'day_before', label: 'Staff briefing', isRequired: true, isChecked: false,
    description: 'Confirm staff schedules, roles, and party details.',
    assignedRole: 'Manager',
  },
  {
    id: 'cl_012', phase: 'day_before', label: 'Prep consumables', isRequired: true, isChecked: false,
    description: 'Gather favors, decorations, napkins, plates, and party supplies.',
    assignedRole: 'Staff',
  },
  {
    id: 'cl_013', phase: 'day_before', label: 'Send day-before reminder', isRequired: true, isChecked: false,
    description: 'Remind host of arrival time, parking, and party-room rules.',
    assignedRole: 'Front Desk',
  },
  // Arrival
  {
    id: 'cl_014', phase: 'arrival', label: 'Greet party host', isRequired: true, isChecked: false,
    description: 'Welcome host, confirm guest count, and collect remaining waivers.',
    assignedRole: 'Staff',
  },
  {
    id: 'cl_015', phase: 'arrival', label: 'Collect outstanding waivers', isRequired: true, isChecked: false,
    description: 'Ensure all participants have signed before entering.',
    assignedRole: 'Staff',
  },
  {
    id: 'cl_016', phase: 'arrival', label: 'Set up party room', isRequired: true, isChecked: false,
    description: 'Arrange decorations, food, and favors in the party room.',
    assignedRole: 'Staff',
  },
  // Gameplay
  {
    id: 'cl_017', phase: 'gameplay', label: 'Deliver birthday welcome', isRequired: true, isChecked: false,
    description: 'Personalize the intro to acknowledge the birthday guest and group.',
    assignedRole: 'Game Master',
  },
  {
    id: 'cl_018', phase: 'gameplay', label: 'Monitor group dynamics', isRequired: true, isChecked: false,
    description: 'Ensure younger guests are engaged and safe throughout gameplay.',
    assignedRole: 'Game Master',
  },
  // Party Room
  {
    id: 'cl_019', phase: 'party_room', label: 'Transition to party room', isRequired: true, isChecked: false,
    description: 'Guide group from escape room to party room promptly.',
    assignedRole: 'Staff',
  },
  {
    id: 'cl_020', phase: 'party_room', label: 'Serve food and drinks', isRequired: false, isChecked: false,
    description: 'Deliver pizza, cake, and drinks per confirmed add-ons.',
    assignedRole: 'Staff',
  },
  {
    id: 'cl_021', phase: 'party_room', label: 'Distribute loot bags', isRequired: false, isChecked: false,
    description: 'Hand out party favors at the end of party room time.',
    assignedRole: 'Staff',
  },
  // Cleanup
  {
    id: 'cl_022', phase: 'cleanup', label: 'Clear party room', isRequired: true, isChecked: false,
    description: 'Remove food, decorations, trash, and reset tables.',
    assignedRole: 'Staff',
  },
  {
    id: 'cl_023', phase: 'cleanup', label: 'Reset escape room', isRequired: true, isChecked: false,
    description: 'Inspect and reset all props, locks, and clues for next booking.',
    assignedRole: 'Game Master',
  },
  {
    id: 'cl_024', phase: 'cleanup', label: 'Log prop wear', isRequired: false, isChecked: false,
    description: 'Note any props that need repair or replacement.',
    assignedRole: 'Game Master',
  },
  // Follow-Up
  {
    id: 'cl_025', phase: 'follow_up', label: 'Send thank-you email', isRequired: true, isChecked: false,
    description: 'Send post-party thank-you with a review request link.',
    assignedRole: 'Front Desk',
  },
  {
    id: 'cl_026', phase: 'follow_up', label: 'Internal profit review', isRequired: false, isChecked: false,
    description: 'Compare actual costs to plan; note any overruns or savings.',
    assignedRole: 'Manager',
  },
];

export const seedEmailTemplates: EmailTemplate[] = [
  {
    id: 'et_001',
    templateType: 'booking_confirmation',
    subject: 'Your Escape Room Birthday Party is Confirmed! 🎉',
    body: `Hi {{party_name}},

We're so excited to host your birthday party at our escape room!

Here are your booking details:
- Date: {{event_date}}
- Arrival Time: {{arrival_time}}
- Guest Count: {{guest_count}}
- Package: {{package_name}}

IMPORTANT: All participants must complete a digital waiver before the event. Please share this link with your guests: {{waiver_link}}

If you have any questions or would like to add extras like pizza, drinks, or loot bags, just reply to this email.

See you soon!

The Escape Room Team`,
  },
  {
    id: 'et_002',
    templateType: 'waiver_reminder',
    subject: 'Waiver Reminder – {{party_name}}\'s Party on {{event_date}}',
    body: `Hi {{party_name}},

Your party is coming up on {{event_date}} and we want to make sure everything runs smoothly!

We still need waivers from some of your guests. Please share this link with anyone who hasn't signed yet: {{waiver_link}}

Waivers must be completed before your group can enter the escape room. This only takes about 2 minutes per person.

See you at {{arrival_time}}!

The Escape Room Team`,
  },
  {
    id: 'et_003',
    templateType: 'addon_upsell',
    subject: 'Make {{party_name}}\'s Party Even More Special!',
    body: `Hi {{party_name}},

Your party is just around the corner and we have a few extras that would take it to the next level:

🍕 **Pizza Package** – 2 large pizzas delivered to your party room ($35)
🎁 **Loot Bags** – Custom escape room loot bags for each guest ($8/guest)
🥤 **Drink Package** – Juice boxes and water for the whole group ($2/guest)
⏰ **Extra Time** – Add 15 minutes to your escape room session ($25)

To add any of these, simply reply to this email or call us before {{event_date}}.

We can't wait to see you!

The Escape Room Team`,
  },
  {
    id: 'et_004',
    templateType: 'day_before_reminder',
    subject: 'See You Tomorrow, {{party_name}}!',
    body: `Hi {{party_name}},

Your birthday party is tomorrow and we're ready for you!

Quick reminders:
- Arrival Time: {{arrival_time}} (please arrive 10 minutes early)
- Guest Count Confirmed: {{guest_count}}
- Parking: Available in our lot out front
- Waivers: All guests must sign before entering

Any last-minute add-ons must be confirmed by this evening.

If anything changes, please call us as soon as possible. Otherwise, see you tomorrow!

The Escape Room Team`,
  },
  {
    id: 'et_005',
    templateType: 'post_party_thankyou',
    subject: 'Thanks for Celebrating with Us, {{party_name}}!',
    body: `Hi {{party_name}},

What a fantastic party! We had such a great time hosting {{guest_count}} guests for your celebration.

We hope everyone had an unforgettable experience. If you have a moment, we'd love for you to leave us a review — it genuinely helps small businesses like ours grow:

⭐ Leave a Google Review: [Your Review Link Here]

We'd also love to see photos if any guests snapped some! Feel free to tag us on social media.

If you'd like to book another event, reply to this email or check our website for availability.

Thanks again for choosing us!

The Escape Room Team`,
  },
];
