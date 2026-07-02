/**
 * Embedded Inventory Data
 * 
 * This module contains all dataset metadata from the inventory/ folder,
 * converted from CSV to JS objects for direct frontend consumption.
 * 
 * Sources:
 *   - inventory/dataset_statistics.csv
 *   - inventory/assessment_inventory.csv
 *   - inventory/skill_inventory.csv
 *   - inventory/feature_inventory.csv
 */

// ─── Dataset Statistics ──────────────────────────────────────────
export const datasetStatistics = {
  candidate_count: 100000,
  total_skill_records: 960302,
  total_career_records: 300171,
  total_education_records: 139778
};

// ─── Assessment Inventory ────────────────────────────────────────
// Skills with the number of candidates who have been assessed in that skill
export const assessmentInventory = [
  { skill: "YOLO", count: 1195 },
  { skill: "CNN", count: 1174 },
  { skill: "Feature Engineering", count: 1174 },
  { skill: "Weights & Biases", count: 1173 },
  { skill: "Forecasting", count: 1167 },
  { skill: "MLOps", count: 1159 },
  { skill: "Speech Recognition", count: 1159 },
  { skill: "BentoML", count: 1157 },
  { skill: "OpenCV", count: 1155 },
  { skill: "Data Science", count: 1147 },
  { skill: "Object Detection", count: 1145 },
  { skill: "TTS", count: 1140 },
  { skill: "Diffusion Models", count: 1133 },
  { skill: "ASR", count: 1124 },
  { skill: "Reinforcement Learning", count: 1124 },
  { skill: "GANs", count: 1122 },
  { skill: "Image Classification", count: 1120 },
  { skill: "Time Series", count: 1111 },
  { skill: "Computer Vision", count: 1111 },
  { skill: "Kubeflow", count: 1105 },
  { skill: "Statistical Modeling", count: 1088 },
  { skill: "MLflow", count: 1085 },
  { skill: "Information Retrieval", count: 343 },
  { skill: "PEFT", count: 341 },
  { skill: "pgvector", count: 340 },
  { skill: "PyTorch", count: 340 },
  { skill: "Milvus", count: 340 },
  { skill: "Qdrant", count: 336 },
  { skill: "Machine Learning", count: 335 },
  { skill: "QLoRA", count: 329 },
  { skill: "Sentence Transformers", count: 328 },
  { skill: "Learning to Rank", count: 327 },
  { skill: "Embeddings", count: 327 },
  { skill: "RAG", count: 326 },
  { skill: "Vector Search", count: 326 },
  { skill: "TensorFlow", count: 326 },
  { skill: "Pinecone", count: 325 },
  { skill: "Recommendation Systems", count: 325 },
  { skill: "LLMs", count: 323 },
  { skill: "Weaviate", count: 321 },
  { skill: "LoRA", count: 320 },
  { skill: "OpenSearch", count: 319 },
  { skill: "Hugging Face Transformers", count: 319 },
  { skill: "scikit-learn", count: 317 },
  { skill: "Haystack", count: 314 },
  { skill: "Python", count: 312 },
  { skill: "Prompt Engineering", count: 312 },
  { skill: "BM25", count: 309 },
  { skill: "NLP", count: 306 },
  { skill: "FAISS", count: 303 },
  { skill: "Semantic Search", count: 301 },
  { skill: "LangChain", count: 295 },
  { skill: "LlamaIndex", count: 291 },
  { skill: "Elasticsearch", count: 285 },
  { skill: "Deep Learning", count: 284 },
  { skill: "Fine-tuning LLMs", count: 282 }
];

