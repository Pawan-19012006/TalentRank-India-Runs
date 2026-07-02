const API_BASE = 'http://localhost:5001/api/v1';

export const searchService = {
  async createSearch(searchData) {
    try {
      const res = await fetch(`${API_BASE}/searches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || null;
    } catch (err) {
      console.warn('searchService.createSearch failed. Returning fallback null.', err.message);
      return null;
    }
  },

  async getJobUnderstanding(searchId) {
    try {
      const res = await fetch(`${API_BASE}/searches/${searchId}/job-understanding`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || null;
    } catch (err) {
      console.warn(`searchService.getJobUnderstanding failed for searchId ${searchId}. Returning fallback null.`, err.message);
      return null;
    }
  }
};
