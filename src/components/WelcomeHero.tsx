import { TrendingDown, DollarSign, AlertTriangle, ChevronRight } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
}

export default function WelcomeHero({ onGetStarted }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
          <TrendingDown className="w-4 h-4" />
          Escape Room Revenue Intelligence
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Stop losing money on{' '}
          <span className="text-amber-400">profitable-looking</span> parties.
        </h1>

        <p className="text-slate-400 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
          Profit calculates the <strong className="text-slate-200">true event profit</strong> of
          birthday parties and private events — not just gross booking revenue. Factor in labor,
          cleanup, consumables, discounts, prop wear, and lost room turnover.
        </p>

        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 mb-10 max-w-lg mx-auto">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <div className="text-left">
              <p className="text-slate-300 text-sm font-medium mb-1">The Hidden Profit Problem</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                A <span className="text-amber-400 font-semibold">$250 party</span> can become a{' '}
                <span className="text-red-400 font-semibold">$14 profit</span> after labor, cleanup,
                favors, and lost room turnover. Profit shows you the real number
                before you sell it.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
          {[
            {
              icon: <DollarSign className="w-5 h-5 text-cyan-400" />,
              title: 'True Margin Calculator',
              desc: 'See real profit after all hidden costs and opportunity cost.',
            },
            {
              icon: <TrendingDown className="w-5 h-5 text-amber-400" />,
              title: 'Scenario Comparison',
              desc: 'Compare current pricing against break-even and target prices.',
            },
            {
              icon: <AlertTriangle className="w-5 h-5 text-green-400" />,
              title: 'Operations Planner',
              desc: 'Generate checklists and email templates for every event.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <span className="text-slate-200 font-medium text-sm">{item.title}</span>
              </div>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-amber-500/20"
        >
          Start Calculating
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-slate-600 text-sm mt-4">Free to use. No account required. Data saves locally.</p>
      </div>
    </div>
  );
}
