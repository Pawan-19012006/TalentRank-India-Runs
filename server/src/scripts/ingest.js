const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { computeDerivedSignals } = require('../services/intelligence');

const DATASET_PATH = path.join(__dirname, '../../../../Dataset/candidates.jsonl');
const OUTPUT_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'candidates_dossier.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate an avatar based on candidate numeric string
function getAvatarUrl(candidateId) {
  const numeric = parseInt(candidateId.replace(/\D/g, '')) || 1;
  const imgNum = (numeric % 70) + 1;
  return `https://i.pravatar.cc/150?img=${imgNum}`;
}

// Map dates to clean ranges
function getTimelineYear(job) {
  const start = job.start_date ? new Date(job.start_date).getFullYear() : '2023';
  if (job.is_current) {
    return `${start} - Present`;
  }
  const end = job.end_date ? new Date(job.end_date).getFullYear() : '2024';
  return `${start} - ${end}`;
}

// Generate custom red flags
function deriveRedFlags(raw) {
  const flags = [];
  const signals = raw.redrob_signals || {};
  
  if (signals.avg_response_time_hours > 48) {
    flags.push(`Slow responsiveness: Average response latency is ${Math.round(signals.avg_response_time_hours)} hours.`);
  }
  
  if (signals.interview_completion_rate < 0.6) {
    flags.push(`Low interview completion rate (${Math.round(signals.interview_completion_rate * 100)}%).`);
  }

  const shortHops = raw.career_history?.filter(j => j.duration_months > 0 && j.duration_months < 12).length || 0;
  if (shortHops >= 2) {
    flags.push(`Frequent job shifts: ${shortHops} positions held for less than 1 year.`);
  }

  return flags;
}

// Generate bespoke interview questions based on candidate weaknesses
function deriveInterviewQuestions(raw, signals) {
  const questions = [];
  
  if (signals.genaiExpertise < 65) {
    questions.push({
      question: "Could you walk us through how you would set up a LangChain or LlamaIndex pipeline for custom PDF document query?",
      reason: "JD requires AI engineering capabilities; candidate's GenAI assessment indicates a need to validate practical pipeline engineering skills."
    });
  }

  if (signals.careerStability < 60) {
    questions.push({
      question: "What values do you search for in a company's culture to commit for the long-term, and what drives you to make job changes?",
      reason: "Candidate has historical brief tenures; evaluates commitment alignment."
    });
  }

  if (signals.systemDesign < 60) {
    questions.push({
      question: "Describe a system architecture you designed that had to scale to thousands of users. How did you resolve system bottlenecks?",
      reason: "Evaluating candidate's architectural scaling competencies."
    });
  }

  // Fallback default question
  if (questions.length < 2) {
    questions.push({
      question: "How do you approach learning and evaluating a brand new library or framework (like BentoML or pgvector) when a project requires it?",
      reason: "Validates learning velocity and adaptability to new tooling."
    });
  }

  return questions;
}

// Parse line-by-line using Node's readline stream
async function runIngestion(limit = 5000) {
  console.log(`Starting ingestion pipeline from: ${DATASET_PATH}`);
  if (!fs.existsSync(DATASET_PATH)) {
    console.error(`Dataset not found at: ${DATASET_PATH}. Please make sure Dataset is available in parent workspace directory.`);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(DATASET_PATH);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const dossierList = [];
  let count = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    
    try {
      const raw = JSON.parse(line);
      const id = raw.candidate_id || `cand_${count}`;
      
      // Calculate intelligence derived signals
      const signals = computeDerivedSignals(raw);
      
      // Map raw experience history to timeline cards
      const historyTimeline = (raw.career_history || [])
        .map(job => ({
          year: getTimelineYear(job),
          role: job.title || 'Software Engineer',
          company: job.company || 'Technology Company',
          desc: job.description || '',
          durationMonths: job.duration_months || 0
        }));

      // Generate red flags and questions
      const redFlags = deriveRedFlags(raw);
      const interviewQuestions = deriveInterviewQuestions(raw, signals);

      // Create final dossier payload matching schema
      const dossier = {
        candidateId: id,
        id: count + 1, // numeric id fallback for frontend matching
        name: raw.profile?.anonymized_name || `Candidate ${id.substring(0, 6)}`,
        avatar: getAvatarUrl(id),
        role: raw.profile?.current_title || 'AI Specialist',
        company: raw.profile?.current_company || 'Independent Contractor',
        location: raw.profile?.location || 'India',
        yearsOfExperience: raw.profile?.years_of_experience || 0,
        expectedSalary: raw.redrob_signals?.expected_salary_range_inr_lpa 
          ? `₹${raw.redrob_signals.expected_salary_range_inr_lpa.min}LPA - ₹${raw.redrob_signals.expected_salary_range_inr_lpa.max}LPA` 
          : '₹22LPA - ₹30LPA',
        noticePeriod: raw.redrob_signals?.notice_period_days 
          ? `${raw.redrob_signals.notice_period_days} Days` 
          : '30 Days',
        headline: raw.profile?.headline || '',
        summary: raw.profile?.summary || '',
        
        skills: (raw.skills || []).map(s => ({
          name: s.name,
          durationMonths: s.duration_months || 0,
          endorsements: s.endorsements || 0,
          proficiency: s.proficiency || 'Intermediate'
        })),
        
        experienceTimeline: historyTimeline,
        derivedSignals: signals,
        redFlags,
        interviewQuestions
      };

      dossierList.push(dossier);
      count++;

      if (count % 1000 === 0) {
        console.log(`Processed ${count} candidates...`);
      }

      if (count >= limit) {
        break;
      }
    } catch (err) {
      console.error(`Error parsing candidate entry at count ${count}:`, err.message);
    }
  }

  // Close read interface
  rl.close();

  // Save the pre-calculated dossiers list
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dossierList, null, 2));
  console.log(`Successfully ingested and computed ${dossierList.length} candidate dossiers.`);
  console.log(`Dossier cache file saved at: ${OUTPUT_FILE}`);
}

// Execute Ingestion
runIngestion(5000);
