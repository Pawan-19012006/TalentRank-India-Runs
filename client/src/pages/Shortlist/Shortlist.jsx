import React, { useState } from 'react';
import { CheckSquare, MoreVertical, Calendar, MessageSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Shortlist = () => {
  const [columns, setColumns] = useState([
    {
      id: 'shortlisted',
      title: 'Shortlisted',
      count: 3,
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      cards: [
        { id: 'c1', name: 'John Doe', role: 'Lead AI Engineer', score: 94, company: 'TechCorp' },
        { id: 'c2', name: 'Michael Chen', role: 'AI Researcher', score: 90, company: 'DataSys' },
        { id: 'c3', name: 'David Kim', role: 'Machine Learning Eng', score: 87, company: 'InnovateAI' },
      ]
    },
    {
      id: 'interview',
      title: 'Interview',
      count: 2,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      cards: [
        { id: 'c4', name: 'Sarah Smith', role: 'Senior ML Engineer', score: 92, company: 'StartupX', interviewDate: 'Tomorrow, 2:00 PM' },
        { id: 'c5', name: 'Emily Davis', role: 'AI Architect', score: 89, company: 'CloudNet', interviewDate: 'Thu, 10:00 AM' },
      ]
    },
    {
      id: 'offer',
      title: 'Offer Extended',
      count: 1,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      cards: [
        { id: 'c6', name: 'Robert Johnson', role: 'Lead AI Engineer', score: 96, company: 'FinTech Solutions' },
      ]
    },
    {
      id: 'hired',
      title: 'Hired',
      count: 0,
      color: 'bg-green-100 text-green-700 border-green-200',
      cards: []
    }
  ]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <CheckSquare className="text-primary" /> Shortlisted Candidates
          </h1>
          <p className="text-textMuted mt-1">Manage your pipeline for the Senior AI Engineer role.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primaryDark transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Add Candidate Manually
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.id} className="w-80 flex flex-col shrink-0 bg-surface/50 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${col.color}`}>
                {col.title} ({col.count})
              </h3>
              <button className="text-textMuted hover:text-black">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {col.cards.map(card => (
                <motion.div 
                  layoutId={card.id}
                  key={card.id} 
                  className="bg-white p-4 rounded-lg border border-border shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-black text-sm">{card.name}</h4>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded">
                      {card.score}%
                    </span>
                  </div>
                  <p className="text-xs text-textMuted mb-3">{card.role} at {card.company}</p>
                  
                  {card.interviewDate && (
                    <div className="bg-surface p-2 rounded text-xs flex items-center gap-2 mb-3 text-black font-medium">
                      <Calendar size={12} className="text-primary" />
                      {card.interviewDate}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 border-t border-border pt-3 mt-1">
                    <button className="text-textMuted hover:text-black transition-colors" title="Message">
                      <MessageSquare size={14} />
                    </button>
                    <button className="text-primary hover:text-primaryDark text-xs font-medium transition-colors">
                      View Profile
                    </button>
                  </div>
                </motion.div>
              ))}
              {col.cards.length === 0 && (
                <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-textMuted text-xs font-medium">
                  Drop candidates here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shortlist;
