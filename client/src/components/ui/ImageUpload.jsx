import React, { useCallback, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ value, onChange, label, aspect = 'video' }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFile = (file) => {
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.match('image.*')) {
      alert('Please upload an image file (JPG, PNG, WebP)');
      return;
    }
    
    // Check size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result); // Pass base64 string up
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onChange]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearImage = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation();
    onChange('');
  };

  // Determine aspect ratio class
  const aspectClass = aspect === 'square' ? 'aspect-square max-w-[200px]' : 'aspect-video w-full';

  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>}
      
      <div 
        className={`relative rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-300 ${aspectClass} ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' 
            : value 
              ? 'border-transparent' 
              : 'border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="w-full h-full relative group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button" 
                onClick={clearImage}
                className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
            <div className="w-12 h-12 mb-3 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              {isDragging ? <UploadCloud className="w-6 h-6 text-indigo-500 animate-bounce" /> : <ImageIcon className="w-6 h-6 text-gray-400" />}
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              SVG, PNG, JPG or WEBP (max. 5MB)
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleChange} 
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
