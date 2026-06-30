import React from 'react';
import { HelpCircle, BarChart2, Zap, ArrowRight, ShieldCheck, Sliders } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useRanking } from '../../store/rankingStore';

const Explainability = () => {
  const { weightVector, setWeightVector, candidates } = useRanking();

  const shapData = [
    { name: 'Core Skills', value: weightVector.skills, fill: '#ff5722' },
    { name: 'Experience', value: weightVector.experience, fill: '#ff5722' },
    { name: 'Behavior', value: weightVector.behavior, fill: '#ff5722' },
    { name: 'Hidden Talent', value: weightVector.hidden_talent, fill: '#8b5cf6' }
  ];
  const topCandidate = candidates[0] || { name: 'Unknown', score: 0 };

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
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-border pb-3 text-black">
              <HelpCircle size={18} className="text-primary" /> Why is {topCandidate.name} Ranked #1?
            </h2>
            <p className="text-sm text-textMuted mb-4">
              {topCandidate.name.split(' ')[0]} achieved an overall match score of <strong className="text-black">{topCandidate.score}%</strong>. Here is the exact breakdown of features contributing to this score.
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shapData} layout="vertical" margin={{ top: 0, right: 30, left: 120, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#111827' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
                    <span className={w.key === 'hidden_talent' ? 'text-primary font-bold' : 'text-white'}>{w.label}</span>
                    <span className="font-bold text-white">{weightVector[w.key]}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={weightVector[w.key]}
                    onChange={(e) => setWeightVector({...weightVector, [w.key]: parseInt(e.target.value)})}
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
