import rawCandidates from './sample_candidates.json';

export const candidates = rawCandidates.map((cand, index) => {
  const profile = cand.profile || {};
  const signals = cand.redrob_signals || {};
  const skillsList = cand.skills || [];

  // Calculate some dummy scores based on the actual data
  const skillsScore = Math.min(100, Math.round(50 + skillsList.length * 3));
  const expScore = Math.min(100, Math.round(profile.years_of_experience * 10));
  const behaviorScore = Math.min(100, Math.round(70 + (signals.recruiter_response_rate || 0) * 30));
  const activityScore = Math.min(100, Math.round(50 + (signals.applications_submitted_30d || 0) * 5 + (signals.profile_views_received_30d || 0)));
  const hiddenTalentScore = signals.github_activity_score > 0 ? signals.github_activity_score : 50;
  
  const hiddenFactors = [];
  if (signals.github_activity_score > 70) hiddenFactors.push('High GitHub Activity');
  if (signals.interview_completion_rate > 0.8) hiddenFactors.push('Excellent Interview Completion Rate');
  if (skillsList.some(s => s.proficiency === 'expert')) hiddenFactors.push('Expert in specific skills');

  return {
    id: cand.candidate_id,
    name: profile.anonymized_name || `Candidate ${index + 1}`,
    role: `${profile.current_title || 'Professional'} at ${profile.current_company || 'Unknown'}`,
    exp: `${profile.years_of_experience || 0} Yrs`,
    loc: profile.location || 'Unknown',
    score: Math.round((skillsScore * 0.4) + (expScore * 0.3) + (behaviorScore * 0.2) + (hiddenTalentScore * 0.1)), // Initial base score
    skills: skillsScore,
    experience: expScore,
    behavior: behaviorScore,
    activity: activityScore,
    avatar: `https://i.pravatar.cc/150?u=${cand.candidate_id}`,
    hidden_talent_score: hiddenTalentScore,
    hidden_talent_factors: hiddenFactors,
    background_tags: { company: profile.current_industry || 'Unknown' },
    // Keeping raw data just in case components need it later
    _raw: cand
  };
});
