import { useState } from 'react';
import { CheckSquare, Square, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { ChecklistItem, ChecklistPhase } from '../types';

interface Props {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

const PHASES: { id: ChecklistPhase; label: string }[] = [
  { id: 'inquiry', label: 'Inquiry' },
  { id: 'booking_confirmation', label: 'Booking Confirmation' },
  { id: 'week_before', label: 'Week Before' },
  { id: 'day_before', label: 'Day Before' },
  { id: 'arrival', label: 'Arrival' },
  { id: 'gameplay', label: 'Gameplay' },
  { id: 'party_room', label: 'Party Room Time' },
  { id: 'cleanup', label: 'Cleanup' },
  { id: 'follow_up', label: 'Follow-Up' },
];

export default function ChecklistBuilder({ items, onChange }: Props) {
  const [collapsed, setCollapsed] = useState<Set<ChecklistPhase>>(new Set());

  const toggle = (id: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item)));
  };

  const updateItem = (id: string, patch: Partial<ChecklistItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const addItem = (phase: ChecklistPhase) => {
    const newItem: ChecklistItem = {
      id: `cl_${Date.now()}`,
      phase,
      label: '',
      description: '',
      assignedRole: 'Staff',
      isRequired: false,
      isChecked: false,
    };
    onChange([...items, newItem]);
  };

  const togglePhase = (phase: ChecklistPhase) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  };

  const checkedCount = items.filter((i) => i.isChecked).length;
  const totalCount = items.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-amber-400"><CheckSquare className="w-5 h-5" /></span>
          <h2 className="text-lg font-semibold text-slate-100">Event Checklist</h2>
        </div>
        <div className="text-sm text-slate-400">
          <span className="text-green-400 font-medium">{checkedCount}</span> / {totalCount} complete
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-3">
        {PHASES.map((phase) => {
          const phaseItems = items.filter((i) => i.phase === phase.id);
          const phaseChecked = phaseItems.filter((i) => i.isChecked).length;
          const isCollapsed = collapsed.has(phase.id);

          return (
            <div key={phase.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="text-slate-200 font-medium text-sm">{phase.label}</span>
                </div>
                <span className={`text-xs font-medium ${phaseChecked === phaseItems.length && phaseItems.length > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                  {phaseChecked}/{phaseItems.length}
                </span>
              </button>

              {!isCollapsed && (
                <div className="px-4 pb-3 space-y-2">
                  {phaseItems.length === 0 && (
                    <p className="text-slate-600 text-xs italic py-1">No items in this phase.</p>
                  )}
                  {phaseItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex gap-2 p-2 rounded-lg ${item.isChecked ? 'bg-slate-800/30' : 'bg-slate-800/60'} border ${item.isChecked ? 'border-slate-700/50' : 'border-slate-700'}`}
                    >
                      <button
                        onClick={() => toggle(item.id)}
                        className={`shrink-0 mt-0.5 ${item.isChecked ? 'text-green-400' : 'text-slate-500'}`}
                      >
                        {item.isChecked ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={item.label}
                          placeholder="Task label"
                          onChange={(e) => updateItem(item.id, { label: e.target.value })}
                          className={`w-full bg-transparent text-sm font-medium outline-none ${item.isChecked ? 'text-slate-500 line-through' : 'text-slate-200'}`}
                        />
                        <input
                          type="text"
                          value={item.description}
                          placeholder="Description"
                          onChange={(e) => updateItem(item.id, { description: e.target.value })}
                          className="w-full bg-transparent text-xs text-slate-500 outline-none mt-0.5"
                        />
                        <input
                          type="text"
                          value={item.assignedRole}
                          placeholder="Role"
                          onChange={(e) => updateItem(item.id, { assignedRole: e.target.value })}
                          className="w-20 bg-transparent text-xs text-cyan-500/70 outline-none mt-0.5"
                        />
                      </div>
                      {item.isRequired && (
                        <span className="text-xs text-amber-400/70 shrink-0 mt-0.5">Required</span>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addItem(phase.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-400 transition-colors mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add item
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
