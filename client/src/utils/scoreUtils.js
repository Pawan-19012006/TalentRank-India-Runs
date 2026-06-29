export const recalculateWeights = (actionLog, candidatePool, currentWeights) => {
  if (actionLog.length < 5) return currentWeights;

  const recentActions = actionLog.slice(-5);
  let biasScore = 0;

  recentActions.forEach(action => {
    const candidate = candidatePool.find(c => c.id === action.candidateId);
    if (!candidate) return;

    if (action.type === 'REJECT' && candidate.hidden_talent_score >= 70) {
      biasScore += 1;
    }
    if (action.type === 'SHORTLIST' && candidate.hidden_talent_score < 70) {
      biasScore += 1;
    }
  });

  if (biasScore >= 3) {
    // Tweak weights to favor hidden talent
    return {
      ...currentWeights,
      hidden_talent: Math.min(100, currentWeights.hidden_talent + 15),
      skills: Math.max(0, currentWeights.skills - 10),
      experience: Math.max(0, currentWeights.experience - 5)
    };
  }

  return currentWeights;
};

export const detectBiasPattern = (actionLog, candidatePool) => {
  if (actionLog.length < 4) return null; // We need at least 3 shortlists and 1 reject

  const recentActions = actionLog.slice(-6);
  
  const shortlists = recentActions.filter(a => a.type === 'SHORTLIST').map(a => candidatePool.find(c => c.id === a.candidateId)).filter(Boolean);
  const rejects = recentActions.filter(a => a.type === 'REJECT').map(a => candidatePool.find(c => c.id === a.candidateId)).filter(Boolean);

  if (shortlists.length >= 3) {
    // Check if 3+ share same company tag
    const companyCounts = {};
    let dominantCompany = null;
    
    shortlists.forEach(c => {
      const company = c.background_tags?.company;
      if (company) {
        companyCounts[company] = (companyCounts[company] || 0) + 1;
        if (companyCounts[company] >= 3) {
          dominantCompany = company;
        }
      }
    });

    if (dominantCompany) {
      // Check if a high hidden talent candidate from different background was rejected
      const overlookedCandidate = rejects.find(c => 
        c.hidden_talent_score >= 70 && 
        c.background_tags?.company !== dominantCompany
      );

      if (overlookedCandidate) {
        return {
          type: 'HOMOGENEOUS_BACKGROUND',
          message: `You've shortlisted 3+ candidates from "${dominantCompany}". You might be overlooking non-traditional talent with high potential.`,
          overlookedCandidates: [overlookedCandidate]
        };
      }
    }
  }

  return null;
};