// ─── Skill Inventory ─────────────────────────────────────────────
// All skills across the candidate pool with total candidate count
export const skillInventory = [
  { skill: "HTML", count: 12246 },
  { skill: "Databricks", count: 12244 },
  { skill: "Redux", count: 12222 },
  { skill: "Terraform", count: 12187 },
  { skill: "Angular", count: 12173 },
  { skill: "Salesforce CRM", count: 12157 },
  { skill: "Figma", count: 12157 },
  { skill: "Vue.js", count: 12142 },
  { skill: "Sales", count: 12138 },
  { skill: "Accounting", count: 12136 },
  { skill: "Agile", count: 12135 },
  { skill: "Kafka", count: 12114 },
  { skill: "Excel", count: 12109 },
  { skill: "BigQuery", count: 12108 },
  { skill: "CI/CD", count: 12108 },
  { skill: "Project Management", count: 12106 },
  { skill: "Airflow", count: 12105 },
  { skill: "Flask", count: 12104 },
  { skill: "AWS", count: 12104 },
  { skill: "Scrum", count: 12083 },
  { skill: "Illustrator", count: 12072 },
  { skill: "Kubernetes", count: 12071 },
  { skill: "ETL", count: 12068 },
  { skill: "CSS", count: 12065 },
  { skill: "Docker", count: 12062 },
  { skill: "Next.js", count: 12058 },
  { skill: "Apache Beam", count: 12054 },
  { skill: "Go", count: 12049 },
  { skill: "Java", count: 12049 },
  { skill: "TypeScript", count: 12048 },
  { skill: "JavaScript", count: 12047 },
  { skill: "dbt", count: 12046 },
  { skill: "REST APIs", count: 12040 },
  { skill: "Spark", count: 12038 },
  { skill: "Marketing", count: 12037 },
  { skill: "Tally", count: 12030 },
  { skill: "Snowflake", count: 12027 },
  { skill: "GraphQL", count: 12027 },
  { skill: "Webpack", count: 12026 },
  { skill: "Six Sigma", count: 11991 },
  { skill: "SEO", count: 11990 },
  { skill: "SAP", count: 11989 },
  { skill: "GCP", count: 11983 },
  { skill: "PostgreSQL", count: 11983 },
  { skill: "Rust", count: 11960 },
  { skill: "Apache Flink", count: 11958 },
  { skill: "gRPC", count: 11957 },
  { skill: "Content Writing", count: 11948 },
  { skill: "SQL", count: 11935 },
  { skill: "Hadoop", count: 11931 },
  { skill: "Redis", count: 11928 },
  { skill: "Tailwind", count: 11917 },
  { skill: "Photoshop", count: 11917 },
  { skill: "FastAPI", count: 11917 },
  { skill: "Microservices", count: 11909 },
  { skill: "PowerPoint", count: 11908 },
  { skill: "Spring Boot", count: 11906 },
  { skill: "Data Pipelines", count: 11905 },
  { skill: "Django", count: 11899 },
  { skill: "MongoDB", count: 11841 },
  { skill: "Node.js", count: 11838 },
  { skill: "Azure", count: 11828 },
  { skill: "React", count: 11811 },
  { skill: "Hugging Face Transformers", count: 5163 },
  { skill: "LangChain", count: 5162 },
  { skill: "Information Retrieval", count: 5135 },
  { skill: "LLMs", count: 5094 },
  { skill: "Recommendation Systems", count: 5091 },
  { skill: "Semantic Search", count: 5087 },
  { skill: "Sentence Transformers", count: 5081 },
  { skill: "Embeddings", count: 5080 },
  { skill: "Vector Search", count: 5065 },
  { skill: "Pinecone", count: 5062 },
  { skill: "Prompt Engineering", count: 5062 },
  { skill: "FAISS", count: 5052 },
  { skill: "RAG", count: 4995 },
  { skill: "Fine-tuning LLMs", count: 4920 },
  { skill: "YOLO", count: 4827 },
  { skill: "GANs", count: 4815 },
  { skill: "Feature Engineering", count: 4809 },
  { skill: "OpenCV", count: 4803 },
  { skill: "ASR", count: 4788 },
  { skill: "Image Classification", count: 4761 },
  { skill: "Computer Vision", count: 4755 },
  { skill: "Speech Recognition", count: 4744 },
  { skill: "CNN", count: 4740 },
  { skill: "Kubeflow", count: 4730 },
  { skill: "MLOps", count: 4727 },
  { skill: "BentoML", count: 4726 },
  { skill: "Reinforcement Learning", count: 4708 },
  { skill: "Data Science", count: 4708 },
  { skill: "Object Detection", count: 4705 },
  { skill: "Diffusion Models", count: 4701 },
  { skill: "MLflow", count: 4691 },
  { skill: "Time Series", count: 4686 },
  { skill: "Weights & Biases", count: 4685 },
  { skill: "Forecasting", count: 4676 },
  { skill: "TTS", count: 4669 },
  { skill: "Statistical Modeling", count: 4634 },
  { skill: "QLoRA", count: 1401 },
  { skill: "pgvector", count: 1394 },
  { skill: "Weaviate", count: 1389 },
  { skill: "Milvus", count: 1384 },
  { skill: "Learning to Rank", count: 1383 },
  { skill: "BM25", count: 1382 },
  { skill: "TensorFlow", count: 1381 },
  { skill: "Qdrant", count: 1379 },
  { skill: "Python", count: 1378 },
  { skill: "PyTorch", count: 1378 },
  { skill: "PEFT", count: 1377 },
  { skill: "LoRA", count: 1371 },
  { skill: "NLP", count: 1358 },
  { skill: "Machine Learning", count: 1349 },
  { skill: "Deep Learning", count: 1342 },
  { skill: "Haystack", count: 1333 },
  { skill: "Elasticsearch", count: 1311 },
  { skill: "LlamaIndex", count: 1308 },
  { skill: "scikit-learn", count: 1288 },
  { skill: "OpenSearch", count: 1286 }
];

