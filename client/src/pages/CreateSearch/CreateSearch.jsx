import React, { useState, useRef } from 'react';
import { Upload, FileText, Type, Sparkles, SlidersHorizontal, MapPin, Briefcase, DollarSign, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
<<<<<<< Updated upstream
=======
import { searchService } from '../../services/searchService';
import { useRanking } from '../../store/rankingStore';
>>>>>>> Stashed changes

const CreateSearch = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('paste');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pastedJd, setPastedJd] = useState('');
  
  const [analysisPreview, setAnalysisPreview] = useState({
    role: 'Senior AI Engineer',
    required: 'Python, LLM, RAG',
    level: 'Senior (5-8 yrs)'
  });

<<<<<<< Updated upstream
=======
  const { setWeightVector } = useRanking();
  const [isSubmitting, setIsSubmitting] = useState(false);

>>>>>>> Stashed changes
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleGenerateJD = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    
    // Simple heuristic to extract role and keywords
    const inputStr = aiPrompt.trim();
    const newRole = inputStr.length > 40 ? inputStr.substring(0, 40) + '...' : inputStr.replace(/\b\w/g, l => l.toUpperCase());
    
    const isTech = inputStr.toLowerCase().includes('engineer') || inputStr.toLowerCase().includes('developer');
    const newRequired = isTech ? 'React, Node.js, System Design' : 'Data Modeling, Communication, Strategy';
    const newLevel = inputStr.toLowerCase().includes('junior') ? 'Junior (1-3 yrs)' : inputStr.toLowerCase().includes('lead') ? 'Lead (8+ yrs)' : 'Mid-Senior (3-5 yrs)';

    setTimeout(() => {
      setIsGenerating(false);
      setPastedJd(`Generated Job Description for: ${newRole}\n\nResponsibilities:\n- Design and implement scalable workflows and solutions.\n- Work closely with cross-functional teams to integrate processes into products.\n- Optimize strategies for performance, efficiency, and accuracy.\n\nRequirements:\n- 3+ years of experience in the relevant domain.\n- Strong proficiency in ${newRequired}.\n- Excellent problem-solving, analytical, and communication skills.`);
      setAnalysisPreview({
        role: newRole,
        required: newRequired,
        level: newLevel
      });
      setActiveTab('paste');
      setAiPrompt('');
    }, 1500);
  };

  const [weights, setWeights] = useState({
    skills: 40,
    experience: 25,
    behavior: 20,
    projects: 15
  });

<<<<<<< Updated upstream
=======
  const handleAnalyze = async () => {
    setIsSubmitting(true);
    const searchData = {
      activeTab,
      pastedJd,
      uploadedFile: uploadedFile ? uploadedFile.name : null,
      filters: {
        experience: '5-8 Yrs',
        location: 'Bangalore, Remote',
        salary: '₹20LPA - ₹30LPA',
        employmentType: 'Full-time'
      },
      weights
    };

    try {
      setWeightVector(weights);
      const search = await searchService.createSearch(searchData);
      const searchId = search?.id || 'default_search';
      navigate('/rankings', { state: { searchId } });
    } catch (err) {
      console.error('Failed to register search criteria:', err);
      navigate('/rankings');
    } finally {
      setIsSubmitting(false);
    }
  };

