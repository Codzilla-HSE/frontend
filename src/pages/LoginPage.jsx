import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from './components/layout/Header';
import './LoginPage.css';
import '../App.css';
import '../api/axiosConfig.js';
import api from "../api/axiosConfig.js";
import {useUser} from "../context/UserContext.jsx";

export function LoginPage() {
    const [view, setView] = useState('login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {login} = useUser();
    const handleResetToLogin = () => {
        setView('login');
    };

    const handleLogin = async (e) => {

        if (e && e.preventDefault) e.preventDefault();

        setIsLoading(true);
        try {
            const response = await api.post(
                '/auth/login',
                {email: email, rawPassword: password}
            )

            const data = await response.data;

            const responseIcon = await api.get(
                '/user/icon-url'
            )
            const dataIcon = responseIcon.data;

            data.iconUrl = dataIcon;

            alert("Успешный вход для пользователя " + data.nickname);
            login(data);
            navigate("/battle");

        } catch (error) {
            console.log(error);
            alert("Ошибка авторизации: " + error.response.data.message);
        } finally {
            setIsLoading(false);
        }

    };

    const handleRegister = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        setIsLoading(true);

        try {
            const response = await api.post(
                '/auth/signup',
                {email: email, rawPassword: password, nickname: nickname}
            )

            const data = await response.data;
            alert("Успешная регистрация для " + data.nickname);
            setView("login");
        } catch (error) {
            alert("Ошибка регистрации: " + error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            alert('Инструкции по восстановлению отправлены на ваш email.');
            setView('login');
        } catch (error) {
            console.error("Ошибка восстановления", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <Header user={null} onNavClick={handleResetToLogin}/>

            <div className="login-wrapper">
                <div className="glass-panel">

                    {view === 'login' && (
                        <>
                            <h2>Вход в CodeZilla</h2>
                            <form onSubmit={handleLogin} className="login-form">
                                <input
                                    type="email" placeholder="Email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} required
                                />
                                <input
                                    type="password" placeholder="Пароль" value={password}
                                    onChange={(e) => setPassword(e.target.value)} required
                                />
                                <button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Вход...' : 'Войти'}
                                </button>
                            </form>
                            <div className="auth-links">
                                <span className="auth-link" onClick={() => setView('register')}>Регистрация</span>
                                <span className="auth-link" onClick={() => setView('forgot')}>Забыли пароль?</span>
                            </div>
                        </>
                    )}

                    {view === 'register' && (
                        <>
                            <h2>Регистрация</h2>
                            <form onSubmit={handleRegister} className="login-form">
                                <input
                                    type="text" placeholder="Никнейм" value={nickname}
                                    onChange={(e) => setNickname(e.target.value)} required
                                />
                                <input
                                    type="email" placeholder="Email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} required
                                />
                                <input
                                    type="password" placeholder="Пароль" value={password}
                                    onChange={(e) => setPassword(e.target.value)} required
                                />
                                <button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                                </button>
                            </form>
                            <div className="auth-links" style={{justifyContent: 'center'}}>
                                <span className="auth-link"
                                      onClick={() => setView('login')}>Уже есть аккаунт? Войти</span>
                            </div>
                        </>
                    )}

                    {view === 'forgot' && (
                        <>
                            <h2>Сброс пароля</h2>
                            <form onSubmit={handleForgotPassword} className="login-form">
                                <input
                                    type="email" placeholder="Введите ваш Email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} required
                                />
                                <button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Отправка...' : 'Восстановить'}
                                </button>
                            </form>
                            <div className="auth-links" style={{justifyContent: 'center'}}>
                                <span className="auth-link" onClick={() => setView('login')}>Вернуться ко входу</span>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}