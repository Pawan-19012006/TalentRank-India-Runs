/**
 * Candidate Intelligence Engine
 * Computes derived expertise scores, behavioral metrics, and profile quality signals.
 */

// Helper to average scores
const averageOf = (scores) => {
  if (!scores || scores.length === 0) return 0;
  const valid = scores.filter(v => typeof v === 'number' && !isNaN(v));
  if (valid.length === 0) return 0;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
};

// Map skills proficiency to values (0-100)
const proficiencyMap = {
  'beginner': 40,
  'intermediate': 70,
  'advanced': 95,
  'expert': 100
};

/**
 * Calculates assessment-specific expertise scores
 */
function calculateGenAIExpertise(candidate) {
  const assessmentKeys = [
    'LLMs', 'Prompt Engineering', 'Fine-tuning LLMs', 'LangChain', 
    'LlamaIndex', 'LoRA', 'QLoRA', 'PEFT', 'Diffusion Models'
  ];
  
  const scores = [];
  const skillAssessments = candidate.redrob_signals?.skill_assessment_scores || {};
  
  assessmentKeys.forEach(k => {
    if (typeof skillAssessments[k] === 'number') {
      scores.push(skillAssessments[k]);
    }
  });

  if (scores.length > 0) {
    return averageOf(scores);
  }

  // Fallback to checking skills duration
  const matchSkills = candidate.skills?.filter(s => 
    /llm|prompt|fine-tuning|langchain|llama|lora|peft|diffusion|hugging face|generative ai/i.test(s.name)
  ) || [];

  if (matchSkills.length === 0) return 0;

  const skillPoints = matchSkills.map(s => {
    const profBase = proficiencyMap[s.proficiency?.toLowerCase()] || 60;
    const durBonus = Math.min(20, (s.duration_months || 0) * 0.5);
    return profBase + durBonus;
  });

  return Math.min(100, Math.round(averageOf(skillPoints)));
}

function calculateRAGExpertise(candidate) {
  const assessmentKeys = [
    'RAG', 'Vector Search', 'Semantic Search', 'Embeddings', 
    'Sentence Transformers', 'Pinecone', 'FAISS', 'Milvus', 
    'Qdrant', 'Weaviate', 'pgvector', 'Information Retrieval', 'Haystack'
  ];

  const scores = [];
  const skillAssessments = candidate.redrob_signals?.skill_assessment_scores || {};

  assessmentKeys.forEach(k => {
    if (typeof skillAssessments[k] === 'number') {
      scores.push(skillAssessments[k]);
    }
  });

  if (scores.length > 0) {
    return averageOf(scores);
  }

  const matchSkills = candidate.skills?.filter(s => 
    /rag|vector|semantic search|embedding|sentence transformer|pinecone|faiss|milvus|qdrant|weaviate|pgvector|haystack/i.test(s.name)
  ) || [];

  if (matchSkills.length === 0) return 0;

  const skillPoints = matchSkills.map(s => {
    const profBase = proficiencyMap[s.proficiency?.toLowerCase()] || 60;
    const durBonus = Math.min(20, (s.duration_months || 0) * 0.5);
    return profBase + durBonus;
  });

  return Math.min(100, Math.round(averageOf(skillPoints)));
}

function calculateMLEngineering(candidate) {
  const assessmentKeys = [
    'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 
    'scikit-learn', 'MLOps', 'MLflow', 'Kubeflow', 'BentoML', 'Weights & Biases'
  ];

  const scores = [];
  const skillAssessments = candidate.redrob_signals?.skill_assessment_scores || {};

  assessmentKeys.forEach(k => {
    if (typeof skillAssessments[k] === 'number') {
      scores.push(skillAssessments[k]);
    }
  });

  if (scores.length > 0) {
    return averageOf(scores);
  }

  const matchSkills = candidate.skills?.filter(s => 
    /machine learning|deep learning|pytorch|tensorflow|scikit|mlops|mlflow|kubeflow|bentoml|weights/i.test(s.name)
  ) || [];

  if (matchSkills.length === 0) return 0;

  const skillPoints = matchSkills.map(s => {
    const profBase = proficiencyMap[s.proficiency?.toLowerCase()] || 60;
    const durBonus = Math.min(20, (s.duration_months || 0) * 0.5);
    return profBase + durBonus;
  });

  return Math.min(100, Math.round(averageOf(skillPoints)));
}

