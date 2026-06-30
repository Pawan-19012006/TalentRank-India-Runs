import React, { createContext, useState, useContext, useCallback } from 'react';
import { candidates as initialCandidates } from '../data/mockData';
import { recalculateWeights, detectBiasPattern } from '../utils/scoreUtils';

const RankingContext = createContext();

export const useRanking = () => useContext(RankingContext);

export const RankingProvider = ({ children }) => {
  const [weightVector, setWeightVector] = useState({
    skills: 40,
    experience: 30,
    behavior: 20,
    hidden_talent: 10
  });

  const [shortlistColumns, setShortlistColumns] = useState([
    {
      id: 'shortlisted',
      title: 'Shortlisted',
      count: 3,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      cards: ['CAND_0000001', 'CAND_0000002', 'CAND_0000003'] // Storing candidate IDs
    },
    {
      id: 'interview',
      title: 'Interview',
      count: 2,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      cards: ['CAND_0000004', 'CAND_0000005']
    },
    {
      id: 'offer',
      title: 'Offer Extended',
      count: 0,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      cards: []
    },
    {
      id: 'hired',
      title: 'Hired',
      count: 0,
      color: 'bg-green-50 text-green-600 border-green-200',
      cards: []
    }
  ]);

  // Compute dynamic scores based on weights
  const candidates = React.useMemo(() => {
    return initialCandidates.map(c => {
      const computedScore = Math.round(
        (c.skills * (weightVector.skills / 100)) +
        (c.experience * (weightVector.experience / 100)) +
        (c.behavior * (weightVector.behavior / 100)) +
        ((c.hidden_talent_score || 0) * (weightVector.hidden_talent / 100))
      );
      return { ...c, score: computedScore };
    }).sort((a, b) => b.score - a.score); // Keep sorted by score
  }, [weightVector, initialCandidates]);
  const [actionLog, setActionLog] = useState([]);
  const [biasAlert, setBiasAlert] = useState(null);
  const [showOverlooked, setShowOverlooked] = useState(false);
  
  const [compareList, setCompareList] = useState([]);

  const addToCompare = useCallback((candidateId) => {
    setCompareList(prev => {
      if (prev.includes(candidateId)) return prev;
      return [...prev, candidateId].slice(-3); // Limit to 3 candidates
    });
  }, []);

  const removeFromCompare = useCallback((candidateId) => {
    setCompareList(prev => prev.filter(id => id !== candidateId));
  }, []);

  const moveCandidate = useCallback((candidateId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return;
    
    setShortlistColumns(prev => {
      const newCols = [...prev];
      const sourceCol = newCols.find(c => c.id === sourceColumnId);
      const targetCol = newCols.find(c => c.id === targetColumnId);
      
      if (!sourceCol || !targetCol) return prev;
      
      // Remove from source
      sourceCol.cards = sourceCol.cards.filter(id => id !== candidateId);
      sourceCol.count = sourceCol.cards.length;
      
      // Add to target
      if (!targetCol.cards.includes(candidateId)) {
        targetCol.cards.push(candidateId);
        targetCol.count = targetCol.cards.length;
      }
      
      return newCols;
    });
  }, []);

  const logAction = useCallback((candidateId, type) => {
    setActionLog(prevLog => {
      const newLog = [...prevLog, { candidateId, type, timestamp: Date.now() }];
      
      // Run AI logic on the new log
      const newWeights = recalculateWeights(newLog, candidates, weightVector);
      if (JSON.stringify(newWeights) !== JSON.stringify(weightVector)) {
        setWeightVector(newWeights);
      }

      const pattern = detectBiasPattern(newLog, candidates);
      if (pattern && !biasAlert) {
        setBiasAlert(pattern);
      }

      return newLog;
    });
  }, [weightVector, biasAlert]);

  const dismissBiasAlert = () => setBiasAlert(null);
  const enableShowOverlooked = () => {
    setShowOverlooked(true);
    setBiasAlert(null);
  };
  const resetShowOverlooked = () => setShowOverlooked(false);

  return (
    <RankingContext.Provider value={{
      candidates,
      shortlistColumns,
      setShortlistColumns,
      weightVector,
      setWeightVector,
      actionLog,
      logAction,
      biasAlert,
      dismissBiasAlert,
      showOverlooked,
      enableShowOverlooked,
      resetShowOverlooked,
      compareList,
      addToCompare,
      removeFromCompare,
      moveCandidate
    }}>
      {children}
    </RankingContext.Provider>
  );
};
