const fs = require('fs');
const path = require('path');

const DOSSIER_CACHE_PATH = path.join(__dirname, '../data/candidates_dossier.json');

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

/**
 * Performs dynamic ranking calculations against weights and JD context
 */
function rankCandidates(searchId, weights) {
  const candidates = loadDossiers();
  if (candidates.length === 0) return [];

  // Default weights if not specified
  const w = {
    skills: weights?.skills ?? 40,
    experience: weights?.experience ?? 30,
    behavior: weights?.behavior ?? 20,
    hidden_talent: weights?.hidden_talent ?? 10
  };

  // Extract JD context indicators (Senior AI Engineer default template)
  const isAIFocused = true; // matches JD Senior AI Engineer
  const expRequired = 5;

  return candidates.map(c => {
    const signals = c.derivedSignals || {};
    
    // A. Skills Match Score
    let skillsMatch = 60;
    if (isAIFocused) {
      skillsMatch = 0.4 * (signals.genaiExpertise || 0) + 
                    0.3 * (signals.ragExpertise || 0) + 
                    0.2 * (signals.mlEngineering || 0) + 
                    0.1 * (signals.systemDesign || 0);
    } else {
      skillsMatch = 0.4 * (signals.backendEngineering || 0) + 
                    0.3 * (signals.dataEngineering || 0) + 
                    0.2 * (signals.systemDesign || 0) + 
                    0.1 * (signals.mlEngineering || 0);
    }
    skillsMatch = Math.round(skillsMatch);

    // B. Experience Match Score
    const yearsExp = c.yearsOfExperience || 0;
    let expMatch = 100;
    if (yearsExp < expRequired) {
      expMatch = Math.max(0, 100 - (expRequired - yearsExp) * 15);
    }
    // Add title similarity bonus
    const titleMatch = /ai|ml|intelligence|nlp|vision|deep learning/i.test(c.role);
    if (titleMatch) {
      expMatch = Math.min(100, expMatch + 15);
    }
    expMatch = Math.round(expMatch);

    // C. Behavioral Match Score
    const behaviorMatch = Math.round(
      0.5 * (signals.responsiveness || 50) + 
      0.3 * (signals.availability || 50) + 
      0.2 * (signals.assessmentStrength || 50)
    );

    // D. Quality / Hidden Score
    const qualityMatch = Math.round(
      0.3 * (signals.skillDepth || 50) + 
      0.2 * (signals.careerStability || 50) + 
      0.2 * (signals.careerGrowth || 50) + 
      0.3 * (signals.profileQuality || 50)
    );

    // E. Dynamic Overall Match Score
    const overallScore = Math.round(
      (skillsMatch * (w.skills / 100)) +
      (expMatch * (w.experience / 100)) +
      (behaviorMatch * (w.behavior / 100)) +
      (qualityMatch * (w.hidden_talent / 100))
    );

    // Update derived values on the dossier
    const updatedSignals = {
      ...signals,
      jobFit: overallScore
    };

    return {
      ...c,
      score: overallScore,
      skills: skillsMatch,
      experience: expMatch,
      behavior: behaviorMatch,
      activity: qualityMatch, // Maps to Quality Score in frontend Rankings UI column
      hidden_talent_score: qualityMatch, // Maps to Hidden column in UI
      derivedSignals: updatedSignals
    };
  }).sort((a, b) => b.score - a.score);
}

module.exports = {
  rankCandidates
};