function calculateDataEngineering(candidate) {
  const assessmentKeys = [
    'Feature Engineering', 'Forecasting', 'Time Series', 
    'Statistical Modeling', 'Elasticsearch', 'Information Retrieval', 
    'OpenSearch', 'BM25', 'NLP'
  ];

  const scores = [];
  const skillAssessments = candidate.redrob_signals?.skill_assessment_scores || {};

  assessmentKeys.forEach(k => {
    if (typeof skillAssessments[k] === 'number') {
      scores.push(skillAssessments[k]);
    }
  });

  const baseScore = scores.length > 0 ? averageOf(scores) : 40;

  // Add points for big data framework skills
  const dataSkills = candidate.skills?.filter(s => 
    /spark|airflow|databricks|bigquery|snowflake|dbt|etl|data pipeline/i.test(s.name)
  ) || [];

  const skillCountBonus = Math.min(50, dataSkills.length * 10);
  return Math.min(100, Math.round(baseScore + skillCountBonus));
}

function calculateBackendEngineering(candidate) {
  const backendSkills = candidate.skills?.filter(s => 
    /java|go|rust|node|python|fastapi|django|flask|spring|microservice|api|graphql|grpc|postgres|redis|mongodb|sql|database/i.test(s.name)
  ) || [];

  if (backendSkills.length === 0) return 0;

  const skillCountBonus = Math.min(60, backendSkills.length * 8);
  const avgMonths = averageOf(backendSkills.map(s => s.duration_months || 0));
  const tenureBonus = Math.min(40, avgMonths * 0.6);

  return Math.min(100, Math.round(skillCountBonus + tenureBonus));
}

function calculateSystemDesign(candidate) {
  let score = 30;

  const isArchitect = candidate.career_history?.some(job => 
    /architect|lead|principal|staff|designer|systems engineer/i.test(job.title)
  ) || /architect|lead|principal/i.test(candidate.profile?.current_title);

  if (isArchitect) score += 35;

  const yearsExp = candidate.profile?.years_of_experience || 0;
  if (yearsExp >= 8) {
    score += 35;
  } else if (yearsExp >= 4) {
    score += 20;
  }

  const isTier1 = candidate.education?.some(e => /tier 1/i.test(e.tier)) || false;
  if (isTier1) score += 15;

  return Math.min(100, score);
}

function calculateResearchStrength(candidate) {
  const assessmentKeys = [
    'Reinforcement Learning', 'ASR', 'CNN', 'YOLO', 'Computer Vision', 
    'Speech Recognition', 'Image Classification', 'Object Detection', 
    'GANs', 'TTS'
  ];

  const scores = [];
  const skillAssessments = candidate.redrob_signals?.skill_assessment_scores || {};

  assessmentKeys.forEach(k => {
    if (typeof skillAssessments[k] === 'number') {
      scores.push(skillAssessments[k]);
    }
  });

  let baseScore = scores.length > 0 ? averageOf(scores) : 40;

  const isDoctorateOrMasters = candidate.education?.some(e => 
    /phd|doctor|master|m\.tech|m\.s\./i.test(e.degree)
  );

  if (isDoctorateOrMasters) baseScore += 25;

  return Math.min(100, Math.round(baseScore));
}

/**
 * Calculates behavioral and growth signals
 */
function calculateCareerGrowth(candidate) {
  let score = 40;

  // Seniority promotion checks
  const history = candidate.career_history || [];
  if (history.length > 1) {
    const firstJob = history[history.length - 1];
    const currentJob = history[0];

    const isCurrentSenior = /senior|lead|principal|director|head|manager/i.test(currentJob.title);
    const isFirstJunior = /junior|intern|associate|entry/i.test(firstJob.title);

    if (isCurrentSenior && isFirstJunior) score += 30;
    else if (isCurrentSenior) score += 15;
  }

  // Company size shift: moving to larger entities or reputable tech hubs
  const hasEnterpriseExp = history.some(job => 
    /large|enterprise|10000\+/i.test(job.company_size)
  );
  if (hasEnterpriseExp) score += 15;

  const totalCertifications = candidate.certifications?.length || 0;
  score += Math.min(15, totalCertifications * 5);

  return Math.min(100, score);
}

