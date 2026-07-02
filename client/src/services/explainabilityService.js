const API_BASE = 'http://localhost:5001/api/v1';

export const explainabilityService = {
  async getShapContributions(candidateId, searchId = 'default') {
    try {
      const res = await fetch(`${API_BASE}/explainability/shap/${candidateId}?searchId=${searchId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn(`explainabilityService.getShapContributions failed for id ${candidateId}. Returning fallback empty state.`, err.message);
      return [];
    }
  }
};
