import React from 'react';
import { Check, X, Sparkles, Trophy, ArrowRight } from 'lucide-react';

const CompareCandidates = () => {
  const candidates = [
    { id: 1, name: 'John Doe', role: 'Lead AI Engineer', score: 95, skills: true, leadership: 9, stability: 8, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Sarah Smith', role: 'Senior ML Engineer', score: 92, skills: true, leadership: 7, stability: 9, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Michael Chen', role: 'AI Researcher', score: 90, skills: true, leadership: 6, stability: 7, avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  const features = [
    { key: 'Match Score', getValue: (c) => <span className="font-bold text-primary text-lg">{c.score}%</span> },
    { key: 'Core Skills Match', getValue: (c) => c.skills ? <Check className="text-green-500 mx-auto" size={20} /> : <X className="text-red-500 mx-auto" size={20} /> },
    { key: 'Leadership Score', getValue: (c) => <span className="font-medium">{c.leadership}/10</span> },
    { key: 'Career Stability', getValue: (c) => <span className="font-medium">{c.stability}/10</span> },
    { key: 'Cloud Experience', getValue: (c) => c.id === 1 ? 'AWS (Expert)' : c.id === 2 ? 'GCP (Mid)' : 'Azure (Mid)' },
    { key: 'Notice Period', getValue: (c) => c.id === 1 ? '30 Days' : c.id === 2 ? '15 Days' : '60 Days' },
    { key: 'Expected Salary', getValue: (c) => c.id === 1 ? '₹25LPA' : c.id === 2 ? '₹22LPA' : '₹28LPA' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Compare Candidates</h1>
        <p className="text-textMuted mt-1">Side-by-side comparison of your shortlisted candidates.</p>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface border-b border-border text-xs uppercase text-textMuted font-bold">
              <tr>
                <th className="px-6 py-4 w-48">Feature</th>
                {candidates.map(c => (
                  <th key={c.id} className="px-6 py-4 text-center min-w-[200px]">
                    <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-white shadow-sm" />
                    <div className="text-black font-bold text-sm">{c.name}</div>
                    <div className="text-xs font-normal mt-0.5">{c.role}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {features.map((feature, idx) => (
                <tr key={idx} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-black bg-surface/30">{feature.key}</td>
                  {candidates.map(c => (
                    <td key={c.id} className="px-6 py-4 text-center text-textMuted">
                      {feature.getValue(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-surface/50 border-t border-border">
              <tr>
                <td className="px-6 py-4"></td>
                {candidates.map(c => (
                  <td key={c.id} className="px-6 py-4 text-center">
                    <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors w-full">
                      Select {c.name.split(' ')[0]}
                    </button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-black to-zinc-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full"></div>
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 relative z-10">
          <Trophy size={32} />
        </div>
        <div className="flex-1 relative z-10">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
            <Sparkles className="text-primary" size={20} /> AI Verdict: Recommend John Doe
          </h3>
          <p className="text-white/80 text-sm">
            John has the highest overall match score, strongly aligns with the core skills (Python, RAG), and possesses a superior leadership score compared to the others. He is the safest and most optimal choice for the Lead AI Engineer position.
          </p>
        </div>
        <div className="relative z-10 shrink-0 w-full md:w-auto">
           <button className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primaryDark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
             Proceed to Offer <ArrowRight size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default CompareCandidates;
