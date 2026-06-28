import React from 'react';
import { 
  Sparkles, HelpCircle, Shield, UserCheck, 
  Calendar, CheckCircle2, AlertCircle, Circle
} from 'lucide-react';
import DOMPurify from 'dompurify';

/**
 * Step 4: Review Step
 * 
 * A premium, read-only summary of all configured poll data 
 * before the user hits publish.
 */
const ReviewStep = ({ data }) => {
  // Gracefully fallback to empty structures if data is missing during dev
  const { 
    title = '',
    description = '',
    thumbnailUrl = '',
    questions = [], 
    settings = { isAnonymous: false, requireAuth: false, expiryDate: '', expiryTime: '' } 
  } = data || {};

  return (
    <div className="max-w-3xl mx-auto flex flex-col space-y-10">
      
      {/* Header */}
      <div className="space-y-1.5 mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
          <Sparkles className="w-6 h-6 text-orange-500" />
          Review & Publish
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Verify your configuration. Questions cannot be edited after publishing.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* --------------------------------------------------------
            Section 1: Poll Details
        -------------------------------------------------------- */}
        <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500">
              <span className="font-bold text-sm">1</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">General Details</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-1">Poll Title</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {title || <span className="text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Missing Title</span>}
              </p>
            </div>
            {thumbnailUrl && (
              <div>
                <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-1">Thumbnail</p>
                <div className="w-full sm:w-48 aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800">
                  <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            {description && (
              <div>
                <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-1">Description</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* --------------------------------------------------------
            Section 2: Privacy & Settings
        -------------------------------------------------------- */}
        <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500">
              <span className="font-bold text-sm">2</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Settings Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Auth Rule */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-zinc-800">
              <Shield className={`w-5 h-5 ${settings.requireAuth ? 'text-green-500' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Authentication</p>
                <p className="text-xs text-gray-500">{settings.requireAuth ? 'Required to vote' : 'Public voting allowed'}</p>
              </div>
            </div>

            {/* Anonymity Rule */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-zinc-800">
              <UserCheck className={`w-5 h-5 ${settings.isAnonymous ? 'text-purple-500' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Anonymity</p>
                <p className="text-xs text-gray-500">{settings.isAnonymous ? 'Voter identity hidden' : 'Voter identity visible'}</p>
              </div>
            </div>

            {/* Expiry Rule */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-zinc-800 sm:col-span-2">
              <Calendar className={`w-5 h-5 ${settings.expiryDate ? 'text-orange-500' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Poll Expiry</p>
                <p className="text-xs text-gray-500">
                  {settings.expiryDate 
                    ? `Closes on ${settings.expiryDate} ${settings.expiryTime ? `at ${settings.expiryTime}` : ''}`
                    : 'Runs indefinitely until manually closed'
                  }
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* --------------------------------------------------------
            Section 3: Questions Review
        -------------------------------------------------------- */}
        <section className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500">
                <span className="font-bold text-sm">3</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Questions</h3>
            </div>
            <span className="text-sm font-medium text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-full">
              {questions.length} Total
            </span>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-6">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-red-500">You haven't added any questions!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={q.id || index} className="space-y-3">
                  
                  {/* Question Header */}
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      {q.text ? (
                        <div 
                          className="text-sm font-semibold text-gray-900 dark:text-white leading-tight [&>p]:m-0 inline-block"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(q.text) }}
                        />
                      ) : (
                        <p className="text-sm font-semibold text-red-500 italic leading-tight">Untitled Question</p>
                      )}
                      <p className="text-xs font-medium text-gray-500 mt-1">
                        {q.isRequired ? 'Required' : 'Optional'} • {q.options?.length || 0} Options
                      </p>
                    </div>
                  </div>

                  {/* Question Options */}
                  <div className="pl-8 space-y-2">
                    {q.options?.map((opt, optIndex) => (
                      <div key={opt.id || optIndex} className={`flex items-center gap-2 text-sm font-medium ${opt.isCorrect ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-600 dark:text-gray-300'}`}>
                        {opt.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span>{opt.text || <span className="text-red-400 italic">Empty Option</span>}</span>
                        {opt.isCorrect && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                            Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default ReviewStep;
