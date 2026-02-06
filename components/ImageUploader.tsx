import React, { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onClear: () => void;
  selectedImage: File | null;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onClear, selectedImage, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  if (selectedImage && previewUrl) {
    return (
      <div className="relative group w-full aspect-[4/3] bg-white p-3 rounded-3xl shadow-lg transform rotate-1 transition-all hover:rotate-0 duration-300 border border-slate-200">
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-100">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
             <button 
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200 bg-white text-rose-500 hover:text-rose-600 px-5 py-2.5 rounded-full font-bold shadow-xl flex items-center gap-2"
            >
              <X size={18} strokeWidth={3} />
              Remove
            </button>
          </div>
        </div>
        {/* Tape Effect */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-rose-200/50 rotate-2 backdrop-blur-sm"></div>
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full aspect-[4/3] rounded-3xl border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-white
        ${isDragging 
          ? 'border-indigo-300 bg-indigo-50 scale-[1.01]' 
          : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => e.target.files && onImageSelect(e.target.files[0])}
      />
      
      <div className={`p-4 rounded-full mb-3 transition-colors ${isDragging ? 'bg-indigo-100 text-indigo-500' : 'bg-slate-100 text-slate-400'}`}>
        <ImageIcon size={32} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-700 mb-1 font-['Fredoka']">
        Add Photo
      </h3>
      <p className="text-slate-400 text-sm font-medium">
        Drop your memory here
      </p>
    </div>
  );
};

export default ImageUploader;