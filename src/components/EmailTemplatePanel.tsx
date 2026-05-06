import { useState } from 'react';
import { Mail, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import type { EmailTemplate, EmailTemplateType } from '../types';

interface Props {
  templates: EmailTemplate[];
  onChange: (templates: EmailTemplate[]) => void;
}

const TEMPLATE_META: Record<EmailTemplateType, { label: string; color: string }> = {
  booking_confirmation: { label: 'Booking Confirmation', color: 'text-green-400' },
  waiver_reminder: { label: 'Waiver Reminder', color: 'text-amber-400' },
  addon_upsell: { label: 'Add-On Upsell', color: 'text-cyan-400' },
  day_before_reminder: { label: 'Day-Before Reminder', color: 'text-blue-400' },
  post_party_thankyou: { label: 'Post-Party Thank-You', color: 'text-green-400' },
};

const TOKENS = ['{{party_name}}', '{{event_date}}', '{{guest_count}}', '{{arrival_time}}', '{{waiver_link}}', '{{package_name}}'];

export default function EmailTemplatePanel({ templates, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(templates[0]?.id ?? null);
  const [copied, setCopied] = useState<string | null>(null);

  const update = (id: string, patch: Partial<EmailTemplate>) => {
    onChange(templates.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <span className="text-amber-400"><Mail className="w-5 h-5" /></span>
        <h2 className="text-lg font-semibold text-slate-100">Email Templates</h2>
      </div>

      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-3">
        <p className="text-slate-400 text-xs mb-2 font-medium">Available Tokens</p>
        <div className="flex flex-wrap gap-2">
          {TOKENS.map((token) => (
            <button
              key={token}
              onClick={() => copy(token, token)}
              className="text-xs bg-slate-800 border border-slate-700 text-cyan-400 px-2 py-1 rounded font-mono hover:border-cyan-500/50 transition-colors flex items-center gap-1"
            >
              {copied === token ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {token}
            </button>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-2">Click a token to copy it, then paste into any template below.</p>
      </div>

      <div className="space-y-3">
        {templates.map((template) => {
          const meta = TEMPLATE_META[template.templateType];
          const isExpanded = expanded === template.id;

          return (
            <div key={template.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(isExpanded ? null : template.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                  <span className={`font-medium text-sm ${meta.color}`}>{meta.label}</span>
                </div>
                <span className="text-xs text-slate-500 truncate max-w-xs text-right">{template.subject}</span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <label className="field-label">Subject Line</label>
                    <div className="relative mt-1">
                      <input
                        type="text"
                        value={template.subject}
                        onChange={(e) => update(template.id, { subject: e.target.value })}
                        className="input-base pr-10"
                      />
                      <button
                        onClick={() => copy(template.subject, `subject_${template.id}`)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {copied === `subject_${template.id}` ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="field-label">Email Body</label>
                      <button
                        onClick={() => copy(template.body, `body_${template.id}`)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {copied === `body_${template.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy body
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      value={template.body}
                      rows={12}
                      onChange={(e) => update(template.id, { body: e.target.value })}
                      className="input-base font-mono text-xs leading-relaxed resize-y"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
