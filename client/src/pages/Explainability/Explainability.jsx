import React from 'react';
import { HelpCircle, BarChart2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Explainability = () => {
  const shapData = [
    { name: 'Core Skills (Python, RAG)', value: 35, fill: '#ff5722' },
    { name: 'Domain Exp (Healthcare)', value: 20, fill: '#ff5722' },
    { name: 'Leadership Signals', value: 15, fill: '#ff5722' },
    { name: 'Stability/Tenure', value: 10, fill: '#ff5722' },
    { name: 'Open Source Activity', value: 12, fill: '#ff5722' },
    { name: 'Notice Period', value: -5, fill: '#ef4444' }, 
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black flex items-center gap-2">
          <ShieldCheck className="text-primary" /> AI Explainability Center
        </h1>
        <p className="text-textMuted mt-1">Transparent insights into how the AI scores and ranks candidates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
              <HelpCircle size={18} className="text-primary" /> Why is John Doe Ranked #1?
            </h2>
            <p className="text-sm text-textMuted mb-4">
              John achieved an overall match score of <strong className="text-black">94%</strong>. Here is the exact breakdown of features contributing to this score.
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shapData} layout="vertical" margin={{ top: 0, right: 30, left: 120, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#52525b' }} />
                  <Tooltip cursor={{fill: '#f4f4f5'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-primary" /> Fairness & Bias Check
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <h4 className="font-bold text-green-800 text-sm mb-1">Gender Bias</h4>
                <p className="text-green-600 text-xs font-medium">Neutral (0.02% variance)</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <h4 className="font-bold text-green-800 text-sm mb-1">Age Bias</h4>
                <p className="text-green-600 text-xs font-medium">Neutral (0.05% variance)</p>
              </div>
            </div>
            <p className="text-xs text-textMuted mt-4">
              The AI model has been audited and shows no significant correlation between protected attributes and candidate ranking scores.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-black to-zinc-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-3xl rounded-full"></div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
              <Zap size={18} className="text-primary" /> Alternative Ranking Scenarios
            </h2>
            <p className="text-sm text-white/80 mb-6 relative z-10">
              See how the leaderboard changes if you adjust your hiring priorities right now.
            </p>

            <div className="space-y-4 relative z-10">
              <div className="bg-white/10 border border-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-primary text-sm">If Leadership weight increases by 20%</h4>
                  <ArrowRight size={16} />
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="line-through text-white/50">#2 Sarah Smith</span>
                  <span className="text-white font-bold">Becomes #1</span>
                </div>
              </div>

              <div className="bg-white/10 border border-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-primary text-sm">If Startup Fit becomes mandatory</h4>
                  <ArrowRight size={16} />
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="line-through text-white/50">#1 John Doe</span>
                  <span className="text-white font-bold">Drops to #4</span>
                </div>
              </div>
              
              <div className="bg-white/10 border border-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-primary text-sm">If Cloud Exp is removed</h4>
                  <ArrowRight size={16} />
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/80">Top 3 candidates remain unchanged</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-white text-black py-2 rounded-lg text-sm font-bold hover:bg-surface transition-colors relative z-10">
              Apply a Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explainability;
