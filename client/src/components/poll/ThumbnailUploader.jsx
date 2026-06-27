import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, UploadCloud, X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * ThumbnailUploader Component
 * 
 * Architecture:
 * - Controlled Component: Relies on `currentThumbnail` prop and `onUploadSuccess`/`onRemove` callbacks.
 * - Drag & Drop: Implements native drag events (dragover, dragleave, drop).
 * - Validation: Checks file type (image/*) and size (< 5MB) on the client side before any upload attempt.
 * - Progress & State: Simulates upload progress for a premium feel (can be wired up to axios `onUploadProgress` easily).
 * - Fallback / Mock: Since there is no actual multipart backend endpoint currently, it simulates an upload and returns a `URL.createObjectURL()`.
 * 
 * @param {string} currentThumbnail - The URL of the currently uploaded image, if any.
 * @param {function} onUploadSuccess - Callback triggered when upload succeeds, receives the new URL.
 * @param {function} onRemove - Callback triggered when the image is removed.
 */
const ThumbnailUploader = ({ currentThumbnail, onUploadSuccess, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  // Constants
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  // Handle Drag Events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle File Input Selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  // Validation and Mock Upload
  const validateAndUpload = (file) => {
    setError(null);

    // 1. Validate Type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    // 2. Validate Size
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size allowed is 5MB.');
      return;
    }

    // 3. Initiate Upload Process
    startUpload(file);
  };

  const startUpload = (file) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    /**
     * MOCK UPLOAD SIMULATION
     * Replace this entire block with your actual Axios/Fetch call using FormData
     * e.g., 
     * const formData = new FormData();
     * formData.append('thumbnail', file);
     * const response = await api.post('/upload', formData, { onUploadProgress: (e) => ... });
     */
    const totalDuration = 1500; // 1.5 seconds mock duration
    const interval = 50; 
    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += (interval / totalDuration) * 100;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setProgress(100);
        
        setTimeout(() => {
          setIsUploading(false);
          // Return a local blob URL for now to show the image instantly
          const localUrl = URL.createObjectURL(file);
          onUploadSuccess(localUrl);
        }, 300);
      } else {
        setProgress(currentProgress);
      }
    }, interval);
  };

  // ---------------------------------------------------------------------------
  // RENDER: PREVIEW STATE (When an image is already uploaded)
  // ---------------------------------------------------------------------------
  if (currentThumbnail && !isUploading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Poll Thumbnail
        </label>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 group"
        >
          {/* Image Preview */}
          <div className="relative aspect-video w-full">
            <img 
              src={currentThumbnail} 
              alt="Poll Thumbnail" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="font-medium text-sm">Replace</span>
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="font-medium text-sm">Remove</span>
              </button>
            </div>
          </div>
          
          {/* Hidden File Input for Replace */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept={ACCEPTED_TYPES.join(',')} 
            className="hidden" 
          />
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: UPLOAD / PROGRESS STATE
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Poll Thumbnail <span className="text-gray-400 font-normal ml-1">(Optional)</span>
        </label>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
          ${isUploading ? 'bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 cursor-default' : 'cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-500/5 group'}
          ${isDragging ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/10 scale-[1.01]' : 'border-gray-300 dark:border-zinc-700 hover:border-orange-400 dark:hover:border-orange-500/50'}
        `}
      >
        {/* Subtle Gradient Accent when dragging or hovering */}
        <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

        <div className="relative px-6 py-10 flex flex-col items-center justify-center text-center">
          
          {isUploading ? (
            // Uploading State
            <div className="w-full max-w-xs mx-auto space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-orange-500 animate-pulse" />
                  Uploading...
                </span>
                <span className="text-orange-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
              </div>
            </div>
          ) : (
            // Default Upload State
            <>
              <div className="w-12 h-12 mb-4 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center border border-gray-100 dark:border-zinc-700 group-hover:scale-110 transition-transform duration-300">
                <Image className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                Click to upload <span className="font-normal text-gray-500 dark:text-gray-400">or drag and drop</span>
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or WEBP (max. 5MB)
              </p>
            </>
          )}

        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept={ACCEPTED_TYPES.join(',')} 
          className="hidden" 
          disabled={isUploading}
        />
      </div>

      {/* Error Message Display */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -5 }}
            className="flex items-center gap-1.5 text-sm text-red-500 mt-2"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThumbnailUploader;
