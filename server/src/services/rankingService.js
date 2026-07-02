const fs = require('fs');
const path = require('path');

const DOSSIER_CACHE_PATH = path.join(__dirname, '../data/candidates_dossier.json');

const KNOWN_SKILLS = [
  'Python', 'LLMs', 'RAG', 'LangChain', 'LlamaIndex', 'PyTorch', 'TensorFlow', 
  'Computer Vision', 'MLOps', 'System Design', 'FAISS', 'Pinecone', 'Vector Search', 
  'Elasticsearch', 'BentoML', 'Kubeflow', 'MLflow', 'Docker', 'Kubernetes', 
  'PostgreSQL', 'Redis', 'MongoDB', 'Go', 'Rust', 'Java', 'TypeScript', 'JavaScript',
  'Deep Learning', 'Machine Learning', 'Qdrant', 'Weaviate', 'Sentence Transformers',
  'Prompt Engineering', 'Fine-tuning LLMs', 'LoRA', 'QLoRA', 'PEFT', 'ASR', 'TTS'
];

// Safely load candidate dossier list
function loadDossiers() {
  try {
    if (fs.existsSync(DOSSIER_CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(DOSSIER_CACHE_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('Failed to load precalculated candidates dossiers:', err.message);
  }
  return [];
}

// Extrater keywords from the job description
function extractKeywords(jdText) {
  if (!jdText || jdText.trim().length < 10) {
    // Default Senior AI Engineer requirements
    return ['Python', 'LLMs', 'RAG', 'LangChain', 'System Design', 'MLOps'];
  }
  const normalized = jdText.toLowerCase();
  return KNOWN_SKILLS.filter(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(normalized);
  });
}

// Extract required years of experience from job description
function extractExpRequired(jdText) {
  if (!jdText) return 5;
  const match = jdText.match(/(\d+)\+?\s*(?:-\s*\d+)?\s*(?:years|yrs|years\sof\sexperience)/i);
  return match ? parseInt(match[1]) : 5;
}

/**
 * Performs dynamic ranking calculations against weights and JD context
 */
function rankCandidates(searchId, weights) {
  const candidates = loadDossiers();
  if (candidates.length === 0) return [];

  // Read dynamic JD context from global cache or fallback
  const jdText = global.lastPastedJd || '';
  const jdKeywords = extractKeywords(jdText);
  const expRequired = extractExpRequired(jdText);

  // Default weights if not specified
  const w = {
    skills: weights?.skills ?? 40,
    experience: weights?.experience ?? 30,
    behavior: weights?.behavior ?? 20,
    hidden_talent: weights?.hidden_talent ?? 10
  };

  return candidates.map(c => {
    const signals = c.derivedSignals || {};

    // 1. Matched and Missing Skills
    const matchedSkills = c.skills
      .filter(s => jdKeywords.some(k => k.toLowerCase() === s.name.toLowerCase()))
      .map(s => s.name);
      
    const missingSkills = jdKeywords.filter(k => 
      !c.skills.some(s => s.name.toLowerCase() === k.toLowerCase())
    );

    // Calculate Skills Match Ratio
    const skillsMatchRatio = jdKeywords.length > 0 ? (matchedSkills.length / jdKeywords.length) : 0.8;
    const skillsMatch = Math.round(skillsMatchRatio * 100);

    // 2. Experience Match Score
    const yearsExp = c.yearsOfExperience || 0;
    let expMatch = 100;
    if (yearsExp < expRequired) {
      expMatch = Math.max(0, 100 - (expRequired - yearsExp) * 15);
    }
    // Add title similarity bonus
    const titleMatch = /ai|ml|intelligence|nlp|vision|deep learning|rag/i.test(c.role);
    if (titleMatch) {
      expMatch = Math.min(100, expMatch + 15);
    }
    expMatch = Math.round(expMatch);

    // 3. Behavioral Match Score
    const behaviorMatch = Math.round(
      0.5 * (signals.responsiveness || 50) + 
      0.3 * (signals.availability || 50) + 
      0.2 * (signals.assessmentStrength || 50)
    );

    // 4. Quality / Hidden Score
    const qualityMatch = Math.round(
      0.3 * (signals.skillDepth || 50) + 
      0.2 * (signals.careerStability || 50) + 
      0.2 * (signals.careerGrowth || 50) + 
      0.3 * (signals.profileQuality || 50)
    );

    // 5. Overall Explainable Score
    const overallScore = Math.round(
      (skillsMatch * (w.skills / 100)) +
      (expMatch * (w.experience / 100)) +
      (behaviorMatch * (w.behavior / 100)) +
      (qualityMatch * (w.hidden_talent / 100))
    );

    // 6. Relevant Experience Calculation
    // Find count of years working in roles containing the extracted skills
    const relevantJobs = c.experienceTimeline?.filter(job => 
      jdKeywords.some(k => 
        job.role.toLowerCase().includes(k.toLowerCase()) || 
        job.desc.toLowerCase().includes(k.toLowerCase())
      )
    ) || [];
    
    const relevantMonths = relevantJobs.reduce((sum, job) => sum + (job.durationMonths || 0), 0);
    const relevantYears = relevantMonths > 0 ? (relevantMonths / 12).toFixed(1) : yearsExp.toFixed(1);
    const relevantExperience = `${relevantYears} Yrs in AI/Data`;

    // 7. Project Relevance
    let projectRelevance = "Standard (General software timelines)";
    if (relevantJobs.length >= 3) {
      projectRelevance = "High (Multiple GenAI/RAG deployments)";
    } else if (relevantJobs.length >= 1) {
      projectRelevance = "Medium (Active AI integration components)";
    }

    // 8. Domain Relevance
    const hasDomainMatch = c.experienceTimeline?.some(job => 
      /health|medical|clinical|hosp/i.test(job.company) || 
      /health|medical|clinical|hosp/i.test(job.desc)
    );
    const domainRelevance = hasDomainMatch ? "High (Healthcare Tech background)" : "General Tech Competence";

    // 9. Strengths & Gaps
    const keyStrengths = [];
    if (signals.ragExpertise > 80 || matchedSkills.includes('RAG')) {
      keyStrengths.push("Deep competence in RAG & Vector search mechanisms");
    }
    if (signals.careerStability > 75) {
      keyStrengths.push("Exceptional career longevity (low hopping frequency)");
    }
    if (c.yearsOfExperience >= expRequired) {
      keyStrengths.push(`Exceeds base experience target (${c.yearsOfExperience} years)`);
    }
    if (keyStrengths.length === 0) {
      keyStrengths.push("Strong credentials matching core developer competencies");
    }

    const potentialGaps = [];
    if (missingSkills.length > 0) {
      potentialGaps.push(`Lacks assessments in: ${missingSkills.slice(0, 2).join(', ')}`);
    }
    if (c.noticePeriod && parseInt(c.noticePeriod) > 45) {
      potentialGaps.push(`Long notice period: ${c.noticePeriod}`);
    }
    if (signals.responsiveness < 65) {
      potentialGaps.push("Slower than average recruiter communication response");
    }

    // 10. Natural Language Explainable Reason
    const whyRankedReason = `${c.name} matches ${matchedSkills.length} key JD skills (${matchedSkills.slice(0, 3).join(', ')}). They have ${relevantExperience} with a project relevance rating of ${projectRelevance}. Strengths include: ${keyStrengths[0]}.`;

    // Update derived values on the dossier
    const updatedSignals = {
      ...signals,
      jobFit: overallScore
    };

    return {
      ...c,
      score: overallScore,
      matchedSkills,
      missingSkills,
      relevantExperience,
      projectRelevance,
      domainRelevance,
      keyStrengths,
      potentialGaps,
      whyRankedReason,
      derivedSignals: updatedSignals
    };
  }).sort((a, b) => b.score - a.score);
}

module.exports = {
  rankCandidates
};
