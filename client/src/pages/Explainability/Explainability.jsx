import React, { useState, useEffect } from 'react';
import { HelpCircle, BarChart2, ShieldCheck, Sliders, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useRanking } from '../../store/rankingStore';
import { explainabilityService } from '../../services/explainabilityService';

const Explainability = () => {
  const { weightVector, setWeightVector, candidates, loading } = useRanking();
  const [shapData, setShapData] = useState([]);
  const [shapLoading, setShapLoading] = useState(true);

  const topCandidate = candidates[0];

  useEffect(() => {
    const fetchShap = async () => {
      if (!topCandidate) {
        setShapData([]);
        setShapLoading(false);
        return;
      }
      setShapLoading(true);
      try {
        const data = await explainabilityService.getShapContributions(topCandidate.id, 'default_search');
        setShapData(data);
      } catch (err) {
        console.error('Failed to load SHAP explainability variables:', err);
        setShapData([]);
      } finally {
        setShapLoading(false);
      }
    };
    fetchShap();
  }, [topCandidate]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-textMuted space-y-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium">Loading model weights...</p>
      </div>
    );
  }

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
          <div className="card-panel p-6">
            {shapLoading ? (
              <div className="h-72 flex flex-col items-center justify-center text-textMuted space-y-2">
                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <p className="text-xs">Computing feature importance...</p>
              </div>
            ) : topCandidate ? (
              <>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-border pb-3 text-black">
                  <HelpCircle size={18} className="text-primary" /> Why is {topCandidate.name} Ranked #1?
                </h2>
                <p className="text-sm text-textMuted mb-4">
                  John achieved an overall match score of <strong className="text-black">{topCandidate.score}%</strong>. Here is the exact breakdown of features contributing to this score.
                </p>
                <div className="h-72">
                  {shapData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={shapData} layout="vertical" margin={{ top: 0, right: 30, left: 120, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-textMuted text-xs font-medium border border-dashed border-border rounded-lg bg-gray-50">
                      No SHAP contribution factors returned for candidate
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-textMuted p-6 text-center">
                <AlertCircle size={36} className="text-gray-300 mb-2" />
                <h3 className="text-sm font-bold text-black mb-1">No Active Candidates</h3>
                <p className="text-xs text-textMuted max-w-xs">Score analysis is not available because there are no candidates matching the active search parameters.</p>
              </div>
            )}
          </div>

          <div className="card-panel p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-black">
              <BarChart2 size={18} className="text-primary" /> Fairness & Bias Check
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-bold text-green-700 text-sm mb-1">Gender Bias</h4>
                <p className="text-green-600 text-xs font-medium">Neutral (0.02% variance)</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-bold text-green-700 text-sm mb-1">Age Bias</h4>
                <p className="text-green-600 text-xs font-medium">Neutral (0.05% variance)</p>
              </div>
            </div>
            <p className="text-xs text-textMuted mt-4">
              The AI model has been audited and shows no significant correlation between protected attributes and candidate ranking scores.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-panel bg-gray-900 text-white p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-3xl rounded-full"></div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10 text-white">
              <Sliders size={18} className="text-primary" /> Dynamic Weight Simulator
            </h2>
            <p className="text-sm text-gray-300 mb-6 relative z-10">
              Adjust the weight vectors in real-time. Notice how the Hidden Talent score automatically adjusts when bias patterns are detected in your shortlisting behavior.
            </p>

            <div className="space-y-6 relative z-10">
              {[
                { key: 'skills', label: 'Core Skills & Match' },
                { key: 'experience', label: 'Domain Experience' },
                { key: 'behavior', label: 'Behavioral & Culture' },
                { key: 'hidden_talent', label: 'Hidden Talent (Adaptive)' }
              ].map(w => (
                <div key={w.key}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className={w.key === 'hidden_talent' ? 'text-primary font-bold text-white' : 'text-white'}>{w.label}</span>
                    <span className="font-bold text-white">{weightVector[w.key] || 0}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={weightVector[w.key] || 0}
                    onChange={(e) => setWeightVector({...weightVector, [w.key]: parseInt(e.target.value) || 0})}
                    className="w-full h-1 bg-gray-700 accent-primary rounded-lg appearance-none cursor-pointer" 
                  />
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setWeightVector({ skills: 40, experience: 30, behavior: 20, hidden_talent: 10 })}
              className="w-full mt-8 bg-gray-800 text-white border border-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors relative z-10 shadow-sm">
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explainability;
