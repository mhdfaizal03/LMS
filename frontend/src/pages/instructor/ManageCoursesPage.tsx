import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api';
import { Course } from '../../types';
import { TrenningIconRail } from '../../components/trenning/TrenningIconRail';
import { TrenningSecondarySidebar } from '../../components/trenning/TrenningSecondarySidebar';
import { DonutProgressRing } from '../../components/trenning/DonutProgressRing';
import { AskAIModal } from '../../components/trenning/AskAIModal';
import { DiscussionTab } from '../../components/trenning/DiscussionTab';
import { LearnersProgressTab } from '../../components/trenning/LearnersProgressTab';
import { ReportIssuesTab } from '../../components/trenning/ReportIssuesTab';
import { useNotification } from '../../context/NotificationContext';
import {
  Upload, Plus, Search, Filter, ArrowUpDown, LayoutGrid, List,
  Users, UserPlus, MoreHorizontal, FileText, BookOpen, Layers,
  CheckCircle2, AlertCircle, X, Sparkles, Folder, HelpCircle,
  Globe, Clock, ChevronRight
} from 'lucide-react';

export const ManageCoursesPage: React.FC = () => {
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [pageContext, setPageContext] = useState<'studio' | 'page_discussion'>('page_discussion');
  const [pageSubTab, setPageSubTab] = useState<'details' | 'report' | 'discussion'>('discussion');
  const [activeContentTab, setActiveContentTab] = useState<'Folder' | 'Page' | 'Course' | 'Quiz' | 'Assignment' | 'Learning Path' | 'Wiki'>('Quiz');
  const [filterChip, setFilterChip] = useState<string | null>('Total Question: 5 or more');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('date');
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // Content Items
  const contentItems = [
    {
      id: 1,
      title: 'Mastering UI Design for Impactful Solutions',
      enrolled: 10,
      accuracy: 40,
      completion: 60,
      tags: ['UI/UX', 'Not Urgent'],
      edited: 'Edited 2h ago',
      questions: 10,
      type: 'Quiz',
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60',
      bgGradient: 'linear-gradient(135deg, #fed7aa, #fdba74)',
    },
    {
      id: 2,
      title: 'A Symphony of Colors in UI Design',
      enrolled: 21,
      accuracy: 20,
      completion: 80,
      tags: ['Instructional Design', 'Not Urgent'],
      edited: 'Edited 8h ago',
      questions: 15,
      type: 'Quiz',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
      bgGradient: 'linear-gradient(135deg, #bae6fd, #7dd3fc)',
    },
    {
      id: 3,
      title: 'Bridging Users and UI in Design Harmony',
      enrolled: 18,
      accuracy: 100,
      completion: 100,
      tags: ['Experience Design', 'Urgent'],
      edited: 'Edited 23h ago',
      questions: 25,
      type: 'Quiz',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
      bgGradient: 'linear-gradient(135deg, #c7d2fe, #a5b4fc)',
    },
    {
      id: 4,
      title: 'Creating Engaging Learning Journeys: UI/UX Best Practices',
      enrolled: 9,
      accuracy: 20,
      completion: 100,
      tags: ['UI/UX', 'Urgent'],
      edited: 'Edited 5d ago',
      questions: 30,
      type: 'Quiz',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      bgGradient: 'linear-gradient(135deg, #bbf7d0, #86efac)',
    },
    {
      id: 5,
      title: 'Designing Intuitive User Interfaces',
      enrolled: 12,
      accuracy: 80,
      completion: 80,
      tags: ['User Interface (UI)', 'Not Urgent'],
      edited: 'Edited 2d ago',
      questions: 15,
      type: 'Quiz',
      thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60',
      bgGradient: 'linear-gradient(135deg, #fef08a, #fde047)',
    },
    {
      id: 6,
      title: 'Optimizing User Experience in Educational Platforms',
      enrolled: 7,
      isDraft: true,
      accuracy: 0,
      completion: 0,
      tags: ['User Experience', 'Urgent'],
      edited: 'Edited 4d ago',
      questions: 25,
      type: 'Quiz',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60',
      bgGradient: 'linear-gradient(135deg, #ddd6fe, #c4b5fd)',
    },
  ];

  // Wiki Cards
  const wikiCards = [
    { id: 1, title: 'Visibility of system status', filesCount: 12, edited: 'Edited 2h ago' },
    { id: 2, title: 'Digital Product Mastery: Essential Course Notes', filesCount: 12, edited: 'Edited 2h ago' },
    { id: 3, title: 'Digital Product Design Essentials: A Deep Dive Course', filesCount: 12, edited: 'Edited 2h ago' },
    { id: 4, title: 'Lean Product Management & UX Principles', filesCount: 12, edited: 'Edited 2h ago' },
    { id: 5, title: 'Sustainable Tech: Environmental Considerations', filesCount: 12, edited: 'Edited 2h ago' },
    { id: 6, title: 'From Concept to Conversion: Course Notes', filesCount: 12, edited: 'Edited 2h ago' },
    { id: 7, title: 'Digital Product Marketing: Strategies for Success', filesCount: 12, edited: 'Edited 2h ago' },
    { id: 8, title: 'Code to Click: Front-End Developer Fundamentals', filesCount: 12, edited: 'Edited 2h ago' },
    { id: 9, title: 'Inclusive Design Principles: Ensuring Accessibility in UI', filesCount: 12, edited: 'Edited 2h ago' },
    { id: 10, title: 'The Art of Iteration: Continuous Improvement', filesCount: 12, edited: 'Edited 2h ago' },
  ];

  const filteredContent = contentItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="trenning-layout">
      {/* 1. ICON RAIL */}
      <TrenningIconRail
        activeTab="content"
        onOpenAI={() => setShowAIModal(true)}
      />

      {/* 2. SECONDARY SIDEBAR */}
      <TrenningSecondarySidebar
        activeProject="Fikri studio"
        onOpenAI={() => setShowAIModal(true)}
      />

      {/* 3. MAIN STUDIO AREA */}
      <main className="trenning-content-main" style={{ position: 'relative' }}>
        {pageContext === 'page_discussion' ? (
          /* ============================================================ */
          /* GENERAL KNOWLEDGE & METHODOLOGY: DISCUSSION / DETAILS (IMAGE 1) */
          /* ============================================================ */
          <div>
            {/* Top Bar for Page Discussion View */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'inherit', marginBottom: '6px' }}>
                  General Knowledge & Methodology
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem', color: '#64748b' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    📄 Page
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={14} /> English
                  </span>
                  <span>•</span>
                  <span>Edited 28 Sep 2023</span>
                </div>
              </div>

              {/* View toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setPageContext('studio')}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 'var(--radius-full)', fontWeight: 600 }}
                >
                  Switch to Studio Grid ↗
                </button>
              </div>
            </div>

            {/* Subtabs: Details Content | Report Issue | Discussion (12) */}
            <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '2px solid #f1f5f9', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setPageSubTab('details')}
                className={`trenning-tab ${pageSubTab === 'details' ? 'active' : ''}`}
              >
                Details Content
              </button>
              <button
                onClick={() => setPageSubTab('report')}
                className={`trenning-tab ${pageSubTab === 'report' ? 'active' : ''}`}
              >
                Report Issues <span className="badge badge-secondary" style={{ marginLeft: '4px', fontSize: '0.6875rem' }}>120</span>
              </button>
              <button
                onClick={() => setPageSubTab('discussion')}
                className={`trenning-tab ${pageSubTab === 'discussion' ? 'active' : ''}`}
              >
                Discussion <span className="badge badge-secondary" style={{ marginLeft: '4px', fontSize: '0.6875rem' }}>12</span>
              </button>
            </div>

            {pageSubTab === 'discussion' ? (
              <DiscussionTab />
            ) : pageSubTab === 'details' ? (
              <LearnersProgressTab />
            ) : (
              <ReportIssuesTab />
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* FIKRI STUDIO HUB (SCREEN 1 & 3)                             */
          /* ============================================================ */
          <div>
            {/* Top Studio Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              {/* Studio Name & Member Stack */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#fce7f3',
                    color: '#ec4899',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                  }}
                >
                  🎨
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'inherit' }}>
                  Fikri Studio
                </h1>

                {/* Member avatar chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '-6px', marginLeft: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fef08a', color: '#854d0e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 800, border: '2px solid #ffffff' }}>
                    RF
                  </div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', border: '2px solid #ffffff' }}>
                    👩‍🎨
                  </div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', border: '2px solid #ffffff' }}>
                    👨‍💻
                  </div>
                  <button
                    onClick={() => showToast('Invite member link copied!', 'success')}
                    className="btn-icon"
                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px dashed #cbd5e1', padding: 0 }}
                    title="Invite Members"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Top Right Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setPageContext('page_discussion')}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 'var(--radius-full)', fontWeight: 600 }}
                >
                  Discussion Feed (12)
                </button>
                <button
                  onClick={() => showToast('Upload modal opened', 'info')}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-md)' }}
                >
                  <Upload size={16} /> Upload
                </button>
                <button
                  onClick={() => navigate('/instructor/courses/new')}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#4338ca',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                  }}
                >
                  <Plus size={16} /> New Content
                </button>
              </div>
            </div>

            {/* Content Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #f1f5f9', marginBottom: '1.5rem', overflowX: 'auto' }}>
              {(['Folder', 'Page', 'Course', 'Quiz', 'Assignment', 'Learning Path', 'Wiki'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveContentTab(tab);
                    if (tab === 'Page') {
                      setPageContext('page_discussion');
                    }
                  }}
                  className={`trenning-tab ${activeContentTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              {/* Filter Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {filterChip && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#e0e7ff',
                      color: '#4338ca',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 12px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                    }}
                  >
                    {filterChip}
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => setFilterChip(null)} />
                  </span>
                )}
                {filterChip && (
                  <button
                    onClick={() => setFilterChip(null)}
                    style={{ background: 'transparent', border: 'none', color: '#4338ca', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={() => showToast('Filter options', 'info')}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8125rem' }}
                >
                  <Filter size={14} /> Add Filter
                </button>
              </div>

              {/* Right: Search, Sort & View Mode */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748b' }}>
                  {activeContentTab === 'Wiki' ? `${wikiCards.length} content` : `${filteredContent.length} content`}
                </span>

                {/* Search */}
                <div style={{ position: 'relative' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '9px', left: '10px' }} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: '6px 12px 6px 32px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.8125rem',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>

                {/* Sort */}
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <ArrowUpDown size={14} /> Date Created
                </button>

                {/* View Mode */}
                <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
                    style={{ width: '28px', height: '28px', padding: 0, backgroundColor: viewMode === 'grid' ? '#ffffff' : 'transparent', borderRadius: '6px' }}
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
                    style={{ width: '28px', height: '28px', padding: 0, backgroundColor: viewMode === 'list' ? '#ffffff' : 'transparent', borderRadius: '6px' }}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

        {/* ============================================================ */}
        {/* WIKI TAB VIEW (SCREEN 3)                                    */}
        {/* ============================================================ */}
        {activeContentTab === 'Wiki' ? (
          <div className="grid-3" style={{ gap: '1.25rem' }}>
            {wikiCards.map((wiki) => (
              <div
                key={wiki.id}
                className="card card-hover"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '160px',
                  borderRadius: '16px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1.4, marginBottom: '8px' }}>
                    {wiki.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#64748b' }}>
                    <Folder size={14} /> {wiki.filesCount} Files
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{wiki.edited}</span>
                  <button className="btn-icon" style={{ width: '28px', height: '28px' }}>
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ============================================================ */
          /* QUIZ / CONTENT CARDS GRID (SCREEN 1)                        */
          /* ============================================================ */
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="trenning-card"
                onClick={() => navigate('/instructor/analytics')}
                style={{ cursor: 'pointer' }}
              >
                {/* Thumbnail Header with Enrolled Badge */}
                <div
                  className="trenning-card-thumbnail"
                  style={{ background: item.bgGradient }}
                >
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    <span
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        color: '#ffffff',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {item.enrolled} Enrolled 📑
                    </span>
                    {item.isDraft && (
                      <span
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.9)',
                          color: '#ffffff',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        • Draft
                      </span>
                    )}
                  </div>

                  {/* Isometric Graphic Elements */}
                  <div style={{ fontSize: '3.5rem', opacity: 0.9 }}>
                    📊
                  </div>
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      lineHeight: 1.4,
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '2.8em',
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Donut Progress Indicators */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <DonutProgressRing
                      label="Accuracy"
                      percentage={item.accuracy}
                      color={item.accuracy >= 70 ? '#10b981' : item.accuracy >= 40 ? '#06b6d4' : '#ef4444'}
                    />
                    <DonutProgressRing
                      label="Completion Rate"
                      percentage={item.completion}
                      color="#06b6d4"
                    />
                  </div>

                  {/* Category Tags */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast('Assign user to quiz', 'info');
                      }}
                      className="btn-icon"
                      style={{ marginLeft: 'auto', width: '24px', height: '24px', padding: 0 }}
                      title="Assign Learner"
                    >
                      <UserPlus size={14} />
                    </button>
                  </div>

                  {/* Card Bottom Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: 'auto' }}>
                    <div>
                      {item.edited} &bull; 🗲 {item.questions} Question
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast('Opened quiz options', 'info');
                      }}
                      className="btn-icon"
                      style={{ width: '24px', height: '24px', padding: 0 }}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </div>
        )}

        {/* Floating Help Button (Bottom-Right, as in reference screens) */}
        <button
          onClick={() => showToast('Need help? Ask Trenning AI or browse documentation guides.', 'info')}
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
      </main>

      {/* AI Assistant Modal */}
      {showAIModal && <AskAIModal onClose={() => setShowAIModal(false)} />}
    </div>
  );
};
