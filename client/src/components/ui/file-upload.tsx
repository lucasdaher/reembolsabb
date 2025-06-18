"use client";

import { useState, useRef, useEffect } from "react";
import type { FC, DragEvent, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

const FileUpload: FC<FileUploadProps> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onFileSelect(file);
  }, [file, onFileSelect]);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="bg-white border-2 border-dashed border-zinc-200 rounded-lg p-6 w-full z-50">
      {!file && (
        <div
          className="rounded-md p-6 text-center cursor-pointer hover:border-blue-600 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <Upload className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
          <p className="text-sm text-zinc-600">
            <span className="font-semibold text-blue-600">
              Clique para enviar
            </span>{" "}
            ou arraste e solte
          </p>
          <p className="text-xs text-zinc-500 mt-1">PNG, JPG, PDF (MAX. 8MB)</p>
        </div>
      )}

      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/png, image/jpeg, application/pdf"
      />

      {file && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-800">
            Arquivo Selecionado:
          </h3>
          <div className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
            <span className="truncate pr-2 font-medium text-zinc-700">
              {file.name}
            </span>
            <button
              onClick={handleRemoveFile}
              className="text-zinc-400 hover:text-red-600 focus:outline-none flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
