export default function PanelHeader({ title, Icon = null }) {
  return (
    <div className="panel-header">
      {Icon && (
        <div className="panel-header-icon">
          <Icon size={16} />
        </div>
      )}
      <span className="panel-header-title">{title}</span>
    </div>
  );
}