import React, { useState } from 'react';
import { Trash2, Plus, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import OptionInput from './OptionInput';

/**
 * Question Card Component
 * 
 * Renders a single poll question along with its options, 
 * duration, points, question type, and required toggle.
 */
const QuestionCard = ({ question, index, totalQuestions, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Handlers for modifying the options array
  const handleAddOption = () => {
    if (question.options.length < 6) {
      onUpdate({
        options: [
          ...question.options,
          { id: crypto.randomUUID(), text: '' }
        ]
      });
    }
  };

  const handleUpdateOption = (optionId, updates) => {
    const updatedOptions = question.options.map((opt) =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );
    onUpdate({ options: updatedOptions });
  };

  const handleDeleteOption = (optionId) => {
    if (question.options.length > 2) {
      const updatedOptions = question.options.filter((opt) => opt.id !== optionId);
      onUpdate({ options: updatedOptions });
    }
  };

  return (
    <div className="bg-white dark:bg-[#121212] border border-dashed border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col transition-all text-gray-900 dark:text-white">
      
      {/* --------------------------------------------------------
          Header: Drag Handle, Title, Actions
      -------------------------------------------------------- */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <GripVertical className="w-5 h-5" />
          </div>
          <span className="font-bold text-gray-800 dark:text-gray-200">
            Question {index + 1}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {totalQuestions > 1 && (
            <button
              type="button"
              onClick={onDelete}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
              aria-label="Delete Question"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button 
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white focus:outline-none"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------
          Body: Collapsible Content
      -------------------------------------------------------- */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-6">
              
              {/* Question Text with ReactQuill */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Question Text
                </label>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1A1A]">
                  <ReactQuill 
                    theme="snow"
                    value={question.text || ''} 
                    onChange={(val) => onUpdate({ text: val })}
                    placeholder="Enter question text"
                    className="bg-white dark:bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Configurations Row */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-2">
                   <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                     Duration [seconds] <span className="text-red-500">*</span>
                   </label>
                   <input 
                     type="number"
                     min="5"
                     max="30"
                     value={question.duration}
                     onChange={(e) => {
                       let val = Number(e.target.value);
                       if (val > 30) val = 30;
                       onUpdate({ duration: val });
                     }}
                     className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:outline-none py-1 text-gray-900 dark:text-white"
                   />
                </div>
                <div className="flex-1 space-y-2">
                   <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                     Points <span className="text-red-500">*</span>
                   </label>
                   <input 
                     type="number"
                     min="0"
                     value={question.points}
                     onChange={(e) => onUpdate({ points: Number(e.target.value) })}
                     className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:outline-none py-1 text-gray-900 dark:text-white"
                   />
                </div>
                <div className="flex-1 space-y-2">
                   <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                     Question Type <span className="text-red-500">*</span>
                   </label>
                   <select 
                     value={question.type}
                     onChange={(e) => onUpdate({ type: e.target.value })}
                     className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:outline-none py-1 text-gray-900 dark:text-white cursor-pointer appearance-none"
                   >
                     <option value="SINGLE_CHOICE" className="bg-white dark:bg-zinc-900">Single Choice</option>
                     <option value="MULTI_SELECT" className="bg-white dark:bg-zinc-900">Multi Select</option>
                     <option value="WORD_CLOUD" className="bg-white dark:bg-zinc-900">Word Cloud</option>
                     <option value="OPEN_TEXT" className="bg-white dark:bg-zinc-900">Open Text</option>
                     <option value="RATING" className="bg-white dark:bg-zinc-900">Rating</option>
                   </select>
                </div>
              </div>

              {/* --------------------------------------------------------
                  Options Section (Only if SINGLE_CHOICE or MULTI_SELECT)
              -------------------------------------------------------- */}
              {['SINGLE_CHOICE', 'MULTI_SELECT'].includes(question.type) && (
                <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Answers <span className="text-gray-400 font-normal ml-1">(Min 2, Max 6)</span>
                  </label>
                  
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {question.options.map((option, optIndex) => (
                        <motion.div
                          key={option.id}
                          initial={{ opacity: 0, height: 0, scale: 0.95 }}
                          animate={{ opacity: 1, height: 'auto', scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          layout
                        >
                          <OptionInput
                            option={option}
                            index={optIndex}
                            canDelete={question.options.length > 2}
                            onUpdate={(updates) => handleUpdateOption(option.id, updates)}
                            onDelete={() => handleDeleteOption(option.id)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Add Option Button */}
                  {question.options.length < 6 && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddOption}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors focus:outline-none"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </motion.button>
                  )}
                </div>
              )}

              {/* Required Toggle */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Required Question
                  </span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={question.isRequired}
                      onChange={(e) => onUpdate({ isRequired: e.target.checked })}
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                      question.isRequired ? 'bg-orange-500' : 'bg-gray-300 dark:bg-zinc-700'
                    }`}></div>
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out shadow-sm ${
                      question.isRequired ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </div>
                </label>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionCard;
