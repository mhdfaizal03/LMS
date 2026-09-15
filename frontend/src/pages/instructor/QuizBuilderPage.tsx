import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import {
  ArrowLeft, Cloud, Settings, Play, Plus, Search,
  Check, Trash2, GripVertical, Image as ImageIcon, Video,
  Mic, Clock, Award, ChevronDown, MoreHorizontal, Sparkles,
  HelpCircle, CheckCircle2, Zap
} from 'lucide-react';

export const QuizBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
  const [isRequired, setIsRequired] = useState<boolean>(true);
  const [multipleAnswer, setMultipleAnswer] = useState<boolean>(true);
  const [answerWithImage, setAnswerWithImage] = useState<boolean>(true);
  const [selectedFontChoice, setSelectedFontChoice] = useState<number>(1);

  const questionsList = [
    { id: 1, title: 'What does UI stand fo...', type: 'Multiple choice' },
    { id: 2, title: 'Which aspect of UI de...', type: 'Multiple choice' },
    { id: 3, title: 'How to export a pictu...', type: 'Multiple choice' },
    { id: 4, title: 'Which term refers to t...', type: 'Multiple choice' },
    { id: 5, title: 'Why is maintaining co...', type: 'Multiple choice' },
    { id: 6, title: 'When selecting a style...', type: 'Fill in the Blank' },
    { id: 7, title: 'Among the options list...', type: 'Hotspot' },
    { id: 8, title: 'What is Style Direction...', type: 'Multiple Choice' },
  ];

  const fontChoices = [
    { id: 1, name: 'Playfair Display', fontStyle: "'Playfair Display', serif" },
    { id: 2, name: 'DM Serif Display', fontStyle: "'DM Serif Display', serif" },
    { id: 3, name: 'Josefin Sans', fontStyle: "'Josefin Sans', sans-serif" },
    { id: 4, name: 'Red Hat Display', fontStyle: "'Red Hat Display', sans-serif" },
    { id: 5, name: 'Quattrocento', fontStyle: "'Quattrocento', serif" },
  ];

  const standardChoices = [
    { id: 1, text: 'User Integration', isCorrect: false },
    { id: 2, text: 'User Interface', isCorrect: true },
    { id: 3, text: 'Universal Interaction', isCorrect: false },
    { id: 4, text: 'User Involvement', isCorrect: false },
  ];

  const handlePublish = () => {
    showToast('🎉 Quiz published live to all enrolled learners!', 'success');
    navigate('/instructor/courses');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)', backgroundColor: '#fafbfc' }}>
      {/* 1. TOP HEADER BAR */}
      <header
        style={{
          height: '60px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          backgroundColor: '#ffffff',
          zIndex: 20,
        }}
      >
        {/* Left: Back & Document Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/instructor/courses')}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Edited Just now</span>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.9375rem' }}>
            <span>📄 UI Design Fundamentals & Best Practice</span>
            <Cloud size={14} color="#06b6d4" />
            <ChevronDown size={14} color="#94a3b8" />
          </div>
        </div>

        {/* Right: Collaborator stack & actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '-4px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fef08a', color: '#854d0e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 800, border: '2px solid #ffffff' }}>
              RF
            </div>
            <button className="btn-icon" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px dashed #cbd5e1', padding: 0 }}>
              <Plus size={14} />
            </button>
          </div>

          <button className="btn-icon" style={{ width: '32px', height: '32px' }} title="Settings">
            <Settings size={16} />
          </button>

          <button
            onClick={() => showToast('Previewing quiz experience for students', 'info')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-md)' }}
          >
            <Play size={14} /> Preview
          </button>

          <button
            onClick={handlePublish}
            className="btn btn-primary btn-sm"
            style={{ backgroundColor: '#4338ca', borderRadius: 'var(--radius-md)', fontWeight: 700, padding: '6px 16px' }}
          >
            Publish
          </button>
        </div>
      </header>

      {/* 2. SPLIT LAYOUT: QUESTIONS LIST + QUIZ FORM */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Question Navigator */}
        <aside
          style={{
            width: '240px',
            borderRight: '1px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: '#ffffff',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>QUESTION (8)</span>
            <button
              onClick={() => showToast('New question added to quiz', 'success')}
              className="btn-icon"
              style={{ width: '24px', height: '24px', padding: 0 }}
              title="Add Question"
            >
              <Plus size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {questionsList.map((q) => (
              <div
                key={q.id}
                onClick={() => setActiveQuestionId(q.id)}
                style={{
                  backgroundColor: activeQuestionId === q.id ? '#f1f5f9' : 'transparent',
                  border: activeQuestionId === q.id ? '1px solid #cbd5e1' : '1px solid transparent',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{q.id}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748b' }}>
                  <span>☑ {q.type}</span>
                  <MoreHorizontal size={12} />
                </div>
              </div>
            ))}
          </div>

          {/* Result Screen item */}
          <div
            onClick={() => showToast('Configuring result screen pass/fail criteria', 'info')}
            style={{
              marginTop: 'auto',
              border: '1px dashed #cbd5e1',
              borderRadius: '10px',
              padding: '10px',
              backgroundColor: '#fafbfc',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>🖼️ Result Screen</div>
            <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '2px' }}>Set your Passed/failed massage</div>
          </div>
        </aside>

        {/* Center Main Question Form */}
        <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto', maxWidth: '1020px', margin: '0 auto', width: '100%' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '10px', left: '12px' }} />
            <input
              type="text"
              placeholder="Search..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0',
                fontSize: '0.8125rem',
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            />
          </div>

          {/* Yellow PRO Banner */}
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.8125rem', color: '#92400e' }}>
              Some Questions in this quiz are <strong>PRO Features</strong>, You can use these feature for 7 days, Upgrade to PRO for unlimited time
            </div>
            <button
              onClick={() => showToast('PRO subscription activated!', 'success')}
              className="btn btn-sm"
              style={{
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                flexShrink: 0,
              }}
            >
              Upgrade ⚡
            </button>
          </div>

          {/* Question Card Form (Images 2 & 4) */}
          <div
            className="card"
            style={{
              padding: '2rem',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e2e8f0',
              marginBottom: '2rem',
            }}
          >
            {/* Card Header: Type Dropdown & Required toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GripVertical size={16} color="#94a3b8" style={{ cursor: 'grab' }} />
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ☑ Multiple choice <ChevronDown size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                  <span>Required</span>
                  <input
                    type="checkbox"
                    checked={isRequired}
                    onChange={() => setIsRequired(!isRequired)}
                    style={{ accentColor: '#10b981', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                </label>
                <button className="btn-icon" style={{ width: '28px', height: '28px' }}>
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            {/* Question Prompt & Media Attachment */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(200px, 240px)', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'start' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  ❓ Question 1*
                </label>
                <textarea
                  defaultValue="Which of the following is included in serif typefaces?"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    outline: 'none',
                    resize: 'none',
                    backgroundColor: '#fafbfc',
                  }}
                />
              </div>

              {/* Media Preview Box */}
              <div
                style={{
                  height: '120px',
                  borderRadius: '12px',
                  backgroundColor: '#e0f2fe',
                  border: '1px solid #bae6fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  marginTop: '22px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <span style={{ fontSize: '2.5rem' }}>🖼️📐</span>
                <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '4px' }}>
                  <button className="btn-icon" style={{ width: '24px', height: '24px', backgroundColor: 'rgba(255,255,255,0.9)' }} title="Replace image">
                    <ImageIcon size={12} />
                  </button>
                  <button className="btn-icon" style={{ width: '24px', height: '24px', backgroundColor: 'rgba(255,255,255,0.9)', color: '#ef4444' }} title="Delete image">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Option Configuration Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>Choises*</span>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#475569', cursor: 'pointer' }}>
                <span>Multiple answer</span>
                <input
                  type="checkbox"
                  checked={multipleAnswer}
                  onChange={() => setMultipleAnswer(!multipleAnswer)}
                  style={{ accentColor: '#10b981', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#475569', cursor: 'pointer' }}>
                <span>Answer with image</span>
                <input
                  type="checkbox"
                  checked={answerWithImage}
                  onChange={() => setAnswerWithImage(!answerWithImage)}
                  style={{ accentColor: '#10b981', cursor: 'pointer' }}
                />
              </label>
            </div>

            {/* ============================================================ */}
            {/* FONT / IMAGE CARDS CHOICES (IMAGE 4)                         */}
            {/* ============================================================ */}
            {answerWithImage ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
                {fontChoices.map((fc) => (
                  <div
                    key={fc.id}
                    onClick={() => setSelectedFontChoice(fc.id)}
                    style={{
                      backgroundColor: '#1e1b4b',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '140px',
                      cursor: 'pointer',
                      border: selectedFontChoice === fc.id ? '2px solid #818cf8' : '2px solid transparent',
                      position: 'relative',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: '2px solid #ffffff',
                          backgroundColor: selectedFontChoice === fc.id ? '#818cf8' : 'transparent',
                        }}
                      />
                      <Trash2 size={12} color="#f87171" style={{ cursor: 'pointer' }} />
                    </div>

                    <div style={{ textAlign: 'center', color: '#ffffff', fontSize: '1.25rem', fontFamily: fc.fontStyle, fontWeight: 700 }}>
                      Font
                    </div>

                    <div style={{ backgroundColor: '#ffffff', color: '#0f172a', borderRadius: '6px', padding: '4px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                      {fc.name}
                    </div>
                  </div>
                ))}

                {/* Add Answer Card */}
                <div
                  onClick={() => showToast('Added new font choice option', 'success')}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '140px',
                    cursor: 'pointer',
                    color: '#64748b',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    gap: '6px',
                    backgroundColor: '#fafbfc',
                  }}
                >
                  <Plus size={18} />
                  <span>+ Add answers</span>
                </div>
              </div>
            ) : (
              /* Standard Radio Choices (Image 2) */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                {standardChoices.map((sc) => (
                  <div
                    key={sc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: '#fafbfc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="quiz_opt"
                        defaultChecked={sc.isCorrect}
                        style={{ accentColor: '#4338ca', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{sc.text}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <GripVertical size={14} color="#94a3b8" style={{ cursor: 'grab' }} />
                      <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => showToast('New choice option added', 'success')}
                  className="btn btn-secondary btn-sm"
                  style={{ border: '1px dashed #cbd5e1', borderRadius: '10px', fontWeight: 700 }}
                >
                  + Add answers
                </button>
              </div>
            )}

            {/* Footer Settings Row: Order, Time, Points */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
              <div>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Randomize Order
                </label>
                <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  Keep choices in current order <ChevronDown size={14} />
                </button>
              </div>

              <div>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Estimation time
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    defaultValue={2}
                    style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8125rem', fontWeight: 700, textAlign: 'center' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Mins ⏱️</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Mark as point
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    defaultValue={1}
                    style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8125rem', fontWeight: 700, textAlign: 'center' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>Points 🟡</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Help Button */}
      <button
        onClick={() => showToast('Need help configuring quiz rubrics? Ask Trenning AI!', 'info')}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '0.875rem',
          border: 'none',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
          cursor: 'pointer',
          zIndex: 90,
          transition: 'transform 0.15s ease',
        }}
        title="Help & Support"
      >
        ?
      </button>
    </div>
  );
};
