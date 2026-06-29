import React from 'react';
import { Check, X, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { useRanking } from '../../store/rankingStore';
import { useNavigate } from 'react-router-dom';

const CompareCandidates = () => {
  const { compareList, candidates: allCandidates } = useRanking();
  const navigate = useNavigate();

  // Get full candidate objects for those in compareList
  const candidates = compareList.map(id => allCandidates.find(c => c.id === id)).filter(Boolean);

  const features = [
    { key: 'Match Score', getValue: (c) => <span className="font-bold text-primary text-lg">{c.score}%</span> },
    { key: 'Core Skills Match', getValue: (c) => <Check className="text-green-500 mx-auto" size={20} /> },
    { key: 'Leadership Score', getValue: (c) => <span className="font-medium">{c.behavior}/100</span> },
    { key: 'Hidden Talent', getValue: (c) => <span className="font-medium text-primary">{c.hidden_talent_score}%</span> },
    { key: 'Experience Match', getValue: (c) => <span className="font-medium">{c.experience}%</span> },
    { key: 'Location', getValue: (c) => c.loc },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Compare Candidates</h1>
        <p className="text-textMuted mt-1">Side-by-side comparison of your shortlisted candidates.</p>
      </div>

      {candidates.length > 0 ? (
        <>
          <div className="card-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-border text-xs uppercase text-textMuted font-bold">
                  <tr>
                    <th className="px-6 py-4 w-48">Feature</th>
                    {candidates.map(c => (
                      <th key={c.id} className="px-6 py-4 text-center min-w-[200px]">
                        <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-border shadow-sm object-cover" />
                        <div className="text-black font-bold text-sm">{c.name}</div>
                        <div className="text-xs font-normal mt-0.5">{c.role}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {features.map((feature, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-black bg-white">{feature.key}</td>
                      {candidates.map(c => (
                        <td key={c.id} className="px-6 py-4 text-center text-textMuted">
                          {feature.getValue(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-border">
                  <tr>
                    <td className="px-6 py-4"></td>
                    {candidates.map(c => (
                      <td key={c.id} className="px-6 py-4 text-center">
                        <button 
                          onClick={() => navigate(`/candidate/${c.id}`)}
                          className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors w-full shadow-sm"
                        >
                          View {c.name.split(' ')[0]}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="card-panel bg-gray-900 text-white p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 relative z-10">
              <Trophy size={32} />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-white">
                <Sparkles className="text-primary" size={20} /> AI Verdict: Recommend {candidates.reduce((prev, current) => (prev.score > current.score) ? prev : current).name}
              </h3>
              <p className="text-gray-300 text-sm">
                This candidate has the highest overall match score and strongly aligns with the core requirements. They are the optimal choice based on your current search configuration.
              </p>
            </div>
            <div className="relative z-10 shrink-0 w-full md:w-auto">
               <button 
                 onClick={() => navigate('/shortlist')}
                 className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
               >
                 Proceed to Shortlist <ArrowRight size={18} />
               </button>
            </div>
          </div>
        </>
      ) : (
        <div className="card-panel p-12 text-center flex flex-col items-center justify-center text-textMuted">
          <Trophy size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">No Candidates Selected</h2>
          <p className="mb-6 max-w-md mx-auto">Go to the Rankings or a Candidate Profile and click "Compare" to add candidates here for a side-by-side analysis.</p>
          <button 
            onClick={() => navigate('/rankings')}
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors shadow-sm"
          >
            Go to Rankings
          </button>
        </div>
      )}
    </div>
  );
};

export default CompareCandidates;
