export interface ICareerHistoryEntry {
  company: string;
  company_size: string;
  description: string;
  duration_months: number;
  end_date: string | null;
  industry: string;
  is_current: boolean;
  start_date: string;
  title: string;
}

export interface ICertification {
  issuer: string;
  name: string;
  year: number;
}

export interface IEducationEntry {
  degree: string;
  end_year: number;
  field_of_study: string;
  grade: string;
  institution: string;
  start_year: number;
  tier: string;
}

export interface ILanguageEntry {
  language: string;
  proficiency: string;
}

export interface ICandidateProfile {
  anonymized_name: string;
  country: string;
  current_company: string;
  current_company_size: string;
  current_industry: string;
  current_title: string;
  headline: string;
  location: string;
  summary: string;
  years_of_experience: number;
}

export interface ISkillAssessmentScores {
  ASR?: number;
  BM25?: number;
  BentoML?: number;
  CNN?: number;
  "Computer Vision"?: number;
  "Data Science"?: number;
  "Deep Learning"?: number;
  "Diffusion Models"?: number;
  Elasticsearch?: number;
  Embeddings?: number;
  FAISS?: number;
  "Feature Engineering"?: number;
  "Fine-tuning LLMs"?: number;
  Forecasting?: number;
  GANs?: number;
  Haystack?: number;
  "Hugging Face Transformers"?: number;
  "Image Classification"?: number;
  "Information Retrieval"?: number;
  Kubeflow?: number;
  LLMs?: number;
  LangChain?: number;
  "Learning to Rank"?: number;
  LlamaIndex?: number;
  LoRA?: number;
  MLOps?: number;
  MLflow?: number;
  "Machine Learning"?: number;
  Milvus?: number;
  NLP?: number;
  "Object Detection"?: number;
  OpenCV?: number;
  OpenSearch?: number;
  PEFT?: number;
  Pinecone?: number;
  "Prompt Engineering"?: number;
  PyTorch?: number;
  Python?: number;
  QLoRA?: number;
  Qdrant?: number;
  RAG?: number;
  "Recommendation Systems"?: number;
  "Reinforcement Learning"?: number;
  "Semantic Search"?: number;
  "Sentence Transformers"?: number;
  "Speech Recognition"?: number;
  "Statistical Modeling"?: number;
  TTS?: number;
  TensorFlow?: number;
  "Time Series"?: number;
  "Vector Search"?: number;
  Weaviate?: number;
  "Weights & Biases"?: number;
  YOLO?: number;
  pgvector?: number;
  "scikit-learn"?: number;
}

export interface IRedRobSignals {
  applications_submitted_30d: number;
  avg_response_time_hours: number;
  connection_count: number;
  endorsements_received: number;
  expected_salary_range_inr_lpa: {
    max: number;
    min: number;
  };
  github_activity_score: number;
  interview_completion_rate: number;
  last_active_date: string;
  linkedin_connected: boolean;
  notice_period_days: number;
  offer_acceptance_rate: number;
  open_to_work_flag: boolean;
  preferred_work_mode: string;
  profile_completeness_score: number;
  profile_views_received_30d: number;
  recruiter_response_rate: number;
  saved_by_recruiters_30d: number;
  search_appearance_30d: number;
  signup_date: string;
  skill_assessment_scores: ISkillAssessmentScores;
  verified_email: boolean;
  verified_phone: boolean;
  willing_to_relocate: boolean;
}

export interface ICandidateSkill {
  duration_months: number;
  endorsements: number;
  name: string;
  proficiency: string;
}

export interface IRawCandidate {
  candidate_id: string;
  career_history: ICareerHistoryEntry[];
  certifications: ICertification[];
  education: IEducationEntry[];
  languages: ILanguageEntry[];
  profile: ICandidateProfile;
  redrob_signals: IRedRobSignals;
  skills: ICandidateSkill[];
}
