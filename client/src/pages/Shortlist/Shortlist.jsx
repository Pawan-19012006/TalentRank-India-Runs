import React, { useState } from 'react';
import { CheckSquare, MoreVertical, Calendar, MessageSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRanking } from '../../store/rankingStore';
import { useNavigate } from 'react-router-dom';

const Shortlist = () => {
  const { shortlistColumns, candidates, moveCandidate } = useRanking();
  const navigate = useNavigate();

  const handleDragStart = (e, candidateId, sourceColumnId) => {
    e.dataTransfer.setData('candidateId', candidateId);
    e.dataTransfer.setData('sourceColumnId', sourceColumnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    const candidateId = parseInt(e.dataTransfer.getData('candidateId'));
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    if (candidateId && sourceColumnId) {
      moveCandidate(candidateId, sourceColumnId, targetColumnId);
    }
  };

  // Helper to map IDs to candidate objects
  const columnsWithData = shortlistColumns.map(col => ({
    ...col,
    cards: col.cards.map(id => candidates.find(c => c.id === id)).filter(Boolean)
  }));

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <CheckSquare className="text-primary" /> Shortlisted Candidates
          </h1>
          <p className="text-textMuted mt-1">Manage your pipeline for the Senior AI Engineer role.</p>
        </div>
        <button className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Add Candidate Manually
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {columnsWithData.map(col => (
          <div 
            key={col.id} 
            className="w-80 flex flex-col shrink-0 bg-gray-50 rounded-2xl border border-border p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${col.color}`}>
                {col.title} ({col.count})
              </h3>
              <button className="text-textMuted hover:text-black transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {col.cards.map(card => (
                <motion.div 
                  layoutId={card.id.toString()}
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id, col.id)}
                  className="card-panel p-4 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all bg-white"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-black text-sm">{card.name}</h4>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded">
                      {card.score}%
                    </span>
                  </div>
                  <p className="text-xs text-textMuted mb-3">{card.role}</p>
                  
                  {card.interviewDate && (
                    <div className="bg-gray-50 border border-border p-2 rounded text-xs flex items-center gap-2 mb-3 text-black font-medium">
                      <Calendar size={12} className="text-primary" />
                      {card.interviewDate}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 border-t border-border pt-3 mt-1">
                    <button 
                      onClick={() => navigate('/copilot', { state: { prompt: `Tell me about ${card.name}'s experience.` } })}
                      className="text-textMuted hover:text-black transition-colors" title="Message"
                    >
                      <MessageSquare size={14} />
                    </button>
                    <button 
                      onClick={() => navigate(`/candidate/${card.id}`)}
                      className="text-primary hover:text-primary-dark text-xs font-medium transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </motion.div>
              ))}
              {col.cards.length === 0 && (
                <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-textMuted text-xs font-medium bg-gray-50">
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
