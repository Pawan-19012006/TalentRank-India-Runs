<<<<<<< Updated upstream
import React from 'react';
import { Users, Briefcase, Bookmark, Activity, ChevronDown, MoreVertical, Sparkles, User, TrendingUp, ShieldAlert, ArrowRight, Lightbulb, BarChart as BarChartIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, CartesianGrid, ZAxis } from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRanking } from '../../store/rankingStore';


=======
import React, { useState, useEffect, useMemo } from 'react';
import { Users, Briefcase, Bookmark, Activity, ChevronDown, MoreVertical, Sparkles, User, TrendingUp, ShieldAlert, ArrowRight, Lightbulb, BarChart as BarChartIcon, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRanking } from '../../store/rankingStore';
import { datasetStatistics, assessmentInventory, skillInventory, skillCategories, getCategoryBreakdown, aiMlSkills } from '../../data/inventoryData';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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

=======
  const { candidates, loading, shortlistColumns } = useRanking();

  // ─── Compute all analytics from candidates + inventory data ─────

  const totalCandidates = candidates.length;
  const shortlistedCount = shortlistColumns.find(c => c.id === 'shortlisted')?.cards.length || 0;
  const avgMatchScore = useMemo(() => {
    if (totalCandidates === 0) return 0;
    return Math.round(candidates.reduce((acc, c) => acc + (c.score || 0), 0) / totalCandidates);
  }, [candidates, totalCandidates]);

  // Pipelines derived from candidate roles
  const activePipelines = useMemo(() => {
    const roles = {};
    candidates.forEach(c => {
      const role = c.role || 'Software Engineer';
      if (!roles[role]) roles[role] = { count: 0, highestScore: 0 };
      roles[role].count += 1;
      if (c.score > roles[role].highestScore) roles[role].highestScore = c.score;
    });
    const colors = [
      'bg-emerald-50 text-emerald-600',
      'bg-orange-50 text-orange-500',
      'bg-purple-50 text-purple-600',
      'bg-indigo-50 text-indigo-600'
    ];
    return Object.entries(roles)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 4)
      .map(([role, data], i) => {
        const words = role.split(' ');
        const init = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : role.substring(0, 2).toUpperCase();
        return { role, candidates: data.count, match: data.highestScore, status: 'Active', date: 'Active now', init, bg: colors[i % colors.length] };
      });
  }, [candidates]);

  // Score distribution histogram
  const scoreDistribution = useMemo(() => {
    const buckets = { '50-60': 0, '60-70': 0, '70-80': 0, '80-90': 0, '90-100': 0 };
    candidates.forEach(c => {
      const s = c.score || 0;
      if (s >= 90) buckets['90-100']++;
      else if (s >= 80) buckets['80-90']++;
      else if (s >= 70) buckets['70-80']++;
      else if (s >= 60) buckets['60-70']++;
      else buckets['50-60']++;
    });
    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  }, [candidates]);

  // Top AI/ML assessment skills from inventory
  const topAssessmentData = useMemo(() => {
    return assessmentInventory.slice(0, 12).map(s => ({ name: s.skill, candidates: s.count }));
  }, []);

  // Skill category radar from inventory
  const categoryRadar = useMemo(() => {
    const breakdown = getCategoryBreakdown();
    return Object.entries(breakdown).map(([category, data]) => ({
      category: category.length > 15 ? category.substring(0, 15) + '…' : category,
      fullName: category,
      avgCandidates: data.avgCount,
      skillCount: data.skillCount
    }));
  }, []);

  // Location distribution from candidates
  const locationData = useMemo(() => {
    const counts = {};
    candidates.forEach(c => {
      const loc = c.location || c.loc || 'Unknown';
      counts[loc] = (counts[loc] || 0) + 1;
    });
    const colors = ['#0f172a', '#22c55e', '#f59e0b', '#8b5cf6', '#0ea5e9', '#f43f5e', '#6366f1'];
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 6);
    const others = sorted.slice(6).reduce((sum, item) => sum + item[1], 0);
    if (others > 0) top.push(['Others', others]);
    return top.map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  }, [candidates]);

  // Experience distribution
  const experienceDistribution = useMemo(() => {
    const buckets = { '0-2 yrs': 0, '2-5 yrs': 0, '5-8 yrs': 0, '8-12 yrs': 0, '12+ yrs': 0 };
    candidates.forEach(c => {
      const exp = c.yearsOfExperience || 0;
      if (exp >= 12) buckets['12+ yrs']++;
      else if (exp >= 8) buckets['8-12 yrs']++;
      else if (exp >= 5) buckets['5-8 yrs']++;
      else if (exp >= 2) buckets['2-5 yrs']++;
      else buckets['0-2 yrs']++;
    });
    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  }, [candidates]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-textMuted space-y-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium">Loading recruitment intelligence dashboard...</p>
      </div>
    );
  }
