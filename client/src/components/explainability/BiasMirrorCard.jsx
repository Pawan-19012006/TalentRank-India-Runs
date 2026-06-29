import React from 'react';
import { AlertTriangle, Users, X } from 'lucide-react';
import { useRanking } from '../../store/rankingStore';

const BiasMirrorCard = () => {
  const { biasAlert, dismissBiasAlert, enableShowOverlooked } = useRanking();

  if (!biasAlert) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="mt-1">
        <AlertTriangle className="text-orange-500" size={24} />
      </div>
      <div className="flex-1">
        <h3 className="text-orange-800 font-bold mb-1 flex items-center gap-2">
          Potential Bias Detected
        </h3>
        <p className="text-orange-700 text-sm mb-3">
          {biasAlert.message}
        </p>
        <div className="flex gap-3">
          <button 
            onClick={enableShowOverlooked}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Users size={16} /> Show Overlooked Candidates
          </button>
          <button 
            onClick={dismissBiasAlert}
            className="text-orange-700 hover:bg-orange-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
      <button 
        onClick={dismissBiasAlert}
        className="text-orange-400 hover:text-orange-600"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default BiasMirrorCard;
