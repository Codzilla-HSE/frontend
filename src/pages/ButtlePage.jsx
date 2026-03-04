import { useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './ButtlePage.css';

export default function ButtlePage() {
  const navigate = useNavigate();
  const currentUser = { nickname: "CodeNinja" };

  return (
    <div className="layout-container">
      <Header user={currentUser} />
      
      <main className="buttle-main">
        <h1 className="buttle-title">Арена CodeZilla</h1>
        <p className="buttle-subtitle">
          Выбери задачу, напиши оптимальный код и разгроми соперника
        </p>

        <button className="btn-battle" onClick={() => navigate('/workspace')}>
          В БОЙ!
        </button>
      </main>

      <Footer />
    </div>
  );
}