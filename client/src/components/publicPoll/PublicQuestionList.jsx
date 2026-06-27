import React from 'react';
import PublicQuestionCard from './PublicQuestionCard';

/**
 * Public Question List
 * 
 * A pure presentation component that maps over the poll's questions 
 * and renders individual question cards. Manages passing down the form state.
 */
const PublicQuestionList = ({ questions = [], answers = {}, setAnswers }) => {
  
  if (!questions || questions.length === 0) {
    return null;
  }

  // Handler to safely update the answers dictionary in the parent page
  const handleAnswerChange = (questionId, value) => {
    if (setAnswers) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value
      }));
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 sm:space-y-8">
      {questions.map((question, index) => (
        <PublicQuestionCard
          key={question._id || index}
          index={index + 1} // For numbering questions (e.g., "1.", "2.")
          question={question}
          currentAnswer={answers[question._id]}
          onAnswerChange={(value) => handleAnswerChange(question._id, value)}
        />
      ))}
    </div>
  );
};

export default PublicQuestionList;
