# Code-Level Implementation Audit

This document details the current, active implementation status of all frontend components, services, and backend endpoints within the TalentRank AI platform.

---

## Screen-by-Screen Audit

### 1. Dashboard
*   **Frontend Component**: `Dashboard.jsx`
*   **Service Called**: `analyticsService.getDashboardStats`
*   **Backend Endpoint Called**: `GET /api/v1/analytics/dashboard`
*   **Endpoint Exists**: Yes.
*   **Returns Real Dossier Data**: Yes (computes `totalCandidates` dynamically and derives channel percentages from candidate skill columns).
*   **Returns Mock/Synthetic Data**: Partial (active pipeline status array and flow timeline values are mock structures).
*   **Endpoint Throws Errors**: No.
*   **Endpoint is Unused**: No.
*   **404s / Broken Routes**: No.

### 2. Create Search
*   **Frontend Component**: `CreateSearch.jsx`
*   **Service Called**: `searchService.createSearch`
*   **Backend Endpoint Called**: `POST /api/v1/searches`
*   **Endpoint Exists**: Yes.
*   **Returns Real Dossier Data**: N/A.
*   **Returns Mock/Synthetic Data**: Yes (returns a registered search session model).
*   **Endpoint Throws Errors**: No.
*   **Endpoint is Unused**: No.
*   **404s / Broken Routes**: No.

### 3. Job Understanding
*   **Frontend Component**: `JobUnderstanding.jsx`
*   **Service Called**: `searchService.getJobUnderstanding`
*   **Backend Endpoint Called**: `GET /api/v1/searches/:searchId/job-understanding`
*   **Endpoint Exists**: Yes.
*   **Returns Real Dossier Data**: No.
*   **Returns Mock/Synthetic Data**: Yes (returns hardcoded breakdown and implicit signals).
*   **Endpoint Throws Errors**: No.
*   **Endpoint is Unused**: No.
*   **404s / Broken Routes**: No.

### 4. AI Rankings
*   **Frontend Component**: `Rankings.jsx` (connected through `useRanking()` context state).
*   **Service Called**: `rankingService.getRankings`
*   **Backend Endpoint Called**: `POST /api/v1/rankings`
*   **Endpoint Exists**: Yes.
*   **Returns Real Dossier Data**: Yes (computes match scores dynamically and sorts the 5,000 candidate records based on the active weights).
*   **Returns Mock/Synthetic Data**: No.
*   **Endpoint Throws Errors**: No.
*   **Endpoint is Unused**: No.
*   **404s / Broken Routes**: No.

### 5. Compare Candidates
*   **Frontend Component**: `CompareCandidates.jsx`
*   **Service Called**: None directly (maps selected IDs to context lists).
*   **Backend Endpoint Called**: None.
*   **Endpoint Exists**: N/A.
*   **Returns Real Dossier Data**: Yes (displays dynamic attributes of compared candidates).
*   **Returns Mock/Synthetic Data**: No.
*   **Endpoint Throws Errors**: No.
*   **Endpoint is Unused**: No.
*   **404s / Broken Routes**: No.

### 6. Talent Graph
*   **Frontend Component**: `TalentGraph.jsx`
*   **Service Called**: `candidateService.getTalentGraph`
*   **Backend Endpoint Called**: `GET /api/v1/searches/:searchId/talent-graph`
*   **Endpoint Exists**: Yes.
*   **Returns Real Dossier Data**: Yes (draws candidate and skill connections dynamically based on top matches).
*   **Returns Mock/Synthetic Data**: No.
*   **Endpoint Throws Errors**: No.
*   **Endpoint is Unused**: No.
*   **404s / Broken Routes**: No.

### 7. Shortlist
*   **Frontend Component**: `Shortlist.jsx`
*   **Service Called**: `candidateService.getShortlist` (fetched inside `rankingStore.jsx`).
*   **Backend Endpoint Called**: `GET /api/v1/searches/:searchId/shortlist`
*   **Endpoint Exists**: Yes.
*   **Returns Real Dossier Data**: Yes (returns top matched candidates as default cards).
*   **Returns Mock/Synthetic Data**: No.
*   **Endpoint Throws Errors**: No.
*   **Endpoint is Unused**: No.
*   **404s / Broken Routes**: No.

### 8. Explainability
*   **Frontend Component**: `Explainability.jsx`
*   **Service Called**: `explainabilityService.getShapContributions`
*   **Backend Endpoint Called**: `GET /api/v1/explainability/shap/:candidateId`
*   **Endpoint Exists**: Yes.
*   **Returns Real Dossier Data**: Yes (calculates dynamic SHAP contributions from candidate sub-scores).
*   **Returns Mock/Synthetic Data**: No.
*   **Endpoint Throws Errors**: No.
*   **Endpoint is Unused**: No.
*   **404s / Broken Routes**: No.

### 9. Recruiter Copilot
*   **Frontend Component**: `Copilot.jsx`
*   **Service Called**: `copilotService.sendQuery`
*   **Backend Endpoint Called**: `POST /api/v1/copilot/query`
*   **Endpoint Exists**: Yes.
*   **Returns Real Dossier Data**: Yes (checks the candidate cache pool to answer questions about RAG, notice periods, or top matches).
*   **Returns Mock/Synthetic Data**: No.
*   **Endpoint Throws Errors**: No.
*   **Endpoint is Unused**: No.
*   **404s / Broken Routes**: No.

---

## Missing API Endpoints

*   None. All frontend service calls have mapped routes successfully registered on the Express router.

---

## Dead Code

### Unused Services
*   `candidateService.getCandidates` in `client/src/services/candidateService.js` (is defined but never invoked on any screen).

### Unused Routes
*   `GET /api/v1/candidates` in `server/src/routes/index.js` (registered in router, but not consumed by any component).

### Unused Dossier Fields
*   `c.company` (present in candidate dossier object, but the Candidate Profile screen displays the company through the first entry in `experienceTimeline` instead).
*   `c.expectedSalary` (present in candidate dossier, but Rankings screen has custom subscores instead of a salary display column).

### Unused Derived Signals
*   `researchStrength` and `systemDesign` are calculated under the Candidate Intelligence Layer but are not displayed in the frontend Candidate Profile layout.

---

## End-to-End Data Flow

| Page / Screen | UI $\rightarrow$ Service | Service $\rightarrow$ API Route | API Route $\rightarrow$ Service Layer | Dossier $\rightarrow$ Signals | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | ✅ Working | ✅ Working | ✅ Working | ✅ Working | ✅ Working |
| **Create Search** | ✅ Working | ✅ Working | ✅ Working | ✅ Working | ✅ Working |
| **Job Understanding**| ✅ Working | ✅ Working | ✅ Working | ✅ Working | ✅ Working |
| **AI Rankings** | ✅ Working | ✅ Working | ✅ Working | ✅ Working | ✅ Working |
| **Compare** | ✅ Working | ✅ Working | ✅ Working | ✅ Working | ✅ Working |
| **Talent Graph** | ✅ Working | ✅ Working | ✅ Working | ✅ Working | ✅ Working |
| **Shortlist** | ✅ Working | ✅ Working | ✅ Working | ✅ Working | ✅ Working |
| **Explainability** | ✅ Working | ✅ Working | ✅ Working | ✅ Working | ✅ Working |
| **Copilot** | ✅ Working | ✅ Working | ✅ Working | ✅ Working | ✅ Working |
