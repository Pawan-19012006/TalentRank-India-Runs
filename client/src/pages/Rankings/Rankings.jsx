import React, { useMemo, useState } from 'react';
import { Search, Filter, Sparkles, TrendingUp, ChevronDown, Check, X, Eye, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BiasMirrorCard from '../../components/explainability/BiasMirrorCard';
import { useRanking } from '../../store/rankingStore';
import { topAssessmentSkills, datasetStatistics } from '../../data/inventoryData';

const Rankings = () => {
  const navigate = useNavigate();

  // Dynamic filter extraction
  const { topLocs } = useMemo(() => {
    if (!candidates || candidates.length === 0) return { topLocs: ['Bangalore', 'Remote'] };
    const locs = {};
    candidates.forEach(c => {
      const l = c.loc || c.location || 'Unknown';
      locs[l] = (locs[l] || 0) + 1;
    });
    return { topLocs: Object.entries(locs).sort((a,b) => b[1] - a[1]).slice(0, 2).map(x => x[0]) };
  }, [candidates]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-textMuted space-y-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium">Scoring and ranking candidate pool...</p>
      </div>
    );
  }

  const [aiFilters, setAiFilters] = useState({
    skillDepth: 0,
    careerStability: 0,
    careerGrowth: 0
  });

  const displayCandidates = useMemo(() => {
    let filtered = candidates;
    if (showOverlooked) {
      filtered = candidates.filter(c => c.score >= 70 && (c.derivedSignals?.skillDepth || 0) > 70);
    }
    
    // Apply Advanced AI Filters
    filtered = filtered.filter(c => {
      const signals = c.derivedSignals || {};
      return (signals.skillDepth || 0) >= aiFilters.skillDepth &&
             (signals.careerStability || 0) >= aiFilters.careerStability &&
             (signals.careerGrowth || 0) >= aiFilters.careerGrowth;
    });
    
    return filtered.slice(0, 50); // Show top 50 to prevent huge DOM
  }, [candidates, showOverlooked, aiFilters]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Sparkles className="text-primary" /> AI Ranking Results
          </h1>
          <p className="text-textMuted mt-1">Showing the top matched candidates out of {candidates.length} analyzed profiles.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left Sidebar Filters */}
        <div className="w-64 card-panel flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-border bg-gray-50 font-bold flex items-center gap-2 text-black">
            <Filter size={16} className="text-primary" /> Filters
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
            <div>
              <h4 className="font-bold text-black mb-3 text-xs uppercase tracking-wider">Traditional</h4>
              <div className="space-y-2">
                {[`Top Skill: ${topAssessmentSkills[0]?.skill || 'Python'}`, `Location: ${topLocs[0]}`, 'Exp: 5-8 Yrs', 'Education: Verified'].map((f, i) => (
                  <label key={i} className="flex items-center gap-2 text-textMuted cursor-pointer hover:text-black">
                    <input type="checkbox" className="rounded border-border bg-white text-primary focus:ring-primary accent-primary" defaultChecked={i < 2} />
                    {f}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-border"></div>

            <div>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-primary flex items-center gap-1">
                <Sparkles size={12} /> Advanced AI Filters
              </h4>
              <div className="space-y-3">
                {[
                  { key: 'skillDepth', label: 'Skill Depth', val: aiFilters.skillDepth },
                  { key: 'careerStability', label: 'Career Stability', val: aiFilters.careerStability },
                  { key: 'careerGrowth', label: 'Learning Velocity', val: aiFilters.careerGrowth }
                ].map((f, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-black">{f.label}</span>
                      {f.val > 0 && <span className="text-primary font-bold">{f.val}+</span>}
                    </div>
                    {f.val > 0 ? (
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={f.val} 
                        onChange={(e) => setAiFilters({...aiFilters, [f.key]: parseInt(e.target.value)})}
                        className="w-full h-1 bg-gray-200 accent-primary rounded-lg appearance-none cursor-pointer" 
                      />
                    ) : (
                      <button 
                        onClick={() => setAiFilters({...aiFilters, [f.key]: 50})}
                        className="text-xs text-textMuted bg-gray-50 border border-border px-2 py-1 rounded w-full text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
                      >
                        Any <ChevronDown size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <BiasMirrorCard />
            {displayCandidates.map((c, index) => (
              <div key={c.id} className="card-panel p-5 hover:border-primary/50 transition-all group">
                <div className="flex gap-4">
                  <img src={c.avatar} alt={c.name} className="w-16 h-16 rounded-full border border-border object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-black flex items-center gap-2">
                          {index === 0 && <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Top Match</span>}
                          {c.name}
                        </h3>
                        <p className="text-sm font-medium text-textMuted">{c.role}</p>
                        <p className="text-xs text-textMuted mt-1">{c.exp} • {c.loc}</p>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg border-2 border-primary/20">
                          {c.score}
                        </div>
                        <p className="text-[10px] text-textMuted uppercase tracking-wider mt-1 font-bold">Overall</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
                      <div className="bg-gray-50 border border-border p-2 rounded-lg">
                        <span className="block text-textMuted mb-1">Skills</span>
                        <span className="font-bold text-black">{c.skills}%</span>
                      </div>
                      <div className="bg-gray-50 border border-border p-2 rounded-lg">
                        <span className="block text-textMuted mb-1">Experience</span>
                        <span className="font-bold text-black">{c.experience}%</span>
                      </div>
                      <div className="bg-gray-50 border border-border p-2 rounded-lg">
                        <span className="block text-textMuted mb-1">Behavior</span>
                        <span className="font-bold text-black">{c.behavior}%</span>
                      </div>
                      <div className="bg-gray-50 border border-border p-2 rounded-lg">
                        <span className="block text-textMuted mb-1">Activity</span>
                        <span className="font-bold text-black">{c.activity}%</span>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-lg border border-primary/20 group-hover:border-primary/40 transition-all">
                        <span className="block text-primary mb-1">Hidden</span>
                        <span className="font-bold text-primary">{c.hidden_talent_score}%</span>
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="mt-4 bg-primary/5 border border-primary/20 p-3 rounded-lg text-sm">
                        <h4 className="font-bold text-primary flex items-center gap-1 mb-1">
                          <Sparkles size={14} /> Why Ranked #1
                        </h4>
                        <ul className="text-textMuted text-xs space-y-1 ml-4 list-disc">
                          <li>Strong RAG experience</li>
                          <li>Active GenAI contributor</li>
                          <li>Similar healthcare projects</li>
                          <li>Consistent career progression</li>
                        </ul>
                      </div>
                    )}

                    {c.hidden_talent_factors?.length > 0 && (
                      <div className="mt-4 bg-purple-50 border border-purple-200 p-3 rounded-lg text-sm">
                        <h4 className="font-bold text-purple-600 flex items-center gap-1 mb-1">
                          <Sparkles size={14} /> Hidden Talent Factors
                        </h4>
                        <ul className="text-purple-700 text-xs space-y-1 ml-4 list-disc">
                          {c.hidden_talent_factors.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => navigate(`/candidate/${c.id}`)}
                        className="flex-1 bg-white border border-border text-black py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <Eye size={16} /> View Profile
                      </button>
                      <button 
                        onClick={() => {
                          addToCompare(c.id);
                          navigate('/compare');
                        }}
                        className="px-4 py-2 bg-gray-50 text-black border border-border rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        Compare
                      </button>
                      <button 
                        onClick={() => logAction(c.id, 'SHORTLIST')}
                        className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => logAction(c.id, 'REJECT')}
                        className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right AI Panel */}
        <div className="w-64 space-y-4 shrink-0">
          <div className="card-panel bg-primary/5 border border-primary/20 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <h3 className="font-bold mb-3 flex items-center gap-2 relative z-10 text-black">
              <TrendingUp size={16} className="text-primary" /> Market Insights
            </h3>
            <div className="space-y-3 text-sm relative z-10">
              <div className="bg-white p-3 rounded-lg border border-border">
                <p className="text-primary font-bold text-lg mb-1">8%</p>
                <p className="text-textMuted text-xs">Only 8% candidates have this specific skillset combination.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-border">
                <p className="text-primary font-bold text-lg mb-1">₹18 LPA</p>
                <p className="text-textMuted text-xs">Average market salary for similar profiles.</p>
              </div>
            </div>
          </div>

          <div className="card-panel p-5 text-center">
            <h3 className="text-sm font-bold text-black mb-2">Search Quality Score</h3>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-primary text-2xl font-bold text-black">
              95%
            </div>
            <p className="text-xs text-textMuted mt-2">High confidence in results based on JD clarity.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rankings;
