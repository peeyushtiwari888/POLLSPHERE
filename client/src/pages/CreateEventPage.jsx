import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, Edit3, ArrowLeft } from 'lucide-react';
import EventForm from '../components/event/EventForm';
import EventPreviewCard from '../components/event/EventPreviewCard';
import { createEvent, updateEvent, getEvent } from '../api/event.api';
import toast from 'react-hot-toast';

const CreateEventPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await getEvent(id);
        const eventData = response?.data || response;
        
        // Format dates for input[type="datetime-local"] which expects YYYY-MM-DDTHH:mm
        const formatForInput = (dateString) => {
          if (!dateString) return '';
          const d = new Date(dateString);
          return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        };

        setInitialData({
          ...eventData,
          startDate: formatForInput(eventData.startDate),
          endDate: formatForInput(eventData.endDate),
          registrationDeadline: formatForInput(eventData.registrationDeadline),
          tags: eventData.tags ? eventData.tags.join(', ') : '',
        });
        setFormValues(eventData);
      } catch (error) {
        toast.error('Failed to load event data');
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };

    if (isEditMode) {
      fetchEventData();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateEvent(id, data);
        toast.success('Event updated successfully!');
      } else {
        await createEvent(data);
        toast.success('Event created successfully!');
      }
      setIsSubmitting(false);
      navigate('/events');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
        <div>
          <button 
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-500 rounded-xl">
              {isEditMode ? <Edit3 className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isEditMode ? 'Edit Event' : 'Create New Event'}
            </h1>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 ml-1 mt-2">
            {isEditMode 
              ? 'Update your event details, media, and registration settings.' 
              : 'Set up a new event, add stunning media, and start accepting registrations.'}
          </p>
        </div>
      </div>

      {/* 2. Split Layout Area */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 xl:col-span-8 w-full">
          <EventForm 
            initialData={initialData} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            setFormValues={setFormValues}
          />
        </div>

        {/* Right Column: Live Preview */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 w-full">
          <div className="sticky top-6">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">
              Live Preview
            </h3>
            <EventPreviewCard event={formValues} />
          </div>
        </div>

      </div>

    </div>
  );
};

export default CreateEventPage;
