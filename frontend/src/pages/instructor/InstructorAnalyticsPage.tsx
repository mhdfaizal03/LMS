import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrenningIconRail } from '../../components/trenning/TrenningIconRail';
import { DonutProgressRing } from '../../components/trenning/DonutProgressRing';
import { AskAIModal } from '../../components/trenning/AskAIModal';
import { useNotification } from '../../context/NotificationContext';
import {
  ArrowLeft, Share2, MoreHorizontal, Edit3, CheckCircle,
  Clock, Award, HelpCircle, ArrowUpDown, ChevronDown, Sparkles,
  Download, Trash2, Printer, Search, Check, X
} from 'lucide-react';

export const InstructorAnalyticsPage: React.FC = () => {
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'questions' | 'overview'>('overview');
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [matrixSearch, setMatrixSearch] = useState<string>('');
  const [activePopover, setActivePopover] = useState<{
    learnerName: string;
    questionNum: string;
    questionText: string;
    avgTime: string;
    score: string;
    learnerResponse: string;
    isCorrect: boolean;
  } | null>({
    learnerName: 'Ardhi',
    questionNum: 'Question 2',
    questionText: 'Which aspect of UI design involves choosing colors, typography, and creating icons for a digital interface?',
    avgTime: '2 Mins',
    score: '1 Point',
    learnerResponse: 'Interaction Design',
    isCorrect: false,
  });

  const questionsData = [
    {
      id: 1,
      num: 'Question 1 of 20',
      type: 'Multiple choice',
      avgTime: '32s',
      points: '1 point',
      question: 'What does UI stand for in the context of design?',
      options: [
        { text: 'User Integration', resp: 0, pct: 0, isCorrect: false },
        { text: 'User Interface', resp: 13, pct: 70, isCorrect: true },
        { text: 'Universal Interaction', resp: 5, pct: 25, isCorrect: false },
        { text: 'User Information', resp: 2, pct: 5, isCorrect: false },
      ],
      stats: { correct: 13, incorrect: 7, accuracy: 65 },
    },
    {
      id: 2,
      num: 'Question 3 of 20',
      type: 'Multiple choice',
      avgTime: '32s',
      points: '1 point',
      question: 'How to export a picture instantly in Figma?',
      options: [
        { text: 'Go to "File" > "Export" and choose your image format.', resp: 5, pct: 25, isCorrect: false },
        { text: 'Click on your image in Figma, go to "Export" on the right, adjust settings, and click "Export."', resp: 11, pct: 55, isCorrect: true },
        { text: 'Right-click the image and select "Export Image."', resp: 1, pct: 5, isCorrect: false },
        { text: 'Hover over the image, and press Ctrl + E (Windows) or Command + E (Mac) to instantly download.', resp: 3, pct: 15, isCorrect: false },
      ],
      stats: { correct: 11, incorrect: 9, accuracy: 55 },
    },
    {
      id: 3,
      num: 'Question 4 of 20',
      type: 'Multiple choice',
      avgTime: '32s',
      points: '1 point',
      question: 'Which term refers to the interactive elements such as buttons, forms, and navigation menus in a user interface?',
      options: [
        { text: 'User Interaction Elements', resp: 1, pct: 5, isCorrect: false },
        { text: 'UI Components / Controls', resp: 15, pct: 75, isCorrect: true },
        { text: 'Information Architecture', resp: 3, pct: 15, isCorrect: false },
        { text: 'Backend Integrations', resp: 1, pct: 5, isCorrect: false },
      ],
      stats: { correct: 15, incorrect: 5, accuracy: 75 },
    },
  ];

  // Learner Scorecard Matrix (Image 5)
  const scorecardData = [
    { id: 1, name: 'Adit irwan', role: 'Jr UI/UX Designer', tag: 'Design', avatar: 'AI', pts: 30, q1: true, q2: true, q3: true, q4: true, q5: true, q6: true },
    { id: 2, name: 'Arif Brata', role: 'Jr UI/UX Designer', tag: 'Design', avatar: '👨‍🎨', pts: 30, q1: true, q2: true, q3: true, q4: false, q5: true, q6: true },
    { id: 3, name: 'Ardhi Irwandi', role: 'Sr UI/UX Designer', tag: 'Design', avatar: '👨‍💼', pts: 30, q1: true, q2: false, q3: true, q4: false, q5: true, q6: true },
    { id: 4, name: 'Bagus Yuli', role: 'Sr UI/UX Designer', tag: 'Design', avatar: '👨‍💻', pts: 30, q1: true, q2: true, q3: true, q4: true, q5: true, q6: true },
    { id: 5, name: 'Bani Naon', role: 'Jr UI/UX Designer', tag: 'Design', avatar: 'BN', pts: 30, q1: true, q2: true, q3: true, q4: true, q5: true, q6: false },
    { id: 6, name: 'Brian', role: 'Sr UI/UX Designer', tag: 'Design', avatar: '👨‍🏫', pts: 30, q1: true, q2: true, q3: true, q4: false, q5: false, q6: true },
    { id: 7, name: 'Brian Domani', role: 'Sr UI/UX Designer', tag: 'Design', avatar: 'BR', pts: 30, q1: true, q2: true, q3: true, q4: true, q5: true, q6: true },
    { id: 8, name: 'Depe Prada', role: 'PM UI/UX Designer', tag: 'Design', avatar: 'DP', pts: 30, q1: true, q2: true, q3: true, q4: true, q5: true, q6: false },
    { id: 9, name: 'Fauzan Aziz', role: 'Md UI/UX Designer', tag: 'Design', avatar: 'FA', pts: 30, q1: true, q2: true, q3: true, q4: true, q5: false, q6: true },
    { id: 10, name: 'Friza Dipa', role: 'Jr Animation', tag: 'Design', avatar: '👨‍🎓', pts: 30, q1: true, q2: true, q3: true, q4: true, q5: true, q6: true },
  ];

  return (
    <div className="trenning-layout">
      {/* Icon Navigation Rail */}
      <TrenningIconRail
        activeTab="reports"
        onOpenAI={() => setShowAIModal(true)}
      />

      {/* Main Analytics Content */}
      <main className="trenning-content-main" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Breadcrumbs & Top Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <button
              onClick={() => navigate('/instructor/courses')}
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              title="Back to courses"
            >
              <ArrowLeft size={16} />
            </button>
            <span style={{ color: '#64748b' }}>Quiz</span>
            <span style={{ color: '#94a3b8' }}>/</span>
            <span style={{ fontWeight: 700, color: 'inherit' }}>Senior Designer End of Year Quiz</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => showToast('Exported PDF report', 'success')} className="btn-icon" title="Download">
              <Download size={16} />
            </button>
            <button onClick={() => showToast('Report printed', 'info')} className="btn-icon" title="Print">
              <Printer size={16} />
            </button>
            <button onClick={() => showToast('Moved to trash', 'error')} className="btn-icon" title="Delete">
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => showToast('Report link copied to clipboard!', 'success')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-md)' }}
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* Yellow Review Alert Banner */}
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8125rem',
            color: '#92400e',
            marginBottom: '1.5rem',
          }}
        >
          <span>❓</span>
          <span><strong>1 Question</strong> needs a review for thorough scoring!</span>
          <button
            onClick={() => showToast('Opening question review modal...', 'info')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4338ca',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              marginLeft: '4px',
            }}
          >
            View Question
          </button>
        </div>

        {/* Quiz Overview Hero Card */}
        <div
          className="card"
          style={{
            padding: '2rem',
            borderRadius: '24px',
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(280px, 1fr)',
            gap: '2rem',
            alignItems: 'center',
            background: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Left Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-secondary" style={{ color: '#64748b' }}>
                ((•)) LIVE
              </span>
              <span className="badge badge-success">
                ✓ Completed
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'inherit' }}>
                UI Design Fundamentals & Best Practice
              </h1>
              <button className="btn-icon" style={{ width: '28px', height: '28px' }}>
                <Edit3 size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-secondary">Fundamental</span>
              <span className="badge badge-secondary">Design</span>
              <span className="badge badge-secondary">Not Urgent</span>
            </div>

            <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.5rem' }}>
              📄 Quiz &bull; 🗲 20 Question &bull; Started date 28 Sep 2023
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
              <DonutProgressRing
                label="Accuracy"
                percentage={50}
                size={38}
                color="#f59e0b"
              />
              <DonutProgressRing
                label="Completed Course"
                percentage={100}
                size={38}
                color="#10b981"
              />
              <div>
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 500 }}>Submissions</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>20</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 500 }}>Avg. Complete Time</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>04:20</div>
              </div>
            </div>
          </div>

          {/* Right Isometric Graphic Banner */}
          <div
            style={{
              height: '160px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4.5rem',
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
            }}
          >
            🎨📐
          </div>
        </div>

        {/* Sub-Tabs: Questions & Overview */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #f1f5f9', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('questions')}
            className={`trenning-tab ${activeTab === 'questions' ? 'active' : ''}`}
          >
            Questions
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`trenning-tab ${activeTab === 'overview' ? 'active' : ''}`}
          >
            Overview
          </button>
        </div>

        {/* ============================================================ */}
        {/* OVERVIEW TAB: LEARNER SCORECARD MATRIX (IMAGE 3)            */}
        {/* ============================================================ */}
        {activeTab === 'overview' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '9px', left: '10px' }} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 12px 6px 32px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.8125rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div className="card" style={{ padding: '0', borderRadius: '18px', overflow: 'hidden', position: 'relative' }}>
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Learner ⇅</th>
                    <th>Points ⇅</th>
                    <th>No.1 <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#94a3b8', display: 'block' }}>100%</span></th>
                    <th>No.2 <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#94a3b8', display: 'block' }}>100%</span></th>
                    <th>No.3 <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#94a3b8', display: 'block' }}>100%</span></th>
                    <th>No.4 <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#94a3b8', display: 'block' }}>68%</span></th>
                    <th>No.5 <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#94a3b8', display: 'block' }}>90%</span></th>
                    <th>No.6 <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#94a3b8', display: 'block' }}>80%</span></th>
                  </tr>
                </thead>
                <tbody>
                  {scorecardData.map((row, idx) => (
                    <tr key={row.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, color: '#94a3b8', width: '16px' }}>{idx + 1}</span>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 800 }}>
                            {row.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                              {row.name} <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 400 }}>{row.tag}</span>
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{row.role}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#b45309' }}>🪙 {row.pts} points</span>
                      </td>
                      <td>
                        <button
                          onClick={() => setActivePopover({
                            learnerName: row.name.split(' ')[0],
                            questionNum: 'Question 1',
                            questionText: 'What does UI stand for in the context of design?',
                            avgTime: '32s',
                            score: '1 Point',
                            learnerResponse: 'User Interface',
                            isCorrect: true,
                          })}
                          className="badge-check"
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          <Check size={14} />
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => setActivePopover({
                            learnerName: row.name.split(' ')[0],
                            questionNum: 'Question 2',
                            questionText: 'Which aspect of UI design involves choosing colors, typography, and creating icons for a digital interface?',
                            avgTime: '2 Mins',
                            score: '1 Point',
                            learnerResponse: row.q2 ? 'Visual / Interface Design' : 'Interaction Design',
                            isCorrect: row.q2,
                          })}
                          className={row.q2 ? 'badge-check' : 'badge-cross'}
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          {row.q2 ? <Check size={14} /> : <X size={14} />}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => setActivePopover({
                            learnerName: row.name.split(' ')[0],
                            questionNum: 'Question 3',
                            questionText: 'How to export a picture instantly in Figma?',
                            avgTime: '32s',
                            score: '1 Point',
                            learnerResponse: 'Click on image and export',
                            isCorrect: true,
                          })}
                          className="badge-check"
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          <Check size={14} />
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => setActivePopover({
                            learnerName: row.name.split(' ')[0],
                            questionNum: 'Question 4',
                            questionText: 'Which term refers to interactive elements like buttons and forms?',
                            avgTime: '32s',
                            score: '1 Point',
                            learnerResponse: row.q4 ? 'UI Components / Controls' : 'Information Architecture',
                            isCorrect: row.q4,
                          })}
                          className={row.q4 ? 'badge-check' : 'badge-cross'}
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          {row.q4 ? <Check size={14} /> : <X size={14} />}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => setActivePopover({
                            learnerName: row.name.split(' ')[0],
                            questionNum: 'Question 5',
                            questionText: 'Why is maintaining consistency essential across components?',
                            avgTime: '45s',
                            score: '1 Point',
                            learnerResponse: row.q5 ? 'Prevents cognitive overload' : 'Speeds up server time',
                            isCorrect: row.q5,
                          })}
                          className={row.q5 ? 'badge-check' : 'badge-cross'}
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          {row.q5 ? <Check size={14} /> : <X size={14} />}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => setActivePopover({
                            learnerName: row.name.split(' ')[0],
                            questionNum: 'Question 6',
                            questionText: 'What is Style Direction in branding?',
                            avgTime: '1 Min',
                            score: '1 Point',
                            learnerResponse: row.q6 ? 'Visual language of brand' : 'Backend schema design',
                            isCorrect: row.q6,
                          })}
                          className={row.q6 ? 'badge-check' : 'badge-cross'}
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          {row.q6 ? <Check size={14} /> : <X size={14} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Popover Floating Tooltip Card (Image 5) */}
              {activePopover && (
                <div
                  style={{
                    position: 'absolute',
                    top: '180px',
                    left: '380px',
                    width: '320px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.15)',
                    padding: '1.25rem',
                    zIndex: 50,
                    animation: 'modalIn 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                      <span>❓ {activePopover.questionNum}</span>
                      <span>•</span>
                      <span style={{ color: '#64748b' }}>☑ Multiple Choice</span>
                    </div>
                    <button onClick={() => setActivePopover(null)} className="btn-icon" style={{ width: '20px', height: '20px', padding: 0 }}>
                      <X size={12} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#0f172a', fontWeight: 600, lineHeight: 1.4, marginBottom: '12px' }}>
                    {activePopover.questionText}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', borderRadius: '10px', padding: '8px 12px', fontSize: '0.75rem', marginBottom: '10px' }}>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>⏱️ Avg Time</div>
                      <div style={{ fontWeight: 800 }}>{activePopover.avgTime}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>📑 Test Score</div>
                      <div style={{ fontWeight: 800 }}>{activePopover.score}</div>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: activePopover.isCorrect ? '#ecfdf5' : '#fef2f2',
                      border: activePopover.isCorrect ? '1px solid #a7f3d0' : '1px solid #fecaca',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div style={{ color: activePopover.isCorrect ? '#065f46' : '#991b1b', fontWeight: 700, marginBottom: '2px' }}>
                      {activePopover.isCorrect ? '✔' : '✖'} {activePopover.learnerName} response:
                    </div>
                    <div style={{ color: activePopover.isCorrect ? '#047857' : '#b91c1c', fontWeight: 800 }}>
                      {activePopover.learnerResponse}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* QUESTIONS TAB: QUESTION BREAKDOWN (IMAGE 2 & 5)             */
          /* ============================================================ */
          <div>
            {/* Section Caption & Filters */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                ⓘ This Tab Shows the accumulated data of all learner attempts
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  All type <ChevronDown size={14} />
                </button>
                <button className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpDown size={14} /> Sort by
                </button>
              </div>
            </div>

            {/* Question Analytics Breakdown Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {questionsData.map((q) => (
                <div
                  key={q.id}
                  className="card"
                  style={{
                    padding: '1.75rem',
                    borderRadius: '20px',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(200px, 240px)',
                    gap: '2rem',
                    alignItems: 'start',
                  }}
                >
                  {/* Question & Option Distribution Bars */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                        ❓ {q.num}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                        ☑ {q.type}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        • Avg. time {q.avgTime}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700 }}>
                        • 🟡 {q.points}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.4 }}>
                      {q.question}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                            <span style={{ fontWeight: opt.isCorrect ? 700 : 500, color: opt.isCorrect ? '#10b981' : 'inherit' }}>
                              {opt.text} {opt.isCorrect && '✓'}
                            </span>
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem', flexShrink: 0, marginLeft: '8px' }}>
                              {opt.resp} resp. <strong>{opt.pct}%</strong>
                            </span>
                          </div>
                          <div className="quiz-resp-bar">
                            <div
                              className={opt.isCorrect ? 'quiz-resp-fill-correct' : 'quiz-resp-fill-incorrect'}
                              style={{ width: `${opt.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Question Statistics Card */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '1rem' }}>
                      Statistics
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Correct</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '1rem', color: '#10b981' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                          {q.stats.correct}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Incorrect</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '1rem', color: '#ef4444' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                          {q.stats.incorrect}
                        </div>
                      </div>

                      <div style={{ paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                        <DonutProgressRing
                          label="Accuracy"
                          percentage={q.stats.accuracy}
                          color="#06b6d4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Help Button */}
      <button
        onClick={() => showToast('Need help? Ask Trenning AI or review quiz scoring guidelines.', 'info')}
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

      {/* AI Modal */}
      {showAIModal && <AskAIModal onClose={() => setShowAIModal(false)} />}
    </div>
  );
};
