import React, { useState } from 'react';
import { Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/rankings');
      setSearchQuery('');
    }
  };
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0 relative z-10 shadow-sm">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search candidates, jobs, or skills... (Press Enter)" 
            className="w-full pl-10 pr-12 py-2 bg-gray-50 border border-border rounded-lg text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-textMuted transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded">⌘</kbd>
            <kbd className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded">K</kbd>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <button 
          onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
          className="p-2 text-textMuted hover:text-black relative rounded-full hover:bg-gray-100 transition-colors"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {showNotifications && (
          <div className="absolute top-full mt-2 right-12 w-80 bg-white border border-border rounded-xl shadow-lg py-2 z-50">
            <div className="px-4 py-2 border-b border-border font-bold text-black">Notifications</div>
            <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
              <p className="text-sm font-medium text-black">Top Talent Alert</p>
              <p className="text-xs text-textMuted mt-1">3 highly-matched candidates just became available.</p>
            </div>
            <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
              <p className="text-sm font-medium text-black">Pipeline Warning</p>
              <p className="text-xs text-textMuted mt-1">Senior Engineer pipeline is lacking candidates.</p>
            </div>
          </div>
        )}
        
        <div 
          className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer group relative"
          onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
        >
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-8 h-8 rounded-full border border-border object-cover" />
          <div className="hidden md:block">
            <p className="text-sm font-bold text-black group-hover:text-primary transition-colors">Rahul Sharma</p>
            <p className="text-xs text-textMuted">Talent Partner</p>
          </div>
          
          {showProfile && (
            <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-border rounded-xl shadow-lg py-1 z-50">
              <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-sm text-black">
                <Settings size={16} /> Settings
              </div>
              <div 
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-sm text-red-600"
                onClick={() => {
                  setShowProfile(false);
                  window.location.reload();
                }}
              >
                <LogOut size={16} /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