// ─── Feature Inventory ───────────────────────────────────────────
// Describes the schema of the candidate data (field names, types, counts)
export const featureInventory = [
  { field: "candidate_id", type: "str", count: 5001 },
  { field: "career_history", type: "array", count: 5001 },
  { field: "career_history[].company", type: "str", count: 5001 },
  { field: "career_history[].company_size", type: "str", count: 5001 },
  { field: "career_history[].description", type: "str", count: 5001 },
  { field: "career_history[].duration_months", type: "int", count: 5001 },
  { field: "career_history[].industry", type: "str", count: 5001 },
  { field: "career_history[].is_current", type: "bool", count: 5001 },
  { field: "career_history[].start_date", type: "str", count: 5001 },
  { field: "career_history[].title", type: "str", count: 5001 },
  { field: "certifications", type: "array", count: 5001 },
  { field: "certifications[].issuer", type: "str", count: 1227 },
  { field: "certifications[].name", type: "str", count: 1227 },
  { field: "certifications[].year", type: "int", count: 1227 },
  { field: "education", type: "array", count: 5001 },
  { field: "education[].degree", type: "str", count: 5001 },
  { field: "education[].field_of_study", type: "str", count: 5001 },
  { field: "education[].institution", type: "str", count: 5001 },
  { field: "education[].tier", type: "str", count: 5001 },
  { field: "languages", type: "array", count: 5001 },
  { field: "profile", type: "object", count: 5001 },
  { field: "profile.country", type: "str", count: 5001 },
  { field: "profile.current_company", type: "str", count: 5001 },
  { field: "profile.current_title", type: "str", count: 5001 },
  { field: "profile.headline", type: "str", count: 5001 },
  { field: "profile.location", type: "str", count: 5001 },
  { field: "profile.summary", type: "str", count: 5001 },
  { field: "profile.years_of_experience", type: "float", count: 5001 },
  { field: "redrob_signals", type: "object", count: 5001 },
  { field: "redrob_signals.github_activity_score", type: "float", count: 5001 },
  { field: "redrob_signals.notice_period_days", type: "int", count: 5001 },
  { field: "redrob_signals.open_to_work_flag", type: "bool", count: 5001 },
  { field: "redrob_signals.preferred_work_mode", type: "str", count: 5001 },
  { field: "redrob_signals.profile_completeness_score", type: "float", count: 5001 },
  { field: "redrob_signals.skill_assessment_scores", type: "object", count: 5001 },
  { field: "redrob_signals.verified_email", type: "bool", count: 5001 },
  { field: "redrob_signals.willing_to_relocate", type: "bool", count: 5001 },
  { field: "skills", type: "array", count: 5001 },
  { field: "skills[].duration_months", type: "int", count: 5001 },
  { field: "skills[].endorsements", type: "int", count: 5001 },
  { field: "skills[].name", type: "str", count: 5001 },
  { field: "skills[].proficiency", type: "str", count: 5001 }
];

// ─── Derived Helpers ─────────────────────────────────────────────

/** Top 20 assessment skills sorted by candidate coverage */
export const topAssessmentSkills = assessmentInventory.slice(0, 20);

/** AI/ML specific skills from the skill inventory (count < 6000 = specialized) */
export const aiMlSkills = skillInventory.filter(s => s.count < 6000);

/** General/mainstream skills (count >= 6000 = widely held) */
export const generalSkills = skillInventory.filter(s => s.count >= 6000);

/** Skill categories for grouping */
export const skillCategories = {
  'GenAI & LLMs': ['LLMs', 'RAG', 'LangChain', 'LlamaIndex', 'Prompt Engineering', 'Fine-tuning LLMs', 'LoRA', 'QLoRA', 'PEFT', 'Hugging Face Transformers'],
  'Vector & Search': ['FAISS', 'Pinecone', 'Qdrant', 'Milvus', 'Weaviate', 'pgvector', 'Elasticsearch', 'OpenSearch', 'Vector Search', 'Semantic Search', 'BM25', 'Haystack', 'Embeddings', 'Sentence Transformers'],
  'Computer Vision': ['OpenCV', 'YOLO', 'CNN', 'Image Classification', 'Object Detection', 'GANs', 'Diffusion Models', 'Computer Vision'],
  'ML Engineering': ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'Deep Learning', 'Machine Learning', 'NLP', 'Data Science', 'Feature Engineering', 'MLOps', 'MLflow', 'Kubeflow', 'BentoML', 'Weights & Biases'],
  'Speech & Audio': ['ASR', 'TTS', 'Speech Recognition'],
  'Cloud & DevOps': ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
  'Data Engineering': ['Spark', 'Kafka', 'Airflow', 'Hadoop', 'Snowflake', 'BigQuery', 'ETL', 'Data Pipelines', 'dbt', 'Apache Beam', 'Apache Flink', 'Databricks'],
  'Web Development': ['React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Redux', 'GraphQL', 'REST APIs', 'FastAPI', 'Django', 'Flask', 'Spring Boot']
};

/** Get the category for a given skill name */
export function getSkillCategory(skillName) {
  for (const [category, skills] of Object.entries(skillCategories)) {
    if (skills.includes(skillName)) return category;
  }
  return 'Other';
}

/** Get aggregated counts per skill category from the skill inventory */
export function getCategoryBreakdown() {
  const breakdown = {};
  for (const [category, skills] of Object.entries(skillCategories)) {
    const matches = skillInventory.filter(s => skills.includes(s.skill));
    const totalCount = matches.reduce((sum, s) => sum + s.count, 0);
    const avgCount = matches.length > 0 ? Math.round(totalCount / matches.length) : 0;
    breakdown[category] = { totalCount, avgCount, skillCount: matches.length };
  }
  return breakdown;
}
