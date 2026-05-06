import { Download, FileText, Printer, Code2 } from 'lucide-react';
import type { AppState, ProfitResult } from '../types';
import { exportMarkdown, exportJSON, downloadMarkdown } from '../lib/exporters';

interface Props {
  state: AppState;
  result: ProfitResult;
}

export default function ExportPanel({ state, result }: Props) {
  const markdownPreview = exportMarkdown(state, result);

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Party Profit Planner – ${state.pkg.name}</title>
          <style>
            body { font-family: -apple-system, sans-serif; max-width: 800px; margin: 40px auto; line-height: 1.6; color: #111; }
            h1,h2,h3 { color: #1a1a1a; }
            table { border-collapse: collapse; width: 100%; margin: 1em 0; }
            td, th { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
            th { background: #f5f5f5; }
            code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-size: 0.9em; }
            pre { background: #f5f5f5; padding: 12px; border-radius: 6px; white-space: pre-wrap; }
            hr { border: none; border-top: 1px solid #eee; margin: 2em 0; }
            li { margin: 0.25em 0; }
            em { color: #666; }
          </style>
        </head>
        <body>
          <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(markdownPreview)}</pre>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <span className="text-amber-400"><Download className="w-5 h-5" /></span>
        <h2 className="text-lg font-semibold text-slate-100">Export</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ExportCard
          icon={<FileText className="w-6 h-6" />}
          title="Markdown Export"
          description="Full profit plan with package summary, breakdown, checklist, and email templates. Paste into any doc or SOP."
          buttonLabel="Download .md"
          onClick={() => downloadMarkdown(state, result)}
          color="text-amber-400"
          borderColor="border-amber-500/30"
        />
        <ExportCard
          icon={<Code2 className="w-6 h-6" />}
          title="JSON Export"
          description="Structured data export with all inputs and calculation results. For future PocketBase or tool integration."
          buttonLabel="Download .json"
          onClick={() => exportJSON(state, result)}
          color="text-cyan-400"
          borderColor="border-cyan-500/30"
        />
        <ExportCard
          icon={<Printer className="w-6 h-6" />}
          title="Print View"
          description="Opens a clean print-ready version of the full profit plan in a new tab."
          buttonLabel="Print / Save PDF"
          onClick={handlePrint}
          color="text-green-400"
          borderColor="border-green-500/30"
        />
      </div>

      {/* Markdown Preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-slate-300 text-sm font-medium">Markdown Preview</h3>
          <span className="text-xs text-slate-500">{markdownPreview.split('\n').length} lines</span>
        </div>
        <pre className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 font-mono leading-relaxed overflow-auto max-h-96 whitespace-pre-wrap">
          {markdownPreview}
        </pre>
      </div>

      <div className="text-xs text-slate-600 border-t border-slate-800 pt-3">
        Results are planning estimates only and do not constitute accounting or legal advice. Party Profit Planner is not a substitute for professional financial analysis.
      </div>
    </div>
  );
}

interface ExportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  color: string;
  borderColor: string;
}

function ExportCard({ icon, title, description, buttonLabel, onClick, color, borderColor }: ExportCardProps) {
  return (
    <div className={`bg-slate-900 border ${borderColor} rounded-xl p-4 flex flex-col gap-3`}>
      <div className={`${color}`}>{icon}</div>
      <div>
        <h3 className="text-slate-200 font-medium text-sm">{title}</h3>
        <p className="text-slate-500 text-xs mt-1 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={onClick}
        className={`mt-auto flex items-center justify-center gap-2 border ${borderColor} ${color} text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors`}
      >
        <Download className="w-4 h-4" />
        {buttonLabel}
      </button>
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
