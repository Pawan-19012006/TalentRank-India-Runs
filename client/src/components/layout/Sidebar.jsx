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
    <div className="w-64 bg-white border-r border-border h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold text-black flex items-center gap-2">
          <span className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">AI</span>
          Recruiter
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-textMuted hover:bg-surface hover:text-black'
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="bg-surface rounded-lg p-3 text-sm">
          <p className="font-medium text-black">AI Workspace</p>
          <p className="text-textMuted text-xs mt-1">Enterprise Edition</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
