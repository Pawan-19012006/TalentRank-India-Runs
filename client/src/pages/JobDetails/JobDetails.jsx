import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Users, Sparkles, ShieldCheck } from 'lucide-react';
import mockCandidates from '../../data/mockCandidates.json';

const JobDetails = () => {
  const { id } = useParams();
  
  // Fake job details based on ID
  const jobs = {
    '1': { title: 'AI Engineer', type: 'Full-time', location: 'Bangalore / Remote', salary: '₹20L - ₹35L', desc: 'Looking for a strong AI Engineer with experience in RAG, LLMs, and Python. Must have great system design skills. Will be responsible for building scalable AI pipelines and optimizing inference speeds for production applications.' },
    '2': { title: 'Data Scientist', type: 'Full-time', location: 'Mumbai', salary: '₹15L - ₹25L', desc: 'Seeking a Data Scientist experienced in predictive modeling, statistical analysis, and machine learning. You will work closely with the product team to derive actionable insights from complex datasets.' },
    '3': { title: 'Backend Developer', type: 'Full-time', location: 'Remote', salary: '₹18L - ₹28L', desc: 'Strong backend engineer to build scalable APIs and microservices using Node.js and PostgreSQL. Experience with cloud platforms (AWS/GCP) and containerization is highly preferred.' }
  };
  
  const job = jobs[id] || jobs['1'];
  
  // Filter mockCandidates as applicants for this job (top 15)
  const applicants = mockCandidates.slice(0, 15).sort((a, b) => b.overall_score - a.overall_score);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-black">{job.title}</h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-textMuted">
            <div className="flex items-center gap-1"><MapPin size={16} /> {job.location}</div>
            <div className="flex items-center gap-1"><Briefcase size={16} /> {job.type}</div>
            <div className="flex items-center gap-1"><DollarSign size={16} /> {job.salary}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-black hover:text-white transition-colors">Edit Job</button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primaryDark transition-colors">Share Link</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Applicants */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="font-bold text-lg flex items-center gap-2"><Users className="text-primary" size={20} /> Ranked Applicants</h2>
              <span className="text-sm text-textMuted">{applicants.length} Total</span>
            </div>
            <div className="divide-y divide-border">
              {applicants.map((candidate, idx) => (
                <Link to={`/candidate/${candidate.id}`} key={candidate.id} className="block p-6 hover:bg-surface/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={`https://i.pravatar.cc/150?u=${candidate.id}`} alt={candidate.name} className="w-12 h-12 rounded-full object-cover border border-border" />
                        {idx === 0 && <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">#1</div>}
                      </div>
                      <div>
                        <h3 className="font-bold text-black flex items-center gap-2">
                          {candidate.name}
                          {candidate.overall_score >= 90 && <ShieldCheck size={14} className="text-primary" />}
                        </h3>
                        <p className="text-sm text-textMuted">{candidate.skills[0]} Specialist • {candidate.experience_years} Yrs Exp • {candidate.domain}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-black">{candidate.overall_score}%</div>
                      <div className="text-xs text-textMuted">AI Match</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Insights & Details */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-black to-zinc-900 rounded-xl text-white p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="text-primary" size={20} /> AI Insights
            </h2>
            <div className="space-y-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
                <h4 className="font-medium text-sm text-primary mb-1">Top Match Identified</h4>
                <p className="text-xs text-white/80">{applicants[0].name} is a {applicants[0].overall_score}% match, exceeding expectations in core skills. Act fast: notice period is {applicants[0].notice_period_days} days.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
                <h4 className="font-medium text-sm text-primary mb-1">Skill Gap Warning</h4>
                <p className="text-xs text-white/80">60% of applicants lack 'System Design' experience mentioned in the JD. Consider adjusting expectations or screening strictly.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="font-bold text-lg mb-4">Job Description</h2>
            <p className="text-sm text-textMuted leading-relaxed mb-4">{job.desc}</p>
            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-black text-sm mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {['Python', 'RAG', 'LLMs', 'System Design'].map(s => (
                  <span key={s} className="px-2.5 py-1 bg-surface border border-border rounded-md text-xs font-medium">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
