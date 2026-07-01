const API_BASE = 'http://localhost:5001/api/v1';

export const candidateService = {
  async getCandidates(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/candidates?${queryParams}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('candidateService.getCandidates failed. Returning fallback empty state.', err.message);
      return [];
    }
  },

  async getCandidateById(id) {
    try {
      const res = await fetch(`${API_BASE}/candidates/${id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || null;
    } catch (err) {
      console.warn(`candidateService.getCandidateById failed for id ${id}. Returning fallback empty state.`, err.message);
      return null;
    }
  },

  async getShortlist(searchId) {
    try {
      const res = await fetch(`${API_BASE}/searches/${searchId}/shortlist`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn(`candidateService.getShortlist failed for searchId ${searchId}. Returning fallback empty state.`, err.message);
      return [];
    }
  },

  async getTalentGraph(searchId) {
    try {
      const res = await fetch(`${API_BASE}/searches/${searchId}/talent-graph`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || { nodes: [], links: [] };
    } catch (err) {
      console.warn(`candidateService.getTalentGraph failed for searchId ${searchId}. Returning fallback empty state.`, err.message);
      return { nodes: [], links: [] };
    }
  }
};
