import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import CreateSearch from '../pages/CreateSearch/CreateSearch';
import JobUnderstanding from '../pages/JobUnderstanding/JobUnderstanding';
import Rankings from '../pages/Rankings/Rankings';
import CandidateProfile from '../pages/CandidateProfile/CandidateProfile';
import CompareCandidates from '../pages/CompareCandidates/CompareCandidates';
import TalentGraph from '../pages/TalentGraph/TalentGraph';
import Shortlist from '../pages/Shortlist/Shortlist';
import Explainability from '../pages/Explainability/Explainability';
import Copilot from '../pages/Copilot/Copilot';
import JobDetails from '../pages/JobDetails/JobDetails';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-search" element={<CreateSearch />} />
          <Route path="job-understanding" element={<JobUnderstanding />} />
          <Route path="rankings" element={<Rankings />} />
          <Route path="candidate/:id" element={<CandidateProfile />} />
          <Route path="compare" element={<CompareCandidates />} />
          <Route path="talent-graph" element={<TalentGraph />} />
          <Route path="shortlist" element={<Shortlist />} />
          <Route path="explainability" element={<Explainability />} />
          <Route path="copilot" element={<Copilot />} />
          <Route path="job/:id" element={<JobDetails />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
