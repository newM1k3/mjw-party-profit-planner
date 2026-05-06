import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Target,
  Zap,
  BarChart2,
} from 'lucide-react';
import type { ProfitResult, PartyPackage, MarginBand } from '../types';

interface Props {
  result: ProfitResult;
  pkg: PartyPackage;
}

const BAND_CONFIG: Record<
  MarginBand,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode; description: string }
> = {
  loss_risk: {
    label: 'Loss Risk',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'This package loses money after all costs and opportunity cost.',
  },
  too_thin: {
    label: 'Too Thin',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
    icon: <TrendingDown className="w-5 h-5" />,
    description: 'This event contributes some profit but may not justify the operational burden.',
  },
  acceptable: {
    label: 'Acceptable – Watch Closely',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/40',
    icon: <BarChart2 className="w-5 h-5" />,
    description: 'Margin is acceptable but needs tighter cost control or better add-on revenue.',
  },
  healthy: {
    label: 'Healthy',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/40',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'This package is well-positioned. Consistent with strong escape room performance.',
  },
  excellent: {
    label: 'Excellent',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/40',
    icon: <CheckCircle className="w-5 h-5" />,
    description: 'Highly attractive margin. Protect the structure and scale carefully.',
  },
};

export default function ResultsDashboard({ result, pkg }: Props) {
  const band = BAND_CONFIG[result.marginBand];
  const fmt = (n: number) => `$${n.toFixed(2)}`;
  const pct = (n: number) => `${n.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <span className="text-amber-400"><BarChart2 className="w-5 h-5" /></span>
        <h2 className="text-lg font-semibold text-slate-100">Results Dashboard</h2>
      </div>

      {/* Margin Status Banner */}
      <div className={`${band.bg} ${band.border} border rounded-xl p-4 flex items-start gap-3`}>
        <span className={band.color}>{band.icon}</span>
        <div>
          <div className="flex items-center gap-2">
            <span className={`font-bold text-lg ${band.color}`}>{band.label}</span>
            <span className={`text-sm font-mono font-bold ${band.color}`}>{pct(result.trueMarginPercent)}</span>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">{band.description}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          label="Gross Revenue"
          value={fmt(result.grossRevenue)}
          icon={<DollarSign className="w-4 h-4" />}
          color="text-cyan-400"
          sub={`Base: ${fmt(pkg.basePrice)}`}
        />
        <KpiCard
          label="Direct Event Cost"
          value={fmt(result.directEventCost)}
          icon={<TrendingDown className="w-4 h-4" />}
          color="text-amber-400"
          sub={`Labor: ${fmt(result.laborCost)} | Consumables: ${fmt(result.consumableCost)}`}
        />
        <KpiCard
          label="Opportunity Cost"
          value={fmt(result.opportunityCost)}
          icon={<Clock className="w-4 h-4" />}
          color="text-orange-400"
          sub="Lost room turnover"
        />
        <KpiCard
          label="True Profit"
          value={fmt(result.trueContributionProfit)}
          icon={<TrendingUp className="w-4 h-4" />}
          color={result.trueContributionProfit >= 0 ? 'text-green-400' : 'text-red-400'}
          sub={`After all costs`}
          large
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiCard
          label="True Margin"
          value={pct(result.trueMarginPercent)}
          icon={<Zap className="w-4 h-4" />}
          color={band.color}
          sub={band.label}
          large
        />
        <KpiCard
          label="Break-Even Base Price"
          value={fmt(result.breakEvenBasePrice)}
          icon={<Target className="w-4 h-4" />}
          color="text-slate-300"
          sub="Minimum to avoid a loss"
        />
        <KpiCard
          label={`Target Base Price (${pct(pkg.targetMargin)})`}
          value={fmt(result.targetBasePrice)}
          icon={<Target className="w-4 h-4" />}
          color="text-amber-400"
          sub={`Hit your ${pct(pkg.targetMargin)} target margin`}
        />
      </div>

      {/* Profit Waterfall */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-slate-300 text-sm font-semibold mb-4">Profit Waterfall</h3>
        <div className="space-y-2">
          <WaterfallRow label="Base Package Price" value={pkg.basePrice} positive />
          {result.extraGuestRevenue > 0 && (
            <WaterfallRow label="Extra Guest Revenue" value={result.extraGuestRevenue} positive />
          )}
          {result.addOnRevenue > 0 && (
            <WaterfallRow label="Add-On Revenue" value={result.addOnRevenue} positive />
          )}
          <WaterfallRow label="Labor Cost" value={-result.laborCost} />
          <WaterfallRow label="Consumable Cost" value={-result.consumableCost} />
          {result.opportunityCost > 0 && (
            <WaterfallRow label="Opportunity Cost" value={-result.opportunityCost} />
          )}
          <div className="border-t border-slate-700 pt-2 mt-2">
            <WaterfallRow
              label="True Contribution Profit"
              value={result.trueContributionProfit}
              total
            />
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <h3 className="text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Recommendation
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">{result.recommendationSummary}</p>
      </div>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  sub?: string;
  large?: boolean;
}

function KpiCard({ label, value, icon, color, sub, large }: KpiCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className={`flex items-center gap-1.5 mb-2 ${color}`}>
        {icon}
        <span className="text-xs font-medium text-slate-400">{label}</span>
      </div>
      <div className={`font-mono font-bold ${color} ${large ? 'text-2xl' : 'text-xl'}`}>{value}</div>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

interface WaterfallRowProps {
  label: string;
  value: number;
  positive?: boolean;
  total?: boolean;
}

function WaterfallRow({ label, value, positive, total }: WaterfallRowProps) {
  const isPositive = value >= 0;
  const color = total
    ? isPositive
      ? 'text-green-400'
      : 'text-red-400'
    : positive
    ? 'text-cyan-400'
    : 'text-red-400';

  const maxBar = 300;
  const barWidth = Math.min(Math.abs(value), maxBar);
  const barPercent = (barWidth / maxBar) * 100;

  return (
    <div className={`flex items-center gap-3 ${total ? 'font-semibold' : ''}`}>
      <span className={`text-xs w-44 shrink-0 ${total ? 'text-slate-200' : 'text-slate-400'}`}>{label}</span>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${isPositive ? 'bg-cyan-500/60' : 'bg-red-500/60'}`}
            style={{ width: `${barPercent}%` }}
          />
        </div>
      </div>
      <span className={`text-sm font-mono w-20 text-right ${color}`}>
        {value >= 0 ? '+' : ''}${Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}
