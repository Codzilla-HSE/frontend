export default function SettingsModal({ 
  isOpen, 
  onClose, 
  onLogout, 
  themeConfig, 
  workspaceConfig 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Настройки</h3>
        
        <div className="settings-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '15px 0' }}>
          
          {themeConfig && (
            <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <span>Светлая тема</span>
              <input 
                type="checkbox" 
                checked={!themeConfig.isDarkMode} 
                onChange={() => themeConfig.setIsDarkMode(!themeConfig.isDarkMode)} 
              />
            </label>
          )}

          {workspaceConfig && (
            <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <span>Поменять панели местами</span>
              <input 
                type="checkbox" 
                checked={workspaceConfig.isSwapped} 
                onChange={() => workspaceConfig.setIsSwapped(!workspaceConfig.isSwapped)} 
              />
            </label>
          )}
        </div>

        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button 
            className="btn btn-danger"
            onClick={onLogout}
          >
            Выйти
          </button>
          <button className="btn" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}