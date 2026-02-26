// components/ResizableContainer.tsx
import { useRef, useCallback } from 'react';
import { useContainerStore } from '../stores/useContainerStore';
import PlayGround from '../dashboard-etc/PlayGround';

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
        Math.max(100, startSize.current.width + dx),  // min width: 100px
        Math.max(100, startSize.current.height + dy)  // min height: 100px
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
      style={{ width, height, position: 'relative', background: '#f0f0f0', border: '1px solid #ccc' }}
    >
      {<PlayGround />}
      <p>Container: {Math.round(width)}px × {Math.round(height)}px</p>

      {/* Resize handle — bottom-right corner */}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 16,
          height: 16,
          cursor: 'se-resize',
          background: '#999',
          borderRadius: '2px 0 0 0',
        }}
      />
    </div>
  );
}