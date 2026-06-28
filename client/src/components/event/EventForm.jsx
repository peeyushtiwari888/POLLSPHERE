import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Layout, Image as ImageIcon, MapPin, CalendarDays, Settings, Eye } from 'lucide-react';
import ImageUpload from '../ui/ImageUpload';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// ZOD SCHEMA matching backend validation
// ---------------------------------------------------------------------------
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150),
  shortDescription: z.string().min(1, 'Short description is required').max(300),
  description: z.string().min(1, 'Description is required').max(10000),
  thumbnail: z.string().min(1, 'Thumbnail is required'),
  banner: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']),
  venue: z.string().optional(),
  meetingLink: z.string().optional(), // Using string optional instead of strict url to allow empty
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  maxParticipants: z.preprocess((val) => (val ? Number(val) : undefined), z.number().positive().optional()),
  registrationRequired: z.boolean(),
  registrationDeadline: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  tags: z.string().optional(), // We'll process comma separated string to array on submit
}).superRefine((data, ctx) => {
  if ((data.type === 'OFFLINE' || data.type === 'HYBRID') && (!data.venue || data.venue.trim().length === 0)) {
    ctx.addIssue({ path: ['venue'], message: 'Venue is required for Offline/Hybrid events', code: z.ZodIssueCode.custom });
  }
  if ((data.type === 'ONLINE' || data.type === 'HYBRID') && (!data.meetingLink || data.meetingLink.trim().length === 0)) {
    ctx.addIssue({ path: ['meetingLink'], message: 'Meeting link is required for Online/Hybrid events', code: z.ZodIssueCode.custom });
  }
  if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
    ctx.addIssue({ path: ['endDate'], message: 'End date must be after start date', code: z.ZodIssueCode.custom });
  }
});

