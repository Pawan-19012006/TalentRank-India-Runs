import React from 'react';
import { Users, Search, CheckCircle, TrendingUp, Upload, FileText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-start justify-between"
  >
    <div>
      <p className="text-textMuted text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-black">{value}</h3>
      <div className="flex items-center gap-1 mt-2 text-xs">
        <TrendingUp size={14} className="text-primary" />
        <span className="text-primary font-medium">{trend}</span>
        <span className="text-textMuted ml-1">vs last month</span>
      </div>
    </div>
    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
      <Icon size={24} />
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Welcome back, Jane</h1>
          <p className="text-textMuted mt-1">Here is what's happening with your hiring today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface transition-colors">
            <Upload size={16} />
            Upload JD
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primaryDark transition-colors shadow-sm">
            <Plus size={16} />
            New Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Candidates" value="12,482" icon={Users} trend="+14%" />
        <StatCard title="Active Searches" value="8" icon={Search} trend="+2" />
        <StatCard title="Shortlisted" value="142" icon={CheckCircle} trend="+24%" />
        <StatCard title="Hiring Success" value="94%" icon={TrendingUp} trend="+3%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="font-bold text-lg">Recent Searches</h2>
            <button className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="divide-y divide-border">
            {[
              { role: 'AI Engineer', date: '2 hours ago', candidates: 450, status: 'Active' },
              { role: 'Data Scientist', date: 'Yesterday', candidates: 210, status: 'Active' },
              { role: 'Backend Developer', date: '3 days ago', candidates: 890, status: 'Reviewing' },
            ].map((search, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-surface transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-textMuted">
                    <Search size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium text-black">{search.role}</h4>
                    <p className="text-sm text-textMuted">Started {search.date}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <p className="font-medium text-black">{search.candidates}</p>
                    <p className="text-xs text-textMuted">Matched</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    search.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {search.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-black to-zinc-900 rounded-xl text-white p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="text-primary">✨</span> AI Insights
          </h2>
          
          <div className="space-y-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
              <h4 className="font-medium text-sm text-primary mb-1">Top Talent Available</h4>
              <p className="text-xs text-white/80">3 highly-matched candidates for AI Engineer just became available in your location.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
              <h4 className="font-medium text-sm text-primary mb-1">Emerging Skills Trend</h4>
              <p className="text-xs text-white/80">Demand for 'RAG' and 'LangChain' has increased 40% in recent JDs. Consider adding these to your Backend roles.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
              <h4 className="font-medium text-sm text-primary mb-1">Market Analysis</h4>
              <p className="text-xs text-white/80">Average salary expectation for Data Scientists has shifted to ₹24LPA in Bangalore.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
