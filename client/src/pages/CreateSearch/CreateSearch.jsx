import React, { useState } from 'react';
import { Upload, FileText, Type, Sparkles, SlidersHorizontal, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateSearch = () => {
  const [activeTab, setActiveTab] = useState('paste');
  const [weights, setWeights] = useState({
    skills: 40,
    experience: 25,
    behavior: 20,
    projects: 15
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Create New Search</h1>
        <p className="text-textMuted mt-1">Configure your requirements and let AI find the perfect match.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Job Description
            </h2>
            
            <div className="flex border-b border-border mb-4">
              {[
                { id: 'paste', label: 'Paste JD', icon: Type },
                { id: 'upload', label: 'Upload PDF/DOCX', icon: Upload },
                { id: 'ai', label: 'Generate with AI', icon: Sparkles },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-textMuted hover:text-black'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'paste' && (
              <textarea 
                className="w-full h-64 p-4 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                placeholder="Paste the full job description here..."
              ></textarea>
            )}
            {activeTab === 'upload' && (
              <div className="h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-surface hover:bg-surface/80 transition-colors cursor-pointer text-textMuted">
                <Upload size={32} className="mb-3" />
                <p className="font-medium text-black">Click to upload or drag and drop</p>
                <p className="text-sm mt-1">PDF, DOCX, or TXT (Max 5MB)</p>
              </div>
            )}
            {activeTab === 'ai' && (
              <div className="h-64 border border-border rounded-lg p-4 bg-surface flex flex-col">
                <input 
                  type="text" 
                  placeholder="e.g. Senior AI Engineer specialized in RAG and LangChain" 
                  className="w-full p-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 mb-3"
                />
                <button className="bg-black text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-black/90 self-start">
                  <Sparkles size={16} className="text-primary" />
                  Generate JD
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-primary" />
              Additional Filters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Experience Range</label>
                <select className="w-full p-2.5 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary">
                  <option>3 - 5 Years</option>
                  <option>5 - 8 Years</option>
                  <option>8+ Years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                  <input type="text" placeholder="e.g. Bangalore, Remote" className="w-full pl-9 pr-3 py-2.5 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Expected Salary</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                  <input type="text" placeholder="e.g. ₹20LPA - ₹30LPA" className="w-full pl-9 pr-3 py-2.5 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Employment Type</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                  <select className="w-full pl-9 pr-3 py-2.5 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary">
                    <option>Full-time</option>
                    <option>Contract</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-bold mb-4">Weight Configuration</h2>
            <div className="space-y-4">
              {Object.entries(weights).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium text-textMuted">{key}</span>
                    <span className="font-bold text-black">{value}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={value} 
                    onChange={(e) => setWeights({...weights, [key]: parseInt(e.target.value)})}
                    className="w-full accent-primary h-2 bg-surface rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-surface rounded-lg text-xs text-textMuted flex items-start gap-2">
              <Sparkles size={14} className="text-primary mt-0.5 shrink-0" />
              AI uses these weights to score and rank candidates against the job description.
            </div>
          </div>

          <div className="bg-black text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <h2 className="text-lg font-bold mb-4 relative z-10 flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              AI Analysis Preview
            </h2>
            <div className="space-y-3 text-sm relative z-10">
              <div className="flex gap-2">
                <span className="text-textMuted w-24 shrink-0">Role:</span>
                <span className="font-medium">Senior AI Engineer</span>
              </div>
              <div className="flex gap-2">
                <span className="text-textMuted w-24 shrink-0">Required:</span>
                <span className="font-medium text-primary">Python, LLM, RAG</span>
              </div>
              <div className="flex gap-2">
                <span className="text-textMuted w-24 shrink-0">Level:</span>
                <span className="font-medium">Senior (5-8 yrs)</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primaryDark transition-colors shadow-lg shadow-primary/30 relative z-10">
              Analyze Job & Find Candidates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSearch;
