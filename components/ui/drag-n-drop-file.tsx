import * as React from 'react';
import { tv } from 'tailwind-variants';

export interface DragNDropFileProps {
  children?: React.ReactNode;
  dropMessage: string;
  isMultipleFiles?: boolean;
  onChange?: (uploaded: File | File[]) => void;
}

export const DragNDropFile: React.FC<DragNDropFileProps> = React.forwardRef(
  ({ children, dropMessage, isMultipleFiles, onChange }, _ref) => {
    const [dragging, setDragging] = React.useState<boolean>(false);
    const dropZone = React.useRef<HTMLDivElement>(null);
    const [dragCounter, setDragCounter] = React.useState<number>(0);

    const handleDrag = React.useCallback((event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    }, []);

    const handleDragIn = React.useCallback((event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setDragCounter(prevCounter => prevCounter + 1);
      if (event.dataTransfer?.items?.length) {
        setDragging(true);
      }
    }, []);

    React.useEffect(() => {
      const ref = dropZone.current;

      const handleDragOut = (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setDragCounter(prevCounter => prevCounter - 1);
        if (!dragCounter) {
          setDragging(false);
        }
      };

      const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        setDragging(false);

        if (event.dataTransfer?.files?.length) {
          const file = isMultipleFiles ? Array.from(event.dataTransfer.files) : event.dataTransfer.files[0];

          onChange?.(file);

          event.dataTransfer.clearData();
          setDragCounter(0);
        }
      };

      if (ref) {
        ref.addEventListener('dragenter', handleDragIn);
        ref.addEventListener('dragleave', handleDragOut);
        ref.addEventListener('dragover', handleDrag);
        ref.addEventListener('drop', handleDrop);

        return () => {
          ref.removeEventListener('dragenter', handleDragIn);
          ref.removeEventListener('dragleave', handleDragOut);
          ref.removeEventListener('dragover', handleDrag);
          ref.removeEventListener('drop', handleDrop);
        };
      }
    }, [dragCounter, isMultipleFiles, onChange, handleDrag, handleDragIn]);

    return (
      <div className={style().wrapper()} ref={dropZone} id="dragAndDrop">
        {dragging && (
          <div className={style().overlay()}>
            <label className={style().message()} htmlFor="dragAndDrop">
              {dropMessage}
            </label>
          </div>
        )}
        {children}
      </div>
    );
  },
);

DragNDropFile.displayName = 'DragNDropFileInput';


const style = tv({
  slots: {
    wrapper: 'relative',
    overlay:
      'border-dashed border border-neutral bg-neutral-soft absolute top-0 bottom-0 left-0 right-0 z-[4] flex items-center justify-center',
    message: 'text-black text-lg font-bold',
  },
});
