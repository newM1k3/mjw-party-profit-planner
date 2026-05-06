import { Plus, Trash2, DollarSign, Users, Tag, Percent } from 'lucide-react';
import type { PartyPackage, EventScenario, AddOnItem, AddOnCategory } from '../types';

interface Props {
  pkg: PartyPackage;
  scenario: EventScenario;
  onScenarioChange: (s: EventScenario) => void;
}

const ADD_ON_CATEGORIES: { value: AddOnCategory; label: string }[] = [
  { value: 'food', label: 'Food' },
  { value: 'drink', label: 'Drink' },
  { value: 'favor', label: 'Favor' },
  { value: 'upgrade', label: 'Upgrade' },
  { value: 'extra_time', label: 'Extra Time' },
  { value: 'merch', label: 'Merch' },
  { value: 'other', label: 'Other' },
];

export default function RevenueBuilder({ pkg, scenario, onScenarioChange }: Props) {
  const set = <K extends keyof EventScenario>(key: K, value: EventScenario[K]) =>
    onScenarioChange({ ...scenario, [key]: value });

  const extraGuestRevenue = Math.max(0, scenario.guestCount - pkg.includedGuests) * pkg.extraGuestFee;
  const addOnRevenue = scenario.addOns.reduce((s, a) => s + a.price * a.quantity, 0);

  function addAddOn() {
    const item: AddOnItem = {
      id: `ao_${Date.now()}`,
      name: '',
      category: 'other',
      price: 0,
      costPerUnit: 0,
      quantity: 1,
    };
    set('addOns', [...scenario.addOns, item]);
  }

  function updateAddOn(id: string, patch: Partial<AddOnItem>) {
    set('addOns', scenario.addOns.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function removeAddOn(id: string) {
    set('addOns', scenario.addOns.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-6">
      <SectionHeader icon={<DollarSign className="w-5 h-5" />} title="Revenue Builder" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField
          label="Guest Count"
          icon={<Users className="w-4 h-4" />}
          value={scenario.guestCount}
          onChange={(v) => set('guestCount', v)}
          helperText={`${pkg.includedGuests} included guests`}
        />
        <ReadOnlyField
          label="Base Package Price"
          value={`$${pkg.basePrice.toFixed(2)}`}
          note="Set in Package Setup"
        />
        <ReadOnlyField
          label="Extra Guest Revenue"
          value={`$${extraGuestRevenue.toFixed(2)}`}
          note={
            scenario.guestCount > pkg.includedGuests
              ? `${scenario.guestCount - pkg.includedGuests} extra guests × $${pkg.extraGuestFee}`
              : 'No extra guests'
          }
          highlight={extraGuestRevenue > 0}
        />
        <NumberField
          label="Discount Amount"
          icon={<Tag className="w-4 h-4" />}
          value={scenario.discountAmount}
          onChange={(v) => set('discountAmount', v)}
          prefix="$"
        />
        <NumberField
          label="Service Fees"
          icon={<DollarSign className="w-4 h-4" />}
          value={scenario.serviceFees}
          onChange={(v) => set('serviceFees', v)}
          prefix="$"
        />
        <NumberField
          label="Tax Amount"
          icon={<Percent className="w-4 h-4" />}
          value={scenario.taxAmount}
          onChange={(v) => set('taxAmount', v)}
          prefix="$"
          helperText="Tracked separately — excluded from profit"
        />
      </div>

      {/* Add-Ons */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-slate-200 font-medium text-sm">Add-Ons</h3>
            <p className="text-slate-500 text-xs">
              Add-on revenue: <span className="text-cyan-400 font-medium">${addOnRevenue.toFixed(2)}</span>
            </p>
          </div>
          <button
            onClick={addAddOn}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {scenario.addOns.length === 0 && (
          <div className="border border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-500 text-sm">
            No add-ons yet. Click "Add Item" to include pizza, drinks, loot bags, etc.
          </div>
        )}

        <div className="space-y-2">
          {scenario.addOns.map((addon) => (
            <div
              key={addon.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-3"
            >
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-12 sm:col-span-4">
                  <input
                    type="text"
                    value={addon.name}
                    placeholder="Add-on name"
                    onChange={(e) => updateAddOn(addon.id, { name: e.target.value })}
                    className="input-base text-sm"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <select
                    value={addon.category}
                    onChange={(e) =>
                      updateAddOn(addon.id, { category: e.target.value as AddOnCategory })
                    }
                    className="input-base text-sm"
                  >
                    {ADD_ON_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      value={addon.price}
                      placeholder="Price"
                      onChange={(e) => updateAddOn(addon.id, { price: parseFloat(e.target.value) || 0 })}
                      className="input-base text-sm pl-5"
                    />
                  </div>
                </div>
                <div className="col-span-5 sm:col-span-1">
                  <input
                    type="number"
                    value={addon.quantity}
                    placeholder="Qty"
                    min={1}
                    onChange={(e) => updateAddOn(addon.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="input-base text-sm text-center"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      value={addon.costPerUnit}
                      placeholder="Cost/unit"
                      onChange={(e) =>
                        updateAddOn(addon.id, { costPerUnit: parseFloat(e.target.value) || 0 })
                      }
                      className="input-base text-sm pl-5"
                    />
                  </div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => removeAddOn(addon.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Revenue: <span className="text-cyan-400">${(addon.price * addon.quantity).toFixed(2)}</span></span>
                <span>Cost: <span className="text-red-400">${(addon.costPerUnit * addon.quantity).toFixed(2)}</span></span>
                <span>Margin: <span className={addon.price > addon.costPerUnit ? 'text-green-400' : 'text-red-400'}>
                  {addon.price > 0
                    ? `${(((addon.price - addon.costPerUnit) / addon.price) * 100).toFixed(0)}%`
                    : '—'}
                </span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
      <span className="text-amber-400">{icon}</span>
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  icon?: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  helperText?: string;
}

function NumberField({ label, icon, value, onChange, prefix, helperText }: NumberFieldProps) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {helperText && <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>}
      <div className="relative mt-1">
        {(icon || prefix) && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            {prefix ?? icon}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`input-base ${icon || prefix ? 'pl-9' : ''}`}
        />
      </div>
    </div>
  );
}

interface ReadOnlyFieldProps {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}

function ReadOnlyField({ label, value, note, highlight }: ReadOnlyFieldProps) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {note && <p className="text-xs text-slate-500 mt-0.5">{note}</p>}
      <div className={`mt-1 px-3 py-2.5 rounded-lg bg-slate-900 border ${highlight ? 'border-cyan-500/40 text-cyan-400' : 'border-slate-700 text-slate-300'} text-sm font-mono`}>
        {value}
      </div>
    </div>
  );
}
