import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Brain, ShieldAlert, Zap, TrendingUp, Lightbulb, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const JobUnderstanding = () => {
  const skillData = [
    { name: 'Python', level: 90 },
    { name: 'LLM', level: 95 },
    { name: 'RAG', level: 85 },
    { name: 'Vector DB', level: 70 },
    { name: 'AWS', level: 75 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Brain className="text-primary" /> AI Job Understanding
          </h1>
          <p className="text-textMuted mt-1">Here is how the AI interprets your requirements.</p>
        </div>
        <button className="bg-white border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface">
          Edit Parameters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Target size={18} className="text-primary" /> JD Breakdown
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Role</p>
                <p className="font-medium text-black">Senior AI Engineer</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Industry</p>
                <p className="font-medium text-black">Healthcare Tech</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Level</p>
                <p className="font-medium text-black">Senior</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Experience</p>
                <p className="font-medium text-black">5 - 8 Years</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black to-zinc-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/30 blur-3xl rounded-full"></div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
              <Lightbulb size={18} className="text-primary" /> AI Generated Intent
            </h2>
            <p className="text-sm text-white/80 mb-3 relative z-10">
              Based on the JD semantic analysis, the company wants someone who:
            </p>
            <ul className="space-y-2 relative z-10">
              {[
                'Built production AI systems',
                'Worked intimately with LLMs',
                'Led technical teams',
                'Deployed scalable APIs'
              ].map((intent, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-medium">
                  <span className="text-primary mt-0.5">•</span>
                  {intent}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Required Skill Graph
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#000', fontWeight: 500 }} width={80} />
                  <Tooltip 
                    cursor={{fill: '#f4f4f5'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="level" fill="#ff5722" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShieldAlert size={18} className="text-primary" /> Hidden Signal Detection
            </h2>
            <p className="text-sm text-textMuted mb-4">
              The AI identified these implicit requirements that are not explicitly stated in the skills section, but are crucial based on the responsibilities described.
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
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shrink-0 shadow-sm">
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
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primaryDark transition-colors shadow-lg shadow-primary/30">
              Proceed to Candidate Rankings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobUnderstanding;
