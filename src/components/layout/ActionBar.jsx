import { ArrowLeftRight, Expand, Sun, Moon } from 'lucide-react';

export default function ActionBar({ toggleSwap, toggleFullscreen, toggleTheme, isDarkMode }) {
  return (
    <div className="action-bar">
      <div className="action-bar-left">
        {/* Здесь можно разместить хлебные крошки или статус */}
      </div>
      <div className="action-bar-right">
        <button className="btn icon-btn" onClick={toggleSwap} title="Поменять колонки местами">
          <ArrowLeftRight size={16} />
        </button>
        <button className="btn icon-btn" onClick={toggleFullscreen} title="Полноэкранный режим">
          <Expand size={16} />
        </button>
        <button className="btn icon-btn" onClick={toggleTheme} title="Сменить тему">
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
}