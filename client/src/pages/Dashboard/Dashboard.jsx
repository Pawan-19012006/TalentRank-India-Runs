import React from 'react';
import { Users, Briefcase, Bookmark, Activity, ChevronDown, MoreVertical, Sparkles, User, TrendingUp, ShieldAlert, ArrowRight, Lightbulb, BarChart as BarChartIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, CartesianGrid, ZAxis } from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRanking } from '../../store/rankingStore';



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
  const { candidates, shortlistColumns } = useRanking();
  
  const totalCandidates = candidates.length;
  const shortlistedCount = shortlistColumns.find(c => c.id === 'shortlisted')?.cards.length || 0;
  const avgMatchScore = Math.round(candidates.reduce((acc, curr) => acc + curr.score, 0) / (totalCandidates || 1));

  const flowData = React.useMemo(() => {
    const counts = {};
    candidates.forEach(c => {
      const dateStr = c._raw?.redrob_signals?.signup_date;
      if (dateStr) {
        const month = dateStr.substring(0, 7); // YYYY-MM
        counts[month] = (counts[month] || 0) + 1;
      }
    });
    const sortedDates = Object.keys(counts).sort().slice(-6);
    if (sortedDates.length === 0) return [{ name: 'N/A', value: 0 }];
    return sortedDates.map(date => ({ name: date, value: counts[date] }));
  }, [candidates]);

  const sourceData = React.useMemo(() => {
    const counts = {};
    candidates.forEach(c => {
      const loc = c._raw?.profile?.country || 'Unknown';
      counts[loc] = (counts[loc] || 0) + 1;
    });
    const colors = ['#0f172a', '#22c55e', '#f59e0b', '#8b5cf6', '#f43f5e'];
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    const top = sorted.slice(0, 4);
    const others = sorted.slice(4).reduce((sum, item) => sum + item[1], 0);
    if (others > 0) top.push(['Others', others]);
    
    return top.map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  }, [candidates]);

  const scatterData = React.useMemo(() => {
    // Sample top 100 to avoid clutter
    return candidates.slice(0, 100).map(c => ({
      x: c.experience || parseInt(c.exp) || 0,
      y: c.score,
      z: 100,
      name: c.name
    }));
  }, [candidates]);


  const activePipelines = React.useMemo(() => {
    const roles = {};
    candidates.forEach(c => {
      const role = c._raw?.profile?.current_title || 'Software Engineer';
      if (!roles[role]) roles[role] = { count: 0, scoreSum: 0, highestScore: 0 };
      roles[role].count += 1;
      roles[role].scoreSum += c.score;
      if (c.score > roles[role].highestScore) roles[role].highestScore = c.score;
    });

    const colors = [
      'bg-green-100 text-green-600',
      'bg-orange-100 text-orange-500',
      'bg-purple-100 text-purple-600',
      'bg-indigo-100 text-indigo-600'
    ];

    return Object.entries(roles)
      .sort((a,b) => b[1].count - a[1].count)
      .slice(0, 4)
      .map(([role, data], i) => {
        const words = role.split(' ');
        const init = words.length > 1 ? words[0][0] + words[1][0] : role.substring(0, 2);
        return {
          role,
          date: 'Active now',
          candidates: data.count,
          status: 'Active',
          match: data.highestScore,
          init: init.toUpperCase(),
          bg: colors[i % colors.length]
        };
      });
  }, [candidates]);


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
        <StatCard title="Active Searches" value="1" icon={Briefcase} trend="↑ 2" trendUp={true} iconBg="bg-orange-100" iconColor="text-orange-500" delay={0.2} />
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
            {activePipelines.map((search, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4 w-1/2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${search.bg}`}>
                    {search.init}
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
            ))}
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
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis type="number" dataKey="x" name="Experience Score" domain={['dataMin', 'dataMax']} tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                  <YAxis type="number" dataKey="y" name="Match Score" domain={[50, 100]} />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} name="Candidates" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#111827' }} />
                  <Scatter name="Candidates" data={scatterData} fill="#10b981" />
                </ScatterChart>
              </ResponsiveContainer>
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
            <div 
              onClick={() => navigate('/rankings')}
              className="bg-white rounded-xl p-4 border border-border hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-black mb-1">Top Talent Alert</h4>
                  <p className="text-xs text-textMuted leading-relaxed">3 highly-matched candidates for <b>AI Engineer</b> just became available in your location.</p>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => navigate('/talent-graph')}
              className="bg-white rounded-xl p-4 border border-border hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-black mb-1">Skill Trend Update</h4>
                  <p className="text-xs text-textMuted leading-relaxed"><b>Graph Neural Networks</b> is a fast-rising skill in your pipeline.</p>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => navigate('/shortlist')}
              className="bg-white rounded-xl p-4 border border-border hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Lightbulb size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-black mb-1">Search Optimization</h4>
                  <p className="text-xs text-textMuted leading-relaxed mb-2">Consider adding 2 more skills to improve candidate match rate.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border mt-2">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-black mb-1 flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" /> Weekly Activity Summary
                  </h4>
                  <p className="text-xs text-textMuted leading-relaxed">
                    You've added 12 candidates and closed 2 searches this week.
                  </p>
                  <button className="text-primary text-xs font-bold mt-2 hover:text-primary-dark flex items-center gap-1">
                    View full report <ArrowRight size={12} />
                  </button>
                </div>
                <div className="relative w-16 h-16 shrink-0 flex flex-col items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset="43.9" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm font-bold text-black relative z-10">75%</span>
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
                    itemStyle={{ color: '#111827' }}
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
