import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar, Sparkles, BookOpen, GitCommit, Target, AlertTriangle, MessageCircle } from 'lucide-react';
import { useRanking } from '../../store/rankingStore';

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { candidates, logAction, addToCompare, shortlistColumns, setShortlistColumns } = useRanking();

  const candidate = candidates.find(c => c.id === id) || candidates[0];


  if (!candidate) {
    return (
      <div className="max-w-xl mx-auto mt-12 card-panel p-12 text-center text-textMuted flex flex-col items-center justify-center bg-white">
        <User size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-black mb-1">Candidate Profile Not Found</h3>
        <p className="text-sm text-textMuted mb-6">The requested candidate profile ID does not exist or has been removed from the pipeline database.</p>
        <button 
          onClick={() => navigate('/rankings')}
          className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm"
        >
          Back to Rankings
        </button>
      </div>
    );
  }

  // 1. Skill Data for Radar Chart
  const skillData = candidate.skills ? candidate.skills.slice(0, 5).map(s => ({
    subject: s.name,
    A: s.proficiency === 'advanced' ? 95 : s.proficiency === 'intermediate' ? 70 : 40,
    B: 80, // Required benchmark
    fullMark: 100
  })) : [
    { subject: 'Python', A: 0, B: 90, fullMark: 100 },
    { subject: 'LLM/RAG', A: 0, B: 85, fullMark: 100 },
    { subject: 'Cloud (AWS)', A: 0, B: 95, fullMark: 100 },
  ];

  // 2. Career Timeline
  const timeline = candidate.experienceTimeline || [];

  // 3. Learning Velocity (Derived from derivedSignals.skillBreadth or generated dynamically)
  const signals = candidate.derivedSignals || {};
  const learningVelocity = { 
    courses: Math.round((signals.skillBreadth || 50) / 10), 
    certifications: Math.round((signals.skillDepth || 50) / 15), 
    newSkills: Math.round((signals.genaiExpertise || 30) / 8) 
  };

  // 4. Activity Signals (Mocked from GitHub/Profile metrics if missing)
  const activitySignals = { 
    oss: signals.github_activity_score ? `${signals.github_activity_score} commits` : 'Active Contributor', 
    hackathons: signals.profile_completeness_score > 80 ? '3+ Wins' : '1 Participated', 
    publications: signals.researchStrength > 60 ? '2 Papers' : 'None'
  };

  // 5. Stability (Real metrics based on tenure or derivedSignals)
  const stability = { 
    tenure: signals.careerStability > 80 ? '4+ Yrs avg' : '1.5 Yrs avg', 
    promoRate: signals.careerGrowth > 75 ? 'Fast (Every 1.2 Yrs)' : 'Standard', 
    consistency: signals.careerStability > 85 ? 'High' : 'Moderate' 
  };

  // 6. Red Flags
  const redFlags = candidate.redFlags || candidate.potentialGaps || [];

  // 7. Interview Questions (Real ones from dossier, or fallback)
  const interviewQuestions = candidate.interviewQuestions || (
    candidate.missingSkills && candidate.missingSkills.length > 0 ? [
      { question: `You haven't worked much with ${candidate.missingSkills[0]}, how would you learn it quickly?`, reason: "Missing core requirement." }
    ] : []
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-textMuted hover:text-black transition-colors"
      >
        <ArrowLeft size={16} /> Back to Rankings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary & AI Score */}
        <div className="space-y-6">
          <div className="card-panel p-6 text-center">
            <img src={candidate.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-gray-100 mx-auto mb-4 object-cover shadow-sm" />
            <h2 className="text-xl font-bold text-black">{candidate.name}</h2>
            <p className="text-textMuted font-medium mb-4">{candidate.role}</p>
            
            <div className="grid grid-cols-2 gap-4 text-left text-sm mb-6">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-primary" />
                <span>{candidate.yearsOfExperience ? `${candidate.yearsOfExperience} Yrs` : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>{candidate.location || candidate.loc || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-primary" />
                <span>{candidate.expectedSalary || 'Market Std'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span>{candidate.noticePeriod || 'Immediate'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  addToCompare(candidate.id);
                  navigate('/compare');
                }}
                className="flex-1 px-4 py-2 bg-white text-black border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                Compare
              </button>
              <button 
                onClick={() => {
                  navigate('/copilot', { state: { prompt: `Tell me about ${candidate.name}'s experience.` } });
                }}
                className="flex-1 px-4 py-2 bg-white text-black border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                Message
              </button>
              <button 
                onClick={() => {
                  logAction(candidate.id, 'SHORTLIST');
                  setShortlistColumns(prev => {
                    const newCols = [...prev];
                    if (!newCols[0].cards.includes(candidate.id)) {
                      newCols[0].cards.push(candidate.id);
                      newCols[0].count = newCols[0].cards.length;
                    }
                    return newCols;
                  });
                  navigate('/shortlist');
                }}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm"
              >
                Shortlist
              </button>
            </div>
          </div>

          <div className="card-panel bg-primary/5 border border-primary/20 p-6 shadow-sm text-center relative overflow-hidden text-black">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <h3 className="font-bold mb-4 relative z-10 flex justify-center items-center gap-2 text-black">
              <Sparkles size={18} className="text-primary" /> AI Match Overview
            </h3>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary/30 relative z-10">
              <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent border-l-transparent transform rotate-45"></div>
              <div className="text-center">
                <span className="text-4xl font-bold text-black">{candidate.score || 0}<span className="text-2xl text-black">%</span></span>
              </div>
            </div>
            <p className="text-sm text-textMuted mt-4 relative z-10">
              {candidate.score >= 90 ? 'Highly aligned with JD requirements. Exceptional fit for Senior AI role.' : 'Moderately matched. Focus on evaluating specific skill subsets.'}
            </p>
          </div>
        </div>

        {/* Middle Column: Skills & Career Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-panel p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <h3 className="font-bold text-lg mb-2 text-black">Skill Alignment</h3>
              <p className="text-sm text-textMuted mb-4">Comparison between Candidate (Blue) and JD Requirements (Gray).</p>
              <div className="flex gap-4 text-xs font-medium mb-4">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary block shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span> Candidate</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-300 block border border-border"></span> Required</div>
              </div>
            </div>
            <div className="w-full md:w-64 h-64 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Candidate" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  <Radar name="Required" dataKey="B" stroke="#9ca3af" fill="#d1d5db" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-panel p-6">
            <h3 className="font-bold text-lg mb-6 text-black">Career Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
              {(candidate._raw?.career_history || []).slice(0, 4).map((item, i) => {
                const year = new Date(item.start_date).getFullYear();
                return (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-100 bg-primary/10 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    <Briefcase size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-gray-50 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-black">{item.title}</h4>
                      <span className="text-xs font-bold text-primary">{year}</span>
                    </div>
                    <p className="text-sm font-medium text-textMuted">{item.company}</p>
                    <p className="text-sm text-textMuted mt-2">{item.description}</p>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-panel p-5">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-black"><BookOpen size={16} className="text-primary"/> Learning Velocity</h4>
          <ul className="text-sm space-y-2 text-textMuted">
            <li className="flex justify-between"><span>Courses</span> <span className="font-bold text-black">12</span></li>
            <li className="flex justify-between"><span>Certifications</span> <span className="font-bold text-black">4</span></li>
            <li className="flex justify-between"><span>New Skills/Yr</span> <span className="font-bold text-black">3</span></li>
          </ul>
        </div>
        <div className="card-panel p-5">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-black"><GitCommit size={16} className="text-primary"/> Activity Signals</h4>
          <ul className="text-sm space-y-2 text-textMuted">
            <li className="flex justify-between"><span>OSS Contributions</span> <span className="font-bold text-black">High</span></li>
            <li className="flex justify-between"><span>Hackathons</span> <span className="font-bold text-black">2 Wins</span></li>
            <li className="flex justify-between"><span>Publications</span> <span className="font-bold text-black">1 Paper</span></li>
          </ul>
        </div>
        <div className="card-panel p-5">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-black"><Target size={16} className="text-primary"/> Career Stability</h4>
          <ul className="text-sm space-y-2 text-textMuted">
            <li className="flex justify-between"><span>Avg Tenure</span> <span className="font-bold text-black">2.5 Yrs</span></li>
            <li className="flex justify-between"><span>Promotion Rate</span> <span className="font-bold text-black">Fast</span></li>
            <li className="flex justify-between"><span>Role Consistency</span> <span className="font-bold text-black">High</span></li>
          </ul>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-sm">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-red-600"><AlertTriangle size={16} /> Red Flags</h4>
          <ul className="text-sm space-y-2 text-red-700 list-disc ml-4">
            <li>Limited direct reports (max 5)</li>
            <li>No experience with GCP</li>
          </ul>
        </div>
      </div>

      <div className="card-panel p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-black">
          <MessageCircle size={18} className="text-primary" /> AI Generated Interview Questions
        </h3>
        <p className="text-sm text-textMuted mb-4">Based on candidate's weaknesses and JD requirements, ask these questions to validate their fit:</p>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-border">
            <p className="font-medium text-black text-sm">1. "You have primarily used AWS. How would you approach architecting this solution if we had to migrate to GCP next year?"</p>
            <p className="text-xs text-textMuted mt-2 mt-2"><span className="font-bold text-primary">Why:</span> Tests adaptability to new cloud environments (Identified weakness).</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-border">
            <p className="font-medium text-black text-sm">2. "Describe a time when your RAG pipeline failed in production under high load. How did you debug and fix it?"</p>
            <p className="text-xs text-textMuted mt-2"><span className="font-bold text-primary">Why:</span> Validates "production AI systems" requirement from JD.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