const EventForm = ({ initialData, onSubmit, isSubmitting, setFormValues }) => {
  // Setup React Hook Form
  const { register, handleSubmit, control, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      title: '',
      shortDescription: '',
      description: '',
      thumbnail: '',
      banner: '',
      category: '',
      type: 'ONLINE',
      venue: '',
      meetingLink: '',
      startDate: '',
      endDate: '',
      maxParticipants: '',
      registrationRequired: true,
      registrationDeadline: '',
      status: 'DRAFT',
      visibility: 'PUBLIC',
      tags: '',
    },
    mode: 'onChange'
  });

  // Watch values to pass to parent for Live Preview
  const currentValues = watch();
  useEffect(() => {
    setFormValues(currentValues);
  }, [currentValues, setFormValues]);

  const handleFormSubmit = async (data) => {
    // Process tags string to array
    const formattedData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    
    // Prevent Mongoose CastError for empty date string
    if (!formattedData.registrationDeadline) {
      delete formattedData.registrationDeadline;
    }
    
    // Convert dates to ISO if needed, though they are datetime-local strings
    try {
      await onSubmit(formattedData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit form');
    }
  };

  const SectionHeading = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
      <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-lg">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );

  const InputLabel = ({ label, required }) => (
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const ErrorMsg = ({ error }) => {
    if (!error) return null;
    return <p className="text-xs font-medium text-red-500 mt-1">{error.message}</p>;
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white transition-all";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
      
      {/* 1. Basic Information */}
      <section className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <SectionHeading icon={Layout} title="Basic Information" subtitle="The core details of your event" />
        
        <div className="space-y-6">
          <div>
            <InputLabel label="Event Title" required />
            <input type="text" placeholder="E.g., Annual Tech Conference 2024" className={inputClass} {...register('title')} />
            <ErrorMsg error={errors.title} />
          </div>

          <div>
            <InputLabel label="Short Description (Summary)" required />
            <textarea rows={2} placeholder="A quick summary for event cards and SEO..." className={inputClass} {...register('shortDescription')} />
            <ErrorMsg error={errors.shortDescription} />
          </div>

          <div>
            <InputLabel label="Full Description" required />
            <textarea rows={5} placeholder="Tell attendees everything they need to know..." className={inputClass} {...register('description')} />
            <ErrorMsg error={errors.description} />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <InputLabel label="Category" required />
              <select className={inputClass} {...register('category')}>
                <option value="">Select Category...</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
              <ErrorMsg error={errors.category} />
            </div>
            <div>
              <InputLabel label="Tags (Comma separated)" />
              <input type="text" placeholder="react, web3, conference" className={inputClass} {...register('tags')} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Media Uploads */}
      <section className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <SectionHeading icon={ImageIcon} title="Event Media" subtitle="Upload high-quality images to attract attendees" />
        
        <div className="space-y-8">
          <div>
            <InputLabel label="Event Thumbnail (Required)" required />
            <p className="text-xs text-gray-500 mb-3">Used for event cards and lists. 16:9 ratio recommended.</p>
            <Controller
              name="thumbnail"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ImageUpload value={value} onChange={onChange} aspect="video" />
              )}
            />
            <ErrorMsg error={errors.thumbnail} />
          </div>

          <div>
            <InputLabel label="Event Banner (Optional)" />
            <p className="text-xs text-gray-500 mb-3">Displayed at the top of your event page.</p>
            <Controller
              name="banner"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ImageUpload value={value} onChange={onChange} aspect="video" />
              )}
            />
          </div>
        </div>
      </section>

      {/* 3. Location & Type */}
      <section className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <SectionHeading icon={MapPin} title="Location & Format" subtitle="Where and how will this event take place?" />
        
        <div className="space-y-6">
          <div>
            <InputLabel label="Event Format" required />
            <div className="flex flex-wrap gap-4 mt-2">
              {['ONLINE', 'OFFLINE', 'HYBRID'].map(type => (
                <label key={type} className={`
                  flex-1 min-w-[120px] text-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all
                  ${currentValues.type === type 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold' 
                    : 'border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:border-indigo-300'
                  }
                `}>
                  <input type="radio" value={type} className="hidden" {...register('type')} />
                  {type}
                </label>
              ))}
            </div>
            <ErrorMsg error={errors.type} />
          </div>

          {(currentValues.type === 'OFFLINE' || currentValues.type === 'HYBRID') && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <InputLabel label="Physical Venue Address" required />
              <input type="text" placeholder="123 Conference Center, New York, NY" className={inputClass} {...register('venue')} />
              <ErrorMsg error={errors.venue} />
            </div>
          )}

          {(currentValues.type === 'ONLINE' || currentValues.type === 'HYBRID') && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <InputLabel label="Meeting Link (Zoom, Meet, etc.)" required />
              <input type="text" placeholder="https://zoom.us/j/..." className={inputClass} {...register('meetingLink')} />
              <ErrorMsg error={errors.meetingLink} />
            </div>
          )}
        </div>
      </section>

      {/* 4. Date & Time */}
      <section className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <SectionHeading icon={CalendarDays} title="Date & Time" subtitle="When is it happening?" />
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <InputLabel label="Start Date & Time" required />
            <input type="datetime-local" className={inputClass} {...register('startDate')} />
            <ErrorMsg error={errors.startDate} />
          </div>
          <div>
            <InputLabel label="End Date & Time" required />
            <input type="datetime-local" className={inputClass} {...register('endDate')} />
            <ErrorMsg error={errors.endDate} />
          </div>
        </div>
      </section>

      {/* 5. Registration Settings */}
      <section className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <SectionHeading icon={Settings} title="Registration & Logistics" subtitle="Manage how attendees can join" />
        
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-800">
            <input type="checkbox" id="regReq" className="w-5 h-5 text-indigo-600 rounded" {...register('registrationRequired')} />
            <label htmlFor="regReq" className="font-medium text-gray-900 dark:text-white cursor-pointer select-none">
              Require Users to Register
            </label>
          </div>

          {currentValues.registrationRequired && (
            <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
              <div>
                <InputLabel label="Maximum Participants" />
                <input type="number" min="1" placeholder="Leave empty for unlimited" className={inputClass} {...register('maxParticipants')} />
                <ErrorMsg error={errors.maxParticipants} />
              </div>
              <div>
                <InputLabel label="Registration Deadline" />
                <input type="datetime-local" className={inputClass} {...register('registrationDeadline')} />
                <ErrorMsg error={errors.registrationDeadline} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. Publish Settings */}
      <section className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <SectionHeading icon={Eye} title="Visibility & Publishing" subtitle="Who can see this and when?" />
        
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <InputLabel label="Visibility" required />
            <select className={inputClass} {...register('visibility')}>
              <option value="PUBLIC">Public (Visible to everyone)</option>
              <option value="PRIVATE">Private (Only accessible via link)</option>
            </select>
          </div>
          <div>
            <InputLabel label="Status" required />
            <select className={inputClass} {...register('status')}>
              <option value="DRAFT">Save as Draft</option>
              <option value="PUBLISHED">Publish Immediately</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-zinc-800">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {initialData ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </section>

    </form>
  );
};

export default EventForm;