function calculateCareerStability(candidate) {
  const history = candidate.career_history || [];
  if (history.length === 0) return 60; // neutral default

  const totalMonths = history.reduce((sum, job) => sum + (job.duration_months || 0), 0);
  const avgMonths = totalMonths / history.length;

  if (avgMonths >= 36) return 100;
  if (avgMonths <= 12) return 30;
  
  // Interpolate between 30 and 100
  return Math.round(30 + ((avgMonths - 12) / 24) * 70);
}

function calculateSkillDepth(candidate) {
  const totalMonths = candidate.skills?.reduce((sum, s) => sum + (s.duration_months || 0), 0) || 0;
  return Math.min(100, Math.round((totalMonths / 144) * 100));
}

function calculateSkillBreadth(candidate) {
  const uniqueSkills = candidate.skills?.length || 0;
  return Math.min(100, Math.round((uniqueSkills / 20) * 100));
}

function calculateAssessmentStrength(candidate) {
  const skillAssessments = candidate.redrob_signals?.skill_assessment_scores || {};
  const scores = Object.values(skillAssessments).filter(v => typeof v === 'number');
  if (scores.length === 0) return 0;
  return Math.round(averageOf(scores));
}

function calculateAvailability(candidate) {
  const openToWork = candidate.redrob_signals?.open_to_work_flag || false;
  const noticePeriod = candidate.redrob_signals?.notice_period_days || 90;

  const base = openToWork ? 65 : 25;
  const speedBonus = Math.max(0, (90 - noticePeriod) * 0.38);

  return Math.min(100, Math.round(base + speedBonus));
}

function calculateRecruiterInterest(candidate) {
  const saved = candidate.redrob_signals?.saved_by_recruiters_30d || 0;
  const appearance = candidate.redrob_signals?.search_appearance_30d || 0;

  return Math.min(100, Math.round((saved * 10) + (appearance * 1.5)));
}

function calculateResponsiveness(candidate) {
  const avgHours = candidate.redrob_signals?.avg_response_time_hours || 48;
  return Math.max(0, Math.round(100 - (avgHours * 1.38)));
}

function calculateProfileQuality(candidate) {
  const completeness = candidate.redrob_signals?.profile_completeness_score || 0.7;
  return Math.round(completeness * 100);
}

/**
 * Computes all derived signals for a candidate dossier
 */
function computeDerivedSignals(candidate) {
  const genaiExpertise = calculateGenAIExpertise(candidate);
  const ragExpertise = calculateRAGExpertise(candidate);
  const mlEngineering = calculateMLEngineering(candidate);
  const dataEngineering = calculateDataEngineering(candidate);
  const backendEngineering = calculateBackendEngineering(candidate);
  const systemDesign = calculateSystemDesign(candidate);
  const researchStrength = calculateResearchStrength(candidate);

  const careerGrowth = calculateCareerGrowth(candidate);
  const careerStability = calculateCareerStability(candidate);
  const skillDepth = calculateSkillDepth(candidate);
  const skillBreadth = calculateSkillBreadth(candidate);
  const assessmentStrength = calculateAssessmentStrength(candidate);
  const availability = calculateAvailability(candidate);
  const recruiterInterest = calculateRecruiterInterest(candidate);
  const responsiveness = calculateResponsiveness(candidate);
  const profileQuality = calculateProfileQuality(candidate);

  // Job Fit Placeholder (Job Fit is dynamically computed during ranking based on JD)
  const jobFit = 75; 

  return {
    genaiExpertise,
    ragExpertise,
    mlEngineering,
    dataEngineering,
    backendEngineering,
    systemDesign,
    researchStrength,
    careerGrowth,
    careerStability,
    skillDepth,
    skillBreadth,
    assessmentStrength,
    availability,
    recruiterInterest,
    responsiveness,
    profileQuality,
    jobFit
  };
}

module.exports = {
  computeDerivedSignals
};
