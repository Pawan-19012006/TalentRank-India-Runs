import React, { useEffect, useState } from 'react';
import { Network, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { candidateService } from '../../services/candidateService';

const TalentGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      try {
        const data = await candidateService.getTalentGraph('default_search');
        setNodes(data?.nodes || []);
        setLinks(data?.links || []);
      } catch (err) {
        console.error('Failed to load talent graph relationships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-textMuted space-y-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium">Plotting talent network nodes...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-black flex items-center gap-2">
          <Network className="text-primary" /> Talent Relationship Graph
        </h1>
        <p className="text-textMuted mt-1">Discover hidden relationships between candidates, skills, and companies.</p>
      </div>

      <div className="flex-1 card-panel relative overflow-hidden flex">
        {nodes.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-textMuted p-12 text-center bg-gray-50">
            <Network size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-black mb-1">No Relationship Nodes Loaded</h3>
            <p className="text-sm text-textMuted max-w-md">The relationship database is currently empty. Start analyzing jobs and ranking profiles to construct connection graphs.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentGraph;
