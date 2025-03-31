import React, { type PropsWithChildren, useRef, useState } from 'react';
import { LuX } from 'react-icons/lu';
import { Button } from './button';
import { DragNDropFile } from './drag-n-drop-file';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export const UploadPdfFileInput = React.forwardRef<HTMLDivElement, PropsWithChildren<FileUploadProps>>((props, ref) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateAndSetFile = (file: File | undefined) => {
    if (file) {
      if (file.type === 'application/pdf') {
        setErrorMessage(null);
        props.onFileSelect(file);
      } else {
        setErrorMessage('O arquivo enviado tem que ser um pdf');
        props.onFileSelect(null);
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleDragNDropChange = (uploadedFile: File | File[]) => {
    const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
    validateAndSetFile(file);
  };

  return (
    <div className="flex flex-col" ref={ref}>
      <DragNDropFile onChange={handleDragNDropChange} dropMessage='Solte seu PDF aqui'>
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-black border-dashed bg-gray-100/90 p-6 text-center">
          {props.selectedFile ? (
            <div className="flex items-center gap-md">
              <p>{props.selectedFile.name}</p>
              <LuX onClick={() => props.onFileSelect(null)} />
            </div>
          ) : (
            <div className="max-w-xs">
              <h4 className="text-gray-800">Arraste e solte seu PDF aqui</h4>
              <div className="mb-4" />

              <Button onClick={handleBrowseClick}>
                Procure o PDF
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf"
                onChange={handleFileChange}
              />
              {props.children}
            </div>
          )}
        </div>
        {errorMessage && (
          <>
            <div className="mb-6" />
            <div className="text-xs bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">
                {errorMessage}
              </span>
            </div>
          </>
        )}
      </DragNDropFile>
    </div>
  );
});

UploadPdfFileInput.displayName = 'UploadPdfFileInput';