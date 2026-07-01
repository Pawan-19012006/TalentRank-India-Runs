const API_BASE = 'http://localhost:5001/api/v1';

export const copilotService = {
  async sendQuery(query, contextCandidates = []) {
    try {
      const res = await fetch(`${API_BASE}/copilot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, contextCandidates })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || { response: "I'm sorry, I couldn't connect to the copilot backend to answer your request." };
    } catch (err) {
      console.warn('copilotService.sendQuery failed. Returning fallback empty state.', err.message);
      return { response: "I'm sorry, I couldn't reach the copilot service right now. Please try again later." };
    }
  }
};
