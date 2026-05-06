import { useState, useEffect, useCallback } from 'react';
import {
  Package,
  DollarSign,
  Wrench,
  Clock,
  BarChart2,
  GitCompare,
  CheckSquare,
  Mail,
  Download,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

import type { AppState, TabId } from './types';
import { loadState, saveState } from './lib/storage';
import { calculateProfit } from './lib/profitCalculations';
import { seedPackage, seedScenario, seedChecklist, seedEmailTemplates } from './data/seedData';

import WelcomeHero from './components/WelcomeHero';
import PackageSetupPanel from './components/PackageSetupPanel';
import RevenueBuilder from './components/RevenueBuilder';
import CostBuilder from './components/CostBuilder';
import OpportunityCostPanel from './components/OpportunityCostPanel';
import ResultsDashboard from './components/ResultsDashboard';
import ScenarioComparison from './components/ScenarioComparison';
import ChecklistBuilder from './components/ChecklistBuilder';
import EmailTemplatePanel from './components/EmailTemplatePanel';
import ExportPanel from './components/ExportPanel';

const DEFAULT_STATE: AppState = {
  pkg: seedPackage,
  scenario: seedScenario,
  checklist: seedChecklist,
  emailTemplates: seedEmailTemplates,
  activeTab: 'setup',
};

const TABS: { id: TabId; label: string; icon: React.ReactNode; short: string }[] = [
  { id: 'setup', label: 'Package Setup', icon: <Package className="w-4 h-4" />, short: 'Setup' },
  { id: 'revenue', label: 'Revenue', icon: <DollarSign className="w-4 h-4" />, short: 'Revenue' },
  { id: 'costs', label: 'Costs', icon: <Wrench className="w-4 h-4" />, short: 'Costs' },
  { id: 'opportunity', label: 'Opportunity', icon: <Clock className="w-4 h-4" />, short: 'Opp. Cost' },
  { id: 'results', label: 'Results', icon: <BarChart2 className="w-4 h-4" />, short: 'Results' },
  { id: 'scenarios', label: 'Scenarios', icon: <GitCompare className="w-4 h-4" />, short: 'Scenarios' },
  { id: 'checklist', label: 'Checklist', icon: <CheckSquare className="w-4 h-4" />, short: 'Checklist' },
  { id: 'emails', label: 'Emails', icon: <Mail className="w-4 h-4" />, short: 'Emails' },
  { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" />, short: 'Export' },
];

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadState();
    return saved ? { ...DEFAULT_STATE, ...saved } : DEFAULT_STATE;
  });
  const [showWelcome, setShowWelcome] = useState(() => !loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setTab = (tab: TabId) => setState((s) => ({ ...s, activeTab: tab }));

  const result = calculateProfit(state.pkg, state.scenario);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset all data to the seed example? This cannot be undone.')) {
      setState(DEFAULT_STATE);
    }
  }, []);

  if (showWelcome) {
    return (
      <WelcomeHero
        onGetStarted={() => {
          setShowWelcome(false);
        }}
      />
    );
  }

  const marginColor = {
    loss_risk: 'text-red-400',
    too_thin: 'text-amber-400',
    acceptable: 'text-yellow-400',
    healthy: 'text-green-400',
    excellent: 'text-cyan-400',
  }[result.marginBand];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-slate-950 p-1.5 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 leading-none">Party Profit Planner</h1>
              <p className="text-xs text-slate-500 leading-none mt-0.5">{state.pkg.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
              <span className="text-xs text-slate-400">True Profit:</span>
              <span className={`text-sm font-bold font-mono ${result.trueContributionProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${result.trueContributionProfit.toFixed(2)}
              </span>
              <span className="text-slate-600">|</span>
              <span className={`text-xs font-medium ${marginColor}`}>{result.marginLabel}</span>
            </div>
            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
              title="Reset to seed data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-4 flex gap-0.5 overflow-x-auto pb-0 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                state.activeTab === tab.id
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.short}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Mobile profit strip */}
      <div className="sm:hidden bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">True Profit</span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold font-mono ${result.trueContributionProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${result.trueContributionProfit.toFixed(2)}
          </span>
          <span className={`text-xs ${marginColor}`}>— {result.marginLabel}</span>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="max-w-4xl">
          {state.activeTab === 'setup' && (
            <PackageSetupPanel
              pkg={state.pkg}
              onChange={(pkg) => setState((s) => ({ ...s, pkg }))}
            />
          )}
          {state.activeTab === 'revenue' && (
            <RevenueBuilder
              pkg={state.pkg}
              scenario={state.scenario}
              onScenarioChange={(scenario) => setState((s) => ({ ...s, scenario }))}
            />
          )}
          {state.activeTab === 'costs' && (
            <CostBuilder
              scenario={state.scenario}
              onScenarioChange={(scenario) => setState((s) => ({ ...s, scenario }))}
            />
          )}
          {state.activeTab === 'opportunity' && (
            <OpportunityCostPanel
              scenario={state.scenario}
              onScenarioChange={(scenario) => setState((s) => ({ ...s, scenario }))}
            />
          )}
          {state.activeTab === 'results' && (
            <ResultsDashboard result={result} pkg={state.pkg} />
          )}
          {state.activeTab === 'scenarios' && (
            <ScenarioComparison pkg={state.pkg} scenario={state.scenario} result={result} />
          )}
          {state.activeTab === 'checklist' && (
            <ChecklistBuilder
              items={state.checklist}
              onChange={(checklist) => setState((s) => ({ ...s, checklist }))}
            />
          )}
          {state.activeTab === 'emails' && (
            <EmailTemplatePanel
              templates={state.emailTemplates}
              onChange={(emailTemplates) => setState((s) => ({ ...s, emailTemplates }))}
            />
          )}
          {state.activeTab === 'export' && (
            <ExportPanel state={state} result={result} />
          )}
        </div>
      </main>
    </div>
  );
}
