import React, { useState, useEffect } from 'react';
import { Quiz, QuizAttempt, Question } from '../../types';
import { quizApi } from '../../api';
import { useNotification } from '../../context/NotificationContext';
import confetti from 'canvas-confetti';
import {
  HelpCircle, Clock, CheckCircle2, XCircle, RotateCcw, Award, AlertCircle
} from 'lucide-react';

interface QuizTakerProps {
  quiz: Quiz;
  onQuizCompleted?: (attempt: QuizAttempt) => void;
}

export const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, onQuizCompleted }) => {
  const { showToast } = useNotification();

  const [currentAnswers, setCurrentAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState<number>((quiz.time_limit_minutes || 30) * 60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  useEffect(() => {
    quizApi.getMyAttempts(quiz.id).then((data) => {
      setAttempts(data);
      if (data.length > 0) {
        setLatestAttempt(data[0]);
      }
    }).catch(console.error);
  }, [quiz.id]);

  useEffect(() => {
    if (!isStarted || timeLeft <= 0 || latestAttempt) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isStarted, timeLeft, latestAttempt]);

  const handleOptionSelect = (questionId: number, optionId: string, isMultiple: boolean) => {
    if (latestAttempt) return;
    if (isMultiple) {
      const existing: string[] = currentAnswers[questionId] || [];
      if (existing.includes(optionId)) {
        setCurrentAnswers({
          ...currentAnswers,
          [questionId]: existing.filter((id) => id !== optionId),
        });
      } else {
        setCurrentAnswers({
          ...currentAnswers,
          [questionId]: [...existing, optionId],
        });
      }
    } else {
      setCurrentAnswers({
        ...currentAnswers,
        [questionId]: optionId,
      });
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(currentAnswers).map(([qId, ans]) => ({
        question_id: Number(qId),
        user_answer: ans,
      }));

      const attempt = await quizApi.submitQuiz(quiz.id, formattedAnswers);
      setLatestAttempt(attempt);
      setAttempts((prev) => [attempt, ...prev]);

      if (attempt.is_passed) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        showToast(`🎉 Passed! You scored ${attempt.percentage}%`, 'success');
      } else {
        showToast(`Quiz completed. Score: ${attempt.percentage}%. Passing score is ${quiz.passing_score}%`, 'warning');
      }

      if (onQuizCompleted) onQuizCompleted(attempt);
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to submit quiz', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    const maxAttempts = quiz.max_attempts || 3;
    if (attempts.length >= maxAttempts) {
      showToast(`Maximum attempts (${maxAttempts}) reached`, 'warning');
      return;
    }
    setLatestAttempt(null);
    setCurrentAnswers({});
    setTimeLeft((quiz.time_limit_minutes || 30) * 60);
    setIsStarted(true);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isStarted && !latestAttempt) {
    return (
      <div className="card" style={{ maxWidth: '650px', margin: '2rem auto', textAlign: 'center', padding: '2.5rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <HelpCircle size={32} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{quiz.title}</h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {quiz.instructions || quiz.description || 'Test your understanding of the concepts covered in this module.'}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Questions</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{quiz.questions?.length || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Time Limit</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{quiz.time_limit_minutes} mins</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Passing Score</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{quiz.passing_score}%</div>
          </div>
        </div>

        <button
          onClick={() => setIsStarted(true)}
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
        >
          Start Quiz Now
        </button>
      </div>
    );
  }

  // Quiz in progress or review
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Quiz Header Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{quiz.title}</h4>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Attempt {attempts.length} of {quiz.max_attempts}
          </span>
        </div>

        {!latestAttempt && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: timeLeft < 60 ? 'var(--danger-light)' : 'var(--primary-light)',
              color: timeLeft < 60 ? 'var(--danger)' : 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.9375rem',
            }}
          >
            <Clock size={16} />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        )}

        {latestAttempt && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${latestAttempt.is_passed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.875rem' }}>
              {latestAttempt.is_passed ? 'PASSED' : 'FAILED'} — {latestAttempt.percentage}%
            </span>
          </div>
        )}
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        {quiz.questions?.map((q, idx) => {
          const isMultiple = q.question_type === 'multiple_choice';
          const selected = currentAnswers[q.id];

          return (
            <div key={q.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {idx + 1}. {q.question_text}
                </span>
                <span className="badge badge-secondary" style={{ fontSize: '0.6875rem' }}>
                  {q.marks} {q.marks === 1 ? 'pt' : 'pts'}
                </span>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(Array.isArray(q.options) ? q.options : []).map((opt: any) => {
                  const isChecked = isMultiple
                    ? Array.isArray(selected) && selected.includes(opt.id)
                    : selected === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleOptionSelect(q.id, opt.id, isMultiple)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isChecked ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                        border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                        cursor: latestAttempt ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <input
                        type={isMultiple ? 'checkbox' : 'radio'}
                        name={`q_${q.id}`}
                        checked={isChecked}
                        readOnly
                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation after completion */}
              {latestAttempt && q.explanation && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Submit / Retake Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        {!latestAttempt ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
          >
            {isSubmitting ? 'Submitting & Grading...' : 'Submit Answers'}
          </button>
        ) : (
          attempts.length < (quiz.max_attempts || 3) && (
            <button onClick={handleRetake} className="btn btn-primary">
              <RotateCcw size={16} /> Retake Quiz ({(quiz.max_attempts || 3) - attempts.length} attempts left)
            </button>
          )
        )}
      </div>
    </div>
  );
};
