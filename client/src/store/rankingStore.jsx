import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { recalculateWeights, detectBiasPattern } from '../utils/scoreUtils';
import { rankingService } from '../services/rankingService';
import { candidateService } from '../services/candidateService';

const RankingContext = createContext();

export const useRanking = () => useContext(RankingContext);

export const RankingProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
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
      count: 0,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      cards: []
    },
    {
      id: 'interview',
      title: 'Interview',
      count: 0,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      cards: []
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

  const [actionLog, setActionLog] = useState([]);
  const [biasAlert, setBiasAlert] = useState(null);
  const [showOverlooked, setShowOverlooked] = useState(false);
  const [compareList, setCompareList] = useState([]);

  // Fetch rankings asynchronously from service layer
  const fetchRankings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await rankingService.getRankings('default_search', weightVector);
      setCandidates(data);
    } catch (err) {
      console.error('Failed to fetch candidate rankings from backend:', err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [weightVector]);

  // Fetch shortlist details on mount
  const fetchShortlist = useCallback(async () => {
    try {
      const data = await candidateService.getShortlist('default_search');
      if (data && Array.isArray(data)) {
        // If data is list of candidates, we can map to shortlisted column
        setShortlistColumns(prev => {
          const newCols = [...prev];
          newCols[0].cards = data.map(c => c.id);
          newCols[0].count = newCols[0].cards.length;
          return newCols;
        });
      } else if (data && data.columns) {
        setShortlistColumns(data.columns);
      }
    } catch (err) {
      console.error('Failed to fetch candidate shortlist from backend:', err);
    }
  }, []);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  useEffect(() => {
    fetchShortlist();
  }, [fetchShortlist]);

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
      
      // Dynamic logging rules
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
  }, [weightVector, biasAlert, candidates]);

  const dismissBiasAlert = () => setBiasAlert(null);
  const enableShowOverlooked = () => {
    setShowOverlooked(true);
    setBiasAlert(null);
  };
  const resetShowOverlooked = () => setShowOverlooked(false);

  return (
    <RankingContext.Provider value={{
      candidates,
      loading,
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
