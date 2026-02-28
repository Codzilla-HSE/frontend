export default function PanelHeader({ title, iconIcon = null }) {
  return (
    <div className="panel-header">
      {iconIcon && <img src={iconIcon} alt={title} className="panel-header-icon" />}
      <span className="panel-header-title">{title}</span>
    </div>
  );
}