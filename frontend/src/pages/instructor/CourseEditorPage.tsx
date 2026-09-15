import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import {
  ArrowLeft, Cloud, Settings, Play, Plus, Sparkles, Send,
  Layers, Check, Copy, CornerDownLeft, ChevronLeft, ChevronRight,
  Trash2, RefreshCw, ZoomIn, HelpCircle, Edit3, MoreHorizontal
} from 'lucide-react';

export const CourseEditorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [activeChapterId, setActiveChapterId] = useState<number>(1);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [showAiMenu, setShowAiMenu] = useState<boolean>(true);
  const [documentContent, setDocumentContent] = useState<string>(
    `Crafting a style direction is an essential aspect of design and branding that demands careful consideration and meticulous planning. At its core, this directive should be a mirror reflecting the aspirations and objectives of your brand or application. It encapsulates the very essence of your entity, conveying its purpose, identity, and values to your audience. Whether you seek to project professionalism, creativity, or approachability, the style direction acts as the visual language through which your brand communicates, creating a cohesive and memorable digital presence.\n\nMoreover, the art of blending aesthetics with functionality is central to a style direction's success. A visually appealing interface that lacks usability can deter users, while an overly functional but visually unappealing one may fail to capture their attention. Striking the right equilibrium between these two aspects is vital, creating an interface that not only looks attractive but also facilitates seamless user interactions.`
  );

  const [aiSelectionText, setAiSelectionText] = useState<string>(
    `Crafting a style direction is an essential aspect of design and branding that demands careful consideration and meticulous planning. At its core, this directive should be a mirror reflecting the aspirations and objectives of your brand or application. It encapsulates the very essence of your entity, conveying its purpose, identity, and values to your audience. Whether you seek to project professionalism, creativity, or approachability, the style direction acts as the visual language.`
  );

  const chapters = [
    {
      id: 1,
      num: '1',
      title: 'Component of Design',
      meta: '▶ 1 • 📑 1 • 🗲 1',
      avatars: ['👨‍🎨', 'RF'],
      isActive: true,
    },
    {
      id: 2,
      num: '2',
      title: 'Style Directions Samples',
      meta: '📑 2 materials',
      avatars: ['PA'],
      isActive: false,
    },
  ];

  const handleAiAction = (action: string) => {
    switch (action) {
      case 'replace':
        showToast('AI replaced selected text with optimized phrasing', 'success');
        break;
      case 'insert':
        showToast('AI inserted generated section below', 'success');
        break;
      case 'continue':
        setAiSelectionText((prev) => prev + " Furthermore, typography, color palettes, and micro-interactions reinforce brand affinity across every touchpoint.");
        showToast('AI continued writing paragraph', 'success');
        break;
      case 'longer':
        setAiSelectionText((prev) => prev + " This comprehensive guide establishes clear design principles, layout grids, spacing scales, and responsive behaviors tailored for global audiences.");
        showToast('AI expanded the content', 'success');
        break;
      case 'simplify':
        setAiSelectionText("Style direction defines how your brand looks and feels. Balancing visual aesthetics and user-friendly functionality is key to great design.");
        showToast('AI simplified selected paragraph', 'info');
        break;
      case 'retry':
        showToast('AI regenerated variation', 'info');
        break;
      case 'discard':
        setShowAiMenu(false);
        showToast('Discarded AI prompt', 'info');
        break;
    }
  };

  const handlePublish = () => {
    showToast('🎉 Course published live successfully!', 'success');
    navigate('/instructor/courses');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)', backgroundColor: '#ffffff' }}>
      {/* 1. TOP EDITOR BAR (IMAGE 5) */}
      <header
        style={{
          height: '60px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          backgroundColor: '#ffffff',
          zIndex: 20,
        }}
      >
        {/* Left: Back & Document Breadcrumb Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/instructor/courses')}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Edited 21 Juni 2023</span>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.9375rem' }}>
            <span style={{ color: '#64748b' }}>General Knowledge... /</span>
            <span>📄 To be a Excellent Design</span>
            <Cloud size={14} color="#06b6d4" />
          </div>
        </div>

        {/* Right: Collaborators, Preview & Publish */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Collaborator avatar stack */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '-4px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fef08a', color: '#854d0e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 800, border: '2px solid #ffffff' }}>
              RF
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 800, border: '2px solid #ffffff' }}>
              PA
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', border: '2px solid #ffffff' }}>
              👨‍🎨
            </div>
            <button className="btn-icon" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px dashed #cbd5e1', padding: 0 }}>
              <Plus size={14} />
            </button>
          </div>

          <button className="btn-icon" style={{ width: '32px', height: '32px' }} title="Settings">
            <Settings size={16} />
          </button>

          <button
            onClick={() => showToast('Entering learner preview mode', 'info')}
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

      {/* 2. SPLIT LAYOUT: CHAPTERS NAV + DOCUMENT EDITOR */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Navigation: Pages & Chapters */}
        <aside
          style={{
            width: '240px',
            borderRight: '1px solid #f1f5f9',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            backgroundColor: '#fafbfc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>PAGES</span>
            <button
              onClick={() => showToast('Add section prompt', 'info')}
              style={{ background: 'transparent', border: 'none', color: '#4338ca', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Add section
            </button>
          </div>

          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, marginBottom: '4px' }}>Design Introduction</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
              <span>2 CHAPTERS</span>
              <button className="btn-icon" style={{ width: '18px', height: '18px', padding: 0 }}><Plus size={12} /></button>
            </div>

            {/* Chapters list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => setActiveChapterId(ch.id)}
                  style={{
                    backgroundColor: activeChapterId === ch.id ? '#ffffff' : 'transparent',
                    border: activeChapterId === ch.id ? '1px solid #e2e8f0' : '1px solid transparent',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    boxShadow: activeChapterId === ch.id ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>{ch.num}</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{ch.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#94a3b8' }}>
                    <span>{ch.meta}</span>
                    <div style={{ display: 'flex', gap: '-2px' }}>
                      {ch.avatars.map((a, idx) => (
                        <span key={idx} style={{ fontSize: '0.6875rem' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Editor Area */}
        <main style={{ flex: 1, padding: '2.5rem 3.5rem', overflowY: 'auto' }}>
          {/* Document Title & Formatting Toolbar (Image 1) */}
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
              Ebook, Font & other Recommendation
            </h1>

            {/* Rich Text Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '1.75rem' }}>
              <button className="btn-icon" style={{ width: '28px', height: '28px', fontWeight: 800 }}>B</button>
              <button className="btn-icon" style={{ width: '28px', height: '28px', fontStyle: 'italic' }}>I</button>
              <button className="btn-icon" style={{ width: '28px', height: '28px', textDecoration: 'underline' }}>U</button>
              <button className="btn-icon" style={{ width: '28px', height: '28px', textDecoration: 'line-through' }}>S</button>
              <span style={{ width: '1px', height: '16px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />
              <button className="btn-icon" style={{ width: '28px', height: '28px' }}>≡</button>
            </div>

            {/* Document Content */}
            <div style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: '#1e293b' }}>
              <p style={{ fontWeight: 800, marginBottom: '8px' }}>Good ebook:</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>The Shape of Design.Pdf</li>
                <li>Jobs to be Done.Pdf</li>
                <li>Designing for the Web.Pdf</li>
              </ul>

              <p style={{ fontWeight: 800, marginBottom: '4px' }}>Good google font recommendation:</p>
              <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
                You can also search download form <a href="https://fonts.google.com/" target="_blank" rel="noreferrer" style={{ color: '#4f46e5', textDecoration: 'underline' }}>https://fonts.google.com/</a><br />
                <strong>Google_font_recommendation.Zip</strong> - in attachment
              </p>

              <p style={{ fontWeight: 800, marginBottom: '4px' }}>Good video tips & trick:</p>
              <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
                The Perfect Spacing Framework in UI Design <a href="https://www.youtube.com/watch?v=Al1xsdol4Pk" target="_blank" rel="noreferrer" style={{ color: '#4f46e5', textDecoration: 'underline' }}>https://www.youtube.com/watch?v=Al1xsdol4Pk</a><br />
                <strong>Spacing Simple Trick</strong> - video in attachment
              </p>

              <p style={{ fontWeight: 800, marginBottom: '4px' }}>UI Library</p>
              <p style={{ color: '#475569' }}>
                <strong>Ant Design System</strong> - file in attachment
              </p>
            </div>

            {/* AI Command Toolbar below */}
            <div className="ai-editor-prompt-bar" style={{ marginTop: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <Sparkles size={16} color="#6366f1" />
                <input
                  type="text"
                  placeholder="Tell AI what to do next..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAiAction('continue');
                    }
                  }}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.8125rem',
                    color: '#0f172a',
                    fontWeight: 500,
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.75rem' }}>
                <div style={{ backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '4px', padding: '2px 6px', fontWeight: 700 }}>
                  ⏎
                </div>
                <span>&lt; 1 of 2 &gt;</span>
              </div>
            </div>
          </div>
        </main>

        {/* Right Attachment File Panel (Image 1) */}
        <aside
          style={{
            width: '320px',
            borderLeft: '1px solid #f1f5f9',
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
            Attachment File
          </div>

          {/* Action buttons: Upload File & Import Drive */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => showToast('Select file to upload', 'info')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '8px', fontSize: '0.8125rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
            >
              <span>⬆️</span> Upload a File
            </button>
            <button
              onClick={() => showToast('Connecting to Google Drive...', 'info')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '8px', fontSize: '0.8125rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
            >
              <span>🔺</span> Import from Drive
            </button>
          </div>

          {/* Attachments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* File 1: PDF Completed */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#fafbfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem' }}>📄</span>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>The Shape of Design.Pdf</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>3.2mb</div>
                </div>
              </div>
              <button className="btn-icon" style={{ width: '24px', height: '24px', padding: 0 }}><MoreHorizontal size={14} /></button>
            </div>

            {/* File 2: PDF Progress 67% */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#fafbfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #e2e8f0', borderTopColor: '#06b6d4', animation: 'spin 1s linear infinite' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Jobs to be Done.Pdf</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>10.2mb - 67%</div>
                </div>
              </div>
              <button className="btn-icon" style={{ width: '24px', height: '24px', padding: 0 }}><Trash2 size={12} color="#94a3b8" /></button>
            </div>

            {/* File 3: PDF Progress 89% */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#fafbfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #e2e8f0', borderTopColor: '#06b6d4', animation: 'spin 1s linear infinite' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Designing for the Web.Pdf</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>5.8mb - 89%</div>
                </div>
              </div>
              <button className="btn-icon" style={{ width: '24px', height: '24px', padding: 0 }}><Trash2 size={12} color="#94a3b8" /></button>
            </div>

            {/* File 4: Zip Completed */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#fafbfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem' }}>🗜️</span>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Google_font_recommendati... .zip</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>397.3kb</div>
                </div>
              </div>
              <button className="btn-icon" style={{ width: '24px', height: '24px', padding: 0 }}><MoreHorizontal size={14} /></button>
            </div>

            {/* File 5: MP4 Progress 4% */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#fafbfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #e2e8f0', borderTopColor: '#06b6d4', animation: 'spin 1s linear infinite' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Spacing simple trick.mp4</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>129.3mb - 4%</div>
                </div>
              </div>
              <button className="btn-icon" style={{ width: '24px', height: '24px', padding: 0 }}><Trash2 size={12} color="#94a3b8" /></button>
            </div>

            {/* File 6: Figma Progress 5% */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#fafbfc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #e2e8f0', borderTopColor: '#06b6d4', animation: 'spin 1s linear infinite' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Ant Design System.fig</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>129.3mb - 5%</div>
                </div>
              </div>
              <button className="btn-icon" style={{ width: '24px', height: '24px', padding: 0 }}><Trash2 size={12} color="#94a3b8" /></button>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Help Button */}
      <button
        onClick={() => showToast('Need help with AI editor commands? Type / or select text.', 'info')}
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
