import React, { useEffect, useState } from 'react';
import { Network, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRanking } from '../../store/rankingStore';

const TalentGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  const { candidates, loading: rankingLoading } = useRanking();

  useEffect(() => {
    if (rankingLoading || !candidates || candidates.length === 0) return;
    
    // Generate real graph data from candidates and skills
    setTimeout(() => {
      const topCandidates = candidates.slice(0, 15);
      const newNodes = [];
      const newLinks = [];
      
      // Central Job Node
      newNodes.push({ id: 'job', label: 'Senior AI Engineer', type: 'job', size: 80, x: 400, y: 300, color: '#f59e0b' });
      
      // Gather common skills from top candidates
      const skillFreq = {};
      topCandidates.forEach(c => {
        if(c.matchedSkills) {
          c.matchedSkills.forEach(s => {
             skillFreq[s] = (skillFreq[s] || 0) + 1;
          });
        }
      });
      const topSkills = Object.entries(skillFreq).sort((a,b) => b[1]-a[1]).slice(0, 6).map(x => x[0]);
      
      // Add Skill Nodes around the Job Node
      topSkills.forEach((skill, i) => {
        const angle = (i / topSkills.length) * Math.PI * 2;
        const radius = 150;
        newNodes.push({
          id: `skill_${skill}`,
          label: skill,
          type: 'skill',
          size: 60,
          x: 400 + radius * Math.cos(angle) - 30,
          y: 300 + radius * Math.sin(angle) - 30,
          color: '#1f2937'
        });
        newLinks.push({ source: 'job', target: `skill_${skill}` });
      });

      // Add Candidate Nodes
      topCandidates.forEach((c, i) => {
        // Random placement around skills
        const angle = (i / topCandidates.length) * Math.PI * 2;
        const radius = 300;
        newNodes.push({
          id: c.id,
          label: c.name,
          type: 'candidate',
          size: 50,
          x: 400 + radius * Math.cos(angle) - 25,
          y: 300 + radius * Math.sin(angle) - 25,
          color: '#10b981'
        });
        
        // Link candidate to job
        newLinks.push({ source: c.id, target: 'job' });
        
        // Link candidate to skills they have
        if (c.matchedSkills) {
          c.matchedSkills.filter(s => topSkills.includes(s)).forEach(s => {
            newLinks.push({ source: c.id, target: `skill_${s}` });
          });
        }
      });
      
      setNodes(newNodes);
      setLinks(newLinks);
    }, 500); // Simulate processing delay
  }, [candidates, rankingLoading]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-black flex items-center gap-2">
          <Network className="text-primary" /> Talent Relationship Graph
        </h1>
        <p className="text-textMuted mt-1">Discover hidden relationships between candidates, skills, and companies.</p>
      </div>

      <div className="flex-1 card-panel relative overflow-hidden flex">
        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 bg-white border border-border rounded-lg shadow-sm flex flex-col p-1 z-10">
          <button className="p-2 hover:bg-gray-50 rounded text-textMuted hover:text-black transition-colors"><ZoomIn size={18} /></button>
          <button className="p-2 hover:bg-gray-50 rounded text-textMuted hover:text-black transition-colors"><ZoomOut size={18} /></button>
          <div className="w-full h-px bg-border my-1"></div>
          <button className="p-2 hover:bg-gray-50 rounded text-textMuted hover:text-black transition-colors"><Maximize size={18} /></button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white border border-border p-3 rounded-lg shadow-sm z-10 text-xs font-medium space-y-2 text-black">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Job Profile</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span> Candidate</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-800 border border-border"></span> Skill</div>
        </div>

        {/* Graph Canvas */}
        <div className="flex-1 relative bg-gray-50" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {links.map((link, i) => {
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              if (!sourceNode || !targetNode) return null;
              return (
                  <line 
                    key={i} 
                    x1={sourceNode.x + sourceNode.size/2} 
                    y1={sourceNode.y + sourceNode.size/2} 
                    x2={targetNode.x + targetNode.size/2} 
                    y2={targetNode.y + targetNode.size/2} 
                    stroke="rgba(0,0,0,0.1)" 
                    strokeWidth="2" 
                  />
              );
            })}
          </svg>

          {nodes.map(node => (
            <motion.div
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              drag
              dragMomentum={false}
              className="absolute flex items-center justify-center rounded-full text-white font-bold text-xs shadow-md cursor-grab active:cursor-grabbing border border-border"
              style={{
                left: node.x,
                top: node.y,
                width: node.size,
                height: node.size,
                backgroundColor: node.color,
                zIndex: node.type === 'candidate' ? 10 : 1
              }}
              whileHover={{ scale: 1.1, zIndex: 20 }}
            >
              {node.label.substring(0, 3)}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TalentGraph;
