const { rankCandidates } = require('./rankingService');

/**
 * Computes SHAP feature contributions dynamically
 */
function getShapContributions(candidateId, weights) {
  // Rank the candidates to get the scores mapped against the active weights
  const ranked = rankCandidates('default_search', weights);
  const candidate = ranked.find(c => c.candidateId === candidateId || c.id === parseInt(candidateId));

  if (!candidate) return [];

  // Compute average subscores across the ranked pool
  const count = ranked.length;
  const avgSkills = ranked.reduce((sum, c) => sum + (c.skills || 0), 0) / count;
  const avgExp = ranked.reduce((sum, c) => sum + (c.experience || 0), 0) / count;
  const avgBehavior = ranked.reduce((sum, c) => sum + (c.behavior || 0), 0) / count;
  const avgQuality = ranked.reduce((sum, c) => sum + (c.activity || 0), 0) / count;

  // Read current category weights (matching default coefficients if undefined)
  const w = {
    skills: weights?.skills ?? 40,
    experience: weights?.experience ?? 30,
    behavior: weights?.behavior ?? 20,
    hidden_talent: weights?.hidden_talent ?? 10
  };

  // Compute SHAP deviations scaled by weights
  const skillsContribution = Math.round((candidate.skills - avgSkills) * (w.skills / 100));
  const expContribution = Math.round((candidate.experience - avgExp) * (w.experience / 100));
  const behaviorContribution = Math.round((candidate.behavior - avgBehavior) * (w.behavior / 100));
  const qualityContribution = Math.round((candidate.activity - avgQuality) * (w.hidden_talent / 100));

  return [
    { name: 'Core Skills', value: skillsContribution, fill: '#10b981' },
    { name: 'Domain Experience', value: expContribution, fill: '#f59e0b' },
    { name: 'Behavior & Availability', value: behaviorContribution, fill: '#3b82f6' },
    { name: 'Hidden Talent & Quality', value: qualityContribution, fill: '#8b5cf6' }
  ];
}

module.exports = {
  getShapContributions
};