>>>>>>> Stashed changes

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Dashboard</h1>
          <p className="text-sm text-textMuted mt-1">Overview of your recruitment activity — powered by {datasetStatistics.candidate_count.toLocaleString()} candidate profiles</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<<<<<<< Updated upstream
        <StatCard title="Total Candidates" value={totalCandidates} icon={Users} trend="↑ 14%" trendUp={true} iconBg="bg-green-100" iconColor="text-green-600" delay={0.1} />
        <StatCard title="Active Searches" value="1" icon={Briefcase} trend="↑ 2" trendUp={true} iconBg="bg-orange-100" iconColor="text-orange-500" delay={0.2} />
=======
        <StatCard title="Ranked Candidates" value={totalCandidates.toLocaleString()} icon={Users} trend={`of ${datasetStatistics.candidate_count.toLocaleString()} total`} trendUp={true} iconBg="bg-green-100" iconColor="text-green-600" delay={0.1} />
        <StatCard title="Skill Records" value={datasetStatistics.total_skill_records.toLocaleString()} icon={Database} trend={`${Math.round(datasetStatistics.total_skill_records / datasetStatistics.candidate_count)} avg per candidate`} trendUp={true} iconBg="bg-orange-100" iconColor="text-orange-500" delay={0.2} />
>>>>>>> Stashed changes
        <StatCard title="Shortlisted" value={shortlistedCount} icon={Bookmark} trend="↑ 24%" trendUp={true} iconBg="bg-purple-100" iconColor="text-purple-600" delay={0.3} />
        <StatCard title="Avg Match Score" value={`${avgMatchScore}%`} trend="↑ 3%" icon={Activity} trendUp={true} iconBg="bg-red-100" iconColor="text-red-500" delay={0.4} />
      </div>

      {/* Row 2: Pipelines + System Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active Pipelines */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-panel overflow-hidden flex flex-col"
          >
<<<<<<< Updated upstream
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
=======
            <div className="p-6 border-b border-border flex justify-between items-center bg-white">
              <h2 className="font-bold text-lg text-black flex items-center gap-2">
                <Activity size={20} className="text-primary" /> Active Pipelines
              </h2>
              <button onClick={() => navigate('/rankings')} className="text-primary text-sm font-bold hover:text-primary-dark transition-colors flex items-center gap-1">
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
                      <p className="text-xs text-textMuted mt-0.5">{search.candidates} candidates</p>
                    </div>
                  </div>
                  <div className="w-1/6 text-center font-medium text-sm text-black">{search.candidates}</div>
                  <div className="w-1/6 text-center font-bold text-sm" style={{ color: search.match >= 90 ? '#16a34a' : search.match >= 80 ? '#f59e0b' : '#e11d48' }}>
                    {search.match}%
                  </div>
                  <div className="w-1/6 text-center">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-600 border border-green-200">
                      {search.status}
                    </span>
                  </div>
                  <div className="w-1/6 text-right text-xs text-textMuted">{search.date}</div>
                </div>
              ))}
            </div>
>>>>>>> Stashed changes
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
                <p className="text-xs text-textMuted mt-1">Distribution of AI match scores across {totalCandidates.toLocaleString()} ranked candidates</p>
              </div>
            </div>
            
            <div className="p-6 h-64 bg-white">
              <ResponsiveContainer width="100%" height="100%">
<<<<<<< Updated upstream
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis type="number" dataKey="x" name="Experience Score" domain={['dataMin', 'dataMax']} tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                  <YAxis type="number" dataKey="y" name="Match Score" domain={[50, 100]} />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} name="Candidates" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#111827' }} />
                  <Scatter name="Candidates" data={scatterData} fill="#10b981" />
                </ScatterChart>
=======
                <BarChart data={scoreDistribution} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#111827' }} />
                  <Bar dataKey="count" name="Candidates" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                  <h4 className="font-bold text-sm text-black mb-1">Top Talent Alert</h4>
                  <p className="text-xs text-textMuted leading-relaxed">3 highly-matched candidates for <b>AI Engineer</b> just became available in your location.</p>
=======
                  <h4 className="font-bold text-sm text-black mb-1">Dataset Scale</h4>
                  <p className="text-xs text-textMuted leading-relaxed">
                    Analyzing <b>{datasetStatistics.candidate_count.toLocaleString()}</b> candidates with <b>{datasetStatistics.total_skill_records.toLocaleString()}</b> skill records and <b>{datasetStatistics.total_career_records.toLocaleString()}</b> career entries.
                  </p>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                  <h4 className="font-bold text-sm text-black mb-1">Skill Trend Update</h4>
                  <p className="text-xs text-textMuted leading-relaxed"><b>Graph Neural Networks</b> is a fast-rising skill in your pipeline.</p>
