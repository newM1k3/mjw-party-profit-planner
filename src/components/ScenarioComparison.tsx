import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PartyPackage, EventScenario, ProfitResult } from '../types';
import { calculateProfit } from '../lib/profitCalculations';

interface Props {
  pkg: PartyPackage;
  scenario: EventScenario;
  result: ProfitResult;
}

export default function ScenarioComparison({ pkg, scenario, result }: Props) {
  // Recommended: use target base price
  const recommendedPkg: PartyPackage = {
    ...pkg,
    basePrice: Math.max(0, result.targetBasePrice),
  };
  const recommendedResult = calculateProfit(recommendedPkg, scenario);

  // Custom scenario: break-even only
  const breakEvenPkg: PartyPackage = {
    ...pkg,
    basePrice: Math.max(0, result.breakEvenBasePrice),
  };
  const breakEvenResult = calculateProfit(breakEvenPkg, scenario);

  const fmt = (n: number) => `$${n.toFixed(2)}`;
  const pct = (n: number) => `${n.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <span className="text-amber-400"><TrendingUp className="w-5 h-5" /></span>
        <h2 className="text-lg font-semibold text-slate-100">Scenario Comparison</h2>
      </div>

      <p className="text-slate-400 text-sm">
        Compare your current package economics against the recommended target-margin price and the break-even floor.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScenarioCard
          title="Current Package"
          subtitle={`Base: ${fmt(pkg.basePrice)}`}
          pkg={pkg}
          result={result}
          variant="current"
          fmt={fmt}
          pct={pct}
        />
        <ScenarioCard
          title="Recommended Package"
          subtitle={`Target ${pct(pkg.targetMargin)} margin`}
          pkg={recommendedPkg}
          result={recommendedResult}
          variant="recommended"
          fmt={fmt}
          pct={pct}
          delta={{
            profit: recommendedResult.trueContributionProfit - result.trueContributionProfit,
            margin: recommendedResult.trueMarginPercent - result.trueMarginPercent,
            price: recommendedPkg.basePrice - pkg.basePrice,
          }}
        />
        <ScenarioCard
          title="Break-Even Floor"
          subtitle="Zero profit threshold"
          pkg={breakEvenPkg}
          result={breakEvenResult}
          variant="breakeven"
          fmt={fmt}
          pct={pct}
          delta={{
            profit: breakEvenResult.trueContributionProfit - result.trueContributionProfit,
            margin: breakEvenResult.trueMarginPercent - result.trueMarginPercent,
            price: breakEvenPkg.basePrice - pkg.basePrice,
          }}
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-slate-300 text-sm font-semibold mb-3">Price Gap Analysis</h3>
        <div className="space-y-3">
          <GapRow
            label="Current → Break-Even"
            from={fmt(pkg.basePrice)}
            to={fmt(breakEvenPkg.basePrice)}
            delta={breakEvenPkg.basePrice - pkg.basePrice}
          />
          <GapRow
            label="Current → Target Margin"
            from={fmt(pkg.basePrice)}
            to={fmt(recommendedPkg.basePrice)}
            delta={recommendedPkg.basePrice - pkg.basePrice}
          />
          <GapRow
            label="Break-Even → Target Margin"
            from={fmt(breakEvenPkg.basePrice)}
            to={fmt(recommendedPkg.basePrice)}
            delta={recommendedPkg.basePrice - breakEvenPkg.basePrice}
          />
        </div>
      </div>
    </div>
  );
}

interface ScenarioCardProps {
  title: string;
  subtitle: string;
  pkg: PartyPackage;
  result: ProfitResult;
  variant: 'current' | 'recommended' | 'breakeven';
  fmt: (n: number) => string;
  pct: (n: number) => string;
  delta?: { profit: number; margin: number; price: number };
}

function ScenarioCard({ title, subtitle, pkg, result, variant, fmt, pct, delta }: ScenarioCardProps) {
  const borderColor = {
    current: 'border-slate-700',
    recommended: 'border-amber-500/50',
    breakeven: 'border-cyan-500/30',
  }[variant];

  const headerColor = {
    current: 'text-slate-300',
    recommended: 'text-amber-400',
    breakeven: 'text-cyan-400',
  }[variant];

  const marginColor = {
    loss_risk: 'text-red-400',
    too_thin: 'text-amber-400',
    acceptable: 'text-yellow-400',
    healthy: 'text-green-400',
    excellent: 'text-cyan-400',
  }[result.marginBand];

  return (
    <div className={`bg-slate-900 border ${borderColor} rounded-xl p-4 space-y-3`}>
      <div>
        <h3 className={`font-semibold text-sm ${headerColor}`}>{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      <div className="space-y-2 text-sm">
        <Row label="Base Price" value={fmt(pkg.basePrice)} />
        <Row label="Gross Revenue" value={fmt(result.grossRevenue)} />
        <Row label="Direct Cost" value={fmt(result.directEventCost)} />
        <Row label="Opportunity Cost" value={fmt(result.opportunityCost)} />
        <div className="border-t border-slate-800 pt-2">
          <Row
            label="True Profit"
            value={fmt(result.trueContributionProfit)}
            valueColor={result.trueContributionProfit >= 0 ? 'text-green-400' : 'text-red-400'}
          />
          <Row
            label="True Margin"
            value={`${pct(result.trueMarginPercent)} — ${result.marginLabel}`}
            valueColor={marginColor}
          />
        </div>
      </div>

      {delta && (
        <div className="border-t border-slate-800 pt-2 space-y-1">
          <p className="text-xs text-slate-500 mb-1">vs. Current Package</p>
          <DeltaRow label="Price" delta={delta.price} prefix="$" />
          <DeltaRow label="Profit" delta={delta.profit} prefix="$" />
          <DeltaRow label="Margin" delta={delta.margin} suffix="pp" />
        </div>
      )}
    </div>
  );
}

function Row({ label, value, valueColor = 'text-slate-300' }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500">{label}</span>
      <span className={`font-mono text-xs ${valueColor}`}>{value}</span>
    </div>
  );
}

interface GapRowProps {
  label: string;
  from: string;
  to: string;
  delta: number;
}

function GapRow({ label, from, to, delta }: GapRowProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-400 w-48 shrink-0">{label}</span>
      <span className="text-slate-400 font-mono text-xs">{from}</span>
      <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
      <span className="text-slate-300 font-mono text-xs">{to}</span>
      <span className={`ml-auto font-mono text-xs font-medium ${Math.abs(delta) < 0.01 ? 'text-slate-500' : delta > 0 ? 'text-amber-400' : 'text-green-400'}`}>
        {delta > 0 ? '+' : ''}{delta.toFixed(2)}
      </span>
    </div>
  );
}

interface DeltaRowProps {
  label: string;
  delta: number;
  prefix?: string;
  suffix?: string;
}

function DeltaRow({ label, delta, prefix = '', suffix = '' }: DeltaRowProps) {
  const isPositive = delta > 0;
  const isZero = Math.abs(delta) < 0.01;
  const color = isZero ? 'text-slate-500' : isPositive ? 'text-green-400' : 'text-red-400';
  const Icon = isZero ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon className="w-3 h-3" />
        <span className="font-mono">
          {isPositive ? '+' : ''}{prefix}{Math.abs(delta).toFixed(2)}{suffix}
        </span>
      </div>
    </div>
  );
}
