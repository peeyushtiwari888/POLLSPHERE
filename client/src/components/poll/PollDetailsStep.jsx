import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Type, AlignLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Zod validation schema
const pollDetailsSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title cannot exceed 100 characters")
    .nonempty("Poll title is required"),
  description: z.string()
    .max(500, "Description cannot exceed 500 characters")
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
    formState: { errors }, 
    watch 
  } = useForm({
    resolver: zodResolver(pollDetailsSchema),
    defaultValues: {
      title: data?.title || '',
      description: data?.description || '',
    },
    mode: 'onChange', // Validate instantly as the user types
  });

  // Watch fields to sync them back to the master wizard state
  const titleValue = watch('title');
  const descriptionValue = watch('description');

  // Automatically sync local form state up to the parent wizard component
  // so the data isn't lost if the user navigates between steps.
  useEffect(() => {
    updateData({
      title: titleValue,
      description: descriptionValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue, descriptionValue]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col space-y-8">
      
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What is your poll about?</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Give your poll a clear, engaging title and optionally add some context in the description.
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

        {/* Description Textarea */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Description <span className="text-gray-400 font-normal ml-1">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
              <AlignLeft className="w-5 h-5" />
            </div>
            <textarea
              id="description"
              placeholder="Add extra context, instructions, or rules for this poll..."
              rows={4}
              {...register('description')}
              className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border ${
                errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-orange-500/20'
              } rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 transition-all duration-300 resize-none`}
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
            <span className={`text-xs ${descriptionValue?.length > 500 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              {descriptionValue?.length || 0} / 500
            </span>
          </div>
        </div>

      </form>
    </div>
  );
};

export default PollDetailsStep;
