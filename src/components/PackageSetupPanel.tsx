import { Package, Home, Clock, Users, Target } from 'lucide-react';
import type { PartyPackage, EventType } from '../types';
import { formatEventType } from '../lib/exporters';

interface Props {
  pkg: PartyPackage;
  onChange: (pkg: PartyPackage) => void;
}

const EVENT_TYPES: EventType[] = [
  'birthday_party',
  'school_group',
  'corporate_event',
  'private_rental',
  'bachelor_bachelorette',
  'custom',
];

export default function PackageSetupPanel({ pkg, onChange }: Props) {
  const set = <K extends keyof PartyPackage>(key: K, value: PartyPackage[K]) => {
    onChange({ ...pkg, [key]: value, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={<Package className="w-5 h-5" />} title="Package Setup" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="field-label">Event Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => set('eventType', type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                  pkg.eventType === type
                    ? 'bg-amber-500 border-amber-500 text-slate-950'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-500/50'
                }`}
              >
                {formatEventType(type)}
              </button>
            ))}
          </div>
        </div>

        <Field
          label="Package Name"
          icon={<Package className="w-4 h-4" />}
          value={pkg.name}
          onChange={(v) => set('name', v)}
          placeholder="e.g. Ultimate Birthday Bash"
        />
        <Field
          label="Room Name"
          icon={<Home className="w-4 h-4" />}
          value={pkg.roomName}
          onChange={(v) => set('roomName', v)}
          placeholder="e.g. The Haunted Mansion"
        />

        <NumberField
          label="Base Package Price"
          icon={<span className="text-xs font-bold">$</span>}
          value={pkg.basePrice}
          onChange={(v) => set('basePrice', v)}
          prefix="$"
        />
        <NumberField
          label="Included Guests"
          icon={<Users className="w-4 h-4" />}
          value={pkg.includedGuests}
          onChange={(v) => set('includedGuests', v)}
        />
        <NumberField
          label="Extra Guest Fee"
          icon={<span className="text-xs font-bold">$</span>}
          value={pkg.extraGuestFee}
          onChange={(v) => set('extraGuestFee', v)}
          prefix="$"
          helperText="Per guest above included count"
        />
        <NumberField
          label="Event Duration"
          icon={<Clock className="w-4 h-4" />}
          value={pkg.defaultDurationMinutes}
          onChange={(v) => set('defaultDurationMinutes', v)}
          suffix="min"
        />
        <NumberField
          label="Party Room Time"
          icon={<Clock className="w-4 h-4" />}
          value={pkg.defaultPartyRoomMinutes}
          onChange={(v) => set('defaultPartyRoomMinutes', v)}
          suffix="min"
          helperText="Time in party room after gameplay"
        />
        <NumberField
          label="Target Margin"
          icon={<Target className="w-4 h-4" />}
          value={pkg.targetMargin}
          onChange={(v) => set('targetMargin', v)}
          suffix="%"
          helperText="Your goal profit margin (industry target: 25%+)"
        />
      </div>

      <div className="mt-2">
        <label className="field-label">Package Status</label>
        <div className="flex gap-2 mt-1">
          {(['draft', 'active', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => set('status', s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 capitalize ${
                pkg.status === s
                  ? 'bg-cyan-500 border-cyan-500 text-slate-950'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-cyan-500/50'
              }`}
            >
              {s}
            </button>
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

interface FieldProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

function Field({ label, icon, value, onChange, placeholder }: FieldProps) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="relative mt-1">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input-base ${icon ? 'pl-9' : ''}`}
        />
      </div>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  icon?: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  helperText?: string;
}

function NumberField({ label, icon, value, onChange, prefix, suffix, helperText }: NumberFieldProps) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {helperText && <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>}
      <div className="relative mt-1 flex items-center">
        {(icon || prefix) && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            {prefix ?? icon}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`input-base ${icon || prefix ? 'pl-9' : ''} ${suffix ? 'pr-10' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
