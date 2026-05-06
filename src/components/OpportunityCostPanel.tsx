import { Clock, TrendingDown, Info } from 'lucide-react';
import type { EventScenario } from '../types';

interface Props {
  scenario: EventScenario;
  onScenarioChange: (s: EventScenario) => void;
}

export default function OpportunityCostPanel({ scenario, onScenarioChange }: Props) {
  const set = <K extends keyof EventScenario>(key: K, value: EventScenario[K]) =>
    onScenarioChange({ ...scenario, [key]: value });

  const opportunityCost =
    scenario.blockedBookingSlots *
    scenario.averageRoomBookingValue *
    (scenario.probabilityOfDisplacement / 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <span className="text-amber-400"><Clock className="w-5 h-5" /></span>
        <h2 className="text-lg font-semibold text-slate-100">Opportunity Cost</h2>
      </div>

      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-sm text-slate-400 leading-relaxed">
          Opportunity cost estimates the revenue you <strong className="text-slate-300">give up</strong> by
          blocking a room for a party instead of selling it as a regular booking. A party during peak
          hours may displace one or more standard groups — each worth real money.
          <br /><br />
          Formula: <code className="text-cyan-400 bg-slate-900 px-1 rounded text-xs">blockedSlots × avgBookingValue × displacementProbability</code>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NumberField
          label="Average Room Booking Value"
          value={scenario.averageRoomBookingValue}
          onChange={(v) => set('averageRoomBookingValue', v)}
          prefix="$"
          helperText="Typical revenue from a standard group booking"
        />
        <NumberField
          label="Blocked Booking Slots"
          value={scenario.blockedBookingSlots}
          onChange={(v) => set('blockedBookingSlots', v)}
          suffix="slots"
          helperText="How many regular bookings the party blocks"
        />
        <NumberField
          label="Displacement Probability"
          value={scenario.probabilityOfDisplacement}
          onChange={(v) => set('probabilityOfDisplacement', Math.min(100, Math.max(0, v)))}
          suffix="%"
          helperText="Likelihood the room would have been booked otherwise"
        />
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
        <h3 className="text-slate-300 text-sm font-medium">Calculation Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>{scenario.blockedBookingSlots} slots blocked</span>
            <span className="font-mono">× ${scenario.averageRoomBookingValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>× Displacement probability</span>
            <span className="font-mono">× {scenario.probabilityOfDisplacement}%</span>
          </div>
          <div className="border-t border-slate-700 pt-2 flex justify-between items-center">
            <span className="text-slate-200 font-medium">Opportunity Cost</span>
            <span className={`font-mono font-bold text-lg ${opportunityCost > 0 ? 'text-red-400' : 'text-slate-400'}`}>
              ${opportunityCost.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {opportunityCost > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
          <TrendingDown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-300/80">
            This party carries a <strong className="text-amber-400">${opportunityCost.toFixed(2)}</strong> opportunity cost.
            This amount is subtracted from true profit to reflect the full economic cost of hosting this event.
            {scenario.probabilityOfDisplacement < 50 && (
              <span className="block mt-1 text-slate-400">
                Tip: If you primarily host parties during off-peak hours, you can reduce the displacement probability to reflect lower demand during those times.
              </span>
            )}
          </div>
        </div>
      )}
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
