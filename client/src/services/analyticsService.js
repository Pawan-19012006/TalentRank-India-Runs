const API_BASE = 'http://localhost:5001/api/v1';

export const analyticsService = {
  async getDashboardStats(searchId = 'all') {
    try {
      const res = await fetch(`${API_BASE}/analytics/dashboard?searchId=${searchId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || null;
    } catch (err) {
      console.warn('analyticsService.getDashboardStats failed. Returning fallback empty state.', err.message);
      return null;
    }
  }
};
