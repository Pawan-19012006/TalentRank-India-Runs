const API_BASE = 'http://localhost:5001/api/v1';

export const rankingService = {
  async getRankings(searchId, weights = {}) {
    try {
      const res = await fetch(`${API_BASE}/rankings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchId, weights })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn(`rankingService.getRankings failed for searchId ${searchId}. Returning fallback empty state.`, err.message);
      return [];
    }
  }
};
