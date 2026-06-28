import React, { useEffect } from 'react';
import { Plus, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import child component (assuming it will be created next)
import QuestionCard from './QuestionCard';

/**
 * Step 2: Questions Management
 * 
 * Orchestrates the list of questions for the poll. 
 * Handles adding, removing, and delegating updates to individual QuestionCards.
 */
const QuestionsStep = ({ data = [], updateData }) => {
  
  // Auto-initialize with one empty question if the list is completely empty
  useEffect(() => {
    if (data.length === 0) {
      handleAddQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(), // Stable ID for React mapping and animations
      text: '',
      type: 'MULTIPLE_CHOICE',
      duration: 30,
      points: 10,
      options: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' }
      ],
      isRequired: true
    };
    updateData([...data, newQuestion]);
  };

  const handleUpdateQuestion = (id, updatedFields) => {
    const updatedData = data.map((q) => 
      q.id === id ? { ...q, ...updatedFields } : q
    );
    updateData(updatedData);
  };

  const handleDeleteQuestion = (id) => {
    const updatedData = data.filter((q) => q.id !== id);
    updateData(updatedData);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col space-y-8">
      
      {/* Header */}
      <div className="space-y-1.5 mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Questions</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Define the questions and available options for your audience.
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {data.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              layout // Automatically animates sibling items when one is removed!
            >
              <QuestionCard 
                question={question}
                index={index}
                totalQuestions={data.length}
                onUpdate={(fields) => handleUpdateQuestion(question.id, fields)}
                onDelete={() => handleDeleteQuestion(question.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State / Add Button */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/50">
          <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm mb-4">
            <ListTodo className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">No questions yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 text-center max-w-sm">
            Start building your poll by adding your first question below.
          </p>
        </div>
      )}

      {/* Add New Question Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddQuestion}
        className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all duration-300 font-semibold group"
      >
        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
          <Plus className="w-4 h-4" />
        </div>
        Add Another Question
      </motion.button>

    </div>
  );
};

export default QuestionsStep;