>>>>>>> Stashed changes
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Create New Search</h1>
        <p className="text-textMuted mt-1">Configure your requirements and let AI find the perfect match.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-panel p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-black">
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
                value={pastedJd}
                onChange={(e) => setPastedJd(e.target.value)}
                className="w-full h-64 p-4 border border-border rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none placeholder-textMuted"
                placeholder="Paste the full job description here..."
              ></textarea>
            )}
            {activeTab === 'upload' && (
              <div 
                className={`h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer text-textMuted ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-border bg-gray-50 hover:bg-gray-100'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploadedFile && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf,.docx,.txt"
                />
                
                {uploadedFile ? (
                  <div className="text-center">
                    <FileText size={48} className="mx-auto mb-3 text-primary" />
                    <p className="font-bold text-black mb-1">{uploadedFile.name}</p>
                    <p className="text-xs text-textMuted mb-4">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                      className="px-4 py-2 border border-border bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <X size={14} /> Remove File
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className={`mb-3 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                    <p className="font-medium text-black">Click to upload or drag and drop</p>
                    <p className="text-sm mt-1">PDF, DOCX, or TXT (Max 5MB)</p>
                  </>
                )}
              </div>
            )}
            {activeTab === 'ai' && (
              <div className="h-64 border border-border rounded-lg p-4 bg-gray-50 flex flex-col justify-center items-center relative overflow-hidden">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center text-primary h-full space-y-4">
                    <Sparkles size={32} className="animate-pulse" />
                    <p className="font-medium animate-pulse">AI is generating the perfect JD...</p>
                  </div>
                ) : (
                  <div className="w-full max-w-lg">
                    <h3 className="font-bold text-black mb-2 flex items-center gap-2">
                      <Sparkles size={16} className="text-primary"/> Prompt AI
                    </h3>
                    <input 
                      type="text" 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Senior AI Engineer specialized in RAG and LangChain" 
                      className="w-full p-3 bg-white border border-border rounded-lg text-black placeholder-textMuted focus:outline-none focus:ring-1 focus:ring-primary mb-4 shadow-sm"
                    />
                    <button 
                      onClick={handleGenerateJD}
                      disabled={!aiPrompt.trim()}
                      className="bg-primary/10 border border-primary/20 text-primary py-2 px-6 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles size={16} />
                      Generate JD
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card-panel p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-black">
              <SlidersHorizontal size={20} className="text-primary" />
              Additional Filters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Experience Range</label>
                <select className="w-full p-2.5 bg-gray-50 border border-border rounded-lg text-black focus:outline-none focus:border-primary">
                  <option>3 - 5 Years</option>
                  <option>5 - 8 Years</option>
                  <option>8+ Years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                  <input type="text" placeholder="e.g. Bangalore, Remote" className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-border rounded-lg text-black placeholder-textMuted focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Expected Salary</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                  <input type="text" placeholder="e.g. ₹20LPA - ₹30LPA" className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-border rounded-lg text-black placeholder-textMuted focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Employment Type</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                  <select className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-border rounded-lg text-black focus:outline-none focus:border-primary">
                    <option>Full-time</option>
                    <option>Contract</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-panel p-6">
            <h2 className="text-lg font-bold mb-4 text-black">Weight Configuration</h2>
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
                    className="w-full h-1 bg-gray-200 accent-primary rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary flex items-start gap-2">
              <Sparkles size={14} className="mt-0.5 shrink-0" />
              AI uses these weights to score and rank candidates against the job description.
            </div>
          </div>

          <div className="card-panel p-6 bg-primary/5 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full"></div>
            <h3 className="font-bold mb-6 relative z-10 flex items-center gap-2 text-black">
              <Sparkles className="text-primary" size={18} /> AI Analysis Preview
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                <span className="text-textMuted font-medium">Inferred Role</span>
                <span className="font-medium text-black">{analysisPreview.role}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                <span className="text-textMuted font-medium">Key Skills</span>
                <span className="font-medium text-primary">{analysisPreview.skills} detected</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                <span className="text-textMuted font-medium">Target Level</span>
                <span className="font-medium text-black">{analysisPreview.level}</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-2">
                <span className="text-textMuted font-medium">AI Confidence</span>
                <span className="font-medium text-green-500">{analysisPreview.confidence}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-2">
                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded border border-primary/30 flex items-center gap-1 font-medium">
                  <Sparkles size={12} /> Hidden-Talent Matching: Enabled
                </span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/rankings')}
              className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors shadow-sm relative z-10"
            >
              Analyze Job & Find Candidates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSearch;
