import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createPoll, getPollById, updatePoll } from '../../api/poll.api';
import { format } from 'date-fns';

// We import the individual step components (assuming they will be created next)
import PollDetailsStep from './PollDetailsStep';
import QuestionsStep from './QuestionsStep';
import PollSettingsStep from './PollSettingsStep';
import ReviewStep from './ReviewStep';

const STEPS = [
  { id: 1, title: 'Details', description: 'Configure basic attributes' },
  { id: 2, title: 'Questions', description: 'Build your questionnaire' },
  { id: 3, title: 'Settings', description: 'Manage access & lifecycle' },
  { id: 4, title: 'Review', description: 'Finalize and deploy' }
];

/**
 * Multi-step Wizard for Creating a Poll
 * Handles global form state, validation delegation, and step navigation.
 */
const CreatePollWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const isEditMode = !!id;
  const [isInitializing, setIsInitializing] = useState(isEditMode);
  const navigate = useNavigate();
  
  // Centralized Master Form State
  const [formData, setFormData] = useState({
    title: '',
    thumbnailUrl: '',
    description: '',
    questions: [], // Array of question objects
    settings: {
      isAnonymous: false,
      isResultsPublished: false,
      expiryDate: '',
    }
  });

  // Handler passed to child steps to update the master state
  const updateFormData = (stepKey, data) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: data
    }));
  };

  // Pre-fill data if in Edit Mode
  useEffect(() => {
    const fetchExistingPoll = async () => {
      if (!isEditMode) return;
      try {
        const response = await getPollById(id);
        const poll = response?.data;
        if (!poll) throw new Error('Poll not found');

        // Map backend response back into form schema
        setFormData({
          title: poll.title || '',
          thumbnailUrl: poll.thumbnailUrl || '',
          description: poll.description || '',
          questions: poll.questions || [],
          settings: {
            isAnonymous: poll.isAnonymous || false,
            isResultsPublished: poll.isResultsPublished || false,
            expiryDate: poll.expiryDate ? format(new Date(poll.expiryDate), 'yyyy-MM-dd') : '',
            expiryTime: poll.expiryDate ? format(new Date(poll.expiryDate), 'HH:mm') : '',
          }
        });
      } catch (err) {
        toast.error('Failed to load poll details');
        navigate('/polls');
      } finally {
        setIsInitializing(false);
      }
    };

    fetchExistingPoll();
  }, [id, isEditMode, navigate]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePublish = async () => {
    // Basic frontend validation to prevent bad requests
    if (!formData.title?.trim()) {
      toast.error('Poll Title is required');
      setCurrentStep(1);
      return;
    }
    if (!formData.questions || formData.questions.length === 0) {
      toast.error('At least one question is required');
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Calculate Expiry Date (Backend requires it)
      let finalExpiryDate = new Date();
      if (formData.settings.expiryDate) {
        const timePart = formData.settings.expiryTime || '23:59:00';
        finalExpiryDate = new Date(`${formData.settings.expiryDate}T${timePart}`);
      } else {
        // Fallback: expire in 30 days if left blank
        finalExpiryDate.setDate(finalExpiryDate.getDate() + 30);
      }

      // 2. Transform Data to match Mongoose Schema
      const payload = {
        title: formData.title,
        thumbnailUrl: formData.thumbnailUrl,
        description: formData.description,
        isAnonymous: formData.settings.isAnonymous,
        expiryDate: finalExpiryDate.toISOString(),
        questions: formData.questions.map(q => ({
          text: q.text,
          isRequired: q.isRequired,
          options: q.options.map(opt => ({ text: opt.text }))
        }))
      };

      // 3. Make API Call
      if (isEditMode) {
        await updatePoll(id, payload);
        toast.success('Poll updated successfully!');
      } else {
        await createPoll(payload);
        toast.success('Poll created successfully!');
      }
      navigate('/polls'); // Redirect to My Polls

    } catch (error) {
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} poll`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step component
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PollDetailsStep 
            data={formData} 
            updateData={(data) => setFormData(prev => ({ ...prev, title: data.title, thumbnailUrl: data.thumbnailUrl, description: data.description }))} 
          />
        );
      case 2:
        return <QuestionsStep data={formData.questions} updateData={(data) => updateFormData('questions', data)} />;
      case 3:
        return <PollSettingsStep data={formData.settings} updateData={(data) => updateFormData('settings', data)} />;
      case 4:
        return <ReviewStep data={formData} />;
      default:
        return null;
    }
  };

  // Prevent rendering the form until data is loaded in edit mode
  if (isInitializing) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Loading poll details...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col">
      
      {/* --------------------------------------------------------
          Header: Step Indicator
      -------------------------------------------------------- */}
      <div className="bg-gray-50/50 dark:bg-zinc-950/50 border-b border-gray-200 dark:border-zinc-800 px-6 py-8 sm:px-10">
        <nav aria-label="Progress">
          <ol className="flex flex-col md:flex-row md:items-center gap-6 md:gap-4 lg:gap-8">
            {STEPS.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <li key={step.id} className="relative flex-1">
                  
                  {/* Connecting Line (Desktop) */}
                  {index !== STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-4 left-10 w-full h-0.5 bg-gray-200 dark:bg-zinc-800" aria-hidden="true">
                      {isCompleted && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.4 }}
                          className="h-full bg-orange-500"
                        />
                      )}
                    </div>
                  )}

                  <div className="relative flex items-center group">
                    <span className="h-9 flex items-center">
                      <span 
                        className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                          isCompleted 
                            ? 'bg-orange-500 border-orange-500' 
                            : isCurrent 
                              ? 'border-orange-500 bg-white dark:bg-zinc-900' 
                              : 'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        ) : (
                          <span className={`text-sm font-semibold ${isCurrent ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            {step.id}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span className={`text-sm font-bold tracking-wide uppercase ${isCurrent ? 'text-orange-600 dark:text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        {step.title}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {step.description}
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* --------------------------------------------------------
          Body: Dynamic Step Content
      -------------------------------------------------------- */}
      <div className="p-6 sm:p-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Fallback rendering logic so the app doesn't crash completely if child components are missing */}
            <React.Suspense fallback={<div>Loading Step...</div>}>
              {renderStepContent()}
            </React.Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --------------------------------------------------------
          Footer: Navigation Controls
      -------------------------------------------------------- */}
      <div className="bg-gray-50 dark:bg-zinc-950/30 px-6 py-4 sm:px-10 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
        
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1 || isSubmitting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
            currentStep === 1 
              ? 'opacity-0 pointer-events-none' 
              : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white shadow-sm'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {currentStep < STEPS.length ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                Publishing...
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                {isEditMode ? 'Save Changes' : 'Publish Poll'}
                <Check className="w-4 h-4" strokeWidth={3} />
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
};

export default CreatePollWizard;
