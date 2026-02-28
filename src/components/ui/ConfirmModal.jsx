export default function ConfirmModal({ isOpen, onClose, onConfirm, title, text }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{text}</p>
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Отмена</button>
          <button className="btn btn-submit" onClick={onConfirm}>Сбросить</button>
        </div>
      </div>
    </div>
  );
}