import React, { useEffect, useState } from 'react';
import { Network, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRanking } from '../../store/rankingStore';

const TalentGraph = () => {
  const { candidates } = useRanking();
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    // Dynamically build graph based on top candidates
    const topCandidates = candidates.slice(0, 15);
    
    let newNodes = [];
    let newLinks = [];
    
    // Central Node (The Job)
    newNodes.push({ id: 'job', label: 'Ideal Candidate', type: 'job', x: 400, y: 300, size: 80, color: '#f59e0b' });
    
    // Candidate Nodes & Links
    topCandidates.forEach((c, index) => {
      const cId = `c_${c.id}`;
      // Calculate positions in a rough circle around the center
      const angle = (index / topCandidates.length) * Math.PI * 2;
      const radius = 220;
      newNodes.push({ 
        id: cId, 
        label: c.name, 
        type: 'candidate', 
        x: 400 + Math.cos(angle) * radius, 
        y: 300 + Math.sin(angle) * radius, 
        size: 55, 
        color: '#0ea5e9' 
      });
      
      newLinks.push({ source: 'job', target: cId });
      
      // Skills Nodes
      const skills = (c._raw?.skills || []).slice(0, 2).map(s => s.name);
      skills.forEach((skill, sIdx) => {
        const sId = `s_${skill}`;
        if (!newNodes.find(n => n.id === sId)) {
           newNodes.push({
             id: sId,
             label: skill,
             type: 'skill',
             x: (400 + Math.cos(angle) * radius) + (Math.cos(sIdx * Math.PI) * 80),
             y: (300 + Math.sin(angle) * radius) + (Math.sin(sIdx * Math.PI) * 80),
             size: 40,
             color: '#18181b'
           });
        }
        newLinks.push({ source: cId, target: sId });
      });
    });

    setNodes(newNodes);
    setLinks(newLinks);
  }, [candidates]);

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
