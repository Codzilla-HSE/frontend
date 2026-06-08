import {BrowserRouter as Router, Routes, Route, Navigate, useParams, Outlet} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BattlePage from './pages/BattlePage';
import LeaderboardPage from './pages/LeaderboardPage';
import WorkspacePage from './pages/WorkspacePage';
import './App.css';
import {ProfilePage} from "./pages/ProfilePage.jsx";
import {WebSocketProvider} from "./context/WebSocketContext.jsx";
import DraftPage from "./pages/DraftPage.jsx";
import {MatchListener} from "./pages/MatchListener.jsx";
import {Toaster} from "react-hot-toast";
import {UserProvider} from "./context/UserContext.jsx";

const MatchLayout = () => {
    const {matchId} = useParams();

    return (
        <MatchListener matchId={matchId}>
            <Outlet/>
        </MatchListener>
    );
};

function App() {

    return (
        <Router>
            <UserProvider>
                <WebSocketProvider>
                    <Toaster
                        position="bottom-right"
                        reverseOrder={false}
                        toastOptions={{
                            duration: 2000,
                            style: {
                                background: '#1e1e24',
                                color: '#fff',
                                borderRadius: '8px',
                            },
                        }}
                    />
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace/>}/>

                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/profile" element={<ProfilePage/>}/>
                        <Route path="/battle" element={<BattlePage/>}/>
                        <Route path="/leaderboard" element={<LeaderboardPage/>}/>
                        <Route path="/match/:matchId" element={<MatchLayout/>}>
                            <Route path="workspace" element={<WorkspacePage/>}/>
                            <Route path="draft" element={<DraftPage/>}/>
                        </Route>

                    </Routes>
                </WebSocketProvider>
            </UserProvider>
        </Router>
    );
}

export default App;