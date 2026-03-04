export default function PanelHeader({ title, Icon = null, onClick }) {
  return (
    <div className="panel-header" onClick={onClick}>
      {Icon && (
        <div className="panel-header-icon">
          <Icon size={16} />
        </div>
      )}
      <span className="panel-header-title">{title}</span>
    </div>
  );
}