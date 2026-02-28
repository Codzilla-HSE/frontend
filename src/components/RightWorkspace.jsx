import { forwardRef } from 'react';
import PanelHeader from './ui/PanelHeader';
import { HorizontalResizer } from './ui/Resizers';

const RightWorkspace = forwardRef(({ 
  width, 
  splitState, 
  activeResizer, 
  startDragging 
}, ref) => {

  return (
    <div 
      className="column-container right-column" 
      ref={ref}
      style={{ width: `${width}%` }}
    >
      {/* Условие */}
      <div className="panel panel-top" style={{ height: `${splitState}%` }}>
         <PanelHeader title="Условие задачи" />
         <div className="panel-content overflow-auto">
           <h3 style={{ marginTop: 0 }}>Заголовок задачи</h3>
           <p>Текст условия задачи...</p>
         </div>
      </div>

      <HorizontalResizer 
        isDragging={activeResizer === 'right-horizontal'}
        onMouseDown={startDragging('right-horizontal')}
      />

      {/* Метрики */}
      <div className="panel panel-bottom" style={{ height: `${100 - splitState}%` }}>
        <PanelHeader title="Метрики противника" />
        <div className="panel-content overflow-auto">
           <p>Данные по метрикам...</p>
        </div>
      </div>
    </div>
  );
});

export default RightWorkspace;