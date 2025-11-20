import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onFileSelect(file);
    } else {
      alert("Please upload an image file.");
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`relative w-full max-w-xl mx-auto border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 hover:border-slate-400 bg-white'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={!disabled ? onButtonClick : undefined}
    >
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-4">
        <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-slate-100'}`}>
          <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-600' : 'text-slate-500'}`} />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-700">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-slate-500">
            SVG, PNG, JPG or WebP (max. 800x400px)
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
