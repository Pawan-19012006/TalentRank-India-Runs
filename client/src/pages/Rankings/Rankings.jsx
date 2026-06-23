import React from 'react';
import { Search, Filter, Sparkles, TrendingUp, ChevronDown, Check, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Rankings = () => {
  const navigate = useNavigate();

  const candidates = [
    { id: 1, name: 'John Doe', role: 'Lead AI Engineer at TechCorp', exp: '6 Yrs', loc: 'Bangalore', score: 94, skills: 96, experience: 91, behavior: 93, activity: 89, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Sarah Smith', role: 'Senior ML Engineer at StartupX', exp: '5 Yrs', loc: 'Remote', score: 91, skills: 92, experience: 88, behavior: 95, activity: 90, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Michael Chen', role: 'AI Researcher at DataSys', exp: '8 Yrs', loc: 'Mumbai', score: 88, skills: 95, experience: 94, behavior: 82, activity: 75, avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Sparkles className="text-primary" /> AI Ranking Results
          </h1>
          <p className="text-textMuted mt-1">Showing the top matched candidates for Senior AI Engineer.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left Sidebar Filters */}
        <div className="w-64 bg-white border border-border rounded-xl shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-border bg-surface font-bold flex items-center gap-2">
            <Filter size={16} /> Filters
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
            <div>
              <h4 className="font-bold text-black mb-3 text-xs uppercase tracking-wider">Traditional</h4>
              <div className="space-y-2">
                {['Skills Match > 90%', 'Location: Bangalore', 'Exp: 5-8 Yrs', 'Education: Masters'].map((f, i) => (
                  <label key={i} className="flex items-center gap-2 text-textMuted cursor-pointer hover:text-black">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary accent-primary" defaultChecked={i < 2} />
                    {f}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-border"></div>

            <div>
              <h4 className="font-bold text-black mb-3 text-xs uppercase tracking-wider text-primary flex items-center gap-1">
                <Sparkles size={12} /> Advanced AI Filters
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Career Growth', val: 80 },
                  { label: 'Leadership Score', val: 70 },
                  { label: 'Learning Velocity', val: 90 },
                  { label: 'Startup Fit', val: 0 },
                ].map((f, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{f.label}</span>
                      {f.val > 0 && <span className="text-primary font-medium">{f.val}+</span>}
                    </div>
                    {f.val > 0 ? (
                      <input type="range" className="w-full h-1 bg-surface accent-primary rounded-lg appearance-none" defaultValue={f.val} />
                    ) : (
                      <button className="text-xs text-textMuted bg-surface px-2 py-1 rounded w-full text-left flex justify-between items-center">
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
            {candidates.map((c, index) => (
              <div key={c.id} className="bg-white border border-border rounded-xl shadow-sm p-5 hover:border-primary/50 transition-colors">
                <div className="flex gap-4">
                  <img src={c.avatar} alt={c.name} className="w-16 h-16 rounded-full border border-border object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-black flex items-center gap-2">
                          {index === 0 && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Top Match</span>}
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

                    <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-surface p-2 rounded-lg">
                        <span className="block text-textMuted mb-1">Skills</span>
                        <span className="font-bold text-black">{c.skills}%</span>
                      </div>
                      <div className="bg-surface p-2 rounded-lg">
                        <span className="block text-textMuted mb-1">Experience</span>
                        <span className="font-bold text-black">{c.experience}%</span>
                      </div>
                      <div className="bg-surface p-2 rounded-lg">
                        <span className="block text-textMuted mb-1">Behavior</span>
                        <span className="font-bold text-black">{c.behavior}%</span>
                      </div>
                      <div className="bg-surface p-2 rounded-lg">
                        <span className="block text-textMuted mb-1">Activity</span>
                        <span className="font-bold text-black">{c.activity}%</span>
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="mt-4 bg-primary/5 border border-primary/10 p-3 rounded-lg text-sm">
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

                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => navigate(`/candidate/${c.id}`)}
                        className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-black/90 flex items-center justify-center gap-2"
                      >
                        <Eye size={16} /> View Profile
                      </button>
                      <button className="px-4 py-2 bg-surface text-black border border-border rounded-lg text-sm font-medium hover:bg-border transition-colors">
                        Compare
                      </button>
                      <button className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                        <Check size={18} />
                      </button>
                      <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
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
          <div className="bg-black text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <h3 className="font-bold mb-3 flex items-center gap-2 relative z-10">
              <TrendingUp size={16} className="text-primary" /> Market Insights
            </h3>
            <div className="space-y-3 text-sm relative z-10">
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <p className="text-primary font-bold text-lg mb-1">8%</p>
                <p className="text-white/80 text-xs">Only 8% candidates have this specific skillset combination.</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <p className="text-primary font-bold text-lg mb-1">₹18 LPA</p>
                <p className="text-white/80 text-xs">Average market salary for similar profiles.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border p-5 rounded-xl shadow-sm text-center">
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
