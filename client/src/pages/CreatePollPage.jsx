import React from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, Edit3 } from 'lucide-react';
import CreatePollWizard from '../components/poll/CreatePollWizard';

/**
 * Create Poll Page
 * 
 * Serves as the host container for the multi-step poll creation wizard.
 * Designed to be clean and distraction-free.
 */
const CreatePollPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* 1. Page Header */}
      <div className="flex flex-col gap-2 border-b border-gray-100 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-500 rounded-xl">
            {isEditMode ? <Edit3 className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {isEditMode ? 'Edit Poll' : 'Create New Poll'}
          </h1>
        </div>
        <p className="text-base text-gray-500 dark:text-gray-400 ml-1">
          {isEditMode 
            ? 'Modify your poll structure, adjust settings, and save changes.' 
            : 'Configure basic attributes, build your questionnaire, and deploy to your audience.'}
        </p>
      </div>

      {/* 2. Wizard Component Mounting Point */}
      <section aria-label="Poll Creation Wizard" className="w-full">
        <CreatePollWizard />
      </section>

    </div>
  );
};

export default CreatePollPage;
