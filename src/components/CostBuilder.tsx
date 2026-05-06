import { Users, Clock, ShoppingCart, Wrench } from 'lucide-react';
import type { EventScenario, LaborAssumptions, CostAssumptions } from '../types';

interface Props {
  scenario: EventScenario;
  onScenarioChange: (s: EventScenario) => void;
}

export default function CostBuilder({ scenario, onScenarioChange }: Props) {
  const setLabor = <K extends keyof LaborAssumptions>(key: K, value: LaborAssumptions[K]) =>
    onScenarioChange({ ...scenario, labor: { ...scenario.labor, [key]: value } });

  const setCosts = <K extends keyof CostAssumptions>(key: K, value: CostAssumptions[K]) =>
    onScenarioChange({ ...scenario, costs: { ...scenario.costs, [key]: value } });

  const totalLaborMinutes =
    (scenario.labor.setupMinutes +
      scenario.labor.eventMinutes +
      scenario.labor.cleanupMinutes +
      scenario.labor.adminMinutes) *
    scenario.labor.staffCount;
  const staffHours = totalLaborMinutes / 60;
  const laborCost =
    staffHours * scenario.labor.hourlyWage +
    (scenario.labor.managerMinutes / 60) * (scenario.labor.managerHourlyWage || 0);

  return (
    <div className="space-y-8">
      {/* Labor */}
      <div>
        <SectionHeader icon={<Users className="w-5 h-5" />} title="Labor" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <NumberField
            label="Staff Count"
            value={scenario.labor.staffCount}
            onChange={(v) => setLabor('staffCount', v)}
            suffix="staff"
          />
          <NumberField
            label="Staff Hourly Wage"
            value={scenario.labor.hourlyWage}
            onChange={(v) => setLabor('hourlyWage', v)}
            prefix="$"
            suffix="/hr"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 text-sm font-medium">Time Breakdown (per staff member)</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(
              [
                { key: 'setupMinutes', label: 'Setup' },
                { key: 'eventMinutes', label: 'Event' },
                { key: 'cleanupMinutes', label: 'Cleanup' },
                { key: 'adminMinutes', label: 'Admin' },
              ] as const
            ).map(({ key, label }) => (
              <div key={key}>
                <label className="field-label">{label}</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={scenario.labor[key]}
                    onChange={(e) => setLabor(key, parseFloat(e.target.value) || 0)}
                    className="input-base pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">min</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <Stat label="Staff Hours" value={`${staffHours.toFixed(2)}h`} />
            <Stat
              label="Total Time"
              value={`${(scenario.labor.setupMinutes + scenario.labor.eventMinutes + scenario.labor.cleanupMinutes + scenario.labor.adminMinutes)} min × ${scenario.labor.staffCount}`}
            />
            <Stat label="Staff Labor Cost" value={`$${(staffHours * scenario.labor.hourlyWage).toFixed(2)}`} color="text-amber-400" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberField
            label="Manager Minutes (optional)"
            value={scenario.labor.managerMinutes}
            onChange={(v) => setLabor('managerMinutes', v)}
            suffix="min"
            helperText="Additional manager time beyond staff"
          />
          <NumberField
            label="Manager Hourly Wage"
            value={scenario.labor.managerHourlyWage}
            onChange={(v) => setLabor('managerHourlyWage', v)}
            prefix="$"
            suffix="/hr"
          />
        </div>
        {scenario.labor.managerMinutes > 0 && (
          <p className="text-xs text-slate-500 mt-1">
            Manager labor: <span className="text-amber-400">${((scenario.labor.managerMinutes / 60) * scenario.labor.managerHourlyWage).toFixed(2)}</span>
          </p>
        )}

        <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-amber-300 text-sm font-medium">Total Labor Cost</span>
            <span className="text-amber-400 font-bold font-mono">${laborCost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Consumables */}
      <div>
        <SectionHeader icon={<ShoppingCart className="w-5 h-5" />} title="Consumables & Fixed Costs" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <NumberField
            label="Fixed Consumables"
            value={scenario.costs.fixedConsumables}
            onChange={(v) => setCosts('fixedConsumables', v)}
            prefix="$"
            helperText="Printing, supplies, etc."
          />
          <NumberField
            label="Per-Guest Consumables"
            value={scenario.costs.perGuestConsumables}
            onChange={(v) => setCosts('perGuestConsumables', v)}
            prefix="$"
            suffix="/guest"
            helperText="Favors, napkins, cups, etc."
          />
          <NumberField
            label="Prop Wear Allowance"
            value={scenario.costs.propWearAllowance}
            onChange={(v) => setCosts('propWearAllowance', v)}
            prefix="$"
          />
          <NumberField
            label="Cleaning Cost"
            value={scenario.costs.cleaningCost}
            onChange={(v) => setCosts('cleaningCost', v)}
            prefix="$"
          />
          <NumberField
            label="Decoration Cost"
            value={scenario.costs.decorCost}
            onChange={(v) => setCosts('decorCost', v)}
            prefix="$"
          />
          <NumberField
            label="Food Cost"
            value={scenario.costs.foodCost}
            onChange={(v) => setCosts('foodCost', v)}
            prefix="$"
            helperText="Cake, snacks (not in add-ons)"
          />
          <NumberField
            label="Other Fixed Costs"
            value={scenario.costs.otherFixedCosts}
            onChange={(v) => setCosts('otherFixedCosts', v)}
            prefix="$"
          />
        </div>
      </div>

      <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg flex items-center gap-2">
        <Wrench className="w-4 h-4 text-red-400 shrink-0" />
        <div className="flex items-center justify-between flex-1">
          <span className="text-red-300 text-sm font-medium">Note: Add-on costs are included automatically from Revenue Builder</span>
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
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  helperText?: string;
}

function NumberField({ label, value, onChange, prefix, suffix, helperText }: NumberFieldProps) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {helperText && <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>}
      <div className="relative mt-1">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`input-base ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-16' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color = 'text-slate-300' }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-sm font-medium font-mono ${color}`}>{value}</p>
    </div>
  );
}
