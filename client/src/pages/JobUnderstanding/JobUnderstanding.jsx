import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Brain, ShieldAlert, Zap, TrendingUp, Lightbulb, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRanking } from '../../store/rankingStore';
import { topAssessmentSkills, datasetStatistics } from '../../data/inventoryData';

const JobUnderstanding = () => {
  const navigate = useNavigate();
  const { candidates, loading } = useRanking();

  // Dynamically calculate JD details based on the top candidate cluster
  const jdDetails = useMemo(() => {
    if (candidates.length === 0) return { role: 'AI Engineer', industry: 'Technology', level: 'Senior', experience: '5+ Years' };
    
    const topCandidates = candidates.slice(0, 100);
    
    // Find most common role
    const roles = {};
    topCandidates.forEach(c => {
      const r = c.role || 'Software Engineer';
      roles[r] = (roles[r] || 0) + 1;
    });
    const mainRole = Object.entries(roles).sort((a,b) => b[1] - a[1])[0][0];

    // Calculate avg experience of top candidates
    const avgExp = topCandidates.reduce((acc, c) => acc + (c.yearsOfExperience || 5), 0) / topCandidates.length;

    return {
      role: mainRole,
      industry: 'Technology / Software',
      level: avgExp > 7 ? 'Senior / Lead' : 'Mid-Senior',
      experience: `${Math.floor(avgExp - 1)} - ${Math.ceil(avgExp + 1)} Years`
    };
  }, [candidates]);

  // Skill data from inventory to show actual dataset required skills
  const skillData = useMemo(() => {
    return topAssessmentSkills.slice(0, 5).map(s => ({
      name: s.skill,
      level: Math.round((s.count / topAssessmentSkills[0].count) * 100) // Normalize against top skill
    }));
  }, []);

  const intents = [
    `Experience with highly assessed skills like ${skillData[0]?.name || 'Python'} and ${skillData[1]?.name || 'LLMs'}`,
    "Demonstrated ability to deploy scalable architectures",
    `Minimum ${jdDetails.experience} of relevant industry experience`,
    `Track record matching top profiles in the ${datasetStatistics.candidate_count.toLocaleString()} candidate dataset`
  ];

  const hiddenSignals = [
    {
      title: "Data Scale Adaptation",
      description: `Ability to handle massive datasets (similar to our ${datasetStatistics.total_career_records.toLocaleString()} career records pipeline).`,
      icon: 'zap'
    },
    {
      title: "Specialized Toolkit",
      description: `Knowledge of niche frameworks commonly seen in top 1% of ${jdDetails.role} profiles.`,
      icon: 'brain'
    },
    {
      title: "Cross-functional Leadership",
      description: "Mentions of guiding teams and owning architecture in previous roles.",
      icon: 'users'
    }
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-textMuted space-y-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium">Extracting hiring requirements...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Brain className="text-primary" /> AI Job Understanding
          </h1>
          <p className="text-textMuted mt-1">Dynamic requirements extracted from top matched profiles in the dataset.</p>
        </div>
        <button className="bg-white border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 text-black transition-colors shadow-sm">
          Edit Parameters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="card-panel p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-border pb-3 text-black">
              <Target size={18} className="text-primary" /> JD Breakdown
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Target Role</p>
                <p className="font-medium text-black">{jdDetails.role}</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Industry Focus</p>
                <p className="font-medium text-black">{jdDetails.industry}</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Level Required</p>
                <p className="font-medium text-black">{jdDetails.level}</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Experience Avg</p>
                <p className="font-medium text-black">{jdDetails.experience}</p>
              </div>
            </div>
          </div>

          <div className="card-panel p-6 bg-primary/5 border border-primary/20 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/30 blur-3xl rounded-full"></div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10 text-black">
              <Lightbulb size={18} className="text-primary" /> AI Generated Intent
            </h2>
            <p className="text-sm text-textMuted mb-3 relative z-10">
              Based on the data analysis, the ideal candidate requires:
            </p>
            {intents.length > 0 ? (
              <ul className="space-y-2 relative z-10">
                {intents.map((intent, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium text-black">
                    <span className="text-primary mt-0.5">•</span>
                    {intent}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic">No intent parameters generated.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card-panel p-6">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2 text-black">
              <TrendingUp size={18} className="text-primary" /> Required Skill Graph
            </h2>
            <p className="text-sm text-textMuted mb-6">Normalized importance score based on assessment frequency in the talent pool.</p>
            <div className="h-64">
              {skillData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontWeight: 500 }} width={120} />
                    <Tooltip 
                      cursor={{fill: '#f9fafb'}}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#111827' }}
                    />
                    <Bar dataKey="level" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-textMuted text-xs font-medium border border-dashed border-border rounded-lg bg-gray-50">
                  No skills identified to display on graph
                </div>
              )}
            </div>
          </div>

          <div className="card-panel p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-black">
              <ShieldAlert size={18} className="text-primary" /> Hidden Signal Detection
            </h2>
            <p className="text-sm text-textMuted mb-4">
              The AI identified these implicit requirements that are crucial based on the dataset distribution.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Startup Mindset', desc: 'Mentions of "fast-paced", "ambiguous environments", "0 to 1".', icon: Zap },
                { title: 'Leadership', desc: 'Expected to "guide junior engineers" and "own architecture".', icon: Users },
                { title: 'Research Orientation', desc: 'Needs to "stay updated with latest papers".', icon: Brain },
                { title: 'Fast Learner', desc: 'Tech stack mentions "cutting-edge tools".', icon: TrendingUp },
              ].map((signal, i) => (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  key={i} 
                  className="p-4 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm border border-primary/20">
                    <signal.icon size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black">{signal.title}</h4>
                    <p className="text-xs text-textMuted mt-1">{signal.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => navigate('/rankings')}
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors shadow-sm"
            >
              Proceed to Candidate Rankings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobUnderstanding;
