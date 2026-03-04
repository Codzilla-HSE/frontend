import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ButtlePage from './pages/ButtlePage';
import WorkspacePage from './pages/WorkspacePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/buttle" element={<ButtlePage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
      </Routes>
    </Router>
  );
}

export default App;