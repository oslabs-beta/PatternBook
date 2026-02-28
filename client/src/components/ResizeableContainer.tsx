// components/ResizableContainer.tsx
import { useRef, useCallback } from 'react';
import { useContainerStore } from '../stores/useContainerStore';
import PlayGround from '../dashboard-etc/PlayGround';
import '../main.css'

export default function ResizableContainer() {
  const { width, height, setSize } = useContainerStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { width, height };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      setSize(
        Math.max(250, startSize.current.width + dx),  // min width: 
        Math.max(300, startSize.current.height + dy)  // min height:
      );
    };

    const onMouseUp = () => {
      isResizing.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [width, height, setSize]);

  return (
    <div
      ref={containerRef}
      // className='relative bg-blue-300 border border-width-3 text-`clamp(12px, ${width *.04}px, 32px)` '
      style={{ width, height, position: 'relative', background: '#f0f0f0', border: '1px solid #ccc', fontSize:`clamp(12px, ${width *.04}px, 32px)`,

      }}
    >
         
      <p className='text-xs'>Container: {Math.round(width)}px × {Math.round(height)}px</p>
       {<PlayGround />}

      {/* Resize handle — top-right corner */}
      <div className='absolute top-2 right-2 w-5 h-5 bg-red-400 cursor-ne-resize'
        onMouseDown={onMouseDown} 
      
      />
    </div>
  );
}