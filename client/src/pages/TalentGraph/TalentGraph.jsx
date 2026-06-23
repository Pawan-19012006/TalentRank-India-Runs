import React, { useEffect, useState } from 'react';
import { Network, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

const TalentGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    // Mocking a network graph layout
    const initialNodes = [
      { id: 'c1', label: 'John Doe', type: 'candidate', x: 400, y: 300, size: 60, color: '#ff5722' },
      { id: 'c2', label: 'Sarah S.', type: 'candidate', x: 200, y: 150, size: 50, color: '#ff5722' },
      { id: 's1', label: 'RAG', type: 'skill', x: 300, y: 200, size: 40, color: '#000000' },
      { id: 's2', label: 'LLM', type: 'skill', x: 500, y: 200, size: 40, color: '#000000' },
      { id: 'o1', label: 'OpenAI', type: 'company', x: 400, y: 100, size: 45, color: '#22c55e' },
      { id: 'i1', label: 'Healthcare', type: 'industry', x: 300, y: 400, size: 45, color: '#3b82f6' },
      { id: 'p1', label: 'Startup', type: 'project', x: 500, y: 400, size: 40, color: '#a855f7' },
    ];

    const initialLinks = [
      { source: 'c1', target: 's1' },
      { source: 'c1', target: 's2' },
      { source: 'c1', target: 'i1' },
      { source: 'c1', target: 'p1' },
      { source: 'c2', target: 's1' },
      { source: 'c2', target: 'o1' },
      { source: 's1', target: 'o1' },
      { source: 's2', target: 'o1' },
    ];

    setNodes(initialNodes);
    setLinks(initialLinks);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-black flex items-center gap-2">
          <Network className="text-primary" /> Talent Relationship Graph
        </h1>
        <p className="text-textMuted mt-1">Discover hidden relationships between candidates, skills, and companies.</p>
      </div>

      <div className="flex-1 bg-white border border-border rounded-xl shadow-sm relative overflow-hidden flex">
        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 bg-white border border-border rounded-lg shadow-sm flex flex-col p-1 z-10">
          <button className="p-2 hover:bg-surface rounded text-textMuted hover:text-black"><ZoomIn size={18} /></button>
          <button className="p-2 hover:bg-surface rounded text-textMuted hover:text-black"><ZoomOut size={18} /></button>
          <div className="w-full h-px bg-border my-1"></div>
          <button className="p-2 hover:bg-surface rounded text-textMuted hover:text-black"><Maximize size={18} /></button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur border border-border p-3 rounded-lg shadow-sm z-10 text-xs font-medium space-y-2">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span> Candidate</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-black"></span> Skill</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Company</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Industry</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Ecosystem</div>
        </div>

        {/* Graph Canvas */}
        <div className="flex-1 relative bg-surface/30" style={{ backgroundImage: 'radial-gradient(#e4e4e7 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
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
                  stroke="#e4e4e7" 
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
              className="absolute flex items-center justify-center rounded-full text-white font-bold text-xs shadow-md cursor-grab active:cursor-grabbing border-2 border-white"
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
