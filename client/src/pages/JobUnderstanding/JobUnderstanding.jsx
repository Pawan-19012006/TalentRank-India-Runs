import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Brain, ShieldAlert, Zap, TrendingUp, Lightbulb, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { searchService } from '../../services/searchService';

const JobUnderstanding = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await searchService.getJobUnderstanding('default_search');
        setData(res);
      } catch (err) {
        console.error('Failed to retrieve job requirements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-textMuted space-y-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium">Extracting hiring requirements...</p>
      </div>
    );
  }

  const skillData = data?.skillData || [];
  const jdDetails = data?.details || { role: 'N/A', industry: 'N/A', level: 'N/A', experience: 'N/A' };
  const intents = data?.intents || [];
  const hiddenSignals = data?.hiddenSignals || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Brain className="text-primary" /> AI Job Understanding
          </h1>
          <p className="text-textMuted mt-1">Here is how the AI interprets your requirements.</p>
        </div>
        <button 
          onClick={() => navigate('/create-search')}
          className="bg-white border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 text-black transition-colors shadow-sm"
        >
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
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Role</p>
                <p className="font-medium text-black">{jdDetails.role}</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Industry</p>
                <p className="font-medium text-black">{jdDetails.industry}</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Level</p>
                <p className="font-medium text-black">{jdDetails.level}</p>
              </div>
              <div>
                <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Experience</p>
                <p className="font-medium text-black">{jdDetails.experience}</p>
              </div>
            </div>
          </div>

          <div className="card-panel p-6 bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/30 blur-3xl rounded-full"></div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10 text-white">
              <Lightbulb size={18} className="text-primary" /> AI Generated Intent
            </h2>
            <p className="text-sm text-gray-300 mb-3 relative z-10">
              Based on the JD semantic analysis, the company wants someone who:
            </p>
            {intents.length > 0 ? (
              <ul className="space-y-2 relative z-10">
                {intents.map((intent, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium">
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
            <div className="h-64">
              {skillData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontWeight: 500 }} width={80} />
                    <Tooltip 
                      cursor={{fill: '#f9fafb'}}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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
              The AI identified these implicit requirements that are not explicitly stated in the skills section, but are crucial based on the responsibilities described.
            </p>
            {hiddenSignals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hiddenSignals.map((signal, i) => {
                  const SignalIcon = signal.icon === 'zap' ? Zap : signal.icon === 'users' ? Users : signal.icon === 'brain' ? Brain : TrendingUp;
                  return (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      key={i} 
                      className="p-4 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm border border-primary/20">
                        <SignalIcon size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-black">{signal.title}</h4>
                        <p className="text-xs text-textMuted mt-1">{signal.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-textMuted text-xs font-medium border border-dashed border-border rounded-xl bg-gray-50">
                No hidden signals detected in job responsibilities.
              </div>
            )}
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
