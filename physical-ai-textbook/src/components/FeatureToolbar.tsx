import React, { useState, useEffect } from 'react';
import { FEATURES, getBackendUrl } from '../utils/featureFlags';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export default function FeatureToolbar() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; level: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showUrduModal, setShowUrduModal] = useState(false);
  const [urduTranslation, setUrduTranslation] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');

  // Check login status and user level on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const level = localStorage.getItem('userLevel');
    setIsLoggedIn(!!token);
    setUserLevel(level);
  }, []);

  // Handle Urdu translation
  const handleUrduTranslate = async () => {
    const selection = window.getSelection()?.toString().trim();
    
    if (!selection || selection.length === 0) {
      // No text selected - show modal with instructions or translate page title
      setShowUrduModal(true);
      setSelectedText('');
      setUrduTranslation(null);
      return;
    }
    
    setSelectedText(selection);
    setShowUrduModal(true);
    setLoading(true);
    
    try {
      const res = await fetch(`${getBackendUrl()}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selection, target_language: 'urdu' }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setUrduTranslation(data.translation || data.translated_text);
      } else {
        // Fallback: show common translations
        setUrduTranslation(getLocalUrduTranslation(selection));
      }
    } catch {
      setUrduTranslation(getLocalUrduTranslation(selection));
    }
    setLoading(false);
  };

  // Local Urdu translations for common terms
  const getLocalUrduTranslation = (text: string): string => {
    const commonTerms: Record<string, string> = {
      'robot': 'روبوٹ',
      'artificial intelligence': 'مصنوعی ذہانت',
      'machine learning': 'مشین لرننگ',
      'simulation': 'نقالی / سمیولیشن',
      'sensor': 'سینسر / حساس آلہ',
      'motor': 'موٹر',
      'programming': 'پروگرامنگ',
      'code': 'کوڈ',
      'introduction': 'تعارف',
      'chapter': 'باب',
      'physical ai': 'فزیکل اے آئی',
      'ros': 'آر او ایس',
      'gazebo': 'گزیبو',
      'isaac sim': 'آئزک سم',
    };
    
    const lowerText = text.toLowerCase();
    for (const [eng, urdu] of Object.entries(commonTerms)) {
      if (lowerText.includes(eng)) {
        return `${text}\n\n🇵🇰 اردو ترجمہ:\n${urdu}\n\n(Note: For full translation, please ensure backend is running)`;
      }
    }
    
    return `Selected: "${text}"\n\n🇵🇰 اردو ترجمہ:\nبرائے مہربانی بیک اینڈ سرور چلائیں مکمل ترجمے کے لیے۔\n\n(Translation service requires backend connection)`;
  };

  // Default quiz questions
  const defaultQuestions: QuizQuestion[] = [
    { id: 1, question: "What does ROS2 stand for?", options: ["Robot Operating System 2", "Remote Operating System", "Robotic OS 2", "Real-time OS"], correct: 0 },
    { id: 2, question: "Which simulator is developed by NVIDIA?", options: ["Gazebo", "Isaac Sim", "Webots", "CoppeliaSim"], correct: 1 },
    { id: 3, question: "What is a VLA model?", options: ["Video Learning Algorithm", "Vision-Language-Action model", "Virtual Learning Agent", "Visual Language AI"], correct: 1 },
    { id: 4, question: "What communication pattern does ROS2 use?", options: ["HTTP/REST", "Publish/Subscribe", "FTP", "WebSocket only"], correct: 1 },
    { id: 5, question: "What is Gazebo used for?", options: ["Code editing", "Robot simulation", "Database management", "Web hosting"], correct: 1 },
  ];

  // Load quiz questions
  const loadQuiz = async () => {
    setLoading(true);
    setQuizResult(null);
    setQuizAnswers({});
    
    try {
      const res = await fetch(`${getBackendUrl()}/api/quiz/questions`);
      if (res.ok) {
        const data = await res.json();
        // Validate response has proper structure
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          const validQuestions = data.questions.filter(
            (q: any) => q && q.id && q.question && Array.isArray(q.options) && q.options.length > 0
          );
          if (validQuestions.length > 0) {
            setQuizQuestions(validQuestions);
            setShowQuiz(true);
            setLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.log('Using default quiz questions');
    }
    
    // Fallback to default questions
    setQuizQuestions(defaultQuestions);
    setShowQuiz(true);
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
    setUserLevel(level);
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

  // Handle personalization
  const handlePersonalize = async () => {
    const level = localStorage.getItem('userLevel');
    if (!level) {
      setShowQuiz(true);
      return;
    }
    setShowPersonalize(true);
    setLoading(true);
    
    try {
      // Get current page slug from URL
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const chapterSlug = pathParts[pathParts.length - 1] || 'introduction';
      
      const res = await fetch(`${getBackendUrl()}/api/personalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_slug: chapterSlug, user_level: level }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setPersonalizedContent(data.content || `Content personalized for ${level} level learners.`);
      } else {
        // Generate local personalization message
        setPersonalizedContent(getLocalPersonalization(level, chapterSlug));
      }
    } catch {
      const level = localStorage.getItem('userLevel') || 'beginner';
      setPersonalizedContent(getLocalPersonalization(level, 'this topic'));
    }
    setLoading(false);
  };

  // Generate local personalization based on level
  const getLocalPersonalization = (level: string, topic: string): string => {
    const tips: Record<string, string> = {
      beginner: `🎯 **Beginner Tips for ${topic}:**\n\n• Start with the basics - don't skip foundational concepts\n• Practice with simple examples first\n• Use the chatbot to ask "explain like I'm new"\n• Focus on understanding WHY before HOW\n• Take notes and revisit difficult sections`,
      intermediate: `📈 **Intermediate Tips for ${topic}:**\n\n• Connect this topic to what you already know\n• Try modifying the code examples\n• Explore the "Why" behind design decisions\n• Challenge yourself with the exercises\n• Start building small projects using these concepts`,
      advanced: `🚀 **Advanced Tips for ${topic}:**\n\n• Dive into edge cases and optimizations\n• Explore the source code and implementations\n• Consider contributing to open-source projects\n• Mentor others - teaching deepens understanding\n• Explore research papers in this area`,
    };
    return tips[level] || tips.beginner;
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
            onClick={handleUrduTranslate}
            className="toolbar-btn urdu-btn"
            title="Urdu Translation - Select text first!"
          >
            🇵🇰 اردو
          </button>
        )}
        {FEATURES.PERSONALIZATION && (
          <button 
            onClick={handlePersonalize}
            className="toolbar-btn personalize-btn"
            title="Personalize Content"
          >
            ✨ {userLevel ? `Level: ${userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}` : 'Personalize'}
          </button>
        )}
      </div>

      {/* Personalization Modal */}
      {showPersonalize && (
        <div className="quiz-modal-overlay" onClick={() => setShowPersonalize(false)}>
          <div className="quiz-modal" onClick={e => e.stopPropagation()}>
            <h2>✨ Personalized Learning</h2>
            {loading ? (
              <p>⏳ Generating personalized content...</p>
            ) : (
              <div className="personalized-content">
                <div className={`level-badge ${userLevel}`} style={{ marginBottom: '1rem' }}>
                  Your Level: {userLevel?.toUpperCase()}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {personalizedContent}
                </div>
              </div>
            )}
            <button className="close-quiz" onClick={() => setShowPersonalize(false)}>×</button>
          </div>
        </div>
      )}

      {/* Urdu Translation Modal */}
      {showUrduModal && (
        <div className="quiz-modal-overlay" onClick={() => setShowUrduModal(false)}>
          <div className="quiz-modal" onClick={e => e.stopPropagation()}>
            <h2>🇵🇰 اردو ترجمہ (Urdu Translation)</h2>
            {!selectedText ? (
              <div className="urdu-instructions">
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                  <strong>How to use:</strong>
                </p>
                <ol style={{ textAlign: 'left', lineHeight: 1.8 }}>
                  <li>Select any text on the page with your mouse</li>
                  <li>Click the 🇵🇰 اردو button again</li>
                  <li>See the Urdu translation!</li>
                </ol>
                <p style={{ marginTop: '1rem', color: '#666' }}>
                  💡 Tip: You can also use the chatbot and type "translate to Urdu: [your text]"
                </p>
              </div>
            ) : loading ? (
              <p>⏳ ترجمہ ہو رہا ہے... (Translating...)</p>
            ) : (
              <div className="urdu-translation-result">
                <div className="english-text-box">
                  <strong>📖 English:</strong>
                  <p style={{ marginTop: '0.5rem' }}>{selectedText}</p>
                </div>
                <div className="urdu-text-box">
                  <span className="urdu-label">🇵🇰 اردو ترجمہ:</span>
                  <p className="urdu-translation-text">
                    {urduTranslation}
                  </p>
                </div>
              </div>
            )}
            <button className="close-quiz" onClick={() => setShowUrduModal(false)}>×</button>
          </div>
        </div>
      )}

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
                      {Array.isArray(q.options) && q.options.map((opt, optIdx) => (
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
