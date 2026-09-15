import React, { useState } from 'react';
import {
  Clock, Share2, Archive, LayoutTemplate, ChevronDown,
  Plus, Sparkles, Folder, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';

interface TrenningSecondarySidebarProps {
  activeProject?: string;
  onSelectProject?: (proj: string) => void;
  onOpenAI?: () => void;
}

export const TrenningSecondarySidebar: React.FC<TrenningSecondarySidebarProps> = ({
  activeProject = 'Fikri studio',
  onSelectProject,
  onOpenAI,
}) => {
  const [favoritesOpen, setFavoritesOpen] = useState<boolean>(true);

  return (
    <aside className="trenning-secondary-sidebar">
      {/* Sidebar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'inherit' }}>
          Learning Content
        </h2>
        <button className="btn-icon" style={{ width: '28px', height: '28px' }} title="Collapse panel">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Standard Menu Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button className="lecture-nav-link" style={{ padding: '8px 10px', fontSize: '0.875rem' }}>
          <Clock size={16} color="#64748b" />
          <span>Recents</span>
        </button>

        <button className="lecture-nav-link" style={{ padding: '8px 10px', fontSize: '0.875rem' }}>
          <Share2 size={16} color="#64748b" />
          <span>Shared Content</span>
        </button>

        <button className="lecture-nav-link" style={{ padding: '8px 10px', fontSize: '0.875rem' }}>
          <Archive size={16} color="#64748b" />
          <span>Archived</span>
        </button>

        <button className="lecture-nav-link" style={{ padding: '8px 10px', fontSize: '0.875rem' }}>
          <LayoutTemplate size={16} color="#64748b" />
          <span>Templates</span>
        </button>
      </nav>

      {/* Favorites Section */}
      <div>
        <div
          onClick={() => setFavoritesOpen(!favoritesOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Favorites</span>
            <span className="badge badge-secondary" style={{ fontSize: '0.6875rem', padding: '1px 6px' }}>3</span>
          </div>
          <ChevronDown size={14} style={{ transform: favoritesOpen ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
        </div>

        {favoritesOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }} className="card-hover">
              <span style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: '#06b6d4', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem' }}>🎨</span>
              <span>Figma Basic</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }} className="card-hover">
              <span style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem' }}>📁</span>
              <span>Folder NEW 2024</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }} className="card-hover">
              <span style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: '#8b5cf6', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem' }}>📝</span>
              <span>Assignment 101</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }} className="card-hover">
              <span style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: '#f59e0b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem' }}>⚡</span>
              <span>Quiz Figma</span>
            </div>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Projects</span>
            <span className="badge badge-secondary" style={{ fontSize: '0.6875rem', padding: '1px 6px' }}>2</span>
          </div>
          <button className="btn-icon" style={{ width: '20px', height: '20px', padding: 0 }}>
            <Plus size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
          <div
            onClick={() => onSelectProject?.('Figma basic')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: activeProject === 'Figma basic' ? 700 : 500,
              backgroundColor: activeProject === 'Figma basic' ? 'var(--bg-tertiary)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366f1' }} />
            <span>Figma basic</span>
          </div>

          <div
            onClick={() => onSelectProject?.('Fikri studio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: activeProject === 'Fikri studio' ? 700 : 500,
              backgroundColor: activeProject === 'Fikri studio' ? 'var(--bg-tertiary)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ec4899' }} />
            <span>Fikri studio</span>
          </div>
        </div>
      </div>

      {/* Get Trenning AI Card at Bottom */}
      <div
        style={{
          marginTop: 'auto',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
            color: '#4338ca',
          }}
        >
          <Sparkles size={18} />
        </div>
        <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0f172a' }}>
          Get Trenning AI
        </div>
        <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '4px', lineHeight: 1.3 }}>
          Use AI in every action on Trenning webapp
        </div>
        <button
          onClick={() => onOpenAI?.()}
          className="btn btn-secondary btn-sm"
          style={{
            width: '100%',
            marginTop: '10px',
            fontSize: '0.75rem',
            padding: '4px 8px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
          }}
        >
          Try it now ↗
        </button>
      </div>
    </aside>
  );
};
