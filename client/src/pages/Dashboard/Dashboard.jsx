import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Bookmark, Activity, ChevronDown, MoreVertical, Sparkles, User, TrendingUp, ShieldAlert, ArrowRight, Lightbulb, BarChart as BarChartIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, CartesianGrid, ZAxis } from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';

const StatCard = ({ title, value, icon: Icon, trend, trendUp, iconColor, iconBg, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="card-panel p-6"
  >
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-textMuted text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-black tracking-tight">{value}</h3>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <TrendingUp size={14} className={trendUp ? 'text-green-500' : 'text-red-500'} />
          <span className={trendUp ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{trend}</span>
          <span className="text-textMuted">vs last month</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await analyticsService.getDashboardStats('default_search');
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-textMuted space-y-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium">Loading recruitment intelligence dashboard...</p>
      </div>
    );
  }

  // Fallbacks for metrics and graph vectors
  const pipelines = stats?.pipelines || [];
  const flowData = stats?.flowData || [];
  const sourceData = stats?.sourceData || [];
  const scatterData = stats?.scatterData || [];
  
  const totalCandidates = stats?.totalCandidates ?? 0;
  const activeSearches = stats?.activeSearches ?? 0;
  const shortlistedCount = stats?.shortlistedCount ?? 0;
  const avgMatchScore = stats?.avgMatchScore ?? 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Dashboard</h1>
          <p className="text-sm text-textMuted mt-1">Overview of your recruitment activity</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-lg text-sm font-medium text-black hover:bg-gray-50 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            May 19 - Jun 25, 2026 <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Candidates" value={totalCandidates} icon={Users} trend="↑ 14%" trendUp={true} iconBg="bg-green-100" iconColor="text-green-600" delay={0.1} />
        <StatCard title="Active Searches" value={activeSearches} icon={Briefcase} trend="↑ 2" trendUp={true} iconBg="bg-orange-100" iconColor="text-orange-500" delay={0.2} />
        <StatCard title="Shortlisted" value={shortlistedCount} icon={Bookmark} trend="↑ 24%" trendUp={true} iconBg="bg-purple-100" iconColor="text-purple-600" delay={0.3} />
        <StatCard title="Avg Match Score" value={`${avgMatchScore}%`} trend="↑ 3%" icon={Activity} trendUp={true} iconBg="bg-red-100" iconColor="text-red-500" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active Pipelines */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-panel overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-white">
              <h2 className="font-bold text-lg text-black flex items-center gap-2">
                <Activity size={20} className="text-primary" /> Active Pipelines
              </h2>
              <button className="text-primary text-sm font-bold hover:text-primary-dark transition-colors flex items-center gap-1">
                View all pipelines <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="px-6 py-3 border-b border-border bg-gray-50 flex items-center justify-between text-xs font-bold text-textMuted uppercase tracking-wider">
              <div className="w-1/2">Pipeline</div>
              <div className="w-1/6 text-center">Matched</div>
              <div className="w-1/6 text-center">Top Score</div>
              <div className="w-1/6 text-center">Status</div>
              <div className="w-1/6 text-right">Updated</div>
            </div>

            <div className="divide-y divide-border flex-1 bg-white">
              {pipelines.length > 0 ? (
                pipelines.map((search, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 w-1/2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${search.bg || 'bg-gray-100 text-gray-600'}`}>
                        {search.init || 'JD'}
                      </div>
                      <div>
                        <h4 className="font-bold text-black text-sm">{search.role}</h4>
                        <p className="text-xs text-textMuted mt-0.5">Started {search.date}</p>
                      </div>
                    </div>
                    
                    <div className="w-1/6 text-center font-medium text-sm text-black">{search.candidates}</div>
                    
                    <div className="w-1/6 text-center font-bold text-sm" style={{ color: search.match >= 90 ? '#16a34a' : search.match >= 85 ? '#f59e0b' : search.match >= 80 ? '#0ea5e9' : '#e11d48' }}>
                      {search.match}%
                    </div>
                    
                    <div className="w-1/6 text-center">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-600 border border-green-200">
                        {search.status}
                      </span>
                    </div>
                    
                    <div className="w-1/6 text-right flex items-center justify-end gap-2 text-xs text-textMuted">
                      {search.date}
                      <button className="text-gray-400 hover:text-black">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-textMuted flex flex-col items-center justify-center">
                  <Briefcase size={32} className="text-gray-300 mb-2" />
                  <p className="text-sm font-medium">No active pipelines found</p>
                  <p className="text-xs text-textMuted mt-1 mb-4">You have not initialized any candidate searches yet.</p>
                  <button onClick={() => navigate('/create-search')} className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm">
                    Create Search Pipeline
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Match Score Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="card-panel overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-white">
              <div>
                <h2 className="font-bold text-lg text-black flex items-center gap-2">
                  <BarChartIcon size={20} className="text-primary" /> Match Score Distribution
                </h2>
                <p className="text-xs text-textMuted mt-1">Overview of match scores across all active pipelines</p>
              </div>
              <button className="text-sm font-medium border border-border rounded-md px-3 py-1 flex items-center gap-2 hover:bg-gray-50 text-black">
                All Pipelines <ChevronDown size={14} />
              </button>
            </div>
            
            <div className="p-6 h-64 bg-white">
              {scatterData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis type="number" dataKey="x" name="Score" domain={[50, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                    <YAxis type="number" dataKey="y" name="Pipeline" hide domain={[0, 4]} />
                    <ZAxis type="number" dataKey="z" range={[50, 400]} name="Candidates" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    {scatterData.map((scat, idx) => (
                      <Scatter key={idx} name={scat.name} data={scat.points} fill={scat.fill} />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-textMuted text-xs font-medium bg-gray-50 rounded-xl border border-dashed border-border">
                  No data to plot score distribution
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* System Intelligence */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-panel overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-border bg-white flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2 text-black">
              <Sparkles size={20} className="text-primary" /> System Intelligence
            </h2>
            <button 
              onClick={() => navigate('/explainability')}
              className="text-primary text-sm font-bold hover:text-primary-dark transition-colors flex items-center gap-1"
            >
              View all Insights <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="p-6 space-y-4 flex-1 bg-gray-50/50">
            {stats?.alerts?.length > 0 ? (
              stats.alerts.map((alert, i) => (
                <div 
                  key={i}
                  onClick={() => navigate(alert.link)}
                  className="bg-white rounded-xl p-4 border border-border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${alert.iconBg || 'bg-green-100 text-green-600'}`}>
                      <User size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-black mb-1">{alert.title}</h4>
                      <p className="text-xs text-textMuted leading-relaxed" dangerouslySetInnerHTML={{ __html: alert.description }}></p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-textMuted text-xs font-medium border border-dashed border-border rounded-xl bg-white">
                No system recommendations generated yet.
              </div>
            )}
            
            <div className="pt-4 border-t border-border mt-2">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-black mb-1 flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" /> Weekly Activity Summary
                  </h4>
                  <p className="text-xs text-textMuted leading-relaxed">
                    {stats?.weeklySummary || "Your pipeline metrics are being compiled based on recruiter actions."}
                  </p>
                  <button className="text-primary text-xs font-bold mt-2 hover:text-primary-dark flex items-center gap-1">
                    View full report <ArrowRight size={12} />
                  </button>
                </div>
                <div className="relative w-16 h-16 shrink-0 flex flex-col items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * (stats?.goalProgress || 0) / 100)} strokeLinecap="round" />
                  </svg>
                  <span className="text-sm font-bold text-black relative z-10">{stats?.goalProgress || 0}%</span>
                  <span className="text-[8px] text-textMuted absolute -bottom-3 text-center whitespace-nowrap">Goal Progress</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 card-panel p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-black">Talent Flow</h2>
            <button className="text-sm font-medium border border-border rounded-md px-3 py-1 flex items-center gap-2 hover:bg-gray-50">
              This Month <ChevronDown size={14} />
            </button>
          </div>
          <div className="h-64">
            {flowData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flowData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-textMuted text-xs font-medium bg-gray-50 rounded-xl border border-dashed border-border">
                No pipeline candidate flow trends logged
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card-panel p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-black">Sources Performance</h2>
            <button className="text-primary text-sm font-bold hover:text-primary-dark">View all</button>
          </div>
          <div className="flex items-center justify-between h-64 gap-4">
            {sourceData.length > 0 ? (
              <>
                <div className="w-[55%] h-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-[45%] flex flex-col justify-center gap-4">
                  {sourceData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="text-textMuted font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-black">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-textMuted text-xs font-medium bg-gray-50 rounded-xl border border-dashed border-border">
                No sourcing channel distributions logged
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
