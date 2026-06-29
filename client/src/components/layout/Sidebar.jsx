import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Brain, 
  Users, 
  GitMerge, 
  Network, 
  CheckSquare, 
  HelpCircle, 
  MessageSquare
} from 'lucide-react';
import { COLORS } from '../../utils/constants';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Search', path: '/create-search', icon: Search },
    { name: 'Job Understanding', path: '/job-understanding', icon: Brain },
    { name: 'AI Rankings', path: '/rankings', icon: Users },
    { name: 'Compare', path: '/compare', icon: GitMerge },
    { name: 'Talent Graph', path: '/talent-graph', icon: Network },
    { name: 'Shortlist', path: '/shortlist', icon: CheckSquare },
    { name: 'Explainability', path: '/explainability', icon: HelpCircle },
    { name: 'Copilot', path: '/copilot', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-[#0a192f] border-r border-[#112240] h-full flex flex-col relative z-10 shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-[#112240]">
        <h1 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
          <span className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white shadow-sm font-black text-sm">
            AI
          </span>
          Recruiter
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-primary text-white font-bold shadow-md' 
                  : 'text-gray-400 hover:bg-[#112240] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'} />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-[#112240]">
        <div className="bg-[#112240] rounded-xl p-4 text-sm relative overflow-hidden group transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-bold text-white relative z-10 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-primary rounded-[1px] rotate-45"></span>
              </span>
              AI Workspace
            </p>
            <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">New</span>
          </div>
          <p className="text-amber-400 text-xs font-bold relative z-10 w-fit flex items-center gap-1">
            Enterprise Edition <span className="text-amber-400 leading-none">👑</span>
          </p>
          <div className="mt-4 pt-4 border-t border-[#1e3a63]">
            <button className="w-full flex items-center justify-between text-gray-300 hover:text-white text-xs font-medium transition-colors">
              <span>Go to Workspace</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