=======
                  <h4 className="font-bold text-sm text-black mb-1">Top Assessment Skill</h4>
                  <p className="text-xs text-textMuted leading-relaxed"><b>{assessmentInventory[0]?.skill}</b> is the most assessed skill with {assessmentInventory[0]?.count.toLocaleString()} candidate assessments.</p>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                  <h4 className="font-bold text-sm text-black mb-1">Search Optimization</h4>
                  <p className="text-xs text-textMuted leading-relaxed mb-2">Consider adding 2 more skills to improve candidate match rate.</p>
=======
                  <h4 className="font-bold text-sm text-black mb-1">Education Records</h4>
                  <p className="text-xs text-textMuted leading-relaxed"><b>{datasetStatistics.total_education_records.toLocaleString()}</b> education records analyzed for credential scoring.</p>
>>>>>>> Stashed changes
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border mt-2">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-black mb-1 flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" /> Inventory Summary
                  </h4>
                  <p className="text-xs text-textMuted leading-relaxed">
<<<<<<< Updated upstream
                    You've added 12 candidates and closed 2 searches this week.
=======
                    {skillInventory.length} unique skills tracked. {assessmentInventory.length} assessment categories. {totalCandidates.toLocaleString()} candidates currently ranked and scored.
>>>>>>> Stashed changes
                  </p>
                </div>
                <div className="relative w-16 h-16 shrink-0 flex flex-col items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#f3f4f6" strokeWidth="6" />
<<<<<<< Updated upstream
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset="43.9" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm font-bold text-black relative z-10">75%</span>
                  <span className="text-[8px] text-textMuted absolute -bottom-3 text-center whitespace-nowrap">Goal Progress</span>
=======
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * avgMatchScore / 100)} strokeLinecap="round" />
                  </svg>
                  <span className="text-sm font-bold text-black relative z-10">{avgMatchScore}%</span>
                  <span className="text-[8px] text-textMuted absolute -bottom-3 text-center whitespace-nowrap">Avg Score</span>
>>>>>>> Stashed changes
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Skill Radar + Experience + Location */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Category Radar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card-panel p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-black">Skill Landscape</h2>
            <span className="text-xs text-textMuted font-medium">{skillInventory.length} skills tracked</span>
          </div>
<<<<<<< Updated upstream
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
=======
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="65%" data={categoryRadar}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 9, fill: '#6b7280' }} />
                <PolarRadiusAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Radar name="Avg Candidates" dataKey="avgCandidates" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#111827' }} />
              </RadarChart>
>>>>>>> Stashed changes
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Experience Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="card-panel p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-black">Experience Split</h2>
            <span className="text-xs text-textMuted font-medium">Years of experience</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={experienceDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#111827' }} />
                <Bar dataKey="count" name="Candidates" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Location Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card-panel p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-black">Talent Geography</h2>
            <span className="text-xs text-textMuted font-medium">Top locations</span>
          </div>
          <div className="flex items-center justify-between h-64 gap-4">
            <div className="w-[55%] h-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
<<<<<<< Updated upstream
                    data={sourceData}
                    innerRadius={60}
                    outerRadius={85}
=======
                    data={locationData}
                    innerRadius={50}
                    outerRadius={75}
>>>>>>> Stashed changes
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
<<<<<<< Updated upstream
                    {sourceData.map((entry, index) => (
=======
                    {locationData.map((entry, index) => (
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            <div className="w-[45%] flex flex-col justify-center gap-4">
              {sourceData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-textMuted font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-black">{item.value}%</span>
=======
            <div className="w-[45%] flex flex-col justify-center gap-3">
              {locationData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-textMuted font-medium text-xs">{item.name}</span>
                  </div>
                  <span className="font-bold text-black text-xs">{item.value}</span>
>>>>>>> Stashed changes
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 4: Top Assessment Skills */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="card-panel p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-lg text-black flex items-center gap-2">
              <Sparkles size={20} className="text-primary" /> Top Assessment Skills
            </h2>
            <p className="text-xs text-textMuted mt-1">Number of candidates assessed in each skill across the entire dataset</p>
          </div>
          <span className="text-xs text-textMuted font-medium bg-gray-50 border border-border px-3 py-1.5 rounded-lg">{assessmentInventory.length} total assessments</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topAssessmentData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} width={115} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#111827' }} />
              <Bar dataKey="candidates" name="Assessed Candidates" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
