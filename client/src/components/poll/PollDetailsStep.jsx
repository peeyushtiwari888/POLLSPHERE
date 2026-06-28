import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Type, AlignLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Child Components
import ThumbnailUploader from './ThumbnailUploader';

// Zod validation schema
const pollDetailsSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title cannot exceed 100 characters")
    .nonempty("Poll title is required"),
  description: z.string()
    .max(5000, "Description cannot exceed 5000 characters")
    .optional(),
  participationCode: z.string()
    .max(50, "Code cannot exceed 50 characters")
    .optional(),
});

/**
 * Step 1: Poll Details
 * 
 * Captures the basic metadata of the poll (Title, Description).
 * Uses React Hook Form + Zod for robust, instant inline validation.
 */
const PollDetailsStep = ({ data, updateData }) => {
  const { 
    register, 
    control,
    formState: { errors }, 
    watch 
  } = useForm({
    resolver: zodResolver(pollDetailsSchema),
    defaultValues: {
      title: data?.title || '',
      description: data?.description || '',
      participationCode: data?.participationCode || '',
    },
    mode: 'onChange', // Validate instantly as the user types
  });

  // Since thumbnailUrl is not managed by hook-form (it's custom), we track it via parent data or local state
  const thumbnailUrl = data?.thumbnailUrl || '';

  // Watch fields to sync them back to the master wizard state
  const titleValue = watch('title');
  const descriptionValue = watch('description');
  const participationCodeValue = watch('participationCode');

  // Automatically sync local form state up to the parent wizard component
  // so the data isn't lost if the user navigates between steps.
  useEffect(() => {
    updateData({
      title: titleValue,
      thumbnailUrl: thumbnailUrl,
      description: descriptionValue,
      participationCode: participationCodeValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue, descriptionValue, thumbnailUrl, participationCodeValue]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col space-y-8">
      
      <div className="space-y-1.5 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Poll Details</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Provide a clear title and optional context for your poll.
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        
        {/* Title Input */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Poll Title <span className="text-orange-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-0 left-0 h-12 flex items-center pl-4 pointer-events-none text-gray-400">
              <Type className="w-5 h-5" />
            </div>
            <input
              id="title"
              type="text"
              placeholder="e.g., What is your favorite JavaScript framework?"
              {...register('title')}
              className={`w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-zinc-900/50 border ${
                errors.title ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-orange-500/20'
              } rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 transition-all duration-300`}
            />
          </div>
          
          <AnimatePresence>
            {errors.title && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                className="flex items-center gap-1.5 text-sm text-red-500 mt-1"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.title.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Thumbnail Uploader */}
        <ThumbnailUploader 
          currentThumbnail={thumbnailUrl} 
          onUploadSuccess={(url) => updateData({ ...data, thumbnailUrl: url })}
          onRemove={() => updateData({ ...data, thumbnailUrl: '' })}
        />

        {/* Description ReactQuill */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Description <span className="text-gray-400 font-normal ml-1">(Optional)</span>
          </label>
          <div className={`relative bg-white dark:bg-zinc-900/50 rounded-xl overflow-hidden border ${
            errors.description ? 'border-red-500' : 'border-gray-200 dark:border-zinc-800'
          }`}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <ReactQuill 
                  theme="snow"
                  value={field.value || ''} 
                  onChange={field.onChange}
                  placeholder="Add extra context, instructions, or rules for this poll..."
                  className="bg-white dark:bg-transparent text-gray-900 dark:text-white"
                  modules={{
                    toolbar: [
                      ['bold', 'italic'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link'],
                      [{ 'header': [1, 2, 3, false] }],
                      ['clean']
                    ]
                  }}
                />
              )}
            />
          </div>

          {/* Character Count & Error */}
          <div className="flex items-center justify-between mt-1">
            <AnimatePresence mode="wait">
              {errors.description ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-sm text-red-500"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.description.message}</span>
                </motion.div>
              ) : (
                <motion.div key="empty" className="text-sm text-transparent">.</motion.div>
              )}
            </AnimatePresence>
            <span className={`text-xs ${descriptionValue?.length > 5000 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              {descriptionValue?.length || 0} / 5000
            </span>
          </div>
        </div>

        {/* Participation Code Input */}
        <div className="space-y-2">
          <label htmlFor="participationCode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Participation Code <span className="text-gray-400 font-normal ml-1">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-0 left-0 h-12 flex items-center pl-4 pointer-events-none text-gray-400">
              <Type className="w-5 h-5" />
            </div>
            <input
              id="participationCode"
              type="text"
              placeholder="e.g., SECRET123"
              {...register('participationCode')}
              className={`w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-zinc-900/50 border ${
                errors.participationCode ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-orange-500/20'
              } rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 transition-all duration-300`}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            If provided, users must enter this code to join the poll.
          </p>
          <AnimatePresence>
            {errors.participationCode && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                className="flex items-center gap-1.5 text-sm text-red-500 mt-1"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.participationCode.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </form>
    </div>
  );
};

export default PollDetailsStep;
