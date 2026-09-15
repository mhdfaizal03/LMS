import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TrenningIconRail } from '../../components/trenning/TrenningIconRail';
import { AskAIModal } from '../../components/trenning/AskAIModal';
import { useNotification } from '../../context/NotificationContext';
import {
  BookOpen, FileText, CheckSquare, Zap, Layers, Plus,
  TrendingUp, Clock, ChevronRight, CheckCircle2, AlertCircle,
  Flag, Award, Sparkles, HelpCircle, ArrowRight
} from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [todoInput, setTodoInput] = useState<string>('');
  const [todos, setTodos] = useState([
    { id: 1, text: 'Improve quiz for designers', tag: 'Tomorrow', color: '#ec4899', done: false },
    { id: 2, text: 'Create new assignment for HR', tag: 'HR division', color: '#0ea5e9', done: false },
    { id: 3, text: 'Create new quiz', tag: 'Today', color: '#f59e0b', done: false },
  ]);

  const [ungradedQuizzes, setUngradedQuizzes] = useState([
    { id: 1, title: 'How to be great and good UI/UX designer', questions: '4 open ended', learner: 'Adit Irwan' },
    { id: 2, title: 'Applications, tools, and plugins to make your workflow 10x faster', questions: '10 open ended', learner: 'Arif Brata' },
    { id: 3, title: 'Great designer must know the best for client design systems', questions: '3 open ended', learner: 'Ardhi Irwandi' },
  ]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoInput.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: todoInput, tag: 'Today', color: '#6366f1', done: false },
    ]);
    setTodoInput('');
    showToast('Task added to to-do list', 'success');
  };

  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleGradeNow = (item: any) => {
    navigate('/instructor/assignments');
    showToast(`Opening grading rubric for ${item.learner}`, 'info');
  };

  return (
    <div className="trenning-layout">
      {/* Icon Navigation Rail */}
      <TrenningIconRail
        activeTab="home"
        onOpenAI={() => setShowAIModal(true)}
      />

      {/* Main Studio Dashboard Content */}
      <main className="trenning-content-main" style={{ maxWidth: '1360px', margin: '0 auto' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'inherit' }}>
            Good morning, {user?.name ? user.name.split(' ')[0] : 'Bagus'} 👋
          </h1>
        </div>

        {/* Quick Create Buttons Row */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/instructor/courses/new')}
            className="btn"
            style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '12px', fontWeight: 700, fontSize: '0.8125rem', padding: '8px 14px' }}
          >
            <BookOpen size={15} /> Course +
          </button>
          <button
            onClick={() => navigate('/instructor/courses/new')}
            className="btn"
            style={{ backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '12px', fontWeight: 700, fontSize: '0.8125rem', padding: '8px 14px' }}
          >
            <FileText size={15} /> Page +
          </button>
          <button
            onClick={() => navigate('/instructor/courses/new')}
            className="btn"
            style={{ backgroundColor: '#ffedd5', color: '#c2410c', borderRadius: '12px', fontWeight: 700, fontSize: '0.8125rem', padding: '8px 14px' }}
          >
            <CheckSquare size={15} /> Assignment +
          </button>
          <button
            onClick={() => navigate('/instructor/courses/new')}
            className="btn"
            style={{ backgroundColor: '#ccfbf1', color: '#0f766e', borderRadius: '12px', fontWeight: 700, fontSize: '0.8125rem', padding: '8px 14px' }}
          >
            <Zap size={15} /> Quiz +
          </button>
          <button
            onClick={() => navigate('/instructor/courses/new')}
            className="btn"
            style={{ backgroundColor: '#fce7f3', color: '#be185d', borderRadius: '12px', fontWeight: 700, fontSize: '0.8125rem', padding: '8px 14px' }}
          >
            <Layers size={15} /> Learning Path +
          </button>
        </div>

        {/* 2-Column Main Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '1.5rem', alignItems: 'start', marginBottom: '1.5rem' }}>
          {/* Left Large Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Row 1: Most Issued Content + Assignment Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Most issued content */}
              <div className="card" style={{ padding: '1.25rem', borderRadius: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>Most issued content ⓘ</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>This week</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>How to be great UI/UX desig...</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                      ↗ +5 since last week
                    </div>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                    16 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8' }}>issues</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/instructor/courses')}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}
                >
                  See all issued contents <ChevronRight size={14} />
                </button>
              </div>

              {/* Assignment progress */}
              <div className="card" style={{ padding: '1.25rem', borderRadius: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>Assignment ⓘ</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>80 submitted</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>100 remaining</div>
                </div>
                {/* Progress bar */}
                <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#e2e8f0', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ width: '44%', height: '100%', backgroundColor: '#4338ca', borderRadius: '4px' }} />
                </div>
                <button
                  onClick={() => navigate('/instructor/assignments')}
                  style={{ background: 'transparent', border: 'none', color: '#ea580c', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  See all assignment <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Row 2: Learning Content Gauge + Top Learner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Learning Content Gauge Chart */}
              <div className="card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Learning Content ⓘ</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>By status ⌄</span>
                </div>

                {/* Semicircular Gauge */}
                <div className="gauge-chart-container">
                  <div className="gauge-chart-arc" />
                  <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 600 }}>Contents</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>140</div>
                  </div>
                </div>

                {/* Status Legend */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4338ca' }} /> Passed
                    </span>
                    <strong>84%</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} /> Failed
                    </span>
                    <strong>4%</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} /> Overdue
                    </span>
                    <strong>4%</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4' }} /> In Progress
                    </span>
                    <strong>4%</strong>
                  </div>
                </div>
              </div>

              {/* Top Learner Leaderboard */}
              <div className="card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Top Learner ⓘ</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { rank: '#1', name: 'Ifan Bagastian', role: 'Jr UI/UX Designer', pts: 100, color: '#f59e0b' },
                    { rank: '#2', name: 'Fauzan Ardhiansyah', role: 'Sr UI/UX Designer', pts: 80, color: '#94a3b8' },
                    { rank: '#3', name: 'Friza Dipa', role: 'Jr Animation', pts: 75, color: '#d97706' },
                  ].map((l, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.8125rem', color: l.color }}>{l.rank}</span>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem' }}>
                          👨‍🎓
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{l.name}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{l.role}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309' }}>🪙 {l.pts}pts</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => showToast('Viewing all leaderboard entries', 'info')}
                  style={{ background: 'transparent', border: 'none', color: '#4338ca', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', marginTop: '1.25rem', textAlign: 'left', display: 'block' }}
                >
                  View all ↗
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column: To-Do List & Upgrade Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* To Do List */}
            <div className="card" style={{ padding: '1.25rem', borderRadius: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>To Do List ⓘ</span>
              </div>

              {/* Add Todo Input */}
              <form onSubmit={handleAddTodo} style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="+ Add new task to do..."
                  value={todoInput}
                  onChange={(e) => setTodoInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.75rem',
                    outline: 'none',
                  }}
                />
              </form>

              {/* Todo items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {todos.map((todo) => (
                  <div key={todo.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => handleToggleTodo(todo.id)}
                      style={{ marginTop: '3px', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#94a3b8' : 'inherit' }}>
                        {todo.text} <Flag size={11} color={todo.color} fill={todo.color} style={{ display: 'inline' }} />
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>📅 {todo.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade to PRO Card */}
            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '18px',
                padding: '1.25rem',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#92400e', marginBottom: '2px' }}>
                Upgrade to PRO
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#78350f', marginBottom: '10px' }}>
                $140 <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#78350f', marginBottom: '1rem' }}>
                <div>✔ Intelligent content</div>
                <div>✔ Data-driven insight</div>
                <div>✔ Advanced search</div>
                <div>✔ And More</div>
              </div>

              <button
                onClick={() => showToast('PRO subscription activated!', 'success')}
                className="btn"
                style={{
                  width: '100%',
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)',
                }}
              >
                ⚡ Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Ungraded Quiz Queue Table */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ungraded Quiz ⓘ
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>Quiz Title</th>
                  <th>Questions</th>
                  <th>Learner</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {ungradedQuizzes.map((q, idx) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 700 }}>{idx + 1}</td>
                    <td style={{ fontWeight: 700 }}>{q.title}</td>
                    <td style={{ color: '#64748b' }}>❓ {q.questions}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem' }}>👨‍🎓</span>
                        <strong>{q.learner}</strong>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleGradeNow(q)}
                        className="btn btn-secondary btn-sm"
                        style={{ borderRadius: 'var(--radius-full)', fontWeight: 700 }}
                      >
                        Grade Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Floating Help Button */}
      <button
        onClick={() => showToast('Need help navigating the Trenning Studio? Ask Trenning AI!', 'info')}
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
