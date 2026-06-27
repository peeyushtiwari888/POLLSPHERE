import React from 'react';
import { Trash2, Plus, GripVertical, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import child component (assuming it will be created next)
import OptionInput from './OptionInput';

/**
 * Question Card Component
 * 
 * Renders a single poll question along with its options, 
 * required toggle, and deletion controls.
 */
const QuestionCard = ({ question, index, totalQuestions, onUpdate, onDelete }) => {
  
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

  const handleUpdateOption = (optionId, newText) => {
    const updatedOptions = question.options.map((opt) =>
      opt.id === optionId ? { ...opt, text: newText } : opt
    );
    onUpdate({ options: updatedOptions });
  };

  const handleDeleteOption = (optionId) => {
    // Enforce minimum 2 options rule
    if (question.options.length > 2) {
      const updatedOptions = question.options.filter((opt) => opt.id !== optionId);
      onUpdate({ options: updatedOptions });
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
      
      {/* --------------------------------------------------------
          Header: Drag Handle, Title, Delete Action
      -------------------------------------------------------- */}
      <div className="bg-gray-50/50 dark:bg-zinc-950/50 border-b border-gray-100 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="cursor-grab active:cursor-grabbing p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <GripVertical className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Question {index + 1}
          </span>
        </div>

        {totalQuestions > 1 && (
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors focus:outline-none"
            aria-label="Delete Question"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* --------------------------------------------------------
          Body: Question Text Input
      -------------------------------------------------------- */}
      <div className="p-5 sm:p-6 space-y-6">
        
        {/* Question Text */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Question Text <span className="text-orange-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-0 left-0 h-12 flex items-center pl-4 pointer-events-none text-gray-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="e.g., What feature should we build next?"
              value={question.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* --------------------------------------------------------
            Options Section
        -------------------------------------------------------- */}
        <div className="space-y-3">
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
                    onUpdate={(newText) => handleUpdateOption(option.id, newText)}
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

      </div>

      {/* --------------------------------------------------------
          Footer: Required Toggle Settings
      -------------------------------------------------------- */}
      <div className="bg-gray-50/50 dark:bg-zinc-950/50 border-t border-gray-100 dark:border-zinc-800 px-5 py-4 flex items-center justify-end">
        
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
            {/* Custom Toggle Track */}
            <div className={`w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
              question.isRequired ? 'bg-orange-500' : 'bg-gray-300 dark:bg-zinc-700'
            }`}></div>
            {/* Custom Toggle Dot */}
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out shadow-sm ${
              question.isRequired ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </div>
        </label>

      </div>
    </div>
  );
};

export default QuestionCard;
