import React, { useState } from 'react';
import { FEATURES, getBackendUrl } from '../utils/featureFlags';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export default function FeatureToolbar() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; level: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Load quiz questions
  const loadQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getBackendUrl()}/api/quiz/questions`);
      if (res.ok) {
        const data = await res.json();
        setQuizQuestions(data.questions || []);
        setShowQuiz(true);
        setQuizResult(null);
        setQuizAnswers({});
      }
    } catch (e) {
      // Use demo questions if backend unavailable
      setQuizQuestions([
        { id: 1, question: "What does ROS2 stand for?", options: ["Robot Operating System 2", "Remote Operating System", "Robotic OS 2", "Real-time OS"], correct: 0 },
        { id: 2, question: "Which simulator is developed by NVIDIA?", options: ["Gazebo", "Isaac Sim", "Webots", "CoppeliaSim"], correct: 1 },
        { id: 3, question: "What is a VLA model?", options: ["Video Learning Algorithm", "Vision-Language-Action model", "Virtual Learning Agent", "Visual Language AI"], correct: 1 },
      ]);
      setShowQuiz(true);
      setQuizResult(null);
      setQuizAnswers({});
    }
    setLoading(false);
  };

  // Submit quiz
  const submitQuiz = async () => {
    const score = quizQuestions.reduce((acc, q) => {
      return acc + (quizAnswers[q.id] === q.correct ? 1 : 0);
    }, 0);
    const percentage = (score / quizQuestions.length) * 100;
    const level = percentage >= 80 ? 'advanced' : percentage >= 50 ? 'intermediate' : 'beginner';
    
    setQuizResult({ score, level });
    localStorage.setItem('userLevel', level);

    // Try to save to backend
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await fetch(`${getBackendUrl()}/api/quiz/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, answers: quizAnswers, score }),
        });
      }
    } catch {}
  };

  return (
    <>
      {/* Floating Toolbar */}
      <div className="feature-toolbar">
        {FEATURES.QUIZ && (
          <button onClick={loadQuiz} className="toolbar-btn quiz-btn" title="Take Quiz">
            📝 Quiz
          </button>
        )}
        {FEATURES.URDU_TRANSLATION && (
          <button 
            onClick={() => alert('Select text on the page, then use the chatbot to translate!')} 
            className="toolbar-btn urdu-btn"
            title="Urdu Translation"
          >
            🇵🇰 اردو
          </button>
        )}
        {FEATURES.PERSONALIZATION && (
          <button 
            onClick={() => alert('Login and take the quiz to unlock personalized content!')} 
            className="toolbar-btn personalize-btn"
            title="Personalize Content"
          >
            ✨ Personalize
          </button>
        )}
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="quiz-modal-overlay" onClick={() => setShowQuiz(false)}>
          <div className="quiz-modal" onClick={e => e.stopPropagation()}>
            <h2>📝 Knowledge Quiz</h2>
            
            {quizResult ? (
              <div className="quiz-result">
                <h3>Your Score: {quizResult.score}/{quizQuestions.length}</h3>
                <p className={`level-badge ${quizResult.level}`}>
                  Level: {quizResult.level.toUpperCase()}
                </p>
                <p>Content will now be personalized to your level!</p>
                <button onClick={() => setShowQuiz(false)}>Close</button>
              </div>
            ) : (
              <>
                {quizQuestions.map((q, idx) => (
                  <div key={q.id} className="quiz-question">
                    <p><strong>{idx + 1}. {q.question}</strong></p>
                    <div className="quiz-options">
                      {q.options.map((opt, optIdx) => (
                        <label key={optIdx} className="quiz-option">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={quizAnswers[q.id] === optIdx}
                            onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button 
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                  className="submit-quiz-btn"
                >
                  Submit Quiz
                </button>
              </>
            )}
            <button className="close-quiz" onClick={() => setShowQuiz(false)}>×</button>
          </div>
        </div>
      )}

      <style>{`
        .feature-toolbar {
          position: fixed;
          left: 1rem;
          bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 998;
        }
        .toolbar-btn {
          padding: 0.5rem 0.75rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.8rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: transform 0.2s;
        }
        .toolbar-btn:hover {
          transform: scale(1.05);
        }
        .quiz-btn { background: #3b82f6; color: white; }
        .urdu-btn { background: #059669; color: white; }
        .personalize-btn { background: #8b5cf6; color: white; }

        .quiz-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
        }
        .quiz-modal {
          background: var(--ifm-background-color);
          padding: 2rem;
          border-radius: 12px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }
        .quiz-modal h2 {
          margin: 0 0 1.5rem;
        }
        .quiz-question {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--ifm-color-emphasis-200);
        }
        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .quiz-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: var(--ifm-color-emphasis-100);
          border-radius: 6px;
          cursor: pointer;
        }
        .quiz-option:hover {
          background: var(--ifm-color-emphasis-200);
        }
        .submit-quiz-btn {
          width: 100%;
          padding: 0.75rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        }
        .submit-quiz-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .quiz-result {
          text-align: center;
        }
        .quiz-result h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        .level-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .level-badge.beginner { background: #fef3c7; color: #92400e; }
        .level-badge.intermediate { background: #dbeafe; color: #1e40af; }
        .level-badge.advanced { background: #d1fae5; color: #065f46; }
        .quiz-result button {
          padding: 0.5rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .close-quiz {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--ifm-color-emphasis-600);
        }

        @media (max-width: 768px) {
          .feature-toolbar {
            flex-direction: row;
            bottom: 5rem;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
}
