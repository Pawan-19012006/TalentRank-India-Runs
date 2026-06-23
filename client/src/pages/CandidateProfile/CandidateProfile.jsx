import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar, Sparkles, BookOpen, GitCommit, Target, AlertTriangle, MessageCircle } from 'lucide-react';

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const skillData = [
    { subject: 'Python', A: 95, B: 90, fullMark: 100 },
    { subject: 'LLM/RAG', A: 90, B: 85, fullMark: 100 },
    { subject: 'Cloud (AWS)', A: 80, B: 95, fullMark: 100 },
    { subject: 'System Design', A: 85, B: 90, fullMark: 100 },
    { subject: 'Leadership', A: 88, B: 75, fullMark: 100 },
  ];

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
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm text-center">
            <img src="https://i.pravatar.cc/150?u=1" alt="Profile" className="w-24 h-24 rounded-full border-4 border-surface mx-auto mb-4 object-cover" />
            <h2 className="text-xl font-bold text-black">John Doe</h2>
            <p className="text-textMuted font-medium mb-4">Lead AI Engineer at TechCorp</p>
            
            <div className="grid grid-cols-2 gap-4 text-left text-sm mb-6">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-primary" />
                <span>6 Years Exp</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>Bangalore</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-primary" />
                <span>₹25LPA Exp.</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span>30 Days Notice</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-black/90">
                Shortlist
              </button>
              <button className="flex-1 bg-surface text-black border border-border py-2 rounded-lg text-sm font-medium hover:bg-border">
                Message
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black to-zinc-900 p-6 rounded-xl shadow-lg text-center relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <h3 className="font-bold mb-4 relative z-10 flex justify-center items-center gap-2">
              <Sparkles size={18} className="text-primary" /> AI Match Overview
            </h3>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary/30 relative z-10">
              <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent border-l-transparent transform rotate-45"></div>
              <div className="text-center">
                <span className="text-4xl font-bold">94<span className="text-2xl">%</span></span>
              </div>
            </div>
            <p className="text-sm text-white/80 mt-4 relative z-10">
              Highly aligned with JD requirements. Exceptional fit for Senior AI role.
            </p>
          </div>
        </div>

        {/* Middle Column: Skills & Career Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full">
              <h3 className="font-bold text-lg mb-2 text-black">Skill Alignment</h3>
              <p className="text-sm text-textMuted mb-4">Comparison between Candidate (Orange) and JD Requirements (Gray).</p>
              <div className="flex gap-4 text-xs font-medium mb-4">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary block"></span> Candidate</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-surface block border border-border"></span> Required</div>
              </div>
            </div>
            <div className="w-full md:w-64 h-64 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="#e4e4e7" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#52525b', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Candidate" dataKey="A" stroke="#ff5722" fill="#ff5722" fillOpacity={0.4} />
                  <Radar name="Required" dataKey="B" stroke="#e4e4e7" fill="#f4f4f5" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h3 className="font-bold text-lg mb-6 text-black">Career Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
              {[
                { year: '2025', role: 'Lead AI Engineer', company: 'TechCorp', desc: 'Leading a team of 5, deployed RAG pipeline serving 1M requests/day.' },
                { year: '2023', role: 'Senior AI Engineer', company: 'TechCorp', desc: 'Built internal LLM tools, improved search relevance by 40%.' },
                { year: '2021', role: 'Software Engineer', company: 'StartupX', desc: 'Backend development using Python and AWS.' },
                { year: '2020', role: 'Intern', company: 'DataSys', desc: 'Data cleaning and basic model training.' },
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    <Briefcase size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-surface shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-black">{item.role}</h4>
                      <span className="text-xs font-bold text-primary">{item.year}</span>
                    </div>
                    <p className="text-sm font-medium text-textMuted">{item.company}</p>
                    <p className="text-sm text-textMuted mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><BookOpen size={16} className="text-primary"/> Learning Velocity</h4>
          <ul className="text-sm space-y-2 text-textMuted">
            <li className="flex justify-between"><span>Courses</span> <span className="font-bold text-black">12</span></li>
            <li className="flex justify-between"><span>Certifications</span> <span className="font-bold text-black">4</span></li>
            <li className="flex justify-between"><span>New Skills/Yr</span> <span className="font-bold text-black">3</span></li>
          </ul>
        </div>
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><GitCommit size={16} className="text-primary"/> Activity Signals</h4>
          <ul className="text-sm space-y-2 text-textMuted">
            <li className="flex justify-between"><span>OSS Contributions</span> <span className="font-bold text-black">High</span></li>
            <li className="flex justify-between"><span>Hackathons</span> <span className="font-bold text-black">2 Wins</span></li>
            <li className="flex justify-between"><span>Publications</span> <span className="font-bold text-black">1 Paper</span></li>
          </ul>
        </div>
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Target size={16} className="text-primary"/> Career Stability</h4>
          <ul className="text-sm space-y-2 text-textMuted">
            <li className="flex justify-between"><span>Avg Tenure</span> <span className="font-bold text-black">2.5 Yrs</span></li>
            <li className="flex justify-between"><span>Promotion Rate</span> <span className="font-bold text-black">Fast</span></li>
            <li className="flex justify-between"><span>Role Consistency</span> <span className="font-bold text-black">High</span></li>
          </ul>
        </div>
        <div className="bg-red-50 p-5 rounded-xl border border-red-100 shadow-sm">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-red-600"><AlertTriangle size={16} /> Red Flags</h4>
          <ul className="text-sm space-y-2 text-red-700/80 list-disc ml-4">
            <li>Limited direct reports (max 5)</li>
            <li>No experience with GCP</li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-black">
          <MessageCircle size={18} className="text-primary" /> AI Generated Interview Questions
        </h3>
        <p className="text-sm text-textMuted mb-4">Based on candidate's weaknesses and JD requirements, ask these questions to validate their fit:</p>
        <div className="space-y-4">
          <div className="p-4 bg-surface rounded-lg border border-border">
            <p className="font-medium text-black text-sm">1. "You have primarily used AWS. How would you approach architecting this solution if we had to migrate to GCP next year?"</p>
            <p className="text-xs text-textMuted mt-2 mt-2"><span className="font-bold text-primary">Why:</span> Tests adaptability to new cloud environments (Identified weakness).</p>
          </div>
          <div className="p-4 bg-surface rounded-lg border border-border">
            <p className="font-medium text-black text-sm">2. "Describe a time when your RAG pipeline failed in production under high load. How did you debug and fix it?"</p>
            <p className="text-xs text-textMuted mt-2"><span className="font-bold text-primary">Why:</span> Validates "production AI systems" requirement from JD.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
