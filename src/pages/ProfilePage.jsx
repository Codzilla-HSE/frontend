import {useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import { useUser } from "../context/UserContext.jsx";
// import api from "../api/axiosConfig.js";
import './LoginPage.css';
import './ProfilePage.css';
import {User, UserIcon} from "lucide-react";
import api from "../api/axiosConfig.js";

export function ProfilePage() {
    const { user, logout, login } = useUser();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [imageError, setImageError] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSave = async () => {
        try {
            await api.post("/user/change-user", {nickname: nickname})
            user.nickname = nickname;
            setIsEditing(false);
            alert("Профиль обновлен!");
        } catch (err) {
            alert("Ошибка при обновлении:" + err);
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            await api.post('/user/upload-icon', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const responseIcon = await api.get(
                '/user/icon-url'
            )
            const dataIcon = responseIcon.data;

            login({ ...user, iconUrl: dataIcon });
            setImageError(false);

        } catch (err) {
            alert("Ошибка загрузки: " + err.response?.data || err.message);
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    return (
        <div className="login-page-container">
            <Header user={user} />

            <div className="login-wrapper">
                <div className="glass-panel profile-card">

                    <button
                        className="edit-badge"
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>

                    <div className="avatar-wrapper">
                        { isEditing && <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleUpload}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />}

                        <div
                            className={`avatar-container ${isUploading ? 'loading' : ''}`}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {imageError || !user?.iconUrl ? (
                                <div className="avatar-placeholder">
                                    <UserIcon size={64} color="#FFFFFF" />
                                </div>
                            ) : (
                                <img
                                    src={user.iconUrl}
                                    className="profile-avatar"
                                    onError={() => setImageError(true)}
                                    alt="Profile"
                                />
                            )}
                        </div>

                        {isUploading && <p className="upload-status">Загрузка...</p>}
                    </div>

                    <div className="profile-info">
                        {isEditing ? (
                            <div className="login-form" style={{ marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="Новый никнейм"
                                />
                            </div>
                        ) : (
                            <h2 className="nickname">{user.nickname}</h2>
                        )}
                        <p className="email">{user.email}</p>
                    </div>

                    <div className="profile-actions">
                        <button className="secondary-button" onClick={handleLogout}>
                            Выйти из системы
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}