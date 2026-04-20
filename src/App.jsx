import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BattlePage from './pages/BattlePage';
import WorkspacePage from './pages/WorkspacePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
      </Routes>
    </Router>
  );
}

export default App;