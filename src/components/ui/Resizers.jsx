export function VerticalResizer({ isDragging, onMouseDown }) {
  return (
    <div 
      className={`resizer-vertical ${isDragging ? 'dragging' : ''}`} 
      onMouseDown={onMouseDown}
    >
      <div className="resizer-line-vertical"></div>
    </div>
  );
}

export function HorizontalResizer({ isDragging, onMouseDown }) {
  return (
    <div 
      className={`resizer-horizontal ${isDragging ? 'dragging' : ''}`}
      onMouseDown={onMouseDown}
    >
       <div className="resizer-line-horizontal"></div>
    </div>
  );
}